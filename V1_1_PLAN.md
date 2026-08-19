# NYC Stoop v1.1 — Release Plan (updated 2026-08-17)

Three pillars: **Localization (繁中 + Español) · $3.99 lifetime unlock · Queens + ~50 places.**
Share function stays in v2.0 (SHARE_TAB_SPEC_v1.1.md is its spec, despite the filename).

---

## Pillar 1 — Localization: Traditional Chinese (zh-TW) + Spanish (es)

Scope decision: **full localization** — UI chrome AND editorial content (place
descriptions, tips, event blurbs), onboarding through every function.

### 1a. Foundation (exists, needs revival)
- `src/lib/i18n.js` already has `t()`/`t2()`, `setLang`, `dateLocale`, and a
  tested zh-TW dictionary — but it's **stale** (predates the My Trip→Planner
  rename, Plan it!, My Plans, tutorials, paywall, founder row, new onboarding).
- Un-force English: line 16 `let _lang = 'en'` →
  `localStorage.getItem('nyc_lang') || 'en'` (comment in file says exactly this).
- Add `ES` dictionary alongside `ZH`; `t()` switches on `_lang` ('en'|'zh'|'es').
- `dateLocale()`: add `es` → `'es-ES'`.

### 1b. UI chrome sweep
- Audit App.jsx for hardcoded strings not routed through `t()` — most of the
  app was built after the dictionary froze. Big known gaps: onboarding slides
  (STEP 1 SAVE / STEP 2 BUILD A TRIP / STEP 3 GENERATE ITINERARY, "Start
  Exploring!"), tab tutorials, Plan it! sheet (start/budget/area options),
  My Plans, Edit-plan flow, Maps chooser sheet, paywall + founder row,
  Settings rows, Events browser (chips, "Coming soon" Queens row), meal cards
  (cuisine list, ↻ Change, "🍴 Add a restaurant"), empty states, PDF export
  strings, share text, alert/confirm dialogs.
- Language picker: **onboarding screen 1** (before any copy matters) + existing
  Settings row (un-comment ~line 16866). Store in `nyc_lang` (already in
  PROFILE_GLOBAL_KEYS device-scoped list — verify).

### 1c. Editorial content (the big one)
- ~695 places × (description + tip) + topic/domain intros + event blurbs.
- Structure: sidecar files `src/data/i18n/places.zh.js` / `places.es.js`
  keyed by place id `{ id: { desc, tip } }` — keeps `places.js` untouched and
  English as automatic fallback for anything missing (same graceful-degrade
  philosophy as `t()`).
- Method: machine-translate in batches (Claude does this), Steven spot-checks
  zh-TW natively; find a Spanish speaker or accept MT quality for es v1.
- Names stay English (proper nouns; that's what users see on signs/Maps).
- Search must keep matching English names/terms regardless of UI language.

### 1d. Store presence
- ASC → add localizations: **Chinese (Traditional)** + **Spanish (Mexico)**
  (es-MX reaches more US/tourist users than es-ES; ASC field is per-locale).
- Translate: description, promotional text, keywords (fresh keyword research
  per language — don't literal-translate), screenshots can stay English v1.1.
- What's-New text in all three languages.

### 1e. Localization QA
- Device pass per language: onboarding → save → build trip → Plan it! →
  save plan → PDF (CJK font embedding in jsPDF — **known risk**, test early;
  may need a bundled NotoSansTC subset or fall back to English PDF).
- Long-string layout checks (Spanish runs ~25% longer; Chinese shorter but
  taller). Buttons, chips, tab bar.

## Pillar 2 — $3.99 lifetime unlock (flip the built IAP on)

Free tier stays as designed in v1.0: **browse / save / 1-day plan free;
multi-day planner, Plan it!, PDF export behind the unlock.**

Prereqs (in flight): ~~Paid Apps agreement~~ → blocked on **W-8BEN support
ticket** + bank clearing. Nothing ships until agreement shows Active.

1. ASC: create IAP product `com.nycstoop.app.lifetime`, non-consumable, $3.99
   (Tier), localized display name/description in en + zh-Hant + es.
2. Flip `IAP_ENABLED = true` in `src/iap.js`. Gates, paywall, Settings row
   return automatically. **Founder grandfathering already shipped dormant** —
   v1.0-era installs (`nyc_founder_v1`) stay free forever; nothing to do.
3. Localize paywall + gate copy (part of 1b sweep).
4. Sandbox test on device: purchase, restore, founder path (device with v1.0
   data), fresh-install gated path.
5. ASC App Privacy: add Purchases data type.
6. Review notes: update "fully free" language; explain founder logic briefly.
7. EU: **do not monetize in EU without DSA trader declaration** — either
   complete trader info in ASC or exclude EU territories for the paid tier era.
8. apply_store.md: listing already says "free to download and explore" —
   still true; update review-notes section.

## Pillar 3 — Queens + ~50 places

1. Re-open Queens: Events `BOROUGHS` array + `COVERED_BOROUGH` regex in
   `src/lib/nycEvents.js` (currently `/manhattan|brooklyn/i`), area filters,
   remove the hard-coded "Queens — Coming soon" row.
2. Seed Queens: Astoria (Greek food, beer gardens), Long Island City (art —
   MoMA PS1, waterfront), Flushing (best Chinese food in NYC — great synergy
   with zh-TW launch, lead with it in Chinese keywords), Jackson Heights
   (Little India/Colombia), Rockaway (summer). Target ~30 Queens + ~20
   filling thin Manhattan/Brooklyn categories (live music, budget eats).
3. Full enrichment per docs/archive/ENRICH_WORKFLOW.md: description, tip,
   coords, neighborhood, price, hours-sensitivity, domain tags.
4. New places get zh/es content at write time (don't create a second backlog).
5. Rider: backfill `neighborhood` for the 243 old seeds with empty fields
   (from coords) — fixes Maps-query quality app-wide.

## Carried riders (small, do during the above)
- "Admission" → "Price" label.
- PrivacyInfo.xcprivacy (Apple's required-reason API manifest).
- Bundle Leaflet locally (drop unpkg CDN — offline + review robustness).
- Gate Google Sign-In script on native (dormant-but-loaded today).
- Promo codes: generate a batch at release for marketing.

## Suggested order
1. Foundation + UI sweep scaffolding (1a/1b) — everything else's strings land in it.
2. Queens/places (Pillar 3) — content then translated once, with 1c batches.
3. Content translation batches (1c) — parallelizable, start early, it's the long pole.
4. IAP flip + sandbox (Pillar 2) — whenever Paid Apps agreement activates.
5. QA passes (1e) per language + regression on gates/founder.
6. Store metadata (1d), What's-New ×3, submit **app version + IAP product together**.

## Submission checklist
- [ ] Bump MARKETING_VERSION 1.1, Build +1 (remember: new build number every archive)
- [ ] `npm run build && npx cap sync ios` → Archive → Upload
- [ ] IAP product attached to the version in ASC
- [ ] Review notes updated (purchases + demo account + founder note)
- [ ] Verify Notion privacy/terms links load in incognito (still open from audit)
- [ ] Device pass: en / zh-TW / es × (fresh install gated) / (v1.0-upgrade founder)

## zh-TW status (2026-08-19 morning)
Batches A–D COMPLETE — see docs/ZH_QA_2026-08-19.md. All content corpora translated
(places 524, topics 44, domains 8, groups 7, venues 103, figures 139, works 184),
UI dictionary 390 entries / 100% coverage, build passing, 5-tab visual pass clean.
Open: 7 works' whatToLookFor retranslation (extraction artifact), PDF CJK device
test, Spanish mirror (Batch E).
