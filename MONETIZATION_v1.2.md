# Monetization plan — v1.2 (decided 2026-07-08, deferred from v1)

**Decision:** v1 ships fully free. The one-time purchase arrives in a future
update (target v1.2, after the v1.1 Share feature).

## The model

- **NYC Stoop Unlimited — $4.99, one-time** (non-consumable IAP, no subscription).
- Consider $6.99 at launch of the gate; tourists are price-insensitive pre-trip.
- Positioning line: **"Planning one great day is free. Planning your whole trip
  is $4.99, once."**

## The split — the guide is free, the planner is paid

**Free forever:**
- All of Explore (activities, collections, place pages, editorial content)
- Events, Map (incl. area sheets), Eat browser, search, weather
- Saves up to ~15
- A complete ONE-DAY plan — meals, subway directions, routing (the taste of
  the engine; never let free users only read about the magic)

**Unlimited ($4.99):**
- Multi-day trips (day tabs, per-day forecast, events pinned into days)
- Unlimited saves
- Saved plan snapshots, shareable trip links, PDF export
- All future premium features (Share/photos, offline, etc.)

## Grandfathering (important)

Users who installed while everything was free should KEEP everything free —
flag accounts/devices at gate-launch as "founding users." Turns the classic
"they took features away" backlash into a loyalty gift. Cheap to implement
(one boolean set on first launch before the gate ships), enormous goodwill.

## Implementation checklist (≈1 day)

1. RevenueCat (free tier) + its Capacitor plugin — handles StoreKit, receipts,
   restore, cross-device entitlement.
2. Create non-consumable IAP in App Store Connect ("unlimited", price tier $4.99).
3. `has_unlimited` entitlement: RevenueCat is source of truth; mirror onto the
   backend user record so web + iOS agree.
4. Paywall sheet in house style (cream, serif, hand-drawn art) shown at the
   gates: adding a 2nd day, 16th save, snapshot/export/share actions.
5. **"Restore purchases" row in Settings — App Review requires it.**
6. Update privacy label (Purchases) + review notes.

## Rules of thumb

- Never gate: browsing, search, place pages, the map, the first day. Discovery
  is marketing; resentment kills word-of-mouth.
- Gate at intensity thresholds where $4.99 is trivially justified (day 2 of a
  real trip), never at curiosity moments.
