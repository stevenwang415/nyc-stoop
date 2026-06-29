# Image fallback

**No event card should ever be a bare placeholder.** When an event has no photo of
its own, show a recognizable photo of **where it happens** — its landmark / park /
square / neighborhood, and if we don't recognize the place, its **borough**, and as a
last resort a generic NYC skyline.

## The case that triggered this

The Union Square Greenmarket card had no image, so it rendered the ✨ gradient
placeholder. It *should* show a photo of **Union Square** — the location is the obvious
stand-in image. Same for every other image-less card.

## The rule (tiered)

For each event, resolve an image in this priority order:

1. **The event's own photo** (`e.image`) — Ticketmaster art, etc.  *(tier 2)*
2. **A matched place photo** — if the event's location text contains a known
   venue/landmark/park/square/neighborhood, use that place's photo
   (e.g. "Union Square Park: North Plaza" → Union Square; "…Bryant Park…" → Bryant
   Park; "Central Park…" → Central Park).  *(tier 1)*
3. **The borough** — Manhattan / Brooklyn / Queens / The Bronx / Staten Island each
   have a representative photo.  *(tier 0)*
4. **Generic NYC skyline** — only if borough is unknown.  *(tier 0)*

Matching is case-insensitive, punctuation-stripped, **longest keyword first** so the
specific landmark wins over a generic one (and "Madison Square Garden" is matched
before "Madison Square").

## Where it lives

`eventImagePick(e)` in `src/App.jsx` returns `{ url, tier }`; `eventHeroImage(e)` returns
just the url. Every event surface already calls `eventHeroImage` — the event detail
sheet, the "This week in NYC" strip, the Tonight events browser list, and saved-event
cards — so the fallback applies everywhere automatically.

## Keep the ranking honest

Because every card now resolves to *some* image, "has an image" can no longer be a
ranking signal. Curation (Stoop picks) instead scores by **image tier** (`tier * 12`),
so events with a real, specific photo still rank above ones showing only a borough
fallback.

## Image sources

Landmark photos reuse the app's existing `venueImages` (Wikimedia Commons) where
present; new landmarks and the borough photos use stable Wikimedia upload thumbnails.
A missing/renamed file degrades to the next tier rather than a broken box.

## Scope

Applies to every event-card surface and every event source (Ticketmaster, NYC Open
Data permits, farmers markets, and any future feed).
