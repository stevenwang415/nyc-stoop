// ── Moods ─────────────────────────────────────────────────────────────────
// Vibe-based curation, parallel to Tonight picks but organized by what kind of
// day you're having instead of what time it is.
//
// Each mood has GROUPS (sub-categories) so users can scan by intent —
// "I want a date-night walk" vs "I want a date-night bar" vs "I want a
// date-night jazz club". Inside each group, picks are either:
//   { type: 'venue', id: 'high_line' }     → looked up from src/data/content.js
//   { type: 'sight', id: 'sight_…' }       → looked up from ALL_SIGHTS in App.jsx
//
// V2 update (post-user-walkthrough): each mood was reviewed for missing canonical
// picks and category misfires. Notes inline on what changed where.

export const moods = [
  {
    id: 'just_chilling',
    label: 'Just chilling',
    emoji: '🌅',
    blurb: "Bring a coffee, take a seat, watch the city breathe. Spots where you don't have to do anything — the view is the activity.",
    heroColor: '#f59e0b',
    groups: [
      {
        label: 'Waterfront views',
        emoji: '🌊',
        picks: [
          { type: 'venue', id: 'high_line' },
          { type: 'sight', id: 'sight_brooklyn_heights_promenade' },
          { type: 'sight', id: 'sight_domino_park' },
          { type: 'sight', id: 'sight_transmitter_park' },
          { type: 'venue', id: 'battery_park' },
        ],
      },
      {
        label: 'City parks',
        emoji: '🌳',
        picks: [
          // Added Central Park (was missing from this mood entirely — obvious chill spot)
          { type: 'venue', id: 'central_park' },
          { type: 'venue', id: 'bryant_park' },
          { type: 'venue', id: 'washington_square_park' },
          { type: 'sight', id: 'sight_prospect_park' },
        ],
      },
      {
        label: 'Cafés + libraries',
        emoji: '☕',
        // Renamed from "Quiet escapes". Brooklyn Brewery removed (taproom isn't quiet);
        // section now focused on the actual chill-with-a-book spots.
        picks: [
          { type: 'venue', id: 'nypl_schwarzman' },
          { type: 'sight', id: 'sight_variety_coffee' },
          { type: 'sight', id: 'sight_brooklyn_roasting_company' },
        ],
      },
    ],
  },
  {
    id: 'date_night',
    label: 'Date night',
    emoji: '🌃',
    blurb: 'Dinner first, then the rest. Restaurants, cocktail bars, jazz basements, romantic walks. The city does romance better than anyone admits.',
    heroColor: '#7c3aed',
    groups: [
      {
        // NEW group — biggest user-feedback gap was "no restaurants for date night"
        // Added Brooklyn picks (Lilia, Peter Luger) so the date-night map
        // doesn't look Manhattan-only.
        label: 'Dinner spots',
        emoji: '🍝',
        picks: [
          { type: 'venue', id: 'carbone' },
          { type: 'venue', id: 'don_angie' },
          { type: 'venue', id: 'lilia' },
          { type: 'venue', id: 'peter_luger' },
        ],
      },
      {
        // Trimmed from 5 → 3. Blue Note + Birdland moved to Rainy Day to reduce
        // the "5 jazz clubs in a row feels like the same recommendation" feel.
        label: 'Live jazz',
        emoji: '🎷',
        picks: [
          { type: 'venue', id: 'village_vanguard' },
          { type: 'venue', id: 'smalls' },
          { type: 'venue', id: 'jazz_lincoln_center' },
        ],
      },
      {
        label: 'Concert halls',
        emoji: '🎼',
        picks: [
          { type: 'venue', id: 'carnegie_hall' },
          { type: 'venue', id: 'met_opera_house' },
          { type: 'venue', id: 'bargemusic' },
        ],
      },
      {
        // Expanded from 2 → 2 (Death & Co added; Stonewall moved to First Time → American history
        // where it actually belongs as a landmark, not a generic date bar)
        label: 'Cocktail bars',
        emoji: '🍷',
        picks: [
          { type: 'venue', id: 'the_campbell' },
          { type: 'venue', id: 'death_and_co' },
        ],
      },
      {
        label: 'Romantic walks',
        emoji: '🚶',
        picks: [
          { type: 'venue', id: 'high_line' },
          { type: 'venue', id: 'brooklyn_bridge_arch' },
          { type: 'sight', id: 'sight_brooklyn_heights_promenade' },
        ],
      },
      {
        // Delacorte removed (summer-only Shakespeare in the Park — not a year-round date option)
        label: 'Quirky charm',
        emoji: '🎠',
        picks: [
          { type: 'sight', id: 'sight_jane_s_carousel' },
        ],
      },
    ],
  },
  {
    id: 'family_day',
    label: 'Family day',
    emoji: '👨‍👩‍👧',
    blurb: 'Museums kids actually like, parks with room to run, baseball games, dinosaurs, an aquarium by the sea.',
    heroColor: '#059669',
    groups: [
      {
        // Cooper Hewitt removed (design museum, over kids' heads).
        // Met ADDED — was the most glaring omission from Family Day (Egyptian wing, Costume Institute, Arms & Armor are all kid magnets).
        label: 'Big museums',
        emoji: '🦕',
        picks: [
          { type: 'venue', id: 'amnh' },
          { type: 'venue', id: 'met' },
          { type: 'venue', id: 'intrepid_museum' },
          { type: 'venue', id: 'brooklyn' },
        ],
      },
      {
        // NEW group built out from 1 → 3 picks. Active fun was the weakest group; now it has real content.
        label: 'Active fun',
        emoji: '🎢',
        picks: [
          { type: 'venue', id: 'ny_aquarium' },
          { type: 'venue', id: 'brooklyn_childrens_museum' },
          { type: 'sight', id: 'sight_jane_s_carousel' },
        ],
      },
      {
        label: 'Parks + run-around',
        emoji: '🌳',
        picks: [
          { type: 'venue', id: 'central_park' },
          { type: 'sight', id: 'sight_prospect_park' },
          { type: 'sight', id: 'sight_brooklyn_botanic_garden' },
          { type: 'sight', id: 'sight_brooklyn_bridge_park' },
        ],
      },
      {
        label: 'Sports + spectacle',
        emoji: '⚾',
        picks: [
          { type: 'venue', id: 'yankee_stadium' },
          { type: 'venue', id: 'citi_field' },
          { type: 'venue', id: 'msg' },
          { type: 'venue', id: 'barclays_center' },
        ],
      },
      {
        label: 'Iconic interiors',
        emoji: '🏛',
        picks: [
          { type: 'venue', id: 'grand_central_terminal' },
          { type: 'venue', id: 'nypl_schwarzman' },
        ],
      },
    ],
  },
  {
    id: 'rainy_day',
    label: 'Rainy day',
    emoji: '🌧️',
    blurb: "Indoor-only picks for when the weather's against you. Museums, food halls, basement jazz, movies — no umbrella required.",
    heroColor: '#0369a1',
    groups: [
      {
        // Brooklyn Museum ADDED (was inexplicably in Family but not Rainy)
        label: 'Big museums',
        emoji: '🖼',
        picks: [
          { type: 'venue', id: 'met' },
          { type: 'venue', id: 'moma' },
          { type: 'venue', id: 'guggenheim' },
          { type: 'venue', id: 'whitney' },
          { type: 'venue', id: 'brooklyn' },
          { type: 'venue', id: 'cooper_hewitt' },
        ],
      },
      {
        // NEW group — the canonical NYC rainy-day move is "Chelsea Market then a movie"
        // + Roberta's Bushwick gives the Brooklyn map something to land on.
        label: 'Food halls + pizza',
        emoji: '🍿',
        picks: [
          { type: 'venue', id: 'chelsea_market' },
          { type: 'venue', id: 'angelika_film_center' },
          { type: 'venue', id: 'roberta_s_pizza' },
        ],
      },
      {
        // Bargemusic added — Brooklyn classical inside a moored barge in DUMBO,
        // perfect indoor-rainy alternative to the Lincoln Center halls.
        label: 'Halls + shows',
        emoji: '🎟',
        picks: [
          { type: 'venue', id: 'carnegie_hall' },
          { type: 'venue', id: 'david_geffen_hall' },
          { type: 'venue', id: 'met_opera_house' },
          { type: 'venue', id: 'public_theater' },
          { type: 'venue', id: 'bargemusic' },
        ],
      },
      {
        // Blue Note + Birdland added (moved from Date Night where they were saturating the jazz group)
        label: 'Underground jazz',
        emoji: '🎷',
        picks: [
          { type: 'venue', id: 'village_vanguard' },
          { type: 'venue', id: 'smalls' },
          { type: 'venue', id: 'birdland' },
          { type: 'venue', id: 'blue_note' },
        ],
      },
      {
        label: 'History museums',
        emoji: '📜',
        picks: [
          { type: 'venue', id: 'tenement_museum' },
          { type: 'venue', id: 'federal_hall' },
          { type: 'venue', id: 'fraunces_tavern' },
          { type: 'venue', id: 'schomburg_center' },
        ],
      },
      {
        // ESB observatory REMOVED (no visibility in rain — $40 to stand in clouds)
        label: 'Indoor landmarks',
        emoji: '🏛',
        picks: [
          { type: 'venue', id: 'one_wtc' },
          { type: 'venue', id: 'the_campbell' },
        ],
      },
    ],
  },
  {
    id: 'first_time_nyc',
    label: 'First time in NYC',
    emoji: '🗽',
    blurb: 'The canonical hits. Yes some are touristy. They\'re touristy because they\'re great. Hit these once, then go find the rest.',
    heroColor: '#dc2626',
    groups: [
      {
        // Times Square ADDED — first-timer staple; editorial snobbery to pretend it doesn't exist
        label: 'Iconic Manhattan',
        emoji: '🌆',
        picks: [
          { type: 'venue', id: 'times_square' },
          { type: 'venue', id: 'empire_state' },
          { type: 'venue', id: 'rockefeller_center' },
          { type: 'venue', id: 'one_wtc' },
          { type: 'venue', id: 'chrysler_building' },
        ],
      },
      {
        // Statue of Liberty ADDED as own pick (was bizarrely missing despite Ellis being listed)
        // Stonewall Inn MOVED here from Date Night (it's a historic landmark, not a generic date bar)
        label: 'American history',
        emoji: '🗽',
        picks: [
          { type: 'venue', id: 'statue_of_liberty' },
          { type: 'venue', id: 'staten_island_ferry_terminal' },
          { type: 'venue', id: 'ellis_island' },
          { type: 'venue', id: 'federal_hall' },
          { type: 'venue', id: 'stonewall_inn' },
        ],
      },
      {
        // Expanded from 3 → 5 (Whitney + Guggenheim added — first-timers usually do them all)
        label: 'Must-see museums',
        emoji: '🖼',
        picks: [
          { type: 'venue', id: 'met' },
          { type: 'venue', id: 'moma' },
          { type: 'venue', id: 'amnh' },
          { type: 'venue', id: 'guggenheim' },
          { type: 'venue', id: 'whitney' },
        ],
      },
      {
        label: 'Iconic interiors',
        emoji: '🏛',
        picks: [
          { type: 'venue', id: 'grand_central_terminal' },
          { type: 'venue', id: 'nypl_schwarzman' },
          { type: 'venue', id: 'st_patricks' },
        ],
      },
      {
        // NEW group — Broadway is a canonical first-time experience.
        // Three theaters that consistently have major shows running.
        label: 'See a Broadway show',
        emoji: '🎭',
        picks: [
          { type: 'venue', id: 'richard_rodgers_theatre' },
          { type: 'venue', id: 'majestic_theatre' },
          { type: 'venue', id: 'shubert_theatre' },
        ],
      },
      {
        // Added Jane's Carousel + Brooklyn Heights Promenade so first-timers
        // get the canonical Brooklyn walk paired with the bridge — no first
        // NYC trip is complete without crossing into DUMBO at golden hour.
        label: 'Green + walking',
        emoji: '🌳',
        picks: [
          { type: 'venue', id: 'central_park' },
          { type: 'venue', id: 'high_line' },
          { type: 'venue', id: 'brooklyn_bridge_arch' },
          { type: 'sight', id: 'sight_brooklyn_heights_promenade' },
          { type: 'sight', id: 'sight_jane_s_carousel' },
        ],
      },
    ],
  },
]

export const moodById = Object.fromEntries(moods.map(m => [m.id, m]))

// Flatten helper for places that want a simple pick list (e.g., the mood-card
// pick-count badge on Home). Concatenates every group's picks in order.
export function flattenMoodPicks(mood) {
  return (mood?.groups || []).flatMap(g => g.picks)
}
