import type { Radical } from "./types.ts";

/**
 * WHAT A RADKFILE RADICAL LOOKS LIKE, AS OPPOSED TO WHAT IT IS KEYED BY.
 *
 * RADKFILE predates Unicode having a character for every radical shape, so for the shapes with no character of their own it
 * writes a whole kanji that contains the shape: 汁 for 氵, 扎 for 扌, 艾 for 艹, 込 for 辶. The stroke count beside each is the
 * radical's, not the stand-in's (汁 sits under three strokes because 氵 is three), and every kanji listed under it is a kanji
 * written with the shape, not with the stand-in. Drawn as written, a picker files a five-stroke kanji under three strokes
 * and names it "soup".
 *
 * So the key stays the key, since it is what the index and everything that looks a radical up speak, and anything that
 * DRAWS a radical asks `radicalForm` for its shape first. This table is the package's own. Each shape is the CJK
 * Unified Ideograph that is that shape, which nearly every font draws (EDRDG's own list of the same characters, in the
 * CJK Radicals Supplement and Kangxi blocks, is in `RADKFILE.unicode` from `@johnmorrisdotca/bushu/radkfile`, and a test
 * holds the two to the same set of keys).
 *
 * Both 邦 and 阡 come out as 阝, which is right: it is the same shape on the right of 部 and on the left of 陸, and RADKFILE
 * keeps two keys because the two kanji lists differ. The name tells them apart (おおざと and こざとへん).
 */
export const RADICAL_FORMS: Readonly<Record<string, string>> = {
  // Two strokes.
  化: "亻",
  个: "𠆢",
  并: "丷",
  刈: "刂",
  ハ: "八",
  // Three.
  込: "辶",
  汁: "氵",
  尚: "⺌",
  犯: "犭",
  邦: "阝",
  阡: "阝",
  忙: "忄",
  扎: "扌",
  艾: "艹",
  ヨ: "彐",
  // Four.
  礼: "礻",
  老: "耂",
  杰: "灬",
  // Five.
  初: "衤",
  買: "罒",
  疔: "疒",
  禹: "禸",
  // Eleven: the 啇 of 敵, 適 and 摘, keyed by 滴.
  滴: "啇",
  // One: a typographic bar and a katakana, standing for the strokes.
  "｜": "丨",
  ノ: "丿",
};

/** The shape to draw for a RADKFILE key: the stand-in's own shape (汁 gives 氵), or the key itself where it already is the shape. */
export function radicalForm(key: string): string {
  return RADICAL_FORMS[key] ?? key;
}

/** True when the key is a stand-in, so that the form, not the key, is the thing to draw and to name. */
export function isRadicalStandIn(key: string): boolean {
  return key in RADICAL_FORMS;
}

/**
 * THE TWO STROKE COUNTS RADKFILE GETS WRONG.
 *
 * Measured across all 253 against KANJIDIC2 and Kanji alive: 乞 is three strokes and RADKFILE files it under two; 舛 is six and it
 * files it under seven. The other places the dictionary disagrees (辶, 艹 and 耂) are Kangxi counts (4, 6, 6), and RADKFILE's 3, 3 and 4
 * are what a Japanese school counts, so they stand.
 *
 * Kept here, applied on reading (`radicalStrokes`, `withCorrectedStrokes`) and never edited into the data, so a rebuild
 * from RADKFILE cannot bring the two back.
 */
export const RADKFILE_STROKE_CORRECTIONS: Readonly<Record<string, number>> = {
  乞: 3,
  舛: 6,
};

/** The stroke count to file a RADKFILE radical under: its own, except for the two it miscounts. */
export function radicalStrokes(key: string, radkfileStrokes: number): number {
  return RADKFILE_STROKE_CORRECTIONS[key] ?? radkfileStrokes;
}

/** The radicals with the two miscounts put right, as new entries in the same order. Hand it to everything that groups by strokes. */
export function withCorrectedStrokes(radicals: readonly Radical[]): Radical[] {
  return radicals.map((entry) => ({ ...entry, strokes: radicalStrokes(entry.radical, entry.strokes) }));
}
