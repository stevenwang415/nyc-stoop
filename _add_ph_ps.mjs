import fs from 'fs'
const FILE='./src/data/places.js'
// [name, category, neighborhood, address, description, suffix]
const V=[
// ---- Prospect Heights & Park ----
['Olmsted','food','Prospect Heights','659 Vanderbilt Ave, Brooklyn, NY 11238','Inventive farm-to-table New American with a backyard garden.','ph'],
['Sofreh','food','Prospect Heights','75 St Marks Ave, Brooklyn, NY 11217','One of the city’s best Persian restaurants — smoky eggplant, lamb shank.','ph'],
['The Vanderbilt','food','Prospect Heights','570 Vanderbilt Ave, Brooklyn, NY 11238','Mellow gastropub with comfort food and craft beer.','ph'],
['Chuko','food','Prospect Heights','565 Vanderbilt Ave, Brooklyn, NY 11238','Beloved ramen shop with rich broths and small plates.','ph'],
['Faun','food','Prospect Heights','606 Vanderbilt Ave, Brooklyn, NY 11238','Seasonal Italian with house-made pastas in a candlelit room.','ph'],
['Pasta Night','food','Prospect Heights','251 Park Pl, Brooklyn, NY 11238','Petite spot for fresh, reasonably-priced pasta.','ph'],
['Nin Hao','food','Prospect Heights','736 Washington Ave, Brooklyn, NY 11238','Highly-rated modern Chinese on Washington Ave.','ph'],
['Weather Up','drinks','Prospect Heights','589 Vanderbilt Ave, Brooklyn, NY 11238','Discreet craft cocktail bar with fancy ice and a greenery-draped patio.','ph'],
['LaLou','drinks','Prospect Heights','581 Vanderbilt Ave, Brooklyn, NY 11238','Top-ranked natural wine bar with Mediterranean small plates.','ph'],
['Gold Star Beer Counter','drinks','Prospect Heights','176 Underhill Ave, Brooklyn, NY 11238','Craft-beer bar with a deep, rotating tap list.','ph'],
["Sharlene's",'drinks','Prospect Heights','353 Flatbush Ave, Brooklyn, NY 11238','Easygoing bar with cheap-and-good cocktails and a back patio.','ph'],
['The Commissioner','drinks','Prospect Heights','576 Vanderbilt Ave, Brooklyn, NY 11238','Snug cocktail bar and oyster spot.','ph'],
['Bearded Lady','drinks','Prospect Heights','686 Washington Ave, Brooklyn, NY 11238','Cocktails plus a pool table and cheap domestic beer.','ph'],
['Soda Bar','drinks','Prospect Heights','629 Vanderbilt Ave, Brooklyn, NY 11238','Neighborhood bar with a big backyard.','ph'],
['Hungry Ghost Coffee','coffee','Prospect Heights','253 Flatbush Ave, Brooklyn, NY 11217','Spacious, well-lit cafe with ample seating.','ph'],
['Sit & Wonder','coffee','Prospect Heights','688 Washington Ave, Brooklyn, NY 11238','Cafe with a sweet little backyard, ideal for laptop work.','ph'],
['Radio Bakery','coffee','Prospect Heights','186 Underhill Ave, Brooklyn, NY 11238','Acclaimed bakery (NYT-ranked) for pastries and coffee.','ph'],
['Caffe de Martini','coffee','Prospect Heights','626 Vanderbilt Ave, Brooklyn, NY 11238','Genuine Italian coffee and chocolate house from a Turin family.','ph'],
['Brooklyn High Low','coffee','Prospect Heights','611 Vanderbilt Ave, Brooklyn, NY 11238','One of NYC’s best tea rooms, also serving coffee.','ph'],
['Milk Bar','coffee','Prospect Heights','620 Vanderbilt Ave, Brooklyn, NY 11238','Go-to for a quick morning coffee and bite.','ph'],
['Brooklyn Botanic Garden','culture','Prospect Heights','990 Washington Ave, Brooklyn, NY 11225','52-acre garden with a cherry esplanade, conservatory, and Japanese garden.','ph'],
['Brooklyn Public Library','culture','Prospect Heights','10 Grand Army Plaza, Brooklyn, NY 11238','Landmarked Art Deco central library at Grand Army Plaza.','ph'],
['Prospect Park Zoo','culture','Prospect Park','450 Flatbush Ave, Brooklyn, NY 11225','Intimate WCS zoo with sea lions, red pandas, and a barn.','ph'],
['Lefferts Historic House','culture','Prospect Park','452 Flatbush Ave, Brooklyn, NY 11225','Restored 18th-century Dutch farmhouse museum in Prospect Park.','ph'],
['Prospect Park','outdoors','Prospect Park','Prospect Park, Brooklyn, NY 11225','526-acre Olmsted-and-Vaux masterpiece — Long Meadow, the Ravine, the Lake.','ph'],
['Grand Army Plaza','outdoors','Prospect Heights','Grand Army Plaza, Brooklyn, NY 11238','Monumental plaza with the Soldiers’ and Sailors’ Arch and a Saturday greenmarket.','ph'],
['Mount Prospect Park','outdoors','Prospect Heights','Eastern Pkwy & Flatbush Ave, Brooklyn, NY 11238','Small hilltop park between the library and the botanic garden.','ph'],
// ---- Park Slope ----
['al di la Trattoria','food','Park Slope','248 5th Ave, Brooklyn, NY 11215','Northern Italian institution serving the neighborhood since 1998.','ps'],
['Fonda','food','Park Slope','434 7th Ave, Brooklyn, NY 11215','Contemporary Mexican with strong margaritas.','ps'],
["Ginger's Bar",'drinks','Park Slope','363 5th Ave, Brooklyn, NY 11215','One of the last lesbian bars in the U.S., with a beloved backyard.','ps'],
['Greenwood Park','drinks','Park Slope','555 7th Ave, Brooklyn, NY 11215','Huge beer garden with bocce, 60 taps, and frozen cocktails.','ps'],
['BrookVin','drinks','Park Slope','381 7th Ave, Brooklyn, NY 11215','Low-key wine bar with a back garden.','ps'],
["Logan's Run",'drinks','Park Slope','52 5th Ave, Brooklyn, NY 11217','Neighborhood spot blending dive and cocktail-bar vibes.','ps'],
['Union Hall','drinks','Park Slope','702 Union St, Brooklyn, NY 11215','Bar with bocce courts and a downstairs live-music room.','ps'],
['Sea Witch','drinks','Park Slope','703 5th Ave, Brooklyn, NY 11215','Nautical bar with a fish tank and a big backyard.','ps'],
['Gorilla Coffee','coffee','Park Slope','472 Bergen St, Brooklyn, NY 11217','Bold-roasted local coffee with a loyal following.','ps'],
['Cafe Regular','coffee','Park Slope','318 11th St, Brooklyn, NY 11215','Tiny, charming European-style espresso bar.','ps'],
['Southside Coffee','coffee','Park Slope','652 6th Ave, Brooklyn, NY 11215','Cozy neighborhood roaster-cafe.','ps'],
['Old Stone House','culture','Park Slope','336 3rd St, Brooklyn, NY 11215','Reconstructed 1699 Dutch farmhouse and Battle of Brooklyn museum.','ps'],
['Brooklyn Conservatory of Music','culture','Park Slope','58 7th Ave, Brooklyn, NY 11217','Community music school with concerts and recitals.','ps'],
['J.J. Byrne Playground','outdoors','Park Slope','336 3rd St, Brooklyn, NY 11215','Washington Park green and playground around the Old Stone House.','ps'],
['Bartel-Pritchard Square','outdoors','Park Slope','Prospect Park W & 15th St, Brooklyn, NY 11215','Park Slope’s columned gateway into Prospect Park.','ps'],
]
const slug=(s,sfx)=>'seed_'+s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')+'_'+sfx
const J=v=>JSON.stringify(v)
const block=([name,cat,nb,addr,desc,sfx])=>`  {
    id: ${J(slug(name,sfx))},
    name: ${J(name)},
    category: ${J(cat)},
    cuisine: [],
    price: null,
    neighborhood: ${J(nb)},
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
    source: ${J('curated_'+ (sfx==='ph'?'prospect_heights':'park_slope'))},
    isCustom: true,
    googlePlaceId: "",
    sourceUrl: "",
    enrichedAt: null,
  },`
let src=fs.readFileSync(FILE,'utf8')
const idx=src.lastIndexOf('\n]')
src=src.slice(0,idx)+'\n'+V.map(block).join('\n')+src.slice(idx)
fs.writeFileSync(FILE,src)
console.log('appended',V.length,'entries')
