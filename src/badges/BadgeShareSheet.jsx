// ── Share sheet (mockup §Share) ─────────────────────────────────────────────
// Three preview cards — Story · Stamp · Photo — with the image pre-rendered
// as soon as a mode is picked, so the system share sheet opens instantly on
// iOS (user-gesture rule). Gold button shares; download fallback on desktop.
import React from 'react'
import { t } from '../lib/i18n.js'
import { getUser } from '../auth/api.js'
import Stamp from './Stamp.jsx'
import Medallion from './Medallion.jsx'
import { renderStory, renderStampPng, photoBlob, shareBlob } from './story.js'

const TXT = '#F2F4F7'
const SUB = 'rgba(235,240,245,0.62)'
const GOLD = '#E3C36B'

export const awardPhotoSrc = (a) => a && (a.image_url || (a.image_b64 ? 'data:image/jpeg;base64,' + a.image_b64 : null)
  || a.thumb_url || (a.thumb_b64 ? 'data:image/jpeg;base64,' + a.thumb_b64 : null))

export default function BadgeShareSheet({ badge, award, initial = 'story', progressLine, onClose }) {
  const photoSrc = awardPhotoSrc(award)
  const modes = photoSrc ? ['story', 'stamp', 'photo'] : ['story']
  const [mode, setMode] = React.useState(modes.includes(initial) ? initial : 'story')
  const [blob, setBlob] = React.useState(null)
  const [saved, setSaved] = React.useState(false)
  const [err, setErr] = React.useState('')
  const me = getUser()?.display_name || 'Me'
  const dateLabel = (award?.created_at || '').slice(0, 10)

  React.useEffect(() => {
    let live = true
    setBlob(null); setErr('')
    const job = mode === 'story'
      ? renderStory({ badge, photoSrc, owner: me, dateLabel, progressLine })
      : mode === 'stamp' ? renderStampPng({ badgeName: badge.name, photoSrc, owner: me })
      : photoBlob(photoSrc)
    job.then(b => { if (live) setBlob(b) }).catch(() => { if (live) setErr(t("Couldn't prepare this image.")) })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const doShare = async () => {
    if (!blob) return
    const result = await shareBlob(blob, `nyc-stoop-${badge.id}-${mode}.png`, badge.name)
    if (result === 'shared') onClose()
    else if (result === 'downloaded') setSaved(true)
  }

  const label = { story: t('Story'), stamp: t('Stamp'), photo: t('Photo') }
  const hint = { story: t('Sized for Instagram and other stories'), stamp: t('Your photo as a postage stamp'), photo: t('The original photo') }

  const preview = (m) => {
    if (m === 'story') return (
      <div style={{ width: 84, height: 150, borderRadius: 8, background: 'linear-gradient(180deg,#151C2B,#06080C)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, position: 'relative', overflow: 'hidden' }}>
        <div style={{ transform: 'rotate(-3deg)' }}>
          {photoSrc ? <Stamp src={photoSrc} place={badge.name} owner={me} width={52} /> : <Medallion badge={badge} size={52} struck />}
        </div>
        {photoSrc && <div style={{ position: 'absolute', right: 8, bottom: 30 }}><Medallion badge={badge} size={28} struck /></div>}
        <div style={{ fontSize: 5.5, color: TXT, fontWeight: 700 }}>{badge.name}</div>
        <div style={{ fontSize: 4.5, color: GOLD }}>NYC STOOP · BADGES</div>
      </div>
    )
    if (m === 'stamp') return <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.45))' }}><Stamp src={photoSrc} place={badge.name} owner={me} width={96} /></div>
    return <img src={photoSrc} alt="" style={{ height: 148, borderRadius: 8, objectFit: 'cover', maxWidth: 100 }} />
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 7000, background: 'rgba(9,13,19,0.55)', display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()}
        style={{ margin: 8, width: 'calc(100% - 16px)', borderRadius: 34, padding: '18px 14px calc(env(safe-area-inset-bottom, 0px) + 16px)',
          background: 'rgba(22,27,35,0.95)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.09)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 -12px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
          <span>
            <span style={{ display: 'block', fontSize: 19, fontWeight: 800, color: TXT }}>{t('Share')}</span>
            <span style={{ fontSize: 13, color: SUB }}>{badge.name}</span>
          </span>
          <button onClick={onClose} aria-label="Close share"
            style={{ width: 34, height: 34, borderRadius: 17, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)',
              color: SUB, fontSize: 14, cursor: 'pointer' }}>✕</button>
        </div>

        {saved ? (
          <div style={{ textAlign: 'center', margin: '16px 6px 4px', fontSize: 13, color: SUB, lineHeight: 1.5 }}>
            {t('Saved to your downloads.')}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {modes.map(m => (
                <button key={m} onClick={() => setMode(m)}
                  style={{ flex: 1, minWidth: 0, background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none',
                    borderRadius: 20, padding: '12px 6px 10px', cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: mode === m ? `inset 0 0 0 1.5px ${GOLD}` : 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ height: 152, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{preview(m)}</div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: mode === m ? TXT : SUB }}>{label[m]}</span>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: SUB, margin: '12px 6px 0', textAlign: 'center' }}>{hint[mode]}</div>
          </>
        )}
        {err && <div style={{ fontSize: 13, color: '#E08A7A', margin: '10px 6px 0' }}>{err}</div>}
        <div style={{ marginTop: 14 }}>
          {saved ? (
            <button onClick={onClose}
              style={{ width: '100%', padding: '14px 0', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.08)', color: TXT, fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              {t('Done')}
            </button>
          ) : (
            <button onClick={doShare} disabled={!blob}
              style={{ width: '100%', padding: '14px 0', borderRadius: 999, border: 'none',
                background: blob ? 'linear-gradient(135deg,#F6E39B,#E3C36B 60%,#C9A227)' : 'rgba(255,255,255,0.1)',
                color: blob ? '#1A1405' : SUB, fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
              ↥ {blob ? `${t('Share')} ${label[mode].toLowerCase()}` : t('Preparing…')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
