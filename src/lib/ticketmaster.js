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
  Film:             { emoji: '🎬', label: 'Film',     color: '#7e93c4' },
  Miscellaneous:    { emoji: '🎟️', label: 'Event',    color: '#7e93c4' },
}
// Venue cities we treat as in-coverage (Manhattan venues list as "New York").
const TM_CITY_OK = /^(new york|manhattan|brooklyn|new york city)$/i

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
  for (const ev of rows) {
    const venue = ev?._embedded?.venues?.[0]
    const city = venue?.city?.name || ''
    if (!TM_CITY_OK.test(city.trim())) continue                 // Manhattan + Brooklyn only
    const startISO = ev?.dates?.start?.dateTime
      || (ev?.dates?.start?.localDate ? `${ev.dates.start.localDate}T${ev.dates.start.localTime || '00:00:00'}` : null)
    const date = startISO ? new Date(startISO) : null
    if (!date || isNaN(date.getTime())) continue
    const seg = ev?.classifications?.[0]?.segment?.name || 'Miscellaneous'
    const meta = SEGMENT_META[seg] || SEGMENT_META.Miscellaneous
    out.push({
      id: 'tm_' + ev.id,
      source: 'ticketmaster',
      kind: seg, emoji: meta.emoji, kindLabel: meta.label, color: meta.color,
      title: ev.name,
      date,
      borough: /brooklyn/i.test(city) ? 'Brooklyn' : 'Manhattan',
      location: venue?.name || '',
      locationFull: [venue?.name, venue?.address?.line1].filter(Boolean).join(', '),
      image: bestImage(ev.images),
      ticketUrl: ev.url || '',
      priceText: priceText(ev.priceRanges),
    })
  }
  return out.sort((a, b) => a.date - b.date)
}

// This week's NYC-metro ticketed events (today → +7 days). [] if no key/error.
export async function fetchTicketmaster() {
  const key = import.meta.env.VITE_TICKETMASTER_API_KEY
  if (!key) return []
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const end = new Date(today); end.setDate(end.getDate() + 7)
  const params = new URLSearchParams({
    apikey: key,
    dmaId: '345',                 // New York DMA
    startDateTime: zStamp(today),
    endDateTime: zStamp(end),
    size: '60',
    sort: 'date,asc',
    countryCode: 'US',
  })
  try {
    const res = await fetch(`${TM_BASE}?${params}`, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error('Ticketmaster ' + res.status)
    return normalizeTicketmaster(await res.json())
  } catch (e) {
    console.warn('[ticketmaster] fetch failed:', e)
    return []
  }
}
