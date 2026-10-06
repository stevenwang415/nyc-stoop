// ── Local-date helpers (2026-10-06) ─────────────────────────────────────────
// created_at comes from the server in UTC. Slicing the ISO string shows the
// UTC date — a post made 10/5 evening in New York displayed as 10/6 (field
// report). Always convert to the device's timezone before showing a date.

/** Parse an ISO timestamp, treating timezone-less strings as UTC. */
export function parseUTC(iso) {
  if (!iso) return null
  const d = new Date(/[zZ]$|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : iso + 'Z')
  return isNaN(d) ? null : d
}

/** Local calendar date as YYYY-MM-DD (same look as before, right timezone). */
export function localYMD(iso) {
  const d = parseUTC(iso)
  if (!d) return (iso || '').slice(0, 10)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Local MM/DD (stamp captions). */
export function localMD(iso) {
  const d = parseUTC(iso)
  if (!d) return (iso || '').slice(5, 10).replace('-', '/')
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}
