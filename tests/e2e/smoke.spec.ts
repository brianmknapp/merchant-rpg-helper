import { expect, test } from "@playwright/test";

test("home page renders the game mode selector", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Merchant Hero Hall" })).toBeVisible();
  await expect(page.getByText("Select Game Mode", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Standard/i })).toBeVisible();
});

test("item page honors shareable query params", async ({ page }) => {
  await page.goto("/items?item=0&grade=1&prefix=1&suffix=1&prestige=2");

  await expect(page.getByRole("heading", { level: 2, name: "Burning Iron Dagger +1" })).toBeVisible();
  await expect(page.getByText("Prefix applied: Burning")).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveValue(
    "/items?item=0&grade=1&prefix=1&suffix=1&prestige=2",
  );
});



