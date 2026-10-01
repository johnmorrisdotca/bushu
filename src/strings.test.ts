import { describe, expect, it } from "vitest";

import { BUSHU_STRINGS, bushuLanguageOf, bushuSay } from "./strings.ts";

describe("the words", () => {
  it("have every line in both languages, with the same values to fill in", () => {
    const en = Object.keys(BUSHU_STRINGS.en).filter((key) => !key.endsWith("One")).sort();
    const ja = Object.keys(BUSHU_STRINGS.ja).filter((key) => !key.endsWith("One")).sort();
    expect(ja).toEqual(en);
    for (const key of en) {
      const values = (line: string): string[] => [...line.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!).sort();
      expect(values(BUSHU_STRINGS.ja[key]!), key).toEqual(values(BUSHU_STRINGS.en[key]!));
    }
  });

  it("fill values in, and say the one form when the number is one", () => {
    expect(bushuSay("en", "found", { n: 36 })).toBe("36 kanji hold all of these parts.");
    expect(bushuSay("en", "found", { n: 1 })).toBe("1 kanji holds all of these parts.");
    expect(bushuSay("en", "groupLabel", { n: 3 })).toBe("3 strokes");
    expect(bushuSay("en", "groupLabel", { n: 1 })).toBe("1 stroke");
    expect(bushuSay("ja", "groupLabel", { n: 1 })).toBe("1画");
    expect(bushuSay("ja", "found", { n: 36 })).toBe("この部品をすべて含む漢字は36字です。");
    expect(bushuSay("en", "nothing there")).toBe("nothing there");
  });

  it("read a language from a lang attribute", () => {
    expect(bushuLanguageOf("ja")).toBe("ja");
    expect(bushuLanguageOf("ja-JP")).toBe("ja");
    expect(bushuLanguageOf("en-GB")).toBe("en");
    expect(bushuLanguageOf("")).toBe("en");
    expect(bushuLanguageOf(null)).toBe("en");
  });
});
