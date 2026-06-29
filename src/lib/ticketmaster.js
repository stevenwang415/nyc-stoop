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

// ── Overlap rule (see "Overlap rule.md") ────────────────────────────────────
// Ticketmaster lists the SAME game/show several times — once per ticket package
// or section ("… * Grandstand", "… * Premium", "Pinstripe Pass * …"). Those are
// not distinct events; collapse them to one canonical card. We do it by reducing
// each title to a "core" matchup (package noise stripped) and de-duping on
// core + venue + day. Multi-night runs survive (they differ by day).
const PKG_LABEL = /\b(pinstripe pass|field mvp|all[- ]inclusive|hospitality|premium|grandstand|bleacher(?:s)?|terrace|loge|suite|club|vip|mvp|sro|standing room|parking|pre[- ]?sale|presale|package|on[- ]?site|onsite|meet (?:&|and) greet|early entry)\b/i

function coreTitle(name) {
  let t = String(name || '').trim()
  // Split on the separators TM uses between matchup and package ("*", "•", "|", " - ").
  const parts = t.split(/\s*[*•|]\s*|\s+-\s+/).map(s => s.trim()).filter(Boolean)
  if (parts.length > 1) {
    // Drop any segment that is purely a package label; keep the real matchup.
    const kept = parts.filter(p => !PKG_LABEL.test(p))
    if (kept.length) t = kept.join(' ')
  }
  return t
    .toLowerCase()
    .replace(/\bvs?\.?\b/g, 'vs')          // unify "v." / "vs." / "vs"
    .replace(/[^a-z0-9]+/g, ' ')           // strip punctuation
    .replace(/\s+/g, ' ')
    .trim()
}

// Raw Discovery rows → normalized events (same shape as nycEvents items).
export function normalizeTicketmaster(json) {
  const rows = json?._embedded?.events || []
  const out = []
  const byCore = new Map()  // core+venue+day → index in `out` (overlap rule)
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
    const meta = SEGMENT_META[seg] || SEGMENT_META.Miscellaneous
    // Venue coordinates (present on ~100% of events) power "Near me" /
    // neighborhood filtering — the app classifies them with classifyLatLngToArea.
    const vlat = venue?.location?.latitude != null ? +venue.location.latitude : null
    const vlng = venue?.location?.longitude != null ? +venue.location.longitude : null
    const item = {
      id: 'tm_' + ev.id,
      source: 'ticketmaster',
      kind: seg, genre: cls.genre?.name || '', emoji: meta.emoji, kindLabel: meta.label, color: meta.color,
      title: ev.name,
      date,
      borough: boroughOf(city),
      location: venue?.name || '',
      locationFull: [venue?.name, venue?.address?.line1].filter(Boolean).join(', '),
      lat: Number.isFinite(vlat) ? vlat : null,
      lng: Number.isFinite(vlng) ? vlng : null,
      zip: venue?.postalCode || '',
      image: bestImage(ev.images),
      ticketUrl: ev.url || '',
      priceText: priceText(ev.priceRanges),
    }
    // Overlap rule: collapse package/section variants of the same event. Key on
    // the core matchup + venue + day; if we already have one, keep the MORE
    // canonical listing (no package suffix → shortest title wins).
    const core = coreTitle(ev.name)
    const dupKey = `${core}|${(venue?.name || '').toLowerCase()}|${date.toDateString()}`
    if (byCore.has(dupKey)) {
      const i = byCore.get(dupKey)
      if ((item.title || '').length < (out[i].title || '').length) out[i] = item
      continue
    }
    byCore.set(dupKey, out.length)
    out.push(item)
  }
  return out.sort((a, b) => a.date - b.date)
}

// One date-bounded page (max 199) → normalized events. `scope` selects the
// geographic filter: the New York DMA (default, broad) or a single city — used to
// pull a smaller borough (Brooklyn) directly so it isn't crowded out of the
// date-sorted DMA pages by Manhattan's far larger volume.
async function fetchTMRange(key, start, end, scope = { dmaId: '345' }) {
  const params = new URLSearchParams({
    apikey: key,
    startDateTime: zStamp(start),
    endDateTime: zStamp(end),
    size: '199',                  // max page size
    sort: 'date,asc',
    countryCode: 'US',
    ...scope,
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
export async function fetchTicketmaster(daysAhead = 10) {
  const key = import.meta.env.VITE_TICKETMASTER_API_KEY
  if (!key) return []
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const dayAt = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d }
  // 3 buckets cover the browser's needs (tonight / weekend / this week ≤ ~8 days)
  // — fewer parallel calls than before, so we stay well under the key's rate
  // limit even when the user reloads a lot.
  const edges = [0, 2, 6, daysAhead].filter((v, i, a) => i === 0 || v > a[i - 1])
  const ranges = []
  for (let i = 0; i < edges.length - 1; i++) ranges.push([dayAt(edges[i]), dayAt(edges[i + 1])])
  const end = dayAt(daysAhead)
  // One automatic retry per bucket after a short pause — recovers from a transient
  // 429 instead of silently dropping that slice of the catalog.
  const fetchWithRetry = (s, e, scope) => fetchTMRange(key, s, e, scope).catch(
    () => new Promise(r => setTimeout(r, 400)).then(() => fetchTMRange(key, s, e, scope)).catch(() => [])
  )
  try {
    // Main DMA buckets (Manhattan-rich) + a dedicated Brooklyn-by-city pull so the
    // smaller borough's concerts/comedy/sports actually make it into the results
    // instead of being paged out by Manhattan. Brooklyn's whole-window volume fits
    // one page, so a single call covers it. (Manhattan stays well-covered by DMA.)
    const calls = ranges.map(([s, e]) => fetchWithRetry(s, e))
    calls.push(fetchWithRetry(today, end, { city: 'Brooklyn' }))
    const chunks = await Promise.all(calls)
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
