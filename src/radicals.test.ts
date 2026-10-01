import { describe, expect, it } from "vitest";

import { RADKFILE } from "./data/radkfile.data.ts";
import { withCorrectedStrokes } from "./forms.ts";
import { kanjiForRadicals, orderChosen, radicalGroups, radicalsInKanji, usableRadicals } from "./radicals.ts";
import type { Radical } from "./types.ts";

/*
 * A small grid standing in for the 253, and true to the characters: 日 is in 明, 時 and 朝; 月 is in 明 and 朝; 寺 is in 時 alone.
 * So 日 with 寺 is 時 and nothing else, while 日 with 月 is the two that hold both.
 */
const ENTRIES: Radical[] = [
  { radical: "一", strokes: 1, kanji: "明時朝寺" },
  { radical: "日", strokes: 4, kanji: "明時朝" },
  { radical: "月", strokes: 4, kanji: "明朝" },
  { radical: "寺", strokes: 6, kanji: "時" },
];

describe("radicalGroups", () => {
  it("groups the grid by stroke count, fewest first", () => {
    expect(radicalGroups(ENTRIES)).toEqual([
      { strokes: 1, radicals: ["一"] },
      { strokes: 4, radicals: ["日", "月"] },
      { strokes: 6, radicals: ["寺"] },
    ]);
  });

  it("does not depend on the order the radicals are given in", () => {
    expect(radicalGroups([...ENTRIES].reverse()).map((group) => group.strokes)).toEqual([1, 4, 6]);
  });
});

describe("kanjiForRadicals", () => {
  it("has nothing to show before anything is picked", () => {
    expect(kanjiForRadicals(ENTRIES, [])).toEqual([]);
  });

  it("lists every kanji holding the one radical", () => {
    expect(kanjiForRadicals(ENTRIES, ["月"])).toEqual(["明", "朝"]);
  });

  /* Every radical narrows: 日 with 寺 is 時 alone, not everything holding either. */
  it("narrows on all of them rather than any of them", () => {
    expect(kanjiForRadicals(ENTRIES, ["日", "寺"])).toEqual(["時"]);
    expect(kanjiForRadicals(ENTRIES, ["日", "月"])).toEqual(["明", "朝"]);
  });

  it("answers nothing when the combination exists in no kanji", () => {
    expect(kanjiForRadicals(ENTRIES, ["月", "寺"])).toEqual([]);
  });

  /* The order is the first radical's, which is the dictionary's own. */
  it("keeps the matches in the order the data holds them", () => {
    expect(kanjiForRadicals(ENTRIES, ["一", "日"])).toEqual(["明", "時", "朝"]);
  });

  it("answers nothing for a radical it does not have", () => {
    expect(kanjiForRadicals(ENTRIES, ["日", "𠮟"])).toEqual([]);
  });

  it("does not change what it was given", () => {
    const before = JSON.stringify(ENTRIES);
    kanjiForRadicals(ENTRIES, ["日", "月"]);
    usableRadicals(ENTRIES, ["日"]);
    expect(JSON.stringify(ENTRIES)).toBe(before);
  });
});

describe("usableRadicals", () => {
  it("offers the whole grid before anything is picked", () => {
    expect(usableRadicals(ENTRIES, []).size).toBe(ENTRIES.length);
  });

  /* The dimming is the ergonomics: after 月 only 一, 日 and 月 itself can lead anywhere, so 寺 is dimmed rather than left as a route to an empty list. */
  it("keeps only the radicals that can still narrow", () => {
    const usable = usableRadicals(ENTRIES, ["月"]);
    expect([...usable].sort()).toEqual(["一", "日", "月"].sort());
    expect(usable.has("寺")).toBe(false);
  });

  it("always keeps what is chosen, so a choice can be taken back", () => {
    const usable = usableRadicals(ENTRIES, ["月", "寺"]);
    expect(usable.has("月")).toBe(true);
    expect(usable.has("寺")).toBe(true);
  });
});

describe("orderChosen", () => {
  it("reads the picks back in the grid's order, not the order they were clicked", () => {
    expect(orderChosen(ENTRIES, ["寺", "日"])).toEqual(["日", "寺"]);
  });

  it("drops a radical the grid does not have", () => {
    expect(orderChosen(ENTRIES, ["日", "x"])).toEqual(["日"]);
  });
});

/*
 * RADKFILE is stored radical-first, because that is the direction a search runs: pick two parts, intersect their kanji. A kanji page asks
 * the opposite question, what is this character made of, and a membership test per radical answers it without a second copy of the index.
 */
describe("radicalsInKanji", () => {
  const entries: Radical[] = [
    { radical: "日", strokes: 4, kanji: "明時晴" },
    { radical: "月", strokes: 4, kanji: "明朝" },
    { radical: "一", strokes: 1, kanji: "明三" },
    { radical: "水", strokes: 4, kanji: "海泳" },
  ];

  it("finds every radical the character contains", () => {
    expect(radicalsInKanji(entries, "明").map((entry) => entry.radical)).toEqual(["一", "日", "月"]);
  });

  /* Simplest first, so the list reads the way the character is built up. */
  it("puts the fewest strokes first", () => {
    expect(radicalsInKanji(entries, "明").map((entry) => entry.strokes)).toEqual([1, 4, 4]);
  });

  it("is empty for a character RADKFILE does not cover", () => {
    expect(radicalsInKanji(entries, "鬱")).toEqual([]);
  });

  it("is empty for no character at all, rather than matching everything", () => {
    expect(radicalsInKanji(entries, "")).toEqual([]);
  });

  it("does not confuse one character's radicals with another's", () => {
    expect(radicalsInKanji(entries, "海").map((entry) => entry.radical)).toEqual(["水"]);
  });
});

/* The same questions asked of the real index, whose answers are known. */
describe("the real index", () => {
  const radicals = withCorrectedStrokes(RADKFILE.radicals);

  it("finds 明 by 日 and 月, and 時 by 日, 土 and 寸", () => {
    expect(kanjiForRadicals(radicals, ["日", "月"])).toContain("明");
    expect(kanjiForRadicals(radicals, ["日", "土", "寸"])).toEqual(["時", "蒔", "塒"]);
  });

  it("finds a kanji by the shape a stand-in stands for, through the stand-in's key", () => {
    // 海 is written with 氵 (RADKFILE keys it 汁) and 母.
    expect(kanjiForRadicals(radicals, ["汁", "母"])).toContain("海");
  });

  it("lists the parts of 明 as the sum of its real parts", () => {
    const parts = radicalsInKanji(radicals, "明").map((entry) => entry.radical);
    expect(parts).toContain("日");
    expect(parts).toContain("月");
  });

  it("puts every kanji it lists under every one of its parts, both ways round", () => {
    for (const kanji of "明海鬱漢") {
      for (const part of radicalsInKanji(radicals, kanji)) expect(kanjiForRadicals(radicals, [part.radical])).toContain(kanji);
    }
  });

  it("narrows to nothing, and dims everything else, only where no kanji holds the parts", () => {
    const usable = usableRadicals(radicals, ["日", "土", "寸"]);
    expect(usable.has("日") && usable.has("土") && usable.has("寸")).toBe(true);
    expect(usable.size).toBeLessThan(radicals.length);
    expect(usable.size).toBeGreaterThan(3);
    expect(usable.has("水")).toBe(false);
  });
});
