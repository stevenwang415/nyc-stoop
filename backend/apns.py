# ── APNs push notifications (2026-09-24, v2.2) ─────────────────────────────
# Real lock-screen notifications for friend activity: new post, comment, like.
#
# Transport: APNs HTTP/2 API (api.push.apple.com) with an ES256 provider JWT
# — same signing machinery as the Apple Maps proxy (pyjwt + cryptography),
# plus httpx[http2] because APNs speaks HTTP/2 only.
#
# Env (Vercel + backend/.env):
#   APNS_TEAM_ID   Apple Developer team (95KLZBPNS4)
#   APNS_KEY_ID    the APNs Auth Key id (dev portal → Keys → new key with
#                  "Apple Push Notifications service" checked)
#   APNS_P8        the .p8 contents, one line with \n escapes (like the Maps key)
#   APNS_TOPIC     bundle id — com.nycstoop.app
#   APNS_SANDBOX   "1" to hit the sandbox gateway (Xcode dev builds); unset
#                  or "0" for production (TestFlight + App Store builds).
#
# Unset env → apns_enabled() False and every send is a silent no-op, so this
# deploys safely before the key exists.
import os
import time

_TEAM = os.environ.get("APNS_TEAM_ID", "").strip()
_KEY_ID = os.environ.get("APNS_KEY_ID", "").strip()
_P8 = os.environ.get("APNS_P8", "").replace("\\n", "\n").strip()
_TOPIC = os.environ.get("APNS_TOPIC", "com.nycstoop.app").strip()
_HOST = ("https://api.sandbox.push.apple.com"
         if os.environ.get("APNS_SANDBOX", "").strip() == "1"
         else "https://api.push.apple.com")

_jwt_cache = {"token": None, "iat": 0}


def apns_enabled() -> bool:
    return bool(_TEAM and _KEY_ID and _P8)


def _provider_jwt() -> str:
    # APNs accepts a provider token for up to an hour; refresh at 45 min.
    now = int(time.time())
    if _jwt_cache["token"] and now - _jwt_cache["iat"] < 2700:
        return _jwt_cache["token"]
    import jwt as pyjwt
    tok = pyjwt.encode({"iss": _TEAM, "iat": now}, _P8, algorithm="ES256",
                       headers={"kid": _KEY_ID})
    _jwt_cache.update(token=tok, iat=now)
    return tok


def send_push(tokens: list, title: str, body: str) -> dict:
    """Best-effort fan-out to a list of device tokens. Returns per-token
    status; 410/BadDeviceToken tokens should be pruned by the caller."""
    if not (apns_enabled() and tokens):
        return {}
    import httpx
    payload = {"aps": {"alert": {"title": title, "body": body}, "sound": "default"}}
    headers = {
        "authorization": "bearer " + _provider_jwt(),
        "apns-topic": _TOPIC,
        "apns-push-type": "alert",
        "apns-priority": "10",
    }
    results = {}
    try:
        with httpx.Client(http2=True, timeout=8.0) as client:
            for t in tokens:
                try:
                    r = client.post(f"{_HOST}/3/device/{t}", json=payload, headers=headers)
                    results[t] = r.status_code
                except Exception:
                    results[t] = 0
    except Exception:
        pass
    return results
