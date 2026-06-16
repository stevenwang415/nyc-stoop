// ── Your picks — personal curation surfaced in the mood flow ────────────────
// Five per activity. Two kinds of entry:
//   • saved:true  — from the 62 Google Maps saves. No editorial detail, so they
//                   link out to Google Maps. `area` is hand-assigned (the saves
//                   carry no coordinates), so they filter to the RIGHT borough+
//                   area and never surface in the wrong neighborhood.
//   • venueId     — reuse an existing editorial venue (area derived from its
//                   real coordinates). Used to fill the activities the saves
//                   don't cover (outdoors, culture, most of live).
//
// area ids match the mood map: manhattan = uptown|uws|ues|mw|me|chelsea|
// gramercy|wv|ev|lower ; brooklyn = bk_north|bk_downtown|bk_central|bk_south.
const mapsUrl = (name) => `https://www.google.com/maps/search/${encodeURIComponent(name + ' NYC')}`

export const userPicks = [
  // ── EAT (saved) ──
  { name: 'Don Angie',            activity: 'eat', borough: 'manhattan', area: 'wv',       note: 'West Village · Italian',     saved: true },
  { name: "L'industrie Pizzeria", activity: 'eat', borough: 'brooklyn',  area: 'bk_williamsburg', note: 'Williamsburg · pizza',  saved: true },
  { name: 'Ivan Ramen',           activity: 'eat', borough: 'manhattan', area: 'ev',       note: 'Lower East Side · ramen',     saved: true },
  { name: 'Barney Greengrass',    activity: 'eat', borough: 'manhattan', area: 'uws',      note: 'Upper West Side · deli',      saved: true },
  { name: 'Hometown Bar-B-Que',   activity: 'eat', borough: 'brooklyn',  area: 'bk_south', note: 'Red Hook · barbecue',         saved: true },

  // ── COFFEE (saved) ──
  { name: 'SEY Coffee',           activity: 'coffee', borough: 'brooklyn',  area: 'bk_north', note: 'Bushwick · roaster',        saved: true },
  { name: 'Sawada Coffee',        activity: 'coffee', borough: 'manhattan', area: 'chelsea',  note: 'Chelsea · matcha + coffee', saved: true },
  { name: 'Dayglow',              activity: 'coffee', borough: 'manhattan', area: 'ev',       note: 'East Village · specialty',  saved: true },
  { name: 'Ludlow Coffee Supply', activity: 'coffee', borough: 'manhattan', area: 'ev',       note: 'Lower East Side',           saved: true },
  { name: 'Ciao, Gloria',         activity: 'coffee', borough: 'brooklyn',  area: 'bk_prospect_hts', note: 'Prospect Heights · café', saved: true },

  // ── DRINKS (saved) ──
  { name: 'Red Hook Tavern',      activity: 'drinks', borough: 'brooklyn',  area: 'bk_south', note: 'Red Hook · tavern',        saved: true },
  { name: 'Soju Haus',            activity: 'drinks', borough: 'manhattan', area: 'mw',       note: 'Koreatown · soju bar',      saved: true },
  { name: 'Salon on Kingston',    activity: 'drinks', borough: 'brooklyn',  area: 'bk_crown_hts', note: 'Crown Heights · wine',    saved: true },
  { name: 'Pura Vida',            activity: 'drinks', borough: 'manhattan', area: 'gramercy', note: 'NoMad · cocktails',         saved: true },
  { name: 'Torizaku',             activity: 'drinks', borough: 'manhattan', area: 'ev',       note: 'East Village · izakaya',    saved: true },

  // ── LIVE (1 saved + 4 from our database) ──
  { name: 'Ornithology Jazz Club', activity: 'live', borough: 'brooklyn', area: 'bk_north', note: 'Bushwick · jazz', saved: true },
  { venueId: 'village_vanguard', activity: 'live' },
  { venueId: 'blue_note',        activity: 'live' },
  { venueId: 'birdland',         activity: 'live' },
  { venueId: 'carnegie_hall',    activity: 'live' },

  // ── OUTDOORS (from our database — real coordinates) ──
  { venueId: 'high_line',              activity: 'outdoors' },
  { venueId: 'central_park',           activity: 'outdoors' },
  { venueId: 'bryant_park',            activity: 'outdoors' },
  { venueId: 'washington_square_park', activity: 'outdoors' },
  { venueId: 'brooklyn_bridge_arch',   activity: 'outdoors' },

  // ── CULTURE (from our database — real coordinates) ──
  { venueId: 'met',             activity: 'culture' },
  { venueId: 'moma',            activity: 'culture' },
  { venueId: 'whitney',         activity: 'culture' },
  { venueId: 'guggenheim',      activity: 'culture' },
  { venueId: 'tenement_museum', activity: 'culture' },
]

export { mapsUrl }
export default userPicks
