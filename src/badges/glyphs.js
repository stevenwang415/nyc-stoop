// ── Badge glyphs ────────────────────────────────────────────────────────────
// Stroke-only paths on the medallion's 100-unit canvas, centered near (0,-6)
// in the glyph group's local coordinates (the renderer translates to 50,56).
// Real designer art replaces these one by one (SVG spec in the v3 PDF §8);
// anything without a custom glyph falls back to a per-finish placeholder.

export const GLYPHS = {
  // hand-made
  empire: 'M0 8 V-20 M0 -20 L0 -27 M-7 8 V-8 M7 8 V-8 M-12 8 H12 M-3.5 -8 H3.5',
  centralpark: 'M0 -18 A 9 9 0 1 1 -0.01 -18 M0 -2 V8 M-10 8 H10',
  flatiron: 'M-8 8 L0 -22 L8 8 Z M0 -22 V8 M-12 8 H12',
  washsq: 'M-11 8 V-8 A 11 11 0 0 1 11 -8 V8 M-5 8 V-6 A 5 5 0 0 1 5 -6 V8 M-15 8 H15 M-13 -14 H13',
  katz: 'M-13 -2 A 13 8 0 0 1 13 -2 M-13 -2 H13 M-13 3 H13 M-13 8 A 13 8 0 0 0 13 8 M-13 3 Q-15 5 -13 8 M13 3 Q15 5 13 8',
  guggenheim: 'M-14 8 H14 M-12 8 V4 H12 V8 M-11 4 V-1 H11 V4 M-9 -1 V-6 H9 V-1 M-7 -6 V-11 H7 V-6 M-5 -11 V-16 H5 V-11',
  brooklynbridge: 'M-18 6 H18 M-10 6 V-10 M10 6 V-10 M-18 2 Q0 -12 18 2 M-10 -10 L-13 -16 M-7 -10 L-13 -16 M10 -10 L13 -16 M7 -10 L13 -16',
  libertystatue: 'M0 8 V-8 M0 -8 L-3 -14 M0 -8 L4 -12 L7 -20 M-4 8 H4 M-2 -8 A 4 4 0 1 1 2 -8',
  grandcentral: 'M-14 8 V-6 H14 V8 M-14 -6 L0 -16 L14 -6 M-8 8 V-2 M0 8 V-2 M8 8 V-2 M0 -9 A 3 3 0 1 1 -0.01 -9',
  rocktree: 'M0 -18 L-9 -4 H-4 L-12 8 H12 L4 -4 H9 Z M0 8 V12',
  wollmanrink: 'M-14 4 Q0 10 14 4 M-8 -2 Q-4 -14 4 -10 M4 -10 L8 -6 M-8 -2 L-10 4',
  wintervillage: 'M-14 4 Q0 10 14 4 M0 -16 L-3 -10 L3 -10 Z M-6 -10 H6 L4 -2 H-4 Z',
  timessquare: 'M-12 -14 H12 V-4 H-12 Z M-9 -11 H0 M-9 -8 H6 M-8 8 L-2 -4 M8 8 L2 -4',
  chinatown: 'M-16 -8 Q0 -20 16 -8 M-12 -8 V8 M12 -8 V8 M-16 8 H16 M-4 -2 H4 M0 -2 V8',
}

// fallbacks by finish, so unfinished art never breaks the shelf
export const FALLBACK = {
  brass: 'M0 -16 L4 -5 H15 L6 2 L9 13 L0 6 L-9 13 L-6 2 L-15 -5 H-4 Z', // star
  nickel: 'M0 8 V-16 M-8 8 V-6 M8 8 V-6 M-12 8 H12 M-4 -16 H4',          // simple tower
  copper: 'M-10 -12 V2 M-13 -12 V-4 M-7 -12 V-4 M-13 -4 Q-10 0 -7 -4 M8 -12 V8 M8 -12 Q14 -8 8 -2 M-10 2 V8', // fork & knife
  iris: 'M0 -16 V8 M-10 -10 L10 2 M10 -10 L-10 2 M-6 -16 L0 -10 L6 -16 M-6 8 L0 2 L6 8', // snowflake
}

import { ART } from './glyphsArt.js'

export function glyphOf(badge) {
  return ART[badge.id] || GLYPHS[badge.id] || FALLBACK[badge.finish] || FALLBACK.brass
}
