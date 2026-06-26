// ── Ticketmaster Discovery API — the "depth" layer for This Week in NYC ──────
//
// Adds ticketed culture/sports/shows with RICH detail the permit feed lacks:
// real photos, venue, price, and a tickets link. Gated by an env var so the app
// works without it; fails soft (returns []). Stays inside Ticketmaster's terms:
// we use their API key, show their image + a "Get tickets" link back to them.
//
// Setup: add VITE_TICKETMASTER_API_KEY to your .env (free key from
// developer.ticketmaster.com). Without it this layer is simply skipped.

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2/events.json'

// Discovery "segment" → display meta, matching our event card vocabulary.
const SEGMENT_META = {
  Music:            { emoji: '🎵', label: 'Concert',  color: '#a3408c' },
  Sports:           { emoji: '🏆', label: 'Sports',   color: '#4A8C5C' },
  'Arts & Theatre': { emoji: '🎭', label: 'Show',     color: '#A65B7B' },
  Family:           { emoji: '🎪', label: 'Family',   color: '#C6892F' },
  Film:             { emoji: '🎬', label: 'Film',     color: '#7e93c4' },
  Miscellaneous:    { emoji: '🎟️', label: 'Event',    color: '#7e93c4' },
}
// In-coverage venue cities — all five boroughs (TM lists Manhattan venues as
// "New York", and Queens venues under their neighborhood city names).
const TM_CITY_OK = /^(new york|manhattan|brooklyn|bronx|queens|staten island|new york city|long island city|astoria|flushing|forest hills|corona|jamaica|elmhurst|sunnyside|ridgewood|college point)$/i
const boroughOf = (c) =>
  /brooklyn/i.test(c) ? 'Brooklyn'
  : /bronx/i.test(c) ? 'The Bronx'
  : /staten island/i.test(c) ? 'Staten Island'
  : /queens|long island city|astoria|flushing|forest hills|corona|jamaica|elmhurst|sunnyside|ridgewood|college point/i.test(c) ? 'Queens'
  : 'Manhattan'

// The full live-entertainment catalog across all five boroughs: concerts,
// comedy & theatre, sports, and family shows. (We previously kept Music+Sports
// only; the events browser is the app's reason-to-exist, so we now pull the
// whole night-out menu.) Sightseeing tours / admissions / cruises are still
// dropped as noise — but NOT for Music or Arts & Theatre, where "Tour" usually
// names a concert tour or a comedy tour, not a building walk-through.
const TM_SEGMENTS_OK = new Set(['Music', 'Sports', 'Arts & Theatre', 'Family'])
const TM_NOISE = /\b(tour|admission|sightseeing|hop[- ]?on|self[- ]?guided|cruise|observation deck)\b/i

export function isTicketmasterAvailable() {
  return !!import.meta.env.VITE_TICKETMASTER_API_KEY
}

const pad = (n) => String(n).padStart(2, '0')
const zStamp = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00Z`

function bestImage(images) {
  if (!Array.isArray(images) || !images.length) return null
  // Prefer a wide (16:9), reasonably large image.
  const wide = images.filter(i => i.ratio === '16_9' && i.width >= 600).sort((a, b) => b.width - a.width)
  return (wide[0] || images.slice().sort((a, b) => (b.width || 0) - (a.width || 0))[0])?.url || null
}

function priceText(ranges) {
  if (!Array.isArray(ranges) || !ranges.length) return ''
  const r = ranges[0]
  if (r.min == null && r.max == null) return ''
  if (r.min === r.max) return `$${Math.round(r.min)}`
  return `$${Math.round(r.min)}–$${Math.round(r.max)}`
}

// Raw Discovery rows → normalized events (same shape as nycEvents items).
export function normalizeTicketmaster(json) {
  const rows = json?._embedded?.events || []
  const out = []
  const seen = new Set()   // collapse Ticketmaster's duplicate listings (presale/general/etc.)
  for (const ev of rows) {
    const venue = ev?._embedded?.venues?.[0]
    const city = venue?.city?.name || ''
    if (!TM_CITY_OK.test(city.trim())) continue                 // Manhattan + Brooklyn only
    const startISO = ev?.dates?.start?.dateTime
      || (ev?.dates?.start?.localDate ? `${ev.dates.start.localDate}T${ev.dates.start.localTime || '00:00:00'}` : null)
    const date = startISO ? new Date(startISO) : null
    if (!date || isNaN(date.getTime())) continue
    const cls = ev?.classifications?.[0] || {}
    const seg = cls.segment?.name || 'Miscellaneous'
    if (!TM_SEGMENTS_OK.has(seg)) continue                      // see TM_SEGMENTS_OK note above
    // Drop venue/stadium tours + admissions — but NOT for Music or Arts &
    // Theatre, where a "Tour" is a concert/comedy tour, not a building walk-through.
    if (seg !== 'Music' && seg !== 'Arts & Theatre' && TM_NOISE.test(ev.name || '')) continue
    // De-dupe: same title + venue + day = one event (keeps genuine multi-night runs,
    // which differ by date). Ticketmaster often lists the same show several times.
    const dupKey = `${(ev.name || '').trim().toLowerCase()}|${(venue?.name || '').toLowerCase()}|${date.toDateString()}`
    if (seen.has(dupKey)) continue
    seen.add(dupKey)
    const meta = SEGMENT_META[seg] || SEGMENT_META.Miscellaneous
    out.push({
      id: 'tm_' + ev.id,
      source: 'ticketmaster',
      kind: seg, genre: cls.genre?.name || '', emoji: meta.emoji, kindLabel: meta.label, color: meta.color,
      title: ev.name,
      date,
      borough: boroughOf(city),
      location: venue?.name || '',
      locationFull: [venue?.name, venue?.address?.line1].filter(Boolean).join(', '),
      image: bestImage(ev.images),
      ticketUrl: ev.url || '',
      priceText: priceText(ev.priceRanges),
    })
  }
  return out.sort((a, b) => a.date - b.date)
}

// One date-bounded page (max 199) → normalized events.
async function fetchTMRange(key, start, end) {
  const params = new URLSearchParams({
    apikey: key,
    dmaId: '345',                 // New York DMA
    startDateTime: zStamp(start),
    endDateTime: zStamp(end),
    size: '199',                  // max page size
    sort: 'date,asc',
    countryCode: 'US',
  })
  const res = await fetch(`${TM_BASE}?${params}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Ticketmaster ' + res.status)
  return normalizeTicketmaster(await res.json())
}

// NYC-metro ticketed events (today → +daysAhead). Default window is ~2.5 weeks
// so the events browser can offer "this weekend" and "next week"; the home strip
// re-scopes to 7 days itself. [] if no key/error.
//
// NYC has 100+ ticketed shows TONIGHT, so a single date-asc page never reaches
// later dates — we fetch in DATE BUCKETS and merge, which is what actually makes
// the wider window reach the weekend and beyond.
export async function fetchTicketmaster(daysAhead = 18) {
  const key = import.meta.env.VITE_TICKETMASTER_API_KEY
  if (!key) return []
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const dayAt = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d }
  const edges = [0, 2, 5, 9, daysAhead].filter((v, i, a) => i === 0 || v > a[i - 1])
  const ranges = []
  for (let i = 0; i < edges.length - 1; i++) ranges.push([dayAt(edges[i]), dayAt(edges[i + 1])])
  const end = dayAt(daysAhead)
  try {
    const chunks = await Promise.all(ranges.map(([s, e]) => fetchTMRange(key, s, e).catch(() => [])))
    // Merge, de-dupe by id, and drop anything outside the window (the API
    // occasionally returns rescheduled shows with a stale past localDate).
    const seen = new Set()
    const out = []
    for (const arr of chunks) for (const e of arr) {
      if (!e || !(e.date instanceof Date) || e.date < today || e.date >= end || seen.has(e.id)) continue
      seen.add(e.id); out.push(e)
    }
    return out.sort((a, b) => a.date - b.date)
  } catch (e) {
    console.warn('[ticketmaster] fetch failed:', e)
    return []
  }
}
