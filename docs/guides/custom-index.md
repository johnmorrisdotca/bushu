---
title: Use your own part index
section: how-to
order: 6
description: Keep native Radical fields and make names and stroke metadata optional.
---

## Supply plain Radical entries

```ts
import { kanjiForRadicals, radicalGroups, type Radical } from "@johnmorrisdotca/bushu";
const parts: Radical[]=[{radical:"水",strokes:4,kanji:"海湖"},{radical:"月",strokes:4,kanji:"湖"}];
console.log(kanjiForRadicals(parts,["水","月"]),radicalGroups(parts));
```

This small teaching index is host data, not a replacement for the bundled dictionary’s membership claims. Each entry stores its key, part stroke count and one string of member kanji. Keep distinct keys for distinct memberships even if two display forms coincide. The lookup reads the index without mutating it.

## Add a picker

Pass the same entries to `mountBushu(host, {radicals:parts})`. Optional name and stroke callbacks can return null for missing metadata. Use a stable index order if saved selections, teaching sheets or displayed result order must remain reproducible. Host code owns persistence and data retrieval.
