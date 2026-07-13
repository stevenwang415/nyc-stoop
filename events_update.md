# Events tab updates — working log (started 2026-07-13)

## Web-link policy (decided 2026-07-13)

**Rule: an event card only links to REAL destinations — never a search-results
page, on any engine.** The old behavior sent free/permitted events to a
DuckDuckGo "first result" redirect ("More info →"), which read as the app
dumping users into a random browser search.

Decision (revised same day): keep a web action on every card, but make the
label the contract. When there's no official page, the button says
**"🔎 Search the web →"** and opens a plain Google search — it promises a
search and delivers a search. What's banned is the old mismatch: a button
called "More info" that dumped users into a DuckDuckGo first-result redirect.

| Case | Button |
|------|--------|
| Ticketmaster event with ticket URL | **Get tickets →** (real ticket page) |
| Event with official site (GrowNYC market, known free series via `eventOfficialUrl`) | **🌐 Visit website →** |
| Anything else (permitted street events, no URL in city data) | **🔎 Search the web →** (Google) |

`eventSearchUrl` in `src/lib/nycEvents.js` now targets Google (no redirect
tricks); `eventTicketSearchUrl` is unused (Ticketmaster events always carry a
ticket URL in practice).

Free-event source note updated: "…the city lists the date and place; details
live with the organizer."

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Kill search-engine redirects on free events | ✅ done 07-13 | No web button when no official URL. |
| 2 | Linkless cards explain themselves | ✅ done 07-13 | When there's no web link: the type blurb always shows (even generic kinds), and a small source note appears — "From NYC's public event permits — the city lists the date and place; details live with the organizer." Answers "why is there nothing to tap?" before it's asked. |

## Backlog / later

- Grow the `eventOfficialUrl` recognizer (more recurring series/organizers →
  more free events get a real "Visit website" link).
- (add future Events items here)
