<h1 align="center">Bushu <sub>部首</sub></h1>

<p align="center"><strong>Find a kanji by the parts it is made of, for JavaScript and TypeScript.</strong><br>
Choose the parts you can see, and get every kanji that holds all of them, with the parts that could still narrow the search kept lit and the rest dimmed: the multi-radical lookup that dictionary sites have, as a small package. The 253 radicals and their 6,355 kanji from RADKFILE, the shapes people see (氵 for the 汁 the file keys it by), the names a Japanese school teaches (さんずい, にんべん), the strokes of every kanji, and a radical picker for any page, as a function call or a tag, in English and Japanese. No dependencies.</p>

<p align="center">
  <a href="https://github.com/johnmorrisdotca/bushu/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/johnmorrisdotca/bushu/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@johnmorrisdotca/bushu"><img alt="npm" src="https://img.shields.io/npm/v/@johnmorrisdotca/bushu?color=2f5d4a"></a>
  <a href="./NOTICE.md"><img alt="Code MIT; data CC BY-SA 4.0 and CC BY 4.0" src="https://img.shields.io/badge/licence-MIT%20code%2C%20CC%20BY--SA%20data-2f5d4a"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-0-2f5d4a">
  <img alt="TypeScript" src="https://img.shields.io/badge/types-TypeScript-3178c6">
</p>

<p align="center"><a href="https://johnmorrisdotca.github.io/bushu/"><strong>Find a kanji →</strong></a> · <a href="https://johnmorrisdotca.github.io/bushu/api.html">API reference</a></p>

<table align="center">
<tr>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/hero-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/hero-desk-light.webp" alt="The demo on a desk, in English: the page header with the language chooser, five cloth patches and the Help switch, the grid of 253 radicals by stroke count on the left with the parts that cannot narrow the search dimmed, and on the right the chosen parts 日 sun and 月 moon, the line &quot;31 kanji hold all of these parts&quot;, the list of those kanji with 明 selected, and the card of 明 with its eight strokes and its two parts" width="600">
</picture>
<br><em>The demo on a desk: 日 and 月 chosen, 31 kanji hold both, 明 opened.</em>
</td>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/hero-phone-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/hero-phone-light.webp" alt="The demo on a phone, in Japanese: the part 氵 chosen with its school name さんずい, the line saying how many kanji hold it, the list of kanji, the card of 海 with its strokes and parts, and the start of the grid of parts under its stroke headings" width="190">
</picture>
<br><em>On a phone, in Japanese, in the device's light or dark.</em>
</td>
</tr>
</table>

You cannot type a kanji you cannot read, and you cannot look it up by a reading you do not know. But you can see that it has 氵 on the left and 毎 on the right.
Bushu is that lookup: choose the parts, and the kanji that hold all of them are listed, simplest first. It is a package for finding kanji by their parts, and
a picker built from it, which is in [the demo](https://johnmorrisdotca.github.io/bushu/) with nothing to install.

## In 30 seconds

```sh
npm install @johnmorrisdotca/bushu
```

```ts
import { kanjiForRadicals, radicalForm, usableRadicals } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
import { radicalName } from "@johnmorrisdotca/bushu/names";

const radicals = RADKFILE.radicals;                  // 253 parts, each with every kanji that holds it
kanjiForRadicals(radicals, ["日", "月"]);            // ["厭", "臆", …, "明", …]: the kanji with both parts
usableRadicals(radicals, ["日", "月"]);              // the parts that can still narrow them: dim the others
radicalForm("汁");                                   // "氵": RADKFILE keys a shape by a kanji that holds it
radicalName("汁");                                   // "さんずい": what a school calls it
```

And in a page, the whole picker, with nothing else to set up:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/bushu@1/dist/element-define.js"></script>
<bushu-picker lang="ja" parts="氵 日"></bushu-picker>
```

## Who it is for

- **Kanji dictionaries and study apps** that want a lookup by parts for a reader who cannot type the character, as Jisho and WWWJDIC have, without a server: the data is a plain import and the search is a set intersection.
- **Anyone who needs the decomposition**: which parts is this kanji made of, and which kanji hold this part, in the 6,355 kanji of JIS X 0208, with the shapes and the names of the parts as people see and say them.
- **Pages that want the picker**: the grid by stroke count, the narrowing, the card of a kanji, in English and Japanese, as one call or one tag.

## Features

- **Every part narrows.** The matches are the kanji that hold all of the chosen parts, and `usableRadicals` says which other parts still lead anywhere, so a picker can dim the dead ends instead of letting a reader click their way to an empty list.
- **The data is EDRDG's own**: RADKFILE's 253 radicals with their 6,355 kanji, checked against KRADFILE, which lists the same thing from the other side, and rebuilt from the Group's files by a script that records each file's address, date and SHA-256.
- **The shapes people see.** RADKFILE has no character for 氵, 扌 or 艹 and keys each by a kanji that holds it (汁, 扎, 艾), with the radical's stroke count beside it. `radicalForm` gives the shape, and `withCorrectedStrokes` puts right the two counts RADKFILE gets wrong (乞 and 舛).
- **The names a school teaches**: さんずい, にんべん, くさかんむり, 227 of the 253, in hiragana, with romaji, an English meaning, the position (へん, つくり, かんむり) and the Kangxi number. A radical no school names has none, and is never given a guess.
- **Strokes** for every one of the 6,355 kanji, from KANJIDIC2, to put the matches simplest first.
- **A picker for any page**: `mountBushu` or `<bushu-picker>`. The grid by stroke count, the chosen parts as chips, the matches, and a card for the kanji tapped, with its parts and a Copy button. Parts that cannot narrow are dimmed and cannot be pressed.
- **English and Japanese** in the picker's words and in the radicals' names, followed from the page's `lang`.
- **Light and dark**, custom properties to set, 44-pixel touch targets, nothing moving when something is chosen, and a layout that fits a phone at 390 pixels.
- **No dependencies**, no network requests (the data is imported, not fetched), and nothing stored outside the page it is in.

### What's in it

Each picture is the real picker, drawn by the package and taken from [the demo](https://johnmorrisdotca.github.io/bushu/) with `pnpm screenshots:readme`, in light and dark.

<table>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/narrowing-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/narrowing-desk-light.webp" alt="The picker with the parts 日 and 月 chosen: the grid of radicals by stroke count, with the parts no remaining kanji holds dimmed and the parts that can still narrow the search in full strength, beside the two chosen parts, the line &quot;31 kanji hold all of these parts&quot; and the list of those kanji" width="400">
</picture>
<br><em><strong>Narrowing.</strong> Every kanji that holds all the chosen parts is listed, and the parts that could not narrow it further are dimmed.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/japanese-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/japanese-desk-light.webp" alt="The picker in Japanese with the part 氵 chosen: the stroke headings in Japanese, the chosen part with its school name さんずい, the line saying how many kanji hold it and that the first 120 are shown, and the list of kanji" width="400">
</picture>
<br><em><strong>In Japanese.</strong> The picker's words and the radicals' names follow the page's <code>lang</code>.</em>
</td>
</tr>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/grid-phone-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/grid-phone-light.webp" alt="The top of the radical grid on a phone with 日 and 月 chosen: the headings 1 stroke, 2 strokes and 3 strokes, each over rows of 44-pixel tiles, the chosen parts filled in and the parts no kanji could join to them dimmed" width="220">
</picture>
<br><em><strong>The grid.</strong> Parts sit under their stroke counts, on tiles a finger can press, and the ones that lead nowhere are dimmed.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/kanji-card-phone-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/kanji-card-phone-light.webp" alt="The card of the kanji 明 on a phone: the kanji in large type, the words Parts of 明 and 8 strokes, a Copy button, and its two parts 日 sun and 月 moon as pressed buttons" width="300">
</picture>
<br><em><strong>A kanji's card.</strong> Its strokes, a Copy button, and the parts it is made of, each of which can be chosen from there.</em>
</td>
</tr>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/matches-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/matches-desk-light.webp" alt="The list of matches for the part 扌 on a desk: a box of kanji, each on its own 44-pixel tile, simplest first, in a list that scrolls" width="300">
</picture>
<br><em><strong>The matches.</strong> Simplest first, in a box that scrolls and stops at 120 unless <code>limit</code> says.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/school-names-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/bushu/main/docs/images/school-names-desk-light.webp" alt="Three chosen parts drawn as chips: 氵 with its school name さんずい, 扌 with てへん and 日 with ひ, and a Clear button after them" width="400">
</picture>
<br><em><strong>The names a school teaches.</strong> Beside each chosen part, in Japanese; in English, its meaning.</em>
</td>
</tr>
</table>

## Use it in your project

### Install

```sh
npm install @johnmorrisdotca/bushu
# or: pnpm add @johnmorrisdotca/bushu
# or: yarn add @johnmorrisdotca/bushu
```

A page with no bundler loads the tag from a CDN (`@1` is the major version):

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/bushu@1/dist/element-define.js"></script>
```

### The lookup, alone

```ts
import { kanjiForRadicals, orderChosen, radicalGroups, radicalsInKanji, usableRadicals, withCorrectedStrokes } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
import { sortByStrokes } from "@johnmorrisdotca/bushu/strokes";

const radicals = withCorrectedStrokes(RADKFILE.radicals);   // 乞 and 舛 filed under the right strokes
radicalGroups(radicals);                                    // [{ strokes: 1, radicals: ["一", "｜", …] }, …] the grid
const chosen = orderChosen(radicals, ["月", "日"]);         // ["日", "月"], in the grid's order
sortByStrokes(kanjiForRadicals(radicals, chosen));          // the matches, fewest strokes first
radicalsInKanji(radicals, "明").map((part) => part.radical); // ["日", "月"]: what a kanji is made of
```

Nothing is changed in what it is given: every function returns a new value. A function that takes the radicals takes them as an argument, so a page loads
the data only when it asks for it (`import("@johnmorrisdotca/bushu/radkfile")`), and a bundler can leave the rest out.

### A picker in a page

```ts no-run
import { loadBushuData, mountBushu } from "@johnmorrisdotca/bushu/picker";

const host = document.getElementById("find")!;
const picker = mountBushu(host, { ...(await loadBushuData()), language: "ja" });
host.addEventListener("bushu-pick", (event) => console.log((event as CustomEvent).detail.kanji, (event as CustomEvent).detail.parts));
picker.toggle("氵");   // by its shape or its RADKFILE key (汁): the same part
```

`loadBushuData()` loads the radicals, the names and the strokes. Or hand `mountBushu` only what you want shown: `{ radicals }` alone draws the grid with no names and the matches in dictionary order.

### A tag

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/bushu@1/dist/element-define.js"></script>
<bushu-picker parts="氵 日" limit="40"></bushu-picker>
<script>
  document.querySelector("bushu-picker").addEventListener("bushu-change", (event) => console.log(event.detail.chosen, event.detail.matches));
</script>
```

With a bundler, `import "@johnmorrisdotca/bushu/element/define"` once, in code that runs in the browser, and `<bushu-picker>` is a tag like any other, in a framework: tell the compiler the tag is a custom element, and listen to its events with `addEventListener`. In a
server-rendering framework, import it from a client component, or call `mountBushu` in an effect: the handle it returns has `destroy()`.

### React

```jsx
import { useEffect, useRef } from "react";
import "@johnmorrisdotca/bushu/element/define";

export function KanjiFinder({ onPick }) {
  const tag = useRef(null);
  useEffect(() => {
    const listen = (event) => onPick(event.detail.kanji);
    tag.current.addEventListener("bushu-pick", listen);
    return () => tag.current?.removeEventListener("bushu-pick", listen);
  }, [onPick]);
  return <bushu-picker ref={tag} lang="en" limit="60" />;
}
```

### Vue

```vue
<script setup>
import "@johnmorrisdotca/bushu/element/define";
// vite.config.js: vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === "bushu-picker" } } })
const picked = (event) => console.log(event.detail.kanji, event.detail.parts);
</script>

<template>
  <bushu-picker lang="ja" parts="氵" @bushu-pick="picked" />
</template>
```

### Svelte

```svelte
<script>
  import "@johnmorrisdotca/bushu/element/define";
  let kanji = "";
</script>

<bushu-picker lang="en" on:bushu-pick={(event) => (kanji = event.detail.kanji)}></bushu-picker>
<p>{kanji}</p>
```

### Angular

```ts no-check
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@johnmorrisdotca/bushu/element/define";

@Component({
  selector: "app-finder",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<bushu-picker lang="en" (bushu-pick)="kanji = $any($event).detail.kanji"></bushu-picker> {{ kanji }}`,
})
export class FinderComponent {
  kanji = "";
}
```

### What a page that shows this data says

EDRDG's licence asks that a page showing its data acknowledges the source, and [NOTICE.md](./NOTICE.md) has a line for it. The demo's footer is an example.

## Examples

Each example below is run by `pnpm test:readme` against the built package, except the ones that need a page (they say so in their fence and are type-checked).

### A page with nothing else

Save this as `kanji.html` and open it. The tag loads its own data and draws the whole picker:

```html
<!doctype html>
<meta charset="utf-8">
<title>Find a kanji</title>
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/bushu@1/dist/element-define.js"></script>
<bushu-picker lang="en" parts="日 月"></bushu-picker>
```

### The kanji that hold every chosen part

```ts
import { kanjiForRadicals, withCorrectedStrokes } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
import { sortByStrokes } from "@johnmorrisdotca/bushu/strokes";

const radicals = withCorrectedStrokes(RADKFILE.radicals);
const found = kanjiForRadicals(radicals, ["日", "月"]);
console.log(found.length);                       // 31
console.log(sortByStrokes(found).slice(0, 6));   // ["明", "胆", "胛", "胄", "脂", "萌"]: fewest strokes first
```

### Which parts can still help

`usableRadicals` is what dims the grid: the parts that appear in at least one of the kanji left.

```ts
import { usableRadicals, withCorrectedStrokes } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";

const radicals = withCorrectedStrokes(RADKFILE.radicals);
const usable = usableRadicals(radicals, ["日", "月"]);
console.log(usable.size);           // 48 of the 253
console.log(usable.has("水"));      // false: no kanji holds 日, 月 and 水, so a picker dims it
console.log(usableRadicals(radicals, []).size);   // 253: with nothing chosen, every part can
```

### What a kanji is made of

```ts
import { radicalForm, radicalsInKanji } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";

const parts = radicalsInKanji(RADKFILE.radicals, "海").map((part) => radicalForm(part.radical));
console.log(parts);   // ["乞", "氵", "毋", "母"]: RADKFILE's key 汁 is drawn as the shape people see, 氵
```

### The shape and the name of a part

```ts
import { radicalForm } from "@johnmorrisdotca/bushu";
import { radicalName, radicalNameEntry, radicalNameForShape } from "@johnmorrisdotca/bushu/names";

console.log(radicalForm("汁"));        // "氵": the shape behind RADKFILE's stand-in
console.log(radicalName("汁"));        // "さんずい": what a school calls it, by RADKFILE key
console.log(radicalNameForShape("扌"));   // "てへん": by the character a reader sees
console.log(radicalNameEntry("汁"));
// { name: "さんずい", romaji: "sanzui", meaning: "water", position: "へん", kangxi: 85 }
```

### Choose by the shape a reader sees

The lookup takes RADKFILE keys. A shape that has no character of its own is keyed by a kanji that holds it, so a page that is given 氵 turns it into its key first (the picker does this for you):

```ts
import { RADICAL_FORMS, kanjiForRadicals, withCorrectedStrokes } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";

const radicals = withCorrectedStrokes(RADKFILE.radicals);
const keysOfShape = (shape: string) => Object.entries(RADICAL_FORMS).filter(([, form]) => form === shape).map(([key]) => key);

console.log(keysOfShape("氵"));                                  // ["汁"]
console.log(kanjiForRadicals(radicals, ["氵"]).length);           // 0: 氵 is not a key
console.log(kanjiForRadicals(radicals, keysOfShape("氵")).length); // 364
console.log(keysOfShape("阝"));                                  // ["邦", "阡"]: one shape, two keys, because the two kanji lists differ
```

### Strokes

```ts
import { sortByStrokes, strokesOf } from "@johnmorrisdotca/bushu/strokes";

console.log(strokesOf("明"), strokesOf("海"));   // 8 9
console.log(strokesOf("々"));                     // null: not one of the 6,355 kanji
console.log(sortByStrokes(["海", "明", "日"]));   // ["日", "明", "海"]
```

### A search route that keeps nothing

The data is a plain import, so a server needs no database and no state: the lookup is a set intersection.

```ts
import { kanjiForRadicals, withCorrectedStrokes } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
import { sortByStrokes } from "@johnmorrisdotca/bushu/strokes";

const radicals = withCorrectedStrokes(RADKFILE.radicals);

/** GET /kanji?parts=日月 answers { count: 31, kanji: ["明", "胆", …] }. */
function handle(url: URL): Response {
  const parts = [...(url.searchParams.get("parts") ?? "")];
  const kanji = parts.length === 0 ? [] : sortByStrokes(kanjiForRadicals(radicals, parts));
  return Response.json({ count: kanji.length, kanji: kanji.slice(0, 50) });
}

const answer = await handle(new URL("https://example.test/kanji?parts=日月")).json();
console.log(answer.count, answer.kanji.slice(0, 3));   // 31 ["明", "胆", "胛"]
```

### A picker in a page, listening

```ts no-run
import { loadBushuData, mountBushu } from "@johnmorrisdotca/bushu/picker";

const host = document.getElementById("find")!;
const picker = mountBushu(host, { ...(await loadBushuData()), language: "en", chosen: ["日"] });
host.addEventListener("bushu-change", (event) => console.log((event as CustomEvent).detail.matches.length));
picker.toggle("月");   // the same as a tap on 月
picker.destroy();      // when the page removes it
```

### Load the data only when it is asked for

The radicals are about 90 KB, so a page that shows them only on a tap can leave them out of its first load:

```ts no-run
const button = document.querySelector("button")!;
button.addEventListener("click", async () => {
  const { RADKFILE } = await import("@johnmorrisdotca/bushu/radkfile");
  const { kanjiForRadicals } = await import("@johnmorrisdotca/bushu");
  console.log(kanjiForRadicals(RADKFILE.radicals, ["口", "木"]).length);
});
```

### A look of your own

```css
bushu-picker { --bp-chosen: #8a1c1c; --bp-chosen-ink: #fff; --bp-surface: #fffdf7; }
```

## The data

| Entry point | What it holds | Size | Made from |
| --- | --- | --- | --- |
| `@johnmorrisdotca/bushu/radkfile` | `RADKFILE.radicals`: 253 radicals, each with its strokes as RADKFILE writes them and every kanji that holds it; `RADKFILE.unicode`: EDRDG's own list of the Unicode characters its stand-ins mean; `RADKFILE.sources` | about 90 KB | RADKFILE and KRADFILE |
| `@johnmorrisdotca/bushu/names` | `radicalName`, `radicalNameEntry`, `radicalNameForShape`, `radicalNameCount`, and the data `RADICAL_NAMES` | about 25 KB | Kanji alive |
| `@johnmorrisdotca/bushu/strokes` | `strokesOf`, `sortByStrokes`, and the data `KANJI_STROKES`, grouped by count | about 20 KB | KANJIDIC2 |

Each is its own entry point, so a page loads only what it uses. Every file of data says what it was made from, at what address, with what SHA-256, and what date the file gave itself, and a test holds
[NOTICE.md](./NOTICE.md) to the same figures. `node scripts/build-data.mjs` makes the radicals and strokes again from EDRDG's files and `pnpm data:names` the names; both are deterministic.

## Shapes and names

RADKFILE predates Unicode having a character for every radical shape, so for a shape with no character of its own it writes a whole kanji that holds the shape, and
files the radical under the shape's strokes, not the stand-in's. Drawn as written, a picker puts a five-stroke kanji under three strokes and calls it "soup". So the key stays the key
(it is what the index speaks) and anything that **draws** a radical asks `radicalForm(key)` first. These are all 25, held by a test to the code:

| Key | Shape | School name |
| --- | --- | --- |
| `化` | 亻 | にんべん |
| `个` | 𠆢 | ひとやね |
| `并` | 丷 | はちがしら |
| `刈` | 刂 | りっとう |
| `ハ` | 八 | はち |
| `込` | 辶 | しんにょう |
| `汁` | 氵 | さんずい |
| `尚` | ⺌ | しょうかんむり |
| `犯` | 犭 | けものへん |
| `邦` | 阝 | おおざと |
| `阡` | 阝 | こざとへん |
| `忙` | 忄 | りっしんべん |
| `扎` | 扌 | てへん |
| `艾` | 艹 | くさかんむり |
| `ヨ` | 彐 | けいがしら |
| `礼` | 礻 | しめすへん |
| `老` | 耂 | おいかんむり |
| `杰` | 灬 | れっか |
| `初` | 衤 | ころもへん |
| `買` | 罒 | あみがしら |
| `疔` | 疒 | やまいだれ |
| `禹` | 禸 | じゅうのあし |
| `滴` | 啇 | (none) |
| `｜` | 丨 | たてぼう |
| `ノ` | 丿 | の |

(`滴` stands for 啇, the part of 敵, 適 and 摘, which no school names. 邦 and 阡 are the same shape on the two sides of a character, and RADKFILE keeps two keys because the two kanji lists differ.)
EDRDG lists the same stand-ins, and the Unicode character it means by each (the CJK Radicals Supplement's ⺅ for 化), in `RADKFILE.unicode`. The shapes here are the CJK Unified Ideographs that look the same, which
nearly every font draws; a test holds the two lists to the same stand-ins.

The names are what a Japanese school calls a radical, and are neither a dictionary's English nor a course's mnemonics: 汁 (氵) is さんずい, 扎 (扌) is てへん, 艾 (艹) is くさかんむり.
`radicalName(key)` answers by RADKFILE key, `radicalNameForShape(shape)` by the character a reader sees, and `radicalNameEntry(key)` gives everything: the name, its romaji, an English meaning, where the shape sits and the
Kangxi radical it belongs to. 26 of the 253 are components no school lists as a radical (九, 井, 久, 乞), and `null` is what they answer.

The strokes RADKFILE files two radicals under are wrong, and `withCorrectedStrokes` puts them right: 乞 is three, not two, and 舛 is six, not seven. The rest agree with KANJIDIC2 wherever a radical is a kanji of its own, as a test shows.
The corrections are applied on reading and never edited into the data, so a rebuild from RADKFILE cannot bring them back.

## The picker

The picker is the entry `@johnmorrisdotca/bushu/picker`, so a server never loads it. `mountBushu(host, options)` draws, into any element:

- the **chosen parts** as chips (a chip takes the part away) with a Clear button, and a line that says how many kanji hold all of them;
- the **matches**, simplest first, a list that scrolls in a box of its own and is cut at `limit` (120) with a line that says to choose another part;
- the **card of a kanji** when one is tapped: the kanji, its strokes, a Copy button and its parts, each of which can be chosen from there;
- the **grid**, under its stroke counts, in which a part that no kanji could join to what is chosen is dimmed and cannot be pressed.

Options: `radicals` (required), `names`, `strokes`, `language`, `limit`, `chosen`, `kanji`, `onChange`, `onPick`. A part may be given by its RADKFILE key or by its shape. The handle has `toggle`, `remove`, `clear`,
`select`, `chosen`, `matches`, `set` and `destroy`. Events on the host, which bubble: `bushu-change` (`{ chosen, matches, kanji, parts }`) after each choice, and `bushu-pick` after a kanji is tapped.

### The element

```html
<bushu-picker lang="ja" parts="氵 日" kanji="海" limit="60"></bushu-picker>
```

Attributes, each read again when it changes: `lang`, `parts`, `kanji` and `limit`. Methods: `toggle(part)`, `clear()`, `select(kanji)`; `.picker` is the handle once the data has loaded.
`@johnmorrisdotca/bushu/element/define` defines the tag; `@johnmorrisdotca/bushu/element` holds the class alone. The tag loads its own data when it is put on a page.

## API

Every export of every entry point, with its signature and its doc comment, is in the
[API reference](https://johnmorrisdotca.github.io/bushu/api.html), made from the source when the site is built so it cannot fall behind the code.

### Entry points

| Import | What it holds |
| --- | --- |
| `@johnmorrisdotca/bushu` | The lookup and the shapes: `kanjiForRadicals`, `usableRadicals`, `radicalGroups`, `orderChosen`, `radicalsInKanji`, `radicalForm`, `withCorrectedStrokes`. No data and no page. |
| `@johnmorrisdotca/bushu/radkfile` | The data: 253 radicals and their kanji, from RADKFILE and KRADFILE. |
| `@johnmorrisdotca/bushu/names` | The names a school teaches: `radicalName`, `radicalNameEntry`, `radicalNameForShape`, `radicalNameCount`. |
| `@johnmorrisdotca/bushu/strokes` | The strokes of every kanji: `strokesOf`, `sortByStrokes`. |
| `@johnmorrisdotca/bushu/picker` | The picker for a page: `mountBushu`, `loadBushuData`, its words and its style. |
| `@johnmorrisdotca/bushu/element` | The `<bushu-picker>` class alone. |
| `@johnmorrisdotca/bushu/element/define` | Defines the `<bushu-picker>` tag on the page. |

### The calls to learn first

| Call | What it does |
| --- | --- |
| `kanjiForRadicals(radicals, chosen)` | The kanji that hold every chosen part. |
| `usableRadicals(radicals, chosen)` | The parts that can still narrow what is left: the ones a picker leaves lit. |
| `radicalsInKanji(radicals, kanji)` | The parts a kanji is made of. |
| `radicalGroups(radicals)` | The grid: the parts grouped by stroke count, fewest first. |
| `radicalForm(key)` | The shape a person sees for a RADKFILE key (氵 for 汁). |
| `radicalName(key)` | What a school calls the part (さんずい), or `null` for the 26 no school names. |
| `sortByStrokes(kanji)` | The kanji, fewest strokes first. |
| `mountBushu(host, options)` | The picker, into any element; the handle has `toggle`, `clear`, `select` and `destroy`. |

## Theming

Nothing here is branded. The picker is coloured by custom properties on `.bushu`, and a page sets only the ones it wants different. It follows the device's light or dark setting; `data-theme="light"` or `"dark"` on `<html>` forces one.

| Property | What it colours | Light | Dark |
| --- | --- | --- | --- |
| `--bp-ink` | text, and the focus ring | `#1f2320` | `#ece8dc` |
| `--bp-muted` | the words under the chosen parts, and the stroke headings | `#6b6f68` | `#a09d93` |
| `--bp-rule` | borders | `#ddd6c6` | `#3a3d38` |
| `--bp-surface` | the boxes | `#fbf8f1` | `#1d201e` |
| `--bp-chosen` | a chosen part, and the kanji whose card is open | `#2f5d4a` | `#6fcf97` |
| `--bp-chosen-ink` | the text on a chosen part | `#f3efe4` | `#14211a` |
| `--bp-accent` | reserved for a warning | `#b5452c` | `#ff8a6b` |

```css
#find { --bp-chosen: #8a1c1c; --bp-chosen-ink: #fff; }
```

The demo's own page is the worked example: its colours are the family's stylesheet, [`demo/family.css`](./demo/family.css), which is the same file byte for byte in every sibling's demo, and a test holds it to its hash. The picker sets a font stack for Japanese
(Hiragino Sans, Yu Gothic, Noto Sans CJK JP) and a few shapes (𠆢, ⺌) need a font that has them, which the common Japanese fonts do.

## Limits

All of these are held by tests, and the ones with a name are exported.

| Limit | Value | Where |
| --- | --- | --- |
| Radicals | 253 | `RADKFILE.radicals` |
| Kanji in the index | 6,355, the JIS X 0208 set, none from JIS X 0212 or later | `RADKFILE`, `KANJI_STROKES` |
| Stand-ins drawn as shapes | 25 | `RADICAL_FORMS` |
| Radicals with a school name | 227 of 253 | `radicalNameCount` |
| Matches a picker draws | 120 unless `limit` says | `BUSHU_RESULT_LIMIT` |
| Stroke counts | 1 to 30 for a kanji, 1 to 17 for a radical | `KANJI_STROKES`, `RADKFILE` |

The radicals are RADKFILE's, a decomposition by what can be seen in a typical glyph, so they are not the 214 Kangxi radicals, and a kanji may list parts that a dictionary would not call its radical. A kanji newer than JIS X 0208 (the 2010 additions, the rest of the Unicode kanji) has no parts here.
A search by parts, with the parts still usable worked out, took under a millisecond on a laptop for the commonest part (日), and the picker draws only the first `limit` matches.

## Accessibility

- **A screen reader hears the picker.** The picker is a labelled group. Every part in the grid is a button with a label that says the shape, its name where a school has one, and its stroke count; a chosen part is `aria-pressed`, and a chip's label says that pressing it takes the part away. Every kanji in the list is a button labelled with the kanji, `aria-pressed` for the one whose card is open.
- **The count is announced.** The line that says how many kanji hold all the chosen parts is a polite live region, so a change is spoken without moving focus.
- **A part that leads nowhere is disabled, not hidden.** It is a real disabled button, so it is skipped by the keyboard, announced as unavailable, and not drawn only by colour: the dimming is the tile's opacity and the browser's own disabled state.
- **The keyboard.** Every control is a native `button`, reached with Tab and pressed with Enter or Space, with a two-pixel focus ring in the text colour. There are no arrow-key shortcuts.
- **Touch targets.** Tiles, chips, the Clear and Copy buttons and the parts on a card are at least 44 pixels square, and the layout fits a phone at 390 pixels.
- **Reduced motion.** Nothing in the picker animates or moves when something is chosen, so there is nothing for `prefers-reduced-motion` to change.
- **Colour.** The picker follows the device's light or dark setting. A chosen part is filled and a dimmed one is faint, and the two are also told apart by their pressed and disabled states. The colour pairs in [Theming](#theming) have not been measured against WCAG contrast ratios.
- **Not yet.** A part's name is read in the page's language, so a Japanese name is read by whatever voice the reader has for the page's `lang`. The Japanese words have not been read by a native reader (see [Languages](#languages)).

## Browser and runtime support

The lookup, the data and the names run anywhere JavaScript does: every current browser and Node, in ES2020 (Deno and Bun are not tested). The picker needs a DOM, CSS container queries and `aria-pressed` buttons, which is every browser from 2022 (Chrome and Edge 105, Safari 16, Firefox 110); it is
played in a real Chromium at a phone's width (with touch) and a desk's, and in WebKit, Safari's engine, at a phone's width. Firefox is not in that run. The element draws in the page's own DOM, with no shadow DOM. The package declares Node 22 and later (`engines`), CI tests 22 and 24, and the packed package is installed and
imported on Linux, macOS and Windows. A Copy button needs the clipboard API, and is silent where there is none.

## Languages

English and Japanese, chosen by the `language` option, the host's `lang` or the page's, and followed when the page's `lang` changes. The picker's words (`BUSHU_STRINGS`) are in both, and a radical's name is the school's in Japanese and Kanji alive's English meaning in English.
The demo has a chooser of its own and takes the browser's language on a first visit. **Japanese: included; not yet reviewed by a native reader. Corrections welcome.** Every string is listed beside its English in [docs/strings-ja.md](./docs/strings-ja.md), and there is an
[issue template](https://github.com/johnmorrisdotca/bushu/issues/new?template=fix-a-translation.md) for fixing one. Any other language is a table of your own, passed beside these two.

## Roadmap

1.0.0 is complete as far as it goes. What is **done**: the lookup, the data and the names, the shapes, the strokes, the picker and the tag, English and Japanese, and a monthly refresh. What is **not**, and could come next:

- Kanji beyond JIS X 0208. EDRDG's files for the JIS X 0212 kanji (radkfile2 and kradfile2) were not at its download address on 2026-10-01, and a decomposition of the later kanji would need another source whose licence lets it be shipped.
- A search box beside the grid that finds a radical by its name, in kana, romaji or English, as the dictionary sites have.
- A stroke-count filter on the matches, and a filter on the grid's own stroke counts.
- A font for the handful of shapes (𠆢, ⺌) that some systems lack.
- The Japanese in the picker is written by the author of the package and has not been read by a native reader: corrections are welcome (the issue template says how).

## Architecture

The search is plain functions over the radicals handed to them, with no DOM and no data of their own. The data is three entries of its own, so a page loads only what it shows. The page's part (the picker and the element) is another entry.

```text
src/
├── index.ts          the main entry: the lookup and the shapes, without the data or the page
├── types.ts          a radical
├── radicals.ts       the lookup: the grid by strokes, kanji for parts, the parts still usable, a kanji's parts
├── forms.ts          the shapes behind RADKFILE's stand-ins, and the two corrected stroke counts
├── names.ts          the "/names" entry: the school names of the radicals, by key and by shape
├── strokes.ts        the "/strokes" entry: the strokes of a kanji, and sorting by them
├── version.ts        the package's version
├── strings.ts        the picker's words, in English and Japanese
├── style.ts          the picker's style: its colours as custom properties, its boxes and its tiles
├── picker.ts         mountBushu: draws the picker into an element and plays it, with its words and events
├── load.ts           loadBushuData: the radicals, the names and the strokes, each loaded when asked for
├── picker-entry.ts   the "/picker" entry: the picker, its words and its style
├── element.ts        the "/element" entry: the <bushu-picker> class
├── element-define.ts the "/element/define" entry: defines the tag on the page
└── data/
    ├── radkfile.data.ts  the "/radkfile" entry: the 253 radicals and their kanji, from RADKFILE and KRADFILE
    ├── strokes.data.ts   the strokes of the 6,355 kanji, from KANJIDIC2
    └── names.data.ts     the school names of 227 radicals, from Kanji alive
```

Tests sit beside the code they test (`*.test.ts`). `scripts/` makes the data, builds the demo and its API reference page, takes the pictures and checks the package as npm packs it; `demo/` is the page, and `e2e/` its browser tests.

## The name

*Bushu* (部首, 「ぶしゅ」) is Japanese for a radical, the part of a kanji that a dictionary files it under. It is written with 部, which
[Wiktionary](https://en.wiktionary.org/wiki/%E9%83%A8) glosses as a section, a part, and 首, which it glosses as a neck, a head or a chief: the head part of a character.
Wiktionary's entry for [部首](https://en.wiktionary.org/wiki/%E9%83%A8%E9%A6%96) gives "radical (of a Chinese character)". (The sources were read on 2026-10-01.) The lookup it names, by several parts at once, is the multi-radical lookup of the dictionary sites.

## Where it comes from, and where it is used

The code is this package's own. The data is not, and the licence of each part is in [NOTICE.md](./NOTICE.md) and at the top of each data file:

- **The radicals, their kanji and the strokes** are RADKFILE, KRADFILE and KANJIDIC2, the property of the Electronic Dictionary Research and Development Group (https://www.edrdg.org/), used under the Creative Commons
  Attribution-ShareAlike 4.0 licence and the Group's conditions (https://www.edrdg.org/edrdg/licence.html). RADKFILE and KRADFILE are by Michael Raine, James Breen and the Group. The data in this package is derived from them and shared under the same licence.
- **The school names of the radicals** are from the radicals table of Kanji alive, by Harumi Hibino Lory and Arno Bosse (University of Chicago, https://kanjialive.com), under the Creative Commons Attribution 4.0 licence. They are changed from the original: matched to RADKFILE's radicals and trimmed.
- **EDRDG asks that its files are kept current**, so the data is made again from the newest files every month by a workflow that opens a branch when they change, and a program built on this package should take the newest release.

Bushu was written for the kanji lookup of UmaKuma, a Japanese study app by the same author. Using it somewhere? [Tell us](https://github.com/johnmorrisdotca/bushu/issues/new?template=add-my-project.md).

### The family

<!-- family:start (made by scripts/family-readme.mjs from scripts/family-template.mjs; change those, not this) -->
Bushu is one of twenty-four packages, each made for the same site, each at
[github.com/johnmorrisdotca](https://github.com/johnmorrisdotca). The code of every one is MIT.

- [Korokoro](https://github.com/johnmorrisdotca/korokoro) (コロコロ): dice, with notation, exact odds, real sounds and the dice of many games. [Demo](https://johnmorrisdotca.github.io/korokoro/).
- [Kyuubu](https://github.com/johnmorrisdotca/kyuubu) (キューブ): a turning cube for the browser, 2×2 to 7×7, with record solves to replay. [Demo](https://johnmorrisdotca.github.io/kyuubu/).
- [Hitotsu](https://github.com/johnmorrisdotca/hitotsu) (一つ): a colour-card shedding game for two to eight, with the house rules people play. [Demo](https://johnmorrisdotca.github.io/hitotsu/).
- [Toranpu](https://github.com/johnmorrisdotca/toranpu) (トランプ): a deck of playing cards, card games with computer players, and solitaires. [Demo](https://johnmorrisdotca.github.io/toranpu/).
- [Tane](https://github.com/johnmorrisdotca/tane) (種): seeded random numbers and daily seeds, the same in every browser and on every server. [Demo](https://johnmorrisdotca.github.io/tane/).
- [Narabe](https://github.com/johnmorrisdotca/narabe) (並べ): one rules engine for abstract board games, from gomoku and Reversi to Go and checkers. [Demo](https://johnmorrisdotca.github.io/narabe/).
- [Tenka](https://github.com/johnmorrisdotca/tenka) (天下): world conquest for two to six, on a map of the real world. [Demo](https://johnmorrisdotca.github.io/tenka/).
- [Kumimoji](https://github.com/johnmorrisdotca/kumimoji) (組み文字): a crossword tile race, in English and Japanese kana. [Demo](https://johnmorrisdotca.github.io/kumimoji/).
- [Tsunagi](https://github.com/johnmorrisdotca/tsunagi) (繋ぎ): a line-joining logic puzzle whose every level has exactly one answer. [Demo](https://johnmorrisdotca.github.io/tsunagi/).
- [Jarajara](https://github.com/johnmorrisdotca/jarajara) (ジャラジャラ): mahjong tiles drawn as SVG, stacked layouts, and the matching solitaire Awase. [Demo](https://johnmorrisdotca.github.io/jarajara/).
- [Suido](https://github.com/johnmorrisdotca/suido) (水道): a pipe puzzle: turn the pieces until the water reaches every drain. [Demo](https://johnmorrisdotca.github.io/suido/).
- [Domino](https://github.com/johnmorrisdotca/domino) (ドミノ): dominoes and Mexican Train. [Demo](https://johnmorrisdotca.github.io/domino/).
- [Kotoba](https://github.com/johnmorrisdotca/kotoba) (言葉): word lists and word-game rules in English, French, German and Japanese. [Demo](https://johnmorrisdotca.github.io/kotoba/).
- [Sugoroku](https://github.com/johnmorrisdotca/sugoroku) (双六): backgammon and its variants, with the doubling cube and match play. [Demo](https://johnmorrisdotca.github.io/sugoroku/).
- [Kazu](https://github.com/johnmorrisdotca/kazu) (数): grid number puzzles: Sudoku and its variants, Futoshiki and Skyscrapers. [Demo](https://johnmorrisdotca.github.io/kazu/).
- [Meikyuu](https://github.com/johnmorrisdotca/meikyuu) (迷宮): mazes on squares, hexagons, triangles and circles, made from a seed and drawn through with a finger or the mouse. [Demo](https://johnmorrisdotca.github.io/meikyuu/).
- [Hikidashi](https://github.com/johnmorrisdotca/hikidashi) (引き出し): a drawer of small Japanese text tools: era dates, kanji numerals, readings and sentence difficulty. [Demo](https://johnmorrisdotca.github.io/hikidashi/).
- [Chizu](https://github.com/johnmorrisdotca/chizu) (地図): maps of the world and of countries' regions, in English and Japanese, with a quiz and callouts. [Demo](https://johnmorrisdotca.github.io/chizu/).
- [Bushu](https://github.com/johnmorrisdotca/bushu) (部首): find a kanji by the parts it is made of. [Demo](https://johnmorrisdotca.github.io/bushu/).
- [Tobiishi](https://github.com/johnmorrisdotca/tobiishi) (飛び石): peg solitaire with nine boards and seeded solvable challenges. [Demo](https://johnmorrisdotca.github.io/tobiishi/).
- [Jirai](https://github.com/johnmorrisdotca/jirai) (地雷): minesweeper on shaped grids with verified no-guess boards. [Demo](https://johnmorrisdotca.github.io/jirai/).
- [Gunjin](https://github.com/johnmorrisdotca/gunjin) (軍人): five hidden-rank strategy games with pass-the-device play. [Demo](https://johnmorrisdotca.github.io/gunjin/).
- [Karakuri](https://github.com/johnmorrisdotca/karakuri) (からくり): eight hyper-casual puzzle games, some of them physics: draw a shield, pull pins, cut ropes, slide blocks, pour tubes. [Demo](https://johnmorrisdotca.github.io/karakuri/).
- [Houseki](https://github.com/johnmorrisdotca/houseki) (宝石): gem and stone matching puzzles: falling triplets, stone collapse, colour chains and gem swap. [Demo](https://johnmorrisdotca.github.io/houseki/).

**This package is Bushu.** The demos of all twenty-four share one header and footer, so each links the rest.
<!-- family:end -->

## Development

```sh
pnpm install
pnpm check          # lint, types and every test
pnpm test:package   # pack, install and import it as somebody who installed it would
pnpm test:demo      # build the demo and play it in a real browser, at a phone's width and a desk's
pnpm site           # build the demo into site/, as the Pages workflow publishes it
pnpm test:readme    # type-check and run every example in this README against the built package
pnpm screenshots:readme   # build the demo and retake the pictures in docs/images
pnpm data           # make the data again from EDRDG's files and Kanji alive's (needs the network)
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The commands are under [Development](#development).

Please follow the [code of conduct](./CODE_OF_CONDUCT.md). A security problem is for the [security policy](./SECURITY.md), not a public issue.

## Changes

See [CHANGELOG.md](./CHANGELOG.md). The latest release, 1.0.2, adds no code: it is this README in full, with pictures of the picker, examples that are run on every change, and an Accessibility section.

## Licence

The code is [MIT](./LICENSE) © John Morris. The data is other people's work, under their own terms: Creative Commons Attribution-ShareAlike 4.0 for the radicals, their kanji and the strokes (the Electronic Dictionary Research and Development Group), and Creative Commons Attribution 4.0 for the
school names (Kanji alive). [NOTICE.md](./NOTICE.md) says which file is which, credits each as its licence asks, and says what that asks of a project that uses it.
