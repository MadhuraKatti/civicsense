import secrets, hashlib, time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

def _hash(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

USERS = [
    {"name": "Admin", "email": "admin@civicsense.in", "password_hash": _hash("admin123")},
]

class SignupReq(BaseModel):
    name: str
    email: str
    password: str

class LoginReq(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(req: SignupReq):
    if len(req.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")
    if any(u["email"] == req.email for u in USERS):
        raise HTTPException(400, "Email already registered")
    USERS.append({"name": req.name, "email": req.email, "password_hash": _hash(req.password)})
    return {"message": "Account created"}

@router.post("/login")
def login(req: LoginReq):
    user = next((u for u in USERS if u["email"] == req.email), None)
    if not user or user["password_hash"] != _hash(req.password):
        raise HTTPException(401, "Invalid email or password")
    token = secrets.token_hex(32)
    return {"name": user["name"], "email": user["email"], "token": token}
