from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_agent import civic_ai

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/ai/chat")
def chat(req: ChatRequest):
    return civic_ai(req.message)