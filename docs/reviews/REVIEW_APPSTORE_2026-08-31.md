# App Store compliance review — v2.0 pre-build (2026-08-31)

Scope: App Review Guidelines with focus on 1.2 (UGC / photo upload), 5.1.1
(privacy, permissions, account deletion), 3.1.1 (IAP), plus upload-time
requirements. Evidence from code + today's prod verification.

## Guideline 1.2 — UGC requirements

| Requirement | Status | Evidence |
|---|---|---|
| Report offensive content | **PASS** | `reportPhoto` + `reportComment` in viewer/comments UI; alert promises review within 24h |
| Timely response / hold for review | **PASS** | 2 reports auto-set `status='flagged'` (hidden) on photos AND comments — automated hold, backend share.py |
| Block abusive users | **PASS** | `blockUser` — bidirectional: content hidden both ways, code redemption dead |
| Published contact info | **PASS** | Feedback row in Settings → mailto stevenwang.nycstoop@gmail.com |
| Filtering objectionable material | **PASS (mitigated)** | Friends-only visibility (nothing public), EXIF strip, auto-hide at 2 reports. No pre-post ML filter — acceptable for friends-only apps; say so in review notes |
| Users agree to EULA w/ zero-tolerance | **GAP #2** | Terms of Use has the zero-tolerance clause (Notion, 08-28) but signup never asks agreement — no terms line/links on the auth screen |
| Eject offending users | **PASS (manual)** | Block + account deletion exist; owner can remove content/users via Neon. Mention 24h commitment in review notes |

## Guideline 5.1.1 — privacy & permissions

| Item | Status | Detail |
|---|---|---|
| NSPhotoLibraryUsageDescription | **GAP #1** | Says "only when you choose a profile picture" — FALSE since v2.0 Share posts photos. Inaccurate purpose strings are a rejection |
| NSCameraUsageDescription | **GAP #1** | Same "profile picture only" claim |
| NSLocationWhenInUseUsageDescription | **GAP #1 (minor)** | Doesn't mention optional photo location tagging |
| Account deletion 5.1.1(v) | **PASS** | DELETE /auth/me — verified working on prod today |
| Privacy policy + Terms accessible | **PASS** | Settings links → Notion pages (both updated 08-28 with UGC clauses) |
| EXIF/GPS stripping | **PASS** | Canvas re-encode strips all EXIF; location is explicit opt-in per photo |

## Upload-time requirement

| Item | Status | Detail |
|---|---|---|
| PrivacyInfo.xcprivacy | **GAP #3** | Missing from ios/App/App/. Required since May 2024 for required-reason APIs (UserDefaults et al. via Capacitor). App Store Connect can reject the upload itself |

## Guideline 3.1.1 — IAP

**PASS / dormant.** `IAP_ENABLED = false`: PaywallSheet renders null, Settings
row hidden, gates never fire (hasPlus() → true), StoreKit never initializes.
Nothing purchasable in the binary; $3.99 deferred to v2.1 pending W-8BEN.

## Version

MARKETING_VERSION = 2.0, CURRENT_PROJECT_VERSION = 6 — correct for submission.

## Fixes required before build

1. Rewrite the three Info.plist usage strings for v2.0 reality (photo posts,
   camera, optional photo location).
2. Signup/sign-in screen: "By continuing, you agree to our Terms of Use and
   Privacy Policy" with tappable links.
3. Add ios/App/App/PrivacyInfo.xcprivacy: required-reason API declarations
   (UserDefaults CA92.1, file timestamp C617.1, disk space E174.1) + collected
   data types (email/account, photos/UGC, coarse-precise location opt-in),
   tracking = false. Must be added to the Xcode target.

## ASC checklist (not code — do during submission)

- App Privacy labels: add Photos/Videos, User Content, Contact Info (email),
  Precise Location (used, NOT tracking, per-photo user choice)
- Review notes: demo account pre-friended with official ✦ NYC Stoop; friends-
  only UGC; report + block on photos and comments; 2-report auto-hide; 24h
  moderation commitment; EXIF stripped client-side
- Confirm privacy URL in ASC = the Notion privacy page
- Release notes EN + zh-Hant
