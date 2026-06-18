# NYC Stoop — UX review prompt

Paste the block below to have Claude run a fresh, hands-on UX/product review of the
current build. (Requires the Claude in Chrome browser tools so it can actually use
the site.)

---

Act as a sharp product designer and a real user reviewing my web app, **NYC Stoop**
(https://nyc-stoop.vercel.app). Don't review it from the outside — actually use it.

**Setup**
- It's a mobile-first app: open it in the browser tools and resize the window to a
  phone width (~390–440px) so you're reviewing the real intended layout.
- The core job: help someone in NYC decide what to do and turn it into a routed plan.

**Walk it as 2–3 personas**, and say which you're using:
- a first-time tourist with one evening,
- a returning local checking "what's on tonight,"
- someone planning a day/weekend with friends.

**Exercise every function by hand — click, type, drag, reload — and note what
actually happens** (don't assume a control works unless you tried it):
- Onboarding, then the mood flow: mood → neighborhood map → category → editorial picks.
- A venue detail (read it, save it / "Add to My Trip"), and the venue bottom sheet
  on the Tonight tab (peek → expand → "Full details" → back).
- "✨ Plan my night" one-tap entry (when/where → routed draft).
- My Trip: the auto-built itinerary, meal suggestions (choose cuisine, "show another"),
  drag-to-reorder a stop, then Save the plan and reload to check it persists.
- Tonight tab: the day selector, category filters + their counts, the live "On Sale"
  events (and that tapping one opens a sheet, not a jump to Ticketmaster), and the
  evening lineup varying by night.
- Map, Search (venues / works / "Yours"), neighborhood browse (category screening +
  the "From your list" personal layer), and Settings.

**As you go, look for** (and tie each finding to *who it hurts and how*): unclear
affordances, inconsistency between similar things, overwhelm/long flat lists, broken
or confusing navigation (lost place, dead ends), buried primary actions, low-contrast
or truncated text, anything that over-promises or looks broken (404s, broken images,
wrong counts), and redundancy. Also call out what genuinely works — be specific.

**Then give me an honest scored report**, in this shape:
1. How each persona experienced it (a few sentences each).
2. What's working — keep this.
3. Issues & friction — grouped, specific, each marked (must-fix / should-fix / polish)
   with the concrete user consequence.
4. Scorecard — a short table of the areas that matter for this app, each /10, plus overall.
5. The one thing I'd fix first — the highest-leverage change, and why.

Be direct and specific. I want the truth, not flattery — but frame every critique as
"here's the fix and why it'll help."
