---
title: Group parts and sort kanji by strokes
section: how-to
order: 4
description: Apply the two native radical corrections separately from kanji stroke-count lookup.
---

## Correct radical counts at the boundary

```ts
import { withCorrectedStrokes, radicalGroups, radicalStrokes } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
console.log(radicalStrokes("乞",2),radicalStrokes("舛",7));
console.log(radicalGroups(withCorrectedStrokes(RADKFILE.radicals)).map(group=>group.strokes));
```

The raw data retains RADKFILE’s counts. The native correction table makes 乞 three strokes and 舛 six. `withCorrectedStrokes` returns new entries in the same order and does not rewrite the source dataset. The stand-in’s whole-character stroke count is not the radical’s stroke count.

## Sort character results

```ts
import { strokesOf, sortByStrokes } from "@johnmorrisdotca/bushu/strokes";
console.log(strokesOf("海"),strokesOf("𠀀"),sortByStrokes(["海","一","水"]));
```

Kanji stroke counts come from the bundled KANJIDIC2-derived index. `strokesOf` returns null outside that index. Equal counts preserve the supplied order, and unknown characters sort last. The returned array is new.
