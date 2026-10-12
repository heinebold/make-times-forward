import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/make-times-forward/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("displays the app with an empty state", async ({ page }) => {
  await expect(page).toHaveTitle(/Make Times Forward/);

  await expect(page.locator(".empty-info h2")).toHaveText(
    "The current schedule is empty"
  );
  await expect(
    page.locator(".empty-info a", { hasText: "Edit Section" })
  ).toBeVisible();
});
