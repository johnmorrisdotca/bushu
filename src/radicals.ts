import type { Radical } from "./types.ts";

/**
 * FINDING A KANJI BY ITS PARTS.
 *
 * The way you look up a character you cannot read: you cannot type it and you do not know its readings, but you can see 水 on
 * the left and 田 on the right. Choose those two and the list is short.
 *
 * Every part narrows: the matches are the kanji that hold ALL of the chosen parts, not any of them. And once something is
 * chosen, most of the other parts cannot narrow anything further (they appear in no remaining kanji), so a picker dims them
 * rather than leaving 250 dead ends to click into an empty list. That dimming is the whole ergonomics of the thing, and it is why
 * this is a set intersection and not a filter over a list.
 *
 * Every function takes the radicals as an argument (they are in `@johnmorrisdotca/bushu/radkfile`), reads them and never changes them.
 */

/** The radicals that share a stroke count, as the grid of a picker draws them. */
export type RadicalGroup = { strokes: number; radicals: string[] };

/** The grid: the radicals in stroke-count order, grouped by the count, in the order they were given within a count. */
export function radicalGroups(radicals: readonly Radical[]): RadicalGroup[] {
  const groups = new Map<number, string[]>();
  for (const entry of radicals) {
    const held = groups.get(entry.strokes);
    if (held) held.push(entry.radical);
    else groups.set(entry.strokes, [entry.radical]);
  }
  return [...groups.entries()].sort((left, right) => left[0] - right[0]).map(([strokes, keys]) => ({ strokes, radicals: keys }));
}

/**
 * The kanji that hold every one of the chosen radicals, in the order of the first radical's list (the dictionary's own).
 *
 * Nothing chosen means nothing to show: the whole dictionary is not an answer to a question nobody has asked yet. A radical that
 * is not in the list cannot be satisfied, so the answer is nothing.
 */
export function kanjiForRadicals(radicals: readonly Radical[], chosen: readonly string[]): string[] {
  if (chosen.length === 0) return [];
  const wanted = new Set(chosen);
  const sets = radicals.filter((entry) => wanted.has(entry.radical)).map((entry) => new Set([...entry.kanji]));
  if (sets.length !== wanted.size) return [];
  const [first, ...rest] = sets;
  return [...first!].filter((kanji) => rest.every((set) => set.has(kanji)));
}

/**
 * The radicals that can still narrow what is left: every one that appears in at least one of the kanji that match now.
 *
 * A radical in none of the remaining kanji is a dead end, which a picker dims rather than let you click your way to an empty list.
 * The chosen ones stay in the set: taking one back must always be possible. With nothing chosen, every radical can.
 */
export function usableRadicals(radicals: readonly Radical[], chosen: readonly string[]): Set<string> {
  if (chosen.length === 0) return new Set(radicals.map((entry) => entry.radical));
  const matches = new Set(kanjiForRadicals(radicals, chosen));
  const usable = new Set(chosen);
  if (matches.size === 0) return usable;
  for (const entry of radicals) {
    if (usable.has(entry.radical)) continue;
    for (const kanji of entry.kanji) {
      if (matches.has(kanji)) {
        usable.add(entry.radical);
        break;
      }
    }
  }
  return usable;
}

/** The chosen radicals in the grid's own order, not the order they were clicked, so the choice reads as a row of the grid. A radical the grid does not have is dropped. */
export function orderChosen(radicals: readonly Radical[], chosen: readonly string[]): string[] {
  const order = new Map(radicals.map((entry, index) => [entry.radical, index]));
  return [...chosen].filter((radical) => order.has(radical)).sort((left, right) => order.get(left)! - order.get(right)!);
}

/**
 * The radicals a character is written with, fewest strokes first.
 *
 * RADKFILE is stored radical by radical, each with the kanji that hold it, because that is the direction a search runs. A kanji
 * page asks the opposite question, and a membership test per radical answers it, which is nothing next to keeping a second copy
 * of the index the other way round. Simplest parts first, so the list reads the way the character is built up. Code point order
 * breaks a tie, never a locale's collation, so the same character lists its parts in the same order on every machine.
 */
export function radicalsInKanji(radicals: readonly Radical[], kanji: string): Radical[] {
  if (kanji.length === 0) return [];
  return radicals
    .filter((entry) => entry.kanji.includes(kanji))
    .sort((left, right) => left.strokes - right.strokes || (left.radical < right.radical ? -1 : left.radical > right.radical ? 1 : 0));
}
