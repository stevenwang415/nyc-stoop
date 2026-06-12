"""Resend wrapper for transactional email.

We only need one outbound template right now: the password reset email.
Adds a graceful local-dev mode: when RESEND_API_KEY is missing or 'dev',
we log the email to stdout instead of sending. Makes local testing painless.
"""
from __future__ import annotations

import logging
import os

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
RESEND_FROM = os.environ.get("RESEND_FROM", "NYC Stoop <onboarding@resend.dev>")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173").rstrip("/")


def send_password_reset_email(to_email: str, raw_token: str) -> None:
    """Send the reset link. Swallows transport errors and logs them — never raises into
    a request handler, because we always want /auth/forgot-password to return 200."""
    reset_url = f"{FRONTEND_URL}/?reset_token={raw_token}"
    subject = "Reset your NYC Stoop password"
    html = _build_html(reset_url)
    text = _build_text(reset_url)

    if not RESEND_API_KEY or RESEND_API_KEY in ("dev", "local"):
        # Dev mode: log instead of send so we can copy the URL out of the console.
        logger.warning(
            "[dev] Skipping email send. Reset URL for %s:\n%s",
            to_email, reset_url,
        )
        return

    try:
        import resend
        resend.api_key = RESEND_API_KEY
        resend.Emails.send({
            "from": RESEND_FROM,
            "to": [to_email],
            "subject": subject,
            "html": html,
            "text": text,
        })
    except Exception as exc:  # pragma: no cover - depends on network
        logger.exception("Resend send failed for %s: %s", to_email, exc)


def _build_html(reset_url: str) -> str:
    # Plain HTML, no templating engine — small enough to inline.
    return f"""\
<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fafafa;padding:40px 20px;color:#111;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;">
    <h1 style="margin:0 0 8px;font-size:22px;">Reset your password</h1>
    <p style="margin:0 0 24px;color:#444;font-size:15px;line-height:1.6;">
      Tap the button below to set a new password for your NYC Stoop account.
      This link expires in 1 hour.
    </p>
    <p style="margin:0 0 28px;">
      <a href="{reset_url}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px;font-size:14px;">Reset password</a>
    </p>
    <p style="margin:0;color:#777;font-size:12px;line-height:1.6;">
      Or paste this URL into your browser:<br>
      <span style="color:#444;word-break:break-all;">{reset_url}</span>
    </p>
    <p style="margin:24px 0 0;color:#999;font-size:12px;line-height:1.6;">
      Didn't ask for this? You can ignore this email — your password won't change.
    </p>
  </div>
</body></html>"""


def _build_text(reset_url: str) -> str:
    return (
        "Reset your NYC Stoop password\n\n"
        "Tap this link to set a new password (expires in 1 hour):\n"
        f"{reset_url}\n\n"
        "Didn't ask for this? You can ignore this email."
    )
