import { expect, test } from "@playwright/test";

test("MPA Navigation works", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("article h1")).toHaveText("Hallo!");
  await expect(page.locator("a[active]")).toHaveAttribute("href", "/");

  await page.goto("/impressum/");
  await expect(page.locator("article h1")).toHaveText("Impressum");
  await expect(page.locator("a[active]")).toHaveAttribute(
    "href",
    "/impressum/"
  );
});
