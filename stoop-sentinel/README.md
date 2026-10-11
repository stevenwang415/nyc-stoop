# Stoop Sentinel

Autonomous release-QA agent for NYC Stoop. See DESIGN.md for the full plan.

## Quick start
1. `cp .env.example .env` and add your Anthropic API key
2. `npm install`
3. `npm run day1` — M1 warm-up (works out of the box)
4. Implement the TODOs in `src/agent.js` + `src/tools.js` → `npm run agent`
5. When it works locally: add ANTHROPIC_API_KEY to GitHub repo secrets and
   push — the Action runs nightly at 21:00 NY time.

## Build order
- [x] M1 day1.js — single call, no loop (provided)
- [ ] M2 agent loop with git_log only
- [ ] M3 all 3 tools + schedule
- [ ] M4 memory, Notion, readiness %
