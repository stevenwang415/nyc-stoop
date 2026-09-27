// ── The door: a struck medallion floating on the main Map tab ──────────────
// The only badge element on the guide map (spec §2.1). Shows the live count.
import React from 'react'
import { BADGES } from './catalog.js'
import { myAwards } from './badgesApi.js'

const SERIF = "Didot, 'Bodoni 72', 'Times New Roman', serif"

export default function BadgeDoor({ onOpen }) {
  const [count, setCount] = React.useState(null)
  React.useEffect(() => {
    let dead = false
    myAwards().then(r => { if (!dead) setCount(r.awards.length) }).catch(() => {})
    return () => { dead = true }
  }, [])

  return (
    <button onClick={onOpen} aria-label="Badges"
      // Top-right of the map, tucked under the search bar — clear of the
      // bottom sheet at every detent (device report 2026-09-27).
      style={{ position: 'fixed', right: 12, top: 'calc(env(safe-area-inset-top, 0px) + 216px)',
        zIndex: 210, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        filter: 'drop-shadow(0 6px 14px rgba(23,19,15,0.35)) drop-shadow(0 0 14px rgba(201,162,39,0.45))' }}>
      <svg width="58" height="58" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="doorRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F6E39B" /><stop offset="0.38" stopColor="#C9A227" />
            <stop offset="0.72" stopColor="#6B5210" /><stop offset="1" stopColor="#C9A227" />
          </linearGradient>
          <radialGradient id="doorFace" cx="0.34" cy="0.26" r="0.9">
            <stop offset="0" stopColor="#F6E39B" /><stop offset="0.55" stopColor="#C9A227" /><stop offset="1" stopColor="#8A6A15" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="49" fill="url(#doorRim)" />
        <circle cx="50" cy="50" r="43" fill="url(#doorFace)" />
        <circle cx="50" cy="50" r="33.5" fill="none" stroke="#4A3806" strokeWidth="1.4" opacity="0.55" />
        <path id="doorArc" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
        <text fontFamily={SERIF} fontSize="10" letterSpacing="2.4" fill="#4A3806">
          <textPath href="#doorArc" startOffset="50%" textAnchor="middle">BADGES</textPath>
        </text>
        <g transform="translate(50,57)">
          <g stroke="#4A3806" strokeWidth="3" fill="none" transform="translate(0,1.3)" opacity="0.8" strokeLinecap="round">
            <path d="M-16 8 V-6 M-8 8 V-14 M0 8 V-22 M0 -22 L0 -27 M8 8 V-10 M16 8 V-2 M-20 8 H20" />
          </g>
          <g stroke="#F6E39B" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M-16 8 V-6 M-8 8 V-14 M0 8 V-22 M0 -22 L0 -27 M8 8 V-10 M16 8 V-2 M-20 8 H20" />
          </g>
        </g>
        <text x="50" y="88" fontFamily={SERIF} fontSize="7" letterSpacing="2" fill="#4A3806" textAnchor="middle">
          {count == null ? '★ ★' : `★ ${count} / ${BADGES.length} ★`}
        </text>
      </svg>
    </button>
  )
}
