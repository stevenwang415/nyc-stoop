import fs from 'fs'
const FILE='./src/data/places.js'
const V=[
['Death & Co','drinks','East Village','ev2'],
['Attaboy','drinks','Lower East Side','ev2'],
]
const slug=(s,sfx)=>'seed_'+s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')+'_'+sfx
const J=v=>JSON.stringify(v)
const block=([name,cat,nb,sfx])=>`  {
    id: ${J(slug(name,sfx))},
    name: ${J(name)},
    category: ${J(cat)},
    cuisine: [],
    price: null,
    neighborhood: ${J(nb)},
    area: "",
    lat: null,
    lng: null,
    address: "",
    hours: "",
    rating: null,
    website: "",
    googleSummary: "",
    description: "",
    insiderTip: "",
    source: "curated_fill",
    isCustom: true,
    googlePlaceId: "",
    sourceUrl: "",
    enrichedAt: null,
  },`
let src=fs.readFileSync(FILE,'utf8')
const idx=src.lastIndexOf('\n]')
src=src.slice(0,idx)+'\n'+V.map(block).join('\n')+src.slice(idx)
fs.writeFileSync(FILE,src)
console.log('appended',V.length)
