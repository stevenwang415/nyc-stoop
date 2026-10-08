// ── Badge catalog (v3 prototype: 5 badges) ─────────────────────────────────
// Static and mirrored server-side (backend/share.py BADGE_CATALOG) — the
// server is the source of truth for the 200 m collect check.
// Glyphs are stroke-only paths on a 100-unit canvas centered at (50,58)ish,
// per the designer asset spec — these 5 are placeholders until real art.

export const COLLECT_RADIUS_M = 200
export const CLOSE_BY_M = 900

import { CATALOG } from './catalogData.js'
import { t, t2, getLang } from '../lib/i18n.js'
import { glyphOf } from './glyphs.js'

// Full catalog (generated from the CSV) with glyphs attached. Component code
// keeps the same shape it always used: { id, name, short, category, finish,
// main, lat, lng, season, radius, glyph }.
export const BADGES = CATALOG.map(b => ({ ...b, glyph: glyphOf(b) }))

// Seasonal window check — handles windows that wrap the new year
// (e.g. 10-22~03-01). Dates compare as MM-DD strings in ET.
export function seasonOpen(badge, now = new Date()) {
  if (!badge.season) return true
  const [a, z] = badge.season.split('~')
  const today = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }).slice(5)
  return a <= z ? (today >= a && today <= z) : (today >= a || today <= z)
}

export function collectRadius(badge) {
  return badge.radius || COLLECT_RADIUS_M
}

export const FINISHES = {
  brass:  { base: '#C9A227', hi: '#F6E39B', shadow: '#6B5210', ink: '#4A3806' },
  nickel: { base: '#B9C0C7', hi: '#F3F7FA', shadow: '#5F6A74', ink: '#36404A' },
  copper: { base: '#B0703F', hi: '#EBB184', shadow: '#5A3218', ink: '#3C1F0C' },
  iris:   { base: '#B8C6FF', hi: '#FFFFFF', shadow: '#6C78B0', ink: '#2B2F55' },
}

// Display name in the current language (catalog rows carry name_zh).
export function badgeName(b) { return getLang() === 'zh' && b?.name_zh ? b.name_zh : (b?.name || '') }

export const byId = Object.fromEntries(BADGES.map(b => [b.id, b]))
export const MAINS = BADGES.filter(b => b.main).map(b => b.id)

// Haversine, meters.
export function distanceM(lat1, lng1, lat2, lng2) {
  const R = 6371000, r = Math.PI / 180
  const dLat = (lat2 - lat1) * r, dLng = (lng2 - lng1) * r
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function fmtDist(m) {
  return m < 950 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`
}

// ── Levels (spec §6), computed against the live catalog so the 5-badge
// prototype behaves sensibly. Badges only, never points; levels stack.
export function levelState(ownedIds) {
  const owned = new Set(ownedIds)
  const mainsOwned = MAINS.filter(id => owned.has(id)).length
  const totalOwned = owned.size
  const allMains = mainsOwned === MAINS.length
  // 5-level ladder (decided 2026-10-08): mains are the spine.
  const LEVELS = [
    { n: 1, name: t('New York Visitor'), done: totalOwned >= 3,
      have: Math.min(totalOwned, 3), need: 3,
      left: t2('{N} more badges', { N: Math.max(1, 3 - totalOwned) }) },
    { n: 2, name: t('New York Explorer'), done: mainsOwned >= 7,
      have: Math.min(mainsOwned, 7), need: 7,
      left: t2('{N} main spots left', { N: Math.max(1, 7 - mainsOwned) }) },
    { n: 3, name: t('New York Regular'), done: allMains,
      have: mainsOwned, need: MAINS.length,
      left: t2('{N} main spots left', { N: Math.max(1, MAINS.length - mainsOwned) }) },
    { n: 4, name: t('New York Insider'), done: allMains && totalOwned >= 24,
      have: Math.min(totalOwned, 24), need: 24,
      left: t2('{N} more beyond the mains', { N: Math.max(1, 24 - totalOwned) }) },
    { n: 5, name: t('New Yorker'), done: allMains && totalOwned >= 30,
      have: Math.min(totalOwned, 30), need: 30,
      left: t2('{N} badges to go', { N: Math.max(1, 30 - totalOwned) }) },
  ]
  let current = 0
  for (const l of LEVELS) { if (l.done) current = l.n; else break }
  const next = LEVELS.find(l => !l.done) || null
  return { current, currentName: current === 0 ? t('Just arrived') : LEVELS[current - 1].name,
    next, owned: totalOwned, total: BADGES.length, levels: LEVELS }
}

// Beta gate (2026-09-28): badges stay invisible in production until launch.
// Dev builds always on; a tester can flip it with
// localStorage.setItem('nyc_badges_beta', '1') in the console.
export function badgesEnabled() {
  if (import.meta.env.DEV) return true
  try {
    // Tester unlock: opening nyc-stoop.vercel.app/?badges=1 (or =0 to relock)
    // persists the flag — no console needed on a phone.
    const q = new URLSearchParams(window.location.search).get('badges')
    if (q === '1') localStorage.setItem('nyc_badges_beta', '1')
    if (q === '0') localStorage.removeItem('nyc_badges_beta')
    return localStorage.getItem('nyc_badges_beta') === '1'
  } catch { return false }
}
