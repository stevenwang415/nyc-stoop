# NYC Stoop

A curated guide to New York City — venues, neighborhoods, nightlife, sights, and a day-by-day trip planner — designed for first-time and returning visitors who want to skip the algorithm and read something with a point of view.

Built as a single-page React app, intended to ship as an iOS app via Capacitor.

## What it does

**Explore.** Editorially curated picks for tonight, today, and any time. Browse by topic (jazz, theater, visual art, classical, architecture, history, sports, hip-hop) or by neighborhood. Brooklyn has a full sub-neighborhood deep-dive (Greenpoint, Williamsburg, Bushwick, DUMBO, Park Slope, Crown Heights, and more) with venue-level editorial detail on every sight.

**Tonight.** A time-anchored feed of things happening in NYC tonight, grouped by Evening / Late Night / Daytime, filterable by category, with hero photography and date-and-price callouts.

**Map.** Every venue plotted with Leaflet + OpenStreetMap. Save a venue with a heart, jump to its detail page, or open it in Maps.

**My Trip.** Save venues, custom places, or works as you browse; the planner buckets them into day-by-day itineraries grouped by area cluster, suggests a lunch and dinner restaurant by cuisine for each meal of each day, estimates travel time between stops, and exports the whole plan as shareable text or a Google Maps multi-stop route. Drag stops to reorder directly, move stops between days, or swap one curated venue for another.

**Add Place.** Save your own favorites alongside the curated picks. User-added places are auto-included in your trip, grouped by neighborhood, and appear in share + route exports.

## Tech stack

- **React 18** (function components + hooks)
- **Vite 5** (dev server + production bundler)
- **Vanilla CSS** with CSS variables (no Tailwind, no CSS-in-JS framework)
- **Leaflet** + **OpenStreetMap** tiles for the map
- **localStorage** for all client-side persistence (saves, trip plan, user venues, notes, preferences)
- **Capacitor** (planned) — iOS shell for App Store submission

No backend yet. Login + cross-device sync is post-V0.

## Getting started

Requirements: Node 18+, npm.

```bash
git clone https://github.com/<your-username>/nyc-stoop.git
cd nyc-stoop
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` with hot reload.

## Build for production

```bash
npm run build
```

Outputs static files to `dist/`. The build is deployable to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

```bash
npm run preview
```

Locally previews the production build.

## Project structure

```
NYC_APP/
├── index.html                   # Vite entry HTML
├── vite.config.js               # Vite config (React plugin)
├── package.json
├── public/
│   └── img/                     # hero photos for Tonight picks (Unsplash, license-clean)
└── src/
    ├── main.jsx                 # React mount point
    ├── index.css                # global CSS + design tokens
    ├── App.jsx                  # single-file app: all components, routing, state
    └── data/
        ├── content.js           # venues, topics, figures, works, domains
        └── tonight.js           # curated Tonight picks with images + metadata
```

The app deliberately lives in a single `App.jsx` for now. As features stabilize, components will get split into their own files.

## Data and credits

**Editorial content** (blurbs, insider tips, neighborhood essays) is original and hand-written.

**Photography** is sourced from [Unsplash](https://unsplash.com/license) under the Unsplash License — free for commercial use, no attribution required. Photographer credits are stored alongside each image as editorial good practice; see `src/data/tonight.js`.

**Map tiles** are © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, served via the standard tile server.

## Roadmap

**V0 (pre-iOS):** safe-area handling, global search, settings screen with clear-data + feedback, sub-neighborhood stubs for Queens / Bronx / Staten Island.

**V0.5 (iOS launch):** Capacitor wrap, app icon + launch screen, privacy policy, App Store screenshots, TestFlight.

**V1:** weather-aware day plans, hours-of-operation filtering, user accounts + cloud sync, plan-sharing via link.

**Later:** push notifications, photo coverage for every sight, more boroughs.

## License

All rights reserved (for now). Open-source license TBD.
