import { describe, expect, it } from "vitest";

import { RADKFILE } from "./data/radkfile.data.ts";
import { RADICAL_FORMS } from "./forms.ts";
import { RADICAL_NAMES, radicalName, radicalNameCount, radicalNameEntry, radicalNameForShape } from "./names.ts";

const KEYS = RADKFILE.radicals.map((entry) => entry.radical);
const HIRAGANA_ONLY = /^[ぁ-ゖー]+$/;

/* What a Japanese school calls a radical: names in hiragana, as a teacher says them. */
describe("what a Japanese school calls a radical", () => {
  it("names the shapes a stand-in stands for, not the stand-in", () => {
    expect(radicalName("汁")).toBe("さんずい");
    expect(radicalName("扎")).toBe("てへん");
    expect(radicalName("艾")).toBe("くさかんむり");
    expect(radicalName("込")).toBe("しんにょう");
    expect(radicalName("化")).toBe("にんべん");
  });

  /* The same shape on the two sides of a character has two names. */
  it("tells the two village radicals apart", () => {
    expect(radicalName("邦")).toBe("おおざと");
    expect(radicalName("阡")).toBe("こざとへん");
  });

  it("names a radical that is its own character by its reading", () => {
    expect(radicalName("口")).toBe("くち");
    expect(radicalName("水")).toBe("みず");
    expect(radicalName("心")).toBe("こころ");
  });

  /* A component no school lists as a radical is not given a name it lacks. */
  it("says nothing for a component that is not a radical", () => {
    expect(radicalName("九")).toBeNull();
    expect(radicalName("井")).toBeNull();
    expect(radicalName("マ")).toBeNull();
  });

  it("carries the meaning, the position and the Kangxi number with the name", () => {
    expect(radicalNameEntry("汁")).toEqual({ name: "さんずい", romaji: "sanzui", meaning: "water", position: "へん", kangxi: 85 });
  });

  it("names nearly all of the index, every one in hiragana", () => {
    expect(radicalNameCount()).toBeGreaterThanOrEqual(220);
    for (const key of KEYS) {
      const name = radicalName(key);
      if (name !== null) expect(name, `${key} is named ${name}`).toMatch(HIRAGANA_ONLY);
    }
  });

  it("names only keys the index holds", () => {
    expect(Object.keys(RADICAL_NAMES.names).filter((key) => !KEYS.includes(key))).toEqual([]);
  });

  /* Every stand-in that draws as a shape is named as that shape, or the fix that draws 氵 for 汁 leaves it named as a kanji in Japanese too. */
  it("names every stand-in whose shape a school teaches", () => {
    expect(Object.keys(RADICAL_FORMS).filter((key) => radicalName(key) === null && !["ノ", "｜", "滴"].includes(key))).toEqual([]);
  });

  it("says where the names came from", () => {
    expect(RADICAL_NAMES.source.name).toBe("Kanji alive");
    expect(RADICAL_NAMES.source.licence).toBe("CC BY 4.0");
    expect(RADICAL_NAMES.source.commit).toMatch(/^[0-9a-f]{40}$/);
  });
});

/* A page that has the character a reader sees (氵) rather than RADKFILE's key (汁) asks by shape. */
describe("the same names by shape", () => {
  it("names a shape, and a key too", () => {
    expect(radicalNameForShape("氵")).toBe("さんずい");
    expect(radicalNameForShape("汁")).toBe("さんずい");
    expect(radicalNameForShape("辶")).toBe("しんにょう");
    expect(radicalNameForShape("口")).toBe("くち");
    expect(radicalNameForShape("ハ")).toBe("はち");
  });

  it("answers おおざと for 阝, the first of its two", () => {
    expect(radicalNameForShape("阝")).toBe("おおざと");
  });

  it("says nothing for a component no school names", () => {
    expect(radicalNameForShape("九")).toBeNull();
    expect(radicalNameForShape("")).toBeNull();
  });
});

describe("no course's names", () => {
  it("holds only the school names, in the Kanji alive data", () => {
    const meanings = Object.values(RADICAL_NAMES.names).map((entry) => entry.meaning);
    expect(meanings.length).toBeGreaterThan(200);
    for (const entry of Object.values(RADICAL_NAMES.names)) expect(Object.keys(entry).sort()).toEqual(["kangxi", "meaning", "name", "position", "romaji"]);
  });
});
