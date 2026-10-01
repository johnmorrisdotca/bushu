#!/usr/bin/env node
// WRITES THE RADICAL INDEX AND THE KANJI STROKE COUNTS from the Electronic Dictionary Research and Development
// Group's own files, so the data in this repository is machine output anybody can make again, never hand-kept.
//
//   node scripts/build-data.mjs                 fetches the three files from EDRDG and writes src/data/
//   node scripts/build-data.mjs --from DIR      reads radkfile.gz, kradfile.gz and kanjidic2.xml.gz from DIR instead
//   node scripts/build-data.mjs --date 2026-10-01   the day recorded as retrieved (default: today, UTC)
//
// The sources (read 2026-10-01):
//   RADKFILE   http://ftp.edrdg.org/pub/Nihongo/radkfile.gz              the radicals, each with its kanji
//   KRADFILE   http://ftp.edrdg.org/pub/Nihongo/kradfile.gz              the same the other way round, plus the Unicode
//                                                                         characters EDRDG means by its stand-in radicals
//   KANJIDIC2  http://www.edrdg.org/kanjidic/kanjidic2.xml.gz            the stroke count of each kanji
// All three are the property of the Electronic Dictionary Research and Development Group, used under the Creative
// Commons Attribution-ShareAlike 4.0 licence and the Group's conditions (https://www.edrdg.org/edrdg/licence.html), which
// ask a site using them to keep its copy current: see .github/workflows/radkfile-refresh.yml.
//
// Deterministic: the same three files and the same date make the same bytes. Each file's SHA-256 is written into the data,
// beside its address and the date the file gives itself, and a file whose SHA-256 is unchanged is not rewritten, so a month
// in which EDRDG changed nothing changes nothing here.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { gunzipSync } from "node:zlib";

import { disagreements, groupByStrokes, parseKanjidic, parseKradfile, parseRadkfile } from "./data-parse.mjs";

const SOURCES = {
  radkfile: { name: "RADKFILE", url: "http://ftp.edrdg.org/pub/Nihongo/radkfile.gz", file: "radkfile.gz" },
  kradfile: { name: "KRADFILE", url: "http://ftp.edrdg.org/pub/Nihongo/kradfile.gz", file: "kradfile.gz" },
  kanjidic: { name: "KANJIDIC2", url: "http://www.edrdg.org/kanjidic/kanjidic2.xml.gz", file: "kanjidic2.xml.gz" },
};
const OUT_RADKFILE = "src/data/radkfile.data.ts";
const OUT_STROKES = "src/data/strokes.data.ts";

const args = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const from = option("--from");
const today = option("--date") ?? new Date().toISOString().slice(0, 10);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

/** The bytes of one source: from the directory given, or from EDRDG. */
async function bytesOf(source) {
  if (from !== undefined) return new Uint8Array(readFileSync(join(from, source.file)));
  console.log(`Fetching ${source.url}`);
  const response = await fetch(source.url);
  if (!response.ok) throw new Error(`${source.name} fetch failed: ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
}

const radk = await bytesOf(SOURCES.radkfile);
const krad = await bytesOf(SOURCES.kradfile);
const dic = await bytesOf(SOURCES.kanjidic);
const hashes = { radkfile: sha256(radk), kradfile: sha256(krad), kanjidic: sha256(dic) };

/** The `retrieved` date a data file already carries when it was made from these very bytes, else today. */
function retrievedFor(path, hash) {
  if (!existsSync(path)) return today;
  return new RegExp(`sha256: "${hash}", retrieved: "(\\d{4}-\\d{2}-\\d{2})"`).exec(readFileSync(path, "utf8"))?.[1] ?? today;
}

// EUC-JP, not UTF-8: RADKFILE and KRADFILE predate it and are still published that way.
const radkfile = parseRadkfile(new TextDecoder("euc-jp").decode(gunzipSync(radk)));
const kradfile = parseKradfile(new TextDecoder("euc-jp").decode(gunzipSync(krad)));
const wrong = disagreements(radkfile, kradfile);
if (wrong.length > 0) throw new Error(`RADKFILE and KRADFILE disagree about ${wrong.length} kanji (${wrong.slice(0, 8).join(" ")}...): refusing to write either`);
const kanjiOfRadkfile = [...new Set(radkfile.radicals.flatMap((entry) => [...entry.kanji]))].join("");
const kanjidic = parseKanjidic(new TextDecoder("utf-8").decode(gunzipSync(dic)), kanjiOfRadkfile);
const missing = [...kanjiOfRadkfile].filter((kanji) => !kanjidic.strokes.has(kanji));
if (missing.length > 0) throw new Error(`KANJIDIC2 has no stroke count for ${missing.length} kanji of RADKFILE (${missing.slice(0, 8).join(" ")})`);

const sourceBlock = (source, hash, extra = "") => `{ name: ${JSON.stringify(source.name)}, url: ${JSON.stringify(source.url)}, ${extra}sha256: ${JSON.stringify(hash)}, retrieved: ${JSON.stringify(retrievedFor(source === SOURCES.kanjidic ? OUT_STROKES : OUT_RADKFILE, hash))} }`;

const radkfileText = `import type { Radical } from "../types.ts";

/**
 * THE RADICALS AND THEIR KANJI, from RADKFILE. Written by \`scripts/build-data.mjs\`, never edited by hand; the monthly
 * refresh (.github/workflows/radkfile-refresh.yml) runs the script again.
 *
 * RADKFILE and KRADFILE are the property of the Electronic Dictionary Research and Development Group (EDRDG), used under
 * the Creative Commons Attribution-ShareAlike 4.0 licence and the Group's conditions:
 * https://www.edrdg.org/edrdg/licence.html. This data is derived from them and is under the same licence (see NOTICE.md).
 *
 * ${radkfile.radicals.length} radicals, in the file's own order (fewest strokes first), each with its stroke count as RADKFILE writes it
 * and every kanji that holds it; ${kanjiOfRadkfile.length} kanji in all (the JIS X 0208 set). A radical with no character of its own is keyed by a kanji that
 * holds the shape (汁 for 氵): \`radicalForm\` says the shape. KRADFILE, which lists the same thing kanji by kanji, was checked to
 * agree with RADKFILE on every one of the ${kradfile.kanji.size} kanji before this was written. \`unicode\` is the character EDRDG means by a stand-in,
 * from KRADFILE's header.
 */
export const RADKFILE: {
  /** What this was made from: each file's address, SHA-256 (of the file as served, gzipped) and the date this was made, and the date the file gives itself. */
  sources: Record<"radkfile" | "kradfile", { name: string; url: string; fileDate: string | null; sha256: string; retrieved: string }>;
  radicals: readonly Radical[];
  unicode: Readonly<Record<string, string>>;
} = {
  sources: {
    radkfile: ${sourceBlock(SOURCES.radkfile, hashes.radkfile, `fileDate: ${JSON.stringify(radkfile.headerDate)}, `)},
    kradfile: ${sourceBlock(SOURCES.kradfile, hashes.kradfile, `fileDate: ${JSON.stringify(kradfile.headerDate)}, `)},
  },
  radicals: [
${radkfile.radicals.map((entry) => `    { radical: ${JSON.stringify(entry.radical)}, strokes: ${entry.strokes}, kanji: ${JSON.stringify(entry.kanji)} },`).join("\n")}
  ],
  unicode: ${JSON.stringify(kradfile.unicode)},
};
`;

const groups = groupByStrokes(kanjidic.strokes);
const strokesText = `/**
 * THE STROKE COUNT OF EVERY KANJI IN THE RADICAL INDEX, from KANJIDIC2. Written by \`scripts/build-data.mjs\`, never edited by
 * hand; the monthly refresh (.github/workflows/radkfile-refresh.yml) runs the script again.
 *
 * KANJIDIC2 is the property of the Electronic Dictionary Research and Development Group (EDRDG), used under the Creative
 * Commons Attribution-ShareAlike 4.0 licence and the Group's conditions: https://www.edrdg.org/edrdg/licence.html. This data is
 * derived from it and is under the same licence (see NOTICE.md).
 *
 * ${kanjidic.strokes.size} kanji, grouped by their stroke count so that a count is one string; where KANJIDIC2 lists more
 * than one count for a kanji, this is the first, the accepted one.
 */
export const KANJI_STROKES: {
  /** What this was made from: the file's address, SHA-256 (of the file as served, gzipped), the date this was made, and what the file says of itself. */
  source: { name: string; url: string; fileVersion: string | null; databaseVersion: string | null; fileDate: string | null; sha256: string; retrieved: string };
  /** Stroke count to the kanji with that many, in code point order. */
  byStrokes: Readonly<Record<string, string>>;
} = {
  source: ${sourceBlock(SOURCES.kanjidic, hashes.kanjidic, `fileVersion: ${JSON.stringify(kanjidic.fileVersion)}, databaseVersion: ${JSON.stringify(kanjidic.databaseVersion)}, fileDate: ${JSON.stringify(kanjidic.createdOn)}, `)},
  byStrokes: {
${Object.entries(groups).map(([count, kanji]) => `    ${JSON.stringify(count)}: ${JSON.stringify(kanji)},`).join("\n")}
  },
};
`;

writeFileSync(OUT_RADKFILE, radkfileText);
writeFileSync(OUT_STROKES, strokesText);
console.log(`Wrote ${radkfile.radicals.length} radicals covering ${kanjiOfRadkfile.length} kanji to ${OUT_RADKFILE}`);
console.log(`Wrote ${kanjidic.strokes.size} stroke counts to ${OUT_STROKES}`);
console.log(`RADKFILE ${hashes.radkfile} (${radkfile.headerDate}), KRADFILE ${hashes.kradfile} (${kradfile.headerDate}), KANJIDIC2 ${hashes.kanjidic} (${kanjidic.createdOn})`);
