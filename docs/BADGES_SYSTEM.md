# Badges System

Living structure document for NYC Stoop v3. Steven dictates additions in
chat ("add … to the Badges System file"); this file is the single source of
truth for structure decisions before they're ingested into the app catalog
(`docs/badge-catalog-template.csv` → `src/badges/catalog.js`).

Last updated: 2026-10-08 (tier redefinition + roadmap; 54 badges)

---

## 1. Badge tiers (finish) — redefined 2026-10-08

The tiers are a TRAVELER'S PRIORITY GUIDE, not a prestige ranking. Each tier
answers one question: "how much time do you have in New York?"

| Tier | Finish | Definition |
|---|---|---|
| Brass | gold metal | **Must-visit.** The places and restaurants no first trip should skip. Backbone of the level ladder. |
| Nickel | silver metal | **If you have extra time.** Worth it, optional — second-trip material. |
| Copper | copper metal | **If you have plenty of time in NYC, try these.** Mostly restaurants and food spots. |
| Iris | iridescent | **Seasonal events.** Collectible only inside their date window; bonus, never required by the ladder. |

Implications of the redefinition (open review items):
- Tier is no longer category-bound: a restaurant CAN be brass if it's a
  must-visit (candidate: Katz's — currently copper). Review each badge
  against the time-priority question, not against "is it food".
- Current mapping holds until reviewed: 14 brass, 17 nickel (incl. the 5
  Broadway shows), 12 copper (incl. the 5 steakhouses), 11 iris.
- Level ladder reads brass as its spine — any badge promoted to brass
  automatically becomes required for New York Regular (all mains).

## 2. Brass badges (19) — updated 2026-10-08

Tier review round 1: Times Square promoted to brass+main; Chelsea Market,
The High Line (r300), Los Tacos No. 1 added as brass+main; Peter Luger
promoted copper→brass+main (stays in the Steakhouse collection). Broadway
shows + remaining 4 steakhouses: tier assignment deferred — Steven will
re-tier individually; collections unchanged.

(original 14, confirmed 2026-09-28:)

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

## 5. Iris badges (seasonal) — in progress

Confirmed 2026-09-28:
- Rockefeller Center Tree (Nov 25 – Jan 6)
- Wollman Rink, Central Park ice skating (late Oct – early Mar)
- Bryant Park Winter Village rink (late Oct – early Mar)

Batch 2 confirmed 2026-09-28 (11 iris total):
- Village Halloween Parade (Oct 31 only — the rarest badge in the system)
- Macy's Thanksgiving Parade (Thanksgiving week; Herald Square pin)
- Brooklyn Botanic Cherry Blossoms (April)
- Shakespeare in the Park / Delacorte (Jun–Aug)
- NYC Marathon (first week of Nov; Central Park finish pin)
- US Open (late Aug – early Sep, Flushing Meadows — first Queens badge)
- Pride March (last week of June; Stonewall pin)
- Dyker Heights Christmas Lights (December, Brooklyn)

Notes: winter windows cross the year boundary (e.g. 10-22~03-01) — the
season check must handle the wrap. Bryant Park has TWO badges (nickel
park + iris rink) — intended. Date-varies events (Thanksgiving, Marathon,
Pride) need a small annual window adjustment on the server — add to the
ops calendar. Event badges use generous radii (300–400 m) for crowds and
barriers. A future "Collection of NYC Winter" (tree + 2 rinks + Dyker)
assembles itself — parked.

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

### 6.2 Collection of Broadway (5 badges, nickel)

Hamilton (Richard Rodgers) · Chicago (Ambassador) · Harry Potter (Lyric) ·
The Lion King (Minskoff) · Wicked (Gershwin). Added 2026-10-08.

> **Status 2026-10-06**: Collections UI shipped on the Badges shelf
> (src/badges/collections.js) — progress bars, member medallions, gold
> "Complete" plaque. Museums counts the 4 in-catalog members; AMNH + MoMA
> show as placeholders until their badges are added. Broadway/Steakhouse
> render as Coming-soon cards; filling in `members` ids is all they need.

### 6.3 Collection of Steakhouse (5 badges, copper)

Peter Luger · Gallaghers · Keens · The Grill · 4 Charles Prime Rib.
Added 2026-10-08.

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

## 9. Roadmap

### Shipped
- **v2.2** (Sep 2026) — Share social core: friends, posts, comments, likes,
  IG-style profiles, Today in NYC, Stoop rename.
- **v2.2.1** (Sep 2026) — OSM tile hotfix (CARTO policy change).
- **v2.2.2** (Oct 2026) — push notifications working end-to-end,
  post-scoped comments, timezone-correct dates, account-state backup to
  Neon (plans/trips survive reinstall), badge code isolated to a lazy
  chunk.

### v3.0 — "Badges" (target: ~2 weeks, gated by designer art)
Done and waiting behind the beta gate:
- Badge world (map · shelf · routes · photos), camera collect with
  server-side radius + season rules, strike ceremony, stamp viewer,
  share (story/stamp/photo), whole-coin designer art pipeline
  (Guggenheim live), collections (Museums · Broadway · Steakhouse),
  5-level ladder, profile badge strip, full zh-TW, 54-badge catalog.
Remaining before launch:
1. Designer coins — 53 remaining (pipeline: 1 image + 1 command each)
2. $3.99 IAP revival — decide free/paid split, StoreKit re-test
3. EU DSA trader decision (or exclude EU) — blocks IAP
4. Tier review pass under the new definitions (promote/demote)
5. Collection rewards treatment + AMNH/MoMA badges yes/no
6. Haptics on strike; native tester unlock; e2e UI suite green
7. Flip the badge gate; remove APNS_SANDBOX if testing left it set
8. **Two color modes (UX upgrade, decided 2026-10-09)** — today the main
   app is light-only and the badge world is dark-only. v3.0 ships an
   app-wide light/dark mode: **light is the default** (current NYC Stoop
   look). Two themes are missing and must be designed + built: a **light
   badge world** and a **dark NYC Stoop** (all 5 main tabs). UX design to
   follow; likely a Settings toggle + optional follow-system.
9. App Store assets: screenshots with badge world, What's New

### v3.1 — "Make Your Own Badge" (proposed, after v3.0 stabilizes)
User-minted personal badges (configure, never draw): glyph library +
engraved name + location pin, personal finish, 2/week cap. Spec in §7.

### Parallel track
- **Tokyo Stoop** — second city on a new stack (Expo + Hono/CF Workers),
  structure sprint planned; NYC learnings (catalog pipeline, badge rules,
  state backup) port over as patterns, not code.

---

## 8. Open items / to reconcile

- **Insider tier (future, undecided)**: how to tier true insider spots — NOT
  copper in this version; copper is "plenty of time", not "insider". Parked.
- **Movie places collection (future, undecided)**: a Collection of famous
  filming locations. Parked alongside the insider question.

- **v3.0 launch blocker — EU DSA trader status**: account is declared **non-trader** (Sep 2026, app fully free). Before enabling the $3.99 IAP in v3.0: either switch to **trader** in App Store Connect (public contact info required — consider not using home address) **or exclude EU countries** in Pricing & Availability. IAP will be rejected/blocked in EU otherwise.

- **Natural History and MoMA are declared Brass via the Museums Collection
  but are not yet in the brass list (§2) or the CSV** — confirm whether the
  brass set becomes 16, or whether these two are brass-tier without the
  `main` flag (i.e., not required for Level 1).
- Level ladder thresholds once the catalog is final (14+ mains makes
  "all mains" a demanding Level 1 — includes a ferry ride and the Bronx).
- Collection completion reward design (shelf plaque? special medallion?).
- Radio City ↔ Rockefeller Center pins are ~150 m apart; both collectible
  from one spot — intended?
