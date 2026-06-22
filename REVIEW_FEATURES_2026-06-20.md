# NYC Stoop — feature-by-feature review (live)

*Walked the deployed app at nyc-stoop.vercel.app, mobile frame. Console: no errors. Every fix from this session is now live and verified.*

---

## Explore / Home — working well
- **Search, Plan my night, browse** all present; coral theme reads vital, not melancholic.
- **This Week in NYC** now shows real events (BRIC Celebrate Brooklyn, a Prospect Park celebration) — the "FWC2026" permit code and block-by-block address dumps are gone.
- **"Where to eat"** leads the "What kind of day?" row again and opens the restaurant browser.
- **Nav** correctly highlights the current tab in coral (no more permanently-selected Tonight).

## Plan my night → My Trip — biggest improvement
Choosing *Tonight* now builds a real night, and all four should-fixes are confirmed live:
- **Evening plan:** Village Vanguard (9:15pm) → Carnegie Hall (11:35pm) — **two different kinds** (jazz + classical), not three jazz clubs to 3am.
- **No lunch after dark:** header reads "2 stops · 1 meal"; Full plan shows **Dinner only** (Employees Only), no phantom lunch.
- **Day range matches:** "9:15pm – 1:50am" now reflects the actual stop times (was an unrelated "8pm–12am").
- **Checklist = Full plan times** (9:15 / 11:35), in order, with a subway leg between.
- Minor: the dinner pick was a cocktail bar (Employees Only) — it serves food, so acceptable, but a pure-restaurant pick would read cleaner.

## Tonight — solid
Day selector with per-night counts, accurate category filters, day-aware copy ("Friday · Doors 8pm" on the Friday view), "A night at Carnegie Hall" (seasonal copy fixed), and every card opens the consistent bottom sheet. (Verified in the prior pass; unchanged.)

## Map — solid
Opens to the live **Map** by default with Map on the left of the toggle; the white top bar is gone (blends with the theme); filter reads **Classical** (not "Music") with a new **Food** chip; legend includes Food; pins are color-coded across the boroughs.

## Mood flow — much stronger, and the new Brooklyn map shipped
- **Brooklyn map redesigned:** all 11 regions tessellate with clean borders — no empty green gaps. **East Brooklyn** and **Lower Brooklyn** are in place and render exactly like the approved prototype.
- **New areas are functional:** tapping East Brooklyn surfaces real Bed-Stuy/Bushwick venues — Knickerbocker Bagel, Diego's Gyros, Bed-Stuy bakeries, and editorial Roberta's. Lower Brooklyn maps Red Hook/Carroll Gardens/Gowanus/Sunset Park.
- **Honest counts:** the activity tiles now show area-real numbers — Williamsburg = Eat 21, Cafés 6, Parks 1, with Drinks/Live "Coming soon." East Brooklyn = Eat 6, Drinks 1, Cafés 4, Live 2. No more "5 picks" that delivers 1.
- **Results** render as one consistent compact card style (imports with ratings + editorial with descriptions), each opening the same in-app sheet.

## Search & neighborhood browse — solid
Search spans venues + related works; neighborhood pages show categorized editorial picks with a cleanly-separated "From your list" (deduped against editorial), and tips render in full ("Los Tacos No. 1…").

---

## Remaining issues (small)
1. **Drinks / Coffee are data-thin** per neighborhood — many show "Coming soon" or 1 pick (Williamsburg Drinks, UES Drinks). The logic surfaces everything that exists; the gap is the database. A coverage matrix would pinpoint exactly where to add venues.
2. **Supermarket-type imports** (e.g. H-Mart) still appear as eat/place picks — should be filtered out as non-destinations.
3. **Mood place-picker backdrop** is still the cool blue-gray panel — slightly off against the warm theme (the Map tab's was warmed; this one wasn't).
4. **Restaurant sheet** can show a raw cuisine id ("bar_tavern") instead of "Bar," and the dinner slot can pick a bar.

## Verdict
Everything from the last review's must-fix and should-fix lists is live and working, plus the Brooklyn map and two new functional neighborhoods. The app is now in strong shape (~8.5–9/10 on the prior scale). The remaining work is **content, not flows** — fill the thin drink/coffee cells and prune non-venues — which is the highest-leverage thing left.
