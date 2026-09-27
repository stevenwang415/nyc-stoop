// ── Badge routes (Phase B) ──────────────────────────────────────────────────
// Hunt orderings, not day plans (the Planner keeps that job). Suggested
// routes ship with the catalog; custom routes live in localStorage for the
// prototype (backend in the full Phase B). Walking math per spec §5:
// straight-line × 1.25 at 4.8 km/h.
import { byId, distanceM } from './catalog.js'

export const SUGGESTED_ROUTES = [
  { id: 'fifth',    name: 'Fifth Avenue',  subtitle: 'Flatiron to the Park', stops: ['flatiron', 'empire', 'centralpark'] },
  { id: 'downtown', name: 'Downtown',      subtitle: 'The Village & the LES', stops: ['washsq', 'katz'] },
]

const KEY = 'nyc_badge_routes'

export function loadMyRoutes() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
export function saveMyRoutes(routes) {
  try { localStorage.setItem(KEY, JSON.stringify(routes)) } catch {}
}

// Walking order: start nearest the user, then nearest remaining (spec).
export function walkingOrder(stopIds, from) {
  const rest = [...stopIds]
  const out = []
  let cur = from
  while (rest.length) {
    let bi = 0, bd = Infinity
    rest.forEach((id, i) => {
      const b = byId[id]
      const d = cur ? distanceM(cur.lat, cur.lng, b.lat, b.lng) : 0
      if (d < bd) { bd = d; bi = i }
    })
    const id = rest.splice(bi, 1)[0]
    out.push(id)
    cur = byId[id]
  }
  return out
}

export function routeStats(stopIds) {
  let meters = 0
  for (let i = 1; i < stopIds.length; i++) {
    const a = byId[stopIds[i - 1]], b = byId[stopIds[i]]
    meters += distanceM(a.lat, a.lng, b.lat, b.lng)
  }
  const walk = meters * 1.25
  return { km: walk / 1000, minutes: Math.round(walk / 1000 / 4.8 * 60) }
}

export function legMinutes(aId, bId) {
  const a = byId[aId], b = byId[bId]
  const walk = distanceM(a.lat, a.lng, b.lat, b.lng) * 1.25
  return { minutes: Math.max(1, Math.round(walk / 1000 / 4.8 * 60)), meters: walk }
}
