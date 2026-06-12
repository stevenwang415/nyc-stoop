# NYC Stoop — Redesign Review v3 (post-reskin audit)

**Date:** June 12, 2026
**Reviewed:** light photo-forward redesign applied today (`src/App.jsx` ~11.7k lines, `src/index.css`)
**Lenses:** senior product reviewer · UX auditor · QA tester · first-time user
**Method:** full code walkthrough. The app could not be executed in this session (local build pending on your machine), so runtime behavior is inferred from source — flagged wherever that matters. WCAG contrast ratios are computed from the actual hex tokens.

**Overall: 7.2 / 10** (up from 6.3 pre-redesign). The visual system is now coherent and modern, color roles are enforced, and the worst trust-killers (black boxes, stacked empty states, mystery pins) are gone. The score is capped by an unverified build, the reconstructed `App()` root, three real accessibility misses, and one visual bug in the new bottom nav.

---

## Scorecard

| # | Function | Score | One-line verdict |
|---|----------|-------|------------------|
| 1 | Visual design system (tokens, type, color roles) | **8.5** | Cohesive and disciplined; two contrast violations |
| 2 | Onboarding (first-run) | **6.5** | Width fixed; visuals predate the redesign |
| 3 | Explore home | **8** | Strong hero + rails; heading/title redundancy |
| 4 | Global search | **7** | Good scoping + escape hatch; stale chip palette |
| 5 | Editorial depth (Domain / Topic / Figure / Work) | **7.5** | Still the moat; now reads light and clean |
| 6 | Venue Detail | **7.5** | Hero/sheet/FAB pattern lands; no real photos yet |
| 7 | Tonight (This Week) | **8** | Day strip + count-aware chips are excellent |
| 8 | Eat | **6.5** | Untouched; known dietary-filter gaps remain |
| 9 | Map | **7.5** | Unified palette + legend fix a real trust hole |
| 10 | My Trip / Plan | **7** | Empty state fixed; populated state still dense |
| 11 | Saving / hearts system | **8.5** | One color, one meaning, everywhere |
| 12 | Bottom nav / navigation shell | **7** | Floating bar is right; active-icon fill bug |
| 13 | Settings / account | **7** | Full-featured; emoji icons inconsistent now |
| 14 | Trip sharing | **7** | Robust resolve + adopt; old indigo header |
| 15 | QA / release readiness | **4** | Build unverified; App() is a reconstruction |

---

## 1. Visual design system — 8.5/10

**What works.** Single source of truth in `:root`; the legacy `--gray-*` names remapped onto the new ink scale means all ~1,150 inline styles inherited the reskin without drift. Blue = action and pink = heart are enforced app-wide (I traced every former red/green CTA). Radii follow the 16/22/28 ladder. Inter 800 with −0.02em replaced Playfair in headings; Playfair survives only in the drop cap, which is a nice editorial wink.

**Findings.**
- **A11y-1 (P1):** `--accent #3d9bff` on white computes to **2.86:1**. Every "See All" link (13px), the Tonight time lines (12px), and "Map view" fail the spec's own ≥4.5:1 rule. Passes only at large-text sizes.
- **A11y-2 (P1):** `--ink-3 #9aa6b4` computes to **2.48:1** on white and is used at 10–11px (inactive nav labels, metas) — the spec says tertiary color at large sizes only.
- Pink `#ff4d7d` as an icon is 3.18:1 → passes the 3:1 non-text minimum. Fine.
- Settings rows, saved-list rows, and category chips still use emoji as de facto UI icons (📥 🗑️ 📂 ⚙ replaced only partially) — the "one icon system" rule is ~80% adopted.

**Suggestions.** Introduce `--accent-text: #1576d1` (≈4.6:1) for any accent-colored text under 18px while keeping `#3d9bff` for fills, pills, and the FAB glow; darken small ink-3 text to ink-2. Sweep Settings/list rows onto `NavIcon`. Also update `apple-mobile-web-app-status-bar-style` from `black-translucent` — the shell is light now.

## 2. Onboarding — 6.5/10

**What works.** Now constrained to the 430px app column (was edge-to-edge on desktop — fixed per spec). Three slides, skippable, versioned localStorage key, eyebrow corrected to NYC STOOP.

**First-time-user read.** The slides still use the *old* saturated full-bleed gradients (navy, crimson, green) — the very aesthetic the app just left behind. The user's first 10 seconds contradict the product they land in.

**Suggestions.** Reskin slides to canvas-light with one 28px-radius photo/gradient card per slide and blue CTA; slide 2's heart glyph should be pink, not white-on-red. Low effort, high first-impression ROI.

## 3. Explore home — 8/10

**What works.** Light top bar (menu dots / wordmark / avatar) replaces the black masthead. The 300px featured card is the redesign's centerpiece and it's correctly layered: gradient fallback → photo → byline chip (26px avatar, "NYC Editors / refreshed weekly") → frosted title panel → pink heart pill. The gradient *base layer* guarantees no black boxes even on failed loads — acceptance criterion met. Moods/Eat rail converted to white photo-top cards; browse-by chip grid survives intact.

**Findings.**
- The section heading "Your Night-Out Inspiration" sits 14px above a frosted panel that repeats a title — two large 800-weight text blocks compete. Minor, but the eye bounces.
- Rail cards are 132px wide; labels like "Date Night Spots" will ellipsize hard at 13px. Spec said 124px — I'd go the other way, to 140.
- The hero title panel is single-line ellipsized; long pick titles ("Vermeer's Mistress and Maid at the Frick") will truncate. Allow two lines.
- Search-result type chips still use the old saturated palette (`#1a56db`, `#7c3aed`…), not the new category palette used by Map/Tonight.

**Suggestions.** Allow `WebkitLineClamp: 2` on the panel title; unify the type-chip palette; consider wiring the menu-dots button to something distinct from the avatar (both currently open Settings).

## 4. Global search — 7/10

**What works.** Scopes across venues, sights, figures, works, and user places; prefix-boost ranking; capped at 25; the "we haven't curated that" empty state with a Google Maps handoff is honest and keeps trust.

**Findings.** No keyboard dismiss / recent searches; result rows for `user_venue` are dead taps (disabled but visible); no debounce (fine at this catalog size, will scale poorly).

**Suggestions.** Hide or link user-venue rows to My Trip instead of rendering an inert button; add a one-line "Searching N curated places" caption to set scope expectations early.

## 5. Editorial depth (Domain / Topic / Figure / Work) — 7.5/10

**What works.** This remains the product's differentiation — real prose, "what to look for" numbered lists (now blue), figure bios, works with Wikimedia images. The black `.topic-intro` and Playfair masthead are gone; long-form pages now read like a light magazine, and `hero-img` keeps a gray placeholder behind images.

**Findings.** Specialties chips on venue pages still use `colors.bg` at 0.85 opacity — some category colors at 11px white text will be sub-4.5:1; venue-group and see-also blocks inherited the reskin passively (correct but unreviewed by a designer's eye).

**Suggestions.** Tint specialties chips like Tonight's badges (`color: tint, background: tint+'18'`) instead of solid fills — same family, better contrast, lighter feel.

## 6. Venue Detail — 7.5/10

**What works.** The new anatomy is exactly the modern travel-app pattern: 45vh gradient hero → scrim → 30px/800 white title → 28px-radius sheet pulled up −24px → pink 52px heart FAB straddling the seam → facts tiles → drop-cap lede → blue "Add to My Trip" pill → gray map pill. "Playing now" card flipped from near-black to white with blue CTA. Editorial callout ("Why NYC Stoop picked this") survives.

**Findings.**
- **The hero is a gradient, not a photo.** Venues have no `image` field, so the "photo-forward" promise is only half-kept on the screen where it matters most. Works already use Wikimedia URLs — the pattern exists.
- Double chrome: the sticky white TopNav sits above the hero, so users get a nav bar *and* an immersive hero; the spec wanted a floating circular back button on the hero itself.
- Facts row fills gaps with "—" / "See site" / "Flexible" — three tiles of filler on data-poor venues looks worse than no row.
- `colors.bg + 'B8'` alpha-suffix assumes 6-digit hex; holds today (venueMeta is all hex), but a future `rgb()` value would silently break the gradient.

**Suggestions.** (1) Add `image` to the top ~20 venues (Wikimedia, same as works) — this is the single highest-impact visual task left. (2) Hide TopNav on `screen === 'venue'` and overlay a 40px white back button. (3) Render facts row only when ≥2 real values exist.

## 7. Tonight — 8/10

**What works.** Day-of-week strip with per-day counts, count-aware filter chips that hide empty categories, time-of-day grouping with editorial count copy, day-aware empty state with a reset. New header (big "Tonight", `Friday · 4:55 PM · 12 ideas`, Map view link) matches spec; cards are now white/22px with 84px square thumbs on gradient fallback, blue time line first, pink heart.

**Findings.**
- Heading says **"Tonight"** while the tab is labeled **"This Week"** and the strip can be on Wednesday — three names for one surface. The subline's time is *now* but the count is for the *selected* day; subtle mismatch.
- The pre-redesign blocker stands: the hero on Explore ignores `bestDays` (can pitch a dark-Monday show); same data is handled correctly here.
- Map view link renders only when `onViewMap` is passed — wired in the reconstructed App(), needs a runtime smoke test.

**Suggestions.** Make the heading dynamic ("Tonight" / "Thursday night"); rename the nav label to match; fix the Explore-hero `bestDays` filter (one-line, flagged in v2 as B1, still open).

## 8. Eat — 6.5/10

**What works.** Cuisine/price/neighborhood filters, walk-in toggle, reservation links, 60+ restaurants; inherited the light theme cleanly; promoted to the glowing center button — discoverability solved.

**Findings.** Functionally untouched, so v2's blockers stand: **no dietary filters** (vegetarian/halal/kosher/GF — B2) and **ghost vibes** returning one result (family_friendly — B3). Promoting Eat to the center spotlight *raises* expectations on exactly the screen with known content gaps. The red "Where to eat" rail card kept `#dc2626` — acceptable as a content color, but it's the loudest tile on a now-quiet home screen.

**Suggestions.** Dietary tags are now the top backlog item by ROI; until then, soften the rail card to the food-category gradient used elsewhere.

## 9. Map — 7.5/10

**What works.** Pins now use the *same* eight category colors as chips and tags app-wide (was a second, unrelated palette — a straight trust bug, now fixed), plus an on-map legend that collapses to the active filter and explains the pink "saved" ring. Saved venues get bigger pink-ringed markers. Popup card has heart, directions, explore.

**Findings.** Default OSM raster tiles are visually loud against the new pastel UI; legend lists up to 9 rows on "All" — tall but acceptable; muted category colors (e.g. history `#6A6A6A`) are less glanceable as 8px dots than the old saturated set — the cost of consistency.

**Suggestions.** Swap tiles to a light style (Carto Positron is free with attribution) — one line, large aesthetic payoff; add a white halo (`weight: 2.5`) on all pins for the pastel palette.

## 10. My Trip / Plan — 7/10

**What works.** The two stacked empty states are now one count-aware block — "You have N saved places — build tonight's plan" (deduped so user-venues aren't counted twice) — with a 3-step how-it-works row and a blue CTA that scrolls to scheduling. Day-by-day itinerary with drag reordering, per-meal cuisine pickers, swaps, notes, Google Takeout import accordion, share links.

**Findings.** This is the app's most complex surface and the redesign only touched its front door; inside, density is high (Your Places, Saved Plans, Scheduling, Saved — four stacked sections). The "62 imported places" all default to `category: 'food'`, so itinerary meal-slotting treats jazz bars as restaurants (pre-existing). Header is still the `home-header` wordmark pattern rather than the new top bar.

**Suggestions.** Next design pass should be *this screen's interior*: collapse Saved Plans into a card row, move Your Places behind a tab. Add a one-tap category fixer for imported places ("12 of these look like bars — recategorize?").

## 11. Saving / hearts — 8.5/10

**What works.** One semantic everywhere: pink `#ff4d7d`, filled = saved, outline = not. Verified all ~14 heart sites (hero pill, venue FAB, sight header, work rows, map popup, map ring, Tonight cards, saved-count pill, nav badge). Unsaved hearts on photo overlays sit on a frosted white pill so the pink reads. Badge on My Trip tab; saved-count pill on Tonight links to planning.

**Findings.** Heart-only affordance on the detail FAB has no label; first-timers learn it from onboarding slide 2 (which still shows it red — see §2). `SavedDot` (20px, read-only) and tappable hearts (30–34px) look similar but behave differently.

**Suggestions.** One-time tooltip on first FAB render ("Saved to My Trip"); consider a subtle scale animation on toggle — the state change is currently instant and easy to miss.

## 12. Bottom nav / shell — 7/10

**What works.** Floating bar on `blur(12px)` white, 64px, hairline top border, soft up-shadow; center 48px blue circle with the spec'd glow (`0 10px 22px rgba(61,155,255,.45)`) and white ring; stroked 1.8px icon set replaces five emoji; active = ink, inactive = ink-3; pink badge.

**Findings.**
- **Bug (P1, visual):** active state sets `fill = color` on multi-part icons. The compass becomes a solid ink disc (needle invisible), map-pin's circle hole disappears, utensils fill oddly. Only bookmark and moon fill cleanly.
- Inactive labels at 10px ink-3 → the contrast miss from §1.
- Center slot is **Eat**, not the spec's "+ add" — defensible (deliberate post-eval decision, add lives in My Trip), but a first-timer may read a glowing blue circle as "create."

**Suggestions.** Use fill only for `bookmark`/`moon`; for compass/pin/utensils keep `fill: none` and bump `strokeWidth` to 2.4 when active. Keep Eat in the center but consider a fork-*and*-knife glyph reading more "food" at 21px.

## 13. Settings / account — 7/10

**What works.** Email+Google auth, avatar upload with client-side resize, nickname overlay, Takeout import entry, privacy/GitHub links, two-tap destructive clear with honest copy. Auth state survives the redesign untouched.

**Findings.** Row icons are all emoji (📥 🗑️ 📂) — the most visible "one icon system" violation left; the clear-data confirm uses the old red error palette (correct semantically — leave it); **the settings entry moved from a gear to menu-dots + avatar, both opening the same modal** (redundant, and "menu" implies navigation, not settings).

**Suggestions.** Swap row emoji for NavIcon equivalents; make the avatar open Settings and the dots open a lightweight sheet (About / Share app / Settings) or drop the dots.

## 14. Trip sharing — 7/10

**What works.** Hash-encoded `#/t/` links, graceful resolution of unknown IDs with an honest warning, non-destructive adopt that merges stops and copies trip length/start, "Skip — use NYC Stoop normally." Reconstructed adopt logic validates each id type before merging.

**Findings.** Recipient header still wears the old indigo gradient + 🎁; the whole view predates the reskin. Adopt lands on My Trip — correct — but there's no undo.

**Suggestions.** Reskin header to a light card with blue accent; toast with "Undo" after adoption.

## 15. QA / release readiness — 4/10 ⚠️

This is the gating section. In order of severity:

1. **Build never executed.** The redesign touched ~600 lines across the two core files. Until `npm run build` passes on your machine, treat everything above as design-complete, not ship-complete.
2. **`App()` is a reconstruction** (the file-truncation incident). It cross-references every component correctly in static analysis, but auth refresh, reset-token deep links, shared-trip adoption, Takeout import, and tab/back-stack interplay need a manual pass. **Smoke-test script:** launch → onboarding → Explore → hero card → heart → back → Tonight → pick → "Add to My Trip" → Map (legend, pin, popup heart) → Eat → filter → My Trip (count in empty state, build plan) → Settings (sign in, sign out) → reload (saves persist) → open a `/#/t/…` share link → adopt.
3. **Old design still in production** at nyc-stoop.vercel.app, and `docs/` + `dist/` landing pages still carry the dark brand — redeploy plus a landing-page pass needed for consistency.
4. The two contrast violations (§1) and the active-icon fill bug (§12) should ride along in the same fix batch.
5. Housekeeping: 15 stray `vite.config.js.timestamp-*.mjs` files in the repo root; `.env` committed inside `backend/`; git HEAD is 14 days and one full redesign behind the working tree. **Commit immediately after the build passes** — today demonstrated exactly why.

---

## Top 10 actions by impact ÷ effort

1. Run `npm run build` + the smoke script above; commit everything (release gate)
2. Fix active-icon fill bug in BottomNav (15 min)
3. Add `--accent-text` darker blue for sub-18px text; darken small ink-3 labels (30 min)
4. Add Wikimedia photos to top 20 venues — makes Detail actually photo-forward (2–3 hrs)
5. Fix Explore hero `bestDays` filter — v2's B1, still open (one line)
6. Reskin onboarding slides to the new light language (1 hr)
7. Swap map tiles to a light basemap (15 min)
8. Dynamic "Tonight / Thursday night" heading + rename This Week tab (30 min)
9. Dietary tags for Eat — v2's B2, now center-stage (schema + backfill)
10. Replace Settings emoji rows with NavIcon set (30 min)

*Scores 1–14 average to 7.4; weighted with release readiness, the product sits at 7.2 — a real step up from 6.3, with the gap to 8+ being almost entirely execution-verification rather than design.*

---

# Addendum — Top-10 actions executed (same day)

Actions 2–10 are now implemented in code. Re-scores below; every function is at or above 7 except release readiness, which only the local build can clear.

| Function | Was | Now | What changed |
|----------|-----|-----|--------------|
| Visual design system | 8.5 | **9** | `--accent-text #1576d1` (4.6:1) for all sub-18px blue text; `--gray-500` darkened to #65717f (4.98:1); small ink-3 labels swept to compliant colors |
| Onboarding | 6.5 | **8** | Slides reskinned to canvas-light: 28px gradient emoji tiles, ink type, blue glow CTA, pink heart slide — first impression now matches the product |
| Explore home | 8 | **8.5** | Hero now bestDays-aware (B1 closed — no more dark-Monday Hamilton); Eat rail card softened from alarm-red to warm peach |
| Venue Detail | 7.5 | **8.5** | Real photos: 22 curated Wikimedia venue images (`data/venueImages.js`) + automatic fallback to work-at-venue images (covers architecture), all layered over the gradient so misses degrade safely |
| Tonight | 8 | **8.5** | Heading is day-aware ("Tonight" / "Wednesday night"), subline adapts, tab renamed to match |
| Eat | 6.5 | **7.5** | Dietary filter row (Vegetarian-friendly / Vegan options / Gluten-free options) with conservative per-restaurant tags incl. plant-based EMP; family_friendly grew from 1 → 7 results (B2/B3 closed at catalog scale); honest "confirm for allergies" disclaimer. Halal/kosher intentionally not tagged — needs verified data, not guesses |
| Map | 7.5 | **8.5** | Carto Positron light basemap; thicker white pin halos for the muted palette |
| Bottom nav | 7 | **8** | Active-icon fill bug fixed (fill only bookmark/moon; others get 2.4px stroke); inactive labels now ≥4.5:1 |
| Settings | 7 | **7.5** | All row emoji replaced with stroked NavIcons (sign-out, download, lock, mail, code, trash, key) |
| QA / release readiness | 4 | **5.5*** | All known code bugs fixed; *remaining gap is purely the unexecuted local build + smoke test + commit |

**Projected overall after a passing build: ~8.1 / 10.**

**Remaining for you (Action 1):**
1. `npm run build` in NYC_APP — paste any errors back to the session
2. Smoke script: onboarding → Explore → hero card → heart → Tonight → pick → Add to My Trip → Map (light tiles, legend) → Eat (Dietary row) → My Trip → Settings sign-in/out → reload (saves persist)
3. Spot-check 3–4 venue heroes (Met, MoMA, Carnegie Hall, Village Vanguard) — any that show a gradient instead of a photo just need their filename swapped in `src/data/venueImages.js`
4. `git add -A && git commit` — the working tree is one redesign + 14 days ahead of HEAD
5. `vercel --prod` when satisfied
