# Explore + Tonight — re-review #3 (the events feature matures)

_Third pass with the same two personas, against the current build. Since the 2026-06-26 review the work has been almost entirely on the events experience and the browse polish: event → My Trip saving, the borough location picker, a leaner/scannable neighborhood browse, app-wide cream-card consistency, the redesigned "Browse by" grid, and rate-limit resilience so the category tabs can't vanish. Grounded in verified current behavior. 2026-06-27._

---

## Headline

**Incremental but real — the events feature went from "great browser" to "great browser you can plan around," and the browse screens stopped being exhausting.** The two moves that matter most for users since 06-26: you can now **save an event into My Trip** (the loop the last review flagged as missing), and the **neighborhood/venue lists are ~40% shorter** (tip moved to the detail page, one-line descriptions, 2-cards-then-"Show all"), so browsing is scan-first instead of read-everything. Maya (local) nudges **8.5 → 8.9**; Tom & Rachel (visitors) **9.0 → 9.2**. The ceiling is now almost entirely the *un-touched Explore structure* (coarse Areas, canonical moods, the Topics mismatch, two polish bugs) — not the events product, which is essentially done.

**Scores: 06-26 → 06-27**

| Dimension | Local (Maya) | Visitor (Tom & Rachel) |
|---|---|---|
| First impression | 9 → 9 | 9 → 9 |
| Clarity of purpose | 8.5 → **9** | 9 → 9 |
| Content relevance | 8 → **8.5** | 9.5 → 9.5 |
| Navigation & flow | 8 → **9** | 9 → **9.5** |
| Trust & credibility | 9 → 9 | 9 → 9 |
| Delight & return | 9 → 9 | 9 → **9.5** |
| **Overall** | **8.5 → 8.9** | **9.0 → 9.2** |

---

## What moved since 06-26

| Shipped | Who it helps | Effect |
|---|---|---|
| **Event → My Trip** (Add to My Trip on every event sheet; a "Saved events" section in My Trip) | Both | Closes the planning loop the last review called out — events are now *plannable*, not just browsable |
| **Borough location picker** ("Where are you?" → All NYC / Manhattan / Brooklyn, Queens "coming soon") | Local | The honest version of the geography ask — scoped to what the data supports; verified that neighborhood-level isn't viable for ticketed events |
| **Leaner venue cards** (tip → detail page, 1-line description, shorter photo) + **2 cards per section then "Show all places"** | Both | The neighborhood screen went from a long, tip-heavy wall to a quick scan; the tip is now a reward for tapping in |
| **Every Tonight tab caps at top 5 + "Show all"**, counts removed, consistent chip style | Both | The browser reads consistently; no single tab dumps 130 cards |
| **App-wide cream-card consistency** + redesigned "Browse by" (centered serif + category-color dots) | Both | Removes the white/cream mismatch; the grid reads like an editorial index |
| **Rate-limit resilience** (3 buckets + retry; never cache a ticketed-empty result) | Both | The Music/Theater/Sports tabs can't silently disappear during heavy use |
| **Direct "Get tickets"** whenever a ticket URL exists (theatre included) | Both | One tap to the real box office, not a search detour |

---

## Persona A — Maya, Williamsburg local (8.5 → 8.9)

- **The events browser is now a daily-grade tool.** Top-5 per tab with "Show all," a borough toggle, and — the new thing — she can **Add to My Trip** and see it sitting in My Trip's "Saved events." On 06-26 she could *find* what's on; now she can *keep* it. (+ Navigation, + Content)
- **Geography, honestly scoped.** She taps "📍 Brooklyn" and the feed scopes to Brooklyn. It's borough-level, not "Williamsburg" — but the last review proved neighborhood filtering would just manufacture empty states for ticketed events, so this is the right call rather than a broken promise. (~)
- **Browsing her neighborhood no longer tires her out.** Tapping an area used to be a long, tip-laden scroll; now it's 2 scannable cards per category with "Show all places," and each card is a clean photo + name + one-line hook. (+ Clarity, + Navigation)
- **Still capping her at ~9:** the Explore structure is unchanged — Brooklyn is still one chip under "Areas," the mood picks still lean canonical, search still dead-ends to Google for an uncurated spot, and the "5 moods / 6 cards" miscount is still there.

**Maya: 8.9.** "The 'what's on' part is genuinely mine now — I can grab a show into my trip and my neighborhood page is finally quick to skim. The Explore side still treats Brooklyn as one blob, but the events are the reason I'd keep this."

---

## Persona B — Tom & Rachel, visitors (9.0 → 9.2)

- **Planning is now end-to-end.** They browse This Week, tap a Broadway show, hit **Get tickets** (real box-office link), and **Add to My Trip** — then everything they saved is in one Saved-events list for the trip. That's the full loop a visitor wants. (+ Navigation, + Delight)
- **The leaner cards help a time-boxed visitor most** — less reading, faster decisions across the whole browse. (+ Navigation)
- **Content was already near-max for them** and stays there; the canonical, Manhattan-forward catalog is exactly right for a first visit, and the events browser fills their trip dates.
- **Untouched for them:** the Explore "Topics" still reads like a listings filter but behaves like an essay — though, as on 06-26, the Tonight → Theater path makes that a non-blocker.

**Tom & Rachel: 9.2.** "It plans the whole trip now — find a show, get the tickets, save it, and it's all in My Trip. We wouldn't use anything else while we're here."

---

## What still caps the score (8.9 → ~9.5 for the local)

All of these are **Explore-structure** items, untouched since the events work began:

1. **Browse → Areas is still coarse** — Brooklyn is one chip; Queens/Bronx/SI are "Soon" (3 of 11). The single biggest "this app isn't for residents" signal left.
2. **Mood picks still lean canonical** — Near-me reorders them, but the base set rarely surprises a long-time local.
3. **Topics reads like a filter, behaves like a magazine** — relabel ("Stories") or add a venues-first cut.
4. **Search still dead-ends** to Google for uncurated spots.
5. **Polish: the "5 moods / 6 cards" miscount** is still live.

None of these are events problems — the events feature is, for practical purposes, finished.

---

## Bottom line

Three reviews in, the trajectory is clear: 06-25 had a beautiful shell on a thin content engine (local 7.1); 06-26 replaced the engine with a real events browser (8.5); 06-27 made that browser *plannable and pleasant to scan* (8.9), within a point of the visitor's 9.2. The remaining gap is no longer about events or content depth — it's the **Explore tab's structure and a couple of polish bugs**. The highest-leverage next move for the local number is finally giving "Areas" real Brooklyn granularity; after that it's the small stuff (the moods count, the Topics label).
