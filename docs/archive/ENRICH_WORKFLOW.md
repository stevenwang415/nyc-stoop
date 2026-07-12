# After adding venues to an area — run these

Whenever new places are added to `src/data/places.js` (e.g. a new neighborhood
batch), run this sequence locally from the repo root:

```bash
node scripts/enrich-places.mjs      # fill coords / rating / hours / price / cuisine / website from Google
node scripts/audit-coords.mjs       # flag any coordinate >2km from its address ZIP (bad geocodes)
node scripts/coverage-matrix.mjs    # regenerate COVERAGE_GAPS.md with updated counts
```

Then commit + redeploy:

```bash
git add -A && git commit -m "Add <area> venues" && git push
```

## Notes
- `enrich-places.mjs` only processes rows with `enrichedAt: null`, so it's safe to
  re-run; it never overwrites the hand-written `description` / `insiderTip`.
- It needs the Google key — resolved from `--key=`, `GOOGLE_MAPS_API_KEY`,
  `VITE_GOOGLE_MAPS_API_KEY`, or `.env.local`. Set a daily quota cap first.
- Useful flags: `--dry-run` (preview), `--limit=25` (cheap test), `--force`
  (re-enrich everything), `--address-only` (cheap address backfill).
- If `audit-coords.mjs` flags a place, correct its `lat`/`lng` in places.js to
  match the address, then re-run it until clean.
- New entries until enriched still classify correctly in-app via their
  `neighborhood` string, but won't have map pins / ratings / photos yet.

## Progress
- [x] Crown Heights — venues added (enrich pending)
- [x] Downtown Brooklyn — venues added (enrich pending)
- [x] DUMBO — venues added (enrich pending)
- [ ] Park Slope
- [ ] Greenpoint / Lower Brooklyn / Clinton Hill
- [ ] (continue down DATA_PRIORITY.md)
