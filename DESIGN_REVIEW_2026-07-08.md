# NYC Stoop — UI/UX design review (pre-submission, 2026-07-08)

Two parts: the **standards** this app's design now lives by (extracted from the
July 7–8 design passes — this is the "why it looks this way" record), and the
**applied audit** of the current build against each one. Companion to
`Review rules.md` (product scoring) — this file is about craft.

---

## Part 1 — The design standards

### S1. One illustrated language, everywhere
Hand-drawn SVG scenes in the field palette (clay `#B7472A`, ochre `#C6892F`,
plum `#6B4453`, olive `#6F7A45`, slate `#475A66` on cream `#F3EBDC`) are the
app's visual signature: home activity cards, collection cards, flow heroes
(`FlowHero`), onboarding. No emoji-on-gradient tiles, no stock flat blocks.
New surfaces inherit this or justify why not.

### S2. Serif is the editorial voice
Headlines and place names in the serif (`--serif`); UI chrome in the sans.
A screen's biggest text should sound like the guide, not the operating system.

### S3. No inventory numbers
Counts appear ONLY when they inform a decision ("3 of 4 in plan", "1 pick" as
a thin-category warning). Never as decoration ("309 RESTAURANTS", "16 picks",
header stop/meal tallies). Decided repeatedly; treat as law.

### S4. Color is wayfinding, not wallpaper
Day hues (tabs = pill = saved-list pill), period bars, subway bullets in
official MTA colors, one accent (clay) for primary actions. Never tint whole
surfaces per category; cream stays the ground.

### S5. Weight matches importance
A unit toggle is one quiet row; sign-in is a big button. Chrome earned by
consequence, not by how proud we are of the feature. Corollary: permanent
onboarding copy (tip banners) is deleted, not decorated.

### S6. Consistency of promise, not mechanism
Identical entry cards may open different structures (Eat browser vs. guided
flow) when content volume demands it — as long as design language and back
behavior match. Don't force symmetry that flattens the content.

### S7. Honest states
- Empty ≠ broken: search failures say "couldn't load", not a blank list.
- No invented data: transfer subway trips show no route rather than a wrong one;
  labels derive from actual computed times (periodForClock).
- Images degrade to designed fallbacks (color tile + initial), never broken glyphs.

### S8. Defaults read context
In NYC → Nearest; elsewhere → Recommended. Trip in progress → (future) today's
day tab. First open → controls visible; returning → summaries.

### S9. Real-device truths
Safe-areas anchored with `env(safe-area-inset-*)`, never percentage centering
near the notch. Every fixed layer clamps to the app column (`--max-width`).
Touch alternatives for gesture features (▲⠿▼ rails beside drag).

### S10. Legal-by-construction assets
Wikimedia Commons via Special:FilePath (verified against the API), Google
photos only at runtime through the Places API, self-drawn MTA bullets on open
data, no scraped or baked third-party imagery.

---

## Part 2 — Applied audit (current build)

| # | Standard | Verdict | Evidence / exceptions |
|---|---|---|---|
| S1 | Illustrated language | **PASS** | 5 FlowHero call sites (Eat + activity/mood flows), 11 covers, 3 onboarding scenes. *Known deviation:* Explore's Topic/Domain/Neighborhood heroes still use the older flat-color pattern — acceptable for v1 (deeper, lower-traffic screens); queue for v1.1. |
| S2 | Serif voice | **PASS** | Wordmark, flow heroes, day labels, card names, onboarding titles. |
| S3 | No inventory numbers | **PASS with 2 accepted exceptions** | Removed: Eat header counts, mood-card picks, My Trip tallies, chip counts. Kept deliberately: activity-tile pick counts (thin-category warning) and "X of Y picks fall on this map" (explains greyed areas). Both inform decisions; monitored. |
| S4 | Color as wayfinding | **PASS** | Day hues consistent across 3 surfaces; MTA bullets; single clay accent. One legacy `#dc2626` remains on a shared-trip banner button (14497) — pre-existing, cosmetic, v1.1 sweep. |
| S5 | Weight ↔ importance | **PASS** | Settings rows, quiet archive rows, deleted tip banner, single-line headings fix. |
| S6 | Promise over mechanism | **PASS** | Eat browser vs. guided flows behind identical cards; shared hero + back behavior sews the seam. |
| S7 | Honest states | **PASS** | Search-failure copy live (verified on device); subway detail null on transfers; periodForClock labels; image fallbacks app-wide; two closed restaurants removed on discovery. |
| S8 | Contextual defaults | **PASS** | NYC-bounds check on Eat sort; basics collapsed when date exists; onboarding v2 keyed. |
| S9 | Device truths | **PASS** | Wordmark anchor fix, nav tuck, saved-page column clamp, sticky day tabs below status bar, reorder rails. Final confirmation belongs to the phone pass. |
| S10 | Legal assets | **PASS** | 78/78 Commons URLs API-verified; runtime-only Google photos; MTA open data + self-drawn bullets; register MTA's free developer license before launch (noted in code). |

### Known deviations (accepted for v1, queued for v1.1)
1. Explore Topic/Domain/Neighborhood heroes — extend FlowHero treatment.
2. Legacy red on the shared-trip adopt button — repaint clay.
3. ~48 `var(--white)` surfaces remain — most are correct (inputs, buttons,
   sheets on cream); sweep for any card-like stragglers alongside #1.
4. Activity-tile counts: revisit once every category is deep enough that the
   thin-category warning is obsolete.

### Verdict
**Ship.** The design system is coherent, the standards are written down, and
every deviation is known, small, and scheduled — which is what "done" looks
like in real products.
