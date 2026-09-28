// ── Photos tab (Phase C) + the stamp viewer ─────────────────────────────────
// Every thumbnail is the STAMP version. Places / Grid / Timeline views and a
// full-screen viewer: stamp first, toggle/swipe to the photo, ‹ › between
// photos, Open badge pill, share → the three-card share sheet (mockup flow).
import React from 'react'
import { t } from '../lib/i18n.js'
import { getUser } from '../auth/api.js'
import { byId } from './catalog.js'
import Stamp from './Stamp.jsx'
import Medallion from './Medallion.jsx'
import { awardPhotoSrc } from './BadgeShareSheet.jsx'

const GOLD = '#E3C36B'
const TXT = '#F2F4F7'
const SUB = 'rgba(235,240,245,0.62)'
const FAINT = 'rgba(235,240,245,0.34)'

export default function PhotosTab({ awards, onShare, onOpenBadge, autoOpen, onAutoOpened }) {
  const [seg, setSeg] = React.useState('places')
  const [viewerIdx, setViewerIdx] = React.useState(null)
  const [mode, setMode] = React.useState('stamp')
  const me = getUser()?.display_name || 'Me'
  const items = awards.filter(a => byId[a.badge_id])
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))

  // Map-bubble stamp tap lands here with the badge to open (mockup flow).
  React.useEffect(() => {
    if (!autoOpen) return
    const i = items.findIndex(a => a.badge_id === autoOpen)
    if (i >= 0) { setViewerIdx(i); setMode('stamp') }
    onAutoOpened?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen])

  if (!items.length) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: FAINT, fontSize: 14, padding: 30, textAlign: 'center' }}>
      {t('Collect your first badge — its photo becomes a stamp here.')}
    </div>
  )

  const openViewer = (a) => { setViewerIdx(items.indexOf(a)); setMode('stamp') }
  const viewer = viewerIdx != null ? items[viewerIdx] : null
  const stampOf = (a, w) => (
    <button key={a.badge_id} onClick={() => openViewer(a)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
      <Stamp src={awardPhotoSrc(a)} place={byId[a.badge_id].name} owner={me} width={w} date={(a.created_at || '').slice(5, 10).replace('-', '/')} />
    </button>
  )

  const byDay = {}
  for (const a of items) { const d = (a.created_at || '').slice(0, 10); (byDay[d] = byDay[d] || []).push(a) }
  const days = Object.keys(byDay).sort().reverse()
  const day0 = days.length ? days[days.length - 1] : null
  const dayN = (d) => day0 ? Math.round((new Date(d) - new Date(day0)) / 86400000) + 1 : 1

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: TXT }}>{t('Photos')}</div>
      <div style={{ fontSize: 13, color: SUB, margin: '3px 0 14px' }}>
        {items.length} {t('photos from')} {new Set(items.map(a => a.badge_id)).size} {t('places')}
      </div>
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: 4, marginBottom: 18 }}>
        {[['places', t('Places')], ['grid', t('Grid')], ['timeline', t('Timeline')]].map(([id, label]) => (
          <button key={id} onClick={() => setSeg(id)}
            style={{ flex: 1, border: 'none', borderRadius: 999, padding: '9px 0', fontFamily: 'inherit', cursor: 'pointer',
              fontSize: 13.5, fontWeight: seg === id ? 700 : 500,
              background: seg === id ? 'rgba(255,255,255,0.16)' : 'none', color: seg === id ? TXT : SUB }}>
            {label}
          </button>
        ))}
      </div>

      {seg === 'places' && items.map(a => (
        <div key={a.badge_id} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
            <button onClick={() => onOpenBadge(byId[a.badge_id])}
              style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, background: 'none', border: 'none',
                padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
              <Medallion badge={byId[a.badge_id]} size={36} struck />
              <span>
                <span style={{ display: 'block', fontSize: 15.5, fontWeight: 800, color: TXT }}>{byId[a.badge_id].name}</span>
                <span style={{ display: 'block', fontSize: 11.5, color: FAINT }}>1 {t('photo')} · {(a.created_at || '').slice(0, 10)}</span>
              </span>
            </button>
            <button onClick={() => onShare(byId[a.badge_id], a, 'story')}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
                width: 36, height: 36, color: TXT, fontSize: 14, cursor: 'pointer', flexShrink: 0 }}>↥</button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>{stampOf(a, 108)}</div>
        </div>
      ))}

      {seg === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {items.map(a => stampOf(a, 104))}
        </div>
      )}

      {seg === 'timeline' && days.map(d => (
        <div key={d} style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 14, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: GOLD, marginTop: 6 }} />
            <div style={{ flex: 1, width: 2, background: 'rgba(227,195,107,0.3)' }} />
          </div>
          <div style={{ flex: 1, paddingBottom: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: TXT }}>
              {t('Day')} {dayN(d)} <span style={{ color: FAINT, fontWeight: 500 }}>· {new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginTop: 9 }}>
              {byDay[d].map(a => stampOf(a, 96))}
            </div>
          </div>
        </div>
      ))}

      {/* ── viewer: stamp first · swipe/toggle to photo · ‹ › · Open badge ── */}
      {viewer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 6900, background: '#05070A', display: 'flex', flexDirection: 'column' }}
          onTouchStart={e => { viewer._x = e.touches[0].clientX }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - (viewer._x ?? 0)
            if (dx < -60) setMode('photo'); else if (dx > 60) setMode('stamp')
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 16px 8px' }}>
            <button onClick={() => setViewerIdx(null)} style={{ background: 'none', border: 'none', color: '#EDE6D6', fontSize: 20, cursor: 'pointer' }}>✕</button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: TXT }}>{byId[viewer.badge_id].name}</div>
              <div style={{ fontSize: 11, color: FAINT }}>{(viewer.created_at || '').slice(0, 10)} · {viewerIdx + 1} {t('of')} {items.length}</div>
            </div>
            <button onClick={() => onShare(byId[viewer.badge_id], viewer, mode)}
              style={{ background: 'none', border: 'none', color: '#EDE6D6', fontSize: 17, cursor: 'pointer' }}>↥</button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18, minHeight: 0 }}>
            {mode === 'stamp'
              ? <Stamp src={awardPhotoSrc(viewer)} place={byId[viewer.badge_id].name} owner={me} width={270} date={(viewer.created_at || '').slice(5, 10).replace('-', '/')} />
              : <img src={awardPhotoSrc(viewer)} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 10 }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 16px' }}>
            <button onClick={() => setViewerIdx(i => Math.max(0, i - 1))} disabled={viewerIdx === 0}
              style={{ width: 44, height: 44, borderRadius: 22, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.08)',
                color: TXT, fontSize: 17, cursor: 'pointer', opacity: viewerIdx === 0 ? 0.35 : 1 }}>‹</button>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 999, padding: 4 }}>
              {[['stamp', t('Stamp')], ['photo', t('Photo')]].map(([id, label]) => (
                <button key={id} onClick={() => setMode(id)}
                  style={{ border: 'none', borderRadius: 999, padding: '9px 22px', fontFamily: 'inherit', cursor: 'pointer',
                    fontSize: 13, fontWeight: 700, background: mode === id ? 'rgba(255,255,255,0.18)' : 'none',
                    color: mode === id ? TXT : SUB }}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => setViewerIdx(i => Math.min(items.length - 1, i + 1))} disabled={viewerIdx === items.length - 1}
              style={{ width: 44, height: 44, borderRadius: 22, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.08)',
                color: TXT, fontSize: 17, cursor: 'pointer', opacity: viewerIdx === items.length - 1 ? 0.35 : 1 }}>›</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 calc(env(safe-area-inset-bottom, 0px) + 18px)' }}>
            <button onClick={() => { setViewerIdx(null); onOpenBadge(byId[viewer.badge_id]) }}
              style={{ display: 'flex', alignItems: 'center', gap: 9, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.08)',
                borderRadius: 999, padding: '8px 18px 8px 8px', color: TXT, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
              <Medallion badge={byId[viewer.badge_id]} size={30} struck /> {t('Open badge')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
