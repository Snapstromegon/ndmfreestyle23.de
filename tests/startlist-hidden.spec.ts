import { expect, test } from "@playwright/test";

test("Startlist is hidden", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("snap-startlist")).toBeHidden();
});
