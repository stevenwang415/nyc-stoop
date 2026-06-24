import { venueCoords } from './src/data/venueMeta.js'
import { seedUserPlaces } from './src/data/places.js'
const want=['brooklyn','barclays_center','bam','brooklyn_botanic','brooklyn_museum','prospect']
console.log('--- editorial venues in central BK ---')
for (const [id,info] of Object.entries(venueCoords)) {
  if (info.lat>40.66 && info.lat<40.70 && info.lng>-73.99 && info.lng<-73.95)
    console.log(`  ${id} [${info.domain}] ${info.lat},${info.lng}`)
}
console.log('--- imports near Downtown BK / Fort Greene / Prospect (lat 40.66-40.70, lng -73.99..-73.95) ---')
let n=0
for (const p of seedUserPlaces) {
  if (typeof p.lat==='number' && p.lat>40.655 && p.lat<40.700 && p.lng>-73.995 && p.lng<-73.950) { n++; if(n<=25) console.log(`  ${p.category} | ${p.name} | ${p.lat},${p.lng} | ${p.address}`) }
}
console.log('total imports in that box:', n)
