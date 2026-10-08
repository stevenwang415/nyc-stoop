// ── Profile badge strip (v3) ────────────────────────────────────────────────
// A horizontal shelf of collected coins on My Stoop and friend profiles —
// the social payoff of the badge system. Self sees all awards; friends see
// public ones only (the backend enforces that in /share/badges/of/).
// Tapping a coin opens a small read-only spotlight (medallion + name + date).
// Lazy-loaded by ShareSheet so badge code stays out of the main bundle.
import React from 'react'
import { t, dateLocale } from '../lib/i18n.js'
import { byId, badgeName } from './catalog.js'
import { myAwards, awardsOf } from './badgesApi.js'
import Medallion from './Medallion.jsx'

const TXT = '#1D2128'
const SUB = '#6B7076'

function fmtWhen(iso) {
  if (!iso) return ''
  const d = new Date(/[zZ]$|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : iso + 'Z')
  return isNaN(d) ? iso.slice(0, 10) : d.toLocaleDateString(dateLocale(), { month: 'short', day: 'numeric' })
}

export default function ProfileBadgeStrip({ userId }) {
  const [awards, setAwards] = React.useState(null)
  const [spot, setSpot] = React.useState(null) // award under the spotlight

  React.useEffect(() => {
    let dead = false
    const p = userId == null ? myAwards() : awardsOf(userId)
    p.then(r => { if (!dead) setAwards(r.awards || []) }).catch(() => { if (!dead) setAwards([]) })
    return () => { dead = true }
  }, [userId])

  const rows = (awards || []).filter(a => byId[a.badge_id])
  if (!rows.length) return null // no badges, no strip — zero clutter

  return (
    <div style={{ padding: '2px 0 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 2px 7px' }}>
        <span style={{ fontSize: 13.5, fontWeight: 800, color: TXT }}>{t('Badges')}</span>
        <span style={{ fontSize: 12, color: SUB }}>{rows.length}</span>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', padding: '0 2px' }}>
        {rows.map(a => {
          const b = byId[a.badge_id]
          return (
            <button key={a.badge_id} onClick={() => setSpot(a)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0, width: 56 }}>
              <Medallion badge={b} size={48} struck />
              <span style={{ fontSize: 9.5, color: SUB, maxWidth: 56, whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis' }}>{badgeName(b)}</span>
            </button>
          )
        })}
      </div>

      {/* spotlight — read-only, tap anywhere to dismiss */}
      {spot && (
        <div onClick={() => setSpot(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 7200, background: 'rgba(9,13,19,0.78)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <Medallion badge={byId[spot.badge_id]} size={200} struck />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#F2F4F7' }}>{badgeName(byId[spot.badge_id])}</div>
            <div style={{ fontSize: 13.5, color: 'rgba(235,240,245,0.62)', marginTop: 4 }}>
              {t('Collected')} {fmtWhen(spot.created_at)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
