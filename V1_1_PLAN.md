# NYC Stoop v1.1 — Release Plan (reordered 2026-08-19)

Priority order per Steven: **1) Enrich current coverage · 2) Queens · 3) Waiting-room (Spanish + IAP/tax)**.
zh-TW localization is DONE (see status at bottom). Share stays in v2.0.

---

## Pillar 1 — Enrich current data (coverage depth) ← ACTIVE

**The rule: every category × neighborhood combination a user can tap must
return at least 5 results.** Today e.g. Coffee–Chelsea returns 1.

1. **Coverage audit first**: script that counts places per (category ×
   neighborhood) across the dataset (695 seeds + editorial venues), and
   outputs the gap table — every combo below 5, sorted by user exposure
   (mood flows and Browse-by areas surface some combos more than others).
2. **Fill the gaps**: research + seed real, quality places for each thin
   combo (address, coords, hours, price, rating via enrichment pipeline;
   editorial description + tip in the house voice).
3. **zh-TW at write time** for every new place (no second backlog).
4. Riders that improve existing data quality while we're in there:
   - Backfill `neighborhood` for the 243 old seeds with empty fields (from
     coords) — also fixes which combos the audit counts them toward.
   - Retranslate the 7 works' whatToLookFor notes (extraction artifact).

## Pillar 2 — Queens

1. Re-open Queens: Events `BOROUGHS` array + `COVERED_BOROUGH` regex in
   `src/lib/nycEvents.js` (currently `/manhattan|brooklyn/i`), area filters,
   remove the hard-coded "Queens — Coming soon" row.
2. Seed Queens (~30 places): Astoria (Greek food, beer gardens), Long Island
   City (MoMA PS1, waterfront), Flushing (best Chinese food in NYC — lead
   with it in Chinese keywords), Jackson Heights (Little India/Colombia),
   Rockaway (summer). Same ≥5-per-category standard as Pillar 1.
3. Full enrichment per docs/archive/ENRICH_WORKFLOW.md + zh-TW content at
   write time.
4. Queens on the schematic maps / area picker if design allows (else v1.2).

## Pillar 3 — Waiting room (external blockers / deferred)

### 3a. $3.99 lifetime unlock — blocked on Apple tax/banking
- Status: W-8BEN support ticket escalated (second team contacted 8/19);
  bank clearing; agreement "Pending User Info". NOTHING here can move until
  Apple responds — checklist is ready to execute the day it clears:
  1. ASC: IAP product `com.nycstoop.app.lifetime`, non-consumable, $3.99,
     localized name/description (en + zh-Hant).
  2. Flip `IAP_ENABLED = true` in src/iap.js (gates/paywall/founder row all
     return automatically; founder grandfathering ships dormant already).
  3. Sandbox device test: purchase, restore, founder path, fresh-gated path.
  4. ASC App Privacy: add Purchases. Review notes: update "fully free".
  5. EU: DSA trader declaration or exclude EU while monetized.
- **Ship rule: v1.1 submits app version + IAP together.** If tax drags on
  and Pillars 1–2 are done, decide then: hold 1.1, or ship 1.1 free-still
  and make IAP a 1.2 flip.

### 3b. Spanish (es) — full mirror of the zh-TW effort
- Deferred behind coverage + Queens. Recipe fully documented in
  docs/TRANSLATION_GUIDE.md (dict, sidecars, agents pipeline, QA).
- ASC listing es-MX when it ships.

## Carried riders (do opportunistically)
- ✅ Native location prompt (Capacitor Geolocation — no more "localhost") — needs `npm install && npx cap sync ios` on Steven's machine before next build.
- ✅ Map dots glide during zoom (divIcon markers).
- "Admission" → "Price" label.
- PrivacyInfo.xcprivacy (required-reason API manifest).
- Bundle Leaflet locally (drop unpkg CDN).
- Gate Google Sign-In script on native.
- Promo codes at release.

## Steven's side
- [ ] Chase W-8BEN ticket (message sent to second team 8/19).
- [ ] Notion privacy/terms links — incognito check (open since audit).
- [ ] On-device zh pass incl. **PDF export CJK test** (checklist in docs/ZH_QA_2026-08-19.md).
- [ ] Decide Spanish: ship in 1.1 if tax delays anyway, or hold for 1.2.

## Submission checklist (unchanged)
- [ ] Bump MARKETING_VERSION 1.1, Build +1 (new build number every archive)
- [ ] `npm run build && npx cap sync ios` → Archive → Upload
- [ ] IAP product attached to the version in ASC (if 3a cleared)
- [ ] ASC Chinese (Traditional) listing: description, keywords, What's New
- [ ] Review notes updated (purchases + demo account + founder note)
- [ ] Device pass: en / zh-TW × (fresh install) / (v1.0-upgrade founder)

## zh-TW status — COMPLETE (2026-08-19)
All batches done, see docs/ZH_QA_2026-08-19.md + docs/TRANSLATION_GUIDE.md.
Places 524 · topics 44 · domains 8 · groups 7 · venues 103 · figures 139 ·
works 184 · UI dict ~460 keys, 100% coverage · schematic maps, mood heroes,
map filters all translated · build passing · 5-tab visual pass clean.
