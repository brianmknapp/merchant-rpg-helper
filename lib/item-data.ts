import rawEquipmentList from "@/lib/EquipmentList.json";
import rawMaterialList from "@/vendor/MerchantGameDB-master/json/MaterialList.json";
import rawFormulaList from "@/vendor/MerchantGameDB-master/json/FormulaList.json";
import rawGradeList from "@/vendor/MerchantGameDB-master/json/GradeList.json";
import rawPrefixList from "@/vendor/MerchantGameDB-master/json/PrefixList.json";
import rawSuffixList from "@/vendor/MerchantGameDB-master/json/SuffixList.json";
import { resolveMerchantAssetPath } from "@/lib/merchant-assets";

export type GearSlot = "weapon" | "head" | "body" | "hands" | "feet" | "trinket";
export type StatRange = { min: number; max: number };

export type ItemRecipeMaterial = {
  name: string;
  amount: number;
  imagePath: string | null;
};

export type ItemRecipe = {
  gold: number;
  materials: ItemRecipeMaterial[];
  craftTime: number;
  experience: number;
};

export type ItemDisplay = {
  id: number;
  name: string;
  slot: GearSlot;
  subType: string;
  tier: number;
  level: number;
  rarity: number;
  imagePath: string | null;
  baseValue: number;
  baseStats: Record<"hp" | "atk" | "matk" | "def" | "mdef" | "acc" | "crit", StatRange>;
  extraStats: Partial<Record<ExtraStatKey, StatRange>>;
  recipe: ItemRecipe;
};

export type GradeOption = {
  id: string;
  name: string;
  min: number;
  max: number;
};

export type AffixOption = {
  id: string;
  name: string;
  stats: Record<string, number>;
  sell: number;
  minLevel: number | null;
  maxLevel: number | null;
  ascLevel: number | null;
};

export type ExtraStatKey =
  | "str"
  | "int"
  | "dex"
  | "lck"
  | "speed"
  | "exp"
  | "ap"
  | "critDmg"
  | "hpPct"
  | "atkPct"
  | "matkPct"
  | "defPct"
  | "mdefPct"
  | "accPct"
  | "gold"
  | "atkBns"
  | "matkBns"
  | "defBns"
  | "mdefBns"
  | "accBns"
  | "hpBns"
  | "critBns"
  | "lckMod"
  | "expMod"
  | "apMod"
  | "critMod"
  | "gldMod";

type RawBonusValue = number | [number, number];
type RawBonusStat = Partial<Record<string, RawBonusValue>>;

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

type RawGrade = {
  name: string;
  min: number;
  max: number;
};

type RawAffix = {
  name: string;
  stats?: Record<string, number>;
  weight?: number;
  minLevel?: number;
  maxLevel?: number;
  sell?: number;
  ascLevel?: number;
};

type RawMaterial = {
  name?: string;
  image?: string;
};

type RawEquipment = {
  name?: string;
  itemSlot?: number;
  dbTier?: number;
  itemLevel?: number;
  rarity?: number;
  image?: string;
  subType?: string;
  value?: number;
  cost?: number;
  runTime?: number;
  experience?: number;
  materialID?: Array<number | string>;
  materialAmount?: number[];
  bonusStat?: RawBonusStat | [];
};

const formulaBySubtype = rawFormulaList as Record<string, RawFormulaEntry>;
const gradeList = rawGradeList as Record<string, RawGrade>;
const prefixList = rawPrefixList as Record<string, RawAffix>;
const suffixList = rawSuffixList as Record<string, RawAffix>;
const materialList = rawMaterialList as RawMaterial[];

const slotNameById: Record<number, GearSlot> = {
  1: "weapon",
  2: "head",
  3: "body",
  4: "hands",
  5: "feet",
  6: "trinket",
};

function toRange(value?: RawBonusValue): StatRange {
  if (typeof value === "number") {
    return { min: value, max: value };
  }

  if (Array.isArray(value) && value.length > 0) {
    return {
      min: Number(value[0]) || 0,
      max: Number(value[value.length - 1]) || 0,
    };
  }

  return { min: 0, max: 0 };
}

function readStaticStat(base: number | undefined, perLevel: number | undefined, level: number) {
  if (typeof base !== "number" && typeof perLevel !== "number") {
    return 0;
  }

  return Math.round((base ?? 0) + (perLevel ?? 0) * level);
}

function getStaticBonus(item: RawEquipment) {
  const formula = item.subType ? formulaBySubtype[item.subType] : undefined;
  const level = item.itemLevel ?? 0;

  return {
    hp: readStaticStat(formula?.hpBase, formula?.hpLvl, level),
    atk: readStaticStat(formula?.atkBase, formula?.atkLvl, level),
    matk: readStaticStat(formula?.matkBase, formula?.matkLvl, level),
    def: readStaticStat(formula?.defBase, formula?.defLvl, level),
    mdef: readStaticStat(formula?.mdefBase, formula?.mdefLvl, level),
    acc: readStaticStat(formula?.accBase, formula?.accLvl, level),
    crit: Math.round(formula?.crit ?? 0),
  };
}

function getExtraStats(bonusStat: RawBonusStat | [] | undefined) {
  const raw = Array.isArray(bonusStat) ? {} : bonusStat ?? {};
  return {
    str: toRange(raw.str),
    int: toRange(raw.int),
    dex: toRange(raw.dex),
    lck: toRange(raw.lckMod),
    speed: toRange(raw.speed),
    exp: toRange(raw.expMod),
    ap: toRange(raw.apMod),
    critDmg: toRange(raw.critMod),
    hpPct: toRange(raw.hpPct),
    atkPct: toRange(raw.atkPct),
    matkPct: toRange(raw.matkPct),
    defPct: toRange(raw.defPct),
    mdefPct: toRange(raw.mdefPct),
    accPct: toRange(raw.accPct),
    gold: toRange(raw.gldMod),
    atkBns: toRange(raw.atkBns),
    matkBns: toRange(raw.matkBns),
    defBns: toRange(raw.defBns),
    mdefBns: toRange(raw.mdefBns),
    accBns: toRange(raw.accBns),
    hpBns: toRange(raw.hpBns),
    critBns: toRange(raw.critBns),
    lckMod: toRange(raw.lckMod),
    expMod: toRange(raw.expMod),
    apMod: toRange(raw.apMod),
    critMod: toRange(raw.critMod),
    gldMod: toRange(raw.gldMod),
  } as Partial<Record<ExtraStatKey, StatRange>>;
}

function toPublicAssetPath(path: string | null | undefined) {
  return resolveMerchantAssetPath(path);
}

export function buildItemCatalog(): ItemDisplay[] {
  return (rawEquipmentList as RawEquipment[])
    .filter((item) => typeof item.name === "string" && item.name.length > 0)
    .map((item, index) => {
      const slot = slotNameById[item.itemSlot ?? 0];
      if (!slot) {
        return null;
      }

      const staticBonus = getStaticBonus(item);
      const extraStats = getExtraStats(item.bonusStat);
      const materials = (item.materialID ?? []).map((id, materialIndex) => {
        const materialId = Number(id);
        const material = materialList[materialId - 1];
        return {
          name: material?.name ?? `Material ${String(id)}`,
          amount: item.materialAmount?.[materialIndex] ?? 1,
          imagePath: toPublicAssetPath(material?.image ? `/merchant-db/${material.image}.png` : null),
        };
      });

      return {
        id: index,
        name: item.name as string,
        slot,
        subType: item.subType ?? "Item",
        tier: item.dbTier ?? 0,
        level: item.itemLevel ?? 0,
        rarity: item.rarity ?? 0,
        imagePath: toPublicAssetPath(item.image ? `/merchant-db/${item.image}.png` : null),
        baseValue: item.value ?? 0,
        baseStats: {
          hp: { min: staticBonus.hp, max: staticBonus.hp },
          atk: { min: staticBonus.atk, max: staticBonus.atk },
          matk: { min: staticBonus.matk, max: staticBonus.matk },
          def: { min: staticBonus.def, max: staticBonus.def },
          mdef: { min: staticBonus.mdef, max: staticBonus.mdef },
          acc: { min: staticBonus.acc, max: staticBonus.acc },
          crit: { min: staticBonus.crit, max: staticBonus.crit },
        },
        extraStats,
        recipe: {
          gold: item.cost ?? 0,
          materials,
          craftTime: item.runTime ?? 0,
          experience: item.experience ?? 0,
        },
      };
    })
    .filter((item): item is ItemDisplay => item !== null);
}

export function buildGradeOptions(): GradeOption[] {
  return Object.entries(gradeList)
    .map(([id, grade]) => ({
      id,
      name: grade.name,
      min: grade.min,
      max: grade.max,
    }))
    .sort((a, b) => Number(a.id) - Number(b.id));
}

export function buildAffixOptions(kind: "prefix" | "suffix"): AffixOption[] {
  const list = kind === "prefix" ? prefixList : suffixList;
  return Object.entries(list)
    .filter(([, affix]) => affix.name && affix.name.trim())
    .map(([id, affix]) => ({
      id,
      name: affix.name,
      stats: affix.stats ?? {},
      sell: affix.sell ?? 0,
      minLevel: affix.minLevel ?? null,
      maxLevel: affix.maxLevel ?? null,
      ascLevel: affix.ascLevel ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
