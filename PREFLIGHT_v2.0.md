# v2.0 preflight — push day script (2026-08-25)

Everything verified locally: 23-check backend e2e ALL PASS (access control,
official seeding, comments + 2-report hide, name/avatar sync, deletion
cascade), prod build clean, all Share/Trips zh keys translated, privacy
policy rewritten for accounts + UGC. What remains is deployment + store prep,
in this order.

## 1. Push + prod verify (Batch 1)

- [ ] `git add -A && git commit && git push` (pre-push audit done 08-25:
      no dev secrets tracked, dev mock is dev-server-only, vercel.json ready)
- [ ] `npm install && npx cap sync ios` (geolocation plugin for native build)
- [ ] Vercel deploy finishes → tables auto-create (share_photos now includes
      lat/lng; users gets avatar_b64 via bootstrap ALTER)
- [ ] 2-account smoke on prod (web): code → redeem → photo → comment → bell
- [ ] Wipe test rows in Neon SQL editor

## 2. Official account (prod)

- [ ] Sign up hsichunw+official@gmail.com (or chosen email) via the app
- [ ] Pen icon → display name "NYC Stoop"; set avatar
- [ ] Post ~12 curated photos: dataset-anchored, food captions answering
      "what should we order?" — the account demos captions, pins, and
      Add to Planner in one scroll
- [ ] Vercel env: `SHARE_OFFICIAL_EMAIL=<that email>` → redeploy
- [ ] Vercel env: `APPLE_MAPS_TEAM_ID` / `APPLE_MAPS_KEY_ID` /
      `APPLE_MAPS_P8` (copy the three lines from backend/.env — Apple place
      search verified working 08-28, "Dudleys" → 85 Orchard St)
- [ ] Verify: brand-new prod account's first Share open has the ✦ friend +
      feed + map pins

## 3. Blob swap (Batch 2 — BEFORE inviting real friends)

- [ ] Vercel Blob signed uploads; share_photos keeps metadata + URL
- [ ] Trivial migration (test photos only). Never migrate real users later.

## 4. Friends beta

- [ ] Invite the Thanks-page crew; codes over text; watch .feed quality
- [ ] Collect feedback before App Store submission

## 5. App Store submission

- [ ] Xcode build → device: verify native camera location prompt
      ("NYC Stoop would like to access your location" in compose) — the ONE
      code path not yet device-verified
- [ ] Device pass: Trips merge, Share tab, map toggle, Add to Planner tap
- [ ] App Privacy (ASC): ADD "Photos or Videos" (user content, linked to
      account), "User Content" (photos, comments), "Contact Info" (email,
      account) — location: "Precise Location" = used but NOT tracked, user
      choice per photo
- [ ] Review notes: demo account credentials, pre-friended with the official
      account so the reviewer sees the full social surface on one device.
      Mention: friends-only UGC, block + report on photos AND comments,
      2-report auto-hide, 24h review commitment, EXIF stripping
- [ ] Terms/privacy URL already updated (docs/privacy.html, 08-25) — confirm
      it's the URL listed in ASC
- [ ] zh-Hant screenshots/listing if updating localized store page
- [ ] Version 2.0, release notes (EN + zh-Hant)

## Deferred (2.1 candidates, spec'd)

Trip albums + plans→server sync · camera capture from place pages · GPS
pre-ranking · QR/universal invite links · Apple Maps Server API search proxy
· push notifications (APNs) · public-visibility decision (still OPEN) ·
IAP whenever W-8BEN resolves.
