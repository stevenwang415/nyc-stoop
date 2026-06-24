import fs from 'fs'
const FILE='./src/data/places.js'
// [name, category, neighborhood, suffix]
const V=[
// Harlem (uptown)
['Sugar Monk','drinks','Harlem','hl'],['The Honey Well','drinks','Harlem','hl'],['Harlem Public','drinks','Harlem','hl'],['Archer & Goat','drinks','Harlem','hl'],['Bird in Hand','drinks','Harlem','hl'],['Angel of Harlem','drinks','Harlem','hl'],
['Lenox Coffee','coffee','Harlem','hl'],['The Chipped Cup','coffee','Harlem','hl'],['Manhattanville Coffee','coffee','Harlem','hl'],['Double Dutch Espresso','coffee','Harlem','hl'],['The Oma Shop','coffee','Harlem','hl'],
// Upper West Side
['Manhattan Cricket Club','drinks','Upper West Side','uws'],['The Dead Poet','drinks','Upper West Side','uws'],['George Keeley','drinks','Upper West Side','uws'],['Prohibition','drinks','Upper West Side','uws'],["The Owl's Tail",'drinks','Upper West Side','uws'],['Dublin House','drinks','Upper West Side','uws'],
['Blue Bottle Coffee','coffee','Upper West Side','uws'],['Daily Provisions','coffee','Upper West Side','uws'],['About Coffee','coffee','Upper West Side','uws'],['Irving Farm Coffee Roasters','coffee','Upper West Side','uws'],['Sote Coffee','coffee','Upper West Side','uws'],['Frame Coffee','coffee','Upper West Side','uws'],
// Upper East Side
['Bemelmans Bar','drinks','Upper East Side','ues'],['The Penrose','drinks','Upper East Side','ues'],['Seamstress','drinks','Upper East Side','ues'],['Auction House','drinks','Upper East Side','ues'],['Caledonia Bar','drinks','Upper East Side','ues'],['Bar Pleiades','drinks','Upper East Side','ues'],
['Oslo Coffee Roasters','coffee','Upper East Side','ues'],["Ralph's Coffee",'coffee','Upper East Side','ues'],['Birch Coffee','coffee','Upper East Side','ues'],['Variety Coffee Roasters','coffee','Upper East Side','ues'],['787 Coffee','coffee','Upper East Side','ues'],['Cafe Bleriot','coffee','Upper East Side','ues'],
// Midtown East
['Ophelia','drinks','Midtown East','me'],['Monkey Bar','drinks','Midtown East','me'],['King Cole Bar','drinks','Midtown East','me'],['The Polo Bar','drinks','Midtown East','me'],['Seed Library','drinks','Midtown East','me'],['Valerie','drinks','Midtown East','me'],
['Maman','coffee','Midtown East','me'],['Gregorys Coffee','coffee','Midtown East','me'],['Joe Coffee','coffee','Midtown East','me'],
// Chelsea
['Porchlight','drinks','Chelsea','ch'],['Bathtub Gin','drinks','Chelsea','ch'],['The Tippler','drinks','Chelsea','ch'],['Bar Snack','drinks','Chelsea','ch'],['The Lobby Bar at Hotel Chelsea','drinks','Chelsea','ch'],
['Kobrick Coffee Co','coffee','Chelsea','ch'],['Seven Grams Caffe','coffee','Chelsea','ch'],['Cafe Ambrosia','coffee','Chelsea','ch'],['Yanni’s Coffee','coffee','Chelsea','ch'],['Blue Bottle Coffee','coffee','Chelsea','ch'],['Joe Coffee','coffee','Chelsea','ch'],
// Flatiron / NoMad / Gramercy
['Patent Pending','drinks','Flatiron','fg'],['Undercote','drinks','Flatiron','fg'],['Broken Shaker','drinks','NoMad','fg'],['The Flatiron Room','drinks','Flatiron','fg'],['Dear Irving','drinks','Gramercy','fg'],
['Birch Coffee','coffee','Flatiron','fg'],['Stumptown Coffee Roasters','coffee','NoMad','fg'],['Maman','coffee','NoMad','fg'],
// Hell's Kitchen (mw) drinks
['By & By','drinks',"Hell's Kitchen",'hk'],["Miss Nellie's",'drinks',"Hell's Kitchen",'hk'],['Monkey Thief','drinks',"Hell's Kitchen",'hk'],['The Polynesian','drinks',"Hell's Kitchen",'hk'],["Rudy's Bar & Grill",'drinks',"Hell's Kitchen",'hk'],
// Williamsburg drinks
['Maison Premiere','drinks','Williamsburg','wb'],['Westlight','drinks','Williamsburg','wb'],['Bar Blondeau','drinks','Williamsburg','wb'],['The Four Horsemen','drinks','Williamsburg','wb'],['Layla','drinks','Williamsburg','wb'],['Donna','drinks','Williamsburg','wb'],
// Lower Brooklyn (Carroll Gardens / Gowanus / Red Hook)
["Sunny's Bar",'drinks','Red Hook','lb'],['Threes Brewing','drinks','Gowanus','lb'],['Black Mountain Wine House','drinks','Carroll Gardens','lb'],["Cremini's",'drinks','Carroll Gardens','lb'],
['Liz’s Book Bar','coffee','Carroll Gardens','lb'],['Brooklyn Habit','coffee','Carroll Gardens','lb'],['Mister Cheeks','coffee','Carroll Gardens','lb'],['Planted Cafe','coffee','Carroll Gardens','lb'],['Principles GI Coffee House','coffee','Gowanus','lb'],
// East Brooklyn (Bed-Stuy / Bushwick)
['Cocktail Bed-Stuy','drinks','Bed-Stuy','eb'],['Bar Lunatico','drinks','Bed-Stuy','eb'],['Dynaco','drinks','Bed-Stuy','eb'],['All Night Skate','drinks','Bed-Stuy','eb'],['Sleepwalk','drinks','Bushwick','eb'],
['Little Skips','coffee','Bushwick','eb'],
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
console.log('appended',V.length,'drinks/coffee entries')
