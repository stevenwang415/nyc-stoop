// Auth UI: AuthModal (sign-in / sign-up + Google), ForgotPasswordModal,
// ResetPasswordScreen, GoogleButton. Designed to match the existing modal
// language (bottom-sheet, drag handle, gray-100 bg pill inputs).
//
// State flow:
//   AuthModal.tab === 'signin' | 'signup' | 'forgot' (forgot is local to the modal)
//   On success the caller's onSuccess({ token, user }) handler stores creds.

import React from 'react'
import {
  signup, login, googleAuth, forgotPassword, resetPassword,
  decodeJwtPayload, ApiError,
} from './api'

// IMPORTANT: don't use optional chaining here. Vite's static env replacement
// only matches the literal `import.meta.env.VITE_FOO` pattern; `import.meta?.env?.`
// is left as-is and reads as undefined at runtime.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''


// ── Reusable styles ───────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '11px 14px', fontSize: 15,
  background: 'var(--gray-100)', border: '1px solid var(--gray-200)',
  borderRadius: 12, outline: 'none', fontFamily: 'inherit',
  color: 'var(--gray-900)', boxSizing: 'border-box',
}

const primaryBtn = {
  width: '100%', padding: '13px 16px',
  background: 'var(--gray-900)', color: '#fff',
  border: 'none', borderRadius: 12, cursor: 'pointer',
  fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
}

const subtleBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 12, color: 'var(--gray-500)', padding: '4px 6px',
  fontFamily: 'inherit',
}

const sheetWrap = {
  position: 'fixed', inset: 0, zIndex: 950,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
}
const sheetInner = {
  background: 'var(--white)', borderRadius: '20px 20px 0 0',
  width: '100%', maxWidth: 460,
  maxHeight: '92vh', overflowY: 'auto',
  boxSizing: 'border-box',
  paddingBottom: 'env(safe-area-inset-bottom, 16px)',
}


// ── Google sign-in button ─────────────────────────────────────────────────
// Renders the official GIS button via window.google.accounts.id.renderButton().
// onCredential receives the raw ID token; the caller posts it to /auth/google.
function GoogleButton({ onCredential, onError, label = 'Continue with Google' }) {
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    let cancelled = false

    function tryRender() {
      if (cancelled) return
      const g = window.google?.accounts?.id
      if (!g || !containerRef.current) {
        // Script may still be loading; poll up to ~3s.
        return setTimeout(tryRender, 100)
      }
      try {
        g.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) onCredential(response.credential)
            else onError?.(new Error('No credential from Google'))
          },
          auto_select: false,
          ux_mode: 'popup',
        })
        // Clear any previous render before re-rendering.
        containerRef.current.innerHTML = ''
        g.renderButton(containerRef.current, {
          theme: 'outline', size: 'large', shape: 'pill',
          text: 'continue_with', logo_alignment: 'left',
          width: 300,
        })
      } catch (e) {
        onError?.(e)
      }
    }
    tryRender()
    return () => { cancelled = true }
  }, [onCredential, onError])

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div style={{
        padding: '10px 14px', background: 'var(--gray-50)',
        border: '1px dashed var(--gray-300)', borderRadius: 12,
        fontSize: 12, color: 'var(--gray-500)', textAlign: 'center',
      }}>
        Google sign-in unavailable — set <code style={{ fontSize: 11 }}>VITE_GOOGLE_CLIENT_ID</code> in <code style={{ fontSize: 11 }}>.env.local</code>.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div ref={containerRef} aria-label={label} />
    </div>
  )
}


// ── Top-level auth modal ──────────────────────────────────────────────────
export function AuthModal({ onClose, onSuccess, initialTab = 'signin' }) {
  const [tab, setTab] = React.useState(initialTab) // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [displayName, setDisplayName] = React.useState('')
  const [error, setError] = React.useState('')
  const [info, setInfo] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  async function handleSubmit(e) {
    e?.preventDefault?.()
    setError(''); setInfo('')

    if (tab === 'forgot') {
      if (!email.trim()) { setError('Enter your email.'); return }
      setBusy(true)
      try {
        await forgotPassword(email.trim())
        setInfo('If an account exists for that email, a reset link is on its way.')
      } catch (e) {
        setError(e.message || 'Could not send reset email.')
      } finally { setBusy(false) }
      return
    }

    if (!email.trim() || !password) {
      setError('Email and password are required.'); return
    }
    if (tab === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters.'); return
    }
    setBusy(true)
    try {
      const fn = tab === 'signup' ? signup : login
      const arg = tab === 'signup'
        ? { email: email.trim(), password, displayName: displayName.trim() || null }
        : { email: email.trim(), password }
      const res = await fn(arg)
      onSuccess?.({ token: res.access_token, user: res.user })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Something went wrong.')
    } finally { setBusy(false) }
  }

  async function handleGoogleCredential(credential) {
    setError(''); setInfo(''); setBusy(true)
    // Optimistic preview from the unverified JWT — backend will verify.
    const preview = decodeJwtPayload(credential)
    try {
      const res = await googleAuth(credential)
      onSuccess?.({ token: res.access_token, user: res.user })
    } catch (e) {
      setError(e.message || 'Google sign-in failed.')
      if (preview?.email) setEmail(preview.email)
    } finally { setBusy(false) }
  }

  const title = tab === 'signup' ? 'Create your account'
              : tab === 'forgot' ? 'Reset your password'
              :                    'Sign in to NYC Stoop'

  return (
    <div onClick={onClose} style={sheetWrap}>
      <div onClick={e => e.stopPropagation()} style={sheetInner}>
        {/* Drag handle */}
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--gray-300)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2 }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
              {tab === 'forgot'
                ? "Enter your email and we'll send you a reset link."
                : 'Sync your saves and trip plan across devices.'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'var(--gray-100)', border: 'none', borderRadius: 999,
            width: 32, height: 32, cursor: 'pointer',
            fontSize: 16, color: 'var(--gray-500)', lineHeight: 1, flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Tab switch — hidden when in forgot-password sub-state */}
        {tab !== 'forgot' && (
          <div style={{ padding: '0 20px 14px' }}>
            <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 12, padding: 4, gap: 4 }}>
              {[['signin', 'Sign in'], ['signup', 'Create account']].map(([key, label]) => (
                <button key={key} onClick={() => { setTab(key); setError(''); setInfo('') }}
                  style={{
                    flex: 1, padding: '8px 10px', border: 'none', cursor: 'pointer',
                    background: tab === key ? 'var(--white)' : 'transparent',
                    color: tab === key ? 'var(--gray-900)' : 'var(--gray-500)',
                    fontSize: 13, fontWeight: tab === key ? 700 : 500,
                    borderRadius: 9, fontFamily: 'inherit',
                    boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  }}
                >{label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Google block — hidden in forgot tab */}
        {tab !== 'forgot' && (
          <div style={{ padding: '0 20px 14px' }}>
            <GoogleButton
              onCredential={handleGoogleCredential}
              onError={() => setError('Google sign-in failed. Try email + password.')}
            />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 0 4px',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
              <span style={{ fontSize: 11, color: 'var(--gray-400)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                or with email
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 20px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email" autoComplete="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)}
            style={inputStyle} required
          />

          {tab !== 'forgot' && (
            <input
              type="password"
              autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
              placeholder={tab === 'signup' ? 'Choose a password (8+ chars)' : 'Password'}
              value={password} onChange={e => setPassword(e.target.value)}
              style={inputStyle} required minLength={tab === 'signup' ? 8 : 1}
            />
          )}

          {tab === 'signup' && (
            <input
              type="text" autoComplete="name" placeholder="Display name (optional)"
              value={displayName} onChange={e => setDisplayName(e.target.value)}
              style={inputStyle}
            />
          )}

          {error && (
            <div style={{
              fontSize: 13, color: '#991b1b', background: '#fef2f2',
              padding: '9px 12px', borderRadius: 10, lineHeight: 1.45,
            }}>{error}</div>
          )}
          {info && (
            <div style={{
              fontSize: 13, color: '#166534', background: '#f0fdf4',
              padding: '9px 12px', borderRadius: 10, lineHeight: 1.45,
            }}>{info}</div>
          )}

          <button type="submit" disabled={busy} style={{
            ...primaryBtn, opacity: busy ? 0.6 : 1, marginTop: 4,
          }}>
            {busy ? 'Working…'
              : tab === 'signup' ? 'Create account'
              : tab === 'forgot' ? 'Send reset link'
              :                    'Sign in'}
          </button>

          {/* Footer links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0 12px' }}>
            {tab === 'signin' && (
              <button type="button" onClick={() => { setTab('forgot'); setError(''); setInfo('') }} style={subtleBtn}>
                Forgot password?
              </button>
            )}
            {tab === 'forgot' && (
              <button type="button" onClick={() => { setTab('signin'); setError(''); setInfo('') }} style={subtleBtn}>
                ← Back to sign in
              </button>
            )}
            <span style={{ flex: 1 }} />
          </div>
        </form>
      </div>
    </div>
  )
}


// ── Reset-password screen (rendered when ?reset_token=… is in the URL) ────
export function ResetPasswordScreen({ token, onSuccess, onCancel }) {
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm]   = React.useState('')
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError("Passwords don't match."); return }
    setBusy(true)
    try {
      const res = await resetPassword({ token, password })
      onSuccess?.({ token: res.access_token, user: res.user })
    } catch (e) {
      setError(e.message || 'Could not reset password.')
    } finally { setBusy(false) }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 40px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)',
      padding: 'calc(env(safe-area-inset-top, 0px) + 40px) 24px calc(env(safe-area-inset-bottom, 0px) + 40px)',
      background: 'var(--white)',
      maxWidth: 460, margin: '0 auto',
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 6 }}>
        Set a new password
      </div>
      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 24, lineHeight: 1.5 }}>
        Pick a strong password (8+ characters). After you save, you'll be signed in.
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="password" autoComplete="new-password" placeholder="New password (8+ chars)"
          value={password} onChange={e => setPassword(e.target.value)}
          style={inputStyle} required minLength={8}
        />
        <input
          type="password" autoComplete="new-password" placeholder="Confirm new password"
          value={confirm} onChange={e => setConfirm(e.target.value)}
          style={inputStyle} required minLength={8}
        />
        {error && (
          <div style={{
            fontSize: 13, color: '#991b1b', background: '#fef2f2',
            padding: '9px 12px', borderRadius: 10, lineHeight: 1.45,
          }}>{error}</div>
        )}
        <button type="submit" disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.6 : 1, marginTop: 4 }}>
          {busy ? 'Saving…' : 'Set password & sign in'}
        </button>
        <button type="button" onClick={onCancel} style={{
          ...primaryBtn, background: 'var(--gray-100)', color: 'var(--gray-700)',
        }}>
          Cancel
        </button>
      </form>
    </div>
  )
}
