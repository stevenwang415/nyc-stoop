import fs from 'fs'
const FILE = './src/data/places.js'
const V = [
['Gair','drinks','41 Washington St, Brooklyn, NY 11201',[],"DUMBO's premier cocktail destination on its most-photographed corner."],
['Kinjo','drinks','55 Pearl St, Brooklyn, NY 11201',[],"Industrial-chic lounge in a former torpedo factory with Asian-inspired cocktails."],
['Nobody Told Me','drinks','60 Water St, Brooklyn, NY 11201',[],"Bright corner spot with creative cocktails and ample outdoor seating."],
['Randolph Beer DUMBO','drinks','82 Prospect St, Brooklyn, NY 11201',[],"Self-serve beer wall, skeeball, and shuffleboard."],
['Olympia Wine Bar','drinks','55 Washington St, Brooklyn, NY 11201',[],"Refined-but-casual wine bar with tapas and small plates."],
['Time Out Market New York','drinks','55 Water St, Brooklyn, NY 11201',[],"Waterfront food hall with a rooftop and close-up bridge views."],
["Harriet's Rooftop",'drinks','60 Furman St, Brooklyn, NY 11201',[],"Year-round rooftop lounge atop 1 Hotel with sweeping skyline views."],
['% Arabica','coffee','20 Old Fulton St, Brooklyn, NY 11201',[],"Kyoto import with floor-to-ceiling bridge views and house-roasted single origins."],
['Brooklyn Roasting Company','coffee','25 Jay St, Brooklyn, NY 11201',[],"Pioneering DUMBO roaster-cafe in a cavernous industrial space."],
['Bluestone Lane','coffee','55 Prospect St, Brooklyn, NY 11201',[],"Australian-style cafe with flat whites and a full brunch menu at Empire Stores."],
['Almondine Bakery','coffee','85 Water St, Brooklyn, NY 11201',[],"French bakery pairing serious pastry with espresso."],
['Joe Coffee','coffee','141 Front St, Brooklyn, NY 11201',[],"Spacious outpost of the NYC coffee chainlet, a remote-work hub."],
['Butler','coffee','40 Water St, Brooklyn, NY 11201',[],"Michelin-pedigree pastry program and espresso, from Williamsburg."],
['Fontainhas','coffee','Front St, Brooklyn, NY 11201',[],"Indian specialty coffee shop serving filter kaapi and single-origin espresso."],
["St. Ann's Warehouse",'live','45 Water St, Brooklyn, NY 11201',[],"Adventurous theater and concert presentations in a restored Tobacco Warehouse."],
['Bargemusic','live','1 Water St, Brooklyn, NY 11201',[],"World-class chamber music on the waterfront, nearly 50 years running."],
['Brooklyn Bridge Park','outdoors','334 Furman St, Brooklyn, NY 11201',[],"85-acre waterfront park with piers, lawns, and unmatched Manhattan views."],
['Empire Fulton Ferry','outdoors','26 New Dock St, Brooklyn, NY 11201',[],"Riverside lawn beneath the bridges, home to Jane's Carousel."],
['Main Street Park','outdoors','Plymouth St & Washington St, Brooklyn, NY 11201',[],"DUMBO section of Brooklyn Bridge Park with playgrounds and a pebble beach."],
['Pearl Street Triangle','outdoors','Pearl St & Water St, Brooklyn, NY 11201',[],"Cobblestone pedestrian plaza under the Manhattan Bridge."],
['John Street Park','outdoors','John St, Brooklyn, NY 11201',[],"Quiet waterfront stretch of Brooklyn Bridge Park with a tidal salt marsh."],
]
const slug = s => 'seed_' + s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'') + '_dumbo'
const J = v => JSON.stringify(v)
const block = ([name,cat,addr,cui,desc]) => `  {
    id: ${J(slug(name))},
    name: ${J(name)},
    category: ${J(cat)},
    cuisine: ${J(cui)},
    price: null,
    neighborhood: "DUMBO",
    area: "",
    lat: null,
    lng: null,
    address: ${J(addr)},
    hours: "",
    rating: null,
    website: "",
    googleSummary: "",
    description: ${J(desc)},
    insiderTip: "",
    source: "curated_dumbo",
    isCustom: true,
    googlePlaceId: "",
    sourceUrl: "",
    enrichedAt: null,
  },`
let src = fs.readFileSync(FILE,'utf8')
const idx = src.lastIndexOf('\n]')
src = src.slice(0,idx) + '\n' + V.map(block).join('\n') + src.slice(idx)
fs.writeFileSync(FILE, src)
console.log('appended', V.length, 'DUMBO entries')
