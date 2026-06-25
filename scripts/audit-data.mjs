import { seedUserPlaces } from '../src/data/places.js'
import { venueCoords } from '../src/data/venueMeta.js'
import { venueImages } from '../src/data/venueImages.js'
import fs from 'fs'
const APP=fs.readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8')
function grab(n){const i=APP.indexOf(`const ${n} = `);let k=i;while(APP[k]!=='['&&APP[k]!=='{')k++;const o=APP[k],c=o==='['?']':'}';let d=0,s=null;for(let p=k;p<APP.length;p++){const ch=APP[p];if(s){if(ch===s&&APP[p-1]!=='\\')s=null;continue}if(ch==='"'||ch==="'"||ch==='`'){s=ch;continue}if(ch===o)d++;else if(ch===c){d--;if(d===0)return APP.slice(k,p+1)}}}
const BK=new Function(`return ${grab('BK_AREA_POLYS')}`)()
function pip(lat,lng,r){let o=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const yi=r[i][0],xi=r[i][1],yj=r[j][0],xj=r[j][1];if(((yi>lat)!==(yj>lat))&&(lng<(xj-xi)*(lat-yi)/(yj-yi)+xi))o=!o}return o}
function classify(lat,lng){if(typeof lat!=='number')return null;const rl=lat<=40.715?(-74.000+0.867*(lat-40.700)):-73.968;if(lat>=40.55&&lat<=40.74&&lng>=-74.015&&lng<=-73.83){const bk=lat<40.700?true:(lng>rl);if(bk){for(const a in BK)if(pip(lat,lng,BK[a]))return a;return 'bk_other'}}if(lat>=40.70&&lat<=40.88&&lng>=-74.02&&lng<=-73.91){if(lat>=40.795)return'uptown';if(lat>=40.768)return lng<-73.970?'uws':'ues';if(lat>=40.745)return lng<-73.978?'mw':'me';if(lat>=40.735)return lng<-73.994?'chelsea':'gramercy';if(lat>=40.718)return lng<-73.992?'wv':'ev';return'lower'}return null}
const NONDEST=new Set(['shopping','place','other',''])
let mc=0,ma=0,mr=0,mh=0,mn=0,nd=0,ne=0
const ndList={}
for(const p of seedUserPlaces){
  if(typeof p.lat!=='number') mc++
  if(!p.address) ma++
  if(p.rating==null) mr++
  if(!p.hours) mh++
  if(!p.neighborhood) mn++
  if(!p.enrichedAt) ne++
  if(NONDEST.has(p.category)){nd++;ndList[p.category]=(ndList[p.category]||0)+1}
}
const noImg=Object.keys(venueCoords).filter(id=>!venueImages[id])
console.log('total places:', seedUserPlaces.length)
console.log('missing coords:', mc)
console.log('missing address:', ma)
console.log('missing rating:', mr)
console.log('missing hours:', mh)
console.log('missing neighborhood:', mn)
console.log('not enriched:', ne)
console.log('non-destination category:', nd, JSON.stringify(ndList))
console.log('editorial venues missing image:', noImg.length, '/', Object.keys(venueCoords).length)
