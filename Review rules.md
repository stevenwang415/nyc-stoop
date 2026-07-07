# NYC Stoop — review rules (the standing rubric)

The reusable rules for evaluating this app. Every review (the dated
`REVIEW_EXPLORE_*` files) should follow this so scores stay comparable over time.
This defines *how* to judge; the dated files are the *results*.

---

## 0. What the app is for (the yardstick)

Everything is judged against the core job: **help someone in NYC decide what to do,
and turn it into a routed plan.** A change is "good" only if it helps a real person
make that decision faster, more confidently, or more delightfully. Pretty is not the
bar; *decided* is the bar.

Two verbs the app must serve, kept distinct:
- **Explore** = browse & learn (places, by topic / area / activity) — evergreen.
- **Events** (the Tonight tab) = see what's on — dated.
- **My Trip** = turn saves into a routed day.

---

## 1. Ground rules for reviewing

1. **Behavior-grounded, never assumed.** Judge what the build *actually does* — verified
   in the code or by using it. Never score a control you didn't confirm works. If a
   claim can't be verified, say so; don't guess.
2. **Two personas, always.** Score the app twice — once as each standing persona
   (below). A change can help one and hurt the other; the review must show that.
3. **Walk scenarios, don't sweep screens.** Evaluate through the persona's real
   journeys (§3), not a checklist of pixels.
4. **Every critique carries a fix.** Frame each issue as "here's the fix and why it
   helps," tied to *who it hurts*.
5. **Show the delta.** Always score against the previous review and explain what moved
   and why. Diminishing returns are expected at the top of the scale — resist
   inflation (§6).
6. **Be honest about trade-offs and regressions.** If a shipped change cost a persona
   something, say it plainly and score it down.

---

## 2. The two standing personas

- **Maya — the local (Williamsburg, 6 years).** Opens the app with a concrete,
  immediate intent ("a drink near me," "what's on this weekend"). Values speed,
  utility, "near me," novelty, and *not* being treated like a tourist. She is the
  app's weaker/ceiling number — moving her is usually the higher-leverage win.
- **Tom & Rachel — the visitors (first NYC trip, a few days).** Often *don't* have a
  concrete intent — they want to be guided and inspired ("what's worth doing?").
  Value curation, a "local friend" voice, bookable specifics, and an end-to-end trip
  plan. They sit near the top of the scale; protect their inspiration + trust.

Add a **third persona only when a feature demands it** (e.g. a families/kids reviewer
for a family feature), and say why.

---

## 3. Core scenarios to walk (per persona)

Adapt to what changed, but these are the standing journeys:

1. **"What do I feel like right now?"** — the activity/mood entry → area → picks.
2. **"What's near me / in my neighborhood?"** — location + area scoping.
3. **"What's on tonight / this weekend?"** — the Events tab (ranges, categories, links).
4. **"Where should we eat?"** — the Eat browser (find → detail → act).
5. **"Plan our day/night."** — Plan-my-night / My Trip: build → meals → route → save →
   reload (does it persist?).
6. **"Find one specific place."** — search + a venue/place detail.
7. **First-open impression** — onboarding + the home in the first 10 seconds.

For each: note *what actually happens*, whether the primary action is obvious and
works, and where the persona hesitates, gets lost, or hits a dead end.

---

## 4. Scoring dimensions (each /10, plus an Overall)

Score **both personas** on each. Definitions + what to look for:

| Dimension | The question | Red flags |
|---|---|---|
| **First impression** | Does the home make purpose + value obvious in ~10s? | Cluttered, generic, "what is this?" |
| **Clarity of purpose** | Can the user tell what each tab/section is for, and pick without thinking? | Overlapping tabs, fuzzy labels, two ways to do one thing |
| **Content relevance** | Are the results the *right*, real, useful things for this persona? | Thin/empty lists, wrong-area results, junk, tourist-only for a local |
| **Navigation & flow** | Fast, obvious path to the goal; no lost-place or dead ends. | Buried primary action, long flat lists, redirects out of the app |
| **Trust & credibility** | Does it look finished and tell the truth? | Broken images, 404s, wrong counts/times, dead links, duplicates |
| **Delight & return** | Would they reopen it? Warmth, curation, "for me" moments. | Utilitarian-but-soulless, or pretty-but-useless |

**Overall** is a holistic judgment (roughly the weighted feel, not a strict mean).
Weight **Clarity, Content, Navigation** a touch higher for the local; **Content,
Delight, Trust** for the visitor.

### Score bands (calibration — hold the line)
- **9.5–10** — best-in-class; you'd show it off. Reserve for genuinely excellent.
- **9.0–9.4** — very strong; a small, specific gap remains.
- **8.0–8.9** — good; one real weakness a persona notices.
- **7.0–7.9** — works, but a clear structural or content problem drags it.
- **≤6.9** — a journey fails, or the persona wouldn't return.

Half-points are fine. A single broken primary flow caps that persona's Overall at ~8.

---

## 5. Issue classification (every finding gets one)

- **Must-fix** — breaks a core journey, loses a persona's key value, or looks broken
  (404, wrong data, a regression). Fix before anything else.
- **Should-fix** — real friction or a clear better path; not blocking but costs a
  persona speed/confidence/delight.
- **Polish** — small, cosmetic, or edge-case; nice-to-have.

Each issue states: *what*, *who it hurts*, *the consequence*, and *the fix*.

---

## 6. Scoring discipline (anti-inflation)

- **Compare to last time, not to zero.** Report `prev → new` per dimension and justify
  each move with a specific shipped change or a specific remaining gap.
- **A number only moves if behavior moved.** No "feels better" bumps.
- **Name the ceiling.** Every review ends by stating what's capping each persona's
  score and the single highest-leverage next fix ("the one thing to fix first").
- **Regressions count.** If a change helped A and hurt B, A goes up *and* B goes down.

---

## 7. Report shape (what a review outputs)

1. **Headline** — the one-paragraph story of this pass (what moved, for whom).
2. **Scores table** — `prev → new`, both personas, all dimensions + Overall.
3. **What moved since last time** — shipped items × who they help × effect.
4. **Persona walkthroughs** — a few sentences each, tied to the scenarios (§3).
5. **What's working — keep this.**
6. **Issues** — grouped must-fix / should-fix / polish (§5).
7. **Scorecard** — the clean final table.
8. **The one thing to fix first** — highest-leverage next move, and why.
9. **Bottom line** — the trajectory across passes.

---

## 8. Cadence & files

- One dated file per pass: `REVIEW_EXPLORE_YYYY-MM-DD.md` (or a feature-scoped name).
- Keep the series so the trajectory is visible (7.1 → 8.5 → 8.9 → 9.1 …).
- Re-read the previous review before starting, to anchor the deltas.
