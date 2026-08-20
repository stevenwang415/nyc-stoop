# NYC Stoop — Translation Guide
*(written 2026-08-19, after completing zh-TW; use this to add Spanish or any language N)*

## Architecture in one paragraph
English strings ARE the keys. Every user-facing string in the code goes through
`t('English text')` / `t2('Day {N}', {N:3})` (UI chrome) or a content helper
(`tDesc`, `tTip`, `tTopicF`, `tDomainF`, `tGroupF`, `tVenueF`, `tFigureF`,
`tWorkF`) that looks up the current language's dictionary and **falls back to
English** when a key/id is missing. Nothing ever breaks from a missing
translation — it just shows English. Source data files are NEVER edited;
translations live in sidecar files.

## The files

| File | What's in it | zh-TW size |
|---|---|---|
| `src/lib/i18n.js` | Language state (`nyc_lang` in localStorage), `t()`/`t2()`, all content-helper functions, and the **ZH dict** (~440 UI strings) | ~440 keys |
| `src/data/i18n/places.zh.js` | `PLACES_ZH` — place descriptions + insider tips, keyed by place id (`seed_*`) | 524 entries |
| `src/data/i18n/content.zh.js` | `TOPICS_ZH` (44) · `DOMAINS_ZH` (8) · `GROUPS_ZH` (7, keyed by English name) · `VENUES_ZH` (103) · `FIGURES_ZH` (139) · `WORKS_ZH` (184) | 6 exports |

## Every localized surface (the checklist for language N)

**UI dictionary (`i18n.js` ZH dict) covers:**
1. Bottom nav (5 tabs) + top-nav screen titles
2. Home: wordmark eyebrow, search placeholder, Plan-it! card, section headers, mood cards, weather lines
3. Onboarding (3 slides + Skip/Next/Start Exploring!)
4. Tab tutorials (all 5, including bold-fragment sentences)
5. Browse-by: toggle pills, 8 domain chips, 10 area chips, Soon badge
6. Domain pages: "What draws you in?" / "Where do you want to go?", site counts
7. Plan it! sheet: when/start/budget/where questions + all option labels
8. Planner: day headers, meal cards (cuisine/Change/Add a restaurant), stop counts, empty states, Start fresh, editing banner, sample weekend
9. My Plans: cards, plural templates ({N} stops/days/meals picked), remove dialog
10. Events: category + range + borough chips, empty states, detail sheet (tickets/directions/calendar), source attributions
11. Map tab: filter chips, legend, Map/Neighborhoods toggle, tutorial, schematic neighborhood names (BOTH the mood-flow picker maps and the detailed Manhattan/Brooklyn views — see `mapAreaLabel()` note below)
12. Mood-flow area picker: "Where are you headed?", Near me/Anywhere, location notes, TAP A NEIGHBORHOOD, borough toggle
13. Eat flow: hero, filters, All Manhattan/Brooklyn pills
14. Venue pages: fact tiles (Area/Admission/Time), Booking, Insider tip, What to look/listen for, Why it matters
15. Paywall + Founding member row + Settings (language/temp/account/delete/feedback/credits)
16. Maps chooser sheet (Apple/Google/Cancel/sublabels)
17. Auth screens, PDF/share labels, import flow, search empty states
18. Mood/activity flow heroes: the 5 mood hero titles (`MOOD_HERO_TITLES` — "Make it a night."…), the 5 mood blurbs (bodies, from `src/data/moods.js`), and the 5 activity hero title+body pairs (`FLOW_HERO_COPY` — drinks/coffee/outdoors/culture/live). All wrapped at the FlowHero render site (~line 6090); translations are plain dict keys.

**Content sidecars cover:** place desc+tip, topic name/years/tagline/description/primer, domain tagline/description, venue-group name/desc, venue description/character/insiderTip/bookingNote/admissionCost/visitDuration, figure tagline/primer/nationality, work description/significance/whatToLookFor[].

**Deliberately NOT translated:** place/venue/artist names (proper nouns — what users see on signs and in Maps), event titles from NYC Open Data, show/album titles common in English, URLs, ids, localStorage values.

## How to add language N (e.g. Spanish)

1. **i18n.js**: add `const ES = {...}` beside ZH; change `t()` to switch on
   `_lang` ('en'|'zh'|'es'); extend `dateLocale()`; add the Settings toggle
   option (['en','English'],['zh','中文'],['es','Español']).
2. **Extract the key list**: regex `\bt2?\(\s*(['"`])((?:\\.|(?!\1).)*)\1` over
   `src/App.jsx` + `src/lib/nycEvents.js` → ~330 unique keys → translate → ES dict.
   (Diff script pattern lives in git history / docs/ZH_QA_2026-08-19.md §2.)
3. **Sidecars**: create `places.es.js` + `content.es.js` mirroring the zh files'
   export shapes; extend each helper in i18n.js to pick the dict by `_lang`
   (currently they check `_lang === 'zh'` only — generalize to a lookup table).
4. **Translate content** via parallel agents, ~50–90 entries per chunk, with a
   style guide + 2–3 approved sample translations pasted into every agent
   prompt. Output strict JSON keyed by id; verify counts with json.load.
   ⚠️ When extracting source text, parse escaped apostrophes (`\'`) properly —
   a naive quote regex corrupted 7 works' whatToLookFor arrays for zh.
5. **QA** (mirror docs/ZH_QA_2026-08-19.md): build gate → key-coverage diff →
   script-specific lint → sidecar import counts → 5-tab headless screenshot
   pass → English-leak grep → device pass incl. PDF export.

## Gotchas learned the hard way
- **Module-level constants** (label arrays like MAP_FILTERS, TONIGHT_DOMAIN_LABELS)
  are evaluated once at import — wrap with `t()` at the RENDER site, never at
  the definition, or the language switch won't re-translate them.
- **Shared keys**: 'Map' powers both the nav tab and the Map-screen view toggle;
  'Sports'/'Music' serve Events chips AND Browse-by. Changing one changes all
  uses — split into distinct keys if a language needs different words.
- **Placeholders** `{N} {A} {B} {Q} {AREA} {RANGE} {NAME} {P} {T} {TOD}` must
  survive translation verbatim.
- **Plurals**: English templates like `${n} stop${n!==1?'s':''}` were converted
  to key pairs ('1 stop' / '{N} stops') — reuse that pattern; don't reinvent.
- **Fragment keys**: tutorial sentences with <b> markup are split into text-node
  keys (including leading/trailing spaces!) — translate fragments so they read
  as a sentence when concatenated in order.
- **Schematic maps**: `mapAreaLabel()` in App.jsx joins multi-line English SVG
  labels (['MIDTOWN','WEST']) and renders the translation as ONE line if the
  joined key exists in the dict ('MIDTOWN WEST'). Add joined keys per language.
- **Language switch re-render**: `setLang()` + `onPrefsChange()` re-renders the
  tree; language persists in `nyc_lang` (device-scoped, in PROFILE_GLOBAL_KEYS).
- **PDF export**: jsPDF has no CJK font by default — SOLVED 2026-08-19 for zh:
  `src/lib/pdfFontZh.js` holds a 915KB NotoSansTC subset (all 2,727 CJK chars
  in our translations + Latin + punctuation + date/price vocabulary),
  lazy-loaded only on the zh PDF path in `printHtmlDoc`. Caveat: rare chars a
  user types into a note can render blank. Regenerate when dictionaries grow:
  extract unique CJK chars from i18n.js + both sidecars → `pyftsubset
  NotoSansTC_400Regular.ttf --text-file=chars.txt
  --unicodes="U+0020-007E,U+00A0-00FF,U+2013-2026" --layout-features=''
  --no-hinting --desubroutinize` → base64 into pdfFontZh.js. Latin-script
  languages (Spanish) need nothing.
- **Search** matches English names/fields regardless of UI language — keep it so.
