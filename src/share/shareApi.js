// Share v2.0 API client — friends + photos (friends-only visibility).
// Mirrors src/auth/api.js conventions: same API_URL resolution, Bearer JWT
// from the auth token store. All calls require a signed-in user.
import { getToken } from '../auth/api.js'

// DEV: share calls go SAME-ORIGIN to the Vite dev server, where
// scripts/devShare.mjs answers them (no backend deploy needed for testing).
// Builds (including the iOS app) always use the real API URL.
const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

async function call(path, { method = 'GET', body } = {}) {
  const token = getToken()
  if (!token) throw new Error('signed-out')
  const res = await fetch(API_URL + path, {
    method,
    headers: {
      Authorization: 'Bearer ' + token,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let detail = 'Request failed'
    try { detail = (await res.json()).detail || detail } catch {}
    const err = new Error(detail)
    err.status = res.status
    throw err
  }
  // The deployed vercel.json only routes /share/* to the API after the next
  // git push — until then the SPA catch-all answers these paths with the
  // app's index.html (a 200!). Detect that and report it as "not deployed"
  // instead of letting JSON.parse explode into a fake network error.
  const ctype = res.headers.get('content-type') || ''
  if (!ctype.includes('application/json')) {
    const err = new Error('Share endpoints not deployed yet')
    err.status = 404
    throw err
  }
  return res.json()
}

// ── Friends ────────────────────────────────────────────────────────────────
export const getMyCode = () => call('/share/me/code')
export const regenerateCode = () => call('/share/me/code/regenerate', { method: 'POST' })
export const redeemCode = (code) => call('/share/friends/redeem', { method: 'POST', body: { code } })
export const listFriends = () => call('/share/friends')
export const unfriend = (id) => call(`/share/friends/${id}`, { method: 'DELETE' })
export const blockUser = (id) => call(`/share/friends/${id}/block`, { method: 'POST' })

// ── Photos ─────────────────────────────────────────────────────────────────
export const createPhoto = (photo) => call('/share/photos', { method: 'POST', body: photo })
export const myPhotos = () => call('/share/photos/mine')
export const friendsFeed = () => call('/share/feed')
export const updatePhoto = (id, fields) => call(`/share/photos/${id}`, { method: 'PATCH', body: fields })
export const deletePhoto = (id) => call(`/share/photos/${id}`, { method: 'DELETE' })
export const reportPhoto = (id) => call(`/share/photos/${id}/report`, { method: 'POST' })

/** Full-size image → object URL (img tags can't send Bearer headers). Caller
 *  should URL.revokeObjectURL when done. */
export async function fetchPhotoImage(id) {
  const res = await fetch(`${API_URL}/share/photos/${id}/image`, {
    headers: { Authorization: 'Bearer ' + getToken() },
  })
  if (!res.ok) throw new Error('image fetch failed')
  return URL.createObjectURL(await res.blob())
}

// ── Client-side image prep ─────────────────────────────────────────────────
// Resize to ≤1600px JPEG (data cost) + 320px thumbnail (rides inline in feed
// responses). Canvas re-encoding also STRIPS EXIF — including GPS — which is
// a privacy requirement, not an accident (SHARE_SPEC_v2.0.md §3).
function drawScaled(img, maxDim, quality) {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale), h = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  canvas.getContext('2d').drawImage(img, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', quality).split(',')[1] // strip data-URL prefix
}

export function prepareImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const image_b64 = drawScaled(img, 1600, 0.8)
        const thumb_b64 = drawScaled(img, 320, 0.7)
        URL.revokeObjectURL(url)
        if (image_b64.length > 880_000) reject(new Error('Image too large — try a smaller photo'))
        else resolve({ image_b64, thumb_b64 })
      } catch (e) { URL.revokeObjectURL(url); reject(e) }
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')) }
    img.src = url
  })
}

// ── EXIF GPS (read BEFORE the strip) ───────────────────────────────────────
// The canvas re-encode above deliberately strips ALL EXIF from the uploaded
// image (privacy). Location-as-a-feature works differently: we read the GPS
// here, show it to the user, and store it as explicit photo lat/lng they can
// remove. Minimal JPEG/TIFF parser — no dependency.
export async function readGps(file) {
  try {
    const v = new DataView(await file.slice(0, 262144).arrayBuffer())
    if (v.getUint16(0) !== 0xFFD8) return null // not a JPEG (HEIC arrives converted on web)
    let o = 2
    while (o + 4 < v.byteLength) {
      const marker = v.getUint16(o), size = v.getUint16(o + 2)
      if (marker === 0xFFE1 && v.getUint32(o + 4) === 0x45786966 && v.getUint16(o + 8) === 0) {
        return parseTiffGps(v, o + 10)
      }
      if ((marker & 0xFF00) !== 0xFF00 || size < 2) break
      o += 2 + size
    }
  } catch {}
  return null
}

function parseTiffGps(v, base) {
  try {
    const little = v.getUint16(base) === 0x4949
    const g16 = (off) => v.getUint16(base + off, little)
    const g32 = (off) => v.getUint32(base + off, little)
    if (g16(2) !== 42) return null
    const ifd = g32(4)
    let gpsOff = null
    const n = g16(ifd)
    for (let i = 0; i < n; i++) {
      const e = ifd + 2 + i * 12
      if (g16(e) === 0x8825) { gpsOff = g32(e + 8); break }
    }
    if (!gpsOff) return null
    const dms = (valOff) => {
      let d = 0, scale = 1
      for (let k = 0; k < 3; k++) {
        const num = g32(valOff + k * 8), den = g32(valOff + k * 8 + 4) || 1
        d += (num / den) / scale; scale *= 60
      }
      return d
    }
    let latRef, lngRef, lat = null, lng = null
    const gn = g16(gpsOff)
    for (let i = 0; i < gn; i++) {
      const e = gpsOff + 2 + i * 12
      const tag = g16(e)
      if (tag === 1) latRef = String.fromCharCode(v.getUint8(base + e + 8))
      if (tag === 2) lat = dms(g32(e + 8))
      if (tag === 3) lngRef = String.fromCharCode(v.getUint8(base + e + 8))
      if (tag === 4) lng = dms(g32(e + 8))
    }
    if (lat == null || lng == null || (lat === 0 && lng === 0)) return null
    if (latRef === 'S') lat = -lat
    if (lngRef === 'W') lng = -lng
    return { lat: +lat.toFixed(6), lng: +lng.toFixed(6) }
  } catch { return null }
}

/** Device location fallback. Native uses the Capacitor plugin (proper
 *  "NYC Stoop would like…" prompt — ship-gate 4, in-app camera shots carry
 *  no EXIF); web uses navigator.geolocation. */
export function deviceLocation() {
  if (window.Capacitor?.isNativePlatform?.()) {
    return import('@capacitor/geolocation')
      .then(({ Geolocation }) => Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 }))
      .then(pos => ({ lat: +pos.coords.latitude.toFixed(6), lng: +pos.coords.longitude.toFixed(6) }))
      .catch(() => null)
  }
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: +pos.coords.latitude.toFixed(6), lng: +pos.coords.longitude.toFixed(6) }),
      () => resolve(null),
      { timeout: 5000, maximumAge: 120000 }
    )
  })
}

// ── Place search (any place, not just the curated 868) ─────────────────────
// Dev + v2.0: OSM Nominatim — keyless, free, CORS-open, same data family as
// our Leaflet/OSM maps (no cross-provider display-terms issue). Usage policy:
// user-initiated searches only (button tap, never per-keystroke). 2.1 plan:
// swap the URL for our backend proxy to Apple Maps Server API (25k/day free
// with the developer membership) — same return shape, richer POI coverage.
const NYC_VIEWBOX = '-74.30,40.95,-73.65,40.45' // lon1,lat1,lon2,lat2
async function nominatim(params) {
  const res = await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&' + params,
    { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('search failed')
  return res.json()
}
export async function searchPlaces(q) {
  // Apple Maps Server API first (via our backend proxy — real POI coverage,
  // 2026-08-28). Any failure (unconfigured 503, network, upstream) falls
  // through to the keyless Nominatim path below.
  try {
    const r = await call('/share/place-search?q=' + encodeURIComponent(q.trim()))
    if (Array.isArray(r.results) && r.results.length) return r.results
    if (Array.isArray(r.results)) return [] // Apple answered: genuinely nothing
  } catch {}
  // Pass 1: strict NYC box. Pass 2 (device report 2026-08-28, "Dudleys"):
  // small POIs often miss the bounded query — retry unbounded with ", New
  // York" appended, then keep only results inside the metro area. Nominatim
  // is address-first; proper POI search is the 2.1 Apple Maps proxy.
  let rows = await nominatim('bounded=1&viewbox=' + NYC_VIEWBOX + '&q=' + encodeURIComponent(q))
  if (!rows.length) {
    const loose = await nominatim('q=' + encodeURIComponent(q + ', New York'))
    rows = loose.filter(r => {
      const lat = parseFloat(r.lat), lon = parseFloat(r.lon)
      return lat > 40.45 && lat < 40.95 && lon > -74.30 && lon < -73.65
    })
  }
  // Gate 6 (REVIEW_SHARE v2): rank real POIs above admin areas. The observed
  // trap: searching "Lincoln Square 13" surfaced the NEIGHBORHOOD "Lincoln
  // Square" above the cinema, and the wrong pick looks identical. Boundaries
  // and place-names sink; every row gets a type word so the difference reads.
  const isArea = (r) => r.class === 'boundary' || r.class === 'place'
  const typeLabel = (r) => {
    if (isArea(r)) return 'Neighborhood'
    const t = String(r.type || r.class || '').replace(/_/g, ' ')
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : ''
  }
  return rows
    .sort((a, b) => (isArea(a) ? 1 : 0) - (isArea(b) ? 1 : 0))
    .map(r => ({
      name: r.name || String(r.display_name || '').split(',')[0],
      detail: [typeLabel(r), String(r.display_name || '').split(',').slice(1, 3).join(',').trim()].filter(Boolean).join(' · '),
      lat: parseFloat(r.lat), lng: parseFloat(r.lon),
    })).filter(r => r.name && isFinite(r.lat) && isFinite(r.lng))
}

// ── Comments ───────────────────────────────────────────────────────────────
export const listComments = (photoId) => call(`/share/photos/${photoId}/comments`)
export const addComment = (photoId, text) => call(`/share/photos/${photoId}/comments`, { method: 'POST', body: { text } })
export const deleteComment = (id) => call(`/share/comments/${id}`, { method: 'DELETE' })

export const getNotifications = () => call('/share/notifications')

export const setMyAvatar = (avatar_b64) => call('/share/me/avatar', { method: 'POST', body: { avatar_b64 } })

export const setMyName = (display_name) => call('/share/me/name', { method: 'POST', body: { display_name } })
export const reportComment = (id) => call(`/share/comments/${id}/report`, { method: 'POST' })
