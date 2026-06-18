import { describe, expect, test } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HeroRosterSimulator from "@/app/components/hero-roster-simulator";
import type { GearItem, Hero } from "@/app/components/phase1-simulator";

const heroes: Hero[] = [
  {
    id: 1,
    name: "Warrior",
    level: 1,
    stats: {
      hp: 100,
      atk: 10,
      matk: 5,
      def: 8,
      mdef: 6,
      acc: 4,
      crit: 1,
    },
    scaling: {
      strToAtk: 1,
      intToMatk: 1,
      dexToAcc: 1,
    },
    progression: {
      hpPerLevel: [10, 20, 30],
      atkPerLevel: [0, 0, 0],
      matkPerLevel: [0, 0, 0],
      defPerLevel: [0, 0, 0],
      mdefPerLevel: [0, 0, 0],
      accPerLevel: [0, 0, 0],
      critPerLevel: [0, 0, 0],
      strToAtkByPrestige: [1, 2, 3],
      intToMatkByPrestige: [1, 1, 1],
      dexToAccByPrestige: [1, 1, 1],
    },
    iconPath: "/merchant-db/Icn_Hero_Warrior.png",
  },
];

const gearItems: GearItem[] = [];

describe("HeroRosterSimulator", () => {
  test("applies hero level and hero prestige to the selected hero progression", () => {
    window.localStorage.clear();

    render(
      <HeroRosterSimulator
        heroes={heroes}
        gearItems={gearItems}
        bisEntries={[]}
        prefixOptions={[]}
        suffixOptions={[]}
        gameMode="standard"
      />,
    );

    expect(screen.getByText("Hero progression: Lv 1 • P0")).toBeTruthy();
    expect(screen.getByText("HP 100")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Level"), { target: { value: "3" } });

    expect(screen.getByText("Hero progression: Lv 3 • P0")).toBeTruthy();
    expect(screen.getByText("HP 120")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Hero Prestige"));
    fireEvent.click(screen.getByText("P2"));

    expect(screen.getByText("Hero progression: Lv 3 • P2")).toBeTruthy();
    expect(screen.getByText("HP 160")).toBeTruthy();
  });

  test("loads saved exact gear bonuses and uses them in hero stats", async () => {
    window.localStorage.clear();

    const trainingSword: GearItem = {
      id: 101,
      name: "Training Sword",
      slot: "weapon",
      tier: 1,
      level: 1,
      rarity: 1,
      imagePath: null,
      bonus: {
        hp: 0,
        atk: 0,
        matk: 0,
        def: 0,
        mdef: 0,
        acc: 0,
        crit: 0,
        str: 0,
        int: 0,
        dex: 0,
        lck: 0,
        speed: 0,
        exp: 0,
        ap: 0,
        critDmg: 0,
        hpPct: 0,
        atkPct: 0,
        matkPct: 0,
        defPct: 0,
        mdefPct: 0,
        accPct: 0,
        gold: 0,
      },
    };

    window.localStorage.setItem(
      "merchant-rpg-helper.hero-roster.v1.standard",
      JSON.stringify({
        version: 1,
        gameMode: "standard",
        selectedHeroId: 1,
        heroes: {
          1: {
            level: 1,
            prestige: 0,
            attributes: { str: 0, int: 0, dex: 0 },
            equipped: {
              weapon: { itemId: 101, quality: "C", prefixId: null, suffixId: null, prestige: 0, exactBonus: { hp: 55 } },
              head: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
              body: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
              hands: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
              feet: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
              trinket: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
            },
          },
        },
      }),
    );

    render(
      <HeroRosterSimulator
        heroes={heroes}
        gearItems={[trainingSword]}
        bisEntries={[]}
        prefixOptions={[]}
        suffixOptions={[]}
        gameMode="standard"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Uses exact stat overrides")).toBeTruthy();
      expect(screen.getByText("HP 155")).toBeTruthy();
    });
  });
});






