# Share — v1.1 feature spec (2026-07-07)

**One line:** users post real photos of places they visited; everyone else sees
what a spot *actually* looks like, anchored to the place cards they already use.

**Status:** approved for v1.1, build starts after v1.0 App Store submission.

---

## 1. Why this feature (and why it fits this app)

- The app's identity is *honest curation*. Editorial descriptions say why a place
  matters; user photos prove what it looks like on a rainy Tuesday. They complete
  each other — this is not a bolt-on social network.
- Retention: v1.0 is strongest before/during a trip. Photos give users a reason
  to open the app *after* the visit — closing the loop (plan → go → share).
- Data flywheel: every photo enriches a place card the next user sees.

**Design principle: place-first, not people-first.** Photos belong to *places*.
No follower graphs, no DMs, no infinite algorithmic feed. This keeps the product
coherent AND keeps moderation scope sane.

---

## 2. UX design

### 2.1 Where it lives
- **Not a 5th tab.** The bottom nav is full (Explore · Events · Map · My Trip)
  and a "Share" tab implies a social feed we deliberately aren't building.
  Instead:
  - **Capture**: a "📷 Add photo" action on every place detail page + on trip
    stops you've checked off ("How was it? Add a photo").
  - **Consume**: a **"From visitors" photo strip** on each place card (between
    the editorial description and the tip), newest first.
  - **Browse**: a **"Recent photos" section on the Explore home** (below
    collections) — the light community layer, place-linked, capped at ~30 items.
- This delivers 90% of the value of a Share tab with a fraction of the surface.

### 2.2 Posting flow (3 taps)
1. Place page → "Add photo" → native picker/camera (needs `NSCameraUsageDescription`
   + `NSPhotoLibraryUsageDescription`).
2. Optional one-line caption (80 chars — captions are garnish, not essays).
3. Post → appears immediately for the author (optimistic), enters the public
   strip after moderation state allows (see §4).

Constraints: signed-in users only (accounts exist — this is what they're for);
max 3 photos per place per user per day (spam brake); client-side resize to
≤1600px before upload (data cost + storage).

### 2.3 Display
- Place card strip: horizontal scroll, 96px squares, tap → full-screen viewer
  with caption, author display name, relative date, and the ⋯ menu (report/delete).
- Author sees their own photos in Settings → "My photos" (list + delete).
- Empty state on place cards: nothing (no begging banner). The capture button is
  invitation enough.

---

## 3. Technical architecture

### 3.1 Storage
- **Vercel Blob** (already on Vercel; simplest) or Cloudflare R2 (cheaper at
  scale). v1.1: Vercel Blob, revisit at >10 GB.
- Upload: client asks API for a signed upload URL → uploads directly → posts
  metadata. Keeps images off the FastAPI function (body size + duration limits).

### 3.2 Data model (new table)
```sql
photos (
  id            serial primary key,
  user_id       int references users(id) on delete cascade,
  place_type    varchar(16),   -- 'venue' | 'seed' | 'sight'
  place_id      varchar(64),   -- matches existing ids
  blob_url      varchar(2048),
  caption       varchar(120),
  status        varchar(16) default 'pending',  -- pending|approved|rejected|removed
  reports_count int default 0,
  created_at    timestamptz default now()
)
```

### 3.3 Endpoints (FastAPI, same service)
- `POST /photos/upload-url` (auth) → signed blob URL
- `POST /photos` (auth) → create record
- `GET /photos?place_type=&place_id=` → approved photos for a place
- `GET /photos/recent` → home strip (approved, capped)
- `DELETE /photos/{id}` (auth, owner or admin)
- `POST /photos/{id}/report` (auth) → increments reports; auto-hide at 2 reports
  pending review
- `POST /users/{id}/block` (auth) → blocker never sees blockee's content

### 3.4 Frontend
- Reuse the existing card/sheet design language (warm `--card`, serif captions).
- Capacitor Camera plugin for capture; falls back to `<input type="file">` on web.

---

## 4. Apple Guideline 1.2 compliance (non-negotiable for UGC)

Apple rejects UGC apps that lack ALL of the following — build these WITH the
feature, not after:

1. **Content filtering** — server-side image moderation on upload before public
   visibility. v1.1: a vision-moderation API call (e.g. a nudity/violence
   classifier) gating `pending → approved`. Cheap, automated, demonstrable.
2. **Report mechanism** — ⋯ → "Report photo" on every photo (endpoint above).
   Auto-hide after 2 reports pending human review.
3. **Block users** — ⋯ → "Block this user"; server filters blocked authors from
   all reads for that user.
4. **Timely response** — commit (in App Review notes) to acting on reports
   within 24h. v1.1 admin tooling: a plain admin page (or even a SQL editor
   ritual) listing pending/reported photos with approve/remove.
5. **EULA/Terms** — add a UGC clause to the terms + a line in the privacy
   policy (photos are public, EXIF/location stripped on upload — strip it!).

Also: privacy nutrition label update (User Content — Photos, linked to account),
and the two new Info.plist permission strings.

---

## 5. Build plan (est. 2–3 weeks part-time)

| Phase | Scope |
|---|---|
| 1 (backend, ~3 days) | photos table, endpoints, blob upload, EXIF strip, moderation gate |
| 2 (capture, ~3 days) | Camera plugin, add-photo flow on place pages + checked trip stops |
| 3 (display, ~3 days) | place-card strip, full-screen viewer, home Recent section |
| 4 (compliance, ~3 days) | report/block flows, admin review page, terms + privacy updates |
| 5 (QA + submit, ~2 days) | device pass, TestFlight, v1.1 submission w/ review notes |

**Cut lines if needed:** home Recent section (ship place-strips only);
captions (photos-only v1). Never cut: anything in §4.

---

## 6. Success metrics (decide before building, judge after)

- % of trip-completing users who post ≥1 photo (target: >10%)
- Places with ≥1 user photo after 60 days (target: top-50 venues covered)
- Report rate (<1% of photos) and time-to-moderation (<24h)
- Retention: D14 for posters vs non-posters (the real justification)

---

## 7. Explicitly out of scope (v1.1)

Follower graphs, likes/comments, DMs, algorithmic feeds, videos, photo editing.
Each one multiplies moderation burden and dilutes place-first identity. Revisit
only with evidence users want it.

---

## 8. Tips as first-class content (added 2026-07-13 — the strategic point)

**The content-audit finding:** of the 695-place dataset, only ~155 have real
descriptions and only 23 have insider tips. Hand-writing 672 tips isn't just
slow — tips we don't actually know would be invented intimacy. **Share is the
honest fix**: the community supplies what editorial can't scale.

**This is the app's core idea, stated plainly: combine each person's favorite
places — and what they order there — into everyone's guide.**

What this changes about the build:

1. **Capture asks the tip question, not just for a photo.** The post flow's
   caption field becomes a structured prompt: *"What should we order / know?"*
   Same 80–120 chars, but aimed at the one sentence that makes a tip.
2. **Tips can exist without photos.** A text-only tip post (place + sentence)
   is valid — lower friction than requiring a camera moment. Data model: add
   `kind: 'photo' | 'tip'` to the photos table (or a parallel `tips` table);
   same moderation pipeline (§4 applies to text too — filter, report, block).
3. **The promotion pipeline (community → editorial).** Place cards show recent
   user tips under "From visitors." Periodically, the best/most-repeated tip is
   *promoted* into the place's `insiderTip` field — edited for voice, credited
   ("via Suzie W."). Promotion is a curation act, not an algorithm: the app
   stays a guide with taste, fed by its users.
4. **Cold start is a real risk — plan it.** Community content needs a
   community; day one has none. Seed strategy: the Thanks-page friends become
   founding contributors (each supplies tips for their 5–10 favorite places
   before v1.1 ships), and the feedback page already invites recommendations
   today. Success metric to add to §6: **% of top-100-exposure places with ≥1
   community tip after 90 days (target: 50%)**.
5. **Interim (v1.0.x):** enrich the ~100 highest-exposure dataset places with
   researched descriptions (facts, not fabricated tips) so the gap narrows
   while the flywheel spins up.
