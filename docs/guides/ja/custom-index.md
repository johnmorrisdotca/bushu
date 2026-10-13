---
title: 独自の部品索引を使う
section: how-to
order: 6
description: 標準の Radical の形でデータを渡し、名前と画数を任意で加えます。
---

## Radical の項目を渡す

```ts
import { kanjiForRadicals, radicalGroups, type Radical } from "@johnmorrisdotca/bushu";
const parts: Radical[]=[{radical:"水",strokes:4,kanji:"海湖"},{radical:"月",strokes:4,kanji:"湖"}];
console.log(kanjiForRadicals(parts,["水","月"]),radicalGroups(parts));
```

この小さい索引は教材用の独自データです。同梱の辞書の所属関係を置き換えたものではありません。項目にはキー、部品の画数、その部品を含む漢字を1つの文字列で指定します。表示形が同じでも、所属する漢字が違う部品はキーを分けます。検索は索引を書き換えません。

## 選択画面を加える

`mountBushu` の表示先と設定の引数を使い、同じ項目を `radicals` として渡します。任意の名前や画数のコールバックは、情報がなければ null を返せます。保存した選択や教材の結果順を再現する場合は、索引の順を固定します。保存やデータの取得はページ側で管理します。
