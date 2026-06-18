import { describe, expect, test } from "@jest/globals";
import { findBisBuild, getBisHero, listBisHeroes, queryBisEntries } from "@/lib/bis-guide";

describe("BIS guide helpers", () => {
  test("lists hero names for selector-style consumers", () => {
    const heroes = listBisHeroes();

    expect(heroes).toEqual(expect.arrayContaining(["Warrior", "Mage", "Rogue"]));
    expect(heroes.every((hero) => hero.trim().length > 0)).toBe(true);
  });

  test("resolves a hero regardless of caller casing", () => {
    const hero = getBisHero("warrior");

    expect(hero).not.toBeNull();
    expect(hero?.hero).toBe("Warrior");
    expect(hero?.builds.length).toBeGreaterThan(0);
  });

  test("finds curated builds by id or human-readable label", () => {
    const byId = findBisBuild("Warrior", "warrior-tier-6-optimal");
    const byLabel = findBisBuild("Warrior", "Tier 6 Optimal");

    expect(byId).not.toBeNull();
    expect(byLabel).not.toBeNull();
    expect(byId?.buildId).toBe("warrior-tier-6-optimal");
    expect(byLabel?.buildId).toBe(byId?.buildId);
  });

  test("filters entries down to the requested slot and item hint", () => {
    const entries = queryBisEntries({
      hero: "Warrior",
      tier: 6,
      slot: "weapon",
      itemIncludes: "Taurus",
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      id: "warrior-tier-6-optimal-weapon",
      slot: "weapon",
      items: ["Taurus' Hammer"],
    });
  });
});


