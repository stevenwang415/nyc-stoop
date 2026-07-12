# Two open questions to think about

_Not build instructions — these are structural decisions to make first. Written to
think with, 2026-06-30._

There's a thread connecting both issues: **the app now has three browse/search
surfaces — Explore, Tonight, and Eat — and they overlap.** Each one searches,
filters, and lists places or happenings. The friend's two complaints are really
symptoms of that. So before polishing either screen, the higher-leverage question
is *what each surface is for*.

---

## 1. "Where to eat" is too complex

### What it is today
The screen stacks, top to bottom: a hero → "Where are you?" area chooser → a
Filters drawer (cuisine, price, vibe, meal, dietary) → a borough map → a Sort row
→ quick-pick chips → cuisine pills → results. That's six controls before you see
food. Each addition was reasonable on its own; together they're a wall.

### Why it matters
"Where to eat" is a *fast, low-stakes* decision. People arrive with a concrete
craving ("ramen near me," "cheap, open now") and want an answer in one or two taps.
A filter-builder is the wrong default for that job — it asks the user to assemble a
query before the app gives them anything.

### Options (trade-offs)
- **A. Calm default, progressive disclosure.** Show results immediately + ONE slim
  row (a few quick picks like Open now / Near me / Top rated). Everything else —
  "Where are you?", the map, the detailed filters — lives behind a single "Filters"
  button. _Pro:_ answer-first, still powerful. _Con:_ power users tap one more time.
- **B. Lead with intent, not filters.** Replace the controls with a handful of
  one-tap "intentions" (Near me · Open now · Date night · Cheap · Top rated) and
  let those BE the query. Filters become advanced/optional. _Pro:_ matches how
  people actually decide. _Con:_ less precise for the rare power search.
- **C. Question the tab itself.** Is "Eat" even its own destination, or is it one
  lens on "what's good in NYC" — i.e. part of Explore? (See issue 2.) _Pro:_ removes
  a whole surface. _Con:_ Eat is a strong standalone use case; folding it in could
  bury it.

### Questions to decide
- What's the ONE thing a user wants from this screen in the first 2 seconds?
- Of cuisine / price / area / open-now / sort — which two matter most? Make those
  primary, demote the rest.
- Is the borough map earning its space, or is "Near me" + an area chip enough?

---

## 2. Why "Tonight"? (this is an IA problem, not a naming one)

### The real question
The friend is right that this isn't just a label. "Tonight" is **also a
search/browse page** — ranges (tonight / weekend / week), category chips, borough
scope, curated picks. So the sharp question is: **if Tonight is a browse surface and
Explore is a browse surface, what is the actual difference between them?** Right now
a user can't tell, and that's the problem.

### The distinction that probably exists (but isn't expressed)
There IS a clean line hiding here:

- **Explore = places & guides. Evergreen.** Venues, museums, neighborhoods,
  restaurants, topics. "What's good in NYC" — true any week.
- **Tonight = events. Dated.** Concerts, shows, street fairs, markets — things with
  a *when*. "What's on while I'm here."

That's a defensible split (timeless *places* vs. dated *happenings*). The trouble is
the UI blurs it three ways:
1. The **name "Tonight"** sounds like a time filter, not "the events hub" — and it
   undersells the weekend/week content that's already there.
2. **Explore leaks events** — it has its own "This week in NYC" strip and
   "Plan my night," so events live in *both* tabs.
3. Both tabs **look and behave like the same kind of search screen**, so nothing
   signals "this one is places, that one is events."

### Options (trade-offs)
- **A. Commit to places vs. events.** Rename Tonight → **"Events"** (or "What's
  On"). Pull the events strip OUT of Explore (or make it a teaser that deep-links
  into Events) so events have ONE home. Explore becomes purely places/guides.
  _Pro:_ each tab gets a one-sentence identity. _Con:_ Explore loses some "live"
  feel on its home.
- **B. Organize by WHEN instead of WHAT.** Explore = "anytime / plan ahead,"
  Tonight = "right now / today." _Pro:_ matches the "Tonight" instinct. _Con:_ messy
  — a restaurant is both "now" and "anytime," so the line keeps blurring (this is
  basically today's problem).
- **C. Merge into one browse surface.** A single "Discover" with a **Places /
  Events** toggle at top. _Pro:_ kills the overlap entirely; one search, one mental
  model. _Con:_ a big restructure, and loses the dedicated-tab prominence events get.
- **D. Make Explore the hub, Events a section within it.** _Pro:_ fewer top-level
  tabs. _Con:_ events lose their standalone entry; harder to find "what's on."

### Questions to decide
- In one sentence each: **what is Explore for? what is Tonight for?** If you can't
  say them without overlap, the tabs need to change, not the label.
- Should events appear in Explore at all, or only in their own tab?
- Is the organizing axis **WHAT** (places vs events) or **WHEN** (now vs anytime)?
  Pick one — trying to do both is what created the confusion.
- With Eat also being a browse surface, is the real answer **two** clear tabs
  (Places, Events) rather than three (Explore, Eat, Tonight)?

---

## The meta-decision (do this first)
Draw the line once: **what belongs in each tab, by what rule.** Most of the Eat
complexity and all of the Tonight confusion are downstream of not having that rule.
Once "Explore = X, Events = Y, Eat = Z (or part of X)" is decided, the screen-level
fixes become obvious and small.
