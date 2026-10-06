# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Repository only: the package and everything it exports are unchanged. `CONTRIBUTING.md` is the family's one text with a section of its own for Bushu, held to the master in johnmorrisdotca/.github by `src/family.test.js`; `ci.yml` and `pages.yml` are the family's one text (`pnpm check`, the demo, and the package on Linux, macOS and Windows), and any jobs of the package's own after them.

### Fixed

- The API reference page wraps a long entry path instead of running about 2 px wider than a 360 px screen. Nothing the package exports has changed.

## [1.0.1] - 2026-10-05

Nothing that was exported has changed.

### Added

- A test holds every `@johnmorrisdotca/bushu@N` version pin in the README to this package's major version.

### Changed

- The family's list, in the README and in the demo's footer, names all twenty-four packages, Karakuri and Houseki included.
- The npm description is one sentence of 250 characters or fewer, so npm and its search show it whole; it is also the repository's About text. `homepage` is the demo site and `author` is `"John Morris"`, the same in every package.
- The GitHub Actions workflows use the current versions of the actions (checkout 7, setup-node 7, pnpm/action-setup 6; configure-pages 6, upload-pages-artifact 5 and deploy-pages 5 for Pages), which clears GitHub's Node 20 deprecation warning.

## [1.0.0] - 2026-10-01

The first release.

- **The lookup** (`@johnmorrisdotca/bushu`): `kanjiForRadicals` (the kanji that hold every chosen part), `usableRadicals` (the parts that can still narrow them, for dimming the rest), `radicalGroups` (the grid by stroke count),
  `orderChosen` and `radicalsInKanji` (what a kanji is made of), over radicals handed in as an argument, each returning new values.
- **The shapes**: `radicalForm` turns RADKFILE's 25 stand-in keys (汁, 扎, 艾 and the rest) into the shapes people see (氵, 扌, 艹), `RADICAL_FORMS` is the table, and `withCorrectedStrokes` files 乞 and 舛 under the strokes they have, which RADKFILE gets wrong.
- **`@johnmorrisdotca/bushu/radkfile`**: the 253 radicals of RADKFILE with their 6,355 kanji, checked against KRADFILE, with EDRDG's own list of the Unicode characters for its stand-ins and the address, date and SHA-256 of each file it was made from.
- **`@johnmorrisdotca/bushu/names`**: the names a Japanese school teaches for 227 of the radicals (さんずい, にんべん, くさかんむり), with romaji, an English meaning, the position and the Kangxi number, from Kanji alive (CC BY 4.0).
- **`@johnmorrisdotca/bushu/strokes`**: the strokes of every one of the 6,355 kanji, from KANJIDIC2, and `sortByStrokes`.
- **`@johnmorrisdotca/bushu/picker`**: `mountBushu` draws the grid of parts by stroke count, the chosen parts, the matches and the card of a kanji into any element, with dimming of the parts that cannot help, English and Japanese words, light and dark, and the events `bushu-change` and `bushu-pick`.
- **`<bushu-picker>`** (`/element`, `/element/define`): the same in a tag, which loads its own data.
- **The data is made by scripts, never by hand**: `scripts/build-data.mjs` (RADKFILE, KRADFILE, KANJIDIC2) and `scripts/build-names.ts` (Kanji alive, from one pinned commit), deterministic, with each file's SHA-256 recorded. A monthly workflow, as EDRDG's licence asks, fetches the files again and leaves a branch when they change.
- The demo has the picker, a choice of order, names, the most matches shown and a box to open the parts of a kanji, the family's Help switch and cloth patches, and browser tests (`pnpm test:demo`) in Chromium and WebKit at a phone's width and a desk's.
