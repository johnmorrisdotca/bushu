// The demo page's own script: the radical picker, played by the package's own `mountBushu` (the grid by stroke count, the parts chosen, the kanji
// that hold every one of them, the card of the kanji tapped), with the options the package has, kept on this device between visits, and spoken in
// the language the header's chooser picks.
import { loadBushuData, mountBushu } from "./dist/picker-entry.js";

// The page's own words, in the two languages it speaks. Set as text, never as HTML.
const WORDS = {
  en: {
    pageApi: "API reference",
    pitch: "Find a kanji by the parts you can see in it. Choose parts from the grid, and every kanji that holds all of them appears, while the parts that could not help any more are dimmed.",
    name: "Bushu (部首) is Japanese for radical: 部, a section, and 首, the head, the part a dictionary files a kanji under.",
    nameLink: "About the name",
    findTitle: "Find a kanji",
    optionsTitle: "Options",
    order: "Order",
    orders: { strokes: "Fewest strokes first", dictionary: "Dictionary order" },
    names: "Names",
    on: "Shown",
    off: "Hidden",
    limit: "Most shown",
    kanji: "Parts of a kanji",
    kanjiPlaceholder: "明",
    keep: "Your parts and these options stay on this device.",
    moreTitle: "Using it",
    moreText: "The picker above is the package itself: the lookup, the data and the words. Each line below is all it takes.",
    tagTitle: "As a tag",
    tagText: "The same picker in one element, with no framework: 氵 and 日 chosen, in Japanese, thirty kanji at most.",
    foot: "The radicals and their kanji are RADKFILE, the strokes are KANJIDIC2 (both EDRDG, CC BY-SA 4.0), and the school names are Kanji alive (CC BY 4.0). Your choices stay on this device.",
  },
  ja: {
    pageApi: "API（英語）",
    pitch: "漢字の中に見える部品から、その漢字を探します。グリッドから部品を選ぶと、すべての部品を含む漢字が出て、それ以上役に立たない部品は薄くなります。",
    name: "「部首」は、辞書が漢字を分類するときの目印になる部分のことです。",
    nameLink: "名前について（英語）",
    findTitle: "漢字を探す",
    optionsTitle: "設定",
    order: "並び順",
    orders: { strokes: "画数の少ない順", dictionary: "辞書の順" },
    names: "名前",
    on: "表示",
    off: "非表示",
    limit: "最大表示数",
    kanji: "漢字の部品",
    kanjiPlaceholder: "明",
    keep: "選んだ部品とこの設定は、この端末に残ります。",
    moreTitle: "使い方",
    moreText: "上の部品選びは、このパッケージそのものです。検索、データ、ことばがそろっています。必要なのは、下の各行だけです。",
    tagTitle: "タグで使う",
    tagText: "同じ部品選びを、フレームワークなしの一つの要素で。氵と日を選び、日本語で、最大40字です。",
    foot: "部品とその漢字はRADKFILE、画数はKANJIDIC2（どちらもEDRDG、CC BY-SA 4.0）、学校での名前はKanji alive（CC BY 4.0）によります。選んだ内容はこの端末に残ります。",
  },
};

const KEY = "bushu.page";
const params = new URLSearchParams(location.search);
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
};
const write = (value) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* Not remembered on this device; the picker still works. */
  }
};
const pick = (asked, allowed, kept, fallback) => (allowed.includes(asked) ? asked : allowed.includes(kept) ? kept : fallback);
const flag = (asked, kept, fallback) => (asked === "on" ? true : asked === "off" ? false : typeof kept === "boolean" ? kept : fallback);
const LIMITS = [30, 120, 500];
const asNumber = (text) => (text === null ? Number.NaN : Number(text));

const kept = read();
const settings = {
  order: pick(params.get("order"), ["strokes", "dictionary"], kept.order, "strokes"),
  names: flag(params.get("names"), kept.names, true),
  limit: LIMITS.includes(asNumber(params.get("limit"))) ? asNumber(params.get("limit")) : LIMITS.includes(kept.limit) ? kept.limit : 120,
};
let chosen = params.has("parts") ? [...params.get("parts")].filter((one) => one.trim() !== "") : (kept.chosen ?? []);
let kanji = params.get("kanji") ?? null;

const language = familyLanguage({ id: "bushu", words: WORDS, onChange: () => render() });
const say = (key) => WORDS[language.lang][key];
const keep = () => write({ ...settings, chosen });

const host = document.getElementById("picker");
const data = await loadBushuData();
const nameOf = (key) => (settings.names ? data.names(key) : null);

const mount = mountBushu(host, {
  radicals: data.radicals,
  names: nameOf,
  strokes: settings.order === "strokes" ? data.strokes : undefined,
  language: language.lang,
  limit: settings.limit,
  chosen,
  ...(kanji === null ? {} : { kanji }),
  onChange: (detail) => {
    chosen = detail.chosen;
    keep();
  },
});

function seg(parent, items, chosenItem, choose, labelOf) {
  parent.replaceChildren(
    ...items.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.value = String(item);
      button.setAttribute("aria-pressed", String(item === chosenItem));
      button.append(labelOf(item));
      button.addEventListener("click", () => choose(item));
      return button;
    }),
  );
}

function render() {
  language.say();
  seg(document.getElementById("order"), ["strokes", "dictionary"], settings.order, (each) => change({ order: each }), (each) => say("orders")[each]);
  seg(document.getElementById("names"), [true, false], settings.names, (each) => change({ names: each }), (each) => say(each ? "on" : "off"));
  seg(document.getElementById("limit"), LIMITS, settings.limit, (each) => change({ limit: each }), (each) => String(each));
  mount.set({ language: language.lang, names: nameOf, strokes: settings.order === "strokes" ? data.strokes : undefined, limit: settings.limit });
}

function change(next) {
  Object.assign(settings, next);
  keep();
  render();
}

document.getElementById("kanji-input").addEventListener("input", (event) => {
  const typed = [...event.target.value].find((one) => /\p{Script=Han}/u.test(one));
  if (typed !== undefined) mount.select(typed);
});

render();
if (kanji !== null) document.getElementById("kanji-input").value = kanji;
host.dataset.ready = "true";
