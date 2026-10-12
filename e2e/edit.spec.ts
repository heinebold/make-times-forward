import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/make-times-forward/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/make-times-forward/#/edit-schedule");
});

test("adds an item in edit mode and shows it on the home page", async ({
  page,
}) => {
  await page.locator("input[type=text]").fill("Keynote");
  await page
    .locator("input[type=datetime-local]")
    .first()
    .fill("2026-10-12T10:00");
  await page
    .locator("input[type=datetime-local]")
    .nth(1)
    .fill("2026-10-12T11:00");

  await page.locator("button", { hasText: "Add" }).click();

  await expect(
    page.locator(".schedule-item .title", { hasText: "Keynote" })
  ).toHaveCount(1);

  await page.goto("/make-times-forward/");
  await expect(
    page.locator(".schedule-item .title", { hasText: "Keynote" }).first()
  ).toBeVisible();
});
