// ── 3D spinning coin (ported from the mockup) ───────────────────────────────
// Physics: intro coast spin (decaying velocity, snaps to a full turn), drag to
// spin with flick momentum, tap flips to the engraved back. The coin has real
// thickness (stacked edge layers), a moving sheen, and a contact shadow that
// narrows as it turns edge-on.
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FINISHES } from './catalog.js'
import { getUser } from '../auth/api.js'
import Medallion from './Medallion.jsx'

const SERIF = "Didot, 'Bodoni 72', 'Times New Roman', serif"
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

function mixHex(a, b, t) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16))
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')
}

export function MedallionBack({ badge, struck, size }) {
  const uid = React.useId().replace(/[:]/g, '')
  if (!struck) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }} aria-hidden="true">
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(235,240,245,0.3)" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(235,240,245,0.2)" strokeWidth="0.8" strokeDasharray="1.5 2.5" />
      </svg>
    )
  }
  const f = FINISHES[badge.finish] || FINISHES.brass
  const name = (getUser()?.display_name || 'YOU').toUpperCase()
  const fs = name.length > 8 ? 9 : 11.5
  const ls = name.length > 8 ? 1.6 : 2.6
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }} role="img" aria-label={`Engraved: ${name}`}>
      <defs>
        <linearGradient id={`sr${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={f.hi} /><stop offset="0.38" stopColor={f.base} />
          <stop offset="0.72" stopColor={f.shadow} /><stop offset="1" stopColor={f.base} />
        </linearGradient>
        <radialGradient id={`sf${uid}`} cx="0.34" cy="0.26" r="0.9">
          <stop offset="0" stopColor={f.hi} /><stop offset="0.55" stopColor={f.base} /><stop offset="1" stopColor={f.shadow} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill={`url(#sr${uid})`} />
      <circle cx="50" cy="50" r="43" fill={`url(#sf${uid})`} />
      <circle cx="50" cy="50" r="43" fill="none" stroke={f.shadow} strokeWidth="0.8" opacity="0.7" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={f.shadow} strokeWidth="0.5" opacity="0.35" />
      {/* engraved: light lip below, dark cut on top */}
      <text x={50 + ls / 2} y={54.6} textAnchor="middle" fontFamily={SERIF} fontSize={fs} letterSpacing={ls} fill={f.hi} opacity="0.55">{name}</text>
      <text x={50 + ls / 2} y={54} textAnchor="middle" fontFamily={SERIF} fontSize={fs} letterSpacing={ls} fill={f.ink} opacity="0.9">{name}</text>
    </svg>
  )
}

export default function SpinBadge({ badge, struck, size = 196, spinKey = 'open' }) {
  const [angle, setAngle] = useState(0)
  const a = useRef(0), v = useRef(0), raf = useRef(0)
  const mode = useRef('idle'), target = useRef(0), unit = useRef(180)
  const drag = useRef(null), moved = useRef(false)

  const f = FINISHES[badge.finish] || FINISHES.brass
  const half = struck ? Math.max(4, Math.round(size * 0.034)) : 0.5

  const tick = () => {
    if (mode.current === 'coast') {
      a.current += v.current
      v.current *= 0.955
      if (Math.abs(v.current) < 1.1) {
        mode.current = 'snap'
        target.current = Math.round(a.current / unit.current) * unit.current
      }
    } else if (mode.current === 'snap') {
      const d = target.current - a.current
      v.current = (v.current + d * 0.07) * 0.8
      a.current += v.current
      if (Math.abs(d) < 0.15 && Math.abs(v.current) < 0.15) { a.current = target.current; mode.current = 'idle' }
    }
    setAngle(a.current)
    if (mode.current === 'coast' || mode.current === 'snap') raf.current = requestAnimationFrame(tick)
  }
  const run = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(tick) }

  // intro spin when opened, and again when the badge gets struck
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    a.current = a.current % 360
    v.current = spinKey === 'struck' ? 30 : 20
    unit.current = 360
    mode.current = 'coast'
    run()
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey])

  const down = (e) => {
    cancelAnimationFrame(raf.current)
    mode.current = 'drag'
    moved.current = false
    drag.current = { x: e.clientX, a0: a.current, lx: e.clientX, lt: performance.now() }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) moved.current = true
    const now = performance.now()
    const dt = Math.max(8, now - d.lt)
    v.current = ((e.clientX - d.lx) * 0.75 * 16.7) / dt
    d.lx = e.clientX; d.lt = now
    a.current = d.a0 + dx * 0.75
    setAngle(a.current)
  }
  const up = () => {
    if (!drag.current) return
    drag.current = null
    unit.current = 180
    if (moved.current) {
      v.current = clamp(v.current, -45, 45)
      mode.current = 'coast'
    } else {
      // tap flips it over
      target.current = (Math.round(a.current / 180) + 1) * 180
      v.current = 0
      mode.current = 'snap'
    }
    run()
  }

  const rad = (angle * Math.PI) / 180
  const facing = Math.abs(Math.cos(rad))
  const light = 0.72 + 0.28 * facing
  const sheenPos = 50 + Math.sin(rad) * 60
  const layers = struck ? 16 : 0

  const faceStyle = (back) => ({
    position: 'absolute', inset: 0,
    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
    transform: `${back ? 'rotateY(180deg) ' : ''}translateZ(${half}px)`,
    filter: struck ? `brightness(${light})` : undefined,
  })
  const sheen = struck && (
    <div style={{
      position: 'absolute', left: '1%', top: '1%', width: '98%', height: '98%', borderRadius: '50%', pointerEvents: 'none',
      background: 'linear-gradient(105deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0) 65%)',
      backgroundSize: '300% 100%', backgroundPosition: `${sheenPos}% 0`,
    }} />
  )

  return (
    <div style={{ position: 'relative', width: size, height: size + 26 }}>
      <div
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        role="button" tabIndex={0} aria-label={`Spin the ${badge.name} badge`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); unit.current = 180; target.current = (Math.round(a.current / 180) + 1) * 180; mode.current = 'snap'; run() } }}
        style={{ width: size, height: size, perspective: size * 4, touchAction: 'none', cursor: 'grab', outline: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateY(${angle}deg)` }}>
          {Array.from({ length: layers }).map((_, i) => {
            const t = i / (layers - 1)
            const round = 1 - Math.abs(2 * t - 1) // bright in the middle of the edge
            const c = mixHex(f.shadow, f.hi, 0.15 + round * 0.55)
            return (
              <div key={i} style={{
                position: 'absolute', left: '1%', top: '1%', width: '98%', height: '98%', borderRadius: '50%',
                background: c, transform: `translateZ(${-half + 2 * half * t}px)`,
              }} />
            )
          })}
          <div style={faceStyle(false)}>
            <Medallion badge={badge} size={size} struck={struck} />
            {sheen}
          </div>
          <div style={faceStyle(true)}>
            <MedallionBack badge={badge} struck={struck} size={size} />
            {sheen}
          </div>
        </div>
      </div>
      {/* contact shadow narrows as the coin turns edge-on */}
      {struck && (
        <div style={{
          position: 'absolute', left: '50%', bottom: 0, width: size * 0.62, height: 14, marginLeft: -size * 0.31,
          borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0))',
          transform: `scaleX(${0.18 + 0.82 * facing})`, pointerEvents: 'none',
        }} />
      )}
    </div>
  )
}
