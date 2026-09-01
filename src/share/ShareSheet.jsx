// Share v2.0 — profile-first ("My Stoop") redesign, 2026-08-23.
// Two tabs only: My Stoop (profile: avatar, stats, grid, add) and Friends
// (code exchange + list → tap a friend → THEIR Stoop). The consolidation
// call: a profile is one mental model replacing four scattered fragments —
// no follower counts, no bio, no stories. Deliberately less than Instagram.
// Opened via: window.dispatchEvent(new CustomEvent('openShareSheet'))
import React from 'react'
import { t, t2 } from '../lib/i18n.js'
import { getUser } from '../auth/api.js'
import {
  getMyCode, regenerateCode, redeemCode, listFriends, unfriend, blockUser,
  createPhoto, updatePhoto, myPhotos, friendsFeed, deletePhoto, reportPhoto,
  fetchPhotoImage, prepareImage, readGps, deviceLocation, searchPlaces,
  listComments, addComment, deleteComment, setMyAvatar, setMyName, reportComment,
} from './shareApi.js'
import { seedUserPlaces } from '../data/places.js'

const AREAS = ['Midtown', 'Upper East Side', 'Upper West Side', 'Chelsea', 'Gramercy & Flatiron',
  'West Village', 'East Village', 'SoHo', 'Lower East Side', 'Chinatown', 'Financial District', 'Harlem',
  'Williamsburg', 'Greenpoint', 'DUMBO', 'Park Slope', 'Prospect Heights', 'Crown Heights', 'Bushwick', 'Red Hook']

const KINDS = [['food', '🍴'], ['view', '🏞'], ['vibe', '✨']]

// Discover chips: where friends went, by WHAT THE PLACE IS. A photo anchored
// to a dataset place inherits the place's category (café shot → Cafe even if
// the poster tagged ✨vibe); moment photos fall back to their kind chip.
const DISCOVER_CATS = [
  ['all', '', 'All'],
  ['food', '🍴', 'Food'],
  ['cafe', '☕', 'Cafe'],
  ['drinks', '🍸', 'Drinks'],
  ['view', '🏞', 'view'],
  ['vibe', '✨', 'vibe'],
]
const _seedById = Object.fromEntries(seedUserPlaces.map(pl => [pl.id, pl]))

// ── Interest-led official feed (Steven's call, 2026-08-27) ─────────────────
// The official NYC Stoop account posts ~20–30 photos covering every category;
// each user's onboarding picks decide which of those photos LEAD when they
// view the official Stoop (and its photos in From friends). Reorder, never
// hide — the full set stays visible below the matches.
// Interest domains → seed place categories (coarse but honest):
const INTEREST_TO_PLACE_CATS = {
  food:            ['food', 'coffee', 'drinks'],
  visual_art:      ['art', 'culture'],
  architecture:    ['culture', 'outdoors'],
  history:         ['culture'],
  jazz:            ['music', 'live', 'drinks'],
  classical_music: ['music', 'live'],
  hip_hop:         ['music', 'live'],
  theater:         ['live', 'culture'],
  sports:          ['outdoors'],
}
function interestRank(p) {
  let ints = []
  try { ints = JSON.parse(localStorage.getItem('nyc_interests') || '[]') } catch {}
  if (!ints.length) return 0 // no picks → natural order for everyone
  const pl = p.place_id ? _seedById[p.place_id] : null
  if (!pl) return 50
  for (let i = 0; i < ints.length; i++) {
    if ((INTEREST_TO_PLACE_CATS[ints[i]] || []).includes(pl.category)) return i
  }
  return 50
}
const sortByInterests = (photos) => photos.slice().sort((a, b) => interestRank(a) - interestRank(b))
function photoCategory(p) {
  const pl = p.place_id ? _seedById[p.place_id] : null
  if (pl) {
    if (pl.category === 'coffee') return 'cafe'
    if (pl.category === 'drinks') return 'drinks'
    if (pl.category === 'food') {
      const cs = (pl.cuisine || []).map(String)
      return (cs.includes('cafe') || cs.includes('bakery') || cs.includes('dessert') || cs.includes('bagel')) ? 'cafe' : 'food'
    }
    if (pl.category === 'outdoors') return 'view'
  }
  return p.kind === 'food' ? 'food' : p.kind === 'view' ? 'view' : 'vibe'
}

// ── Multi-image posts (2026-08-28): photos posted together share a group_id.
// The grid shows ONE tile per post (lead image + count badge); the viewer
// swipes through the set; comments/labels anchor to the lead photo.
const randGroup = () => 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
function collapseGroups(photos) {
  const out = [], byG = {}
  for (const p of photos) {
    const k = p.group_id || ('solo:' + p.id)
    if (byG[k]) { byG[k].all.push(p); continue }
    const g = { lead: p, all: [p] }
    byG[k] = g; out.push(g)
  }
  return out
}

const S = {
  overlay: { position: 'fixed', inset: 0, zIndex: 4000, background: 'var(--bg, #FBF8F3)', display: 'flex', flexDirection: 'column',
    // iPhone safe areas: without this the header slides under the status bar
    // and the ✕ becomes untappable (device report 2026-08-23).
    paddingTop: 'env(safe-area-inset-top, 0px)' },
  header: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 8px' },
  h1: { fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink)', flex: 1, margin: 0 },
  iconBtn: { background: 'var(--gray-100)', border: 'none', borderRadius: 999, width: 32, height: 32, cursor: 'pointer', fontSize: 15, color: 'var(--gray-500)' },
  tabs: { display: 'flex', gap: 6, padding: '4px 16px 10px' },
  tab: (on) => ({ border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 999, fontSize: 13, fontWeight: on ? 700 : 500, fontFamily: 'inherit', background: on ? '#17130F' : 'var(--gray-100)', color: on ? '#F2EDE4' : 'var(--gray-600)' }),
  body: { flex: 1, overflowY: 'auto', padding: '4px 16px calc(40px + env(safe-area-inset-bottom, 0px))' },
  card: { background: 'var(--card, #FFFFFF)', border: '1px solid rgba(23,19,15,0.10)', borderRadius: 14, padding: 14, marginBottom: 12 },
  label: { fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 6 },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--gray-200)', fontSize: 14, fontFamily: 'inherit', background: '#fff' },
  cta: { border: 'none', cursor: 'pointer', borderRadius: 999, padding: '11px 18px', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', background: 'var(--accent, #C8321A)', color: '#fff' },
  quiet: { border: '1.5px solid var(--gray-200)', cursor: 'pointer', borderRadius: 999, padding: '9px 14px', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', background: '#fff', color: 'var(--ink)' },
  meta: { fontSize: 12, color: 'var(--gray-500)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, borderRadius: '0 14px 14px 14px', overflow: 'hidden' },
  gridImg: { width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', cursor: 'pointer', background: 'var(--gray-100)' },
}

// Copy that works on EVERY origin (device report 2026-08-28): the clipboard
// API exists only on secure contexts, so on http://192.168.x.x (LAN testing)
// the button silently no-oped. Falls back to the textarea/execCommand trick.
function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus(); ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      ok ? resolve() : reject(new Error('copy failed'))
    } catch (e) { reject(e) }
  })
}

// Avatar: backend picture_url first, then the local per-email avatar store
// (same source Settings uses), else an initial in a warm circle.
function avatarSrcFor(user) {
  if (user?.picture_url) return user.picture_url
  try {
    const store = JSON.parse(localStorage.getItem('nyc_avatar_by_email') || '{}')
    return store[user?.email]?.avatar || null
  } catch { return null }
}

function Avatar({ user, name, size = 64, avatar = null }) {
  // `avatar` = server-carried friend avatar (picture_url or data-URI b64).
  const src = avatar || (user ? avatarSrcFor(user) : null)
  const initial = (name || user?.display_name || user?.email || '?').slice(0, 1).toUpperCase()
  return src
    ? <img src={src} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    : <div style={{ width: size, height: size, borderRadius: '50%', background: '#F2EDE4', color: '#736658', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, fontWeight: 700, flexShrink: 0 }}>{initial}</div>
}

// Profile header — shared by My Stoop and a friend's Stoop.
// Stats teach what the app values: photos + places, never followers.
function ProfileHeader({ user, name, photos, right, avatar = null, onSaveName = null }) {
  const placeCount = new Set(photos.map(p => p.place_id || p.place_name || ('a:' + p.area_label)).filter(Boolean)).size
  // Ship-gate 2: users choose how friends see them (pen next to the name).
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(name)
  const commit = () => {
    const v = draft.trim()
    setEditing(false)
    if (v && v !== name && onSaveName) onSaveName(v)
  }
  return (
    <div style={{ padding: '10px 4px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar user={user} name={name} avatar={avatar} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input autoFocus value={draft} maxLength={40} onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
                style={{ ...S.input, fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, padding: '7px 10px' }} />
              <button onClick={commit} style={{ ...S.cta, padding: '8px 14px', flexShrink: 0 }}>{t('Save')}</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, color: 'var(--ink)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
              {onSaveName && (
                <button onClick={() => { setDraft(name); setEditing(true) }} aria-label={t('Edit')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--gray-400)', flexShrink: 0, display: 'inline-flex' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  </svg>
                </button>
              )}
            </div>
          )}
          <div style={{ ...S.meta, marginTop: 4 }}>
            {t2('{N} photos', { N: photos.length })} · {t2('{N} places', { N: placeCount })}
          </div>
        </div>
      </div>
      {right && <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>{right}</div>}
    </div>
  )
}

function PhotoGrid({ photos, onOpen, emptyText }) {
  const groups = collapseGroups(photos)
  if (!groups.length) {
    return <div style={{ padding: '36px 10px', textAlign: 'center', color: 'var(--gray-500)', fontSize: 13.5, lineHeight: 1.6 }}>{emptyText}</div>
  }
  return (
    <div style={S.grid}>
      {groups.map(g => (
        <div key={g.lead.id} style={{ position: 'relative' }}>
          <img src={'data:image/jpeg;base64,' + g.lead.thumb_b64} alt={g.lead.place_name || g.lead.area_label || ''}
            onClick={() => onOpen(g)} style={S.gridImg} />
          {g.all.length > 1 && (
            <span style={{ position: 'absolute', top: 5, right: 6, background: 'rgba(23,19,15,0.62)', color: '#F7F2EA',
              fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, pointerEvents: 'none' }}>⧉ {g.all.length}</span>
          )}
        </div>
      ))}
    </div>
  )
}

// embedded=true renders the same UI as a nav-tab screen (no fixed overlay,
// no ✕, always open) — the Settings BETA overlay instance keeps embedded=false.
// ── Personal map: the Stoop's second view (spec 08-25) ─────────────────────
// Same photos as the grid, plotted. Only place-anchored photos appear (they
// have dataset coords); moment photos are grid-only. Tap a pin → dark pill
// "Name · N photos" → tap the pill → open that place's photos.
function ensureLeaflet(cb) {
  if (window.L) { cb(window.L); return }
  if (!document.querySelector('link[data-leaflet-css]')) {
    const l = document.createElement('link')
    l.rel = 'stylesheet'; l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; l.dataset.leafletCss = '1'
    document.head.appendChild(l)
  }
  const existing = document.querySelector('script[data-leaflet], script[data-leaflet-share]')
  if (existing) { existing.addEventListener('load', () => window.L && cb(window.L)); return }
  const s = document.createElement('script')
  s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.dataset.leafletShare = '1'
  s.onload = () => cb(window.L)
  document.body.appendChild(s)
}

const _placeById = Object.fromEntries(seedUserPlaces.map(p => [p.id, p]))

// Stroked toggle icons (match the app's Lucide-style nav icons — no emoji).
const ToggleIcon = ({ kind }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: 5 }} aria-hidden="true">
    {kind === 'grid'
      ? <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>
      : <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>}
  </svg>
)

function StoopMap({ photos, onOpenPhoto }) {
  const boxRef = React.useRef(null)
  const mapRef = React.useRef(null)
  const [sel, setSel] = React.useState(null) // { name, photos }

  const groups = React.useMemo(() => {
    const g = {}
    for (const p of photos) {
      const pl = p.place_id ? _placeById[p.place_id] : null
      if (pl && pl.lat && pl.lng) {
        // Dataset place: exact venue point + address for directions.
        const k = pl.id
        if (!g[k]) g[k] = { name: p.place_name || pl.name, lat: pl.lat, lng: pl.lng, address: pl.address || null, photos: [] }
        g[k].photos.push(p)
      } else if (typeof p.lat === 'number' && typeof p.lng === 'number') {
        // Photo-level pin (EXIF/device): any place on earth. Group nearby
        // same-named shots (~11m rounding) so a dinner's photos share a pin.
        const k = 'geo:' + (p.place_name || '') + ':' + p.lat.toFixed(4) + ',' + p.lng.toFixed(4)
        if (!g[k]) g[k] = { name: p.place_name || p.area_label || t('Photo'), lat: p.lat, lng: p.lng, address: null, photos: [] }
        g[k].photos.push(p)
      }
    }
    return Object.values(g)
  }, [photos])

  React.useEffect(() => {
    let dead = false
    ensureLeaflet((L) => {
      if (dead || !boxRef.current) return
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
      const map = L.map(boxRef.current, { zoomControl: false, attributionControl: true, scrollWheelZoom: false, tap: true })
      // Carto light basemap (same as the app's live map) — muted and label-light,
      // so the photo pins carry the view (Corner-style, 2026-08-25).
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19 }).addTo(map)
      if (groups.length) {
        const bounds = L.latLngBounds(groups.map(g => [g.lat, g.lng]))
        map.fitBounds(bounds.pad(0.25), { maxZoom: 15 })
      } else {
        map.setView([40.7359, -73.9911], 12)
      }
      for (const g of groups) {
        // Photo-thumbnail pins (Corner-style): the photo IS the marker.
        // divIcon (not circleMarker) so pins ride zoom animations — same fix
        // as the main map (2026-08-22).
        const badge = g.photos.length > 1
          ? `<span style="position:absolute;top:-5px;right:-5px;background:#C8321A;color:#fff;font:700 10px/1 -apple-system,sans-serif;padding:3px 6px;border-radius:999px;border:1.5px solid #fff">${g.photos.length}</span>`
          : ''
        const icon = L.divIcon({ className: '', iconSize: [46, 46], iconAnchor: [23, 23],
          html: `<div style="position:relative;width:46px;height:46px">
            <img src="data:image/jpeg;base64,${g.photos[0].thumb_b64}" style="width:46px;height:46px;object-fit:cover;border-radius:13px;border:2px solid #fff;box-shadow:0 2px 8px rgba(23,19,15,0.35);display:block"/>${badge}</div>` })
        L.marker([g.lat, g.lng], { icon }).addTo(map).on('click', () => setSel(g))
      }
      mapRef.current = map
      setTimeout(() => { try { map.invalidateSize() } catch {} }, 60)
    })
    return () => { dead = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
  }, [groups])

  return (
    <div style={{ position: 'relative' }}>
      <div ref={boxRef} style={{ height: 380, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(23,19,15,0.12)', background: '#F2EDE4' }} />
      {sel && (
        <div style={{ position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', zIndex: 800,
          display: 'flex', alignItems: 'center', background: '#17130F', borderRadius: 999, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <button onClick={() => { const p = sel.photos[0]; setSel(null); onOpenPhoto(p) }}
            style={{ background: 'none', color: '#F2EDE4', border: 'none', padding: '9px 12px 9px 14px',
              fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
            {sel.name} · {t2('{N} photos', { N: sel.photos.length })}
          </button>
          <button aria-label={t('Directions')}
            onClick={() => { try { window.dispatchEvent(new CustomEvent('nyc-open-maps', { detail: { name: sel.name, address: sel.address, area: 'New York' } })) } catch {} }}
            style={{ background: '#C8321A', color: '#fff', border: 'none', padding: '9px 13px',
              fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>📍</button>
        </div>
      )}
      {groups.length === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ background: 'rgba(253,249,240,0.92)', borderRadius: 10, padding: '10px 14px', fontSize: 12.5, color: 'var(--gray-500)' }}>{t('Photos tagged to a place will appear here.')}</span>
        </div>
      )}
    </div>
  )
}

export default function ShareSheetHost({ embedded = false }) {
  const [open, setOpen] = React.useState(false)
  const isOpen = embedded || open
  // view: 'me' | 'friends' | 'friend:<id>' | 'compose'
  const [view, setView] = React.useState('me')
  const user = getUser()

  const [code, setCode] = React.useState('')
  const [friends, setFriends] = React.useState([])
  const [redeemInput, setRedeemInput] = React.useState('')
  const [friendMsg, setFriendMsg] = React.useState('')
  const [loadErr, setLoadErr] = React.useState('')

  const [mine, setMine] = React.useState([])
  const [feed, setFeed] = React.useState([])
  const [viewer, setViewer] = React.useState(null) // { p, url, mine }
  const [discoverCat, setDiscoverCat] = React.useState('all')
  const [stoopView, setStoopView] = React.useState('grid') // grid | map (my + friend Stoops)
  // "My code" profile button removed by design call (2026-08-25) — the code
  // lives only in the Friends tab card. QR/invite links come with 2.1.

  // Compose state — up to 5 images per post (device request 2026-08-28:
  // "three dishes, all scrumptious"). One shared place/kind/caption; each
  // image becomes its own photo record, and the map pin groups them.
  const [files, setFiles] = React.useState([])   // [{ f, url }]
  const [anchorPlace, setAnchorPlace] = React.useState('')
  const [anchorArea, setAnchorArea] = React.useState('')
  const [kind, setKind] = React.useState('vibe')
  const [caption, setCaption] = React.useState('')
  const [posting, setPosting] = React.useState(false)
  const [postMsg, setPostMsg] = React.useState('')
  const [editId, setEditId] = React.useState(null) // compose reused as label editor
  const [geo, setGeo] = React.useState(null) // { lat, lng, src: 'photo'|'device'|'search' }
  const [placeResults, setPlaceResults] = React.useState(null) // null | [] | [{name,detail,lat,lng}]
  const [placeSearching, setPlaceSearching] = React.useState(false)

  React.useEffect(() => {
    const fn = () => { setOpen(true); setView('me') }
    window.addEventListener('openShareSheet', fn)
    // Notification rows deep-link into a Share view ('me' | 'discover').
    const goto = (e) => { if (embedded && e.detail?.view) setView(e.detail.view) }
    window.addEventListener('shareGoto', goto)
    return () => { window.removeEventListener('openShareSheet', fn); window.removeEventListener('shareGoto', goto) }
  }, [embedded])

  const explainErr = (e) => e?.status === 404
    ? t('The server does not have the Share update yet — deploy the backend (git push), then reload.')
    : (e?.status === 401 || e?.status === 403)
    ? t('Your session expired — sign out and back in (Settings).')
    : (e?.message === 'signed-out' ? t('Sign in first') : t('Could not reach the server. Check your connection and reload.'))

  // One-shot avatar sync (08-25): the profile photo lives in a device-local
  // store, invisible to friends — push a 128px copy to the server whenever it
  // changes (fingerprint in nyc_avatar_synced) so friends' apps can show it.
  React.useEffect(() => {
    if (!isOpen || !user) return
    try {
      const local = avatarSrcFor(user)
      if (!local || !local.startsWith('data:')) return
      const fp = user.email + ':' + local.length
      if (localStorage.getItem('nyc_avatar_synced') === fp) return
      const img = new Image()
      img.onload = () => {
        const c = document.createElement('canvas')
        const s = Math.min(1, 128 / Math.max(img.width, img.height))
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s)
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        setMyAvatar(c.toDataURL('image/jpeg', 0.8))
          .then(() => { try { localStorage.setItem('nyc_avatar_synced', fp) } catch {} })
          .catch(() => {})
      }
      img.src = local
    } catch {}
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen || !user) return
    setLoadErr('')
    myPhotos().then(r => setMine(r.photos)).catch(e => setLoadErr(explainErr(e)))
    // ORDER MATTERS (2026-08-25): getMyCode runs FIRST because a first visit
    // creates the official-seed friendship server-side — friends + feed must
    // query AFTER it, or the brand-new user's first open shows an empty tab
    // (the exact moment the seed friend exists to prevent).
    getMyCode().catch(() => null).then(r => {
      if (r?.code) setCode(r.code)
      listFriends().then(x => setFriends(x.friends)).catch(() => {})
      friendsFeed().then(x => setFeed(x.photos)).catch(() => {})
    })
  }, [isOpen])

  if (!isOpen) return null
  const close = () => { setOpen(false); setViewer(null); setView('me'); setPostMsg(''); setFriendMsg('') }
  // Embedded: normal in-flow screen; page scroll instead of inner scroll;
  // bottom padding clears the nav bar.
  const wrapStyle = embedded
    // Tab roots have no TopNav bar, so the screen must clear the status bar
    // itself (same env() padding the overlay uses — device report 2026-08-25).
    ? { display: 'flex', flexDirection: 'column', minHeight: '70vh', paddingTop: 'env(safe-area-inset-top, 0px)' }
    : S.overlay
  const bodyStyle = embedded
    ? { ...S.body, overflowY: 'visible', paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }
    : S.body

  if (!user) {
    return (
      <div style={wrapStyle}>
        <div style={S.header}><h1 style={S.h1}>{t('Your Stoop')}</h1>{!embedded && <button onClick={close} style={S.iconBtn}>✕</button>}</div>
        <div style={{ padding: '30px 24px', textAlign: 'center', color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.6 }}>
          {t('Sign in to add friends and share photos of your trip.')}<br />
          <span style={S.meta}>{t('Settings → Sign in')}</span>
        </div>
      </div>
    )
  }

  const [nameBump, setNameBump] = React.useState(0) // re-render after rename
  const myName = user.display_name || user.email.split('@')[0].split('+')[0]

  const saveMyName = async (v) => {
    try {
      await setMyName(v)
      // Update the cached profile so the whole app (Settings, fallbacks) agrees.
      try {
        const raw = localStorage.getItem('nyc_user')
        if (raw) { const u = JSON.parse(raw); u.display_name = v; localStorage.setItem('nyc_user', JSON.stringify(u)) }
        if (user) user.display_name = v
      } catch {}
      setNameBump(b => b + 1)
    } catch (e) { setLoadErr(explainErr(e)) }
  }

  const [comments, setComments] = React.useState([])
  const [commentText, setCommentText] = React.useState('')
  const [commentBusy, setCommentBusy] = React.useState(false)
  const [planMsg, setPlanMsg] = React.useState('')

  // Ship-gate 3: a friend's photo should feed the itinerary, not just Maps.
  // Dataset-anchored → full seed record; search/EXIF-pinned → name + coords.
  const plannerData = (p) => {
    const pl = p.place_id ? _placeById[p.place_id] : null
    if (pl) return { name: pl.name, neighborhood: pl.neighborhood || p.area_label || '', lat: pl.lat, lng: pl.lng, category: pl.category, cuisine: pl.cuisine, price: pl.price, description: pl.description || '', address: pl.address }
    if (p.place_name && typeof p.lat === 'number' && typeof p.lng === 'number')
      return { name: p.place_name, neighborhood: p.area_label || '', lat: p.lat, lng: p.lng }
    return null
  }

  // Viewer now holds a GROUP (multi-image post): { g, idx, mine, urls: {id→objectURL} }.
  // Accepts a group or a bare photo (map pins pass photos) — bare wraps solo.
  const openViewer = (gOrP, isMine) => {
    const g = gOrP?.all ? gOrP : { lead: gOrP, all: [gOrP] }
    setViewer({ g, idx: 0, mine: isMine, urls: {} })
    setComments([]); setCommentText(''); setPlanMsg('')
    listComments(g.lead.id).then(r => setComments(r.comments)).catch(() => {})
  }
  // Lazy-load the full image for whichever photo the viewer shows.
  React.useEffect(() => {
    if (!viewer) return
    const cur = viewer.g.all[viewer.idx]
    if (!cur || viewer.urls[cur.id]) return
    fetchPhotoImage(cur.id)
      .then(url => setViewer(v => (v && v.g.lead.id === viewer.g.lead.id) ? { ...v, urls: { ...v.urls, [cur.id]: url } } : v))
      .catch(() => {})
  }, [viewer?.g?.lead?.id, viewer?.idx])
  const closeViewer = () => {
    if (viewer) Object.values(viewer.urls).forEach(u => { try { URL.revokeObjectURL(u) } catch {} })
    setViewer(null)
  }
  // Swipe between images
  const vSwipe = React.useRef(null)
  const vTouchStart = (e) => { vSwipe.current = e.touches[0].clientX }
  const vTouchEnd = (e) => {
    if (vSwipe.current == null || !viewer) return
    const dx = e.changedTouches[0].clientX - vSwipe.current
    vSwipe.current = null
    if (Math.abs(dx) < 40) return
    setViewer(v => v ? { ...v, idx: Math.max(0, Math.min(v.g.all.length - 1, v.idx + (dx < 0 ? 1 : -1))) } : v)
  }

  const submitComment = async () => {
    const text = commentText.trim()
    if (!text || !viewer) return
    setCommentBusy(true)
    try {
      const r = await addComment(viewer.g.lead.id, text)
      setComments(c => [...c, r.comment])
      setCommentText('')
    } catch {}
    setCommentBusy(false)
  }

  const [editGroupIds, setEditGroupIds] = React.useState([]) // [{id, caption}]
  const [activeIdx, setActiveIdx] = React.useState(0) // compose stage: which photo is on stage
  // The main "Where was this?" + caption fields belong to the ACTIVE photo
  // (device report 2026-08-29: the shared field bled into every image). Each
  // photo is typed independently — no inheritance between photos.
  const curIdx = Math.min(activeIdx, Math.max(0, files.length - 1))
  const curFile = files[curIdx] || null
  const placeVal = editId ? anchorPlace : (curFile?.place || '')
  const setPlaceVal = (v) => {
    setPlaceResults(null)
    if (editId) setAnchorPlace(v)
    else setFiles(prev => prev.map((x, j) => j === curIdx ? { ...x, place: v, geo: x.geo?.src === 'search' ? null : x.geo } : x))
  }
  const curGeo = editId ? geo : (curFile?.geo || null)
  const setCurGeoSearch = (g) => {
    if (editId) setGeo(g)
    else setFiles(prev => prev.map((x, j) => j === curIdx ? { ...x, geo: g } : x))
  }
  const startEdit = (g) => {
    closeViewer()
    const p = g.lead
    setEditId(p.id)
    setEditGroupIds(g.all.map(x => ({ id: x.id, caption: x.caption })))
    setGeo(typeof p.lat === 'number' && typeof p.lng === 'number' ? { lat: p.lat, lng: p.lng, src: 'search' } : null)
    setPlaceResults(null)
    setFiles([{ f: null, url: 'data:image/jpeg;base64,' + p.thumb_b64 }])
    setAnchorPlace(p.place_name || ''); setAnchorArea(p.area_label || '')
    setKind(p.kind || 'vibe'); setCaption(p.caption || '')
    setPostMsg(''); setView('compose')
  }

  const clearCompose = () => {
    setEditId(null); setEditGroupIds([]); setFiles([]); setGeo(null); setActiveIdx(0)
    setPlaceResults(null); setPlaceSearching(false)
    setAnchorPlace(''); setAnchorArea(''); setCaption(''); setKind('vibe')
  }

  const runPlaceSearch = async () => {
    setPlaceSearching(true); setPlaceResults(null)
    try { setPlaceResults(await searchPlaces((editId ? anchorPlace : (files[Math.min(activeIdx, files.length - 1)]?.place || '')).trim())) }
    catch { setPlaceResults([]) }
    finally { setPlaceSearching(false) }
  }

  // Photo location: EXIF GPS first (read before the privacy strip), then the
  // device's current spot ("posting from here"). Explicit + removable.
  const detectGeo = async (f) => {
    setGeo(null)
    const fromExif = await readGps(f)
    if (fromExif) { setGeo({ ...fromExif, src: 'photo' }); return }
    const fromDevice = await deviceLocation()
    if (fromDevice) setGeo({ ...fromDevice, src: 'device' })
  }

  const submitPhoto = async () => {
    if (!files.length && !editId) { setPostMsg(t('Choose a photo first')); return }
    if (!editId && !anchorArea) {
      const missing = files.findIndex(x => !x.place?.trim() && !x.geo)
      if (missing !== -1) {
        setActiveIdx(missing)
        setPostMsg(files.length > 1 ? t2('Photo {N} needs a place — or pick a neighborhood below.', { N: missing + 1 }) : t('Tell us where this was'))
        return
      }
    }
    if (editId && !anchorPlace && !anchorArea) { setPostMsg(t('Tell us where this was')); return }
    setPosting(true); setPostMsg('')
    if (editId) {
      // Label-only edit: the image itself never changes.
      try {
        const match = seedUserPlaces.find(p => p.name === anchorPlace)
        // Place/kind/location apply to the whole post; captions are PER IMAGE
        // — the form edits the lead's caption, the others keep their own.
        const targets = editGroupIds.length ? editGroupIds : [{ id: editId, caption }]
        for (const tgt of targets) {
          await updatePhoto(tgt.id, {
            place_id: match?.id || null, place_name: anchorPlace || null,
            area_label: anchorArea || null, kind,
            caption: (tgt.id === editId ? caption : tgt.caption) || null,
            lat: geo?.lat ?? null, lng: geo?.lng ?? null,
          })
        }
        clearCompose()
        myPhotos().then(r => setMine(r.photos)).catch(() => {})
        setView('me')
      } catch (e) { setPostMsg(e.message || t('Something went wrong. Please try again.')) }
      finally { setPosting(false) }
      return
    }
    try {
      const match = seedUserPlaces.find(p => p.name === anchorPlace)
      const gid = files.length > 1 ? randGroup() : null
      for (let i = 0; i < files.length; i++) {
        if (files.length > 1) setPostMsg(t2('Posting {A} of {B}…', { A: i + 1, B: files.length }))
        const { image_b64, thumb_b64 } = await prepareImage(files[i].f)
        const rowPlace = files[i].place?.trim() || ''
        const rowMatch = seedUserPlaces.find(pl => pl.name === rowPlace)
        const rowGeo = files[i].geo || null
        await createPhoto({
          anchor_type: rowPlace ? 'place' : 'moment',
          place_id: rowMatch?.id || null, place_name: rowPlace || null,
          area_label: anchorArea || null, kind,
          caption: files[i].caption || null,
          lat: rowGeo?.lat ?? null, lng: rowGeo?.lng ?? null, group_id: gid,
          image_b64, thumb_b64,
        })
      }
      clearCompose(); setAnchorPlace(''); setAnchorArea(''); setCaption(''); setKind('vibe'); setPostMsg('')
      myPhotos().then(r => setMine(r.photos)).catch(() => {})
      setView('me')
    } catch (e) {
      setPostMsg(e.message === 'signed-out' ? t('Sign in first') : (e.message || t('Something went wrong. Please try again.')))
    } finally { setPosting(false) }
  }

  const friendView = view.startsWith('friend:') ? friends.find(f => String(f.id) === view.slice(7)) : null
  const friendPhotosRaw = friendView ? feed.filter(p => String(p.author?.id) === String(friendView.id)) : []
  // The official account's Stoop leads with the user's onboarding interests —
  // a new user's first feed is already about what they said they love.
  const friendPhotos = friendView?.official ? sortByInterests(friendPhotosRaw) : friendPhotosRaw

  const title = view === 'compose' ? (editId ? t('Edit photo') : t('Add a photo'))
    : friendView ? friendView.display_name
    : view === 'friends' ? t('Friends')
    : t('Your Stoop')

  const canGoBack = view === 'compose' || !!friendView

  return (
    <div style={wrapStyle}>
      <div style={S.header}>
        {canGoBack && <button onClick={() => { if (view === 'compose') { clearCompose(); setView('me') } else setView('friends') }} style={S.iconBtn} aria-label="Back">‹</button>}
        <h1 style={S.h1}>{title}</h1>
        {!embedded && <button onClick={close} style={S.iconBtn} aria-label="Close">✕</button>}
      </div>

      {!canGoBack && (
        <div style={S.tabs}>
          <button onClick={() => setView('me')} style={S.tab(view === 'me')}>{t('Your Stoop')}</button>
          <button onClick={() => setView('friends')} style={S.tab(view === 'friends')}>{t('Friends')}{friends.length ? ` (${friends.length})` : ''}</button>
          <button onClick={() => setView('discover')} style={S.tab(view === 'discover')}>{t('From friends')}</button>
        </div>
      )}

      <div style={bodyStyle}>
        {loadErr && <div style={{ ...S.card, border: '1px solid #fca5a5', background: '#fef2f2', color: '#B3261E', fontSize: 13 }}>{loadErr}</div>}

        {/* ── MY STOOP ── */}
        {view === 'me' && (
          <>
            <ProfileHeader key={'ph' + nameBump} user={user} name={myName} photos={mine} onSaveName={saveMyName}
              right={<button style={{ ...S.cta, flex: 1 }} onClick={() => { setPostMsg(''); setView('compose') }}>＋ {t('Add photo')}</button>} />
            <div style={{ display: 'flex', gap: 5, padding: '0 0 10px' }}>
              <button onClick={() => setStoopView('grid')} style={S.tab(stoopView === 'grid')}><ToggleIcon kind="grid" />{t('Grid')}</button>
              <button onClick={() => setStoopView('map')} style={S.tab(stoopView === 'map')}><ToggleIcon kind="map" />{t('Map')}</button>
            </div>
            {stoopView === 'grid'
              ? <PhotoGrid photos={mine} onOpen={(p) => openViewer(p, true)}
                  emptyText={t('Your New York starts here — add the first photo from a place you loved.')} />
              : <StoopMap photos={mine} onOpenPhoto={(p) => openViewer(p, true)} />}
          </>
        )}

        {/* ── FRIENDS ── */}
        {view === 'friends' && (
          <>
            <div style={S.card}>
              <div style={S.label}>{t('Your friend code')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--ink)', userSelect: 'all' }}>{code || '········'}</span>
                <button style={{ ...S.quiet, opacity: code ? 1 : 0.4 }} disabled={!code}
                  onClick={() => { copyText(code).then(() => setFriendMsg('✓ ' + t('Copied'))).catch(() => setFriendMsg(t('Copy failed — select the code and copy it manually'))) }}>{t('Copy')}</button>
                <button style={{ ...S.quiet, opacity: code ? 1 : 0.4 }} disabled={!code}
                  onClick={() => regenerateCode().then(r => setCode(r.code)).catch(e => setLoadErr(explainErr(e)))}>↻</button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input style={{ ...S.input, textTransform: 'uppercase', letterSpacing: '0.1em' }} value={redeemInput}
                  onChange={e => setRedeemInput(e.target.value)} placeholder={t("Enter a friend's code")} maxLength={12} />
                <button style={S.cta} onClick={() => {
                  redeemCode(redeemInput.trim()).then(r => {
                    setFriendMsg(r.already_friends ? t('Already friends!') : '✓ ' + t('You are now friends with') + ' ' + r.friend.display_name)
                    setRedeemInput('')
                    listFriends().then(x => setFriends(x.friends)).catch(() => {})
                    friendsFeed().then(x => setFeed(x.photos)).catch(() => {})
                  }).catch(e => setFriendMsg(e.status === 404 ? t('No user with that code') : e.message))
                }}>{t('Add')}</button>
              </div>
              {friendMsg && <div style={{ ...S.meta, marginTop: 8, color: friendMsg.startsWith('✓') ? '#1F6B45' : '#B3261E' }}>{friendMsg}</div>}
            </div>

            {friends.length === 0 && <div style={{ ...S.meta, padding: '10px 4px' }}>{t('No friends yet — trade codes with your travel crew.')}</div>}
            {friends.map(f => {
              const count = feed.filter(p => String(p.author?.id) === String(f.id)).length
              return (
                <button key={f.id} onClick={() => setView('friend:' + f.id)}
                  style={{ ...S.card, width: '100%', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                  <Avatar name={f.display_name} size={44} avatar={f.picture_url || f.avatar_b64} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>
                      {f.display_name}
                      {f.official && <span style={{ fontSize: 10, fontWeight: 700, color: '#0F6E56', background: '#E1F5EE', padding: '2px 7px', borderRadius: 20, marginLeft: 6, verticalAlign: '2px' }}>✦ {t('Official')}</span>}
                    </div>
                    <div style={S.meta}>{count ? t2('{N} recent photos', { N: count }) : t('No photos yet')}</div>
                  </div>
                  <span style={{ color: 'var(--gray-400)', fontSize: 18 }}>›</span>
                </button>
              )
            })}
          </>
        )}

        {/* ── DISCOVER: friends' finds by category ── */}
        {view === 'discover' && (
          <>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '2px 0 12px' }}>
              {DISCOVER_CATS.map(([id, emoji, label]) => (
                <button key={id} onClick={() => setDiscoverCat(id)} style={S.tab(discoverCat === id)}>{emoji ? emoji + ' ' : ''}{t(label)}</button>
              ))}
            </div>
            {(() => {
              const items = feed.filter(p => discoverCat === 'all' || photoCategory(p) === discoverCat)
              if (!items.length) return (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--gray-500)', fontSize: 13.5, lineHeight: 1.6 }}>
                  {feed.length === 0 ? t('Nothing here yet — when your friends post photos, they show up here.') : t('No finds in this category yet.')}
                </div>
              )
              return collapseGroups(items).map(g => { const p = g.lead; return (
                <div key={p.id} style={{ ...S.card, display: 'flex', gap: 12, cursor: 'pointer' }} onClick={() => openViewer(g, false)}>
                  <span style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={'data:image/jpeg;base64,' + p.thumb_b64} alt="" style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
                    {g.all.length > 1 && <span style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(23,19,15,0.62)', color: '#F7F2EA', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999 }}>⧉ {g.all.length}</span>}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 15.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.place_name || p.area_label || ''}
                    </div>
                    <div style={{ ...S.meta, marginTop: 2 }}>{p.author?.display_name} · {(p.created_at || '').slice(0, 10)}</div>
                    {p.caption && <div style={{ fontSize: 13, color: 'var(--gray-700)', marginTop: 4, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.caption}</div>}
                  </div>
                </div>
              ) })
            })()}
          </>
        )}

        {/* ── A FRIEND'S STOOP ── */}
        {friendView && (
          <>
            <ProfileHeader user={null} name={friendView.display_name} photos={friendPhotos}
              avatar={friendView.picture_url || friendView.avatar_b64}
              right={<>
                <button style={{ ...S.quiet, flex: 1 }} onClick={() => unfriend(friendView.id).then(() => { setView('friends'); listFriends().then(x => setFriends(x.friends)) })}>{t('Remove')}</button>
                <button style={{ ...S.quiet, flex: 1, color: '#B3261E' }} onClick={() => { if (confirm(t('Block this user? Neither of you will see each other\'s content.'))) blockUser(friendView.id).then(() => { setView('friends'); listFriends().then(x => setFriends(x.friends)) }) }}>{t('Block')}</button>
              </>} />
            <div style={{ display: 'flex', gap: 5, padding: '0 0 10px' }}>
              <button onClick={() => setStoopView('grid')} style={S.tab(stoopView === 'grid')}><ToggleIcon kind="grid" />{t('Grid')}</button>
              <button onClick={() => setStoopView('map')} style={S.tab(stoopView === 'map')}><ToggleIcon kind="map" />{t('Map')}</button>
            </div>
            {stoopView === 'grid'
              ? <PhotoGrid photos={friendPhotos} onOpen={(p) => openViewer(p, false)}
                  emptyText={t('Nothing here yet — when your friends post photos, they show up here.')} />
              : <StoopMap photos={friendPhotos} onOpenPhoto={(p) => openViewer(p, false)} />}
          </>
        )}

        {/* ── COMPOSE ── */}
        {view === 'compose' && (
          <div style={S.card}>
            {/* ONE button; iOS presents its native Library / Take Photo /
                Choose File menu for a plain file input — familiar, unstylable,
                and it made our own Take-photo button redundant (device
                report 2026-08-23). Desktop browsers show the file picker. */}
            {!editId && <>
              <input id="share-lib" type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => {
                  const picked = Array.from(e.target.files || []).slice(0, 5 - files.length)
                  if (picked.length) {
                    const add = picked.map(f => ({ f, url: URL.createObjectURL(f), caption: '', place: '', geo: null }))
                    setFiles(prev => { const next = [...prev, ...add]; setActiveIdx(next.length - add.length); return next })
                    setPostMsg('')
                    if (!files.length) detectGeo(picked[0]) // shared fallback from the first shot
                    add.forEach(item => {
                      readGps(item.f).then(g => {
                        if (g) setFiles(prev => prev.map(x => x.url === item.url ? { ...x, geo: g } : x))
                      }).catch(() => {})
                    })
                  }
                  e.target.value = ''
                }} />
              {files.length === 0 ? (
                /* Empty stage — one inviting tap target, not a text button */
                <button onClick={() => document.getElementById('share-lib')?.click()}
                  style={{ width: '100%', aspectRatio: '4/3', border: '2px dashed var(--gray-300)', borderRadius: '0 16px 16px 16px',
                    background: 'var(--gray-50)', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ fontSize: 34, lineHeight: 1 }}>📷</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--gray-500)' }}>{t('Add photos')}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--gray-400)' }}>{t('Up to 5 — each keeps its own place and caption')}</span>
                </button>
              ) : (() => {
                const a = Math.min(activeIdx, files.length - 1)
                const cur = files[a]
                return (
                <>
                  {/* Stage — the active photo, big (Instagram-style) */}
                  <div style={{ position: 'relative' }}>
                    <img src={cur.url} alt="" style={{ width: '100%', maxHeight: 340, aspectRatio: '4/3', objectFit: 'cover',
                      borderRadius: '0 16px 16px 16px', display: 'block' }} />
                    {files.length > 1 && (
                      <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(23,19,15,0.62)', color: '#F7F2EA',
                        fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>{a + 1} / {files.length}</span>
                    )}
                    {cur.geo && (
                      <span style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(234,243,222,0.95)', color: '#3B6D11',
                        fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999 }}>📍 {t('Location found')}</span>
                    )}
                    <button onClick={() => { setFiles(prev => prev.filter((_, j) => j !== a)); setActiveIdx(i => Math.max(0, i - 1)) }}
                      aria-label={t('Remove')}
                      style={{ position: 'absolute', top: 10, left: 10, width: 26, height: 26, borderRadius: 999, border: 'none',
                        background: 'rgba(23,19,15,0.62)', color: '#fff', fontSize: 12, cursor: 'pointer', lineHeight: 1 }}>✕</button>
                  </div>
                  {/* Numbered strip — tap to put a photo on stage */}
                  <div style={{ display: 'flex', gap: 7, marginTop: 9, overflowX: 'auto' }}>
                    {files.map((it, i) => (
                      <button key={it.url} onClick={() => setActiveIdx(i)}
                        style={{ position: 'relative', padding: 0, border: i === a ? '2px solid var(--accent)' : '2px solid transparent',
                          borderRadius: 11, cursor: 'pointer', background: 'none', flexShrink: 0 }}>
                        <img src={it.url} alt="" style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 9, display: 'block',
                          opacity: i === a ? 1 : 0.75 }} />
                        <span style={{ position: 'absolute', top: 2, right: 2, width: 17, height: 17, borderRadius: 999,
                          background: '#17130F', color: '#F7F2EA', fontSize: 10, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                      </button>
                    ))}
                    {files.length < 5 && (
                      <button onClick={() => document.getElementById('share-lib')?.click()} aria-label={t('Add photos')}
                        style={{ width: 58, height: 58, borderRadius: 11, border: '2px dashed var(--gray-300)', background: 'none',
                          color: 'var(--gray-400)', fontSize: 20, cursor: 'pointer', flexShrink: 0 }}>＋</button>
                    )}
                  </div>
                  {/* Caption for the photo on stage (place lives in the main
                      "Where was this?" field below, also per-photo). */}
                  <input value={cur.caption || ''} maxLength={200}
                    onChange={e => setFiles(prev => prev.map((x, j) => j === a ? { ...x, caption: e.target.value } : x))}
                    placeholder={kind === 'food' ? t('What is this dish?') : t('Caption this photo (optional)')}
                    style={{ ...S.input, fontSize: 13.5, marginTop: 10 }} />
                </>
                )
              })()}
            </>}
            {editId && files[0] && <img src={files[0].url} alt="" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: '0 14px 14px 14px' }} />}
            {editId && <div style={{ ...S.meta, marginTop: 8 }}>{t('The photo stays — edit where it was and what it is.')}</div>}
            {!editId && geo && (
              <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: '#EAF3DE', color: '#3B6D11', fontSize: 12, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ flex: 1 }}>📍 {geo.src === 'photo' ? t("Location found in the photo — it will pin on your map.") : t("Using your current location — it will pin on your map.")}</span>
                <button onClick={() => setGeo(null)} style={{ background: 'none', border: 'none', color: '#3B6D11', cursor: 'pointer', fontSize: 12, textDecoration: 'underline', fontFamily: 'inherit', flexShrink: 0 }}>{t('Remove')}</button>
              </div>
            )}
            <div style={{ ...S.label, marginTop: 12 }}>
              {t('Where was this?')}{!editId && files.length > 1 ? ` · ${t2('photo {N}', { N: curIdx + 1 })}` : ''}
            </div>
            <input style={S.input} list="share-places" value={placeVal}
              onChange={e => setPlaceVal(e.target.value)}
              placeholder={t('Type a place name (optional)')} />
            <datalist id="share-places">
              {seedUserPlaces.slice(0, 900).map(p => <option key={p.id} value={p.name} />)}
            </datalist>
            {/* Free-typed names have no coordinates → grid-only. Say so BEFORE
                posting (device report 2026-08-25: "Lincoln Square 13" pinned
                nowhere and nothing explained why). */}
            {/* Any-place search: typed name not in the curated list → offer a
                real place lookup (user-initiated, one call per tap). Picking a
                result sets BOTH the name and the pin coordinates. */}
            {/* Exact dataset match → say so (the Find button hiding was read
                as a bug — device report 2026-08-29: "Dudleys"). */}
            {placeVal && seedUserPlaces.some(p => p.name === placeVal) && (
              <div style={{ marginTop: 6, padding: '8px 10px', borderRadius: 8, background: '#EAF3DE', color: '#3B6D11', fontSize: 12, lineHeight: 1.5 }}>
                ✓ {t2('"{Q}" is in the NYC Stoop guide — it will pin on your map.', { Q: placeVal })}
              </div>
            )}
            {placeVal.trim().length > 2 && !seedUserPlaces.some(p => p.name === placeVal) && curGeo?.src !== 'search' && (
              <button onClick={runPlaceSearch} disabled={placeSearching}
                style={{ ...S.quiet, width: '100%', marginTop: 6, opacity: placeSearching ? 0.6 : 1 }}>
                {placeSearching ? t('Searching…') : '🔍 ' + t2('Find "{Q}" on the map', { Q: placeVal.trim() })}
              </button>
            )}
            {placeResults && placeResults.length > 0 && (
              <div style={{ marginTop: 6, border: '1px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                {placeResults.map((r, i) => (
                  <button key={i} onClick={() => { setPlaceVal(r.name); setCurGeoSearch({ lat: r.lat, lng: r.lng, src: 'search' }); setPlaceResults(null) }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none',
                      borderTop: i ? '1px solid var(--gray-100)' : 'none', padding: '9px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>📍 {r.name}</div>
                    {r.detail && <div style={{ ...S.meta, marginTop: 1 }}>{r.detail}</div>}
                  </button>
                ))}
              </div>
            )}
            {placeResults && placeResults.length === 0 && (
              <div style={{ ...S.meta, marginTop: 6 }}>{t('No match found — the photo can still pin from its own location.')}</div>
            )}
            {curGeo?.src === 'search' && (
              <div style={{ marginTop: 6, padding: '8px 10px', borderRadius: 8, background: '#EAF3DE', color: '#3B6D11', fontSize: 12, lineHeight: 1.5 }}>
                📍 {t2('"{Q}" will pin on your map.', { Q: placeVal })}
              </div>
            )}
            {/* The old "isn't in our list" warning is gone (2026-08-25): with
                any-place search one tap away, it was noise on every keystroke.
                The Find button + green pin confirmations carry the flow now. */}
            <div style={{ ...S.meta, margin: '6px 0' }}>{t('…or just the neighborhood, for a mood shot:')}</div>
            <select style={S.input} value={anchorArea} onChange={e => setAnchorArea(e.target.value)}>
              <option value="">{t('(no neighborhood)')}</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div style={{ ...S.label, marginTop: 12 }}>{t('What is it?')}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {KINDS.map(([id, emoji]) => (
                <button key={id} onClick={() => setKind(id)} style={S.tab(kind === id)}>{emoji} {t(id)}</button>
              ))}
            </div>
            {editId && <>
              <div style={{ ...S.label, marginTop: 12 }}>{kind === 'food' ? t('What should we order?') : t('Caption (optional)')}</div>
              <input style={S.input} value={caption} maxLength={200} onChange={e => setCaption(e.target.value)}
                placeholder={kind === 'food' ? t('The one dish to get…') : t('Say something (optional)')} />
            </>}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button style={{ ...S.cta, opacity: posting ? 0.6 : 1 }} disabled={posting} onClick={submitPhoto}>
                {posting ? t('Posting…') : (editId ? t('Save changes') : t('Post to friends'))}
              </button>
              {postMsg && <span style={{ ...S.meta, color: '#B3261E' }}>{postMsg}</span>}
            </div>
          </div>
        )}
      </div>

      {/* ── Full-screen viewer — carousel for multi-image posts (2026-08-28) ── */}
      {viewer && (() => {
        const cur = viewer.g.all[viewer.idx]
        const many = viewer.g.all.length > 1
        const url = viewer.urls[cur.id]
        return (
        <div className="stoop-viewer" style={{ position: 'fixed', inset: 0, zIndex: 4100, background: 'rgba(15,12,8,0.96)', display: 'flex', flexDirection: 'column', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <button onClick={closeViewer} aria-label="Close"
            style={{ position: 'absolute', top: 'calc(14px + env(safe-area-inset-top, 0px))', right: 16, zIndex: 1,
              background: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: 999, width: 36, height: 36,
              cursor: 'pointer', fontSize: 16, color: '#F3EBDC', lineHeight: 1 }}>✕</button>
          {many && (
            <span style={{ position: 'absolute', top: 'calc(22px + env(safe-area-inset-top, 0px))', left: '50%', transform: 'translateX(-50%)',
              color: '#F3EBDC', fontSize: 12.5, fontWeight: 700, background: 'rgba(255,255,255,0.14)', padding: '4px 11px', borderRadius: 999 }}>
              {viewer.idx + 1} / {viewer.g.all.length}
            </span>
          )}
          <div onClick={closeViewer} onTouchStart={vTouchStart} onTouchEnd={vTouchEnd}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 0, position: 'relative' }}>
            {/* Blur-up: instant thumb → full image fades in on top. */}
            <img key={'t' + cur.id} src={'data:image/jpeg;base64,' + cur.thumb_b64} alt=""
              style={{ maxWidth: '96%', maxHeight: '92%', borderRadius: 8, filter: url ? 'none' : 'blur(14px)', transform: 'scale(1.02)' }} />
            {url && (
              <img key={'f' + cur.id} src={url} alt="" className="stoop-viewer-full"
                style={{ position: 'absolute', maxWidth: '96%', maxHeight: '92%', borderRadius: 8 }} />
            )}
            {many && viewer.idx > 0 && (
              <button onClick={e => { e.stopPropagation(); setViewer(v => ({ ...v, idx: v.idx - 1 })) }} aria-label="Previous"
                style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.16)',
                  border: 'none', borderRadius: 999, width: 38, height: 38, cursor: 'pointer', fontSize: 17, color: '#F3EBDC', lineHeight: 1 }}>‹</button>
            )}
            {many && viewer.idx < viewer.g.all.length - 1 && (
              <button onClick={e => { e.stopPropagation(); setViewer(v => ({ ...v, idx: v.idx + 1 })) }} aria-label="Next"
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.16)',
                  border: 'none', borderRadius: 999, width: 38, height: 38, cursor: 'pointer', fontSize: 17, color: '#F3EBDC', lineHeight: 1 }}>›</button>
            )}
          </div>
          <div style={{ padding: '10px 18px calc(26px + env(safe-area-inset-bottom, 0px))', color: '#EDE6D6', maxHeight: '38vh', overflowY: 'auto' }}>
            {many && (
              <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 8 }}>
                {viewer.g.all.map((_, i) => (
                  <span key={i} style={{ width: i === viewer.idx ? 16 : 6, height: 6, borderRadius: 999,
                    background: i === viewer.idx ? '#F0A32B' : 'rgba(237,230,214,0.4)', transition: 'width 160ms ease' }} />
                ))}
              </div>
            )}
            <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600 }}>
              {{ food: '🍴', view: '🏞', vibe: '✨' }[cur.kind] || ''} {cur.place_name || cur.area_label || ''}
            </div>
            {cur.caption && <div style={{ fontSize: 13.5, marginTop: 4, opacity: 0.9 }}>{cur.caption}</div>}
            <div style={{ fontSize: 12, marginTop: 6, opacity: 0.7, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>{(cur.created_at || '').slice(0, 10)}</span>
              {plannerData(cur) && (planMsg
                ? <span style={{ color: '#9FE1CB' }}>{planMsg}</span>
                : <button onClick={() => { try { window.dispatchEvent(new CustomEvent('nyc-add-to-planner', { detail: plannerData(cur) })) } catch {}; setPlanMsg('✓ ' + t('Added to Planner')) }}
                    style={{ background: 'none', border: 'none', color: '#EDE6D6', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>＋ {t('Add to Planner')}</button>)}
              {viewer.mine
                ? <>
                    <button onClick={() => startEdit(viewer.g)}
                      style={{ background: 'none', border: 'none', color: '#EDE6D6', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>{t('Edit')}</button>
                    <button onClick={async () => {
                      // Deleting a post removes EVERY image in it — the count
                      // moved into a confirm so the action row stays clean
                      // (device report 2026-08-29).
                      if (many && !confirm(t2('Delete this post and its {N} photos?', { N: viewer.g.all.length }))) return
                      const ids = viewer.g.all.map(x => x.id)
                      for (const id of ids) { try { await deletePhoto(id) } catch {} }
                      setMine(m => m.filter(x => !ids.includes(x.id)))
                      closeViewer()
                    }}
                      style={{ background: 'none', border: 'none', color: '#E8A79F', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>
                      {t('Delete')}
                    </button>
                  </>
                : <button onClick={() => reportPhoto(cur.id).then(() => alert(t('Reported. We review reports within 24 hours.')))}
                    style={{ background: 'none', border: 'none', color: '#EDE6D6', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>{t('Report')}</button>}
            </div>

            {/* ── Comments: one thread per POST (anchored to the lead photo) ── */}
            <div style={{ marginTop: 12, borderTop: '1px solid rgba(237,230,214,0.18)', paddingTop: 10 }}>
              {comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>{c.author?.display_name}</span>
                  <span style={{ fontSize: 13, opacity: 0.92, flex: 1, lineHeight: 1.45 }}>{c.text}</span>
                  {(viewer.mine || String(c.author?.id) === String(user?.id)) ? (
                    <button onClick={() => deleteComment(c.id).then(() => setComments(cs => cs.filter(x => x.id !== c.id)))}
                      style={{ background: 'none', border: 'none', color: 'rgba(237,230,214,0.5)', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>✕</button>
                  ) : (
                    <button onClick={() => { if (confirm(t('Report this comment?'))) reportComment(c.id).then(() => alert(t('Reported. We review reports within 24 hours.'))) }}
                      aria-label={t('Report')}
                      style={{ background: 'none', border: 'none', color: 'rgba(237,230,214,0.5)', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>⚑</button>
                  )}
                </div>
              ))}
              {comments.length === 0 && <div style={{ fontSize: 12, opacity: 0.55, marginBottom: 8 }}>{t('No comments yet — say something nice.')}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={commentText} maxLength={300} onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitComment() }}
                  placeholder={t('Add a comment…')}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(237,230,214,0.25)', borderRadius: 999,
                    padding: '8px 14px', fontSize: 13, color: '#F3EBDC', fontFamily: 'inherit', outline: 'none' }} />
                <button onClick={submitComment} disabled={commentBusy || !commentText.trim()}
                  style={{ background: '#C8321A', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 16px',
                    fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', opacity: (commentBusy || !commentText.trim()) ? 0.5 : 1 }}>↑</button>
              </div>
            </div>
          </div>
        </div>
        )
      })()}
    </div>
  )
}
