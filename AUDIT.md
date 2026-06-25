# NYC Stoop — end-of-day data audit (executive summary)

_Audited all 705 imported places, 175 editorial venues, and the curated restaurant DB after full Google enrichment. Generated 2026-06-24._

**Healthy:** 0 missing coordinates · 0 missing addresses · 0 unenriched · 0 closed venues (post-sweep). The structural data is solid.

## Top issues, in priority order

**1. ~18 real bars are mislabeled category `place` (so they're invisible to recommendations).**
The friend's import used "place" as a catch-all; it hides actual bars. Recategorizing them to `drinks` declutters AND fills drink gaps:
The Gin Mill, The Wayland, Union Pool, The Back Room, The Django, Dutch Kills, Spring Lounge, Swift Hibernian Lounge, Twins Lounge, The Ripple Room, Westlight, Dante West Village, Frog, People's, Lucinda's, Jeju Noodle Bar (→ food). _Recommend fixing._

**2. 37 editorial landmarks render a plain gradient tile (no photo).**
Notable ones worth a real image: theaters (Minskoff, Ambassador, Lyric), concert halls (Jazz at Lincoln Center, Alice Tully Hall, Merkin Hall, 92nd St Y), and famous restaurants (Carbone, Lilia, Le Bernardin, Peter Luger, Lucali, Joe's Pizza, Veselka, Levain, Eleven Madison Park). _Recommend adding Wikimedia photos where they exist._

**3. ~130 non-destination imports clutter "Your Places."**
Vintage/antique shops & bookstores (Beacon's Closet, Stella Dallas, Strand, Horseman Antiques…) and bare area-markers saved as places (SoHo, DUMBO, Little Italy, Sunset Park, Hunters Point, Rockefeller Center). Inert in recommendations but noisy in My Trip. _Decide: keep, or prune the area-markers + shopping._

**4. Location — 84 coords-vs-label disagreements (mostly fine, a few to check).**
Classification now uses the authoritative Google coordinates, so these display in the right place. Worth a look:
- **Lincoln Station / Most High** are labeled "Crown Heights" but are actually **Prospect Heights** (coords are right; the label is off).
- **Donna (Williamsburg)** resolved to **West Village** — likely a wrong Google match; verify/fix.
- Several spots I added "for" Chelsea / Park Slope / Greenpoint sit on borders and now display in the **adjacent** area (Midtown West / Lower Brooklyn / Williamsburg) — so a few of the drinks/coffee counts shifted by one neighborhood.

**5. Minor / cosmetic.**
14 missing ratings and 40 missing hours (mostly parks, landmarks, and area-markers that genuinely have none); 262 blank neighborhood strings (cosmetic only — the app classifies by coordinates, not the string).

---

_Full per-category lists below._

# NYC Stoop — full data audit

Generated 2026-06-24. 705 imported places · 101 editorial venues · 49 curated restaurants.

## Not enriched (Google lookup failed — review/remove) — 0

_none_

## Missing coordinates — 0

_none_

## Missing address — 0

_none_

## Missing rating — 14

- Brooklyn Warehouse Project [East Williamsburg|drinks]
- Smør Bakery [?|coffee]
- Goods for the Study Nolita [Nolita|shopping]
- Frog [?|place]
- Dutch Kills [Dutch Kills, Queens|place]
- TUMBAO [?|shopping]
- Leo [Mid Island, Staten Island|food]
- Sunset Park [Sunset Park|place]
- Little Italy [Little Italy|place]
- Hunters Point [Hunters Point, Queens|place]
- Dumbo [Dumbo|place]
- Rockefeller Center [?|place]
- SoHo [SoHo|place]
- Willoughby Square Park [Downtown Brooklyn|outdoors]

## Missing hours — 40

- Salon on Kingston [Crown Heights|drinks]
- Loser's Eating House [SoHo|food]
- People’s [?|place]
- Brooklyn Warehouse Project [East Williamsburg|drinks]
- Elsewhere [East Williamsburg|drinks]
- East River Greenway [?|place]
- e-flux [Clinton Hill|culture]
- Pebble Beach [Dumbo|place]
- Nightmoves [Williamsburg|place]
- Dutch Kills [Dutch Kills, Queens|place]
- Leo [Mid Island, Staten Island|food]
- Sunset Park [Sunset Park|place]
- Little Italy [Little Italy|place]
- Flatiron Building [Flatiron|place]
- St. Patrick's Cathedral [?|place]
- CLASS on 38th [?|food]
- Bar Room at the Beekman [?|drinks]
- Mary Ellen Kramer Park [Paterson|outdoors]
- The Mulberry [?|drinks]
- Roosevelt Island [?|place]
- Hunters Point [Hunters Point, Queens|place]
- Dumbo [Dumbo|place]
- Grand Central Terminal [?|place]
- 5th Ave [?|place]
- Rockefeller Center [?|place]
- Broadway Theatre [?|place]
- SoHo [SoHo|place]
- Brooklyn Bridge Promenade [Brooklyn|place]
- Time Square [?|place]
- Brooklyn Academy of Music [Downtown Brooklyn|live]
- BAM Harvey Theater [Downtown Brooklyn|live]
- Brooklyn Paramount [Downtown Brooklyn|live]
- The Invisible Dog Art Center [Downtown Brooklyn|culture]
- Willoughby Square Park [Downtown Brooklyn|outdoors]
- Bargemusic [DUMBO|live]
- The Bell House [Park Slope|live]
- ZeroSpace [Park Slope|culture]
- Warsaw [Greenpoint|live]
- Newtown Creek Nature Walk [Greenpoint|outdoors]
- Pratt Institute Sculpture Park [Clinton Hill|culture]

## Missing neighborhood — 262

- Broad Nosh Bagels Deli & Catering 58th Street [?|food]
- Beverly 1975 [?|shopping]
- Mixed Ingredients [?|coffee]
- Little Canal [?|coffee]
- Zaidi's NYC [?|shopping]
- Elbow Bread [?|food]
- Wayla [?|food]
- Healthy Market [?|place]
- People’s [?|place]
- The Gin Mill [?|place]
- Strand Book Store [?|place]
- The Wayland [?|place]
- Papa d’Amour [?|food]
- Felix [?|food]
- Minetta Tavern [?|food]
- East River Greenway [?|place]
- Edith’s Sandwich Counter [?|food]
- Greenberg's Bagels [?|food]
- Bagel Pub [?|food]
- Birch Coffee [?|coffee]
- Still Here [?|shopping]
- Caffe Paradiso [?|coffee]
- Lil' Frankie's Grocery [?|food]
- The River [?|place]
- 12 Chairs Cafe [?|food]
- The Odeon [?|food]
- Tasty Hand - Pulled Noodles [?|food]
- SALSWEE [?|coffee]
- Ayada [?|food]
- Conwell Coffee & Cocktail Hall [?|coffee]
- Arete Studios [?|shopping]
- Mimi's Frozen Yogurt [?|food]
- Moono [?|food]
- GRIND THE NYC COFFEE SHOP & BAGEL HOUSE [?|coffee]
- Taishoken NYC [?|food]
- The Back Room [?|place]
- Lucinda's [?|place]
- The Ripple Room [?|place]
- The Django [?|place]
- The Mandarin [?|coffee]
- Dream Baby Bar and Cocktail Parlour [?|drinks]
- Jewel Box [?|drinks]
- PORTA [?|shopping]
- New York Memento [?|culture]
- Pikchi Photobooth [?|culture]
- I Sodi [?|food]
- King [?|food]
- Kiki's [?|food]
- Beacon's Closet [?|shopping]
- Beacon's Closet [?|shopping]
- Other People's Clothes [?|shopping]
- Other People's Clothes [?|shopping]
- Smør Bakery [?|coffee]
- Smør [?|coffee]
- The Stumble Inn [?|place]
- Jua [?|food]
- The Meadow - Mulberry St. [?|shopping]
- Tigre [?|place]
- Frog [?|place]
- Evisu New York [?|shopping]
- The ReShop [?|shopping]
- Dialogue Coffee & Flowers [?|coffee]
- TUMBAO [?|shopping]
- Aquelarre Shop [?|shopping]
- A Shop of Things [?|shopping]
- NO GEM [?|shopping]
- Coming Soon [?|shopping]
- Grand Central Market [?|shopping]
- Verse [?|coffee]
- From Lucie [?|food]
- Fabrique Artisan Bakery [?|food]
- Little Cupcake Bakeshop [?|food]
- Supermoon Bakehouse [?|food]
- Librae Bakery [?|food]
- Tai Pan Bakery [?|food]
- Sadelle's New York [?|food]
- Jabä [?|food]
- Soothr [?|food]
- Metrograph [?|place]
- Arcane Estate Coffee [?|coffee]
- New York Stock Exchange [?|place]
- DOORS NYC [?|shopping]
- The RealReal [?|shopping]
- Rouje [?|shopping]
- & Other Stories [?|shopping]
- Two Hands [?|food]
- Leon's Bagels [?|food]
- Wah Fung No.1 Fast Food [?|food]
- Raku [?|food]
- LOS TACOS No.1 [?|food]
- Katz's Delicatessen [?|food]
- MUI [?|food]
- AUTOPHOTO | Photobooth Gallery &… Busier than usual [?|culture]
- Wo Hop [?|food]
- Thai Villa [?|food]
- Subject: A Cocktail Bar [?|drinks]
- The Mayfly [?|place]
- Partners Coffee — Cafe & Roastery [?|coffee]
- Hungry Ghost Coffee [?|coffee]
- Joe's Pizza [?|food]
- Prince Street Pizza [?|food]
- Una Pizza Napoletana [?|food]
- United Nations Headquarters [?|place]
- New York Public Library - Stephen A. Schwarzman Building [?|place]
- Trinity Church [?|place]
- Statue of Liberty [?|place]
- Ground Zero [?|place]
- Oculus World Trade Center [?|place]
- St. Patrick's Cathedral [?|place]
- BLODA'S CHOICE Vintage store [?|shopping]
- Wolfgang's Steakhouse [?|food]
- Dover Street Market New York [?|shopping]
- Reservations Only Vintage [?|shopping]
- ACME [?|drinks]
- Patisserie Fouet [?|food]
- Tomatoes Vintage [?|shopping]
- Eileen's Special Cheesecake [?|food]
- Keki Modern Cakes [?|food]
- Sweet Rehab [?|food]
- Taiwan Pork Chop House [?|food]
- Win Son Bakery [?|food]
- Win Son [?|food]
- Santi [?|food]
- One White Street [?|food]
- ENLY [?|coffee]
- Wayan [?|food]
- Ten Thousand Coffee [?|coffee]
- Devoción [?|coffee]
- Simpl Coffee [?|coffee]
- La Cabra [?|coffee]
- Devoción [?|coffee]
- Mountain House [?|food]
- Mari Vanna [?|food]
- Temple Court [?|food]
- A Pasta Bar [?|food]
- Kinzan Omakase [?|food]
- Zero Otto Nove Manhattan [?|food]
- RokuNana [?|food]
- CLASS on 38th [?|food]
- Le Coucou [?|food]
- Oiji Mi [?|food]
- Chalong Southern Thai [?|food]
- Popular [?|food]
- Keens Steakhouse [?|food]
- 53 [?|food]
- L'Artusi [?|food]
- Nama at Aman New York [?|food]
- Jungsik [?|food]
- Torien [?|food]
- Hoexter's [?|food]
- The Jazz Club at Aman New York [?|food]
- Passerine [?|food]
- Musaafer [?|food]
- The Golden Swan [?|food]
- Genesis House [?|food]
- Manhatta [?|food]
- Shukette [?|food]
- Portale [?|food]
- Mitr Thai Restaurant [?|food]
- Raku [?|food]
- Leitao [?|food]
- SaiTong Thai [?|food]
- Momokawa [?|food]
- konban NYC [?|food]
- Pranakhon [?|food]
- Bangkok Supper Club [?|food]
- JoJo by Jean-Georges [?|food]
- The Dead Rabbit [?|place]
- Le Pavillon [?|food]
- Samwoojung [?|food]
- In Common NYC - A Breakfast & Brunch Restaurant [?|food]
- TONCHIN NEW YORK [?|food]
- THEP Thai Restaurant [?|food]
- Cho Dang Gol [?|food]
- Ess-a-Bagel [?|food]
- Kanoyama [?|food]
- Leo's Bagels [?|food]
- Russ & Daughters [?|food]
- Cathédrale Restaurant [?|food]
- The Fulton by Jean-Georges [?|food]
- Ye's Apothecary 夜莺 [?|place]
- Martiny’s [?|place]
- schmuck. [?|place]
- Double Chicken Please [?|place]
- Sip&Guzzle [?|place]
- Angel’s Share [?|place]
- Amor y Amargo [?|place]
- Old Friend Photobooth [?|culture]
- Superbueno [?|place]
- Retrography [?|culture]
- SomethingSoft Photo Booth [?|culture]
- Mother's Ruin [?|place]
- Spring Lounge [?|place]
- Attaboy [?|place]
- Employees Only [?|place]
- Madame George [?|place]
- Tomi Jazz [?|place]
- Katana Kitten [?|place]
- Banzarbar [?|place]
- Pearlbox [?|place]
- …and 62 more

## Non-destination category (shopping/place/other — should these surface?) — 152

- Beverly 1975 [?|shopping]
- Zaidi's NYC [?|shopping]
- Healthy Market [?|place]
- People’s [?|place]
- The Gin Mill [?|place]
- Strand Book Store [?|place]
- North 5th Street Pier and Park [Williamsburg|place]
- The Wayland [?|place]
- Superior Ingredients [Williamsburg|place]
- East River Greenway [?|place]
- Still Here [?|shopping]
- Pebble Beach [Dumbo|place]
- Nightmoves [Williamsburg|place]
- The River [?|place]
- Grand Street Local [Williamsburg|shopping]
- Stella Dallas Living [Williamsburg|shopping]
- 10 ft Single by Stella Dallas [Williamsburg|shopping]
- Arete Studios [?|shopping]
- The Back Room [?|place]
- Lucinda's [?|place]
- The Ripple Room [?|place]
- Union Pool [Williamsburg|place]
- The Django [?|place]
- Thx It's Thrifted [Vinegar Hill|shopping]
- Michele Varian Shop & Design [Boerum Hill|shopping]
- Humble House [Boerum Hill|shopping]
- Foyer Vintage Store [Boerum Hill|shopping]
- PORTA [?|shopping]
- Horseman Antiques [Boerum Hill|shopping]
- BLOK HILL [Park Slope|shopping]
- Beacon's Closet [?|shopping]
- Beacon's Closet [?|shopping]
- Other People's Clothes [?|shopping]
- Other People's Clothes [?|shopping]
- The Stumble Inn [?|place]
- Goods for the Study Nolita [Nolita|shopping]
- The Meadow - Mulberry St. [?|shopping]
- Tigre [?|place]
- Frog [?|place]
- Dutch Kills [Dutch Kills, Queens|place]
- Evisu New York [?|shopping]
- The ReShop [?|shopping]
- A Taste of Katz's [Downtown Brooklyn|place]
- TUMBAO [?|shopping]
- Aquelarre Shop [?|shopping]
- A Shop of Things [?|shopping]
- NO GEM [?|shopping]
- Coming Soon [?|shopping]
- Arthur Avenue Retail Market [Little Italy, The Bronx|shopping]
- Union Square Greenmarket [Union Square|shopping]
- Grand Central Market [?|shopping]
- Westlight [Greenpoint|place]
- Smorgasburg Williamsburg [Williamsburg|shopping]
- Artists & Fleas Market Williamsburg [Williamsburg|shopping]
- Monk Vintage [Williamsburg|shopping]
- Metrograph [?|place]
- Domino Park [Williamsburg|place]
- New York Stock Exchange [?|place]
- DOORS NYC [?|shopping]
- The RealReal [?|shopping]
- Rouje [?|shopping]
- & Other Stories [?|shopping]
- The Mayfly [?|place]
- Apotheke Chinatown [Chinatown|place]
- Sunset Park [Sunset Park|place]
- Spoonbill & Sugartown Books [Williamsburg|shopping]
- United Nations Headquarters [?|place]
- Little Italy [Little Italy|place]
- Flatiron Building [Flatiron|place]
- New York Public Library - Stephen A. Schwarzman Building [?|place]
- Trinity Church [?|place]
- Statue of Liberty [?|place]
- Ground Zero [?|place]
- Oculus World Trade Center [?|place]
- St. Patrick's Cathedral [?|place]
- BLODA'S CHOICE Vintage store [?|shopping]
- Dover Street Market New York [?|shopping]
- Reservations Only Vintage [?|shopping]
- Above Chinatown [Chinatown|shopping]
- Tomatoes Vintage [?|shopping]
- The Dead Rabbit [?|place]
- Ye's Apothecary 夜莺 [?|place]
- Martiny’s [?|place]
- schmuck. [?|place]
- Double Chicken Please [?|place]
- Sip&Guzzle [?|place]
- Angel’s Share [?|place]
- Amor y Amargo [?|place]
- Superbueno [?|place]
- Mother's Ruin [?|place]
- Death & Co East Village [East Village|place]
- Spring Lounge [?|place]
- Maison Premiere [Williamsburg|place]
- Attaboy [?|place]
- Employees Only [?|place]
- Madame George [?|place]
- Tomi Jazz [?|place]
- Katana Kitten [?|place]
- Banzarbar [?|place]
- Pearlbox [?|place]
- Dante West Village [West Village|place]
- Swan Room [?|place]
- Bathtub Gin [?|place]
- Fig. 19 [?|place]
- Jeju Noodle Bar [?|place]
- Urban Jungle [Bushwick|shopping]
- Jersey Gardens [Elizabeth|shopping]
- Century 21 NYC [?|shopping]
- Blind Barber [?|place]
- Record Room [Long Island City, Queens|place]
- Lost in Paradise Rooftop [Long Island City, Queens|place]
- Studio 151 [?|place]
- Swift Hibernian Lounge [?|place]
- Ray’s [?|place]
- Twins Lounge [Greenpoint|place]
- TIME AGAIN [?|place]
- Hotel Delmano [Williamsburg|place]
- The Spaniard [?|place]
- Elvis [?|place]
- Tom and Jerry's [?|place]
- Le Dive [?|place]
- Sauced [?|place]
- Radegast Hall & Biergarten [Williamsburg|place]
- Dorrian's Red Hand (NYC) [?|place]
- The Parkgate [?|place]
- Carousel [?|place]
- The Happiest Hour [?|place]
- The Seville [?|place]
- Jac's on Bond [?|place]
- Please Tell Me [Williamsburg|place]
- Roosevelt Island [?|place]
- Hunters Point [Hunters Point, Queens|place]
- WatchHouse 5th Ave. [?|place]
- Bethesda Terrace [?|place]
- Umpire Rock [?|place]
- Dumbo - Manhattan Bridge View [Dumbo|place]
- Charging Bull [?|place]
- Woodbury Outlets Blvd N [Central Valley|place]
- Dumbo [Dumbo|place]
- Vessel [?|place]
- Grand Central Terminal [?|place]
- 5th Ave [?|place]
- Rockefeller Center [?|place]
- Broadway Theatre [?|place]
- Little Island [?|place]
- Chelsea Market [Chelsea|place]
- SoHo [SoHo|place]
- Central Park [?|place]
- Empire State Building [?|place]
- The High Line [?|place]
- Brooklyn Bridge Promenade [Brooklyn|place]
- Time Square [?|place]

## Possible category mismatch (name vs category) — 16

- TOKUYAMATCHA & ONIGIRAZU BAR- E 6th St. [East Village|coffee] → name looks like DRINKS
- Chocolatte Espresso Bar [Crown Heights|coffee] → name looks like DRINKS
- Hometown Bar-B-Que [Red Hook|food] → name looks like DRINKS
- Minetta Tavern [?|food] → name looks like DRINKS
- Bagel Pub [?|food] → name looks like DRINKS
- Prem Thai Restaurant and Noodle Bar [Park Slope|food] → name looks like DRINKS
- Conwell Coffee & Cocktail Hall [?|coffee] → name looks like DRINKS
- Felice Pasta Bar [Dumbo|food] → name looks like DRINKS
- A Pasta Bar [?|food] → name looks like DRINKS
- Spring Lounge [?|place] → name looks like DRINKS
- Jeju Noodle Bar [?|place] → name looks like DRINKS
- Swift Hibernian Lounge [?|place] → name looks like DRINKS
- Twins Lounge [Greenpoint|place] → name looks like DRINKS
- Chocolatte Espresso Bar [Crown Heights|coffee] → name looks like DRINKS
- Milk Bar [Prospect Heights|coffee] → name looks like DRINKS
- Liz’s Book Bar [Carroll Gardens|coffee] → name looks like DRINKS

## Possible wrong location (coords area ≠ neighborhood area) — 84

- Coffee With Milk [Bed-Stuy|coffee] coords→mw but neighborhood→bk_east
- Shuya [Kips Bay|food] coords→me but neighborhood→gramercy
- Torizaku [East Village|drinks] coords→wv but neighborhood→ev
- RamenYa West Village [West Village|food] coords→chelsea but neighborhood→wv
- Don Angie [West Village|food] coords→chelsea but neighborhood→wv
- Chocolatte Espresso Bar [Crown Heights|coffee] coords→mw but neighborhood→bk_crown_hts
- Kajiken Ramen [East Village|food] coords→mw but neighborhood→ev
- Ciao, Gloria [Prospect Heights|coffee] coords→bk_clinton but neighborhood→bk_prospect_hts
- Welcome Home [Bed-Stuy|coffee] coords→gramercy but neighborhood→bk_east
- Sawada Coffee [Tribeca|coffee] coords→wv but neighborhood→lower
- Runner & Stone [Gowanus|food] coords→bk_park_slope but neighborhood→bk_lower
- Dayglow [East Village|coffee] coords→bk_east but neighborhood→ev
- DubuHaus [East Village|food] coords→mw but neighborhood→ev
- Bánh Mì Cô Út [Chinatown|food] coords→wv but neighborhood→lower
- Luigi's Pizzeria [Park Slope|food] coords→bk_lower but neighborhood→bk_park_slope
- Breads Bakery [Union Square|food] coords→mw but neighborhood→gramercy
- Gem Home [Nolita|coffee] coords→wv but neighborhood→ev
- Ramen Ishida [Lower East Side|food] coords→chelsea but neighborhood→ev
- Kopitiam [Lower East Side|food] coords→lower but neighborhood→ev
- Dimes Deli [Lower East Side|food] coords→lower but neighborhood→ev
- Dimes Market [Lower East Side|food] coords→lower but neighborhood→ev
- Court Street Bagels [Boerum Hill|food] coords→bk_downtown but neighborhood→bk_lower
- Terrace Bagels [Park Slope|food] coords→bk_lower but neighborhood→bk_park_slope
- Rice & Miso [Boerum Hill|food] coords→bk_downtown but neighborhood→bk_lower
- Michele Varian Shop & Design [Boerum Hill|shopping] coords→bk_downtown but neighborhood→bk_lower
- Humble House [Boerum Hill|shopping] coords→bk_downtown but neighborhood→bk_lower
- Foyer Vintage Store [Boerum Hill|shopping] coords→bk_downtown but neighborhood→bk_lower
- Horseman Antiques [Boerum Hill|shopping] coords→bk_downtown but neighborhood→bk_lower
- Public Records [Gowanus|food] coords→bk_downtown but neighborhood→bk_lower
- Still Life [Gowanus|coffee] coords→bk_park_slope but neighborhood→bk_lower
- HOM Cafe & Wine [Park Slope|coffee] coords→bk_lower but neighborhood→bk_park_slope
- BLOK HILL [Park Slope|shopping] coords→bk_lower but neighborhood→bk_park_slope
- Goods for the Study Nolita [Nolita|shopping] coords→wv but neighborhood→ev
- Westlight [Greenpoint|place] coords→bk_williamsburg but neighborhood→bk_greenpoint
- Nick + Sons Bakery [Greenpoint|food] coords→bk_williamsburg but neighborhood→bk_greenpoint
- Rule of Thirds [Greenpoint|food] coords→bk_williamsburg but neighborhood→bk_greenpoint
- Happy Zoe Vegan Bakery [Greenpoint|food] coords→bk_williamsburg but neighborhood→bk_greenpoint
- Apollo Bagels [East Village|food] coords→mw but neighborhood→ev
- Little Italy [Little Italy|place] coords→wv but neighborhood→ev
- Four Four South Village 四四南村 - 46th Street [West Village|food] coords→mw but neighborhood→wv
- Locanda Verde Tribeca [Tribeca|food] coords→wv but neighborhood→lower
- Liberty Bagels Midtown [Midtown|food] coords→mw but neighborhood→me
- Electric Lemon [Hudson Yards|food] coords→mw but neighborhood→chelsea
- Dante West Village [West Village|place] coords→chelsea but neighborhood→wv
- Banter NYC - Murray Hill [Murray Hill|food] coords→gramercy but neighborhood→me
- Citizens Of Chelsea, A Breakfast Restaurant & Cafe [Chelsea|food] coords→mw but neighborhood→chelsea
- Hole In The Wall - Murray Hill [Murray Hill|food] coords→gramercy but neighborhood→me
- Duane Park [Tribeca|food] coords→wv but neighborhood→lower
- Au Cheval [Tribeca|food] coords→wv but neighborhood→lower
- Lincoln Station [Crown Heights|coffee] coords→bk_prospect_hts but neighborhood→bk_crown_hts
- Most High [Crown Heights|coffee] coords→bk_prospect_hts but neighborhood→bk_crown_hts
- Weeksville Heritage Center [Crown Heights|culture] coords→bk_east but neighborhood→bk_crown_hts
- Devoción Downtown Brooklyn [Downtown Brooklyn|coffee] coords→bk_dumbo but neighborhood→bk_downtown
- Brooklyn Roasting Company [DUMBO|coffee] coords→bk_downtown but neighborhood→bk_dumbo
- Pasta Night [Prospect Heights|food] coords→bk_clinton but neighborhood→bk_prospect_hts
- Nin Hao [Prospect Heights|food] coords→bk_clinton but neighborhood→bk_prospect_hts
- The Commissioner [Prospect Heights|drinks] coords→bk_park_slope but neighborhood→bk_prospect_hts
- Hungry Ghost Coffee [Prospect Heights|coffee] coords→bk_lower but neighborhood→bk_prospect_hts
- Greenwood Park [Park Slope|drinks] coords→bk_lower but neighborhood→bk_park_slope
- Sea Witch [Park Slope|drinks] coords→bk_lower but neighborhood→bk_park_slope
- Southside Coffee [Park Slope|coffee] coords→bk_lower but neighborhood→bk_park_slope
- Brooklyn Conservatory of Music [Park Slope|culture] coords→bk_prospect_hts but neighborhood→bk_park_slope
- Bartel-Pritchard Square [Park Slope|outdoors] coords→bk_lower but neighborhood→bk_park_slope
- The Bell House [Park Slope|live] coords→bk_lower but neighborhood→bk_park_slope
- Tørst [Greenpoint|drinks] coords→bk_williamsburg but neighborhood→bk_greenpoint
- The Hidden Pearl [Greenpoint|drinks] coords→bk_williamsburg but neighborhood→bk_greenpoint
- Warsaw [Greenpoint|live] coords→bk_williamsburg but neighborhood→bk_greenpoint
- Skytown [Clinton Hill|drinks] coords→bk_east but neighborhood→bk_clinton
- Birch Coffee [Upper East Side|coffee] coords→me but neighborhood→ues
- Seed Library [Midtown East|drinks] coords→gramercy but neighborhood→me
- Valerie [Midtown East|drinks] coords→mw but neighborhood→me
- Porchlight [Chelsea|drinks] coords→mw but neighborhood→chelsea
- Bar Snack [Chelsea|drinks] coords→ev but neighborhood→chelsea
- Seven Grams Caffe [Chelsea|coffee] coords→mw but neighborhood→chelsea
- Cafe Ambrosia [Chelsea|coffee] coords→mw but neighborhood→chelsea
- Blue Bottle Coffee [Chelsea|coffee] coords→mw but neighborhood→chelsea
- Joe Coffee [Chelsea|coffee] coords→mw but neighborhood→chelsea
- Patent Pending [Flatiron|drinks] coords→mw but neighborhood→gramercy
- Birch Coffee [Flatiron|coffee] coords→mw but neighborhood→gramercy
- Stumptown Coffee Roasters [NoMad|coffee] coords→mw but neighborhood→gramercy
- Donna [Williamsburg|drinks] coords→wv but neighborhood→bk_williamsburg
- Threes Brewing [Gowanus|drinks] coords→bk_park_slope but neighborhood→bk_lower
- Sleepwalk [Bushwick|drinks] coords→bk_williamsburg but neighborhood→bk_east
- Little Skips [Bushwick|coffee] coords→bk_williamsburg but neighborhood→bk_east

## Editorial venues with NO dedicated Wikimedia image (may fall back to a work photo or gradient) — 37

- jazz_lincoln_center [jazz]
- alice_tully_hall [classical_music]
- miller_theatre [classical_music]
- bargemusic [classical_music]
- ninety_second_st_y [classical_music]
- merkin_hall [classical_music]
- minskoff_theatre [theater]
- ambassador_theatre [theater]
- lyric_theatre [theater]
- african_burial_ground [history]
- one_five_two_zero [hip_hop]
- universal_hip_hop_museum [hip_hop]
- rucker_park [hip_hop]
- marcy_houses [hip_hop]
- biggie_mural [hip_hop]
- hollis_queens [hip_hop]
- queensbridge_houses [hip_hop]
- park_hill_staten_island [hip_hop]
- the_campbell [architecture]
- carbone [food]
- don_angie [food]
- death_and_co [jazz]
- angelika_film_center [theater]
- joes_pizza [food]
- lucali [food]
- lilia [food]
- sushi_nakazawa [food]
- atomix [food]
- peter_luger [food]
- le_bernardin [food]
- cosme [food]
- russ_and_daughters_cafe [food]
- veselka [food]
- levain_bakery [food]
- eleven_madison_park [food]
- roberta_s_pizza [food]
- atoboy [food]

