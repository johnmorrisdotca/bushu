// What must never be in this repository. The data is EDRDG's and Kanji alive's, and the code is ours: no other course's radical names,
// mnemonics, ids or levels, no personal data and no keys. A tripwire, read over every file that is published or built.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const FORBIDDEN = [/wani\s*kani/i, /tofugu/i, /\bwk[-_ ]?(?:level|subject|id|catalog)/i, /@gmail\./i, /\/Users\//, /\bpassword\b/i, /\bapi[-_ ]?token\b/i, /colleague/i, /heisig/i];
const SKIP = new Set(["node_modules", "dist", "site", ".git", "test-results", "playwright-report", "pnpm-lock.yaml"]);
const THIS = "clean.test.js";

/** Every text file of the repository, by path. */
function files(dir = ".") {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(ts|js|mjs|json|md|css|html|yml|yaml|txt)$/.test(name) && name !== THIS ? [path] : [];
  });
}

describe("what is not in the repository", () => {
  it("has no other course's content, no personal data and no keys, in any file", () => {
    const hits = [];
    for (const path of files()) {
      const text = readFileSync(path, "utf8");
      for (const pattern of FORBIDDEN) if (pattern.test(text)) hits.push(`${path}: ${pattern}`);
    }
    expect(hits).toEqual([]);
  });
});
