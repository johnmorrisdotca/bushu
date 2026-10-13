/** A radical, or a common element of kanji, as RADKFILE lists it.
 *
 * @example
 * ```ts
 * import type { Radical } from "@johnmorrisdotca/bushu";
 *
 * const value: Radical = {radical:"水",strokes:4,kanji:"海湖"};
 * console.log(value);
 * ```
 */
export type Radical = {
  /** Its key. A radical with no character of its own is keyed by a kanji that holds its shape: 汁 for 氵 (see `radicalForm`). */
  readonly radical: string;
  /** Its stroke count as RADKFILE writes it (see `withCorrectedStrokes` for the two it gets wrong). */
  readonly strokes: number;
  /** Every kanji that holds it, as one string. */
  readonly kanji: string;
};
