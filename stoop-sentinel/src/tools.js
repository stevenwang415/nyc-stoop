// ── The agent's hands: 3 tools ──────────────────────────────────────────────
// git_log is COMPLETE as the worked example. run_tests and check_prod are
// yours (TODO) — follow the same shape: a schema Claude sees, and a run()
// your loop executes. Rule from DESIGN.md §3: each tool does ONE fixed
// thing; never pass model text into a shell.
import { execSync } from 'node:child_process'

const REPO = new URL('../..', import.meta.url).pathname // the nyc-stoop repo
const PROD = 'https://nyc-stoop.vercel.app'
// check_prod may only touch these paths (GET, no auth, safe):
const PROD_WHITELIST = ['/', '/share/place-search?q=park']

export const tools = [
  {
    schema: {
      name: 'git_log',
      description: "Today's commits in the NYC Stoop repo (message + files changed). Returns '(no commits today)' when quiet.",
      input_schema: { type: 'object', properties: {} },
    },
    run: async () => {
      try {
        return execSync('git log --since=midnight --oneline --stat', { cwd: REPO, encoding: 'utf8' })
          || '(no commits today)'
      } catch (e) { return 'git_log failed: ' + e.message }
    },
  },
  {
    schema: {
      name: 'run_tests',
      description: 'Run the badge e2e suite (scripts/testBadges.mjs). Slow (~2 min). Returns the last 40 lines of output and the exit code. Use when commits touched src/ or backend/.',
      input_schema: { type: 'object', properties: {} },
    },
    run: async () => {
      // TODO(Steven): execSync('node scripts/testBadges.mjs', ...) with
      //   cwd: REPO, timeout: 10 * 60 * 1000, encoding: 'utf8'.
      // execSync THROWS on non-zero exit — catch it; e.stdout still holds
      // the output. Return: last 40 lines + '\nexit: 0' (or the code).
      // Hint: out.split('\n').slice(-40).join('\n')
      return 'TODO: not implemented yet'
    },
  },
  {
    schema: {
      name: 'check_prod',
      description: `GET a production endpoint and report reachability. Allowed paths: ${PROD_WHITELIST.join(' , ')}`,
      input_schema: {
        type: 'object',
        properties: { path: { type: 'string', description: 'One of the allowed paths' } },
        required: ['path'],
      },
    },
    run: async ({ path }) => {
      // TODO(Steven):
      // 1. if (!PROD_WHITELIST.includes(path)) return 'refused: path not allowed'
      //    (the model is not trusted — enforce the whitelist HERE, in code)
      // 2. const r = await fetch(PROD + path)  — wrap in try/catch
      // 3. return `${r.status} ${r.statusText} · ` + (await r.text()).slice(0, 200)
      return 'TODO: not implemented yet'
    },
  },
]

export const toolSchemas = tools.map(t => t.schema)
export const runTool = (name, input) => {
  const t = tools.find(t => t.schema.name === name)
  return t ? t.run(input ?? {}) : Promise.resolve(`unknown tool: ${name}`)
}
