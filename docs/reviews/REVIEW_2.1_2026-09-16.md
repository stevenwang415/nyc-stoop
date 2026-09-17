# v2.1 pre-upload review — 2026-09-16

Delta since GAPS_2026-08-28 + the 2.0 launch cycle. Build clean, runtime-refs
clean, version bumped to 2.1 (build 12) in the Xcode project.

## What 2.1 ships (all committed)

Photos on R2 (zero-egress; Neon back to Free on Oct 1) · URL-aware photo
rendering + 2.0-binary thumbnail shim · map-pin tap opens the full post
carousel · sessions last until manual logout (1-year sliding refresh) ·
Eat cards unified on the bottom sheet (+ Full details for editorial, real
Planner toggle) · Google place search biased to device location (native
prompt fixed) · planner: one meal card per tap, appended at bottom, neutral
RESTAURANT label, ✕ ghost-click guard, phantom DAY 2 trim, no back-to-back
restaurants in generated days, dedupe on re-added Google places ·
saved plans: ≈$/person parity, no invented times, restaurant map pins
restored · My Trips route-strip cards (handoff 1a) · Feed tab rename +
My Stoop · temperature toggle restored · location-bias prompt via native
plugin · ITMS-90683 purpose string.

## 🚨 Blockers — do IN ORDER before Archive

1. **PUSH.** 5 commits are local-only, including the thumbnail shim (the
   blank-photos bug is LIVE for every native user until this deploys) and
   /auth/refresh (the 2.1 binary calls it on every launch).
2. **Verify prod after deploy** (Claude, one probe): feed returns non-null
   thumb_b64 again + /auth/refresh answers 200.
3. `npm install && npx cap sync ios` (native geolocation path + synced web
   assets), then Archive as 2.1 (12).

## ⚠️ Known-open, NOT blocking 2.1 (decide for 2.2)

- **Interests editor in Settings** — onboarding-only; existing users can
  never set interests. Was flagged "near-mandatory" in the 2.0 gaps; still
  true, still open.
- **Leaflet/markercluster/rotate load from unpkg at runtime** — Map + trip
  maps need network on native. Bundle as npm deps in 2.2.
- **Mood audit verdicts pending** (MOOD_AUDIT_2026-09-11.xlsx): 2 Tier C
  (Peter Luger ≠ Date night, One World Trade ≠ Rainy day), 10 Tier B, and
  the stale Majestic/Phantom blurb. Data-only — can ship any time without
  a binary.
- Interest-ranking blind spot: 6 coordinate-pinned official photos never
  interest-boost.
- Parked growth items: What's-new card, invite-a-friend button, rating
  prompt.
- Old small riders: zh device pass w/ CJK PDF, "Admission"→"Price".
- Ops: **Oct 1 — downgrade Neon to Free**; after 2.1 adoption, set
  `COMPAT_INLINE_THUMBS=0`; delete old Cloud Run service; wipe probe
  accounts in Neon.

## Verdict

Nothing in the open list belongs in this binary. 2.1 is a strict improvement
over what users run today — and the sooner it ships, the sooner the
thumbnail shim can retire. **Green light after the push + prod probe.**
