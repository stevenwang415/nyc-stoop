// ── The Badge World (v3 Phase A prototype) ──────────────────────────────────
// A self-contained full-screen layer with its own dark identity (spec §2/§3).
// One door on the main Map tab opens it; the ‹ pill or a left-edge swipe
// exits. Prototype scope: Map + Badges tabs live, Route/Photos placeholders,
// 5-badge catalog, camera-only collect with server-side 200 m check.
import React from 'react'
import { createPortal } from 'react-dom'
import { t } from '../lib/i18n.js'
import { prepareImage, thumbSrc } from '../share/shareApi.js'
import { BADGES, byId, FINISHES, COLLECT_RADIUS_M, CLOSE_BY_M, distanceM, fmtDist, levelState, collectRadius, seasonOpen } from './catalog.js'
import { myAwards, collectBadge, setBadgeVisibility } from './badgesApi.js'
import Medallion from './Medallion.jsx'
import BadgeDetail from './BadgeDetail.jsx'
import RoutesTab, { AddToRouteSheet } from './RoutesTab.jsx'
import PhotosTab from './PhotosTab.jsx'
import Stamp from './Stamp.jsx'
import BadgeShareSheet, { awardPhotoSrc } from './BadgeShareSheet.jsx'
import { getUser } from '../auth/api.js'

const GOLD = '#E3C36B'
const TXT = '#F2F4F7'
const SUB = 'rgba(235,240,245,0.62)'
const FAINT = 'rgba(235,240,245,0.34)'

// Demo spots for local testing (labeled in the UI; real GPS otherwise).
const DEMO_SPOTS = [
  { label: 'Real GPS', loc: null },
  { label: 'Flatiron', loc: { lat: 40.7400, lng: -73.9884 } },
  { label: 'Empire State', loc: { lat: 40.7482, lng: -73.9860 } },
  { label: 'Central Park', loc: { lat: 40.7738, lng: -73.9712 } },
]

function ensureLeaflet(cb) {
  if (window.L) return cb(window.L)
  if (!document.querySelector('link[data-leaflet-css]')) {
    const l = document.createElement('link')
    l.rel = 'stylesheet'; l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; l.dataset.leafletCss = '1'
    document.head.appendChild(l)
  }
  const existing = document.querySelector('script[data-leaflet], script[data-leaflet-share], script[data-leaflet-badges]')
  if (existing) { existing.addEventListener('load', () => window.L && cb(window.L)); if (window.L) cb(window.L); return }
  const s = document.createElement('script')
  s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.dataset.leafletBadges = '1'
  s.onload = () => cb(window.L)
  document.body.appendChild(s)
}

const glass = {
  background: 'rgba(30,36,46,0.62)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 24px rgba(0,0,0,0.35)',
}

export default function BadgeWorld({ onClose }) {
  const [tab, setTabState] = React.useState(() => {      // map | badges | route | photos
    try { return sessionStorage.getItem('nyc_badge_tab') || 'map' } catch { return 'map' }
  })
  const setTab = (v) => { setTabState(v); try { sessionStorage.setItem('nyc_badge_tab', v) } catch {} }
  const [awards, setAwards] = React.useState([])          // [{badge_id, created_at, visibility, thumb_b64?, thumb_url?}]
  const [sheetSeg, setSheetSeg] = React.useState('mine')  // mine | missing
  const [demoIdx, setDemoIdx] = React.useState(0)
  const [gps, setGps] = React.useState(null)
  const [collecting, setCollecting] = React.useState(null) // badge being photographed
  const [busy, setBusy] = React.useState(false)
  const [struckBadge, setStruckBadge] = React.useState(null) // strike animation overlay
  const [visPrompt, setVisPrompt] = React.useState(null)     // badge awaiting Public/Private
  const [toast, setToast] = React.useState(null)
  const [detail, setDetail] = React.useState(null)        // badge in the detail sheet
  const [addRoute, setAddRoute] = React.useState(null)    // badge in the add-to-route sheet
  const [activeRoute, setActiveRoute] = React.useState(null) // { key, name, stops }
  const [selPin, setSelPin] = React.useState(null)        // collected badge bubble on the map
  const [share, setShare] = React.useState(null)          // { badge, award, initial }
  const [photosAutoOpen, setPhotosAutoOpen] = React.useState(null)
  const selPinClear = React.useRef(null)
  selPinClear.current = () => setSelPin(null)
  const [err, setErr] = React.useState('')
  const inputRef = React.useRef(null)
  const boxRef = React.useRef(null)
  const mapRef = React.useRef(null)
  const swipe = React.useRef(null)
  const levelBefore = React.useRef(null)

  const loc = DEMO_SPOTS[demoIdx].loc || gps
  const owned = new Set(awards.map(a => a.badge_id))
  const lv = levelState([...owned])

  const refresh = () => myAwards().then(r => setAwards(r.awards)).catch(() => {})
  React.useEffect(() => { refresh() }, [])

  // Real GPS (only consulted when demo is off).
  React.useEffect(() => {
    if (!navigator.geolocation) return
    const id = navigator.geolocation.watchPosition(
      p => setGps({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {}, { enableHighAccuracy: true, maximumAge: 15000 })
    return () => navigator.geolocation.clearWatch(id)
  }, [])

  // Edge swipe-back exits the world (same gesture as the Posts page).
  React.useEffect(() => {
    const onStart = e => { const t0 = e.touches[0]; swipe.current = t0.clientX < 40 ? { x: t0.clientX, y: t0.clientY } : null }
    const onEnd = e => {
      const st = swipe.current; swipe.current = null
      if (!st) return
      const t1 = e.changedTouches[0]
      if (t1.clientX - st.x > 70 && Math.abs(t1.clientY - st.y) < 60) onClose()
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd) }
  }, [onClose])

  const distTo = (b) => loc ? distanceM(loc.lat, loc.lng, b.lat, b.lng) : null
  const inRange = (b) => { const d = distTo(b); return d != null && d <= collectRadius(b) && seasonOpen(b) }

  // ── Leaflet map (created once; pins update in place — the StoopMap lesson) ──
  React.useEffect(() => {
    if (tab !== 'map') return
    let dead = false
    ensureLeaflet((L) => {
      if (dead || !boxRef.current) return
      let map = mapRef.current
      if (!map || map._container !== boxRef.current) {
        if (map) { try { map.remove() } catch {} }
        map = L.map(boxRef.current, { zoomControl: false, attributionControl: true })
        // OSM tiles inverted to dark via CSS (CARTO basemaps now require a key,
        // 2026-09-27 — users saw "API KEY REQUIRED" watermarks).
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          { attribution: '&copy; OpenStreetMap', maxZoom: 19, className: 'badge-dark-tiles' }).addTo(map)
        map.setView([40.7420, -73.9880], 13)
        map._pins = L.layerGroup().addTo(map)
        map.on('click', () => selPinClear.current?.())
        mapRef.current = map
        setTimeout(() => { try { map.invalidateSize() } catch {} }, 60)
      }
      const layer = map._pins
      layer.clearLayers()
      const routeSet = activeRoute ? new Set(activeRoute.stops) : null
      if (activeRoute) {
        const pts = activeRoute.stops.map(id => [byId[id].lat, byId[id].lng])
        L.polyline(pts, { color: '#E3C36B', weight: 6, opacity: 0.35 }).addTo(layer)
        L.polyline(pts, { color: '#E3C36B', weight: 2.5, opacity: 0.95 }).addTo(layer)
        activeRoute.stops.forEach((id, i) => {
          const b2 = byId[id]
          const done = owned.has(id)
          L.marker([b2.lat, b2.lng], { zIndexOffset: 400, icon: L.divIcon({ className: '', iconSize: [24, 24], iconAnchor: [12, 12],
            html: `<div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;
              font:800 12px -apple-system,sans-serif;background:${done ? '#E3C36B' : '#1A1F27'};
              color:${done ? '#1A1405' : '#F2F4F7'};border:2px solid #E3C36B">${done ? '\u2713' : i + 1}</div>` }) })
            .addTo(layer).on('click', () => setDetail(b2))
        })
      }
      for (const b of BADGES) {
        const has = owned.has(b.id)
        const near = !has && inRange(b)
        const dim = routeSet && !routeSet.has(b.id)
        const f = FINISHES[b.finish]
        const html = has
          ? `<div style="position:relative;width:26px;height:26px">
               <div style="width:26px;height:26px;border-radius:50%;border:2.5px solid #090D13;
                 background:radial-gradient(circle at 35% 28%, ${f.hi}, ${f.base} 55%, ${f.shadow});
                 box-shadow:0 0 14px 4px rgba(227,195,107,0.45)"></div>
               <div style="position:absolute;left:-8px;top:13px;width:14px;height:17px;background:#F4EFE4;border-radius:2px;
                 transform:rotate(-10deg);box-shadow:0 1px 3px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center">
                 <div style="width:8px;height:10px;background:${f.base};border-radius:1px"></div></div>
             </div>`
          : `<div style="width:24px;height:24px;border-radius:50%;
               border:4.5px solid ${b.finish === 'iris' ? '#C9B6FF' : '#8C949F'};
               ${near ? 'animation:badge-beep 1.6s ease-in-out infinite;border-color:' + GOLD + ';' : ''}"></div>`
        if (routeSet && routeSet.has(b.id)) continue // route pins drawn above
        const icon = L.divIcon({ className: '', iconSize: [26, 26], iconAnchor: [13, 13],
          html: dim ? `<div style="opacity:0.28">${html}</div>` : html })
        L.marker([b.lat, b.lng], { icon }).addTo(layer)
          .on('click', () => {
            if (has) { setSelPin(b); try { map.setView([b.lat, b.lng], Math.max(map.getZoom(), 14)) } catch {} }
            else setDetail(b)
          })
      }
      if (activeRoute && !map._routeFit) {
        try { map.fitBounds(L.latLngBounds(activeRoute.stops.map(id => [byId[id].lat, byId[id].lng])).pad(0.3)) } catch {}
        map._routeFit = true
      }
      if (!activeRoute) map._routeFit = false
      if (loc) {
        const uicon = L.divIcon({ className: '', iconSize: [20, 20], iconAnchor: [10, 10],
          html: `<div style="width:20px;height:20px;border-radius:50%;background:#0A84FF;border:3.5px solid #fff;box-shadow:0 0 10px rgba(10,132,255,0.8)"></div>` })
        L.marker([loc.lat, loc.lng], { icon: uicon, zIndexOffset: 500 }).addTo(layer)
      }
    })
    return () => { dead = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, awards, demoIdx, gps, activeRoute])

  React.useEffect(() => () => { if (mapRef.current) { try { mapRef.current.remove() } catch {}; mapRef.current = null } }, [])

  // ── Collect flow ──
  const startCollect = (b) => { setErr(''); setCollecting(b); inputRef.current?.click() }
  // The iOS system camera's own Retake / Use Photo screen is the review
  // step (Steven, 2026-09-28) — a confirmed photo lands here and strikes.
  const onFile = async (e) => {
    const f = e.target.files?.[0]; e.target.value = ''
    const b = collecting
    if (!f || !b || busy) return
    setBusy(true)
    try {
      const { image_b64, thumb_b64 } = await prepareImage(f)
      levelBefore.current = levelState([...owned]).current
      const r = await collectBadge({ badge_id: b.id, lat: loc?.lat, lng: loc?.lng, image_b64, thumb_b64 })
      setAwards(a => [...a, r.award])
      // The strike stays on screen until the user taps, then hands off to
      // the visibility prompt.
      setStruckBadge(b)
    } catch (e2) {
      setErr(e2.status === 409 ? t('Already collected.')
        : e2.status === 403 ? t('Too far away — get within 200 m.')
        : (e2.message || t('Something went wrong. Please try again.')))
    } finally { setBusy(false); setCollecting(null) }
  }
  const answerVisibility = (vis) => {
    const b = visPrompt; setVisPrompt(null)
    setBadgeVisibility(b.id, vis).catch(() => {})
    setAwards(a => a.map(x => x.badge_id === b.id ? { ...x, visibility: vis } : x))
    const after = levelState([...new Set([...owned, b.id])])
    if (after.current > (levelBefore.current ?? 0)) {
      setToast({ line1: `Level ${after.current} unlocked`, line2: after.currentName })
      setTimeout(() => setToast(null), 3000)
    }
  }

  // ── Shared bits ──
  const seg = (items, active, onPick, small) => (
    <div style={{ ...glass, borderRadius: 999, display: 'flex', padding: 4 }}>
      {items.map(([id, label]) => (
        <button key={id} onClick={() => onPick(id)}
          style={{ flex: 1, border: active === id ? '1px solid rgba(255,255,255,0.12)' : 'none',
            background: active === id ? 'rgba(255,255,255,0.16)' : 'none', borderRadius: 999,
            padding: small ? '9px 0' : '11px 0', fontFamily: 'inherit', cursor: 'pointer',
            fontSize: small ? 13.5 : 15, fontWeight: active === id ? 700 : 500,
            color: active === id ? TXT : SUB }}>
          {label}
        </button>
      ))}
    </div>
  )

  const levelCard = (
    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '13px 15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: TXT }}>{lv.currentName}</span>
        <span style={{ fontSize: 12, color: SUB }}>{lv.current === 0 ? t('No level yet') : `Level ${lv.current} of 5`}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.12)', margin: '11px 0 9px' }}>
        <div style={{ width: `${lv.next ? Math.round(100 * lv.next.have / lv.next.need) : 100}%`, height: '100%', borderRadius: 99,
          background: 'linear-gradient(90deg,#8A6A15,#E3C36B,#F6E39B)' }} />
      </div>
      {lv.next && (
        <div style={{ fontSize: 13, color: SUB }}>
          <b style={{ color: GOLD }}>{lv.next.left}</b> {t('to')} {lv.next.name}
        </div>
      )}
      <div style={{ textAlign: 'right', fontSize: 12, color: FAINT, marginTop: 2 }}>{lv.owned}/{lv.total}</div>
    </div>
  )

  const badgeRow = (b) => {
    const d = distTo(b)
    const has = owned.has(b.id)
    const near = !has && inRange(b)
    return (
      <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
        <Medallion badge={b} size={50} struck={has} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TXT }}>
            {b.name} {b.main && <span style={{ fontSize: 10, fontWeight: 800, color: GOLD, border: `1px solid ${GOLD}55`, borderRadius: 99, padding: '1.5px 7px', marginLeft: 4 }}>MAIN</span>}
          </div>
          <div style={{ fontSize: 12.5, color: has ? SUB : (!seasonOpen(b) ? '#C9B6FF' : near ? GOLD : SUB), marginTop: 2 }}>
            {has ? `${t('Collected')} ${(awards.find(a => a.badge_id === b.id)?.created_at || '').slice(0, 10)}`
              : !seasonOpen(b) ? `${t('Seasonal')} · ${b.season}`
              : near ? `${t("You're here")} · ${fmtDist(d)}`
              : d != null ? `${fmtDist(d)} ${t('away')}` : b.category}
          </div>
        </div>
        {near && (
          <button onClick={() => startCollect(b)} disabled={busy}
            style={{ background: 'linear-gradient(135deg,#F6E39B,#E3C36B 60%,#C9A227)', color: '#1A1405',
              fontSize: 13.5, fontWeight: 800, padding: '11px 16px', borderRadius: 999, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(227,195,107,0.35)', opacity: busy ? 0.6 : 1 }}>
            📷 {t('Take photo')}
          </button>
        )}
      </div>
    )
  }

  const closeBy = BADGES.filter(b => !owned.has(b.id)).map(b => [b, distTo(b)])
    .filter(([, d]) => d != null && d <= CLOSE_BY_M).sort((a, b2) => a[1] - b2[1])
  const missing = BADGES.filter(b => !owned.has(b.id))
    .sort((a, b2) => (distTo(a) ?? 1e9) - (distTo(b2) ?? 1e9))

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 6000, background: '#090D13', display: 'flex', flexDirection: 'column',
      fontFamily: "-apple-system,'SF Pro Text','Helvetica Neue',sans-serif" }}>
      <style>{`
        .badge-dark-tiles { filter: invert(1) hue-rotate(180deg) brightness(0.7) contrast(0.9) saturate(0.35); }
        @keyframes badge-beep { 0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(227,195,107,0.5); }
          50% { transform: scale(1.18); box-shadow: 0 0 0 12px rgba(227,195,107,0); } }
        /* Strike = two composed animations. SPIN: three full turns whose
           easing curve decelerates smoothly to zero at 2s — rotation never
           pauses, so nothing reads as stuck. POP: a springy scale-up with
           the mint flash, over in 0.7s while the spin keeps going. */
        @keyframes badge-strike-rot { from { transform: rotateY(0deg); } to { transform: rotateY(1080deg); } }
        @keyframes badge-strike-pop { 0% { transform: scale(0.4); filter: brightness(3); }
          100% { transform: scale(1); filter: brightness(1); } }
        @keyframes badge-flash { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes badge-toast { 0% { transform: translateY(-24px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      `}</style>

      <input ref={inputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={onFile} />

      {/* top chrome */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 10px) 14px 0' }}>
        {seg([['map', t('Map')], ['badges', t('Badges')], ['route', t('Route')], ['photos', t('Photos')]], tab, setTab)}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <button onClick={onClose} style={{ ...glass, borderRadius: 999, padding: '8px 14px', fontSize: 12.5,
            color: 'rgba(235,240,245,0.85)', fontFamily: 'inherit', cursor: 'pointer' }}>
            ‹ NYC Stoop
          </button>
          <button onClick={() => setDemoIdx(i => (i + 1) % DEMO_SPOTS.length)}
            style={{ ...glass, borderRadius: 999, padding: '8px 14px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
              color: demoIdx ? GOLD : FAINT }}>
            {demoIdx ? `🧪 ${t('Demo')}: ${DEMO_SPOTS[demoIdx].label}` : `🧪 ${t('Demo off')}`}
          </button>
        </div>
      </div>

      {/* ── MAP ── */}
      {tab === 'map' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div ref={boxRef} style={{ flex: 1, minHeight: 200, margin: '10px 0 0', background: '#090D13' }} />
          <div style={{ ...glass, borderRadius: '26px 26px 0 0', background: 'rgba(22,27,35,0.88)',
            padding: '10px 16px calc(env(safe-area-inset-bottom, 0px) + 14px)', maxHeight: '46vh', overflowY: 'auto' }}>
            <div style={{ width: 40, height: 4.5, borderRadius: 99, background: 'rgba(255,255,255,0.25)', margin: '0 auto 10px' }} />
            {seg([['mine', t('My badges')], ['missing', t('Missing')]], sheetSeg, setSheetSeg, true)}
            <div style={{ height: 12 }} />
            {levelCard}
            {err && <div style={{ color: '#E08A7A', fontSize: 12.5, padding: '8px 2px 0' }}>{err}</div>}
            {sheetSeg === 'mine' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0 4px' }}>
                  <span style={{ fontSize: 15.5, fontWeight: 800, color: TXT }}>{t('Close by')}</span>
                  <span style={{ fontSize: 12, color: FAINT }}>{t('within 900 m')}</span>
                </div>
                {closeBy.length ? closeBy.map(([b]) => badgeRow(b))
                  : <div style={{ fontSize: 13, color: FAINT, padding: '6px 0 10px' }}>{t('Nothing close by — open Missing to see every badge.')}</div>}
                {awards.length > 0 && (
                  <>
                    <div style={{ fontSize: 15.5, fontWeight: 800, color: TXT, padding: '10px 0 4px' }}>{t('Your badges')}</div>
                    {awards.map(a => byId[a.badge_id]).filter(Boolean).map(b => badgeRow(b))}
                  </>
                )}
              </>
            ) : (
              <div style={{ paddingTop: 8 }}>{missing.map(b => badgeRow(b))}</div>
            )}
          </div>
        </div>
      )}

      {/* ── BADGES (shelf) ── */}
      {tab === 'badges' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
          {levelCard}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '18px 0 10px' }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: TXT }}>{t('On the map')}</span>
            <span style={{ fontSize: 12.5, color: SUB }}>{lv.owned} {t('of')} {lv.total} {t('collected')}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {BADGES.map(b => {
              const has = owned.has(b.id)
              const d = distTo(b)
              return (
                <button key={b.id} onClick={() => setDetail(b)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  <Medallion badge={b} size={92} struck={has} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: TXT, textAlign: 'center' }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: has ? GOLD : b.main ? GOLD : FAINT }}>
                    {has ? t('Collected') : b.main ? t('Main spot') : d != null ? fmtDist(d) : ''}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── ROUTE ── */}
      {tab === 'route' && (
        <RoutesTab owned={owned} loc={loc} activeRoute={activeRoute}
          onStartRoute={(r) => { setActiveRoute(r); setTab('map') }}
          onEndRoute={() => setActiveRoute(null)}
          openBadge={(b) => setDetail(b)} />
      )}

      {/* ── PHOTOS ── */}
      {tab === 'photos' && (
        <PhotosTab awards={awards}
          onShare={(badge, award, initial) => setShare({ badge, award, initial })}
          onOpenBadge={(b) => setDetail(b)}
          autoOpen={photosAutoOpen} onAutoOpened={() => setPhotosAutoOpen(null)} />
      )}

      {/* selected collected pin — badge bubble (mockup §Map) */}
      {tab === 'map' && selPin && (() => {
        const award = awards.find(a => a.badge_id === selPin.id)
        if (!award) return null
        const me = getUser()?.display_name || 'Me'
        return (
          <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(env(safe-area-inset-top, 0px) + 150px)', zIndex: 900,
            display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
            <div style={{ position: 'relative', pointerEvents: 'auto', animation: 'badge-toast 0.42s cubic-bezier(0.3,1.5,0.5,1)' }}>
              <button onClick={() => { setSelPin(null); setDetail(selPin) }} aria-label={`Open ${selPin.name} badge`}
                style={{ ...glass, width: 92, height: 92, borderRadius: 46, border: 'none', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, background: 'rgba(30,36,46,0.72)' }}>
                <Medallion badge={selPin} size={76} struck />
              </button>
              <button onClick={() => { setSelPin(null); setTab('photos'); setPhotosAutoOpen(selPin.id) }}
                aria-label={`Open your photos at ${selPin.name}`}
                style={{ position: 'absolute', left: -34, bottom: -14, border: 'none', background: 'none', padding: 0,
                  cursor: 'pointer', transform: 'rotate(-8deg)', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))' }}>
                <Stamp src={awardPhotoSrc(award)} place={selPin.name} owner={me} width={48} />
              </button>
              <button onClick={() => setShare({ badge: selPin, award, initial: 'story' })} aria-label={`Share ${selPin.name}`}
                style={{ ...glass, position: 'absolute', right: -46, top: 26, width: 40, height: 40, borderRadius: 20,
                  border: 'none', color: TXT, fontSize: 15, cursor: 'pointer', background: 'rgba(30,36,46,0.72)' }}>↥</button>
            </div>
            <div style={{ ...glass, marginTop: 14, borderRadius: 999, padding: '6px 13px', fontSize: 12.5, fontWeight: 700,
              color: TXT, background: 'rgba(30,36,46,0.8)', pointerEvents: 'auto' }}>
              {selPin.name}
            </div>
          </div>
        )
      })()}

      {/* active-route banner on the map */}
      {tab === 'map' && activeRoute && (() => {
        const next = activeRoute.stops.map(id => byId[id]).find(b => !owned.has(b.id))
        return (
          <div style={{ position: 'absolute', left: 14, right: 14, top: 'calc(env(safe-area-inset-top, 0px) + 108px)', zIndex: 900 }}>
            <div style={{ ...glass, background: 'rgba(22,27,35,0.9)', borderRadius: 16, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 11 }}>
              {next && <Medallion badge={next} size={38} struck={false} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: TXT }}>
                  {next ? `${t('Next')}: ${next.name}` : t('Route complete!')} 
                </div>
                <div style={{ fontSize: 11, color: SUB }}>{activeRoute.name}{next && distTo(next) != null ? ` · ${fmtDist(distTo(next))}` : ''}</div>
              </div>
              <button onClick={() => setActiveRoute(null)}
                style={{ background: 'none', border: 'none', color: FAINT, fontSize: 15, cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        )
      })()}

      {/* badge detail sheet */}
      {detail && (
        <BadgeDetail badge={detail} award={awards.find(a => a.badge_id === detail.id) || null}
          dist={distTo(detail)}
          progressLine={`Badge ${lv.owned} of ${lv.total} \u00b7 ${lv.currentName}`}
          onClose={() => setDetail(null)}
          onShare={(badge, award, initial) => setShare({ badge, award, initial })}
          onTakePhoto={() => { const b = detail; setDetail(null); startCollect(b) }}
          onVisibility={(v) => {
            setBadgeVisibility(detail.id, v).catch(() => {})
            setAwards(a => a.map(x => x.badge_id === detail.id ? { ...x, visibility: v } : x))
          }}
          onAddToRoute={() => setAddRoute(detail)}
          onShowOnMap={() => {
            const b = detail; setDetail(null); setTab('map')
            setTimeout(() => { try { mapRef.current?.setView([b.lat, b.lng], 15) } catch {} }, 250)
          }} />
      )}
      {addRoute && <AddToRouteSheet badge={addRoute} onClose={() => setAddRoute(null)} />}
      {share && (
        <BadgeShareSheet badge={share.badge} award={share.award} initial={share.initial}
          progressLine={`Badge ${lv.owned} of ${lv.total} \u00b7 ${lv.currentName}`}
          onClose={() => setShare(null)} />
      )}

      {/* strike overlay */}
      {struckBadge && (
        <div onClick={() => { const b = struckBadge; setStruckBadge(null); setVisPrompt(b) }}
          style={{ position: 'fixed', inset: 0, zIndex: 6500, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 22, background: 'rgba(9,13,19,0.92)', cursor: 'pointer' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#fff', animation: 'badge-flash 0.5s ease-out forwards', pointerEvents: 'none' }} />
          <div style={{ animation: 'badge-strike-pop 0.7s cubic-bezier(0.3,1.4,0.5,1) both' }}>
            <div style={{ animation: 'badge-strike-rot 2s cubic-bezier(0.15,0.65,0.2,1) both', transformStyle: 'preserve-3d' }}>
              <Medallion badge={struckBadge} size={230} struck />
            </div>
          </div>
          <div style={{ textAlign: 'center', animation: 'badge-toast 0.6s ease-out 1.2s backwards' }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: TXT }}>{struckBadge.name}</div>
            <div style={{ fontSize: 13, color: GOLD, fontWeight: 700, marginTop: 5, letterSpacing: '0.06em' }}>{t('BADGE COLLECTED')}</div>
          </div>
          <div style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 46px)', fontSize: 12.5, color: FAINT }}>
            {t('Tap to continue')}
          </div>
        </div>
      )}

      {/* visibility prompt */}
      {visPrompt && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 6600, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          background: 'rgba(9,13,19,0.6)', padding: '0 14px calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
          <div style={{ ...glass, background: 'rgba(22,27,35,0.94)', borderRadius: 30, padding: '20px 18px', width: '100%', maxWidth: 400 }}>
            <div style={{ textAlign: 'center', marginBottom: 4 }}><Medallion badge={visPrompt} size={64} struck /></div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TXT, textAlign: 'center', marginBottom: 14 }}>{t('Who can see this badge?')}</div>
            <button onClick={() => answerVisibility('public')}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: '13px 15px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 9 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: TXT }}>🌐 {t('Public')}</div>
              <div style={{ fontSize: 12.5, color: SUB, marginTop: 3 }}>{t('Friends can see this badge on your Stoop.')}</div>
            </button>
            <button onClick={() => answerVisibility('private')}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: '13px 15px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: TXT }}>🔒 {t('Private')}</div>
              <div style={{ fontSize: 12.5, color: SUB, marginTop: 3 }}>{t('Only you can see it.')}</div>
            </button>
          </div>
        </div>
      )}

      {/* level toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 70px)', left: '50%', transform: 'translateX(-50%)',
          zIndex: 6700, animation: 'badge-toast 0.35s ease-out' }}>
          <div style={{ ...glass, background: 'rgba(22,27,35,0.95)', borderRadius: 18, padding: '12px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: GOLD }}>{toast.line1}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: TXT, marginTop: 2 }}>{toast.line2}</div>
          </div>
        </div>
      )}
    </div>, document.body)
}
