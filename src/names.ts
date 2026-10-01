import { RADICAL_NAMES } from "./data/names.data.ts";
import { radicalForm } from "./forms.ts";

/**
 * WHAT A JAPANESE SCHOOL CALLS A RADICAL: 氵 is さんずい, 辶 is しんにょう, 艹 is くさかんむり. The names a learner hears from a teacher,
 * which are neither the dictionary's English ("water", "walk", "grass") nor any course's mnemonics. From Kanji alive's table of the 214
 * Kangxi radicals and their variants (CC BY 4.0, credit in NOTICE.md), joined to RADKFILE's 253 by shape. 227 have a name; the rest are
 * components no school lists as a radical (九, 乞, 久, 井), and a caller gets null for those, never a guess.
 *
 * Keyed by the RADKFILE key, as everything about a radical is, so a stand-in is looked up as written: 汁 answers さんずい. The names
 * are a plain import, so a page that draws a radical's name draws it with no request.
 */
export type RadicalNameEntry = {
  /** The name, in hiragana. */
  readonly name: string;
  readonly romaji: string;
  /** Kanji alive's English meaning, which is also the classical name. */
  readonly meaning: string;
  /** Where the shape sits in a character (へん, つくり, かんむり...), or null. */
  readonly position: string | null;
  /** The Kangxi radical number the shape belongs to. */
  readonly kangxi: number | null;
};

export { RADICAL_NAMES } from "./data/names.data.ts";

const NAMES: Readonly<Record<string, RadicalNameEntry>> = RADICAL_NAMES.names;

/** The Japanese name of a RADKFILE radical, in hiragana, or null where no school names it. */
export function radicalName(key: string): string | null {
  return NAMES[key]?.name ?? null;
}

/** Everything Kanji alive says about a RADKFILE radical: its name, romaji, English meaning, position and Kangxi number. Null where it says nothing. */
export function radicalNameEntry(key: string): RadicalNameEntry | null {
  return NAMES[key] ?? null;
}

/**
 * The same names by the shape drawn rather than by RADKFILE's key. A page that has the character a reader sees (氵, not 汁) asks here.
 * Folded once: every key's shape, and every key too, so either spelling answers.
 */
const BY_SHAPE: ReadonlyMap<string, RadicalNameEntry> = (() => {
  const byShape = new Map<string, RadicalNameEntry>();
  for (const [key, entry] of Object.entries(NAMES)) {
    const shape = radicalForm(key);
    if (!byShape.has(shape)) byShape.set(shape, entry);
  }
  for (const [key, entry] of Object.entries(NAMES)) if (!byShape.has(key)) byShape.set(key, entry);
  return byShape;
})();

/** The Japanese name of a radical drawn as this shape, or null. 阝 is on both sides of a character and the first of its two names answers (おおざと). */
export function radicalNameForShape(shape: string): string | null {
  return BY_SHAPE.get(shape)?.name ?? null;
}

/** How many of the radicals carry a Japanese name. */
export function radicalNameCount(): number {
  return Object.keys(NAMES).length;
}
