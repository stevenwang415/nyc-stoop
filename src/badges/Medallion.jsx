// ── Medallion renderer (spec §8) ────────────────────────────────────────────
// One programmatic recipe for every badge: rim gradient → face gradient →
// inner ring → serif arc name → engraved glyph → bottom text. Designers only
// ever supply the glyph path; struck/outline states and finishes come free.
import React from 'react'
import { FINISHES } from './catalog.js'

const SERIF = "Didot, 'Bodoni 72', 'Times New Roman', serif"

export default function Medallion({ badge, size = 64, struck = true, spinning = false }) {
  const f = FINISHES[badge.finish] || FINISHES.brass
  const uid = React.useId().replace(/[:]/g, '')
  const arcId = `arc${uid}`
  const bottom = badge.main ? '★ MAIN ★' : 'MANHATTAN'

  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={spinning ? { animation: 'badge-strike-spin 2s cubic-bezier(0.25,0.7,0.3,1)' } : undefined}>
      <defs>
        <linearGradient id={`rim${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={f.hi} /><stop offset="0.38" stopColor={f.base} />
          <stop offset="0.72" stopColor={f.shadow} /><stop offset="1" stopColor={f.base} />
        </linearGradient>
        <radialGradient id={`face${uid}`} cx="0.34" cy="0.26" r="0.9">
          <stop offset="0" stopColor={f.hi} /><stop offset="0.55" stopColor={f.base} />
          <stop offset="1" stopColor={f.shadow} />
        </radialGradient>
      </defs>
      {struck ? (
        <>
          <circle cx="50" cy="50" r="49" fill={`url(#rim${uid})`} />
          <circle cx="50" cy="50" r="43" fill={`url(#face${uid})`} />
          <circle cx="50" cy="50" r="33.5" fill="none" stroke={f.ink} strokeWidth="1.4" opacity="0.55" />
          <path id={arcId} d="M 21 50 A 29 29 0 0 1 79 50" fill="none" />
          <text fontFamily={SERIF} fontSize={badge.short.length > 11 ? 7.6 : 9} letterSpacing="1.8" fill={f.ink}>
            <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">{badge.short}</textPath>
          </text>
          <g transform="translate(50,56)">
            <path d={badge.glyph} stroke={f.ink} strokeWidth="3" fill="none" transform="translate(0,1.3)" opacity="0.8" strokeLinecap="round" />
            <path d={badge.glyph} stroke={f.hi} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
          <text x="50" y="88" fontFamily={SERIF} fontSize="6.8" letterSpacing="2" fill={f.ink} textAnchor="middle">{bottom}</text>
        </>
      ) : (
        <>
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="2" />
          <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="1.3" strokeDasharray="3.5 4.5" />
          <path id={arcId} d="M 21 50 A 29 29 0 0 1 79 50" fill="none" />
          <text fontFamily={SERIF} fontSize={badge.short.length > 11 ? 7.6 : 9} letterSpacing="1.8" fill="rgba(255,255,255,0.5)">
            <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">{badge.short}</textPath>
          </text>
          <path d={badge.glyph} stroke="rgba(255,255,255,0.62)" strokeWidth="2.6" fill="none" strokeLinecap="round"
            transform="translate(50,56)" />
        </>
      )}
    </svg>
  )
}
