// ── M2/M3: the agent loop (YOURS to write) ──────────────────────────────────
// The ~25 lines below the TODOs are the entire concept. Everything you
// learned in day1.js applies; the only new ideas are:
//   (a) pass `tools: toolSchemas` to the API
//   (b) when stop_reason === 'tool_use', execute and loop
//
// Message flow per turn (the part people find fiddly — follow it exactly):
//   messages.push({ role: 'assistant', content: reply.content })
//   messages.push({ role: 'user', content: [{
//     type: 'tool_result', tool_use_id: block.id, content: resultString }] })
import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk'
import { writeFileSync } from 'node:fs'
import { toolSchemas, runTool } from './tools.js'
import { SYSTEM } from './prompt.js'

const client = new Anthropic()
const MODEL = 'claude-sonnet-4-5'
const MAX_TURNS = 8 // safety: never loop forever

async function main() {
  const messages = [{ role: 'user', content: 'Run your nightly assessment of NYC Stoop.' }]

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    // TODO(Steven) 1: call client.messages.create with
    //   { model: MODEL, max_tokens: 1500, system: SYSTEM, messages, tools: toolSchemas }
    // TODO(Steven) 2: if reply.stop_reason !== 'tool_use':
    //   the report is reply.content.find(c => c.type === 'text').text
    //   → writeFileSync('report.md', report), console.log(report), return
    // TODO(Steven) 3: otherwise, for the tool_use block in reply.content:
    //   console.log(`[tool] ${block.name}`, block.input)   // watch it think!
    //   const result = await runTool(block.name, block.input)
    //   push the two messages exactly as shown in the header comment
  }
  console.error('hit MAX_TURNS without a report — check the loop')
}

main()
