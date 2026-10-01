// ── App-state backup sync (2026-10-01, v2.2.2) ─────────────────────────────
// Plans, trips, saved events and every other per-account localStorage key
// were device-only — an app reinstall wiped them (field report 2026-10-01:
// two saved plans lost). This module mirrors the per-profile bundle to the
// backend (user_state row in Neon): restore on boot when the server is newer,
// debounced push on every lsSet. Last write wins via a server revision.
import { getToken } from '../auth/api.js'

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const REV_KEY = 'nyc_state_rev'

// Device/session keys that must never travel between installs. Mirrors
// PROFILE_GLOBAL_KEYS in App.jsx plus sync bookkeeping.
const EXCLUDE = new Set([
  'nyc_token', 'nyc_user', 'nyc_active_profile', REV_KEY,
  'nyc_onboarded_v2', 'nyc_map_tut_v1', 'nyc_temp_unit', 'nyc_lang',
  'nyc_tut_explore_v1', 'nyc_tut_tonight_v1', 'nyc_tut_trip_v1', 'nyc_tut_plans_v1',
  'nyc_lifetime_unlocked', 'nyc_founding_user',
])
const syncable = (k) => k && k.startsWith('nyc_') && !k.startsWith('nyc_profile_') && !EXCLUDE.has(k)

function collect() {
  const bundle = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (syncable(k)) bundle[k] = localStorage.getItem(k)
    }
    // nyc_user_venues is ~700 KB of which almost all is the SEED dataset the
    // app re-merges from its own bundle on every boot (idempotent by seed_*
    // ids). Sync only what's truly the user's: custom places, and seed rows
    // the user modified (added an image). Restore + boot merge rebuilds the
    // rest on any device.
    if (bundle.nyc_user_venues) {
      const uv = JSON.parse(bundle.nyc_user_venues)
      const own = {}
      Object.entries(uv).forEach(([id, v]) => {
        if (!String(id).startsWith('seed_') || (v && v.image)) own[id] = v
      })
      bundle.nyc_user_venues = JSON.stringify(own)
    }
  } catch {}
  return bundle
}

async function api(method, body) {
  const tok = getToken()
  if (!tok) return null
  const r = await fetch(API_URL + '/share/state', {
    method,
    headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!r.ok) throw new Error('state ' + r.status)
  return r.json()
}

/** Boot-time restore. Returns 'applied' (caller should reload), 'current'
 *  (server consulted, nothing newer), or 'skip' (no token / request failed —
 *  worth retrying later). */
export async function restoreStateIfNewer() {
  try {
    const r = await api('GET')
    if (!r) return 'skip'
    _ready = true
    const localRev = parseInt(localStorage.getItem(REV_KEY) || '0', 10) || 0
    if (r.rev > localRev && r.data) {
      const data = JSON.parse(r.data)
      // wipe current syncable keys, then apply the server bundle
      Object.keys(collect()).forEach(k => { try { localStorage.removeItem(k) } catch {} })
      Object.entries(data).forEach(([k, v]) => { if (syncable(k)) try { localStorage.setItem(k, v) } catch {} })
      try { localStorage.setItem(REV_KEY, String(r.rev)) } catch {}
      return 'applied'
    }
    if (r.rev === 0 && Object.keys(collect()).length) schedulePushState() // first device: seed the server
    if (r.rev > 0 && localRev === 0) try { localStorage.setItem(REV_KEY, String(r.rev)) } catch {}
    return 'current'
  } catch { return 'skip' }
}

// Fresh-install safety: no push may leave this device until the restore
// handshake has run — otherwise boot-time default writes race the restore
// and overwrite the account's backup with an empty bundle.
let _ready = (() => { try { return !!localStorage.getItem(REV_KEY) } catch { return false } })()

let _t = null
let _lastSent = ''
/** Debounced full-bundle push — call whenever account state changes. */
export function schedulePushState() {
  if (!getToken() || !_ready) return
  clearTimeout(_t)
  _t = setTimeout(async () => {
    try {
      const data = JSON.stringify(collect())
      if (data === _lastSent || data.length > 400_000) return
      const r = await api('PUT', { data })
      if (r?.rev) { _lastSent = data; try { localStorage.setItem(REV_KEY, String(r.rev)) } catch {} }
    } catch {}
  }, 4000)
}

/** Flush immediately (pagehide/backgrounding) via sendBeacon-style fetch. */
export function flushState() {
  const tok = getToken()
  if (!tok || !_ready) return
  clearTimeout(_t)
  try {
    const data = JSON.stringify(collect())
    if (data === _lastSent || data.length > 400_000) return
    fetch(API_URL + '/share/state', {
      method: 'PUT', keepalive: true,
      headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    }).then(r => r.ok ? r.json() : null).then(r => {
      if (r?.rev) { _lastSent = data; try { localStorage.setItem(REV_KEY, String(r.rev)) } catch {} }
    }).catch(() => {})
  } catch {}
}
