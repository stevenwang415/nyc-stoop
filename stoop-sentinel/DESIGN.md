# Stoop Sentinel — design doc

An autonomous release-QA agent for NYC Stoop. Runs nightly, figures out what
changed, verifies the app still works, and writes Steven a status report.

**Author: Steven Wang.** Claude scaffolded the structure and reviews the code;
Steven implements the agent loop and tools. (That split is the point — this
is a learning + resume project.)

## 1. The job

One question, answered every evening at 21:00:

> "What happened in NYC Stoop today, and is anything broken?"

The agent decides for itself which checks to run based on what it finds —
that decision-making is what makes it an agent rather than a cron script.

## 2. Architecture

```
GitHub Action (nightly cron)
        │
        ▼
  src/agent.js ──────────────── the agent loop (Steven writes this)
        │   ▲
   toolـcall │ tool_result
        ▼   │
  src/tools.js ──────────────── 3 tools (v1):
        git_log      — today's commits in the nyc-stoop repo
        run_tests    — node scripts/testBadges.mjs, returns tail of output
        check_prod   — GET a whitelisted prod endpoint, returns status code
        │
        ▼
  report.md → printed / emailed / (v2: Notion)
```

The loop, in words: send Claude the goal + tool menu → if Claude replies with
a `tool_use` block, execute that tool and append a `tool_result` message →
repeat until Claude replies with plain text → that text is the report.

## 3. Tool contracts

| Tool | Input | Output (string) | Safety |
|---|---|---|---|
| git_log | none | `git log --since=midnight --oneline --stat` in ../ | read-only |
| run_tests | none | last 40 lines of testBadges.mjs output + exit code | runs only the known script, 10-min timeout |
| check_prod | `{ path }` | HTTP status + first 200 chars of body | GET only, whitelist: /share/health-ish paths on nyc-stoop.vercel.app only |

Rule: tools never take free-form shell commands from the model. Each tool
does ONE fixed thing; the model only chooses WHICH and (for check_prod)
which whitelisted path.

## 4. System prompt (sketch — refine in src/prompt.js)

- You are Stoop Sentinel, release-QA agent for NYC Stoop (solo-dev iOS app).
- Goal: assess today's state; use tools as needed, not mechanically.
- If no commits today: light run (prod check only), say so.
- If commits touch backend/: always check prod. If src/badges: always run tests.
- Report format: 3 sections — What changed / Verification results / Flags.
  Max ~15 lines. Flag anything that could block the v3.0 release.

## 5. Milestones

- **M1 (day 1):** `src/day1.js` — single API call, git log pasted in, get a
  summary back. No loop. (Already runnable — this one is provided complete
  as the worked example.)
- **M2 (day 2):** agent loop in `src/agent.js` with git_log only.
- **M3 (day 3):** all 3 tools + prompt polish + GitHub Action schedule.
- **M4 (later):** memory file (compare vs yesterday), Notion update tool,
  Slack/email delivery, "release readiness %" against BADGES_SYSTEM.md §9.

## 6. Resume bullet (target)

> Built an autonomous release-QA agent (Claude tool-use loop, N custom
> tools) that reviews daily commits, runs an e2e suite, audits production
> endpoints, and reports launch readiness for a shipped iOS app.

## 7. Costs & safety

- Model: claude-sonnet (cheap, plenty for this). ~1 run/day ≈ cents/month.
- API key lives in .env locally and in GitHub Actions secrets — never in code.
- All tools read-only against the world; nothing deploys or mutates.
