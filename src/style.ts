/**
 * THE STYLE a Bushu picker wears (`mountBushu`, `<bushu-picker>`): its colours as custom properties on `.bushu`, its boxes, its tiles and
 * its chips. Colours are `--bp-ink`, `--bp-muted`, `--bp-rule`, `--bp-surface`, `--bp-chosen`, `--bp-chosen-ink` and `--bp-accent`, so a page
 * sets only the ones it wants different. Light and dark follow the page's (`prefers-color-scheme`, or a `data-theme` on the root).
 *
 * Nothing moves when something is chosen: the line of chosen parts, the line of words, the list of matches, the kanji's card and the grid
 * each keep one height whatever is in them, a long list scrolls inside its box, and every button is at least 44 pixels square. The tiles
 * cannot be selected; the kanji in the card can, so that it can be copied.
 */
export const BUSHU_STYLE = `
.bushu {
  --bp-ink: #1f2320; --bp-muted: #6b6f68; --bp-rule: #ddd6c6; --bp-surface: #fbf8f1; --bp-chosen: #2f5d4a; --bp-chosen-ink: #f3efe4; --bp-accent: #b5452c;
  display: block; max-width: 100%; box-sizing: border-box; color: var(--bp-ink); container-type: inline-size;
  font-family: "Hiragino Sans", "Yu Gothic", "Noto Sans CJK JP", "Noto Sans JP", system-ui, -apple-system, "Segoe UI", sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .bushu { --bp-ink: #ece8dc; --bp-muted: #a09d93; --bp-rule: #3a3d38; --bp-surface: #1d201e; --bp-chosen: #6fcf97; --bp-chosen-ink: #14211a; --bp-accent: #ff8a6b; }
}
:root[data-theme="dark"] .bushu { --bp-ink: #ece8dc; --bp-muted: #a09d93; --bp-rule: #3a3d38; --bp-surface: #1d201e; --bp-chosen: #6fcf97; --bp-chosen-ink: #14211a; --bp-accent: #ff8a6b; }
.bushu *, .bushu *::before, .bushu *::after { box-sizing: border-box; }
.bushu [hidden] { display: none !important; }
.bushu button { font: inherit; color: inherit; touch-action: manipulation; -webkit-tap-highlight-color: transparent; user-select: none; -webkit-user-select: none; }
.bushu .bp-layout { display: grid; gap: 10px; grid-template-areas: "chosen" "says" "results" "detail" "grid"; min-width: 0; }
.bushu .bp-layout > * { min-width: 0; }
.bushu .bp-chosen { grid-area: chosen; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 44px; }
.bushu .bp-none { color: var(--bp-muted); font-size: .85rem; }
.bushu .bp-chip, .bushu .bp-clear, .bushu .bp-copy { border: 1px solid var(--bp-rule); background: var(--bp-surface); border-radius: 999px; min-height: 44px; min-width: 44px; padding: 0 14px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; font-size: .85rem; font-weight: 600; }
.bushu .bp-chip { background: var(--bp-chosen); color: var(--bp-chosen-ink); border-color: var(--bp-chosen); }
.bushu .bp-chip .bp-shape { font-size: 1.25rem; line-height: 1; }
.bushu .bp-chip .bp-name { font-size: .8rem; font-weight: 500; }
.bushu .bp-clear:hover, .bushu .bp-copy:hover { border-color: var(--bp-ink); }
.bushu .bp-says { grid-area: says; margin: 0; font-size: .85rem; line-height: 1.4; color: var(--bp-muted); min-height: 2.8em; }
.bushu .bp-results { grid-area: results; display: grid; grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); grid-auto-rows: 44px; gap: 4px; align-content: start; height: 10.2rem; overflow-y: auto; overscroll-behavior: contain; border: 1px solid var(--bp-rule); border-radius: 10px; padding: 4px; background: var(--bp-surface); }
.bushu .bp-kanji { border: 1px solid transparent; background: transparent; border-radius: 8px; font-size: 1.6rem; line-height: 1; cursor: pointer; padding: 0; }
.bushu .bp-kanji:hover { border-color: var(--bp-rule); }
.bushu .bp-kanji[aria-pressed="true"] { background: var(--bp-chosen); color: var(--bp-chosen-ink); }
.bushu .bp-detail { grid-area: detail; border: 1px solid var(--bp-rule); border-radius: 10px; padding: 8px 12px; min-height: 8.6rem; background: var(--bp-surface); display: grid; align-content: start; gap: 6px; }
.bushu .bp-detail-empty { color: var(--bp-muted); font-size: .85rem; margin: 0; align-self: center; }
.bushu .bp-detail-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.bushu .bp-big { font-size: 2.6rem; line-height: 1.1; user-select: text; -webkit-user-select: text; }
.bushu .bp-meta { font-size: .85rem; color: var(--bp-muted); flex: 1 1 8rem; min-width: 0; }
.bushu .bp-parts { display: flex; flex-wrap: wrap; gap: 6px; }
.bushu .bp-part { border: 1px solid var(--bp-rule); background: transparent; border-radius: 10px; min-height: 44px; min-width: 44px; padding: 2px 10px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.bushu .bp-part .bp-shape { font-size: 1.35rem; line-height: 1; }
.bushu .bp-part .bp-name { font-size: .75rem; color: var(--bp-muted); }
.bushu .bp-part:disabled { opacity: .35; cursor: default; }
.bushu .bp-part[aria-pressed="true"] { background: var(--bp-chosen); color: var(--bp-chosen-ink); border-color: var(--bp-chosen); }
.bushu .bp-part[aria-pressed="true"] .bp-name { color: inherit; }
.bushu .bp-grid { grid-area: grid; height: min(26rem, 60vh); overflow-y: auto; overscroll-behavior: contain; border: 1px solid var(--bp-rule); border-radius: 10px; padding: 4px 8px 10px; background: var(--bp-surface); }
.bushu .bp-group { margin: 0; }
.bushu .bp-strokes { margin: 10px 0 4px; font-size: .75rem; font-weight: 700; letter-spacing: .04em; color: var(--bp-muted); position: sticky; top: -4px; background: var(--bp-surface); padding: 2px 0; z-index: 1; }
.bushu .bp-tiles { display: flex; flex-wrap: wrap; gap: 4px; }
.bushu .bp-tile { width: 44px; height: 44px; border: 1px solid var(--bp-rule); background: transparent; border-radius: 8px; font-size: 1.45rem; line-height: 1; cursor: pointer; padding: 0; }
.bushu .bp-tile:hover:not(:disabled) { border-color: var(--bp-ink); }
.bushu .bp-tile[aria-pressed="true"] { background: var(--bp-chosen); color: var(--bp-chosen-ink); border-color: var(--bp-chosen); }
.bushu .bp-tile:disabled { opacity: .28; cursor: default; }
.bushu button:focus-visible { outline: 2px solid var(--bp-ink); outline-offset: 2px; }
@container (min-width: 720px) {
  .bushu .bp-layout { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); grid-template-areas: "grid chosen" "grid says" "grid results" "grid detail"; align-items: start; }
  .bushu .bp-grid { height: 30rem; }
  .bushu .bp-results { height: 12.6rem; }
}
`;
