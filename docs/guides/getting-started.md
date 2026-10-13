---
title: Getting started
section: tutorial
order: 1
description: Look up a kanji from native parts, then choose a browser picker.
---

## Search without a browser

Install `@johnmorrisdotca/bushu`. The main entry contains pure lookup and shape functions; `/radkfile` supplies the native radical index. Each result must contain every chosen part.

```ts
import { kanjiForRadicals, radicalForm } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
console.log(radicalForm("汁"),kanjiForRadicals(RADKFILE.radicals,["汁","田"]).slice(0,8));
```

Keep RADKFILE keys for lookup, even where a key’s displayed shape differs. Names and kanji strokes are separate entries, so the pure search need not load either. [Selection](intersect-parts.md) and [shapes/names](shapes-and-names.md) explain the input contracts.

## Mount the native picker

```ts no-run
import { loadBushuData, mountBushu } from "@johnmorrisdotca/bushu/picker";
const host=document.createElement("div");
document.body.append(host);
const picker=mountBushu(host,{...await loadBushuData(),language:"ja"});
picker.toggle("氵");
console.log(picker.chosen(),picker.matches().length);
picker.destroy();
```

The picker accepts native keys or supported display shapes. Call `destroy()` when removing the host. The [embed guide](embed-picker.md) supplies the custom-element and frame alternatives.
