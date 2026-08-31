# Share — v2.0 spec (rev 2026-08-25) · supersedes SHARE_TAB_SPEC_v1.1.md

**One line:** a friends-only social layer — your profile ("My Stoop") is your
map of NYC (photos, places, trip albums), visible only to accepted friends,
entirely inside the app.

**Decisions locked with Steven:**
- (08-25) ⚠ **OPEN — visibility.** Was locked friends-only (08-20); Steven is
  reconsidering Corner-style public visibility. v2.0 SHIPS friends-only
  (everything is built for it; friends-only→public later is a per-photo
  opt-in toggle, public→private later is a betrayal). Public also triggers
  Apple's heavier UGC/moderation bar. Decide before 2.1.
- (08-20) Invite links never open web pages — they deep-link into the app
  (or App Store).
- (08-25) **In-app cross-links:** tapping a photo's place label jumps to
  that place on the Map tab / its detail page (place_id already on every
  photo). Share feeds the rest of the app.
- (08-20) **Trip album is the centerpiece** — photos auto-linked to plan
  days (photo date+place matched against saved-plan days → automatic
  day-ordered album; the plan → go → album loop). Deferred to 2.1.
- (08-20) Photo labeling: place OR area + kind chip; caption optional
  (food gets the "What should we order?" prompt).
- (08-23) Friendship = **instant on code redeem** — no request/accept
  round-trip. Handing someone your code IS consent. (Built this way.)
- (08-23) Profile-first UI, deliberately less than Instagram: no followers,
  no bio, no stories. One mental model.
- (08-25) **No standalone My Profile page.** My Stoop IS the profile, and it
  is the landing view of the Share tab. "Personal Map" is not a page either —
  it's a Grid ⇄ Map view toggle over the same photos. One surface, three
  doors (My Stoop / Friends / From friends).
- (08-25) **Nav plan locked + timeline accelerated:** with IAP stuck on the
  W-8BEN wait, there is NO separate v1.1 release. One combined **v2.0**
  submission (~1 week out) = all v1.1 content (zh-TW, coverage, fixes) +
  Trips merge + Share tab: Explore · Events · Map · Trips · Share. IAP
  ships whenever Apple resolves tax. To fit the week: trip albums, camera
  capture from place pages, GPS pre-ranking, QR/universal links → 2.1.
- (08-25) "Places" stat is **photo-derived** (distinct places you've posted),
  not check-ins. No visit-tracking mechanism in v2.0.
- (08-26) **Tab renamed Share → "You"** (person icon; internal id stays
  'share'). The tab IS the profile — lands on "Your Stoop" (copy also renamed
  from "My Stoop": the interface speaks TO the user). Nav is final at five:
  Explore · Events · Map · Trips · You. Future: Settings migrates under You.

---

## 1. The model

Three nouns:

1. **Photo** — anchored to a **place** (one of the 868 dataset places) or a
   **moment** (area label only). Fields: image, anchor, kind chip
   (🍴 food · 🏞 view · ✨ vibe), optional caption, auto date, (later) auto
   trip-day link. Client resizes ≤1600px + 320px thumb; EXIF/GPS stripped.
2. **Trip album** — a saved plan + its photos, organized by day in itinerary
   order. Created automatically when a photo lands on a plan day. The
   post-trip artifact: plan → go → album. THE reason to reopen the app.
3. **Stoop (profile)** — avatar, name, "{N} photos · {N} places", photo grid
   ⇄ personal map. What friends browse. A friend's Stoop = the same layout,
   their content, no Add-photo button.

**Friends:** mutual, formed instantly by redeeming an 8-char friend code
(QR / invite link later). No user search, no contacts import. Codes are
regenerable (leak recovery). Block hides both directions, survives
unfriending, and makes the blocked party's redeem attempts indistinguishable
from "code not found."

**Share tab structure (target, from the 08-25 concept chart + mockup):**
- **My Stoop** (landing): profile header → actions (Add photo / My code) →
  Grid ⇄ Map toggle → photos.
- **Friends**: code exchange + friend list → tap → their Stoop.
- **From friends**: friends' finds filtered by category chips (All / Food /
  Cafe / Drinks / View / Vibe). Category derives from the anchored place's
  dataset category (place-first), falling back to the poster's kind chip.
  No likes/comments in 2.0 (revisit emoji reactions in 2.1).

## 2. Status — what is already BUILT (2026-08-25, local, unpushed)

- `backend/share.py`: full router — codes, redeem, friends list, unfriend,
  block, photo CRUD, feed, report (2 reports auto-flag), access checks on
  every read. E2E-tested locally on SQLite.
- `backend/models.py`: `users.friend_code`, `friendships`, `share_photos`
  (base64 image+thumb in Postgres — TEST PHASE ONLY).
- `vercel.json`: `/share/*` rewrite ready — goes live on next git push.
- `src/share/ShareSheet.jsx`: My Stoop profile-first UI (three pills:
  My Stoop / Friends / From friends), compose with native photo menu,
  full-screen viewer, safe-area handling. Opens via Settings (BETA).
- `src/share/shareApi.js`: client with dev same-origin routing.
- `scripts/devShare.mjs`: Vite-middleware mock (`.dev-share.json`) — the
  whole feature is device-testable with zero deployment.
- NOT built yet: map view toggle, trip albums, plans→server sync, camera
  capture from place pages, GPS pre-ranking, QR/universal links, offline
  queue, blob storage, admin review, Trips merge, Share nav tab.

## 3. Architecture

Backend (existing FastAPI + Neon Postgres + Vercel):
- Storage NOW: base64 in Postgres (friends-scale testing only).
  **Before public launch: swap to Vercel Blob** (signed direct uploads,
  metadata via API). Endpoint shapes already compatible. This is also the
  sanctioned S3 spot if resume-value is wanted (DATA_MAP.md decisions log).
- Plans move server-side for trip albums: saved snapshots sync to the
  backend when Share is enabled (currently localStorage-only — the quiet
  prerequisite albums sit on).
- Universal Links: AASA file on the Vercel domain + Associated Domains
  entitlement. Invite link nyc-stoop.vercel.app/f/<code>: app installed →
  accept screen; not installed → App Store, code survives via first-launch
  code entry.

App:
- Capacitor Camera plugin (permission strings shipped in v1.0 ✓).
- Offline: photos queue locally, upload when connectivity returns.
- Map views reuse the existing Leaflet + divIcon marker setup.

## 4. Apple compliance (friends-only grade)

1. Block user ✓ (built). 2. Report photo ✓ (built; needs admin listing page
or SQL ritual + 24h-action commitment in review notes). 3. Delete own
content ✓; account deletion must cascade photos. 4. Terms/privacy update:
UGC clause, friends-visibility language, EXIF-stripping disclosure; App
Privacy adds Photos + User Content. 5. Review notes: demo account pre-loaded
with a friend + album (reviewer has one device).

## 5. Cold start

- **Official seed friend (built 08-25, gate 1):** every user's first Share
  visit auto-friends the official NYC Stoop account (the MySpace-Tom move —
  Corner's content-first cold start inside the friends-only model). One-shot
  seeding tied to first friend-code creation, so unfriending is respected
  forever; ✦ Official badge in the friends list. PROD SETUP (Batch 1
  checklist): ① sign up the account (e.g. hsichunw+official@gmail.com),
  ② set display name "NYC Stoop" + avatar, ③ post ~12 curated photos,
  ④ set Vercel env `SHARE_OFFICIAL_EMAIL` to that email (feature is OFF
  until set). Dev convention: any email containing "+official".
- Launch story: **trip groups** ("planning NYC with your partner? Both
  install, friend up, one shared album").
- Founding users: the Thanks-page friends — each friends Steven, posts one
  real album pre-launch.
- Food captions answering "What should we order?" become candidate insider
  tips, promoted to editorial by hand with credit.

## 6. Build order (batches, dependency-sequenced)

One combined v2.0 submission, target ~1 week (2026-08-25 → ~09-01).

Batch 0 — DONE: friends + photos + My Stoop + From friends, local mock,
backend e2e on SQLite. v1.1 content (zh-TW, coverage, fixes) also done and
rides along in this release.

**Batch 1 — Backend goes live (day 1).** git push → `/share/*` routes +
tables deploy to prod Postgres. Re-run the e2e pass against prod;
real-device 2-account test over the real backend; wipe test rows after.
Also: `npm install && npx cap sync ios` (geolocation plugin).

**Batch 2 — Blob storage swap (day 1–2).** Vercel Blob signed uploads;
`share_photos` keeps metadata + blob URL only. Trivial migration (test data
only). BEFORE real friends — never migrate real photos later.

**Batch 3 — Trips merge (day 2–4, prototype first).** Planner + My Plans →
one Trips tab with segmented header, opening on saved plans with a "Start
new trip" path. Reroute "Edit in Planner" bridges. Caution from July: the
split existed because users couldn't find saved plans — device-test before
committing.

**Batch 4 — Share becomes the fifth tab (day 4–5).** Re-home ShareSheet
from overlay to nav tab, landing on My Stoop. Grid ⇄ Map toggle (divIcon
pins, tap-pin → place photos); friend's Stoop gets the same map view.
Photo place label → cross-link to the place on the Map tab.

**Batch 5 — Compliance + zh + ship (day 5–7).** Terms/privacy UGC update +
App Privacy (Photos, User Content), account-deletion cascades photos, admin
review ritual documented, zh-TW for all new Share/Trips UI, 2-device QA
pass, demo account pre-loaded with a friend + photos for review, TestFlight,
submit v2.0.

**Shipped early (built 08-25, was 2.1):** photo-level pins — EXIF GPS read
before the privacy strip, device-location fallback (web), any-place search
via Nominatim (user-initiated, keyless); photo label/location editing;
**comments** (Steven reversed the no-comments call 08-25: friends comment
under photos; author or photo-owner deletes — owner moderates their Stoop;
Batch 5 must extend report/terms language to comments). Likes stay out.
2.1 upgrade path: swap the search
URL for a backend proxy to Apple Maps Server API (25k calls/day free with
the developer membership; verify display terms) — Google Places stays the
fallback option (5k free Text Search/mo). Native in-app-camera photos still
need the Capacitor-geolocation fallback before store release.

**Deferred to 2.1:** trip albums + plans→server sync, camera capture from
place pages / "How was it?" prompts, GPS pre-ranking, offline queue,
QR/universal invite links, spam brakes beyond the built daily count,
public-visibility decision.

Cut lines inside the week if needed: friend's-map view, moment photos.
Never cut: block/report, EXIF strip, access checks, blob swap.

## 7. Success metrics
- % of new users who connect ≥1 friend in week 1 (target 15%).
- % of dated saved plans that become albums (target 25%).
- Photos per album (target ≥5 — proves auto-linking works).
- Invite-link → install conversion.

## 8. Out of scope (v2.0)
Public content of any kind, stranger feeds, likes/comments, DMs, videos,
contact-book import, user search, check-in/visit tracking, standalone
profile page. Emoji reactions: 2.1 candidate.
