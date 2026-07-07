# Explore + Tonight — re-review #6 (the data-and-polish week)

_Sixth pass, same two personas, current build (HEAD 7334de3 + uncommitted header polish).
Since 06-30 what shipped is: **22 new places** via csv_import (17 bagel shops citywide, plus
NY Botanical Garden, Fort Tryon Park, Inwood Hill Park, Morningside Park, Bronx Museum), a
**weather chip** (Open-Meteo emoji + temp, top-left of home) with a **live day/time readout**,
and a re-centered wordmark. Verified in code: build compiles clean; new places flow into Eat
(Bagel is a real cuisine chip, App.jsx:3765) and the outdoors/culture activity flows; area:""
on the imports is harmless (filtering uses neighborhood regex + lat/lng, not the area field);
My Trip still persists and restores via localStorage. 2026-07-07._

---

## Headline

**This was a widening week, not a fixing week — and the scores hold flat to prove it.**
The database grew in two smart directions (bagels: the most local-coded food category in the
city; and Upper Manhattan/Bronx: real coverage past the tourist core), and the weather + clock
chip is a warm little "this app lives in today" touch. But the two items every prior pass
flagged didn't move: **the moods are still orphaned** (date_night, just_chilling et al. are
literally unreachable — no UI path opens any moodId but 'anything'), so the visitor's "guide
me" door is still missing; and **Tonight is still named Tonight**. Worse, the 22 new places
shipped *thin* — rating: null, description: "", insiderTip: "" on every one — which is breadth
without the curation both personas come here for. Nothing regressed, nothing structural
improved: **Maya holds 9.3, Tom & Rachel hold 9.2.** Per the rules, a number only moves if
behavior moved for that persona. It didn't.

**Scores: 06-30 → 07-07**

| Dimension | Local (Maya) | Visitor (Tom & Rachel) |
|---|---|---|
| First impression | 9 → 9 | 9 → 9 |
| Clarity of purpose | 9.5 → 9.5 | 9 → 9 |
| Content relevance | 9 → 9 | 9 → 9 |
| Navigation & flow | 9.5 → 9.5 | 9.5 → 9.5 |
| Trust & credibility | 9.5 → 9.5 | 9.5 → 9.5 |
| Delight & return | 9.5 → 9.5 | 9 → 9 |
| **Overall** | **9.3 → 9.3** | **9.2 → 9.2** |

---

## What moved since 06-30

| Shipped | Who it helps | Effect |
|---|---|---|
| **+17 bagel spots** (GERTIE, Apollo, Tompkins Square, Utopia…) with a working Bagel cuisine chip in Eat | Local most | The right *kind* of depth for a resident — but every entry is unrated, undescribed, untipped |
| **+5 uptown/Bronx anchors** (NYBG, Fort Tryon, Inwood Hill, Morningside, Bronx Museum) feeding Outdoors/Culture | Both | First real coverage past the core; same thinness caveat |
| **Weather chip** — Open-Meteo emoji + °F, day/night aware (App.jsx:13602, 4482) | Both | Warm, alive header. Display-only — it doesn't influence a single recommendation yet |
| **Live day · time chip + absolutely-centered wordmark** (uncommitted) | Both | Polish; the header no longer drifts off-center |

Not shipped: the Collections/moods row (the standing must-fix), the Tonight → Events rename
(standing should-fix), any enrichment of imported-pool curation.

---

## Persona A — Maya, Williamsburg local (holds 9.3)

- **Scenario 1/2 ("I want a drink / what's near me"):** unchanged and still excellent — tap
  Drinks → Near me → bars around Williamsburg. The activity spine from last pass is intact.
- **Bagels are a genuinely local move.** A six-year resident argues about bagels; 17 real shops
  including Bagel Hole and Utopia says someone here knows the city. But she taps Greenberg's
  and gets… a name, a neighborhood, hours, and a Google-photo fallback. No rating, no
  description, no tip (verified: empty fields render as *omitted sections*, App.jsx:5115–5131 —
  so it looks clean, just sparse). That's a listing, not a recommendation. Breadth up, curation
  flat → Content stays 9.
- **The weather chip is her kind of detail** — glance, 74° and sun, "fine, Outdoors." Except
  the app doesn't make that connection for her: weather is verified display-only. The moment
  it filters ("rainy → skip Outdoors, here's where to hole up"), it's a score-mover.
- **Small wart:** the imports surface in home search labeled **"Your place"** (App.jsx:1496).
  GERTIE isn't her place; the label lies a little.
- **Still capping her at 9.3:** same as last pass — the activity pools are broad but editorially
  shallow, and Brooklyn is still one area chip. This week widened the pool without deepening it.

**Maya: 9.3.** "More bagels, sure — but tell me *which one* and *why*, or I'm back on Google."

---

## Persona B — Tom & Rachel, visitors (holds 9.2)

- **The regression from 06-30 is still open.** The curated moods ("First time in NYC," "Date
  night") remain defined in moods.js and unreachable from any UI path (verified — every entry
  pushes moodId 'anything'). A first-time visitor still has no "we don't know what we want,
  guide us" door. This was the must-fix; it's now a week old.
- **The new coverage is quietly good for them** — bagels are a visitor pilgrimage too, and Fort
  Tryon (the Cloisters' park) + NYBG are legitimate day-trip anchors. But with description and
  insiderTip empty, the "local friend" voice — the thing this persona pays for — is absent
  exactly where they need it most on unfamiliar places.
- **Tonight is still "Tonight."** The tab still undersells its weekend/week content; the
  standing should-fix rename hasn't happened.
- **Trip flow still solid:** build → save → reload restores (localStorage verified,
  App.jsx:9145–9159); "+ Add to My Trip" remains the one clear verb everywhere.

**Tom & Rachel: 9.2.** "It got bigger, not warmer. We're still waiting for the 'inspire us'
button to come back."

---

## What's working — keep this

- **The activity-first spine + location-on-open.** Untouched this week and still the app's core
  strength for the local.
- **Graceful degradation on thin data.** Empty ratings/descriptions hide their sections instead
  of rendering blanks, and missing images fall back to a color tile + emoji (App.jsx:5106–5112).
  Nothing *looks* broken — that's why Trust holds at 9.5 despite the thin imports.
- **Expansion direction.** Bagels + Upper Manhattan is exactly the right instinct: local
  staples and past-the-core coverage. The instinct is right; the entries just need flesh.

---

## Issues

**Must-fix**

- **Rehome the moods as Collections — carried over, unchanged.** The visitor's inspiration
  door has now been missing for two passes, and the curated content already exists in
  moods.js as dead code. *Hurts:* visitors. *Consequence:* no "guide me" entry; their
  Delight/Content sit at 9 instead of 9.5. *Fix:* a "Feeling something specific?" row under
  the activity cards wiring date_night, just_chilling, first-time back in.

**Should-fix**

- **Enrich the 22 imports.** Every csv_import entry has rating: null, description: "",
  insiderTip: "". *Hurts:* both — the local gets no "which bagel," the visitor gets no voice.
  *Consequence:* taps that end in a shrug; the imported pool dilutes the curated feel.
  *Fix:* one line of description + one tip per place (22 lines of writing), and pull ratings
  in the enrich pass — the ENRICH_WORKFLOW already exists for this.
- **Tonight → "Events" — carried over.** Still misnames the tab's actual range coverage
  (tonight/weekend/week toggles exist inside, App.jsx:7561). Cheap rename, real clarity win.
- **Make weather do something.** It's fetched, coded day/night-aware, and shown — then ignored.
  *Fix:* rain/heat codes reorder or badge the activity cards ("☔ Good day for Culture").
  Cheapest possible "it knows" moment now that the data is already in hand.

**Polish**

- **"Your place" label on seed imports in search** (App.jsx:1496) — GERTIE shows as the user's
  own place. Mislabel; low stakes, mild trust dent for whoever notices.
- **Areas granularity** — Brooklyn is still one chip (carried, unchanged).
- **Bundle size** — 1.9 MB minified JS in one chunk; fine for now, worth a code-split before
  wider sharing.

---

## Scorecard

| Area | Local | Visitor |
|---|---|---|
| First impression | 9 | 9 |
| Clarity of purpose | 9.5 | 9 |
| Content relevance | 9 | 9 |
| Navigation & flow | 9.5 | 9.5 |
| Trust & credibility | 9.5 | 9.5 |
| Delight & return | 9.5 | 9 |
| **Overall** | **9.3** | **9.2** |

---

## The one thing to fix first

**Still the Collections row — same as last pass, and it gets cheaper every week you wait.**
The moods are sitting in moods.js fully built and unreachable; wiring them under the activity
cards is UI work only, and it's the entire visitor gap in one move. Second, do the 22-line
enrichment pass on the new imports *before* adding more places — the next database drop should
inherit a "no place ships without a description and a tip" rule, or breadth will keep outrunning
the curation that makes this app worth opening.

---

## Bottom line

Six passes: 7.x → 8.5 → 8.9 → 9.1/9.3 → 9.3/9.2 → **9.3/9.2 (flat)**. First flat week, and
honestly scored as one: real work shipped (good data directions, a warm header), but none of it
touched what's capping either persona, and the new content arrived without the editorial layer
that is this app's whole identity. The path to 9.5/9.5 hasn't changed in two weeks — Collections
for the visitor, curation depth for the local — and both are writing tasks more than coding
tasks now. Ship the row, flesh the imports, rename the tab; then the next review should have
something to move.
