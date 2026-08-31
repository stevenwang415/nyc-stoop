"""Share v2.0 router: friends + photos (friends-only visibility).

Model decisions (SHARE_SPEC_v2.0.md, locked with Steven 2026-08-20):
- Friends-only, in-app only. No public content anywhere.
- Friendship forms by REDEEMING a friend code (QR / invite link) — no user
  search, no request/accept round-trip: handing someone your code IS consent,
  so redemption creates the friendship immediately. Codes are regenerable
  (leak recovery). Block hides both directions and survives unfriending.
- Photos: anchored to a place (dataset id + denormalized name — the dataset
  lives client-side, the server never needs it) or a "moment" (area label
  only). Client uploads a ≤1600px JPEG as base64 plus a ~320px thumbnail;
  feeds return the thumbnail inline, the full image is fetched per-photo by
  an authenticated call (img tags can't send Bearer headers).

TEST-PHASE STORAGE NOTE: images live as base64 TEXT in Postgres — zero new
infrastructure, fine for friends-scale testing. Before public launch swap to
Vercel Blob (signed direct uploads) and keep only the blob URL here; the
endpoint shapes are already compatible with that swap.
"""
from __future__ import annotations

import os
import secrets
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field
from sqlalchemy import and_, or_, select, text
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Friendship, ShareComment, SharePhoto, User

router = APIRouter(prefix="/share", tags=["share"])

# ── Official seed friend (cold-start fix, REVIEW_SHARE gate 1) ─────────────
# The MySpace-Tom move, Corner's community content smuggled through the
# friends-only model: every user's FIRST Share visit auto-friends the official
# NYC Stoop account, so From friends / the map are alive on day one. The
# account is an ordinary users row — create it via normal signup with this
# email, set display name + avatar, post curated photos. Removable like any
# friend; seeding happens ONCE (tied to first friend-code creation), so an
# unfriend is respected forever.
OFFICIAL_EMAIL = os.environ.get("SHARE_OFFICIAL_EMAIL", "").strip().lower()


def _seed_official_friend(db: Session, user: User) -> None:
    if not OFFICIAL_EMAIL or user.email.lower() == OFFICIAL_EMAIL:
        return
    official = db.execute(select(User).where(User.email == OFFICIAL_EMAIL)).scalar_one_or_none()
    if not official or _friendship(db, user.id, official.id):
        return
    lo, hi = _pair(user.id, official.id)
    db.add(Friendship(user_lo=lo, user_hi=hi, status="accepted", requested_by=official.id))
    db.commit()

# ── Helpers ────────────────────────────────────────────────────────────────

_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"  # no 0/O/1/I/L lookalikes


def _new_code() -> str:
    return "".join(secrets.choice(_CODE_ALPHABET) for _ in range(8))


def _ensure_code(db: Session, user: User) -> str:
    if not user.friend_code:
        # Retry on the (astronomically unlikely) unique collision.
        for _ in range(4):
            user.friend_code = _new_code()
            try:
                db.commit()
                break
            except Exception:  # noqa: BLE001
                db.rollback()
        db.refresh(user)
    return user.friend_code


def _pair(a: int, b: int) -> tuple[int, int]:
    return (a, b) if a < b else (b, a)


def _friendship(db: Session, a: int, b: int) -> Optional[Friendship]:
    lo, hi = _pair(a, b)
    return db.execute(
        select(Friendship).where(Friendship.user_lo == lo, Friendship.user_hi == hi)
    ).scalar_one_or_none()


def _accepted_friend_ids(db: Session, user_id: int) -> list[int]:
    rows = db.execute(
        select(Friendship).where(
            Friendship.status == "accepted",
            or_(Friendship.user_lo == user_id, Friendship.user_hi == user_id),
        )
    ).scalars().all()
    return [f.user_hi if f.user_lo == user_id else f.user_lo for f in rows]


def _public_user(u: User) -> dict:
    return {"id": u.id, "display_name": u.display_name or u.email.split("@")[0],
            "picture_url": u.picture_url, "avatar_b64": u.avatar_b64,
            "official": bool(OFFICIAL_EMAIL and u.email.lower() == OFFICIAL_EMAIL)}


# ── Schemas ────────────────────────────────────────────────────────────────

class RedeemIn(BaseModel):
    code: str = Field(min_length=4, max_length=16)


class PhotoEditIn(BaseModel):
    """Label edits only — the image itself is immutable (re-post to change it)."""
    place_id: Optional[str] = Field(default=None, max_length=80)
    place_name: Optional[str] = Field(default=None, max_length=160)
    area_label: Optional[str] = Field(default=None, max_length=80)
    kind: Optional[str] = Field(default=None, pattern="^(food|view|vibe)$")
    caption: Optional[str] = Field(default=None, max_length=200)
    lat: Optional[float] = Field(default=None, ge=-90, le=90)
    lng: Optional[float] = Field(default=None, ge=-180, le=180)


class PhotoIn(BaseModel):
    anchor_type: str = Field(pattern="^(place|moment)$")
    place_id: Optional[str] = Field(default=None, max_length=80)
    place_name: Optional[str] = Field(default=None, max_length=160)
    area_label: Optional[str] = Field(default=None, max_length=80)
    kind: str = Field(default="vibe", pattern="^(food|view|vibe)$")
    caption: Optional[str] = Field(default=None, max_length=200)
    lat: Optional[float] = Field(default=None, ge=-90, le=90)
    lng: Optional[float] = Field(default=None, ge=-180, le=180)
    group_id: Optional[str] = Field(default=None, max_length=40)  # multi-image post
    # data-URL payloads WITHOUT the "data:image/jpeg;base64," prefix.
    image_b64: str = Field(min_length=100, max_length=900_000)   # ≈ 650 KB image
    thumb_b64: str = Field(min_length=50, max_length=60_000)     # ≈ 45 KB thumb
    taken_at: Optional[datetime] = None


def _photo_meta(p: SharePhoto, author: dict) -> dict:
    return {
        "id": p.id,
        "author": author,
        "anchor_type": p.anchor_type,
        "place_id": p.place_id,
        "place_name": p.place_name,
        "area_label": p.area_label,
        "lat": p.lat,
        "lng": p.lng,
        "group_id": p.group_id,
        "kind": p.kind,
        "caption": p.caption,
        "thumb_b64": p.thumb_b64,
        "taken_at": p.taken_at.isoformat() if p.taken_at else None,
        "created_at": p.created_at.isoformat() if p.created_at else None,
    }


# ── Friends (Steven's rank 1) ──────────────────────────────────────────────

@router.get("/me/code")
def my_code(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    first_visit = not user.friend_code
    code = _ensure_code(db, user)
    if first_visit:
        _seed_official_friend(db, user)
    return {"code": code}


@router.post("/me/code/regenerate")
def regenerate_code(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """Leak recovery: old code stops working immediately; friendships persist."""
    user.friend_code = None
    db.commit()
    return {"code": _ensure_code(db, user)}


@router.post("/friends/redeem")
def redeem(body: RedeemIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    # A redeem can be a user's FIRST Share interaction (future invite deep
    # links skip the tab) — run the same first-visit bootstrap as /me/code
    # (e2e regression 2026-08-25: redeem-before-code skipped official seeding).
    if not user.friend_code:
        _ensure_code(db, user)
        _seed_official_friend(db, user)
    code = body.code.strip().upper()
    other = db.execute(select(User).where(User.friend_code == code)).scalar_one_or_none()
    if not other:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with that code")
    if other.id == user.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "That's your own code")
    existing = _friendship(db, user.id, other.id)
    if existing:
        if existing.status == "blocked":
            # Deliberately indistinguishable from "not found" — a blocked
            # party must not learn they were blocked by probing the code.
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with that code")
        return {"ok": True, "already_friends": True, "friend": _public_user(other)}
    lo, hi = _pair(user.id, other.id)
    db.add(Friendship(user_lo=lo, user_hi=hi, status="accepted", requested_by=user.id))
    db.commit()
    return {"ok": True, "already_friends": False, "friend": _public_user(other)}


@router.get("/friends")
def list_friends(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    ids = _accepted_friend_ids(db, user.id)
    users = db.execute(select(User).where(User.id.in_(ids))).scalars().all() if ids else []
    return {"friends": [_public_user(u) for u in users]}


@router.delete("/friends/{friend_id}")
def unfriend(friend_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    f = _friendship(db, user.id, friend_id)
    if f and f.status == "accepted":
        db.delete(f)
        db.commit()
    return {"ok": True}


@router.post("/friends/{friend_id}/block")
def block(friend_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """Blocks both directions: content hidden both ways, code redemption dead."""
    if friend_id == user.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Cannot block yourself")
    f = _friendship(db, user.id, friend_id)
    if f:
        f.status = "blocked"
        f.blocked_by = user.id
    else:
        lo, hi = _pair(user.id, friend_id)
        db.add(Friendship(user_lo=lo, user_hi=hi, status="blocked",
                          requested_by=user.id, blocked_by=user.id))
    db.commit()
    return {"ok": True}


# ── Photos (rank 2) ────────────────────────────────────────────────────────

@router.post("/photos")
def create_photo(body: PhotoIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    if body.anchor_type == "place" and not (body.place_id or body.place_name):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "place anchor needs place_id or place_name")
    if body.anchor_type == "moment" and not body.area_label:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "moment anchor needs area_label")
    # Spam brake: 30 photos/day.
    from datetime import timedelta, timezone
    cutoff = datetime.now(timezone.utc) - timedelta(days=1)
    today_count = db.execute(
        select(SharePhoto.id).where(SharePhoto.user_id == user.id, SharePhoto.created_at > cutoff)
    ).all()
    today_count = len(today_count)
    if today_count >= 30:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Daily photo limit reached")
    p = SharePhoto(
        user_id=user.id, anchor_type=body.anchor_type, place_id=body.place_id,
        place_name=body.place_name, area_label=body.area_label,
        lat=body.lat, lng=body.lng, group_id=body.group_id, kind=body.kind,
        caption=(body.caption or None), image_b64=body.image_b64,
        thumb_b64=body.thumb_b64, taken_at=body.taken_at,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"ok": True, "photo": _photo_meta(p, _public_user(user))}


@router.patch("/photos/{photo_id}")
def edit_photo(photo_id: int, body: PhotoEditIn,
               user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """Owner-only label edits: place/area, kind, caption. Image immutable."""
    p = db.get(SharePhoto, photo_id)
    if not p or p.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    if not (body.place_name or body.place_id or body.area_label):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "needs a place or an area")
    p.place_id = body.place_id
    p.place_name = body.place_name
    p.area_label = body.area_label
    p.anchor_type = "place" if (body.place_id or body.place_name) else "moment"
    if body.kind:
        p.kind = body.kind
    p.caption = body.caption or None
    p.lat = body.lat
    p.lng = body.lng
    db.commit()
    db.refresh(p)
    return {"ok": True, "photo": _photo_meta(p, _public_user(user))}


@router.get("/photos/mine")
def my_photos(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    rows = db.execute(
        select(SharePhoto).where(SharePhoto.user_id == user.id, SharePhoto.status == "ok")
        .order_by(SharePhoto.created_at.desc()).limit(200)
    ).scalars().all()
    me = _public_user(user)
    return {"photos": [_photo_meta(p, me) for p in rows]}


@router.get("/feed")
def friends_feed(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """Rank 3: recent photos from accepted friends, newest first."""
    ids = _accepted_friend_ids(db, user.id)
    if not ids:
        return {"photos": []}
    rows = db.execute(
        select(SharePhoto, User).join(User, SharePhoto.user_id == User.id)
        .where(SharePhoto.user_id.in_(ids), SharePhoto.status == "ok")
        .order_by(SharePhoto.created_at.desc()).limit(60)
    ).all()
    return {"photos": [_photo_meta(p, _public_user(u)) for (p, u) in rows]}


@router.get("/photos/{photo_id}/image")
def photo_image(photo_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Response:
    """Full-size image — access-checked: owner or accepted friend only."""
    p = db.get(SharePhoto, photo_id)
    if not p or p.status != "ok":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    if p.user_id != user.id and p.user_id not in _accepted_friend_ids(db, user.id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")  # don't leak existence
    import base64
    return Response(content=base64.b64decode(p.image_b64), media_type="image/jpeg",
                    headers={"Cache-Control": "private, max-age=86400"})


@router.delete("/photos/{photo_id}")
def delete_photo(photo_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    p = db.get(SharePhoto, photo_id)
    if p and p.user_id == user.id:
        db.delete(p)
        db.commit()
    return {"ok": True}


@router.post("/photos/{photo_id}/report")
def report_photo(photo_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """Guideline 1.2: reports auto-hide at 2 pending review (Neon SQL editor:
    SELECT * FROM share_photos WHERE status='flagged';)."""
    p = db.get(SharePhoto, photo_id)
    if not p:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    p.reports_count = (p.reports_count or 0) + 1
    if p.reports_count >= 2:
        p.status = "flagged"
    db.commit()
    return {"ok": True}


# ── Comments (2026-08-25) ──────────────────────────────────────────────────

class CommentIn(BaseModel):
    text: str = Field(min_length=1, max_length=300)


def _photo_visible(db: Session, user: User, p: Optional[SharePhoto]) -> bool:
    return bool(p and p.status == "ok" and (
        p.user_id == user.id or p.user_id in _accepted_friend_ids(db, user.id)))


def _comment_meta(c: ShareComment, author: dict) -> dict:
    return {"id": c.id, "author": author, "text": c.text,
            "created_at": c.created_at.isoformat() if c.created_at else None}


@router.get("/photos/{photo_id}/comments")
def list_comments(photo_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    p = db.get(SharePhoto, photo_id)
    if not _photo_visible(db, user, p):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    rows = db.execute(
        select(ShareComment, User).join(User, User.id == ShareComment.user_id)
        .where(ShareComment.photo_id == photo_id, ShareComment.status == "ok")
        .order_by(ShareComment.created_at)
    ).all()
    return {"comments": [_comment_meta(c, _public_user(u)) for c, u in rows]}


@router.post("/photos/{photo_id}/comments")
def add_comment(photo_id: int, body: CommentIn,
                user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    p = db.get(SharePhoto, photo_id)
    if not _photo_visible(db, user, p):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    c = ShareComment(photo_id=photo_id, user_id=user.id, text=body.text.strip())
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"ok": True, "comment": _comment_meta(c, _public_user(user))}


@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    c = db.get(ShareComment, comment_id)
    if c:
        p = db.get(SharePhoto, c.photo_id)
        # Author removes their words; the photo owner moderates their Stoop.
        if c.user_id == user.id or (p and p.user_id == user.id):
            db.delete(c)
            db.commit()
    return {"ok": True}


# ── Notifications (2026-08-25): derived, no new table ──────────────────────
# Two event kinds: comments by others on MY photos, and friends' new photos.
# "Unread" lives client-side (nyc_share_seen_ts) — the server just reports
# recent events; no read-state rows to migrate later.

@router.get("/notifications")
def notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    events = []
    rows = db.execute(
        select(ShareComment, SharePhoto, User)
        .join(SharePhoto, SharePhoto.id == ShareComment.photo_id)
        .join(User, User.id == ShareComment.user_id)
        .where(SharePhoto.user_id == user.id, ShareComment.user_id != user.id)
        .order_by(ShareComment.created_at.desc()).limit(30)
    ).all()
    for c, p, u in rows:
        events.append({"type": "comment", "photo_id": p.id, "author": _public_user(u),
                       "text": c.text, "place_name": p.place_name or p.area_label,
                       "created_at": c.created_at.isoformat() if c.created_at else None})
    ids = _accepted_friend_ids(db, user.id)
    if ids:
        prows = db.execute(
            select(SharePhoto, User).join(User, User.id == SharePhoto.user_id)
            .where(SharePhoto.user_id.in_(ids), SharePhoto.status == "ok")
            .order_by(SharePhoto.created_at.desc()).limit(30)
        ).all()
        for p, u in prows:
            events.append({"type": "photo", "photo_id": p.id, "author": _public_user(u),
                           "place_name": p.place_name or p.area_label,
                           "created_at": p.created_at.isoformat() if p.created_at else None})
    frows = db.execute(
        select(Friendship).where(
            Friendship.status == "accepted",
            or_(Friendship.user_lo == user.id, Friendship.user_hi == user.id),
        ).order_by(Friendship.created_at.desc()).limit(15)
    ).scalars().all()
    for f in frows:
        other_id = f.user_hi if f.user_lo == user.id else f.user_lo
        other = db.get(User, other_id)
        if other:
            events.append({"type": "friend", "author": _public_user(other),
                           "created_at": f.created_at.isoformat() if f.created_at else None})
    events.sort(key=lambda e: e["created_at"] or "", reverse=True)
    return {"events": events[:40]}


class AvatarIn(BaseModel):
    avatar_b64: str = Field(min_length=50, max_length=60_000)  # ~45 KB max


@router.post("/me/avatar")
def set_avatar(body: AvatarIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """Device-local avatar synced up so friends see it (08-25)."""
    user.avatar_b64 = body.avatar_b64
    db.commit()
    return {"ok": True}


class NameIn(BaseModel):
    display_name: str = Field(min_length=1, max_length=40)


@router.post("/me/name")
def set_name(body: NameIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """Ship-gate 2 (REVIEW_SHARE_2026-08-25): users choose how friends see them."""
    user.display_name = body.display_name.strip()
    db.commit()
    return {"ok": True, "user": _public_user(user)}


@router.post("/comments/{comment_id}/report")
def report_comment(comment_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """Ship-gate 5: comment UGC parity with photos — 2 reports auto-hide."""
    c = db.get(ShareComment, comment_id)
    if not c:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    p = db.get(SharePhoto, c.photo_id)
    if not _photo_visible(db, user, p):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    c.reports_count = (c.reports_count or 0) + 1
    if c.reports_count >= 2:
        c.status = "flagged"
    db.commit()
    return {"ok": True}


# ── Place search via Apple Maps Server API (2026-08-28) ────────────────────
# POI coverage Nominatim can't match ("Dudleys" gap). 25k calls/day free with
# the Apple Developer membership. Server-side only: the .p8 key never ships.
# Env (Vercel + backend/.env): APPLE_MAPS_TEAM_ID, APPLE_MAPS_KEY_ID,
# APPLE_MAPS_P8 (private key PEM; \n-escaped newlines OK).
# Unconfigured → 503, and the client quietly falls back to Nominatim.
import time as _time

_APPLE_TOKEN: dict = {"value": None, "exp": 0}


def _apple_access_token() -> Optional[str]:
    team = os.environ.get("APPLE_MAPS_TEAM_ID")
    kid = os.environ.get("APPLE_MAPS_KEY_ID")
    p8 = os.environ.get("APPLE_MAPS_P8", "").replace("\\n", "\n")
    if not (team and kid and p8):
        return None
    if _APPLE_TOKEN["value"] and _time.time() < _APPLE_TOKEN["exp"] - 60:
        return _APPLE_TOKEN["value"]
    import jwt as _jwt
    import requests as _requests
    now = int(_time.time())
    auth_jwt = _jwt.encode(
        {"iss": team, "iat": now, "exp": now + 1200},
        p8, algorithm="ES256", headers={"kid": kid, "typ": "JWT"},
    )
    r = _requests.get("https://maps-api.apple.com/v1/token",
                      headers={"Authorization": "Bearer " + auth_jwt}, timeout=8)
    if r.status_code != 200:
        return None
    data = r.json()
    _APPLE_TOKEN["value"] = data.get("accessToken")
    _APPLE_TOKEN["exp"] = _time.time() + int(data.get("expiresInSeconds", 1800))
    return _APPLE_TOKEN["value"]


@router.get("/place-search")
def place_search(q: str, user: User = Depends(get_current_user)) -> dict:
    """Auth-required (quota belongs to signed-in users). NYC-biased."""
    q = (q or "").strip()
    if len(q) < 2:
        return {"results": []}
    token = _apple_access_token()
    if not token:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "search not configured")
    import requests as _requests
    r = _requests.get(
        "https://maps-api.apple.com/v1/search",
        params={"q": q, "limitToCountries": "US",
                "searchLocation": "40.7359,-73.9911",
                "lang": "en-US"},
        headers={"Authorization": "Bearer " + token}, timeout=8,
    )
    if r.status_code != 200:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "search upstream error")
    out = []
    for res in (r.json().get("results") or [])[:6]:
        c = res.get("coordinate") or {}
        lat, lng = c.get("latitude"), c.get("longitude")
        if lat is None or lng is None:
            continue
        # keep it metro-NYC
        if not (40.45 < lat < 40.95 and -74.30 < lng < -73.65):
            continue
        addr = (res.get("formattedAddressLines") or [""])[0]
        cat = (res.get("poiCategory") or "").replace("_", " ").title()
        out.append({"name": res.get("name") or q, "detail": " · ".join(x for x in [cat, addr] if x),
                    "lat": lat, "lng": lng})
    return {"results": out}
