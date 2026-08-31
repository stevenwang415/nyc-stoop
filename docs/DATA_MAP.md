# NYC Stoop — Data Map (2026-08-23)

Where every piece of data lives. Three homes + one dev-only sandbox.

---

## 1. Server — Neon Postgres (via FastAPI in `backend/`, deployed on Vercel)

The ONLY place user data crosses devices. Connection string lives in the
Vercel project env (`DATABASE_URL`); browse it in the Neon SQL editor.

| Table | What's in it | Since |
|---|---|---|
| `users` | Accounts: email, password hash (null for social-only), `google_sub`, `apple_sub`, display_name, picture_url, `friend_code` (Share) | v1.0 |
| `password_reset_tokens` | SHA-256 hashes of reset links, TTL 1h, single-use | v1.0 |
| `feedback` | In-app feedback notes (+ emailed copy to Gmail) | v1.0 |
| `friendships` | Share v2.0: one row per user pair (normalized lo/hi), status accepted/blocked | not deployed yet |
| `share_photos` | Share v2.0: photo metadata + base64 image/thumb (⚠ swap to Vercel Blob before launch) | not deployed yet |

Schema bootstrap: `backend/main.py` runs `create_all` + idempotent ALTERs on
every boot — no migration tool until we outgrow it. New tables appear
automatically on the first deploy that contains them.

**What is deliberately NOT on the server:** saves, trip plans, notes,
preferences. Sign-in currently gates nothing — the account exists for
identity (and soon Share). Plans must move server-side before shared albums
(SHARE_SPEC_v2.0.md Phase 0).

## 2. On-device — localStorage (per browser / per iPhone webview)

All product state. Survives app updates; dies with app deletion; never syncs.
Key inventory (all prefixed `nyc_`):

- **Identity/session**: `nyc_token` (JWT), `nyc_user` (profile cache),
  `nyc_avatar_by_email` (local avatar store, survives sign-out)
- **Content**: `nyc_saved` (saves), `nyc_user_venues` (custom + merged seed
  places), `nyc_saved_events`
- **Planner working state**: `nyc_plan_sel/known/extra_ids`, `nyc_trip_start_date`,
  `nyc_trip_days`, `nyc_day_item_orders`, `nyc_stop_day_overrides`,
  `nyc_venue_swaps`, `nyc_checked_stops`, `nyc_collapsed_days`
- **Meals**: `nyc_meal_optins`, `nyc_skipped_meals`, `nyc_meal_cuisines`, `nyc_meal_picks`
- **Saved plans**: `nyc_plan_snapshots` (the full snapshot array), `nyc_plan_editing_id`, `nyc_plan_saved_flag`
- **Prefs/flags**: `nyc_lang`, `nyc_temp_unit`, `nyc_onboarded_v2`, tutorial
  flags (`nyc_tut_*`, `nyc_map_tut_v1`), `nyc_plus_v1` (IAP owned),
  `nyc_founder_v1` + `nyc_founder_checked_v1` (founding-user grant)

Device-scoped keys (shared across accounts on one device) are listed in
`PROFILE_GLOBAL_KEYS` in App.jsx; the rest are wiped by account switch.

## 3. In the app bundle — static data files (`src/data/`)

The guide itself. Versioned in git, ships with every build, works offline.

| File | Contents |
|---|---|
| `places.js` | 868 seed places (identity/objective/editorial fields, provenance-split) |
| `content.js` | Editorial universe: 103 venues, 139 figures, 184 works, 44 topics, 8 domains |
| `restaurants.js` | Cuisine taxonomy + curated Planner pool + merged `PLANNER_RESTAURANTS` |
| `moods.js`, `tonight.js`, `subway.js`, `venueMeta.js`, `venueImages.js`, `userPicks.js` | Mood flows, tonight picks, subway data, venue coords/colors, images |
| `i18n/places.zh.js`, `i18n/content.zh.js` | zh-TW sidecars (719 + all content corpora) |

Editing rule: facts → `places.js` / `content.js`; recommendation behavior →
`restaurants.js`; translations → `i18n/` sidecars; UI strings → `src/lib/i18n.js`.

## 4. Dev-only sandboxes (never deployed, gitignored)

- `.dev-share.json` — the Vite dev-server Share mock's "database" (delete to reset)
- `backend/dev.db` — SQLite if you run the backend locally with uvicorn
- `backend/.env` — local-only secrets (SQLite URL + dev JWT secret)

---

## Decisions log

- **2026-08-23 — DynamoDB considered and rejected** (Steven): keep the
  three-home architecture as-is. Bundle data must stay offline-first; device
  state must stay local; server data is relational and Postgres already
  works. Revisit nothing until scale forces it. The one open storage change
  remains: photos move from base64-in-Postgres to a blob store (Vercel Blob
  or S3) before Share's public launch — that swap is the sanctioned place
  for AWS if wanted.

## The one-sentence version

**Postgres knows who you are; your device knows what you're planning; the
bundle knows the city; and everything social (Share) is about to make
Postgres know more.**
