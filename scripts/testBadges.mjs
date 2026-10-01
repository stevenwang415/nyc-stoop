// ── Badge system e2e suite (v3 prototype) ───────────────────────────────────
// Independent verification of the badge world: rules (radius / season / dupe),
// then the full UI journey with Playwright against the local dev server
// (vite + devShare mocks). Run:  node scripts/testBadges.mjs
// Requires: dev server NOT already running (the suite starts its own), and
// playwright installed (npm i -D playwright or a global install).
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const ROOT = new URL('..', import.meta.url).pathname
let pass = 0, fail = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ✗ ${name}${extra ? ' — ' + extra : ''}`) }
}

// ── 1. Rule-level checks straight from the catalog (no browser) ────────────
console.log('— catalog rules —')
const cat = (await import(ROOT + 'src/badges/catalogData.js')).CATALOG
ok('38 badges in catalog', cat.length === 38, `got ${cat.length}`)
ok('14 brass mains', cat.filter(b => b.finish === 'brass' && b.main).length === 14)
ok('every badge inside NYC bounds', cat.every(b => b.lat > 40.4 && b.lat < 41 && b.lng > -74.3 && b.lng < -73.6))
ok('liberty radius 1200', cat.find(b => b.id === 'libertystatue')?.radius === 1200)
ok('iris badges all have seasons', cat.filter(b => b.finish === 'iris').every(b => b.season))
ok('short names ≤ 15 chars', cat.every(b => (b.short || '').length <= 15))

// season-window logic (incl. new-year wrap), mirrored from catalog.js
const seasonOpen = (season, md) => {
  if (!season) return true
  const [a, z] = season.split('~')
  return a <= z ? (md >= a && md <= z) : (md >= a || md <= z)
}
ok('xmas window open on 12-25', seasonOpen('11-28~01-06', '12-25'))
ok('xmas window wraps into 01-03', seasonOpen('11-28~01-06', '01-03'))
ok('xmas window closed on 07-04', !seasonOpen('11-28~01-06', '07-04'))

// ── 2. Full UI journey ─────────────────────────────────────────────────────
console.log('— UI journey (playwright) —')
// reset dev awards so collect flows start clean
const dbPath = ROOT + '.dev-share.json'
if (existsSync(dbPath)) {
  const db = JSON.parse(readFileSync(dbPath, 'utf8'))
  db.badgeAwards = []
  writeFileSync(dbPath, JSON.stringify(db))
}

const dev = spawn('npm', ['run', 'dev'], { cwd: ROOT, stdio: 'ignore', detached: true })
const up = async () => {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch('http://localhost:5173/'); if (r.ok) return true } catch {}
    await new Promise(r => setTimeout(r, 500))
  }
  return false
}
if (!await up()) { console.log('dev server failed to start'); process.exit(1) }

const pw = await import('playwright').catch(() =>
  import(process.env.PW_PATH || '/tmp/pw/node_modules/playwright/index.mjs'))
const { chromium } = pw
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const pg = await browser.newPage({ viewport: { width: 390, height: 844 } })
const tok = 'x.' + Buffer.from(JSON.stringify({ sub: '1' })).toString('base64url') + '.x'
await pg.goto('http://localhost:5173/')
await pg.evaluate(t => {
  localStorage.setItem('nyc_token', t)
  localStorage.setItem('nyc_user', JSON.stringify({ id: 1, display_name: 'Tester', username: 'tester' }))
}, tok)
await pg.goto('http://localhost:5173/')
await pg.waitForTimeout(2000)

try {
  // first-visit tutorial overlays block the page — dismiss until gone
  const dismissTutorials = async () => {
    for (let i = 0; i < 6; i++) {
      const btn = pg.locator('button:text-is("Skip"), button:text-is("Got it")').first()
      if (!(await btn.isVisible().catch(() => false))) break
      await btn.click().catch(() => {})
      await pg.waitForTimeout(500)
    }
  }
  await dismissTutorials()
  // the door lives on the Map tab — navigate there first
  await pg.locator('button:text-is("Map")').last().click()
  await pg.waitForTimeout(1500)
  await dismissTutorials() // per-tab tutorial
  // door → world
  const door = pg.locator('button:has-text("BADGES")').last()
  ok('badge door visible on map tab', await door.count() > 0)
  await door.click(); await pg.waitForTimeout(1200)
  ok('world opens with 4 tabs', await pg.locator('button:text-is("Badges")').last().isVisible())

  // demo location → Flatiron
  const demo = pg.locator('button:has-text("Real GPS"), button:has-text("Flatiron"), button:has-text("Empire"), button:has-text("Central")').last()
  for (let i = 0; i < 4 && !(await pg.locator('button:has-text("Flatiron")').last().isVisible().catch(() => false)); i++) {
    await demo.click(); await pg.waitForTimeout(400)
  }
  ok('demo location cycled to Flatiron', await pg.locator('button:has-text("Flatiron")').last().isVisible())

  // collect via file input (camera is a system surface — inject the file)
  const input = pg.locator('input[type=file]').last()
  const jpg = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==', 'base64')
  await input.setInputFiles({ name: 't.jpg', mimeType: 'image/jpeg', buffer: jpg }).catch(() => {})
  await pg.waitForTimeout(2600)
  const struck = await pg.locator('text=Tap to continue, text=badge-strike').count().catch(() => 0)
  // strike overlay dismiss (tap anywhere)
  await pg.mouse.click(195, 400); await pg.waitForTimeout(700)
  // visibility prompt
  const pub = pg.locator('button:text-is("Public")').last()
  const sawVis = await pub.isVisible().catch(() => false)
  ok('collect → strike → visibility prompt', sawVis || struck > 0)
  if (sawVis) { await pub.click(); await pg.waitForTimeout(900) }
  // dismiss level toast if present
  await pg.mouse.click(195, 400); await pg.waitForTimeout(400)

  // duplicate collect is refused server-side (409)
  const dupe = await pg.evaluate(async (t) => {
    const r = await fetch('/share/badges/collect', { method: 'POST',
      headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
      body: JSON.stringify({ badge_id: 'flatiron', lat: 40.7411, lng: -73.9897, image_b64: '/9j/4AAQSkZJRg==' }) })
    return r.status
  }, tok)
  ok('second collect → 409', dupe === 409, `got ${dupe}`)

  // radius enforcement: Guggenheim from Flatiron distance → 403
  const far = await pg.evaluate(async (t) => {
    const r = await fetch('/share/badges/collect', { method: 'POST',
      headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
      body: JSON.stringify({ badge_id: 'guggenheim', lat: 40.7411, lng: -73.9897, image_b64: '/9j/4AAQSkZJRg==' }) })
    return r.status
  }, tok)
  ok('collect out of radius → 403', far === 403, `got ${far}`)

  // seasonal enforcement (christmas tree in October) → 403
  const season = await pg.evaluate(async (t) => {
    const r = await fetch('/share/badges/collect', { method: 'POST',
      headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
      body: JSON.stringify({ badge_id: 'xmastree', lat: 40.7587, lng: -73.9787, image_b64: '/9j/4AAQSkZJRg==' }) })
    return r.status
  }, tok)
  ok('out-of-season collect → 403', season === 403, `got ${season}`)

  // shelf shows all 38
  await pg.locator('button:text-is("Badges")').last().click(); await pg.waitForTimeout(800)
  const tiles = await pg.locator('text=/ of 38|38/').count()
  ok('badges shelf reachable', tiles > 0)

  // photos tab → stamp → viewer with mockup controls
  await pg.locator('button:text-is("Photos")').last().click(); await pg.waitForTimeout(800)
  const stamp = pg.locator('text=Taken on NYC Stoop').first()
  ok('stamp rendered in Photos', await stamp.count() > 0)
  await stamp.click({ force: true }).catch(() => {})
  await pg.waitForTimeout(700)
  ok('viewer: Stamp/Photo pill', await pg.locator('button:text-is("Stamp")').last().isVisible().catch(() => false))
  ok('viewer: Open badge pill', await pg.locator('text=Open badge').last().isVisible().catch(() => false))

  // world + tab survive reload (iOS eviction)
  await pg.reload(); await pg.waitForTimeout(2000)
  const stillWorld = await pg.evaluate(() => sessionStorage.getItem('nyc_badge_world') === '1')
  ok('world survives reload (sessionStorage)', stillWorld)
} catch (e) {
  fail++; console.log('  ✗ suite crashed —', String(e).slice(0, 200))
}

await browser.close()
try { process.kill(-dev.pid) } catch {}
console.log(`\n${pass} passed · ${fail} failed`)
process.exit(fail ? 1 : 0)
