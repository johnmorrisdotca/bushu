import { KANJI_STROKES } from "./data/strokes.data.ts";

/**
 * THE STROKE COUNT OF A KANJI, from KANJIDIC2 (CC BY-SA 4.0, credit in NOTICE.md), for every kanji in the radical index: 6,355 of them,
 * the JIS X 0208 set. Used to put a picker's matches in the order a reader expects, the simplest first. A plain import, so asking costs no request.
 */
export { KANJI_STROKES } from "./data/strokes.data.ts";

const COUNTS: ReadonlyMap<string, number> = (() => {
  const counts = new Map<string, number>();
  for (const [count, kanji] of Object.entries(KANJI_STROKES.byStrokes)) for (const one of kanji) counts.set(one, Number(count));
  return counts;
})();

/** The strokes in a kanji, or null for a character the index does not hold.
 *
 * @param kanji - The kanji to look up, or the supplied kanji list where the signature requires an array.
 * @returns The native kanji stroke count, or null when the character is absent from the index.
 * @example
 * ```ts
 * import { strokesOf } from "@johnmorrisdotca/bushu/strokes";
 *
 * console.log(strokesOf("海"));
 * ```
 */
export function strokesOf(kanji: string): number | null {
  return COUNTS.get(kanji) ?? null;
}

/**
 * The kanji with the fewest strokes first; kanji with the same count keep the order they were given in, and a character with no count goes last.
 * A new array: what was given is not changed.
 *
 * @param kanji - The kanji to look up, or the supplied kanji list where the signature requires an array.
 * @returns The kanji with the fewest strokes first; kanji with the same count keep the order they were given in, and a character with no count goes last. A new array: what was given is not changed.
 * @example
 * ```ts
 * import { sortByStrokes } from "@johnmorrisdotca/bushu/strokes";
 *
 * console.log(sortByStrokes(["海","一","水"]));
 * ```
 */
export function sortByStrokes(kanji: readonly string[]): string[] {
  return kanji
    .map((one, index) => ({ one, index, strokes: COUNTS.get(one) ?? Number.POSITIVE_INFINITY }))
    .sort((left, right) => (left.strokes === right.strokes ? left.index - right.index : left.strokes < right.strokes ? -1 : 1))
    .map((row) => row.one);
}
