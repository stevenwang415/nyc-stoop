// Auth API client + localStorage helpers.
//
// Storage layout (3 separate keys):
//   nyc_token           — raw JWT string
//   nyc_user            — JSON: { id, email, display_name, picture_url, has_password, has_google }
//   nyc_avatar_by_email — JSON: { "<email>": { avatar: "data:image/jpeg;base64,…", nickname: "…" } }
//
// The avatar/nickname store is deliberately NOT cleared on sign-out — when the
// same user signs back in we want their avatar back. Backend display_name still
// wins for cross-device usage; the per-email nickname is an offline override.

// Same Vite gotcha as in components.jsx: must be plain `import.meta.env.X`,
// no optional chaining, or the build-time replacement doesn't fire.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

const TOKEN_KEY    = 'nyc_token'
const USER_KEY     = 'nyc_user'
const PROFILE_KEY  = 'nyc_avatar_by_email'  // legacy name kept for compatibility


// ── Token + user storage ──────────────────────────────────────────────────
export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || null } catch { return null }
}
export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {}
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
export function setUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch {}
}

/** Sign out clears the token + user object but preserves the per-email avatar store
 *  so the next sign-in restores the avatar without a re-upload. */
export function signOut() {
  setToken(null)
  setUser(null)
}

export function isSignedIn() { return !!getToken() && !!getUser() }


// ── Per-email avatar + nickname overlay ───────────────────────────────────
function readProfileStore() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') || {} }
  catch { return {} }
}
function writeProfileStore(store) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(store)) } catch {}
}

export function getProfileOverlay(email) {
  if (!email) return { avatar: null, nickname: null }
  const store = readProfileStore()
  const entry = store[email.toLowerCase()] || {}
  return { avatar: entry.avatar || null, nickname: entry.nickname || null }
}

export function setAvatar(email, dataUrl) {
  if (!email) return
  const store = readProfileStore()
  const key = email.toLowerCase()
  store[key] = { ...(store[key] || {}), avatar: dataUrl || null }
  if (!dataUrl) delete store[key].avatar
  writeProfileStore(store)
}

export function setNickname(email, nickname) {
  if (!email) return
  const store = readProfileStore()
  const key = email.toLowerCase()
  store[key] = { ...(store[key] || {}), nickname: nickname || null }
  if (!nickname) delete store[key].nickname
  writeProfileStore(store)
}


// ── Decoded JWT helper (used for optimistic Google sign-in) ───────────────
/** Decode a JWT payload locally without verifying. Only safe for read-only
 *  optimistic UI — never trust this for authorization. */
export function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1]
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '==='.slice((b64.length + 3) % 4)
    return JSON.parse(atob(padded))
  } catch { return null }
}


// ── HTTP layer ────────────────────────────────────────────────────────────
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    throw new ApiError(0, 'Network error — is the API reachable?')
  }
  let data = null
  try { data = await res.json() } catch {}
  if (!res.ok) {
    const detail = (data && (data.detail || data.message)) || res.statusText || 'Request failed'
    throw new ApiError(res.status, String(detail))
  }
  return data
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}


// ── Auth endpoints ────────────────────────────────────────────────────────
export async function signup({ email, password, displayName }) {
  return request('/auth/signup', {
    method: 'POST',
    body: { email, password, display_name: displayName || null },
  })
}

export async function login({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}

export async function googleAuth(credential) {
  return request('/auth/google', { method: 'POST', body: { credential } })
}

export async function appleAuth(identityToken, fullName = null) {
  return request('/auth/apple', { method: 'POST', body: { identity_token: identityToken, full_name: fullName } })
}

export async function forgotPassword(email) {
  return request('/auth/forgot-password', { method: 'POST', body: { email } })
}

export async function resetPassword({ token, password }) {
  return request('/auth/reset-password', { method: 'POST', body: { token, password } })
}

export async function fetchMe() {
  return request('/auth/me', { method: 'GET', auth: true })
}

export async function updateDisplayName(displayName) {
  const qs = new URLSearchParams({ display_name: displayName || '' })
  return request(`/auth/me?${qs.toString()}`, { method: 'PATCH', auth: true })
}

/** Permanently delete the signed-in account (App Review 5.1.1(v)).
 *  Caller is responsible for signOut() + local-state cleanup afterwards. */
export async function deleteAccount() {
  return request('/auth/me', { method: 'DELETE', auth: true })
}


// ── Avatar resize helper (canvas + FileReader) ────────────────────────────
/** Resize a File to a max 256x256 JPEG data URL at 85% quality.
 *  All client-side; nothing uploaded. */
export function resizeImageFile(file, { maxSize = 256, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not decode that image.'))
      img.onload = () => {
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1)
        const w = Math.round(img.width * ratio)
        const h = Math.round(img.height * ratio)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        try {
          resolve(canvas.toDataURL('image/jpeg', quality))
        } catch (e) {
          reject(new Error('Could not encode the image.'))
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
