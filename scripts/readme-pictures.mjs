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
          await page.locator("#find-title").evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 4));
        } else {
          await open("明")(page);
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      },
    },
    // Two parts chosen: the parts no kanji could join to them are dimmed, and the kanji that hold both are listed.
    { subject: "narrowing", views: ["desk"], url: address("日月"), ready: READY, target: '[data-testid="picker"]' },
    // One part chosen and nothing narrowed yet: the grid by stroke count.
    { subject: "grid", views: ["phone"], url: address("氵", "en"), ready: READY, target: '[data-testid="picker"] .bp-grid' },
    // A kanji's card: its strokes and the parts it is made of, each of which can be chosen from there.
    { subject: "kanji-card", views: ["phone"], url: address("日月"), ready: READY, async prepare(page) { await open("明")(page); }, target: '[data-testid="picker"] .bp-detail' },
    // The names a Japanese school teaches, beside the parts chosen.
    { subject: "school-names", views: ["desk"], url: address("氵日", "ja"), ready: READY, target: '[data-testid="picker"] .bp-chosen' },
    // The same picker in Japanese: the stroke headings, the school name of the chosen part, the matches.
    { subject: "japanese", views: ["desk"], url: address("氵", "ja"), ready: READY, target: '[data-testid="picker"]' },
    // The matches for a part, simplest first, in a box that scrolls.
    { subject: "matches", views: ["desk"], url: address("扌", "en"), ready: READY, target: '[data-testid="picker"] .bp-results' },
  ],
});
