# improve_design.md — per-page design upgrades (started 2026-07-14)

Working log for visual upgrades, page by page. Every entry must obey the
standing laws in DESIGN_REVIEW_2026-07-08.md — especially **S4: color is
wayfinding, not wallpaper** (cream stays the ground; a color must MEAN
something the user can learn) and **S2: serif is the editorial voice**.

## Topics under "Browse by" (Explore)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Show cards: kill the rainbow headers | ✅ done 07-14 | Broadway-show cards took each theater's full palette color as a header (brown, purple, violet, blue in one scroll). That color carries no learnable meaning → decoration, S4 violation, and white-on-color titles split the type system (S2). New card: cream ground, serif ink title with a small venue-color dot (the color survives as an accent that matches the venue's own page), "at Theater · Author" subline, status as a compact chip (🟢 Running now · since 2015 / 📜 Historic · 1987) instead of a full-width black bar, and "Explore →" in clay — the one app-wide action color. Logic untouched: same buckets, toggle, navigation. |
| 2 | One-bucket topics: no dead toggle | ✅ done 07-14 | (Same pass) Drama/Off-Broadway/Plays are all-historic → toggle removed, section retitled "Landmark productions". |

## Domain pages ("What draws you in?")

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3 | Signature work per topic | ✅ done 07-14 | Each movement card carries its most famous work as an 88px thumbnail + micro-caption (Starry Night, Water Lilies, Les Demoiselles, Early Sunday Morning, the Pollock gallery view). A newcomer recognizes the painting before the -ism. Explicit picks in `TOPIC_HERO_WORK`; fallback = first legally-imaged work of the topic's figures; no image → no thumbnail (never a broken box). All images PD or CC — the fair-use purge list was never eligible. |
| 4 | FlowHero on domain pages | ✅ done 07-14 | Replaces the bare meta + h1 header with the hand-drawn hero used by Eat and the mood flows (museum scene for the looking arts, lit stage for the performing ones), serif title, domain description as body. This clears the "Explore Domain heroes still flat" deviation from DESIGN_REVIEW S1. Topic names on cards go serif (S2). |
| 5 | Topic image fallback chain (Jazz/Classical/Architecture/History) | ✅ done 07-14 | These domains' works lost images to the fair-use purge — but the chain now falls back: signature work → key figure's Commons portrait → key venue's verified photo. Jazz shows the Vanguard awning, Lincoln Center, Blue Note; portraits carry music/history topics. Page-level dedupe so sibling topics never wear the same face. No image → no thumbnail, never a repeat or a broken box. |

| 6 | Work-image audit (the venue audit never covered works) | ✅ done 07-14 | API-checked all 176 work imageUrls: 9 dead Commons files (why Guggenheim's Cubism section showed bare tiles). Fixed 5 with license-verified replacements (Léger PD, Rockefeller plaza CC BY, Woolworth lobby CC BY-SA, both NYPL works). Removed 4 honestly — no free file exists: Braque (© France until 2034), Gris "Guitar and Flowers" (painting is PD, nobody's uploaded a usable file), Sheeler (PD since Jan 2026, not yet on Commons — recheck later), Rockefeller lobby murals. Their designed tile fallback stands. NOTE: the 12 Met CRDImages URLs can't be checked from the sandbox — tap two Met works during the device pass. |

### Rationale, kept short
A color earns a place on a card only if the user can learn its meaning
(day hues in My Trip, category dots on the Map). Eight theaters' palette
colors in one list teach nothing — they just make the calmest reading
surface in the app compete with itself. The venue color now appears as a
9px dot, the same "color = identity chip" grammar as the Browse-by topic
dots, and the full palette still blooms on the venue's own detail page,
where it IS that page's identity.

## My Trip

| # | Item | Status | Notes |
|---|------|--------|-------|
| 7 | Period labels retired | ✅ done 07-14 | MORNING/AFTERNOON/EVENING bands (and their tint colors) removed from all cards — users go wherever, whenever. Neutral strip keeps route number · type label (HOTEL/RESTAURANT only) · duration · ✕. Periods still order the day internally. Saved-plan view matched. |
| 8 | Serif venue names (S2) | ✅ done 07-14 | Stop names + meal restaurant names go serif 17/ink — cards now sound like the guide, matching topic and show cards. |
| 9 | "When are you visiting?" de-amber-ed (S5) | ✅ done 07-14 | The date prompt was dressed as a warning (#fef3c7 amber). Now the house cream card with quiet ink/gray text — a nudge, not an alarm. |
| 10 | Saved-plan view brought into the house style | ✅ done 07-15 | The read-only saved plan lagged behind the live trip page it mirrors. Now: serif venue + restaurant names (S2, matching live cards); day pills wear the SAME day hues as the trip page instead of flat black (S4 — one learnable palette; `dayHue` lifted to module scope so both views share one source) and show the trip's real dates ("THURSDAY, JUL 30") when the snapshot is dated; meal lines use the ≈$/person approximation instead of raw $-symbols (so they can never disagree with the live cards); Reserve button off hardcoded #ea580c onto the clay accent; PDF export gets the dated day headers + price approximations too. Dead `PERIOD_COLORS` copy removed from the component. |

| 11 | Saved-plan stop cards match the meal-card grammar | ✅ done 07-15 | The stop cards were a mostly-empty gray strip holding one right-aligned duration, over a name. Now they speak the exact language of the meal cards beside them: leading domain icon (🎨 MoMA, 🎷 Birdland — same vocabulary as the live trip; 🏨/🍽️ for detected hotels/eateries), serif name, ONE quiet meta line ("Midtown · ~2.5 hrs"), and the same 📍 maps chip the restaurants carry (Google Maps search by address). `DOMAIN_ICONS` lifted to module scope — one icon vocabulary for both views. |

## Backlog (next pages to upgrade, same discipline)

- Explore Topic/Domain heroes → FlowHero treatment (carried from v1.1 list).
- Tonight tab hero card typography pass (serif title sizes vary).
- Legacy `#dc2626` on shared-trip adopt button → clay (carried).
