# Add food database (from a CSV)

How we turn an uploaded list of places (like `Bagelsss.csv`) into real entries in the
app's recommendation database. Written for the bagels import, but reusable for any
future food CSV.

## Input

A CSV with at least a **Title** (shop name) and a Google Maps **URL** (which embeds a
place id like `0x89c2…:0x…`). The other columns (Note, Tags, Comment) may be empty.
The list is messy: it mixes cities (NYC, Boston, Philadelphia, LA…) and has duplicate
rows and non-restaurant entries.

## Rules

1. **NYC only — Manhattan, Brooklyn, Queens.** Drop everything else (Boston, Philly,
   LA, the Bronx, Staten Island, suburbs). We verify the borough from the resolved
   address, not from the name.
2. **De-dupe** by name + location (the CSV has repeats, e.g. two "Greenberg's",
   two "Apollo Bagels").
3. **Drop non-shops / junk** (e.g. a foreign-language patisserie listing that isn't a
   NYC bagel shop).
4. **Each kept shop must have the details a card needs:** name, neighborhood, borough,
   full address, **coordinates (lat/lng)**, **hours**, **price range**, plus the
   Google place id + maps URL carried over from the CSV.

## How we get the details

The app's Google key is browser-restricted, so server-side Places calls are blocked.
Instead:

- **Location (address + lat/lng + borough):** geocode each name via OpenStreetMap
  **Nominatim** (`nominatim.openstreetmap.org/search`, no key, ≤1 req/sec, real
  User-Agent). Keep a result only if its address resolves to **New York, NY** with
  borough **Manhattan / Brooklyn / Queens**. This single step both locates and filters.
- **Hours:** from OSM `extratags.opening_hours` where present; otherwise a quick web
  lookup of the shop's current hours. Stored in the app's pipe format:
  `Monday: 6:00 AM – 4:00 PM | Tuesday: … | …`. If genuinely unknown, leave `""` (the
  app shows the card fine and the open/closed badge falls back to "unknown").
- **Price:** bagel shops are inexpensive → **`1` ($, under ~$15)** unless a source
  clearly says otherwise.
- **Rating:** carried only if we have a trustworthy source; else `null`.

## Target schema (matches `src/data/places.js` → `seedUserPlaces`)

Each kept shop becomes one object appended to `seedUserPlaces` (it merges into
`userVenues` on first run, so it flows into **both** the Eat tab and the activity-flow
recommendations). `category: "food"` is what puts it in "Where to eat".

```js
{
  id: "seed_<slug>",            // stable, unique → idempotent re-import
  name: "Ess-a-Bagel",
  category: "food",             // food → Eat tab + the "Eat" activity
  cuisine: ["bagel", "bakery"], // bagel shows as a label; bakery maps to a pill
  price: 1,                     // $  (1–4 | null)
  neighborhood: "Midtown East",
  area: "",
  lat: 40.7486, lng: -73.9893, // REQUIRED — Eat needs a numeric lat, drives borough
  address: "108 W 32nd St, New York, NY 10001",
  hours: "Monday: 6:00 AM – 4:00 PM | … | Sunday: 6:00 AM – 5:00 PM",
  rating: null,
  website: "",
  googleSummary: "", description: "", insiderTip: "",   // editorial — left blank
  source: "csv_import", isCustom: true,
  googlePlaceId: "0x89c259…:0x…",     // from the CSV URL
  sourceUrl: "https://www.google.com/maps/place/…",  // from the CSV
  enrichedAt: "2026-06-30",
}
```

## Steps

1. Parse the CSV → `[name, googlePlaceId, sourceUrl]` per non-empty row.
2. Geocode each via Nominatim → address, lat/lng, borough, neighborhood.
3. **Filter** to Manhattan/Brooklyn/Queens; **de-dupe**; drop junk/closed.
4. Enrich hours (OSM/web) + set price `1`.
5. Emit one `seedUserPlaces` object per kept shop and append to `src/data/places.js`.
6. `vite build` and confirm the shops appear in the Eat tab (cuisine "Bagel"/"Bakery")
   and in the "Eat" activity picks.

## Notes / honesty

- Coordinates and borough are deterministic (geocoded), so the NYC filter is reliable.
- Hours are best-effort and can drift; the app degrades gracefully when a value is
  missing. Price is set by category (bagels = `$`), not per-shop menus.
