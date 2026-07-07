"""SQLAlchemy models for users and password-reset tokens.

Schema notes
------------
Users:
- `password_hash` is nullable so Google-only accounts can exist (no password).
- `google_sub` is nullable so email/password-only accounts can exist (no Google link).
- A row can have BOTH (linked account): email/password signup that later signed in with
  Google for the same email merges into one row.

Password reset tokens:
- We store SHA-256(token), never the raw token. The user holds the raw token in their
  email link; we compare hashes server-side.
- `used_at` lets a token be invalidated after first use.
- `expires_at` is set at creation time (TTL 1 hour by default).
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import String, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    google_sub: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, unique=True, index=True)
    apple_sub: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, unique=True, index=True)
    display_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    picture_url: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    reset_tokens: Mapped[list["PasswordResetToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)  # sha256 hex = 64 chars
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user: Mapped[User] = relationship(back_populates="reset_tokens")


Index("ix_password_reset_tokens_user_id_used_at", PasswordResetToken.user_id, PasswordResetToken.used_at)
