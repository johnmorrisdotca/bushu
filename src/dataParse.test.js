// The parsers the data is built with (scripts/data-parse.mjs), on small samples: the same text always makes the same data.
import { describe, expect, it } from "vitest";

import { disagreements, groupByStrokes, headerDate, parseCsv, parseKanjidic, parseKradfile, parseRadkfile } from "../scripts/data-parse.mjs";

const RADK = `#
# Jim Breen, Tokyo, January 2001
#            Melbourne, July 2001
#            Melbourne, Oct  2013
#
$ 一 1
亜唖
明
$ 化 2 js01
伯
$ 日 4
明晴
`;

const KRAD = `# Melbourne, Mar  2023
# 化 U+2E85
# 个 U+201A2
亜 : 一
唖 : 一
明 : 一 日
伯 : 化
晴 : 日
`;

describe("the date a file gives itself", () => {
  it("is the last of its dated signature lines, as year and month", () => {
    expect(headerDate(RADK)).toBe("2013-10");
    expect(headerDate(KRAD)).toBe("2023-03");
  });

  it("is null when the header has none", () => {
    expect(headerDate("# nothing here\n$ 一 1\n")).toBeNull();
  });
});

describe("RADKFILE", () => {
  it("reads each radical with its strokes and every kanji after it, run together", () => {
    const { radicals } = parseRadkfile(RADK);
    expect(radicals).toEqual([
      { radical: "一", strokes: 1, kanji: "亜唖明" },
      { radical: "化", strokes: 2, kanji: "伯" },
      { radical: "日", strokes: 4, kanji: "明晴" },
    ]);
  });

  it("refuses a file it cannot read, rather than writing nothing", () => {
    expect(() => parseRadkfile("# only a comment\n")).toThrow(/RADKFILE/);
    expect(() => parseRadkfile("$ 一 many\n")).toThrow(/RADKFILE/);
  });
});

describe("KRADFILE", () => {
  it("reads each kanji with its radicals, and the Unicode characters its header lists", () => {
    const { kanji, unicode } = parseKradfile(KRAD);
    expect(kanji.get("明")).toEqual(["一", "日"]);
    expect(kanji.size).toBe(5);
    expect(unicode).toEqual({ 化: "⺅", 个: "\u{201A2}" });
  });

  it("refuses a file it cannot read", () => {
    expect(() => parseKradfile("# nothing\n")).toThrow(/KRADFILE/);
    expect(() => parseKradfile("亜 一\n")).toThrow(/KRADFILE/);
  });
});

describe("the two files agreeing", () => {
  it("finds no disagreement when one is the other turned round", () => {
    expect(disagreements(parseRadkfile(RADK), parseKradfile(KRAD))).toEqual([]);
  });

  it("finds a kanji whose parts differ, and one that is in only one file", () => {
    const changed = parseKradfile(KRAD.replace("晴 : 日", "晴 : 日 一"));
    expect(disagreements(parseRadkfile(RADK), changed)).toEqual(["晴"]);
    const missing = parseKradfile(KRAD.replace("晴 : 日\n", ""));
    expect(disagreements(parseRadkfile(RADK), missing)).toEqual(["晴"]);
  });
});

describe("KANJIDIC2", () => {
  const XML = `<header><file_version>4</file_version><database_version>2026-274</database_version><date_of_creation>2026-10-01</date_of_creation></header>
<character><literal>亜</literal><misc><grade>8</grade><stroke_count>7</stroke_count></misc></character>
<character><literal>唖</literal><misc><stroke_count>10</stroke_count><stroke_count>11</stroke_count></misc></character>
<character><literal>x</literal><misc></misc></character>`;

  it("reads the first stroke count of each kanji, and what the file says of itself", () => {
    const read = parseKanjidic(XML);
    expect([...read.strokes]).toEqual([["亜", 7], ["唖", 10]]);
    expect(read.fileVersion).toBe("4");
    expect(read.databaseVersion).toBe("2026-274");
    expect(read.createdOn).toBe("2026-10-01");
  });

  it("keeps only the kanji asked for", () => {
    expect([...parseKanjidic(XML, "唖").strokes]).toEqual([["唖", 10]]);
  });

  it("refuses a file it cannot read", () => {
    expect(() => parseKanjidic("<nothing/>")).toThrow(/KANJIDIC2/);
  });
});

describe("grouping and CSV", () => {
  it("groups the strokes by count, in code point order", () => {
    expect(groupByStrokes(new Map([["日", 4], ["一", 1], ["月", 4], ["二", 2]]))).toEqual({ 1: "一", 2: "二", 4: "日月" });
  });

  it("reads quoted cells, and leaves the header row out", () => {
    expect(parseCsv('a,b\n1,"x, y"\n\n2,z\n')).toEqual([["1", "x, y"], ["2", "z"]]);
  });
});
