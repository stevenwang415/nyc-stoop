# NYC Stoop — how to update the app (2026-07-07)

The standing playbook for every future change. Four kinds of update, from most
to least frequent. **All commands run from the project folder** — the #1 gotcha:

```bash
cd ~/Downloads/nyc-stoop
```

---

## 1. Web code changes (UI, features, data) — the everyday loop

The app is a web build wrapped in a native shell. Xcode alone never picks up
JS changes — you must rebuild the web bundle and sync it into the shell.

```bash
# A. Develop + preview in the browser first (fast iteration, hot reload)
npm run dev            # opens http://localhost:5173

# B. When it looks right, put it on your phone:
npm run build          # fresh web bundle into dist/
npx cap sync ios       # copies dist/ into the iOS app + updates plugins
# then press ▶ in Xcode (phone connected & selected)

# One-liner for B (also opens Xcode):
npm run ios
```

**Remember: build → sync → run.** Seeing stale UI on the phone means you
skipped `npm run build` (sync copies whatever dist/ already contains).

Commit when it works:

```bash
git add -A
git commit -m "what changed"
git push
```

---

## 2. Data updates (places, moods, venues)

Data lives in `src/data/` and ships inside the bundle — so data changes follow
the same loop as #1. Standing rules before committing new places:

- **No place ships without a `description` and an `insiderTip`.** One
  opinionated line each — the voice is the product.
- **Check for duplicates** after any import (match `googlePlaceId` first;
  same name + same neighborhood second). The July 7 dedupe took 718 → 696;
  don't let it creep back.
- **Never reuse an existing `id`.** Two entries sharing an id silently
  overwrite each other in lookups.

---

## 3. Backend changes (auth, API)

The FastAPI app in `backend/` deploys separately from the iOS app — users get
backend fixes instantly, no App Store review.

```bash
# after editing backend/*.py:
git add -A && git commit -m "backend: what changed" && git push
# then redeploy on your host (or let its auto-deploy from GitHub run)
```

Notes:
- New Python dependencies go in `backend/requirements.txt`.
- Simple DB columns are added idempotently in `_bootstrap_db()` (main.py) —
  see the `apple_sub` ALTER TABLE as the pattern.
- If the bundle id ever changes, update the `APPLE_BUNDLE_IDS` env var on the
  host or Apple sign-in returns 401.

---

## 4. Shipping an update to the App Store

For changes users should get in the store app (all web changes ride along):

```bash
npm run build && npx cap sync ios && npx cap open ios
```

Then in Xcode:

1. **Bump the version** — App target → General:
   - *Version* (marketing, e.g. 1.0 → 1.1) — must increase for a new release
   - *Build* — must increase for every upload, even same version
2. Select destination **"Any iOS Device (arm64)"** (not your phone).
3. **Product → Archive**, then in the Organizer window: **Distribute App →
   App Store Connect → Upload**.
4. In [App Store Connect](https://appstoreconnect.apple.com): the build appears
   under TestFlight after ~15 min of processing. Test it, then attach it to a
   new version, write the "What's New" notes, **Submit for Review**.
5. Review typically takes 24–48 h. Enable "Automatically release" or release
   manually after approval.

TestFlight-only (no public release): stop after step 4 and add testers.

---

## 5. Native / plugin changes (rare)

Adding a Capacitor plugin or changing anything in `ios/`:

```bash
npm install <plugin-package>
npx cap sync ios        # registers the plugin with the native project
```

Some plugins also need an Xcode capability (Signing & Capabilities → "+") —
the plugin's README says so. Then it's a normal App Store update (#4), since
native code changed.

---

## Gotchas learned the hard way (July 2026)

| Symptom | Cause / fix |
|---|---|
| `npm error ENOENT package.json` | You're in `~`, not the project. `cd ~/Downloads/nyc-stoop` first. |
| Phone shows old version | Skipped `npm run build` before `cap sync`. |
| `git add` → "index.lock exists" | Crashed git process. `rm -f .git/index.lock` (safe if nothing's running). |
| Keychain password prompt in Xcode | Your **Mac login** password, not GitHub/Apple ID. |
| "No profiles / no devices" signing error | Phone not seen yet: cable + Trust This Computer + Developer Mode on, select phone in Xcode, Try Again. |
| Layout fine in browser, off on phone | Safe-area (notch/home-indicator) issue — always eyeball header + bottom nav on the real device. |
| Element blocked by status bar / misaligned near notch | Anchor with `env(safe-area-inset-*)`, not percentage centering. |

---

## The full release checklist, condensed

```bash
cd ~/Downloads/nyc-stoop
npm run dev                      # develop, check in browser
npm run build && npx cap sync ios   # onto the phone via Xcode ▶ — QA pass
git add -A && git commit -m "…" && git push
# App Store: bump version + build → Archive → Upload → TestFlight → Submit
```
