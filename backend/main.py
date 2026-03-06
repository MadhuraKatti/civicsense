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
app = FastAPI(title="CivicSense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(search_router)
app.include_router(alerts_router)
app.include_router(issues_router)
app.include_router(chat.router)
app.include_router(analytics.router)
app.include_router(schemes.router)
app.include_router(zones.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "CivicSense API running"}
