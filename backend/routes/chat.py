"""
routes/chat.py — DEPRECATED

The /ai/chat endpoint is now fully handled by routes/ai.py which includes:
  - Groq LLM integration (when GROQ_API_KEY is set)
  - Rule-based fallback (when GROQ_API_KEY is absent)
  - PDF upload endpoint

This file is kept as a stub so any external imports don't break.
The router defined here is intentionally empty.
"""
from fastapi import APIRouter

router = APIRouter()
# No routes defined here — all AI routes live in routes/ai.py
