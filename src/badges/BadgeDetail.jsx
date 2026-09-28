// ── Badge detail sheet (mockup-exact) ───────────────────────────────────────
// Floating rounded card: share/✕ circles, the SpinBadge (physics intro spin,
// drag to spin, tap to flip), name + category + gold status, Your photos with
// count + on-site tile, Visibility with segmented control + caption, locked
// "At this spot", then Take photo / Add to route / Show on map.
import React from 'react'
import { t } from '../lib/i18n.js'
import { fmtDist, collectRadius, seasonOpen } from './catalog.js'
import SpinBadge from './SpinBadge.jsx'
import { ShareIcon, CloseIcon, CameraIcon, LockIcon } from './icons.jsx'

const GOLD = '#E3C36B'
const TXT = '#F2F4F7'
const SUB = 'rgba(235,240,245,0.62)'
const FAINT = 'rgba(235,240,245,0.34)'
const glass = {
  background: 'rgba(22,27,35,0.94)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 18px 60px rgba(0,0,0,0.55)',
}
const circleBtn = {
  width: 32, height: 32, borderRadius: 16, border: 'none', display: 'grid', placeItems: 'center',
  cursor: 'pointer', background: 'rgba(255,255,255,0.08)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)', flexShrink: 0,
}

function fmtWhen(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d) ? iso.slice(0, 10) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function BadgeDetail({ badge, award, dist, onClose, onTakePhoto, onVisibility, onAddToRoute, onShowOnMap, onShare }) {
  const has = !!award
  const open = seasonOpen(badge)
  const near = dist != null && dist <= collectRadius(badge)
  const photo = award && (award.image_url || (award.image_b64 ? 'data:image/jpeg;base64,' + award.image_b64 : null) || award.thumb_url || (award.thumb_b64 ? 'data:image/jpeg;base64,' + award.thumb_b64 : null))
  const vis = award?.visibility || 'private'

  const status = has
    ? <span style={{ color: GOLD }}>{t('Collected')} {fmtWhen(award.created_at)}</span>
    : !open ? <span style={{ color: '#C9B6FF' }}>{t('Seasonal')} · {badge.season}</span>
    : (near && open) ? <span style={{ color: GOLD }}>{t("You're here")} · {fmtDist(dist)} {t('away')}</span>
    : dist != null ? <>{fmtDist(dist)} {t('away')} · {t('collect within')} {collectRadius(badge)} m</>
    : <>{t('collect within')} {collectRadius(badge)} m</>

  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 6400, background: 'rgba(5,7,10,0.97)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()}
        style={{ ...glass, margin: 8, marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
          width: 'calc(100% - 16px)', maxHeight: 'calc(100% - env(safe-area-inset-top, 0px) - 74px)', overflowY: 'auto',
          borderRadius: 38, padding: '14px 20px 20px', boxSizing: 'border-box' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {has ? (
            <button onClick={() => onShare && onShare(badge, award, 'story')} aria-label="Share badge" style={circleBtn}>
              <ShareIcon c={SUB} />
            </button>
          ) : <span />}
          <button onClick={onClose} aria-label="Close" style={circleBtn}><CloseIcon c={SUB} /></button>
        </div>

        {/* the coin — physics spin on open, drag to spin, tap to flip */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: -8 }}>
          <SpinBadge badge={badge} struck={has} size={196} spinKey={has ? 'struck' : 'open'} />
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, margin: '18px 0 0', color: TXT }}>{badge.name}</h2>
          <p style={{ fontSize: 14, color: SUB, margin: '4px 0 0' }}>{badge.main ? t('Main spot') : badge.category}{badge.season ? ` · ${t('Seasonal')}` : ''}</p>
          <p style={{ fontSize: 14, color: SUB, margin: '10px 0 0' }}>{status}</p>
        </div>

        {has && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 2px' }}>
              <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, color: TXT }}>{t('Your photos')}</span>
              <span style={{ fontSize: 13, color: SUB }}>{photo ? 1 : 0}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 10, scrollbarWidth: 'none' }}>
              {photo && <img src={photo} alt="" style={{ flex: '0 0 auto', width: 92, height: 122, objectFit: 'cover', borderRadius: 16 }} />}
              <div style={{ flex: '0 0 auto', width: 92, height: 122, borderRadius: 16,
                background: 'rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                color: FAINT, fontSize: 12, fontWeight: 600 }}>
                <CameraIcon c={FAINT} />
                {t('On site only')}
              </div>
            </div>
            {!near && dist != null && (
              <p style={{ fontSize: 12.5, color: SUB, margin: '10px 2px 0', lineHeight: 1.45 }}>
                {t('You can add photos here when you\'re within')} {collectRadius(badge)} m. {t("You're")} {fmtDist(dist)} {t('away')}.
              </p>
            )}
          </div>
        )}

        {has && (
          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '0 2px' }}>
              <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, color: TXT }}>{t('Visibility')}</span>
              <div style={{ display: 'flex', width: 190, background: 'rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35)', borderRadius: 999, padding: 4 }}>
                {['public', 'private'].map(v => (
                  <button key={v} onClick={() => onVisibility(v)}
                    style={{ flex: 1, border: 'none', borderRadius: 999, padding: '8px 6px', fontFamily: 'inherit', cursor: 'pointer',
                      fontSize: 13, fontWeight: vis === v ? 600 : 500,
                      background: vis === v ? 'rgba(255,255,255,0.18)' : 'none',
                      boxShadow: vis === v ? 'inset 0 1px 0 rgba(255,255,255,0.14)' : 'none',
                      color: vis === v ? TXT : SUB, whiteSpace: 'nowrap' }}>
                    {t(v === 'public' ? 'Public' : 'Private')}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: SUB, margin: '8px 2px 0', lineHeight: 1.45 }}>
              {vis === 'public'
                ? `${t('People at')} ${badge.name} ${t('can see your badge and photos while they\'re there.')}`
                : t('Only you can see this badge. You can still share it to your stories.')}
            </p>
          </div>
        )}

        {/* At this spot — locked in the prototype */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 2px' }}>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, color: TXT }}>{t('At this spot')}</span>
            <span style={{ fontSize: 12.5, color: SUB }}>{t('Only visible here')}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            borderRadius: 18, padding: '13px 14px', marginTop: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
            <LockIcon c={SUB} />
            <span style={{ fontSize: 13, color: SUB, lineHeight: 1.45 }}>
              {t("Other people's public badges and photos show up here while you're at")} {badge.name}.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
          {!has && near && open && (
            <button onClick={onTakePhoto}
              style={{ background: 'linear-gradient(135deg,#F6E39B,#E3C36B 60%,#C9A227)', color: '#1A1405',
                fontSize: 15, fontWeight: 800, padding: '14px 0', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CameraIcon c="#1A1405" /> {t('Take photo')}
            </button>
          )}
          <div style={{ display: 'flex', gap: 9 }}>
            <button onClick={onAddToRoute}
              style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: TXT,
                fontSize: 14, fontWeight: 700, padding: '13px 0', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('Add to route')}
            </button>
            <button onClick={onShowOnMap}
              style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: TXT,
                fontSize: 14, fontWeight: 700, padding: '13px 0', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('Show on map')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
