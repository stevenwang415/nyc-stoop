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

## Design notes

- Feedback works offline-of-backend: the app never stores the message; the
  user's own mail app sends it. If v1.2 adds a backend `/feedback` endpoint,
  swap the `send()` in FeedbackPage and nothing else changes.
- The Saved-plans header button intentionally duplicates the bottom chip —
  discovery on top, muscle-memory below.

## Backlog / later

- In-app feedback POST endpoint (skip the mail composer round-trip).
- (add future My Trip items here)
