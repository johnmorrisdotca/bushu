/**
 * Bushu 部首, the radical lookup: find a kanji by the parts it is made of, with no page and no data needed.
 *
 * - `kanjiForRadicals` and `usableRadicals`: the kanji that hold every chosen part, and the parts that can still narrow them (the dimming of a picker).
 * - `radicalGroups`, `orderChosen` and `radicalsInKanji`: the grid by stroke count, the choice in the grid's order, and the parts of one kanji.
 * - `radicalForm` and `withCorrectedStrokes`: RADKFILE's stand-ins (汁 for 氵) turned back into the shapes people see, and its two wrong stroke counts put right.
 *
 * The data is in `/radkfile` (the radicals), `/names` (さんずい, にんべん, くさかんむり) and `/strokes` (the strokes of a kanji), and the picker to put in a page in `/picker`.
 */
export { VERSION } from "./version.ts";
export type { Radical } from "./types.ts";
export { kanjiForRadicals, orderChosen, radicalGroups, radicalsInKanji, usableRadicals } from "./radicals.ts";
export type { RadicalGroup } from "./radicals.ts";
export { isRadicalStandIn, RADICAL_FORMS, RADKFILE_STROKE_CORRECTIONS, radicalForm, radicalStrokes, withCorrectedStrokes } from "./forms.ts";
