---
title: Intersect chosen parts
section: how-to
order: 2
description: Use RADKFILE keys, preserve native ordering and interpret empty results.
---

## All selected parts must match

```ts
import { kanjiForRadicals, usableRadicals, orderChosen } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
const chosen=orderChosen(RADKFILE.radicals,["田","汁"]);
console.log(chosen,kanjiForRadicals(RADKFILE.radicals,chosen));
console.log(usableRadicals(RADKFILE.radicals,chosen).has("汁"));
```

The pure search intersects selected keys. Nothing selected returns `[]`, and a key absent from the supplied index also returns `[]`. Result order follows the first matching radical in the supplied index. `orderChosen` follows the grid’s native order rather than click order and drops unknown keys.

## Keep removal available

`usableRadicals` returns the parts that can occur in a current match and keeps chosen parts in the set, even when there are no matches. A picker can always remove a choice. With no choices, all supplied parts are usable. `radicalsInKanji` lists a character’s indexed parts by strokes, breaking ties by code point rather than locale collation.
