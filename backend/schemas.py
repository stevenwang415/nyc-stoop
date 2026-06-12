"""Pydantic request/response schemas for the auth router."""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ── Requests ──────────────────────────────────────────────────────────────
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)
    display_name: Optional[str] = Field(default=None, max_length=120)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class GoogleAuthRequest(BaseModel):
    credential: str = Field(min_length=10)  # raw Google ID token (JWT)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=10, max_length=200)
    password: str = Field(min_length=8, max_length=200)


# ── Responses ─────────────────────────────────────────────────────────────
class UserPublic(BaseModel):
    id: int
    email: str
    display_name: Optional[str] = None
    picture_url: Optional[str] = None
    has_password: bool = False  # True if the account has a password (vs. Google-only)
    has_google: bool = False


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class OkResponse(BaseModel):
    ok: bool = True
