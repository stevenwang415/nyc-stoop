// ── 'Today in NYC' strip (2026-09-26) ───────────────────────────────────────
// One live-camera photo per person per ET day, one reshoot before posting.
// Self-contained: fetches its own data, owns the camera + preview + post flow,
// so it can sit on the Explore home page AND in the Stoop tab's From friends.
// capture="environment" opens the camera directly on iOS — no library picker,
// which is what keeps "today" honest.
import React from 'react'
import { t } from '../lib/i18n.js'
import { isSignedIn } from '../auth/api.js'
import {
  myPhotos, friendsFeed, createPhoto, thumbSrc, prepareImage, deviceLocation,
} from './shareApi.js'

const todayET = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })

export default function TodayStrip({ onOpenPhoto = null, onPosted = null, wrapStyle = {}, size = 48 }) {
  const signedIn = isSignedIn()
  const [mine, setMine] = React.useState([])
  const [feed, setFeed] = React.useState([])
  const [shot, setShot] = React.useState(null) // { f, url, retaken }
  const [posting, setPosting] = React.useState(false)
  const [msg, setMsg] = React.useState('')
  const inputRef = React.useRef(null)

  React.useEffect(() => {
    if (!signedIn) return
    let dead = false
    myPhotos().then(r => { if (!dead) setMine(r.photos) }).catch(() => {})
    friendsFeed().then(r => { if (!dead) setFeed(r.photos) }).catch(() => {})
    return () => { dead = true }
  }, [signedIn])

  if (!signedIn) return null
  const td = todayET()
  const myToday = mine.find(p => p.today_date === td)
  const friendsToday = feed.filter(p => p.today_date === td)

  const onFile = (e) => {
    const f = e.target.files?.[0]; e.target.value = ''
    if (!f) return
    setShot(prev => ({ f, url: URL.createObjectURL(f), retaken: !!prev }))
  }

  const post = async () => {
    if (!shot || posting) return
    setPosting(true); setMsg('')
    try {
      const { image_b64, thumb_b64 } = await prepareImage(shot.f)
      const loc = await deviceLocation().catch(() => null)
      const r = await createPhoto({
        anchor_type: 'moment', area_label: 'NYC', kind: 'vibe', caption: null,
        lat: loc?.lat ?? null, lng: loc?.lng ?? null,
        image_b64, thumb_b64, today: true,
      })
      setMine(m => [r.photo, ...m])
      setShot(null)
      if (onPosted) onPosted(r.photo)
    } catch (e) {
      setMsg(e.status === 409 ? t('You already posted today — see you tomorrow!') : (e.message || t('Something went wrong. Please try again.')))
    } finally { setPosting(false) }
  }

  // Columns align flex-start so the FIRST circle's left edge lines up exactly
  // with the page content edge (search bar, hero card) — no centering inset.
  const col = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit',
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, flexShrink: 0, width: size + 10 }
  const label = { fontSize: 10, color: 'var(--gray-600)', fontWeight: 600, maxWidth: size + 10,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

  return (
    <div style={wrapStyle}>
      <input ref={inputRef} type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={onFile} />
      <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', letterSpacing: '0.02em', padding: '0 0 8px' }}>
        {t('Today in NYC')}
      </div>
      <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
        <button style={col}
          onClick={() => { if (myToday) { if (onOpenPhoto) onOpenPhoto(myToday, true) } else inputRef.current?.click() }}>
          {myToday
            ? <img src={thumbSrc(myToday)} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid var(--accent, #C8321A)' }} />
            : <span style={{ width: size, height: size, borderRadius: '50%', border: '2px dashed var(--gray-400)', boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--gray-500)' }}>＋</span>}
          <span style={label}>{myToday ? t('You') : t('Add yours')}</span>
        </button>
        {friendsToday.map(p => (
          <button key={'td' + p.id} style={col} onClick={() => { if (onOpenPhoto) onOpenPhoto(p, false) }}>
            <img src={thumbSrc(p)} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid var(--accent, #C8321A)' }} />
            <span style={label}>{p.author?.display_name}</span>
          </button>
        ))}
      </div>
      {msg && <div style={{ fontSize: 12, color: '#B3261E', padding: '4px 0 2px' }}>{msg}</div>}
      {shot && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(12,10,8,0.93)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
          <img src={shot.url} alt="" style={{ maxWidth: '100%', maxHeight: '68vh', borderRadius: 14, objectFit: 'contain' }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 18, width: '100%', maxWidth: 380 }}>
            {!shot.retaken && (
              <button onClick={() => inputRef.current?.click()} disabled={posting}
                style={{ flex: 1, padding: '12px 0', borderRadius: 999, border: '1.5px solid #EDE6D6', background: 'none',
                  color: '#EDE6D6', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {t('Reshoot (1 left)')}
              </button>
            )}
            <button onClick={post} disabled={posting}
              style={{ flex: 1, padding: '12px 0', borderRadius: 999, border: 'none', background: 'var(--accent, #C8321A)',
                color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer', opacity: posting ? 0.6 : 1 }}>
              {posting ? t('Posting…') : t('Use photo')}
            </button>
          </div>
          {shot.retaken && <div style={{ marginTop: 10, fontSize: 12, color: '#B9AE9C' }}>{t('That was your reshoot — this one counts.')}</div>}
          <button onClick={() => { if (!posting) setShot(null) }} aria-label="Close"
            style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', right: 16, background: 'none',
              border: 'none', color: '#EDE6D6', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  )
}
