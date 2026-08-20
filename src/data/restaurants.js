// ── Restaurant data layer ───────────────────────────────────────────────────
// Extracted from App.jsx 2026-08-19 ("jsx runs code; data lives in data/").
// The Planner's meal-suggestion pool + the cuisine picker draw ONLY from here.
// cuisines tags must be CUISINE_OPTIONS ids. RESTAURANT_COORDS are authored
// in-repo (Leaflet no-Google-coords rule). Keep every cuisine ≥5 entries
// (coverage rule, V1_1_PLAN.md Pillar 1).

// ── Restaurant Data ──────────────────────────────────────────────────────────
export const CUISINE_OPTIONS = [
  // Budget is a PRICE filter wearing the cuisine picker's clothes (2026-07-21):
  // ≤ ~$20/person (the '$' tier). restaurantPool special-cases the id.
  { id: 'budget',     label: 'Budget',      emoji: '💸', color: '#0d9488' },
  { id: 'japanese',   label: 'Japanese',    emoji: '🍣', color: '#e11d48' },
  { id: 'chinese',    label: 'Chinese',     emoji: '🥟', color: '#b45309' },
  { id: 'korean',     label: 'Korean',      emoji: '🍲', color: '#ea580c' },
  { id: 'italian',    label: 'Italian',     emoji: '🍝', color: '#16a34a' },
  { id: 'pizza',      label: 'Pizza',       emoji: '🍕', color: '#dc2626' },
  { id: 'burger',     label: 'Burger',      emoji: '🍔', color: '#92400e' },
  { id: 'bar_tavern', label: 'Bar',         emoji: '🍺', color: '#6d28d9' },
  { id: 'steakhouse', label: 'Steak',       emoji: '🥩', color: '#991b1b' },
  { id: 'american',   label: 'American',    emoji: '🍳', color: '#1e40af' },
  // 2026-08-19: unlocked by the seed merge — these tags existed on the data
  // but the picker never offered them (De Mole was tagged 'american' for it).
  { id: 'thai',       label: 'Thai',        emoji: '🌶️', color: '#a16207' },
  { id: 'mexican',    label: 'Mexican',     emoji: '🌮', color: '#0e7490' },
  { id: 'french',     label: 'French',      emoji: '🥐', color: '#7c3aed' },
  { id: 'seafood',    label: 'Seafood',     emoji: '🦞', color: '#be185d' },
  // Cafe = bakeries, cafés, bagels, desserts — the light-lunch / sweet-stop
  // option. Seeds tagged with any of those roll up here.
  { id: 'cafe',       label: 'Cafe',        emoji: '☕', color: '#78716c' },
]

export const RESTAURANT_DATA = [
  // ── MIDTOWN ──
  { id: 'sushi_yasuda',    name: 'Sushi Yasuda',       cuisines: ['japanese'],   area: 'Midtown', price: '$$$', neighborhood: 'Midtown East',   description: 'Pristine traditional Edomae sushi in a serene bamboo-walled room. One of NYC\'s finest.',      reservationUrl: 'https://www.sushiyasuda.com/reservations.html',    mapsUrl: 'https://maps.google.com/?q=Sushi+Yasuda+New+York' },
  { id: 'ootoya_midtown',  name: 'Ootoya',             cuisines: ['japanese'],   area: 'Midtown', price: '$$',  neighborhood: 'Midtown',         description: 'Homestyle Japanese teishoku sets — rice, miso soup, pickles, grilled fish or tonkatsu.',      reservationUrl: 'https://www.opentable.com/ootoya-chelsea',          mapsUrl: 'https://maps.google.com/?q=Ootoya+Midtown+New+York' },
  { id: 'marea',           name: 'Marea',              cuisines: ['italian'],    area: 'Midtown', price: '$$$$',neighborhood: 'Central Park South', description: 'Michelin-starred coastal Italian — impeccable seafood pastas and crudo overlooking the park.', reservationUrl: 'https://www.opentable.com/marea',                   mapsUrl: 'https://maps.google.com/?q=Marea+Restaurant+New+York' },
  { id: 'the_modern',      name: 'The Modern',         cuisines: ['american'],   area: 'Midtown', price: '$$$$',neighborhood: 'Midtown (MoMA)',   description: 'Danny Meyer\'s MoMA restaurant with floor-to-ceiling sculpture garden views and seasonal tasting menus.', reservationUrl: 'https://www.opentable.com/the-modern',         mapsUrl: 'https://maps.google.com/?q=The+Modern+Restaurant+MoMA+New+York' },
  { id: 'campbell',        name: 'The Campbell',       cuisines: ['bar_tavern'], area: 'Midtown', price: '$$',  neighborhood: 'Grand Central',    description: 'Jaw-dropping 1920s Gilded Age bar inside Grand Central — gilded ceiling, roaring fireplace, craft cocktails.', reservationUrl: 'https://thecampbellnyc.com',                    mapsUrl: 'https://maps.google.com/?q=The+Campbell+Grand+Central+New+York' },
  { id: 'benjamin_steak',  name: 'Benjamin Steakhouse',cuisines: ['steakhouse'], area: 'Midtown', price: '$$$$',neighborhood: 'Midtown East',    description: 'Classic NYC prime steakhouse — USDA prime dry-aged porterhouses in an elegant Helmsley Building room.', reservationUrl: 'https://www.opentable.com/benjamin-steakhouse', mapsUrl: 'https://maps.google.com/?q=Benjamin+Steakhouse+New+York' },
  { id: 'jongno_midtown',  name: 'Jongno Gopchang',   cuisines: ['korean'],     area: 'Midtown', price: '$$',  neighborhood: 'Koreatown',       description: 'Sizzling Korean BBQ specializing in beef intestines and offcuts — bold, smoky, deeply satisfying.', reservationUrl: null,mapsUrl: 'https://maps.google.com/?q=Jongno+Gopchang+New+York' },

  // ── UPPER EAST SIDE ──
  { id: 'sushi_of_gari',   name: 'Sushi of Gari',     cuisines: ['japanese'],   area: 'Upper East Side', price: '$$$', neighborhood: 'Upper East Side', description: 'Chef Gari\'s legendary omakase — creative toppings and sauces that transformed NYC sushi culture.',  reservationUrl: 'https://www.sushiofgari.com',           mapsUrl: 'https://maps.google.com/?q=Sushi+of+Gari+New+York' },
  { id: 'caravaggio',      name: 'Caravaggio',         cuisines: ['italian'],    area: 'Upper East Side', price: '$$$', neighborhood: 'Upper East Side', description: 'Refined northern Italian — handmade pastas, excellent osso buco, hushed elegant room favored by locals.', reservationUrl: 'https://www.opentable.com/caravaggio-new-york', mapsUrl: 'https://maps.google.com/?q=Caravaggio+Restaurant+New+York' },
  { id: 'jg_melon',        name: 'J.G. Melon',         cuisines: ['burger','american'], area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'NYC burger institution since 1972 — thick patty on a bun with cottage fries, cash only, always packed.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=JG+Melon+New+York' },
  { id: 'burnside_ues',    name: 'Burnside',            cuisines: ['bar_tavern'], area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'Warm neighborhood whiskey bar — long list of Irish and Scotch whiskeys, excellent cocktails, cozy booths.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Burnside+Bar+New+York' },
  { id: 'mezzaluna',       name: 'Mezzaluna',           cuisines: ['italian','pizza'], area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'Beloved UES neighborhood Italian — thin-crust pizza from a wood-burning oven and classic pastas.',    reservationUrl: 'https://www.opentable.com/mezzaluna',   mapsUrl: 'https://maps.google.com/?q=Mezzaluna+New+York' },
  { id: 'mono_mono',       name: 'Mono+Mono',           cuisines: ['korean'],     area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'Modern Korean comfort food — crispy rice, japchae, galbi, and rice-cake stir-fry in a sleek room.',     reservationUrl: 'https://www.opentable.com/mono-mono',   mapsUrl: 'https://maps.google.com/?q=Mono+Mono+New+York' },

  // ── UPPER WEST SIDE ──
  { id: 'carmines_uws',    name: 'Carmine\'s',          cuisines: ['italian'],    area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Legendary family-style Italian — enormous platters of linguine alle vongole and chicken parmigiana built for sharing.', reservationUrl: 'https://www.carminesnyc.com', mapsUrl: 'https://maps.google.com/?q=Carmine\'s+Upper+West+Side+New+York' },
  { id: 'amsterdam_ale',   name: 'Amsterdam Ale House', cuisines: ['bar_tavern'], area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: '60 taps of craft and import beer in a classic neighborhood tavern — excellent wings and a relaxed vibe.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Amsterdam+Ale+House+New+York' },
  { id: 'sushi_yasaka',    name: 'Sushi Yasaka',        cuisines: ['japanese'],   area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Quiet neighborhood sushi bar known for generous omakase value and pristine fish sourced daily.',           reservationUrl: 'https://www.opentable.com/sushi-yasaka', mapsUrl: 'https://maps.google.com/?q=Sushi+Yasaka+New+York' },
  { id: 'juliana_uws',     name: 'Juliana\'s (UWS)',    cuisines: ['pizza'],      area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Coal-fired Neapolitan pizza — charred blistered crust, San Marzano tomatoes, fresh mozzarella.',         reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Juliana\'s+Pizza+New+York' },

  // ── DOWNTOWN VILLAGE ──
  { id: 'carbone',         name: 'Carbone',             cuisines: ['italian'],    area: 'Downtown Village', price: '$$$$', neighborhood: 'Greenwich Village', description: 'The most coveted reservation in NYC — theatrical red-sauce Italian with tuxedoed captains and legendary spicy rigatoni.', reservationUrl: 'https://www.exploretock.com/carbone', mapsUrl: 'https://maps.google.com/?q=Carbone+New+York' },
  { id: 'lupa',            name: 'Lupa Osteria Romana', cuisines: ['italian'],    area: 'Downtown Village', price: '$$$', neighborhood: 'Greenwich Village', description: 'Mario Batali\'s warm Roman trattoria — impeccable house-made pastas and an extensive all-Italian wine list.', reservationUrl: 'https://www.opentable.com/lupa', mapsUrl: 'https://maps.google.com/?q=Lupa+Osteria+Romana+New+York' },
  { id: 'momofuku_noodle', name: 'Momofuku Noodle Bar', cuisines: ['japanese'],   area: 'Downtown Village', price: '$$', neighborhood: 'East Village',      description: 'David Chang\'s original noodle bar — rich tonkotsu ramen, inventive pork buns, and the bowl that started it all.', reservationUrl: 'https://www.momofuku.com/noodle-bar', mapsUrl: 'https://maps.google.com/?q=Momofuku+Noodle+Bar+New+York' },
  { id: 'corner_bistro',   name: 'Corner Bistro',       cuisines: ['burger'],     area: 'Downtown Village', price: '$',   neighborhood: 'West Village',      description: 'NYC dive bar legend since 1961 — the Bistro Burger (8oz, cheese, bacon, fried onion) for under $10.',      reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Corner+Bistro+New+York' },
  { id: 'employees_only',  name: 'Employees Only',      cuisines: ['bar_tavern'], area: 'Downtown Village', price: '$$$', neighborhood: 'West Village',      description: 'Legendary speakeasy cocktail bar behind a psychic\'s storefront — brilliant pre-Prohibition drinks and late-night food.', reservationUrl: 'https://www.employeesonlynyc.com', mapsUrl: 'https://maps.google.com/?q=Employees+Only+New+York' },
  { id: 'artichoke_pizza', name: 'Artichoke Basille\'s', cuisines: ['pizza'],     area: 'Downtown Village', price: '$',   neighborhood: 'East Village',      description: 'Thick square Sicilian slices — the artichoke-cream slice is a NYC late-night institution. Enormous portions.',   reservationUrl: null, walkIn: true, mapsUrl: 'https://maps.google.com/?q=Artichoke+Basille\'s+New+York' },
  { id: 'jeju_noodle',     name: 'Jeju Noodle Bar',     cuisines: ['korean'],     area: 'Downtown Village', price: '$$',  neighborhood: 'Greenwich Village', description: 'Creative Korean noodles rooted in Jeju Island tradition — the signature ramen broth simmers for days.',         reservationUrl: 'https://www.opentable.com/jeju-noodle-bar', mapsUrl: 'https://maps.google.com/?q=Jeju+Noodle+Bar+New+York' },

  // ── LOWER MANHATTAN ──
  { id: 'nobu_downtown',   name: 'Nobu Downtown',       cuisines: ['japanese'],   area: 'Lower Manhattan', price: '$$$$', neighborhood: 'Tribeca',          description: 'Nobu Matsuhisa\'s original NYC flagship — black cod miso and yellowtail jalapeño remain the gold standard.',  reservationUrl: 'https://www.noburestaurants.com/new-york/experience/', mapsUrl: 'https://maps.google.com/?q=Nobu+Downtown+New+York' },
  { id: 'adriennes_pizza', name: 'Adrienne\'s Pizzabar', cuisines: ['pizza'],     area: 'Lower Manhattan', price: '$$',  neighborhood: 'Financial District',  description: 'Old-school FiDi square pizza — thin-crusted, crispy-bottomed rectangular pies beloved by Wall Street workers.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Adrienne\'s+Pizzabar+New+York' },
  { id: 'dead_rabbit',     name: 'The Dead Rabbit',     cuisines: ['bar_tavern'], area: 'Lower Manhattan', price: '$$$', neighborhood: 'Financial District',  description: 'World\'s best bar (multiple awards) — impeccably researched 19th-century cocktails in a Victorian Irish pub.', reservationUrl: 'https://www.deadrabbitnyc.com', mapsUrl: 'https://maps.google.com/?q=The+Dead+Rabbit+New+York' },
  { id: 'fraunces_tavern', name: 'Fraunces Tavern',     cuisines: ['american','bar_tavern'], area: 'Lower Manhattan', price: '$$', neighborhood: 'Financial District', description: 'Where Washington bade farewell to his officers in 1783 — history in every brick, classic pub fare, beer.', reservationUrl: 'https://www.frauncestavern.com', mapsUrl: 'https://maps.google.com/?q=Fraunces+Tavern+New+York' },
  { id: 'bareburger_fidi', name: 'Bareburger',          cuisines: ['burger'],     area: 'Lower Manhattan', price: '$$',  neighborhood: 'Financial District',  description: 'Organic, all-natural burgers with creative toppings — bison, elk, turkey, or beef on a pretzel bun.',       reservationUrl: null, walkIn: true, mapsUrl: 'https://maps.google.com/?q=Bareburger+Financial+District+New+York' },
  { id: 'delmonicos',      name: 'Delmonico\'s',        cuisines: ['steakhouse'], area: 'Lower Manhattan', price: '$$$$', neighborhood: 'Financial District', description: 'America\'s oldest restaurant (1837) — the birthplace of Delmonico steak, Eggs Benedict, and Baked Alaska.', reservationUrl: 'https://www.opentable.com/delmonicos', mapsUrl: 'https://maps.google.com/?q=Delmonico\'s+New+York' },

  // ── HARLEM ──
  { id: 'sylvias',         name: 'Sylvia\'s',           cuisines: ['american'],   area: 'Harlem', price: '$$',  neighborhood: 'Harlem',            description: 'Harlem\'s soul food institution since 1962 — smothered chicken, candied yams, cornbread, and legendary gospel brunch.', reservationUrl: 'https://www.sylviasrestaurant.com', mapsUrl: 'https://maps.google.com/?q=Sylvia\'s+Restaurant+Harlem+New+York' },
  { id: 'raos',            name: 'Rao\'s',              cuisines: ['italian'],    area: 'Harlem', price: '$$$$', neighborhood: 'East Harlem',       description: 'The most impossible table in NYC — 10-table Italian red-sauce institution since 1896. Try their jarred sauce.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Rao\'s+New+York' },
  { id: 'patsys_pizza',    name: 'Patsy\'s Pizzeria',   cuisines: ['pizza'],      area: 'Harlem', price: '$',   neighborhood: 'East Harlem',       description: 'The original 1933 location — coal-fired pies that Frank Sinatra famously had flown across the country.',        reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Patsy\'s+Pizzeria+East+Harlem+New+York' },
  { id: 'ginnys',          name: 'Ginny\'s Supper Club', cuisines: ['bar_tavern','american'], area: 'Harlem', price: '$$$', neighborhood: 'Harlem', description: 'Marcus Samuelsson\'s underground jazz supper club at Red Rooster — live music, cocktails, and soulful bites.', reservationUrl: 'https://www.ginnyssupperclub.com', mapsUrl: 'https://maps.google.com/?q=Ginny\'s+Supper+Club+Harlem+New+York' },
  { id: 'lonni_bar',       name: 'Lonni\'s Bar & Lounge', cuisines: ['bar_tavern'], area: 'Harlem', price: '$$', neighborhood: 'Harlem',           description: 'Iconic Harlem neighborhood bar with a deep history in the local jazz and arts community.',                   reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Harlem+bar+New+York' },

  // ── BROOKLYN ──
  { id: 'lucali',          name: 'Lucali',              cuisines: ['pizza'],      area: 'Brooklyn', price: '$$',  neighborhood: 'Carroll Gardens',   description: 'Arguably NYC\'s best pizza — thin-crust masterpieces handmade by Mark Iacono in a tiny cash-only BYOB room.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Lucali+Pizza+Brooklyn' },
  { id: 'peter_luger',     name: 'Peter Luger Steak House', cuisines: ['steakhouse'], area: 'Brooklyn', price: '$$$$', neighborhood: 'Williamsburg', description: 'NYC\'s most iconic steakhouse since 1887 — cash-only, porterhouse-only, tableside creamed spinach, no frills.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Peter+Luger+Steak+House+Brooklyn' },
  { id: 'frankies_457',    name: 'Frankies 457 Spuntino', cuisines: ['italian'], area: 'Brooklyn', price: '$$',  neighborhood: 'Carroll Gardens',   description: 'Rustic neighborhood Italian — hand-rolled meatballs, cacio e pepe, ricotta toasts in a candle-lit garden.', reservationUrl: 'https://www.frankiesspuntino.com', mapsUrl: 'https://maps.google.com/?q=Frankies+457+Spuntino+Brooklyn' },
  { id: 'insa_korean',     name: 'Insa',                cuisines: ['korean'],     area: 'Brooklyn', price: '$$$', neighborhood: 'Gowanus',           description: 'Korean BBQ and karaoke under one roof — premium galbi, wagyu short ribs, and private karaoke rooms.',        reservationUrl: 'https://www.insabrooklyn.com', mapsUrl: 'https://maps.google.com/?q=Insa+Korean+BBQ+Brooklyn' },
  { id: 'okonomi_bk',      name: 'Okonomi',             cuisines: ['japanese'],   area: 'Brooklyn', price: '$$',  neighborhood: 'Williamsburg',      description: 'Intimate all-day Japanese breakfast and lunch omakase — pristine simplicity using the finest seasonal ingredients.', reservationUrl: 'https://www.opentable.com/okonomi', mapsUrl: 'https://maps.google.com/?q=Okonomi+Williamsburg+Brooklyn' },
  { id: 'brooklyn_inn',    name: 'Brooklyn Inn',         cuisines: ['bar_tavern'], area: 'Brooklyn', price: '$',   neighborhood: 'Cobble Hill',       description: 'Historic 1800s bar with original mahogany furniture — quiet, literary, the perfect neighborhood pub.',         reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Brooklyn+Inn+Cobble+Hill' },

  // ── BRONX ──
  { id: 'roberto_bronx',   name: 'Roberto Restaurant',  cuisines: ['italian'],    area: 'Bronx', price: '$$$',  neighborhood: 'Belmont (Bronx)',   description: 'Arthur Avenue\'s finest — authentic Calabrian Italian in the heart of the Bronx\'s Little Italy since 1983.', reservationUrl: 'https://www.opentable.com/roberto-restaurant-the-bronx', mapsUrl: 'https://maps.google.com/?q=Roberto+Restaurant+Bronx+New+York' },
  { id: 'zero_otto_nove',  name: 'Zero Otto Nove',      cuisines: ['pizza','italian'], area: 'Bronx', price: '$$', neighborhood: 'Belmont (Bronx)',  description: 'Wood-fired Neapolitan pizza on Arthur Avenue — the real Bronx Italian neighborhood experience.',             reservationUrl: 'https://www.opentable.com/zero-otto-nove', mapsUrl: 'https://maps.google.com/?q=Zero+Otto+Nove+Bronx+New+York' },
  { id: 'yankee_tavern',   name: 'Yankee Tavern',       cuisines: ['bar_tavern'], area: 'Bronx', price: '$$',   neighborhood: 'South Bronx',       description: 'Historic 1927 bar steps from Yankee Stadium — cold beer and classic bar food before the game.',              reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Yankee+Tavern+Bronx+New+York' },

  // ── QUEENS ──
  { id: 'sik_gaek',        name: 'Sik Gaek',            cuisines: ['korean'],     area: 'Queens', price: '$$',   neighborhood: 'Woodside, Queens',  description: 'Outdoor Korean BBQ in a festive tent setting — whole octopus, kalbi, and soju by the bottle.',              reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Sik+Gaek+Queens+New+York' },
  { id: 'nan_xiang',       name: 'Nan Xiang Xiao Long Bao', cuisines: ['chinese'], area: 'Queens', price: '$', neighborhood: 'Flushing, Queens',  description: 'Flushing\'s most celebrated soup dumplings — paper-thin skin bursting with broth and pork.',               reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Nan+Xiang+Xiao+Long+Bao+Queens' },
  { id: 'de_mole',         name: 'De Mole',             cuisines: ['mexican'],   area: 'Queens', price: '$$',   neighborhood: 'Sunnyside, Queens', description: 'Beloved neighborhood Mexican-American spot — complex moles, chiles rellenos, margaritas worth the trip.',    reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=De+Mole+Sunnyside+Queens' },

  // ── 2026-08-19 expansion: ≥4 per cuisine per borough (3-swaps rule) ──
  // Manhattan gaps: chinese +4, steakhouse +2, korean +1, burger +1
  { id: 'wo_hop',          name: 'Wo Hop',                  cuisines: ['chinese'],   area: 'Lower Manhattan', price: '$',    neighborhood: 'Chinatown',         description: 'Basement Cantonese institution on Mott Street since 1938 — roast pork lo mein at 2am under photos of fifty years of regulars.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Wo+Hop+17+Mott+St+New+York' },
  { id: 'ny_noodletown',   name: 'Great NY Noodletown',     cuisines: ['chinese'],   area: 'Lower Manhattan', price: '$',    neighborhood: 'Chinatown',         description: 'Roast meats hanging in the window and salt-baked seafood that chefs eat after their own shifts — cash, brusque, perfect.',      reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Great+NY+Noodletown+New+York' },
  { id: 'xian_midtown',    name: "Xi'an Famous Foods",      cuisines: ['chinese'],   area: 'Midtown',         price: '$',    neighborhood: 'Midtown West',      description: 'Hand-ripped biang biang noodles and cumin lamb burgers — the Flushing stall that conquered Manhattan, still under $15.',        reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Xian+Famous+Foods+24+W+45th+St+New+York' },
  { id: 'redfarm_hudson',  name: 'RedFarm',                 cuisines: ['chinese'],   area: 'Downtown Village', price: '$$$', neighborhood: 'West Village',      description: 'Playful greenmarket dim sum — Pac-Man shrimp dumplings and pastrami egg rolls in a barn-wood Village room.',                    reservationUrl: 'https://www.redfarmnyc.com', mapsUrl: 'https://maps.google.com/?q=RedFarm+529+Hudson+St+New+York' },
  { id: 'keens',           name: 'Keens Steakhouse',        cuisines: ['steakhouse'], area: 'Midtown',        price: '$$$$', neighborhood: 'Midtown West',      description: 'The 1885 chophouse with 45,000 churchwarden pipes on the ceiling — order the legendary mutton chop, not just the porterhouse.', reservationUrl: 'https://www.keens.com', mapsUrl: 'https://maps.google.com/?q=Keens+Steakhouse+New+York' },
  { id: 'old_homestead',   name: 'Old Homestead Steakhouse', cuisines: ['steakhouse'], area: 'Downtown Village', price: '$$$$', neighborhood: 'Meatpacking',   description: 'Serving beef in the Meatpacking District since 1868 — old-school porterhouse under the neon cow.',                             reservationUrl: 'https://www.theoldhomesteadsteakhouse.com', mapsUrl: 'https://maps.google.com/?q=Old+Homestead+Steakhouse+New+York' },
  { id: 'cho_dang_gol',    name: 'Cho Dang Gol',            cuisines: ['korean'],    area: 'Midtown',         price: '$$',   neighborhood: 'Koreatown',         description: 'K-town\'s tofu specialist — silky soondubu made in-house daily, bubbling in stone pots away from the BBQ smoke.',              reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Cho+Dang+Gol+New+York' },
  { id: 'burger_joint',    name: 'Burger Joint',            cuisines: ['burger'],    area: 'Midtown',         price: '$',    neighborhood: 'Midtown West',      description: 'A speakeasy burger counter hidden behind the lobby curtain of a luxury hotel — cash-friendly patties, graffiti walls.',        reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Burger+Joint+119+W+56th+St+New+York' },
  // Brooklyn depth: japanese +2, chinese +3, italian +2, pizza +2(+1 combo), burger combo, bar +1, american +2
  { id: 'zenkichi',        name: 'Zenkichi',                cuisines: ['japanese'],  area: 'Brooklyn',        price: '$$$',  neighborhood: 'Williamsburg',      description: 'Hidden izakaya of curtained booths and call buttons — an omakase-style date spot behind an unmarked wooden door.',             reservationUrl: 'https://www.zenkichi.com', mapsUrl: 'https://maps.google.com/?q=Zenkichi+Brooklyn' },
  { id: 'rule_of_thirds',  name: 'Rule of Thirds',          cuisines: ['japanese'],  area: 'Brooklyn',        price: '$$$',  neighborhood: 'Greenpoint',        description: 'Airy Greenpoint izakaya — koji fried chicken and seasonal small plates in a room that feels like Tokyo by way of Scandinavia.', reservationUrl: 'https://www.ruleofthirdsbk.com', mapsUrl: 'https://maps.google.com/?q=Rule+of+Thirds+Brooklyn' },
  { id: 'win_son',         name: 'Win Son',                 cuisines: ['chinese'],   area: 'Brooklyn',        price: '$$',   neighborhood: 'East Williamsburg', description: 'Taiwanese-American with a Brooklyn accent — lu rou fan, fly\'s head, and scallion pancakes with a line to prove it.',          reservationUrl: 'https://www.winsonbrooklyn.com', mapsUrl: 'https://maps.google.com/?q=Win+Son+Brooklyn' },
  { id: 'kings_co_imperial', name: 'Kings Co Imperial',     cuisines: ['chinese'],   area: 'Brooklyn',        price: '$$',   neighborhood: 'Williamsburg',      description: 'Sichuan with a garden and its own soy sauce barrels — dan dan noodles and smoked chicken under lantern light.',                reservationUrl: 'https://www.kingscoimperial.com', mapsUrl: 'https://maps.google.com/?q=Kings+Co+Imperial+Brooklyn' },
  { id: 'east_harbor',     name: 'East Harbor Seafood Palace', cuisines: ['chinese'], area: 'Brooklyn',       price: '$$',   neighborhood: 'Sunset Park',       description: 'Sunset Park\'s banquet-hall dim sum — carts of har gow and turnip cake rolling past ten-top family tables all weekend.',       reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=East+Harbor+Seafood+Palace+Brooklyn' },
  { id: 'lilia',           name: 'Lilia',                   cuisines: ['italian'],   area: 'Brooklyn',        price: '$$$',  neighborhood: 'Williamsburg',      description: 'Missy Robbins\' pasta temple in an old auto-body shop — the mafaldini with pink peppercorns earns every impossible reservation.', reservationUrl: 'https://www.lilianewyork.com', mapsUrl: 'https://maps.google.com/?q=Lilia+Brooklyn' },
  { id: 'al_di_la',        name: 'Al di Là Trattoria',      cuisines: ['italian'],   area: 'Brooklyn',        price: '$$',   neighborhood: 'Park Slope',        description: 'Venetian home cooking that made Park Slope a dining destination — malfatti and braised rabbit, no-nonsense room.',              reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Al+di+La+Trattoria+Brooklyn' },
  { id: 'lindustrie',      name: "L'industrie Pizzeria",    cuisines: ['pizza'],     area: 'Brooklyn',        price: '$',    neighborhood: 'Williamsburg',      description: 'The slice that ended the Manhattan-only argument — burrata slice with a line down South 2nd, worth every minute.',              reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Lindustrie+Pizzeria+Brooklyn' },
  { id: 'robertas',        name: "Roberta's",               cuisines: ['pizza'],     area: 'Brooklyn',        price: '$$',   neighborhood: 'Bushwick',          description: 'The Bushwick pizza compound that launched a thousand imitators — Bee Sting pie, tiki backyard, still loud, still great.',       reservationUrl: 'https://www.robertaspizza.com', mapsUrl: 'https://maps.google.com/?q=Robertas+Bushwick+Brooklyn' },
  { id: 'emmy_squared',    name: 'Emmy Squared',            cuisines: ['pizza', 'burger'], area: 'Brooklyn',  price: '$$',   neighborhood: 'Williamsburg',      description: 'Detroit-style squares with crispy cheese edges — and the Le Big Matt, quietly one of the city\'s best burgers.',               reservationUrl: 'https://www.emmysquaredpizza.com', mapsUrl: 'https://maps.google.com/?q=Emmy+Squared+Brooklyn' },
  { id: 'maison_premiere', name: 'Maison Premiere',         cuisines: ['bar_tavern'], area: 'Brooklyn',       price: '$$$',  neighborhood: 'Williamsburg',      description: 'New Orleans-style oyster and absinthe bar — a horseshoe marble counter, dollar-oyster happy hour, garden out back.',            reservationUrl: 'https://www.maisonpremiere.com', mapsUrl: 'https://maps.google.com/?q=Maison+Premiere+Brooklyn' },
  { id: 'sunday_in_bk',    name: 'Sunday in Brooklyn',      cuisines: ['american'],  area: 'Brooklyn',        price: '$$',   neighborhood: 'Williamsburg',      description: 'The malted pancakes with hazelnut maple praline are the brunch the borough queues for — dinner is quietly excellent too.',      reservationUrl: 'https://www.sundayinbrooklyn.com', mapsUrl: 'https://maps.google.com/?q=Sunday+in+Brooklyn' },
  { id: 'buttermilk_channel', name: 'Buttermilk Channel',   cuisines: ['american'],  area: 'Brooklyn',        price: '$$',   neighborhood: 'Carroll Gardens',   description: 'Carroll Gardens\' neighborhood table — buttermilk fried chicken on cheddar waffles and a warm room that feels like Sunday.',   reservationUrl: 'https://www.buttermilkchannelnyc.com', mapsUrl: 'https://maps.google.com/?q=Buttermilk+Channel+Brooklyn' },
]

// Approx [lat, lng] for the curated restaurants above. Used to rank meal
// suggestions by walking distance from the stop you're coming from. Block-level
// accuracy is plenty for ordering candidates within a neighborhood.
export const RESTAURANT_COORDS = {
  sushi_yasuda: [40.7516, -73.9730], ootoya_midtown: [40.7546, -73.9863], marea: [40.7681, -73.9819],
  the_modern: [40.7615, -73.9776], shake_shack_midtown: [40.7415, -73.9881], campbell: [40.7527, -73.9772],
  benjamin_steak: [40.7518, -73.9785], jongno_midtown: [40.7472, -73.9862],
  sushi_of_gari: [40.7714, -73.9526], caravaggio: [40.7726, -73.9655], jg_melon: [40.7706, -73.9580],
  burnside_ues: [40.7765, -73.9520], mezzaluna: [40.7707, -73.9579], mono_mono: [40.7736, -73.9566],
  carmines_uws: [40.7917, -73.9740], shake_shack_uws: [40.7806, -73.9758], amsterdam_ale: [40.7800, -73.9800],
  sushi_yasaka: [40.7785, -73.9820], juliana_uws: [40.7850, -73.9750],
  carbone: [40.7281, -74.0003], lupa: [40.7284, -74.0008], momofuku_noodle: [40.7295, -73.9847],
  corner_bistro: [40.7384, -74.0027], employees_only: [40.7339, -74.0065],
  artichoke_pizza: [40.7327, -73.9840], jeju_noodle: [40.7345, -74.0075],
  nobu_downtown: [40.7110, -74.0095], adriennes_pizza: [40.7041, -74.0113], dead_rabbit: [40.7028, -74.0113],
  fraunces_tavern: [40.7033, -74.0114], bareburger_fidi: [40.7045, -74.0070], delmonicos: [40.7045, -74.0110],
  sylvias: [40.8081, -73.9447], raos: [40.7943, -73.9344], patsys_pizza: [40.7977, -73.9347],
  ginnys: [40.8083, -73.9455], lonni_bar: [40.8089, -73.9482],
  lucali: [40.6810, -74.0010], peter_luger: [40.7099, -73.9626], frankies_457: [40.6790, -73.9990],
  insa_korean: [40.6790, -73.9860], okonomi_bk: [40.7140, -73.9490], brooklyn_inn: [40.6873, -73.9890],
  shake_bk: [40.7029, -73.9933],
  roberto_bronx: [40.8540, -73.8870], zero_otto_nove: [40.8546, -73.8880], yankee_tavern: [40.8275, -73.9270],
  sik_gaek: [40.7458, -73.9060], nan_xiang: [40.7595, -73.8310], de_mole: [40.7430, -73.9230],
  // 2026-08-19 expansion
  wo_hop: [40.7146, -73.9986], ny_noodletown: [40.7150, -73.9967], xian_midtown: [40.7562, -73.9812],
  redfarm_hudson: [40.7338, -74.0064], keens: [40.7503, -73.9863], old_homestead: [40.7420, -74.0048],
  cho_dang_gol: [40.7498, -73.9859], burger_joint: [40.7642, -73.9787],
  zenkichi: [40.7177, -73.9614], rule_of_thirds: [40.7228, -73.9553], win_son: [40.7076, -73.9426],
  kings_co_imperial: [40.7167, -73.9397], east_harbor: [40.6350, -74.0146], lilia: [40.7176, -73.9525],
  al_di_la: [40.6772, -73.9805], lindustrie: [40.7115, -73.9581], robertas: [40.7051, -73.9336],
  emmy_squared: [40.7128, -73.9553], maison_premiere: [40.7140, -73.9615], sunday_in_bk: [40.7150, -73.9657],
  buttermilk_channel: [40.6767, -73.9994],
}

// ── PLANNER_RESTAURANTS: the FULL meal-suggestion pool ──────────────────────
// 2026-08-19: the Planner previously suggested only from the curated
// RESTAURANT_DATA list above while the app's 261 enriched food seeds
// (places.js) sat unused. This merges them: seeds are normalized to the same
// shape, deduped by name against the curated list (curated wins — it has the
// house-voice descriptions), fast food excluded, and only seeds that carry a
// picker cuisine OR a price join (others surface via the no-cuisine pool).
// Seed ids are kept verbatim (seed_*) so zh translations + saved meal picks
// keep working. Coords ride on the entry itself (lat/lng) — the distance
// ranker checks RESTAURANT_COORDS first, then entry.lat/lng.
import { seedUserPlaces } from './places.js'

const PLANNER_FAST_FOOD_RE = /\b(mc\s?donald'?s|burger king|wendy'?s|kfc|popeyes|taco bell|subway|chipotle|five guys|sbarro|domino'?s|pizza hut|dunkin|chick[- ]?fil[- ]?a|white castle|wingstop|panda express|sweetgreen|chopt|pret a manger|shake shack|fast food)\b/i

// seed cuisine tag → cuisine-picker id (tags that map to nothing return null
// and the place only appears in unfiltered pools).
const SEED_CUISINE_TO_PICKER = {
  japanese: 'japanese', sushi: 'japanese', ramen: 'japanese', izakaya: 'japanese',
  chinese: 'chinese', taiwanese: 'chinese', sichuan: 'chinese', cantonese: 'chinese', 'dim sum': 'chinese',
  korean: 'korean', italian: 'italian', pizza: 'pizza', burger: 'burger',
  bar_tavern: 'bar_tavern', bar: 'bar_tavern', steakhouse: 'steakhouse', american: 'american',
  thai: 'thai', mexican: 'mexican', french: 'french', seafood: 'seafood',
  cafe: 'cafe', bakery: 'cafe', bagel: 'cafe', dessert: 'cafe', coffee: 'cafe', 'coffee shop': 'cafe',
  deli: 'american', australian: 'american',
}

// neighborhood string → the curated list's area buckets (drives the
// area-first pool + the ≤20-min commute feel).
export function neighborhoodToArea(nb) {
  const n = (nb || '').toLowerCase()
  if (/brooklyn|williamsburg|dumbo|greenpoint|bushwick|park slope|crown height|bed[- ]stuy|carroll|cobble|fort greene|clinton hill|prospect|sunset park|red hook|gowanus|boerum|downtown bk/.test(n)) return 'Brooklyn'
  if (/queens|flushing|astoria|long island city|\blic\b|sunnyside|jackson height|ridgewood|rockaway|corona/.test(n)) return 'Queens'
  if (/bronx/.test(n)) return 'Bronx'
  if (/harlem|morningside|washington height|inwood/.test(n)) return 'Harlem'
  if (/upper east/.test(n)) return 'Upper East Side'
  if (/upper west|lincoln (sq|center)/.test(n)) return 'Upper West Side'
  if (/midtown|times sq|hell'?s kitchen|koreatown|murray hill|kips bay|garment|theater district|central park|grand central|herald/.test(n)) return 'Midtown'
  if (/chinatown|financial|fidi|tribeca|civic|battery|seaport|two bridges|lower manhattan|wall st/.test(n)) return 'Lower Manhattan'
  if (/village|soho|noho|nolita|chelsea|gramercy|flatiron|union sq|meatpacking|lower east|\bles\b|bowery/.test(n)) return 'Downtown Village'
  return null // unknown → excluded from area pools, still in city-wide pool
}

const _curatedNames = new Set(RESTAURANT_DATA.map(r => r.name.toLowerCase().replace(/[^a-z0-9]/g, '')))
const _seedRestaurants = seedUserPlaces
  .filter(p => p.category === 'food' && typeof p.lat === 'number' && !PLANNER_FAST_FOOD_RE.test(p.name || ''))
  .filter(p => !_curatedNames.has((p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')))
  .map(p => {
    const tags = Array.isArray(p.cuisine) ? p.cuisine : (p.cuisine ? [p.cuisine] : [])
    const cuisines = [...new Set(tags.map(t => SEED_CUISINE_TO_PICKER[String(t).toLowerCase()]).filter(Boolean))]
    return {
      id: p.id, name: p.name, cuisines,
      area: neighborhoodToArea(p.neighborhood) || neighborhoodToArea(p.area),
      price: p.price || null, neighborhood: p.neighborhood || '',
      description: p.description || p.googleSummary || '',
      reservationUrl: p.website || null,
      mapsUrl: 'https://maps.google.com/?q=' + encodeURIComponent([p.name, p.address || 'New York'].join(' ')),
      rating: p.rating ?? null, lat: p.lat, lng: p.lng,
    }
  })
  // quality bar for auto-suggestions: enriched rating ≥ 4.3 or no rating data
  .filter(r => r.rating == null || r.rating >= 4.3)

// Area backfill for seeds with empty neighborhood strings (~94 of them):
// classify by the 3 nearest ALREADY-LABELED pool entries (majority vote).
// Coordinate-based, so it needs no neighborhood text and can't typo.
{
  const labeled = []
  for (const r of RESTAURANT_DATA) {
    const c = RESTAURANT_COORDS[r.id]
    if (r.area && c) labeled.push({ area: r.area, lat: c[0], lng: c[1] })
  }
  for (const r of _seedRestaurants) if (r.area) labeled.push({ area: r.area, lat: r.lat, lng: r.lng })
  const d2 = (a, b) => { const x = a.lat - b.lat, y = (a.lng - b.lng) * 0.76; return x * x + y * y }
  for (const r of _seedRestaurants) {
    if (r.area) continue
    const near = [...labeled].sort((a, b) => d2(a, r) - d2(b, r)).slice(0, 3)
    const tally = {}
    for (const nb of near) tally[nb.area] = (tally[nb.area] || 0) + 1
    r.area = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || null
  }
}

export const PLANNER_RESTAURANTS = [...RESTAURANT_DATA, ..._seedRestaurants]
