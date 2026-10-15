---
title: 標準の選択画面を操作する
section: how-to
order: 5
description: 標準の操作、表示件数、コールバック、後始末を使います。
---

## 表示を操作するハンドルを保つ

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

`toggle`と`remove`は、キーや対応する形を受け取ります。最初の選択に不明な部品があれば取り除きます。`toggle`は、使えない部品を加えませんが、選択済みの部品は取り消せます。`select(null)`は漢字のカードを閉じます。`set`は言語、件数、名前、画数を更新します。独自の部品データは、最初の表示時に渡します。

## 結果と表示の後始末

表示件数の初期値は120です。`matches()`は、現在の候補を全て返します。表示する件数や絞り込みの案内は、検索の結果を変えません。名前と画数のコールバックは任意なので、独自のデータも渡せます。表示先を取り除いたら、選択画面を破棄します。ブラウザーの例は、NodeでDOMを動かさずに型を確認します。
