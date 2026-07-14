# APP STORE READINESS REVIEW — 2026-07-14 (strict; reviewer's lens)

Two evaluations in one: the standing rubric (Review rules.md), then a
guideline-by-guideline audit the way an App Review contractor would run it.
The second one found a certain rejection and it has been fixed **today**.

## Part 1 — Rubric scores (unchanged, deliberately)

| Dimension | Maya | Tom & Rachel |
|---|---|---|
| Overall | **9.5** | **9.6** |

No movement from this morning's review and that IS the strict call: everything
shipped since (in-app feedback, account deletion, Bronx coverage, art
thumbnails, show-card redesign, crash fixes) is either compliance work,
content, or repair — the personas' journeys scored this morning are the same
journeys tonight. Numbers move on behavior, not effort.

## Part 2 — Apple guideline audit

| Guideline | Status | Finding |
|---|---|---|
| **5.1.1(v) Account deletion** | 🟢 **FIXED TODAY — was a certain rejection** | The app offers account creation but had NO in-app deletion. Added: `DELETE /auth/me` (hard-deletes the user row + reset tokens) and a Settings → Delete account row with two-tap confirm. Local trip data deliberately survives. **Must deploy the backend BEFORE archiving the build.** |
| 4.8 Sign in with Apple | 🟢 Pass | Third-party login (Google) present → Apple sign-in required: implemented, native, listed above Google. |
| 5.1.1 Permissions & gating | 🟢 Pass | Location has a purpose string and the app never demands it; every core feature works signed-out; sign-in only gates sync. |
| 2.1 Completeness (crashes) | 🟡 Pass w/ caution | The theater-topic crash (`isSaved`) would have been FOUND BY A REVIEWER tapping Musicals — fixed + full no-undef sweep says the class is extinct. Caution: three new surfaces (trip mini-map, rotation, scroll-snap) have never run on hardware. The device pass is the remaining gate. |
| 2.1 Placeholder content | 🟡 Low risk | Queens still shows "Coming soon" (the Bronx went live today). One teaser section in an otherwise deep app is normally fine; the Suggest-a-place CTA makes it read intentional. Do NOT ship more than one. |
| 4.2 Minimum functionality (web-wrapper) | 🟡 Medium risk, mitigated | Capacitor apps get 4.2 flags when they feel like websites. Mitigations in place: native Apple/Google sign-in, geolocation, app-like navigation, no browser chrome, offline-tolerant UI. If rejected: respond citing curated dataset + native auth + routing engine (plan already in PUBLISH_IOS.md — this passes on appeal regularly). |
| 2.3 Accurate metadata | 🟡 Action | Screenshots were shot 07-08; My Trip has since gained route numbers, the mini-map, and budgets. Still truthful, but regenerate `appstore-03-mytrip` if time allows — the new tab is also simply a better selling shot. |
| 5.1.2 / ATT | 🟢 Pass | No tracking, no ads, no third-party analytics. Nutrition labels: email+name (linked), coarse location (not linked), user ID. |
| 3.1.1 Payments | 🟢 Pass | v1 is fully free; no IAP surface. ($3.99 unlock is v1.2's problem — with Restore Purchases when it comes.) |
| 1.2 UGC | 🟢 N/A | Feedback is a private message to the developer, not user-generated content displayed to others. (Share/v1.1 will trigger the full UGC checklist — spec already covers it.) |
| Export compliance | 🟢 Pass | `ITSAppUsesNonExemptEncryption=false` in the plist. |
| Review account | 🔴 To do | Create a working demo account ON PROD and paste credentials into App Review notes. Reviewers reject fast when the listed login fails. |
| 5.2 IP (defensive) | 🟡 Note | MTA license application sent (free-app tier); subway bullets stay. Commons CC BY-SA images: attribution currently lives on the Commons file pages, not in-app — legally thin. Post-launch: an "Image credits" row in Settings closes it. Fair-use images: purged. Google photos: attribution shown ✓. |
| Launch/UI basics | 🟢 Pass | LaunchScreen storyboard (cream), icon 1024, portrait-only, iPhone-only, safe-areas handled. |

## Part 3 — The verdict

**Approvable — after three mechanical steps.** Nothing in the app's content or
concept is a rejection risk; the risks are operational:

1. **Deploy the backend now** (`git push`, verify `/feedback` and account
   deletion on prod) — archiving an app whose Delete Account button 404s IS
   the 5.1.1(v) rejection you just fixed.
2. **Demo account on prod** → App Review notes, with one line: "Free curated
   NYC guide; no payments; location optional; delete account under Settings →
   account card."
3. **Device pass** (the standing M-2): fresh install → three sign-ins → delete
   a throwaway account → mood flows → theater topics → My Trip with map →
   Eat toggle → Map rotation. One hour, retires every 2.1 scenario a reviewer
   can hit.

Optional but smart: regenerate the My Trip screenshot; note the legend/pill
overlap (S-1) is cosmetic and not review-relevant — fix it in the same pass if
time allows.

## Bottom line

This morning the app was a 9.5/9.6 product with a hidden guaranteed rejection
in it. Tonight it's the same product without one. Deploy, demo account, device
pass — then Archive with a clear conscience.
