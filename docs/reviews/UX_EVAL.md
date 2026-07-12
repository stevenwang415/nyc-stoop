# NYC Stoop — UX Evaluation (Two Personas)

Evaluated against the latest code state. The Vercel deployment is several versions behind — re-deploy before doing real user testing.

Each section is scored 1–10 (1=broken, 5=usable but rough, 7=good, 9=great, 10=exceptional).

---

## Persona 1 — Sarah from Seattle, first-time visitor

**Context:** 32, marketing manager. Flying in Thursday night with her husband. Hotel in Midtown East, four full days, leaves Tuesday morning. Has heard of Times Square, Central Park, Brooklyn Bridge. Has $300/day budget for food + activities. Opens the app on her phone in the Uber from LGA.

### Walk-through

**Open app → Home**
- Lands on Home. Sees the wordmark "NYC Stoop" + tagline "A curated guide to what's on — and the stories behind it."
- Hero shows tonight's pick — say, the Met on Friday. Looks pretty.
- **First thought:** *"This is nice but I don't know what to tap. I want to plan four days, not pick one thing for tonight."*
- Scrolls down. Sees Mood cards (Just Chilling, Date Night, Family Day, Rainy Day, First Time in NYC). **Notices "First Time in NYC."**
- ✅ Taps that — instant relevance.

**Score — first impression / discoverability:** **5/10**
- Hero is gorgeous but mismatched to her actual need (plan a trip vs. find tonight's thing). She has to scroll past the hero to find the mood she actually wants.

**Inside "First time in NYC" mood**
- Sees the Manhattan map with colored regions, each tappable. Counts: Midtown 12 picks, Lower 4, UES 3, etc.
- Taps **Midtown** → sees Times Square, Empire State, Rockefeller, Carnegie Hall, NYPL, Grand Central, all listed in sub-categories.
- ✅ This is great. The map gives her a mental model of where things cluster. She immediately knows Midtown = sightseeing.
- ⚠️ **But:** She wants to *save* multiple things and build day 1. There's no "Add all of these to day 1" affordance. Each save = one tap, one back-button, one re-tap.

**Score — discovery flow:** **7/10**
- Mood-first is exactly right for her, but building a multi-stop day is one-tap-at-a-time.

**Taps Times Square card → VenueScreen**
- Sees venue header, action buttons, character paragraph, "Editorial callout" if she came from Tonight.
- ⚠️ Scrolls and finds the **insider tip** — "Stand on the TKTS red steps with your back to the sign…"
- She'd kill to have seen that tip on the topic page. **It's the moment the app earns its keep — and she has to dig for it.**
- Taps ♡ to save. Sees the heart fill.

**Score — venue depth & insider tips:** **8/10**
- Content is excellent. Discoverability of the insider tip is the weak link.

**Heads back, taps "Where to eat" mood (Eat tab)**
- Sees the red Eat hero. Filters: Cuisine / Price / Where / Vibe / Meal.
- Taps Italian + $$$ → sees Carbone, Don Angie, Lilia. Tap Carbone → must-order is right there. ✅ This is the single best feature in the app for her.
- ⚠️ She wants Italian *and casual*. Vibe filters don't include "Casual" as an option (looking at code, the vibes are date_night, casual, iconic, splurge, etc. — actually `casual` IS there, but she wouldn't know what "iconic" means).
- ⚠️ She tries the **map filter** to find Italian near her hotel (Midtown East). Taps Midtown on the map → cuisine filter persists → 0 results. Italian doesn't have a Midtown East entry in the data.

**Score — Eat tab:** **8/10**
- Curation + must-order are genuinely better than Google Maps. Inventory thin spots show up under map filter.

**Saved tab / My Trip**
- Taps My Trip. Sees auto-built itinerary based on what she's saved (3 items so far).
- The day card shows stops by time of day. She didn't pick the days — the app guessed.
- ⚠️ **She doesn't know how to say "I'm here Thursday–Tuesday."** The Settings drawer has cuisine pickers per meal but no way to set trip dates. She thinks the auto-itinerary is wrong because it's showing one day, not four.
- Tries to drag a stop to a different day — gets the new drag UX, works.
- ⚠️ Imports section shows 62 places. She has no idea what these are. Are they recommendations? Did she add them somehow? **Highly confusing for a first-timer.**

**Score — trip building:** **5/10**
- Auto-itinerary is clever but undermined by missing "how many days?" input. The Imports section is a landmine for new users who didn't set them up.

**Polish**
- Images load now (after the 500px fix). Colors are tasteful. Type scale is consistent.
- Bottom nav: Explore / Map / Add / Tonight / My Trip. ⚠️ **Add** doesn't belong in primary nav for a first-timer — it's a power-user concept (add your own custom place). She'd never tap it. **Eat** is buried in Home only, even though it's a primary use case.

**Score — visual polish:** **8/10**

**Sarah's overall score: 6.5/10**
- The core content is strong and the mood-first navigation matches how she thinks. The friction is in trip-shape (no date input) and discoverability of features (Eat hidden, insider tips hidden, Add prominent).

---

## Persona 2 — Mike from Williamsburg, NYC resident

**Context:** 38, web designer, lives in Williamsburg 5 years. Knows the city. It's 6:45pm Tuesday in March, drizzling. Wife is out with friends, he has the evening to himself. Hates Times Square. Wants something genuine — jazz, a cocktail, maybe a book. Opens the app.

### Walk-through

**Open app → Home**
- Lands on Home. Hero shows tonight's pick. Today it's Jazz at Village Vanguard.
- **First thought:** *"That'd be nice but I've been there twice this year. What else."*
- Scrolls. Sees Mood cards. Taps **Rainy Day**.

**Score — first impression:** **7/10**
- Hero card is well-rotated. Mood is exactly the right primitive for his use case.

**Inside Rainy Day**
- Sees the schematic map + borough toggle. Manhattan: museums clustered Midtown/UES/UWS, jazz in West Village. He's in Williamsburg though.
- ⚠️ Taps **Brooklyn**. Sees Brooklyn Museum (Central BK). No jazz, no cocktails, no bookstore in Brooklyn for Rainy Day. **The whole bottom half of the screen is grey "no picks here" areas.**
- He realizes: this app is Manhattan-heavy. As a Brooklyn resident, the mood pages partially fail him.
- Switches back to Manhattan → taps West Village area. Sees Village Vanguard, Blue Note, Smalls. **He's been to all three.**

**Score — discovery for residents:** **5/10**
- Repeat visitors hit the same canonical 4-5 spots over and over. There's no "show me something I haven't seen" filter, no recently-added section, no editor's note for THIS WEEK.

**Tries Tonight tab**
- Sees the "live time" header + sticky filter chips.
- ⚠️ Filters: All, jazz, classical, theater, etc. But shows the same Tonight picks regardless. Tonight is curated weekly, not nightly. **The "tonight" framing makes him expect literally-tonight specificity (which set is playing, opening acts, lottery times) — he gets weekly editorial.**
- Taps Jazz filter. Three picks. He's been to all three.

**Score — Tonight tab for residents:** **4/10**
- Promised real-time, delivers weekly editorial. Branding mismatch.

**Tries search (gear in header looks like settings? No it's gear; search is the magnifying glass)**
- Searches "cocktail." Returns Death & Co, the Campbell. Two results.
- Searches "bookstore." Zero results. **Not in the database.**
- Searches "wine bar." Zero results.

**Score — search:** **4/10**
- Search only returns what's curated. For a resident who knows the cuisine taxonomy gaps (no wine bars, no bookstores), search confirms the holes rather than helping.

**Saved tab / My Trip**
- He doesn't have a multi-day trip. He's spending one evening.
- ⚠️ The whole My Trip experience is built for visitors. There's no "tonight only" or "next 3 hours" mode for residents who just want to know what's open right now.

**Score — utility for resident:** **3/10**

**Polish**
- Same as for Sarah — clean visuals, working images.

**Mike's overall score: 4.5/10**
- The app is built for visitors. As a resident, he discovers it has only the canonical picks he already knows. Tonight feels weekly. Search is shallow. No mode for "I have 3 hours, surprise me."

---

## Consolidated Problems

Ranked by severity (impact × likelihood of being hit):

### Tier 1 — Blocks the core flow

1. **No trip-shape input (dates / nights / arrival).** First-time visitors can't tell the app "I'm here 4 days" so the auto-itinerary collapses into one day. The Settings drawer asks about cuisine but not duration.
2. **Imported user places (62 entries) are exposed to all users including those who didn't import them.** A first-time visitor opens My Trip and sees a foldable "Imported from Google Maps — 62 places" they never imported. Very confusing. Should only appear if the user actually has imported items > 0.
3. **Add tab in primary nav doesn't earn its slot.** First-timers won't tap it. Eat tab is a primary use case but buried inside Home. **Swap them in bottom nav.**

### Tier 2 — Hides the differentiation

4. **Insider tips only render after a tap.** The single best content in the app (the bench-level Central Park tip, the High Line chaise loungers) is invisible from the topic page. Preview the first sentence on the card.
5. **Brooklyn coverage is thin in Moods.** Half the screen is grey "no picks" for residents in the outer boroughs. Mood pages need a "expanding coverage" note OR more Brooklyn picks.
6. **Tonight tab promises tonight, delivers weekly.** Either rename to "This Week" or bump it to actually nightly (which day, opening acts, lottery cutoffs).

### Tier 3 — Friction & polish

7. **Save-then-trip flow is one-tap-at-a-time.** Inside a mood area there's no "save all visible" or batch action. For Sarah building day 1, this means 8 separate taps.
8. **Search returns only curated DB.** A resident's first search ("bookstore", "wine bar") often returns zero. Either show "we don't cover bookstores yet — try Google Maps" or expand the taxonomy.
9. **No "what's new" or "recently added" affordance.** Returning users see the same picks. Editorial doesn't surface that it's been refreshed.
10. **No way to set explicit trip dates / nights.** Settings has cuisine; nothing for duration.
11. **No share-trip link.** Sarah can't text her itinerary to her husband.

---

## Suggestions (cheapest to highest impact)

### Half-day wins
- **Imported places hidden when user has no imports** (1-line conditional, biggest first-time-user clarity win).
- **Insider tip preview on venue cards** (split tip on first sentence, render as italic line under character preview).
- **Rename Tonight → This Week** (single edit, fixes expectation mismatch).
- **Swap Add ↔ Eat in bottom nav** (config change, dramatic first-impression improvement).

### 1–2 day builds
- **Trip date picker** in Trip Settings drawer. Number of days + arrival date → auto-itinerary respects bounds.
- **"Save area to trip"** button at the top of each mood-area picks panel.
- **Search fallback message** when 0 results: *"NYC Stoop hasn't curated this yet. Try Google Maps for now."*
- **Recently added / Editor's note** ribbon on Home for returning users (compare nyc_lastSeenAt with editorial.updatedAt).

### 3–5 day builds
- **Trip share link** (`/t/<base64-ids>` → read-only view). Highest viral ROI.
- **Brooklyn editorial expansion** — at least 8 more curated picks across moods.
- **Tonight-tonight feed** — actually scraped/curated nightly listings, not weekly editorial. Big content cost.
- **Multi-mood combine** ("Date night + Rainy day" = indoor date filter).

---

## Final scores

| Persona | First impression | Discovery | Content depth | Trip / Tonight | Polish | **Overall** |
|---|---|---|---|---|---|---|
| **Sarah** (first-timer) | 5 | 7 | 8 | 5 | 8 | **6.5/10** |
| **Mike** (resident) | 7 | 5 | 7 | 3 | 8 | **4.5/10** |

**Combined avg: 5.5/10.** Strong content, novel mood-first nav. Friction lives at: (a) imported-places clutter for new users, (b) no trip-shape input, (c) Tonight-vs-weekly mismatch, (d) insider tips hidden one tap too deep. None of these is hard to fix — half of them are 1-hour changes.
