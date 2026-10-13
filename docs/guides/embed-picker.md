---
title: Embed a radical picker
section: how-to
order: 7
description: Choose the native element, frame or host mount and preserve event boundaries.
---

## Start with the builder

The builder previews the native picker with its initial radicals/kanji, language and size. It outputs version-pinned iframe, custom-element, module and framework formats. Display configuration belongs in the embed setup; custom radical data and host callbacks belong in the host options.

```ts no-run
import "@johnmorrisdotca/bushu/element/define";
import { BushuPicker } from "@johnmorrisdotca/bushu/element";
const picker=new BushuPicker();
picker.setAttribute("parts","汁 田");
picker.setAttribute("lang","ja");
document.body.append(picker);
console.log(picker.tagName,picker.getAttribute("parts"));
picker.remove();
```

## Events, registration and links

Use `bushu-change` and `bushu-pick` and the corresponding native callbacks; the [full embed contract](../embeds.md) describes their detail and lifecycle. Validate a frame message’s origin and source before accepting it. The package does not persist lookup history. Import `/element` to register a host’s own tag, or `/element/define` for the standard tag; registration preserves an existing definition. The Docs links in the demo and builder follow initial and live language selection.
