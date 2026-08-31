# NYC Stoop — Share v2.0 review, v2 (2026-08-25, evening)

**Delta review** against `REVIEW_SHARE_2026-08-25.md` (same day, morning). Five
of six ship gates closed in one session; this file scores the movement and
what remains. Verification level marked per item: ✅ device-verified today /
🔬 code-verified, awaits device / ⏳ awaits native build.

---

## 1. Gate-by-gate

1. **Cold start — CLOSED, and better than the asked-for fix.** ✅
   The morning review asked for an empty-state card. What shipped is the
   stronger move: an **official seed friend** — every first Share visit
   auto-friends the NYC Stoop account (ordinary users row, env-flagged,
   ✦ Official badge, one-shot seeding so unfriending is respected). Steven
   created the account, posted three curated photos (Don Angie, Nom Wah,
   a matcha bar — food-caption format on display), and verified a brand-new
   account receives friend + content + pins. This is Corner's content-first
   cold start smuggled through the friends-only model. A new user's first
   ten seconds now contain: a friend, a living From friends feed, and a map
   with tappable pins. **The 🚨 dead-tab blocker is gone.**
   - Found + fixed during verification: a first-open race (friends/feed
     queried before the seeding call landed) showed the empty tab exactly
     once — on the first-impression open. Load order now forces seeding
     first. 👁 caught live by the developer as a new user.
   - Remaining 🔧: the morning's "start your map" first-photo framing on an
     empty own-grid is still worth a line of copy; and prod needs the
     4-step checklist (account, name/avatar, ~12 photos, env var) before
     push — documented in the spec.

2. **Display name — CLOSED.** ✅ Pen icon beside the name on My Stoop →
   inline edit → server + local cache + all friend surfaces update. The
   `stevenwang.nycstoop+applereview` embarrassment is now user-fixable.
   🔧 remaining: nothing *prompts* a new user to set it — consider folding a
   "What should friends call you?" line into the first-open experience later.

3. **Planner bridge — CLOSED.** 🔬 "＋ Add to Planner" in the photo viewer:
   dataset-anchored photos carry the full seed record; search/EXIF-pinned
   photos come in as name+coords; dedup-by-name with re-select semantics
   matching every other add button. Code-verified; not yet walked on device.
   This was the review's highest-leverage traveler fix — friend photo →
   routed stop in three taps. *Cost of the day:* inserting the listener above
   the state it read crashed the app at mount (TDZ) — caught by Steven,
   fixed, and a render-order check now guards it. Logged honestly: build
   success ≠ runtime success.

4. **Native camera location — CLOSED in code.** ⏳ Compose's device-location
   fallback now takes the Capacitor Geolocation path on native (proper
   permission prompt, no EXIF needed for in-app camera shots). Cannot be
   verified until the next Xcode build — keep on the pre-submission
   checklist, do not consider done-done.

5. **Comment reporting — CLOSED.** ✅ ⚑ on non-own comments, confirm dialog,
   2 reports auto-hide (status filter verified in list path), parity with the
   photo rule. Terms/App Privacy language still owed in Batch 5.

6. **POI-over-neighborhood search ranking — OPEN.** The one 👁-observed trap
   left standing (developer himself picked the "Lincoln Square" neighborhood
   over the cinema). Small fix, real payoff; recommend before submission.

## 2. Persona re-walk (compressed)

- **Maya (local):** her blocker died. First open now demonstrates the app's
  taste (official photos ARE the pitch) and the code card is one tab away.
  The bell + From friends loop stands. Morning's "+0.5 contingent on friend
  #1" is now **+1 uncontingent** — the official account *is* friend #1.
- **Tom & Rachel (visitors):** the Planner bridge closes their loop on paper
  (friend photo → plan stop); albums remain the 2.1 payoff. As consumers:
  meaningfully better — a first-trip user with zero NYC friends still gets a
  curated local's Stoop to browse. **+0.5 → +0.75.**

| Persona | Morning | Now | Still on the table |
|---|---|---|---|
| Maya | +0.5 contingent | **+1.0** | search ranking 🔧, name prompt 🔧 |
| Tom & Rachel | +0.5 consume-only | **+0.75** | trip albums (2.1) — the point |

## 3. Ship gates, updated

- ⏳ Verify gate 4 on the next native build (permission prompt + pin).
- ⚠️ Batch 5 unchanged: comment/UGC terms language, App Privacy, demo
  account for review (pre-load it with the official friend — the reviewer
  then sees the whole social surface solo).
- 🔧 Gate 6 (POI ranking) — recommended pre-submission.
- 🚨 Sequence guard unchanged: blob swap (Batch 2) before any real invites.

**Bottom line:** the morning review called Share "a residents' feature
travelers can consume." Tonight it's that *plus a first impression* — the
seed account converts the empty tab from the feature's weakest screen into
its best pitch. What stands between this and submission is verification, not
construction: a native build check, the compliance pass, and the push.
