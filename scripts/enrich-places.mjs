// ── One-time / repeatable enrichment for src/data/places.js ─────────────────
//
// Fills the OBJECTIVE block of each place from the Google Places API (New) —
// coordinates, neighborhood, price, cuisine, hours, rating, website, and
// Google's editorial summary — in a single Text Search call per place.
//
// PROVENANCE RULE (important): this script writes only objective, re-fetchable
// fields. It NEVER touches `description` or `insiderTip` (your hand/AI-written
// copy), so you can re-run it any time to refresh prices/hours without losing a
// word you wrote. It marks each enriched row with `enrichedAt` (ISO date) and
// by default skips rows already enriched.
//
// ── Usage ───────────────────────────────────────────────────────────────────
//   Key resolution order: --key=AIza... → GOOGLE_MAPS_API_KEY env →
//   VITE_GOOGLE_MAPS_API_KEY env → .env.local → .env  (VITE_GOOGLE_MAPS_API_KEY=)
//   The key needs "Places API (New)" enabled. Set a daily quota cap first.
//
//   node scripts/enrich-places.mjs --dry-run          # preview, no writes
//   node scripts/enrich-places.mjs                    # enrich rows not done yet
//   node scripts/enrich-places.mjs --limit=25         # cheap test batch
//   node scripts/enrich-places.mjs --force            # re-enrich everything
//   node scripts/enrich-places.mjs --delay=150        # ms between requests
//
// Requires Node 18+ (global fetch).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const FILE = path.join(ROOT, 'src', 'data', 'places.js')

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/); return m ? [m[1], m[2] ?? true] : [a, true]
}))
const DRY = !!args['dry-run']
const FORCE = !!args.force
// Cheap targeted pass: fetch ONLY the formatted address (Essentials-tier field,
// no pricey atmosphere data) for rows that still lack one, writing just `address`.
const ADDR_ONLY = !!args['address-only']
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity
const DELAY = args.delay ? parseInt(args.delay, 10) : 140

function readEnv(name) {
  try {
    const m = fs.readFileSync(path.join(ROOT, name), 'utf8')
      .match(/^\s*VITE_GOOGLE_MAPS_API_KEY\s*=\s*(.+)\s*$/m)
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : null
  } catch { return null }
}
const API_KEY = (typeof args.key === 'string' && args.key) ||
  process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY ||
  readEnv('.env.local') || readEnv('.env')
if (!API_KEY) {
  console.error('✗ No Google Maps API key. Pass --key=, set GOOGLE_MAPS_API_KEY, or add VITE_GOOGLE_MAPS_API_KEY to .env.local')
  process.exit(1)
}

const NYC = { latitude: 40.7589, longitude: -73.9851 }
// Must match one of the key's allowed HTTP-referrer patterns. Override with --referer=
const REFERER = (typeof args.referer === 'string' && args.referer) || 'https://nyc-stoop.vercel.app/'

const PRICE = {
  PRICE_LEVEL_FREE: '', PRICE_LEVEL_INEXPENSIVE: '$', PRICE_LEVEL_MODERATE: '$$',
  PRICE_LEVEL_EXPENSIVE: '$$$', PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
}
// Google primaryType/types → app cuisine token. The app's chips are japanese,
// korean, italian, pizza, burger, bar_tavern, steakhouse, american; other tokens
// (thai, chinese, …) are still recorded for future filters.
const CUISINE = {
  sushi_restaurant: 'japanese', japanese_restaurant: 'japanese', ramen_restaurant: 'japanese',
  korean_restaurant: 'korean', italian_restaurant: 'italian', pizza_restaurant: 'pizza',
  hamburger_restaurant: 'burger', fast_food_restaurant: 'burger', steak_house: 'steakhouse',
  bar: 'bar_tavern', pub: 'bar_tavern', wine_bar: 'bar_tavern',
  american_restaurant: 'american', diner: 'american', brunch_restaurant: 'american',
  breakfast_restaurant: 'american', chinese_restaurant: 'chinese', thai_restaurant: 'thai',
  mexican_restaurant: 'mexican', french_restaurant: 'french', vietnamese_restaurant: 'vietnamese',
  indian_restaurant: 'indian', seafood_restaurant: 'seafood', cafe: 'cafe', coffee_shop: 'cafe',
  bakery: 'bakery', ice_cream_shop: 'dessert', dessert_shop: 'dessert',
}
function toCuisine(primary, types = []) {
  const all = [primary, ...types].filter(Boolean)
  const out = []
  for (const t of all) { const c = CUISINE[t]; if (c && !out.includes(c)) out.push(c) }
  return out
}

const NEIGH_NORM = { 'bedford-stuyvesant': 'Bed-Stuy', 'midtown manhattan': 'Midtown', clinton: "Hell's Kitchen", 'theater district': "Hell's Kitchen", 'flatiron district': 'Flatiron', soho: 'SoHo', noho: 'NoHo' }
const OUTER = { Queens: ', Queens', Bronx: ', The Bronx', 'Staten Island': ', Staten Island' }
function pickNeighborhood(components = []) {
  const byType = t => components.find(c => (c.types || []).includes(t))?.longText
  const borough = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']
    .find(b => components.some(c => (c.longText || '').includes(b))) || null
  let hood = byType('neighborhood') || byType('sublocality_level_2') || byType('sublocality_level_1') || byType('sublocality') || byType('locality')
  if (!hood) return ''
  if (['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'New York'].includes(hood)) {
    hood = borough && borough !== 'Manhattan' ? borough : ''
    if (!hood) return ''
  }
  hood = NEIGH_NORM[hood.toLowerCase()] || hood
  if (borough && OUTER[borough] && !hood.includes(borough)) hood += OUTER[borough]
  return hood
}

async function lookup(name, neighborhood) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      // The key is restricted to HTTP referrers; send an allowed one so this
      // server-side tool is accepted without loosening the key's restrictions.
      'Referer': REFERER,
      'X-Goog-FieldMask': (ADDR_ONLY
        ? ['places.formattedAddress', 'places.location']
        : [
            'places.displayName', 'places.formattedAddress', 'places.addressComponents', 'places.location',
            'places.priceLevel', 'places.primaryType', 'places.types',
            'places.regularOpeningHours.weekdayDescriptions', 'places.rating',
            'places.websiteUri', 'places.editorialSummary', 'places.businessStatus',
          ]).join(','),
    },
    body: JSON.stringify({
      // Include the neighborhood so an ambiguous name resolves to the RIGHT
      // business (e.g. "Mama Fox, Clinton Hill" not a same-ish name elsewhere).
      textQuery: `${name}${neighborhood ? ', ' + neighborhood : ''}, New York, NY`,
      locationBias: { circle: { center: NYC, radius: 30000 } },
      maxResultCount: 1, regionCode: 'US',
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`)
  const p = (await res.json()).places?.[0]
  if (!p) return null
  if (ADDR_ONLY) return { address: p.formattedAddress || '' }
  return {
    address: p.formattedAddress || '',
    neighborhood: pickNeighborhood(p.addressComponents),
    lat: p.location?.latitude ?? null,
    lng: p.location?.longitude ?? null,
    price: PRICE[p.priceLevel] ?? null,
    cuisine: toCuisine(p.primaryType, p.types),
    hours: (p.regularOpeningHours?.weekdayDescriptions || []).join(' | '),
    rating: typeof p.rating === 'number' ? p.rating : null,
    website: p.websiteUri || '',
    googleSummary: p.editorialSummary?.text || '',
    businessStatus: p.businessStatus || '',
  }
}

// ── parse the multi-line schema into objects ──
function parse(src) {
  const body = src.slice(src.indexOf('seedUserPlaces = [') + 'seedUserPlaces = ['.length, src.lastIndexOf(']'))
  return body.split(/\n\s*\},/).filter(b => b.includes('id:')).map(b => {
    const str = k => { const m = b.match(new RegExp(`${k}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)); return m ? JSON.parse(`"${m[1]}"`) : '' }
    const numOrNull = k => { const m = b.match(new RegExp(`${k}:\\s*(null|-?[\\d.]+)`)); return !m || m[1] === 'null' ? null : Number(m[1]) }
    const priceOrNull = () => { const m = b.match(/price:\s*(null|"[^"]*")/); return !m || m[1] === 'null' ? null : m[1].slice(1, -1) }
    const arr = k => { const m = b.match(new RegExp(`${k}:\\s*(\\[[^\\]]*\\])`)); try { return m ? JSON.parse(m[1].replace(/'/g, '"')) : [] } catch { return [] } }
    const enr = () => { const m = b.match(/enrichedAt:\s*(null|"[^"]*")/); return !m || m[1] === 'null' ? null : m[1].slice(1, -1) }
    return {
      id: str('id'), name: str('name'), category: str('category'),
      cuisine: arr('cuisine'), price: priceOrNull(), neighborhood: str('neighborhood'),
      area: str('area'), lat: numOrNull('lat'), lng: numOrNull('lng'), address: str('address'),
      hours: str('hours'), rating: numOrNull('rating'), website: str('website'),
      googleSummary: str('googleSummary'), description: str('description'), insiderTip: str('insiderTip'),
      source: str('source') || 'google_takeout', googlePlaceId: str('googlePlaceId'),
      sourceUrl: str('sourceUrl'), enrichedAt: enr(),
    }
  }).filter(e => e.id)
}

const J = v => JSON.stringify(v, null, 0)
function emit(src, entries) {
  const header = src.slice(0, src.indexOf('export const seedUserPlaces'))
  const n = v => v == null || Number.isNaN(v) ? 'null' : v
  const blk = e =>
`  {
    id: ${J(e.id)},
    name: ${J(e.name)},
    category: ${J(e.category)},
    cuisine: ${J(e.cuisine)},
    price: ${e.price == null ? 'null' : J(e.price)},
    neighborhood: ${J(e.neighborhood)},
    area: ${J(e.area)},
    lat: ${n(e.lat)},
    lng: ${n(e.lng)},
    address: ${J(e.address)},
    hours: ${J(e.hours)},
    rating: ${n(e.rating)},
    website: ${J(e.website)},
    googleSummary: ${J(e.googleSummary)},
    description: ${J(e.description)},
    insiderTip: ${J(e.insiderTip)},
    source: ${J(e.source)},
    isCustom: true,
    googlePlaceId: ${J(e.googlePlaceId)},
    sourceUrl: ${J(e.sourceUrl)},
    enrichedAt: ${e.enrichedAt == null ? 'null' : J(e.enrichedAt)},
  },`
  return header + 'export const seedUserPlaces = [\n' + entries.map(blk).join('\n') + '\n]\n'
}

const sleep = ms => new Promise(r => setTimeout(r, ms))
const today = new Date().toISOString().slice(0, 10)

const src = fs.readFileSync(FILE, 'utf8')
const entries = parse(src)
const todo = entries
  .filter(e => ADDR_ONLY ? !e.address : (FORCE || !e.enrichedAt))
  .slice(0, LIMIT)
console.log(`Parsed ${entries.length} places · ${todo.length} to ${ADDR_ONLY ? 'address-fill' : 'enrich'}${DRY ? ' (dry run)' : ''}${FORCE ? ' (force)' : ''}\n`)

let ok = 0, miss = 0, closed = 0, i = 0
const closedList = []
for (const e of todo) {
  i++
  try {
    const r = await lookup(e.name, e.neighborhood)
    if (r) {
      // Flag permanently-closed places: leave them unenriched so they stand out
      // for removal rather than silently writing a dead venue's data.
      if (!ADDR_ONLY && (r.businessStatus === 'CLOSED_PERMANENTLY' || r.businessStatus === 'CLOSED_TEMPORARILY')) {
        closed++; closedList.push(`${e.name} (${r.businessStatus === 'CLOSED_TEMPORARILY' ? 'temp' : 'perm'})`)
        console.log(`  [${i}/${todo.length}] ⚠ CLOSED: ${e.name} — left unenriched, review/remove`)
        await sleep(DELAY); continue
      }
      if (r.address) e.address = r.address
      if (!ADDR_ONLY) {
        // objective fields only — never description / insiderTip
        if (!e.neighborhood && r.neighborhood) e.neighborhood = r.neighborhood
        if (r.lat != null) { e.lat = r.lat; e.lng = r.lng }
        if (r.price != null && r.price !== '') e.price = r.price
        if (r.cuisine.length) e.cuisine = r.cuisine
        if (r.hours) e.hours = r.hours
        if (r.rating != null) e.rating = r.rating
        if (r.website) e.website = r.website
        if (r.googleSummary) e.googleSummary = r.googleSummary
        e.enrichedAt = today
      }
      ok++
      console.log(`  [${i}/${todo.length}] ✓ ${e.name} → ${ADDR_ONLY ? (e.address || '?') : `${e.neighborhood || '?'} · ${e.price || '?'} · ${e.cuisine.join('/') || '—'}`}`)
    } else { miss++; console.log(`  [${i}/${todo.length}] · ${e.name} → no match`) }
  } catch (err) { miss++; console.log(`  [${i}/${todo.length}] ✗ ${e.name} → ${err.message}`) }
  await sleep(DELAY)
}

console.log(`\nEnriched ${ok}, missed ${miss}, closed ${closed}.`)
if (closedList.length) console.log('⚠ Permanently closed (remove from places.js):\n  - ' + closedList.join('\n  - '))
if (DRY) console.log('Dry run — no file written.')
else if (ok > 0) { fs.writeFileSync(FILE, emit(src, entries), 'utf8'); console.log(`Wrote ${FILE}`) }
else console.log('Nothing to write.')
