# Explore + Tonight — re-review #5 (the activity-first turn)

_Fifth pass, same two personas, current build. Since 06-29 the big move is structural:
"What kind of day?" became **"What do you feel like?"** — the home now leads with six
**activities** (Eat · Drinks · Coffee · Outdoors · Culture · Live) instead of moods. Plus a
run of simplifications: location asked on open (Eat defaults to nearest), the heart removed
app-wide (saving is now only "+ Add to My Trip"), the Eat tab trimmed (quick-picks row gone,
dinner-first cuisines, no stray count), and My Trip de-cluttered (Download + Google-import off
the top, the confusing Morning/Afternoon/Evening toggle gone). Grounded in verified current
behavior. 2026-06-30._

---

## Headline

**This is the first pass where the two personas move in *opposite* directions — and that's
the story.** The activity-first reframe is exactly what the **local** needed: she opens the app,
taps "Drinks," and gets bars near her — no abstract "what mood am I in?" detour. That, plus
location-on-open and the leaner Eat, pushes Maya **9.1 → 9.3**. But the reframe **orphaned the
moods** — and the curated moods ("First time in NYC," "Date night") were the **visitor's**
favorite door, their "tell me what's worth doing" entry. Losing it costs Tom & Rachel some of
their inspiration and warmth, nudging them **9.3 → 9.2**. The reframe was right; it just needs
its other half (moods restored as *collections*) so the visitor isn't collateral damage.

**Scores: 06-29 → 06-30**

| Dimension | Local (Maya) | Visitor (Tom & Rachel) |
|---|---|---|
| First impression | 9 → 9 | 9 → 9 |
| Clarity of purpose | 9 → **9.5** | 9 → 9 |
| Content relevance | 9 → 9 | 9.5 → **9** |
| Navigation & flow | 9 → **9.5** | 9.5 → 9.5 |
| Trust & credibility | 9.5 → 9.5 | 9.5 → 9.5 |
| Delight & return | 9.5 → 9.5 | 9.5 → **9** |
| **Overall** | **9.1 → 9.3** | **9.3 → 9.2** |

---

## What moved since 06-29

| Shipped | Who it helps | Effect |
|---|---|---|
| **Activity-first home** — "What do you feel like?" → Eat / Drinks / Coffee / Outdoors / Culture / Live, each opening activity → place → picks | Local most | Direct, nameable, fast; kills the mood-overlap ("a drink fits chilling/dating/raining") |
| **Location asked on open** → Eat opens on the 10 nearest | Local most | "What's near me" with zero taps |
| **Area is now a step inside an activity** (Near me / Anywhere / pick) | Local | Resolves the Area-vs-mood overlap — area stopped being a competing front door |
| **Heart removed app-wide** — saving only via "+ Add to My Trip" | Both | One clear save action instead of two (heart *was* the same thing, confusingly) |
| **Eat trimmed** — quick-picks row gone, dinner-first cuisines, no "303 spots" | Both | Less wall, more answer |
| **My Trip de-cluttered** — Download + Google-import off the top; the Morning/Afternoon/Evening toggle removed | Both | The itinerary is the focus; one less confusing control |
| **Maps chooser** — "View on Maps" → Apple / Google bottom sheet | Both | Picks your maps app instead of forcing Google |

---

## Persona A — Maya, Williamsburg local (9.1 → 9.3)

- **The home finally speaks her language.** On 06-29 the front door was *moods* — and as we
  discussed, a local doesn't think "what mood am I in," she thinks "I want a drink." Now she
  opens the app, taps **Drinks**, picks **Near me**, and gets Brooklyn bars. That's a six-year
  resident's actual mental model, and it's the single most "this is for me, not a tourist" change
  yet. (+ Clarity, + Navigation)
- **Location-on-open compounds it.** Because the app asked for location at launch, **Eat** opens
  already sorted to the 10 nearest — the "what's good right *here*" she always wanted, with no
  setup. (+ Navigation)
- **The overlap she'd have tripped on is gone.** Area used to live both as a Browse door and
  inside the mood flow; now it's just an optional step within an activity, so there's one clear
  way to narrow by neighborhood. (+ Clarity)
- **Still capping her at ~9.3:** the activity destinations for Drinks/Coffee lean on the
  imported/DB pool rather than deep editorial curation, so a few taps land on competent-but-not-
  surprising lists; and Browse → Areas is still one Brooklyn chip. Good utility, not yet a local
  secret-keeper.

**Maya: 9.3.** "It stopped asking me riddles. I want a drink, I tap Drinks, it knows I'm in
Williamsburg. That's the app I'd actually open on a Tuesday."

---

## Persona B — Tom & Rachel, visitors (9.3 → 9.2)

- **They lost their favorite door.** On every prior pass, "First time in NYC" (and "Date night")
  was the visitor's perfect entry — the curated, "we don't know what we want, guide us" path that
  made the app feel like a local friend. The reframe replaced moods with activities and **didn't
  rehome the moods**, so that entry is simply gone. Activities answer "I know what I want"; a
  first-time visitor often *doesn't*. (− Content, − Delight)
- **The polish still lands for them.** Leaner Eat, in-app restaurant detail, the de-cluttered
  My Trip, and the maps chooser all help a time-boxed visitor. So this isn't a collapse — it's a
  clear, specific loss of the *inspiration* layer against a backdrop of gains. (+ Navigation)
- **Tonight is still "Tonight."** The naming/IA question your friend raised ("why only Tonight,
  and how is it different from Explore?") is unresolved — for a visitor scanning the nav, the tab
  still undersells itself.

**Tom & Rachel: 9.2.** "It plans a great trip and the restaurant stuff got nicer — but the
'we're new, inspire us' starting point we loved is missing now. We'd want that back."

---

## What's working — keep this

- **Activity-first is the right spine.** It's faster, nameable, and finally resolves both the
  mood-boundary problem and the Area overlap. Don't walk it back.
- **Location-on-open → nearest** is a genuine "it just knows" moment for the local.
- **One save action.** Removing the heart killed a real ambiguity; "+ Add to My Trip" is the
  single, legible verb now.

---

## Issues & friction

**Must-fix**

- **Rehome the moods as Collections (the visitor regression).** Add a "Feeling something
  specific?" row beneath the activity cards: Date night · Rainy day · First time in NYC · Sunday
  chill — the old moods as curated, overlap-friendly *stories*. This is the missing other half of
  the reframe; it restores the visitor's inspiration door without giving up activity-first.
  _Consequence today: a first-time visitor has no "guide me" entry._

**Should-fix**

- **Tonight → "Events."** Still named "Tonight," still reads like the same kind of browse screen
  as Explore. Renaming (and keeping the This-Week strip as the agreed teaser) is the cheap fix
  for the IA confusion. _Consequence: the tab undersells its weekend/week content and overlaps
  Explore in feel._
- **Deepen the thin activities.** Drinks/Coffee/Live picks lean on the imported pool; a little
  editorial curation per activity would make the local's taps feel curated, not generic.

**Polish**

- **Areas granularity** — Brooklyn is still one chip (unchanged, still the top local ceiling once
  the above are done).

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

**Add the Collections row (moods as curated stories) under the activities.** It's the half of the
reframe we haven't shipped yet, and it's the entire visitor regression in one move: the local
keeps the fast activity spine she just gained, and the visitor gets back the "inspire us" door
they lost — overlap-friendly, on-brand, and exactly where the warmth lives. After that, the
Tonight → Events rename is the next-cheapest win.

---

## Bottom line

Five passes in, this is the first that traded one persona for the other — and it's a *good*
trade in progress, not a finished one. Activity-first was the correct, hard call: it fixed the
mood-boundary problem and lifted the local (the weaker number) to 9.3. But it shipped without its
counterpart, so the visitor dipped to 9.2 by losing the curated entry that made the app feel like
a friend. Restore the moods as a Collections row and both numbers should sit at their best yet —
local 9.3+ from utility, visitor back to 9.3+ from inspiration — with a clean, non-overlapping
structure underneath: activities to *do*, collections to be *inspired*, events in their own tab.
