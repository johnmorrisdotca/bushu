// embed-attributes.ts: how every custom element of the family reads its standard embed attributes. One file copied
// unchanged into every package that has an element; to change it, change it in every repository at once.

/** The width, in pixels, that each value of an element's `size` attribute names. */
export const EMBED_SIZE_PX = { small: 320, medium: 480, large: 640 } as const;

/** The widest, in pixels, that an element's `width` attribute may make it. */
export const EMBED_MAX_WIDTH_PX = 2000;

/** Attribute values that turn a switch off; anything else present turns it on. */
const OFF_WORDS: readonly string[] = ["false", "off", "no", "0"];

/** The width an element takes from its `width` and `size` attributes, or null when neither names one. */
export function embedWidth(width: string | null, size: string | null): number | null {
  const pixels = Number(width);
  if (width !== null && pixels > 0 && Number.isFinite(pixels)) return Math.min(pixels, EMBED_MAX_WIDTH_PX);
  return size !== null && Object.hasOwn(EMBED_SIZE_PX, size) ? EMBED_SIZE_PX[size as keyof typeof EMBED_SIZE_PX] : null;
}

/** The CSS `color-scheme` for an element's `theme` attribute: the one it names, or the page's. */
export function embedColorScheme(theme: string | null): string {
  return theme === "light" || theme === "dark" ? theme : "light dark";
}

/** Whether a switch attribute is on: `fallback` when it is absent, off for "false", "off", "no" and "0". */
export function isOn(value: string | null, fallback: boolean): boolean {
  return value === null ? fallback : !OFF_WORDS.includes(value.trim().toLowerCase());
}

/** Sets an attribute to a value's text, or removes it for null and undefined. */
export function writeAttribute(element: Element, name: string, value: unknown): void {
  if (value === null || value === undefined) element.removeAttribute(name);
  else element.setAttribute(name, String(value));
}
