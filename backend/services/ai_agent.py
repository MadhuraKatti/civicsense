# Legacy service — AI is now handled directly in routes/ai.py
def civic_ai(message: str) -> dict:
    return {"response": "Please use the /ai/chat endpoint directly."}
