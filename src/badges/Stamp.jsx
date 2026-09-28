// ── Postage-stamp rendering (spec §9, matched to the mockup) ────────────────
// Geometry on a 100-unit width: 7-unit margin, 3:4 photo (86 × 114.7), then a
// 26-unit caption band BELOW the photo — name / owner / "Taken on NYC Stoop".
// The frame + perforations are SVG; the photo is a plain HTML <img> overlay
// (Safari renders SVG <image> with EXIF quirks — a real img never tilts).
import React from 'react'

const W = 100
const M = 7
const PW = W - M * 2          // 86
const PH = PW * 4 / 3         // 114.67
const BAND = 26
const H = M + PH + BAND       // 147.67

export default function Stamp({ src, place, owner, width = 110, date = '' }) {
  const uid = React.useId().replace(/[:]/g, '')
  const px = (u) => (u / W) * 100 + '%'   // horizontal percent
  const py = (u) => (u / H) * 100 + '%'   // vertical percent
  const notches = []
  const R = 2.6, STEP = 7.4
  for (let x = STEP / 2; x < W; x += STEP) { notches.push([x, 0]); notches.push([x, H]) }
  for (let y = STEP / 2; y < H; y += STEP) { notches.push([0, y]); notches.push([W, y]) }
  return (
    <div style={{ position: 'relative', width, height: width * H / W, flexShrink: 0,
      filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.35))' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <defs>
          <mask id={`m${uid}`}>
            <rect width={W} height={H} fill="#fff" />
            {notches.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={R} fill="#000" />)}
          </mask>
        </defs>
        <g mask={`url(#m${uid})`}>
          <rect width={W} height={H} fill="#F4EFE4" />
        </g>
        {!src && <rect x={M} y={M} width={PW} height={PH} fill="#D8D2C6" />}
        <rect x={M} y={M} width={PW} height={PH} fill="none" stroke="rgba(29,33,40,0.18)" strokeWidth="0.6" />
        <text x={M} y={M + PH + 8.6} fontFamily="-apple-system, sans-serif" fontSize="6.4" fontWeight="700" fill="#1D2128">
          {place.length > 24 ? place.slice(0, 23) + '…' : place}
        </text>
        <text x={M} y={M + PH + 15.4} fontFamily="-apple-system, sans-serif" fontSize="5" fill="#4E545D">{owner}{date ? ` · ${date}` : ''}</text>
        <text x={M} y={M + PH + 21.6} fontFamily="-apple-system, sans-serif" fontSize="4.2" fill="#8A8F96">Taken on NYC Stoop</text>
      </svg>
      {src && (
        <img src={src} alt="" style={{ position: 'absolute', left: px(M), top: py(M),
          width: px(PW), height: py(PH), objectFit: 'cover', display: 'block' }} />
      )}
    </div>
  )
}
