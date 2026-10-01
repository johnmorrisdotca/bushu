import { loadBushuData } from "./load.ts";
import { mountBushu, type BushuMount } from "./picker.ts";
import type { BushuLanguage } from "./strings.ts";

/**
 * THE `<bushu-picker>` ELEMENT: the radical picker in a tag, with no framework. `@johnmorrisdotca/bushu/element/define` defines it; this entry holds the
 * class alone, to extend or to define under another name. Safe to import on a server, where there is no page: the class then extends nothing.
 *
 * ```html
 * <bushu-picker></bushu-picker>
 * <bushu-picker lang="ja" parts="氵 日" limit="60"></bushu-picker>
 * ```
 *
 * It loads its own data (the radicals, the names and the strokes) when it is put on the page, so the first thing a visitor sees is the grid after
 * one short load, and nothing is loaded for a page that never shows it.
 *
 * Attributes (each is read again when it changes):
 *  - `lang`: `en` or `ja`, or the page's.
 *  - `parts`: the parts chosen, as the shapes people see (氵) or RADKFILE keys, one character each, with or without spaces: `氵 日`. `kanji`: a kanji whose card is open.
 *  - `limit`: the most matches drawn, 120 unless it says.
 *
 * It fires `bushu-change` and `bushu-pick` (see `mountBushu`), and has the methods `toggle(part)`, `clear()` and `select(kanji)`; `picker` is the
 * mounted handle once the data has loaded.
 */
const ElementBase: typeof HTMLElement = typeof HTMLElement === "undefined" ? (class {} as unknown as typeof HTMLElement) : HTMLElement;

export class BushuPicker extends ElementBase {
  static observedAttributes = ["lang", "parts", "kanji", "limit"];

  #mount: BushuMount | null = null;
  #loading = false;

  connectedCallback(): void {
    if (this.#mount !== null || this.#loading) return;
    this.#loading = true;
    void loadBushuData().then((data) => {
      this.#loading = false;
      if (!this.isConnected || this.#mount !== null) return;
      this.#mount = mountBushu(this, { ...data, ...this.#settings() });
    });
  }

  disconnectedCallback(): void {
    this.#mount?.destroy();
    this.#mount = null;
  }

  attributeChangedCallback(name: string): void {
    const mount = this.#mount;
    if (mount === null) return;
    if (name === "parts") {
      const wanted = this.#parts();
      mount.clear();
      for (const part of wanted) mount.toggle(part);
    } else if (name === "kanji") mount.select(this.getAttribute("kanji"));
    else {
      const { language, limit } = this.#settings();
      mount.set({ language, limit });
    }
  }

  /** The mounted picker's handle (`mountBushu`), or null until its data has loaded. */
  get picker(): BushuMount | null {
    return this.#mount;
  }

  toggle(part: string): void {
    this.#mount?.toggle(part);
  }

  clear(): void {
    this.#mount?.clear();
  }

  select(kanji: string | null): void {
    this.#mount?.select(kanji);
  }

  #parts(): string[] {
    return [...(this.getAttribute("parts") ?? "")].filter((char) => char.trim() !== "");
  }

  #settings(): { language?: BushuLanguage; limit?: number; chosen: string[]; kanji?: string } {
    const lang = this.getAttribute("lang");
    const limit = Number(this.getAttribute("limit"));
    const kanji = this.getAttribute("kanji");
    return {
      ...(lang === "en" || lang === "ja" ? { language: lang } : {}),
      ...(Number.isInteger(limit) && limit > 0 ? { limit } : {}),
      chosen: this.#parts(),
      ...(kanji === null ? {} : { kanji }),
    };
  }
}
