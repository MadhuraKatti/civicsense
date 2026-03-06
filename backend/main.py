from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import chat, analytics, schemes, zones
from models import Base
from database import engine



Base.metadata.create_all(bind=engine)
app = FastAPI(title="CivicSense API")
app.include_router(schemes.router)
# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(chat.router)
app.include_router(analytics.router)
app.include_router(schemes.router)
app.include_router(zones.router)


@app.get("/")
def root():
    return {"message": "CivicSense API running"}