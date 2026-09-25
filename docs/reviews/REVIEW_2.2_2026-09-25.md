# Pre-submission review — v2.2 (2026-09-25)

Verdict: **GO** — build, prod API, and guideline pass all clean.
One reminder before Archive: test one real push on your phone first (see §4).

## 1. What ships in 2.2

- Push notifications (APNs): friend posts / comments on your photo / likes.
- Inline comments under every post card, with reply (@name) composer.
- Profile photos endpoint — official account (and any quiet friend) can no
  longer be starved out of profiles by the 60-photo feed window.
- IG-style Posts page: fixed header (back · Posts · name), edge swipe-back,
  profile panel hidden while reading posts.
- From friends: Posts/Map toggle — whole friends feed on one map.
- Stoop maps keep the user's zoom/pan across data refreshes.
- Tab rename: Feed → **Stoop** (zh: 動態).
- Unlimited uploads: daily post cap removed; adaptive ladder never rejects.
- 1-year sliding sessions (refresh on launch) — no daily sign-in wall.

## 2. Repo / build state (verified)

- Local == origin/main (0/0 ahead-behind), tree clean at review time.
- `npm run check` clean (5 files), `npm run build` clean.
- MARKETING_VERSION **2.2**, CURRENT_PROJECT_VERSION **14** (bumped in this pass).
- App.entitlements: `aps-environment` present (development in-project; Xcode
  provisions `production` automatically on App Store archive) + Sign in with Apple.
- Push capability added in Xcode (Steven, 2026-09-25). Old sandbox APNs key
  X65NTRR99T revoked; live key 98TBRRXRKN on Vercel.
- App.jsx regression from cbd0f45 (file reverted to pre-Share version)
  RESTORED in d39d135 — bundle re-verified to contain trips/share tabs.

## 3. Prod API probe (throwaway account, all cleaned up)

| # | Check | Result |
|---|-------|--------|
| 1 | signup | ok |
| 2 | POST /auth/refresh | 200 |
| 3 | redeem official code | 200 |
| 4 | /share/feed | 14 photos, comments + like fields + thumb_url attached |
| 5 | /share/photos/of/25 | 14 photos, comments attached |
| 6 | add comment | ok |
| 7 | like | ok (count 1) |
| 8 | unlike | 200 |
| 9 | delete probe comment | 200 |
| 10 | push/register (64-char token) | 200 |
| 11 | push/unregister | 200 |
| 12 | DELETE /auth/me | 200 |

(First push/register probe 422'd only because the probe token was under the
16-char validation floor — real APNs tokens are 64 hex chars. Client payload
shape matches the endpoint exactly.)

## 4. Apple guideline pass (2.2 focus: push + comments)

- **4.5.4 Push** — PASS. Notifications are social-only (friend post, comment,
  like), never marketing; opt-in via the standard iOS system prompt; the app
  is fully functional if permission is denied (bell notifications in-app
  still work). No push-gated features.
- **5.1.1 Permissions** — PASS. Push uses the system dialog (no usage string
  required); camera/photos/location strings unchanged from approved 2.1.
- **1.2 UGC** — PASS. Zero-tolerance EULA checkbox still gates signup;
  report/block/delete all intact. New inline comments are the same comment
  objects as the viewer thread, so report-comment and owner-moderation
  (delete any comment on your own photo) remain reachable by opening the
  post (💬). Like data adds no new UGC surface.
- **2.3.6 Age rating** — unchanged (UGC=Yes already set in ASC for 2.0).
- **5.1.1(v) Account deletion** — verified live this pass (probe #12).
- **Sign in with Apple** — untouched since 2.1 approval.

## 5. Before you press Archive

1. Push + rebuild ritual (pbxproj version bump is committed in this pass —
   the push MUST land before archiving or the archive stays 2.1/13).
2. **Real-device push test** (task #42 close-out): Run the 2.2 build on your
   phone, sign in, accept the push prompt; from a second account, comment on
   one of your photos; lock the phone → banner should arrive. This is the
   only 2.2 feature that cannot be verified from the sandbox.
3. Archive → upload → ASC: pick build 2.2 (14), update What's New (EN + zh).
4. Screenshots: existing 2.1 set is still accurate (tab bar label changed
   Feed→Stoop — optional refresh, not blocking).

## 6. Post-release ops (carry-over)

- Oct 1: downgrade Neon to Free.
- After 2.2 adoption: COMPAT_INLINE_THUMBS=0 on Vercel.
- Delete old Cloud Run service nyc-stoop-api.
- Wipe probe*/test accounts in Neon.
- Parked for 2.3: direct-to-R2 presigned uploads, interests editor in
  Settings, bundle Leaflet as npm deps, growth trio, distance audit (#37).
