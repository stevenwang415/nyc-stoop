import { seedUserPlaces } from './src/data/places.js'
import { venueCoords } from './src/data/venueMeta.js'
import fs from 'fs'
const APP=fs.readFileSync('./src/App.jsx','utf8')
function grab(n){const i=APP.indexOf(`const ${n} = `);let k=i;while(APP[k]!=='['&&APP[k]!=='{')k++;const o=APP[k],c=o==='['?']':'}';let d=0,s=null;for(let p=k;p<APP.length;p++){const ch=APP[p];if(s){if(ch===s&&APP[p-1]!=='\\')s=null;continue}if(ch==='"'||ch==="'"||ch==='`'){s=ch;continue}if(ch===o)d++;else if(ch===c){d--;if(d===0)return APP.slice(k,p+1)}}}
const BK=new Function(`return ${grab('BK_AREA_POLYS')}`)()
function pip(lat,lng,r){let o=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const yi=r[i][0],xi=r[i][1],yj=r[j][0],xj=r[j][1];if(((yi>lat)!==(yj>lat))&&(lng<(xj-xi)*(lat-yi)/(yj-yi)+xi))o=!o}return o}
const NB={'crown heights':'bk_crown_hts','downtown brooklyn':'bk_downtown','dumbo':'bk_dumbo'}
const inDumbo=v=>{ if(typeof v.lat==='number')return pip(v.lat,v.lng,BK.bk_dumbo); return NB[(v.neighborhood||'').toLowerCase().trim()]==='bk_dumbo' }
console.log('--- seed places classified to DUMBO ---')
for(const v of seedUserPlaces) if(inDumbo(v)) console.log(`  [${v.category}] ${v.name}`)
console.log('--- editorial venues whose coords fall in DUMBO polygon ---')
for(const [id,info] of Object.entries(venueCoords)) if(typeof info.lat==='number'&&pip(info.lat,info.lng,BK.bk_dumbo)) console.log(`  {${info.domain}} ${id}`)
