# NYC Stoop — Share v2.0 review (2026-08-25)

**Build state:** Share as fifth nav tab (Explore · Events · Map · Trips · Share),
after the day's sprint: My Stoop profile (grid ⇄ photo-pin map), friend codes,
From friends category browse, any-place pins (dataset / Nominatim search / EXIF /
device location), photo label+location editing, comments, notifications bell
(15s poll, replaces the header weather chip), avatar sync, Trips merge.
**Method:** Review-rules rubric — both standing personas walked through the new
surface; everything below was verified in code or on-device during today's
session (several issues were *literally hit by the developer testing* — those
are flagged 👁 as the strongest kind of evidence). Severity: 🚨 blocker /
⚠️ major / 🔧 minor.

This is the FIRST review of Share — no prior score to delta against. Instead:
the question is whether Share moves each persona's *overall* app score, and
what must land before it does.

---

## 1. What Share is judged against

The yardstick (§0 of the rules) is "help someone decide what to do, and turn it
into a routed plan." Share earns its nav slot only if friends' photos become
*decision fuel* — a recommendation engine made of people you trust — not a
photo dump. The pin → 📍 directions gesture is the whole thesis in one tap:
see a friend's photo → go there.

## 2. Maya — the local (Williamsburg, 6 years)

**Scenario: her crew adopts it.** Two friends trade codes at dinner (code
exchange takes ~15 seconds standing together — faster than an Instagram follow
round-trip, and she notices no stranger can ever find her: that's a feature for
her, not a limitation). Over a month, her map fills with the group's actual
spots. The **☕ Cafe chip on From friends is her killer view** — "where do my
people really get coffee" is un-Googleable and exactly the "not a tourist"
value she demands. Comments give the photos a group-chat warmth without
follower-count performance anxiety. The bell gives her a reason to reopen the
app on ordinary weeks — the first feature that does. **Directionally, Share
raises her ceiling more than anything since Tonight**, because it's the first
surface where the app knows something Google can't.

**What she hits, in order:**
- 🚨 **Cold start is a dead tab.** Zero friends → Friends (0), From friends
  empty, and My Stoop is a lonely grid. Nothing in the tab tells her the ONE
  action that fixes it (trade a code with someone at this table). *Fix:* an
  empty-state card on the tab's landing view — "Share your code with one
  friend and this page comes alive" + big code + Copy. Cheap, and it's the
  difference between a tab she tries twice and a tab she abandons once.
- ⚠️ 👁 **Raw-email display names.** Her friend shows as
  `stevenwang.nycstoop+applereview` — observed on-device today. Locals will
  screenshot-mock this. *Fix:* on first Share open with no display_name, a
  one-field "What should friends call you?" prompt. One input, huge trust win.
- ⚠️ 👁 **Search result ambiguity.** The developer himself picked the
  *neighborhood* "Lincoln Square" over the *cinema* — the exact trap every
  user will fall into. The detail line helps but doesn't prevent it. *Fix:*
  rank POI results above admin areas (Nominatim returns `type`/`class` —
  deprioritize `boundary`/`administrative`), and prefix rows with a type word
  ("Cinema ·", "Neighborhood ·").
- 🔧 **Her own Stoop map is Manhattan-biased** only insofar as the search
  viewbox covers all five boroughs — verified it does (BK/Queens included).
  No action needed; noting because Maya checks.

**Verdict (Maya):** the feature is *for her* — but only after friend #1.
Everything rides on the cold-start fix and the launch story (trip groups,
Thanks-page founders).

## 3. Tom & Rachel — the visitors (first NYC trip, 4 days)

**Scenario A: receiving.** Their NYC friend (one code exchange at brunch) is
now a *browsable local* — her Stoop map IS the "ask a local" they wanted,
better than any listicle. Tap her ramen photo → pill → 📍 → Apple Maps. The
loop from "friend loved this" to "we're walking there" is three taps.
**This is the strongest single moment Share offers travelers.**
- ⚠️ **The loop stops one tap short of the app's core job.** From a friend's
  photo there's directions — but no "+ Add to Planner." The app's whole
  yardstick is *turn it into a routed plan*, and Share doesn't feed the
  Planner yet. *Fix (high-leverage, small):* when a photo is anchored to a
  dataset place, add "＋ Add to Planner" beside 📍 in the pill/viewer. For
  search-pinned places, offer "Save as a place." This single bridge makes
  Share a discovery engine for the planner instead of a parallel world.

**Scenario B: contributing.** They post as they go — the Spider-Man shot at
the AMC 👁 (today's real test) now pins exactly, EXIF pins cover the
photos-from-the-day case, captions answer "what should we order?" Their
friends back home… aren't on the app. Which exposes the honest truth:
- ⚠️ **For travelers, Share's payoff is deferred until trip albums (2.1).**
  The plan → go → album loop is the reason a *traveler* keeps posting; without
  it their photos are a nice map with no narrative. The centerpiece is
  correctly specced but absent. Score accordingly; don't oversell Share to
  this persona at launch.
- 🚨 **(pre-store, already on the punch list)** In-app-camera photos have no
  EXIF, and the native build skips the device-location fallback — a traveler
  shooting *from inside the app* gets un-pinned photos. Must add the
  Capacitor-geolocation path before submission.
- 🔧 In-app-only notifications are fine for them (they're in the app all trip).

**Verdict (Tom & Rachel):** as *consumers* of a local friend's Stoop — 
delighted, it's the app's promise ("a local friend's voice") made literal. As
*contributors* — wait for albums.

## 4. Structural pass (persona-independent)

- ✅ Access control verified: every read path (photos, images, comments,
  notifications) checks owner-or-accepted-friend; blocked-redeem returns an
  indistinguishable 404. This is the part Apple and users never see and must
  never fail — it's solid.
- ✅ Privacy posture is coherent and *better than Instagram's default*: EXIF
  stripped from every uploaded image; location is a separate, visible,
  removable field. Say this in the App Store notes — it's a selling point.
- ⚠️ **Comments lack a report flow** (photos have one; comments only have
  owner/author delete). Apple's UGC bar will want parity. Already flagged for
  Batch 5 — do not submit without it.
- ⚠️ **Base64 photos in Postgres** — fine for the friends beta, but the blob
  swap (Batch 2) must precede any real invite wave; migrating real users'
  photos later is the expensive version of the same work.
- 🔧 Trips merge: segments verified working, bridges intact, saved plans
  remain the landing view (July's lesson honored). Watch for one release of
  "where did Planner go" feedback; the segment labels answer it.
- 🔧 The bell replaced the weather chip — right call (the greeting line still
  carries weather), but watch whether users miss the temperature at a glance.

## 5. Score movement

| Persona | Before Share | With Share (as-built) | With cold-start fix + Planner bridge + albums |
|---|---|---|---|
| Maya (local) | the app's ceiling number | **+0.5 now** (bell habit loop, From friends) — *contingent on friend #1* | **+1.5 potential** — the first un-Googleable surface |
| Tom & Rachel | near top of scale | **+0.5 as consumers** of a local's Stoop; ~0 as contributors | **+1 potential** when albums close the plan→go→album loop |

The asymmetry is the finding: **Share as shipped is a residents' feature that
travelers can consume.** That's the right launch order — Maya was always the
higher-leverage persona — but the traveler payoff (albums, Planner bridge) is
where the second point lives.

## 6. Ship gates (ordered)

1. 🚨 Cold-start empty state on the Share tab (one card, one code, one line).
2. ⚠️ Display-name prompt on first Share open.
3. ⚠️ "＋ Add to Planner" from friend photos (dataset-anchored ones first).
4. 🚨 Native camera location path (Capacitor geolocation in compose).
5. ⚠️ Comment reporting + terms language (Batch 5, already tracked).
6. 🔧 POI-over-neighborhood ranking in place search.
