---
title: Keep lookup keys and display shapes distinct
section: how-to
order: 3
description: Use native stand-in forms and school names without losing ambiguous radical identities.
---

## Draw the shape; retain its key

```ts
import { radicalForm } from "@johnmorrisdotca/bushu";
import { radicalName, radicalNameForShape, radicalNameEntry } from "@johnmorrisdotca/bushu/names";
console.log(radicalForm("汁"),radicalName("汁"),radicalNameForShape("氵"));
console.log(radicalNameEntry("邦")?.name,radicalNameEntry("阡")?.name);
```

RADKFILE uses stand-in keys such as 汁 for 氵. Display `radicalForm(key)` while keeping the key in your lookup state. Both 邦 and 阡 display 阝; they have different kanji memberships and different names. Key-based lookup preserves that distinction. Shape-name lookup deliberately chooses the first matching school name for an ambiguous shape.

## Handle unnamed components

The names table covers school radical names, not every component used by the search index. `radicalName` and `radicalNameEntry` return `null` when the table has no name. Show the native form or a neutral fallback rather than inventing a reading. Position and Kangxi number within a known entry may also be null.
