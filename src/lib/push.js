// ── Push notifications (2026-09-24, v2.2) ──────────────────────────────────
// Native iOS only: asks permission, registers the APNs device token with the
// backend, and re-claims the token on account switch. Web quietly no-ops.
// The backend fires the actual alerts (friend posted / commented / liked).
import { getToken } from '../auth/api.js'

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

let _registered = false
let _lastToken = null

async function post(path, body) {
  const tok = getToken()
  if (!tok) return
  try {
    await fetch(API_URL + path, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {}
}

/** Call after sign-in (and on app boot when already signed in). Safe to call
 *  repeatedly — listeners attach once, and iOS only shows the permission
 *  dialog the first time ever. */
export async function initPush() {
  try {
    if (!window.Capacitor?.isNativePlatform?.()) return
    const { PushNotifications } = await import('@capacitor/push-notifications')
    if (!_registered) {
      _registered = true
      PushNotifications.addListener('registration', (t) => {
        _lastToken = t.value
        post('/share/push/register', { token: t.value, platform: 'ios' })
      })
      PushNotifications.addListener('registrationError', () => {})
    }
    let perm = await PushNotifications.checkPermissions()
    if (perm.receive === 'prompt') perm = await PushNotifications.requestPermissions()
    if (perm.receive === 'granted') await PushNotifications.register()
  } catch {}
}

/** Call on sign-out so the device stops getting the old account's alerts. */
export async function teardownPush() {
  if (_lastToken) await post('/share/push/unregister', { token: _lastToken, platform: 'ios' })
}
