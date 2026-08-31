# NYC Stoop — Figma redesign review (2026-08-26)

**Build state:** the full handoff applied in one day — foundation (Bricolage
Grotesque + Instrument Sans bundled locally, "Stoop" token palette with the
MEASURED a11y values, amber/vermilion semantics), Explore reskin, Events
(+search, LIVE pill), **Map structurally rebuilt** (floating search, places
sheet, clustering, selected-pin card), Trips list + detail (Figma 15/16),
You tab (renamed from Share, "Your Stoop" copy), Figma onboarding trio.
Friends-beta distribution live via Cloudflare tunnel to the dev server.
**Method:** review-rules rubric; delta from `REVIEW_SHARE_2026-08-25_v2.md`.
Behavior-grounded: 👁 marks issues found live on Steven's device today.
Severity 🚨 / ⚠️ / 🔧.

---

## 1. What actually shipped (verification level)

| Area | State |
|---|---|
| Tokens/fonts everywhere | ✅ device-seen (Steven: "looks good") |
| Events search + amber/LIVE | ✅ device-seen; search was a NEW capability, not a reskin |
| Map rebuild | ✅ device-tested hard — 4 👁 issues found & fixed same-session (legend/sheet collision, no drag, attribution over rows, list ignoring map position) |
| Trips 15 (cards) + 16 (numbered timeline, Start trip) | ✅ built, "so far so good" on 15; 16 confirmed built, lightly walked |
| You rename + Your Stoop | ✅ built; spec updated |
| Onboarding trio | 🔬 built; needs a private-tab device walk |
| zh coverage of every new string | ✅ audited programmatically — 0 missing keys |
| Dark mode, real imagery, screen 17, time-sliced feed | ❌ deliberately out (recorded) |

## 2. Persona re-walk (compressed)

**Maya (local).** The Map rebuild is her biggest win since Share: "search
this map," a nearest-first list that follows wherever she pans 👁-fixed, and
clusters instead of 150-pin confetti — the map finally answers "I'm here,
what's around?" Events search closes a long-standing gap (she could never
look up a venue's shows before). The amber/vermilion split means red now
reliably means "tap me" — subtle, but it retrains the eye within a session.
**+0.5 on top of yesterday's +1.0.**

**Tom & Rachel (visitors).** Trips 15/16 is their moment: the trip card
sells the trip (route line, date, tiles), and the numbered timeline with
arrival times turns "a list of places" into "a day we can actually run" —
the times come from the real routing simulation, so they're defensible.
Start trip → Maps is the go-moment. Onboarding's interests + location asks
now look like a real app's first minute. **+0.5.**

## 3. Findings

1. 🚨 **Process risk, not product: App.jsx splice fragility.** Two blank-
   screen crashes in one day (TDZ listener; onboarding splice swallowing
   `APP_VERSION`/`FEEDBACK_EMAIL`/`PROFILE_GLOBAL_KEYS` 👁 — Settings died).
   Both caught by Steven, not by builds. Mitigation now in place (defined-
   vs-referenced identifier check after structural edits), but the honest
   fix is the **full-app device pass** below before any push — the token
   sweep touched literally every screen.
2. ⚠️ **Onboarding makes a promise the app doesn't keep yet.** "Pick a few —
   we'll lead with these" stores `nyc_interests` but nothing reads it.
   *Fix (pick one before push):* (a) 30-min wire-up — Events category
   defaults to a picked interest; Explore orders Browse-by topics by them;
   or (b) soften the copy to "so we know what you're into." Shipping an
   unkept promise is worse than either.
3. ⚠️ **Deep screens are tokened, not redesigned.** VenueScreen, mood flows,
   Planner build view inherited fonts/colors but keep old layouts. This is
   the accepted scope — but walk 2–3 deep pages on device to confirm the
   inheritance didn't break contrast or spacing anywhere (the sweep changed
   ~150 hardcoded values).
4. ⚠️ **Old teaching lost.** The replaced onboarding taught save→build→
   generate; the Figma trio doesn't. Tab tutorials still cover it in
   context — verify they still fire for new users (shared flag `nyc_tut_*`
   unaffected, but confirm on a fresh profile).
5. 🔧 **Map polish list:** ⭐ user-location marker clashes with the new pin
   language (make it a vermilion ring-dot); cluster→sheet count can disagree
   at a glance (sheet caps at 60 — label "Nearest 60" if it bothers);
   warm-tint filter should be eyeballed in sunlight.
6. 🔧 **Bricolage at small sizes** — the 15.5px sheet rows and 17px card
   titles are the smallest display-face uses; if they shimmer on device,
   the fix is Instrument Sans below 16px.
7. ✅ **Tunnel beta stands up the right test:** friends share ONE mock DB
   (they can friend each other for real), data inspectable, wipeable.
   Constraint honestly understood: laptop awake, URL rotates, email auth.

## 4. Score movement

| Persona | 08-25 evening | Now | Left on the table |
|---|---|---|---|
| Maya | +1.0 | **+1.5** | interests wiring, dark mode |
| Tom & Rachel | +0.75 | **+1.25** | trip albums (2.1) still the big one |

## 5. Gates before the push (ordered)

1. 🚨 Full-app device pass, one sitting: all 5 tabs → Settings (crashed
   today — retest every row) → onboarding in a private tab → 2–3 deep pages
   → a Planner build→save→reopen loop → Share compose/comment/bell.
2. ⚠️ Decide the interests question (wire or soften) — 30 min either way.
3. 🔧 Map polish trio, if the device pass agrees.
4. Then PREFLIGHT_v2.0.md unchanged: push → prod e2e → official account →
   blob swap → TestFlight (native gates: camera location prompt, cap sync).

**Bottom line:** yesterday ended "verification, not construction." Today
added a full visual identity and the app's best structural screen (Map) —
and two self-inflicted crashes that argue the verification pass is now
*mandatory*, not optional. One disciplined hour on the device, one small
decision on interests, and this is the strongest build the app has ever had.
