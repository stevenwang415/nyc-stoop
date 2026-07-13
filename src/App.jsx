import React, { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { tonightPicks } from './data/tonight.js'
import { moods, moodById, flattenMoodPicks, ACTIVITIES, ACTIVITY_ORDER } from './data/moods.js'
import { userPicks, mapsUrl } from './data/userPicks.js'
import {
  domains, topics, figures, works, venues,
  getWorksByFigure, getWorksAtVenue, getSeeAlsoNearby,
  getVenueInterests, getRelatedVenues,
} from './data/content.js'
// Auth: localStorage helpers, API client, and UI components.
import {
  getToken, getUser, setToken as authSetToken, setUser as authSetUser,
  signOut as authSignOut, fetchMe, updateDisplayName,
  getProfileOverlay, setAvatar as authSetAvatar, setNickname as authSetNickname,
  resizeImageFile,
} from './auth/api'
import { AuthModal, ResetPasswordScreen } from './auth/components.jsx'
// Google Places search — used by AddStopToDayModal to let users add places
// that aren't in our curated catalog. Falls back gracefully if the key is unset.
import { isGooglePlacesAvailable, searchGooglePlaces, getGooglePlaceDetails, getPlacePhotoByName } from './lib/googlePlaces'
import { fetchThisWeek, getThisWeekCached, eventMapsUrl, eventSearchUrl, eventTicketSearchUrl, eventOfficialUrl } from './lib/nycEvents'
import { fetchTicketmaster } from './lib/ticketmaster'
import { parseTakeoutFile } from './lib/googleTakeout'
import { extractShareHash, decodeTrip, buildShareUrl } from './lib/tripShare'
// Module-level lookup tables. Moved out of this file for cleanliness — see
// the data files for the actual entries and how to add more.
import { venueColors, venueCoords } from './data/venueMeta.js'
// Hero photos for top venues (Wikimedia) — layered over the gradient fallback.
import { venueImages } from './data/venueImages.js'
// Bulk-imported user places — merged into userVenues on app boot
// (idempotent by stable `seed_*` ids so re-runs don't duplicate).
import { seedUserPlaces } from './data/places.js'
import { t, t2, getLang, setLang, getUnit, setUnit, fmtTemp, unitLabel, dateLocale } from './lib/i18n.js'
import { findSubwayLeg } from './data/subway.js'

// Safe localStorage write — Safari private mode and WKWebView storage pressure
// can throw on setItem; a failed persist should never crash the app.
function lsSet(key, value) {
  try { window.localStorage.setItem(key, value) } catch {}
}

// (venueColors + venueCoords previously lived inline here — ~210 lines of
// hardcoded data. Moved to ./data/venueMeta.js so this file stays focused on
// app logic. Add new entries there, then re-import here as needed.)
// Clip text to `max` chars on a WORD boundary (never mid-word) with an ellipsis.
function clipWords(str, max) {
  const s = (str || '').trim()
  if (s.length <= max) return s
  return s.slice(0, max).replace(/\s+\S*$/, '').trimEnd() + '…'
}

// First sentence of a blurb/tip, but skip terminators inside common abbreviations
// ("Los Tacos No. 1" must not become "Los Tacos No.") and require a sensible
// minimum length so a tiny lead-in pulls in the rest. Word-boundary clipped.
const _SENTENCE_ABBR = /(?:^|\s)(?:no|st|ave|rd|blvd|dr|mr|mrs|ms|vs|jr|sr|mt|ft|approx|etc|e\.g|i\.e)\.$/i
function firstSentence(text, max = 140) {
  const t = (text || '').trim()
  if (!t) return ''
  const re = /[.!?](?:["'])?(?=\s|$)/g
  let m, first = ''
  while ((m = re.exec(t)) !== null) {
    const cand = t.slice(0, m.index + 1).trim()
    if (cand.length >= 30 && !_SENTENCE_ABBR.test(cand)) { first = cand; break }
  }
  if (!first) first = t.split(/\n/)[0]
  return first.length > max ? clipWords(first, max) : first
}

// ── User-place categories — for user-added venues (kept separate from editorial domains) ──
const USER_PLACE_CATEGORIES = [
  { id: 'food',      label: 'Food',           emoji: '🍴' },
  { id: 'coffee',    label: 'Coffee',         emoji: '☕' },
  { id: 'drinks',    label: 'Drinks',         emoji: '🍷' },
  { id: 'music',     label: 'Music',          emoji: '🎵' },
  { id: 'art',       label: 'Art / Museum',   emoji: '🎨' },
  { id: 'outdoors',  label: 'Outdoors',       emoji: '🌳' },
  { id: 'shopping',  label: 'Shopping',       emoji: '🛍️' },
  { id: 'activity',  label: 'Activity',       emoji: '🎢' },
  { id: 'other',     label: 'Other',          emoji: '✨' },
]

// ── Neighborhood groups (module-level so HomeScreen + NeighborhoodScreen share) ──
// `comingSoon: true` marks a borough we want visible in the grid for geographic
// completeness, but whose editorial coverage hasn't landed yet. The chip + the
// detail screen both get a "Coming soon" treatment instead of looking dim/broken.
// Order is deliberate (reads left-to-right, top-to-bottom in the chip grid):
// Manhattan first by first-time-visitor priority — Midtown, Lower Manhattan,
// Central Park lead because they're the most iconic — then museums (UES/UWS),
// then cultural cores (Greenwich, Harlem). Outer boroughs follow by venue
// density: Brooklyn (live), then Queens / The Bronx / Staten Island (coming soon).
const NEIGHBORHOOD_GROUPS = [
  // ── Manhattan, by first-time-visitor priority ──
  { key: 'midtown',         label: 'Midtown',           emoji: '🏙️', match: n => /midtown|columbus circle|times square/i.test(n) },
  { key: 'lower_manhattan', label: 'Lower Manhattan',   emoji: '🗽', match: n => /financial district|lower manhattan|civic center|downtown|lower east/i.test(n) },
  { key: 'central_park',    label: 'Central Park',      emoji: '🌳', match: n => /central park/i.test(n) },
  { key: 'upper_east',      label: 'Upper East Side',   emoji: '🎨', match: n => /upper east/i.test(n) },
  { key: 'upper_west',      label: 'Upper West Side',   emoji: '🎼', match: n => /upper west|lincoln center|morningside/i.test(n) },
  { key: 'greenwich',       label: 'Greenwich Village', emoji: '🎷', match: n => /greenwich|west village|noho|east village|chelsea|meatpacking/i.test(n) },
  { key: 'harlem',          label: 'Harlem',            emoji: '🎶', match: n => /harlem/i.test(n) },
  // ── Outer boroughs, by venue density ──
  { key: 'brooklyn',        label: 'Brooklyn',          emoji: '🌉', match: n => /brooklyn|dumbo|greenpoint|williamsburg|bushwick|fort greene|clinton hill|prospect heights|park slope|crown heights/i.test(n) },
  { key: 'queens',          label: 'Queens',            emoji: '🎺', match: n => /queens/i.test(n),    comingSoon: true,
    tease: 'Long Island City, Astoria, Flushing, and the Rockaways. Coming soon.' },
  { key: 'bronx',           label: 'The Bronx',         emoji: '⚾', match: n => /bronx/i.test(n),     comingSoon: true,
    tease: 'Yankee Stadium, Arthur Avenue, the Bronx Zoo, and the New York Botanical Garden. Coming soon.' },
  // { key: 'staten_island',   label: 'Staten Island',     emoji: '⛴️', match: n => /staten island/i.test(n), comingSoon: true,
  //   tease: 'The free ferry, Snug Harbor, and the North Shore. Coming soon.' },
]

function getNeighborhoodVenues(key, venuesObj) {
  const grp = NEIGHBORHOOD_GROUPS.find(g => g.key === key)
  if (!grp) return []
  return Object.values(venuesObj).filter(v => v.neighborhood && grp.match(v.neighborhood))
}

// ── Sub-neighborhoods — granular areas within a top-level neighborhood. ──
// Keeps the main 10-chip grid clean while still letting users target specific places like Williamsburg or DUMBO
// when adding a custom venue or browsing the Brooklyn detail screen. Structure is extensible to other boroughs.
const NEIGHBORHOOD_SUBAREAS = {
  brooklyn: [
    {
      key: 'northern_brooklyn',
      label: 'Northern Brooklyn',
      areas: [
        {
          name: 'Greenpoint',
          desc: "Brooklyn's northernmost tip — Polish heritage, waterfront parks, indie dining",
          sights: [
            { icon: '🌳', name: 'McCarren Park',              desc: "Northern Brooklyn's main park — track, pool, and the Saturday farmers market." },
            { icon: '🌊', name: 'Transmitter Park',           desc: 'Small waterfront park with a knockout Manhattan skyline view.' },
            { icon: '🍞', name: 'Manhattan Avenue',           desc: 'Polish bakeries, butchers, and old-world delis lining the main commercial spine.' },
            { icon: '🎵', name: 'Warsaw',                     desc: 'Iconic concert venue inside the Polish National Home — pierogies between sets.' },
            { icon: '☕', name: 'Variety Coffee',             desc: 'Anchor coffee spot for the neighborhood; long bench seating, fast wifi.' },
          ],
        },
        {
          name: 'Williamsburg',
          desc: 'Trendy, creative, luxury waterfront condos, nightlife hub',
          sights: [
            { icon: '🌊', name: 'Domino Park',                desc: 'Waterfront promenade built around the old Domino Sugar Refinery — taco stand, dog run, knockout views.' },
            { icon: '🍴', name: 'Smorgasburg',                desc: '80+ food vendors at the East River State Park, Saturdays April through October.' },
            { icon: '🍺', name: 'Brooklyn Brewery',           desc: 'Tours and tastings at the original Williamsburg craft brewery on N 11th St.' },
            { icon: '🎵', name: 'Music Hall of Williamsburg', desc: 'Intimate venue for indie acts on the Bowery Presents circuit.' },
            { icon: '🛍️', name: 'Bedford Avenue',             desc: 'The main drag — vintage shops, cafes, boutiques, and weekend crowds.' },
            { icon: '🌳', name: 'McCarren Park',              desc: 'Shared with Greenpoint — pickup soccer, Sunday hangs, and the public pool in summer.' },
          ],
        },
        {
          name: 'East Williamsburg',
          desc: 'More industrial, emerging arts scene',
          sights: [
            { icon: '🌙', name: 'House of Yes',               desc: 'Cabaret, circus, and dance party fused into one converted warehouse.' },
            { icon: '🍕', name: "Roberta's",                  desc: 'Wood-fired pizza institution — the back patio is the move on a warm night.' },
            { icon: '🌳', name: 'Bushwick Inlet Park',        desc: 'Newer waterfront park bordering Greenpoint — green roof, soccer fields.' },
            { icon: '🎨', name: 'Cotton Candy Machine',       desc: 'Tiny gallery + shop focused on pop-culture art and prints.' },
          ],
        },
        {
          name: 'Bushwick',
          desc: 'Street art capital, warehouse venues, rapidly gentrifying',
          sights: [
            { icon: '🎨', name: 'The Bushwick Collective',    desc: "Open-air street art gallery sprawling across Troutman Street — NYC's largest." },
            { icon: '🌙', name: 'Mood Ring',                  desc: 'Astrology-themed bar — themed cocktails by zodiac sign.' },
            { icon: '🍕', name: "Roberta's",                  desc: 'The pizza place that put the neighborhood on the map (technically borders East Williamsburg).' },
            { icon: '🌳', name: 'Maria Hernandez Park',       desc: "Bushwick's main public space — basketball courts, playground, weekend dancers." },
          ],
        },
      ],
    },
    {
      key: 'northwestern_brooklyn',
      label: 'Northwestern Brooklyn',
      areas: [
        {
          name: 'Downtown Brooklyn',
          desc: "NYC's 3rd largest business district — high-rises, major transit hub",
          sights: [
            { icon: '🏛️', name: 'Brooklyn Borough Hall',      desc: "Historic Greek Revival building — Brooklyn's old city hall before the merger." },
            { icon: '🍰', name: "Junior's",                   desc: 'Cheesecake institution since 1950, original location at Flatbush Ave + DeKalb.' },
            { icon: '📚', name: 'Center for Brooklyn History', desc: "Smaller-scale museum and archive about Brooklyn's past." },
          ],
        },
        {
          name: 'DUMBO',
          desc: 'Cobblestone streets, tech startups, iconic Manhattan views',
          sights: [
            { icon: '🌉', name: 'Manhattan Bridge view',      desc: 'The famous Washington Street view — most photographed Brooklyn shot in the world.' },
            { icon: '🌳', name: 'Brooklyn Bridge Park',       desc: 'Six piers of green space along the waterfront — playgrounds, pop-up shops, kayaks.' },
            { icon: '🎠', name: "Jane's Carousel",            desc: 'Restored 1922 carousel inside a Jean Nouvel glass pavilion.' },
            { icon: '🛍️', name: 'Empire Stores',              desc: 'Restored 19th-century coffee warehouses, now full of shops and restaurants.' },
            { icon: '🍴', name: 'Time Out Market',            desc: "Curated food hall featuring some of Brooklyn's best chefs." },
            { icon: '☕', name: 'Brooklyn Roasting Company',   desc: 'Their original roastery, right on Pearl Street.' },
          ],
        },
        {
          name: 'Brooklyn Heights',
          desc: 'Oldest historic district — brownstones, the Promenade waterfront',
          sights: [
            { icon: '🌉', name: 'Brooklyn Heights Promenade', desc: 'Iconic Lower Manhattan view spanning six blocks atop the BQE.' },
            { icon: '⛪', name: 'Plymouth Church',             desc: '19th-century Underground Railroad stop — Henry Ward Beecher preached here.' },
            { icon: '🏘️', name: 'Willow + Pierrepont Street',  desc: 'Loveliest brownstone-lined blocks in NYC — Cranberry, Willow, Hicks.' },
            { icon: '🏛️', name: 'Brooklyn Historical Society', desc: 'Now the Brooklyn campus of the New-York Historical Society.' },
          ],
        },
        {
          name: 'Fort Greene',
          desc: 'Cultural hub — BAM (Brooklyn Academy of Music), brownstones',
          sights: [
            { icon: '🎭', name: 'BAM (Brooklyn Academy of Music)', desc: 'Major performing arts center — theater, opera, dance, film. Anchor of cultural Brooklyn.' },
            { icon: '🌳', name: 'Fort Greene Park',           desc: 'Olmsted-designed park, topped by the Prison Ship Martyrs Monument.' },
            { icon: '📚', name: 'Greenlight Bookstore',       desc: 'Beloved indie bookshop on Fulton Street — frequent author events.' },
            { icon: '🍴', name: 'Fulton Street',              desc: 'Restaurant row from Lafayette to Vanderbilt — Caribbean, soul food, wine bars.' },
          ],
        },
        {
          name: 'Clinton Hill',
          desc: 'Tree-lined streets, Pratt Institute, artsy and residential',
          sights: [
            { icon: '🏛️', name: 'Pratt Institute campus',     desc: 'Art college with a public outdoor sculpture park — free to wander.' },
            { icon: '🏘️', name: 'Washington Avenue brownstones', desc: "Some of Brooklyn's prettiest blocks — leafy, brownstone-lined, peaceful." },
            { icon: '🌳', name: 'Underwood Park',             desc: 'Small but lovely park surrounded by historic homes.' },
          ],
        },
        {
          name: 'Prospect Heights',
          desc: 'Trendy — near Barclays Center and Prospect Park',
          sights: [
            { icon: '🏟️', name: 'Barclays Center',            desc: "Brooklyn's pro sports arena — Nets, Liberty, plus major concerts." },
            { icon: '🏛️', name: 'Brooklyn Museum',            desc: 'World-class art museum — Egyptian wing, American Art, free first Saturdays.' },
            { icon: '🌻', name: 'Brooklyn Botanic Garden',    desc: 'Cherry blossoms in spring, Japanese garden, rose garden — adjacent to the museum.' },
            { icon: '🌳', name: 'Grand Army Plaza',           desc: "Massive roundabout topped by the Soldiers' and Sailors' Arch — Prospect Park's gateway." },
            { icon: '🍴', name: 'Vanderbilt Avenue',          desc: 'Restaurant and bar row of the neighborhood.' },
          ],
        },
      ],
    },
    {
      key: 'central_brooklyn',
      label: 'Central Brooklyn',
      areas: [
        {
          name: 'Park Slope',
          desc: 'Iconic brownstones — Prospect Park, top-rated schools, family-friendly',
          sights: [
            { icon: '🌳', name: 'Prospect Park',              desc: "Olmsted's other masterpiece — 585 acres of woods, meadows, and a lake." },
            { icon: '🛍️', name: 'Seventh Avenue',             desc: "Park Slope's old commercial spine — cafes, bookstores, boutiques." },
            { icon: '🍴', name: 'Fifth Avenue',               desc: 'The newer hot strip for restaurants and bars — al fresco in summer.' },
            { icon: '🌳', name: 'Grand Army Plaza',           desc: "Park Slope's elegant entry point at the north tip of Prospect Park." },
            { icon: '🪦', name: 'Green-Wood Cemetery',        desc: 'Just south — 478 acres of historic burial ground, hilltop city views.' },
          ],
        },
        {
          name: 'Crown Heights',
          desc: 'Caribbean culture, diverse — near Brooklyn Museum',
          sights: [
            { icon: '🏛️', name: 'Brooklyn Museum',            desc: 'Shared with Prospect Heights — central to the neighborhood and free first Saturdays.' },
            { icon: '🌻', name: 'Brooklyn Botanic Garden',    desc: 'Also borders Crown Heights — cherry blossom festival in spring is a must.' },
            { icon: '🛣️', name: 'Eastern Parkway',            desc: "Olmsted's grand boulevard — the route of the West Indian Day Parade every Labor Day." },
            { icon: '🍛', name: 'Nostrand Avenue',            desc: 'Roti shops, jerk spots, and Caribbean bakeries — the cultural heart.' },
            { icon: '🏘️', name: 'Sterling + St. Johns Place', desc: "Stately rowhouses on some of Brooklyn's best-preserved blocks." },
          ],
        },
        {
          name: 'Bedford-Stuyvesant',
          desc: "Historic Black Brooklyn — brownstone blocks, Notorious B.I.G.'s home turf, gospel churches",
          sights: [
            { icon: '🎤', name: 'Marcy Houses',               desc: "Jay-Z grew up here and never stopped writing about it. Public housing project on Marcy Avenue." },
            { icon: '🏘️', name: 'Stuyvesant Heights blocks',  desc: 'The historic district — MacDonough, Decatur, Bainbridge — has Brooklyn\'s most intact Victorian brownstone streetscape.' },
            { icon: '🍴', name: 'Fulton Street (Bed-Stuy)',   desc: 'Soul food, Caribbean roti shops, and old-school barbershops along the main commercial spine.' },
            { icon: '⛪', name: 'Brooklyn Tabernacle',         desc: 'Massive multi-ethnic Pentecostal church with a Grammy-winning choir — Sunday services are an event.' },
          ],
        },
      ],
    },
  ],
}

// Flat list of every sub-neighborhood name + its parent borough — used by the Add Place dropdown
// and by area-cluster lookups so trip-planning groups them under the right day.
const ALL_SUB_NEIGHBORHOODS = Object.entries(NEIGHBORHOOD_SUBAREAS).flatMap(([parentKey, groups]) =>
  groups.flatMap(g => g.areas.map(a => ({ ...a, parentKey, subAreaLabel: g.label })))
)

// ── Sight category colors — drives the header background + tag chip color so each sight feels
// venue-like and visually distinct by category. Keyed by icon glyph (matches the sight's icon field). ──
const SIGHT_CATEGORY_COLOR = {
  '🌳': { bg: '#15803d', text: '#fff' }, // park / nature - green
  '🌻': { bg: '#15803d', text: '#fff' }, // garden - green
  '🌊': { bg: '#0e7490', text: '#fff' }, // waterfront - teal
  '🌉': { bg: '#0e7490', text: '#fff' }, // view / bridge - teal
  '🏛️': { bg: '#1e40af', text: '#fff' }, // museum - blue
  '📚': { bg: '#1e40af', text: '#fff' }, // books / library - blue
  '🏟️': { bg: '#b91c1c', text: '#fff' }, // arena - red
  '🎭': { bg: '#7e22ce', text: '#fff' }, // theater - purple
  '🎵': { bg: '#7c3aed', text: '#fff' }, // music venue - violet
  '🎨': { bg: '#6d28d9', text: '#fff' }, // art / gallery - violet
  '🌙': { bg: '#5b21b6', text: '#fff' }, // nightlife - deep violet
  '🍴': { bg: '#c2410c', text: '#fff' }, // food - orange
  '🍕': { bg: '#dc2626', text: '#fff' }, // pizza - red
  '🍛': { bg: '#c2410c', text: '#fff' }, // caribbean - orange
  '🍰': { bg: '#be185d', text: '#fff' }, // dessert - pink
  '🍞': { bg: '#92400e', text: '#fff' }, // bakery - brown
  '🍺': { bg: '#b45309', text: '#fff' }, // brewery - amber
  '☕': { bg: '#7c2d12', text: '#fff' }, // coffee - dark brown
  '🛍️': { bg: '#be185d', text: '#fff' }, // shopping - pink
  '🎠': { bg: '#be185d', text: '#fff' }, // carousel / family - pink
  '⛪': { bg: '#92400e', text: '#fff' }, // church - brown
  '🏘️': { bg: '#78350f', text: '#fff' }, // brownstones - dark brown
  '🪦': { bg: '#475569', text: '#fff' }, // cemetery - slate
  '🛣️': { bg: '#475569', text: '#fff' }, // avenue - slate
}
const DEFAULT_SIGHT_COLOR = { bg: 'var(--gray-900)', text: '#fff' }

// ── Sight enrichment — extra editorial detail for prominent sub-neighborhood picks. ──
// Keyed by sightId. Anything missing here just doesn't render (the SightScreen adapts gracefully).
// Add more entries as we research them; new sights work fine without an enrichment entry.
const SIGHT_ENRICHMENT = {
  'sight_brooklyn_bridge_park': {
    lat: 40.7019, lng: -73.9967,
    longDesc: "An 85-acre waterfront park that runs from DUMBO south to Atlantic Avenue, built over six former shipping piers. Each pier has its own character — Pier 1's lawns face the Manhattan skyline, Pier 2 is built for active sports (basketball, handball, in-line skating), Pier 5 has soccer fields and the Picnic Peninsula, Pier 6 is family-focused with playgrounds and the Brooklyn Heights ferry dock. Jane's Carousel and Empire Stores sit at the north end; the Brooklyn Bridge soars overhead. The smartest move in the park is the unbroken Manhattan skyline view — particularly at sunset.",
    admission: 'Free · open daily 6am – 1am',
    timeNeeded: '1–2 hours',
    booking: 'No tickets needed · arrive any time',
    insiderTip: 'Sunset is best from Pier 5; the lawn at Pier 6 is dog-friendly. The carousel runs Thursday–Sunday in summer ($2 a ride).',
    officialUrl: 'https://www.brooklynbridgepark.org',
    tags: ['Park', 'Waterfront', 'Free', 'Outdoor'],
  },
  'sight_manhattan_bridge_view': {
    lat: 40.7029, lng: -73.9895,
    longDesc: "The most photographed view in Brooklyn — looking up Washington Street with the Manhattan Bridge framed perfectly overhead and the Empire State Building peeking through the arch. It became famous via Sergio Leone's Once Upon a Time in America and has appeared in countless films, ads, and Instagram posts since. The block itself is short and easy to miss — get the angle right and it's iconic in a single frame.",
    admission: 'Free',
    timeNeeded: '15 min',
    booking: 'No tickets · just show up',
    insiderTip: 'The photo spot is on Washington Street between Front and Water Streets. Early morning has the cleanest light and the fewest crowds.',
    tags: ['Photo spot', 'Free', 'Landmark'],
  },
  'sight_jane_s_carousel': {
    lat: 40.7036, lng: -73.9929,
    longDesc: "A meticulously restored 1922 Philadelphia Toboggan Company carousel, brought to Brooklyn Bridge Park and now spinning inside a Jean Nouvel-designed glass pavilion right on the East River. The 48 horses and two chariots were each hand-restored over 25 years; the pavilion's transparency makes the carousel feel like it's hovering between the Brooklyn Bridge and the Manhattan skyline. Magical for kids, surprisingly affecting for adults.",
    admission: '$2 per ride · free to enter the pavilion',
    timeNeeded: '30 min',
    booking: 'Walk-up only · no advance tickets',
    insiderTip: 'You don\'t have to ride to enjoy the pavilion. The views and the carousel woodwork are reason enough to stop in.',
    officialUrl: 'https://www.janescarousel.com',
    tags: ['Family', 'Landmark', 'Indoor'],
  },
  'sight_brooklyn_museum': {
    lat: 40.6712, lng: -73.9636,
    longDesc: "The second-largest art museum in NYC and one of the oldest in the country, with a collection that runs from ancient Egypt to contemporary photography. Strengths include world-class Egyptian antiquities (rivaled in the US only by the Met), the Sackler Center for Feminist Art (home to Judy Chicago's Dinner Party), and an under-appreciated American Art collection. The Beaux-Arts building on Eastern Parkway is itself worth the visit; the recent Pavilion glass entrance lets you see straight through to the original 1897 facade.",
    admission: '$25 suggested · First Saturdays free 5–11pm',
    timeNeeded: '2–4 hours',
    booking: 'Walk-up or pre-book at brooklynmuseum.org',
    insiderTip: 'Skip the queue by entering on Eastern Parkway. The Sackler Center for Feminist Art on the 4th floor is unmissable; First Saturdays bring DJs, performances, and the whole museum is free 5–11pm.',
    officialUrl: 'https://www.brooklynmuseum.org',
    tags: ['Museum', 'Indoor', 'Family'],
  },
  'sight_brooklyn_botanic_garden': {
    lat: 40.6694, lng: -73.9624,
    longDesc: "52 acres of curated landscapes right next to the Brooklyn Museum — the Cherry Esplanade is the centerpiece in spring, the Cranford Rose Garden in summer, the Native Flora Garden any time. The Steinhardt Conservatory's three glass houses feel like leaving the city entirely: tropical, desert, and bonsai. Smaller and more intimate than the New York Botanical Garden in the Bronx, but more accessible from most of Brooklyn.",
    admission: '$22 · Free Friday mornings + winter weekdays',
    timeNeeded: '1.5–3 hours',
    booking: 'Pre-book at bbg.org for popular weekends',
    insiderTip: 'Cherry blossom season (Sakura Matsuri, late April) is glorious but crowded — go on a weekday morning. The Cranford Rose Garden peaks in early June.',
    officialUrl: 'https://www.bbg.org',
    tags: ['Garden', 'Outdoor', 'Seasonal'],
  },
  'sight_prospect_park': {
    lat: 40.6602, lng: -73.9690,
    longDesc: "Frederick Law Olmsted and Calvert Vaux designed Prospect Park after they built Central Park — and they generally considered Prospect Park the better one. 585 acres of carefully composed landscapes: the Long Meadow (one of the longest unbroken meadows in any urban park anywhere), the Ravine (Brooklyn's only forest), the Lake (boating in summer, ice skating in winter at LeFrak Center). The park hosts the Prospect Park Bandshell summer concert series, free movies at night, and the city's largest Sunday drum circle at Drummer's Grove.",
    admission: 'Free · open 5am – 1am daily',
    timeNeeded: '1–3 hours',
    booking: 'No tickets needed',
    insiderTip: 'The Long Meadow is bigger than Central Park\'s Sheep Meadow. Sundays mean drum circles at Drummer\'s Grove (3rd St entrance). Smorgasburg sets up on Breeze Hill every Sunday April through October.',
    officialUrl: 'https://www.prospectpark.org',
    tags: ['Park', 'Free', 'Outdoor'],
  },
  'sight_grand_army_plaza': {
    lat: 40.6730, lng: -73.9700,
    longDesc: "Olmsted's monumental gateway to Prospect Park — a Beaux-Arts roundabout topped by the Soldiers' and Sailors' Memorial Arch (a Triumphal Arch modeled on Paris's Arc de Triomphe, dedicated to Union forces of the Civil War). The Bailey Fountain anchors the south side; the Brooklyn Public Library's Central Branch sits on the east, the Brooklyn Museum just beyond. Saturday morning is the largest farmers market in Brooklyn.",
    admission: 'Free',
    timeNeeded: '20 min',
    booking: 'No tickets needed',
    insiderTip: 'Saturday morning is the GrowNYC farmers market — biggest in Brooklyn. You can occasionally climb inside the Soldiers\' + Sailors\' Arch on select weekends — check Prospect Park Alliance for dates.',
    tags: ['Landmark', 'Free', 'Park'],
  },
  'sight_barclays_center': {
    lat: 40.6826, lng: -73.9754,
    longDesc: "Brooklyn's first major-league sports arena since the Dodgers left in 1957 — home of the Brooklyn Nets (NBA) and Liberty (WNBA), plus the New York Islanders' practice and Brooklyn-Long Island college games. SHoP Architects' weathered-steel rust-orange exterior was controversial when it opened in 2012 but has aged into a Brooklyn icon. The dramatic concourse with the curving canopy is a destination in itself; in concert mode it hosts everyone from Beyoncé and Bruce Springsteen to Bad Bunny.",
    admission: 'Varies by event ($30 nosebleed to $500+ floor)',
    timeNeeded: '2–3 hours',
    booking: 'Tickets via Ticketmaster / barclayscenter.com',
    insiderTip: 'The plaza outside is a hangout in its own right — and the Atlantic Terminal subway hub right below means you can get anywhere from here. Try the food at Calvert Vaux Park, the upper-deck taqueria.',
    officialUrl: 'https://www.barclayscenter.com',
    tags: ['Arena', 'Events', 'Sports'],
  },
  'sight_domino_park': {
    lat: 40.7142, lng: -73.9667,
    longDesc: "Built atop the bones of the Domino Sugar Refinery (which dominated this stretch of waterfront for 150+ years), Domino Park preserves the refinery's industrial archaeology — silos, cranes, syrup pipes — and weaves them into a 6-acre linear park. The elevated catwalk repurposes a stretch of the original sugar transfer infrastructure into a Manhattan-skyline-viewing platform; Tacocina (Danny Meyer's taco stand) anchors the food. Williamsburg's best new park since 2018.",
    admission: 'Free · open daily 6am – 1am',
    timeNeeded: '45 min',
    booking: 'No tickets needed',
    insiderTip: 'Tacocina and the elevated catwalk are the highlights. Bring sunscreen — there\'s very little shade on a hot day. The dog run is on the south end.',
    officialUrl: 'https://www.dominopark.com',
    tags: ['Park', 'Waterfront', 'Free'],
  },
  'sight_smorgasburg': {
    lat: 40.7220, lng: -73.9583,
    longDesc: "The largest weekly open-air food market in the United States — 80+ Brooklyn vendors gathered every Saturday at East River State Park in Williamsburg and every Sunday at Breeze Hill in Prospect Park (April through October). The lineup rotates each season but you can count on showstoppers: ramen burgers, Mighty Quinn's brisket, Mao's chicken, the original Ramen Burger, donuts, paletas, beer. Go before noon to beat the lines, after 3pm for vendor discounts.",
    admission: 'Free entry · pay per vendor ($5–25 per dish)',
    timeNeeded: '1–2 hours',
    booking: 'Walk-up · no reservations',
    insiderTip: 'Saturdays Williamsburg (East River State Park), Sundays Prospect Park (Breeze Hill). Go hungry, bring cash (cards accepted but slow). Skip lunch and graze for two hours.',
    officialUrl: 'https://www.smorgasburg.com',
    tags: ['Food', 'Outdoor', 'Seasonal'],
  },
  'sight_mccarren_park': {
    lat: 40.7197, lng: -73.9521,
    longDesc: "The de-facto town green of Northern Brooklyn — McCarren straddles the Williamsburg/Greenpoint border and serves as Sunday hangout, summer pool, soccer field, and farmers-market venue all in one. The 1936 WPA-era pool is one of NYC's best (free, swim-up bar from the city, open Memorial Day through Labor Day). Pickup volleyball, dog runs, runners on the track — McCarren never empties.",
    admission: 'Free',
    timeNeeded: '1 hour',
    booking: 'No tickets needed',
    insiderTip: 'The pool (Lorimer + Driggs entrance) is free in summer — get there before 11am to skip the line. Saturday farmers market on Lorimer Street is small but mighty.',
    tags: ['Park', 'Free', 'Outdoor'],
  },
  'sight_brooklyn_brewery': {
    lat: 40.7218, lng: -73.9572,
    longDesc: "Co-founded in 1988 by a former AP reporter (Steve Hindy) and a former banker (Tom Potter), Brooklyn Brewery essentially invented the modern American craft-beer wave on this single block in Williamsburg. Brewmaster Garrett Oliver is one of the most respected beer thinkers alive. The original brewery still operates here; the bigger production now happens upstate, but the Williamsburg taproom is the spiritual home — and where you'll find seasonal beers that never go to bottle.",
    admission: 'Free tours Sat–Sun · Tastings $5–10 per pour',
    timeNeeded: '1–2 hours',
    booking: 'Walk-up on weekends · reserve tours at brooklynbrewery.com',
    insiderTip: 'Friday Happy Hour (6–11pm) is the locals\' tradition — bring cash, beer comes by the token. Saturday tours are free and run on the half hour.',
    officialUrl: 'https://brooklynbrewery.com',
    tags: ['Drinks', 'Tours', 'Brewery'],
  },
  'sight_bam_brooklyn_academy_of_music_': {
    lat: 40.6863, lng: -73.9783,
    longDesc: "BAM is the oldest performing arts center in America (founded 1861), and arguably the country's most adventurous. Three buildings on the Fort Greene cultural corridor: the Howard Gilman Opera House (1908), the Harvey Theater (a beautifully half-restored old movie palace), and BAM Fisher (the experimental black box). Programming runs from full-scale opera (the Next Wave Festival each fall) to indie film series, Pina Bausch's Tanztheater, and BAM Café free shows on weekend nights. Robert Wilson, Mark Morris, Laurie Anderson — they've all been here.",
    admission: 'Varies by show ($25–150)',
    timeNeeded: '2–3 hours',
    booking: 'Book at bam.org or in person at the Peter Jay Sharp Building box office',
    insiderTip: 'The Next Wave Festival (Sept–Dec) is the season highlight. BAM Café (free live music Fri–Sat at 9pm in the lobby) is the best way to sample without committing.',
    officialUrl: 'https://www.bam.org',
    tags: ['Theater', 'Music', 'Film'],
  },
  'sight_brooklyn_heights_promenade': {
    lat: 40.6973, lng: -73.9966,
    longDesc: "A third-of-a-mile elevated walkway cantilevered above the Brooklyn-Queens Expressway, looking directly across the East River at Lower Manhattan. Built in the 1950s as part of Robert Moses's BQE deal with Brooklyn Heights residents (who insisted the highway not destroy their views), the Promenade is one of the great urban viewpoints anywhere — Liberty, the Brooklyn Bridge, the entire Lower Manhattan skyline all visible from the same bench. Especially magical at sunset and the first hour after dark.",
    admission: 'Free · open 24/7',
    timeNeeded: '30–45 min',
    booking: 'Walk-up anytime',
    insiderTip: 'Sunset for the skyline lighting up; sunrise for empty benches and golden light. The prettiest approach is from Cranberry Street, then walking the brownstone blocks afterward.',
    tags: ['View', 'Free', 'Landmark'],
  },
  'sight_fort_greene_park': {
    lat: 40.6896, lng: -73.9752,
    longDesc: "Designed by Frederick Law Olmsted and Calvert Vaux in 1867 — their first park after Central Park, a warm-up for what became Prospect Park. The 30-acre park climbs a hill that's topped by McKim, Mead & White's Prison Ship Martyrs Monument (1908), a 149-foot Doric column honoring the 11,500 American prisoners of war who died on British ships moored in Wallabout Bay during the Revolution. The view from the top spans Manhattan to Coney Island.",
    admission: 'Free',
    timeNeeded: '45 min',
    booking: 'No tickets needed',
    insiderTip: 'The Prison Ship Martyrs Monument staircase is the tallest open stair in any NYC park — great workout, panoramic view. Saturday morning the GrowNYC farmers market sets up at DeKalb + Washington Park.',
    tags: ['Park', 'Free', 'Historic'],
  },

  // --- Greenpoint ---
  'sight_transmitter_park': {
    lat: 40.7297, lng: -73.9594,
    longDesc: "A compact 5-acre waterfront park at the foot of Greenpoint Avenue, built atop the former WNYC radio transmitter site (the antennas were here from 1937 until 1990). The pier sticks out 200 feet into the East River, lining up the Empire State Building, the Chrysler Building, and the United Nations all in one frame. Less crowded than Domino Park down in Williamsburg, and the sunset over Midtown is among the best you'll find anywhere in Brooklyn.",
    admission: 'Free · open daily 6am – 10pm',
    timeNeeded: '30–45 min',
    booking: 'No tickets needed',
    insiderTip: 'Walk the pier all the way to the end at sunset — the Manhattan skyline lights up while you face directly into it. The grass lawn is dog-friendly off-leash before 9am.',
    tags: ['Park', 'Waterfront', 'Free'],
  },
  'sight_manhattan_avenue': {
    lat: 40.7270, lng: -73.9530,
    longDesc: "The commercial spine of Greenpoint and the most intact stretch of Polish Brooklyn left in the borough. Polish has been the second language here since the early 20th century, and the bakeries, butchers, delis, and the Polish & Slavic Center along Manhattan Avenue still anchor a real working community. Walk from Greenpoint Avenue north to McGuinness Boulevard for pierogi, kielbasa, fresh rye, and Polish books — then peel off onto the side streets for some of the prettiest old wood-frame houses in NYC.",
    admission: 'Free to walk',
    timeNeeded: '1–2 hours',
    booking: 'No tickets needed',
    insiderTip: 'Peter Pan Donut & Pastry Shop (727 Manhattan Ave) is the local breakfast institution — cash only, classics-only menu, open since 1952. Syrena Bakery for rye and babka.',
    tags: ['Walk', 'Food', 'Culture'],
  },
  'sight_warsaw': {
    lat: 40.7290, lng: -73.9528,
    longDesc: "A concert venue built inside the 1914 Polish National Home — a working community center that still hosts polka nights, weddings, and the parish kitchen alongside indie rock shows. Warsaw is what you get when Bowery Presents takes over a Polish dance hall: 1,000-capacity room with a balcony, terrible sightlines from the side, the best pierogi you can buy at a music venue anywhere. Patti Smith, Iggy Pop, Fleet Foxes, Father John Misty have all played here.",
    admission: 'Varies by show ($25–60)',
    timeNeeded: '2–3 hours',
    booking: 'Tickets via warsawconcerts.com or Ticketmaster',
    insiderTip: 'The pierogi station in the lobby is real — half-time intermission food, run by the Polish Home aunties. Doors usually 7pm; show starts later than the ticket says.',
    officialUrl: 'https://www.warsawconcerts.com',
    tags: ['Music', 'Venue', 'Food'],
  },
  'sight_variety_coffee': {
    lat: 40.7268, lng: -73.9540,
    longDesc: "Greenpoint's flagship third-wave coffee bar — the original Variety on Graham opened in 2008 and the Greenpoint shop on Manhattan Avenue is the bigger, calmer sibling. Long communal benches, fast wifi, generous outlets, and one of the better house espresso blends in Brooklyn. The pastries (almond croissants, sticky buns) come from Ovenly across the street. The patio out back is the quiet move on a warm afternoon.",
    admission: 'Pay per drink ($4–7)',
    timeNeeded: '30–60 min',
    booking: 'Walk-in',
    insiderTip: 'The back patio is the secret — most tourists never find it. Order an iced almond latte and bring a laptop on a weekday morning.',
    officialUrl: 'https://www.varietycoffeeroasters.com',
    tags: ['Coffee', 'Cafe', 'Work-friendly'],
  },

  // --- Williamsburg ---
  'sight_music_hall_of_williamsburg': {
    lat: 40.7188, lng: -73.9577,
    longDesc: "A 550-capacity Bowery Presents room that punches well above its weight on the indie circuit — Williamsburg's answer to the Bowery Ballroom, with the same booking team and a similar pedigree of bands-on-the-way-up. Tame Impala, Lorde, Phoebe Bridgers, Mitski, and Vampire Weekend all played here before they could fill Brooklyn Steel. The sightlines from the upstairs balcony are surprisingly forgiving for a converted warehouse.",
    admission: 'Varies by show ($25–55)',
    timeNeeded: '2–3 hours',
    booking: 'Tickets via musichallofwilliamsburg.com',
    insiderTip: 'The upstairs balcony has the best sightlines and a small bar with no line. Get there early — the doors usually open an hour before showtime and the venue fills fast for sold-out shows.',
    officialUrl: 'https://www.musichallofwilliamsburg.com',
    tags: ['Music', 'Venue', 'Indie'],
  },
  'sight_bedford_avenue': {
    lat: 40.7173, lng: -73.9568,
    longDesc: "Williamsburg's main commercial drag and the avenue that defined a certain idea of Brooklyn for two decades. The strip from Metropolitan up to N 10th Street still has the highest density of vintage shops, indie boutiques, coffee bars, bookstores (Spoonbill & Sugartown is essential), and weekend brunch spots in the neighborhood. The L train Bedford stop dumps you in the middle of it — start there and walk in either direction.",
    admission: 'Free to walk',
    timeNeeded: '1–3 hours',
    booking: 'No tickets needed',
    insiderTip: 'Skip the obvious chains on Bedford itself and duck onto the side streets — N 6th, N 7th, Berry, Wythe — for the better food and quieter shops. Spoonbill & Sugartown Books at N 4th + Bedford is the best indie bookshop in the neighborhood.',
    tags: ['Walk', 'Shopping', 'Cafe'],
  },

  // --- East Williamsburg ---
  'sight_house_of_yes': {
    lat: 40.7062, lng: -73.9234,
    longDesc: "Part nightclub, part circus, part immersive theater — House of Yes is what Williamsburg's nightlife scene wishes it still was. The themed parties (Dirty Circus, Tropico, Ketamine Disco) blur the line between performer and audience: aerialists drop from the ceiling, dancers in elaborate costumes prowl the floor, and a strict consent and dress code make it one of the most welcoming queer-friendly venues in the city. The brunch shows on Sundays are a milder gateway drug.",
    admission: '$20–60 cover · dress code enforced',
    timeNeeded: '3–5 hours',
    booking: 'Pre-book via houseofyes.org — many shows sell out',
    insiderTip: 'Dress up — they will turn you away in jeans and a t-shirt. Sunday brunch shows are the family-friendly entry point; the late-night themed parties are the real experience.',
    officialUrl: 'https://www.houseofyes.org',
    tags: ['Nightlife', 'Cabaret', 'LGBTQ+'],
  },
  'sight_roberta_s': {
    lat: 40.7053, lng: -73.9337,
    longDesc: "The wood-fired pizza counter that put Bushwick on the food map in 2008 and arguably launched the whole modern Brooklyn pizza renaissance. Carlo Mirarchi's oven turns out a Neapolitan-Brooklyn hybrid (the Bee Sting — soppressata, chili, honey — is the icon), the back patio is built from shipping containers, and the offshoot tasting-menu restaurant Blanca next door earned two Michelin stars. The neighborhood has gentrified hard around it; Roberta's still feels like itself.",
    admission: '$18–28 per pizza',
    timeNeeded: '1.5–2 hours',
    booking: 'Walk-in only at the main counter — Blanca tickets sold separately',
    insiderTip: 'The Bee Sting is the must-order. Show up before 6pm on weekends or after 9pm to avoid the worst waits. The Blanca tasting menu next door is a completely separate restaurant (and a completely separate booking).',
    officialUrl: 'https://www.robertaspizza.com',
    tags: ['Food', 'Pizza', 'Casual'],
  },
  'sight_bushwick_inlet_park': {
    lat: 40.7239, lng: -73.9610,
    longDesc: "A long-promised 27-acre waterfront park stitching together former industrial parcels at the Williamsburg-Greenpoint border. The first phase opened in 2014 with a green-roofed community building, turf soccer fields, and a kayak launch; the rest is still being assembled parcel by parcel. The Manhattan skyline view from the green roof is one of the underused secrets of the North Brooklyn waterfront.",
    admission: 'Free',
    timeNeeded: '45 min – 1 hour',
    booking: 'No tickets needed',
    insiderTip: 'Climb to the green roof of the community building — it is open during park hours and the view is empty most weekdays. Free kayaking on summer Saturdays via the North Brooklyn Boat Club.',
    tags: ['Park', 'Waterfront', 'Free'],
  },
  'sight_cotton_candy_machine': {
    lat: 40.7159, lng: -73.9492,
    longDesc: "A tiny print gallery and gift shop on Roebling Street run by artist Tara McPherson — specializing in pop-art prints, art toys, zines, and limited-edition collaborations with illustrators who orbit the gig-poster and lowbrow art worlds. Easy to miss, easy to love, and the kind of small business that still gives Williamsburg its character. Stop in for 20 minutes and walk out with a print you didn't know existed.",
    admission: 'Free entry · prints $25–200',
    timeNeeded: '20–30 min',
    booking: 'Walk-in',
    insiderTip: 'Check the back wall for the under-$50 prints — the signed editions are often a fraction of what the same artists charge at the bigger Manhattan galleries.',
    officialUrl: 'https://www.thecottoncandymachine.com',
    tags: ['Gallery', 'Shopping', 'Art'],
  },

  // --- Bushwick ---
  'sight_the_bushwick_collective': {
    lat: 40.7050, lng: -73.9330,
    longDesc: "An open-air street-art gallery that fills the warehouse walls around Troutman Street and St. Nicholas Avenue with rotating large-scale murals by international artists. Founded by Bushwick native Joe Ficalora in 2011, the Collective now stages an annual block party every June and rotates its work every few months — meaning the show is genuinely different every time you visit. The best concentration of murals runs Troutman from Wyckoff to St. Nicholas.",
    admission: 'Free · 24/7',
    timeNeeded: '45 min – 1.5 hours',
    booking: 'No tickets needed',
    insiderTip: 'Start at the Jefferson L stop and walk down Troutman. The annual block party in early June is when the new murals are unveiled — biggest street-art event in NYC.',
    officialUrl: 'https://www.thebushwickcollective.com',
    tags: ['Art', 'Walk', 'Free'],
  },
  'sight_mood_ring': {
    lat: 40.7036, lng: -73.9233,
    longDesc: "Bushwick's astrology bar — themed cocktails by zodiac sign, tarot readings on slow weeknights, and an aesthetic that lands somewhere between 1970s rec room and a Sailor Moon fan club. The crowd skews queer and creative; the drinks are surprisingly serious for a place with this much glitter. Look for the mood-lit storefront on Myrtle Avenue near the Central Avenue M stop.",
    admission: 'No cover · drinks $14–18',
    timeNeeded: '1.5–3 hours',
    booking: 'Walk-in · larger groups should call ahead',
    insiderTip: 'Order the cocktail for your sign — they take it seriously. Tuesday tarot readings are free with a drink; Friday and Saturday nights get tight after 11pm.',
    officialUrl: 'https://www.moodringnyc.com',
    tags: ['Bar', 'Nightlife', 'LGBTQ+'],
  },
  'sight_maria_hernandez_park': {
    lat: 40.7036, lng: -73.9266,
    longDesc: "Bushwick's main public space — a 7-acre block bordered by Knickerbocker, Irving, Suydam, and Starr. Renamed in 1989 for community activist Maria Hernandez, who was killed for resisting drug dealers in the neighborhood she was trying to clean up. Today the park is the social heart of Bushwick — soccer games, weekend salsa dancers, the playground for the surrounding tenements, and the staging ground for the Bushwick Collective's annual block party.",
    admission: 'Free',
    timeNeeded: '30–45 min',
    booking: 'No tickets needed',
    insiderTip: 'Sunday afternoons bring informal soccer leagues and a salsa-dance circle near the bandshell. Surrounded on all four sides by some of the best Bushwick Collective murals.',
    tags: ['Park', 'Free', 'Community'],
  },

  // --- Downtown Brooklyn ---
  'sight_brooklyn_borough_hall': {
    lat: 40.6929, lng: -73.9903,
    longDesc: "The Greek Revival temple at 209 Joralemon Street served as Brooklyn's actual City Hall from 1848 until consolidation with New York City in 1898 — when Brooklyn went from being the third-largest American city to a borough of a larger one. The building is still the seat of the Brooklyn Borough President; the steps and the plaza in front host the Brooklyn Flea on Saturdays in summer and the weekly Greenmarket year-round. The interior rotunda is open weekdays and worth a five-minute detour.",
    admission: 'Free · weekdays 9am–5pm',
    timeNeeded: '30 min',
    booking: 'Walk-in',
    insiderTip: 'Saturday farmers market on the plaza out front; the cast-iron cupola was added in 1898 to soften the change in status. Stand on the steps and look across at the Brooklyn Municipal Building — both are part of the same civic ensemble.',
    tags: ['Landmark', 'Historic', 'Free'],
  },
  'sight_junior_s': {
    lat: 40.6907, lng: -73.9818,
    longDesc: "The cheesecake institution that has been at Flatbush + DeKalb since 1950, when Harry Rosen opened it as a place where the Schubert Theatre crowd could eat between shows. Three generations of Rosens still run it; the cheesecake recipe hasn't changed (cream cheese and sour cream, no flour); the menu is a full diner of deli classics. The original Brooklyn outpost is the one that matters — the Times Square branch exists but doesn't count.",
    admission: '$30–50 per person for a meal',
    timeNeeded: '1 – 1.5 hours',
    booking: 'Walk-in · no reservations',
    insiderTip: 'You do not need to eat a full meal — just sit at the bakery counter and order a slice and a coffee. The strawberry shortcake cheesecake is the move if plain feels boring.',
    officialUrl: 'https://www.juniorscheesecake.com',
    tags: ['Food', 'Dessert', 'Historic'],
  },
  'sight_center_for_brooklyn_history': {
    lat: 40.6953, lng: -73.9930,
    longDesc: "Founded as the Long Island Historical Society in 1863, this gorgeous 1881 terracotta-and-brick building on Pierrepont Street holds the most complete archive of Brooklyn history anywhere — neighborhood maps, photographs, oral histories, the records of the Brooklyn Navy Yard and the Brooklyn Dodgers. Now operated as a branch of the Brooklyn Public Library and the Brooklyn campus of the New-York Historical Society. The Othmer Library reading room upstairs is open to anyone with a research project, no appointment needed.",
    admission: 'Free',
    timeNeeded: '1 – 1.5 hours',
    booking: 'Walk-in · library appointment recommended for archives',
    insiderTip: 'The 4th-floor Othmer Library is the secret — Tiffany lamps, carved oak, the smell of 19th-century books. The current rotating gallery exhibit is usually neighborhood-specific and good.',
    officialUrl: 'https://www.bklynlibrary.org/locations/center-for-brooklyn-history',
    tags: ['Museum', 'History', 'Free'],
  },

  // --- DUMBO ---
  'sight_empire_stores': {
    lat: 40.7035, lng: -73.9893,
    longDesc: "A row of seven brick coffee warehouses built between 1869 and 1885 along the Brooklyn waterfront — once where green coffee beans from South America were unloaded, weighed, and roasted for the entire Northeast. Restored in 2017 with a steel-and-glass top floor added without disturbing the original 19th-century brick. Now full of shops (West Elm, Cecconi's, Empire Stores Market), a public courtyard that cuts through to Brooklyn Bridge Park, and a rooftop with an unobstructed Lower Manhattan view.",
    admission: 'Free entry · shops and restaurants priced individually',
    timeNeeded: '1 – 1.5 hours',
    booking: 'Walk-in',
    insiderTip: 'The free rooftop is the best secret in DUMBO — take the elevator at the rear of the building to the 5th floor and walk out onto the deck. Best skyline view that does not require a drink minimum.',
    officialUrl: 'https://www.empirestoresdumbo.com',
    tags: ['Shopping', 'Landmark', 'View'],
  },
  'sight_time_out_market': {
    lat: 40.7028, lng: -73.9903,
    longDesc: "A 21,000 sq ft curated food hall on the third floor of Empire Stores — Time Out's editors picked the city's best chefs and pop-ups (Felice, Mr. Taka Ramen, Jacob's Pickles, Pat LaFrieda burgers, Fornino) and gave each one a stall. The communal seating area opens onto a rooftop bar with the Brooklyn Bridge and Manhattan skyline directly in front of you. Faster than chasing the same chefs across Manhattan; the rooftop is the best part.",
    admission: 'Free entry · $12–25 per dish',
    timeNeeded: '1 – 2 hours',
    booking: 'Walk-in',
    insiderTip: 'Skip the indoor seating and go straight to the rooftop bar — same food, far better view. Felice does a $14 cacio e pepe that is the best deal in DUMBO.',
    officialUrl: 'https://www.timeoutmarket.com/newyork',
    tags: ['Food', 'View', 'Casual'],
  },
  'sight_brooklyn_roasting_company': {
    lat: 40.7027, lng: -73.9883,
    longDesc: "Their original Pearl Street roastery — Jim Munson opened it in 2010 inside a former 19th-century paper warehouse, and the room still has the high ceilings, exposed beams, and roasting smell of a real working roastery. Fair-trade, single-origin beans roasted on-site; the espresso is the strongest argument for getting off Bedford Avenue. The Pearl Street location is the one with the soul; the newer outposts feel like satellites.",
    admission: 'Pay per drink ($4–7)',
    timeNeeded: '30–60 min',
    booking: 'Walk-in',
    insiderTip: 'The benches along the windows are the best seats on a weekday morning. Buy a half-pound of the Iris Espresso blend at the counter to take home.',
    officialUrl: 'https://www.brooklynroasting.com',
    tags: ['Coffee', 'Cafe', 'Work-friendly'],
  },

  // --- Brooklyn Heights ---
  'sight_plymouth_church': {
    lat: 40.6993, lng: -73.9933,
    longDesc: "The 1849 Congregationalist church on Orange Street where Henry Ward Beecher delivered the most famous abolitionist sermons in America — and where the basement reportedly served as a stop on the Underground Railroad. Abraham Lincoln worshipped here twice; Mark Twain, Walt Whitman, and Frederick Douglass all spoke from the pulpit. The interior is plain by 19th-century standards (Beecher wanted the focus on preaching, not architecture); the historical weight of the room is the reason to visit.",
    admission: 'Free · open Sundays for services + select tours',
    timeNeeded: '45 min',
    booking: 'Check plymouthchurch.org for tour schedule',
    insiderTip: 'The Sunday 11am service is open to the public and is the easiest way to see the sanctuary. The garden behind the church holds a piece of the original Plymouth Rock — a literal one, brought here by the congregation in 1840.',
    officialUrl: 'https://www.plymouthchurch.org',
    tags: ['Historic', 'Free', 'Architecture'],
  },
  'sight_willow_pierrepont_street': {
    lat: 40.6964, lng: -73.9942,
    longDesc: "The blocks bounded by Willow, Pierrepont, Cranberry, and Hicks streets contain the densest concentration of preserved pre-1860 brownstones, wood-frame houses, and federal-style row houses anywhere in NYC. Brooklyn Heights became the first historic district designated under NYC's 1965 Landmarks Preservation Law, which is why the entire neighborhood still looks like a 19th-century daguerreotype. Truman Capote wrote In Cold Blood in the yellow house at 70 Willow; Walt Whitman lived two blocks over.",
    admission: 'Free to walk',
    timeNeeded: '45 min – 1 hour',
    booking: 'No tickets needed',
    insiderTip: 'Start at Cranberry + Hicks (Truman Capote territory), walk down Willow to Pierrepont, then west to the Promenade. The wood-frame houses on Cranberry are the rarest — most of the original 1830s wood frames in NYC burned down a century ago.',
    tags: ['Walk', 'Historic', 'Free'],
  },
  'sight_brooklyn_historical_society': {
    lat: 40.6953, lng: -73.9930,
    longDesc: "The 1881 landmark on Pierrepont Street merged with the New-York Historical Society in 2020 and now operates as the Brooklyn campus of the larger institution — but the building, the archive, and the focus on Brooklyn history remain. The galleries on the ground floor host rotating exhibitions on Brooklyn neighborhoods, immigrant history, and the borough's cultural transformations. The Othmer Library upstairs is the same magnificent Tiffany-lamped reading room mentioned in the Center for Brooklyn History — they share the building.",
    admission: 'Free',
    timeNeeded: '1 – 1.5 hours',
    booking: 'Walk-in',
    insiderTip: 'Same building as the Center for Brooklyn History — visit both in one stop. The terracotta exterior with portraits of Beethoven, Shakespeare, and Gutenberg is one of the prettiest 19th-century facades in NYC.',
    officialUrl: 'https://www.nyhistory.org/brooklyn',
    tags: ['Museum', 'History', 'Free'],
  },

  // --- Fort Greene ---
  'sight_greenlight_bookstore': {
    lat: 40.6862, lng: -73.9745,
    longDesc: "The beloved indie bookshop that opened on Fulton Street in 2009 and has anchored the cultural life of Fort Greene ever since. Co-owners Jessica Stockton Bagnulo and Rebecca Fitting curate one of the smartest fiction sections in the city and program a packed calendar of author events — Zadie Smith, Colson Whitehead, Jesmyn Ward, Jacqueline Woodson have all read here. The smaller second location in Prospect Lefferts Gardens followed in 2016, but the Fulton store is the original.",
    admission: 'Free entry · books at cover price',
    timeNeeded: '30–60 min',
    booking: 'Walk-in · author events ticketed via greenlightbookstore.com',
    insiderTip: 'Check the events calendar — they get top-tier writers and the rooms are small enough that you can talk to them afterward. The local-author table near the front is curated by the staff and reliable.',
    officialUrl: 'https://www.greenlightbookstore.com',
    tags: ['Books', 'Cultural', 'Indie'],
  },
  'sight_fulton_street': {
    lat: 40.6862, lng: -73.9700,
    longDesc: "The restaurant row that runs through Fort Greene from Flatbush Avenue east to Vanderbilt — Caribbean takeout windows, soul-food sit-downs, oyster bars, and natural-wine spots all on the same six-block stretch. Olea (Mediterranean), Black Iris (Middle Eastern), Saraghina (Italian pizza), and Madiba (South African) have anchored this strip for over a decade; the new arrivals keep filling in the gaps. Walk it at 7pm on a Friday to feel why Fort Greene is the dinner neighborhood the rest of Brooklyn copies from.",
    admission: 'Free to walk · meals $20–60',
    timeNeeded: '1 – 3 hours',
    booking: 'Most restaurants take walk-ins or same-day Resy',
    insiderTip: 'The block between South Portland and South Oxford has the highest density. Pair dinner here with a 7:30pm show at BAM (one block south) — it is the move locals use.',
    tags: ['Food', 'Walk', 'Dining'],
  },

  // --- Clinton Hill ---
  'sight_pratt_institute_campus': {
    lat: 40.6913, lng: -73.9637,
    longDesc: "The Brooklyn campus of one of the country's top art and design schools — founded in 1887 by oil baron Charles Pratt and still operating on its original 25-acre grounds. The campus is open to the public and includes the Pratt Sculpture Park (60+ outdoor pieces rotating across the lawns), the Memorial Hall steam plant (the oldest continuously operating private power plant in NYC), and a Beaux-Arts main building that would not look out of place at any Ivy League school. The walk through the campus is one of the prettiest urban-academic strolls in Brooklyn.",
    admission: 'Free · open daily during daylight hours',
    timeNeeded: '45 min – 1 hour',
    booking: 'No tickets needed',
    insiderTip: 'Enter at the Hall Street gate and walk diagonally across to DeKalb — the best sculpture pieces sit on the lawns along the central path. The historic steam plant near the engineering buildings is occasionally open for tours.',
    officialUrl: 'https://www.pratt.edu',
    tags: ['Art', 'Walk', 'Free'],
  },
  'sight_washington_avenue_brownstones': {
    lat: 40.6855, lng: -73.9650,
    longDesc: "The stretch of Washington and Clinton Avenues between Atlantic and Myrtle is among the best-preserved brownstone-and-mansion blocks in NYC. Charles Pratt's old neighborhood — when he was the second-richest man in America, he built a mansion at 232 Clinton Avenue (the green-shuttered one) and gave each of his sons a mansion of his own up and down the same block. Today the blocks read as a museum of late-19th-century Brooklyn wealth.",
    admission: 'Free to walk',
    timeNeeded: '30–45 min',
    booking: 'No tickets needed',
    insiderTip: 'Start at Lafayette + Clinton and walk north — the four Pratt mansions cluster between Greene and Willoughby. Look for the original carriage-house garages tucked behind some properties.',
    tags: ['Walk', 'Historic', 'Free'],
  },
  'sight_underwood_park': {
    lat: 40.6859, lng: -73.9641,
    longDesc: "A small but lovely neighborhood park tucked at Washington and Lafayette Avenues, built on the former site of John Underwood's typewriter mansion. The park is one block square — a fountain, a playground, perimeter benches under mature plane trees — but it functions as Clinton Hill's living room. Sunday afternoons bring chess players, dog walkers, and the kind of relaxed brownstone-neighborhood scene that's getting harder to find in Brooklyn.",
    admission: 'Free',
    timeNeeded: '20–30 min',
    booking: 'No tickets needed',
    insiderTip: 'Combine with the Washington Avenue brownstone walk and the Pratt campus — they are all within three blocks of each other and make a perfect 90-minute Clinton Hill loop.',
    tags: ['Park', 'Free', 'Quiet'],
  },

  // --- Prospect Heights ---
  'sight_vanderbilt_avenue': {
    lat: 40.6790, lng: -73.9683,
    longDesc: "Prospect Heights's restaurant and bar row — the seven blocks of Vanderbilt between Atlantic and Prospect Park host the densest cluster of acclaimed independent restaurants in the borough. Olmsted (foraged tasting menus), Faun (Italian small plates), Cheryl's Global Soul, Bar Sardine, James (American), Convivium Osteria — most have been here for a decade or more. The street closes to traffic on summer Sundays for the Vanderbilt Avenue Open Street, which turns the strip into a Brooklyn block party.",
    admission: 'Free to walk · meals $25–80',
    timeNeeded: '1 – 3 hours',
    booking: 'Reserve via Resy for dinner — most spots book up by Wednesday for weekends',
    insiderTip: 'Walk it on a Sunday from May through October when the open street is in effect — the whole avenue becomes outdoor dining. Olmsted around the corner from the Brooklyn Museum is the destination booking; book three weeks ahead.',
    tags: ['Food', 'Walk', 'Dining'],
  },

  // --- Park Slope ---
  'sight_seventh_avenue': {
    lat: 40.6710, lng: -73.9782,
    longDesc: "Park Slope's original commercial spine — running parallel to the western edge of Prospect Park from Flatbush down to Bartel-Pritchard Square. Seventh Avenue is the Park Slope of Park Slope: longtime independent bookstores (Community Bookstore), the original Two Boots pizza, multi-generation Italian delis (Russo's Mozzarella & Pasta), bagel shops, neighborhood bars. Less hyped than Fifth Avenue and more useful — this is where the actual Park Slopers shop.",
    admission: 'Free to walk',
    timeNeeded: '1 – 2 hours',
    booking: 'No tickets needed',
    insiderTip: 'Community Bookstore at 143 7th Ave has a back garden with the resident cat — among the oldest indie bookstores left in NYC. Russo at 363 7th Ave for fresh mozzarella made that morning.',
    tags: ['Walk', 'Shopping', 'Local'],
  },
  'sight_fifth_avenue': {
    lat: 40.6745, lng: -73.9830,
    longDesc: "Park Slope's newer hot strip — the stretch of 5th Avenue from Flatbush down to 9th Street has become the borough's most reliable bar-and-restaurant corridor over the last 15 years. Al fresco sidewalk dining year-round (post-pandemic the city made it permanent), the Park Slope Food Coop one block over keeps the foot traffic walking, and the bars stay packed late on weekends. Compared to Seventh Avenue, this is louder, younger, and the better choice for dinner-and-drinks.",
    admission: 'Free to walk · meals $20–60',
    timeNeeded: '1 – 3 hours',
    booking: 'Most restaurants take walk-ins or same-day Resy',
    insiderTip: 'Convivium Osteria, al di la, and Mary\'s Bar are the Fifth Avenue anchors that have been here longest. Walk it from 9th Street north on a Friday or Saturday for the full Park Slope-after-dark feel.',
    tags: ['Food', 'Walk', 'Nightlife'],
  },
  'sight_green_wood_cemetery': {
    lat: 40.6580, lng: -73.9941,
    longDesc: "478 acres of rolling hills, glacial ponds, and Victorian mausoleums at the southern edge of Park Slope — one of the largest historic cemeteries in the United States and a National Historic Landmark. Founded in 1838 as a rural cemetery in the Mount Auburn tradition, Green-Wood became so popular as a Sunday destination that it directly inspired the creation of Central Park. Permanent residents include Leonard Bernstein, Jean-Michel Basquiat, Boss Tweed, and 300,000 others. The hilltop at Battle Hill is the highest natural point in Brooklyn (and the site of the 1776 Battle of Brooklyn).",
    admission: 'Free · open daily 7am – 7pm (winter 5pm)',
    timeNeeded: '1.5 – 3 hours',
    booking: 'Walk-in · trolley tours bookable at green-wood.com',
    insiderTip: 'Pick up a free map at the 25th Street gate — you will get lost without one. The annual Memorial Day Concert at the chapel is the best free music program in Brooklyn.',
    officialUrl: 'https://www.green-wood.com',
    tags: ['Historic', 'Park', 'Free'],
  },

  // --- Crown Heights ---
  'sight_eastern_parkway': {
    lat: 40.6720, lng: -73.9560,
    longDesc: "Frederick Law Olmsted and Calvert Vaux designed Eastern Parkway in 1866 as the first parkway in the world — a grand 2.5-mile boulevard with central drive, side promenades, tree-lined pedestrian walks, and bridle paths. It connected Prospect Park east to the Brooklyn Museum and the Botanic Garden, and remains the spine of central Brooklyn. Every Labor Day weekend the route hosts the West Indian Day Parade, the largest Caribbean parade in North America (over 1 million attendees).",
    admission: 'Free to walk',
    timeNeeded: '45 min – 1.5 hours',
    booking: 'No tickets needed',
    insiderTip: 'Walk the pedestrian promenade (set back from the traffic lanes) — the experience Olmsted designed. Labor Day Monday is the parade; arrive by 10am to find a sidewalk spot east of Utica Avenue.',
    tags: ['Walk', 'Historic', 'Free'],
  },
  'sight_nostrand_avenue': {
    lat: 40.6720, lng: -73.9500,
    longDesc: "The cultural and commercial heart of Caribbean Crown Heights — the stretch of Nostrand Avenue from Eastern Parkway south to Empire Boulevard is lined with Jamaican patty shops, Trinidadian roti spots, Guyanese bakeries, Haitian griot stands, and Caribbean grocery markets. The food culture here is older and deeper than anywhere else in Brooklyn; the West Indian Day Parade may take place on Eastern Parkway, but the eating happens on Nostrand. Allan's Bakery (1109 Nostrand) for currant rolls; Gloria's (764 Nostrand) for oxtail.",
    admission: 'Free to walk · meals $10–25',
    timeNeeded: '1 – 2 hours',
    booking: 'Walk-in at any of the food spots',
    insiderTip: 'Allan\'s Bakery for Caribbean pastries (since 1961); Gloria\'s for the best Trinidadian curry chicken roti in Brooklyn. Cash is faster than cards at most spots.',
    tags: ['Food', 'Walk', 'Culture'],
  },
  'sight_sterling_st_johns_place': {
    lat: 40.6755, lng: -73.9560,
    longDesc: "The blocks between Sterling Place and St. Johns Place, running from Washington Avenue east to Nostrand, contain some of Brooklyn's best-preserved late-19th-century rowhouse architecture — limestone Renaissance Revivals, Romanesque brownstones, and turreted Queen Anne mansions, most built between 1885 and 1905 by the same group of speculative developers. Crown Heights North was designated a Historic District in 2007; the walk along these blocks is the architectural-history version of Park Slope's brownstone blocks, with about half the foot traffic.",
    admission: 'Free to walk',
    timeNeeded: '30–45 min',
    booking: 'No tickets needed',
    insiderTip: 'Start at the Brooklyn Museum and walk east on St. Johns — the architecture gets denser as you approach Nostrand. The mansions on Dean Street between Bedford and Nostrand are an even better one-block detour.',
    tags: ['Walk', 'Historic', 'Free'],
  },
}

// Slugify a name into a stable ID for use as a venue-like key.
function sightIdOf(name) {
  return 'sight_' + (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

// Flat lookup of every sight across every sub-neighborhood, keyed by sightId.
// Merged with SIGHT_ENRICHMENT so SightScreen can render planning detail when available.
const ALL_SIGHTS = (() => {
  const result = {}
  Object.entries(NEIGHBORHOOD_SUBAREAS).forEach(([parentKey, subAreas]) => {
    subAreas.forEach(sa => {
      sa.areas.forEach(area => {
        (area.sights || []).forEach(s => {
          const id = sightIdOf(s.name)
          if (!result[id]) {
            result[id] = {
              ...s,
              ...(SIGHT_ENRICHMENT[id] || {}),
              id,
              borough: parentKey,
              subArea: sa.label,
              neighborhood: area.name,
            }
          }
        })
      })
    })
  })
  return result
})()

// ── Cross-domain nearby venues ─────────────────────────────────────────
function getNearbyAcrossDomains(venueId, maxCount = 3) {
  const origin = venueCoords[venueId]
  if (!origin) return []
  const dist = (a, b) => {
    const dlat = a.lat - b.lat, dlng = a.lng - b.lng
    return Math.sqrt(dlat * dlat + dlng * dlng)
  }
  const candidates = []
  Object.entries(venueCoords).forEach(([id, coord]) => {
    if (id === venueId) return
    if (coord.domain === origin.domain) return
    const v = venues[id]
    if (!v) return
    candidates.push({ id, dist: dist(origin, coord), domain: coord.domain, venue: v })
  })
  candidates.sort((a, b) => a.dist - b.dist)
  // One result per domain, up to maxCount
  const seen = new Set()
  const result = []
  for (const c of candidates) {
    if (!seen.has(c.domain)) {
      seen.add(c.domain)
      result.push(c)
    }
    if (result.length >= maxCount) break
  }
  return result
}

// ── Graceful image fallback ───────────────────────────────────────────────
// Hex → "rgb(r,g,b)" — used to stretch a single accent color into a richer
// dark-to-light gradient for the fallback hero, so each show gets a card that
// feels themed rather than a generic purple placeholder.
function hexToRgb(hex) {
  const m = /^#?([a-f0-9]{6})$/i.exec(hex || '')
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [n >> 16 & 255, n >> 8 & 255, n & 255]
}
function shadeRgb([r, g, b], pct) {
  const t = pct < 0 ? 0 : 255
  const p = Math.abs(pct)
  return `rgb(${Math.round((t - r) * p) + r},${Math.round((t - g) * p) + g},${Math.round((t - b) * p) + b})`
}

function ImgWithFallback({ src, alt, className, style, fallbackColor }) {
  // Treat empty/missing src as a fallback too — browsers don't always fire
  // onError for blank src, which is why work cards with imageUrl: '' were
  // showing up as broken-image rectangles instead of the nice gradient.
  const [failed, setFailed] = useState(!src || src === '')
  const onError = useCallback(() => setFailed(true), [])

  if (failed) {
    // Build a 3-stop gradient from the venue accent color when provided,
    // otherwise use the original deep-purple Broadway gradient.
    const rgb = fallbackColor ? hexToRgb(fallbackColor) : null
    const gradient = rgb
      ? `linear-gradient(160deg, ${shadeRgb(rgb, -0.55)} 0%, ${shadeRgb(rgb, -0.15)} 50%, ${shadeRgb(rgb, -0.55)} 100%)`
      : 'linear-gradient(160deg, #1c1035 0%, #2a1650 50%, #1c0a35 100%)'
    return (
      <div
        className={className}
        style={{
          background: gradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 16px',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)',
        }} />
        <span style={{
          color: '#c9a84c',
          fontSize: '10px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          opacity: 0.8,
        }}>✦  ✦</span>
        <span style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: '15px',
          fontWeight: '700',
          textAlign: 'center',
          lineHeight: 1.25,
          letterSpacing: '0.3px',
        }}>{alt}</span>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} style={style} onError={onError} loading="lazy" />
}

// ── Nav stack ─────────────────────────────────────────────────────────────
function useNav() {
  const [stack, setStack] = useState([{ screen: 'home' }])
  const current = stack[stack.length - 1]
  const canGoBack = stack.length > 1

  function push(entry) {
    setStack(s => [...s, entry])
    window.scrollTo(0, 0)
  }
  function back() {
    setStack(s => s.slice(0, -1))
    window.scrollTo(0, 0)
  }
  function reset() {
    setStack([{ screen: 'home' }])
    window.scrollTo(0, 0)
  }

  return { current, canGoBack, push, back, reset }
}

// ── Top Nav ───────────────────────────────────────────────────────────────
function TopNav({ title, canGoBack, onBack, isHome }) {
  if (isHome) return null
  return (
    <div className="top-nav">
      {canGoBack && (
        <button className="nav-back" onClick={onBack} aria-label="Go back">
          ←
        </button>
      )}
      <span className="nav-title">{title}</span>
    </div>
  )
}

// ── Home Screen ───────────────────────────────────────────────────────────
// Bump this whenever editorial gets a meaningful refresh. The home screen
// shows a "what's new since you last visited" banner if a returning user's
// last-visit timestamp predates this date. Cheap and intentional — beats
// auto-tracking content updates.
const EDITORIAL_LAST_UPDATED = '2026-06-12'  // 12 Broadway shows + restaurant database
const EDITORIAL_LAST_UPDATE_BLURB = '6 blockbuster Broadway shows, 15 new restaurants in Eat, illustrated borough maps for Moods.'

// ── BottomSheet — draggable detail drawer ──────────────────────────────────
// Slides up from the bottom to a "peek" height; the user drags the grabber (or
// taps it) to expand to full-screen and scroll, or drags down to dismiss.
// Pointer-events based (works for touch + mouse). Self-unmounts after closing.
function BottomSheet({ open, onClose, children, defaultMode = 'peek', fit = false }) {
  const [mounted, setMounted] = React.useState(open)
  const [mode, setMode] = React.useState(defaultMode)   // 'peek' | 'full'
  const [drag, setDrag] = React.useState(0)         // live px offset while dragging
  const [dragging, setDragging] = React.useState(false)
  const startY = React.useRef(0)
  const moved = React.useRef(0)
  const fitScrollRef = React.useRef(null)
  const fitDraggingRef = React.useRef(false)
  const fitDragRef = React.useRef(0)
  const fitLastY = React.useRef(0)

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const SHEET_H = Math.round(vh * 0.92)
  const PEEK_VISIBLE = Math.round(vh * 0.54)
  const peekOffset = Math.max(0, SHEET_H - PEEK_VISIBLE)  // translateY when peeking

  React.useEffect(() => {
    if (open) { setMounted(true); setMode(defaultMode); setDrag(0) }
    else { const t = setTimeout(() => setMounted(false), 280); return () => clearTimeout(t) }
  }, [open])

  if (!mounted && !open) return null

  // ── Fit mode — a content-height card that pops up from the bottom (used for
  //    event detail). Hugs its content; scrolls only if it would exceed 92% vh.
  //    Drag the card DOWN to dismiss (only when the inner content is scrolled to
  //    the top, so scrolling long content still works). ──
  if (fit) {
    const d = Math.max(0, drag)
    // We take FULL control of the gesture (touch-action:none on the card stops the
    // browser claiming the drag as a scroll, which was killing the dismiss). Refs
    // hold the live gesture so handlers read it synchronously; we manually scroll
    // the inner content and only drag the sheet when pulling down from the top.
    const fitDown = (e) => {
      fitDraggingRef.current = true; fitDragRef.current = 0
      startY.current = e.clientY; fitLastY.current = e.clientY
      setDragging(true)
    }
    const fitMove = (e) => {
      if (!fitDraggingRef.current) return
      const el = fitScrollRef.current
      const y = e.clientY
      const delta = y - fitLastY.current       // per-frame movement; >0 = downward
      fitLastY.current = y
      const sheet = fitDragRef.current
      if (sheet > 0) {                          // already dragging the sheet — keep going (clamp at 0)
        const next = Math.max(0, sheet + delta)
        fitDragRef.current = next; setDrag(next); return
      }
      const canScroll = el && (el.scrollHeight - el.clientHeight > 1)
      if (canScroll && !(el.scrollTop <= 0 && delta > 0)) {
        el.scrollTop -= delta                   // scroll content (native scroll is off)
        return
      }
      if (delta > 0) { fitDragRef.current = delta; setDrag(delta) }  // begin sheet drag (down, at top / fits)
    }
    const fitEnd = () => {
      if (!fitDraggingRef.current) return
      fitDraggingRef.current = false
      setDragging(false)
      const v = fitDragRef.current
      fitDragRef.current = 0
      setDrag(0)
      if (v > 110) onClose?.()
    }
    return createPortal((
      <div aria-hidden={!open} style={{ position: 'fixed', inset: 0, zIndex: 3000, pointerEvents: open ? 'auto' : 'none' }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13,18,25,0.45)', opacity: open ? Math.max(0, 1 - d / 450) : 0, transition: dragging ? 'none' : 'opacity 260ms ease' }} />
        <div
          onPointerDown={fitDown} onPointerMove={fitMove} onPointerUp={fitEnd} onPointerCancel={fitEnd}
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            maxWidth: 480, margin: '0 auto', background: 'var(--white)',
            borderTopLeftRadius: 22, borderTopRightRadius: 22,
            boxShadow: '0 -12px 44px rgba(13,18,25,0.30)',
            maxHeight: '92dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            transform: open ? `translateY(${d}px)` : 'translateY(100%)',
            transition: dragging ? 'none' : 'transform 300ms cubic-bezier(0.32,0.72,0,1)',
            touchAction: 'none',
          }}>
          <div style={{ padding: '10px 0 2px', flexShrink: 0, cursor: 'grab' }}>
            <div style={{ width: 40, height: 5, borderRadius: 999, background: 'var(--gray-300)', margin: '0 auto' }} />
          </div>
          <div ref={fitScrollRef} style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>{children}</div>
        </div>
      </div>
    ), document.body)
  }

  const base = mode === 'full' ? 0 : peekOffset
  let translate = open ? Math.max(0, Math.min(base + drag, SHEET_H + 60)) : SHEET_H + 60

  const onDown = (e) => { setDragging(true); startY.current = e.clientY; moved.current = 0; e.currentTarget.setPointerCapture?.(e.pointerId) }
  const onMove = (e) => { if (!dragging) return; const dy = e.clientY - startY.current; moved.current = dy; setDrag(dy) }
  const onUp = () => {
    if (!dragging) return
    setDragging(false)
    const finalT = base + drag
    const wasTap = Math.abs(moved.current) < 6
    setDrag(0)
    if (wasTap) { setMode(mode === 'peek' ? 'full' : 'peek'); return }
    if (finalT > peekOffset + 140) onClose?.()          // dragged well below peek → dismiss
    else if (finalT < peekOffset * 0.55) setMode('full') // dragged up → full
    else setMode('peek')
  }

  return createPortal((
    <div aria-hidden={!open} style={{ position: 'fixed', inset: 0, zIndex: 3000, pointerEvents: open ? 'auto' : 'none' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13,18,25,0.45)', opacity: open ? 1 : 0, transition: 'opacity 260ms ease' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: SHEET_H,
        maxWidth: 480, margin: '0 auto', background: 'var(--white)',
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        boxShadow: '0 -12px 44px rgba(13,18,25,0.30)',
        transform: `translateY(${translate}px)`,
        transition: dragging ? 'none' : 'transform 280ms cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          style={{ padding: '10px 0 8px', cursor: 'grab', flexShrink: 0, touchAction: 'none' }}>
          <div style={{ width: 40, height: 5, borderRadius: 999, background: 'var(--gray-300)', margin: '0 auto' }} />
        </div>
        <div style={{ overflowY: mode === 'full' ? 'auto' : 'hidden', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </div>
    </div>
  ), document.body)
}

// ── EventDetail — fact-only detail shown inside the BottomSheet ──────────────
// NYC Open Data gives us facts (name/when/where) but no description, so the
// blurb here is our OWN generic, category-based copy — never source text.
// ── Event hero fallback — borrow a place photo when an event has none ────────
// Permitted street events (block parties, festivals) carry no image, but many
// are held in parks/plazas we already have photos of (Bryant Park, Central
// Park, …). If the event's location text names such a place, reuse its photo;
// otherwise the card keeps its colored panel + serif initial.
const _normPlace = (s) => (s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
const _EVENT_PLACE_PHOTOS = (() => {
  const out = []
  for (const id of Object.keys(venueImages)) {
    const nm = _normPlace(venues[id]?.name)
    if (nm.length >= 6) out.push([nm, venueImages[id]])
  }
  // Match the most specific (longest) place name first.
  out.sort((a, b) => b[0].length - a[0].length)
  return out
})()
// ── Location-image fallback (see "Image fall back.md") ───────────────────────
// An event with no photo of its own still shows a recognizable photo of WHERE
// it happens — its landmark / park / square / neighborhood, else its borough,
// else a generic NYC skyline — so no card is ever a bare placeholder. Keywords
// are matched against the event's location, longest (most specific) first.
// URLs are stable Wikimedia upload thumbnails; landmarks reuse venueImages.
const _wmThumb = (p) => 'https://upload.wikimedia.org/wikipedia/commons/' + p
const _LANDMARK_PHOTOS = [
  ['madison square garden', venueImages.msg],   // disambiguate before "madison square"
  ['union square',        _wmThumb('thumb/4/4a/1_new_york_city_union_square_2010.JPG/960px-1_new_york_city_union_square_2010.JPG')],
  ['madison square park',  _wmThumb('thumb/a/ac/Madison_Square_Park_from_Above_at_Night_New_York_City.jpg/960px-Madison_Square_Park_from_Above_at_Night_New_York_City.jpg')],
  ['madison square',       _wmThumb('thumb/a/ac/Madison_Square_Park_from_Above_at_Night_New_York_City.jpg/960px-Madison_Square_Park_from_Above_at_Night_New_York_City.jpg')],
  ['herald square',        _wmThumb('thumb/2/2d/Herald_Sq_in_Christmas_Day_2008.jpg/960px-Herald_Sq_in_Christmas_Day_2008.jpg')],
  ['tompkins square',      _wmThumb('thumb/2/2f/Tompkins_Square_Park.JPG/960px-Tompkins_Square_Park.JPG')],
  ['bryant park',          venueImages.bryant_park],
  ['central park',         venueImages.central_park],
  ['washington square',    venueImages.washington_square_park],
  ['battery park',         venueImages.battery_park],
  ['times square',         venueImages.times_square],
  ['high line',            venueImages.high_line],
  ['chelsea market',       venueImages.chelsea_market],
  ['rockefeller',          venueImages.rockefeller_center],
  ['prospect park',        _wmThumb('thumb/3/3a/Prospect_Park_New_York_October_2015_003.jpg/960px-Prospect_Park_New_York_October_2015_003.jpg')],
  ['brooklyn bridge park', _wmThumb('thumb/a/af/View_of_Brooklyn_Bridge_Park_from_Manhattan_Bridge.jpg/960px-View_of_Brooklyn_Bridge_Park_from_Manhattan_Bridge.jpg')],
  ['coney island',         _wmThumb('thumb/f/f0/Coney_Island_beach_and_amusement_parks_%28June_2016%29.jpg/960px-Coney_Island_beach_and_amusement_parks_%28June_2016%29.jpg')],
  ['flushing meadows',     _wmThumb('thumb/0/0e/Flushing_Meadows%E2%80%93Corona_Park.jpg/960px-Flushing_Meadows%E2%80%93Corona_Park.jpg')],
].filter(([, img]) => !!img)
const _BOROUGH_PHOTOS = {
  'Manhattan':     _wmThumb('thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/960px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'),
  'Brooklyn':      _wmThumb('thumb/d/dd/Brooklyn_skyline.jpg/960px-Brooklyn_skyline.jpg'),
  'Queens':        _wmThumb('thumb/4/4a/Flushing_Meadows_May_2024_64.jpg/960px-Flushing_Meadows_May_2024_64.jpg'),
  'The Bronx':     _wmThumb('thumb/a/ad/New_York_Botanical_Garden_April_2015_010.jpg/960px-New_York_Botanical_Garden_April_2015_010.jpg'),
  'Staten Island': _wmThumb('thumb/3/39/Look_out_point_%28cropped%29.jpg/960px-Look_out_point_%28cropped%29.jpg'),
}
const _NYC_SKYLINE = _BOROUGH_PHOTOS.Manhattan
// Returns { url, tier }: tier 2 = the event's own photo, 1 = a matched
// venue/landmark/neighborhood photo, 0 = borough / skyline fallback. Ranking
// uses the tier so curation still prefers events with real, specific photos.
function eventImagePick(e) {
  if (!e) return { url: _NYC_SKYLINE, tier: 0 }
  if (e.image) return { url: e.image, tier: 2 }
  const hay = _normPlace((e.location || '') + ' ' + (e.locationFull || ''))
  if (hay) {
    for (const [nm, img] of _EVENT_PLACE_PHOTOS) if (hay.includes(nm)) return { url: img, tier: 1 }
    for (const [kw, img] of _LANDMARK_PHOTOS) if (hay.includes(kw)) return { url: img, tier: 1 }
  }
  return { url: _BOROUGH_PHOTOS[e.borough] || _NYC_SKYLINE, tier: 0 }
}
function eventHeroImage(e) { return eventImagePick(e).url }

// ── Saved events store ──────────────────────────────────────────────────────
// Events (concerts, shows, street fairs) are dated, fixed-location objects, not
// routable venues — so "Add to My Trip" stores them in their own localStorage
// list, which My Trip renders as a chronological "Saved events" section.
const SAVED_EVENTS_KEY = 'nyc_saved_events'
function loadSavedEvents() { try { return JSON.parse(localStorage.getItem(SAVED_EVENTS_KEY) || '[]') } catch { return [] } }
function persistSavedEvents(arr) {
  try { lsSet(SAVED_EVENTS_KEY, JSON.stringify(arr)) } catch {}
  try { window.dispatchEvent(new Event('nyc-saved-events')) } catch {}
}
function isEventSaved(id) { return loadSavedEvents().some(e => e && e.id === id) }
function toggleEventSaved(ev) {
  if (!ev || !ev.id) return false
  const arr = loadSavedEvents()
  const i = arr.findIndex(e => e && e.id === ev.id)
  if (i >= 0) { arr.splice(i, 1); persistSavedEvents(arr); return false }
  arr.push({
    id: ev.id, source: ev.source, kind: ev.kind, kindLabel: ev.kindLabel, color: ev.color,
    title: ev.title, date: ev.date instanceof Date ? ev.date.toISOString() : null,
    borough: ev.borough, location: ev.location, locationFull: ev.locationFull,
    image: ev.image || null, ticketUrl: ev.ticketUrl || '', priceText: ev.priceText || '',
    genre: ev.genre || '', lat: ev.lat ?? null, lng: ev.lng ?? null, days: ev.days || '',
    website: ev.website || '',
    savedAt: Date.now(),
  })
  persistSavedEvents(arr)
  return true
}
// Stored ISO date → Date, so a saved event can re-render through EventDetail.
function hydrateSavedEvent(e) { return { ...e, date: e && e.date ? new Date(e.date) : null } }

function EventDetail({ event }) {
  const e = event
  // Hooks must run unconditionally (before any early return) and re-sync when the
  // sheet swaps to a different event.
  const [evSaved, setEvSaved] = React.useState(() => (e ? isEventSaved(e.id) : false))
  React.useEffect(() => { setEvSaved(e ? isEventSaved(e.id) : false) }, [e && e.id])
  if (!event) return null
  const heroImg = eventHeroImage(e)
  const WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const fullWhen = (() => {
    if (e.source === 'market') return [e.days && `Every ${e.days}`, e.hours].filter(Boolean).join(' · ') || 'Weekly'
    const d = e.date
    const base = `${WD[d.getDay()]}, ${MO[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    // Permitted events store the street-closure/setup time, not a public start
    // time — show day only for those; keep real showtimes for ticketed events.
    const hasTime = e.source === 'ticketmaster' && (d.getHours() !== 0 || d.getMinutes() !== 0)
    const tm = hasTime ? ` · ${(d.getHours() % 12) || 12}${d.getMinutes() ? ':' + String(d.getMinutes()).padStart(2, '0') : ''}${d.getHours() < 12 ? 'am' : 'pm'}` : ''
    return base + tm
  })()
  const BLURB = {
    'Farmers market': 'A neighborhood greenmarket — local farms selling produce, bread, and flowers. Bring a tote; many locations accept EBT/SNAP.',
    'Parade': 'A street parade — expect crowds, music, and rolling street closures nearby. Arrive early for a good vantage point.',
    'Block party': 'A block closed to traffic for music, food, and neighbors hanging out.',
    'Sidewalk sale': 'Local shops and vendors selling out on the sidewalk — good for a browse.',
    'Street festival': 'Food vendors, stalls, and music along a closed-off stretch of street.',
    'Street event': 'An outdoor street event — expect activity and possible street closures in the area.',
    'Event': 'A public event at this location. Check the time and head over.',
    'Plaza event': 'Programmed events in a public plaza — performances, activities, or community programming.',
    'Health fair': 'A community health fair — free screenings, information, and resources.',
    'Gathering': 'A community gathering at this location.',
    'Race / tour': 'An athletic race or tour — roads or paths along the route may be closed to traffic.',
  }
  const Row = ({ icon, children }) => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
      <span style={{ fontSize: 15, lineHeight: 1.4, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.45 }}>{children}</span>
    </div>
  )
  const open = (url) => { if (url) { try { window.open(url, '_blank', 'noopener') } catch (err) {} } }
  const addToCalendar = () => {
    if (e.source === 'market' || !(e.date instanceof Date) || isNaN(e.date.getTime())) return
    const d = e.date
    const z = (n) => String(n).padStart(2, '0')
    const day = (x) => `${x.getFullYear()}${z(x.getMonth() + 1)}${z(x.getDate())}`
    const stamp = (x) => `${day(x)}T${z(x.getHours())}${z(x.getMinutes())}00`
    const esc = (s) => String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
    // Only ticketed events get a timed calendar entry; permitted street events
    // (whose stored time is the permit/closure start) become all-day entries.
    const hasTime = e.source === 'ticketmaster' && (d.getHours() !== 0 || d.getMinutes() !== 0)
    const dt = hasTime
      ? `DTSTART:${stamp(d)}\r\nDTEND:${stamp(new Date(d.getTime() + 2 * 3600 * 1000))}`
      : `DTSTART;VALUE=DATE:${day(d)}\r\nDTEND;VALUE=DATE:${day(new Date(d.getTime() + 86400000))}`
    const loc = esc([e.locationFull || e.location, e.borough, 'New York, NY'].filter(Boolean).join(', '))
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NYC Stoop//Events//EN', 'BEGIN:VEVENT',
      `UID:${e.id}@nyc-stoop`, dt, `SUMMARY:${esc(e.title)}`, `LOCATION:${loc}`,
      'DESCRIPTION:Saved from NYC Stoop', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
    try {
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
      const a = document.createElement('a')
      a.href = url; a.download = (e.title || 'event').replace(/[^a-z0-9]+/gi, '_').slice(0, 40) + '.ics'
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    } catch (err) {}
  }
  const isTicketed = e.source === 'ticketmaster'
  // Priority for the primary action's destination:
  //   1. Official ticket page  → "Get tickets"
  //   2. Official website (e.g. a market's organizer page) → "Visit website"
  //   3. Ticketed without a URL → a "find tickets" search
  //   4. Otherwise (street events) → a "what's happening" info lookup
  // So whenever we actually have a real webpage, we link straight to it instead
  // of a search-results page.
  const hasTicketUrl = isTicketed && !!e.ticketUrl
  // A real official page for this event (a market's GrowNYC page, a greenmarket
  // street permit, or a known free series/organizer) — never a web search.
  // Centralized in eventOfficialUrl so the detail button and the Free-tab filter
  // agree on what counts as "has a real link."
  const website = !hasTicketUrl ? eventOfficialUrl(e) : ''
  const primaryUrl = hasTicketUrl ? e.ticketUrl
    : website ? website
    : isTicketed ? eventTicketSearchUrl(e)
    : eventSearchUrl(e)
  const primaryLabel = hasTicketUrl ? 'Get tickets →'
    : website ? '🌐 Visit website →'
    : isTicketed ? '🔎 Find tickets & info →'
    : '🔎 More info →'
  const sourceLine = e.source === 'ticketmaster'
    ? 'Source: Ticketmaster. Theatre tickets may be sold via the venue box office.'
    : 'From NYC’s public event permits — we list the date and place; tap above to find out more.'
  return (
    <div style={{ padding: '0 20px calc(40px + env(safe-area-inset-bottom, 0px))' }}>
      {heroImg ? (
        <div style={{ height: 150, borderRadius: 18, overflow: 'hidden', marginBottom: 16, background: `linear-gradient(135deg, ${e.color}, ${e.color}B0)` }}>
          <img src={heroImg} alt="" onError={e => { e.currentTarget.style.display = 'none' }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : (
        <div style={{ height: 120, borderRadius: 18, background: `linear-gradient(135deg, ${e.color}, ${e.color}B0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, marginBottom: 16 }}>{e.emoji}</div>
      )}
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: e.color, marginBottom: 6 }}>{e.kindLabel}</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.22, color: 'var(--ink)', margin: '0 0 16px' }}>{e.title}</h2>
      <Row icon="📅">{fullWhen}</Row>
      <Row icon="📍">{[e.locationFull || e.location, e.borough].filter(Boolean).join(' · ')}</Row>
      {e.priceText && <Row icon="🎟️">{e.priceText}</Row>}
      {/* Only show a description when it's a genuinely informative type-blurb
          (a parade, block party, etc.) — skip the vague "A public event…" filler
          to keep the card compact. */}
      {BLURB[e.kindLabel] && e.kindLabel !== 'Event' && e.kindLabel !== 'Plaza event' && (
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.55, margin: '14px 0 0' }}>
          {BLURB[e.kindLabel]}
        </div>
      )}
      <button onClick={() => setEvSaved(toggleEventSaved(e))}
        style={{ width: '100%', marginTop: 18, border: 'none', borderRadius: 999, padding: '14px', background: evSaved ? 'var(--ink)' : 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: evSaved ? 'none' : 'var(--shadow-accent)' }}>
        {evSaved ? '✓ In My Trip' : '+ Add to My Trip'}
      </button>
      <button onClick={() => open(primaryUrl)}
        style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 999, padding: '13px', marginTop: 10, background: 'var(--white)', color: 'var(--ink)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
        {primaryLabel}
      </button>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button onClick={() => open(eventMapsUrl(e))} style={{ flex: 1, border: '1.5px solid var(--gray-200)', borderRadius: 999, padding: '12px', background: 'var(--white)', color: 'var(--ink)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>📍 Directions</button>
        {e.source !== 'market' && (
          <button onClick={addToCalendar} style={{ flex: 1, border: '1.5px solid var(--gray-200)', borderRadius: 999, padding: '12px', background: 'var(--white)', color: 'var(--ink)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>📅 Add to calendar</button>
        )}
      </div>
      {/* Source note only for ticketed events; permitted/free events end on the
          action buttons to stay compact. */}
      {e.source === 'ticketmaster' && (
        <div style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5, marginTop: 16 }}>
          {sourceLine}
        </div>
      )}
    </div>
  )
}

// ── This Week in NYC — live events from NYC Open Data (src/lib/nycEvents.js) ──
// Lazily fetches this week's permitted events (street fairs, festivals, parades,
// markets) + recurring farmers markets, straight from the browser. Shows only
// facts (name, when, where) and links out to a map; never copies source copy.
// Hides itself entirely if the feed is empty or fails, so it can't render broken.
function ThisWeekSection() {
  const [state, setState] = React.useState({ loading: true, items: [] })
  const [selected, setSelected] = React.useState(null)
  React.useEffect(() => {
    let alive = true
    fetchThisWeek()
      .then(({ events, markets, ranked }) => {
        if (!alive) return
        // Editorially-ranked strip (high-signal first, greenmarkets capped).
        // Fall back to the old blend only if ranking somehow came back empty.
        const items = (ranked && ranked.length)
          ? ranked
          : [...events.slice(0, 8), ...markets.slice(0, 6)].slice(0, 12)
        setState({ loading: false, items })
      })
      .catch(() => { if (alive) setState({ loading: false, items: [] }) })
    return () => { alive = false }
  }, [])

  const { loading, items } = state
  if (!loading && items.length === 0) return null

  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const whenLabel = (e) => {
    if (e.source === 'market') return e.days ? `Every ${e.days.split(/[,&]/)[0].trim()}` : 'Weekly'
    const d = e.date, t0 = new Date(); t0.setHours(0, 0, 0, 0)
    const diff = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - t0) / 86400000)
    const day = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${WD[d.getDay()]} ${MO[d.getMonth()]} ${d.getDate()}`
    // Only show a clock time for ticketed events (Ticketmaster), which carry a
    // real public start time. Permitted street fairs / block parties store the
    // STREET-CLOSURE / setup time in start_date_time (often 7–10am), which is
    // not when the event is actually happening — so we show the day only.
    const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0
    const tm = (e.source === 'ticketmaster' && hasTime)
      ? ` · ${(d.getHours() % 12) || 12}${d.getMinutes() ? ':' + String(d.getMinutes()).padStart(2, '0') : ''}${d.getHours() < 12 ? 'am' : 'pm'}`
      : ''
    return day + tm
  }

  return (
    <div style={{ padding: '26px 0 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 20px' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 25, margin: 0, letterSpacing: '0.01em', color: 'var(--ink)' }}>{t('This week in NYC')}</h2>
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--field-clay)', fontWeight: 600, padding: '6px 20px 0' }}>Live from NYC Open Data · updates daily</div>
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '16px 20px 4px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {loading
          ? [0, 1, 2].map(i => <div key={i} style={{ flexShrink: 0, width: 252, height: 250, borderRadius: 16, background: 'var(--gray-100)' }} />)
          : items.map(e => {
            const initial = (e.title || '?').trim().charAt(0).toUpperCase()
            const heroImg = eventHeroImage(e)
            return (
            <button key={e.id} onClick={() => setSelected(e)}
              style={{ flexShrink: 0, width: 252, height: 250, border: '1px solid rgba(33,27,20,0.10)', borderRadius: 16, overflow: 'hidden', background: 'var(--card)', boxShadow: '0 6px 18px rgba(33,27,20,0.05)', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: 134, background: e.color, overflow: 'hidden', flexShrink: 0 }}>
                {heroImg && <img src={heroImg} alt="" onError={e => { e.currentTarget.style.display = 'none' }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: heroImg ? 'linear-gradient(to top, rgba(13,18,25,0.55), rgba(13,18,25,0.05))' : 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(0,0,0,0.18))' }} />
                {!heroImg && <div style={{ position: 'absolute', top: 12, left: 14, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 40, color: 'rgba(255,255,255,0.30)', lineHeight: 1 }}>{initial}</div>}
                <div style={{ position: 'absolute', top: 13, right: 14, fontSize: 9.5, letterSpacing: '0.2em', fontWeight: 700, color: '#fff', textTransform: 'uppercase', background: 'rgba(0,0,0,0.22)', padding: '4px 8px', borderRadius: 999 }}>{e.kindLabel}</div>
              </div>
              <div style={{ padding: '14px 16px 16px', flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 600, lineHeight: 1.15, color: 'var(--ink)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.3em' }}>{e.title}</div>
                <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent)', marginTop: 8 }}>{whenLabel(e)}</div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{[e.location, e.borough].filter(Boolean).join(' · ')}</div>
              </div>
            </button>
          )})}
      </div>
      <BottomSheet open={!!selected} onClose={() => setSelected(null)} fit>
        <EventDetail event={selected} />
      </BottomSheet>
    </div>
  )
}

// ── ActivityCoverArt — hand-drawn SVG scenes for the "What do you feel like?"
// cards, same illustration language as MoodCoverArt below. 158×150, sliced.
function ActivityCoverArt({ activityId }) {
  const svgProps = {
    viewBox: '0 0 158 150',
    preserveAspectRatio: 'xMidYMid slice',
    style: { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' },
    'aria-hidden': true,
  }
  switch (activityId) {
    case 'eat': // a steaming bowl on a warm table, fork and knife standing by
      return (
        <svg {...svgProps}>
          <rect width="158" height="150" fill="#D9A87C" />
          <rect y="96" width="158" height="54" fill="#B7472A" />
          <path d="M0 96h158" stroke="#8E3520" strokeWidth="2" opacity="0.5" />
          <ellipse cx="79" cy="98" rx="34" ry="9" fill="#8E3520" opacity="0.35" />
          <path d="M45 92c0 14 14 24 34 24s34-10 34-24z" fill="#F3EBDC" />
          <path d="M45 92c0 14 14 24 34 24s34-10 34-24z" fill="none" stroke="#D9C7A8" strokeWidth="1.5" />
          <ellipse cx="79" cy="92" rx="34" ry="8" fill="#C6892F" />
          <ellipse cx="79" cy="92" rx="26" ry="5.6" fill="#A96F22" />
          <path d="M66 74c-3-6 3-8 0-14M79 72c-3-6 3-8 0-14M92 74c-3-6 3-8 0-14" stroke="#F3EBDC" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85" />
          <rect x="24" y="84" width="3" height="30" rx="1.5" fill="#5C4230" />
          <path d="M23 84v-7M25.5 84v-7M28 84v-7" stroke="#5C4230" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M131 114V80c4 2 6 8 6 14 0 5-2 8-4 9v11z" fill="#5C4230" />
        </svg>
      )
    case 'drinks': // two glasses touching at golden hour
      return (
        <svg {...svgProps}>
          <rect width="158" height="150" fill="#5C3A4F" />
          <circle cx="120" cy="34" r="16" fill="#C6892F" opacity="0.55" />
          <rect y="112" width="158" height="38" fill="#3E2635" />
          <path d="M38 58l20 22v26M58 80l20-22" stroke="#F3EBDC" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 60h36l-4 5H44z" fill="#E8CDA8" opacity="0.9" />
          <path d="M48 112h20" stroke="#F3EBDC" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="92" y="62" width="26" height="48" rx="3" fill="none" stroke="#F3EBDC" strokeWidth="2.2" />
          <rect x="94" y="76" width="22" height="32" rx="2" fill="#C6892F" opacity="0.8" />
          <circle cx="100" cy="88" r="1.8" fill="#F3EBDC" opacity="0.8" />
          <circle cx="108" cy="96" r="1.5" fill="#F3EBDC" opacity="0.7" />
          <circle cx="104" cy="80" r="1.4" fill="#F3EBDC" opacity="0.6" />
          <path d="M92 66l-8-10" stroke="#6F7A45" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="83" cy="55" r="3.4" fill="#6F7A45" />
        </svg>
      )
    case 'coffee': // morning cup, saucer, croissant crescent
      return (
        <svg {...svgProps}>
          <rect width="158" height="150" fill="#E8D9BC" />
          <circle cx="126" cy="28" r="14" fill="#C6892F" opacity="0.4" />
          <rect y="104" width="158" height="46" fill="#C79A62" />
          <path d="M0 104h158" stroke="#A97F4C" strokeWidth="2" opacity="0.6" />
          <path d="M46 66h52v20c0 12-10 20-26 20s-26-8-26-20z" fill="#B7472A" />
          <path d="M98 70h10c7 0 11 4 11 10s-4 10-11 10h-12" fill="none" stroke="#B7472A" strokeWidth="5" />
          <ellipse cx="72" cy="66" rx="26" ry="6" fill="#7A2E1B" />
          <ellipse cx="72" cy="112" rx="34" ry="6" fill="#A97F4C" />
          <path d="M60 52c-3-6 3-8 0-14M74 50c-3-6 3-8 0-14M88 52c-3-6 3-8 0-14" stroke="#8A6A42" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M118 120c2-8 10-13 18-11-4 3-5 6-4 10-5-2-10-1-14 1z" fill="#C6892F" />
        </svg>
      )
    case 'outdoors': // the park: lawn, one good tree, picnic blanket
      return (
        <svg {...svgProps}>
          <rect width="158" height="150" fill="#CFE0D4" />
          <circle cx="128" cy="26" r="12" fill="#C6892F" />
          <circle cx="128" cy="26" r="18" fill="#C6892F" opacity="0.2" />
          <path d="M0 150V78c30-14 62-16 90-8s48 4 68-4v84z" fill="#6F7A45" />
          <path d="M0 150V102c34-10 66-8 96-2s44 0 62-6v56z" fill="#5D6A3A" />
          <rect x="44" y="58" width="5" height="34" rx="2.5" fill="#5C4230" />
          <circle cx="46" cy="46" r="20" fill="#7C8A4E" />
          <circle cx="34" cy="52" r="12" fill="#7C8A4E" />
          <circle cx="58" cy="52" r="13" fill="#7C8A4E" />
          <circle cx="46" cy="38" r="12" fill="#8B9A5C" />
          <path d="M92 120l28-8 12 10-28 8z" fill="#E8CDA8" />
          <path d="M98 122l24-7M104 126l20-6" stroke="#B7472A" strokeWidth="1.6" opacity="0.7" />
          <path d="M16 24c4 0 4-3 8-3s4 3 8 3" stroke="#93A88F" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'culture': // museum steps, columns, one red banner
      return (
        <svg {...svgProps}>
          <rect width="158" height="150" fill="#8FA3B0" />
          <path d="M79 14L24 40h110z" fill="#F3EBDC" />
          <path d="M79 22l-42 20h84z" fill="#D9CBB2" />
          <rect x="28" y="44" width="102" height="6" fill="#F3EBDC" />
          <g fill="#F3EBDC">
            <rect x="34" y="54" width="10" height="52" /><rect x="58" y="54" width="10" height="52" />
            <rect x="82" y="54" width="10" height="52" /><rect x="106" y="54" width="10" height="52" />
          </g>
          <g fill="#C9BBA0"><rect x="34" y="54" width="10" height="4" /><rect x="58" y="54" width="10" height="4" /><rect x="82" y="54" width="10" height="4" /><rect x="106" y="54" width="10" height="4" /></g>
          <rect x="28" y="106" width="102" height="6" fill="#D9CBB2" />
          <rect x="20" y="112" width="118" height="7" fill="#F3EBDC" />
          <rect x="12" y="119" width="134" height="7" fill="#D9CBB2" />
          <rect y="126" width="158" height="24" fill="#6B7B87" />
          <rect x="120" y="58" width="14" height="34" fill="#B7472A" />
          <path d="M120 92l7 6 7-6" fill="#B7472A" />
        </svg>
      )
    case 'live': // spotlight on a double bass, night stage
      return (
        <svg {...svgProps}>
          <rect width="158" height="150" fill="#2E2433" />
          <path d="M74 0l50 118H36z" fill="#E8CDA8" opacity="0.16" />
          <path d="M74 0l30 118H52z" fill="#E8CDA8" opacity="0.14" />
          <rect y="118" width="158" height="32" fill="#231B27" />
          <ellipse cx="80" cy="120" rx="40" ry="5" fill="#161018" opacity="0.8" />
          <path d="M80 44v66" stroke="#C6892F" strokeWidth="3" strokeLinecap="round" />
          <path d="M80 62c-12 0-18 8-16 18 1 7-3 8-2 14 2 12 10 18 18 18s16-6 18-18c1-6-3-7-2-14 2-10-4-18-16-18z" fill="#B7472A" />
          <path d="M72 96h16M74 90c2 3 10 3 12 0" stroke="#7A2E1B" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx="80" cy="42" r="4" fill="#C6892F" />
          <path d="M76 38l-3-3M84 38l3-3" stroke="#C6892F" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="26" cy="26" r="1.4" fill="#F3EBDC" opacity="0.6" />
          <circle cx="132" cy="20" r="1.2" fill="#F3EBDC" opacity="0.5" />
          <circle cx="142" cy="52" r="1.3" fill="#F3EBDC" opacity="0.45" />
        </svg>
      )
    default:
      return (
        <svg {...svgProps}>
          <rect width="158" height="150" fill="#8A7B63" />
          <circle cx="126" cy="28" r="14" fill="#F3EBDC" opacity="0.3" />
        </svg>
      )
  }
}

// ── FlowHero — the shared header for browse/flow screens: hand-drawn scene,
// warm scrim, serif headline. Born on the Eat screen; used by every activity
// and mood flow so the whole "what do you feel like?" family reads as one book.
function FlowHero({ art, eyebrow, title, body, compact = false }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', color: '#fff', padding: compact ? '24px 20px 18px' : '30px 20px 24px' }}>
      <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">{art}</div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(43,20,10,0.28) 0%, rgba(43,20,10,0.62) 100%)' }} />
      <div style={{ position: 'relative' }}>
        {eyebrow && (
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 6 }}>
            {eyebrow}
          </div>
        )}
        <div style={{ fontFamily: 'var(--serif)', fontSize: compact ? 24 : 27, fontWeight: 600, lineHeight: 1.15, marginBottom: body ? 7 : 0, textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
          {title}
        </div>
        {body && (
          <div style={{ fontSize: 13.5, lineHeight: 1.55, opacity: 0.92, maxWidth: 320 }}>
            {body}
          </div>
        )}
      </div>
    </div>
  )
}

// Editorial hero copy per activity flow (Eat has its own screen) and per mood.
const FLOW_HERO_COPY = {
  drinks:   { title: 'A drink, somewhere good.',  body: 'Cocktail dens, wine bars, and neighborhood taps — pick where, we’ll pour the list.' },
  coffee:   { title: 'Coffee worth the detour.',  body: 'Cafés and bakeries for slow mornings and fast fixes.' },
  outdoors: { title: 'Get some air.',             body: 'Parks, piers, and waterfront walks — the city’s free show.' },
  culture:  { title: 'Feed your curiosity.',      body: 'Museums, galleries, and landmarks worth the line.' },
  live:     { title: 'Hear it live.',             body: 'Jazz rooms, theaters, and stages lit up tonight.' },
}
const MOOD_HERO_TITLES = {
  just_chilling:  'Take the day slow.',
  date_night:     'Make it a night.',
  family_day:     'Bring everyone.',
  rainy_day:      'Weather for indoors.',
  first_time_nyc: 'Welcome to New York.',
}

// ── MoodCoverArt — hand-drawn SVG scenes for the collection cards. Each mood
// gets a tiny editorial illustration in the app's field palette instead of a
// flat tint + emoji (which read as machine-generated). 140×96, sliced to fill.
function MoodCoverArt({ moodId }) {
  const svgProps = {
    viewBox: '0 0 140 96',
    preserveAspectRatio: 'xMidYMid slice',
    style: { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' },
    'aria-hidden': true,
  }
  switch (moodId) {
    case 'just_chilling': // dawn over the waterfront — low sun, still water, pier posts
      return (
        <svg {...svgProps}>
          <rect width="140" height="96" fill="#E8CDA8" />
          <circle cx="70" cy="52" r="22" fill="#C6892F" />
          <circle cx="70" cy="52" r="30" fill="#C6892F" opacity="0.25" />
          <rect y="52" width="140" height="44" fill="#8FA3A8" />
          <rect y="52" width="140" height="5" fill="#7C939A" />
          <path d="M0 62h140" stroke="#E8CDA8" strokeWidth="1.6" opacity="0.5" />
          <path d="M20 70h34M86 76h30M34 84h44" stroke="#E8CDA8" strokeWidth="1.6" opacity="0.35" strokeLinecap="round" />
          <rect x="16" y="56" width="3" height="16" rx="1.5" fill="#5C5142" />
          <rect x="26" y="58" width="3" height="14" rx="1.5" fill="#5C5142" />
          <circle cx="102" cy="30" r="1.6" fill="#FFF" opacity="0.7" />
          <path d="M96 22c3 0 3-2.4 6-2.4s3 2.4 6 2.4" stroke="#7A6A50" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'date_night': // plum night — moon, skyline, lit windows, one table candle
      return (
        <svg {...svgProps}>
          <rect width="140" height="96" fill="#4A3140" />
          <circle cx="106" cy="22" r="11" fill="#F3EBDC" />
          <circle cx="102" cy="19" r="10" fill="#4A3140" />
          <circle cx="30" cy="14" r="1.2" fill="#F3EBDC" opacity="0.8" />
          <circle cx="52" cy="24" r="1" fill="#F3EBDC" opacity="0.6" />
          <circle cx="76" cy="10" r="1.1" fill="#F3EBDC" opacity="0.7" />
          <path d="M0 66V44h14v-8h10v14h12V36h6l2-8 2 8h6v22h14V50h12v16h16V54h12v12h20v-6h14v36H0z" fill="#2E1F2A" />
          <g fill="#C6892F">
            <rect x="6" y="52" width="3" height="4" opacity="0.9" /><rect x="17" y="44" width="3" height="4" opacity="0.7" />
            <rect x="40" y="46" width="3" height="4" opacity="0.85" /><rect x="60" y="58" width="3" height="4" opacity="0.7" />
            <rect x="78" y="56" width="3" height="4" opacity="0.9" /><rect x="96" y="60" width="3" height="4" opacity="0.75" />
            <rect x="118" y="66" width="3" height="4" opacity="0.85" />
          </g>
          <path d="M64 88c0-3 2.6-5 6-5s6 2 6 5" stroke="#C6892F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <circle cx="70" cy="79" r="1.8" fill="#E8CDA8" />
        </svg>
      )
    case 'family_day': // park hill, sun, kite on a string
      return (
        <svg {...svgProps}>
          <rect width="140" height="96" fill="#DCE3C8" />
          <circle cx="118" cy="18" r="10" fill="#C6892F" />
          <circle cx="118" cy="18" r="15" fill="#C6892F" opacity="0.22" />
          <path d="M0 96V70c22-12 44-14 70-9s48 2 70-6v41z" fill="#6F7A45" />
          <path d="M0 96V80c26-8 52-8 78-3s42 1 62-5v24z" fill="#5D6A3A" opacity="0.9" />
          <path d="M44 26l8 10-8 10-8-10z" fill="#B7472A" />
          <path d="M44 46c-2 6 2 8-1 13s2 7-1 11" stroke="#5C5142" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M50 50l4 2M38 54l4 2" stroke="#B7472A" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="20" r="1.4" fill="#FFF" opacity="0.9" />
          <path d="M12 30c3.5 0 3.5-2.6 7-2.6s3.5 2.6 7 2.6" stroke="#B9C29B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'rainy_day': // slate rain, one warm umbrella
      return (
        <svg {...svgProps}>
          <rect width="140" height="96" fill="#475A66" />
          <g stroke="#93A6B0" strokeWidth="1.3" strokeLinecap="round" opacity="0.55">
            <path d="M18 8l-5 14M44 4l-5 14M70 10l-5 14M96 2l-5 14M122 8l-5 14" />
            <path d="M30 30l-5 14M58 34l-5 14M86 28l-5 14M112 34l-5 14M134 30l-4 11" />
            <path d="M12 54l-4 11M100 56l-4 11M128 58l-4 11" />
          </g>
          <path d="M38 62c0-12 14-20 32-20s32 8 32 20c-5-4-10-4-14 0-4-5-9-5-13 0-4-5-9-5-13 0-4-4-9-4-14 0-4-4-9-4-10 0z" fill="#B7472A" />
          <path d="M70 62v20c0 4-3 6-6 6" stroke="#F3EBDC" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="52" cy="92" rx="16" ry="2.4" fill="#3A4B55" />
          <ellipse cx="96" cy="90" rx="10" ry="2" fill="#3A4B55" />
        </svg>
      )
    case 'first_time_nyc': // clay dusk, the skyline you came for, a guiding star
      return (
        <svg {...svgProps}>
          <rect width="140" height="96" fill="#C97F52" />
          <rect width="140" height="40" fill="#D89562" opacity="0.7" />
          <path d="M70 8l1.8 4.6 4.6 1.8-4.6 1.8L70 21l-1.8-4.8-4.6-1.8 4.6-1.8z" fill="#F3EBDC" />
          <path d="M0 96V60h12V48h8v12h10V38h10v22h8l4-18 2-8 2 8 4 18h8V30h4l2-10 2 10h4v30h10V44h10v16h8v-8h12v10h10v34z" fill="#6E3A24" />
          <g fill="#F3EBDC" opacity="0.8">
            <rect x="15" y="66" width="2.6" height="3.4" /><rect x="34" y="48" width="2.6" height="3.4" />
            <rect x="56" y="52" width="2.6" height="3.4" /><rect x="70" y="40" width="2.6" height="3.4" />
            <rect x="88" y="56" width="2.6" height="3.4" /><rect x="106" y="62" width="2.6" height="3.4" />
            <rect x="124" y="70" width="2.6" height="3.4" />
          </g>
        </svg>
      )
    default: // unknown mood — warm tint fallback, never a blank
      return (
        <svg {...svgProps}>
          <rect width="140" height="96" fill="#8A7B63" />
          <circle cx="112" cy="20" r="12" fill="#F3EBDC" opacity="0.3" />
        </svg>
      )
  }
}

function HomeScreen({ push, savedItems, toggleSave, onSeeAllTonight = () => {}, onOpenSettings = () => {}, onPlanNight = () => {}, userVenues = {}, weather = null, user = null }) {
  const [query, setQuery] = useState('')
  // Live events join search results lazily: fetched on the first real keystroke
  // (never on mount), served from the ticketmaster module's session cache — so
  // if the user already visited Events, this costs zero network.
  const [liveEvents, setLiveEvents] = React.useState(null) // null = not loaded yet
  const [eventSheet, setEventSheet] = React.useState(null)
  React.useEffect(() => {
    if (query.trim().length < 2 || liveEvents !== null) return
    let alive = true
    setLiveEvents([]) // mark as loading so we fetch once
    fetchTicketmaster().then(evs => { if (alive) setLiveEvents(Array.isArray(evs) ? evs : []) }).catch(() => {})
    return () => { alive = false }
  }, [query, liveEvents])
  // Live clock for the header chip (Tue · 7:42 PM). Ticks every 30s.
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, [])
  // (Day/time chip removed — the iOS status bar already shows the time, and the
  // chip crowded the centered wordmark. `now` still drives the contextual line.)
  // Last-visit ribbon — show what changed since the user's previous open.
  // null = first visit; we don't pester first-timers with a "what's new" banner.
  const [whatsNewVisible, setWhatsNewVisible] = React.useState(() => {
    try {
      const last = localStorage.getItem('nyc_last_visit')
      const dismissed = localStorage.getItem('nyc_whats_new_dismissed_for')
      if (!last) return false  // first visit
      if (dismissed === EDITORIAL_LAST_UPDATED) return false  // already saw + dismissed
      return last < EDITORIAL_LAST_UPDATED  // came back after content was refreshed
    } catch { return false }
  })
  React.useEffect(() => {
    try { lsSet('nyc_last_visit', new Date().toISOString().slice(0, 10)) } catch {}
  }, [])
  function dismissWhatsNew() {
    setWhatsNewVisible(false)
    try { lsSet('nyc_whats_new_dismissed_for', EDITORIAL_LAST_UPDATED) } catch {}
  }
  const [browseBy, setBrowseBy] = useState('topics') // 'topics' | 'neighborhoods'

  // Global search across venues, sights (Brooklyn deep-dive), works, figures, and user-added places.
  // Results are ordered: exact-prefix matches first, then partial matches; capped at 25 to stay snappy.
  const searchResults = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const results = []
    Object.values(venues).forEach(v => {
      if (v.name.toLowerCase().includes(q))
        results.push({ type: 'venue', id: v.id, name: v.name, sub: v.neighborhood || '' })
    })
    Object.values(ALL_SIGHTS).forEach(s => {
      if ((s.name || '').toLowerCase().includes(q))
        results.push({ type: 'sight', id: s.id, name: s.name, sub: `${s.neighborhood || ''}${s.neighborhood && s.subArea ? ' · ' : ''}${s.subArea || ''}` })
    })
    Object.values(figures).forEach(f => {
      if (f.name.toLowerCase().includes(q)) {
        const t = topics[f.topicId]
        results.push({ type: 'figure', id: f.id, name: f.name, sub: t?.name || '' })
      }
    })
    Object.values(works).forEach(w => {
      if (w.title.toLowerCase().includes(q)) {
        const fig = figures[w.figureId]
        results.push({ type: 'work', id: w.id, name: w.title, sub: fig?.name || '' })
      }
    })
    // user_venues (dataset seeds + the user's own adds) are deliberately NOT
    // searched: they have no detail screen, so their rows would be dead taps.
    // The zero-result state hands off to Google Maps instead. If they ever get
    // a sheet (v1.1), restore the loop that was here.
    // Live events this week — "ariana" should find the concert, not dead-end.
    // Matches on title or venue name; shows date so same-title runs read apart.
    const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    ;(liveEvents || []).forEach(ev => {
      if (!((ev.title || '').toLowerCase().includes(q) || (ev.location || '').toLowerCase().includes(q))) return
      const d = ev.date
      const when = d instanceof Date ? `${WD[d.getDay()]} ${MO[d.getMonth()]} ${d.getDate()}` : ''
      results.push({ type: 'event', id: ev.id, name: ev.title, sub: [ev.location, when].filter(Boolean).join(' · '), event: ev })
    })
    // Boost exact-prefix matches to the top.
    results.sort((a, b) => {
      const ap = a.name.toLowerCase().startsWith(q) ? 0 : 1
      const bp = b.name.toLowerCase().startsWith(q) ? 0 : 1
      return ap - bp
    })
    return results.slice(0, 25)
  }, [query, liveEvents])

  // BottomNav is 60px + iPhone home-indicator inset; no TopNav on home —
  // so available height = 100dvh - 60px - safe-area-inset-bottom.
  return (
    <div style={{
      height: 'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>

      {/* ── Pinned header + search — never scrolls away ── */}
      <div style={{ flexShrink: 0 }}>
        {/* What's new ribbon — shown when a returning user's last visit
            predates the EDITORIAL_LAST_UPDATED constant. Dismissible per
            update so users only see each refresh once. */}
        {whatsNewVisible && (
          <div style={{
            background: 'rgba(190,77,43,0.12)',
            color: 'var(--ink)',
            padding: '8px 14px 8px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 12, lineHeight: 1.4,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, letterSpacing: '0.02em', color: 'var(--ink)' }}>New since you visited</div>
              <div style={{ fontSize: 11, marginTop: 1, color: 'var(--ink-2)' }}>
                {EDITORIAL_LAST_UPDATE_BLURB}
              </div>
            </div>
            <button
              onClick={dismissWhatsNew}
              aria-label="Dismiss what's new"
              style={{
                background: 'rgba(29,39,51,0.08)',
                border: 'none', borderRadius: 999,
                width: 22, height: 22,
                color: 'var(--ink)', fontSize: 11, cursor: 'pointer',
                flexShrink: 0, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>
        )}
        {/* ── Header — weather (top-left) · serif wordmark (centered) · avatar ── */}
        <div style={{
          position: 'relative',
          padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 20px 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--canvas)',
        }}>
          <div style={{ minWidth: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, zIndex: 1 }} aria-label={weather ? `${weather.temp} degrees` : undefined}>
            {weather && (
              <>
                <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden="true">{weatherEmoji(weather.code, weather.isDay)}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{fmtTemp(weather.temp)}°</span>
              </>
            )}
          </div>
          {/* Absolutely centered so the wider weather chip on the left can't push it
              off-center. Vertical anchor = the CONTENT row's center (padding-top +
              half the 40px row), NOT 50% of the box — the box includes the iPhone
              safe-area inset, which made the wordmark ride high on device. */}
          <div style={{ position: 'absolute', left: '50%', top: 'calc(env(safe-area-inset-top, 0px) + 12px + 20px)', transform: 'translate(-50%, -50%)', textAlign: 'center', lineHeight: 1, pointerEvents: 'none' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--field-clay)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{t('The City Guide')}</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 25, fontWeight: 500, letterSpacing: '0.01em', color: 'var(--ink)' }}>
              NYC <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Stoop</span>
            </div>
          </div>
          {/* Signed in → their profile photo (local avatar overlay wins, then the
              provider's picture); signed out → the generic icon. Photo failures
              fall back to the icon rather than a broken circle. */}
          {(() => {
            const overlay = user ? getProfileOverlay(user.email) : null
            const avatarSrc = (overlay && overlay.avatar) || user?.picture_url || null
            return (
              <button onClick={onOpenSettings} aria-label="Profile and settings" style={{
                width: 40, height: 40, borderRadius: 999, background: 'var(--accent)',
                border: 'none', cursor: 'pointer', padding: 0, zIndex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: '0 2px 8px rgba(190,77,43,0.35)', overflow: 'hidden',
              }}>
                {avatarSrc
                  ? <img src={avatarSrc} alt="" referrerPolicy="no-referrer"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <NavIcon name="user" size={18} color="#fff" />}
              </button>
            )
          })()}
        </div>
        <div style={{ padding: '6px 20px 12px', background: 'var(--canvas)' }}>
          {/* Contextual lead — weather × time of day, one line. */}
          {(() => {
            const line = weatherLine(weather, now.getHours())
            return line ? (
              <div style={{ textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14.5, color: 'var(--ink-2)', padding: '0 4px 10px', lineHeight: 1.35 }}>
                {line}
              </div>
            ) : null
          })()}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 11,
            background: 'var(--card)', border: '1px solid rgba(33,27,20,0.12)',
            borderRadius: 14, padding: '13px 16px',
          }}>
            <span style={{ color: 'var(--gray-400)', flexShrink: 0, display: 'inline-flex' }}><NavIcon name="search" size={17} /></span>
            <input
              type="search"
              placeholder={t('Search venues, sights, artists…')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: 15, color: 'var(--gray-900)', fontFamily: 'inherit',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--gray-400)', fontSize: 16, padding: 0, lineHeight: 1,
              }}>&#x2715;</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable content area ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {query.trim() ? (
        <div style={{ padding: '8px 20px 40px' }}>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px 24px', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>&#128269;</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 500, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.2 }}>
                Not curated &#8220;{query}&#8221; yet
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 280, margin: '0 auto 20px' }}>
                We focus on hand-picked spots with editorial detail. For broader coverage of bookstores, wine bars, and everything else, Google Maps is still your friend.
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(query + ' New York City')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--accent)', color: '#fff',
                  padding: '11px 18px', borderRadius: 12,
                  textDecoration: 'none', fontFamily: 'inherit',
                  fontSize: 13, fontWeight: 700,
                  boxShadow: '0 6px 16px rgba(190,77,43,0.30)',
                }}
              >
                <span>🗺️</span>
                <span>Search Google Maps</span>
                <span>↗</span>
              </a>
              <div style={{ marginTop: 18, fontSize: 11, color: 'var(--gray-400)' }}>
                Or try a venue, neighborhood, or artist name in NYC Stoop.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
              {searchResults.map(r => {
                const typeMeta = {
                  venue:      { label: 'Venue',  color: '#1a56db' },
                  sight:      { label: 'Sight',  color: '#0891b2' },
                  figure:     { label: 'Artist', color: '#7c3aed' },
                  work:       { label: 'Work',   color: '#059669' },
                  user_venue: { label: 'Place',  color: '#b45309' },
                  event:      { label: 'Event',  color: '#a3408c' },
                }
                const meta = typeMeta[r.type] || { label: r.type, color: '#666' }
                // Seed imports aren't the user's own places — badge them honestly.
                if (r.type === 'user_venue' && !r.seed) meta.label = 'Yours'
                const onPress = () => {
                  if (r.type === 'venue')        push({ screen: 'venue', venueId: r.id })
                  else if (r.type === 'sight')   push({ screen: 'sight', sightId: r.id })
                  else if (r.type === 'figure')  push({ screen: 'figure', figureId: r.id })
                  else if (r.type === 'work')    push({ screen: 'work', workId: r.id })
                  else if (r.type === 'event')   setEventSheet(r.event)
                  // user_venue has no detail screen — tapping does nothing for now
                }
                return (
                  <button key={r.type + ':' + r.id} onClick={onPress} disabled={r.type === 'user_venue'} style={{
                    width: '100%', background: 'var(--card)', border: '1px solid rgba(33,27,20,0.10)',
                    borderRadius: 12, padding: '13px 16px',
                    cursor: r.type === 'user_venue' ? 'default' : 'pointer',
                    textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                      color: meta.color, background: meta.color + '18', padding: '3px 8px', borderRadius: 20, flexShrink: 0,
                    }}>{meta.label}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      {r.sub && <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 1 }}>{r.sub}</div>}
                    </div>
                    <div style={{ color: 'var(--gray-300)', fontSize: 20, flexShrink: 0 }}>&#8250;</div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {(() => {
            const domainColors = { jazz: '#C8823A', visual_art: '#5B7FA6', classical_music: '#7B6FA6', theater: '#A65B7B', sports: '#4A8C5C', architecture: '#8C6A4A', history: '#6A6A6A', hip_hop: '#3A3A8C' }
            // Hero rotation: only picks actually ON tonight (bestDays-aware — fixes
            // B1: recommending a dark-Monday show), preferring ones with photos so
            // the first impression always shows a photo.
            const todayDow = new Date().getDay()
            const onTonight = tonightPicks.filter(p => !Array.isArray(p.bestDays) || p.bestDays.includes(todayDow))
            const heroPool = onTonight.length > 0 ? onTonight : tonightPicks
            const picksWithImages = heroPool.filter(p => p.image)
            const heroCandidates = picksWithImages.length > 0 ? picksWithImages : heroPool
            const heroIndex = heroCandidates.length ? new Date().getDay() % heroCandidates.length : 0
            const heroPick = heroCandidates[heroIndex]
            const heroColor = heroPick ? (domainColors[heroPick.domain] || '#888') : '#888'
            const heroDomain = heroPick ? domains[heroPick.domain] : null
            const carouselPicks = tonightPicks.filter(p => p.id !== heroPick?.id).slice(0, 4)
            return (
              <>
                {/* ── Plan my night — gradient hero card ── */}
                <div style={{ padding: '16px 20px 4px' }}>
                  <button onClick={onPlanNight} style={{
                    width: '100%', textAlign: 'left', position: 'relative', overflow: 'hidden',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    borderRadius: 18, background: 'linear-gradient(135deg, #C4542F 0%, #A93C1E 100%)',
                    padding: 20, boxShadow: '0 10px 26px rgba(169,60,30,0.30)',
                  }}>
                    <div style={{ position: 'absolute', right: -28, top: -28, width: 130, height: 130, borderRadius: 999, background: 'rgba(255,255,255,0.07)' }} />
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 9.5, letterSpacing: '0.26em', color: 'rgba(255,255,255,0.72)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{t('Tonight, curated')}</div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 27, fontWeight: 500, color: '#fff', lineHeight: 1.05 }}>{t('Plan my night')}</div>
                        <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.82)', marginTop: 6, maxWidth: 220, lineHeight: 1.35 }}>{t('A routed plan with food, in a couple of taps.')}</div>
                      </div>
                      <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h11M10 4.5L14.5 9 10 13.5" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </button>
                </div>

                {/* ── This Week in NYC — live events, the new top section ── */}
                <ThisWeekSection />

                {/* Night-Out Inspiration hero removed — "This Week in NYC" (above)
                    is the home lead now; nightlife lives in the Tonight tab. */}

                {/* "More for tonight" carousel removed — the Tonight tab in the
                    bottom nav already surfaces the full set of picks, so showing
                    a teaser here was redundant. */}

                {/* ── What do you feel like? — activity-first cards (same card style) ── */}
                <div style={{ padding: '24px 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 20px' }}>
                    <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 25, margin: 0, letterSpacing: '0.01em', color: 'var(--ink)' }}>{t('What do you feel like?')}</h2>
                  </div>
                  {(() => {
                    // Activity-first: lead with the six activities. "Eat" opens the
                    // dedicated restaurant browser; the rest open the guided flow
                    // seeded with that activity (place → picks), via the synthetic
                    // "anything" mood. Covers are hand-drawn scenes (ActivityCoverArt),
                    // matching the collection cards below — numbered badges retired.
                    const items = [
                      { key: 'eat',      title: t('Eat'),      meta: t('Restaurants'),            onClick: () => push({ screen: 'eat' }) },
                      { key: 'drinks',   title: t('Drinks'),   meta: t('Bars, cocktails, wine'),  onClick: () => push({ screen: 'mood', moodId: 'anything', activityId: 'drinks' }) },
                      { key: 'coffee',   title: t('Coffee'),   meta: t('Cafés & bakeries'),       onClick: () => push({ screen: 'mood', moodId: 'anything', activityId: 'coffee' }) },
                      { key: 'outdoors', title: t('Outdoors'), meta: t('Parks & waterfront'),     onClick: () => push({ screen: 'mood', moodId: 'anything', activityId: 'outdoors' }) },
                      { key: 'culture',  title: t('Culture'),  meta: t('Museums & landmarks'),    onClick: () => push({ screen: 'mood', moodId: 'anything', activityId: 'culture' }) },
                      { key: 'live',     title: t('Live'),     meta: t('Jazz, theater, music'),   onClick: () => push({ screen: 'mood', moodId: 'anything', activityId: 'live' }) },
                    ]
                    return (
                      <div style={{ display: 'flex', gap: 13, overflowX: 'auto', padding: '16px 20px 4px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="hide-scrollbar">
                        {items.map(it => (
                          <button key={it.key} onClick={it.onClick} style={{
                            flexShrink: 0, width: 158, padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                            borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(33,27,20,0.10)', background: 'var(--card)',
                            boxShadow: '0 6px 18px rgba(33,27,20,0.05)', display: 'flex', flexDirection: 'column',
                          }}>
                            <span style={{ height: 150, position: 'relative', display: 'block' }}>
                              <ActivityCoverArt activityId={it.key} />
                              <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(20,14,8,0.40))' }} />
                              <span style={{ position: 'absolute', left: 14, right: 14, bottom: 12, fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 600, color: '#fff', lineHeight: 1.08, textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{it.title}</span>
                            </span>
                            <span style={{ background: 'var(--card)', padding: '11px 14px 13px', fontSize: 12.5, color: 'var(--ink-3)' }}>{it.meta}</span>
                          </button>
                        ))}
                      </div>
                    )
                  })()}
                </div>

                {/* ── Feeling something specific? — the curated moods, rehomed as
                    collections. Activities answer "I know what I want"; these answer
                    "guide me." Smaller cards so the hierarchy reads verbs-first.
                    Covers are hand-drawn SVG scenes (see MoodCoverArt), one per mood. ── */}
                <div style={{ padding: '22px 0 0' }}>
                  <div style={{ padding: '0 20px' }}>
                    <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 20, margin: 0, letterSpacing: '0.01em', color: 'var(--ink)' }}>{t('Feeling something specific?')}</h2>
                  </div>
                  <div style={{ display: 'flex', gap: 11, overflowX: 'auto', padding: '12px 20px 4px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="hide-scrollbar">
                    {moods.map(m => (
                      <button key={m.id} onClick={() => push({ screen: 'mood', moodId: m.id })} style={{
                        flexShrink: 0, width: 136, padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                        borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(33,27,20,0.10)', background: 'var(--card)',
                        boxShadow: '0 4px 12px rgba(33,27,20,0.04)', display: 'flex', flexDirection: 'column',
                      }}>
                        <span style={{ height: 96, position: 'relative', display: 'block' }}>
                          <MoodCoverArt moodId={m.id} />
                          {/* Scrim keeps the serif label legible over any scene */}
                          <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(20,14,8,0.42))' }} />
                          <span style={{ position: 'absolute', left: 12, right: 12, bottom: 9, fontFamily: 'var(--serif)', fontSize: 16.5, fontWeight: 600, color: '#fff', lineHeight: 1.1, textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{t(m.label)}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Browse by topic / neighborhood — toggle pill + horizontal chip scroll ── */}
                <div style={{ padding: '20px 0 8px' }}>
                  {/* Section header row: small label + toggle pill */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14, gap: 12 }}>
                    <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 25, margin: 0, letterSpacing: '0.01em', color: 'var(--ink)' }}>{t('Browse by')}</h2>
                    <div role="tablist" style={{
                      display: 'inline-flex', background: '#EBE0CD', border: '1px solid rgba(33,27,20,0.10)', borderRadius: 999, padding: 3,
                    }}>
                      {[
                        { id: 'topics',        label: t('Topics') },
                        { id: 'neighborhoods', label: t('Areas') },
                      ].map(opt => {
                        const isActive = browseBy === opt.id
                        return (
                          <button key={opt.id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setBrowseBy(opt.id)}
                            style={{
                              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                              padding: '6px 15px', borderRadius: 999,
                              fontSize: 13, fontWeight: 600, letterSpacing: '0.01em',
                              background: isActive ? '#211B14' : 'transparent',
                              color: isActive ? '#F3EBDC' : '#7A7062',
                              transition: 'all 0.18s ease',
                            }}>
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Chip grid — equal-width 2-column grid so rows align cleanly, no orphan items. */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 8,
                    padding: '0 20px 4px',
                  }}>
                    {browseBy === 'topics' && Object.values(domains).map(domain => {
                      const count = (domain.venueIds || []).length
                      const tint = domainColors[domain.id] || 'var(--gray-500)'
                      return (
                        <button key={domain.id}
                          onClick={() => push({ screen: 'domain', domainId: domain.id })}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                            padding: '16px 12px', borderRadius: 14, minHeight: 74,
                            background: 'var(--card)', border: '1px solid rgba(33,27,20,0.10)',
                            cursor: 'pointer', width: '100%', fontFamily: 'inherit',
                          }}>
                          <span style={{ width: 7, height: 7, borderRadius: 999, background: tint, flexShrink: 0 }} />
                          <span style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500, color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2 }}>{domain.name}</span>
                        </button>
                      )
                    })}

                    {browseBy === 'neighborhoods' && NEIGHBORHOOD_GROUPS.map(grp => {
                      const count = getNeighborhoodVenues(grp.key, venues).length
                      const hasSubAreas = (NEIGHBORHOOD_SUBAREAS[grp.key] || []).length > 0
                      const showSoonBadge = !!grp.comingSoon && count === 0
                      return (
                        <button key={grp.key}
                          onClick={() => push({ screen: 'neighborhood', neighborhoodKey: grp.key })}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                            padding: '16px 12px', borderRadius: 14, minHeight: 74,
                            background: 'var(--card)', border: '1px solid rgba(33,27,20,0.10)',
                            cursor: 'pointer', width: '100%', fontFamily: 'inherit',
                            opacity: showSoonBadge ? 0.78 : 1,
                          }}>
                          {showSoonBadge ? (
                            <span style={{
                              fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                              color: '#92400e', background: '#fef3c7', padding: '2px 7px', borderRadius: 999,
                            }}>Soon</span>
                          ) : (
                            <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--field-clay)', flexShrink: 0 }} />
                          )}
                          <span style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500, color: showSoonBadge ? 'var(--gray-500)' : 'var(--ink)', textAlign: 'center', lineHeight: 1.2 }}>{grp.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Footer block removed — the scroll ends cleanly on the chip grid;
                    adding a small bottom margin so the last chips don't bump into the BottomNav. */}
                <div style={{ height: 24 }} />
              </>
            )
          })()}
        </>
      )}
      </div>{/* end scrollable content */}

      {/* Event detail — same sheet the Events tab uses, opened from search. */}
      <BottomSheet open={!!eventSheet} onClose={() => setEventSheet(null)} fit>
        {eventSheet && <EventDetail event={eventSheet} />}
      </BottomSheet>
    </div>
  )
}
// ── Domain Screen ─────────────────────────────────────────────────────────
function DomainScreen({ domainId, push, savedItems = {} }) {
  const domain = domains[domainId]

  // Sports (and future venueFirst domains): go straight to venue cards
  if (domain.venueFirst) {
    const hasGroups = domain.venueGroups?.length > 0
    const domainVenues = (domain.venueIds || []).map(id => venues[id]).filter(Boolean)
    return (
      <div className="screen">
        <div className="section">
          <p className="meta">{domain.icon} {domain.name}</p>
          <h1 className="display" style={{ marginTop: 8 }}>Where do you want to go?</h1>
          <p style={{ marginTop: 10, fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.5 }}>
            {domain.description}
          </p>
        </div>

        {hasGroups ? (
          <div style={{ padding: '4px 20px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {domain.venueGroups.map((group, idx) => (
              <button
                key={group.name || group.label || idx}
                onClick={() => push({ screen: 'venueGroup', domainId, groupIndex: idx })}
                style={{
                  width: '100%',
                  background: 'var(--card)',
                  border: '1px solid rgba(33,27,20,0.10)',
                  borderRadius: 14,
                  padding: '18px 20px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--gray-900)', marginBottom: 4 }}>
                    {group.name || group.label}
                  </div>
                  {(group.description || group.note) && (
                    <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.4 }}>
                      {group.description || group.note}
                    </div>
                  )}
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--gray-400)' }}>
                    {group.venueIds.length} {group.venueIds.length === 1 ? 'site' : 'sites'}
                  </div>
                </div>
                <div style={{ color: 'var(--gray-300)', fontSize: 22, flexShrink: 0 }}>›</div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ padding: '4px 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {domainVenues.map(v => (
              <VenueTapCard
                key={v.id}
                venue={v}
                isSaved={!!savedItems[`venue:${v.id}`]}
                onPress={() => push({ screen: 'venue', venueId: v.id, fromDomainId: domainId })}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Interest-first domains (Visual Art, Jazz, Classical)
  const domainTopics = domain.topicIds.map(id => topics[id]).filter(Boolean)
  return (
    <div className="screen">
      <div className="section">
        <p className="meta">{domain.icon} {domain.name}</p>
        <h1 className="display" style={{ marginTop: 8 }}>What draws you in?</h1>
      </div>

      <div className="card-list">
        {domainTopics.map(topic => (
          <button
            key={topic.id}
            className="card"
            onClick={() => push({ screen: 'topic', topicId: topic.id })}
          >
            <div className="card-body">
              <div className="card-name">{topic.name}</div>
              {topic.years && <div className="card-meta">{topic.years}</div>}
              <div className="card-tagline">{topic.tagline}</div>
            </div>
          </button>
        ))}

        {domain.comingSoon && domain.comingSoon.length > 0 && (
          <>
            <div className="section-label" style={{ marginBottom: 0, paddingTop: 8 }}>More — coming soon</div>
            {domain.comingSoon.map(name => (
              <div key={name} className="card" style={{ opacity: 0.4, cursor: 'default', pointerEvents: 'none' }}>
                <div className="card-body">
                  <div className="card-name">{name}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ── Interest Screen (Topic) ───────────────────────────────────────────────
// New flow: prose intro → venue cards → figures (if any)
function TopicScreen({ topicId, push, savedItems = {} }) {
  const topic = topics[topicId]
  const topicVenues = (topic.venueIds || []).map(id => venues[id]).filter(Boolean)
  const topicFigures = (topic.figureIds || []).map(id => figures[id]).filter(Boolean)
  const descParagraphs = (topic.description || topic.primer || '').split('\n\n')
  const isTheaterTopic = topic.domainId === 'theater'
  // Theater shows split into two tracks — currently running vs historic. Toggle
  // defaults to 'now' so tourists see Wicked / Lion King / Hamilton first
  // instead of having to scroll past forty years of Sondheim revivals.
  const [showFilter, setShowFilter] = React.useState('now')

  // Theater: each work declares its own `topicId` so categories stay exclusive
  // (a show appears under Musicals OR Drama, never both). Previously this query
  // merged by figure AND by venue, which caused In the Heights (Miranda /
  // Public Theater) to show up under both Musicals AND Drama since Public is
  // in Drama's venueIds. Now: single source of truth is work.topicId.
  // Sort: currently-running first, then newest year first within each bucket.
  const theaterShows = isTheaterTopic
    ? Object.values(works)
        .filter(w => w.topicId === topic.id)
        .sort((a, b) => {
          if (!!a.currentlyRunning !== !!b.currentlyRunning) return a.currentlyRunning ? -1 : 1
          return parseInt(b.year) - parseInt(a.year)
        })
    : []

  // For theater topics, dedupe "The theaters" against "Broadway shows":
  // if a theater's current production (nowPlaying.title) is ALREADY shown as
  // a work card above, hide the redundant theater card. Otherwise users see
  // Wicked twice — once as a show, once as the Gershwin Theatre card.
  // Theaters with no show match (Majestic dark, St James / Titanique, Imperial
  // / Chess, Shubert dark) keep showing so users still see them.
  const shownShowTitles = new Set(theaterShows.map(w => (w.title || '').toLowerCase()))
  const theaterTopicVenues = isTheaterTopic
    ? topicVenues.filter(v => {
        const np = v?.nowPlaying
        if (!np || np.isDark || !np.title) return true
        return !shownShowTitles.has(np.title.toLowerCase())
      })
    : topicVenues

  // Figures card list
  const figuresSection = topicFigures.length > 0 && (
    <div className="card-list" style={{ paddingTop: 0 }}>
      {topicFigures.map(figure => (
        <button
          key={figure.id}
          className="figure-card"
          style={{ position: 'relative' }}
          onClick={() => push({ screen: 'figure', figureId: figure.id })}
        >
          <ImgWithFallback
            className="figure-avatar"
            src={figure.imageUrl}
            alt={figure.name}
          />
          <div className="figure-card-text">
            <div className="figure-card-name">{figure.name}</div>
            <div className="figure-card-years">{figure.years}{figure.nationality ? ` · ${figure.nationality}` : ''}</div>
            <div className="figure-card-tagline">{figure.tagline}</div>
          </div>
          <div className="figure-card-arrow">›</div>
        </button>
      ))}
    </div>
  )

  // Venues card list
  const venuesSection = topicVenues.length > 0 && (
    <div style={{ padding: '4px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {topicVenues.map(v => (
        <VenueTapCard
          key={v.id}
          venue={v}
          isSaved={!!savedItems[`venue:${v.id}`]}
          onPress={() => push({ screen: 'venue', venueId: v.id, fromTopicId: topicId })}
        />
      ))}
    </div>
  )

  return (
    <div className="screen">
      <div className="topic-intro">
        {topic.years && <div className="topic-years">{topic.years}</div>}
        <div className="topic-name">{topic.name}</div>
        <div className="topic-description">
          {descParagraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      {isTheaterTopic ? (
        // Theater: shows first, then playwrights, then theaters
        <>
          {theaterShows.length > 0 && (() => {
            // Bucket once so the toggle counts are accurate even when one
            // bucket is empty (Drama topic, for example, only has historic
            // shows so 'now' tab would otherwise render nothing).
            const runningShows = theaterShows.filter(w => w.currentlyRunning)
            const historicShows = theaterShows.filter(w => !w.currentlyRunning)
            const displayedShows = showFilter === 'now' ? runningShows : historicShows
            return (
            <>
              <div className="section" style={{ paddingBottom: 4 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 10,
                }}>
                  <div className="section-label" style={{ margin: 0 }}>Broadway shows</div>
                  {/* Toggle — sits at right. Empty buckets disable the tab so
                      users don't tap into an empty list. */}
                  <div style={{
                    display: 'inline-flex', gap: 2, padding: 2,
                    background: 'var(--gray-100)', borderRadius: 999,
                  }}>
                    {[
                      { id: 'now',      label: 'Broadway',  count: runningShows.length },
                      { id: 'historic', label: 'Historic', count: historicShows.length },
                    ].map(t => {
                      const active   = showFilter === t.id
                      const disabled = t.count === 0
                      return (
                        <button
                          key={t.id}
                          onClick={() => { if (!disabled) setShowFilter(t.id) }}
                          disabled={disabled}
                          style={{
                            padding: '5px 11px', borderRadius: 999,
                            background: active ? 'var(--gray-900)' : 'transparent',
                            color: active ? '#fff' : (disabled ? 'var(--gray-300)' : 'var(--gray-600)'),
                            border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            fontSize: 11, fontWeight: active ? 700 : 600,
                            letterSpacing: '0.02em',
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                          }}
                        >
                          <span>{t.label}</span>
                          <span style={{
                            fontSize: 10, fontWeight: 700,
                            padding: '0 5px', borderRadius: 999,
                            background: active ? 'rgba(255,255,255,0.22)' : 'var(--gray-200)',
                            color: active ? '#fff' : 'var(--gray-500)',
                            minWidth: 14, textAlign: 'center', lineHeight: '14px',
                          }}>{t.count}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
              {/* Empty-bucket fallback — shouldn't fire because buttons are
                  disabled when count is 0, but in case data goes weird. */}
              {displayedShows.length === 0 ? (
                <div style={{
                  margin: '6px 20px 12px', padding: '14px 16px',
                  background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                  borderRadius: 12, fontSize: 13, color: 'var(--gray-500)',
                  textAlign: 'center', lineHeight: 1.5,
                }}>
                  No {showFilter === 'now' ? 'currently-running' : 'historic'} shows on this topic.
                </div>
              ) : (
              /* Matches the VenueTapCard layout used below: colored header
                  with the show title, a status bar (NOW PLAYING / HISTORIC),
                  the show's description, and an Explore CTA. Keeps the visual
                  language consistent across the whole topic page. Header color
                  comes from the venue palette so each show inherits its
                  theater's identity. */
              <div style={{ padding: '4px 20px 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {displayedShows.map(work => {
                  const fig = figures[work.figureId]
                  const venue = venues[work.venueId]
                  const colors = venueColors[work.venueId] || { bg: '#9d174d', text: '#ffffff' }
                  const preview = clipWords(work.description || '', 180)
                  return (
                    <button
                      key={work.id}
                      onClick={() => push({ screen: 'work', workId: work.id })}
                      style={{
                        position: 'relative',
                        width: '100%', textAlign: 'left',
                        background: 'var(--card)',
                        border: '1px solid var(--gray-200)',
                        borderRadius: 12, overflow: 'hidden',
                        cursor: 'pointer', fontFamily: 'inherit',
                        padding: 0,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      }}
                    >
                      {/* Colored header — show title is the hero, with theater
                          and creator credited as a sub-line. */}
                      <div style={{
                        background: colors.bg,
                        color: colors.text,
                        padding: '14px 16px 12px',
                      }}>
                        <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.2, paddingRight: isSaved ? 32 : 0 }}>
                          {work.title}
                        </div>
                        {venue && (
                          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 3 }}>
                            at {venue.name}{fig ? ` · ${fig.name}` : ''}
                          </div>
                        )}
                      </div>
                      {/* Status bar — RUNNING NOW (dark green-accent) or
                          HISTORIC (light grey). Mirrors the venue card's
                          NOW PLAYING / BETWEEN PRODUCTIONS bar. */}
                      {work.currentlyRunning ? (
                        <div style={{
                          background: '#0d1117', color: '#fff',
                          padding: '8px 16px 9px',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            🟢 Running now
                          </span>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
                            since {work.year}
                          </span>
                        </div>
                      ) : (
                        <div style={{
                          background: '#fafafa',
                          borderTop: '1px solid var(--gray-100)',
                          padding: '8px 16px 9px',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-500)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            📜 Historic
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>
                            {work.year}
                          </span>
                        </div>
                      )}
                      {/* Body */}
                      <div style={{ padding: '12px 16px 14px' }}>
                        {preview && (
                          <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.55, marginBottom: 10 }}>
                            {preview}
                          </div>
                        )}
                        <div style={{ fontSize: 12, fontWeight: 700, color: colors.bg }}>Explore →</div>
                      </div>
                    </button>
                  )
                })}
              </div>
              )}
              <div className="divider" style={{ marginTop: 16 }} />
            </>
            )
          })()}
          {topicFigures.length > 0 && (
            <>
              <div className="section" style={{ paddingBottom: 4 }}>
                <div className="section-label">Playwrights & composers</div>
              </div>
              {figuresSection}
              <div className="divider" style={{ marginTop: 8 }} />
            </>
          )}
          {theaterTopicVenues.length > 0 && (
            <>
              <div className="section" style={{ paddingBottom: 4 }}>
                <div className="section-label">More theaters</div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                  Houses whose current show isn't listed above
                </div>
              </div>
              {/* Filtered to avoid duplicating shows that already appear in the
                  Broadway shows section above. */}
              <div style={{ padding: '4px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {theaterTopicVenues.map(v => (
                  <VenueTapCard
                    key={v.id}
                    venue={v}
                    isSaved={!!savedItems[`venue:${v.id}`]}
                    onPress={() => push({ screen: 'venue', venueId: v.id, fromTopicId: topicId })}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        // Default: venues first, figures second
        <>
          {topicVenues.length > 0 && (
            <div style={{ padding: '4px 20px 32px' }}>
              <div className="section-label" style={{ marginBottom: 14 }}>
                Where to experience it in NYC
              </div>
              {venuesSection}
            </div>
          )}
          {topicFigures.length > 0 && (
            <>
              <div className="divider" />
              <div className="section">
                <div className="section-label">Key figures</div>
              </div>
              {figuresSection}
            </>
          )}
        </>
      )}
    </div>
  )
}

// ── Venue Screen ──────────────────────────────────────────────────────────
function VenueScreen({ venueId, fromTopicId, fromDomainId, push, savedItems = {}, toggleSave = () => {}, onViewMap = null, editorialCallout = null }) {
  const venue = venues[venueId]
  const colors = venueColors[venueId] || { bg: '#5d6b7c', text: '#fff' }

  // Runtime hero fallback: venues with no Commons image and no work-at-venue
  // image (mostly restaurants/bars) fetch a Google Places photo by name — the
  // same legal, licensed pipeline the imported places already use. The hook is
  // a no-op (null arg) when a curated image exists.
  const _needsGPhoto = !venueImages[venueId] && venue
  const gHero = useGooglePhoto(_needsGPhoto ? { id: 'venuehero_' + venueId, name: venue.name, neighborhood: venue.neighborhood, address: venue.address, googlePlaceId: 'byname' } : null)

  const fromTopic = fromTopicId ? topics[fromTopicId] : null
  const domainId = fromTopic?.domainId || fromDomainId

  const isVisualArt    = domainId === 'visual_art'
  const isSports       = domainId === 'sports'
  const isPerformance  = domainId === 'jazz' || domainId === 'classical_music'
  const isArchitecture = domainId === 'architecture'
  const isTheater      = domainId === 'theater'
  const isHistory      = domainId === 'history'

  const [justAdded, setJustAdded] = React.useState(false)
  const [storyOpen, setStoryOpen] = React.useState(false)

  // Works at this venue
  const worksHere = getWorksAtVenue(venueId)

  // Visual art: filter by source interest's figureIds
  let filteredWorks = worksHere
  if (isVisualArt && fromTopic?.figureIds?.length) {
    const figSet = new Set(fromTopic.figureIds)
    filteredWorks = worksHere.filter(w => figSet.has(w.figureId))
  }

  // Sports: group figures by sport (topic)
  const sportGroups = []
  if (isSports && worksHere.length > 0) {
    const byTopic = {}
    worksHere.forEach(w => {
      const fig = figures[w.figureId]
      if (!fig) return
      if (!byTopic[fig.topicId]) byTopic[fig.topicId] = new Set()
      byTopic[fig.topicId].add(fig.id)
    })
    Object.entries(byTopic).forEach(([tid, figIds]) => {
      const t = topics[tid]
      if (t) sportGroups.push({ topic: t, figs: [...figIds].map(id => figures[id]).filter(Boolean) })
    })
  }

  // Performance venues: curated figures associated with this room
  const venueFigures = isPerformance && venue.figureIds?.length
    ? venue.figureIds.map(id => figures[id]).filter(Boolean)
    : []

  // Architecture: curated architects associated with this building
  const venueArchitects = isArchitecture && venue.figureIds?.length
    ? venue.figureIds.map(id => figures[id]).filter(Boolean)
    : []

  // Architecture: features (works) at this building
  const archFeatures = isArchitecture ? worksHere : []

  // Theater: productions + playwrights/composers
  const theaterWorks = isTheater ? worksHere : []
  const theaterFigures = isTheater && venue.figureIds?.length
    ? venue.figureIds.map(id => figures[id]).filter(Boolean)
    : []

  // History: events + key figures
  const historyWorks = isHistory ? worksHere : []
  const historyFigures = isHistory && venue.figureIds?.length
    ? venue.figureIds.map(id => figures[id]).filter(Boolean)
    : []

  // Related venues (shared interest, not self)
  const relatedVenues = isPerformance || isVisualArt || isArchitecture || isTheater || isHistory
    ? getRelatedVenues(venueId).slice(0, 3)
    : []

  return (
    <div className="screen">

      {/* ── Full-bleed hero — photo when we have one, over the category-gradient
             base layer (so failed loads degrade to gradient, never black);
             ~45vh of the column, white scrim title, share top-right ── */}
      <div style={{
        position: 'relative',
        height: 'min(45vh, 380px)',
        minHeight: 250,
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}B8 100%)`,
        overflow: 'hidden',
      }}>
        {(() => {
          // Photo priority: curated venue photo → first work-at-this-venue image
          // (covers architecture venues for free) → runtime Google Places photo
          // → none (gradient shows).
          const heroPhoto = venueImages[venueId] || worksHere.find(w => w.imageUrl)?.imageUrl || gHero?.photoUrl || null
          return heroPhoto ? (
            <img
              src={heroPhoto}
              alt={venue.name}
              loading="eager"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ) : null
        })()}
        {/* Soft highlight + bottom scrim for title legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 28% 22%, rgba(255,255,255,0.18), transparent 55%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(20,28,38,0.55) 0%, rgba(20,28,38,0) 55%)',
        }} />
        {/* (Hero share button removed — navigator.share isn't available inside the
            iOS webview, so it silently did nothing. Trip sharing lives in My Trip.) */}
        {/* Title on the scrim */}
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: 42, zIndex: 2, color: '#fff' }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.12, textShadow: '0 2px 12px rgba(20,28,38,0.4)' }}>
            {venue.name}
          </div>
          {venue.fullName && venue.fullName !== venue.name && (
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{venue.fullName}</div>
          )}
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{venue.neighborhood}</div>
        </div>
      </div>

      {/* ── Content sheet — pulled up over the hero, 28px top radius ── */}
      <div style={{
        position: 'relative',
        marginTop: -24,
        background: 'var(--canvas)',
        borderRadius: '28px 28px 0 0',
        paddingTop: 6,
        zIndex: 3,
      }}>
        {/* Heart removed — saving happens via the "+ Add to My Trip" button below. */}
      </div>

      {/* ── Facts row — 3 equal light-gray tiles ── */}
      {(venue.neighborhood || venue.admissionCost || venue.visitDuration) && (
        <div style={{ padding: '14px 20px 0' }}>
          <div className="facts-row">
            <div className="fact-tile">
              <div className="fact-label">Area</div>
              <div className="fact-value">{venue.neighborhood || '—'}</div>
            </div>
            <div className="fact-tile">
              <div className="fact-label">Admission</div>
              <div className="fact-value">{venue.admissionCost || 'See site'}</div>
            </div>
            <div className="fact-tile">
              <div className="fact-label">Time</div>
              <div className="fact-value">{venue.visitDuration || 'Flexible'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Primary CTA, surfaced high so adding to the trip never requires
             scrolling past the full editorial. (The lower CTA group keeps the
             secondary actions: tickets, directions, official site.) ── */}
      <div style={{ padding: '14px 20px 0' }}>
        {(() => {
          const isSaved = !!savedItems[`venue:${venueId}`]
          return (
            <button
              className="venue-btn"
              onClick={() => {
                toggleSave('venue', venueId)
                if (!isSaved) { setJustAdded(true); setTimeout(() => setJustAdded(false), 2000) }
              }}
              style={isSaved ? { background: 'var(--ink)', boxShadow: 'none', opacity: 0.85 } : {}}
            >
              {isSaved ? '✓ Saved to My Trip' : justAdded ? '✓ Added to My Trip!' : '+ Add to My Trip'}
            </button>
          )
        })()}
      </div>

      {/* ── Editorial callout — only when arriving from a Tonight pick. Carries the curation voice through. ── */}
      {editorialCallout && (
        <div style={{
          margin: '16px 20px 4px',
          padding: '14px 16px 14px 16px',
          background: 'var(--gray-50, #fafafa)',
          border: '1px solid var(--gray-200)',
          borderLeft: `3px solid ${colors.bg}`,
          borderRadius: 10,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--gray-500)',
          }}>
            ✨ Why NYC Stoop picked this
          </div>
          <div style={{
            fontSize: 14, lineHeight: 1.55, color: 'var(--gray-800)', fontStyle: 'italic',
          }}>
            {editorialCallout}
          </div>
        </div>
      )}

      {/* ── Playing Now card ── */}
      {venue.nowPlaying && !venue.nowPlaying.isDark && (
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{
            background: 'var(--white)',
            borderRadius: 22,
            padding: '16px 18px',
            boxShadow: '0 6px 18px rgba(29,39,51,0.08)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-text)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Playing now</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 5 }}>{venue.nowPlaying.title}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 14, lineHeight: 1.5 }}>{venue.nowPlaying.tagline}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-3)', flexShrink: 1 }}>{venue.nowPlaying.through}</span>
              <a
                href={venue.nowPlaying.bookingUrl || venue.ticketUrl || venue.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700,
                  padding: '9px 18px', borderRadius: 999, textDecoration: 'none',
                  flexShrink: 0, display: 'inline-block',
                  boxShadow: '0 6px 16px rgba(224,85,44,.35)',
                }}
              >Book tickets →</a>
            </div>
          </div>
        </div>
      )}
      {venue.nowPlaying?.isDark && (
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{
            background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
            borderRadius: 14, padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Currently dark</div>
              <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.45 }}>{venue.nowPlaying.tagline}</div>
            </div>
            <a
              href={venue.nowPlaying.bookingUrl || venue.ticketUrl || venue.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: 'var(--gray-600)', textDecoration: 'underline', flexShrink: 0 }}
            >Schedule →</a>
          </div>
        </div>
      )}


      {/* ── Weekly Schedule ── */}
      {venue.weeklySchedule && venue.weeklySchedule.length > 0 && (() => {
        const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        const todayName = DAY_NAMES[new Date().getDay()]
        // Group entries by day preserving order Sun→Sat starting from today
        const dayOrder = [...Array(7)].map((_, i) => DAY_NAMES[(new Date().getDay() + i) % 7])
        const grouped = {}
        venue.weeklySchedule.forEach(e => {
          if (!grouped[e.day]) grouped[e.day] = []
          grouped[e.day].push(e)
        })
        const days = dayOrder.filter(d => grouped[d]).slice(0, 3)
        // Single-show theater (Hamilton, etc.): every slot is the same production
        // (ignoring "(matinee)" etc.), so the day-by-day grid just repeats the
        // title. Collapse it to the live-schedule link. Multi-lineup venues
        // (jazz clubs) keep the full grid — that's where it shows real value.
        const baseTitles = new Set(venue.weeklySchedule.map(e => (e.performer || '').replace(/\s*\([^)]*\)\s*/g, '').trim().toLowerCase()).filter(Boolean))
        const singleShow = baseTitles.size === 1
        return (
          <div style={{ padding: '14px 16px 0' }}>
            <div style={{
              background: 'var(--gray-50)', borderRadius: 14, padding: '14px 16px',
              border: '1px solid var(--gray-100)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  Upcoming
                </div>
                {venue.weeklySchedule.some(e => !e.isAnchor) && (
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                    Bookings change weekly
                  </div>
                )}
              </div>
              {singleShow ? (
                <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                  Performances most nights — check live times &amp; book below.
                </div>
              ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {days.map(day => (
                  <div key={day}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: day === todayName ? colors.bg : 'var(--gray-700)' }}>{day}</div>
                      {day === todayName && (
                        <div style={{ fontSize: 10, fontWeight: 800, background: colors.bg, color: colors.text, borderRadius: 20, padding: '2px 8px', letterSpacing: '0.05em' }}>
                          TONIGHT
                        </div>
                      )}
                    </div>
                    {grouped[day].every(e => e.performer === 'Featured artist') ? (
                      /* All slots are variable — collapse to a single website link */
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)', minWidth: 58, flexShrink: 0 }}>
                          {grouped[day][0].time}
                        </div>
                        <div style={{ flex: 1 }}>
                          <a
                            href={venue.scheduleUrl || venue.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 13, color: 'var(--gray-500)', textDecoration: 'none' }}
                          >
                            {grouped[day].length > 1
                              ? `Sets ${grouped[day].map(e => e.time).join(' & ')}`
                              : `Doors ${grouped[day][0].time}`
                            }
                            {' · Lineup at '}
                            {(() => { try { return new URL(venue.scheduleUrl || venue.ticketUrl || '').hostname.replace('www.', '') } catch { return 'website' } })()}
                            {' →'}
                          </a>
                        </div>
                      </div>
                    ) : (
                      grouped[day].map((entry, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '4px 0', borderTop: i === 0 ? 'none' : '1px solid var(--gray-100)' }}>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)', minWidth: 58, flexShrink: 0, paddingTop: 1 }}>{entry.time}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: entry.isAnchor ? 700 : 500, color: 'var(--gray-900)' }}>
                              {entry.performer}
                              {entry.isAnchor && <span style={{ color: colors.bg, marginLeft: 6, fontSize: 11 }}>●</span>}
                            </div>
                            {entry.note && <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2, lineHeight: 1.4 }}>{entry.note}</div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
              )}
              <a
                href={venue.scheduleUrl || venue.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  marginTop: 14, padding: '9px 0', borderRadius: 10,
                  background: colors.bg + '18',
                  fontSize: 13, color: colors.bg, fontWeight: 700, textDecoration: 'none',
                  border: `1px solid ${colors.bg}30`,
                }}
              >
                <span>🗓</span>
                <span>See live schedule & tickets</span>
                <span style={{ fontSize: 16, lineHeight: 1 }}>›</span>
              </a>
            </div>
          </div>
        )
      })()}

      {/* ── Character prose — short by default, expandable. Keeps the page
             scannable: the editorial hook (callout) is above; the full essay
             lives one tap away instead of pushing the actions down the page. ── */}
      {venue.character && (() => {
        const isLong = venue.character.length > 280
        return (
          <div className="section" style={{ paddingTop: 22, paddingBottom: 8 }}>
            <div className="lede" style={{
              fontSize: 15, lineHeight: 1.72, color: 'var(--gray-700)',
              ...(isLong && !storyOpen ? { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
            }}>
              {venue.character}
            </div>
            {isLong && (
              <button onClick={() => setStoryOpen(o => !o)} style={{
                marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: 13, fontWeight: 700, color: 'var(--accent-text)', fontFamily: 'inherit',
              }}>{storyOpen ? 'Show less' : 'Read more'}</button>
            )}
          </div>
        )
      })()}

      {/* ── Specialties chips ── */}
      {venue.specialties?.length > 0 && (
        <div style={{ padding: '4px 20px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {venue.specialties.map(s => (
            <span key={s} style={{
              background: colors.bg,
              color: colors.text,
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 20,
              opacity: 0.85,
              letterSpacing: '0.02em',
            }}>{s}</span>
          ))}
        </div>
      )}

      <div className="divider" />

      {/* ── Plan Your Visit — Admission + Time already shown in the top facts
             row, so we don't repeat them here; just Booking + the insider tip. ── */}
      {(venue.bookingNote || venue.insiderTip) && (
        <div className="section" style={{ paddingTop: 20, paddingBottom: 4 }}>
          <div className="section-label">Plan your visit</div>
          <div style={{
            background: 'var(--gray-50)',
            border: '1px solid var(--gray-200)',
            borderRadius: 12,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {venue.bookingNote && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>📅</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Booking</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-800)', marginTop: 2 }}>{venue.bookingNote}</div>
                </div>
              </div>
            )}
            {venue.insiderTip && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', ...(venue.bookingNote ? { borderTop: '1px solid var(--gray-200)', paddingTop: 12, marginTop: 2 } : {}) }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>💡</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Insider tip</div>
                  {/* Split the tip on \n\n so multi-section intent-based tips
                      (Central Park style: "🌅 Lake view? …" / "👨‍👩‍👧 Kids? …")
                      render as spaced paragraphs. Single-paragraph tips just
                      render as one block with no extra spacing. whiteSpace:
                      pre-line also respects any single \n inside a paragraph. */}
                  <div style={{ fontSize: 14, color: 'var(--gray-800)', marginTop: 6, lineHeight: 1.7 }}>
                    {venue.insiderTip.split(/\n\n+/).map((para, i) => (
                      <p key={i} style={{
                        margin: i === 0 ? 0 : '10px 0 0',
                        whiteSpace: 'pre-line',
                      }}>{para.trim()}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CTA buttons ── */}
      <div className="section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* (Primary "Add to My Trip" now lives near the top, under the facts.) */}

          {/* ── Buy tickets (paid venues only; skip if the now-playing card above
                 already shows a "Book tickets" button, to avoid a double CTA) ── */}
          {venue.ticketUrl && !venue.nowPlaying?.bookingUrl && !(venue.admissionCost || '').toLowerCase().startsWith('free') && (
            <a
              href={venue.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-btn"
              style={{ background: 'var(--gray-100)', color: 'var(--gray-800)', border: '1px solid var(--gray-200)' }}
            >
              {isPerformance || isTheater || isSports ? 'Buy tickets →' : 'Buy tickets →'}
            </a>
          )}

          {/* ── See schedule (performance/theater/sports with separate schedule URL) ── */}
          {(isPerformance || isTheater || isSports) && venue.scheduleUrl && venue.scheduleUrl !== venue.ticketUrl && (
            <a
              href={venue.scheduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-btn"
              style={{ background: 'var(--gray-100)', color: 'var(--gray-800)', border: '1px solid var(--gray-200)' }}
            >
              {isPerformance ? 'See upcoming shows →' : isTheater ? "See what's playing →" : 'See schedule →'}
            </a>
          )}

          {/* ── Address ── */}
          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-btn"
          >
            📍 {venue.address}
          </a>

          {/* ── View on in-app map ── */}
          {onViewMap && venueCoords[venueId] && (
            <button
              onClick={onViewMap}
              className="venue-btn"
              style={{ background: 'var(--gray-100)', color: 'var(--gray-800)', border: '1px solid var(--gray-200)' }}
            >
              🗺️ View on Map
            </button>
          )}

          {/* Official-site link removed — it pointed to the same URL as Buy
              tickets / See schedule, so it was a redundant third ticket CTA. */}

        </div>
        {venue.hours && (
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-500)' }}>🕐 {venue.hours}</div>
        )}
      </div>

      {/* ── Sports: what to see in building ── */}
      {isSports && venue.whatToSeeInBuilding?.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section">
            <div className="section-label">What to see in the building</div>
            <div className="look-for-list">
              {venue.whatToSeeInBuilding.map((item, i) => (
                <div key={i} className="look-for-item">
                  <div className="look-for-num">{i + 1}</div>
                  <div className="look-for-text">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Sports: legends by sport ── */}
      {isSports && sportGroups.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          {sportGroups.map(({ topic, figs }) => (
            <div key={topic.id}>
              <div className="section" style={{ paddingBottom: 4 }}>
                <div className="section-label">{topic.name} legends</div>
              </div>
              <div className="card-list" style={{ paddingTop: 0, paddingBottom: 4 }}>
                {figs.map(fig => (
                  <button
                    key={fig.id}
                    className="figure-card"
                    style={{ position: 'relative' }}
                    onClick={() => push({ screen: 'figure', figureId: fig.id })}
                  >
                                        <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                    <div className="figure-card-text">
                      <div className="figure-card-name">{fig.name}</div>
                      <div className="figure-card-years">{fig.years}</div>
                      <div className="figure-card-tagline">{fig.tagline}</div>
                    </div>
                    <div className="figure-card-arrow">›</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── Architecture: key features of the building ── */}
      {isArchitecture && archFeatures.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">What to look for</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
            {archFeatures.map(work => {
              const fig = figures[work.figureId]
              return (
                <button
                  key={work.id}
                  className="card"
                  style={{ position: 'relative' }}
                  onClick={() => push({ screen: 'work', workId: work.id })}
                >
                  <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                  <ImgWithFallback className="card-image" src={work.imageUrl} alt={work.title} />
                  <div className="card-body">
                    <div className="card-name">{work.title}</div>
                    <div className="card-meta">{work.year} · {work.medium}</div>
                    {work.description && (
                      <div className="card-tagline" style={{ marginTop: 4, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.4 }}>
                        {clipWords(work.description, 100)}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ── Architecture: the architects ── */}
      {isArchitecture && venueArchitects.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">
              {venueArchitects.length === 1 ? 'The architect' : 'The architects'}
            </div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, paddingBottom: 8 }}>
            {venueArchitects.map(fig => (
              <button
                key={fig.id}
                className="figure-card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'figure', figureId: fig.id })}
              >
                                <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                <div className="figure-card-text">
                  <div className="figure-card-name">{fig.name}</div>
                  <div className="figure-card-years">{fig.years} · {fig.nationality}</div>
                  <div className="figure-card-tagline">{fig.tagline}</div>
                </div>
                <div className="figure-card-arrow">›</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Theater: notable productions ── */}
      {isTheater && theaterWorks.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">Notable productions</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
            {theaterWorks.map(work => (
              <button
                key={work.id}
                className="card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'work', workId: work.id })}
              >
                <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                <ImgWithFallback className="card-image" src={work.imageUrl} alt={work.title} />
                <div className="card-body">
                  <div className="card-name">{work.title}</div>
                  <div className="card-meta">{work.year} · {work.medium}</div>
                  {work.description && (
                    <div className="card-tagline" style={{ marginTop: 4, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.4 }}>
                      {clipWords(work.description, 100)}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Theater: playwrights & composers ── */}
      {isTheater && theaterFigures.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">Playwrights & composers</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, paddingBottom: 8 }}>
            {theaterFigures.map(fig => (
              <button
                key={fig.id}
                className="figure-card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'figure', figureId: fig.id })}
              >
                                <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                <div className="figure-card-text">
                  <div className="figure-card-name">{fig.name}</div>
                  <div className="figure-card-years">{fig.years}</div>
                  <div className="figure-card-tagline">{fig.tagline}</div>
                </div>
                <div className="figure-card-arrow">›</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── History: what happened here ── */}
      {isHistory && historyWorks.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">What happened here</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
            {historyWorks.map(work => (
              <button
                key={work.id}
                className="card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'work', workId: work.id })}
              >
                <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                <ImgWithFallback className="card-image" src={work.imageUrl} alt={work.title} />
                <div className="card-body">
                  <div className="card-name">{work.title}</div>
                  <div className="card-meta">{work.year}</div>
                  {work.description && (
                    <div className="card-tagline" style={{ marginTop: 4, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.4 }}>
                      {clipWords(work.description, 100)}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── History: key figures ── */}
      {isHistory && historyFigures.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">Key figures</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, paddingBottom: 8 }}>
            {historyFigures.map(fig => (
              <button
                key={fig.id}
                className="figure-card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'figure', figureId: fig.id })}
              >
                                <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                <div className="figure-card-text">
                  <div className="figure-card-name">{fig.name}</div>
                  <div className="figure-card-years">{fig.years}</div>
                  <div className="figure-card-tagline">{fig.tagline}</div>
                </div>
                <div className="figure-card-arrow">›</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Performance venues: notable musicians / composers ── */}
      {isPerformance && venueFigures.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">
              {domainId === 'jazz' ? 'Musicians who\'ve defined this room' : 'Composers performed here'}
            </div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, paddingBottom: 8 }}>
            {venueFigures.map(fig => (
              <button
                key={fig.id}
                className="figure-card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'figure', figureId: fig.id })}
              >
                                <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                <div className="figure-card-text">
                  <div className="figure-card-name">{fig.name}</div>
                  <div className="figure-card-years">{fig.years} · {fig.nationality}</div>
                  <div className="figure-card-tagline">{fig.tagline}</div>
                </div>
                <div className="figure-card-arrow">›</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Visual art: works at this venue in this interest ── */}
      {isVisualArt && filteredWorks.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">
              {fromTopic ? `${fromTopic.name} works here` : 'Works in the collection'}
            </div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
            {filteredWorks.map(work => {
              const fig = figures[work.figureId]
              return (
                <button
                  key={work.id}
                  className="card"
                  style={{ position: 'relative' }}
                  onClick={() => push({ screen: 'work', workId: work.id })}
                >
                  <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                  <ImgWithFallback className="card-image" src={work.imageUrl} alt={work.title} />
                  <div className="card-body">
                    <div className="card-name">{work.title}</div>
                    <div className="card-meta">{fig?.name} · {work.year}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ── Related venues ── */}
      {relatedVenues.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div style={{ padding: '16px 20px 40px' }}>
            <div className="section-label" style={{ marginBottom: 14 }}>
              {domainId === 'jazz' ? 'Other rooms worth knowing' : domainId === 'classical_music' ? 'Other venues for this repertoire' : domainId === 'architecture' ? 'Other buildings in this style' : 'Other venues to consider'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {relatedVenues.map(v => (
                <VenueTapCard
                  key={v.id}
                  venue={v}
                  onPress={() => push({ screen: 'venue', venueId: v.id, fromTopicId, fromDomainId })}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {!relatedVenues.length && <div style={{ height: 40 }} />}
      {/* ── Also nearby (cross-domain) ── */}
      {(() => {
        const domainLabels = {
          visual_art: 'Visual Art', jazz: 'Jazz', classical_music: 'Classical Music',
          sports: 'Sports', architecture: 'Architecture', theater: 'Theater',
          history: 'History', hip_hop: 'Hip-Hop', food: 'Food',
        }
        const nearby = getNearbyAcrossDomains(venueId, 3)
        if (!nearby.length) return null
        return (
          <>
            <div className="divider" style={{ marginTop: 8 }} />
            <div style={{ padding: '16px 20px 40px' }}>
              <div className="section-label" style={{ marginBottom: 14 }}>Also nearby</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {nearby.map(({ id, venue: nv, domain: nd }) => {
                  const nc = venueColors[id] || { bg: '#111', text: '#fff' }
                  return (
                    <button
                      key={id}
                      onClick={() => push({ screen: 'venue', venueId: id, fromDomainId: nd })}
                      style={{
                        width: '100%', background: 'var(--white)', border: '1px solid var(--gray-100)',
                        borderRadius: 12, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                        background: nc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16,
                      }}>
                        {nd === 'jazz' ? '🎷' : nd === 'classical_music' ? '🎻' : nd === 'visual_art' ? '🎨' : nd === 'food' ? '🍴' : nd === 'sports' ? '🏟️' : nd === 'architecture' ? '🏛️' : nd === 'theater' ? '🎭' : nd === 'history' ? '📜' : '🎤'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{nv.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                          {domainLabels[nd]} · {nv.neighborhood}
                        </div>
                      </div>
                      <div style={{ color: 'var(--gray-300)', fontSize: 18 }}>›</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )
      })()}


    </div>
  )
}

// ── Figure Screen ─────────────────────────────────────────────────────────
function FigureScreen({ figureId, push, savedItems = {}, toggleSave = () => {} }) {
  const figure = figures[figureId]
  const figureWorks = (figure.workIds || []).map(id => works[id]).filter(Boolean)
  const primerParagraphs = (figure.primer || figure.description || '').split('\n\n')
  const figureDomain = topics[figure.topicId].domainId
  const isPerformance = ['jazz', 'classical_music'].includes(figureDomain)
  const isSportsFigure = figureDomain === 'sports'
  const isArchFigure = figureDomain === 'architecture'
  const isTheaterFigure = figureDomain === 'theater'
  const isHistoryFigure = figureDomain === 'history'

  const venueGroups = {}
  if (!isPerformance) {
    figureWorks.forEach(w => {
      if (!venueGroups[w.venueId]) venueGroups[w.venueId] = []
      venueGroups[w.venueId].push(w)
    })
  }

  return (
    <div className="screen">
      <div className="figure-hero" style={{ position: 'relative' }}>
        <ImgWithFallback
          className="figure-hero-img"
          src={figure.imageUrl}
          alt={figure.name}
        />
        {/* No save/share — a figure is reading material, not something you go visit. */}
        <div className="figure-hero-text">
          <div className="figure-hero-name">{figure.name}</div>
          <div className="figure-hero-meta">{figure.years}{figure.nationality ? ` · ${figure.nationality}` : ''}</div>
          <div className="figure-hero-tagline">{figure.tagline}</div>
        </div>
      </div>

      <div className="divider" />

      <div className="section">
        <div className="section-label">5-minute primer</div>
        <div className="primer-text">
          {primerParagraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="divider" style={{ marginTop: 28 }} />

      <div className="section">
        <div className="section-label">
          {isPerformance ? 'Hear it in NYC — pick a recording' : isSportsFigure ? 'Career highlights' : isArchFigure ? 'What they built in New York' : isTheaterFigure ? 'Notable productions' : isHistoryFigure ? 'Their story in NYC' : 'See it in NYC — pick a work'}
        </div>
      </div>

      {isPerformance ? (
        <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
          {figureWorks.map(work => (
            <button
              key={work.id}
              className="card"
              style={{ position: 'relative' }}
              onClick={() => push({ screen: 'work', workId: work.id })}
            >
              <SavedDot saved={!!savedItems[`work:${work.id}`]} />
              <ImgWithFallback
                className="card-image"
                src={work.imageUrl}
                alt={work.title}
              />
              <div className="card-body">
                <div className="card-name">{work.title}</div>
                <div className="card-meta">{work.year} · {work.medium}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        Object.entries(venueGroups).map(([venueId, venueWorks]) => {
          const venue = venues[venueId]
          return (
            <div key={venueId} style={{ marginBottom: 4 }}>
              <div style={{ padding: '12px 20px 8px', fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {venue.name}
              </div>
              <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
                {venueWorks.map(work => (
                  <button
                    key={work.id}
                    className="card"
                    style={{ position: 'relative' }}
                    onClick={() => push({ screen: 'work', workId: work.id })}
                  >
                    <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                    <ImgWithFallback
                      className="card-image"
                      src={work.imageUrl}
                      alt={work.title}
                    />
                    <div className="card-body">
                      <div className="card-name">{work.title}</div>
                      <div className="card-meta">{work.year} · {venue.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// ── Work Screen ───────────────────────────────────────────────────────────
function WorkScreen({ workId, push, savedItems = {}, toggleSave = () => {} }) {
  const work = works[workId]
  if (!work) return null
  // Figure can be missing — the new blockbuster musical entries (Wicked, Lion
  // King, Cursed Child, etc.) have empty figureId because Stephen Schwartz /
  // Trey Parker / Elton John aren't in our figures table yet. Everything that
  // touches `figure` and `topic` past this point uses optional access.
  const figure = work.figureId ? figures[work.figureId] : null
  const topicFromFigure = figure ? topics[figure.topicId] : null
  // Derive a domain even when topic is missing: fall back to the venue's
  // domain in venueCoords. Final fallback is 'theater' since that's the only
  // path that currently creates figure-less works.
  const domainId = topicFromFigure?.domainId
    || venueCoords[work.venueId]?.domain
    || 'theater'
  const topic = topicFromFigure
  const nearby = getSeeAlsoNearby(workId)
  const isJazz = domainId === 'jazz' || domainId === 'classical_music'
  const isArchWork = ['architecture', 'theater', 'history'].includes(domainId)

  const venue = !isJazz ? venues[work.venueId] : null

  return (
    <div className="screen">
      <ImgWithFallback
        className="hero-img"
        src={work.imageUrl}
        alt={work.title}
        fallbackColor={venueColors[work.venueId]?.bg}
      />

      <div className="work-header" style={{ position: 'relative' }}>
        {/* (Share button removed app-wide — non-functional inside the iOS webview.) */}
        <div className="work-title-year">{work.year}{figure?.name ? ' · ' + figure.name : ''}</div>
        <h1 className="display">{work.title}</h1>
        {domainId === 'theater' && (
          <div style={{ marginTop: 10 }}>
            {work.currentlyRunning
              ? <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20 }}>🟢 Currently running</span>
              : (
                <>
                  <span style={{ background: '#f3f4f6', color: '#6b7280', fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20 }}>
                    Original run: {work.year} · Historic production
                  </span>
                  {venue?.nowPlaying?.title && (
                    <div style={{
                      background: '#f0fdf4', border: '1px solid #bbf7d0',
                      borderRadius: 12, padding: '13px 16px', marginTop: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }}>Playing now at {venue.name}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.25 }}>{venue.nowPlaying.title}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{venue.nowPlaying.through}</div>
                      </div>
                      <a
                        href={venue.nowPlaying.bookingUrl || venue.ticketUrl || venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 700,
                          padding: '9px 14px', borderRadius: 8, textDecoration: 'none', flexShrink: 0,
                        }}
                      >Book →</a>
                    </div>
                  )}
                  {venue?.nowPlaying?.isDark && (
                    <div style={{
                      background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                      borderRadius: 12, padding: '12px 16px', marginTop: 12,
                    }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }}>At {venue?.name}</div>
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{venue.nowPlaying.tagline}</div>
                      <a href={venue.nowPlaying.bookingUrl || venue.ticketUrl || venue.website} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: '#6b7280', textDecoration: 'underline', display: 'inline-block', marginTop: 6 }}>
                        Check upcoming schedule →
                      </a>
                    </div>
                  )}
                </>
              )
            }
          </div>
        )}
        <div className="work-medium">{[work.medium, work.dimensions].filter(Boolean).join(' · ')}</div>
      </div>

      <div className="section">
        <div className="body-text">
          {work.description}
        </div>
      </div>

      <div className="divider" style={{ marginTop: 24 }} />

      {isArchWork && work.significance ? (
        <div className="section">
          <div className="section-label">Why it matters</div>
          <div className="body-text">{work.significance}</div>
        </div>
      ) : work.whatToLookFor?.length > 0 ? (
        <div className="section">
          <div className="section-label">{isJazz ? 'What to listen for' : 'What to look for'}</div>
          <div className="look-for-list">
            {work.whatToLookFor.map((item, i) => (
              <div key={i} className="look-for-item">
                <div className="look-for-num">{i + 1}</div>
                <div className="look-for-text">{item}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="divider" style={{ marginTop: 24 }} />

      {!isJazz && venue && (
        <div className="section">
          <div className="section-label">{domainId === 'architecture' ? 'The building' : domainId === 'theater' ? 'The theater' : domainId === 'history' ? 'The site' : 'Where to see it'}</div>
          <VenueCard venue={venue} />
        </div>
      )}

      {/* See Also */}
      <div className="see-also-block">
        <div className="see-also-title">{isJazz ? 'More in this tradition' : 'See also nearby'}</div>

        {nearby.otherByFigure.length > 0 && figure && (
          <div className="see-also-group">
            <div className="see-also-group-label">More {figure.name} in NYC</div>
            <div className="card-row">
              {nearby.otherByFigure.map(w => (
                <button
                  key={w.id}
                  className="card-small"
                  style={{ position: 'relative' }}
                  onClick={() => push({ screen: 'work', workId: w.id })}
                >
                  <SavedDot saved={!!savedItems[`work:${w.id}`]} style={{ top: 6, right: 6, width: 18, height: 18, fontSize: 10 }} />
                  <ImgWithFallback className="card-small-img" src={w.imageUrl} alt={w.title} />
                  <div className="card-small-body">
                    <div className="card-small-name">{w.title}</div>
                    <div className="card-small-meta">{isJazz ? w.year : (venues[w.venueId]?.name + ' · ' + w.year)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {isJazz && topic && nearby.otherInTopic && nearby.otherInTopic.length > 0 && (
          <div className="see-also-group">
            <div className="see-also-group-label">
              Other {topic.name} {domainId === 'jazz' ? 'albums' : 'works'}
            </div>
            <div className="card-row">
              {nearby.otherInTopic.slice(0, 4).map(w => {
                const wFig = figures[w.figureId]
                return (
                  <button
                    key={w.id}
                    className="card-small"
                    style={{ position: 'relative' }}
                    onClick={() => push({ screen: 'work', workId: w.id })}
                  >
                    <SavedDot saved={!!savedItems[`work:${w.id}`]} style={{ top: 6, right: 6, width: 18, height: 18, fontSize: 10 }} />
                    <ImgWithFallback className="card-small-img" src={w.imageUrl} alt={w.title} />
                    <div className="card-small-body">
                      <div className="card-small-name">{w.title}</div>
                      <div className="card-small-meta">{wFig?.name ? wFig.name + ' · ' : ''}{w.year}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {!isJazz && nearby.otherAtVenue.length > 0 && venue && (
          <div className="see-also-group">
            <div className="see-also-group-label">Also at {venue.name}</div>
            <div className="card-row">
              {nearby.otherAtVenue.slice(0, 4).map(w => {
                const wFig = figures[w.figureId]
                return (
                  <button
                    key={w.id}
                    className="card-small"
                    style={{ position: 'relative' }}
                    onClick={() => push({ screen: 'work', workId: w.id })}
                  >
                    <SavedDot saved={!!savedItems[`work:${w.id}`]} style={{ top: 6, right: 6, width: 18, height: 18, fontSize: 10 }} />
                    <ImgWithFallback className="card-small-img" src={w.imageUrl} alt={w.title} />
                    <div className="card-small-body">
                      <div className="card-small-name">{w.title}</div>
                      <div className="card-small-meta">{wFig?.name ? wFig.name + ' · ' : ''}{w.year}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {nearby.otherFigures.length > 0 && topic && (
          <div className="see-also-group">
            <div className="see-also-group-label">
              Other {topic.name} {domainId === 'jazz' ? 'musicians' : domainId === 'classical_music' ? 'composers' : 'athletes'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {nearby.otherFigures.slice(0, 3).map(fig => (
                <button
                  key={fig.id}
                  className="figure-card"
                  style={{ background: 'var(--white)', position: 'relative' }}
                  onClick={() => push({ screen: 'figure', figureId: fig.id })}
                >
                                    <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                  <div className="figure-card-text">
                    <div className="figure-card-name">{fig.name}</div>
                    <div className="figure-card-years">{fig.years}</div>
                    <div className="figure-card-tagline">{fig.tagline}</div>
                  </div>
                  <div className="figure-card-arrow">›</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


// ── Venue Group Screen — buildings within a geographic cluster ────────────
function VenueGroupScreen({ domainId, groupIndex, push, savedItems = {} }) {
  const domain = domains[domainId]
  const group = domain.venueGroups?.[groupIndex]
  if (!group) return null
  const groupVenues = (group.venueIds || []).map(id => venues[id]).filter(Boolean)

  return (
    <div className="screen">
      <div className="section">
        <p className="meta">📍 {domain.name}</p>
        <h1 className="display" style={{ marginTop: 8 }}>{group.name || group.label}</h1>
        {(group.description || group.note) && (
          <p style={{ marginTop: 8, fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.5 }}>
            {group.description || group.note}
          </p>
        )}
      </div>
      <div style={{ padding: '4px 20px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {groupVenues.map(v => (
          <VenueTapCard
            key={v.id}
            venue={v}
            isSaved={!!savedItems[`venue:${v.id}`]}
            onPress={() => push({ screen: 'venue', venueId: v.id, fromDomainId: domainId })}
          />
        ))}
      </div>
    </div>
  )
}

// ── NeighborhoodScreen — all venues in a single area ──────────────────────
// ── Mood Screen — vibe-based curation (Just Chilling, Date Night, etc.) ───
// Renders a header card with the mood's editorial blurb, then a list of picks.
// Each pick can be a venue (full editorial card via VenueTapCard) or a sight
// (lighter card pointing to SightScreen). Tap any card to drill in.
// ── Eat Screen — restaurant browser with cuisine / price / neighborhood filters ──
// Different from MoodScreen: filterable UI, not pre-grouped lists. Designed for
// the most common dining decision flow: "I want X cuisine, in Y area, at Z price."
// Thumbnail for an Eat result card. Editorial venues use their Wikimedia photo;
// imports resolve a live Google Places photo (key present), everything else falls
// back to a cuisine-colored tile with the emoji. Same lazy-photo pattern as
// UserVenueCard, so the list stays light (only visible cards fetch).
function EatCardThumb({ r, emoji }) {
  const editorialImg = r.kind === 'editorial' ? (venueImages[r.venueId] || null) : null
  const g = useGooglePhoto(editorialImg
    ? { id: r.id, image: editorialImg }
    : { id: r.id, name: r.name, googlePlaceId: r.googlePlaceId, address: r.address, neighborhood: r.neighborhood, source: r.googlePlaceId ? 'google' : '' })
  const [failed, setFailed] = React.useState(false)
  const img = !failed ? (editorialImg || g?.photoUrl) : null
  const tint = venueColors[r.venueId || r.id]?.bg || '#c2603f'
  return (
    <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: `linear-gradient(135deg, ${tint}, ${tint}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {img
        ? <img src={img} alt="" loading="lazy" onError={() => setFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <span style={{ fontSize: 24 }} aria-hidden="true">{emoji}</span>}
    </div>
  )
}

function EatScreen({ push, savedItems = {}, userVenues = {}, toggleSave = () => {}, onAddToTrip = () => null, initialLoc = null }) {
  // ── Unified restaurant dataset ──────────────────────────────────────────────
  // Three sources, normalized to one shape: editorial venues (rich detail pages),
  // the curated RESTAURANT_DATA, and the enriched food imports. Deduped by brand
  // name; fast food excluded. This is what makes "Where to eat" broad instead of
  // showing only the ~19 editorial restaurants.
  const CUISINE_NORM = {
    italian: 'Italian', pizza: 'Pizza', japanese: 'Japanese', sushi: 'Sushi', ramen: 'Ramen',
    korean: 'Korean', mexican: 'Mexican', french: 'French', steakhouse: 'Steakhouse',
    bakery: 'Bakery', bar_tavern: 'Bar', bar: 'Bar', american: 'American', cafe: 'Café',
    coffee: 'Café', dessert: 'Dessert', chinese: 'Chinese', thai: 'Thai', vietnamese: 'Vietnamese',
    seafood: 'Seafood', indian: 'Indian', burger: 'Burgers', deli: 'Deli', brunch: 'Brunch',
    caribbean: 'Caribbean', spanish: 'Spanish', mediterranean: 'Mediterranean', soul_food: 'Soul Food',
    cajun: 'Cajun', greek: 'Greek', spanish_restaurant: 'Spanish',
  }
  const normCuisine = (tok) => {
    if (!tok) return null
    const t = String(tok).toLowerCase().trim()
    if (CUISINE_NORM[t]) return CUISINE_NORM[t]
    for (const k in CUISINE_NORM) { if (t.includes(k)) return CUISINE_NORM[k] }
    return String(tok).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }
  const parsePrice = (p) => {
    if (typeof p === 'number') return p
    if (!p) return null
    const m = (String(p).match(/\$/g) || []).length
    return m || null
  }
  const allRestaurants = React.useMemo(() => {
    const out = []; const seen = new Set()
    const add = (o) => { const k = recoBaseName(o.name); if (!k || seen.has(k)) return; seen.add(k); out.push(o) }
    // 1) editorial (rich detail page)
    Object.values(venues).filter(v => v.isRestaurant).forEach(v => {
      const c = venueCoords[v.id]
      const lbl = normCuisine(v.cuisine)
      add({
        id: v.id, kind: 'editorial', venueId: v.id, name: v.name, neighborhood: v.neighborhood,
        cuisine: lbl || v.cuisine || 'Restaurant', cuisineLabels: lbl ? [lbl] : [],
        price: typeof v.price === 'number' ? v.price : parsePrice(v.price),
        rating: v.rating ?? null, lat: c?.lat, lng: c?.lng,
        mustOrder: v.mustOrder, bookingDifficulty: v.bookingDifficulty,
        vibe: v.vibe, meals: v.meals, dietary: v.dietary,
      })
    })
    // 2) curated RESTAURANT_DATA
    RESTAURANT_DATA.forEach(r => {
      if (isFastFood(r.name)) return
      const c = RESTAURANT_COORDS[r.id]
      const labels = (r.cuisines || []).map(normCuisine).filter(Boolean)
      add({
        id: 'rd_' + r.id, kind: 'curated', name: r.name, neighborhood: r.neighborhood || r.area || '',
        cuisine: labels[0] || 'Restaurant', cuisineLabels: labels, price: parsePrice(r.price),
        rating: r.rating ?? null, lat: c?.[0], lng: c?.[1],
        reservationUrl: r.reservationUrl, mapsUrl: r.mapsUrl, mustOrder: r.mustOrder,
        bookingDifficulty: r.walkIn ? 'walk-in' : (r.reservationUrl ? 'hard' : undefined),
      })
    })
    // 3) enriched food imports
    seedUserPlaces.forEach(p => {
      if (p.category !== 'food' || isFastFood(p.name) || typeof p.lat !== 'number') return
      const labels = (Array.isArray(p.cuisine) ? p.cuisine : (p.cuisine ? [p.cuisine] : [])).map(normCuisine).filter(Boolean)
      add({
        id: 'imp_' + p.id, kind: 'import', name: p.name, neighborhood: p.neighborhood || '',
        cuisine: labels[0] || 'Restaurant', cuisineLabels: labels, price: parsePrice(p.price),
        rating: p.rating ?? null, lat: p.lat, lng: p.lng, address: p.address, hours: p.hours,
        website: p.website, description: p.description || p.googleSummary || '',
        sourceUrl: p.sourceUrl || p.mapsUrl || '', googlePlaceId: p.googlePlaceId, area: p.area || '',
      })
    })
    // Editorial picks lead (hand-curated marquee), then everything by Google rating.
    out.sort((a, b) => (b.kind === 'editorial' ? 1 : 0) - (a.kind === 'editorial' ? 1 : 0) || (b.rating || 0) - (a.rating || 0))
    return out
  }, [])

  // Multi-select filter state. Each set holds the active value(s). Empty set = "All".
  const [cuisines, setCuisines]         = React.useState(new Set())
  const [prices, setPrices]             = React.useState(new Set())
  const [neighborhoods, setNeighborhoods] = React.useState(new Set())
  const [vibes, setVibes]               = React.useState(new Set())
  const [meals, setMeals]               = React.useState(new Set())
  const [dietary, setDietary]           = React.useState(new Set())
  // Map-based area filter (reuses the same MOOD_MAP_AREAS_GEO regions used by
  // MoodScreen). One borough at a time; selectedArea drives a hard filter on
  // results. Independent of the chip-based `neighborhoods` filter so a user
  // can combine them (e.g., West Village + Italian + $$).
  const [mapBorough, setMapBorough]   = React.useState('manhattan')
  const [mapArea, setMapArea]         = React.useState(null)
  // "Near me" — geolocated area filter, independent of the chip filters.
  const [nearArea, setNearArea]       = React.useState(null)   // {borough, areaId, label} | null
  const [geoStatus, setGeoStatus]     = React.useState('idle') // idle | locating | denied
  // Default sort is context-aware: "Nearest" is a gift when the user is
  // STANDING IN NYC ("what's good right here"), but nonsense when they're
  // planning from home/abroad — every restaurant is equally far, so the order
  // is arbitrary. Outside the city (or with no location), lead with the
  // curation: Recommended.
  const _inNYC = (loc) => !!loc && loc.lat > 40.49 && loc.lat < 40.95 && loc.lng > -74.27 && loc.lng < -73.65
  const [sortBy, setSortBy]           = React.useState(_inNYC(initialLoc) ? 'near' : 'reco')  // reco | rating | near
  const [userLoc, setUserLoc]         = React.useState(initialLoc || null)    // {lat,lng} — powers "Nearest" sort
  // Location may arrive AFTER the screen mounts (the on-open prompt resolves late).
  // When it does, adopt it — and switch to nearest only if it's an NYC location
  // and the user hasn't already chosen a sort.
  const _eatLocApplied = React.useRef(!!initialLoc)
  React.useEffect(() => {
    if (initialLoc && !_eatLocApplied.current) {
      _eatLocApplied.current = true
      setUserLoc(initialLoc)
      if (_inNYC(initialLoc)) setSortBy(s => (s === 'reco' ? 'near' : s))
    }
  }, [initialLoc])
  const [openNow, setOpenNow]         = React.useState(false)   // hide places known to be closed right now
  const [whereBorough, setWhereBorough] = React.useState('all') // 'all' | 'manhattan' | 'brooklyn' — drives the area chooser
  // Reset area when flipping boroughs — selecting "Harlem" while viewing
  // Brooklyn would be invisible.
  React.useEffect(() => { setMapArea(null) }, [mapBorough])

  // ── Cuisine taxonomy — data-derived, ordered by how many restaurants have each.
  // With ~300 restaurants a flat pill row would be a wall, so we show the top N
  // and tuck the long tail behind a "More" expander.
  const cuisineCounts = React.useMemo(() => {
    const c = {}
    allRestaurants.forEach(r => (r.cuisineLabels || []).forEach(l => { c[l] = (c[l] || 0) + 1 }))
    return c
  }, [allRestaurants])
  // Curated, dinner-first cuisine order. The data is tagged by CUISINE (not dish),
  // and a raw count-sort would lead with Bakery/Bar/Café — categories, not the
  // cuisines people expect — burying Mexican/Vietnamese/Indian. So we hand-order
  // the cuisines users actually filter dinner by; everything else (Café, Bakery,
  // Bar, Dessert, Steakhouse, Burgers…) stays reachable under "+ More", sorted by
  // count. (Cravings like ramen/tacos are best found via Search, not a pill.)
  const CUISINE_ORDER = ['American', 'Bagel', 'Italian', 'Japanese', 'Korean', 'Thai', 'Chinese', 'Mexican', 'Vietnamese', 'French', 'Indian', 'Pizza', 'Seafood']
  const { ALL_CUISINES, TOP_CUISINES_N } = React.useMemo(() => {
    const present = new Set(Object.keys(cuisineCounts))
    const lead = CUISINE_ORDER.filter(c => present.has(c))
    const leadSet = new Set(lead)
    const rest = Object.keys(cuisineCounts)
      .filter(c => !leadSet.has(c))
      .sort((a, b) => cuisineCounts[b] - cuisineCounts[a] || a.localeCompare(b))
    return { ALL_CUISINES: [...lead, ...rest], TOP_CUISINES_N: lead.length }
  }, [cuisineCounts])
  const [cuisinesExpanded, setCuisinesExpanded] = React.useState(false)
  const ALL_PRICES = [1, 2, 3, 4]
  const ALL_VIBES = ['date_night', 'casual', 'iconic', 'splurge', 'quick', 'late_night', 'family_friendly', 'hidden_gem']
  const ALL_MEALS = ['breakfast', 'brunch', 'lunch', 'dinner', 'late_night']
  // Dietary tags mean "good options exist", not a dedicated kitchen.
  const ALL_DIETARY = ['vegetarian', 'vegan', 'gluten_free']

  // Per-restaurant area classification (cached). Lets the map count its badges
  // and the filter pipeline gate on the selected area without redoing lat/lng
  // math per render.
  const restaurantArea = React.useMemo(() => {
    const m = new Map()
    allRestaurants.forEach(r => {
      m.set(r.id, typeof r.lat === 'number' ? classifyLatLngToArea(r.lat, r.lng) : null)
    })
    return m
  }, [allRestaurants])

  // Count restaurants per area for the map's badge numbers — built off the
  // chip-filtered set (NOT mapArea-filtered) so badges reflect "what's available
  // at this combination of cuisine/price/etc." even as the user toggles areas.
  const restaurantCountsByArea = React.useMemo(() => {
    const acc = { manhattan: {}, brooklyn: {} }
    allRestaurants.forEach(r => {
      if (cuisines.size > 0 && !(r.cuisineLabels || []).some(c => cuisines.has(c))) return
      if (prices.size > 0 && !prices.has(r.price)) return
      if (vibes.size > 0 && !(r.vibe || []).some(v => vibes.has(v))) return
      if (meals.size > 0 && !(r.meals || []).some(m => meals.has(m))) return
      if (dietary.size > 0 && !(r.dietary || []).some(d => dietary.has(d))) return
      const a = restaurantArea.get(r.id)
      if (!a) return
      acc[a.borough][a.areaId] = (acc[a.borough][a.areaId] || 0) + 1
    })
    return acc
  }, [allRestaurants, restaurantArea, cuisines, prices, neighborhoods, vibes, meals, dietary])

  // Walk-in shortcut state. Declared up here because chipFiltered references
  // it; moving the declaration below would put it in the temporal dead zone
  // and React would render nothing. There's no chip row for booking-difficulty
  // so this isn't duplicating an existing filter — it's a unique scan helper.
  const [walkInOnly, setWalkInOnly] = React.useState(false)

  // Restaurants matching the chip filters but NOT the map-area filter. This
  // intermediate set powers both the reference map (so users see all options
  // and where the dimmed ones sit) and the final result list (which adds the
  // map-area filter on top).
  const chipFiltered = React.useMemo(() => {
    return allRestaurants.filter(r => {
      if (cuisines.size > 0 && !(r.cuisineLabels || []).some(c => cuisines.has(c))) return false
      if (prices.size > 0 && !prices.has(r.price)) return false
      if (vibes.size > 0 && !(r.vibe || []).some(v => vibes.has(v))) return false
      if (meals.size > 0 && !(r.meals || []).some(m => meals.has(m))) return false
      if (dietary.size > 0 && !(r.dietary || []).some(d => dietary.has(d))) return false
      if (walkInOnly && !['walk-in', 'easy'].includes(r.bookingDifficulty)) return false
      // "Open now" hides only places we KNOW are closed (have hours that say so);
      // places without hours stay, since absence isn't evidence of being closed.
      if (openNow && openStatusNow(r.hours).state === 'closed') return false
      return true
    })
  }, [allRestaurants, cuisines, prices, vibes, meals, dietary, walkInOnly, openNow])

  // Final result set adds the "Near me" area filter on top of the chip filters.
  const filtered = React.useMemo(() => {
    if (!nearArea) return chipFiltered
    return chipFiltered.filter(r => {
      const a = restaurantArea.get(r.id)
      if (!a || a.borough !== nearArea.borough) return false
      // areaId null = whole borough (e.g. "All Manhattan"); else a single area.
      return nearArea.areaId ? a.areaId === nearArea.areaId : true
    })
  }, [chipFiltered, nearArea, restaurantArea])
  // Sort the filtered set. "Recommended" keeps the curated base order (editorial
  // first, then rating); "Top rated" floats the highest Google ratings; "Nearest"
  // orders by real distance from the user (places without coords sink to the end).
  const sortedFiltered = React.useMemo(() => {
    const arr = [...filtered]
    if (sortBy === 'rating') {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0)
        || ((b.kind === 'editorial' ? 1 : 0) - (a.kind === 'editorial' ? 1 : 0)))
    } else if (sortBy === 'near' && userLoc) {
      const dist = (r) => typeof r.lat === 'number' ? distanceMiles(userLoc, r) : Infinity
      arr.sort((a, b) => dist(a) - dist(b))
    }
    return arr
  }, [filtered, sortBy, userLoc])

  // Choosing "Nearest" lazily asks for location if we don't have it yet.
  const handleSort = async (key) => {
    if (key === 'near' && !userLoc) {
      if (geoStatus === 'locating') return
      setGeoStatus('locating')
      try { const { lat, lng } = await getUserLocation(); setUserLoc({ lat, lng }); setGeoStatus('idle') }
      catch (e) { setGeoStatus('denied'); return }
    }
    setSortBy(key)
  }

  // "Near me" — browser geolocation → our area. Outside coverage clears the
  // filter with a note; denial disables the chip.
  const handleNearMeEat = async () => {
    if (geoStatus === 'denied' || geoStatus === 'locating') return
    setGeoStatus('locating')
    try {
      const { lat, lng } = await getUserLocation()
      setUserLoc({ lat, lng })
      const w = classifyLatLngToArea(lat, lng)
      setGeoStatus('idle')
      if (w) { const lbl = (MOOD_MAP_AREAS[w.borough] || []).find(a => a.id === w.areaId)?.label || w.areaId; setNearArea({ borough: w.borough, areaId: w.areaId, label: lbl }); setWhereBorough(w.borough) }
      else { setNearArea(null); setWhereBorough('all'); alert("You're outside Manhattan & Brooklyn — showing all areas.") }
    } catch (e) { setGeoStatus('denied') }
  }

  // Reference-map pins (colored by area) — built from chip-filtered set so the
  // map keeps showing alternatives even after a map area is selected.
  const restaurantPins = React.useMemo(() => {
    const out = []
    chipFiltered.forEach(r => {
      const a = restaurantArea.get(r.id)
      if (!a || a.borough !== mapBorough) return
      if (typeof r.lat !== 'number') return
      out.push({
        id: r.id,
        lat: r.lat, lng: r.lng,
        name: r.name,
        areaId: a.areaId,
        color: colorForArea(mapBorough, a.areaId),
      })
    })
    return out
  }, [chipFiltered, restaurantArea, mapBorough])

  // Toggle a value in a Set state (returns a NEW Set so React re-renders).
  function toggleIn(setter, value) {
    setter(prev => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value); else next.add(value)
      return next
    })
  }

  function clearAll() {
    setCuisines(new Set())
    setPrices(new Set())
    setNeighborhoods(new Set())
    setVibes(new Set())
    setMeals(new Set())
    setDietary(new Set())
    setMapArea(null)
    setWalkInOnly(false)
    setOpenNow(false)
  }

  const activeFilterCount = cuisines.size + prices.size + neighborhoods.size + vibes.size + meals.size + dietary.size + (nearArea ? 1 : 0) + (walkInOnly ? 1 : 0) + (openNow ? 1 : 0)

  // Cuisine emoji map — purely cosmetic on the cuisine pills.
  // Keep these in sync with ALL_CUISINES above. Unknown cuisines fall back to 🍽.
  const CUISINE_EMOJI = {
    Italian: '🍝', Pizza: '🍕', Sushi: '🍣', Ramen: '🍜',
    Korean: '🥢', Mexican: '🌮', French: '🥖', Steakhouse: '🥩',
    Bakery: '🍪', Bar: '🍷', Brunch: '🍳', Deli: '🥪',
    Japanese: '🍱', American: '🍔', 'Café': '☕', Chinese: '🥡',
    Thai: '🍲', Vietnamese: '🍜', Seafood: '🦞', Indian: '🍛',
    Burgers: '🍔', Dessert: '🍰', Caribbean: '🏝', 'Soul Food': '🍗', Bagel: '🥯',
    Cajun: '🦐', Greek: '🥙', Mediterranean: '🫒', Spanish: '🥘',
  }
  function fmtCuisine(c)    { return `${CUISINE_EMOJI[c] || '🍽'} ${c}` }
  function fmtPrice(p)      { return '$'.repeat(p) }
  // Quantified price bands (approx per person) so users see ranges, not just $ symbols.
  function priceRange(p)    { return { 1: '$10–20', 2: '$20–40', 3: '$40–80', 4: '$80+' }[p] || '' }
  // Build a MoodPlaceSheet `place` from a unified restaurant row, so non-editorial
  // restaurants open an in-app sheet (photo, hours / open-now, website, Add to My
  // Trip) instead of being kicked out to Google Maps.
  const placeFromRestaurant = (r) => {
    const cuisines = (r.cuisineLabels && r.cuisineLabels.length) ? r.cuisineLabels : (r.cuisine ? [r.cuisine] : [])
    const website = r.website || r.reservationUrl || ''
    const sourceUrl = r.sourceUrl || r.mapsUrl || ''
    return {
      id: r.id, googlePlaceId: r.googlePlaceId, category: 'food', name: r.name,
      neighborhood: r.neighborhood || '', area: r.area || '',
      price: r.price ? priceRange(r.price) : '', cuisines, rating: r.rating,
      address: r.address || '', hours: r.hours || '',
      description: r.description || '', website, sourceUrl,
      addData: {
        name: r.name, category: 'food', neighborhood: r.neighborhood || r.area || '',
        blurb: r.description || '', price: r.price, cuisines, rating: r.rating,
        website, sourceUrl, lat: r.lat, lng: r.lng,
      },
    }
  }
  function fmtVibe(v)       { return v.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }
  function fmtMeal(m)       { return m.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }
  function fmtDietary(d)    {
    return { vegetarian: 'Vegetarian-friendly', vegan: 'Vegan options', gluten_free: 'Gluten-free options' }[d] || d
  }
  function fmtBooking(b) {
    const map = {
      'walk-in':    { label: 'Walk-in OK', color: '#15803d' },
      'easy':       { label: 'Easy book',  color: '#15803d' },
      'hard':       { label: 'Book ahead', color: '#a16207' },
      'impossible': { label: 'Notoriously hard', color: '#dc2626' },
    }
    return map[b] || { label: b, color: '#666' }
  }

  // ── Pill component — small reusable filter chip ──
  function Pill({ active, onClick, children, style = {} }) {
    return (
      <button onClick={onClick} style={{
        flexShrink: 0, padding: '6px 12px', borderRadius: 999,
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        fontSize: 12, fontWeight: active ? 700 : 500,
        background: active ? 'var(--gray-900)' : 'var(--gray-100)',
        color: active ? '#fff' : 'var(--gray-600)',
        ...style,
      }}>{children}</button>
    )
  }


  // Filter drawer state — moved off-screen by default so users see results
  // first. They tap "Filters" when they're ready to narrow.
  const [filtersExpanded, setFiltersExpanded] = React.useState(false)
  const [moreFiltersOpen, setMoreFiltersOpen] = React.useState(false)
  // Map starts collapsed.
  const [mapExpanded, setMapExpanded] = React.useState(false)
  // Default to a short list when no filters are active — 19 stacked cards
  // is overwhelming. Filters narrow naturally, so we show everything when
  // the user has expressed any intent. Reset when filter state changes.
  const [showAllResults, setShowAllResults] = React.useState(false)
  const [eatSheet, setEatSheet] = React.useState(null)   // non-editorial restaurant detail sheet
  React.useEffect(() => { setShowAllResults(false) }, [cuisines, prices, neighborhoods, vibes, meals, dietary, nearArea, walkInOnly, openNow, sortBy])

  return (
    <div className="screen">
      {/* Hero — matches the MoodScreen / TopicScreen pattern (full colored
          block with emoji-label, big title, blurb, stat row). Avoids
          duplicating the "Where to eat" already shown in the top nav by
          leading with an editorial headline instead. */}
      {/* Hero — shared FlowHero (hand-drawn scene + scrim + serif). Counts
          removed: inventory numbers, not invitation. */}
      <FlowHero
        art={<ActivityCoverArt activityId="eat" />}
        eyebrow="Eat"
        title="Where to eat in New York."
        body="Every restaurant in your guide — filter by cuisine, price, and neighborhood."
      />

      {/* "Where are you?" — a location-first entry that mirrors the place step of
          the sibling mood cards, but stays skippable: "All NYC" is the default, so
          the full city is in view unless the user narrows. Sets nearArea, which
          also drives the existing map + result filtering. */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-100)', padding: '12px 0 10px' }}>
        <div style={{ padding: '0 20px 8px', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em', color: 'var(--gray-700)' }}>Where are you?</div>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 20px 2px' }}>
          <Pill active={!nearArea} onClick={() => { setNearArea(null); setWhereBorough('all') }}>🗽 All NYC</Pill>
          <Pill active={whereBorough === 'manhattan'} onClick={() => { setWhereBorough('manhattan'); setNearArea({ borough: 'manhattan', areaId: null, label: 'Manhattan' }) }}>Manhattan</Pill>
          <Pill active={whereBorough === 'brooklyn'} onClick={() => { setWhereBorough('brooklyn'); setNearArea({ borough: 'brooklyn', areaId: null, label: 'Brooklyn' }) }}>Brooklyn</Pill>
          <Pill active={false} onClick={handleNearMeEat} style={geoStatus === 'denied' ? { opacity: 0.5 } : {}}>📍 {geoStatus === 'locating' ? 'Locating…' : geoStatus === 'denied' ? 'Location off' : 'Near me'}</Pill>
        </div>
        {whereBorough !== 'all' && (
          <div className="hide-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '8px 20px 2px' }}>
            <Pill active={!!nearArea && !nearArea.areaId} onClick={() => setNearArea({ borough: whereBorough, areaId: null, label: whereBorough === 'manhattan' ? 'Manhattan' : 'Brooklyn' })}>All {whereBorough === 'manhattan' ? 'Manhattan' : 'Brooklyn'}</Pill>
            {(MOOD_MAP_AREAS[whereBorough] || []).map(a => (
              <Pill key={a.id} active={!!nearArea && nearArea.areaId === a.id} onClick={() => setNearArea({ borough: whereBorough, areaId: a.id, label: a.label })}>{a.label}</Pill>
            ))}
          </div>
        )}
      </div>

      {/* Filter drawer toggle — single visible button by default.
          Tapping expands the map + chip filter rows in one block. Lets the
          user see results first; filters when they're ready. */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-100)' }}>
        <button
          onClick={() => setFiltersExpanded(o => !o)}
          style={{
            width: '100%', background: 'none', border: 'none',
            padding: '10px 20px', cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'inherit',
          }}
        >
          <span style={{ fontSize: 14 }}>🔧</span>
          <span style={{
            fontSize: 12, fontWeight: 700, color: 'var(--gray-700)', letterSpacing: '0.04em',
          }}>
            {filtersExpanded ? 'Hide filters' : 'Filters'}
          </span>
          {activeFilterCount > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 800,
              background: 'var(--gray-900)', color: '#fff',
              padding: '2px 7px', borderRadius: 999,
            }}>{activeFilterCount}</span>
          )}
          <span style={{ flex: 1 }} />
          <span style={{
            fontSize: 13, color: 'var(--gray-400)', marginLeft: 4,
            transition: 'transform 180ms', transform: filtersExpanded ? 'rotate(180deg)' : 'rotate(0)',
          }}>⌄</span>
        </button>
      </div>

      {filtersExpanded && (<>

      {/* Filter sections */}
      <div style={{ padding: '14px 0 4px', background: 'var(--white)', borderBottom: '1px solid var(--gray-100)' }}>
        <FilterRow label="Cuisine" count={cuisines.size}>
          {(cuisinesExpanded ? ALL_CUISINES : ALL_CUISINES.slice(0, TOP_CUISINES_N)).map(c => (
            <Pill key={c} active={cuisines.has(c)} onClick={() => toggleIn(setCuisines, c)}>{fmtCuisine(c)}</Pill>
          ))}
          {ALL_CUISINES.length > TOP_CUISINES_N && (
            <Pill active={false} onClick={() => setCuisinesExpanded(v => !v)}>
              {cuisinesExpanded ? '− Less' : `+ ${ALL_CUISINES.length - TOP_CUISINES_N} more`}
            </Pill>
          )}
        </FilterRow>
        <FilterRow label="Price" count={prices.size}>
          {ALL_PRICES.map(p => (
            <Pill key={p} active={prices.has(p)} onClick={() => toggleIn(setPrices, p)}>{fmtPrice(p)} · {priceRange(p)}</Pill>
          ))}
        </FilterRow>
        <FilterRow label="Where" count={nearArea ? 1 : 0}>
          <Pill active={!!nearArea} onClick={nearArea ? () => setNearArea(null) : handleNearMeEat} style={geoStatus === 'denied' ? { opacity: 0.5 } : {}}>
            📍 {geoStatus === 'locating' ? 'Locating…' : nearArea ? `Near me · ${nearArea.label}` : geoStatus === 'denied' ? 'Location off' : 'Near me'}
          </Pill>
          <span style={{ fontSize: 11, color: 'var(--gray-400)', alignSelf: 'center', whiteSpace: 'nowrap', paddingLeft: 2 }}>or tap an area on the map below ↓</span>
        </FilterRow>
        <div style={{ padding: '2px 20px 0', fontSize: 10.5, color: 'var(--gray-500)', lineHeight: 1.4 }}>
          {geoStatus === 'denied' ? 'Location is off — enable it in your browser to use Near me.' : 'Tap “Near me” to filter by your location — we only use it to find nearby spots, and you can say no.'}
        </div>
        {/* Vibe / Meal / Dietary tags exist on our editorial picks, so they're
            tucked behind a disclosure rather than dominating the first view. */}
        <div style={{ padding: '4px 20px 2px' }}>
          <button onClick={() => setMoreFiltersOpen(o => !o)} style={{
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 11.5, fontWeight: 700, color: 'var(--gray-500)', letterSpacing: '0.03em',
            display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 0',
          }}>
            {moreFiltersOpen ? '− Fewer filters' : '+ More filters · vibe · meal · dietary'}
          </button>
        </div>
        {moreFiltersOpen && (<>
        <FilterRow label="Vibe" count={vibes.size}>
          {ALL_VIBES.map(v => (
            <Pill key={v} active={vibes.has(v)} onClick={() => toggleIn(setVibes, v)}>{fmtVibe(v)}</Pill>
          ))}
        </FilterRow>
        <FilterRow label="Meal" count={meals.size}>
          {ALL_MEALS.map(m => (
            <Pill key={m} active={meals.has(m)} onClick={() => toggleIn(setMeals, m)}>{fmtMeal(m)}</Pill>
          ))}
        </FilterRow>
        <FilterRow label="Dietary" count={dietary.size}>
          {ALL_DIETARY.map(d => (
            <Pill key={d} active={dietary.has(d)} onClick={() => toggleIn(setDietary, d)}>{fmtDietary(d)}</Pill>
          ))}
        </FilterRow>
        <div style={{ padding: '2px 20px 0', fontSize: 10.5, color: 'var(--gray-500)', lineHeight: 1.4 }}>
          {dietary.size > 0
            ? 'Dietary tags mean solid options exist, not a dedicated kitchen — confirm for allergies.'
            : 'These tags apply to our editorial picks, so they narrow the list considerably.'}
        </div>
        </>)}
        {/* Clear-filters footer inside drawer. Result count lives in the
            drawer toggle header now to keep this section focused. */}
        {activeFilterCount > 0 && (
          <div style={{
            padding: '6px 20px 4px', display: 'flex', justifyContent: 'flex-end',
          }}>
            <button onClick={clearAll} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--gray-600)', fontWeight: 600,
              padding: '2px 6px', textDecoration: 'underline',
              fontFamily: 'inherit',
            }}>Clear all filters</button>
          </div>
        )}
      </div>
      </>)}

      {/* Sort control — only meaningful when there are results to order. */}
      {filtered.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px 0' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-500)', flexShrink: 0 }}>Sort</span>
          {[['reco', 'Recommended'], ['rating', 'Top rated'], ['near', geoStatus === 'locating' ? 'Locating…' : 'Nearest']].map(([key, label]) => (
            <Pill key={key} active={sortBy === key} onClick={() => handleSort(key)}>{label}</Pill>
          ))}
        </div>
      )}

      {/* Results list */}
      <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sortedFiltered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px', color: 'var(--gray-500)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🍽</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 6 }}>
              No restaurants match those filters
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>
              Try clearing a couple of filters — the database is still growing, especially in neighborhoods outside Manhattan.
            </div>
          </div>
        ) : (() => {
          // Like the mood + Tonight tabs: lead with a tight top 10, fold the rest
          // behind "Show all recommendations", and cap the visible set at 20 for
          // now. This only limits DISPLAY — the full database is untouched and
          // still drives the filters, counts, and map.
          const capped = sortedFiltered.slice(0, 20)
          const visible = showAllResults ? capped : capped.slice(0, 10)
          const hidden = capped.length - visible.length
          return (
            <>
              {visible.map(r => {
                const booking = r.bookingDifficulty ? fmtBooking(r.bookingDifficulty) : null
                const isSaved = r.kind === 'editorial' && !!savedItems[`venue:${r.venueId}`]
                const accent = venueColors[r.venueId || r.id]?.bg || '#dc2626'
                const cuisineEmoji = (CUISINE_EMOJI[r.cuisine] || '🍽')
                // Editorial restaurants have a rich detail page; imports/curated
                // open Google Maps (disambiguated by neighborhood so they resolve).
                const openCard = () => {
                  if (r.kind === 'editorial') { push({ screen: 'venue', venueId: r.venueId }); return }
                  setEatSheet(placeFromRestaurant(r))
                }
                return (
                  <button
                    key={r.id}
                    onClick={openCard}
                    style={{
                      // Matches the MoodScreen pick-card pattern: 14px radius,
                      // Warm card surface, no left accent stripe — the 3px
                      // colored border fought the rounded corners (red crescent
                      // artifact) and the thumbnails already carry the color.
                      width: '100%', background: 'var(--card)',
                      border: '1px solid rgba(33,27,20,0.10)', borderRadius: 14,
                      padding: '12px 14px', cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      fontFamily: 'inherit',
                      boxShadow: '0 4px 14px rgba(33,27,20,0.05)',
                    }}
                  >
                    <EatCardThumb r={r} emoji={cuisineEmoji} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
                      }}>
                        <span style={{
                          flex: 1, minWidth: 0,
                          fontSize: 15, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{r.name}</span>
                      </div>
                      <div style={{
                        fontSize: 11, color: 'var(--gray-500)', marginBottom: 4,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {[
                          r.cuisine && `__C__${r.cuisine}`,
                          r.price ? `__C__${priceRange(r.price)}` : null,
                          r.rating ? `★ ${r.rating}` : null,
                          r.neighborhood,
                        ].filter(Boolean).map((seg, i, arr) => {
                          const bold = typeof seg === 'string' && seg.startsWith('__C__')
                          const text = bold ? seg.slice(5) : seg
                          return (
                            <React.Fragment key={i}>
                              {i > 0 ? ' · ' : ''}
                              <span style={bold ? { fontWeight: 700, color: 'var(--gray-700)' } : (String(seg).startsWith('★') ? { color: '#854F0B', fontWeight: 700 } : undefined)}>{text}</span>
                            </React.Fragment>
                          )
                        })}
                      </div>
                      {(r.mustOrder || []).length > 0 && (
                        <div style={{
                          fontSize: 12, color: 'var(--gray-700)', lineHeight: 1.4,
                          fontStyle: 'italic', marginBottom: 4,
                          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          🍴 {r.mustOrder.slice(0, 2).join(', ')}
                        </div>
                      )}
                      {booking && (
                        <span style={{
                          display: 'inline-block',
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                          color: booking.color, background: booking.color + '18',
                          padding: '2px 7px', borderRadius: 4,
                        }}>{booking.label}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 18, color: 'var(--gray-300)', alignSelf: 'center', flexShrink: 0 }}>›</span>
                  </button>
                )
              })}
              {hidden > 0 && (
                <button
                  onClick={() => setShowAllResults(true)}
                  style={{
                    width: '100%', background: 'var(--white)',
                    border: '1px solid var(--gray-200)', borderRadius: 14,
                    padding: '13px 14px', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                    color: 'var(--gray-700)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <span>Show all recommendations</span>
                  <span style={{ fontSize: 14, color: 'var(--gray-400)' }}>↓</span>
                </button>
              )}
            </>
          )
        })()}
      </div>

      {/* In-app detail sheet for non-editorial restaurants — replaces the old
          "open Google Maps" dump. Reuses MoodPlaceSheet (photo, open-now, hours,
          website, Add to My Trip), keeping a Google Maps button as a secondary. */}
      <BottomSheet open={!!eatSheet} onClose={() => setEatSheet(null)} fit>
        {eatSheet && (
          <MoodPlaceSheet place={eatSheet}
            savedItems={savedItems} toggleSave={toggleSave} userVenues={userVenues} onAddToTrip={onAddToTrip} />
        )}
      </BottomSheet>
    </div>
  )
}

// Small filter-row helper: label on the left, horizontally-scrolling pills on the right.
function FilterRow({ label, count, children }) {
  return (
    <div style={{
      padding: '6px 20px 6px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <div style={{
        flexShrink: 0, width: 60, paddingTop: 6,
        fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--gray-500)',
      }}>
        {label}{count > 0 ? ` · ${count}` : ''}
      </div>
      <div style={{
        flex: 1, minWidth: 0, display: 'flex', gap: 6, flexWrap: 'nowrap',
        overflowX: 'auto', padding: '2px 0 4px',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }} className="hide-scrollbar">
        {children}
      </div>
    </div>
  )
}

// ── Mood-map area definitions ──────────────────────────────────────────────
// Two boroughs with hand-picked sub-areas. Each area has:
//   • id     — stable identifier
//   • label  — display name
//   • sub    — small caption under the label inside the SVG block
//   • rect   — { x, y, w, h } SVG rectangle for the schematic map (drawn in a
//              340×500-ish viewBox). Geometry is intentionally NOT geographic
//              — it's a clean tap-target layout.
//   • color  — fill when the area has picks for the current mood
// Bounds for classifying a lat/lng into an area live in classifyLatLngToArea.
const MOOD_MAP_AREAS = {
  manhattan: [
    { id: 'uptown',   label: 'Uptown',          sub: 'Harlem · Morningside · East Harlem', color: '#8aa873' },
    { id: 'uws',      label: 'Upper West Side',  sub: 'AMNH · Lincoln Center',              color: '#c2a24e' },
    { id: 'ues',      label: 'Upper East Side',  sub: 'Met · Guggenheim · 92Y',             color: '#cc7d92' },
    { id: 'mw',       label: 'Midtown West',     sub: 'Theatre District · Times Sq',        color: '#7e93c4' },
    { id: 'me',       label: 'Midtown East',     sub: 'Grand Central · MoMA · UN',          color: '#c98aa0' },
    { id: 'chelsea',  label: 'Chelsea',          sub: 'High Line · Chelsea Market',         color: '#9b86c4' },
    { id: 'gramercy', label: 'Gramercy',         sub: 'Flatiron · NoMad · Murray Hill',     color: '#b8a64e' },
    { id: 'wv',       label: 'West Village',     sub: 'Greenwich Village · SoHo',           color: '#6fae8e' },
    { id: 'ev',       label: 'East Village',     sub: 'East Village · Lower East Side',     color: '#9aaa5e' },
    { id: 'lower',    label: 'Lower Manhattan',  sub: 'Tribeca · WTC · Chinatown · FiDi',   color: '#c89a6a' },
  ],
  brooklyn: [
    { id: 'bk_greenpoint',    label: 'Greenpoint',        sub: 'North BK · waterfront', color: '#6fae8e' },
    { id: 'bk_williamsburg',  label: 'Williamsburg',      sub: 'North BK · waterfront', color: '#7e93c4' },
    { id: 'bk_dumbo',         label: 'DUMBO',             sub: 'Waterfront',            color: '#c89a6a' },
    { id: 'bk_downtown',      label: 'Downtown Brooklyn', sub: 'Downtown',              color: '#c2a24e' },
    { id: 'bk_clinton',       label: 'Clinton Hill',      sub: 'Brownstone',            color: '#cc7d92' },
    { id: 'bk_prospect_hts',  label: 'Prospect Heights',  sub: 'Park · museum · gardens', color: '#9b86c4' },
    { id: 'bk_park_slope',    label: 'Park Slope',        sub: 'West of the park',      color: '#8aa873' },
    { id: 'bk_crown_hts',     label: 'Crown Heights',     sub: 'Central',               color: '#c98aa0' },
    { id: 'bk_east',          label: 'East Brooklyn',     sub: 'Bed-Stuy · Bushwick',   color: '#d39a5e' },
    { id: 'bk_lower',         label: 'Lower Brooklyn',    sub: 'Red Hook · Sunset Park',color: '#6fa8b0' },
  ],
}

// Brooklyn neighborhood boundaries (real-ish, [lat,lng] rings). Used by
// classifyLatLngToArea via point-in-polygon so a coordinate lands in the same
// shape drawn on the Brooklyn map. bk_east and bk_lower are broad catch-alls
// listed LAST, so the specific neighborhoods above win any overlap and these two
// pick up the rest of central/east BK (Bed-Stuy, Bushwick) and south/west BK
// (Red Hook, Carroll Gardens, Gowanus, Sunset Park, Bay Ridge).
const BK_AREA_POLYS = {
  bk_greenpoint:   [[40.7385,-73.9605],[40.7392,-73.9505],[40.7360,-73.9360],[40.7268,-73.9338],[40.7240,-73.9440],[40.7248,-73.9560],[40.7295,-73.9612]],
  bk_williamsburg: [[40.7248,-73.9560],[40.7240,-73.9440],[40.7130,-73.9335],[40.7000,-73.9408],[40.7008,-73.9560],[40.7085,-73.9680],[40.7180,-73.9668],[40.7222,-73.9620]],
  bk_dumbo:        [[40.7058,-73.9995],[40.7047,-73.9852],[40.7005,-73.9848],[40.6970,-73.9990]],
  bk_downtown:     [[40.7000,-73.9908],[40.6988,-73.9760],[40.6850,-73.9770],[40.6800,-73.9880],[40.6830,-73.9945],[40.6960,-73.9945]],
  bk_clinton:      [[40.6975,-73.9702],[40.6970,-73.9585],[40.6800,-73.9600],[40.6805,-73.9722]],
  // Prospect Heights now ALSO covers Prospect Park + its Eastern Parkway ring
  // (Brooklyn Museum, Botanic Garden, Library, Grand Army Plaza) — Prospect Park
  // was merged in here since standalone parkland never had its own venues.
  bk_prospect_hts: [[40.6815,-73.9742],[40.6805,-73.9610],[40.6700,-73.9595],[40.6530,-73.9685],[40.6600,-73.9745],[40.6770,-73.9748]],
  bk_park_slope:   [[40.6852,-73.9840],[40.6800,-73.9742],[40.6700,-73.9772],[40.6605,-73.9810],[40.6620,-73.9908],[40.6772,-73.9892]],
  bk_crown_hts:    [[40.6790,-73.9632],[40.6785,-73.9292],[40.6618,-73.9272],[40.6608,-73.9540],[40.6662,-73.9632]],
  bk_east:         [[40.7060,-73.9560],[40.7060,-73.8760],[40.6580,-73.8740],[40.6560,-73.9600]],
  bk_lower:        [[40.6900,-74.0260],[40.6900,-73.9720],[40.6180,-73.9860],[40.6160,-74.0320]],
}
// Ray-casting point-in-polygon. ring is [[lat,lng],…].
function pointInPoly(lat, lng, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i][0], xi = ring[i][1], yj = ring[j][0], xj = ring[j][1]
    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) inside = !inside
  }
  return inside
}

// Classify a (lat, lng) into one of our schematic areas, or null if outside
// the boroughs we currently cover (Manhattan + Brooklyn). Bounds were tuned
// against the venueCoords entries in this codebase; they're approximate.
function classifyLatLngToArea(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null

  // Manhattan and Brooklyn share latitudes along the East River (Lower Manhattan
  // sits directly opposite DUMBO / Williamsburg / Greenpoint), so a plain lat/lng
  // box can't separate them — the previous version let the Brooklyn waterfront
  // fall through into Manhattan's box and surface under "Lower Manhattan". We now
  // split on the river: Manhattan is WEST of `riverLng`, Brooklyn EAST. The river
  // angles east as it runs north, so below ~14th St we follow a sloped line; above
  // it we hold near Manhattan's far-east avenues (so Alphabet City / Stuy Town stay
  // Manhattan while Williamsburg / Greenpoint correctly read Brooklyn).
  const riverLng = lat <= 40.715 ? (-74.000 + 0.867 * (lat - 40.700)) : -73.968

  // ── Brooklyn — checked FIRST so the waterfront isn't swallowed by Manhattan's
  //    box. Brooklyn = south of Manhattan's tip, OR east of the river. The
  //    lng >= -74.015 floor keeps harbor islands (Liberty, Ellis) out of Brooklyn.
  //    Within Brooklyn we point-in-polygon against the 9 mapped neighborhoods;
  //    anything in Brooklyn but outside them (Bushwick, Bed-Stuy, Red Hook, …) is
  //    intentionally unmapped (null) so it only surfaces under "Anywhere". ──
  if (lat >= 40.55 && lat <= 40.74 && lng >= -74.015 && lng <= -73.83) {
    const inBrooklyn = lat < 40.700 ? true : (lng > riverLng)
    if (inBrooklyn) {
      for (const areaId in BK_AREA_POLYS) {
        if (pointInPoly(lat, lng, BK_AREA_POLYS[areaId])) return { borough: 'brooklyn', areaId }
      }
      return null
    }
  }

  // ── Manhattan — broadly lat 40.70–40.88, lng -74.02 to -73.91 ──
  if (lat >= 40.70 && lat <= 40.88 && lng >= -74.02 && lng <= -73.91) {
    // Uptown — Harlem, Morningside Heights, East Harlem
    if (lat >= 40.795) return { borough: 'manhattan', areaId: 'uptown' }
    // Central Park belt — Upper West vs Upper East, split across the park
    if (lat >= 40.768) return { borough: 'manhattan', areaId: lng < -73.970 ? 'uws' : 'ues' }
    // Midtown — West (Theatre District) vs East (Grand Central), split ~5th–6th Ave
    if (lat >= 40.745) return { borough: 'manhattan', areaId: lng < -73.978 ? 'mw' : 'me' }
    // Chelsea (west) vs Gramercy/Flatiron (east)
    if (lat >= 40.735) return { borough: 'manhattan', areaId: lng < -73.994 ? 'chelsea' : 'gramercy' }
    // The Villages — West (Greenwich/West Village/SoHo) vs East (East Village/LES)
    if (lat >= 40.718) return { borough: 'manhattan', areaId: lng < -73.992 ? 'wv' : 'ev' }
    // Lower Manhattan — Tribeca, WTC, Chinatown, Financial District
    return { borough: 'manhattan', areaId: 'lower' }
  }
  return null
}

// Returns { borough, areaId } for a mood pick (venue or sight), or null if
// the pick has no coordinates we can classify.
function classifyPickToArea(pick) {
  if (!pick) return null
  if (pick.type === 'venue') {
    const c = venueCoords[pick.id]
    return c ? classifyLatLngToArea(c.lat, c.lng) : null
  }
  if (pick.type === 'sight') {
    const s = ALL_SIGHTS[pick.id]
    return s ? classifyLatLngToArea(s.lat, s.lng) : null
  }
  return null
}

// WMO weather code → an Apple-Weather-ish symbol (day/night aware for clear sky).
function weatherEmoji(code, isDay) {
  if (code === 0) return isDay ? '☀️' : '🌙'
  if (code === 1) return isDay ? '🌤️' : '🌙'
  if (code === 2) return isDay ? '⛅' : '☁️'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if (code >= 51 && code <= 57) return '🌦️'
  if (code >= 61 && code <= 67) return '🌧️'
  if (code >= 71 && code <= 77) return '🌨️'
  if (code >= 80 && code <= 82) return '🌧️'
  if (code >= 85 && code <= 86) return '🌨️'
  if (code >= 95) return '⛈️'
  return '🌡️'
}

// Weather + time-of-day → one contextual line under the header. The cheapest
// "it knows me" moment: the data is already fetched for the header chip.
function weatherLine(weather, hour) {
  if (!weather) return null
  const { code, temp } = weather
  const tod = t(hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening')
  // Thresholds stay in °F (the fetch unit); display converts via fmtTemp.
  if (code >= 95) return t('Thunder out there — a long-lunch, museum kind of day.')
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return t('Snow day — coffee first, then somewhere warm.')
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return t2('Rainy {TOD} — museums, bookstores, a long ramen.', { TOD: tod })
  if (code === 45 || code === 48) return t('Foggy — the city’s gone cinematic. Walk the bridge anyway.')
  if (temp >= 88) return t2('{T}° and steamy — shade, iced coffee, waterfront.', { T: fmtTemp(temp) })
  if (temp <= 35) return t2('{T}° out there — bundle up, keep it indoors and cozy.', { T: fmtTemp(temp) })
  if (code <= 1) {
    if (tod === t('morning')) return t('Clear morning — bagel weather.')
    if (tod === t('afternoon')) return t('Sunny afternoon — the waterfront is calling.')
    return t('Clear night — rooftop weather.')
  }
  if (code <= 3) return t2('Soft gray {TOD} — good wandering weather.', { TOD: tod })
  return null
}

// Browser geolocation → Promise<{ lat, lng }>. The "allow location" prompt is
// the browser's own native dialog; we just call this. Rejects on denial,
// unsupported, or timeout — callers disable "Near me" in those cases.
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) { reject(new Error('unsupported')); return }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err),
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 300000 }
    )
  })
}

// Best-effort map a free-text neighborhood (from the Add-a-place picker or an
// import) onto a mood-map area, so user places without coordinates still land
// in the right neighborhood. Returns { borough, areaId } or null.
function neighborhoodToArea(s) {
  if (!s || typeof s !== 'string') return null
  const t = s.toLowerCase()
  const has = (...ks) => ks.some(k => t.includes(k))
  // Brooklyn — only the 9 mapped neighborhoods. Others (Bed-Stuy, Bushwick, Fort
  // Greene, Gowanus, Red Hook, Cobble/Carroll, …) intentionally return null so
  // they surface under "Anywhere", never in a wrong area. Order: 'prospect park'
  // before 'prospect heights' so the park doesn't capture the neighborhood.
  if (has('greenpoint')) return { borough: 'brooklyn', areaId: 'bk_greenpoint' }
  if (has('williamsburg')) return { borough: 'brooklyn', areaId: 'bk_williamsburg' }
  if (has('dumbo')) return { borough: 'brooklyn', areaId: 'bk_dumbo' }
  if (has('downtown brooklyn')) return { borough: 'brooklyn', areaId: 'bk_downtown' }
  if (has('clinton hill')) return { borough: 'brooklyn', areaId: 'bk_clinton' }
  if (has('prospect park', 'prospect heights')) return { borough: 'brooklyn', areaId: 'bk_prospect_hts' }
  if (has('park slope')) return { borough: 'brooklyn', areaId: 'bk_park_slope' }
  if (has('crown heights')) return { borough: 'brooklyn', areaId: 'bk_crown_hts' }
  if (has('bed-stuy', 'bedford-stuyvesant', 'bedford stuyvesant', 'stuyvesant heights', 'bushwick', 'east new york', 'ocean hill', 'brownsville')) return { borough: 'brooklyn', areaId: 'bk_east' }
  if (has('red hook', 'carroll gardens', 'cobble hill', 'boerum hill', 'gowanus', 'sunset park', 'bay ridge', 'windsor terrace', 'columbia street')) return { borough: 'brooklyn', areaId: 'bk_lower' }
  if (has('harlem', 'morningside', 'washington heights', 'inwood')) return { borough: 'manhattan', areaId: 'uptown' }
  if (has('upper west', 'lincoln square')) return { borough: 'manhattan', areaId: 'uws' }
  if (has('upper east', 'yorkville', 'carnegie hill')) return { borough: 'manhattan', areaId: 'ues' }
  if (has('hell', 'times square', 'theater', 'theatre', 'midtown west', 'garment', 'koreatown', 'k-town', 'korea way')) return { borough: 'manhattan', areaId: 'mw' }
  if (has('murray hill', 'turtle bay', 'midtown east', 'midtown')) return { borough: 'manhattan', areaId: 'me' }
  if (has('chelsea', 'meatpacking', 'hudson yards')) return { borough: 'manhattan', areaId: 'chelsea' }
  if (has('gramercy', 'flatiron', 'nomad', 'kips', 'union square')) return { borough: 'manhattan', areaId: 'gramercy' }
  if (has('west village', 'greenwich', 'soho', 'noho')) return { borough: 'manhattan', areaId: 'wv' }
  if (has('east village', 'lower east', 'alphabet', 'nolita', 'little italy')) return { borough: 'manhattan', areaId: 'ev' }
  if (has('tribeca', 'financial', 'fidi', 'chinatown', 'battery', 'wall street', 'lower manhattan', 'seaport')) return { borough: 'manhattan', areaId: 'lower' }
  return null
}

// ── Illustrated borough map (SVG) ──────────────────────────────────────────
// A hand-shaped Manhattan and Brooklyn silhouette where each neighborhood is
// a tappable colored polygon with its name written inside. Replaced an
// earlier Leaflet+OSM overlay that ended up too tight visually — neighborhood
// chip labels collided and the actual streets were a distraction from the
// area-picking task. This map is purely schematic.
//
// Each entry has:
//   • id           — stable identifier (matches the area ids elsewhere)
//   • label        — display text written inside the polygon. Short, ALL CAPS.
//   • color        — fill color when populated
//   • points       — SVG polygon "points" string in viewBox space
//   • labelAt      — [x, y] center for the label and count badge
//   • labelSize    — optional font-size override for tight polygons
const MOOD_MAP_SVG = {
  manhattan: {
    viewBox: '0 0 360 620',
    // Central Park anchor + river labels. Adjacent boroughs intentionally omitted —
    // they live on the dedicated Map tab; the mood card keeps the island clean.
    adjacent: [
      { kind: 'park', label: 'C.P.', d: 'M 170,182 L 192,182 L 192,310 L 170,310 Z', labelAt: [181, 250] },
      { kind: 'water-label', label: 'Hudson R.', at: [72, 330], rotate: -78 },
      { kind: 'water-label', label: 'East R.',   at: [292, 330], rotate: 78 },
    ],
    areas: [
      { id: 'uptown',   color: '#8aa873', label: 'UPTOWN',     points: '120,62 240,62 248,182 112,182',   labelAt: [180, 126] },
      { id: 'uws',      color: '#c2a24e', label: 'UPPER WEST', points: '112,182 170,182 170,310 108,310', labelAt: [138, 248], labelSize: 8 },
      { id: 'ues',      color: '#cc7d92', label: 'UPPER EAST', points: '192,182 248,182 252,310 192,310', labelAt: [223, 248], labelSize: 8 },
      { id: 'mw',       color: '#7e93c4', label: ['MIDTOWN', 'WEST'], points: '108,310 180,310 180,400 110,400', labelAt: [144, 356], labelSize: 8 },
      { id: 'me',       color: '#c98aa0', label: ['MIDTOWN', 'EAST'], points: '180,310 252,310 250,400 180,400', labelAt: [216, 356], labelSize: 8 },
      { id: 'chelsea',  color: '#9b86c4', label: 'CHELSEA',    points: '110,400 180,400 180,460 115,460', labelAt: [146, 432], labelSize: 9 },
      { id: 'gramercy', color: '#b8a64e', label: 'GRAMERCY',   points: '180,400 250,400 245,460 180,460', labelAt: [214, 432], labelSize: 8 },
      { id: 'wv',       color: '#6fae8e', label: ['WEST', 'VILLAGE'], points: '115,460 180,460 180,540 138,540', labelAt: [150, 498], labelSize: 7 },
      { id: 'ev',       color: '#9aaa5e', label: ['EAST', 'VILLAGE'], points: '180,460 245,460 222,540 180,540', labelAt: [208, 498], labelSize: 7 },
      { id: 'lower',    color: '#c89a6a', label: 'LOWER',      points: '138,540 222,540 180,592',         labelAt: [180, 556], labelSize: 9 },
    ],
  },
  brooklyn: {
    viewBox: '0 0 322 403',
    baseLand: '136,96 150,46 210,42 248,62 254,100 262,150 268,175 279,220 283,268 277,300 269,345 268,350 180,386 118,374 70,348 69,345 58,300 49,268 49,220 52,180 64,175 120,150 135,100',
    adjacent: [
      { kind: 'land', label: 'Manhattan', d: 'M 0,34 L 56,34 L 40,192 L 14,292 L 0,327 Z', labelAt: [34, 72] },
      { kind: 'land', label: 'Queens', d: 'M 264,34 L 322,34 L 322,134 L 274,112 Z', labelAt: [292, 72] },
      { kind: 'water-label', label: 'East River', at: [60, 192], rotate: -62 },
      { kind: 'water-label', label: 'Upper Bay', at: [62, 387], rotate: 0 },
    ],
    areas: [
      { id: 'bk_greenpoint', color: '#6fae8e', label: ['GREENPOINT'], points: '135,100 136,96 150,46 210,42 248,62 254,100', labelAt: [193, 73], labelSize: 9 },
      { id: 'bk_williamsburg', color: '#7e93c4', label: ['WILLIAMS-', 'BURG'], points: '135,100 254,100 262,150 268,175 64,175 120,150', labelAt: [166, 140], labelSize: 9 },
      { id: 'bk_dumbo', color: '#c89a6a', label: ['DUMBO'], points: '64,175 118,175 118,220 49,220 52,180', labelAt: [83, 199], labelSize: 7 },
      { id: 'bk_downtown', color: '#c2a24e', label: ['DOWN-', 'TOWN'], points: '49,220 118,220 118,268 49,268', labelAt: [83, 244], labelSize: 8 },
      { id: 'bk_clinton', color: '#cc7d92', label: ['CLINTON', 'HILL'], points: '118,175 176,175 176,268 118,268', labelAt: [147, 222], labelSize: 8.5 },
      { id: 'bk_east', color: '#d39a5e', label: ['EAST', 'BROOKLYN'], points: '176,175 268,175 279,220 283,268 176,268', labelAt: [225, 222], labelSize: 8.5 },
      { id: 'bk_park_slope', color: '#8aa873', label: ['PARK', 'SLOPE'], points: '49,268 118,268 118,345 69,345 58,300', labelAt: [84, 306], labelSize: 8.5 },
      { id: 'bk_prospect_hts', color: '#9b86c4', label: ['PROSPECT', 'HTS & PARK'], points: '118,268 176,268 176,345 118,345', labelAt: [147, 306], labelSize: 8 },
      { id: 'bk_crown_hts', color: '#c98aa0', label: ['CROWN', 'HEIGHTS'], points: '176,268 283,268 277,300 269,345 176,345', labelAt: [225, 306], labelSize: 9 },
      { id: 'bk_lower', color: '#6fa8b0', label: ['LOWER', 'BROOKLYN'], points: '69,345 269,345 268,350 180,386 118,374 70,348', labelAt: [170, 366], labelSize: 8.5 },
    ],
  },
}

// ── Detailed Manhattan neighborhood map (Map tab "Neighborhoods" view) ──────
// The richer 19-area split, rendered as a tappable schematic. Tapping an area
// pans the real Leaflet map (see MANHATTAN_DETAIL_CENTERS + MapScreen).
const MANHATTAN_DETAIL_SVG = {
  viewBox: '0 0 360 660',
  rivers: [
    { label: 'Hudson R.', at: [60, 360], rotate: -80 },
    { label: 'East R.',   at: [300, 360], rotate: 80 },
  ],
  park:    { points: '168.5,156 194.4,156 194.8,270 168.2,270', labelAt: [181, 216] },
  timesSq: { points: '147.4,298 180.0,298 180.0,322 147.4,322', labelAt: [164, 313] },
  areas: [
    { id: 'harlem', color: '#8aa873', label: 'HARLEM', points: '120.0,40 240.0,40 246.0,92 114.0,92', labelAt: [180, 70] },
    { id: 'morningside', color: '#9b86c4', label: 'MORN. HTS', points: '114.0,92 174.7,92 174.2,156 108.0,156', labelAt: [143, 126], labelSize: 6 },
    { id: 'east_harlem', color: '#c98a6a', label: 'E. HARLEM', points: '174.7,92 246.0,92 252.0,156 174.2,156', labelAt: [212, 126], labelSize: 7 },
    { id: 'uws', color: '#c2a24e', label: 'UWS', points: '108.0,156 168.5,156 168.2,270 106.0,270', labelAt: [138, 216], labelSize: 9 },
    { id: 'ues', color: '#cc7d92', label: 'UES', points: '194.4,156 252.0,156 254.0,270 194.8,270', labelAt: [224, 216], labelSize: 9 },
    { id: 'mw', color: '#7e93c4', label: 'MIDTOWN W', points: '106.0,270 180.0,270 180.0,326 106.0,326', labelAt: [142, 292], labelSize: 6 },
    { id: 'me', color: '#c98aa0', label: 'MIDTOWN E', points: '180.0,270 254.0,270 254.0,326 180.0,326', labelAt: [217, 300], labelSize: 6 },
    { id: 'garment', color: '#b8a64e', label: 'GARMENT', points: '106.0,326 174.1,326 174.2,368 108.0,368', labelAt: [141, 349], labelSize: 6 },
    { id: 'gramercy', color: '#9aaa5e', label: 'GRAMERCY', points: '174.1,326 254.0,326 248.0,428 174.6,428', labelAt: [213, 380], labelSize: 8 },
    { id: 'chelsea', color: '#9b86c4', label: 'CHELSEA', points: '108.0,368 174.2,368 174.6,428 112.0,428', labelAt: [142, 400], labelSize: 7 },
    { id: 'greenwich', color: '#6fae8e', label: 'GREENWICH', points: '112.0,428 188.2,428 186.7,486 124.0,486', labelAt: [153, 459], labelSize: 6 },
    { id: 'east_village', color: '#9aaa5e', label: 'E. VILLAGE', points: '188.2,428 248.0,428 236.0,486 186.7,486', labelAt: [215, 459], labelSize: 6 },
    { id: 'soho', color: '#c2a24e', label: 'SOHO', points: '124.0,486 171.0,486 173.3,532 138.0,532', labelAt: [152, 511], labelSize: 7 },
    { id: 'les', color: '#e0b46a', label: 'LES', points: '171.0,486 236.0,486 222.0,532 173.3,532', labelAt: [201, 511], labelSize: 8 },
    { id: 'wtc', color: '#6fae8e', label: 'WTC', points: '138.0,532 176.6,532 177.8,578 152.0,578', labelAt: [161, 557], labelSize: 8 },
    { id: 'chinatown', color: '#d2a85e', label: 'CHINATOWN', points: '176.6,532 222.0,532 208.0,578 177.8,578', labelAt: [196, 557], labelSize: 6 },
    { id: 'fidi', color: '#c89a6a', label: 'FIDI', points: '152.0,578 208.0,578 180,628', labelAt: [180, 596], labelSize: 7 },
  ],
}
// Map-pan targets for each detailed area: [lat, lng, zoom]. Tapping an area in
// the schematic flips to the real map centered here.
const MANHATTAN_DETAIL_CENTERS = {
  harlem: [40.8116, -73.9465, 14], morningside: [40.8089, -73.9626, 14], east_harlem: [40.7957, -73.9389, 14],
  uws: [40.7870, -73.9754, 14], ues: [40.7736, -73.9566, 14],
  mw: [40.7590, -73.9855, 14], me: [40.7540, -73.9740, 14],
  garment: [40.7530, -73.9915, 15], gramercy: [40.7380, -73.9840, 14], chelsea: [40.7465, -74.0014, 14],
  greenwich: [40.7320, -74.0020, 15], east_village: [40.7270, -73.9840, 15],
  soho: [40.7240, -74.0010, 15], les: [40.7180, -73.9870, 15],
  wtc: [40.7120, -74.0120, 15], chinatown: [40.7158, -73.9970, 15], fidi: [40.7060, -74.0110, 15],
}
// Map-pan targets for the Brooklyn schematic areas (same tap-to-pan behavior).
const BROOKLYN_DETAIL_CENTERS = {
  bk_greenpoint: [40.7300, -73.9515, 14], bk_williamsburg: [40.7140, -73.9573, 14],
  bk_dumbo: [40.7033, -73.9903, 15], bk_downtown: [40.6905, -73.9855, 15],
  bk_clinton: [40.6890, -73.9660, 15], bk_prospect_hts: [40.6745, -73.9670, 14],
  bk_park_slope: [40.6710, -73.9814, 14], bk_crown_hts: [40.6695, -73.9440, 14],
  bk_east: [40.6895, -73.9270, 13], bk_lower: [40.6640, -74.0000, 13],
}

// Friendly display names for the schematic areas (the SVG labels are ALL-CAPS
// abbreviations; the picks sheet wants real names).
const DETAIL_AREA_LABELS = {
  harlem: 'Harlem', morningside: 'Morningside Heights', east_harlem: 'East Harlem',
  uws: 'Upper West Side', ues: 'Upper East Side', mw: 'Midtown West', me: 'Midtown East',
  garment: 'Garment District', gramercy: 'Gramercy & Flatiron', chelsea: 'Chelsea',
  greenwich: 'Greenwich Village', east_village: 'East Village', soho: 'SoHo', les: 'Lower East Side',
  wtc: 'World Trade Center', chinatown: 'Chinatown', fidi: 'Financial District',
  bk_greenpoint: 'Greenpoint', bk_williamsburg: 'Williamsburg', bk_dumbo: 'DUMBO',
  bk_downtown: 'Downtown Brooklyn', bk_clinton: 'Clinton Hill', bk_prospect_hts: 'Prospect Heights',
  bk_park_slope: 'Park Slope', bk_crown_hts: 'Crown Heights', bk_east: 'East Brooklyn', bk_lower: 'Lower Brooklyn',
}
// Manhattan detail areas → the coarse regions classifyLatLngToArea knows about
// (Brooklyn detail ids already match the classifier 1:1).
const MANHATTAN_DETAIL_TO_COARSE = {
  harlem: 'uptown', morningside: 'uptown', east_harlem: 'uptown',
  uws: 'uws', ues: 'ues', mw: 'mw', me: 'me', garment: 'mw',
  gramercy: 'gramercy', chelsea: 'chelsea',
  greenwich: 'wv', soho: 'wv', east_village: 'ev', les: 'ev',
  wtc: 'lower', chinatown: 'lower', fidi: 'lower',
}
// Top picks for a tapped schematic area: curated venues whose coordinates
// classify into the area's region, ranked by distance to the area center so
// neighborhood-local spots win. Returns up to 5.
function picksForDetailArea(areaId) {
  const center = MANHATTAN_DETAIL_CENTERS[areaId] || BROOKLYN_DETAIL_CENTERS[areaId]
  if (!center) return []
  const want = areaId.startsWith('bk_')
    ? { borough: 'brooklyn', areaId }
    : { borough: 'manhattan', areaId: MANHATTAN_DETAIL_TO_COARSE[areaId] }
  const out = []
  for (const id in venueCoords) {
    const c = venueCoords[id]
    const v = venues[id]
    if (!v || typeof c.lat !== 'number' || typeof c.lng !== 'number') continue
    const where = classifyLatLngToArea(c.lat, c.lng)
    if (!where || where.borough !== want.borough || where.areaId !== want.areaId) continue
    out.push({ id, name: v.name, neighborhood: v.neighborhood || '', domain: c.domain, lat: c.lat, lng: c.lng, d: distanceMiles({ lat: center[0], lng: center[1] }, { lat: c.lat, lng: c.lng }) })
  }
  out.sort((a, b) => a.d - b.d)
  // Curated venues are Manhattan-heavy; fill remaining slots from the imported
  // places pool (they carry coords + the new one-line descriptions) so Brooklyn
  // areas get real answers too. Seeds have no venue page — they render as
  // info rows (name + blurb), not links.
  if (out.length < 5) {
    const fillers = []
    for (const p of (seedUserPlaces || [])) {
      if (typeof p.lat !== 'number' || typeof p.lng !== 'number') continue
      const where = classifyLatLngToArea(p.lat, p.lng)
      if (!where || where.borough !== want.borough || where.areaId !== want.areaId) continue
      fillers.push({ id: p.id, seed: true, name: p.name, neighborhood: p.neighborhood || '', blurb: p.description || '', tip: p.insiderTip || '', category: p.category, lat: p.lat, lng: p.lng, d: distanceMiles({ lat: center[0], lng: center[1] }, { lat: p.lat, lng: p.lng }) })
    }
    fillers.sort((a, b) => a.d - b.d)
    out.push(...fillers.slice(0, 5 - out.length))
  }
  return out.slice(0, 5)
}
// Pure SVG, tappable. Mirrors BoroughAreaMap styling but Manhattan-only and
// always fully colored (this is a neighborhood reference, not a pick filter).
function ManhattanDetailMap({ selectedArea = null, onSelectArea = () => {} }) {
  const D = MANHATTAN_DETAIL_SVG
  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#e7eef6' }}>
      <svg
        viewBox={D.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', width: '100%', maxWidth: 460, margin: '0 auto', padding: '10px 0' }}
      >
        <rect x="0" y="0" width="100%" height="100%" fill="#e7eef6" />
        {D.rivers.map((r, i) => (
          <text key={'r' + i} x={r.at[0]} y={r.at[1]}
            transform={r.rotate ? `rotate(${r.rotate} ${r.at[0]} ${r.at[1]})` : undefined}
            fontSize="9" fill="#7aa0c4" fontStyle="italic" textAnchor="middle"
            style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>{r.label}</text>
        ))}
        {D.areas.map(a => {
          const active = selectedArea === a.id
          return (
            <g key={a.id} onClick={() => onSelectArea(active ? null : a.id)} style={{ cursor: 'pointer' }}>
              <polygon points={a.points} fill={a.color} fillOpacity={active ? 1 : 0.9}
                stroke={active ? '#0f172a' : '#ffffff'} strokeWidth={active ? 3 : 1.4} strokeLinejoin="round" />
              <text x={a.labelAt[0]} y={a.labelAt[1]} fontSize={a.labelSize || 11} fontWeight="800"
                fill="#33414d" textAnchor="middle" letterSpacing="0.02"
                style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>{a.label}</text>
            </g>
          )
        })}
        <polygon points={D.park.points} fill="#bbf7d0" stroke="#86efac" strokeWidth="1" />
        <text x={D.park.labelAt[0]} y={D.park.labelAt[1]} fontSize="7" fontWeight="700" fill="#166534"
          textAnchor="middle" style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>C.P.</text>
        <polygon points={D.timesSq.points} fill="#f3e1bd" stroke="#bfae73" strokeWidth="1.2" />
        <text x={D.timesSq.labelAt[0]} y={D.timesSq.labelAt[1]} fontSize="6" fontWeight="800" fill="#6b5a1f"
          textAnchor="middle" style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>TSQ</text>
      </svg>
    </div>
  )
}

// Brooklyn counterpart for the Map tab "Neighborhoods" view. Reuses the
// schematic geometry from MOOD_MAP_SVG.brooklyn (single source of truth with
// the mood flow) but styled to match ManhattanDetailMap: blue backdrop, always
// fully colored, every area tappable → pans the real map.
function BrooklynDetailMap({ selectedArea = null, onSelectArea = () => {} }) {
  const D = MOOD_MAP_SVG.brooklyn
  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#e7eef6' }}>
      <svg
        viewBox={D.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', width: '100%', maxWidth: 460, margin: '0 auto', padding: '10px 0' }}
      >
        <rect x="0" y="0" width="100%" height="100%" fill="#e7eef6" />
        {(D.adjacent || []).map((g, i) => {
          if (g.kind === 'water-label') {
            return (
              <text key={'wl' + i} x={g.at[0]} y={g.at[1]}
                transform={g.rotate ? `rotate(${g.rotate} ${g.at[0]} ${g.at[1]})` : undefined}
                fontSize="9" fill="#7aa0c4" fontStyle="italic" textAnchor="middle"
                style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>{g.label}</text>
            )
          }
          return (
            <g key={'adj' + i}>
              <path d={g.d} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
              {g.label && (
                <text x={g.labelAt[0]} y={g.labelAt[1]} fontSize="10" fontWeight="700" fill="#94a3b8"
                  textAnchor="middle" style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>{g.label}</text>
              )}
            </g>
          )
        })}
        {D.baseLand && (
          <polygon points={D.baseLand} fill="#dbe4ea" stroke="#c9d4dc" strokeWidth="1.2" strokeLinejoin="round" />
        )}
        {D.areas.map(a => {
          const active = selectedArea === a.id
          const label = Array.isArray(a.label) ? a.label : [a.label]
          const fs = a.labelSize || 11
          return (
            <g key={a.id} onClick={() => onSelectArea(active ? null : a.id)} style={{ cursor: 'pointer' }}>
              <polygon points={a.points} fill={a.color} fillOpacity={active ? 1 : 0.9}
                stroke={active ? '#0f172a' : '#ffffff'} strokeWidth={active ? 3 : 1.4} strokeLinejoin="round" />
              {label.map((line, li) => (
                <text key={li} x={a.labelAt[0]} y={a.labelAt[1] + li * (fs + 1) - ((label.length - 1) * (fs + 1)) / 2}
                  fontSize={fs} fontWeight="800" fill="#33414d" textAnchor="middle" letterSpacing="0.02"
                  style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>{line}</text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ── BoroughAreaMap ─────────────────────────────────────────────────────────
// Pure SVG. No Leaflet, no tile fetches — the geometry above is the whole map.
// Empty areas (zero picks) render greyed and aren't tappable. The selected
// area gets a darker fill + outline + the count badge inverts colors.
//
// Props match the previous implementation so MoodScreen + EatScreen call sites
// don't need to change:
//   • borough         — 'manhattan' | 'brooklyn'
//   • countsByArea    — { manhattan: {areaId: n}, brooklyn: {areaId: n} }
//   • selectedArea    — areaId or null
//   • onSelectArea(id)— tap callback (id is null to clear)
//   • height          — max-height of the rendered SVG (default 460)
function BoroughAreaMap({ borough, countsByArea, selectedArea, onSelectArea, height = 460 }) {
  const data = MOOD_MAP_SVG[borough] || MOOD_MAP_SVG.manhattan

  return (
    <div style={{
      width: '100%',
      borderRadius: 14,
      overflow: 'hidden',
      background: 'var(--canvas)', // warm backdrop, matches the app theme
      border: '1px solid var(--gray-200)',
    }}>
      <svg
        viewBox={data.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{
          display: 'block',
          width: '100%',
          maxHeight: height,
          margin: '0 auto',
        }}
      >
        {/* Warm backdrop fills the viewBox (matches the page canvas). */}
        <rect x="0" y="0" width="100%" height="100%" fill="#FBF3EE" />

        {/* Adjacent landmasses + park + water labels */}
        {(data.adjacent || []).map((g, i) => {
          if (g.kind === 'water-label') {
            return (
              <text key={'wl' + i}
                x={g.at[0]} y={g.at[1]}
                transform={g.rotate ? `rotate(${g.rotate} ${g.at[0]} ${g.at[1]})` : undefined}
                fontSize="9" fill="#60a5fa" fontStyle="italic"
                textAnchor="middle"
                style={{ pointerEvents: 'none', fontFamily: 'inherit' }}
              >{g.label}</text>
            )
          }
          const fill = g.kind === 'park' ? '#bbf7d0' : '#f1f5f9'
          const stroke = g.kind === 'park' ? '#86efac' : '#e2e8f0'
          const textColor = g.kind === 'park' ? '#166534' : '#94a3b8'
          return (
            <g key={'adj' + i}>
              <path d={g.d} fill={fill} stroke={stroke} strokeWidth="1" />
              {g.label && (
                <text x={g.labelAt[0]} y={g.labelAt[1]}
                  fontSize={g.kind === 'park' ? '9' : '10'}
                  fontWeight="700"
                  fill={textColor}
                  textAnchor="middle"
                  style={{ pointerEvents: 'none', fontFamily: 'inherit' }}
                >{g.label}</text>
              )}
            </g>
          )
        })}

        {/* Base landmass — the rest of the borough (unmapped neighborhoods), so
            the colored areas read as part of a real borough, not islands. */}
        {data.baseLand && (
          <polygon points={data.baseLand} fill="#e2e8e2" stroke="#d3dcd4" strokeWidth="1.2" strokeLinejoin="round" />
        )}

        {/* Neighborhood polygons + labels — every area is explorable, no counts. */}
        {data.areas.map(a => {
          const isActive = selectedArea === a.id
          const labelFontSize = a.labelSize || 11
          return (
            <g
              key={a.id}
              onClick={() => onSelectArea?.(isActive ? null : a.id)}
              style={{ cursor: 'pointer' }}
            >
              <polygon
                points={a.points}
                fill={a.color}
                fillOpacity={isActive ? 1 : 0.9}
                stroke={isActive ? '#0f172a' : '#ffffff'}
                strokeWidth={isActive ? 3 : 1.5}
                strokeLinejoin="round"
              />
              <text
                x={a.labelAt[0]}
                y={a.labelAt[1]}
                fontSize={labelFontSize}
                fontWeight="800"
                fill="#ffffff"
                textAnchor="middle"
                letterSpacing="0.04em"
                style={{ pointerEvents: 'none', fontFamily: 'inherit' }}
              >
                {Array.isArray(a.label)
                  ? a.label.map((ln, i) => (
                      <tspan key={i} x={a.labelAt[0]} dy={i === 0 ? `${-(a.label.length - 1) * 0.55}em` : '1.1em'}>{ln}</tspan>
                    ))
                  : a.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ── BoroughReferenceMap ────────────────────────────────────────────────────
// A small real (OSM-tile) Leaflet map placed under the schematic SVG. Plots
// each pick as a colored dot at its actual lat/lng so first-time visitors can
// see where the neighborhoods sit relative to each other.
//
// When an area is selected in the schematic above:
//   • Pins inside that area pop (bigger, full opacity)
//   • Pins outside go faint (smaller, low opacity) — kept visible so the user
//     sees "there are 2 more nearby" rather than thinking the map cleared.
//   • The map pans/zooms to fit the selected area's pins
//
// Props:
//   • borough      — 'manhattan' | 'brooklyn'
//   • pins         — [{ id, lat, lng, name, areaId, color }]
//   • selectedArea — areaId | null
//   • height       — px (default 280)
function BoroughReferenceMap({ borough, pins, selectedArea, height = 280 }) {
  const containerRef = React.useRef(null)
  const mapRef       = React.useRef(null)
  const markersRef   = React.useRef([])
  const [ready, setReady] = React.useState(typeof window !== 'undefined' && !!window.L)

  // Load Leaflet (shared loader across MapScreen + this component).
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.L) { setReady(true); return }
    if (document.querySelector('script[data-leaflet]')) return
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    s.dataset.leaflet = '1'
    s.onload = () => setReady(true)
    document.head.appendChild(s)
  }, [])

  // Init / re-init the map when borough or readiness changes.
  React.useEffect(() => {
    if (!ready || !containerRef.current) return
    const L = window.L
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markersRef.current = [] }

    const view = borough === 'manhattan'
      ? { center: [40.778, -73.972], zoom: 12 }
      : { center: [40.680, -73.960], zoom: 11 }

    const map = L.map(containerRef.current, {
      center: view.center,
      zoom: view.zoom,
      zoomControl: false,
      // Attribution required by OSM tile usage policy — keep it on (compact).
      attributionControl: true,
      scrollWheelZoom: false,
      dragging: true,
      tap: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map)
    L.control.attribution({ prefix: false }).addTo(map)
    mapRef.current = map
    setTimeout(() => map.invalidateSize(), 50)

    return () => { map.remove(); mapRef.current = null; markersRef.current = [] }
  }, [borough, ready])

  // Sync pin markers + zoom when pins, area, or readiness changes.
  React.useEffect(() => {
    if (!ready) return
    const L = window.L
    const map = mapRef.current
    if (!L || !map) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const inAreaCoords = []
    pins.forEach(p => {
      const isInSelected = selectedArea && p.areaId === selectedArea
      const isDimmed     = selectedArea && !isInSelected
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: isInSelected ? 8 : 5,
        fillColor: p.color || '#1d4ed8',
        color: '#ffffff',
        weight: isInSelected ? 2 : 1.5,
        fillOpacity: isDimmed ? 0.25 : 0.95,
        opacity:     isDimmed ? 0.4  : 1,
      })
      marker.bindTooltip(p.name, { direction: 'top', offset: [0, -8], opacity: 0.95 })
      marker.addTo(map)
      markersRef.current.push(marker)
      if (isInSelected) inAreaCoords.push([p.lat, p.lng])
    })

    // Auto-fit: selected → its pins; no selection → fit all borough pins.
    const coordsToFit = selectedArea ? inAreaCoords : pins.map(p => [p.lat, p.lng])
    if (coordsToFit.length >= 2) {
      map.fitBounds(L.latLngBounds(coordsToFit), { padding: [28, 28], maxZoom: 15 })
    } else if (coordsToFit.length === 1) {
      map.setView(coordsToFit[0], 14)
    } else {
      // No pins at all — reset to the borough default view.
      const v = borough === 'manhattan'
        ? { center: [40.778, -73.972], zoom: 12 }
        : { center: [40.680, -73.960], zoom: 11 }
      map.setView(v.center, v.zoom)
    }
  }, [pins, selectedArea, ready, borough])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%', height,
        borderRadius: 14, overflow: 'hidden',
        background: 'var(--gray-100)',
        border: '1px solid var(--gray-200)',
      }}
    />
  )
}

// Color lookup helper: areaId → color from MOOD_MAP_SVG. Used by callers
// building `pins` arrays for <BoroughReferenceMap>.
function colorForArea(borough, areaId) {
  return MOOD_MAP_SVG[borough]?.areas.find(a => a.id === areaId)?.color || '#1d4ed8'
}

// Map the curated restaurant/bar DB cuisines and editorial venue domains onto
// mood ACTIVITIES, so mood results can fill from EVERY real source — not just a
// mood's own curated picks + the user's imports. Thin combos (e.g. UES · Drinks)
// then surface whatever real venues exist in the database.
const REST_CUISINE_ACT = { bar_tavern: 'drinks', steakhouse: 'eat', italian: 'eat', japanese: 'eat', korean: 'eat', pizza: 'eat', burger: 'eat', american: 'eat' }
const DOMAIN_ACT = { food: 'eat', jazz: 'live', classical_music: 'live', theater: 'live', hip_hop: 'live', visual_art: 'culture', architecture: 'culture', history: 'culture' }
// Parks / waterfront / open-air spaces belong to the "outdoors" activity, not
// "culture" — without this the outdoors column was empty even though we have them.
const OUTDOORS_VENUE_IDS = new Set(['central_park', 'high_line', 'bryant_park', 'washington_square_park', 'battery_park', 'brooklyn_bridge_arch'])
// Activity an editorial venue maps to (outdoors override wins over its domain).
const editorialActivity = (id, domain) => OUTDOORS_VENUE_IDS.has(id) ? 'outdoors' : DOMAIN_ACT[domain]

// Fast-food / quick-service chains we keep OUT of recommendations — the app is
// for notable spots, not chains. Matched on the venue name.
const FAST_FOOD_RE = /\b(mc\s?donald'?s|burger king|wendy'?s|kfc|popeyes|taco bell|subway|chipotle|five guys|sbarro|domino'?s|pizza hut|dunkin|chick[- ]?fil[- ]?a|white castle|wingstop|panda express|sweetgreen|chopt|pret a manger|shake shack|fast food)\b/i
const isFastFood = (name) => FAST_FOOD_RE.test(name || '')
// Normalize a venue name to its brand by dropping location qualifiers (" - Murray
// Hill", " (UWS)", trailing neighborhood words) so two listings of the same place
// collapse to one in the recommendation list.
const RECO_LOC_RE = /\b(nomad|murray hill|west village|east village|greenwich village|soho|noho|tribeca|chelsea|nolita|lower east side|upper east side|upper west side|ues|uws|fidi|financial district|midtown|harlem|williamsburg|greenpoint|bushwick|dumbo|park slope|prospect heights|crown heights|clinton hill|brooklyn|bklyn|queens|astoria|flushing|manhattan|nyc|new york)\b/g
function recoBaseName(n) {
  let s = (n || '').toLowerCase().trim()
  s = s.replace(/\s*\(.*$/, '')          // drop " (UWS)"
  s = s.replace(/\s+[-–—]\s+.*$/, '')    // drop " - Murray Hill" / " – NoMad"
  s = s.replace(/&/g, 'and').replace(/[^a-z0-9 ]+/g, ' ')
  s = s.replace(RECO_LOC_RE, ' ').replace(/\s+/g, ' ').trim()
  s = RECO_ALIASES[s] || s
  return s || (n || '').toLowerCase().trim()
}
// Same-place aliases across datasets: the curated guide says "The Met" while the
// places DB says "The Metropolitan Museum of Art" — different names, one museum.
// Keys/values are post-normalization (lowercase, & → and, punctuation stripped).
const RECO_ALIASES = {
  'the metropolitan museum of art': 'the met',
  'metropolitan museum of art': 'the met',
  'the museum of modern art': 'moma',
  'museum of modern art': 'moma',
  'grand central terminal': 'grand central',
  'the solomon r guggenheim museum': 'guggenheim',
  'solomon r guggenheim museum': 'guggenheim',
  'whitney museum of american art': 'whitney',
  'the whitney': 'whitney',
  'american museum of natural history': 'natural history museum',
  'the cloisters': 'met cloisters',
  'the met cloisters': 'met cloisters',
}

// Category → fallback emoji + tile color for the no-photo state, so a card
// without a photo reads as an intentional colored tile (icon + initial) instead
// of an empty gray/blue box.
const PLACE_CAT_EMOJI = { food: '🍽️', coffee: '☕', drinks: '🍷', music: '🎵', art: '🎨', culture: '🎭', outdoors: '🌳', shopping: '🛍️', place: '📍' }
const PLACE_CAT_COLOR = { food: '#C1876B', coffee: '#C89A6A', drinks: '#AD8AA2', music: '#A3408C', art: '#8AA4C0', culture: '#8AA4C0', outdoors: '#6FAE8E', shopping: '#C89A6A', place: '#8AA4C0' }
const placeInitial = (name) => ((name || '').trim()[0] || '?').toUpperCase()
// Pull just today's open hours out of the "Monday: 9–5 | Tuesday: …" string.
function todayHoursLine(hours) {
  if (!hours || typeof hours !== 'string') return ''
  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
  const parts = hours.split('|').map(s => s.trim()).filter(Boolean)
  const match = parts.find(p => p.toLowerCase().startsWith(day.toLowerCase()))
  const line = (match || '').replace(/^[A-Za-z]+:\s*/, '')
  return line ? `${day}: ${line}` : ''
}

// Is the place open right now? Parses the "Monday: 8:00 AM – 11:00 PM | …" hours
// string for today, handling "Closed", "Open 24 hours", and ranges that cross
// midnight (e.g. 5pm–2am). Returns { state: 'open'|'closed'|'unknown', label, late }.
const _fmtClock = (mins) => {
  const m = ((mins % 1440) + 1440) % 1440
  const h = Math.floor(m / 60), mm = m % 60
  const ap = h >= 12 ? 'pm' : 'am', h12 = (h % 12) || 12
  return mm ? `${h12}:${String(mm).padStart(2, '0')}${ap}` : `${h12}${ap}`
}
function openStatusNow(hoursStr) {
  if (!hoursStr || typeof hoursStr !== 'string') return { state: 'unknown' }
  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
  const part = hoursStr.split('|').map(s => s.trim()).find(p => p.toLowerCase().startsWith(day.toLowerCase()))
  if (!part) return { state: 'unknown' }
  const body = part.replace(/^[A-Za-z]+:\s*/, '').trim()
  if (/closed/i.test(body)) return { state: 'closed', label: 'Closed today' }
  const now = new Date(); const nowM = now.getHours() * 60 + now.getMinutes()
  if (/24\s*hours|open 24/i.test(body)) return { state: 'open', label: 'Open 24 hours', late: true }
  // A day can hold several ranges (lunch + dinner): "12:00 – 3:00 PM, 5:00 – 10:00 PM".
  // The OPEN time often omits AM/PM ("12:00 – 10:00 PM") — Google drops it when it
  // matches the close meridiem, so we default a missing open meridiem to the close's.
  const to24 = (h, mm, ap) => { let hh = parseInt(h, 10) % 12; if (/pm/i.test(ap)) hh += 12; return hh * 60 + parseInt(mm || '0', 10) }
  let crosses = false, closeAt = null, parsedAny = false
  for (const seg of body.split(',')) {
    const m = seg.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*[–\-—]\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i)
    if (!m) continue
    parsedAny = true
    const openAp = m[3] || m[6]                 // missing open meridiem = close meridiem
    const openM = to24(m[1], m[2], openAp)
    let closeM = to24(m[4], m[5], m[6])
    const segCrosses = closeM <= openM          // closes after midnight
    if (segCrosses) closeM += 1440
    const nowAdj = nowM < openM ? nowM + 1440 : nowM
    if (nowAdj >= openM && nowAdj < closeM) { crosses = segCrosses; closeAt = closeM; break }
  }
  if (!parsedAny) return { state: 'unknown' }
  if (closeAt == null) return { state: 'closed', label: 'Closed now' }
  const late = (closeAt % 1440) === 0 || closeAt % 1440 >= 22 * 60 || crosses
  return { state: 'open', label: late ? `Open until ${_fmtClock(closeAt)}` : `Open · closes ${_fmtClock(closeAt)}`, late }
}

// "View on Maps" that lets the user pick their maps app. A web app can't invoke
// iOS's native maps-app picker, so tapping the button slides up our own bottom
// sheet with Apple Maps / Google Maps (like a native action sheet). `googleUrl`
// is the precise Google link when we have one; otherwise both are built from the
// place name + area as a search query.
function MapsButton({ name, area, googleUrl, btnStyle = {} }) {
  const [open, setOpen] = React.useState(false)
  const q = encodeURIComponent([name, area].filter(Boolean).join(' '))
  const appleUrl = 'https://maps.apple.com/?q=' + q
  const gUrl = googleUrl || ('https://www.google.com/maps/search/?api=1&query=' + q)
  const go = (u) => { setOpen(false); try { window.open(u, '_blank', 'noopener') } catch (e) {} }
  const trigger = { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, padding: '7px 8px', borderRadius: 8, background: 'var(--gray-100)', color: 'var(--gray-700)', cursor: 'pointer', border: 'none', fontFamily: 'inherit', ...btnStyle }
  const choice = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '15px', borderRadius: 14, background: 'var(--gray-100)', color: 'var(--ink)', fontWeight: 700, fontSize: 16, cursor: 'pointer', border: 'none', fontFamily: 'inherit', marginBottom: 10 }
  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setOpen(true) }} style={trigger}>{t('View on Maps')}</button>
      <BottomSheet open={open} onClose={() => setOpen(false)} fit>
        <div style={{ padding: '2px 20px calc(28px + env(safe-area-inset-bottom, 0px))' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray-500)', textAlign: 'center', marginBottom: 16 }}>
            Open {name || 'this place'} in
          </div>
          <button onClick={() => go(appleUrl)} style={choice}>🗺️ Apple Maps</button>
          <button onClick={() => go(gUrl)} style={choice}>📍 Google Maps</button>
          <button onClick={() => setOpen(false)} style={{ ...choice, background: 'transparent', color: 'var(--gray-500)', fontWeight: 600, marginBottom: 0 }}>Cancel</button>
        </div>
      </BottomSheet>
    </>
  )
}

// Lightweight in-app sheet for places without a full editorial page (imports,
// the restaurant/bar DB, sights). Surfaces every objective field we have — photo,
// rating, price, cuisine, neighborhood, description, address, today's hours,
// website — so the card isn't a blank box. The Google Maps jump is a button here.
// Friendly labels for the internal cuisine ids (e.g. "bar_tavern" → "Bar").
const CUISINE_LABELS = { bar_tavern: 'Bar', steakhouse: 'Steak' }
const prettyCuisine = (c) => CUISINE_LABELS[c] || String(c || '').replace(/_/g, ' ').replace(/\b\w/g, m => m.toUpperCase())

function MoodPlaceSheet({ place = {}, onFull = null, savedItems = {}, toggleSave = () => {}, userVenues = {}, onAddToTrip = () => null }) {
  const g = useGooglePhoto(place)
  const [imgFailed, setImgFailed] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  // "Add to My Trip" wiring. Imports already live in userVenues, so we just
  // toggle their `user_venue` save (which flows into the itinerary). Everything
  // else (restaurant DB rows, curated names, sights) has no persistent record,
  // so we create a user venue from `place.addData`. A name match guards against
  // creating a duplicate if the sheet is reopened after adding.
  const existingId = place.existingId || null
  const isSavedExisting = existingId ? !!savedItems[`user_venue:${existingId}`] : false
  const byName = !existingId && place.name
    ? Object.values(userVenues || {}).some(v => (v.name || '').toLowerCase().trim() === place.name.toLowerCase().trim())
    : false
  const inTrip = isSavedExisting || added || byName
  const canAdd = !!existingId || !!place.addData
  const handleAddToTrip = () => {
    if (existingId) { toggleSave('user_venue', existingId); return }
    if (place.addData && !inTrip) { onAddToTrip(place.addData); setAdded(true) }
  }
  const imageSrc = place.image || g?.photoUrl || null
  const image = imageSrc && !imgFailed ? imageSrc : null
  const neighborhood = (place.neighborhood && place.neighborhood !== 'Saved from Google Maps') ? place.neighborhood : (place.area || '')
  const cuisineArr = Array.isArray(place.cuisine) ? place.cuisine
    : Array.isArray(place.cuisines) ? place.cuisines
    : (place.cuisine ? [place.cuisine] : [])
  const cuisine = cuisineArr.filter(Boolean).map(prettyCuisine).join(', ')
  const metaTop = [place.price, cuisine, neighborhood].filter(Boolean).join(' · ')
  const desc = (place.description || place.googleSummary || place.blurb || '').trim()
  const hrs = todayHoursLine(place.hours)
  const openSt = openStatusNow(place.hours)
  // Disambiguate the Maps search with the address (or neighborhood) so an
  // ambiguous name like "Mama Fox" can't resolve to the wrong business.
  const mapQuery = [place.name, place.address || place.neighborhood].filter(Boolean).join(' ')
  const url = place.sourceUrl || place.reservationUrl || place.mapsUrl || (place.name ? mapsUrl(mapQuery) : '')
  const website = place.website || ''
  let host = ''
  try { host = website ? new URL(website).hostname.replace(/^www\./, '') : '' } catch (e) { host = website }
  const catEmoji = PLACE_CAT_EMOJI[place.category] || '📍'
  const tileColor = PLACE_CAT_COLOR[place.category] || '#8AA4C0'
  const open = (u) => { if (u) { try { window.open(u, '_blank', 'noopener') } catch (e) {} } }
  const Row = ({ icon, children }) => children ? (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8, fontSize: 13.5, color: 'var(--ink-2)' }}>
      <span style={{ flexShrink: 0 }} aria-hidden="true">{icon}</span><span style={{ lineHeight: 1.45, wordBreak: 'break-word' }}>{children}</span>
    </div>
  ) : null
  const btn = (primary) => ({ width: '100%', border: primary ? 'none' : '1.5px solid var(--gray-200)', borderRadius: 999, padding: '13px', background: primary ? 'var(--accent)' : 'var(--white)', color: primary ? '#fff' : 'var(--ink)', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', marginTop: 10 })
  return (
    <div style={{ padding: '0 20px calc(40px + env(safe-area-inset-bottom, 0px))' }}>
      <div style={{ height: 150, borderRadius: 18, overflow: 'hidden', marginBottom: 16, background: image ? 'var(--gray-100)' : tileColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {image ? <img src={image} alt="" onError={() => setImgFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#fff' }}>
            <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{placeInitial(place.name)}</span>
            <span style={{ fontSize: 18 }} aria-hidden="true">{catEmoji}</span>
          </div>
        )}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.22, color: 'var(--ink)', margin: '0 0 6px' }}>{place.name}</h2>
      {(place.rating || metaTop) ? (
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12 }}>
          {place.rating ? <span style={{ color: '#854F0B', fontWeight: 700 }}>★ {place.rating}</span> : null}{place.rating && metaTop ? ' · ' : ''}{metaTop}
        </div>
      ) : null}
      {openSt.state !== 'unknown' ? (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 12,
          fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
          background: openSt.state === 'open' ? '#e6f4ea' : 'var(--gray-100)',
          color: openSt.state === 'open' ? '#1b7a3d' : 'var(--gray-500)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: openSt.state === 'open' ? '#21a049' : 'var(--gray-400)' }} />
          {openSt.label}
        </div>
      ) : null}
      {desc ? <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, margin: '0 0 14px' }}>{clipWords(desc, 280)}</p> : null}
      {(place.address || hrs || host) ? (
        <div style={{ marginBottom: 4 }}>
          <Row icon="📍">{place.address}</Row>
          <Row icon="🕐">{hrs}</Row>
          {host ? <Row icon="🌐"><a href={website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: 'var(--accent-text)', fontWeight: 600 }}>{host}</a></Row> : null}
        </div>
      ) : null}
      {canAdd && (
        <button onClick={handleAddToTrip} style={btn(!inTrip)}>
          {inTrip ? '✓ In My Trip' : '+ Add to My Trip'}
        </button>
      )}
      {onFull && <button onClick={onFull} style={btn(false)}>Full details →</button>}
      {url && <button onClick={() => open(url)} style={btn(!canAdd && !onFull)}>📍 Open in Google Maps</button>}
    </div>
  )
}

// ── MoodFlowScreen — guided "Unhurried" flow ────────────────────────────────
// Replaces the old all-at-once MoodScreen with one decision per step:
//   place (neighborhood)  →  activity (the mood's own groups)  →  top 5.
// Each mood's groups already ARE the activity set (Dinner spots, Live jazz,
// Romantic walks…), curated per mood — so no activity classifier is needed.
function MoodFlowScreen({ moodId, push, savedItems = {}, toggleSave = () => {}, userVenues = {}, onAddPlace = () => {}, onAddToTrip = () => null, initialActivity = null }) {
  const mood = moodById[moodId]
  // Activity-first entry (from the "What do you feel like?" cards): the activity
  // is already chosen, so the flow is just place → results — we skip the
  // activity-picker step. afterPlace/backFromResults route around it.
  const afterPlace = initialActivity ? 'results' : 'activity'
  const backFromResults = initialActivity ? 'place' : 'activity'
  const [step, setStep]           = React.useState('place')   // 'place' | 'activity' | 'results'
  const [openNowOnly, setOpenNowOnly] = React.useState(false)   // results filter: hide places known-closed now
  const [mapBorough, setMapBorough] = React.useState('manhattan')
  const [place, setPlace]         = React.useState(null)      // null | {scope:'anywhere'} | {scope:'area',borough,areaId,label}
  const [activityId, setActivityId] = React.useState(initialActivity || null)
  const [geoStatus, setGeoStatus] = React.useState('idle')   // idle | locating | denied
  const [geoNote, setGeoNote]     = React.useState('')
  const [userLoc, setUserLoc]     = React.useState(null)     // {lat,lng} from "Near me" → sorts picks nearest-first
  const [moodSheet, setMoodSheet] = React.useState(null)     // tapped pick → in-app bottom sheet
  if (!mood) return <div style={{ padding: 24, color: 'var(--ink-2)' }}>Mood not found.</div>

  const resolvePick = (p) => {
    if (p?.type === 'venue') { const v = venues[p.id]; return v ? { kind: 'venue', id: p.id, venue: v, where: classifyPickToArea(p) } : null }
    if (p?.type === 'sight') { const s = ALL_SIGHTS[p.id]; return s ? { kind: 'sight', id: p.id, sight: s, where: classifyPickToArea(p) } : null }
    return null
  }
  const group = activityId ? (mood.groups.find(g => g.activity === activityId) || null) : null
  const allItems = group ? group.picks.map(resolvePick).filter(Boolean) : []
  const filteredItems = (place && place.scope === 'area')
    ? allItems.filter(it => it.where && it.where.borough === place.borough && it.where.areaId === place.areaId)
    : allItems
  const results = filteredItems.slice(0, 5)
  const placeLabel = !place ? '' : (place.scope === 'anywhere' ? 'Anywhere' : place.label)

  // ── Your picks for this activity, location-aware. Custom (saved) picks use
  // their hand-assigned area; database picks use real coordinates — so nothing
  // ever surfaces in the wrong neighborhood. ──
  const inPlace = (it) => !place || place.scope !== 'area'
    || (it.kind === 'custom'
        ? (it.borough === place.borough && it.area === place.areaId)
        : (it.where && it.where.borough === place.borough && it.where.areaId === place.areaId))
  const userItemsAll = activityId ? userPicks.filter(u => u.activity === activityId).map(u => {
    if (u.venueId) { const v = venues[u.venueId]; return v ? { kind: 'venue', id: u.venueId, venue: v, where: classifyPickToArea({ type: 'venue', id: u.venueId }), saved: false } : null }
    return { kind: 'custom', id: 'up_' + (u.name || '').replace(/[^a-z0-9]+/gi, '_'), name: u.name, note: u.note, borough: u.borough, area: u.area, saved: true }
  }).filter(Boolean) : []
  const userItems = userItemsAll.filter(inPlace).slice(0, 5)
  const activityMeta = activityId ? ACTIVITIES[activityId] : null
  const actLabel = (group && group.label) || (activityMeta && activityMeta.label) || ''
  const actEmoji = (group && group.emoji) || (activityMeta && activityMeta.emoji) || ''
  // Activities offered for this mood. Some moods exclude ones that don't fit
  // (e.g. Rainy day hides Outdoors); falls back to all six.
  const shownActivities = ACTIVITY_ORDER.filter(aid => !((mood && mood.excludeActivities) || []).includes(aid))

  // ── Recommendations — every one renders through VenueTapCard (the single
  // card style), so My Picks, NYC Stoop picks, sights and imports all match. ──
  const CAT_TO_ACT = { food: 'eat', eat: 'eat', coffee: 'coffee', drinks: 'drinks', music: 'live', live: 'live', art: 'culture', culture: 'culture', outdoors: 'outdoors' }
  const COLOR_BY_ACT = { eat: '#c1876b', drinks: '#ad8aa2', coffee: '#c89a6a', outdoors: '#6fae8e', culture: '#8aa4c0', live: '#a3408c' }
  const actColor = COLOR_BY_ACT[activityId] || '#8aa4c0'
  const isImportedV = (v) => (typeof v?.id === 'string' && v.id.startsWith('seed_')) || (((v?.source || '') + '').startsWith('google_'))
  const placeArea = (v) => {
    if (typeof v.lat === 'number' && typeof v.lng === 'number') return classifyLatLngToArea(v.lat, v.lng)
    return neighborhoodToArea(v.neighborhood)
  }
  const matchesArea = (v) => {
    if (!(place && place.scope === 'area')) return true
    const w = placeArea(v)
    return !!(w && w.borough === place.borough && w.areaId === place.areaId)
  }
  const inAreaW = (w) => !(place && place.scope === 'area') || !!(w && w.borough === place.borough && w.areaId === place.areaId)
  // How many picks an activity ACTUALLY has for the selected place — counted from
  // the same sources the results screen pools (curated + user + imports + the
  // restaurant DB + editorial-by-domain), deduped by name. Drives the activity-tile
  // count so it can't promise "5" and then show 1.
  const availableCount = (aid) => {
    const names = new Set()
    // Skip fast-food chains and key on the brand base name so the tile count
    // matches the deduped, fast-food-filtered list the results screen renders.
    const add = (nm) => { if (isFastFood(nm)) return; const k = recoBaseName(nm); if (k) names.add(k) }
    const g = mood.groups.find(x => x.activity === aid)
    if (g) g.picks.forEach(p => {
      if (!inAreaW(classifyPickToArea(p))) return
      if (p.type === 'venue' && venues[p.id]) add(venues[p.id].name)
      else if (p.type === 'sight' && ALL_SIGHTS[p.id]) add(ALL_SIGHTS[p.id].name)
    })
    userPicks.filter(u => u.activity === aid).forEach(u => {
      if (u.venueId && venues[u.venueId]) { if (inAreaW(classifyPickToArea({ type: 'venue', id: u.venueId }))) add(venues[u.venueId].name) }
      else if (!(place && place.scope === 'area') || (u.borough === place.borough && u.area === place.areaId)) add(u.name)
    })
    // imports capped at the top 5 by Google rating (matches the displayed list)
    Object.values(userVenues || {}).filter(v => CAT_TO_ACT[v.category] === aid && isImportedV(v) && matchesArea(v))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5).forEach(v => add(v.name))
    // the viewer's own (non-imported) saved places are kept in full
    Object.values(userVenues || {}).forEach(v => { if (CAT_TO_ACT[v.category] === aid && !isImportedV(v) && matchesArea(v)) add(v.name) })
    RESTAURANT_DATA.forEach(r => {
      if (!(r.cuisines || []).some(c => REST_CUISINE_ACT[c] === aid)) return
      const c = RESTAURANT_COORDS[r.id]
      if (!inAreaW(c ? classifyLatLngToArea(c[0], c[1]) : null)) return
      add(r.name)
    })
    Object.keys(venueCoords).forEach(id => {
      const info = venueCoords[id]
      if (!info || editorialActivity(id, info.domain) !== aid || !venues[id]) return
      if (!inAreaW(classifyLatLngToArea(info.lat, info.lng))) return
      add(venues[id].name)
    })
    return names.size
  }
  const byNewest = (arr) => arr.slice().sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))
  const cardForUserVenue = (v) => (
    <UserVenueCard key={v.id} venue={v}
      cardVenue={{ id: v.id, name: v.name, neighborhood: (v.neighborhood && v.neighborhood !== 'Saved from Google Maps') ? v.neighborhood : 'Saved spot', character: v.blurb || '', color: COLOR_BY_ACT[CAT_TO_ACT[v.category]] || actColor }}
      onPress={() => setMoodSheet({ kind: 'place', place: { ...v, existingId: v.id } })} />
  )
  // Single compact row style for EVERY mood pick (curated, import, restaurant,
  // editorial) so the results list never mixes big hero cards with small rows.
  const compactCard = (key, fields, onPress) => (
    <UserVenueCard key={key}
      venue={{ id: key, name: fields.name, neighborhood: fields.neighborhood, description: fields.desc || '', image: fields.image || null, rating: fields.rating, price: fields.price }}
      cardVenue={{ id: key, name: fields.name, neighborhood: fields.neighborhood, character: fields.desc || '' }}
      onPress={onPress} />
  )
  const cardForItem = (it) => {
    if (it.kind === 'venue') return compactCard('v' + it.id, { name: it.venue.name, neighborhood: it.venue.neighborhood, desc: it.venue.character || '', image: venueImages[it.id] || null }, () => setMoodSheet({ kind: 'venue', id: it.id }))
    if (it.kind === 'sight') return compactCard('s' + it.id, { name: it.sight.name, neighborhood: [it.sight.neighborhood, it.sight.subArea].filter(Boolean).join(' · '), desc: it.sight.longDesc || '', image: venueImages[it.id] || null }, () => setMoodSheet({ kind: 'place', place: { name: it.sight.name, image: venueImages[it.id] || null, neighborhood: [it.sight.neighborhood, it.sight.subArea].filter(Boolean).join(' · '), description: it.sight.longDesc || '', category: 'culture', addData: { name: it.sight.name, neighborhood: [it.sight.neighborhood, it.sight.subArea].filter(Boolean).join(' · '), category: 'culture', blurb: it.sight.longDesc || '', lat: it.sight.lat, lng: it.sight.lng } }, full: { screen: 'sight', sightId: it.id } }))
    return compactCard('c' + it.id, { name: it.name, neighborhood: it.note || '' }, () => setMoodSheet({ kind: 'place', place: { name: it.name, neighborhood: it.note || '', category: 'place', addData: { name: it.name, neighborhood: it.note || '', category: 'place' } } }))
  }
  // Curated restaurant/bar DB entry (not in `venues`) — opens an in-app sheet with a Google Maps button.
  const cardForRestaurant = (r) => compactCard('r' + r.id,
    { name: r.name, neighborhood: r.neighborhood || r.area || '', desc: r.description || '', price: r.price },
    () => setMoodSheet({ kind: 'place', place: { name: r.name, neighborhood: r.neighborhood || r.area || '', description: r.description || '', price: r.price, cuisines: r.cuisines, website: r.reservationUrl || '', mapsUrl: r.mapsUrl, sourceUrl: r.mapsUrl, category: 'food', rating: r.rating, addData: { name: r.name, neighborhood: r.neighborhood || r.area || '', category: 'food', blurb: r.description || '', price: r.price, cuisines: r.cuisines, website: r.reservationUrl || '', sourceUrl: r.mapsUrl, rating: r.rating } } }))

  // My Picks — ONLY the viewer's hand-added places (the 62 Google imports are
  // NYC Stoop picks, not My Picks). Newest first; never cut off.
  // When "Open now" is on, drop places we KNOW are closed right now (places with
  // no parseable hours — editorial/curated — are kept; we can't disprove them).
  const openOk = (v) => !openNowOnly || openStatusNow(v && v.hours).state !== 'closed'
  const myPicks = byNewest(Object.values(userVenues || {}).filter(v => CAT_TO_ACT[v.category] === activityId && !isImportedV(v) && matchesArea(v) && openOk(v) && !isFastFood(v.name))).slice(0, 5)
  const myPicksRendered = myPicks.map(cardForUserVenue)

  // NYC Stoop picks — filled from EVERY real source so each (area, activity)
  // shows as many options as the database allows. Order of preference:
  //   1) the mood's curated picks for this activity/area
  //   2) the viewer's imported places (the 432 list)
  //   3) the curated restaurant / bar database (coords → area)
  //   4) editorial venues by domain (museums, jazz rooms, theaters…) in the area
  // All deduped by name and capped. Genuinely empty combos stay empty — add the
  // missing venues to the database later and they'll appear automatically.
  const stoopSeen = new Set()
  const stoopItems = [...userItems.filter(it => it.kind === 'venue'), ...results].filter(it => {
    if (stoopSeen.has(it.id)) return false
    stoopSeen.add(it.id); return true
  })
  const stoopHead = stoopItems.slice(0, 6)

  const inSelArea = (lat, lng) => {
    if (!(place && place.scope === 'area')) return true
    const w = classifyLatLngToArea(lat, lng)
    return !!(w && w.borough === place.borough && w.areaId === place.areaId)
  }
  const restPool = activityId ? RESTAURANT_DATA.filter(r => {
    if (isFastFood(r.name)) return false
    const acts = (r.cuisines || []).map(c => REST_CUISINE_ACT[c]).filter(Boolean)
    if (!acts.includes(activityId)) return false
    const c = RESTAURANT_COORDS[r.id]
    return c ? inSelArea(c[0], c[1]) : (place?.scope !== 'area')
  }) : []
  const editorialPool = activityId ? Object.keys(venueCoords).filter(id => {
    const info = venueCoords[id]
    if (!info || editorialActivity(id, info.domain) !== activityId || !venues[id]) return false
    return inSelArea(info.lat, info.lng)
  }) : []
  // Imported recommendations: keep only the 5 highest Google-rated in this area+
  // activity (unrated sink to the bottom). Editorial/curated picks are kept
  // separately as the leads — this cap is imports-only.
  const byRating = (arr) => arr.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0))
  const importPool = activityId
    ? byRating(Object.values(userVenues || {}).filter(v => CAT_TO_ACT[v.category] === activityId && isImportedV(v) && matchesArea(v) && openOk(v) && !isFastFood(v.name))).slice(0, 5)
    : []

  const TARGET = 6
  // ── "Near me" proximity sort ──────────────────────────────────────────────
  // When the user located themselves (userLoc set), every pool is ordered
  // nearest-first so a Williamsburg local sees their block before a canonical
  // Manhattan landmark. Without a location we keep the editorial order, so this
  // only ever kicks in on explicit opt-in. Items with no coords sink to the end.
  const distFromUser = (c) => (userLoc && c && c.lat != null && c.lng != null) ? distanceMiles(userLoc, c) : Infinity
  const sortNear = (arr, getC) => userLoc ? arr.slice().sort((a, b) => distFromUser(getC(a)) - distFromUser(getC(b))) : arr
  const itemCoords = (it) => it.venue ? venueCoords[it.id] : (it.sight ? { lat: it.sight.lat, lng: it.sight.lng } : null)
  const uvCoords   = (v) => (typeof v.lat === 'number' && typeof v.lng === 'number') ? { lat: v.lat, lng: v.lng } : null
  const restCoords = (r) => { const c = RESTAURANT_COORDS[r.id]; return c ? { lat: c[0], lng: c[1] } : null }
  const edCoords   = (id) => venueCoords[id]
  // Dedup keys on the brand base name (location qualifiers stripped) so e.g.
  // "Hole In The Wall" and "Hole In The Wall - Murray Hill" show only once.
  const shownNames = new Set(myPicks.map(v => recoBaseName(v.name)))
  const stoopRendered = []
  const addCard = (name, node, gated) => {
    if (gated && stoopRendered.length >= TARGET) return
    const k = recoBaseName(name)
    if (k && shownNames.has(k)) return
    if (k) shownNames.add(k)
    stoopRendered.push(node)
  }
  sortNear(stoopHead, itemCoords).forEach(it => addCard(it.venue ? it.venue.name : it.sight ? it.sight.name : it.name, cardForItem(it), false))
  sortNear(importPool, uvCoords).forEach(v => addCard(v.name, cardForUserVenue(v), true))
  sortNear(restPool, restCoords).forEach(r => addCard(r.name, cardForRestaurant(r), true))
  sortNear(editorialPool, edCoords).forEach(id => addCard(venues[id].name, compactCard('ep' + id, { name: venues[id].name, neighborhood: venues[id].neighborhood, desc: venues[id].character || '', image: venueImages[id] || null }, () => setMoodSheet({ kind: 'venue', id })), true))

  const Dots = ({ n }) => (
    <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
      {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: 999, background: i < n ? 'var(--accent)' : '#d4dde6' }} />)}
    </div>
  )
  const Chip = ({ text, tint, color }) => (
    <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: tint, color }}>{text}</span>
  )
  const Back = ({ onClick }) => (
    <button onClick={onClick} aria-label="Back" style={{ width: 32, height: 32, borderRadius: 999, border: 'none', background: 'var(--gray-100)', color: 'var(--ink-2)', cursor: 'pointer', fontSize: 19, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>&#8249;</button>
  )
  const heading = { fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)' }

  // "Near me" — browser geolocation → our area. Outside Manhattan/Brooklyn falls
  // back to "Anywhere" with a note; denial disables the button.
  const handleNearMe = async () => {
    if (geoStatus === 'denied' || geoStatus === 'locating') return
    setGeoStatus('locating')
    try {
      const { lat, lng } = await getUserLocation()
      setUserLoc({ lat, lng })   // keep precise point so picks sort nearest-first
      const w = classifyLatLngToArea(lat, lng)
      setGeoStatus('idle')
      if (w) {
        const lbl = (MOOD_MAP_AREAS[w.borough] || []).find(a => a.id === w.areaId)?.label || w.areaId
        setMapBorough(w.borough); setGeoNote('')
        setPlace({ scope: 'area', borough: w.borough, areaId: w.areaId, label: lbl })
      } else {
        setGeoNote("You're outside Manhattan & Brooklyn — showing everywhere.")
        setPlace({ scope: 'anywhere' })
      }
      setStep(afterPlace)
    } catch (e) { setGeoStatus('denied') }
  }

  // Hero identity — same visual system as the Eat screen. Activity-first
  // entries wear their activity's scene + editorial line; the curated moods
  // wear their collection art with the mood's own blurb as the body.
  const heroCopy = initialActivity
    ? (FLOW_HERO_COPY[initialActivity] || { title: actLabel, body: '' })
    : { title: MOOD_HERO_TITLES[moodId] || mood.label, body: mood.blurb || '' }
  const heroArt = initialActivity
    ? <ActivityCoverArt activityId={initialActivity} />
    : <MoodCoverArt moodId={moodId} />
  const heroEyebrow = initialActivity ? actLabel : mood.label

  return (
    <div style={{ paddingBottom: 'calc(104px + env(safe-area-inset-bottom, 0px))' }}>
      <FlowHero art={heroArt} eyebrow={heroEyebrow} title={heroCopy.title} body={heroCopy.body} compact />
      <div style={{ padding: '10px 16px 0' }}>
      {step === 'place' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Dots n={initialActivity ? 2 : 1} />
          </div>
          <h2 style={{ ...heading, margin: '4px 0' }}>Where are you headed?</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 14 }}>Pick a neighborhood, or let us roam the whole city.</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
            <button onClick={handleNearMe} disabled={geoStatus === 'denied'} style={{ flex: 1, border: 'none', borderRadius: 999, padding: '13px', background: geoStatus === 'denied' ? 'var(--gray-100)' : 'var(--accent)', color: geoStatus === 'denied' ? 'var(--gray-400)' : '#fff', fontWeight: 700, fontSize: 13.5, cursor: geoStatus === 'denied' ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: geoStatus === 'denied' ? 'none' : 'var(--shadow-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>📍 {geoStatus === 'locating' ? 'Locating…' : geoStatus === 'denied' ? 'Location off' : 'Near me'}</button>
            <button onClick={() => { setPlace({ scope: 'anywhere' }); setStep(afterPlace) }} style={{ flex: 1, border: '1.5px solid var(--gray-200)', borderRadius: 999, padding: '13px', background: 'var(--white)', color: 'var(--ink)', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Anywhere</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', marginBottom: 16, lineHeight: 1.4 }}>{geoStatus === 'denied' ? 'Location is off — turn it on in your browser to use Near me.' : 'We use your location only to find spots nearby — you can say no.'}</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <div style={{ display: 'inline-flex', background: 'var(--gray-100)', borderRadius: 999, padding: 3 }}>
              {['manhattan', 'brooklyn'].map(b => (
                <button key={b} onClick={() => setMapBorough(b)} style={{ border: 'none', cursor: 'pointer', padding: '6px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit', textTransform: 'capitalize', background: mapBorough === b ? 'var(--white)' : 'transparent', color: mapBorough === b ? 'var(--gray-900)' : 'var(--gray-500)', boxShadow: mapBorough === b ? '0 1px 2px rgba(0,0,0,0.08)' : 'none' }}>{b}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--gray-400)', textAlign: 'center', marginBottom: 8 }}>TAP A NEIGHBORHOOD</div>
          <BoroughAreaMap
            borough={mapBorough}
            countsByArea={{}}
            selectedArea={null}
            onSelectArea={(id) => { if (!id) return; const lbl = (MOOD_MAP_AREAS[mapBorough] || []).find(a => a.id === id)?.label || id; setPlace({ scope: 'area', borough: mapBorough, areaId: id, label: lbl }); setStep(afterPlace) }}
            height={520}
          />
        </>
      )}

      {step === 'activity' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Back onClick={() => setStep('place')} />
            <Dots n={2} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {/* Mood chip retired — the hero above already carries the identity. */}
            <Chip text={`📍 ${placeLabel}`} tint={'#d2e6d9'} color={'#2f5d44'} />
          </div>
          {geoNote && <div style={{ fontSize: 11.5, color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '6px 10px', marginBottom: 10 }}>{geoNote}</div>}
          <h2 style={{ ...heading, margin: '4px 0 14px' }}>What sounds good?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {shownActivities.map(aid => {
              const g = mood.groups.find(x => x.activity === aid)
              const meta = ACTIVITIES[aid]
              const n = availableCount(aid)
              const ready = n > 0
              return (
                <button
                  key={aid}
                  disabled={!ready}
                  onClick={ready ? () => { setActivityId(aid); setStep('results') } : undefined}
                  style={{
                    border: '1px solid var(--gray-200)', borderRadius: 18, padding: '16px 12px',
                    background: 'var(--white)', cursor: ready ? 'pointer' : 'default', textAlign: 'left',
                    fontFamily: 'inherit', boxShadow: ready ? '0 4px 14px rgba(29,39,51,0.05)' : 'none',
                    opacity: ready ? 1 : 0.5,
                  }}
                >
                  <div style={{ fontSize: 26, lineHeight: 1, marginBottom: 8 }}>{(g && g.emoji) || meta.emoji}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2 }}>{(g && g.label) || meta.label}</div>
                  {!ready && <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>Coming soon</div>}
                </button>
              )
            })}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', textAlign: 'center', marginTop: 14 }}>{shownActivities.length} ways to spend the day &mdash; more picks landing every week.</div>
        </>
      )}

      {step === 'results' && activityId && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Back onClick={() => setStep(backFromResults)} />
            <Dots n={initialActivity ? 2 : 3} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--gray-100)', borderRadius: 12, padding: '8px 12px', marginBottom: 12 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-2)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{initialActivity ? '' : `${mood.label} · `}{placeLabel} &middot; {actLabel}</span>
            <button onClick={() => setStep(backFromResults)} style={{ background: 'none', border: 'none', color: 'var(--accent-text)', fontWeight: 800, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>Edit</button>
          </div>
          <h2 style={{ ...heading, margin: '0 0 2px' }}>{actEmoji} {actLabel}</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12 }}>
            in {placeLabel} &middot; for {mood.label.toLowerCase()}
            {userLoc && <span style={{ color: 'var(--accent-text)', fontWeight: 700 }}> &middot; 📍 nearest first</span>}
          </div>

          {/* Open-now filter — hides places known to be closed right now. */}
          <button onClick={() => setOpenNowOnly(v => !v)} aria-pressed={openNowOnly} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16,
            padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 12.5, fontWeight: 700,
            background: openNowOnly ? '#21a049' : 'var(--gray-100)',
            color: openNowOnly ? '#fff' : 'var(--gray-700)',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: openNowOnly ? '#fff' : '#21a049' }} />
            Open now
          </button>

          {/* My Picks — the viewer's own hand-added places (empty → add a place) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)' }}>★ My Picks</span>
            {myPicksRendered.length > 0 && <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{myPicksRendered.length}</span>}
            <span style={{ flex: 1 }} />
            <button onClick={() => onAddPlace()} aria-label="Add a place" title="Add a place" style={{ width: 26, height: 26, borderRadius: 999, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 19, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, paddingBottom: 2 }}>+</button>
          </div>
          {myPicksRendered.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
              {myPicksRendered}
            </div>
          ) : (
            <button onClick={() => onAddPlace()} style={{ width: '100%', textAlign: 'left', border: '1.5px dashed var(--gray-300)', borderRadius: 16, background: 'var(--white)', cursor: 'pointer', fontFamily: 'inherit', padding: '16px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, lineHeight: 1 }}>+</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>You don&rsquo;t have any picks yet</span>
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-2)', marginTop: 2 }}>Tap to add a place you love</span>
              </span>
            </button>
          )}

          {/* NYC Stoop picks — editorial + curated + your imports */}
          {stoopRendered.length > 0 && (
            <>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', marginBottom: 8 }}>NYC Stoop picks</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {stoopRendered}
              </div>
            </>
          )}
        </>
      )}

      {/* Every pick opens this same in-app bottom sheet, so tapping is consistent:
          editorial venues get the rich sheet (Add to My Trip / Full details),
          everything else gets a compact sheet with an explicit Google Maps button. */}
      <BottomSheet open={!!moodSheet} onClose={() => setMoodSheet(null)} fit>
        {moodSheet?.kind === 'venue' && (
          <VenueSheet venueId={moodSheet.id} savedItems={savedItems} toggleSave={toggleSave}
            onFullPage={() => { const id = moodSheet.id; setMoodSheet(null); push({ screen: 'venue', venueId: id }) }} />
        )}
        {moodSheet?.kind === 'place' && (
          <MoodPlaceSheet place={moodSheet.place}
            savedItems={savedItems} toggleSave={toggleSave} userVenues={userVenues} onAddToTrip={onAddToTrip}
            onFull={moodSheet.full ? () => { const f = moodSheet.full; setMoodSheet(null); push(f) } : null} />
        )}
      </BottomSheet>
      </div>
    </div>
  )
}

function MoodScreen({ moodId, push, savedItems = {}, toggleSave = () => {} }) {
  const mood = moodById[moodId]
  // State sits unconditionally above any early return so the rules-of-hooks
  // contract holds even when the mood id is bad.
  const [borough, setBorough] = React.useState('manhattan')
  const [selectedArea, setSelectedArea] = React.useState(null)
  // Multi-mood combine — additional moods the user has layered on top of the
  // primary moodId. picks across all selected moods are union-merged, and
  // picks appearing in 2+ moods get a "matches multiple" star badge.
  const [combinedWith, setCombinedWith] = React.useState(() => new Set())
  // When the user flips the borough toggle, also clear the selected area so
  // they're not left looking at "Harlem · 0 picks" while staring at Brooklyn.
  React.useEffect(() => { setSelectedArea(null) }, [borough])
  // Reset combined moods when primary mood changes (different page visit).
  React.useEffect(() => { setCombinedWith(new Set()) }, [moodId])
  if (!mood) return null
  // List of all moods currently active (primary + combined). Order: primary
  // first so the user sees their initial mood lead.
  const activeMoodIds = [moodId, ...[...combinedWith]]
  const activeMoods = activeMoodIds.map(id => moodById[id]).filter(Boolean)
  const otherMoods = moods.filter(m => m.id !== moodId)

  // Resolve a pick (either { type:'venue', id } or { type:'sight', id }) into
  // a card-ready object. Returns null if the referenced item no longer exists
  // — caller filters those out so dead refs don't crash render.
  function resolvePick(p, idx) {
    if (p.type === 'venue') {
      const v = venues[p.id]
      if (!v) return null
      return {
        kind: 'venue',
        onClick: () => push({ screen: 'venue', venueId: v.id }),
        icon: domains[venueCoords[v.id]?.domain]?.icon || '📍',
        name: v.name,
        sub: v.neighborhood || '',
        desc: v.character || v.description || '',
        badge: { label: 'Venue', color: '#1a56db' },
        key: 'v:' + v.id + ':' + idx,
        accent: venueColors[v.id]?.bg || '#111',
      }
    }
    if (p.type === 'sight') {
      const s = ALL_SIGHTS[p.id]
      if (!s) return null
      return {
        kind: 'sight',
        onClick: () => push({ screen: 'sight', sightId: s.id }),
        icon: s.icon || '📍',
        name: s.name,
        sub: s.neighborhood
          ? `${s.neighborhood}${s.subArea ? ' · ' + s.subArea : ''}`
          : s.subArea || '',
        desc: s.desc || s.longDesc || '',
        badge: { label: 'Sight', color: '#0e7490' },
        key: 's:' + s.id + ':' + idx,
        accent: '#0e7490',
      }
    }
    return null
  }

  // Classify + union picks across all active moods (primary + combined).
  // Each pick is annotated with which mood(s) it came from so we can:
  //   • count picks per area for the map badges
  //   • render a "matches multiple" star on picks that satisfy 2+ moods
  //   • re-group filtered picks back under their editorial sub-category
  // Picks with no coords get dumped into an "Other" bucket shown below the map.
  const annotated = React.useMemo(() => {
    const byKey = new Map()  // key: type:id → annotated entry; collapses duplicates
    activeMoods.forEach(m => {
      ;(m.groups || []).forEach(group => {
        ;(group.picks || []).forEach((pick, idx) => {
          const key = pick.type + ':' + pick.id
          const where = classifyPickToArea(pick)
          if (byKey.has(key)) {
            // Already seen via another mood — note the additional source.
            byKey.get(key).matchingMoods.add(m.id)
          } else {
            byKey.set(key, {
              pick, idx, group, where,
              matchingMoods: new Set([m.id]),
              primaryMoodId: m.id,
            })
          }
        })
      })
    })
    return [...byKey.values()]
  }, [activeMoodIds.join(',')])

  // Pick-count maps for the map badges. Keyed first by borough, then areaId.
  const countsByArea = React.useMemo(() => {
    const acc = { manhattan: {}, brooklyn: {} }
    annotated.forEach(a => {
      if (!a.where) return
      acc[a.where.borough][a.where.areaId] = (acc[a.where.borough][a.where.areaId] || 0) + 1
    })
    return acc
  }, [annotated])

  // Picks outside Manhattan + Brooklyn (Yankee Stadium, Citi Field, Statue
  // of Liberty, etc.) get a small "Outside the map" footer entry so the user
  // doesn't think they vanished.
  const offMapPicks = React.useMemo(
    () => annotated.filter(a => !a.where),
    [annotated]
  )

  // Pins for the <BoroughReferenceMap> — resolves each picked venue/sight
  // into { lat, lng, name, color, areaId } shape. Filtered to the active
  // borough so the map below shows the right slice without panning across
  // the East River when the user just wants to see Manhattan picks.
  const referencePins = React.useMemo(() => {
    const out = []
    annotated.forEach(a => {
      if (!a.where || a.where.borough !== borough) return
      let lat, lng, name
      if (a.pick.type === 'venue') {
        const c = venueCoords[a.pick.id]
        const v = venues[a.pick.id]
        if (!c || !v) return
        lat = c.lat; lng = c.lng; name = v.name
      } else if (a.pick.type === 'sight') {
        const s = ALL_SIGHTS[a.pick.id]
        if (!s) return
        lat = s.lat; lng = s.lng; name = s.name
      }
      if (lat == null || lng == null) return
      out.push({
        id: a.pick.id,
        lat, lng, name,
        areaId: a.where.areaId,
        color: colorForArea(borough, a.where.areaId),
      })
    })
    return out
  }, [annotated, borough])

  const totalPicks = annotated.length
  const totalOnMap = annotated.length - offMapPicks.length

  // Group the selected-area picks back by their editorial group so the
  // sub-categories (Live jazz, Cocktail bars, etc.) survive the area filter.
  const selectedGroups = React.useMemo(() => {
    if (!selectedArea) return []
    const filtered = annotated.filter(a => a.where && a.where.borough === borough && a.where.areaId === selectedArea)
    // Preserve the group order from the mood definition.
    const groupMap = new Map()
    filtered.forEach(a => {
      const key = a.group.label
      if (!groupMap.has(key)) groupMap.set(key, { group: a.group, items: [] })
      groupMap.get(key).items.push(a)
    })
    return [...groupMap.values()]
  }, [annotated, selectedArea, borough])

  const areas = MOOD_MAP_AREAS[borough]
  const selectedAreaMeta = selectedArea ? areas.find(a => a.id === selectedArea) : null

  return (
    <div className="screen">
      {/* Mood hero — uses the mood's accent color as the header background. */}
      <div style={{
        background: mood.heroColor || 'var(--black)',
        color: '#fff',
        padding: '24px 20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 26, lineHeight: 1 }}>{mood.emoji}</span>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', opacity: 0.8,
          }}>Mood</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>
          {mood.label}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.9 }}>
          {mood.blurb}
        </div>
        <div style={{
          marginTop: 10, fontSize: 11, fontWeight: 700, opacity: 0.75,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {totalPicks} pick{totalPicks !== 1 ? 's' : ''}
          {combinedWith.size > 0 ? ` · combined with ${combinedWith.size} more mood${combinedWith.size !== 1 ? 's' : ''}` : ' · pick an area on the map'}
        </div>
      </div>

      {/* Multi-mood combine chip row — taps add/remove a secondary mood.
          Union semantics: each pick is shown once; picks that match 2+ moods
          get a ★ "matches multiple" badge so the user spots double-hitters. */}
      <div style={{
        background: 'var(--gray-50)',
        borderBottom: '1px solid var(--gray-100)',
        padding: '8px 20px 8px',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'var(--gray-500)',
          marginBottom: 6,
        }}>
          ＋ Combine with {combinedWith.size > 0 ? `(${combinedWith.size})` : '—'}
        </div>
        <div className="hide-scrollbar" style={{
          display: 'flex', gap: 5,
          overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        }}>
          {otherMoods.map(om => {
            const active = combinedWith.has(om.id)
            return (
              <button
                key={om.id}
                onClick={() => setCombinedWith(prev => {
                  const n = new Set(prev)
                  n.has(om.id) ? n.delete(om.id) : n.add(om.id)
                  return n
                })}
                style={{
                  flexShrink: 0,
                  padding: '5px 11px', borderRadius: 999,
                  background: active ? om.heroColor : 'var(--gray-100)',
                  color: active ? '#fff' : 'var(--gray-700)',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 11, fontWeight: active ? 700 : 600,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
              >
                <span style={{ fontSize: 12 }}>{om.emoji}</span>
                <span>{om.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Borough toggle */}
      <div style={{
        padding: '14px 20px 4px',
        display: 'flex', gap: 6,
      }}>
        {[
          { id: 'manhattan', label: 'Manhattan' },
          { id: 'brooklyn',  label: 'Brooklyn' },
        ].map(b => {
          const active = borough === b.id
          const total = Object.values(countsByArea[b.id] || {}).reduce((n, v) => n + v, 0)
          return (
            <button key={b.id} onClick={() => setBorough(b.id)} style={{
              flex: 1, padding: '9px 10px',
              background: active ? 'var(--gray-900)' : 'var(--gray-100)',
              color: active ? '#fff' : 'var(--gray-600)',
              border: 'none', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{b.label}</div>
              <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>{total} pick{total !== 1 ? 's' : ''}</div>
            </button>
          )
        })}
      </div>

      {/* Real OSM-tile map with colored area overlays — see <BoroughAreaMap>.
          Greyed-out areas have zero picks for this mood and aren't tappable. */}
      <div style={{ padding: '12px 20px 4px' }}>
        <BoroughAreaMap
          borough={borough}
          countsByArea={countsByArea}
          selectedArea={selectedArea}
          onSelectArea={setSelectedArea}
          height={520}
        />
        <div style={{
          marginTop: 6, fontSize: 10, color: 'var(--gray-400)',
          textAlign: 'center', letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          Tap an area to see picks
        </div>

        {/* Real geographic reference map below the schematic — gives first-time
            visitors a sense of where each neighborhood actually sits. Pins are
            colored to match the schematic; selecting an area dims pins
            elsewhere so the relationship is obvious. */}
        {referencePins.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--gray-500)',
              marginBottom: 6,
            }}>
              {selectedArea
                ? `Where these spots sit · ${referencePins.filter(p => p.areaId === selectedArea).length} in selected area`
                : `Where these spots sit on a real map · ${referencePins.length}`}
            </div>
            <BoroughReferenceMap
              borough={borough}
              pins={referencePins}
              selectedArea={selectedArea}
              height={260}
            />
          </div>
        )}
      </div>

      {/* Selected-area picks — re-grouped by editorial sub-category so the
          curation signal survives the area filter. */}
      <div style={{ padding: '8px 20px 40px' }}>
        {!selectedArea && (
          <div style={{
            marginTop: 12, padding: '14px 16px',
            background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
            borderRadius: 12, fontSize: 13, color: 'var(--gray-600)',
            lineHeight: 1.55,
          }}>
            <strong style={{ color: 'var(--gray-900)' }}>How this works:</strong> tap a colored area above to see the picks there.
            Greyed areas have no picks for this mood. {totalOnMap} of {totalPicks} picks fall on this map.
          </div>
        )}

        {selectedArea && selectedAreaMeta && (() => {
          // Compute the "save all" state for the selected area's picks. If
          // every pick is already saved we flip the button to "Unsave all" so
          // it stays useful instead of being a confusing no-op.
          const areaPicks = selectedGroups.flatMap(g => g.items)
            .map(a => {
              if (a.pick.type === 'venue') return venues[a.pick.id] ? { type: 'venue', id: a.pick.id } : null
              if (a.pick.type === 'sight') return ALL_SIGHTS[a.pick.id] ? { type: 'sight', id: a.pick.id } : null
              return null
            })
            .filter(Boolean)
          const savedCount = areaPicks.filter(p => savedItems[`${p.type}:${p.id}`]).length
          const allSaved = areaPicks.length > 0 && savedCount === areaPicks.length
          const handleBatchSave = () => {
            // If everything's saved, this becomes "unsave all". Otherwise it
            // saves every unsaved pick — already-saved ones stay saved.
            areaPicks.forEach(p => {
              const key = `${p.type}:${p.id}`
              const isSaved = !!savedItems[key]
              if (allSaved && isSaved) toggleSave(p.type, p.id)
              else if (!allSaved && !isSaved) toggleSave(p.type, p.id)
            })
          }
          return (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginTop: 14, marginBottom: 14, padding: '0 2px',
            }}>
              <div style={{
                width: 8, height: 24, borderRadius: 4,
                background: selectedAreaMeta.color,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2 }}>
                  {selectedAreaMeta.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>
                  {areaPicks.length} pick{areaPicks.length !== 1 ? 's' : ''} · {selectedAreaMeta.sub}
                </div>
              </div>
              <button
                onClick={() => setSelectedArea(null)}
                style={{
                  background: 'var(--gray-100)', color: 'var(--gray-600)',
                  border: 'none', borderRadius: 999,
                  padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 11, fontWeight: 700,
                }}
              >Clear</button>
            </div>

            {/* Batch save — one tap saves every pick in the area to the trip.
                Eliminates the 1-tap-per-venue grind for Sarah-style users
                building a day from a mood selection. */}
            {areaPicks.length > 1 && (
              <button
                onClick={handleBatchSave}
                style={{
                  width: '100%', marginBottom: 14,
                  background: allSaved ? 'var(--gray-100)' : selectedAreaMeta.color,
                  color: allSaved ? 'var(--gray-700)' : '#fff',
                  border: 'none', borderRadius: 12,
                  padding: '11px 14px', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 13, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: 14 }}>{allSaved ? '✓' : '+'}</span>
                <span>
                  {allSaved
                    ? `Unsave all ${areaPicks.length} from trip`
                    : `Save all ${areaPicks.length} to trip${savedCount > 0 ? ` (${savedCount} already saved)` : ''}`}
                </span>
              </button>
            )}

            {selectedGroups.map((g, gIdx) => {
              const resolved = g.items.map(a => {
                const card = resolvePick(a.pick, a.idx)
                if (!card) return null
                // Annotate with how many of the active moods match this pick
                // so the card can render a star badge for "matches multiple."
                return { ...card, moodMatchCount: a.matchingMoods?.size || 1 }
              }).filter(Boolean)
              if (resolved.length === 0) return null
              return (
                <div key={'g:' + gIdx} style={{ marginTop: gIdx === 0 ? 0 : 20 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 8, padding: '0 2px',
                  }}>
                    <span style={{ fontSize: 15, lineHeight: 1 }}>{g.group.emoji}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
                      textTransform: 'uppercase', color: 'var(--gray-700)',
                    }}>{g.group.label}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: 'var(--gray-500)',
                      background: 'var(--gray-100)', padding: '1px 6px', borderRadius: 999,
                    }}>{resolved.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {resolved.map(card => (
                      <button
                        key={card.key}
                        onClick={card.onClick}
                        style={{
                          width: '100%', background: 'var(--white)',
                          border: '1px solid var(--gray-200)', borderRadius: 14,
                          padding: '12px 14px', cursor: 'pointer',
                          textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 12,
                          fontFamily: 'inherit',
                          borderLeft: `3px solid ${card.accent}`,
                        }}
                      >
                        <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2, lineHeight: 1 }}>{card.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{card.name}</span>
                            <span style={{
                              fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                              color: card.badge.color, background: card.badge.color + '18',
                              padding: '2px 6px', borderRadius: 4,
                            }}>{card.badge.label}</span>
                            {card.moodMatchCount > 1 && (
                              <span title={`Matches ${card.moodMatchCount} of your selected moods`} style={{
                                fontSize: 9, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
                                color: '#92400e', background: '#fef3c7',
                                padding: '2px 7px', borderRadius: 4,
                                display: 'inline-flex', alignItems: 'center', gap: 3,
                              }}>★ matches {card.moodMatchCount}</span>
                            )}
                          </div>
                          {card.sub && (
                            <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>
                              {card.sub}
                            </div>
                          )}
                          {card.desc && (
                            <div style={{
                              fontSize: 12, color: 'var(--gray-600)', marginTop: 5, lineHeight: 1.5,
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>{card.desc}</div>
                          )}
                        </div>
                        <span style={{ fontSize: 18, color: 'var(--gray-300)', alignSelf: 'center', flexShrink: 0 }}>›</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
          )
        })()}

        {/* Off-map picks — Yankee Stadium, Statue of Liberty, etc. that don't
            fit Manhattan or Brooklyn. Always visible at the bottom so users
            know they're still part of the mood. */}
        {offMapPicks.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{
              fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--gray-500)',
              marginBottom: 8, padding: '0 2px',
            }}>
              Elsewhere in NYC · {offMapPicks.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {offMapPicks.map(a => {
                const card = resolvePick(a.pick, a.idx)
                if (!card) return null
                return (
                  <button
                    key={'off:' + card.key}
                    onClick={card.onClick}
                    style={{
                      width: '100%', background: 'var(--white)',
                      border: '1px solid var(--gray-200)', borderRadius: 14,
                      padding: '10px 12px', cursor: 'pointer',
                      textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{card.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>{card.name}</div>
                      {card.sub && (
                        <div style={{ fontSize: 10, color: 'var(--gray-500)', marginTop: 1 }}>{card.sub}</div>
                      )}
                    </div>
                    <span style={{ fontSize: 16, color: 'var(--gray-300)' }}>›</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Reverse map venueId → domainId (venues carry no category field; the topic/
// domain taxonomy lives in `domains`). Used to screen neighborhood lists.
const VENUE_DOMAIN = (() => {
  const m = {}
  Object.values(domains).forEach(d => (d.venueIds || []).forEach(id => { m[id] = d.id }))
  return m
})()

function NeighborhoodScreen({ neighborhoodKey, subAreaName, push, savedItems = {}, userVenues = {}, toggleSave = () => {}, onAddToTrip = () => null }) {
  // Category screening for the venue list: a filter chip + per-section "show all".
  const [catFilter, setCatFilter] = React.useState('all')
  const [expanded, setExpanded] = React.useState({})
  // In-app sheet for "From your list" cards — consistent with the mood flow, so
  // these open a detail sheet with "Add to My Trip" rather than jumping to Maps.
  const [nbSheet, setNbSheet] = React.useState(null)
  const group = NEIGHBORHOOD_GROUPS.find(g => g.key === neighborhoodKey)
  if (!group) return null

  // Coming-soon boroughs: short editorial tease + a feedback CTA instead of
  // a half-empty venue list. Keeps the geography intentional and warm.
  if (group.comingSoon) {
    return (
      <div className="screen">
        <div className="section">
          <p className="meta">{group.emoji} Neighborhood</p>
          <h1 className="display" style={{ marginTop: 8 }}>{group.label}</h1>
        </div>
        <div style={{ padding: '8px 20px 24px' }}>
          <div style={{
            background: '#fef3c7', border: '1px solid #fde68a',
            borderRadius: 14, padding: '20px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#92400e',
            }}>Coming soon</div>
            <div style={{ fontSize: 15, color: '#451a03', lineHeight: 1.55 }}>
              {group.tease || `Editorial coverage of ${group.label} is on the way.`}
            </div>
            <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.5 }}>
              Want a specific place added first? Tell us what to start with —
              feedback shapes which neighborhood we cover next.
            </div>
            <a
              href={`mailto:hsichunw@gmail.com?subject=NYC%20Stoop%20${encodeURIComponent(group.label)}%20request`}
              style={{
                display: 'inline-block', textAlign: 'center',
                background: 'var(--gray-900)', color: '#fff', textDecoration: 'none',
                fontSize: 13, fontWeight: 700,
                padding: '10px 14px', borderRadius: 10, marginTop: 4,
              }}
            >Suggest a place →</a>
          </div>
          {/* Tease: in the meantime, here are the other boroughs that are live. */}
          <div style={{
            marginTop: 24, padding: '16px 0 0',
            borderTop: '1px solid var(--gray-100)',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'var(--gray-400)', marginBottom: 12,
            }}>While you wait — explore now</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {NEIGHBORHOOD_GROUPS.filter(g => !g.comingSoon && getNeighborhoodVenues(g.key, venues).length > 0).slice(0, 5).map(g => (
                <button key={g.key} onClick={() => push({ screen: 'neighborhood', neighborhoodKey: g.key })} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'var(--card)', border: '1px solid var(--gray-200)',
                  borderRadius: 12, padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 17 }}>{g.emoji}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{g.label}</span>
                  <span style={{ fontSize: 18, color: 'var(--gray-300)' }}>›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If subAreaName is set, we're showing the focused view for a specific Brooklyn neighborhood (Williamsburg, etc.)
  let subAreaInfo = null
  if (subAreaName) {
    const subAreas = NEIGHBORHOOD_SUBAREAS[neighborhoodKey] || []
    for (const sa of subAreas) {
      const found = sa.areas.find(a => a.name === subAreaName)
      if (found) { subAreaInfo = { ...found, parentLabel: sa.label }; break }
    }
  }
  // Venue filter: focused sub-area → match only that neighborhood string; otherwise the parent's match.
  const nbVenues = subAreaInfo
    ? Object.values(venues).filter(v => v.neighborhood && new RegExp(escapeRegExp(subAreaName), 'i').test(v.neighborhood))
    : getNeighborhoodVenues(neighborhoodKey, venues)
  // Sub-areas only render at the parent-level view (not when already drilled into one).
  const subAreas = subAreaInfo ? null : (NEIGHBORHOOD_SUBAREAS[neighborhoodKey] || null)

  // Personal saves (imported/added places) that fall in this neighborhood — shown
  // as a SEPARATE, clearly-labeled layer below the editorial picks, never blended.
  // Don't double-list a place that's already an editorial pick in this area
  // (e.g. Don Angie showing under both the curated list AND "From your list").
  const editorialNames = new Set(nbVenues.map(v => (v.name || '').toLowerCase().trim()))
  const myPlaces = Object.values(userVenues || {}).filter(v => {
    if (!v.neighborhood) return false
    if (editorialNames.has((v.name || '').toLowerCase().trim())) return false
    return subAreaInfo
      ? new RegExp(escapeRegExp(subAreaName), 'i').test(v.neighborhood)
      : group.match(v.neighborhood)
  }).sort((a, b) => (b.rating || 0) - (a.rating || 0))  // highest Google rating first

  return (
    <div className="screen">
      <div className="section">
        {/* Breadcrumb meta — for sub-area view, show parent borough so users see the hierarchy */}
        <p className="meta">
          {subAreaInfo
            ? <>{group.emoji} {group.label} · {subAreaInfo.parentLabel}</>
            : <>{group.emoji} Neighborhood</>}
        </p>
        <h1 className="display" style={{ marginTop: 8 }}>{subAreaInfo ? subAreaInfo.name : group.label}</h1>
        {/* Sub-area's editorial description — only shown in focused view */}
        {subAreaInfo && (
          <p style={{ marginTop: 10, fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.55, fontStyle: 'italic' }}>
            {subAreaInfo.desc}
          </p>
        )}
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.5 }}>
          {nbVenues.length === 0
            ? subAreaInfo
              ? `No venues catalogued in ${subAreaInfo.name} yet — tap + Add to save your own.`
              : 'No venues catalogued in this area yet — check back as the guide grows.'
            : subAreas
              // Parent view with sub-areas: nudge users to drill into a specific area instead of
              // duplicating venues at the top. They'll find each venue under its actual sub-area below.
              ? `${nbVenues.length} venue${nbVenues.length !== 1 ? 's' : ''} across ${group.label} — find them by area below.`
              : `${nbVenues.length} venue${nbVenues.length !== 1 ? 's' : ''} to explore here.`}
        </p>
      </div>
      {/* Top venue list — only on focused sub-area views. On the parent view (with sub-areas),
          we deliberately suppress this list so users browse by area instead of seeing duplicates. */}
      {nbVenues.length > 0 && !subAreas && (() => {
        // Screen the list into scannable category sections instead of one long
        // flat dump: filter chips up top, each section capped with "show all".
        const CATS = [
          { key: 'see',     label: 'Art & sights',  emoji: '🖼️' },
          { key: 'culture', label: 'Music & shows', emoji: '🎷' },
          { key: 'eat',     label: 'Eat & drink',   emoji: '🍽️' },
          { key: 'sports',  label: 'Sports',        emoji: '🏆' },
          { key: 'other',   label: 'More',          emoji: '📍' },
        ]
        const catOf = v => (v.isRestaurant || VENUE_DOMAIN[v.id] === 'food') ? 'eat'
          : ['visual_art', 'architecture', 'history'].includes(VENUE_DOMAIN[v.id]) ? 'see'
          : ['jazz', 'classical_music', 'hip_hop', 'theater'].includes(VENUE_DOMAIN[v.id]) ? 'culture'
          : VENUE_DOMAIN[v.id] === 'sports' ? 'sports' : 'other'
        const groups = CATS.map(c => ({ ...c, items: nbVenues.filter(v => catOf(v) === c.key) })).filter(g => g.items.length)
        const visible = catFilter === 'all' ? groups : groups.filter(g => g.key === catFilter)
        const CAP = 2
        return (
          <div style={{ padding: '4px 20px 24px' }}>
            {groups.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16 }}>
                {[{ key: 'all', label: 'All', emoji: '', items: nbVenues }, ...groups].map(c => {
                  const active = catFilter === c.key
                  return (
                    <button key={c.key} onClick={() => setCatFilter(c.key)} style={{
                      flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 700,
                      background: active ? 'var(--ink)' : 'var(--gray-100)',
                      color: active ? '#fff' : 'var(--gray-700)',
                    }}>
                      {c.emoji && <span aria-hidden="true">{c.emoji}</span>}{c.label}
                      <span style={{ opacity: 0.6, fontWeight: 600 }}>{c.items.length}</span>
                    </button>
                  )
                })}
              </div>
            )}
            {visible.map(g => {
              const isOpen = !!expanded[g.key] || catFilter === g.key || g.items.length <= CAP
              const shown = isOpen ? g.items : g.items.slice(0, CAP)
              return (
                <div key={g.key} style={{ marginBottom: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}><span aria-hidden="true">{g.emoji}</span> {g.label}</div>
                    <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>{g.items.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {shown.map(v => (
                      <VenueTapCard key={v.id} venue={v} isSaved={!!savedItems[`venue:${v.id}`]} onPress={() => push({ screen: 'venue', venueId: v.id })} />
                    ))}
                  </div>
                  {!isOpen && (
                    <button onClick={() => setExpanded(e => ({ ...e, [g.key]: true }))} style={{
                      marginTop: 12, width: '100%', background: 'var(--gray-100)', border: 'none', cursor: 'pointer',
                      borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, color: 'var(--gray-700)',
                    }}>
                      Show all places →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* From your list — personal saves for this neighborhood, kept as a clearly
          labeled layer below the editorial picks (never blended into them). */}
      {myPlaces.length > 0 && !subAreas && (() => {
        const CAP = 5
        const open = !!expanded.mine || myPlaces.length <= CAP
        const shown = open ? myPlaces : myPlaces.slice(0, CAP)
        return (
          <div style={{ padding: '4px 20px 32px', borderTop: '1px solid var(--gray-100)', marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '16px 0 2px' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}><span aria-hidden="true">📌</span> From your list</div>
              <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>{myPlaces.length}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 12 }}>Your saved places — not NYC Stoop editorial picks.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {shown.map(v => (
                <UserVenueCard key={v.id}
                  venue={v}
                  cardVenue={{ id: v.id, name: v.name, neighborhood: v.neighborhood || 'Saved spot', character: v.description || '', color: '#8aa4c0' }}
                  onPress={() => setNbSheet({ ...v, existingId: v.id })}
                />
              ))}
            </div>
            {!open && (
              <button onClick={() => setExpanded(e => ({ ...e, mine: true }))} style={{
                marginTop: 12, width: '100%', background: 'var(--gray-100)', border: 'none', cursor: 'pointer',
                borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, color: 'var(--gray-700)',
              }}>
                Show all {myPlaces.length} from your list →
              </button>
            )}
          </div>
        )
      })()}

      {/* Curated sights — only shown in focused sub-area view. Tap a row → opens Google Maps search for that place. */}
      {subAreaInfo && subAreaInfo.sights && subAreaInfo.sights.length > 0 && (
        <div style={{ padding: '8px 20px 40px' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 12, gap: 8,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'var(--gray-500)',
            }}>
              Don&apos;t miss in {subAreaInfo.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
              {subAreaInfo.sights.length} pick{subAreaInfo.sights.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div style={{
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {subAreaInfo.sights.map((s, idx) => {
              const sId = sightIdOf(s.name)
              const isSaved = !!savedItems[`sight:${sId}`]
              return (
                <button
                  key={s.name}
                  onClick={() => push({ screen: 'sight', sightId: sId })}
                  style={{
                    width: '100%', position: 'relative',
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 14px 14px 16px',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderTop: idx === 0 ? 'none' : '1px solid var(--gray-100)',
                    transition: 'background 120ms ease',
                  }}
                  onMouseDown={e => { e.currentTarget.style.background = 'var(--gray-50)' }}
                  onMouseUp={e => { e.currentTarget.style.background = 'transparent' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--gray-300)', alignSelf: 'center', flexShrink: 0 }}>›</span>
                </button>
              )
            })}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 12, lineHeight: 1.5, fontStyle: 'italic' }}>
            Tap any pick for details, insider tips, and to save it to your trip.
          </div>
        </div>
      )}

      {/* Sub-area cards — only at the parent level. Each row is now a button that drills into the sub-area. */}
      {subAreas && subAreas.length > 0 && (
        <div style={{ padding: '8px 20px 40px' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--gray-500)', marginBottom: 14,
          }}>
            {group.label} neighborhoods
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {subAreas.map(sa => (
              <div key={sa.key} style={{
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: 14,
                padding: '6px 6px 8px',
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: 'var(--gray-900)',
                  letterSpacing: '0.02em', padding: '8px 10px 10px',
                }}>
                  {sa.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {sa.areas.map((a, idx) => {
                    // Show the venue + sight counts per sub-area so users see at a glance
                    // which neighborhoods have something to drill into.
                    const venueCount = Object.values(venues).filter(v => v.neighborhood && new RegExp(escapeRegExp(a.name), 'i').test(v.neighborhood)).length
                    const sightCount = (a.sights || []).length
                    const totalCount = venueCount + sightCount
                    return (
                      <button
                        key={a.name}
                        onClick={() => push({ screen: 'neighborhood', neighborhoodKey, subAreaName: a.name })}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '10px 10px 10px 10px',
                          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                          borderTop: idx === 0 ? 'none' : '1px solid var(--gray-100)',
                          width: '100%',
                          transition: 'background 120ms ease',
                        }}
                        onMouseDown={e => { e.currentTarget.style.background = 'var(--gray-50)' }}
                        onMouseUp={e => { e.currentTarget.style.background = 'none' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                      >
                        <span style={{ fontSize: 13, color: 'var(--gray-300)', marginTop: 1, flexShrink: 0 }}>📍</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>{a.name}</span>
                            {totalCount > 0 && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, color: 'var(--gray-600)',
                                background: 'var(--gray-100)', padding: '1px 6px', borderRadius: 999,
                              }}>{totalCount}</span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2, lineHeight: 1.45 }}>{a.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: 'var(--gray-300)', alignSelf: 'center', flexShrink: 0 }}>›</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 14, lineHeight: 1.5, fontStyle: 'italic' }}>
            Tap any neighborhood to focus on it — or hit <strong>+ Add</strong> below to save your own favorite spot.
          </div>
        </div>
      )}

      {/* "From your list" cards open this in-app sheet (consistent with the mood
          flow) with an "Add to My Trip" action, rather than jumping to Maps. */}
      <BottomSheet open={!!nbSheet} onClose={() => setNbSheet(null)} fit>
        {nbSheet && (
          <MoodPlaceSheet place={nbSheet}
            savedItems={savedItems} toggleSave={toggleSave} userVenues={userVenues} onAddToTrip={onAddToTrip} />
        )}
      </BottomSheet>
    </div>
  )
}

// Small helper to safely use a user-provided string inside a RegExp (escapes special chars).
function escapeRegExp(s) {
  return (s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ── SightScreen — in-app detail page for sub-neighborhood sights. Built to match VenueScreen's
// visual richness (category-colored header, full description, colored tag chips, BOOKING row). ──
function SightScreen({ sightId, push, savedItems = {}, toggleSave = () => {} }) {
  const sight = ALL_SIGHTS[sightId]
  if (!sight) {
    return (
      <div className="screen">
        <div className="section">
          <h1 className="display">Sight not found</h1>
          <p style={{ marginTop: 10, fontSize: 14, color: 'var(--gray-500)' }}>
            That sight doesn&apos;t exist in our guide yet.
          </p>
        </div>
      </div>
    )
  }
  const isSaved = !!savedItems[`sight:${sight.id}`]
  // Category colors drive the header background + tag chips. Falls back to gray-900 if no match.
  const colors = SIGHT_CATEGORY_COLOR[sight.icon] || DEFAULT_SIGHT_COLOR
  // Google Maps deep link — works whether or not we have explicit coords.
  const mapsUrl = sight.lat && sight.lng
    ? `https://www.google.com/maps/?q=${sight.lat},${sight.lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(sight.name + ', ' + sight.neighborhood + ', Brooklyn, New York')}`
  const hasPlanCard = sight.admission || sight.timeNeeded || sight.booking || sight.insiderTip
  // Prefer the longer editorial description when available; fall back to the short sub-area blurb.
  const description = sight.longDesc || sight.desc

  return (
    <div className="screen">
      {/* ── Colored header — uses category color, name as primary visual anchor (matches VenueScreen). ── */}
      <div style={{
        background: colors.bg,
        color: colors.text,
        padding: '28px 20px 22px',
        position: 'relative',
      }}>
        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, marginBottom: 6, paddingRight: 92 }}>
          {sight.name}
        </div>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8, paddingRight: 92 }}>
          {sight.subArea} · Brooklyn
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          📍 {sight.neighborhood}
        </div>
        {/* Save action, top-right. (Share button removed app-wide — non-functional
            inside the iOS webview; trip sharing lives in My Trip.) */}
        <div style={{ position: 'absolute', top: 18, right: 16, display: 'flex', gap: 6 }}>
          <button
            onClick={() => toggleSave('sight', sight.id)}
            aria-label={isSaved ? 'Remove from My Trip' : 'Add to My Trip'}
            style={{
              background: isSaved ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)',
              backdropFilter: isSaved ? 'none' : 'blur(6px)', border: 'none',
              borderRadius: 999, height: 36, padding: '0 14px',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: isSaved ? 'var(--ink)' : colors.text, lineHeight: 1, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              transition: 'background 120ms ease, color 120ms ease',
            }}
          >
            {isSaved ? '✓ Saved' : '+ Add to Trip'}
          </button>
        </div>
      </div>

      {/* Description — uses longDesc when available, falls back to short desc otherwise. */}
      <div className="section" style={{ paddingTop: 20, paddingBottom: 6 }}>
        <div style={{ fontSize: 15, color: 'var(--gray-700)', lineHeight: 1.7 }}>
          {description}
        </div>
      </div>

      {/* Tag chips — colored in the sight's category color (matches VenueScreen pattern). */}
      {sight.tags && sight.tags.length > 0 && (
        <div style={{ padding: '8px 20px 4px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {sight.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 700, color: '#fff',
              background: colors.bg, padding: '5px 12px', borderRadius: 999,
            }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Plan Your Visit card — adds BOOKING row alongside admission / time / insider tip. */}
      {hasPlanCard && (
        <div className="section" style={{ paddingTop: 18 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--gray-500)', marginBottom: 12,
          }}>
            Plan your visit
          </div>
          <div style={{
            background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
            borderRadius: 14, padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            {sight.admission && (
              <DetailRow icon="💰" label="Admission" body={sight.admission} />
            )}
            {sight.timeNeeded && (
              <DetailRow icon="🕐" label="Time needed" body={sight.timeNeeded} />
            )}
            {sight.booking && (
              <DetailRow icon="📅" label="Booking" body={sight.booking} />
            )}
            {sight.insiderTip && (
              <>
                <div style={{ borderTop: '1px dashed var(--gray-200)' }} />
                <DetailRow icon="💡" label="Insider tip" body={sight.insiderTip} bodyStyle={{ lineHeight: 1.55 }} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Action buttons — primary save-to-trip + secondary helpers */}
      <div style={{ padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* + Add to My Trip — main CTA */}
        <button onClick={() => toggleSave('sight', sight.id)} style={{
          background: isSaved ? '#dcfce7' : 'var(--gray-900)',
          color: isSaved ? '#15803d' : '#fff',
          border: 'none', borderRadius: 12, padding: '14px',
          fontSize: 14, fontWeight: 800, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 120ms ease, color 120ms ease',
        }}>
          {isSaved ? <>✓ Added to My Trip</> : <>+ Add to My Trip</>}
        </button>

        {/* Official site (if URL is known) */}
        {sight.officialUrl && (
          <a href={sight.officialUrl} target="_blank" rel="noopener noreferrer" style={{
            background: 'var(--gray-100)', color: 'var(--gray-800)',
            border: '1px solid var(--gray-200)', borderRadius: 12, padding: '12px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            Official site ↗
          </a>
        )}

        {/* Address row + Maps button */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--gray-200)',
          borderRadius: 12, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13 }}>📍</span>
          <span style={{ fontSize: 13, color: 'var(--gray-700)', flex: 1 }}>
            {sight.name}, {sight.neighborhood}, Brooklyn
          </span>
        </div>

        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{
          background: 'var(--gray-100)', color: 'var(--gray-800)',
          border: '1px solid var(--gray-200)', borderRadius: 12, padding: '12px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          🗺️ View on Map
        </a>
      </div>

      {/* Bottom hint */}
      <div style={{ padding: '4px 20px 40px', fontSize: 11, color: 'var(--gray-400)', textAlign: 'center', fontStyle: 'italic' }}>
        Found something missing? Tap <strong>+ Add</strong> at the bottom to save your own pick.
      </div>
    </div>
  )
}

// Small helper for label/body rows inside the Plan-Your-Visit card. Used by SightScreen.
function DetailRow({ icon, label, body, bodyStyle }) {
  // If body is a string with blank-line breaks (\n\n), render each block as
  // its own spaced paragraph so multi-section insider tips read cleanly.
  // Single-paragraph strings render as before. React nodes (non-strings)
  // pass through untouched.
  const bodyContent = typeof body === 'string' && body.includes('\n\n')
    ? body.split(/\n\n+/).map((para, i) => (
        <p key={i} style={{
          margin: i === 0 ? 0 : '8px 0 0',
          whiteSpace: 'pre-line',
        }}>{para.trim()}</p>
      ))
    : body
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--gray-500)', marginBottom: 3,
        }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--gray-800)', lineHeight: 1.55, ...bodyStyle }}>{bodyContent}</div>
      </div>
    </div>
  )
}

// ── VenueTapCard — tappable card for InterestScreen / DomainScreen ────────
// Reusable saved-state indicator for figure/work/venue cards across inner screens.
// Render inside any card whose wrapper has position:relative (or add it). Returns null when not saved.
function SavedDot() {
  // Heart/favorite indicators were removed app-wide — saving now happens only via
  // the explicit "Add to My Trip" buttons. Kept as a no-op so existing call sites
  // don't need touching.
  return null
}

function VenueTapCard({ venue, onPress, isSaved = false, image = null, attribution = null, external = false }) {
  const colors = venueColors[venue.id] || (venue.color ? { bg: venue.color, text: '#fff' } : { bg: '#8aa4c0', text: '#fff' })
  // Photo priority: explicit image prop → curated venue photo → first
  // work-at-this-venue image → none, in which case the category gradient shows.
  const photo = image || venueImages[venue.id] || getWorksAtVenue(venue.id).find(w => w.imageUrl)?.imageUrl || null
  const preview = clipWords(venue.character || '', 110)
  // Theater venues: surface what's currently playing. Users search by show
  // name ("where's Hamilton?"), not theater name, so the production needs to
  // be visible BEFORE you tap in. `isDark` means the theater is between
  // productions — we still show the tagline (often "Galileo opens Dec 6").
  const np = venue.nowPlaying

  return (
    <button
      style={{
        display: 'block', position: 'relative',
        width: '100%',
        border: '1px solid rgba(33,27,20,0.08)',
        borderRadius: 22,
        overflow: 'hidden',
        background: 'var(--card)',
        cursor: 'pointer',
        textAlign: 'left',
        padding: 0,
        boxShadow: 'var(--shadow)',
      }}
      onClick={onPress}
    >
      {/* ── Photo header — full-bleed image over the category-gradient base
             layer, so a missing/renamed photo degrades to a pretty gradient,
             never a black box. Mirrors the home hero + venue detail screen. ── */}
      <div style={{
        position: 'relative',
        width: '100%', height: 100,
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}99 100%)`,
        overflow: 'hidden',
      }}>
        {photo && (
          <img
            src={photo}
            alt=""
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* Photo attribution — required by Google Places TOS when the image
            comes from the Places Photos API. Tiny credit, top-left, kept out of
            the way of the saved heart (top-right) and the title panel (bottom). */}
        {photo && attribution && attribution.length > 0 && (
          <span style={{
            position: 'absolute', top: 10, left: 12, zIndex: 3,
            maxWidth: '62%',
            padding: '3px 8px', borderRadius: 999,
            background: 'rgba(13,18,25,0.5)', color: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            fontSize: 9.5, fontWeight: 600, letterSpacing: '0.02em', lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>📷 {attribution.map(a => a.name).filter(Boolean).join(', ')}</span>
        )}

        {/* Title moved below the photo (Layout A) for readability + room for rating/price. */}
      </div>

      {/* Now-playing bar — only on venues with a nowPlaying field (currently
          only theaters). Title takes the most visual weight; through-date is
          smaller. Dark houses get a muted treatment so they still convey
          information without claiming "this is a show". */}
      {np && (
        np.isDark ? (
          <div style={{
            background: '#fafafa',
            borderTop: '1px solid var(--gray-100)',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>🎭 Between productions</span>
            {np.tagline && (
              <span style={{
                fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.4,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>· {np.tagline}</span>
            )}
          </div>
        ) : (
          <div style={{
            background: '#0d1117', color: '#fff',
            padding: '10px 16px 11px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', letterSpacing: '0.06em', textTransform: 'uppercase' }}>🎭 Now playing</span>
              {np.through && (
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{np.through}</span>
              )}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4, lineHeight: 1.2 }}>
              {np.title}
            </div>
          </div>
        )
      )}

      <div style={{ padding: '12px 14px 13px' }}>
        <div style={{
          fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1.22,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{venue.name}</div>
        {(() => {
          const parts = []
          if (venue.price) parts.push(venue.price)
          const place = `${venue.neighborhood || ''}${venue.fullName && venue.fullName !== venue.name ? ` · ${venue.fullName}` : ''}`.trim()
          if (place) parts.push(place)
          if (!venue.rating && parts.length === 0) return null
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 12, color: 'var(--ink-2)', margin: '4px 0 8px' }}>
              {venue.rating ? <span style={{ color: '#854F0B', fontWeight: 700 }}>★ {venue.rating}</span> : null}
              {venue.rating && parts.length ? <span style={{ color: 'var(--ink-3)' }}>·</span> : null}
              {parts.length ? <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{parts.join(' · ')}</span> : null}
            </div>
          )
        })()}
        {preview && (
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {preview}
          </div>
        )}
        {/* Insider tip intentionally lives on the venue detail page, not here —
            keeps the browse list scannable; the tip is the reward for tapping in. */}
        <div style={{ fontSize: 12.5, fontWeight: 700, color: external ? 'var(--gray-500)' : 'var(--accent-text)' }}>{external ? 'View on Google Maps ↗' : 'Explore →'}</div>
      </div>
    </button>
  )
}

// ── Lazy Google Places photo for a user-saved venue ───────────────────────
// Small session-only cache keyed by venue id so re-renders / re-entering the
// flow don't refetch. Per Google Maps Platform TOS the photo is fetched live
// and its attribution displayed; we deliberately keep this cache in memory
// only (never localStorage) so image bytes aren't persisted.
const _googlePhotoCache = {}
function useGooglePhoto(venue) {
  const id = venue?.id
  const [photo, setPhoto] = useState(() => (id && _googlePhotoCache[id]) || null)
  useEffect(() => {
    if (!id) return
    if (venue?.image) return                 // user-supplied image wins — no fetch
    if (_googlePhotoCache[id]) { setPhoto(_googlePhotoCache[id]); return }
    const fromGoogle = (typeof venue?.id === 'string' && venue.id.startsWith('seed_'))
      || String(venue?.source || '').startsWith('google')
      || !!venue?.googlePlaceId
    if (!fromGoogle || !venue?.name) return
    if (!isGooglePlacesAvailable()) return
    let alive = true
    getPlacePhotoByName(venue.name, { hint: venue.address || venue.neighborhood || '' }).then(res => {
      if (!alive || !res || !res.photoUrl) return
      _googlePhotoCache[id] = res
      setPhoto(res)
    }).catch(() => {})
    return () => { alive = false }
  }, [id])
  return photo // { photoUrl, attribution, lat, lng } | null
}

// ── UserVenueCard — VenueTapCard for a user-saved place, with a lazily
// resolved Google Places photo (falls back to the gradient when there's no
// key, no match, or no photo). `cardVenue` is the synthetic venue passed to
// VenueTapCard; `venue` is the raw user_venue used to resolve the photo. ──
function UserVenueCard({ venue, cardVenue, onPress, isSaved = false }) {
  const g = useGooglePhoto(venue)
  const [imgFailed, setImgFailed] = React.useState(false)
  const imageSrc = venue?.image || g?.photoUrl || null
  const image = imageSrc && !imgFailed ? imageSrc : null
  // Layout C — compact row: small thumbnail + name + rating·price·neighborhood + one-line desc.
  const rawDesc = (venue?.description || venue?.googleSummary || cardVenue?.character || '').trim()
  const desc = clipWords(rawDesc, 84)
  const place = (venue?.neighborhood && venue.neighborhood !== 'Saved from Google Maps')
    ? venue.neighborhood : (cardVenue?.neighborhood || 'Saved spot')
  const meta = []
  if (venue?.price) meta.push(venue.price)
  if (place) meta.push(place)
  const openSt = openStatusNow(venue?.hours)
  return (
    <button onClick={onPress} style={{
      width: '100%', display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left', cursor: 'pointer',
      background: 'var(--card)', border: '1px solid var(--gray-200)', borderRadius: 14, padding: 10,
      boxShadow: '0 1px 2px rgba(29,39,51,0.05)',
    }}>
      <div style={{
        width: 74, height: 74, flexShrink: 0, borderRadius: 10, overflow: 'hidden',
        background: image ? 'var(--gray-100)' : (PLACE_CAT_COLOR[venue?.category] || '#8AA4C0'),
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>
        {image
          ? <img src={image} alt="" loading="lazy" onError={() => setImgFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <span style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{placeInitial(venue?.name || cardVenue?.name)}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{venue?.name || cardVenue?.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-2)', margin: '3px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {venue?.rating ? <span style={{ color: '#854F0B', fontWeight: 700, flexShrink: 0 }}>★ {venue.rating}</span> : null}
          {venue?.rating && meta.length ? <span style={{ color: 'var(--ink-3)', flexShrink: 0 }}>·</span> : null}
          {meta.length ? <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta.join(' · ')}</span> : null}
        </div>
        {openSt.state !== 'unknown' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, margin: '1px 0 3px', color: openSt.state === 'open' ? '#1b7a3d' : 'var(--gray-500)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, flexShrink: 0, background: openSt.state === 'open' ? '#21a049' : 'var(--gray-400)' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{openSt.label}</span>
          </div>
        )}
        {desc && <div style={{ fontSize: 12, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</div>}
      </div>
      <span style={{ fontSize: 16, color: 'var(--gray-300)', flexShrink: 0 }} aria-hidden="true">↗</span>
    </button>
  )
}

// ── VenueCard — static detail card for WorkScreen ─────────────────────────
function VenueCard({ venue }) {
  const colors = venueColors[venue.id] || { bg: '#111', text: '#fff' }

  return (
    <div className="venue-card">
      <div className="venue-card-header" style={{ background: colors.bg }}>
        <div className="venue-name-badge">{venue.name}</div>
        <div className="venue-full-name">{venue.fullName}</div>
        <div className="venue-neighborhood">{venue.neighborhood}</div>
      </div>
      <div className="venue-card-body">
        <div className="venue-detail-row">
          <span className="venue-detail-icon">📍</span>
          <span>{venue.address}</span>
        </div>
        <div className="venue-detail-row">
          <span className="venue-detail-icon">🕐</span>
          <span>{venue.hours}</span>
        </div>
        <div className="venue-detail-row" style={{ borderBottom: 'none' }}>
          <span className="venue-detail-icon">ℹ️</span>
          <span>{venue.description}</span>
        </div>
        <a
          href={venue.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="venue-btn"
        >
          Get tickets & plan your visit →
        </a>
        <a
          href={venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="map-btn"
        >
          📍 Open in Maps
        </a>
      </div>
    </div>
  )
}

// ── App Root ──────────────────────────────────────────────────────────────

// ── Bottom Navigation Bar ─────────────────────────────────────────────────
// Single stroked icon system (1.8px stroke, Lucide-style inline SVGs).
// No emoji as UI icons — emoji stay allowed inside content only.
const NAV_ICON_PATHS = {
  compass:  <><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>,
  mapPin:   <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
  utensils: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></>,
  moon:     <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>,
  bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>,
  bell:     <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  user:     <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  plus:     <><path d="M5 12h14"/><path d="M12 5v14"/></>,
  search:   <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
  dots:     <><circle cx="9" cy="9" r="1.4"/><circle cx="15" cy="9" r="1.4"/><circle cx="9" cy="15" r="1.4"/><circle cx="15" cy="15" r="1.4"/></>,
  logOut:   <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></>,
  lock:     <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  mail:     <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
  code:     <><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></>,
  trash:    <><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  key:      <><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></>,
  heart:    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>,
}
// Icons that read correctly when solid-filled. Multi-part icons (compass,
// map-pin, utensils) turn into blobs when filled — those signal "active" with
// a heavier stroke instead.
const NAV_ICON_FILLABLE = new Set(['bookmark', 'moon', 'bell'])
function NavIcon({ name, size = 22, color = 'currentColor', fill = 'none' }) {
  const wantsFill = fill !== 'none' && NAV_ICON_FILLABLE.has(name)
  const active = fill !== 'none'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={wantsFill ? color : 'none'}
      stroke={color} strokeWidth={active && !wantsFill ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block' }} aria-hidden="true">
      {NAV_ICON_PATHS[name]}
    </svg>
  )
}

function BottomNav({ activeTab, onTabPress, savedCount, onAddPlace }) {
  // Four tabs, no conceptual overlap. Eat folded into Explore (it already
  // lives inside the mood flow's "Eat" category), and Tonight — the
  // un-Google-able signature feature — is promoted as the accent-colored
  // hero of the bar instead of the old "Eat" center button.
  const tabs = [
    { id: 'explore', icon: 'compass',  label: 'Explore' },
    { id: 'tonight', icon: 'moon',     label: 'Events', accent: true },
    { id: 'map',     icon: 'mapPin',   label: 'Map' },
    { id: 'saved',   icon: 'bookmark', label: 'My Trip' },
  ]
  return (
    <div style={{
      position: 'fixed', bottom: 0,
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      // Tuck the bar closer to the home indicator: shave 12px off the safe-area
      // reserve (max() keeps older no-inset phones at zero, not negative).
      height: 'calc(64px + max(env(safe-area-inset-bottom, 0px) - 12px, 0px))',
      paddingBottom: 'max(calc(env(safe-area-inset-bottom, 0px) - 12px), 0px)',
      background: 'rgba(243,235,220,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(33,27,20,0.10)',
      boxShadow: '0 -8px 28px rgba(33,27,20,0.06)',
      display: 'flex', zIndex: 200,
    }}>
      {tabs.map(({ id, icon, label, accent }) => {
        const active = activeTab === id
        const badge = id === 'saved' && savedCount > 0 ? savedCount : null
        // The ACTIVE tab is the only one that reads as selected: accent color +
        // bold label + filled icon. Tonight keeps a subtle accent icon tint when
        // inactive (its signature), but its label goes gray/normal like the other
        // inactive tabs — so the bar always shows which screen you're actually on.
        const iconColor = active ? 'var(--accent)' : (accent ? 'var(--accent)' : 'var(--ink-3)')
        const labelColor = active ? 'var(--accent)' : 'var(--gray-500)'
        return (
          <button key={id} onClick={() => onTabPress(id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: iconColor,
            position: 'relative',
          }}>
            <NavIcon name={icon} size={22} fill={active ? 'solid' : 'none'} />
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: labelColor }}>{t(label)}</span>
            {badge && (
              <span style={{
                position: 'absolute', top: 7, right: '50%', transform: 'translateX(18px)',
                background: 'var(--love)', color: '#fff',
                fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 999, minWidth: 18,
                textAlign: 'center', lineHeight: 1.1,
                boxShadow: '0 1px 3px rgba(255,77,125,0.4)',
                border: '1.5px solid var(--white)',
              }}>{badge > 99 ? '99+' : badge}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Map Screen ────────────────────────────────────────────────────────────
// Pin colors now use the SAME category palette as the Explore / Tonight
// chips and tags, so colors mean the same thing app-wide. A legend on the
// map decodes them.
const MAP_DOMAIN_COLORS = {
  visual_art:     '#5B7FA6',
  jazz:           '#C8823A',
  classical_music:'#7B6FA6',
  sports:         '#4A8C5C',
  architecture:   '#8C6A4A',
  theater:        '#A65B7B',
  history:        '#6A6A6A',
  hip_hop:        '#3A3A8C',
  food:           '#C1876B',
}
const MAP_DOMAIN_LEGEND_LABELS = {
  visual_art: 'Art', jazz: 'Jazz', classical_music: 'Classical', sports: 'Sports',
  architecture: 'Architecture', theater: 'Theater', history: 'History', hip_hop: 'Hip-Hop', food: 'Food',
}

const MAP_FILTERS = [
  { id: 'all',             label: 'All' },
  { id: 'visual_art',      label: 'Art' },
  { id: 'jazz',            label: 'Jazz' },
  { id: 'classical_music', label: 'Classical' },
  { id: 'food',            label: 'Food' },
  { id: 'sports',          label: 'Sports' },
  { id: 'architecture',    label: 'Architecture' },
  { id: 'theater',         label: 'Theater' },
  { id: 'history',         label: 'History' },
  { id: 'hip_hop', label: 'Hip-Hop' },
]

// Session cache for MapScreen's Neighborhoods view (survives the unmount that
// happens when a venue page opens inside the Map tab).
let _mapSchemCache = null

// ── AreaPickCard — in-sheet place card for the Map tab's area sheet. Photo up
// top (curated imageUrl, or Google photo for imports), save + map actions, and
// a back arrow instead of page navigation. Extracted as a component so the
// Google-photo hook is legal here.
function AreaPickCard({ pick: p, onBack, onShowMap, onFull = null, savedItems = {}, toggleSave = () => {} }) {
  const v = p.seed ? null : venues[p.id]
  const g = useGooglePhoto(p.seed ? p : null)
  const [imgFailed, setImgFailed] = React.useState(false)
  const imageSrc = (p.seed ? g?.photoUrl : v?.imageUrl) || null
  const image = imageSrc && !imgFailed ? imageSrc : null
  const desc = p.seed ? p.blurb : (v?.description || '')
  const tip = p.seed ? p.tip : (v?.insiderTip || '')
  const metaBits = [p.neighborhood, v?.price ? '$'.repeat(v.price) : null, v?.hours || null].filter(Boolean)
  const saved = !!savedItems[p.seed ? `user_venue:${p.id}` : `venue:${p.id}`]
  const backBtn = (overlay) => (
    <button onClick={onBack} aria-label="Back to list" style={{
      border: 'none', borderRadius: 999, width: 32, height: 32,
      cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      ...(overlay
        ? { position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.92)', color: 'var(--ink)', boxShadow: '0 2px 8px rgba(15,23,42,0.25)' }
        : { background: 'var(--gray-100)', color: 'var(--ink)' }),
    }}>←</button>
  )
  return (
    <>
      {image ? (
        <div style={{ position: 'relative', margin: '0 0 12px' }}>
          <img src={image} alt={p.name} onError={() => setImgFailed(true)}
            style={{ display: 'block', width: '100%', height: 140, objectFit: 'cover', borderRadius: 14 }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.45))' }} />
          {backBtn(true)}
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 10, fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}>{p.name}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          {backBtn(false)}
          <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 600, color: 'var(--ink)', flex: 1, minWidth: 0 }}>{p.name}</div>
        </div>
      )}
      {metaBits.length > 0 && (
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginBottom: desc ? 8 : 12 }}>{metaBits.join(' · ')}</div>
      )}
      {desc && <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', margin: '0 0 10px' }}>{desc}</p>}
      {tip && (
        <div style={{ background: 'rgba(190,77,43,0.08)', border: '1px solid rgba(190,77,43,0.18)', borderRadius: 10, padding: '9px 12px', fontSize: 13, lineHeight: 1.45, color: 'var(--ink-2)', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, color: 'var(--accent-text)' }}>Tip · </span>{tip}
        </div>
      )}
      <button onClick={() => toggleSave(p.seed ? 'user_venue' : 'venue', p.id)} style={{
        width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: saved ? 'var(--ink)' : 'var(--accent)', color: '#fff', borderRadius: 12,
        padding: '12px 16px', fontSize: 13.5, fontWeight: 700, marginBottom: 8,
        opacity: saved ? 0.85 : 1,
      }}>{saved ? '✓ In My Trip' : '+ Add to My Trip'}</button>
      <button onClick={onShowMap} style={{
        width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: 'var(--gray-900)', color: '#fff', borderRadius: 12,
        padding: '12px 16px', fontSize: 13.5, fontWeight: 700,
      }}>Show on the live map</button>
      {!p.seed && onFull && (
        <button onClick={onFull} style={{
          width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          background: 'none', color: 'var(--accent-text)', padding: '11px 16px 2px',
          fontSize: 13, fontWeight: 700,
        }}>Full details →</button>
      )}
    </>
  )
}

function MapScreen({ onSelectVenue, highlight = null, onClearHighlight = null, savedItems = {}, toggleSave = () => {} }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef  = useRef(null)
  const markersRef      = useRef([])
  const [filter, setFilter]         = useState('all')
  const [selectedVenueId, setSelectedVenueId] = useState(null)
  // Map tab has two views: the detailed neighborhood schematic and the live
  // Leaflet pin map. Arriving via "View on map" (highlight) jumps to the live map.
  // MapScreen unmounts whenever "Full details" opens a venue page in this tab,
  // losing all view state — so back landed users on the live map instead of the
  // neighborhood list they came from. The session cache below restores the
  // schematic view + open area sheet on remount (list view, not the card).
  const _schemC = _mapSchemCache
  const [view, setView]             = useState(_schemC?.view || 'real')  // live Map is the default view
  const [schemArea, setSchemArea]   = useState(_schemC?.schemArea || null)
  const [schemBorough, setSchemBorough] = useState(_schemC?.schemBorough || 'manhattan')  // Neighborhoods view: manhattan | brooklyn
  const [areaSheet, setAreaSheet]   = useState(_schemC?.areaSheet || null)  // { areaId, label, picks } | null — schematic tap payoff
  const [areaDetail, setAreaDetail] = useState(null)  // pick from the sheet → in-sheet detail card (not a page)
  useEffect(() => { _mapSchemCache = { view, schemArea, schemBorough, areaSheet } }, [view, schemArea, schemBorough, areaSheet])
  const [userLoc, setUserLoc]       = useState(null)   // {lat,lng} | null
  const [geoStatus, setGeoStatus]   = useState('idle') // idle | locating | denied
  const userMarkerRef = useRef(null)

  // Load Leaflet JS dynamically (CSS already in index.html)
  useEffect(() => {
    if (window.L) return
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => { /* triggers re-render via mapReady */ setMapReady(true) }
    document.head.appendChild(script)
  }, [])
  const [mapReady, setMapReady] = useState(!!window.L)

  // Init map — re-runs when Leaflet finishes loading
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return
    if (!window.L) return
    const L = window.L

    const map = L.map(mapContainerRef.current, {
      center: [40.754, -73.983],
      zoom: 12,
      zoomControl: false,
    })
    // Light Carto Positron basemap — matches the app's pastel UI far better
    // than default OSM raster and makes the category pin colors pop.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapInstanceRef.current = map

    return () => { map.remove(); mapInstanceRef.current = null }
  }, [mapReady])

  // Sync markers when filter or saved-set changes — saved venues get a larger, brighter marker so users can see what they've collected
  useEffect(() => {
    const L = window.L
    const map = mapInstanceRef.current
    if (!L || !map) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    Object.entries(venueCoords).forEach(([venueId, info]) => {
      if (filter !== 'all' && info.domain !== filter) return
      const venue = venues[venueId]
      if (!venue) return
      const color = MAP_DOMAIN_COLORS[info.domain] || '#666'
      const isSaved = !!savedItems[`venue:${venueId}`]

      // Saved venues: bigger, pink outline ring, full opacity to pop on the map
      const marker = L.circleMarker([info.lat, info.lng], isSaved ? {
        radius: 11,
        fillColor: color,
        color: '#ff4d7d',
        weight: 3,
        fillOpacity: 1,
      } : {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2.5, // thicker white halo so muted category colors stay glanceable on the light basemap
        fillOpacity: 0.95,
      })
      marker.on('click', () => setSelectedVenueId(venueId))
      marker.bindTooltip(venue.name, { permanent: false, direction: 'top', offset: [0, -8] })
      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }, [filter, mapReady, savedItems])

  // Pan to + open popup when arriving via "View on Map".
  // mapReady is in the dependency list so this re-runs after Leaflet finishes loading on the first visit —
  // otherwise venues far from the default Manhattan center (e.g. Citi Field in Queens, Yankee Stadium in the Bronx)
  // appear off-screen because the pan call bailed before the map instance existed.
  useEffect(() => {
    if (!highlight || !mapReady || !mapInstanceRef.current || !window.L) return
    setView('real')
    setSelectedVenueId(highlight)
    const info = venueCoords[highlight]
    if (info) mapInstanceRef.current.setView([info.lat, info.lng], 15)
    if (onClearHighlight) onClearHighlight()
  }, [highlight, mapReady])

  // Render the user's location as a ★ on the live map (only in the real view).
  useEffect(() => {
    const L = window.L; const map = mapInstanceRef.current
    if (!L || !map) return
    if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null }
    if (userLoc && view === 'real') {
      const icon = L.divIcon({ className: '', html: '<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,.45))">⭐</div>', iconSize: [22, 22], iconAnchor: [11, 11] })
      userMarkerRef.current = L.marker([userLoc.lat, userLoc.lng], { icon, zIndexOffset: 1000 }).addTo(map)
      userMarkerRef.current.bindTooltip('You are here', { direction: 'top', offset: [0, -10] })
    }
  }, [userLoc, view, mapReady])

  const selVenue = selectedVenueId ? venues[selectedVenueId] : null
  const selInfo  = selectedVenueId ? venueCoords[selectedVenueId] : null

  // Tap a neighborhood on the schematic → flip to the live map, centered there.
  // Tap a neighborhood on the schematic → open the picks sheet (the payoff is
  // "what's good there", not a bare pan). "See on live map" does the pan.
  const handleSchemSelect = (areaId) => {
    setSchemArea(areaId)
    setAreaDetail(null)
    if (!areaId) { setAreaSheet(null); return }
    setAreaSheet({ areaId, label: DETAIL_AREA_LABELS[areaId] || areaId, picks: picksForDetailArea(areaId) })
  }
  // "Show on live map" from a detail card — flip views, pan to the spot, and
  // (for curated venues) open its pin card so the user lands on the answer.
  const showPickOnMap = (p) => {
    setAreaSheet(null); setAreaDetail(null); setView('real')
    if (!p.seed) setSelectedVenueId(p.id)
    const m = mapInstanceRef.current
    if (m && typeof p.lat === 'number') setTimeout(() => { m.invalidateSize(); m.setView([p.lat, p.lng], 16) }, 60)
  }
  const panToArea = (areaId) => {
    const c = MANHATTAN_DETAIL_CENTERS[areaId] || BROOKLYN_DETAIL_CENTERS[areaId]
    if (!c) return
    setAreaSheet(null)
    setView('real')
    const m = mapInstanceRef.current
    if (m) setTimeout(() => { m.invalidateSize(); m.setView([c[0], c[1]], c[2]) }, 60)
  }

  // "Near me" — geolocate, flip to the live map, pan, and drop the ★.
  const handleNearMeMap = async () => {
    if (geoStatus === 'denied' || geoStatus === 'locating') return
    setGeoStatus('locating')
    try {
      const { lat, lng } = await getUserLocation()
      setGeoStatus('idle'); setUserLoc({ lat, lng }); setView('real')
      const m = mapInstanceRef.current
      if (m) setTimeout(() => { m.invalidateSize(); m.setView([lat, lng], 15) }, 80)
    } catch (e) { setGeoStatus('denied') }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', position: 'fixed',
      top: 'env(safe-area-inset-top, 0px)',
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))',
      zIndex: 1,
    }}>
      {/* View toggle — Neighborhoods (schematic) vs Map (live pins) */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 14px 6px', background: 'var(--canvas)', flexShrink: 0 }}>
        <div style={{ width: 78, flexShrink: 0 }} />
        <div role="tablist" style={{ display: 'inline-flex', background: 'var(--gray-100)', borderRadius: 999, padding: 3, margin: '0 auto' }}>
          {[{ id: 'real', label: 'Map' }, { id: 'schematic', label: 'Neighborhoods' }].map(opt => {
            const on = view === opt.id
            return (
              <button key={opt.id} role="tab" aria-selected={on} onClick={() => setView(opt.id)} style={{
                border: 'none', cursor: 'pointer', padding: '6px 16px', borderRadius: 999,
                fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit',
                background: on ? 'var(--white)' : 'transparent',
                color: on ? 'var(--gray-900)' : 'var(--gray-500)',
                boxShadow: on ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                transition: 'background 120ms ease, color 120ms ease',
              }}>{opt.label}</button>
            )
          })}
        </div>
        <button onClick={handleNearMeMap} disabled={geoStatus === 'denied'} title="Show my location" style={{
          width: 78, flexShrink: 0, textAlign: 'right', border: 'none', background: 'none',
          cursor: geoStatus === 'denied' ? 'default' : 'pointer', fontFamily: 'inherit',
          fontSize: 11.5, fontWeight: 700, color: geoStatus === 'denied' ? 'var(--gray-400)' : 'var(--accent-text)',
        }}>{geoStatus === 'locating' ? '…' : geoStatus === 'denied' ? 'Loc. off' : '📍 Near me'}</button>
      </div>

      {/* Filter chips — live-map categories only */}
      {view === 'real' && (
      <div style={{
        padding: '4px 14px 8px', display: 'flex', gap: 8, overflowX: 'auto',
        flexShrink: 0, scrollbarWidth: 'none', background: 'var(--canvas)',
        borderBottom: '1px solid var(--gray-100)',
      }}>
        {MAP_FILTERS.map(f => (
          <button key={f.id} onClick={() => { setFilter(f.id); setSelectedVenueId(null) }} style={{
            padding: '5px 13px', borderRadius: 20, border: 'none', flexShrink: 0,
            background: filter === f.id ? 'var(--gray-900)' : 'var(--gray-100)',
            color: filter === f.id ? '#fff' : 'var(--gray-600)',
            fontSize: 12, fontWeight: filter === f.id ? 700 : 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{f.label}</button>
        ))}
      </div>
      )}

      {/* Map area — live Leaflet map always mounted; schematic overlays it so
          Leaflet never unmounts (keeps its lifecycle + markers intact). */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />
        {view === 'schematic' && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1100, background: 'var(--canvas)', display: 'flex', flexDirection: 'column' }}>
            {/* Borough toggle — Manhattan | Brooklyn */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 2px', background: '#e7eef6', flexShrink: 0 }}>
              <div role="tablist" style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.75)', borderRadius: 999, padding: 3, boxShadow: '0 1px 4px rgba(29,39,51,0.10)' }}>
                {['manhattan', 'brooklyn'].map(b => {
                  const on = schemBorough === b
                  return (
                    <button key={b} role="tab" aria-selected={on}
                      onClick={() => { setSchemBorough(b); setSchemArea(null); setAreaSheet(null); setAreaDetail(null) }}
                      style={{
                        border: 'none', cursor: 'pointer', padding: '6px 16px', borderRadius: 999,
                        fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit', textTransform: 'capitalize',
                        background: on ? 'var(--gray-900)' : 'transparent',
                        color: on ? '#fff' : 'var(--gray-500)',
                        transition: 'background 120ms ease, color 120ms ease',
                      }}>{b}</button>
                  )
                })}
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              {schemBorough === 'brooklyn'
                ? <BrooklynDetailMap selectedArea={schemArea} onSelectArea={handleSchemSelect} />
                : <ManhattanDetailMap selectedArea={schemArea} onSelectArea={handleSchemSelect} />}
            </div>

            {/* ── Area picks sheet — the tap payoff: top spots in the tapped
                neighborhood, each opening its venue page; live map is secondary. ── */}
            {areaSheet && (
              <>
                <div onClick={() => handleSchemSelect(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.28)' }} />
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  background: 'var(--card)', borderRadius: '18px 18px 0 0',
                  boxShadow: '0 -10px 30px rgba(15,23,42,0.22)',
                  padding: '14px 18px calc(14px + env(safe-area-inset-bottom, 0px))',
                  maxHeight: '70%', overflowY: 'auto',
                }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--gray-200)', margin: '0 auto 12px' }} />
                  {areaDetail ? (
                    <AreaPickCard
                      pick={areaDetail}
                      onBack={() => setAreaDetail(null)}
                      onShowMap={() => showPickOnMap(areaDetail)}
                      onFull={areaDetail.seed ? null : () => onSelectVenue(areaDetail.id)}
                      savedItems={savedItems}
                      toggleSave={toggleSave}
                    />
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>{areaSheet.label}</div>
                        <button onClick={() => handleSchemSelect(null)} aria-label="Close" style={{ border: 'none', background: 'var(--gray-100)', borderRadius: 999, width: 28, height: 28, cursor: 'pointer', color: 'var(--gray-500)', fontSize: 14, lineHeight: 1 }}>✕</button>
                      </div>
                      {areaSheet.picks.length === 0 ? (
                        <div style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.5, padding: '4px 0 12px' }}>
                          No curated spots mapped here yet — try the live map for everything nearby.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                          {areaSheet.picks.map(p => (
                            <button key={p.id} onClick={() => setAreaDetail(p)} style={{
                              display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
                              background: 'var(--canvas)', border: '1px solid rgba(33,27,20,0.08)', borderRadius: 12,
                              padding: '11px 14px', cursor: 'pointer', fontFamily: 'inherit',
                            }}>
                              <span style={{ width: 9, height: 9, borderRadius: 999, flexShrink: 0, background: p.seed ? ({ food: '#c1876b', outdoors: '#6fae8e', culture: '#8aa4c0' }[p.category] || '#b0a698') : (MAP_DOMAIN_COLORS[p.domain] || '#888') }} />
                              <span style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                                {p.neighborhood && <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>{p.neighborhood}</span>}
                              </span>
                              <span style={{ color: 'var(--gray-300)', fontSize: 18, flexShrink: 0 }}>›</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <button onClick={() => panToArea(areaSheet.areaId)} style={{
                        width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        background: 'var(--gray-900)', color: '#fff', borderRadius: 12,
                        padding: '12px 16px', fontSize: 13.5, fontWeight: 700,
                      }}>See {areaSheet.label} on the live map</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Legend — decodes the category pin colors; collapses to the active
          category when a filter is applied. Hidden while a venue card is open. */}
      {view === 'real' && !selVenue && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: 14, padding: '8px 12px',
          boxShadow: '0 6px 18px rgba(29,39,51,0.14)',
          maxWidth: 150,
        }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>
            Legend
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {Object.entries(MAP_DOMAIN_COLORS)
              .filter(([d]) => filter === 'all' || filter === d)
              .map(([d, c]) => (
                <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 999, background: c, border: '1.5px solid #fff', boxShadow: '0 0 0 1px rgba(29,39,51,0.12)', flexShrink: 0 }} />
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink)' }}>{MAP_DOMAIN_LEGEND_LABELS[d] || d}</span>
                </div>
              ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, paddingTop: 4, borderTop: '1px solid var(--gray-100)' }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: '#fff', border: '2px solid var(--love)', flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink)' }}>Saved</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected venue card */}
      {view === 'real' && selVenue && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12, right: 12,
          background: 'var(--white)', borderRadius: 16, padding: '14px 16px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.22)', zIndex: 1000,
        }}>
          {/* Header row: domain badge + heart + close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: MAP_DOMAIN_COLORS[selInfo?.domain] || '#666',
            }}>{domains[selInfo?.domain]?.name || ''}</div>
            {/* In-place add-to-trip from the map popup */}
            {(() => {
              const isSaved = !!savedItems[`venue:${selectedVenueId}`]
              return (
                <button
                  onClick={() => toggleSave('venue', selectedVenueId)}
                  aria-label={isSaved ? 'Remove from My Trip' : 'Add to My Trip'}
                  style={{
                    marginLeft: 'auto',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    height: 26, padding: '0 11px', borderRadius: 999,
                    background: isSaved ? 'var(--ink)' : 'var(--gray-100)',
                    color: isSaved ? '#fff' : 'var(--gray-700)',
                    border: 'none', cursor: 'pointer',
                    fontSize: 11.5, fontWeight: 700, lineHeight: 1, whiteSpace: 'nowrap',
                    transition: 'background 120ms ease, color 120ms ease',
                  }}>
                  {isSaved ? '✓ Saved' : '+ Add to Trip'}
                </button>
              )
            })()}
            <button onClick={() => setSelectedVenueId(null)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 16, color: 'var(--gray-400)', padding: '0 2px', lineHeight: 1,
            }}>&#x2715;</button>
          </div>
          {/* Venue name */}
          <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--gray-900)', lineHeight: 1.2, marginBottom: 8 }}>{selVenue.name}</div>
          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 12 }}>
            {selInfo?.address && (
              <div style={{ fontSize: 12, color: 'var(--gray-600)', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>&#x1F4CD;</span>
                <span>{selInfo.address}</span>
              </div>
            )}
            {selVenue.bookingNote && (
              <div style={{ fontSize: 12, color: 'var(--gray-600)', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>&#x1F550;</span>
                <span>{selVenue.bookingNote}</span>
              </div>
            )}
            {selVenue.admissionCost && (
              <div style={{ fontSize: 12, color: 'var(--gray-600)', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>&#x1F3AB;</span>
                <span>{selVenue.admissionCost}</span>
              </div>
            )}
          </div>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={`https://maps.google.com/maps?q=${selInfo?.lat},${selInfo?.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, background: 'var(--gray-100)', color: 'var(--gray-900)', border: 'none',
                borderRadius: 10, padding: '10px 0', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                textDecoration: 'none', textAlign: 'center', display: 'block',
              }}
            >&#x1F4CD; Directions</a>
            <button onClick={() => onSelectVenue(selectedVenueId)} style={{
              flex: 1, background: 'var(--gray-900)', color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 0', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            }}>Explore ›</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tonight Screen ────────────────────────────────────────────────────────
const TONIGHT_DOMAIN_COLORS = {
  visual_art:     '#1a56db',
  jazz:           '#0369a1',
  classical_music:'#854d0e',
  theater:        '#7c3aed',
  hip_hop:         '#b45309',
  sports:         '#dc2626',
  architecture:   '#059669',
  history:        '#92400e',
}
const TONIGHT_DOMAIN_LABELS = {
  visual_art: 'Art', jazz: 'Jazz', classical_music: 'Classical',
  theater: 'Theater', sports: 'Sports', architecture: 'Architecture', history: 'History',
  hip_hop:         'Hip-Hop', food: 'Food',
}

const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
// Rewrite a curated pick's dateNote for the selected night so relative words never
// lie: "Tonight · Doors 8pm" reads "Friday · Doors 8pm" when previewing Friday.
function relativeDateNote(note, dayIdx, todayIdx) {
  if (!note || dayIdx === todayIdx) return note
  const day = DAY_NAMES_FULL[dayIdx]
  return note.replace(/^Tonight\b/i, day).replace(/^Today\b/i, day)
}

// Sheet-native venue card for the Tonight bottom sheet — mirrors EventDetail's
// clean layout (contained rounded image, label, title, key facts, editorial hook,
// clear actions) instead of cramming the full VenueScreen page into the sheet.
function VenueSheet({ venueId, blurb, savedItems = {}, toggleSave = () => {}, onFullPage = () => {} }) {
  const [failedSrc, setFailedSrc] = React.useState(null)  // broken image → fall back to gradient
  const venue = venues[venueId]
  if (!venue) return null
  const colors = venueColors[venueId] || { bg: '#8aa4c0', text: '#fff' }
  const photo = venueImages[venueId] || getWorksAtVenue(venueId).find(w => w.imageUrl)?.imageUrl || null
  const domainId = VENUE_DOMAIN[venueId]
  const kindLabel = domainId === 'food' ? 'Restaurant' : domainId ? (domains[domainId]?.name || 'NYC Stoop pick') : (venue.isRestaurant ? 'Restaurant' : 'NYC Stoop pick')
  const isSaved = !!savedItems[`venue:${venueId}`]
  const why = blurb || firstSentence(venue.insiderTip, 160) || ''
  const place = [venue.neighborhood, venue.fullName && venue.fullName !== venue.name ? venue.fullName : null].filter(Boolean).join(' · ')
  const open = (url) => { if (url) { try { window.open(url, '_blank', 'noopener') } catch (e) {} } }
  const Row = ({ icon, children }) => children ? (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8, fontSize: 14, color: 'var(--ink-2)' }}>
      <span style={{ flexShrink: 0 }} aria-hidden="true">{icon}</span><span style={{ lineHeight: 1.45 }}>{children}</span>
    </div>
  ) : null
  return (
    <div style={{ padding: '0 20px calc(40px + env(safe-area-inset-bottom, 0px))' }}>
      <div style={{ height: 150, borderRadius: 18, overflow: 'hidden', marginBottom: 16, background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}B0)` }}>
        {photo && photo !== failedSrc && <img src={photo} alt="" onError={() => setFailedSrc(photo)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.bg, marginBottom: 6 }}>{kindLabel}</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.22, color: 'var(--ink)', margin: '0 0 10px' }}>{venue.name}</h2>
      {why && (
        <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{why}</p>
      )}
      <Row icon="📍">{place}</Row>
      <Row icon="💰">{venue.admissionCost}</Row>
      <Row icon="⏱">{venue.visitDuration}</Row>
      {/* Primary action sits directly under the facts (above the editorial blurb)
          so it's visible the instant the sheet peeks open — adding to the trip is
          the whole point of these cards. */}
      <button onClick={() => toggleSave('venue', venueId)} style={{ width: '100%', marginTop: 4, border: 'none', borderRadius: 999, padding: '14px', background: isSaved ? 'var(--ink)' : 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: isSaved ? 'none' : 'var(--shadow-accent)' }}>
        {isSaved ? '✓ Saved to My Trip' : '+ Add to My Trip'}
      </button>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button onClick={() => open(venue.mapUrl)} style={{ flex: 1, border: '1.5px solid var(--gray-200)', borderRadius: 999, padding: '12px', background: 'var(--white)', color: 'var(--ink)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>📍 Directions</button>
        <button onClick={onFullPage} style={{ flex: 1, border: '1.5px solid var(--gray-200)', borderRadius: 999, padding: '12px', background: 'var(--white)', color: 'var(--ink)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Full details →</button>
      </div>
    </div>
  )
}

// Rank live (Ticketmaster) events for the Tonight feed: a rough notability score
// (marquee venue + price + has-photo), then round-robin across event types so one
// category (usually concerts) doesn't flood the list before the cap.
const MARQUEE_VENUE = /madison square garden|barclays|radio city|carnegie|lincoln center|beacon theatre|brooklyn steel|blue note|village vanguard|bowery ballroom|webster hall|terminal 5|brooklyn bowl|apollo|forest hills|kings theatre|rooftop at pier 17|irving plaza|sony hall|gramercy theatre|le poisson rouge|racket nyc/i
function liveEventScore(e) {
  let s = 0
  if (MARQUEE_VENUE.test(e.location || '')) s += 100
  const m = /\$(\d+)/.exec(e.priceText || '')
  if (m) s += Math.min(parseInt(m[1], 10), 200) / 4   // pricier ≈ bigger draw (capped)
  if (e.image) s += 10
  return s
}
function rankLiveEvents(events) {
  const byKind = {}
  events.forEach(e => { (byKind[e.kindLabel] = byKind[e.kindLabel] || []).push(e) })
  Object.values(byKind).forEach(arr => arr.sort((a, b) => liveEventScore(b) - liveEventScore(a) || a.date - b.date))
  const kinds = Object.keys(byKind).sort((a, b) => liveEventScore(byKind[b][0]) - liveEventScore(byKind[a][0]))
  const out = []
  let added = true
  while (added) {
    added = false
    for (const k of kinds) { const e = byKind[k].shift(); if (e) { out.push(e); added = true } }
  }
  return out
}

// ── EventsBrowser — the heart of the Tonight tab. Browses the live catalog
// (Ticketmaster: concerts, comedy, theatre, sports, family) + NYC Open Data
// (free street events & markets), organized by TIME RANGE (tonight / this
// weekend / this week) and CATEGORY. Tapping a card opens the shared event
// sheet (tickets · directions · add to calendar). ──
function EventsBrowser({ onNavigate = () => {} }) {
  const [range, setRange] = React.useState('tonight')   // 'tonight' | 'weekend' | 'week'
  const [category, setCategory] = React.useState('picks')   // 'picks' (curated 20) | music | comedy | ...
  // "Where are you?" borough scope — 'all' | 'Manhattan' | 'Brooklyn' | ...
  // Always defaults to All NYC (the full feed); the user opts into a borough
  // per visit. Events carry a borough (from the venue city).
  const [areaScope, setAreaScope] = React.useState('all')
  const [areaSheetOpen, setAreaSheetOpen] = React.useState(false)
  const setArea = (b) => setAreaScope(b)
  // Initialise from the session cache so re-opening the Tonight tab renders the
  // events on the first frame (no loading flash); only the very first load is null.
  const [pool, setPool] = React.useState(() => {
    const c = getThisWeekCached()
    return c ? [...(c.events || []), ...(c.markets || [])] : null
  })
  const [showAll, setShowAll] = React.useState(false)
  React.useEffect(() => {
    let alive = true
    fetchThisWeek()
      .then(({ events = [], markets = [] }) => { if (alive) setPool([...events, ...markets]) })
      .catch(() => { if (alive) setPool(p => p || []) })
    return () => { alive = false }
  }, [])
  React.useEffect(() => { setShowAll(false) }, [range, category, areaScope])

  const today0 = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })()
  const dPlus = (n) => { const d = new Date(today0); d.setDate(d.getDate() + n); return d }
  const isDate = (d) => d instanceof Date && !isNaN(d)
  const sameDay = (d, t) => isDate(d) && d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()

  const inRange = (e) => {
    if (range === 'tonight') return sameDay(e.date, today0)
    if (!isDate(e.date)) return true                     // recurring markets → weekend & week
    if (range === 'week') return e.date >= today0 && e.date < dPlus(7)
    // weekend = upcoming Fri/Sat/Sun, EXCLUDING today (e.date >= tomorrow) so a
    // weekend-day "tonight" never also shows up under This weekend.
    const dow = e.date.getDay()
    return e.date >= dPlus(1) && e.date < dPlus(8) && (dow === 5 || dow === 6 || dow === 0)
  }
  const catOf = (e) => {
    if (e.source === 'permitted' || e.source === 'market') return 'free'
    if (e.kind === 'Music') return 'music'
    if (e.kind === 'Sports') return 'sports'
    if (e.kind === 'Family') return 'family'
    if (e.kind === 'Arts & Theatre') return /comed/i.test(`${e.genre || ''} ${e.title || ''}`) ? 'comedy' : 'theater'
    return 'other'
  }
  const CATS = [
    { key: 'picks', label: '★ Stoop picks' }, { key: 'music', label: 'Music' }, { key: 'comedy', label: 'Comedy' },
    { key: 'theater', label: 'Theater' }, { key: 'sports', label: 'Sports' }, { key: 'family', label: 'Family' },
    { key: 'free', label: 'Free' },
  ]
  const RANGES = [['tonight', 'Tonight'], ['weekend', 'This weekend'], ['week', 'This week']]

  const loading = pool === null
  // Free events are kept as long as they're real PUBLIC happenings — the junk and
  // private permits (birthdays, picnics, camps, hobby fields…) are already removed
  // upstream in normalizePermitted. We deliberately DON'T require an official link
  // here: iconic free events like Nathan's Hot Dog Contest or the July 4th
  // fireworks have no URL in the city data but are exactly what a user wants. Each
  // links to its curated official page when known (eventOfficialUrl), else a
  // jump-to-first-result search — which is useful precisely because the remaining
  // names are specific and real.
  const inRangeAll = (pool || []).filter(inRange)
  // Borough scope. The catalog is Manhattan-heavy, so we surface live per-borough
  // counts (hiding empties) and let the user pick "where they are"; downstream
  // counts/picks/list all run off the scoped set.
  const BOROUGHS = ['Manhattan', 'Brooklyn']   // the boroughs we cover
  const boroughCount = {}
  inRangeAll.forEach(e => { if (e.borough) boroughCount[e.borough] = (boroughCount[e.borough] || 0) + 1 })
  const inScope = areaScope === 'all' ? inRangeAll : inRangeAll.filter(e => e.borough === areaScope)
  const catCount = {}
  inScope.forEach(e => { const c = catOf(e); catCount[c] = (catCount[c] || 0) + 1 })
  const visibleCats = CATS.filter(c => c.key === 'picks' || (catCount[c.key] || 0) > 0)

  // "Stoop picks" — a curated ~20 instead of the overwhelming full list: dedupe
  // multi-night runs by title, prefer notable + image-rich events, then a
  // daily-seeded shuffle so the set feels fresh but stays stable within a day.
  const _hash = (s) => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
  const stoopPicks = (() => {
    const seen = new Set(); const uniq = []
    for (const e of inScope) { const k = (e.title || '').toLowerCase().trim(); if (!k || seen.has(k)) continue; seen.add(k); uniq.push(e) }
    // Image tier (2=own photo, 1=landmark, 0=borough) keeps curation preferring
    // events with real, specific photos now that every card resolves to *some* image.
    const quality = (e) => liveEventScore(e) + eventImagePick(e).tier * 12
    const seed = today0.getDate() + (range === 'tonight' ? 0 : range === 'weekend' ? 100 : 200)
    return [...uniq].sort((a, b) => quality(b) - quality(a)).slice(0, 45)
      .sort((a, b) => (_hash(a.id + seed) % 1000) - (_hash(b.id + seed) % 1000))
      .slice(0, 20)
  })()

  // Collapse multi-night runs (e.g. a Broadway show that plays every night)
  // to a single card — the soonest performance — so one show doesn't repeat
  // down a tab. The detail sheet / ticket search still surfaces the full run.
  const dedupeByTitle = (arr) => {
    const byTitle = new Map()
    for (const e of arr) {
      const k = (e.title || '').toLowerCase().trim()
      if (!k) { byTitle.set(Symbol(), e); continue }
      const prev = byTitle.get(k)
      const ed = isDate(e.date) ? e.date.getTime() : 8.64e15
      const pd = prev && isDate(prev.date) ? prev.date.getTime() : 8.64e15
      if (!prev || ed < pd) byTitle.set(k, e)
    }
    return [...byTitle.values()]
  }
  let filtered = category === 'picks' ? [...stoopPicks] : dedupeByTitle(inScope.filter(e => catOf(e) === category))
  filtered.sort((a, b) => {
    const ad = isDate(a.date) ? a.date.getTime() : 8.64e15
    const bd = isDate(b.date) ? b.date.getTime() : 8.64e15
    return ad - bd || (liveEventScore(b) - liveEventScore(a))
  })
  // Free can be long, so (like Stoop picks) cap it at a curated 20 — the soonest /
  // strongest free things — rather than every market in the city.
  if (category === 'free') filtered = filtered.slice(0, 20)
  // Every tab leads with a tight top 5 and folds the rest behind "Show all".
  const cap = 5
  const shown = showAll ? filtered : filtered.slice(0, cap)

  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const whenShort = (e) => {
    if (e.source === 'market') return e.days ? `Every ${e.days.split(/[,&]/)[0].trim()}` : 'Weekly'
    if (!isDate(e.date)) return ''
    const d = e.date
    const dayLabel = sameDay(d, today0) ? 'Today' : sameDay(d, dPlus(1)) ? 'Tomorrow' : `${WD[d.getDay()]} ${MO[d.getMonth()]} ${d.getDate()}`
    if (e.source === 'ticketmaster' && (d.getHours() || d.getMinutes())) {
      const h = (d.getHours() % 12) || 12, mm = d.getMinutes() ? ':' + String(d.getMinutes()).padStart(2, '0') : '', ap = d.getHours() < 12 ? 'am' : 'pm'
      return `${dayLabel} · ${h}${mm}${ap}`
    }
    return dayLabel
  }
  const rangeWord = range === 'tonight' ? 'tonight' : range === 'weekend' ? 'this weekend' : 'this week'

  return (
    <div style={{ padding: '4px 0 10px' }}>
      {/* Time-range segmented control */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 6, background: '#EBE0CD', border: '1px solid rgba(33,27,20,0.10)', borderRadius: 999, padding: 4 }}>
          {RANGES.map(([k, l]) => {
            const active = range === k
            return (
              <button key={k} onClick={() => setRange(k)} style={{
                flex: 1, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                padding: '9px 8px', borderRadius: 999, fontSize: 13, fontWeight: 700,
                background: active ? '#211B14' : 'transparent', color: active ? '#F3EBDC' : '#7A7062',
                transition: 'all 0.18s ease',
              }}>{l}</button>
            )
          })}
        </div>
      </div>

      {/* Location picker — "where are you?" → borough scope (pops the sheet) */}
      {!loading && (
        <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setAreaSheetOpen(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'inherit',
            padding: '7px 13px', borderRadius: 999, fontSize: 13, fontWeight: 700,
            background: areaScope === 'all' ? 'var(--card)' : 'var(--accent)',
            border: areaScope === 'all' ? '1px solid rgba(33,27,20,0.12)' : '1px solid var(--accent)',
            color: areaScope === 'all' ? 'var(--ink-2)' : '#fff',
          }}>
            <span aria-hidden="true">📍</span>
            <span>{areaScope === 'all' ? 'All NYC' : areaScope}</span>
            <span style={{ opacity: 0.7 }}>▾</span>
          </button>
          {areaScope !== 'all' && (
            <button onClick={() => setArea('all')} aria-label="Clear location" style={{
              border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            }}>Clear</button>
          )}
        </div>
      )}

      {/* Category chips — hidden on first load so we never flash "All 0" */}
      {!loading && (
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 20px 4px', scrollbarWidth: 'none' }}>
        {visibleCats.map(c => {
          const active = category === c.key
          return (
            <button key={c.key} onClick={() => setCategory(c.key)} style={{
              flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              padding: '7px 14px', borderRadius: 999, fontSize: 13, fontWeight: active ? 700 : 600,
              background: active ? 'var(--accent)' : 'var(--card)',
              border: active ? '1px solid var(--accent)' : '1px solid rgba(33,27,20,0.12)',
              color: active ? '#fff' : 'var(--ink-2)',
            }}>{c.label}</button>
          )
        })}
      </div>
      )}

      {/* Events list */}
      <div style={{ padding: '8px 20px 0' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0, 1, 2, 3].map(i => <div key={i} style={{ height: 98, borderRadius: 16, background: 'var(--gray-100)' }} />)}
          </div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ink-3)', fontSize: 14, padding: '40px 20px', lineHeight: 1.5 }}>
            {areaScope !== 'all'
              ? <>Nothing in <strong>{areaScope}</strong> {rangeWord} for this filter.</>
              : <>Nothing in this category {rangeWord} yet.<br />Try another filter or range.</>}
            {areaScope !== 'all' && (
              <div style={{ marginTop: 14 }}>
                <button onClick={() => setArea('all')} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 999, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>📍 Show all NYC</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {shown.map(e => {
              const img = eventHeroImage(e)
              const initial = (e.title || '?').trim().charAt(0).toUpperCase()
              return (
                <button key={e.id} onClick={() => onNavigate({ event: e })} style={{
                  width: '100%', display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                  background: 'var(--card)', border: '1px solid rgba(33,27,20,0.10)', borderRadius: 16, padding: 10,
                  boxShadow: '0 4px 14px rgba(33,27,20,0.05)',
                }}>
                  <div style={{ width: 78, height: 78, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: e.color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {img
                      ? <img src={img} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 30, color: 'rgba(255,255,255,0.4)' }}>{initial}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: e.color }}>{e.kindLabel}</div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, color: 'var(--ink)', margin: '2px 0', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {[whenShort(e), e.location, e.priceText].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--gray-300)', flexShrink: 0 }} aria-hidden="true">›</span>
                </button>
              )
            })}
            {!showAll && filtered.length > cap && (
              <button onClick={() => setShowAll(true)} style={{
                width: '100%', background: 'var(--gray-100)', border: 'none', cursor: 'pointer',
                borderRadius: 12, padding: '11px', fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', fontFamily: 'inherit',
              }}>Show all {category === 'picks' ? 'picks' : 'events'} →</button>
            )}
          </div>
        )}
      </div>

      {/* Location pop-out — pick your borough (live counts, empties hidden) */}
      <BottomSheet open={areaSheetOpen} onClose={() => setAreaSheetOpen(false)} fit>
        <div style={{ padding: '4px 20px 30px' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>Where are you?</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 16, lineHeight: 1.45 }}>Filter {rangeWord}&rsquo;s events by borough.</div>
          {[{ key: 'all', label: 'All NYC' }, ...BOROUGHS.map(b => ({ key: b, label: b })), { key: 'Queens', label: 'Queens', soon: true }].map(opt => {
            const active = areaScope === opt.key
            return (
              <button key={opt.key} disabled={opt.soon} onClick={opt.soon ? undefined : () => { setArea(opt.key); setAreaSheetOpen(false) }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, cursor: opt.soon ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: 'left',
                background: active ? 'rgba(190,77,43,0.10)' : 'var(--card)',
                border: active ? '1px solid var(--accent)' : '1px solid rgba(33,27,20,0.10)',
                borderRadius: 14, padding: '14px 16px', marginBottom: 8, opacity: opt.soon ? 0.6 : 1,
              }}>
                <span style={{ fontSize: 16 }} aria-hidden="true">{opt.key === 'all' ? '🗽' : '📍'}</span>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{opt.label}</span>
                {opt.soon
                  ? <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#92400e', background: '#fef3c7', padding: '3px 8px', borderRadius: 999 }}>Coming soon</span>
                  : (active && <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>)}
              </button>
            )
          })}
        </div>
      </BottomSheet>
    </div>
  )
}

function TonightScreen({ onNavigate, savedItems = {}, toggleSave = () => {}, onViewSaved = () => {}, onViewMap = null }) {
  const [tonightFilter, setTonightFilter] = React.useState('all')

  // Day-of-week tab — default to today. Lets residents preview what's
  // available on a specific night ("Is anything good on Wednesday?").
  // We use the same 0=Sun…6=Sat convention as Date.prototype.getDay() and
  // as the bestDays field in tonight.js.
  const todayIdx = new Date().getDay()
  const [dayIdx, setDayIdx] = React.useState(todayIdx)
  // (T3.12 — day-of-week tabs on This Week)

  // Per-pick domain palette — kept in sync with Explore so chips/headers match across tabs
  const domainColors = {
    jazz: '#C8823A', visual_art: '#5B7FA6', classical_music: '#7B6FA6',
    theater: '#A65B7B', sports: '#4A8C5C', architecture: '#8C6A4A',
    history: '#6A6A6A', hip_hop: '#3A3A8C',
  }

  // Does a pick run on a given weekday? For venue-linked picks we derive the real
  // EVENING performance days from the venue's weeklySchedule — so Hamilton (8pm
  // Tue–Sat, matinee-only Sunday, dark Monday) only appears on nights it actually
  // plays. Falls back to the hand-set bestDays, then to "every day".
  const DAY_IDX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }
  const isEveningTime = (t) => {
    const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(t || '')
    if (!m) return true
    let h = parseInt(m[1], 10) % 12
    if (/pm/i.test(m[3])) h += 12
    return h >= 17   // 5pm or later counts as an evening/late performance
  }
  const runsOn = (p, idx) => {
    const v = p.venueId && venues[p.venueId]
    const sched = v && Array.isArray(v.weeklySchedule) && v.weeklySchedule.length
      ? new Set(v.weeklySchedule.filter(e => isEveningTime(e.time)).map(e => DAY_IDX[e.day]).filter(d => d != null))
      : null
    if (sched && sched.size) return sched.has(idx)
    return !Array.isArray(p.bestDays) || p.bestDays.includes(idx)
  }

  // Per-domain counts — drives the filter row (hides empty filters, shows count badges).
  // Recomputed when the selected day changes so the chips and badge numbers
  // reflect what's actually on for that night, not the absolute catalog total.
  const counts = React.useMemo(() => {
    // Must match visiblePicks' filters (incl. dropping daytime) or the chip/day
    // counts will claim picks that the feed then filters out ("1" but nothing shows).
    const onDay = tonightPicks.filter(p => p.timeOfDay !== 'daytime' && runsOn(p, dayIdx))
    const c = { all: onDay.length }
    onDay.forEach(p => { c[p.domain] = (c[p.domain] || 0) + 1 })
    return c
  }, [dayIdx])

  const ALL_FILTERS = [
    { key: 'all',             label: 'All' },
    { key: 'jazz',            label: 'Jazz' },
    { key: 'visual_art',      label: 'Art' },
    { key: 'classical_music', label: 'Classical' },
    { key: 'theater',         label: 'Theater' },
    { key: 'architecture',    label: 'Architecture' },
    { key: 'sports',          label: 'Sports' },
    { key: 'history',         label: 'History' },
    { key: 'hip_hop',         label: 'Hip-Hop' },
  ]
  // Only show filters that have content. Removes the "tap and get an empty state" trust hit.
  const visibleFilters = ALL_FILTERS.filter(f => f.key === 'all' || (counts[f.key] || 0) > 0)

  // Day-of-week predicate — schedule-aware (see runsOn above).
  const dayMatches = (p) => runsOn(p, dayIdx)

  const visiblePicks = tonightPicks
    .filter(p => tonightFilter === 'all' || p.domain === tonightFilter)
    .filter(dayMatches)
    .filter(p => p.timeOfDay !== 'daytime')   // Tonight is an evening page — daytime picks don't belong here

  // Tonight = Evening + Late night only. "Daytime" is removed (off-theme), and
  // the old "In season" / untagged bucket folds into Evening so nothing is hidden.
  const SECTION_ORDER = [
    { key: 'evening',    label: 'Evening',     emoji: '🌆' },
    { key: 'late_night', label: 'Late night',  emoji: '🌙' },
  ]
  const sectionOf = (p) => p.timeOfDay === 'late_night' ? 'late_night' : 'evening'
  // Daily rotation: deterministically reorder picks by the selected day so the
  // evening lineup leads differently each night (stable within a given day).
  const seededShuffle = (arr, seed) => {
    const hash = (str) => { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
    return [...arr].sort((a, b) => hash(`${a.venueId || a.title || ''}:${seed}`) - hash(`${b.venueId || b.title || ''}:${seed}`))
  }
  const grouped = {}
  SECTION_ORDER.forEach(s => {
    grouped[s.key] = seededShuffle(visiblePicks.filter(p => sectionOf(p) === s.key), dayIdx)
  })

  // Live, ticketed events (Ticketmaster) for the selected night — the "what's
  // actually on, bookable right now" layer on top of the editorial picks.
  // Fails soft to [] when there's no API key, so the page is unchanged without it.
  const [liveEvents, setLiveEvents] = React.useState([])
  const [liveExpanded, setLiveExpanded] = React.useState(false)
  React.useEffect(() => {
    let alive = true
    fetchTicketmaster().then(evs => { if (alive) setLiveEvents(Array.isArray(evs) ? evs : []) }).catch(() => {})
    return () => { alive = false }
  }, [])
  const dayEvents = React.useMemo(() => {
    const offset = (dayIdx - todayIdx + 7) % 7
    const target = new Date(); target.setHours(0, 0, 0, 0); target.setDate(target.getDate() + offset)
    const sameDay = d => d instanceof Date && d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth() && d.getDate() === target.getDate()
    return liveEvents.filter(ev => sameDay(ev.date))
  }, [liveEvents, dayIdx, todayIdx])

  // How many of these picks has the user saved? Powers the saved-count link in the header.
  const savedCount = React.useMemo(
    () => tonightPicks.filter(p => savedItems[`venue:${p.venueId}`]).length,
    [savedItems]
  )

  // Live current-time anchor — updates every 30s so it actually feels alive on long sessions
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()]
  const hour24 = now.getHours()
  const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12
  const ampm = hour24 >= 12 ? 'PM' : 'AM'
  const minute = String(now.getMinutes()).padStart(2, '0')
  const partOfDay =
    hour24 < 6   ? 'early morning' :
    hour24 < 11  ? 'morning' :
    hour24 < 17  ? 'afternoon' :
    hour24 < 21  ? 'evening' :
                   'late evening'
  const timeAnchor = `It's ${dayName} ${partOfDay}, ${displayHour}:${minute} ${ampm}`

  // ── Tonight = ONE focused events browser. A second "Editor's picks" section
  // (its own day-strip + category filters) used to sit below the browser and
  // overwhelmed users with duplicate controls — so Tonight is now just the
  // header + the events browser. (Legacy layout below is intentionally
  // unreachable; safe to delete later.) ──
  return (
    <div className="screen" style={{ paddingBottom: 80 }}>
      <div className="home-header">
        <div className="section-row">
          <div className="home-wordmark">Events</div>
          {onViewMap && (<button className="see-all" onClick={onViewMap}>Map view</button>)}
        </div>
        <div className="home-subtitle">{`${dayName} · ${displayHour}:${minute} ${ampm}`}</div>
        <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 6, lineHeight: 1.4 }}>Live shows &amp; events across NYC</div>
        {savedCount > 0 && (
          <button onClick={onViewSaved} style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(190,77,43,0.12)', border: '1px solid rgba(190,77,43,0.35)', color: 'var(--accent-text)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <span>{savedCount} saved · Plan your trip →</span>
          </button>
        )}
      </div>
      <EventsBrowser onNavigate={onNavigate} />
    </div>
  )

  // eslint-disable-next-line no-unreachable
  return (
    <div className="screen" style={{ paddingBottom: 80 }}>
      {/* ── Header — light shell: big heading + day·time·count subline + Map view link ── */}
      <div className="home-header">
        <div className="section-row">
          {/* Heading follows the selected day so previewing Wednesday never says "Tonight" */}
          <div className="home-wordmark">
            {dayIdx === todayIdx ? 'Tonight' : `${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dayIdx]} night`}
          </div>
          {onViewMap && (
            <button className="see-all" onClick={onViewMap}>Map view</button>
          )}
        </div>
        <div className="home-subtitle">
          {dayIdx === todayIdx
            ? `${dayName} · ${displayHour}:${minute} ${ampm} · ${counts.all} idea${counts.all !== 1 ? 's' : ''}`
            : `${counts.all} idea${counts.all !== 1 ? 's' : ''} on that night`}
        </div>
        <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 6, lineHeight: 1.4 }}>
          Hand-picked by NYC editors · Refreshed weekly
        </div>
        {/* Saved-count link — appears only when there's at least 1 save. Jumps to Saved tab. */}
        {savedCount > 0 && (
          <button onClick={onViewSaved} style={{
            marginTop: 10,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(255,77,125,0.12)', border: '1px solid rgba(255,77,125,0.35)',
            color: '#d6336c', fontSize: 12, fontWeight: 700,
            cursor: 'pointer',
          }}>
            <span>{savedCount} saved · Plan your trip →</span>
          </button>
        )}
      </div>

      {/* ── Events browser — the live catalog, by range + category (primary) ── */}
      <EventsBrowser onNavigate={onNavigate} />

      {/* ── Editor's picks — hand-picked venues, by night (secondary) ── */}
      <div style={{ padding: '22px 20px 0' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 25, margin: 0, letterSpacing: '0.01em', color: 'var(--ink)' }}>Editor&rsquo;s picks</h2>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--field-clay)', fontWeight: 600, marginTop: 4 }}>Hand-picked by NYC editors</div>
      </div>

      {/* ── Day-of-week strip — pick a night to preview what's on. ──
          Defaults to today on first render. The current day is highlighted
          with the live "Today" label so it's obvious which day you're seeing. */}
      <div style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-100)',
        padding: '10px 20px 8px',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--gray-500)', marginBottom: 8,
        }}>Pick a night</div>
        <div style={{
          overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
          display: 'flex', gap: 6,
        }}>
          {(() => {
            // Build a 7-day strip starting from today and rolling forward.
            // This is more useful than always starting from Sunday — most users
            // are planning the next few nights, not retrospecting on Monday.
            const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            return [0, 1, 2, 3, 4, 5, 6].map(offset => {
              const idx = (todayIdx + offset) % 7
              const isActive = dayIdx === idx
              const isToday = offset === 0
              const isTomorrow = offset === 1
              const label = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : DAY_SHORT[idx]
              // Count what's on for that day — for the small caption under the pill.
              // Includes live ticketed events for that date, so the strip reflects
              // real on-sale shows (concerts/sports) when the Ticketmaster key is set.
              const dTarget = new Date(); dTarget.setHours(0, 0, 0, 0); dTarget.setDate(dTarget.getDate() + offset)
              const liveN = liveEvents.filter(ev => ev.date instanceof Date
                && ev.date.getFullYear() === dTarget.getFullYear()
                && ev.date.getMonth() === dTarget.getMonth()
                && ev.date.getDate() === dTarget.getDate()).length
              const n = tonightPicks.filter(p => !Array.isArray(p.bestDays) || p.bestDays.includes(idx)).length + liveN
              return (
                <button key={idx} onClick={() => setDayIdx(idx)} style={{
                  flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  minWidth: 60,
                  padding: '7px 10px 6px',
                  borderRadius: 12,
                  border: isActive ? '1.5px solid var(--gray-900)' : '1px solid var(--gray-200)',
                  background: isActive ? 'var(--gray-900)' : 'var(--white)',
                  color: isActive ? 'var(--white)' : 'var(--gray-700)',
                  cursor: 'pointer',
                  fontSize: 12, fontWeight: 700,
                }}>
                  <span>{label}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--gray-400)',
                  }}>{n} on</span>
                </button>
              )
            })
          })()}
        </div>
      </div>

      {/* ── Sticky filter chip row — stays visible while scrolling the list ── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-100)',
      }}>
        <div style={{
          overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
          padding: '10px 20px',
          display: 'flex', gap: 8,
        }}>
          {visibleFilters.map(f => {
            const isActive = tonightFilter === f.key
            const count = counts[f.key] || 0
            return (
              <button key={f.key} onClick={() => setTonightFilter(f.key)} style={{
                flexShrink: 0, padding: '7px 12px 7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: isActive ? 700 : 600,
                background: isActive ? 'var(--gray-900)' : 'var(--gray-100)',
                color: isActive ? 'var(--white)' : 'var(--gray-600)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <span>{f.label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--gray-500)',
                  background: isActive ? 'rgba(255,255,255,0.18)' : 'var(--white)',
                  padding: '1px 7px', borderRadius: 999,
                }}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Live & ticketed section — superseded by <EventsBrowser> above, kept
          disabled (the browser now covers ticketed events across all ranges). ── */}
      {false && tonightFilter === 'all' && dayEvents.length > 0 && (() => {
        const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const when = dayIdx === todayIdx ? 'tonight' : `${DAY_FULL[dayIdx]} night`
        const ranked = rankLiveEvents(dayEvents)
        const shown = liveExpanded ? ranked : ranked.slice(0, 6)
        const fmtTime = d => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        return (
          <div style={{ padding: '18px 20px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 15, lineHeight: 1 }} aria-hidden="true">🎟️</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-600)' }}>On sale {when}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-3)', fontWeight: 600 }}>{dayEvents.length} live</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {shown.map(ev => (
                <button key={ev.id} onClick={() => onNavigate({ event: ev })} style={{
                  width: '100%', display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left', cursor: 'pointer',
                  background: 'var(--card)', border: '1px solid var(--gray-200)', borderRadius: 14, padding: 10,
                  boxShadow: '0 1px 2px rgba(29,39,51,0.05)',
                }}>
                  <div style={{ width: 74, height: 74, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: `linear-gradient(135deg, ${ev.color}, ${ev.color}B0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => { const img = eventHeroImage(ev); return img
                      ? <img src={img} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <span style={{ fontSize: 24 }} aria-hidden="true">{ev.emoji}</span> })()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: ev.color }}>{ev.kindLabel}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', margin: '2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fmtTime(ev.date)}{ev.location ? ` · ${ev.location}` : ''}{ev.priceText ? ` · ${ev.priceText}` : ''}
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--gray-300)', flexShrink: 0 }} aria-hidden="true">›</span>
                </button>
              ))}
            </div>
            {dayEvents.length > 6 && !liveExpanded && (
              <button onClick={() => setLiveExpanded(true)} style={{
                marginTop: 12, width: '100%', background: 'var(--gray-100)', border: 'none', cursor: 'pointer',
                borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, color: 'var(--gray-700)',
              }}>Show all {dayEvents.length} on sale →</button>
            )}
          </div>
        )
      })()}

      {/* ── Grouped picks ── */}
      <div style={{ padding: '0 0 20px' }}>
        {visiblePicks.length === 0 && (() => {
          // Day-aware empty copy. If the user picked a quieter night (Mon dark
          // Broadway, weekend-only Met evening), tell them why and give an out.
          const DAY_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
          const dayLabel = dayIdx === todayIdx ? 'today' : `on ${DAY_FULL[dayIdx]}`
          return (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: 15, padding: '60px 20px' }}>
              <div style={{ marginBottom: 12 }}>Nothing curated in that category {dayLabel}.</div>
              <button onClick={() => { setTonightFilter('all'); setDayIdx(todayIdx) }} style={{
                background: 'var(--gray-100)', border: '1px solid var(--gray-200)',
                color: 'var(--gray-700)', fontSize: 13, fontWeight: 600,
                padding: '8px 14px', borderRadius: 20, cursor: 'pointer',
              }}>Reset filters</button>
            </div>
          )
        })()}

        {SECTION_ORDER.map(section => {
          const picks = grouped[section.key]
          if (picks.length === 0) return null
          return (
            <div key={section.key} style={{ padding: '18px 20px 4px' }}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>{section.emoji}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase', color: 'var(--gray-600)',
                }}>{section.label}</span>
                {(() => {
                  // Editorial count copy — adapts to the picked day so future-day
                  // previews read "ideas Thursday night" instead of "ideas tonight".
                  const DAY_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
                  const isToday = dayIdx === todayIdx
                  const n = picks.length
                  const eveningWord = isToday ? 'tonight' : `${DAY_FULL[dayIdx]} night`
                  const dayWord = isToday ? 'today' : `on ${DAY_FULL[dayIdx]}`
                  const wordFor = {
                    evening:    n === 1 ? `1 idea ${eveningWord}` : `${n} ideas ${eveningWord}`,
                    late_night: n === 1 ? `Just one ${eveningWord}` : `${n} late-night ideas`,
                    daytime:    n === 1 ? `1 idea ${dayWord}` : `${n} ideas ${dayWord}`,
                    anytime:    n === 1 ? '1 evergreen pick' : `${n} evergreen picks`,
                  }
                  return (
                    <span style={{ fontSize: 11, color: 'var(--gray-400)', marginLeft: 'auto' }}>
                      {wordFor[section.key] || `${n}`}
                    </span>
                  )
                })()}
              </div>

              {/* Pick cards — thumbnail + scannable content + heart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {picks.map(pick => {
                  const tint = domainColors[pick.domain] || '#666'
                  const label = TONIGHT_DOMAIN_LABELS[pick.domain] || pick.domain
                  const isSaved = !!savedItems[`venue:${pick.venueId}`]
                  const domainObj = domains[pick.domain]
                  return (
                    <button key={pick.id} onClick={() => onNavigate({ venueId: pick.venueId, workId: pick.workId, blurb: pick.blurb })} style={{
                      width: '100%', background: 'var(--white)', border: 'none',
                      borderRadius: 22, padding: 12, cursor: 'pointer', textAlign: 'left',
                      display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12,
                      overflow: 'hidden',
                      boxShadow: '0 6px 18px rgba(29,39,51,0.07)',
                    }}>
                      {/* 84px square thumbnail — photo over category-gradient fallback layer */}
                      <div style={{
                        flexShrink: 0,
                        width: 84, height: 84,
                        borderRadius: 16,
                        background: `linear-gradient(135deg, ${tint} 0%, ${tint}99 100%)`,
                        position: 'relative', overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {pick.image ? (
                          <img src={pick.image} alt={pick.imageAlt || ''} loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <span style={{ fontSize: 30, lineHeight: 1, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.18))' }}>
                            {domainObj?.icon || '✨'}
                          </span>
                        )}
                      </div>

                      {/* Content area */}
                      <div style={{
                        flex: 1, minWidth: 0,
                        display: 'flex', flexDirection: 'column', gap: 3,
                      }}>
                        {/* Top row: domain badge + heart (now a proper pill button) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                            color: tint, background: tint + '18', padding: '2px 8px', borderRadius: 999,
                          }}>{label}</span>
                          {/* (Share button removed app-wide — non-functional inside the iOS webview.) */}
                        </div>

                        {/* Time line — blue, bold, leads the card per spec (text-safe accent) */}
                        <div style={{
                          fontSize: 12, fontWeight: 700, color: 'var(--accent-text)', minWidth: 0,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{relativeDateNote(pick.dateNote, dayIdx, todayIdx)}</div>

                        {/* Title — clamped to 2 lines so card stays scannable */}
                        <div style={{
                          fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>{pick.title}</div>

                        {/* Trip-planner metadata: neighborhood · price · duration. Muted single line. */}
                        {(() => {
                          const neighborhood = venues[pick.venueId]?.neighborhood
                          const bits = []
                          if (neighborhood) bits.push(neighborhood)
                          if (pick.price) bits.push(pick.price)
                          if (pick.duration) bits.push(pick.duration)
                          if (bits.length === 0) return null
                          return (
                            <div style={{
                              fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.3,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              minWidth: 0,
                            }}>
                              {bits.join(' · ')}
                            </div>
                          )
                        })()}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

// ── Saved Screen ──────────────────────────────────────────────────────────

// ── Visit Plan helpers ───────────────────────────────────────────────────────
function parseDurationHours(str) {
  if (!str) return 2
  const isMinutes = /\bmin/i.test(str)
  const nums = (str.match(/\d+(\.\d+)?/g) || []).map(Number)
  if (nums.length === 0) return 2
  const raw = nums.length === 1 ? nums[0] : (nums[0] + nums[1]) / 2
  return isMinutes ? raw / 60 : raw
}

const AREA_CLUSTERS = {
  'Midtown': 'Midtown',
  'Midtown East': 'Midtown',
  'Midtown East / Turtle Bay': 'Midtown',
  'Midtown Manhattan': 'Midtown',
  'Midtown West': 'Midtown',
  'Midtown / Theatre District': 'Midtown',
  'Columbus Circle': 'Midtown',
  'Flatiron': 'Midtown',
  'Upper East Side': 'Upper East Side',
  'Upper West Side': 'Upper West Side',
  'Lincoln Center': 'Upper West Side',
  'Morningside Heights': 'Upper West Side',
  'Central Park (Upper West Side)': 'Upper West Side',
  'Harlem': 'Harlem',
  'Harlem (St. Nicholas Park)': 'Harlem',
  'Greenwich Village': 'Downtown Village',
  'NoHo / East Village': 'Downtown Village',
  'Meatpacking District': 'Downtown Village',
  'Chelsea / Meatpacking District': 'Downtown Village',
  'Lower East Side': 'Downtown Village',
  'Financial District': 'Lower Manhattan',
  'Downtown / Civic Center': 'Lower Manhattan',
  'Lower Manhattan / Civic Center': 'Lower Manhattan',
  // Brooklyn sub-neighborhoods — explicit so that user-added Williamsburg / DUMBO / Park Slope places
  // get correctly grouped into the Brooklyn day rather than falling through to "Other".
  'Greenpoint': 'Brooklyn',
  'Williamsburg': 'Brooklyn',
  'East Williamsburg': 'Brooklyn',
  'Bushwick': 'Brooklyn',
  'Downtown Brooklyn': 'Brooklyn',
  'DUMBO': 'Brooklyn',
  'Brooklyn Heights': 'Brooklyn',
  'Fort Greene': 'Brooklyn',
  'Clinton Hill': 'Brooklyn',
  'Prospect Heights': 'Brooklyn',
  'Park Slope': 'Brooklyn',
  'Crown Heights': 'Brooklyn',
}

function getAreaCluster(neighborhood) {
  if (!neighborhood) return 'Other'
  if (AREA_CLUSTERS[neighborhood]) return AREA_CLUSTERS[neighborhood]
  if (neighborhood.includes('Brooklyn')) return 'Brooklyn'
  if (neighborhood.includes('Bronx')) return 'The Bronx'
  if (neighborhood.includes('Queens')) return 'Queens'
  return 'Other'
}

function buildItinerary(venueIds, userVenuesLookup = {}) {
  const EVENING_DOMAINS = new Set(['jazz', 'classical_music', 'theater'])
  const DOMAIN_ORDER = { history: 0, architecture: 1, visual_art: 2, hip_hop: 3, sports: 4 }
  // Map user-place category → display domain so the itinerary can color/sort them
  // alongside curated venues. Defaults to 'visual_art' (treated as daytime, neutral).
  const USER_CATEGORY_DOMAIN = {
    food: 'visual_art', coffee: 'visual_art', drink: 'jazz', drinks: 'jazz', music: 'jazz', art: 'visual_art',
    history: 'history', sports: 'sports', shopping: 'visual_art', other: 'visual_art',
  }

  const annotated = venueIds.map(id => {
    const v = venues[id]
    if (v) {
      const domain = venueCoords[id]?.domain || 'visual_art'
      const isEvening = EVENING_DOMAINS.has(domain)
      return {
        id, name: v.name, neighborhood: v.neighborhood,
        hours: v.hours, scheduleUrl: v.scheduleUrl, ticketUrl: v.ticketUrl,
        admissionCost: v.admissionCost, nowPlaying: v.nowPlaying,
        domain, isEvening,
        duration: parseDurationHours(v.visitDuration),
        area: getAreaCluster(v.neighborhood),
      }
    }
    const uv = userVenuesLookup[id]
    if (uv) {
      const domain = USER_CATEGORY_DOMAIN[uv.category] || 'visual_art'
      const isEvening = uv.category === 'drink' || uv.category === 'music'
      return {
        id, name: uv.name, neighborhood: uv.neighborhood,
        hours: uv.hours || '', scheduleUrl: '', ticketUrl: '',
        admissionCost: '', nowPlaying: '',
        domain, isEvening,
        duration: 1.5,
        area: getAreaCluster(uv.neighborhood),
        isCustom: true, blurb: uv.blurb, address: uv.address,
      }
    }
    return null
  }).filter(Boolean)

  const daytime = annotated.filter(v => !v.isEvening)
  const evening = annotated.filter(v => v.isEvening)

  // Group daytime by area cluster
  const areaMap = {}
  daytime.forEach(v => {
    if (!areaMap[v.area]) areaMap[v.area] = []
    areaMap[v.area].push(v)
  })

  // Sort within each area: by domain order
  Object.values(areaMap).forEach(list => {
    list.sort((a, b) => (DOMAIN_ORDER[a.domain] ?? 9) - (DOMAIN_ORDER[b.domain] ?? 9))
  })

  const days = []
  const usedEveningIds = new Set()

  // Build one day per area cluster (merge small clusters into nearby days)
  const areas = Object.entries(areaMap)
  areas.forEach(([area, dayVenues]) => {
    // Time slots: 10am start, 30min travel between stops
    let hour = 10
    const stops = dayVenues.map(v => {
      const slot = {
        ...v,
        period: hour < 13 ? 'Morning' : 'Afternoon',
        startHour: hour,
      }
      hour += v.duration + 0.5
      return slot
    })

    // Attach next available evening venue
    const eve = evening.find(e => !usedEveningIds.has(e.id))
    if (eve) {
      usedEveningIds.add(eve.id)
      const eveHour = eve.domain === 'theater' ? 19.5 : eve.domain === 'classical_music' ? 19 : 20
      stops.push({ ...eve, period: 'Evening', startHour: eveHour })
    }

    days.push({ area, stops })
  })

  // Remaining evening-only venues → their own "Evening" day
  const leftoverEvening = evening.filter(e => !usedEveningIds.has(e.id))
  if (leftoverEvening.length > 0) {
    const stops = leftoverEvening.map((v, i) => ({
      ...v, period: 'Evening',
      startHour: v.domain === 'classical_music' ? 19 : v.domain === 'theater' ? 19.5 : 20 + i,
    }))
    days.push({ area: 'Evening Out', stops })
  }

  // Safety net: if annotated has venues but days ended up empty somehow, show them all
  if (days.length === 0 && annotated.length > 0) {
    let hour = 10
    const stops = annotated.map(v => {
      const slot = { ...v, period: hour < 13 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening', startHour: hour }
      hour += (v.duration || 1.5) + 0.5
      return slot
    })
    days.push({ area: annotated[0]?.area || 'New York City', stops })
  }

  return days
}

function capDays(days, maxDays) {
  if (!maxDays || days.length <= maxDays) return days
  // Keep first (maxDays-1) days intact; merge all remaining into the last slot
  const kept    = days.slice(0, maxDays - 1)
  const merged  = days.slice(maxDays - 1)
  const areaLabel = [...new Set(merged.map(d => d.area))].join(' + ')
  const allStops  = merged.flatMap(d => d.stops)
  // Re-sort by period then by original startHour
  const order = { Morning: 0, Afternoon: 1, Evening: 2 }
  allStops.sort((a, b) =>
    (order[a.period] ?? 1) - (order[b.period] ?? 1) || a.startHour - b.startHour
  )
  // Re-assign start hours so nothing overlaps
  let hour = 10
  const reSlotted = allStops.map(s => {
    if (s.period === 'Evening') return { ...s, startHour: s.startHour }  // keep evening times
    const slot = { ...s, startHour: hour }
    hour += (s.duration || 1.5) + 0.5
    return slot
  })
  kept.push({ area: areaLabel, stops: reSlotted })
  return kept
}

function fmtHour(h) {
  // Accepts any fractional hour (rounded to the nearest 5 min) so sequenced
  // stop times like 11:45 render correctly — not just :00 / :30.
  const total = Math.round((h * 60) / 5) * 5
  const hh = Math.floor(total / 60)
  const mm = total % 60
  const ampm = hh % 24 >= 12 ? 'pm' : 'am'
  const disp = hh % 12 === 0 ? 12 : hh % 12
  return `${disp}:${String(mm).padStart(2, '0')}${ampm}`
}


// ── Restaurant Data ──────────────────────────────────────────────────────────
const CUISINE_OPTIONS = [
  { id: 'japanese',   label: 'Japanese',    emoji: '🍣', color: '#e11d48' },
  { id: 'korean',     label: 'Korean',      emoji: '🍲', color: '#ea580c' },
  { id: 'italian',    label: 'Italian',     emoji: '🍝', color: '#16a34a' },
  { id: 'pizza',      label: 'Pizza',       emoji: '🍕', color: '#dc2626' },
  { id: 'burger',     label: 'Burger',      emoji: '🍔', color: '#92400e' },
  { id: 'bar_tavern', label: 'Bar',         emoji: '🍺', color: '#6d28d9' },
  { id: 'steakhouse', label: 'Steak',       emoji: '🥩', color: '#991b1b' },
  { id: 'american',   label: 'American',    emoji: '🍳', color: '#1e40af' },
]

const RESTAURANT_DATA = [
  // ── MIDTOWN ──
  { id: 'sushi_yasuda',    name: 'Sushi Yasuda',       cuisines: ['japanese'],   area: 'Midtown', price: '$$$', neighborhood: 'Midtown East',   description: 'Pristine traditional Edomae sushi in a serene bamboo-walled room. One of NYC\'s finest.',      reservationUrl: 'https://www.opentable.com/sushi-yasuda',           mapsUrl: 'https://maps.google.com/?q=Sushi+Yasuda+New+York' },
  { id: 'ootoya_midtown',  name: 'Ootoya',             cuisines: ['japanese'],   area: 'Midtown', price: '$$',  neighborhood: 'Midtown',         description: 'Homestyle Japanese teishoku sets — rice, miso soup, pickles, grilled fish or tonkatsu.',      reservationUrl: 'https://www.opentable.com/ootoya-chelsea',          mapsUrl: 'https://maps.google.com/?q=Ootoya+Midtown+New+York' },
  { id: 'marea',           name: 'Marea',              cuisines: ['italian'],    area: 'Midtown', price: '$$$$',neighborhood: 'Central Park South', description: 'Michelin-starred coastal Italian — impeccable seafood pastas and crudo overlooking the park.', reservationUrl: 'https://www.opentable.com/marea',                   mapsUrl: 'https://maps.google.com/?q=Marea+Restaurant+New+York' },
  { id: 'the_modern',      name: 'The Modern',         cuisines: ['american'],   area: 'Midtown', price: '$$$$',neighborhood: 'Midtown (MoMA)',   description: 'Danny Meyer\'s MoMA restaurant with floor-to-ceiling sculpture garden views and seasonal tasting menus.', reservationUrl: 'https://www.opentable.com/the-modern',         mapsUrl: 'https://maps.google.com/?q=The+Modern+Restaurant+MoMA+New+York' },
  { id: 'campbell',        name: 'The Campbell',       cuisines: ['bar_tavern'], area: 'Midtown', price: '$$',  neighborhood: 'Grand Central',    description: 'Jaw-dropping 1920s Gilded Age bar inside Grand Central — gilded ceiling, roaring fireplace, craft cocktails.', reservationUrl: 'https://thecampbellnyc.com',                    mapsUrl: 'https://maps.google.com/?q=The+Campbell+Grand+Central+New+York' },
  { id: 'benjamin_steak',  name: 'Benjamin Steakhouse',cuisines: ['steakhouse'], area: 'Midtown', price: '$$$$',neighborhood: 'Midtown East',    description: 'Classic NYC prime steakhouse — USDA prime dry-aged porterhouses in an elegant Helmsley Building room.', reservationUrl: 'https://www.opentable.com/benjamin-steakhouse', mapsUrl: 'https://maps.google.com/?q=Benjamin+Steakhouse+New+York' },
  { id: 'jongno_midtown',  name: 'Jongno Gopchang',   cuisines: ['korean'],     area: 'Midtown', price: '$$',  neighborhood: 'Koreatown',       description: 'Sizzling Korean BBQ specializing in beef intestines and offcuts — bold, smoky, deeply satisfying.', reservationUrl: null,mapsUrl: 'https://maps.google.com/?q=Jongno+Gopchang+New+York' },

  // ── UPPER EAST SIDE ──
  { id: 'sushi_of_gari',   name: 'Sushi of Gari',     cuisines: ['japanese'],   area: 'Upper East Side', price: '$$$', neighborhood: 'Upper East Side', description: 'Chef Gari\'s legendary omakase — creative toppings and sauces that transformed NYC sushi culture.',  reservationUrl: 'https://www.sushiofgari.com',           mapsUrl: 'https://maps.google.com/?q=Sushi+of+Gari+New+York' },
  { id: 'caravaggio',      name: 'Caravaggio',         cuisines: ['italian'],    area: 'Upper East Side', price: '$$$', neighborhood: 'Upper East Side', description: 'Refined northern Italian — handmade pastas, excellent osso buco, hushed elegant room favored by locals.', reservationUrl: 'https://www.opentable.com/caravaggio-new-york', mapsUrl: 'https://maps.google.com/?q=Caravaggio+Restaurant+New+York' },
  { id: 'jg_melon',        name: 'J.G. Melon',         cuisines: ['burger','american'], area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'NYC burger institution since 1972 — thick patty on a bun with cottage fries, cash only, always packed.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=JG+Melon+New+York' },
  { id: 'burnside_ues',    name: 'Burnside',            cuisines: ['bar_tavern'], area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'Warm neighborhood whiskey bar — long list of Irish and Scotch whiskeys, excellent cocktails, cozy booths.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Burnside+Bar+New+York' },
  { id: 'mezzaluna',       name: 'Mezzaluna',           cuisines: ['italian','pizza'], area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'Beloved UES neighborhood Italian — thin-crust pizza from a wood-burning oven and classic pastas.',    reservationUrl: 'https://www.opentable.com/mezzaluna',   mapsUrl: 'https://maps.google.com/?q=Mezzaluna+New+York' },
  { id: 'mono_mono',       name: 'Mono+Mono',           cuisines: ['korean'],     area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'Modern Korean comfort food — crispy rice, japchae, galbi, and rice-cake stir-fry in a sleek room.',     reservationUrl: 'https://www.opentable.com/mono-mono',   mapsUrl: 'https://maps.google.com/?q=Mono+Mono+New+York' },

  // ── UPPER WEST SIDE ──
  { id: 'carmines_uws',    name: 'Carmine\'s',          cuisines: ['italian'],    area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Legendary family-style Italian — enormous platters of linguine alle vongole and chicken parmigiana built for sharing.', reservationUrl: 'https://www.carminesnyc.com', mapsUrl: 'https://maps.google.com/?q=Carmine\'s+Upper+West+Side+New+York' },
  { id: 'amsterdam_ale',   name: 'Amsterdam Ale House', cuisines: ['bar_tavern'], area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: '60 taps of craft and import beer in a classic neighborhood tavern — excellent wings and a relaxed vibe.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Amsterdam+Ale+House+New+York' },
  { id: 'kefi_uws',        name: 'Kefi',                cuisines: ['american'],   area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Michael Psilakis\'s beloved Greek-American taverna — roasted lamb, spreads, and casual neighborhood warmth.', reservationUrl: 'https://www.opentable.com/kefi', mapsUrl: 'https://maps.google.com/?q=Kefi+Restaurant+New+York' },
  { id: 'sushi_yasaka',    name: 'Sushi Yasaka',        cuisines: ['japanese'],   area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Quiet neighborhood sushi bar known for generous omakase value and pristine fish sourced daily.',           reservationUrl: 'https://www.opentable.com/sushi-yasaka', mapsUrl: 'https://maps.google.com/?q=Sushi+Yasaka+New+York' },
  { id: 'juliana_uws',     name: 'Juliana\'s (UWS)',    cuisines: ['pizza'],      area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Coal-fired Neapolitan pizza — charred blistered crust, San Marzano tomatoes, fresh mozzarella.',         reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Juliana\'s+Pizza+New+York' },

  // ── DOWNTOWN VILLAGE ──
  { id: 'carbone',         name: 'Carbone',             cuisines: ['italian'],    area: 'Downtown Village', price: '$$$$', neighborhood: 'Greenwich Village', description: 'The most coveted reservation in NYC — theatrical red-sauce Italian with tuxedoed captains and legendary spicy rigatoni.', reservationUrl: 'https://www.exploretock.com/carbone', mapsUrl: 'https://maps.google.com/?q=Carbone+New+York' },
  { id: 'lupa',            name: 'Lupa Osteria Romana', cuisines: ['italian'],    area: 'Downtown Village', price: '$$$', neighborhood: 'Greenwich Village', description: 'Mario Batali\'s warm Roman trattoria — impeccable house-made pastas and an extensive all-Italian wine list.', reservationUrl: 'https://www.opentable.com/lupa', mapsUrl: 'https://maps.google.com/?q=Lupa+Osteria+Romana+New+York' },
  { id: 'momofuku_noodle', name: 'Momofuku Noodle Bar', cuisines: ['japanese'],   area: 'Downtown Village', price: '$$', neighborhood: 'East Village',      description: 'David Chang\'s original noodle bar — rich tonkotsu ramen, inventive pork buns, and the bowl that started it all.', reservationUrl: 'https://www.momofuku.com/noodle-bar', mapsUrl: 'https://maps.google.com/?q=Momofuku+Noodle+Bar+New+York' },
  { id: 'corner_bistro',   name: 'Corner Bistro',       cuisines: ['burger'],     area: 'Downtown Village', price: '$',   neighborhood: 'West Village',      description: 'NYC dive bar legend since 1961 — the Bistro Burger (8oz, cheese, bacon, fried onion) for under $10.',      reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Corner+Bistro+New+York' },
  { id: 'employees_only',  name: 'Employees Only',      cuisines: ['bar_tavern'], area: 'Downtown Village', price: '$$$', neighborhood: 'West Village',      description: 'Legendary speakeasy cocktail bar behind a psychic\'s storefront — brilliant pre-Prohibition drinks and late-night food.', reservationUrl: 'https://www.employeesonlynyc.com', mapsUrl: 'https://maps.google.com/?q=Employees+Only+New+York' },
  { id: 'artichoke_pizza', name: 'Artichoke Basille\'s', cuisines: ['pizza'],     area: 'Downtown Village', price: '$',   neighborhood: 'East Village',      description: 'Thick square Sicilian slices — the artichoke-cream slice is a NYC late-night institution. Enormous portions.',   reservationUrl: null, walkIn: true, mapsUrl: 'https://maps.google.com/?q=Artichoke+Basille\'s+New+York' },
  { id: 'jeju_noodle',     name: 'Jeju Noodle Bar',     cuisines: ['korean'],     area: 'Downtown Village', price: '$$',  neighborhood: 'Greenwich Village', description: 'Creative Korean noodles rooted in Jeju Island tradition — the signature ramen broth simmers for days.',         reservationUrl: 'https://www.opentable.com/jeju-noodle-bar', mapsUrl: 'https://maps.google.com/?q=Jeju+Noodle+Bar+New+York' },

  // ── LOWER MANHATTAN ──
  { id: 'nobu_downtown',   name: 'Nobu Downtown',       cuisines: ['japanese'],   area: 'Lower Manhattan', price: '$$$$', neighborhood: 'Tribeca',          description: 'Nobu Matsuhisa\'s original NYC flagship — black cod miso and yellowtail jalapeño remain the gold standard.',  reservationUrl: 'https://www.noburestaurants.com/new-york/experience/', mapsUrl: 'https://maps.google.com/?q=Nobu+Downtown+New+York' },
  { id: 'adriennes_pizza', name: 'Adrienne\'s Pizzabar', cuisines: ['pizza'],     area: 'Lower Manhattan', price: '$$',  neighborhood: 'Financial District',  description: 'Old-school FiDi square pizza — thin-crusted, crispy-bottomed rectangular pies beloved by Wall Street workers.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Adrienne\'s+Pizzabar+New+York' },
  { id: 'dead_rabbit',     name: 'The Dead Rabbit',     cuisines: ['bar_tavern'], area: 'Lower Manhattan', price: '$$$', neighborhood: 'Financial District',  description: 'World\'s best bar (multiple awards) — impeccably researched 19th-century cocktails in a Victorian Irish pub.', reservationUrl: 'https://www.deadrabbitnyc.com', mapsUrl: 'https://maps.google.com/?q=The+Dead+Rabbit+New+York' },
  { id: 'fraunces_tavern', name: 'Fraunces Tavern',     cuisines: ['american','bar_tavern'], area: 'Lower Manhattan', price: '$$', neighborhood: 'Financial District', description: 'Where Washington bade farewell to his officers in 1783 — history in every brick, classic pub fare, beer.', reservationUrl: 'https://www.frauncestavern.com', mapsUrl: 'https://maps.google.com/?q=Fraunces+Tavern+New+York' },
  { id: 'bareburger_fidi', name: 'Bareburger',          cuisines: ['burger'],     area: 'Lower Manhattan', price: '$$',  neighborhood: 'Financial District',  description: 'Organic, all-natural burgers with creative toppings — bison, elk, turkey, or beef on a pretzel bun.',       reservationUrl: null, walkIn: true, mapsUrl: 'https://maps.google.com/?q=Bareburger+Financial+District+New+York' },
  { id: 'delmonicos',      name: 'Delmonico\'s',        cuisines: ['steakhouse'], area: 'Lower Manhattan', price: '$$$$', neighborhood: 'Financial District', description: 'America\'s oldest restaurant (1837) — the birthplace of Delmonico steak, Eggs Benedict, and Baked Alaska.', reservationUrl: 'https://www.opentable.com/delmonicos', mapsUrl: 'https://maps.google.com/?q=Delmonico\'s+New+York' },

  // ── HARLEM ──
  { id: 'sylvias',         name: 'Sylvia\'s',           cuisines: ['american'],   area: 'Harlem', price: '$$',  neighborhood: 'Harlem',            description: 'Harlem\'s soul food institution since 1962 — smothered chicken, candied yams, cornbread, and legendary gospel brunch.', reservationUrl: 'https://www.sylviasrestaurant.com', mapsUrl: 'https://maps.google.com/?q=Sylvia\'s+Restaurant+Harlem+New+York' },
  { id: 'raos',            name: 'Rao\'s',              cuisines: ['italian'],    area: 'Harlem', price: '$$$$', neighborhood: 'East Harlem',       description: 'The most impossible table in NYC — 10-table Italian red-sauce institution since 1896. Try their jarred sauce.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Rao\'s+New+York' },
  { id: 'patsys_pizza',    name: 'Patsy\'s Pizzeria',   cuisines: ['pizza'],      area: 'Harlem', price: '$',   neighborhood: 'East Harlem',       description: 'The original 1933 location — coal-fired pies that Frank Sinatra famously had flown across the country.',        reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Patsy\'s+Pizzeria+East+Harlem+New+York' },
  { id: 'ginnys',          name: 'Ginny\'s Supper Club', cuisines: ['bar_tavern','american'], area: 'Harlem', price: '$$$', neighborhood: 'Harlem', description: 'Marcus Samuelsson\'s underground jazz supper club at Red Rooster — live music, cocktails, and soulful bites.', reservationUrl: 'https://www.ginnyssupperclub.com', mapsUrl: 'https://maps.google.com/?q=Ginny\'s+Supper+Club+Harlem+New+York' },
  { id: 'lonni_bar',       name: 'Lonni\'s Bar & Lounge', cuisines: ['bar_tavern'], area: 'Harlem', price: '$$', neighborhood: 'Harlem',           description: 'Iconic Harlem neighborhood bar with a deep history in the local jazz and arts community.',                   reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Harlem+bar+New+York' },

  // ── BROOKLYN ──
  { id: 'lucali',          name: 'Lucali',              cuisines: ['pizza'],      area: 'Brooklyn', price: '$$',  neighborhood: 'Carroll Gardens',   description: 'Arguably NYC\'s best pizza — thin-crust masterpieces handmade by Mark Iacono in a tiny cash-only BYOB room.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Lucali+Pizza+Brooklyn' },
  { id: 'peter_luger',     name: 'Peter Luger Steak House', cuisines: ['steakhouse'], area: 'Brooklyn', price: '$$$$', neighborhood: 'Williamsburg', description: 'NYC\'s most iconic steakhouse since 1887 — cash-only, porterhouse-only, tableside creamed spinach, no frills.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Peter+Luger+Steak+House+Brooklyn' },
  { id: 'frankies_457',    name: 'Frankies 457 Spuntino', cuisines: ['italian'], area: 'Brooklyn', price: '$$',  neighborhood: 'Carroll Gardens',   description: 'Rustic neighborhood Italian — hand-rolled meatballs, cacio e pepe, ricotta toasts in a candle-lit garden.', reservationUrl: 'https://www.frankiesspuntino.com', mapsUrl: 'https://maps.google.com/?q=Frankies+457+Spuntino+Brooklyn' },
  { id: 'insa_korean',     name: 'Insa',                cuisines: ['korean'],     area: 'Brooklyn', price: '$$$', neighborhood: 'Gowanus',           description: 'Korean BBQ and karaoke under one roof — premium galbi, wagyu short ribs, and private karaoke rooms.',        reservationUrl: 'https://www.insabrooklyn.com', mapsUrl: 'https://maps.google.com/?q=Insa+Korean+BBQ+Brooklyn' },
  { id: 'okonomi_bk',      name: 'Okonomi',             cuisines: ['japanese'],   area: 'Brooklyn', price: '$$',  neighborhood: 'Williamsburg',      description: 'Intimate all-day Japanese breakfast and lunch omakase — pristine simplicity using the finest seasonal ingredients.', reservationUrl: 'https://www.opentable.com/okonomi', mapsUrl: 'https://maps.google.com/?q=Okonomi+Williamsburg+Brooklyn' },
  { id: 'brooklyn_inn',    name: 'Brooklyn Inn',         cuisines: ['bar_tavern'], area: 'Brooklyn', price: '$',   neighborhood: 'Cobble Hill',       description: 'Historic 1800s bar with original mahogany furniture — quiet, literary, the perfect neighborhood pub.',         reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Brooklyn+Inn+Cobble+Hill' },

  // ── BRONX ──
  { id: 'roberto_bronx',   name: 'Roberto Restaurant',  cuisines: ['italian'],    area: 'Bronx', price: '$$$',  neighborhood: 'Belmont (Bronx)',   description: 'Arthur Avenue\'s finest — authentic Calabrian Italian in the heart of the Bronx\'s Little Italy since 1983.', reservationUrl: 'https://www.opentable.com/roberto-restaurant-the-bronx', mapsUrl: 'https://maps.google.com/?q=Roberto+Restaurant+Bronx+New+York' },
  { id: 'zero_otto_nove',  name: 'Zero Otto Nove',      cuisines: ['pizza','italian'], area: 'Bronx', price: '$$', neighborhood: 'Belmont (Bronx)',  description: 'Wood-fired Neapolitan pizza on Arthur Avenue — the real Bronx Italian neighborhood experience.',             reservationUrl: 'https://www.opentable.com/zero-otto-nove', mapsUrl: 'https://maps.google.com/?q=Zero+Otto+Nove+Bronx+New+York' },
  { id: 'yankee_tavern',   name: 'Yankee Tavern',       cuisines: ['bar_tavern'], area: 'Bronx', price: '$$',   neighborhood: 'South Bronx',       description: 'Historic 1927 bar steps from Yankee Stadium — cold beer and classic bar food before the game.',              reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Yankee+Tavern+Bronx+New+York' },

  // ── QUEENS ──
  { id: 'sik_gaek',        name: 'Sik Gaek',            cuisines: ['korean'],     area: 'Queens', price: '$$',   neighborhood: 'Woodside, Queens',  description: 'Outdoor Korean BBQ in a festive tent setting — whole octopus, kalbi, and soju by the bottle.',              reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Sik+Gaek+Queens+New+York' },
  { id: 'nan_xiang',       name: 'Nan Xiang Xiao Long Bao', cuisines: ['japanese'], area: 'Queens', price: '$', neighborhood: 'Flushing, Queens',  description: 'Flushing\'s most celebrated soup dumplings — paper-thin skin bursting with broth and pork.',               reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Nan+Xiang+Xiao+Long+Bao+Queens' },
  { id: 'de_mole',         name: 'De Mole',             cuisines: ['american'],   area: 'Queens', price: '$$',   neighborhood: 'Sunnyside, Queens', description: 'Beloved neighborhood Mexican-American spot — complex moles, chiles rellenos, margaritas worth the trip.',    reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=De+Mole+Sunnyside+Queens' },
]

// Approx [lat, lng] for the curated restaurants above. Used to rank meal
// suggestions by walking distance from the stop you're coming from. Block-level
// accuracy is plenty for ordering candidates within a neighborhood.
const RESTAURANT_COORDS = {
  sushi_yasuda: [40.7516, -73.9730], ootoya_midtown: [40.7546, -73.9863], marea: [40.7681, -73.9819],
  the_modern: [40.7615, -73.9776], shake_shack_midtown: [40.7415, -73.9881], campbell: [40.7527, -73.9772],
  benjamin_steak: [40.7518, -73.9785], jongno_midtown: [40.7472, -73.9862],
  sushi_of_gari: [40.7714, -73.9526], caravaggio: [40.7726, -73.9655], jg_melon: [40.7706, -73.9580],
  burnside_ues: [40.7765, -73.9520], mezzaluna: [40.7707, -73.9579], mono_mono: [40.7736, -73.9566],
  carmines_uws: [40.7917, -73.9740], shake_shack_uws: [40.7806, -73.9758], amsterdam_ale: [40.7800, -73.9800],
  kefi_uws: [40.7855, -73.9716], sushi_yasaka: [40.7785, -73.9820], juliana_uws: [40.7850, -73.9750],
  carbone: [40.7281, -74.0003], lupa: [40.7284, -74.0008], momofuku_noodle: [40.7295, -73.9847],
  corner_bistro: [40.7384, -74.0027], employees_only: [40.7339, -74.0065],
  artichoke_pizza: [40.7327, -73.9840], jeju_noodle: [40.7345, -74.0075],
  nobu_downtown: [40.7110, -74.0095], adriennes_pizza: [40.7041, -74.0113], dead_rabbit: [40.7028, -74.0113],
  fraunces_tavern: [40.7033, -74.0114], bareburger_fidi: [40.7045, -74.0070], delmonicos: [40.7045, -74.0110],
  sylvias: [40.8081, -73.9447], raos: [40.7943, -73.9344], patsys_pizza: [40.7977, -73.9347],
  ginnys: [40.8083, -73.9455], lonni_bar: [40.8089, -73.9482],
  lucali: [40.6810, -74.0010], peter_luger: [40.7099, -73.9626], frankies_457: [40.6790, -73.9990],
  insa_korean: [40.6790, -73.9860], okonomi_bk: [40.7140, -73.9490], brooklyn_inn: [40.6873, -73.9890],
  shake_bk: [40.7029, -73.9933],
  roberto_bronx: [40.8540, -73.8870], zero_otto_nove: [40.8546, -73.8880], yankee_tavern: [40.8275, -73.9270],
  sik_gaek: [40.7458, -73.9060], nan_xiang: [40.7595, -73.8310], de_mole: [40.7430, -73.9230],
}

// Itinerary area-cluster labels don't always equal the restaurant `area` field
// (e.g. "Greenwich Village" → "Downtown Village"; "Evening Out" / "Central Park"
// have no restaurants of their own). Map the common ones so meal lookups resolve;
// anything still unmatched falls back to the full list ranked by walking distance,
// so a meal card NEVER comes up empty.
const AREA_TO_RESTAURANT_AREA = {
  'Greenwich Village': 'Downtown Village',
  'East Village':      'Downtown Village',
  'West Village':      'Downtown Village',
  'SoHo':              'Downtown Village',
  'Chelsea':           'Downtown Village',
  'Gramercy':          'Downtown Village',
  'Tribeca':           'Lower Manhattan',
  'Chinatown':         'Lower Manhattan',
  'Financial District':'Lower Manhattan',
  'Central Park':      'Midtown',
  'The Bronx':         'Bronx',
}

// Candidate restaurants for an (area, cuisine), with graceful fallback:
// exact area → aliased area → that cuisine anywhere → anything. Always non-empty
// when RESTAURANT_DATA is non-empty, so cuisine selection always re-picks and
// no day (incl. evening-only "Evening Out" plans) loses its meal suggestion.
function restaurantPool(area, cuisineId) {
  const byArea = a => RESTAURANT_DATA.filter(r => r.area === a)
  const narrow = list => cuisineId ? list.filter(r => r.cuisines && r.cuisines.includes(cuisineId)) : list
  let pool = narrow(byArea(area))
  if (pool.length === 0 && AREA_TO_RESTAURANT_AREA[area]) pool = narrow(byArea(AREA_TO_RESTAURANT_AREA[area]))
  if (pool.length === 0) pool = narrow(RESTAURANT_DATA)   // that cuisine, anywhere
  if (pool.length === 0) pool = RESTAURANT_DATA           // last resort: anything
  return pool
}

// Like getRestaurantSuggestion, but when given an `anchor` { lat, lng } (the stop
// you're coming from) it ranks the candidate pool nearest-first, so "Show another"
// walks outward from the closest spot. Restaurants without a known coord sort last.
function getRestaurantSuggestionNear(area, cuisineId, offset = 0, anchor = null) {
  let pool = restaurantPool(area, cuisineId)
  if (pool.length === 0) return null
  if (anchor && typeof anchor.lat === 'number') {
    const dist = r => {
      const c = RESTAURANT_COORDS[r.id]
      return c ? distanceMiles(anchor, { lat: c[0], lng: c[1] }) : Infinity
    }
    pool = [...pool].sort((a, b) => dist(a) - dist(b))
  }
  return pool[offset % pool.length]
}

function getRestaurantSuggestion(area, cuisineId, offset = 0) {
  const pool = restaurantPool(area, cuisineId)
  if (pool.length === 0) return null
  return pool[offset % pool.length]
}

// How many alternatives are available for this (area, cuisine) combo — used to know when to dim the refresh button.
function countRestaurantOptions(area, cuisineId) {
  return restaurantPool(area, cuisineId).length
}

// Haversine distance between two lat/lng points, in miles.
function distanceMiles(a, b) {
  const R = 3958.8
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(x))
}

// Rough NYC travel-time estimate between two venueCoords entries.
// Walking ~3.3 mph; subway adds platform/wait overhead; taxi assumed faster than subway for medium distances.
// ── NYC subway line bullets — drawn by us (no MTA artwork copied), using the
// official line colors. Route data comes from the MTA open-data stations set;
// register for the MTA's free developer license to cover symbol usage.
const SUBWAY_LINE_COLORS = {
  '1': '#EE352E', '2': '#EE352E', '3': '#EE352E',
  '4': '#00933C', '5': '#00933C', '6': '#00933C',
  '7': '#B933AD',
  A: '#0039A6', C: '#0039A6', E: '#0039A6',
  B: '#FF6319', D: '#FF6319', F: '#FF6319', M: '#FF6319',
  G: '#6CBE45',
  J: '#996633', Z: '#996633',
  L: '#A7A9AC',
  N: '#FCCC0A', Q: '#FCCC0A', R: '#FCCC0A', W: '#FCCC0A',
  S: '#808183',
}
function SubwayBullet({ line }) {
  const bg = SUBWAY_LINE_COLORS[line] || '#808183'
  const dark = bg === '#FCCC0A' // yellow lines take black text, like the real signs
  return (
    <span aria-label={`${line} train`} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 15, height: 15, borderRadius: '50%', background: bg,
      color: dark ? '#111' : '#fff', fontSize: 9.5, fontWeight: 800,
      lineHeight: 1, flexShrink: 0,
    }}>{line}</span>
  )
}

// Coord-based estimator — lets the travel connectors chain through meal cards
// (restaurants aren't in venueCoords) as well as stops.
function estimateTravelCoords(a, b) {
  if (!a || !b) return null
  const miles = distanceMiles(a, b)
  if (miles < 0.35) return { mode: 'walk',   icon: '🚶', mins: Math.max(4, Math.round(miles * 20)) }
  if (miles < 1.0)  return { mode: 'walk',   icon: '🚶', mins: Math.round(miles * 18) }
  if (miles < 6)    return { mode: 'subway', icon: '🚇', mins: Math.round(12 + miles * 4) }
  return                  { mode: 'taxi',   icon: '🚕', mins: Math.round(10 + miles * 3) }
}
function estimateTravel(fromId, toId) {
  return estimateTravelCoords(venueCoords[fromId], venueCoords[toId])
}

// Curated RESTAURANT_DATA carries no lat/lng — approximate by neighborhood
// centroid (imported places have real coords). Neighborhood precision is fine
// for a "~N min" hint; distances stay honest to within a few minutes.
const HOOD_CENTROIDS = {
  'Midtown East':        { lat: 40.7549, lng: -73.9720 },
  'Midtown':             { lat: 40.7580, lng: -73.9819 },
  'Midtown (MoMA)':      { lat: 40.7614, lng: -73.9776 },
  'Central Park South':  { lat: 40.7661, lng: -73.9797 },
  'Grand Central':       { lat: 40.7527, lng: -73.9772 },
  'Koreatown':           { lat: 40.7476, lng: -73.9868 },
  'Upper East Side':     { lat: 40.7736, lng: -73.9566 },
  'Upper West Side':     { lat: 40.7870, lng: -73.9754 },
  'Greenwich Village':   { lat: 40.7336, lng: -74.0027 },
  'East Village':        { lat: 40.7270, lng: -73.9840 },
  'West Village':        { lat: 40.7358, lng: -74.0036 },
  'Tribeca':             { lat: 40.7163, lng: -74.0086 },
  'Financial District':  { lat: 40.7075, lng: -74.0113 },
  'Harlem':              { lat: 40.8116, lng: -73.9465 },
  'East Harlem':         { lat: 40.7957, lng: -73.9389 },
  'Carroll Gardens':     { lat: 40.6795, lng: -73.9990 },
  'Williamsburg':        { lat: 40.7140, lng: -73.9573 },
  'Gowanus':             { lat: 40.6738, lng: -73.9890 },
  'Cobble Hill':         { lat: 40.6863, lng: -73.9962 },
  'Belmont (Bronx)':     { lat: 40.8548, lng: -73.8886 },
  'South Bronx':         { lat: 40.8163, lng: -73.9204 },
  'Woodside, Queens':    { lat: 40.7456, lng: -73.9047 },
  'Flushing, Queens':    { lat: 40.7597, lng: -73.8303 },
  'Sunnyside, Queens':   { lat: 40.7434, lng: -73.9196 },
  // area-level fallbacks
  'Downtown Village':    { lat: 40.7300, lng: -73.9950 },
  'Lower Manhattan':     { lat: 40.7110, lng: -74.0090 },
  'Brooklyn':            { lat: 40.6900, lng: -73.9850 },
  'Bronx':               { lat: 40.8370, lng: -73.9080 },
  'Queens':              { lat: 40.7450, lng: -73.9000 },
}
function restaurantCoords(r) {
  if (typeof r?.lat === 'number' && typeof r?.lng === 'number') return { lat: r.lat, lng: r.lng }
  return HOOD_CENTROIDS[r?.neighborhood] || HOOD_CENTROIDS[r?.area] || null
}
// ── Plan Error Boundary ─────────────────────────────────────────────────────
// ── SavedPlanSummary: read-only view of the plan the user just saved ──────────
function SavedPlanSummary({ snapshot, onBack }) {
  const [shareCopied, setShareCopied] = React.useState(false)
  if (!snapshot) return null
  const { savedAt, venueIds, days: snapDays, tripDays: snapTripDays, lunchCuisine, dinnerCuisine, mealCuisines, lunchRestaurants, dinnerRestaurants } = snapshot
  // Prefer the snapshotted itinerary (exactly what was saved). Fall back to
  // re-deriving for old snapshots that predate day-snapshotting.
  const days = (Array.isArray(snapDays) && snapDays.length) ? snapDays : capDays(buildItinerary(venueIds), snapTripDays)

  const PERIOD_COLORS = {
    Morning:   { bg: '#fef9c3', text: '#854d0e', dot: '#ca8a04' },
    Afternoon: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
    Evening:   { bg: '#ede9fe', text: '#5b21b6', dot: '#7c3aed' },
  }
  const cuisineLabel = c => CUISINE_OPTIONS.find(o => o.id === c)?.label || c
  // Backward-compat readers: new snapshots key restaurants by dayIdx; old snapshots used day.area.
  const lunchAt  = (dayIdx, day) => lunchRestaurants?.[dayIdx]  ?? lunchRestaurants?.[day.area]
  const dinnerAt = (dayIdx, day) => dinnerRestaurants?.[dayIdx] ?? dinnerRestaurants?.[day.area]
  const lunchCuisineAt  = (dayIdx) => mealCuisines?.[`${dayIdx}:lunch`]  ?? lunchCuisine
  const dinnerCuisineAt = (dayIdx) => mealCuisines?.[`${dayIdx}:dinner`] ?? dinnerCuisine

  function buildRouteUrl() {
    const waypoints = []
    days.forEach((day, di) => {
      const lunchR = lunchAt(di, day)
      const dinnerR = dinnerAt(di, day)
      let lunchAdded = false, dinnerAdded = false
      const hasAfternoon = (day.stops || []).some(s => s.period === 'Afternoon')
      ;(day.stops || []).forEach(stop => {
        if (!lunchAdded && lunchR && (stop.period === 'Afternoon' || (!hasAfternoon && stop.period === 'Evening'))) {
          waypoints.push(lunchR.name + ', ' + lunchR.neighborhood + ', New York')
          lunchAdded = true
        }
        if (!dinnerAdded && dinnerR && stop.period === 'Evening') {
          waypoints.push(dinnerR.name + ', ' + dinnerR.neighborhood + ', New York')
          dinnerAdded = true
        }
        const v = venues[stop.id]
        waypoints.push(v?.address || stop.name + ', New York')
      })
      if (!lunchAdded && lunchR) waypoints.push(lunchR.name + ', ' + lunchR.neighborhood + ', New York')
      if (!dinnerAdded && dinnerR) waypoints.push(dinnerR.name + ', ' + dinnerR.neighborhood + ', New York')
    })
    if (waypoints.length === 0) return null
    return 'https://www.google.com/maps/dir/' + waypoints.map(w => encodeURIComponent(w)).join('/')
  }

  function buildShareText() {
    const lines = ['🗽 My NYC Trip' + (days.length > 1 ? ` — ${days.length} Days` : ''), '']
    days.forEach((day, di) => {
      lines.push(`Day ${di + 1}${day.area ? ' · ' + day.area : ''}`)
      day.stops.forEach(stop => {
        const v = venues[stop.id]
        const timeStr = stop.startHour != null
          ? (() => {
              const h = Math.floor(stop.startHour)
              const mm = stop.startHour % 1 === 0.5 ? '30' : '00'
              const ampm = h >= 12 ? 'pm' : 'am'
              return (h > 12 ? h - 12 : h || 12) + ':' + mm + ampm
            })()
          : ''
        lines.push(`  ${timeStr ? timeStr + ' · ' : ''}${v?.name || stop.id}${v?.neighborhood ? ' (' + v.neighborhood + ')' : ''}`)
      })
      const lR = lunchAt(di, day)
      const dR = dinnerAt(di, day)
      if (lR)  lines.push(`  Lunch: ${lR.name}`)
      if (dR)  lines.push(`  Dinner: ${dR.name}`)
      lines.push('')
    })
    lines.push('Built with NYC Stoop · nyc-stoop.vercel.app')
    return lines.join('\n')
  }

  function handleShare() {
    const text = buildShareText()
    if (navigator.share) {
      navigator.share({ title: 'My NYC Trip', text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2500)
      }).catch(() => {
        const w = window.open('', '_blank')
        w.document.write('<pre style="font-family:monospace;padding:20px">' + text.replace(/</g,'&lt;') + '</pre>')
      })
    }
  }

  // Export this saved plan as a clean, printable PDF (browser "Save as PDF").
  function exportSavedPlanPdf() {
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
    const sub = `${venueIds.length} stop${venueIds.length !== 1 ? 's' : ''}${snapTripDays ? ` · ${snapTripDays} day${snapTripDays !== 1 ? 's' : ''}` : ''}`
    let body = ''
    days.forEach((day, dayIdx) => {
      const lunchR = lunchAt(dayIdx, day), dinnerR = dinnerAt(dayIdx, day)
      const hasAfternoon = (day.stops || []).some(s => s.period === 'Afternoon')
      const items = []
      let la = false, da = false
      ;(day.stops || []).forEach(stop => {
        if (!la && lunchR && (stop.period === 'Afternoon' || (!hasAfternoon && stop.period === 'Evening'))) { items.push({ type: 'meal', meal: 'lunch', r: lunchR, cuisine: lunchCuisineAt(dayIdx) }); la = true }
        if (!da && dinnerR && stop.period === 'Evening') { items.push({ type: 'meal', meal: 'dinner', r: dinnerR, cuisine: dinnerCuisineAt(dayIdx) }); da = true }
        items.push({ type: 'stop', stop })
      })
      if (!la && lunchR) items.push({ type: 'meal', meal: 'lunch', r: lunchR, cuisine: lunchCuisineAt(dayIdx) })
      if (!da && dinnerR) items.push({ type: 'meal', meal: 'dinner', r: dinnerR, cuisine: dinnerCuisineAt(dayIdx) })
      let rows = ''
      items.forEach(it => {
        if (it.type === 'meal') {
          rows += `<div class="meal">🍴 ${it.meal === 'lunch' ? 'Lunch' : 'Dinner'}${it.cuisine ? ' · ' + esc(cuisineLabel(it.cuisine)) : ''} — ${esc(it.r.name)}<span class="mm">${[it.r.price, it.r.neighborhood].filter(Boolean).map(esc).join(' · ')}</span></div>`
          return
        }
        const s = it.stop
        const meta = [s.period, s.neighborhood].filter(Boolean).map(esc).join(' · ')
        rows += `<div class="stop"><div class="time">${esc(fmtHour(s.startHour))}</div><div class="b"><div class="name">${esc(s.name)}</div>${meta ? `<div class="meta">${meta}</div>` : ''}</div></div>`
      })
      body += `<div class="day"><div class="dh"><span>${esc(String(getDayLabel(dayIdx, null)).toUpperCase())}${day.area ? ' · ' + esc(day.area) : ''}</span></div>${rows}</div>`
    })
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My NYC Trip</title><style>
*{box-sizing:border-box}body{font-family:-apple-system,system-ui,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1d2733;margin:0;padding:28px 24px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1{font-size:23px;margin:0 0 2px}.sub{color:#7a8694;font-size:13px;margin-bottom:22px}
.day{margin-bottom:20px;page-break-inside:avoid}
.dh{background:#1d2733;color:#fff;border-radius:8px;padding:8px 12px;font-size:12.5px;font-weight:800;letter-spacing:.04em}
.stop{display:flex;gap:12px;padding:9px 4px;border-bottom:1px solid #eef1f4}
.time{width:78px;flex:none;color:#993C1D;font-weight:700;font-size:13px}
.b{flex:1}.name{font-weight:700;font-size:14px}.meta{color:#7a8694;font-size:12px;margin-top:1px}
.meal{color:#54606e;font-size:12.5px;font-weight:600;padding:8px 4px;border-bottom:1px solid #eef1f4}
.meal .mm{color:#9aa4b0;font-weight:500;display:block;font-size:11.5px;margin-top:1px}
.foot{margin-top:18px;color:#9aa4b0;font-size:11px}
.bar{position:sticky;top:0;background:#fff;padding:10px 0 14px}
.bar button{background:#E0552C;color:#fff;border:none;border-radius:999px;padding:11px 20px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
@media print{.noprint{display:none!important}body{padding:0}@page{margin:14mm}}
</style></head><body>
<div class="bar noprint"><button onclick="window.print()">⬇ Save as PDF</button></div>
<h1>My NYC Trip</h1><div class="sub">${esc(sub)}</div>
${body}
<div class="foot">Made with NYC Stoop</div>
<script>window.addEventListener('load',function(){setTimeout(function(){try{window.print()}catch(e){}},350)})</script>
</body></html>`
    const w = window.open('', '_blank')
    if (!w) { alert('Please allow pop-ups to download your schedule, then tap again.'); return }
    w.document.open(); w.document.write(html); w.document.close()
  }

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--gray-100)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--gray-400)', padding: '0 4px 0 0', lineHeight: 1 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>Saved plan</div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 1 }}>
            {new Date(savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {' · '}{venueIds.length} stop{venueIds.length !== 1 ? 's' : ''}
            {snapTripDays ? ` · ${snapTripDays} day${snapTripDays !== 1 ? 's' : ''}` : ''}
            {(() => {
              const count = mealCuisines ? Object.keys(mealCuisines).length : ((lunchCuisine ? 1 : 0) + (dinnerCuisine ? 1 : 0))
              return count > 0 ? ` · ${count} meal${count !== 1 ? 's' : ''} picked` : ''
            })()}
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '4px 10px', borderRadius: 20 }}>✓ Saved</span>
      </div>

      {/* Itinerary */}
      <div style={{ padding: '12px 20px 0' }}>
        {days.map((day, dayIdx) => {
          const lunchR  = lunchAt(dayIdx, day)
          const dinnerR = dinnerAt(dayIdx, day)
          const hasAfternoon = (day.stops || []).some(s => s.period === 'Afternoon')
          const renderItems = []
          let lunchAdded = false, dinnerAdded = false
          ;(day.stops || []).forEach(stop => {
            if (!lunchAdded && lunchR && (stop.period === 'Afternoon' || (!hasAfternoon && stop.period === 'Evening'))) {
              renderItems.push({ type: 'meal', meal: 'lunch', r: lunchR, cuisine: lunchCuisineAt(dayIdx) })
              lunchAdded = true
            }
            if (!dinnerAdded && dinnerR && stop.period === 'Evening') {
              renderItems.push({ type: 'meal', meal: 'dinner', r: dinnerR, cuisine: dinnerCuisineAt(dayIdx) })
              dinnerAdded = true
            }
            renderItems.push({ type: 'stop', stop })
          })
          if (!lunchAdded && lunchR) renderItems.push({ type: 'meal', meal: 'lunch', r: lunchR, cuisine: lunchCuisineAt(dayIdx) })
          if (!dinnerAdded && dinnerR) renderItems.push({ type: 'meal', meal: 'dinner', r: dinnerR, cuisine: dinnerCuisineAt(dayIdx) })

          return (
            <div key={dayIdx} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ background: 'var(--gray-900)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em' }}>
                  {getDayLabel(dayIdx, null).toUpperCase()}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-700)' }}>{day.area}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {renderItems.map((item, i) => {
                  if (item.type === 'meal') {
                    const isLunch = item.meal === 'lunch'
                    return (
                      <div key={`meal-${i}`} style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ fontSize: 18, marginTop: 1 }}>{isLunch ? '🍴' : '🌙'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                            {isLunch ? t('Lunch') : t('Dinner')} · {cuisineLabel(item.cuisine)}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{item.r.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.r.price} · {item.r.neighborhood}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                          {item.r.walkIn ? (
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)' }}>Walk-in</span>
                          ) : item.r.reservationUrl && (
                            <a href={item.r.reservationUrl} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 11, fontWeight: 700, background: '#ea580c', color: '#fff', padding: '5px 8px', borderRadius: 7, textDecoration: 'none' }}>
                              Reserve →
                            </a>
                          )}
                          <a href={item.r.mapsUrl} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 11, fontWeight: 600, background: 'var(--gray-200)', color: 'var(--gray-700)', padding: '5px 8px', borderRadius: 7, textDecoration: 'none' }}>
                            📍
                          </a>
                        </div>
                      </div>
                    )
                  }
                  const stop = item.stop
                  const pc = PERIOD_COLORS[stop.period] || PERIOD_COLORS.Afternoon
                  return (
                    <div key={stop.id} style={{ background: 'var(--card)', border: '1px solid var(--gray-200)', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ background: pc.bg, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: pc.dot, display: 'inline-block' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: pc.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {stop.period} · {fmtHour(stop.startHour)}
                        </span>
                        <span style={{ marginLeft: 'auto', fontSize: 11, color: pc.text, opacity: 0.7 }}>
                          ~{stop.duration < 1 ? `${Math.round(stop.duration * 60)} min` : stop.duration % 1 === 0 ? `${stop.duration} hrs` : `${stop.duration.toFixed(1)} hrs`}
                        </span>
                      </div>
                      <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{stop.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{stop.neighborhood}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {dayIdx < days.length - 1 && (
                <div style={{ textAlign: 'center', color: 'var(--gray-300)', fontSize: 20, marginTop: 16 }}>···</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Open route button */}
      <div style={{ padding: '4px 20px 100px' }}>
        <button
          onClick={exportSavedPlanPdf}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px', borderRadius: 12, background: 'var(--accent)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, marginBottom: 10, fontFamily: 'inherit',
          }}
        >
          <span style={{ fontSize: 16 }}>⬇</span><span>Download schedule (PDF)</span>
        </button>
        {(() => {
          const url = buildRouteUrl()
          return url ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px', borderRadius: 12, background: '#1a56db', color: '#fff',
                  fontSize: 15, fontWeight: 700, textDecoration: 'none', flex: 1 }}>
                <span>🗺️</span><span>Open full route in Maps</span>
              </a>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '14px 18px', borderRadius: 12, background: 'var(--gray-100)', color: 'var(--gray-800)',
                  border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 18 }}>{shareCopied ? '✓' : '↑'}</span>
                <span>{shareCopied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          ) : null
        })()}
      </div>
    </div>
  )
}

class PlanErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, err: '' } }
  static getDerivedStateFromError(e) { return { hasError: true, err: String(e) } }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>
          Couldn't build your plan
        </div>
        <div style={{ fontSize: 12, color: 'var(--gray-500)', fontFamily: 'monospace', marginTop: 8 }}>
          {this.state.err}
        </div>
      </div>
    )
    return this.props.children
  }
}

// ── Plan Screen ──────────────────────────────────────────────────────────────
function getDayLabel(dayIndex, tripStartDate) {
  if (!tripStartDate) return t2('Day {N}', { N: dayIndex + 1 })
  // Parse as local date (avoid UTC offset issues); locale follows the app language.
  const parts = tripStartDate.split('-').map(Number)
  const d = new Date(parts[0], parts[1] - 1, parts[2] + dayIndex)
  return d.toLocaleDateString(dateLocale(), { weekday: 'long', month: 'short', day: 'numeric' })
}

// ── Saved events — events the user added to "My Trip" (own localStorage list,
// since dated events aren't routable venues). Re-reads on the 'nyc-saved-events'
// signal so adds/removes anywhere reflect here live. ──
function SavedEventsSection({ hiddenIds = null }) {
  const [raw, setRaw] = React.useState(() => loadSavedEvents())
  const [sel, setSel] = React.useState(null)
  React.useEffect(() => {
    const refresh = () => setRaw(loadSavedEvents())
    window.addEventListener('nyc-saved-events', refresh)
    return () => window.removeEventListener('nyc-saved-events', refresh)
  }, [])
  if (!raw.length) return null
  const today0 = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })()
  const isDate = (d) => d instanceof Date && !isNaN(d)
  // Events already pinned inside a trip day render there instead — don't double-list.
  const visible = hiddenIds ? raw.filter(e => e && !hiddenIds.has(e.id)) : raw
  if (!visible.length) return null
  const evs = visible.map(hydrateSavedEvent).sort((a, b) => {
    const ad = isDate(a.date) ? a.date.getTime() : 8.64e15
    const bd = isDate(b.date) ? b.date.getTime() : 8.64e15
    return ad - bd
  })
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const whenLabel = (e) => {
    if (e.source === 'market') return e.days ? `Every ${e.days.split(/[,&]/)[0].trim()}` : 'Weekly'
    if (!isDate(e.date)) return ''
    const d = e.date
    const sd = (x, y) => x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate()
    const tmw = new Date(today0); tmw.setDate(tmw.getDate() + 1)
    const day = sd(d, today0) ? 'Today' : sd(d, tmw) ? 'Tomorrow' : `${WD[d.getDay()]} ${MO[d.getMonth()]} ${d.getDate()}`
    if (e.source === 'ticketmaster' && (d.getHours() || d.getMinutes())) {
      const h = (d.getHours() % 12) || 12, mm = d.getMinutes() ? ':' + String(d.getMinutes()).padStart(2, '0') : '', ap = d.getHours() < 12 ? 'am' : 'pm'
      return `${day} · ${h}${mm}${ap}`
    }
    return day
  }
  return (
    <div style={{ padding: '6px 20px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, margin: 0, letterSpacing: '0.01em', color: 'var(--ink)' }}>Saved events</h2>
        <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--field-clay)', fontWeight: 600 }}>{evs.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {evs.map(e => {
          const img = eventHeroImage(e)
          const initial = (e.title || '?').trim().charAt(0).toUpperCase()
          return (
            <div key={e.id} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--card)', border: '1px solid rgba(33,27,20,0.10)', borderRadius: 16, padding: 10, boxShadow: '0 4px 14px rgba(33,27,20,0.05)' }}>
              <button onClick={() => setSel(e)} style={{ flex: 1, minWidth: 0, display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', background: 'none', border: 'none', padding: 0 }}>
                <div style={{ width: 70, height: 70, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: e.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {img ? <img src={img} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 28, color: 'rgba(255,255,255,0.4)' }}>{initial}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: e.color }}>{e.kindLabel}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '2px 0', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{[whenLabel(e), e.location].filter(Boolean).join(' · ')}</div>
                </div>
              </button>
              <button onClick={() => toggleEventSaved(e)} aria-label="Remove from trip" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 999, border: 'none', background: 'var(--gray-100)', color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>✕</button>
            </div>
          )
        })}
      </div>
      <BottomSheet open={!!sel} onClose={() => setSel(null)} fit><EventDetail event={sel} /></BottomSheet>
    </div>
  )
}

function PlanScreen({ savedItems, toggleSave, onSelectSaved, venueNotes = {}, setVenueNote = () => {}, userVenues = {}, removeUserVenue = () => {}, addUserVenue = () => null, addPlaceFromHeader = () => {}, weather = null, savedPlacesReq = 0, onBackToSettings = null }) {
  // Per-meal-per-day cuisine. Keyed by `${dayIdx}:${meal}` → cuisineId. Each meal stands alone — no trip-level default.
  const [mealCuisines, setMealCuisines] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_meal_cuisines') || '{}') } catch { return {} }
  })
  function getMealCuisine(dayIdx, meal) {
    return mealCuisines[`${dayIdx}:${meal}`] || null
  }
  function setMealCuisine(dayIdx, meal, cuisineId) {
    setMealCuisines(prev => {
      const next = { ...prev }
      const key = `${dayIdx}:${meal}`
      if (cuisineId == null) delete next[key]; else next[key] = cuisineId
      try { lsSet('nyc_meal_cuisines', JSON.stringify(next)) } catch {}
      return next
    })
  }
  // Which meal card currently has its cuisine picker expanded — only one open at a time to keep things tidy.
  const [openMealPicker, setOpenMealPicker] = React.useState(null)
  function toggleMealPicker(dayIdx, meal) {
    const key = `${dayIdx}:${meal}`
    setOpenMealPicker(prev => prev === key ? null : key)
  }
  const [planSaved, setPlanSaved] = React.useState(false)
  const [savedPlanView, setSavedPlanView] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  // Settings drawer is collapsed by default so the actual plan leads.
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  // "Your Places" accordion controls — same shape as AddPlaceModal so UX is
  // consistent. With 62+ imported places this section dominates the screen
  // unless we tuck imports behind an accordion.
  const [importsOpen, setImportsOpen] = React.useState(false)
  const [importQuery, setImportQuery] = React.useState('')
  // Per-day collapse — Set of day indices the user has folded up. Persisted so it survives reload.
  // Day tabs (Funliday-style): null = "All days" overview; N = show only day N.
  // Not persisted — a fresh open should always start at the overview.
  const [dayFilter, setDayFilter] = React.useState(null)

  // Trip basics start collapsed once a date exists (set once, read often);
  // first-time users see the controls open so they discover them.
  const [basicsOpen, setBasicsOpen] = React.useState(() => {
    try { return !localStorage.getItem('nyc_trip_start_date') } catch { return true }
  })

  // Which inventory section is unfolded on the saved-places page:
  // 'places' | 'plans' | null (all collapsed).
  const [invOpen, setInvOpen] = React.useState(null)

  // The "My saved places" page — full-screen archive over My Trip. Openable
  // from the entry row at the page bottom or from Settings (savedPlacesReq).
  const [savedPageOpen, setSavedPageOpen] = React.useState(false)
  // Where the page was opened from — 'settings' sends the back arrow to
  // Settings (the user came from there); 'trip' just closes the overlay.
  const savedPageOriginRef = React.useRef('trip')
  React.useEffect(() => {
    if (savedPlacesReq > 0) { savedPageOriginRef.current = 'settings'; setSavedPageOpen(true) }
  }, [savedPlacesReq])
  const closeSavedPage = () => {
    setSavedPageOpen(false)
    if (savedPageOriginRef.current === 'settings') onBackToSettings?.()
    savedPageOriginRef.current = 'trip'
  }

  const [collapsedDays, setCollapsedDays] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nyc_collapsed_days') || '[]')) } catch { return new Set() }
  })
  function toggleDayCollapsed(dayIdx) {
    setCollapsedDays(prev => {
      const next = new Set(prev)
      if (next.has(dayIdx)) next.delete(dayIdx); else next.add(dayIdx)
      try { lsSet('nyc_collapsed_days', JSON.stringify([...next])) } catch {}
      return next
    })
  }
  // Per-(meal, dayIdx) offset for "show me another" — keys like 'lunch:0'. Per-day so each day cycles independently.
  const [restaurantOffsets, setRestaurantOffsets] = React.useState({})
  function bumpRestaurantOffset(meal, dayIdx) {
    setRestaurantOffsets(prev => ({ ...prev, [`${meal}:${dayIdx}`]: (prev[`${meal}:${dayIdx}`] || 0) + 1 }))
  }
  const _storedTripDays = (() => { try { return JSON.parse(localStorage.getItem('nyc_trip_days') || 'null') } catch { return null } })()
  const [tripDays, setTripDays] = React.useState(_storedTripDays)
  const [tripStartDate, setTripStartDate] = React.useState(() => {
    try { return localStorage.getItem('nyc_trip_start_date') || '' } catch { return '' }
  })

  function setAndStoreTripDays(val) {
    setTripDays(val)
    lsSet('nyc_trip_days', JSON.stringify(val))
  }

  function setAndStoreTripStartDate(val) {
    setTripStartDate(val)
    try { if (val) lsSet('nyc_trip_start_date', val); else localStorage.removeItem('nyc_trip_start_date') } catch {}
  }

  // Collect venue IDs: directly saved venues + venues from saved works
  const safeItems = savedItems && typeof savedItems === 'object' ? savedItems : {}

  // All venue IDs reachable from saved items
  const venueIdSet = new Set()
  Object.values(safeItems).forEach(item => {
    if (!item || typeof item !== 'object') return
    if (item.type === 'venue' && item.id) venueIdSet.add(item.id)
    if (item.type === 'user_venue' && item.id) venueIdSet.add(item.id)
    if (item.type === 'work' && item.id) {
      const w = works[item.id]
      if (w?.venueId) venueIdSet.add(w.venueId)
    }
  })
  // Accept curated venues OR user-added venues; everything else is filtered out.
  const allVenueIds = [...venueIdSet].filter(id => !!venues[id] || !!userVenues[id])

  // Plan selection — which of those venues to include in today's itinerary
  const _storedSel   = (() => { try { return JSON.parse(localStorage.getItem('nyc_plan_sel')   || 'null') } catch { return null } })()
  const _storedKnown = (() => { try { return JSON.parse(localStorage.getItem('nyc_plan_known') || 'null') } catch { return null } })()
  // First visit → select everything; returning visit → use exact stored selection
  const [planSelection, setPlanSelection] = React.useState(() => new Set(_storedSel ?? allVenueIds))

  // Only auto-add venues the user has never seen before (genuinely new saves)
  React.useEffect(() => {
    const known = new Set(_storedKnown || [])
    const brandNew = allVenueIds.filter(id => !known.has(id))
    // Always update the known set
    const updatedKnown = new Set([...known, ...allVenueIds])
    lsSet('nyc_plan_known', JSON.stringify([...updatedKnown]))
    // Add only brand-new venues to the selection
    if (brandNew.length > 0) {
      setPlanSelection(prev => {
        const next = new Set(prev)
        brandNew.forEach(id => next.add(id))
        lsSet('nyc_plan_sel', JSON.stringify([...next]))
        return next
      })
    }
  }, [allVenueIds.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  function toggleVenueInPlan(id) {
    const willBeInPlan = !planSelection.has(id)
    setPlanSelection(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      lsSet('nyc_plan_sel', JSON.stringify([...next]))
      return next
    })
    // Seed-imported user_venues (and any user_venue created outside the
    // addUserVenue flow) aren't in savedItems. The itinerary downstream only
    // picks up user_venues that are in savedItems → if we don't save them
    // here when the user clicks + Plan, the stop never shows up below.
    // Toggling OFF deliberately doesn't unsave — that's a separate concern
    // and we don't want a stray Plan toggle to delete the user's saved place.
    if (willBeInPlan && userVenues[id] && !safeItems[`user_venue:${id}`]) {
      toggleSave('user_venue', id)
    }
  }

  // ── Swap + day override state (must be before venueIds computation) ──
  const [venueSwaps, setVenueSwaps] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_venue_swaps') || '{}') } catch { return {} }
  })
  // Map of venueId → desired day index. Lets users move e.g. The Met from Day 2 to Day 1.
  const [stopDayOverrides, setStopDayOverrides] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_stop_day_overrides') || '{}') } catch { return {} }
  })
  const [swapModal, setSwapModal] = React.useState(null) // {venueId, domain}

  function moveStopToDay(venueId, targetDayIdx) {
    const next = { ...stopDayOverrides, [venueId]: targetDayIdx }
    setStopDayOverrides(next)
    try { lsSet('nyc_stop_day_overrides', JSON.stringify(next)) } catch {}
  }

  function getSwapCandidates(domain, excludeIds) {
    return Object.entries(venueCoords)
      .filter(([id, info]) => info.domain === domain && !excludeIds.has(id) && venues[id])
      .map(([id]) => id)
      .slice(0, 6)
  }

  const venueIds = allVenueIds.filter(id => planSelection.has(id)).map(id => venueSwaps[id] || id)
  const _rawClusters = buildItinerary(venueIds, userVenues)
  // Honor the chosen trip length: pad with empty days so stops can be spread
  // across N days, or cap when there are more clusters than days. null = Auto.
  const _rawDays = (() => {
    if (!tripDays) return _rawClusters
    if (_rawClusters.length > tripDays) return capDays(_rawClusters, tripDays)
    const out = _rawClusters.slice()
    while (out.length < tripDays) out.push({ area: `Day ${out.length + 1}`, stops: [] })
    return out
  })()

  // Apply user's day-reassignment overrides on top of the auto-built itinerary.
  // A stop with no override stays where buildItinerary put it.
  const _redistributedDays = (() => {
    if (Object.keys(stopDayOverrides).length === 0) return _rawDays
    // Flatten stops with their original day index, then re-bucket by override
    const flat = []
    _rawDays.forEach((day, di) => {
      day.stops.forEach(s => flat.push({ stop: s, originalDay: di }))
    })
    const dayStops = _rawDays.map(() => [])
    flat.forEach(({ stop, originalDay }) => {
      const targetDay = stopDayOverrides[stop.id]
      const effectiveDay = (targetDay != null && targetDay >= 0 && targetDay < _rawDays.length)
        ? targetDay : originalDay
      dayStops[effectiveDay].push(stop)
    })
    // Rebuild days with reassigned stops; preserve area label or recompute from dominant area
    return _rawDays.map((day, di) => {
      const stops = dayStops[di]
      if (stops.length === 0) return { ...day, stops: [] }
      const areaCount = {}
      stops.forEach(s => { areaCount[s.area] = (areaCount[s.area] || 0) + 1 })
      const dominantArea = Object.entries(areaCount).sort((a, b) => b[1] - a[1])[0][0]
      return { ...day, area: dominantArea, stops }
    })
  })()

  const days = _redistributedDays.map(day => ({
    ...day,
    stops: day.stops.map(stop => ({
      ...stop,
      period: stop.period,
    }))
  }))

  // Build plain-text share summary of itinerary
  function buildShareText() {
    const lines = ['🗽 My NYC Trip' + (days.length > 1 ? ` — ${days.length} Days` : ''), '']
    days.forEach((day, di) => {
      lines.push(`Day ${di + 1}${day.area ? ' · ' + day.area : ''}`)
      day.stops.forEach(stop => {
        const v = venues[stop.id] || userVenues[stop.id]
        const timeStr = stop.startHour != null
          ? (() => {
              const h = Math.floor(stop.startHour)
              const mm = stop.startHour % 1 === 0.5 ? '30' : '00'
              const ampm = h >= 12 ? 'pm' : 'am'
              return (h > 12 ? h - 12 : h || 12) + ':' + mm + ampm
            })()
          : ''
        lines.push(`  ${timeStr ? timeStr + ' · ' : ''}${v?.name || stop.name || stop.id}${v?.neighborhood ? ' (' + v.neighborhood + ')' : ''}`)
      })
      if (lunchRestaurants[di]) {
        lines.push(`  Lunch: ${lunchRestaurants[di].name}`)
      }
      if (dinnerRestaurants[di]) {
        lines.push(`  Dinner: ${dinnerRestaurants[di].name}`)
      }
      lines.push('')
    })
    lines.push('Built with NYC Stoop · nyc-stoop.vercel.app')
    return lines.join('\n')
  }

  const [shareCopied, setShareCopied] = React.useState(false)
  function handleShare() {
    // Build the share link (Tier 3.9) so the recipient gets an interactive
    // preview, not just a text dump. We send both the URL and the text
    // summary so it looks good in iMessage / email previews.
    const sharedIds = Object.keys(savedItems)
    const shareUrl = buildShareUrl({
      ids: sharedIds,
      start: tripStartDate || null,
      days: tripDays || null,
    })
    const text = buildShareText() + '\n\nOpen the live trip: ' + shareUrl
    if (navigator.share) {
      navigator.share({ title: 'My NYC Trip', text, url: shareUrl }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2500)
      }).catch(() => {
        const w = window.open('', '_blank')
        w.document.write('<pre style="font-family:monospace;padding:20px">' + text.replace(/</g,'&lt;') + '</pre>')
      })
    }
  }

    // Build a Google Maps multi-stop directions URL from the itinerary
  // onlyDayIdx: route a single day (used when the day tabs filter to one day —
  // that's the "standing on the sidewalk" moment); null routes the whole trip.
  function buildRouteUrl(onlyDayIdx = null) {
    const waypoints = []
    days.forEach((day, di) => {
      if (onlyDayIdx !== null && di !== onlyDayIdx) return
      const stops = day.stops || []
      const lunchR = lunchRestaurants[di]
      const dinnerR = dinnerRestaurants[di]
      let lunchAdded = false
      let dinnerAdded = false
      const hasAfternoon = stops.some(s => s.period === 'Afternoon')
      stops.forEach(stop => {
        if (!lunchAdded && lunchR && (stop.period === 'Afternoon' || (!hasAfternoon && stop.period === 'Evening'))) {
          waypoints.push(lunchR.name + ', ' + lunchR.neighborhood + ', New York')
          lunchAdded = true
        }
        if (!dinnerAdded && dinnerR && stop.period === 'Evening') {
          waypoints.push(dinnerR.name + ', ' + dinnerR.neighborhood + ', New York')
          dinnerAdded = true
        }
        const v = venues[stop.id] || userVenues[stop.id]
        waypoints.push(v?.address || stop.address || stop.name + ', New York')
      })
      if (!lunchAdded && lunchR) waypoints.push(lunchR.name + ', ' + lunchR.neighborhood + ', New York')
      if (!dinnerAdded && dinnerR) waypoints.push(dinnerR.name + ', ' + dinnerR.neighborhood + ', New York')
    })
    if (waypoints.length === 0) return null
    return 'https://www.google.com/maps/dir/' + waypoints.map(w => encodeURIComponent(w)).join('/')
  }

  // Memoize restaurant picks per dayIdx (not per area) so each day can have its own cuisine + offset independently.
  // The stop you're coming from before a meal: the latest Morning stop for lunch,
  // the latest Afternoon/Evening stop for dinner. Used to recommend nearby spots.
  const mealAnchor = (day, meal) => {
    const withC = day.stops.map(s => ({ s, c: venueCoords[s.id] })).filter(x => x.c)
    if (withC.length === 0) return null
    const morning = withC.filter(x => x.s.period === 'Morning')
    const later = withC.filter(x => x.s.period === 'Afternoon' || x.s.period === 'Evening')
    const block = meal === 'lunch' ? (morning.length ? morning : withC) : (later.length ? later : withC)
    block.sort((a, b) => (a.s.startHour ?? 0) - (b.s.startHour ?? 0))
    return block[block.length - 1].c
  }

  const lunchRestaurants = React.useMemo(() => {
    const map = {}
    days.forEach((day, di) => {
      // Auto-fill the nearest good spot by default (cuisine optional). The
      // smoothest flow: a complete plan with zero taps; the user can refine
      // cuisine or "show another" if they care.
      const cuisine = mealCuisines[`${di}:lunch`] || null
      const off = restaurantOffsets[`lunch:${di}`] || 0
      map[di] = getRestaurantSuggestionNear(day.area, cuisine, off, mealAnchor(day, 'lunch'))
    })
    return map
  }, [mealCuisines, restaurantOffsets, days])  // eslint-disable-line react-hooks/exhaustive-deps

  const dinnerRestaurants = React.useMemo(() => {
    const map = {}
    days.forEach((day, di) => {
      const cuisine = mealCuisines[`${di}:dinner`] || null
      const off = restaurantOffsets[`dinner:${di}`] || 0
      const anchor = mealAnchor(day, 'dinner')
      let pick = getRestaurantSuggestionNear(day.area, cuisine, off, anchor)
      // Don't suggest the same restaurant for lunch and dinner on the same day.
      // (Compute the lunch pick regardless of whether a lunch cuisine is set —
      // otherwise the no-cuisine default gave lunch and dinner the same spot.)
      const lunchPick = getRestaurantSuggestionNear(day.area, mealCuisines[`${di}:lunch`] || null, restaurantOffsets[`lunch:${di}`] || 0, mealAnchor(day, 'lunch'))
      if (pick && lunchPick && pick.name === lunchPick.name) {
        const alt = getRestaurantSuggestionNear(day.area, cuisine, off + 1, anchor)
        if (alt && alt.name !== lunchPick.name) pick = alt
      }
      map[di] = pick
    })
    return map
  }, [mealCuisines, restaurantOffsets, days])  // eslint-disable-line react-hooks/exhaustive-deps



  const DOMAIN_ICONS = {
    visual_art: '🎨', jazz: '🎷', classical_music: '🎼', theater: '🎭',
    history: '📜', architecture: '🏛️', sports: '🏆', hip_hop: '🎤', food: '🍴',
  }
  // Each day gets its own hue from the field palette (same family as the home
  // cover art) — color as wayfinding on a long monochrome page: the day tab,
  // the day pill, and the meal accents share it, so you always know where you
  // are. Cycles past 5 days.
  const DAY_HUES = ['#B7472A', '#475A66', '#6F7A45', '#6B4453', '#C6892F']
  const dayHue = (i) => DAY_HUES[i % DAY_HUES.length]
  const PERIOD_COLORS = {
    Morning:   { bg: '#fef9c3', text: '#854d0e', dot: '#ca8a04' },
    Afternoon: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
    Evening:   { bg: '#ede9fe', text: '#5b21b6', dot: '#7c3aed' },
  }
  // The DISPLAYED period always derives from the sequenced clock time, so the
  // label can never contradict the time next to it (< 12 Morning, 12–5 Afternoon,
  // ≥ 5pm Evening). stop.period stays the static venue attribute for scheduling.
  const periodForClock = (h, fallback) =>
    h == null ? fallback : h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'

  const schedulingRef = React.useRef(null)

  // ── Reorder state ────────────────────────────────────────────────────────
  // Checklist view removed to keep My Trip simple — the Full plan is the only
  // view now, so todayMode is permanently false (the day-of checklist UI below
  // never renders).
  const todayMode = false
  // Per-card expanded-options state. Tapping "⋯" on a stop reveals period/swap/move controls.
  const [expandedStopId, setExpandedStopId] = React.useState(null)
  // Wanderlog-style inline add: which day is the "Add a place" modal targeting?
  // null = modal closed. Set to a dayIdx by tapping "+ Add a place" at the
  // bottom of any day; the modal searches venues + user places and inserts
  // the chosen one into that specific day.
  const [addStopToDayIdx, setAddStopToDayIdx] = React.useState(null)

  // Add the chosen place to the targeted day. Three code paths:
  //   - venue (curated)    → ensure saved, then assign to day
  //   - user_venue (local) → already saved, just assign
  //   - google_place       → convert to user_venue via addUserVenue, then assign
  function handleAddStopToDay(item) {
    if (addStopToDayIdx == null) return
    if (item.type === 'venue') {
      if (!savedItems[`venue:${item.id}`]) toggleSave('venue', item.id)
      moveStopToDay(item.id, addStopToDayIdx)
    } else if (item.type === 'user_venue') {
      moveStopToDay(item.id, addStopToDayIdx)
    } else if (item.type === 'google_place') {
      // Persist Google-sourced place as a user_venue. addUserVenue returns the
      // generated id; we use it to assign the day. lat/lng is stored on the
      // user venue (helpful for "open in Google Maps" links) but is NOT plotted
      // on the Leaflet map, per Google Maps TOS.
      const newId = addUserVenue({
        name: item.name,
        blurb: item.blurb || '',
        category: 'other',
        neighborhood: item.neighborhood || item.address || 'NYC',
        address: item.address || '',
        hours: '',
        image: '',
        lat: item.lat,
        lng: item.lng,
        source: 'google',
        googlePlaceId: item.placeId,
      })
      if (newId) moveStopToDay(newId, addStopToDayIdx)
    }
    setAddStopToDayIdx(null)
  }
  const [checkedStops, setCheckedStops] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nyc_checked_stops') || '[]')) } catch { return new Set() }
  })
  const [stopOrderOverride, setStopOrderOverride] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_stop_order') || 'null') } catch { return null }
  })

  // Saved events (from the Events tab) — kept in sync so dated ones can render
  // pinned inside their trip day (see eventsByDay below).
  const [savedEvts, setSavedEvts] = React.useState(() => loadSavedEvents())
  React.useEffect(() => {
    const refresh = () => setSavedEvts(loadSavedEvents())
    window.addEventListener('nyc-saved-events', refresh)
    return () => window.removeEventListener('nyc-saved-events', refresh)
  }, [])

  // 16-day NYC daily forecast — fetched once an arrival date exists, so each
  // trip day's header can show its own weather without leaving the planner.
  const [forecast, setForecast] = React.useState(null) // { 'YYYY-MM-DD': {code,hi,lo} } | null
  React.useEffect(() => {
    if (!tripStartDate) return
    let alive = true
    fetch('https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=16&temperature_unit=fahrenheit&timezone=America%2FNew_York')
      .then(r => r.json())
      .then(d => {
        if (!alive || !d?.daily?.time) return
        const map = {}
        d.daily.time.forEach((t, i) => {
          map[t] = { code: d.daily.weather_code[i], hi: Math.round(d.daily.temperature_2m_max[i]), lo: Math.round(d.daily.temperature_2m_min[i]) }
        })
        setForecast(map)
      }).catch(() => {})
    return () => { alive = false }
  }, [tripStartDate])
  const forecastForDay = (dayIdx) => {
    if (!forecast || !tripStartDate) return null
    const p = tripStartDate.split('-').map(Number)
    const d = new Date(p[0], p[1] - 1, p[2] + dayIdx)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return forecast[key] || null
  }

  function toggleChecked(id) {
    setCheckedStops(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { lsSet('nyc_checked_stops', JSON.stringify([...next])) } catch {}
      return next
    })
  }

  function moveStop(venueId, dir) {
    const allStopIds = days.flatMap(d => d.stops.map(s => s.id))
    const base = stopOrderOverride || allStopIds
    const idx = base.indexOf(venueId)
    if (idx === -1) return
    const next = [...base]
    const to = idx + dir
    if (to < 0 || to >= next.length) return
    ;[next[idx], next[to]] = [next[to], next[idx]]
    setStopOrderOverride(next)
    try { lsSet('nyc_stop_order', JSON.stringify(next)) } catch {}
  }

  // Visible ↑/↓ reorder — same order store the drag writes to (nyc_day_item_orders),
  // so tap-nudge and drag stay perfectly interchangeable. Works for stops and meals.
  function nudgeItem(dayIdx, itemId, dir, defaultItemIds) {
    const saved = dayItemOrders[dayIdx]
    const base = saved
      ? [...saved.filter(id => defaultItemIds.includes(id)), ...defaultItemIds.filter(id => !saved.includes(id))]
      : [...defaultItemIds]
    const idx = base.indexOf(itemId)
    const to = idx + dir
    if (idx === -1 || to < 0 || to >= base.length) return
    ;[base[idx], base[to]] = [base[to], base[idx]]
    setDayItemOrders(prev => {
      const next = { ...prev, [dayIdx]: base }
      try { lsSet('nyc_day_item_orders', JSON.stringify(next)) } catch {}
      return next
    })
  }

  // ── Drag-to-reorder state ────────────────────────────────────────────
  const stopCardRefs  = React.useRef({})
  // Refs to each day's outer container — used by cross-day drag to detect which
  // day's section the cursor is currently over.
  const dayContainerRefs = React.useRef({})
  // Last cursor Y from the most recent touchmove / mousemove. We keep this in a
  // ref (not state) so onItemTouchEnd can read the *latest* position without
  // stale-closure problems — the mouse mousedown/mousemove/mouseup handlers
  // attached in useEffect would otherwise capture stale React state.
  const lastDragYRef = React.useRef(null)
  const dragTimerRef  = React.useRef(null)
  const [dragId,      setDragId]      = React.useState(null)
  const [dragDayIdx,  setDragDayIdx]  = React.useState(null)
  const [dragOrder,   setDragOrder]   = React.useState(null)
  // hoverDayIdx is only used for the green-tint visual feedback during drag.
  // The actual cross-day commit reads from lastDragYRef + dayContainerRefs in
  // onItemTouchEnd, which guarantees we use the latest cursor position.
  const [hoverDayIdx, setHoverDayIdx] = React.useState(null)
  const [dayItemOrders, setDayItemOrders] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_day_item_orders') || '{}') } catch { return {} }
  })

  // Helper: scan every day container and return the dayIdx whose bounding rect
  // contains the given Y coordinate. Returns null if the Y is outside all
  // containers (e.g. user dragged above the first day).
  function findDayIdxFromY(y) {
    if (y == null) return null
    let found = null
    Object.entries(dayContainerRefs.current).forEach(([didx, el]) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (y >= rect.top && y <= rect.bottom) found = Number(didx)
    })
    return found
  }

  // Prevent page scroll while a card is being dragged
  React.useEffect(() => {
    if (!dragId) return
    function noScroll(e) { e.preventDefault() }
    document.addEventListener('touchmove', noScroll, { passive: false })
    return () => document.removeEventListener('touchmove', noScroll)
  }, [dragId])

  // itemId can be a stop id, '__lunch__', or '__dinner__'
  // defaultItemIds is the auto-computed ordered list for the day.
  // Wanderlog-style: drag activates on press of the grip handle, BUT we require
  // both (a) the press has been held at least ~120ms AND (b) the finger has
  // travelled at least 25px before treating the gesture as a real drag. This
  // prevents brief taps, quick swipes, and natural finger-tremor-during-hold
  // from accidentally moving a card to another day.
  function onItemTouchStart(e, itemId, thisDayIdx, defaultItemIds) {
    const point = e.touches ? e.touches[0] : e
    const startY = point.clientY
    // Light vibrate as feedback that the grip was engaged.
    navigator.vibrate?.(20)
    // Seed the drag with the SAME reconciled order the render uses: a stale
    // saved order can be missing items that exist now (stops added since, or
    // trip-length padding). Using it raw made those un-listed cards vanish
    // mid-drag. Reconcile saved-order ∩ current items, then append any new ones.
    const saved = dayItemOrders[thisDayIdx]
    const base = saved
      ? [...saved.filter(id => defaultItemIds.includes(id)), ...defaultItemIds.filter(id => !saved.includes(id))]
      : defaultItemIds
    setDragId(itemId)
    setDragDayIdx(thisDayIdx)
    setDragOrder([...base])
    // hasMoved = true only once BOTH (a) ≥120ms held and (b) ≥25px finger
    // travel are satisfied. onItemTouchEnd reads this to decide whether the
    // gesture was a deliberate drag (commit) or just a tap (no-op, revert state).
    dragTimerRef.current = { startY, startTime: Date.now(), hasMoved: false }
  }

  function onItemTouchMove(e, itemId) {
    if (dragId !== itemId) return
    const point = e.touches ? e.touches[0] : e
    const y = point.clientY
    // Real-drag activation gate: requires BOTH 25px finger travel AND 120ms of
    // sustained press. Once tripped, hasMoved stays true for the rest of this
    // gesture so reorder/cross-day logic runs normally. Below the gate we bail
    // without updating lastDragYRef or dragOrder — that way a brief
    // press-and-release leaves no side effects and the card stays put.
    const t = dragTimerRef.current
    if (!t?.hasMoved) {
      const movedEnough = t && Math.abs(y - t.startY) >= 25
      const heldEnough  = t && (Date.now() - t.startTime) >= 120
      if (!movedEnough || !heldEnough) return
      t.hasMoved = true
    }
    lastDragYRef.current = y
    if (!dragOrder) return
    // Reorder within the origin day: find where finger is among the other cards.
    const others = dragOrder.filter(id => id !== itemId)
    let insertIdx = others.length
    for (let i = 0; i < others.length; i++) {
      const el = stopCardRefs.current[others[i]]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (y < rect.top + rect.height * 0.5) { insertIdx = i; break }
    }
    const next = [...others]
    next.splice(insertIdx, 0, itemId)
    if (next.join(',') !== dragOrder.join(',')) setDragOrder(next)

    // Cross-day visual: tint whichever day container has the cursor. The actual
    // move commit happens in onItemTouchEnd from the ref, not from this state.
    const foundDay = findDayIdxFromY(y) ?? dragDayIdx
    if (foundDay !== hoverDayIdx) setHoverDayIdx(foundDay)
  }

  function onItemTouchEnd(itemId, thisDayIdx) {
    // No-op the gesture entirely if it never crossed the movement threshold.
    // Prevents an accidental press-and-release on the grip from saving stale
    // state OR mistakenly committing a cross-day move based on micro-jitter.
    const wasRealDrag = dragTimerRef.current?.hasMoved === true
    if (dragId === itemId && dragOrder && wasRealDrag) {
      // Read the target day fresh from the last cursor Y stored in the ref.
      // This avoids the stale-closure bug where the window-level mouseup
      // handler captured hoverDayIdx at drag-start (when it was null).
      const targetDay = findDayIdxFromY(lastDragYRef.current) ?? thisDayIdx
      const isMeal = itemId === '__lunch__' || itemId === '__dinner__'
      // Meals belong to a day; we only support cross-day moves for real stops.
      if (!isMeal && targetDay !== thisDayIdx) {
        // Cross-day drop: reassign and let buildItinerary re-bucket. We
        // deliberately do NOT save the in-day order for the origin day, since
        // the dragged item no longer belongs to it.
        moveStopToDay(itemId, targetDay)
      } else {
        // Same-day reorder: save the full item order (stops + meals) for this day.
        const nextDayOrders = { ...dayItemOrders, [thisDayIdx]: dragOrder }
        setDayItemOrders(nextDayOrders)
        try { lsSet('nyc_day_item_orders', JSON.stringify(nextDayOrders)) } catch {}
        // Also sync stop-only order to stopOrderOverride for today-checklist.
        const stopIds = dragOrder.filter(id => id !== '__lunch__' && id !== '__dinner__')
        setStopOrderOverride(stopIds)
        try { lsSet('nyc_stop_order', JSON.stringify(stopIds)) } catch {}
      }
    }
    dragTimerRef.current = null
    lastDragYRef.current = null
    setDragId(null)
    setDragDayIdx(null)
    setDragOrder(null)
    setHoverDayIdx(null)
  }

  // Mouse drag: we attach window-level mousemove/mouseup once drag starts.
  React.useEffect(() => {
    if (!dragId || !dragOrder) return
    function handleMove(e) { onItemTouchMove(e, dragId) }
    function handleUp() { onItemTouchEnd(dragId, dragDayIdx) }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [dragId, dragOrder, dragDayIdx])  // eslint-disable-line react-hooks/exhaustive-deps

  function orderedStops(rawStops) {
    const eff = dragOrder || stopOrderOverride
    if (!eff) return rawStops
    return [...rawStops].sort((a, b) => {
      const ai = eff.indexOf(a.id)
      const bi = eff.indexOf(b.id)
      return (ai === -1 ? 9999 : ai) - (bi === -1 ? 9999 : bi)
    })
  }

  // Single source of truth for a day's ordered items + sequenced clock, so the
  // Full-plan and Checklist views always agree on order AND times. (Previously
  // the Checklist rendered each stop's raw buildItinerary startHour, which drifted
  // from the Full plan's travel-aware clock and ignored drag/meal reordering — so
  // the two views showed different times for the same stop.)
  function computeDayPlan(day, dayIdx) {
    const sortedDayStops = orderedStops(day.stops)
    const hasEvening2 = sortedDayStops.some(s => s.period === 'Evening')
    // Lunch belongs ONLY to days with a daytime (Morning/Afternoon) portion — never
    // on an evening-only night out (that gets dinner only). Dinner shows whenever
    // the day has an Evening stop.
    const hasDaytime2 = sortedDayStops.some(s => s.period === 'Morning' || s.period === 'Afternoon')
    const defaultItemIds = []
    let li2 = false, di2 = false
    sortedDayStops.forEach(stop => {
      if (hasDaytime2 && !li2 && (stop.period === 'Afternoon' || stop.period === 'Evening')) {
        defaultItemIds.push('__lunch__'); li2 = true
      }
      if (!di2 && hasEvening2 && stop.period === 'Evening') {
        defaultItemIds.push('__dinner__'); di2 = true
      }
      defaultItemIds.push(stop.id)
    })
    if (hasDaytime2 && !li2) defaultItemIds.push('__lunch__')
    if (!di2 && hasEvening2) defaultItemIds.push('__dinner__')
    const isDraggingThisDay = dragId !== null && dragDayIdx === dayIdx
    let activeItemIds
    if (isDraggingThisDay) {
      activeItemIds = dragOrder
    } else if (dayItemOrders[dayIdx]) {
      const saved = dayItemOrders[dayIdx]
      const savedSet = new Set(saved)
      const defaultSet = new Set(defaultItemIds)
      activeItemIds = [
        ...saved.filter(id => defaultSet.has(id)),
        ...defaultItemIds.filter(id => !savedSet.has(id)),
      ]
    } else {
      activeItemIds = defaultItemIds
    }
    const stopMap = {}; sortedDayStops.forEach(s => { stopMap[s.id] = s })
    const reorderedItems = activeItemIds
      .map(id => id === '__lunch__'  ? { type: 'restaurant', meal: 'lunch' }
               : id === '__dinner__' ? { type: 'restaurant', meal: 'dinner' }
               : stopMap[id]         ? { type: 'stop', stop: stopMap[id] }
               : null)
      .filter(Boolean)
    // Sequenced clock — each stop's displayed start time accumulates the prior
    // stops' durations, inter-stop travel time, and meal breaks, so two stops in
    // the same period no longer both read "10:00am".
    const stopClock = {}
    {
      const firstStop = reorderedItems.find(it => it.type === 'stop')?.stop
      let clock = firstStop ? firstStop.startHour : 10
      let prevId = null
      // A stop never starts before its period's window opens (Afternoon ≥ 12pm,
      // Evening ≥ 5pm) — otherwise back-to-back packing could clock an evening
      // venue at 1:50pm while its label still said "Evening".
      const periodFloor = { Morning: 0, Afternoon: 12, Evening: 17 }
      reorderedItems.forEach(it => {
        if (it.type === 'restaurant') { clock += 1.25; return }
        const s = it.stop
        if (prevId) {
          const t = estimateTravel(prevId, s.id)
          clock += (t?.mins ?? 12) / 60
        }
        clock = Math.max(clock, periodFloor[s.period] ?? 0)
        stopClock[s.id] = clock
        clock += (typeof s.duration === 'number' ? s.duration : 1)
        prevId = s.id
      })
    }
    // Day start/end taken from the sequenced clock (incl. meals + travel) so the
    // day-summary strip matches the actual stop times shown on the cards.
    const stopList = reorderedItems.filter(it => it.type === 'stop').map(it => it.stop)
    const firstStopC = stopList[0]
    const lastStopC = stopList[stopList.length - 1]
    const dayStart = firstStopC ? stopClock[firstStopC.id] : null
    const dayEnd = lastStopC ? stopClock[lastStopC.id] + (typeof lastStopC.duration === 'number' ? lastStopC.duration : 1) : null
    return { sortedDayStops, reorderedItems, stopClock, defaultItemIds, dayStart, dayEnd, hasDaytime: hasDaytime2, hasEvening: hasEvening2 }
  }

  // ── Export the itinerary as a clean, printable PDF ──────────────────────────
  // Opens a self-contained, print-styled page and auto-prints; the browser's
  // "Save as PDF" produces the file. Dependency-free so it works offline and in
  // a future native app wrapper. Shows time/order, neighborhood, meals, notes.
  function exportItineraryPdf() {
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
    const dayCount = days.length
    const sub = `${totalStops} stop${totalStops !== 1 ? 's' : ''}${dayCount > 1 ? ` · ${dayCount} days` : ''}`
    let body = ''
    days.forEach((day, dayIdx) => {
      const dp = computeDayPlan(day, dayIdx)
      const range = (dp.dayStart != null && dp.dayEnd != null) ? `${fmtHour(dp.dayStart)} – ${fmtHour(dp.dayEnd)}` : ''
      const label = getDayLabel(dayIdx, tripStartDate)
      let rows = ''
      dp.reorderedItems.forEach(it => {
        if (it.type === 'restaurant') {
          rows += `<div class="meal">🍴 ${it.meal === 'lunch' ? 'Lunch' : 'Dinner'}</div>`
          return
        }
        const s = it.stop
        // Match the in-app cards: period derived from the sequenced clock, no
        // per-stop times (users put exact times in their notes).
        const t = periodForClock(dp.stopClock[s.id] ?? s.startHour, s.period)
        const meta = [s.neighborhood].filter(Boolean).map(esc).join(' · ')
        const note = (venueNotes[s.id] || '').trim()
        rows += `<div class="stop"><div class="time">${esc(t)}</div><div class="b">`
          + `<div class="name">${esc(s.name)}</div>`
          + (meta ? `<div class="meta">${meta}</div>` : '')
          + (note ? `<div class="note">${esc(note)}</div>` : '')
          + `</div></div>`
      })
      body += `<div class="day"><div class="dh"><span>${esc(String(label).toUpperCase())}${day.area ? ' · ' + esc(day.area) : ''}</span>${range ? `<span class="rg">${esc(range)}</span>` : ''}</div>${rows}</div>`
    })
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My NYC Trip</title><style>
*{box-sizing:border-box}body{font-family:-apple-system,system-ui,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1d2733;margin:0;padding:28px 24px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1{font-size:23px;margin:0 0 2px}.sub{color:#7a8694;font-size:13px;margin-bottom:22px}
.day{margin-bottom:20px;page-break-inside:avoid}
.dh{background:#1d2733;color:#fff;border-radius:8px;padding:8px 12px;font-size:12.5px;font-weight:800;letter-spacing:.04em;display:flex;justify-content:space-between;align-items:center}
.dh .rg{font-weight:600;opacity:.82}
.stop{display:flex;gap:12px;padding:9px 4px;border-bottom:1px solid #eef1f4}
.time{width:78px;flex:none;color:#993C1D;font-weight:700;font-size:13px}
.b{flex:1}.name{font-weight:700;font-size:14px}.meta{color:#7a8694;font-size:12px;margin-top:1px}
.note{color:#54606e;font-size:12px;font-style:italic;margin-top:3px}
.meal{color:#7a8694;font-size:12.5px;font-weight:600;padding:7px 4px 7px 90px;border-bottom:1px solid #eef1f4}
.foot{margin-top:18px;color:#9aa4b0;font-size:11px}
.bar{position:sticky;top:0;background:#fff;padding:10px 0 14px;display:flex;gap:10px}
.bar button{background:#E0552C;color:#fff;border:none;border-radius:999px;padding:11px 20px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
@media print{.noprint{display:none!important}body{padding:0}@page{margin:14mm}}
</style></head><body>
<div class="bar noprint"><button onclick="window.print()">⬇ Save as PDF</button></div>
<h1>My NYC Trip</h1><div class="sub">${esc(sub)}</div>
${body || '<div class="sub">No stops yet — add places to My Trip first.</div>'}
<div class="foot">Made with NYC Stoop</div>
<script>window.addEventListener('load',function(){setTimeout(function(){try{window.print()}catch(e){}},350)})</script>
</body></html>`
    const w = window.open('', '_blank')
    if (!w) { alert('Please allow pop-ups to download your schedule, then tap again.'); return }
    w.document.open(); w.document.write(html); w.document.close()
  }

  // Restore saved snapshot on mount so returning users land on their plan
  const _snap = (() => { try { return JSON.parse(localStorage.getItem('nyc_plan_snapshot') || 'null') } catch { return null } })()
  // Show saved plan summary if user just saved OR if they're returning and have a snapshot
  if (savedPlanView && _snap) {
    return <SavedPlanSummary snapshot={_snap} onBack={() => setSavedPlanView(false)} />
  }

  // Stops + meal count for the header subtitle (totals across all days)
  const totalStops = days.reduce((n, d) => n + d.stops.length, 0)
  const totalMeals = days.reduce((n, d) => {
    const hasDaytime = d.stops.some(s => s.period === 'Morning' || s.period === 'Afternoon')
    const hasEve = d.stops.some(s => s.period === 'Evening')
    return n + (hasDaytime ? 1 : 0) + (hasEve ? 1 : 0)  // lunch only on daytime days + dinner if any evening
  }, 0)

  // ── Saved events → trip days. With an arrival date set, any saved event whose
  // date lands inside the trip renders pinned inside that day (it's date-fixed —
  // the one thing the planner can't move). Without a date, events stay in the
  // "Saved events" section as before. Plain computation, no hooks — safe here.
  const eventsByDay = (() => {
    if (!tripStartDate) return {}
    const parts = tripStartDate.split('-').map(Number)
    const start = new Date(parts[0], parts[1] - 1, parts[2]); start.setHours(0, 0, 0, 0)
    const map = {}
    savedEvts.map(hydrateSavedEvent).forEach(e => {
      if (!(e.date instanceof Date) || isNaN(e.date)) return
      const d0 = new Date(e.date); d0.setHours(0, 0, 0, 0)
      const idx = Math.round((d0 - start) / 86400000)
      if (idx >= 0 && idx < days.length) { (map[idx] = map[idx] || []).push(e) }
    })
    return map
  })()
  const plannedEventIds = new Set(Object.values(eventsByDay).flat().map(e => e.id))

  return (
    <div className="screen">

      {/* ══ Header — branded to match Explore / Tonight ══ */}
      <div className="home-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div className="home-wordmark">My Trip</div>
          {/* Current conditions — same source as the home header, so no tab-hopping. */}
          {weather && (
            <div aria-label={`Current weather: ${weather.temp} degrees`} style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }} aria-hidden="true">{weatherEmoji(weather.code, weather.isDay)}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{fmtTemp(weather.temp)}°</span>
            </div>
          )}
        </div>
        {/* (Subtitle counts + tagline removed — the trip summary card right below
            already says the days, and stop/meal counts were inventory numbers.) */}
      </div>

      {/* ══ Trip basics — dates are SET ONCE, READ OFTEN: show a one-line
          summary card; the actual controls only unfold behind Edit. (They used
          to be two always-visible rows pushing the schedule below the fold.) ══ */}
      <div style={{ padding: '4px 20px 14px', borderBottom: '1px solid var(--gray-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>{t('Your trip')}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {(() => {
                if (!tripStartDate) return <span style={{ color: 'var(--gray-400)', fontWeight: 500 }}>{t('No dates yet — planning by day')}</span>
                const p = tripStartDate.split('-').map(Number)
                const s = new Date(p[0], p[1] - 1, p[2])
                const e = new Date(p[0], p[1] - 1, p[2] + Math.max(days.length - 1, 0))
                const fmt = d => d.toLocaleDateString(dateLocale(), { weekday: 'short', month: 'short', day: 'numeric' })
                return <>{days.length > 1 ? `${fmt(s)} – ${fmt(e)}` : fmt(s)} <span style={{ color: 'var(--gray-400)', fontWeight: 500 }}>· {t2(days.length === 1 ? '1 day' : '{N} days', { N: days.length })}</span></>
              })()}
            </div>
          </div>
          <button onClick={() => setBasicsOpen(o => !o)} style={{
            flexShrink: 0, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            background: basicsOpen ? 'var(--gray-900)' : 'none',
            color: basicsOpen ? '#fff' : 'var(--accent-text)',
            fontSize: 12.5, fontWeight: 700, padding: '6px 12px', borderRadius: 999,
          }}>{basicsOpen ? t('Done') : t('Edit')}</button>
        </div>
        {basicsOpen && (<div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)', flexShrink: 0, width: 58 }}>{t('Arriving')}</span>
          <input
            type="date"
            value={tripStartDate}
            onChange={e => setAndStoreTripStartDate(e.target.value)}
            style={{
              flex: 1, padding: '6px 10px', borderRadius: 10,
              border: '1.5px solid var(--gray-200)', fontSize: 12.5,
              color: tripStartDate ? 'var(--gray-900)' : 'var(--gray-400)',
              background: 'var(--white)', outline: 'none', fontFamily: 'inherit',
            }}
          />
          {tripStartDate && (
            <button onClick={() => setAndStoreTripStartDate('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, color: 'var(--gray-400)', padding: '4px 6px', borderRadius: 8, flexShrink: 0,
            }}>✕</button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)', flexShrink: 0, width: 58 }}>{t('Days')}</span>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="hide-scrollbar">
            {[null, 1, 2, 3, 4, 5, 6, 7].map(n => {
              const active = tripDays === n
              return (
                <button key={n ?? 'auto'} onClick={() => setAndStoreTripDays(n)} style={{
                  flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: active ? 700 : 500,
                  background: active ? 'var(--gray-900)' : 'var(--gray-100)',
                  color: active ? '#fff' : 'var(--gray-500)',
                  transition: 'all 0.15s ease',
                }}>
                  {n === null ? t('Auto') : n}
                </button>
              )
            })}
          </div>
        </div>
        </div>)}
      </div>


      {/* ══ SECTION 2: Trip Settings drawer — collapsed by default so the plan leads ══ */}
      <div ref={schedulingRef} style={{ borderBottom: '1px solid var(--gray-100)' }}>
        <button onClick={() => setSettingsOpen(o => !o)} style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
          textAlign: 'left',
        }}>
          <span style={{ fontSize: 16 }}>✓</span>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
            {t('Choose stops')}
          </span>
          <span style={{ fontSize: 11, color: 'var(--gray-400)', marginLeft: 4 }}>
            {t2('{A} of {B} in plan', { A: venueIds.length, B: allVenueIds.length })}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 16, color: 'var(--gray-400)', transition: 'transform 200ms', transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
            ⌄
          </span>
        </button>

        {settingsOpen && (
          <div style={{ padding: '4px 20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Length + Arrival moved to the visible "Trip basics" strip at the top of
                the page — they define the trip and shouldn't hide in a drawer. */}
            {/* Cuisine selection moved to each meal card — every meal can have its own cuisine now. */}

            {/* Planning with — 2-column grid for stop chips (cleaner alignment than free wrap) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)', flexShrink: 0, width: 78, paddingTop: 6 }}>
                Stops <span style={{ color: 'var(--gray-300)' }}>{venueIds.length}/{allVenueIds.length}</span>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6 }}>
                  {allVenueIds.map(id => {
                    const v = venues[id] || userVenues[id]
                    if (!v) return null
                    const isUser = !venues[id] && !!userVenues[id]
                    const selected = planSelection.has(id)
                    const domainId = Object.keys(domains).find(d => domains[d].venues?.includes(id))
                    const userCatIcon = { food:'🍴', coffee:'☕', drink:'🍷', drinks:'🍷', art:'🎨', music:'🎵', history:'📜', sports:'🏆', shopping:'🛍️', other:'📍' }
                    const icon = isUser
                      ? (userCatIcon[v.category] || '📍')
                      : ({ visual_art:'🎨', jazz:'🎷', classical_music:'🎼', theater:'🎭', history:'📜', architecture:'🏛️', sports:'🏆', hip_hop:'🎤' }[domainId] || '📍')
                    return (
                      <button
                        key={id}
                        onClick={() => toggleVenueInPlan(id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '6px 10px', borderRadius: 999, cursor: 'pointer',
                          fontSize: 11, fontWeight: 600,
                          background: selected ? 'var(--gray-900)' : 'var(--white)',
                          color: selected ? '#fff' : 'var(--gray-500)',
                          border: selected ? '1px solid var(--gray-900)' : '1px solid var(--gray-200)',
                          opacity: selected ? 1 : 0.7,
                          transition: 'all 0.15s ease',
                          minWidth: 0,
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>{icon}</span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{v.name}</span>
                      </button>
                    )
                  })}
                </div>
                {allVenueIds.length > 1 && venueIds.length < allVenueIds.length && (
                  <button onClick={() => { const s = new Set(allVenueIds); setPlanSelection(s); lsSet('nyc_plan_sel', JSON.stringify([...s])) }}
                    style={{ fontSize: 11, color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0 0', textDecoration: 'underline' }}>
                    Select all
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>



      {days.length === 0 && (
        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
          {venueIds.length === 0 && allVenueIds.length > 0 ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>☝️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>No stops selected</div>
              <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
                Tap a venue chip above to add it to your plan.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>Nothing to plan yet</div>
              <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 280, margin: '0 auto 20px' }}>
                Tap “+ Add to My Trip” on any venue in Explore to add it here — or start with a sample weekend.
              </div>
              <button
                onClick={() => {
                  const SAMPLE = ['moma', 'guggenheim', 'village_vanguard', 'carnegie_hall', 'brooklyn', 'central_park']
                  const savedIds = new Set(Object.values(safeItems).filter(i => i?.type === 'venue').map(i => i.id))
                  SAMPLE.forEach(id => { if (!savedIds.has(id) && venues[id]) toggleSave('venue', id) })
                }}
                style={{
                  background: 'var(--gray-900)', color: '#fff', border: 'none',
                  borderRadius: 12, padding: '13px 28px',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Build me a sample weekend
              </button>
            </>
          )}
        </div>
      )}

      {/* Full plan / Checklist toggle removed — Full plan is the only view now. */}

      {/* ── Today checklist view (dead: todayMode is always false) ── */}
      {todayMode && days.length > 0 && (() => {
        // Same order + clock as the Full plan, so times match exactly.
        const { reorderedItems, stopClock } = computeDayPlan(days[0], 0)
        const todayStops = reorderedItems.filter(it => it.type === 'stop').map(it => it.stop)
        const total = todayStops.length
        const done = todayStops.filter(s => checkedStops.has(s.id)).length
        const pct = total > 0 ? Math.round((done / total) * 100) : 0
        return (
          <div style={{ padding: '16px 20px 32px' }}>
            {/* Progress bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-800)' }}>
                  {done === total && total > 0 ? '🎉 All done!' : `${done} of ${total} stops visited`}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{pct}%</div>
              </div>
              <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  background: done === total && total > 0 ? '#10b981' : 'var(--gray-900)',
                  width: pct + '%', transition: 'width 0.3s ease',
                }} />
              </div>
            </div>

            {/* Checklist stops */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todayStops.map((stop, i) => {
                const checked = checkedStops.has(stop.id)
                const pc = PERIOD_COLORS[stop.period] || PERIOD_COLORS.Afternoon
                return (
                  <button key={stop.id} onClick={() => toggleChecked(stop.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: checked ? 'var(--gray-50)' : 'var(--white)',
                    border: '1px solid ' + (checked ? 'var(--gray-200)' : 'var(--gray-200)'),
                    borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                    opacity: checked ? 0.55 : 1, transition: 'opacity 0.2s',
                  }}>
                    {/* Check circle */}
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      border: checked ? 'none' : '2px solid var(--gray-300)',
                      background: checked ? '#10b981' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {checked && <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 15, fontWeight: 700, color: 'var(--gray-900)',
                        textDecoration: checked ? 'line-through' : 'none',
                      }}>
                        {DOMAIN_ICONS[stop.domain] || '📍'} {stop.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                        {t(periodForClock(stopClock[stop.id] ?? stop.startHour, stop.period))} · {stop.neighborhood}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {done === total && total > 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0 0', fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 }}>
                Amazing day — you've seen it all. 🗽
              </div>
            )}
          </div>
        )
      })()}

      {/* Pre-trip prompt — surfaces the date picker when it matters most.
          Without this most first-time visitors never realize Trip Settings
          has an arrival date input, so day labels stay "Day 1 / Day 2" and
          can't match real day-of-week (theater schedules, restaurant hours). */}
      {!todayMode && !tripStartDate && days.length > 0 && (
        <div style={{ padding: '12px 20px 0' }}>
          <button
            onClick={() => { setSettingsOpen(true); setTimeout(() => schedulingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60) }}
            style={{
              width: '100%', background: '#fef3c7',
              border: '1px solid #fcd34d', borderRadius: 12,
              padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 18 }}>📅</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#78350f' }}>
                When are you visiting?
              </div>
              <div style={{ fontSize: 11, color: '#92400e', marginTop: 1, lineHeight: 1.35 }}>
                Set your arrival date to see real day labels (Thursday, Apr 4) and match theater + restaurant hours.
              </div>
            </div>
            <span style={{ fontSize: 13, color: '#78350f', flexShrink: 0 }}>›</span>
          </button>
        </div>
      )}

      {/* ── Day selector — horizontal, sticky. On multi-day trips the stacked
          list meant scrolling through every prior day to reach Day 4; these
          tabs filter to one day at a time ("All days" restores the overview,
          which is also where cross-day drag lives). ── */}
      {!todayMode && days.length > 1 && (
        <div style={{
          position: 'sticky', top: 'env(safe-area-inset-top, 0px)', zIndex: 30,
          background: 'var(--canvas)',
          padding: '6px 20px 8px',
          borderBottom: '1px solid var(--gray-100)',
          display: 'flex', gap: 8, overflowX: 'auto',
          WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
        }} className="hide-scrollbar">
          {[null, ...days.map((_, i) => i)].map(idx => {
            const active = dayFilter === idx
            const dateLabel = idx !== null && tripStartDate
              ? (() => { const p = tripStartDate.split('-').map(Number); const d = new Date(p[0], p[1] - 1, p[2] + idx); return `${d.getMonth() + 1}/${d.getDate()}` })()
              : null
            return (
              <button key={idx === null ? 'all' : idx}
                onClick={() => setDayFilter(idx)}
                style={{
                  flexShrink: 0, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  padding: dateLabel ? '5px 14px 6px' : '9px 14px', borderRadius: 12,
                  background: active ? (idx === null ? 'var(--gray-900)' : dayHue(idx)) : 'var(--card)',
                  color: active ? '#fff' : 'var(--gray-600)',
                  borderBottom: 'none', textAlign: 'center',
                  boxShadow: active ? 'none' : 'inset 0 0 0 1px rgba(33,27,20,0.10)',
                }}>
                {dateLabel && <span style={{ display: 'block', fontSize: 10, fontWeight: 600, opacity: active ? 0.75 : 0.6, marginBottom: 1 }}>{dateLabel}</span>}
                <span style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>
                  {idx !== null && !active && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 999, background: dayHue(idx), marginRight: 5, verticalAlign: '1px' }} />}
                  {idx === null ? t('All days') : t2('Day {N}', { N: idx + 1 })}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Plan view ── */}
      {!todayMode && days.map((day, dayIdx) => {
        // Day tabs: when a single day is selected, hide the others and force
        // that day open (a filtered-to view should never show a collapsed stub).
        if (dayFilter !== null && dayFilter < days.length && dayIdx !== dayFilter) return null
        // Single source of truth for ordering, clock, meals, and the summary range.
        const dayPlan = computeDayPlan(day, dayIdx)

        // Day summary strip — start/end from the sequenced clock so it matches the
        // card times; meal label reflects which meals actually render.
        const dayStops = day.stops
        const summaryBits = []
        if (dayPlan.dayStart != null && dayPlan.dayEnd != null) summaryBits.push(`${fmtHour(dayPlan.dayStart)} – ${fmtHour(dayPlan.dayEnd)}`)
        summaryBits.push(t2(dayStops.length === 1 ? '1 stop' : '{N} stops', { N: dayStops.length }))
        const mealLabel = dayPlan.hasDaytime && dayPlan.hasEvening ? t('Lunch + Dinner')
          : dayPlan.hasEvening ? t('Dinner')
          : dayPlan.hasDaytime ? t('Lunch') : ''
        if (mealLabel) summaryBits.push(mealLabel)
        const dayEventCount = (eventsByDay[dayIdx] || []).length
        if (dayEventCount) summaryBits.push(t2(dayEventCount === 1 ? '1 event' : '{N} events', { N: dayEventCount }))

        const isCollapsed = dayFilter === null && collapsedDays.has(dayIdx)
        // Highlight this day's container when it's the cross-day drop target.
        // The check is: a drag is in progress (dragId), the cursor is over THIS day,
        // and this day isn't the origin (otherwise every same-day move would tint).
        const isCrossDayTarget = dragId && hoverDayIdx === dayIdx && hoverDayIdx !== dragDayIdx
        return (
          <div
            key={dayIdx}
            ref={el => {
              if (el) dayContainerRefs.current[dayIdx] = el
              else delete dayContainerRefs.current[dayIdx]
            }}
            style={{
              padding: '16px 20px 0',
              background: isCrossDayTarget ? 'rgba(34,197,94,0.07)' : 'transparent',
              borderRadius: isCrossDayTarget ? 14 : 0,
              transition: 'background 120ms ease',
            }}
          >
            {/* Day header — whole row is tappable to fold/unfold this day */}
            <div
              onClick={() => toggleDayCollapsed(dayIdx)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer', userSelect: 'none' }}
            >
              {/* Chevron — rotates between expanded/collapsed states. Bigger touch target so it reads clearly. */}
              <span style={{
                fontSize: 18, fontWeight: 800, color: 'var(--gray-700)',
                width: 22, height: 22, textAlign: 'center', lineHeight: '22px',
                transition: 'transform 180ms ease',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                flexShrink: 0,
              }}>▾</span>
              <div style={{
                background: dayHue(dayIdx), color: '#fff',
                fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                letterSpacing: '0.04em',
              }}>{getDayLabel(dayIdx, tripStartDate).toUpperCase()}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-700)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{day.area}</div>
              {/* One-line header: pill · area · forecast (right-aligned). The old
                  "drag to reorder" hint is gone — the ▲⠿▼ rails on every card
                  are their own explanation. Forecast needs an arrival date and
                  is silently absent beyond the 16-day window. */}
              {(() => {
                const fx = forecastForDay(dayIdx)
                return fx ? (
                  <div aria-label={`Forecast: high ${fx.hi}, low ${fx.lo}`} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 14, lineHeight: 1 }} aria-hidden="true">{weatherEmoji(fx.code, 1)}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-600)', lineHeight: 1 }}>{fmtTemp(fx.hi)}°<span style={{ fontWeight: 500, color: 'var(--gray-400)' }}>/{fmtTemp(fx.lo)}°</span></span>
                  </div>
                ) : null
              })()}
            </div>

            {/* Day summary strip — glance-level info. Stays visible even when collapsed so users see what's in each day. */}
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: isCollapsed ? 20 : 12, lineHeight: 1.4, paddingLeft: 32 }}>
              {summaryBits.join(' · ')}
            </div>

            {/* Day map preview removed — the Map tab already covers geography, and this mini-map desynced on reorder. */}

            {/* Stops + restaurant cards — hidden when day is collapsed */}
            {!isCollapsed && (() => {
              // Order + sequenced clock come from the shared helper so this Full-plan
              // view and the Checklist view never disagree on order or times.
              const { reorderedItems, stopClock, defaultItemIds } = dayPlan
              const allStopIds = days.flatMap(d => d.stops.map(s => s.id))
              return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {reorderedItems.map((item, itemIdx) => {
                // ── Travel connector between EVERY consecutive card (stops AND
                // meals). Stops resolve via venueCoords/userVenues; restaurants
                // via real coords (imports) or neighborhood centroid (curated). ──
                const coordsOf = (it) => {
                  if (it.type === 'stop') {
                    const c = venueCoords[it.stop.id]
                    if (c) return c
                    const uv = userVenues[it.stop.id]
                    return (typeof uv?.lat === 'number' && typeof uv?.lng === 'number') ? { lat: uv.lat, lng: uv.lng } : null
                  }
                  return restaurantCoords(it.meal === 'lunch' ? lunchRestaurants[dayIdx] : dinnerRestaurants[dayIdx])
                }
                const _myCoord = coordsOf(item)
                const _prevCoord = (() => {
                  for (let j = itemIdx - 1; j >= 0; j--) { const c = coordsOf(reorderedItems[j]); if (c) return c }
                  return null
                })()
                const _travel = itemIdx > 0 && _prevCoord && _myCoord ? estimateTravelCoords(_prevCoord, _myCoord) : null
                // Same-line subway detail from the MTA station data — "E·F
                // Downtown · 5 Av/53 St → W 4 St". Transfer trips get no detail
                // (null) rather than an invented route.
                const _leg = _travel?.mode === 'subway' ? findSubwayLeg(_prevCoord, _myCoord) : null
                const travelConnector = _travel && _travel.mins > 0 ? (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    padding: '2px 16px', margin: '-4px 0 -4px',
                    color: 'var(--gray-400)', fontSize: 11, fontWeight: 600,
                  }}>
                    <span style={{ width: 2, alignSelf: 'stretch', minHeight: 14, background: 'var(--gray-200)', marginLeft: 6 }} />
                    <span style={{ lineHeight: '15px' }}>{_travel.icon}</span>
                    <span style={{ lineHeight: '15px' }}>
                      ~{_travel.mins} min {_travel.mode}
                      {_leg && (
                        <span style={{ display: 'block', fontWeight: 500, color: 'var(--gray-500)', marginTop: 3, lineHeight: 1.6 }}>
                          {/* Flex row centers the line bullets on the text midline —
                              baseline vertical-align sat visibly low. */}
                          <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                            <span>Take the{_leg.dir ? ` ${_leg.dir.toLowerCase()}` : ''}</span>
                            {_leg.lines.split('·').map((ln, li, arr) => (
                              <React.Fragment key={ln}>
                                {li > 0 && li === arr.length - 1 && <span>or</span>}
                                <SubwayBullet line={ln} />
                              </React.Fragment>
                            ))}
                            <span>at {_leg.from}</span>
                          </span>
                          <span style={{ display: 'block' }}>Get off at {_leg.to}</span>
                        </span>
                      )}
                    </span>
                  </div>
                ) : null

                if (item.type === 'restaurant') {
                  const isLunch = item.meal === 'lunch'
                  const cuisine = getMealCuisine(dayIdx, item.meal)
                  const restaurant = isLunch ? (lunchRestaurants[dayIdx] ?? null) : (dinnerRestaurants[dayIdx] ?? null)
                  const cuisineOpt = CUISINE_OPTIONS.find(o => o.id === cuisine)
                  const mapsSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent((cuisineOpt?.label || 'restaurants') + ' near ' + day.area + ' New York')}`
                  const pickerKey = `${dayIdx}:${item.meal}`
                  const isPickerOpen = openMealPicker === pickerKey
                  const mealId = `__${item.meal}__`
                  return (
                    <React.Fragment key={`rest-${item.meal}-frag`}>
                    {travelConnector}
                    <div
                      key={`rest-${item.meal}`}
                      ref={el => { if (el) stopCardRefs.current[mealId] = el; else delete stopCardRefs.current[mealId] }}
                      style={{
                        background: dragId === mealId ? 'var(--gray-100)' : 'var(--card)',
                        border: dragId === mealId ? '2px solid var(--gray-400)' : '1px solid rgba(33,27,20,0.10)',
                        borderRadius: 14, padding: '14px 16px 14px 36px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                        position: 'relative',
                        opacity: dragId !== null && dragId !== mealId ? 0.55 : 1,
                        transform: dragId === mealId ? 'scale(1.025)' : 'scale(1)',
                        boxShadow: dragId === mealId ? '0 8px 24px rgba(0,0,0,0.18)' : '0 4px 14px rgba(33,27,20,0.05)',
                        transition: dragId ? 'opacity 0.1s' : 'transform 0.18s, opacity 0.18s, box-shadow 0.18s',
                        userSelect: 'none', WebkitUserSelect: 'none',
                        zIndex: dragId === mealId ? 10 : 'auto',
                      }}
                    >
                      {/* Left rail — visible ↑/↓ nudge buttons around the drag grip, so
                          reordering never depends on discovering the press-and-hold. */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0, width: 30,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                      }}>
                        <button onClick={() => nudgeItem(dayIdx, mealId, -1, defaultItemIds)} aria-label="Move up" style={{
                          border: 'none', background: 'none', cursor: 'pointer', padding: '3px 6px',
                          fontSize: 10, color: 'var(--gray-400)', lineHeight: 1,
                        }}>▲</button>
                        <div
                          onTouchStart={e => { e.stopPropagation(); onItemTouchStart(e, mealId, dayIdx, defaultItemIds) }}
                          onTouchMove={e => onItemTouchMove(e, mealId)}
                          onTouchEnd={() => onItemTouchEnd(mealId, dayIdx)}
                          onTouchCancel={() => onItemTouchEnd(mealId, dayIdx)}
                          onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onItemTouchStart(e, mealId, dayIdx, defaultItemIds) }}
                          style={{
                            color: dragId === mealId ? 'var(--gray-700)' : 'var(--gray-300)',
                            fontSize: 18, userSelect: 'none', WebkitUserSelect: 'none',
                            letterSpacing: '-1px', cursor: dragId === mealId ? 'grabbing' : 'grab',
                            touchAction: 'none', padding: '2px 6px',
                          }}
                          aria-label="Drag to reorder"
                        >
                          ⠿
                        </div>
                        <button onClick={() => nudgeItem(dayIdx, mealId, 1, defaultItemIds)} aria-label="Move down" style={{
                          border: 'none', background: 'none', cursor: 'pointer', padding: '3px 6px',
                          fontSize: 10, color: 'var(--gray-400)', lineHeight: 1,
                        }}>▼</button>
                      </div>
                      {/* Meal label — cuisine badge tapped opens an inline picker FOR THIS MEAL on THIS DAY only. */}
                      {(() => {
                        const optionsCount = countRestaurantOptions(day.area, cuisine)
                        const canRefresh = optionsCount > 1
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 15 }}>{isLunch ? '🍴' : '🍷'}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: isLunch ? '#A96F22' : '#6B4453', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                              {isLunch ? t('Lunch') : t('Dinner')}
                            </span>
                            {cuisineOpt ? (
                              <button onClick={() => toggleMealPicker(dayIdx, item.meal)} aria-label="Change cuisine for this meal" style={{
                                fontSize: 11, fontWeight: 600,
                                color: cuisineOpt.color, background: cuisineOpt.color + '18',
                                padding: '2px 8px', borderRadius: 999, border: 'none', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: 3,
                              }}>
                                <span>{cuisineOpt.emoji}</span><span>{cuisineOpt.label}</span>
                                <span style={{ opacity: 0.6, marginLeft: 2, transition: 'transform 180ms', display: 'inline-block', transform: isPickerOpen ? 'rotate(90deg)' : 'rotate(0)' }}>›</span>
                              </button>
                            ) : (
                              <button onClick={() => toggleMealPicker(dayIdx, item.meal)} style={{
                                fontSize: 11, fontWeight: 600,
                                color: 'var(--gray-500)', background: 'var(--gray-100)',
                                padding: '2px 8px', borderRadius: 999, border: 'none', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: 3,
                              }}>
                                + Choose cuisine
                              </button>
                            )}
                            {canRefresh && !isPickerOpen && (
                              <button onClick={() => bumpRestaurantOffset(item.meal, dayIdx)} style={{
                                marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                                color: 'var(--gray-600)', background: 'var(--gray-100)',
                                border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 999,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                              }}>
                                <span>↻</span><span>{t('Show another')}</span>
                              </button>
                            )}
                          </div>
                        )
                      })()}

                      {/* Inline cuisine picker — expands beneath the meal label when user taps the badge. Sets cuisine for THIS meal only. */}
                      {isPickerOpen && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, padding: '2px 0' }}>
                          {CUISINE_OPTIONS.map(opt => {
                            const active = cuisine === opt.id
                            return (
                              <button key={opt.id}
                                onClick={() => {
                                  setMealCuisine(dayIdx, item.meal, active ? null : opt.id)
                                  setOpenMealPicker(null)
                                }}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                  padding: '5px 6px', borderRadius: 999, border: 'none', cursor: 'pointer',
                                  fontSize: 11, fontWeight: active ? 700 : 500,
                                  background: active ? opt.color : 'var(--gray-100)',
                                  color: active ? '#fff' : 'var(--gray-600)',
                                  minWidth: 0,
                                }}>
                                <span style={{ fontSize: 12 }}>{opt.emoji}</span>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{opt.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {/* Restaurant card — auto-filled with the nearest good spot; cuisine optional */}
                      {restaurant && (
                        <div style={{
                          background: 'var(--canvas)', border: '1px solid rgba(33,27,20,0.08)',
                          borderRadius: 12, padding: '14px 15px',
                        }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 3, lineHeight: 1.3 }}>
                            {restaurant.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 }}>
                            {restaurant.price} · {restaurant.neighborhood}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.55, marginBottom: 12 }}>
                            {restaurant.description}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {restaurant.walkIn ? (
                              <span style={{ flex: 1, background: 'var(--gray-100)', color: 'var(--gray-600)',
                                textAlign: 'center', fontSize: 12, fontWeight: 600, padding: '7px 8px', borderRadius: 8 }}>
                                Walk-in · no reservation
                              </span>
                            ) : restaurant.reservationUrl ? (
                              <a href={restaurant.reservationUrl} target="_blank" rel="noopener noreferrer"
                                style={{ flex: 1, background: '#15803d', color: '#fff', textAlign: 'center',
                                  fontSize: 12, fontWeight: 700, padding: '7px 8px', borderRadius: 8, textDecoration: 'none' }}>
                                {t('Reserve a table')}
                              </a>
                            ) : (
                              <span style={{ flex: 1, background: 'var(--gray-100)', color: 'var(--gray-500)',
                                textAlign: 'center', fontSize: 12, fontWeight: 600, padding: '7px 8px', borderRadius: 8 }}>
                                Walk-ins · call ahead
                              </span>
                            )}
                            <MapsButton name={restaurant.name} area={restaurant.neighborhood} googleUrl={restaurant.mapsUrl} />
                          </div>
                        </div>
                      )}
                      {/* Empty state — only shows if we genuinely couldn't find anything */}
                      {!restaurant && (
                        <div style={{ fontSize: 13, color: 'var(--gray-400)', fontStyle: 'italic' }}>
                          No spots found for this area yet —
                          <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray-500)', marginLeft: 4 }}>browse Google Maps →</a>
                        </div>
                      )}
                    </div>
                    </React.Fragment>
                  )
                }

                // Normal stop card
                const stop = item.stop
                const shownPeriod = periodForClock(stopClock[stop.id] ?? stop.startHour, stop.period)
                const pc = PERIOD_COLORS[shownPeriod] || PERIOD_COLORS.Afternoon
                const bookUrl = stop.nowPlaying?.bookingUrl || stop.ticketUrl || stop.scheduleUrl
                const stopPosition = (stopOrderOverride || allStopIds).indexOf(stop.id)
                const isFirst = stopPosition === 0
                const isLast = stopPosition === (stopOrderOverride || allStopIds).length - 1
                // Travel connector comes from the shared per-item chain above —
                // it now links from the immediately previous card (meal or stop).
                return (
                  <React.Fragment key={stop.id + '-frag'}>
                    {travelConnector}
                  <div
                    key={stop.id}
                    ref={el => { if (el) stopCardRefs.current[stop.id] = el; else delete stopCardRefs.current[stop.id] }}
                    style={{
                      background: dragId === stop.id ? 'var(--gray-100)' : 'var(--card)',
                      border: dragId === stop.id ? '2px solid var(--gray-400)' : '1px solid rgba(33,27,20,0.10)',
                      borderRadius: 14,
                      overflow: 'hidden',
                      position: 'relative',
                      opacity: dragId !== null && dragId !== stop.id ? 0.55 : 1,
                      transform: dragId === stop.id ? 'scale(1.025)' : 'scale(1)',
                      boxShadow: dragId === stop.id ? '0 8px 24px rgba(0,0,0,0.18)' : '0 4px 14px rgba(33,27,20,0.05)',
                      transition: dragId ? 'opacity 0.1s' : 'transform 0.18s, opacity 0.18s, box-shadow 0.18s',
                      userSelect: 'none', WebkitUserSelect: 'none',
                      zIndex: dragId === stop.id ? 10 : 'auto',
                      paddingLeft: 28,  // make room for drag handle
                    }}
                  >
                    {/* Left rail — ↑/↓ nudge buttons + drag grip (drag stays primary;
                        the arrows make reorder discoverable without the long-press). */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 5, width: 28,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                      background: dragId === stop.id ? 'var(--gray-50)' : 'transparent',
                    }}>
                      <button onClick={e => { e.stopPropagation(); nudgeItem(dayIdx, stop.id, -1, defaultItemIds) }} aria-label="Move up" style={{
                        border: 'none', background: 'none', cursor: 'pointer', padding: '3px 5px',
                        fontSize: 10, color: 'var(--gray-400)', lineHeight: 1,
                      }}>▲</button>
                      <div
                        onTouchStart={e => { e.stopPropagation(); onItemTouchStart(e, stop.id, dayIdx, defaultItemIds) }}
                        onTouchMove={e => onItemTouchMove(e, stop.id)}
                        onTouchEnd={() => onItemTouchEnd(stop.id, dayIdx)}
                        onTouchCancel={() => onItemTouchEnd(stop.id, dayIdx)}
                        onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onItemTouchStart(e, stop.id, dayIdx, defaultItemIds) }}
                        style={{
                          color: dragId === stop.id ? 'var(--gray-700)' : 'var(--gray-300)',
                          fontSize: 18, userSelect: 'none', WebkitUserSelect: 'none',
                          letterSpacing: '-1px', cursor: dragId === stop.id ? 'grabbing' : 'grab',
                          touchAction: 'none', padding: '2px 5px',
                        }}
                        aria-label="Drag to reorder"
                      >
                        ⠿
                      </div>
                      <button onClick={e => { e.stopPropagation(); nudgeItem(dayIdx, stop.id, 1, defaultItemIds) }} aria-label="Move down" style={{
                        border: 'none', background: 'none', cursor: 'pointer', padding: '3px 5px',
                        fontSize: 10, color: 'var(--gray-400)', lineHeight: 1,
                      }}>▼</button>
                    </div>
                    {/* Period + time bar */}
                    <div style={{
                      background: pc.bg,
                      padding: '7px 14px',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: pc.dot, display: 'inline-block', flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: pc.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {t(shownPeriod)}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: pc.text, opacity: 0.7 }}>
                        ~{stop.duration < 1 ? `${Math.round(stop.duration * 60)} min` : stop.duration % 1 === 0 ? `${stop.duration} hrs` : `${stop.duration.toFixed(1)} hrs`}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleVenueInPlan(stop.id) }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        aria-label="Remove from trip"
                        title="Remove from trip"
                        style={{
                          marginLeft: 10, flexShrink: 0, background: 'none', border: 'none',
                          cursor: 'pointer', color: pc.text, opacity: 0.5, fontSize: 14,
                          lineHeight: 1, padding: '0 2px', fontFamily: 'inherit',
                        }}
                      >✕</button>
                    </div>

                    {/* Venue info */}
                    <div style={{ padding: '12px 14px' }}>
                      {/* Tappable row — navigates to venue detail.
                          User-added places don't have a curated detail page, so we render the same
                          row as a non-interactive div with an "Added by you" tag instead. */}
                      {stop.isCustom ? (
                        <div
                          style={{
                            width: '100%', padding: 0, textAlign: 'left',
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                          }}
                        >
                          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{DOMAIN_ICONS[stop.domain] || '📍'}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.25 }}>{stop.name}</div>
                              <span style={{
                                fontSize: 9, fontWeight: 700, letterSpacing: '0.05em',
                                textTransform: 'uppercase', color: 'var(--gray-500)',
                                background: 'var(--gray-100)', padding: '2px 6px', borderRadius: 4,
                              }}>Added by you</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3 }}>{stop.neighborhood}</div>
                            {stop.blurb && (
                              <div style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 5, lineHeight: 1.5 }}>
                                {stop.blurb}
                              </div>
                            )}
                            {stop.address && (
                              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>📍 {stop.address}</div>
                            )}
                            {stop.hours && (
                              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>🕒 {stop.hours}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); onSelectSaved?.({ type: 'venue', id: stop.id }) }}
                          style={{
                            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                            padding: 0, textAlign: 'left',
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                          }}
                        >
                          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{DOMAIN_ICONS[stop.domain] || '📍'}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.25 }}>{stop.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3 }}>{stop.neighborhood}</div>
                            {stop.nowPlaying?.title && (
                              <div style={{
                                fontSize: 12, color: '#15803d', fontWeight: 600, marginTop: 5,
                                background: '#f0fdf4', display: 'inline-block', padding: '2px 8px', borderRadius: 6,
                              }}>🎭 {stop.nowPlaying.title} · {stop.nowPlaying.through}</div>
                            )}
                            {stop.admissionCost && (
                              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>💰 {stop.admissionCost}</div>
                            )}
                          </div>
                          <span style={{ fontSize: 20, color: 'var(--gray-300)', alignSelf: 'center', flexShrink: 0 }}>›</span>
                        </button>
                      )}

                      {/* Note textarea — outside button so it doesn't trigger navigation */}
                      <textarea
                        value={venueNotes[stop.id] || ''}
                        onChange={e => setVenueNote(stop.id, e.target.value)}
                        placeholder={t('Add a note…')}
                        rows={1}
                        style={{
                          width: '100%', border: 'none', outline: 'none', resize: 'none',
                          padding: '6px 0 0', fontSize: 12, color: 'var(--gray-600)',
                          background: 'transparent', fontFamily: 'inherit', lineHeight: 1.5,
                          boxSizing: 'border-box', marginLeft: 30,
                        }}
                        onClick={e => e.stopPropagation()}
                      />

                      {/* Bottom action row: booking link + "⋯ Options" toggle */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        marginTop: 6, marginLeft: 30,
                      }}>
                        {bookUrl && (
                          <a
                            href={bookUrl} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{
                              fontSize: 11, color: 'var(--gray-400)', textDecoration: 'none',
                            }}
                          >
                            {stop.nowPlaying?.title ? `🎟 Book tickets →` :
                             stop.isEvening ? '🎟 Get tickets →' : '🌐 Visit website →'}
                          </a>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); setExpandedStopId(prev => prev === stop.id ? null : stop.id) }}
                          style={{
                            marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                            color: expandedStopId === stop.id ? 'var(--gray-900)' : 'var(--gray-400)',
                            background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                          }}
                        >
                          {expandedStopId === stop.id ? '× ' + t('Done') : '⋯ ' + t('Options')}
                        </button>
                      </div>
                    </div>

                    {/* Reorder controls: period toggle + swap + move-to-day (when 2+ days).
                        Hidden by default to keep the card clean. Tap "⋯ Options" to expand. */}
                    {expandedStopId === stop.id && (
                      <div style={{
                        borderTop: '1px solid var(--gray-100)',
                        padding: '9px 12px',
                        display: 'flex', flexDirection: 'column', gap: 6,
                        background: 'var(--gray-50)',
                      }}>
                        {/* Row 1: swap */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                          <button onClick={() => setSwapModal({ venueId: stop.id, domain: stop.domain })} style={{
                            fontSize: 11, fontWeight: 600, padding: '4px 10px',
                            borderRadius: 8, border: '1px solid var(--gray-200)', cursor: 'pointer',
                            background: 'var(--white)', color: 'var(--gray-600)',
                          }}>⇄ Swap this spot</button>
                        </div>
                        {/* Row 2: move-to-day buttons (only when 2+ days exist) */}
                        {days.length > 1 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Move to:
                            </span>
                            {dayIdx > 0 && (
                              <button onClick={() => moveStopToDay(stop.id, dayIdx - 1)} style={{
                                fontSize: 11, fontWeight: 600, padding: '4px 9px',
                                borderRadius: 8, border: '1px solid var(--gray-200)', cursor: 'pointer',
                                background: 'var(--white)', color: 'var(--gray-700)',
                              }}>
                                ← Day {dayIdx}
                              </button>
                            )}
                            {dayIdx < days.length - 1 && (
                              <button onClick={() => moveStopToDay(stop.id, dayIdx + 1)} style={{
                                fontSize: 11, fontWeight: 600, padding: '4px 9px',
                                borderRadius: 8, border: '1px solid var(--gray-200)', cursor: 'pointer',
                                background: 'var(--white)', color: 'var(--gray-700)',
                              }}>
                                Day {dayIdx + 2} →
                              </button>
                            )}
                            {stopDayOverrides[stop.id] != null && (
                              <button onClick={() => {
                                const { [stop.id]: _, ...rest } = stopDayOverrides
                                setStopDayOverrides(rest)
                                try { lsSet('nyc_stop_day_overrides', JSON.stringify(rest)) } catch {}
                              }} style={{
                                marginLeft: 'auto', fontSize: 11, fontWeight: 500, padding: '4px 8px',
                                borderRadius: 8, border: 'none', cursor: 'pointer',
                                background: 'none', color: 'var(--gray-400)',
                              }}>
                                ↺ Reset
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  </React.Fragment>
                )
              })}
            </div>
              )
            })()}

            {/* ── Pinned events — saved events dated on this trip day. Date-fixed,
                so no drag handle: the planner works around them. ── */}
            {!isCollapsed && (eventsByDay[dayIdx] || []).map(ev => {
              const d = ev.date
              const hasTime = d instanceof Date && !isNaN(d) && (d.getHours() || d.getMinutes())
              const time = hasTime ? `${(d.getHours() % 12) || 12}${d.getMinutes() ? ':' + String(d.getMinutes()).padStart(2, '0') : ''}${d.getHours() < 12 ? 'am' : 'pm'}` : 'Evening'
              return (
                <div key={'ev-' + ev.id} style={{
                  margin: '0 0 10px', borderRadius: 14, overflow: 'hidden',
                  border: '1px solid rgba(190,77,43,0.25)', background: 'var(--card)',
                  boxShadow: '0 4px 14px rgba(33,27,20,0.05)',
                }}>
                  <div style={{ background: 'rgba(190,77,43,0.10)', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12 }}>🎟</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {t('Your event')} · {time}
                    </span>
                    <button onClick={() => toggleEventSaved(ev)} aria-label="Remove event from trip" style={{
                      marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer',
                      color: 'var(--accent-text)', fontSize: 13, lineHeight: 1, padding: 2, opacity: 0.7,
                    }}>✕</button>
                  </div>
                  <div style={{ padding: '10px 14px' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25 }}>{ev.title}</div>
                    {(ev.location || ev.kindLabel) && (
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{[ev.kindLabel, ev.location].filter(Boolean).join(' · ')}</div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Inline "Add a place" — Wanderlog-style. Appears at the bottom of each
                expanded day so users can search-and-insert a venue without first having
                to heart it from Explore. The search modal targets THIS dayIdx. */}
            {!isCollapsed && (
              <button
                onClick={() => setAddStopToDayIdx(dayIdx)}
                style={{
                  width: '100%', margin: '6px 0 12px',
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'var(--gray-50)',
                  border: '1px dashed var(--gray-300)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13, fontWeight: 600, color: 'var(--gray-600)',
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                <span>{t('Add a place to this day')}</span>
              </button>
            )}

            {/* (Next-day divider removed — the sticky day tabs + each day's own
                header make it redundant, and it doubled up as "DAY 2 · DAY 2"
                when a day had no dominant area name.) */}
            {dayIdx < days.length - 1 && dayFilter === null && (
              <div style={{ height: 1, background: 'var(--gray-200)', margin: '4px 0 20px' }} />
            )}
          </div>
        )
      })}

      {/* Add-stop-to-day modal — opened by the "+ Add a place to this day" button under each day. */}
      {addStopToDayIdx !== null && (
        <AddStopToDayModal
          onClose={() => setAddStopToDayIdx(null)}
          onSelect={handleAddStopToDay}
          userVenues={userVenues}
          dayLabel={getDayLabel(addStopToDayIdx, tripStartDate)}
        />
      )}

      {/* Inline action bar + bookkeeping at the bottom of the scroll (no fixed/sticky to preserve screen space). */}
      <div style={{ padding: '8px 20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Primary actions — only when there's a plan */}
        {days.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Share */}
            <button onClick={handleShare} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '11px 6px', borderRadius: 10, border: '1px solid var(--gray-200)',
              background: 'var(--white)', color: 'var(--gray-700)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              <span>↗</span><span>{shareCopied ? t('Copied') : t('Share')}</span>
            </button>
            {/* Save plan */}
            <button
              onClick={() => {
                lsSet('nyc_plan_sel',   JSON.stringify(venueIds))
                const snap = {
                  savedAt: Date.now(),
                  venueIds,
                  // Snapshot the EXACT days the user arranged (incl. trip-length
                  // padding + drag reassignments) so the saved view matches 1:1
                  // instead of re-deriving a different itinerary.
                  days,
                  tripDays,
                  mealCuisines,
                  // Restaurants keyed by dayIdx (matches the live data structure now)
                  lunchRestaurants: Object.fromEntries(Object.entries(lunchRestaurants).map(([k,r]) => [k, r ? { id: r.id, name: r.name, price: r.price, neighborhood: r.neighborhood, reservationUrl: r.reservationUrl, mapsUrl: r.mapsUrl } : null])),
                  dinnerRestaurants: Object.fromEntries(Object.entries(dinnerRestaurants).map(([k,r]) => [k, r ? { id: r.id, name: r.name, price: r.price, neighborhood: r.neighborhood, reservationUrl: r.reservationUrl, mapsUrl: r.mapsUrl } : null])),
                }
                lsSet('nyc_plan_snapshot', JSON.stringify(snap))
                setSavedPlanView(true)
              }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '11px 6px', borderRadius: 10, border: '1px solid var(--gray-200)',
                background: planSaved ? '#dcfce7' : 'var(--white)',
                color: planSaved ? '#15803d' : 'var(--gray-700)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <span>{planSaved ? '✓' : '💾'}</span>
              <span>{planSaved ? t('Saved') : t('Save')}</span>
            </button>
            {/* Open route in Maps — context-aware: filtered to one day, it routes
                THAT day (the standing-on-the-sidewalk moment); All days routes
                the whole trip. */}
            {(() => {
              const routeDay = dayFilter !== null && dayFilter < days.length ? dayFilter : null
              const url = buildRouteUrl(routeDay)
              return url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" style={{
                  flex: 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '11px 6px', borderRadius: 10,
                  background: '#111', color: '#fff',
                  fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}>
                  <span>🗺️</span><span>{routeDay !== null ? t('Route day') : days.length > 1 ? t('Route trip') : t('Route')}</span>
                </a>
              ) : null
            })()}
          </div>
        )}

        {_snap && !savedPlanView && (
          <button onClick={() => setSavedPlanView(true)} style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--gray-400)', textDecoration: 'underline', padding: '4px 0',
          }}>
            View your saved plan →
          </button>
        )}
        {/* (Tip banner removed — permanent onboarding copy that repeated forever,
            and "Route trip / Route day" now explains itself.) */}
      </div>

      {/* ── Swap venue modal ── */}
      {swapModal && (() => {
        const currentPlanIds = new Set(days.flatMap(d => d.stops.map(s => s.id)))
        const candidates = getSwapCandidates(swapModal.domain, currentPlanIds)
        const currentVenue = venues[swapModal.venueId]
        const activeSwap = venueSwaps[swapModal.venueId]
        return (
          <div
            onClick={() => setSwapModal(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'flex-end',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--white)', borderRadius: '20px 20px 0 0',
                padding: '20px 20px 40px', width: '100%', maxHeight: '72vh', overflowY: 'auto',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--gray-200)', margin: '0 auto 18px' }} />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: 'var(--gray-400)', marginBottom: 4 }}>
                SWAP OUT
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>
                {currentVenue?.name}
              </div>
              {candidates.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--gray-400)', padding: '12px 0' }}>
                  No other venues in this category to swap in.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {candidates.map(id => {
                    const v = venues[id]
                    if (!v) return null
                    const isActive = activeSwap === id
                    return (
                      <button key={id} onClick={() => {
                        const next = { ...venueSwaps, [swapModal.venueId]: id }
                        setVenueSwaps(next)
                        try { lsSet('nyc_venue_swaps', JSON.stringify(next)) } catch {}
                        setSwapModal(null)
                      }} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        background: isActive ? '#f0fdf4' : 'var(--gray-50)',
                        border: '1px solid ' + (isActive ? '#86efac' : 'var(--gray-200)'),
                        borderRadius: 12, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{v.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                            {v.neighborhood}{v.admissionCost ? ' · ' + v.admissionCost : ''}
                          </div>
                        </div>
                        {isActive
                          ? <span style={{ fontSize: 14, color: '#16a34a', fontWeight: 700 }}>✓</span>
                          : <span style={{ fontSize: 18, color: 'var(--gray-300)' }}>→</span>
                        }
                      </button>
                    )
                  })}
                </div>
              )}
              {activeSwap && (
                <button onClick={() => {
                  const next = { ...venueSwaps }
                  delete next[swapModal.venueId]
                  setVenueSwaps(next)
                  try { lsSet('nyc_venue_swaps', JSON.stringify(next)) } catch {}
                  setSwapModal(null)
                }} style={{
                  marginTop: 16, width: '100%', fontSize: 13, color: 'var(--gray-400)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textDecoration: 'underline', padding: '8px 0',
                }}>
                  Restore original ({currentVenue?.name})
                </button>
              )}
            </div>
          </div>
        )
      })()}


      {/* ══ Below the schedule: only what earns its place. Undated saved events
          appear automatically when they exist (dated ones pin into their day);
          Your places + Plans are demoted to quiet rows after the saved list. ══ */}
      {savedEvts.filter(e => e && !plannedEventIds.has(e.id)).length > 0 && (
        <SavedEventsSection hiddenIds={plannedEventIds} />
      )}


      {/* ── My saved places — the archive lives on its own page now; My Trip
          keeps a single quiet entry row. Also reachable from Settings. ── */}
      <div style={{ padding: '0 20px 90px' }}>
        <button onClick={() => { savedPageOriginRef.current = 'trip'; setSavedPageOpen(true) }} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', borderTop: '1px solid var(--gray-100)',
          padding: '15px 2px', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 14, fontWeight: 600, color: 'var(--gray-600)',
        }}>
          <span>📌 {t('My saved places')}</span>
          <span style={{ color: 'var(--gray-400)', fontSize: 17 }}>›</span>
        </button>
      </div>

      {/* ── The saved-places page — full-screen on phones; constrained to the
          app column (like BottomNav / MapScreen) on wide viewports so the web
          build doesn't stretch edge to edge. ── */}
      {savedPageOpen && (
        <div style={{
          position: 'fixed', top: 0, bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 'var(--max-width, 480px)',
          zIndex: 400, background: 'var(--canvas)',
          overflowY: 'auto', WebkitOverflowScrolling: 'touch',
          boxShadow: '0 0 40px rgba(33,27,20,0.12)',
        }}>
          <div style={{
            position: 'sticky', top: 0, zIndex: 5, background: 'var(--canvas)',
            padding: 'calc(env(safe-area-inset-top, 0px) + 10px) 16px 10px',
            display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--gray-100)',
          }}>
            <button onClick={closeSavedPage} aria-label="Back" style={{
              border: 'none', background: 'var(--card)', borderRadius: 999, width: 34, height: 34,
              cursor: 'pointer', color: 'var(--ink)', fontSize: 16, lineHeight: 1, flexShrink: 0,
              boxShadow: 'inset 0 0 0 1px rgba(33,27,20,0.10)',
            }}>←</button>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 600, color: 'var(--ink)' }}>{t('My saved places')}</div>
          </div>
          <div style={{ paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))' }}>
      {/* ── Saved Places section ── */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--gray-400)', padding: '24px 0 12px',
          borderTop: Object.keys(safeItems).length > 0 ? '1px solid var(--gray-100)' : 'none',
        }}>
          {t('Saved places')} · {Object.keys(safeItems).length}
        </div>
        {Object.values(safeItems).length === 0 && (
          <div style={{ fontSize: 14, color: 'var(--gray-400)', fontStyle: 'italic' }}>
            Nothing saved yet — explore and bookmark venues, works, and figures.
          </div>
        )}
        {Object.values(safeItems).sort((a, b) => b.savedAt - a.savedAt).map(item => {
          const label = item.type === 'venue'
            ? venues[item.id]?.name
            : item.type === 'work'
            ? works[item.id]?.title
            : figures[item.id]?.name
          const domainId = item.type === 'venue'
            ? Object.values(domains).find(d => d.venues?.includes(item.id))?.id
            : item.type === 'work'
            ? topics[works[item.id]?.topicId]?.domainId
            : topics[figures[item.id]?.topicIds?.[0]]?.domainId
          const icon = { visual_art:'🎨', jazz:'🎷', classical_music:'🎼', theater:'🎭', history:'📜', architecture:'🏛️', sports:'🏆', hip_hop:'🎤' }[domainId] || '📍'
          return (
            <div
              key={`${item.type}:${item.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer',
              }}
              onClick={() => onSelectSaved?.({ type: item.type, id: item.id })}
            >
              <span style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 500, color: 'var(--gray-800)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {label || item.id}
              </span>
              {/* Plan status — the one thing this list was missing. Venues show
                  "Day N" (tap = jump to that day via the day tabs) or "+ Add to
                  plan" (tap = include it). Other types keep their type tag. */}
              {(() => {
                if (item.type !== 'venue') {
                  return (
                    <span style={{ fontSize: 11, color: 'var(--gray-400)', marginRight: 4, textTransform: 'capitalize', flexShrink: 0 }}>
                      {item.type}
                    </span>
                  )
                }
                const inPlan = planSelection.has(item.id)
                const dayIdx = inPlan ? days.findIndex(d => d.stops.some(s => s.id === item.id)) : -1
                if (inPlan && dayIdx >= 0) {
                  // Pill wears its day's hue — the same wayfinding color as the
                  // day tabs and header pill, so the archive points into the plan.
                  const hue = dayHue(dayIdx)
                  return (
                    <button
                      onClick={e => { e.stopPropagation(); savedPageOriginRef.current = 'trip'; setSavedPageOpen(false); setDayFilter(days.length > 1 ? dayIdx : null); window.scrollTo(0, 0) }}
                      style={{
                        flexShrink: 0, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        background: hue + '1A', color: hue,
                        fontSize: 11.5, fontWeight: 700, padding: '5px 10px', borderRadius: 999,
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                      }}
                      title="Show this day"
                    >Day {dayIdx + 1} <span style={{ opacity: 0.7 }}>›</span></button>
                  )
                }
                return (
                  <button
                    onClick={e => { e.stopPropagation(); toggleVenueInPlan(item.id) }}
                    style={{
                      flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit',
                      background: 'var(--white)', color: 'var(--gray-600)',
                      border: '1px solid var(--gray-200)',
                      fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                    }}
                  >{t('+ Add to plan')}</button>
                )
              })()}
              {toggleSave && (
                <button
                  onClick={e => { e.stopPropagation(); toggleSave(item.type, item.id) }}
                  aria-label="Remove from saved"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 16, color: 'var(--gray-300)', padding: '4px 6px', flexShrink: 0,
                  }}
                  title="Remove from saved"
                >✕</button>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Quiet inventory rows — power features, deliberately last and
          collapsed. They unfold in place; no chips, no counts. ── */}
      <div style={{ padding: '0 20px' }}>
        <button onClick={() => setInvOpen(invOpen === 'places' ? null : 'places')} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', borderTop: '1px solid var(--gray-100)',
          padding: '13px 2px', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 13, fontWeight: 600, color: 'var(--gray-500)',
        }}>
          <span>📍 {t('Your added places')}</span>
          <span style={{ transform: invOpen === 'places' ? 'rotate(180deg)' : 'none', color: 'var(--gray-400)', transition: 'transform 180ms' }}>⌄</span>
        </button>
      </div>
      {/* ══ Your Places — user-added venues. They auto-flow into the itinerary below.
          Split into manual (inline) and imported (foldable) so a 62-entry Google
          Maps import doesn't dominate the My Trip screen.
          Now always rendered (even when empty) so the "+ Add a place" entry
          point is always available — it lost its bottom-nav slot to Eat. ══ */}
      {invOpen === 'places' && (() => {
        // The seed catalog (seed_*) lives in userVenues for lookups, but it is
        // the APP's dataset, not the user's — never present it as "Your Places".
        const userList = Object.values(userVenues || {})
          .filter(v => !(typeof v?.id === 'string' && v.id.startsWith('seed_')))
          .sort((a, b) => b.savedAt - a.savedAt)
        const USER_CAT = { food:'🍴', coffee:'☕', drink:'🍷', drinks:'🍷', art:'🎨', music:'🎵', history:'📜', sports:'🏆', shopping:'🛍️', other:'📍' }

        function isImported(v) {
          if (typeof v?.id === 'string' && v.id.startsWith('seed_')) return true
          const s = v?.source || ''
          return s === 'google_takeout' || s === 'google_places_paste' || s.startsWith('google_')
        }
        const manualList = userList.filter(v => !isImported(v))
        const importedList = userList.filter(isImported)
        const importedFiltered = importQuery.trim()
          ? importedList.filter(v => (v.name || '').toLowerCase().includes(importQuery.trim().toLowerCase()))
          : importedList
        // Only mount a window of rows — rendering all ~500 imported places at once
        // froze the My Trip screen. The search box narrows; the rest stay off-DOM.
        const IMPORT_RENDER_CAP = 50
        const importedShown = importedFiltered.slice(0, IMPORT_RENDER_CAP)
        const importedHidden = importedFiltered.length - importedShown.length

        // Compact row renderer — keeps the imported accordion light. Manual
        // section uses the richer card layout below to give them more weight.
        function renderCompactRow(uv) {
          const emoji = USER_CAT[uv.category] || '📍'
          const inPlan = planSelection.has(uv.id)
          return (
            <div key={uv.id} style={{
              background: 'var(--card)', border: '1px solid var(--gray-200)',
              borderRadius: 10, padding: '8px 10px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {uv.name}
                </div>
              </div>
              <button
                onClick={() => toggleVenueInPlan(uv.id)}
                title={inPlan ? 'Remove from this trip' : 'Add to this trip'}
                style={{
                  padding: '4px 8px', borderRadius: 999,
                  background: inPlan ? 'var(--gray-900)' : 'var(--gray-100)',
                  color: inPlan ? '#fff' : 'var(--gray-500)',
                  border: 'none', cursor: 'pointer',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                {inPlan ? '✓ In plan' : '+ Plan'}
              </button>
              <button
                onClick={() => removeUserVenue(uv.id)}
                title="Remove place"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--gray-400)', padding: '2px 4px',
                  flexShrink: 0,
                }}
              >✕</button>
            </div>
          )
        }

        return (
          <div style={{ padding: '16px 20px 18px', borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-50)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-500)' }}>
                Your Places · {userList.length}
              </div>
              {/* Primary Add-a-place entry point now that bottom nav slot is
                  Eat. Sits in My Trip header because that's where adding a
                  place makes contextual sense. */}
              <button
                onClick={() => addPlaceFromHeader?.()}
                style={{
                  background: 'var(--gray-900)', color: '#fff',
                  border: 'none', borderRadius: 999,
                  padding: '5px 12px', fontFamily: 'inherit',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
              >
                <span style={{ fontSize: 13, lineHeight: 1 }}>+</span> Add a place
              </button>
            </div>
            {userList.length === 0 && (
              <div style={{
                padding: '14px 16px',
                background: 'var(--white)', border: '1px dashed var(--gray-300)',
                borderRadius: 12, textAlign: 'center',
                fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.55,
              }}>
                You haven't added any personal places yet.
                <br />Tap <strong>+ Add a place</strong> to save a favorite restaurant, bar, or spot.
              </div>
            )}

            {/* Manual picks — full cards. Typically a small list. */}
            {manualList.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {manualList.map(uv => {
                  const emoji = USER_CAT[uv.category] || '📍'
                  const inPlan = planSelection.has(uv.id)
                  return (
                    <div key={uv.id} style={{
                      background: 'var(--card)', border: '1px solid var(--gray-200)',
                      borderRadius: 12, padding: '11px 12px',
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                    }}>
                      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.25 }}>
                          {uv.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>
                          {uv.neighborhood}
                        </div>
                        {uv.blurb && (
                          <div style={{
                            fontSize: 12, color: 'var(--gray-600)', marginTop: 5, lineHeight: 1.45,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {uv.blurb}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => toggleVenueInPlan(uv.id)}
                          title={inPlan ? 'Remove from this trip' : 'Add to this trip'}
                          style={{
                            padding: '4px 9px', borderRadius: 999,
                            background: inPlan ? 'var(--gray-900)' : 'var(--gray-100)',
                            color: inPlan ? '#fff' : 'var(--gray-500)',
                            border: 'none', cursor: 'pointer',
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                          }}
                        >
                          {inPlan ? '✓ In plan' : '+ Plan'}
                        </button>
                        <button
                          onClick={() => removeUserVenue(uv.id)}
                          title="Remove place"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 12, color: 'var(--gray-400)', padding: '2px 6px',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* "Imported from Google Maps" list removed from My Trip. */}
          </div>
        )
      })()}
      <div style={{ padding: '0 20px' }}>
        <button onClick={() => setInvOpen(invOpen === 'plans' ? null : 'plans')} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', borderTop: '1px solid var(--gray-100)',
          padding: '13px 2px', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 13, fontWeight: 600, color: 'var(--gray-500)',
        }}>
          <span>💾 {t('Saved plans')}</span>
          <span style={{ transform: invOpen === 'plans' ? 'rotate(180deg)' : 'none', color: 'var(--gray-400)', transition: 'transform 180ms' }}>⌄</span>
        </button>
      </div>
      {/* ══ Saved Plans — snapshots; unfolds from its chip ══ */}
      {invOpen === 'plans' && (
      <div style={{ padding: '16px 20px 18px', borderBottom: '1px solid var(--gray-100)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: 12 }}>
          Saved Plans
        </div>

        {/* Empty state — single, count-aware block (collapsed the old stacked
            "No plans yet" + "Nothing saved yet" pair) + 3-step how-it-works row.
            Hidden once the working plan already has days — the live itinerary
            below makes the how-it-works explainer redundant. */}
        {!_snap && days.length === 0 && (() => {
          // Hearts + imported/custom places, without double-counting user_venue
          // entries that live in both savedItems and userVenues.
          // Count only what the USER chose: editorial saves, their own added
          // places, and catalog (seed) places they explicitly saved — never the
          // whole built-in dataset that also lives in userVenues.
          const _ownVenueCount = Object.keys(userVenues || {}).filter(id => !String(id).startsWith('seed_')).length
          const _savedSeedCount = Object.values(savedItems || {}).filter(s => s.type === 'user_venue' && String(s.id).startsWith('seed_')).length
          const totalSaved =
            Object.values(savedItems || {}).filter(s => s.type !== 'user_venue').length +
            _ownVenueCount + _savedSeedCount
          return (
            <div style={{ textAlign: 'center', padding: '14px 0 8px' }}>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--ink)', marginBottom: 6 }}>
                {totalSaved > 0
                  ? `You have ${totalSaved} saved place${totalSaved !== 1 ? 's' : ''} — build tonight's plan`
                  : 'Save a few places, then build tonight’s plan'}
              </div>
              {/* 3-step how-it-works row */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
                margin: '14px 0 18px',
              }}>
                {[
                  { n: 1, label: 'Add places', sub: 'Tap “+ Add to My Trip”' },
                  { n: 2, label: 'Pick your days', sub: 'Set trip length below' },
                  { n: 3, label: 'Get a plan', sub: 'We route your day' },
                ].map(step => (
                  <div key={step.n} style={{
                    background: 'var(--gray-100)', borderRadius: 16, padding: '12px 8px',
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 999, margin: '0 auto 6px',
                      background: 'var(--accent)', color: '#fff',
                      fontSize: 12, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{step.n}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{step.label}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-2)', marginTop: 2, lineHeight: 1.3 }}>{step.sub}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => schedulingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                style={{
                  background: 'var(--accent)', color: '#fff', border: 'none',
                  borderRadius: 999, padding: '13px 32px',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(224,85,44,.35)',
                }}
              >
                Build tonight&rsquo;s plan
              </button>
            </div>
          )
        })()}

        {/* Saved plan card */}
        {_snap && (
          <div style={{ position: 'relative' }}>
            {/* Confirm-delete overlay */}
            {confirmDelete && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 10,
                background: 'rgba(255,255,255,0.97)', borderRadius: 14,
                border: '1px solid var(--gray-200)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 16, padding: '20px 24px',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>Remove this plan?</div>
                <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                  <button
                    onClick={() => {
                      try { localStorage.removeItem('nyc_plan_snapshot') } catch {}
                      setConfirmDelete(false)
                    }}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: 'var(--gray-900)', color: '#fff', fontWeight: 700, fontSize: 14,
                    }}
                  >
                    Yes, remove
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                      background: 'var(--gray-100)', color: 'var(--gray-700)', fontWeight: 600, fontSize: 14,
                      border: '1px solid var(--gray-200)',
                    }}
                  >
                    No, keep it
                  </button>
                </div>
              </div>
            )}

            {/* X delete button */}
            <button
              onClick={e => { e.stopPropagation(); setConfirmDelete(true) }}
              style={{
                position: 'absolute', top: 10, right: 12, zIndex: 5,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, fontSize: 13, fontWeight: 700, color: 'var(--gray-400)', lineHeight: 1,
              }}
            >
              ✕
            </button>

            {/* Card body */}
            <div
              onClick={() => setSavedPlanView(true)}
              style={{
                background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>🗓️</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>
                    {new Date(_snap.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: 20 }}>✓ Saved</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                  {_snap.venueIds?.length} stop{_snap.venueIds?.length !== 1 ? 's' : ''}
                  {_snap.tripDays ? ` · ${_snap.tripDays} day${_snap.tripDays !== 1 ? 's' : ''}` : ''}
                  {/* Show count of meals with cuisine set (new mealCuisines shape) or fall back to old format */}
                  {(() => {
                    const mealCount = _snap.mealCuisines ? Object.keys(_snap.mealCuisines).length
                      : ((_snap.lunchCuisine ? 1 : 0) + (_snap.dinnerCuisine ? 1 : 0))
                    return mealCount > 0 ? ` · ${mealCount} meal${mealCount !== 1 ? 's' : ''} picked` : ''
                  })()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 3, lineHeight: 1.4 }}>
                  {(_snap.venueIds || []).map(id => venues[id]?.name).filter(Boolean).join(' · ')}
                </div>
              </div>
              <span style={{ fontSize: 20, color: 'var(--gray-300)', flexShrink: 0 }}>›</span>
            </div>
          </div>
        )}
      </div>
      )}
          </div>
        </div>
      )}
    </div>
  )
}

function SavedScreen({ savedItems, onSelect, toggleSave, onPlan, venueNotes = {}, setVenueNote = () => {} }) {
  const saved = Object.values(savedItems).sort((a, b) => b.savedAt - a.savedAt)

  if (saved.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100dvh - 120px)', padding: '40px 28px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🔖</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 10 }}>Nothing saved yet</div>
        <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.7, maxWidth: 290 }}>
          Bookmark things you want to come back to — venues to visit, works to see, primers to re-read.
        </div>
      </div>
    )
  }

  const savedVenues  = saved.filter(s => s.type === 'venue')
  const savedWorks   = saved.filter(s => s.type === 'work')
  const savedFigures = saved.filter(s => s.type === 'figure')

  // ── Plan selection (mirrors PlanScreen's nyc_plan_sel) ────────────────
  const [planSelArr, setPlanSelArr] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_plan_sel') || 'null') } catch { return null }
  })
  const planSelSet = planSelArr ? new Set(planSelArr) : null  // null = all venues in plan

  function isInPlan(venueId) {
    return planSelSet === null || planSelSet.has(venueId)
  }
  function togglePlanSel(venueId) {
    const allIds = savedVenues.map(s => s.id)
    const current = planSelSet || new Set(allIds)
    const next = new Set(current)
    if (next.has(venueId)) next.delete(venueId); else next.add(venueId)
    const arr = [...next]
    setPlanSelArr(arr)
    try { lsSet('nyc_plan_sel', JSON.stringify(arr)) } catch {}
  }

  const DOMAIN_META = {
    visual_art:      { label: 'Visual Art',   icon: '🎨' },
    jazz:            { label: 'Jazz',          icon: '🎷' },
    classical_music: { label: 'Classical',     icon: '🎼' },
    theater:         { label: 'Theater',       icon: '🎭' },
    sports:          { label: 'Sports',        icon: '🏆' },
    architecture:    { label: 'Architecture',  icon: '🏛️' },
    history:         { label: 'History',       icon: '📜' },
    hip_hop:         { label: 'Hip-Hop',       icon: '🎤' },
  }
  // Group saved venues by domain
  const venuesByDomain = {}
  savedVenues.forEach(item => {
    const domainId = venueCoords[item.id]?.domain || 'visual_art'
    if (!venuesByDomain[domainId]) venuesByDomain[domainId] = []
    venuesByDomain[domainId].push(item)
  })
  const domainOrder = Object.keys(DOMAIN_META).filter(d => venuesByDomain[d])

  const SectionHeader = ({ label, count }) => (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
      color: 'var(--gray-400)', padding: '20px 0 10px',
    }}>{label} · {count}</div>
  )

  return (
    <div className="screen">
      <div className="home-header">
        <div className="home-wordmark">Saved</div>
        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
          {saved.length} item{saved.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Plan My Visit CTA ── */}
      {(() => {
        const planVenueIds = new Set([
          ...saved.filter(s => s.type === 'venue').map(s => s.id),
          ...saved.filter(s => s.type === 'work').map(s => works[s.id]?.venueId).filter(Boolean),
        ])
        return planVenueIds.size >= 3 ? (
          <div style={{ padding: '16px 20px 4px' }}>
            <button
              onClick={onPlan}
              style={{
                width: '100%', background: 'var(--gray-900)', color: '#fff',
                border: 'none', borderRadius: 14, padding: '16px 20px',
                cursor: 'pointer', textAlign: 'left', display: 'flex',
                alignItems: 'center', gap: 14,
              }}
            >
              <span style={{ fontSize: 28 }}>🗓️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3 }}>Plan My Visit</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.45 }}>
                  Turn your {planVenueIds.size} saved stops into a day-by-day itinerary
                </div>
              </div>
              <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>›</span>
            </button>
          </div>
        ) : null
      })()}

      <div style={{ padding: '0 20px 40px' }}>
        {savedVenues.length > 0 && (
          <>
            {/* ── Domain-grouped venue sections ── */}
            {domainOrder.map(domainId => {
              const meta = DOMAIN_META[domainId]
              const items = venuesByDomain[domainId]
              return (
                <div key={domainId}>
                  {/* Domain header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '18px 0 10px',
                    borderTop: domainId === domainOrder[0] ? 'none' : '1px solid var(--gray-100)',
                  }}>
                    <span style={{ fontSize: 16 }}>{meta.icon}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                      textTransform: 'uppercase', color: 'var(--gray-400)',
                    }}>{meta.label} · {items.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {items.map(item => {
                      const v = venues[item.id]
                      if (!v) return null
                      const note = venueNotes[item.id] || ''
                      const inPlan = isInPlan(item.id)
                      return (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                          {/* Main card row */}
                          <div style={{
                            background: 'var(--white)',
                            border: '1px solid var(--gray-200)',
                            borderRadius: note ? '14px 14px 0 0' : 14,
                            borderBottom: note ? 'none' : undefined,
                            overflow: 'hidden',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                              {/* Tap to view detail */}
                              <button onClick={() => onSelect({ type: 'venue', id: item.id })} style={{
                                flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                                textAlign: 'left', padding: '13px 14px',
                              }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>{v.name}</div>
                                <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                                  {v.neighborhood}{v.admissionCost ? ' · ' + v.admissionCost : ''}
                                </div>
                              </button>

                              {/* In-Plan toggle */}
                              <button
                                onClick={e => { e.stopPropagation(); togglePlanSel(item.id) }}
                                style={{
                                  flexShrink: 0, padding: '8px 10px',
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                                }}
                                title={inPlan ? 'Remove from plan' : 'Add to plan'}
                              >
                                <div style={{
                                  width: 28, height: 28, borderRadius: 8,
                                  background: inPlan ? 'var(--gray-900)' : 'var(--gray-100)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 13,
                                }}>
                                  {inPlan ? <span style={{ color: '#fff', fontWeight: 700 }}>✓</span>
                                          : <span style={{ color: 'var(--gray-400)', fontWeight: 700 }}>+</span>}
                                </div>
                                <span style={{ fontSize: 9, color: inPlan ? 'var(--gray-600)' : 'var(--gray-400)', fontWeight: 600 }}>
                                  {inPlan ? 'In plan' : 'Add'}
                                </span>
                              </button>

                              {/* View detail chevron */}
                              <button onClick={() => onSelect({ type: 'venue', id: item.id })} style={{
                                flexShrink: 0, padding: '13px 12px 13px 4px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--gray-300)', fontSize: 20,
                              }}>›</button>
                            </div>
                          </div>

                          {/* Note textarea */}
                          <div style={{
                            border: '1px solid var(--gray-200)', borderTop: 'none',
                            borderRadius: '0 0 14px 14px', overflow: 'hidden',
                          }}>
                            <textarea
                              value={note}
                              onChange={e => setVenueNote(item.id, e.target.value)}
                              placeholder={t('Add a note…')}
                              rows={note ? undefined : 1}
                              style={{
                                width: '100%', border: 'none', outline: 'none', resize: 'none',
                                padding: '9px 14px', fontSize: 12, color: 'var(--gray-700)',
                                background: 'var(--gray-50)', fontFamily: 'inherit', lineHeight: 1.5,
                                boxSizing: 'border-box', minHeight: 36,
                                display: note ? 'block' : 'none',
                              }}
                              onClick={e => e.stopPropagation()}
                            />
                            {!note && (
                              <button
                                onClick={() => setVenueNote(item.id, ' ')}
                                style={{
                                  width: '100%', padding: '7px 14px', background: 'var(--gray-50)',
                                  border: 'none', cursor: 'pointer', textAlign: 'left',
                                  fontSize: 11, color: 'var(--gray-400)',
                                }}
                              >
                                + note
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {savedWorks.length > 0 && (
          <>
            <SectionHeader label="Works" count={savedWorks.length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {savedWorks.map(item => {
                const w = works[item.id]
                if (!w) return null
                const fig = figures[w.figureId]
                return (
                  <button key={item.id} onClick={() => onSelect({ type: 'work', id: item.id })} style={{
                    width: '100%', background: 'var(--card)', border: '1px solid var(--gray-200)',
                    borderRadius: 14, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <ImgWithFallback src={w.imageUrl} alt={w.title} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{fig?.name}{w.year ? ` · ${w.year}` : ''}</div>
                    </div>
                    <div style={{ color: 'var(--gray-300)', fontSize: 20, flexShrink: 0 }}>&#8250;</div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {savedFigures.length > 0 && (
          <>
            <SectionHeader label="People" count={savedFigures.length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {savedFigures.map(item => {
                const fig = figures[item.id]
                if (!fig) return null
                const topic = topics[fig.topicId]
                return (
                  <button key={item.id} onClick={() => onSelect({ type: 'figure', id: item.id })} style={{
                    width: '100%', background: 'var(--card)', border: '1px solid var(--gray-200)',
                    borderRadius: 14, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <ImgWithFallback src={fig.imageUrl} alt={fig.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>{fig.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{topic?.name || ''}</div>
                    </div>
                    <div style={{ color: 'var(--gray-300)', fontSize: 20, flexShrink: 0 }}>&#8250;</div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Add Place Modal — user-added venues (separate from curated NYC Stoop picks) ──
// ── Add-Stop-to-Day Modal ──────────────────────────────────────────────────
// Wanderlog-style inline "+ Add a place". Triggered from the bottom of each day
// in My Trip. Searches across curated venues + user-added places and inserts
// the picked item into the specified day via the parent's onSelect handler.
// ── Google Takeout Import Modal ─────────────────────────────────────────────
// One-time bulk import for places the user already saved in Google Maps. They
// export via takeout.google.com → drop the resulting CSV / GeoJSON file here
// → we parse it and bulk-create user_venues. No Google API calls happen here;
// everything is client-side off the user's downloaded file.
function ImportTakeoutModal({ onClose, onImport }) {
  // Two import modes share one downstream pipeline (`parsed` → onImport).
  //   • 'file'  — original Google Takeout CSV/GeoJSON path (only works for the
  //               user's own lists, never for lists they follow/save from others)
  //   • 'paste' — paste a newline-separated list of names (one per line) and
  //               resolve each through Google Places to attach lat/lng/address.
  //               This is the escape hatch for shared/followed lists that don't
  //               exist in Takeout.
  const [mode, setMode] = React.useState('file')

  // File mode state
  const [file, setFile] = React.useState(null)
  const [parseError, setParseError] = React.useState('')

  // Paste mode state
  const [pastedText, setPastedText] = React.useState('')
  // resolutions: [{ name, status: 'pending'|'resolved'|'notfound'|'error', match: {...}|null, error: '' }]
  // Kept separate from `parsed` so the user can see per-row outcomes (especially
  // failures) before committing. We rebuild `parsed` from resolutions whenever
  // they finish.
  const [resolutions, setResolutions] = React.useState([])
  const [resolving, setResolving] = React.useState(false)
  const [resolveProgress, setResolveProgress] = React.useState({ done: 0, total: 0 })

  // Shared output — what we hand to the parent on Import. Populated by either
  // file parsing OR paste resolution.
  const [parsed, setParsed] = React.useState([])

  const [busy, setBusy] = React.useState(false)
  // Default category for the bulk import — users tend to import a whole list
  // of one kind (all bars, all restaurants), so a single batch picker is enough.
  const [category, setCategory] = React.useState('drinks')
  // Single neighborhood label applied to every imported place when we don't have
  // structured neighborhood data. User can edit individual ones later.
  const [neighborhoodLabel, setNeighborhoodLabel] = React.useState('Imported from Google Maps')

  const googleEnabled = isGooglePlacesAvailable()

  async function handleFile(f) {
    if (!f) return
    setFile(f)
    setParseError('')
    try {
      const items = await parseTakeoutFile(f)
      if (items.length === 0) {
        setParseError("Couldn't find any places in that file. Make sure you exported a single Google Maps list as CSV or GeoJSON.")
      }
      setParsed(items)
    } catch (e) {
      setParseError(e.message || 'Failed to read that file.')
      setParsed([])
    }
  }

  // Parse the pasted textarea into clean lines. Strips blanks, bullet markers,
  // and leading numbers ("1. ", "1) ") so users can paste lightly formatted
  // lists without hand-cleaning.
  function extractNamesFromPaste(text) {
    return (text || '')
      .split(/\r?\n/)
      .map(line => line.trim())
      .map(line => line.replace(/^[-*•●▪‣◦]\s+/, '')) // bullet markers
      .map(line => line.replace(/^\d+[.)]\s+/, ''))    // "1. " or "1) "
      .filter(Boolean)
  }

  // Resolve each pasted name through Google Places: autocomplete → take top
  // suggestion → details for coords + address. Sequential with a small delay
  // to be polite to the Places API and keep the progress UI legible.
  async function resolvePastedNames() {
    const names = extractNamesFromPaste(pastedText)
    if (names.length === 0) return
    // Deduplicate (case-insensitive, trimmed) — pasted lists often have repeats.
    const seen = new Set()
    const unique = names.filter(n => {
      const k = n.toLowerCase()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })

    setResolving(true)
    setResolveProgress({ done: 0, total: unique.length })
    // Seed the resolutions list as "pending" so the user sees rows fill in as we go.
    const initial = unique.map(name => ({ name, status: 'pending', match: null, error: '' }))
    setResolutions(initial)

    const finalRows = [...initial]
    for (let i = 0; i < unique.length; i++) {
      const name = unique[i]
      try {
        const suggestions = await searchGooglePlaces(name)
        if (!suggestions || suggestions.length === 0) {
          finalRows[i] = { name, status: 'notfound', match: null, error: 'No match on Google' }
        } else {
          const top = suggestions[0]
          const details = await getGooglePlaceDetails(top.placeId)
          finalRows[i] = {
            name,
            status: 'resolved',
            match: {
              name: details.name || top.name || name,
              address: details.address || top.sub || '',
              lat: details.lat,
              lng: details.lng,
              googlePlaceId: top.placeId,
              note: '',
            },
            error: '',
          }
        }
      } catch (e) {
        finalRows[i] = { name, status: 'error', match: null, error: e?.message || 'Lookup failed' }
      }
      // Update the visible list incrementally so the user sees progress.
      setResolutions([...finalRows])
      setResolveProgress({ done: i + 1, total: unique.length })
      // Tiny pause between calls — not strictly required but easier on quota
      // and gives the UI a chance to repaint smoothly.
      await new Promise(r => setTimeout(r, 80))
    }

    // Push resolved rows into the shared `parsed` pipeline so the Import button works.
    setParsed(finalRows.filter(r => r.status === 'resolved').map(r => r.match))
    setResolving(false)
  }

  function removeResolution(idx) {
    const next = resolutions.filter((_, i) => i !== idx)
    setResolutions(next)
    setParsed(next.filter(r => r.status === 'resolved').map(r => r.match))
  }

  async function handleConfirm() {
    if (parsed.length === 0) return
    setBusy(true)
    try {
      // Pass everything up to the parent in one shot; it handles addUserVenue per item.
      onImport?.(parsed.map(p => ({
        name: p.name,
        blurb: p.note || '',
        category,
        neighborhood: neighborhoodLabel || 'NYC',
        address: p.address || '',
        hours: '',
        image: '',
        lat: p.lat,
        lng: p.lng,
        source: mode === 'paste' ? 'google_places_paste' : 'google_takeout',
        googlePlaceId: p.googlePlaceId || '',
      })))
      onClose?.()
    } finally {
      setBusy(false)
    }
  }

  // When user switches mode, clear the shared `parsed` so the previous mode's
  // data doesn't accidentally get imported under the new context.
  function switchMode(next) {
    if (next === mode) return
    setMode(next)
    setParsed([])
    setParseError('')
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 930,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--white)', borderRadius: '20px 20px 0 0',
          width: '100%', maxWidth: 460,
          height: '82dvh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        {/* Drag handle */}
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--gray-300)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2 }}>
              Import from Google Maps
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
              {mode === 'file'
                ? 'Bulk-add from a Takeout export'
                : 'Paste any list — we look each one up on Google'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'var(--gray-100)', border: 'none', borderRadius: 999,
            width: 32, height: 32, cursor: 'pointer',
            fontSize: 16, color: 'var(--gray-500)', lineHeight: 1, flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Mode tabs — file (Takeout) vs paste (any list, via Google Places lookup) */}
        <div style={{
          padding: '0 20px 12px', flexShrink: 0,
          display: 'flex', gap: 6,
        }}>
          {[
            { id: 'file', label: 'From file', sub: 'Takeout export' },
            { id: 'paste', label: 'Paste names', sub: 'Any list' },
          ].map(t => {
            const active = mode === t.id
            return (
              <button key={t.id} onClick={() => switchMode(t.id)} style={{
                flex: 1, padding: '8px 10px',
                background: active ? 'var(--gray-900)' : 'var(--gray-100)',
                color: active ? '#fff' : 'var(--gray-600)',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'center',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{t.label}</div>
                <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>{t.sub}</div>
              </button>
            )
          })}
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 20px 8px' }}>
          {/* ── FILE MODE ─────────────────────────────────────────────── */}
          {mode === 'file' && (
            <>
              {/* Instructions — only shown when no file picked yet */}
              {!file && (
                <div style={{
                  background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                  borderRadius: 12, padding: '14px 16px', marginBottom: 14,
                  fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6,
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: 6 }}>How to export</div>
                  <ol style={{ paddingLeft: 18, margin: '0 0 4px' }}>
                    <li>Go to <a href="https://takeout.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray-900)' }}>takeout.google.com</a></li>
                    <li>Click <strong>Deselect all</strong>, then check <strong>Maps (your places)</strong> + <strong>Saved</strong></li>
                    <li>Click <strong>Next step</strong> → <strong>Create export</strong>. Google emails you a download link in a few minutes.</li>
                    <li>Unzip the file Google sent. Inside you'll see a <strong>Saved</strong> folder with one <code>.csv</code> per list (Want to go, Favorites, your custom lists).</li>
                    <li>Drop the CSV for the list you want — bars, restaurants, whatever — into the box below.</li>
                  </ol>
                  <div style={{
                    marginTop: 10, padding: '8px 10px',
                    background: '#fffbeb', border: '1px solid #fde68a',
                    borderRadius: 8, fontSize: 11, color: '#92400e', lineHeight: 1.5,
                  }}>
                    Heads up: Takeout only exports <strong>your own</strong> lists. Lists you saved or follow from other people don't show up — for those, use <strong>Paste names</strong>.
                  </div>
                </div>
              )}

              {/* File picker */}
              <label style={{
                display: 'block', width: '100%',
                border: '2px dashed var(--gray-300)', borderRadius: 14,
                padding: file ? '14px 16px' : '28px 16px',
                background: 'var(--gray-50)', cursor: 'pointer',
                textAlign: 'center',
              }}>
                <input
                  type="file"
                  accept=".csv,.geojson,.json"
                  onChange={e => handleFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: file ? 13 : 28, marginBottom: file ? 4 : 8 }}>{file ? '📄' : '⬆️'}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>
                  {file ? file.name : 'Choose a CSV or GeoJSON file'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 4 }}>
                  {file ? 'Tap to pick a different file' : 'From your unzipped Google Takeout export'}
                </div>
              </label>

              {/* Parse error */}
              {parseError && (
                <div style={{
                  marginTop: 10, padding: '10px 12px',
                  background: '#fef2f2', color: '#991b1b',
                  fontSize: 12, lineHeight: 1.5, borderRadius: 10,
                }}>{parseError}</div>
              )}
            </>
          )}

          {/* ── PASTE MODE ────────────────────────────────────────────── */}
          {mode === 'paste' && (
            <>
              {/* Instructions */}
              {resolutions.length === 0 && (
                <div style={{
                  background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                  borderRadius: 12, padding: '14px 16px', marginBottom: 14,
                  fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6,
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: 6 }}>How it works</div>
                  <ol style={{ paddingLeft: 18, margin: '0 0 4px' }}>
                    <li>Open any Google Maps list (yours, followed, or a shared link).</li>
                    <li>Type or paste the place names below — <strong>one per line</strong>.</li>
                    <li>We'll look up each name on Google Places to grab the real address + coordinates.</li>
                    <li>Review the matches, then import.</li>
                  </ol>
                  <div style={{
                    marginTop: 10, padding: '8px 10px',
                    background: '#eff6ff', border: '1px solid #bfdbfe',
                    borderRadius: 8, fontSize: 11, color: '#1e40af', lineHeight: 1.5,
                  }}>
                    Tip: bullet points (•, -) and numbered prefixes (1.) get stripped automatically, so you can paste lightly formatted lists.
                  </div>
                </div>
              )}

              {/* API availability check */}
              {!googleEnabled && (
                <div style={{
                  marginBottom: 12, padding: '10px 12px',
                  background: '#fef2f2', color: '#991b1b',
                  fontSize: 12, lineHeight: 1.5, borderRadius: 10,
                }}>
                  Google Places isn't configured (missing <code>VITE_GOOGLE_MAPS_API_KEY</code>). Set it in <code>.env.local</code> to enable paste-import.
                </div>
              )}

              {/* Textarea + resolve button */}
              {resolutions.length === 0 && (
                <>
                  <textarea
                    value={pastedText}
                    onChange={e => setPastedText(e.target.value)}
                    placeholder={'L&B Spumoni Gardens\nKopitiam\nLilia\nDi Fara Pizza\nPeter Luger Steak House'}
                    rows={10}
                    style={{
                      width: '100%', padding: '12px 14px', fontSize: 14,
                      background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                      borderRadius: 12, outline: 'none', fontFamily: 'inherit',
                      resize: 'vertical', minHeight: 160,
                      boxSizing: 'border-box', lineHeight: 1.5,
                    }}
                  />
                  <div style={{
                    fontSize: 11, color: 'var(--gray-400)', marginTop: 6, lineHeight: 1.5,
                    display: 'flex', justifyContent: 'space-between', gap: 8,
                  }}>
                    <span>{extractNamesFromPaste(pastedText).length} name{extractNamesFromPaste(pastedText).length !== 1 ? 's' : ''} detected</span>
                    <span style={{ color: 'var(--gray-500)' }}>Powered by Google</span>
                  </div>
                  <button
                    onClick={resolvePastedNames}
                    disabled={!googleEnabled || extractNamesFromPaste(pastedText).length === 0 || resolving}
                    style={{
                      marginTop: 12, width: '100%', padding: '12px 14px',
                      background: (!googleEnabled || extractNamesFromPaste(pastedText).length === 0) ? 'var(--gray-300)' : 'var(--gray-900)',
                      color: '#fff', border: 'none', borderRadius: 12,
                      cursor: (!googleEnabled || extractNamesFromPaste(pastedText).length === 0) ? 'not-allowed' : 'pointer',
                      fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                    }}
                  >
                    Look up {extractNamesFromPaste(pastedText).length || ''} place{extractNamesFromPaste(pastedText).length !== 1 ? 's' : ''} on Google
                  </button>
                </>
              )}

              {/* Resolution progress + per-row status */}
              {resolutions.length > 0 && (
                <>
                  {/* Progress bar */}
                  <div style={{
                    marginBottom: 12, padding: '10px 14px',
                    background: resolving ? '#eff6ff' : '#f0fdf4',
                    border: `1px solid ${resolving ? '#bfdbfe' : '#bbf7d0'}`,
                    borderRadius: 12,
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 12, fontWeight: 700,
                      color: resolving ? '#1e40af' : '#166534',
                    }}>
                      <span>{resolving ? 'Looking up…' : 'Done'}</span>
                      <span>{resolveProgress.done} / {resolveProgress.total}</span>
                    </div>
                    {resolveProgress.total > 0 && (
                      <div style={{
                        marginTop: 6, height: 4, borderRadius: 2,
                        background: 'rgba(255,255,255,0.6)', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${(resolveProgress.done / resolveProgress.total) * 100}%`,
                          background: resolving ? '#3b82f6' : '#22c55e',
                          transition: 'width 0.2s',
                        }} />
                      </div>
                    )}
                    {!resolving && (
                      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--gray-600)', lineHeight: 1.4 }}>
                        {resolutions.filter(r => r.status === 'resolved').length} resolved
                        {resolutions.filter(r => r.status === 'notfound').length > 0 && ` · ${resolutions.filter(r => r.status === 'notfound').length} not found`}
                        {resolutions.filter(r => r.status === 'error').length > 0 && ` · ${resolutions.filter(r => r.status === 'error').length} error`}
                      </div>
                    )}
                  </div>

                  {/* Per-row results — let user remove bad matches before importing */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    {resolutions.map((r, i) => {
                      const badge = r.status === 'resolved' ? { bg: '#dcfce7', fg: '#166534', label: '✓' }
                        : r.status === 'pending' ? { bg: '#e0e7ff', fg: '#3730a3', label: '…' }
                        : r.status === 'notfound' ? { bg: '#fef3c7', fg: '#92400e', label: '?' }
                        : { bg: '#fee2e2', fg: '#991b1b', label: '!' }
                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '8px 12px',
                          background: 'var(--white)',
                          border: '1px solid var(--gray-200)', borderRadius: 10,
                        }}>
                          <div style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: badge.bg, color: badge.fg,
                            fontSize: 12, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>{badge.label}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 13, fontWeight: 700, color: 'var(--gray-900)',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {r.match?.name || r.name}
                            </div>
                            {r.status === 'resolved' && r.match?.address && (
                              <div style={{
                                fontSize: 11, color: 'var(--gray-500)', marginTop: 2,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              }}>{r.match.address}</div>
                            )}
                            {r.status === 'notfound' && (
                              <div style={{ fontSize: 11, color: '#92400e', marginTop: 2 }}>No Google match — will skip</div>
                            )}
                            {r.status === 'error' && (
                              <div style={{ fontSize: 11, color: '#991b1b', marginTop: 2 }}>{r.error}</div>
                            )}
                            {r.status === 'pending' && (
                              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>Waiting…</div>
                            )}
                          </div>
                          {!resolving && (
                            <button
                              onClick={() => removeResolution(i)}
                              aria-label="Remove"
                              style={{
                                background: 'transparent', border: 'none',
                                color: 'var(--gray-400)', cursor: 'pointer',
                                fontSize: 16, padding: 4, flexShrink: 0,
                              }}
                            >✕</button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Start-over button so user can edit the list and re-run */}
                  {!resolving && (
                    <button
                      onClick={() => { setResolutions([]); setParsed([]); setResolveProgress({ done: 0, total: 0 }) }}
                      style={{
                        width: '100%', padding: '10px 12px',
                        background: 'var(--gray-100)', color: 'var(--gray-700)',
                        border: 'none', borderRadius: 10, cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                      }}
                    >Edit the list and re-run</button>
                  )}
                </>
              )}
            </>
          )}

          {/* Parsed preview + batch settings — shared by both modes */}
          {parsed.length > 0 && (
            <>
              {/* "Found X" banner — only useful in file mode; paste mode already
                  shows a richer progress + per-row status above this block. */}
              {mode === 'file' && (
                <div style={{
                  marginTop: 16, padding: '12px 14px',
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  borderRadius: 12,
                  fontSize: 13, color: '#166534', fontWeight: 600,
                }}>
                  ✓ Found {parsed.length} place{parsed.length !== 1 ? 's' : ''} in that file.
                </div>
              )}

              {/* Category picker — applies to the whole batch */}
              <div style={{ marginTop: 16 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 6,
                }}>Category</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
                  {USER_PLACE_CATEGORIES.map(c => {
                    const active = category === c.id
                    return (
                      <button key={c.id} onClick={() => setCategory(c.id)} style={{
                        padding: '7px 4px', borderRadius: 999, border: 'none', cursor: 'pointer',
                        fontSize: 11, fontWeight: active ? 700 : 500,
                        background: active ? 'var(--gray-900)' : 'var(--gray-100)',
                        color: active ? '#fff' : 'var(--gray-600)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                      }}>
                        <span style={{ fontSize: 12 }}>{c.emoji}</span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Optional neighborhood label */}
              <div style={{ marginTop: 14 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 6,
                }}>Neighborhood label (for grouping)</div>
                <input
                  type="text"
                  value={neighborhoodLabel}
                  onChange={e => setNeighborhoodLabel(e.target.value)}
                  placeholder="e.g. Bars I want to try"
                  style={{
                    width: '100%', padding: '10px 12px', fontSize: 14,
                    background: 'var(--gray-100)', border: '1px solid var(--gray-200)',
                    borderRadius: 10, outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4, lineHeight: 1.5 }}>
                  Applied to every imported place. You can edit individual ones afterward.
                </div>
              </div>

              {/* Preview list — only shown in file mode. In paste mode, the
                  per-row resolution list above this block already shows what
                  was matched; duplicating it here would just be noise. */}
              {mode === 'file' && (
                <div style={{ marginTop: 18 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 8,
                  }}>
                    Preview {parsed.length > 8 ? `(first 8 of ${parsed.length})` : ''}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {parsed.slice(0, 8).map((p, i) => (
                      <div key={i} style={{
                        padding: '8px 12px', background: 'var(--white)',
                        border: '1px solid var(--gray-200)', borderRadius: 10,
                        fontSize: 13, color: 'var(--gray-800)',
                      }}>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        {(p.lat != null && p.lng != null) ? (
                          <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>
                            📍 {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                            (no coordinates in source — name only)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          flexShrink: 0,
          padding: '12px 20px 14px',
          borderTop: '1px solid var(--gray-100)',
          display: 'flex', gap: 8,
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px 14px',
            background: 'var(--gray-100)', color: 'var(--gray-700)',
            border: 'none', borderRadius: 12, cursor: 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
          }}>Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={parsed.length === 0 || busy}
            style={{
              flex: 2, padding: '12px 14px',
              background: parsed.length === 0 ? 'var(--gray-300)' : 'var(--gray-900)',
              color: '#fff', border: 'none', borderRadius: 12,
              cursor: parsed.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? 'Importing…' : parsed.length > 0 ? `Import ${parsed.length} place${parsed.length !== 1 ? 's' : ''}` : 'Import'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AddStopToDayModal({ onClose, onSelect, userVenues = {}, dayLabel = '' }) {
  const [query, setQuery] = React.useState('')
  // Google Places state. googleResults is the autocomplete list shown beneath
  // local matches; googleLoading drives a small spinner; googleError shows
  // a quiet hint when the API isn't reachable. selectingGoogleId disables a
  // result while we fetch its Place Details (1–2 round trips).
  const [googleResults, setGoogleResults] = React.useState([])
  const [googleLoading, setGoogleLoading] = React.useState(false)
  const [googleError, setGoogleError] = React.useState(null)
  const [selectingGoogleId, setSelectingGoogleId] = React.useState(null)
  const googleEnabled = isGooglePlacesAvailable()

  // Filter venues + user venues by name. Prefix matches sort to the top so the
  // most likely target ("the m...") is the first result.
  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const out = []
    Object.values(venues).forEach(v => {
      if ((v.name || '').toLowerCase().includes(q))
        out.push({ type: 'venue', id: v.id, name: v.name, sub: v.neighborhood || '' })
    })
    Object.values(userVenues).forEach(uv => {
      if ((uv.name || '').toLowerCase().includes(q))
        out.push({ type: 'user_venue', id: uv.id, name: uv.name, sub: `Your place · ${uv.neighborhood || ''}` })
    })
    out.sort((a, b) => {
      const ap = a.name.toLowerCase().startsWith(q) ? 0 : 1
      const bp = b.name.toLowerCase().startsWith(q) ? 0 : 1
      return ap - bp
    })
    return out.slice(0, 20)
  }, [query, userVenues])

  // Debounced Google Places autocomplete. Skipped entirely if the API key
  // isn't configured (googleEnabled === false) so dev without the key still
  // works against the local catalog.
  React.useEffect(() => {
    if (!googleEnabled) return
    const q = query.trim()
    if (q.length < 2) { setGoogleResults([]); setGoogleError(null); return }
    let cancelled = false
    setGoogleLoading(true)
    setGoogleError(null)
    const timer = setTimeout(() => {
      searchGooglePlaces(q)
        .then(items => {
          if (cancelled) return
          if (items === null) { // the search itself failed (key/network), not "no matches"
            setGoogleResults([])
            setGoogleError('Place search couldn’t load — check your connection, or try again shortly.')
          } else {
            setGoogleResults(items)
          }
        })
        .catch(err => { if (!cancelled) { setGoogleResults([]); setGoogleError(err.message || 'Search failed') } })
        .finally(() => { if (!cancelled) setGoogleLoading(false) })
    }, 250)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [query, googleEnabled])

  async function handleGoogleSelect(item) {
    setSelectingGoogleId(item.placeId)
    try {
      const details = await getGooglePlaceDetails(item.placeId)
      onSelect?.({
        type: 'google_place',
        placeId: item.placeId,
        name: details.name || item.name,
        address: details.address || '',
        neighborhood: details.neighborhood || '',
        lat: details.lat,
        lng: details.lng,
        blurb: '',
      })
    } catch (e) {
      // Fall back to the autocomplete name + address if details fetch fails —
      // the user still gets the place added with the basics.
      onSelect?.({
        type: 'google_place',
        placeId: item.placeId,
        name: item.name,
        address: item.sub || '',
        neighborhood: '',
        lat: null, lng: null,
      })
    } finally {
      setSelectingGoogleId(null)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 920,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--white)', borderRadius: '20px 20px 0 0',
          width: '100%', maxWidth: 460,
          // Fixed sheet height — prevents the modal from jumping in size as
          // result counts swing between 0, 3, and 25. The internal results
          // section scrolls within this fixed frame.
          height: '78dvh',
          boxSizing: 'border-box',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',  // results section handles its own scroll
        }}
      >
        {/* Drag handle */}
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--gray-300)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 12px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2 }}>
              Add a place
            </div>
            {dayLabel && (
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                To {dayLabel}
              </div>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'var(--gray-100)', border: 'none', borderRadius: 999,
            width: 32, height: 32, cursor: 'pointer',
            fontSize: 16, color: 'var(--gray-500)', lineHeight: 1, flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Search input */}
        <div style={{ padding: '4px 20px 12px', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--gray-100)', borderRadius: 12, padding: '11px 14px',
          }}>
            <span style={{ fontSize: 16, color: 'var(--gray-400)', flexShrink: 0 }}>🔍</span>
            <input
              autoFocus
              type="search"
              placeholder="Search venues by name…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: 15, color: 'var(--gray-900)', fontFamily: 'inherit',
                minWidth: 0,
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--gray-400)', fontSize: 16, padding: 0, lineHeight: 1,
              }}>✕</button>
            )}
          </div>
        </div>

        {/* Results — flex:1 + overflowY:auto so it scrolls inside the fixed sheet height.
            min-height:0 is required for flex children to actually scroll instead of overflowing. */}
        <div style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          padding: '0 20px 6px',
          display: 'flex', flexDirection: 'column', gap: 6,
          WebkitOverflowScrolling: 'touch',
        }}>
          {!query.trim() ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                Type a venue name — or part of one — to find it.
                {googleEnabled && <><br/>Search includes Google Places.</>}
              </div>
            </div>
          ) : (
            <>
              {/* Local results — from our curated catalog + the user's own additions */}
              {results.length > 0 && (
                <>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: 'var(--gray-400)', padding: '4px 2px 2px',
                  }}>From NYC Stoop</div>
                  {results.map(r => {
                    const meta = r.type === 'user_venue'
                      ? { label: 'Yours', color: '#b45309' }
                      : { label: 'Venue', color: '#1a56db' }
                    return (
                      <button
                        key={r.type + ':' + r.id}
                        onClick={() => onSelect?.(r)}
                        style={{
                          width: '100%', background: 'var(--white)',
                          border: '1px solid var(--gray-200)', borderRadius: 12,
                          padding: '11px 14px', cursor: 'pointer', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: 10,
                          fontFamily: 'inherit',
                        }}
                      >
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                          color: meta.color, background: meta.color + '18',
                          padding: '2px 7px', borderRadius: 20, flexShrink: 0,
                        }}>{meta.label}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontWeight: 600, fontSize: 14, color: 'var(--gray-900)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{r.name}</div>
                          {r.sub && (
                            <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>
                              {r.sub}
                            </div>
                          )}
                        </div>
                        <span style={{ color: 'var(--gray-300)', fontSize: 18, flexShrink: 0 }}>+</span>
                      </button>
                    )
                  })}
                </>
              )}

              {/* Google Places results — gives users access to anywhere on the map */}
              {googleEnabled && (
                <>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: 'var(--gray-400)', padding: results.length > 0 ? '12px 2px 2px' : '4px 2px 2px',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span>From Google</span>
                    {googleLoading && <span style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 400 }}>· searching…</span>}
                  </div>
                  {googleResults.length === 0 && !googleLoading && query.trim().length >= 2 && (
                    <div style={{ fontSize: 12, color: 'var(--gray-400)', padding: '8px 2px' }}>
                      {googleError ? `Google search error: ${googleError}` : 'No Google matches.'}
                    </div>
                  )}
                  {googleResults.map(r => {
                    const isBusy = selectingGoogleId === r.placeId
                    return (
                      <button
                        key={'g:' + r.placeId}
                        onClick={() => !isBusy && handleGoogleSelect(r)}
                        disabled={isBusy}
                        style={{
                          width: '100%', background: 'var(--white)',
                          border: '1px solid var(--gray-200)', borderRadius: 12,
                          padding: '11px 14px',
                          cursor: isBusy ? 'wait' : 'pointer',
                          textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: 10,
                          fontFamily: 'inherit',
                          opacity: isBusy ? 0.6 : 1,
                        }}
                      >
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                          color: '#15803d', background: '#15803d18',
                          padding: '2px 7px', borderRadius: 20, flexShrink: 0,
                        }}>Google</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontWeight: 600, fontSize: 14, color: 'var(--gray-900)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{r.name}</div>
                          {r.sub && (
                            <div style={{
                              fontSize: 11, color: 'var(--gray-500)', marginTop: 1,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>{r.sub}</div>
                          )}
                        </div>
                        <span style={{ color: 'var(--gray-300)', fontSize: 18, flexShrink: 0 }}>{isBusy ? '…' : '+'}</span>
                      </button>
                    )
                  })}
                </>
              )}

              {/* Empty state — only when both sources came back empty */}
              {results.length === 0 && googleResults.length === 0 && !googleLoading && (
                <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--gray-400)' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>🔍</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 4 }}>
                    No matches for &ldquo;{query}&rdquo;
                  </div>
                  <div style={{ fontSize: 11 }}>Try a shorter or different name.</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Google attribution — required by the Maps Platform TOS whenever
            Google Places data is displayed. Pinned to the bottom of the fixed
            sheet via flexShrink: 0 so it's always visible. */}
        {googleEnabled && (
          <div style={{
            flexShrink: 0,
            padding: '8px 20px 14px',
            borderTop: '1px solid var(--gray-100)',
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6,
            fontSize: 10, color: 'var(--gray-400)',
            background: 'var(--white)',
          }}>
            <span>Powered by</span>
            <span style={{
              fontFamily: 'Arial, sans-serif', fontWeight: 700, letterSpacing: '-0.01em',
              color: 'var(--gray-500)',
            }}>Google</span>
          </div>
        )}
      </div>
    </div>
  )
}

function AddPlaceModal({ onClose, userVenues, onAdd, onRemove }) {
  // Form state
  const [name,         setName]         = React.useState('')
  const [blurb,        setBlurb]        = React.useState('')
  const [category,     setCategory]     = React.useState('food')
  const [neighborhood, setNeighborhood] = React.useState('')
  const [address,      setAddress]      = React.useState('')
  const [hours,        setHours]        = React.useState('')
  const [image,        setImage]        = React.useState('')
  const [error,        setError]        = React.useState('')

  // Bulk-imported places (Google Takeout / paste-names) tend to outnumber
  // manually-added picks 60:1, so we split the list. Manual picks render
  // inline; imported ones collapse into a "View imported (N)" accordion that
  // stays closed by default — otherwise the form gets pushed off-screen.
  // Optional search box appears once expanded, since 62+ entries are a lot
  // to scan visually.
  const [importsOpen, setImportsOpen] = React.useState(false)
  const [importQuery, setImportQuery] = React.useState('')

  // Split helper — treats anything with a known import `source` (or a
  // seed-prefixed id) as imported. Everything else is "manual".
  function isImported(v) {
    if (typeof v?.id === 'string' && v.id.startsWith('seed_')) return true
    const s = v?.source || ''
    return s === 'google_takeout' || s === 'google_places_paste' || s.startsWith('google_')
  }

  const allExisting = Object.values(userVenues || {}).sort((a, b) => b.savedAt - a.savedAt)
  const manualExisting = allExisting.filter(v => !isImported(v))
  const importedExisting = allExisting.filter(isImported)
  const importedFiltered = importQuery.trim()
    ? importedExisting.filter(v => (v.name || '').toLowerCase().includes(importQuery.trim().toLowerCase()))
    : importedExisting

  function handleSubmit() {
    if (!name.trim()) { setError('Name is required'); return }
    if (!blurb.trim()) { setError('Tell us why you love it'); return }
    if (!neighborhood) { setError('Pick a neighborhood'); return }
    onAdd({
      name: name.trim(),
      blurb: blurb.trim(),
      category,
      neighborhood,
      address: address.trim(),
      hours: hours.trim(),
      image: image.trim(),
    })
    // Reset form
    setName(''); setBlurb(''); setCategory('food'); setNeighborhood('')
    setAddress(''); setHours(''); setImage(''); setError('')
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--white)', borderRadius: '20px 20px 0 0',
          width: '100%', maxWidth: 460,
          maxHeight: '90vh', overflowY: 'auto',
          boxSizing: 'border-box',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        {/* Drag handle */}
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--gray-300)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2 }}>
              Add your place
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4, lineHeight: 1.45 }}>
              Save personal favorites alongside our curated picks. They&apos;ll work in your trip plan and show up in search.
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'var(--gray-100)', border: 'none', borderRadius: 999,
            width: 32, height: 32, cursor: 'pointer',
            fontSize: 16, color: 'var(--gray-500)', lineHeight: 1,
            flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Manual picks — inline, always shown. Typically a small list. */}
        {manualExisting.length > 0 && (
          <div style={{ padding: '16px 20px 4px' }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'var(--gray-400)', marginBottom: 8,
            }}>
              Your places ({manualExisting.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {manualExisting.map(v => {
                const cat = USER_PLACE_CATEGORIES.find(c => c.id === v.category) || USER_PLACE_CATEGORIES[7]
                return (
                  <div key={v.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', background: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)', borderRadius: 10,
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{cat.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {v.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>
                        {cat.label}{v.neighborhood ? ' · ' + v.neighborhood : ''}
                      </div>
                    </div>
                    <button onClick={() => onRemove(v.id)} aria-label="Remove" style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 14, color: 'var(--gray-400)', padding: '4px 6px',
                      flexShrink: 0,
                    }}>✕</button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Imported places — collapsible accordion. Kept closed by default so
            a 62- or 425-entry list doesn't dominate the modal. Search appears
            once expanded since 60+ rows are hard to scan otherwise. */}
        {importedExisting.length > 0 && (
          <div style={{ padding: manualExisting.length > 0 ? '12px 20px 4px' : '16px 20px 4px' }}>
            <button
              onClick={() => setImportsOpen(o => !o)}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px',
                background: importsOpen ? 'var(--gray-100)' : 'var(--gray-50)',
                border: '1px solid var(--gray-200)', borderRadius: 10,
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>📥</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>
                  Imported from Google Maps
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>
                  {importedExisting.length} place{importedExisting.length !== 1 ? 's' : ''}{importsOpen ? ' · tap to collapse' : ' · tap to view'}
                </div>
              </div>
              <span style={{
                fontSize: 14, color: 'var(--gray-500)', flexShrink: 0,
                transform: importsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s',
              }}>›</span>
            </button>

            {importsOpen && (
              <div style={{ marginTop: 10 }}>
                {/* Search inside imports */}
                <input
                  type="text"
                  value={importQuery}
                  onChange={e => setImportQuery(e.target.value)}
                  placeholder={`Search ${importedExisting.length} imported place${importedExisting.length !== 1 ? 's' : ''}…`}
                  style={{
                    width: '100%', padding: '8px 12px', fontSize: 13,
                    background: 'var(--card)', border: '1px solid var(--gray-200)',
                    borderRadius: 8, outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', marginBottom: 8,
                  }}
                />

                {/* Capped-height scrolling list — keeps the modal usable. */}
                <div style={{
                  maxHeight: 320, overflowY: 'auto',
                  display: 'flex', flexDirection: 'column', gap: 6,
                  padding: '2px',
                }}>
                  {importedFiltered.length === 0 ? (
                    <div style={{
                      padding: '20px 12px', textAlign: 'center',
                      fontSize: 12, color: 'var(--gray-400)',
                    }}>
                      No imported place matches "{importQuery}"
                    </div>
                  ) : importedFiltered.map(v => {
                    const cat = USER_PLACE_CATEGORIES.find(c => c.id === v.category) || USER_PLACE_CATEGORIES[7]
                    return (
                      <div key={v.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '7px 10px', background: 'var(--gray-50)',
                        border: '1px solid var(--gray-200)', borderRadius: 8,
                      }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{cat.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {v.name}
                          </div>
                        </div>
                        <button onClick={() => onRemove(v.id)} aria-label="Remove" style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 13, color: 'var(--gray-400)', padding: '4px 6px',
                          flexShrink: 0,
                        }}>✕</button>
                      </div>
                    )
                  })}
                </div>
                <div style={{
                  marginTop: 8, fontSize: 11, color: 'var(--gray-400)',
                  lineHeight: 1.5,
                }}>
                  These came from your Google Maps lists. They show up in search and the trip planner just like manual picks — removing one here removes it everywhere.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <div style={{ padding: '18px 20px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--gray-400)',
          }}>
            Add a new place
          </div>

          {/* Name */}
          <Field label="Name" required>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Carbone"
              style={inputStyle} />
          </Field>

          {/* Why you love it */}
          <Field label="Why you love it" required>
            <textarea value={blurb} onChange={e => setBlurb(e.target.value)}
              placeholder="Best red sauce in NYC. Get the spicy rigatoni."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} />
          </Field>

          {/* Category — chip picker */}
          <Field label="Category">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
              {USER_PLACE_CATEGORIES.map(c => {
                const active = category === c.id
                return (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    padding: '7px 4px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: active ? 700 : 500,
                    background: active ? 'var(--gray-900)' : 'var(--gray-100)',
                    color: active ? '#fff' : 'var(--gray-600)',
                  }}>
                    <span style={{ fontSize: 12 }}>{c.emoji}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
                  </button>
                )
              })}
            </div>
          </Field>

          {/* Neighborhood — required, drives trip-day grouping. Top-level boroughs grouped by optgroup;
              boroughs with sub-areas (Brooklyn) expose their specific neighborhoods below. */}
          <Field label="Neighborhood" required>
            <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
              style={{ ...inputStyle, appearance: 'none', background: 'var(--white)' }}>
              <option value="">Pick a neighborhood…</option>
              {/* Top-level neighborhoods (Manhattan + boroughs without sub-areas yet) */}
              <optgroup label="Top-level">
                {NEIGHBORHOOD_GROUPS.map(g => (
                  <option key={g.key} value={g.label}>{g.emoji} {g.label}</option>
                ))}
              </optgroup>
              {/* Boroughs that have sub-neighborhoods — each sub-area gets its own optgroup for clarity */}
              {Object.entries(NEIGHBORHOOD_SUBAREAS).map(([parentKey, subAreas]) => {
                const parentLabel = NEIGHBORHOOD_GROUPS.find(g => g.key === parentKey)?.label || parentKey
                return subAreas.map(sa => (
                  <optgroup key={parentKey + ':' + sa.key} label={`${parentLabel} · ${sa.label}`}>
                    {sa.areas.map(a => (
                      <option key={a.name} value={a.name}>{a.name}</option>
                    ))}
                  </optgroup>
                ))
              })}
            </select>
          </Field>

          {/* Address — optional */}
          <Field label="Address" hint="optional">
            <input type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder="181 Thompson St"
              style={inputStyle} />
          </Field>

          {/* Hours — optional */}
          <Field label="Hours" hint="optional">
            <input type="text" value={hours} onChange={e => setHours(e.target.value)}
              placeholder="Daily 5:30pm – 11:30pm"
              style={inputStyle} />
          </Field>

          {/* Image URL — optional */}
          <Field label="Image URL" hint="optional">
            <input type="url" value={image} onChange={e => setImage(e.target.value)}
              placeholder="https://…"
              style={inputStyle} />
          </Field>

          {/* Error */}
          {error && (
            <div style={{
              fontSize: 12, color: '#ff4d7d', background: 'rgba(255,77,125,0.15)',
              padding: '8px 12px', borderRadius: 8,
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 4, paddingBottom: 8 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
              background: 'var(--gray-100)', color: 'var(--gray-700)',
              border: '1px solid var(--gray-200)',
              fontSize: 14, fontWeight: 600,
            }}>
              Cancel
            </button>
            <button onClick={handleSubmit} style={{
              flex: 2, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
              background: 'var(--gray-900)', color: '#fff', border: 'none',
              fontSize: 14, fontWeight: 700,
            }}>
              Save place
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Small field-wrapper helper to keep form rows consistent.
function Field({ label, required, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-600)', letterSpacing: '0.04em' }}>
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
        {hint && <span style={{ color: 'var(--gray-400)', fontWeight: 500, marginLeft: 5 }}>· {hint}</span>}
      </div>
      {children}
    </div>
  )
}

// Shared input styling (declared as a const so all inputs share it).
const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px', borderRadius: 9,
  border: '1px solid var(--gray-200)',
  fontSize: 14, color: 'var(--gray-900)',
  background: 'var(--white)',
  outline: 'none', fontFamily: 'inherit',
}

// ── Onboarding art — hand-drawn scenes in the same illustration language as
// the home cards (MoodCoverArt / ActivityCoverArt). One per slide, 280×170.
function OnboardingArt({ slide }) {
  const svgProps = {
    viewBox: '0 0 280 170',
    preserveAspectRatio: 'xMidYMid slice',
    style: { width: '100%', height: '100%', display: 'block' },
    'aria-hidden': true,
  }
  if (slide === 0) return ( // the city at dusk — welcome
    <svg {...svgProps}>
      <rect width="280" height="170" fill="#C97F52" />
      <rect width="280" height="60" fill="#D89562" opacity="0.7" />
      <path d="M140 16l2.4 6 6 2.4-6 2.4-2.4 6.2-2.4-6.2-6-2.4 6-2.4z" fill="#F3EBDC" />
      <circle cx="52" cy="30" r="1.6" fill="#F3EBDC" opacity="0.7" />
      <circle cx="228" cy="24" r="1.4" fill="#F3EBDC" opacity="0.6" />
      <path d="M0 170v-60h20V90h14v20h18V70h16v40h14l6-28 3-12 3 12 6 28h14V56h8l3-16 3 16h8v54h18V84h16v26h14V96h20v18h16v-14h22v70z" fill="#6E3A24" />
      <g fill="#F3EBDC" opacity="0.8">
        <rect x="26" y="118" width="4" height="5" /><rect x="60" y="80" width="4" height="5" />
        <rect x="98" y="66" width="4" height="5" /><rect x="140" y="72" width="4" height="5" />
        <rect x="172" y="94" width="4" height="5" /><rect x="206" y="106" width="4" height="5" />
        <rect x="244" y="122" width="4" height="5" /><rect x="118" y="94" width="4" height="5" />
      </g>
    </svg>
  )
  if (slide === 1) return ( // a place card, saved — the + pill on plum night
    <svg {...svgProps}>
      <rect width="280" height="170" fill="#5C3A4F" />
      <circle cx="46" cy="28" r="1.6" fill="#F3EBDC" opacity="0.7" />
      <circle cx="238" cy="36" r="1.4" fill="#F3EBDC" opacity="0.6" />
      <circle cx="206" cy="18" r="1.2" fill="#F3EBDC" opacity="0.5" />
      <rect x="62" y="34" width="156" height="112" rx="12" fill="#FBF6EC" />
      <rect x="72" y="44" width="136" height="58" rx="8" fill="#8FA3A8" />
      <circle cx="182" cy="58" r="9" fill="#C6892F" />
      <path d="M72 102V84c14-10 30-12 46-6s34 4 48-2l42-2v28z" fill="#6F7A45" opacity="0.9" />
      <rect x="72" y="112" width="86" height="7" rx="3.5" fill="#5C5142" />
      <rect x="72" y="126" width="58" height="6" rx="3" fill="#B4A78F" />
      <circle cx="218" cy="130" r="21" fill="#B7472A" />
      <path d="M218 120v20M208 130h20" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
  return ( // saves become a routed day — pins 1·2·3 on a street grid
    <svg {...svgProps}>
      <rect width="280" height="170" fill="#E8D9BC" />
      <g stroke="#D9CBB2" strokeWidth="5">
        <path d="M0 52h280M0 108h280M56 0v170M140 0v170M224 0v170" />
      </g>
      <path d="M48 132C86 118 96 84 132 78s76 6 104-30" fill="none" stroke="#B7472A" strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" />
      <g>
        <path d="M48 132c-11-12-16-19-16-27a16 16 0 1 1 32 0c0 8-5 15-16 27z" fill="#B7472A" />
        <circle cx="48" cy="104" r="9" fill="#F3EBDC" /><text x="48" y="108.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#B7472A" fontFamily="Georgia, serif">1</text>
      </g>
      <g>
        <path d="M138 78c-11-12-16-19-16-27a16 16 0 1 1 32 0c0 8-5 15-16 27z" fill="#475A66" />
        <circle cx="138" cy="50" r="9" fill="#F3EBDC" /><text x="138" y="54.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#475A66" fontFamily="Georgia, serif">2</text>
      </g>
      <g>
        <path d="M236 102c-11-12-16-19-16-27a16 16 0 1 1 32 0c0 8-5 15-16 27z" fill="#6F7A45" />
        <circle cx="236" cy="74" r="9" fill="#F3EBDC" /><text x="236" y="78.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6F7A45" fontFamily="Georgia, serif">3</text>
      </g>
      <path d="M20 24c5 0 5-3 10-3s5 3 10 3" stroke="#C9BBA0" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Onboarding Modal — three-slide welcome flow shown on first app open ──
function OnboardingModal({ onDismiss }) {
  const [slide, setSlide] = React.useState(0)
  // Three verbs, three slides: what you can DO here → how SAVING works →
  // what the app does FOR you. Art is hand-drawn (OnboardingArt above).
  const slides = [
    {
      eyebrow: 'WELCOME TO NYC STOOP',
      title: 'Explore. Learn.\nPlan your days.',
      body: 'A curated New York guide — browse what’s worth doing, read the story behind every place, and turn it all into a schedule.',
    },
    {
      eyebrow: 'SAVE ANYTHING',
      title: 'Tap + on what\ncatches your eye.',
      body: 'Places, restaurants, shows — one button everywhere: “+ Add to My Trip.” Your picks collect in one place.',
    },
    {
      eyebrow: 'WE DO THE PLANNING',
      title: 'Saves become\na routed day.',
      body: 'My Trip groups picks by neighborhood, adds lunch and dinner, checks the weather, and routes you door to door.',
    },
  ]
  const isLast = slide === slides.length - 1
  const current = slides[slide]

  return (
    <div style={{
      // Constrained to the same column width as the app shell (UX fix) —
      // previously stretched edge-to-edge on desktop.
      position: 'fixed', top: 0, bottom: 0, zIndex: 1000,
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'var(--canvas)',
      color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      // iOS safe-area aware
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      overflow: 'hidden',
    }}>
      {/* Top bar: Skip link (hidden on last slide so the only CTA is "Let's go") */}
      <div style={{ position: 'relative', padding: '18px 20px 0', display: 'flex', justifyContent: 'flex-end', minHeight: 44 }}>
        {!isLast && (
          <button onClick={onDismiss} style={{
            background: 'var(--white)',
            border: 'none', color: 'var(--ink-2)',
            padding: '8px 14px', borderRadius: 999,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            letterSpacing: '0.02em',
            boxShadow: '0 4px 14px rgba(29,39,51,.08)',
          }}>Skip</button>
        )}
      </div>

      {/* Slide body — emoji tile + headline + body */}
      <div style={{
        position: 'relative', flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center', gap: 20,
      }}>
        {/* Hand-drawn scene — the same illustration language as the home cards */}
        <div style={{
          width: '100%', maxWidth: 300, height: 180, borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(33,27,20,0.10)', boxShadow: '0 10px 30px rgba(33,27,20,0.12)',
          flexShrink: 0,
        }}>
          <OnboardingArt slide={slide} />
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
          color: 'var(--field-clay)', marginTop: 6, textTransform: 'uppercase',
        }}>{current.eyebrow}</div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 600, lineHeight: 1.15,
          letterSpacing: '0.01em', maxWidth: 320, whiteSpace: 'pre-line', color: 'var(--ink)',
        }}>
          {current.title}
        </div>
        <div style={{
          fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)',
          maxWidth: 320,
        }}>
          {current.body}
        </div>
      </div>

      {/* Bottom: pagination dots + Next / Let's go button */}
      <div style={{
        position: 'relative',
        padding: '0 24px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
      }}>
        {/* Pagination dots — active dot stretches into a pill */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {slides.map((_, i) => (
            <button key={i}
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === slide ? 24 : 8, height: 8, borderRadius: 999,
                background: i === slide ? 'var(--accent)' : 'var(--gray-300)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width 240ms ease, background 240ms ease',
              }} />
          ))}
        </div>

        {/* Primary CTA — blue action pill with the accent glow */}
        <button onClick={() => isLast ? onDismiss() : setSlide(slide + 1)} style={{
          width: '100%', maxWidth: 340,
          background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: 999,
          padding: '15px 24px',
          fontSize: 15, fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 10px 22px rgba(224,85,44,.45)',
          letterSpacing: '-0.005em',
        }}>
          {isLast ? "Let's go →" : 'Next'}
        </button>
      </div>
    </div>
  )
}

// ── Settings Modal ──────────────────────────────────────────────────────────
// Bottom-sheet modal reachable from the gear icon in the home-header.
// Houses About / version, Privacy policy link, Send feedback (mailto), and a
// destructive "Clear all data" with a two-tap confirmation.
const APP_VERSION = '1.0.0'
const FEEDBACK_EMAIL = 'hsichunw@gmail.com'
const PRIVACY_URL = 'https://stevenwang415.github.io/nyc-stoop/privacy.html'

/** SettingsModal — Account + app settings.
 *
 *  When signed out: the account section is a single "Sign in / Create account"
 *  button; tapping it swaps the modal contents for the embedded AuthModal.
 *
 *  When signed in: shows avatar (with upload), nickname (editable, debounced),
 *  email, and sign-out. Avatar is resized + stored as a data URL in
 *  nyc_avatar_by_email so it survives sign-out/sign-in cycles.
 */
function SettingsModal({
  onClose,
  user,
  onSignedIn,   // (token, user) — after AuthModal success
  onSignedOut,  // () — after sign-out
  onUserChange, // (user) — after profile updates (name / picture override)
  onImportTakeout = () => {}, // open the Google Takeout import modal
  onPrefsChange = () => {},   // language / temperature unit changed — re-render app
  onOpenSavedPlaces = () => {}, // jump to My Trip with the saved-places page open
}) {
  const [confirmClear, setConfirmClear] = React.useState(false)
  const [authOpen, setAuthOpen]         = React.useState(false)
  const [editName, setEditName]         = React.useState(false)
  const [nameDraft, setNameDraft]       = React.useState(user?.display_name || '')
  const [savingName, setSavingName]     = React.useState(false)
  const [avatarBusy, setAvatarBusy]     = React.useState(false)
  const [avatarError, setAvatarError]   = React.useState('')
  const [thanksOpen, setThanksOpen]     = React.useState(false)
  const fileInputRef = React.useRef(null)

  // Pull the per-email avatar/nickname overlay; falls back to server picture_url + display_name.
  const overlay = user ? getProfileOverlay(user.email) : { avatar: null, nickname: null }
  const avatarSrc = overlay.avatar || user?.picture_url || null
  const displayName = overlay.nickname || user?.display_name || (user?.email ? user.email.split('@')[0] : '')

  React.useEffect(() => {
    // When the signed-in user changes, reset the inline name editor.
    setNameDraft(user?.display_name || overlay.nickname || '')
    setEditName(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function handleAvatarPick(file) {
    setAvatarError('')
    if (!file) return
    setAvatarBusy(true)
    try {
      const dataUrl = await resizeImageFile(file, { maxSize: 256, quality: 0.85 })
      authSetAvatar(user.email, dataUrl)
      onUserChange?.({ ...user, picture_url: user.picture_url }) // trigger re-render
    } catch (e) {
      setAvatarError(e.message || 'Could not load that image.')
    } finally {
      setAvatarBusy(false)
    }
  }

  async function handleSaveName() {
    const trimmed = nameDraft.trim()
    if (trimmed === (user?.display_name || '')) {
      setEditName(false); return
    }
    setSavingName(true)
    try {
      const updated = await updateDisplayName(trimmed)
      authSetUser(updated)
      authSetNickname(user.email, trimmed || null)
      onUserChange?.(updated)
      setEditName(false)
    } catch {
      // Soft-fail: still store the nickname locally so the user sees their choice.
      authSetNickname(user.email, trimmed || null)
      onUserChange?.({ ...user, display_name: trimmed || null })
      setEditName(false)
    } finally {
      setSavingName(false)
    }
  }

  function handleSignOut() {
    authSignOut()
    onSignedOut?.()
  }

  function handleClearLocalData() {
    // Wipe every nyc_* key — that's our full localStorage namespace.
    // Note: signing out is a side-effect since nyc_token + nyc_user are nyc_*.
    try {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith('nyc_')) keysToRemove.push(k)
      }
      keysToRemove.forEach(k => localStorage.removeItem(k))
    } catch {}
    window.location.reload()
  }

  const rowStyle = {
    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 18px', background: 'var(--white)',
    border: 'none', borderBottom: '1px solid var(--gray-100)',
    cursor: 'pointer', textAlign: 'left',
    fontFamily: 'inherit', fontSize: 15, color: 'var(--gray-900)',
  }
  const labelStyle = { flex: 1, minWidth: 0 }

  // If the embedded AuthModal is open, render IT inside the sheet shell.
  if (authOpen) {
    return (
      <AuthModal
        onClose={() => setAuthOpen(false)}
        onSuccess={({ token, user: signedUser }) => {
          setAuthOpen(false)
          onSignedIn?.(token, signedUser)
        }}
      />
    )
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--white)', borderRadius: '20px 20px 0 0',
          width: '100%', maxWidth: 460,
          maxHeight: '92vh', overflowY: 'auto',
          boxSizing: 'border-box',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        {/* Drag handle */}
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--gray-300)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2 }}>
              {t('Settings')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
              NYC Stoop · v{APP_VERSION}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'var(--gray-100)', border: 'none', borderRadius: 999,
            width: 32, height: 32, cursor: 'pointer',
            fontSize: 16, color: 'var(--gray-500)', lineHeight: 1, flexShrink: 0,
          }}>✕</button>
        </div>

        {/* ── Temperature unit — one quiet row, house light-segmented style.
            (Language toggle held for v1.1 — dictionary + t() wiring live in
            src/lib/i18n.js; re-add a row like this and unforce 'en'.) ── */}
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ flex: 1, fontSize: 15, color: 'var(--gray-900)' }}>{t('Temperature')}</span>
          <div role="tablist" style={{ display: 'inline-flex', background: 'var(--gray-100)', borderRadius: 999, padding: 3 }}>
            {[['f', '°F'], ['c', '°C']].map(([code, label]) => {
              const on = getUnit() === code
              return (
                <button key={code} role="tab" aria-selected={on}
                  onClick={() => { setUnit(code); onPrefsChange() }}
                  style={{
                    border: 'none', cursor: 'pointer', padding: '5px 14px', borderRadius: 999,
                    fontSize: 13, fontWeight: on ? 700 : 500, fontFamily: 'inherit',
                    background: on ? 'var(--white)' : 'transparent',
                    color: on ? 'var(--gray-900)' : 'var(--gray-500)',
                    boxShadow: on ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}>{label}</button>
              )
            })}
          </div>
        </div>

        {/* ── My saved places — the archive page (also reachable from My Trip) ── */}
        <div style={{ padding: '0 20px 16px' }}>
          <button onClick={onOpenSavedPlaces} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 14,
            padding: '13px 16px', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 15, color: 'var(--gray-900)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-flex', color: 'var(--gray-500)' }}><NavIcon name="bookmark" size={18} /></span>
              {t('My saved places')}
            </span>
            <span style={{ color: 'var(--gray-400)', fontSize: 17 }}>›</span>
          </button>
        </div>

        {/* ── Account section ─────────────────────────────────────────── */}
        {user ? (
          <div style={{ padding: '0 20px 18px' }}>
            <div style={{
              background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
              borderRadius: 14, padding: 16,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              {/* Avatar with upload overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change avatar"
                style={{
                  position: 'relative', flexShrink: 0,
                  width: 64, height: 64, borderRadius: '50%',
                  border: 'none', cursor: 'pointer',
                  background: avatarSrc ? `center / cover no-repeat url(${avatarSrc})` : 'var(--gray-200)',
                  padding: 0, overflow: 'hidden',
                }}
              >
                {!avatarSrc && (
                  <span style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 700, color: 'var(--gray-500)',
                  }}>
                    {(displayName || '?').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span style={{
                  position: 'absolute', bottom: 0, right: 0,
                  background: 'var(--gray-900)', color: '#fff',
                  fontSize: 11, padding: '2px 6px', borderRadius: 999,
                  border: '2px solid var(--white)',
                }}>{avatarBusy ? '…' : '✎'}</span>
              </button>
              <input
                ref={fileInputRef} type="file" accept="image/*"
                onChange={e => handleAvatarPick(e.target.files?.[0])}
                style={{ display: 'none' }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                {editName ? (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      autoFocus value={nameDraft}
                      onChange={e => setNameDraft(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSaveName() }}
                      placeholder="Display name"
                      style={{
                        flex: 1, padding: '6px 10px', fontSize: 14,
                        border: '1px solid var(--gray-300)', borderRadius: 8,
                        outline: 'none', fontFamily: 'inherit', minWidth: 0,
                      }}
                    />
                    <button onClick={handleSaveName} disabled={savingName} style={{
                      padding: '6px 10px', fontSize: 12, fontWeight: 700,
                      background: 'var(--gray-900)', color: '#fff', border: 'none',
                      borderRadius: 8, cursor: 'pointer',
                    }}>{savingName ? '…' : 'Save'}</button>
                  </div>
                ) : (
                  <button onClick={() => setEditName(true)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, textAlign: 'left',
                    fontSize: 16, fontWeight: 700, color: 'var(--gray-900)',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    {displayName} <span style={{ color: 'var(--gray-400)', fontWeight: 500, fontSize: 12 }}>✎</span>
                  </button>
                )}
                <div style={{
                  fontSize: 12, color: 'var(--gray-500)', marginTop: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{user.email}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  {user.has_google && (
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#1e3a8a', background: '#dbeafe', padding: '2px 6px', borderRadius: 4 }}>Google</span>
                  )}
                  {user.has_password && (
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#3f3f46', background: '#e4e4e7', padding: '2px 6px', borderRadius: 4 }}>Password</span>
                  )}
                </div>
              </div>
            </div>
            {avatarError && (
              <div style={{
                fontSize: 12, color: '#991b1b', background: '#fef2f2',
                padding: '8px 12px', borderRadius: 10, marginTop: 8,
              }}>{avatarError}</div>
            )}
          </div>
        ) : (
          <div style={{ padding: '0 20px 18px' }}>
            <button
              onClick={() => setAuthOpen(true)}
              style={{
                width: '100%', padding: '14px 16px',
                background: 'var(--gray-900)', color: '#fff',
                border: 'none', borderRadius: 12, cursor: 'pointer',
                fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <span style={{ display: 'inline-flex' }}><NavIcon name="key" size={16} /></span>
              <span>{t('Sign in')} / {t('Create account')}</span>
            </button>
            <div style={{ fontSize: 11, color: 'var(--gray-500)', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
              Sign in to sync your saves and trip plan across devices.
            </div>
          </div>
        )}

        {/* Action rows */}
        <div style={{ borderTop: '1px solid var(--gray-100)' }}>
          {user && (
            <button onClick={handleSignOut} style={rowStyle}>
              <span style={{ display: 'inline-flex', color: 'var(--gray-500)' }}><NavIcon name="logOut" size={18} /></span>
              <span style={labelStyle}>{t('Sign out')}</span>
              <span style={{ fontSize: 14, color: 'var(--gray-400)' }}>›</span>
            </button>
          )}
          {/* One-time bulk import for places already saved in Google Maps */}
          <button onClick={() => { onClose?.(); onImportTakeout?.() }} style={rowStyle}>
            <span style={{ display: 'inline-flex', color: 'var(--gray-500)' }}><NavIcon name="download" size={18} /></span>
            <span style={labelStyle}>Import from Google Maps</span>
            <span style={{ fontSize: 14, color: 'var(--gray-400)' }}>›</span>
          </button>
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" style={{ ...rowStyle, textDecoration: 'none' }}>
            <span style={{ display: 'inline-flex', color: 'var(--gray-500)' }}><NavIcon name="lock" size={18} /></span>
            <span style={labelStyle}>Privacy policy</span>
            <span style={{ fontSize: 14, color: 'var(--gray-400)' }}>↗</span>
          </a>
          <a href={`mailto:${FEEDBACK_EMAIL}?subject=NYC%20Stoop%20feedback%20(v${APP_VERSION})`}
             style={{ ...rowStyle, textDecoration: 'none' }}>
            <span style={{ display: 'inline-flex', color: 'var(--gray-500)' }}><NavIcon name="mail" size={18} /></span>
            <span style={labelStyle}>Send feedback</span>
            <span style={{ fontSize: 14, color: 'var(--gray-400)' }}>↗</span>
          </a>
          <a href="https://github.com/stevenwang415/nyc-stoop" target="_blank" rel="noopener noreferrer"
             style={{ ...rowStyle, textDecoration: 'none' }}>
            <span style={{ display: 'inline-flex', color: 'var(--gray-500)' }}><NavIcon name="code" size={18} /></span>
            <span style={labelStyle}>Source on GitHub</span>
            <span style={{ fontSize: 14, color: 'var(--gray-400)' }}>↗</span>
          </a>

          {/* Thanks — the friends whose places, tips, and ideas seeded the guide */}
          <button onClick={() => setThanksOpen(o => !o)} aria-expanded={thanksOpen} style={rowStyle}>
            <span style={{ display: 'inline-flex', color: 'var(--gray-500)' }}><NavIcon name="heart" size={18} /></span>
            <span style={labelStyle}>{t('Thanks')}</span>
            <span style={{
              fontSize: 14, color: 'var(--gray-400)', display: 'inline-block',
              transform: thanksOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease',
            }}>›</span>
          </button>
          {thanksOpen && (
            <div style={{
              padding: '14px 20px 18px', background: 'var(--gray-50)',
              borderBottom: '1px solid var(--gray-100)',
            }}>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 12 }}>
                {t('For the friends who shared their favorite corners of New York — places, tips, and ideas.')}
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px',
                fontSize: 13, color: 'var(--gray-900)',
              }}>
                {[
                  'Eva Chan', 'Cliff Chen', 'Ray Chen', 'Shih-Chieh Chien',
                  'Willow Liu', 'Cindy Ou', 'Mateo Solorzano', 'Apple Tsai',
                  'Peter Wang', 'Ian Wei', 'Suzie Wu',
                ].map(name => <div key={name}>{name}</div>)}
              </div>
            </div>
          )}

          {/* Clear local data — destructive, two-tap confirmation */}
          {!confirmClear ? (
            <button onClick={() => setConfirmClear(true)} style={{
              ...rowStyle, color: '#b91c1c', borderBottom: 'none',
            }}>
              <span style={{ display: 'inline-flex' }}><NavIcon name="trash" size={18} /></span>
              <span style={labelStyle}>Clear local data</span>
              <span style={{ fontSize: 14, color: '#fca5a5' }}>›</span>
            </button>
          ) : (
            <div style={{
              padding: '16px 20px 18px', background: '#fef2f2',
              borderTop: '1px solid #fecaca',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#7f1d1d', marginBottom: 4 }}>
                Clear local data?
              </div>
              <div style={{ fontSize: 12, color: '#991b1b', lineHeight: 1.5, marginBottom: 14 }}>
                Removes every save, custom place, trip plan, note, and preference
                from this device. Your account (if signed in) stays intact — you
                can sign back in to recover it. This cannot be undone locally.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfirmClear(false)} style={{
                  flex: 1, padding: '10px 14px', background: 'var(--white)',
                  border: '1px solid var(--gray-300)', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', cursor: 'pointer',
                }}>Cancel</button>
                <button onClick={handleClearLocalData} style={{
                  flex: 1, padding: '10px 14px', background: '#dc2626',
                  border: 'none', borderRadius: 10, color: '#fff',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>Yes, clear everything</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '20px 20px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
            © 2026 NYC Stoop · Built in New York
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SharedTripView ──────────────────────────────────────────────────────────
// Read-only preview of someone else's shared trip. The recipient sees:
//   • A friendly framing ("Your friend's NYC trip")
//   • The decoded list of stops, grouped by type (venue/work/sight)
//   • Trip duration + arrival date if shared
//   • "Copy to my trip" CTA to merge into their own savedItems
//   • "Use NYC Stoop normally" to dismiss
function SharedTripView({ trip, onAdopt, onDismiss }) {
  // Resolve each shared ID into a display item. Filters out IDs the local
  // app doesn't know about (older curated data, deleted venues, etc.).
  const resolvedItems = (trip.ids || []).map(key => {
    const [type, id] = key.split(':')
    if (!type || !id) return null
    if (type === 'venue') {
      const v = venues[id]
      return v ? { type: 'venue', id, name: v.name, sub: v.neighborhood || '', accent: venueColors[id]?.bg || '#666' } : null
    }
    if (type === 'work') {
      const w = works[id]
      return w ? { type: 'work', id, name: w.title, sub: w.year || '', accent: '#7c3aed' } : null
    }
    if (type === 'sight') {
      const s = ALL_SIGHTS[id]
      return s ? { type: 'sight', id, name: s.name, sub: s.neighborhood || '', accent: '#059669' } : null
    }
    return null
  }).filter(Boolean)
  const unresolvedCount = (trip.ids || []).length - resolvedItems.length

  return (
    <div className="app-shell" style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: 'var(--gray-50)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
        color: '#fff', padding: '32px 20px 28px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🎁</div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 6 }}>
          Shared trip
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
          Someone shared their NYC trip with you
        </div>
        <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>
          {resolvedItems.length} {resolvedItems.length === 1 ? 'stop' : 'stops'}
          {trip.days ? ` · ${trip.days} day${trip.days !== 1 ? 's' : ''}` : ''}
          {trip.start ? ` · arriving ${trip.start.slice(5)}` : ''}
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 20px 24px', overflowY: 'auto' }}>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--gray-500)', marginBottom: 10,
        }}>
          Their stops
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {resolvedItems.map(item => (
            <div key={item.type + ':' + item.id} style={{
              background: 'var(--card)', border: '1px solid var(--gray-200)',
              borderRadius: 12, padding: '10px 14px',
              borderLeft: `3px solid ${item.accent}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{item.name}</div>
                {item.sub && <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>{item.sub}</div>}
              </div>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                color: 'var(--gray-500)', background: 'var(--gray-100)', padding: '2px 7px', borderRadius: 4,
              }}>{item.type}</span>
            </div>
          ))}
        </div>
        {unresolvedCount > 0 && (
          <div style={{
            background: '#fef3c7', border: '1px solid #fcd34d',
            borderRadius: 10, padding: '10px 12px', marginBottom: 16,
            fontSize: 12, color: '#92400e', lineHeight: 1.5,
          }}>
            ⚠️ {unresolvedCount} {unresolvedCount === 1 ? 'stop' : 'stops'} couldn't be loaded — they may have been removed since the trip was shared.
          </div>
        )}

        <button
          onClick={onAdopt}
          disabled={resolvedItems.length === 0}
          style={{
            width: '100%', background: resolvedItems.length === 0 ? 'var(--gray-300)' : 'var(--gray-900)',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '14px 16px', cursor: resolvedItems.length === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 700, marginBottom: 10,
          }}
        >
          {resolvedItems.length === 0 ? 'Nothing to copy' : `Copy ${resolvedItems.length} stop${resolvedItems.length !== 1 ? 's' : ''} to my trip`}
        </button>
        <button
          onClick={onDismiss}
          style={{
            width: '100%', background: 'transparent', color: 'var(--gray-600)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            padding: '8px 14px',
          }}
        >
          Skip — use NYC Stoop normally
        </button>
      </div>
    </div>
  )
}

// ── Plan my night — lightweight when/where chooser for the one-tap happy path ──
function PlanNightSheet({ onClose, onBuild }) {
  const [when, setWhen] = React.useState('tonight')
  const [area, setArea] = React.useState('surprise')
  const whenOpts = [['tonight', 'Tonight'], ['weekend', 'This weekend']]
  const areaOpts = [['surprise', '🎲 Surprise me'], ['midtown', 'Midtown'], ['downtown', 'Downtown'], ['uptown', 'Uptown'], ['brooklyn', 'Brooklyn']]
  const chip = active => ({
    padding: '9px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 700,
    background: active ? 'var(--accent)' : 'var(--gray-100)',
    color: active ? '#fff' : 'var(--gray-700)',
  })
  const label = { fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(33,27,20,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 430, background: 'var(--card)', borderTop: '1px solid rgba(33,27,20,0.08)', borderRadius: '20px 20px 0 0', padding: '18px 20px calc(20px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 9.5, letterSpacing: '0.24em', color: 'var(--field-clay)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>Tonight, curated</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.05 }}>{t('Plan my night')}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--gray-400)', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={label}>When</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {whenOpts.map(([k, l]) => <button key={k} onClick={() => setWhen(k)} style={chip(when === k)}>{l}</button>)}
        </div>
        <div style={label}>Where</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {areaOpts.map(([k, l]) => <button key={k} onClick={() => setArea(k)} style={chip(area === k)}>{l}</button>)}
        </div>
        <button onClick={() => onBuild({ when, areaKey: area })} style={{
          width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 14,
          padding: '15px', fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 16px rgba(190,77,43,.35)',
        }}>
          Build my plan →
        </button>
      </div>
    </div>
  )
}

export default function App() {
  // ── Shared-trip view state ──────────────────────────────────────────────
  // If the URL is /#/t/<encoded>, we render a read-only preview so a
  // recipient can see the sender's itinerary without it overwriting
  // their own saves. They can adopt it via the "Copy to my trip" CTA.
  const [sharedTrip, setSharedTrip] = useState(() => {
    if (typeof window === 'undefined') return null
    const enc = extractShareHash(window.location.hash)
    return enc ? decodeTrip(enc) : null
  })
  function dismissSharedTrip() {
    setSharedTrip(null)
    try { window.history.replaceState(null, '', window.location.pathname + window.location.search) } catch {}
  }

  // ── Password-reset deep link (?reset_token=…) ───────────────────────────
  const [resetToken, setResetToken] = useState(() => {
    if (typeof window === 'undefined') return null
    try { return new URLSearchParams(window.location.search).get('reset_token') } catch { return null }
  })
  function clearResetToken() {
    setResetToken(null)
    try { window.history.replaceState(null, '', window.location.pathname + window.location.hash) } catch {}
  }

  // ── Auth — token + user cached in localStorage by ./auth/api ────────────
  const [user, setUserState] = useState(() => getUser())
  useEffect(() => {
    if (!getToken()) return
    // Refresh the cached profile from the server; sign out silently on 401.
    fetchMe()
      .then(u => { authSetUser(u); setUserState(u) })
      .catch(() => {})
  }, [])
  function handleSignedIn(token, u) {
    authSetToken(token)
    authSetUser(u)
    setUserState(u)
  }
  function handleSignedOut() {
    authSignOut()
    setUserState(null)
  }

  // ── First-time-user onboarding — versioned key so we can re-show after major updates ──
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem('nyc_onboarded_v2') }
    catch { return false }
  })
  function dismissOnboarding() {
    try { lsSet('nyc_onboarded_v2', '1') } catch {}
    setShowOnboarding(false)
  }

  const [activeTab, setActiveTab] = useState('explore')
  const { current, canGoBack, push, back, reset: resetExplore } = useNav()

  // ── Location on open ────────────────────────────────────────────────────────
  // Ask for the user's location as soon as the app opens. The browser shows its
  // own permission prompt (the system dialog on iOS Safari); once granted it
  // returns silently on later opens, and a denial fails quietly. We cache the
  // last fix so "Where to eat" can default to nearest immediately, and refresh it
  // on each open. (A native wrapper later upgrades this to the real iOS sheet.)
  const [userLoc, setUserLoc] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem('nyc_user_loc') || 'null'); return (v && typeof v.lat === 'number') ? v : null }
    catch { return null }
  })
  useEffect(() => {
    let alive = true
    getUserLocation()
      .then(({ lat, lng }) => {
        if (!alive) return
        const loc = { lat, lng }
        setUserLoc(loc)
        try { lsSet('nyc_user_loc', JSON.stringify(loc)) } catch {}
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  // ── Weather for the home header — Open-Meteo (free, keyless, CORS-ok). Uses the
  // user's location when we have it, else NYC. Refetches when location resolves.
  const [weather, setWeather] = useState(null)   // { temp, code, isDay } | null
  useEffect(() => {
    const lat = userLoc?.lat ?? 40.7128, lng = userLoc?.lng ?? -74.006
    let alive = true
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit&timezone=auto`)
      .then(r => r.json())
      .then(d => { if (alive && d && d.current) setWeather({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code, isDay: d.current.is_day }) })
      .catch(() => {})
    return () => { alive = false }
  }, [userLoc])

  const [savedItems, setSavedItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_saved') || '{}') }
    catch { return {} }
  })

  // User-added places — separate from curated venues so we can visually
  // distinguish them and keep editorial data clean.
  const [userVenues, setUserVenues] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_user_venues') || '{}') }
    catch { return {} }
  })

  // Merge bulk-imported seed places (data/places.js) on boot — idempotent by
  // stable seed_* ids so re-runs / new devices don't duplicate.
  useEffect(() => {
    setUserVenues(prev => {
      let changed = false
      const next = { ...prev }
      ;(seedUserPlaces || []).forEach(p => {
        if (!p?.id) return
        const existing = next[p.id]
        if (!existing) {
          next[p.id] = { savedAt: Date.now(), ...p }
          changed = true
          return
        }
        // Refresh curated fields (esp. `category`, which we re-classified) from
        // the seed, while preserving user-specific fields: savedAt and any image
        // the user added. This lets re-categorizations reach devices that already
        // imported the seeds under the old category.
        const merged = { ...existing, ...p, savedAt: existing.savedAt || Date.now() }
        if (existing.image && !p.image) merged.image = existing.image
        if (JSON.stringify(merged) !== JSON.stringify(existing)) {
          next[p.id] = merged
          changed = true
        }
      })
      // Prune seed places that have been REMOVED from the seed (e.g. venues that
      // closed). The merge is otherwise additive, so without this a closed spot
      // already cached in localStorage would linger forever. Only seed_* ids are
      // pruned — the user's own custom/imported places are never touched.
      const seedIds = new Set((seedUserPlaces || []).map(p => p.id))
      for (const id of Object.keys(next)) {
        if (id.startsWith('seed_') && !seedIds.has(id)) { delete next[id]; changed = true }
      }
      if (!changed) return prev
      try { lsSet('nyc_user_venues', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  function addUserVenue(data) {
    const id = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6)
    setUserVenues(prev => {
      const next = { ...prev, [id]: { id, isCustom: true, savedAt: Date.now(), ...data } }
      try { lsSet('nyc_user_venues', JSON.stringify(next)) } catch {}
      return next
    })
    // Auto-save so it shows in the saved count + My Trip right away.
    setSavedItems(prev => {
      const key = `user_venue:${id}`
      const next = { ...prev, [key]: { type: 'user_venue', id, savedAt: Date.now() } }
      try { lsSet('nyc_saved', JSON.stringify(next)) } catch {}
      return next
    })
    return id
  }
  function removeUserVenue(id) {
    setUserVenues(prev => {
      const { [id]: _, ...rest } = prev
      try { lsSet('nyc_user_venues', JSON.stringify(rest)) } catch {}
      return rest
    })
    setSavedItems(prev => {
      const key = `user_venue:${id}`
      if (!prev[key]) return prev
      const { [key]: _, ...rest } = prev
      try { lsSet('nyc_saved', JSON.stringify(rest)) } catch {}
      return rest
    })
  }

  const [addPlaceOpen, setAddPlaceOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  // Language / temperature-unit live at module level in i18n.js; bumping this
  // counter re-renders the whole tree so every t()/fmtTemp() re-evaluates.
  const [, setPrefsVersion] = useState(0)
  const onPrefsChange = () => setPrefsVersion(v => v + 1)
  // Settings → "My saved places": land on the My Trip tab with the page open.
  const [savedPlacesReq, setSavedPlacesReq] = useState(0)
  const [importOpen, setImportOpen]     = useState(false)
  const [planNightOpen, setPlanNightOpen] = useState(false)

  // One-tap "Plan my night": seed a few editorial attractions for the chosen
  // area, set the trip length/date, and drop the user straight into My Trip with
  // a routed draft (meals auto-fill near the stops). The happy path, ~2 taps.
  function planNight({ when = 'tonight', areaKey = 'surprise' } = {}) {
    const inArea = {
      midtown:  a => a && ['mw', 'me'].includes(a.areaId),
      downtown: a => a && a.borough === 'manhattan' && ['wv', 'ev', 'lower', 'chelsea', 'gramercy'].includes(a.areaId),
      uptown:   a => a && ['uws', 'ues', 'uptown'].includes(a.areaId),
      brooklyn: a => a && a.borough === 'brooklyn',
      surprise: () => true,
    }[areaKey] || (() => true)
    // "Tonight" must actually feel like a NIGHT: pick evening venues (jazz /
    // classical / theater) so the itinerary builder routes them into Evening
    // slots and slots a dinner in front. "This weekend" stays daytime sights.
    const EVENING_DOMAINS = new Set(['jazz', 'classical_music', 'theater'])
    const wantEvening = when !== 'weekend'
    let ids = Object.keys(venues).filter(id => {
      const v = venues[id]
      if (!v || v.isRestaurant || !v.neighborhood) return false
      if (!inArea(neighborhoodToArea(v.neighborhood))) return false
      const domain = venueCoords[id]?.domain
      return wantEvening ? EVENING_DOMAINS.has(domain) : !EVENING_DOMAINS.has(domain)
    })
    // Prefer venues with coordinates so routing + meal anchoring work well.
    ids.sort((x, y) => (venueCoords[y] ? 1 : 0) - (venueCoords[x] ? 1 : 0))
    if (wantEvening) {
      // ONE evening anchor only. A night is dinner (auto-anchored by the
      // itinerary) + ONE show. Two ticketed showtime venues can't realistically
      // stack — you can't catch a 9:15pm jazz set AND an 11pm concert — and
      // sequencing them produced impossible slots like an 11:25pm Carnegie Hall.
      // The list is already sorted to prefer a venue with coordinates, so the
      // top one is the best single pick for routing + dinner anchoring.
      ids = ids.slice(0, 1)
    } else {
      ids = ids.slice(0, 3)
    }
    // Fallback if the chosen area has none of the right kind.
    if (ids.length < 1) {
      const fb = wantEvening
        ? ['village_vanguard', 'carnegie_hall', 'blue_note', 'apollo_theater_hh', 'smalls']
        : ['moma', 'met', 'guggenheim', 'empire_state']
      ids = fb.filter(id => venues[id]).slice(0, wantEvening ? 1 : 3)
    }

    // Add the picks to saves (non-destructive) so the itinerary can include them.
    const alreadySaved = new Set(Object.values(savedItems || {}).filter(i => i?.type === 'venue').map(i => i.id))
    ids.forEach(id => { if (!alreadySaved.has(id)) toggleSave('venue', id) })

    // Focus the plan on JUST these picks. My Trip builds its itinerary from the
    // plan SELECTION (nyc_plan_sel), not every saved venue — so by setting the
    // selection to only tonight's picks (and marking everything currently saved
    // as "known" so the auto-add effect doesn't re-add the user's other saves),
    // "Plan my night" yields one coherent outing instead of merging the whole
    // saved set into a multi-day daytime plan.
    const allKnown = [...new Set([
      ...Object.values(savedItems || {}).filter(i => i?.type === 'venue' && i.id).map(i => i.id),
      ...ids,
    ])]
    try {
      lsSet('nyc_plan_sel', JSON.stringify(ids))
      lsSet('nyc_plan_known', JSON.stringify(allKnown))
    } catch {}

    const days = when === 'weekend' ? 2 : 1
    const d = new Date()
    if (when === 'weekend') d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7)) // upcoming Saturday (today if Sat)
    try {
      lsSet('nyc_trip_days', JSON.stringify(days))
      lsSet('nyc_trip_start_date', d.toISOString().slice(0, 10))
    } catch {}

    // Open the freshly-built plan in the Full plan view (not the day-of
    // Checklist) — the user asked for a plan to look at, and a "tonight" plan
    // arrives today, which would otherwise default My Trip to the checklist.
    try { lsSet('nyc_plan_open_full', '1') } catch {}

    setPlanNightOpen(false)
    setActiveTab('saved')
  }

  const [venueNotes, setVenueNotesRaw] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_venue_notes') || '{}') } catch { return {} }
  })
  const setVenueNote = React.useCallback((venueId, text) => {
    setVenueNotesRaw(prev => {
      const next = { ...prev, [venueId]: text }
      try { lsSet('nyc_venue_notes', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  // Depth-1 selection for non-Explore tabs
  const [mapSel,       setMapSel]       = useState(null)
  const [mapHighlight, setMapHighlight] = useState(null)
  const [tonightSel,   setTonightSel]   = useState(null)
  const [tonightFull,  setTonightFull]  = useState(null)  // full-page detail opened FROM Tonight (so back returns here)
  const [savedSel,     setSavedSel]     = useState(null)

  // Detail screens in the non-Explore tabs swap views inside the same scrolling
  // document — without a reset, a venue page opened from a scrolled My Trip list
  // inherits that scroll depth and appears "opened at the bottom". Mirror the
  // Explore stack's behavior (its push()/back() already scroll to top).
  useEffect(() => {
    window.scrollTo(0, 0)
    try { document.documentElement.scrollTop = 0; document.body.scrollTop = 0 } catch {}
  }, [savedSel, mapSel, tonightFull])

  function toggleSave(type, id) {
    setSavedItems(prev => {
      const next = { ...prev }
      const key = `${type}:${id}`
      if (next[key]) delete next[key]
      else next[key] = { type, id, savedAt: Date.now() }
      try { lsSet('nyc_saved', JSON.stringify(next)) } catch {}
      return next
    })
  }

  // Adopt a shared trip: merge its stops into saves (non-destructive), copy
  // trip length / start date if present, then land on My Trip.
  function adoptSharedTrip() {
    if (!sharedTrip) return
    setSavedItems(prev => {
      const next = { ...prev }
      ;(sharedTrip.ids || []).forEach(key => {
        const [type, id] = key.split(':')
        if (!type || !id || next[key]) return
        if (type === 'venue'  && !venues[id]) return
        if (type === 'work'   && !works[id]) return
        if (type === 'sight'  && !ALL_SIGHTS[id]) return
        next[key] = { type, id, savedAt: Date.now() }
      })
      try { lsSet('nyc_saved', JSON.stringify(next)) } catch {}
      return next
    })
    try {
      if (sharedTrip.days)  lsSet('nyc_trip_days', JSON.stringify(sharedTrip.days))
      if (sharedTrip.start) lsSet('nyc_trip_start_date', sharedTrip.start)
    } catch {}
    dismissSharedTrip()
    setActiveTab('saved')
  }

  function handleTabPress(tab) {
    if (tab === activeTab) {
      if (tab === 'explore') resetExplore()
      if (tab === 'map')     { setMapSel(null); _mapSchemCache = null }
      if (tab === 'tonight') { setTonightSel(null); setTonightFull(null) }
      if (tab === 'saved')   setSavedSel(null)
    } else {
      // Leaving the Map tab resets its view cache: the cache exists ONLY so
      // "Full details → back" WITHIN the tab restores the neighborhood sheet.
      // Coming back via the tab bar should always land on the default live map.
      if (activeTab === 'map' && tab !== 'map') _mapSchemCache = null
      setActiveTab(tab)
    }
  }

  // Tapping deeper links in Map/Tonight/Saved switches to Explore
  function pushToExplore(entry) {
    push(entry)
    setActiveTab('explore')
  }

  function getExploreNavTitle() {
    switch (current.screen) {
      case 'home':      return 'NYC Stoop'
      case 'domain':    return domains[current.domainId]?.name
      case 'topic':     return topics[current.topicId]?.name
      case 'venueGroup':return domains[current.domainId]?.venueGroups?.[current.groupIndex]?.label
      case 'neighborhood': return current.subAreaName || NEIGHBORHOOD_GROUPS.find(g => g.key === current.neighborhoodKey)?.label || 'Neighborhood'
      case 'sight':     return ALL_SIGHTS[current.sightId]?.name || 'Sight'
      case 'venue':     return venues[current.venueId]?.name
      case 'figure':    return figures[current.figureId]?.name
      case 'work':      return works[current.workId]?.title
      case 'mood':      return moodById?.[current.moodId]?.label || 'Moods'
      case 'eat':       return 'Where to Eat'
      default:          return 'NYC Stoop'
    }
  }

  function topNavProps() {
    if (activeTab === 'explore') {
      return { isHome: current.screen === 'home', canGoBack, onBack: back, title: getExploreNavTitle() }
    }
    if (activeTab === 'map' && mapSel) {
      return { isHome: false, canGoBack: true, onBack: () => setMapSel(null), title: venues[mapSel]?.name || '' }
    }
    // Tonight: the quick detail opens in a bottom sheet (its own dismiss), so no
    // back arrow for that. But "Full details" opens a full page INSIDE the Tonight
    // tab — there the back arrow returns to the Tonight feed (not Explore/home).
    if (activeTab === 'tonight' && tonightFull) {
      const title = tonightFull.screen === 'venue' ? venues[tonightFull.id]?.name : works[tonightFull.id]?.title
      return { isHome: false, canGoBack: true, onBack: () => setTonightFull(null), title: title || '' }
    }
    if (activeTab === 'saved' && savedSel) {
      const { type, id } = savedSel
      const title = type === 'venue' ? venues[id]?.name : type === 'work' ? works[id]?.title : type === 'sight' ? ALL_SIGHTS[id]?.name : figures[id]?.name
      return { isHome: false, canGoBack: true, onBack: () => setSavedSel(null), title: title || '' }
    }
    if (activeTab === 'saved') {
      // Tab root — no TopNav bar, same as every other tab's root (the page has
      // its own "My Trip" wordmark header; the white bar duplicated it).
      return { isHome: true, canGoBack: false, onBack: null, title: '' }
    }
    return { isHome: true, canGoBack: false, onBack: null, title: '' }
  }

  function renderExploreScreen() {
    switch (current.screen) {
      case 'home':      return <HomeScreen push={push} savedItems={savedItems} toggleSave={toggleSave} onSeeAllTonight={() => setActiveTab('tonight')} onOpenSettings={() => setSettingsOpen(true)} onPlanNight={() => setPlanNightOpen(true)} userVenues={userVenues} weather={weather} user={user} />
      case 'domain':    return <DomainScreen domainId={current.domainId} push={push} savedItems={savedItems} />
      case 'topic':     return <TopicScreen topicId={current.topicId} push={push} savedItems={savedItems} />
      case 'venue':     return <VenueScreen venueId={current.venueId} fromTopicId={current.fromTopicId} fromDomainId={current.fromDomainId} push={push} savedItems={savedItems} toggleSave={toggleSave} onViewMap={venueCoords[current.venueId] ? () => { resetExplore(); setMapHighlight(current.venueId); setActiveTab('map') } : null} />
      case 'figure':    return <FigureScreen figureId={current.figureId} push={push} savedItems={savedItems} toggleSave={toggleSave} />
      case 'work':      return <WorkScreen workId={current.workId} push={push} savedItems={savedItems} toggleSave={toggleSave} />
      case 'venueGroup':return <VenueGroupScreen domainId={current.domainId} groupIndex={current.groupIndex} push={push} savedItems={savedItems} />
      case 'neighborhood': return <NeighborhoodScreen neighborhoodKey={current.neighborhoodKey} subAreaName={current.subAreaName} push={push} savedItems={savedItems} userVenues={userVenues} toggleSave={toggleSave} onAddToTrip={addUserVenue} />
      case 'sight':     return <SightScreen sightId={current.sightId} push={push} savedItems={savedItems} toggleSave={toggleSave} />
      case 'mood':      return <MoodFlowScreen moodId={current.moodId} initialActivity={current.activityId || null} push={push} savedItems={savedItems} toggleSave={toggleSave} userVenues={userVenues} onAddPlace={() => setAddPlaceOpen(true)} onAddToTrip={addUserVenue} />
      case 'eat':       return <EatScreen push={push} savedItems={savedItems} userVenues={userVenues} toggleSave={toggleSave} onAddToTrip={addUserVenue} initialLoc={userLoc} />
      default:          return <HomeScreen push={push} savedItems={savedItems} toggleSave={toggleSave} onSeeAllTonight={() => setActiveTab('tonight')} onOpenSettings={() => setSettingsOpen(true)} onPlanNight={() => setPlanNightOpen(true)} userVenues={userVenues} weather={weather} user={user} />
    }
  }

  // Dispatch the active tab's screen
  function renderTabContent() {
    switch (activeTab) {
      case 'explore':
        return renderExploreScreen()

      case 'map':
        if (mapSel) return <VenueScreen venueId={mapSel} fromTopicId={null} fromDomainId={venueCoords[mapSel]?.domain} push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} />
        return <MapScreen onSelectVenue={setMapSel} highlight={mapHighlight} onClearHighlight={() => setMapHighlight(null)} savedItems={savedItems} toggleSave={toggleSave} />

      case 'eat':
        return <EatScreen push={pushToExplore} savedItems={savedItems} userVenues={userVenues} toggleSave={toggleSave} onAddToTrip={addUserVenue} initialLoc={userLoc} />

      case 'tonight': {
        // Every Tonight card — curated venue/work AND live event — opens in the
        // same expandable bottom sheet, so the interaction is consistent and you
        // never lose your place in the feed. Onward navigation (a related venue)
        // closes the sheet and switches to Explore.
        const tonightPush = (entry) => { setTonightSel(null); pushToExplore(entry) }
        // "Full details" opens the deep page WITHIN the Tonight tab (not Explore),
        // so the back arrow returns here to the Tonight feed. Onward links from
        // that page keep navigating within Tonight; anything else goes to Explore.
        const tonightFullPush = (entry) =>
          entry?.screen === 'venue' ? setTonightFull({ screen: 'venue', id: entry.venueId })
          : entry?.screen === 'work' ? setTonightFull({ screen: 'work', id: entry.workId })
          : (setTonightFull(null), pushToExplore(entry))
        if (tonightFull) {
          if (tonightFull.screen === 'venue') return <VenueScreen venueId={tonightFull.id} fromTopicId={null} fromDomainId={null} push={tonightFullPush} savedItems={savedItems} toggleSave={toggleSave} onViewMap={venueCoords[tonightFull.id] ? () => { setTonightFull(null); setMapHighlight(tonightFull.id); setActiveTab('map') } : null} />
          return <WorkScreen workId={tonightFull.id} push={tonightFullPush} savedItems={savedItems} toggleSave={toggleSave} />
        }
        return (
          <>
            <TonightScreen
              savedItems={savedItems}
              toggleSave={toggleSave}
              onViewSaved={() => setActiveTab('saved')}
              onViewMap={() => setActiveTab('map')}
              onNavigate={({ venueId, workId, blurb, event }) => {
                if (event) setTonightSel({ screen: 'event', event })
                else if (venueId) setTonightSel({ screen: 'venue', id: venueId, blurb })
                else if (workId) setTonightSel({ screen: 'work', id: workId, blurb })
              }}
            />
            <BottomSheet open={!!tonightSel} onClose={() => setTonightSel(null)} fit>
              {tonightSel?.screen === 'venue' && <VenueSheet venueId={tonightSel.id} blurb={tonightSel.blurb} savedItems={savedItems} toggleSave={toggleSave} onFullPage={() => { setTonightSel(null); setTonightFull({ screen: 'venue', id: tonightSel.id }) }} />}
              {tonightSel?.screen === 'work' && <WorkScreen workId={tonightSel.id} push={tonightPush} savedItems={savedItems} toggleSave={toggleSave} />}
              {tonightSel?.screen === 'event' && <EventDetail event={tonightSel.event} />}
            </BottomSheet>
          </>
        )
      }

      case 'saved':
        if (savedSel) {
          const { type, id } = savedSel
          if (type === 'venue')  return <VenueScreen venueId={id} fromTopicId={null} fromDomainId={null} push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} onViewMap={venueCoords[id] ? () => { setMapHighlight(id); setActiveTab('map') } : null} />
          if (type === 'work')   return <WorkScreen  workId={id}  push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} />
          if (type === 'figure') return <FigureScreen figureId={id} push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} />
          if (type === 'sight')  return <SightScreen sightId={id} push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} />
        }
        return (
          <PlanErrorBoundary>
            <PlanScreen
              savedItems={savedItems}
              toggleSave={toggleSave}
              onSelectSaved={setSavedSel}
              venueNotes={venueNotes}
              setVenueNote={setVenueNote}
              userVenues={userVenues}
              removeUserVenue={removeUserVenue}
              addUserVenue={addUserVenue}
              addPlaceFromHeader={() => setAddPlaceOpen(true)}
              weather={weather}
              savedPlacesReq={savedPlacesReq}
              onBackToSettings={() => setSettingsOpen(true)}
            />
          </PlanErrorBoundary>
        )

      default:
        return renderExploreScreen()
    }
  }

  // ── Special full-screen routes — bail out before the tab shell ──────────
  if (resetToken) {
    return (
      <div className="app-shell">
        <ResetPasswordScreen
          token={resetToken}
          onSuccess={({ token, user: u }) => { handleSignedIn(token, u); clearResetToken() }}
          onCancel={clearResetToken}
        />
      </div>
    )
  }
  if (sharedTrip) {
    return <SharedTripView trip={sharedTrip} onAdopt={adoptSharedTrip} onDismiss={dismissSharedTrip} />
  }

  const tnp = topNavProps()

  return (
    <div className="app-shell">
      <TopNav title={tnp.title} canGoBack={tnp.canGoBack} onBack={tnp.onBack} isHome={tnp.isHome} />
      <div className="tab-content">
        {renderTabContent()}
      </div>
      <BottomNav
        activeTab={activeTab}
        onTabPress={handleTabPress}
        savedCount={Object.keys(savedItems).length}
        onAddPlace={() => setAddPlaceOpen(true)}
      />
      {/* First-time-user onboarding overlay */}
      {showOnboarding && <OnboardingModal onDismiss={dismissOnboarding} />}
      {/* Add-place modal — user-added venues, kept separate from curated data */}
      {addPlaceOpen && (
        <AddPlaceModal
          onClose={() => setAddPlaceOpen(false)}
          userVenues={userVenues}
          onAdd={(data) => addUserVenue(data)}
          onRemove={(id) => removeUserVenue(id)}
        />
      )}
      {planNightOpen && (
        <PlanNightSheet onClose={() => setPlanNightOpen(false)} onBuild={planNight} />
      )}
      {/* Google Takeout / paste-list bulk import */}
      {importOpen && (
        <ImportTakeoutModal
          onClose={() => setImportOpen(false)}
          onImport={(items) => {
            (items || []).forEach(item => addUserVenue(item))
            setImportOpen(false)
            setActiveTab('saved')
          }}
        />
      )}
      {/* Settings modal — opened from the avatar / menu in the top bar */}
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          user={user}
          onSignedIn={handleSignedIn}
          onSignedOut={handleSignedOut}
          onUserChange={(u) => setUserState(u)}
          onImportTakeout={() => setImportOpen(true)}
          onPrefsChange={onPrefsChange}
          onOpenSavedPlaces={() => { setSettingsOpen(false); setSavedSel(null); setActiveTab('saved'); setSavedPlacesReq(v => v + 1) }}
        />
      )}
    </div>
  )
}