// ── Moods ─────────────────────────────────────────────────────────────────
// Vibe-based curation, parallel to Tonight picks but organized by what kind of
// day you're having instead of what time it is.
//
// V3 — SHARED ACTIVITY MODEL. Every mood's groups now map onto ONE shared set
// of six activity types, so the "what sounds good?" step speaks the same
// language across moods (an Eat card means the same thing everywhere). A mood
// only shows the activities it actually has picks for, and may give each a
// mood-flavored label. Groups are ordered by ACTIVITY_ORDER below.
//
//   activity  emoji  meaning
//   eat       🍽️     sit-down meals
//   drinks    🍸     bars, cocktails, wine
//   coffee    ☕     cafés, low-key, lingering
//   outdoors  🌳     parks, waterfront, walks
//   culture   🖼️     museums, galleries, landmarks, interiors
//   live      🎭     theater, jazz, concerts, spectacle
//
// Each group: { activity, label, emoji, picks:[ {type:'venue'|'sight', id} ] }
// picks resolve from src/data/content.js (venues) or ALL_SIGHTS in App.jsx.

export const ACTIVITY_ORDER = ['eat', 'drinks', 'coffee', 'outdoors', 'culture', 'live']
export const ACTIVITIES = {
  eat:      { label: 'Eat',     emoji: '🍽️' },
  drinks:   { label: 'Drinks',  emoji: '🍸' },
  coffee:   { label: 'Coffee',  emoji: '☕' },
  outdoors: { label: 'Outdoors',emoji: '🌳' },
  culture:  { label: 'Culture', emoji: '🖼️' },
  live:     { label: 'Live',    emoji: '🎭' },
}

export const moods = [
  {
    id: 'just_chilling',
    label: 'Just chilling',
    emoji: '🌅',
    blurb: "Bring a coffee, take a seat, watch the city breathe. Spots where you don't have to do anything — the view is the activity.",
    heroColor: '#f59e0b',
    groups: [
      {
        activity: 'coffee',
        label: 'Cafés & slow mornings',
        emoji: '☕',
        picks: [
          { type: 'sight', id: 'sight_variety_coffee' },
          { type: 'sight', id: 'sight_brooklyn_roasting_company' },
        ],
      },
      {
        activity: 'outdoors',
        label: 'Parks & waterfront',
        emoji: '🌳',
        picks: [
          { type: 'venue', id: 'high_line' },
          { type: 'venue', id: 'central_park' },
          { type: 'venue', id: 'bryant_park' },
          { type: 'venue', id: 'washington_square_park' },
          { type: 'venue', id: 'battery_park' },
          { type: 'sight', id: 'sight_brooklyn_heights_promenade' },
          { type: 'sight', id: 'sight_domino_park' },
          { type: 'sight', id: 'sight_transmitter_park' },
          { type: 'sight', id: 'sight_prospect_park' },
        ],
      },
      {
        activity: 'culture',
        label: 'Grand interiors',
        emoji: '🖼️',
        picks: [
          { type: 'venue', id: 'nypl_schwarzman' },
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
        activity: 'eat',
        label: 'Dinner spots',
        emoji: '🍽️',
        picks: [
          { type: 'venue', id: 'carbone' },
          { type: 'venue', id: 'don_angie' },
          { type: 'venue', id: 'lilia' },
          { type: 'venue', id: 'peter_luger' },
        ],
      },
      {
        activity: 'drinks',
        label: 'Cocktail bars',
        emoji: '🍸',
        picks: [
          { type: 'venue', id: 'the_campbell' },
          { type: 'venue', id: 'death_and_co' },
        ],
      },
      {
        activity: 'outdoors',
        label: 'Romantic walks',
        emoji: '🌳',
        picks: [
          { type: 'venue', id: 'high_line' },
          { type: 'venue', id: 'brooklyn_bridge_arch' },
          { type: 'sight', id: 'sight_brooklyn_heights_promenade' },
          { type: 'sight', id: 'sight_jane_s_carousel' },
        ],
      },
      {
        activity: 'live',
        label: 'Jazz & concert halls',
        emoji: '🎭',
        picks: [
          { type: 'venue', id: 'village_vanguard' },
          { type: 'venue', id: 'smalls' },
          { type: 'venue', id: 'jazz_lincoln_center' },
          { type: 'venue', id: 'carnegie_hall' },
          { type: 'venue', id: 'met_opera_house' },
          { type: 'venue', id: 'bargemusic' },
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
        activity: 'outdoors',
        label: 'Parks & run-around',
        emoji: '🌳',
        picks: [
          { type: 'venue', id: 'central_park' },
          { type: 'sight', id: 'sight_prospect_park' },
          { type: 'sight', id: 'sight_brooklyn_botanic_garden' },
          { type: 'sight', id: 'sight_brooklyn_bridge_park' },
          { type: 'sight', id: 'sight_jane_s_carousel' },
        ],
      },
      {
        activity: 'culture',
        label: 'Museums & landmarks',
        emoji: '🖼️',
        picks: [
          { type: 'venue', id: 'amnh' },
          { type: 'venue', id: 'met' },
          { type: 'venue', id: 'intrepid_museum' },
          { type: 'venue', id: 'brooklyn' },
          { type: 'venue', id: 'ny_aquarium' },
          { type: 'venue', id: 'brooklyn_childrens_museum' },
          { type: 'venue', id: 'grand_central_terminal' },
          { type: 'venue', id: 'nypl_schwarzman' },
        ],
      },
      {
        activity: 'live',
        label: 'Games & spectacle',
        emoji: '🎭',
        picks: [
          { type: 'venue', id: 'yankee_stadium' },
          { type: 'venue', id: 'citi_field' },
          { type: 'venue', id: 'msg' },
          { type: 'venue', id: 'barclays_center' },
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
    // Indoor-only mood: never offer Outdoors, even though global picks exist.
    excludeActivities: ['outdoors'],
    groups: [
      {
        activity: 'eat',
        label: 'Food halls & pizza',
        emoji: '🍽️',
        picks: [
          { type: 'venue', id: 'chelsea_market' },
          { type: 'venue', id: 'roberta_s_pizza' },
        ],
      },
      {
        activity: 'drinks',
        label: 'Cozy bars',
        emoji: '🍸',
        picks: [
          { type: 'venue', id: 'the_campbell' },
        ],
      },
      {
        activity: 'culture',
        label: 'Museums & history',
        emoji: '🖼️',
        picks: [
          { type: 'venue', id: 'met' },
          { type: 'venue', id: 'moma' },
          { type: 'venue', id: 'guggenheim' },
          { type: 'venue', id: 'whitney' },
          { type: 'venue', id: 'brooklyn' },
          { type: 'venue', id: 'cooper_hewitt' },
          { type: 'venue', id: 'tenement_museum' },
          { type: 'venue', id: 'federal_hall' },
          { type: 'venue', id: 'fraunces_tavern' },
          { type: 'venue', id: 'schomburg_center' },
          { type: 'venue', id: 'one_wtc' },
        ],
      },
      {
        activity: 'live',
        label: 'Concert halls & shows',
        emoji: '🎭',
        picks: [
          { type: 'venue', id: 'carnegie_hall' },
          { type: 'venue', id: 'david_geffen_hall' },
          { type: 'venue', id: 'met_opera_house' },
          { type: 'venue', id: 'public_theater' },
          { type: 'venue', id: 'bargemusic' },
          { type: 'venue', id: 'village_vanguard' },
          { type: 'venue', id: 'smalls' },
          { type: 'venue', id: 'birdland' },
          { type: 'venue', id: 'blue_note' },
          { type: 'venue', id: 'angelika_film_center' },
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
        activity: 'outdoors',
        label: 'Green & walking',
        emoji: '🌳',
        picks: [
          { type: 'venue', id: 'central_park' },
          { type: 'venue', id: 'high_line' },
          { type: 'venue', id: 'brooklyn_bridge_arch' },
          { type: 'venue', id: 'staten_island_ferry_terminal' },
          { type: 'sight', id: 'sight_brooklyn_heights_promenade' },
          { type: 'sight', id: 'sight_jane_s_carousel' },
        ],
      },
      {
        activity: 'culture',
        label: 'Landmarks & museums',
        emoji: '🖼️',
        picks: [
          { type: 'venue', id: 'times_square' },
          { type: 'venue', id: 'empire_state' },
          { type: 'venue', id: 'rockefeller_center' },
          { type: 'venue', id: 'one_wtc' },
          { type: 'venue', id: 'chrysler_building' },
          { type: 'venue', id: 'statue_of_liberty' },
          { type: 'venue', id: 'ellis_island' },
          { type: 'venue', id: 'federal_hall' },
          { type: 'venue', id: 'stonewall_inn' },
          { type: 'venue', id: 'met' },
          { type: 'venue', id: 'moma' },
          { type: 'venue', id: 'amnh' },
          { type: 'venue', id: 'guggenheim' },
          { type: 'venue', id: 'whitney' },
          { type: 'venue', id: 'grand_central_terminal' },
          { type: 'venue', id: 'nypl_schwarzman' },
          { type: 'venue', id: 'st_patricks' },
        ],
      },
      {
        activity: 'live',
        label: 'Broadway shows',
        emoji: '🎭',
        picks: [
          { type: 'venue', id: 'richard_rodgers_theatre' },
          { type: 'venue', id: 'majestic_theatre' },
          { type: 'venue', id: 'shubert_theatre' },
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
