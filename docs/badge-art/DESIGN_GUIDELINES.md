# NYC Stoop — Badge Glyph Design Guidelines

*For the badge-art designer · v1 · 2026-10-01*

## The one-sentence brief

You design **only the line drawing in the center of the coin** (the "glyph") —
the app draws everything else: the metal coin, ring, arc name, bottom text,
finishes, and all states.

**Deliverable per badge: one SVG file, named `<badge-id>.svg`** (ids in the
table at the bottom), delivered into `docs/badge-art/`.

## What the app does with your file

Your line art gets **engraved** into the coin programmatically: the app draws
your paths twice (a dark recessed copy + a light highlight copy) to create a
stamped-metal look. The same file is reused everywhere — gold collected coin,
hollow "not yet collected" outline, tiny 20 px map pins, the spinning 3D coin,
share cards. That's why the rules below matter: the drawing must survive being
recolored, shrunk, and duplicated.

## Canvas & layout

- Artboard/frame: **100 × 100** (export viewBox `0 0 100 100`).
- Center your composition at **(50, 44)** — slightly above center, because the
  coin reserves the lower area for text.
- Keep all art inside a **circle of radius 30** around that point (see
  `templates/glyph-design-guide.svg` — use it as a locked background layer).
- Draw at a scale that reads when the whole canvas is shrunk to **24 px wide**.
  Squint test: if two lines merge when you zoom way out, simplify.

## Line rules (the important part)

- **Strokes only. No fills. No shapes with fill colors.** The engraving effect
  only works on stroked paths.
- Stroke width **5–7** units (on the 100-unit canvas). Use ONE width per
  glyph if possible; two max (e.g. 6 for the main form, 5 for interior lines).
- **Round caps and round joins.**
- Any color is fine (it gets replaced) — but use a single color so you can see
  the drawing clearly; black on white is ideal while working.
- No gradients, no shadows, no blurs, no masks, no clipping, no images, no
  text objects (if lettering is part of the drawing, outline it into paths —
  but prefer no lettering at all).
- Aim for **one continuous impression**: 3–10 paths, not 50 fragments.
- Detail budget: think "coin engraving", not "illustration". 10–25 meaningful
  lines. The Guggenheim = its spiral bands + base, not every window.

## What NOT to include

- ❌ The coin circle, ring, or any border
- ❌ Badge name, "STOOP NYC", numbers (01/26), or any text — the app renders
  the name arc and bottom line itself
- ❌ Metallic/holographic effects, textures, lighting — finishes come from the
  app (brass = gold, nickel = silver, copper, iris = holographic violet)
- ❌ Backgrounds of any kind

## Figma export checklist

1. Put the glyph on its own 100×100 frame, art centered at (50, 44).
2. Confirm every layer is a **stroke** (Inspect panel: no Fill entries).
3. Select the frame → Export → **SVG**.
   - "Outline text" irrelevant (no text, right?).
   - Do NOT "flatten" or "outline stroke" — keep strokes as strokes.
4. Rename the file to the badge id, e.g. `guggenheim.svg`.
5. Deliver. Engineering runs one command and it appears in the app.

## How it will be judged (QA checklist)

- [ ] viewBox is `0 0 100 100`
- [ ] stroke-only, width 5–7, round caps/joins
- [ ] art inside the r30 circle centered (50, 44)
- [ ] recognizable at 24 px
- [ ] no text, border, or effects
- [ ] file named exactly as the badge id below

## 設計重點（中文摘要）

只畫**中間的線稿圖案**：100×100 畫布、置中於 (50, 44)、全部內容收在半徑
30 的圓內。**只用描邊（stroke），不可填色（fill）**，線寬 5–7、圓頭圓角。
不要畫硬幣外框、文字、編號或金屬效果 — 這些 App 會自動生成。縮到 24px
仍要能辨識。輸出 SVG，檔名用下表的 badge id。

## Badge ids & finishes (file naming)

| File name | Badge | Finish |
|---|---|---|
| empire.svg | Empire State Building | brass |
| centralpark.svg | Central Park | brass |
| flatiron.svg | Flatiron Building | brass |
| rockefeller.svg | Rockefeller Center | brass |
| radiocity.svg | Radio City Music Hall | brass |
| yankee.svg | Yankee Stadium | brass |
| libertystatue.svg | Statue of Liberty | brass |
| met.svg | The Met | brass |
| brooklynbridge.svg | Brooklyn Bridge | brass |
| stpatricks.svg | St. Patrick's Cathedral | brass |
| grandcentral.svg | Grand Central Terminal | brass |
| wallstreet.svg | Wall Street | brass |
| dumbo.svg | Dumbo | brass |
| chinatown.svg | Chinatown | brass |
| timessquare.svg | Times Square | nickel |
| washsq.svg | Washington Square Arch | nickel |
| bryantpark.svg | Bryant Park | nickel |
| whitney.svg | Whitney Museum | nickel |
| guggenheim.svg | Guggenheim | nickel |
| lincolncenter.svg | Lincoln Center | nickel |
| chrysler.svg | Chrysler Building | nickel |
| wtc.svg | World Trade Center | nickel |
| littleisland.svg | Little Island | nickel |
| coneyisland.svg | Coney Island | nickel |
| brooklynmuseum.svg | Brooklyn Museum | nickel |
| apollo.svg | Apollo Theater | nickel |
| katz.svg | Katz's Delicatessen | copper |
| rocktree.svg | Rockefeller Center Tree | iris |
| wollmanrink.svg | Wollman Rink | iris |
| wintervillage.svg | Bryant Park Winter Village | iris |
| halloween.svg | Village Halloween Parade | iris |
| thanksgiving.svg | Macy's Thanksgiving Parade | iris |
| cherryblossom.svg | Brooklyn Botanic Cherry Blossoms | iris |
| shakespeare.svg | Shakespeare in the Park | iris |
| marathon.svg | NYC Marathon | iris |
| usopen.svg | US Open | iris |
| pride.svg | Pride March | iris |
| dykerlights.svg | Dyker Heights Christmas Lights | iris |

*Reference files in `templates/`: blank coins in all four finishes (for
context, as background layers) and `glyph-design-guide.svg` (the canvas with
the safe-area circle marked).*
