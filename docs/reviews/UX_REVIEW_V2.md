# NYC Stoop — UX Audit v2 (Post-Tier-3)

**Date:** 2026-06-12
**Build state:** After Tier 1 + Tier 2 + Tier 3 of the v1 roadmap (see `UX_EVAL.md`). All four T3 items shipped: trip share link, Brooklyn expansion, multi-mood combine, day-of-week tabs on This Week. Bottom nav order: **Explore · Map · Eat · This Week · My Trip**.

**Method:** Three personas walking through every primary surface, plus a structural pass that audits each tab/function independent of any persona's mental model. Severity scale: 🚨 Blocker (someone gives up) → ⚠️ Major (someone notices and grumbles) → 🔧 Minor (a polish or copy issue).

---

## 1. The personas

I'm running three this round. Sarah and Mike are carryovers from `UX_EVAL.md` so we can directly measure improvement. Priya is new — she stresses dimensions Sarah and Mike don't.

| Persona | Headline | Stresses |
|---|---|---|
| **Sarah** from Seattle | 32, marketing manager, 4 days with husband, hotel Midtown East | Trip-shape, mood discovery, save→trip flow, hero |
| **Mike** from Williamsburg | 38, web designer, evening alone, drizzling Tuesday | Resident utility, This Week day tabs, Brooklyn coverage, search |
| **Priya & family** from London | Architect, husband, kids 7 + 11, 5 days, kosher-vegetarian | Family-friendly content, dietary filters, kid-paced trip, walking budget |

---

## 2. Persona walkthroughs

### 2.1 Sarah — first-time visitor (refresh)

**Opens app on phone in Uber from LGA.** Onboarding modal greets her with three slides. Slide 1 emoji 🗽, title *"Discover what's on, tonight in New York."* — already a problem: the eyebrow on that slide still reads **`NYC TONIGHT`** in caps (App.jsx:10653), but the wordmark on the next screen reads **NYC Stoop**. She'll briefly wonder if she downloaded the wrong app. 🔧

She skips through onboarding, lands on Home. The hero pick on a Friday is Hamilton (image, price-tagged). The card shows the photo, "Tonight · 7pm curtain", and a date pill. She likes it — the photo carries it. The "Read about theater →" learn bridge is subtle and tasteful.

**Scrolls.** "What's new since you visited" green ribbon doesn't show (first visit — correctly suppressed). Mood scroller leads with the red **Where to eat** card, then 5 mood cards. She sees **First time in NYC** and taps — exactly the right primitive. ✅ T3 multi-mood combine adds a "+ Combine with —" chip row at the top of the mood page. As a first-timer she ignores it; the framing is non-intrusive. Good. ✅

**Inside First time in NYC.** Borough toggle defaults Manhattan. Schematic SVG map with counts per area. Taps Midtown → 12 picks grouped by sub-category. New since the v1 review: the **insider tip preview** now shows as an italic amber line on each card. She immediately sees Rockefeller's "go after 6pm — the lights, no line" without tapping in. ✅✅ The single biggest UX win of Tier 1.

**She wants to save the whole area.** The Tier 2 "Save area to trip" button is present. She taps it and gets 12 things saved in one go. ✅ But there's no confirmation toast or count diff — the heart icons just become filled. She scrolls up to confirm. ⚠️ A small "12 added to saved" toast would close the loop.

**Taps the Met card → VenueScreen.** Hero, character paragraph, insider tip. She saves with the heart pill. Notices the share button in the header — that's new and trustworthy.

**Heads to Where to eat.** Hits the Eat tab via bottom nav (the Tier 1 swap means it's now primary). Red hero, *"What to order, where to book."* — much better differentiation than just repeating Where-to-eat. The Today's Pick bar lands first; **Walk-in tonight · Cheap eats · Brunch · Splurge · Date Night** quick picks below. Top 3 results visible, "Show all 19" button — exactly the right density.

Taps **Italian** in the filter drawer → 3 spots (Carbone, Lilia, Don Angie). She taps Carbone, sees must-order list. ✅

Goes back to the filter. Tries **Ramen** — *"No restaurants match those filters."* The empty state is gentle and accurate ("the database is still growing") but **the Ramen pill should not be there if zero restaurants tag it**. ⚠️ Same for any other pill with zero data. The code (App.jsx:3337) hardcodes the cuisine taxonomy and explicitly comments that this is intentional ("placeholders for editorial growth"), but it confuses users who don't know that.

**My Trip.** Top of the screen now has **Trip dates** affordance (Tier 2). She enters arrival 2026-04-04 and 4 nights. ✅ Itinerary expands to 4 days, grouped by neighborhood. Day 1 shows her Midtown stops with travel-time hints. Restaurants auto-suggested for lunch/dinner. The "Imported from Google Maps" section is hidden because she has 0 imports (Tier 1 fix). ✅✅

**Shares.** Taps Share. Tier 3 share link copies a `/#/t/<base64>` URL to her clipboard. She pastes it to her husband. He opens it on his phone — `SharedTripView` renders her itinerary read-only with a "Copy to my trip" CTA. ✅ Excellent viral loop.

**Sarah's refreshed score: 7.5/10** (was 6.5/10)
- First impression: **7** (+2) — hero photo + onboarding clearer, but the brand-name inconsistency on slide 1 nags.
- Discovery flow: **8** (+1) — Tier 2 batch-save closes the biggest paper cut.
- Content depth: **9** (+1) — insider tip preview is the headline win.
- Trip building: **7** (+2) — trip dates + hidden imports = clean slate.
- Polish: **8** (=) — share works, but no save-confirmation toast.

### 2.2 Mike — resident (refresh)

**6:45pm Tuesday, drizzling. Wife's out.** Opens app. Hero is rotating among picks-with-images (App.jsx:1189). On Tuesday day-of-week 2 % 9 = 2 — could be MoMA, Carnegie, Met, Vanguard, etc. depending on the deterministic rotation.

⚠️ **Concrete bug: the hero rotation doesn't honor `bestDays`.** Tier 3 added day-of-week awareness to the This Week tab but the home hero is still `heroCandidates[new Date().getDay() % heroCandidates.length]`. On a Monday this can surface Hamilton — which is dark Mondays per the new bestDays array. Mike rolls his eyes. 🚨 **High visibility, easy fix**: filter `heroCandidates` through the same `bestDays` predicate before indexing.

He scrolls. Mood cards. Taps **Rainy Day**. New mood-page is much better than the v1 review: schematic map, borough toggle, picks grouped by sub-category.

**Tier 3 Brooklyn expansion lands.** He taps Brooklyn — the map is no longer half-grey. He sees `roberta_s_pizza` under "Food halls + pizza", `bargemusic` under "Halls + shows". ✅ Real Brooklyn coverage that doesn't feel forced.

**Multi-mood combine — his moment.** He taps the **Date Night** chip in the "+ Combine with" row even though he's alone. Picks union, double-matchers get an amber `★ matches 2` badge. Indoor-with-romance spots float to the top visually. Genuinely novel — Google Maps can't do this. ✅✅

**He searches "wine bar."** v1 returned zero results. v2 now returns the Tier 2 fallback: *"NYC Stoop hasn't curated 'wine bar' yet"* with a **Search Google Maps** button. Clean handoff. ✅ Honest about scope without leaving him stranded.

**Taps This Week tab.** Tier 1 renamed from "Tonight" → "This Week" — expectation reset. Tier 3 added the 7-day strip. Today is Tuesday → "Today · 8 on" is highlighted. He taps **Friday** to see what's on weekend night. Hamilton + Met-at-dusk appear, Federal Hall drops out (weekdays only — but Federal Hall *is* a weekday so this is right; let me re-check… correct, Fri is in `bestDays`). The Met dusk pick correctly shows only on Fri/Sat. ✅

He taps Wednesday → empty state copy reads "Nothing curated in that category on Wednesday." (when a domain filter is active) with a Reset Filters button. Good. ✅

Tries **All filter + Monday** → Hamilton correctly drops out, Federal Hall stays. Vanguard explicit-all-week stays. The "N on" caption updates per day. ✅ Real follow-through.

⚠️ **But the day strip and the domain filter row don't visually pair.** The day strip lives outside the sticky region; the chip row sticks. On scroll the day strip vanishes but the filter chips remain. A returning user wouldn't realize they're still filtered to Friday. Either both should stick or the chip-row should echo the active day ("All · Friday"). 🔧

**Saved tab.** He has 0 saves. Empty state: *"Nothing saved yet — Bookmark things you want to come back to."* Acceptable for a one-evening user, but the My Trip CTA in the saved screen only appears at ≥3 saves. As an evening-only user he never sees a path forward. 🔧

**Mike's refreshed score: 6.5/10** (was 4.5/10)
- First impression: **6** (-1 actually, because of the bestDays-ignored hero on bad days; otherwise 7+)
- Discovery: **8** (+3) — Brooklyn + combine moods + This Week framing.
- Content for residents: **6** (+1) — better but the canonical 4-5 jazz/cocktail spots haven't grown.
- Search: **7** (+3) — fallback removes the trust hit.
- Resident utility: **6** (+3) — day-of-week tabs are genuinely his use case.

### 2.3 Priya & family — five-day London family

**Lands at JFK on Saturday. Wife Aanya, kids Rohan (11) and Maya (7). Five nights.**

**Opens app.** Onboarding modal — the slide-2 line "Tap the heart on any venue, pick, or museum" is clear, but slide 3 says "My Trip groups your venues by neighborhood, suggests restaurants and travel times, and gets you out the door." — none of that telegraphs *for a family.* She wonders if this app is for couples and singles. 🔧

**Taps Family day mood.** Hero "Museums kids actually like, parks with room to run, baseball games, dinosaurs, an aquarium by the sea." ✅ The mood blurb itself is the most kid-aware copy in the app. Picks include American Museum of Natural History, Bronx Zoo, etc. (Verified via the moods.js inventory.)

**Insider tip preview shines for her too.** Knowing the AMNH dinosaur hall is on Floor 4 right of the main entrance saves 20 minutes with a tired 7-year-old. ✅✅

**But: no kid-age signal on cards.** A pick perfect for an 11-year-old (planetarium, baseball) is visually identical to one a 7-year-old will throw a fit at (long museum walks). The mood-page card pattern has icon + name + cuisine/neighborhood + chevron, with no "ages 6+", "stroller-friendly", "indoor/outdoor", or "expected duration" badge. ⚠️ Big gap for families.

**Eat tab.** She and her family are kosher-vegetarian. She opens Filters → Cuisine. Sees Italian, Pizza, Sushi, Ramen, Korean, Mexican, French, Steakhouse, Bakery, Bar, Brunch, Deli. **There is no "Vegetarian"/"Vegan"/"Kosher"/"Halal"/"Gluten-free" anywhere in the cuisine taxonomy.** 🚨 Blocker. She can guess that Pizza and Bakery are likely-veg-friendly but can't filter to her dietary need.

She tries the **Vibe filter** — date_night, casual, iconic, splurge, quick, late_night, **family_friendly**, hidden_gem. She taps family_friendly. **One single result — Sarabeth's** (verified: only 1 of 19 restaurants is tagged family_friendly in `content.js`). 🚨 The pill exists, the data doesn't support it. A family of four with 5 days is told there is ONE family-friendly restaurant in NYC. She closes the app. This is more damaging than no filter at all.

She tries **Splurge** instead just to browse. Carbone, EMP, Don Angie. Not family-friendly material at all.

**My Trip.** Auto-itinerary works after she sets dates (5 nights). But each day has 4-6 stops. With a 7-year-old that's too many — a real family schedule is 2 stops + lunch + downtime. No "trip pace" slider (relaxed/standard/packed) or stop-cap. ⚠️ Auto-itinerary is built for singles/couples, not families.

**No walking-distance summary per day.** The day card shows travel-time hints between stops but no aggregate "this day is 4.2 miles of walking." For a family with a 7-year-old that number is decision-critical. ⚠️

**Priya's score: 5/10** (new persona — no prior baseline)
- First impression: **6** — clean app but visibly not family-shaped past the mood emoji.
- Discovery: **5** — Family day mood is strong but cards don't pace by kid age.
- Content depth: **7** — insider tips help; gap is breadth.
- Eat: **2** — dietary filters absent; family_friendly pill returns 1 result. Major blocker for the persona.
- Trip building: **4** — auto-itinerary unaware of family pace; no walking-distance roll-up.
- Polish: **7** — same clean visuals.

---

## 3. Tab-by-tab function audit

A structural pass independent of any persona — catches things the walkthroughs wouldn't surface.

### 3.1 Explore (Home)

**What works.** Hero card with photo + date pill + save heart is the strongest single screen in the app. Search has the Tier 2 zero-results fallback. Mood scroller is the right primary action. What's-new ribbon is restrained.

**Issues.**
- 🚨 **Hero ignores `bestDays`** (App.jsx:1191). Shows Hamilton on Mondays even though Broadway is dark. The fix is one line: filter `heroCandidates` to `p.bestDays?.includes(today) ?? true` before the day-index modulo.
- 🔧 **Subtitle copy still aspirational, not concrete.** *"A curated guide to what's on — and the stories behind it."* (App.jsx:1062) Sarah's review v1 said the hero is "gorgeous but mismatched to her actual need (plan a trip vs. find tonight's thing)." Consider adding a second line like *"Save what you like, build a day-by-day trip in one tap."*
- 🔧 The **Eat scroller card** sits inside "What kind of day?" — Eat isn't a day or a mood. Either rename the section ("What now?") or pull Eat above as its own row.
- 🔧 The settings gear is top-right, white-on-photo, low contrast. Easy to miss.

### 3.2 Map

**What works.** Leaflet map loads cleanly; venue pins colored by domain; save heart in popup card; saved-venues visually distinct.

**Issues.**
- ⚠️ **User-added venues don't appear on the Map** (task #111 is open and pending). For power users this is a real gap — they've added their own places and can't see them spatially.
- 🔧 Map is a top-level tab but doesn't lead with editorial framing. Most users will use the per-screen maps (Eat, Mood) and rarely visit this tab. Consider whether it earns its primary nav slot or should fold into a header button.

### 3.3 Eat

**What works.** Tier 1-3 reworked this tab significantly. Hero matches the app's style now; quick picks are distinct from chip filters; collapsed-to-3 + Show All keeps it short; results-first with filters-on-tap.

**Issues.**
- ⚠️ **Cuisine taxonomy has ghost pills.** Ramen, and any future placeholder, currently returns zero. The comment in code (App.jsx:3337) calls this intentional. From a user standpoint it's a trust hit on every empty filter tap. Either hide pills with zero matches (mirror the This Week pattern at line 5911) or visually disable them with a "coming soon" tooltip.
- 🚨 **No dietary filters at all.** No vegetarian, vegan, kosher, halal, gluten-free, dairy-free. For any persona with dietary constraints this is a hard stop. The dataset would need `dietary: ['vegetarian-friendly', 'kosher']` tags on each restaurant; the filter row would gain a Diet section above Vibe.
- ⚠️ **`family_friendly` vibe has one matching restaurant.** Same problem as Ramen but worse — it actively misleads a family searching by it. Either populate the field across the dataset or remove the pill until it's earned.
- 🔧 The Today's Pick rotates by day-of-year (App.jsx:3501). Reasonable. But the bar doesn't tell the user *why* it's today's pick — "Today" is just a date marker. A one-line "because it's spring and brunch season" would warm it.
- 🔧 With map drawer collapsed, the borough toggle vanishes — users who want Brooklyn-only first have to expand the map. A borough-pill row above the cuisine row would shortcut this.

### 3.4 This Week

**What works.** Day-of-week strip is the major Tier 3 win. Domain filter row sticks. Counts adapt per day. Section copy reads "ideas Thursday night" when previewing a future day. Empty state offers Reset.

**Issues.**
- 🔧 **Day strip not sticky.** The chip filter row is sticky, but the day strip above it scrolls away. On a long list a user can lose track of which day they're previewing. Either both stick, or the chip row echoes the day ("All · Friday").
- 🔧 **"N on" caption is ambiguous.** "8 on" could read as "8 on the calendar" but it actually means "8 ideas applicable." Try "8 picks" or "8 ideas" — slightly more verbose but unambiguous.
- ⚠️ **Bestdays data is incomplete.** Only 4 of 10 picks have explicit `bestDays`. The others are treated as 7-days-a-week, which is mostly fine but means MoMA appears on its closed Tuesday (per the code comment, kept as 7-day because public MoMA-is-open-daily was the cautious call). Tightening this requires editorial work — verifying hours for each pick. Worth it.
- 🔧 Live time anchor "It's Tuesday evening, 6:45 PM" is nice but appears even when the user is previewing Saturday. Either suppress when `dayIdx !== todayIdx` or rephrase: "Tuesday now · previewing Saturday."

### 3.5 My Trip

**What works.** Trip dates (Tier 2). Per-meal-per-day cuisine picker. Map-of-day SVG. Drag-to-reorder. Share link (Tier 3). Hidden-imports-when-empty (Tier 1). Add-stop inline per day.

**Issues.**
- ⚠️ **Auto-itinerary doesn't pace by group size.** No setting for relaxed/standard/packed. Sarah (couple) and Priya (family with 7-year-old) get the same density.
- ⚠️ **No aggregate day metrics.** Walking miles, total cost estimate, mode-of-transport mix. The travel-time hints between stops are great but a day-header rollup would let users sanity-check at a glance.
- 🔧 **Restaurant integration is partial.** Task #149 is open. Restaurants are auto-suggested by the meal-cuisine picker per day but only loosely; the suggestion isn't constrained to walking distance from the previous stop. A user can end up with a dinner across town.
- 🔧 **Settings drawer surfaces trip dates but not party size or pace.** That's the missing knob.
- 🔧 The **"Plan My Visit" CTA on Saved tab** requires ≥3 stops (App.jsx:9103). Users with 1-2 saves can't see how to progress.

### 3.6 Modals & cross-cutting flows

**Onboarding.**
- 🔧 Slide 1 eyebrow `NYC TONIGHT` (App.jsx:10653) is stale after the rebrand. Update to `NYC STOOP`.
- 🔧 Slide 3 family/group framing is absent. *"Whether you're solo, on a date, or wrangling kids — we shape the trip to fit."*

**Add Place.**
- Functioning, but lives only in the My Trip header now (post-Tier-1 swap). New users may never discover it. Either fine (power-user feature) or surface a one-time "Have a place we missed? Add it" tooltip in My Trip after 7 days.

**Settings.**
- Trip dates live here. Good. But the discovery path is Settings → drawer → dates. A dedicated "Trip shape" entry in My Trip header (with date + days + party-size + pace) would consolidate the trip metadata into one obvious place.

**Auth.**
- Backend exists; frontend has AuthModal, ForgotPassword, Reset. None of the personas tested it (all opened cold without signing in). Worth a separate auth-only review pass — saves should round-trip across devices, which is the main payoff for logging in.

---

## 4. Severity-ranked findings

### 🚨 Blockers (3)

| # | Finding | Where | Fix sketch |
|---|---|---|---|
| B1 | Home hero ignores `bestDays` — shows Hamilton on dark Mondays | App.jsx:1189 | Filter `heroCandidates` by `bestDays?.includes(today) ?? true` before modulo |
| B2 | Eat tab has no dietary filters (veg/vegan/kosher/halal/GF) | content.js + App.jsx:3308 | Add `dietary: string[]` to restaurant rows; new Diet filter row above Vibe |
| B3 | `family_friendly` vibe returns 1 restaurant | content.js | Either tag broadly across the dataset or remove the pill |

### ⚠️ Majors (7)

| # | Finding | Where | Fix sketch |
|---|---|---|---|
| M1 | No save-confirmation toast on batch "Save area to trip" | MoodScreen | 2-second toast: "12 added to your saves" |
| M2 | Ramen pill returns zero — taxonomy ghost pills | EatScreen:3337 | Hide pills with zero matches OR mark "coming soon" |
| M3 | User venues invisible on Map tab | MapScreen | Render user_venues alongside curated venues with distinct pin style |
| M4 | Hero subtitle doesn't telegraph trip-building utility | HomeScreen:1062 | Add second-line CTA copy |
| M5 | Auto-itinerary doesn't pace by group/family | PlanScreen / buildItinerary | Add "trip pace" setting; stop-cap per day for relaxed/family modes |
| M6 | No per-day aggregate (walking miles, cost) | PlanScreen | Header strip on each day card |
| M7 | Bestdays data incomplete on Tonight picks | tonight.js | Editorial pass verifying weekly schedule for all 10 picks |

### 🔧 Minors (12)

| # | Finding |
|---|---|
| m1 | Onboarding slide 1 still says "NYC TONIGHT" — brand inconsistency |
| m2 | This Week day strip not sticky — scrolls away while chip filters stay |
| m3 | "N on" caption on day pills is ambiguous (vs. "N picks") |
| m4 | Live-time anchor displays even when previewing another day |
| m5 | Onboarding slide 3 doesn't address families |
| m6 | Settings gear top-right is low contrast on hero |
| m7 | Eat scroller card lives inside "What kind of day?" — semantic mismatch |
| m8 | Eat tab borough toggle is only inside collapsed map drawer |
| m9 | Today's Pick on Eat doesn't say *why* it's today's pick |
| m10 | Plan My Visit CTA only at ≥3 saves — 1-2 save users have no next step |
| m11 | Map tab may not earn primary nav slot vs Eat/Mood per-screen maps |
| m12 | Restaurant suggestions on PlanScreen days aren't distance-bounded |

---

## 5. Recommended Tier 4 roadmap

Ordered by impact ÷ effort. The Blockers belong at the top regardless.

### Tier 4 — half-day each

1. **T4.1** (B1) — Filter home hero by `bestDays`. ~10 min.
2. **T4.4** (m1) — Onboarding rebrand fix. ~10 min.
3. **T4.5** (M1) — Save-confirmation toast (reusable component). ~1 hr.
4. **T4.6** (M2) — Hide zero-count cuisine pills OR add "coming soon" disabled style. ~1 hr.
5. **T4.7** (m2) — Make This Week day strip sticky-pair with the chip row. ~30 min.

### Tier 4 — 1–2 days each

6. **T4.2** (B2) — Add dietary filters. Schema + editorial backfill + UI row. The editorial backfill is the long pole; tagging 19 existing restaurants is a 1–2 hr edit if you commit to the taxonomy first.
7. **T4.3** (B3) — Backfill `family_friendly` vibe across the dataset (and consider a richer `forKids: { minAge, strollerFriendly, indoorOnly, durationMin }` schema).
8. **T4.8** (M3) — User venues on Map (closes task #111).
9. **T4.9** (M6) — Per-day walking-miles + cost rollup on PlanScreen day cards.

### Tier 4 — 3–5 days each

10. **T4.10** (M5) — Trip-pace setting (relaxed / standard / packed); itinerary builder respects per-day stop cap.
11. **T4.11** (M7) — Editorial pass: complete `bestDays` for all This Week picks AND verify show schedules weekly via a small scheduled task.
12. **T4.12** — Restaurant suggestions on PlanScreen days constrained to walking distance from prior stop (closes task #149).

---

## 6. Final scorecard

| Persona | First impr | Discovery | Content | Trip/Plan | Polish | **v2 Overall** | v1 Overall | Δ |
|---|---|---|---|---|---|---|---|---|
| **Sarah** (first-timer) | 7 | 8 | 9 | 7 | 8 | **7.5** | 6.5 | +1.0 |
| **Mike** (resident) | 6 | 8 | 6 | 7 | 7 | **6.5** | 4.5 | +2.0 |
| **Priya** (family) | 6 | 5 | 7 | 4 | 7 | **5.0** | — | new |

**Combined average: 6.3/10** (was 5.5).

The Tier 1–3 work moved both legacy personas up meaningfully — Mike especially, because three of his four pain points (Brooklyn coverage, Tonight-vs-weekly mismatch, search holes) were direct fixes. Priya, the new persona, scores below where Sarah and Mike land. Her score is dragged down almost entirely by **two food-tab gaps (B2, B3)** and **one trip-builder gap (M5)**. Hitting those three would lift family scores from low-5 to mid-7 — the single best ROI on Tier 4.

---

## Appendix — file:line references for fix sites

- Home hero rotation logic — App.jsx:1187-1192
- Home subtitle — App.jsx:1062
- Onboarding slide 1 eyebrow — App.jsx:10653
- Eat cuisine taxonomy — App.jsx:3337
- Eat vibe taxonomy — App.jsx:3358
- Restaurant data — `src/data/content.js` (19 rows, ~lines 2010-2570)
- This Week day strip — App.jsx:5995-6048
- This Week sticky chip row — App.jsx:6050-6085
- Plan trip dates — App.jsx:6925-6937
- Plan trip-pace setting — *does not exist yet*
- Save-area-to-trip button — MoodScreen (search for "Save area")
- SharedTripView — App.jsx:11153

End of audit.
