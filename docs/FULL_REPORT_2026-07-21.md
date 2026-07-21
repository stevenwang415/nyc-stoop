# NYC Stoop — Full Product Report (2026-07-21)

Four lenses on one build: the user (carried over from today's scored review),
an App Store reviewer, a senior developer auditing the codebase, and a
marketing analyst — closing with the monetization plan that ties them
together. Companion docs: `docs/reviews/REVIEW_2026-07-21.md` (user lens,
scored), `MONETIZATION_v1.2.md` (earlier pricing thinking), `PUBLISH_IOS.md`
(submission mechanics), `apply_store.md` (listing copy).

---

## 1. Executive summary

The product is ready; the packaging is not. After the canceled 07-16
submission, five days of device-driven fixes replaced the app's riskiest
behavior — content appearing, changing, or vanishing without user intent —
with a uniformly invitation-first model, verified by ~90 headless assertions
with zero regressions. The user-lens scores (9.8 local / 9.85 visitor) are
the highest in the series. What stands between this build and the App Store
is operational: screenshots and listing copy describe an app that no longer
exists (four tabs, "My Trip"), and one on-device confirmation of the new PDF
print path. Engineering health is good enough to ship but carries one real
debt (a 17k-line `App.jsx`) that should be paid before v1.2, not before
v1.0. The monetization design is sound, already built, and deliberately
parked (`IAP_ENABLED=false`) — the correct sequencing, because the free v1.0
is itself the marketing engine the paid v1.1 will need.

**Do next, in order:** freeze → retake 5 screenshots → rewrite the MY TRIP
paragraph in the listing → device-check the print sheet → resubmit.

---

## 2. User lens (summary — full scoring in REVIEW_2026-07-21.md)

Maya (local) 9.8, Tom & Rachel (visitors) 9.85. The cycle's theme: the app
stopped volunteering content. Meals are opt-in and pinned; events are
first-class cards that work without dates; "+ Add to Planner" always
produces a visible card; saved plans replay exactly what was built (order,
events, notes, honest prices — admissions counted, "+ ticket" flagged, free
= $0, unknown stays out). Both discovery-side and plan-side journeys were
walked hands-on today; the only new finding was cosmetic ("Admission" label
on restaurant detail pages should read "Price").

What caps the scores: content depth for locals (late-night, bars, repeat-use
freshness) and — for visitors — nothing in-app; their remaining risk is the
store package mismatch, which is Section 3's headline.

---

## 3. App Store reviewer lens

Simulating the review through Apple's guidelines, on the current build:

| Guideline | Status | Notes |
|---|---|---|
| 2.1 App completeness | 🟢 | No placeholders, no dead ends found in either scenario walk; empty states are designed, not accidental. |
| 2.3 Accurate metadata | 🔴 **the gate** | All five screenshots show the retired 4-tab "My Trip" build; the description's MY TRIP section names a tab that no longer exists. This is the single most citable rejection reason available to a reviewer. Retake + rewrite before submitting. |
| 3.1.1 Payments | 🟢 | v1.0 has zero purchase UI (`IAP_ENABLED=false`, no Lifetime row, no paywall). The entire IAP review-risk class is out of scope. Do not mention the future unlock in review notes. |
| 4.2 Minimum functionality | 🟢 | Native-feeling Capacitor app with offline-capable curated content, live events, routing logic — far above "repackaged website." |
| 5.1.1 Privacy / data | 🟢 | Sign-in optional and gates nothing; account deletion in Settings; privacy policy (Notion) matches actual behavior; App Privacy answers (Name, Email, Other User Content — linked, App Functionality, no tracking) already entered in ASC. |
| 5.1.5 Location | 🟢 | Used only for optional near-me sorting; never stored or transmitted; purpose string honest. |
| 5.2 IP | 🟢 | MTA: no symbols, own teal, text-only bus/subway wording (license declined, engineered out). Google: Takeout-derived coords never plotted on Leaflet (the new 64-pin food layer uses in-repo curated coords — rule held under pressure this week). Event imagery from Ticketmaster's own API fields. |
| Demo account | 🟡 | `stevenwang.nycstoop+applereview@gmail.com` exists; re-verify the password works on prod before submitting, since review notes promise it. |
| Crash-free pass | 🟡 | Headless: zero page errors across 15 suites. Remaining: one physical-device pass, specifically the print sheet (`window.print()` via hidden iframe needs iOS 16+; verify once) and a fresh-install walk. |

**Reviewer's likely experience:** installs, sees onboarding, saves a show,
watches it become a routed evening without setting anything up — the app
demos itself. The only thing that can break the spell is noticing the
screenshots don't match. Fix 2.3 and this passes.

---

## 4. Developer reviewer lens

**Architecture as built:** React 18 + Vite SPA, Capacitor 8 iOS shell,
FastAPI/Neon backend on Vercel (auth, feedback, events proxy), Leaflet maps,
cordova-plugin-purchase wired but dormant. State = component state +
~30 namespaced localStorage keys. It ships. Now the honest audit:

**Strengths worth keeping:**
- *Behavior-dense comments.* The code documents product decisions with dates
  ("2026-07-20: a tonight plan shouldn't require dates first") — the repo
  reads as its own decision log, which is why regressions keep getting
  caught at review time.
- *Derived-from-rendered invariant.* Counts, prices, and snapshots all
  derive from `reorderedItems` — one source of truth ended the
  count-drift bug class permanently.
- *Compliance rules enforced structurally* (no Google coords on Leaflet, no
  MTA marks) rather than by memory.

**Debts, ranked:**
1. **`App.jsx` is ~17,500 lines.** Every feature this week required
   archaeology (grep-driven development) and two TDZ near-misses came from
   declaration-order coupling between distant regions. Split by screen
   (PlanScreen, SavedPlanSummary, MapScreen, EventsScreen, data/) in v1.2.
   Not before v1.0 — a mechanical refactor now would invalidate this week's
   verification for zero user value.
2. **The test suite lives in `/tmp`.** ~20 Playwright scripts embodying the
   whole regression contract were rebuilt twice this month after tmp wipes.
   Move them into `scripts/e2e/` with a runner and the seed-state helpers
   extracted; they are the project's most valuable non-shipping asset.
3. **localStorage schema has no migration story.** ~30 keys, some
   interdependent (`nyc_plan_sel` / `nyc_plan_known` / `nyc_meal_picks`).
   Legacy-snapshot fallbacks exist (good pattern — keep), but a
   `nyc_schema_version` key + one migrate-on-boot function will be needed
   the first time a key's shape changes post-launch.
4. **`nyc_meal_picks` and friends grow unboundedly** until a reset path
   clears them. Harmless at current scale; sweep orphaned day-indexed keys
   on plan reset.
5. **No error boundary / crash telemetry.** A single React error whitescreens
   the WKWebView with no signal back. Add a top-level boundary with a
   friendly reload card in v1.1; consider Sentry's free tier.

**Verdict:** ship-ready; debts are scheduled, not ignored. The one
non-negotiable before feature work resumes post-launch is #2 (tests into the
repo) — everything else compounds from there.

---

## 5. Marketing analyst lens

**Positioning.** "Learn the city, not just visit it" is a real wedge. The
market splits into inventory apps (Google Maps, TripAdvisor, Yelp — everything,
ranked by strangers) and logistics apps (Wanderlog, TripIt — organize what
you already chose). Stoop occupies the underserved middle: *opinionated
curation that becomes a routed plan in one tap.* The editorial voice ("cash-
only, porterhouse-only, no frills") is the moat — it cannot be scraped into
sameness, and it is the thing screenshots can show.

**ICP, in order of leverage:**
1. First-time NYC visitors, 2–5 day trips, planning 2–6 weeks out — highest
   intent, price-insensitive, the paid tier's target.
2. Occasional locals ("what's on tonight") — retention engine and reviews.
3. Trip gift-givers / group planners — arrive via shared plans and PDFs;
   every exported schedule is a branded referral (footer already says so).

**ASO.** Current keyword field is solid (nyc, travel guide, itinerary, trip
planner…). Two gaps: nothing captures the events use case ("things to do
nyc tonight" family) and nothing captures "weekend." Screenshots should be
retaken as a *story*, not a tab tour: ① tonight plan (show + dinner, routed)
② the editorial place page ③ the Planner with numbered cards + subway
directions ④ Events ⑤ the saved plan / PDF. Caption each with the benefit,
not the feature name.

**Launch sequence (realistic for a solo dev):**
- *Now:* Friends Beta via the existing TestFlight public link; harvest the
  first 10 reviews' language for the listing copy.
- *Launch week:* Product Hunt + r/AskNYC / r/nyctourism value-posts (share a
  genuinely useful free itinerary, mention the app made it); the web app is
  the free top-of-funnel — add one OG-image-rich shareable page per plan.
- *Compounding channel:* short-form video of real one-day plans ("$40
  Saturday in the Village — routed") — the app's output IS the content;
  every reel ends on the routed-plan screen.
- *Metric that matters pre-monetization:* D7 retention of users who saved ≥3
  places, and share/PDF exports per weekly active — both proxy for the v1.1
  conversion base.

---

## 6. Monetization plan (reconciled)

Two documents disagree on price ($4.99 in MONETIZATION_v1.2.md vs the built
$3.99 in `iap.js`/ASC notes); the build is the decision of record. The plan:

**Model: one non-consumable — NYC Stoop Unlimited, $3.99 lifetime.**
No subscription. Positioning line: *"Planning one great day is free.
Planning your whole trip is $3.99, once."*

**The split (already implemented behind `IAP_ENABLED`):**
- *Free forever:* all browsing (Explore, Events, Map, Eat, search), saves, a
  complete one-day routed plan with meals and transit, one saved plan.
  Discovery is marketing; the free tier must always demo the full magic once.
- *Unlimited:* multi-day trips, unlimited saved plans, PDF export — gates at
  intensity moments (adding day 2 of a real trip), never at curiosity
  moments.

**Why $3.99-lifetime beats the alternatives here:** the buyer is planning
one trip; a subscription (Wanderlog Pro is ~$40/yr) is mis-shaped for a
single-city, single-trip purchase and would suppress the impulse buy at the
day-2 gate. Lifetime at coffee price converts on impulse and preserves
word-of-mouth. Revisit only if a second city ships (then: per-city packs or
a bundle, not a subscription rebrand).

**Sequencing (confirmed correct):**
1. **v1.0 — free, no purchase UI.** Deletes IAP review risk; builds the
   review base and the D7 cohort.
2. **v1.1 — flip the switch.** Prereqs already listed in PUBLISH_IOS.md:
   ASC product `com.nycstoop.app.lifetime` created, Paid Apps agreement
   signed, sandbox purchase + restore tested, Restore row visible, privacy
   label updated (Purchases), review notes rewritten, EU trader status
   decided *before* monetizing. Add from the older doc the one idea worth
   keeping: **grandfather v1.0 installs** (set a founding-user flag on first
   launch now-ish so gate-launch reads as a gift to early users, not a
   taking-away). One boolean, enormous goodwill.
3. **Promo codes** post-launch for friends/press (reminder already parked).

**Honest projections discipline:** don't model revenue until there's a D7
number. The gate's conversion base = users who reach day-2 planning; track
that event from v1.0 day one (it's free analytics on the future paywall).

---

## 7. Roadmap

- **Now (pre-resubmission, ~half a day):** freeze build → retake 5
  screenshots from it → rewrite listing copy (Planner/My Plans naming) →
  verify demo account login on prod → device pass incl. print sheet →
  submit. Also: set the founding-user flag while everything is free.
- **v1.1:** IAP on (checklist above) + error boundary + "Admission"→"Price"
  label + exact bus-stop names + Queens evening / Brooklyn restaurant data
  + Seamstress closure.
- **v1.2:** App.jsx split + e2e suite into repo + LS schema versioning +
  Share/photos feature (spec exists) + event spreading for undated
  multi-day trips.

## 8. KPIs from day one

Installs → activation (first save) → first routed plan → day-2 planning
reached (the future gate) → save-copy count → share/PDF exports → D7 by
cohort. All derivable from lightweight anonymous events; decide the
analytics approach before v1.1, not after.

---

*Prepared 2026-07-21, against the post-cancellation build (last commit
`aee0dd8` + today's verified working tree). User-lens detail and the
regression evidence live in `docs/reviews/REVIEW_2026-07-21.md`.*
