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
        # In-app feedback (2026-07-14): replaces the mailto round-trip.
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS feedback (
                id          SERIAL PRIMARY KEY,
                email       VARCHAR(320),
                message     TEXT NOT NULL,
                app_version VARCHAR(32),
                created_at  TIMESTAMPTZ DEFAULT now()
            )
        """))
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


# ── Feedback (in-app, replaces the mailto composer) ────────────────────────
# Anonymous allowed — the signed-in email rides along when the client has it.
# Read messages: Neon SQL editor → SELECT * FROM feedback ORDER BY created_at DESC;
from pydantic import BaseModel, Field  # noqa: E402


class FeedbackIn(BaseModel):
    message: str = Field(min_length=3, max_length=4000)
    email: str | None = Field(default=None, max_length=320)
    app_version: str | None = Field(default=None, max_length=32)


def _email_feedback(body: "FeedbackIn") -> bool:
    """Forward the note to the inbox via Gmail SMTP (App Password).

    Env: FEEDBACK_SMTP_USER (the Gmail address; also the recipient) and
    FEEDBACK_SMTP_APP_PASSWORD (Google Account → Security → 2-Step
    Verification → App passwords). Failure is non-fatal — the DB row is the
    source of truth; this is the convenience copy.
    """
    import smtplib
    from email.message import EmailMessage

    user = os.environ.get("FEEDBACK_SMTP_USER", "stevenwang.nycstoop@gmail.com")
    pw = os.environ.get("FEEDBACK_SMTP_APP_PASSWORD", "")
    if not pw:
        return False
    msg = EmailMessage()
    msg["Subject"] = f"NYC Stoop feedback (v{body.app_version or '?'})"
    msg["From"] = user
    msg["To"] = user
    msg["Reply-To"] = (body.email or user)
    msg.set_content(
        f"{body.message.strip()}\n\n—\nfrom: {body.email or 'anonymous'}\napp: v{body.app_version or '?'}"
    )
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as s:
            s.login(user, pw)
            s.send_message(msg)
        return True
    except Exception as exc:  # noqa: BLE001 — log and move on; DB row survives
        logger.warning("feedback email forward failed: %s", exc)
        return False


@app.post("/feedback")
def create_feedback(body: FeedbackIn) -> dict:
    from sqlalchemy import text
    with engine.begin() as conn:
        conn.execute(
            text("INSERT INTO feedback (email, message, app_version) VALUES (:e, :m, :v)"),
            {"e": (body.email or "").strip()[:320] or None,
             "m": body.message.strip(),
             "v": (body.app_version or "").strip()[:32] or None},
        )
    emailed = _email_feedback(body)
    return {"ok": True, "emailed": emailed}


@app.get("/")
def root() -> dict:
    return {"service": "nyc-stoop-api", "docs": "/docs"}
