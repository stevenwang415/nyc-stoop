// ── Route tab (Phase B) ─────────────────────────────────────────────────────
// Suggested + My routes as cards; route detail with numbered stops and
// walking legs; Follow copies a suggestion into My routes; Start hands the
// stops to the map (gold polyline, dimmed pins, next-stop banner).
import React from 'react'
import { t } from '../lib/i18n.js'
import { BADGES, byId, fmtDist } from './catalog.js'
import { SUGGESTED_ROUTES, loadMyRoutes, saveMyRoutes, walkingOrder, routeStats, legMinutes } from './routes.js'
import Medallion from './Medallion.jsx'

const GOLD = '#E3C36B'
const TXT = '#F2F4F7'
const SUB = 'rgba(235,240,245,0.62)'
const FAINT = 'rgba(235,240,245,0.34)'
const card = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '14px 15px' }
const capsule = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: TXT,
  fontSize: 13, fontWeight: 700, padding: '10px 16px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit' }

export default function RoutesTab({ owned, loc, activeRoute, onStartRoute, onEndRoute, openBadge }) {
  const [seg, setSeg] = React.useState('suggested')
  const [mine, setMine] = React.useState(loadMyRoutes)
  const [open, setOpen] = React.useState(null) // {kind:'suggested'|'mine', id}
  const [newName, setNewName] = React.useState('')
  const [naming, setNaming] = React.useState(false)

  const persist = (routes) => { setMine(routes); saveMyRoutes(routes) }

  const routeOf = () => {
    if (!open) return null
    if (open.kind === 'suggested') return SUGGESTED_ROUTES.find(r => r.id === open.id)
    return mine.find(r => r.id === open.id)
  }

  const follow = (r) => {
    if (mine.some(m => m.from === r.id)) return
    persist([...mine, { id: 'my' + Date.now(), name: r.name, from: r.id, stops: [...r.stops] }])
  }
  const createRoute = () => {
    const name = newName.trim() || t('New route')
    const r = { id: 'my' + Date.now(), name, stops: [] }
    persist([...mine, r]); setNewName(''); setNaming(false)
    setSeg('mine'); setOpen({ kind: 'mine', id: r.id })
  }

  const routeCard = (r, kind) => {
    const collected = r.stops.filter(id => owned.has(id)).length
    const stats = routeStats(kind === 'mine' && loc ? walkingOrder(r.stops, loc) : r.stops)
    const following = kind === 'suggested' && mine.some(m => m.from === r.id)
    return (
      <button key={r.id} onClick={() => setOpen({ kind, id: r.id })}
        style={{ ...card, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: TXT }}>
              {r.name} {following && <span style={{ fontSize: 10, color: GOLD, border: `1px solid ${GOLD}55`, borderRadius: 99, padding: '2px 7px', marginLeft: 5 }}>{t('Following')}</span>}
            </div>
            <div style={{ fontSize: 12.5, color: SUB, marginTop: 3 }}>
              {kind === 'mine' && !r.from ? t('Your route') : r.subtitle || t('Your route')} · {r.stops.length} {t('stops')} · {stats.km.toFixed(1)} km
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: TXT }}>{collected}/{r.stops.length}</div>
            <div style={{ fontSize: 11, color: FAINT }}>{t('collected')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 10 }}>
          {r.stops.slice(0, 6).map((id, i) => (
            <div key={id} style={{ marginLeft: i ? -10 : 0 }}>
              <Medallion badge={byId[id]} size={38} struck={owned.has(id)} />
            </div>
          ))}
        </div>
      </button>
    )
  }

  // ── route detail ──
  const r = routeOf()
  if (r) {
    const isMine = open.kind === 'mine'
    const stops = isMine && loc ? walkingOrder(r.stops, loc) : r.stops
    const stats = routeStats(stops)
    const left = stops.filter(id => !owned.has(id)).length
    const following = !isMine && mine.some(m => m.from === r.id)
    const isActive = activeRoute && activeRoute.key === (open.kind + ':' + r.id)
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
        <button onClick={() => setOpen(null)} style={{ ...capsule, marginBottom: 14 }}>‹ {t('Routes')}</button>
        <div style={{ fontSize: 22, fontWeight: 800, color: TXT }}>{r.name}</div>
        <div style={{ fontSize: 13, color: SUB, margin: '4px 0 14px' }}>{left} {t('badges left to collect')}</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {[[stats.km.toFixed(1) + ' km', t('walk')], [stats.minutes + ' min', t('walking time')], [left, t('to collect')]].map(([v, l], i) => (
            <div key={i} style={{ ...card, flex: 1, textAlign: 'center', padding: '10px 4px' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: TXT }}>{v}</div>
              <div style={{ fontSize: 10.5, color: FAINT, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        {stops.map((id, i) => {
          const b = byId[id]
          const has = owned.has(id)
          return (
            <div key={id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: has ? GOLD : 'rgba(255,255,255,0.1)', color: has ? '#1A1405' : SUB,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 800 }}>
                  {has ? '✓' : i + 1}
                </div>
                <button onClick={() => openBadge(b)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  <Medallion badge={b} size={46} struck={has} />
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TXT }}>{b.name}</div>
                  <div style={{ fontSize: 11.5, color: SUB }}>{b.main ? t('Main spot') : b.category}</div>
                </div>
                {isMine && (
                  <button onClick={() => {
                    const routes = mine.map(m => m.id === r.id ? { ...m, stops: m.stops.filter(x => x !== id) } : m)
                    persist(routes)
                  }} style={{ background: 'none', border: 'none', color: FAINT, fontSize: 16, cursor: 'pointer' }}>✕</button>
                )}
              </div>
              {i < stops.length - 1 && (() => {
                const leg = legMinutes(id, stops[i + 1])
                return <div style={{ fontSize: 11, color: FAINT, padding: '0 0 4px 52px' }}>↓ {leg.minutes} min · {fmtDist(leg.meters)}</div>
              })()}
            </div>
          )
        })}
        <div style={{ display: 'flex', gap: 9, marginTop: 18, flexWrap: 'wrap' }}>
          {!isMine && (
            <button onClick={() => follow(r)} disabled={following}
              style={{ ...capsule, flex: 1, opacity: following ? 0.55 : 1 }}>
              {following ? t('Following · in My routes') : t('Follow route')}
            </button>
          )}
          <button onClick={() => isActive ? onEndRoute() : onStartRoute({ key: open.kind + ':' + r.id, name: r.name, stops })}
            style={{ flex: 1, background: isActive ? 'rgba(224,138,122,0.18)' : 'linear-gradient(135deg,#F6E39B,#E3C36B 60%,#C9A227)',
              color: isActive ? '#E08A7A' : '#1A1405', fontSize: 14, fontWeight: 800, padding: '12px 0', borderRadius: 999,
              border: isActive ? '1px solid rgba(224,138,122,0.4)' : 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {isActive ? t('End route') : t('Start route')}
          </button>
          {isMine && (
            <button onClick={() => { persist(mine.filter(m => m.id !== r.id)); setOpen(null); if (isActive) onEndRoute() }}
              style={{ ...capsule, flex: '1 1 100%', color: '#E08A7A' }}>
              {t('Delete route')}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── route list ──
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: 4, marginBottom: 16 }}>
        {[['suggested', t('Suggested')], ['mine', `${t('My routes')}${mine.length ? ' · ' + mine.length : ''}`]].map(([id, label]) => (
          <button key={id} onClick={() => setSeg(id)}
            style={{ flex: 1, border: 'none', borderRadius: 999, padding: '10px 0', fontFamily: 'inherit', cursor: 'pointer',
              fontSize: 14, fontWeight: seg === id ? 700 : 500,
              background: seg === id ? 'rgba(255,255,255,0.16)' : 'none', color: seg === id ? TXT : SUB }}>
            {label}
          </button>
        ))}
      </div>
      {seg === 'suggested'
        ? SUGGESTED_ROUTES.map(r => routeCard(r, 'suggested'))
        : (
          <>
            {naming ? (
              <div style={{ ...card, marginBottom: 12, display: 'flex', gap: 8 }}>
                <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder={t('Route name')} onKeyDown={e => { if (e.key === 'Enter') createRoute() }}
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: TXT, fontSize: 15, fontFamily: 'inherit' }} />
                <button onClick={createRoute} style={{ ...capsule, padding: '8px 16px' }}>{t('Create')}</button>
              </div>
            ) : (
              <button onClick={() => setNaming(true)}
                style={{ width: '100%', border: '1.5px dashed rgba(255,255,255,0.25)', background: 'none', borderRadius: 18,
                  padding: '16px 0', color: SUB, fontSize: 14.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>
                ＋ {t('New route')}
              </button>
            )}
            {mine.map(r => routeCard(r, 'mine'))}
            {!mine.length && !naming && <div style={{ fontSize: 13, color: FAINT, textAlign: 'center', padding: 12 }}>{t('Make a route, then add badges from any badge’s Add to route.')}</div>}
          </>
        )}
    </div>
  )
}

// ── Add-to-route sheet, exported for BadgeDetail ──
export function AddToRouteSheet({ badge, onClose }) {
  const [mine, setMine] = React.useState(loadMyRoutes)
  const [newName, setNewName] = React.useState('')
  const persist = (routes) => { setMine(routes); saveMyRoutes(routes) }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 6800, display: 'flex', alignItems: 'flex-end', background: 'rgba(9,13,19,0.65)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ width: '100%', background: 'rgba(22,27,35,0.96)', borderRadius: '30px 30px 0 0', border: '1px solid rgba(255,255,255,0.09)',
          padding: '18px 18px calc(env(safe-area-inset-bottom, 0px) + 22px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Medallion badge={badge} size={46} struck={false} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: TXT }}>{t('Add to route')}</div>
            <div style={{ fontSize: 12.5, color: SUB }}>{badge.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t('New route with this badge')}
            style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
              padding: '11px 13px', color: TXT, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
          <button onClick={() => {
            const r = { id: 'my' + Date.now(), name: newName.trim() || t('New route'), stops: [badge.id] }
            persist([...mine, r]); setNewName('')
          }} style={{ ...capsule }}>{t('Create')}</button>
        </div>
        {mine.map(r => {
          const added = r.stops.includes(badge.id)
          return (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 2px' }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: TXT }}>{r.name}</div>
                <div style={{ fontSize: 11.5, color: FAINT }}>{r.stops.length} {t('stops')}</div>
              </div>
              <button onClick={() => persist(mine.map(m => m.id === r.id
                ? { ...m, stops: added ? m.stops.filter(x => x !== badge.id) : [...m.stops, badge.id] } : m))}
                style={{ ...capsule, padding: '8px 18px', color: added ? GOLD : TXT }}>
                {added ? t('Added ✓') : t('Add')}
              </button>
            </div>
          )
        })}
        {!mine.length && <div style={{ fontSize: 12.5, color: FAINT, padding: '4px 2px' }}>{t('No routes yet — create one above.')}</div>}
      </div>
    </div>
  )
}
