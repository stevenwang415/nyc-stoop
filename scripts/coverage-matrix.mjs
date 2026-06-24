// Coverage gap matrix — counts the distinct real venues available for every
// (neighborhood × activity) the mood flow can surface, and flags cells under 5.
// Sources mirror the app's pooling: imports (places.js) + curated restaurant/bar
// DB + editorial venues by domain. Run: node scripts/coverage-matrix.mjs
import { seedUserPlaces } from '../src/data/places.js'
import { venueCoords } from '../src/data/venueMeta.js'
import fs from 'fs'

// ── Pull the real literals straight out of App.jsx so this never drifts ──
const APP = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
function grab(name) {
  const i = APP.indexOf(`const ${name} = `)
  if (i < 0) throw new Error(`missing ${name}`)
  // find first [ or { after the declaration
  let k = i
  while (k < APP.length && APP[k] !== '[' && APP[k] !== '{') k++
  const open = APP[k], close = open === '[' ? ']' : '}'
  let depth = 0, inStr = null
  for (let p = k; p < APP.length; p++) {
    const c = APP[p]
    if (inStr) { if (c === inStr && APP[p - 1] !== '\\') inStr = null; continue }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue }
    if (c === open) depth++
    else if (c === close) { depth--; if (depth === 0) return APP.slice(k, p + 1) }
  }
  throw new Error(`unbalanced ${name}`)
}
const RESTAURANT_DATA = new Function(`return ${grab('RESTAURANT_DATA')}`)()
const RESTAURANT_COORDS = new Function(`return ${grab('RESTAURANT_COORDS')}`)()
const BK_AREA_POLYS = new Function(`return ${grab('BK_AREA_POLYS')}`)()

// ── Classification (mirrors App.jsx) ──
function pointInPoly(lat, lng, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i][0], xi = ring[i][1], yj = ring[j][0], xj = ring[j][1]
    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) inside = !inside
  }
  return inside
}
function classify(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null
  const riverLng = lat <= 40.715 ? (-74.000 + 0.867 * (lat - 40.700)) : -73.968
  if (lat >= 40.55 && lat <= 40.74 && lng >= -74.015 && lng <= -73.83) {
    const inBK = lat < 40.700 ? true : (lng > riverLng)
    if (inBK) { for (const a in BK_AREA_POLYS) if (pointInPoly(lat, lng, BK_AREA_POLYS[a])) return a; return null }
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

const CAT_TO_ACT = { food: 'eat', eat: 'eat', coffee: 'coffee', drinks: 'drinks', music: 'live', live: 'live', art: 'culture', culture: 'culture', outdoors: 'outdoors' }
const REST_CUISINE_ACT = { bar_tavern: 'drinks', steakhouse: 'eat', italian: 'eat', japanese: 'eat', korean: 'eat', pizza: 'eat', burger: 'eat', american: 'eat' }
const DOMAIN_ACT = { food: 'eat', jazz: 'live', classical_music: 'live', theater: 'live', hip_hop: 'live', visual_art: 'culture', architecture: 'culture', history: 'culture' }
const OUTDOORS_VENUE_IDS = new Set(['central_park', 'high_line', 'bryant_park', 'washington_square_park', 'battery_park', 'brooklyn_bridge_arch'])
const editorialActivity = (id, domain) => OUTDOORS_VENUE_IDS.has(id) ? 'outdoors' : DOMAIN_ACT[domain]

const AREAS = [
  ['uptown', 'Uptown'], ['uws', 'Upper West Side'], ['ues', 'Upper East Side'],
  ['mw', 'Midtown West'], ['me', 'Midtown East'], ['chelsea', 'Chelsea'], ['gramercy', 'Gramercy'],
  ['wv', 'West Village / SoHo'], ['ev', 'East Village / LES'], ['lower', 'Lower Manhattan'],
  ['bk_greenpoint', 'Greenpoint'], ['bk_williamsburg', 'Williamsburg'], ['bk_dumbo', 'DUMBO'],
  ['bk_downtown', 'Downtown Brooklyn'], ['bk_clinton', 'Clinton Hill'], ['bk_prospect_hts', 'Prospect Heights'],
  ['bk_park_slope', 'Park Slope'], ['bk_crown_hts', 'Crown Heights'],
  ['bk_east', 'East Brooklyn'], ['bk_lower', 'Lower Brooklyn'],
]
const ACTS = ['eat', 'drinks', 'coffee', 'live', 'culture', 'outdoors']

// area -> activity -> Set(names)
const M = {}
AREAS.forEach(([id]) => { M[id] = {}; ACTS.forEach(a => M[id][a] = new Set()) })
const add = (areaId, act, name) => { if (areaId && act && M[areaId] && M[areaId][act] && name) M[areaId][act].add(name.toLowerCase().trim()) }

// imports
for (const v of seedUserPlaces) add(classify(v.lat, v.lng), CAT_TO_ACT[v.category], v.name)
// editorial venues by domain
for (const [id, info] of Object.entries(venueCoords)) add(classify(info.lat, info.lng), editorialActivity(id, info.domain), id)
// curated restaurant/bar DB
for (const r of RESTAURANT_DATA) {
  const c = RESTAURANT_COORDS[r.id]; if (!c) continue
  const area = classify(c[0], c[1])
  for (const cu of (r.cuisines || [])) add(area, REST_CUISINE_ACT[cu], r.name)
}

// ── Render ──
const pad = (s, n) => String(s).padEnd(n)
let out = '# NYC Stoop — coverage gap matrix\n\n'
out += `Distinct venues available per neighborhood × activity (imports + restaurant/bar DB + editorial). Cells under 5 are the punch-list to fill. Generated ${new Date().toISOString().slice(0, 10)}.\n\n`
out += '```\n'
out += pad('NEIGHBORHOOD', 22) + ACTS.map(a => pad(a, 8)).join('') + '\n'
out += '-'.repeat(22 + ACTS.length * 8) + '\n'
const gaps = []
for (const [id, label] of AREAS) {
  let row = pad(label, 22)
  for (const a of ACTS) {
    const n = M[id][a].size
    row += pad(n < 5 ? `${n}*` : `${n}`, 8)
    if (n < 5) gaps.push({ label, act: a, n, need: 5 - n })
  }
  out += row + '\n'
}
out += '```\n\n(* = under 5, needs more venues)\n\n'

out += '## Biggest gaps (most venues needed first)\n\n'
gaps.sort((x, y) => y.need - x.need || x.label.localeCompare(y.label))
for (const g of gaps) out += `- ${g.label} · ${g.act}: ${g.n}/5 — add ${g.need}\n`

out += `\n## Summary\n- Cells under 5: ${gaps.length} of ${AREAS.length * ACTS.length}\n`
const byAct = {}; gaps.forEach(g => { byAct[g.act] = (byAct[g.act] || 0) + 1 })
out += '- Thin cells by activity: ' + ACTS.map(a => `${a} ${byAct[a] || 0}`).join(' · ') + '\n'

fs.writeFileSync(new URL('../COVERAGE_GAPS.md', import.meta.url), out)
console.log(out)
