// The tag: `<bushu-picker>` on a page of nothing else, with its attributes and its events.
import { expect, test } from "@playwright/test";

import { bare } from "./demo.mjs";

test("the tag loads its data, draws the grid, and honours its attributes", async ({ page }) => {
  const errors = await bare(page, `<bushu-picker id="p" lang="ja" parts="氵 日" limit="10"></bushu-picker>`);
  const picker = page.locator("#p");
  await expect(picker.locator(".bp-tile")).toHaveCount(253);
  await expect(picker.locator(".bp-chip")).toHaveCount(2);
  await expect(picker.locator(".bp-kanji")).toHaveCount(10);
  await expect(picker.locator(".bp-says")).toContainText("最初の10字");
  await expect(picker.locator(".bp-strokes").first()).toHaveText("1画");
  expect(errors).toEqual([]);
});

test("the tag changes when its attributes do, and tells the page what is chosen", async ({ page }) => {
  const errors = await bare(page, `<bushu-picker id="p"></bushu-picker>`);
  const picker = page.locator("#p");
  await expect(picker.locator(".bp-tile")).toHaveCount(253);
  await page.evaluate(() => {
    window.heard = [];
    document.getElementById("p").addEventListener("bushu-change", (event) => window.heard.push(event.detail));
    document.getElementById("p").addEventListener("bushu-pick", (event) => window.heard.push({ pick: event.detail.kanji, parts: event.detail.parts }));
  });
  await picker.evaluate((element) => element.setAttribute("parts", "日 月"));
  await expect(picker.locator(".bp-chip")).toHaveCount(2);
  await picker.locator('.bp-kanji[data-kanji="明"]').click();
  const heard = await page.evaluate(() => window.heard);
  expect(heard.some((detail) => detail.chosen?.join("") === "日月")).toBe(true);
  expect(heard.at(-1)).toEqual({ pick: "明", parts: ["日", "月"] });
  await picker.evaluate((element) => element.setAttribute("lang", "ja"));
  await expect(picker.locator(".bp-chip").first()).toContainText("ひ");
  await picker.evaluate((element) => element.clear());
  await expect(picker.locator(".bp-chip")).toHaveCount(0);
  expect(errors).toEqual([]);
});
