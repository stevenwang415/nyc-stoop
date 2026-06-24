import { seedUserPlaces } from './src/data/places.js'

function classify(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null
  const riverLng = lat <= 40.715 ? (-74.000 + 0.867 * (lat - 40.700)) : -73.968
  if (lat >= 40.55 && lat <= 40.74 && lng >= -74.015 && lng <= -73.83) {
    const inBK = lat < 40.700 ? true : (lng > riverLng)
    if (inBK) return 'brooklyn'
  }
  if (lat >= 40.70 && lat <= 40.88 && lng >= -74.02 && lng <= -73.91) {
    if (lat >= 40.795) return 'uptown'
    if (lat >= 40.768) return lng < -73.970 ? 'uws' : 'ues'
    if (lat >= 40.745) return lng < -73.978 ? 'mw' : 'me'
    if (lat >= 40.735) return lng < -73.994 ? 'chelsea' : 'gramercy'
    if (lat >= 40.718) return lng < -73.992 ? 'wv' : 'ev'
    return 'lower'
  }
  return null
}
// ZIP -> expected area (Manhattan sub-areas + brooklyn bucket)
const ZIP_AREA = {
  // UES
  '10021':'ues','10028':'ues','10044':'ues','10065':'ues','10075':'ues','10128':'ues',
  // UWS
  '10023':'uws','10024':'uws','10025':'uws','10069':'uws',
  // Uptown / Harlem
  '10026':'uptown','10027':'uptown','10029':'uptown','10030':'uptown','10031':'uptown','10032':'uptown','10033':'uptown','10034':'uptown','10035':'uptown','10037':'uptown','10039':'uptown','10040':'uptown',
  // Midtown West
  '10018':'mw','10019':'mw','10036':'mw','10001':'chelsea','10020':'mw',
  // Midtown East
  '10017':'me','10022':'me','10016':'me','10165':'me','10167':'me','10168':'me','10174':'me',
  // Chelsea
  '10011':'chelsea',
  // Gramercy/Flatiron/Murray Hill/Kips
  '10010':'gramercy','10003':'gramercy',
  // West Village / SoHo / Tribeca
  '10014':'wv','10012':'wv','10013':'wv',
  // East Village / LES
  '10009':'ev','10002':'ev',
  // Lower Manhattan
  '10004':'lower','10005':'lower','10006':'lower','10007':'lower','10038':'lower','10280':'lower','10282':'lower','10271':'lower',
}
const zipOf = a => { const m = (a||'').match(/\b(1\d{4})\b/); return m ? m[1] : null }

let withZip=0, mism=[], noCoord=[], noZip=0
for (const p of seedUserPlaces) {
  const zip = zipOf(p.address)
  const cls = classify(p.lat, p.lng)
  if (!zip) { noZip++; continue }
  const exp = ZIP_AREA[zip]
  if (!exp) continue
  withZip++
  if (exp === 'brooklyn') continue // skip BK granularity here
  if (cls !== exp) mism.push({ name:p.name, addr:p.address, zip, coordArea:cls, zipArea:exp, lat:p.lat, lng:p.lng })
}
console.log('total', seedUserPlaces.length, 'withMappedZip', withZip, 'noZip', noZip)
console.log('MISMATCHES (coord-area != zip-area):', mism.length)
for (const m of mism.slice(0,60)) console.log(`  ${m.name} | ${m.zip}->${m.zipArea} but coords->${m.coordArea} | ${m.lat},${m.lng} | ${m.addr}`)
