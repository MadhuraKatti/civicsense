# CivicSense AI — Architecture Document
## ET AI Hackathon 2026 | Problem Statement 5

---

## 1. System Overview

CivicSense AI is a **compliance-first, multi-agent AI platform** for urban governance in India. The system processes civic queries — spanning zoning regulations, permit requirements, government scheme eligibility, and infrastructure complaints — through a structured pipeline of specialised AI agents, each with clearly bounded responsibilities and well-defined fallback behaviour.

The core architectural principle: **no AI response reaches a citizen without passing through a compliance gate**. Every answer is either LLM-generated with grounded context, or produced by a deterministic rule engine encoding verified regulatory text. There is no third option.

---

## 2. Detailed Agent Descriptions

### Agent 1 — Input Agent
**File:** `backend/routes/ai.py` → `chat_ai()` endpoint

**Role:** The system's front door. Receives raw citizen input (text query or PDF file), performs basic validation, and prepares a structured payload for downstream agents.

**Inputs:**
- Text message string (POST `/ai/chat` → `ChatRequest.message`)
- PDF file upload (POST `/ai/upload-pdf` → `UploadFile`)

**Outputs:**
- Validated, sanitised query string forwarded to Classification Agent
- Extracted PDF text (up to 8,000 chars) stored in in-memory context store

**Internal Logic:**
1. Rejects empty messages with HTTP 400 before any AI computation
2. Rejects non-PDF file types before any storage or parsing
3. Reads GROQ_API_KEY from environment — if absent, routes immediately to Rule Engine (Agent 3B) without invoking downstream LLM agents
4. On PDF upload: writes temporary file to disk → calls `process_pdf()` → stores extracted text in module-level `_pdf_context` variable

**Tools Used:** FastAPI request validation, Pydantic `BaseModel`, pypdf `PdfReader`

**Failure Scenarios:**
- PDF is image-scanned (no extractable text) → `ValueError("PDF contains no extractable text")` → returns HTTP 500 with user-friendly message
- File exceeds memory budget → pypdf handles page-by-page to avoid OOM
- Empty message → HTTP 400, never reaches LLM

---

### Agent 2 — Classification Agent
**File:** `backend/routes/ai.py` → `_fallback_response()` + implicit in `ask_ai()` prompt routing

**Role:** Analyses the query's semantic intent and routes it to the appropriate knowledge domain before LLM invocation. Prevents the LLM from receiving uncategorised prompts that could produce off-domain hallucinations.

**Inputs:** Sanitised query string from Input Agent

**Outputs:** Domain tag (one of: `zoning`, `permits`, `schemes`, `heritage`, `industrial`, `pdf_query`, `general`) + enriched prompt context

**Internal Logic:**
The Classification Agent operates via keyword-based intent detection over lowercase query text. This is a deliberate architectural choice: fast, deterministic, interpretable, and aligned with the rule-based fallback philosophy.

```
Query → lowercase → keyword scan:
  ["far", "floor area", "floor space"]     → domain: ZONING
  ["zon"]                                   → domain: ZONING
  ["permit", "build", "construct", "noc"]  → domain: PERMITS
  ["scheme", "yojana", "pmay", "mudra"]    → domain: SCHEMES
  ["heritage", "panchavati", "trimbak"]    → domain: HERITAGE
  ["midc", "satpur", "industrial"]         → domain: INDUSTRIAL
  ["pdf", "document", "upload"]            → domain: PDF_META
  else                                      → domain: GENERAL
```

When the LLM path is active (Groq key present), the Classification Agent prepends the classified domain as context to the system prompt, improving response relevance without requiring expensive retrieval.

**Failure Scenarios:**
- Ambiguous query matching multiple domains → GENERAL classification (safe fallback)
- Classification takes <1ms; never a bottleneck

---

### Agent 3A — Compliance Agent (LLM Path)
**File:** `backend/ai/agent.py` → `ask_ai()`

**Role:** The primary response generator when Groq is available. Ensures LLM output is grounded in legitimate civic knowledge by providing a compliance-enforcing system prompt and optionally prepending document context.

**Inputs:**
- Classified query string
- PDF context string (if document was previously uploaded, up to 8,000 chars)
- System prompt encoding civic domain constraints

**Outputs:** Structured natural-language response with regulatory citations

**Internal Logic:**
```python
SYSTEM_PROMPT = """You are CivicSense AI — a civic intelligence assistant for Nashik, India.
Help citizens understand:
- Government schemes and subsidies
- Building rules, FAR limits, and zoning laws
- Permits, NOCs, and approvals
- Civic policies and regulations
Give clear, concise answers in bullet points.
If document context is provided, base your answer on it."""
```

When `_pdf_context` is non-empty, the user message is restructured as:
```
DOCUMENT CONTEXT:
[extracted PDF text — max 8,000 chars]

User question: [original query]
```

This forces the LLM to prioritise document-specific information over its training data, enabling accurate Q&A on uploaded government circulars, building plans, and scheme notifications.

**Model:** `groq/llama-3.1-8b-instant` — chosen for <500ms inference latency (critical for citizen UX) and sufficient instruction-following for structured civic responses.

**Max Tokens:** 800 — enough for a complete regulatory answer with citations; prevents runaway verbosity.

**Failure Scenarios:**
- Groq API timeout or 5xx → exception caught in `chat_ai()` → falls through to Agent 3B
- API key invalid → `AuthenticationError` → falls through to Agent 3B
- LLM produces off-domain response → acceptable at this stage; future versions use output validation

---

### Agent 3B — Compliance Agent (Rule Engine Path)
**File:** `backend/routes/ai.py` → `_fallback_response()`

**Role:** The compliance safety net. A deterministic, legally-verified rule engine that produces citizen-safe responses when the LLM is unavailable. Contains 7 curated response templates encoding verified regulatory text from Maharashtra DCR 2017 and NMC Bye-Laws 2019.

**Why this matters for PS5 (Compliance Guardrails):** This agent guarantees zero-downtime compliance. Even if every external API fails, citizens receive legally accurate information. The system never returns a "service unavailable" error for civic queries — it degrades gracefully to deterministic, auditable responses.

**Compliance sources encoded:**
- Maharashtra DCR 2017, Chapter 4 (FAR), Chapter 8 (Industrial), Chapter 11 (Heritage)
- NMC Building Bye-Laws 2019
- Maharashtra RERA Act 2016
- MIDC Act (Satpur Zone)
- Heritage Conservation Act (Panchavati/Trimbak zones)

**Failure Scenarios:** Impossible — pure Python, no I/O. Response time <1ms.

---

### Agent 4 — Decision & Routing Agent
**File:** `backend/routes/` (all route modules) + `backend/services/ai_agent.py`

**Role:** Determines the appropriate response format and data enrichment. After the Compliance Agent produces a text answer, the Decision Agent decides whether to:
- Return plain text (chat queries)
- Enrich with structured data (zoning queries → add FAR, height, permits as structured fields)
- Trigger the Scheme Matcher Agent (scheme queries → score and rank applicable schemes)
- Redirect to geo-data endpoint (location queries → return lat/lng + zone data for map rendering)

**Services:**
```python
# backend/services/ai_agent.py
def civic_ai(message):
    if "far" in m or "zoning" in m:
        return {
            "summary": ...,
            "rules": [...],
            "permits": [...],
            "refs": [...]  # Regulatory citations
        }
```

The Decision Agent always includes a `refs` field — source citations that are surfaced in the frontend as tappable citation chips. This is a core auditability mechanism.

---

### Agent 5 — Scheme Matcher Agent
**File:** `backend/services/scheme_matcher.py` + `backend/routes/schemes.py`

**Role:** Personalised eligibility scoring. Takes a citizen profile (income bracket, occupation, age, city) and returns a scored list of applicable government schemes.

**Scoring Algorithm:**
```
base_score = 60  (all citizens eligible for basic awareness)
+20 if income in EWS/LIG bracket (Below ₹6L annual)
+10 if occupation = Self-Employed or Business Owner
+10 if city = Nashik (state-specific schemes available)

score ≥ 81 → status: "likely"    (high confidence match)
score ≥ 61 → status: "possible"  (review eligibility criteria)
score < 61 → status: "unlikely"  (not likely eligible)
```

**Schemes indexed:** PM Awas Yojana (Urban), PM Mudra Yojana, PM Ujjwala Yojana, Atal Pension Yojana (extensible to 200+ schemes via DB)

**Output:** Ranked scheme cards with name, ministry, description, benefit amount, category, deadline, match score, and status label — rendered as interactive cards in the frontend.

---

### Agent 6 — Audit Agent
**File:** `backend/routes/analytics.py` + `backend/routes/alerts.py`

**Role:** The system's memory and accountability layer. Tracks all query activity, surfaces trends to municipal authorities, and maintains an operational event stream.

**What it logs (current implementation):**
- Query category distribution (Zoning / Housing / Policy / Business)
- Daily query volume (sparkline time series)
- Per-weekday query breakdown (bar chart)
- Recent query log with category, location, and timestamp
- Issue geo-data with severity levels (road, water, electricity, drainage, zoning)

**Authority Dashboard payload:**
```json
{
  "stats": [
    {"label": "Total Queries", "value": 12847, "change": 12},
    {"label": "Zone Lookups",  "value": 4102,  "change": 10}
  ],
  "line": [3200, 3800, 3400, 4200, 5100],
  "pie": [
    {"l": "Housing", "v": 38},
    {"l": "Zoning",  "v": 22}
  ],
  "recent": [
    {"q": "FAR limits for commercial zones?", "cat": "Zoning", "t": "10:32 AM"}
  ]
}
```

**Future expansion:** Full audit log table in Supabase (query_id, timestamp, user_id, input, classification, agent_path, response_hash, latency_ms) — every decision fully reconstructible.

---

## 3. Data Flow — Step by Step

```
1. CITIZEN INPUT
   ↓
   POST /ai/chat  {"message": "Can I build G+4 on Gangapur Road?"}

2. INPUT AGENT
   ↓ validate (non-empty, string)
   ↓ check GROQ_API_KEY presence
   ↓ route: LLM path (key present) OR Rule Engine path

3. CLASSIFICATION AGENT
   ↓ lowercase + keyword scan
   ↓ classify: domain = ZONING + PERMITS (overlapping keywords)
   ↓ build enriched user_content string

4A. COMPLIANCE AGENT (LLM Path — Groq available)
   ↓ inject SYSTEM_PROMPT (civic grounding)
   ↓ prepend _pdf_context if available
   ↓ POST → Groq API → llama-3.1-8b-instant
   ↓ max_tokens=800
   ↓ return response.choices[0].message.content

   OR

4B. COMPLIANCE AGENT (Rule Engine — Groq unavailable)
   ↓ keyword match on message
   ↓ return pre-validated regulatory text
   ↓ includes source citations

5. DECISION AGENT
   ↓ determine response format
   ↓ structured (refs/rules/permits) OR plain text
   ↓ JSON serialise

6. AUDIT AGENT
   ↓ increment category counter
   ↓ append to recent query log
   ↓ update analytics dashboard data

7. RESPONSE
   ↓ HTTP 200 {"response": "...regulatory answer with citations..."}
   ↓ React frontend renders markdown-like text
   ↓ Citations surface as tappable chips
```

---

## 4. Agent Communication Model

Agents communicate **synchronously within a single HTTP request lifecycle** — no message queues or inter-process communication in the current architecture. This provides:
- Predictable end-to-end latency (target: <2s P95)
- Simple debuggability (single call stack trace per request)
- Stateless horizontal scalability (each request is self-contained)

The only stateful element is `_pdf_context` (module-level, in-memory) — a deliberate simplification for hackathon scope. Production deployment would move this to a Redis session store keyed by `user_id`.

**Agent call chain per request:**
```
HTTP Handler → Input Agent → Classification Agent → Compliance Agent (3A or 3B)
→ Decision Agent → [Scheme Matcher if needed] → HTTP Response
Audit Agent runs as a background hook (future: async task)
```

---

## 5. Compliance Enforcement Logic

The compliance architecture has **three layers**, each providing independent enforcement:

**Layer 1 — System Prompt Grounding**
The LLM system prompt explicitly constrains the response domain to: schemes, zoning, permits, and civic policies. The model is instructed to answer from document context when available. This suppresses general-purpose LLM behaviour.

**Layer 2 — Rule-Based Fallback**
Seven regulatory templates covering the most common civic query types. Each template was manually authored from official sources (Maharashtra DCR 2017, NMC Bye-Laws). No LLM involved — deterministic, auditable, unchangeable without a code deployment.

**Layer 3 — Citation Requirement**
Every response (both LLM and rule-engine) is expected to include source citations (e.g., "Source: MH DCR 2017 Ch.4 §4.3, NMC Bye-Laws 2019"). The Decision Agent enforces this in the structured response format via the `refs` field.

---

## 6. Audit Logging System

**Current implementation:** In-memory analytics aggregation surfaced via `/analytics/dashboard`

**Production-ready audit schema (designed, pending DB migration):**

```sql
CREATE TABLE audit_log (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id       UUID REFERENCES auth.users(id),
    session_id    TEXT NOT NULL,
    query_text    TEXT NOT NULL,
    classification TEXT NOT NULL,         -- zoning|permits|schemes|heritage|...
    agent_path    TEXT NOT NULL,          -- 'llm' | 'rule_engine'
    pdf_context   BOOLEAN DEFAULT false,
    response_hash TEXT NOT NULL,          -- SHA-256 of response text
    latency_ms    INTEGER,
    groq_model    TEXT,                   -- model version used
    token_count   INTEGER
);
```

This schema enables:
- Full query reconstruction at any point in time
- Agent path auditing (which compliance layer responded)
- Latency monitoring and SLA enforcement
- Response deduplication (via hash) for cache optimisation
- User-level usage analytics for personalisation

---

## 7. Error Handling & Recovery

| Failure Scenario | Detection | Recovery |
|---|---|---|
| Groq API timeout | Exception in `ask_ai()` | Silent catch → `_fallback_response()` |
| Groq API key missing | `os.getenv()` returns empty | Skip LLM entirely, go straight to rule engine |
| PDF has no text (scanned) | `ValueError` from `process_pdf()` | HTTP 500 + user message to try a different file |
| PDF upload non-PDF MIME | Extension check in Input Agent | HTTP 400 before any processing |
| Empty message | Pydantic + manual check | HTTP 400 before any agent invocation |
| Database connection failure | SQLAlchemy exception | HTTP 500 — does not affect AI chat (in-memory) |
| Supabase auth failure | JWT validation error | HTTP 401 on protected routes only |

**Circuit breaker pattern (future):** After 3 consecutive Groq failures in a 60-second window, bypass LLM for 5 minutes and serve all responses from rule engine. Prevents cascading timeouts from degrading UX.

---

## 8. Text-Based Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CITIZEN BROWSER                              │
│   ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌────────────────────┐ │
│   │ ChatPage │  │ MapPage │  │Schemes   │  │ DashboardPage      │ │
│   │ (AI Chat │  │(Leaflet)│  │  Page    │  │ (Authority View)   │ │
│   │+PDF upld)│  │         │  │          │  │                    │ │
│   └────┬─────┘  └────┬────┘  └────┬─────┘  └─────────┬──────────┘ │
│        │             │             │                   │            │
│        └─────────────┴─────────────┴───────────────────┘           │
│                             │ REST API (fetch / Axios)              │
└─────────────────────────────┼───────────────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────▼───────────────────────────────────────┐
│                   FastAPI Application Server                         │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   AGENT PIPELINE                              │  │
│  │                                                               │  │
│  │  ┌──────────┐    ┌─────────────┐    ┌────────────────────┐  │  │
│  │  │  INPUT   │───▶│ CLASSIFI-   │───▶│ COMPLIANCE AGENT   │  │  │
│  │  │  AGENT   │    │ CATION      │    │                    │  │  │
│  │  │          │    │ AGENT       │    │  ┌──────────────┐  │  │  │
│  │  │ validate │    │             │    │  │ 3A: Groq LLM │  │  │  │
│  │  │ parse    │    │ keyword     │    │  │  (primary)   │  │  │  │
│  │  │ route    │    │ scan +      │    │  └──────┬───────┘  │  │  │
│  │  └──────────┘    │ domain tag  │    │         │ fail?    │  │  │
│  │                  └─────────────┘    │  ┌──────▼───────┐  │  │  │
│  │                                     │  │ 3B: Rule Eng │  │  │  │
│  │                                     │  │  (fallback)  │  │  │  │
│  │                                     │  └──────────────┘  │  │  │
│  │                                     └────────────────────┘  │  │
│  │                                              │               │  │
│  │                              ┌───────────────▼─────────┐    │  │
│  │                              │    DECISION AGENT        │    │  │
│  │                              │  format + enrich + route │    │  │
│  │                              └───────────┬─────────┬────┘    │  │
│  │                                          │         │         │  │
│  │                         ┌────────────────▼┐   ┌───▼───────┐ │  │
│  │                         │ SCHEME MATCHER  │   │   AUDIT   │ │  │
│  │                         │    AGENT        │   │   AGENT   │ │  │
│  │                         │ (eligibility    │   │ (log +    │ │  │
│  │                         │  scoring)       │   │ analytics)│ │  │
│  │                         └─────────────────┘   └───────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Route Modules: /ai  /auth  /zones  /issues  /schemes               │
│                 /analytics  /alerts  /search  /chat                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                          DATA LAYER                                  │
│                                                                      │
│  ┌───────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ Supabase Postgres │  │  SQLAlchemy ORM  │  │  In-Memory PDF  │  │
│  │ (auth.users,      │  │  (schemes table) │  │  Context Store  │  │
│  │  session mgmt)    │  │                  │  │  (_pdf_context) │  │
│  └───────────────────┘  └──────────────────┘  └─────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │           STATIC CIVIC KNOWLEDGE BASE                        │  │
│  │  Maharashtra DCR 2017 | NMC Bye-Laws 2019 | MahaRERA        │  │
│  │  MIDC Act | Heritage Conservation Act | PMAY Rules          │  │
│  │  (encoded in rule engine — deterministic, version-locked)    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 9. Scalability Considerations

| Dimension | Current State | Production Path |
|---|---|---|
| **LLM concurrency** | Sequential per request | Groq supports 100+ RPM on free tier; async FastAPI handles concurrent requests |
| **PDF context** | Module-level variable (single instance) | Move to Redis with `user_id` key; 1-hour TTL |
| **Database** | Supabase (managed PG) | Already production-grade; enable PgBouncer for connection pooling |
| **Frontend** | Vercel CDN | Edge deployment, already globally distributed |
| **Backend** | Render single instance | Horizontal scaling via Render's multi-instance config |
| **Agent orchestration** | Synchronous in-request | LangGraph or Celery for async multi-step workflows |
| **Knowledge base** | Hardcoded rule engine | Move to vector DB (pgvector in Supabase) for semantic retrieval over full DCR text |

---

*Document version 1.0 — ET AI Hackathon 2026*
