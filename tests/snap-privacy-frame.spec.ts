import { expect, Page, test } from "@playwright/test";

const expectLoadGoogleButtonVisible = async (page: Page) => {
  await page.goto("/infos/");
  await expect(page.getByText("www.google.com")).toBeVisible();
};

test("Loading Content works", async ({ page }) => {
  await expectLoadGoogleButtonVisible(page);
  await page.getByText("www.google.com").click();
  await expect(page.waitForRequest("https://www.google.com/**")).resolves.toBeTruthy();
});

test("Don't load too early", async ({ page }) => {
  await expectLoadGoogleButtonVisible(page);

  await expect(page.waitForRequest("https://www.google.com/**", { timeout: 1000 })).rejects.toThrow();
});

test("Removing single access", async ({ page }) => {
  await expectLoadGoogleButtonVisible(page);
  await page.getByText("www.google.com").click();
  await expect(
    page.waitForRequest("https://www.google.com/**")
  ).resolves.toBeTruthy();
  await page.goto("/impressum/");
  await page.getByRole("button", { name: "delete" }).click();
  await expectLoadGoogleButtonVisible(page);
});

test("Removing all access", async ({ page }) => {
  await expectLoadGoogleButtonVisible(page);
  await page.getByText("www.google.com").click();
  await expect(
    page.waitForRequest("https://www.google.com/**")
  ).resolves.toBeTruthy();
  await page.goto("/impressum/");
  await page
    .getByRole("button", { name: "Alle externen Inhalte deaktivieren" })
    .click();
  await expectLoadGoogleButtonVisible(page);
});
