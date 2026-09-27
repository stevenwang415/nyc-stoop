// ── Badge detail sheet (spec §7) ────────────────────────────────────────────
// The spinning badge (tap flips to the engraved back), status, your photo,
// visibility toggle, "At this spot" (locked in the prototype), Add to route,
// Show on map, Take photo when in range, Share story for collected badges.
import React from 'react'
import { t } from '../lib/i18n.js'
import { getUser } from '../auth/api.js'
import { FINISHES, COLLECT_RADIUS_M, fmtDist } from './catalog.js'
import Medallion from './Medallion.jsx'
import { shareStory } from './story.js'

const GOLD = '#E3C36B'
const TXT = '#F2F4F7'
const SUB = 'rgba(235,240,245,0.62)'
const FAINT = 'rgba(235,240,245,0.34)'
const SERIF = "Didot, 'Bodoni 72', 'Times New Roman', serif"
const glass = {
  background: 'rgba(22,27,35,0.94)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 -12px 40px rgba(0,0,0,0.5)',
}

function BadgeBack({ badge, size }) {
  const f = FINISHES[badge.finish] || FINISHES.brass
  const me = (getUser()?.display_name || 'YOU').toUpperCase()
  const uid = React.useId().replace(/[:]/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id={`br${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={f.hi} /><stop offset="0.38" stopColor={f.base} />
          <stop offset="0.72" stopColor={f.shadow} /><stop offset="1" stopColor={f.base} />
        </linearGradient>
        <radialGradient id={`bf${uid}`} cx="0.34" cy="0.26" r="0.9">
          <stop offset="0" stopColor={f.hi} /><stop offset="0.55" stopColor={f.base} /><stop offset="1" stopColor={f.shadow} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill={`url(#br${uid})`} />
      <circle cx="50" cy="50" r="43" fill={`url(#bf${uid})`} />
      <text x="50" y="54" fontFamily={SERIF} fontSize={me.length > 10 ? 8 : 10} letterSpacing="2.5" fill={f.ink} textAnchor="middle">{me}</text>
    </svg>
  )
}

export default function BadgeDetail({ badge, award, dist, onClose, onTakePhoto, onVisibility, onAddToRoute, onShowOnMap, progressLine }) {
  const [flipped, setFlipped] = React.useState(false)
  const [busyShare, setBusyShare] = React.useState(false)
  const has = !!award
  const near = dist != null && dist <= COLLECT_RADIUS_M
  const photo = award && (award.image_url || (award.image_b64 ? 'data:image/jpeg;base64,' + award.image_b64 : null) || award.thumb_url || (award.thumb_b64 ? 'data:image/jpeg;base64,' + award.thumb_b64 : null))

  const doShare = async () => {
    if (busyShare) return
    setBusyShare(true)
    try {
      await shareStory({ badge, photoSrc: photo, owner: getUser()?.display_name || 'Me',
        dateLabel: (award?.created_at || '').slice(0, 10), progressLine })
    } finally { setBusyShare(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 6400, display: 'flex', alignItems: 'flex-end', background: 'rgba(9,13,19,0.6)' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ ...glass, width: '100%', borderRadius: '34px 34px 0 0', padding: '14px 20px calc(env(safe-area-inset-bottom, 0px) + 22px)', maxHeight: '84vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {has ? (
            <button onClick={doShare} disabled={busyShare}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
                width: 40, height: 40, color: TXT, fontSize: 16, cursor: 'pointer', opacity: busyShare ? 0.5 : 1 }}>↥</button>
          ) : <span style={{ width: 40 }} />}
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
            width: 40, height: 40, color: TXT, fontSize: 15, cursor: 'pointer' }}>✕</button>
        </div>

        {/* the spinning badge — tap to flip */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 10px', perspective: 700 }}>
          <button onClick={() => setFlipped(f => !f)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transform: `rotateY(${flipped ? 180 : 0}deg)`, transformStyle: 'preserve-3d',
              transition: 'transform 650ms cubic-bezier(0.3,0.9,0.4,1)' }}>
            <div style={{ backfaceVisibility: 'hidden' }}>
              <Medallion badge={badge} size={190} struck={has} />
            </div>
            <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {has ? <BadgeBack badge={badge} size={190} />
                : <svg width="190" height="190" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" /></svg>}
            </div>
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 21, fontWeight: 800, color: TXT }}>{badge.name}</div>
          <div style={{ fontSize: 13, color: SUB, marginTop: 4 }}>{badge.main ? t('Main spot') : badge.category}</div>
          <div style={{ fontSize: 14, marginTop: 8, fontWeight: 600,
            color: has ? GOLD : near ? GOLD : SUB }}>
            {has ? `${t('Collected')} ${(award.created_at || '').slice(0, 10)}`
              : near ? `${t("You're here")} · ${fmtDist(dist)}`
              : dist != null ? `${fmtDist(dist)} ${t('away')} · ${t('collect within 200 m')}` : t('collect within 200 m')}
          </div>
        </div>

        {has && (
          <>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: TXT, padding: '18px 0 8px' }}>{t('Your photos')}</div>
            <div style={{ display: 'flex', gap: 9, overflowX: 'auto' }}>
              {photo && <img src={photo} alt="" style={{ width: 88, height: 118, objectFit: 'cover', borderRadius: 12 }} />}
              <div style={{ width: 88, height: 118, borderRadius: 12, border: '1.5px dashed rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                fontSize: 10.5, color: FAINT, flexShrink: 0, padding: 6 }}>
                {near ? t('More photos with the full catalog') : t('On site only')}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 4px' }}>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: TXT }}>{t('Visibility')}</span>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 999, padding: 3 }}>
                {['public', 'private'].map(v => (
                  <button key={v} onClick={() => onVisibility(v)}
                    style={{ border: 'none', borderRadius: 999, padding: '7px 15px', fontFamily: 'inherit', cursor: 'pointer',
                      fontSize: 12.5, fontWeight: 700,
                      background: award.visibility === v ? 'rgba(255,255,255,0.18)' : 'none',
                      color: award.visibility === v ? TXT : SUB }}>
                    {t(v === 'public' ? 'Public' : 'Private')}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 12, color: FAINT }}>
              {award.visibility === 'public' ? t('Friends can see this badge on your Stoop.') : t('Only you can see it.')}
            </div>
          </>
        )}

        {/* At this spot — locked in the prototype */}
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.14)',
          borderRadius: 16, padding: '13px 15px', fontSize: 12.5, color: FAINT, lineHeight: 1.5 }}>
          🔒 {t("Friends' public badges and photos show up here while you're at")} {badge.name}. <span style={{ color: FAINT }}>({t('coming with the full catalog')})</span>
        </div>

        <div style={{ display: 'flex', gap: 9, marginTop: 16, flexWrap: 'wrap' }}>
          {!has && near && (
            <button onClick={onTakePhoto}
              style={{ flex: '1 1 100%', background: 'linear-gradient(135deg,#F6E39B,#E3C36B 60%,#C9A227)', color: '#1A1405',
                fontSize: 15, fontWeight: 800, padding: '14px 0', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              📷 {t('Take photo')}
            </button>
          )}
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
  )
}
