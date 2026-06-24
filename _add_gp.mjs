import fs from 'fs'
const FILE='./src/data/places.js'
const V=[
['Tørst','drinks','615 Manhattan Ave, Brooklyn, NY 11222',"Pine-clad Danish-design beer bar — 21 drafts and ~100 bottles/cans."],
['Achilles Heel','drinks','180 West St, Brooklyn, NY 11222',"Charming waterfront tavern with cocktails, natural wine, and a Korean-inflected menu."],
['The Esters','drinks','626 Manhattan Ave, Brooklyn, NY 11222',"Plant-filled patio bar with well-made cocktails and Detroit-style pizza."],
['Bar Americano','drinks','865 Manhattan Ave, Brooklyn, NY 11222',"Aperitivo bar inspired by Spain and Northern Italy — vermouths and charcuterie."],
["Goldie's",'drinks','195 Nassau Ave, Brooklyn, NY 11222',"Retro Vegas-style dive for beer-and-shot combos and free Goldfish."],
['The Hidden Pearl','drinks','621 Manhattan Ave, Brooklyn, NY 11222',"Hidden Japanese-inspired cocktail bar behind the ramen spot Wanpaku."],
["Sonny's Corner Bar",'drinks','142 Franklin St, Brooklyn, NY 11222',"Lively corner bar in the former Pencil Factory space."],
['Cafe Grumpy','coffee','193 Meserole Ave, Brooklyn, NY 11222',"The chain's airy 2005 flagship, with its roastery next door."],
['Upright Coffee','coffee','860 Manhattan Ave, Brooklyn, NY 11222',"Local favorite on Manhattan Ave for bold Brooklyn-roasted espresso."],
['Peter Pan Donut & Pastry Shop','coffee','727 Manhattan Ave, Brooklyn, NY 11222',"Old-school Greenpoint icon for classic doughnuts, open from 4:30am."],
['Sweetleaf','coffee','159 Freeman St, Brooklyn, NY 11222',"Cozy roaster-cafe near the waterfront with house espresso."],
['Pueblo Querido Coffee Roasters','coffee','188 Driggs Ave, Brooklyn, NY 11222',"Colombian-rooted roaster serving its own single origins."],
['Champion Coffee','coffee','1108 Manhattan Ave, Brooklyn, NY 11222',"Long-running neighborhood coffee bar at the north end of Manhattan Ave."],
['Warsaw','live','261 Driggs Ave, Brooklyn, NY 11222',"Historic 1,000-cap concert hall in the Polish National Home — punk, hip-hop, rock, plus pierogi."],
['Saint Vitus','live','1120 Manhattan Ave, Brooklyn, NY 11222',"Intimate blacked-out club known for metal, punk, and hardcore shows."],
]
const slug=s=>'seed_'+s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')+'_gp'
const J=v=>JSON.stringify(v)
const block=([name,cat,addr,desc])=>`  {
    id: ${J(slug(name))},
    name: ${J(name)},
    category: ${J(cat)},
    cuisine: [],
    price: null,
    neighborhood: "Greenpoint",
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
    source: "curated_greenpoint",
    isCustom: true,
    googlePlaceId: "",
    sourceUrl: "",
    enrichedAt: null,
  },`
let src=fs.readFileSync(FILE,'utf8')
const idx=src.lastIndexOf('\n]')
src=src.slice(0,idx)+'\n'+V.map(block).join('\n')+src.slice(idx)
fs.writeFileSync(FILE,src)
console.log('appended',V.length,'Greenpoint entries')
