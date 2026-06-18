import { describe, expect, test } from "@jest/globals";
import { buildAffixOptions, buildGradeOptions, buildItemCatalog } from "@/lib/item-data";

describe("item data builders", () => {
  test("maps raw weapon data into the viewer catalog with computed base stats", () => {
    const catalog = buildItemCatalog();
    const ironDagger = catalog.find((item) => item.name === "Iron Dagger");

    expect(ironDagger).toMatchObject({
      slot: "weapon",
      subType: "Dagger",
      tier: 1,
      level: 1,
      rarity: 1,
      imagePath: "/merchant-db/Items/Dagger/Iron_Dagger.png",
      baseValue: 35,
      baseStats: {
        hp: { min: 0, max: 0 },
        atk: { min: 17, max: 17 },
        matk: { min: 4, max: 4 },
        def: { min: 0, max: 0 },
        mdef: { min: 0, max: 0 },
        acc: { min: 21, max: 21 },
        crit: { min: 5, max: 5 },
      },
      recipe: {
        gold: 20,
        craftTime: 40,
        experience: 25,
      },
    });

    expect(ironDagger?.recipe.materials).toContainEqual({
      name: "Iron Ingot",
      amount: 1,
      imagePath: "/merchant-db/Items/Region_1/Iron_Ingot.png",
    });
  });

  test("keeps grade options sorted by database id for stable dropdown ordering", () => {
    const grades = buildGradeOptions();

    expect(grades[0]).toEqual({
      id: "0",
      name: "No Grade",
      min: 0.75,
      max: 1.5,
    });
    expect(grades.find((grade) => grade.id === "1")).toEqual({
      id: "1",
      name: "D",
      min: 0.75,
      max: 0.9,
    });
    expect(grades.at(-1)?.name).toBe("S");
  });

  test("exposes prefix and suffix affixes with the stats the viewer needs", () => {
    const burning = buildAffixOptions("prefix").find((option) => option.name === "Burning");
    const plusOne = buildAffixOptions("suffix").find((option) => option.name === "+1");

    expect(burning).toMatchObject({
      id: "1",
      name: "Burning",
      stats: { atkBns: 2 },
      sell: 0.1,
      minLevel: 1,
      maxLevel: 30,
      ascLevel: null,
    });
    expect(plusOne).toMatchObject({
      id: "1",
      name: "+1",
      stats: {
        atk: 0.1,
        def: 0.1,
        acc: 0.1,
        matk: 0.1,
        mdef: 0.1,
      },
      sell: 0.1,
      minLevel: 1,
      maxLevel: 30,
      ascLevel: null,
    });
  });
});



