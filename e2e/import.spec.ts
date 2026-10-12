import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import path from "node:path";

const importFixture = path.join(__dirname, "fixtures/import-schedule.json");

test.beforeEach(async ({ page }) => {
  await page.goto("/make-times-forward/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/make-times-forward/#/edit-schedule");
});

test("imports a schedule from a file", async ({ page }) => {
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.locator("button", { hasText: "Import" }).click();
  await (await fileChooserPromise).setFiles(importFixture);

  await expect(modalText(page)).toContainText(
    "The following schedule can be imported:",
  );
  await expect(
    page.locator(".modal-content .schedule-item .title", {
      hasText: "Keynote",
    }),
  ).toBeVisible();

  await page.locator("button", { hasText: "✅ Import" }).click();
  await expect(page.locator(".modal-content")).toBeHidden();

  await expect(
    page.locator(".schedule-item .title", { hasText: "Keynote" }).first(),
  ).toBeVisible();
});

test("shows an error modal with disabled import for unparsable files", async ({
  page,
}) => {
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.locator("button", { hasText: "Import" }).click();
  await (
    await fileChooserPromise
  ).setFiles({
    name: "garbage.json",
    mimeType: "application/json",
    buffer: Buffer.from("definitely no schedule"),
  });

  await expect(modalText(page)).toContainText(
    "The selected file does not contain valid schedule data.",
  );
  await expect(
    page.locator(".modal-content button", { hasText: "Import" }),
  ).toHaveCount(0);
});

test("import can be cancelled without changing the schedule", async ({
  page,
}) => {
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.locator("button", { hasText: "Import" }).click();
  await (await fileChooserPromise).setFiles(importFixture);

  await expect(modalText(page)).toBeVisible();
  await page.locator("button", { hasText: "❌ Cancel" }).click();
  await expect(page.locator(".modal-content")).toBeHidden();

  await expect(
    page.locator(".schedule-item .title", { hasText: "Keynote" }),
  ).toHaveCount(0);
});

function modalText(page: Page) {
  return page.locator(".modal-content .modal-text");
}
