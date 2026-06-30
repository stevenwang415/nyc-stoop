# "Where to eat" — improvement suggestions (2026-06-29)

_Re-reviewed EatScreen against the current build. The 2026-06-24 plan (unify to
~300 restaurants) is **done** — breadth is solved. These suggestions are about the
next layer: depth, scannability, and speed-to-decision._

## What's already good (keep)

- ~300 restaurants (editorial + curated + imports), deduped and normalized.
- Rich multi-filter: cuisine (top 12 + More), price, neighborhood, vibe, meal,
  dietary, schematic borough map, "Near me," walk-in.
- Clean result cards (cuisine · price · ★rating · neighborhood, must-order, booking
  badge) and a short-by-default list with "See N more."

---

## Suggestions, in priority order

### 1. Give non-editorial restaurants an in-app detail sheet (must-fix) ⭐
**Now:** only the ~19 editorial venues open a real page; the other ~280 do
`window.open(Google Maps)` — they kick the user out of the app. After everything we
just did to *stop* events dumping to Google, the eat tab still does it for 90% of
cards.
**Fix:** a lightweight bottom-sheet for curated/import restaurants — name, cuisine,
price, ★rating, neighborhood, must-order (if any), a photo, and two buttons
(Directions + Reserve/Website when present). Let it "Add to My Trip" like events.
**Why:** turns 280 dead-ends into real, saveable picks. Highest leverage on the tab.

### 2. Put a photo on each result card (should-fix) ⭐
**Now:** cards are emoji + text only, while the events tabs are rich photo cards —
the eat tab looks the least finished by comparison.
**Fix:** add a thumbnail. Imports already carry Google photos; editorial have
`venueImages`; everything else can use the same location-image fallback we just
built for events. One small change, big scannability/delight lift.

### 3. Add a sort control — Recommended / Top rated / Nearest (should-fix)
**Now:** sort is fixed (editorial first, then raw Google rating). After "Near me"
there's no way to actually order by distance, and raw rating floats a 5.0-with-
12-reviews above a 4.6-with-4,000.
**Fix:** a 3-way sort toggle. Default "Recommended"; enable "Nearest" once location
is known; for "Top rated," weight by review count so trustworthy ratings win.

### 4. Add an "Open now" toggle (should-fix)
**Now:** no time awareness — but "where to eat" is usually a *right now* question.
Imports carry `hours`.
**Fix:** an "Open now" chip that filters on hours where available (gracefully keeps
places with unknown hours, labeled). Pairs naturally with "Near me."

### 5. Lead with quick collections instead of a filter wall (should-fix)
**Now:** the screen opens with heavy filtering UI before any answer.
**Fix:** a row of one-tap editorial collections at the top — "Date night," "Cheap
eats," "Open late," "Best near you," "Iconic NYC." Each is a pre-baked filter query,
so a user gets a great shortlist without assembling one. Faster decision, less work.

### 6. Fix the vibe/meal/dietary filters' silent collapse (polish)
**Now:** those tags live only on the ~19 editorial venues, so turning on "date
night" or "vegan" quietly drops ~280 restaurants. The screen even warns about it.
**Fix:** infer light tags for imports where safe (price 4 → splurge; bar → drinks/
late-night; café/bakery → breakfast/brunch), OR group these under a labeled
"Editorial picks only" section so the collapse isn't a surprise.

### 7. Surface cuisine sub-tags (polish)
Sushi/Ramen under Japanese, etc. — small discoverability win noted back on 06-24.

---

## Recommended for *today*

**Do #1 + #2 together** — the in-app detail sheet plus card thumbnails. They share
the same plumbing (a restaurant object → a sheet/photo), they remove the tab's
biggest weakness (Google dead-ends) and its most visible one (text-only cards), and
they make all ~300 restaurants feel like first-class, saveable picks rather than a
list that punts you to Maps. #3–#5 are the strong follow-ups once detail exists.
