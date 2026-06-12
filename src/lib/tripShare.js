// ── Trip share encoding ─────────────────────────────────────────────────────
//
// Encode a saved-trip payload into a URL-safe base64 string so we can share
// a built itinerary as a link:
//   https://nyc-stoop.vercel.app/#/t/<encoded>
//
// The hash-route form keeps the encoding entirely client-side — no backend
// store, no auth, no expiry tracking. The recipient opens the link, the app
// detects the hash on load, and renders a read-only view of the same trip.
//
// Payload shape kept intentionally small so the URL stays under ~1.5 KB:
//   {
//     v: 1,                          // schema version for future migrations
//     ids: ['venue:moma', 'work:hamilton_2015', ...],  // savedItems keys
//     start: '2026-04-04' | null,    // tripStartDate
//     days: 3 | null,                // tripDays
//   }
//
// Note: only the IDs travel; the recipient's app rehydrates editorial detail
// from its own data files. If they're on an older version with stale data,
// some IDs may not resolve — we render those as "no longer available."

const SCHEMA_VERSION = 1

/** Build a base64url string from a payload object. URL-safe variants of
 *  base64 swap `+/=` for `-_·`. */
export function encodeTrip(payload) {
  const json = JSON.stringify({
    v: SCHEMA_VERSION,
    ids: payload.ids || [],
    start: payload.start || null,
    days: payload.days || null,
  })
  // btoa handles ASCII; encodeURIComponent → unescape is the classic trick
  // to handle any unicode (cuisine emojis, etc.) — though our payload is
  // currently ASCII-only.
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Decode a base64url string back into a payload. Returns null on any
 *  failure so the caller can render a "couldn't load this trip" state. */
export function decodeTrip(encoded) {
  if (!encoded) return null
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    // Re-pad to a multiple of 4 (btoa strips trailing `=`).
    const padded = b64 + '='.repeat((4 - b64.length % 4) % 4)
    const json = decodeURIComponent(escape(atob(padded)))
    const obj = JSON.parse(json)
    if (!obj || typeof obj !== 'object') return null
    if (obj.v !== SCHEMA_VERSION) return null
    if (!Array.isArray(obj.ids)) return null
    return { ids: obj.ids, start: obj.start || null, days: obj.days || null }
  } catch { return null }
}

/** Parse a `#/t/<encoded>` hash. Returns the encoded chunk, or null. */
export function extractShareHash(hash) {
  if (!hash) return null
  const m = /^#\/t\/([\w_-]+)$/.exec(hash)
  return m ? m[1] : null
}

/** Build the full shareable URL for the current trip. */
export function buildShareUrl({ ids, start, days }) {
  const encoded = encodeTrip({ ids, start, days })
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nyc-stoop.vercel.app'
  return `${origin}/#/t/${encoded}`
}
