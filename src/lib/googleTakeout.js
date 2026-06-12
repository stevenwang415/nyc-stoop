// ── Google Takeout (Maps - Your Places) parser ────────────────────────────
//
// Google's Takeout export (takeout.google.com → "Maps (your places)") produces
// a ZIP containing one file per saved list. The files come in two formats
// depending on when the list was created:
//
//   • Older lists: CSV with columns Title, Note, URL[, Comment, ...]
//   • Newer lists: GeoJSON (.geojson) with FeatureCollection of Points
//
// This parser handles both. For each item it extracts:
//   { name, address, lat, lng, note, googlePlaceId }
//
// — neighborhood is left blank; user_venue creation upstream can default it.
// — lat/lng comes from the URL (Google embeds @lat,lng,zoom in the place URL)
//   or directly from GeoJSON geometry coordinates.

/** Minimal CSV parser. Handles double-quoted fields with embedded commas / newlines.
 *  Not a full RFC 4180 implementation, but covers Google Takeout's well-formed CSVs. */
export function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') { inQuotes = false }
      else { field += c }
    } else {
      if (c === '"') { inQuotes = true }
      else if (c === ',') { row.push(field); field = '' }
      else if (c === '\r') { /* skip */ }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
      else { field += c }
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows.filter(r => r.length > 1 || (r.length === 1 && r[0].trim()))
}

/** Extract { lat, lng } from a Google Maps URL like:
 *  https://www.google.com/maps/place/Foo/@40.7287,-74.0007,17z/data=...
 *  Returns { lat: null, lng: null } if no coordinates found. */
function extractLatLngFromUrl(url) {
  if (!url) return { lat: null, lng: null }
  const m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (!m) return { lat: null, lng: null }
  return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
}

/** Extract the place name from the URL path if the CSV's Title column is empty.
 *  Falls back to a sanitized "Untitled saved place". */
function extractNameFromUrl(url) {
  if (!url) return ''
  const m = url.match(/\/place\/([^/]+)\//)
  if (!m) return ''
  try { return decodeURIComponent(m[1].replace(/\+/g, ' ')) }
  catch { return m[1] }
}

/** Try to pull a Google Place ID out of the URL's `1s` data field — present
 *  on some links and useful if we later upgrade to a Places API lookup. */
function extractPlaceIdFromUrl(url) {
  if (!url) return ''
  const m = url.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/)
  return m ? m[1] : ''
}

/** Parse a Takeout CSV file (Want to go.csv, Favorites.csv, custom lists, etc.).
 *  Returns an array of normalized entries. */
export function parseTakeoutCSV(text) {
  const rows = parseCSV(text)
  if (rows.length === 0) return []
  const header = rows[0].map(h => h.trim().toLowerCase())
  const idx = {
    title: header.indexOf('title'),
    note:  header.indexOf('note'),
    url:   header.indexOf('url'),
    comment: header.indexOf('comment'),
  }
  // If we can't find a Title column, assume it's the first column.
  if (idx.title === -1) idx.title = 0
  if (idx.url   === -1) idx.url   = 2

  const out = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    if (!r || r.length === 0) continue
    const title = (r[idx.title] || '').trim()
    const url   = (r[idx.url]   || '').trim()
    const note  = idx.note    >= 0 ? (r[idx.note]    || '').trim() : ''
    const comment = idx.comment >= 0 ? (r[idx.comment] || '').trim() : ''
    if (!title && !url) continue
    const { lat, lng } = extractLatLngFromUrl(url)
    const name = title || extractNameFromUrl(url) || 'Untitled saved place'
    out.push({
      name,
      address: '',
      lat, lng,
      note: [note, comment].filter(Boolean).join(' · '),
      googlePlaceId: extractPlaceIdFromUrl(url),
      sourceUrl: url,
    })
  }
  return out
}

/** Parse a Takeout GeoJSON file (newer list export format). */
export function parseTakeoutGeoJSON(text) {
  let data
  try { data = JSON.parse(text) }
  catch { return [] }
  const features = data?.features || []
  return features.map(f => {
    const coords = f?.geometry?.coordinates || []  // [lng, lat]
    const props = f?.properties || {}
    const loc = props?.location || {}
    return {
      name: loc?.name || props?.name || 'Untitled saved place',
      address: loc?.address || props?.address || '',
      lat: typeof coords[1] === 'number' ? coords[1] : null,
      lng: typeof coords[0] === 'number' ? coords[0] : null,
      note: props?.description || '',
      googlePlaceId: '',
      sourceUrl: loc?.url || '',
    }
  }).filter(it => it.name)
}

/** Dispatch on file extension and parse accordingly. Returns normalized array. */
export async function parseTakeoutFile(file) {
  if (!file) return []
  const name = (file.name || '').toLowerCase()
  const text = await file.text()
  if (name.endsWith('.geojson') || name.endsWith('.json')) {
    return parseTakeoutGeoJSON(text)
  }
  // Default to CSV — covers .csv and any unknown extension that contains CSV data.
  return parseTakeoutCSV(text)
}
