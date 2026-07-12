# NYC Learn-Then-Experience App — Project Brief

## The Concept

A mobile-first app that pairs short, opinionated learning content with NYC's world-class venues. Users spend 5–10 minutes learning about a topic, then go experience it in person.

The differentiator is **sideways linking**: from any work, artist, or venue, the app surfaces related things you can also see nearby in NYC.

**Tagline idea:** *Learn it. Then go see it.*

---

## App Structure — 6 Pillars

1. **Domains** — top-level categories of what users can learn
2. **Data Model** — the knowledge graph underneath everything
3. **User Flows** — three ways to enter the content
4. **Content** — the actual primers (your moat)
5. **Tech Stack** — what you build it with
6. **Legal** — guardrails to stay safe

---

## Data Model (The Engine)

Five core entities connected as a graph:

**Domain → Topic → Figure → Work/Event → Venue**

Example: Art → Post-Impressionism → Van Gogh → Starry Night → MoMA

### Relationships

- A **Figure** has many Works across many Venues
- A **Venue** holds many Works across many Figures
- A **Topic** spans many Figures and Venues
- A **Work** lives at one current Venue

This graph is what powers "see also nearby" — the feature that makes the app feel smart.

---

## Core User Flow

1. Open app
2. Pick a domain → e.g. Art
3. Pick a topic → e.g. Post-Impressionism
4. See key figures → Van Gogh, Cézanne, Gauguin, Seurat
5. Pick a figure → Van Gogh
6. Read 5-min primer → who he was, why he matters, what makes his work distinct
7. See famous works → Starry Night, Wheatfield with Cypresses, Self-Portrait with a Straw Hat
8. Pick a work → Starry Night
9. "What to look for" → 3–5 specific things to notice in person
10. Venue card → MoMA — address, hours, ticket link

### "See Also Nearby" (the magic step)

- Other Van Goghs in NYC (the Met, the Guggenheim)
- Other Post-Impressionists at MoMA (Cézanne, Seurat)
- Other movements at MoMA (Cubism, Abstract Expressionism)

### Secondary Flows (Add Later)

- **Venue-first:** "I'm going to the Met Saturday — what should I learn?"
- **Map-first:** "Show me what's around me right now."

---

## Content Structure (Per Figure / Work)

Every figure and major work should have:

- **5-minute primer** (~600 words) — conversational, opinionated, not a Wikipedia rewrite
- **What to look for** — 3–5 specific things to notice when you're there
- **See also nearby** — auto-populated from the graph
- **Deep dive** (optional) — for users who want more
- **Venue info** — address, hours, link to official ticketing

Voice matters more than completeness. The app exists to give people something Wikipedia can't: taste and curation.

---

## Domains to Include

### Phase 1 — Launch

- **Visual Art** — the Met, MoMA, Whitney, Guggenheim, Frick, Brooklyn Museum
- **Architecture** — pairs naturally with art; NYC is unmatched here

### Phase 2 — Month 3–6

- **Classical Music & Opera** — Lincoln Center, Carnegie Hall, the Met Opera, BAM
- **Sports** — Yankees, Mets, Knicks, Nets, Rangers, Giants, Jets, Liberty, NYCFC

### Phase 3 — Month 6+

- **Theater & Broadway**
- **Jazz** — Village Vanguard, Blue Note, Smalls, Jazz at Lincoln Center
- **Dance** — NYCB, ABT, Alvin Ailey
- **Film** — Film at Lincoln Center, Film Forum, Metrograph, BAM

### Phase 4 — Broader

- **History** — Tenement Museum, NY Historical Society, Ellis Island
- **Science & Natural History** — AMNH, Hayden Planetarium, Intrepid
- **Food** — regional cuisines tied to neighborhoods
- **Literature** — walking-tour format (Whitman in Brooklyn, Baldwin in Harlem)

---

## Tech Stack (Lean MVP)

| Layer | Tool |
|---|---|
| Frontend | React (web) or React Native (mobile) — start web for speed |
| Backend | Supabase or Firebase (free tier) |
| Database | Postgres (comes with Supabase) |
| Maps | Mapbox or Google Maps API |
| Hosting | Vercel (frontend), Supabase (backend) |
| Search | Simple text filter at first; Algolia/Meilisearch later |

No AI, no ML, no fancy infrastructure needed for v1. It's a content app with a graph.

---

## Build Sequence

### Weeks 1–2 — Content First

Pick Art + Post-Impressionism. Hand-curate 5 figures, 15 works, 3 NYC venues. Write all the primers.

### Weeks 3–4 — Prototype

Static site, no backend, JSON-driven. Test on 5 friends.

### Weeks 5–8 — Real MVP

Add backend, search, sideways-link logic, mobile-responsive design. Expand to 2–3 more Art topics.

### Month 3+ — Second Domain

Add Architecture (pairs naturally with Art) or jump to Music.

---

## Legal Checklist

- Write all primer text yourself (or AI-draft + heavily edit; you own the final)
- Use only Wikimedia Commons / public-domain images
- No museum or team logos in v1
- Link out to official sites for tickets and current programming — don't host that data
- Footer disclaimer: "Not affiliated with any of the institutions referenced"
- For commercial launch, consult an IP lawyer

---

## Open Questions to Resolve in Cowork

1. **Who's the primary user?** Tourist (3-day arc), local New Yorker (this weekend), parent (kid-friendly filter), or lifelong learner (depth)? Each implies a different home screen.
2. **NYC-only forever, or NYC as launch city?** Affects brand and data model.
3. **What's the trigger?** Why does someone open this on a Tuesday night? (Push notifications? Calendar integration? Just curiosity?)
4. **Monetization** (later): freemium primers, affiliate ticket links, premium tours, partnerships with venues?

---

## Quick-Reference Summary

```
APP = 6 things working together

1. DOMAINS         What people can learn
                   → Art, Sports, Music, Architecture, Theater...

2. DATA MODEL      How info is organized
                   → Domain → Topic → Figure → Work → Venue

3. USER FLOWS      How people use the app
                   → Pick a topic, pick a venue, or browse a map

4. CONTENT         What people actually read
                   → 5-min primer + what to look for + see nearby

5. TECH STACK      What you build it with
                   → React + Supabase + Mapbox + Vercel

6. LEGAL           What keeps you safe
                   → Original text, public-domain images, link out
```
