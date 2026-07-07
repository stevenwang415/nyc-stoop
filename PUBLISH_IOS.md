# NYC Stoop — iOS publication checklist

Capacitor 8 is wired in (`capacitor.config.json`, `ios/App` Xcode project, appId
`com.nycstoop.app`). What's done, what you run on your Mac, and what App Review
will care about.

---

## Already done in this repo

- `ios/App/App.xcodeproj` scaffolded (Capacitor 8, SPM-based — no CocoaPods needed).
- `capacitor.config.json` — appId `com.nycstoop.app`, warm cream background so the
  webview never flashes white behind the notch.
- `Info.plist` — display name "NYC Stoop"; `NSLocationWhenInUseUsageDescription`
  (required — the app calls browser geolocation, which iOS routes through this
  permission); `ITSAppUsesNonExemptEncryption=false` (skips the export-compliance
  question on every upload).
- `index.html` — `viewport-fit=cover` + apple status-bar meta already present;
  theme-color updated to the canvas cream.
- Bundle code-split (`vite.config.js`): app 456 KB / data 1.3 MB / vendor 142 KB as
  separate cached chunks (was one 1.9 MB chunk).
- Import pool deduped: 718 → 696, zero id collisions.
- `package.json`: `@capacitor/cli` in devDeps, the Linux-only rollup binary moved to
  `optionalDependencies` (it was a hard devDep, which breaks `npm install` on any
  non-x64-Linux machine — including your Mac).

## Run on your Mac (first time)

```bash
npm install          # now works on macOS thanks to the optionalDependencies fix
npm run ios          # = vite build + cap sync ios + open Xcode
```

Then in Xcode: select the App target → Signing & Capabilities → pick your team,
and set a unique bundle id if `com.nycstoop.app` is taken. Run on a real device.

Every subsequent web change: `npm run ios` again (or `npx cap sync ios` if Xcode
is already open).

## Before submitting — required

1. **App icon** — Xcode → `Assets.xcassets/AppIcon`: one 1024×1024 PNG (iOS
   generates the rest). No transparency, no rounded corners.
2. **Launch screen** — `LaunchScreen.storyboard`: set its background to #F3EBDC so
   launch → app is seamless. A centered wordmark is enough.
3. **Portrait lock (recommended)** — the layout is phone-portrait; in Xcode →
   General → Deployment Info, uncheck landscape (Info.plist currently allows it).
4. **Device QA pass** (from REVIEW #7): drag + ↑/↓ reorder on real touch, map area
   sheet + back-stack, the date input, Google-photo loading, safe-area on the
   header, geolocation prompt flow (deny + allow paths).
5. **Remote data & keys** — `.env.local` values are baked into the JS at build
   time (Vite). Confirm the Google Places key is domain/bundle-restricted, and
   that the backend (`nyc-stoop.vercel.app`) endpoints used for sign-in work from
   a `capacitor://localhost` origin (check CORS + Google Identity allowed origins).

## App Review — know before you go

- **Guideline 4.2 (minimum functionality)** is the one web-wrapped apps get
  rejected on. Your case is decent — location-aware recommendations, offline-ish
  curated data, trip planning — but strengthen it: make sure the app works
  gracefully with no network (the curated data does; event feeds and photos need
  clean empty states, not spinners).
- **Location** — only request when the user acts (you already prompt contextually);
  the purpose string is in place.
- **Sign in with Google** — if you keep it, Apple requires you ALSO offer Sign in
  with Apple (Guideline 4.8). Alternatives: ship v1 with no account (everything is
  localStorage anyway), or add Sign in with Apple alongside.
  **This is the most likely rejection after 4.2 — decide before submitting.**
- **Privacy nutrition label** (App Store Connect): location (app functionality,
  not linked), and whatever the Google sign-in collects if kept.
- **Privacy policy URL** — required field; a page on the vercel domain is fine.
- **localStorage persistence** — WKWebView can evict it under storage pressure.
  Acceptable for v1; a future `@capacitor/preferences` migration makes saves durable.

## Suggested App Store metadata

- **Name:** NYC Stoop — with taste
- **Subtitle:** Curated NYC: eat, drink, do
- **Category:** Travel (primary), Food & Drink (secondary)
- **One-liner for review notes:** "A curated NYC guide: activity- and mood-based
  recommendations with editorial descriptions, live event listings, and an
  auto-routed day planner. Location is used only to sort nearby places."

## Ship sequence

1. Device QA → fix what bleeds.
2. Archive in Xcode → upload → TestFlight (internal) → 2–3 days of real use.
3. Screenshots (6.7" + 6.1"): home with weather line + collections, a place card
   with a tip, the Brooklyn map sheet, My Trip with a pinned event.
4. Submit. If 4.2-rejected, respond citing the native-feeling features and the
   curated dataset; apps like this pass on appeal regularly.
