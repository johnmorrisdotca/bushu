// English and Japanese: the picker's words and the radicals' names follow the page's language, and the choice survives the switch.
import { expect, test } from "@playwright/test";

import { at, open, picker, tile } from "./demo.mjs";

test("the words and the names change with the language, and the parts stay chosen", async ({ page }) => {
  const errors = await open(page, "?lang=en&help=off&parts=" + encodeURIComponent("汁"));
  const chip = picker(page).locator('.bp-chip[data-radical="汁"]');
  await expect(chip).toContainText("water");
  await expect(picker(page).locator(".bp-says")).toContainText("hold all of these parts");
  await expect(picker(page).locator(".bp-strokes").first()).toHaveText("1 stroke");
  await page.locator('[data-lang="ja"]').click();
  await expect(chip).toContainText("さんずい");
  await expect(picker(page).locator(".bp-says")).toContainText("この部品をすべて含む漢字");
  await expect(picker(page).locator(".bp-strokes").first()).toHaveText("1画");
  await expect(tile(page, "汁")).toHaveAttribute("aria-label", /さんずい/);
  await expect(tile(page, "汁")).toHaveAttribute("aria-pressed", "true");
  // And back again.
  await page.locator('[data-lang="en"]').click();
  await expect(chip).toContainText("water");
  await expect(tile(page, "汁")).toHaveAttribute("aria-label", /water/);
  expect(errors).toEqual([]);
});

test("the names can be hidden, and a radical no school names has none", async ({ page }) => {
  const errors = await open(page, "?lang=ja&help=off&parts=" + encodeURIComponent("汁九"));
  await expect(picker(page).locator('.bp-chip[data-radical="汁"] .bp-name')).toHaveText("さんずい");
  // 九 is a component no school lists as a radical: a chip with its shape and no name.
  await expect(picker(page).locator('.bp-chip[data-radical="九"]')).toBeVisible();
  await expect(picker(page).locator('.bp-chip[data-radical="九"] .bp-name')).toHaveCount(0);
  await page.locator(`${at("names")} button[data-value="false"]`).click();
  await expect(picker(page).locator(".bp-name")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("the language and the options are kept on the device", async ({ page }) => {
  const errors = await open(page, "?lang=en&help=off&parts=" + encodeURIComponent("日"));
  await page.locator('[data-lang="ja"]').click();
  await page.locator(`${at("limit")} button[data-value="30"]`).click();
  await page.goto("http://bushu.test/?help=off");
  await page.waitForSelector(`${at("picker")}[data-ready="true"] .bp-tile`);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator(`${at("limit")} button[data-value="30"]`)).toHaveAttribute("aria-pressed", "true");
  await expect(picker(page).locator('.bp-chip[data-radical="日"]')).toBeVisible();
  expect(errors).toEqual([]);
});
