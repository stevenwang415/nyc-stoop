# Crown Heights — venues to add (eat · drinks · coffee)

Vetted against current (2025–2026) Crown Heights guides. All are long-standing
neighborhood spots. Addresses are best-known; **`scripts/enrich-places.mjs`
resolves the exact coords / rating / hours / address from Google by name**, so
the names + "Crown Heights" are the important part. After adding, run enrich,
then `scripts/audit-coords.mjs`.

## 🍽️ Eat
| Name | Cuisine | Address |
|---|---|---|
| Glady's | Caribbean / jerk | 788 Franklin Ave |
| Chavela's | Mexican | 736 Franklin Ave |
| Barboncino | Pizza / Italian | 781 Franklin Ave |
| Mayfield | New American | 688 Franklin Ave |
| Catfish | Cajun / Creole | 1433 Bedford Ave |
| Cornbread | Soul food | 587 Franklin Ave |

## 🍸 Drinks
| Name | Type | Address |
|---|---|---|
| Friends and Lovers | Bar / music | 641 Classon Ave |
| Franklin Park | Beer garden | 618 St Johns Pl |
| Butter & Scotch | Dessert + cocktail bar | 818 Franklin Ave |
| Bar Bayeux | Wine bar / live jazz | 1066 Nostrand Ave |
| King Tai | Cocktail / beer bar | 1095 Bergen St |
| Kissa Kissa | Cocktail bar (patio) | 925 Nostrand Ave |

## ☕ Coffee
| Name | Note | Address |
|---|---|---|
| Little Zelda | Espresso + pastries | 728 Franklin Ave |
| Café con Libros | Coffee + feminist bookshop | 724 Prospect Pl |
| Hibiscus Brew | Caribbean-influenced, colorful lattes | 1019 Nostrand Ave |
| Lincoln Station | Café + eatery (near the Museum) | 409 Lincoln Pl |
| Most High | Specialty espresso | 749 Franklin Ave |
| Breukelen Coffee House | Neighborhood café | 764 Franklin Ave |

---

## Paste-ready (for the app's paste-import → Google resolve)
One per line; the importer attaches coords/address via Google Places. Set the
category per batch (eat / drinks / coffee) and neighborhood = "Crown Heights".

**Eat**
```
Glady's, Crown Heights, Brooklyn
Chavela's, Crown Heights, Brooklyn
Barboncino, Crown Heights, Brooklyn
Mayfield, Crown Heights, Brooklyn
Catfish, Crown Heights, Brooklyn
Cornbread Brooklyn, Crown Heights
```

**Drinks**
```
Friends and Lovers, Crown Heights, Brooklyn
Franklin Park, Crown Heights, Brooklyn
Butter & Scotch, Crown Heights, Brooklyn
Bar Bayeux, Crown Heights, Brooklyn
King Tai, Crown Heights, Brooklyn
Kissa Kissa, Crown Heights, Brooklyn
```

**Coffee**
```
Little Zelda, Crown Heights, Brooklyn
Café con Libros, Crown Heights, Brooklyn
Hibiscus Brew, Crown Heights, Brooklyn
Lincoln Station, Crown Heights, Brooklyn
Most High, Crown Heights, Brooklyn
Breukelen Coffee House, Crown Heights, Brooklyn
```

_Sources: The Infatuation (Crown Heights restaurants; Crown Heights & Prospect Heights bars), Your Brooklyn Guide & Loden (cafés), Yelp/Tripadvisor current listings._
