---
title: 部首選択を埋め込む
section: how-to
order: 7
description: 標準の要素・フレーム・表示を選び、イベントを扱います。
---

## ビルダーから始める

ビルダーは、最初の部品や漢字、言語、大きさを指定して標準の選択画面を表示します。版を固定したiframe、要素、モジュール、フレームワークの形式を出力します。表示の設定は埋め込みに、独自の部品データとコールバックはページ側の設定に渡します。

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

## イベント・登録・リンク

`bushu-change`と`bushu-pick`、対応するコールバックを使います。[埋め込みの詳しい仕様](../../embeds.md)に、通知の内容と表示の扱いがあります。フレームのメッセージは、送信元のoriginとsourceを確認します。パッケージは検索履歴を保存しません。独自のタグには`/element`、標準のタグには`/element/define`を読み込みます。既存の定義は保ちます。デモとビルダーのDocsは、初期言語と途中の切り替えに従います。
