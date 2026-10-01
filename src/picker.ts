import { radicalForm, withCorrectedStrokes } from "./forms.ts";
import { kanjiForRadicals, orderChosen, radicalGroups, radicalsInKanji, usableRadicals } from "./radicals.ts";
import { bushuLanguageOf, bushuSay, type BushuLanguage } from "./strings.ts";
import { BUSHU_STYLE } from "./style.ts";
import type { Radical } from "./types.ts";

/**
 * A RADICAL PICKER IN ANY PAGE: `mountBushu(host, options)` draws the grid of radicals by stroke count, the parts chosen, the kanji that hold every
 * one of them, and a card for the kanji tapped, with its parts. Choosing a part narrows both lists: the kanji, and the parts that can still lead
 * anywhere (the others are dimmed and cannot be pressed). A separate entry (`@johnmorrisdotca/bushu/picker`), so a server never loads any of it.
 *
 * It is handed what it shows rather than finding it: the radicals (`@johnmorrisdotca/bushu/radkfile`), and if you want them, the Japanese
 * names (`radicalNameEntry` from `/names`) and the strokes of a kanji (`strokesOf` from `/strokes`), which put the matches in order. So a page loads
 * only the data it uses. `loadBushuData()` loads all three. The stand-ins are drawn as the shapes people see (汁 as 氵) and the two miscounted
 * radicals are filed under the right strokes, with nothing to ask for.
 *
 * What happens is told in events on the host (and to the callbacks given): `bushu-change` after each choice, with the parts chosen and how many kanji
 * match, and `bushu-pick` when a kanji is tapped, with the kanji and its parts. Everything a button does is also a method of the returned handle.
 * Needs a page. Nothing the player taps can be selected; the kanji in the card can, to copy it.
 */

/** The names a picker shows beside a radical: what `radicalNameEntry` from `/names` returns. */
export type BushuNameEntry = { readonly name: string; readonly meaning: string };

/** What a picker tells of itself, in `bushu-change` and `bushu-pick` events and to the callbacks. */
export type BushuEventDetail = {
  /** The parts chosen, as RADKFILE's keys, in the grid's order. */
  chosen: string[];
  /** How many kanji hold all of them. */
  matches: number;
  /** The kanji whose card is open, or null. */
  kanji: string | null;
  /** The parts of that kanji, as RADKFILE's keys, fewest strokes first. */
  parts: string[];
};

export type BushuMountOptions = {
  /** The radicals: `RADKFILE.radicals` from `@johnmorrisdotca/bushu/radkfile`. */
  radicals: readonly Radical[];
  /** The Japanese name and English meaning of a radical by its key, or null: `radicalNameEntry` from `@johnmorrisdotca/bushu/names`. Without it no names are shown. */
  names?: (key: string) => BushuNameEntry | null;
  /** The strokes in a kanji, or null: `strokesOf` from `@johnmorrisdotca/bushu/strokes`. Without it the matches are in the dictionary's order. */
  strokes?: (kanji: string) => number | null;
  /** The words: `en` or `ja`. Default the host's (or the page's) `lang`. */
  language?: BushuLanguage;
  /** The most matches drawn at once; past it the picker says to choose another part. Default 120. */
  limit?: number;
  /** Parts already chosen, by key or by shape; any the index does not have are dropped. */
  chosen?: readonly string[];
  /** A kanji whose card is open. */
  kanji?: string;
  onChange?: (detail: BushuEventDetail) => void;
  onPick?: (detail: BushuEventDetail) => void;
};

/** What `mountBushu` gives back: methods for everything a button does, and `destroy`. */
export type BushuMount = {
  /** Choose a part, by its RADKFILE key or by its shape (氵 for 汁), or take it away if it is chosen. A part that cannot narrow anything, or is not in the index, is left alone. */
  toggle(radical: string): void;
  /** Take a part away, by its key or its shape. */
  remove(radical: string): void;
  /** Take every part away. */
  clear(): void;
  /** Open the card of a kanji, with its parts; null closes it. */
  select(kanji: string | null): void;
  /** The parts chosen now, in the grid's order. */
  chosen(): string[];
  /** The kanji that match, all of them, in the order drawn. */
  matches(): string[];
  /** Change a setting later: the words, the limit, the names or the strokes. */
  set(options: Partial<Pick<BushuMountOptions, "language" | "limit" | "names" | "strokes">>): void;
  destroy(): void;
};

/** The most matches a picker draws unless `limit` says. */
export const BUSHU_RESULT_LIMIT = 120;

/** Puts the picker's style in the page once. Called by `mountBushu`; call it yourself to share one style with your own markup. */
export function ensureBushuStyle(document: Document = globalThis.document): void {
  if (document.getElementById("bushu-style") !== null) return;
  const style = document.createElement("style");
  style.id = "bushu-style";
  style.textContent = BUSHU_STYLE;
  document.head.append(style);
}

type Made<K extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[K];
function make<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): Made<K> {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function mountBushu(host: HTMLElement, options: BushuMountOptions): BushuMount {
  ensureBushuStyle(host.ownerDocument);
  const grid = withCorrectedStrokes(options.radicals);
  const known = new Set(grid.map((entry) => entry.radical));
  // A part may be named by its key or by the shape people see (氵 for 汁); a key that is itself a shape wins (八 is a key, and the form of ハ).
  const byShape = new Map<string, string>();
  for (const { radical } of grid) if (!known.has(radicalForm(radical)) && !byShape.has(radicalForm(radical))) byShape.set(radicalForm(radical), radical);
  const keyOf = (part: string): string | null => (known.has(part) ? part : (byShape.get(part) ?? null));
  let names = options.names;
  let strokes = options.strokes;
  let limit = options.limit ?? BUSHU_RESULT_LIMIT;
  let language: BushuLanguage = options.language ?? bushuLanguageOf(host.closest("[lang]")?.getAttribute("lang") ?? host.ownerDocument.documentElement.lang);
  let chosen = orderChosen(grid, (options.chosen ?? []).map(keyOf).filter((key): key is string => key !== null));
  let selected: string | null = options.kanji ?? null;
  let matches: string[] = [];
  let destroyed = false;
  let copiedTimer: ReturnType<typeof setTimeout> | undefined;

  const say = (key: string, values: Record<string, string | number> = {}): string => bushuSay(language, key, values);
  /** The name a radical is known by in the page's language: the school's in Japanese, the English meaning in English, the other where there is only that. */
  const nameOf = (key: string): string => {
    const entry = names?.(key) ?? null;
    if (entry === null) return "";
    return language === "ja" ? entry.name : entry.meaning;
  };

  const root = make("div", "bp-layout");
  const chosenBox = make("div", "bp-chosen");
  chosenBox.setAttribute("role", "group");
  const says = make("p", "bp-says");
  says.setAttribute("aria-live", "polite");
  const results = make("div", "bp-results");
  results.setAttribute("role", "group");
  const detail = make("div", "bp-detail");
  const gridBox = make("div", "bp-grid");
  gridBox.setAttribute("role", "group");
  root.append(chosenBox, says, results, detail, gridBox);
  host.classList.add("bushu");
  host.setAttribute("role", "group");
  host.replaceChildren(root);

  const tiles = new Map<string, HTMLButtonElement>();

  /** The tiles, once: the grid by stroke count. A change of language draws them again, for their labels. */
  function buildGrid(): void {
    tiles.clear();
    gridBox.replaceChildren();
    gridBox.setAttribute("aria-label", say("gridLabel"));
    for (const group of radicalGroups(grid)) {
      const section = make("section", "bp-group");
      const heading = make("h3", "bp-strokes", say("groupLabel", { n: group.strokes }));
      const row = make("div", "bp-tiles");
      for (const key of group.radicals) {
        const tile = make("button", "bp-tile", radicalForm(key));
        tile.type = "button";
        tile.dataset["radical"] = key;
        const name = nameOf(key);
        tile.setAttribute("aria-label", name === "" ? say("tileLabelBare", { part: radicalForm(key), n: group.strokes }) : say("tileLabel", { part: radicalForm(key), name, n: group.strokes }));
        if (name !== "") tile.title = name;
        tile.setAttribute("aria-pressed", "false");
        tile.addEventListener("click", () => toggle(key));
        tiles.set(key, tile);
        row.append(tile);
      }
      section.append(heading, row);
      gridBox.append(section);
    }
  }

  function chip(key: string): HTMLButtonElement {
    const button = make("button", "bp-chip");
    button.type = "button";
    button.dataset["radical"] = key;
    const name = nameOf(key);
    button.append(make("span", "bp-shape", radicalForm(key)));
    if (name !== "") button.append(make("span", "bp-name", name));
    button.setAttribute("aria-label", say("removePart", { part: name === "" ? radicalForm(key) : `${radicalForm(key)} ${name}` }));
    button.addEventListener("click", () => remove(key));
    return button;
  }

  function partButton(key: string, usable: ReadonlySet<string>): HTMLButtonElement {
    const button = make("button", "bp-part");
    button.type = "button";
    button.dataset["radical"] = key;
    button.setAttribute("aria-pressed", String(chosen.includes(key)));
    // A part that no kanji holds together with what is chosen is dimmed, as in the grid, and cannot be pressed.
    button.disabled = !chosen.includes(key) && !usable.has(key);
    const name = nameOf(key);
    button.append(make("span", "bp-shape", radicalForm(key)));
    if (name !== "") button.append(make("span", "bp-name", name));
    button.addEventListener("click", () => toggle(key));
    return button;
  }

  function eventDetail(): BushuEventDetail {
    return { chosen: [...chosen], matches: matches.length, kanji: selected, parts: selected === null ? [] : radicalsInKanji(grid, selected).map((entry) => entry.radical) };
  }

  function drawDetail(): void {
    detail.replaceChildren();
    if (selected === null) {
      detail.append(make("p", "bp-detail-empty", say("detailEmpty")));
      return;
    }
    const parts = radicalsInKanji(grid, selected);
    if (parts.length === 0) {
      detail.append(make("p", "bp-detail-empty", say("detailUnknown", { kanji: selected })));
      return;
    }
    const head = make("div", "bp-detail-head");
    const big = make("span", "bp-big", selected);
    big.setAttribute("lang", "ja");
    const meta = make("span", "bp-meta");
    const count = strokes?.(selected) ?? null;
    meta.textContent = count === null ? say("detailTitle", { kanji: selected }) : `${say("detailTitle", { kanji: selected })} · ${say("detailStrokes", { n: count })}`;
    const copy = make("button", "bp-copy", say("copy"));
    copy.type = "button";
    copy.addEventListener("click", () => {
      const kanji = selected;
      if (kanji === null || typeof navigator === "undefined" || navigator.clipboard === undefined) return;
      void navigator.clipboard.writeText(kanji).then(() => {
        copy.textContent = say("copied");
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(() => {
          if (!destroyed) copy.textContent = say("copy");
        }, 1500);
      }, () => undefined);
    });
    head.append(big, meta, copy);
    const list = make("div", "bp-parts");
    list.setAttribute("role", "group");
    list.setAttribute("aria-label", say("detailTitle", { kanji: selected }));
    const usable = usableRadicals(grid, chosen);
    for (const part of parts) list.append(partButton(part.radical, usable));
    detail.append(head, list);
  }

  function draw(): void {
    const all = kanjiForRadicals(grid, chosen);
    const count = strokes;
    matches = count === undefined ? all : all.map((kanji, index) => ({ kanji, index, n: count(kanji) ?? Infinity })).sort((left, right) => (left.n === right.n ? left.index - right.index : left.n < right.n ? -1 : 1)).map((row) => row.kanji);
    const usable = usableRadicals(grid, chosen);

    chosenBox.setAttribute("aria-label", say("chosenLabel"));
    chosenBox.replaceChildren();
    if (chosen.length === 0) chosenBox.append(make("span", "bp-none", say("chosenNone")));
    else {
      for (const key of chosen) chosenBox.append(chip(key));
      const clear = make("button", "bp-clear", say("clear"));
      clear.type = "button";
      clear.addEventListener("click", () => api.clear());
      chosenBox.append(clear);
    }

    for (const [key, tile] of tiles) {
      const on = chosen.includes(key);
      tile.setAttribute("aria-pressed", String(on));
      tile.disabled = !on && !usable.has(key);
      tile.dataset["dim"] = String(tile.disabled);
    }

    results.setAttribute("aria-label", say("resultsLabel"));
    results.replaceChildren();
    const shown = matches.slice(0, limit);
    for (const kanji of shown) {
      const button = make("button", "bp-kanji", kanji);
      button.type = "button";
      button.dataset["kanji"] = kanji;
      button.lang = "ja";
      button.setAttribute("aria-label", say("pick", { kanji }));
      button.setAttribute("aria-pressed", String(kanji === selected));
      button.addEventListener("click", () => api.select(kanji));
      results.append(button);
    }
    says.textContent = chosen.length === 0 ? say("chooseSome") : matches.length === 0 ? say("foundNone") : matches.length > limit ? say("foundMore", { n: matches.length, shown: limit }) : say("found", { n: matches.length });
    drawDetail();
  }

  function changed(): void {
    draw();
    const detailNow = eventDetail();
    options.onChange?.(detailNow);
    host.dispatchEvent(new CustomEvent("bushu-change", { detail: detailNow, bubbles: true }));
  }

  function toggle(part: string): void {
    const radical = keyOf(part);
    if (radical === null) return;
    if (chosen.includes(radical)) chosen = chosen.filter((key) => key !== radical);
    else if (usableRadicals(grid, chosen).has(radical)) chosen = orderChosen(grid, [...chosen, radical]);
    else return;
    changed();
  }

  function remove(part: string): void {
    const radical = keyOf(part);
    if (radical === null || !chosen.includes(radical)) return;
    chosen = chosen.filter((key) => key !== radical);
    changed();
  }

  const api: BushuMount = {
    toggle,
    remove,
    clear() {
      if (chosen.length === 0) return;
      chosen = [];
      changed();
    },
    select(kanji) {
      selected = kanji;
      draw();
      const detailNow = eventDetail();
      if (kanji !== null) {
        options.onPick?.(detailNow);
        host.dispatchEvent(new CustomEvent("bushu-pick", { detail: detailNow, bubbles: true }));
      }
    },
    chosen: () => [...chosen],
    matches: () => [...matches],
    set(next) {
      if (next.language !== undefined) language = next.language;
      if (next.limit !== undefined) limit = next.limit;
      if ("names" in next) names = next.names;
      if ("strokes" in next) strokes = next.strokes;
      buildGrid();
      draw();
    },
    destroy() {
      destroyed = true;
      clearTimeout(copiedTimer);
      host.replaceChildren();
      host.classList.remove("bushu");
      host.removeAttribute("role");
    },
  };

  host.setAttribute("aria-label", say("pickerLabel"));
  buildGrid();
  draw();
  return api;
}
