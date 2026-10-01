import { describe, expect, it } from "vitest";

import { RADKFILE } from "./data/radkfile.data.ts";
import { KANJI_STROKES } from "./data/strokes.data.ts";
import { RADICAL_NAMES } from "./data/names.data.ts";

const SHA = /^[0-9a-f]{64}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

describe("the radicals, as RADKFILE has them", () => {
  const { radicals } = RADKFILE;

  it("are the 253 elements of the file, each once", () => {
    expect(radicals).toHaveLength(253);
    expect(new Set(radicals.map((entry) => entry.radical)).size).toBe(253);
  });

  it("have a stroke count from 1 to 17, fewest first as the file has them", () => {
    const counts = radicals.map((entry) => entry.strokes);
    for (const count of counts) expect(Number.isInteger(count) && count >= 1 && count <= 17).toBe(true);
    expect(counts).toEqual([...counts].sort((a, b) => a - b));
  });

  it("each list the kanji that hold them, none twice", () => {
    for (const entry of radicals) {
      expect(entry.kanji.length, entry.radical).toBeGreaterThan(0);
      expect(new Set([...entry.kanji]).size, entry.radical).toBe([...entry.kanji].length);
    }
  });

  it("cover the 6,355 kanji of JIS X 0208, and every one has a part", () => {
    const covered = new Set(radicals.flatMap((entry) => [...entry.kanji]));
    expect(covered.size).toBe(6355);
    for (const kanji of covered) expect(kanji.codePointAt(0)!).toBeGreaterThanOrEqual(0x4e00);
  });

  it("hold the well-known facts", () => {
    const of = (key: string): string => radicals.find((entry) => entry.radical === key)!.kanji;
    expect(of("日")).toContain("明");
    expect(of("月")).toContain("明");
    expect(of("汁")).toContain("海");
    expect(of("言")).toContain("語");
  });
});

describe("where the data came from, as it says itself", () => {
  it("names the files it was made from with their addresses, dates and SHA-256", () => {
    for (const source of Object.values(RADKFILE.sources)) {
      expect(source.url).toMatch(/^http:\/\/ftp\.edrdg\.org\/pub\/Nihongo\/(radkfile|kradfile)\.gz$/);
      expect(source.sha256).toMatch(SHA);
      expect(source.retrieved).toMatch(DAY);
      expect(source.fileDate).toMatch(/^\d{4}-\d{2}$/);
    }
    expect(RADKFILE.sources.radkfile.name).toBe("RADKFILE");
    expect(RADKFILE.sources.kradfile.name).toBe("KRADFILE");
  });

  it("gives the strokes' source and the names' source the same", () => {
    expect(KANJI_STROKES.source.url).toBe("http://www.edrdg.org/kanjidic/kanjidic2.xml.gz");
    expect(KANJI_STROKES.source.sha256).toMatch(SHA);
    expect(KANJI_STROKES.source.fileDate).toMatch(DAY);
    expect(KANJI_STROKES.source.databaseVersion).toMatch(/^\d{4}-\d+$/);
    expect(Object.values(RADICAL_NAMES.source.files).every((hash) => SHA.test(hash))).toBe(true);
    expect(RADICAL_NAMES.source.url).toContain(RADICAL_NAMES.source.commit);
  });

  it("lists EDRDG's own Unicode characters for the stand-ins", () => {
    expect(RADKFILE.unicode["汁"]).toBe("⺡");
    expect(RADKFILE.unicode["化"]).toBe("⺅");
  });
});
