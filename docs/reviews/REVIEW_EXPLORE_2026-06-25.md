# Explore tab — user review (post-redesign)

_Walked the redesigned Explore tab ("The City Guide" / Claude Design treatment) through two personas and their real journeys against the live flows. Grounded in actual app behavior, not assumptions. 2026-06-25._

---

## How this was scored

Two personas, each with three concrete scenarios, walked step-by-step through the **actual** Explore flows: the serif header + search, the "Plan my night" gradient hero (→ `PlanNightSheet` → `planNight()`), "This week in NYC" (NYC Open Data), the six mood cards, and "Browse by" Topics/Areas. Six dimensions, scored 1–10:

1. **First impression** — does it look like something I'd trust and want to open again?
2. **Clarity of purpose** — within 5 seconds, do I know what to do?
3. **Content relevance** — is what's surfaced actually for *me*?
4. **Navigation & flow** — how few taps to a satisfying result, how few dead-ends?
5. **Trust & credibility** — does it feel curated, current, and honest?
6. **Delight & return** — would I come back tomorrow?

---

## Headline

**The redesign is a real level-up in feel, and it serves the visitor noticeably better than the local.** The warm editorial skin (Newsreader serif wordmark, cream/terracotta palette, numbered mood cards, the gradient "Plan my night" hero) reads premium and intentional — both personas rate first impression a 9. But the *content engine* underneath is canonical- and Manhattan-leaning: the Met, Carbone, Carnegie, Times Square, "First time in NYC." That's exactly what a first-time visitor wants and slightly not what a novelty-seeking local wants. The visitor finishes a journey delighted; the local finishes admiring the design but wishing it knew their block.

**Scores at a glance**

| Dimension | Local (Maya, Williamsburg) | Visitor (Tom & Rachel, from Chicago) |
|---|---|---|
| First impression | 9 | 9 |
| Clarity of purpose | 7 | 8 |
| Content relevance | 6 | 9 |
| Navigation & flow | 7 | 8 |
| Trust & credibility | 7 | 8 |
| Delight & return | 7 | 8 |
| **Overall** | **7.1** | **8.3** |

---

## Persona A — Maya, 31, lives in Williamsburg

Designer, lived in NYC six years. Opens local apps to find spots she *doesn't* already know, in or near her own neighborhood. Allergic to tourist traps. Values novelty, neighborhood-level depth, and "what's actually on this week." She already knows the Met and Times Square — surfacing those reads as noise to her.

### Scenario A1 — "It's Thursday 6pm, I'm off work, what's good near me tonight?"

- Opens to the header — **the serif "NYC _Stoop_" wordmark and "The City Guide" eyebrow immediately signal taste.** Good. (+)
- Eye goes to the terracotta **Plan my night** card. Taps it. The sheet asks **When** (Tonight / This weekend) and **Where** (Surprise me / Midtown / Downtown / Uptown / **Brooklyn**). She picks Tonight + Brooklyn → "Build my plan."
- **Friction 1:** "Brooklyn" is the *only* outer-borough granularity. She lives in Williamsburg; the plan can pull from anywhere in Brooklyn (could route her to Bay Ridge). The coarse area picker is the weakest link in an otherwise slick flow. (−)
- **Friction 2 (visual):** the `PlanNightSheet` itself was **not** brought into the redesign — it's a white sheet with sans-serif heading and the old coral shadow. After the cream/serif hero, it feels like a different app for a moment. (−)
- The evening logic is good though: it favors jazz/classical/theater and slots a dinner in front, so she gets a real night, not three jazz sets.

### Scenario A2 — "Saturday, low-key day with a friend"

- Scrolls to **What kind of day?** — the numbered colored cards (01–06) look fantastic. She taps **Just chilling**. (+)
- The picks are cafés + parks + "grand interiors" (NYPL). Lovely, but skewed to canonical Manhattan (High Line, Bryant Park, Central Park). For a Williamsburg Saturday she'd expect Domino Park, Transmitter Park — which *are* in the data, but buried mid-list under Manhattan parks. The ordering doesn't know where she is. (−)
- **Polish bug:** the section says **"5 moods"** but there are **6 cards** (the "Where to eat" card sits first). Tiny, but she's a designer — she notices. (−)

### Scenario A3 — "Does it know my favorite coffee shop? Let me save it."

- Taps search, types her indie roaster. If it's not one of the curated venues/sights, she hits the honest empty state: _"NYC Stoop hasn't curated '…' yet"_ → a blue **Search Google Maps** button.
- **Honest, but a dead-end** for a local power-user, and the empty-state card + Google button are still in the **old** white/blue style, not the new palette. The moment she leaves to Google Maps, the spell breaks. (−)

### What Maya loves
The look. The wordmark. The mood cards. "This week in NYC" *as a concept* (a returning local is exactly who'd check a daily "what's on"). The Plan-my-night happy path.

### What lets Maya down
- **This week in NYC** pulls from NYC Open Data — which means greenmarkets and civic events as often as anything she'd actually go to. The card design is gorgeous; the content can feel generic/un-curated to someone who knows the city. The single most "for a local" section is the one carrying the least editorial signal.
- **Browse → Areas** is 11 chips, but **3 of them ("Queens," "The Bronx," "Staten Island") are "Soon"** and **all of Brooklyn is a single chip** (7 of the remaining 8 are Manhattan). An outer-borough local sees the coverage gaps before the coverage.
- Everything surfaced leans canonical. Nothing here tells her something she didn't already know.

**Maya overall: 7.1.** "Beautiful, and I'd keep it on my phone — but it's a guide for people visiting my city, not living in it. Yet."

---

## Persona B — Tom & Rachel, mid-40s, visiting from Chicago

Three-day trip, staying in Midtown. Been to NYC once a decade ago. They want: the canonical highlights, two memorable meals, one Broadway show, and to not feel like they're missing the "real" city. Time-boxed and a little navigation-anxious — they want to be *told* a good plan.

### Scenario B1 — "First night in the hotel, opening the app cold"

- Header reads "The City Guide" — reassuring, editorial, not a coupon app. (+)
- The **Plan my night** hero is the obvious first move and it speaks their language: _"A routed plan with food, in a couple of taps."_ This is precisely what an anxious visitor wants — a single confident button. (+)
- They tap it, pick Tonight + Midtown (where they're staying) → an actual routed plan with dinner anchored. **This is the app's best moment for this persona.** (+)

### Scenario B2 — "Plan tomorrow properly"

- **What kind of day?** → the **First time in NYC** mood is practically addressed to them by name. Picks are the canonical set: Central Park, Empire State, Statue of Liberty, Met, MoMA, Rockefeller, Grand Central. (+)
- **Family day** and **Rainy day** are there as backups (they have a rainy forecast for day 3 — Rainy day is genuinely useful and indoor-only by design). (+)
- The canonical-leaning curation that *under*-serves Maya *over*-serves them. Every tap returns something they actually want to see.

### Scenario B3 — "We want a Broadway show + dinner near it"

- They expect **Browse → Topics → Theater** to list shows/theaters they can book. Instead, Topics is an **editorial deep-dive** (essays, figures, history) — beautiful, but not a "pick a show tonight" tool. Mild expectation mismatch: "Browse by topic" sounds like a filter; it behaves like a magazine. (−)
- The reliable path is back to **Plan my night** (evening logic can route a theater + dinner) or the **Tonight** tab — so the goal is achievable, just not where they first looked.

### What Tom & Rachel love
The confidence of the design, "First time in NYC," and the one-tap routed plan. They never feel lost for long, and what they're shown is genuinely the right first-visit list.

### What lets them down
- **Topics ≠ "things to book."** The word "Browse" + a Theater chip implies a listings filter; they get an art-history-style read. Either rename ("Read about" / "Stories") or add a venues-first cut.
- The un-restyled **Plan my night sheet** and **search empty state** are the two spots where the polish drops; visitors notice "this screen looks different" even if they can't say why.

**Tom & Rachel overall: 8.3.** "Felt like a knowledgeable friend who lives here handed us a plan. We'd trust it for the whole trip."

---

## Cross-cutting findings (both personas)

**Design wins (keep):**

1. The serif wordmark + "The City Guide" eyebrow set an editorial, trustworthy tone in the first second.
2. Numbered mood cards (01–06) with colored headers and serif titles are the strongest single component — scannable, premium, distinctly *not* a generic app grid.
3. The gradient "Plan my night" hero is the right visual hierarchy: the one thing you should tap is the one thing that's biggest and warmest.
4. "This week in NYC" cards (colored panel + serif italic initial + kind pill) look like a printed listings page in the best way.

**Issues, by priority:**

| # | Issue | Who it hurts | Severity |
|---|---|---|---|
| 1 | `PlanNightSheet` not restyled — white bg, sans heading, old coral shadow; jarring after the cream hero it launches from | Both | High (it's the #1 tapped flow) |
| 2 | Search empty-state + results still in old white/blue style (incl. blue Google button) | Both | High |
| 3 | "This week in NYC" content is raw NYC Open Data — gorgeous shell, inconsistent (greenmarket-heavy) substance | Local most | High |
| 4 | "Browse → Areas": Brooklyn is one chip; Queens/Bronx/SI are "Soon" (3 of 11) | Local / outer-borough | Medium |
| 5 | "Topics" reads as a listings filter but is an editorial deep-dive | Visitor | Medium |
| 6 | Mood section says "5 moods" but shows 6 cards | Both (polish) | Low |
| 7 | Mood/Just-chilling pick ordering is location-blind (Manhattan parks before Brooklyn ones) | Local | Medium |
| 8 | Menu (dots) and avatar both just open Settings — two controls, one destination | Both (polish) | Low |

---

## Recommendations (highest leverage first)

> **Update 2026-06-25 — recommendations 1, 2, and 3 are now built.** ✅ Rec 1: the Plan-my-night sheet and search empty-state/result cards are reskinned to the warm palette (cream surfaces, serif headings, terracotta CTAs). ✅ Rec 2: "This week in NYC" now runs an editorial `signalScore`/`rankThisWeek` filter — ticketed concerts/shows lead, real street events follow, low-signal civic entries sink, and greenmarkets are capped at 2 so they can't flood the strip. ✅ Rec 3: the mood flow's "Near me" now keeps the precise location and sorts every pick pool nearest-first (with a "📍 nearest first" cue), so a local sees their block before a canonical Manhattan landmark. Recs 4–5 remain open.

1. **Restyle the Plan-my-night sheet and the search states to the new palette.** These are the two flows every user hits, and they're the only places the redesign visibly stops. Cream sheet, serif heading, terracotta CTA, warm card borders. Pure polish, high perceived-quality return.
2. **Give "This week in NYC" an editorial filter.** Rank/loud-filter the Open Data feed toward things a discerning user would actually attend (concerts, openings, ticketed events, notable markets) and demote generic civic entries — or blend in a few curated/ticketed picks so the section's content matches its beautiful shell. This is the biggest lever for the *local* score.
3. **Close the local gap with geography.** When location is known (or a neighborhood is chosen), sort mood/area picks *nearest-first* so a Williamsburg user sees Domino/Transmitter before Bryant Park. The data already supports it.
4. **Reconcile "Browse by Topics" with expectations.** Either relabel to signal it's editorial ("Stories," "Read"), or add a venues-first entry so "Theater" can mean "pick a show," not only "read about theater."
5. **Two small polish fixes:** correct the "5 moods" count (or relabel the eat card so it's not counted), and consider differentiating the menu vs. avatar destinations.

---

## Bottom line

The redesign succeeds at what it set out to do: Explore now *looks* like a guide you'd pay for. The visitor experience is genuinely strong (8.3) because the app's canonical, Manhattan-forward curation is exactly right for a first-timer. The local experience (7.1) is held back not by the new design but by the content engine underneath it — generic "this week" data, coarse outer-borough geography, and location-blind ordering. Fix the two un-restyled flows and put an editorial filter on "This week," and the local number moves up with the visitor's.
