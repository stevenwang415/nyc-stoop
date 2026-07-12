# Overlap rule

**Never show the same underlying event more than once.** When several cards are really the
same game / show / performance — just sold as different ticket packages, sections, or add-ons —
collapse them into **one** card. Show the real event, not its ticketing variants.

## The case that triggered this

Sports → Tonight showed 5+ cards that were all the *same* Yankees game:

- New York Yankees v. Detroit Tigers \* Gr**andstand**
- New York Yankees v. Detroit Tigers \* Pre**mium**
- New York Yankees vs. Detroit Tigers   ← the real game
- Pinstripe Pass \* New York Yankees v. Det…
- Pregame Glimpse of Greatness (a stadium tour)
- Pregame Glimpse of Greatness / Yankee Stadium tours

A user wants to see **the game once**. From that screenshot only ~2 cards are genuinely distinct
(the game, and maybe one tour) — the rest are price tiers / packages for the identical event.

## Why the current dedupe misses it

`normalizeTicketmaster` de-dupes on exact `title + venue + day`. These rows share venue + day but
their **titles differ by a package qualifier**, so they survive as separate cards.

## The rule

Two cards are "the same event" (keep one) when they share **venue + date** AND their **core title**
matches after stripping ticket-package noise. Treat as package noise:

- Anything after a `*` / `•` / `|` separator (`… * Grandstand`, `… * Premium`).
- Leading package labels: `Pinstripe Pass`, `Field MVP`, `Premium`, `Grandstand`, `Suite`,
  `VIP`, `Hospitality`, `Club`, `Package`, etc. — strip them, then compare.
- Stadium tours / behind-the-scenes add-ons (`Pregame Glimpse of Greatness`, `Stadium Tour`,
  `Tours`) are **not** the game; collapse multiple tour listings to one, and rank them **below**
  the actual game.

Canonical card to keep, in priority order: the plain game/show title (no package suffix) →
else the cheapest / lowest-tier → else the first by date.

## Display cap

Within a single game's variants, show **one** card. Across the tab, the existing top-5 +
"Show all" cap still applies — but it should count *distinct events*, so the collapse must run
**before** the cap, or one popular game can eat the whole list.

## Scope

Applies everywhere events are listed (Tonight / This weekend / This week, Stoop picks,
This week in NYC strip) and to every source (Ticketmaster especially; also any future feed).
