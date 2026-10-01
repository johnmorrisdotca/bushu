import { describe, expect, it } from "vitest";

import { RADKFILE } from "./data/radkfile.data.ts";
import { KANJI_STROKES, sortByStrokes, strokesOf } from "./strokes.ts";

describe("the strokes of a kanji", () => {
  it("counts the strokes of kanji whose count is well known", () => {
    expect(strokesOf("一")).toBe(1);
    expect(strokesOf("日")).toBe(4);
    expect(strokesOf("明")).toBe(8);
    expect(strokesOf("時")).toBe(10);
    expect(strokesOf("鬱")).toBe(29);
  });

  it("has a count for every kanji in the radical index, and for nothing else", () => {
    const indexed = new Set(RADKFILE.radicals.flatMap((entry) => [...entry.kanji]));
    const counted = Object.values(KANJI_STROKES.byStrokes).flatMap((kanji) => [...kanji]);
    expect(counted.length).toBe(indexed.size);
    for (const one of counted) expect(indexed.has(one), one).toBe(true);
    for (const one of indexed) expect(strokesOf(one), one).not.toBeNull();
  });

  it("says nothing for a character it does not hold", () => {
    expect(strokesOf("a")).toBeNull();
    expect(strokesOf("")).toBeNull();
  });

  it("groups the kanji by a count that is a whole number from 1 to 30, each group in code point order", () => {
    for (const [count, kanji] of Object.entries(KANJI_STROKES.byStrokes)) {
      expect(Number(count)).toBeGreaterThanOrEqual(1);
      expect(Number(count)).toBeLessThanOrEqual(30);
      const points = [...kanji].map((one) => one.codePointAt(0)!);
      expect(points).toEqual([...points].sort((a, b) => a - b));
    }
  });
});

describe("sortByStrokes", () => {
  it("puts the fewest strokes first and keeps the given order within a count", () => {
    expect(sortByStrokes(["時", "明", "日", "一", "朝"])).toEqual(["一", "日", "明", "朝", "時"].sort((a, b) => (strokesOf(a)! - strokesOf(b)!) || ["時", "明", "日", "一", "朝"].indexOf(a) - ["時", "明", "日", "一", "朝"].indexOf(b)));
    expect(sortByStrokes(["朝", "明"])).toEqual(["朝", "明"].sort((a, b) => strokesOf(a)! - strokesOf(b)!));
  });

  it("puts a character with no count last, and changes nothing it was given", () => {
    const given = ["鬱", "x", "日"];
    expect(sortByStrokes(given)).toEqual(["日", "鬱", "x"]);
    expect(given).toEqual(["鬱", "x", "日"]);
  });
});
