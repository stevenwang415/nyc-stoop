# My Trip updates — working log (started 2026-07-13)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Saved plans button below header | ✅ done 07-13 | Card-style row right under the My Trip header (💾 Saved plans ›). Tapping unfolds the snapshots section at the page bottom and smooth-scrolls to it — users see where plans are stored without hunting. The quiet fold-chip at the bottom still works too. |
| 2 | Send Feedback page | ✅ done 07-13 | New full-page `FeedbackPage`: intro line, message textarea, Send button. Send opens the mail composer with the message + app version (+ account email if signed in) prefilled to hsichunw@gmail.com — zero backend needed. Reachable from BOTH: ✉️ row at the bottom of My Trip (next to My saved places) and Settings → Send feedback (was a bare mailto link; now opens the same page, same row style). |

| 3 | Day summary: meal cost + commute time | ✅ done 07-13 | Day header appends per-MODE travel totals — `🚶 ~7 min · 🚇 ~41 min` (+ 🚕 when relevant) — summed from the same per-leg estimates shown between cards, so totals always match the connectors. (v1 said `🚶 48 min` lumping subway into "walking" — wrong.) Meals: one per-person figure, `≈$140/person` — price tiers → ranges ($ 15–25 … $$$$ 90–150), lunch+dinner summed, midpoint rounded to $5. Both only appear when data exists; "≈" marks estimates. |

| 4 | Notes on meal cards | ✅ done 07-13 | Same inline "Add a note…" as stop cards, now inside each restaurant card (placeholder: "Add a note — what to order?"). Keyed by restaurant id in the existing `nyc_venue_notes` store — so a note written for Marea doesn't wrongly stick to whatever replaces it after "Show another", and returns if the user swaps back. |

| 5 | Meal cards: dollar approximation replaces $-symbols | ✅ done 07-13 | "$$$$ · Central Park South" → "≈$90–150/person · Central Park South". Shared `MEAL_PRICE_RANGE` + `mealPriceApprox()` feed both the card line and the day-summary figure, so they can never disagree. Unknown tiers fall back to the raw symbol. |

| 6 | Saved plans: dedicated page + rename | ✅ done 07-13 | Header "Saved plans" row now opens a plans-ONLY page (title "Saved plans", just the snapshot list — no saved-places sections; `savedPageMode` flag on the same overlay). Each plan card has ✎ rename: inline input, saved onto the snapshot (`name` field, max 40 chars, empty resets to the date). Custom name shows on the card AND the plan-view header. Tapping the card still opens the full saved-plan view. |

| 7 | Plan card shows trip-level estimates | ✅ done 07-13 | Saved-plan card gets a fourth line: `🚶 ~X min · 🚇 ~Y min · ≈$Z/person` — same estimators as the day headers, aggregated across every snapshotted day (travel legs between consecutive stops; meals summed for the whole trip, midpoint per person). Hidden when the snapshot has no locatable stops / priced meals. |

| 8 | "NEW" badge on just-added stops | ✅ done 07-13 | After "+ Add a place to this day", the inserted stop's card shows a small clay `NEW` pill next to its name (both curated and user-added card variants). Deliberately ephemeral — plain component state, never persisted — so it disappears the moment the user leaves My Trip, exactly the requested lifetime. Adding another place moves the badge to the newest one. |

| 9 | Hotel stops detected + honest band | ✅ done 07-13 | User-added stops matching hotel names ("Hotel/Hostel/Motel" + major chains: Marriott, Hilton, Hyatt, Ritz-Carlton, citizenM, Yotel…) get: band label `HOTEL` instead of MORNING/EVENING, NO duration (the "~1.5 hrs" was an invented number), and a 🏨 icon instead of the misfit palette. Name-based detection — known limitation: a bar named "Hotel Chantelle" would false-positive; acceptable for user-added stops, revisit with Google `types` in v1.1. |

| 10 | Trip route mini-map (friends' suggestion) | ✅ done 07-13 | Non-interactive Leaflet overview above the action bar: numbered pins in visit order + dashed "approximate route" polyline, colored per day (day hues), auto-fit bounds. Respects the day tabs (filtered day → that day only; All days → every day's route). All gestures OFF so it never fights the page scroll — it's a reference picture; the Map tab stays the interactive map. Labeled "approximate route" (straight lines, not street routing). Google-TOS: google-sourced adds (e.g. hotels added via search) are excluded from plotting, same rule as MapScreen. Backlog: "you are here" dot (needs location permission in this tab); tap map → jump to Map tab. |

| 11 | Route numbers on cards (Wanderlog-style) | ✅ done 07-13 | Every stop and meal card carries a numbered badge in its day's hue — the SAME numbers as the trip map's pins, computed from one shared plottable rule (google-sourced adds are unplotted, so they're unnumbered — otherwise card 3 would point at pin 2). Stop cards: badge leads the period band; meal cards: badge leads the LUNCH/DINNER label. Numbers restart per day, matching the per-day map groups. |

| 12 | Meal cards removable (✕) + restore chips | ✅ done 07-14 | Small ✕ on each LUNCH/DINNER header removes that meal from that day (persisted in `nyc_skipped_meals`; day summary/commute recompute). Never a one-way door: a dashed "🍴 Add lunch back / 🍷 Add dinner back" chip appears under the day. |
| 13 | User-added eateries labeled RESTAURANT | ✅ done 07-14 | Custom stops detected as food (Add-Place category `food`/`coffee`, else name keywords: restaurant/café/sushi/pizzeria/bbq/bakery…) get a RESTAURANT band + 🍽️ icon instead of MORNING/EVENING — same pattern as HOTEL. Curated stops keep their period bands. |

| 14 | Trip map interactive | ✅ done 07-14 | Pinch-zoom, drag, double-tap zoom + zoom buttons enabled (was fully static). scrollWheelZoom stays off for desktop page-scroll; on phones one-finger drag pans the map — accepted tradeoff, requested. |
| 15 | Kefi removed (permanently closed) | ✅ done 07-14 | Third closed restaurant found by hand (Class on 38th, Spotted Pig, now Kefi). The v1.1 automated liveness sweep (Google `businessStatus`) keeps earning its priority. |
| 16 | Multi-plan snapshots — Save no longer overwrites | ✅ done 07-15 | User-found bug: saving a second plan (different start date) silently overwrote plan #1 — the store was a single `nyc_plan_snapshot` slot. Now a LIST (`nyc_plan_snapshots`, newest first): each save appends a snapshot with its own id/name/date; cards, rename, delete, and the plans page all work per-plan. Saving an identical plan (same places + length + start date) opens the existing one instead of duplicating. "View your saved plan →" pluralizes and, with several plans, opens the plans page instead of one plan. Legacy single snapshots migrate automatically on first read — nobody loses their existing plan. Dead `planSaved` state removed. Headless-verified: two plans coexist, dup re-save refused, legacy key opens. |

## Design notes

- Feedback works offline-of-backend: the app never stores the message; the
  user's own mail app sends it. If v1.2 adds a backend `/feedback` endpoint,
  swap the `send()` in FeedbackPage and nothing else changes.
- The Saved-plans header button intentionally duplicates the bottom chip —
  discovery on top, muscle-memory below.

## Backlog / later

- ~~In-app feedback POST endpoint~~ ✅ done 07-14: `POST /feedback` (FastAPI +
  `feedback` table via idempotent bootstrap; `/feedback` added to vercel.json
  rewrites). FeedbackPage now sends in-app with a Sending…/✓ Sent state;
  mailto (stevenwang.nycstoop@gmail.com) survives only as the offline/API-down
  fallback. **Read messages:** Neon console → SQL editor →
  `SELECT * FROM feedback ORDER BY created_at DESC;`
- (add future My Trip items here)
