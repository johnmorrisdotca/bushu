---
title: Control the native picker
section: how-to
order: 5
description: Use native mount methods, result limits, callbacks and cleanup.
---

## Keep the mount handle

```ts no-run
import { loadBushuData, mountBushu } from "@johnmorrisdotca/bushu/picker";
const host=document.createElement("div");
document.body.append(host);
const picker=mountBushu(host,{...await loadBushuData(),chosen:["汁"],limit:60,onChange:detail=>console.log(detail.chosen,detail.matches)});
picker.toggle("田");
picker.select("海");
picker.set({language:"ja",limit:120});
console.log(picker.chosen(),picker.matches().length);
picker.clear();
picker.destroy();
```

`toggle` and `remove` accept keys or supported forms. Initial unknown parts are dropped. An unusable part is not added by `toggle`; chosen parts can still be removed. `select(null)` closes the kanji card. `set` updates language, limit, names or strokes, while custom radical data belongs to mount creation.

## Results and lifecycle

The default display limit is 120. `matches()` returns the complete current match list; the displayed subset and narrowing message do not change the lookup’s answer. Names and stroke callbacks are optional, so a host can supply its own data sources. Destroy the picker once its host is removed. Browser-only examples are typechecked without running a DOM in Node.
