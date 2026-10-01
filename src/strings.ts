/**
 * THE WORDS BUSHU SAYS, in English and Japanese: what the picker's buttons and lines of words say, and what a screen reader hears.
 * Plain data, so a page can read them, replace a few, or add a language of its own beside these two.
 *
 * `{name}` in a line is a value filled in; a line `foo` that has a `fooOne` beside it is said as `fooOne` when its `{n}` is 1.
 */
export type BushuLanguage = "en" | "ja";

export const BUSHU_STRINGS: Record<BushuLanguage, Record<string, string>> = {
  en: {
    pickerLabel: "Find a kanji by its parts",
    chosenLabel: "Parts you have chosen",
    chosenNone: "No parts chosen yet.",
    clear: "Clear",
    removePart: "Take away {part}",
    resultsLabel: "Kanji that hold every chosen part",
    gridLabel: "Parts, by stroke count",
    groupLabel: "{n} strokes",
    groupLabelOne: "1 stroke",
    chooseSome: "Choose the parts you can see in the kanji.",
    found: "{n} kanji hold all of these parts.",
    foundOne: "1 kanji holds all of these parts.",
    foundNone: "No kanji holds all of these parts. Take one away.",
    foundMore: "{n} kanji hold all of these parts. Showing the first {shown}: choose another part to narrow them.",
    tileLabel: "{part}, {name}, {n} strokes",
    tileLabelOne: "{part}, {name}, 1 stroke",
    tileLabelBare: "{part}, {n} strokes",
    tileLabelBareOne: "{part}, 1 stroke",
    detailEmpty: "Tap a kanji to see what it is made of.",
    detailTitle: "Parts of {kanji}",
    detailStrokes: "{n} strokes",
    detailStrokesOne: "1 stroke",
    detailUnknown: "{kanji} is not in the index.",
    copy: "Copy",
    copied: "Copied",
    pick: "Show the parts of {kanji}",
  },
  ja: {
    pickerLabel: "部品から漢字を探す",
    chosenLabel: "選んだ部品",
    chosenNone: "まだ部品を選んでいません。",
    clear: "クリア",
    removePart: "{part}をはずす",
    resultsLabel: "選んだ部品をすべて含む漢字",
    gridLabel: "部品（画数順）",
    groupLabel: "{n}画",
    tileLabel: "{part}、{name}、{n}画",
    tileLabelBare: "{part}、{n}画",
    chooseSome: "漢字の中に見える部品を選んでください。",
    found: "この部品をすべて含む漢字は{n}字です。",
    foundOne: "この部品をすべて含む漢字は1字です。",
    foundNone: "この部品をすべて含む漢字はありません。ひとつはずしてください。",
    foundMore: "この部品をすべて含む漢字は{n}字です。最初の{shown}字を表示しています。部品を足すと絞れます。",
    detailEmpty: "漢字をタップすると、その部品が見られます。",
    detailTitle: "{kanji}の部品",
    detailStrokes: "{n}画",
    detailUnknown: "{kanji}は索引にありません。",
    copy: "コピー",
    copied: "コピーしました",
    pick: "{kanji}の部品を見る",
  },
};

/** The language a `lang` attribute asks for: Japanese for any `ja`, English for everything else. */
export function bushuLanguageOf(tag: string | null | undefined): BushuLanguage {
  return String(tag ?? "").toLowerCase().startsWith("ja") ? "ja" : "en";
}

/** A line in a language, with its `{name}` values filled in, and its `One` form when `n` is 1. */
export function bushuSay(language: BushuLanguage, key: string, values: Record<string, string | number> = {}): string {
  const table = BUSHU_STRINGS[language];
  const one = values["n"] === 1 && `${key}One` in table ? `${key}One` : key;
  const line = table[one] ?? BUSHU_STRINGS.en[one] ?? table[key] ?? BUSHU_STRINGS.en[key] ?? key;
  return line.replace(/\{(\w+)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole));
}
