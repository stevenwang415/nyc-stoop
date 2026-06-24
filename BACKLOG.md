# NYC Stoop — backlog & open issues

_Living punch-list of problems to fix and modifications to make. Grouped by priority. Updated 2026-06-23._

Legend: `[ ]` open · `[~]` in progress / built, not yet deployed · `[x]` done this session · `(you)` = needs your action/data, not code.

---

## Tier 1 — highest impact

- [x] **Dead Brooklyn neighborhoods.** Downtown Brooklyn returned 0 in every column (polygon sat too far north); Prospect Park was empty parkland. → Widened Downtown Brooklyn south into Boerum Hill (now eat 3, drinks 1); merged Prospect Park into Prospect Heights with the museum/gardens ring (culture 3).
- [x] **API keys live in production.** Verified on the deploy: Ticketmaster fires + returns 200 (Live Tonight authenticated); Google Places photos render on import cards. _(you: keep them set; redeploy after each push.)_
- [~] **Ship this session's code.** Brooklyn merge, fast-food filter, Add-to-Trip on recommendation sheets, and coordinate fixes are built + build-verified but only go live on your next push + Vercel rebuild. _(you)_

## Tier 2 — content / data depth (the real local frontier)

- [ ] **Nightlife & coffee are thin almost everywhere.** Drinks is the emptiest column citywide (mostly 0–1); coffee sparse across Brooklyn and uptown. Logic is correct — the gap is venues in the DB. Use `COVERAGE_GAPS.md` as the punch list. _(you: add venues, then run `scripts/enrich-places.mjs`.)_
- [ ] **Brooklyn outdoors is empty.** The parks fix populated Manhattan (Central Park, High Line, etc.); Brooklyn has no park venues in the data yet (Prospect Park, Brooklyn Bridge Park, Domino Park…). _(you / or we add a small park set.)_
- [ ] **Coverage still Manhattan + a slice of Brooklyn.** Queens, the Bronx, deep Brooklyn are light. A local outside the core finds little.
- [ ] **Editorial leans on canonical landmarks.** Front-page picks read like greatest-hits a local already knows. Deeper cuts would lift the local score.

## Tier 3 — data quality & tooling

- [ ] **Proactive import-quality audit.** We've hit three flavors of bad import data reactively — wrong coordinates, supermarkets, fast-food chains. Build ONE script that flags the next batch before they ship: non-destination categories (shopping/vintage surfacing as places), suspicious/chain names, missing coords, category mislabels. (Coordinate check already exists: `scripts/audit-coords.mjs`.)
- [x] **Coordinate audit.** `scripts/audit-coords.mjs` flags places >2km from their address ZIP. Currently clean (fixed Sweet Rehab, The RealReal, Devoción).
- [x] **Fast food out of recommendations.** Shake Shack et al. filtered everywhere; 3 chain entries removed from the curated DB.
- [x] **Near-duplicate dedup.** Recommendations dedupe on brand base name ("Hole In The Wall" vs "…- Murray Hill" collapse to one).

## Planned (assigned for later)

- [ ] **Browse-all card view for every place in the database.** Render a card for each venue (photo, rating, hours, category) that the user can scan and add to My Trip — surfacing the full seeded dataset, not just mood/neighborhood results. (User to assign; targeted for an upcoming session.)

## Polish / nice-to-have

- [ ] **Plan-my-night can pick a cocktail bar as "dinner."** Serves food, but reads odd. Prefer a pure-restaurant for the dinner slot.
- [ ] **Bundle size ~1.7 MB, no code-splitting.** Vite warns each build. Lazy-load heavy routes/data for faster first load.
- [ ] **Live events only show under the Tonight "All" filter.** A category filter hides the ticketed concerts/sports. Could fold them into matching filters.
- [ ] **Home "This Week" is led by Open-Data events/farmers markets.** Ticketmaster concerts live in the Tonight tab; consider surfacing a few ticketed shows on the home feed too.

## Done earlier this session (for reference)

- [x] Outdoors activity populated by mapping park/waterfront venues (was 0 everywhere).
- [x] Live Tonight: live-event counts folded into the night-selector strip.
- [x] Add to My Trip on mood recommendation sheets + neighborhood "From your list" (was Google-Maps-only).

---

### Suggested next actions

1. **You:** push + redeploy so this session's fixes go live; start filling drinks/coffee gaps from `COVERAGE_GAPS.md`.
2. **Me (no new data needed):** build the proactive import-quality audit (Tier 3), then optionally the Plan-my-night dinner fix or a Brooklyn parks set for outdoors.
