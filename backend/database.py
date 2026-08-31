"""SQLAlchemy engine + session setup.

The DATABASE_URL env var is read by the engine. For Neon, use the pooled
connection (PgBouncer) — Cloud Run will reuse Cloud SQL-style short-lived
connections poorly without it.
"""
from __future__ import annotations

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Copy .env.example to .env and fill in the Neon connection string"
        " — or use sqlite:///./dev.db for a throwaway LOCAL database (Share v2.0 testing)."
    )

# pool_pre_ping survives stale connections (common with serverless Postgres);
# pool_size kept small because Cloud Run scales horizontally — many small pools.
# SQLite (local dev) takes none of those pool kwargs.
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, future=True, connect_args={"check_same_thread": False})
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        future=True,
    )

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)


class Base(DeclarativeBase):
    """Project-wide declarative base."""
    pass


def get_db():
    """FastAPI dependency: yields a session, closes it after the request."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
