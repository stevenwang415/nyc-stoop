# Explore + Tonight — re-review (did the local score move?)

_Re-ran the two personas from the 2026-06-25 review against the **current** app, after this week's work: the editorial "This week" filter, Near-me mood sorting, the restyled Plan-my-night + search, and — biggest of all — the Tonight tab rebuilt into a full events browser (Ticketmaster concerts/comedy/theatre/sports/family + NYC Open Data free events, by Tonight / This Weekend / This Week). Grounded in actual current behavior. 2026-06-26._

---

## Headline

**The local gap has largely closed.** The 06-25 review's bottom line predicted it: _"Fix the two un-restyled flows and put an editorial filter on 'This week,' and the local number moves up with the visitor's."_ We did that and more — we built the events engine the local was missing. Maya (the Williamsburg local) goes from **7.1 → 8.5**; Tom & Rachel (visitors) from **8.3 → 9.0**. The thing that was dragging the local — "this is a guide for people *visiting* my city, not living in it" — is the thing that moved most, because a daily, filterable "what's on tonight / this weekend" is exactly why a local keeps an app on their phone.

**Scores: before → after**

| Dimension | Local (Maya) 06-25 → 06-26 | Visitor (Tom & Rachel) 06-25 → 06-26 |
|---|---|---|
| First impression | 9 → 9 | 9 → 9 |
| Clarity of purpose | 7 → **8.5** | 8 → **9** |
| Content relevance | 6 → **8** | 9 → **9.5** |
| Navigation & flow | 7 → **8** | 8 → **9** |
| Trust & credibility | 7 → **9** | 8 → **9** |
| Delight & return | 7 → **9** | 8 → **9** |
| **Overall** | **7.1 → 8.5** | **8.3 → 9.0** |

---

## Persona A — Maya, Williamsburg local (7.1 → 8.5)

### A1 — "Thursday 6pm, what's good near me tonight?"  _(was the weakest journey; now her strongest)_

- The **Plan-my-night** sheet is now in the warm palette (cream, serif "Plan my night", terracotta CTA) — no more jarring white sheet. It opens straight to the **Full plan** (not the day-of checklist), and the evening logic now gives a realistic **dinner + one show** instead of stacking two concerts into an impossible 11:25pm slot. The polish drag from 06-25 is gone. (+)
- But the real change: she taps the **Tonight tab** and lands in an actual events browser — **Tonight / This Weekend / This Week** with category chips (Music, Comedy, Theater, Sports, Family, **Free**). "Tonight" shows ~130 real things happening, led by a curated **★ Stoop picks** set of 20 (deduped, image-rich, daily-shuffled) rather than a wall of everything. This is the "what's actually on" she always wanted and the app never had. (+)
- **Trust jump:** the events have real photos, working actions, and honest times. Ticketed shows link to tickets; theatre routes to a reliable "find tickets" search (no more Ticketmaster 404s); free street events lead with "what's happening" info and a Directions pin that actually lands on the place. (+)
- **Residual friction:** the events browser filters by time + category but **not by neighborhood** — so it's "what's on in NYC tonight," not "in Williamsburg tonight." And Plan-my-night's "Where" is still coarse (Brooklyn = one option). She can find tonight's events brilliantly; she still can't scope them to her block. (−)

### A2 — "Saturday, low-key day with a friend"

- In the mood flow she now taps **📍 Near me**; the app keeps her precise location and re-sorts every pick pool **nearest-first** (with a "📍 nearest first" cue). Domino Park and Transmitter Park rise above Bryant/Central — the location-blind ordering that annoyed her on 06-25 is fixed. (+)
- The mood *picks themselves* are still the canonical editorial set underneath, so Near-me reorders a canonical list rather than surfacing hyperlocal secrets — better, not perfect. (~)
- **Still there:** the "5 moods" label over 6 cards. Tiny, but she's a designer; she still notices. (−)

### A3 — "Does it know my favorite coffee shop?"

- The search empty state is now on-palette (serif headline, terracotta "Search Google Maps" — no more stray blue button), so leaving to Google feels less like the spell breaking. (+)
- But it's the same honest dead-end: an uncurated indie spot still isn't in the app. Polished, not solved. (~)

### New — "It's Friday, what's on this weekend?"  _(a capability that didn't exist on 06-25)_

- She taps **This Weekend** → a curated, image-rich slate of weekend concerts, comedy, and free street fairs, with Tonight's events correctly *excluded* (no same-event overlap between Tonight and This Weekend). For a novelty-seeking local, this is the single most "for me" surface in the app now. (+)

**Maya overall: 8.5.** "Okay — now it actually knows what's happening in my city tonight and this weekend, and it stopped burying Brooklyn. I'd open this on a Friday. It still doesn't quite know my *block*, and my neighborhood is one chip — but this is mine now, not just for tourists."

---

## Persona B — Tom & Rachel, visitors (8.3 → 9.0)

### B1 — "First night, opening cold"
- Same confident Plan-my-night entry, now fully polished and opening to a clean Full plan. They also discover the Tonight browser for real shows during their stay. (+)

### B2 — "Plan tomorrow"
- "First time in NYC" mood is unchanged and still perfect for them. The new **This Week** events filter is a bonus a visitor loves — concrete, bookable shows across their trip dates. (+)

### B3 — "Broadway show + dinner"  _(the visitor's 06-25 miss; now solved)_

- On 06-25 they expected Topics → Theater to list bookable shows and got an art-history read. Now they tap the **Tonight tab → Theater** category and see actual current Broadway/Off-Broadway shows (Wicked, Hamilton, Maybe Happy Ending…), deduped to one card each, with a **working "Find tickets & info"** action. The exact need that failed before now succeeds in two taps. (+)
- The Explore "Topics" mismatch still exists, but it no longer blocks them — there's a clear, correct path. (~)

**Tom & Rachel overall: 9.0.** "It already felt like a local friend's plan; now it also tells us what's actually on while we're here, with tickets that work. We'd run our whole trip on this."

---

## What moved the local number (and why)

| Lever (shipped since 06-25) | Dimension it lifted | Effect on local |
|---|---|---|
| Tonight → full events browser (ranges + categories + Stoop picks 20) | Clarity, Content, Delight | Largest single lift — the "what's on" engine the local lacked |
| Editorial filter on "This week" (no greenmarket flood) + images + location-photo fallback | Trust, Content | The most "for a local" section now carries real signal |
| Near-me mood sorting (nearest-first) | Content, Navigation | Fixes the location-blind ordering complaint directly |
| Restyled Plan-my-night sheet + search; Plan→Full plan; realistic single-show nights | Navigation, First impression | Removes the polish drags; happy path feels finished |
| Working event actions (theatre→search, free→info, maps→location) + promo-permit filter + honest times | Trust | No dead Ticketmaster links, no junk "brand activation" permits, no fake 7am times |

---

## What still caps the local (the path from 8.5 → ~9.5)

1. **No geography in the events browser.** It's time + category only. A "Near me / neighborhood" filter on Tonight would turn "what's on in NYC" into "what's on in Williamsburg" — the local's last big ask.
2. **Browse → Areas is still coarse.** Brooklyn is one chip; Queens/Bronx/SI are "Soon" (3 of 11). (Review rec 4 — still open.)
3. **Mood picks are still canonical underneath.** Near-me reorders them, but the base set rarely tells a six-year resident something new; deeper local cuts would help.
4. **Search still dead-ends** to Google for uncurated spots.
5. **Polish debt:** the "5 moods / 6 cards" miscount and the Topics-as-listings mismatch (recs 5 + polish) are still open.

---

## Bottom line

The 06-25 review said the local was held back "not by the new design but by the content engine underneath it." We replaced that engine. The local experience jumps **7.1 → 8.5** and now sits just behind the visitor's **9.0**, instead of a point-plus behind. The remaining gap is no longer about *quality of content* — it's about *geography*: the app finally knows what's on, but not yet what's on **near her**. A neighborhood filter on the events browser is the highest-leverage next step for the local score.
