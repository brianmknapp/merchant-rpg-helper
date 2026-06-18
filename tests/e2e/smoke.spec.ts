import { expect, test } from "@playwright/test";

test("home page renders the hero hall shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Merchant Hero Hall" })).toBeVisible();
  await expect(page.getByText("Quest Enemy", { exact: true })).toBeVisible();
  await expect(page.getByText("Saved Loadout", { exact: true })).toBeVisible();
});

test("item page honors shareable query params", async ({ page }) => {
  await page.goto("/items?item=0&grade=1&prefix=1&suffix=1&prestige=2");

  await expect(page.getByRole("heading", { level: 2, name: "Burning Iron Dagger +1" })).toBeVisible();
  await expect(page.getByText("Prefix applied: Burning")).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveValue(
    "/items?item=0&grade=1&prefix=1&suffix=1&prestige=2",
  );
});



