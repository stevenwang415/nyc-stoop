# Explore + Tonight — re-review #4 (the events feature gets honest)

_Fourth pass with the same two personas against the current build. Since the
2026-06-27 review the work has been almost entirely about making the events feel
**trustworthy and complete**: front-page de-duplication, a location-image fallback
so no card is a bare placeholder, a real Free-tab cleanup (junk permits out, iconic
free events in, dead links fixed), and — the biggest one for a Brooklyn local — a
fix so Ticketmaster's Brooklyn concerts/comedy/sports actually show up. Grounded in
verified current behavior of the build (the same way 06-26/06-27 were). 2026-06-29._

---

## Headline

**This pass closed trust gaps, not capability gaps — and one of them was a real
"this app isn't finished" tell for a Brooklyn local.** Nothing here adds a new
surface; instead it makes the events the app already had stop *looking broken*:
the same show no longer appears three times on the front page, every card carries a
real photo, the Free tab is real public events instead of farmers-market filler or
"page not found," and selecting **Brooklyn** finally lights up the Music / Comedy /
Theater / Sports tabs instead of leaving only Picks + Free. Maya (local) nudges
**8.9 → 9.1**; Tom & Rachel (visitors) **9.2 → 9.3**. The remaining ceiling is, again,
the **untouched Explore structure** (coarse Areas, canonical moods, the Topics
label) — plus a couple of small side-effects this round introduced.

**Scores: 06-27 → 06-29**

| Dimension | Local (Maya) | Visitor (Tom & Rachel) |
|---|---|---|
| First impression | 9 → 9 | 9 → 9 |
| Clarity of purpose | 9 → 9 | 9 → 9 |
| Content relevance | 8.5 → **9** | 9.5 → 9.5 |
| Navigation & flow | 9 → 9 | 9.5 → 9.5 |
| Trust & credibility | 9 → **9.5** | 9 → **9.5** |
| Delight & return | 9 → **9.5** | 9.5 → 9.5 |
| **Overall** | **8.9 → 9.1** | **9.2 → 9.3** |

---

## What moved since 06-27

| Shipped | Who it helps | Effect |
|---|---|---|
| **Brooklyn Ticketmaster fix** — a dedicated by-city pull so Brooklyn isn't paged out of the NY-DMA feed by Manhattan's volume | Local most | Selecting Brooklyn now surfaces ~12 Music / 9 Comedy-Theater / 5 Sports for the week; the category tabs appear instead of just Picks + Free |
| **"This week" front-page de-dup** — a multi-night run collapses to one card (soonest date) | Both | Kills the exact thing you flagged: the first three cards being the same show on Mon/Tue/Wed |
| **Free tab cleanup** — junk/private permits dropped at the source (birthdays, picnics, camps, hobby-field, "Celebration"); real public events kept (Nathan's Hot Dog Contest, July 4th fireworks, Congo Square Drummers, block parties) | Local most | Free went from "all farmers markets / page-not-found" to genuinely useful neighborhood happenings |
| **Official-link fixes** — greenmarket links matched to the real GrowNYC brand (no more 404s); a curated free-series map (SummerStage, Celebrate Brooklyn, Smorgasburg, BAM, parades…) | Both | "Visit website" lands on a real page; the dead-search "What's happening?" is now "More info" and only for genuinely named events |
| **Image fallback** — image-less cards show a photo of the place (Union Square, Bryant Park…), then borough, then skyline | Both | No more bare ✨ placeholder cards anywhere events appear |
| **Overlap rule** — Ticketmaster package/section variants of one game collapse to a single card | Both | One "Yankees v. Tigers" card, not five (Grandstand / Premium / Pinstripe Pass …) |

---

## Persona A — Maya, Williamsburg local (8.9 → 9.1)

- **The single biggest fix is hers.** On 06-27, tapping **Brooklyn** on the Tonight
  browser left only Stoop picks + Free — it read like Ticketmaster simply didn't
  cover her borough. Now Brooklyn lights up: Barclays sports, Bell House and Brooklyn
  Improv comedy, Brooklyn Bowl / Baby's All Right music. For a Williamsburg resident
  this is the difference between "this is a Manhattan app" and "this is for me." (+
  Content, + the most important kind of Trust) 
- **Free is finally a local surface, not filler.** Her "what's on this weekend in
  Brooklyn" used to be a wall of greenmarkets (and a few links went to *page not
  found*). Now it leads with Nathan's Famous July 4th Hot Dog Contest, the Coney
  Island fireworks, the Congo Square Drummers Circle, and block parties — with the
  markets in the mix, capped, not dominating. That's exactly the free, novelty-rich,
  hyper-local stuff a six-year resident opens an app for. (+ Content, + Delight)
- **The front page stopped looking sloppy.** The "This week" strip no longer opens
  with the same show three times; every card has a real photo. Small, but this is the
  first thing she sees, and "looks finished" is a trust signal. (+ Trust, + Delight)
- **Still capping her at ~9:** none of the **Explore structure** moved. In Browse,
  Brooklyn is still **one "Areas" chip** (no Williamsburg / Bushwick / Crown Heights
  cut), the mood picks are still the canonical editorial set, search still dead-ends
  to Maps for an uncurated indie spot, and the "5 moods / 6 cards" miscount is still
  there. The events are now genuinely hers; the *Explore* half still treats Brooklyn
  as one blob.

**Maya: 9.1.** "Okay — Brooklyn actually has shows now, and the free stuff is the real
neighborhood stuff, not just markets. The front page looks finished. I still wish
'Areas' knew Williamsburg from Bushwick, but the events are mine now."

---

## Persona B — Tom & Rachel, visitors (9.2 → 9.3)

- **The trip plan looks polished end-to-end.** De-duped strip, real photos on every
  card, one clean card per Broadway run (not one per night), one card per ballgame
  (not five ticket tiers). For a couple scanning fast on a phone, the whole thing now
  reads "professional," which is most of what a visitor's trust is made of. (+ Trust)
- **They barely touch Brooklyn, so the headline fix is mostly invisible to them** —
  hence a smaller bump than Maya. Their Manhattan-forward, canonical experience was
  already near-max and stays there. (~)
- **Free events are now a pleasant bonus** rather than a dead end: tapping a street
  fair or fireworks lands on real info, and the junk that used to clutter it is gone.
  (+ Content at the margin)
- **Untouched for them:** the Explore "Topics" still reads like a listings filter but
  behaves like a magazine — still a non-blocker because Tonight → Theater is the
  correct path.

**Tom & Rachel: 9.3.** "It already planned our whole trip; now it also *looks* like a
finished product — no repeats, no broken images, real pages behind the links. We'd
trust it for the week."

---

## What's working — keep this

- **The events feature is, for practical purposes, done and trustworthy.** Real
  photos, deduped, borough-aware, with working links and honest Free content.
- **The Free tab's editorial judgment** — dropping private/junk permits while keeping
  the iconic free events — is the kind of taste that makes a city guide feel human.
- **The borough fix's approach** (fetch the smaller borough directly so it isn't
  crowded out) is the right, durable fix, not a band-aid.

---

## Issues & friction

**Should-fix**

- **Areas granularity (the local ceiling).** Browse → Areas still has Brooklyn as one
  chip; Queens/Bronx/SI are "Soon." This is now the single biggest "not for residents"
  signal left, and it's the highest-leverage local-score move. _Consequence: a local
  can't browse their actual neighborhood._
- **Only Brooklyn got the by-city events fix.** The Bronx shows up via the DMA feed,
  but if the borough picker ever enables Queens, it'll have the same crowded-out
  problem Brooklyn just had. _Consequence: future borough = empty tabs again unless
  the same by-city pull is added._

**Polish**

- **Image-fallback repetition.** Because link-less events fall back to a borough photo,
  several different Manhattan street events can show the *same* Empire State skyline.
  Better than a blank card, but it can look templated. _Fix: prefer a neighborhood/
  park photo before the borough skyline (the landmark tier already exists — widen its
  keyword list), and vary the borough image by a hash so identical photos don't stack._
- **"More info" is still a search** for genuinely link-less events. It's now safe
  (the junk is gone, so the remaining names resolve well), but it's not a real page.
  _Fix later: extend the curated series/organizer map as more recurring names appear._
- **Curated free links sometimes land on a calendar/landing page**, not the specific
  event (some org sites bot-block deep links). Acceptable, worth a note. _Consequence:
  one extra click to find the exact event._
- **Carried-over: the "5 moods / 6 cards" miscount.** Tiny, still live, still noticed
  by a designer.

---

## Scorecard

| Area | Local | Visitor |
|---|---|---|
| First impression | 9 | 9 |
| Clarity of purpose | 9 | 9 |
| Content relevance | 9 | 9.5 |
| Navigation & flow | 9 | 9.5 |
| Trust & credibility | 9.5 | 9.5 |
| Delight & return | 9.5 | 9.5 |
| **Overall** | **9.1** | **9.3** |

---

## The one thing to fix first

**Give "Areas" real Brooklyn granularity.** The events feature is now strong enough
that the only thing still whispering "this app is for tourists, not residents" is the
Browse structure — and Brooklyn-as-one-chip is the loudest part. Splitting it into a
few real neighborhoods (Williamsburg, Bushwick, Park Slope, Crown Heights, DUMBO)
would do for *browsing* what the by-city events fix just did for the *Tonight* tab,
and it's the highest-leverage remaining move on the local number. After that it's the
small stuff (the moods count, the Topics label, the fallback-image variety).

---

## Bottom line

Four passes in: 06-25 was a beautiful shell on a thin engine (7.1); 06-26 built the
events engine (8.5); 06-27 made it plannable and scannable (8.9); 06-29 made it
**trustworthy** — no duplicates, no broken images, real Free content, and Brooklyn
finally covered (9.1), a fifth of a point behind the visitor's 9.3. The events story
is essentially finished. The remaining gap is no longer about events at all — it's the
Explore tab's structure, with Areas granularity the clear next move.
