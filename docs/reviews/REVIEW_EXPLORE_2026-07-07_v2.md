# Explore + Events + Map + My Trip — final review #7 (the pre-iOS pass)

_Seventh pass, same two personas, evening of 2026-07-07 — reviewing everything shipped since
this morning's flat #6. This was the biggest single-day change set in the series: the
Collections row (the two-pass-old must-fix), 23 imports enriched, the contextual weather
line, the Events rename, Brooklyn on the Map tab, the area→picks→card map flow, and a
My Trip restructure (trip basics promoted, saved events pinned into days, visible ↑↓
reorder, warm card palette). All verified in code and by clean build; **not yet verified
on a device** — that caveat is priced into the scores. 2026-07-07 evening._

---

## Headline

**Both personas hit their best-ever numbers — and for the first time, they moved together.**
This morning's review said the app's soul was parked in moods.js; tonight it's back on the
home screen as Collections, next to the activity spine, with a weather line above both that
makes the app feel awake. The visitor's two-week-old regression is closed. The local's map
went from a viewport to a browsing surface: tap Williamsburg, get five real answers with
voice. My Trip finally keeps its core promise — a saved concert lands *inside* Friday.
**Maya 9.3 → 9.4, Tom & Rachel 9.2 → 9.4.** What keeps either from 9.5+ is no longer
missing features — it's data hygiene: the review found **32 duplicate-named entries** in the
718-place import pool and **563 places (78%) still without descriptions**, both now *more*
visible because the new map sheets surface imports proudly. Fix the data, QA on device, ship.

**Scores: 07-07 morning → 07-07 evening**

| Dimension | Local (Maya) | Visitor (Tom & Rachel) |
|---|---|---|
| First impression | 9 → 9 | 9 → **9.5** |
| Clarity of purpose | 9.5 → 9.5 | 9 → **9.5** |
| Content relevance | 9 → **9.5** | 9 → **9.5** |
| Navigation & flow | 9.5 → 9.5 | 9.5 → 9.5 |
| Trust & credibility | 9.5 → **9** | 9.5 → **9** |
| Delight & return | 9.5 → 9.5 | 9 → **9.5** |
| **Overall** | **9.3 → 9.4** | **9.2 → 9.4** |

---

## What moved since this morning

| Shipped | Who it helps | Effect |
|---|---|---|
| **Collections row** — the five curated moods rehomed under the activities | Visitor most | The "guide me" door is back; activities *do*, collections *inspire* — clean split |
| **23 imports enriched** — one-line POV + insider tip each | Both | Bagel taps now end in an answer, not a shrug |
| **Contextual weather line** — "Clear morning — bagel weather" under the header | Both | The cheapest "it knows me" moment; ties the header data to a suggestion |
| **Tonight → Events** (tab + wordmark) | Visitor | The tab stops underselling a week of content |
| **Brooklyn on the Map tab** + borough toggle | Local most | Second borough, same tap-to-pan; reuses the mood-flow geometry (one source of truth) |
| **Area → picks sheet → place card** — top 5 per neighborhood, photo, tip, + Add to My Trip, back-stack restored | Both | The map now answers "what's good *there*," not just "where is there" |
| **My Trip: trip basics promoted** — Arriving + Days visible; drawer honestly renamed "Choose stops" | Visitor most | The trip's defining controls stopped hiding |
| **Saved events pinned into days** | Visitor most | Closes the broken promise — a dated save now *plans itself* |
| **Visible ↑↓ reorder** beside the drag grip (drag intact, same order store) | Both | Reordering no longer depends on discovering a 120ms long-press |
| **Warm card palette on My Trip** | Both | The last pure-white surfaces joined the app's design language |
| **Search labels fixed** — imports badge as "Place," not "Your place"/"Yours" | Both | Small honesty repair |

---

## Persona A — Maya, Williamsburg local (9.3 → 9.4)

- **Her map finally works like her brain.** Williamsburg tap → five nearby answers with
  blurbs → save or show on map. Brooklyn as 10 real areas (not one chip) exists on the Map
  tab now — the long-standing granularity ceiling cracked, though Explore's Browse-by-Areas
  still shows one Brooklyn chip. (+ Content)
- **The bagel pool got a voice.** "Don't ask for it toasted" is exactly the local-knowledge
  register the app promised. But she'll also hit the un-enriched 78% — and worse, the
  duplicates: Beacon's Closet, Cafe Mogador, Devoción twice each in the pool that her Eat
  list and map sheets draw from. She notices things like that. (− Trust)
- **The weather line lands for her** ("74° — waterfront weather"), though she'd want it to
  actually reorder the cards on a rainy day. Still display-plus, not logic.

**Maya: 9.4.** "It knows my borough, it has opinions about bagels, and the map finally
answers questions. Now clean up the double entries — I saw Mogador twice."

---

## Persona B — Tom & Rachel, visitors (9.2 → 9.4)

- **Their door is back.** "First time in NYC" and "Date night" sit right under the activity
  cards — the inspiration layer restored without costing the activity spine anything. The
  two-pass regression is closed. (+ First impression, + Content, + Delight)
- **My Trip now keeps the app's promise.** They set "Arriving Thursday," and the jazz show
  they saved from Events appears pinned inside Thursday with a 🎟 card. Dates and day-count
  are visible instead of buried. The ↑↓ arrows mean Rachel can reorder without discovering
  the long-press Tom never found. (+ Content, + Clarity)
- **"Events" finally says what it is.** (+ Clarity)
- **Same trust caveat:** the enriched 23 read like a friend; the other 563 read like a
  directory. The contrast is now visible inside single lists.

**Tom & Rachel: 9.4.** "It feels like it was designed by someone who wanted us to have a
good trip, not just a full one. We'd show it to friends — after they fix the double listings."

---

## What's working — keep this

- **The home's three-layer structure**: weather line (context) → activities (verbs) →
  collections (stories). Don't add a fourth layer; the hierarchy is right.
- **One source of truth patterns** — Brooklyn map geometry shared with the mood flow;
  ↑↓ arrows writing to the same store as drag. This is why the app stays coherent at 14k lines.
- **The editorial voice** wherever it exists. It's the product.

---

## Issues

**Must-fix (before iOS)**

- **Dedupe the import pool.** 32 duplicate names in 718 imports (some are legit chains —
  Two Hands, Black Seed — so match on `googlePlaceId` first, name+neighborhood second).
  *Hurts:* both personas' trust, now amplified by the map sheets. *Fix:* one dedupe script
  pass + a uniqueness check in the import workflow.
- **Device QA pass.** Every feature this session is code-and-build verified only. Priority
  checks on a real iPhone: drag + ↑↓ coexistence on touch, the map sheet back-stack, safe-area
  insets on the new header strip, the date input on iOS Safari, Google-photo loading in the
  area cards.

**Should-fix**

- **Enrich or demote the remaining 563.** A description-required rule at import time, and
  consider ranking un-enriched places below enriched ones in sheets and lists so the voice
  leads. *(This is the single biggest lever left on both Content scores.)*
- **Code-split the bundle.** 1.9 MB minified in one chunk — fine on Wi-Fi, sluggish first
  paint on cellular in a WKWebView. Vite `manualChunks` for data files is an afternoon.
- **Weather → ranking.** The line promises intelligence; on a rainy day, Culture should
  quietly lead the activity row.

**Polish**

- Explore's Browse-by-Areas still shows Brooklyn as one chip (the Map tab now does it
  better — consider pointing that chip at the Map tab's Brooklyn view).
- `localStorage` is the only persistence; in an iOS wrapper it can be evicted under storage
  pressure. Fine for v1; consider export/backup nudge later.

---

## Scorecard

| Area | Local | Visitor |
|---|---|---|
| First impression | 9 | 9.5 |
| Clarity of purpose | 9.5 | 9.5 |
| Content relevance | 9.5 | 9.5 |
| Navigation & flow | 9.5 | 9.5 |
| Trust & credibility | 9 | 9 |
| Delight & return | 9.5 | 9.5 |
| **Overall** | **9.4** | **9.4** |

---

## The one thing to fix first

**The dedupe pass.** It's the only item that can actively embarrass the app in front of a
new iOS user (Mogador twice in one list reads as broken), it's a script not a feature, and
it protects everything else you shipped today — the map sheets and enriched cards are now
pointing users straight at the data. Then the device QA pass, then ship.

---

## Bottom line

Seven passes: 7.x → 8.5 → 8.9 → 9.1/9.3 → 9.3/9.2 → 9.3/9.2 (flat) → **9.4/9.4**. The flat
week was the anomaly; this session closed every standing must-fix and should-fix from the
last three reviews in one push, and both personas peaked together for the first time. The
structure is done: verbs, stories, events, a map that answers, a trip that keeps its promise.
What's left is housekeeping — dedupe, enrich, device QA — the unglamorous work that decides
whether 9.4 survives contact with a real iPhone. Wrap it, test it, ship it.
