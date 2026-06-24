import fs from 'fs'
const FILE = './src/data/places.js'
const V = [
["Jane's Carousel",'outdoors','Empire Fulton Ferry, Brooklyn, NY 11201',[],"Restored 1922 carousel in a glass pavilion by Jean Nouvel, right under the Brooklyn Bridge."],
['Squibb Park Bridge','outdoors','Columbia Heights & Squibb Park, Brooklyn, NY 11201',[],"Bouncing wood-and-steel pedestrian bridge linking Brooklyn Heights down to Brooklyn Bridge Park's Pier 1."],
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
console.log('appended', V.length)
