import type { BushuMountOptions } from "./picker.ts";

/**
 * Loads the data a picker shows, each module at the moment it is asked for, so that a page which never opens a picker never loads it:
 * the radicals, the Japanese names and the strokes of a kanji. Hand the result to `mountBushu`:
 *
 * ```ts
 * const data = await loadBushuData();
 * mountBushu(element, { ...data, language: "ja" });
 * ```
 */
export async function loadBushuData(): Promise<Pick<BushuMountOptions, "radicals" | "names" | "strokes">> {
  const [{ RADKFILE }, { radicalNameEntry }, { strokesOf }] = await Promise.all([import("./data/radkfile.data.ts"), import("./names.ts"), import("./strokes.ts")]);
  return { radicals: RADKFILE.radicals, names: radicalNameEntry, strokes: strokesOf };
}
