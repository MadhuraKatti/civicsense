import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Load .env only for local development — not required in production
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # SQLite fallback for local development
    DATABASE_URL = "sqlite:///./civicsense_dev.db"
    print("[database] WARNING: DATABASE_URL not set — using local SQLite fallback")
else:
    # Render / Heroku provide postgres:// but SQLAlchemy 2.x needs postgresql://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs check_same_thread=False; Postgres does not need it
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
