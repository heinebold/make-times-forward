import { expect, test, type Page } from "@playwright/test";

const checkbox = (page: Page, label: string) =>
  page.locator("label", { hasText: label }).locator("input");

test.beforeEach(async ({ page }) => {
  await page.goto("/make-times-forward/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/make-times-forward/#/settings");
});

test("persisting toggled settings across a reload", async ({ page }) => {
  await checkbox(page, "Use 12h Time").check();
  await checkbox(page, "Play Sounds").check();

  await page.reload();

  await expect(checkbox(page, "Use 12h Time")).toBeChecked();
  await expect(checkbox(page, "Play Sounds")).toBeChecked();

  await checkbox(page, "Use 12h Time").uncheck();
  await page.reload();
  await expect(checkbox(page, "Use 12h Time")).not.toBeChecked();
});
