# NYC Stoop API

FastAPI backend for NYC Stoop. Handles email/password + Google sign-in, password reset email via Resend, and JWT issuance. Hosted on Google Cloud Run, talks to Neon Postgres via SQLAlchemy.

## Endpoints

| Method | Path | What it does |
| --- | --- | --- |
| POST | `/auth/signup` | Email + password account creation |
| POST | `/auth/login` | Email + password sign-in. Constant-time. |
| POST | `/auth/google` | Verify Google ID token, upsert user, return app JWT |
| POST | `/auth/forgot-password` | Send password-reset email. Always 200 (no enumeration). |
| POST | `/auth/reset-password` | Consume reset token, set new password, sign in |
| GET | `/auth/me` | Returns the current user (Bearer JWT required) |
| PATCH | `/auth/me?display_name=...` | Update display name |
| GET | `/health` | Cloud Run health check |

Interactive docs at `/docs` (Swagger UI) and `/redoc`.

## Local dev

```bash
cd backend
cp .env.example .env  # fill values — see below
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open <http://localhost:8000/docs> to poke at the endpoints.

## Required env vars

See [.env.example](./.env.example) for the full list. The minimum to boot:

- `DATABASE_URL` — Neon pooled Postgres URL
- `JWT_SECRET` — random 32+ byte secret. Generate with `python -c "import secrets; print(secrets.token_urlsafe(48))"`
- `GOOGLE_CLIENT_ID` — Web client ID from Google Cloud Console
- `RESEND_API_KEY` — set to `dev` locally to log emails to console instead of sending
- `FRONTEND_URL` — used to build the reset link URL emailed to users

## Deploy to Cloud Run

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT

# Build + push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT/nyc-stoop-api backend

# Deploy
gcloud run deploy nyc-stoop-api \
  --image gcr.io/YOUR_PROJECT/nyc-stoop-api \
  --region us-east1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=...,JWT_SECRET=...,GOOGLE_CLIENT_ID=...,RESEND_API_KEY=...,RESEND_FROM=...,FRONTEND_URL=...,CORS_ORIGINS=..."
```

For secrets, prefer Secret Manager refs over `--set-env-vars` once you're past the bootstrap stage.

## Schema bootstrap

`main.py` calls `Base.metadata.create_all()` on boot so a fresh Neon database stands up without Alembic. Once the schema changes, switch to Alembic — `create_all` will not modify existing tables.

## Security notes

- Passwords: SHA-256 pre-hash → bcrypt (cost 12) to dodge bcrypt's 72-byte limit
- Login is constant-time even when the email doesn't exist (dummy bcrypt verify)
- Forgot-password always returns 200 (no user enumeration)
- Reset tokens: 32-byte random, SHA-256 stored, single-use, 1-hour TTL
- JWTs: HS256 with `JWT_SECRET`, default 24h expiry (`ACCESS_TOKEN_EXPIRE_MINUTES`)
- Google ID tokens are verified server-side via `google-auth` against `GOOGLE_CLIENT_ID`
