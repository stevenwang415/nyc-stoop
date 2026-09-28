# Badges System

Living structure document for NYC Stoop v3. Steven dictates additions in
chat ("add … to the Badges System file"); this file is the single source of
truth for structure decisions before they're ingested into the app catalog
(`docs/badge-catalog-template.csv` → `src/badges/catalog.js`).

Last updated: 2026-09-28 (nickel 11 · Museums 6 · v3.1 make-your-own-badge idea)

---

## 1. Badge tiers (finish)

| Tier | Finish | Meaning |
|---|---|---|
| Brass | gold metal | Main spots — the landmark set; required by the level ladder |
| Nickel | silver metal | Notable places & stores |
| Copper | copper metal | Food & restaurants |
| Iris | iridescent | Seasonal — collectible only in their date window; bonus, never required |

## 2. Brass badges (14) — confirmed 2026-09-28

Empire State Building · Central Park · Flatiron Building · Rockefeller
Center · Radio City Music Hall · Yankee Stadium · Statue of Liberty (radius
1200 m — collectible from the Staten Island Ferry) · The Met · Brooklyn
Bridge · St. Patrick's Cathedral · Grand Central Terminal · Wall Street
(Federal Hall) · Dumbo · Chinatown

Notes: Times Square demoted to nickel. Charging Bull planned as nickel.

## 3. Nickel badges (11) — confirmed 2026-09-28

Washington Square Arch · Bryant Park · Whitney Museum · Guggenheim ·
Lincoln Center · Chrysler Building · World Trade Center · Little Island ·
Coney Island (radius 400 m — the boardwalk is long) · Brooklyn Museum ·
Apollo Theater

Status unclear (in CSV, awaiting Steven's call): Times Square (was demoted
from brass to nickel but absent from the confirmed 11) · Charging Bull
(planned as nickel, not yet listed).

## 4. Copper badges — in progress

Katz's Delicatessen · (more to come)

## 5. Iris badges — in progress

Rockefeller Center Tree (Nov 25 – Jan 6) · (more to come)

---

## 6. Collections

A Collection is a themed set of badges that spans tiers. Completing the set
earns a Collection reward (display treatment TBD — e.g. a special plaque on
the shelf). Badges can belong to a Collection AND count normally toward
tiers/levels.

### 6.1 Collection of Museums (6 badges)

| Museum | Tier |
|---|---|
| The Met | Brass |
| American Museum of Natural History | Brass |
| The MoMA | Brass |
| Guggenheim | Nickel |
| Whitney | Nickel |
| Brooklyn Museum | Nickel |

### 6.2 Collection of Broadway

Members TBD.

### 6.3 Collection of Steakhouse

Members TBD.

---

## 7. v3.1 (proposed): Make Your Own Badge

Recorded 2026-09-28 — decide later. Users mint a badge for a favorite
corner. Design stays easy because users CONFIGURE, never draw: curated
glyph library (~40 icons) + engraved name (≤14 chars) + location pin,
rendered by the medallion engine in a dedicated personal finish
(pewter/wood — distinct from official tiers), creator's name on the rim.
Leaning: friends can collect each other's badges (the participation
flywheel); never counts toward levels. To decide: 2/week limit + ~10
active cap, friends-collectible vs private, finish look, separate map
layer, privacy guardrail (no homes), glyph library owner.

## 8. Open items / to reconcile

- **Natural History and MoMA are declared Brass via the Museums Collection
  but are not yet in the brass list (§2) or the CSV** — confirm whether the
  brass set becomes 16, or whether these two are brass-tier without the
  `main` flag (i.e., not required for Level 1).
- Level ladder thresholds once the catalog is final (14+ mains makes
  "all mains" a demanding Level 1 — includes a ferry ride and the Bronx).
- Collection completion reward design (shelf plaque? special medallion?).
- Radio City ↔ Rockefeller Center pins are ~150 m apart; both collectible
  from one spot — intended?
