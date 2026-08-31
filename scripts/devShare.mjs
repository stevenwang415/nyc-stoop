// DEV-ONLY in-process Share v2.0 server — a Vite middleware that mirrors
// backend/share.py's API so the feature is testable with `npm run dev` alone:
// no Python, no deploy, no second terminal. State lives in .dev-share.json
// (gitignored) so two browser windows (same dev server) share one "database".
//
// Auth: the frontend signs in against the real prod backend as usual; this
// mock DECODES the JWT payload without verifying the signature (dev only —
// the real backend verifies properly) just to learn who's calling.
//
// This file is only ever imported by vite.config.js's dev server hook —
// it is NOT part of any production bundle.
import fs from 'fs'
import path from 'path'

const STORE = path.resolve('.dev-share.json')

function load() {
  try { return JSON.parse(fs.readFileSync(STORE, 'utf8')) } catch {
    return { codes: {}, friendships: [], photos: [], nextPhotoId: 1 }
  }
}
function save(db) { fs.writeFileSync(STORE, JSON.stringify(db)) }

function jwtUser(req) {
  const auth = req.headers.authorization || ''
  if (!auth.toLowerCase().startsWith('bearer ')) return null
  try {
    const payload = JSON.parse(Buffer.from(auth.split(' ')[1].split('.')[1], 'base64url').toString())
    if (!payload.sub) return null
    return { id: String(payload.sub), email: payload.email || 'user' + payload.sub, name: (payload.email || 'user').split('@')[0] }
  } catch { return null }
}

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const newCode = () => Array.from({ length: 8 }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('')
const pair = (a, b) => (String(a) < String(b) ? [String(a), String(b)] : [String(b), String(a)])

function friendIds(db, uid) {
  return db.friendships.filter(f => f.status === 'accepted' && (f.lo === String(uid) || f.hi === String(uid)))
    .map(f => (f.lo === String(uid) ? f.hi : f.lo))
}
function findFriendship(db, a, b) {
  const [lo, hi] = pair(a, b)
  return db.friendships.find(f => f.lo === lo && f.hi === hi)
}
const publicUser = (db, id) => ({ id: isNaN(+id) ? id : +id, display_name: db.codes[id]?.name || 'User ' + id, picture_url: null, avatar_b64: (db.avatars || {})[String(id)] || null, official: String((db.emails || {})[String(id)] || '').includes('+official') })

function json(res, status, obj) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(obj))
}
const detail = (res, status, msg) => json(res, status, { detail: msg })

function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', c => { data += c })
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}) } catch { resolve({}) } })
  })
}

export function devSharePlugin() {
  return {
    name: 'dev-share-mock',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/share/')) return next()
        const db = load()
        const user = jwtUser(req)
        if (!user) return detail(res, 401, 'Missing bearer token')
        // remember display name for friends lists
        db.codes[user.id] = db.codes[user.id] || {}
        // Track id↔email so the official account (dev convention: email
        // contains '+official') can be recognized for seeding + badges.
        db.emails = db.emails || {}
        db.emails[String(user.id)] = user.email
        if (!db.codes[user.id].name) db.codes[user.id].name = user.name
        const url = req.url.split('?')[0]
        const m = req.method

        // ── friends ──
        if (url === '/share/me/code' && m === 'GET') {
          const firstVisit = !db.codes[user.id].code
          if (firstVisit) { db.codes[user.id].code = newCode() }
          if (firstVisit && !String(user.email).includes('+official')) {
            const offId = Object.keys(db.emails).find(id => String(db.emails[id]).includes('+official'))
            if (offId && offId !== String(user.id) && !findFriendship(db, user.id, offId)) {
              const [lo, hi] = pair(user.id, offId)
              db.friendships.push({ lo, hi, status: 'accepted', created_at: new Date().toISOString() })
            }
          }
          if (firstVisit) save(db)
          return json(res, 200, { code: db.codes[user.id].code })
        }
        if (url === '/share/me/code/regenerate' && m === 'POST') {
          db.codes[user.id].code = newCode(); save(db)
          return json(res, 200, { code: db.codes[user.id].code })
        }
        if (url === '/share/friends/redeem' && m === 'POST') {
          const { code } = await readBody(req)
          const entry = Object.entries(db.codes).find(([, v]) => v.code === String(code || '').trim().toUpperCase())
          if (!entry) return detail(res, 404, 'No user with that code')
          const otherId = entry[0]
          if (otherId === user.id) return detail(res, 400, "That's your own code")
          const existing = findFriendship(db, user.id, otherId)
          if (existing?.status === 'blocked') return detail(res, 404, 'No user with that code')
          if (existing) return json(res, 200, { ok: true, already_friends: true, friend: publicUser(db, otherId) })
          const [lo, hi] = pair(user.id, otherId)
          db.friendships.push({ lo, hi, status: 'accepted', created_at: new Date().toISOString() }); save(db)
          return json(res, 200, { ok: true, already_friends: false, friend: publicUser(db, otherId) })
        }
        if (url === '/share/friends' && m === 'GET') {
          return json(res, 200, { friends: friendIds(db, user.id).map(id => publicUser(db, id)) })
        }
        const unfriendM = url.match(/^\/share\/friends\/(\w+)$/)
        if (unfriendM && m === 'DELETE') {
          const f = findFriendship(db, user.id, unfriendM[1])
          if (f && f.status === 'accepted') { db.friendships = db.friendships.filter(x => x !== f); save(db) }
          return json(res, 200, { ok: true })
        }
        const blockM = url.match(/^\/share\/friends\/(\w+)\/block$/)
        if (blockM && m === 'POST') {
          const f = findFriendship(db, user.id, blockM[1])
          if (f) { f.status = 'blocked'; f.blocked_by = user.id }
          else { const [lo, hi] = pair(user.id, blockM[1]); db.friendships.push({ lo, hi, status: 'blocked', blocked_by: user.id }) }
          save(db)
          return json(res, 200, { ok: true })
        }

        if (url.startsWith('/share/place-search')) {
          // Apple Maps Server API, locally: reads APPLE_MAPS_* from
          // backend/.env (gitignored) so Steven can test BEFORE the push.
          // Missing keys → 503, and the client falls back to Nominatim.
          const q = new URL('http://x' + req.url).searchParams.get('q')?.trim() || ''
          if (q.length < 2) return json(res, 200, { results: [] })
          const env = {}
          try {
            for (const line of fs.readFileSync('backend/.env', 'utf8').split('\n')) {
              const mm = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim())
              if (mm) env[mm[1]] = mm[2].replace(/^"|"$/g, '')
            }
          } catch {}
          const team = env.APPLE_MAPS_TEAM_ID, kid = env.APPLE_MAPS_KEY_ID
          const p8 = (env.APPLE_MAPS_P8 || '').replace(/\\n/g, '\n')
          if (!team || !kid || !p8) return detail(res, 503, 'search not configured')
          try {
            const { createPrivateKey, sign } = await import('node:crypto')
            const b64u = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
            const now = Math.floor(Date.now() / 1000)
            const unsigned = b64u({ alg: 'ES256', kid, typ: 'JWT' }) + '.' + b64u({ iss: team, iat: now, exp: now + 1200 })
            const sig = sign('sha256', Buffer.from(unsigned), { key: createPrivateKey(p8), dsaEncoding: 'ieee-p1363' })
            const authJwt = unsigned + '.' + sig.toString('base64url')
            const tokRes = await fetch('https://maps-api.apple.com/v1/token', { headers: { Authorization: 'Bearer ' + authJwt } })
            if (!tokRes.ok) return detail(res, 502, 'apple token failed: ' + tokRes.status)
            const { accessToken } = await tokRes.json()
            const sRes = await fetch('https://maps-api.apple.com/v1/search?' + new URLSearchParams({
              q, limitToCountries: 'US', searchLocation: '40.7359,-73.9911', lang: 'en-US' }),
              { headers: { Authorization: 'Bearer ' + accessToken } })
            if (!sRes.ok) return detail(res, 502, 'apple search failed: ' + sRes.status)
            const data = await sRes.json()
            const out = []
            for (const r2 of (data.results || []).slice(0, 6)) {
              const lat = r2.coordinate?.latitude, lng = r2.coordinate?.longitude
              if (lat == null || lng == null) continue
              if (!(lat > 40.45 && lat < 40.95 && lng > -74.30 && lng < -73.65)) continue
              const cat = (r2.poiCategory || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
              const addr = (r2.formattedAddressLines || [''])[0]
              out.push({ name: r2.name || q, detail: [cat, addr].filter(Boolean).join(' · '), lat, lng })
            }
            return json(res, 200, { results: out })
          } catch (e) {
            return detail(res, 502, 'apple search error: ' + (e?.message || e))
          }
        }
        if (url === '/share/me/name' && m === 'POST') {
          const b = await readBody(req)
          const name = String(b.display_name || '').trim().slice(0, 40)
          if (!name) return detail(res, 400, 'empty name')
          db.codes[String(user.id)] = { ...(db.codes[String(user.id)] || {}), name }
          save(db)
          return json(res, 200, { ok: true, user: publicUser(db, user.id) })
        }
        const cRepM = url.match(/^\/share\/comments\/(\d+)\/report$/)
        if (cRepM && m === 'POST') {
          db.comments = db.comments || []
          const c = db.comments.find(x => x.id === +cRepM[1])
          if (c) {
            c.reports_count = (c.reports_count || 0) + 1
            if (c.reports_count >= 2) c.status = 'flagged'
            save(db)
          }
          return json(res, 200, { ok: true })
        }
        if (url === '/share/me/avatar' && m === 'POST') {
          const b = await readBody(req)
          if (!b.avatar_b64 || String(b.avatar_b64).length > 60000) return detail(res, 400, 'bad avatar')
          db.avatars = db.avatars || {}
          db.avatars[String(user.id)] = String(b.avatar_b64)
          save(db)
          return json(res, 200, { ok: true })
        }
        // ── photos ──
        if (url === '/share/photos' && m === 'POST') {
          const b = await readBody(req)
          if (b.anchor_type === 'place' && !(b.place_id || b.place_name)) return detail(res, 400, 'place anchor needs place_id or place_name')
          if (b.anchor_type === 'moment' && !b.area_label) return detail(res, 400, 'moment anchor needs area_label')
          const p = {
            id: db.nextPhotoId++, user_id: user.id, anchor_type: b.anchor_type,
            place_id: b.place_id || null, place_name: b.place_name || null, area_label: b.area_label || null,
            lat: (typeof b.lat === 'number' ? b.lat : null), lng: (typeof b.lng === 'number' ? b.lng : null),
            group_id: b.group_id || null,
            kind: b.kind || 'vibe', caption: b.caption || null,
            image_b64: b.image_b64, thumb_b64: b.thumb_b64,
            taken_at: b.taken_at || null, created_at: new Date().toISOString(), status: 'ok', reports: 0,
          }
          db.photos.push(p); save(db)
          const { image_b64, ...meta } = p
          return json(res, 200, { ok: true, photo: { ...meta, author: publicUser(db, user.id) } })
        }
        if (url === '/share/photos/mine' && m === 'GET') {
          const mine = db.photos.filter(p => p.user_id === user.id && p.status === 'ok')
            .sort((a, b) => b.created_at.localeCompare(a.created_at))
            .map(({ image_b64, ...meta }) => ({ ...meta, author: publicUser(db, user.id) }))
          return json(res, 200, { photos: mine })
        }
        if (url === '/share/feed' && m === 'GET') {
          const ids = friendIds(db, user.id)
          const feed = db.photos.filter(p => ids.includes(p.user_id) && p.status === 'ok')
            .sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 60)
            .map(({ image_b64, ...meta }) => ({ ...meta, author: publicUser(db, meta.user_id) }))
          return json(res, 200, { photos: feed })
        }
        const imgM = url.match(/^\/share\/photos\/(\d+)\/image$/)
        if (imgM && m === 'GET') {
          const p = db.photos.find(x => x.id === +imgM[1])
          if (!p || p.status !== 'ok') return detail(res, 404, 'Not found')
          if (p.user_id !== user.id && !friendIds(db, user.id).includes(p.user_id)) return detail(res, 404, 'Not found')
          res.statusCode = 200
          res.setHeader('Content-Type', 'image/jpeg')
          return res.end(Buffer.from(p.image_b64, 'base64'))
        }
        const patchM = url.match(/^\/share\/photos\/(\d+)$/)
        if (patchM && m === 'PATCH') {
          const body = await readBody(req)
          const p = db.photos.find(x => x.id === +patchM[1] && x.user_id === user.id)
          if (!p) return json(res, 404, { detail: 'Not found' })
          if (!(body.place_name || body.place_id || body.area_label)) return json(res, 400, { detail: 'needs a place or an area' })
          p.place_id = body.place_id || null
          p.place_name = body.place_name || null
          p.area_label = body.area_label || null
          p.anchor_type = (body.place_id || body.place_name) ? 'place' : 'moment'
          if (body.kind) p.kind = body.kind
          p.caption = body.caption || null
          p.lat = (typeof body.lat === 'number' ? body.lat : null)
          p.lng = (typeof body.lng === 'number' ? body.lng : null)
          save(db)
          return json(res, 200, { ok: true })
        }
        if (url === '/share/notifications' && m === 'GET') {
          db.comments = db.comments || []
          const events = []
          const myPhotoIds = new Map(db.photos.filter(p => p.user_id === user.id).map(p => [p.id, p]))
          for (const c of db.comments) {
            const ph = myPhotoIds.get(c.photo_id)
            if (ph && c.user_id !== user.id) events.push({ type: 'comment', photo_id: ph.id, author: publicUser(db, c.user_id), text: c.text, place_name: ph.place_name || ph.area_label, created_at: c.created_at })
          }
          const fIds2 = friendIds(db, user.id)
          for (const ph of db.photos) {
            if (fIds2.includes(ph.user_id) && ph.status === 'ok') events.push({ type: 'photo', photo_id: ph.id, author: publicUser(db, ph.user_id), place_name: ph.place_name || ph.area_label, created_at: ph.created_at })
          }
          for (const f of (db.friendships || [])) {
            if (f.status === 'accepted' && (f.lo === user.id || f.hi === user.id) && f.created_at) {
              const other = f.lo === user.id ? f.hi : f.lo
              events.push({ type: 'friend', author: publicUser(db, other), created_at: f.created_at })
            }
          }
          events.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
          return json(res, 200, { events: events.slice(0, 40) })
        }
        // ── comments ──
        const cListM = url.match(/^\/share\/photos\/(\d+)\/comments$/)
        if (cListM) {
          db.comments = db.comments || []; db.nextCommentId = db.nextCommentId || 1
          const photo = db.photos.find(x => x.id === +cListM[1] && x.status === 'ok')
          const fIds = friendIds(db, user.id)
          if (!photo || (photo.user_id !== user.id && !fIds.includes(photo.user_id))) return detail(res, 404, 'Not found')
          if (m === 'GET') {
            const list = db.comments.filter(c => c.photo_id === photo.id && (c.status || 'ok') === 'ok')
              .map(c => ({ id: c.id, author: publicUser(db, c.user_id), text: c.text, created_at: c.created_at }))
            return json(res, 200, { comments: list })
          }
          if (m === 'POST') {
            const b = await readBody(req)
            const text = String(b.text || '').trim().slice(0, 300)
            if (!text) return detail(res, 400, 'empty comment')
            const c = { id: db.nextCommentId++, photo_id: photo.id, user_id: user.id, text, created_at: new Date().toISOString() }
            db.comments.push(c); save(db)
            return json(res, 200, { ok: true, comment: { id: c.id, author: publicUser(db, user.id), text: c.text, created_at: c.created_at } })
          }
        }
        const cDelM = url.match(/^\/share\/comments\/(\d+)$/)
        if (cDelM && m === 'DELETE') {
          db.comments = db.comments || []
          const c = db.comments.find(x => x.id === +cDelM[1])
          if (c) {
            const photo = db.photos.find(x => x.id === c.photo_id)
            if (c.user_id === user.id || (photo && photo.user_id === user.id)) {
              db.comments = db.comments.filter(x => x.id !== c.id); save(db)
            }
          }
          return json(res, 200, { ok: true })
        }
        const delM = url.match(/^\/share\/photos\/(\d+)$/)
        if (delM && m === 'DELETE') {
          db.photos = db.photos.filter(p => !(p.id === +delM[1] && p.user_id === user.id)); save(db)
          return json(res, 200, { ok: true })
        }
        const repM = url.match(/^\/share\/photos\/(\d+)\/report$/)
        if (repM && m === 'POST') {
          const p = db.photos.find(x => x.id === +repM[1])
          if (!p) return detail(res, 404, 'Not found')
          p.reports = (p.reports || 0) + 1
          if (p.reports >= 2) p.status = 'flagged'
          save(db)
          return json(res, 200, { ok: true })
        }
        return detail(res, 404, 'Unknown share endpoint')
      })
    },
  }
}
