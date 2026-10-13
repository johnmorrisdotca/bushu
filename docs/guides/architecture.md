---
title: How lookup, data and the picker fit together
section: explanation
order: 10
description: Preserved architecture, separate data imports and reproducible source metadata.
---

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

## Data and documentation

The bundled index, names and strokes retain their source metadata and licence notices. New generated-data example comments are emitted by the existing data/name writers, so a future refresh preserves the documentation. This rollout did not fetch or regenerate upstream data. The shared docs build creates reference pages, Markdown twins and a local Pagefind index from the public TypeScript declarations.
