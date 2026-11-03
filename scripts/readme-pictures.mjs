// Takes the pictures the README shows, from the built demo in `site/`: `pnpm screenshots:readme` (builds the demo, then runs this).
// The family's standard is in johnmorrisdotca/.github (README-STANDARD.md); the shared part is readme-pictures-lib.mjs.
// The page is served to a browser without a port, never fetched from the live site, and the same each run: the parts are
// chosen by address, a kanji is tapped, and motion is reduced. It waits on the picker saying it is ready, never on a clock.
// Output: docs/images/<subject>-<desk|phone>-<light|dark>.webp.
import { takePictures } from "./readme-pictures-lib.mjs";

const READY = '[data-testid="picker"][data-ready="true"] .bp-tile';
const address = (parts, lang = "en") => `/?lang=${lang}&help=off&parts=${encodeURIComponent(parts)}`;

/** Open a kanji's card by tapping it in the list. */
const open = (kanji) => (page) => page.locator(`[data-testid="picker"] .bp-kanji[data-kanji="${kanji}"]`).click();

await takePictures({
  shots: [
    // The page from the top: 日 and 月 chosen, 明 opened. On a phone, in Japanese: 氵 chosen, 海 opened, scrolled to the picker.
    {
      subject: "hero",
      views: ["desk", "phone"],
      url: address("日月"),
      height: 780,
      ready: READY,
      async prepare(page, { view }) {
        if (view === "phone") {
          await page.goto(`http://bushu.test${address("氵", "ja")}`);
          await page.waitForSelector(READY);
          await open("海")(page);
          await page
            .locator("#find-title")
            .evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 4));
        } else {
          await open("明")(page);
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      },
    },
    // Two parts chosen: the parts no kanji could join to them are dimmed, and the kanji that hold both are listed.
    { subject: "narrowing", views: ["desk"], url: address("日月"), ready: READY, target: '[data-testid="picker"]' },
    // One part chosen and nothing narrowed yet: the grid by stroke count.
    {
      subject: "grid",
      views: ["phone"],
      url: address("氵", "en"),
      ready: READY,
      target: '[data-testid="picker"] .bp-grid',
    },
    // A kanji's card: its strokes and the parts it is made of, each of which can be chosen from there.
    {
      subject: "kanji-card",
      views: ["phone"],
      url: address("日月"),
      ready: READY,
      async prepare(page) {
        await open("明")(page);
      },
      target: '[data-testid="picker"] .bp-detail',
    },
    // The names a Japanese school teaches, beside the parts chosen.
    {
      subject: "school-names",
      views: ["desk"],
      url: address("氵日", "ja"),
      ready: READY,
      target: '[data-testid="picker"] .bp-chosen',
    },
    // The same picker in Japanese: the stroke headings, the school name of the chosen part, the matches.
    { subject: "japanese", views: ["desk"], url: address("氵", "ja"), ready: READY, target: '[data-testid="picker"]' },
    // The matches for a part, simplest first, in a box that scrolls.
    {
      subject: "matches",
      views: ["desk"],
      url: address("扌", "en"),
      ready: READY,
      target: '[data-testid="picker"] .bp-results',
    },
  ],
  // The family's thumbnail, dark thumbnail and icon (scripts/family-thumbnail.mjs): the picker's own tiles of four
  // strokes with 日 and 月 chosen and the parts that could not narrow further dimmed, beside 明, the first kanji that
  // holds both, and the others it found. The icon is nine of those tiles with 日 and 月 chosen.
  thumbnail: {
    url: address("日月"),
    ready: READY,
    target: "#thumbnail-stage",
    icon: { target: "#thumbnail-icon" },
    label: "Bushu 部首",
    async prepare(page) {
      await page.evaluate(() => {
        const picker = document.querySelector('[data-testid="picker"]');
        const group = [...picker.querySelectorAll(".bp-group")].find((one) => one.querySelector('[data-radical="日"]'));
        const tiles = [...group.querySelectorAll(".bp-tile")].map((tile) => tile.outerHTML);
        const found = [...picker.querySelectorAll(".bp-kanji")].map((kanji) => kanji.textContent);
        const box = (items, columns) =>
          `<div style="display:grid;grid-template-columns:repeat(${columns},44px);gap:4px">${items.join("")}</div>`;
        const arrow = `<svg width="56" height="40" viewBox="0 0 56 40" aria-hidden="true"><path d="M4 20 H46 M34 8 L48 20 L34 32" fill="none" stroke="var(--bp-muted)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const big = `<button class="bp-tile" type="button" aria-pressed="true" style="width:132px;height:132px;font-size:92px;border-radius:18px">${found[0]}</button>`;
        const rest = `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:2px 10px;font-size:30px;line-height:1.3;color:var(--bp-ink)">${found
          .slice(1, 11)
          .map((kanji) => `<span>${kanji}</span>`)
          .join("")}</div>`;
        const stage = `<div id="thumbnail-stage" class="bushu" style="display:flex;align-items:center;gap:28px;padding:8px;width:max-content;container-type:normal;zoom:1.45">${box(tiles.slice(0, 30), 6)}${arrow}<div style="display:grid;justify-items:center;gap:16px">${big}${rest}</div></div>`;
        // The icon: 日 and 月 chosen in the middle row, between parts the picker dimmed and parts still open.
        const chosen = (key) => tiles.find((tile) => tile.includes(`data-radical="${key}"`));
        const others = tiles.filter((tile) => !/data-radical="[日月]"/.test(tile));
        const open = others.filter((tile) => tile.includes('data-dim="false"'));
        const dim = others.filter((tile) => tile.includes('data-dim="true"'));
        const nine = [open[0], dim[0], open[1], chosen("日"), dim[1], chosen("月"), dim[2], open[2], dim[3]];
        const icon = `<div id="thumbnail-icon" class="bushu" style="padding:8px;width:max-content;container-type:normal;zoom:3">${box(nine, 3)}</div>`;
        document.body.replaceChildren();
        document.body.insertAdjacentHTML("beforeend", stage + icon);
      });
    },
  },
});
