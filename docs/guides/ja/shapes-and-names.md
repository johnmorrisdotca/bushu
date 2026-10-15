---
title: 検索キーと表示形を使い分ける
section: how-to
order: 3
description: 代用の文字と部首名を使い、同じ形の異なるキーを保ちます。
---

## 形を表示し、キーを保つ

```ts
import { radicalForm } from "@johnmorrisdotca/bushu";
import { radicalName, radicalNameForShape, radicalNameEntry } from "@johnmorrisdotca/bushu/names";
console.log(radicalForm("汁"),radicalName("汁"),radicalNameForShape("氵"));
console.log(radicalNameEntry("邦")?.name,radicalNameEntry("阡")?.name);
```

RADKFILEは、氵の代わりに汁のようなキーを使います。表示には`radicalForm(key)`、検索の状態には元のキーを使います。邦と阡はどちらも阝になりますが、含まれる漢字と名前が異なります。キーで参照すると、この違いを保てます。形から名前を探す関数は、同じ形がある場合、最初に一致する名前を返します。

## 名前のない部品を扱う

名前の表は、学習で使う部首名を収録します。検索索引の全ての部品に名前があるわけではありません。表にない場合、`radicalName`と`radicalNameEntry`は`null`です。読みを作らず、標準の形や中立の表示を使います。名前のある項目でも、位置や康熙部首の番号がnullの場合があります。
