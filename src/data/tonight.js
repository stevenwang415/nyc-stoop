// Each pick has:
//   - timeOfDay: 'evening' | 'late_night' | 'daytime' | 'anytime'
//     drives grouping on the Tonight tab
//   - dateNote: short, time-anchored copy — always starts with a time frame
//     ("Tonight", "Today", "Weekdays", "Game schedule", etc.)
//   - bestDays: array of day numbers (0=Sun…6=Sat) when this pick is on/open.
//     Used by the day-of-week tabs on the This Week screen. If absent, the
//     pick is treated as 7-days-a-week. Listed explicitly when there's a real
//     gap (Broadway dark Mondays, museum closed days, weekday-only sites).
//   - image / imageAlt / imageCredit: hero/thumbnail image
//     All photos sourced from Unsplash (Unsplash license — free for commercial use, no attribution required)
//     Credit string is kept for editorial good practice.
//
// Day-of-week notation we standardize on across editorial code:
//   0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
export const tonightPicks = [
  {
    id: 'pick_vanguard',
    title: "Jazz at the Village Vanguard",
    blurb: "The oldest jazz club in New York still running nightly sets in the same basement that Coltrane, Bill Evans, and Miles Davis called home. Monday nights belong to the Vanguard Jazz Orchestra.",
    domain: 'jazz',
    venueId: 'village_vanguard',
    workId: null,
    timeOfDay: 'evening',
    // Vanguard runs sets every night of the week — explicit so the day-of-week
    // tabs always show it, including the Monday Jazz Orchestra residency.
    bestDays: [0, 1, 2, 3, 4, 5, 6],
    dateNote: "Tonight · Doors 8pm",
    price: '~$40 cover',
    duration: '~75 min',
    image: '/img/vanguard.jpg',
    imageAlt: "The Village Vanguard's iconic red awning and neon sign on Seventh Avenue at night",
    imageCredit: '',
  },
  {
    id: 'pick_moma',
    title: "MoMA's permanent collection",
    blurb: "The fifth floor holds the best modern art in the world under one roof — Starry Night, Les Demoiselles d'Avignon, Monet's Water Lilies — all in a single afternoon.",
    domain: 'visual_art',
    venueId: 'moma',
    workId: null,
    timeOfDay: 'daytime',
    dateNote: "Today · Open until 5:30pm (Fri 8pm)",
    // MoMA is open daily; no bestDays restriction.
    price: '$30',
    duration: '2–4 h',
    image: '/img/moma.jpg',
    imageAlt: "Visitors viewing artwork in MoMA's gallery space",
    imageCredit: 'Photo: Bernd Dittrich / Unsplash',
  },
  {
    id: 'pick_hamilton',
    title: "Hamilton at the Richard Rodgers",
    blurb: "Still the most electrifying score on Broadway. Hip-hop, R&B, and show tunes retell the founding of America through the eyes of immigrants. Book ahead — but the wait is worth it.",
    domain: 'theater',
    venueId: 'richard_rodgers_theatre',
    workId: 'hamilton_2015',
    timeOfDay: 'evening',
    dateNote: "Tue–Sun · 7pm curtain (dark Mondays)",
    // Broadway convention: most shows are dark on Mondays.
    bestDays: [0, 2, 3, 4, 5, 6],
    price: 'From $150',
    duration: '2h 45m',
    image: '/img/hamilton.jpg',
    imageAlt: 'Richard Rodgers Theatre marquee with Hamilton advertisement at dusk',
    imageCredit: 'Photo: Anthony Sebbo / Unsplash',
  },
  {
    id: 'pick_carnegie',
    title: "Carnegie Hall spring season",
    blurb: "The acoustics are why every orchestra in the world wants to play here. Even a weeknight concert in the main hall becomes an occasion. Check the schedule — something is always on.",
    domain: 'classical_music',
    venueId: 'carnegie_hall',
    workId: null,
    timeOfDay: 'evening',
    dateNote: "Tonight · See carnegiehall.org for program",
    price: 'From $30',
    duration: '~2 h',
    image: '/img/carnegie.jpg',
    imageAlt: 'Ornate red and gold concert hall interior',
    imageCredit: 'Photo: Noralí Nayla / Unsplash',
  },
  {
    id: 'pick_high_line',
    title: "High Line at golden hour",
    blurb: "An elevated freight rail turned public park that remade the West Side. The light hits differently in the hour before sunset — bring a coffee and walk the full 1.45 miles.",
    domain: 'architecture',
    venueId: 'high_line',
    workId: null,
    timeOfDay: 'evening',
    dateNote: "Tonight · Free, open until 10pm",
    price: 'Free',
    duration: '~45 min walk',
    image: '/img/highline.jpg',
    imageAlt: 'Preserved freight rail tracks of the High Line park running through Manhattan',
    imageCredit: 'Photo: Paulo Soeiro / Unsplash',
  },
  {
    id: 'pick_yankees',
    title: "Yankees at Yankee Stadium",
    blurb: "The House That Ruth Built's successor — a cathedral of American baseball, seating 47,000 in the Bronx. Even if you don't follow the standings, a game here is a full New York evening: the crowd, the organ, the skyline walk-up view from the upper deck.",
    domain: 'sports',
    venueId: 'yankee_stadium',
    workId: null,
    timeOfDay: 'anytime',
    dateNote: "Game schedule · mlb.com/yankees",
    price: 'From $20',
    duration: '~3 h',
    image: '/img/yankees.jpg',
    imageAlt: 'Yankee Stadium exterior facade',
    imageCredit: 'Photo: Dan Gold / Unsplash',
  },
  {
    id: 'pick_federal_hall',
    title: "Federal Hall & the financial district walk",
    blurb: "Stand on the steps where Washington took the first presidential oath. Then walk three blocks to Fraunces Tavern where he said goodbye to his officers. Lower Manhattan is the densest concentration of American founding history anywhere — and most visitors walk past it to get to the charging bull.",
    domain: 'history',
    venueId: 'federal_hall',
    workId: null,
    timeOfDay: 'daytime',
    dateNote: "Weekdays · 9am–5pm",
    // Federal Hall National Memorial is a weekdays-only NPS site.
    bestDays: [1, 2, 3, 4, 5],
    price: 'Free',
    duration: '~1 h walk',
    image: '/img/federal_hall.jpg',
    imageAlt: 'Statue of George Washington on the steps of Federal Hall in the financial district',
    imageCredit: 'Photo: Daniel Lloyd Blunk-Fernández / Unsplash',
  },
  {
    id: 'pick_met',
    title: "The Met's Egyptian Wing at dusk",
    blurb: "The Metropolitan is the largest art museum in the Western hemisphere. Go straight to the Temple of Dendur — a full Egyptian temple, moved stone by stone from the Nile, now in a glass-walled room facing Central Park. At dusk the light through those windows is extraordinary.",
    domain: 'visual_art',
    venueId: 'met',
    workId: null,
    timeOfDay: 'evening',
    dateNote: "Fri–Sat · Open until 9pm (other days close 5pm)",
    // Met is open daily; the evening-light editorial pick only works on the
    // two nights it stays open late — so for the dusk experience, bias to Fri/Sat.
    bestDays: [5, 6],
    price: '$30',
    duration: '2–4 h',
    image: '/img/met.jpg',
    imageAlt: "Visitors on the iconic stone steps of the Metropolitan Museum of Art's Fifth Avenue entrance",
    imageCredit: 'Photo: Robert Bye / Unsplash',
  },
  {
    id: 'pick_smalls',
    title: "Late night at Smalls Jazz Club",
    blurb: "The room holds about 60 people. The bar is tiny, the musicians are serious, and the late-night jam sessions sometimes run until 4am. This is what jazz looked like before it became an institution — the real thing, still happening in a basement in Greenwich Village.",
    domain: 'jazz',
    venueId: 'smalls',
    workId: null,
    timeOfDay: 'late_night',
    dateNote: "Tonight · Sets from 7:30pm",
    price: '~$25 cover',
    duration: 'Open-ended',
    image: '/img/smalls.jpg',
    imageAlt: "Smalls Jazz Club's red-painted facade and trumpet-logo awning on West 10th Street",
    imageCredit: '',
  },
]
