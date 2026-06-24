import fs from 'fs'
const FILE = './src/data/places.js'
const V = [
// [name, category, address, cuisine[], description]
['Gage & Tollner','food','372 Fulton St, Brooklyn, NY 11201',['american'],"Landmarked 19th-century chophouse, restored and reopened — Brooklyn's grand old dining room."],
['French Louie','food','320 Atlantic Ave, Brooklyn, NY 11201',['french'],"Rustic French bistro with a back patio at the Boerum Hill / Downtown edge."],
['Mile End Delicatessen','food','97A Hoyt St, Brooklyn, NY 11217',['american'],"Montreal-style Jewish deli — smoked meat, poutine, and bagels."],
['Sottocasa Pizzeria','food','298 Atlantic Ave, Brooklyn, NY 11201',['pizza'],"Neapolitan wood-fired pizza on Atlantic Ave."],
['Bacchus Bistro','food','409 Atlantic Ave, Brooklyn, NY 11217',['french'],"Casual French bistro with a garden, steps from BAM."],
['Ki Sushi','food','122 Smith St, Brooklyn, NY 11201',['japanese'],"Reliable neighborhood sushi on Smith St."],
['Rucola','food','190 Dean St, Brooklyn, NY 11217',['italian'],"Northern Italian trattoria with a farmhouse feel."],
['Grand Army','drinks','336 State St, Brooklyn, NY 11217',[],"Cocktail and oyster bar with a well-loved happy hour."],
['Sunken Harbor Club','drinks','372 Fulton St, Brooklyn, NY 11201',[],"Nautical tiki cocktail bar upstairs at Gage & Tollner."],
['Clover Club','drinks','210 Smith St, Brooklyn, NY 11201',[],"Award-winning classic cocktail bar with a Victorian feel."],
['The Brooklyn Inn','drinks','148 Hoyt St, Brooklyn, NY 11217',[],"Historic 19th-century neighborhood bar with a carved-wood backbar."],
['61 Local','drinks','61 Bergen St, Brooklyn, NY 11201',[],"Spacious craft-beer hall and community bar."],
['Building on Bond','drinks','112 Bond St, Brooklyn, NY 11217',[],"All-day cafe and bar with a big, mellow back room."],
['Devoción Downtown Brooklyn','coffee','Bond St & Livingston St, Brooklyn, NY 11201',[],"Sky-lit roaster-cafe with an indoor garden; farm-fresh Colombian coffee."],
['White Noise Coffee','coffee','57 Smith St, Brooklyn, NY 11201',[],"Craft roaster-cafe with lots of seating and Wi-Fi."],
['Absolute Coffee','coffee','142 Atlantic Ave, Brooklyn, NY 11201',[],"Cozy, work-friendly Boerum Hill neighborhood cafe."],
['One Girl Cookies','coffee','68 Dean St, Brooklyn, NY 11201',[],"Charming bakery-cafe known for whoopie pies and cookies."],
['Konditori','coffee','114 Smith St, Brooklyn, NY 11201',[],"Swedish espresso bar for a quick, strong cup."],
['Brooklyn Academy of Music','live','30 Lafayette Ave, Brooklyn, NY 11217',[],"150-year-old performing-arts powerhouse — opera, dance, theater, music, and film."],
['BAM Harvey Theater','live','651 Fulton St, Brooklyn, NY 11217',[],"BAM's atmospheric second stage in a restored 1904 theater."],
['Brooklyn Paramount','live','385 Flatbush Ave Extension, Brooklyn, NY 11201',[],"Opulent 1920s theater, reopened in 2024 for concerts."],
['BRIC House','live','647 Fulton St, Brooklyn, NY 11217',[],"Free shows, a gallery, and the home base of Celebrate Brooklyn."],
['Theatre for a New Audience','live','262 Ashland Pl, Brooklyn, NY 11217',[],"Shakespeare and classic drama at the Polonsky Shakespeare Center."],
['Mark Morris Dance Center','live','3 Lafayette Ave, Brooklyn, NY 11217',[],"Performances and classes from the Mark Morris Dance Group."],
['Roulette','live','509 Atlantic Ave, Brooklyn, NY 11217',[],"Experimental and avant-garde music in a 400-seat hall."],
['New York Transit Museum','culture','99 Schermerhorn St, Brooklyn, NY 11201',[],"Vintage subway cars in a 1936 station — the largest transit museum in the U.S."],
['MoCADA','culture','10 Lafayette Ave, Brooklyn, NY 11217',[],"Museum of Contemporary African Diasporan Arts, now at the L10 cultural center."],
['Center for Brooklyn History','culture','128 Pierrepont St, Brooklyn, NY 11201',[],"Brooklyn's archive and museum in a landmarked 1881 building."],
['UrbanGlass','culture','647 Fulton St, Brooklyn, NY 11217',[],"Glassblowing studios and a free gallery of contemporary glass art."],
['The Invisible Dog Art Center','culture','51 Bergen St, Brooklyn, NY 11201',[],"Three-floor gallery and artist studios in a former factory."],
['Cadman Plaza Park','outdoors','Cadman Plaza W, Brooklyn, NY 11201',[],"Tree-lined green spine with a greenmarket, between Downtown and Brooklyn Heights."],
['MetroTech Commons','outdoors','MetroTech Center, Brooklyn, NY 11201',[],"Landscaped public plaza with rotating public art."],
['Willoughby Square Park','outdoors','Albee Square W, Brooklyn, NY 11201',[],"Downtown Brooklyn's newest park, atop a public garage."],
]
const slug = s => 'seed_' + s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'') + '_dtbk'
const J = v => JSON.stringify(v)
const block = ([name,cat,addr,cui,desc]) => `  {
    id: ${J(slug(name))},
    name: ${J(name)},
    category: ${J(cat)},
    cuisine: ${J(cui)},
    price: null,
    neighborhood: "Downtown Brooklyn",
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
    source: "curated_downtown_brooklyn",
    isCustom: true,
    googlePlaceId: "",
    sourceUrl: "",
    enrichedAt: null,
  },`
let src = fs.readFileSync(FILE,'utf8')
const idx = src.lastIndexOf('\n]')
src = src.slice(0,idx) + '\n' + V.map(block).join('\n') + src.slice(idx)
fs.writeFileSync(FILE, src)
console.log('appended', V.length, 'entries')
