---
title: 選んだ部品を全て含む漢字を探す
section: how-to
order: 2
description: キーと標準の順序を保ち、空の結果の意味を確認します。
---

## 選んだ部品の共通部分を探す

```ts
import { kanjiForRadicals, usableRadicals, orderChosen } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
const chosen=orderChosen(RADKFILE.radicals,["田","汁"]);
console.log(chosen,kanjiForRadicals(RADKFILE.radicals,chosen));
console.log(usableRadicals(RADKFILE.radicals,chosen).has("汁"));
```

検索は、選んだキーを全て満たす漢字を返します。何も選ばなければ`[]`、索引にないキーも`[]`です。結果の順は、入力した索引で最初に一致する部品の漢字一覧に従います。`orderChosen`は、クリック順ではなく、選択画面の順に並べ、不明なキーを取り除きます。

## 選択を取り消せるようにする

`usableRadicals`は、現在の候補に現れる部品を返します。候補がない場合でも、選択済みの部品は残すため、取り消せます。何も選んでいないときは全ての部品を使えます。`radicalsInKanji`は、索引にある部品を画数順に並べ、同じ画数はロケールではなくコードポイントで順を決めます。
