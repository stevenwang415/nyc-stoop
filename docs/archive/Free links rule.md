# Free links rule

**Free events earn a spot by being real PUBLIC happenings — not by having a link.**
Drop the junk and private permits; keep the genuine public events; give each the
best link we have.

## Why this, not "links only"

An earlier version required every free event to have a verified official link.
That backfired: NYC's permit feed (tvpp-9vvx) gives most free events a name + date
+ place but **no website**, and the only free events that *do* carry a link are
GrowNYC greenmarkets. So "links only" collapsed the Free tab to almost entirely
farmers markets — while throwing away iconic free events with no URL in the data,
e.g. **Nathan's Famous July 4th Hot Dog Eating Contest**, the **July 4th
fireworks**, the **Congo Square Drummers Circle**, and neighborhood **block
parties**. Those are exactly what a user wants. So the lever is *quality*, not
*link availability*.

## The rule

1. **Drop junk at the source** (`normalizePermitted` in `src/lib/nycEvents.js`).
   On top of the existing noise/promo/code filters, we drop private & hobby
   permits via `PERMIT_PRIVATE` (birthday/shower/wedding parties, BBQs, picnics,
   day camps & day-care outings, CSA pickups, model-aircraft & hobby fields, brand
   "ambassadors", "content days", outreach), cryptic recurring program codes via
   `PERMIT_PROGRAM_CODE` ("SSS PPP Summer 2026"), and fully-generic standalone
   names via `PERMIT_GENERIC` ("Celebration", "Party", "Picnic"…). Verified on a
   real Brooklyn-weekend pull: 35 junk permits dropped, 21 real public events kept.

2. **Keep everything else** — no link requirement. Real public events (parades,
   block parties, fireworks, drum circles, fitness series, eating contests,
   markets) all stay.

3. **Link each to the best target** via `eventOfficialUrl(e)`, in order:
   a. an explicit `e.website` (GrowNYC greenmarkets — only "…Greenmarket"-branded
      names, whose page is verified; other markets have none);
   b. a known **free series/organizer** from the curated `FREE_SERIES_LINKS` map
      (Classical Theatre of Harlem, SummerStage, Shakespeare in the Park, Celebrate
      Brooklyn, Smorgasburg, Bryant Park, Times Square / TSQ Live, Governors
      Island, BAM, West Indian Day, NYC Pride, Village Halloween Parade, Harlem
      Week, Shape Up NYC, …);
   c. ticketed events keep their ticket URL;
   d. otherwise **fall back to a jump-to-first-result search** (`eventSearchUrl`).
      This is meaningful *because* the junk is already gone — the remaining names
      are specific and real ("Nathan's Famous July 4th Hot Dog Eating Contest"
      lands on the right page), unlike a bare "Celebration" (now dropped).

The same `eventOfficialUrl` powers the detail-sheet button ("Visit website" when a
real page exists, "More info" search otherwise).

## Maintaining the series map

The map is curated and forward-looking — entries only apply when a matching event
appears, so it's safe to add famous series even if they're not in the feed this
week. Keys are lowercase substrings matched against the event title, most-specific
first. **Every URL must be verified reachable before adding** (root domain at
minimum; 403/406 from a bot check is fine, 404/000 is not). Omit a series rather
than link a dead domain — those events just fall out of Free.
