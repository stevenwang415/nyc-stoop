// ── M1: the no-loop warm-up (COMPLETE — run this first) ─────────────────────
// One API call: paste today's git log into a prompt, get a summary back.
// Purpose: learn the API shape before touching the agent loop.
//   cp .env.example .env   (add your key)
//   npm install && npm run day1
import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk'
import { execSync } from 'node:child_process'

const client = new Anthropic() // reads ANTHROPIC_API_KEY from env

const log = execSync('git log --since=midnight --oneline --stat', {
  cwd: new URL('../..', import.meta.url).pathname, // the nyc-stoop repo
  encoding: 'utf8',
}) || '(no commits today)'

const msg = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 500,
  system: 'You are Stoop Sentinel, release-QA assistant for the NYC Stoop iOS app. Be concise.',
  messages: [{ role: 'user', content: `Summarize today's development activity in <=5 bullet lines:\n\n${log}` }],
})

console.log(msg.content[0].text)
