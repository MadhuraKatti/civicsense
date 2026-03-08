from fastapi import APIRouter
from pydantic import BaseModel
from ai.agent import ask_ai

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/ai/chat")
def chat(req: ChatRequest):

    answer = ask_ai(req.message)

    return {
        "response": answer
    }