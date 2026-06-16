# NYC Stoop — Feature Gap Analysis

**Date:** 2026-06-12
**Sister doc:** `UX_REVIEW_V2.md` (covers polish & friction). This doc covers *whole categories of functionality you don't have yet*.

I went through the deployed app at nyc-stoop.vercel.app and the source. Below is what's strategically missing, in priority order, with honest assessments of effort, dependencies, and whether each one is worth building given the app's positioning ("a curated guide that turns into a trip").

---

## 1. The strategic frame

NYC Stoop has three real strengths today:

1. **Editorial voice + insider tips** — the bench-level Central Park tip, the High Line chaise loungers. Genuinely better than Google Maps.
2. **Mood-first discovery** — a primitive that matches how visitors actually think.
3. **One-tap trip building** — saves → days → share, all in-app.

Every feature gap below should be evaluated against whether it *amplifies* those strengths or dilutes them. A booking integration amplifies (someone saw your editorial, now they book). A user-review system dilutes (your editorial voice gets drowned in the noise that Google already has).

I'll call out **build vs. don't-build** for each.

---

## 2. Tier A — Category-changing gaps

These are the features that would change *what kind of app this is*. Building all four moves NYC Stoop from "a curated guide" to "the app NYC visitors use end-to-end."

### A1. Open Now + Live Hours awareness 🟢 BUILD

**What's missing.** The app shows `dateNote: "Tonight · 8pm doors"` but has no concept of *right now*. If it's 9pm on Christmas Eve and a museum is closed, you'd never know.

**Why it matters.** Every visitor opens this app in transit, asking "what's open near me right this minute." Without it the app is a wishlist, not a guide.

**What to build.**
- `hours: { mon: [9,17], tue: [9,17], ... wed: 'closed', sun: [10,18] }` field on every venue + sight + restaurant.
- An "Open now" filter that lights up on Eat, Mood pages, and This Week.
- "Closes in 47 min" badges on cards once you're within 90 min of close.

**Effort.** Schema 2 hrs. Editorial backfill across ~80 venues + 19 restaurants: 4-6 hrs of data entry. UI 1 day. **Total ~2 days.**

**Dependencies.** None.

### A2. Real booking + reservation handoff 🟢 BUILD

**What's missing.** Cards say "Book ahead" but there's no button to actually book. Carbone shows "Notoriously hard" but no link to Resy.

**Why it matters.** This is the single highest-conversion feature for a guide app. Users see a great pick, they want to act *now*. The drop-off when they have to context-switch to another app is brutal.

**What to build (in order of effort).**
- **Cheapest:** add `reservationUrl` (Resy/OpenTable/SevenRooms direct deep-link) to each restaurant. Render a `Book on Resy →` button. ~3 hrs.
- **Middle:** TodayTix / Telecharge deep-links on Broadway works (you already have the work-to-venue mapping). ~4 hrs.
- **Pro:** OpenTable affiliate API embedded availability widget — but that's months and probably not worth it. Skip.

**Effort.** **Cheap version: half a day.** Just the deep-link buttons get you 90% of the value.

### A3. Subway / transit directions 🟢 BUILD

**What's missing.** The app has a Map tab but no way to get from where-you-are to where-you-want-to-be. Travel-time hints on PlanScreen days are static estimates, not real transit times.

**Why it matters.** Every first-time visitor in NYC has a subway problem. Knowing "MoMA to Carnegie is a 7-minute walk" beats opening Google Maps and losing your place.

**What to build.**
- A "Directions" button on every VenueScreen that opens Citymapper / Google Maps with the destination pre-filled. ~30 min.
- *Better:* render the next 3-4 subway options inline (line + station + minutes) using MTA's free GTFS-RT feed. ~3 days.
- **Best for v1:** the deep-link version. Adds value immediately, no MTA API ops to babysit.

### A4. Account sync across devices 🟢 BUILD (finish what's started)

**What's missing.** The backend has auth endpoints, the frontend has AuthModal/ForgotPassword/Reset, but **saves still live in `localStorage`** (App.jsx:11294). A user who signs in on their iPad and then opens the app on their phone sees an empty Saved tab. Every Trip lives only on the device that built it.

**Why it matters.** This is the single biggest hidden disappointment in the app today. Auth UI sets the expectation that sign-in does something; right now it doesn't. Travelers carry multiple devices.

**What to build.**
- When `currentUser !== null`, route `savedItems`, `userVenues`, `nyc_plan_sel`, `nyc_trip_days`, `nyc_trip_start_date`, `nyc_meal_cuisines` through your backend.
- Conflict resolution: last-write-wins is fine for v1.
- A "Cloud sync" badge in Settings so the user knows it's happening.

**Effort.** ~2 days. The backend likely just needs `GET/PUT /me/saves` endpoints and a frontend `syncSaves` hook.

---

## 3. Tier B — Table-stakes for a travel app

These don't redefine the app but are missing features that travel apps generally have. Skipping them puts you at a credibility deficit vs. competitors.

### B1. Weather-awareness 🟢 BUILD (small)

**What's missing.** Tomorrow shows rain — your itinerary still sends the family to Bryant Park.

**What to build.** OpenWeather free tier API call per trip day → small weather chip on each day header ("Tue · 65° rain"). When rain is forecast, surface a banner: *"Day 3 looks rainy — want to swap outdoor stops for the Rainy Day mood picks?"*. Effort: ~1 day.

### B2. PWA / Add to Home Screen + offline reads 🟢 BUILD

**What's missing.** The `index.html` has iOS PWA meta tags but no `manifest.webmanifest`, no app icons, no service worker. Tourists with bad international roaming can't reopen the app to consult their saved trip.

**What to build.**
- `manifest.webmanifest` with name, icons (192/512), `display: 'standalone'`, theme color.
- Vite PWA plugin (`vite-plugin-pwa`) for the service worker — caches the JS bundle + saved venue data so a downloaded trip works offline.
- An iOS-only "Tap share → Add to Home Screen" tooltip the first time a user opens the app on Safari.

**Effort.** ~half a day.

### B3. Multiple trips + trip history 🟡 PARTIAL BUILD

**What's missing.** There's only one Trip at a time. A traveler who comes back next year sees their previous itinerary and has to nuke it to plan the new one.

**What to build.** A `trips: Record<tripId, Trip>` model. Settings → "Trips" lists all of them, "New trip" creates a fresh draft. The Share URL already encodes a trip independently, so the data model is half there.

**Effort.** ~1 day.

### B4. Calendar / `.ics` export 🟢 BUILD (small)

**What's missing.** No way to push the built itinerary into Apple Calendar / Google Calendar.

**What to build.** A "Download .ics" button on PlanScreen. Each stop is one event with location, link back to NYC Stoop, and your editorial note as description. Pure client-side — no API needed.

**Effort.** ~3 hrs.

### B5. Push reminders 🟡 MAYBE (defer)

**What's missing.** No "your Carbone reservation is in 90 min."

**What to build.** Web Push API for installed PWA users. Browser permission, schedule notifications from the trip data.

**Effort.** ~2 days. **But:** web push has terrible compliance rates and iOS support is recent (16.4+). Defer until A1–A4 are done.

---

## 4. Tier C — Content & data gaps

These are not code features — they're data the app needs to feel useful.

### C1. Dietary metadata on restaurants 🟢 BUILD

Already flagged in UX_REVIEW_V2.md as **Blocker B2**. Vegetarian/vegan/kosher/halal/gluten-free. Every restaurant in `content.js` (19 rows) needs `dietary: string[]`. Filter row on Eat above Vibe.

### C2. Accessibility metadata 🟢 BUILD

**What's missing.** No wheelchair-accessible flag. No "step-free entrance." No sensory-friendly hours flag. No "service dogs welcome" flag.

**Why it matters.** An app that doesn't have accessibility data effectively excludes wheelchair users, families with strollers, and visitors with sensory sensitivities. It's also discoverable by media — accessibility-aware travel apps get press.

**What to build.** `access: { stepFree, wheelchairRestroom, audioLoop, sensoryFriendly }` per venue. One Accessibility filter on Mood and Eat pages. A "Filter for accessibility" toggle in Settings that becomes persistent.

**Effort.** Schema is trivial. Editorial backfill is the long pole — 5 hrs for the ~80 curated venues.

### C3. Kid-readiness metadata 🟢 BUILD

Per Priya's persona: no `minAge`, no `strollerFriendly`, no `restroomsAvailable`, no `expectedDuration` on family-shaped picks. Add `forKids: { minAge: 5, strollerFriendly: true, durationMin: 60, restrooms: true }` on each Family-day pick. ~3 hrs schema + 4 hrs backfill.

### C4. Photo galleries (3-6 per venue) 🟡 MAYBE

**What's missing.** Each venue has one hero image. Visitors looking at the Met want to see what's *inside* — galleries, the Temple of Dendur, the Egyptian wing.

**What to build.** Optional `photos: [{ src, alt, credit }]` array per venue. Swipeable gallery on VenueScreen.

**Effort.** ~1 day code + significant photo sourcing time. **Defer** unless you find a CC-licensed source that does most of the work (Wikimedia categories per venue).

### C5. Other boroughs (Queens, Bronx, Staten Island) 🟡 SOON, not yet

You stubbed these as Coming Soon (task #118). Queens is the highest priority — Astoria food scene, MoMA PS1, Flushing Meadows. ~12 picks across 3-4 moods. Schedule for after Tier 4 polish.

### C6. Live event listings (real tonight, not weekly editorial) 🔴 SKIP unless you commit to ops

Already flagged in v1 as Mike's #1 pain point. The honest answer: this requires *continuous editorial labor or a content partnership* (TimeOut, BroadwayWorld, etc.). Building the UI is cheap; keeping the data fresh is the real cost. **Don't build this unless you have someone signing up to keep it current.**

---

## 5. Tier D — Power features (lower priority but reasonable backlog)

| Feature | Build? | One-line why |
|---|---|---|
| Trip templates ("Perfect first 3 days", "Brooklyn weekend", "Rainy Saturday") | 🟢 | High discovery value, low effort — just curated `savedItems` blobs |
| Trip pace setting (relaxed / standard / packed) | 🟢 | Family persona blocker — see UX review M5 |
| Per-day walking miles + cost roll-up | 🟢 | Cheap; uses data you already have |
| Photo upload / trip journal (post-trip) | 🔴 | Out of scope for this app's positioning; punts users to Instagram |
| Reviews / community ratings | 🔴 | Dilutes editorial voice; Google already does this |
| Audio walking tours | 🟡 | Beautiful but expensive editorial; only if you're committing to it |
| Apple Wallet ticket storage | 🔴 | Skip — partners do this better |
| In-app translation | 🟡 | Spanish/Chinese first; auto-translate via API is acceptable, but lose editorial nuance |
| AI itinerary generator ("plan me 3 days") | 🟡 | Could work given your curated dataset, but it's a different product. Defer |
| Saved-trips marketplace ("Steve's perfect 3 days" → publish) | 🟡 | Interesting moat play but a months-long build |
| Crowd density / wait times | 🔴 | Data is hard to get and goes stale fast |
| Cash-only flag, tipping calculator | 🟡 | Cheap but small lift; nice-to-have |
| Photo opportunities / IG-spots | 🔴 | Off-brand; encourages the wrong behavior on the High Line, etc. |

---

## 6. Recommended build order (next ~3 weeks)

The smart sequence isn't "build everything in Tier A." Some of these unlock the others.

**Week 1 — Foundation**
1. **A1 Open Now + Hours** (2 days) — every other recommendation depends on knowing this.
2. **B2 PWA + Offline** (half day) — uplift to "real app" status, prerequisite for B5 push.
3. **C1 Dietary filters** (1 day data) + **C2 Accessibility filters** (1 day data) — unblocks Priya's blocker.

**Week 2 — Conversion**
4. **A2 Reservation deep-links** (half day) — biggest revenue/credibility lever.
5. **A3 Subway directions deep-links** (half day) — biggest visitor pain killer.
6. **B1 Weather-awareness** (1 day) — Sarah/Mike use case.
7. **B4 .ics export** (3 hrs) — closes the trip-handoff loop.

**Week 3 — Multi-device + history**
8. **A4 Account sync** (2 days) — finishes the half-built auth flow.
9. **B3 Multiple trips** (1 day) — assumes sync is in place.
10. **D-trip-templates** (1 day) — the editorial trip drafts you'd want to publish anyway.

After three weeks of this you have a product that genuinely competes with Google Maps + Resy + Citymapper for the *what to do tonight in NYC* job. Tier 4 UX polish (from the audit) can be threaded in between as small fixes.

---

## 7. What I'd consciously NOT build

A few things look tempting but would hurt the app:

- **User reviews / community ratings.** Your moat is editorial voice. Letting users review dilutes that. Google already does this.
- **Photo upload by users.** Encourages content competition with your editorial photos and creates moderation cost.
- **Hotel booking.** Different app entirely. Punt to Booking.com.
- **Real-time event scraping without an editor on staff.** The data goes stale instantly. Mike's resident persona scoring well on the v1 issue (Tonight-vs-weekly) is now solved by the *rename* — actually delivering nightly listings would require constant labor.
- **Affiliate-link everywhere.** A little bit (Resy, TodayTix) reads as helpful; a lot reads as sleazy and breaks trust with the editorial voice.

---

## Summary table — high-ROI features missing today

| ID | Feature | Build effort | Strategic payoff |
|---|---|---|---|
| A1 | Open Now / Hours awareness | 2 days | 🔥 Essential |
| A2 | Reservation deep-links (Resy/OpenTable) | half day | 🔥 Highest conversion lever |
| A3 | Subway directions (deep-links to Citymapper / GMaps) | half day | 🔥 Biggest visitor pain killer |
| A4 | Account sync across devices | 2 days | 🔥 Finishes a half-built feature |
| B1 | Weather-awareness on trip days | 1 day | High |
| B2 | PWA + offline reads | half day | High |
| B3 | Multiple trips + history | 1 day | Medium |
| B4 | `.ics` calendar export | 3 hrs | Medium-high |
| C1 | Dietary filters on restaurants | 1 day | Family/dietary blocker |
| C2 | Accessibility metadata | 2 days | Accessibility blocker + press hook |
| C3 | Kid-readiness metadata | 1 day | Family persona unblock |
| D | Trip templates | 1 day | High discovery value |

That's ~13 build-days of work for a product that becomes meaningfully more competitive. The other items in the doc are reasonable later but not the highest leverage.

End of feature gap analysis.
