import { expect, test } from "@playwright/test";

test("SPA Navigation works", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("article h1")).toHaveText("Hallo!");
  await expect(page.locator("a[active]")).toHaveAttribute("href", "/");
  await page.locator("a").filter({ hasText: "Ausschreibung" })
    .click();
  await expect(page.locator("article h1")).toHaveText("Ausschreibung");
  await expect(page.locator("a[active]")).toHaveAttribute(
    "href",
    "/ausschreibung/"
  );
});
