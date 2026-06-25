import { seedUserPlaces } from './src/data/places.js'
import { venueCoords } from './src/data/venueMeta.js'
import fs from 'fs'
const APP=fs.readFileSync('./src/App.jsx','utf8')
function grab(n){const i=APP.indexOf(`const ${n} = `);let k=i;while(APP[k]!=='['&&APP[k]!=='{')k++;const o=APP[k],c=o==='['?']':'}';let d=0,s=null;for(let p=k;p<APP.length;p++){const ch=APP[p];if(s){if(ch===s&&APP[p-1]!=='\\')s=null;continue}if(ch==='"'||ch==="'"||ch==='`'){s=ch;continue}if(ch===o)d++;else if(ch===c){d--;if(d===0)return APP.slice(k,p+1)}}}
const RD=new Function(`return ${grab('RESTAURANT_DATA')}`)(),RC=new Function(`return ${grab('RESTAURANT_COORDS')}`)(),BK=new Function(`return ${grab('BK_AREA_POLYS')}`)()
function pip(lat,lng,r){let o=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const yi=r[i][0],xi=r[i][1],yj=r[j][0],xj=r[j][1];if(((yi>lat)!==(yj>lat))&&(lng<(xj-xi)*(lat-yi)/(yj-yi)+xi))o=!o}return o}
function classify(lat,lng){if(typeof lat!=='number')return null;const rl=lat<=40.715?(-74.000+0.867*(lat-40.700)):-73.968;if(lat>=40.55&&lat<=40.74&&lng>=-74.015&&lng<=-73.83){const bk=lat<40.700?true:(lng>rl);if(bk){for(const a in BK)if(pip(lat,lng,BK[a]))return a;return null}}if(lat>=40.70&&lat<=40.88&&lng>=-74.02&&lng<=-73.91){if(lat>=40.795)return'uptown';if(lat>=40.768)return lng<-73.970?'uws':'ues';if(lat>=40.745)return lng<-73.978?'mw':'me';if(lat>=40.735)return lng<-73.994?'chelsea':'gramercy';if(lat>=40.718)return lng<-73.992?'wv':'ev';return'lower'}return null}
const CAT={food:'eat',eat:'eat',coffee:'coffee',drinks:'drinks',music:'live',live:'live',art:'culture',culture:'culture',outdoors:'outdoors'},REST={bar_tavern:'drinks',steakhouse:'eat',italian:'eat',japanese:'eat',korean:'eat',pizza:'eat',burger:'eat',american:'eat'},DOM={food:'eat',jazz:'live',classical_music:'live',theater:'live',hip_hop:'live',visual_art:'culture',architecture:'culture',history:'culture'}
const OUT=new Set(['central_park','high_line','bryant_park','washington_square_park','battery_park','brooklyn_bridge_arch']),eAct=(id,d)=>OUT.has(id)?'outdoors':DOM[d]
const FF=/\b(mc\s?donald'?s|burger king|wendy'?s|kfc|popeyes|taco bell|subway|chipotle|five guys|sbarro|domino'?s|pizza hut|dunkin|chick[- ]?fil[- ]?a|white castle|wingstop|panda express|sweetgreen|chopt|pret a manger|shake shack|fast food)\b/i
const AREAS=[['uptown','Uptown'],['uws','Upper West Side'],['ues','Upper East Side'],['mw','Midtown West'],['me','Midtown East'],['chelsea','Chelsea'],['gramercy','Gramercy/Flatiron'],['wv','West Village/SoHo'],['ev','East Village/LES'],['lower','Lower Manhattan'],['bk_greenpoint','Greenpoint'],['bk_williamsburg','Williamsburg'],['bk_dumbo','DUMBO'],['bk_downtown','Downtown Brooklyn'],['bk_clinton','Clinton Hill'],['bk_prospect_hts','Prospect Heights & Park'],['bk_park_slope','Park Slope'],['bk_crown_hts','Crown Heights'],['bk_east','East Brooklyn'],['bk_lower','Lower Brooklyn']]
const ACTS=['eat','drinks','coffee','live','culture','outdoors'];const M={};AREAS.forEach(([id])=>{M[id]={};ACTS.forEach(a=>M[id][a]=new Set())})
const add=(ar,ac,nm)=>{if(ar&&ac&&M[ar]&&M[ar][ac]&&nm&&!FF.test(nm))M[ar][ac].add(nm.toLowerCase().trim())}
for(const v of seedUserPlaces)add(classify(v.lat,v.lng),CAT[v.category],v.name)
for(const[id,info]of Object.entries(venueCoords))add(classify(info.lat,info.lng),eAct(id,info.domain),id)
for(const r of RD){const c=RC[r.id];if(!c)continue;const ar=classify(c[0],c[1]);for(const cu of(r.cuisines||[]))add(ar,REST[cu],r.name)}
const rows=AREAS.map(([id,label])=>{const counts=ACTS.map(a=>M[id][a].size);return{label,total:counts.reduce((x,y)=>x+y,0),empty:counts.filter(n=>n===0).length,counts}})
rows.sort((a,b)=>a.total-b.total||b.empty-a.empty)
let out='# NYC Stoop — areas ranked by least data (fill top-down)\n\nAll venues Google-enriched & verified open. Each activity targets 5. Generated '+new Date().toISOString().slice(0,10)+'.\n\n| # | Area | Total | eat | drinks | coffee | live | culture | outdoors |\n|---|---|---|---|---|---|---|---|---|\n'
rows.forEach((r,i)=>{out+=`| ${i+1} | ${r.label} | ${r.total} | ${r.counts.map(n=>n<5?`**${n}**`:n).join(' | ')} |\n`})
out+='\n_Bold = under 5. Order: fewest total first._\n'
fs.writeFileSync('./DATA_PRIORITY.md',out)
const g={};ACTS.forEach((a,i)=>{const u=rows.filter(r=>r.counts[i]<5).map(r=>r.label);if(u.length)g[a]=u})
for(const a of ACTS) console.log(a+' <5: '+((g[a]||['none']).join(', ')))
