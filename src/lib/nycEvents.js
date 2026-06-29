// ── This Week in NYC — live events from NYC Open Data (Socrata) ─────────────
//
// Two official, open-licensed, CORS-enabled datasets — no API key, fetched
// straight from the browser, fails gracefully (returns []):
//
//   • Permitted Events (tvpp-9vvx) — approved street fairs, festivals, parades,
//     block parties, markets for the coming weeks. CURRENT. But noisy: most rows
//     are youth/adult sports permits and park-maintenance closures, so we filter
//     to consumer-facing event types and drop operational/logistics rows.
//   • Farmers Markets (8vwk-6iz2) — recurring weekly greenmarkets with their
//     day(s) of operation. Evergreen, always available.
//
// LEGAL: we surface only FACTS (event name, date, place) and link out to a map.
// We never copy a source's description text or photos. Attribution shown in UI.

import { fetchTicketmaster, isTicketmasterAvailable } from './ticketmaster'

const SOCRATA = 'https://data.cityofnewyork.us/resource'

// Coverage: the app only maps Manhattan + Brooklyn, so we drop events in the
// other boroughs (Queens, the Bronx, Staten Island) — they read as "too far".
const COVERED_BOROUGH = /manhattan|brooklyn/i

// Consumer-facing permitted-event types we keep (everything else — Sport - Youth,
// Sport - Adult, Production Event, load-in/out — is operational noise).
const PERMIT_KEEP = new Set([
  'Farmers Market', 'Parade', 'Block Party', 'Sidewalk Sale', 'Street Event',
  'Special Event', 'Plaza Partner Event', 'Plaza Event', 'Single Block Festival',
  'Health Fair', 'Religious Event', 'Athletic Race / Tour',
])
// Drop rows whose NAME is clearly operational (maintenance, closures, logistics,
// film/production permits) even if the type passed the whitelist — lots of
// "Special Event" rows are really lawn closures, permits, or internal records.
const PERMIT_NOISE = /maintenance|closed|closure|close to|bus operation|transportation operation|load[\s-]?in|load[\s-]?out|set[\s-]?up|break ?down|clean ?up|rehearsal|staging|lane closure|no event|sanitation|miscellaneous|hold for|^tbd|placeholder|test event|permit|\bripa\b|parks event|tree (work|removal)|\bfilm\b|production|photo ?shoot|repair|construction|inspection/i

// Promotional / private permits — brand activations, product launches, sampling
// pop-ups, corporate & press functions. These are marketing stunts or private
// events, not public happenings a city guide should recommend, and they have no
// real event page (searching their permit name returns agency/ad spam). Dropped.
// ("corporate" is qualified so the public J.P. Morgan Corporate Challenge stays.)
const PERMIT_PROMO = /\bactivation\b|brand experience|product launch|launch event|\bsampling\b|promotional|sponsored by|\badvertis|press (event|junket|preview)|influencer|private event|corporate (event|outing|function|party|picnic)|company (picnic|outing)/i

// Internal permit codes masquerading as event names ("FWC2026", "AB12"): a short
// letters-then-digits token with no real words. Dropped — they mean nothing to a user.
const PERMIT_CODE_NAME = /^[a-z]{2,6}\d{2,4}[a-z]?$/i

// Private / personal / hobby permits — birthday & shower parties, BBQs, picnics,
// day camps & day-care outings, CSA pickups, model-aircraft / hobby fields, brand
// staffing, "content days," etc. These are private gatherings or non-events, not
// public happenings a city guide should surface, and they flood the Free tab with
// names that mean nothing to a user. (Distinct from PERMIT_PROMO, which targets
// corporate/brand marketing.) Verified against a real Brooklyn-weekend pull: this
// removes "Felix First Birthday", "Model Helicopter Flying", "Flatbush Adult
// Daycare BBQ", "Coney Island Brand Ambassadors", camps, etc., while leaving real
// public events (Nathan's Hot Dog Contest, July 4th fireworks, Congo Square
// drummers, block parties, NYRR runs) untouched.
const PERMIT_PRIVATE = /\bbirthday\b|\bb-?day\b|baby shower|bridal shower|\bwedding\b|anniversary|\bfuneral\b|memorial service|\brepast\b|graduation|\breunion\b|\bbbq\b|barbecue|cook ?out|\bpicnic\b|day ?care|\bday camp\b|summer camp|\bcamp\b|after[- ]?school|mommy and me|kids? excursion|csa (pick ?up|pickup)|model (helicopter|plane|aircraft|rocket)|radio[- ]?controlled|\brc planes\b|hobby field|brand ambassador|content day|photo day|\boutreach\b/i
// Cryptic recurring camp/program codes that survive PERMIT_CODE_NAME because a
// season/year is appended ("SSS PPP Summer 2026", "PSDC Summer 2026").
const PERMIT_PROGRAM_CODE = /^[a-z]{2,6}( [a-z]{2,6}){0,2} (spring|summer|fall|winter)( \d{4})?$/i
// Fully-generic permit names that carry no public meaning standing alone.
const PERMIT_GENERIC = new Set(['celebration', 'party', 'event', 'gathering', 'outing', 'meetup', 'picnic', 'bbq', 'barbecue', 'cookout', 'show', 'tbd', 'various'])

const KIND_META = {
  'Farmers Market':        { emoji: '🌽', label: 'Farmers market', color: '#6fae8e' },
  'Parade':                { emoji: '🎉', label: 'Parade',         color: '#c98aa0' },
  'Block Party':           { emoji: '🎊', label: 'Block party',    color: '#c2a24e' },
  'Sidewalk Sale':         { emoji: '🛍️', label: 'Sidewalk sale',  color: '#c89a6a' },
  'Single Block Festival': { emoji: '🎪', label: 'Street festival',color: '#cc7d92' },
  'Street Event':          { emoji: '🎪', label: 'Street event',   color: '#cc7d92' },
  'Special Event':         { emoji: '✨', label: 'Event',          color: '#7e93c4' },
  'Plaza Partner Event':   { emoji: '✨', label: 'Plaza event',    color: '#9b86c4' },
  'Plaza Event':           { emoji: '✨', label: 'Plaza event',    color: '#9b86c4' },
  'Health Fair':           { emoji: '⚕️', label: 'Health fair',    color: '#8aa873' },
  'Religious Event':       { emoji: '🕊️', label: 'Gathering',      color: '#8aa873' },
  'Athletic Race / Tour':  { emoji: '🏃', label: 'Race / tour',    color: '#6fae8e' },
}

const pad = (n) => String(n).padStart(2, '0')
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
function startOfToday() { const d = new Date(); d.setHours(0, 0, 0, 0); return d }

// ── Pure transforms (exported for testing on raw rows) ──────────────────────

// Raw permitted-event rows → cleaned, deduped, consumer-facing events.
export function normalizePermitted(rows) {
  const seen = new Set()
  const out = []
  for (const r of rows || []) {
    const type = (r.event_type || '').trim()
    const name = (r.event_name || '').trim()
    if (!PERMIT_KEEP.has(type)) continue
    if (!name || PERMIT_NOISE.test(name) || PERMIT_PROMO.test(name) || PERMIT_CODE_NAME.test(name)) continue
    if (PERMIT_PRIVATE.test(name) || PERMIT_PROGRAM_CODE.test(name)) continue
    if (PERMIT_GENERIC.has(name.toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim())) continue
    const boro = (r.event_borough || '').trim()
    if (!COVERED_BOROUGH.test(boro)) continue          // Manhattan + Brooklyn only
    const start = r.start_date_time ? new Date(r.start_date_time) : null
    if (!start || isNaN(start.getTime())) continue
    // Dedupe permits that repeat across days (markets, multi-day fests): keep soonest.
    const key = name.toLowerCase() + '|' + (r.event_borough || '').trim()
    if (seen.has(key)) continue
    seen.add(key)
    const meta = KIND_META[type] || { emoji: '📍', label: 'Event', color: '#8aa4c0' }
    const loc = (r.event_location || '').trim()
    // Street-closure permits dump every affected block into event_location
    // ("MADISON AVE between E 51 and E 50, E 50 between …"). Keep only the first
    // segment so the card reads as one place, not a block-by-block list.
    const locShort = loc.split(/[:,]/)[0].trim() || loc
    out.push({
      id: 'permit_' + r.event_id,
      source: 'permitted',
      kind: type, emoji: meta.emoji, kindLabel: meta.label, color: meta.color,
      title: name,
      date: start,
      borough: boro,
      location: locShort,           // "Central Park: Cop Cot" / "Madison Ave, …" → first segment
      locationFull: loc,
    })
  }
  return out.sort((a, b) => a.date - b.date)
}

// Raw farmers-market rows → recurring market entries (latest year only).
export function normalizeMarkets(rows) {
  if (!rows || !rows.length) return []
  const maxYear = rows.reduce((m, r) => (r.year && r.year > m ? r.year : m), '0')
  const meta = KIND_META['Farmers Market']
  return rows.filter(r => r.year === maxYear && r.marketname && COVERED_BOROUGH.test(r.borough || '')).map(r => ({
    id: 'market_' + r.marketname.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    source: 'market',
    kind: 'Farmers Market', emoji: meta.emoji, kindLabel: meta.label, color: meta.color,
    title: r.marketname.trim(),
    days: (r.daysoperation || '').trim(),
    hours: (r.hoursoperations || '').trim(),
    borough: (r.borough || '').trim(),
    location: (r.streetaddress || '').trim(),
    lat: r.latitude ? +r.latitude : null,
    lng: r.longitude ? +r.longitude : null,
    // GrowNYC "…Greenmarket" rows get their real per-market page; other operators
    // (farmstands, youth markets, RiseBoro, etc.) have no reliable page, so
    // website is '' and the Free filter drops them rather than link a 404.
    website: greenmarketUrl(r.marketname),
  }))
}

// ── Editorial signal ranking ────────────────────────────────────────────────
// The home "This Week" strip should read like a tastemaker's pick, not a civic
// bulletin. We score every item by how likely a discerning user is to actually
// GO, then sort by it. Ticketed culture (concerts, shows) tops the list; real
// street events (parades, festivals) come next; generic civic entries (plaza
// notices, health fairs, religious gatherings) sink; recurring greenmarkets are
// kept but capped so they never flood the strip the way they used to.
const KIND_SIGNAL = {
  // Ticketed culture & sports — richest cards, highest intent
  'Music': 100, 'Arts & Theatre': 98, 'Show': 98, 'Concert': 100, 'Sports': 90,
  // Real, walk-up consumer street events
  'Parade': 74, 'Single Block Festival': 72, 'Street Event': 68, 'Block Party': 64,
  'Sidewalk Sale': 58, 'Athletic Race / Tour': 52,
  // Lower-signal civic entries
  'Plaza Partner Event': 48, 'Plaza Event': 48, 'Special Event': 44,
  'Health Fair': 30, 'Religious Event': 28,
  // Evergreen, but demoted + capped
  'Farmers Market': 24,
}

export function signalScore(e) {
  if (!e) return 0
  let s = e.source === 'ticketmaster' ? (KIND_SIGNAL[e.kind] ?? 92) : (KIND_SIGNAL[e.kind] ?? 40)
  if (e.image) s += 6        // a real photo = a far better card
  if (e.priceText) s += 2    // ticketed → concrete, attendable
  return s
}

// Merge events + markets into one editorially-ranked strip: signal desc, then
// soonest first. Low-signal markets are capped (default 2) so the feel stays
// curated even when the permit feed is thin.
//
// The home "This week" strip sits right above a dedicated "Tonight" tab that
// already lists tonight's ticketed shows. Showing the same ticketed concerts
// here (all dated today) made the two read as duplicates — so we PREFER the
// "week ahead" set (later-day ticketed events + the week's street festivals,
// parades, and markets, which the Tonight tab never shows).
//
// BUT this is adaptive, not a hard drop: if there isn't enough non-tonight
// content to carry the strip (some weeks the street-event / market feeds are
// thin), we fall back to including tonight's ticketed shows so the section is
// never empty. `minDifferentiated` is the floor of non-tonight items required
// before we hide tonight's ticketed events.
export function rankThisWeek(events = [], markets = [], { marketCap = 2, limit = 12, minDifferentiated = 4, windowDays = 7 } = {}) {
  const today = startOfToday()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const windowEnd = new Date(today.getTime() + windowDays * 24 * 60 * 60 * 1000)
  const isTicketedToday = (e) =>
    e && e.source === 'ticketmaster' && e.date instanceof Date && !isNaN(e.date) && e.date >= today && e.date < tomorrow
  const dateRank = (e) => (e && e.date instanceof Date && !isNaN(e.date)) ? (e.date - today) : Number.MAX_SAFE_INTEGER

  // The underlying ticket fetch now spans ~18 days for the events browser; the
  // home strip is "this WEEK", so drop anything dated beyond the window. Markets
  // are recurring (no date) and always allowed.
  const inWindow = (e) => !(e.date instanceof Date) || isNaN(e.date) || (e.date >= today && e.date < windowEnd)

  const everything = [...events, ...markets].filter(inWindow)
  const nonTonight = everything.filter(e => !isTicketedToday(e))
  // Differentiate from the Tonight tab only when we can still fill the strip.
  const pool = nonTonight.length >= minDifferentiated ? nonTonight : everything

  pool.sort((a, b) => {
    const ds = signalScore(b) - signalScore(a)
    return ds !== 0 ? ds : dateRank(a) - dateRank(b)
  })
  // Collapse the same event across multiple days to ONE card. A multi-night run
  // (a show that plays all week, a recurring series) arrives as separate dated
  // events; on the home strip they read as duplicates. We key on title + venue
  // (ignoring the day) and, because the pool is already sorted soonest-first
  // within an equal signal score, the first one we keep is the nearest date.
  const runKey = (e) =>
    (e.title || '').toLowerCase().replace(/\s*[*•|]\s*.*$/, '').replace(/[^a-z0-9]+/g, ' ').trim()
    + '|' + (e.location || '').toLowerCase().trim()
  const out = []
  const seenRun = new Set()
  let marketsUsed = 0
  for (const e of pool) {
    const k = runKey(e)
    if (seenRun.has(k)) continue       // same event, different day → keep only the soonest
    seenRun.add(k)
    if (e.source === 'market') {
      if (marketsUsed >= marketCap) continue
      marketsUsed++
    }
    out.push(e)
    if (out.length >= limit) break
  }
  return out
}

// Google Maps link for an event/market. Maps the LOCATION (venue or street),
// not the event title — searching a street-fair's name on Maps returns nothing,
// whereas the venue/street drops a real pin.
export function eventMapsUrl(e) {
  const q = [e.location || e.locationFull, e.borough, 'New York'].filter(Boolean).join(' ')
  return 'https://www.google.com/maps/search/' + encodeURIComponent(q)
}

// Ticket-finding search → reliably lands on the box office for shows whose
// Ticketmaster URL is unreliable (Broadway / theatre is often sold elsewhere).
export function eventTicketSearchUrl(e) {
  const q = [e.title, e.location, 'tickets', e.borough, 'New York'].filter(Boolean).join(' ')
  return 'https://www.google.com/search?q=' + encodeURIComponent(q)
}

// "What's happening" link → jumps STRAIGHT to the event's likely official page
// (the organizer's site, where the real description/hours live) rather than a
// search-results list. Permitted street events have no URL in the city's data,
// so we use DuckDuckGo's "go to first result" redirect (a leading "\"): for a
// named event the top result is its own page. The event TYPE is included so the
// query has enough context to resolve the right page.
export function eventSearchUrl(e) {
  const kind = e.source === 'market' ? 'greenmarket' : (e.kindLabel || 'event')
  const q = [e.title, kind, e.borough, 'New York', e.date instanceof Date && !isNaN(e.date) ? e.date.getFullYear() : '']
    .filter(Boolean).join(' ')
  return 'https://duckduckgo.com/?q=' + encodeURIComponent('\\' + q)
}

// ── Official-link resolver for free events (see "Free links rule.md") ─────────
// NYC's permit feed gives free events a name + date + place but NO website, so
// most "free" cards can only fall back to a web search — meaningless to users.
// We instead recognize the handful of well-known recurring free SERIES/organizers
// (most of NYC's free programming runs through them) and link straight to their
// official page. Keys are lowercase substrings matched against the event title;
// most-specific first. All URLs verified reachable. Hudson Classical Theater is
// intentionally omitted — it has no working site.
const FREE_SERIES_LINKS = [
  ['classical theatre of harlem', 'https://www.cthnyc.org/'],
  ['summerstage',                 'https://cityparksfoundation.org/summerstage/'],
  ['shakespeare in the park',     'https://publictheater.org/'],
  ['free shakespeare',            'https://publictheater.org/'],
  ['celebrate brooklyn',          'https://www.bricartsmedia.org/'],
  ['smorgasburg',                 'https://www.smorgasburg.com/'],
  ['bryant park',                 'https://bryantpark.org/calendar'],
  ['tsq live',                    'https://www.timessquarenyc.org/events'],
  ['times square',                'https://www.timessquarenyc.org/events'],
  ['governors island',            'https://www.govisland.com/things-to-do/events'],
  ['brooklyn academy of music',   'https://www.bam.org/'],
  ['camp half blood',            'https://www.bam.org/'],   // BAM / Brownstone Books series
  ['west indian',                 'https://www.wiadcacarnival.org/'],
  ['j’ouvert',                    'https://www.wiadcacarnival.org/'],
  ['jouvert',                     'https://www.wiadcacarnival.org/'],
  ['nyc pride',                   'https://www.nycpride.org/'],
  ['pride march',                 'https://www.nycpride.org/'],
  ['village halloween',           'https://halloween-nyc.com/'],
  ['halloween parade',            'https://halloween-nyc.com/'],
  ['harlem week',                 'https://www.harlemweek.com/'],
  ['shape up nyc',                'https://www.nycgovparks.org/programs/recreation/shape-up-nyc'],
]

// The REAL official page for an event, or '' if we don't have one (i.e. the only
// option would be a web search). Used to (a) label the detail button "Visit
// website" and (b) keep the Free tab to events users can actually act on.
//   1. an explicit website (markets carry their GrowNYC page)
//   2. greenmarkets — all GrowNYC, page built from the name
//   3. a known free series/organizer
//   4. ticketed events keep their ticket URL
// Only markets literally branded "…Greenmarket" are GrowNYC (verified: their
// grownyc.org/locations/<slug>/ page resolves). The generic "farmers market",
// "farmstand", and "youth market" rows are independent operators (RiseBoro,
// hospital farmstands, etc.) with NO GrowNYC page — guessing one 404s, so we
// return '' for them and let the Free filter drop the dead link.
export function greenmarketUrl(title) {
  if (!/greenmarket/i.test(title || '')) return ''
  return 'https://grownyc.org/locations/' + (title || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '/'
}
export function eventOfficialUrl(e) {
  if (!e) return ''
  if (e.website) return e.website
  const gm = greenmarketUrl(e.title)
  if (gm) return gm
  const hay = (e.title || '').toLowerCase()
  for (const [kw, url] of FREE_SERIES_LINKS) if (hay.includes(kw)) return url
  if (e.source === 'ticketmaster' && e.ticketUrl) return e.ticketUrl
  return ''
}

// ── Fetchers (browser) ──────────────────────────────────────────────────────

async function getJSON(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Socrata ' + res.status)
  return res.json()
}

// This week's permitted events (today → +7 days), cleaned.
export async function fetchThisWeekEvents() {
  const today = startOfToday()
  const end = new Date(today); end.setDate(end.getDate() + 7)
  const where = `start_date_time >= '${isoDate(today)}T00:00:00' AND start_date_time < '${isoDate(end)}T00:00:00' AND (event_borough = 'Manhattan' OR event_borough = 'Brooklyn')`
  const url = `${SOCRATA}/tvpp-9vvx.json?$where=${encodeURIComponent(where)}&$order=start_date_time&$limit=600`
  try { return normalizePermitted(await getJSON(url)) }
  catch (e) { console.warn('[nycEvents] permitted events failed:', e); return [] }
}

// Recurring farmers markets (latest year).
export async function fetchFarmersMarkets() {
  const url = `${SOCRATA}/8vwk-6iz2.json?$order=${encodeURIComponent('year DESC')}&$limit=400`
  try { return normalizeMarkets(await getJSON(url)) }
  catch (e) { console.warn('[nycEvents] farmers markets failed:', e); return [] }
}

// ── Session cache ────────────────────────────────────────────────────────────
// Both the home "This week" strip and the Tonight events browser call
// fetchThisWeek, and the browser remounts on every tab visit. Without a cache
// that meant a fresh network fetch (and a ~1s loading flash) each time. We cache
// the combined result for a few minutes and de-dupe in-flight requests, so
// revisits are instant and we don't hammer the APIs.
const FETCH_CACHE_MS = 5 * 60 * 1000
let _twCache = null        // { at, data }
let _twPromise = null      // in-flight de-dupe

// Synchronous peek at the cache — lets a component initialise its state from
// already-loaded data so it renders populated on the first frame (no flash).
export function getThisWeekCached() {
  return (_twCache && (Date.now() - _twCache.at) < FETCH_CACHE_MS) ? _twCache.data : null
}

// Combined loader for the "This Week in NYC" home section + Tonight browser.
export async function fetchThisWeek() {
  const cached = getThisWeekCached()
  if (cached) return cached
  if (_twPromise) return _twPromise
  _twPromise = (async () => {
    const [permitted, tickets, markets] = await Promise.all([
      fetchThisWeekEvents(), fetchTicketmaster(), fetchFarmersMarkets(),
    ])
    // Ticketmaster (rich) + permitted (breadth), interleaved by date.
    const events = [...tickets, ...permitted].sort((a, b) => a.date - b.date)
    // Editorially-ranked strip for the home section (high-signal first, markets capped).
    const ranked = rankThisWeek(events, markets)
    const data = { events, markets, ranked }
    // Only cache a HEALTHY result. NYC always has ticketed shows, so tickets===0
    // means Ticketmaster was rate-limited/down — caching that would strand the
    // events browser on "free only" (the category tabs vanish) for the full TTL.
    // Leaving it uncached makes the next mount retry and recover immediately.
    if (tickets.length > 0 || !isTicketmasterAvailable()) _twCache = { at: Date.now(), data }
    return data
  })()
  try {
    return await _twPromise
  } finally {
    _twPromise = null
  }
}
