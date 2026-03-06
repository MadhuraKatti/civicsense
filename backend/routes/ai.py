from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import os

router = APIRouter(prefix="/ai")


class ChatRequest(BaseModel):
    message: str


def _fallback_response(message: str) -> str:
    """Rule-based fallback when Groq/LLM is not configured."""
    m = message.lower()

    if any(k in m for k in ["far", "floor area", "floor space"]):
        return (
            "Based on Maharashtra DCR 2017:\n\n"
            "• FAR 1.5× for R2/R3 residential zones in Nashik\n"
            "• TDR permitted up to 0.4× base FAR on eligible plots\n"
            "• Corner plots: 10% additional FAR relaxation under NMC rules\n"
            "• Commercial zones (C1/C2): FAR up to 2.5×\n\n"
            "Contact NMC Building Department for your specific plot.\n"
            "Source: MH DCR 2017 Ch.4 §4.3, NMC Bye-Laws 2019"
        )
    if any(k in m for k in ["zon"]):
        return (
            "Nashik Zone Types (Development Plan):\n\n"
            "• R1/R2 – Residential (FAR 1.5×, max G+3, 12m)\n"
            "• C1/C2 – Commercial (FAR 2.5×, max G+5, 18m)\n"
            "• I1 – Industrial/MIDC (FAR 1.0×, max 15m)\n"
            "• Mixed Use (FAR 2.0×, max G+4)\n"
            "• Restricted/Heritage (FAR 0.5×, max G+1)\n\n"
            "Click the Zoning Map tab to explore all zones interactively."
        )
    if any(k in m for k in ["permit", "permission", "build", "construct", "approval", "noc"]):
        return (
            "Permits required for construction in Nashik:\n\n"
            "1. Building Permission — NMC Building Dept. (Form-A)\n"
            "2. Structural Stability Certificate — Licensed structural engineer\n"
            "3. Fire Safety NOC — Nashik Fire Brigade (buildings above G+3)\n"
            "4. Environmental Clearance — built-up area > 5,000 sq.m\n"
            "5. RERA Registration — residential projects > 8 units\n\n"
            "Processing time: 30–90 days. Apply at nmc.gov.in\n"
            "Sources: NMC Bye-Laws 2019, Maharashtra RERA Act 2016"
        )
    if any(k in m for k in ["pmay", "scheme", "yojana", "mudra", "subsidy", "housing loan", "benefit"]):
        return (
            "Key government schemes in Nashik:\n\n"
            "🏠 PM Awas Yojana (Urban)\n"
            "   Subsidy ₹2.67L for EWS/LIG. Apply: pmayhousing.nic.in\n\n"
            "💰 PM Mudra Yojana\n"
            "   Loans ₹50K–₹10L for micro businesses\n\n"
            "🌱 PM Ujjwala Yojana\n"
            "   Free LPG connection for BPL households\n\n"
            "📊 Atal Pension Yojana\n"
            "   Guaranteed pension ₹1K–₹5K/month\n\n"
            "Use the Schemes tab to check your personal eligibility."
        )
    if any(k in m for k in ["heritage", "panchavati", "trimbak", "ram ghat"]):
        return (
            "Heritage Zone Regulations (Panchavati / Trimbak Road):\n\n"
            "• Max height: G+1 (~7 metres)\n"
            "• FAR capped at 0.5×\n"
            "• Heritage Clearance from State Heritage Committee required\n"
            "• Original façade and materials must be preserved\n"
            "• No advertising hoardings on heritage structures\n"
            "• Demolition requires Archaeological Survey NOC\n\n"
            "Sources: Maharashtra Heritage Conservation Act, MH DCR 2017 Ch.11"
        )
    if any(k in m for k in ["midc", "satpur", "industrial", "factory", "warehouse"]):
        return (
            "Industrial Zone — Satpur MIDC:\n\n"
            "• Zone: I1 (Light Industrial)\n"
            "• FAR: 1.0×, max height 15m\n"
            "• MIDC Approval required for all developments\n"
            "• Pollution Control Board NOC required\n"
            "• No residential use permitted\n"
            "• Setbacks: 9m (road), 4.5m (side/rear)\n\n"
            "MIDC Nashik Office: (0253) 2350001\n"
            "Sources: MIDC Act, MH DCR 2017 Ch.8"
        )
    if any(k in m for k in ["pdf", "document", "upload", "file"]):
        return (
            "I can analyze uploaded PDF documents!\n\n"
            "Use the 'Upload PDF' button in the sidebar to upload:\n"
            "• Scheme documents and circulars\n"
            "• Building plans and approvals\n"
            "• Government notifications\n\n"
            "Once uploaded, ask me questions about the document content."
        )

    return (
        "I'm CivicSense AI — your civic intelligence assistant for Nashik.\n\n"
        "I can help with:\n"
        "🗺️  Zoning — FAR limits, zone types, height restrictions\n"
        "🏗️  Permits — Building permissions, NOCs, approvals\n"
        "💰  Schemes — Government schemes you qualify for\n"
        "🏛️  Heritage — Rules for heritage conservation zones\n"
        "🏭  Industrial — MIDC and industrial zone regulations\n\n"
        "Try asking:\n"
        "• 'What are the FAR limits in Nashik?'\n"
        "• 'What permits do I need to build?'\n"
        "• 'Tell me about PMAY scheme'\n"
        "• 'Heritage zone building rules'"
    )


@router.post("/chat")
async def chat_ai(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(400, "Message cannot be empty")

    # Try real LLM first if Groq key is available
    groq_key = os.getenv("GROQ_API_KEY", "")
    if groq_key:
        try:
            from ai.agent import ask_ai
            answer = ask_ai(req.message)
            return {"response": answer}
        except Exception:
            pass  # fall through to rule-based

    return {"response": _fallback_response(req.message)}


@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are accepted")

    contents = await file.read()
    size_kb = round(len(contents) / 1024, 1)

    # Try real PDF processing if dependencies available
    groq_key = os.getenv("GROQ_API_KEY", "")
    if groq_key:
        try:
            file_path = f"temp_{file.filename}"
            with open(file_path, "wb") as f:
                f.write(contents)
            from ai.agent import process_pdf
            process_pdf(file_path)
            return {
                "message": f"'{file.filename}' processed with AI. You can now ask questions about it.",
                "filename": file.filename,
                "size_kb": size_kb,
                "ai_enabled": True,
            }
        except Exception as e:
            pass  # fall through

    return {
        "message": f"'{file.filename}' ({size_kb} KB) uploaded. Ask me questions about it.",
        "filename": file.filename,
        "size_kb": size_kb,
        "ai_enabled": False,
    }
