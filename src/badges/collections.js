// ── Collections (spec §6) ───────────────────────────────────────────────────
// A Collection is a themed set of badges spanning tiers. Completing the set
// earns a reward treatment (plaque on the shelf — visual only for now).
// `members` are catalog ids; `coming` are announced members whose badges
// aren't in the catalog yet (AMNH + MoMA, parked in BADGES_SYSTEM.md §8) —
// shown grayed, NOT counted toward progress until they ship.
import { byId } from './catalog.js'

export const COLLECTIONS = [
  {
    id: 'museums',
    name: 'Museums',
    name_zh: '博物館',
    emoji: '🏛️',
    members: ['met', 'amnh', 'moma', 'guggenheim', 'whitney', 'brooklynmuseum'],
    coming: [],
  },
  {
    id: 'broadway',
    name: 'Broadway',
    name_zh: '百老匯',
    emoji: '🎭',
    members: ['hamilton', 'chicagoshow', 'harrypotter', 'lionking', 'wicked'],
    coming: [],
  },
  {
    id: 'steakhouse',
    name: 'Steakhouse',
    name_zh: '牛排館',
    emoji: '🥩',
    members: ['peterluger', 'gallaghers', 'keens', 'thegrill', 'fourcharles'],
    coming: [],
  },
]

/** Progress for one collection given the user's owned badge-id Set. */
export function collectionState(col, ownedSet) {
  const members = col.members.filter(id => byId[id])
  const have = members.filter(id => ownedSet.has(id)).length
  return { members, have, total: members.length, done: members.length > 0 && have === members.length }
}
