# Tab updates — working log (started 2026-07-13)

**Schedule change:** App Store review submission postponed to **Friday 2026-07-17**.
Use the extra days for the tab polish below + one full device pass.

## Map tab

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1a | Legend box foldable | ✅ done 07-13 | Tap the Legend header to collapse/expand; remembers nothing (always opens expanded — cheap, predictable). |
| 1b | Legend topics clickable | ✅ done 07-13 | Tapping a category row filters the pins (same state as the chips above the map); tap again to clear. Active row highlighted. |
| 1c | Map rotatable | ✅ done 07-13 | leaflet-rotate plugin: two-finger rotate on phone, Shift+drag on desktop, compass control (bottom-right) resets north. Degrades gracefully — if the plugin fails to load, the map simply doesn't rotate. |
| 2 | "Go to My Trip" button | ✅ done 07-13 | Two touchpoints: floating pill on the map once ≥1 place is saved, and a "See it in My Trip →" link inside the pin card right after saving. |
| 3 | First-time Map tutorial | ✅ done 07-13 | One-time overlay (key `nyc_map_tut_v1`): tap a pin → + Add to Trip, filter via chips/legend, finish in My Trip. "Got it" dismisses forever. |

## Backlog / later

- (add future tab items here)

## Done earlier this week (context)

- Search: dead dataset rows removed; live events (Ticketmaster) now searchable, open in EventDetail sheet.
- Picks lists: same-place alias dedupe (The Met / Metropolitan Museum of Art, MoMA, etc.).
- Saved-places page: back arrow returns to Settings when opened from Settings.
- Settings: formal cleanup (Thanks credits row, no emoji, blurb removed, v1.0.0).
- Activity tiles: pick counts removed everywhere.
- Works data: 12 fair-use images stripped (copyright); gallery-photo credit fixed.
