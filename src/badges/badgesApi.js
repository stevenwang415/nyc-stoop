// ── Badges API (v3 prototype) ───────────────────────────────────────────────
// Same transport as shareApi: bearer token from the auth store; the vite dev
// mock (scripts/devShare.mjs) answers these paths locally.
import { getToken } from '../auth/api.js'

const BASE = import.meta.env.VITE_API_BASE || ''

async function call(path, { method = 'GET', body } = {}) {
  const token = getToken()
  if (!token) throw new Error('signed-out')
  const res = await fetch(BASE + path, {
    method,
    headers: { Authorization: 'Bearer ' + token, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let detail = ''
    try { detail = (await res.json()).detail } catch {}
    const e = new Error(detail || `HTTP ${res.status}`); e.status = res.status; throw e
  }
  return res.json()
}

export const myAwards = () => call('/share/badges/mine')
export const collectBadge = (p) => call('/share/badges/collect', { method: 'POST', body: p })
export const setBadgeVisibility = (badgeId, visibility) =>
  call(`/share/badges/${badgeId}`, { method: 'PATCH', body: { visibility } })
export const awardsOf = (userId) => call(`/share/badges/of/${userId}`)
