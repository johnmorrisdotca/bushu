// Packs the package the way it is published (`npm pack`, npm and not pnpm),
// installs the tarball into an empty project, and uses it as somebody who
// installed it would: every entry in `exports` imported by ESM and loaded by
// `require`, and each command in `bin` run. A package whose `exports` name a
// file that is not in the tarball fails here, before it can be published.
// `pnpm test:package` builds first.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const windows = process.platform === "win32";
const scratch = mkdtempSync(join(tmpdir(), "bushu-package-"));

/** Run a command and hand back what it printed. On Windows, npm and the installed commands are .cmd files, which only a shell runs; node itself is run directly. */
function run(command, args, cwd, viaShell = false) {
  const shell = viaShell && windows;
  // A path is quoted for the shell; a bare name such as npm is left for the shell to find.
  const ran = spawnSync(shell && /[\\/]/.test(command) ? `"${command}"` : command, args, { cwd, encoding: "utf8", shell });
  if (ran.status !== 0) {
    console.error(`FAIL ${command} ${args.join(" ")}\n${ran.stdout}\n${ran.stderr}`);
    process.exit(1);
  }
  return ran.stdout;
}

// 1. Pack, with npm.
const packed = JSON.parse(run("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", scratch], root, true));
const tarball = join(scratch, packed[0].filename);
const inTarball = new Set(packed[0].files.map((file) => file.path));
console.log(`ok   npm pack: ${packed[0].filename}, ${packed[0].files.length} files`);

// 2. Everything package.json points at is in the tarball.
const pointed = [pkg.main, pkg.module, pkg.types, ...Object.values(pkg.bin ?? {}), ...Object.values(pkg.exports).flatMap((entry) => (typeof entry === "string" ? [entry] : Object.values(entry)))];
for (const file of new Set(pointed)) {
  if (!inTarball.has(file.replace(/^\.\//, ""))) {
    console.error(`FAIL package.json points at ${file}, which is not in the tarball`);
    process.exit(1);
  }
}
console.log(`ok   every file package.json points at is in the tarball (${new Set(pointed).size})`);

for (const named of pkg.files) {
  if (![...inTarball].some((file) => file === named || file.startsWith(`${named}/`))) {
    console.error(`FAIL package.json's files names ${named}, which is not in the tarball`);
    process.exit(1);
  }
}
console.log(`ok   everything in package.json's files is in the tarball (${pkg.files.length})`);

// 3. Install it into an empty project.
const project = join(scratch, "project");
mkdirSync(project);
writeFileSync(join(project, "package.json"), JSON.stringify({ name: "scratch", private: true, version: "0.0.0" }));
run("npm", ["install", "--no-audit", "--no-fund", "--silent", tarball], project, true);
console.log("ok   npm install of the tarball");

// What the built package in this checkout says, to be compared with what the installed one says.
const { RADKFILE: local } = await import(new URL("../dist/data/radkfile.data.js", import.meta.url).href);
const { kanjiForRadicals: localFind } = await import(new URL("../dist/index.js", import.meta.url).href);
const expected = localFind(local.radicals, ["日", "月"]).join("");
if (!expected.includes("明")) throw new Error("the built package does not find 明 by 日 and 月");

// 4. Every entry in `exports`, by ESM and by require.
const entries = Object.keys(pkg.exports).map((key) => (key === "." ? pkg.name : `${pkg.name}/${key.slice(2)}`));
writeFileSync(
  join(project, "esm.mjs"),
  `${entries.map((entry, i) => `import * as m${i} from ${JSON.stringify(entry)};`).join("\n")}
const all = [${entries.map((_, i) => `m${i}`).join(", ")}];
const names = ${JSON.stringify(entries)};
// An entry that only defines the tag on a page (the /define one) exports nothing, and is imported for its effect.
all.forEach((m, i) => { if (Object.keys(m).length === 0 && !names[i].endsWith("/define")) throw new Error(names[i] + " exports nothing"); });
const { kanjiForRadicals, usableRadicals, radicalForm, withCorrectedStrokes, VERSION } = m0;
const { RADKFILE } = await import(${JSON.stringify(`${pkg.name}/radkfile`)});
const { radicalName } = await import(${JSON.stringify(`${pkg.name}/names`)});
const { strokesOf, sortByStrokes } = await import(${JSON.stringify(`${pkg.name}/strokes`)});
if (RADKFILE.radicals.length !== ${local.radicals.length}) throw new Error("the installed RADKFILE has " + RADKFILE.radicals.length + " radicals");
if (kanjiForRadicals(RADKFILE.radicals, ["日", "月"]).join("") !== ${JSON.stringify(expected)}) throw new Error("the installed lookup of 日 and 月 differs");
if (usableRadicals(RADKFILE.radicals, ["日", "月"]).has("水")) throw new Error("水 is usable with 日 and 月");
if (radicalForm("汁") !== "氵" || radicalName("汁") !== "さんずい") throw new Error("汁 is not 氵, さんずい");
if (withCorrectedStrokes(RADKFILE.radicals).find((one) => one.radical === "乞").strokes !== 3) throw new Error("乞 is not three strokes");
if (strokesOf("明") !== 8 || sortByStrokes(["明", "日"]).join("") !== "日明") throw new Error("the strokes are wrong");
if (VERSION !== ${JSON.stringify(pkg.version)}) throw new Error("VERSION is " + VERSION);
const { bushuSay } = await import(${JSON.stringify(`${pkg.name}/picker`)});
if (bushuSay("en", "found", { n: 3 }) !== "3 kanji hold all of these parts.") throw new Error("the picker's words are wrong");
console.log(names.join(" "));
`,
);
writeFileSync(
  join(project, "cjs.cjs"),
  `const names = ${JSON.stringify(entries)};
for (const name of names) { const m = require(name); if (Object.keys(m).length === 0 && !name.endsWith("/define")) throw new Error(name + " exports nothing"); }
const { kanjiForRadicals } = require(${JSON.stringify(pkg.name)});
const { RADKFILE } = require(${JSON.stringify(`${pkg.name}/radkfile`)});
if (kanjiForRadicals(RADKFILE.radicals, ["日", "月"]).join("") !== ${JSON.stringify(expected)}) throw new Error("the lookup of 日 and 月 differs by require");
console.log(names.join(" "));
`,
);
console.log(`ok   import:  ${run(process.execPath, ["esm.mjs"], project).trim()}`);
console.log(`ok   require: ${run(process.execPath, ["cjs.cjs"], project).trim()}`);

// 5. Each command in `bin`, as installed.
for (const name of Object.keys(pkg.bin ?? {})) {
  const command = join(project, "node_modules", ".bin", windows ? `${name}.cmd` : name);
  const version = run(command, ["--version"], project, true).trim();
  if (version !== pkg.version) {
    console.error(`FAIL ${name} --version said ${version}`);
    process.exit(1);
  }
  const shuffled = run(command, ["--seed", "42", "--shuffle", "a", "b", "c"], project, true).replace(/\r\n/g, "\n");
  if (shuffled !== "c\na\nb\n") {
    console.error(`FAIL ${name} shuffled ${JSON.stringify(shuffled)}`);
    process.exit(1);
  }
  console.log(`ok   ${name} --version and a seeded shuffle, as installed`);
}

rmSync(scratch, { recursive: true, force: true });
console.log("the package installs and runs as published, on", process.platform, process.version);
