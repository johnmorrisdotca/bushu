// The pure half of the data builders: text in, plain data out. Nothing here reads a file or the network, so
// tests can feed it small samples, and the same input always makes the same output.

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/**
 * The date a file gives itself: the last of the dated signature lines in its header comment, such as
 * `#            Melbourne, Oct  2013`, as `2013-10`. Null when the header has none.
 */
export function headerDate(text) {
  let found = null;
  for (const line of text.split("\n")) {
    if (!line.startsWith("#")) continue;
    const match = /^#\s+(?:Jim Breen, )?(?:Tokyo|Melbourne),?\s+([A-Za-z]+)\s+(\d{4})\s*$/.exec(line);
    if (match === null) continue;
    const month = MONTHS.indexOf(match[1].slice(0, 3).toLowerCase());
    if (month >= 0) found = `${match[2]}-${String(month + 1).padStart(2, "0")}`;
  }
  return found;
}

/**
 * RADKFILE: each radical (or common element) with its stroke count and every kanji written with it.
 * A line `$ 汁 3 4653` opens a radical (the fourth word, the code of a kanji or an image that draws it better, is not kept);
 * the lines after it are its kanji, run together.
 */
export function parseRadkfile(text) {
  const radicals = [];
  let current = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("#") || line.trim() === "") continue;
    if (line.startsWith("$")) {
      const [, radical, strokes] = line.split(/\s+/);
      if (radical === undefined || !/^\d+$/.test(strokes ?? "")) throw new Error(`RADKFILE: cannot read the line ${JSON.stringify(line)}`);
      current = { radical, strokes: Number(strokes), kanji: "" };
      radicals.push(current);
    } else if (current !== null) current.kanji += line.trim();
  }
  if (radicals.length === 0) throw new Error("RADKFILE parsed to nothing: its format may have changed");
  return { headerDate: headerDate(text), radicals };
}

/**
 * KRADFILE: each kanji with the radicals seen in it, one line a kanji, `亜 : 一 口 ｜`. Its header also lists the
 * Unicode character EDRDG means by each stand-in radical (`# 汁 U+2EA1`), read here as `unicode`.
 */
export function parseKradfile(text) {
  const kanji = new Map();
  const unicode = {};
  for (const line of text.split("\n")) {
    if (line.startsWith("#")) {
      const match = /^#\s+(\S)\s+U\+([0-9A-F]{4,6})\s*$/.exec(line);
      if (match !== null) unicode[match[1]] = String.fromCodePoint(Number.parseInt(match[2], 16));
      continue;
    }
    if (line.trim() === "") continue;
    const split = line.split(" : ");
    if (split.length !== 2) throw new Error(`KRADFILE: cannot read the line ${JSON.stringify(line)}`);
    kanji.set(split[0], split[1].trim().split(" "));
  }
  if (kanji.size === 0) throw new Error("KRADFILE parsed to nothing: its format may have changed");
  return { headerDate: headerDate(text), kanji, unicode };
}

/** Whether RADKFILE and KRADFILE say the same thing: every kanji has the same radicals in both. Returns the disagreements, [] when none. */
export function disagreements(radkfile, kradfile) {
  const inverted = new Map();
  for (const { radical, kanji } of radkfile.radicals) {
    for (const one of kanji) {
      if (!inverted.has(one)) inverted.set(one, new Set());
      inverted.get(one).add(radical);
    }
  }
  const problems = [];
  for (const [one, radicals] of kradfile.kanji) {
    const other = inverted.get(one) ?? new Set();
    if (radicals.length !== other.size || radicals.some((radical) => !other.has(radical))) problems.push(one);
  }
  for (const one of inverted.keys()) if (!kradfile.kanji.has(one)) problems.push(one);
  return problems;
}

/**
 * KANJIDIC2: the stroke count of each kanji. A few have more than one count listed; the first is the accepted one.
 * `onlyIn` limits it to the characters of a string.
 */
export function parseKanjidic(xml, onlyIn = null) {
  const wanted = onlyIn === null ? null : new Set([...onlyIn]);
  const strokes = new Map();
  for (const entry of xml.split("<character>").slice(1)) {
    const literal = /<literal>([^<]+)<\/literal>/.exec(entry)?.[1];
    const count = /<stroke_count>(\d+)<\/stroke_count>/.exec(entry)?.[1];
    if (literal === undefined || count === undefined) continue;
    if (wanted === null || wanted.has(literal)) strokes.set(literal, Number(count));
  }
  if (strokes.size === 0) throw new Error("KANJIDIC2 parsed to nothing: its format may have changed");
  return {
    fileVersion: /<file_version>([^<]+)</.exec(xml)?.[1] ?? null,
    databaseVersion: /<database_version>([^<]+)</.exec(xml)?.[1] ?? null,
    createdOn: /<date_of_creation>([^<]+)</.exec(xml)?.[1] ?? null,
    strokes,
  };
}

/** A CSV line, honouring quoted cells. */
function cells(line) {
  const out = [];
  let cell = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) {
      out.push(cell);
      cell = "";
    } else cell += char;
  }
  out.push(cell);
  return out.map((value) => value.trim());
}

/** A CSV file as rows of cells, its header row and blank lines left out. */
export function parseCsv(text) {
  return text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .slice(1)
    .map(cells);
}

/** The strokes grouped by count, for a compact file: { "1": "一乙", "2": "..." }, each string in code point order. */
export function groupByStrokes(strokes) {
  const groups = {};
  for (const [kanji, count] of [...strokes].sort((a, b) => a[1] - b[1] || a[0].codePointAt(0) - b[0].codePointAt(0))) groups[count] = (groups[count] ?? "") + kanji;
  return groups;
}
