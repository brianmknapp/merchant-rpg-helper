import { describe, expect, test } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import ItemsPage from "@/app/items/page";
import { buildItemCatalog } from "@/lib/item-data";

describe("ItemsPage", () => {
  test("hydrates the item viewer from query params so shared URLs open the same build", async () => {
    const ironDagger = buildItemCatalog().find((item) => item.name === "Iron Dagger");

    expect(ironDagger).toBeDefined();

    const expectedUrl = `/items?item=${ironDagger?.id}&grade=1&prefix=1&suffix=1&prestige=2`;
    window.history.pushState({}, "", expectedUrl);

    render(ItemsPage());

    expect(
      screen.getByText("Merchant DB-style item inspector with grade, prefix, suffix, and prestige controls."),
    ).toBeDefined();

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2, name: "Burning Iron Dagger +1" })).toBeDefined();
    });

    expect(screen.getByText("Prestige P2")).toBeDefined();
    expect(screen.getByDisplayValue(expectedUrl)).toBeDefined();
  });
});




