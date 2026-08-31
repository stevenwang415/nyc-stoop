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

const [, , base, token] = process.argv
if (!base || !token) {
  console.error('usage: node scripts/seed-official.mjs <API_BASE> <OFFICIAL_JWT>')
  process.exit(1)
}
const H = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
const payloads = JSON.parse(fs.readFileSync('official-photos/payloads.json', 'utf8'))

const existing = await fetch(base + '/share/photos/mine', { headers: H }).then(r => r.json())
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
