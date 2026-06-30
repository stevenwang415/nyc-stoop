# Add places database (from a CSV)

Same pipeline as **Add food database.md**, generalized to *any* kind of place —
parks, museums, gardens, landmarks, bars, shops — not just restaurants. Turns an
uploaded list (name + Google Maps link) into real entries in the app's place
database so they show up in the right activity and the right neighborhood.

## Input

A CSV with a **Title** (place name) and a Google Maps **URL** (which embeds a place
id `0x…:0x…`). Other columns may be empty. The list can mix categories and cities.

## Rules

1. **Coverage:** the app's neighborhood filter only knows **Manhattan, Brooklyn,
   Queens** (Bronx/Staten Island are "coming soon"). A place outside those still gets
   added to the database (searchable, shows under "Anywhere"), but it won't appear
   under a Manhattan/Brooklyn/Queens **area filter** unless its coordinates fall in
   that area's box. We never fake coordinates to force a place into an area.
2. **De-dupe** by name + location; drop junk and permanently-closed places.
3. **Each place needs:** name, **category** (drives which activity it shows under),
   neighborhood, borough, full address, **coordinates (lat/lng)**, hours if it has
   them, and the Google place id + maps URL from the CSV.

## Category — the one extra step vs. the food import

Food is always `category:"food"`. A general place must be **classified** so it lands
in the right activity lens:

| Place kind | `category` | shows under |
|---|---|---|
| restaurant | `food` | Eat |
| café / bakery | `coffee` | Coffee |
| bar / cocktail | `drinks` | Drinks |
| live music / theater room | `music` | Live |
| museum / gallery / landmark | `culture` | Culture |
| park / garden / waterfront / walk | `outdoors` | Outdoors |
| shop | `shopping` | catalog only |

Infer from the name and the Google place type (e.g. "…Park" → outdoors, "…Museum" →
culture, "…Garden" → outdoors). When unsure, leave `place`.

## How we get the details

Google's key is browser-restricted (no server-side Places), so:

- **Location (address + lat/lng + borough/neighborhood):** geocode each name via
  OpenStreetMap **Nominatim** (no key, ≤1 req/sec, real User-Agent). The returned
  coordinates are what the app uses to slot a place into a neighborhood — so getting
  these right is what makes "I click Uptown and see it" work.
- **Hours:** OSM `extratags.opening_hours` where present → app pipe format
  (`Monday: 8:00 AM – 4:00 PM | …`); else `""`.
- **Price:** parks/free sights → `null`; paid attractions → leave `null` unless a
  clear tier is known; food/drink → `$`-tier.

## Target schema (`src/data/places.js` → `seedUserPlaces`)

Same object shape as the food import (it merges into `userVenues` on first run and
flows into the activity flows + neighborhood views). The only differences are
`category` (classified per the table above) and `cuisine` (omit or `[]` for
non-food).

```js
{
  id: "seed_<slug>", name: "Fort Tryon Park", category: "outdoors", cuisine: [],
  price: null, neighborhood: "Washington Heights", area: "",
  lat: 40.8628, lng: -73.9320, address: "Fort Tryon Park, Manhattan, NY",
  hours: "", rating: null,
  website: "", googleSummary: "", description: "", insiderTip: "",
  source: "csv_import", isCustom: true,
  googlePlaceId: "0x…:0x…", sourceUrl: "https://www.google.com/maps/place/…",
  enrichedAt: "2026-06-30",
}
```

## "I want to see them under Uptown"

A place shows under **Uptown** when its coordinates classify to the app's `uptown`
area (upper Manhattan: Harlem · Morningside · Washington Heights · Inwood). So:
- Upper-Manhattan places (Morningside Park, Inwood Hill Park, Fort Tryon Park) → land
  in Uptown automatically once geocoded.
- **Bronx** places (the Bronx Museum, NY Botanical Garden) are *not* in Manhattan —
  the app has no Bronx area yet, so they're added & searchable but won't appear under
  the Manhattan "Uptown" filter. (Flagged, not silently forced.)

## Steps

1. Parse CSV → `[name, placeId, url]`.
2. Geocode (Nominatim) → address, lat/lng, borough, neighborhood.
3. Classify `category`; de-dupe; drop junk.
4. Enrich hours; set price.
5. Emit `seedUserPlaces` objects, append to `src/data/places.js`.
6. `vite build`; confirm each place classifies to the expected neighborhood/activity.
