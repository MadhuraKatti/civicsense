"""
CivicSense AI Agent
-------------------
Uses Groq LLM for chat. PDF text is extracted with pypdf and passed as
context — no FAISS / sentence-transformers required, keeping the build
lightweight and Render-friendly.
"""
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# In-memory PDF context (one document at a time is fine for this use case)
_pdf_context: str = ""

SYSTEM_PROMPT = """You are CivicSense AI — a civic intelligence assistant for Nashik, India.

Help citizens understand:
- Government schemes and subsidies
- Building rules, FAR limits, and zoning laws
- Permits, NOCs, and approvals
- Civic policies and regulations

Give clear, concise answers in bullet points.
If document context is provided, base your answer on it.
"""


def process_pdf(file_path: str) -> str:
    """Extract text from a PDF and store it as context for subsequent queries."""
    global _pdf_context

    from pypdf import PdfReader

    reader = PdfReader(file_path)
    pages_text = []
    for page in reader.pages:
        text = page.extract_text() or ""
        if text.strip():
            pages_text.append(text)

    if not pages_text:
        raise ValueError("PDF contains no extractable text")

    # Keep at most ~8 000 chars to stay within token budget
    full_text = "\n\n".join(pages_text)
    _pdf_context = full_text[:8000]

    return "PDF processed successfully"


def ask_ai(question: str) -> str:
    """Send a question to Groq, optionally enriched with PDF context."""
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured")

    try:
        from groq import Groq
    except ImportError as exc:
        raise RuntimeError("groq package is not installed") from exc

    client = Groq(api_key=GROQ_API_KEY)

    user_content = question
    if _pdf_context:
        user_content = (
            f"DOCUMENT CONTEXT:\n{_pdf_context}\n\n"
            f"User question: {question}"
        )

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        max_tokens=800,
    )

    return response.choices[0].message.content
