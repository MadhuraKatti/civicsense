# 🏙️ CivicSense AI
### *India's First Multi-Agent Civic Intelligence Platform — Know Your City. Claim Your Rights. Build Smarter.*
---

## 🔴 The Problem — India's ₹3.7 Lakh Crore Governance Gap

Every day, millions of Indian citizens face the same invisible wall:

- A small business owner in Nashik spends **3–4 months** navigating permits — not because the process is complex, but because **no one tells them what rules apply to their plot**.
- A first-generation homeowner is eligible for ₹2.67 lakh under PMAY but never applies — because **they don't know the scheme exists**.
- A heritage zone shopkeeper demolishes a wall and faces a ₹5 lakh fine — because **zoning laws are buried in 300-page Maharashtra DCR PDFs that no one reads**.
- Municipal officials manually process 200+ civic complaints per day — **routing pothole reports to the electricity department and vice versa**.

> **The root cause is not a lack of rules. It's a lack of access.**
> Civic knowledge is locked in government documents. Compliance is a privilege of those who can afford lawyers.

---

## ❌ Why Current Systems Fail

| Problem | Today's Reality |
|---|---|
| **Civic complaint routing** | Citizens call a general helpline. Manual triage takes 2–5 days. SLA breaches go untracked. |
| **Scheme discovery** | Citizens must visit multiple government portals. No personalisation. 73% of eligible citizens never apply (NITI Aayog, 2023). |
| **Zoning & permit clarity** | DCR 2017 is 400+ pages. No interactive map. Each query requires a lawyer or a visit to NMC. |
| **Audit & accountability** | Complaint decisions have no transparent trail. Citizens have no way to track *why* their complaint was routed or resolved. |
| **Predictive maintenance** | Zero data-driven forecasting. Cities react to crises rather than prevent them. |

---

## ✅ The Solution — CivicSense AI

**CivicSense AI** is a multi-agent AI system that transforms how citizens and municipal authorities interact with urban governance. Built for the **Nashik Municipal Corporation (NMC)** context but architecturally replicable across all 4,000+ Indian ULBs (Urban Local Bodies).

It does four things no existing system does simultaneously:

1. **Understands natural-language civic queries** — powered by Groq's LLaMA 3.1-8B with Maharashtra DCR compliance grounding
2. **Delivers interactive zoning intelligence** — Leaflet-powered geo-visual map with zone-level rule lookup
3. **Matches citizens to government schemes** — AI eligibility scoring across PMAY, Mudra, Ujjwala, and 200+ central/state schemes
4. **Provides a live authority dashboard** — real-time query analytics and civic issue heat maps for municipal decision-makers

---

## ✨ Key Features

- 🤖 **Multi-Agent AI Pipeline** — Six specialised agents (Input → Classification → Compliance → Decision → Scheme Matching → Audit) each with distinct roles, fallback logic, and audit hooks
- 📜 **Compliance-First LLM** — Every AI response is grounded in Maharashtra DCR 2017, NMC Bye-Laws 2019, and MahaRERA. Hallucination is suppressed via rule-based fallback before LLM invocation
- 🗺️ **Interactive Zoning Map** — React-Leaflet map with colour-coded zones (R1/R2 Residential, C1/C2 Commercial, I1 Industrial, Mixed Use, Heritage), real-time issue markers, and click-to-query AI
- 📄 **PDF-Aware AI Chat** — Upload any government circular or building plan; the AI extracts text (pypdf), creates a context window, and answers questions specific to that document
- 📊 **Scheme Eligibility Engine** — Fill one profile form; get AI-matched scheme cards with percentage scores and direct apply links
- 🔔 **Civic Issue Tracker** — Geo-tagged issue board (roads, water, electricity, drainage, zoning violations) with severity levels
- 📈 **Authority Analytics Dashboard** — Query volume trends, category breakdowns, recent query log — designed for municipal oversight
- 🔒 **Supabase Auth** — JWT-based authentication with email/password, protected routes, and session management
- 🌐 **Rule-Based Graceful Degradation** — If Groq API is unavailable, the system falls back to a curated rule engine with legally verified responses. **Zero downtime for citizens.**

---

## 🎬 Demo Flow — A 5-Minute Story

> **Protagonist:** Ravi, a contractor in Nashik planning a G+3 building on Gangapur Road.

**Step 1 — Open CivicSense AI**
Ravi lands on the homepage. Animated counters show 12,847 queries answered, 847 zones mapped, 234 schemes indexed.

**Step 2 — Ask the AI Assistant**
He types: *"Can I build a 4-floor building near Gangapur Road in Nashik?"*

The Classification Agent detects `zone_query + construction_intent`. The Compliance Agent checks Maharashtra DCR 2017 Chapter 4 §4.3. Response arrives in <2 seconds:

> *"Gangapur Road falls under C1 Commercial Zone. FAR 2.5×, max height G+5 (18m). You will need: Building Permission (NMC Form-A), Fire Safety NOC (buildings above G+3), and Structural Stability Certificate from a licensed engineer. Processing time: 30–90 days. Source: MH DCR 2017 Ch.4, NMC Bye-Laws 2019."*

**Step 3 — Upload a PDF**
Ravi uploads his architect's site plan (PDF). He asks: *"Does this plan comply with setback rules?"*
The PDF Agent extracts text, passes it as context to Groq, and returns a compliance check specific to the document.

**Step 4 — Explore the Zoning Map**
Ravi switches to the Map tab. He sees Gangapur Road highlighted in green (Commercial). He clicks — the right panel shows FAR, height, and required permits. He taps "Ask AI" for deeper analysis.

**Step 5 — Check Schemes**
He navigates to Schemes. He fills his profile: income ₹3–6L, self-employed, Nashik resident. The Scheme Matcher Agent scores him: PMAY 90% match, PM Mudra 80% match. He clicks "Apply Now" → redirected to pmayhousing.nic.in.

**Step 6 — Authority View**
The NMC officer logs into the Dashboard. She sees 11,600 queries on Friday, spike in zoning questions after a new DCR amendment. She sees the issues map — a cluster of road complaints near Satpur. She assigns priority response.

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CITIZEN / AUTHORITY                          │
│              (React 18 + Vite + Leaflet + Supabase Auth)             │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ HTTPS / REST
┌────────────────────────────▼─────────────────────────────────────────┐
│                      FastAPI Backend (Python)                         │
│  ┌─────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  /ai    │  │ /zones       │  │ /schemes │  │ /analytics       │  │
│  │  /chat  │  │ /issues      │  │ /auth    │  │ /search /alerts  │  │
│  └────┬────┘  └──────────────┘  └──────────┘  └──────────────────┘  │
│       │                                                               │
│  ┌────▼──────────────────────────────────────────────────────────┐   │
│  │               MULTI-AGENT PIPELINE                            │   │
│  │  Input → Classify → Compliance → Decision → Schemes → Audit  │   │
│  └────┬──────────────────────────────────────────────────────────┘   │
│       │                                                               │
│  ┌────▼──────────────────┐   ┌──────────────────────────────────┐   │
│  │  Groq LLaMA-3.1-8B    │   │  Rule-Based Fallback Engine      │   │
│  │  (Primary LLM)        │   │  (MH DCR 2017 + NMC Bye-Laws)    │   │
│  └───────────────────────┘   └──────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│               DATA LAYER                                              │
│  Supabase (PostgreSQL + Auth)  │  SQLAlchemy ORM  │  In-memory PDF   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast HMR, lightweight bundle |
| **Maps** | React-Leaflet 4.2 + Leaflet 1.9 | Open-source, no API cost, tile-server agnostic |
| **Backend** | FastAPI 0.115 + Uvicorn | Async-native, auto OpenAPI docs, production-grade |
| **LLM** | Groq (LLaMA-3.1-8B-Instant) | Sub-second inference, India-applicable context |
| **LLM Framework** | LangChain 0.3 + langchain-groq | Agent orchestration, prompt management |
| **PDF Processing** | pypdf 4.3 | Lightweight text extraction, Render-compatible |
| **Auth** | Supabase JS SDK + JWT | Managed auth, Row-Level Security |
| **Database** | Supabase PostgreSQL + SQLAlchemy 2.0 | Relational integrity + ORM abstraction |
| **Deployment** | Render (backend) + Vercel (frontend) | Zero-config CI/CD, free tier production-ready |

---

## 📁 Project Structure

```
civicsense/
├── backend/
│   ├── main.py                  # FastAPI app, CORS, route registration
│   ├── models.py                # SQLAlchemy models (Scheme, etc.)
│   ├── database.py              # Engine + session factory
│   ├── requirements.txt         # All Python dependencies
│   ├── Procfile                 # Render deployment config
│   ├── render.yaml              # Render service definition
│   ├── runtime.txt              # Python version pin
│   ├── ai/
│   │   ├── agent.py             # Groq LLM wrapper + PDF context manager
│   │   └── pdf_reader.py        # PDF extraction utility
│   ├── routes/
│   │   ├── ai.py                # /ai/chat + /ai/upload-pdf endpoints
│   │   ├── auth.py              # JWT auth routes
│   │   ├── issues.py            # Civic issue geo-data
│   │   ├── zones.py             # Zoning data API
│   │   ├── schemes.py           # Scheme CRUD + eligibility
│   │   ├── analytics.py         # Dashboard stats
│   │   ├── alerts.py            # System alerts
│   │   ├── search.py            # Full-text search
│   │   └── chat.py              # Legacy chat route
│   └── services/
│       ├── ai_agent.py          # Structured civic AI response builder
│       └── scheme_matcher.py    # Eligibility scoring engine
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json              # SPA routing config
│   └── src/
│       ├── App.jsx              # Root router + auth guard
│       ├── main.jsx             # React DOM entry point
│       ├── api/
│       │   ├── api.js           # Axios/fetch wrappers for all endpoints
│       │   └── auth.js          # Auth helper functions
│       ├── components/
│       │   ├── MapView.jsx      # React-Leaflet map (zones + issues)
│       │   ├── AlertsDropdown.jsx
│       │   ├── AnimatedLogo.jsx
│       │   ├── AccountPopover.jsx
│       │   ├── SearchModal.jsx
│       │   ├── Donut.jsx        # Donut chart component
│       │   ├── MBar.jsx         # Bar chart component
│       │   └── Spark.jsx        # Sparkline component
│       ├── context/
│       │   ├── AuthContext.jsx  # Supabase session + user state
│       │   └── ThemeContext.jsx # Dark/light mode
│       ├── data/
│       │   └── index.js         # Static civic data (zones, demo messages)
│       ├── icons/
│       │   └── index.jsx        # Unified icon system
│       ├── lib/
│       │   └── supabase.js      # Supabase client initialisation
│       ├── pages/
│       │   ├── HomePage.jsx     # Landing + animated demo
│       │   ├── ChatPage.jsx     # AI chat + PDF upload
│       │   ├── MapPage.jsx      # Interactive zoning map
│       │   ├── SchemesPage.jsx  # Scheme eligibility engine
│       │   ├── DashboardPage.jsx# Authority analytics
│       │   ├── LoginPage.jsx
│       │   └── SignupPage.jsx
│       └── styles/
│           └── global.css       # Full design system (dark theme, tokens)
│
└── docs/
    ├── README.md                # This file
    ├── ARCHITECTURE.md          # Deep technical architecture
    ├── IMPACT_MODEL.md          # Quantified impact analysis
    └── PITCH_SCRIPT.md          # 3-minute video script
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+

### Working Prototype Link
https://civicsense-virid.vercel.app/
---

## 🚀 Deployment

| Service | Platform | Config File |
|---|---|---|
| Backend API | Render | `backend/render.yaml` |
| Frontend | Vercel | `frontend/vercel.json` |
| Database + Auth | Supabase | Dashboard config |

**Live URLs:**
- Frontend: `https://civicsense-virid.vercel.app/`
- Backend: ` https://civicsense-7y58.onrender.com`
- API Docs: ` https://civicsense-7y58.onrender.com/docs`

---

## 🔭 Future Scope

- **WhatsApp Bot Integration** — Citizens ask civic questions via WhatsApp (Twilio + same API backend)
- **Multilingual Support** — Marathi, Hindi, and regional language support via LLM translation layer
- **Real-Time Complaint Tracking** — WebSocket-based live updates when a complaint status changes
- **ML Hotspot Prediction** — Clustering algorithm on historical issue geo-data to predict next pothole cluster
- **NMC API Integration** — Direct REST API connection to Nashik Municipal Corporation's DIGIT platform
- **Voice Interface** — STT/TTS for accessibility (rural citizens, low-literacy users)
- **Mobile App** — React Native wrapper for offline-capable complaint submission
- **Expand to 18 Maharashtra Cities** — Same backend, city-specific compliance knowledge base

---

## 🤝 Team

Built for **ET AI Hackathon 2026 — Problem Statement 5: Domain-Specialized AI Agents with Compliance Guardrails**

> *CivicSense AI: Making civic knowledge a fundamental right, not a privilege.*

---

*© 2026 CivicSense AI Team. Built in Nashik, for India.*
