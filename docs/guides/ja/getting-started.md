---
title: はじめに
section: tutorial
order: 1
description: 部品から漢字を探し、ブラウザーの選択画面を使います。
---

## ブラウザーを使わずに探す

`@johnmorrisdotca/bushu` をインストールします。主な入口には検索と表示形の関数、`/radkfile` には標準の部品の索引があります。結果は、選んだ部品を全て含む漢字です。

```ts
import { kanjiForRadicals, radicalForm } from "@johnmorrisdotca/bushu";
import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";
console.log(radicalForm("汁"),kanjiForRadicals(RADKFILE.radicals,["汁","田"]).slice(0,8));
```

表示する形が違っても、検索には RADKFILE のキーを保ちます。名前と漢字の画数は別の入口なので、検索だけなら両方を読み込む必要はありません。[選び方](intersect-parts.md)と[形・名前](shapes-and-names.md)に入力の決まりがあります。

## 標準の部首選択を表示する

```ts no-run
import { loadBushuData, mountBushu } from "@johnmorrisdotca/bushu/picker";
const host=document.createElement("div");
document.body.append(host);
const picker=mountBushu(host,{...await loadBushuData(),language:"ja"});
picker.toggle("氵");
console.log(picker.chosen(),picker.matches().length);
picker.destroy();
```

選択画面では、キーまたは対応する表示形を使えます。表示先を取り除くときは `destroy()` を呼びます。[埋め込み](embed-picker.md)には、要素とフレームの使い方があります。
