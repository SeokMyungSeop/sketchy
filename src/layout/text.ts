/**
 * Text metrics for the handwriting font, without a DOM.
 *
 * Widths are per-character estimates in em for Kalam, rounded up slightly so
 * boxes err on the roomy side; the viewer shrinks text that still overflows.
 * Hangul is measured for Nanum Pen Script, which draws it.
 */

import { extraHeight, labelWidth } from "../math/inline.js";
import { HANGUL_SCALE } from "../style/metrics.js";

const NARROW = new Set([..."il.,:;'|!`()[]{}/\\ "]);
const WIDE = new Set([..."mwMW@%&"]);

/**
 * Advance of a Hangul syllable in Nanum Pen Script, by its vowel: the font is
 * proportional, and the vowel decides the shape. Upright vowels (ㅏ, ㅣ) make
 * wide syllables, flat ones (ㅗ, ㅜ, ㅡ) narrow ones. Each value is the mean of
 * the 2,350 common syllables with that vowel, rounded up.
 */
const SYLLABLE_EM = [
  0.75, 0.77, 0.78, 0.74, 0.71, 0.77, 0.76, 0.83, 0.51, 0.75, 0.77, 0.65, 0.51, 0.51, 0.68, 0.76,
  0.64, 0.5, 0.5, 0.64, 0.64,
];
/** Single consonants and vowels (ㄱ, ㅏ) all take the same advance. */
const JAMO_EM = 0.94;

function hangulWidthEm(code: number): number | undefined {
  if (code >= 0xac00 && code <= 0xd7a3) {
    return SYLLABLE_EM[Math.floor((code - 0xac00) / 28) % 21]! * HANGUL_SCALE;
  }
  if ((code >= 0x3131 && code <= 0x318e) || (code >= 0x1100 && code <= 0x11ff)) {
    return JAMO_EM * HANGUL_SCALE;
  }
  return undefined;
}

export function charWidthEm(ch: string): number {
  const hangul = hangulWidthEm(ch.codePointAt(0)!);
  if (hangul !== undefined) return hangul;
  if (NARROW.has(ch)) return 0.3;
  if (WIDE.has(ch)) return 0.82;
  if (/[A-Z]/.test(ch)) return 0.62;
  if (/[0-9]/.test(ch)) return 0.55;
  if (ch === "-" || ch === "_") return 0.45;
  return 0.52;
}

export function textWidth(text: string, fontSize: number): number {
  let em = 0;
  for (const ch of text) em += charWidthEm(ch);
  return em * fontSize;
}

/** Width of a line that may contain $math$. */
export function richWidth(text: string, fontSize: number): number {
  return text.includes("$") ? labelWidth(text, fontSize) : textWidth(text, fontSize);
}

/** Words of a paragraph; a $formula$ stays one word, spaces and all. */
function words(paragraph: string): string[] {
  const out: string[] = [];
  let word = "";
  let math = false;
  for (const c of paragraph) {
    if (c === "$") math = !math;
    if (/\s/.test(c) && !math) {
      if (word) out.push(word);
      word = "";
    } else word += c;
  }
  if (word) out.push(word);
  return out;
}

/** Greedy word wrap; words longer than the limit are broken by character. */
export function wrapText(text: string, fontSize: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const word of words(paragraph)) {
      const candidate = line ? `${line} ${word}` : word;
      if (richWidth(candidate, fontSize) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      line = "";
      // Formulas are never broken; one too wide simply overflows.
      if (word.includes("$")) {
        line = word;
        continue;
      }
      let rest = word;
      while (textWidth(rest, fontSize) > maxWidth) {
        let cut = 1;
        while (cut < rest.length && textWidth(rest.slice(0, cut + 1), fontSize) <= maxWidth) {
          cut++;
        }
        lines.push(rest.slice(0, cut));
        rest = rest.slice(cut);
      }
      line = rest;
    }
    lines.push(line);
  }
  return lines;
}

export function lineHeight(fontSize: number): number {
  return Math.round(fontSize * 1.3);
}

export type MeasuredText = { lines: string[]; width: number; height: number };

/** Top offsets of each line in a block, taller where formulas need room. */
export function lineTops(lines: string[], fontSize: number): number[] {
  const tops: number[] = [];
  let y = 0;
  for (const line of lines) {
    const extra = extraHeight(line, fontSize);
    tops.push(y + extra / 2);
    y += lineHeight(fontSize) + extra;
  }
  return tops;
}

export function blockHeight(lines: string[], fontSize: number): number {
  return lines.reduce((h, l) => h + lineHeight(fontSize) + extraHeight(l, fontSize), 0);
}

export function measureText(text: string, fontSize: number, maxWidth: number): MeasuredText {
  const lines = wrapText(text, fontSize, maxWidth);
  const width = Math.max(0, ...lines.map((l) => richWidth(l, fontSize)));
  return { lines, width: Math.ceil(width), height: blockHeight(lines, fontSize) };
}
