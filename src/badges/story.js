// ── Story-card rendering (Phase C, spec §9) ─────────────────────────────────
// Draws the 1080×1920 share image on a canvas: gradient background, gold
// glow, the stamp (drawn natively, tilted -3°), the medallion (SVG →
// rasterized), and the caption lines. Shares via the system sheet when the
// browser supports file sharing; otherwise downloads.
import { FINISHES } from './catalog.js'

const SERIF = "Didot, 'Bodoni 72', 'Times New Roman', serif"

function medallionSvgString(badge) {
  const f = FINISHES[badge.finish] || FINISHES.brass
  const bottom = badge.main ? '★ MAIN ★' : 'MANHATTAN'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="330" height="330" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="r" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${f.hi}"/><stop offset=".38" stop-color="${f.base}"/>
        <stop offset=".72" stop-color="${f.shadow}"/><stop offset="1" stop-color="${f.base}"/>
      </linearGradient>
      <radialGradient id="fc" cx=".34" cy=".26" r=".9">
        <stop offset="0" stop-color="${f.hi}"/><stop offset=".55" stop-color="${f.base}"/><stop offset="1" stop-color="${f.shadow}"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="49" fill="url(#r)"/>
    <circle cx="50" cy="50" r="43" fill="url(#fc)"/>
    <circle cx="50" cy="50" r="33.5" fill="none" stroke="${f.ink}" stroke-width="1.4" opacity=".55"/>
    <path id="a" d="M 21 50 A 29 29 0 0 1 79 50" fill="none"/>
    <text font-family="serif" font-size="${badge.short.length > 11 ? 7.6 : 9}" letter-spacing="1.8" fill="${f.ink}">
      <textPath href="#a" startOffset="50%" text-anchor="middle">${badge.short}</textPath></text>
    <g transform="translate(50,56)">
      <path d="${badge.glyph}" stroke="${f.ink}" stroke-width="3" fill="none" transform="translate(0,1.3)" opacity=".8" stroke-linecap="round"/>
      <path d="${badge.glyph}" stroke="${f.hi}" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
    <text x="50" y="88" font-family="serif" font-size="6.8" letter-spacing="2" fill="${f.ink}" text-anchor="middle">${bottom}</text>
  </svg>`
}

function loadImg(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src })
}

export async function renderStory({ badge, photoSrc, owner, dateLabel, progressLine }) {
  const W = 1080, H = 1920
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H
  const ctx = cv.getContext('2d')

  // background
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#151C2B'); g.addColorStop(1, '#06080C')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(540, 720, 60, 540, 720, 620)
  glow.addColorStop(0, 'rgba(201,162,39,0.28)'); glow.addColorStop(1, 'rgba(201,162,39,0)')
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H)

  // header
  ctx.textAlign = 'center'
  ctx.fillStyle = '#E3C36B'; ctx.font = `700 52px ${SERIF}`; ctx.fillText('NYC STOOP · BADGES', 540, 150)
  ctx.fillStyle = 'rgba(235,240,245,0.5)'; ctx.font = '400 34px -apple-system, sans-serif'; ctx.fillText('Manhattan', 540, 205)

  // stamp (tilted −3°)
  if (photoSrc) {
    const img = await loadImg(photoSrc).catch(() => null)
    ctx.save()
    ctx.translate(540, 700); ctx.rotate(-3 * Math.PI / 180)
    const SW = 600, SH = SW * 1.38
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24
    ctx.fillStyle = '#F4EFE4'; ctx.fillRect(-SW / 2, -SH / 2, SW, SH)
    ctx.shadowColor = 'transparent'
    // perforation notches
    ctx.fillStyle = '#0B0F16'
    const step = 44, R = 15
    ctx.globalCompositeOperation = 'destination-out'
    for (let x = -SW / 2 + step / 2; x < SW / 2; x += step) { ctx.beginPath(); ctx.arc(x, -SH / 2, R, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(x, SH / 2, R, 0, 7); ctx.fill() }
    for (let y = -SH / 2 + step / 2; y < SH / 2; y += step) { ctx.beginPath(); ctx.arc(-SW / 2, y, R, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(SW / 2, y, R, 0, 7); ctx.fill() }
    ctx.globalCompositeOperation = 'source-over'
    if (img) {
      const PW = SW - 84, PH = PW * 4 / 3
      const s = Math.max(PW / img.width, PH / img.height)
      ctx.save()
      ctx.beginPath(); ctx.rect(-PW / 2, -SH / 2 + 42, PW, PH); ctx.clip()
      ctx.drawImage(img, -img.width * s / 2, -SH / 2 + 42 + (PH - img.height * s) / 2, img.width * s, img.height * s)
      ctx.restore()
    }
    ctx.fillStyle = '#1D2128'; ctx.font = '700 34px -apple-system, sans-serif'; ctx.textAlign = 'left'
    ctx.fillText(badge.name, -SW / 2 + 46, SH / 2 - 92)
    ctx.fillStyle = '#4E545D'; ctx.font = '400 27px -apple-system, sans-serif'
    ctx.fillText(owner, -SW / 2 + 46, SH / 2 - 52)
    ctx.fillStyle = '#8A8F96'; ctx.font = '400 22px -apple-system, sans-serif'
    ctx.fillText('Taken on NYC Stoop', -SW / 2 + 46, SH / 2 - 18)
    ctx.restore()
  }

  // medallion over the stamp's bottom-right (or centered without a photo)
  const mimg = await loadImg('data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(medallionSvgString(badge))))).catch(() => null)
  if (mimg) {
    if (photoSrc) ctx.drawImage(mimg, 640, 985, 330, 330)
    else ctx.drawImage(mimg, 540 - 260, 560, 520, 520)
  }

  // captions
  ctx.textAlign = 'center'
  ctx.fillStyle = '#F2F4F7'; ctx.font = '700 64px -apple-system, sans-serif'; ctx.fillText(badge.name, 540, 1480)
  ctx.fillStyle = 'rgba(235,240,245,0.62)'; ctx.font = '400 38px -apple-system, sans-serif'
  ctx.fillText(`${owner} · Collected ${dateLabel}`, 540, 1560)
  if (progressLine) { ctx.fillStyle = '#E3C36B'; ctx.font = '600 36px -apple-system, sans-serif'; ctx.fillText(progressLine, 540, 1625) }
  ctx.fillStyle = 'rgba(235,240,245,0.34)'; ctx.font = '400 30px -apple-system, sans-serif'
  ctx.fillText('Taken on NYC Stoop', 540, 1830)

  return new Promise(res => cv.toBlob(b => res(b), 'image/png'))
}

export async function shareStory(args) {
  const blob = await renderStory(args)
  const file = new File([blob], 'nyc-stoop-badge.png', { type: 'image/png' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return 'shared' } catch { /* cancelled */ return 'cancelled' }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'nyc-stoop-badge.png'; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
  return 'downloaded'
}


// ── Standalone stamp PNG (1200 px wide, spec §9) ────────────────────────────
export async function renderStampPng({ badgeName, photoSrc, owner }) {
  const SW = 1200, SH = Math.round(SW * 1.4767) // margin + 3:4 photo + caption band
  const cv = document.createElement('canvas'); cv.width = SW; cv.height = SH
  const ctx = cv.getContext('2d')
  ctx.fillStyle = '#F4EFE4'; ctx.fillRect(0, 0, SW, SH)
  // perforation
  ctx.globalCompositeOperation = 'destination-out'
  const step = 88, R = 30
  for (let x = step / 2; x < SW; x += step) { ctx.beginPath(); ctx.arc(x, 0, R, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(x, SH, R, 0, 7); ctx.fill() }
  for (let y = step / 2; y < SH; y += step) { ctx.beginPath(); ctx.arc(0, y, R, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(SW, y, R, 0, 7); ctx.fill() }
  ctx.globalCompositeOperation = 'source-over'
  // photo
  const PM = 84, PW = SW - PM * 2, PH = Math.round(PW * 4 / 3)
  if (photoSrc) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = photoSrc }).catch(() => null)
    if (img) {
      const sc = Math.max(PW / img.width, PH / img.height)
      ctx.save(); ctx.beginPath(); ctx.rect(PM, PM, PW, PH); ctx.clip()
      ctx.drawImage(img, PM + (PW - img.width * sc) / 2, PM + (PH - img.height * sc) / 2, img.width * sc, img.height * sc)
      ctx.restore()
    }
  }
  ctx.strokeStyle = 'rgba(29,33,40,0.2)'; ctx.lineWidth = 4; ctx.strokeRect(PM, PM, PW, PH)
  // caption band
  const y0 = PM + PH
  ctx.textAlign = 'left'
  ctx.fillStyle = '#1D2128'; ctx.font = '700 74px -apple-system, sans-serif'; ctx.fillText(badgeName, PM, y0 + 104)
  ctx.fillStyle = '#4E545D'; ctx.font = '500 58px -apple-system, sans-serif'; ctx.fillText(owner, PM, y0 + 186)
  ctx.fillStyle = '#8A8F96'; ctx.font = '400 48px -apple-system, sans-serif'; ctx.fillText('Taken on NYC Stoop', PM, y0 + 258)
  return new Promise(res => cv.toBlob(b => res(b), 'image/png'))
}

export async function photoBlob(photoSrc) {
  const r = await fetch(photoSrc)
  return r.blob()
}

// Share any blob via the system sheet; download fallback. Returns
// 'shared' | 'cancelled' | 'downloaded'.
export async function shareBlob(blob, name, title) {
  const file = new File([blob], name, { type: blob.type || 'image/png' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title }); return 'shared' } catch { return 'cancelled' }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
  return 'downloaded'
}
