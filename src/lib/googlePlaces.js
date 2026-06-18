// ── Google Places search helper ───────────────────────────────────────────
//
// Wraps the Google Maps JavaScript API's Places library (v=weekly, importLibrary
// style) so the rest of the app can call simple async functions:
//
//   await searchGooglePlaces("the met")           // → suggestions
//   await getGooglePlaceDetails(placeId)          // → { name, address, lat, lng, ... }
//
// Loading model: the Maps JS script is loaded lazily on first call so an unused
// page (Home, Map, etc.) pays no startup cost. The script is loaded only once;
// subsequent calls reuse window.google.maps.
//
// Session billing: Autocomplete + the matching Place Details call share an
// AutocompleteSessionToken to get charged as a single "session" (~$0.017 total
// instead of $0.034). The token resets after each Details call as required.
//
// TOS notes baked into how callers should use this:
//   • Always show a "Powered by Google" attribution near results
//   • Don't plot returned lat/lng on a non-Google map (e.g., Leaflet)
//     → in this app, Google-sourced lat/lng is stored on user_venues but
//       not used by MapScreen's Leaflet pins.

// Approximate Manhattan center; the 30km radius covers all five boroughs.
// Used as locationBias so "carbone" surfaces NYC's Carbone first.
const NYC_BIAS = {
  center: { lat: 40.7589, lng: -73.9851 },
  radius: 30000,
}

let scriptPromise = null

/** Returns true iff the env var is set. Used to gate the Google block in UI. */
export function isGooglePlacesAvailable() {
  return !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY
}

/** Loads the Maps JS bootstrap once. Subsequent calls return the cached promise.
 *
 *  Uses Google's official async loader snippet (copied from the docs). It sets up
 *  window.google.maps.importLibrary synchronously as a stub function — the real
 *  Maps script doesn't fetch until the first importLibrary('places') call. A naive
 *  <script src="..."> approach DOES NOT install importLibrary, which is why the
 *  modern Place / AutocompleteSuggestion classes wouldn't be reachable.
 */
function loadGoogleMapsScript() {
  if (scriptPromise) return scriptPromise
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!key) {
    scriptPromise = Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not set'))
    return scriptPromise
  }
  // Already bootstrapped (perhaps by another component) — just reuse.
  if (window.google?.maps?.importLibrary) {
    scriptPromise = Promise.resolve(window.google.maps)
    return scriptPromise
  }
  // Official async bootstrap loader (from Google Maps Platform docs, verbatim
  // shape, just dropped into a function so we can pass the API key in). It
  // installs google.maps.importLibrary as a queue; the first call to it triggers
  // the actual script load with `?libraries=places&v=weekly&callback=…`.
  ;((g) => {
    let h, a, k
    const p = 'The Google Maps JavaScript API'
    const c = 'google'
    const l = 'importLibrary'
    const q = '__ib__'
    const m = document
    let b = window
    b = b[c] || (b[c] = {})
    const d = b.maps || (b.maps = {})
    const r = new Set()
    const e = new URLSearchParams()
    const u = () => h || (h = new Promise(async (f, n) => {
      await (a = m.createElement('script'))
      e.set('libraries', [...r] + '')
      for (k in g) e.set(k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()), g[k])
      e.set('callback', c + '.maps.' + q)
      a.src = `https://maps.${c}apis.com/maps/api/js?` + e
      d[q] = f
      a.onerror = () => (h = n(Error(p + ' could not load.')))
      a.nonce = m.querySelector('script[nonce]')?.nonce || ''
      m.head.append(a)
    }))
    d[l]
      ? console.warn(p + ' only loads once. Ignoring:', g)
      : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)))
  })({ key, v: 'weekly' })

  scriptPromise = Promise.resolve(window.google.maps)
  return scriptPromise
}

// Session token: spans one Autocomplete burst + one Place Details call.
// Reset after each Details call (or after a long inactivity window).
let currentSessionToken = null
async function getSessionToken() {
  await loadGoogleMapsScript()
  const { AutocompleteSessionToken } = await window.google.maps.importLibrary('places')
  if (!currentSessionToken) currentSessionToken = new AutocompleteSessionToken()
  return currentSessionToken
}
function resetSessionToken() {
  currentSessionToken = null
}

/**
 * Fetch up to 8 Place Autocomplete suggestions for the input string,
 * biased toward NYC. Returns lightweight items suitable for a search list.
 */
export async function searchGooglePlaces(query) {
  const q = (query || '').trim()
  if (q.length < 2) return []
  await loadGoogleMapsScript()
  const { AutocompleteSuggestion } = await window.google.maps.importLibrary('places')
  const sessionToken = await getSessionToken()
  let response
  try {
    response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: q,
      sessionToken,
      locationBias: NYC_BIAS,
      region: 'us',
      // NOTE: We deliberately do NOT pass includedPrimaryTypes. Google's primary-type
      // filter is strict — a hybrid place like "Remi Flower Coffee" is classified as
      // `florist`, not `cafe`, so a category whitelist would silently exclude it.
      // The NYC locationBias is enough to keep results local; the user can decide
      // whether what they typed is what they want.
    })
  } catch (e) {
    console.warn('[googlePlaces] autocomplete failed:', e)
    return []
  }
  return (response?.suggestions || []).slice(0, 8).map(s => {
    const p = s.placePrediction
    return {
      placeId: p?.placeId,
      name: p?.mainText?.toString?.() || p?.text?.toString?.() || '',
      sub: p?.secondaryText?.toString?.() || '',
    }
  }).filter(it => it.placeId && it.name)
}

/**
 * Fetch full details for a placeId: name, address, lat/lng, plus the best
 * available neighborhood string extracted from addressComponents. Closes
 * the autocomplete billing session.
 */
export async function getGooglePlaceDetails(placeId) {
  if (!placeId) throw new Error('placeId is required')
  await loadGoogleMapsScript()
  const { Place } = await window.google.maps.importLibrary('places')
  const sessionToken = await getSessionToken()
  const place = new Place({ id: placeId, requestedLanguage: 'en' })
  try {
    await place.fetchFields({
      fields: ['displayName', 'formattedAddress', 'location', 'addressComponents'],
      sessionToken,
    })
  } catch (e) {
    resetSessionToken()
    throw e
  }
  resetSessionToken()

  const comps = place.addressComponents || []
  function pick(type) {
    return comps.find(c => c.types?.includes(type))?.longText
        || comps.find(c => c.types?.includes(type))?.shortText
        || ''
  }
  // Best-effort neighborhood resolution from address components.
  // Falls back through several plausible levels so we usually have something
  // that getAreaCluster() can match against.
  const neighborhood =
    pick('neighborhood') ||
    pick('sublocality_level_1') ||
    pick('sublocality') ||
    pick('locality') ||
    ''

  return {
    name: place.displayName || '',
    address: place.formattedAddress || '',
    lat: typeof place.location?.lat === 'function' ? place.location.lat() : null,
    lng: typeof place.location?.lng === 'function' ? place.location.lng() : null,
    neighborhood,
  }
}

/**
 * Resolve a place by free-text name (NYC-biased) and return its first Google
 * Places photo as a displayable URL, plus the author attribution Google's TOS
 * requires you to display, plus coordinates (useful for area classification).
 *
 * Returns null when: no API key, no autocomplete match, or the place carries
 * no photo. Callers should fall back gracefully (e.g., gradient card) on null.
 *
 * TOS compliance baked in:
 *   • The returned `attribution` array MUST be shown wherever the photo is
 *     displayed (each item: { name, uri }).
 *   • The returned `photoUrl` is fetched live via Photo.getURI(); do NOT
 *     permanently store the image bytes — cache the URL short-term only.
 *
 * Billing: one Autocomplete + one Place Details, charged as a single session
 * via a per-call AutocompleteSessionToken (kept separate from the search UI's
 * module-level token so the two don't interfere).
 */
export async function getPlacePhotoByName(name, { maxWidth = 480, hint = '' } = {}) {
  if (!isGooglePlacesAvailable()) return null
  const q = (name || '').trim()
  if (q.length < 2) return null
  // A name alone ("Gospel", "Smith") often matches the wrong place; appending the
  // address/neighborhood disambiguates so we fetch the correct venue's photo.
  const input = hint ? `${q} ${String(hint).trim()}` : q
  await loadGoogleMapsScript()
  const places = await window.google.maps.importLibrary('places')
  const { AutocompleteSuggestion, Place, AutocompleteSessionToken } = places
  const token = new AutocompleteSessionToken()

  // 1) Resolve the name → a modern placeId (our seed data only carries the
  //    legacy hex CID, which the Place class won't accept, so we search).
  let placeId = null
  try {
    const resp = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      sessionToken: token,
      locationBias: NYC_BIAS,
      region: 'us',
    })
    placeId = resp?.suggestions?.[0]?.placePrediction?.placeId || null
  } catch (e) {
    console.warn('[googlePlaces] photo autocomplete failed:', e)
    return null
  }
  if (!placeId) return null

  // 2) Fetch photos + location for that place.
  try {
    const place = new Place({ id: placeId, requestedLanguage: 'en' })
    await place.fetchFields({ fields: ['photos', 'location'], sessionToken: token })
    const photo = place.photos?.[0]
    if (!photo) return null
    const photoUrl = typeof photo.getURI === 'function' ? photo.getURI({ maxWidth }) : null
    if (!photoUrl) return null
    const attribution = (photo.authorAttributions || []).map(a => ({
      name: a?.displayName || '',
      uri: a?.uri || '',
    })).filter(a => a.name)
    return {
      photoUrl,
      attribution,
      lat: typeof place.location?.lat === 'function' ? place.location.lat() : null,
      lng: typeof place.location?.lng === 'function' ? place.location.lng() : null,
    }
  } catch (e) {
    console.warn('[googlePlaces] photo details failed:', e)
    return null
  }
}
