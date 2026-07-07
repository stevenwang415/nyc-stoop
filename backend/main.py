"""NYC Stoop API — FastAPI entry point.

Loads env vars, configures CORS for the local + Vercel frontends, mounts the
auth router, and exposes a /health endpoint Cloud Run can ping.

Run locally:
    cd backend
    cp .env.example .env  # fill in values
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""
from __future__ import annotations

import logging
import os

from dotenv import load_dotenv

# Load .env BEFORE importing anything that reads env at import time.
load_dotenv()

from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402

from auth import router as auth_router  # noqa: E402
from database import Base, engine  # noqa: E402

logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


# ── Create tables ─────────────────────────────────────────────────────────
# Lightweight bootstrap so a fresh Neon database stands up without Alembic.
# Safe to run on every boot — create_all is a no-op if tables already exist.
# Once you outgrow this (i.e., need migrations), switch to Alembic.
def _bootstrap_db() -> None:
    import models  # noqa: F401 — register models on Base before create_all
    Base.metadata.create_all(bind=engine)
    # create_all never adds columns to EXISTING tables — patch later additions
    # here (Postgres IF NOT EXISTS keeps this idempotent on every boot).
    from sqlalchemy import text
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_sub VARCHAR(255)"))
        conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_apple_sub ON users (apple_sub)"))
    logger.info("Database tables ensured.")


_bootstrap_db()


# ── App ───────────────────────────────────────────────────────────────────
app = FastAPI(title="NYC Stoop API", version="0.1.0")

cors_origins = [
    o.strip()
    for o in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/health")
def health() -> dict:
    return {"ok": True, "service": "nyc-stoop-api"}


@app.get("/")
def root() -> dict:
    return {"service": "nyc-stoop-api", "docs": "/docs"}
