# Update 2.2 — prep

Working list for the next release. Steven adds ideas/problems below; items
graduate to tasks when 2.2 planning starts.

## Committed direction

### 1. Instagram-style uploads: no size limit at all
The 2.1 adaptive ladder means users never SEE a size error, but photos still
pass through the Vercel function (hard ~4.5 MB body cap), so big originals
get recompressed. Apps like Instagram upload straight to storage — no
practical ceiling. Do the same:

- Backend issues a **presigned R2 PUT URL** (`POST /share/upload-url` →
  `{ upload_url, key }`); client PUTs the JPEG **directly to R2** (bytes
  never touch Vercel), then creates the photo row with the key.
- Removes the body-size ceiling entirely; upload speed improves (one hop);
  Vercel function time drops.
- Keep the ladder as a data-cost courtesy (maybe raise to 2048 px / higher
  quality now that transport is free), not as a limit.
- Migration-free: create-photo keeps accepting b64 as fallback so old
  binaries continue working.

### 1b. Push notifications (BUILT 2026-09-24 — needs Steven's Apple setup)
Code complete: push_tokens table, register/unregister endpoints, APNs HTTP/2
sender, triggers on friend post (once per multi-image group) / comment /
like, client permission + registration on sign-in. Remaining manual steps:
1. developer.apple.com → Keys → create key with "Apple Push Notifications
   service (APNs)" → download .p8, note Key ID.
2. Vercel env: APNS_TEAM_ID=95KLZBPNS4, APNS_KEY_ID, APNS_P8 (one-line \n
   escaped), APNS_TOPIC=com.nycstoop.app. (APNS_SANDBOX=1 only for local
   Xcode-run testing — not on Vercel.)
3. Xcode → App target → Signing & Capabilities → + Capability → Push
   Notifications.
4. Ship in the 2.2 binary; test: post from one account, lock the other phone.

## Known-open from the 2.1 review (carry-over)

2. **Interests editor in Settings** — onboarding-only today; existing users
   can never set or change interests. Biggest UX gap for the
   personalization layer. Near-mandatory.
3. **Bundle Leaflet/markercluster/rotate as npm deps** — they load from
   unpkg at runtime; Map + trip maps need network on native even though the
   guide is offline-first.
4. **Mood audit follow-through** — apply Steven's Tier B verdicts +
   the 2 Tier C moves (Peter Luger out of Date night → First time;
   One World Trade out of Rainy day) + refresh the stale Majestic/Phantom
   blurb (Phantom closed Apr 2023). Data-only; can ship before 2.2.
   Source: docs/reviews/MOOD_AUDIT_2026-09-11.xlsx.
5. **Interest-ranking blind spot** — the 6 coordinate-pinned official
   photos never interest-boost; add them as dataset places or rank by kind.
6. **Growth trio (parked since 2.0)** — What's-new card · invite-a-friend
   share button · native rating prompt.
7. **Distance-boundary audit** (task #37) — restaurant anchor ≤20 min,
   walk/subway/taxi bands (0.35/1/6/15 mi), Google bias radius 4 km,
   Nominatim bbox, Nearest-60: sanity-check against each other.
8. Small riders: zh device pass w/ CJK PDF export · "Admission" → "Price".

## Ops (not release-bound)

- **Oct 1: downgrade Neon to Free** (post-R2 traffic is tiny JSON).
- After 2.1 adoption: set `COMPAT_INLINE_THUMBS=0` on Vercel (ends the
  thumbnail shim, restores lean feed payloads for native too).
- Delete old Cloud Run service (`nyc-stoop-api`, project 1081486140972).
- Wipe probe/test accounts in Neon (`probe*@test.com`,
  `appstore-shots-*@test.com`, old `+official` user).

## Steven's ideas / reported problems (add below)

- …
