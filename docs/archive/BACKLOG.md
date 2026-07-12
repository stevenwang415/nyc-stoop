# NYC Stoop — backlog & open issues

_Living punch-list. Grouped by priority. Updated 2026-06-23 (after data-fill + closure sweep)._

Legend: `[ ]` open · `[~]` in progress · `[x]` done · `(you)` = needs your action/data.

---

## OPEN — data depth (the remaining frontier)

- [ ] **Live / culture / outdoors are still thin in most areas.** Drinks & coffee are now filled citywide; the gap has moved to these three columns. Worst:
  - **live**: empty in Crown Heights, Park Slope, Greenpoint, Prospect Heights, Gramercy, Lower Manhattan (0 each); thin in ~10 more.
  - **culture**: empty in Greenpoint, Lower Brooklyn, DUMBO, Williamsburg (0 each).
  - **outdoors**: empty in Crown Heights, East Brooklyn, Chelsea, Uptown, UWS, Gramercy, Midtown East, Williamsburg, EV/LES (0 each).
- [ ] **A few drinks/coffee cells dipped below 5** after the closure sweep removed dead venues — backfill with verified-open spots: drinks (Clinton Hill 3, Greenpoint 4, Chelsea 4, Prospect Hts 4); coffee (Park Slope 2, Chelsea 1, Crown Heights 3, Gramercy 3, East Bklyn 4).
- [ ] **Coverage is still Manhattan + core Brooklyn.** Queens, the Bronx, and deep/south Brooklyn are light.
- [ ] **Editorial leans on canonical landmarks** — deeper, less-obvious local cuts would lift the local score.

## OPEN — features

- [ ] **Browse-all card view for every place in the database.** A scannable card per venue (photo, rating, hours, category) with Add-to-Trip — surfacing the full ~705-venue dataset, not just mood/neighborhood results. _(you flagged this for an upcoming session)_
- [ ] **Make Tonight fully live** — live ticketed events are wired; activate by keeping `VITE_TICKETMASTER_API_KEY` in the Vercel build.
- [ ] **Proactive import-quality audit** — one script flagging non-destination categories (shopping/vintage as places), missing coords, category mislabels. (Closure + coordinate checks already exist.)

## OPEN — polish

- [ ] Plan-my-night can pick a cocktail bar as the "dinner" slot — prefer a real restaurant.
- [ ] Bundle ~1.7 MB, no code-splitting — lazy-load for faster first load.
- [ ] Live events only show under the Tonight "All" filter.
- [ ] Home "This Week" is led by Open-Data events — could surface a few ticketed shows too.

---

## DONE this session

- [x] **Data fill** — drinks & coffee brought to 5+ in every neighborhood; added venues across Crown Heights, Downtown Brooklyn, DUMBO, Prospect Heights, Park Slope, Greenpoint, Clinton Hill, and Manhattan (Harlem, UWS, UES, Midtown, Chelsea, Flatiron, Hell's Kitchen) + outer Brooklyn.
- [x] **Closure sweep** — checked all 705 places against live Google status; removed 28 closed/defunct venues (Mama Fox, Cafe Regular, Glady's, Olmsted, ATLA, Barbetta, Tin Building, etc.).
- [x] **Full enrichment** — every venue now has real Google coordinates, rating, hours; coordinate audit clean (no place >2km from its ZIP).
- [x] **Closed-venue safeguards** — enrich now resolves by name+neighborhood and excludes temp+perm closed; seed merge now **prunes** removed places from cached localStorage; "Open in Google Maps" link now uses the address (no wrong-business redirects).
- [x] **Brooklyn map** — Downtown Brooklyn widened; Prospect Park merged into Prospect Heights; DUMBO extended to the waterfront.
- [x] **Recommendations** — Add-to-Trip on mood + neighborhood sheets; fast-food filtered; near-duplicate dedup; outdoors activity populated from parks.
- [x] **API keys** verified live (Ticketmaster + Google Maps).

---

### Suggested next session

1. Fill **live / culture / outdoors** the same way we did drinks/coffee (DB-first → editorial → enrich to verify open).
2. Build the **browse-all card view**.
3. Backfill the handful of sub-5 drinks/coffee cells.
