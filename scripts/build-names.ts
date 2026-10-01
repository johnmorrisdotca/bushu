#!/usr/bin/env node
/**
 * WRITES THE JAPANESE SCHOOL NAMES OF THE RADICALS from Kanji alive, so that the names in this repository are machine output
 * anybody can make again: `pnpm data:names`, or with `--from DIR` (japanese-radicals.csv and japanese-radicals-ids.csv saved from the
 * address below), and `--date YYYY-MM-DD` for the day recorded as retrieved.
 *
 * What a Japanese school calls a radical is not what a dictionary calls it. 氵 is さんずい (not "water"), 辶 is しんにょう, 艹 is
 * くさかんむり. Kanji alive (University of Chicago) publishes the 214 Kangxi radicals and their variants, 321 rows, each with its name
 * in hiragana and romaji, its meaning, and where it sits in a character (へん, つくり, かんむり...), under CC BY 4.0
 * (https://github.com/kanjialive/kanji-data-media, its LICENSE.md, read 2026-10-01). That is the source; this maps it onto RADKFILE's
 * 253, which is the set a picker draws.
 *
 * The files are read from one commit of that repository, so the names do not change under us. The join is by shape. RADKFILE keys a radical by a
 * stand-in kanji where the shape had no character (`radicalForm` turns 汁 back into 氵), and Kanji alive writes the Kangxi block,
 * where ⽔ folds to 水 under NFKC, or the radicals supplement, where ⺡ folds to nothing: the supplement forms are paired by hand
 * below, and a handful of rows whose glyph is a private-use character in Kanji alive's own font are paired by their reading.
 * Whatever neither reaches has no Japanese name, and nothing is guessed: 26 of RADKFILE's 253 are components no school lists as a
 * radical (九, 乞, 久, 井...).
 *
 * Needs Node 22.6 or later (it imports TypeScript: `--experimental-strip-types`, the default from Node 24).
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

import { RADKFILE } from "../src/data/radkfile.data.ts";
import { RADICAL_FORMS, radicalForm } from "../src/forms.ts";
import { parseCsv } from "./data-parse.mjs";

/** The commit of Kanji alive's repository the names are read from. */
const COMMIT = "e1e24d39fc43e839948a8c7e99743b0994dedad5";
const BASE = `https://raw.githubusercontent.com/kanjialive/kanji-data-media/${COMMIT}/language-data`;
const FILES = ["japanese-radicals.csv", "japanese-radicals-ids.csv"] as const;
const OUT = "src/data/names.data.ts";

/** Our form on the left, Kanji alive's row glyph on the right, for the shapes it writes in the radicals supplement (U+2E80-U+2EFF), which NFKC does not fold to the character we draw. */
const SUPPLEMENT_GLYPHS: Readonly<Record<string, string>> = {
  亻: "⺅", 刂: "⺉", 辶: "⻌", 氵: "⺡", 扌: "⺘", 艹: "⺾", 忄: "⺖", 犭: "⺨", 礻: "⺭", 耂: "⺹", 灬: "⺣", 衤: "⻂", 罒: "⺫", 幺: "⺓", 彑: "⺔", 攵: "⺙",
  麦: "⻨", 青: "⻘", 尢: "⺐", 西: "⻃", 黄: "⻩", 亀: "⻲", 歯: "⻭", 无: "⺛", 長: "⻑", 斉: "⻫",
};

/** The two sides of 阝 are two rows in Kanji alive and two keys in RADKFILE, and they share a form, so they are paired by key rather than by shape. */
const KEYED_GLYPHS: Readonly<Record<string, string>> = { 邦: "⻏", 阡: "⻖" };

/** Rows whose glyph Kanji alive could only draw in its own font, paired by their reading instead; and shapes a Japanese dictionary files under a Kangxi radical it does not resemble under NFKC (已 under 己). */
const READINGS: Readonly<Record<string, string>> = { 并: "はちがしら", 王: "おうへん", 戸: "とだれ", 牙: "きば", 已: "おのれ", 竜: "りゅう" };

/** Stand-ins that may go without a name: no school teaches them as a shape. */
const MAY_GO_UNNAMED = new Set(["マ", "ユ", "滴", "ノ", "｜"]);

type Row = { strokes: number; glyph: string; meaning: string; reading: string; romaji: string; position: string | null; kangxi: number | null };

const args = process.argv.slice(2);
const option = (name: string): string | undefined => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const from = option("--from");
const today = option("--date") ?? new Date().toISOString().slice(0, 10);

async function textOf(file: string): Promise<{ text: string; sha256: string }> {
  let bytes: Uint8Array;
  if (from !== undefined) bytes = new Uint8Array(readFileSync(join(from, file)));
  else {
    console.log(`Fetching ${BASE}/${file}`);
    const response = await fetch(`${BASE}/${file}`);
    if (!response.ok) throw new Error(`${file} fetch failed: ${response.status}`);
    bytes = new Uint8Array(await response.arrayBuffer());
  }
  return { text: new TextDecoder("utf-8").decode(bytes), sha256: createHash("sha256").update(bytes).digest("hex") };
}

const fold = (glyph: string): string => glyph.normalize("NFKC");
/** A private-use glyph is Kanji alive's own font speaking; nothing else can read it. */
const isPrivateUse = (glyph: string): boolean => {
  const code = glyph.codePointAt(0);
  return code !== undefined && code >= 0xe000 && code <= 0xf8ff;
};

const [namesFile, idsFile] = await Promise.all(FILES.map(textOf));
const names = parseCsv(namesFile!.text);
const ids = parseCsv(idsFile!.text);
if (names.length !== ids.length) throw new Error(`the two Kanji alive files disagree: ${names.length} names against ${ids.length} ids`);

// A variant row carries no Kangxi number of its own, only the id of the radical it varies; the number is the parent's.
const kangxiById = new Map(ids.map((row) => [row[0], row[1] ? Number(row[1]) : null]));
const rows: Row[] = names.map((row, index) => {
  const [strokes, glyph, meaning, reading, romaji, positionJ] = row;
  const [, own, , idGlyph, idRomaji, variantOfId] = ids[index]!;
  const kangxi = own ? Number(own) : variantOfId ? (kangxiById.get(variantOfId) ?? null) : null;
  if (idRomaji !== romaji || (idGlyph && glyph && idGlyph !== glyph)) throw new Error(`row ${index + 2} is not the same radical in both files: ${romaji} against ${idRomaji}`);
  return {
    strokes: Number(strokes),
    glyph: glyph ?? "",
    meaning: meaning ?? "",
    reading: reading ?? "",
    romaji: romaji ?? "",
    // "かまえ, くにがまえ" names the family and the member; the member is the position.
    position: positionJ ? (positionJ.split(",").pop()?.trim() ?? null) : null,
    kangxi,
  };
});

function findRow(key: string): Row | null {
  const form = radicalForm(key);
  const wanted = KEYED_GLYPHS[key] ?? SUPPLEMENT_GLYPHS[form];
  if (wanted) return rows.find((row) => row.glyph === wanted) ?? null;
  const reading = READINGS[key];
  if (reading) return rows.find((row) => row.reading === reading) ?? null;
  const folded = fold(form);
  return rows.find((row) => row.glyph.length > 0 && !isPrivateUse(row.glyph) && fold(row.glyph) === folded) ?? null;
}

const named: Record<string, { name: string; romaji: string; meaning: string; position: string | null; kangxi: number | null }> = {};
const unnamed: string[] = [];
for (const { radical } of RADKFILE.radicals) {
  const row = findRow(radical);
  if (row === null) unnamed.push(radical);
  else named[radical] = { name: row.reading, romaji: row.romaji, meaning: row.meaning.split(",")[0]?.trim() ?? row.meaning, position: row.position, kangxi: row.kangxi };
}

// Every pairing written by hand must still find its row, or it has rotted.
for (const [key, glyph] of Object.entries(KEYED_GLYPHS)) if (!rows.some((row) => row.glyph === glyph)) throw new Error(`Kanji alive no longer has ${glyph} for ${key}`);
for (const glyph of Object.values(SUPPLEMENT_GLYPHS)) if (!rows.some((row) => row.glyph === glyph)) throw new Error(`Kanji alive no longer has ${glyph}`);
for (const [key, reading] of Object.entries(READINGS)) if (!rows.some((row) => row.reading === reading)) throw new Error(`Kanji alive no longer has ${reading} for ${key}`);
// And every stand-in a form is drawn for must have been named, or the fix that draws 氵 for 汁 leaves it named "soup" in Japanese too.
const unnamedForms = Object.keys(RADICAL_FORMS).filter((key) => !named[key] && !MAY_GO_UNNAMED.has(key));
if (unnamedForms.length > 0) throw new Error(`stand-ins with no Japanese name: ${unnamedForms.join(" ")}`);

const retrieved = (() => {
  if (!existsSync(OUT)) return today;
  const match = new RegExp(`${namesFile!.sha256}", .*?retrieved: "(\\d{4}-\\d{2}-\\d{2})"`, "s").exec(readFileSync(OUT, "utf8"));
  return match?.[1] ?? today;
})();

const text = `/**
 * THE JAPANESE SCHOOL NAMES OF THE RADICALS, from Kanji alive. Written by \`scripts/build-names.ts\` (\`pnpm data:names\`), never edited by hand.
 *
 * Kanji alive, by Harumi Hibino Lory and Arno Bosse (University of Chicago), is used under the Creative Commons Attribution 4.0
 * licence (https://creativecommons.org/licenses/by/4.0/); its radicals table is read from one commit of
 * https://github.com/kanjialive/kanji-data-media. These names are derived from it and are under the same licence (see NOTICE.md).
 *
 * ${Object.keys(named).length} of RADKFILE's ${RADKFILE.radicals.length} radicals have a name; the other ${unnamed.length} are components no school lists as a radical, and are left out rather than guessed.
 * Keyed by the RADKFILE key, as everything about a radical is, so a stand-in is looked up as written: 汁 answers さんずい.
 */
export const RADICAL_NAMES: {
  /** What this was made from: the commit of Kanji alive's repository, the two files read, and the date this was made. */
  source: { name: string; publisher: string; url: string; commit: string; licence: string; files: Readonly<Record<string, string>>; retrieved: string };
  names: Readonly<Record<string, { name: string; romaji: string; meaning: string; position: string | null; kangxi: number | null }>>;
} = {
  source: {
    name: "Kanji alive",
    publisher: "Harumi Hibino Lory and Arno Bosse, University of Chicago",
    url: "https://github.com/kanjialive/kanji-data-media/tree/${COMMIT}/language-data",
    commit: ${JSON.stringify(COMMIT)},
    licence: "CC BY 4.0",
    files: { ${JSON.stringify(FILES[0])}: ${JSON.stringify(namesFile!.sha256)}, ${JSON.stringify(FILES[1])}: ${JSON.stringify(idsFile!.sha256)} },
    retrieved: ${JSON.stringify(retrieved)},
  },
  names: {
${Object.entries(named).map(([key, entry]) => `    ${JSON.stringify(key)}: ${JSON.stringify(entry).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ").replace(/\{/, "{ ").replace(/\}$/, " }")},`).join("\n")}
  },
};
`;
writeFileSync(OUT, text);
console.log(`Named ${Object.keys(named).length} of ${RADKFILE.radicals.length} radicals in ${OUT}`);
console.log(`No Japanese name (${unnamed.length}): ${unnamed.join(" ")}`);
