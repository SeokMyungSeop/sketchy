/**
 * Typographic and spacing constants shared by the layout engine and the
 * viewer, so measured text and rendered text agree.
 */
export const FONT_FAMILY = "Kalam";

/**
 * Hangul is drawn with Nanum Pen Script, which follows Kalam in the font
 * stack under this name. A family of its own, because browsers only combine
 * faces by unicode-range when their weights agree, and it has one weight.
 */
export const HANGUL_FONT_FAMILY = "Sketchy Hangul";

/**
 * Nanum Pen Script's glyphs are small next to Kalam, so the viewer enlarges
 * them by this factor and the layout widens its estimates to match.
 */
export const HANGUL_SCALE = 1.2;

export const FONT = {
  title: 30,
  subtitle: 18,
  node: 18,
  group: 17,
  edge: 15,
  label: 16,
  caption: 15,
  attribution: 11,
} as const;

export const SPACING = {
  margin: 28,
  nodePaddingX: 18,
  nodePaddingY: 12,
  nodeMinWidth: 110,
  nodeMinHeight: 52,
  nodeMaxTextWidth: 200,
  iconSize: 26,
  labelGap: 46,
  labelSpacing: 8,
  labelMaxTextWidth: 190,
  groupPadding: 18,
  groupHeader: 34,
} as const;
