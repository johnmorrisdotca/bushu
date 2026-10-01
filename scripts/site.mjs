// Builds the static demo for GitHub Pages into ./site: the page, written here from the family's shared header and footer,
// with the family's stylesheet, Bushu's own, the page's script and the compiled library beside it.
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

import { API_CSS, apiPage } from "./api.mjs";
import { FAMILY_SCRIPT, familyFooter, familyHead, familyHeader, familyUnreviewed } from "./family-template.mjs";

const id = "bushu";
const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%232f5d4a'/%3E%3Ctext x='50' y='70' font-size='60' text-anchor='middle' fill='%23f3efe4'%3E部%3C/text%3E%3C/svg%3E";

const uses = [
  `import { kanjiForRadicals, usableRadicals } from "@johnmorrisdotca/bushu";`,
  `import { RADKFILE } from "@johnmorrisdotca/bushu/radkfile";  // 253 radicals, 6,355 kanji`,
  `kanjiForRadicals(RADKFILE.radicals, ["日", "月"])  // ["厭", "臆", …, "明", …]: kanji with both parts`,
  `usableRadicals(RADKFILE.radicals, ["日", "月"])  // the parts that can still narrow them; dim the rest`,
  `radicalForm("汁")  // "氵": RADKFILE keys a shape by a kanji that holds it; this is the shape people see`,
  `radicalName("汁")  // "さんずい", from "@johnmorrisdotca/bushu/names"`,
  `mountBushu(element, { ...(await loadBushuData()), language: "ja" })  // the picker above, in any page`,
  `<bushu-picker lang="ja" parts="氵 日"></bushu-picker>`,
];
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const page = `<!doctype html>
<html lang="en">
  <head>
    ${familyHead({
      id,
      title: "Bushu · find a kanji by its parts",
      description: "Find a kanji by the parts you can see in it: choose parts from a grid of radicals by stroke count, and see every kanji that holds them all, with the parts that can no longer help dimmed. Names in English and the Japanese school names, free and open source, in English and Japanese.",
      ogTitle: "Bushu radical lookup",
      ogDescription: "Choose the parts you can see, and find the kanji. The multi-radical lookup, in a small open-source package.",
    })}
    <link rel="icon" href="${ICON}" />
    <link rel="stylesheet" href="family.css" />
    <link rel="stylesheet" href="bushu.css" />
  </head>
  <body>
    <main>
      ${familyHeader({ id, links: [{ href: "api.html", say: "pageApi" }] })}
      <section class="setup" aria-labelledby="find-title">
        <h2 id="find-title" data-say="findTitle"></h2>
        <div id="picker" data-testid="picker" data-help-en="Tap the parts you can see in the kanji, in any order. The kanji that hold all of them appear, and the parts that could not narrow them further are dimmed. Tap a chosen part to take it away." data-help-ja="漢字の中に見える部品を、順番は問わず選びます。選んだ部品をすべて含む漢字が出て、それ以上絞れない部品は薄くなります。選んだ部品をもう一度押すと、はずれます。" data-help-after></div>
      </section>
      <section class="settings" aria-labelledby="options-title">
        <h2 id="options-title" data-say="optionsTitle"></h2>
        <div class="setup fam-row" data-help-en="Put the matches with the fewest strokes first, as a reader looks for them, or leave them in the dictionary's own order." data-help-ja="一致した漢字を、探すときに見やすい画数の少ない順に並べるか、辞書そのままの順にします。"><span class="fam-label" data-say="order"></span><div class="fam-seg" role="group" data-say-label="order" id="order" data-testid="order"></div></div>
        <div class="setup fam-row" data-help-en="Show each radical's name beside it once chosen: the English meaning, or in Japanese the name a school teaches, such as さんずい." data-help-ja="選んだ部品の名前を表示します。英語では意味、日本語では学校で習う名前（さんずいなど）です。"><span class="fam-label" data-say="names"></span><div class="fam-seg" role="group" data-say-label="names" id="names" data-testid="names"></div></div>
        <div class="setup fam-row" data-help-en="How many matches are drawn at once. Past that the picker says to choose another part." data-help-ja="一度に表示する漢字の数です。それを超えると、部品を足すよう案内します。"><span class="fam-label" data-say="limit"></span><div class="fam-seg" role="group" data-say-label="limit" id="limit" data-testid="limit"></div></div>
        <div class="setup fam-row" data-help-en="Type a kanji to see the parts it is made of, without choosing anything." data-help-ja="漢字をひとつ入力すると、その漢字を作っている部品が見られます。"><label class="fam-label" for="kanji-input" data-say="kanji"></label><input class="fam-field kanji-input" id="kanji-input" data-testid="kanji-input" type="text" inputmode="text" maxlength="2" autocomplete="off" lang="ja" data-say-placeholder="kanjiPlaceholder" /></div>
        <p class="fam-fine" data-say="keep"></p>
      </section>
      ${familyUnreviewed({ id })}
      <section class="more" aria-labelledby="more-title">
        <h2 id="more-title" data-say="moreTitle"></h2>
        <p data-say="moreText"></p>
        <ul class="uses">
          ${uses.map((line) => `<li><code>${escape(line)}</code></li>`).join("\n          ")}
        </ul>
      </section>
      <section class="more tag" aria-labelledby="tag-title">
        <h2 id="tag-title" data-say="tagTitle"></h2>
        <p data-say="tagText"></p>
        <bushu-picker id="tag" data-testid="tag" parts="氵 日" lang="ja" limit="40"></bushu-picker>
      </section>
      ${familyFooter({ id })}
    </main>
    <script>${FAMILY_SCRIPT}</script>
    <script type="module" src="dist/element-define.js"></script>
    <script type="module" src="demo.js"></script>
  </body>
</html>
`;

rmSync("site", { recursive: true, force: true });
mkdirSync("site", { recursive: true });
cpSync("demo", "site", { recursive: true });
cpSync("dist", "site/dist", { recursive: true });
writeFileSync("site/index.html", page);
// The API reference, made from the source: every export of every entry point.
writeFileSync("site/api.css", API_CSS);
writeFileSync("site/api.html", apiPage({ id, name: "Bushu", icon: ICON }));
console.log("site/ is ready: serve it, or let the Pages workflow publish it.");
