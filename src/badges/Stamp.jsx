// ── Postage-stamp rendering (spec §9) ───────────────────────────────────────
// Cream paper, perforated edges (SVG mask), 3:4 photo, three-line caption.
import React from 'react'

export default function Stamp({ src, place, owner, width = 110, date = '' }) {
  const uid = React.useId().replace(/[:]/g, '')
  const W = 100, H = 138 // stamp units: photo 3:4 + caption band
  const notches = []
  const R = 2.6, STEP = 7.4
  for (let x = STEP / 2; x < W; x += STEP) { notches.push([x, 0]); notches.push([x, H]) }
  for (let y = STEP / 2; y < H; y += STEP) { notches.push([0, y]); notches.push([W, y]) }
  return (
    <svg width={width} height={width * H / W} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.35))', flexShrink: 0 }}>
      <defs>
        <mask id={`m${uid}`}>
          <rect width={W} height={H} fill="#fff" />
          {notches.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={R} fill="#000" />)}
        </mask>
        <clipPath id={`c${uid}`}><rect x="7" y="7" width={W - 14} height={(W - 14) * 4 / 3} /></clipPath>
      </defs>
      <g mask={`url(#m${uid})`}>
        <rect width={W} height={H} fill="#F4EFE4" />
      </g>
      {src
        ? <image href={src} x="7" y="7" width={W - 14} height={(W - 14) * 4 / 3} preserveAspectRatio="xMidYMid slice" clipPath={`url(#c${uid})`} />
        : <rect x="7" y="7" width={W - 14} height={(W - 14) * 4 / 3} fill="#D8D2C6" />}
      <rect x="7" y="7" width={W - 14} height={(W - 14) * 4 / 3} fill="none" stroke="rgba(29,33,40,0.25)" strokeWidth="0.7" />
      <text x="9" y={H - 20} fontFamily="-apple-system, sans-serif" fontSize="6.6" fontWeight="700" fill="#1D2128">
        {place.length > 24 ? place.slice(0, 23) + '…' : place}
      </text>
      <text x="9" y={H - 12.5} fontFamily="-apple-system, sans-serif" fontSize="5.4" fill="#4E545D">{owner}{date ? ` · ${date}` : ''}</text>
      <text x="9" y={H - 5.5} fontFamily="-apple-system, sans-serif" fontSize="4.6" fill="#8A8F96">Taken on NYC Stoop</text>
    </svg>
  )
}
