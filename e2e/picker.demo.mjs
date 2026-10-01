// The picker, played: parts chosen by tap, the kanji that hold them, the parts that can still narrow, and the card of a kanji.
import { expect, test } from "@playwright/test";

import { at, open, picker, tile } from "./demo.mjs";

const results = (page) => page.locator(`${at("picker")} .bp-kanji`);
const says = (page) => picker(page).locator(".bp-says");

test("the grid is the 253 radicals grouped by stroke count, fewest first, on tiles a finger can press", async ({ page }) => {
  const errors = await open(page, "?lang=en&help=off");
  await expect(picker(page).locator(".bp-tile")).toHaveCount(253);
  const headings = await picker(page).locator(".bp-strokes").allTextContents();
  expect(headings[0]).toBe("1 stroke");
  expect(headings[1]).toBe("2 strokes");
  const counts = headings.map((text) => Number.parseInt(text, 10));
  expect(counts).toEqual([...counts].sort((a, b) => a - b));
  // Every tile is at least 44 pixels square, and a stand-in is drawn as the shape (汁 as 氵), under its key.
  await tile(page, "日").scrollIntoViewIfNeeded();
  const box = await tile(page, "日").boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  await expect(tile(page, "汁")).toHaveText("氵");
  // 乞 is filed under three strokes, not RADKFILE's two.
  const group = await tile(page, "乞").evaluate((button) => button.closest(".bp-group").querySelector(".bp-strokes").textContent);
  expect(group).toBe("3 strokes");
  expect(errors).toEqual([]);
});

test("choosing parts narrows the kanji and dims the parts that can no longer help, and taking one away widens them again", async ({ page }) => {
  const errors = await open(page, "?lang=en&help=off&parts=");
  await expect(says(page)).toHaveText("Choose the parts you can see in the kanji.");
  await expect(results(page)).toHaveCount(0);
  await tile(page, "日").click();
  const one = await results(page).count();
  expect(one).toBeGreaterThan(50);
  await expect(tile(page, "日")).toHaveAttribute("aria-pressed", "true");
  await tile(page, "月").click();
  const two = await results(page).count();
  expect(two).toBeLessThan(one);
  await expect(page.locator(`${at("picker")} .bp-kanji[data-kanji="明"]`)).toBeVisible();
  await expect(says(page)).toHaveText(`${two} kanji hold all of these parts.`);
  // A part that is in none of the kanji left is dimmed and cannot be pressed; the chosen ones stay pressable.
  await expect(tile(page, "水")).toBeDisabled();
  await expect(tile(page, "日")).toBeEnabled();
  expect(await picker(page).locator(".bp-tile:disabled").count()).toBeGreaterThan(100);
  // Take 月 away by its chip: the list grows back.
  await picker(page).locator('.bp-chip[data-radical="月"]').click();
  await expect(results(page)).toHaveCount(one);
  await expect(tile(page, "水")).toBeEnabled();
  // Clear takes everything away.
  await picker(page).locator(".bp-clear").click();
  await expect(results(page)).toHaveCount(0);
  await expect(picker(page).locator(".bp-chip")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("a kanji tapped shows its parts, and a part there is chosen with a tap", async ({ page }) => {
  const errors = await open(page, "?lang=en&help=off&parts=" + encodeURIComponent("日月"));
  await page.locator(`${at("picker")} .bp-kanji[data-kanji="明"]`).click();
  const card = picker(page).locator(".bp-detail");
  await expect(card.locator(".bp-big")).toHaveText("明");
  await expect(card).toContainText("8 strokes");
  await expect(card.locator(".bp-part")).toHaveCount(2);
  await expect(card.locator('.bp-part[data-radical="日"]')).toHaveAttribute("aria-pressed", "true");
  // Typing a kanji in the demo's own box opens its card too: 海 is written with 氵 (RADKFILE's 汁), 母 and more.
  await page.locator(at("kanji-input")).fill("海");
  await expect(card.locator(".bp-big")).toHaveText("海");
  await expect(card.locator('.bp-part[data-radical="汁"] .bp-shape')).toHaveText("氵");
  // With 日 and 月 chosen no kanji holds 母 as well, so it is dimmed; with the choice cleared it can be chosen from the card.
  await expect(card.locator('.bp-part[data-radical="母"]')).toBeDisabled();
  await picker(page).locator(".bp-clear").click();
  await card.locator('.bp-part[data-radical="母"]').click();
  await expect(picker(page).locator('.bp-chip[data-radical="母"]')).toBeVisible();
  await expect(card.locator('.bp-part[data-radical="母"]')).toHaveAttribute("aria-pressed", "true");
  // A character the index does not hold says so.
  await page.locator(at("kanji-input")).fill("々");
  await expect(card).toContainText("not in the index");
  expect(errors).toEqual([]);
});

test("the page does not scroll sideways, and the boxes keep their height whatever is chosen", async ({ page }) => {
  const errors = await open(page, "?lang=en&help=off&parts=");
  const heights = async () => picker(page).evaluate((host) => [".bp-chosen", ".bp-results", ".bp-detail", ".bp-grid"].map((selector) => Math.round(host.querySelector(selector).getBoundingClientRect().height)));
  const before = await heights();
  await tile(page, "日").click();
  await tile(page, "月").click();
  await page.locator(`${at("picker")} .bp-kanji[data-kanji="明"]`).click();
  const after = await heights();
  // The row of chosen parts may only be taller where its chips wrap; the three boxes below it never move.
  expect(after.slice(1)).toEqual(before.slice(1));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("a long list says so, and is cut at the limit chosen", async ({ page }) => {
  const errors = await open(page, "?lang=en&help=off&limit=30&parts=" + encodeURIComponent("口"));
  await expect(results(page)).toHaveCount(30);
  await expect(says(page)).toContainText("Showing the first 30");
  await page.locator(`${at("limit")} button[data-value="500"]`).click();
  expect(await results(page).count()).toBeGreaterThan(100);
  expect(errors).toEqual([]);
});

test("matches are fewest strokes first, or in the dictionary's order when asked", async ({ page }) => {
  const errors = await open(page, "?lang=en&help=off&order=strokes&parts=" + encodeURIComponent("日月"));
  const strokesOf = (kanji) => page.evaluate(async (one) => (await import("/dist/strokes.js")).strokesOf(one), kanji);
  const list = await results(page).evaluateAll((buttons) => buttons.map((button) => button.dataset.kanji));
  const counts = [];
  for (const kanji of list.slice(0, 30)) counts.push(await strokesOf(kanji));
  expect(counts).toEqual([...counts].sort((a, b) => a - b));
  await page.locator(`${at("order")} button[data-value="dictionary"]`).click();
  const dictionary = await results(page).evaluateAll((buttons) => buttons.map((button) => button.dataset.kanji));
  expect(dictionary).not.toEqual(list);
  expect([...dictionary].sort()).toEqual([...list].sort());
  expect(errors).toEqual([]);
});
