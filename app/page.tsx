import type { GearItem, Hero, Quest } from "@/app/components/phase1-simulator";
import HeroRosterSimulator from "@/app/components/hero-roster-simulator";
import type { BisEntrySuggestion } from "@/app/components/hero-roster-simulator";
import { queryBisEntries } from "@/lib/bis-guide";
import rawEquipmentList from "@/lib/EquipmentList.json";
import rawHeroList from "@/lib/HeroList.json";
import rawQuestList from "@/lib/QuestList.json";
import { resolveMerchantAssetPath } from "@/lib/merchant-assets";
import rawFormulaList from "@/vendor/MerchantGameDB-master/json/FormulaList.json";
import rawPrefixList from "@/vendor/MerchantGameDB-master/json/PrefixList.json";
import rawSuffixList from "@/vendor/MerchantGameDB-master/json/SuffixList.json";

type RawAffix = {
  name: string;
  stats?: Record<string, number>;
  weight?: number;
  minLevel?: number;
  maxLevel?: number;
  sell?: number;
  ascLevel?: number;
};

type RawHero = {
  class: number;
  name: string;
  level?: number;
  hp: number;
  atk: number;
  matk: number;
  def: number;
  mdef: number;
  acc: number;
  crit: number;
  hpPlv?: number[];
  atkPlv?: number[];
  matkPlv?: number[];
  defPlv?: number[];
  mdefPlv?: number[];
  accPlv?: number[];
  critPlv?: number[];
  strMod: number[];
  intMod: number[];
  dexMod: number[];
};

type RawBonusValue = number | [number, number];

type RawBonusStat = Partial<Record<string, RawBonusValue>>;

type RawEquipment = {
  name?: string;
  itemSlot?: number;
  dbTier?: number;
  itemLevel?: number;
  rarity?: number;
  image?: string;
  subType?: string;
  bonusStat?: RawBonusStat | [];
};

type RawFormulaEntry = Partial<{
  hpBase: number;
  hpLvl: number;
  atkBase: number;
  atkLvl: number;
  matkBase: number;
  matkLvl: number;
  defBase: number;
  defLvl: number;
  mdefBase: number;
  mdefLvl: number;
  accBase: number;
  accLvl: number;
  crit: number;
}>;

const formulaBySubtype = rawFormulaList as Record<string, RawFormulaEntry>;

type RawQuest = {
  levelReq?: number;
  name?: string;
  title?: string;
  region?: number;
  enemyHp?: number;
  enemyAtk?: number;
  enemyMatk?: number;
  enemyDef?: number;
  enemyMdef?: number;
  enemyEva?: number;
  image?: string;
  enemyImage?: string;
};

const heroes: Hero[] = (rawHeroList as RawHero[]).map((hero) => ({
  id: hero.class,
  name: hero.name,
  level: hero.level ?? 1,
  stats: {
    hp: hero.hp,
    atk: hero.atk,
    matk: hero.matk,
    def: hero.def,
    mdef: hero.mdef,
    acc: hero.acc,
    crit: hero.crit,
  },
  scaling: {
    strToAtk: hero.strMod?.[0] ?? 0,
    intToMatk: hero.intMod?.[0] ?? 0,
    dexToAcc: hero.dexMod?.[0] ?? 0,
  },
  progression: {
    hpPerLevel: hero.hpPlv ?? [0],
    atkPerLevel: hero.atkPlv ?? [0],
    matkPerLevel: hero.matkPlv ?? [0],
    defPerLevel: hero.defPlv ?? [0],
    mdefPerLevel: hero.mdefPlv ?? [0],
    accPerLevel: hero.accPlv ?? [0],
    critPerLevel: hero.critPlv ?? [0],
    strToAtkByPrestige: hero.strMod ?? [0],
    intToMatkByPrestige: hero.intMod ?? [0],
    dexToAccByPrestige: hero.dexMod ?? [0],
  },
  iconPath: `/merchant-db/Icn_Hero_${hero.name.replace(/\s+/g, "_")}.png`,
}));

function readBonusValue(value?: RawBonusValue) {
  if (typeof value === "number") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return Number(value[value.length - 1]) || 0;
  }

  return 0;
}

function readPercentBonusValue(value?: RawBonusValue) {
  return readBonusValue(value) * 100;
}

function readStaticStat(base: number | undefined, perLevel: number | undefined, level: number) {
  if (typeof base !== "number" && typeof perLevel !== "number") {
    return 0;
  }

  return Math.round((base ?? 0) + (perLevel ?? 0) * level);
}

function toPublicAssetPath(path: string | null | undefined) {
  return resolveMerchantAssetPath(path);
}

function getStaticBonus(item: RawEquipment) {
  const formula = item.subType ? formulaBySubtype[item.subType] : undefined;
  const level = item.itemLevel ?? 0;

  if (!formula) {
    return {
      hp: 0,
      atk: 0,
      matk: 0,
      def: 0,
      mdef: 0,
      acc: 0,
      crit: 0,
    };
  }

  return {
    hp: readStaticStat(formula.hpBase, formula.hpLvl, level),
    atk: readStaticStat(formula.atkBase, formula.atkLvl, level),
    matk: readStaticStat(formula.matkBase, formula.matkLvl, level),
    def: readStaticStat(formula.defBase, formula.defLvl, level),
    mdef: readStaticStat(formula.mdefBase, formula.mdefLvl, level),
    acc: readStaticStat(formula.accBase, formula.accLvl, level),
    crit: Math.round(formula.crit ?? 0),
  };
}

const slotNameById: Record<number, GearItem["slot"]> = {
  1: "weapon",
  2: "head",
  3: "body",
  4: "hands",
  5: "feet",
  6: "trinket",
};

const gearItems: GearItem[] = (rawEquipmentList as RawEquipment[])
  .filter((item) => typeof item.name === "string" && item.name.length > 0)
  .map((item, index) => {
    const slot = slotNameById[item.itemSlot ?? 0];
    if (!slot) {
      return null;
    }

    const bonusStat = Array.isArray(item.bonusStat) ? {} : item.bonusStat ?? {};
    const staticBonus = getStaticBonus(item);

    return {
      id: index,
      name: item.name as string,
      slot,
      tier: item.dbTier ?? 0,
      level: item.itemLevel ?? 0,
      rarity: item.rarity ?? 0,
      imagePath: toPublicAssetPath(item.image ? `/merchant-db/${item.image}.png` : null),
      bonus: {
        hp: staticBonus.hp + readBonusValue(bonusStat.hpBns),
        atk: staticBonus.atk + readBonusValue(bonusStat.atkBns),
        matk: staticBonus.matk + readBonusValue(bonusStat.matkBns),
        def: staticBonus.def + readBonusValue(bonusStat.defBns),
        mdef: staticBonus.mdef + readBonusValue(bonusStat.mdefBns),
        acc: staticBonus.acc + readBonusValue(bonusStat.accBns),
        crit: staticBonus.crit + readBonusValue(bonusStat.critBns),
        str: readBonusValue(bonusStat.str),
        int: readBonusValue(bonusStat.int),
        dex: readBonusValue(bonusStat.dex),
        lck: readBonusValue(bonusStat.lckMod),
        speed: readBonusValue(bonusStat.speed),
        exp: readBonusValue(bonusStat.expMod),
        ap: readBonusValue(bonusStat.apMod),
        critDmg: readPercentBonusValue(bonusStat.critMod),
        hpPct: readPercentBonusValue(bonusStat.hpPct),
        atkPct: readPercentBonusValue(bonusStat.atkPct),
        matkPct: readPercentBonusValue(bonusStat.matkPct),
        defPct: readPercentBonusValue(bonusStat.defPct),
        mdefPct: readPercentBonusValue(bonusStat.mdefPct),
        accPct: readPercentBonusValue(bonusStat.accPct),
        gold: readBonusValue(bonusStat.gldMod),
      },
    };
  })
  .filter((item): item is GearItem => item !== null);

const quests: Quest[] = (rawQuestList as RawQuest[])
  .filter(
    (quest) =>
      typeof quest.name === "string" &&
      quest.name.length > 0 &&
      typeof quest.enemyHp === "number" &&
      typeof quest.enemyAtk === "number" &&
      typeof quest.enemyMatk === "number" &&
      typeof quest.enemyDef === "number" &&
      typeof quest.enemyMdef === "number" &&
      typeof quest.enemyEva === "number" &&
      typeof quest.levelReq === "number",
  )
  .map((quest, index) => ({
    id: index,
    name: quest.name as string,
    title: quest.title || "Quest",
    region: quest.region ?? 0,
    levelReq: quest.levelReq as number,
    enemy: {
      hp: quest.enemyHp as number,
      atk: quest.enemyAtk as number,
      matk: quest.enemyMatk as number,
      def: quest.enemyDef as number,
      mdef: quest.enemyMdef as number,
      eva: quest.enemyEva as number,
    },
    iconPath: toPublicAssetPath(quest.image ? `/merchant-db/Quests/${quest.image}.png` : null),
    enemyImagePath: toPublicAssetPath(
      quest.enemyImage
        ? `/merchant-db/Enemies/${quest.enemyImage}.png`
        : null,
    ),
  }));

const bisEntries = queryBisEntries() as BisEntrySuggestion[];

const prefixList: Record<string, RawAffix> = rawPrefixList as Record<string, RawAffix>;
const suffixList: Record<string, RawAffix> = rawSuffixList as Record<string, RawAffix>;

export const prefixOptions = Object.entries(prefixList)
  .filter(([, affix]) => affix.name && affix.name.trim())
  .map(([id, affix]) => ({
    id,
    name: affix.name,
    stats: affix.stats ?? {},
    ascLevel: affix.ascLevel ?? null,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const suffixOptions = Object.entries(suffixList)
  .filter(([, affix]) => affix.name && affix.name.trim())
  .map(([id, affix]) => ({
    id,
    name: affix.name,
    stats: affix.stats ?? {},
    ascLevel: affix.ascLevel ?? null,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function Home() {
  return (
    <HeroRosterSimulator
      heroes={heroes}
      quests={quests}
      gearItems={gearItems}
      bisEntries={bisEntries}
      prefixOptions={prefixOptions}
      suffixOptions={suffixOptions}
    />
  );
}
