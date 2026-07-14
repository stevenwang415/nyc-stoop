# Explore tab updates — working log (started 2026-07-13)

## Browse-by topic cards: fill with category color, or keep cream?

**Decision: keep cream. Do not fill.** (Design law S4 in
DESIGN_REVIEW_2026-07-08.md: "Color is wayfinding, not wallpaper — never tint
whole surfaces per category; cream stays the ground.")

Why filling loses:

1. **Eight tinted rectangles = a paint chart.** The muted field palette works
   as accents; as eight adjacent surfaces it turns the calmest screen in the
   app into its loudest, and every card shouts equally — so none stands out.
2. **Contrast breaks.** Dark serif ink is comfortable on cream; on olive,
   plum, and slate fills half the labels would need white text, splitting the
   typography system in two.
3. **The dots are a system, not decoration.** The same category colors appear
   as map pins and in the map legend. A small swatch says "this color MEANS
   this topic everywhere"; a filled card reads as styling, and the connection
   to the map quietly dies.
4. **Brand texture.** Cream cards + serif is the guidebook voice. Full-bleed
   color tiles read app-store-generic — the opposite of the hand-drawn
   identity everywhere else.

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Topic-card treatment decision | ✅ decided 07-13 | Keep cream + dot + serif. No fills. |
| 3 | Eat: price coverage for all food seeds | ✅ done 07-14 | 77 food entries had `price: null` → bare cards under Nearest. Filled all: keyword tiers (bakery/bagel/pizza/taco → $, steakhouse/omakase/hotel → $$$, default $$) + 20 hand-set famous rooms (Musaafer/Café Carmellini/Aman $$$$, Laser Wolf/Oiji Mi/Gage & Tollner $$$…). Tiers render as ranges ("$20–40") so nothing reads as a precise quote. Stars now only show under "Top rated" sort (consistency). |
| 4 | Eat: "Show all" now toggles to "Show less ↑" | ✅ done 07-14 | Eat's list already collapsed to 10 with "Show all recommendations ↓" — but expansion was one-way. The button now flips to "Show less ↑" at full depth, collapsing back to the top 10. Same toggle pattern as the mood picks. |
| 2 | "Show more" on NYC Stoop picks | ✅ done 07-14 | Default stays a 6-pick curated shortlist (decided > comprehensive); a dashed "Show more" reveals +6 at a time, hard-capped at 15. Resets when the area or activity changes. Button only appears when more picks actually exist. Rationale: rejecting the shortlist shouldn't dead-end, but deep cuts into the pool surface voice-less dataset entries — Eat/Explore remain the browsers. |

## Backlog / later

- Optional refinement (not scheduled): put the dot inline BEFORE the label
  ("● Visual Art" on one line) instead of floating above it — tightens the
  card, reads more editorial, changes nothing about the color system.
- v1.1 (already queued in DESIGN_REVIEW): extend FlowHero treatment to the
  Topic/Domain hero screens these cards open into.
