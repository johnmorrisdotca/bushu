/**
 * The radical picker for a page: `mountBushu` draws the grid of parts by stroke count and the kanji that hold the parts chosen into any
 * element, `loadBushuData` fetches the data it shows, and the words (`BUSHU_STRINGS`) and the style (`BUSHU_STYLE`) are here to read or replace.
 * A separate entry (`@johnmorrisdotca/bushu/picker`), so a server never loads any of it.
 */
export { BUSHU_RESULT_LIMIT, ensureBushuStyle, mountBushu } from "./picker.ts";
export type { BushuEventDetail, BushuMount, BushuMountOptions, BushuNameEntry } from "./picker.ts";
export { loadBushuData } from "./load.ts";
export { BUSHU_STRINGS, bushuLanguageOf, bushuSay } from "./strings.ts";
export type { BushuLanguage } from "./strings.ts";
export { BUSHU_STYLE } from "./style.ts";
