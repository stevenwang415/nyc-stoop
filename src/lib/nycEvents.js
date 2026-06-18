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

import { fetchTicketmaster } from './ticketmaster'

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

// Internal permit codes masquerading as event names ("FWC2026", "AB12"): a short
// letters-then-digits token with no real words. Dropped — they mean nothing to a user.
const PERMIT_CODE_NAME = /^[a-z]{2,6}\d{2,4}[a-z]?$/i

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
    if (!name || PERMIT_NOISE.test(name) || PERMIT_CODE_NAME.test(name)) continue
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
  }))
}

// Google Maps search link for an event/market (we don't republish source pages).
export function eventMapsUrl(e) {
  const q = [e.title, e.location || e.locationFull, e.borough, 'New York'].filter(Boolean).join(' ')
  return 'https://www.google.com/maps/search/' + encodeURIComponent(q)
}

// Web search link → the organizer's own page (where the real description, hours,
// and tickets live). This is how we send users to details we can't host.
export function eventSearchUrl(e) {
  const q = [e.title, e.borough, 'NYC', e.source === 'market' ? 'greenmarket' : 'event'].filter(Boolean).join(' ')
  return 'https://www.google.com/search?q=' + encodeURIComponent(q)
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

// Combined loader for the "This Week in NYC" home section.
export async function fetchThisWeek() {
  const [permitted, tickets, markets] = await Promise.all([
    fetchThisWeekEvents(), fetchTicketmaster(), fetchFarmersMarkets(),
  ])
  // Ticketmaster (rich) + permitted (breadth), interleaved by date.
  const events = [...tickets, ...permitted].sort((a, b) => a.date - b.date)
  return { events, markets }
}
