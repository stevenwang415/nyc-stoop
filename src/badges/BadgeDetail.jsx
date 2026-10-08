// ── Badge detail sheet (mockup-exact) ───────────────────────────────────────
// Floating rounded card: share/✕ circles, the SpinBadge (physics intro spin,
// drag to spin, tap to flip), name + category + gold status, Your photos with
// count + on-site tile, Visibility with segmented control + caption, locked
// "At this spot", then Take photo / Add to route / Show on map.
import React from 'react'
import { t, dateLocale } from '../lib/i18n.js'
import { parseUTC } from '../lib/dates.js'
import { fmtDist, collectRadius, seasonOpen, badgeName } from './catalog.js'
import SpinBadge from './SpinBadge.jsx'
import { badgePhotos, badgeFriends } from './badgesApi.js'
import { awardPhotoSrc } from './BadgeShareSheet.jsx'
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
  const d = parseUTC(iso)
  return d ? d.toLocaleDateString(dateLocale(), { month: 'short', day: 'numeric' }) : (iso || '').slice(0, 10)
}

export default function BadgeDetail({ badge, award, dist, onClose, onTakePhoto, onVisibility, onAddToRoute, onShowOnMap, onShare, onAddPhoto, photosBump }) {
  const [planAdded, setPlanAdded] = React.useState(false)
  // Badge → Planner bridge (2026-10-09): a badge is a place, so it rides the
  // same nyc-add-to-planner event the feed uses — dedup + save handled there.
  const addToPlanner = () => {
    try {
      window.dispatchEvent(new CustomEvent('nyc-add-to-planner', {
        detail: { name: badge.name, lat: badge.lat, lng: badge.lng },
      }))
      setPlanAdded(true)
    } catch {}
  }
  const has = !!award
  // Extra photos (mine) + friends' public photos here — the location gate is
  // on ADDING, not viewing (product call 2026-10-10).
  const [extraPhotos, setExtraPhotos] = React.useState([])
  const [friendsHere, setFriendsHere] = React.useState(null)
  React.useEffect(() => {
    let dead = false
    if (has) badgePhotos(badge.id).then(r => { if (!dead) setExtraPhotos(r.photos || []) }).catch(() => {})
    badgeFriends(badge.id).then(r => { if (!dead) setFriendsHere(r.friends || []) }).catch(() => { if (!dead) setFriendsHere([]) })
    return () => { dead = true }
  }, [badge.id, has, photosBump])
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
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, margin: '18px 0 0', color: TXT }}>{badgeName(badge)}</h2>
          <p style={{ fontSize: 14, color: SUB, margin: '4px 0 0' }}>{badge.main ? t('Main spot') : badge.category}{badge.season ? ` · ${t('Seasonal')}` : ''}</p>
          <p style={{ fontSize: 14, color: SUB, margin: '10px 0 0' }}>{status}</p>
        </div>

        {has && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 2px' }}>
              <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, color: TXT }}>{t('Your photos')}</span>
              <span style={{ fontSize: 13, color: SUB }}>{(photo ? 1 : 0) + extraPhotos.length}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 10, scrollbarWidth: 'none' }}>
              {photo && <img src={photo} alt="" style={{ flex: '0 0 auto', width: 92, height: 122, objectFit: 'cover', borderRadius: 16 }} />}
              {extraPhotos.map(p => (
                <img key={p.id} src={awardPhotoSrc(p)} alt="" style={{ flex: '0 0 auto', width: 92, height: 122, objectFit: 'cover', borderRadius: 16 }} />
              ))}
              <button onClick={near ? onAddPhoto : undefined} disabled={!near}
                style={{ flex: '0 0 auto', width: 92, height: 122, borderRadius: 16, border: 'none',
                  background: near ? 'rgba(227,195,107,0.14)' : 'rgba(255,255,255,0.05)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)', fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                  color: near ? GOLD : FAINT, fontSize: 12, fontWeight: 600, cursor: near ? 'pointer' : 'default' }}>
                <CameraIcon c={near ? GOLD : FAINT} />
                {near ? t('Add photo') : t('On site only')}
              </button>
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
                ? `${t('People at')} ${badgeName(badge)} ${t('can see your badge and photos while they\'re there.')}`
                : t('Only you can see this badge. You can still share it to your stories.')}
            </p>
          </div>
        )}

        {/* Friends here — friends' public badges, viewable from anywhere */}
        {friendsHere != null && (
          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 2px' }}>
              <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, color: TXT }}>{t('Friends here')}</span>
              <span style={{ fontSize: 12.5, color: SUB }}>{friendsHere.length || ''}</span>
            </div>
            {friendsHere.length === 0 ? (
              <p style={{ fontSize: 12.5, color: FAINT, margin: '8px 2px 0' }}>{t('No friends have collected this yet.')}</p>
            ) : (
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginTop: 10, scrollbarWidth: 'none' }}>
                {friendsHere.map((f, i) => (
                  <div key={i} style={{ flex: '0 0 auto', width: 92, textAlign: 'center' }}>
                    <img src={awardPhotoSrc(f)} alt="" style={{ width: 92, height: 122, objectFit: 'cover', borderRadius: 16 }} />
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: TXT, marginTop: 5, whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.user?.display_name || ''}</div>
                    <div style={{ fontSize: 10.5, color: SUB }}>{fmtWhen(f.created_at)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
          {!has && near && open && (
            <button onClick={onTakePhoto}
              style={{ background: 'linear-gradient(135deg,#F6E39B,#E3C36B 60%,#C9A227)', color: '#1A1405',
                fontSize: 15, fontWeight: 800, padding: '14px 0', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CameraIcon c="#1A1405" /> {t('Take photo')}
            </button>
          )}
          <button onClick={addToPlanner} disabled={planAdded}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              color: planAdded ? GOLD : TXT, fontSize: 14, fontWeight: 700, padding: '13px 0',
              borderRadius: 999, cursor: planAdded ? 'default' : 'pointer', fontFamily: 'inherit' }}>
            {planAdded ? `${t('Added to Planner')} ✓` : `＋ ${t('Add to Planner')}`}
          </button>
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
