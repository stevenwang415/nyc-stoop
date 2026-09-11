# ── Cloudflare R2 object storage (2026-09-10) ──────────────────────────────
# Photo bytes moved OUT of Postgres after the Neon free-tier transfer blowout
# (5 GB/month burned by base64 images riding in every feed response). R2 holds
# the JPEGs; Neon keeps only object keys. Reads go straight R2 → client via
# short-lived presigned URLs, so image traffic never counts against Neon or
# Vercel again — and R2 egress is $0 at any volume.
#
# Friends-only privacy is preserved: the bucket is private; URLs are presigned
# per-request by endpoints that already enforce owner/friend access, and they
# expire (default 1 h).
#
# Env (Vercel + backend/.env):
#   R2_ACCOUNT_ID        Cloudflare account id (dashboard → R2 → API)
#   R2_ACCESS_KEY_ID     R2 API token key id  (Object Read & Write)
#   R2_SECRET_ACCESS_KEY R2 API token secret
#   R2_BUCKET            bucket name, e.g. nyc-stoop-photos
#
# Unset env → r2_enabled() is False and share.py falls back to the legacy
# base64-in-Postgres path, so deploying this code BEFORE the bucket exists is
# safe.
import os
from functools import lru_cache

_ACCOUNT = os.environ.get("R2_ACCOUNT_ID", "").strip()
_KEY_ID = os.environ.get("R2_ACCESS_KEY_ID", "").strip()
_SECRET = os.environ.get("R2_SECRET_ACCESS_KEY", "").strip()
_BUCKET = os.environ.get("R2_BUCKET", "").strip()


def r2_enabled() -> bool:
    return bool(_ACCOUNT and _KEY_ID and _SECRET and _BUCKET)


@lru_cache(maxsize=1)
def _client():
    import boto3
    from botocore.config import Config
    return boto3.client(
        "s3",
        endpoint_url=f"https://{_ACCOUNT}.r2.cloudflarestorage.com",
        aws_access_key_id=_KEY_ID,
        aws_secret_access_key=_SECRET,
        region_name="auto",
        config=Config(signature_version="s3v4"),
    )


def r2_put(key: str, data: bytes, content_type: str = "image/jpeg") -> None:
    _client().put_object(Bucket=_BUCKET, Key=key, Body=data, ContentType=content_type)


def r2_url(key: str, expires: int = 3600) -> str:
    """Presigned GET — cheap to mint (local HMAC, no network round-trip)."""
    return _client().generate_presigned_url(
        "get_object", Params={"Bucket": _BUCKET, "Key": key}, ExpiresIn=expires
    )


def r2_delete(keys: list) -> None:
    """Best-effort delete; a failed cleanup must never block the DB delete."""
    try:
        objs = [{"Key": k} for k in keys if k]
        if objs:
            _client().delete_objects(Bucket=_BUCKET, Delete={"Objects": objs, "Quiet": True})
    except Exception:
        pass
