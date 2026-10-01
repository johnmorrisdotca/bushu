import { describe, expect, it } from "vitest";

import { RADKFILE } from "./data/radkfile.data.ts";
import { strokesOf } from "./strokes.ts";
import { RADICAL_FORMS, RADKFILE_STROKE_CORRECTIONS, isRadicalStandIn, radicalForm, radicalStrokes, withCorrectedStrokes } from "./forms.ts";

const KEYS = new Set(RADKFILE.radicals.map((entry) => entry.radical));

/*
 * RADKFILE writes 汁 for 氵 and 扎 for 扌 and files each under the radical's strokes, so a picker that draws the key files a five-stroke
 * kanji under three strokes and calls it "soup".
 */
describe("what a RADKFILE radical looks like", () => {
  it("draws the shape a stand-in kanji stands for", () => {
    expect(radicalForm("汁")).toBe("氵");
    expect(radicalForm("扎")).toBe("扌");
    expect(radicalForm("艾")).toBe("艹");
    expect(radicalForm("込")).toBe("辶");
    expect(radicalForm("化")).toBe("亻");
  });

  it("draws a radical that is its own shape as itself", () => {
    expect(radicalForm("口")).toBe("口");
    expect(radicalForm("水")).toBe("水");
    expect(isRadicalStandIn("水")).toBe(false);
    expect(isRadicalStandIn("汁")).toBe(true);
  });

  /* Every key in the map is a radical the index actually has: a form for a key RADKFILE does not use is a typo nothing else would catch. */
  it("maps only keys the index holds", () => {
    expect(Object.keys(RADICAL_FORMS).filter((key) => !KEYS.has(key))).toEqual([]);
  });

  /* A form is one character, which may sit above the BMP as 𠆢 does, and never the key it replaces. */
  it("gives each stand-in a single different character", () => {
    for (const [key, form] of Object.entries(RADICAL_FORMS)) {
      expect([...form], `${key} -> ${form}`).toHaveLength(1);
      expect(form).not.toBe(key);
    }
  });

  /* The two sides of 部 and 陸 are the same shape and RADKFILE keeps two keys because the kanji lists differ; both draw as 阝. */
  it("draws both village radicals as the same shape", () => {
    expect(radicalForm("邦")).toBe("阝");
    expect(radicalForm("阡")).toBe("阝");
  });

  /* EDRDG lists, in KRADFILE's header, the stand-ins it means and the Unicode character for each. This table is the package's own, and covers every one. */
  it("has a form for every stand-in EDRDG itself lists, 乞 aside, which is a kanji in its own right", () => {
    const listed = Object.keys(RADKFILE.unicode);
    expect(listed.length).toBeGreaterThanOrEqual(20);
    for (const key of listed) {
      if (key === "乞") continue;
      expect(RADICAL_FORMS[key], key).toBeDefined();
    }
  });

  it("agrees with EDRDG's own list wherever the two are the same character, or the same character by Unicode's own compatibility mapping", () => {
    // 个, 并, 尚 and 滴 are the very same character; EDRDG's 疔 and 禹 are the Kangxi block's ⽧ and ⽱, which Unicode folds to ours.
    for (const key of ["个", "并", "尚", "疔", "禹", "滴"]) expect(radicalForm(key).normalize("NFKC"), key).toBe(RADKFILE.unicode[key]!.normalize("NFKC"));
  });
});

/* Two of RADKFILE's 253 are miscounted; the rest agree with a Japanese school's count. */
describe("what RADKFILE miscounts", () => {
  it("files 乞 under three strokes and 舛 under six", () => {
    expect(radicalStrokes("乞", 2)).toBe(3);
    expect(radicalStrokes("舛", 7)).toBe(6);
  });

  it("leaves every other count as RADKFILE gives it", () => {
    expect(radicalStrokes("口", 3)).toBe(3);
    expect(radicalStrokes("込", 3)).toBe(3);
    expect(Object.keys(RADKFILE_STROKE_CORRECTIONS).filter((key) => !KEYS.has(key))).toEqual([]);
  });

  it("puts the two right in a copy, and changes nothing it was given", () => {
    const fixed = withCorrectedStrokes(RADKFILE.radicals);
    expect(fixed).toHaveLength(RADKFILE.radicals.length);
    expect(fixed.find((entry) => entry.radical === "乞")?.strokes).toBe(3);
    expect(fixed.find((entry) => entry.radical === "舛")?.strokes).toBe(6);
    expect(RADKFILE.radicals.find((entry) => entry.radical === "乞")?.strokes).toBe(2);
    expect(fixed.filter((entry, index) => entry.strokes !== RADKFILE.radicals[index]!.strokes).map((entry) => entry.radical).sort()).toEqual(["乞", "舛"]);
  });
});

/* KANJIDIC2 gives the strokes of every kanji, so a radical that is a kanji in its own right can be checked against it. */
describe("the stroke counts against KANJIDIC2", () => {
  const radicals = withCorrectedStrokes(RADKFILE.radicals);
  const own = radicals.filter((entry) => strokesOf(entry.radical) !== null);

  it("agree for every radical that is a kanji in its own right, once the two are put right, except the stand-ins, whose count is the shape's and not the kanji's", () => {
    expect(own.length).toBeGreaterThan(200);
    const disagree = own.filter((entry) => strokesOf(entry.radical) !== entry.strokes).map((entry) => entry.radical);
    expect(disagree.sort()).toEqual(Object.keys(RADICAL_FORMS).filter((key) => strokesOf(key) !== null).sort());
  });

  it("show that 乞 and 舛 are the two RADKFILE gets wrong", () => {
    for (const key of Object.keys(RADKFILE_STROKE_CORRECTIONS)) {
      const raw = RADKFILE.radicals.find((entry) => entry.radical === key)!.strokes;
      expect(raw, key).not.toBe(strokesOf(key));
      expect(RADKFILE_STROKE_CORRECTIONS[key], key).toBe(strokesOf(key));
    }
  });
});
