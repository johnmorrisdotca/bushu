// What every demo test starts from: the built demo in `site/`, served to the page without a port, the package as built in
// `dist/`, and the helpers a test looks with.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };

/** Serve `site/` to a page at http://bushu.test/. */
export async function serve(page) {
  if (!existsSync(join(site, "index.html"))) throw new Error("site/ is not built: run `pnpm site` first (`pnpm test:demo` does)");
  await page.route("http://bushu.test/**", (route) => {
    const { pathname } = new URL(route.request().url());
    const file = join(site, pathname.endsWith("/") ? `${pathname}index.html` : pathname);
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ body: readFileSync(file), contentType: TYPES[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream" });
  });
}

/** Collect anything the page complains of. */
export function listen(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  return errors;
}

export const at = (id) => `[data-testid="${id}"]`;
export const picker = (page) => page.locator(at("picker"));
export const tile = (page, key) => page.locator(`${at("picker")} .bp-tile[data-radical="${key}"]`);

/** Open the demo with a query and wait until its picker is drawn; returns what the page complains of. */
export async function open(page, query = "") {
  const errors = listen(page);
  await serve(page);
  await page.goto(`http://bushu.test/${query}`);
  await page.waitForSelector(`${at("picker")}[data-ready="true"] .bp-tile`);
  return errors;
}

/** A page holding only what is given, with the element defined from the built package. */
export async function bare(page, html, { lang = "en" } = {}) {
  const errors = listen(page);
  await serve(page);
  await page.route("http://bushu.test/bare.html", (route) =>
    route.fulfill({ contentType: "text/html", body: `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${html}<script type="module" src="/dist/element-define.js"></script></body></html>` }),
  );
  await page.goto("http://bushu.test/bare.html");
  return errors;
}
