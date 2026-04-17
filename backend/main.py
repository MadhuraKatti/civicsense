import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import chat, analytics, schemes, zones, ai
from routes.auth import router as auth_router
from routes.search import router as search_router
from routes.alerts import router as alerts_router
from routes.issues import router as issues_router
from models import Base
from database import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CivicSense API", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
# FRONTEND_URL may be comma-separated for multiple origins,
# e.g. "https://civicsense-gamma.vercel.app,http://localhost:5173"
_frontend_url = os.getenv("FRONTEND_URL", "")

if _frontend_url:
    _allowed_origins = [o.strip() for o in _frontend_url.split(",") if o.strip()]
else:
    # Fallback: allow the known production frontend + local dev
    _allowed_origins = [
        "https://civicsense-gamma.vercel.app",
        "http://localhost:5173",
        "http://localhost:4173",   # vite preview
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ─────────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(search_router)
app.include_router(alerts_router)
app.include_router(issues_router)
app.include_router(chat.router)       # empty stub — no-op
app.include_router(analytics.router)
app.include_router(schemes.router)
app.include_router(zones.router)
app.include_router(ai.router)         # owns /ai/chat and /ai/upload-pdf


# ── Health & root ──────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "CivicSense API running"}
