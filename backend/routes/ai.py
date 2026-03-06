from fastapi import APIRouter, UploadFile, File
from ai.agent import ask_ai, process_pdf
import shutil

router = APIRouter(prefix="/ai")


# ---------------- CHAT ---------------- #

@router.post("/chat")
def chat_ai(data: dict):

    question = data.get("message")

    answer = ask_ai(question)

    return {
        "response": answer
    }


# ---------------- PDF UPLOAD ---------------- #

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    result = process_pdf(file_path)

    return {
        "message": result
    }