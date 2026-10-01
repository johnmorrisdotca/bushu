// Takes the pictures the README shows, from the built demo in `site/`: `pnpm pictures` (builds the demo, then runs this).
// The page is served to a browser without a port, never fetched from the live site, and the same each run: the parts are
// chosen by address, a kanji is tapped, and motion is reduced. It waits on the picker saying it is ready, never on a clock.
// Output: docs/desktop.jpg (1280 wide, light, English: 日 and 月 chosen, 明 opened) and docs/phone.jpg (390 by 844, dark, Japanese:
// 氵 chosen, with its Japanese name, scrolled to the picker).
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, "site");
const docs = join(root, "docs");
const host = "http://bushu.test";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
const QUALITY = 78;

if (!existsSync(join(site, "index.html"))) throw new Error("site/ is not built: run `pnpm pictures` (it builds the demo first)");
const browser = await chromium.launch();

/** The demo opened with parts chosen, a kanji tapped if one is named, and a picture taken of it. */
async function shot({ width, height, colorScheme, lang, parts, kanji, path, scrollTo }) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme, reducedMotion: "reduce", locale: "en-US", deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.route(`${host}/**`, (route) => {
    const { pathname } = new URL(route.request().url());
    const file = join(site, pathname === "/" ? "index.html" : pathname);
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ body: readFileSync(file), contentType: TYPES[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream" });
  });
  await page.goto(`${host}/?lang=${lang}&help=off&parts=${encodeURIComponent(parts)}`);
  await page.waitForSelector('[data-testid="picker"][data-ready="true"] .bp-tile');
  if (kanji !== undefined) await page.locator(`[data-testid="picker"] .bp-kanji[data-kanji="${kanji}"]`).click();
  if (scrollTo) await page.locator(scrollTo).evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 4));
  else await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(0, 0);
  await page.screenshot({ path, type: "jpeg", quality: QUALITY, ...(scrollTo ? {} : { clip: { x: 0, y: 0, width, height } }) });
  await context.close();
}

await shot({ width: 1280, height: 780, colorScheme: "light", lang: "en", parts: "日月", kanji: "明", path: join(docs, "desktop.jpg") });
await shot({ width: 390, height: 844, colorScheme: "dark", lang: "ja", parts: "氵", kanji: "海", path: join(docs, "phone.jpg"), scrollTo: "#find-title" });
await browser.close();
