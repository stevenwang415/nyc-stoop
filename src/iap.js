// ── In-app purchase: ONE non-consumable, the $3.99 lifetime unlock ──────────
//
// Free tier:  all browsing (Explore, Events, Map), saving places,
//             a FULL 1-day routed plan with meals, and 1 saved plan.
// Plus tier:  multi-day trips, unlimited saved plans, PDF export.
//
// Rules of this module:
// - Web builds (the Vercel site) have no App Store — everything stays free
//   there. Gating applies only to native iOS.
// - Apple guideline 3.1.1: the purchase itself goes through StoreKit via
//   cordova-plugin-purchase. This module degrades gracefully when the plugin
//   isn't installed (buy button explains instead of crashing).
// - Entitlement is per-device/Apple-ID, NOT per app account — nyc_plus_v1 is
//   listed in PROFILE_GLOBAL_KEYS so switching accounts never locks it.
// - `nyc_iap_gate_test = '1'` in localStorage forces the gates ON in a web
//   browser, so the free-tier UX can be tested without a device.

import { Capacitor } from '@capacitor/core'

export const PLUS_PRODUCT_ID = 'com.nycstoop.app.lifetime'
const OWNED_KEY = 'nyc_plus_v1'

// ── MASTER SWITCH (2026-07-16): v1.0 ships FULLY FREE — everything unlocked,
// no paywall, no Lifetime-unlock row. Apple reviews an IAP together with the
// app, so gates without a live product are a rejection. Flip to true for the
// v1.1 update AFTER: ASC product created + Paid Apps agreement signed +
// sandbox purchase & restore tested (see PUBLISH_IOS.md IAP section).
export const IAP_ENABLED = false

const isNativeIos = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios'

export function hasPlus() {
  try {
    if (!IAP_ENABLED) return true // v1.0: everything free
    if (localStorage.getItem(OWNED_KEY) === '1') return true
    if (localStorage.getItem('nyc_iap_gate_test') === '1') return false
    return !isNativeIos() // web: free
  } catch { return true }
}

function setOwned(owned) {
  try {
    if (owned) localStorage.setItem(OWNED_KEY, '1')
    else localStorage.removeItem(OWNED_KEY)
  } catch {}
  window.dispatchEvent(new Event('nyc-plus-changed'))
}

// React hook — components re-render when the entitlement changes.
// (Plain subscribe/getSnapshot; no external state library.)
import { useSyncExternalStore } from 'react'
const subscribe = (cb) => {
  window.addEventListener('nyc-plus-changed', cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener('nyc-plus-changed', cb)
    window.removeEventListener('storage', cb)
  }
}
export function usePlus() {
  return useSyncExternalStore(subscribe, hasPlus, hasPlus)
}

// The paywall is rendered once at the app root; anything anywhere can open it.
export function openPaywall(reason) {
  window.dispatchEvent(new CustomEvent('nyc-open-paywall', { detail: { reason } }))
}

// ── StoreKit wiring (cordova-plugin-purchase v13) ────────────────────────────
let store = null

export function initIap() {
  if (!IAP_ENABLED) return
  if (!isNativeIos()) return
  const Cdv = window.CdvPurchase
  if (!Cdv) return // plugin not installed — purchase UI will say so
  try {
    store = Cdv.store
    store.register([{
      id: PLUS_PRODUCT_ID,
      type: Cdv.ProductType.NON_CONSUMABLE,
      platform: Cdv.Platform.APPLE_APPSTORE,
    }])
    store.when()
      .approved(tr => tr.verify())
      .verified(receipt => { receipt.finish(); setOwned(true) })
      .productUpdated(p => { if (p.id === PLUS_PRODUCT_ID && p.owned) setOwned(true) })
    store.ready(() => {
      const p = store.get(PLUS_PRODUCT_ID, Cdv.Platform.APPLE_APPSTORE)
      if (p?.owned) setOwned(true)
    })
    store.initialize([Cdv.Platform.APPLE_APPSTORE])
  } catch (e) {
    console.warn('IAP init failed', e)
    store = null
  }
}

// Localized price from the App Store when available, sticker price otherwise.
export function plusPrice() {
  try {
    return store?.get(PLUS_PRODUCT_ID)?.pricing?.price || '$3.99'
  } catch { return '$3.99' }
}

export async function buyPlus() {
  if (!store) throw new Error('The App Store connection isn’t ready. Please try again in a moment.')
  const product = store.get(PLUS_PRODUCT_ID)
  const offer = product?.getOffer()
  if (!offer) throw new Error('Product unavailable right now. Please try again later.')
  await offer.order() // resolution arrives via approved → verified → setOwned
}

export async function restorePlus() {
  if (!store) throw new Error('The App Store connection isn’t ready. Please try again in a moment.')
  await store.restorePurchases()
  const p = store.get(PLUS_PRODUCT_ID)
  if (p?.owned) setOwned(true)
  return !!p?.owned
}
