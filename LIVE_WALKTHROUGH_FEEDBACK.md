# NYC Stoop — Live App Walkthrough Feedback

**Date:** 2026-06-14
**Method:** Driven through nyc-stoop.vercel.app via Chrome at 430×900 mobile width, starting from cleared localStorage (fresh-user simulation). Findings are from the *deployed bundle*, not the source code on your laptop.

---

## What's deployed vs. what's still on your laptop

Important context. The deployed bundle is commit `0588626` ("Light photo-forward redesign + top-10 review fixes"). Most of the Tier 1–3 roadmap IS live:

| Feature | Deployed? |
|---|---|
| T1.1 Hide imports section when empty | Probably ✅ (couldn't fully verify without auth) |
| T1.2 Swap Add ↔ Eat in bottom nav | ✅ Eat is in slot 3 |
| T1.3 Insider tip preview on cards | ❌ Not visible on mood-page cards |
| T1.4 Rename Tonight → This Week | ❌ Page title still "Tonight," nav still "Tonight" |
| T2.5 Trip date picker | Not tested |
| T2.6 Save area to trip batch | ✅ Working — "+ Save all 3 to trip" button live |
| T2.7 Search zero-results fallback | Not tested |
| T2.8 What's new ribbon | ✅ (suppressed on fresh visit — correct) |
| T3.9 Trip share link | Not tested |
| T3.10 Brooklyn expansion | ✅ Date night has 1 Brooklyn pick (still thin) |
| T3.11 Multi-mood combine | ✅ Works beautifully — counts update |
| T3.12 Day-of-week tabs | ✅ Works, plus bestDays editorial copy ("dark Mondays") |
| ★ "matches multiple" badge on combined picks | ❌ Not visible — most recent edit not pushed |

**Push your latest commit to get T1.3 (insider tips), T1.4 (rename), and the ★ badge live.** Those are the only meaningful gaps.

---

## Screen-by-screen feedback (live as a user)

### Onboarding (3 slides)

🚨 **Slide 1 title is "Discover what's on, tonight in New York."** The strong word *tonight* contradicts the multi-day trip planner the app actually is. A family with a 5-day plan reads this and thinks "wrong app."

🔧 **Slide 2 copy says "Tap the pink heart"** but the saved-state heart is red (`#dc2626`). Tiny inconsistency.

🔧 **Slide 3 doesn't speak to group shape.** *"Turn saves into a smart itinerary"* lands fine for solo, but Priya the family planner gets nothing affirming she's welcome.

Pick one for each slide:
- Slide 1 → *"Discover what's on in New York — this week and beyond."*
- Slide 2 → change "pink" to "red" or just drop the color word
- Slide 3 → *"Whether you're solo, on a date, or wrangling kids, we shape the trip to fit."*

### Home / Explore

🚨 **Section heading "Your Night-Out Inspiration."** Same problem as slide 1 — the framing is narrower than the app's reach. The hero might be a jazz club tonight but the moods below include Family Day, First Time NYC, daytime parks. *"This Week in NYC"* (which is what your source code says) is the better label — once you push it.

✅ **Hero card is the visual peak of the app.** Village Vanguard photo, "NYC Editors / refreshed weekly" pill, dateNote bubble, save heart, "Read about jazz →" learn-bridge. Genuinely beautiful and trustworthy.

✅ **"What kind of day?" mood scroller is well-paced.** Eat leads as a red plate; then Just chilling, Date night, Family day, First time. Right primitive for first-time visitors.

✅ **"Browse by Topics / Neighborhoods"** toggle is clean. Two-column grid of topic chips with counts (Visual Art 6, Jazz 5, etc.).

🔧 **No visible Settings gear.** I see a profile avatar circle top-right, but no quick path to trip dates. Settings discovery is buried — users who want to set "I'm here Thu–Mon" can't find it without taping the avatar.

🔧 **Top-left there's a small grid icon** I couldn't immediately decode. If it's a menu, it could be labeled better.

### Mood page (tested Date Night)

✅ **This is the strongest screen in the app.** Top hero block in mood color, blurb, stat line. Below: combine-with chips, borough toggle, schematic SVG map with pick counts, Leaflet reference map, picks-area card with batch-save button, sub-categories of picks. Coherent and original.

✅ **Combine-with works.** Tapping "Rainy day" updated the stat line to "34 PICKS · COMBINED WITH 1 MORE MOOD" and lit up more zones on the schematic map. Counts updated everywhere. This is genuinely something Google Maps can't do.

✅ **Tap-to-filter on the schematic map is delightful.** West Village → Leaflet zooms, picks card materializes, "Save all 3 to trip" is one tap away.

✅ **Sub-categories work** ("Dinner spots / Live jazz / Cocktail bars" under Date Night). Editorial chunking helps scan.

🚨 **Insider tip preview is missing on mood cards.** Carbone, Smalls, Death & Co all show description but no italic insider line. T1.3 isn't live, and this is your headline editorial differentiator — most worth pushing soon.

🔧 **"TAP AN AREA TO SEE PICKS"** is small uppercase grey caps. Easy to miss. A first-time user might not realize the schematic is interactive. Try a soft pulse animation on first render, or a more prominent label.

🔧 **★ multi-mood badge not visible.** When I combined Date Night + Rainy Day, no card showed a "matches 2 moods" star. The chip row works but the per-card signal is missing.

🔧 **Brooklyn thin spots.** Date Night = 1 Brooklyn pick. The Tier 3 expansion helped but the imbalance is still glaring for residents.

🔧 **"Lincoln Sq" and "C.P." schematic labels show without pick counts** — visually ambiguous. Either hide them when 0 picks or show "0".

### This Week / Tonight tab

✅ **The day-of-week strip is a hit.** "WHAT'S ON WHICH NIGHT" with Today / Tomorrow / Tue (8 on) / Wed (8 on) / Thu (8 on) / Fri (9 on) — exactly what a planner needs. Tapping a day filters picks live.

✅ **bestDays editorial is correct.** Hamilton card reads "Tue–Sun · 7pm curtain (dark Mondays)" — the schedule honesty lands well.

✅ **Section grouping (Evening / Late night / Daytime / In season) with editorial count copy** is the kind of detail that earns trust.

✅ **Card design is the cleanest in the app.** Uniform 132px height, thumbnail or domain-color gradient, JAZZ/THEATER colored badge, dateNote in blue, venue name + metadata row. Photo cards (Vanguard) look exceptional.

🚨 **Page title and bottom nav still say "Tonight."** With day-of-week tabs that can preview Friday, the "Tonight" label is in active contradiction with the feature. Push T1.4.

🔧 **Smalls Jazz Club card shows an orange gradient placeholder** instead of the actual Smalls photo. Quick asset path check.

🔧 **No empty state tested** because today has 7 picks — but if a user picks Monday and Federal Hall (weekdays-only) is the only match, the empty state I wrote (with Reset button) needs verification.

🔧 **Day strip not sticky.** When scrolling through 7 picks the day strip scrolls away while the chip row stays. Inconsistent stickiness.

### Eat tab (saw the card in Home scroller, did not enter)

✅ **Eat card lives in the mood scroller** with a red plate icon and subtitle "Cuisine · price · area". Right place for it.

(I'll continue this section after pushing the latest code — there are more recent Eat tab improvements that may not be live.)

### My Trip (Saved)

Not tested in this session — would need to save some picks first to see auto-itinerary, then test trip share, drag-reorder, etc.

### Auth / Sign-in

Backend just came online. Tested earlier — `/health` returns the expected JSON. Sign-in flow wasn't tested end-to-end in the browser, but the previous session confirmed `VITE_API_URL` had been set on Vercel (assuming you did redeploy after we discussed it).

---

## Ranked findings

### 🚨 Push these first (one git push fixes all three)

1. **T1.4: Rename "Tonight" → "This Week"** — single text replace, but undoes a deep brand contradiction with the day-of-week feature.
2. **T1.3: Insider tip preview on mood cards** — your single biggest editorial differentiator is hidden behind a tap.
3. **★ "matches multiple" badge on combined picks** — adds payoff to the T3.11 combine feature.

These are already in your laptop's App.jsx — they just haven't been committed to GitHub yet. One `git add src/App.jsx && git commit -m "..." && git push` and they go live within a couple of minutes (Vercel auto-rebuilds).

### ⚠️ Worth fixing in the next short pass

4. **Onboarding slide 1 framing** — replace "tonight in New York" with multi-day language.
5. **Home section header "Your Night-Out Inspiration"** — see "Tonight in NYC" tension. Better: just "This Week in NYC."
6. **Smalls card image asset** — orange gradient instead of the photo on the This Week tab.
7. **"TAP AN AREA"** prompt visibility on schematic map.
8. **Day strip stickiness** on This Week tab.

### 🔧 Polish backlog

9. Onboarding slide 2: red not pink.
10. Onboarding slide 3: family / solo / couple framing.
11. Settings discoverability — gear icon on Home, not just profile avatar.
12. Schematic map zones with 0 picks (Lincoln Sq, C.P.) — hide or zero-label.

---

## Bottom line

The deployed app is **already strong**. The mood map flow, combine-moods semantics, the This Week day-of-week strip, the hero card — these are all working as designed and reading well to a fresh user. The notable gaps are:

- **Three quick edits sitting on your laptop, not yet pushed** — T1.3, T1.4, and the ★ badge. Push these and you immediately close the highest-impact items.
- **Two framing copy fixes** (onboarding slide 1, Home section heading) that contradict the multi-day trip-planner that the app actually is.

Net: the bones are in great shape. Most of what's blocking the next score bump is sitting in a working tree, waiting for `git push`.
