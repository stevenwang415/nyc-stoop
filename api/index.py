"""Vercel Python function entrypoint.

Vercel's Python runtime serves any ASGI `app` exported from a file under /api.
We point it at the existing FastAPI application in backend/ — rewrites in
vercel.json route /auth/* and /health here, so the same Vercel project hosts
both the static frontend and the API (same origin, no CORS needed for the web;
the iOS app's capacitor://localhost origin is covered by CORS_ORIGINS).
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app  # noqa: E402,F401
