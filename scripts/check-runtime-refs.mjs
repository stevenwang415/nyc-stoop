#!/usr/bin/env node
// ── Runtime-reference check (2026-08-26) ────────────────────────────────────
// WHY: `vite build` happily bundles code that crashes at runtime — undefined
// identifiers and TDZ (used-before-declaration) are legal JS until executed.
// Both blank-screen incidents of 2026-08-25/26 were exactly these classes:
//   · a listener's dependency array reading state declared later (TDZ)
//   · a splice deleting APP_VERSION/PROFILE_GLOBAL_KEYS while Settings still
//     referenced them (Cannot find name)
// TypeScript's checker catches BOTH statically. We run it in checkJs mode and
// filter to just those two diagnostics — all other type noise is ignored.
//
// USAGE:  node scripts/check-runtime-refs.mjs
//   Exits 1 with a listing if any hit is found. Run after any structural edit
//   to src/*.jsx, alongside the build. Requires `typescript` on the machine
//   (npx fetches it if absent): the script shells out to tsc.
import { execSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const FILES = ['src/App.jsx', 'src/share/ShareSheet.jsx', 'src/share/shareApi.js', 'src/auth/api.js', 'src/lib/i18n.js']
const FLAGS = '--allowJs --checkJs --noEmit --jsx preserve --target es2020 --moduleResolution bundler --module esnext --skipLibCheck --lib es2020,dom'

// Prefer a local/global tsc; fall back to npx (slower first run).
const tscCandidates = ['node_modules/.bin/tsc', '/tmp/node_modules/.bin/tsc']
const tsc = tscCandidates.find(p => existsSync(p)) || 'npx -y tsc'

const cmd = `${tsc} ${FLAGS} ${FILES.join(' ')}`
const out = spawnSync(cmd, { shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const text = (out.stdout || '') + (out.stderr || '')
const hits = text.split('\n').filter(l => /Cannot find name|used before its declaration/.test(l))

if (hits.length) {
  console.error(`✗ ${hits.length} runtime-reference problem(s):\n` + hits.join('\n'))
  process.exit(1)
}
console.log(`✓ runtime-reference check clean (${FILES.length} files)`)
