// The documents and the demo, held to the source. Plain JavaScript, so that reading files needs no Node types.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import process from "node:process";

import { describe, expect, it } from "vitest";

import { RADKFILE } from "./data/radkfile.data.ts";
import { RADICAL_NAMES } from "./data/names.data.ts";
import { KANJI_STROKES } from "./data/strokes.data.ts";
import { BushuPicker } from "./element.ts";
import { RADICAL_FORMS } from "./forms.ts";
import { radicalName, radicalNameCount } from "./names.ts";
import { BUSHU_RESULT_LIMIT } from "./picker.ts";
import { BUSHU_STRINGS } from "./strings.ts";
import { BUSHU_STYLE } from "./style.ts";
import { VERSION } from "./version.ts";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const readme = readFileSync("README.md", "utf8");
const notice = readFileSync("NOTICE.md", "utf8");

/** A README section's text, from its heading to the next heading of the same level. */
const section = (heading) => {
  const from = readme.indexOf(`\n## ${heading}\n`);
  if (from < 0) throw new Error(`no “## ${heading}” in the README`);
  const next = readme.indexOf("\n## ", from + 5);
  return readme.slice(from, next < 0 ? undefined : next);
};

/** The cells of every table row in a piece of text, header and rule rows left out. */
const rows = (text) =>
  text
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|[\s|:-]+\|$/.test(line))
    .map((line) => line.split(/(?<!\\)\|/).slice(1, -1).map((cell) => cell.replace(/\\\|/g, "|").trim()));

/** The custom properties a block of CSS declares: { name: value }. */
const declarations = (css) => Object.fromEntries([...css.matchAll(/(--[a-z0-9-]+):\s*([^;}]+)[;}]/g)].map((match) => [match[1], match[2].trim()]));
const grouped = (n) => n.toLocaleString("en-US");

describe("the documents", () => {
  it("say the version package.json says, in the code and at the top of the changelog", () => {
    expect(VERSION).toBe(pkg.version);
    expect(readFileSync("CHANGELOG.md", "utf8")).toMatch(new RegExp(`^## \\[${pkg.version.replace(/\./g, "\\.")}\\] `, "m"));
  });

  it("name in the README every entry package.json exports, and no other", () => {
    const exported = Object.keys(pkg.exports).filter((key) => key !== ".").map((key) => `${pkg.name}/${key.slice(2)}`);
    for (const entry of exported) expect(readme, entry).toContain(`\`${entry}\``);
  });

  it("name in the README every attribute of the element", () => {
    for (const attribute of BushuPicker.observedAttributes) expect(readme, attribute).toMatch(new RegExp(`\`${attribute}[\`=]|\`${attribute}\``));
  });

  it("keep the family's stylesheet byte for byte, as its first line's hash says", () => {
    const [first, ...rest] = readFileSync("demo/family.css", "utf8").split("\n");
    const hash = /sha256 of every line after this one: ([0-9a-f]{64})/.exec(first)?.[1];
    expect(createHash("sha256").update(rest.join("\n")).digest("hex")).toBe(hash);
  });
});

describe("the README's promises", () => {
  it("has the sections a package of this family has, each with something in it", () => {
    for (const heading of ["In 30 seconds", "Who it is for", "Features", "Use it in your project", "The data", "Shapes and names", "The picker", "API", "Theming", "Limits", "Browser and runtime support", "Languages", "Architecture", "The name", "Where it comes from, and where it is used", "Roadmap", "Development", "Contributing", "Changes", "Licence"]) {
      expect(section(heading).length, heading).toBeGreaterThan(heading.length + 40);
    }
  });

  it("installs the package it is, and every version it names is the one in package.json", () => {
    expect(readme).toContain(`npm install ${pkg.name}`);
    const major = pkg.version.split(".")[0];
    const named = [...readme.matchAll(/@johnmorrisdotca\/bushu@([\w.-]+)/g)].map((match) => match[1]);
    expect(named.length).toBeGreaterThan(0);
    for (const version of named) expect(version).toBe(major);
    expect(readme).not.toMatch(/\bbushu@\d+\.\d+/);
  });

  it("links only to files that exist", () => {
    const targets = [...readme.matchAll(/\]\((?!https?:|#|mailto:)([^)\s#]+)/g)].map((match) => match[1]);
    expect(targets.length).toBeGreaterThan(5);
    for (const target of targets) expect(existsSync(target), target).toBe(true);
  });

  it("lists every package of the family, with its kana, as the demo's footer does", () => {
    const template = readFileSync("scripts/family-template.mjs", "utf8");
    const family = [...template.matchAll(/\{ id: "([\w-]+)", name: "(\w+)", kana: "([^"]+)" \}/g)].map((match) => ({ id: match[1], name: match[2], kana: match[3] }));
    expect(family.length).toBeGreaterThanOrEqual(17);
    expect(family.some((one) => one.id === "bushu")).toBe(true);
    const block = readme.slice(readme.indexOf("### The family"), readme.indexOf("\n## ", readme.indexOf("### The family")));
    for (const { id, name, kana } of family) expect(block, id).toContain(`- [${name}](https://github.com/johnmorrisdotca/${id}) (${kana}`);
    const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twenty-one", "twenty-two"];
    expect(block).toContain(`one of ${words[family.length]} packages`);
    expect([...block.matchAll(/^- \[/gm)]).toHaveLength(family.length);
  });

  it("gives every colour of the picker with its light and dark values", () => {
    const light = declarations(BUSHU_STYLE.slice(0, BUSHU_STYLE.indexOf("@media")));
    const dark = declarations(BUSHU_STYLE.slice(BUSHU_STYLE.indexOf(':root[data-theme="dark"]')).split("}")[0]);
    const table = Object.fromEntries(rows(section("Theming")).filter((row) => row[0].startsWith("`--")).map((row) => [row[0].replace(/`/g, ""), row]));
    expect(Object.keys(table).sort()).toEqual(Object.keys(light).sort());
    for (const [name, value] of Object.entries(light)) {
      expect(table[name][2], name).toBe(`\`${value}\``);
      expect(table[name][3], name).toBe(dark[name] === undefined || dark[name] === value ? "the same" : `\`${dark[name]}\``);
    }
  });

  it("lists every stand-in and its shape and school name, as the code has them", () => {
    const table = rows(section("Shapes and names")).filter((row) => row[0].startsWith("`") && row.length === 3);
    expect(table).toHaveLength(Object.keys(RADICAL_FORMS).length);
    for (const [key, shape] of Object.entries(RADICAL_FORMS)) {
      const row = table.find((one) => one[0] === `\`${key}\``);
      expect(row, key).toBeDefined();
      expect(row[1], key).toBe(shape);
      expect(row[2], key).toBe(radicalName(key) ?? "(none)");
    }
    expect(readme).toContain(`These are all ${Object.keys(RADICAL_FORMS).length}`);
  });

  it("states the numbers of the data as the data has them", () => {
    const kanji = new Set(RADKFILE.radicals.flatMap((entry) => [...entry.kanji])).size;
    expect(readme).toContain(`The 253 radicals and their ${grouped(kanji)} kanji`.replace("253", String(RADKFILE.radicals.length)));
    expect(readme).toContain(`${RADKFILE.radicals.length} parts, each with every kanji that holds it`);
    expect(readme).toContain(`${radicalNameCount()} of the ${RADKFILE.radicals.length}`);
    expect(readme).toContain(`${RADKFILE.radicals.length - radicalNameCount()} of the ${RADKFILE.radicals.length} are components no school lists`);
    const limits = section("Limits");
    expect(limits).toContain(`| Radicals | ${RADKFILE.radicals.length} |`);
    expect(limits).toContain(`| Kanji in the index | ${grouped(kanji)},`);
    expect(limits).toContain(`| Stand-ins drawn as shapes | ${Object.keys(RADICAL_FORMS).length} |`);
    expect(limits).toContain(`| Radicals with a school name | ${radicalNameCount()} of ${RADKFILE.radicals.length} |`);
    expect(limits).toContain(`| Matches a picker draws | ${BUSHU_RESULT_LIMIT} unless`);
    const counts = Object.keys(KANJI_STROKES.byStrokes).map(Number);
    expect(limits).toContain(`| Stroke counts | ${Math.min(...counts)} to ${Math.max(...counts)} for a kanji, 1 to ${Math.max(...RADKFILE.radicals.map((entry) => entry.strokes))} for a radical |`);
    expect(pkg.description).toContain(`${RADKFILE.radicals.length} radicals and their ${grouped(kanji)} kanji`);
  });

  it("keeps docs/strings-ja.md as the picker's words, English beside Japanese (pnpm docs:make rewrites it)", () => {
    const cell = (text) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");
    const lines = ["# Bushu's words, in English and Japanese", "", "Made from `src/strings.ts` by `pnpm docs:make`; a test fails if the two differ, so this list is never out of date.", "", "**The Japanese has not yet been reviewed by a native reader.** If a line reads wrongly or unnaturally, please", "open a *Fix a translation* issue with the string's name. `{name}` and the other braces are filled in when shown.", "", "| Name | English | Japanese |", "| --- | --- | --- |"];
    for (const key of Object.keys(BUSHU_STRINGS.en)) lines.push(`| \`${key}\` | ${cell(BUSHU_STRINGS.en[key])} | ${cell(BUSHU_STRINGS.ja[key] ?? "")} |`);
    const made = `${lines.join("\n")}\n`;
    if (process.env.UPDATE_DOCS === "1") writeFileSync("docs/strings-ja.md", made);
    expect(readFileSync("docs/strings-ja.md", "utf8")).toBe(made);
  });

  it("has the files a visitor looks for: the package's own issue templates, its security policy, and the rest of what its README links", () => {
    for (const file of [".github/ISSUE_TEMPLATE/report-a-bug.md", ".github/ISSUE_TEMPLATE/suggest-a-feature.md", ".github/ISSUE_TEMPLATE/fix-a-translation.md", ".github/ISSUE_TEMPLATE/add-my-project.md", ".github/ISSUE_TEMPLATE/config.yml", "SECURITY.md", "NOTICE.md"]) expect(existsSync(file), file).toBe(true);
    expect(readme).toContain("issues/new?template=fix-a-translation.md");
  });

  it("keeps SECURITY.md and CODE_OF_CONDUCT.md equal to the family's master text, a copy of which is kept in scripts/community", () => {
    for (const file of ["SECURITY.md", "CODE_OF_CONDUCT.md"]) expect(readFileSync(file, "utf8"), file).toBe(readFileSync(`scripts/community/${file}`, "utf8"));
  });
});

describe("the notice", () => {
  it("is held to the data: every source's address, SHA-256 and day retrieved are in NOTICE.md as the data has them", () => {
    for (const source of [...Object.values(RADKFILE.sources), KANJI_STROKES.source]) {
      expect(notice, source.name).toContain(source.url);
      expect(notice, source.name).toContain(source.sha256);
      expect(notice, source.name).toContain(source.retrieved);
    }
    expect(notice).toContain(RADICAL_NAMES.source.commit);
    for (const [file, hash] of Object.entries(RADICAL_NAMES.source.files)) {
      expect(notice, file).toContain(file);
      expect(notice, file).toContain(hash);
    }
    expect(notice).toContain(RADICAL_NAMES.source.retrieved);
  });

  it("names the licences, in the package's SPDX expression and in the words of each source", () => {
    expect(pkg.license).toBe("(MIT AND CC-BY-SA-4.0 AND CC-BY-4.0)");
    expect(notice).toContain("Creative Commons Attribution-ShareAlike 4.0");
    expect(notice).toContain("Creative Commons Attribution 4.0");
    expect(notice).toContain("https://www.edrdg.org/edrdg/licence.html");
    expect(readme).toContain("https://www.edrdg.org/edrdg/licence.html");
    expect(readme).toContain("Kanji alive");
  });

  it("ships with the package", () => {
    expect(pkg.files).toContain("NOTICE.md");
  });

  it("has a monthly refresh, as EDRDG's licence asks", () => {
    const workflow = readFileSync(".github/workflows/radkfile-refresh.yml", "utf8");
    expect(workflow).toMatch(/cron: "\d+ \d+ 1 \* \*"/);
    expect(workflow).toContain("scripts/build-data.mjs");
  });
});
