import type { BushuMountOptions } from "./picker.ts";

/**
 * Loads the data a picker shows, each module at the moment it is asked for, so that a page which never opens a picker never loads it:
 * the radicals, the Japanese names and the strokes of a kanji. Hand the result to `mountBushu`:
 *
 * ```ts
 * const data = await loadBushuData();
 * mountBushu(element, { ...data, language: "ja" });
 * ```
 *
 * @returns The loaded native radical entries and name/stroke callbacks for mountBushu.
 * @example
 * ```ts
 * import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
 * import { loadBushuData } from "@johnmorrisdotca/bushu/picker";
 *
 * const radicals = RADKFILE.radicals;
 * console.log((await loadBushuData()).radicals.length);
 * ```
 */
export async function loadBushuData(): Promise<Pick<BushuMountOptions, "radicals" | "names" | "strokes">> {
  const [{ RADKFILE }, { radicalNameEntry }, { strokesOf }] = await Promise.all([import("./data/radkfile.data.ts"), import("./names.ts"), import("./strokes.ts")]);
  return { radicals: RADKFILE.radicals, names: radicalNameEntry, strokes: strokesOf };
}
