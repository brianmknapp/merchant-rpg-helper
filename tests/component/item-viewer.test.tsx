import { describe, expect, test } from "@jest/globals";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import ItemViewer from "@/app/components/item-viewer";
import { buildAffixOptions, buildGradeOptions, buildItemCatalog } from "@/lib/item-data";

describe("ItemViewer", () => {
  test("renders a sharable, fully calculated item preview from initial selections", async () => {
    const items = buildItemCatalog();
    const grades = buildGradeOptions();
    const prefixes = buildAffixOptions("prefix");
    const suffixes = buildAffixOptions("suffix");
    const ironDagger = items.find((item) => item.name === "Iron Dagger");

    expect(ironDagger).toBeDefined();

    const expectedUrl = `/items?item=${ironDagger?.id}&grade=1&prefix=1&suffix=1&prestige=2`;

    render(
      <ItemViewer
        items={items}
        grades={grades}
        prefixes={prefixes}
        suffixes={suffixes}
        initialItemId={ironDagger?.id}
        initialGradeId="1"
        initialPrefixId="1"
        initialSuffixId="1"
        initialPrestige={2}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Burning Iron Dagger +1" })).toBeInTheDocument();
    expect(screen.getByDisplayValue(expectedUrl)).toBeInTheDocument();
    expect(screen.getByText("Prefix applied: Burning")).toBeInTheDocument();
    expect(screen.getByText("Prestige P2")).toBeInTheDocument();

    const attackRow = screen.getByText("Physical Attack").closest("p");
    expect(attackRow).not.toBeNull();
    expect(within(attackRow as HTMLElement).getByText("30")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Copy URL" }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`http://localhost${expectedUrl}`);
    });
  });
});


