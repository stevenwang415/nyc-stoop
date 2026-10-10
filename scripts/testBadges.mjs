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
ok('59 badges in catalog', cat.length === 59, `got ${cat.length}`)
ok('26 brass mains', cat.filter(b => b.finish === 'brass' && b.main).length === 26)
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
const tok = 'x.' + Buffer.from(JSON.stringify({ sub: '1', email: 't@t.co', name: 'T' })).toString('base64url') + '.x'
await pg.goto('http://localhost:5173/')
await pg.evaluate(t => {
  localStorage.setItem('nyc_token', t)
  localStorage.setItem('nyc_user', JSON.stringify({ id: 1, display_name: 'Tester', username: 'tester' }))
  localStorage.setItem('nyc_onboarded_v2', '1') // skip first-visit tutorials
  sessionStorage.setItem('nyc_badge_world', '1') // enter the world directly,
  sessionStorage.setItem('nyc_badge_tab', 'map') // the same way iOS restores it
}, tok)
await pg.goto('http://localhost:5173/')
await pg.waitForTimeout(2500)

try {
  ok('badge world opens (map tab)', await pg.locator('button:text-is("Badges")').last().isVisible())

  // demo location → Flatiron
  const demo = pg.locator('button:has-text("🧪")').last()
  for (let i = 0; i < 4 && !(await pg.locator('button:has-text("Flatiron")').last().isVisible().catch(() => false)); i++) {
    await demo.click(); await pg.waitForTimeout(400)
  }
  ok('demo location cycled to Flatiron', await pg.locator('button:has-text("Flatiron")').last().isVisible())

  // collect via the real flow: shelf tile → Take photo → camera file
  await pg.locator('button:text-is("Badges")').last().click()
  await pg.waitForTimeout(900)
  await pg.locator('button:has-text("Flatiron Building")').last().click()
  await pg.waitForTimeout(800)
  await pg.locator('button:has-text("Take photo")').last().click()
  await pg.waitForTimeout(400)
  const input = pg.locator('input[type=file]').last()
  const jpg = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==', 'base64')
  await input.setInputFiles({ name: 't.jpg', mimeType: 'image/jpeg', buffer: jpg })
  await pg.waitForTimeout(2800) // strike ceremony plays
  const pub = pg.locator('button:has-text("Friends can see this badge")').last()
  let sawVis = false
  for (let i = 0; i < 8; i++) { // tap through strike → wait for the prompt
    if (await pub.isVisible().catch(() => false)) { sawVis = true; break }
    await pg.mouse.click(195, 400)
    await pg.waitForTimeout(600)
  }
  ok('collect → strike → visibility prompt', sawVis)
  if (sawVis) { await pub.click(); await pg.waitForTimeout(900) }
  for (let i = 0; i < 4; i++) { await pg.mouse.click(195, 400); await pg.waitForTimeout(400) } // toast + leftovers

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
      body: JSON.stringify({ badge_id: 'rocktree', lat: 40.7587, lng: -73.9790, image_b64: '/9j/4AAQSkZJRg==' }) })
    return r.status
  }, tok)
  ok('out-of-season collect → 403', season === 403, `got ${season}`)

  // shelf shows all 38
  await pg.locator('button:text-is("Badges")').last().click(); await pg.waitForTimeout(800)
  ok('badges shelf reachable', await pg.locator('text=On the map').count() > 0)

  // badge → Planner bridge (2026-10-09): detail's Add to Planner saves the
  // place into the planner stores and dedups on a second badge
  const flatTile = pg.locator('button:has-text("Flatiron Building")').last()
  await flatTile.click(); await pg.waitForTimeout(800)
  const planBtn = pg.locator('button:has-text("Add to Planner")').last()
  ok('detail has Add to Planner', await planBtn.isVisible().catch(() => false))
  await planBtn.click(); await pg.waitForTimeout(600)
  ok('button confirms Added ✓', await pg.locator('button:has-text("Added to Planner")').count() > 0)
  const planner = await pg.evaluate(() => {
    const uv = JSON.parse(localStorage.getItem('nyc_user_venues') || '{}')
    const saved = JSON.parse(localStorage.getItem('nyc_saved') || '{}')
    const hit = Object.values(uv).find(v => v.name === 'Flatiron Building')
    return { inVenues: !!hit, hasCoords: !!(hit && hit.lat && hit.lng),
      inSaved: hit ? !!saved['user_venue:' + hit.id] : false,
      count: Object.values(uv).filter(v => v.name === 'Flatiron Building').length }
  })
  ok('planner store has the badge place', planner.inVenues && planner.hasCoords)
  ok('auto-saved to My Trip', planner.inSaved)
  // dedup: reopen the same badge, add again → still one entry
  await pg.locator('[aria-label="Close"], button:text-is("✕")').last().click().catch(() => pg.mouse.click(195, 100))
  await pg.waitForTimeout(600)
  await flatTile.click(); await pg.waitForTimeout(700)
  await pg.locator('button:has-text("Add to Planner")').last().click().catch(() => {})
  await pg.waitForTimeout(600)
  const dupCount = await pg.evaluate(() =>
    Object.values(JSON.parse(localStorage.getItem('nyc_user_venues') || '{}'))
      .filter(v => v.name === 'Flatiron Building').length)
  ok('no duplicate on second add', dupCount === 1, `got ${dupCount}`)
  await pg.locator('[aria-label="Close"], button:text-is("✕")').last().click().catch(() => pg.mouse.click(195, 100))
  await pg.waitForTimeout(500)

  // multi-photo + friends-here (2026-10-10): add a photo on site, see it in
  // the strip; friends section visible from anywhere; API gates enforced
  await pg.locator('button:has-text("Flatiron Building")').last().click()
  await pg.waitForTimeout(900)
  ok('Friends here section shows', await pg.locator('text=Friends here').count() > 0)
  const addTile = pg.locator('button:has-text("Add photo")').last()
  ok('Add photo tile active on site', await addTile.isVisible().catch(() => false))
  await addTile.click(); await pg.waitForTimeout(400)
  await pg.locator('input[type=file]').last().setInputFiles({ name: 'p2.jpg', mimeType: 'image/jpeg', buffer: jpg })
  await pg.waitForTimeout(1500)
  const bp = await pg.evaluate(async (t) =>
    (await (await fetch('/share/badges/flatiron/photos', { headers: { Authorization: 'Bearer ' + t } })).json()).photos.length, tok)
  ok('extra photo stored', bp === 1, `got ${bp}`)
  ok('strip shows 2 photos', await pg.locator('img[src^="data:image"]').count() >= 2)
  const farAdd = await pg.evaluate(async (t) => (await fetch('/share/badges/flatiron/photos', {
    method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat: 40.78, lng: -73.96, image_b64: 'x'.repeat(200), thumb_b64: 'x'.repeat(80) }) })).status, tok)
  ok('add photo off-site → 403', farAdd === 403, `got ${farAdd}`)
  const notOwned = await pg.evaluate(async (t) => (await fetch('/share/badges/guggenheim/photos', {
    method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat: 40.783, lng: -73.959, image_b64: 'x'.repeat(200), thumb_b64: 'x'.repeat(80) }) })).status, tok)
  ok('add photo on uncollected badge → 403', notOwned === 403, `got ${notOwned}`)
  await pg.locator('[aria-label="Close"]').last().click().catch(() => pg.mouse.click(195, 100))
  await pg.waitForTimeout(500)

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
