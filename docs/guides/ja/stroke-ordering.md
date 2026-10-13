---
title: 部品と漢字を画数で並べる
section: how-to
order: 4
description: 部品の2つの補正と、漢字自体の画数を区別します。
---

## 部品の画数を補正する

```ts
import { withCorrectedStrokes, radicalGroups, radicalStrokes } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
console.log(radicalStrokes("乞",2),radicalStrokes("舛",7));
console.log(radicalGroups(withCorrectedStrokes(RADKFILE.radicals)).map(group=>group.strokes));
```

元のデータは RADKFILE の画数を保ちます。補正表では、乞を3画、舛を6画にします。`withCorrectedStrokes` は、同じ順の新しい項目を返し、元のデータを書き換えません。代用に使った漢字全体の画数と、部品の画数は別です。

## 漢字の候補を並べる

```ts
import { strokesOf, sortByStrokes } from "@johnmorrisdotca/bushu/strokes";
console.log(strokesOf("海"),strokesOf("𠀀"),sortByStrokes(["海","一","水"]));
```

漢字の画数は、同梱した KANJIDIC2 由来の索引です。索引の外では `strokesOf` は null です。同じ画数は入力の順を保ち、不明な文字は最後に並びます。返す配列は新しいものです。
