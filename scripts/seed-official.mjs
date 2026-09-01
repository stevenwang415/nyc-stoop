#!/usr/bin/env node
// ── Seed the official NYC Stoop account in PROD ────────────────────────────
// Replays official-photos/payloads.json (built 2026-08-28 from Steven's
// curated 14; gitignored — images as base64) against a real backend.
//
// USAGE (after the v2.0 push, per PREFLIGHT_v2.0.md §2):
//   1. Sign in to the app AS the official account, copy its JWT:
//      Safari devtools → localStorage.nyc_token   (or from the app via
//      Settings once a debug copy exists)
//   2. node scripts/seed-official.mjs https://nyc-stoop.vercel.app <TOKEN>
//
// Idempotence: the script lists the account's existing photos first and
// skips any place_name it already posted — safe to re-run.
import fs from 'node:fs'

let [, , base, token] = process.argv
// Long JWTs get mangled by terminal pastes — accept quotes/whitespace debris,
// and sanity-check the shape before burning a request.
token = (token || '').trim().replace(/^["'<]+|[>"']+$/g, '')
if (!base || !token) {
  console.error('usage: node scripts/seed-official.mjs <API_BASE> <OFFICIAL_JWT>')
  process.exit(1)
}
if (token.split('.').length !== 3) {
  console.error('✗ that does not look like a complete JWT (need 3 dot-separated parts, got ' + token.split('.').length + ') — re-copy it from the console in one piece')
  process.exit(1)
}
try {
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
  console.log('token: user', payload.sub, '·', payload.email, '· expires', new Date(payload.exp * 1000).toLocaleString())
  if (payload.exp * 1000 < Date.now()) { console.error('✗ token is EXPIRED — sign in again and re-copy'); process.exit(1) }
} catch { console.error('✗ could not decode token — it is corrupted; re-copy it'); process.exit(1) }
const H = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
const payloads = JSON.parse(fs.readFileSync('official-photos/payloads.json', 'utf8'))

const listRes = await fetch(base + '/share/photos/mine', { headers: H })
if (!listRes.ok) {
  console.error('✗ auth check failed:', listRes.status, await listRes.text())
  console.error('  → the token is not being accepted; re-copy it exactly (no <>, no quotes, one line)')
  process.exit(1)
}
const existing = await listRes.json()
const have = new Set((existing.photos || []).map(p => p.place_name))
console.log(`account has ${have.size} photos; seeding ${payloads.length} candidates…`)

let posted = 0
for (const p of payloads) {
  if (have.has(p.place_name)) { console.log('skip (exists):', p.place_name); continue }
  const r = await fetch(base + '/share/photos', { method: 'POST', headers: H, body: JSON.stringify(p) })
  if (!r.ok) { console.error('FAILED', p.place_name, r.status, await r.text()); process.exit(1) }
  console.log('posted:', p.place_name)
  posted++
  await new Promise(res => setTimeout(res, 400)) // gentle on the 30/day brake? (14 < 30 — fine)
}
console.log(`done — ${posted} posted.`)
