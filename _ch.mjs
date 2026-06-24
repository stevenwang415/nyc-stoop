import fs from 'fs'
const FILE='./src/data/places.js'
let src=fs.readFileSync(FILE,'utf8')
// 1) Recategorize existing DB entries (category sits right after name)
const recat=[['Place des Fêtes','drinks'],['Bar Laika by e-flux','drinks'],['e-flux','culture']]
for(const [name,cat] of recat){
  const re=new RegExp('(name: '+JSON.stringify(name).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+',\\s*\\n\\s*category: )"[^"]*"')
  const before=src
  src=src.replace(re,'$1'+JSON.stringify(cat))
  console.log((before!==src?'recategorized':'NOT FOUND')+': '+name+' -> '+cat)
}
// 2) Append new researched venues
const V=[
['Hartley’s','drinks','555 Myrtle Ave, Brooklyn, NY 11205',"Unassuming Irish pub pouring the neighborhood's best pint of Guinness."],
['Mama Fox','drinks','1066 Fulton St, Brooklyn, NY 11238',"Bar and restaurant with cocktails, brunch, and a sustainability bent."],
['Skytown','drinks','658 Myrtle Ave, Brooklyn, NY 11205',"Easygoing cocktail bar with a back patio."],
['Sisters','live','900 Fulton St, Brooklyn, NY 11238',"Restaurant and bar with DJ and live-music nights."],
['Sweetbee','coffee','287 Greene Ave, Brooklyn, NY 11238',"Minimalist cafe with Variety coffee, Baltazar pastries, and a great backyard."],
['Primrose Cafe','coffee','219 Dekalb Ave, Brooklyn, NY 11205',"Cozy cafe tucked under a brownstone stoop, pouring Sweetleaf beans."],
['Calyer','coffee','Grand Ave, Brooklyn, NY 11238',"Pretty eatery and coffee shop serving strong Partners Coffee."],
['Burly Coffee','coffee','591 Myrtle Ave, Brooklyn, NY 11205',"Top-rated neighborhood espresso bar."],
['The Good Batch','coffee','936 Fulton St, Brooklyn, NY 11238',"Bakery-cafe known for waffles, stroopwafels, and coffee."],
['Pratt Institute Sculpture Park','culture','200 Willoughby Ave, Brooklyn, NY 11205',"25-acre campus park with 70+ sculptures — one of the country's best university art collections."],
['Underwood Park','outdoors','Lafayette Ave & Washington Ave, Brooklyn, NY 11238',"Leafy neighborhood park with a playground and dog run."],
['Putnam Triangle Plaza','outdoors','Fulton St & Grand Ave, Brooklyn, NY 11238',"Pedestrian plaza with seating and a weekly greenmarket."],
]
const slug=s=>'seed_'+s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')+'_ch2'
const J=v=>JSON.stringify(v)
const block=([name,cat,addr,desc])=>`  {
    id: ${J(slug(name))},
    name: ${J(name)},
    category: ${J(cat)},
    cuisine: [],
    price: null,
    neighborhood: "Clinton Hill",
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
    source: "curated_clinton_hill",
    isCustom: true,
    googlePlaceId: "",
    sourceUrl: "",
    enrichedAt: null,
  },`
const idx=src.lastIndexOf('\n]')
src=src.slice(0,idx)+'\n'+V.map(block).join('\n')+src.slice(idx)
fs.writeFileSync(FILE,src)
console.log('appended',V.length,'new Clinton Hill entries')
