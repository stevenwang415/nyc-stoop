"""Auth router: signup, login, Google, forgot-password, reset-password, /me.

Security notes
--------------
- /auth/login takes constant time regardless of whether the email exists
  (see `verify_password`'s dummy-hash path).
- /auth/forgot-password always returns 200 to prevent user enumeration.
- /auth/google verifies the ID token server-side via google-auth.
- Reset tokens are single-use (marked used_at on success) and short-lived (1h).
"""
from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Header, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from email_service import send_password_reset_email
from models import PasswordResetToken, User
from schemas import (
    AuthResponse,
    ForgotPasswordRequest,
    GoogleAuthRequest,
    LoginRequest,
    OkResponse,
    ResetPasswordRequest,
    SignupRequest,
    UserPublic,
)
from security import (
    create_access_token,
    decode_access_token,
    generate_reset_token,
    hash_password,
    hash_reset_token,
    verify_password,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")


# ── Helpers ───────────────────────────────────────────────────────────────
def _to_public(user: User) -> UserPublic:
    return UserPublic(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        picture_url=user.picture_url,
        has_password=bool(user.password_hash),
        has_google=bool(user.google_sub),
    )


def _auth_response(user: User) -> AuthResponse:
    return AuthResponse(
        access_token=create_access_token(user.id, user.email),
        user=_to_public(user),
    )


def _normalize_email(email: str) -> str:
    return email.strip().lower()


# ── Current-user dependency ───────────────────────────────────────────────
def get_current_user(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    """FastAPI dependency: validates the Bearer JWT and returns the User row."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    claims = decode_access_token(token)
    if not claims or "sub" not in claims:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")
    try:
        user_id = int(claims["sub"])
    except (TypeError, ValueError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return user


# ── Endpoints ─────────────────────────────────────────────────────────────
@router.post("/signup", response_model=AuthResponse)
def signup(req: SignupRequest, db: Session = Depends(get_db)) -> AuthResponse:
    email = _normalize_email(req.email)
    existing = db.scalar(select(User).where(User.email == email))
    if existing:
        # If the email already exists as a Google-only account, we don't expose that —
        # message stays generic to avoid leaking which auth method an email used.
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    user = User(
        email=email,
        password_hash=hash_password(req.password),
        display_name=(req.display_name or "").strip() or None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _auth_response(user)


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    email = _normalize_email(req.email)
    user = db.scalar(select(User).where(User.email == email))

    # Constant-time check: verify_password always runs bcrypt even when password_hash is None.
    if not verify_password(req.password, user.password_hash if user else None):
        # Generic message; don't reveal whether the email exists or just the password is wrong.
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    # mypy: user is non-None here because verify_password returned True only when password_hash existed
    assert user is not None
    return _auth_response(user)


@router.post("/google", response_model=AuthResponse)
def google_auth(req: GoogleAuthRequest, db: Session = Depends(get_db)) -> AuthResponse:
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Google sign-in is not configured")

    try:
        info = google_id_token.verify_oauth2_token(
            req.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
        )
    except ValueError as exc:
        logger.warning("Google ID token verification failed: %s", exc)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Google credential")

    sub = info.get("sub")
    email = _normalize_email(info.get("email", ""))
    if not sub or not email:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Google credential missing email")
    if not info.get("email_verified", False):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Google email not verified")

    # Upsert: prefer match by google_sub, then by email (to link existing email/password accounts).
    user = db.scalar(select(User).where(User.google_sub == sub))
    if not user:
        user = db.scalar(select(User).where(User.email == email))
        if user and not user.google_sub:
            user.google_sub = sub  # link the existing email/password account

    if not user:
        user = User(
            email=email,
            google_sub=sub,
            display_name=info.get("name") or None,
            picture_url=info.get("picture") or None,
        )
        db.add(user)
    else:
        # Refresh display name + picture from Google if we don't already have one.
        if not user.display_name and info.get("name"):
            user.display_name = info["name"]
        if not user.picture_url and info.get("picture"):
            user.picture_url = info["picture"]

    db.commit()
    db.refresh(user)
    return _auth_response(user)


@router.post("/forgot-password", response_model=OkResponse)
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)) -> OkResponse:
    """Always returns 200 even when the email doesn't exist — prevents enumeration."""
    email = _normalize_email(req.email)
    user = db.scalar(select(User).where(User.email == email))

    # Only send for email/password accounts. Google-only accounts ignore silently
    # (we still return 200 to keep the response shape identical from the outside).
    if user and user.password_hash:
        raw, digest, expires_at = generate_reset_token()
        token_row = PasswordResetToken(
            user_id=user.id, token_hash=digest, expires_at=expires_at
        )
        db.add(token_row)
        db.commit()
        send_password_reset_email(user.email, raw)
    else:
        logger.info("forgot-password: no eligible account for %s (silent 200)", email)

    return OkResponse()


@router.post("/reset-password", response_model=AuthResponse)
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)) -> AuthResponse:
    digest = hash_reset_token(req.token)
    now = datetime.now(timezone.utc)

    row = db.scalar(
        select(PasswordResetToken).where(
            PasswordResetToken.token_hash == digest,
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at > now,
        )
    )
    if not row:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired reset token")

    user = db.get(User, row.user_id)
    if not user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired reset token")

    user.password_hash = hash_password(req.password)
    row.used_at = now
    db.commit()
    db.refresh(user)
    return _auth_response(user)


@router.get("/me", response_model=UserPublic)
def me(current_user: User = Depends(get_current_user)) -> UserPublic:
    return _to_public(current_user)


@router.patch("/me", response_model=UserPublic)
def update_me(
    display_name: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserPublic:
    """Currently only display_name is mutable here. Avatar lives client-side in localStorage."""
    if display_name is not None:
        cleaned = display_name.strip()[:120]
        current_user.display_name = cleaned or None
    db.commit()
    db.refresh(current_user)
    return _to_public(current_user)
