"""Security primitives: password hashing, JWT, password-reset tokens.

Password hashing
----------------
bcrypt's input is limited to 72 bytes — long passwords get silently truncated.
We pre-hash with SHA-256 (32 bytes hex-encoded to 64 chars, well under 72)
before bcrypt'ing. This is the same pattern Dropbox documented in 2016.

JWT
---
HS256 with a single secret in JWT_SECRET. Tokens carry `sub` (user id as string),
`email`, and `exp`. ACCESS_TOKEN_EXPIRE_MINUTES controls TTL (default 24h).

Reset tokens
------------
We generate a 32-byte URL-safe token, return the raw value to the caller (who
emails it), and store only SHA-256(token) in the DB. Verification re-hashes the
incoming token and compares.
"""
from __future__ import annotations

import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt

JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET is not set. See .env.example.")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
JWT_ALG = "HS256"


# ── Password hashing ──────────────────────────────────────────────────────
def _prehash(password: str) -> bytes:
    """SHA-256 hex of the password (64 ASCII bytes), to dodge bcrypt's 72-byte limit."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8")


def hash_password(password: str) -> str:
    """Return a bcrypt hash (utf-8 str) suitable for storing in users.password_hash."""
    pre = _prehash(password)
    return bcrypt.hashpw(pre, bcrypt.gensalt(rounds=12)).decode("utf-8")


def verify_password(password: str, password_hash: Optional[str]) -> bool:
    """Constant-time check. Always runs bcrypt even when password_hash is None,
    so timing doesn't leak which emails are registered."""
    # Sentinel hash matches no real password but takes ~the same time to verify.
    # We pre-compute it once at module load so the per-call cost is just one bcrypt verify.
    target = password_hash.encode("utf-8") if password_hash else _DUMMY_HASH
    try:
        ok = bcrypt.checkpw(_prehash(password), target)
    except Exception:
        ok = False
    return bool(ok) and password_hash is not None


_DUMMY_HASH = bcrypt.hashpw(b"x" * 64, bcrypt.gensalt(rounds=12))


# ── JWT ───────────────────────────────────────────────────────────────────
def create_access_token(user_id: int, email: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_access_token(token: str) -> Optional[dict]:
    """Returns the claims dict on success, None on any failure (invalid / expired / tampered)."""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.InvalidTokenError:
        return None


# ── Reset tokens ──────────────────────────────────────────────────────────
def generate_reset_token() -> tuple[str, str, datetime]:
    """Returns (raw_token, sha256_hex, expires_at). Store the hex, email the raw."""
    raw = secrets.token_urlsafe(32)
    digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    return raw, digest, expires_at


def hash_reset_token(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()
