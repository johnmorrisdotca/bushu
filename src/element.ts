import { loadBushuData } from "./load.ts";
import { mountBushu, type BushuMount, type BushuMountOptions } from "./picker.ts";
import { BUSHU_STYLE } from "./style.ts";
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

/** Real mount options, checked alongside builder coverage. */
export const BUSHU_EMBED_OPTION_KEYS = Object.keys({ radicals: true, names: true, strokes: true, language: true, limit: true, chosen: true, kanji: true, onChange: true, onPick: true } satisfies Record<keyof BushuMountOptions, boolean>);
/** Host data and callbacks. Attribute choices override the host's initial selection. */
export type BushuElementOptions = Partial<BushuMountOptions>;
/** A configurable radical picker with reflected presentation attributes. */
export class BushuPicker extends ElementBase {
  static observedAttributes = ["lang", "parts", "kanji", "limit", "size", "width", "theme", "label"];

  #widthBefore: string | null = null;
  #widthOwned = false;
  #labelBefore: { role: string | null; label: string | null } | null = null;
  #write(name: string, value: unknown): void { if (value === null || value === undefined) this.removeAttribute(name); else this.setAttribute(name, String(value)); }
  #frame(): void {
    this.style.display = "block"; this.style.maxWidth = "100%";
    const width = Number(this.getAttribute("width")), size = this.getAttribute("size");
    const pixels = this.hasAttribute("width") && width > 0 && Number.isFinite(width) ? Math.min(width, 2000) : size === "small" ? 320 : size === "medium" ? 480 : size === "large" ? 640 : null;
    if (pixels !== null) { if (!this.#widthOwned) this.#widthBefore = this.style.width; this.#widthOwned = true; this.style.width = `${pixels}px`; }
    else if (this.#widthOwned) { this.style.width = this.#widthBefore ?? ""; this.#widthOwned = false; }
    const theme = this.getAttribute("theme"); this.style.colorScheme = theme === "light" || theme === "dark" ? theme : "light dark";
    this.setAttribute("data-bushu-embed", "");
    const root = this.getRootNode(), target: ParentNode = typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot ? root : this.ownerDocument.head;
    if (target.querySelector("style[data-bushu-embed-style]") === null) {
      const style = this.ownerDocument.createElement("style"); style.setAttribute("data-bushu-embed-style", "");
      const palette = (theme: string) => [...BUSHU_STYLE.matchAll(new RegExp(`:root\\[data-theme="${theme}"\\] \\.(?:bushu) \\{([^}]+)\\}`, "g"))].map(match => `[data-bushu-embed][theme="${theme}"].bushu {${match[1]}}`).join("\n");
      const light = BUSHU_STYLE.match(/\.bushu \{([^}]+)\}/)?.[1] ?? "";
      style.textContent = BUSHU_STYLE + palette("dark") + `\n[data-bushu-embed][theme="light"].bushu {${light}}` + `@media(prefers-color-scheme:dark){${palette("dark").replaceAll('[theme="dark"]', ':not([theme="light"]):not([theme="dark"])')}}`;
 target.append(style);
    }
    if (this.#mount !== null && this.hasAttribute("label")) { this.#labelBefore ??= { role: this.getAttribute("role"), label: this.getAttribute("aria-label") }; this.setAttribute("role", "group"); this.setAttribute("aria-label", this.getAttribute("label")!); }
    else if (this.#labelBefore !== null) { for (const [name, value] of [["role", this.#labelBefore.role], ["aria-label", this.#labelBefore.label]]) { if (value === null) this.removeAttribute(name!); else this.setAttribute(name!, value!); } this.#labelBefore = null; }
  }
  #mount: BushuMount | null = null;
  #revision = 0;
  #options: BushuElementOptions = {};
  /** Host data and callbacks. Callback and appearance changes preserve selection. */
  get options(): BushuElementOptions { return this.#options; }
  set options(value: BushuElementOptions) {
    const changed = value?.radicals !== this.#options.radicals;
    this.#options = value ?? {};
    if (changed && this.isConnected) { this.disconnectedCallback(); this.connectedCallback(); }
    else this.#mount?.set({ ...this.#settings(), ...(this.#options.names === undefined ? {} : { names: this.#options.names }), ...(this.#options.strokes === undefined ? {} : { strokes: this.#options.strokes }) });
    if (this.isConnected) this.#frame();
  }
  connectedCallback(): void {
    this.#frame(); const revision = ++this.#revision;
    if (this.#mount !== null) return;
    void (this.#options.radicals === undefined ? loadBushuData() : Promise.resolve({ radicals: this.#options.radicals, names: this.#options.names, strokes: this.#options.strokes })).then((data) => {
      if (!this.isConnected || revision !== this.#revision || this.#mount !== null) return;
      this.#mount = mountBushu(this, { ...data, ...this.#options, ...this.#settings(), onChange: detail => this.#options.onChange?.(detail), onPick: detail => this.#options.onPick?.(detail) });
      this.#frame();
      this.dispatchEvent(new CustomEvent("bushu-load", { bubbles: true, composed: true, detail: { chosen: this.#mount.chosen(), matches: this.#mount.matches().length } }));
    }).catch((error: unknown) => {
      if (!this.isConnected || revision !== this.#revision) return;
      const message = error instanceof Error ? error.message : String(error), status = this.ownerDocument.createElement("p"); status.setAttribute("role", "status"); status.textContent = message; this.replaceChildren(status);
      this.dispatchEvent(new CustomEvent("bushu-error", { bubbles: true, composed: true, detail: { message } }));
    });
  }
  disconnectedCallback(): void { ++this.#revision; this.#mount?.destroy(); this.#mount = null; }

  attributeChangedCallback(name: string): void {
    if (this.isConnected) this.#frame();
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
    this.#frame();
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

  /** The `parts` attribute, reflected. */
  get parts(): string | null { return this.getAttribute("parts"); }
  set parts(value: string | number | boolean | null | undefined) { this.#write("parts", value); }
  /** The `kanji` attribute, reflected. */
  get kanji(): string | null { return this.getAttribute("kanji"); }
  set kanji(value: string | number | boolean | null | undefined) { this.#write("kanji", value); }
  /** The `limit` attribute, reflected. */
  get limit(): string | null { return this.getAttribute("limit"); }
  set limit(value: string | number | boolean | null | undefined) { this.#write("limit", value); }
  /** The `size` attribute, reflected. */
  get size(): string | null { return this.getAttribute("size"); }
  set size(value: string | number | boolean | null | undefined) { this.#write("size", value); }
  /** The `width` attribute, reflected. */
  get width(): string | null { return this.getAttribute("width"); }
  set width(value: string | number | boolean | null | undefined) { this.#write("width", value); }
  /** The `theme` attribute, reflected. */
  get theme(): string | null { return this.getAttribute("theme"); }
  set theme(value: string | number | boolean | null | undefined) { this.#write("theme", value); }
  /** The `label` attribute, reflected. */
  get label(): string | null { return this.getAttribute("label"); }
  set label(value: string | number | boolean | null | undefined) { this.#write("label", value); }
  #parts(): string[] {
    return [...(this.getAttribute("parts") ?? this.#options.chosen?.join("") ?? "")].filter((char) => char.trim() !== "");
  }

  #settings(): { language?: BushuLanguage; limit?: number; chosen: string[]; kanji?: string } {
    const lang = this.getAttribute("lang") ?? this.#options.language;
    const limit = Number(this.getAttribute("limit") ?? this.#options.limit);
    const kanji = this.getAttribute("kanji") ?? this.#options.kanji ?? null;
    return {
      ...(lang === "en" || lang === "ja" ? { language: lang } : {}),
      ...(Number.isInteger(limit) && limit > 0 ? { limit } : {}),
      chosen: this.#parts(),
      ...(kanji === null ? {} : { kanji }),
    };
  }
}

/** Defines the default picker or a subclass under a custom name. Safe on a server. */
export function definePicker(tagName = "bushu-picker", registry: CustomElementRegistry | undefined = typeof customElements === "undefined" ? undefined : customElements): void {
  if (registry !== undefined && registry.get(tagName) === undefined) registry.define(tagName, tagName === "bushu-picker" ? BushuPicker : class extends BushuPicker {});
}
