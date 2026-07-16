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
- **Sign in with Apple — DONE (satisfies Guideline 4.8 alongside Google).**
  Native flow via @capacitor-community/apple-sign-in; button renders only in the
  iOS app, listed above Google (Apple expects at-least-equal prominence). Backend
  verifies the identity token against Apple's JWKS (`/auth/apple`), links to
  existing accounts by verified email, and the users table gains `apple_sub`
  automatically on next boot. Remaining setup:
  1. Xcode → App target → Signing & Capabilities → **+ Capability → "Sign in
     with Apple"** (one click; updates the App ID + entitlement).
  2. Redeploy the backend (new `cryptography` requirement; DB migrates itself).
     If your bundle id isn't `com.nycstoop.app`, set env `APPLE_BUNDLE_IDS`.
  3. Test on device: first sign-in shows the name/email consent sheet; also test
     "Hide My Email" (private relay) — the account should still create.
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

## Final App Store Connect metadata (as submitted, 2026-07-12)

- **Description:**

  > NYC Stoop is a curated guide to New York — a few hundred places worth your
  > time, chosen and described like a friend who lives there would, not a
  > database of everything with a star rating.
  >
  > EXPLORE — Browse by what you feel like doing: eat, drink, see art, hear live
  > music, walk a neighborhood. Every place has an editorial description and an
  > insider tip — what to order, when to go, which entrance to use.
  >
  > EAT & DRINK — Restaurants, cafés, and bars across Manhattan and Brooklyn,
  > sorted by what's near you when you're in the city and by our recommendations
  > when you're planning from home.
  >
  > EVENTS — Live listings — concerts, shows, games — that you can pin straight
  > into your trip days.
  >
  > MY TRIP — Tap + on anything that catches your eye, and NYC Stoop turns your
  > saves into a routed day: morning to evening, grouped by neighborhood, with
  > walking times and subway directions between stops — including which line to
  > take, which direction, and where to get off.
  >
  > Plus: neighborhood maps for Manhattan and Brooklyn, weather-aware
  > suggestions, and a design that feels like a beautiful field guide, not an
  > app full of ads.
  >
  > NYC Stoop is free, with no ads. Made for travelers who want one great trip,
  > planned in minutes.

- **Keywords (97 chars):**
  `nyc,new york,travel guide,itinerary,trip planner,manhattan,brooklyn,subway,restaurants,events,map`
- **Support URL:** https://nyc-stoop.vercel.app
  (TODO: add "Support: stevenwang.nycstoop@gmail.com" footer line to the site)
- **Business/support email (2026-07-14):** stevenwang.nycstoop@gmail.com — now
  wired as FEEDBACK_EMAIL in the app (feedback page + all contact points).
  Use it for App Store Connect support contact + review notes too.
- **Marketing URL:** https://nyc-stoop.vercel.app (optional)
- **Copyright:** © 2026 Hsi-Chun Wang
- **Routing App Coverage File:** none (navigation apps only)
- **Screenshots:** appstore-01…05 (1290×2796) → iPhone 6.9" slot in Media
  Manager; Apple reuses for smaller sizes.
- **Icon:** appicon-1024.png (book + shoe prints, cream)

## Ship sequence

1. Device QA → fix what bleeds.
2. Archive in Xcode → upload → TestFlight (internal) → 2–3 days of real use.
3. Screenshots (6.7" + 6.1"): home with weather line + collections, a place card
   with a tip, the Brooklyn map sheet, My Trip with a pinned event.
4. Submit. If 4.2-rejected, respond citing the native-feeling features and the
   curated dataset; apps like this pass on appeal regularly.

---

## In-App Purchase — $3.99 lifetime unlock (added 2026-07-16)

**Model:** free download + one non-consumable IAP.
Free forever: Explore/Events/Map, saving places, a full 1-day routed plan
(meals included), 1 saved plan. Unlock: multi-day trips (2–7 days),
unlimited saved plans, PDF export. Web (Vercel) stays fully free — gates are
native-iOS only. Code: `src/iap.js` (StoreKit via cordova-plugin-purchase),
`PaywallSheet` in App.jsx, gates in PlanScreen + SavedPlanSummary, Settings →
"Lifetime unlock" row (shows ✓ when owned). Entitlement key `nyc_plus_v1` is
profile-global (never locked by account switching).

**Your setup steps (in order):**
1. `npm install` (pulls cordova-plugin-purchase) → `npm run build && npx cap sync ios`.
2. Xcode → target → Signing & Capabilities → **+ In-App Purchase** capability.
3. App Store Connect → your app → **Features → In-App Purchases → +**:
   - Type: **Non-Consumable**
   - Product ID: **`com.nycstoop.app.lifetime`** (must match `src/iap.js` exactly)
   - Reference name: NYC Stoop Lifetime Unlock
   - Price: $3.99 tier
   - Display name: "Lifetime unlock" · Description: "Multi-day trips,
     unlimited saved plans, and PDF export — yours forever."
   - Review screenshot: any screenshot of the paywall sheet.
4. Paid Apps agreement: ASC → Business — must be **signed with banking + tax
   info complete**, or the IAP can't go on sale (common first-submission trap).
5. Sandbox test: Settings app → App Store → Sandbox Account (create a sandbox
   tester in ASC → Users and Access → Sandbox). In the app: tap a 🔒 pill →
   paywall → Unlock → sandbox purchase → verify pills unlock, 2nd plan saves,
   PDF exports. Then **Restore purchases** after deleting + reinstalling.
6. Submit the IAP **together with the app version** (select it on the version
   page under In-App Purchases) — a lone IAP won't be reviewed.

**Testing gates in a desktop browser:** set `nyc_iap_gate_test = 1` in
localStorage to force the free tier; `nyc_plus_v1 = 1` simulates owned.

**Review-notes addition:** "The app is free with one optional non-consumable
IAP ($3.99 lifetime) unlocking multi-day planning, unlimited saved plans, and
PDF export. All content is browsable without purchase or sign-in."
