import fs from 'node:fs'
const ROOT='.'
const readEnv=n=>{try{const m=fs.readFileSync(ROOT+'/'+n,'utf8').match(/^\s*VITE_GOOGLE_MAPS_API_KEY\s*=\s*(.+)\s*$/m);return m?m[1].trim().replace(/^["']|["']$/g,''):null}catch{return null}}
const KEY=process.env.VITE_GOOGLE_MAPS_API_KEY||readEnv('.env.local')||readEnv('.env')
const {seedUserPlaces}=await import('./src/data/places.js')
const todo=seedUserPlaces.filter(p=>!p.enrichedAt)
async function look(name,nb){
 const res=await fetch('https://places.googleapis.com/v1/places:searchText',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':KEY,'Referer':'https://nyc-stoop.vercel.app/','X-Goog-FieldMask':'places.displayName,places.formattedAddress,places.businessStatus'},body:JSON.stringify({textQuery:`${name}${nb?', '+nb:''}, New York, NY`,locationBias:{circle:{center:{latitude:40.7589,longitude:-73.9851},radius:30000}},maxResultCount:1,regionCode:'US'})})
 if(!res.ok)return {err:res.status}
 const p=(await res.json()).places?.[0]; if(!p)return{none:true}
 return {dn:p.displayName?.text,addr:p.formattedAddress,st:p.businessStatus}
}
for(const e of todo){const r=await look(e.name,e.neighborhood);
 console.log(`${e.name} [${e.neighborhood}] => match:"${r.dn||r.none?'NONE':r.err}" | ${r.addr||''} | ${r.st||''}`)
 await new Promise(r=>setTimeout(r,80))}
