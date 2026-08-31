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

from sqlalchemy import String, Text, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    google_sub: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, unique=True, index=True)
    apple_sub: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, unique=True, index=True)
    # Share v2.0: permanent (regenerable) friend code — QR / invite links carry it.
    friend_code: Mapped[Optional[str]] = mapped_column(String(16), nullable=True, unique=True, index=True)
    display_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    picture_url: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)
    # Share v2.0 (08-25): small (~128px) base64 avatar synced from the device's
    # local store so FRIENDS see it too. picture_url (Google) wins if present.
    avatar_b64: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
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


# ── Share v2.0 (friends-only social layer — see backend/share.py) ──────────

class Friendship(Base):
    """One row per user pair, normalized so user_lo < user_hi (no dup pairs).

    status: 'accepted' (formed instantly on code redemption — handing someone
    your code IS the consent) or 'blocked' (hidden both ways; blocked_by
    records who did it so only they could ever lift it)."""
    __tablename__ = "friendships"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_lo: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    user_hi: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="accepted")
    requested_by: Mapped[Optional[int]] = mapped_column(nullable=True)
    blocked_by: Mapped[Optional[int]] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (Index("ix_friendships_pair", "user_lo", "user_hi", unique=True),)


class SharePhoto(Base):
    """A friends-visible photo. TEST-PHASE: image stored as base64 TEXT in
    Postgres (swap to Vercel Blob URL before public launch — see share.py)."""
    __tablename__ = "share_photos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    anchor_type: Mapped[str] = mapped_column(String(8), nullable=False)  # 'place' | 'moment'
    place_id: Mapped[Optional[str]] = mapped_column(String(80), nullable=True, index=True)
    place_name: Mapped[Optional[str]] = mapped_column(String(160), nullable=True)
    area_label: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    # Photo-level pin (2026-08-25): EXIF GPS read client-side BEFORE the strip,
    # or device location — stored explicitly so friends' maps can pin ANY place,
    # not just dataset places. User can decline per photo (nulls).
    lat: Mapped[Optional[float]] = mapped_column(nullable=True)
    lng: Mapped[Optional[float]] = mapped_column(nullable=True)
    group_id: Mapped[Optional[str]] = mapped_column(String(40), nullable=True, index=True)  # multi-image post
    kind: Mapped[str] = mapped_column(String(8), nullable=False, default="vibe")  # food|view|vibe
    caption: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    image_b64: Mapped[str] = mapped_column(Text, nullable=False)
    thumb_b64: Mapped[str] = mapped_column(Text, nullable=False)
    taken_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(12), nullable=False, default="ok")  # ok|flagged|removed
    reports_count: Mapped[int] = mapped_column(nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ShareComment(Base):
    """Friend comments on a photo (2026-08-25). Visibility follows the photo:
    owner + owner's accepted friends. Deletable by author or photo owner —
    the owner moderates their own Stoop. TODO Batch 5: extend report flow."""
    __tablename__ = "share_comments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    photo_id: Mapped[int] = mapped_column(ForeignKey("share_photos.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    text: Mapped[str] = mapped_column(String(300), nullable=False)
    status: Mapped[str] = mapped_column(String(12), nullable=False, default="ok")  # ok|flagged
    reports_count: Mapped[int] = mapped_column(nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
