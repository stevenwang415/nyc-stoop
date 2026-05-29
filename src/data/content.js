export const venues = {
  moma: {
    id: 'moma',
    name: `MoMA`,
    fullName: 'Museum of Modern Art',
    neighborhood: 'Midtown',
    address: '11 W 53rd St, New York, NY 10019',
    hours: 'Sat–Thu 10:30am–5:30pm · Fri 10:30am–8pm',
    ticketUrl: 'https://www.moma.org/visit/',
    scheduleUrl: 'https://www.moma.org/calendar/',
    mapUrl: 'https://maps.google.com/?q=Museum+of+Modern+Art+New+York',
    color: '#e8f0fe',
    accentColor: '#1a56db',
    description: `Home to one of the world's greatest collections of modern and contemporary art. Its Post-Impressionist holdings are unmatched anywhere in the Western Hemisphere.`,
    character: `MoMA holds The Starry Night. That fact alone would justify the museum's existence. But MoMA is also the institutional home of modern art — the place that legitimized Picasso, Matisse, and the Abstract Expressionists when the rest of American culture hadn't caught up. Every major movement in 20th-century art either exists here or failed to get here. The fifth floor is where to start: Post-Impressionism and early modernism, room after room, culminating in Starry Night at the end of the first gallery.`,
    specialties: ['Post-Impressionism', 'Cubism', 'Abstract Expressionism', 'Contemporary Art'],
    admissionCost: `$30 adults · Under 16 free`,
    visitDuration: `2–3 hours`,
    bookingNote: `Book online to guarantee entry and skip the line`,
    familyFriendly: true,
    insiderTip: `Come Friday evening — open until 8pm with notably thinner crowds than weekend afternoons.`,
  },
  met: {
    id: 'met',
    name: `The Met`,
    fullName: 'Metropolitan Museum of Art',
    neighborhood: 'Upper East Side',
    address: '1000 Fifth Ave, New York, NY 10028',
    hours: 'Sun–Thu 10am–5pm · Fri–Sat 10am–9pm',
    ticketUrl: 'https://www.metmuseum.org/visit',
    scheduleUrl: 'https://www.metmuseum.org/events',
    mapUrl: 'https://maps.google.com/?q=Metropolitan+Museum+of+Art+New+York',
    color: '#fef3c7',
    accentColor: '#d97706',
    description: `One of the largest and finest art museums in the world. Its European Paintings galleries on the second floor hold an extraordinary concentration of Impressionist and Post-Impressionist work.`,
    character: `The Met is encyclopedic in the truest sense: five thousand years of human art-making in one building on Fifth Avenue. The second floor European Paintings galleries are the destination for Impressionism and Post-Impressionism — Monet, Cézanne, Seurat, and a collection that rivals the Musée d'Orsay. The American Wing holds the finest concentration of American Modernism anywhere. Budget at least two hours; the building alone rewards it.`,
    specialties: ['Impressionism', 'Post-Impressionism', 'American Modernism', 'Cubism', 'European Masters'],
    admissionCost: `Pay what you wish (suggested $30)`,
    visitDuration: `2–4 hours`,
    bookingNote: `Walk-in OK; online tickets skip the entrance queue`,
    familyFriendly: true,
    insiderTip: `Arrive at 10am on a weekday — the second-floor European Paintings galleries are nearly empty in the first hour, and you can stand alone in front of Van Gogh and Cézanne.`,
  },
  guggenheim: {
    id: 'guggenheim',
    name: `Guggenheim`,
    fullName: 'Solomon R. Guggenheim Museum',
    neighborhood: 'Upper East Side',
    address: '1071 Fifth Ave, New York, NY 10128',
    hours: 'Sun–Wed, Fri 11am–6pm · Sat 11am–8pm · Closed Thu',
    ticketUrl: 'https://www.guggenheim.org/plan-your-visit',
    scheduleUrl: 'https://www.guggenheim.org/exhibitions',
    mapUrl: 'https://maps.google.com/?q=Guggenheim+Museum+New+York',
    color: '#fce7f3',
    accentColor: '#db2777',
    description: `Frank Lloyd Wright's iconic spiral is itself a work of art. The permanent collection includes key Post-Impressionist and early modern works.`,
    character: `Frank Lloyd Wright's building is the rarest thing in New York: a structure that genuinely competes with its contents for attention. The spiral ramp creates an unbroken journey from ground to skylight — you walk the collection rather than moving room to room. The permanent collection skews toward Cubism, Kandinsky, and early abstraction. Van Gogh's Mountains at Saint-Rémy hangs in the permanent galleries. The building itself is the reason to come even if you knew nothing about the art.`,
    specialties: ['Cubism', 'Post-Impressionism', 'Abstract Art', 'Contemporary Art'],
    admissionCost: `$30 adults · $18 seniors · Under 12 free`,
    visitDuration: `1.5–2 hours`,
    bookingNote: `Book online recommended; closed Thursdays`,
    familyFriendly: true,
    insiderTip: `Take the elevator to the top and walk down the spiral ramp — you see the collection in reverse chronological order, ending in the oldest work at street level.`,
  },
  whitney: {
    id: 'whitney',
    name: `Whitney`,
    fullName: 'Whitney Museum of American Art',
    neighborhood: 'Meatpacking District',
    address: '99 Gansevoort St, New York, NY 10014',
    hours: 'Mon, Wed–Thu 10:30am–6pm · Fri 10:30am–10pm · Sat–Sun 10:30am–6pm · Closed Tue',
    ticketUrl: 'https://whitney.org/visit/',
    scheduleUrl: 'https://whitney.org/exhibitions/',
    mapUrl: 'https://maps.google.com/?q=Whitney+Museum+of+American+Art+New+York',
    color: '#ecfdf5',
    accentColor: '#059669',
    description: `The premier museum of American art, housed in Renzo Piano's striking building at the edge of the Hudson.`,
    character: `The Whitney is the only major museum whose entire permanent collection is defined by a single national tradition: American art from the 20th century to the present. Hopper's Nighthawks. Calder's mobiles. Basquiat. Kara Walker. The downtown Renzo Piano building, with outdoor terraces overlooking the High Line and the Hudson River, is itself one of the best experiences in the city. The annual Whitney Biennial — a survey of contemporary American art — is the most argued-about art event in the country.`,
    specialties: ['American Modernism', 'Abstract Expressionism', 'Contemporary American Art'],
    admissionCost: `$30 adults · $22 seniors · Under 18 free`,
    visitDuration: `2 hours`,
    bookingNote: `Walk-in OK; book online on busy weekends`,
    familyFriendly: true,
    insiderTip: `The outdoor terraces (floors 3, 5, and 8) are free once you are inside — the High Line and Hudson River views from the 8th floor are among the best in lower Manhattan.`,
  },
  brooklyn: {
    id: 'brooklyn',
    name: `Brooklyn Museum`,
    fullName: 'Brooklyn Museum',
    neighborhood: 'Crown Heights, Brooklyn',
    address: '200 Eastern Pkwy, Brooklyn, NY 11238',
    hours: 'Wed–Sun 11am–6pm · First Sat of month 11am–11pm · Closed Mon–Tue',
    ticketUrl: 'https://www.brooklynmuseum.org/visit',
    scheduleUrl: 'https://www.brooklynmuseum.org/exhibitions',
    mapUrl: 'https://maps.google.com/?q=Brooklyn+Museum+New+York',
    color: '#ede9fe',
    accentColor: '#7c3aed',
    description: `The second-largest art museum in New York, with an encyclopedic collection spanning five thousand years. Its European painting and print collections hold Impressionist and Post-Impressionist gems.`,
    character: `The Brooklyn Museum is chronically underestimated because it exists in a borough instead of on Fifth Avenue. That is a mistake. Its European painting collection holds genuinely significant Impressionist and Post-Impressionist work — Degas pastels, Cassatt prints, Pissarro oils. Its American art holdings are outstanding. And its Egyptian collection rivals any in the country outside the Met. The First Saturday monthly event (free, open until 11pm) is one of the best-attended cultural nights in New York.`,
    specialties: ['Impressionism', 'Post-Impressionism', 'American Modernism', 'Egyptian Art'],
    admissionCost: `Pay what you wish (suggested $20) · Free First Saturdays`,
    visitDuration: `2–3 hours`,
    bookingNote: `Walk-in OK; First Saturday is free but can be crowded`,
    familyFriendly: true,
    insiderTip: `The First Saturday of every month is free and open until 11pm — the most lively cultural evening in Brooklyn.`,
  },
  cooper_hewitt: {
    id: 'cooper_hewitt',
    name: `Cooper Hewitt`,
    fullName: 'Cooper Hewitt, Smithsonian Design Museum',
    neighborhood: 'Upper East Side',
    address: '2 E 91st St, New York, NY 10128',
    hours: 'Sun–Fri 10am–6pm · Sat 10am–9pm',
    ticketUrl: 'https://www.cooperhewitt.org/visit/',
    scheduleUrl: 'https://www.cooperhewitt.org/events/',
    mapUrl: 'https://maps.google.com/?q=Cooper+Hewitt+Smithsonian+Design+Museum+New+York',
    color: '#fff7ed',
    accentColor: '#ea580c',
    description: `America's only museum dedicated to design, housed in the landmark Carnegie Mansion. Its print and drawing collection includes Impressionist-era works on paper.`,
    character: `America's only design museum occupies Andrew Carnegie's former mansion on Museum Mile. The interactive pen you pick up at the door lets you collect and project designs throughout the building — a design experience built into the visit itself. The print and drawing collection includes Cassatt drypoints and Toulouse-Lautrec lithographs that belong equally to fine art and applied design. The mansion's rooms are worth seeing even before you reach the collection.`,
    specialties: ['Design', 'Works on Paper', 'Applied Arts', 'Impressionism Prints'],
    admissionCost: `$22 adults · $15 seniors · Under 18 free`,
    visitDuration: `1.5 hours`,
    bookingNote: `Walk-in OK; online tickets available`,
    familyFriendly: true,
    insiderTip: `Pick up the interactive pen at the entrance — you can collect and project any design in the museum onto the large interactive tables to remix it.`,
  },

  village_vanguard: {
    id: 'village_vanguard',
    name: `Village Vanguard`,
    fullName: 'Village Vanguard',
    neighborhood: 'Greenwich Village',
    address: '178 7th Ave S, New York, NY 10014',
    hours: 'Nightly · Sets at 8pm and 10pm · Mon Jazz Orchestra at 8pm',
    ticketUrl: 'https://villagevanguard.com/',
    scheduleUrl: 'https://villagevanguard.com/',
    mapUrl: 'https://maps.google.com/?q=Village+Vanguard+New+York',
    color: '#e0f2fe',
    accentColor: '#0369a1',
    description: `The most important jazz club in the world. Since 1935, every major jazz musician has played this wedge-shaped basement on 7th Avenue.`,
    character: `Since 1935, the Village Vanguard has been the most important jazz club in the world — not the largest, not the most glamorous, but the one where the music has been most consistently serious. Coltrane recorded Live at the Village Vanguard here. Miles Davis played here. Bill Evans recorded Sunday at the Village Vanguard here. Sonny Rollins returned from his famous Williamsburg Bridge sabbatical to record here. The room holds 123 people. Monday nights have belonged to the Vanguard Jazz Orchestra without interruption since 1966. It is the place.`,
    specialties: ['Jazz', 'Monday Night Jazz Orchestra', 'Historic Live Recordings'],
    figureIds: ['coltrane', 'bill_evans', 'miles_davis', 'monk', 'sonny_rollins'],

    admissionCost: `$30–$35 cover + $20 food/drink minimum`,
    visitDuration: `2 hours per set`,
    bookingNote: `Reserve online — popular shows sell out fast`,
    familyFriendly: false,
    insiderTip: `Monday nights belong to the Vanguard Jazz Orchestra — the most important weekly jazz event in New York, uninterrupted since 1966.`,
    priceNote: `$30–$35 cover + $20 food/drink minimum`,
    bestNight: `Monday Jazz Orchestra`,
    weeklySchedule: [
      { day: 'Monday',    time: '8:30pm',  performer: 'Vanguard Jazz Orchestra', isAnchor: true,  note: 'Every Monday since 1966 — the longest-running jazz engagement in the world' },
      { day: 'Monday',    time: '10:30pm', performer: 'Vanguard Jazz Orchestra', isAnchor: true,  note: 'Late set' },
      { day: 'Tuesday',   time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Booking changes weekly — check website' },
      { day: 'Tuesday',   time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Wednesday', time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Booking changes weekly — check website' },
      { day: 'Wednesday', time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Thursday',  time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Booking changes weekly — check website' },
      { day: 'Thursday',  time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Friday',    time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Weekend residency — check website' },
      { day: 'Friday',    time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Saturday',  time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Weekend residency — check website' },
      { day: 'Saturday',  time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Sunday',    time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Booking changes weekly — check website' },
      { day: 'Sunday',    time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
    ],
  },
  blue_note: {
    id: 'blue_note',
    name: `Blue Note`,
    fullName: 'Blue Note Jazz Club',
    neighborhood: 'Greenwich Village',
    address: '131 W 3rd St, New York, NY 10012',
    hours: 'Daily · Sets at 8pm and 10:30pm · Late show Fri–Sat at 12:30am',
    ticketUrl: 'https://www.bluenotejazz.com/',
    scheduleUrl: 'https://www.bluenotejazz.com/',
    mapUrl: 'https://maps.google.com/?q=Blue+Note+Jazz+Club+New+York',
    color: '#fef9c3',
    accentColor: '#854d0e',
    description: `Named for the legendary record label that defined hard bop, the Blue Note club has been a Greenwich Village institution since 1981.`,
    character: `The Blue Note takes its name from the record label that defined hard bop — Blue Note Records, which documented Art Blakey, Horace Silver, and Thelonious Monk through the 1950s and 1960s. The club, open since 1981, honors that legacy by booking the full range of jazz royalty on an ongoing basis. Keith Jarrett recorded Standards Live here in 1994. The room is intimate, the sightlines excellent, and the programming is the most accessible of the major jazz clubs — a natural starting point if you're new to hearing jazz live.`,
    specialties: ['Jazz', 'Post-Bop', 'Late Shows', 'Accessible for Newcomers'],
    figureIds: ['miles_davis', 'art_blakey', 'horace_silver', 'clifford_brown', 'wayne_shorter'],

    admissionCost: `$30–$45 cover + $10 food/drink minimum`,
    visitDuration: `2 hours per set`,
    bookingNote: `Book online — popular acts sell out weeks ahead`,
    familyFriendly: false,
    insiderTip: `The late show on Friday and Saturday (12:30am) often features younger, more adventurous programming than the main evening sets.`,
    priceNote: `$30–$45 cover + $10 food/drink minimum`,
    bestNight: `Friday/Saturday Late Show (12:30am)`,
    weeklySchedule: [
      { day: 'Monday',    time: '8pm',     performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Monday',    time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Tuesday',   time: '8pm',     performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Tuesday',   time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Wednesday', time: '8pm',     performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Wednesday', time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Thursday',  time: '8pm',     performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Thursday',  time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Friday',    time: '8pm',     performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Friday',    time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Friday',    time: '12:30am', performer: 'Late show',               isAnchor: false, note: 'Late-night set — strictly for night owls' },
      { day: 'Saturday',  time: '8pm',     performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Saturday',  time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Saturday',  time: '12:30am', performer: 'Late show',               isAnchor: false, note: 'Late-night set' },
      { day: 'Sunday',    time: '8pm',     performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Sunday',    time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
    ],

  },
  birdland: {
    id: 'birdland',
    name: `Birdland`,
    fullName: 'Birdland Jazz Club',
    neighborhood: 'Midtown West',
    address: '315 W 44th St, New York, NY 10036',
    hours: 'Sun–Thu 5pm–1am · Fri–Sat 5pm–2am · Sets at 8:30pm nightly',
    ticketUrl: 'https://www.birdlandjazz.com/calendar',
    scheduleUrl: 'https://www.birdlandjazz.com/calendar',
    mapUrl: 'https://maps.google.com/?q=Birdland+Jazz+Club+New+York',
    color: '#fce7f3',
    accentColor: '#9d174d',
    description: `Named for Charlie 'Bird' Parker, the original Birdland opened in 1949 and became the center of the bebop universe.`,
    character: `Named for Charlie "Bird" Parker, the original Birdland at Broadway and 52nd Street opened in 1949 and became the center of the bebop universe before closing in 1965. The current club has carried the name and tradition forward since 1996. Monday nights belong to the Birdland Big Band, a 17-piece orchestra that brings the big band tradition into the present. The room is more theatrical than the Village Vanguard — a proper stage with lighting — and the programming ranges from bebop revival to contemporary jazz.`,
    specialties: ['Jazz', 'Big Band', 'Bebop Legacy', 'Monday Big Band Night'],
    figureIds: ['parker', 'gillespie', 'monk', 'bud_powell', 'max_roach'],

    admissionCost: `$30–$40 cover + $20 food/drink minimum`,
    visitDuration: `2 hours per set`,
    bookingNote: `Walk-in possible but reserve to guarantee a seat`,
    familyFriendly: false,
    insiderTip: `Monday nights bring the 17-piece Birdland Big Band at 8:30pm — the most swinging regular event in New York jazz.`,
    priceNote: `$30–$40 cover + $20 food/drink minimum`,
    bestNight: `Monday Big Band Night`,
    weeklySchedule: [
      { day: 'Monday',    time: '8:30pm',  performer: 'Birdland Big Band',       isAnchor: true,  note: '17-piece orchestra — the most swinging regular event in New York jazz' },
      { day: 'Tuesday',   time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Tuesday',   time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Wednesday', time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Wednesday', time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Thursday',  time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Thursday',  time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Friday',    time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Friday',    time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Saturday',  time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Saturday',  time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
      { day: 'Sunday',    time: '8:30pm',  performer: 'Featured artist',         isAnchor: false, note: 'Check website for current booking' },
      { day: 'Sunday',    time: '10:30pm', performer: 'Featured artist',         isAnchor: false },
    ],
  },
  jazz_lincoln_center: {
    id: 'jazz_lincoln_center',
    name: `Jazz at Lincoln Center`,
    fullName: 'Jazz at Lincoln Center',
    neighborhood: 'Columbus Circle',
    address: '10 Columbus Circle, New York, NY 10019',
    hours: 'See website for performance schedule',
    ticketUrl: 'https://jazz.org/',
    scheduleUrl: 'https://jazz.org/visit/',
    mapUrl: 'https://maps.google.com/?q=Jazz+at+Lincoln+Center+New+York',
    color: '#f0fdf4',
    accentColor: '#15803d',
    description: `Wynton Marsalis built Jazz at Lincoln Center into the preeminent jazz institution in America, with three performance spaces and a full-time orchestra.`,
    character: `Wynton Marsalis built Jazz at Lincoln Center into the most powerful jazz institution in America over three decades: three performance spaces, a full-time orchestra, a commissioning program, and a mission to treat jazz with the same institutional seriousness as classical music. The Rose Theater (1,233 seats) and the Appel Room (with floor-to-ceiling windows overlooking Central Park) host the Jazz at Lincoln Center Orchestra and a full calendar of visiting artists. The argument about whether this is good for jazz is long and unresolved. The music is uniformly excellent.`,
    specialties: ['Jazz', 'Lincoln Center Jazz Orchestra', 'Concert Jazz', 'Jazz Education'],
    figureIds: ['wynton_marsalis', 'roy_hargrove', 'brad_mehldau', 'herbie_hancock', 'keith_jarrett'],

    admissionCost: `$35–$150+ depending on show`,
    visitDuration: `2–2.5 hours`,
    bookingNote: `Book online in advance; Wynton Marsalis shows sell out`,
    familyFriendly: true,
    insiderTip: `Seats in the Appel Room face floor-to-ceiling windows overlooking Central Park — the most spectacular concert backdrop in the city.`,
    priceNote: `$35–$150+`,
    bestNight: `Any Jazz at Lincoln Center Orchestra night`,
    weeklySchedule: [
      { day: 'Thursday',  time: '7:30pm',  performer: 'Featured ensemble',       isAnchor: false, note: "Rose Theater or Dizzy's Club · Check jazz.org" },
      { day: 'Friday',    time: '7:30pm',  performer: 'Featured ensemble',       isAnchor: false, note: 'Check jazz.org for current booking' },
      { day: 'Friday',    time: '11pm',    performer: "Late-night at Dizzy's",  isAnchor: false, note: "Dizzy's Club — more intimate late set with Manhattan skyline view" },
      { day: 'Saturday',  time: '7:30pm',  performer: 'Featured ensemble',       isAnchor: false, note: 'Check jazz.org for current booking' },
      { day: 'Saturday',  time: '11pm',    performer: "Late-night at Dizzy's",  isAnchor: false, note: "Dizzy's Club late set" },
      { day: 'Sunday',    time: '12pm',    performer: 'Sunday brunch jazz',      isAnchor: true,  note: "Dizzy's Club brunch — one of the best jazz views in the city" },
    ],

  },
  smalls: {
    id: 'smalls',
    name: `Smalls`,
    fullName: 'Smalls Jazz Club',
    neighborhood: 'Greenwich Village',
    address: '183 W 10th St, New York, NY 10014',
    hours: 'Daily · Sets at 7:30pm and 10:30pm · Late jams Fri–Sat at 1am',
    ticketUrl: 'https://www.smallslive.com/',
    scheduleUrl: 'https://www.smallslive.com/',
    mapUrl: 'https://maps.google.com/?q=Smalls+Jazz+Club+New+York',
    color: '#fef3c7',
    accentColor: '#b45309',
    description: `The most democratic room in New York jazz. Low prices, no minimum, and late-night jam sessions where the next generation is forged.`,
    character: `Smalls is the most democratic room in New York jazz. Since 1994, it has operated with low door prices, no drink minimum, and programming that mixes established figures with the next generation. The late-night jam sessions on Friday and Saturday — starting at 1am, running to 4am — are legendary: unannounced, unrehearsed, and completely alive. This is where jazz's next cohort works out what the music is becoming. Low prices, late nights, and no pretension.`,
    specialties: ['Jazz', 'Late Night Jams', 'Emerging Jazz Musicians', 'Affordable Tickets'],
    figureIds: ['brad_mehldau', 'roy_hargrove', 'wayne_shorter', 'ornette_coleman', 'charles_mingus'],

    admissionCost: `$25 cover · No drink minimum`,
    visitDuration: `2–4 hours`,
    bookingNote: `Walk-in OK; late jams are first-come, first-served`,
    familyFriendly: false,
    insiderTip: `The late-night jam session (Fri–Sat, starts 1am) is where unannounced musicians show up and play until 4am — pure, unscripted jazz in a 60-person room.`,
    priceNote: `$25 cover · No drink minimum`,
    bestNight: `Friday/Saturday Late Jam (1am–4am)`,
    weeklySchedule: [
      { day: 'Monday',    time: '7:30pm',  performer: 'Early set',               isAnchor: false, note: 'Check website for current artist' },
      { day: 'Monday',    time: '10:30pm', performer: 'Late set',                isAnchor: false },
      { day: 'Tuesday',   time: '7:30pm',  performer: 'Early set',               isAnchor: false, note: 'Check website for current artist' },
      { day: 'Tuesday',   time: '10:30pm', performer: 'Late set',                isAnchor: false },
      { day: 'Wednesday', time: '7:30pm',  performer: 'Early set',               isAnchor: false, note: 'Check website for current artist' },
      { day: 'Wednesday', time: '10:30pm', performer: 'Late set',                isAnchor: false },
      { day: 'Thursday',  time: '7:30pm',  performer: 'Early set',               isAnchor: false, note: 'Check website for current artist' },
      { day: 'Thursday',  time: '10:30pm', performer: 'Late set',                isAnchor: false },
      { day: 'Friday',    time: '7:30pm',  performer: 'Early set',               isAnchor: false, note: 'Check website for current artist' },
      { day: 'Friday',    time: '10:30pm', performer: 'Late set',                isAnchor: false },
      { day: 'Friday',    time: '1am',     performer: 'Late-night jam session',  isAnchor: true,  note: 'Open jam — any jazz musician can sit in' },
      { day: 'Saturday',  time: '7:30pm',  performer: 'Early set',               isAnchor: false, note: 'Check website for current artist' },
      { day: 'Saturday',  time: '10:30pm', performer: 'Late set',                isAnchor: false },
      { day: 'Saturday',  time: '1am',     performer: 'Late-night jam session',  isAnchor: true,  note: 'Open jam — any jazz musician can sit in' },
      { day: 'Sunday',    time: '7:30pm',  performer: 'Early set',               isAnchor: false, note: 'Check website for current artist' },
      { day: 'Sunday',    time: '10:30pm', performer: 'Late set',                isAnchor: false },
    ],

  },

  carnegie_hall: {
    id: 'carnegie_hall',
    name: `Carnegie Hall`,
    fullName: 'Carnegie Hall',
    neighborhood: 'Midtown',
    address: '881 7th Ave, New York, NY 10019',
    hours: 'Box office Mon–Sat 11am–6pm; concert nights until 30 min after start',
    ticketUrl: 'https://www.carnegiehall.org/Calendar',
    scheduleUrl: 'https://www.carnegiehall.org/Calendar/',
    mapUrl: 'https://maps.google.com/?q=Carnegie+Hall+New+York',
    color: '#fef9c3',
    accentColor: '#854d0e',
    description: `Opened in 1891, Carnegie Hall is the most storied concert hall in America. Its three stages and legendary acoustics define classical music in New York.`,
    character: `Opened in 1891, Carnegie Hall is the most storied concert venue in America. Three stages — the Stern Auditorium (2,804 seats), Zankel Hall (599 seats), and the Weill Recital Hall (268 seats) — cover every scale of classical performance. Every major artist in the history of classical music has performed here. The Stern Auditorium is the primary orchestral venue; Zankel programs contemporary and mid-scale works; Weill Recital Hall is the finest small room in New York for solo piano and vocal recital. To play Carnegie Hall is still, after 130 years, the standard.`,
    specialties: ['Symphony', 'Solo Piano', 'Chamber Music', 'Choral', 'Opera Concert Performances'],
    figureIds: ['brahms', 'tchaikovsky', 'mahler', 'stravinsky', 'glass'],

    admissionCost: `$35–$200+`,
    visitDuration: `2–2.5 hours`,
    bookingNote: `Book online — most concerts sell out`,
    familyFriendly: true,
    insiderTip: `Rush tickets go on sale at the box office on the day of the performance — excellent seats sometimes available at a fraction of the listed price.`,
    weeklySchedule: [
      { day: 'Tuesday',   time: '7:30pm',  performer: 'Rotating program',        isAnchor: false, note: 'Main Hall · Check carnegiehall.org for full listings' },
      { day: 'Wednesday', time: '7:30pm',  performer: 'Rotating program',        isAnchor: false, note: 'Zankel Hall or Weill Recital Hall · Check carnegiehall.org' },
      { day: 'Thursday',  time: '7:30pm',  performer: 'Rotating program',        isAnchor: false, note: 'Main Hall · Check carnegiehall.org for full listings' },
      { day: 'Friday',    time: '8pm',     performer: 'Rotating program',        isAnchor: false, note: 'Main Hall · Check carnegiehall.org for full listings' },
      { day: 'Saturday',  time: '8pm',     performer: 'Rotating program',        isAnchor: false, note: 'Main Hall · Check carnegiehall.org for full listings' },
      { day: 'Sunday',    time: '3pm',     performer: 'Sunday matinee',          isAnchor: false, note: 'Main Hall · Season runs October through May' },
    ],

  },
  david_geffen_hall: {
    id: 'david_geffen_hall',
    name: `David Geffen Hall`,
    fullName: 'David Geffen Hall — New York Philharmonic',
    neighborhood: 'Lincoln Center',
    address: '10 Lincoln Center Plaza, New York, NY 10023',
    hours: 'Box office Mon–Sat 10am–6pm, Sun 12pm–6pm; concert nights until 30 min after start',
    ticketUrl: 'https://nyphil.org/concerts-tickets',
    scheduleUrl: 'https://nyphil.org/concerts-tickets',
    mapUrl: 'https://maps.google.com/?q=David+Geffen+Hall+Lincoln+Center+New+York',
    color: '#e0f2fe',
    accentColor: '#0369a1',
    description: `Home of the New York Philharmonic since 1962, fully renovated in 2022. One of the finest orchestral halls in the world.`,
    character: `Home of the New York Philharmonic since 1962 and fully renovated in 2022, David Geffen Hall is the primary orchestral venue in New York. The Philharmonic — founded in 1842, the oldest symphony orchestra in the United States — performs more than 100 concerts per season here. The renovation dramatically improved the acoustics and opened the hall to the surrounding Lincoln Center plaza. Rush tickets and student discounts make the Philharmonic significantly more accessible than its reputation suggests.`,
    specialties: ['Symphony', '20th Century Orchestral', 'New York Philharmonic', 'New Commissions'],
    figureIds: ['mahler', 'shostakovich', 'brahms', 'beethoven', 'stravinsky'],

    admissionCost: `$35–$175`,
    visitDuration: `2–2.5 hours`,
    bookingNote: `Book online; rush tickets available day-of at noon`,
    familyFriendly: true,
    insiderTip: `Rush tickets for under $30 go on sale online at noon on the day of each performance — one of the best deals in New York classical music.`,
    weeklySchedule: [
      { day: 'Thursday',  time: '7:30pm',  performer: 'New York Philharmonic',   isAnchor: true,  note: 'Season runs September through June · Check nyphil.org' },
      { day: 'Friday',    time: '11am',    performer: 'NY Philharmonic matinee', isAnchor: true,  note: 'Friday morning program — same program as Thursday evening' },
      { day: 'Friday',    time: '8pm',     performer: 'New York Philharmonic',   isAnchor: true,  note: 'Check nyphil.org for program details' },
      { day: 'Saturday',  time: '8pm',     performer: 'New York Philharmonic',   isAnchor: true,  note: 'Check nyphil.org for program details' },
      { day: 'Sunday',    time: '3pm',     performer: 'Sunday matinee',          isAnchor: false, note: 'Check nyphil.org for current program' },
    ],

  },
  met_opera_house: {
    id: 'met_opera_house',
    name: `Metropolitan Opera`,
    fullName: 'Metropolitan Opera House',
    neighborhood: 'Lincoln Center',
    address: '30 Lincoln Center Plaza, New York, NY 10023',
    hours: 'Box office Mon–Sat 10am–8pm, Sun 12pm–6pm',
    ticketUrl: 'https://www.metopera.org/season/tickets',
    scheduleUrl: 'https://www.metopera.org/season/in-cinemas/',
    mapUrl: 'https://maps.google.com/?q=Metropolitan+Opera+House+Lincoln+Center+New+York',
    color: '#fce7f3',
    accentColor: '#9d174d',
    description: `Founded in 1883, the Met is one of the world's great opera houses — the singers, conductors, and productions that define opera at the highest level.`,
    character: `The Met Opera is the largest and most lavishly produced opera company in the world. Seasons run September through May, spanning Mozart through Verdi through Wagner through the 20th century. The productions are expensive, the singers are the best in the business, and the full Met experience — sets, costumes, lighting, orchestra, and voice — is unlike anything else in live performance. Standing room tickets at the top of the house are available at the box office on the morning of each performance: the cheapest way to experience the Met. HD broadcasts to movie theaters worldwide are an alternative that captures the visual production well.`,
    specialties: ['Grand Opera', 'Opera', 'Standing Room Tickets', 'Live HD Broadcasts'],
    figureIds: ['wagner', 'mozart', 'monteverdi', 'handel', 'mahler'],

    admissionCost: `Standing room $25–$30 · Seats from $50`,
    visitDuration: `3–5 hours`,
    bookingNote: `Standing room sold at box office morning of performance`,
    familyFriendly: false,
    insiderTip: `Standing room tickets at the rear of the orchestra sell for $25–$30 on the morning of each performance — the least expensive way to experience a full Met production.`,
    weeklySchedule: [
      { day: 'Monday',    time: '7:30pm',  performer: 'Rotating repertoire',     isAnchor: false, note: 'Season runs September through May · Check metopera.org' },
      { day: 'Tuesday',   time: '7:30pm',  performer: 'Rotating repertoire',     isAnchor: false, note: 'Check metopera.org for current production' },
      { day: 'Wednesday', time: '1pm',     performer: 'Wednesday matinee',       isAnchor: false, note: 'Afternoon performance · Check metopera.org' },
      { day: 'Thursday',  time: '7:30pm',  performer: 'Rotating repertoire',     isAnchor: false, note: 'Check metopera.org for current production' },
      { day: 'Friday',    time: '8pm',     performer: 'Rotating repertoire',     isAnchor: false, note: 'Check metopera.org for current production' },
      { day: 'Saturday',  time: '1pm',     performer: 'Saturday matinee',        isAnchor: true,  note: 'Live in HD broadcast to cinemas worldwide on select dates' },
      { day: 'Saturday',  time: '8pm',     performer: 'Rotating repertoire',     isAnchor: false, note: 'Check metopera.org for current production' },
      { day: 'Sunday',    time: '3pm',     performer: 'Sunday matinee',          isAnchor: false, note: 'Check metopera.org for current production' },
    ],

  },
  alice_tully_hall: {
    id: 'alice_tully_hall',
    name: `Alice Tully Hall`,
    fullName: 'Alice Tully Hall — Lincoln Center',
    neighborhood: 'Lincoln Center',
    address: '1941 Broadway, New York, NY 10023',
    hours: 'Box office opens 90 min before curtain; hours vary by event',
    ticketUrl: 'https://www.lincolncenter.org/venue/v/alice-tully-hall',
    scheduleUrl: 'https://www.lincolncenter.org/series/s/chamber-music-society',
    mapUrl: 'https://maps.google.com/?q=Alice+Tully+Hall+Lincoln+Center+New+York',
    color: '#f0fdf4',
    accentColor: '#15803d',
    description: `Home of the Chamber Music Society of Lincoln Center. Its 1,086-seat design is ideal for chamber music and Baroque repertoire.`,
    character: `Alice Tully Hall is the home of the Chamber Music Society of Lincoln Center — one of the finest chamber music presenters in the world. The 1,086-seat space is ideal for small ensembles: intimate enough to hear every detail, large enough to sustain a full audience. The Chamber Music Society programs both the standard chamber repertoire and newer works by living composers. Alice Tully also hosts Juilliard School public concerts and the Lincoln Center Chamber Music festival. A natural first stop for anyone new to chamber music.`,
    specialties: ['Chamber Music', 'Solo Piano', 'Choral', 'Baroque', 'Juilliard Concerts'],
    figureIds: ['bach', 'handel', 'vivaldi', 'glass', 'reich'],

    admissionCost: `$25–$80 · Some Juilliard concerts free`,
    visitDuration: `2 hours`,
    bookingNote: `Book online; check Juilliard schedule for free events`,
    familyFriendly: true,
    insiderTip: `Juilliard public concerts in this hall are often free — professional-level performances at no charge; check the Juilliard calendar separately.`,
  },
  miller_theatre: {
    id: 'miller_theatre',
    name: `Miller Theatre`,
    fullName: 'Miller Theatre at Columbia University',
    neighborhood: 'Morningside Heights',
    address: '2960 Broadway, New York, NY 10027',
    hours: 'Box office opens 1 hour before each performance',
    ticketUrl: 'https://millertheatre.com/',
    scheduleUrl: 'https://millertheatre.com/',
    mapUrl: 'https://maps.google.com/?q=Miller+Theatre+Columbia+University+New+York',
    color: '#faf5ff',
    accentColor: '#7e22ce',
    description: `Columbia's 688-seat concert hall — one of the most adventurous classical music presenters in New York, commissioning new works and championing living composers.`,
    character: `Miller Theatre at Columbia University is the most adventurous classical music presenter in New York. It commissions new works, revives neglected Baroque repertoire with period-instrument ensembles, and programs living composers alongside dead ones with genuine curatorial conviction. It is the venue most likely to surprise you, and the one most trusted by musicians and critics who want to hear classical music expanding rather than consolidating. The 688-seat hall is comfortable and acoustically capable. Worth the subway ride uptown.`,
    specialties: ['Contemporary Classical', 'Early Music Baroque', 'New Commissions', 'Adventurous Programming'],
    figureIds: ['glass', 'part', 'john_adams', 'reich', 'caroline_shaw'],

    admissionCost: `$25–$55`,
    visitDuration: `2 hours`,
    bookingNote: `Book online; take 1 train to 116th St–Columbia University`,
    familyFriendly: true,
    insiderTip: `The Baroque series with period instruments is a revelation — Miller programs these with historical rigor you will not find at larger venues downtown.`,
  },

  // ── NEW CLASSICAL VENUES ─────────────────────────────────────────────────────────────

  bargemusic: {
    id: 'bargemusic',
    name: `Bargemusic`,
    fullName: 'Bargemusic',
    neighborhood: 'DUMBO, Brooklyn',
    address: 'Fulton Ferry Landing, Brooklyn, NY 11201',
    hours: 'Thu–Sun most weeks · See website for schedule',
    ticketUrl: 'https://www.bargemusic.org/',
    scheduleUrl: 'https://www.bargemusic.org/',
    mapUrl: 'https://maps.google.com/?q=Bargemusic+Brooklyn+New+York',
    color: '#f0fdf4',
    accentColor: '#15803d',
    description: `A chamber music venue aboard a converted coffee barge moored under the Brooklyn Bridge, holding 130 people for year-round classical concerts.`,
    character: `Bargemusic is the most unusual classical venue in New York: a converted coffee barge moored at Fulton Ferry Landing under the Brooklyn Bridge, holding 130 people for chamber music year-round. Olga Bloom founded it in 1977 after concluding that chamber music in large halls loses something essential. She was right. The intimacy of Bargemusic — the slight rock of the barge beneath you, the Manhattan skyline visible through the windows, the musicians close enough to watch their bowing arms — is unlike any other concert experience in the city. Tickets are inexpensive. The view is extraordinary.`,
    specialties: ['Chamber Music', 'Solo Piano', 'String Quartets', 'Affordable Tickets', 'Intimate Setting'],
    figureIds: ['bach', 'mozart', 'beethoven', 'schubert', 'haydn'],

    admissionCost: `$35–$45`,
    visitDuration: `2 hours`,
    bookingNote: `Book online — very small venue, sells out easily`,
    familyFriendly: true,
    insiderTip: `Arrive early to get a window seat — the Manhattan skyline and Brooklyn Bridge are visible through the barge windows directly behind the musicians.`,
  },
  ninety_second_st_y: {
    id: 'ninety_second_st_y',
    name: `92NY`,
    fullName: '92nd Street Y — Kaufman Concert Hall',
    neighborhood: 'Upper East Side',
    address: '1395 Lexington Ave, New York, NY 10128',
    hours: 'Box office opens 90 minutes before each performance',
    ticketUrl: 'https://www.92ny.org/concerts-and-lectures',
    scheduleUrl: 'https://www.92ny.org/concerts-and-lectures',
    mapUrl: 'https://maps.google.com/?q=92nd+Street+Y+New+York',
    color: '#fef3c7',
    accentColor: '#d97706',
    description: `The Kaufman Concert Hall at 92NY is one of New York's finest venues for solo piano and vocal recital, with a history stretching back to Horowitz and Rubinstein.`,
    character: `The 92nd Street Y has been a premier venue for solo piano and vocal recital since the 1930s. Vladimir Horowitz played here. Arthur Rubinstein played here. Glenn Gould gave one of his last public performances here in 1973. The Kaufman Concert Hall seats 916 and has acoustics ideally suited to the piano — close enough that you hear the hammer action, large enough that the sound fills the room. The Y's programming consistently mixes historical depth with emerging artists, and the ticket prices are significantly lower than Carnegie Hall.`,
    specialties: ['Solo Piano', 'Vocal Recital', 'Chamber Music', 'Emerging Artists'],
    figureIds: ['chopin', 'brahms', 'schubert', 'beethoven', 'mahler'],

    admissionCost: `$30–$80`,
    visitDuration: `2 hours`,
    bookingNote: `Book online`,
    familyFriendly: true,
    insiderTip: `The 92NY programs solo piano recitals with the same depth as Carnegie Hall at significantly lower prices and in a more intimate 916-seat room.`,
  },
  merkin_hall: {
    id: 'merkin_hall',
    name: `Merkin Hall`,
    fullName: 'Merkin Concert Hall at Kaufman Music Center',
    neighborhood: 'Upper West Side',
    address: '129 W 67th St, New York, NY 10023',
    hours: 'Box office opens 90 minutes before each performance',
    ticketUrl: 'https://www.kaufmanmusiccenter.org/mch/',
    scheduleUrl: 'https://www.kaufmanmusiccenter.org/mch/events/',
    mapUrl: 'https://maps.google.com/?q=Merkin+Concert+Hall+New+York',
    color: '#ede9fe',
    accentColor: '#7c3aed',
    description: `A 456-seat concert hall on the Upper West Side, presenting chamber music, new music, and world music in one of the most acoustically distinguished smaller rooms in the city.`,
    character: `Merkin Concert Hall sits one block from Lincoln Center but operates independently, with a program that is consistently more adventurous than its neighbors. The 456-seat hall is ideal for chamber music — intimate enough for detail, large enough to sustain an ensemble. Merkin programs contemporary and new music alongside the chamber canon, and has been a consistent champion of living composers in a way that larger venues cannot sustain. One of the best venues in New York for discovering what contemporary classical music actually sounds like.`,
    specialties: ['Chamber Music', 'New Music', 'Contemporary Classical', 'Emerging Ensembles'],
    figureIds: ['glass', 'reich', 'caroline_shaw', 'john_adams', 'part'],

    admissionCost: `$25–$50 · Some events free`,
    visitDuration: `1.5–2 hours`,
    bookingNote: `Book online; one block from Lincoln Center`,
    familyFriendly: true,
    insiderTip: `If you want to hear what living composers are actually writing, Merkin is the right room — the most adventurous programming of any hall near Lincoln Center.`,
  },

  // ── SPORTS VENUES ─────────────────────────────────────────────────────────────────────────────

  yankee_stadium: {
    id: 'yankee_stadium',
    name: `Yankee Stadium`,
    fullName: 'Yankee Stadium',
    neighborhood: 'The Bronx',
    address: '1 E 161st St, Bronx, NY 10451',
    hours: 'Game days only; stadium tours available most non-game days 10am–4pm',
    ticketUrl: 'https://www.mlb.com/yankees/tickets',
    scheduleUrl: 'https://www.mlb.com/yankees/schedule',
    mapUrl: 'https://maps.google.com/?q=Yankee+Stadium+Bronx+New+York',
    color: '#0c1a2e',
    accentColor: '#ffffff',
    description: `Home of the New York Yankees since 2009, opened across the street from the original House That Ruth Built (1923–2008). The most storied franchise in American sports.`,
    character: `Yankee Stadium is a monument as much as a ballpark. The current stadium opened in 2009 directly across 161st Street from the original House That Ruth Built (1923–2008). The franchise has won 27 World Series championships — more than any other in American sports. Monument Park, beyond the center field wall, holds plaques and monuments for Ruth, Gehrig, DiMaggio, Mantle, and others. It is the most concentrated display of baseball history accessible to the general public. Stadium tours run on most non-game days.`,
    specialties: ['New York Yankees', 'Monument Park', 'Baseball History', 'Stadium Tours'],
    whatToSeeInBuilding: [
      'Monument Park (beyond center field wall): open during games and tours — plaques, monuments, and retired number signs for Ruth, Gehrig, DiMaggio, Mantle, Jeter, and others. The Yankees retire numbers more selectively than any franchise in American sports.',
      'The retired number display on the left field wall: a sequence from 1 through 99 with the gaps that mark each retirement — a visual timeline of dynasty.',
      'The Great Hall at street level: the main interior concourse running the length of the stadium, with photographs documenting the franchise from 1903 to the present.',
    ],
    admissionCost: `Game tickets $20–$300+ · Stadium tours $25`,
    visitDuration: `3–4 hours for a game`,
    bookingNote: `Buy game tickets online; tours available most non-game days`,
    familyFriendly: true,
    insiderTip: `Monument Park (beyond center field) opens 45 minutes before first pitch — plaques for Ruth, Gehrig, DiMaggio, and Mantle are the most concentrated baseball history in America.`,
  },
  msg: {
    id: 'msg',
    name: `Madison Square Garden`,
    fullName: 'Madison Square Garden',
    neighborhood: 'Midtown Manhattan',
    address: '4 Pennsylvania Plaza, New York, NY 10001',
    hours: 'Event nights; Box office open Mon–Sat 12pm–6pm',
    ticketUrl: 'https://www.msg.com/madison-square-garden',
    scheduleUrl: 'https://www.msg.com/calendar',
    mapUrl: 'https://maps.google.com/?q=Madison+Square+Garden+New+York+NY',
    color: '#1a1a1a',
    accentColor: '#f59e0b',
    description: `The World's Most Famous Arena. Home to the Knicks, Rangers, and the Liberty. The fourth arena to bear this name, in continuous operation since 1968.`,
    character: `Madison Square Garden is the fourth arena to bear this name and has been in continuous operation since 1968. It is home to the New York Knicks (NBA) and New York Rangers (NHL), and has hosted more world championship boxing matches than any other arena in history. The championship banner sequence hanging from the ceiling — Knicks rings, Rangers Stanley Cups, retired numbers from both sports spanning more than 50 years — is one of the most concentrated displays of sports history in America. When something important happens in New York sports, it usually happens here.`,
    specialties: ['New York Knicks', 'New York Rangers', 'Championship Boxing', 'Concert Events'],
    whatToSeeInBuilding: [
      'The championship banner sequence: look up before the game begins. Each banner documents a specific year, a specific team, a specific championship. The sequence from 1970 to 1994 covers both the Knicks and the Rangers — basketball and hockey championships in the same building, the same decades, the same city.',
      'Retired jerseys from Knicks and Rangers legends: Willis Reed\'s #19, Walt Frazier\'s #10, Patrick Ewing\'s #33 alongside Mark Messier\'s #11, Brian Leetch\'s #2, Mike Richter\'s #35.',
      'The arena\'s historical exhibit near section 101 documents the Garden\'s full history since 1968: championship fights, concerts, political conventions, and the full scope of New York sports.',
    ],
    admissionCost: `$50–$500+ depending on event`,
    visitDuration: `2–3 hours`,
    bookingNote: `Buy tickets online; arena tours available select days`,
    familyFriendly: true,
    insiderTip: `Look up before the game begins — the championship banner sequence from 1970 to today tells the entire story of New York sports in one ceiling.`,
  },
  citi_field: {
    id: 'citi_field',
    name: `Citi Field`,
    fullName: 'Citi Field',
    neighborhood: 'Flushing, Queens',
    address: '41 Seaver Way, Flushing, NY 11368',
    hours: 'Game days only; tours available select non-game days',
    ticketUrl: 'https://www.mlb.com/mets/tickets',
    scheduleUrl: 'https://www.mlb.com/mets/schedule',
    mapUrl: 'https://maps.google.com/?q=Citi+Field+Flushing+Queens+New+York',
    color: '#003087',
    accentColor: '#ffffff',
    description: `Home of the New York Mets since 2009, built as a tribute to Ebbets Field. The Jackie Robinson Rotunda at the main entrance is the most meaningful entryway in baseball.`,
    character: `Citi Field opened in 2009 as a deliberate tribute to the demolished Ebbets Field. The Jackie Robinson Rotunda at the main entrance is the most striking statement any ballpark has made about what baseball owes one man: Robinson's image and words occupy the entire entry experience, reminding every fan who enters what the game required of him. The Mets' history — the Miracle Mets of 1969, the 1986 championship, Piazza's September 21 home run — is woven throughout the park. Accessible by the 7 train to Mets-Willets Point.`,
    specialties: ['New York Mets', 'Jackie Robinson Rotunda', 'Mets Hall of Fame', 'Baseball History'],
    whatToSeeInBuilding: [
      'The Jackie Robinson Rotunda: the main entrance is dedicated entirely to Robinson — quotes, images, and a design that makes entering Citi Field an act of acknowledgment before a single pitch is thrown.',
      'The Mets Hall of Fame and Museum (beyond the rotunda): franchise history from the 1962 expansion through the present, including the Miracle Mets and the 1986 championship.',
      'The Shea Bridge, visible from certain upper-deck seats: a structural tribute to Shea Stadium, which stood on this site until 2009.',
    ],
    admissionCost: `Game tickets $20–$200+`,
    visitDuration: `3 hours`,
    bookingNote: `Buy tickets online; take the 7 train to Mets–Willets Point`,
    familyFriendly: true,
    insiderTip: `Walk slowly through the Jackie Robinson Rotunda before finding your seat — the tribute to Robinson is the most meaningful entrance in baseball.`,
  },
  arthur_ashe_stadium: {
    id: 'arthur_ashe_stadium',
    name: `Arthur Ashe Stadium`,
    fullName: 'Arthur Ashe Stadium',
    neighborhood: 'Flushing, Queens',
    address: 'USTA Billie Jean King National Tennis Center, Flushing, NY 11368',
    hours: 'US Open: late August–early September. Tours by appointment.',
    ticketUrl: 'https://www.usopen.org/en_US/visiting/',
    scheduleUrl: 'https://www.usopen.org/en_US/visiting/',
    mapUrl: 'https://maps.google.com/?q=Arthur+Ashe+Stadium+Flushing+Queens',
    color: '#003580',
    accentColor: '#ffffff',
    description: `The largest tennis stadium in the world, home of the US Open. Named for Arthur Ashe, who won the inaugural US Open in 1968 and remains the only Black man to win the singles title at Wimbledon, the US Open, and the Australian Open.`,
    character: `The largest tennis stadium in the world seats 23,771 people and bears the name of the man who won the inaugural US Open in 1968. Arthur Ashe was the first African American player ranked No. 1 in the world and the only one to win three Grand Slam singles titles before his death from AIDS in 1993. The stadium that carries his name hosts two weeks of the most intense international tennis competition in the world every August and September. The grounds also contain Louis Armstrong Stadium and the Grandstand — excellent courts for watching qualifying rounds and early draws, often free or low-cost.`,
    specialties: ['US Open Grand Slam', 'USTA Tennis Center', 'Retractable Roof', 'International Tennis'],
    whatToSeeInBuilding: [
      'The Arthur Ashe statue and memorial at the main entrance: a permanent acknowledgment of who the stadium honors and why it matters beyond sports.',
      'The retractable roof, installed in 2016: if weather threatens during a match, watch the operators close it — one of the most visible pieces of sports engineering in New York.',
      'The grounds during the Open: 22 other courts are open for public viewing of qualifying rounds and early-draw matches, often featuring future champions. Some are general admission.',
    ],
    admissionCost: `Grounds pass $50–$100 · Main stadium $100–$200+`,
    visitDuration: `4–6 hours`,
    bookingNote: `Book well in advance for the US Open; day grounds passes available`,
    familyFriendly: true,
    insiderTip: `A grounds pass lets you watch matches on 22 outer courts during early rounds — future champions play there for a fraction of the main-stadium price.`,
  },
  // ── ARCHITECTURE VENUES (Buildings) ──────────────────────────────────────
  chrysler_building: {
    id: 'chrysler_building',
    name: `Chrysler Building`,
    fullName: 'Chrysler Building',
    neighborhood: 'Midtown East',
    address: '405 Lexington Ave, New York, NY 10174',
    hours: 'Lobby open weekdays during business hours',
    ticketUrl: 'https://en.wikipedia.org/wiki/Chrysler_Building',
    scheduleUrl: 'https://en.wikipedia.org/wiki/Chrysler_Building',
    mapUrl: 'https://maps.google.com/?q=Chrysler+Building+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Chrysler_Building_by_David_Shankbone.jpg/440px-Chrysler_Building_by_David_Shankbone.jpg',
    color: '#e0f2fe',
    accentColor: '#0369a1',
    description: `The greatest Art Deco skyscraper ever built. Its eagle gargoyles, sunburst crown, and stainless-steel spire made it — briefly — the world's tallest building in 1930.`,
    character: `For eleven months in 1930, this was the tallest building on earth, and its architect William Van Alen had hidden the spire inside the crown to surprise his rivals. The stainless steel Nirosta cladding was revolutionary — it was the first major building to use it as a decorative skin. Walk in for the lobby alone: red Moroccan marble, amber murals of the factory floor, Art Deco elevator doors inlaid with exotic woods. This is where the 1920s conviction that industry was beautiful crystallized into limestone and steel.`,
    specialties: ['Art Deco', 'Skyscraper Design', 'Lobby Architecture', 'Stainless Steel Construction'],
    figureIds: ['william_van_alen'],
    admissionCost: `Free (lobby only)`,
    visitDuration: `20–30 min`,
    bookingNote: `Walk-in weekdays during business hours; no observation deck`,
    familyFriendly: true,
    insiderTip: `Walk into the lobby — the Art Deco elevator doors inlaid with exotic woods and the amber murals of factory floors are some of the finest interior details in any skyscraper in New York.`,
    interiorAccess: `Lobby open weekdays during business hours`,
  },
  empire_state: {
    id: 'empire_state',
    name: `Empire State Building`,
    fullName: 'Empire State Building',
    neighborhood: 'Midtown',
    address: '350 Fifth Ave, New York, NY 10118',
    hours: 'Daily 8am–2am',
    ticketUrl: 'https://www.esbnyc.com/buy-tickets',
    scheduleUrl: 'https://www.esbnyc.com/',
    mapUrl: 'https://maps.google.com/?q=Empire+State+Building+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/440px-Empire_State_Building_%28aerial_view%29.jpg',
    color: '#e0f2fe',
    accentColor: '#0369a1',
    description: `Completed in 410 days during the Depression. The most recognizable skyline silhouette in the world, and still one of the finest Art Deco structures ever built.`,
    character: `Shreve, Lamb & Harmon built this in 410 days — a construction pace that has never been matched for a building of comparable scale. The setback design was required by the 1916 Zoning Resolution, which forced buildings to step back as they rose to let light reach the street. The architects turned a regulatory constraint into an aesthetic virtue: those steps give the building its rhythmic, tapering profile. The lobby ceiling is gilded aluminum, the floors are marble, and the murals show the Eighth Wonder of the World as its builders conceived it.`,
    specialties: ['Art Deco', 'Setback Design', 'Observation Deck', 'Depression-Era Construction'],
    figureIds: ['william_lamb'],
    admissionCost: `$44–$79 observatory tickets`,
    visitDuration: `1–2 hours`,
    bookingNote: `Book online to skip the queue; timed entry recommended`,
    familyFriendly: true,
    insiderTip: `The 86th-floor deck at twilight — about 30 minutes after sunset — is when city lights ignite while the sky is still blue; book that specific time slot.`,
    interiorAccess: `Observatory open daily 8am–2am`,
  },
  rockefeller_center: {
    id: 'rockefeller_center',
    name: `Rockefeller Center`,
    fullName: '30 Rockefeller Plaza',
    neighborhood: 'Midtown',
    address: '30 Rockefeller Plaza, New York, NY 10112',
    hours: 'Top of the Rock: daily 8am–midnight',
    ticketUrl: 'https://www.topoftherocknyc.com/',
    scheduleUrl: 'https://www.rockefellercenter.com/events/',
    mapUrl: 'https://maps.google.com/?q=Rockefeller+Center+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/30_Rockefeller_Plaza_%28Comcast_Building%29.jpg/440px-30_Rockefeller_Plaza_%28Comcast_Building%29.jpg',
    color: '#e0f2fe',
    accentColor: '#0369a1',
    description: `The only great Art Deco urban complex ever completed. Fourteen buildings, a sunken plaza, and a philosophy: that commerce, art, and public space could exist together.`,
    character: `Raymond Hood's complex is the only privately financed urban development project of its scale ever brought to completion, and it was done in the teeth of the Depression. Hood used the setback requirements not as obstacles but as design opportunities, creating the stepped profiles and roof gardens that define the complex. The public spaces — the Channel Gardens, the sunken plaza — were unprecedented: Rockefeller was giving ground-level space back to the city. The lobbies of 30 Rock and 1270 Sixth Avenue are among the finest rooms in New York.`,
    specialties: ['Art Deco', 'Urban Planning', 'Lobby Murals', 'Public Space Design'],
    figureIds: ['raymond_hood'],
    admissionCost: `Top of the Rock $40–$44 · Channel Gardens free`,
    visitDuration: `1–2 hours`,
    bookingNote: `Book Top of the Rock online; Channel Gardens walk-in always`,
    familyFriendly: true,
    insiderTip: `The lobbies of 30 Rock and 1270 Sixth Avenue have some of the finest Art Deco murals in New York — free to walk through any time during business hours.`,
    interiorAccess: `30 Rock lobby open during business hours; Top of the Rock ticketed`,
  },
  woolworth_building: {
    id: 'woolworth_building',
    name: `Woolworth Building`,
    fullName: 'Woolworth Building',
    neighborhood: 'Downtown / Civic Center',
    address: '233 Broadway, New York, NY 10279',
    hours: 'Lobby open during business hours; tours available',
    ticketUrl: 'https://www.woolworthtours.com/',
    scheduleUrl: 'https://www.woolworthtours.com/',
    mapUrl: 'https://maps.google.com/?q=Woolworth+Building+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Woolworth_Building_2013.jpg/440px-Woolworth_Building_2013.jpg',
    color: '#dcfce7',
    accentColor: '#15803d',
    description: `The Cathedral of Commerce. For seventeen years the world's tallest building, its Gothic Revival terra-cotta remains the most ornate skyscraper facade ever executed.`,
    character: `Cass Gilbert clad a steel skyscraper in Gothic Revival limestone and terra-cotta at a moment when few people thought the two ideas were compatible. The result was called the Cathedral of Commerce — partly as a joke, partly in genuine awe. The building uses Gothic elements not as decoration pasted on a box but structurally integrated into the skin. The lobby is encrusted with Byzantine mosaics, the vaulted ceiling a deep blue-green. Look for the caricature sculptures of Woolworth counting nickels and Gilbert holding a model of the building.`,
    specialties: ['Gothic Revival', 'Terra-cotta Facade', 'Gothic Lobby', 'Skyscraper History'],
    figureIds: ['cass_gilbert'],
    admissionCost: `Lobby free · Tours $25`,
    visitDuration: `30–45 min`,
    bookingNote: `Lobby walk-in weekdays; tours require advance booking`,
    familyFriendly: true,
    insiderTip: `Look for the caricature sculptures hidden in the Gothic lobby vault — one shows Woolworth counting his nickels, another shows architect Gilbert holding a model of the building.`,
    interiorAccess: `Lobby open during business hours; upper floors by tour only`,
  },
  grand_central_terminal: {
    id: 'grand_central_terminal',
    name: `Grand Central`,
    fullName: 'Grand Central Terminal',
    neighborhood: 'Midtown East',
    address: '89 E 42nd St, New York, NY 10017',
    hours: 'Daily 5:30am–2am',
    ticketUrl: 'https://www.grandcentralterminal.com/',
    scheduleUrl: 'https://www.grandcentralterminal.com/events/',
    mapUrl: 'https://maps.google.com/?q=Grand+Central+Terminal+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Image-Grand_central_Station_Outside_Night_2.jpg/440px-Image-Grand_central_Station_Outside_Night_2.jpg',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `The finest Beaux-Arts interior in North America. The Main Concourse ceiling — a cerulean mural of 2,500 stars — is one of the great civic spaces on earth.`,
    character: `Warren & Wetmore and Reed & Stem designed the terminal around a single idea: that arrival in New York should feel monumental. The Main Concourse is 275 feet long, 120 feet wide, and 125 feet high — deliberately cathedral-like in scale. The famous turquoise ceiling showing the winter constellation is painted backwards, which the designers explained was showing the sky from God's perspective. The ramp system below ground — 44 tracks on two levels — is as elegant an engineering solution as the architecture above. It was nearly demolished in the 1960s; its survival sparked historic preservation law in New York City.`,
    specialties: ['Beaux-Arts', 'Main Concourse', 'Celestial Ceiling', 'Terminal Design'],
    figureIds: ['whitney_warren'],
    admissionCost: `Free`,
    visitDuration: `30–60 min`,
    bookingNote: `Walk-in anytime (open daily 5:30am–2am)`,
    familyFriendly: true,
    insiderTip: `Stand at the Oyster Bar entrance and whisper toward the curved tile wall — the vaulted ceiling carries sound across the room in the famous whispering gallery.`,
    interiorAccess: `All public areas open; Grand Central Tour available Wed 12:30pm`,
  },
  nypl_schwarzman: {
    id: 'nypl_schwarzman',
    name: `NY Public Library`,
    fullName: 'New York Public Library, Stephen A. Schwarzman Building',
    neighborhood: 'Midtown',
    address: '476 Fifth Ave, New York, NY 10018',
    hours: 'Mon–Thu 10am–8pm · Fri–Sat 10am–6pm · Sun 1–5pm',
    ticketUrl: 'https://www.nypl.org/locations/schwarzman',
    scheduleUrl: 'https://www.nypl.org/events',
    mapUrl: 'https://maps.google.com/?q=New+York+Public+Library+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/New_York_Public_Library_May_2011.jpg/440px-New_York_Public_Library_May_2011.jpg',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `The crown jewel of Beaux-Arts New York. Carrère & Hastings designed a palace for public knowledge, guarded by the marble lions Patience and Fortitude.`,
    character: `John Carrère and Thomas Hastings won the commission in 1897 and spent fourteen years building a Beaux-Arts palace on the site of the old Croton Reservoir. The Rose Main Reading Room — 297 feet long, 78 feet wide, ceiling painted in Renaissance style — is one of the most beautiful interiors in any public building in America. The building\'s genius is civic: it gives a grand architectural experience to everyone, not just those who can afford a museum ticket. The lions Patience and Fortitude have flanked the Fifth Avenue entrance since 1911.`,
    specialties: ['Beaux-Arts', 'Rose Main Reading Room', 'Public Architecture', 'Civic Design'],
    figureIds: ['john_carrere'],
    admissionCost: `Free`,
    visitDuration: `30–60 min`,
    bookingNote: `Walk-in during library hours; no ticket required`,
    familyFriendly: true,
    insiderTip: `Go up to the Rose Main Reading Room on the third floor — 297 feet of gilded Renaissance ceiling in a public room that costs nothing to enter.`,
    interiorAccess: `All public reading rooms open during library hours`,
  },
  flatiron_building: {
    id: 'flatiron_building',
    name: `Flatiron Building`,
    fullName: 'Flatiron Building',
    neighborhood: 'Flatiron',
    address: '175 Fifth Ave, New York, NY 10010',
    hours: 'Exterior always visible; lobby by appointment',
    ticketUrl: 'https://en.wikipedia.org/wiki/Flatiron_Building',
    scheduleUrl: 'https://en.wikipedia.org/wiki/Flatiron_Building',
    mapUrl: 'https://maps.google.com/?q=Flatiron+Building+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Edificio_Fuller_%28Flatiron%29_en_2010_desde_el_Empire_State_crop_boxin.jpg/440px-Edificio_Fuller_%28Flatiron%29_en_2010_desde_el_Empire_State_crop_boxin.jpg',
    color: '#dcfce7',
    accentColor: '#15803d',
    description: `Daniel Burnham's 1902 triangular skyscraper proved the steel-frame formula could produce beauty on any lot shape. One of New York's most photographed buildings.`,
    character: `Daniel Burnham was given a triangular lot at the intersection of Broadway and Fifth Avenue and built the Fuller Building — a steel-frame skyscraper clad in limestone and terra-cotta that taper to a six-foot-wide prow at the south end. The building proved that the new structural system of steel framing could produce something genuinely graceful, not merely tall. Burnham used Renaissance and Baroque ornamental detailing — pilasters, cornices, rusticated base — to give the industrial technology a historical pedigree. The wind it generated at street level was notorious for lifting women's skirts; police used the slang "23 skidoo" to move crowds along.`,
    specialties: ['Beaux-Arts', 'Steel Frame Construction', 'Triangular Plan', 'Skyscraper History'],
    figureIds: ['daniel_burnham'],
    admissionCost: `Free (exterior viewing)`,
    visitDuration: `15–20 min`,
    bookingNote: `Exterior always accessible; best viewed from Madison Square Park`,
    familyFriendly: true,
    insiderTip: `The best angle is from the north end of Madison Square Park looking south — you see the full triangular profile tapering to its famous six-foot-wide prow.`,
    interiorAccess: `Lobby not publicly accessible; exterior only`,
  },
  st_patricks: {
    id: 'st_patricks',
    name: `St. Patrick's Cathedral`,
    fullName: `St. Patrick's Cathedral`,
    neighborhood: 'Midtown',
    address: '5th Ave at 50th St, New York, NY 10022',
    hours: 'Daily 6:30am–8:45pm',
    ticketUrl: 'https://saintpatrickscathedral.org/visit',
    scheduleUrl: 'https://saintpatrickscathedral.org/masses-and-services',
    mapUrl: 'https://maps.google.com/?q=St+Patricks+Cathedral+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/At_New_York%2C_USA_2017_119.jpg/440px-At_New_York%2C_USA_2017_119.jpg',
    color: '#f0fdf4',
    accentColor: '#166534',
    description: `James Renwick Jr.'s Gothic Revival masterpiece. Built between 1858 and 1878, it introduced European cathedral scale to a city that had never seen anything like it.`,
    character: `James Renwick Jr. had studied the Gothic cathedrals of France and England and set out to build their American equal on Fifth Avenue — then a dusty road far outside the city center. The white marble exterior, the twin 330-foot spires, the interior height of 112 feet at the nave vault: these were unprecedented in American religious architecture. Renwick used the structural logic of Gothic — pointed arches, flying buttresses, ribbed vaults — not as decoration but as a genuine engineering system. The stained glass windows, including a rose window 26 feet in diameter, cast the interior in colored light that transforms throughout the day.`,
    specialties: ['Gothic Revival', 'White Marble Facade', 'Twin Spires', 'Stained Glass'],
    figureIds: ['james_renwick_jr'],
    admissionCost: `Free (donation welcomed)`,
    visitDuration: `30–45 min`,
    bookingNote: `Walk-in during open hours; check mass schedule before visiting`,
    familyFriendly: true,
    insiderTip: `Visit on a weekday morning when the cathedral is nearly empty — the light through the 26-foot rose window transforms the nave completely as the sun moves.`,
    interiorAccess: `Cathedral open daily 6:30am–8:45pm`,
  },
  trinity_church_nyc: {
    id: 'trinity_church_nyc',
    name: `Trinity Church`,
    fullName: 'Trinity Church Wall Street',
    neighborhood: 'Financial District',
    address: '75 Broadway, New York, NY 10006',
    hours: 'Mon–Fri 7am–6pm · Sat 8am–4pm · Sun 7am–4pm',
    ticketUrl: 'https://www.trinitywallstreet.org/visit',
    scheduleUrl: 'https://www.trinitywallstreet.org/music',
    mapUrl: 'https://maps.google.com/?q=Trinity+Church+Wall+Street+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Trinity_Church_Manhattan.jpg/440px-Trinity_Church_Manhattan.jpg',
    color: '#f0fdf4',
    accentColor: '#166534',
    description: `Richard Upjohn's 1846 Gothic Revival church brought the English perpendicular style to America and established Gothic as the dominant language for church architecture nationwide.`,
    character: `Richard Upjohn built this at the foot of Wall Street in 1846 and in doing so established the grammar of American church architecture for the next fifty years. The brownstone exterior, the lancet windows, the nave proportions — all drawn from English Perpendicular Gothic — were so convincing that Upjohn was immediately flooded with commissions from congregations across the country. The churchyard holds Alexander Hamilton, and the church has stood while the Financial District grew up around it. Standing at Broadway looking south, the church still terminates the street view as it was designed to do.`,
    specialties: ['Gothic Revival', 'Brownstone Construction', 'Historic Churchyard', 'Street Terminus'],
    figureIds: ['james_renwick_jr'],
    admissionCost: `Free`,
    visitDuration: `20–30 min`,
    bookingNote: `Walk-in during church hours`,
    familyFriendly: true,
    insiderTip: `Alexander Hamilton is buried in the churchyard — follow the signs from the Broadway entrance; the gravestone is behind the church near the Rector Street side.`,
    interiorAccess: `Church and churchyard open Mon–Fri 7am–6pm; limited weekend hours`,
  },
  brooklyn_bridge_arch: {
    id: 'brooklyn_bridge_arch',
    name: `Brooklyn Bridge`,
    fullName: 'Brooklyn Bridge',
    neighborhood: 'Brooklyn Bridge / DUMBO',
    address: 'Brooklyn Bridge, New York, NY 10038',
    hours: 'Pedestrian walkway always open',
    ticketUrl: 'https://www.nycgovparks.org/parks/brooklyn-bridge-park',
    scheduleUrl: 'https://www.nycgovparks.org/parks/brooklyn-bridge-park',
    mapUrl: 'https://maps.google.com/?q=Brooklyn+Bridge+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Brooklyn_Bridge_Manhattan.jpg/440px-Brooklyn_Bridge_Manhattan.jpg',
    color: '#fef3c7',
    accentColor: '#b45309',
    description: `John Roebling's 1883 suspension bridge was the longest in the world for twenty years. Its granite Gothic towers are monuments as much as engineering.`,
    character: `John Roebling designed this bridge but died before construction began — a cable strand snapped and crushed his foot; tetanus killed him. His son Washington completed it, directing construction from a Brooklyn apartment window with binoculars after a bout of decompression sickness left him an invalid. The bridge opened in 1883 and was an immediate sensation: 14,000 vehicles and 153,000 people crossed it on opening week. The Gothic granite towers — 276 feet above the river — were the tallest structures in the Western Hemisphere at the time. Walking the pedestrian promenade is among the finest urban experiences available anywhere.`,
    specialties: ['Gothic Towers', 'Suspension Engineering', 'Wire Cable System', 'Civic Monument'],
    figureIds: ['john_roebling'],
    admissionCost: `Free`,
    visitDuration: `45–60 min (full walk across)`,
    bookingNote: `Walk-in anytime; most crowded midday weekends`,
    familyFriendly: true,
    insiderTip: `Walk from Manhattan to Brooklyn — the return trip at sunset gives you the Manhattan skyline framed between the Gothic towers with the sky behind it.`,
    interiorAccess: `Pedestrian walkway always open; enter near City Hall (Manhattan) or Tillary St (Brooklyn)`,
  },
  seagram_building: {
    id: 'seagram_building',
    name: `Seagram Building`,
    fullName: 'Seagram Building',
    neighborhood: 'Midtown East',
    address: '375 Park Ave, New York, NY 10152',
    hours: 'Lobby open weekdays during business hours',
    ticketUrl: 'https://en.wikipedia.org/wiki/Seagram_Building',
    scheduleUrl: 'https://en.wikipedia.org/wiki/Seagram_Building',
    mapUrl: 'https://maps.google.com/?q=Seagram+Building+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Seagram_Building_%2835098307116%29.jpg/440px-Seagram_Building_%2835098307116%29.jpg',
    color: '#e7e5e4',
    accentColor: '#44403c',
    description: `Mies van der Rohe's 1958 bronze-and-glass tower is the purest expression of modernist principles ever built in New York. It set the template for corporate architecture worldwide.`,
    character: `Mies van der Rohe set the building 90 feet back from Park Avenue — voluntarily surrendering prime real estate to create a plaza — and built a tower that revealed its structure rather than hiding it. The bronze I-beams on the exterior are non-structural; they exist purely to articulate the steel skeleton within, to make the construction logic visible. The amber glass, the travertine plaza, the granite-and-teak lobby: every material chosen for clarity and permanence. The Four Seasons Restaurant inside, designed by Philip Johnson, is a separate masterwork. This building taught corporate America what modernism looked like.`,
    specialties: ['International Style', 'Bronze and Glass Construction', 'Setback Plaza', 'Structural Expression'],
    figureIds: ['mies_van_der_rohe'],
    admissionCost: `Free (lobby and plaza)`,
    visitDuration: `15–20 min`,
    bookingNote: `Lobby open weekdays during business hours`,
    familyFriendly: false,
    insiderTip: `Step onto the plaza and look straight up along the bronze I-beam facade — the structural honesty of the building becomes physical in a way photographs never capture.`,
    interiorAccess: `Lobby and plaza open to the public; upper floors are private office space`,
  },
  lever_house: {
    id: 'lever_house',
    name: `Lever House`,
    fullName: 'Lever House',
    neighborhood: 'Midtown East',
    address: '390 Park Ave, New York, NY 10022',
    hours: 'Lobby open weekdays during business hours',
    ticketUrl: 'https://en.wikipedia.org/wiki/Lever_House',
    scheduleUrl: 'https://en.wikipedia.org/wiki/Lever_House',
    mapUrl: 'https://maps.google.com/?q=Lever+House+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Lever_House_390_Park_Avenue.jpg/440px-Lever_House_390_Park_Avenue.jpg',
    color: '#e7e5e4',
    accentColor: '#44403c',
    description: `Gordon Bunshaft's 1952 glass curtain-wall box introduced the International Style to Park Avenue and made glass towers the dominant corporate building type of the 20th century.`,
    character: `Gordon Bunshaft of Skidmore, Owings & Merrill built the first all-glass curtain wall office building on Park Avenue in 1952, and in doing so launched the era of the glass box. The building is organized as a horizontal slab on columns over the street — a covered arcade — with a vertical tower rising from one end. Everything non-structural is glass and stainless steel. No masonry, no ornament. The building showed that transparency and lightness were possible on a commercial scale, that you could build a corporate headquarters that looked genuinely modern rather than merely large. The Seagram Building across the street, built six years later, is the conversation partner.`,
    specialties: ['International Style', 'Glass Curtain Wall', 'Horizontal Slab', 'Corporate Modernism'],
    figureIds: ['gordon_bunshaft'],
    admissionCost: `Free (lobby and arcade)`,
    visitDuration: `15–20 min`,
    bookingNote: `Walk-in weekdays during business hours`,
    familyFriendly: false,
    insiderTip: `Walk through the ground-floor arcade — the glass ceiling and city visible on all sides was genuinely revolutionary in 1952 and still feels it.`,
    interiorAccess: `Ground-floor arcade and lobby open during business hours`,
  },
  un_headquarters: {
    id: 'un_headquarters',
    name: `UN Headquarters`,
    fullName: 'United Nations Headquarters',
    neighborhood: 'Midtown East / Turtle Bay',
    address: '405 E 42nd St, New York, NY 10017',
    hours: 'Public tours available Mon–Fri',
    ticketUrl: 'https://visit.un.org/',
    scheduleUrl: 'https://visit.un.org/',
    mapUrl: 'https://maps.google.com/?q=United+Nations+Headquarters+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/UNheadquarters.jpg/440px-UNheadquarters.jpg',
    color: '#e7e5e4',
    accentColor: '#44403c',
    description: `Le Corbusier's vision for a building that embodied internationalism. The 39-story Secretariat building, completed 1952, introduced the glass curtain wall to the world stage.`,
    character: `Le Corbusier was one of twelve architects on the international design committee, but his scheme — the vertical glass slab — prevailed. The Secretariat building introduced the concept of a building as a pure glass rectangle, with the two broad faces fully glazed and the narrow ends solid marble. The complex also includes the General Assembly building with its distinctive curved roof. The campus sits on international territory — technically not part of New York City — a deliberate symbolic statement about the institution's purpose. The public tour reveals an interior full of art gifts from member nations.`,
    specialties: ['International Style', 'Glass Slab Design', 'International Territory', 'Diplomatic Architecture'],
    figureIds: ['le_corbusier'],
    admissionCost: `$26 adults · $20 seniors · Under 5 free`,
    visitDuration: `1–1.5 hours`,
    bookingNote: `Reserve tour at visit.un.org; photo ID required; closed weekends`,
    familyFriendly: true,
    insiderTip: `The guided tour passes through the Security Council chamber, the General Assembly hall, and rooms filled with art gifts from member nations — an extraordinary collection almost nobody knows about.`,
    interiorAccess: `Interior on guided tours only (Mon–Fri); exterior grounds free to walk`,
  },
  one_wtc: {
    id: 'one_wtc',
    name: `One World Trade Center`,
    fullName: 'One World Trade Center',
    neighborhood: 'Financial District',
    address: '285 Fulton St, New York, NY 10007',
    hours: 'Observatory daily 9am–9pm',
    ticketUrl: 'https://www.oneworldobservatory.com/',
    scheduleUrl: 'https://www.oneworldobservatory.com/',
    mapUrl: 'https://maps.google.com/?q=One+World+Trade+Center+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/One_World_Trade_Center_on_Earth_Day_2013.jpg/440px-One_World_Trade_Center_on_Earth_Day_2013.jpg',
    color: '#f0f9ff',
    accentColor: '#0284c7',
    description: `David Childs' 2014 supertall tower rises 1,776 feet — deliberately matching the year of American independence. A building made legible by its symbolic weight.`,
    character: `David Childs of Skidmore, Owings & Merrill built on the most fraught site in American urban history and produced a building whose meaning can't be separated from its symbolism. The 1,776-foot height is a number, a date, a declaration. The square plan rotates as it rises, creating chamfered glass faces that catch light differently at every angle. The base is clad in prismatic glass panels designed to deter blast — security requirements translated into architecture. The memorial pools, designed by Michael Arad and Peter Walker, occupy the footprints of the original towers and are among the most moving public spaces created in America in the 21st century.`,
    specialties: ['Contemporary Supertall', 'Symbolic Architecture', '9/11 Memorial', 'Glass Tower Design'],
    figureIds: ['david_childs'],
    admissionCost: `$42–$55 observatory tickets`,
    visitDuration: `1–2 hours`,
    bookingNote: `Book online for timed observatory entry`,
    familyFriendly: true,
    insiderTip: `Visit the 9/11 Memorial pools before the observatory — budget separate time to read the names inscribed around the original tower footprints; both experiences together take at least 3 hours.`,
    interiorAccess: `One World Observatory ticketed; 9/11 Memorial pools free and outdoors`,
  },
  high_line: {
    id: 'high_line',
    name: `The High Line`,
    fullName: 'High Line Park',
    neighborhood: 'Chelsea / Meatpacking District',
    address: 'Gansevoort St to 34th St, New York, NY 10011',
    hours: 'Daily 7am–10pm (extended hours in summer)',
    ticketUrl: 'https://www.thehighline.org/',
    scheduleUrl: 'https://www.thehighline.org/events/',
    mapUrl: 'https://maps.google.com/?q=High+Line+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/High_Line_Park%2C_Section_1a.jpg/440px-High_Line_Park%2C_Section_1a.jpg',
    color: '#f0fdf4',
    accentColor: '#15803d',
    description: `Diller Scofidio + Renfro transformed a derelict elevated freight rail line into New York's most influential contemporary public space — the project that defined urban reuse as a design strategy.`,
    character: `Elizabeth Diller and Ricardo Scofidio inherited a mile and a half of abandoned freight rail elevated 30 feet above Chelsea streets and turned it into a linear park that now attracts eight million visitors a year. The design preserved the original rail structure — the I-beams and rail ties are still visible — while threading planting and paving between them. The result created a new model for urban infrastructure reuse that has been copied worldwide. The High Line also catalyzed the transformation of the West Side, triggering billions in development, the Whitney Museum's move downtown, and the Hudson Yards project.`,
    specialties: ['Adaptive Reuse', 'Landscape Architecture', 'Industrial Heritage', 'Urban Park Design'],
    figureIds: ['elizabeth_diller'],
    admissionCost: `Free`,
    visitDuration: `1–2 hours`,
    bookingNote: `Walk-in anytime (daily 7am–10pm)`,
    familyFriendly: true,
    insiderTip: `Start at the Gansevoort Street entrance in the late afternoon and walk north — the Hudson River is on your left and the sun sets directly over it as you walk.`,
    interiorAccess: `Elevated park fully open; enter at Gansevoort, 14th, 16th, 23rd, 26th, or 30th St`,
  },

  // ── THEATER VENUES ───────────────────────────────────────────────────────
  shubert_theatre: {
    id: 'shubert_theatre',
    name: `Shubert Theatre`,
    fullName: 'Shubert Theatre',
    neighborhood: 'Midtown / Theatre District',
    address: '225 W 44th St, New York, NY 10036',
    hours: 'Box office Mon–Sat 10am–8pm · Sun noon–6pm',
    ticketUrl: 'https://shubert.nyc/theatres/shubert/',
    scheduleUrl: 'https://shubert.nyc/theatres/shubert/',
    mapUrl: 'https://maps.google.com/?q=Shubert+Theatre+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Shubert_Theatre.jpg/440px-Shubert_Theatre.jpg',
    color: '#fdf2f8',
    accentColor: '#9d174d',
    description: `The flagship of Broadway's Shubert Organization. A Chorus Line ran here 6,137 performances — the longest Broadway run of its era.`,
    character: `The Shubert is the most important theater in the most important theater district on earth — not because it is the most beautiful, but because it has been the address for Broadway's defining moments. A Chorus Line ran here from 1975 to 1990, setting a record that stood for fifteen years. The horseshoe balcony, the 1,460 seats, the lobby with its original architectural details: this is what Broadway means physically, the room where the form solidified into institution.`,
    specialties: ['Broadway Musicals', 'American Drama', 'Tony Award Winners'],
    figureIds: ['stephen_sondheim', 'lorraine_hansberry', 'tennessee_williams'],
    admissionCost: `$89–$250+`,
    visitDuration: `2.5–3 hours`,
    bookingNote: `Book online months ahead for popular shows`,
    familyFriendly: true,
    insiderTip: `Orchestra seats in rows E–O are the sweet spot — close enough to read facial expressions, far enough back to take in the full set design.`,
    nowPlaying: {
      isDark: true,
      tagline: 'Between productions — Galileo opens Dec 6, 2026 with Raúl Esparza',
      bookingUrl: 'https://www.broadway.com/venues/theaters/shubert-theatre/',
    },
    weeklySchedule: [
      { day: 'Tuesday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Wednesday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Thursday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Friday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Saturday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Wednesday', time: '2pm', performer: 'Current production (matinee)', isAnchor: true },
      { day: 'Saturday', time: '2pm', performer: 'Current production (matinee)', isAnchor: true },
      { day: 'Sunday', time: '2pm', performer: 'Current production (matinee)', isAnchor: true },
    ],

  },
  st_james_theatre: {
    id: 'st_james_theatre',
    name: `St. James Theatre`,
    fullName: 'St. James Theatre',
    neighborhood: 'Midtown / Theatre District',
    address: '246 W 44th St, New York, NY 10036',
    hours: 'Box office Mon–Sat 10am–8pm · Sun noon–6pm',
    ticketUrl: 'https://shubert.nyc/theatres/st-james/',
    scheduleUrl: 'https://shubert.nyc/theatres/st-james/',
    mapUrl: 'https://maps.google.com/?q=St+James+Theatre+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/St_James_Theatre_-_Frozen_%2848296062327%29.jpg/440px-St_James_Theatre_-_Frozen_%2848296062327%29.jpg',
    color: '#fdf2f8',
    accentColor: '#9d174d',
    description: `Where Oklahoma! invented the modern musical in 1943 and Hamilton tried out before moving down the block. The 1,710-seat home of Broadway's biggest productions.`,
    character: `Oklahoma! opened at the St. James on March 31, 1943 and ran 2,212 performances. Rodgers and Hammerstein's first collaboration was also Broadway's first truly integrated musical — every song advanced the plot, every dance expressed character — and it happened in this building. The Producers opened here in 2001 and won a record twelve Tony Awards. The St. James is one of the few houses large enough for the most technically demanding productions, which is why the biggest shows keep coming.`,
    specialties: ['Large-Scale Musicals', 'Tony Award Winners', 'Historic Productions'],
    figureIds: ['richard_rodgers'],
    admissionCost: `$89–$299+`,
    visitDuration: `2.5–3 hours`,
    bookingNote: `Book well in advance; lottery tickets often available`,
    familyFriendly: true,
    insiderTip: `The St. James has the most generous sightlines of the large Broadway houses — even rear orchestra seats have fully unobstructed views of the entire stage.`,
    nowPlaying: {
      title: 'Titanique',
      tagline: 'A camp retelling of Titanic through the music of Céline Dion, starring Jim Parsons and Melissa Barrera',
      through: 'Through Sept 20, 2026',
      bookingUrl: 'https://www.broadway.com/shows/titanique/',
    },
    weeklySchedule: [
      { day: 'Tuesday', time: '8pm', performer: 'Titanique', isAnchor: true },
      { day: 'Wednesday', time: '8pm', performer: 'Titanique', isAnchor: true },
      { day: 'Thursday', time: '8pm', performer: 'Titanique', isAnchor: true },
      { day: 'Friday', time: '8pm', performer: 'Titanique', isAnchor: true },
      { day: 'Saturday', time: '8pm', performer: 'Titanique', isAnchor: true },
      { day: 'Wednesday', time: '2pm', performer: 'Titanique (matinee)', isAnchor: true },
      { day: 'Saturday', time: '2pm', performer: 'Titanique (matinee)', isAnchor: true },
      { day: 'Sunday', time: '2pm', performer: 'Titanique (matinee)', isAnchor: true },
    ],

  },
  majestic_theatre: {
    id: 'majestic_theatre',
    name: `Majestic Theatre`,
    fullName: 'Majestic Theatre',
    neighborhood: 'Midtown / Theatre District',
    address: '245 W 44th St, New York, NY 10036',
    hours: 'Box office Mon–Sat 10am–8pm · Sun noon–6pm',
    ticketUrl: 'https://shubert.nyc/theatres/majestic/',
    scheduleUrl: 'https://shubert.nyc/theatres/majestic/',
    mapUrl: 'https://maps.google.com/?q=Majestic+Theatre+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Majestic_Theatre_-_NYC_%2852302522949%29.jpg/440px-Majestic_Theatre_-_NYC_%2852302522949%29.jpg',
    color: '#fdf2f8',
    accentColor: '#9d174d',
    description: `Home of The Phantom of the Opera for 35 years and 13,981 performances — the longest run in Broadway history. South Pacific made its debut here in 1949.`,
    character: `The Phantom of the Opera ran at the Majestic from January 26, 1988 to April 16, 2023 — 35 years, 13,981 performances, the longest run in Broadway history. The chandelier that drops over the audience in Act One was engineered into the theater's structure. Before Phantom arrived, South Pacific ran here from 1949; before that, Carousel. The Majestic has the largest stage on Broadway, which is why it keeps attracting productions of the most physical ambition.`,
    specialties: ['Longest-Running Shows', 'Large-Scale Musicals', 'Historic Productions'],
    figureIds: ['richard_rodgers'],
    admissionCost: `$89–$299+`,
    visitDuration: `2.5–3 hours`,
    bookingNote: `Book online; popular shows sell out months ahead`,
    familyFriendly: true,
    insiderTip: `Broadway's largest stage is above you — look up into the fly tower during intermission to understand the engineering scale of what you just watched.`,
    nowPlaying: {
      isDark: true,
      tagline: 'Between productions — check the Majestic schedule for upcoming bookings',
      bookingUrl: 'https://shubert.nyc/theatres/majestic/',
    },
    weeklySchedule: [
      { day: 'Tuesday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Wednesday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Thursday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Friday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Saturday', time: '8pm', performer: 'Current production', isAnchor: true },
      { day: 'Wednesday', time: '2pm', performer: 'Current production (matinee)', isAnchor: true },
      { day: 'Saturday', time: '2pm', performer: 'Current production (matinee)', isAnchor: true },
      { day: 'Sunday', time: '2pm', performer: 'Current production (matinee)', isAnchor: true },
    ],

  },
  richard_rodgers_theatre: {
    id: 'richard_rodgers_theatre',
    name: `Richard Rodgers Theatre`,
    fullName: 'Richard Rodgers Theatre',
    neighborhood: 'Midtown / Theatre District',
    address: '226 W 46th St, New York, NY 10036',
    hours: 'Box office Mon–Sat 10am–8pm · Sun noon–6pm',
    ticketUrl: 'https://www.hamiltonmusical.com/new-york/',
    scheduleUrl: 'https://www.hamiltonmusical.com/new-york/',
    mapUrl: 'https://maps.google.com/?q=Richard+Rodgers+Theatre+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Rodgers_Theater_-_Hamilton_%2848193460677%29.jpg/440px-Rodgers_Theater_-_Hamilton_%2848193460677%29.jpg',
    color: '#fdf2f8',
    accentColor: '#9d174d',
    description: `The 1,319-seat theater where Hamilton opened in August 2015 and has not left. The room where everything happened.`,
    character: `Hamilton arrived at the Richard Rodgers in August 2015 after developing at the Public Theater and has remained. Lin-Manuel Miranda's hip-hop musical won the Pulitzer Prize, broke the record for Tony wins, and generated a cultural conversation that eclipsed virtually every other theatrical event of the decade. The theater itself — built in 1925 as the 46th Street Theatre, renamed in 1990 for the composer — is mid-sized by Broadway standards. What it carries now is the weight of what happened here: the eleven Tonys, the cast recording, the filmed version, the years of sold-out performances.`,
    specialties: ['Hamilton', 'Contemporary Musicals', 'Tony Award Winners'],
    figureIds: ['lin_manuel_miranda'],
    admissionCost: `$199–$900+`,
    visitDuration: `3 hours`,
    bookingNote: `Book months ahead; enter the $10 lottery via the Hamilton app daily`,
    familyFriendly: true,
    insiderTip: `The Hamilton lottery takes about two minutes to enter via the app — two seats drawn before each performance for $10 each; one of the best gambles in theater.`,
    nowPlaying: {
      title: 'Hamilton',
      tagline: 'The Pulitzer Prize-winning hip-hop musical about Alexander Hamilton — the show that redefined Broadway',
      through: 'Running now',
      bookingUrl: 'https://www.hamiltonmusical.com/new-york/',
    },
    weeklySchedule: [
      { day: 'Tuesday', time: '8pm', performer: 'Hamilton', isAnchor: true },
      { day: 'Wednesday', time: '8pm', performer: 'Hamilton', isAnchor: true },
      { day: 'Thursday', time: '8pm', performer: 'Hamilton', isAnchor: true },
      { day: 'Friday', time: '8pm', performer: 'Hamilton', isAnchor: true },
      { day: 'Saturday', time: '8pm', performer: 'Hamilton', isAnchor: true },
      { day: 'Wednesday', time: '2pm', performer: 'Hamilton (matinee)', isAnchor: true },
      { day: 'Saturday', time: '2pm', performer: 'Hamilton (matinee)', isAnchor: true },
      { day: 'Sunday', time: '2pm', performer: 'Hamilton (matinee)', isAnchor: true },
    ],

  },
  imperial_theatre: {
    id: 'imperial_theatre',
    name: `Imperial Theatre`,
    fullName: 'Imperial Theatre',
    neighborhood: 'Midtown / Theatre District',
    address: '249 W 45th St, New York, NY 10036',
    hours: 'Box office Mon–Sat 10am–8pm · Sun noon–6pm',
    ticketUrl: 'https://shubert.nyc/theatres/imperial/',
    scheduleUrl: 'https://shubert.nyc/theatres/imperial/',
    mapUrl: 'https://maps.google.com/?q=Imperial+Theatre+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ImperialTheatreNYC.jpg/440px-ImperialTheatreNYC.jpg',
    color: '#fdf2f8',
    accentColor: '#9d174d',
    description: `Where Gypsy, Fiddler on the Roof, Annie, and Les Misérables made Broadway history. The Imperial's stage has defined American musical theater across six decades.`,
    character: `Gypsy opened at the Imperial in May 1959, with Ethel Merman giving what critics consider the greatest performance in Broadway history. Fiddler on the Roof ran 3,242 performances beginning in 1964 — then the longest run in Broadway history. Annie arrived in 1977. Les Misérables ran here for years. Dreamgirls. The list of musicals that defined American theater and called the Imperial home reads like the entire canon of the form. The 1,453-seat house has been virtually continuously occupied since 1923.`,
    specialties: ['Classic Musicals', 'Record-Breaking Runs', 'American Musical Theater'],
    figureIds: ['stephen_sondheim'],
    admissionCost: `$89–$299+`,
    visitDuration: `2.5–3 hours`,
    bookingNote: `Book online; lottery available for some shows`,
    familyFriendly: true,
    insiderTip: `The Imperial's mezzanine front row (Row A) is the ideal angle for musicals — elevated enough to see full choreography, close enough to hear the orchestra clearly.`,
    nowPlaying: {
      title: 'Chess',
      tagline: `Cold War-era musical with Lea Michele and Aaron Tveit — the Cold War thriller by ABBA songwriters Björn & Benny`,
      through: 'Through summer 2026',
      bookingUrl: 'https://www.broadway.com/shows/chess/',
    },
    weeklySchedule: [
      { day: 'Tuesday', time: '8pm', performer: 'Chess', isAnchor: true },
      { day: 'Wednesday', time: '8pm', performer: 'Chess', isAnchor: true },
      { day: 'Thursday', time: '8pm', performer: 'Chess', isAnchor: true },
      { day: 'Friday', time: '8pm', performer: 'Chess', isAnchor: true },
      { day: 'Saturday', time: '8pm', performer: 'Chess', isAnchor: true },
      { day: 'Wednesday', time: '2pm', performer: 'Chess (matinee)', isAnchor: true },
      { day: 'Saturday', time: '2pm', performer: 'Chess (matinee)', isAnchor: true },
      { day: 'Sunday', time: '2pm', performer: 'Chess (matinee)', isAnchor: true },
    ],

  },
  public_theater: {
    id: 'public_theater',
    name: `The Public Theater`,
    fullName: 'The Public Theater',
    neighborhood: 'NoHo / East Village',
    address: '425 Lafayette St, New York, NY 10003',
    hours: 'Box office Tue–Sun noon–8pm',
    ticketUrl: 'https://publictheater.org/productions/',
    scheduleUrl: 'https://publictheater.org/productions/',
    mapUrl: 'https://maps.google.com/?q=The+Public+Theater+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/The_Public_Theater_%2848072652481%29.jpg/440px-The_Public_Theater_%2848072652481%29.jpg',
    color: '#fdf2f8',
    accentColor: '#9d174d',
    description: `Joseph Papp's nonprofit theater launched Hair, A Chorus Line, and Hamilton — the three most commercially successful musicals in Broadway history. The laboratory where American theater is made.`,
    character: `The Public is where American theater lives when it is not trying to make money. Joseph Papp created it in 1954 to produce free Shakespeare in Central Park (the Delacorte is the outdoor component). The indoor spaces on Lafayette Street launched Hair, A Chorus Line, and Hamilton — each of which transferred to Broadway after beginning here. Ntozake Shange's For Colored Girls premiered here. August Wilson. Suzan-Lori Parks. The Public runs on subsidy and foundation funding, which means it can take risks Broadway cannot. That freedom has produced the American theater's most important work for seventy years.`,
    specialties: ['New Play Development', 'World Premieres', 'Shakespeare in the Park'],
    figureIds: ['august_wilson', 'lorraine_hansberry', 'lin_manuel_miranda'],
    admissionCost: `$50–$130 · Shakespeare in the Park is free`,
    visitDuration: `2–3 hours`,
    bookingNote: `Book in advance; Shakespeare in Park free tickets are day-of only`,
    familyFriendly: true,
    insiderTip: `Preview performances (before press opening night) are 30–50% cheaper — same production, same cast, often a better seat.`,
    nowPlaying: {
      title: 'Check the full season',
      tagline: 'Multiple shows running across five stages — including Girl, Interrupted and the Shakespeare in the Park summer season',
      through: 'See full calendar',
      bookingUrl: 'https://publictheater.org/calendar/',
    },
  },
  delacorte_theater: {
    id: 'delacorte_theater',
    name: `Delacorte Theater`,
    fullName: 'Delacorte Theater / Shakespeare in the Park',
    neighborhood: 'Central Park (Upper West Side)',
    address: 'Central Park, near 81st St, New York, NY 10024',
    hours: 'Performances Jun–Sep, Tue–Sun · Free tickets distributed day-of',
    ticketUrl: 'https://publictheater.org/programs-initiatives/shakespeare-in-the-park/',
    scheduleUrl: 'https://publictheater.org/programs-initiatives/shakespeare-in-the-park/',
    mapUrl: 'https://maps.google.com/?q=Delacorte+Theater+Central+Park+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Shakespeare_in_the_Park_July_2021.jpg/440px-Shakespeare_in_the_Park_July_2021.jpg',
    color: '#fdf2f8',
    accentColor: '#9d174d',
    description: `Free Shakespeare in Central Park every summer since 1962. 1,800 seats, open air, with the Manhattan skyline as a backdrop.`,
    character: `Every summer since 1962, New Yorkers have queued for hours to see free Shakespeare performed in an open-air theater in the middle of Central Park. The Delacorte was built at Joe Papp's insistence and operates as the outdoor arm of the Public Theater. Past casts have included Meryl Streep, James Earl Jones, Morgan Freeman, Denzel Washington, Kevin Kline, Natalie Portman, and virtually every significant American actor of the past sixty years. Free tickets are distributed on the day of each performance — either at the Delacorte gates or online. No other city has produced anything comparable.`,
    specialties: ['Free Shakespeare', 'Outdoor Theater', 'Summer Only'],
    figureIds: ['lin_manuel_miranda'],
    admissionCost: `Free`,
    visitDuration: `3 hours`,
    bookingNote: `Free tickets at Delacorte gates or online lottery at noon day-of`,
    familyFriendly: true,
    insiderTip: `Line up at the Delacorte starting at noon for high-demand shows — bring a picnic and something to read; the line itself has been a New York summer ritual since 1962.`,
    nowPlaying: {
      title: 'Romeo & Juliet',
      tagline: 'Free Shakespeare in the Park, directed by Saheem Ali — tickets by lottery at noon each day of performance',
      through: 'Summer 2026',
      bookingUrl: 'https://publictheater.org/productions/season/2526/sftc/romeo-juliet/',
    },
  },

  // ── HISTORY VENUES ───────────────────────────────────────────────────────
  federal_hall: {
    id: 'federal_hall',
    name: `Federal Hall`,
    fullName: 'Federal Hall National Memorial',
    neighborhood: 'Financial District',
    address: '26 Wall St, New York, NY 10005',
    hours: 'Mon–Fri 9am–5pm · Free admission',
    ticketUrl: 'https://www.nps.gov/feha/index.htm',
    scheduleUrl: 'https://www.nps.gov/feha/index.htm',
    mapUrl: 'https://maps.google.com/?q=Federal+Hall+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Federal_Hall_%2848126566178%29.jpg/440px-Federal_Hall_%2848126566178%29.jpg',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `On this spot on April 30, 1789, George Washington took the first presidential oath of office. The Bill of Rights was drafted in this block. The United States government was organized here.`,
    character: `The building standing at 26 Wall Street is not the original Federal Hall — that structure, where Washington was inaugurated, was demolished in 1812. This Greek Revival replacement was built as the U.S. Customs House. But the site has as strong a claim to being the founding location of American democracy as any place in the country. The statue of Washington on the steps stands where the balcony once was. The interior holds the original Bible on which Washington took his oath. Across the street is the New York Stock Exchange, which traces its origins to a meeting of twenty-four stockbrokers under a buttonwood tree on this block in 1792.`,
    specialties: ['American Founding', 'Washington Inauguration', 'Bill of Rights', 'Free Admission'],
    figureIds: ['george_washington', 'alexander_hamilton'],
    admissionCost: `Free`,
    visitDuration: `30–45 min`,
    bookingNote: `Walk-in Mon–Fri 9am–5pm; closed weekends`,
    familyFriendly: true,
    insiderTip: `Stand on the steps where the balcony once was — Washington took the first presidential oath here on April 30, 1789, on a Bible still preserved inside the building.`,
  },
  fraunces_tavern: {
    id: 'fraunces_tavern',
    name: `Fraunces Tavern`,
    fullName: `Fraunces Tavern Museum`,
    neighborhood: 'Financial District',
    address: '54 Pearl St, New York, NY 10004',
    hours: 'Mon–Fri noon–5pm · Sat–Sun 11am–5pm',
    ticketUrl: 'https://www.frauncestavernmuseum.org/',
    scheduleUrl: 'https://www.frauncestavernmuseum.org/',
    mapUrl: 'https://maps.google.com/?q=Fraunces+Tavern+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Frauncestavern.JPG/440px-Frauncestavern.JPG',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `One of the oldest surviving buildings in New York City. On December 4, 1783, Washington said farewell to his officers in the Long Room upstairs — and chose to go home rather than become king.`,
    character: `On December 4, 1783, George Washington gathered his officers in the Long Room upstairs and said goodbye. The Revolutionary War was over, and Washington — at the height of his power, when he could have declared himself king — was resigning his commission and going home. The Long Room still exists, restored to its 1783 appearance. The tavern itself, a Georgian brick building from 1719, is one of the oldest surviving structures in New York City. The basement and first floor operate as a restaurant; the upper floors are a museum of the Revolutionary era with period artifacts and documents.`,
    specialties: ['Revolutionary War', 'Washington Farewell', '18th-Century Architecture', 'Museum & Restaurant'],
    figureIds: ['george_washington', 'alexander_hamilton'],
    admissionCost: `$8 museum · Restaurant priced separately`,
    visitDuration: `1 hour`,
    bookingNote: `Walk-in for museum; restaurant reservation recommended at lunch`,
    familyFriendly: true,
    insiderTip: `Ask to see the Long Room on the second floor — restored to its 1783 appearance, this is where Washington said farewell to his officers and chose to go home rather than become a king.`,
  },
  african_burial_ground: {
    id: 'african_burial_ground',
    name: `African Burial Ground`,
    fullName: 'African Burial Ground National Monument',
    neighborhood: 'Lower Manhattan / Civic Center',
    address: '290 Broadway, New York, NY 10007',
    hours: 'Mon–Sat 9am–5pm · Free admission',
    ticketUrl: 'https://www.nps.gov/afbg/index.htm',
    scheduleUrl: 'https://www.nps.gov/afbg/index.htm',
    mapUrl: 'https://maps.google.com/?q=African+Burial+Ground+National+Monument+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/African_Burial_Ground.jpg/440px-African_Burial_Ground.jpg',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `The largest known pre-Revolutionary African burial ground in North America, rediscovered in 1991 during construction. More than 400 individuals were buried here, many of them enslaved.`,
    character: `In 1991, construction workers excavating a foundation at 290 Broadway struck human remains. What they had found was a burial ground used from the mid-17th century to 1795 — the largest known pre-Revolutionary African burial ground in North America. Over 400 individuals had been buried here, many of them enslaved, many of them children. The discovery forced New York to reckon with a history it had buried: that slavery was practiced in the North, that Black New Yorkers were present at the founding, and that the city's wealth was built in significant part by enslaved labor. The outdoor memorial and the visitor center tell this history directly and without evasion.`,
    specialties: ['African American History', 'Colonial New York', 'National Monument', 'Free Admission'],
    figureIds: ['frederick_douglass'],
    admissionCost: `Free`,
    visitDuration: `30–45 min`,
    bookingNote: `Walk-in Mon–Sat 9am–5pm`,
    familyFriendly: true,
    insiderTip: `Spend time at the outdoor granite memorial before entering the visitor center — the carved symbolism speaks more directly than the exhibits inside.`,
  },
  ellis_island: {
    id: 'ellis_island',
    name: `Ellis Island`,
    fullName: 'Ellis Island National Museum of Immigration',
    neighborhood: 'Upper New York Bay (ferry from Battery Park)',
    address: 'Ellis Island, New York, NY 10004',
    hours: 'Daily 9am–5pm (ferry schedule varies)',
    ticketUrl: 'https://www.statueoflibertyferry.com/',
    scheduleUrl: 'https://www.statueoflibertyferry.com/',
    mapUrl: 'https://maps.google.com/?q=Ellis+Island+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Aerial_view_of_Ellis_Island%2C_Jersey_City%2C_New_Jersey_LCCN2011635626_-_cropped_balance.jpg/440px-Aerial_view_of_Ellis_Island%2C_Jersey_City%2C_New_Jersey_LCCN2011635626_-_cropped_balance.jpg',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `Between 1892 and 1954, twelve million people entered the United States through this island. If your family came through, the records are here — searchable, and still moving to read.`,
    character: `Between 1892 and 1954, twelve million people entered the United States through Ellis Island. They came from Italy, Poland, Russia, Greece, Hungary, and a hundred other places; they came to escape poverty, persecution, and conscription; they were processed through the Great Hall in a system that could handle 5,000 people a day. The records are searchable online — if your family came through Ellis Island, you can find their arrival manifest. The building, abandoned from 1954 until its restoration opened in 1990, now operates as an immigration museum with the original Registry Room intact. The baggage room, medical inspection areas, and dormitories are preserved.`,
    specialties: ['Immigration History', 'Ancestor Research', 'Great Hall', 'Ferry Required'],
    figureIds: ['emma_goldman', 'jacob_riis'],
    admissionCost: `$24.50 adults (includes ferry and Statue of Liberty)`,
    visitDuration: `2–3 hours`,
    bookingNote: `Book ferry online — tickets sell out in summer`,
    familyFriendly: true,
    insiderTip: `Search your family name in the Ellis Island arrival database online before you visit — reading your ancestor's manifest in the actual Great Hall is unlike any other experience.`,
  },
  tenement_museum: {
    id: 'tenement_museum',
    name: `Tenement Museum`,
    fullName: 'Lower East Side Tenement Museum',
    neighborhood: 'Lower East Side',
    address: '103 Orchard St, New York, NY 10002',
    hours: 'Daily 10am–6:30pm · Tours only (reservation required)',
    ticketUrl: 'https://www.tenement.org/tours/',
    scheduleUrl: 'https://www.tenement.org/tours/',
    mapUrl: 'https://maps.google.com/?q=Tenement+Museum+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Tenement_Museum_exterior_4.jpg/440px-Tenement_Museum_exterior_4.jpg',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `A preserved 1863 tenement where ~7,000 people from 20+ nations lived between 1863 and 1935. The most precise look available anywhere at how immigrants actually lived in New York.`,
    character: `97 Orchard Street was built in 1863 and housed approximately 7,000 people from over twenty nations in the seventy years of its operation. The apartments were sealed in 1935 when new housing codes required improvements the owner refused to make. When historians opened them in 1988, the rooms were largely intact — peeling wallpaper, furniture, family photographs still on the walls. The museum reconstructs the lives of specific documented residents: the German-Jewish Gumpertz family in 1878, the Italian Catholic Baldizzi family in 1935, the Sephardic Jewish Levine family in 1897. Tours are small and reservation-required. This is the most intimate experience of immigrant New York available anywhere.`,
    specialties: ['Immigrant Life', 'Preserved Apartments', 'Guided Tours Only', 'Reservation Required'],
    figureIds: ['jacob_riis'],
    admissionCost: `$30 adults`,
    visitDuration: `1.5 hours`,
    bookingNote: `Reservation required — book at least a week ahead`,
    familyFriendly: false,
    insiderTip: `The Hard Times tour (1930s Baldizzi family) is the most emotionally immediate — the Depression-era kitchen has been unchanged since 1935.`,
  },
  stonewall_inn: {
    id: 'stonewall_inn',
    name: `Stonewall Inn`,
    fullName: 'Stonewall Inn National Monument',
    neighborhood: 'Greenwich Village',
    address: '51-53 Christopher St, New York, NY 10014',
    hours: 'Bar open daily (hours vary) · Exterior always accessible',
    ticketUrl: 'https://www.stonewallinnnyc.com/',
    scheduleUrl: 'https://www.stonewallinnnyc.com/',
    mapUrl: 'https://maps.google.com/?q=Stonewall+Inn+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Stonewall_Inn_5_pride_weekend_2016.jpg/440px-Stonewall_Inn_5_pride_weekend_2016.jpg',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `Site of the June 28, 1969 uprising that launched the modern LGBTQ+ rights movement. Designated a national monument in 2016. The bar is still open.`,
    character: `In the early hours of June 28, 1969, police raided the Stonewall Inn — a routine occurrence, since the bar operated without a liquor license and the NYPD regularly raided gay establishments. This time, the patrons fought back. The uprising lasted several nights and drew hundreds of protesters. Within months, the Gay Liberation Front and the Gay Activists Alliance had formed. Within a year, the first gay pride marches had taken place in New York and Los Angeles on the anniversary of Stonewall. The bar is still open, designated a national monument in 2016 — the first national monument to LGBTQ+ history in the United States. The rainbow flag flies from the building at all times.`,
    specialties: ['LGBTQ+ History', 'National Monument', 'Still a Bar', '1969 Uprising'],
    figureIds: ['marsha_p_johnson'],
    admissionCost: `Free (exterior) · Bar has cover some nights`,
    visitDuration: `30–60 min`,
    bookingNote: `Exterior always accessible; bar walk-in most nights`,
    familyFriendly: false,
    insiderTip: `Walk across to Christopher Park to see the George Segal sculptures of LGBTQ+ couples — view the Stonewall facade and the park together for the full story.`,
  },
  hamilton_grange: {
    id: 'hamilton_grange',
    name: `Hamilton Grange`,
    fullName: 'Hamilton Grange National Memorial',
    neighborhood: 'Harlem (St. Nicholas Park)',
    address: '414 W 141st St, New York, NY 10031',
    hours: 'Wed–Sun 9am–5pm · Free admission',
    ticketUrl: 'https://www.nps.gov/hagr/index.htm',
    scheduleUrl: 'https://www.nps.gov/hagr/index.htm',
    mapUrl: 'https://maps.google.com/?q=Hamilton+Grange+National+Memorial+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hamilton_Grange_National_Memorial_-_Entrance_%2848170424452%29.jpg/440px-Hamilton_Grange_National_Memorial_-_Entrance_%2848170424452%29.jpg',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `The only home Alexander Hamilton ever owned. He lived here from 1802 until his death in a duel in 1804. Restored to its 1802 appearance, free to visit.`,
    character: `Alexander Hamilton built this Federal-style house in 1802 on what was then farmland in upper Manhattan, named it The Grange after his grandfather's Scottish estate, and lived here with his wife Eliza and seven children for the last two years of his life. He died in a duel with Aaron Burr on July 11, 1804. The house was moved twice — once in 1889, again in 2008 to its current location in St. Nicholas Park, where it has been restored to its 1802 appearance. The double parlors, the piazza, the original woodwork: all represent the domestic life of the man who invented American finance and died at 49.`,
    specialties: ['Alexander Hamilton', 'Federal Architecture', 'Free Admission', 'National Memorial'],
    figureIds: ['alexander_hamilton'],
    admissionCost: `Free`,
    visitDuration: `45–60 min`,
    bookingNote: `Walk-in Wed–Sun 9am–5pm; ranger-led tours highly recommended`,
    familyFriendly: true,
    insiderTip: `Take the free ranger-led tour — the guides trace the full arc of Hamilton's life from immigrant orphan to Treasury Secretary to the duel, making the Federal parlors genuinely moving.`,
  },
  schomburg_center: {
    id: 'schomburg_center',
    name: `Schomburg Center`,
    fullName: 'Schomburg Center for Research in Black Culture',
    neighborhood: 'Harlem',
    address: '515 Malcolm X Blvd, New York, NY 10037',
    hours: 'Mon–Sat 10am–6pm · Free admission',
    ticketUrl: 'https://www.nypl.org/locations/schomburg',
    scheduleUrl: 'https://www.nypl.org/events',
    mapUrl: 'https://maps.google.com/?q=Schomburg+Center+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Schomburg_Center_for_Research_in_Black_Culture_%2852008381132%29.jpg/440px-Schomburg_Center_for_Research_in_Black_Culture_%2852008381132%29.jpg',
    color: '#fef9c3',
    accentColor: '#a16207',
    description: `The institutional memory of the African diaspora — over 11 million items documenting Black history and culture worldwide. W.E.B. Du Bois's papers are here. So is the James Van Der Zee photography archive.`,
    character: `Arturo Schomburg, a Puerto Rican of Afro-Caribbean descent, spent his life collecting books, manuscripts, and artifacts by and about Africans and African Americans — at a time when academic history essentially erased Black people from its narrative. In 1925 he sold his collection of 5,000 items to the New York Public Library, and the Harlem branch became its home. The collection now contains over 11 million items: the James Van Der Zee photography archive, W.E.B. Du Bois's papers, the Langston Hughes papers, and materials documenting the Harlem Renaissance that nowhere else preserves. The reading rooms are open to researchers; the gallery exhibitions are free.`,
    specialties: ['African American History', 'Harlem Renaissance', 'Research Library', 'Free Exhibitions'],
    figureIds: ['shirley_chisholm', 'frederick_douglass'],
    admissionCost: `Free`,
    visitDuration: `1–2 hours`,
    bookingNote: `Walk-in Mon–Sat 10am–6pm`,
    familyFriendly: true,
    insiderTip: `The gallery exhibitions change seasonally and are consistently among the best free shows in Harlem — check what is currently on before you visit.`,
  },


  // ── Hip-Hop ──────────────────────────────────────────────────────────────
  one_five_two_zero: {
    id: 'one_five_two_zero',
    name: '1520 Sedgwick Avenue',
    fullName: '1520 Sedgwick Avenue',
    neighborhood: 'Morris Heights, The Bronx',
    address: '1520 Sedgwick Ave, Morris Heights, Bronx, NY 10453',
    hours: 'Exterior visible anytime; private residential building',
    ticketUrl: null,
    scheduleUrl: null,
    mapUrl: 'https://maps.google.com/?q=1520+Sedgwick+Ave,+Bronx,+NY',
    color: '#fef3c7',
    accentColor: '#b45309',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/1520_Sedwick_Ave.%2C_Bronx%2C_New_York1.JPG',
    description: `On August 11, 1973, DJ Kool Herc threw a back-to-school party in the recreation room of this apartment building. He played two copies of the same record on two turntables, extending the percussion break indefinitely — the merry-go-round technique. That night, hip-hop was born.`,
    character: `This six-story residential building in Morris Heights is the most important address in music history that most people have never heard of. Clive Campbell — DJ Kool Herc — moved here from Kingston, Jamaica at age 12. His sister Cindy organized the party on August 11, 1973 as a back-to-school fundraiser. What he did with two turntables that night created an entirely new art form. The building is still residential. A plaque marks its significance. The neighborhood around it — the parks, the streets, the community — is the geography hip-hop grew out of.`,
    specialties: ['Birthplace of Hip-Hop', 'DJ Kool Herc', 'Bronx History'],
    figureIds: ['dj_kool_herc', 'grandmaster_flash', 'afrika_bambaataa'],
    admissionCost: 'Free (exterior only)',
    visitDuration: '30 minutes',
    bookingNote: 'No booking needed — exterior visit and surrounding neighborhood walk',
    familyFriendly: true,
    insiderTip: 'Take the D train to 170th Street. Walk the surrounding blocks — Cedar Park across the street is where the outdoor jams moved when the parties got too big for the building.',
    priceNote: 'Free',
  },
  universal_hip_hop_museum: {
    id: 'universal_hip_hop_museum',
    name: 'Universal Hip Hop Museum',
    fullName: 'Universal Hip Hop Museum',
    neighborhood: 'Melrose, The Bronx',
    address: '610 Exterior St, Melrose, Bronx, NY 10451',
    hours: 'Wed–Sun 10am–6pm',
    ticketUrl: 'https://uhhm.org/visit',
    scheduleUrl: 'https://uhhm.org',
    mapUrl: 'https://maps.google.com/?q=610+Exterior+St,+Bronx,+NY',
    color: '#1c1917',
    accentColor: '#fbbf24',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Bronx_Pt_-_Hip_Hop_Museum_-_Concourse%2C_The_Bronx_NY.jpg',
    description: `Opened in 2023 near Yankee Stadium, the Universal Hip Hop Museum is the first institution dedicated to preserving hip-hop\'s global cultural legacy, tracing the genre from the South Bronx block parties of 1973 through its current global reach.`,
    character: `The Universal Hip Hop Museum sits in the same Bronx borough where hip-hop was born fifty years ago — a deliberate choice. Its galleries trace the four elements (DJing, MCing, Breaking, Graffiti), the genre\'s evolution through the decades, and its transformation from a neighborhood art form into the most globally influential popular music of the last half-century. The archives include original equipment, rare recordings, costumes, and documents. Rotating exhibitions bring in contemporary artists and scholars. It is the first permanent institution dedicated entirely to this history.`,
    specialties: ['Hip-Hop History', 'Four Elements', 'Bronx Origins', 'Rotating Exhibitions'],
    figureIds: ['dj_kool_herc', 'grandmaster_flash', 'afrika_bambaataa'],
    admissionCost: 'Adults $25 · Students $15 · Under 12 free',
    visitDuration: '2–3 hours',
    bookingNote: 'Tickets available online; book ahead on weekends',
    familyFriendly: true,
    insiderTip: 'Take the 4 or D train to 161st St–Yankee Stadium. Combine with a walk through the South Bronx to see the geography that created the music.',
    priceNote: 'Adults $25',
  },
  apollo_theater_hh: {
    id: 'apollo_theater_hh',
    name: 'Apollo Theater',
    fullName: 'Apollo Theater',
    neighborhood: 'Harlem',
    address: '253 W 125th St, New York, NY 10027',
    hours: 'Box office Mon–Sat 12–6pm; show times vary',
    ticketUrl: 'https://apollotheater.org/tickets',
    scheduleUrl: 'https://apollotheater.org',
    mapUrl: 'https://maps.google.com/?q=Apollo+Theater,+253+W+125th+St,+New+York',
    color: '#fef3c7',
    accentColor: '#92400e',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Harlem_-_Apollo_Theater_%2848555309512%29.jpg',
    description: `Since 1934, the Apollo has been the defining stage of Black American performance. Amateur Night — still running every Wednesday — has launched more careers than any talent show in history. For hip-hop, the Apollo represented the ultimate validation.`,
    character: `James Brown recorded Live at the Apollo here in 1962. Every significant Black American performer has played this stage. For hip-hop, the Apollo was the ultimate proving ground — an audience famously unforgiving of mediocrity and famously explosive in its approval. Amateur Night on Wednesdays has been running since 1934: anyone can enter, the audience decides, and the acts that survive the crowd have earned something real. Several hip-hop careers were launched or cemented on this stage.`,
    specialties: ['Amateur Night (Wednesdays)', 'Live Concerts', 'Harlem History'],
    figureIds: ['rakim', 'll_cool_j', 'notorious_big'],
    admissionCost: 'Amateur Night from $22 · Concerts vary',
    visitDuration: '2–3 hours per show',
    bookingNote: 'Book online; Amateur Night tickets sell out quickly',
    familyFriendly: true,
    insiderTip: 'Wednesday Amateur Night is one of the most electric rooms in New York. The audience is famously unforgiving and famously enthusiastic — often both in the same evening.',
    priceNote: 'From $22',
  },
  rucker_park: {
    id: 'rucker_park',
    name: 'Rucker Park',
    fullName: 'Holcombe Rucker Park',
    neighborhood: 'Harlem',
    address: '155th St & Frederick Douglass Blvd, New York, NY 10039',
    hours: 'Outdoor court open dawn to dusk · Summer tournament season June–August',
    ticketUrl: null,
    scheduleUrl: null,
    mapUrl: 'https://maps.google.com/?q=Rucker+Park+Harlem+New+York',
    color: '#f0fdf4',
    accentColor: '#15803d',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Rucker_Park_%28WTM_wikiWhat_023%29.jpg',
    description: `The legendary outdoor basketball court at 155th Street has hosted some of the greatest streetball in history — and, in the summers, some of the greatest hip-hop performances. Artists would perform courtside during tournaments, turning summer games into concerts.`,
    character: `Rucker Park is where basketball and hip-hop converged in the open air of Harlem. The Entertainers Basketball Classic (EBC) summer tournament has drawn Kobe Bryant, Kevin Durant, and LeBron James to play alongside local legends. In the 1990s and 2000s, hip-hop artists — Jay-Z, Nas, Busta Rhymes, DMX — would perform courtside, the music blasting from speakers while crowds three rows deep pressed against the fence. It was the most democratic entertainment in New York: free, outdoors, and completely alive.`,
    specialties: ['EBC Summer Tournament (June–Aug)', 'Streetball', 'Hip-Hop Culture'],
    figureIds: ['jay_z', 'nas', 'a_tribe_called_quest'],
    admissionCost: 'Free',
    visitDuration: '1–3 hours (tournament days)',
    bookingNote: 'No booking needed; EBC tournament schedule on social media',
    familyFriendly: true,
    insiderTip: 'The EBC tournament runs summers and is free. Arrive early for the best standing spots along the fence. The energy on a Saturday afternoon in July is unlike anything else in the city.',
    priceNote: 'Free',
  },
  marcy_houses: {
    id: 'marcy_houses',
    name: 'Marcy Houses',
    fullName: 'Marcy Houses',
    neighborhood: 'Bedford-Stuyvesant, Brooklyn',
    address: 'Marcy Ave & Myrtle Ave, Brooklyn, NY 11206',
    hours: 'Exterior visible at all times (active residential complex)',
    ticketUrl: null,
    scheduleUrl: null,
    mapUrl: 'https://maps.google.com/?q=Marcy+Houses,+Myrtle+Ave,+Brooklyn,+NY',
    color: '#eff6ff',
    accentColor: '#1d4ed8',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Marcy_Houses_Park_Av_rainy_jeh.jpg',
    description: `Jay-Z grew up at Marcy Houses, the 1,705-unit public housing project in Bed-Stuy. He references it across his entire catalog. It is one of the most referenced addresses in music history.`,
    character: `Shawn Carter — Jay-Z — grew up at Marcy Houses and has never stopped writing about it. "Marcy Me," "Where I'm From," "This Can't Be Life" — the housing project appears throughout his career not as a place he escaped but as a place that made him. 1,705 apartments, thousands of residents, the towers visible from the J/M/Z elevated tracks. The neighborhood around Marcy has changed significantly in the twenty years since Jay-Z\'s career launched — but the blocks he walked are still here, and the contrast between where he came from and where he went is the whole story.`,
    specialties: ['Jay-Z', 'Bed-Stuy History', 'Brooklyn Hip-Hop'],
    figureIds: ['jay_z'],
    admissionCost: 'Free (exterior only)',
    visitDuration: '30–45 minutes',
    bookingNote: 'No booking needed — exterior visit only, respect residents\' privacy',
    familyFriendly: true,
    insiderTip: 'Take the J/M/Z to Marcy Ave. Walk the surrounding blocks toward the elevated tracks — the view of the trains from here appears in Jay-Z\'s lyrics. The neighborhood is mixed residential; explore respectfully.',
    priceNote: 'Free',
  },
  biggie_mural: {
    id: 'biggie_mural',
    name: "Biggie's Block",
    fullName: "226 St. James Place — Biggie's Block",
    neighborhood: 'Clinton Hill, Brooklyn',
    address: '226 St. James Place, Brooklyn, NY 11238',
    hours: 'Exterior accessible at all times',
    ticketUrl: null,
    scheduleUrl: null,
    mapUrl: 'https://maps.google.com/?q=226+St+James+Place,+Brooklyn,+NY',
    color: '#fdf4ff',
    accentColor: '#7e22ce',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Biggie_Smalls_1997.jpg',
    description: `226 St. James Place in Clinton Hill is where Christopher Wallace — The Notorious B.I.G. — grew up. A mural now marks the building, and every block of Clinton Hill and Bed-Stuy within walking distance maps to specific locations in his lyrics.`,
    character: `Christopher Wallace grew up at 226 St. James Place, the building where his mother still lived at the time of his death. He sold crack on the nearby corner, attended Queen of All Saints school blocks away, and catalogued the specific texture of these streets with a precision that no one had brought to Brooklyn before. The mural on the building is a pilgrimage site for hip-hop fans from around the world. Walk from here to Fulton Street — the commercial corridor he references throughout his work — then toward Bed-Stuy. The neighborhood is the biography.`,
    specialties: ['Notorious B.I.G.', 'Clinton Hill History', 'Brooklyn Hip-Hop'],
    figureIds: ['notorious_big'],
    admissionCost: 'Free',
    visitDuration: '30–45 minutes',
    bookingNote: 'No booking needed',
    familyFriendly: true,
    insiderTip: 'Take the C train to Franklin Ave. Walk south on Washington Ave toward St. James Place. The mural is on the building\'s exterior. Walk north from there toward Fulton Street for the full Biggie geography.',
    priceNote: 'Free',
  },
  hollis_queens: {
    id: 'hollis_queens',
    name: 'Hollis, Queens',
    fullName: 'Hollis, Queens',
    neighborhood: 'Hollis, Queens',
    address: '205th St & Hollis Ave, Queens, NY 11423',
    hours: 'Neighborhood accessible at all times',
    ticketUrl: null,
    scheduleUrl: null,
    mapUrl: 'https://maps.google.com/?q=Hollis,+Queens,+NY',
    color: '#fff7ed',
    accentColor: '#c2410c',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/St_Gabriels_Episcopalian_church_Hollis_Queens_20180830_150135.jpg',
    description: `The Queens neighborhood that produced Run-DMC and LL Cool J within blocks of each other. Its suburban, working-class character gave its artists a distinctive outsider energy — neither inner-city nor middle-class.`,
    character: `Joseph Simmons (Run), Darryl McDaniels (DMC), and Jason Mizell (Jam Master Jay) grew up within blocks of each other on 205th Street in Hollis. LL Cool J — James Todd Smith — grew up a few miles away in St. Albans. The neighborhood is relentlessly ordinary: detached houses, quiet streets, a commercial strip. That ordinariness is part of what made its artists distinctive — they came from neither the inner city nor the suburbs, and they sounded like it. "My Adidas," "Walk This Way," "Rock the Bells" — they all came from these blocks.`,
    specialties: ['Run-DMC', 'LL Cool J', 'Queens Hip-Hop Origins'],
    figureIds: ['run_dmc', 'll_cool_j'],
    admissionCost: 'Free',
    visitDuration: '45 minutes (self-guided walk)',
    bookingNote: 'No booking needed — self-guided neighborhood walk',
    familyFriendly: true,
    insiderTip: 'Take the Jamaica Line (J) to Hollis. Walk from Hollis Avenue toward 205th Street. The blocks are quiet and residential — the contrast between the neighborhood and the global music it produced is the whole point.',
    priceNote: 'Free',
  },
  queensbridge_houses: {
    id: 'queensbridge_houses',
    name: 'Queensbridge Houses',
    fullName: 'Queensbridge Houses',
    neighborhood: 'Long Island City, Queens',
    address: '10-05 41st Ave, Long Island City, Queens, NY 11101',
    hours: 'Exterior accessible at all times (active residential complex)',
    ticketUrl: null,
    scheduleUrl: null,
    mapUrl: 'https://maps.google.com/?q=Queensbridge+Houses,+Long+Island+City,+Queens',
    color: '#f8fafc',
    accentColor: '#334155',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Queensbridge_Houses.jpg',
    description: `The largest public housing project in North America, with 3,142 apartments. Nas grew up here, and Illmatic — widely considered the greatest hip-hop album ever made — is a portrait of this specific place.`,
    character: `Queensbridge Houses sits in the shadow of the Queensboro Bridge in Long Island City, directly across the East River from Midtown Manhattan. The Manhattan skyline is visible from the project's windows — an irony that Nas turned into poetry on Illmatic. The complex houses over 6,000 residents in dozens of buildings across a grid of internal streets. Nas\'s 1994 debut album mapped this geography with a specificity and lyricism that transformed local autobiography into universal literature. Mobb Deep — Prodigy and Havoc — also came from Queensbridge, creating the darker, colder side of the same coin.`,
    specialties: ['Nas', 'Mobb Deep', 'Queensbridge Hip-Hop'],
    figureIds: ['nas'],
    admissionCost: 'Free (exterior only)',
    visitDuration: '30–45 minutes',
    bookingNote: 'No booking needed — respect residents\' privacy',
    familyFriendly: true,
    insiderTip: 'Take the N/W to Queensboro Plaza and walk south, or the 7 to Queensbridge. Look back toward the bridge and Manhattan — that view is the backdrop of Illmatic. The Queensboro Bridge walkway is directly accessible and worth the walk.',
    priceNote: 'Free',
  },
  park_hill_staten_island: {
    id: 'park_hill_staten_island',
    name: 'Park Hill, Staten Island',
    fullName: 'Park Hill Apartments — Shaolin',
    neighborhood: 'Clifton, Staten Island',
    address: 'Park Hill Ave, Clifton, Staten Island, NY 10304',
    hours: 'Neighborhood accessible at all times',
    ticketUrl: null,
    scheduleUrl: null,
    mapUrl: 'https://maps.google.com/?q=Park+Hill+Ave,+Staten+Island,+NY',
    color: '#fff1f2',
    accentColor: '#be123c',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Clifton_Staten_Island.JPG',
    description: `Wu-Tang Clan called Staten Island "Shaolin" — after the legendary kung-fu monastery — and built their entire mythology around this neighborhood. RZA, GZA, Ghostface Killah, Raekwon, and Method Man all grew up within blocks of each other here.`,
    character: `Park Hill is a housing complex in Clifton, Staten Island, that produced the most improbable talent concentration in hip-hop history. The RZA, GZA, Ghostface Killah, Raekwon, Method Man, Inspectah Deck, U-God, Masta Killa, and Ol' Dirty Bastard — nine members of Wu-Tang Clan — grew up within blocks of each other in and around these buildings. They named Staten Island "Shaolin" after the legendary kung-fu monastery, building a mythology that turned their forgotten outer-borough geography into something mythic. Enter the Wu-Tang (36 Chambers) was recorded in RZA\'s basement for almost nothing and became one of the most influential albums ever made.`,
    specialties: ['Wu-Tang Clan', 'Staten Island Hip-Hop', 'RZA'],
    figureIds: ['wu_tang_clan'],
    admissionCost: 'Free',
    visitDuration: '1 hour (including ferry)',
    bookingNote: 'No booking needed — take the free Staten Island Ferry from Lower Manhattan',
    familyFriendly: true,
    insiderTip: 'The Staten Island Ferry from Whitehall Terminal is free and offers spectacular harbor views. From St. George Terminal, take the S74 bus toward Clifton. The ferry ride itself is one of the best free experiences in New York.',
    priceNote: 'Free (ferry is free)',
  },

  central_park: {
    id: 'central_park',
    name: `Central Park`,
    fullName: 'Central Park',
    neighborhood: 'Central Park (Upper West Side)',
    address: 'Central Park, New York, NY 10024',
    hours: 'Open daily 6am–1am',
    ticketUrl: 'https://www.centralparknyc.org/',
    scheduleUrl: 'https://www.centralparknyc.org/events/',
    mapUrl: 'https://maps.google.com/?q=Central+Park+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bethesda_Fountain_Central_Park.jpg/440px-Bethesda_Fountain_Central_Park.jpg',
    color: '#f0fdf4',
    accentColor: '#15803d',
    description: `840 acres of designed landscape in the center of Manhattan. Olmsted and Vaux's 1858 Greensward Plan is one of the greatest works of American landscape architecture.`,
    character: `Central Park was not an accident of planning — it was an act of collective civic will. Olmsted and Vaux's 1858 Greensward Plan transformed 840 swampy acres of Manhattan schist into the most visited urban park in the United States. The Ramble (birding), the Sheep Meadow (sunbathing), Bethesda Fountain (gathering), the Great Lawn (concerts), Strawberry Fields (pilgrimage). The park contains the Metropolitan Museum on its edge, the Delacorte Theater for summer Shakespeare, the Central Park Zoo, and Belvedere Castle. At any given afternoon it holds three million different kinds of New Yorkers doing three million different things.`,
    specialties: ['Landscape Architecture', 'Birding', 'Outdoor Performance', 'Public Sculpture'],
    admissionCost: `Free`,
    visitDuration: `1–4 hours`,
    bookingNote: `No booking needed`,
    familyFriendly: true,
    insiderTip: `The Ramble — a wild woodland in the center of the park — is one of the best urban birding spots in North America. Over 200 species pass through during spring migration.`,
    priceNote: `Free`,
  },

  intrepid_museum: {
    id: 'intrepid_museum',
    name: `Intrepid Museum`,
    fullName: 'Intrepid Sea, Air & Space Museum',
    neighborhood: 'Midtown West',
    address: 'Pier 86, 12th Ave at 46th St, New York, NY 10036',
    hours: 'Daily 10am–5pm (summer until 6pm)',
    ticketUrl: 'https://www.intrepidmuseum.org/visit/',
    scheduleUrl: 'https://www.intrepidmuseum.org/events/',
    mapUrl: 'https://maps.google.com/?q=Intrepid+Sea+Air+Space+Museum+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Intrepid_Sea-Air-Space_Museum.jpg/440px-Intrepid_Sea-Air-Space_Museum.jpg',
    color: '#eff6ff',
    accentColor: '#1d4ed8',
    description: `A decommissioned WWII aircraft carrier docked on the Hudson — now housing a space shuttle, a Concorde, and 30+ historic aircraft.`,
    character: `The USS Intrepid served in World War II and the Cold War, surviving five kamikaze attacks and recovering Mercury and Gemini astronauts from the ocean. Now docked permanently on the Hudson at Pier 86, it houses the Space Shuttle Enterprise, a British Airways Concorde, more than 30 aircraft on its flight deck, and the Cold War submarine USS Growler moored alongside. The scale is disorienting — a flight deck is not something you grasp until you're standing on it. This is one of the few places in New York where children will not need to be dragged.`,
    specialties: ['Military History', 'Aviation History', 'Space Exploration', 'Naval History'],
    admissionCost: `$36 adults · $26 children · Under 5 free`,
    visitDuration: `2–3 hours`,
    bookingNote: `Book online for discounts`,
    familyFriendly: true,
    insiderTip: `The flight deck alone is worth the ticket — 30+ aircraft in the open air, with the Hudson River and New Jersey skyline as backdrop. The Space Shuttle Enterprise pavilion is climate-controlled.`,
    priceNote: `$36 adults · $26 children`,
  },

  staten_island_ferry_terminal: {
    id: 'staten_island_ferry_terminal',
    name: `Staten Island Ferry`,
    fullName: 'Staten Island Ferry — Whitehall Terminal',
    neighborhood: 'Financial District',
    address: '4 Whitehall St, New York, NY 10004',
    hours: '24/7 — runs every 30 min (every 15 min peak hours)',
    ticketUrl: 'https://www.siferry.com/',
    scheduleUrl: 'https://www.siferry.com/',
    mapUrl: 'https://maps.google.com/?q=Whitehall+Ferry+Terminal+New+York',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Staten_Island_Ferry_Barberi.jpg/440px-Staten_Island_Ferry_Barberi.jpg',
    color: '#fff7ed',
    accentColor: '#ea580c',
    description: `The free 25-minute ferry across New York Harbor. The best free view of the Statue of Liberty and the Lower Manhattan skyline available anywhere.`,
    character: `The Staten Island Ferry is the greatest free thing in New York City. A 25-minute crossing of New York Harbor — twice, if you ride back — offers the Statue of Liberty at close range, the Lower Manhattan skyline from the water, Ellis Island, and the full sweep of the harbor that made this city. Five million people cross on it every year. Most are commuters. Tourists who discover it almost universally say it's the best thing they did. The orange boats run 24 hours a day, seven days a week, and it is completely free.`,
    specialties: ['Harbor Views', 'Statue of Liberty', 'Free NYC Experience', 'Photography'],
    admissionCost: `Free`,
    visitDuration: `1 hour (round trip)`,
    bookingNote: `No booking needed — just show up at Whitehall Terminal`,
    familyFriendly: true,
    insiderTip: `Stand on the port side (left as you board heading to Staten Island) for the best Statue of Liberty views. Come at sunset for the Lower Manhattan skyline on the return trip.`,
    priceNote: `Free`,
  },

};


export const works = {
  // VAN GOGH
  starry_night: {
    id: 'starry_night',
    figureId: 'van_gogh',
    title: 'The Starry Night',
    year: 1889,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '29 × 36¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/330px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    whatToLookFor: [
      'The eleven swirling stars — Van Gogh painted them from memory while confined to the Saint-Paul-de-Mausole asylum. Look at how each star radiates halos of yellow and white.',
      'The cypress tree on the left. In 19th-century Europe, cypresses were symbols of death and mourning. Van Gogh returned to them obsessively — they connect earth and sky, life and what\'s beyond it.',
      'The village below, eerily calm compared to the turbulent sky above. This is the tension the painting lives in: a mind in turmoil watching a world at peace.',
      'His brushstrokes up close. Every mark is visible, directional, alive. The sky moves in one direction, the hills in another. The whole surface feels like it\'s breathing.',
    ],
    description: `Painted in June 1889 from the window of his asylum room in Saint-Rémy, The Starry Night is the most recognizable painting in MoMA's collection — and one of the most famous in the world. Van Gogh wrote to his brother Theo that he needed the "terrible passions of humanity" expressed through color. This painting is what that meant.`,
  },
  wheatfield_cypresses: {
    id: 'wheatfield_cypresses',
    figureId: 'van_gogh',
    title: 'Wheat Field with Cypresses',
    year: 1889,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '28¾ × 36¾ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg',
    whatToLookFor: [
      'The cypresses twisting like dark green flames against the sky. Van Gogh described them as "beautiful as an Egyptian obelisk." They\'re the emotional anchor of the composition.',
      'The sky\'s movement — swirling clouds that echo The Starry Night, painted the same summer. Standing in front of this and then walking to the Guggenheim to see his work there is a revelation.',
      'The wheat field\'s texture. Van Gogh built up paint in thick, sculptural strokes called impasto. The wheat almost has physical weight.',
      'How much of the canvas the sky occupies — more than half. This isn\'t a landscape. It\'s a sky painting with a landscape at its feet.',
    ],
    description: `Painted just weeks after The Starry Night from the same asylum grounds, this is the "companion piece" most people don't know. Where Starry Night is nocturnal and psychically charged, Wheat Field with Cypresses is daytime Van Gogh at his most ecstatic. It's equally turbulent, but the energy is joy rather than dread.`,
  },
  self_portrait_straw_hat: {
    id: 'self_portrait_straw_hat',
    figureId: 'van_gogh',
    title: 'Self-Portrait with a Straw Hat',
    year: 1887,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '16 × 12½ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DT1502_cropped2.jpg',
    whatToLookFor: [
      'The Pointillist influence — short, choppy strokes of pure color placed next to each other. This was Van Gogh experimenting with what Seurat was doing before he rejected it and found his own voice.',
      'The blue background. Van Gogh used complementary color pairs deliberately: the orange beard against the blue background creates a vibration your eye can\'t quite resolve.',
      'His gaze. He painted over 30 self-portraits. This one has a searching quality — you get the sense of a man figuring out who he is as a painter.',
    ],
    description: `Van Gogh painted this in Paris in 1887, deep in his experimental period. He was studying the Impressionists, absorbing Pointillism, and testing his palette before the great Southern France work that made him immortal. It's a snapshot of the making of an artist.`,
  },
  mountains_saint_remy: {
    id: 'mountains_saint_remy',
    figureId: 'van_gogh',
    title: 'Mountains at Saint-Rémy',
    year: 1889,
    venueId: 'guggenheim',
    medium: 'Oil on canvas',
    dimensions: '28⅝ × 35¾ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Vincent_van_Gogh%2C_Mountains_at_Saint-R%C3%A9my_%281889%29_%2848784087417%29.jpg/960px-Vincent_van_Gogh%2C_Mountains_at_Saint-R%C3%A9my_%281889%29_%2848784087417%29.jpg',
    whatToLookFor: [
      'The Alpilles mountains rendered in writhing, serpentine strokes. The rock itself seems alive, which is quintessential late Van Gogh — the world animated by inner energy.',
      'The small dark cottage at the lower right. Human presence, but dwarfed. Van Gogh was fascinated by the relationship between small human figures and overwhelming natural forces.',
      'The Guggenheim\'s spiral — see this painting on the ramp as you ascend. The curved architecture and the painting\'s own whirling energy create an unexpected dialogue.',
    ],
    description: `Another asylum-period masterpiece, painted while Van Gogh could walk the grounds of Saint-Paul-de-Mausole. The Guggenheim acquired it in 1941 as part of Solomon Guggenheim's foundational collection. It's the reason the Upper East Side walk between the Met and the Guggenheim is a Van Gogh pilgrimage.`,
  },

  // CÉZANNE
  card_players: {
    id: 'card_players',
    figureId: 'cezanne',
    title: 'The Card Players',
    year: 1890,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '25⅝ × 32¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP231550.jpg',
    whatToLookFor: [
      'The geometry of the figures. Cézanne reduces the men to near-cylinders. Their hats, their shoulders, their postures — everything simplified into volumes. Picasso learned Cubism by staring at paintings like this.',
      'The bottle at the center. It\'s the vertical axis the whole composition pivots around. Simple, upright, timeless.',
      'The color palette — muted browns, slate blues, terra cotta. No flashiness. The painting asks you to look at structure, not sensation.',
      'How little narrative there is. Two men playing cards. That\'s all. The painting refuses drama, and that refusal is the entire point.',
    ],
    description: `Cézanne painted five versions of Card Players between 1890–1895. The Met's is one of the smaller, later versions — more reduced, more architectural. When the artist prince Al-Waleed bin Talal bought a different version in 2011 for $259 million, it became the most expensive painting ever sold. But the Met's version, which you can actually see, might be the better painting.`,
  },
  mont_sainte_victoire: {
    id: 'mont_sainte_victoire',
    figureId: 'cezanne',
    title: 'Mont Sainte-Victoire',
    year: 1904,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '28⅞ × 36¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP-20099-001.jpg',
    whatToLookFor: [
      'The patches of color. Cézanne doesn\'t blend — he places discrete planes of color next to each other, letting your eye do the mixing. This is the direct ancestor of Cubism.',
      'The mountain\'s presence. He painted this peak over 60 times. It\'s less a subject than an obsession — a fixed point against which he measured his own perception.',
      'The absence of traditional perspective. The mountain looks "wrong" — too close, too frontal. That wrongness is the whole point. Cézanne was breaking the 500-year-old rules of pictorial space.',
    ],
    description: `Cézanne returned to this mountain outside Aix-en-Provence his entire career. He called it his motif. These late works — flattened, fractured, built from patches of color — are the hinge between the 19th and 20th centuries. The Met holds several, and they're some of the most important paintings in the building.`,
  },

  // GAUGUIN
  ia_orana_maria: {
    id: 'ia_orana_maria',
    figureId: 'gauguin',
    title: 'Ia Orana Maria (Hail Mary)',
    year: 1891,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '44⅞ × 34½ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DT1025.jpg',
    whatToLookFor: [
      'The transposition: this is a Western Annunciation scene translated entirely into Tahitian life. The Virgin and Child appear as Tahitian women; the angel at left has a yellow hibiscus halo.',
      'The color — intensely saturated, unnatural, deliberately anti-European. Gauguin was rejecting the palette of Paris for something he felt was more "primitive" and therefore more honest. This is complicated, but the color itself is extraordinary.',
      'The flatness. Gauguin pushed against Western depth and shading. The figures feel pressed against the picture plane, almost like they\'re on the surface of the canvas rather than behind it.',
    ],
    description: `This is the first major Tahitian painting Gauguin sent back to Paris after fleeing France in 1891. He was trying to escape civilization and find something "primitive" — a project that was genuinely visionary about color and form, and also genuinely problematic in its colonial assumptions. Hold both things. The painting itself is stunning.`,
  },
  two_tahitian_women: {
    id: 'two_tahitian_women',
    figureId: 'gauguin',
    title: 'Two Tahitian Women',
    year: 1899,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '37 × 28½ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DT1342.jpg',
    whatToLookFor: [
      'The complete rejection of Impressionist shimmer. Where Monet dissolves form into light, Gauguin builds it back up — solid, monumental, like a carved frieze.',
      'The relationship between the two women — intimate, private, utterly unconcerned with the viewer. This self-containment is rare in Western painting of this era.',
      'The flowers and fruit. Gauguin fills his surfaces with these offerings — not symbolic in a Christian way, but in a sensory way. The painting wants you to feel tropical heat.',
    ],
    description: `Painted in Gauguin's second Tahitian period, after a return to France he found unbearable. By 1899 he had given himself fully to this life — or to his idea of it. Whether that distinction matters is one of the interesting questions art raises. The painting doesn't resolve it; it just presents two women with extraordinary dignity.`,
  },

  // SEURAT
  circus_sideshow: {
    id: 'circus_sideshow',
    figureId: 'seurat',
    title: 'Circus Sideshow (Parade de Cirque)',
    year: 1888,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '39¼ × 59 in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP375450_cropped.jpg',
    whatToLookFor: [
      'Stand close, then far back. Up close: just dots of color, pointillist and abstract. Step back ten feet: figures, gaslight, atmosphere. The painting performs the act of perception.',
      'The horizontal bands of gaslight at the top. Seurat was fascinated by artificial light — this was one of the first major paintings to depict electric-era entertainment at night.',
      'The stillness. Despite being a circus scene, nothing moves. Every figure is frontal, hieratic, almost Egyptian. Seurat found contemporary life and made it timeless and slightly eerie.',
    ],
    description: `Seurat's famous Sunday on the Grande Jatte is in Chicago. But the Met's Circus Sideshow is arguably more fascinating — it's the same Pointillist technique applied to nighttime artificial light, which creates an entirely different, more melancholy atmosphere. Gaslit faces, the trombone player, the crowd waiting to enter. A great painting hiding in plain sight.`,
  },
  port_en_bessin: {
    id: 'port_en_bessin',
    figureId: 'seurat',
    title: 'Port-en-Bessin, Entrance to the Outer Harbor',
    year: 1888,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '21⅝ × 25⅝ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Georges_Seurat_-_Port-en-Bessin_-_55.38_-_Minneapolis_Institute_of_Arts.jpg/960px-Georges_Seurat_-_Port-en-Bessin_-_55.38_-_Minneapolis_Institute_of_Arts.jpg',
    whatToLookFor: [
      'The painted border. Seurat framed his own canvases with dots — a pointillist border that mediates between the painting\'s inner light and the outer world. It\'s a painting commenting on itself.',
      'The color of the water. Seurat built it from dozens of hues — green, blue, purple, orange — none of which appear in water. Yet the water looks exactly right.',
      'The horizon line\'s precision. Seurat used a ruler. He was the most scientific of the Post-Impressionists — color theory, optics, geometry all applied deliberately to every canvas.',
    ],
    description: `A quieter, more meditative Seurat than the famous park scenes. MoMA holds this gem from his 1888 Normandy coast summer. The painted border is a Seurat signature almost no one notices at first — once you see it, you can't unsee it.`,
  },

  // TOULOUSE-LAUTREC
  at_the_moulin_rouge: {
    id: 'at_the_moulin_rouge',
    figureId: 'toulouse_lautrec',
    title: 'At the Moulin Rouge',
    year: 1892,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '48½ × 55½ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Henri_de_Toulouse-Lautrec%2C_At_the_Moulin_Rouge.jpg/330px-Henri_de_Toulouse-Lautrec%2C_At_the_Moulin_Rouge.jpg',
    whatToLookFor: [
      'The cropped figure at the lower right — a woman\'s face lit harshly green, half out of frame, slightly ghoulish. She has no name in the painting; she\'s just the night. This cropping technique came directly from Japanese woodblock prints.',
      'Lautrec himself in the background — the short man in the top hat, walking with his taller cousin. He habitually put himself in his crowd scenes, an observer who could never quite be a participant.',
      'The spatial construction: the back-right table feels very deep, but the foreground feels flat. Lautrec collapses and distorts perspective deliberately — Parisian nightlife as a slightly distorted dream.',
    ],
    description: `The Moulin Rouge was Lautrec's second home — he had his own table, his own storage for his painting supplies. This is the most complete and ambitious of his Moulin Rouge paintings. The woman in green at right is one of the most arresting figures in 19th-century French painting, and almost nobody knows her name.`,
  },
  jane_avril: {
    id: 'jane_avril',
    figureId: 'toulouse_lautrec',
    title: 'Jane Avril',
    year: 1893,
    venueId: 'moma',
    medium: 'Lithograph poster',
    dimensions: '50⅜ × 37 in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Jane_Avril.gif',
    whatToLookFor: [
      'The dancer\'s leg extended into the border — it breaks the frame, merges the figure with the decorative surround. This was revolutionary in poster design and influenced graphic art for decades.',
      'The bass player at the bottom whose instrument neck becomes a visual frame within the frame. Lautrec thought compositionally at multiple scales simultaneously.',
      'The color flatness. No modeling, no shadow. Pure flat zones of color, like a Japanese print. Lautrec absorbed Japonisme more completely than almost any of his peers.',
    ],
    description: `Jane Avril was Lautrec's muse and friend — one of the few genuine friendships he had. This lithograph poster, made for her engagement at the Jardin de Paris, is considered one of the greatest examples of poster art ever made. Lautrec essentially invented the modern graphic poster. MoMA holds several of his lithographs.`,
  },

  // ── IMPRESSIONISM ────────────────────────────────────────────
  monet_grenouillere: {
    id: 'monet_grenouillere',
    figureId: 'monet',
    title: 'La Grenouillère',
    year: 1869,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '29⅛ × 39¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Claude_Monet_La_Grenouill%C3%A9re.jpg/330px-Claude_Monet_La_Grenouill%C3%A9re.jpg',
    whatToLookFor: [
      'The water. Monet renders it with rapid, broken strokes of green, blue, and white — no smooth blending. The surface looks unstable, flickering, alive. This is the birthplace of Impressionist technique.',
      'The boats and the floating platform (the "frog pond" regulars called the "Camembert"). Monet is less interested in the people than in what light does to water and hull and foliage all at once.',
      'Compare it mentally to Renoir\'s version of the same scene, painted the same afternoon standing shoulder-to-shoulder. Two painters, same motif, completely different rhythms. Renoir\'s is warmer; Monet\'s is cooler, more agitated.',
    ],
    description: `In summer 1869, Monet and Renoir set up their easels side by side at a popular bathing spot on the Seine outside Paris and painted the same scene. The result was Impressionism. This is the painting where the movement was effectively born — loose brushwork, broken light, contemporary leisure instead of historical grandeur. MoMA's version is Monet's. The Met holds Renoir's.`,
  },
  monet_waterlilies: {
    id: 'monet_waterlilies',
    figureId: 'monet',
    title: 'Water Lilies',
    year: 1906,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '35 × 39½ in (one panel)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Reflections_of_Clouds_on_the_Water-Lily_Pond.jpg/330px-Reflections_of_Clouds_on_the_Water-Lily_Pond.jpg',
    whatToLookFor: [
      'The absence of horizon. Monet eliminates the sky entirely — the painting IS the water surface. There\'s no up or down in the traditional sense. This was radical in 1906.',
      'The paint itself: thick, gestural, almost sculptural. In his final years, Monet\'s eyesight was failing from cataracts. These late lilies become more abstract as a result — the palette shifts toward orange and red (colors cataract patients perceive more easily).',
      'The scale effect. MoMA\'s series includes room-sized canvases. Standing in front of them, you\'re not looking at a painting of water. You\'re inside it.',
    ],
    description: `Monet spent the last 30 years of his life painting the pond he built at Giverny. What started as garden documentation became an obsession — over 250 Water Lily paintings, culminating in the enormous murals at the Paris Orangerie. MoMA holds several key examples. They prefigure Abstract Expressionism by 40 years: Pollock and Rothko both cited Monet as a direct influence.`,
  },
  degas_dance_class: {
    id: 'degas_dance_class',
    figureId: 'degas',
    title: 'The Dance Class',
    year: 1874,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '32¾ × 30¼ in',
    imageCredit: 'The Metropolitan Museum of Art / Open Access',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP-20101-001.jpg',
    whatToLookFor: [
      'What everyone is doing except dancing. A student scratches her back. Another adjusts her slipper. A mother in the corner fans herself. Degas was obsessed with the unposed, the unstudied, the glance caught between moments.',
      'The spatial complexity. The room recedes at a diagonal, with figures at multiple depths. Degas was heavily influenced by photography and Japanese prints — both showed him how to crop a scene, how to catch figures cut by a frame.',
      'Jules Perrot at center, the aging ballet master with his stick. He\'s the authority around which all this beautiful inattention orbits.',
    ],
    description: `Degas painted dancers not because he found them romantic but because their rehearsals gave him exactly what he wanted: bodies under strain, caught between effort and grace, in spaces where the usual social performances dropped away. This work is the definitive statement of that vision. The Met holds the finest Degas collection in America.`,
  },
  degas_rehearsal: {
    id: 'degas_rehearsal',
    figureId: 'degas',
    title: 'Rehearsal Onstage',
    year: 1874,
    venueId: 'met',
    medium: 'Pastel over brush-and-ink drawing on thin paper',
    dimensions: '21¼ × 28½ in',
    imageCredit: 'The Metropolitan Museum of Art / Open Access',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DT1565.jpg',
    whatToLookFor: [
      'The vantage point — Degas is looking down onto the stage from an elevated box. He loved bird\'s-eye views; they flatten figures and make them compositional elements rather than portraits.',
      'The men in the wings watching. Dark-suited, anonymous, they\'re the management — the ownership class that literally owned these young women\'s careers. Degas was always aware of this power structure.',
      'The medium: pastel over ink. Degas was a master of mixed media, always experimenting. The pastels give a chalk-like, powdery quality different from his oils.',
    ],
    description: `Where The Dance Class is a rehearsal room study, Rehearsal Onstage puts us in the theater itself, looking down at dancers mid-practice. The contrast between the ethereal figures onstage and the blunt male figures watching from the wings is one of Degas's most clear-eyed social observations — beauty as labor, watched by those who profit.`,
  },
  renoir_charpentier: {
    id: 'renoir_charpentier',
    figureId: 'renoir',
    title: 'Madame Georges Charpentier and Her Children',
    year: 1878,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '60¼ × 74⅞ in',
    imageCredit: 'The Metropolitan Museum of Art / Open Access',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP-35674-001.jpg',
    whatToLookFor: [
      'The Japanese screen and furnishings in the background — this was the fashionable Japonisme aesthetic of 1870s Paris. Renoir absorbs it into his surface patterning.',
      'The dog, an enormous Newfoundland, calmly accepting a small child sitting on its back. Renoir painted animals with the same warmth as people — a key part of his charm.',
      'The paint handling: loose and sketchy in the background, more finished on the faces. Renoir knew where the eye would go and spent his time accordingly.',
    ],
    description: `Marguerite Charpentier ran the most important literary salon in Paris. Her husband published Zola, Flaubert, and Maupassant. When this portrait appeared at the 1879 Salon, Renoir was a star. The painting launched his career in society portraiture — lucrative, occasionally stifling, but it paid the rent while he kept painting riverside outings and café scenes. The Met acquired it in 1907.`,
  },
  cassatt_tea: {
    id: 'cassatt_tea',
    figureId: 'cassatt',
    title: 'The Cup of Tea',
    year: 1880,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '25½ × 36¼ in',
    imageCredit: 'The Metropolitan Museum of Art / Open Access',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP-24385-001.jpg',
    whatToLookFor: [
      'The hands and the cup. Cassatt obsessed over hands — they reveal character, occupation, social position. These hands are confident, unhurried, belonging to a woman entirely at ease in her own home.',
      'The mirror in the background reflecting the room. Cassatt frames her subjects within their domestic environments, making the room as much a subject as the person.',
      'The restricted color palette — pink, white, silver, the soft blue-grey of the dress. Every color is selected for harmony. There\'s nothing jarring here. It\'s a painting about comfort and precision simultaneously.',
    ],
    description: `Mary Cassatt was the only American in the Impressionist inner circle — and the only woman. Degas, who became her close friend and mentor, said she had "infinite talent." This painting shows what she did with Impressionist technique that her male colleagues couldn't: access to the private social world of bourgeois women, depicted with psychological intimacy and no condescension.`,
  },
  pissarro_tuileries: {
    id: 'pissarro_tuileries',
    figureId: 'pissarro',
    title: 'The Garden of the Tuileries on a Winter Afternoon',
    year: 1899,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '28⅞ × 36¼ in',
    imageCredit: 'The Metropolitan Museum of Art / Open Access',
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/web-large/DT1042.jpg',
    whatToLookFor: [
      'The bare winter trees. Pissarro was fascinated by seasonal light — the same garden looked like a different painting in January versus June. The stripped branches create a lacework against the grey sky.',
      'The figures: small, incidental, absorbed in their own business. Pissarro painted city life without its drama — the everyday pedestrian, not the spectacle.',
      'The atmospheric haze. Pissarro rented rooms in Paris specifically to paint from upper-story windows, capturing the shimmer of city air over distance. This view from his room captures that compression of space.',
    ],
    description: `In his final decade, Pissarro painted Paris from hotel windows — the Tuileries, the Louvre, the boulevards, the ports of Rouen and Dieppe. These late city views are some of the finest Impressionist cityscapes ever made, and almost overshadowed by his earlier rural work. The Met holds several. In the city that shaped Impressionism, Pissarro gives you the city itself.`,
  },

  // ── ABSTRACT EXPRESSIONISM ────────────────────────────────────
  pollock_autumn_rhythm: {
    id: 'pollock_autumn_rhythm',
    figureId: 'pollock',
    title: 'Autumn Rhythm (Number 30)',
    year: 1950,
    venueId: 'met',
    medium: 'Enamel on canvas',
    dimensions: '105 × 207 in',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Autumn_Rhythm.jpg/330px-Autumn_Rhythm.jpg',
    whatToLookFor: [
      'The scale. 17 feet wide. You can\'t see the whole thing in your peripheral vision. Pollock intended this — the painting surrounds you, not the other way around.',
      'The layers. Pollock worked the canvas for weeks, building depth. Dark lines lie under lighter ones; the gestures intersect and create what he called "a maze." Follow one thread and it disappears behind another.',
      'What\'s NOT there: no figure, no landscape, no subject in any traditional sense. Just the record of a body moving. Pollock described it as "energy and motion made visible."',
      'The drips versus the pours. Up close you\'ll see both deliberate skeins of paint and incidental drops. The interplay between control and accident is the entire subject of the painting.',
    ],
    description: `Pollock made this in his barn in Long Island in the fall of 1950, working on the canvas laid flat on the floor, moving around it, dripping and pouring enamel paint. He was photographed that same year by Hans Namuth, and the images of him dancing around his canvas became the defining image of the New York School. Autumn Rhythm is the masterpiece of that period — now at the Met, which paid $30 million for it in 1972.`,
  },
  pollock_one31: {
    id: 'pollock_one31',
    figureId: 'pollock',
    title: 'One: Number 31, 1950',
    year: 1950,
    venueId: 'moma',
    medium: 'Oil and enamel on canvas',
    dimensions: '106 × 209⅝ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Regarding_One.jpg/330px-Regarding_One.jpg',
    whatToLookFor: [
      'This painting and Autumn Rhythm at the Met were made the same year in the same barn. Walk between them in the same visit and compare: both enormous, both dripped, but the color palette shifts — this one is cooler, more silver and white.',
      'MoMA hangs this at eye level, which is unusual for a painting this scale. Stand close enough to smell the enamel, then back up until the whole field enters your vision.',
      'The aluminum paint. Pollock used house paint, enamel, and aluminum paint — industrial materials, not art-supply oils. The aluminum gives this painting its distinctive metallic shimmer.',
    ],
    description: `Made the same year as Autumn Rhythm, this is MoMA's crown jewel of Abstract Expressionism. Together, these two paintings — one at the Met, one at MoMA — are the apex of Pollock's drip period. He made both in about the same number of months that Van Gogh made The Starry Night and Wheat Field with Cypresses. Extraordinary periods are short.`,
  },
  rothko_no3: {
    id: 'rothko_no3',
    figureId: 'rothko',
    title: 'No. 3/No. 13 (Magenta, Black, Green on Orange)',
    year: 1949,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '85¼ × 65 in',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/%27Magenta%2C_Black%2C_Green_on_Orange%27%2C_oil_on_canvas_painting_by_Mark_Rothko%2C_1947%2C_Museum_of_Modern_Art.jpg',
    whatToLookFor: [
      'Stand close — three feet away — and stay. Rothko said his paintings were not about color relationships. They were about "basic human emotions — tragedy, ecstasy, doom." The experience requires patience.',
      'The edges of each rectangle. They\'re not hard lines; they breathe. The colors bleed into each other at the borders. This soft edge is what creates the vibration — the sense that the colors are luminous, not painted.',
      'The orange ground below and around the rectangles. It\'s not just background; it pushes forward. The whole surface is active, competing.',
    ],
    description: `By 1949, Rothko had found his form: large, stacked rectangles of color on an even larger color field, their edges soft, their surfaces built up in thin transparent layers. He called these shapes "performers." He wanted the viewer to feel enveloped — to have an experience of transcendence or tragedy without the mediation of imagery. Whether that works is something you have to stand in front of and discover for yourself.`,
  },
  dekooning_woman1: {
    id: 'dekooning_woman1',
    figureId: 'de_kooning',
    title: 'Woman I',
    year: 1950,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '75⅞ × 58 in',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Woman_I-Willem_de_Kooning.jpg',
    whatToLookFor: [
      'The attack. De Kooning worked on this painting for almost two years, scraping it back repeatedly, repainting, destroying. The surface holds all that violence — impasto built up in competing directions, forms half-emerging and half-dissolving.',
      'The smile. It came from a cigarette ad, cut from a magazine and collaged onto the canvas during one of the early studies. The grin is frozen, slightly manic — glamour become grotesque.',
      "The figure's presence despite (or because of) the distortion. The Woman is enormous, frontal, confrontational. Feminist critics later read her as an anxiety of the male gaze turned into an anxiety about women. De Kooning said he just wanted to make a painting.",
    ],
    description: "De Kooning abandoned Woman I in 1950 and a fellow painter, Meyer Schapiro, talked him out of destroying it. When it appeared at MoMA's 1953 New York School show, it caused a scandal: Is this not figuration? After all the struggle to get past representation? De Kooning's response was essentially: yes, and what's your point. He kept painting women for the rest of his life.",
  },
  kline_chief: {
    id: 'kline_chief',
    figureId: 'kline',
    title: 'Chief',
    year: 1950,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '58¼ × 73½ in',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Franz_Kline_Chief_1950.jpg/330px-Franz_Kline_Chief_1950.jpg',
    whatToLookFor: [
      "The weight of the black. Kline's blacks are not voids — they push forward. The white isn't background; it's equally aggressive, carving into the black. The relationship is combative.",
      'The scale and speed. These strokes were made fast — a loaded brush, a big gesture, confident and committed. But look at the edges: the paint bleeds, feathers, speaks.',
      'The title. Kline often named paintings after locomotives and railroad infrastructure. Chief was a railroad engine from his childhood in Pennsylvania. The painting is about mass, speed, industrial America.',
    ],
    description: "Kline arrived at his signature style almost accidentally: he projected a small brush drawing onto the wall and saw the black marks as large architectural forms. That insight produced works like Chief — pure black-and-white paintings of enormous force and economy. He's the least famous of the New York School's inner circle, and possibly the most instantly recognizable.",
  },
  newman_vir: {
    id: 'newman_vir',
    figureId: 'newman',
    title: 'Vir Heroicus Sublimis',
    year: 1950,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '95¼ × 213¼ in',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/06/Vir_Heroicus_Sublimis.jpg',
    whatToLookFor: [
      'The "zips" — vertical lines cutting through the red field. Newman invented this device: a thin stripe of contrasting color that divides the picture plane without perspective, without narration. Just pure division.',
      'Stand very close (as Newman instructed — he posted a note saying viewers should stand 18 inches away). At that distance, the red field becomes environmental. You are inside a color.',
      'The title: Latin for "Man, heroic and sublime." Newman was making grand claims for abstract painting, insisting it was as capable of spiritual content as any religious image.',
    ],
    description: "MoMA's largest Newman, and his most ambitious statement. He asked that it be viewed from 18 inches — so close you can't see the edges. At that distance, the red field surrounds you and the zips become the only events in your world. Newman was the most theoretically ambitious of the New York School, always writing essays about what painting should do. This is the painting that matches his ambition.",
  },

  // ── CUBISM ────────────────────────────────────────────
  picasso_demoiselles: {
    id: 'picasso_demoiselles',
    figureId: 'picasso',
    title: "Les Demoiselles d'Avignon",
    year: 1907,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '96 × 92 in',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Les_Demoiselles_d%27Avignon.jpg/330px-Les_Demoiselles_d%27Avignon.jpg",
    whatToLookFor: [
      "The inconsistency — and how it's not an error. The two figures on the left have Iberian faces; the two on the right have African mask-like features. He repainted those two after visiting the ethnographic museum at the Trocadéro. The painting contains two different stylistic moments, and he kept both.",
      'The absence of depth. Five nude figures crammed into a flat plane — no background recession, no pictorial space in any Renaissance sense. The space is shattered.',
      'The eyes. Several figures look directly out at you. This was aggressive — female nudes in Western art looked available, passive. These women look back.',
    ],
    description: "Picasso worked on this painting in secret for nine months in 1906–07 and showed it to almost nobody. When his friends finally saw it, Braque reportedly said it made him feel like someone was drinking gasoline and breathing fire. Matisse was outraged. It was Cubism's detonation point — the moment that broke 500 years of Western pictorial space. MoMA bought it in 1939.",
  },
  picasso_three_musicians: {
    id: 'picasso_three_musicians',
    figureId: 'picasso',
    title: 'Three Musicians',
    year: 1921,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '79 × 87¾ in',
    imageCredit: 'Wikimedia Commons / CC-BY-4.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Picasso_Three_Musicians_MoMA_2024.jpg/330px-Picasso_Three_Musicians_MoMA_2024.jpg',
    whatToLookFor: [
      'The jigsaw logic. Each figure is assembled from flat colored planes — the Harlequin, the Pierrot, and the monk built entirely from geometric shapes. Identify where one body ends and another begins. It is harder than it looks.',
      'The dog under the table at the bottom. Easy to miss — just a few dark shapes. Picasso hid it deliberately.',
      'The contrast with Les Demoiselles downstairs. That painting is violent, unresolved, aggressive. This one — made 14 years later — is witty, confident, resolved. Two poles of what Cubism could be.',
    ],
    description: `Made in 1921, Three Musicians is Synthetic Cubism at its most complete — flattened planes of color assembled into figures like cut paper collage. By this point Picasso had invented Cubism, moved through it, and was now looking back at it from the other side. The painting is both a summation and a farewell.`,
  },
  braque_violin_palette: {
    id: 'braque_violin_palette',
    figureId: 'braque',
    title: 'Violin and Palette',
    year: 1909,
    venueId: 'guggenheim',
    medium: 'Oil on canvas',
    dimensions: '36¼ × 16⅞ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Braque_violin.jpg/330px-Braque_violin.jpg',
    whatToLookFor: [
      "The nail at the top, casting a real trompe-l'oeil shadow. In a painting deliberately breaking illusionism, Braque plants this hyper-realistic nail as a provocation: if the nail is 'real,' what are the violin's fragments?",
      "The light. There's no single light source — illumination comes from everywhere and nowhere, creating facets. This is Analytic Cubism's core move.",
      "The vertical format. Braque chose it to mirror the violin's shape — the painting mirrors its subject structurally, not representationally.",
    ],
    description: "Braque painted this at exactly the moment he and Picasso were developing Cubism side by side in Montmartre. He later said they were like two mountaineers roped together. This is one of the works where you can watch the invention happen in real time — the violin is still recognizable, but the space around it is dissolving, the viewpoints multiplying.",
  },
  gris_guitar_met: {
    id: 'gris_guitar_met',
    figureId: 'gris',
    title: 'Guitar and Flowers',
    year: 1912,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '44⅝ × 27¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Juan_Gris_Guitar_and_Flowers_1912.jpg/330px-Juan_Gris_Guitar_and_Flowers_1912.jpg',
    whatToLookFor: [
      'The printed newsprint texture at center. Gris began incorporating printed paper surfaces into paintings before the Cubists developed full collage.',
      'The color compared to Picasso and Braque at this moment: Gris is more colorful, more decorative. He arrives at Cubism from a graphic art background and it shows.',
      "The guitar's recognizability. Gris never loses the object entirely — his Cubism always maintains a legibility that Picasso and Braque sometimes deliberately abandoned.",
    ],
    description: "Juan Gris came to Cubism after Picasso and Braque invented it, but he systematized it more rigorously than anyone. Where Picasso worked intuitively, Gris constructed his paintings using geometric grids and color theory. Picasso was ambivalent about him, recognizing the quality and resenting the competition. The Met holds several important Gris works.",
  },
  leger_smoker: {
    id: 'leger_smoker',
    figureId: 'leger',
    title: 'Soldier with a Pipe',
    year: 1916,
    venueId: 'guggenheim',
    medium: 'Oil on canvas',
    dimensions: '51¼ × 38¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Fernand_L%C3%A9ger_-_Soldier_with_a_Pipe_-_Google_Art_Project.jpg/330px-Fernand_L%C3%A9ger_-_Soldier_with_a_Pipe_-_Google_Art_Project.jpg',
    whatToLookFor: [
      "The tubular forms. Where Picasso and Braque fragmented the figure into facets, Léger made it into machinery — cylinders, cones, metallic surfaces. His humans look like robots, and he meant it.",
      'The flatness of color. No shading within each form; each cylindrical section is a uniform color, like a technical drawing.',
      "The context: Léger painted this after being gassed in the trenches of World War I. The 'tubism' is a response to industrial violence.",
    ],
    description: "Léger went to the Western Front and came back changed. He'd grown up in Normandy, trained as an architect, was drawn into the Cubist orbit in Paris — but the war showed him something Picasso's studio hadn't: modern life was mechanical, industrial, and human beings were being reshaped by it. The Guggenheim holds key examples from this period.",
  },
  duchamp_nude: {
    id: 'duchamp_nude',
    figureId: 'duchamp',
    title: 'Nude Descending a Staircase, No. 2',
    year: 1912,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '57⅞ × 35⅛ in',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c0/Duchamp_-_Nude_Descending_a_Staircase.jpg/330px-Duchamp_-_Nude_Descending_a_Staircase.jpg',
    whatToLookFor: [
      'The motion lines. Duchamp layers multiple positions of the body across the same picture plane — like a film strip collapsed into a single image. He was influenced by stop-motion photography.',
      'The figures within figures. Count the overlapping phases of the descending body — some historians find five, some seven.',
      'The title painted on the canvas. Duchamp was already playing games: this is obviously not a traditional nude, and calling it one forces you to look for the body in the geometry.',
    ],
    description: "Duchamp submitted this to the 1912 Salon des Indépendants and was asked to either change the title or withdraw it. He withdrew it. A year later, it appeared at the 1913 Armory Show in New York and became the most talked-about painting in America. MoMA's permanent collection includes other key Duchamp works from this period.",
  },

  // ── AMERICAN MODERNISM ──────────────────────────────────────
  hopper_sunday_morning: {
    id: 'hopper_sunday_morning',
    figureId: 'hopper',
    title: 'Early Sunday Morning',
    year: 1930,
    venueId: 'whitney',
    medium: 'Oil on canvas',
    dimensions: '35⅛ × 60¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Early_Sunday_Morning%2C_by_Edward_Hopper.jpg/330px-Early_Sunday_Morning%2C_by_Edward_Hopper.jpg',
    whatToLookFor: [
      "The barber pole. It's the only indication of specific human activity — and the shop is closed. Hopper uses commerce and its absence to define American loneliness.",
      "The upper-story windows, curtained. Somebody lives up there. You'll never know who. That private life just behind the visible surface is Hopper's constant subject.",
      'The light. A low, raking morning light from the left — the light of a city not yet awake. Hopper studied sunlight obsessively, filling notebooks with angle calculations.',
    ],
    description: "Hopper painted this from memory, not from a specific block in New York — though it looks real enough that people have spent years trying to identify the street. The Whitney has the largest Hopper collection in the world, receiving most of his estate after his wife Josephine died. This is the painting that defines what 'Hopperesque' means.",
  },
  hopper_gas: {
    id: 'hopper_gas',
    figureId: 'hopper',
    title: 'Gas',
    year: 1940,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '26¼ × 40¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Hopper-Gas-1940.png/330px-Hopper-Gas-1940.png',
    whatToLookFor: [
      'The station attendant, alone. He is checking something at the pump — a small practical act. Behind him, the forest begins immediately, dark and consuming. Modern convenience at the edge of wilderness.',
      "The red Mobil sign and the pumps: America's new landscape of roadside commerce. Hopper was one of the first fine artists to take commercial Americana seriously as subject matter.",
      'What is missing: no customers, no passing cars, no motion. Hopper paints the stillness between events. The painting always feels like the moment just before something happens, or just after.',
    ],
    description: "Hopper made this from sketches of gas stations along New England roads in the late 1930s. By the time he painted it, the gas station was becoming as American as the frontier it was built on top of. MoMA acquired it in 1943. It is one of the paintings that established American Loneliness as a genre — a visual language that filmmakers, photographers, and writers have been borrowing ever since.",
  },
  lawrence_migration: {
    id: 'lawrence_migration',
    figureId: 'lawrence',
    title: 'The Migration Series, Panel 1',
    year: 1940,
    venueId: 'moma',
    medium: 'Casein tempera on hardboard',
    dimensions: '18 × 12 in',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Migration_Series_Panel_1.jpg/330px-Migration_Series_Panel_1.jpg',
    whatToLookFor: [
      'The flatness of the figures — Lawrence worked in a Cubist-influenced flat style, bold colors, hard edges. The figures are types as much as individuals: the people rather than specific people.',
      'The train tracks, the turnstiles, the station halls: the infrastructure of migration. Lawrence chose architecture and systems, not portraits, to tell the story.',
      'The scale. Each panel is small — 18 by 12 inches. You come close to read them. Lawrence conceived the series as a collective narrative, each panel a chapter.',
    ],
    description: `Between 1940 and 1941, Lawrence painted 60 panels documenting the Great Migration — the movement of over 1.6 million Black Americans from the South to Northern cities between 1910 and 1930. He was 23 years old. The panels are split between MoMA (odd numbers) and the Phillips Collection in Washington. Seeing any of them is seeing one of the great narrative achievements of American art.`,
  },
  hartley_german_officer: {
    id: 'hartley_german_officer',
    figureId: 'hartley',
    title: 'Portrait of a German Officer',
    year: 1914,
    venueId: 'met',
    medium: 'Oil on canvas',
    dimensions: '68¼ × 41⅞ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Portrait_of_a_German_Officer%2C_Marsden_Hartley.jpg/330px-Portrait_of_a_German_Officer%2C_Marsden_Hartley.jpg',
    whatToLookFor: [
      'The symbols assembled rather than a face depicted. This is a portrait with no face — instead, military insignia, regimental colors, the Iron Cross, the number 24. The subject is assembled from his emblems.',
      'The influence of Kandinsky and German Expressionism — Hartley was one of the first Americans to spend serious time in pre-war Berlin.',
      "The personal grief. Hartley had fallen in love with Karl von Freyburg, the young German officer killed in the first months of the war. This painting is an elegy encoded in symbols, not named because Hartley could not name it safely.",
    ],
    description: "Hartley was in Berlin in 1914 when World War I broke out. Karl von Freyburg, a 24-year-old German officer he loved, was killed in October. Hartley's response was this series of paintings — abstract portraits assembled from military iconography, grief transformed into formal language. The Met holds the most important example. It is one of the first explicitly coded queer memorial artworks in American art history.",
  },
  sheeler_american_landscape: {
    id: 'sheeler_american_landscape',
    figureId: 'sheeler',
    title: 'American Landscape',
    year: 1930,
    venueId: 'moma',
    medium: 'Oil on canvas',
    dimensions: '24 × 31 in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sheeler_american_landscape.jpg/330px-Sheeler_american_landscape.jpg',
    whatToLookFor: [
      'The reflection of the industrial plant in the canal. Nature has become the mirror of industry, not the other way around.',
      'The complete absence of human figures. This is an American landscape without Americans — only their machines, their infrastructure, their organized industrial world.',
      'The photographic precision. Sheeler was a professional photographer. His paintings look like paintings of photographs. That is not accidental.',
    ],
    description: "Sheeler photographed the Ford River Rouge complex in 1927 for Ford Motor Company, then spent the next three years making paintings from those photographs. American Landscape is the culmination: a painting of the largest factory in the world rendered with the calm reverence usually reserved for the Grand Canyon. MoMA acquired it the year it was made. It is the defining work of American Precisionism.",
  },

  // GUGGENHEIM — THANNHAUSER COLLECTION
  cezanne_bibemus: {
    id: 'cezanne_bibemus',
    figureId: 'cezanne',
    title: 'Bibémus',
    year: 1894,
    venueId: 'guggenheim',
    medium: 'Oil on canvas',
    dimensions: '28¾ × 36¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Bib%C3%A9mus_by_Paul_C%C3%A9zanne%2C_c._1894-95.JPG/330px-Bib%C3%A9mus_by_Paul_C%C3%A9zanne%2C_c._1894-95.JPG',
    whatToLookFor: [
      'The fractured, interlocking planes of orange rock. Cézanne didn\'t describe the quarry — he rebuilt it as geometry, each face of stone a distinct flat plane. This is proto-Cubism hiding in Post-Impressionist clothing.',
      'How the pine trees compete with the rock forms. Both are broken into similar angular shapes, so the boundary between nature and stone nearly dissolves. Everything becomes part of the same structural logic.',
      'The absence of sky. This is a closed, pressurized space. Cézanne made the quarry feel like a world with its own rules — a lesson Braque and Picasso absorbed when they saw works like this a decade later.',
    ],
    description: `Cézanne spent years painting the Bibémus quarry near Aix-en-Provence, an abandoned sandstone site that gave him exactly what he needed: geometric forms already cut by human hands, with light that struck at angles he could control. This canvas, now part of the Guggenheim's Thannhauser Collection, distills his method: nature as a problem of planes, volume, and structure. Picasso said Cézanne was "the father of us all." Bibémus is the proof.`,
  },
  renoir_parrot: {
    id: 'renoir_parrot',
    figureId: 'renoir',
    title: 'Woman with a Parrot',
    year: 1871,
    venueId: 'guggenheim',
    medium: 'Oil on canvas',
    dimensions: '36¼ × 25⅝ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Renoir_woman_with_a_parrot_1871.jpg/330px-Renoir_woman_with_a_parrot_1871.jpg',
    whatToLookFor: [
      'The loose, confident brushwork on the woman\'s dress. This is Renoir at 29, already freed from academic finish — the fabric shimmers without being described, the painting trusting your eye to complete what the brush left open.',
      'The parrot as a social prop. Parrots in 19th-century Parisian homes were status symbols, conversation pieces. This woman and her bird are a portrait of a certain kind of bourgeois leisure that Renoir would spend his whole career celebrating.',
      'The contrast between the soft figure and the harder, darker background. Renoir hasn\'t fully mastered the integration of figure and space that will define his mature work — but the tension here is alive.',
    ],
    description: `Painted the year after the Franco-Prussian War ended and Paris recovered from its siege, Woman with a Parrot is an early Renoir that already shows his essential temperament: pleasure, softness, a world of domestic ease worth painting. The Thannhauser Collection brought this work to the Guggenheim, where it sits in productive tension with the Cubist and abstract works in the building\'s upper rotunda.`,
  },
  degas_dancers_yellow: {
    id: 'degas_dancers_yellow',
    figureId: 'degas',
    title: 'Dancers in Green and Yellow',
    year: 1903,
    venueId: 'guggenheim',
    medium: 'Pastel on paper mounted on board',
    dimensions: '38½ × 40⅛ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dancers_in_Green_and_Yellow_by_Edgar_Degas%2C_c._1903.jpg/330px-Dancers_in_Green_and_Yellow_by_Edgar_Degas%2C_c._1903.jpg',
    whatToLookFor: [
      'The radical cropping. Four dancers, but you see no faces — just bodies, costume, and movement. Degas learned from Japanese prints and photography that cutting the frame mid-figure is more alive than centering the subject.',
      'The pastel layering. By his late career, Degas was nearly blind, yet his control of pastel only intensified. Look at how the yellow and green interact — built up in layers of hatching, then blended with his fingers or a stump.',
      'The sense of repetition and pattern. Four dancers in nearly identical poses: Degas was interested in movement as a recurring phenomenon, not as individual expression. These are bodies trained to do the same thing, over and over.',
    ],
    description: `By 1903, Degas was deep into the late phase of his career — nearly blind, increasingly reclusive, working almost exclusively in pastel. Dancers in Green and Yellow is from this period: larger, more abstracted, more focused on pure color than on narrative. The Guggenheim acquired it as part of the Thannhauser bequest, a gift that added a crucial counterpoint to the museum's modern holdings.`,
  },
  gauguin_vanilla: {
    id: 'gauguin_vanilla',
    figureId: 'gauguin',
    title: 'In the Vanilla Grove, Man and Horse',
    year: 1891,
    venueId: 'guggenheim',
    medium: 'Oil on burlap',
    dimensions: '28¾ × 36¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Paul_Gauguin_-_Dans_la_vanill%C3%A8re%2C_homme_et_cheval_%281891%29.jpg/330px-Paul_Gauguin_-_Dans_la_vanill%C3%A8re%2C_homme_et_cheval_%281891%29.jpg',
    whatToLookFor: [
      'The rough burlap support visible beneath the paint. Gauguin couldn\'t afford fine canvas in Tahiti, so he worked on whatever was available. The texture becomes part of the image — a material reminder that this was made far from Parisian studios.',
      'The simplified, flat color areas. No modeling, no European perspective. The horse, the man, the grove exist in a pictorial space Gauguin was inventing as he painted — flatter, more symbolic, closer to the visual logic he found in Polynesian and Javanese art.',
      'The mood of stillness. Unlike European genre painting, nothing is happening here narratively. The man and horse simply exist in the grove. Gauguin\'s Tahitian paintings propose a different relationship between humans and environment — presence without drama.',
    ],
    description: `Painted in Gauguin's first year in Tahiti, In the Vanilla Grove is a document of his radical reorientation. He had come to the Pacific to escape what he called "the disease of civilization." The burlap, the simplified color, the non-narrative composition: all of it represents a deliberate dismantling of everything he'd learned in Paris. The Guggenheim's Thannhauser Collection holds this work alongside the other Post-Impressionist masters who made Tahiti a recurring subject in art history.`,
  },

  // BROOKLYN MUSEUM
  degas_drying: {
    id: 'degas_drying',
    figureId: 'degas',
    title: 'Woman Drying Her Hair',
    year: 1905,
    venueId: 'brooklyn',
    medium: 'Pastel on paper',
    dimensions: '27¼ × 27¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Brooklyn_Museum_-_Woman_Drying_Her_Hair_%28Femme_s%27essuyant_les_cheveux%29_-_Edgar_Degas_-_overall.jpg/330px-Brooklyn_Museum_-_Woman_Drying_Her_Hair_%28Femme_s%27essuyant_les_cheveux%29_-_Edgar_Degas_-_overall.jpg',
    whatToLookFor: [
      'How Degas crops the figure to focus on the gesture alone. No face, no setting, no narrative — just a body in motion, a routine act rendered as pure form. This cropping is deliberate: Degas was studying movement, not portraiture.',
      'The directional pastel strokes following the contours of the body. Degas used pastel like no one before him, building forms through layered hatching rather than blended tones. The marks are almost sculptural.',
      'The intimacy of the subject. Degas\'s bathing and grooming series caused controversy when first shown — they were called voyeuristic. Look again: there\'s nothing prurient here. This is the private body, unperformed, doing what bodies do.',
    ],
    description: `Degas spent the last decades of his career obsessed with the female body in private motion — bathing, drying, combing hair. This pastel from the Brooklyn Museum's collection belongs to that series: a woman toweling her hair, seen from above or behind, absorbed in a task with no awareness of a viewer. Degas called these works "the human animal taking care of itself." The Brooklyn Museum's Impressionist holdings are a quiet treasure, less visited than MoMA or the Met, more intimate because of it.`,
  },
  cassatt_fitting: {
    id: 'cassatt_fitting',
    figureId: 'cassatt',
    title: 'The Fitting',
    year: 1891,
    venueId: 'brooklyn',
    medium: 'Drypoint and aquatint, printed in color',
    dimensions: '14⅞ × 10⅜ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Brooklyn_Museum_-_The_Fitting_-_Mary_Cassatt_-_overall.jpg/330px-Brooklyn_Museum_-_The_Fitting_-_Mary_Cassatt_-_overall.jpg',
    whatToLookFor: [
      'The radical flatness. After seeing Japanese woodblock prints at the 1890 Paris exhibition, Cassatt threw out depth. These figures exist on a surface, not in a space. Look at how the mirror, the foreground woman, and the background fuse into a single plane.',
      'The color printing technique. Cassatt made this using multiple etching plates — one per color — aligned by hand. The slight variations between printings were part of the effect. No two impressions are identical.',
      'What\'s being depicted: a dressmaker fitting a woman. Cassatt painted women\'s lives from the inside — not as objects of male attention, but as subjects engaged in their own routines. This is a domestic transaction, treated with the same formal seriousness Degas gave to ballet.',
    ],
    description: `In 1890, Cassatt visited an exhibition of Japanese ukiyo-e prints in Paris and was transformed. She immediately began a series of ten color aquatints — The Fitting is among the most celebrated. The flattened space, the bold outlines, the color printed from separate plates: all of it borrowed from Hiroshige and Utamaro and made entirely her own. The Brooklyn Museum holds a fine impression, part of a collection of Cassatt prints that rewards close looking.`,
  },
  pissarro_turkeys: {
    id: 'pissarro_turkeys',
    figureId: 'pissarro',
    title: 'Girl in Field with Turkeys',
    year: 1884,
    venueId: 'brooklyn',
    medium: 'Oil on canvas',
    dimensions: '21¼ × 25¾ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Brooklyn_Museum_-_Girl_in_Field_with_Turkeys_%28La_Dindonni%C3%A8re%29_-_Camille_Jacob_Pissarro.jpg/330px-Brooklyn_Museum_-_Girl_in_Field_with_Turkeys_%28La_Dindonni%C3%A8re%29_-_Camille_Jacob_Pissarro.jpg',
    whatToLookFor: [
      'The working peasant girl — not idealized, not romanticized. Pissarro was a committed anarchist who painted rural labor without sentiment. This girl is doing a job, and the painting respects that fact.',
      'The broken, dappled light across the grass. This is classic Impressionist observation: Pissarro looked at how sunlight actually falls on a field at midday, patchy and inconsistent, rather than how academic convention said light should behave.',
      'The composition\'s horizontal structure. Field, turkeys, girl, trees: stacked registers of information. Pissarro was also absorbing Japanese print influence by this point, and his landscapes increasingly organize space as layered bands rather than receding perspective.',
    ],
    description: `Pissarro was the moral center of Impressionism — the eldest of the group, the one who mentored Cézanne, who included Seurat, who never stopped experimenting. Girl in Field with Turkeys (La Dindonnière) from 1884 shows him at his most characteristic: rural France observed with socialist sympathy and Impressionist light. The Brooklyn Museum's holdings give you Pissarro outside the expected narrative, away from the famous canvases at the Met.`,
  },
  lautrec_babylone: {
    id: 'lautrec_babylone',
    figureId: 'toulouse_lautrec',
    title: "Babylone d'Allemagne (Poster)",
    year: 1894,
    venueId: 'brooklyn',
    medium: 'Color lithograph',
    dimensions: '46⅝ × 32¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Brooklyn_Museum_-_Babylone_d%27Allemagne_%28Poster%29_-_Henri_de_Toulouse-Lautrec.jpg/330px-Brooklyn_Museum_-_Babylone_d%27Allemagne_%28Poster%29_-_Henri_de_Toulouse-Lautrec.jpg',
    whatToLookFor: [
      'The command of silhouette. Lautrec designed posters that read instantly from a distance — a figure, a color field, a name. This is graphic design before the term existed, made by a painter who understood how eyes move through a street.',
      'The limited palette: black, red, a cream ground. Lautrec couldn\'t afford the luxury of subtle gradation in mass-printed lithography, so he turned the constraint into a style. These colors shout.',
      'The woman\'s posture and expression — proud, self-possessed, confrontational. Lautrec\'s poster women are never passive. They look out at you as equals, or as challenges. This was unusual for commercial art of the 1890s.',
    ],
    description: `Toulouse-Lautrec essentially invented the modern poster. Babylone d'Allemagne, made in 1894 for a novel about Prussian military society in Paris, shows his method fully formed: bold lithographic color, compressed figure, instant legibility. The Brooklyn Museum holds a strong collection of his graphic work — the prints and posters that proved fine art thinking could transform commercial design, decades before anyone used the word.`,
  },
  hartley_painting48: {
    id: 'hartley_painting48',
    figureId: 'hartley',
    title: 'Painting No. 48',
    year: 1913,
    venueId: 'brooklyn',
    medium: 'Oil on canvas',
    dimensions: '47¼ × 47¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Marsden_Hartley_-_Painting_No._48_-_Google_Art_Project.jpg/330px-Marsden_Hartley_-_Painting_No._48_-_Google_Art_Project.jpg',
    whatToLookFor: [
      'The military symbology: iron crosses, epaulettes, regimental numbers, flag colors. Hartley absorbed these from German military culture during his Berlin years. They\'re not political commentary — they\'re a visual language he found beautiful and emotionally charged.',
      'The dense, flat arrangement of shapes. No depth, no perspective: elements stack and jostle on the picture plane in a way that owes as much to Cubism as to German Expressionism. This is an American painter processing everything Europe had thrown at him.',
      'The energy of the composition. Everything is pressing outward from the center, straining at the canvas edges. Hartley was making paintings that felt like they were about to burst — a quality that makes them contemporary a century later.',
    ],
    description: `Marsden Hartley went to Berlin in 1913 and fell into a world of military pageantry, Kaiser-era symbolism, and a passionate friendship with a German officer who died in the opening weeks of World War I. Painting No. 48 is from that charged Berlin period: abstract, symbolic, electric with personal grief and aesthetic discovery. The Brooklyn Museum holds this canvas as a cornerstone of its American Modernism collection — a painting that shows Hartley at his most international, and most himself.`,
  },

  // COOPER HEWITT
  cassatt_gardner: {
    id: 'cassatt_gardner',
    figureId: 'cassatt',
    title: 'Gardner (Cassatt) Held by His Mother',
    year: 1889,
    venueId: 'cooper_hewitt',
    medium: 'Drypoint and aquatint on paper',
    dimensions: '13½ × 8⅞ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Print%2C_Gardner_%28Cassatt%29_Held_by_His_Mother%2C_ca._1889_%28CH_18103393%29.jpg/330px-Print%2C_Gardner_%28Cassatt%29_Held_by_His_Mother%2C_ca._1889_%28CH_18103393%29.jpg',
    whatToLookFor: [
      'The tenderness without sentimentality. Cassatt painted mothers and children constantly, but never with Victorian sweetness. This mother and child are studying each other with real attention — equal, alert, present.',
      'The printmaking technique: drypoint scratches the copper plate directly, creating a burr that holds ink and produces characteristically velvety, soft lines. These lines feel almost hand-drawn rather than etched.',
      'What the Cooper Hewitt context adds. This is a fine art print in a design museum — a reminder that for Cassatt, the boundary between painting, printmaking, and design was deliberately permeable. She thought of prints as objects, not just reproductions.',
    ],
    description: `Cassatt's niece's son Gardner was one of her favorite subjects in the late 1880s, appearing in paintings and prints that explore maternal attention without the usual Victorian idealization. This drypoint and aquatint, held in the Cooper Hewitt's collection, precedes the famous Japanese-influenced color prints by a year — you can see Cassatt working toward that flatness, that compression, that radical simplification she'd achieve in 1890. The Cooper Hewitt is the right place to see it: a design institution that understands printmaking as craft and art simultaneously.`,
  },
  lautrec_vieilles: {
    id: 'lautrec_vieilles',
    figureId: 'toulouse_lautrec',
    title: 'Les Vieilles Histoires (Title Page)',
    year: 1893,
    venueId: 'cooper_hewitt',
    medium: 'Color lithograph',
    dimensions: '10⅜ × 8¼ in',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Print%2C_Title_Page%2C_from_%22Les_Vieilles_Histoires%2C_po%C3%A9sies_de_Jean_Goudezki%2C_mises_en_Musique_de_D%C3%A9sir%C3%A9_Dihou_-_%2C_1893_%28CH_18484277%29.jpg/330px-Print%2C_Title_Page%2C_from_%22Les_Vieilles_Histoires%2C_po%C3%A9sies_de_Jean_Goudezki%2C_mises_en_Musique_de_D%C3%A9sir%C3%A9_Dihou_-_%2C_1893_%28CH_18484277%29.jpg',
    whatToLookFor: [
      'The integration of text and image. Lautrec treated typography as a graphic element — the letters are part of the composition, not annotations to it. This is the defining feature of his poster and print work, and what makes him a figure in design history as well as art history.',
      'The economy of line. With a few strokes, Lautrec defines a figure, a mood, a setting. This is a title page, not a major work — but it shows his draftsmanship at its most distilled. Nothing is wasted.',
      'The context: this is a book cover. Lautrec made images that crossed every category — posters, programs, sheet music covers, book fronts, fine art prints. The Cooper Hewitt, as a design museum, is perhaps the best place in New York to understand the full range of what he did.',
    ],
    description: `Les Vieilles Histoires was a collection of poems with piano settings, published in Paris in 1893. Lautrec designed the cover. That sentence barely captures what it means: a painter of the first rank treating a commercial commission with the same seriousness and invention he brought to his paintings. The Cooper Hewitt holds this lithograph as part of its design collection — proof that the boundary between art and design in the 1890s was exactly as porous as Lautrec wanted it to be.`,
  },

  // ── JAZZ WORKS ──────────────────────────────────────────

  // BEBOP
  parker_strings: {
    id: 'parker_strings',
    figureId: 'parker',
    title: 'Charlie Parker with Strings',
    year: 1950,
    venueId: 'birdland',
    medium: 'Studio album · Mercury Records',
    dimensions: 'Charlie Parker (alto sax) with strings arr. by Jimmy Carroll',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Portrait_of_Charlie_Parker_in_1947.jpg/330px-Portrait_of_Charlie_Parker_in_1947.jpg',
    whatToLookFor: [
      `Start with "Just Friends." The strings set up a scene of lush, almost saccharine beauty — and then Parker enters with an alto saxophone improvisation so fast and melodically inventive that the arrangement becomes the wrong frame around the right picture. The contrast is the entire point.`,
      `Listen to how Parker never loses the emotional thread. Bebop's reputation is cerebral and difficult. Parker over strings is just sad and beautiful — his lines are as singing as anything in the American songbook, even when they're moving at double speed.`,
      `Notice the rhythmic freedom against the fixed orchestral backdrop. Parker was used to players who could follow him anywhere. The strings can't. So he creates a conversation with himself against a static harmonic ground — and wins.`,
    ],
    description: `By 1950, Parker had played bebop with small combos for five years and was looking for something different. Producer Norman Granz set up sessions with a full string ensemble. The jazz establishment called it a sellout; Parker called it his greatest recordings. Both were partially right: the music is extraordinarily beautiful and completely undemanding. What it reveals is that Parker's melodic invention was so fully formed that he could flower in any harmonic garden — strings, bebop, ballads, all the same Bird.`,
  },
  gillespie_groovin: {
    id: 'gillespie_groovin',
    figureId: 'gillespie',
    title: "Groovin' High",
    year: 1945,
    venueId: 'birdland',
    medium: 'Studio sessions · Musicraft Records',
    dimensions: 'Dizzy Gillespie (trumpet), Charlie Parker (alto sax), Al Haig (piano)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Portrait_of_Dizzy_Gillespie%2C_Famous_Door%2C_New_York%2C_N.Y.%2C_ca._June_1946_%28cropped%29.jpg/330px-Portrait_of_Dizzy_Gillespie%2C_Famous_Door%2C_New_York%2C_N.Y.%2C_ca._June_1946_%28cropped%29.jpg',
    whatToLookFor: [
      `The tempo is the first shock. "Groovin' High" moves at a speed that swing bands couldn't navigate — Gillespie and Parker chose these tempos deliberately, to filter out musicians who couldn't keep up. This was music as selective exclusion.`,
      `Listen to Gillespie's trumpet phrasing. He doesn't play melodies in the conventional sense — he plays harmonic implications, moving through the changes with a logic that's more architectural than melodic. The note choices are derived from the chord structure rather than the tune.`,
      `"Salt Peanuts" from the same sessions: the composed unison lines between trumpet and alto saxophone. These head arrangements — the agreed-upon melodies before and after the improvised solos — are where bebop's compositional genius lives. Intricate, asymmetrical, impossible to dance to. Exactly intentional.`,
    ],
    description: `The 1945 Musicraft sessions with Gillespie, Parker, and rhythm section are the founding documents of bebop — the music recorded in small New York studios after those late-night Harlem sessions at Minton's Playhouse, finally committed to wax. "Groovin' High," "Dizzy Atmosphere," "Salt Peanuts": the canon was established in a few afternoons. Birdland, which opened four years later and was named for Parker, carries the spirit of this music in its very name.`,
  },
  monk_brilliant: {
    id: 'monk_brilliant',
    figureId: 'monk',
    title: 'Brilliant Corners',
    year: 1956,
    venueId: 'village_vanguard',
    medium: 'Studio album · Riverside Records',
    dimensions: 'Thelonious Monk (piano), Sonny Rollins (tenor sax), Ernie Henry (alto sax)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg/330px-Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg',
    whatToLookFor: [
      `The title track, "Brilliant Corners," was so complicated that the musicians couldn't play it straight through — the final recording was edited together from fragments. Listen for the rhythmic irregularities: bars of unusual length, accents that fall where you don't expect them. This is not sloppy jazz. It's jazz with a different sense of where the beat lives.`,
      `Monk's piano style: the notes he chooses to play AND the notes he chooses not to play. The silences are compositional decisions. The slight dissonances — notes a half-step off from what you expect — are deliberate harmonic choices, not errors. He called them "right wrong notes."`,
      `Sonny Rollins on tenor saxophone, one year before his Village Vanguard recordings. This is him in formation: already great, not yet the colossus he'd become. The contrast between his linear improvisational style and Monk's angular, percussive comping is the album's central drama.`,
    ],
    description: `Thelonious Monk made Brilliant Corners in 1956, after more than a decade of being considered too eccentric for mainstream success. The album is the proof that the eccentricity was the point — these compositions couldn't have been written by anyone operating within conventional harmonic thinking. Monk had a long residency at the Village Vanguard in 1975-76 that became legendary; this album is the intellectual foundation for everything he played there.`,
  },
  powell_amazing: {
    id: 'powell_amazing',
    figureId: 'bud_powell',
    title: 'The Amazing Bud Powell, Vol. 1',
    year: 1949,
    venueId: 'blue_note',
    medium: 'Studio album · Blue Note Records',
    dimensions: 'Bud Powell (piano), Curly Russell (bass), Max Roach (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bud_Powell_1960.jpg/330px-Bud_Powell_1960.jpg',
    whatToLookFor: [
      `The speed and precision of the right hand. Powell translated bebop's harmonic language to the keyboard the way Parker translated it to the alto saxophone — at tempos that shouldn't be possible, with lines that are simultaneously melodic and harmonically comprehensive. The right hand is doing what the horn players were doing.`,
      `The left hand: spare, rhythmically displaced, not keeping steady time in the way older jazz piano did. Powell's left hand punctuates and suggests rather than supporting. The entire harmonic responsibility moves to the chord voicings he drops in — dense, brief, perfectly placed.`,
      `"Un Poco Loco" from these sessions: a Latin-influenced piece with an unusual rhythmic feel that Powell repeats obsessively across multiple takes (all three are on the album). Listen to how the obsessive repetition reveals rather than hides — each take uncovers something different inside the same material.`,
    ],
    description: `Bud Powell recorded these sessions for Blue Note in 1949 and 1951, between episodes of severe mental illness and hospitalizations that would mark his entire life. The music shows none of that damage — or rather, it shows it transformed into something else entirely: a piano vocabulary of extraordinary precision, speed, and harmonic intelligence that became the template for every bebop and post-bop pianist who followed. Blue Note Records built its identity on sessions like this one.`,
  },
  roach_freedom: {
    id: 'roach_freedom',
    figureId: 'max_roach',
    title: "We Insist! Max Roach's Freedom Now Suite",
    year: 1960,
    venueId: 'jazz_lincoln_center',
    medium: 'Studio album · Candid Records',
    dimensions: 'Max Roach (drums), Abbey Lincoln (vocals), Coleman Hawkins, Booker Little',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Max_Roach%2C_Three_Deuces%2C_ca._1947.jpg/330px-Max_Roach%2C_Three_Deuces%2C_ca._1947.jpg',
    whatToLookFor: [
      `"Triptych: Prayer / Protest / Peace" — Abbey Lincoln's vocal performance across three movements. The middle section, "Protest," requires her to scream, wail, and produce sounds that aren't conventionally musical. In 1960, this was shocking. It still is. The voice as percussion, as political act, as pure emotion exceeding language.`,
      `Max Roach's drumming throughout: jazz's greatest drummer at the intersection of technical mastery and political conviction. The drums don't just keep time — they argue, insist, mourn. The title track's march rhythm is the sound of the Civil Rights movement rendered as musical form.`,
      `The album was recorded a year after the Greensboro sit-ins and the same year as the Sharpeville massacre in South Africa. These events are in the music explicitly — the suite was written to mark the centennial of the Emancipation Proclamation. Jazz at Lincoln Center, which programs the music's tradition and its politics simultaneously, is the right place to encounter this recording.`,
    ],
    description: `Max Roach made We Insist! in 1960, the year the Civil Rights movement was reaching a sustained intensity, and made it into one of the most explicitly political records in jazz history. This was not accidental: Roach had been thinking about the connection between African American music and African American freedom for his entire career. Abbey Lincoln's vocal performance — especially on "Protest" — is the most emotionally demanding performance on any jazz record. It is not comfortable music. It is essential music.`,
  },

  // HARD BOP
  miles_midnight: {
    id: 'miles_midnight',
    figureId: 'miles_davis',
    title: "'Round About Midnight",
    year: 1957,
    venueId: 'village_vanguard',
    medium: 'Studio album · Columbia Records',
    dimensions: 'Miles Davis (trumpet), John Coltrane (tenor sax), Red Garland (piano), Paul Chambers (bass), Philly Joe Jones (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Miles_Davis_by_Palumbo_cropped.jpg/330px-Miles_Davis_by_Palumbo_cropped.jpg',
    whatToLookFor: [
      `Miles's tone. Even by 1957, he was already playing with a muted, introverted sound that placed every note at a slight remove from the listener — as if the trumpet were thinking out loud rather than performing. This intimacy became the defining quality of his mature work.`,
      `John Coltrane on tenor saxophone: this is him a year into his time with Miles, already extraordinary, not yet post-bop. His lines are longer and more harmonically ambitious than anything his predecessors played. The tension between his expansiveness and Miles's restraint is the album's defining dynamic.`,
      `The ballads. Miles was the master of the jazz ballad — the ability to find the emotional center of a song and play nothing else. "Round Midnight" (the Monk tune), "It Never Entered My Mind," "I Could Write a Book": listen to how much he communicates with almost nothing.`,
    ],
    description: `Miles Davis's first album for Columbia, recorded in 1955-56, is where his mature voice crystallizes. The first great Miles Davis quintet — with Coltrane, Red Garland, Paul Chambers, Philly Joe Jones — was one of the greatest working bands in jazz history, and this album captures them at the beginning of that run. The Village Vanguard was their New York home; hearing this music and then walking into that basement club on 7th Avenue creates a kind of temporal double exposure.`,
  },
  blakey_moanin: {
    id: 'blakey_moanin',
    figureId: 'art_blakey',
    title: "Moanin'",
    year: 1958,
    venueId: 'blue_note',
    medium: 'Studio album · Blue Note Records',
    dimensions: 'Art Blakey (drums), Lee Morgan (trumpet), Benny Golson (tenor sax), Bobby Timmons (piano)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Art_blakey_studio_portrait.jpg/330px-Art_blakey_studio_portrait.jpg',
    whatToLookFor: [
      `The title track, composed by Bobby Timmons: a blues-gospel melody so perfectly constructed that it sounds like it already existed before Timmons wrote it. Listen to how the call-and-response between the horns and piano in the head arrangement establishes the emotional tone for everything that follows.`,
      `Art Blakey's drumming: the most swinging, the most pushing, the most driving in hard bop. He doesn't just keep time — he pushes the soloists forward, responds to what they're doing, elevates the energy of every bar. This is what "support" means in jazz: making every other player better.`,
      `Lee Morgan's trumpet solo on "Moanin'": he was 20 years old. The confidence, the melodic invention, the swagger — all of it fully formed at 20. Blakey was famous for hiring musicians this young, this talented, this unready, and turning them into the most important players of the next generation.`,
    ],
    description: `"Moanin'" is the definitive hard bop album. Art Blakey and the Jazz Messengers at Blue Note in October 1958 — Lee Morgan, Benny Golson, Bobby Timmons, Jymie Merritt — playing music that took everything bebop had accomplished harmonically and rhythmically and added back what bebop had left behind: the blues, the church, the groove. Blue Note Records released this, and it remains the label's most representative statement of what hard bop could be.`,
  },
  silver_song: {
    id: 'silver_song',
    figureId: 'horace_silver',
    title: 'Song for My Father',
    year: 1964,
    venueId: 'blue_note',
    medium: 'Studio album · Blue Note Records',
    dimensions: 'Horace Silver (piano), Carmel Jones (trumpet), Joe Henderson (tenor sax)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Horace_Silver_by_Dmitri_Savitski_1989.jpg/330px-Horace_Silver_by_Dmitri_Savitski_1989.jpg',
    whatToLookFor: [
      `The title track's opening vamp: that descending piano figure, repeated and repeated before the horns enter. This is Silver's genius — creating a groove so simple and so inevitable that you feel like you've known it forever before the album is two minutes old.`,
      `The Cape Verdean influence. Silver's father was from Cape Verde, and the rhythms on this album reflect that African-Portuguese musical heritage — a slightly different relationship to the beat than standard hard bop, rooted in something older and more geographically specific.`,
      `Joe Henderson's tenor saxophone solo on the title track: this was Henderson's first recording, and it announces an entire musical personality. The outside-the-changes phrasing, the dark tone, the rhythmic unpredictability — all of it was there from day one.`,
    ],
    description: `Horace Silver wrote the blueprint for hard bop's emotional vocabulary, and "Song for My Father" — named for his Cape Verdean immigrant father — is his masterpiece. The album's groove is so deep and so accessible that Steely Dan sampled the bass line for "Rikki Don't Lose That Number" in 1974, introducing Silver's music to a generation of rock listeners who didn't know they were hearing jazz. Blue Note Records released it, and it still sells.`,
  },
  brown_roach: {
    id: 'brown_roach',
    figureId: 'clifford_brown',
    title: 'Clifford Brown and Max Roach',
    year: 1954,
    venueId: 'birdland',
    medium: 'Studio album · EmArcy Records',
    dimensions: 'Clifford Brown (trumpet), Max Roach (drums), Harold Land (tenor sax), Richie Powell (piano)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Clifford_Brown_1956.jpg/330px-Clifford_Brown_1956.jpg',
    whatToLookFor: [
      `Brown's tone: warm, full, lyrical, completely without the pinched or edgy quality that many bebop trumpeters brought to fast tempos. He could play anything — ballads, burners, blues — with the same completeness of sound. This is what made him the template.`,
      `"Joy Spring" and "Daahoud," both composed by Brown: the melodies are so singable, so constructed, that you realize you're in the presence of a composer as much as an improviser. Clifford Brown could have had a career writing for orchestras. He chose jazz, and jazz was better for it.`,
      `The drum-piano interplay of Max Roach and Richie Powell (Bud Powell's younger brother). Roach had been reinventing jazz drumming since the bebop sessions with Parker; here he's doing something different — more melodic, more compositionally integrated. Listen to how the drums function as a second voice.`,
    ],
    description: `Clifford Brown was 23 when he recorded this album and already one of the most complete musicians in jazz. The partnership with Max Roach — drummer-trumpet co-leaders, equals in musical authority — was unprecedented. Brown and Roach played Birdland together in 1954 and 1955; the club was named for the man Brown most admired. He died two years after this recording. The music is complete, finished, needing nothing added.`,
  },
  rollins_vanguard: {
    id: 'rollins_vanguard',
    figureId: 'sonny_rollins',
    title: 'A Night at the Village Vanguard',
    year: 1957,
    venueId: 'village_vanguard',
    medium: 'Live album · Blue Note Records',
    dimensions: 'Sonny Rollins (tenor sax), Wilbur Ware (bass), Elvin Jones (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sonny_Rollins_2011.jpg/330px-Sonny_Rollins_2011.jpg',
    whatToLookFor: [
      `The pianoless trio format. Rollins chose to record without a piano — no chord instrument at all, just saxophone, bass, and drums. This removes the harmonic safety net and forces Rollins to imply the chord changes through the notes he chooses. He does it effortlessly. This is what complete harmonic knowledge sounds like in practice.`,
      `The motivic development. Rollins takes a small rhythmic or melodic idea — sometimes just two or three notes — and develops it across the entire length of a solo, transforming it, inverting it, varying it. This is jazz improvisation as composition in real time.`,
      `Elvin Jones on drums, one year before he joins Coltrane's classic quartet. His polyrhythmic approach — multiple rhythmic streams simultaneously — was already fully developed here. Listen to how the drums seem to play in different time signatures at once while still swinging hard.`,
    ],
    description: `Sonny Rollins recorded this live at the Village Vanguard on November 3, 1957 — a Sunday night, no piano player, just bass and drums — and produced what many consider the greatest live jazz album ever made. The freedom from a chord instrument pushed him into the most exposed improvising of his career, and he responded with complete mastery. This is the Vanguard at its most essential: a room where a musician can go further than anywhere else.`,
  },

  // MODAL JAZZ
  coltrane_love: {
    id: 'coltrane_love',
    figureId: 'coltrane',
    title: 'A Love Supreme',
    year: 1964,
    venueId: 'village_vanguard',
    medium: 'Studio album · Impulse! Records',
    dimensions: 'John Coltrane (soprano/tenor sax), McCoy Tyner (piano), Jimmy Garrison (bass), Elvin Jones (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/John_Coltrane_1963_cropped_ver2.jpg/330px-John_Coltrane_1963_cropped_ver2.jpg',
    whatToLookFor: [
      `The four-movement structure: Acknowledgement, Resolution, Pursuance, Psalm. This is a jazz suite organized like a prayer — and the liner notes Coltrane wrote confirm that's exactly what it was. Listen to how the mood changes between movements: from meditation to propulsion to ecstatic intensity to gentle close.`,
      `The bass motif in "Acknowledgement": Jimmy Garrison plays a four-note figure that Coltrane then transposes into every key on the saxophone, chanting "a love supreme" over it. This is the musical spine of the entire suite — a single idea heard from every angle.`,
      `Elvin Jones's drumming in "Pursuance" — the third movement, the most intense section. Jones plays polyrhythmic waves over Coltrane's searching tenor improvisation. Two musicians pushing each other to the edge of what's possible while maintaining complete musical coherence. This is what the Village Vanguard made possible.`,
    ],
    description: `John Coltrane recorded A Love Supreme on December 9, 1964, in a single session. He had been playing regularly at the Village Vanguard with this quartet for three years — the room had helped forge the music, and the music transcended the room. It is the most complete statement in jazz: technically advanced, emotionally overwhelming, and spiritually unambiguous. Coltrane described it as an offering to God. It functions as one.`,
  },
  evans_sunday: {
    id: 'evans_sunday',
    figureId: 'bill_evans',
    title: 'Sunday at the Village Vanguard',
    year: 1961,
    venueId: 'village_vanguard',
    medium: 'Live album · Riverside Records',
    dimensions: 'Bill Evans (piano), Scott LaFaro (bass), Paul Motian (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg/330px-Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg',
    whatToLookFor: [
      `Scott LaFaro's bass playing: he's not accompanying the piano — he's having a conversation with it. The bass moves freely, at the same rhythmic and melodic level as Evans, sometimes taking the melodic lead entirely. This was the invention of the "interactive" jazz trio, and it was happening live in this room on June 25, 1961.`,
      `Evans's chord voicings: close, dense, harmonically ambiguous, borrowed from classical impressionism (Ravel and Debussy are audible influences). These voicings created a harmonic language so distinctive that musicians still call certain chord structures "Evansian" decades later.`,
      `The tragedy embedded in the recording: LaFaro died in a car accident eleven days after this was recorded, at 25. He had been with Evans for two years. These recordings are the only complete documentation of what they were doing together. The music is complete; the story is not.`,
    ],
    description: `Bill Evans brought his trio to the Village Vanguard on June 25, 1961, and producer Orrin Keepnews recorded everything. The resulting recordings — released as Sunday at the Village Vanguard and Waltz for Debby — are among the most important in jazz. Evans, Scott LaFaro, and Paul Motian had developed a genuinely new way for three musicians to interact: not leader and accompanists but three equal voices in constant conversation. LaFaro's death eleven days later made these recordings documents of something that could never be rebuilt.`,
  },
  shorter_speak: {
    id: 'shorter_speak',
    figureId: 'wayne_shorter',
    title: 'Speak No Evil',
    year: 1964,
    venueId: 'blue_note',
    medium: 'Studio album · Blue Note Records',
    dimensions: 'Wayne Shorter (tenor sax), Freddie Hubbard (trumpet), Herbie Hancock (piano), Ron Carter (bass), Elvin Jones (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Wayne-Shorter_in_Amsterdam%2C_1980.jpg/330px-Wayne-Shorter_in_Amsterdam%2C_1980.jpg',
    whatToLookFor: [
      `Shorter's melodies. They don't resolve the way melodies are supposed to — they end in unexpected places, linger a note too long on a dissonance, set up expectations and then move somewhere adjacent rather than where you anticipated. This is what makes them unforgettable: slightly wrong in a way that turns out to be right.`,
      `The personnel: this is essentially the Miles Davis second great quintet's rhythm section plus Freddie Hubbard. Hancock, Carter, and Jones at 24-26 years old, already among the most sophisticated rhythm section players in jazz history. The album is a blueprint for what would become the most important working band of the 1960s.`,
      `"Infant Eyes," the ballad: five minutes of one of the most beautiful melodies anyone wrote in the 20th century, played with complete understatement. Shorter described it as a lullaby. It's also structurally unusual — the harmonic movement doesn't follow any standard pattern. The beauty conceals the complexity.`,
    ],
    description: `Wayne Shorter recorded Speak No Evil on Christmas Eve, 1964, for Blue Note — one album in a sequence of masterpieces he made for the label in his mid-20s. The compositions announced a composer unlike anyone else working in jazz: melodies that seemed familiar until you tried to sing them back, harmonic structures that moved according to their own internal logic, forms that suggested standard jazz practice while doing something else entirely. Shorter would bring all of this to the Miles Davis Quintet when he joined the following year.`,
  },
  tyner_real: {
    id: 'tyner_real',
    figureId: 'mccoy_tyner',
    title: 'The Real McCoy',
    year: 1967,
    venueId: 'blue_note',
    medium: 'Studio album · Blue Note Records',
    dimensions: 'McCoy Tyner (piano), Joe Henderson (tenor sax), Ron Carter (bass), Elvin Jones (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Mccoy_Tyner_1973_gh_%28cropped%29.jpg/330px-Mccoy_Tyner_1973_gh_%28cropped%29.jpg',
    whatToLookFor: [
      `Tyner's left hand: massive quartal chords — stacked in fourths rather than thirds — that create a harmonic density unlike anything in earlier jazz piano. These chords don't function as Western tonal harmony; they create an open resonance, a drone-like foundation that gives the improvisation a modal, non-Western quality.`,
      `The rhythm section: Elvin Jones, who just left Coltrane's quartet, and Ron Carter, who just left the Miles Davis Quintet. These are two of the three or four most important jazz musicians alive in 1967, playing together for the first time, responding to Tyner with complete freedom and complete discipline simultaneously.`,
      `"Passion Dance": the opening track, which announces Tyner's post-Coltrane identity in four minutes. The energy is enormous — this is not contemplative piano trio music. The piano is physical, rhythmic, percussive. Tyner hits the instrument the way Blakey hit his drums.`,
    ],
    description: `McCoy Tyner left John Coltrane's quartet in 1965 when the music became too free and too loud for him. The Real McCoy, recorded two years later, is his first fully realized statement as a leader — and it turns out the pianist who had been the harmonic anchor of the greatest modal jazz group in history had his own distinctive voice all along. Blue Note released it at the label's creative peak, and it stands among the label's finest albums.`,
  },
  hancock_maiden: {
    id: 'hancock_maiden',
    figureId: 'herbie_hancock',
    title: 'Maiden Voyage',
    year: 1965,
    venueId: 'blue_note',
    medium: 'Studio album · Blue Note Records',
    dimensions: 'Herbie Hancock (piano), Freddie Hubbard (trumpet), George Coleman (tenor sax), Ron Carter (bass), Tony Williams (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Herbie_Hancock_2023.jpg/330px-Herbie_Hancock_2023.jpg',
    whatToLookFor: [
      `The suspended quality of the harmony. The title track opens with chords that don't resolve — they float, suspended, like something seen through water. Hancock wrote music that evoked the ocean, and the harmonic choices create a physical sensation of weightlessness, of being held up by something beneath you.`,
      `Tony Williams on drums, 19 years old. Williams was already the most innovative drummer of his generation — polyrhythmic, playing across multiple time signatures simultaneously, treating the drums as a melodic instrument. On this record he plays with a freedom that most 40-year-old drummers couldn't manage.`,
      `The suite quality of the album: all five pieces are connected thematically, and together they tell a continuous story. This is Hancock thinking like a composer rather than an improviser — the album has a shape, an arc, an intention that goes beyond any individual track.`,
    ],
    description: `Herbie Hancock was 25 when he recorded Maiden Voyage for Blue Note in March 1965. He had been Miles Davis's pianist for two years, had already written "Watermelon Man" and "Cantaloupe Island," and was already one of the most harmonically sophisticated musicians in jazz. Maiden Voyage is where he arrived at his own complete statement: a suite of interconnected pieces with an emotional and thematic coherence that made it clear Hancock was a composer in the deepest sense, not just a great improviser.`,
  },

  // FREE JAZZ
  coleman_shape: {
    id: 'coleman_shape',
    figureId: 'ornette_coleman',
    title: 'The Shape of Jazz to Come',
    year: 1959,
    venueId: 'smalls',
    medium: 'Studio album · Atlantic Records',
    dimensions: 'Ornette Coleman (alto sax), Don Cherry (trumpet), Charlie Haden (bass), Billy Higgins (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Ornette-Coleman-2008-Heidelberg-schindelbeck.jpg/330px-Ornette-Coleman-2008-Heidelberg-schindelbeck.jpg',
    whatToLookFor: [
      `There are no chord changes. Coleman eliminated the harmonic structure that had organized jazz since its beginning — the cycle of chord changes over which everyone improvised. Instead, the music moves through melody and rhythm only, with the harmony implied by what Coleman plays rather than dictated by a progression. This is either freedom or chaos, and the album makes clear it is freedom.`,
      `The intonation: slightly off, deliberately so. Coleman played a plastic saxophone and adjusted his pitch to follow melodic and emotional logic rather than equal temperament. Notes are sharp or flat because the line calls for it, not because of error. This takes several listens to hear as intentional. After that, it sounds like the only honest way to play.`,
      `Charlie Haden's bass: freed from the function of stating the harmonic progression, he becomes a melodic instrument equal to the saxophone and trumpet. Listen to how he moves — he's not accompanying, he's composing in real time alongside Coleman, finding a new role for the bass in the absence of chords.`,
    ],
    description: `Ornette Coleman arrived in New York in November 1959, played the Five Spot Café for six weeks, and split the jazz world permanently in two. Gunther Schuller called it the future; Miles Davis called him a fake. The Shape of Jazz to Come, recorded the same year, is the document: no chord changes, slightly off intonation, the most emotionally direct music anyone had made since early blues. Smalls, New York's great democratic jazz room, carries the spirit of the experimental tradition Coleman inaugurated.`,
  },
  mingus_black_saint: {
    id: 'mingus_black_saint',
    figureId: 'charles_mingus',
    title: 'The Black Saint and the Sinner Lady',
    year: 1963,
    venueId: 'village_vanguard',
    medium: 'Studio album · Impulse! Records',
    dimensions: 'Charles Mingus (bass, piano) with 11-piece ensemble',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Charles_Mingus_1976_cropped.jpg/330px-Charles_Mingus_1976_cropped.jpg',
    whatToLookFor: [
      `The album is one continuous composition in four parts — a 35-minute ballet for jazz orchestra. Listen to how themes develop and return across the whole arc: motifs introduced in the first section reappear transformed in the last. This is jazz thinking at the scale of a symphony, without losing any of jazz's spontaneity.`,
      `The alto saxophone of Charlie Mariano: wailing, anguished, pushing into the upper register with an intensity that approaches screaming. Mingus gave his soloists specific emotional directives — this one was told to play like he was crying. The result is the most emotionally raw sound on any jazz record of the 1960s.`,
      `The composed and improvised elements are indistinguishable. Mingus worked from sketches and verbal directions rather than full scores, letting his musicians find the music within the framework. The result sounds simultaneously fully composed and fully improvised — because it is both simultaneously.`,
    ],
    description: `Charles Mingus made The Black Saint and the Sinner Lady in January 1963 and included liner notes written by his therapist — an act of strange genius that captures the album's unusual relationship between the clinical and the ecstatic. The music itself is the most ambitious jazz composition of its decade: a ballet for jazz orchestra that encompasses blues, flamenco, gospel, and bebop within a single sustained emotional argument. The Village Vanguard was Mingus's New York home. The music he made there exceeded any room.`,
  },
  taylor_unit: {
    id: 'taylor_unit',
    figureId: 'cecil_taylor',
    title: 'Unit Structures',
    year: 1966,
    venueId: 'blue_note',
    medium: 'Studio album · Blue Note Records',
    dimensions: 'Cecil Taylor (piano), Jimmy Lyons (alto sax), Ken McIntyre (oboe, alto sax, bass clarinet)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Cecil_taylor_E5122329-2.jpg/330px-Cecil_taylor_E5122329-2.jpg',
    whatToLookFor: [
      `Taylor's piano technique: he plays clusters, dense groupings of adjacent notes struck simultaneously or in rapid succession, at enormous speed and dynamic range. This is the piano as percussion, as orchestral instrument, as something that produces continuous waves of sound rather than melody. It requires a different kind of listening — follow the energy rather than the notes.`,
      `The unusual instrumentation: Ken McIntyre plays oboe and bass clarinet alongside alto saxophone, bringing timbres into jazz that had no precedent. Taylor was always interested in the full range of sound, not just the standard jazz instruments.`,
      `The structure: "Unit Structures" is organized not around chord changes or even fixed meter, but around what Taylor called "unit structures" — recurring sonic events that serve as landmarks within the improvisation. Listen for the returns, the moments of collective intensity, the sudden silences. The architecture is there; it just doesn't look like a floor plan you've seen before.`,
    ],
    description: `Cecil Taylor recorded Unit Structures for Blue Note in May 1966 — one of the label's most adventurous releases, and one of its least commercially viable. Taylor had studied at the New England Conservatory and spent the 1950s developing a piano approach entirely his own: percussive, atonal, densely textured, drawing from African percussion and European serialism and jazz tradition and folding all of it into something that fit no existing category. This album remains one of the most challenging and most rewarding records in jazz.`,
  },
  ayler_spiritual: {
    id: 'ayler_spiritual',
    figureId: 'albert_ayler',
    title: 'Spiritual Unity',
    year: 1964,
    venueId: 'smalls',
    medium: 'Live/studio album · ESP-Disk',
    dimensions: 'Albert Ayler (tenor sax), Gary Peacock (bass), Sunny Murray (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Albert_Ayler_%281967%E2%80%9368_photo_portrait_for_ABC_Impulse%21%29.jpg/330px-Albert_Ayler_%281967%E2%80%9368_photo_portrait_for_ABC_Impulse%21%29.jpg',
    whatToLookFor: [
      `The saxophone sound: raw, huge, buzzing with overtones, sometimes sounding like two notes at once (multiphonics). Ayler pushed the saxophone's physical limits — the instrument itself is straining. This is not refinement. This is the instrument used as a vehicle for something that doesn't fit inside it.`,
      `The folk and march quality of the melodies. Ayler said he was returning to the roots — to the simple, pentatonic melodies of folk songs and marching bands. "Ghosts" is built on a phrase so simple it sounds like a nursery rhyme. Then the improvisation departs into the furthest reaches of extended technique. The distance between the melody and what follows it is the album's entire argument.`,
      `Sunny Murray's drumming: he plays without fixed meter, creating rhythmic clouds and masses of percussion energy rather than a defined pulse. The bass, the drums, and the saxophone are three independent streams, sometimes converging, sometimes diverging entirely. This is what free improvisation sounds like at its most committed.`,
    ],
    description: `Albert Ayler recorded Spiritual Unity at a studio session in July 1964 and released it on the tiny ESP-Disk label. It sold almost nothing. It was immediately recognized by other musicians as a rupture — a record that played the saxophone in ways that shouldn't have worked and did, that built music from the simplest possible melodic material and expanded it into something overwhelming. Ayler described his music as going back to the roots. The roots he meant were older than jazz, older than the blues, older than any existing genre. Smalls Jazz Club honors this tradition of music made at the edge.`,
  },
  dolphy_lunch: {
    id: 'dolphy_lunch',
    figureId: 'eric_dolphy',
    title: 'Out to Lunch!',
    year: 1964,
    venueId: 'blue_note',
    medium: 'Studio album · Blue Note Records',
    dimensions: 'Eric Dolphy (bass clarinet, flute, alto sax), Freddie Hubbard (trumpet), Bobby Hutcherson (vibraphone)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bud_Powell_1960.jpg/330px-Bud_Powell_1960.jpg',
    whatToLookFor: [
      `The vibraphone of Bobby Hutcherson: metallic, resonant, unlike any other sound in jazz. Dolphy replaced the piano with vibraphone, changing the entire harmonic texture of the group. The vibraphone sustains notes differently than a piano, creating a more ambiguous, ringing harmonic environment.`,
      `Dolphy's bass clarinet: the lowest and darkest of his three instruments, playing in a register that makes the instrument sound like something prehistoric, something older than jazz. His bass clarinet solos are among the most distinctive sounds in the music.`,
      `Tony Williams, 18 years old, on drums. The same drummer who appears on Maiden Voyage, recorded the same year — Williams was doing sessions for multiple Blue Note albums simultaneously, each time playing completely differently. On this record he's more angular, more responsive, more inside the free jazz space Dolphy was creating.`,
    ],
    description: `Eric Dolphy recorded Out to Lunch! for Blue Note in February 1964, left for Europe in June, and died in Berlin in July from undiagnosed diabetes at 36. The album is everything he had learned: bass clarinet, flute, and alto saxophone at the complete command of a musician who had absorbed bebop, classical composition, and free jazz and integrated them into something entirely his own. Blue Note's Alfred Lion recognized it as a masterpiece immediately. It was the last album Dolphy completed. The title is a pun on the sign shops put in their windows. He meant it.`,
  },

  // POST-BOP
  jarrett_blue_note: {
    id: 'jarrett_blue_note',
    figureId: 'keith_jarrett',
    title: 'At the Blue Note',
    year: 1994,
    venueId: 'blue_note',
    medium: 'Live album · ECM Records',
    dimensions: 'Keith Jarrett (piano), Gary Peacock (bass), Jack DeJohnette (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Keith_Jarrett.jpg/330px-Keith_Jarrett.jpg',
    whatToLookFor: [
      `The trio's conversation: Jarrett, Peacock, and DeJohnette had been playing together since 1983, and by 1994 they communicated with the immediacy of musicians who share the same nervous system. Follow any single voice — piano, bass, or drums — and watch how the other two respond in real time. This is what eleven years of playing together sounds like.`,
      `Jarrett's relationship to standards. These are jazz standards — songs from the American songbook — that he has internalized so completely that the improvisations don't feel like variations on a theme but like original compositions that happen to share a chord structure with something you've heard before.`,
      `The spontaneity within the form. Jarrett never plays a tune the same way twice — the tempos shift, the arrangements change, the emotional character of a familiar melody changes based on what he feels on a given night. This was recorded over four nights at the Blue Note; no two versions of the same tune are alike.`,
    ],
    description: `Keith Jarrett brought his Standards Trio — Gary Peacock and Jack DeJohnette — to the Blue Note jazz club in June 1994 and recorded six sets over four nights, releasing the complete sessions as a six-CD box. The resulting recordings are the most complete document of what the trio could do: standards transformed into original music through improvisation so deep and so responsive that the difference between composition and improvisation dissolves. This is what jazz piano at its highest looks like in the 1990s, in a small room in Greenwich Village.`,
  },
  marsalis_black_codes: {
    id: 'marsalis_black_codes',
    figureId: 'wynton_marsalis',
    title: 'Black Codes (From the Underground)',
    year: 1985,
    venueId: 'jazz_lincoln_center',
    medium: 'Studio album · Columbia Records',
    dimensions: 'Wynton Marsalis (trumpet), Branford Marsalis (tenor/soprano sax), Kenny Kirkland (piano)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Wynton_Marsalis_2009_09_13.jpg/330px-Wynton_Marsalis_2009_09_13.jpg',
    whatToLookFor: [
      `Marsalis's trumpet technique: complete, unobstructed access to the full range of the instrument at any tempo. He can play anything — technically, there are no limits. What distinguishes him from mere technicians is that he always serves the music: the technique is invisible behind the intention.`,
      `The title refers to the post-Civil War laws designed to re-enslave Black Americans under another name. This album is both a musical argument and a political one: that jazz — the African American music of the 20th century — is the most sophisticated music in the world, and that claiming that sophistication is itself a political act.`,
      `Branford Marsalis on tenor and soprano saxophone: the brothers had been playing together since childhood, and the musical communication is cellular. Watch how the horn lines interweave — composed and improvised simultaneously, each knowing where the other is going.`,
    ],
    description: `Wynton Marsalis recorded Black Codes at 23 with a quintet that included his brother Branford and pianist Kenny Kirkland, and produced what many consider his finest studio album. The music is technically astonishing and emotionally direct — hard bop vocabulary at the highest level of execution, deployed in service of ideas (musical and political) that Marsalis had been developing since his teenage years. As artistic director of Jazz at Lincoln Center, he built an institution around the conviction that this music deserves the same institutional support as classical music. This album is the proof of concept.`,
  },
  metheny_bright: {
    id: 'metheny_bright',
    figureId: 'pat_metheny',
    title: 'Bright Size Life',
    year: 1976,
    venueId: 'smalls',
    medium: 'Studio album · ECM Records',
    dimensions: 'Pat Metheny (guitar), Jaco Pastorius (bass), Bob Moses (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Pat_metheny_orch2.jpg/330px-Pat_metheny_orch2.jpg',
    whatToLookFor: [
      `Metheny's guitar tone: clean, warm, slightly country-influenced — not the bebop guitar of Wes Montgomery or the rock-influenced guitar of the fusion movement. This is a new guitar sound for jazz, influenced by everything Metheny had absorbed growing up in Missouri: country, folk, rock, and jazz simultaneously.`,
      `Jaco Pastorius on bass, making his recording debut. Pastorius would become the most influential bassist of his generation, and you can hear why immediately: the fretless bass moving with the independence and melodic invention of a saxophone. He was 24. The world had no idea what was coming.`,
      `The compositions: lyrical, folk-influenced, tonally ambiguous but never atonal. Metheny was writing jazz that people could hear on first listen but that revealed more complexity on each subsequent encounter. This balance — between accessibility and depth — would define his entire career.`,
    ],
    description: `Pat Metheny was 21 when he recorded Bright Size Life for ECM in December 1975. He had come from Missouri to Berklee at 17, been teaching there at 19, and was already one of the most technically complete guitarists in jazz. The album announced a new sensibility: post-bop guitar that absorbed the influence of country, folk, and rock without losing any jazz harmonic sophistication. Smalls, where New York's young jazz musicians define the next generation, carries the spirit of this kind of discovery.`,
  },
  mehldau_trio: {
    id: 'mehldau_trio',
    figureId: 'brad_mehldau',
    title: 'The Art of the Trio, Vol. 1',
    year: 1996,
    venueId: 'village_vanguard',
    medium: 'Studio album · Warner Bros. Records',
    dimensions: 'Brad Mehldau (piano), Larry Grenadier (bass), Jorge Rossy (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Brad_Mehldau-9035.jpg/330px-Brad_Mehldau-9035.jpg',
    whatToLookFor: [
      `The counterpoint in the left hand. Mehldau studied Bach extensively, and the influence is audible: his left hand moves with independent melodic logic, not just supporting the right hand but creating a second voice that argues with and complements what the right hand is doing. This is jazz piano that thinks like baroque polyphony.`,
      `The repertoire: Mehldau plays jazz standards alongside Radiohead songs alongside original compositions, treating all of it as equivalent material. He was one of the first jazz musicians to demonstrate that contemporary rock songs could be played as jazz without irony or condescension — just as musical material rich enough to sustain improvisation.`,
      `The dynamic range: from whisper to full-voiced, within a single phrase. Mehldau treats the piano's dynamic capacities as a compositional resource. The sudden pianissimos, the unexpected fortissimos — these are emotional decisions that shape the arc of each improvisation.`,
    ],
    description: `Brad Mehldau released the first Art of the Trio album in 1996 and immediately became the most important voice in jazz piano of his generation. The trio — Mehldau, Larry Grenadier, and Jorge Rossy — recorded five volumes over five years, developing a collective intelligence that remains the standard for jazz trio playing in the post-Evans era. Mehldau plays regularly at the Village Vanguard; hearing this album and then seeing him in that room closes a circle that runs from Bill Evans's 1961 sessions through everything that came after.`,
  },
  hargrove_habana: {
    id: 'hargrove_habana',
    figureId: 'roy_hargrove',
    title: 'Habana',
    year: 1997,
    venueId: 'village_vanguard',
    medium: 'Studio album · Verve Records',
    dimensions: 'Roy Hargrove (trumpet, flugelhorn) with Cuban musicians inc. Chucho Valdés',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Roy_Hargrove_Quintet_%28ZMF_2018%29_IMGP7150.jpg/330px-Roy_Hargrove_Quintet_%28ZMF_2018%29_IMGP7150.jpg',
    whatToLookFor: [
      `The integration of Cuban son rhythms with bebop improvisation. Hargrove went to Havana, found musicians rooted in a rhythmic tradition entirely different from jazz, and built a bridge between them. The clave rhythm underneath his trumpet solos changes the relationship between melody and time — the swing feel and the son clave create a productive tension that neither tradition could produce alone.`,
      `Hargrove's flugelhorn on the ballads: warmer, darker, more rounded than the trumpet. He played both with equal command, using them as different voices for different emotional registers within the same album.`,
      `Chucho Valdés on piano: one of the greatest musicians Cuba has ever produced, playing alongside an American trumpeter who was learning his tradition in real time. The album is the documentation of two musical worlds in genuine conversation — not fusion, not appropriation, but two complete vocabularies finding common ground.`,
    ],
    description: `Roy Hargrove went to Havana in 1997 with a group of young American jazz musicians, found Chucho Valdés and a constellation of Cuban players, and recorded Habana. The album won the Grammy for Best Latin Jazz Album and introduced Hargrove's generation to a different relationship with rhythm — one rooted in the African diaspora's Cuban branch rather than its New Orleans branch. Hargrove played the Village Vanguard for 30 years, and the room his music felt most at home in was that same basement on 7th Avenue where Miles and Coltrane had played. He died in 2018. The Vanguard still books his quartet.`,
  },

  // ── BAROQUE ─────────────────────────────────────────
  bach_brandenb3: {
    id: 'bach_brandenb3',
    figureId: 'bach',
    title: 'Brandenburg Concerto No. 3 in G major, BWV 1048',
    year: 1721,
    venueId: 'alice_tully_hall',
    medium: 'Concerto · Three movements',
    dimensions: 'Three violin groups, three viola groups, three cellos, continuo',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/330px-Johann_Sebastian_Bach.jpg',
    whatToLookFor: [
      `The three equal string groups in constant dialogue — this is a democracy of instruments where no single voice leads but all three push each other forward. Bach turns equality into drama.`,
      `The famous two-chord slow movement — literally a Phrygian cadence that serves as an invitation for improvisation. Live performers fill this space differently every time. It is one of the most elegant evasions in music.`,
      `The finale's relentless contrapuntal energy — Bach builds the closing Allegro from interlocking lines that feel inevitable, like gears perfectly meshing. Count the voices entering one by one before the texture becomes overwhelming.`,
    ],
    description: `Johann Sebastian Bach assembled the Brandenburg Concertos around 1721 and dedicated them to Christian Ludwig, Margrave of Brandenburg-Schwedt, who almost certainly never performed them. It did not matter. The six concertos represent the most concentrated display of Baroque inventiveness in the repertoire — each one featuring a different ensemble configuration, each one solving the formal problem of the concerto in an entirely different way.

The Third Concerto, for three groups of strings plus continuo, dispenses with a soloist altogether. Instead Bach sets the three violins, three violas, and three cellos in constant dialogue — a musical conversation among equals that feels almost democratic. The opening Allegro builds momentum through interlocking patterns that never stop, never rest, never lose energy. After a brief two-chord slow movement (one of the most artful evasions in music history), the finale breaks into an exuberant dance that ends almost before you are ready.`,
  },
  handel_messiah: {
    id: 'handel_messiah',
    figureId: 'handel',
    title: 'Messiah',
    year: 1741,
    venueId: 'carnegie_hall',
    medium: 'Oratorio · Three parts, 53 movements',
    dimensions: 'Soloists, chorus, orchestra · approx. 2 hours 30 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/George_Frideric_Handel_by_Balthasar_Denner.jpg/330px-George_Frideric_Handel_by_Balthasar_Denner.jpg',
    whatToLookFor: [
      `The Hallelujah chorus — tradition holds that audiences stand, and when the brass enter a tone above the opening, you feel why. The texture doubles in weight in an instant. Standing is the only response.`,
      `'He was despised' (contralto aria) — a quiet, interior aria where Handel lets the harmony droop on the word 'despised.' Three notes do the work of a paragraph. The restraint is what makes it devastating.`,
      `The architecture of the whole — Messiah is not just famous moments. It is a three-part argument that builds across 53 movements. Notice how Handel alternates recitative, aria, and chorus to control pacing and emotional release.`,
    ],
    description: `Handel composed Messiah in 24 days in August and September 1741, working with a libretto assembled from the King James Bible by his collaborator Charles Jennens. The oratorio was first performed not in London but in Dublin, where it raised funds for charitable causes. The Dublin audience was overwhelmed. London was more skeptical — until it wasn't.

What Handel achieved was a synthesis of opera's emotional directness and the oratorio\'s sacred authority. The piece moves through prophecy, nativity, passion, resurrection, and final glory in a structure that feels both inevitable and surprising. Carnegie Hall performs it every Christmas season. The audience has been standing for the Hallelujah chorus since 1743.`,
  },
  vivaldi_four_seasons: {
    id: 'vivaldi_four_seasons',
    figureId: 'vivaldi',
    title: 'The Four Seasons',
    year: 1725,
    venueId: 'alice_tully_hall',
    medium: 'Four violin concertos',
    dimensions: 'Solo violin, string orchestra, continuo · approx. 40 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Vivaldi.jpg/330px-Vivaldi.jpg',
    whatToLookFor: [
      `The descriptive literalism — Vivaldi published sonnets alongside the scores. In 'Spring,' listen for the bird calls in the upper violins, the thunder in the lower strings, the lightning flashes in the solo violin. He is painting with sound, systematically.`,
      `The solo-versus-orchestra relationship — this is a Baroque concerto, and the contrast between the soloist's ornamental freedom and the orchestra's driving pulse is the form's central drama. In 'Summer,' the contrast becomes violent.`,
      `The ground bass in 'Winter' — beneath the shivering upper strings, the lower instruments hold a steady, slow pulse. Cold, regular, relentless. Vivaldi understood that musical cold comes from stillness, not agitation.`,
    ],
    description: `Antonio Vivaldi published The Four Seasons in 1725 as the first four concertos of a larger set called Il cimento dell'armonia e dell'inventione (The Contest Between Harmony and Invention). Each concerto was accompanied by a sonnet — possibly written by Vivaldi himself — describing the season's characteristic scenes and moods. The music illustrates the sonnets almost literally.

The Four Seasons is probably the most performed piece of Baroque music and has been recorded more times than any other classical work. This ubiquity can make it hard to hear freshly. Heard live, with a good soloist, it recovers its strangeness: a priest in Venice in 1725 decided to turn weather into music and largely succeeded.`,
  },
  purcell_dido: {
    id: 'purcell_dido',
    figureId: 'purcell',
    title: 'Dido and Aeneas',
    year: 1689,
    venueId: 'alice_tully_hall',
    medium: 'Opera · Three acts',
    dimensions: 'Soloists, chorus, small orchestra · approx. 60 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Henry_Purcell_Closterman.jpg/330px-Henry_Purcell_Closterman.jpg',
    whatToLookFor: [
      `'When I am laid in earth' (Dido's Lament) — built over a repeating bass line descending chromatically through seven notes, looping 11 times without stopping. The repetition feels like grief that will not release. It is one of the most perfect things in Western music.`,
      `The witches' choruses — Purcell's supernatural villains are almost comic in their energy, but their menace is real. The contrast with Dido's tragedy is deliberate and devastating.`,
      `The final chorus — after Dido dies, the chorus sings 'With drooping wings.' The harmonies collapse inward in exhaustion. Purcell was 30 when he wrote this. He died at 36.`,
    ],
    description: `Henry Purcell composed Dido and Aeneas around 1689 for performance at a girls' school in Chelsea, to a libretto by Nahum Tate drawn from Virgil's Aeneid. It runs about an hour, uses a small orchestra, and contains one of the most devastating arias ever written. That it was produced for schoolchildren is one of music history's more improbable facts.

The opera tells the story of the Carthaginian queen Dido, who falls in love with the Trojan hero Aeneas, is betrayed by witches disguised as messengers of the gods, and dies of grief when Aeneas departs for Italy. Purcell compresses this into 40 minutes of music and then gives Dido 10 more minutes to die, in one of opera's greatest extended laments.`,
  },
  monteverdi_orfeo: {
    id: 'monteverdi_orfeo',
    figureId: 'monteverdi',
    title: "L'Orfeo",
    year: 1607,
    venueId: 'alice_tully_hall',
    medium: 'Opera · Five acts',
    dimensions: 'Soloists, chorus, large Baroque orchestra · approx. 2 hours',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Bernardo_Strozzi_-_Claudio_Monteverdi_%28c.1630%29.jpg/330px-Bernardo_Strozzi_-_Claudio_Monteverdi_%28c.1630%29.jpg',
    whatToLookFor: [
      `'Possente spirto' (Orfeo's plea to Charon) — Orfeo's most virtuosic aria, where he deploys every ornament available to a Baroque singer to persuade the ferryman of the dead. This aria is a demonstration of what the early Baroque voice could achieve — and Monteverdi writes two versions, one plain and one ornamented.`,
      `The toccata that opens the opera — a brass fanfare, repeated three times, before the action begins. Monteverdi signals immediately that this is a grand event. Opera did not exist before this moment; he was inventing it.`,
      `The role of the continuo — the harmonic foundation (lute, harp, harpsichord, organ) shifts constantly in response to the dramatic moment. Monteverdi selects different continuo instruments for different scenes, effectively inventing the idea of orchestration.`,
    ],
    description: `Claudio Monteverdi's L'Orfeo, premiered in Mantua in 1607, is the earliest opera still regularly performed today. Monteverdi did not invent opera — a small group of Florentine intellectuals had been experimenting with sung drama for about a decade — but he was the first to make it transcendent. Where earlier attempts felt academic, L'Orfeo felt alive.

The opera tells the myth of Orpheus, the musician who descends to the underworld to retrieve his dead wife Eurydice, and fails because he looks back. Monteverdi uses an orchestra of about 40 instruments — enormous for its time — and writes music that moves between recitative, aria, and chorus with a dramatic intelligence that would not be surpassed until Gluck, 150 years later.`,
  },

  // ── CLASSICAL PERIOD ─────────────────────────────────────────
  mozart_sym40: {
    id: 'mozart_sym40',
    figureId: 'mozart',
    title: 'Symphony No. 40 in G minor, K. 550',
    year: 1788,
    venueId: 'david_geffen_hall',
    medium: 'Symphony · Four movements',
    dimensions: 'Full Classical orchestra · approx. 30 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/The_Mozart_Family_-_Wolfgang_Amadeus_Mozart_headshot.jpg/330px-The_Mozart_Family_-_Wolfgang_Amadeus_Mozart_headshot.jpg',
    whatToLookFor: [
      `The opening — no introduction, just the famous theme starting immediately in the strings, with violas providing a pulsing rhythmic background. The urgency is immediate. Mozart does not clear his throat.`,
      `The development section's harmonic restlessness — Mozart moves through an extraordinary sequence of related keys in ways that feel almost anxious. For 1788, this level of harmonic tension was unprecedented in a symphony.`,
      `The finale's counterpoint — the last movement contains fugal writing that anticipates the formal mastery of the Jupiter Symphony, written the same summer. Mozart is simultaneously writing drama and architecture.`,
    ],
    description: `Mozart composed his final three symphonies — Nos. 39, 40, and 41 — in the summer of 1788 in an extraordinary burst of creative energy, probably without commissions and possibly without any immediate prospect of performance. No. 40 is in G minor, one of only two minor-key symphonies Mozart wrote, and it has the darkest emotional profile of all his orchestral works.

The symphony was revolutionary in its density and seriousness. Beethoven studied it intensely. Brahms knew it by heart. What sounds familiar to modern ears — the opening theme is one of the most recognizable in all of Western music — was, in 1788, something genuinely new: a symphony that treated its audience as capable of sustaining serious engagement from the first bar to the last.`,
  },
  beethoven_sym5: {
    id: 'beethoven_sym5',
    figureId: 'beethoven',
    title: 'Symphony No. 5 in C minor, Op. 67',
    year: 1808,
    venueId: 'david_geffen_hall',
    medium: 'Symphony · Four movements',
    dimensions: 'Full orchestra with trombones, piccolo, contrabassoon · approx. 35 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg/330px-Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg',
    whatToLookFor: [
      `The four-note motif (short-short-short-long) — it appears in every movement, transformed. In the first movement it is threat; in the third it becomes a menacing whisper; in the finale it erupts in triumph. Same four notes, completely different weight.`,
      `The transition from third to fourth movement — the music does not stop. A long, quiet passage in the strings builds tension for over a minute — and then the full orchestra enters with trombones, making their symphonic debut, for the triumphant finale. Stay very still.`,
      `The recapitulation's oboe cadenza — in the first movement, just before the main theme returns, Beethoven inserts a brief, unexpected solo oboe. It feels like an interruption, almost a private moment. It is one of the most humanizing gestures in symphonic music.`,
    ],
    description: `Beethoven began sketching the Fifth Symphony around 1804 and completed it in 1808, alongside the Sixth (Pastoral) Symphony. The two were premiered on the same evening in Vienna, in a concert so long and cold that the audience grew restless. The Fifth was largely ignored at the time.

History corrected that judgment. The Fifth Symphony is now the most performed orchestral work in the world, and the four-note opening motif may be the most recognized fragment of music ever composed. What makes it inexhaustible is not the motif itself but what Beethoven does with it: builds an entire symphony from its transformations, from darkness to light, from threat to triumph — the arc that every subsequent composer writing in minor keys has had to reckon with.`,
  },
  haydn_surprise: {
    id: 'haydn_surprise',
    figureId: 'haydn',
    title: 'Symphony No. 94 in G major "Surprise"',
    year: 1792,
    venueId: 'david_geffen_hall',
    medium: 'Symphony · Four movements',
    dimensions: 'Classical orchestra · approx. 25 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Joseph_Haydn.jpg/330px-Joseph_Haydn.jpg',
    whatToLookFor: [
      `The surprise — slow movement, second theme, first repeat: everything is quiet and gentle, then a sudden fortissimo chord from the full orchestra arrives without warning. Haydn reportedly wanted to wake the audience members who fell asleep. It works every time.`,
      `The minuet's wit — Haydn's minuets are never merely polite. This one has rough, peasant energy, with brass and drums dominating. He was writing for London audiences and giving them something more vital than court music.`,
      `The finale's perpetual motion — the last movement is almost entirely staccato, giving it a breathless, buzzing quality. Count how many times the main theme returns in different harmonic contexts before the symphony ends.`,
    ],
    description: `Joseph Haydn composed the Surprise Symphony in 1792, the second of his twelve London Symphonies written for the impresario Johann Peter Salomon's concert series. Haydn was 60 years old, famous across Europe, and writing with the full confidence of a composer who had invented the form he was working in.

The London Symphonies — including the Surprise — represent the summit of the Classical symphonic tradition. They are larger, more orchestrally adventurous, and more dramatically conceived than anything Haydn had written for the Esterhazy court, where he had spent the previous three decades. The Surprise Symphony is the most famous of the twelve, partly because of its trick and partly because everything around that trick is genuinely excellent.`,
  },
  schubert_unfinished: {
    id: 'schubert_unfinished',
    figureId: 'schubert',
    title: 'Symphony No. 8 in B minor "Unfinished"',
    year: 1822,
    venueId: 'david_geffen_hall',
    medium: 'Symphony · Two completed movements',
    dimensions: 'Full Romantic orchestra · approx. 25 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Franz_Schubert_by_Wilhelm_August_Rieder_1875.jpg/330px-Franz_Schubert_by_Wilhelm_August_Rieder_1875.jpg',
    whatToLookFor: [
      `The opening cello and bass line — low, bare, moving chromatically downward. Nothing in Classical music sounds like this before Schubert. It sets up a sense of unease before the first theme even arrives, as if the music begins in the middle of a thought.`,
      `The lyric second theme — one of the most beautiful melodies Schubert ever wrote, appearing first in the cellos and then in the oboe. The contrast with the turbulent first theme is the whole Romantic formula in miniature: storm, then consolation.`,
      `The structural mystery of two movements — Schubert left two completed movements and sketched a third. The piece feels complete anyway, which raises an unanswerable question: why did he stop? The ambiguity is itself part of the music now.`,
    ],
    description: `Schubert composed the first two movements of his Eighth Symphony in October 1822 and sent the manuscript to a friend in Graz as thanks for an honorary membership in a music society. The symphony was forgotten for over 40 years, not performed until 1865, more than three decades after Schubert's death. It was received immediately as a masterpiece.

The Unfinished is so called because it has only two movements rather than the conventional four. Why Schubert stopped — he sketched a third movement but never completed it — has been debated ever since. What is beyond debate is that the two movements he did complete contain some of the most emotionally intense orchestral music ever written. The symphony sounds modern in ways that still feel surprising: Schubert was pointing toward Brahms, toward Mahler, toward a future he would not live to see.`,
  },
  gluck_orphee: {
    id: 'gluck_orphee',
    figureId: 'gluck',
    title: "Orphée et Eurydice",
    year: 1762,
    venueId: 'met_opera_house',
    medium: 'Opera · Three acts',
    dimensions: 'Soloists, chorus, orchestra · approx. 2 hours',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Joseph_Siffred_Duplessis_-_Christoph_Willibald_Gluck_-_Google_Art_Project.jpg/330px-Joseph_Siffred_Duplessis_-_Christoph_Willibald_Gluck_-_Google_Art_Project.jpg',
    whatToLookFor: [
      `'Che faro senza Euridice' (What will I do without Eurydice?) — one of opera's most famous arias, and one of its most famous paradoxes: the most grief-stricken text set to a major-key melody. Gluck believed simple diatonic music expressed grief more purely than ornate chromaticism. He was right.`,
      `The Dance of the Furies — Gluck's underworld is genuinely terrifying. The Furies' music is angular and hard, driven by relentless rhythmic patterns that refuse to resolve. Then Orpheus's lyre turns them gentle, the harmonies soften, and the underworld opens.`,
      `The Elysian Fields music — in contrast to the Furies, the spirits of the blessed get floating, modal harmonies and a famous solo flute. Gluck was painting with sound in a way opera had not done systematically before.`,
    ],
    description: `Christoph Willibald Gluck premiered Orfeo ed Euridice in Vienna in 1762, and it immediately changed what opera could be. Opera in the mid-18th century had become extravagant spectacle, dominated by virtuoso singers who used the form as a vehicle for vocal display. Gluck stripped it down: fewer da capo arias, less ornament, more drama, and a consistent emotional logic that subordinated everything to the story.

The reform was so successful that it defined the path from Gluck to Mozart to Beethoven to Wagner. Orphée et Eurydice (the French version, 1774) is the most frequently performed of Gluck's reform operas, and its famous aria — 'Che faro senza Euridice' — remains one of the most effective pieces of music ever written about loss.`,
  },

  // ── ROMANTIC ─────────────────────────────────────────
  brahms_sym4: {
    id: 'brahms_sym4',
    figureId: 'brahms',
    title: 'Symphony No. 4 in E minor, Op. 98',
    year: 1885,
    venueId: 'carnegie_hall',
    medium: 'Symphony · Four movements',
    dimensions: 'Full Romantic orchestra · approx. 40 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/JohannesBrahms_%28cropped%29.jpg/330px-JohannesBrahms_%28cropped%29.jpg',
    whatToLookFor: [
      `The opening — the violins begin with a series of falling thirds, one after another, no introduction. It is already melancholic in bar one. Brahms compresses everything that follows into those first two bars.`,
      `The third movement's violent energy — after two introspective movements, the third (Allegro giocoso) arrives almost brutally. Brahms uses triangle and piccolo, instruments he otherwise avoids, for a rough, celebratory color.`,
      `The passacaglia finale — the last movement is built over an eight-bar bass line that repeats 30 times without pause. This is Bach's technique, Baroque formal austerity applied to Romantic harmonic language. The finale builds from meditative to overwhelming. It is Brahms's greatest single movement.`,
    ],
    description: `Johannes Brahms completed his Fourth Symphony in the summer of 1885, when he was 52. It was the last symphony he wrote, and it is commonly regarded as his greatest. The composer Hans von Bulow, who would conduct the premiere, read through the four-hand piano score with Brahms beforehand and said afterward: 'Genius is the ability to take infinite pains, and here is the proof.'

The Fourth is the darkest and most autumnal of Brahms's four symphonies, and the one that most deliberately reaches back to Bach and the Baroque. The final movement — a passacaglia, a form Brahms had studied deeply in Bach and Handel — is one of the towering achievements in symphonic composition: 30 variations over an unyielding bass line, building from quiet to catastrophic and back again.`,
  },
  tchaikovsky_pathetique: {
    id: 'tchaikovsky_pathetique',
    figureId: 'tchaikovsky',
    title: "Symphony No. 6 in B minor 'Pathétique', Op. 74",
    year: 1893,
    venueId: 'carnegie_hall',
    medium: 'Symphony · Four movements',
    dimensions: 'Full Romantic orchestra · approx. 45 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Tchaikovsky_by_Reutlinger_%28cropped%29.jpg/330px-Tchaikovsky_by_Reutlinger_%28cropped%29.jpg',
    whatToLookFor: [
      `The first movement's second theme — one of the most gorgeous melodies Tchaikovsky ever wrote, appearing in the strings after the turbulent opening. It will be destroyed and transformed before the movement ends. Remember it when you hear its ghost later.`,
      `The second movement's unusual meter — it is in 5/4 time (five beats per bar). It sounds slightly off-balance, like a waltz that keeps missing a step. Tchaikovsky uses this instability deliberately: nothing in this symphony quite resolves.`,
      `The finale — this symphony does not end triumphantly. The last movement is an Adagio lamentoso that fades to nothing. Tchaikovsky died nine days after the premiere. The finale is heard differently knowing that.`,
    ],
    description: `Tchaikovsky called the Sixth Symphony his best work and conducted the premiere himself in St. Petersburg on October 28, 1893. Nine days later he was dead, most likely from cholera. The symphony immediately acquired the weight of a farewell — a meaning Tchaikovsky may have intended when he subtitled it 'Pathétique.'

The symphony inverts the standard symphonic structure: instead of ending with a triumphant finale, it ends with a slow, dying movement that collapses into silence. This was deliberate and unprecedented. Tchaikovsky was departing from the tradition that symphonies should conclude with energy and resolution, and in doing so created one of the most emotionally shattering pieces in the orchestral repertoire.`,
  },
  chopin_ballade1: {
    id: 'chopin_ballade1',
    figureId: 'chopin',
    title: 'Ballade No. 1 in G minor, Op. 23',
    year: 1835,
    venueId: 'carnegie_hall',
    medium: 'Piano solo',
    dimensions: 'Solo piano · approx. 9 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/330px-Frederic_Chopin_photo.jpeg',
    whatToLookFor: [
      `The opening — a single line in the bass, no harmony, no rhythm yet. Then the right hand enters with the opening theme. Chopin creates expectation before telling you what to expect. The arrival of the first full chord is a release.`,
      `The second theme — lyrical, almost song-like, in E-flat major. It is the emotional counterweight to the dark opening. Listen for how Chopin brings it back near the end, transformed under enormous harmonic tension.`,
      `The coda — the final section accelerates from poetry to fury in under two minutes. The tempo becomes frantic, the harmonies grow increasingly unstable, and the piece ends in a series of fierce descending chords. It is a complete emotional arc compressed into nine minutes.`,
    ],
    description: `Chopin composed the First Ballade in the early 1830s, working on it for several years before publishing it in 1836. It was the first piece to carry the title 'ballade' — a term borrowed from vocal music, suggesting a piece that tells a story. Chopin never specified what story the Ballade tells, which has inspired a century of speculation.

Robert Schumann, who knew Chopin well, wrote that the First Ballade was 'one of his wildest and most original compositions.' Brahms, who revered Chopin despite their aesthetic differences, cited the Ballades as a direct influence on his own piano music. The piece is now considered a cornerstone of the piano repertoire — one of the works every concert pianist must eventually confront.`,
  },
  wagner_tristan: {
    id: 'wagner_tristan',
    figureId: 'wagner',
    title: 'Tristan und Isolde',
    year: 1865,
    venueId: 'met_opera_house',
    medium: 'Opera · Three acts',
    dimensions: 'Two soloists, large Romantic orchestra · approx. 4 hours',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/RichardWagner.jpg/330px-RichardWagner.jpg',
    whatToLookFor: [
      `The Prelude's opening chord — the so-called 'Tristan chord' (F-B-D sharp-G sharp) is the most analyzed chord in Western music history. It is dissonant, unresolved, and Wagner does not resolve it for four hours. It represents desire that can never be satisfied.`,
      `The Liebestod (Love-Death) — Isolde's final aria, where she dies over Tristan's body. The harmonies that were suspended throughout the opera finally begin, very slowly, to resolve, as she dies. Resolution and death become the same event.`,
      `The 'endless melody' — Wagner abandons the Classical convention of phrases that clearly end. His melodies overlap, lead into one another, never quite cadence. The effect over four hours is total immersion. Film composers a century later borrowed this technique wholesale.`,
    ],
    description: `Richard Wagner composed Tristan und Isolde between 1857 and 1859, working partly in exile after the failure of the 1848 revolutions, partly inspired by his passionate friendship with the wife of his patron. The opera tells the story of two lovers who drink a love potion and cannot be together — the central theme is desire that can never be consummated, which Wagner expressed through four hours of unresolved harmonic tension.

The premiere in Munich in 1865 was a triumph. The consequences for Western music were vast: Tristan's harmonic language — chromatic, ambiguous, forever suspending resolution — influenced every composer who followed. Debussy cited it. Schoenberg cited it. The 'Tristan chord' is still being analyzed and argued over. The Metropolitan Opera performs it in a production worthy of its scope.`,
  },
  mahler_sym5: {
    id: 'mahler_sym5',
    figureId: 'mahler',
    title: 'Symphony No. 5 in C-sharp minor',
    year: 1902,
    venueId: 'david_geffen_hall',
    medium: 'Symphony · Five movements in three parts',
    dimensions: 'Large Romantic orchestra · approx. 70 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Photo_of_Gustav_Mahler_by_Moritz_N%C3%A4hr_01.jpg/330px-Photo_of_Gustav_Mahler_by_Moritz_N%C3%A4hr_01.jpg',
    whatToLookFor: [
      `The opening funeral march — a solo trumpet enters alone, then the full orchestra joins in a march that stumbles and surges rather than processing cleanly. The grief here is not ceremonial; it is personal and chaotic.`,
      `The Adagietto — the famous fourth movement, for strings and harp alone. Slow, suspended, aching. It is love music, and also a structural bridge between the darkness of the first three movements and the exuberance of the finale. Visconti used it in Death in Venice (1971), which changed how the world hears it.`,
      `The finale's counterpoint — the last movement is an exuberant rondo with elaborate fugal passages. After everything that came before, the conclusion feels genuinely earned. Mahler conducted the New York Philharmonic from 1909 to 1911; he knew what this room sounded like.`,
    ],
    description: `Gustav Mahler composed the Fifth Symphony in 1901-1902, newly married and in seemingly good health, at the height of his creative powers. It is one of the most emotionally wide-ranging works in the symphonic repertoire: funeral march, dark scherzo, love song, grand finale — compressed into a single evening.

Mahler himself conducted the New York Philharmonic for two seasons (1909-1911), introducing New York to his own music with his characteristic conducting intensity. The Fifth is now a cornerstone of the Philharmonic's repertoire and is performed at David Geffen Hall most seasons. Hearing it in the hall where Mahler once stood is one of the specific pleasures that New York offers.`,
  },

  // ── 20TH CENTURY ─────────────────────────────────────────
  stravinsky_rite: {
    id: 'stravinsky_rite',
    figureId: 'stravinsky',
    title: 'The Rite of Spring',
    year: 1913,
    venueId: 'david_geffen_hall',
    medium: 'Ballet score · Two parts',
    dimensions: 'Very large orchestra · approx. 33 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Igor_Stravinsky_LOC_32392u.jpg/330px-Igor_Stravinsky_LOC_32392u.jpg',
    whatToLookFor: [
      `The opening bassoon solo — the piece begins with a solo bassoon playing in its highest register, unaccompanied, playing a Lithuanian folk melody. The sound is deliberately thin and strange. This is how Stravinsky tells you something new is about to happen.`,
      `'The Augurs of Spring' — a chord of eight instruments playing simultaneously in two different keys, struck repeatedly with rhythmic accents that fall in unexpected places. This is what caused the famous riot at the 1913 premiere. It still sounds disorienting over a century later.`,
      `The 'Sacrificial Dance' — the finale, in which the Chosen One dances herself to death. The meter shifts constantly, sometimes bar by bar. The rhythm is violent and unpredictable. If you want to understand why 1913 changed music forever, this is the six minutes to hear.`,
    ],
    description: `Igor Stravinsky composed The Rite of Spring for Sergei Diaghilev's Ballets Russes, with choreography by Vaslav Nijinsky. The premiere in Paris on May 29, 1913 was one of the most famous nights in music history: the audience began booing and shouting within minutes of the curtain rising, and the disturbance grew into a full-scale riot. The combination of Nijinsky's anti-balletic choreography and Stravinsky's rhythmically violent music was more than the audience could absorb.

The Rite has since become the most performed and recorded piece of 20th-century orchestral music. Divorced from dance and heard in concert, its logic becomes clearer: Stravinsky was taking Eastern European folk music and forcing it through a prism of rhythmic displacement and harmonic brutality to create something that had never existed. It changed what orchestral music could be.`,
  },
  debussy_la_mer: {
    id: 'debussy_la_mer',
    figureId: 'debussy',
    title: 'La Mer',
    year: 1905,
    venueId: 'david_geffen_hall',
    medium: 'Three symphonic sketches',
    dimensions: 'Large orchestra · approx. 25 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Claude_Debussy_by_Atelier_Nadar.jpg/330px-Claude_Debussy_by_Atelier_Nadar.jpg',
    whatToLookFor: [
      `The opening of 'De l'aube a midi sur la mer' (From Dawn to Noon) — no melody, only atmosphere. Shimmering strings, a rising figure in the horns, as if the sea is assembling itself from pre-dawn stillness. Debussy gives you impressions rather than statements.`,
      `'Jeux de vagues' (Play of the Waves) — the most purely evocative movement, with orchestral textures that imitate light on water. The flutes and strings interweave without producing a conventional melody. The harmony drifts and dissolves.`,
      `The finale's synthesis — 'Dialogue du vent et de la mer' brings back material from the first movement, transformed. What was atmospheric becomes powerful. The climax is one of the great orchestral moments: full orchestra, brass hammering through the storm.`,
    ],
    description: `Claude Debussy composed La Mer between 1903 and 1905, mostly in Eastbourne, England — on the coast — and partly in Burgundy, far from the sea, which he found easier. The three movements are subtitled as 'symphonic sketches,' a self-deprecating label for one of the most ambitious orchestral works of its era.

La Mer was not immediately understood. Critics who expected it to sound like waves described literal splashing and were disappointed. What Debussy actually created was something far more subtle: music that captures the quality of light on water, the rhythm of breathing, the sensation of immensity. Debussy was not interested in descriptive music that illustrates; he was interested in music that creates atmosphere. La Mer is the fullest realization of that ambition.`,
  },
  prokofiev_sym5: {
    id: 'prokofiev_sym5',
    figureId: 'prokofiev',
    title: 'Symphony No. 5 in B-flat major, Op. 100',
    year: 1945,
    venueId: 'david_geffen_hall',
    medium: 'Symphony · Four movements',
    dimensions: 'Large orchestra · approx. 45 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Sergei_Prokofiev_circa_1918_over_Chair_Bain.jpg/330px-Sergei_Prokofiev_circa_1918_over_Chair_Bain.jpg',
    whatToLookFor: [
      `The slow opening — an unusual choice: the symphony begins with a broad, hymn-like theme in the winds that builds gradually to the full orchestra. Prokofiev is taking his time, establishing scope before the drama begins.`,
      `The second movement's mechanical energy — a scherzo driven by a hard, repeating rhythmic pattern in the low strings. This is Prokofiev's 'machine music' aesthetic: jazz rhythms filtered through his Soviet-era formal language, producing something both driving and slightly sinister.`,
      `The finale's contested triumph — the last movement builds to a bright conclusion. Critics have long argued about whether Prokofiev meant it sincerely. He wrote this in 1944, under Stalin, during the war. The question of irony is part of the meaning.`,
    ],
    description: `Sergei Prokofiev composed the Fifth Symphony in the summer of 1944, while the Soviet Union was still fighting the Second World War. He described it as 'a hymn to free and happy Man, to his mighty powers, his pure and noble spirit.' It was premiered on January 13, 1945, conducted by Prokofiev himself; during the first movement, artillery fire was heard outside the hall — the guns were announcing the Soviet advance across the Vistula.

The Fifth became the most popular of Prokofiev's seven symphonies almost immediately. Its combination of accessible melody, rhythmic vitality, and large-scale formal ambition made it ideal for the Soviet cultural moment. Whether the optimism was sincere or imposed by ideological pressure — Prokofiev had been publicly condemned for 'formalism' in 1948, three years after the premiere — remains a question that the music itself seems deliberately to leave open.`,
  },
  shostakovich_sym5: {
    id: 'shostakovich_sym5',
    figureId: 'shostakovich',
    title: 'Symphony No. 5 in D minor, Op. 47',
    year: 1937,
    venueId: 'david_geffen_hall',
    medium: 'Symphony · Four movements',
    dimensions: 'Large orchestra · approx. 45 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/%D0%9A%D0%BE%D0%BC%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BE%D1%80_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B5%D0%B2%D0%B8%D1%87_%D0%A8%D0%BE%D1%81%D1%82%D0%B0%D0%BA%D0%BE%D0%B2%D0%B8%D1%87.jpg/330px-%D0%9A%D0%BE%D0%BC%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BE%D1%80_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B5%D0%B2%D0%B8%D1%87_%D0%A8%D0%BE%D1%81%D1%82%D0%B0%D0%BA%D0%BE%D0%B2%D0%B8%D1%87.jpg',
    whatToLookFor: [
      `The opening — stark strings in two-part counterpoint, antiphonal (left answering right), building from quiet to overwhelming force. Shostakovich establishes the key, the mood, and the threat in 16 bars.`,
      `The slow movement (third) — one of the most devastating pieces Shostakovich ever wrote. Long-breathed string melodies over barely-moving harmonies. The emotional exhaustion is almost physical. The audience at the premiere reportedly wept.`,
      `The finale's contested triumph — after the devastating slow movement, the last movement arrives loud and march-like. Is it triumph, or enforced celebration? Shostakovich wrote this in 1937, after Stalin's purges had threatened his life and career. The question of sincerity is part of the meaning.`,
    ],
    description: `Dmitri Shostakovich composed the Fifth Symphony in 1937 under extreme circumstances. His previous symphony — the ambitious, satirical Fourth — had been withdrawn before its premiere after the Soviet newspaper Pravda published an article condemning his opera Lady Macbeth of the Mtsensk District as 'muddle instead of music.' His life was in danger. The Fifth was his public response: what he called 'a creative reply to just criticism.'

The premiere in November 1937 was an overwhelming emotional event. The audience reportedly stood and wept during the slow movement and cheered for 40 minutes at the end. Whether they were celebrating a genuine creative reconciliation with Soviet authority or responding to the barely concealed grief and irony in the music is a question that has been debated ever since. The New York Philharmonic gave the US premiere in 1938; Shostakovich's Fifth has been in the American orchestral repertoire continuously since.`,
  },
  bartok_concerto: {
    id: 'bartok_concerto',
    figureId: 'bartok',
    title: 'Concerto for Orchestra',
    year: 1944,
    venueId: 'carnegie_hall',
    medium: 'Orchestral concerto · Five movements',
    dimensions: 'Large orchestra · approx. 37 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Bart%C3%B3k_B%C3%A9la_1927.jpg/330px-Bart%C3%B3k_B%C3%A9la_1927.jpg',
    whatToLookFor: [
      `The title's irony — this is a 'concerto' because each section of the orchestra gets its own moment to shine as a soloist, rather than a single instrument. The title is Bartok's elegant wink at the Baroque concerto grosso tradition.`,
      `The 'Game of Pairs' (second movement) — each pair of instruments (bassoons, oboes, clarinets, flutes, muted trumpets) plays a duet in a specific parallel interval. Then a brass chorale. Then the pairs return with new harmonizations. The structure is both lucid and playful.`,
      `The finale's Hungarian folk energy — Bartok had spent decades collecting Eastern European folk music, and here the folk rhythms surface as driving, joyful dance material. The finale is the least anguished music Bartok wrote in his final years.`,
    ],
    description: `Bartok composed the Concerto for Orchestra in 1943, commissioned by conductor Serge Koussevitzky for the Boston Symphony Orchestra. He was living in New York, in poor health, financially precarious, largely unknown to American audiences. The Concerto was written in six weeks while he was being treated for leukemia at a clinic in Asheville, North Carolina.

The premiere in December 1944 was a triumph — the audience gave the work a standing ovation, and Koussevitzky called it the greatest work of the previous 25 years. The Concerto became Bartok's most popular composition almost immediately and has remained a centerpiece of the orchestral repertoire. It is also, notably, one of the few great 20th-century works that is genuinely joyful: the folklore rhythms of the finale represent Bartok\'s homeland, which he had fled and would never see again.`,
  },

  // ── CONTEMPORARY CLASSICAL ─────────────────────────────────────────
  glass_einstein: {
    id: 'glass_einstein',
    figureId: 'glass',
    title: 'Einstein on the Beach',
    year: 1976,
    venueId: 'met_opera_house',
    medium: 'Opera · Four acts with five knee plays',
    dimensions: 'Ensemble of soloists and singers · approx. 4 hours 30 minutes, no intermission',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Philip_Glass_in_Florence%2C_Italy_-_1993_%28cropped%29.jpg/330px-Philip_Glass_in_Florence%2C_Italy_-_1993_%28cropped%29.jpg',
    whatToLookFor: [
      `The repetition as structure — Glass builds from short musical cells repeated many times with tiny, gradual variations. The repetition is not monotony; it is hypnosis. After 20 minutes, you stop waiting for change and start perceiving the changes within the repetition.`,
      `The absence of conventional narrative — Einstein has no plot. Singers repeat numbers and solfege syllables (do-re-mi) rather than dramatic text. The 'meaning' is experiential and visual, not literary. This is opera reimagined from first principles.`,
      `The knee plays (interludes) — short sections performed between the main acts by the full company, serving as transitions and palate-cleansers. They are often the most accessible entry points into Glass's musical language.`,
    ],
    description: `Philip Glass and director Robert Wilson created Einstein on the Beach in 1976 for the Avignon Festival and then the Metropolitan Opera, where it played to capacity audiences on two nights. The Met sold its opera subscription series to fund the venture; Glass went $100,000 into debt to produce it. Einstein was not a financial success on its first run. Over the following decades, it became recognized as the defining work of minimalist opera.

Einstein uses Albert Einstein as a symbol rather than a biographical subject — he appears as a figure playing violin, as a witness, as a kind of mute philosopher. The opera is organized around recurring images (trains, trial scenes, fields, spaceships) rather than conventional acts, with music that evolves through gradual additive processes over four and a half hours. The audience is invited to come and go during the performance. Almost no one does.`,
  },
  part_spiegel: {
    id: 'part_spiegel',
    figureId: 'part',
    title: 'Spiegel im Spiegel',
    year: 1978,
    venueId: 'alice_tully_hall',
    medium: 'Chamber piece for piano and violin (or cello)',
    dimensions: 'Piano and solo instrument · approx. 10 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Arvo_P%C3%A4rt.jpg/330px-Arvo_P%C3%A4rt.jpg',
    whatToLookFor: [
      `The tintinnabuli technique — Part invented a compositional method (named after bells, tintinnabulum in Latin) in which one voice plays only the notes of the tonic triad while another voice moves stepwise. The simplicity is the method. All of the richness comes from how these two voices relate.`,
      `The mirror structure — the title means 'Mirror in the Mirror.' The musical material unfolds symmetrically, expanding outward and then reflecting back. Each phrase opens before gently contracting.`,
      `The space between notes — Part writes very slow music that depends on the performer to fill the silences with presence. The rests are as important as the notes. In a good performance, the silence is not empty; it is charged.`,
    ],
    description: `Arvo Part composed Spiegel im Spiegel in 1978, shortly after emerging from a period of compositional silence during which he had studied medieval and Renaissance polyphony and developed his tintinnabuli technique. The piece was written in a single afternoon for a recording session. It runs about 10 minutes.

Spiegel im Spiegel has become one of the most performed and recorded pieces of contemporary classical music, appearing on soundtracks, in films, and in concert halls as a kind of sonic meditation. Its power comes from its extreme economy: almost nothing changes, yet the piece creates a sense of suspended time that few longer works achieve. Part, now in his late 80s, remains one of the most performed living composers in the world.`,
  },
  adams_short_ride: {
    id: 'adams_short_ride',
    figureId: 'john_adams',
    title: 'Short Ride in a Fast Machine',
    year: 1986,
    venueId: 'carnegie_hall',
    medium: 'Orchestral fanfare',
    dimensions: 'Large orchestra · approx. 4 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/JA-portrait-1-LW.jpg/330px-JA-portrait-1-LW.jpg',
    whatToLookFor: [
      `The woodblock that never stops — a woodblock plays a constant four-beat pattern from the first bar to the last. Everything else shifts against this pulse: rhythmic displacement, changing harmonies, brass fanfares that come and go. The woodblock is the only certainty.`,
      `The fanfare texture — Adams uses multiple brass choirs in staggered entrances, building a tapestry of overlapping gestures. The effect is exhilarating in a purely physical way, like watching a highway from above.`,
      `The title's honesty — Adams described the piece as capturing the feeling of riding in a friend's sports car going too fast. Terrified and exhilarated simultaneously. That is what the music feels like.`,
    ],
    description: `John Adams composed Short Ride in a Fast Machine in 1986 as a fanfare for the Great Woods Festival, later renamed Tanglewood's Summer Music Festival. It is four minutes long and has become one of the most frequently performed orchestral works of the past 40 years — a standard concert opener precisely because of the galvanic energy with which it begins and ends programs.

Adams is the most widely performed living American composer, known chiefly for his operas Nixon in China and Doctor Atomic, but Short Ride demonstrates the other side of his work: pure, abstract orchestral energy that owes a great deal to Stravinsky's rhythmic drive and minimalism\'s additive processes, filtered through Adams\'s own exuberant American voice.`,
  },
  reich_music18: {
    id: 'reich_music18',
    figureId: 'reich',
    title: 'Music for 18 Musicians',
    year: 1976,
    venueId: 'miller_theatre',
    medium: 'Ensemble work · Eleven sections',
    dimensions: 'Violin, cello, two clarinets, four pianos, three marimbas, two xylophones, metallophone, female voices · approx. 55 minutes',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Holland_Festival_componist_Steve_Reich_kop%2C_Bestanddeelnr_928-6490.jpg/330px-Holland_Festival_componist_Steve_Reich_kop%2C_Bestanddeelnr_928-6490.jpg',
    whatToLookFor: [
      `The opening cycle — the piece begins with a cycle of eleven chords played on marimba and piano. This cycle governs the entire work; everything that follows is a variation and development of these chords. The structure is both simple and inexhaustible.`,
      `The phasing texture — Reich's signature technique: instruments playing the same pattern slightly out of phase with one another, creating a shimmering, shifting result. In Music for 18 Musicians, this operates across multiple time layers simultaneously, creating a sound that has no clear predecessor.`,
      `The breathing voices — Reich includes female voices in the ensemble and uses them as breath-based instruments. The voices sustain notes as long as a single breath allows, then re-enter. This creates an organic pulse underneath the mechanical percussion.`,
    ],
    description: `Steve Reich composed Music for 18 Musicians over the course of a year and premiered it in 1976 at Town Hall in New York. It received ecstatic reviews and has since been recognized as one of the major works of late 20th-century music — a piece that influenced not only composers but electronic musicians, rock bands, and producers.

Reich had been working with phase-shifting techniques since the mid-1960s (Steve Reich: Phase Patterns, Drumming, Music for Mallet Instruments). Music for 18 Musicians synthesized everything he had learned into a large-scale, hour-long work that felt both rigorously systematic and deeply humanistic. The breathing female voices — an element he had not used in earlier minimalist works — gave the piece an organic warmth that pure percussion could not supply. Miller Theatre at Columbia regularly presents it as part of its contemporary music programming.`,
  },
  shaw_partita: {
    id: 'shaw_partita',
    figureId: 'caroline_shaw',
    title: 'Partita for 8 Voices',
    year: 2012,
    venueId: 'alice_tully_hall',
    medium: 'A cappella choral work · Four movements',
    dimensions: 'Eight solo voices, unaccompanied · approx. 25 minutes',
    imageCredit: '',
    imageUrl: '',
    whatToLookFor: [
      `The first movement ('Allemande') — a cascade of overlapping vocal entrances, each voice entering at a slightly different moment, creating a wash of sound. The text is fragmented phonemes rather than complete words. The voice becomes an instrument first.`,
      `The rhythmic groove — Shaw's choral writing has a jazz-influenced rhythmic specificity unusual in contemporary classical music. The eight voices lock into rhythmic patterns with the precision of a percussion section. It is choral music that feels embodied.`,
      `The fourth movement ('Sarabande') — slow, spacious, harmonically rich, showing the full dynamic range of unaccompanied voices: from whisper to full choral weight within a single movement. The Baroque dance form becomes a meditation.`,
    ],
    description: `Caroline Shaw composed Partita for 8 Voices in 2009, expanding it to its final form by 2012. It was premiered by Roomful of Teeth, the vocal ensemble of which Shaw is a member. In 2013 it won the Pulitzer Prize for Music, making Shaw, at 30, the youngest composer to win the prize.

The Partita takes its structure from the Baroque dance suite — Allemande, Sarabande, Courante, Passacaglia — and applies it to a completely contemporary aesthetic that incorporates extended vocal techniques (throat singing, sprechstimme, overtone singing) alongside conventional choral writing. Shaw, who grew up playing violin and singing, treats the voice as a complete instrument rather than a carrier of text. The piece has been performed hundreds of times since the Pulitzer and has introduced more new listeners to contemporary classical music than perhaps any other work of the past 20 years.`,
  },

  // ── SPORTS WORKS ──────────────────────────────────────────────────────
  babe_ruth_60: {
    id: 'babe_ruth_60',
    figureId: 'babe_ruth',
    title: '60th Home Run — September 30, 1927',
    year: 1927,
    venueId: 'yankee_stadium',
    medium: 'Regular Season · New York Yankees vs. Washington Senators',
    dimensions: 'Season record: 60 home runs · .356 batting average · 164 RBI',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Babe_Ruth2.jpg/500px-Babe_Ruth2.jpg',
    whatToLookFor: [
      'Ruth hit his 60th home run off Tom Zachary in the eighth inning at the original Yankee Stadium — a record that stood for 34 years until Roger Maris broke it in 1961.',
      'The 1927 Yankees are widely considered the greatest team in baseball history. Ruth\'s 60 home runs were more than any other entire team hit that season.',
      'The new Yankee Stadium opened across the street in 2009. The monuments and plaques from the old stadium\'s Monument Park were relocated — Ruth\'s plaque is there.',
    ],
    description: `Babe Ruth's 1927 season is the single most celebrated individual season in baseball history, and the 60th home run was its culmination. Playing for the Yankees in the original Yankee Stadium — "The House That Ruth Built" — Ruth rewrote the record book so completely that baseball itself changed around him.

Before Ruth, baseball was a game of strategy and contact hitting. After Ruth, it became a power game. He didn't just break records; he made records that entire teams couldn\'t match. His 60 home runs in 1927 exceeded the total hit by every other American League team that year.

The original Yankee Stadium was demolished in 2008. The current stadium, which opened in 2009, sits across 161st Street from where the original stood. Monument Park — where Ruth's plaque and monument live — was carefully recreated to honor the continuity of a franchise that has won more championships than any other in American sports.`,
  },
  lou_gehrig_speech: {
    id: 'lou_gehrig_speech',
    figureId: 'lou_gehrig',
    title: 'The Luckiest Man Speech — July 4, 1939',
    year: 1939,
    venueId: 'yankee_stadium',
    medium: 'Lou Gehrig Appreciation Day · Original Yankee Stadium',
    dimensions: 'Two-minute speech · 61,808 fans in attendance',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Lou_Gehrig_as_a_new_Yankee_11_Jun_1923.jpg/500px-Lou_Gehrig_as_a_new_Yankee_11_Jun_1923.jpg',
    whatToLookFor: [
      '"Today I consider myself the luckiest man on the face of the Earth." Gehrig had just been told he had ALS — a fatal disease that now bears his name — and stood before 61,808 people and said this.',
      'Gehrig played 2,130 consecutive games, a record that stood for 56 years. He called this consistency luck. He meant it.',
      'The speech is remembered as the most dignified moment in sports history: a man facing death choosing to express gratitude rather than grief in front of the team and city that loved him.',
    ],
    description: `On July 4, 1939, Lou Gehrig walked to the microphone at the original Yankee Stadium and delivered what has become the most famous speech in the history of American sports — perhaps the most moving public statement of gratitude ever spoken by anyone, anywhere.

Gehrig had just been diagnosed with amyotrophic lateral sclerosis (ALS), a degenerative disease that would kill him in two years. He had been forced to end his consecutive games streak at 2,130. He had played every day for fourteen years, through injuries and illness, because showing up was what he understood love and professionalism to mean.

He stood before 61,808 fans at the stadium where he'd played his entire career, and he told them he was the luckiest man alive. He named his teammates, his family, his manager, the fans. He thanked them all.

The original Yankee Stadium was demolished in 2008. The plaque that hangs in Monument Park at the current stadium reads: "A man, a gentleman, and a great ballplayer whose amazing record of 2,130 consecutive games should stand for all time."`,
  },
  derek_jeter_3000: {
    id: 'derek_jeter_3000',
    figureId: 'derek_jeter',
    title: '3,000th Hit — July 9, 2011',
    year: 2011,
    venueId: 'yankee_stadium',
    medium: 'Regular Season · New York Yankees vs. Tampa Bay Rays',
    dimensions: '5-for-5 on the day · Home run for the milestone hit',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Derek_Jeter_during_MLB_on_Fox_pre-game_show%2C_October_16%2C_2024_-_001_%28cropped%29.jpg/500px-Derek_Jeter_during_MLB_on_Fox_pre-game_show%2C_October_16%2C_2024_-_001_%28cropped%29.jpg',
    whatToLookFor: [
      'Jeter became the 28th player in baseball history to reach 3,000 hits, and did it with a home run — only the second player ever to hit their 3,000th as a home run.',
      'He went 5-for-5 on the day, adding a triple, two singles, and a double to the homer. Only Jeter.',
      'Jeter played his entire 20-year career as a Yankee. His defining quality was consistency under pressure — a calm, precise professionalism that made him the face of the most scrutinized sports franchise in America.',
    ],
    description: `Derek Jeter played twenty years in pinstripes and never played a single game for another team. In New York, where athletes are expected to perform at their highest level in front of the most demanding fans in the country, Jeter was the model: calm, professional, impossibly consistent.

His 3,000th hit came on July 9, 2011, against Tampa Bay, and it came as a home run — only the second player in baseball history to collect that milestone hit as a homer. Then, as if to prove a point, he went 4-for-4 the rest of the day. Five hits total. The Yankee Stadium crowd gave him a standing ovation that lasted several minutes.

Five World Series rings. Five Gold Gloves. Fourteen All-Star selections. The Yankees retired his number 2 in 2017. He was elected to the Hall of Fame in 2020 — on 99.7 percent of the ballots, one of the highest percentages ever.`,
  },
  seaver_1969_ws: {
    id: 'seaver_1969_ws',
    figureId: 'tom_seaver',
    title: '1969 World Series — The Miracle Mets',
    year: 1969,
    venueId: 'citi_field',
    medium: 'World Series · New York Mets vs. Baltimore Orioles',
    dimensions: '5 games · Mets won 4-1 · Seaver: 1 win, 2.76 ERA',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Tom_Seaver_Mets.jpg',
    whatToLookFor: [
      'The 1969 Mets had been a laughingstock — losers for seven straight years since their 1962 expansion. They won 100 games and then the World Series. Nobody saw it coming.',
      'Seaver went 25-7 that year with a 2.21 ERA. He was the anchor of a pitching staff that carried a mediocre offense to a championship by simply not allowing runs.',
      'Citi Field, which opened in 2009 replacing Shea Stadium, honors Seaver with the Tom Seaver Museum and the "41 Forever" designation. The World Series happened at old Shea — the tradition continues at Citi Field.',
    ],
    description: `In 1969, the New York Mets were in their eighth year of existence and had never finished above ninth place. The Baltimore Orioles, their World Series opponents, were widely considered one of the greatest teams ever assembled, having won 109 regular season games. Nobody gave the Mets a chance.

Tom Seaver, 24 years old, was the reason they had one. "Tom Terrific" had spent three years building himself into the most complete pitcher in the National League. His mechanics were perfect — a low-angle delivery that produced late-breaking movement that hitters simply couldn't time. In 1969 he went 25-7 and won the Cy Young Award unanimously.

The Mets won the World Series in five games. Shea Stadium in Flushing became the loudest place in New York for a week. The field was stormed after the final out; people pulled up the grass and took it home.

Shea was demolished in 2009. Citi Field was built in its shadow — literally — and opened the same year. The footprint overlaps. Tom Seaver died in 2020. The team retired his number 41 permanently.`,
  },
  piazza_911_hr: {
    id: 'piazza_911_hr',
    figureId: 'mike_piazza',
    title: 'The September 21 Home Run — 2001',
    year: 2001,
    venueId: 'citi_field',
    medium: 'Regular Season · New York Mets vs. Atlanta Braves',
    dimensions: 'First professional sporting event in NYC after 9/11 · 8th inning, 2-run homer',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mike_Piazza_HOF_Press_Conference.jpg/500px-Mike_Piazza_HOF_Press_Conference.jpg',
    whatToLookFor: [
      'Shea Stadium hosted the first major professional sporting event in New York City after the September 11 attacks. The Mets played ten days after the towers fell.',
      'Piazza hit a two-run home run in the eighth inning to give the Mets a 3-2 lead — a lead they held. The crowd reaction was described by everyone present as unlike anything they had ever heard at a sporting event.',
      'It is remembered not as a sports moment but as a civic one: the first time tens of thousands of New Yorkers came together in a shared space to feel something other than grief.',
    ],
    description: `On September 21, 2001, ten days after the attacks on the World Trade Center, 41,235 people came to Shea Stadium in Flushing, Queens, for the first major professional sporting event held in New York City since September 11.

The evening began with tributes, with players wearing caps of the NYPD, FDNY, and Port Authority. Diana Ross sang. There was a moment of silence. And then they played baseball, because the city needed something to do with itself besides grieve.

Mike Piazza came to bat in the eighth inning with the Mets trailing 2-1. He hit a two-run home run that landed in the Mets' bullpen in left-center field. The sound that came out of Shea Stadium was not the sound of fans celebrating a game. It was something older and more complicated — relief, grief, pride, shared feeling, the need for exactly this moment.

The Mets won 3-2. It mattered, and it didn't matter. The home run is remembered because sports have always been, at their best, a container for things too large to say directly.`,
  },
  reed_game7_1970: {
    id: 'reed_game7_1970',
    figureId: 'willis_reed',
    title: 'Game 7, 1970 NBA Finals — The Comeback',
    year: 1970,
    venueId: 'msg',
    medium: '1970 NBA Finals · New York Knicks vs. Los Angeles Lakers',
    dimensions: 'Knicks won 113-99 · Reed: 2 pts, 3 reb in 27 minutes',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Willis_Reed_1972_publicity_photo.jpg/500px-Willis_Reed_1972_publicity_photo.jpg',
    whatToLookFor: [
      'Reed tore a muscle in his right thigh in Game 5 and was not expected to play Game 7. He limped onto the MSG court before tip-off, hit his first two shots, and then watched as the crowd\'s roar carried the Knicks to a championship.',
      'Walt Frazier scored 36 points and had 19 assists in the same game — statistically the greater performance — but Reed\'s entrance is what everyone remembers. Sports are not purely about statistics.',
      'Madison Square Garden has been renovated multiple times since 1970. The moment, however, is physically present in the building: you can feel it in the way the Garden treats Game 7 nights.',
    ],
    description: `The Knicks hadn't won an NBA championship in franchise history. They were in Game 7 of the 1970 Finals against Wilt Chamberlain and the Los Angeles Lakers, at Madison Square Garden, and their starting center — Willis Reed, the team's emotional anchor — had torn a muscle in his thigh in Game 5.

He didn't play Game 6. The Lakers won. Nobody knew if Reed would play Game 7.

He played. He limped out of the tunnel before tip-off and the Garden erupted in a sound that witnesses describe as unlike anything they had heard before. He hit the first two baskets. He scored no more points. He played 27 minutes on a leg that shouldn't have supported him, and his presence transformed what was possible for everyone on the court.

Walt Frazier scored 36 points and had 19 assists. The Knicks won 113-99 and were champions. Reed was named Finals MVP.

Fifty years later, every account of that night begins in the same place: the moment Willis Reed came out of the tunnel.`,
  },
  frazier_game7_1970: {
    id: 'frazier_game7_1970',
    figureId: 'walt_frazier',
    title: 'Game 7, 1970 NBA Finals — 36 Points, 19 Assists',
    year: 1970,
    venueId: 'msg',
    medium: '1970 NBA Finals · New York Knicks vs. Los Angeles Lakers',
    dimensions: '36 points · 19 assists · 7 rebounds · 5 steals',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Walt_Frazier_%28cropped%29.jpg/500px-Walt_Frazier_%28cropped%29.jpg',
    whatToLookFor: [
      'While the city focused on Reed\'s entrance, Frazier was quietly producing one of the greatest performances in Finals history: 36 points and 19 assists in Game 7. Against Jerry West, one of the greatest guards ever to play.',
      'Frazier was the model for what a point guard could be: creative, cool, impossibly stylish. His nickname — "Clyde," after Clyde Barrow of Bonnie and Clyde — reflected the fact that his game, like his wardrobe, was simultaneously flashy and effective.',
      'He remains the greatest player in Knicks history and one of the great defensive guards in NBA history. His jersey number 10 hangs in the Garden rafters.',
    ],
    description: `Game 7 of the 1970 NBA Finals is remembered for Willis Reed's entrance. But the game was won by Walt Frazier — and the stats he put up that night belong among the greatest individual playoff performances in NBA history.

36 points. 19 assists. 7 rebounds. 5 steals. Against Jerry West, who was himself having a historic series, and the Lakers team that had beaten the Knicks in Game 6 without a healthy Reed.

Frazier was the Knicks' true architect. Cool under pressure in a way that seemed to defy the intensity of the moment — "Clyde" was always in his own rhythm, which happened to be faster and more precise than everyone else\'s. He was a defensive force before defense was fashionable. He ran the team with a kind of creative authority that made everything look easier than it was.

He played ten seasons at the Garden, won two championships, and became the most stylish player in a league full of style. His number 10 hangs in the rafters alongside Reed's 19. They won together, and they are remembered together, even when one of them did most of the actual winning.`,
  },
  ewing_knicks_playoffs: {
    id: 'ewing_knicks_playoffs',
    figureId: 'patrick_ewing',
    title: '1994 NBA Finals — The Championship That Almost Was',
    year: 1994,
    venueId: 'msg',
    medium: '1994 NBA Finals · New York Knicks vs. Houston Rockets',
    dimensions: '7 games · Ewing avg: 18.9 pts, 12.4 reb · Rockets won 4-3',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Patrick_Ewing_2021_%28cropped%29.jpg/500px-Patrick_Ewing_2021_%28cropped%29.jpg',
    whatToLookFor: [
      'Ewing carried the Knicks to Game 7 of the Finals — the closest the franchise came to a championship after 1973. The Rockets won 90-84 in a grind of a game decided by Hakeem Olajuwon\'s post play.',
      'Ewing\'s fifteen years at Madison Square Garden produced 24,815 points, 11,607 rebounds, and a city\'s sustained, complicated devotion. He was the Knicks.',
      'The 1994 run is remembered as both the high point and the most painful near-miss in Knicks history. Ewing, to his credit, never stopped trying.',
    ],
    description: `Patrick Ewing came to New York in 1985 as the first overall pick in the draft, and for the next fifteen years he was the Knicks. Not a piece of the Knicks. Not one of their stars. He was the entire center of gravity around which every season orbited.

He was the most physically dominant center of his generation outside of Hakeem Olajuwon — and it was Olajuwon who, in the 1994 NBA Finals, stood between Ewing and the championship that New York had been waiting for since 1973.

The Knicks took it to seven games. Game 7 in Houston was a grim, defensive, professional basketball game, which was exactly the kind of game Ewing and his coach Pat Riley had built the franchise to win. The Rockets won 90-84. Ewing scored 17 points on 7-for-17 shooting. It wasn't quite enough.

He played eleven more seasons — one more with the Knicks, then moves to Seattle, Orlando, and Atlanta. He never came back to the Finals. His number 33 hangs at Madison Square Garden. New York still argues about him: about what he was, what he could have been, and what it meant to watch him play.`,
  },
  king_scoring_title: {
    id: 'king_scoring_title',
    figureId: 'bernard_king',
    title: '1984-85 Scoring Title — 32.9 Points Per Game',
    year: 1985,
    venueId: 'msg',
    medium: 'Regular Season · New York Knicks',
    dimensions: '32.9 PPG · Led NBA in scoring · 55 games played',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bernard_King.jpg/500px-Bernard_King.jpg',
    whatToLookFor: [
      'King averaged 32.9 points per game in 1984-85 — good enough to lead the NBA in scoring despite missing 27 games due to injury. The offensive output was historically exceptional.',
      'He was the first player to score 60 in a Garden game — doing it in 1984, before the scoring title season. His mid-range game was machine-like in its precision.',
      'King tore his ACL in March 1985 before the season ended — a devastating injury that ended his time as an elite Knick. His comeback, two years later with Washington, was one of the great stories of athletic perseverance in NBA history.',
    ],
    description: `Bernard King's time at Madison Square Garden was brief — just over two seasons — but it produced some of the purest offensive basketball the Garden has ever seen.

King was a scoring machine who operated in the mid-range with a kind of systematic efficiency that anticipated the analytics era while being purely intuitive. He had footwork that created separation from any defender. He could score from any spot on the floor. In the 1984-85 season, he was doing this at 32.9 points per game.

He tore his anterior cruciate ligament in March 1985, before the season was over. ACL tears in the 1980s were effectively career-ending injuries — most players never returned to anything close to their previous level. Bernard King returned to All-Star form.

He scored 60 points in a Madison Square Garden game in 1984. He led the NBA in scoring in 1984-85 despite missing nearly a third of the season. He averaged 22.5 points for Washington two years after the injury. He was inducted into the Naismith Memorial Basketball Hall of Fame in 2013. His jersey number 30 is retired by the Knicks.`,
  },
  houston_bounce: {
    id: 'houston_bounce',
    figureId: 'allan_houston',
    title: 'The Bounce — May 16, 1999',
    year: 1999,
    venueId: 'msg',
    medium: '1999 NBA Playoffs Game 5 · New York Knicks vs. Miami Heat',
    dimensions: 'Knicks won 78-77 · Houston: game-winning shot with 0.8 seconds remaining',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Allan_Houston_2010.jpg/500px-Allan_Houston_2010.jpg',
    whatToLookFor: [
      'Houston caught a pass on the left baseline with 0.8 seconds left, shot a running floater, and it hit the rim, bounced up, and fell through. Miami\'s Alonzo Mourning stood under the basket and watched.',
      'The Knicks were an eighth seed. They had beaten the one-seed Miami Heat in the first round — the first eighth seed to ever beat a one seed in a seven-game series. They went on to reach the Finals.',
      'The shot is called simply "The Bounce." When Garden fans of a certain generation talk about it, they don\'t need to explain what they mean.',
    ],
    description: `The 1999 NBA Playoffs produced the greatest single moment in modern Knicks history — not from Patrick Ewing, not from any of the franchise stars, but from Allan Houston, the second guard, on a running floater from the left baseline with 0.8 seconds on the clock.

The Knicks were the eighth seed. The Miami Heat were the one seed, with Alonzo Mourning at center, Tim Hardaway running the offense, and home court advantage through the first three rounds. The Knicks weren't supposed to win this series.

They won Game 5 because the ball bounced in. It hit the rim, rolled forward, and fell through the net as the buzzer sounded. The Madison Square Garden crowd — watching this happen in Miami, on television, from New York — became the noise of an entire city.

The Knicks went on to beat Indiana in the conference finals and reach the NBA Finals, where they lost to San Antonio in five games. They were eighth seeds who made the Finals. Allan Houston's floater made all of it possible.

He played seven more seasons in New York. He was never quite the city's hero the way Reed or Frazier had been, but in New York, "The Bounce" is enough. That\'s what stays.`,
  },
  messier_guarantee: {
    id: 'messier_guarantee',
    figureId: 'mark_messier',
    title: 'The Guarantee — May 25, 1994',
    year: 1994,
    venueId: 'msg',
    medium: '1994 Eastern Conference Finals Game 6 · New York Rangers vs. New Jersey Devils',
    dimensions: 'Rangers won 4-2 · Messier: hat trick · Rangers won Cup in Game 7',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Mark_Messier_2016.jpg/500px-Mark_Messier_2016.jpg',
    whatToLookFor: [
      'Before Game 6, down 3-2 in the series, Messier told reporters: "We\'ll win tonight." This was not a figure of speech. He then scored a hat trick — three goals in the third period — to win the game and force Game 7.',
      'The Rangers had not won the Stanley Cup since 1940. Fans chanted "1940!" to taunt them. Messier, who had won five cups in Edmonton, simply refused to accept that history.',
      'The Rangers won Game 7 at MSG. When they won the Cup, coach Mike Keenan handed it to Messier first. He skated a lap with it raised over his head. The Garden had been waiting 54 years.',
    ],
    description: `Mark Messier arrived in New York in 1991 carrying five Stanley Cup rings from Edmonton and a reputation as the best leader in hockey. The Rangers had not won the Stanley Cup since 1940. Their fans had been hearing "1940!" for so long it had become a ritual humiliation.

In the 1994 Eastern Conference Finals against New Jersey, the Rangers were down three games to two and facing elimination. Before Game 6, Messier went to the press and said they would win. Not hoped they would win. Not thought they had a chance. Would win.

He scored three goals in the third period to back it up.

The Rangers won Game 7. They won the Stanley Cup. When commissioner Gary Bettman handed it to coach Mike Keenan, Keenan handed it directly to Messier. He raised it above his head and skated a lap that every Rangers fan alive can still see.

Messier's number 11 is retired at Madison Square Garden. The guarantee is remembered not because guarantees usually work in sports — they don\'t — but because Mark Messier made it work. He willed it into existence.`,
  },
  lundqvist_2014_playoffs: {
    id: 'lundqvist_2014_playoffs',
    figureId: 'henrik_lundqvist',
    title: '2014 Stanley Cup Playoffs — The King at His Peak',
    year: 2014,
    venueId: 'msg',
    medium: '2014 Stanley Cup Playoffs · New York Rangers',
    dimensions: 'Rangers reached Conference Finals · Lundqvist: .927 sv%, 1.98 GAA in playoffs',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Henrik_Lundqvist_by_Gage_Skidmore.jpg/500px-Henrik_Lundqvist_by_Gage_Skidmore.jpg',
    whatToLookFor: [
      'Lundqvist was the reason the Rangers competed for a decade. In 2014, he was at his absolute peak — athletic, technically perfect, utterly calm under pressure.',
      'His nickname was "The King" — after Henrik VIII — and it fit both his demeanor and his address: the World\'s Most Famous Arena.',
      'He never won the Stanley Cup as a Ranger. He was on the verge with Washington in 2020 before the pandemic interrupted the playoffs and his contract ended. He retired in 2021.',
    ],
    description: `For fifteen seasons, Henrik Lundqvist was the best goaltender in New York Rangers history and, for extended periods, the best goaltender in the NHL. He stood behind defenses that were sometimes excellent and sometimes inadequate, and he kept the Rangers in the playoff picture through both — through force of technical perfection and competitive will.

The 2014 playoffs were Lundqvist at his most complete. He carried the Rangers past Philadelphia and Pittsburgh, two of the Eastern Conference's best offenses, to reach the Conference Finals before losing to Montreal. His numbers — .927 save percentage, 1.98 goals-against average — are elite by any standard.

He never won the Cup. In fifteen seasons with the Rangers, he reached the Finals once (2014, losing to the Kings) and the semifinals multiple times. The core of a dynasty — Messier's dynasty — had won in 1994. Lundqvist\'s Rangers were perpetually excellent and perpetually frustrated.

He retired in 2021, immediately after signing with Washington and preparing for a playoff run. A heart condition ended his career before he could play another game. The Garden retired his number 30 in 2022. He is the franchise saves leader, wins leader, and shutouts leader. He is the best goaltender who never won a Cup, which is its own distinction.`,
  },
  leetch_conn_smythe: {
    id: 'leetch_conn_smythe',
    figureId: 'brian_leetch',
    title: '1994 Stanley Cup Finals — Conn Smythe Trophy',
    year: 1994,
    venueId: 'msg',
    medium: '1994 Stanley Cup Finals · New York Rangers vs. Vancouver Canucks',
    dimensions: 'Rangers won 4-3 · Leetch: 11 goals, 23 assists in 23 playoff games',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Brian_Leetch_New_York_Rangers_1997_Vancouver.jpg/500px-Brian_Leetch_New_York_Rangers_1997_Vancouver.jpg',
    whatToLookFor: [
      'Leetch\'s 34 playoff points in 1994 set a record for American-born players in a single postseason — a record that still stands. He won the Conn Smythe Trophy as playoff MVP.',
      'He was the first American-born player to win the Conn Smythe. His skating was the fastest in the NHL, his offensive instincts equal to any forward.',
      'The Rangers won Game 7 of the Finals at MSG. The moment has been replayed thousands of times. Leetch, characteristically, was on the ice for all of it.',
    ],
    description: `The 1994 Stanley Cup championship required a Game 7. The Vancouver Canucks had pushed the Rangers to the limit, winning Game 6 to force a deciding game at Madison Square Garden. The building had been waiting 54 years for a championship. Brian Leetch had been playing like a man who intended to end the wait.

Leetch finished the 1994 playoffs with 11 goals and 23 assists — 34 points in 23 games. No American-born player had ever put up numbers like that in a single postseason. He won the Conn Smythe Trophy as the MVP of the playoffs, becoming the first American-born player to receive that honor.

He was a defenseman — which made the offensive numbers even more remarkable. His skating was genuinely the fastest in the NHL. His ability to carry the puck from his own zone and create goals as if he were a forward was the offensive engine that powered the championship run.

Leetch played eighteen seasons, the majority with the Rangers. His number 2 hangs at Madison Square Garden. In the history of Rangers defense, nobody was better.`,
  },
  gilbert_career: {
    id: 'gilbert_career',
    figureId: 'rod_gilbert',
    title: '18 Seasons as a Ranger — The Franchise Leader',
    year: 1977,
    venueId: 'msg',
    medium: 'Career · New York Rangers · 1960–1978',
    dimensions: '1,065 games · 406 goals · 615 assists · 1,021 points',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/GilbertRangers.png',
    whatToLookFor: [
      'Gilbert played his entire 18-season career as a Ranger without ever winning a Stanley Cup — and is still the franchise\'s all-time scoring leader. He held that record for decades.',
      'He survived two surgeries on a damaged spine early in his career that might have ended a less determined player. He came back both times.',
      'The Rangers retired his number 7 in 1979. He is one of the central figures in the long, bittersweet history of a franchise that waited 54 years for its second championship.',
    ],
    description: `Rod Gilbert played eighteen seasons for the New York Rangers and never won the Stanley Cup. He is still, by a significant margin, the franchise's all-time leader in goals and points. His career is the story of one of the great players of his generation — a right wing with exceptional skill and exceptional determination — belonging entirely to a franchise that couldn't quite get over the top.

He recovered from two spinal surgeries that would have ended most careers. He became the Ranger: the player who defined what it meant to wear that uniform during the 1960s and 1970s. His skating was graceful, his release quick, his sense of where the puck was going ahead of his time.

Madison Square Garden retired his number 7 in 1979, the year after he played his last game. The ceremony was held before the home opener, and the Garden crowd gave him a standing ovation that lasted several minutes. He was 38.

Gilbert worked for the Rangers organization until his death in 2021. He was inducted into the Hockey Hall of Fame in 1982. He remains, in the minds of Rangers fans who were alive to watch him, the definitive Ranger — not because of championships, but because of who he was and what he gave.`,
  },
  richter_1994_cup: {
    id: 'richter_1994_cup',
    figureId: 'mike_richter',
    title: '1994 Stanley Cup — The Championship Goaltender',
    year: 1994,
    venueId: 'msg',
    medium: '1994 Stanley Cup Playoffs · New York Rangers',
    dimensions: '23 games · .913 save percentage · 2.07 GAA',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Mike_Richter.jpg',
    whatToLookFor: [
      'Richter stopped Pavel Bure on a penalty shot in Game 4 of the Finals — one of the most important saves in Rangers history. The Rangers were leading the series 2-1 and protecting a 2-1 lead in the game when Bure came in alone.',
      'He anchored the Rangers through an entire playoff run, making 23 starts and producing elite numbers when the team needed them most.',
      'Richter was the face of American goaltending in the 1990s. He won the World Cup of Hockey in 1996 with Team USA, including the championship game save that sealed the upset of Canada.',
    ],
    description: `Mike Richter was the Rangers' starting goaltender for thirteen seasons, and in 1994 he was everything a franchise could ask of someone playing that position: steady, capable of brilliance under pressure, and quietly essential to everything the team accomplished.

The championship run required twenty-three playoff games. Richter was in net for all of them. He posted a .913 save percentage and a 2.07 goals-against average — numbers that would be elite in any era — while the team's defense ran alternately hot and cold.

The moment that defined his playoffs came in Game 4 of the Finals against Vancouver. Pavel Bure — the fastest and most dangerous forward in hockey — was awarded a penalty shot. The Rangers were leading 2-1 in the game and 2-1 in the series. Bure came in, moved to his backhand, and Richter stopped him.

The Rangers won the game, took the series lead, and eventually the Cup. Richter's career ended in 2004 due to a head injury sustained in 2002. He was inducted into the United States Hockey Hall of Fame in 2008. He remains the career wins leader in Rangers history and the player who was in goal the night the franchise ended its 54-year drought.`,
  },
  ashe_1968_us_open: {
    id: 'ashe_1968_us_open',
    figureId: 'arthur_ashe',
    title: '1968 US Open — The First Champion',
    year: 1968,
    venueId: 'arthur_ashe_stadium',
    medium: 'US Open · West Side Tennis Club (Forest Hills, Queens)',
    dimensions: 'Final: Ashe def. Tom Okker 14-12, 5-7, 6-3, 3-6, 6-3',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Arthur_Ashe_%28cropped%29.jpg/500px-Arthur_Ashe_%28cropped%29.jpg',
    whatToLookFor: [
      'The 1968 US Open was the first Open Era Grand Slam — the first year professionals were allowed to compete alongside amateurs. Ashe won it as an amateur, meaning he received no prize money.',
      'He was the first Black man to win the US Open, and the first to win any Grand Slam singles title. These facts existed alongside, not instead of, his tennis.',
      'Arthur Ashe Stadium at the USTA Billie Jean King National Tennis Center is named for him. The stadium opened in 1997, three years after his death from AIDS complications following a contaminated blood transfusion.',
    ],
    description: `Arthur Ashe won the inaugural US Open in 1968 — the first year the tournament was open to professionals, and thus the first US Open in the form we now recognize. He won it as an amateur, serving in the US Army, which meant he received no prize money. He received history instead.

He was 25 years old. He was the first Black man to win the US Open, and he would go on to win the Australian Open in 1970 and Wimbledon in 1975, making him the only Black man to have won all three of those titles. His tennis was elegant, intelligent, and physically exceptional — a serve-and-volley game built around disguise and placement rather than raw power.

His life off the court was as significant as his tennis. He fought apartheid, advocated for African causes, was arrested at the South African embassy. After his career ended, he coached Davis Cup teams, wrote, worked. He was diagnosed with HIV in 1988 following a heart surgery transfusion. He died in 1993 at 49.

The largest tennis stadium in the world opened in Flushing Meadows in 1997 and was named for him. It has a retractable roof now. It seats 23,000 people and hosts the US Open final. He would have found a way to serve and volley on it.`,
  },
  king_1974_us_open: {
    id: 'king_1974_us_open',
    figureId: 'billie_jean_king',
    title: '1974 US Open — The Queen of Queens',
    year: 1974,
    venueId: 'arthur_ashe_stadium',
    medium: 'US Open · West Side Tennis Club (Forest Hills, Queens)',
    dimensions: 'Final: King def. Evonne Goolagong 3-6, 6-3, 7-5',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Billie_Jean_King_at_the_2026_Sundance_Film_Festival_02_%28crop_2%29.jpg/500px-Billie_Jean_King_at_the_2026_Sundance_Film_Festival_02_%28crop_2%29.jpg',
    whatToLookFor: [
      'King won six US Open titles, four Wimbledons, and one Australian Open during her career. She transformed professional tennis by demanding equal prize money for women — and largely getting it.',
      'The 1973 "Battle of the Sexes" — her defeat of Bobby Riggs before 90 million television viewers — happened the year before this title and was the most-watched tennis match in history at the time.',
      'The USTA National Tennis Center is officially named the Billie Jean King National Tennis Center. Her contributions to tennis, and to women\'s sports more broadly, shaped the institution permanently.',
    ],
    description: `Billie Jean King won her sixth US Open title in 1974, defeating Evonne Goolagong in three sets at the West Side Tennis Club in Forest Hills, Queens. By this point she had been the dominant force in women's tennis for nearly a decade, and her tennis was only part of what she was doing.

She cofounded the Women's Tennis Association in 1973. She demanded equal prize money at the US Open, which became the first Grand Slam to offer it in 1973. She founded World Team Tennis. She created a professional structure for women\'s sports that hadn\'t existed when she started her career.

In 1973, a retired 55-year-old player named Bobby Riggs challenged her to a match he called "The Battle of the Sexes," publicly claiming that the women's game was so inferior that even an old man could beat any woman. She accepted. She defeated him 6-4, 6-3, 6-3 before 90 million television viewers. The match is remembered as the moment sports became explicitly political in a new way.

The USTA National Tennis Center, where the US Open is now played, is officially called the Billie Jean King National Tennis Center. Her name is on the institution that hosts the tournament she helped transform. Arthur Ashe Stadium sits within it. The largest tennis venue in the world bears the names of two people who changed what the sport was allowed to be.`,
  },
  serena_2012_us_open: {
    id: 'serena_2012_us_open',
    figureId: 'serena_williams',
    title: '2012 US Open — The Greatest of All Time',
    year: 2012,
    venueId: 'arthur_ashe_stadium',
    medium: 'US Open · Arthur Ashe Stadium',
    dimensions: 'Final: Williams def. Victoria Azarenka 6-2, 2-6, 7-5 · One of 6 US Open titles',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg',
    whatToLookFor: [
      'Serena won six US Open titles in total. The Open has been her most consistent Grand Slam — she first won it in 1999 at age 17, and the 2012 title came after years of health challenges.',
      'She owns 23 Grand Slam singles titles — the most by any player in the Open Era. Her serve, her athleticism, her competitiveness, and her longevity are each individually historic.',
      'Arthur Ashe Stadium became associated with Serena in a way few venues are associated with individual athletes. She played her final competitive match there in 2022.',
    ],
    description: `Serena Williams won her sixth US Open title in 2012, defeating Victoria Azarenka at Arthur Ashe Stadium. She had been dealing with health problems — a pulmonary embolism, hematoma, and a series of injuries that had kept her from the top of the game for stretches. She came back.

She always came back. That was the defining quality of Serena Williams: not just the overwhelming talent — the serve that was the best shot in women's tennis history, the athleticism that allowed her to return balls others simply gave up on — but the refusal to accept that a career could be over when she believed it wasn\'t.

She won 23 Grand Slam singles titles. She is the greatest women's tennis player in history by nearly any measure, and the argument for her as the greatest player of any gender has become serious in recent years. She won her first US Open at 17. She won titles at 34 and 35, ages at which most players have retired.

The US Open was her home. Arthur Ashe Stadium was built the year she turned 16. She played her final professional match there in 2022, and the crowd gave her a farewell that the stadium had not seen before. Twenty-three championships. One sport. Completely transformed.`,
  },
  connors_1991_run: {
    id: 'connors_1991_run',
    figureId: 'jimmy_connors',
    title: '1991 US Open Run — Age 39',
    year: 1991,
    venueId: 'arthur_ashe_stadium',
    medium: 'US Open · Arthur Ashe Stadium',
    dimensions: 'Semifinalist at age 39 · Won five matches including two five-setters',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Jimmy_Conners_1994.jpg/500px-Jimmy_Conners_1994.jpg',
    whatToLookFor: [
      'Connors entered the 1991 US Open as a wild card, ranked 174th in the world. He was 39. He won five matches, two of them in five sets. The crowds at Arthur Ashe Stadium treated it as the most exciting thing they had ever seen at a tennis match.',
      'He had won the US Open five times, most recently in 1983. Eight years later, he came back and reminded everyone why he had been the most competitive player on the tour for fifteen years.',
      'Connors famously played to and with crowds in a way most tennis players couldn\'t or wouldn\'t. At the 1991 Open, the crowd became genuinely part of what he was doing.',
    ],
    description: `Jimmy Connors won five US Open titles — 1974, 1976, 1978, 1982, 1983 — and was the most combative, crowd-engaging player of his era. He was not charming in the way that champions are expected to be charming. He was combative, profane, completely engaged with the audience, and he played every match like something genuinely important was at stake.

In 1991, he was 39 years old and ranked 174th in the world. He entered the US Open as a wild card — meaning he hadn't qualified through the normal process. He won five matches. Two of them went five sets. He beat a player ranked 19th. He beat a player ranked 25th.

The crowds at Arthur Ashe Stadium started the tournament curious and ended it in a state of sustained joy. This was not about tennis strategy. This was about watching someone who had been playing professionally for twenty years reach back for something he hadn't needed in a long time, and find it still there.

He lost in the semifinals to Stefan Edberg, who was 25 and the number-one player in the world. Connors was 39 and playing on one leg after an injury in the previous round. He lost 3-6, 7-6, 6-3, 6-2.

He never played the US Open again. The 1991 run is remembered as one of the great sporting moments in the tournament's history — not because he won, but because of what he refused to accept about what winning required him to be.`,
  },
  graf_1988_us_open: {
    id: 'graf_1988_us_open',
    figureId: 'steffi_graf',
    title: '1988 US Open — The Golden Slam',
    year: 1988,
    venueId: 'arthur_ashe_stadium',
    medium: 'US Open · West Side Tennis Club (last year at Forest Hills) / National Tennis Center',
    dimensions: 'Final: Graf def. Gabriela Sabatini 6-3, 3-6, 6-1 · Completed Golden Slam',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Steffi_Graf_in_Hamburg_2010_%28cropped%29.jpg/500px-Steffi_Graf_in_Hamburg_2010_%28cropped%29.jpg',
    whatToLookFor: [
      'The "Golden Slam" — winning all four Grand Slams plus an Olympic gold medal in the same calendar year — has happened exactly once in the history of tennis. Steffi Graf did it in 1988.',
      'Her forehand is considered the greatest shot in women\'s tennis history. Her US Open final that year was a demonstration of controlled power that Sabatini, a genuinely excellent player, had no answer for.',
      'Graf won 22 Grand Slam titles total and retired undefeated at age 30 — on her own terms, at her peak, by choice.',
    ],
    description: `In 1988, Steffi Graf won the Australian Open, the French Open, Wimbledon, and the US Open — and then won the Olympic gold medal at the Seoul Games. No player in tennis history had ever won all four Grand Slams and the Olympics in the same year. No player has done it since.

The Golden Slam exists as a concept because Graf made it possible. She invented a category of achievement that nobody had needed before.

The US Open that year was the last piece. She defeated Gabriela Sabatini 6-3, 3-6, 6-1 in the final, with a forehand that tennis historians still consider the finest single shot women's tennis has produced: heavy, penetrating, accurate, and capable of being hit with authority from virtually any position on the court.

Graf won 22 Grand Slam titles and held the world number-one ranking for 377 weeks — a record that stood until Serena Williams passed it. She retired in 1999 at age 30, ranking number 3 in the world, having lost only in the last major she entered. She retired because she decided to. In a sport where physical decline usually makes that decision, Graf retired on her own terms.`,
  },
  ali_frazier_1971: {
    id: 'ali_frazier_1971',
    figureId: 'muhammad_ali',
    title: 'Fight of the Century — March 8, 1971',
    year: 1971,
    venueId: 'msg',
    medium: 'World Heavyweight Championship · Madison Square Garden',
    dimensions: '15 rounds · Frazier won by unanimous decision · 20,455 in attendance',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Muhammad_Ali_NYWTS.jpg/500px-Muhammad_Ali_NYWTS.jpg',
    whatToLookFor: [
      'Ali had been stripped of his title and banned from boxing for three years for refusing the Vietnam draft. Frazier was the undefeated champion. This was the first meeting of two undefeated heavyweights in the championship fight history.',
      'Frazier knocked Ali down in the 15th round with a left hook. Ali got up. Frazier won the decision. The rematch — and the Thrilla in Manila — would follow. The rivalry defined the heavyweight division for a decade.',
      'The fight was broadcast to 300 million viewers worldwide. Frank Sinatra photographed it for Life magazine. It was, for one night, the most-watched event on earth.',
    ],
    description: `The Fight of the Century happened at Madison Square Garden on March 8, 1971. It was Muhammad Ali's return from three years of forced exile — he had been stripped of his heavyweight title and banned from boxing for refusing the Vietnam draft — against Joe Frazier, the undefeated champion who had held the title in his absence.

Every heavyweight championship that matters in history has a context. This one had the entire country. Ali was the most famous athlete in the world, the symbol of both the counter-culture and Black political resistance. Frazier was his opposite: working-class, non-political, the establishment's preferred champion whether he sought it or not.

They fought 15 rounds at the Garden. Frazier knocked Ali down in the 15th with a left hook — the punch he'd been building the entire fight. Ali got up. The judges gave Frazier a unanimous decision.

Frank Sinatra photographed ringside for Life magazine. The fight was broadcast to 300 million people. There was not a neutral corner in the building, or in the country, or in much of the world. Ali and Frazier fought twice more. Ali won both rematches.

The venue has changed — renovated multiple times since 1971 — but the building is the same building. Madison Square Garden hosted the greatest heavyweight fight of the 20th century.`,
  },
  frazier_ali_msg: {
    id: 'frazier_ali_msg',
    figureId: 'joe_frazier',
    title: 'Fight of the Century — Joe Frazier\'s Night',
    year: 1971,
    venueId: 'msg',
    medium: 'World Heavyweight Championship · Madison Square Garden',
    dimensions: '15 rounds · Won by unanimous decision · Knocked down Ali in the 15th',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Joe_Frazier_reading_newspaper_cropped.jpg/500px-Joe_Frazier_reading_newspaper_cropped.jpg',
    whatToLookFor: [
      'Frazier\'s left hook was one of the most lethal punches in heavyweight history — short, explosive, delivered from a crouching style that made it almost impossible to anticipate. In the 15th round, it connected.',
      'Frazier never stopped coming forward. His style was relentless pressure — absorbing punishment to close distance and then delivering more punishment in return. Against Ali\'s movement and jab, he simply kept moving through it.',
      'History has been harder on Frazier than on Ali — partly because of their personal enmity, partly because Ali\'s story became larger. Frazier was a genuinely great heavyweight champion who beat the greatest.',
    ],
    description: `Joe Frazier won the Fight of the Century on March 8, 1971 at Madison Square Garden. He knocked Muhammad Ali down in the 15th round and won by unanimous decision. He was the champion. He had beaten the man the world had decided should be champion.

History was not particularly kind to Joe Frazier. He was positioned, by Ali and by the story that grew around the fight, as the wrong man to have won. Ali's political symbolism was larger than Frazier\'s accomplishment. Frazier was the champion; Ali became the myth.

The three fights between them were the finest heavyweight trilogy in boxing history. Frazier won the first. Ali won the second and the third — the Thrilla in Manila in 1975, which both men said was the hardest thing they had ever done. Frazier said after Manila that he felt Ali had killed something in him.

Frazier came from South Carolina and trained in Philadelphia. He was not New York the way Ali was everywhere. But March 8, 1971 was his night — the night at the Garden when the best fighter in the world came back from exile and Joe Frazier beat him anyway.`,
  },
  robinson_lamotta_6: {
    id: 'robinson_lamotta_6',
    figureId: 'sugar_ray_robinson',
    title: 'The Sixth LaMotta Fight — February 14, 1951',
    year: 1951,
    venueId: 'msg',
    medium: 'World Middleweight Championship · Chicago Stadium → MSG connection',
    dimensions: '13 rounds (TKO) · Middleweight title · Robinson\'s career: 173-19-6',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Sugar_Ray_Robinson_1947.jpg/500px-Sugar_Ray_Robinson_1947.jpg',
    whatToLookFor: [
      'Robinson fought LaMotta six times — winning five — and the sixth fight, for the middleweight title, is considered one of the great fights in boxing history. Robinson stopped LaMotta in the 13th round.',
      'Sugar Ray Robinson is considered by many experts the greatest pound-for-pound boxer who ever lived. His combination of speed, power, footwork, and punch accuracy set a standard that has never been exceeded.',
      'Robinson fought primarily in New York throughout his career, appearing at Madison Square Garden dozens of times. He became one of the first Black American athletes to become a mainstream celebrity.',
    ],
    description: `Sugar Ray Robinson fought Jake LaMotta six times over nine years, winning five of the six, and the sixth fight — the one that finally gave Robinson the middleweight title — is considered one of the greatest fights in boxing history.

Robinson was, by the consensus of boxing experts across eras, the greatest pound-for-pound boxer who ever lived. His speed was exceptional. His footwork made him impossible to corner. His combination punching was precise to a degree that seemed impossible given how quickly he threw. He could knock you out or outpoint you, and he could do it from the first round or the 13th.

He fought in New York throughout his career — Madison Square Garden was his primary stage — and he became one of the first Black American athletes to be accepted as a mainstream celebrity, years before that was common. He owned businesses in Harlem. He dressed with a flamboyance that influenced Muhammad Ali and everything that came after.

His career record was 173 wins, 19 losses, and 6 draws. The losses came largely late in his career, when he was fighting well past his prime. At his peak — the late 1940s and early 1950s — he was the perfect boxer: not dominant through physical superiority alone, but through a combination of technique and precision that made opponents feel they were fighting someone operating at a different level.`,
  },
  lamotta_msg_career: {
    id: 'lamotta_msg_career',
    figureId: 'jake_lamotta',
    title: 'The Bronx Bull at the Garden',
    year: 1951,
    venueId: 'msg',
    medium: 'Middleweight Career · Madison Square Garden · 1941–1954',
    dimensions: '83-19-4 career record · World Middleweight Champion 1949–1951',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Jake_LaMotta_signed_photo_postcard_1952.JPG/500px-Jake_LaMotta_signed_photo_postcard_1952.JPG',
    whatToLookFor: [
      'LaMotta was the first boxer to knock down Sugar Ray Robinson — in their second fight, 1943. Robinson still won the decision. LaMotta became defined by his ability to absorb punishment and keep coming.',
      'He won the middleweight championship in 1949 by defeating Marcel Cerdan. He held it until Robinson stopped him in the 13th round of their sixth fight in 1951.',
      'Martin Scorsese\'s Raging Bull (1980), with Robert De Niro, dramatized LaMotta\'s career and his fights at Madison Square Garden. The film won the Oscar for Best Editing and is considered one of the greatest sports films ever made.',
    ],
    description: `Jake LaMotta grew up in the Bronx, fought professionally for thirteen years, and appeared at Madison Square Garden more times than he could count. His nickname was "The Bronx Bull," and it described his style precisely: he walked through punches that dropped other fighters, kept pressing forward, and made opponents pay for every inch of the ring they tried to claim.

He is the only fighter who knocked down Sugar Ray Robinson — the greatest pound-for-pound boxer in history — in their second fight in 1943. Robinson still won the decision. LaMotta lost to Robinson five times in their six fights, but the first time Robinson went to the canvas in a professional bout, it was LaMotta who put him there.

LaMotta won the world middleweight championship in 1949, defeating Marcel Cerdan by TKO. He defended it successfully until Robinson stopped him in the 13th round of their 1951 championship fight — a bout so brutal that the referee stopped it for humanitarian reasons rather than a knockdown.

Martin Scorsese's Raging Bull (1980), filmed in black and white and built around Robert De Niro\'s physical transformation for the role, dramatized LaMotta\'s career and his fights at the Garden. It is considered one of the greatest sports films ever made. LaMotta lived to 95 and became one of the most recognizable figures in boxing history — partly because of the film, partly because of who he actually was.`,
  },
  patterson_johansson_1960: {
    id: 'patterson_johansson_1960',
    figureId: 'floyd_patterson',
    title: 'Patterson vs. Johansson III — March 13, 1961',
    year: 1961,
    venueId: 'msg',
    medium: 'World Heavyweight Championship · Madison Square Garden',
    dimensions: '6 rounds (KO) · Patterson retained title · First trilogy in heavyweight history',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Floyd_Patterson_2_%28cropped%29.jpg/500px-Floyd_Patterson_2_%28cropped%29.jpg',
    whatToLookFor: [
      'Patterson became the first heavyweight champion to regain the title — losing to Johansson in 1959 and winning it back in 1960. The trilogy completed his status as one of the defining heavyweights of his era.',
      'Patterson was from Bedford-Stuyvesant, Brooklyn, and trained at the famous Gramercy Gym in New York. He was a quiet, introspective figure — unusual in a sport that rewarded volume.',
      'His trainer was Cus D\'Amato, who later trained Mike Tyson at the same upstate New York facility. D\'Amato\'s influence on heavyweight boxing — through Patterson and then Tyson — spans four decades.',
    ],
    description: `Floyd Patterson was from Brooklyn. He was the youngest heavyweight champion in history when he won the title in 1956, at age 21. He was quiet, thoughtful, and trained by Cus D'Amato — the tactician who would later, in a different generation, develop Mike Tyson.

Ingemar Johansson knocked Patterson down seven times in the third round of their 1959 championship fight. Patterson regained the title in the 1960 rematch — becoming the first heavyweight champion in history to reclaim the title. The third fight, at Madison Square Garden in 1961, was Patterson's conclusive answer.

He knocked Johansson out in the sixth round.

The trilogy was the first three-fight series in heavyweight championship history. Patterson's place in boxing\'s lineage is significant beyond his titles: D\'Amato\'s methods, developed at the Gramercy Gym in New York, traveled from Patterson to Tyson across thirty years. The continuity runs through New York — through the training gyms, the Garden, the neighborhoods that produced and shaped fighters.

Patterson later became a goodwill ambassador for boxing, an articulate advocate for the sport that had made him, and a complicated figure in the sport's history: supremely talented, often self-critical, and honest in a way that the boxing world rarely rewards.`,
  },

  // ── ARCHITECTURE WORKS (Architectural Features) ─────────────────────────
  chrysler_eagle_gargoyles: {
    id: 'chrysler_eagle_gargoyles',
    venueId: 'chrysler_building',
    figureId: 'william_van_alen',
    title: `Eagle Gargoyles`,
    year: `1930`,
    medium: `Stainless Steel`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Chrysler_Building_by_David_Shankbone.jpg/440px-Chrysler_Building_by_David_Shankbone.jpg',
    description: `The eagle-head gargoyles projecting from the 61st floor are adapted from the 1929 Chrysler radiator cap — Art Deco ornament as brand identity.`,
    significance: `Van Alen used automobile imagery as architectural ornament, transforming Chrysler's product into mythology at the top of the world's tallest building.`,
  },
  chrysler_crown_spire: {
    id: 'chrysler_crown_spire',
    venueId: 'chrysler_building',
    figureId: 'william_van_alen',
    title: `Sunburst Crown and Hidden Spire`,
    year: `1930`,
    medium: `Nirosta Stainless Steel`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Chrysler_Building_by_David_Shankbone.jpg/440px-Chrysler_Building_by_David_Shankbone.jpg',
    description: `The seven radiating arches of the crown, assembled secretly inside the building, were raised through the roof in 90 minutes to claim the world height record from 40 Wall Street.`,
    significance: `Van Alen's competitive gambit — hiding the spire to surprise his rival — is the most dramatic moment in skyscraper history, and the crown itself is Art Deco's defining image.`,
  },
  empire_state_lobby: {
    id: 'empire_state_lobby',
    venueId: 'empire_state',
    figureId: 'william_lamb',
    title: `Art Deco Lobby`,
    year: `1931`,
    medium: `Aluminum, Marble, Murals`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/440px-Empire_State_Building_%28aerial_view%29.jpg',
    description: `The three-story lobby features gilded aluminum ceilings, a stylized wall map of New York State in metalwork, and Art Deco elevator doors with sunburst motifs.`,
    significance: `One of the finest Art Deco interiors in New York, using industrial materials — aluminum, stainless steel — as luxury surfaces.`,
  },
  empire_state_setbacks: {
    id: 'empire_state_setbacks',
    venueId: 'empire_state',
    figureId: 'william_lamb',
    title: `Setback Silhouette`,
    year: `1931`,
    medium: `Limestone and Granite`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/440px-Empire_State_Building_%28aerial_view%29.jpg',
    description: `The building steps back five times as it rises — required by the 1916 Zoning Resolution — creating the tapering profile that has made it the most recognizable skyscraper in the world.`,
    significance: `Shreve, Lamb & Harmon turned a zoning constraint into the defining aesthetic feature of the building and of the entire Art Deco skyscraper typology.`,
  },
  rockefeller_lobby_murals: {
    id: 'rockefeller_lobby_murals',
    venueId: 'rockefeller_center',
    figureId: 'raymond_hood',
    title: `30 Rock Lobby Murals`,
    year: `1933`,
    medium: `Fresco and Oil on Canvas`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/30_Rockefeller_Plaza_%28Comcast_Building%29.jpg/440px-30_Rockefeller_Plaza_%28Comcast_Building%29.jpg',
    description: `Jose Maria Sert's murals, installed after Diego Rivera's controversial original was destroyed at Rockefeller's order, depict human progress through technology.`,
    significance: `The Rivera incident — his refusal to remove Lenin's portrait, Rockefeller's destruction of the finished mural — is the most famous censorship episode in American art history.`,
  },
  rockefeller_sunken_plaza: {
    id: 'rockefeller_sunken_plaza',
    venueId: 'rockefeller_center',
    figureId: 'raymond_hood',
    title: `Channel Gardens and Sunken Plaza`,
    year: `1933`,
    medium: `Stone, Water, Plantings`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/30_Rockefeller_Plaza_%28Comcast_Building%29.jpg/440px-30_Rockefeller_Plaza_%28Comcast_Building%29.jpg',
    description: `The sunken plaza — ice rink in winter, outdoor dining in summer — and the Channel Gardens walkway between the British and French buildings are the finest public outdoor spaces in midtown Manhattan.`,
    significance: `Hood designed public space as a commercial amenity and a civic gift simultaneously, creating a model for urban plazas that has shaped every major development since.`,
  },
  woolworth_lobby: {
    id: 'woolworth_lobby',
    venueId: 'woolworth_building',
    figureId: 'cass_gilbert',
    title: `Gothic Lobby with Byzantine Mosaics`,
    year: `1913`,
    medium: `Marble, Mosaic, Cast Iron`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Woolworth_Building_2013.jpg/440px-Woolworth_Building_2013.jpg',
    description: `The vaulted lobby features a deep blue-green ceiling, walls encrusted with Byzantine-style mosaics, and caricature sculptures of Woolworth and Gilbert in the corbels.`,
    significance: `Gilbert's lobby is among the most opulent interiors of the skyscraper era, demonstrating that Gothic ornament could be applied to a commercial building without irony.`,
  },
  grand_central_main_concourse: {
    id: 'grand_central_main_concourse',
    venueId: 'grand_central_terminal',
    figureId: 'whitney_warren',
    title: `Main Concourse`,
    year: `1913`,
    medium: `Tennessee Marble, Cerulean Plaster`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Image-Grand_central_Station_Outside_Night_2.jpg/440px-Image-Grand_central_Station_Outside_Night_2.jpg',
    description: `275 feet long, 120 feet wide, 125 feet high: the Main Concourse is among the largest interior spaces in the world, with a teal celestial ceiling depicting 2,500 winter stars.`,
    significance: `Warren designed the terminal around the idea that arrival in New York should be a civic and spiritual experience, not merely a transportation transaction.`,
  },
  grand_central_celestial_ceiling: {
    id: 'grand_central_celestial_ceiling',
    venueId: 'grand_central_terminal',
    figureId: 'whitney_warren',
    title: `Celestial Ceiling Mural`,
    year: `1912`,
    medium: `Cerulean Paint, Gilded Stars`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Image-Grand_central_Station_Outside_Night_2.jpg/440px-Image-Grand_central_Station_Outside_Night_2.jpg',
    description: `The zodiac constellations of the winter sky, painted backwards — from God's perspective looking down — on a cerulean ground. 2,500 stars, 60 shown in illuminated gold.`,
    significance: `One of the most famous interiors in the world, and a study in how a single design decision — the scale and the mural — transforms a transit hall into a cathedral.`,
  },
  nypl_rose_reading_room: {
    id: 'nypl_rose_reading_room',
    venueId: 'nypl_schwarzman',
    figureId: 'john_carrere',
    title: `Rose Main Reading Room`,
    year: `1911`,
    medium: `Plaster, Oak, Painted Ceiling`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/New_York_Public_Library_May_2011.jpg/440px-New_York_Public_Library_May_2011.jpg',
    description: `297 feet long, 78 feet wide, with a painted ceiling 52 feet above the floor depicting clouds and sky. The largest public reading room in the world when it opened.`,
    significance: `Carrère and Hastings designed a room that makes the act of reading feel monumental — a democratic palace of knowledge.`,
  },
  nypl_facade_lions: {
    id: 'nypl_facade_lions',
    venueId: 'nypl_schwarzman',
    figureId: 'john_carrere',
    title: `Patience and Fortitude`,
    year: `1911`,
    medium: `Pink Tennessee Marble`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/New_York_Public_Library_May_2011.jpg/440px-New_York_Public_Library_May_2011.jpg',
    description: `The two marble lions flanking the Fifth Avenue entrance were named by Mayor Fiorello La Guardia during the Depression — the virtues New Yorkers would need to survive.`,
    significance: `Among the most beloved pieces of public sculpture in New York, and a symbol of the civic purpose embedded in the building\'s Beaux-Arts ambitions.`,
  },
  flatiron_prow: {
    id: 'flatiron_prow',
    venueId: 'flatiron_building',
    figureId: 'daniel_burnham',
    title: `The Six-Foot Prow`,
    year: `1902`,
    medium: `Limestone and Terra-cotta`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Edificio_Fuller_%28Flatiron%29_en_2010_desde_el_Empire_State_crop_boxin.jpg/440px-Edificio_Fuller_%28Flatiron%29_en_2010_desde_el_Empire_State_crop_boxin.jpg',
    description: `The southern tip of the building is six feet wide — the narrowest occupied skyscraper facade in New York — and terminates in a curved limestone prow detailed with Renaissance ornament.`,
    significance: `Burnham proved that the steel-frame system could produce something beautiful regardless of lot shape, fundamentally changing how architects thought about skyscraper design.`,
  },
  st_patricks_rose_window: {
    id: 'st_patricks_rose_window',
    venueId: 'st_patricks',
    figureId: 'james_renwick_jr',
    title: `Great Rose Window`,
    year: `1879`,
    medium: `Stained Glass, Stone Tracery`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/At_New_York%2C_USA_2017_119.jpg/440px-At_New_York%2C_USA_2017_119.jpg',
    description: `26 feet in diameter, the rose window above the main entrance transforms the Fifth Avenue facade. Renwick designed the stone tracery; the glass was made in Innsbruck, Austria.`,
    significance: `The window demonstrates Renwick's mastery of Gothic structural logic: the tracery distributes the window's load while creating the pattern that defines the facade.`,
  },
  brooklyn_bridge_promenade: {
    id: 'brooklyn_bridge_promenade',
    venueId: 'brooklyn_bridge_arch',
    figureId: 'john_roebling',
    title: `Pedestrian Promenade`,
    year: `1883`,
    medium: `Wood, Steel Cable, Granite`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Brooklyn_Bridge_Manhattan.jpg/440px-Brooklyn_Bridge_Manhattan.jpg',
    description: `The elevated central walkway above the roadway offers unobstructed views of the Manhattan skyline and the harbor. Roebling designed the promenade to be the social spine of the bridge.`,
    significance: `Walking the bridge is among the finest urban experiences available anywhere — the views, the scale of the cables, the sound of the traffic below, the approach to both cities.`,
  },
  brooklyn_bridge_towers: {
    id: 'brooklyn_bridge_towers',
    venueId: 'brooklyn_bridge_arch',
    figureId: 'john_roebling',
    title: `Gothic Granite Towers`,
    year: `1876`,
    medium: `Limestone and Granite`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Brooklyn_Bridge_Manhattan.jpg/440px-Brooklyn_Bridge_Manhattan.jpg',
    description: `The two 276-foot towers, faced in limestone and Rosendale cement, use pointed Gothic arches for the roadway openings — engineering logic expressed as architectural tradition.`,
    significance: `Roebling chose Gothic not as decoration but as the correct structural form: the pointed arch transmits loads more efficiently than a round one, making the aesthetic choice an engineering argument.`,
  },
  seagram_plaza: {
    id: 'seagram_plaza',
    venueId: 'seagram_building',
    figureId: 'mies_van_der_rohe',
    title: `Park Avenue Forecourt`,
    year: `1958`,
    medium: `Travertine, Granite, Bronze`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Seagram_Building_%2835098307116%29.jpg/440px-Seagram_Building_%2835098307116%29.jpg',
    description: `The 90-foot setback from Park Avenue — voluntarily sacrificed prime real estate — creates a travertine plaza with two reflecting pools that give the tower room to breathe.`,
    significance: `Mies demonstrated that the finest urban gesture a building can make is simply to give space back to the city. New York subsequently required plazas in exchange for additional building height.`,
  },
  seagram_bronze_facade: {
    id: 'seagram_bronze_facade',
    venueId: 'seagram_building',
    figureId: 'mies_van_der_rohe',
    title: `Bronze and Amber Glass Facade`,
    year: `1958`,
    medium: `Bronze I-beams, Amber Glass`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Seagram_Building_%2835098307116%29.jpg/440px-Seagram_Building_%2835098307116%29.jpg',
    description: `The non-structural bronze I-beams applied to the exterior surface make the internal steel skeleton visible — a principle Mies called "honest construction."`,
    significance: `The most influential building facade of the 20th century, establishing the visual language of corporate modernism that still dominates city skylines worldwide.`,
  },
  high_line_rail_preservation: {
    id: 'high_line_rail_preservation',
    venueId: 'high_line',
    figureId: 'elizabeth_diller',
    title: `Preserved Rail Infrastructure`,
    year: `2009`,
    medium: `Steel Rail, Concrete, Native Plantings`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/High_Line_Park%2C_Section_1a.jpg/440px-High_Line_Park%2C_Section_1a.jpg',
    description: `The original 1930s freight rail tracks are preserved throughout the park, with paving stones threaded between them and native meadow plantings growing in the rail beds.`,
    significance: `Diller Scofidio + Renfro established the principle that industrial infrastructure has aesthetic value — a philosophy that has transformed how cities think about abandoned infrastructure worldwide.`,
  },

  // ── THEATER WORKS (Productions) ─────────────────────────────────────────
  oklahoma_1943: {
    id: 'oklahoma_1943',
    venueId: 'st_james_theatre',
    figureId: 'richard_rodgers',
    title: `Oklahoma!`,
    year: `1943`,
    medium: `Musical`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/St_James_Theatre_-_Frozen_%2848296062327%29.jpg/440px-St_James_Theatre_-_Frozen_%2848296062327%29.jpg',
    description: `Rodgers and Hammerstein's first collaboration, opened at the St. James on March 31, 1943. It ran 2,212 performances — and invented the modern musical by making every song advance the plot and every dance express character.`,
    significance: `Oklahoma! established the template for the integrated musical — the form in which song, dance, and book work together rather than interrupting each other. Every significant musical since 1943 has operated within or against the framework Rodgers and Hammerstein established here.`,
    currentlyRunning: false,
  },
  south_pacific_1949: {
    id: 'south_pacific_1949',
    venueId: 'majestic_theatre',
    figureId: 'richard_rodgers',
    title: `South Pacific`,
    year: `1949`,
    medium: `Musical`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Majestic_Theatre_-_NYC_%2852302522949%29.jpg/440px-Majestic_Theatre_-_NYC_%2852302522949%29.jpg',
    description: `South Pacific opened at the Majestic in April 1949 and confronted American racial prejudice directly: one of its central arguments is that hatred is learned, not innate. "You've Got to Be Carefully Taught" was the most controversial song on Broadway in 1949.`,
    significance: `One of the first major American musicals to make racial justice its explicit subject. Rogers and Hammerstein were warned the number would sink the show; they refused to cut it.`,
    currentlyRunning: false,
  },
  company_1970: {
    id: 'company_1970',
    venueId: 'shubert_theatre',
    figureId: 'stephen_sondheim',
    title: `Company`,
    year: `1970`,
    medium: `Musical`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Shubert_Theatre.jpg/440px-Shubert_Theatre.jpg',
    description: `Company opened April 26, 1970 at the Alvin Theatre (now the Neil Simon) and has since had its most celebrated revival at the Shubert. Sondheim's score established the concept musical — organized around theme rather than linear plot — as Broadway's most intellectually serious form.`,
    significance: `Company made ambivalence the emotional keynote of a musical for the first time. Its subject — the fear of intimacy and commitment in modern city life — had never been addressed in a major Broadway production.`,
    currentlyRunning: false,
  },

  carousel_1945: {
    id: 'carousel_1945',
    venueId: 'majestic_theatre',
    figureId: 'richard_rodgers',
    topicId: 'theater_musicals',
    title: `Carousel`,
    year: `1945`,
    medium: `Musical`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Majestic_Theatre_at_245_W_44th_St_%2847773617232%29_%28cropped%29.jpg/440px-Majestic_Theatre_at_245_W_44th_St_%2847773617232%29_%28cropped%29.jpg',
    description: `Carousel opened at the Majestic on April 19, 1945. Rodgers and Hammerstein's second collaboration — and arguably their most ambitious. "If I Loved You" and "You'll Never Walk Alone" premiered here.`,
    significance: `Carousel pushed the integrated musical further than Oklahoma! had — its dark subject matter (a doomed protagonist, domestic violence, death) proved that the form could carry genuine tragedy. Sondheim called it the greatest American musical ever written.`,
    currentlyRunning: false,
  },
  gypsy_1959: {
    id: 'gypsy_1959',
    venueId: 'imperial_theatre',
    figureId: 'stephen_sondheim',
    title: `Gypsy`,
    year: `1959`,
    medium: `Musical`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ImperialTheatreNYC.jpg/440px-ImperialTheatreNYC.jpg',
    description: `Gypsy opened at the Imperial in May 1959 with Ethel Merman delivering what critics have called the greatest performance in Broadway history. Sondheim wrote the lyrics; Jule Styne composed the music. The score includes "Everything's Coming Up Roses" and "Rose's Turn."`,
    significance: `Gypsy is considered the summit of the classic Broadway musical form. Its protagonist, Mama Rose, is the most psychologically complex character written for the Broadway stage up to that point — a monster who is also completely comprehensible.`,
    currentlyRunning: false,
  },
  hamilton_2015: {
    id: 'hamilton_2015',
    venueId: 'richard_rodgers_theatre',
    figureId: 'lin_manuel_miranda',
    title: `Hamilton`,
    year: `2015`,
    medium: `Musical`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Rodgers_Theater_-_Hamilton_%2848193460677%29.jpg/440px-Rodgers_Theater_-_Hamilton_%2848193460677%29.jpg',
    description: `Hamilton opened at the Richard Rodgers on August 6, 2015, won 11 Tony Awards and the Pulitzer Prize, and has generated more cultural commentary than any other Broadway production in decades. Lin-Manuel Miranda wrote the book, music, and lyrics, and originated the title role.`,
    significance: `Hamilton reconfigured what Broadway could be: a hip-hop musical about the Founding Fathers, cast entirely with actors of color, that became both a commercial phenomenon and a genuine cultural argument about whose stories get told and how.`,
    currentlyRunning: true,
  },
  in_the_heights_public: {
    id: 'in_the_heights_public',
    venueId: 'public_theater',
    figureId: 'lin_manuel_miranda',
    title: `In the Heights (Workshop)`,
    year: `2007`,
    medium: `Musical (Workshop)`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/The_Public_Theater_%2848072652481%29.jpg/440px-The_Public_Theater_%2848072652481%29.jpg',
    description: `In the Heights developed at the Public Theater before its 2008 Broadway transfer to the 37 Arts Theatre. Miranda's celebration of Washington Heights — a Dominican-American neighborhood in upper Manhattan — established his voice and set the template for the path Hamilton would follow.`,
    significance: `In the Heights proved that a musical centered on a Latino community, sung in Spanish and English, mixing salsa and hip-hop, could reach Broadway. It made Miranda's reputation and opened the door for Hamilton.`,
    currentlyRunning: false,
  },
  death_salesman_revival: {
    id: 'death_salesman_revival',
    venueId: 'public_theater',
    figureId: 'arthur_miller',
    title: `Death of a Salesman`,
    year: `1949`,
    medium: `Play`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/The_Public_Theater_%2848072652481%29.jpg/440px-The_Public_Theater_%2848072652481%29.jpg',
    description: `Originally opened at the Morosco Theatre in February 1949 with Lee J. Cobb as Willy Loman and directed by Elia Kazan. The Public Theater has mounted major revivals, and the play has never left the Broadway repertoire. It won the Pulitzer Prize and the Tony in its premiere season.`,
    significance: `Death of a Salesman is the great American play. It is about Willy Loman, and it is about capitalism, and these are the same thing. Every revival confirms that Miller's diagnosis of the American dream's self-destruction has not expired.`,
    currentlyRunning: false,
  },
  streetcar_1947: {
    id: 'streetcar_1947',
    venueId: 'shubert_theatre',
    figureId: 'tennessee_williams',
    title: `A Streetcar Named Desire`,
    year: `1947`,
    medium: `Play`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Shubert_Theatre.jpg/440px-Shubert_Theatre.jpg',
    description: `Tennessee Williams's masterpiece opened on Broadway on December 3, 1947, directed by Elia Kazan with Marlon Brando as Stanley Kowalski. The Shubert Organization has produced multiple Broadway revivals — the play is considered the definitive American drama of the 20th century.`,
    significance: `Streetcar changed what American drama was allowed to be about. Its frank portrayal of sexual desire, mental illness, and class anxiety was unprecedented on the commercial stage. Elia Kazan's direction and Brando's performance created American Method acting in the same production.`,
    currentlyRunning: false,
  },
  fences_1987: {
    id: 'fences_1987',
    venueId: 'public_theater',
    figureId: 'august_wilson',
    title: `Fences`,
    year: `1987`,
    medium: `Play`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/The_Public_Theater_%2848072652481%29.jpg/440px-The_Public_Theater_%2848072652481%29.jpg',
    description: `Fences tells the story of Troy Maxson, a Black Pittsburgh garbage collector and former Negro League baseball player, and his family in the 1950s. James Earl Jones originated Troy on Broadway. The play won the Pulitzer Prize and the Tony Award for Best Play.`,
    significance: `Fences is the fourth play in August Wilson's Pittsburgh Cycle — ten plays covering each decade of the 20th century in the Black American experience. It is the most widely produced play in Wilson's cycle and the most accessible entry point into one of the most sustained dramatic projects in American theater.`,
    currentlyRunning: false,
  },
  raisin_in_sun_1959: {
    id: 'raisin_in_sun_1959',
    venueId: 'shubert_theatre',
    figureId: 'lorraine_hansberry',
    title: `A Raisin in the Sun`,
    year: `1959`,
    medium: `Play`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Shubert_Theatre.jpg/440px-Shubert_Theatre.jpg',
    description: `Lorraine Hansberry's landmark play opened on Broadway on March 11, 1959 — the first play by a Black woman to reach Broadway. The Shubert Organization has mounted celebrated revivals at its Broadway houses, cementing the play's place in the American canon.`,
    significance: `Raisin made history at its premiere: the first Black-directed major Broadway production (Lloyd Richards), Sidney Poitier's star-making performance, and a text about a Black family's right to live where they choose that was immediately recognized as a defining American play.`,
    currentlyRunning: false,
  },

  // ── HISTORY WORKS (Historical Events) ───────────────────────────────────
  washington_inauguration_1789: {
    id: 'washington_inauguration_1789',
    venueId: 'federal_hall',
    figureId: 'george_washington',
    title: `First Presidential Inauguration`,
    year: `1789`,
    medium: `Historical Event`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Federal_Hall_%2848126566178%29.jpg/440px-Federal_Hall_%2848126566178%29.jpg',
    description: `On April 30, 1789, George Washington stood on the balcony of the original Federal Hall and took the first presidential oath of office. John Adams was sworn in as Vice President. The new government of the United States formally began.`,
    significance: `Washington's decision to take the oath, serve two terms, and then relinquish power was the act that made American democracy possible. Every subsequent peaceful transfer of power descends from the precedent set on this balcony.`,
  },
  hamiltons_financial_plan: {
    id: 'hamiltons_financial_plan',
    venueId: 'federal_hall',
    figureId: 'alexander_hamilton',
    title: `Report on Public Credit`,
    year: `1790`,
    medium: `Policy Document`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Federal_Hall_%2848126566178%29.jpg/440px-Federal_Hall_%2848126566178%29.jpg',
    description: `On January 9, 1790, Treasury Secretary Hamilton presented his Report on Public Credit to Congress, meeting in Federal Hall. He proposed that the new federal government assume all state debts from the Revolutionary War — a move that established federal financial authority and created the foundation of American capitalism.`,
    significance: `Hamilton's financial system — the assumption of state debts, the creation of a national bank, the funding of the national debt at face value — created the credit that made American economic development possible. The debate it triggered nearly broke the new country.`,
  },
  washington_farewell_1783: {
    id: 'washington_farewell_1783',
    venueId: 'fraunces_tavern',
    figureId: 'george_washington',
    title: `Farewell to His Officers`,
    year: `1783`,
    medium: `Historical Event`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Frauncestavern.JPG/440px-Frauncestavern.JPG',
    description: `On December 4, 1783, Washington gathered his officers in the Long Room at Fraunces Tavern and said goodbye. He was resigning his military commission, despite having the power and the support to take whatever title he wished. "With a heart full of love and gratitude," he told them, "I now take leave of you."`,
    significance: `By choosing to go home rather than seize power, Washington established the principle of civilian control of the military that has defined American democracy. King George III, when told Washington would resign, reportedly said: "If he does that, he will be the greatest man in the world."`,
  },
  how_the_other_half_lives_1890: {
    id: 'how_the_other_half_lives_1890',
    venueId: 'tenement_museum',
    figureId: 'jacob_riis',
    title: `How the Other Half Lives`,
    year: `1890`,
    medium: `Book & Photography`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Jacob_Riis_2.jpg/440px-Jacob_Riis_2.jpg',
    description: `Jacob Riis's 1890 book documented life in New York's Lower East Side tenements with unprecedented photographic detail, using magnesium flash powder to illuminate interiors that had never been photographed. The conditions he exposed — twelve people in a single room, no ventilation, no plumbing — shocked readers who had never entered a tenement.`,
    significance: `How the Other Half Lives is the founding document of American photojournalism and the first major work to use images as instruments of social reform. Theodore Roosevelt, after reading it, contacted Riis and began a decade-long collaboration on housing reform legislation.`,
  },
  stonewall_uprising_1969: {
    id: 'stonewall_uprising_1969',
    venueId: 'stonewall_inn',
    figureId: 'marsha_p_johnson',
    title: `The Stonewall Uprising`,
    year: `1969`,
    medium: `Historical Event`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Stonewall_Inn_5_pride_weekend_2016.jpg/440px-Stonewall_Inn_5_pride_weekend_2016.jpg',
    description: `In the early hours of June 28, 1969, police raided the Stonewall Inn — a routine occurrence. This time, the patrons fought back. The uprising lasted several nights. Within months, the Gay Liberation Front had formed. Within a year, the first gay pride marches had taken place in New York and Los Angeles.`,
    significance: `The Stonewall uprising is the event that launched the modern LGBTQ+ rights movement. Marsha P. Johnson and Sylvia Rivera were among the most prominent figures of the resistance. The uprising transformed a community's response to persecution from acquiescence to organized political action.`,
  },
  chisholm_1972_campaign: {
    id: 'chisholm_1972_campaign',
    venueId: 'schomburg_center',
    figureId: 'shirley_chisholm',
    title: `The 1972 Presidential Campaign`,
    year: `1972`,
    medium: `Political Campaign`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Shirley_Chisholm.jpg/440px-Shirley_Chisholm.jpg',
    description: `In 1972, Shirley Chisholm — the first Black woman elected to Congress — ran for the Democratic Party presidential nomination. "Unbought and Unbossed," her slogan, was also her governing philosophy. She won 152 delegate votes at the Democratic National Convention.`,
    significance: `Chisholm's campaign was the first by a Black person or a woman for a major party presidential nomination. She forced both the Democratic Party and the country to confront who was allowed to seek the highest office.`,
  },




  // ── Hip-Hop ──────────────────────────────────────────────────────────────
  rappers_delight: {
    id: 'rappers_delight',
    topicId: 'bronx_origins',
    title: `Rapper's Delight`,
    artist: 'Sugarhill Gang',
    year: 1979,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Rapper%27s_Delight_%28Long_version%29_by_Sugarhill_Gang_US_12-inch_vinyl_red_label.png',
    tagline: `The song that introduced hip-hop to the world.`,
    description: `The first hip-hop song to reach the Billboard Top 40, "Rapper's Delight" introduced the genre to mainstream America in 1979. Released by Sugar Hill Records in Englewood, New Jersey, but built entirely on the sounds and culture forged in the South Bronx — the bassline sampled from Chic's "Good Times," the flow lifted from the park-jam style Kool Herc had developed. It was heard by millions of people who had never been to a Bronx block party, and they understood immediately that something new had arrived.`,
    significance: 'First hip-hop song to chart nationally, introducing the genre to mainstream America',
    medium: 'Single',
    venueId: 'universal_hip_hop_museum',
    figureId: null,
  },
  the_message_hh: {
    id: 'the_message_hh',
    topicId: 'bronx_origins',
    title: 'The Message',
    artist: 'Grandmaster Flash & the Furious Five',
    year: 1982,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/6/61/Grandmaster_Flash_%26_the_Furious_Five-The_Message_%28album_cover%29.jpg',
    tagline: `"Don't push me 'cause I'm close to the edge."`,
    description: `The first great social commentary in hip-hop, "The Message" described life in the South Bronx with a specificity and urgency that nothing before it had captured. Melle Mel wrote verses that documented the desperation of the streets — the broken glass, the junkies, the pressure — and Grandmaster Flash's production wrapped it in music that felt as claustrophobic as the conditions it described. It transformed hip-hop from party music into a vehicle for witness. Every rapper who ever described their neighborhood honestly owes something to this record.`,
    significance: 'Transformed hip-hop from party music into social commentary',
    medium: 'Single',
    venueId: 'one_five_two_zero',
    figureId: 'grandmaster_flash',
  },
  raising_hell: {
    id: 'raising_hell',
    topicId: 'golden_age_hiphop',
    title: 'Raising Hell',
    artist: 'Run-DMC',
    year: 1986,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Run-DMC_in_1986.jpg',
    tagline: `The album that broke hip-hop into mainstream rock culture.`,
    description: `Produced by Rick Rubin and Russell Simmons, Raising Hell was the first hip-hop album to go platinum and the first to crack the mainstream rock audience. The collaboration with Aerosmith on "Walk This Way" — using the original band, rerecording the song as a genuine fusion — was the moment rap crossed permanently into the American mainstream. Run-DMC did it in Adidas and black hats, without compromising an inch of their identity, which made the achievement more remarkable.`,
    significance: 'First hip-hop album to go platinum; broke the genre into mainstream rock culture',
    medium: 'Album',
    venueId: 'hollis_queens',
    figureId: 'run_dmc',
  },
  paid_in_full: {
    id: 'paid_in_full',
    topicId: 'golden_age_hiphop',
    title: 'Paid in Full',
    artist: 'Eric B. & Rakim',
    year: 1987,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Eric_B_%26_Rakim_press_photo_1987.jpg',
    tagline: `Rakim redefined what an MC could be.`,
    description: `On Paid in Full, Rakim introduced internal rhyme schemes, multisyllabic flows, and a philosophical cool that set a new permanent standard for lyrical technique. Where previous MCs had rhymed end words, Rakim rhymed within lines, building structures of astonishing complexity delivered with total ease. He was 19 years old. Hip-hop had found its first undisputed virtuoso — the MC who all subsequent MCs would be measured against.`,
    significance: 'Established the lyrical standard that all subsequent hip-hop has been measured against',
    medium: 'Album',
    venueId: 'apollo_theater_hh',
    figureId: 'rakim',
  },
  low_end_theory: {
    id: 'low_end_theory',
    topicId: 'golden_age_hiphop',
    title: 'The Low End Theory',
    artist: 'A Tribe Called Quest',
    year: 1991,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/ATribeCalledQuestTheLowEndtheory.jpg',
    tagline: `The album that proved hip-hop and jazz were the same music.`,
    description: `A Tribe Called Quest built The Low End Theory around double-bass lines and bebop samples, then laid Q-Tip\'s effortless rhymes over the top. Light where everything else was dark, warm where everything else was cold, jazz-inflected where everything else was drum-machine hard. The Native Tongues collective — Tribe, De La Soul, the Jungle Brothers — sought a positive Afrocentric alternative to the hardening of rap, and on this album they achieved it. Every alternative rap record made since owes this album a debt.`,
    significance: 'Pioneered jazz-rap fusion and defined the alternative hip-hop tradition',
    medium: 'Album',
    venueId: 'rucker_park',
    figureId: 'a_tribe_called_quest',
  },
  enter_wu_tang: {
    id: 'enter_wu_tang',
    topicId: 'wu_tang',
    title: 'Enter the Wu-Tang (36 Chambers)',
    artist: 'Wu-Tang Clan',
    year: 1993,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Wu-TangClanEntertheWu-Tangalbumcover.jpg',
    tagline: `Nine MCs from Staten Island who created the blueprint for underground hip-hop.`,
    description: `Recorded in the RZA\'s basement in Staten Island for almost no money, Enter the Wu-Tang created an entirely new aesthetic: raw, kung-fu-obsessed, philosophically dense, produced from stripped-down drums and soul samples. The RZA\'s production removed everything unnecessary and left only the essential — the beat, the voice, the idea. Nine MCs brought nine different personalities and styles to the same record, and the chaos of it was exactly the point. No one sounded like this before, and everyone who came after had to reckon with it.`,
    significance: 'Created the blueprint for underground hip-hop and sample-based production',
    medium: 'Album',
    venueId: 'park_hill_staten_island',
    figureId: 'wu_tang_clan',
  },
  ready_to_die: {
    id: 'ready_to_die',
    topicId: 'brooklyn_voice',
    title: 'Ready to Die',
    artist: 'The Notorious B.I.G.',
    year: 1994,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/97/Ready_To_Die.jpg',
    tagline: `Brooklyn's voice. Twenty-two years old. Undeniable.`,
    description: `Born from the streets of Bedford-Stuyvesant and Clinton Hill, Ready to Die told the story of a young Black man navigating poverty, crime, and ambition in New York with a cinematic specificity that was entirely new. Biggie's storytelling was darkly funny, devastating, and architecturally brilliant — his verses constructed like short films, each detail chosen, each punchline earned. Produced by Sean Combs and a roster of New York's best beatmakers, the album defined East Coast hip-hop for a decade. He was 22 years old.`,
    significance: 'Defined East Coast hip-hop in the 1990s; one of the greatest debut albums ever made',
    medium: 'Album',
    venueId: 'biggie_mural',
    figureId: 'notorious_big',
  },
  illmatic: {
    id: 'illmatic',
    topicId: 'queensbridge',
    title: 'Illmatic',
    artist: 'Nas',
    year: 1994,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/2/27/IllmaticNas.jpg',
    tagline: `Ten tracks. Thirty-nine minutes. The greatest hip-hop album ever made.`,
    description: `Nas was 20 years old, raised in the Queensbridge Houses, and he turned that specific geography — the handball courts, the stairwells, the Queensboro Bridge, the smell of a summer afternoon in the projects — into something universal. Every track on Illmatic is essential. The production — DJ Premier, Pete Rock, Large Professor, Q-Tip, L.E.S. — represents the pinnacle of New York boom-bap. And Nas\'s voice floats over it with a composure that sounds impossible for someone his age. Twenty years later, critics still argue about whether anything has equaled it.`,
    significance: 'Widely considered the greatest hip-hop album ever made',
    medium: 'Album',
    venueId: 'queensbridge_houses',
    figureId: 'nas',
  },

  // ── ADDITIONAL JAZZ WORKS ─────────────────────────────────────────────────

  // Coltrane
  coltrane_giant_steps: {
    id: 'coltrane_giant_steps',
    figureId: 'coltrane',
    title: 'Giant Steps',
    year: 1960,
    venueId: 'village_vanguard',
    medium: 'Studio album · Atlantic Records',
    dimensions: 'John Coltrane (tenor sax), Tommy Flanagan / Cedar Walton / Wynton Kelly (piano), Paul Chambers (bass), Art Taylor / Lex Humphries (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/John_Coltrane_1963_cropped_ver2.jpg/330px-John_Coltrane_1963_cropped_ver2.jpg',
    whatToLookFor: [
      `The harmonic system at the core of the title track: Coltrane divided the octave into three equal parts — moving from B major to G major to Eb major, three keys exactly four semitones apart. No one had done this systematically before. It forced the improviser to think harmonically rather than following chord changes, because the changes moved too fast for conventional patterns.`,
      `Tommy Flanagan's piano solo on the title track: he had never seen the changes before the session, and it shows. He struggles, finding some but not all of the shifts. The struggle is humanizing — it illustrates precisely how difficult what Coltrane was doing actually was. Flanagan came back years later and recorded it perfectly. The original is more honest.`,
      `The ballads against the velocity: "Naima," written for Coltrane's first wife, is one of the most beautiful ballads in jazz — a static, suspended harmony that barely moves, the opposite of the title track's hyper-motion. Coltrane was always exploring both extremes simultaneously.`,
    ],
    description: `Giant Steps, recorded in 1959 and released in 1960, is where John Coltrane introduced "Coltrane changes" to jazz — a harmonic system based on equal division of the octave into three parts rather than the circle of fifths. The title track's chord progression moved so fast and in such unexpected directions that even accomplished pianists struggled to follow it in real time. It was a complete reimagining of how jazz harmony could work. Coltrane would use this system as a foundation and then spend the next seven years building an entirely different superstructure on top of it.`,
  },

  coltrane_my_favorite: {
    id: 'coltrane_my_favorite',
    figureId: 'coltrane',
    title: 'My Favorite Things',
    year: 1961,
    venueId: 'village_vanguard',
    medium: 'Studio album · Atlantic Records',
    dimensions: 'John Coltrane (soprano/tenor sax), McCoy Tyner (piano), Steve Davis (bass), Elvin Jones (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/John_Coltrane_1963_cropped_ver2.jpg/330px-John_Coltrane_1963_cropped_ver2.jpg',
    whatToLookFor: [
      `The soprano saxophone: Coltrane had just picked it up, influenced by hearing the instrument in Indian and North African music. The sound is thinner, more nasal than the tenor, capable of a kind of keening intensity that suited the Eastern-influenced direction he was heading. He would use it interchangeably with the tenor for the rest of his career.`,
      `The modal vamp structure: the title track is built over a repeating two-bar vamp rather than cycling through changes. This gives the soloists an enormous amount of harmonic space — the music breathes and expands rather than rushing through a fixed sequence. This approach, derived partly from Miles Davis's Kind of Blue, became central to Coltrane's "classic quartet" period.`,
      `The fourteen-minute playing time: the original Rogers and Hammerstein song is three minutes. Coltrane's version treats the melody as a launching pad for extended modal exploration. Each instrument gets space to develop its own statement. The structure is open without being formless — the head appears at the start and end to frame the improvisation.`,
    ],
    description: `John Coltrane's transformation of a show tune into a fourteen-minute modal exploration became his signature piece. Recorded in October 1960, My Favorite Things announced the classic quartet that would record A Love Supreme four years later — Tyner's modal harmonies, Jones's layered drumming, and Coltrane's newly acquired soprano saxophone creating a sound no one had heard before. The album became his best-selling record and the vehicle through which general audiences discovered what he was doing. It remains one of the most accessible entry points into his work.`,
  },

  coltrane_blue_train: {
    id: 'coltrane_blue_train',
    figureId: 'coltrane',
    title: 'Blue Train',
    year: 1957,
    venueId: 'blue_note',
    medium: 'Studio album · Blue Note Records',
    dimensions: 'John Coltrane (tenor sax), Lee Morgan (trumpet), Curtis Fuller (trombone), Kenny Drew (piano), Paul Chambers (bass), Philly Joe Jones (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/John_Coltrane_1963_cropped_ver2.jpg/330px-John_Coltrane_1963_cropped_ver2.jpg',
    whatToLookFor: [
      `Coltrane's tone in 1957: richer and more conventional than his later work, still deep in the tradition he was about to transform. You can hear both what he had already mastered and the edges of something larger pressing against it. The "sheets of sound" approach — cascading runs of notes filling every available space — is present but hasn't yet taken over the architecture entirely.`,
      `The title track's blues structure: twelve bars, standard form, played by a frontline of two horns and trombone in a configuration that echoes the hard bop of the period. What Coltrane does with those twelve bars — the density of ideas, the harmonic implications he finds inside a simple blues — points directly toward what was coming.`,
      `Lee Morgan at 19: this is almost simultaneously with his work on Moanin' (recorded the same year). The contrast is instructive — Morgan with Blakey is more extroverted, more anthemic; Morgan behind Coltrane has to find a different role, more complementary, and he does it completely. Young musicians hearing great musicians play each other.`,
    ],
    description: `Blue Train is Coltrane's only recording as a leader for Blue Note Records — he was under contract to Prestige and could only make one session for the label. That single session produced one of his finest recordings from his pre-Atlantic period. Recorded in September 1957, it captures him at a pivotal moment: sufficiently recovered from his 1957 spiritual crisis (documented in A Love Supreme's liner notes) to play with renewed purpose, but still working in the hard bop tradition before his modal explorations fully took hold. The personnel — Lee Morgan, Curtis Fuller, Kenny Drew — were the best young voices in jazz. Coltrane was 31 and the senior figure in the room.`,
  },

  // Miles Davis
  miles_kind_of_blue: {
    id: 'miles_kind_of_blue',
    figureId: 'miles_davis',
    title: 'Kind of Blue',
    year: 1959,
    venueId: 'village_vanguard',
    medium: 'Studio album · Columbia Records',
    dimensions: 'Miles Davis (trumpet), John Coltrane (tenor sax), Cannonball Adderley (alto sax), Bill Evans / Wynton Kelly (piano), Paul Chambers (bass), Jimmy Cobb (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Miles_Davis_by_Palumbo_cropped.jpg/330px-Miles_Davis_by_Palumbo_cropped.jpg',
    whatToLookFor: [
      `The modal structure: most of the album's pieces are built on scales rather than chord progressions. Instead of moving through a cycle of chords, the musicians improvise on a single scale for an extended period. This gives the soloists enormous harmonic freedom and creates the album's characteristic floating, suspended quality. Miles gave the musicians the scales but minimal additional instruction.`,
      `Bill Evans's piano: he had just rejoined the band after a brief departure, and his influence on the album's conception was enormous. His impressionistic voicings, borrowed from Ravel and Debussy, gave the rhythm section an ambiguity that supported the modal approach. His liner notes to the album remain the best explanation of what Kind of Blue was attempting.`,
      `"So What": two chords, sixteen bars each. The head is a call-and-response between bass and horns. Then solos over those two static harmonies for as long as each player needs. The simplicity is deceptive — within the framework, each musician reveals everything they know about melody, rhythm, and space. Miles solos first and plays forty seconds. Coltrane follows and takes twice as long to say something equally complete.`,
    ],
    description: `Kind of Blue, recorded in two sessions in March and April 1959, is the best-selling jazz album of all time — and possibly the most important. Miles Davis assembled the finest working group in jazz, gave them modal frameworks rather than chord changes, and let them improvise their way into a new language. The album launched modal jazz and ended the dominance of bebop's harmonic complexity. Every musician on it was already distinguished; this session made them legendary. It has never been out of print and never stopped being the entry point for listeners hearing jazz for the first time.`,
  },

  miles_bitches_brew: {
    id: 'miles_bitches_brew',
    figureId: 'miles_davis',
    title: 'Bitches Brew',
    year: 1970,
    venueId: 'village_vanguard',
    medium: 'Double studio album · Columbia Records',
    dimensions: 'Miles Davis (trumpet), Wayne Shorter, Bennie Maupin (woodwinds), Chick Corea, Joe Zawinul, Larry Young (keyboards), John McLaughlin (guitar), Dave Holland, Harvey Brooks (bass), Jack DeJohnette, Lenny White, Billy Cobham (drums/percussion)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Miles_Davis_by_Palumbo_cropped.jpg/330px-Miles_Davis_by_Palumbo_cropped.jpg',
    whatToLookFor: [
      `The texture: two or three electric keyboards playing simultaneously, two or three basses, multiple percussionists, electric guitar — all improvising around a loose structure. The sound is dense, opaque, rhythmically complex in a way that doesn't resolve into a regular beat. Miles described it as music for the new generation who had been raised on rock but wanted something more. It was.`,
      `The editing: producer Teo Macero cut together recordings from multiple sessions, reversing tapes, looping sections, treating the recordings as raw material for a constructed artifact rather than a captured performance. This was studio work as composition, before anyone else in jazz was doing it. The techniques wouldn't become widespread until hip-hop producers rediscovered them twenty years later.`,
      `Miles's trumpet in the mix: thinner, more electronic-sounding than his acoustic work, processed and echoed in ways that make it sound like another keyboard as often as a brass instrument. He was deliberately erasing the boundary between acoustic and electric, between jazz and rock, between composition and improvisation. He succeeded so completely that the music still sounds like nothing else.`,
    ],
    description: `Bitches Brew, recorded in August 1969 and released in 1970, launched jazz-rock fusion and simultaneously ended Miles Davis's acoustic period. The double album assembled a large group — three keyboards, two basses, three drums/percussionists, multiple wind players — and recorded over three days in the studio, with producer Teo Macero assembling the released tracks from edited segments. Miles had heard Sly Stone, Jimi Hendrix, and James Brown, and wanted to combine their rhythmic energy with jazz's harmonic sophistication. The result sold 400,000 copies in its first year, more than any previous jazz record, and made Miles Davis the only jazz musician ever to successfully lead a rock audience.`,
  },

  miles_in_silent_way: {
    id: 'miles_in_silent_way',
    figureId: 'miles_davis',
    title: 'In a Silent Way',
    year: 1969,
    venueId: 'village_vanguard',
    medium: 'Studio album · Columbia Records',
    dimensions: 'Miles Davis (trumpet), Wayne Shorter (soprano sax), John McLaughlin (guitar), Chick Corea, Herbie Hancock, Joe Zawinul (keyboards), Dave Holland (bass), Tony Williams (drums)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Miles_Davis_by_Palumbo_cropped.jpg/330px-Miles_Davis_by_Palumbo_cropped.jpg',
    whatToLookFor: [
      `The transformation from session to record: Miles and producer Teo Macero took the original recordings and restructured them — repeating sections, editing out sections, using a fade from "Shhh/Peaceful" as the opening of the album. The released record is a construction, not a documentation of what happened in the studio. This approach to record-making as composition would define Bitches Brew a year later.`,
      `Joe Zawinul's title piece: originally written as a gentle European folk-influenced melody, Miles stripped out most of the chords and left just a vamp, creating the hypnotic suspended quality at the album's center. Zawinul, who co-founded Weather Report two years later, had understood something about how to create trance-like spaces in jazz that would become central to the fusion era.`,
      `The moment at the beginning of "It's About That Time": the band builds slowly from near-silence, the bass establishing a pattern, the keyboards adding layer by layer, Miles entering almost imperceptibly. By the time he's fully in the mix, the music has become something — but you can't identify the moment it happened. This gradual materialization is one of the most distinctive techniques in his electric period.`,
    ],
    description: `In a Silent Way, recorded in February 1969 and released that summer, is the album where Miles Davis moved fully into electric music — and the template for every ambient and meditative jazz recording that followed. Assembled from a single session, with Teo Macero editing and restructuring the recordings into two long tracks, it is both more accessible and more radical than Bitches Brew. The group included three keyboards (Zawinul, Chick Corea, Herbie Hancock), all playing simultaneously, and John McLaughlin on guitar — the most important guitarist in jazz-rock fusion, here on his first session with Miles, playing in a way no one had thought to play before.`,
  },

  // Monk
  monk_with_coltrane: {
    id: 'monk_with_coltrane',
    figureId: 'monk',
    title: 'Thelonious Monk with John Coltrane',
    year: 1957,
    venueId: 'village_vanguard',
    medium: 'Studio album · Riverside Records',
    dimensions: 'Thelonious Monk (piano), John Coltrane (tenor sax), Wilbur Ware / Spanky DeBrest (bass), Shadow Wilson / Art Taylor (drums)',
    imageCredit: 'William P. Gottlieb / Library of Congress / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg/330px-Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg',
    whatToLookFor: [
      `What Coltrane learned from Monk: during their engagement at the Five Spot in 1957, Coltrane spent months playing Monk's music and absorbing his harmonic approach. Monk reportedly told him to "start in the middle of a sentence and go on from there." The album captures the tail end of that education — Coltrane's playing here is different from everything before and after.`,
      `Monk's piano under Coltrane's lines: not supporting them the way a conventional accompanist would, but playing parallel to them, adding his own harmonic commentary, sometimes disagreeing with what Coltrane just played. The effect is two very strong musical personalities operating simultaneously, neither quite deferring to the other. This is Monk's normal mode; for most musicians it's impossible to adapt to.`,
      `"Nutty": Monk's own composition, built on a simple melody that turns out to be structurally strange — the phrases resolve in unexpected places, the harmony doesn't behave. Coltrane navigates it as if he's been playing it for years. He hadn't been. He learned it in weeks.`,
    ],
    description: `John Coltrane spent several months working as a sideman with Thelonious Monk's group at the Five Spot Café on Cooper Square in 1957, and those months were among the most important in his development. Monk's approach to harmony — treating dissonance as a melodic resource, leaving space in ways that created forward motion rather than dead air, relating to the rhythm section as if each musician were equally responsible for the harmonic content — permanently altered how Coltrane thought about jazz. This album, recorded during the residency, is the document. Both musicians play as if the other's presence is making them better. It was.`,
  },

  monk_at_town_hall: {
    id: 'monk_at_town_hall',
    figureId: 'monk',
    title: 'Thelonious Monk at Town Hall',
    year: 1959,
    venueId: 'carnegie_hall',
    medium: 'Live album · Riverside Records',
    dimensions: 'Thelonious Monk (piano), Phil Woods, Charlie Rouse, Pepper Adams, Donald Byrd (horns), Sam Jones (bass), Art Taylor (drums)',
    imageCredit: 'William P. Gottlieb / Library of Congress / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg/330px-Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg',
    whatToLookFor: [
      `The band arrangements: Hall Overton spent months working with Monk to transfer his piano compositions to a medium-sized ensemble, a genuinely difficult task because Monk's music relies so heavily on the specific voicings of a piano and doesn't translate conventionally to horns. What Overton found was a way to honor the angularity of the originals while giving the ensemble genuine collective identity.`,
      `Monk's piano introductions: before each piece, he plays alone for a minute or two, establishing the harmonic context. These intros are miniature masterpieces in themselves — complete, self-contained statements that also prepare the listener for what follows. Nobody else's piano introductions sound like this.`,
      `The live audience at Town Hall: this is the concert that established Monk as a figure important enough to command a prestigious concert hall. He had spent years playing clubs for small, knowledgeable audiences. By 1959, he was on the cover of Time magazine. Town Hall represented both the recognition and the risk — he could have been undone by the format. He wasn't.`,
    ],
    description: `Thelonious Monk's 1959 concert at Town Hall was a landmark event in his career — the moment when the formerly marginal figure became indisputably central to American music. Arranger Hall Overton spent months transposing Monk's piano pieces for small orchestra, and the results preserved the music's strangeness while scaling it up for a concert hall. The album documents an artist fully in command of his vision and newly in possession of an audience large enough to hear it. Town Hall, on West 43rd Street in Midtown, was the room where jazz regularly demonstrated that it belonged in the same conversation as any other serious American music.`,
  },

  // Charlie Parker
  parker_koko: {
    id: 'parker_koko',
    figureId: 'parker',
    title: 'Ko Ko',
    year: 1945,
    venueId: 'birdland',
    medium: 'Single · Savoy Records',
    dimensions: 'Charlie Parker (alto sax), Dizzy Gillespie (trumpet/piano), Curly Russell (bass), Max Roach (drums)',
    imageCredit: 'William P. Gottlieb / Library of Congress / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Portrait_of_Charlie_Parker_in_1947.jpg/330px-Portrait_of_Charlie_Parker_in_1947.jpg',
    whatToLookFor: [
      `The tempo: Ko Ko is taken at approximately 300 beats per minute, which was itself a radical statement in 1945. At this tempo, the standard bebop vocabulary becomes impossible — you can't play the runs and patterns that work at 200 bpm. Parker had developed new techniques, shorter figures, more harmonic anticipation, that worked at speeds no one else could sustain.`,
      `The harmonic structure: based on the chord changes of Cherokee, but played so fast and with so many substitutions that the original tune is completely invisible. This was bebop's central technical innovation — using existing chord progressions as raw material, then transforming them through substitution and reharmonization into something new. The copyright was safe; the music was original.`,
      `Max Roach's drumming: he was 21 years old and already playing with the independence of a musician twice his age — bass drum and hi-hat maintaining the pulse while snare and cymbals played completely independent rhythmic lines. This "coordinated independence" approach, which Roach essentially invented, became the foundation of modern jazz drumming.`,
    ],
    description: `Ko Ko, recorded on November 26, 1945 in a Savoy Records session, is the three-minute document of bebop's arrival. Charlie Parker was 25 and had spent years developing a new language for the alto saxophone — harmonically dense, rhythmically complex, played at speeds that forced a different approach to improvisation. Ko Ko demonstrated the full achievement in a single take. Dizzy Gillespie, who was supposed to play trumpet but couldn't read the chord chart quickly enough, instead played piano on this track, with Miles Davis sitting in the control room too nervous to attempt it. The record sold modestly. Its influence was immeasurable.`,
  },

  parker_jazz_massey: {
    id: 'parker_jazz_massey',
    figureId: 'parker',
    title: 'Jazz at Massey Hall',
    year: 1953,
    venueId: 'birdland',
    medium: 'Live album · Debut Records',
    dimensions: 'Charlie Parker (alto sax), Dizzy Gillespie (trumpet), Bud Powell (piano), Charles Mingus (bass), Max Roach (drums)',
    imageCredit: 'William P. Gottlieb / Library of Congress / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Portrait_of_Charlie_Parker_in_1947.jpg/330px-Portrait_of_Charlie_Parker_in_1947.jpg',
    whatToLookFor: [
      `The personnel: this is the only recording of the bebop founding generation playing together as a full unit — Parker, Gillespie, Powell, Mingus, Roach. The concert was poorly attended (the heavyweight championship was on television the same night), but every musician on stage understood they were part of something that needed to be documented. Mingus, who owned the Debut label, recorded it himself.`,
      `Parker's horn: he had pawned his alto saxophone and was playing a plastic Grafton instrument borrowed for the concert. The sound is thinner and less resonant than his usual recordings. The ideas are exactly the same. The container matters less than what's inside it.`,
      `Gillespie and Parker playing together: by 1953, their musical partnership had been mostly informal for several years. Here they play as co-equals, trading phrases, finishing each other's sentences, demonstrating the particular musical conversation that had invented a genre. Parker had two years to live. This was one of their last public meetings.`,
    ],
    description: `Recorded in Toronto's Massey Hall on May 15, 1953, Jazz at Massey Hall captured the only full-group recording of bebop's founding generation — Parker, Gillespie, Powell, Mingus, and Roach — playing together. The concert was poorly attended and Parker played on a borrowed plastic saxophone, having pawned his instrument. Charles Mingus, who ran the Debut record label, recorded the concert on a tape deck and released it in 1956. It stands as the farewell document of bebop's first generation: complete, self-aware, playing at the highest level, with two years left before Parker's death. The building may have been in Toronto, but the music was New York's.`,
  },

  // Bill Evans
  evans_waltz_debby: {
    id: 'evans_waltz_debby',
    figureId: 'bill_evans',
    title: 'Waltz for Debby',
    year: 1961,
    venueId: 'village_vanguard',
    medium: 'Live album · Riverside Records',
    dimensions: 'Bill Evans (piano), Scott LaFaro (bass), Paul Motian (drums)',
    imageCredit: 'Steve Schapiro / Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg/330px-Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg',
    whatToLookFor: [
      `The relationship between Evans and LaFaro: on "My Man's Gone Now" and "Detour Ahead," the bass moves so freely — playing melodic lines, responding to the piano, anticipating harmonic changes — that it becomes genuinely difficult to determine who is the primary voice. This is the achievement of the Evans trio: not one leader and two accompanists, but three musicians in continuous equal conversation.`,
      `"My Foolish Heart": Evans's ballad playing at its most complete. He doesn't embellish the melody — he finds the emotional center of each note and plays exactly that, nothing more. The harmonic voicings create a kind of hovering, unresolved feeling that is the pianistic equivalent of a held breath. Ravel and Debussy are the obvious influences; what Evans does with them is entirely his own.`,
      `The recording quality: producer Orrin Keepnews placed the microphones to capture the room's sound as well as the instruments. You can hear the audience in the silences, the clink of glasses, the ambient noise of a jazz club at midnight. This intimacy — the sense of overhearing rather than listening — is part of what makes these recordings irreplaceable. The Village Vanguard is still there. It still sounds like this.`,
    ],
    description: `Recorded at the same June 25, 1961 Village Vanguard session as Sunday at the Village Vanguard, Waltz for Debby was released as the companion album and covers different material from the same evening. The interplay between Evans, LaFaro, and Motian on these recordings established the template for the "conversation" model of the jazz trio — three equal voices rather than piano with rhythm section accompaniment. LaFaro's death eleven days later made both recordings irreplaceable: documents of a musical partnership that had fully matured but had no time to grow further. The title piece, written for Evans's niece Deborah, is one of the most recorded melodies in jazz.`,
  },

  evans_conversations: {
    id: 'evans_conversations',
    figureId: 'bill_evans',
    title: 'Conversations with Myself',
    year: 1963,
    venueId: 'village_vanguard',
    medium: 'Studio album · Verve Records',
    dimensions: 'Bill Evans (piano, overdubbed in three simultaneous tracks)',
    imageCredit: 'Steve Schapiro / Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg/330px-Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg',
    whatToLookFor: [
      `The three simultaneous tracks: Evans recorded a piano track, then listened to it through headphones while recording a second track that responded to the first, then listened to both while recording a third. The result is three Bill Evanses in conversation, each one responding to what the others are playing, creating a density of harmonic and rhythmic information impossible in live performance.`,
      `"Round Midnight": Monk's composition, played here in a way that illuminates why Evans's harmonic language and Monk's were in dialogue without being similar. Evans turns the tune over and around, finding implications in the harmonic structure that Monk left open. It's one musician's response to another's architecture.`,
      `The unusual technique: overdubbing was standard in popular music by 1963 but was considered inauthentic in jazz, where live improvisation was the value. Evans's answer was that the conversations between his three simultaneous selves were as genuinely improvisational as any live trio — each track was recorded in real time, responding to the previous tracks. The Grammy Award this record won was his first.`,
    ],
    description: `Conversations with Myself, recorded in 1963, is Bill Evans playing with himself — literally. Using the overdubbing technique then standard in pop music, Evans recorded three simultaneous piano tracks, each one responding to the previous, creating a trio of himself. The result is harmonically denser and rhythmically more complex than anything possible in live performance, while preserving the improvisational quality he considered essential. The album won the first of his three Grammy Awards and established overdubbing as a legitimate tool for jazz musicians. It remains one of the strangest and most successful experiments in his catalog.`,
  },

  reasonable_doubt: {
    id: 'reasonable_doubt',
    topicId: 'brooklyn_voice',
    title: 'Reasonable Doubt',
    artist: 'Jay-Z',
    year: 1996,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f5/Reasonable_Doubt_New.jpg',
    tagline: `The debut that no label would release — so he released it himself.`,
    description: `Unable to get a major label deal, Jay-Z co-founded Roc-A-Fella Records and released Reasonable Doubt independently in 1996. More jazz-influenced than anything in the genre at the time — DJ Premier and Ski Beatz building tracks from late-night soul samples — Jay-Z\'s narrator was a street entrepreneur who had made it out but remembered exactly how. The album sold modestly on release. It is now recognized as one of the greatest rap records ever made, and the entrepreneurial move that launched the most successful executive career in music history.`,
    significance: "Jay-Z's artistic peak and the foundation of the most successful executive career in hip-hop",
    medium: 'Album',
    venueId: 'marcy_houses',
    figureId: 'jay_z',
  },

};

export const figures = {
  van_gogh: {
    id: 'van_gogh',
    topicId: 'post_impressionism',
    name: `Vincent van Gogh`,
    years: `1853–1890`,
    nationality: 'Dutch',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/330px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg',
    tagline: `The painter who turned suffering into color.`,
    primer: `Van Gogh did not pick up a paintbrush until he was 27. Before that: failed art dealer, failed preacher, failed missionary in a Belgian coal mining district. When he finally started painting, he had only ten years. He produced over 900 paintings.

The Van Gogh most people imagine — tortured, isolated, cutting off his ear — is real, but incomplete. He was also a voracious reader, a brilliant correspondent (his letters to his brother Theo are among the greatest art texts ever written), and a painter of almost impossible technical ambition.

He moved to Paris in 1886 and got hit by two things simultaneously: Impressionism's broken light and Japanese woodblock prints. He lightened his dark Dutch palette completely. He started making marks rather than blending. The brushstroke became visible, directional, almost alive.

Then he went south to Arles, looking for the light he'd seen in Japanese prints. He painted 200 works in 15 months. Whatever mental illness he had accelerated in the Provençal sun.

The ear incident happened in December 1888, after Gauguin left. Van Gogh voluntarily committed himself to the Saint-Paul-de-Mausole asylum in Saint-Rémy. And that's where The Starry Night came from. He painted out his window. He painted the cypresses in the courtyard. He was not trying to express his suffering — he was trying to work through it.

He died in July 1890, at 37. A gunshot wound to the chest; whether accident or suicide is still debated. His brother Theo died six months later. Van Gogh sold one painting in his lifetime.

In NYC, his work is at MoMA, the Met, and the Guggenheim — a triangle you can walk in an afternoon.`,
    workIds: ['starry_night', 'wheatfield_cypresses', 'self_portrait_straw_hat', 'mountains_saint_remy'],
    primaryVenueIds: ['moma', 'met', 'guggenheim'],
  },
  cezanne: {
    id: 'cezanne',
    topicId: 'post_impressionism',
    name: `Paul Cézanne`,
    years: `1839–1906`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Paul-Cezanne.jpg',
    tagline: `The father of modern art — the bridge to everything that came after.`,
    primer: `Picasso called Cézanne "my one and only master." Matisse said he was "a kind of god of painting." If you understand Cézanne, you understand why modern art looks the way it does.

He started as an Impressionist — friends with Pissarro, interested in light and sensation. But he became dissatisfied with Impressionism's dissolution of form. He wanted to "make of Impressionism something solid and durable, like the art of the museums."

What he discovered, painting the same apple or the same mountain hundreds of times, is that the eye doesn't perceive the world the way Renaissance painters depicted it. We don\'t take in a scene from one fixed point. We move our eyes, shift our head. A table corner bends when you look at it with both eyes. So Cézanne started painting what perception actually is — multiple viewpoints embedded in a single image.

This is exactly what Braque and Picasso started from when they invented Cubism in 1907, the year after Cézanne died.

His subject matter was almost defiantly boring: Mont Sainte-Victoire, card players, bathers, apples. He returned to the same subjects for decades. The point wasn't the subject. The point was solving the problem of seeing.

His primary NYC home is the Met, which holds exceptional examples of his Card Players, late landscapes, and portraits.`,
    workIds: ['card_players', 'mont_sainte_victoire', 'cezanne_bibemus'],
    primaryVenueIds: ['met'],
  },
  gauguin: {
    id: 'gauguin',
    topicId: 'post_impressionism',
    name: `Paul Gauguin`,
    years: `1848–1903`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Paul_Gauguin_1891.png/330px-Paul_Gauguin_1891.png',
    tagline: `The man who escaped civilization — and what he found there.`,
    primer: `Gauguin was a stockbroker. A successful one, in Paris, with a wife and five children. Then he quit, left his family, moved to Brittany, then Martinique, then Tahiti, then the Marquesas Islands, where he died of syphilis in 1903.

This makes him either visionary or monstrous, depending on your angle — and the honest answer is probably some of both. His Tahitian paintings are among the most radical color achievements of the 19th century. They're also built on a colonial fantasy that exoticized and exploited the people he depicted. These two facts coexist.

What he was doing technically is extraordinary: color used not to describe but to express. A blue shadow, a red tree, a yellow sky — not because that's what he saw, but because that\'s what he felt. He was liberating color from its obligation to reality, opening the door for Matisse and the Fauvists, for Expressionism, for every artist who\'s ever used color as a pure emotional instrument.

The Met holds several major Tahitian works. Ia Orana Maria, from 1891, is his first Tahitian masterpiece.`,
    workIds: ['ia_orana_maria', 'two_tahitian_women', 'gauguin_vanilla'],
    primaryVenueIds: ['met'],
  },
  seurat: {
    id: 'seurat',
    topicId: 'post_impressionism',
    name: `Georges Seurat`,
    years: `1859–1891`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Georges_Seurat_1888.jpg/330px-Georges_Seurat_1888.jpg',
    tagline: "The scientist of color — who died before he could see what he'd started.",
    primer: `Seurat was the most systematic of the Post-Impressionists — a young man who approached painting the way an engineer approaches a problem. He read color theory obsessively and developed Pointillism as a scientific method, not an aesthetic preference.

The idea: pure colors placed as dots next to each other will optically mix on the viewer's retina into a more vibrant secondary color than if the paint were physically mixed. This was based on real science — color perception research of the 1880s. What it unambiguously did was create a new visual texture, a shimmer, a vibration that nobody had seen in paint before.

He was slow. A Sunday on the Grande Jatte, his masterpiece in Chicago, took two years and hundreds of studies. He died at 31, cause unknown. In his short working life he produced seven major paintings and 60 smaller ones, plus hundreds of drawings.

The Met holds his Circus Sideshow, a major nocturnal work. MoMA holds smaller seascape paintings. Together they let you see both aspects of his work: the monumental and the intimate.`,
    workIds: ['circus_sideshow', 'port_en_bessin'],
    primaryVenueIds: ['met', 'moma'],
  },
  toulouse_lautrec: {
    id: 'toulouse_lautrec',
    topicId: 'post_impressionism',
    name: `Henri de Toulouse-Lautrec`,
    years: `1864–1901`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Photolautrec.jpg/330px-Photolautrec.jpg',
    tagline: "The insider-outsider of Paris nightlife — and the father of graphic design.",
    primer: `Toulouse-Lautrec was born into French aristocracy and stunted by a childhood leg condition that left him 4'11" as an adult. He was excluded from the social world he was born into. He ended up at the Moulin Rouge.

He became its unofficial chronicler — painting its performers, its regulars, its casual cruelties and electric pleasures. He had his own table. He knew everyone. He was both completely inside this world and completely apart from it.

His technique was rapid, gestural, the opposite of Seurat's systematic precision. He was interested in character, in the specific quality of a specific face, in the way a body moves under gaslight. His line was brilliant — economical, alive, instantly recognizable.

His posters are why you can recognize a poster when you see one. Before Lautrec, a poster was just printed text. After him, it was a visual composition with a dominant image and a compressed graphic language. Jane Avril, Aristide Bruan, the Moulin Rouge — these images changed commercial art permanently.

He died at 36, of alcoholism and syphilis. MoMA holds his lithograph posters; the Met holds the major oil paintings.`,
    workIds: ['at_the_moulin_rouge', 'jane_avril', 'lautrec_babylone', 'lautrec_vieilles'],
    primaryVenueIds: ['met', 'moma'],
  },

  // ── IMPRESSIONISM ─────────────────────────────────────────────────────────────
  monet: {
    id: 'monet',
    topicId: 'impressionism',
    name: `Claude Monet`,
    years: `1840–1926`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_1899_Nadar_crop.jpg/330px-Claude_Monet_1899_Nadar_crop.jpg',
    tagline: `The man who taught the eye to see light.`,
    primer: `Monet was Impressionism. Not its inventor, not its theorist — its embodiment. He painted the same haystack twenty-five times, the same cathedral thirty, the same water lily pond for thirty years. Not because he ran out of ideas. Because he understood something everyone else was only beginning to grasp: that light is the subject, and light never stops changing.

He grew up in Normandy, moved to Paris as a teenager, and fell in with a circle of young painters who were fed up with the academic tradition. They wanted to paint what they actually saw — which meant painting outside, quickly, before the light shifted. They wanted the sensation of a moment, not its ideal reconstruction.

The word "Impressionism" comes from a Monet painting: Impression, Sunrise (1872), shown at the group's first exhibition. A critic used the title to mock the whole show. The painters adopted the name with pride.

What Monet figured out, painting the same subjects over and over, was that the subject was almost irrelevant. The haystacks aren't about haystacks. They\'re about how a golden afternoon in October feels different from a blue January morning — how color and light carry emotional weight that no amount of narrative can.

His late Water Lilies, painted as his eyesight failed, are some of the most abstract works made in the 19th century. Pollock and Rothko both cited him directly. MoMA holds key examples of both his early and late work.`,
    workIds: ['monet_grenouillere', 'monet_waterlilies'],
    primaryVenueIds: ['moma'],
  },
  degas: {
    id: 'degas',
    topicId: 'impressionism',
    name: `Edgar Degas`,
    years: `1834–1917`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Self-portrait_by_Edgar_Degas.jpg/330px-Self-portrait_by_Edgar_Degas.jpg',
    tagline: `The Impressionist who never painted outside.`,
    primer: `Degas is the great paradox of Impressionism: he showed with the group, identified with the group, and shared almost nothing of their core technique. He painted in his studio, from memory and drawings. He hated the word "Impressionism" and preferred "realist." He was fascinated by artificial light — cafés, theaters, racetracks, the opera — not by sunlit gardens and shimmering rivers.

What he shared with Monet and Renoir was the commitment to modern life and the rejection of historical grandeur. He was painting jockeys and laundresses and ballet dancers — people in motion, caught between moments, photographed by the eye rather than posed.

He was deeply influenced by photography and by Japanese woodblock prints. Both showed him how to crop a scene unusually — how to catch a figure from above or at an angle the eye doesn't usually see. His dancers are rarely posed gracefully; they scratch their backs, adjust their shoes, yawn. He painted labor, not performance.

He was wealthy, unlike most of his colleagues, which gave him freedom and distance. He didn't need to sell. He could work slowly, revise endlessly, and spend years on a single subject.

The Met holds the finest Degas collection in the United States, including major paintings, pastels, and bronzes.`,
    workIds: ['degas_dance_class', 'degas_rehearsal', 'degas_dancers_yellow', 'degas_drying'],
    primaryVenueIds: ['met'],
  },
  renoir: {
    id: 'renoir',
    topicId: 'impressionism',
    name: `Pierre-Auguste Renoir`,
    years: `1841–1919`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Pierre_Auguste_Renoir%2C_uncropped_image.jpg/330px-Pierre_Auguste_Renoir%2C_uncropped_image.jpg',
    tagline: "The painter of pleasure — and why that's harder than it looks.",
    primer: `Renoir painted happiness. This sounds simple and is extraordinarily difficult. His subjects are lunches on the riverside, dancers at open-air cafés, children in gardens, women with flowers. The light in his paintings always seems warm.

This has made him easy to dismiss. Critics have called him soft, decorative, sentimental. And there's truth in the critique. But at his peak — the 1870s and early 1880s — Renoir was a technical innovator of the highest order. His brushwork was faster and looser than anyone\'s, his color warmer and more luminous than his colleagues', his ability to render fabric, foliage, and human skin in the same flickering light unmatched.

He grew up working class, started as a porcelain painter at a factory, which gave him technical precision and an understanding of color chemistry. He knew exactly what he was doing when he placed a stroke. The apparent effortlessness was practiced.

His portraits of Parisian society in the late 1870s launched his career commercially. He became the most sought-after portrait painter of his generation — which gave him freedom to paint the leisure scenes he loved. The Met holds Madame Charpentier, the portrait that made his reputation.`,
    workIds: ['renoir_charpentier', 'renoir_parrot'],
    primaryVenueIds: ['met'],
  },
  cassatt: {
    id: 'cassatt',
    topicId: 'impressionism',
    name: `Mary Cassatt`,
    years: `1844–1926`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mary_Cassatt_photograph_1913.jpg/330px-Mary_Cassatt_photograph_1913.jpg',
    tagline: `The American in Paris who changed what Impressionism could see.`,
    primer: `Mary Cassatt was born in Allegheny City, Pennsylvania. She told her father she wanted to be a painter; he said he'd rather see her dead. She went to Paris anyway, and then — when she saw Degas's work in a gallery window in 1875 — understood what she was looking for.

Degas invited her to join the Impressionists. She was the only American in the inner circle and one of only two women. She never married, famously describing marriage as "a prison." She had no children. And yet her most famous paintings are of mothers and children, intimate domestic scenes painted with extraordinary psychological insight.

Cassatt had access Degas and Monet didn't. As a woman, she could enter the private domestic world of bourgeois Parisian women — the drawing rooms, the nurseries, the moments between public performance. Her paintings are full of scenes her male colleagues couldn\'t witness.

She was also deeply influenced by Japanese woodblock prints, which she encountered at a major exhibition in 1890. Her prints from that period — flat color fields, strong outlines, unconventional perspectives — are among the finest American graphic works of the century.

The Met holds significant examples of her work across all periods.`,
    workIds: ['cassatt_tea', 'cassatt_fitting', 'cassatt_gardner'],
    primaryVenueIds: ['met'],
  },
  pissarro: {
    id: 'pissarro',
    topicId: 'impressionism',
    name: `Camille Pissarro`,
    years: `1830–1903`,
    nationality: 'French (born Danish Virgin Islands)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pissarro-portrait.jpg/330px-Pissarro-portrait.jpg',
    tagline: `The father of the Impressionists — and the one they all came back to.`,
    primer: `Pissarro was the oldest of the Impressionists and the only one to show in all eight of the group's exhibitions, from 1874 to 1886. Cézanne called him "humble and colossal." Gauguin was his student. He mentored Van Gogh, influenced Seurat, and befriended virtually every significant painter who passed through Paris in the last quarter of the 19th century.

He was born in the Danish Virgin Islands to a Sephardic Jewish father and a Creole mother, and moved to Paris as a young man. He was always slightly outside the French mainstream — politically radical, ethnically marginal, economically precarious. He had eight children and spent most of his career genuinely poor.

His subject was the French countryside and, in his final years, the city of Paris seen from hotel windows. He painted farmers and peasants and market days — not as picturesque, as contemporaries did, but as working people doing actual labor.

In the 1880s he adopted Pointillism under Seurat's influence, then returned to his own style when he found the dots too mechanical. Cézanne said Pissarro showed him how to work from nature. Monet said he learned color from Pissarro.

The Met holds several late Paris views that are among the finest things he ever made.`,
    workIds: ['pissarro_tuileries', 'pissarro_turkeys'],
    primaryVenueIds: ['met'],
  },

  // ── ABSTRACT EXPRESSIONISM ────────────────────────────────────────────
  pollock: {
    id: 'pollock',
    topicId: 'abstract_expressionism',
    name: `Jackson Pollock`,
    years: `1912–1956`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Jackson_Pollock%27s_passport_%28cropped%29.jpg/330px-Jackson_Pollock%27s_passport_%28cropped%29.jpg',
    tagline: `The man who put painting on the floor and changed everything.`,
    primer: `Pollock grew up in Wyoming and Arizona and arrived in New York in 1930 with no money and enormous ambition. He drank heavily from the start. He was in analysis for much of his adult life.

He was also the painter who broke the last constraint on Western painting: the easel. Pollock unrolled his canvas on the barn floor and moved around it, dripping and pouring paint from cans and sticks, working from all four sides. There was no right-side-up. The painting wasn't a window onto something; it was a record of a body moving through space.

He called it action painting and said he was in the painting. His friend Harold Rosenberg wrote the defining essay about it, and the images Hans Namuth took in 1950 of Pollock dancing around his canvas became the century's most influential photographs of an artist at work.

The drip paintings of 1947–1950 are the peak: webs of poured enamel and aluminum paint, layers of skeins building complexity and depth. He died in 1956, drunk, in a car crash on Long Island, at 44.

His paintings now sell for over $200 million. During his lifetime, his income from painting was almost nothing.`,
    workIds: ['pollock_autumn_rhythm', 'pollock_one31'],
    primaryVenueIds: ['met', 'moma'],
  },
  rothko: {
    id: 'rothko',
    topicId: 'abstract_expressionism',
    name: `Mark Rothko`,
    years: `1903–1970`,
    nationality: 'American (born Latvia)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Consuelo_Kanaga%2C_Mark_Rothko%2C_Yorktown_Heights%2C_ca._1949.jpg/330px-Consuelo_Kanaga%2C_Mark_Rothko%2C_Yorktown_Heights%2C_ca._1949.jpg',
    tagline: `The painter who turned color into an emotional event.`,
    primer: `Rothko was born Marcus Rothkowitz in Dvinsk, Latvia, and came to Portland, Oregon, at age 10 with his family fleeing antisemitism. He found his form around 1949: large rectangles of color, stacked, their edges soft, their surfaces layered and luminous. He called them "performers."

He hated being called a colorist. He said his paintings were about "basic human emotions — tragedy, ecstasy, doom." He wanted to make viewers cry. He was not joking. People routinely weep in front of his paintings.

He received the commission for the Seagram Building restaurant murals in 1958. He worked on the series for two years, then returned the commission and the advance check. He decided he didn't want his paintings in a place where the wealthy ate. He gave them to the Tate Modern instead.

He died by suicide in 1970 at 66. His estate included 798 paintings. MoMA holds major examples from every period.`,
    workIds: ['rothko_no3'],
    primaryVenueIds: ['moma'],
  },
  de_kooning: {
    id: 'de_kooning',
    topicId: 'abstract_expressionism',
    name: `Willem de Kooning`,
    years: `1904–1997`,
    nationality: 'American (born Netherlands)',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Willem_de_Kooning_in_his_studio.jpg/330px-Willem_de_Kooning_in_his_studio.jpg',
    tagline: `The abstract expressionist who refused to give up the figure.`,
    primer: `De Kooning was a stowaway. He came to America in 1926 hidden on a ship from Rotterdam, trained as a house painter and commercial artist by day, and painted furiously at night. He was the most technically gifted of the New York School — the one who had actually gone to art school, who could draw like an old master and chose not to.

His relationship with abstraction was never simple. While Pollock and Rothko pushed toward pure non-figuration, de Kooning kept returning to the human body — specifically, to women. The Woman series of the early 1950s shocked the New York art world, which had convinced itself that figuration was dead.

He worked paintings to destruction and beyond. Woman I took almost two years, was scraped back repeatedly, and survived only because a fellow painter persuaded him not to destroy it.

He moved to East Hampton, Long Island, in 1963 and spent the rest of his life there, developing Alzheimer's in the 1980s but continuing to paint. He died at 92, the last survivor of the first-generation New York School. MoMA holds Woman I and several key abstractions.`,
    workIds: ['dekooning_woman1'],
    primaryVenueIds: ['moma'],
  },
  kline: {
    id: 'kline',
    topicId: 'abstract_expressionism',
    name: `Franz Kline`,
    years: `1910–1962`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/17/Franz_Kline_headshot.png',
    tagline: `Black and white and nothing else — and everything.`,
    primer: `Franz Kline grew up in Wilkes-Barre, Pennsylvania, coal country, surrounded by railroad bridges, mining equipment, the black-steel skeleton of extraction industry. When he finally found his signature style, it looked exactly like that landscape.

He came to it accidentally. Around 1950 he projected a small sketch onto the wall using a projector and saw his brushwork transformed into a large-scale black-and-white image. Something clicked. He began making paintings on the scale of the projected image — huge, gestural, built from broad black strokes against white.

He was not making calligraphy. He was painting the speed and weight of industrial structures — railroad trestles, bridges, the black ironwork of a Pennsylvania childhood. The titles tell you: Chief, Cardinal — mostly railroad engines.

Where Pollock's drip paintings are webs of layered complexity, Kline\'s work is brutally direct. A few strokes, enormous confidence.

He died of heart failure at 51, just as his international reputation was firmly established. His work at MoMA remains some of the most powerful in the building.`,
    workIds: ['kline_chief'],
    primaryVenueIds: ['moma'],
  },
  newman: {
    id: 'newman',
    topicId: 'abstract_expressionism',
    name: `Barnett Newman`,
    years: `1905–1970`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Newman_Barnett.jpg/330px-Newman_Barnett.jpg',
    tagline: `The philosopher of abstract painting — who backed it up with the work.`,
    primer: `Newman was the intellectual of the New York School. He wrote essays, organized exhibitions, ran for mayor of New York City in 1933 on a platform of public art, and spent years thinking about what painting was for before he made paintings anyone noticed.

He came to his zip — the thin vertical line dividing a large color field — around 1948, in a painting he called Onement I. He stared at it for eight months before deciding it was finished. His friends were confused. It looked like almost nothing. He insisted it was everything.

He said the zip was not a division but a creation: it brought the color field into being by defining its edges. The paintings were about the Sublime — the experience of something too large or too powerful to be grasped whole. He was making secularized religious art.

His work is extraordinarily divisive. Some people find it the most moving painting of the 20th century. Others find it simply a stripe on a color field. He said that those who find it boring are boring.

MoMA's Vir Heroicus Sublimis is his masterwork.`,
    workIds: ['newman_vir'],
    primaryVenueIds: ['moma'],
  },

  // ── CUBISM ──────────────────────────────────────────────────────────────────────
  picasso: {
    id: 'picasso',
    topicId: 'cubism',
    name: `Pablo Picasso`,
    years: `1881–1973`,
    nationality: 'Spanish',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pablo_picasso_1.jpg/330px-Pablo_picasso_1.jpg',
    tagline: `The painter who broke Western art apart — and put it back together differently.`,
    primer: `Picasso was a prodigy who could paint like an old master at age 14 and chose to destroy that skill. By the time he was 26 he had made Les Demoiselles d'Avignon, a painting that broke 500 years of European pictorial convention and introduced Cubism.

He was born in Málaga, Spain. By the time he moved permanently to Paris at 23, he had passed through the academic tradition, Symbolism, his Blue Period, and his Rose Period. Then he went to the ethnographic museum at the Trocadéro and saw African and Iberian masks, and everything changed.

The Cubism he developed with Braque between 1907 and 1914 is the most influential development in 20th-century art. The idea: rather than depicting objects from a single fixed viewpoint, show them from multiple viewpoints simultaneously. Flatten the pictorial space. Break the object into facets and reassemble it.

He never stayed still. After Cubism came Neoclassicism, then Surrealism, then the enormous Spanish Civil War painting Guernica (1937), then decades of work that ranged from brilliant to genuinely bad. He worked until the end, dying at 91 in 1973.

MoMA holds Les Demoiselles d'Avignon and Three Musicians — two defining works from the two phases of Cubism.`,
    workIds: ['picasso_demoiselles', 'picasso_three_musicians'],
    primaryVenueIds: ['moma'],
  },
  braque: {
    id: 'braque',
    topicId: 'cubism',
    name: `Georges Braque`,
    years: `1882–1963`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Georges_Braque%2C_1908%2C_photograph_published_in_Gelett_Burgess%2C_The_Wild_Men_of_Paris%2C_Architectural_Record%2C_May_1910.jpg/330px-Georges_Braque%2C_1908%2C_photograph_published_in_Gelett_Burgess%2C_The_Wild_Men_of_Paris%2C_Architectural_Record%2C_May_1910.jpg',
    tagline: `The co-inventor of Cubism — the one who actually made it work.`,
    primer: `Braque and Picasso invented Cubism together, and almost nobody remembers Braque. Picasso became famous; Braque became important.

He grew up in Normandy in a family of house painters and decorators, which gave him an intimate knowledge of surface. He came to Paris, fell in with the Fauvists, and then met Picasso in 1907. For the next seven years, they worked so closely together that they sometimes couldn't tell their canvases apart. Picasso said they were like two mountaineers roped together.

It was Braque who introduced lettering into Cubist paintings, who used house-painting combs to create wood-grain textures, who pushed the work toward collage. It was Braque who invented papier collé — pasted paper — which became the Cubists' key technique.

Then World War I separated them. Braque was drafted, wounded seriously in the head, and spent years recovering. When he came back to painting, Picasso had moved on.

The Guggenheim holds key works from the Cubist period; the Met and MoMA hold others.`,
    workIds: ['braque_violin_palette'],
    primaryVenueIds: ['guggenheim'],
  },
  gris: {
    id: 'gris',
    topicId: 'cubism',
    name: `Juan Gris`,
    years: `1887–1927`,
    nationality: 'Spanish',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Juan_Gris%2C_1922%2C_photograph_by_Man_Ray%2C_Paris._Gelatin_silver_print.jpg/330px-Juan_Gris%2C_1922%2C_photograph_by_Man_Ray%2C_Paris._Gelatin_silver_print.jpg',
    tagline: `The Cubist who turned rigor into beauty.`,
    primer: `Juan Gris arrived in Paris from Madrid in 1906, moved into the same Montmartre building as Picasso (the Bateau-Lavoir), and watched Cubism being invented from the inside. He began making his own Cubist paintings in 1911, three years after Picasso and Braque — and by most accounts, he systematized it more thoroughly than either of them.

He was trained as an illustrator and graphic artist. His compositions are architecturally precise, his color relationships worked out methodically. Where Picasso worked intuitively, Gris would establish a geometric grid first, then distribute his subject matter within it. He called his method "synthetic" — starting with pure geometric forms and working toward the object.

This makes him sound cold, but the paintings are warm. His palette is richer and more colorful than Picasso's and Braque\'s analytic-period monochrome.

He had chronic ill health and financial precarity, and died at only 40 from pleurisy. In his short career he produced around 300 paintings of extraordinary consistency. Picasso was famously ambivalent about him — recognizing the quality, uncomfortable with having a rival so close.

The Met holds Guitar and Flowers from his formative period.`,
    workIds: ['gris_guitar_met'],
    primaryVenueIds: ['met'],
  },
  leger: {
    id: 'leger',
    topicId: 'cubism',
    name: `Fernand Léger`,
    years: `1881–1955`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/db/Fernand_L%C3%A9ger%2C_c._1916.jpg',
    tagline: `The Cubist who fell in love with machines — and ordinary people.`,
    primer: `Léger came to Cubism from a different direction than Picasso and Braque. Where they fragmented the bourgeois studio — guitars, newspapers, bottles of wine — Léger was interested in the industrial world: factories, construction, the human body as a kind of machine.

He grew up in Normandy, trained as an architect's draftsman, and moved to Paris. His canvases are rounder than Braque\'s, built from tubes and cones rather than facets. Critics called it Tubism.

The war transformed him. He went to the front as an engineer, survived a gas attack at Verdun, and came back with a different sense of who painting was for. He said the army had shown him real people — workers, mechanics, ordinary men — and he wanted to make art for them, not for the salon.

He spent the war years 1940–1945 in New York, teaching at Yale, and the city affected him deeply. Several institutions in NYC hold major Léger works, with the Guggenheim among the most important.`,
    workIds: ['leger_smoker'],
    primaryVenueIds: ['guggenheim'],
  },
  duchamp: {
    id: 'duchamp',
    topicId: 'cubism',
    name: `Marcel Duchamp`,
    years: `1887–1968`,
    nationality: 'French-American',
    imageCredit: 'Wikimedia Commons / Fair Use',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/34/Man_Ray%2C_1920-21%2C_Portrait_of_Marcel_Duchamp%2C_gelatin_silver_print%2C_Yale_University_Art_Gallery.jpg/330px-Man_Ray%2C_1920-21%2C_Portrait_of_Marcel_Duchamp%2C_gelatin_silver_print%2C_Yale_University_Art_Gallery.jpg',
    tagline: `The artist who asked: what if art is just an idea?`,
    primer: `Duchamp is the most consequential figure in 20th-century art for one reason: he asked a question nobody had thought to ask, and nobody has been able to stop arguing about it since. The question: if an artist selects an ordinary object and declares it art, is it art?

He asked this with the readymades — a bicycle wheel mounted on a stool (1913), a snow shovel labeled In Advance of the Broken Arm (1915), a urinal submitted to an exhibition under the pseudonym R. Mutt (1917). The urinal was rejected. Duchamp and his allies protested. The argument hasn't ended.

He was also a Cubist. Nude Descending a Staircase, No. 2 (1912) combined Cubist multiple viewpoints with Futurist time-motion. It appeared at the 1913 Armory Show in New York and became the most talked-about painting in America — "an explosion in a shingle factory," wrote one critic.

After the readymades, Duchamp more or less stopped making objects. He spent most of his career playing chess and presenting himself as a living provocation to art's self-importance. He only appeared to have stopped — the discovery after his death of a secret room-sized installation he\'d been making for 20 years showed he\'d been working all along.

MoMA holds several key Duchamp works, including replicas of the readymades.`,
    workIds: ['duchamp_nude'],
    primaryVenueIds: ['moma'],
  },

  // ── AMERICAN MODERNISM ──────────────────────────────────────────────────────────
  hopper: {
    id: 'hopper',
    topicId: 'american_modernism',
    name: `Edward Hopper`,
    years: `1882–1967`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Edward_Hopper%2C_New_York_artist_LCCN2016871478_%28cropped%29.jpg/330px-Edward_Hopper%2C_New_York_artist_LCCN2016871478_%28cropped%29.jpg',
    tagline: `The painter of American solitude.`,
    primer: `Edward Hopper grew up in Nyack, New York, twenty miles up the Hudson. He moved to Manhattan, studied at the New York School of Art, and spent three trips to Paris in his twenties absorbing Impressionism. Then he came home and spent the next four decades painting American loneliness.

Not depression. Not despair. Loneliness — which is a different thing, and more interesting. His paintings are never despairing; they're alert, observant, lit by a very specific quality of light (usually raking, late-afternoon, or early-morning) that makes the ordinary world look both hyper-real and slightly dreamlike.

His subjects: diners, gas stations, hotel rooms, lighthouses, movie theaters, office buildings. Empty storefronts. Women alone in apartments, lit from inside.

He was a slow worker. His wife Josephine managed his career, appeared as the model for virtually every woman he painted, and had veto power over every sale.

He died in his studio on Washington Square in 1967. Josephine died ten months later and left almost his entire estate to the Whitney. The Whitney is his museum.`,
    workIds: ['hopper_sunday_morning', 'hopper_gas'],
    primaryVenueIds: ['whitney', 'moma'],
  },
  lawrence: {
    id: 'lawrence',
    topicId: 'american_modernism',
    name: `Jacob Lawrence`,
    years: `1917–2000`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Portrait_of_Jacob_Lawrence_LCCN2004663191.jpg/330px-Portrait_of_Jacob_Lawrence_LCCN2004663191.jpg',
    tagline: `The artist who made American history visible.`,
    primer: `Jacob Lawrence grew up in Harlem during the height of the Harlem Renaissance, attended free art classes at the Harlem Art Workshop, and absorbed everything around him: the artists, the writers, the musicians, the political energy of a community asserting its own history and culture.

He was 23 years old when he completed The Migration Series — 60 tempera paintings telling the story of the Great Migration, the movement of over 1.6 million Black Americans from the Jim Crow South to Northern cities between 1910 and 1930. His family had been part of it. He was painting his own people's history.

His style is distinctive and immediately recognizable: flat areas of bold color, simplified figures with strong silhouettes, compositions with the structural clarity of graphic design. He was influenced by the Mexican muralists, by Goya's prints, by the Cubists — but what he made was entirely his own.

Fortune magazine published 26 of the Migration panels in 1941. MoMA and the Phillips Collection in Washington each bought half. It was the first time many Americans had seen art by a Black artist in a major publication.

He continued making art until his late seventies, always focused on history, community, and social justice.`,
    workIds: ['lawrence_migration'],
    primaryVenueIds: ['moma'],
  },
  hartley: {
    id: 'hartley',
    topicId: 'american_modernism',
    name: `Marsden Hartley`,
    years: `1877–1943`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Portrait_of_Marsden_Hartley.jpg/330px-Portrait_of_Marsden_Hartley.jpg',
    tagline: `The first American modernist — and the one who paid for it.`,
    primer: `Hartley was born in Lewiston, Maine, and came to New York in the early 1900s, when Alfred Stieglitz's gallery at 291 Fifth Avenue was the center of everything. Stieglitz showed Cézanne, Matisse, Picasso — all for the first time in America — and also showed Hartley.

Stieglitz funded Hartley's trip to Europe in 1912. He went to Paris, then Berlin, and what he found in Berlin changed him: the German Expressionists, Kandinsky\'s abstract theory, and a circle of artists and intellectuals that included young officers of the Prussian military. He fell in love with Karl von Freyburg, a lieutenant in the Imperial cavalry, 24 years old.

Von Freyburg was killed in the first months of World War I. Hartley's response was a series of abstract paintings assembled from military insignia, regimental colors, and personal emblems — portraits without faces, grief encoded in symbols because naming it directly was impossible.

He returned to America and spent the rest of his life moving — New York, Bermuda, Mexico, Gloucester, Maine. He was perpetually broke, always difficult, genuinely brilliant.

He died in 1943 without knowing that the German Officer paintings had already secured his legacy.`,
    workIds: ['hartley_german_officer', 'hartley_painting48'],
    primaryVenueIds: ['met'],
  },
  sheeler: {
    id: 'sheeler',
    topicId: 'american_modernism',
    name: `Charles Sheeler`,
    years: `1883–1965`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Charles_Sheeler.jpg/330px-Charles_Sheeler.jpg',
    tagline: `The painter who found beauty in factories.`,
    primer: `Sheeler trained as a painter in Philadelphia, but it was photography that shaped how he saw. He worked as a professional photographer for much of his career — shooting furniture, architecture, and eventually the Ford River Rouge Complex in 1927. Those photographs became the source material for his most celebrated paintings.

He was the leading figure of Precisionism — an American movement that took industrial and architectural subjects and painted them with the clean edges, flat color areas, and geometric clarity of a technical blueprint. No smudge, no gesture, no painterly texture. If Monet painted with the eye, Sheeler painted with the camera.

At his best — in American Landscape, in the great factory paintings — there's something genuinely sublime happening. These are sacred spaces. The factory has replaced the cathedral; Sheeler paints it with the same reverence.

He was influenced by Cézanne and by the Shakers, whose functional furniture and architecture he documented and collected throughout his life. The Shakers believed that beauty and utility were not separable. Sheeler believed the same thing about industry.`,
    workIds: ['sheeler_american_landscape'],
    primaryVenueIds: ['moma'],
  },

  // ── JAZZ FIGURES ────────────────────────────────────────

  // BEBOP
  parker: {
    id: 'parker',
    topicId: 'bebop',
    name: `Charlie Parker`,
    years: `1920–1955`,
    nationality: 'American',
    imageCredit: 'William P. Gottlieb / Library of Congress / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Portrait_of_Charlie_Parker_in_1947.jpg/330px-Portrait_of_Charlie_Parker_in_1947.jpg',
    tagline: `The alto saxophonist who invented a language, then used it to extinction.`,
    primer: `Charlie Parker arrived in New York in 1939 from Kansas City and never left — not spiritually. He absorbed Art Tatum's harmonic vocabulary, Lester Young's lyricism, and the harmonic possibilities lurking in chord substitutions that no one had thought to exploit. By 1945, playing in small groups on 52nd Street, he had developed a new musical language so rapid and complex that most musicians couldn't keep up.

His improvisations weren't melodies built on familiar tunes — they were countermelodies, running against and around the original harmonic structure, reinventing it at 300 beats per minute. He could hear implications in a chord sequence that took other musicians years to understand. Then he\'d play them all, simultaneously, in a single bar.

The nickname "Bird" stuck before anyone could explain it. The music it named was a different species entirely. Parker died at 34 from the accumulated damage of heroin addiction, alcohol, and a life lived at absolute intensity. The physician who examined him estimated his age at 53. He had been playing for 12 of those apparent years.`,
    workIds: ['parker_koko', 'parker_strings', 'parker_jazz_massey'],
  },
  gillespie: {
    id: 'gillespie',
    topicId: 'bebop',
    name: `Dizzy Gillespie`,
    years: `1917–1993`,
    nationality: 'American',
    imageCredit: 'William P. Gottlieb / Library of Congress / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Portrait_of_Dizzy_Gillespie%2C_Famous_Door%2C_New_York%2C_N.Y.%2C_ca._June_1946_%28cropped%29.jpg/330px-Portrait_of_Dizzy_Gillespie%2C_Famous_Door%2C_New_York%2C_N.Y.%2C_ca._June_1946_%28cropped%29.jpg',
    tagline: "Bebop's architect, ambassador, and the most complete musician in jazz history.",
    primer: `Dizzy Gillespie was bebop's ambassador — the one who could explain it, teach it, play it on television without losing any of its fire. His trumpet technique was impossible by every prior standard: bent bell, puffed cheeks, playing at tempos and intervals that shouldn't work. He co-wrote the bebop anthems — "Salt Peanuts," "A Night in Tunisia," "Groovin' High" — with Parker and then kept going.

Into Afro-Cuban jazz (he brought Chano Pozo and the conga drum into jazz in 1947). Into big band arrangements that put bebop's harmonic language in front of 16 musicians simultaneously. Into a second act as a statesman of jazz diplomacy — touring for the State Department, mentoring three generations of younger musicians, playing with unfailing joy until the end of his life.

If Parker was bebop's id, Gillespie was its ego: controlled, brilliant, and fully aware that what they were building would outlast them both.`,
    workIds: ['gillespie_groovin'],
  },
  monk: {
    id: 'monk',
    topicId: 'bebop',
    name: `Thelonious Monk`,
    years: `1917–1982`,
    nationality: 'American',
    imageCredit: 'William P. Gottlieb / Library of Congress / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg/330px-Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg',
    tagline: `The pianist who played the wrong notes and turned out to be the only one who was right.`,
    primer: `Thelonious Monk played piano unlike anyone before or since — angular, percussive, full of deliberate silences and notes that landed slightly wrong in a way that turned out to be exactly right. The late-night sessions at Minton's Playhouse in Harlem, where bebop was invented in the early 1940s, were largely in his living room. He was there first.

But his music was too strange for the mainstream, and he spent most of the 1940s and early '50s without a regular audience or record contract. Then, in 1957, he had a residency at the Five Spot Café with John Coltrane. New York rediscovered him. He made the cover of Time magazine in 1964. His compositions — "Round Midnight," "Straight, No Chaser," "Blue Monk," "Well You Needn\'t," "Evidence" — are the most played songs in jazz after the American Songbook standards.

His silence after 1976 was as deliberate as his music. He stopped performing, retreated from public life, and died six years later of a stroke. No explanation was ever offered. None was needed.`,
    workIds: ['monk_brilliant', 'monk_with_coltrane', 'monk_at_town_hall'],
  },
  bud_powell: {
    id: 'bud_powell',
    topicId: 'bebop',
    name: `Bud Powell`,
    years: `1924–1966`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bud_Powell_1960.jpg/330px-Bud_Powell_1960.jpg',
    tagline: `The pianist who translated bebop to the keyboard — and paid for it.`,
    primer: `Bud Powell was bebop's keyboard revolutionary — the pianist who did for piano what Parker did for saxophone, translating the new harmonic and rhythmic language into a vocabulary that every jazz pianist since has used. He grew up in New York, was playing with Monk at Minton's as a teenager, and was already recognized as the most gifted pianist of his generation before he turned 20.

He was also deeply, destructively mentally ill — subjected to electroshock therapy in the 1940s after a run-in with Philadelphia police that left him with a fractured skull. The treatments damaged him permanently. He spent years in and out of hospitals throughout his career, often unable to perform, his brilliance flickering on and off as his mental state allowed.

What survives is extraordinary: the Blue Note recordings of 1949-51 are among the most technically astonishing piano playing ever captured, executed by a man who was simultaneously fighting his own mind. He died in 1966 at 41, back in New York, having spent his last decade in Paris in a strange, semi-functional exile. The music he made in his years of health is permanent.`,
    workIds: ['powell_amazing'],
  },
  max_roach: {
    id: 'max_roach',
    topicId: 'bebop',
    name: `Max Roach`,
    years: `1924–2007`,
    nationality: 'American',
    imageCredit: 'William P. Gottlieb / Library of Congress / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Max_Roach%2C_Three_Deuces%2C_ca._1947.jpg/330px-Max_Roach%2C_Three_Deuces%2C_ca._1947.jpg',
    tagline: `The drummer who turned percussion into melody and jazz into argument.`,
    primer: `Max Roach reinvented jazz drumming. Before him, the drummer's job was to keep time for everyone else. After him, the drum set became a melodic and compositional instrument — capable of rhythm, tone, melody, and argument. He was bebop's rhythmic foundation and bebop's most politically engaged voice.

He recorded with Parker and Gillespie at the founding sessions of bebop, then partnered with Clifford Brown to form one of the greatest small groups in jazz history. When Brown died in 1956, Roach turned his grief into political music: "We Insist! Freedom Now Suite" in 1960 is the most explicitly political record in jazz, made at the height of the Civil Rights movement with Abbey Lincoln's voice as its center.

He kept evolving: collaborating with chamber ensembles, string quartets, hip-hop artists, spoken word poets. He taught at the University of Massachusetts for decades while continuing to record and perform. He died in 2007 at 83, still composing. The drum set he played had never sounded the same since he first sat behind one.`,
    workIds: ['roach_freedom'],
  },

  // HARD BOP
  miles_davis: {
    id: 'miles_davis',
    topicId: 'hard_bop',
    name: `Miles Davis`,
    years: `1926–1991`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Miles_Davis_by_Palumbo_cropped.jpg/330px-Miles_Davis_by_Palumbo_cropped.jpg',
    tagline: `The musician who reinvented jazz five times — and meant it every time.`,
    primer: `Miles Davis is the most important figure in 20th-century jazz — not because any single album is the greatest ever made, but because he reinvented himself so completely, so many times, that his career traces the entire evolution of the music. He came to New York in 1944 to study at Juilliard and immediately found Parker. He was playing bebop at 18.

Then came the Birth of the Cool sessions in 1949 — cool jazz, more relaxed, more European-influenced. Then hard bop with the first great quintet. Then Kind of Blue in 1959, the best-selling jazz album ever made, which launched modal jazz. Then Bitches Brew in 1970, which launched fusion. Then hip-hop and electronic music in the 1980s. Every time he changed, a generation of musicians followed.

He played with an unmatched economy of tone: fewer notes, more space, each sound placed with surgical intention. Asked about his method, he said: "It takes a long time to play like yourself." He spent 47 years figuring out how.`,
    workIds: ['miles_midnight', 'miles_kind_of_blue', 'miles_in_silent_way', 'miles_bitches_brew'],
  },
  art_blakey: {
    id: 'art_blakey',
    topicId: 'hard_bop',
    name: `Art Blakey`,
    years: `1919–1990`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Art_blakey_studio_portrait.jpg/330px-Art_blakey_studio_portrait.jpg',
    tagline: `Jazz's greatest teacher — the man who built the next generation on his drumbeat.`,
    primer: `Art Blakey was jazz's greatest educator. His band, the Jazz Messengers, cycled through a half-century of young talent — Lee Morgan, Freddie Hubbard, Wayne Shorter, Branford Marsalis, Wynton Marsalis, Keith Jarrett — and turned them into major artists. The education happened live, on stage, every night: Blakey pushed players to find things they didn't know they had, then pushed harder.

His drumming was the curriculum. It was powerful, swinging, driving — the most physical drumming in hard bop, the kind that made it impossible not to feel the music in your body before your mind caught up. He played from the chest and the gut simultaneously. When he hit the snare, the whole room moved.

The Jazz Messengers in various configurations played continuously from 1955 until Blakey's death in 1990. He hired musicians young, cheap, and talented, burned them bright for two or three years, and released them into the world as fully formed artists. Nearly every major jazz musician of the post-bebop generation passed through his band. He charged nothing for the education. He considered it a debt he owed to the music.`,
    workIds: ['blakey_moanin'],
  },
  horace_silver: {
    id: 'horace_silver',
    topicId: 'hard_bop',
    name: `Horace Silver`,
    years: `1928–2014`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Horace_Silver_by_Dmitri_Savitski_1989.jpg/330px-Horace_Silver_by_Dmitri_Savitski_1989.jpg',
    tagline: `The composer who taught bebop to groove.`,
    primer: `Horace Silver wrote the blueprint for hard bop. His compositions — "The Preacher," "Doodlin'," "Nica's Dream," "Señor Blues," "Song for My Father" — are the repertoire: bluesy, funky, built on rhythms that made bebop move again. He co-led the Jazz Messengers with Art Blakey in the early years before forming his own quintet, and the quintet became one of the most consistent working groups in jazz.

Silver was the first to understand that bebop's harmonic complexity and jazz\'s roots in Black church music weren\'t opposites — they were the same thing, differently expressed. The gospel-inflected piano voicings, the blues-based melodies, the hard swing: these were the bones of Black American musical tradition, wrapped in the sophistication bebop had added. Nothing was lost. Everything was added.

His music still sounds alive because the blues doesn't age, and Silver never forgot where the blues lived. His Cape Verdean heritage — his father was an immigrant — gave his music a rhythmic quality slightly outside the mainstream of American jazz, a touch of something older and more specific. "Song for My Father" was his most personal statement. It was also his most universal.`,
    workIds: ['silver_song'],
  },
  clifford_brown: {
    id: 'clifford_brown',
    topicId: 'hard_bop',
    name: `Clifford Brown`,
    years: `1930–1956`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Clifford_Brown_1956.jpg/330px-Clifford_Brown_1956.jpg',
    tagline: `Three years of recordings. Enough for a complete legacy.`,
    primer: `Clifford Brown was 25 when he died in a car accident on the Pennsylvania Turnpike in 1956, and he had already made himself into one of the most complete musicians in jazz history. In three recording years — 1953 to 1956 — he established a lyrical, technically flawless trumpet voice that became the template for every hard bop trumpeter who followed.

Lee Morgan heard him and modeled his entire early style on what Brown had done. Freddie Hubbard heard him. Woody Shaw heard him. Wynton Marsalis heard him. The line runs direct: from Clifford Brown to every major hard bop trumpeter of the next 30 years.

His partnership with Max Roach was unprecedented — two co-leaders, equal in musical authority, building something neither could have built alone. They played Birdland together. They played the Village Vanguard. They were in the middle of a run that was getting better every month when the car went off the Pennsylvania Turnpike at 3 a.m. Brown died instantly. He was 25. Every note he ever played is on record, and the completeness of what he left behind given the time he had is almost unbearable to consider.`,
    workIds: ['brown_roach'],
  },
  sonny_rollins: {
    id: 'sonny_rollins',
    topicId: 'hard_bop',
    name: `Sonny Rollins`,
    years: `1930–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sonny_Rollins_2011.jpg/330px-Sonny_Rollins_2011.jpg',
    tagline: `The greatest improviser in jazz — for 60 years and counting.`,
    primer: `Sonny Rollins is the greatest living improviser in jazz, and has been for 60 years. His tenor saxophone work in the 1950s defined what a jazz soloist could do: motivic development at impossible tempos, an impossible range of musical reference (quoting Broadway show tunes, calypso melodies, classical themes in the middle of a bebop solo), and absolute harmonic control at any speed.

In 1959, he stopped performing to practice — not because he wasn't good enough, but because he thought he could be better. He went to the Williamsburg Bridge every day for two years and practiced alone over the traffic. When he came back in 1962 with The Bridge, people could hear the difference.

He has continued to disappear and reappear ever since: each sabbatical followed by a return with something unexpected, something that proves the practice had a purpose. The 1957 recordings at the Village Vanguard — without a piano, just bass and drums — are the best introduction: a man finding out what he can do, live, in a room, with nothing to fall back on. He was 26. He hasn't stopped since.`,
    workIds: ['rollins_vanguard'],
  },

  // MODAL JAZZ
  coltrane: {
    id: 'coltrane',
    topicId: 'modal_jazz',
    name: `John Coltrane`,
    years: `1926–1967`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/John_Coltrane_1963_cropped_ver2.jpg/330px-John_Coltrane_1963_cropped_ver2.jpg',
    tagline: `The saxophonist who spent his career trying to reach God — and got closer than anyone.`,
    primer: `John Coltrane spent his career in pursuit of something he could never quite name — a music that was simultaneously technically perfect and spiritually transcendent, that could hold the entire human experience in improvised sound. He got closer than anyone.

His development is the most dramatic in jazz history: from hard bop sideman with Miles Davis (1955-60), through the "sheets of sound" of his Atlantic period, through the modal masterpieces on Impulse! — A Love Supreme, Live at the Village Vanguard, Crescent, A Love Supreme — to the free jazz of his final years (1965-67), which pushed beyond anything the music had done before and left his collaborators and his audience behind simultaneously.

He died in 1967 at 40, of liver cancer. He had recorded A Love Supreme three years earlier. He had been trying to go further ever since. The question of what came after those final recordings — where he was heading when his body stopped — is the most compelling unanswered question in jazz. The Village Vanguard, where his quartet played more than anywhere else, is where you feel the absence most clearly.`,
    workIds: ['coltrane_blue_train', 'coltrane_my_favorite', 'coltrane_giant_steps', 'coltrane_love'],
  },
  bill_evans: {
    id: 'bill_evans',
    topicId: 'modal_jazz',
    name: `Bill Evans`,
    years: `1929–1980`,
    nationality: 'American',
    imageCredit: 'Steve Schapiro / Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg/330px-Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg',
    tagline: `The pianist who changed how jazz harmony sounds — and never stopped paying for it.`,
    primer: `Bill Evans changed how people think about the piano in jazz. His chord voicings — close, dense, harmonically ambiguous, borrowed from classical impressionism — are so pervasive in post-1960 jazz piano that musicians call certain chord structures "Evansian" as a matter of course. He played with Miles Davis on Kind of Blue (1959), his right-hand lines floating over his own left-hand harmonies like nothing anyone had heard.

Then he formed his own trio and spent the 1960s making recordings at the Village Vanguard — Sunday at the Village Vanguard and Waltz for Debby, both from the same June 1961 session — that remain among the most beautiful recordings in American music. The bassist, Scott LaFaro, died eleven days later at 25. Evans was devastated and largely stopped performing for months.

He kept working, through addiction and illness and loss, until 1980. The music he made in his final years was as harmonically complete as anything he had done in 1961. He died of a bleeding ulcer, liver failure, and bronchial pneumonia — the accumulated cost of a heroin habit he never fully escaped. He was 51. He left behind a body of work that will not be surpassed.`,
    workIds: ['evans_sunday', 'evans_waltz_debby', 'evans_conversations'],
  },
  wayne_shorter: {
    id: 'wayne_shorter',
    topicId: 'modal_jazz',
    name: `Wayne Shorter`,
    years: `1933–2023`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Wayne-Shorter_in_Amsterdam%2C_1980.jpg/330px-Wayne-Shorter_in_Amsterdam%2C_1980.jpg',
    tagline: `Jazz's greatest composer — the man who made the inexplicable sound inevitable.`,
    primer: `Wayne Shorter is jazz's greatest composer, full stop. His pieces — "Infant Eyes," "Footprints," "Nefertiti," "ESP," "Witch Hunt," "Speak No Evil," "Fee-Fi-Fo-Fum" — have a quality unlike anyone else's: melodically unusual, harmonically mysterious, structurally unpredictable in ways that feel inevitable in retrospect. You hear them once and they sound strange. You hear them ten times and you can't understand why they couldn't have been written any other way.

He was the musical director of Art Blakey's Jazz Messengers (1959-63), composing the material that defined the band\'s mature sound. Then the compositional engine of the Miles Davis second great quintet (1964-68), writing pieces that pushed the band into unexplored territory every night. Then co-founder of Weather Report. Then his late quartet recordings on Verve (2001-2018), which were among the most adventurous music anyone made in the 21st century.

He died in 2023, at 89, having composed music that will be played for as long as jazz is played. His silence on stage was as compositional as his notes — he understood that what you don't play shapes what you do, and that the space around a melody is part of the melody.`,
    workIds: ['shorter_speak'],
  },
  mccoy_tyner: {
    id: 'mccoy_tyner',
    topicId: 'modal_jazz',
    name: `McCoy Tyner`,
    years: `1938–2020`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Mccoy_Tyner_1973_gh_%28cropped%29.jpg/330px-Mccoy_Tyner_1973_gh_%28cropped%29.jpg',
    tagline: `The pianist who invented the sound of modal jazz — and then had to find himself again.`,
    primer: `McCoy Tyner was John Coltrane's pianist from 1960 to 1965, and in that role he helped invent the vocabulary of modal jazz piano: massive left-hand quartal chords, stacked in fourths rather than thirds, creating the dense, resonant harmonic foundation over which Coltrane could go anywhere. Every modal jazz pianist since has learned from what Tyner built in those five years.

When Coltrane moved into free jazz in 1965 — louder, more abstract, without fixed harmonic reference — Tyner left the group. The music had become something he couldn't find himself in. He spent the next several years finding his own voice as a leader, separate from the role he had played as Coltrane\'s anchor.

The Real McCoy (1967) is where that voice fully emerges: physical, rhythmically intense, harmonically his own rather than modal jazz's generic. He continued recording and performing until 2018, earning a place as one of the most distinctive pianists in jazz history — not as Coltrane\'s pianist, but as McCoy Tyner. He died in 2020 at 81. The quartal chords he built into the music will outlast everything.`,
    workIds: ['tyner_real'],
  },
  herbie_hancock: {
    id: 'herbie_hancock',
    topicId: 'modal_jazz',
    name: `Herbie Hancock`,
    years: `1940–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Herbie_Hancock_2023.jpg/330px-Herbie_Hancock_2023.jpg',
    tagline: `From modal jazz to funk to hip-hop — the musician who refused to stop moving.`,
    primer: `Herbie Hancock was 23 when he recorded Maiden Voyage (1965) for Blue Note — an album so harmonically advanced and emotionally complete that it sounds like it was made by someone 20 years older. He had already been Miles Davis's pianist for two years, writing "Watermelon Man" and "Cantaloupe Island" and developing the chord vocabulary that would define modal jazz piano's second generation.

After the Davis Quintet, he invented jazz-funk with the Headhunters (1973), produced Michael Jackson and Stevie Wonder, won the Oscar for his Round Midnight soundtrack, recorded a Grammy-winning album of Joni Mitchell interpretations at 67, and has never stopped finding new directions. He is the most genre-spanning musician in jazz history — not because he can't commit to a style, but because he finds them all equally interesting.

The thread running through everything is the harmonic intelligence: the ability to understand what a chord can do that it hasn't done yet, and to build something original from that understanding. At 23 or 83, that capacity has never diminished.`,
    workIds: ['hancock_maiden'],
  },

  // FREE JAZZ
  ornette_coleman: {
    id: 'ornette_coleman',
    topicId: 'free_jazz',
    name: `Ornette Coleman`,
    years: `1930–2015`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Ornette-Coleman-2008-Heidelberg-schindelbeck.jpg/330px-Ornette-Coleman-2008-Heidelberg-schindelbeck.jpg',
    tagline: `The man who removed the rules — and proved the music was stronger without them.`,
    primer: `Ornette Coleman arrived in New York in 1959 from Los Angeles and was immediately the most controversial musician in the city. His quartet's residency at the Five Spot Café split the jazz world permanently in two: Miles Davis called him a fake; Leonard Bernstein came to listen every night; Gunther Schuller wrote that he was hearing the future.

Coleman's innovation was playing without fixed chord changes — the harmonic structure that had organized jazz improvisation since its beginning. His "harmolodics" theory argued that melody, harmony, and rhythm were equal elements, none of which should be subordinate to the others. In practice, this meant improvising from emotional and melodic logic rather than from chord sequences. The results were simultaneously more free and more disciplined than anything that had come before.

He won the Pulitzer Prize in 2007 and the MacArthur "Genius" Fellowship. He died in 2015 at 85, having spent 56 years being right about something that took everyone else decades to accept. Smalls Jazz Club, New York's great experimental room, carries the spirit of what Coleman brought to the city in 1959.`,
    workIds: ['coleman_shape'],
  },
  charles_mingus: {
    id: 'charles_mingus',
    topicId: 'free_jazz',
    name: `Charles Mingus`,
    years: `1922–1979`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Charles_Mingus_1976_cropped.jpg/330px-Charles_Mingus_1976_cropped.jpg',
    tagline: `Jazz's angriest genius and one of its greatest composers.`,
    primer: `Charles Mingus was jazz's angriest genius and one of its greatest composers. He wrote for the specific musicians in his band — compositions that required them to be themselves within structures he built for them — and what resulted was music that was simultaneously more composed and more free than anything else being made in the 1950s and '60s.

"Fables of Faubus" named and mocked the Arkansas governor who tried to stop school integration. "Hog Callin' Blues" came from his childhood in Los Angeles. "The Black Saint and the Sinner Lady" is a 35-minute ballet for jazz orchestra. He wrote an autobiography called Beneath the Underdog that is the strangest memoir in music — part fiction, part fantasy, part confession, entirely himself.

He also screamed at audiences, fired musicians mid-performance, and kept a loaded pistol in his bass case. He was furious, and the fury was inseparable from the genius: Mingus felt everything too much, including the music, and that excess was the source of his greatest work. He died at 56 of ALS, his hands already stilled. The music he left behind has never been equaled in scale of ambition.`,
    workIds: ['mingus_black_saint'],
  },
  cecil_taylor: {
    id: 'cecil_taylor',
    topicId: 'free_jazz',
    name: `Cecil Taylor`,
    years: `1929–2018`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Cecil_taylor_E5122329-2.jpg/330px-Cecil_taylor_E5122329-2.jpg',
    tagline: `The pianist who turned the keyboard into percussion and music into force.`,
    primer: `Cecil Taylor played piano as a percussive instrument, a rhythmic instrument, an instrument that could produce dense, non-tonal clusters of sound at enormous speed. He studied at the New England Conservatory but found European classical music's hierarchies incompatible with what he wanted to do. What he wanted to do took decades to find an audience — and then it found one entirely on his own terms.

His Unit — shifting casts of musicians organized around his compositional ideas — played free jazz as total music: every element (rhythm, melody, harmony, texture) simultaneously available, none of them dominant. Performances could last three hours. Taylor himself, when he played solo, played until his body gave out and then played more.

He died in 2018 at 89, having spent 60 years making music that still doesn't fit any category. His influence on subsequent experimental pianists is immeasurable — not because anyone plays like him (no one can), but because he proved the piano could do things no one had imagined it capable of. The Blue Note label, for all its bebop and hard bop identity, recognized something important in Taylor and documented it. The resulting recordings are the label\'s most uncompromising.`,
    workIds: ['taylor_unit'],
  },
  albert_ayler: {
    id: 'albert_ayler',
    topicId: 'free_jazz',
    name: `Albert Ayler`,
    years: `1936–1970`,
    nationality: 'American',
    imageCredit: 'ABC Impulse! Records / Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Albert_Ayler_%281967%E2%80%9368_photo_portrait_for_ABC_Impulse%21%29.jpg/330px-Albert_Ayler_%281967%E2%80%9368_photo_portrait_for_ABC_Impulse%21%29.jpg',
    tagline: `The saxophonist who went back before music — and found something older.`,
    primer: `Albert Ayler played tenor saxophone as if he were trying to return the instrument to something before music — to pure sound, pure emotion, pure spiritual statement. His Spiritual Unity (1964) is three tracks, three improvisations for saxophone, bass, and drums, each one an extended cry. He described his own music as "going back to the roots" — to folk songs and marching band melodies, then exploding them through the force of raw feeling.

He had come from Cleveland, spent time in the Army, played in France and Scandinavia before arriving in New York in the early 1960s. The jazz world wasn't ready for him. ESP-Disk, a tiny independent label, released Spiritual Unity because no one else would. John Coltrane called him the most unique musician he had ever heard. Ornette Coleman recognized a kindred spirit.

He was found floating in the East River in November 1970 at 34. The circumstances were never fully explained. He left behind a small, complete, irreducible body of work — a few years of recordings that still sound like nothing before or since. Smalls, where New York's most adventurous jazz happens nightly, is the room where his tradition continues.`,
    workIds: ['ayler_spiritual'],
  },
  eric_dolphy: {
    id: 'eric_dolphy',
    topicId: 'free_jazz',
    name: `Eric Dolphy`,
    years: `1928–1964`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/86/Eric_Dolphy.jpg',
    tagline: `Three instruments, one complete vision — and only six years to show it.`,
    primer: `Eric Dolphy played bass clarinet, alto saxophone, and flute — three instruments, three complete vocabularies, each one extended to its limit. On bass clarinet, he played in a register that made the instrument sound like something prehistoric. On alto saxophone, he played with a harmonic sophistication that bridged bebop and free jazz without being reducible to either. On flute, he played lines so fast and so outside conventional jazz vocabulary that audiences didn't know what to do with them.

He grew up in Los Angeles, came to New York, worked with Charles Mingus and John Coltrane, and recorded a series of albums for Blue Note in the early 1960s that form one of the most original bodies of work in jazz. He was part of Coltrane's group during the "Africa / Brass" and "Live at the Village Vanguard" sessions — Coltrane called him the most complete musician he had ever played with.

He went to Europe in the spring of 1964 and died in Berlin in June, of undiagnosed diabetic shock, at 36. Out to Lunch! had been recorded in February. He didn't live to hear its reception. The Blue Note label released it as his final statement; it is, in every sense, complete.`,
    workIds: ['dolphy_lunch'],
  },

  // POST-BOP
  keith_jarrett: {
    id: 'keith_jarrett',
    topicId: 'post_bop',
    name: `Keith Jarrett`,
    years: `1945–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Keith_Jarrett.jpg/330px-Keith_Jarrett.jpg',
    tagline: `The pianist who improvised for three hours at a time — and proved it was composition.`,
    primer: `Keith Jarrett has been making music that defies category for five decades. The Köln Concert (1975) — an improvised piano solo recorded live in Germany, unplanned, on a defective instrument — became the best-selling solo jazz album in history. It was made in one take, in its entirety, because the concert had to begin even though the piano was wrong.

His Standards Trio with Gary Peacock and Jack DeJohnette turned jazz standards into the medium for the deepest kind of musical conversation: three musicians who had played together long enough to share a nervous system, treating familiar songs as the starting point for completely original music. They recorded at the Village Vanguard and the Blue Note, and the recordings from both venues are among the finest jazz documents of the last 40 years.

He suffered two strokes in 2018 and has not performed publicly since. In interviews, he has been matter-of-fact about this: the music stopped when the body stopped. What remains is an archive of improvised music, solo and trio, that spans 50 years and shows a pianist who never played the same thing twice, always making something that had never existed before he sat down.`,
    workIds: ['jarrett_blue_note'],
  },
  wynton_marsalis: {
    id: 'wynton_marsalis',
    topicId: 'post_bop',
    name: `Wynton Marsalis`,
    years: `1961–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Wynton_Marsalis_2009_09_13.jpg/330px-Wynton_Marsalis_2009_09_13.jpg',
    tagline: `The trumpeter who built an institution — and started an argument that never ended.`,
    primer: `Wynton Marsalis is the most accomplished and most argued-about figure in contemporary jazz. At 19, he was already technically the most complete trumpeter since Clifford Brown; by his mid-20s he was winning Grammy Awards in both jazz and classical categories simultaneously — the only musician ever to do so in the same year.

As artistic director of Jazz at Lincoln Center since 1991, he built the most powerful jazz institution in America — three performance spaces, a full-time orchestra, an education program that reaches millions of students. He has also been criticized for a programming vision that critics say overvalues the jazz tradition and undervalues experimentation, that favors a particular historical canon at the expense of the music's continuous evolution.

The argument about Marsalis is the argument about jazz itself: what does it mean to preserve something that was always defined by its willingness to change? He has never resolved this tension, and the music he makes suggests he doesn't think it should be resolved — that the tension between tradition and innovation is where the music lives. He may be right. He is certainly the most important institutional force in jazz since the 1980s.`,
    workIds: ['marsalis_black_codes'],
  },
  pat_metheny: {
    id: 'pat_metheny',
    topicId: 'post_bop',
    name: `Pat Metheny`,
    years: `1954–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Pat_metheny_orch2.jpg/330px-Pat_metheny_orch2.jpg',
    tagline: `The guitarist who expanded jazz to include everything he ever heard.`,
    primer: `Pat Metheny grew up in Missouri, moved to Boston at 17 to study at Berklee, and was teaching there at 19 — the youngest professor in the school's history. His first album, Bright Size Life (1976), made at 21 with Jaco Pastorius and Bob Moses, announced a new sensibility: jazz guitar influenced by country, folk, and rock as much as by bebop, voicing chords in ways no one had heard on the instrument before.

Over 50 years of recording, he has covered more stylistic territory than any other jazz guitarist: ECM chamber jazz, Pat Metheny Group's commercial fusion, acoustic duets with Charlie Haden, the machine-gun improv of Ornette Coleman collaborations, orchestral compositions, a solo guitar album (One Quiet Night) of disarming simplicity. He has won more Grammy Awards than any other jazz musician.

The thread through everything is the guitar tone — warm, clear, singing, immediately recognizable — and the compositional intelligence. Metheny writes melodies that stay in your head and arrangements that reveal more structure on each listening. He has never made an album that sounds like any previous album. This is what a career built on curiosity rather than brand looks like.`,
    workIds: ['metheny_bright'],
  },
  brad_mehldau: {
    id: 'brad_mehldau',
    topicId: 'post_bop',
    name: `Brad Mehldau`,
    years: `1970–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Brad_Mehldau-9035.jpg/330px-Brad_Mehldau-9035.jpg',
    tagline: `The pianist who brought Bach, Radiohead, and jazz into the same room.`,
    primer: `Brad Mehldau brought a new kind of musical consciousness to jazz piano in the 1990s: deeply informed by Bach's counterpoint, Radiohead's harmonic ambiguity, and the jazz tradition simultaneously, capable of playing three independent voices in his two hands while maintaining complete rhythmic and harmonic freedom. His Art of the Trio recordings (1996-99) are the defining piano trio statement of their generation.

He was one of the first jazz musicians to demonstrate that contemporary rock and pop songs — Radiohead, Nick Drake, Paul Simon — could be played as jazz without irony or condescension, just as musical material rich enough to sustain improvisation. This wasn't novelty or crossover marketing; it was a musician treating the music he actually listened to as seriously as the music he was trained in.

He plays regularly at the Village Vanguard, which remains the room where jazz piano is most seriously tested. Hearing Mehldau there, in the same room where Bill Evans recorded Sunday at the Village Vanguard in 1961, creates a connection across 60 years of the music's development — different voices, the same commitment to finding what the piano can say that nothing else can.`,
    workIds: ['mehldau_trio'],
  },
  roy_hargrove: {
    id: 'roy_hargrove',
    topicId: 'post_bop',
    name: `Roy Hargrove`,
    years: `1969–2018`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Roy_Hargrove_Quintet_%28ZMF_2018%29_IMGP7150.jpg/330px-Roy_Hargrove_Quintet_%28ZMF_2018%29_IMGP7150.jpg',
    tagline: `The trumpeter who built bridges between jazz, Cuba, and hip-hop — and kept the tradition burning.`,
    primer: `Roy Hargrove was the most gifted young trumpeter of his generation. Wynton Marsalis heard him play in a Dallas high school in 1987 and told him immediately: you need to come to New York. He got there and never really left — the city, the tradition, the Village Vanguard on Monday nights.

He played straight-ahead hard bop with complete conviction. He also incorporated Cuban rhythms (the Crisol project, including the Grammy-winning Habana in 1997), R&B and hip-hop influences (RH Factor), and collaborations with D'Angelo, Common, Erykah Badu — building bridges between jazz and the music of his actual generation without compromising either direction. The musicians on both sides heard him and took him seriously.

He was a Village Vanguard regular for 30 years. He died in 2018 at 49, of kidney disease, leaving behind a recording career of extraordinary range and a reputation among fellow musicians as one of the most generous, most committed, most deeply musical people any of them had known. The Vanguard still books his quintet. The rooms he played are still there. The music he made in them is the kind that lasts.`,
    workIds: ['hargrove_habana'],
  },

  // ── BAROQUE ─────────────────────────────────────────
  bach: {
    id: 'bach',
    topicId: 'baroque',
    name: `Johann Sebastian Bach`,
    years: `1685–1750`,
    nationality: 'German',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/330px-Johann_Sebastian_Bach.jpg',
    tagline: `The composer against whom all other composers are measured — who spent his career in provincial Germany and changed music forever.`,
    primer: `Johann Sebastian Bach was born in Eisenach in 1685, the youngest son of a family of musicians so prolific that 'Bach' was essentially synonymous with 'musician' in central Germany for three generations. He spent his working life in small German towns: Arnstadt, Mühlhausen, Weimar, Köthen, and finally Leipzig, where he served as cantor of St. Thomas Church for 27 years. He never left Germany. He died in 1750, largely forgotten. His music was considered old-fashioned.

Then, in 1829, the 20-year-old Felix Mendelssohn conducted a performance of the St. Matthew Passion in Berlin — 79 years after Bach's death — and the revival began. What musicians discovered was that Bach had solved problems no one had known needed solving: counterpoint, harmony, form, the architecture of musical argument. Every subsequent composer studied him. Wagner. Brahms. Schoenberg. Stravinsky. There is no school of Western music that does not run through Bach.

What makes Bach inexhaustible is his combination of technical mastery and emotional depth. The Well-Tempered Clavier, the Mass in B minor, the St. Matthew Passion, the Brandenburg Concertos: these are works of such formal ambition and such feeling that they have never become historical documents. They are still alive.`,
    workIds: ['bach_brandenb3'],
  },
  handel: {
    id: 'handel',
    topicId: 'baroque',
    name: `George Frideric Handel`,
    years: `1685–1759`,
    nationality: 'German-British',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/George_Frideric_Handel_by_Balthasar_Denner.jpg/330px-George_Frideric_Handel_by_Balthasar_Denner.jpg',
    tagline: `The showman who made sacred music feel like opera — and made audiences stand up.`,
    primer: `George Frideric Handel was born in Halle, Germany, in 1685 — the same year as Bach, making 1685 one of the most significant years in Western music — and spent most of his career in London, where he arrived in 1711 and remained for the rest of his life. He is the great cosmopolitan of Baroque music: German by birth, Italian by training, British by adoption and eventual naturalization.

Handel was, above all, a man of the theater. He wrote 42 operas and established Italian opera in England almost single-handedly. When Italian opera fell out of fashion in London, he invented English oratorio — large-scale dramatic works for soloists, chorus, and orchestra, performed in concert halls rather than theaters, on Biblical rather than mythological subjects. Messiah (1741) is the most famous, but Israel in Egypt, Judas Maccabaeus, and Belshazzar are almost as remarkable.

Handel was also a superb businessman, a celebrity in his own lifetime, and blind in his final years — he continued to conduct from memory. He left his entire estate to charity. He was buried in Westminster Abbey, where 3,000 people attended his funeral.`,
    workIds: ['handel_messiah'],
  },
  vivaldi: {
    id: 'vivaldi',
    topicId: 'baroque',
    name: `Antonio Vivaldi`,
    years: `1678–1741`,
    nationality: 'Italian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Vivaldi.jpg/330px-Vivaldi.jpg',
    tagline: `The red priest who wrote 500 concertos and invented the music video 300 years early.`,
    primer: `Antonio Vivaldi was born in Venice in 1678, the son of a barber-violinist. He was ordained as a Catholic priest but rarely said Mass, claiming poor health, and spent most of his career as a violin teacher and composer at the Ospedale della Pietà, a Venetian institution that educated orphaned girls. The Pietà's music school became famous across Europe, and Vivaldi wrote most of his concertos for its students.

Vivaldi was extraordinarily prolific: 500 concertos, 50 operas, sacred music, chamber works. He was also, by some measures, the first composer to think systematically about program music — music that illustrates extra-musical ideas. The Four Seasons (1725) came with sonnets describing what the music depicted. This was unusual for 1725 and anticipates the Romantic era by a century.

Vivaldi died in Vienna in 1741, in debt and largely forgotten. His music was rediscovered in the 20th century, and the Four Seasons became one of the most recorded pieces of music ever written. He is now heard on more recordings than Bach — a fact that would have astonished both of them.`,
    workIds: ['vivaldi_four_seasons'],
  },
  purcell: {
    id: 'purcell',
    topicId: 'baroque',
    name: `Henry Purcell`,
    years: `1659–1695`,
    nationality: 'English',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Henry_Purcell_Closterman.jpg/330px-Henry_Purcell_Closterman.jpg',
    tagline: "England's greatest composer — who died at 36 and left an opera that still breaks hearts.",
    primer: `Henry Purcell was born in London around 1659, into a family of musicians connected to the English royal court. He was appointed organist of Westminster Abbey at 20 and composed music for the coronation of James II. He wrote anthems, odes, theater music, and chamber works at an extraordinary rate for the remaining 15 years of his life.

Purcell died in 1695, probably of tuberculosis, at around 36. In that short life he created the only body of English Baroque music that stands comparison with the great continental composers. His musical language is distinctive — more harmonically adventurous than most English contemporaries, deeply influenced by Italian chromaticism, and capable of a kind of direct emotional expression that feels modern even by 21st-century standards.

Dido and Aeneas (c. 1689), written for a girls' school in Chelsea, is his most performed work. Its lament for the dying Dido — built over a chromatic ground bass that repeats without mercy — is one of the most devastating pieces of music ever written. That Purcell could produce it at 30, for schoolchildren, is still astonishing.`,
    workIds: ['purcell_dido'],
  },
  monteverdi: {
    id: 'monteverdi',
    topicId: 'baroque',
    name: `Claudio Monteverdi`,
    years: `1567–1643`,
    nationality: 'Italian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Bernardo_Strozzi_-_Claudio_Monteverdi_%28c.1630%29.jpg/330px-Bernardo_Strozzi_-_Claudio_Monteverdi_%28c.1630%29.jpg',
    tagline: `The inventor of opera — who made music tell stories in a way no one had imagined before.`,
    primer: `Claudio Monteverdi was born in Cremona in 1567 and spent most of his career first at the Gonzaga court in Mantua and then, from 1613 until his death, as maestro di cappella at St. Mark's Basilica in Venice — the most prestigious musical position in Italy. He lived through the entire transition from the Renaissance to the Baroque and was its central figure.

Monteverdi did not invent opera. A group of Florentine intellectuals — the Camerata — had been experimenting with sung drama since the 1580s, trying to recreate what they imagined ancient Greek theater had sounded like. But their experiments were academic; they sacrificed musical beauty for dramatic speech. Monteverdi, in L'Orfeo (1607), found the synthesis: music that was both dramatically direct and musically magnificent.

Monteverdi lived to be 76, extraordinary for the 17th century. His final operas — L'incoronazione di Poppea and Il ritorno d\'Ulisse in patria — were written when he was in his mid-70s, and they are arguably his greatest achievements: psychologically complex, harmonically adventurous, and full of an emotional directness that would not be surpassed until Mozart.`,
    workIds: ['monteverdi_orfeo'],
  },

  // ── CLASSICAL PERIOD ─────────────────────────────────────────
  mozart: {
    id: 'mozart',
    topicId: 'classical_period',
    name: `Wolfgang Amadeus Mozart`,
    years: `1756–1791`,
    nationality: 'Austrian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/The_Mozart_Family_-_Wolfgang_Amadeus_Mozart_headshot.jpg/330px-The_Mozart_Family_-_Wolfgang_Amadeus_Mozart_headshot.jpg',
    tagline: `The prodigy who wrote 626 works by 35 — and somehow made each one feel effortless.`,
    primer: `Wolfgang Amadeus Mozart was born in Salzburg in 1756, the son of Leopold Mozart, a court musician and ambitious teacher. Mozart gave his first public performance at age 5 and was composing by 6. His father recognized immediately that his son was extraordinary and spent the next decade taking him across Europe to perform for royalty and aristocracy.

Mozart's adult career was less triumphant than his childhood. He quarreled with his employer, the Archbishop of Salzburg, and moved to Vienna in 1781 hoping for a court appointment that never came with adequate compensation. He married, had six children (only two survived to adulthood), struggled financially, and composed at a rate that still defies comprehension: 41 symphonies, 27 piano concertos, 23 string quartets, 22 operas, and hundreds of other works, many of them among the greatest things in Western music.

Mozart died in Vienna in December 1791, at 35, of rheumatic fever. He was buried in an unmarked communal grave — the standard procedure in Vienna at the time — and no one recorded the location. The greatest composer who ever lived left no grave to visit.`,
    workIds: ['mozart_sym40'],
  },
  beethoven: {
    id: 'beethoven',
    topicId: 'classical_period',
    name: `Ludwig van Beethoven`,
    years: `1770–1827`,
    nationality: 'German',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg/330px-Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg',
    tagline: `The composer who went deaf, kept writing, and made struggle itself sound like triumph.`,
    primer: `Ludwig van Beethoven was born in Bonn in 1770, the grandson of a Flemish musician and the son of an alcoholic court tenor. He moved to Vienna at 22 to study with Haydn and remained there for the rest of his life. In Vienna he became famous first as a pianist — the finest improviser of his age — and then as a composer whose ambition exceeded anything his predecessors had attempted.

In his late 20s, Beethoven began losing his hearing. By 1802 it was severe enough that he contemplated suicide. He wrote about this crisis in a letter known as the Heiligenstadt Testament, which was found after his death and is one of the most moving documents in music history. He resolved to continue. The works that followed — the Fifth Symphony, the Razumovsky Quartets, the piano concertos, the late piano sonatas — constitute the most sustained creative achievement of any composer in history.

Beethoven went completely deaf in his mid-40s and continued composing. His last works — the Ninth Symphony, the late string quartets, the Missa Solemnis — were written in total silence and are among the most radical, forward-pointing, and emotionally complex pieces ever made. He was composing things that audiences would not understand for another century.`,
    workIds: ['beethoven_sym5'],
  },
  haydn: {
    id: 'haydn',
    topicId: 'classical_period',
    name: `Joseph Haydn`,
    years: `1732–1809`,
    nationality: 'Austrian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Joseph_Haydn.jpg/330px-Joseph_Haydn.jpg',
    tagline: `The father of the symphony and string quartet — who invented the forms and spent 40 years perfecting them.`,
    primer: `Joseph Haydn was born in Rohrau, a small Austrian village, in 1732. He spent 29 years as Kapellmeister (music director) for the Esterhazy family, one of the wealthiest noble families in the Habsburg Empire, working in relative isolation at their palaces. This isolation, as he later observed, forced him to be original: he had no one to rely on but himself.

In that isolated court, Haydn essentially invented the classical symphony and the string quartet. He wrote 104 symphonies and 68 string quartets, and by the time he was done he had established the formal conventions that Beethoven would inherit and transform. The remarkable thing is not just the quantity but the quality: the late symphonies, especially the twelve London Symphonies he wrote for English audiences at the end of his career, are masterworks of wit, formal intelligence, and emotional range.

When Haydn finally traveled to London in his late 50s, he was the most famous composer alive. He wept when he saw the sea for the first time. He observed the London premiere of Handel's Messiah in Westminster Abbey — 1,000 performers, vast audience — and wept again, saying: 'He is the master of us all.'`,
    workIds: ['haydn_surprise'],
  },
  schubert: {
    id: 'schubert',
    topicId: 'classical_period',
    name: `Franz Schubert`,
    years: `1797–1828`,
    nationality: 'Austrian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Franz_Schubert_by_Wilhelm_August_Rieder_1875.jpg/330px-Franz_Schubert_by_Wilhelm_August_Rieder_1875.jpg',
    tagline: `The composer who died at 31 with an unfinished symphony — and it remains the most perfect fragment in music.`,
    primer: `Franz Schubert was born in Vienna in 1797, the son of a schoolteacher. He spent his entire short life in Vienna, never holding a permanent musical position, living on the proceeds of his publications and the support of friends. He died in 1828, probably of typhoid fever contracted from contaminated water, at 31. In his lifetime he was known primarily as a composer of songs; his symphonies were largely unpublished and unperformed.

In the century after his death, Schubert was gradually recognized as one of the three or four greatest composers in the Western tradition. His 600 songs are the foundation of the German Lied repertoire. His chamber music — the 'Death and the Maiden\' quartet, the 'Trout' quintet, the two piano trios — is among the most beautiful ever written. His last two piano sonatas and the Winterreise song cycle are works of devastating emotional depth.

What makes Schubert exceptional is his melodic gift combined with his harmonic adventurousness. He moves between related and distant keys with a naturalness that sounds inevitable in retrospect but was completely new. Brahms studied him obsessively. Mahler inherited his emotional directness. He is the bridge between the Classical and Romantic eras, and he built that bridge in 31 years.`,
    workIds: ['schubert_unfinished'],
  },
  gluck: {
    id: 'gluck',
    topicId: 'classical_period',
    name: `Christoph Willibald Gluck`,
    years: `1714–1787`,
    nationality: 'German',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Joseph_Siffred_Duplessis_-_Christoph_Willibald_Gluck_-_Google_Art_Project.jpg/330px-Joseph_Siffred_Duplessis_-_Christoph_Willibald_Gluck_-_Google_Art_Project.jpg',
    tagline: `The reformer who stripped opera back to drama — and made the path from Monteverdi to Mozart possible.`,
    primer: `Christoph Willibald Gluck was born in Bavaria in 1714 and spent much of his career in Vienna, where he became court composer and later director of the Viennese Opera. He is the central figure of operatic reform: the composer who took the Italian opera of his time — dominated by virtuoso singers and formal conventions — and forced it back toward dramatic truth.

By the mid-18th century, Italian opera seria had become a vehicle for vocal display rather than drama. Arias were structured to allow singers to show off their technique; plots were labyrinthine pretexts for such display. Gluck and his librettist Ranieri de' Calzabigi formulated a reform: music should serve poetry, drama should dominate, ornament should be used only when it enhances expression. Orfeo ed Euridice (1762) was the first major result.

The reform was deeply influential. Mozart studied Gluck and inherited his sense of theatrical architecture. Wagner claimed him as a forefather. The path from Baroque opera's formal rigidity to the dramatic naturalism of the 19th century runs directly through Gluck\'s Viennese operas.`,
    workIds: ['gluck_orphee'],
  },

  // ── ROMANTIC ─────────────────────────────────────────
  brahms: {
    id: 'brahms',
    topicId: 'romantic',
    name: `Johannes Brahms`,
    years: `1833–1897`,
    nationality: 'German',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/JohannesBrahms_%28cropped%29.jpg/330px-JohannesBrahms_%28cropped%29.jpg',
    tagline: `The last great classicist — who built cathedrals out of 19th-century emotion and 18th-century form.`,
    primer: `Johannes Brahms was born in Hamburg in 1833, the son of a double bass player. He grew up poor, playing piano in taverns and dance halls, and was 20 when Robert Schumann recognized his genius and introduced him to the European musical world. Schumann's endorsement launched Brahms's career; Schumann's subsequent mental breakdown and death cast a long shadow over it. Brahms spent the remaining 40 years of his life partly defined by his love for Schumann's wife Clara, whom he never married.

Brahms settled in Vienna in 1862 and remained there, the acknowledged heir to Beethoven's symphonic tradition, writing with deliberate care and destroying whatever did not meet his standards. He wrote four symphonies — he was 43 before he completed the first — and each one is a major work. He also wrote the German Requiem, two piano concertos, a violin concerto, two overtures, and an enormous body of chamber and piano music, all of it marked by rigorous craftsmanship and deep feeling.

Brahms was the conservative in the famous 19th-century debate between the 'Music of the Future\' (Wagner\'s camp) and the classical tradition. He was also the better composer of absolute music. His four symphonies are the greatest body of symphonic work between Beethoven and Mahler.`,
    workIds: ['brahms_sym4'],
  },
  tchaikovsky: {
    id: 'tchaikovsky',
    topicId: 'romantic',
    name: `Pyotr Ilyich Tchaikovsky`,
    years: `1840–1893`,
    nationality: 'Russian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Tchaikovsky_by_Reutlinger_%28cropped%29.jpg/330px-Tchaikovsky_by_Reutlinger_%28cropped%29.jpg',
    tagline: `The Russian who turned emotional extremity into the most immediately powerful music of the 19th century.`,
    primer: `Pyotr Ilyich Tchaikovsky was born in Votkinsk, Russia, in 1840. He trained as a civil servant before studying music in his 20s, and spent most of his career as a professor at the Moscow Conservatory while composing at extraordinary speed. His personal life was turbulent: a brief disastrous marriage, a long epistolary friendship with a wealthy widow who supported him financially but refused ever to meet him in person, and a sexuality that could not be publicly acknowledged in Tsarist Russia.

Tchaikovsky's music is immediately recognizable — intensely melodic, emotionally direct, orchestrally colorful — and has always been both widely loved and sometimes condescended to by critics who found its emotion too unguarded. Those critics have generally been wrong. The three great ballets (Swan Lake, Sleeping Beauty, The Nutcracker), the last three symphonies, the Violin Concerto, and the two piano concertos constitute one of the major bodies of orchestral and theatrical music in the Western tradition.

Tchaikovsky died in St. Petersburg in 1893, nine days after the premiere of his Sixth Symphony. The cause of death was officially cholera, possibly from drinking unboiled water during an epidemic. Some scholars have argued he may have died by suicide, under social pressure. The question has never been definitively resolved.`,
    workIds: ['tchaikovsky_pathetique'],
  },
  chopin: {
    id: 'chopin',
    topicId: 'romantic',
    name: `Frédéric Chopin`,
    years: `1810–1849`,
    nationality: 'Polish-French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/330px-Frederic_Chopin_photo.jpeg',
    tagline: `The poet of the piano — who reinvented what the instrument could say, and never wrote a boring bar.`,
    primer: `Frédéric Chopin was born near Warsaw in 1810, the son of a French father and Polish mother. He gave his first public concert at 8, published his first composition at 15, and left Poland at 20, ultimately settling in Paris. He never returned to Poland, which had come under Russian domination; his homesickness shaped much of his mature music, including the Polonaises and Mazurkas rooted in Polish dance forms.

Chopin wrote almost exclusively for piano. He produced no symphonies, no operas, very little chamber music. Everything he had to say, he said through the keys: two piano concertos, four ballades, four scherzos, three sonatas, 21 nocturnes, 27 études, 59 mazurkas, 17 polonaises, and dozens of other pieces. In sheer range of expression — from violent to intimate, from technically ferocious to infinitely delicate — the Chopin piano output is unmatched.

Chopin performed rarely in public, preferring to play in Parisian salons for small audiences. He was a famously exacting teacher, insisting on natural hand position and tonal variety rather than mere speed. He died of tuberculosis in Paris in 1849, at 39. His heart was preserved in alcohol and taken to Warsaw, where it remains.`,
    workIds: ['chopin_ballade1'],
  },
  wagner: {
    id: 'wagner',
    topicId: 'romantic',
    name: `Richard Wagner`,
    years: `1813–1883`,
    nationality: 'German',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/RichardWagner.jpg/330px-RichardWagner.jpg',
    tagline: `The composer who spent four hours not resolving a chord — and changed Western music forever.`,
    primer: `Richard Wagner was born in Leipzig in 1813 and spent much of his early career in financial difficulty and political exile. He was an active participant in the 1848 revolutions and fled Germany to Zurich, where he wrote his theoretical works articulating his vision of the Gesamtkunstwerk — the 'total art work' that would synthesize music, drama, poetry, and visual spectacle into a unified whole.

Wagner returned to Germany after an amnesty, eventually securing the patronage of Ludwig II of Bavaria, who built him the Bayreuth Festival Theater — a purpose-built opera house designed exclusively for Wagner's works, with an orchestra pit that conceals the musicians and acoustics optimized for his enormous orchestra. The Ring Cycle (four operas, 15 hours of music) premiered there in 1876.

Wagner's influence on subsequent music is virtually incalculable. His harmonic language — especially the 'endless melody' and perpetual suspension of Tristan und Isolde — gave the late 19th century its vocabulary. Strauss, Wolf, Mahler, Schoenberg, and every film composer from Korngold to John Williams absorbed it. He was also a vile antisemite, which has complicated his legacy in ways that have never been fully resolved.`,
    workIds: ['wagner_tristan'],
  },
  mahler: {
    id: 'mahler',
    topicId: 'romantic',
    name: `Gustav Mahler`,
    years: `1860–1911`,
    nationality: 'Austrian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Photo_of_Gustav_Mahler_by_Moritz_N%C3%A4hr_01.jpg/330px-Photo_of_Gustav_Mahler_by_Moritz_N%C3%A4hr_01.jpg',
    tagline: `The last great Romantic — who conducted New York and wrote symphonies that contain entire worlds.`,
    primer: `Gustav Mahler was born in Bohemia in 1860, the second of 14 children (seven of whom died in childhood). He studied in Vienna, where he developed the ambition — and the anxiety — that would characterize his entire life. Mahler's career was divided between conducting, at which he was extraordinarily gifted, and composing, at which he was extraordinary in a different way: slowly, with anguish, during summers away from his conducting duties.

As conductor, Mahler directed the Vienna Court Opera from 1897 to 1907 with ferocious standards, transforming it into arguably the finest opera company in the world. He then came to New York, conducting the Metropolitan Opera (1907-1910) and the New York Philharmonic (1909-1911), where he was celebrated as a conductor and quietly continuing to compose. He died of bacterial endocarditis in Vienna in 1911, at 50, having completed nine symphonies and leaving a tenth unfinished.

Mahler's symphonies — vast, emotionally extreme, orchestrally massive — were largely dismissed in his lifetime and rediscovered beginning in the 1960s. They are now the most frequently performed large orchestral works of the 20th century. His conducting of the New York Philharmonic from 1909-1911 established a connection between Mahler and this hall that has never faded.`,
    workIds: ['mahler_sym5'],
  },

  // ── 20TH CENTURY ─────────────────────────────────────────
  stravinsky: {
    id: 'stravinsky',
    topicId: 'twentieth_century',
    name: `Igor Stravinsky`,
    years: `1882–1971`,
    nationality: 'Russian-American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Igor_Stravinsky_LOC_32392u.jpg/330px-Igor_Stravinsky_LOC_32392u.jpg',
    tagline: `The chameleon who reinvented himself three times — and changed music with each transformation.`,
    primer: `Igor Stravinsky was born near St. Petersburg in 1882, the son of a leading bass at the Imperial Opera. He began composing seriously in his 20s under the tutelage of Rimsky-Korsakov, whose influence is clear in Stravinsky's first major success — the Firebird ballet (1910), commissioned by Diaghilev for the Ballets Russes. Petrushka (1911) and The Rite of Spring (1913) followed, establishing Stravinsky as the most celebrated and controversial composer of his generation.

After World War I, Stravinsky entered his Neoclassical period, turning away from Romantic excess and back toward Baroque and Classical models — using the forms and textures of earlier music, filtered through a modern harmonic language. L'Histoire du soldat, Pulcinella, the Octet, the Symphony of Psalms: this phase produced works of lean, ironic brilliance.

In his 70s, having moved to the United States (he became an American citizen in 1945), Stravinsky encountered the serial music of Schoenberg and adopted twelve-tone techniques — his third and final transformation. He was the only major composer of the 20th century to successfully reinvent his voice three times. He died in New York in 1971 and is buried in Venice, near Diaghilev.`,
    workIds: ['stravinsky_rite'],
  },
  debussy: {
    id: 'debussy',
    topicId: 'twentieth_century',
    name: `Claude Debussy`,
    years: `1862–1918`,
    nationality: 'French',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Claude_Debussy_by_Atelier_Nadar.jpg/330px-Claude_Debussy_by_Atelier_Nadar.jpg',
    tagline: `The impressionist who taught music to suggest rather than state — and dissolved the 19th century.`,
    primer: `Claude Debussy was born in Saint-Germain-en-Laye in 1862, the eldest of five children of a shopkeeper. He showed exceptional musical aptitude early and entered the Paris Conservatoire at 10. He was an unconventional student — brilliant but resistant to rules — and his mature music reflected that resistance: a systematic dismantling of the tonal conventions that had governed Western music for 250 years.

Debussy absorbed the influence of Wagner (inevitable for any French composer of his generation) and then deliberately rejected it, seeking a more fluid, ambiguous harmonic language. He was influenced by Russian music (Mussorgsky especially), Javanese gamelan music heard at the Paris Exhibition of 1889, and French symbolist poetry. The result was something genuinely new: music that floated free of harmonic gravity, that suggested rather than stated, that created atmosphere rather than argument.

Debussy died of rectal cancer in Paris in 1918, during the German bombardment of the city, largely unaware of the outside world. He is buried in the Père Lachaise cemetery. His two books of piano preludes, Pelléas et Mélisande (opera), the Préludes à l'après-midi d\'un faune, and La Mer constitute one of the major bodies of work in all of music.`,
    workIds: ['debussy_la_mer'],
  },
  prokofiev: {
    id: 'prokofiev',
    topicId: 'twentieth_century',
    name: `Sergei Prokofiev`,
    years: `1891–1953`,
    nationality: 'Russian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Sergei_Prokofiev_circa_1918_over_Chair_Bain.jpg/330px-Sergei_Prokofiev_circa_1918_over_Chair_Bain.jpg',
    tagline: `The Russian who wrote Peter and the Wolf, Romeo and Juliet, and five symphonies — all while navigating Stalin.`,
    primer: `Sergei Prokofiev was born in Ukraine in 1891, the only child of an agricultural manager. He studied at the St. Petersburg Conservatory and emerged as a prodigiously gifted pianist and an aggressively modern composer — his early piano works were so dissonant and rhythmically violent that audiences were often hostile. He left Russia after the Revolution of 1917 and spent 15 years in the West, with extended periods in the United States, Paris, and Germany.

In 1936 Prokofiev returned to the Soviet Union, driven partly by nostalgia, partly by the promise of artistic support, and partly by a miscalculation about the cultural climate. He became one of the most famous composers in the USSR — his ballets Romeo and Juliet and Cinderella, his film scores for Eisenstein (Alexander Nevsky), and his children's piece Peter and the Wolf made him a celebrity — while also being subject to the same ideological pressures as all Soviet artists.

In 1948 Prokofiev was publicly condemned by the Soviet authorities for 'formalism\' in a decree that ended his ability to have his major works performed. He died on the same day as Stalin, March 5, 1953, of a cerebral hemorrhage. His death was barely noticed for days, overshadowed by the dictator who had made his final years miserable.`,
    workIds: ['prokofiev_sym5'],
  },
  shostakovich: {
    id: 'shostakovich',
    topicId: 'twentieth_century',
    name: `Dmitri Shostakovich`,
    years: `1906–1975`,
    nationality: 'Russian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/%D0%9A%D0%BE%D0%BC%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BE%D1%80_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B5%D0%B2%D0%B8%D1%87_%D0%A8%D0%BE%D1%81%D1%82%D0%B0%D0%BA%D0%BE%D0%B2%D0%B8%D1%87.jpg/330px-%D0%9A%D0%BE%D0%BC%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BE%D1%80_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B5%D0%B2%D0%B8%D1%87_%D0%A8%D0%BE%D1%81%D1%82%D0%B0%D0%BA%D0%BE%D0%B2%D0%B8%D1%87.jpg',
    tagline: `The composer who survived Stalin and encoded survival itself in his music.`,
    primer: `Dmitri Shostakovich was born in St. Petersburg in 1906 and never lived outside the Soviet Union. He was a child prodigy who composed his first symphony at 18. By 28 he was the most celebrated composer in the USSR, his opera Lady Macbeth of the Mtsensk District performed to acclaim across Europe.

Then, in January 1936, Stalin attended a performance of Lady Macbeth and did not like it. Two days later, Pravda published an article — almost certainly written or authorized by Stalin — condemning the opera as 'muddle instead of music.' Shostakovich understood immediately that his life was in danger. He withdrew his Fourth Symphony, already in rehearsal, and composed the Fifth — subtitled 'a Soviet artist\'s creative reply to just criticism\' — which was premiered in 1937 to overwhelming response.

Shostakovich spent the next four decades navigating the contradiction between his genuine artistic ambitions and the demands of Soviet cultural policy. Whether his apparent compliance was cynical or sincere, whether his music is full of hidden protest or official celebration, is the central debate in 20th-century musicology. What is not debated is the power and range of his output: 15 symphonies, 15 string quartets, and a body of other work that documents the Soviet experience from the inside.`,
    workIds: ['shostakovich_sym5'],
  },
  bartok: {
    id: 'bartok',
    topicId: 'twentieth_century',
    name: `Béla Bartók`,
    years: `1881–1945`,
    nationality: 'Hungarian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Bart%C3%B3k_B%C3%A9la_1927.jpg/330px-Bart%C3%B3k_B%C3%A9la_1927.jpg',
    tagline: `The ethnomusicologist-composer who fused 3,000 folk songs into a new musical language.`,
    primer: `Béla Bartók was born in Nagyszentmiklós, Hungary (now Romania), in 1881. He studied piano and composition in Budapest and became a virtuoso pianist, but his life's work was shaped by a decision he made in 1905: he would travel through rural Hungary, Romania, Bulgaria, Slovakia, and Turkey recording folk songs on a cylinder phonograph, transcribing and analyzing the music he found.

Over the next three decades, Bartók collected more than 10,000 folk melodies and used them as the raw material for a compositional language unlike anything that existed in European art music. He was not quoting folk tunes nostalgically; he was absorbing their modal scales, asymmetrical rhythms, and pentatonic harmonies into a modern harmonic language that incorporated them at a cellular level.

Bartók fled Europe in 1940, ahead of the Nazi advance, and spent the last five years of his life in New York, desperately poor, teaching at Columbia University and composing the Concerto for Orchestra and other late works. He died of leukemia in New York in 1945, just as he was beginning to receive the recognition his work deserved. He is buried in Ferncliff Cemetery in Westchester, New York.`,
    workIds: ['bartok_concerto'],
  },

  // ── CONTEMPORARY CLASSICAL ─────────────────────────────────────────
  glass: {
    id: 'glass',
    topicId: 'contemporary_classical',
    name: `Philip Glass`,
    years: `1937–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Philip_Glass_in_Florence%2C_Italy_-_1993_%28cropped%29.jpg/330px-Philip_Glass_in_Florence%2C_Italy_-_1993_%28cropped%29.jpg',
    tagline: "The minimalist who turned repetition into a new kind of consciousness — and brought classical music back to packed houses.",
    primer: `Philip Glass was born in Baltimore in 1937. He studied at the Peabody Conservatory, the University of Chicago, and the Juilliard School, and then spent two years in Paris studying with Nadia Boulanger. Returning to New York in the mid-1960s, he drove a taxi and worked as a plumber while developing the repetitive, additive musical language that would make him famous.

Glass's early minimalist works — Music in Fifths (1969), Music in Contrary Motion (1969) — consisted of patterns repeated hundreds of times with minimal variation. Critics were often hostile; audiences at downtown loft concerts were often transfixed. Einstein on the Beach (1976), co-created with director Robert Wilson, brought Glass to international attention. The four-and-a-half-hour opera without intermission or conventional plot premiered at the Metropolitan Opera and sold out both performances.

In the following decades, Glass became the most performed living classical composer in the world. He wrote 12 symphonies, 11 concertos, 25 operas, and numerous film scores (Koyaanisqatsi, The Hours, Notes on a Scandal). He has collaborated with Ravi Shankar, David Bowie, and Allen Ginsberg. He lives in New York, continues composing, and has become a genuine institution of American cultural life.`,
    workIds: ['glass_einstein'],
  },
  part: {
    id: 'part',
    topicId: 'contemporary_classical',
    name: `Arvo Pärt`,
    years: `1935–present`,
    nationality: 'Estonian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Arvo_P%C3%A4rt.jpg/330px-Arvo_P%C3%A4rt.jpg',
    tagline: `The Estonian mystic who invented a technique called tintinnabuli — and created music that sounds like silence made audible.`,
    primer: `Arvo Pärt was born in Paide, Estonia, in 1935. He studied composition in Tallinn and worked as a recording engineer for Estonian Radio while composing. His early works engaged with serialism and Soviet-era modernism, but in the 1970s he fell largely silent, withdrawing from composition to study medieval and Renaissance music and Russian Orthodox chant for eight years.

When Pärt emerged from this silence in 1976, he brought with him a completely new compositional method: tintinnabuli (named after bells), in which one voice plays only the notes of the tonic triad while another voice moves stepwise. The result is music of extreme simplicity and, in performance, profound spiritual weight. Spiegel im Spiegel (1978) was one of the first works in this style.

Pärt left Estonia in 1980 for political reasons, eventually settling in Berlin. His music circulated in the West through the ECM record label, which has released most of his major works. He has become, somewhat unexpectedly, the most performed living classical composer globally by several measures — his music is used in films, played in cathedrals, broadcast on radio stations dedicated entirely to his work. He is 88 years old and still composing.`,
    workIds: ['part_spiegel'],
  },
  john_adams: {
    id: 'john_adams',
    topicId: 'contemporary_classical',
    name: `John Adams`,
    years: `1947–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/JA-portrait-1-LW.jpg/330px-JA-portrait-1-LW.jpg',
    tagline: `The American minimalist who took political history as operatic subject matter — and made it work.`,
    primer: `John Adams was born in Worcester, Massachusetts, in 1947. He studied at Harvard, where he played clarinet in the orchestra and absorbed a rigorous academic training in contemporary composition. Moving to San Francisco in 1971, he taught at the San Francisco Conservatory and began developing a musical language that started from minimalism but moved away from its purist austerity toward a richer, more dramatic idiom.

Adams became famous internationally with Nixon in China (1987), an opera about President Nixon's 1972 visit to China — the first major American opera to take recent political history as its subject. It was followed by The Death of Klinghoffer (1991), about the 1985 hijacking of the Achille Lauro cruise ship, and Doctor Atomic (2005), about J. Robert Oppenheimer and the Manhattan Project. These operas treat major historical events with genuine musical intelligence and have been performed at opera houses worldwide.

Adams is also a major orchestral composer: Harmonielehre (1985), El Dorado (1991), Naive and Sentimental Music (1998), and dozens of other works have established him as the most significant American orchestral composer since Leonard Bernstein. Short Ride in a Fast Machine (1986) is his most-performed piece and one of the most frequently played orchestral works of the past 40 years.`,
    workIds: ['adams_short_ride'],
  },
  reich: {
    id: 'reich',
    topicId: 'contemporary_classical',
    name: `Steve Reich`,
    years: `1936–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Holland_Festival_componist_Steve_Reich_kop%2C_Bestanddeelnr_928-6490.jpg/330px-Holland_Festival_componist_Steve_Reich_kop%2C_Bestanddeelnr_928-6490.jpg',
    tagline: "The New York minimalist who taught musicians to phase — and influenced everyone from Brian Eno to Radiohead.",
    primer: `Steve Reich was born in New York City in 1936. He studied philosophy at Cornell, then composition at the Juilliard School and Mills College, where he worked with Luciano Berio and Darius Milhaud. Returning to New York in the mid-1960s, he began experimenting with tape loops — playing two identical recordings simultaneously and allowing them to drift apart — and discovered the phase process that became his signature technique.

Reich's phase pieces — It\'s Gonna Rain (1965), Come Out (1966), Piano Phase (1967) — created music by allowing identical patterns to gradually go out of sync with one another, producing shimmering, ever-shifting textures from very simple means. These pieces were performed in downtown Manhattan lofts and galleries, outside the concert hall establishment.

Music for 18 Musicians (1974-1976) synthesized everything Reich had learned into a large-scale work that was accessible, beautiful, and genuinely new. It was recorded for ECM Records in 1978 and became one of the most influential recordings of the late 20th century — cited as an influence by Brian Eno, the members of Radiohead, Aphex Twin, and dozens of other musicians who heard classical and electronic music being remade simultaneously.`,
    workIds: ['reich_music18'],
  },
  caroline_shaw: {
    id: 'caroline_shaw',
    topicId: 'contemporary_classical',
    name: `Caroline Shaw`,
    years: `1982–present`,
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: '',
    tagline: `The youngest Pulitzer Prize winner in music — who makes choral music that sounds like nothing before it.`,
    primer: `Caroline Shaw was born in Greenville, North Carolina, in 1982. She studied violin and voice from childhood and received degrees from Rice University, Yale School of Music, and the Princeton doctoral program. She is also a founding member of Roomful of Teeth, the vocal ensemble for which she composed Partita for 8 Voices.

Partita for 8 Voices won the Pulitzer Prize for Music in 2013, making Shaw, at 30, the youngest recipient in the prize's history. The work incorporates extended vocal techniques — circular breathing, throat singing, overtone singing, sprechstimme — alongside conventional choral writing, in movements titled after Baroque dance forms. It sounds like nothing that existed before it.

Shaw is prolific in multiple genres simultaneously. She composes for string orchestras, chamber ensembles, and voice; she collaborates with pop artists (Kanye West has sampled her work); she performs as a violinist and vocalist. She is based in New York and represents the generation of composers who grew up after the academic battles of the 20th century were over — free to use whatever is useful from any tradition.`,
    workIds: ['shaw_partita'],
  },

  // ── SPORTS FIGURES ────────────────────────────────────────────────────
  babe_ruth: {
    id: 'babe_ruth', topicId: 'baseball', name: 'Babe Ruth', years: '1895–1948',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Babe_Ruth2.jpg/500px-Babe_Ruth2.jpg',
    tagline: `The man who turned baseball into a power game — and the Yankees into a dynasty.`,
    primer: `George Herman Ruth Jr. grew up in a Baltimore orphanage and reformatory, learning to pitch from a Xaverian brother named Matthias Boutlier. He was called "Babe" because he was the youngest player on an early professional team. He remains, more than a century later, the most famous baseball player who ever lived.

Ruth arrived at the Yankees in 1920, already a celebrated pitcher with the Red Sox. New York transformed him — or rather, he transformed New York. He hit 54 home runs in 1920, breaking the record he'd set the year before. He hit 59 in 1921. He hit 60 in 1927. Each number was more than any other entire team managed. The scale of his offense had no precedent and created the template for everything that followed.

The original Yankee Stadium, opened in 1923, was called "The House That Ruth Built" because his gate appeal financed its construction. He won four World Series titles there. He pitched, hit, and caroused at a scale that belonged to the mythology of American excess. He was the first athlete whose name was known to everyone in the country.

He retired in 1935, sick and aging, after a brief and unhappy time with the Boston Braves. He died in 1948. His plaque in Monument Park at the current Yankee Stadium reads: "A great ballplayer, a great man, a great American."`,
    workIds: ['babe_ruth_60'],
  },
  lou_gehrig: {
    id: 'lou_gehrig', topicId: 'baseball', name: 'Lou Gehrig', years: '1903–1941',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Lou_Gehrig_as_a_new_Yankee_11_Jun_1923.jpg/500px-Lou_Gehrig_as_a_new_Yankee_11_Jun_1923.jpg',
    tagline: `The Iron Horse — 2,130 consecutive games, and a speech about luck.`,
    primer: `Lou Gehrig played first base for the New York Yankees from 1923 to 1939, appearing in 2,130 consecutive games. He missed no games due to injury, illness, or fatigue for nearly seventeen years. The streak was not a goal he pursued obsessively; it was simply what he understood professional responsibility to mean.

He hit .340 over his career with 493 home runs and 1,995 RBI — numbers that would define any other player's legacy. They define his too, but they exist in the shadow of the streak and of what ended it.

In 1939, Gehrig began struggling at the plate in ways that were unlike anything in his career. His hands weren't responding correctly. His coordination was off. He went to the Mayo Clinic and was diagnosed with amyotrophic lateral sclerosis — ALS — a progressive neurodegenerative disease that was essentially a death sentence.

On July 4, 1939, the Yankees held Lou Gehrig Appreciation Day at the original Yankee Stadium. He walked to the microphone before 61,808 people and said: "Today I consider myself the luckiest man on the face of the Earth." He died in 1941, thirty-seven days before his 38th birthday. ALS has been called Lou Gehrig's disease since.`,
    workIds: ['lou_gehrig_speech'],
  },
  derek_jeter: {
    id: 'derek_jeter', topicId: 'baseball', name: 'Derek Jeter', years: '1974–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Derek_Jeter_during_MLB_on_Fox_pre-game_show%2C_October_16%2C_2024_-_001_%28cropped%29.jpg/500px-Derek_Jeter_during_MLB_on_Fox_pre-game_show%2C_October_16%2C_2024_-_001_%28cropped%29.jpg',
    tagline: `The Captain — twenty years, five rings, one team.`,
    primer: `Derek Jeter was drafted by the Yankees in 1992 and played his last game in 2014, entirely in pinstripes. He is, by almost every measure, the greatest Yankee of the post-Mantle era and one of the five or six greatest shortstops in baseball history.

His career statistics are remarkable: 3,465 hits, a .310 average, five Gold Gloves, fourteen All-Star selections. But they don't fully capture what he was in New York. He played in the world\'s most scrutinizing media market, for the most storied franchise in American sports, and for twenty years he was never anything less than professional, prepared, and clutch.

He was called "The Captain" — officially designated by the Yankees organization — a title the team had not given since Thurman Munson died in 1979. It meant exactly what the Yankees intended: Jeter was the face of the franchise, the person who set the standard for what wearing the uniform required.

Five World Series rings. One franchise. Zero seasons with another team. He was inducted into the Hall of Fame in 2020 with 99.7 percent of the vote — second-highest in history at the time.`,
    workIds: ['derek_jeter_3000'],
  },
  tom_seaver: {
    id: 'tom_seaver', topicId: 'baseball', name: 'Tom Seaver', years: '1944–2020',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Tom_Seaver_Mets.jpg',
    tagline: `Tom Terrific — the greatest Met, and one of the greatest pitchers who ever lived.`,
    primer: `Tom Seaver arrived in New York in 1967, the Mets' third year of existence and their third consecutive last-place finish. He immediately became the best pitcher in the National League and the reason a franchise built on lovable failure became something else entirely.

His mechanics were perfect — a low-angle delivery that drove off the mound and created exceptional downward movement on his fastball. Opposing hitters said the ball seemed to rise as it approached the plate, though physics prevented that; what they were experiencing was the ball dropping less than expected. He was 25-7 with a 2.21 ERA in the Miracle Mets' 1969 championship season.

He won the Cy Young Award three times. He is the Mets' all-time leader in wins, strikeouts, and ERA. He struck out 19 batters in a single game in 1970, still a National League record. His 311 career wins put him in the top tier of 20th-century pitchers.

He was traded away from the Mets in 1977 in a front-office decision so unpopular it is still called "The Midnight Massacre." He returned in 1983. He retired in 1986. The Mets retired his number 41, and when he died in 2020, the number was retired across all of baseball for one day.`,
    workIds: ['seaver_1969_ws'],
  },
  mike_piazza: {
    id: 'mike_piazza', topicId: 'baseball', name: 'Mike Piazza', years: '1968–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mike_Piazza_HOF_Press_Conference.jpg/500px-Mike_Piazza_HOF_Press_Conference.jpg',
    tagline: `The greatest hitting catcher of all time — and the man who helped New York breathe.`,
    primer: `Mike Piazza was drafted in the 62nd round of the 1988 draft as a favor by the Dodgers to his father's friend Tommy Lasorda. The 1,389th player selected that year became the greatest hitting catcher in baseball history.

He hit .308 with 427 home runs — 396 of them as a catcher. The combined offensive output from that position has no parallel in baseball history. Catching is the hardest defensive position to play, the most physically demanding, and the one that most reliably suppresses offensive production. Piazza played it at the level of a Hall of Fame offensive player for sixteen seasons.

He came to the Mets in 1998 and immediately became the most popular athlete in New York. His eight seasons in Flushing produced seasons of genuine excellence and one moment that transcended sports entirely: the home run on September 21, 2001, ten days after the September 11 attacks.

He was inducted into the Hall of Fame in 2016. The Mets retired his number 31. The home run is remembered not as a baseball moment but as a New York moment — a city that needed something, and for two hours, had it.`,
    workIds: ['piazza_911_hr'],
  },
  willis_reed: {
    id: 'willis_reed', topicId: 'basketball', name: 'Willis Reed', years: '1942–2023',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Willis_Reed_1972_publicity_photo.jpg/500px-Willis_Reed_1972_publicity_photo.jpg',
    tagline: `The Captain who limped onto the court — and lifted a city.`,
    primer: `Willis Reed spent his entire ten-year NBA career with the New York Knicks. He was the team's center, its captain, and its emotional core — the kind of player around whom everything else organized itself.

He was a two-time NBA champion (1970 and 1973), a two-time Finals MVP, an NBA MVP, and a seven-time All-Star. These numbers are the résumé of a great player. The moment he is remembered for happened in Game 7 of the 1970 NBA Finals.

He had torn a muscle in his right thigh in Game 5 and was unable to play Game 6. The Lakers won Game 6. Before Game 7, nobody knew whether Reed would be available. He came out of the tunnel to warm up and the Madison Square Garden crowd made a sound that witnesses describe as unlike anything they had heard in a sporting arena. He hit his first two baskets — his only baskets of the game — and then the Knicks played with a confidence and energy that carried them to the championship.

Reed died in 2023. He is remembered at Madison Square Garden as the Knick — the player who defined what a captain was supposed to be.`,
    workIds: ['reed_game7_1970'],
  },
  walt_frazier: {
    id: 'walt_frazier', topicId: 'basketball', name: 'Walt Frazier', years: '1945–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Walt_Frazier_%28cropped%29.jpg/500px-Walt_Frazier_%28cropped%29.jpg',
    tagline: `Clyde — the coolest Knick, and one of the greatest defensive guards who ever played.`,
    primer: `Walt Frazier played for the Knicks from 1967 to 1977 and is the greatest player in franchise history. He was a two-time champion, a seven-time All-Star, and a Hall of Famer whose defense defined an era of basketball. His nickname — "Clyde," after Clyde Barrow of Bonnie and Clyde — was given to him because of his wide-brimmed hats. It fit: there was always something theatrical about the way Frazier moved.

He was the complete point guard before that concept existed: he could score, pass, and defend, and he did all three at a level that made opponents adjust their entire game plan. His defensive instincts — his ability to anticipate passes and cut off lanes — were genuinely extraordinary. He averaged more than five assists per game at a time when point guards were expected to score first.

In Game 7 of the 1970 NBA Finals, when Willis Reed's limp onto the court produced the emotional peak of the game, Frazier quietly produced one of the greatest individual Finals performances in NBA history: 36 points and 19 assists. Against Jerry West. The MVP of the series, however, went to Reed.

Frazier now works as a broadcaster for the Knicks — a position he has held for decades, delivering rhyming commentary that has become its own New York institution.`,
    workIds: ['frazier_game7_1970'],
  },
  patrick_ewing: {
    id: 'patrick_ewing', topicId: 'basketball', name: 'Patrick Ewing', years: '1962–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Patrick_Ewing_2021_%28cropped%29.jpg/500px-Patrick_Ewing_2021_%28cropped%29.jpg',
    tagline: `The Knick — fifteen years of dedication to a franchise that could never get him a ring.`,
    primer: `Patrick Ewing was the first overall pick in the 1985 NBA Draft — selected in a lottery that, years later, Knicks fans still discuss with a mix of gratitude and longing. He played fifteen seasons in New York, becoming the franchise's all-time leader in points, rebounds, blocks, and games played.

He was a complete center: skilled enough to play in the post, athletic enough to step out and score from fifteen feet, tough enough to compete with the most physically dominant players of his generation — including Hakeem Olajuwon, David Robinson, and Shaquille O'Neal. He was named to eleven All-Star teams.

In 1994, he led the Knicks to the NBA Finals — the closest the franchise came to a championship in the twenty years between 1973 and today. They lost to Olajuwon's Rockets in seven games. Ewing played on a torn muscle in his thigh in the final rounds. The Knicks lost Game 7 by six points.

He was traded to Seattle in 2000, played two more seasons, and retired. He is now the head coach at Georgetown, where he played in college. The Garden retired his number 33. He was inducted into the Hall of Fame in 2008. New York still argues about whether he could have won a championship with different pieces around him. He deserves better than the argument.`,
    workIds: ['ewing_knicks_playoffs'],
  },
  bernard_king: {
    id: 'bernard_king', topicId: 'basketball', name: 'Bernard King', years: '1956–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bernard_King.jpg/500px-Bernard_King.jpg',
    tagline: `The greatest pure scorer in Knicks history — and a story of determination.`,
    primer: `Bernard King is the greatest scorer in Knicks history and one of the most compelling athletes in New York sports. His time at the Garden was brief — two and a half seasons — but the basketball he produced in that window was among the purest offensive work Madison Square Garden has ever witnessed.

He came to the Knicks in 1982, bringing a scoring ability that made coaches and opponents adjust their entire defensive systems. His mid-range game was built on footwork that created separation from defenders and a release that was quick enough to fire over virtually any closeout. He was not a great athlete in the conventional sense; he was something more dangerous — a player who understood angles, timing, and space better than his opponents.

In the 1983-84 season, he averaged 26.3 points per game and became the Knicks' centerpiece. In 1984-85, he averaged 32.9 — leading the NBA in scoring — before tearing his ACL in March.

The ACL injury in 1985 was severe enough that most people assumed his career was over. He came back. He averaged 22.5 points per game for Washington in 1987, one of the most remarkable rehabilitation stories in sports history.

He was inducted into the Hall of Fame in 2013. The Knicks retired his number 30.`,
    workIds: ['king_scoring_title'],
  },
  allan_houston: {
    id: 'allan_houston', topicId: 'basketball', name: 'Allan Houston', years: '1971–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Allan_Houston_2010.jpg/500px-Allan_Houston_2010.jpg',
    tagline: `The Bounce — one shot that changed a series, a season, and a franchise.`,
    primer: `Allan Houston played seven seasons for the New York Knicks, from 1996 to 2005, as one of the purest shooting guards in the NBA. He was a two-time All-Star, he averaged more than 20 points per game three times, and he played his position with a grace and efficiency that made him one of the most effective off-the-ball scorers of his era.

His career is defined, in Knicks history, by one shot: the running floater from the left baseline in Game 5 of the 1999 first-round playoff series against Miami that bounced on the rim and fell through with 0.8 seconds remaining.

The Knicks were the eighth seed. The Heat were the one seed. No eighth seed had ever beaten a one seed in a seven-game series in NBA history. The Knicks went on to beat the Pacers in the Conference Finals and lose to the Spurs in the Finals — a remarkable run for a team that shouldn't have been there.

"The Bounce" is remembered simply as that, by Knicks fans of a certain generation, without explanation. He hit the shot. The Garden erupted. Everything else followed.

Houston played his final Knicks game in 2005, hampered by knee injuries. He remains active in the Knicks organization as an executive.`,
    workIds: ['houston_bounce'],
  },
  mark_messier: {
    id: 'mark_messier', topicId: 'hockey', name: 'Mark Messier', years: '1961–present',
    nationality: 'Canadian',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Mark_Messier_2016.jpg/500px-Mark_Messier_2016.jpg',
    tagline: `The Captain who guaranteed a Stanley Cup — and delivered.`,
    primer: `Mark Messier won five Stanley Cup championships with the Edmonton Oilers alongside Wayne Gretzky. When he arrived in New York in 1991, he was already one of the two or three greatest players in NHL history. What he brought to the Rangers was something more specific: he knew what winning required, and he expected nothing less.

He was a center of exceptional skill and physical force, a leader in the most direct sense — he led by doing, by demanding, and by delivering when delivery mattered most. His skating was powerful. His shot was lethal. His ability to play his best hockey in the most important moments set the standard that all captains are judged against.

In 1994, with the Rangers chasing their first Stanley Cup since 1940, Messier made the most famous guarantee in hockey history before Game 6 of the Eastern Conference Finals. He backed it up with a hat trick. The Rangers won Game 7 the next night and went on to win the Cup.

He is one of two players (with Gretzky) to score 600 career goals. He was inducted into the Hockey Hall of Fame in 2007. His number 11 hangs in the rafters at Madison Square Garden.`,
    workIds: ['messier_guarantee'],
  },
  henrik_lundqvist: {
    id: 'henrik_lundqvist', topicId: 'hockey', name: 'Henrik Lundqvist', years: '1982–present',
    nationality: 'Swedish',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Henrik_Lundqvist_by_Gage_Skidmore.jpg/500px-Henrik_Lundqvist_by_Gage_Skidmore.jpg',
    tagline: `The King of New York — the best goaltender of his generation who never won the Cup.`,
    primer: `Henrik Lundqvist played fifteen seasons for the New York Rangers, from 2005 to 2020. He was, for extended periods of that time, the best goaltender in the NHL and the reason the Rangers were competitive through years when the team around him ranged from good to mediocre.

His technical foundation was exceptional: his positioning eliminated shooting lanes, his athleticism allowed him to compensate for positional errors, and his competitive temperament meant he was virtually always better in pressure situations than in low-stakes games. He was a Vezina Trophy winner (awarded to the NHL's best goaltender) in 2012, and he finished as a finalist five other times.

His nickname was "The King" — a reference to Henrik VIII, not to his play, though the regality was appropriate. He was the face of the Rangers for fifteen years, a reliable presence in a city that expects athletes to perform or be replaced.

He reached the Stanley Cup Finals in 2014, losing to the Los Angeles Kings. He never won the Cup as a Ranger. He was released in 2020, signed with Washington to chase a championship, and was diagnosed with a serious heart condition before he could play. He retired in 2021. The Rangers retired his number 30 in 2022.`,
    workIds: ['lundqvist_2014_playoffs'],
  },
  brian_leetch: {
    id: 'brian_leetch', topicId: 'hockey', name: 'Brian Leetch', years: '1968–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Brian_Leetch_New_York_Rangers_1997_Vancouver.jpg/500px-Brian_Leetch_New_York_Rangers_1997_Vancouver.jpg',
    tagline: `The best American defenseman in NHL history — and the man who won the Conn Smythe.`,
    primer: `Brian Leetch is the greatest American-born defenseman in the history of the NHL. He played eighteen seasons, the majority of them with the New York Rangers, and he won the Conn Smythe Trophy as the MVP of the 1994 Stanley Cup Playoffs — the first American-born player to receive that honor.

His skating was genuinely the fastest in the NHL at his peak — a quality that allowed him to carry the puck from his own zone and join the rush with a speed that offensive players couldn't match. He thought of the game as a forward: his ability to read developing plays before they developed and position himself for offensive chances was the quality that separated him from other elite defensemen.

He put up 34 playoff points in 1994 — 11 goals and 23 assists in 23 games — setting a record for American-born players in a single postseason that still stands. The championship required a Game 7 against Vancouver, and Leetch was on the ice for the decisive moments.

He was inducted into the Hockey Hall of Fame in 2009 and the United States Hockey Hall of Fame. The Rangers retired his number 2.`,
    workIds: ['leetch_conn_smythe'],
  },
  rod_gilbert: {
    id: 'rod_gilbert', topicId: 'hockey', name: 'Rod Gilbert', years: '1941–2021',
    nationality: 'Canadian',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/GilbertRangers.png',
    tagline: `The franchise leader — the most devoted Ranger, without a championship.`,
    primer: `Rod Gilbert played his entire 18-season career for the New York Rangers, scoring more goals and points than any Ranger before or since. He played through two spinal surgeries that would have ended most careers. He never won the Stanley Cup. He remained associated with the Rangers organization until his death in 2021.

He was born in Montreal and might have played his whole career for the Canadiens — he was a francophone who grew up in a hockey culture that worshipped the NHL's most successful franchise. Instead, the Rangers drafted him, and he made New York his home completely.

His right wing play was characterized by an exceptional shot, elegant skating, and the competitive durability that the spinal surgeries proved: when the surgeons told him the risks of returning to professional hockey, he returned to professional hockey. He became the franchise's career scoring leader and held that record until the 1990s.

The Rangers retired his number 7 in 1979. He worked for the team's community and alumni relations for decades. He died in 2021, still associated with an organization he had represented since 1960. He was inducted into the Hockey Hall of Fame in 1982.`,
    workIds: ['gilbert_career'],
  },
  mike_richter: {
    id: 'mike_richter', topicId: 'hockey', name: 'Mike Richter', years: '1966–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Mike_Richter.jpg',
    tagline: `The championship goaltender — and the penalty shot that saved the 1994 Cup.`,
    primer: `Mike Richter played thirteen seasons for the New York Rangers and was their starting goaltender for a decade. He won one Stanley Cup, in 1994, and he was the most important player the Rangers had during that playoff run behind Mark Messier.

He came from Abington, Pennsylvania, and attended the University of Wisconsin before being drafted by the Rangers. He was athletic, technically sound, and competitive in the way that goaltenders who play in high-pressure markets for a long time need to be. The New York media environment does not accommodate goaltenders who falter.

His defining moment in the 1994 playoffs came in Game 4 of the Finals against Vancouver. Pavel Bure — the fastest and most dangerous forward in hockey — received a penalty shot with the Rangers leading 2-1 in the game. Bure moved to his backhand. Richter stopped him.

Beyond 1994, Richter was the face of American goaltending in the 1990s. He won the 1996 World Cup of Hockey with Team USA, making the saves that completed an upset of Canada. He was the career wins and shutouts leader in Rangers history when he retired in 2004 due to a head injury.`,
    workIds: ['richter_1994_cup'],
  },
  arthur_ashe: {
    id: 'arthur_ashe', topicId: 'tennis', name: 'Arthur Ashe', years: '1943–1993',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Arthur_Ashe_%28cropped%29.jpg/500px-Arthur_Ashe_%28cropped%29.jpg',
    tagline: `The first Black man to win the US Open — and a life that changed more than tennis.`,
    primer: `Arthur Ashe won the first US Open in 1968, the first Australian Open in 1970, and Wimbledon in 1975. He is the only Black man to have won any of those three titles. He won them with a game built on serve-and-volley precision, disguise, and an intelligence about opponents that opponents consistently underestimated.

He grew up in Richmond, Virginia, in a segregated society that restricted where he could practice and who he could play. He became the first Black player selected for the US Davis Cup team. He was the first Black man to win the US Open and Wimbledon. These facts existed alongside his tennis, inseparable from it.

Off the court, he was an activist, an advocate for African causes, a fighter against apartheid who was arrested at the South African embassy in Washington. He wrote, taught, and organized throughout his career and retirement.

He was diagnosed with HIV in 1988 following a blood transfusion during heart surgery. He announced his condition publicly in 1992, after a reporter asked him about it. He continued working until his death in 1993 at 49.

The USTA National Tennis Center in Flushing Meadows — home of the US Open — bears his name officially. The largest tennis stadium in the world is named for him.`,
    workIds: ['ashe_1968_us_open'],
  },
  billie_jean_king: {
    id: 'billie_jean_king', topicId: 'tennis', name: 'Billie Jean King', years: '1943–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Billie_Jean_King_at_the_2026_Sundance_Film_Festival_02_%28crop_2%29.jpg/500px-Billie_Jean_King_at_the_2026_Sundance_Film_Festival_02_%28crop_2%29.jpg',
    tagline: `The woman who made professional tennis equal — one match and one fight at a time.`,
    primer: `Billie Jean King won 39 Grand Slam titles across singles, doubles, and mixed doubles. She won six US Opens, four Wimbledons, and one Australian Open in singles. She was the world's top-ranked player for five years in the 1960s and 1970s. The numbers are one way to understand her career.

The other way is to follow what she built. She cofounded the Women's Tennis Association in 1973, creating the organizational structure that gave women\'s professional tennis a stable institutional home. She fought for equal prize money at major tournaments. The US Open became the first Grand Slam to offer equal prize money in 1973 — partly because she made it politically impossible not to.

In September 1973, she played Bobby Riggs in the "Battle of the Sexes." Riggs was a former Wimbledon champion who publicly claimed that women's tennis was so inferior that any old man could beat any woman player. King accepted his challenge. She defeated him 6-4, 6-3, 6-3 before 90 million television viewers. The match became a cultural moment about something larger than tennis.

She is still active in tennis and in advocacy. The USTA National Tennis Center in Flushing, where the US Open is played, officially bears her name.`,
    workIds: ['king_1974_us_open'],
  },
  serena_williams: {
    id: 'serena_williams', topicId: 'tennis', name: 'Serena Williams', years: '1981–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 4.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg',
    tagline: `The greatest tennis player of all time — and Arthur Ashe Stadium was her home.`,
    primer: `Serena Williams won 23 Grand Slam singles titles. She is the greatest women's tennis player in history and one of the two or three greatest tennis players — of any gender — the sport has produced.

She and her sister Venus were raised by their father Richard Williams, who taught them to play on public courts in Compton, California. She turned professional at 14. She won her first US Open at 17. She won her last Grand Slam at 35. The span of that career — nearly two decades of sustained excellence — is matched by almost no one in any professional sport.

Her serve is considered the greatest shot in the history of women's tennis: flat, accurate, and regularly exceeding 120 miles per hour in a way that rendered the return game effectively optional for opponents. Her athleticism allowed her to retrieve balls that other players abandoned. Her competitiveness kept her winning through injuries and health crises that would have ended most careers.

She first won the US Open in 1999. She won it five more times, most recently in 2014. She played her final professional match at Arthur Ashe Stadium in 2022, retiring in the second round to Ajla Tomljanović. The stadium crowd gave her a farewell that the tournament had not previously seen.`,
    workIds: ['serena_2012_us_open'],
  },
  jimmy_connors: {
    id: 'jimmy_connors', topicId: 'tennis', name: 'Jimmy Connors', years: '1952–present',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Jimmy_Conners_1994.jpg/500px-Jimmy_Conners_1994.jpg',
    tagline: `The crowd fighter — five US Opens and a 1991 run that stopped New York cold.`,
    primer: `Jimmy Connors won eight Grand Slam singles titles, including five US Opens. He was the world's top-ranked player for 268 weeks. He was the most aggressively crowd-engaged player in professional tennis — performing for audiences in a way that made individual matches feel like personal relationships between a player and a city.

His game was built on ferocity and durability. He hit two-handed backhands with the kind of force that wore opponents down. He ran down balls that other players conceded. He came back from deficits that others accepted. He played past the point where he should have been competitive, and he kept competing.

The 1991 US Open was his final statement. He was 39 years old, ranked 174th in the world, and entered as a wild card. He won five matches — two of them in five sets against players ranked in the top 25. The New York crowds adopted him completely, in the way that New York crowds treat athletes who give them something unexpected.

He lost in the semifinals to Stefan Edberg, the top-ranked player in the world, in four sets. He never played the US Open again. The 1991 run is one of the great tournament stories in Grand Slam history.`,
    workIds: ['connors_1991_run'],
  },
  steffi_graf: {
    id: 'steffi_graf', topicId: 'tennis', name: 'Steffi Graf', years: '1969–present',
    nationality: 'German',
    imageCredit: 'Wikimedia Commons / CC BY-SA 2.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Steffi_Graf_in_Hamburg_2010_%28cropped%29.jpg/500px-Steffi_Graf_in_Hamburg_2010_%28cropped%29.jpg',
    tagline: `The Golden Slam — a feat that happened once, and will probably never happen again.`,
    primer: `Steffi Graf won 22 Grand Slam singles titles and is considered by many tennis experts the greatest women's player in history — an argument she shares with Serena Williams and Martina Navratilova. Her forehand — heavy, penetrating, accurate, hittable from anywhere on the court at any height — is considered the finest single shot women's tennis has produced.

In 1988, she completed the Golden Slam: the Australian Open, the French Open, Wimbledon, and the US Open, followed by the Olympic gold medal at Seoul. No player of any gender has done this before or since. She invented a category of achievement.

She held the world number-one ranking for 377 weeks — a record that stood until Serena Williams passed it. She won across all surfaces: clay at Roland Garros, grass at Wimbledon, hardcourt at the US Open and Australian Open. Surface specialization was not part of her vocabulary.

She retired in 1999 at the age of 30, still ranked number 3 in the world after a run to the French Open final. She had made the decision to retire on her own terms, at a time of her choosing, before decline made the decision for her. That she could do this — retire from the top of the sport rather than from its margins — says something about who she was as a competitor.`,
    workIds: ['graf_1988_us_open'],
  },
  muhammad_ali: {
    id: 'muhammad_ali', topicId: 'boxing', name: 'Muhammad Ali', years: '1942–2016',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Muhammad_Ali_NYWTS.jpg/500px-Muhammad_Ali_NYWTS.jpg',
    tagline: `The Greatest — at boxing, at language, at refusing to be less than what he believed.`,
    primer: `Muhammad Ali was the heavyweight champion of the world three times. He was the fastest heavyweight who ever lived, combining footwork and hand speed at a size that made him effectively impossible to corner or hurt cleanly. He beat Sonny Liston, Joe Frazier, George Foreman, and everyone else the sport put in front of him at his peak — and he kept winning after his peak, on craft and will.

He was also something larger than a boxer. He refused induction into the military during the Vietnam War, citing his Muslim faith and his opposition to the war. The boxing authorities stripped him of his title. He was banned from the sport for three years — the prime of his athletic life — and he accepted this rather than compromise what he believed.

He came back in 1970. He lost to Frazier in the Fight of the Century in 1971. He won the Rumble in the Jungle from Foreman in 1974. He won the Thrilla in Manila from Frazier in 1975. He was still, somehow, the most famous person in the world.

He was diagnosed with Parkinson's disease in 1984, a consequence of the accumulated damage from a career of world championship boxing. He lit the Olympic torch in Atlanta in 1996 — with shaking hands, to a stadium that went silent in recognition. He died in 2016.`,
    workIds: ['ali_frazier_1971'],
  },
  joe_frazier: {
    id: 'joe_frazier', topicId: 'boxing', name: 'Joe Frazier', years: '1944–2011',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Joe_Frazier_reading_newspaper_cropped.jpg/500px-Joe_Frazier_reading_newspaper_cropped.jpg',
    tagline: `Smokin' Joe — the man who beat Muhammad Ali, and was never quite given his due.`,
    primer: `Joe Frazier was the world heavyweight champion from 1968 to 1973. He was undefeated when he fought Muhammad Ali in the Fight of the Century in 1971, and he beat him. He did what no heavyweight of his era did: he walked through Ali's jab, took the punishment, and made it to the inside, where his left hook — one of the most lethal punches in heavyweight history — could do its work.

He was from Beaufort, South Carolina, and trained in Philadelphia, where his gym — Joe Frazier's Gym — became one of the most famous boxing facilities in America. His style was shaped by what he was: a shorter-than-average heavyweight who had to fight from the inside, who had to absorb shots to land shots, who relied on relentless forward pressure and a devastating hook.

History positioned him as Ali's opposite — the establishment\'s champion against the counter-culture\'s champion — and this positioning, which was partly Ali\'s doing, followed him for the rest of his life. The enmity between them, which began as competitive and became personal and occasionally vicious, colored how the public understood both men.

He was a genuinely great heavyweight champion. He beat the greatest fighter in history and lost to him twice more in fights that both men called the hardest things they had ever done. He died in 2011.`,
    workIds: ['frazier_ali_msg'],
  },
  sugar_ray_robinson: {
    id: 'sugar_ray_robinson', topicId: 'boxing', name: 'Sugar Ray Robinson', years: '1921–1989',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Sugar_Ray_Robinson_1947.jpg/500px-Sugar_Ray_Robinson_1947.jpg',
    tagline: `The greatest pound-for-pound boxer who ever lived — by the near-universal consensus of experts.`,
    primer: `Sugar Ray Robinson is considered by the consensus of boxing historians, trainers, and fighters to be the greatest pound-for-pound boxer in the history of the sport. His career record was 173 wins, 19 losses, and 6 draws — with 108 knockouts. He held the welterweight championship and the middleweight championship multiple times.

His technique was the template for how boxing is taught. His footwork created angles that his opponents couldn't anticipate. His combination punching was rapid and precise in a way that the sport had not seen before and has rarely seen since. He could knock you out with either hand. He could outpoint opponents for fifteen rounds. He could do whatever the fight required.

He came from Detroit and built his career in New York, appearing at Madison Square Garden dozens of times. He became one of the first Black American athletes to achieve mainstream celebrity — his flamboyance, his style, his entourage, and his businesses in Harlem made him a figure as recognizable for his life off the canvas as his record on it.

His nickname gave Muhammad Ali his. When Ali was a young fighter named Cassius Clay, he said he wanted to be the "Sugar Ray of boxing." The ambition was appropriate: Robinson was the standard.`,
    workIds: ['robinson_lamotta_6'],
  },
  jake_lamotta: {
    id: 'jake_lamotta', topicId: 'boxing', name: 'Jake LaMotta', years: '1921–2017',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / Public Domain',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Jake_LaMotta_signed_photo_postcard_1952.JPG/500px-Jake_LaMotta_signed_photo_postcard_1952.JPG',
    tagline: `The Bronx Bull — the man who knocked down Sugar Ray Robinson, and never stopped.`,
    primer: `Jake LaMotta grew up in the Bronx, in circumstances of sufficient poverty and violence that he learned early that absorbing punishment was not only possible but sometimes necessary. He brought this knowledge to professional boxing and made it the foundation of a career that culminated in the world middleweight championship.

He was not a skilled boxer in the conventional sense — he was a durability machine who kept pressing forward through punishment that ended other fighters, and who delivered damage in return at close quarters. His left hook and body attack were the weapons; his ability to take shots was the engine that powered the strategy.

He fought Sugar Ray Robinson six times over nine years — one of the most sustained rivalries in boxing history. He won once, knocked Robinson down once in a fight he ultimately lost, and lost the other four. The sixth fight, for the middleweight title in 1951, is considered one of the greatest fights ever. Robinson stopped him in the 13th round.

Martin Scorsese's Raging Bull (1980), with Robert De Niro, dramatized his career and his fights at the Garden with a realism that made it one of the most acclaimed sports films ever made. LaMotta lived to 95. He outlasted his legend.`,
    workIds: ['lamotta_msg_career'],
  },
  floyd_patterson: {
    id: 'floyd_patterson', topicId: 'boxing', name: 'Floyd Patterson', years: '1935–2006',
    nationality: 'American',
    imageCredit: 'Wikimedia Commons / CC BY-SA 3.0',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Floyd_Patterson_2_%28cropped%29.jpg/500px-Floyd_Patterson_2_%28cropped%29.jpg',
    tagline: `The first heavyweight to reclaim the title — and a New York story.`,
    primer: `Floyd Patterson grew up in Bedford-Stuyvesant, Brooklyn, in circumstances similar to those that produce fighters: poverty, disruption, the formative experience of violence as both a threat and a possible exit. He was referred to the Wiltwyck School for troubled boys, where he began boxing under the instruction of trainer Cus D'Amato.

D'Amato would become the most important figure in Patterson\'s life — and, a generation later, in the life of Mike Tyson. His methods, developed with Patterson at the Gramercy Gym in New York, emphasized psychological readiness alongside technical skill. Patterson internalized them so completely that he became, at 21, the youngest heavyweight champion in history when he won the title in 1956.

He lost the title to Ingemar Johansson in 1959 — knocked down seven times in the third round. He regained it in 1960, becoming the first heavyweight champion to reclaim the title. The third fight, at Madison Square Garden in 1961, was his conclusive answer.

He was thoughtful and introspective in a way unusual for boxing champions — he wrote, he reflected, he second-guessed himself publicly. He served on the New York State Athletic Commission after retirement. D'Amato\'s methods traveled from Patterson to Tyson: the lineage runs through New York.`,
    workIds: ['patterson_johansson_1960'],
  },
  // ── ARCHITECTURE FIGURES (Architects) ─────────────────────────────────────
  william_van_alen: {
    id: 'william_van_alen',
    name: `William Van Alen`,
    topicId: 'arch_art_deco',
    nationality: `American`,
    years: `1883–1954`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/William_Van_Alen_%281883%E2%80%931954%29.png/440px-William_Van_Alen_%281883%E2%80%931954%29.png',
    tagline: `The architect who hid a spire inside a skyscraper to claim the world height record.`,
    primer: `William Van Alen won the École des Beaux-Arts Grand Prix de Rome and returned to New York to design buildings for wealthy clients — including the Chrysler Corporation. His Chrysler Building is the supreme achievement of Art Deco architecture, notable for its stainless steel Nirosta cladding, its eagle gargoyles adapted from automobile radiator caps, and the secret spire he assembled inside the crown and raised in 90 minutes to surpass the just-completed Bank of Manhattan Trust building. He never designed anything of comparable importance afterward; the Chrysler Building was his career in a single structure.`,
    workIds: ['chrysler_eagle_gargoyles', 'chrysler_crown_spire'],
  },
  william_lamb: {
    id: 'william_lamb',
    name: `William F. Lamb`,
    topicId: 'arch_art_deco',
    nationality: `American`,
    years: `1883–1952`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/440px-Empire_State_Building_%28aerial_view%29.jpg',
    tagline: `The lead designer of the Empire State Building, completed in 410 days during the Depression.`,
    primer: `William Lamb of Shreve, Lamb & Harmon was the lead designer responsible for the Empire State Building's distinctive silhouette. Working under intense time pressure — the building needed to beat the Chrysler Building to the height record while also opening on schedule — Lamb developed the stepped setback profile that became the defining image of the Art Deco skyscraper. The 1916 Zoning Resolution required setbacks to allow light to reach the street; Lamb turned this regulatory constraint into an aesthetic virtue, producing a building whose tapering form is immediately legible from any angle in the city.`,
    workIds: ['empire_state_lobby', 'empire_state_setbacks'],
  },
  raymond_hood: {
    id: 'raymond_hood',
    name: `Raymond Hood`,
    topicId: 'arch_art_deco',
    nationality: `American`,
    years: `1881–1934`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Raymond_M._Hood%2C_1923.jpg/440px-Raymond_M._Hood%2C_1923.jpg',
    tagline: `The designer of Rockefeller Center — the only great Art Deco urban complex ever completed.`,
    primer: `Raymond Hood was the most versatile American architect of the 1920s and early 1930s, moving from the Gothic historicism of the Tribune Tower to the black-and-gold Art Deco of the American Radiator Building to the stripped modernism of the McGraw-Hill Building. His masterwork is Rockefeller Center, where he coordinated fourteen buildings into a coherent urban ensemble with public spaces — the Channel Gardens, the sunken plaza — that had no precedent in American commercial development. Hood died in 1934 before seeing the full complex completed, at age 53.`,
    workIds: ['rockefeller_lobby_murals', 'rockefeller_sunken_plaza'],
  },
  cass_gilbert: {
    id: 'cass_gilbert',
    name: `Cass Gilbert`,
    topicId: 'arch_gothic',
    nationality: `American`,
    years: `1859–1934`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Cass_Gilbert_1907.jpg/440px-Cass_Gilbert_1907.jpg',
    tagline: `The architect of the Woolworth Building — the Cathedral of Commerce.`,
    primer: `Cass Gilbert was the leading American architect of his generation for federal and civic commissions: the US Supreme Court building, the Minnesota State Capitol, the Woolworth Building. His genius was applying historical styles with genuine structural conviction rather than as surface decoration. The Woolworth Building is his supreme achievement in New York: a Gothic Revival skyscraper that uses pointed arches, flying buttresses, and terra-cotta ornament not as appliqué but as an integral skin, producing a building that convinced a generation of architects that historical styles could be used honestly in modern construction.`,
    workIds: ['woolworth_lobby'],
  },
  john_roebling: {
    id: 'john_roebling',
    name: `John A. Roebling`,
    topicId: 'arch_gothic',
    nationality: `German-American`,
    years: `1806–1869`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Brooklyn_Museum_-_John_Augustus_Roebling.jpg/440px-Brooklyn_Museum_-_John_Augustus_Roebling.jpg',
    tagline: `The engineer who designed the Brooklyn Bridge and died before it was built.`,
    primer: `John Roebling was a German immigrant who revolutionized suspension bridge engineering, inventing the wire rope cable that makes long-span bridges possible. He designed the Brooklyn Bridge as a structure of unprecedented scale — 1,595 feet, nearly twice the longest existing span — and chose Gothic granite towers not merely for aesthetics but because the pointed arch transmits loads most efficiently. He died in 1869 from tetanus after a ferry crushed his foot during a site survey. His son Washington completed the bridge, directing construction from his Brooklyn apartment while incapacitated by decompression sickness. The bridge opened in 1883.`,
    workIds: ['brooklyn_bridge_promenade', 'brooklyn_bridge_towers'],
  },
  james_renwick_jr: {
    id: 'james_renwick_jr',
    name: `James Renwick Jr.`,
    topicId: 'arch_gothic',
    nationality: `American`,
    years: `1818–1895`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/5/52/James_Renwick%2C_Jr.gif',
    tagline: `The architect who brought European Gothic cathedral scale to American religious buildings.`,
    primer: `James Renwick Jr. had no formal architectural training — he was an engineer by education — but his study of French and English Gothic cathedrals produced two of the most significant religious buildings in American history: Grace Church and St. Patrick's Cathedral. St. Patrick's, built over twenty years beginning in 1858, introduced cathedral-scale Gothic to a country where church architecture had been modest and vernacular. The white marble exterior, the twin 330-foot spires, the structural use of flying buttresses: all were unprecedented in the United States. Renwick's work established Gothic Revival as the dominant language for American religious architecture for the next fifty years.`,
    workIds: ['st_patricks_rose_window'],
  },
  whitney_warren: {
    id: 'whitney_warren',
    name: `Whitney Warren`,
    topicId: 'arch_beaux_arts',
    nationality: `American`,
    years: `1864–1943`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Whitney_Warren_1915_%28cropped%29.jpg/440px-Whitney_Warren_1915_%28cropped%29.jpg',
    tagline: `Lead architect of Grand Central Terminal, designer of the finest Beaux-Arts interior in North America.`,
    primer: `Whitney Warren trained at the École des Beaux-Arts in Paris and returned to New York to found Warren & Wetmore, the firm responsible for Grand Central Terminal's architectural design (in collaboration with Reed & Stem, who handled the engineering). Warren's contribution was the civic vision: that a terminal should feel like a cathedral of transportation, that arrival in New York should be a monumental experience. The Main Concourse — its scale, its celestial ceiling, its tidal flow of commuters — is his design and remains the finest public interior in the city.`,
    workIds: ['grand_central_main_concourse', 'grand_central_celestial_ceiling'],
  },
  john_carrere: {
    id: 'john_carrere',
    name: `John Carrère`,
    topicId: 'arch_beaux_arts',
    nationality: `American`,
    years: `1858–1911`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/John_Merven_Carr%C3%A8re.jpg/440px-John_Merven_Carr%C3%A8re.jpg',
    tagline: `Co-designer of the New York Public Library — a palace for public knowledge on Fifth Avenue.`,
    primer: `John Carrère and Thomas Hastings won the New York Public Library commission in 1897 after a design competition and spent fourteen years building a Beaux-Arts temple of knowledge on the site of the old Croton Reservoir. Their design used the full vocabulary of French classicism — colonnades, rusticated base, sculptural enrichment — in service of a democratic institution: the building gives everyone a grand architectural experience. Carrère died in 1911, the year the building opened, killed in a taxi accident. The Rose Main Reading Room, the exterior lions, the Fifth Avenue facade: all realized his vision.`,
    workIds: ['nypl_rose_reading_room', 'nypl_facade_lions'],
  },
  daniel_burnham: {
    id: 'daniel_burnham',
    name: `Daniel Burnham`,
    topicId: 'arch_beaux_arts',
    nationality: `American`,
    years: `1846–1912`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Daniel_Hudson_Burnham.png/440px-Daniel_Hudson_Burnham.png',
    tagline: `"Make no small plans." The architect who proved steel-frame skyscrapers could be beautiful on any lot.`,
    primer: `Daniel Burnham was the most powerful architect in America at the turn of the 20th century: director of works at the 1893 World's Columbian Exposition, master planner of Washington and Chicago, designer of landmark buildings in a dozen cities. The Flatiron Building — formally the Fuller Building — was built for his firm Burnham & Root (after Root's death, D.H. Burnham & Company) and demonstrates his conviction that the new structural technology of steel framing could produce buildings of genuine beauty. The triangular lot was a constraint; the result became one of the most photographed buildings in the world.`,
    workIds: ['flatiron_prow'],
  },
  mies_van_der_rohe: {
    id: 'mies_van_der_rohe',
    name: `Mies van der Rohe`,
    topicId: 'arch_modernism',
    nationality: `German-American`,
    years: `1886–1969`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Ludwig_Mies_van_der_Rohe_in_Arts_%26_Architecture%2C_June_1960_issue.jpg/440px-Ludwig_Mies_van_der_Rohe_in_Arts_%26_Architecture%2C_June_1960_issue.jpg',
    tagline: `"Less is more." The architect who established the visual language of corporate modernism.`,
    primer: `Ludwig Mies van der Rohe directed the Bauhaus school in Germany before fleeing to America in 1938, where he headed the architecture program at IIT and built a series of buildings that defined modernism for corporate clients. The Seagram Building is his New York masterwork: a bronze-and-amber-glass tower that expresses its structure, sits back from the street to give space to the city, and uses materials of the highest quality with absolute precision. "God is in the details" was his credo. The Seagram Building taught corporate America what modernism looked like and established the glass tower as the default language of office architecture worldwide.`,
    workIds: ['seagram_plaza', 'seagram_bronze_facade'],
  },
  gordon_bunshaft: {
    id: 'gordon_bunshaft',
    name: `Gordon Bunshaft`,
    topicId: 'arch_modernism',
    nationality: `American`,
    years: `1909–1990`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Lever_House_390_Park_Avenue.jpg/440px-Lever_House_390_Park_Avenue.jpg',
    tagline: `The designer of Lever House — the building that introduced the glass curtain wall to Park Avenue.`,
    primer: `Gordon Bunshaft was the design partner at Skidmore, Owings & Merrill responsible for Lever House, the Hirshhorn Museum, the Beinecke Rare Book Library at Yale, and a series of buildings that established corporate modernism as a coherent American style. Lever House, completed in 1952, was the first all-glass curtain wall office building on Park Avenue and launched the era of transparent corporate architecture. Bunshaft's buildings were technically precise and formally innovative — he was interested in structure, materials, and the relationship between building and ground — without being ideologically austere. He won the Pritzker Prize in 1988.`,
    workIds: [],
  },
  le_corbusier: {
    id: 'le_corbusier',
    name: `Le Corbusier`,
    topicId: 'arch_modernism',
    nationality: `Swiss-French`,
    years: `1887–1965`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Le_Corbusier_%281964%29.jpg/440px-Le_Corbusier_%281964%29.jpg',
    tagline: `The Swiss-French architect whose glass slab design for the UN Secretariat shaped modernism worldwide.`,
    primer: `Charles-Édouard Jeanneret, known as Le Corbusier, was the most influential architect of the 20th century, not primarily through buildings he built but through ideas he propagated: the five points of architecture (pilotis, flat roof, free plan, horizontal windows, free facade), the machine aesthetic, the idea that a house is "a machine for living." His built work in New York is limited to the UN Secretariat concept, which was developed by the full committee but whose scheme — the vertical glass slab — was his contribution. His Chandigarh capitol complex in India and his Unité d'Habitation in Marseille are his greatest built achievements.`,
    workIds: [],
  },
  elizabeth_diller: {
    id: 'elizabeth_diller',
    name: `Elizabeth Diller`,
    topicId: 'arch_contemporary',
    nationality: `American`,
    years: `1954–`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Elizabeth_Diller_-_2016_%28cropped%29.jpg/440px-Elizabeth_Diller_-_2016_%28cropped%29.jpg',
    tagline: `Co-founder of DS+R, architects of the High Line and the Shed — the defining voice of contemporary New York architecture.`,
    primer: `Elizabeth Diller co-founded Diller Scofidio + Renfro with Ricardo Scofidio in 1981, initially working in installation art and performance before moving into architecture. The firm's High Line project — transforming 1.45 miles of abandoned freight rail into a linear park — is the most influential urban design intervention in New York since Central Park, and has spawned hundreds of infrastructure-reuse projects worldwide. DS+R also designed the Shed at Hudson Yards, the expansion of MoMA, the renovation of Lincoln Center, and the Broad Museum in Los Angeles. Diller was named one of Time's 100 most influential people in 1999.`,
    workIds: ['high_line_rail_preservation'],
  },
  david_childs: {
    id: 'david_childs',
    name: `David Childs`,
    topicId: 'arch_contemporary',
    nationality: `American`,
    years: `1941–`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/One_World_Trade_Center_on_Earth_Day_2013.jpg/440px-One_World_Trade_Center_on_Earth_Day_2013.jpg',
    tagline: `The architect of One World Trade Center — a building whose meaning is inseparable from its weight.`,
    primer: `David Childs was the senior design partner at Skidmore, Owings & Merrill responsible for One World Trade Center, the replacement for the destroyed twin towers. The commission was among the most fraught in architectural history, involving multiple design revisions, security requirements, symbolic demands, and political pressures. The final building — 1,776 feet tall, a square plan that rotates as it rises — is a supertall tower that acknowledges its symbolic role without being overwhelmed by it. Childs also designed 7 World Trade Center, Time Warner Center, and the expansion of the US Capitol Visitor Center.`,
    workIds: [],
  },

  // ── THEATER FIGURES ──────────────────────────────────────────────────────
  stephen_sondheim: {
    id: 'stephen_sondheim',
    name: `Stephen Sondheim`,
    topicId: 'theater_musicals',
    nationality: `American`,
    years: `1930–2021`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Stephen_Sondheim_-_smoking.JPG',
    tagline: `The greatest lyricist in the history of the American musical.`,
    primer: `Stephen Sondheim wrote the lyrics for West Side Story and Gypsy before he was thirty, then spent the next fifty years writing the music and lyrics for a series of musicals that permanently expanded what the form could do. Company (1970), Follies (1971), A Little Night Music (1973), Sweeney Todd (1979), Sunday in the Park with George (1984), Into the Woods (1987), Assassins (1990). Each show asked questions the musical had not previously been permitted to ask: about marriage, about ambition, about violence, about memory, about what it means to make art. Sondheim's work is dense, literary, emotionally demanding, and funny in ways that take time to understand. He won eight Tony Awards, a Pulitzer Prize, and the Presidential Medal of Freedom. He died in 2021, one day after Thanksgiving.`,
    workIds: ['company_1970', 'gypsy_1959'],
  },
  richard_rodgers: {
    id: 'richard_rodgers',
    name: `Richard Rodgers`,
    topicId: 'theater_musicals',
    nationality: `American`,
    years: `1902–1979`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Rodgers.jpg/440px-Rodgers.jpg',
    tagline: `With Hammerstein, he invented the modern American musical. With Hart, he invented sophisticated popular song.`,
    primer: `Richard Rodgers worked with two of the greatest lyricists in American history — Lorenz Hart from 1919 to 1943, Oscar Hammerstein II from 1943 to 1960. With Hart he wrote Pal Joey, Babes in Arms, and a series of songs that became the core of the Great American Songbook. With Hammerstein he wrote Oklahoma!, Carousel, South Pacific, The King and I, and The Sound of Music — the shows that established Broadway's golden age and defined the integrated musical as a form. Oklahoma! alone would be enough to secure his place in American cultural history. That he also wrote "My Funny Valentine," "Blue Moon," and "The Lady Is a Tramp" makes him one of the most consequential figures in 20th-century American music.`,
    workIds: ['oklahoma_1943', 'south_pacific_1949', 'carousel_1945'],
  },
  lin_manuel_miranda: {
    id: 'lin_manuel_miranda',
    name: `Lin-Manuel Miranda`,
    topicId: 'theater_musicals',
    nationality: `American`,
    years: `1980–`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Lin-Manuel_Miranda_%26_James_McAvoy_%2848383681926%29_%28cropped%29.jpg/440px-Lin-Manuel_Miranda_%26_James_McAvoy_%2848383681926%29_%28cropped%29.jpg',
    tagline: `Hamilton and In the Heights — the two most important Broadway musicals of the 21st century.`,
    primer: `Lin-Manuel Miranda grew up in Washington Heights, the son of Puerto Rican parents, and wrote a musical about his neighborhood before he was thirty. In the Heights won four Tony Awards in 2008. Then, while researching Alexander Hamilton, Miranda heard hip-hop as the appropriate language for a man who wrote 51 of the 85 Federalist Papers in a single year and understood that brilliance and ambition and the hunger to make something permanent were subjects hip-hop had always addressed. Hamilton opened at the Public Theater in 2015, transferred to Broadway, won 11 Tonys and the Pulitzer Prize, and became the most talked-about piece of American art of the decade. Miranda writes music, lyrics, and book, and performed in both shows.`,
    workIds: ['hamilton_2015', 'in_the_heights_public'],
  },
  arthur_miller: {
    id: 'arthur_miller',
    name: `Arthur Miller`,
    topicId: 'theater_drama',
    nationality: `American`,
    years: `1915–2005`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Arthur_Miller_1966.jpg/440px-Arthur_Miller_1966.jpg',
    tagline: `The playwright of American guilt. Death of a Salesman is the great American play.`,
    primer: `Arthur Miller grew up in Brooklyn, the son of a Polish immigrant manufacturer ruined by the Depression. His plays are about what happens when the American promise of success meets the reality of who succeeds and who doesn't. Death of a Salesman (1949) is the great American play: it is about Willy Loman, and it is about capitalism, and these are the same thing. The Crucible (1953) began as an allegory for McCarthyism — Miller was himself blacklisted — and has been revived in every era that requires an allegory for the persecution of the innocent by the powerful. All My Sons (1947), A View from the Bridge (1955): Miller's entire body of work asks the same question, from every angle, and never finds a comfortable answer.`,
    workIds: ['death_salesman_revival'],
  },
  tennessee_williams: {
    id: 'tennessee_williams',
    name: `Tennessee Williams`,
    topicId: 'theater_drama',
    nationality: `American`,
    years: `1911–1983`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Tennessee_Williams_NYWTS.jpg/440px-Tennessee_Williams_NYWTS.jpg',
    tagline: `He brought the psychological interior of the American South to Broadway and made desire a subject for drama.`,
    primer: `Thomas Lanier Williams III grew up in Mississippi and Missouri, suffered a nervous breakdown in his early twenties, and emerged as the playwright who could write about desire, violence, and psychological disintegration with a lyricism no American dramatist had previously achieved. The Glass Menagerie (1944) made his name. A Streetcar Named Desire (1947) made Marlon Brando's name, made Elia Kazan's name, and made Williams famous worldwide. Cat on a Hot Tin Roof (1955) won the Pulitzer Prize, as did Streetcar. Williams's later work, increasingly experimental, was not well received in his lifetime. His reputation has been fully restored — he is now understood as one of the two or three most important American playwrights of the 20th century.`,
    workIds: ['streetcar_1947'],
  },
  august_wilson: {
    id: 'august_wilson',
    name: `August Wilson`,
    topicId: 'theater_drama',
    nationality: `American`,
    years: `1945–2005`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/August_Wilson_1990_%28cropped%29.jpg/440px-August_Wilson_1990_%28cropped%29.jpg',
    tagline: `His Pittsburgh Cycle — ten plays, one per decade of the 20th century — is the most sustained dramatic project in American theater.`,
    primer: `August Wilson grew up in the Hill District of Pittsburgh, the son of a German immigrant father and a Black mother, and left school at 15 after a teacher accused him of plagiarizing a paper he had written himself. He educated himself in libraries, read Borges and Ralph Ellison, heard the blues, and began writing plays. The Pittsburgh Cycle covers each decade of the 20th century in the Black American experience: Gem of the Ocean (1900s), Joe Turner's Come and Gone (1910s), Ma Rainey's Black Bottom (1920s), The Piano Lesson (1930s), Seven Guitars (1940s), Fences (1950s), Two Trains Running (1960s), Jitney (1970s), King Hedley II (1980s), Radio Golf (1990s). Two Pulitzer Prizes. The August Wilson Theatre on 52nd Street was named in his honor in 2005, the year he died of liver cancer.`,
    workIds: ['fences_1987'],
  },
  lorraine_hansberry: {
    id: 'lorraine_hansberry',
    name: `Lorraine Hansberry`,
    topicId: 'theater_drama',
    nationality: `American`,
    years: `1930–1965`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/%22The_Sign_in_Sidney_Brustein%27s_Window%22%2C_by_Lorraine_Hansberry_%28cropped%29.tif/lossy-page1-440px-%22The_Sign_in_Sidney_Brustein%27s_Window%22%2C_by_Lorraine_Hansberry_%28cropped%29.tif.jpg',
    tagline: `The youngest playwright to win the Drama Critics' Circle Award — and the first Black woman with a play on Broadway.`,
    primer: `Lorraine Hansberry was 28 when A Raisin in the Sun opened on Broadway. She was the youngest playwright, the first Black playwright, and the first Black woman to have a play produced on Broadway to win the New York Drama Critics' Circle Award. The play — about a Black Chicago family's struggle to move into a white neighborhood — made Sidney Poitier a star and changed what was possible for Black artists in American theater. Hansberry was a civil rights activist, a friend of James Baldwin and Nina Simone, and one of the most intellectually serious artists of her generation. She died of pancreatic cancer at 34. A Raisin in the Sun is what she managed to accomplish in the time she had. James Baldwin said she was "a very young woman, with an overpowering vision" and that her death left a silence that has never been filled.`,
    workIds: ['raisin_in_sun_1959'],
  },

  // ── HISTORY FIGURES ──────────────────────────────────────────────────────
  george_washington: {
    id: 'george_washington',
    name: `George Washington`,
    topicId: 'history_founding',
    nationality: `American`,
    years: `1732–1799`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/440px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg',
    tagline: `The general who won the Revolution, then gave up power — and in doing so made democracy possible.`,
    primer: `George Washington commanded the Continental Army for eight years, losing more battles than he won but keeping an army in the field long enough for France to intervene and Britain to tire. When the war ended in 1783, he was the most powerful man in America, with an army at his command and near-universal popular support. He resigned his commission at Fraunces Tavern in New York and went home to Virginia. He was then elected the first president, served two terms, and refused a third — establishing the two-term norm that held for 150 years. His financial leadership, in partnership with Hamilton, created the institutional framework of American capitalism. He died in 1799, two years after leaving office, at Mount Vernon.`,
    workIds: ['washington_inauguration_1789', 'washington_farewell_1783'],
  },
  alexander_hamilton: {
    id: 'alexander_hamilton',
    name: `Alexander Hamilton`,
    topicId: 'history_founding',
    nationality: `American (Caribbean-born)`,
    years: `1755–1804`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/John_Trumbull_-_Alexander_Hamilton_-_Google_Art_Project.jpg/440px-John_Trumbull_-_Alexander_Hamilton_-_Google_Art_Project.jpg',
    tagline: `First Treasury Secretary, co-author of The Federalist Papers, founder of American finance. Killed in a duel at 49.`,
    primer: `Alexander Hamilton was born illegitimately in Nevis in the British West Indies, apprenticed to a merchant house at eleven after his mother died, talked his way onto a ship to New York at seventeen, enrolled at King's College (now Columbia), and joined the Continental Army at 21. By 26 he was Washington's aide-de-camp and effectively his chief of staff. After the war he read law for six months, passed the bar, co-authored The Federalist Papers with Madison and Jay to argue for ratification of the Constitution, and became the first Secretary of the Treasury at 34. His financial system — the assumption of state debts, the creation of the First Bank of the United States, the funding of the national debt at face value — created the credit that made American economic expansion possible. He was shot by Aaron Burr in a duel in Weehawken, New Jersey, on July 11, 1804, and died the next day.`,
    workIds: ['hamiltons_financial_plan'],
  },
  frederick_douglass: {
    id: 'frederick_douglass',
    name: `Frederick Douglass`,
    topicId: 'history_civil_rights',
    nationality: `American`,
    years: `1818–1895`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Frederick_Douglass_%28circa_1879%29_%28cropped%29.jpg/440px-Frederick_Douglass_%28circa_1879%29_%28cropped%29.jpg',
    tagline: `Born into slavery. Escaped to New York. Became the most powerful abolitionist voice in America.`,
    primer: `Frederick Douglass was born into slavery in Talbot County, Maryland, around 1818. He taught himself to read using a spelling book, the Baltimore American, and the arguments of white schoolboys. In 1838 he escaped to New York City disguised as a sailor. From New York he made his way to New Bedford, Massachusetts, where he began speaking at abolitionist meetings and met William Lloyd Garrison. His Narrative of the Life of Frederick Douglass (1845) is one of the most important books in American literature: a first-person account of slavery that made the institution impossible to dismiss as abstract. He gave over 2,000 lectures, advised Abraham Lincoln during the Civil War, and served as U.S. Marshal for the District of Columbia, Recorder of Deeds, and U.S. Minister to Haiti. He died in 1895, still fighting.`,
    workIds: [],
  },
  emma_goldman: {
    id: 'emma_goldman',
    name: `Emma Goldman`,
    topicId: 'history_immigration',
    nationality: `Russian-American`,
    years: `1869–1940`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Emma_Goldman_seated.jpg/440px-Emma_Goldman_seated.jpg',
    tagline: `Anarchist, labor organizer, feminist — the most radical public intellectual in American history.`,
    primer: `Emma Goldman was born in Kaunas in the Russian Empire, emigrated to New York through Ellis Island at sixteen in 1885, and went to work in a Rochester clothing factory. She discovered anarchist politics after the Haymarket affair of 1886, moved to New York, and began a forty-year career as a lecturer, agitator, and organizer. She was arrested forty times. She founded the anarchist journal Mother Earth in 1906 and organized for birth control, free love, opposition to conscription, and the rights of workers before these were causes with political constituencies. She was deported to Russia in 1919 with 248 other "alien radicals." Her autobiography, Living My Life (1931), is one of the great radical memoirs in any language.`,
    workIds: [],
  },
  jacob_riis: {
    id: 'jacob_riis',
    name: `Jacob Riis`,
    topicId: 'history_immigration',
    nationality: `Danish-American`,
    years: `1849–1914`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Jacob_Riis_2.jpg/440px-Jacob_Riis_2.jpg',
    tagline: `The photographer who showed New York what its tenements looked like from the inside.`,
    primer: `Jacob Riis emigrated from Denmark to New York in 1870, spent years in poverty, and became a police reporter for the New-York Tribune. He covered the Lower East Side for years before acquiring a camera and teaching himself to use magnesium flash powder to illuminate interiors. How the Other Half Lives (1890) documented tenement conditions — twelve people in a single room, no ventilation, no plumbing, children working in sweatshops — with photographs that made it impossible for middle-class readers to pretend they didn't know. Theodore Roosevelt, then Police Commissioner of New York, read the book, contacted Riis, and began a collaboration on housing reform that continued for two decades. Riis's photographs created American photojournalism and the practice of using images as instruments of policy change.`,
    workIds: ['how_the_other_half_lives_1890'],
  },
  shirley_chisholm: {
    id: 'shirley_chisholm',
    name: `Shirley Chisholm`,
    topicId: 'history_civil_rights',
    nationality: `American`,
    years: `1924–2005`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Shirley_Chisholm.jpg/440px-Shirley_Chisholm.jpg',
    tagline: `First Black woman elected to Congress. First Black candidate for a major party presidential nomination.`,
    primer: `Shirley Chisholm was born in Brooklyn to immigrants from Barbados and British Guiana, educated in the New York public schools and at Brooklyn College, and elected to the U.S. House of Representatives in 1968 — the first Black woman in Congress. Her slogan was "Unbought and Unbossed," and it was not a slogan: she voted against military appropriations when her Brooklyn district needed schools; she refused to be assigned to the House Agriculture Committee when her constituents had no farms. In 1972 she ran for the Democratic presidential nomination, winning 152 delegate votes at the convention. She served seven terms in Congress and co-founded the Congressional Black Caucus. She was awarded the Presidential Medal of Freedom posthumously in 2015.`,
    workIds: ['chisholm_1972_campaign'],
  },
  marsha_p_johnson: {
    id: 'marsha_p_johnson',
    name: `Marsha P. Johnson`,
    topicId: 'history_civil_rights',
    nationality: `American`,
    years: `1945–1992`,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Marsha_P._Johnson.jpg/440px-Marsha_P._Johnson.jpg',
    tagline: `Transgender activist, Stonewall figure, co-founder of STAR — a pioneer of LGBTQ+ rights who lived her whole life in New York.`,
    primer: `Marsha P. Johnson was born in Elizabeth, New Jersey, moved to New York City at 17, and spent her adult life in Greenwich Village. The P. stood for "Pay it no mind" — her standard response when asked about her gender. She was one of the most prominent figures of the Stonewall uprising on June 28, 1969, and with Sylvia Rivera co-founded STAR (Street Transvestite Action Revolutionaries) in 1970 — one of the first organizations to provide shelter and support for homeless queer youth. Johnson spent years as a street performer, sex worker, and activist, befriending Andy Warhol, modeling for his Factory, marching in every Gay Pride parade. She was found dead in the Hudson River in July 1992. Police ruled it a suicide; activists believe she was murdered.`,
    workIds: ['stonewall_uprising_1969'],
  },


  // ── Hip-Hop ──────────────────────────────────────────────────────────────
  dj_kool_herc: {
    id: 'dj_kool_herc',
    topicId: 'bronx_origins',
    name: 'DJ Kool Herc',
    years: '1955–',
    nationality: 'Jamaican-American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Kool_Herc.jpg',
    tagline: `The man who invented hip-hop in a Bronx recreation room.`,
    primer: `Clive Campbell — DJ Kool Herc — was born in Kingston, Jamaica and moved to the Bronx at age 12, settling at 1520 Sedgwick Avenue. On August 11, 1973, his sister Cindy organized a back-to-school party in the building\'s recreation room. He brought two turntables and played two copies of the same record, extending the percussion break on both indefinitely — switching between them to create an unbroken loop of rhythm. He called it the merry-go-round technique. The dancers who gathered on the floor for those extended breaks became the first b-boys. The MCs who talked over the beat became the first rappers. The technique became the foundation of an art form. DJ Kool Herc is hip-hop's founding inventor.`,
    workIds: [],
    venueId: 'one_five_two_zero',
  },
  grandmaster_flash: {
    id: 'grandmaster_flash',
    topicId: 'bronx_origins',
    name: 'Grandmaster Flash',
    years: '1958–',
    nationality: 'Barbadian-American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Grandmaster_Flash_-_James_Lavelle%27s_Meltdown_Festival_2014_%28cropped%29.jpg',
    tagline: `The technical perfectionist who turned DJing into an art form.`,
    primer: `Joseph Saddler grew up in the South Bronx and spent years developing the technical innovations that transformed DJing from record-playing into performance: the Quick Mix Theory, punch phrasing, back-spinning, and scratching. Where Kool Herc had invented the loop, Flash perfected it — mixing with surgical precision at the exact moment the break returned. With the Furious Five, he released "The Message" in 1982, the first hip-hop song taken seriously as social commentary. His induction into the Rock and Roll Hall of Fame in 2007 confirmed what the South Bronx already knew.`,
    workIds: ['the_message_hh'],
    venueId: 'one_five_two_zero',
  },
  afrika_bambaataa: {
    id: 'afrika_bambaataa',
    topicId: 'bronx_origins',
    name: 'Afrika Bambaataa',
    years: '1957–',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Africa_bambaataa-08.jpg',
    tagline: `The organizer who turned gang culture into culture itself.`,
    primer: `Kevin Donovan grew up in the Bronx River Houses and was a leader of the Black Spades — one of the Bronx's most powerful gangs — before a transformative experience in 1973 led him to found the Universal Zulu Nation. The Zulu Nation redirected gang energy into music, dance, art, and knowledge, and Bambaataa defined the four elements of hip-hop culture: DJing, MCing, Breaking (b-boying), and Graffiti. His 1982 track "Planet Rock," built on Kraftwerk synthesizers, introduced electronic music to hip-hop and influenced every producer who followed.`,
    workIds: [],
    venueId: 'universal_hip_hop_museum',
  },
  melle_mel: {
    id: 'melle_mel',
    topicId: 'bronx_origins',
    name: 'Melle Mel',
    years: '1961–',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Melle_Mel.jpg',
    tagline: `The first rapper to be called a poet.`,
    primer: `Melvin Glover — Melle Mel — of Grandmaster Flash and the Furious Five was the first MC to bring literary ambition to rap. His verses on "The Message" documented the desperation of South Bronx street life with a specificity and moral weight that critics compared to documentary journalism. He was the first rapper to use the word "rapper" to describe himself, and the first to demonstrate that hip-hop lyrics could carry the same freight as the best American writing. His influence on every socially conscious rapper from Rakim to Kendrick Lamar runs in a direct line.`,
    workIds: ['the_message_hh'],
    venueId: 'one_five_two_zero',
  },
  run_dmc: {
    id: 'run_dmc',
    topicId: 'golden_age_hiphop',
    name: 'Run-DMC',
    years: '1983–2002',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Run-DMC_in_1986.jpg',
    tagline: `Hollis, Queens. Adidas. The group that took rap to the world.`,
    primer: `Joseph Simmons (Run), Darryl McDaniels (DMC), and Jason Mizell (Jam Master Jay) grew up within blocks of each other in Hollis, Queens. They stripped hip-hop down to hard drum machines, spare guitar riffs, and two voices trading bars — no costumes, no pretense, no compromise. Their collaboration with Aerosmith on "Walk This Way" in 1986 was the moment rap crossed permanently into mainstream rock culture, and they did it without changing a single thing about themselves. Raising Hell was the first hip-hop album to go platinum. Jam Master Jay was shot and killed in a Queens recording studio in 2002.`,
    workIds: ['raising_hell'],
    venueId: 'hollis_queens',
  },
  ll_cool_j: {
    id: 'll_cool_j',
    topicId: 'golden_age_hiphop',
    name: 'LL Cool J',
    years: '1968–',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/LLCoolJ-byPhilipRomano.jpg/3840px-LLCoolJ-byPhilipRomano.jpg',
    tagline: `Def Jam's first solo star. Queens. Sixteen years old.`,
    primer: `James Todd Smith grew up in St. Albans, Queens, and became Def Jam's first solo signing at 16. He proved that hip-hop could be commercially dominant without compromising its identity — moving between aggression ("Rock the Bells"), romance ("I Need Love"), and comeback declaration ("Mama Said Knock You Out") across a career that spans four decades. He was the genre's first teen idol and one of its most durable artists, adapting to every era while remaining unmistakably himself. The acronym stands for Ladies Love Cool James.`,
    workIds: [],
    venueId: 'hollis_queens',
  },
  rakim: {
    id: 'rakim',
    topicId: 'golden_age_hiphop',
    name: 'Rakim',
    years: '1968–',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Rakim_at_Paid_Dues_4_%28cropped%29.jpg',
    tagline: `The greatest MC. Not a debate — a consensus.`,
    primer: `William Michael Griffin Jr. — Rakim — is from Wyandanch, Long Island, and is widely considered the greatest MC of all time. He brought a jazz musician's approach to rhyming: internal rhyme schemes of astonishing complexity, multisyllabic structures that created music within the language itself, and a cool authority that never cracked. Where previous MCs had rhymed end words, Rakim rhymed within lines, stacking syllable against syllable in ways that rewired what listeners expected from the form. "I ain't no joke." "I used to roll up / this is a hold up / ain't nothing funny." He released Paid in Full with Eric B. in 1987, at 19 years old, and set a standard that no one has fully surpassed.`,
    workIds: ['paid_in_full'],
    venueId: 'apollo_theater_hh',
  },
  notorious_big: {
    id: 'notorious_big',
    topicId: 'brooklyn_voice',
    name: 'The Notorious B.I.G.',
    years: '1972–1997',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Biggie_Smalls_1997.jpg',
    tagline: `Clinton Hill, Brooklyn. The most gifted storyteller in hip-hop history.`,
    primer: `Christopher Wallace — The Notorious B.I.G. — grew up at 226 St. James Place in Clinton Hill, Brooklyn. He dropped out of high school and sold drugs before Sean "Puffy" Combs signed him to Bad Boy Records. Ready to Die, released in 1994, made him the defining voice of 90s New York: his storytelling was cinematic, his punchlines precisely constructed, his command of the form total. He built entire worlds in four bars. He was shot and killed in Los Angeles on March 9, 1997, at 24 years old. He was the most naturally gifted MC who ever lived, and he only made two studio albums.`,
    workIds: ['ready_to_die'],
    venueId: 'biggie_mural',
  },
  jay_z: {
    id: 'jay_z',
    topicId: 'brooklyn_voice',
    name: 'Jay-Z',
    years: '1969–',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Jay-Z_meets_with_New_York_Senate_Majority_Leader_in_Albany_%28cropped%29.webp',
    tagline: `Marcy Houses. Roc-A-Fella. The most successful executive in hip-hop history.`,
    primer: `Shawn Carter — Jay-Z — grew up in the Marcy Houses in Bedford-Stuyvesant. Unable to secure a record deal, he co-founded Roc-A-Fella Records with Damon Dash and Kareem Burke and released Reasonable Doubt himself in 1996. The album sold modestly but established his reputation among those who heard it. What followed was one of the most remarkable careers in popular music: 14 studio albums, multiple Grammy Awards, the founding of Roc Nation, ownership stakes in companies across entertainment, sports, and alcohol. He is the first rapper to become a billionaire. The Marcy Houses he grew up in appear in his lyrics across forty years of work.`,
    workIds: ['reasonable_doubt'],
    venueId: 'marcy_houses',
  },
  nas: {
    id: 'nas',
    topicId: 'queensbridge',
    name: 'Nas',
    years: '1973–',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Nas_%2852380600682%29_%28cropped%29.jpg',
    tagline: `Queensbridge Houses. Illmatic. The album no one has surpassed.`,
    primer: `Nasir Jones — Nas — grew up in the Queensbridge Houses in Long Island City, Queens. He dropped out of school at 17, began recording, and in 1994, at 20 years old, released Illmatic. Ten tracks, thirty-nine minutes, produced by the finest beatmakers in New York — DJ Premier, Pete Rock, Q-Tip, Large Professor, L.E.S. — and over each one, Nas\'s voice with a composure and precision that seemed impossible for his age. He mapped the specific geography of Queensbridge — the handball courts, the stairwells, the bridge, the water — and made it universal. Critics still argue about whether anything in hip-hop has equaled it.`,
    workIds: ['illmatic'],
    venueId: 'queensbridge_houses',
  },
  wu_tang_clan: {
    id: 'wu_tang_clan',
    topicId: 'wu_tang',
    name: 'Wu-Tang Clan',
    years: '1992–',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Wu-Tang_Clan_at_Exit_festival_2023.jpg',
    tagline: `Nine MCs from Park Hill, Staten Island. Wu-Tang is forever.`,
    primer: `RZA, GZA, Ol' Dirty Bastard, Inspectah Deck, Raekwon, Ghostface Killah, Method Man, U-God, and Masta Killa all grew up within blocks of each other in Park Hill, the Staten Island housing complex they renamed "Shaolin" — after the legendary kung-fu monastery. The RZA unified them under his production and a shared mythology drawn from kung-fu films, Five Percent Nation philosophy, and chess. Enter the Wu-Tang (36 Chambers) was recorded in basements in 1993 for almost no budget. Its stripped-down drums, soul samples, and martial-arts dialogue created an aesthetic unlike anything before or since. Wu-Tang Clan ain't nothing to mess with.`,
    workIds: ['enter_wu_tang'],
    venueId: 'park_hill_staten_island',
  },
  a_tribe_called_quest: {
    id: 'a_tribe_called_quest',
    topicId: 'golden_age_hiphop',
    name: 'A Tribe Called Quest',
    years: '1985–2016',
    nationality: 'American',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/A_Tribe_Called_Quest_montage.png',
    tagline: `Queens. Jazz samples. The alternative that became the standard.`,
    primer: `Q-Tip (Jonathan Davis), Phife Dawg (Malik Taylor), Ali Shaheed Muhammad, and Jarobi White formed in St. Albans, Queens, as part of the Native Tongues collective alongside De La Soul and the Jungle Brothers. They sought a positive, jazz-inflected alternative to the hardening of rap in the late '80s, and on The Low End Theory (1991), they achieved it — building tracks around double-bass lines and bebop samples, laying Q-Tip\'s conversational flow over the top. Light where everything else was dark. Every alternative rap record made since exists in their shadow. Phife Dawg died in March 2016. They released their final album, We Got It from Here... Thank You 4 Your Service, eight months later.`,
    workIds: ['low_end_theory'],
    venueId: 'rucker_park',
  },

};

export const topics = {
  // ── VISUAL ART TOPICS ─────────────────────────────────────────
  post_impressionism: {
    id: 'post_impressionism',
    domainId: 'visual_art',
    name: `Post-Impressionism`,
    nationality: `American`,
    years: `c. 1886–1910`,
    tagline: `What happened after Impressionism broke all the rules.`,
    primer: `Impressionism changed painting by making the brushstroke visible and the moment primary. Then five painters asked: what's next?

Post-Impressionism isn't a movement with a manifesto — it\'s a loose name for what Van Gogh, Cézanne, Gauguin, Seurat, and Toulouse-Lautrec did individually in the decades after Impressionism. Each took Impressionism\'s freedom and pushed it somewhere different: Van Gogh toward emotional intensity, Cézanne toward structure and geometry, Gauguin toward color as expression, Seurat toward optical science, Lautrec toward character and graphic art.

Together they gave the 20th century its vocabulary. Cubism, Fauvism, Expressionism, Surrealism — all of it begins here. Understanding Post-Impressionism is understanding the grammar of modern art.`,
    figureIds: ['van_gogh', 'cezanne', 'gauguin', 'seurat', 'toulouse_lautrec'],
    venueIds: ['moma', 'met', 'guggenheim', 'brooklyn', 'cooper_hewitt'],
  },
  impressionism: {
    id: 'impressionism',
    domainId: 'visual_art',
    name: `Impressionism`,
    years: `c. 1860–1886`,
    tagline: `The moment painting decided to chase light instead of truth.`,
    description: `In the 1860s, a group of young painters in Paris began breaking rules that had governed Western art for 400 years. They painted outside, quickly, in natural light. They let brushstrokes show. They chose everyday subjects — a Sunday afternoon, a riverside lunch, a woman drinking tea — over historical grandeur. The French academy rejected their work. They showed it themselves, in 1874, and a critic mocked them by calling them impressionists. The name stuck.

What they discovered is that the eye doesn't photograph reality. It catches impressions — fragments, flickers, the quality of light at a particular moment. Painting could capture that. Painting could be the record of perception itself, not just its subject.

Monet, Degas, Renoir, Cassatt, Pissarro: five artists, five completely different visions of what this could mean. In New York, the Met and MoMA together hold one of the finest concentrations of Impressionist work outside of Paris.`,
    figureIds: ['monet', 'degas', 'renoir', 'cassatt', 'pissarro'],
    venueIds: ['moma', 'met', 'guggenheim', 'brooklyn', 'cooper_hewitt'],
  },
  abstract_expressionism: {
    id: 'abstract_expressionism',
    domainId: 'visual_art',
    name: `Abstract Expressionism`,
    years: `c. 1943–1965`,
    tagline: `When New York took the center of the art world — and kept it.`,
    description: `World War II did something no manifesto could: it moved the center of Western art from Paris to New York. European artists — Mondrian, Ernst, Léger, Dalí — fled to America. The influence they brought collided with a generation of American painters who were hungry, ambitious, and uninterested in European refinement.

What emerged was Abstract Expressionism — the first American art movement to reshape global art history. Pollock, Rothko, de Kooning, Kline, Newman: five painters united by a shared conviction that painting could carry the full weight of human experience without depicting anything recognizable.

New York was their laboratory. MoMA and the Met now hold the definitive collection of their work. Walking between them, you're walking through the moment American painting became the world\'s painting.`,
    figureIds: ['pollock', 'rothko', 'de_kooning', 'kline', 'newman'],
    venueIds: ['met', 'moma'],
  },
  cubism: {
    id: 'cubism',
    domainId: 'visual_art',
    name: `Cubism`,
    years: `c. 1907–1925`,
    tagline: `The movement that broke pictorial space — and rebuilt modern art.`,
    description: `In 1907, Pablo Picasso finished a painting he'd been keeping secret in his studio and showed it to his closest friends. Georges Braque reportedly said it made him feel like someone was drinking gasoline and breathing fire. The painting was Les Demoiselles d'Avignon. Cubism had begun.

The core insight: we don't see the world from one fixed point. We move our eyes, shift our head, accumulate multiple views into a single understanding. Why should painting pretend otherwise? Picasso and Braque spent the next seven years dismantling and reconstructing pictorial space — showing objects from multiple angles simultaneously, flattening depth, breaking the 500-year Renaissance consensus.

The results reshaped everything: architecture, design, photography, film. MoMA, the Guggenheim, and the Met together hold one of the world's great concentrations of Cubist work, including the most important Picasso painting in America.`,
    figureIds: ['picasso', 'braque', 'gris', 'leger', 'duchamp'],
    venueIds: ['guggenheim', 'met', 'moma'],
  },
  american_modernism: {
    id: 'american_modernism',
    domainId: 'visual_art',
    name: `American Modernism`,
    years: `c. 1913–1950`,
    tagline: `What American painters did when Europe showed them what art could be.`,
    description: `The 1913 Armory Show introduced America to Cubism, Fauvism, and the European avant-garde. It caused a scandal, changed everything, and sent American painters in several different directions simultaneously.

Some, like Hopper, absorbed European modernism and used it to paint specifically American loneliness. Some, like Sheeler, found a machine-age aesthetic in American industry. Some, like Hartley, went to Europe and came back with German Expressionism in their bones. Some, like Lawrence, told American stories that had never been painted before.

American Modernism is not a unified style — it's a generation of painters learning a new visual language and applying it to their own experience. The Whitney, MoMA, and the Met together hold the definitive collection.`,
    figureIds: ['hopper', 'lawrence', 'hartley', 'sheeler'],
    venueIds: ['brooklyn', 'met', 'moma', 'whitney'],
  },

  // ── JAZZ ERA TOPICS (kept for getSeeAlsoNearby / figure.topicId) ──────
  bebop: {
    id: 'bebop',
    domainId: 'jazz',
    name: `Bebop`,
    years: `c. 1940–1955`,
    tagline: `The revolution that made jazz too smart to dance to.`,
    description: `In the early 1940s, a group of young musicians began meeting after hours at Minton's Playhouse in Harlem to play music that the paying customers couldn't dance to. Charlie Parker, Dizzy Gillespie, Thelonious Monk, Kenny Clarke: they were inventing something. Faster tempos, more complex harmonies, chord substitutions that moved the music away from the diatonic scales of swing. They called it rebop, then bebop. The name didn't matter. The revolution did.

Bebop was jazz's declaration of independence — a music that demanded to be listened to rather than danced to, that placed improvisation at a level of sophistication the music had never reached before. The establishments didn\'t know what to do with it. Audiences split. The critics argued for decades.

In New York, on 52nd Street (then called "Swing Street"), in clubs like the Three Deuces and the Onyx, then at Birdland (named for Parker), bebop became the new center of the jazz world. The musicians who played it were young, fast, and completely serious. The music they made in those rooms is the foundation of everything that followed.`,
    figureIds: ['parker', 'gillespie', 'monk', 'bud_powell', 'max_roach'],
  },
  hard_bop: {
    id: 'hard_bop',
    domainId: 'jazz',
    name: `Hard Bop`,
    years: `c. 1954–1967`,
    tagline: `Bebop came back to the body — and brought the blues.`,
    description: `Hard bop was bebop's answer to its own intellectualism. By the early 1950s, cool jazz — West Coast, lighter, more European-influenced — had emerged as a reaction to bebop's intensity. Hard bop was the reaction to the reaction: a music that kept bebop's harmonic sophistication and added back what bebop had left behind — the blues, the gospel church, the physical groove.

Art Blakey and the Jazz Messengers, Horace Silver, Clifford Brown, Miles Davis: these musicians played with bebop's complexity and with the emotional directness of the music that had preceded it. Hard bop was Black American music that knew its history and refused to apologize for it.

The center was New York. Blue Note Records became its institutional home — Alfred Lion recorded nearly every major hard bop session in the basement of Manhattan studios, building a catalog that remains the most essential body of recordings in jazz. The Blue Note club, which opened decades later, carries the name forward. Walk in any night and you'll hear what hard bop became.`,
    figureIds: ['miles_davis', 'art_blakey', 'horace_silver', 'clifford_brown', 'sonny_rollins'],
  },
  modal_jazz: {
    id: 'modal_jazz',
    domainId: 'jazz',
    name: `Modal Jazz`,
    years: `c. 1958–1967`,
    tagline: `What happens when you stop changing chords and start changing space.`,
    description: `In 1958, Miles Davis started thinking about what would happen if you replaced rapid chord changes with modes — scales that could sustain extended improvisation without the harmonic pressure of bebop's constant movement. Kind of Blue (1959) was the result. It sold more copies than any jazz album ever made and opened a door that jazz had been walking through ever since.

Modal jazz asked musicians to do something harder than navigating chord changes fast: to build something compelling and coherent in a large, open harmonic space, with no prescribed route from beginning to end. The improviser had to supply the structure as well as the melody. Coltrane heard the invitation and accepted it completely. Bill Evans understood it as a harmonic philosophy. Wayne Shorter built a compositional language from it.

The Village Vanguard is where modal jazz happened most consequentially. Miles played there. Coltrane recorded his first great live album there. Bill Evans recorded Sunday at the Village Vanguard there. The room heard this music develop in real time, night after night, and kept no notes — just the recordings, and the walls.`,
    figureIds: ['coltrane', 'bill_evans', 'wayne_shorter', 'mccoy_tyner', 'herbie_hancock'],
  },
  free_jazz: {
    id: 'free_jazz',
    domainId: 'jazz',
    name: `Free Jazz`,
    years: `c. 1959–1975`,
    tagline: `The music that broke every remaining rule — and meant it.`,
    description: `Free jazz didn't just break rules — it demolished the entire framework that jazz had built over 60 years: fixed chord changes, defined meter, Western tonal harmony, the leader-accompanist relationship. Ornette Coleman arrived in New York in 1959 and the music changed. Not for everyone, and not immediately. But permanently.

The impulse was political as much as musical. The Civil Rights movement was reshaping American consciousness; the music of Black America was claiming its full complexity and refusing to be simplified for any audience. Charles Mingus wrote jazz that argued. Cecil Taylor played piano like it was both a weapon and a prayer. Albert Ayler returned to something before all the accumulated sophistication, looking for the root.

In New York, the free jazz revolution happened in small rooms — the Five Spot Café (closed now), Smalls, the loft spaces of lower Manhattan. It was contested, argument-provoking, sometimes alienating, always serious. The music it produced is not easy. It is, in certain forms, the most demanding music in the jazz tradition. It is also, in certain moments, the most direct: the shortest distance between a musician's interior state and the listener\'s ear.`,
    figureIds: ['ornette_coleman', 'charles_mingus', 'cecil_taylor', 'albert_ayler', 'eric_dolphy'],
  },
  post_bop: {
    id: 'post_bop',
    domainId: 'jazz',
    name: `Post-Bop`,
    years: `c. 1970–present`,
    tagline: `After the revolution: synthesis, mastery, and jazz that refuses to stop evolving.`,
    description: `Post-bop is not a style — it's a condition. After bebop, hard bop, modal jazz, and free jazz had successively expanded and then exploded the language, a generation of musicians faced the question: what now? The answer, for the most interesting of them, was synthesis: take everything that had happened, integrate it, and use it to say something new.

Keith Jarrett made improvised piano music that encompassed Bach and Appalachian folk and post-bop jazz simultaneously. Wynton Marsalis built an institution around the conviction that the tradition deserved the same care as classical music — and then proved it by playing at the highest level of that tradition himself. Pat Metheny expanded jazz guitar to include everything he'd ever heard. Brad Mehldau brought counterpoint and contemporary pop into the same frame. Roy Hargrove kept the flame of hard bop burning while building bridges to Cuban music and hip-hop.

The Village Vanguard remains the center — the room where all of this gets tested in front of an audience that knows what it's hearing. Go there on any given night and you\'ll find post-bop: music that knows its history and is still trying to figure out where it goes next.`,
    figureIds: ['keith_jarrett', 'wynton_marsalis', 'pat_metheny', 'brad_mehldau', 'roy_hargrove'],
  },

  // ── NEW JAZZ INTEREST TOPICS ─────────────────────────────────────────
  jazz_the_clubs: {
    id: 'jazz_the_clubs',
    domainId: 'jazz',
    name: `The Classic Clubs`,
    tagline: `The rooms where jazz history still happens every night.`,
    description: `The great New York jazz clubs are not museums — they are working rooms. The Village Vanguard has been presenting jazz in its wedge-shaped basement on Seventh Avenue since 1935. Blue Note opened in Greenwich Village in 1981. Birdland moved to Midtown in 1996. Smalls opened in the Village in 1994 and quickly became a late-night institution.

Each room has its own character. The Vanguard is the cathedral — low ceiling, terrible sight lines from some seats, acoustics that make a tenor saxophone sound like it's filling your entire body. Blue Note is more polished, more tourist-friendly, but it books serious artists and the music is real. Birdland has the best food and the most comfortable seats; it also hosts the Jazz at Lincoln Center Orchestra on Monday nights. Smalls is the late-night room, intimate and unpredictable, where the cover charge is low and the music goes until 4am.

The experience of hearing jazz live in these rooms is categorically different from hearing it on a recording. The musicians can feel the room. You can feel the musicians. Something happens in that exchange that no recording has ever fully captured.`,
    venueIds: ['village_vanguard', 'blue_note', 'birdland', 'smalls'],
    figureIds: [],
  },
  jazz_concert_scale: {
    id: 'jazz_concert_scale',
    domainId: 'jazz',
    name: `Jazz at Concert Scale`,
    tagline: `Jazz in a room that holds thousands — and still swings.`,
    description: `Jazz at Lincoln Center was founded by Wynton Marsalis in 1987 and moved to its permanent home at Frederick P. Rose Hall, above Columbus Circle, in 2004. It is the only performing arts center in the world built specifically for jazz — three venues in a single facility, with the largest, the Rose Theater, seating 1,100 people.

The centerpiece of the Jazz at Lincoln Center season is the Jazz at Lincoln Center Orchestra — a 15-piece ensemble that Marsalis has led since its founding. The orchestra performs the entire history of jazz: original compositions, arrangements of classic works, and collaborations with visiting artists. It is the premier ensemble of its kind in the world.

The difference between hearing jazz in a club and hearing it in a concert hall is real. The concert hall offers better sight lines, better acoustics in some respects, a more structured experience. You hear more of the ensemble at once; the arrangements come through more clearly. What you give up is the room's intimacy — the sense that the musicians and the audience are sharing the same contained space, that the performance could go anywhere.`,
    venueIds: ['jazz_lincoln_center'],
    figureIds: [],
  },
  jazz_how_to_listen: {
    id: 'jazz_how_to_listen',
    domainId: 'jazz',
    name: `How to Hear Jazz`,
    tagline: `What to listen for in the room.`,
    description: `Jazz improvisation is a conversation in real time. The musician is composing and performing simultaneously — inventing melodic and harmonic ideas on the spot, responding to what the other musicians are doing, responding to the room, responding to what was just played.

Knowing what to listen for makes the experience dramatically richer. Start with the rhythm section: bass and drums are setting the pulse and the harmonic framework. The pianist or guitarist is comping — playing chords that reinforce the soloist's ideas without crowding them. The soloist is building — usually starting with simpler ideas and developing them, rising in complexity and intensity, then coming back down.

Listen for the conversation between soloist and drummer. Jazz drummers don't just keep time; they respond to what the soloist plays, adding accents and counterpoints that push or pull the music. Listen for the moment when something unexpected happens — when the soloist lands on an unexpected note and the rhythm section adjusts instantly. That adjustment is the music. That\'s jazz: a group of musicians making decisions together in real time, with the outcome unknown until it happens.`,
    venueIds: ['village_vanguard', 'blue_note', 'birdland', 'smalls', 'jazz_lincoln_center'],
    figureIds: [],
  },

  // ── CLASSICAL ERA TOPICS (kept for getSeeAlsoNearby / figure.topicId) ──
  baroque: {
    id: 'baroque',
    domainId: 'classical_music',
    name: `Baroque`,
    years: `c. 1600–1750`,
    tagline: `When music learned to argue — and built the grammar we still use.`,
    description: `The Baroque era ran roughly from Monteverdi's L'Orfeo (1607) to the death of J.S. Bach (1750), and in that century and a half it invented opera, the modern orchestra, the concerto, the oratorio, and systematic tonal harmony. Nearly every formal and harmonic convention that subsequent composers inherited — and rebelled against — was established in this period.

The Baroque aesthetic favored ornamentation, contrast, and what theorists called 'the doctrine of the affections': the idea that music should systematically represent specific emotions, one per movement or section. Composers used ascending lines for joy, descending lines for sorrow, dissonance for pain, consonance for peace. The rules were elaborate; the results, in the hands of Bach or Handel or Vivaldi, were transcendent.

In New York, Baroque music lives primarily at Alice Tully Hall, home of the Chamber Music Society of Lincoln Center, and at Miller Theatre, Columbia's adventurous presenter. Both regularly program Baroque orchestras using period instruments — gut strings, Baroque bows, harpsichord continuo — which produce a sound dramatically different from modern orchestral performances.`,
    figureIds: ['bach', 'handel', 'vivaldi', 'purcell', 'monteverdi'],
  },
  classical_period: {
    id: 'classical_period',
    domainId: 'classical_music',
    name: `Classical Period`,
    years: `c. 1750–1820`,
    tagline: `The age that invented the symphony, the string quartet, and the idea of absolute music.`,
    description: `The Classical Period takes its name from the classical values it embodied: clarity, proportion, formal balance, and the subordination of ornament to structure. Where Baroque music was elaborate and contrapuntally dense, Classical music sought transparency and formal elegance. The change was conscious and deliberate, driven in part by Enlightenment philosophy: music should speak directly to reason as well as feeling.

In practice, this meant the development of the symphony — a large-scale work for orchestra in three or four movements — and the string quartet, a smaller form for two violins, viola, and cello. Haydn established both forms, Mozart brought them to perfection, and Beethoven arrived to transform them into something the Classical Period itself could not contain.

The New York Philharmonic, resident at David Geffen Hall since 1962, is the oldest symphony orchestra in the United States (founded 1842) and has been performing Classical-period symphonies since before the concert hall was built. Hearing a Haydn or Mozart symphony in this hall is hearing music performed in an institution that predates Carnegie Hall itself.`,
    figureIds: ['mozart', 'beethoven', 'haydn', 'schubert', 'gluck'],
  },
  romantic: {
    id: 'romantic',
    domainId: 'classical_music',
    name: `Romantic`,
    years: `c. 1820–1900`,
    tagline: `The century that gave music its biggest emotions — and its biggest orchestras.`,
    description: `The Romantic era took the formal architecture of the Classical Period and filled it with individual feeling, literary aspiration, and national identity. Where Classical composers sought universal clarity, Romantic composers sought personal expression. The symphony became a vehicle for autobiography; opera became a vehicle for politics and myth; the piano piece became an intimate confession.

The Romantic era also changed the physical reality of music: orchestras grew much larger (Beethoven added trombones, Berlioz called for 500 performers), concert halls were built to accommodate them, the modern piano achieved its current form, and professional concert life became an institution throughout Europe and America. Carnegie Hall (opened 1891) is a product of this era — built for audiences who had learned to expect Brahms and Tchaikovsky as regular entertainment.

In New York, Romantic music is heard everywhere: Carnegie Hall programs major orchestras and soloists performing the standard Romantic repertoire most seasons, and the Metropolitan Opera stages the Wagner and Verdi and Puccini that the Romantic era made possible. The standard symphonic canon — the works most orchestras perform most often — is primarily Romantic.`,
    figureIds: ['brahms', 'tchaikovsky', 'chopin', 'wagner', 'mahler'],
  },
  twentieth_century: {
    id: 'twentieth_century',
    domainId: 'classical_music',
    name: `20th Century`,
    years: `c. 1900–1975`,
    tagline: `The era that broke every rule — and discovered there were more rules underneath.`,
    description: `The 20th century was the period in which Western classical music systematically dismantled its own foundations and tried to rebuild them. Debussy dissolved tonal harmony into impressionistic clouds. Schoenberg abandoned tonality altogether. Stravinsky shattered rhythmic convention. Bartók synthesized European folk music with modernist language. The results were extraordinary and, often, genuinely difficult for audiences to absorb.

Two world wars gave 20th-century composers subjects that demanded new musical languages: Shostakovich's Fifth Symphony (1937) is inseparable from Stalinist terror; Prokofiev\'s Fifth (1944) from the siege of Leningrad; Bartók\'s Concerto for Orchestra (1944) from exile. The century\'s music is full of this historical weight, whether encoded covertly or stated directly.

The New York Philharmonic gave many American premieres of 20th-century works — Shostakovich's Fifth reached the United States via the Philharmonic within a year of its Soviet premiere. David Geffen Hall programs 20th-century works regularly throughout its season.`,
    figureIds: ['stravinsky', 'debussy', 'prokofiev', 'shostakovich', 'bartok'],
  },
  contemporary_classical: {
    id: 'contemporary_classical',
    domainId: 'classical_music',
    name: `Contemporary`,
    years: `c. 1975–present`,
    tagline: `After the avant-garde: music that knows everything and chooses what to keep.`,
    description: `The contemporary era in classical music is not defined by a single aesthetic direction the way previous eras were. After the academic atonality of the postwar decades, composers in the 1970s and 1980s began moving in multiple directions simultaneously: minimalism (Glass, Reich), mystical simplicity (Pärt, Tavener), neo-Romantic accessibility (Gorecki, Rautavaara), political engagement (Adams), and radical experimentation that picked up where the 20th century left off.

What these composers share is awareness of everything that came before — and the freedom to choose. Caroline Shaw can write a Baroque passacaglia using extended vocal techniques. John Adams can put Nixon in an opera. Philip Glass can collaborate with David Bowie. Steve Reich can influence Radiohead. The contemporary era is the first in which composers have felt completely free to move between the entire tradition.

New York is the center of this activity. Miller Theatre at Columbia is its most adventurous institutional presenter, commissioning new works and programming living composers alongside Early Music. Alice Tully Hall, home of the Chamber Music Society, has expanded its contemporary programming in recent decades. The city produces, premieres, and argues over new classical music at a rate no other American city approaches.`,
    figureIds: ['glass', 'part', 'john_adams', 'reich', 'caroline_shaw'],
  },

  // ── NEW CLASSICAL INTEREST TOPICS ────────────────────────────────────
  classical_solo_piano: {
    id: 'classical_solo_piano',
    domainId: 'classical_music',
    name: `Solo Piano`,
    tagline: `One instrument, one performer, no safety net.`,
    description: `The solo piano recital is one of the most demanding forms in classical music — for the performer and for the listener. There is no orchestra to carry the texture, no partner to share the interpretive burden. The pianist walks onstage, sits down, and for 90 minutes makes all the decisions alone.

The canon for solo piano is enormous: Bach's Well-Tempered Clavier, the Beethoven sonatas (32 of them, each a world unto itself), Schubert\'s impromptus, Chopin\'s nocturnes and ballades and études, Schumann\'s character pieces, Brahms\'s late intermezzi, Debussy\'s préludes, Ravel\'s Gaspard de la nuit. Any pianist playing a full season of recitals could program this music entirely and not exhaust it in a decade.

In New York, the best solo recitals happen at Carnegie Hall's Stern Auditorium (2,804 seats, with the acoustics to support a single instrument filling the room), at the 92NY\'s Kaufman Concert Hall (916 seats, more intimate, used for younger artists and chamber programs), and at Bargemusic (124 seats, on a converted barge beneath the Brooklyn Bridge, where the proximity to a pianist\'s breathing and the movement of the water make the experience unrepeatable elsewhere).`,
    venueIds: ['carnegie_hall', 'ninety_second_st_y', 'alice_tully_hall', 'bargemusic'],
    figureIds: [],
  },
  classical_opera: {
    id: 'classical_opera',
    domainId: 'classical_music',
    name: `Opera`,
    tagline: `Music, drama, and spectacle combined into something that shouldn't work — but does.`,
    description: `Opera is an art form that demands suspension of disbelief in multiple directions simultaneously. You accept that people sing their emotions rather than speaking them. You accept that a 300-pound tenor is believably a young romantic lead. You accept that the orchestra pit is invisible, that scene changes happen in front of you, that the story you're watching has already been told a thousand times. And then, if the performance is good, all of that dissolves and you are simply inside something enormous and true.

The Metropolitan Opera is the largest opera company in the world and arguably the greatest. Its house on Broadway at 64th Street seats 3,800 people; the stage is one of the largest in the world. The Met's roster of singers at any given point represents the peak of the art form: the best soprano, the best dramatic tenor, the best conductor the company can engage. The production values are extraordinary. The acoustic is world-class.

Carnegie Hall is the other major New York venue for opera — primarily for concert performances (no staging, no sets, the singers in formal dress at microphones) and recitals by individual singers. A great singer in recital at Carnegie is a different experience from the Met: more intimate in one sense, more exposed in another.`,
    venueIds: ['met_opera_house', 'carnegie_hall'],
    figureIds: [],
  },
  classical_symphony: {
    id: 'classical_symphony',
    domainId: 'classical_music',
    name: `Symphony`,
    tagline: `A hundred musicians playing one thing.`,
    description: `The symphony orchestra is the largest and most complex ensemble in classical music — typically 60 to 100 musicians playing together under the direction of a conductor. A symphony is a large-scale work written for this ensemble, usually in three or four movements, lasting 30 to 90 minutes. The form was invented in the Classical Period, perfected in the Romantic era, and has continued to be a primary vehicle for serious musical thought ever since.

Hearing a great symphony orchestra live is different from hearing a recording in ways that are difficult to articulate but immediately felt. The sound fills three-dimensional space; you feel it in your body as well as hearing it with your ears. The dynamic range — from the quietest pianissimo to the full orchestra fortissimo — exceeds what any recording system has ever faithfully reproduced. And the visual dimension is real: watching a hundred musicians move together, watching a great conductor shape the music in real time, is part of the experience.

David Geffen Hall is home to the New York Philharmonic, the oldest symphony orchestra in the United States (founded 1842). Carnegie Hall hosts the greatest orchestras in the world on tour — the Berlin Philharmonic, the Vienna Philharmonic, the Royal Concertgebouw — as well as serving as the Philharmonic's second home.`,
    venueIds: ['david_geffen_hall', 'carnegie_hall'],
    figureIds: [],
  },
  classical_chamber: {
    id: 'classical_chamber',
    domainId: 'classical_music',
    name: `Chamber Music`,
    tagline: `Small ensembles, close quarters, and music that rewards attention.`,
    description: `Chamber music is written for small ensembles — typically two to eight players — and was historically performed in private homes rather than concert halls. The string quartet (two violins, viola, cello) is the central form; the piano trio, the piano quartet, the piano quintet, and various wind combinations surround it. The chamber music repertoire is vast and deep: Beethoven wrote 16 string quartets, each a masterwork; Brahms wrote three piano trios and two string sextets; Shostakovich wrote 15 string quartets as a private diary that his public symphonies could never be.

What distinguishes chamber music as a listening experience is the intimacy and the accountability. With only one player per part, there is nowhere to hide. You hear the individual choices each musician makes, the give-and-take between them, the places where they lean into or against each other. The relationship between performers in a quartet that has played together for years is one of the deepest musical relationships in existence.

In New York, the Chamber Music Society of Lincoln Center — resident at Alice Tully Hall — is the preeminent presenter. Miller Theatre programs adventurous chamber programs. Bargemusic, on its barge beneath the Brooklyn Bridge, offers chamber music at a scale that genuinely approximates the historical intimate setting. Merkin Hall at Kaufman Music Center focuses on chamber and new music.`,
    venueIds: ['alice_tully_hall', 'miller_theatre', 'bargemusic', 'merkin_hall'],
    figureIds: [],
  },
  classical_choral: {
    id: 'classical_choral',
    domainId: 'classical_music',
    name: `Choral Music`,
    tagline: `Many voices, one sound — music's oldest communal form.`,
    description: `Choral music is the oldest form of organized Western music, and in New York it lives in the most resonant acoustics in the city. Carnegie Hall's Stern Auditorium was built partly to accommodate large choral works — Beethoven's Ninth, the Brahms Requiem, the Verdi Requiem, Handel's Messiah — and the hall's acoustic is ideal for voices in combination.

The repertoire for large-scale choral works spans from the Baroque oratorio (Handel's Messiah, Bach\'s Mass in B Minor, Bach\'s St. Matthew Passion) through the Romantic requiem (Brahms, Verdi, Fauré) to 20th-century choral masterpieces (Britten\'s War Requiem, Orff\'s Carmina Burana, Shostakovich\'s Babi Yar symphony) and contemporary commissions.

What distinguishes great choral music in live performance is scale and unanimity: the sensation of hearing 80 or 200 voices find a single pitch and vibrate it together, the way massed voices in a great acoustic can fill a space in a way that no other ensemble can. The Verdi Requiem at Carnegie Hall is one of the purely physical experiences in classical music — the Tuba mirum movement, with brass on multiple levels and the full chorus and orchestra, is genuinely overwhelming.`,
    venueIds: ['carnegie_hall', 'alice_tully_hall'],
    figureIds: [],
  },

  // ── SPORTS TOPICS (kept for figure organization) ──────────────────────
  baseball: {
    id: 'baseball',
    domainId: 'sports',
    name: `New York Baseball`,
    years: `1903–present`,
    tagline: `Twenty-seven World Series rings in the Bronx. A miracle in Queens. The greatest rivalry in American sport.`,
    description: `New York is the only city in America that has simultaneously sustained two Major League Baseball franchises for over a century. The Yankees and the Mets have produced between them some of the most consequential moments in the sport's history.

The Yankees won their first World Series in 1923. They have won 27 championships total — more than any other franchise in American sports. The names — Ruth, Gehrig, DiMaggio, Mantle, Jeter — are the canonical names of 20th-century American sports.

The Mets were born in 1962 as an expansion franchise that lost 120 games in their first season. They became the Miracle Mets in 1969. Mike Piazza hit the home run on September 21, 2001, that gave a grieving city something to feel. Tom Seaver was the best pitcher of his generation.

Yankee Stadium sits in the South Bronx, opened in 2009 across the street from the original. Citi Field opened in Flushing in 2009. Both parks are accessible by subway — the 4 train to the Bronx, the 7 train to Queens.`,
    figureIds: ['babe_ruth', 'lou_gehrig', 'derek_jeter', 'tom_seaver', 'mike_piazza'],
    venueIds: ['yankee_stadium', 'citi_field'],
  },
  basketball: {
    id: 'basketball',
    domainId: 'sports',
    name: `New York Basketball`,
    years: `1946–present`,
    tagline: `Madison Square Garden is the Mecca of basketball. The Knicks are why.`,
    description: `"The Mecca of Basketball" is not a marketing slogan. It is the term that players, coaches, and basketball historians have used for Madison Square Garden since the 1960s, when the Knicks and the Garden became the center of gravity for a sport that was still finding its audience.

The Knicks won the NBA Championship in 1970 and 1973. Willis Reed limped onto the court for Game 7 in 1970 and the city stopped. Walt Frazier scored 36 points and 19 assists in the same game. Patrick Ewing carried the franchise for fifteen years. Allan Houston's bounce off the rim in 1999 sent the eighth-seeded Knicks to the NBA Finals.

Madison Square Garden has been renovated and rebuilt multiple times. The current building opened in 1968. It is most deeply the room where the Knicks play — and the room where American basketball established its identity.`,
    figureIds: ['willis_reed', 'walt_frazier', 'patrick_ewing', 'bernard_king', 'allan_houston'],
    venueIds: ['msg'],
  },
  hockey: {
    id: 'hockey',
    domainId: 'sports',
    name: `New York Hockey`,
    years: `1926–present`,
    tagline: `The Rangers have called Madison Square Garden home for a century. 1940 and 1994 bracket the most patient championship drought in hockey.`,
    description: `The New York Rangers were founded in 1926 and have played at Madison Square Garden ever since. They won the Stanley Cup in 1928, 1933, 1940, and — after a 54-year drought — in 1994.

The 1940-to-1994 drought was legendary. For 54 years, visiting fans chanted "1940!" to taunt Rangers supporters. The chanting stopped when Mark Messier guaranteed a win before Game 6 of the 1994 Eastern Conference Finals, delivered a hat trick, and then won the Cup in Game 7.

Henrik Lundqvist played 15 seasons after 1994 and was the best goaltender in the world for extended periods. He never won the Cup. Brian Leetch won the Conn Smythe in 1994 — the first American-born player to do so. Rod Gilbert played 18 seasons without a championship and remains the franchise's all-time scoring leader.`,
    figureIds: ['mark_messier', 'henrik_lundqvist', 'brian_leetch', 'rod_gilbert', 'mike_richter'],
    venueIds: ['msg'],
  },
  tennis: {
    id: 'tennis',
    domainId: 'sports',
    name: `US Open`,
    years: `1968–present`,
    tagline: `The hardcourt Grand Slam that turns Flushing Meadows into the center of the tennis world for two weeks every August.`,
    description: `The US Open is one of tennis's four Grand Slam tournaments, held annually in late August and early September at the USTA Billie Jean King National Tennis Center in Flushing Meadows Corona Park, Queens. It is the largest tennis tournament in the world by attendance.

The Open Era began in 1968, when professionals were first allowed to compete at Grand Slams. Arthur Ashe won that first US Open. Billie Jean King won six US Open titles and fought for equal prize money — which the Open became the first Grand Slam to offer in 1973. Steffi Graf completed the Golden Slam in 1988. Serena Williams won six US Opens and played her final professional match at Arthur Ashe Stadium in 2022.

The stadium seats 23,771 people, has a retractable roof, and is accessible by the 7 train to Mets-Willets Point.`,
    figureIds: ['arthur_ashe', 'billie_jean_king', 'serena_williams', 'jimmy_connors', 'steffi_graf'],
    venueIds: ['arthur_ashe_stadium'],
  },
  boxing: {
    id: 'boxing',
    domainId: 'sports',
    name: `Boxing at MSG`,
    years: `1925–present`,
    tagline: `Madison Square Garden has hosted more world championship fights than any arena in history.`,
    description: `Madison Square Garden has hosted more world championship boxing matches than any other arena in the world. Since the 1920s, the building has been the stage for some of the most consequential fights in the history of the sport.

The Fight of the Century between Muhammad Ali and Joe Frazier happened at the Garden on March 8, 1971. Sugar Ray Robinson — the greatest pound-for-pound boxer in history by near-universal consensus — fought dozens of times at the Garden. Jake LaMotta, the Bronx Bull, built his career there. Floyd Patterson, trained by Cus D'Amato in New York, won championship fights at MSG.

Boxing in New York has always been tied to the city's character. The fighters who trained in New York gyms represented neighborhoods and backgrounds that made each fight legible as something more than athletic competition. The tradition continues at both MSG and Barclays Center.`,
    figureIds: ['muhammad_ali', 'joe_frazier', 'sugar_ray_robinson', 'jake_lamotta', 'floyd_patterson'],
    venueIds: ['msg'],
  },
  // ── ARCHITECTURE TOPICS ────────────────────────────────────────────────────
  arch_art_deco: {
    id: 'arch_art_deco',
    domainId: 'architecture',
    name: `Art Deco`,
    years: `1925–1940`,
    tagline: `When New York decided that industry was beautiful.`,
    description: `Art Deco hit New York in the late 1920s at exactly the right moment: the city was building faster than any metropolis in history, the skyscraper had just become technically feasible, and a generation of architects wanted to make the commercial tower into something more than an engineering achievement. The Chrysler Building, the Empire State Building, and Rockefeller Center are the three great monuments of the style in New York — and together they define the skyline silhouette that made the city synonymous with modern urban ambition. The style was characterized by geometric ornament, setback profiles, metallic surfaces, and the conviction that speed, industry, and commerce were worthy subjects for architectural celebration.`,
    venueIds: ['chrysler_building', 'empire_state', 'rockefeller_center'],
    figureIds: ['william_van_alen', 'william_lamb', 'raymond_hood'],
  },
  arch_gothic: {
    id: 'arch_gothic',
    domainId: 'architecture',
    name: `Gothic Revival`,
    years: `1840–1930`,
    tagline: `The medieval language that built New York's most enduring landmarks.`,
    description: `Gothic Revival arrived in America via England in the 1840s and became the dominant style for churches, universities, and — unexpectedly — skyscrapers. The pointed arch, the flying buttress, the elaborate stone carving: all were adapted from French and English Gothic cathedrals by American architects who believed that medieval craftsmanship expressed permanence and spiritual seriousness more convincingly than any modern alternative. In New York, the style produced St. Patrick's Cathedral, Trinity Church, the Woolworth Building, and the Brooklyn Bridge towers — four radically different building types united by a common formal vocabulary. The Woolworth Building and the Brooklyn Bridge show how Gothic ornament could be applied to thoroughly modern structures without pretense.`,
    venueIds: ['st_patricks', 'trinity_church_nyc', 'woolworth_building', 'brooklyn_bridge_arch'],
    figureIds: ['james_renwick_jr', 'cass_gilbert', 'john_roebling'],
  },
  arch_beaux_arts: {
    id: 'arch_beaux_arts',
    domainId: 'architecture',
    name: `Beaux-Arts`,
    years: `1880–1920`,
    tagline: `Classical grandeur in service of American civic ambition.`,
    description: `Beaux-Arts architecture — named for the École des Beaux-Arts in Paris, where an entire generation of American architects trained — brought French classical formalism to American public buildings at exactly the moment when the country was building the infrastructure of a modern industrial nation. Grand Central Terminal, the New York Public Library, the Metropolitan Museum of Art, and the US Customs House: these are the monuments of an era when civic and commercial clients wanted their buildings to express permanence, authority, and seriousness through the vocabulary of ancient Greece and Rome. The style emphasized symmetry, axial planning, sculptural enrichment, and monumental scale — qualities that made train stations and libraries feel like temples.`,
    venueIds: ['grand_central_terminal', 'nypl_schwarzman', 'flatiron_building'],
    figureIds: ['whitney_warren', 'john_carrere', 'daniel_burnham'],
  },
  arch_modernism: {
    id: 'arch_modernism',
    domainId: 'architecture',
    name: `Modernism`,
    years: `1950–1975`,
    tagline: `Less is more — the glass towers that rewrote the rules of the city.`,
    description: `The International Style arrived in New York in the early 1950s and within a decade had transformed Park Avenue from a boulevard of masonry apartment buildings into a canyon of glass and steel. Lever House and the Seagram Building, built within six years of each other directly across the street, are the defining monuments: one the pioneer, one the perfection. The United Nations Secretariat, completed in 1952, brought the style to a global audience. What these buildings shared was a conviction that industrial materials — glass, steel, concrete — were beautiful in themselves and required no historical ornament to justify their use. The most controversial legacy of modernism was not the towers but the housing projects: the same principles applied at the scale of public housing produced consequences that took decades to reckon with.`,
    venueIds: ['seagram_building', 'lever_house', 'un_headquarters'],
    figureIds: ['mies_van_der_rohe', 'gordon_bunshaft', 'le_corbusier'],
  },
  arch_contemporary: {
    id: 'arch_contemporary',
    domainId: 'architecture',
    name: `Contemporary`,
    years: `1990–present`,
    tagline: `New York's buildings since modernism's certainties dissolved.`,
    description: `Contemporary New York architecture resists any single label, which is itself the point: the post-modern, the deconstructivist, the parametric, the sustainable — all coexist in a city that builds more than any other American metropolis. What the best recent work shares is a relationship to place and history that the International Style often ignored. The High Line preserved industrial infrastructure and turned it into a park. One World Trade Center acknowledged that a building on that site would always carry symbolic weight. The Hudson Yards development has been criticized as a private city within the city. Contemporary architecture in New York is inseparable from real estate economics, but at its best it still finds ways to give something back to the street.`,
    venueIds: ['one_wtc', 'high_line'],
    figureIds: ['elizabeth_diller', 'david_childs'],
  },

  theater_musicals: {
    id: 'theater_musicals',
    domainId: 'theater',
    name: 'Musicals',
    tagline: "Song, dance, and story — the American art form",
    description: "Broadway invented the integrated musical — a form where every song advances the plot and every dance expresses character. No other theater tradition fuses entertainment and emotional ambition quite the same way, and New York is where it was born.\n\nFrom Rodgers and Hammerstein's post-war optimism to Sondheim's city-worn ambivalence to Lin-Manuel Miranda's hip-hop reimagining of the Founding Fathers, the Broadway musical has tracked American culture's anxieties and celebrations for more than a century.\n\nThe shows that live on this list aren't just crowd-pleasers — they're arguments. About who counts, what love costs, and whether the dream holds up. Walk into any of these theaters and you're walking into that argument.",
    venueIds: ['majestic_theatre','richard_rodgers_theatre','st_james_theatre','imperial_theatre','shubert_theatre'],
    figureIds: ['richard_rodgers','stephen_sondheim','lin_manuel_miranda'],
  },
  theater_drama: {
    id: 'theater_drama',
    domainId: 'theater',
    name: 'Drama',
    tagline: "Plays that changed what theater was allowed to say",
    description: "American dramatic writing came of age in New York. The plays that emerged from Broadway and the Public Theater between 1947 and 1987 didn't just entertain — they challenged what could be spoken about on a commercial stage: desire, race, class, failure, and grief.\n\nMiller, Williams, Wilson, Hansberry. These playwrights wrote from inside American life, about people the mainstream preferred not to look at directly. Their plays still feel urgent because the subjects haven't resolved.\n\nThe stages listed here — the Public Theater especially — have been laboratories for the most serious American writing. Off the tourist trail and worth every step.",
    venueIds: ['public_theater','shubert_theatre'],
    figureIds: ['arthur_miller','tennessee_williams','august_wilson','lorraine_hansberry'],
  },
  theater_off_broadway: {
    id: 'theater_off_broadway',
    domainId: 'theater',
    name: 'Off-Broadway',
    tagline: "Smaller stages, bigger risks — where tomorrow's hits are born",
    description: "Off-Broadway is where Broadway ideas get tested before the money arrives. Smaller houses, cheaper tickets, and a tolerance for failure that the commercial stage cannot afford — this is where the American theater actually experiments.\n\nThe Public Theater has launched more consequential American plays than any building in the country. Hair, A Chorus Line, Hamilton — all developed here before crossing to Broadway. Off-Broadway isn't the minor leagues; it's the farm system where the form evolves.\n\nIf you want to see what New York theater will look like in five years, you look Off-Broadway now.",
    venueIds: ['public_theater'],
    figureIds: ['august_wilson','lin_manuel_miranda','lorraine_hansberry'],
  },
  theater_shakespeare: {
    id: 'theater_shakespeare',
    domainId: 'theater',
    name: 'Shakespeare in the Park',
    tagline: "Free Shakespeare under the stars — a New York institution since 1962",
    description: "Shakespeare in the Park began in 1962 when Joseph Papp convinced New York City to let him build a permanent outdoor theater in Central Park. The Delacorte Theater holds 1,800 people and every seat is free. That decision — that great theater should be available to everyone — is still radical.\n\nThe productions here have launched careers (Meryl Streep, Kevin Kline, James Earl Jones) and redefined how Shakespeare gets staged. The texts stay intact; the casting and setting push against assumptions about who these plays are for and who gets to perform them.\n\nTickets are distributed by lottery the day of each performance. Plan your trip around the show, not the other way around.",
    venueIds: ['delacorte_theater'],
    figureIds: ['lin_manuel_miranda'],
  },
  history_founding: {
    id: 'history_founding',
    domainId: 'history',
    name: 'The Founding City',
    description: "Before Washington D.C. existed, New York was the capital of the United States. George Washington was inaugurated on the balcony of Federal Hall on April 30, 1789 — the republic's first official act happened on Wall Street, one block from the New York Stock Exchange.\n\nThe city's role in the founding wasn't just ceremonial. Alexander Hamilton, working from a law office in lower Manhattan, designed the American financial system from scratch — the Treasury, the national bank, the assumption of state debts. The arguments he had with Jefferson and Madison about what kind of country this would be are still the arguments American politics is having.\n\nFraunces Tavern, Federal Hall, and the African Burial Ground tell three different stories about 1776 — liberty, power, and the people the founding documents left out. Walk all three in the same afternoon.",
    venueIds: ['federal_hall','fraunces_tavern','african_burial_ground'],
    figureIds: ['george_washington','alexander_hamilton'],
  },
  history_immigration: {
    id: 'history_immigration',
    domainId: 'history',
    name: 'The Immigrant City',
    description: "Between 1892 and 1954, more than 12 million people passed through Ellis Island — the largest mass migration in human history. They came from Ireland, Italy, Eastern Europe, and China, and they built New York. The outer boroughs, the subway system, the garment industry, the restaurant culture — all of it assembled by people who arrived with almost nothing.\n\nThe Lower East Side Tenement Museum preserves the apartments where these families actually lived: tiny, dark, six people to a room, working sewing machines until midnight. It's the most honest account of what immigration actually looked like that survives in the city.\n\nNew York is still the most immigrant city in the United States. More than 800 languages are spoken here. The story isn't over — it's the same story with different names.",
    venueIds: ['ellis_island','tenement_museum'],
    figureIds: ['jacob_riis','emma_goldman'],
  },
  history_civil_rights: {
    id: 'history_civil_rights',
    domainId: 'history',
    name: 'Civil Rights & Cultural Memory',
    description: "The Stonewall Inn riots of June 1969 didn't start the LGBTQ rights movement, but they crystallized it. The Stonewall is the reason Pride marches are in June, and the reason they are called marches. It is the most significant single address in the history of LGBTQ civil rights.\n\nUptown in Harlem, the Schomburg Center for Research in Black Culture holds one of the largest archives of African and African-American history in the world. Langston Hughes is buried there. The center was built by Arturo Alfonso Schomburg, a Puerto Rican-born Black scholar who spent his life collecting what others refused to preserve.\n\nThese aren't just historical sites. They are arguments about whose history gets monuments and whose gets erased — and they've been winning that argument, slowly, for decades.",
    venueIds: ['stonewall_inn','hamilton_grange','schomburg_center'],
    figureIds: ['frederick_douglass','shirley_chisholm','marsha_p_johnson'],
  },


  // ── Hip-Hop ──────────────────────────────────────────────────────────────
  bronx_origins: {
    id: 'bronx_origins',
    domainId: 'hip_hop',
    name: 'The Bronx Origins',
    tagline: 'Where it all began — August 11, 1973.',
    description: `In the summer of 1973, the South Bronx was a neighborhood in crisis. Landlord arson, economic abandonment, the destruction wrought by Robert Moses's Cross Bronx Expressway cutting through the borough's heart — the neighborhood had been systematically dismantled. Into that crisis, three figures created something entirely new.

DJ Kool Herc invented the loop at 1520 Sedgwick Avenue on August 11, 1973: two turntables, two copies of the same record, the percussion break extended indefinitely. Afrika Bambaataa organized the culture around it — founding the Universal Zulu Nation, defining the four elements (DJing, MCing, Breaking, Graffiti), redirecting gang energy into art. Grandmaster Flash perfected the technique, adding the precision and showmanship that turned block-party DJing into performance.

By 1979, "Rapper's Delight" had introduced the form to the world. By 1982, "The Message" had demonstrated that it could carry the same weight as the best American social writing. In nine years, from a recreation room in Morris Heights to national radio, hip-hop had arrived.`,
    venueIds: ['one_five_two_zero', 'universal_hip_hop_museum'],
    figureIds: ['dj_kool_herc', 'grandmaster_flash', 'afrika_bambaataa', 'melle_mel'],
    workIds: ['rappers_delight', 'the_message_hh'],
  },
  golden_age_hiphop: {
    id: 'golden_age_hiphop',
    domainId: 'hip_hop',
    name: 'The Golden Age',
    tagline: '1986–1993: when New York defined what hip-hop could be.',
    description: `Between 1986 and 1993, New York hip-hop produced more essential albums than any comparable period in any genre.

Run-DMC brought the form to rock audiences without changing a single thing about themselves. LL Cool J proved it could be commercially dominant and emotionally honest at the same time. Rakim raised the lyrical bar so high that every subsequent MC has been measured against him. A Tribe Called Quest married the music to jazz and created the alternative tradition that runs through every thoughtful rap record made since.

These years coincided with the height of crack cocaine's devastation in New York's Black neighborhoods — and the music was both a product of that devastation and a response to it. The best records from this period are documents of a city under enormous pressure, and they are also astonishing art. The Apollo Theater in Harlem and the park jams at Rucker Park were the stages where this generation proved itself.`,
    venueIds: ['apollo_theater_hh', 'hollis_queens', 'rucker_park'],
    figureIds: ['run_dmc', 'll_cool_j', 'rakim', 'a_tribe_called_quest'],
    workIds: ['raising_hell', 'paid_in_full', 'low_end_theory'],
  },
  brooklyn_voice: {
    id: 'brooklyn_voice',
    domainId: 'hip_hop',
    name: "Brooklyn's Voice",
    tagline: 'Biggie and Jay-Z. Clinton Hill and Bed-Stuy. Two albums that defined a decade.',
    description: `The mid-1990s belonged to Brooklyn. Within two years, two artists from the same borough — within a few miles of each other — released albums that would define East Coast hip-hop for a generation.

The Notorious B.I.G. — Christopher Wallace, from 226 St. James Place in Clinton Hill — released Ready to Die in 1994 at 22 years old. His storytelling was cinematic, his command of the form total: he built worlds in four bars, made violence funny and devastating simultaneously, and created the most complete portrait of Brooklyn street life in the history of the genre. He was shot and killed in Los Angeles in 1997.

Jay-Z — Shawn Carter, from the Marcy Houses in Bed-Stuy — released Reasonable Doubt himself in 1996 when no label would sign him. More jazz-influenced, more oblique, equally brilliant. Both albums came from the same geography and the same decade, and they sound nothing alike — which is the point.`,
    venueIds: ['biggie_mural', 'marcy_houses'],
    figureIds: ['notorious_big', 'jay_z'],
    workIds: ['ready_to_die', 'reasonable_doubt'],
  },
  queensbridge: {
    id: 'queensbridge',
    domainId: 'hip_hop',
    name: 'Queensbridge & Queens',
    tagline: 'Illmatic, Hollis, and the bridge\'s shadow.',
    description: `Queens produced an improbable concentration of hip-hop talent across two generations and two very different geographies.

Queensbridge Houses — the largest public housing project in North America, in Long Island City — produced Nas, whose Illmatic (1994) is widely considered the greatest rap album ever made. The complex sits in the shadow of the Queensboro Bridge, and the bridge appears throughout the album as both literal backdrop and metaphor: the boundary between Queensbridge and the Manhattan skyline visible from every window.

Hollis — a quiet residential neighborhood of detached houses and tree-lined streets in southeast Queens — produced Run-DMC and LL Cool J within blocks of each other on 205th Street. A Tribe Called Quest came from St. Albans, a few miles south. Queens was simultaneously suburban and the source of some of the most essential New York street music ever recorded — the contradiction that gave it its distinctive sound.`,
    venueIds: ['queensbridge_houses', 'hollis_queens', 'rucker_park'],
    figureIds: ['nas', 'a_tribe_called_quest', 'run_dmc', 'll_cool_j'],
    workIds: ['illmatic', 'low_end_theory', 'raising_hell'],
  },
  wu_tang: {
    id: 'wu_tang',
    domainId: 'hip_hop',
    name: 'Wu-Tang & Shaolin',
    tagline: 'Nine MCs from Staten Island who changed everything.',
    description: `Wu-Tang Clan called Staten Island "Shaolin" — after the legendary kung-fu monastery — and built their entire mythology around their outer-borough geography. That mythology was the point: to take the most forgotten borough in New York City and transform it, through force of imagination, into a legendary place.

Nine MCs — RZA, GZA, Ol' Dirty Bastard, Inspectah Deck, Raekwon, Ghostface Killah, Method Man, U-God, and Masta Killa — grew up within blocks of each other in the Park Hill apartments in Clifton. The RZA unified them under a production aesthetic unlike anything before: stripped-down drums, soul samples, kung-fu movie dialogue, Five Percent Nation philosophy. Enter the Wu-Tang (36 Chambers), recorded in RZA\'s basement in 1993, cost almost nothing to make and became one of the most influential albums in music history.

Take the free Staten Island Ferry from Lower Manhattan, watch the harbor open up, and think about what nine kids from these buildings built.`,
    venueIds: ['park_hill_staten_island', 'apollo_theater_hh'],
    figureIds: ['wu_tang_clan'],
    workIds: ['enter_wu_tang'],
  },

};


export const domains = {
  visual_art: {
    id: 'visual_art',
    name: `Visual Art`,
    icon: '🎨',
    tagline: `From Impressionism to Abstract Expressionism`,
    description: `NYC has the best collection of art outside of Paris. The Met, MoMA, the Guggenheim, the Whitney — more masterpieces per square mile than anywhere on earth.`,
    topicIds: ['post_impressionism', 'impressionism', 'abstract_expressionism', 'cubism', 'american_modernism'],
    venueIds: ['moma', 'met', 'guggenheim', 'whitney', 'brooklyn', 'cooper_hewitt'],
    comingSoon: [],
  },
  jazz: {
    id: 'jazz',
    name: `Jazz`,
    icon: '🎷',
    tagline: `The clubs are still open. The music is still being made.`,
    description: `NYC is the jazz capital of the world. Village Vanguard, Blue Note, Birdland, Smalls — the rooms where jazz history was made are still open every night, still booking the best players in the world.`,
    topicIds: ['jazz_the_clubs', 'jazz_concert_scale', 'jazz_how_to_listen'],
    venueIds: ['village_vanguard', 'blue_note', 'birdland', 'jazz_lincoln_center', 'smalls'],
    comingSoon: [],
  },
  classical_music: {
    id: 'classical_music',
    name: `Classical Music`,
    icon: '🎼',
    tagline: `Carnegie Hall, Lincoln Center, the Met — and rooms you haven't found yet.`,
    description: `New York has the finest concentration of classical music venues in the world. Symphony, opera, chamber music, solo recital — the full range, performed live, every night of the week.`,
    topicIds: ['classical_solo_piano', 'classical_opera', 'classical_symphony', 'classical_chamber', 'classical_choral'],
    venueIds: ['carnegie_hall', 'david_geffen_hall', 'met_opera_house', 'alice_tully_hall', 'miller_theatre', 'bargemusic', 'ninety_second_st_y', 'merkin_hall'],
    comingSoon: [],
  },
  sports: {
    id: 'sports',
    name: `Sports`,
    icon: '🏆',
    tagline: `From Ruth to Jeter, Reed to The Bounce`,
    description: `The Yankees, the Knicks, the Rangers, the US Open, and boxing at MSG. New York has produced more legendary sports moments than any other city in America.`,
    topicIds: ['baseball', 'basketball', 'hockey', 'tennis', 'boxing'],
    venueIds: ['yankee_stadium', 'msg', 'citi_field', 'arthur_ashe_stadium'],
    comingSoon: [],
  },
  architecture: {
    id: 'architecture',
    name: `Architecture`,
    icon: '🏛️',
    tagline: `Where Art Deco towers, Gothic cathedrals, and modernist glass meet`,
    description: `New York built its skyline in four great waves: Gothic Revival churches and bridges, Beaux-Arts train stations and libraries, Art Deco skyscrapers, and modernist glass towers. Each wave left monuments that define how the city looks and feels.`,
    venueFirst: true,
    venueGroups: [
      {
        label: `Midtown Core`,
        note: `All within a 15-minute walk of each other`,
        venueIds: ['empire_state', 'nypl_schwarzman', 'grand_central_terminal', 'chrysler_building', 'rockefeller_center', 'st_patricks'],
      },
      {
        label: `Park Avenue & East Side`,
        note: `Two modernist towers across the street from each other, plus the UN`,
        venueIds: ['seagram_building', 'lever_house', 'un_headquarters'],
      },
      {
        label: `Downtown Manhattan`,
        note: `Financial District and the bridges — a full half-day`,
        venueIds: ['woolworth_building', 'trinity_church_nyc', 'one_wtc', 'brooklyn_bridge_arch'],
      },
      {
        label: `Chelsea & Flatiron`,
        note: `Walk the High Line south and end at the Flatiron`,
        venueIds: ['high_line', 'flatiron_building'],
      },
    ],
    topicIds: ['arch_art_deco', 'arch_gothic', 'arch_beaux_arts', 'arch_modernism', 'arch_contemporary'],
    venueIds: ['chrysler_building', 'empire_state', 'rockefeller_center', 'woolworth_building', 'grand_central_terminal', 'nypl_schwarzman', 'flatiron_building', 'st_patricks', 'trinity_church_nyc', 'brooklyn_bridge_arch', 'seagram_building', 'lever_house', 'un_headquarters', 'one_wtc', 'high_line'],
    comingSoon: [],
  },
  theater: {
    id: 'theater',
    name: `Theater`,
    description: `Broadway legends, Off-Broadway pioneers, and Shakespeare under the stars`,
    icon: '🎭',
    topicIds: ['theater_musicals', 'theater_drama', 'theater_off_broadway', 'theater_shakespeare'],
    venueIds: ['shubert_theatre', 'st_james_theatre', 'majestic_theatre', 'richard_rodgers_theatre', 'imperial_theatre', 'public_theater', 'delacorte_theater'],
  },
  history: {
    id: 'history',
    name: `History`,
    description: `The sites where American democracy was born, tested, and transformed`,
    icon: '📜',
    venueFirst: true,
    venueGroups: [
      {
        name: `The Founding City`,
        description: `Where American democracy was born`,
        venueIds: ['federal_hall', 'fraunces_tavern', 'african_burial_ground'],
      },
      {
        name: `The Immigrant City`,
        description: `Waves of newcomers who built New York`,
        venueIds: ['ellis_island', 'tenement_museum'],
      },
      {
        name: `Civil Rights & Cultural Memory`,
        description: `Movements that fought for equality`,
        venueIds: ['stonewall_inn', 'hamilton_grange', 'schomburg_center'],
      },
    ],
    venueIds: ['federal_hall', 'fraunces_tavern', 'african_burial_ground', 'ellis_island', 'tenement_museum', 'stonewall_inn', 'hamilton_grange', 'schomburg_center'],
  },
  hip_hop: {
    id: 'hip_hop',
    name: `Hip-Hop`,
    icon: '🎤',
    tagline: `Born in the South Bronx in 1973. The most globally influential music New York has ever made.`,
    description: `On August 11, 1973, in a recreation room at 1520 Sedgwick Avenue in the Bronx, DJ Kool Herc threw a party and invented hip-hop. Fifty years later, it is the most globally influential art form New York has ever produced — bigger than jazz, bigger than the Abstract Expressionists, bigger than anything that came before. The genre's geography is unusually specific: a handful of housing projects, neighborhood parks, and recording studios across five boroughs. Most of it is still there.`,
    topicIds: ['bronx_origins', 'golden_age_hiphop', 'brooklyn_voice', 'queensbridge', 'wu_tang'],
    venueIds: ['one_five_two_zero', 'universal_hip_hop_museum', 'apollo_theater_hh', 'rucker_park', 'marcy_houses', 'biggie_mural', 'hollis_queens', 'queensbridge_houses', 'park_hill_staten_island'],
    comingSoon: [],
  },
};

export function getWorksAtVenue(venueId) {
  return Object.values(works).filter(w => w.venueId === venueId)
}

export function getWorksByFigure(figureId) {
  return Object.values(works).filter(w => w.figureId === figureId)
}

export function getSeeAlsoNearby(workId) {
  const w = works[workId]
  if (!w) return {}
  const fig = figures[w.figureId]
  const topic = topics[fig.topicId]
  const isJazz = topic.domainId === 'jazz'
  const otherByFigure = getWorksByFigure(w.figureId).filter(x => x.id !== workId)
  const otherFigures = (topic.figureIds || []).filter(id => id !== w.figureId).map(id => figures[id])
  if (isJazz) {
    const otherInTopic = (topic.figureIds || [])
      .filter(id => id !== w.figureId)
      .flatMap(id => figures[id].workIds || [])
      .map(id => works[id])
      .filter(Boolean)
    return { otherByFigure, otherAtVenue: [], otherInTopic, otherFigures, figure: fig, isJazz: true }
  } else {
    const venue = venues[w.venueId]
    const otherAtVenue = getWorksAtVenue(w.venueId).filter(x => x.figureId !== w.figureId)
    return { otherByFigure, otherAtVenue, otherInTopic: [], otherFigures, venue, figure: fig, isJazz: false }
  }
}

export function getVenueInterests(venueId) {
  return Object.values(topics).filter(t => (t.venueIds || []).includes(venueId))
}

export function getRelatedVenues(venueId) {
  const relatedTopics = getVenueInterests(venueId)
  const ids = new Set()
  relatedTopics.forEach(t => {
    ;(t.venueIds || []).forEach(id => { if (id !== venueId) ids.add(id) })
  })
  return [...ids].map(id => venues[id]).filter(Boolean)
}
