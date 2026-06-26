# "Where to eat" — review & improvement plan

_Reviewed the EatScreen (restaurant browser) against the now-enriched data. 2026-06-24._

## Headline

**The browser shows 19 restaurants. There are ~300 available.** That's the whole problem.

`EatScreen` builds its dataset from one source only:
```js
const allRestaurants = Object.values(venues).filter(v => v.isRestaurant)  // = 19
```
Sitting unused right next to it:
- **256 food imports** — all Google-enriched (rating, cuisine, neighborhood, coordinates, hours, photos).
- **49 curated restaurants** (`RESTAURANT_DATA`) — used for meal picks elsewhere, never surfaced here.

The code comment even admits it: _"Future: also include user_venues with cuisine fields filled in via enrichment."_ That future is now — the enrichment is done.

## Problems (in priority order)

1. **Tiny dataset (19).** A whole-city "where to eat" with 19 options feels broken. Across 12 neighborhoods, most areas show 1–2 picks or nothing.

2. **Cuisine taxonomy is too narrow AND incompatible with the imports.** The filter offers 12 hardcoded pills (Italian, Pizza, Sushi, Ramen, Korean, Mexican, French, Steakhouse, Bakery, Bar, Brunch, Deli). But the imports' real cuisines are: bakery (57), american (51), bar/tavern (41), café (31), japanese (30), italian (21), chinese (15), dessert (15), thai (14), pizza (13), french (13), korean (13), seafood, vietnamese, indian… So there's **no pill for Japanese, Chinese, Thai, Vietnamese, American, Café, Dessert, Seafood, Indian** — major gaps.

3. **Data-shape mismatch.** Editorial venues store `cuisine` as a single string ("Italian"); imports store `cuisine` as an array of tokens (`["japanese"]`, `["bar_tavern"]`). The filter `cuisines.has(r.cuisine)` only works for the string form — so even if imports were added, the cuisine filter wouldn't match them. Same issue for "Sushi"/"Ramen" pills not mapping to the `japanese` token.

4. **Tag-based filters exclude imports.** Vibes (date_night, casual…), meals (breakfast, brunch…), and dietary (vegetarian…) tags exist only on the 19 editorial venues. Imports have none, so turning on any such filter drops all 256 imports.

5. **Only 12 neighborhoods** appear in the filter (auto-derived from the 19). The imports span all of Manhattan + Brooklyn, so the neighborhood filter is artificially short.

## Suggested fix (the one that matters)

**Unify the dataset.** Build the EatScreen list from editorial `isRestaurant` venues **+ the 256 food imports + the 49 curated restaurants**, deduped by name. This alone takes it from 19 → ~300 and instantly fills every neighborhood. Supporting changes:

1. **Normalize a cuisine layer.** Map every source to a shared display vocabulary:
   - imports `japanese` → Japanese (and surface Sushi/Ramen as sub-tags), `bar_tavern` → Bar, `cafe` → Café, `american` → American, `dessert` → Dessert, etc.
   - Make the cuisine filter accept both a string and an array.
2. **Expand the pills** to what's actually in the data: add Japanese, Chinese, Thai, Vietnamese, American, Café, Dessert, Seafood, Indian (keep the curated ones).
3. **Rank by Google rating** (imports now have it) and apply the existing safeguards: exclude fast-food (`isFastFood`) and anything closed (already pruned).
4. **Soft-handle the tag filters** — vibes/meals/dietary already default to "all", so imports without tags show fine until a user opts into a tag filter (acceptable; the editorial picks still answer those).
5. **Photos already work** for both — imports fetch live Google photos, editorial use Wikimedia.

## Effort / risk

Medium, low-risk. It's mostly: (a) merge three arrays into one normalized shape at the top of `EatScreen`, (b) a cuisine-token → label map, (c) widen the pill list. No new dependencies. The filters, map, and card UI all stay as-is — they just operate on a much larger, normalized list.

## Recommendation

Do the unify. It's the highest-leverage single change in the app right now — turns the weakest surface (19 picks) into one backed by the ~300-venue dataset we just spent the week enriching.
