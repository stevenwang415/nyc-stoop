// ── Badge catalog (v3 prototype: 5 badges) ─────────────────────────────────
// Static and mirrored server-side (backend/share.py BADGE_CATALOG) — the
// server is the source of truth for the 200 m collect check.
// Glyphs are stroke-only paths on a 100-unit canvas centered at (50,58)ish,
// per the designer asset spec — these 5 are placeholders until real art.

export const COLLECT_RADIUS_M = 200
export const CLOSE_BY_M = 900

export const BADGES = [
  { id: 'empire',      name: 'Empire State Building', short: 'EMPIRE STATE', category: 'places', finish: 'brass',  main: true,  lat: 40.7484, lng: -73.9857,
    glyph: 'M0 8 V-20 M0 -20 L0 -27 M-7 8 V-8 M7 8 V-8 M-12 8 H12 M-3.5 -8 H3.5' },
  { id: 'centralpark', name: 'Central Park',          short: 'CENTRAL PARK', category: 'places', finish: 'brass',  main: true,  lat: 40.7740, lng: -73.9709,
    glyph: 'M0 -18 A 9 9 0 1 1 -0.01 -18 M0 -2 V8 M-10 8 H10' },
  { id: 'flatiron',    name: 'Flatiron Building',     short: 'FLATIRON',     category: 'places', finish: 'nickel', main: false, lat: 40.7411, lng: -73.9897,
    glyph: 'M-8 8 L0 -22 L8 8 Z M0 -22 V8 M-12 8 H12' },
  { id: 'washsq',      name: 'Washington Square Arch', short: 'WASHINGTON SQ', category: 'places', finish: 'nickel', main: false, lat: 40.7308, lng: -73.9973,
    glyph: 'M-11 8 V-8 A 11 11 0 0 1 11 -8 V8 M-5 8 V-6 A 5 5 0 0 1 5 -6 V8 M-15 8 H15 M-13 -14 H13' },
  { id: 'katz',        name: "Katz's Delicatessen",   short: "KATZ'S",       category: 'food',   finish: 'copper', main: false, lat: 40.7223, lng: -73.9874,
    glyph: 'M-13 -2 A 13 8 0 0 1 13 -2 M-13 -2 H13 M-13 3 H13 M-13 8 A 13 8 0 0 0 13 8 M-13 3 Q-15 5 -13 8 M13 3 Q15 5 13 8' },
]

export const FINISHES = {
  brass:  { base: '#C9A227', hi: '#F6E39B', shadow: '#6B5210', ink: '#4A3806' },
  nickel: { base: '#B9C0C7', hi: '#F3F7FA', shadow: '#5F6A74', ink: '#36404A' },
  copper: { base: '#B0703F', hi: '#EBB184', shadow: '#5A3218', ink: '#3C1F0C' },
  iris:   { base: '#B8C6FF', hi: '#FFFFFF', shadow: '#6C78B0', ink: '#2B2F55' },
}

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
  const mains = MAINS
  const nonSeasonal = BADGES.map(b => b.id) // no seasonal in the prototype
  const mainsOwned = mains.filter(id => owned.has(id)).length
  const extraOwned = nonSeasonal.filter(id => owned.has(id) && !mains.includes(id)).length
  const LEVELS = [
    { n: 1, name: 'New York Visitor',          done: mainsOwned === mains.length,
      have: mainsOwned, need: mains.length,
      left: `${mains.length - mainsOwned} main spot${mains.length - mainsOwned === 1 ? '' : 's'} left` },
    { n: 2, name: 'New York Frequent Visitor', done: mainsOwned === mains.length && extraOwned >= 3,
      have: Math.min(extraOwned, 3), need: 3,
      left: `Any ${Math.max(1, 3 - extraOwned)} more badge${3 - extraOwned === 1 ? '' : 's'}` },
    { n: 3, name: 'New York Friend',           done: false, have: owned.size, need: nonSeasonal.length,
      left: 'Full catalog coming in v3' },
  ]
  let current = 0
  for (const l of LEVELS) { if (l.done) current = l.n; else break }
  const next = LEVELS.find(l => !l.done) || null
  return { current, currentName: current === 0 ? 'Just arrived' : LEVELS[current - 1].name,
    next, owned: owned.size, total: nonSeasonal.length, levels: LEVELS }
}

// Beta gate (2026-09-28): badges stay invisible in production until launch.
// Dev builds always on; a tester can flip it with
// localStorage.setItem('nyc_badges_beta', '1') in the console.
export function badgesEnabled() {
  if (import.meta.env.DEV) return true
  try { return localStorage.getItem('nyc_badges_beta') === '1' } catch { return false }
}
