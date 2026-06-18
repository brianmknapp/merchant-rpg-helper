"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Save, ArrowUpDown, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { GearItem, Hero } from "@/app/components/phase1-simulator";

type GearSlot = GearItem["slot"];

type GearQuality = "D" | "C" | "B" | "A" | "S";

type PrestigeLevel = 0 | 1 | 2;

type HeroAttributes = {
  str: number;
  int: number;
  dex: number;
};

type HeroComputedStats = {
  hp: number;
  currentHp: number;
  atk: number;
  matk: number;
  def: number;
  mdef: number;
  acc: number;
  crit: number;
  str: number;
  int: number;
  dex: number;
  lck: number;
  speed: number;
  ap: number;
  exp: number;
  critDmg: number;
  gold: number;
};

type HeroStatOverrides = Partial<HeroComputedStats>;

type ExactGearBonusOverrides = Partial<GearBonus>;

type EquippedSlot = {
  itemId: number | null;
  quality: GearQuality;
  prefixId: string | null;
  suffixId: string | null;
  prestige: PrestigeLevel;
  exactBonus: ExactGearBonusOverrides | null;
};

type SlotEditDraft = {
  itemId: number | null;
  quality: GearQuality;
  prefixId: string | null;
  suffixId: string | null;
  prestige: PrestigeLevel;
  exactBonus: ExactGearBonusOverrides | null;
};

type HeroSaveState = {
  level: number;
  prestige: PrestigeLevel;
  attributes: HeroAttributes;
  equipped: Record<GearSlot, EquippedSlot>;
  statOverrides: HeroStatOverrides;
  // Legacy fields retained for migration from older local saves.
  gearPrefix?: string | null;
  gearSuffix?: string | null;
};

type RosterHeroSaveState = HeroSaveState & {
  heroId: number;
};

type GearBonus = {
  hp: number;
  atk: number;
  matk: number;
  def: number;
  mdef: number;
  acc: number;
  crit: number;
  str: number;
  int: number;
  dex: number;
  lck: number;
  speed: number;
  exp: number;
  ap: number;
  critDmg: number;
  hpPct: number;
  atkPct: number;
  matkPct: number;
  defPct: number;
  mdefPct: number;
  accPct: number;
  gold: number;
};

type EquippedSlotMap = Partial<Record<GearSlot, Partial<EquippedSlot>>>;

type SaveState = {
  version: 1;
  gameMode: string;
  selectedHeroId: string;
  heroes: Record<string, RosterHeroSaveState>;
};

export type BisEntrySuggestion = {
  id: string;
  hero: string;
  buildId: string;
  buildLabel: string;
  tier: number | null;
  slot: GearSlot | "potionPrefix";
  raw: string;
  items: string[];
};

type HeroRosterSimulatorProps = {
  heroes: Hero[];
  gearItems: GearItem[];
  bisEntries: BisEntrySuggestion[];
  prefixOptions: Array<{ id: string; name: string; stats: Record<string, number>; ascLevel: number | null }>;
  suffixOptions: Array<{ id: string; name: string; stats: Record<string, number>; ascLevel: number | null }>;
  gameMode: string;
  onBackClick?: () => void;
};

const STORAGE_KEY_PREFIX = "merchant-rpg-helper.hero-roster.v1";

function getStorageKey(gameMode: string): string {
  return `${STORAGE_KEY_PREFIX}.${gameMode}`;
}

const GEAR_SLOT_LABELS: Record<GearSlot, string> = {
  weapon: "Weapon",
  head: "Head",
  body: "Body",
  hands: "Hands",
  feet: "Feet",
  trinket: "Trinket",
};

const GEAR_SLOT_ORDER: GearSlot[] = ["weapon", "head", "body", "hands", "feet", "trinket"];

const QUALITY_LABELS: Record<GearQuality, string> = {
  D: "D (x0.9)",
  C: "C (x1.0)",
  B: "B (x1.1)",
  A: "A (x1.2)",
  S: "S (x1.5)",
};

const QUALITY_ICON_PATHS: Record<GearQuality, string> = {
  D: "/merchant-db/grades/quest_grade_D-edit.png",
  C: "/merchant-db/grades/quest_grade_C-edit.png",
  B: "/merchant-db/grades/quest_grade_B-edit.png",
  A: "/merchant-db/grades/quest_grade_A-edit.png",
  S: "/merchant-db/grades/quest_grade_S-edit.png",
};

const QUALITY_MULTIPLIER: Record<GearQuality, number> = {
  D: 0.9,
  C: 1,
  B: 1.1,
  A: 1.2,
  S: 1.5,
};

const PRESTIGE_LABELS: Record<PrestigeLevel, string> = {
  0: "Base",
  1: "P1",
  2: "P2",
};

const PRESTIGE_MULTIPLIER: Record<PrestigeLevel, number> = {
  0: 1,
  1: 1.5,
  2: 2,
};

const DEFAULT_ATTRIBUTES: HeroAttributes = {
  str: 0,
  int: 0,
  dex: 0,
};

const MIN_HERO_LEVEL = 1;
const MAX_HERO_LEVEL = 100;

const DEFAULT_EQUIPPED_SLOTS: Record<GearSlot, EquippedSlot> = {
  weapon: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
  head: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
  body: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
  hands: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
  feet: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
  trinket: { itemId: null, quality: "S", prefixId: null, suffixId: null, prestige: 0, exactBonus: null },
};

const EDITABLE_GEAR_BONUS_FIELDS: Array<[keyof GearBonus, string]> = [
  ["hp", "HP"],
  ["atk", "ATK"],
  ["matk", "MATK"],
  ["def", "DEF"],
  ["mdef", "MDEF"],
  ["acc", "ACC"],
  ["crit", "CRIT"],
  ["str", "STR"],
  ["int", "INT"],
  ["dex", "DEX"],
  ["lck", "LCK"],
  ["speed", "SPD"],
  ["ap", "AP"],
  ["exp", "XP%"],
  ["critDmg", "CDMG%"],
  ["hpPct", "HP%"],
  ["atkPct", "ATK%"],
  ["matkPct", "MATK%"],
  ["defPct", "DEF%"],
  ["mdefPct", "MDEF%"],
  ["accPct", "ACC%"],
  ["gold", "GOLD"],
];

const PREFIX_TO_GEAR_BONUS_KEY: Record<string, keyof GearBonus> = {
  hpBns: "hp",
  atkBns: "atk",
  matkBns: "matk",
  defBns: "def",
  mdefBns: "mdef",
  accBns: "acc",
  critBns: "crit",
  str: "str",
  int: "int",
  dex: "dex",
  lckMod: "lck",
  speed: "speed",
  expMod: "exp",
  apMod: "ap",
  critMod: "critDmg",
  hpPct: "hpPct",
  atkPct: "atkPct",
  matkPct: "matkPct",
  defPct: "defPct",
  mdefPct: "mdefPct",
  accPct: "accPct",
  gldMod: "gold",
};

const PERCENT_PREFIX_KEYS = new Set(["critMod", "hpPct", "atkPct", "matkPct", "defPct", "mdefPct", "accPct"]);

const SUFFIX_TO_GEAR_BONUS_KEY: Record<string, keyof GearBonus> = {
  atk: "atk",
  def: "def",
  acc: "acc",
  matk: "matk",
  mdef: "mdef",
};

const AFFIX_STAT_LABELS: Record<string, string> = {
  hpBns: "HP",
  atkBns: "ATK",
  matkBns: "MATK",
  defBns: "DEF",
  mdefBns: "MDEF",
  accBns: "ACC",
  critBns: "CRIT",
  str: "STR",
  int: "INT",
  dex: "DEX",
  lckMod: "LCK",
  speed: "SPD",
  expMod: "XP%",
  apMod: "AP",
  critMod: "CDMG%",
  hpPct: "HP%",
  atkPct: "ATK%",
  matkPct: "MATK%",
  defPct: "DEF%",
  mdefPct: "MDEF%",
  accPct: "ACC%",
  gldMod: "GOLD",
  atk: "ATK",
  def: "DEF",
  acc: "ACC",
  matk: "MATK",
  mdef: "MDEF",
};

const ITEM_EXTRA_STAT_LABELS: Array<[keyof GearBonus, string]> = [
  ["ap", "AP"],
  ["exp", "XP%"],
  ["critDmg", "CDMG%"],
  ["hpPct", "HP%"],
  ["atkPct", "ATK%"],
  ["matkPct", "MATK%"],
  ["defPct", "DEF%"],
  ["mdefPct", "MDEF%"],
  ["accPct", "ACC%"],
  ["gold", "GOLD"],
];

const HERO_STAT_FIELDS: Array<[keyof HeroComputedStats, string]> = [
  ["hp", "Max HP"],
  ["currentHp", "Current HP"],
  ["atk", "ATK"],
  ["matk", "MATK"],
  ["def", "DEF"],
  ["mdef", "MDEF"],
  ["acc", "ACC"],
  ["crit", "CRIT"],
  ["str", "STR"],
  ["int", "INT"],
  ["dex", "DEX"],
  ["lck", "LUCK"],
  ["speed", "SPEED"],
  ["ap", "AP"],
  ["exp", "XP%"],
  ["critDmg", "CDMG%"],
  ["gold", "GOLD"],
];

const EMPTY_STATS = {
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
  ap: 0,
  exp: 0,
  critDmg: 0,
  hpPct: 0,
  atkPct: 0,
  matkPct: 0,
  defPct: 0,
  mdefPct: 0,
  accPct: 0,
  gold: 0,
};

function scaleGearBonus(bonus: GearBonus, multiplier: number) {
  return {
    hp: bonus.hp * multiplier,
    atk: bonus.atk * multiplier,
    matk: bonus.matk * multiplier,
    def: bonus.def * multiplier,
    mdef: bonus.mdef * multiplier,
    acc: bonus.acc * multiplier,
    crit: bonus.crit * multiplier,
    str: bonus.str * multiplier,
    int: bonus.int * multiplier,
    dex: bonus.dex * multiplier,
    lck: bonus.lck * multiplier,
    speed: bonus.speed * multiplier,
    exp: bonus.exp * multiplier,
    ap: bonus.ap * multiplier,
    critDmg: bonus.critDmg * multiplier,
    hpPct: bonus.hpPct * multiplier,
    atkPct: bonus.atkPct * multiplier,
    matkPct: bonus.matkPct * multiplier,
    defPct: bonus.defPct * multiplier,
    mdefPct: bonus.mdefPct * multiplier,
    accPct: bonus.accPct * multiplier,
    gold: bonus.gold * multiplier,
  };
}

function applyAffixesToBonus(
  bonus: GearBonus,
  prefix: { stats: Record<string, number> } | undefined,
  suffix: { stats: Record<string, number> } | undefined,
): GearBonus {
  const next = { ...bonus };

  Object.entries(prefix?.stats ?? {}).forEach(([key, rawValue]) => {
    const bonusKey = PREFIX_TO_GEAR_BONUS_KEY[key];
    if (!bonusKey) {
      return;
    }
    const value = PERCENT_PREFIX_KEYS.has(key) ? rawValue * 100 : rawValue;
    next[bonusKey] += value;
  });

  Object.entries(suffix?.stats ?? {}).forEach(([key, value]) => {
    const bonusKey = SUFFIX_TO_GEAR_BONUS_KEY[key];
    if (!bonusKey) {
      return;
    }
    next[bonusKey] *= 1 + value;
  });

  return next;
}

function getComputedGearBonus(
  item: GearItem,
  quality: GearQuality,
  prestige: PrestigeLevel,
  prefix: { stats: Record<string, number> } | undefined,
  suffix: { stats: Record<string, number> } | undefined,
) {
  const scaled = scaleGearBonus(item.bonus, QUALITY_MULTIPLIER[quality] * PRESTIGE_MULTIPLIER[prestige]);
  return applyAffixesToBonus(scaled, prefix, suffix);
}

function createExactBonusOverrides(bonus: GearBonus): ExactGearBonusOverrides {
  const overrides: ExactGearBonusOverrides = {};

  EDITABLE_GEAR_BONUS_FIELDS.forEach(([key]) => {
    if (bonus[key] !== 0) {
      overrides[key] = bonus[key];
    }
  });

  return overrides;
}

function applyExactBonusOverrides(
  bonus: GearBonus,
  exactBonus: ExactGearBonusOverrides | null | undefined,
) {
  if (!exactBonus) {
    return bonus;
  }

  const next = { ...bonus };

  Object.entries(exactBonus).forEach(([key, value]) => {
    if (typeof value === "number") {
      next[key as keyof GearBonus] = value;
    }
  });

  return next;
}

function hasExactBonusOverrides(exactBonus: ExactGearBonusOverrides | null | undefined) {
  return Boolean(exactBonus && Object.keys(exactBonus).length > 0);
}

function isAffixUnlocked(
  affix: { ascLevel?: number | null } | undefined,
  prestige: PrestigeLevel,
) {
  if (!affix || affix.ascLevel === undefined || affix.ascLevel === null) {
    return true;
  }
  return affix.ascLevel <= prestige;
}

function getPrestigeRequirementLabel(ascLevel: number | null | undefined) {
  if (ascLevel === 1) {
    return "P1";
  }
  if (ascLevel === 2) {
    return "P2";
  }
  return null;
}

function formatAffixStatValue(key: string, value: number) {
  const label = AFFIX_STAT_LABELS[key] ?? key;

  if (key in SUFFIX_TO_GEAR_BONUS_KEY) {
    return `+${formatValue(value * 100)}% ${label}`;
  }

  if (PERCENT_PREFIX_KEYS.has(key)) {
    return `+${formatValue(value * 100)} ${label}`;
  }

  return `+${formatValue(value)} ${label}`;
}

function formatAffixEffectSummary(affix: { stats: Record<string, number> } | undefined) {
  const entries = Object.entries(affix?.stats ?? {});
  if (entries.length === 0) {
    return "No extra effect";
  }

  return entries.map(([key, value]) => formatAffixStatValue(key, value)).join(", ");
}

function formatAffixOptionLabel(affix: {
  name: string;
  stats: Record<string, number>;
  ascLevel: number | null;
}) {
  const unlockLabel = getPrestigeRequirementLabel(affix.ascLevel);
  const effectLabel = formatAffixEffectSummary(affix);

  if (unlockLabel) {
    return `${affix.name} (${unlockLabel}, ${effectLabel})`;
  }

  return `${affix.name} (${effectLabel})`;
}

function getItemExtraPreview(bonus: GearBonus) {
  return ITEM_EXTRA_STAT_LABELS
    .filter(([key]) => bonus[key] !== 0)
    .map(([key, label]) => `${label} +${formatValue(bonus[key])}`);
}

function applyPercent(base: number, percent: number) {
  return Math.round(base * (1 + percent / 100));
}

function createHeroSaveState(hero?: Hero): HeroSaveState {
  return {
    level: clampHeroLevel(hero?.level ?? MIN_HERO_LEVEL),
    prestige: 0,
    attributes: { ...DEFAULT_ATTRIBUTES },
    equipped: {
      weapon: { ...DEFAULT_EQUIPPED_SLOTS.weapon },
      head: { ...DEFAULT_EQUIPPED_SLOTS.head },
      body: { ...DEFAULT_EQUIPPED_SLOTS.body },
      hands: { ...DEFAULT_EQUIPPED_SLOTS.hands },
      feet: { ...DEFAULT_EQUIPPED_SLOTS.feet },
      trinket: { ...DEFAULT_EQUIPPED_SLOTS.trinket },
    },
    statOverrides: {},
  };
}

function createRosterHeroSaveState(hero: Hero): RosterHeroSaveState {
  return {
    ...createHeroSaveState(hero),
    heroId: hero.id,
  };
}

function createRosterHeroId(heroId: number): string {
  return `${heroId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeStatOverrides(input: unknown): HeroStatOverrides {
  if (!input || typeof input !== "object") {
    return {};
  }

  const rawOverrides = input as Record<string, unknown>;
  const normalized: HeroStatOverrides = {};

  HERO_STAT_FIELDS.forEach(([key]) => {
    const value = rawOverrides[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      normalized[key] = value;
    }
  });

  return normalized;
}

function clampHeroLevel(value: number) {
  if (!Number.isFinite(value)) {
    return MIN_HERO_LEVEL;
  }
  return Math.min(MAX_HERO_LEVEL, Math.max(MIN_HERO_LEVEL, Math.round(value)));
}

function toPrestigeLevel(value: number): PrestigeLevel {
  return value === 1 || value === 2 ? value : 0;
}

function getProgressionValue(values: number[] | undefined, prestige: PrestigeLevel, fallback: number) {
  if (!Array.isArray(values) || values.length === 0) {
    return fallback;
  }
  return values[prestige] ?? values[0] ?? fallback;
}

function getBaseApForLevel(level: number): number {
  if (level < 10) {
    return 0;
  }
  if (level >= 40) {
    return 20;
  }
  // At level 10: 5 AP
  // Every 2 levels afterward: +1 AP
  const levelsAfter10 = level - 10;
  const apGain = Math.floor(levelsAfter10 / 2);
  return 5 + apGain;
}

function getHeroScalingForPrestige(hero: Hero, prestige: PrestigeLevel) {
  return {
    strToAtk: getProgressionValue(hero.progression?.strToAtkByPrestige, prestige, hero.scaling.strToAtk),
    intToMatk: getProgressionValue(hero.progression?.intToMatkByPrestige, prestige, hero.scaling.intToMatk),
    dexToAcc: getProgressionValue(hero.progression?.dexToAccByPrestige, prestige, hero.scaling.dexToAcc),
  };
}

function getHeroBaseStat(base: number, perLevelValues: number[] | undefined, level: number, prestige: PrestigeLevel) {
  const perLevel = getProgressionValue(perLevelValues, prestige, 0);
  const levelOffset = Math.max(level - 1, 0);
  return Math.round(base + perLevel * levelOffset);
}

function getHeroStatsForProgression(hero: Hero, level: number, prestige: PrestigeLevel) {
  return {
    hp: getHeroBaseStat(hero.stats.hp, hero.progression?.hpPerLevel, level, prestige),
    atk: getHeroBaseStat(hero.stats.atk, hero.progression?.atkPerLevel, level, prestige),
    matk: getHeroBaseStat(hero.stats.matk, hero.progression?.matkPerLevel, level, prestige),
    def: getHeroBaseStat(hero.stats.def, hero.progression?.defPerLevel, level, prestige),
    mdef: getHeroBaseStat(hero.stats.mdef, hero.progression?.mdefPerLevel, level, prestige),
    acc: getHeroBaseStat(hero.stats.acc, hero.progression?.accPerLevel, level, prestige),
    crit: getHeroBaseStat(hero.stats.crit, hero.progression?.critPerLevel, level, prestige),
  };
}

function createDefaultSaveState(gameMode: string, heroes: Hero[]): SaveState {
  return {
    version: 1,
    gameMode,
    selectedHeroId: "",
    heroes: {},
  };
}

function normalizeHeroState(hero: Hero, input: Partial<HeroSaveState> | undefined): HeroSaveState {
  const equipped = (input?.equipped ?? {}) as EquippedSlotMap;
  const legacyPrefix = typeof input?.gearPrefix === "string" ? input.gearPrefix : null;
  const legacySuffix = typeof input?.gearSuffix === "string" ? input.gearSuffix : null;
  const parsedLevel = Number(input?.level);
  const level = clampHeroLevel(parsedLevel || hero.level || MIN_HERO_LEVEL);
  const prestige = toPrestigeLevel(Number(input?.prestige));

  return {
    level,
    prestige,
    attributes: {
      str: Number(input?.attributes?.str ?? DEFAULT_ATTRIBUTES.str) || 0,
      int: Number(input?.attributes?.int ?? DEFAULT_ATTRIBUTES.int) || 0,
      dex: Number(input?.attributes?.dex ?? DEFAULT_ATTRIBUTES.dex) || 0,
    },
    equipped: {
      weapon: normalizeSlotState(equipped.weapon, legacyPrefix, legacySuffix),
      head: normalizeSlotState(equipped.head, legacyPrefix, legacySuffix),
      body: normalizeSlotState(equipped.body, legacyPrefix, legacySuffix),
      hands: normalizeSlotState(equipped.hands, legacyPrefix, legacySuffix),
      feet: normalizeSlotState(equipped.feet, legacyPrefix, legacySuffix),
      trinket: normalizeSlotState(equipped.trinket, legacyPrefix, legacySuffix),
    },
    statOverrides: normalizeStatOverrides(input?.statOverrides),
  };
}

function normalizeSlotState(
  input: Partial<EquippedSlot> | undefined,
  legacyPrefix: string | null,
  legacySuffix: string | null,
): EquippedSlot {
  const quality = input?.quality;
  const prestigeInput = Number(input?.prestige);
  const prestige: PrestigeLevel = prestigeInput === 1 || prestigeInput === 2 ? prestigeInput : 0;

  return {
    itemId: typeof input?.itemId === "number" ? input.itemId : null,
    quality: quality && quality in QUALITY_MULTIPLIER ? quality : "S",
    prefixId: typeof input?.prefixId === "string" ? input.prefixId : legacyPrefix,
    suffixId: typeof input?.suffixId === "string" ? input.suffixId : legacySuffix,
    prestige,
    exactBonus: input?.exactBonus && typeof input.exactBonus === "object" ? { ...input.exactBonus } : null,
  };
}

function normalizeSaveState(gameMode: string, heroes: Hero[], input: SaveState | null | undefined): SaveState {
  const fallback = createDefaultSaveState(gameMode, heroes);
  if (!input || input.version !== 1) {
    return fallback;
  }

  // Only include heroes that were explicitly saved, not all available heroes.
  const heroMap: Record<string, RosterHeroSaveState> = {};

  Object.entries(input.heroes ?? {}).forEach(([rosterHeroId, rawHeroState]) => {
    const parsedHeroState = rawHeroState as Partial<RosterHeroSaveState>;
    const legacyHeroId = Number(rosterHeroId);
    const heroId =
      typeof parsedHeroState.heroId === "number" && Number.isFinite(parsedHeroState.heroId)
        ? parsedHeroState.heroId
        : legacyHeroId;
    const hero = heroes.find((entry) => entry.id === heroId);
    if (!hero) {
      return;
    }

    heroMap[rosterHeroId] = {
      ...normalizeHeroState(hero, parsedHeroState),
      heroId,
    };
  });

  // Find a valid selected roster hero ID from the saved state.
  let selectedHeroId = "";
  if (typeof input.selectedHeroId === "string" && heroMap[input.selectedHeroId]) {
    selectedHeroId = input.selectedHeroId;
  } else if (typeof input.selectedHeroId === "number") {
    const legacySelectedHeroId = input.selectedHeroId;
    const matchingLegacySelection = Object.entries(heroMap).find(([, heroState]) => heroState.heroId === legacySelectedHeroId);
    if (matchingLegacySelection) {
      selectedHeroId = matchingLegacySelection[0];
    }
  }
  if (!selectedHeroId) {
    selectedHeroId = Object.keys(heroMap)[0] ?? "";
  }

  return {
    version: 1,
    gameMode,
    selectedHeroId,
    heroes: heroMap,
  };
}

function loadSavedState(gameMode: string, heroes: Hero[]): SaveState {
  const fallback = createDefaultSaveState(gameMode, heroes);

  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(getStorageKey(gameMode));
  if (!raw) {
    return fallback;
  }

  try {
    return normalizeSaveState(gameMode, heroes, JSON.parse(raw) as SaveState);
  } catch {
    return fallback;
  }
}

function formatValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function getHeroIconPath(hero: Hero) {
  return hero.iconPath;
}

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function toPublicAssetPath(path: string | null) {
  return path ? encodeURI(path) : null;
}

function isLikelySameItem(itemName: string, bisName: string) {
  const left = normalizeSearchValue(itemName);
  const right = normalizeSearchValue(bisName);
  if (!left || !right) {
    return false;
  }
  return left === right || left.includes(right) || right.includes(left);
}

function getBisSideNotes(raw: string) {
  const notes: string[] = [];
  const cleanedRaw = raw.trim();
  if (!cleanedRaw) {
    return notes;
  }

  const parenthetical = Array.from(cleanedRaw.matchAll(/\(([^)]+)\)/g))
    .map((match) => match[1].trim())
    .filter(Boolean);
  notes.push(...parenthetical);

  if (cleanedRaw.includes("*")) {
    notes.push("Has guide footnote marker (*)");
  }

  return Array.from(new Set(notes));
}

function getBisSetupLabel(buildLabel: string) {
  const normalized = buildLabel.trim();
  if (!normalized) {
    return "Build";
  }

  if (normalized.toLowerCase().includes("weekly")) {
    return "Weekly";
  }

  const withoutTier = normalized.replace(/^tier\s*\d+\s*/i, "").trim();
  if (!withoutTier) {
    return normalized;
  }

  return withoutTier
    .replace(/\(alt\)/gi, "Alt")
    .replace(/\s+/g, " ")
    .trim();
}

export default function HeroRosterSimulator({
  heroes,
  gearItems,
  bisEntries,
  prefixOptions,
  suffixOptions,
  gameMode,
  onBackClick,
}: HeroRosterSimulatorProps) {
  const itemButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [saveState, setSaveState] = useState<SaveState>(() => createDefaultSaveState(gameMode, heroes));
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeSlotByHero, setActiveSlotByHero] = useState<Record<string, GearSlot>>({});
  const [tierFilterBySlot, setTierFilterBySlot] = useState<Partial<Record<GearSlot, number>>>({});
  const [sortDirectionBySlot, setSortDirectionBySlot] = useState<Partial<Record<GearSlot, "asc" | "desc">>>({});
  const [missingHeroIcons, setMissingHeroIcons] = useState<Record<string, boolean>>({});
  const [missingItemImages, setMissingItemImages] = useState<Record<string, boolean>>({});
  const [slotDraftBySlot, setSlotDraftBySlot] = useState<Partial<Record<GearSlot, SlotEditDraft>>>({});
  const [isSlotEditorOpen, setIsSlotEditorOpen] = useState(false);
  const [isAddHeroModalOpen, setIsAddHeroModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveState(loadSavedState(gameMode, heroes));
    setIsHydrated(true);
  }, [heroes, gameMode]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(getStorageKey(gameMode), JSON.stringify(saveState));
  }, [isHydrated, saveState, gameMode]);

  useEffect(() => {
    if (!isSlotEditorOpen || typeof window === "undefined") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSlotEditorOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSlotEditorOpen]);

  const selectedRosterHeroId = saveState.selectedHeroId;

  const selectedRosterHero = useMemo(
    () => (selectedRosterHeroId ? saveState.heroes[selectedRosterHeroId] ?? null : null),
    [saveState.heroes, selectedRosterHeroId],
  );

  const selectedHero = useMemo(() => {
    if (!selectedRosterHero) {
      return null;
    }
    return heroes.find((hero) => hero.id === selectedRosterHero.heroId) ?? null;
  }, [heroes, selectedRosterHero]);

  const selectedHeroState = useMemo(() => {
    if (selectedRosterHero) {
      return selectedRosterHero;
    }
    if (!selectedHero) {
      return createHeroSaveState();
    }

    return createHeroSaveState(selectedHero);
  }, [selectedHero, selectedRosterHero]);

  const selectedHeroScaling = useMemo(() => {
    if (!selectedHero) {
      return null;
    }
    return getHeroScalingForPrestige(selectedHero, selectedHeroState.prestige);
  }, [selectedHero, selectedHeroState.prestige]);

  const gearBySlot = useMemo(() => {
    const bySlot: Record<GearSlot, GearItem[]> = {
      weapon: [],
      head: [],
      body: [],
      hands: [],
      feet: [],
      trinket: [],
    };

    for (const item of gearItems) {
      bySlot[item.slot].push(item);
    }

    for (const slot of GEAR_SLOT_ORDER) {
      bySlot[slot].sort((a, b) => {
        if (a.tier !== b.tier) return a.tier - b.tier;
        if (a.level !== b.level) return a.level - b.level;
        return a.name.localeCompare(b.name);
      });
    }

    return bySlot;
  }, [gearItems]);

  const selectedGear = useMemo(() => {
    const result: Record<GearSlot, GearItem | null> = {
      weapon: null,
      head: null,
      body: null,
      hands: null,
      feet: null,
      trinket: null,
    };

    for (const slot of GEAR_SLOT_ORDER) {
      const itemId = selectedHeroState.equipped[slot].itemId;
      result[slot] = itemId === null ? null : gearItems.find((item) => item.id === itemId) ?? null;
    }

    return result;
  }, [gearItems, selectedHeroState.equipped]);

  const totalGearBonus = useMemo(() => {
    const total = { ...EMPTY_STATS };

    for (const slot of GEAR_SLOT_ORDER) {
      const item = selectedGear[slot];
      if (!item) {
        continue;
      }

      const prefixCandidate = prefixOptions.find((entry) => entry.id === selectedHeroState.equipped[slot].prefixId);
      const suffixCandidate = suffixOptions.find((entry) => entry.id === selectedHeroState.equipped[slot].suffixId);
      const prefix = isAffixUnlocked(prefixCandidate, selectedHeroState.equipped[slot].prestige) ? prefixCandidate : undefined;
      const suffix = isAffixUnlocked(suffixCandidate, selectedHeroState.equipped[slot].prestige) ? suffixCandidate : undefined;
      const withAffixes = applyExactBonusOverrides(
        getComputedGearBonus(item, selectedHeroState.equipped[slot].quality, selectedHeroState.equipped[slot].prestige, prefix, suffix),
        selectedHeroState.equipped[slot].exactBonus,
      );
      total.hp += withAffixes.hp;
      total.atk += withAffixes.atk;
      total.matk += withAffixes.matk;
      total.def += withAffixes.def;
      total.mdef += withAffixes.mdef;
      total.acc += withAffixes.acc;
      total.crit += withAffixes.crit;
      total.str += withAffixes.str;
      total.int += withAffixes.int;
      total.dex += withAffixes.dex;
      total.lck += withAffixes.lck;
      total.speed += withAffixes.speed;
      total.exp += withAffixes.exp;
      total.ap += withAffixes.ap;
      total.critDmg += withAffixes.critDmg;
      total.hpPct += withAffixes.hpPct;
      total.atkPct += withAffixes.atkPct;
      total.matkPct += withAffixes.matkPct;
      total.defPct += withAffixes.defPct;
      total.mdefPct += withAffixes.mdefPct;
      total.accPct += withAffixes.accPct;
      total.gold += withAffixes.gold;
    }

    return total;
  }, [prefixOptions, selectedGear, selectedHeroState.equipped, suffixOptions]);

   const calculatedHeroStats = useMemo<HeroComputedStats | null>(() => {
     if (!selectedHero) {
       return null;
     }

     const heroLevel = selectedHeroState.level;
     const heroPrestige = selectedHeroState.prestige;
     const heroBaseStats = getHeroStatsForProgression(selectedHero, heroLevel, heroPrestige);
     const heroScaling = getHeroScalingForPrestige(selectedHero, heroPrestige);

     const totalStr = selectedHeroState.attributes.str + totalGearBonus.str;
     const totalInt = selectedHeroState.attributes.int + totalGearBonus.int;
     const totalDex = selectedHeroState.attributes.dex + totalGearBonus.dex;

     const baseHp = heroBaseStats.hp + totalGearBonus.hp;
     const baseAtk = heroBaseStats.atk + totalGearBonus.atk + totalStr * heroScaling.strToAtk;
     const baseMatk = heroBaseStats.matk + totalGearBonus.matk + totalInt * heroScaling.intToMatk;
     const baseDef = heroBaseStats.def + totalGearBonus.def;
     const baseMdef = heroBaseStats.mdef + totalGearBonus.mdef;
     const baseAcc = heroBaseStats.acc + totalGearBonus.acc + totalDex * heroScaling.dexToAcc;
     const maxHp = applyPercent(baseHp, totalGearBonus.hpPct);

     const baseAp = getBaseApForLevel(heroLevel) + totalGearBonus.ap;

     return {
       hp: maxHp,
       currentHp: maxHp,
       atk: applyPercent(baseAtk, totalGearBonus.atkPct),
       matk: applyPercent(baseMatk, totalGearBonus.matkPct),
       def: applyPercent(baseDef, totalGearBonus.defPct),
       mdef: applyPercent(baseMdef, totalGearBonus.mdefPct),
       acc: applyPercent(baseAcc, totalGearBonus.accPct),
       crit: heroBaseStats.crit + totalGearBonus.crit,
       str: totalStr,
       int: totalInt,
       dex: totalDex,
       lck: totalGearBonus.lck,
       speed: totalGearBonus.speed,
       ap: baseAp,
       exp: totalGearBonus.exp,
       critDmg: 200 + totalGearBonus.critDmg,
       gold: totalGearBonus.gold,
     };
   }, [selectedHero, selectedHeroState.attributes, selectedHeroState.level, selectedHeroState.prestige, totalGearBonus]);

  const computedHeroStats = useMemo<HeroComputedStats | null>(() => {
    if (!calculatedHeroStats) {
      return null;
    }

    const next = { ...calculatedHeroStats };
    HERO_STAT_FIELDS.forEach(([key]) => {
      const overrideValue = selectedHeroState.statOverrides[key];
      if (typeof overrideValue === "number" && Number.isFinite(overrideValue)) {
        next[key] = overrideValue;
      }
    });

    return next;
  }, [calculatedHeroStats, selectedHeroState.statOverrides]);

  const hasStatOverrides = Object.keys(selectedHeroState.statOverrides).length > 0;

  const activeSlot = activeSlotByHero[selectedRosterHeroId] ?? "weapon";
  const activeTierFilter = tierFilterBySlot[activeSlot];
  const activeSortDirection = sortDirectionBySlot[activeSlot] ?? "asc";
  const currentSlotState = selectedHeroState.equipped[activeSlot];
  const activeSlotDraft = slotDraftBySlot[activeSlot] ?? {
    itemId: currentSlotState.itemId,
    quality: currentSlotState.quality,
    prefixId: currentSlotState.prefixId,
    suffixId: currentSlotState.suffixId,
    prestige: currentSlotState.prestige,
    exactBonus: currentSlotState.exactBonus,
  };
  const activeDraftItem =
    activeSlotDraft.itemId === null
      ? null
      : gearItems.find((item) => item.id === activeSlotDraft.itemId) ?? null;
  const hasActiveDraftChanges =
    activeSlotDraft.itemId !== currentSlotState.itemId ||
    activeSlotDraft.quality !== currentSlotState.quality ||
    activeSlotDraft.prefixId !== currentSlotState.prefixId ||
    activeSlotDraft.suffixId !== currentSlotState.suffixId ||
    activeSlotDraft.prestige !== currentSlotState.prestige ||
    JSON.stringify(activeSlotDraft.exactBonus ?? {}) !== JSON.stringify(currentSlotState.exactBonus ?? {});
  const heroIconMissing = Boolean(selectedHero && selectedRosterHeroId && missingHeroIcons[selectedRosterHeroId]);

  const activeSlotTierOptions = useMemo(
    () => Array.from(new Set(gearBySlot[activeSlot].map((item) => item.tier))).sort((a, b) => a - b),
    [activeSlot, gearBySlot],
  );

  const filteredGearItemsForActiveSlot = useMemo(() => {
    if (activeTierFilter === undefined) {
      return gearBySlot[activeSlot];
    }
    return gearBySlot[activeSlot].filter((item) => item.tier === activeTierFilter);
  }, [activeSlot, activeTierFilter, gearBySlot]);

  const sortedGearItemsForActiveSlot = useMemo(() => {
    return [...filteredGearItemsForActiveSlot].sort((left, right) => {
      const direction = activeSortDirection === "asc" ? 1 : -1;
      if (left.tier !== right.tier) return (left.tier - right.tier) * direction;
      if (left.level !== right.level) return (left.level - right.level) * direction;
      return left.name.localeCompare(right.name) * direction;
    });
  }, [activeSortDirection, filteredGearItemsForActiveSlot]);

  const bisTier = activeTierFilter;

  const bisEntriesForActiveSlot = useMemo(() => {
    if (!selectedHero || typeof bisTier !== "number") {
      return [] as BisEntrySuggestion[];
    }

    return bisEntries.filter(
      (entry) =>
        entry.hero.toLowerCase() === selectedHero.name.toLowerCase() &&
        entry.slot === activeSlot &&
        entry.tier === bisTier,
    );
  }, [activeSlot, bisEntries, bisTier, selectedHero]);

  const bisPotionNotesForActiveTier = useMemo(() => {
    if (!selectedHero || typeof bisTier !== "number") {
      return [] as string[];
    }

    return Array.from(
      new Set(
        bisEntries
          .filter(
            (entry) =>
              entry.hero.toLowerCase() === selectedHero.name.toLowerCase() &&
              entry.slot === "potionPrefix" &&
              entry.tier === bisTier &&
              entry.raw.trim().length > 0,
          )
          .map((entry) => entry.raw.trim()),
      ),
    );
  }, [bisEntries, bisTier, selectedHero]);

  const bisSuggestedItemsForActiveSlot = useMemo(
    () => bisEntriesForActiveSlot.flatMap((entry) => entry.items).filter((item) => item.trim().length > 0),
    [bisEntriesForActiveSlot],
  );

  const bisSuggestedEntriesForActiveSlot = useMemo(() => {
    const entries = bisEntriesForActiveSlot.flatMap((entry) =>
      entry.items
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) => ({
          id: `${entry.id}:${item}`,
          suggestedName: item,
          setupLabel: getBisSetupLabel(entry.buildLabel),
          matchedItem: gearBySlot[activeSlot].find((candidate) => isLikelySameItem(candidate.name, item)) ?? null,
        })),
    );

    const seen = new Set<string>();
    return entries.filter((entry) => {
      const key = `${entry.suggestedName.toLowerCase()}::${entry.setupLabel.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [activeSlot, bisEntriesForActiveSlot, gearBySlot]);

  const activePrefixCandidate = prefixOptions.find((entry) => entry.id === activeSlotDraft.prefixId);
  const activeSuffixCandidate = suffixOptions.find((entry) => entry.id === activeSlotDraft.suffixId);
  const activePrefix = isAffixUnlocked(activePrefixCandidate, activeSlotDraft.prestige) ? activePrefixCandidate : undefined;
  const activeSuffix = isAffixUnlocked(activeSuffixCandidate, activeSlotDraft.prestige) ? activeSuffixCandidate : undefined;
  const activeDraftComputedBonus = activeDraftItem
    ? getComputedGearBonus(activeDraftItem, activeSlotDraft.quality, activeSlotDraft.prestige, activePrefix, activeSuffix)
    : null;
  const activeDraftEffectiveBonus = activeDraftComputedBonus
    ? applyExactBonusOverrides(activeDraftComputedBonus, activeSlotDraft.exactBonus)
    : null;
  const activeDraftEditableFields = EDITABLE_GEAR_BONUS_FIELDS.filter(([key]) =>
    activeDraftEffectiveBonus ? activeDraftEffectiveBonus[key] !== 0 || activeDraftComputedBonus?.[key] !== 0 : false,
  );

  const buildExactBonusSeed = (
    itemId: number | null,
    quality: GearQuality,
    prefixId: string | null,
    suffixId: string | null,
    prestige: PrestigeLevel,
  ) => {
    if (itemId === null) {
      return null;
    }

    const item = gearItems.find((entry) => entry.id === itemId);
    if (!item) {
      return null;
    }

    const prefixCandidate = prefixOptions.find((entry) => entry.id === prefixId);
    const suffixCandidate = suffixOptions.find((entry) => entry.id === suffixId);
    const prefix = isAffixUnlocked(prefixCandidate, prestige) ? prefixCandidate : undefined;
    const suffix = isAffixUnlocked(suffixCandidate, prestige) ? suffixCandidate : undefined;

    return createExactBonusOverrides(getComputedGearBonus(item, quality, prestige, prefix, suffix));
  };

  const updateHeroState = (updater: (current: HeroSaveState) => HeroSaveState) => {
    if (!selectedRosterHeroId) {
      return;
    }

    setSaveState((current) => {
      const heroState = current.heroes[selectedRosterHeroId];
      if (!heroState) {
        return current;
      }

      const nextHeroState = updater(heroState);
      return {
        ...current,
        heroes: {
          ...current.heroes,
          [selectedRosterHeroId]: {
            ...nextHeroState,
            heroId: heroState.heroId,
          },
        },
      };
    });
  };

  const handleHeroLevelChange = (value: string) => {
    const parsed = Number(value);
    updateHeroState((current) => ({
      ...current,
      level: clampHeroLevel(Number.isFinite(parsed) ? parsed : MIN_HERO_LEVEL),
    }));
  };

  const handleHeroPrestigeChange = (value: string) => {
    updateHeroState((current) => ({
      ...current,
      prestige: toPrestigeLevel(Number(value)),
    }));
  };

  const handleStatOverrideChange = (key: keyof HeroComputedStats, value: string) => {
    updateHeroState((current) => {
      const nextOverrides = { ...current.statOverrides };

      if (value.trim() === "") {
        delete nextOverrides[key];
      } else {
        const parsed = Number(value);
        nextOverrides[key] = Number.isFinite(parsed) ? parsed : 0;
      }

      return {
        ...current,
        statOverrides: nextOverrides,
      };
    });
  };

  const clearStatOverrides = () => {
    updateHeroState((current) => ({
      ...current,
      statOverrides: {},
    }));
  };

  const handleSelectHero = (rosterHeroId: string) => {
    setSlotDraftBySlot({});
    setIsSlotEditorOpen(false);
    setSaveState((current) => ({
      ...current,
      selectedHeroId: rosterHeroId,
    }));
  };

  const handleSetDraftItem = (itemId: number | null) => {
    setSlotDraftBySlot((current) => ({
      ...current,
      [activeSlot]: {
        itemId,
        quality: (current[activeSlot]?.quality ?? currentSlotState.quality) as GearQuality,
        prefixId: current[activeSlot]?.prefixId ?? currentSlotState.prefixId,
        suffixId: current[activeSlot]?.suffixId ?? currentSlotState.suffixId,
        prestige: current[activeSlot]?.prestige ?? currentSlotState.prestige,
        exactBonus: buildExactBonusSeed(
          itemId,
          (current[activeSlot]?.quality ?? currentSlotState.quality) as GearQuality,
          current[activeSlot]?.prefixId ?? currentSlotState.prefixId,
          current[activeSlot]?.suffixId ?? currentSlotState.suffixId,
          current[activeSlot]?.prestige ?? currentSlotState.prestige,
        ),
      },
    }));
  };

  const handleApplyBisSuggestion = (suggestedName: string) => {
    const matchedItem = gearBySlot[activeSlot].find((item) => isLikelySameItem(item.name, suggestedName));
    if (!matchedItem) {
      return;
    }

    setTierFilterBySlot((current) => ({
      ...current,
      [activeSlot]: matchedItem.tier,
    }));
    handleSetDraftItem(matchedItem.id);

    // Wait for the filtered list to render, then bring the selected item into view.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        itemButtonRefs.current[matchedItem.id]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      });
    });
  };

  const handleSetDraftQuality = (quality: GearQuality) => {
    setSlotDraftBySlot((current) => ({
      ...current,
      [activeSlot]: {
        itemId: current[activeSlot]?.itemId ?? currentSlotState.itemId,
        quality,
        prefixId: current[activeSlot]?.prefixId ?? currentSlotState.prefixId,
        suffixId: current[activeSlot]?.suffixId ?? currentSlotState.suffixId,
        prestige: current[activeSlot]?.prestige ?? currentSlotState.prestige,
          exactBonus: buildExactBonusSeed(
            current[activeSlot]?.itemId ?? currentSlotState.itemId,
            quality,
            current[activeSlot]?.prefixId ?? currentSlotState.prefixId,
            current[activeSlot]?.suffixId ?? currentSlotState.suffixId,
            current[activeSlot]?.prestige ?? currentSlotState.prestige,
          ),
      },
    }));
  };

  const handleSetDraftPrefix = (prefixId: string | null) => {
    setSlotDraftBySlot((current) => ({
      ...current,
      [activeSlot]: {
        itemId: current[activeSlot]?.itemId ?? currentSlotState.itemId,
        quality: (current[activeSlot]?.quality ?? currentSlotState.quality) as GearQuality,
        prefixId,
        suffixId: current[activeSlot]?.suffixId ?? currentSlotState.suffixId,
        prestige: current[activeSlot]?.prestige ?? currentSlotState.prestige,
          exactBonus: buildExactBonusSeed(
            current[activeSlot]?.itemId ?? currentSlotState.itemId,
            (current[activeSlot]?.quality ?? currentSlotState.quality) as GearQuality,
            prefixId,
            current[activeSlot]?.suffixId ?? currentSlotState.suffixId,
            current[activeSlot]?.prestige ?? currentSlotState.prestige,
          ),
      },
    }));
  };

  const handleSetDraftSuffix = (suffixId: string | null) => {
    setSlotDraftBySlot((current) => ({
      ...current,
      [activeSlot]: {
        itemId: current[activeSlot]?.itemId ?? currentSlotState.itemId,
        quality: (current[activeSlot]?.quality ?? currentSlotState.quality) as GearQuality,
        prefixId: current[activeSlot]?.prefixId ?? currentSlotState.prefixId,
        suffixId,
        prestige: current[activeSlot]?.prestige ?? currentSlotState.prestige,
          exactBonus: buildExactBonusSeed(
            current[activeSlot]?.itemId ?? currentSlotState.itemId,
            (current[activeSlot]?.quality ?? currentSlotState.quality) as GearQuality,
            current[activeSlot]?.prefixId ?? currentSlotState.prefixId,
            suffixId,
            current[activeSlot]?.prestige ?? currentSlotState.prestige,
          ),
      },
    }));
  };

  const handleSetDraftPrestige = (prestige: PrestigeLevel) => {
    setSlotDraftBySlot((current) => {
      const prefixId = current[activeSlot]?.prefixId ?? currentSlotState.prefixId;
      const suffixId = current[activeSlot]?.suffixId ?? currentSlotState.suffixId;
      const prefixCandidate = prefixOptions.find((entry) => entry.id === prefixId);
      const suffixCandidate = suffixOptions.find((entry) => entry.id === suffixId);

      return {
        ...current,
        [activeSlot]: {
          itemId: current[activeSlot]?.itemId ?? currentSlotState.itemId,
          quality: (current[activeSlot]?.quality ?? currentSlotState.quality) as GearQuality,
          prefixId: isAffixUnlocked(prefixCandidate, prestige) ? prefixId : null,
          suffixId: isAffixUnlocked(suffixCandidate, prestige) ? suffixId : null,
          prestige,
          exactBonus: buildExactBonusSeed(
            current[activeSlot]?.itemId ?? currentSlotState.itemId,
            (current[activeSlot]?.quality ?? currentSlotState.quality) as GearQuality,
            isAffixUnlocked(prefixCandidate, prestige) ? prefixId : null,
            isAffixUnlocked(suffixCandidate, prestige) ? suffixId : null,
            prestige,
          ),
        },
      };
    });
  };

  const handleSetDraftExactBonus = (key: keyof GearBonus, value: string) => {
    setSlotDraftBySlot((current) => {
      const nextExactBonus = { ...(current[activeSlot]?.exactBonus ?? currentSlotState.exactBonus ?? {}) };

      if (value.trim() === "") {
        delete nextExactBonus[key];
      } else {
        const parsed = Number(value);
        nextExactBonus[key] = Number.isFinite(parsed) ? parsed : 0;
      }

      return {
        ...current,
        [activeSlot]: {
          itemId: current[activeSlot]?.itemId ?? currentSlotState.itemId,
          quality: (current[activeSlot]?.quality ?? currentSlotState.quality) as GearQuality,
          prefixId: current[activeSlot]?.prefixId ?? currentSlotState.prefixId,
          suffixId: current[activeSlot]?.suffixId ?? currentSlotState.suffixId,
          prestige: current[activeSlot]?.prestige ?? currentSlotState.prestige,
          exactBonus: nextExactBonus,
        },
      };
    });
  };

  const handleCancelDraft = () => {
    setSlotDraftBySlot((current) => {
      const next = { ...current };
      delete next[activeSlot];
      return next;
    });
    setIsSlotEditorOpen(false);
  };

  const handleSaveDraft = () => {
    const draft = slotDraftBySlot[activeSlot];
    if (!draft) {
      return;
    }

    updateHeroState((current) => ({
      ...current,
      equipped: {
        ...current.equipped,
        [activeSlot]: {
          ...current.equipped[activeSlot],
          itemId: draft.itemId,
          quality: draft.quality,
          prefixId: draft.prefixId,
          suffixId: draft.suffixId,
          prestige: draft.prestige,
          exactBonus: draft.exactBonus,
        },
      },
    }));

    setSlotDraftBySlot((current) => {
      const next = { ...current };
      delete next[activeSlot];
      return next;
    });
    setIsSlotEditorOpen(false);
  };

  const handleSetActiveSlot = (slot: GearSlot) => {
    if (!selectedRosterHeroId) {
      return;
    }
    setActiveSlotByHero((current) => ({
      ...current,
      [selectedRosterHeroId]: slot,
    }));
  };

  const handleOpenSlotEditor = (slot: GearSlot) => {
    handleSetActiveSlot(slot);
    setIsSlotEditorOpen(true);
  };

  const resetLocalSave = () => {
    const fresh = createDefaultSaveState(gameMode, heroes);
    setSaveState(fresh);
    setActiveSlotByHero({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(getStorageKey(gameMode));
    }
  };

  const hasBardInRoster = useMemo(
    () =>
      Object.values(saveState.heroes).some((heroState) => {
        const hero = heroes.find((entry) => entry.id === heroState.heroId);
        return hero?.name.toLowerCase() === "bard";
      }),
    [heroes, saveState.heroes],
  );

  const addableHeroes = useMemo(
    () => heroes.filter((hero) => hero.name.toLowerCase() !== "bard" || !hasBardInRoster),
    [hasBardInRoster, heroes],
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Merchant Hero Hall</h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <Save className="h-3.5 w-3.5" />
              Saved locally
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Click a hero to manage their saved loadout. Gear changes are written to this machine automatically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onBackClick && (
            <Button type="button" variant="outline" onClick={onBackClick}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Game Modes
            </Button>
          )}
          <Button type="button" variant="outline" onClick={resetLocalSave}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset local saves
          </Button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Card className="h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle>Heroes</CardTitle>
            <CardDescription>Click a hero to open their saved sheet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-[calc(100vh-14rem)] space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-10rem)]">
              {Object.keys(saveState.heroes).length === 0 ? (
                <div className="rounded-lg border border-dashed border-input bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                  <p>No heroes added yet</p>
                  <p className="mt-1 text-xs">Click the &quot;Add Hero&quot; button below to get started</p>
                </div>
              ) : (
                Object.entries(saveState.heroes).map(([rosterHeroId, heroState]) => {
                  const hero = heroes.find((h) => h.id === heroState.heroId);
                  if (!hero) return null;

                  const rosterStats = computeHeroStatsForRoster(hero, heroState, gearItems, prefixOptions, suffixOptions);
                  const isSelected = rosterHeroId === selectedRosterHeroId;
                  return (
                    <div
                      key={rosterHeroId}
                      className={cn(
                        "flex items-start gap-2 rounded-xl border px-3 py-2.5 transition",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-input bg-background hover:border-primary/40 hover:bg-muted/30",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectHero(rosterHeroId)}
                        className="flex min-w-0 flex-1 items-start gap-3 text-left"
                      >
                        <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-input bg-muted">
                          <Image
                            src={getHeroIconPath(hero)}
                            alt={`${hero.name} icon`}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                         <div className="min-w-0 flex-1 space-y-1.5">
                           <div className="flex items-baseline justify-between gap-2">
                             <p className="truncate text-sm font-semibold" title={hero.name}>{hero.name}</p>
                             <p className="shrink-0 text-xs text-muted-foreground">Lv {heroState.level} · P{heroState.prestige}</p>
                           </div>
                           {/* HP bar */}
                           <div className="space-y-0.5">
                             <div className="flex items-center justify-between text-[11px]">
                               <span className="text-muted-foreground">HP</span>
                               <span className="font-medium tabular-nums">{formatValue(rosterStats.currentHp)}/{formatValue(rosterStats.hp)}</span>
                             </div>
                             <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                               <div
                                 className="h-full rounded-full bg-green-500 transition-all"
                                 style={{ width: `${Math.min(100, rosterStats.hp > 0 ? (rosterStats.currentHp / rosterStats.hp) * 100 : 0)}%` }}
                               />
                             </div>
                           </div>
                           {/* Key stats as flowing label/value pairs */}
                           <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
                             {([
                               ["ATK", rosterStats.atk],
                               ["M.Atk", rosterStats.matk],
                               ["Acc", rosterStats.acc],
                               ["Def", rosterStats.def],
                               ["M.Def", rosterStats.mdef],
                               ["AP", rosterStats.ap],
                             ] as [string, number][]).map(([label, val]) => (
                               <span key={label} className="whitespace-nowrap">
                                 <span className="text-muted-foreground">{label}</span>
                                 {" "}
                                 <span className="font-medium tabular-nums">{formatValue(val)}</span>
                               </span>
                             ))}
                           </div>
                         </div>
                        <ChevronRight className={cn("mt-1 h-4 w-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Remove hero from roster
                          setSaveState((current) => {
                            const nextHeroes = { ...current.heroes };
                            delete nextHeroes[rosterHeroId];

                            // If this was the selected hero, select another roster entry or clear selection.
                            let nextSelectedHeroId = current.selectedHeroId;
                            if (nextSelectedHeroId === rosterHeroId) {
                              const remainingHeroIds = Object.keys(nextHeroes);
                              nextSelectedHeroId = remainingHeroIds[0] ?? "";
                            }

                            return {
                              ...current,
                              heroes: nextHeroes,
                              selectedHeroId: nextSelectedHeroId,
                            };
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsAddHeroModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Hero
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Sheet</CardTitle>
              <CardDescription>
                The selected hero&apos;s stats, gear, and attributes stay saved locally.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {selectedHero ? (
                <>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-input bg-muted shadow-inner">
                        {!heroIconMissing ? (
                          <Image
                            src={selectedHero.iconPath}
                            alt={`${selectedHero.name} icon`}
                            width={80}
                            height={80}
                            onError={() =>
                              setMissingHeroIcons((current) => ({
                                ...current,
                                [selectedRosterHeroId]: true,
                              }))
                            }
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">Icon missing</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-2xl font-bold leading-none">{selectedHero.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Level {selectedHeroState.level} • P{selectedHeroState.prestige}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                          <div>STR → ATK: {selectedHeroScaling?.strToAtk ?? selectedHero.scaling.strToAtk}</div>
                          <div>INT → MATK: {selectedHeroScaling?.intToMatk ?? selectedHero.scaling.intToMatk}</div>
                          <div>DEX → ACC: {selectedHeroScaling?.dexToAcc ?? selectedHero.scaling.dexToAcc}</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-input bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                      Changes save automatically to this PC.
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-input bg-muted/20 p-3">
                      <div className="grid gap-2 md:grid-cols-[1fr_190px_1fr] md:items-center">
                        <div className="grid grid-cols-1 gap-1.5">
                          {(["weapon", "head", "body"] as GearSlot[]).map((slot) => (
                            <SlotButton
                              key={slot}
                              slot={slot}
                              active={activeSlot === slot}
                              item={selectedGear[slot]}
                              itemImagePath={toPublicAssetPath(selectedGear[slot]?.imagePath)}
                              imageMissing={selectedGear[slot]?.imagePath ? Boolean(missingItemImages[toPublicAssetPath(selectedGear[slot]!.imagePath)]) : false}
                              quality={selectedHeroState.equipped[slot].quality}
                              onClick={() => handleOpenSlotEditor(slot)}
                            />
                          ))}
                        </div>

                        <div className="rounded-2xl border border-input bg-card p-2.5">
                          <div className="flex min-h-44 items-center justify-center">
                            <div className="w-full space-y-2 text-center">
                              <p className="text-sm font-semibold">{GEAR_SLOT_LABELS[activeSlot]}</p>
                              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-input bg-muted/40 shadow-inner">
                                {!heroIconMissing ? (
                                  <Image
                                    src={selectedHero.iconPath}
                                    alt={`${selectedHero.name} icon`}
                                    width={120}
                                    height={120}
                                    className="h-28 w-28 object-contain"
                                    onError={() =>
                                      setMissingHeroIcons((current) => ({
                                        ...current,
                                        [selectedRosterHeroId]: true,
                                      }))
                                    }
                                  />
                                ) : (
                                  <div className="text-center text-xs text-muted-foreground sm:text-sm">
                                    Hero art
                                    <br />
                                    unavailable
                                  </div>
                                )}
                              </div>
                              <p className="rounded-md border border-input bg-muted/20 px-2 py-1 text-[11px] text-muted-foreground">
                                Editing {GEAR_SLOT_LABELS[activeSlot]} ({activeSlotDraft.quality}, {PRESTIGE_LABELS[activeSlotDraft.prestige]})
                                {hasActiveDraftChanges ? " • Unsaved" : ""}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-1.5">
                          {(["hands", "feet", "trinket"] as GearSlot[]).map((slot) => (
                            <SlotButton
                              key={slot}
                              slot={slot}
                              active={activeSlot === slot}
                              item={selectedGear[slot]}
                              itemImagePath={toPublicAssetPath(selectedGear[slot]?.imagePath)}
                              imageMissing={selectedGear[slot]?.imagePath ? Boolean(missingItemImages[toPublicAssetPath(selectedGear[slot]!.imagePath)]) : false}
                              quality={selectedHeroState.equipped[slot].quality}
                              onClick={() => handleOpenSlotEditor(slot)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Progression</CardTitle>
                        <CardDescription>Saved per hero and used for base stat and scaling calculations.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="hero-level">Level</Label>
                          <Input
                            id="hero-level"
                            type="number"
                            min={MIN_HERO_LEVEL}
                            max={MAX_HERO_LEVEL}
                            value={selectedHeroState.level}
                            onChange={(event) => handleHeroLevelChange(event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hero-prestige">Hero Prestige</Label>
                          <Select value={String(selectedHeroState.prestige)} onValueChange={handleHeroPrestigeChange}>
                            <SelectTrigger id="hero-prestige">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Base</SelectItem>
                              <SelectItem value="1">P1</SelectItem>
                              <SelectItem value="2">P2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                        <div>
                        <CardTitle>Current Stats</CardTitle>
                        <CardDescription>
                          Edit any value directly (including STR/INT/DEX). Use reset to return to calculated values.
                        </CardDescription>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={clearStatOverrides} disabled={!hasStatOverrides}>
                          Reset to calculated
                        </Button>
                      </CardHeader>
                      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {computedHeroStats ? (
                          <>
                            {HERO_STAT_FIELDS.map(([key, label]) => (
                              <div key={`current-${key}`} className="space-y-1.5">
                                <Label htmlFor={`current-${key}`} className="text-xs text-muted-foreground">{label}</Label>
                                <Input
                                  id={`current-${key}`}
                                  type="number"
                                  value={selectedHeroState.statOverrides[key] ?? computedHeroStats[key]}
                                  onChange={(event) => handleStatOverrideChange(key, event.target.value)}
                                />
                              </div>
                            ))}
                          </>
                        ) : (
                          <p className="text-sm text-red-600">No hero data found.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <p className="text-sm text-red-600">No hero data found.</p>
              )}
            </CardContent>
          </Card>

          {/* Quest Enemy and Saved Loadout sections removed - will be implemented in simulator later */}
        </div>
      </section>

      {isSlotEditorOpen && selectedHero ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={() => setIsSlotEditorOpen(false)}>
          <Card
            className="flex max-h-[90vh] w-full max-w-3xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="border-b border-input pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Active Slot</CardTitle>
                  <CardDescription>
                    Pick a piece of gear and its grade for {GEAR_SLOT_LABELS[activeSlot].toLowerCase()}.
                  </CardDescription>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsSlotEditorOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slot-quality">Quality</Label>
                    <span className="text-xs text-muted-foreground">Affects slot stats</span>
                  </div>
                  <Select
                    value={activeSlotDraft.quality}
                    onValueChange={(value) => handleSetDraftQuality(value as GearQuality)}
                  >
                    <SelectTrigger id="slot-quality">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(QUALITY_LABELS) as GearQuality[]).map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {QUALITY_LABELS[quality]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slot-tier-filter">Tier</Label>
                    <span className="text-xs text-muted-foreground">Filter list</span>
                  </div>
                  <Select
                    value={activeTierFilter === undefined ? "all" : String(activeTierFilter)}
                    onValueChange={(value) => {
                      setTierFilterBySlot((current) => ({
                        ...current,
                        [activeSlot]: value === "all" ? undefined : Number(value),
                      }));
                    }}
                  >
                    <SelectTrigger id="slot-tier-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tiers</SelectItem>
                      {activeSlotTierOptions.map((tier) => (
                        <SelectItem key={tier} value={String(tier)}>
                          Tier {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slot-prestige">Prestige</Label>
                    <span className="text-xs text-muted-foreground">Affects slot stats</span>
                  </div>
                  <Select
                    value={String(activeSlotDraft.prestige)}
                    onValueChange={(value) => handleSetDraftPrestige(Number(value) as PrestigeLevel)}
                  >
                    <SelectTrigger id="slot-prestige">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Base</SelectItem>
                      <SelectItem value="1">P1</SelectItem>
                      <SelectItem value="2">P2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="gear-prefix">Prefix</Label>
                  <Select
                    value={activeSlotDraft.prefixId ?? "none"}
                    onValueChange={(value) => handleSetDraftPrefix(value === "none" ? null : value)}
                  >
                    <SelectTrigger id="gear-prefix">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {prefixOptions.map((prefix) => (
                        <SelectItem
                          key={prefix.id}
                          value={prefix.id}
                          disabled={!isAffixUnlocked(prefix, activeSlotDraft.prestige)}
                        >
                          {formatAffixOptionLabel(prefix)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {activeSlotDraft.prefixId
                      ? formatAffixEffectSummary(prefixOptions.find((entry) => entry.id === activeSlotDraft.prefixId))
                      : "No prefix selected."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gear-suffix">Suffix</Label>
                  <Select
                    value={activeSlotDraft.suffixId ?? "none"}
                    onValueChange={(value) => handleSetDraftSuffix(value === "none" ? null : value)}
                  >
                    <SelectTrigger id="gear-suffix">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {suffixOptions.map((suffix) => (
                        <SelectItem
                          key={suffix.id}
                          value={suffix.id}
                          disabled={!isAffixUnlocked(suffix, activeSlotDraft.prestige)}
                        >
                          {formatAffixOptionLabel(suffix)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {activeSlotDraft.suffixId
                      ? formatAffixEffectSummary(suffixOptions.find((entry) => entry.id === activeSlotDraft.suffixId))
                      : "No suffix selected."}
                  </p>
                </div>
              </div>

              {typeof bisTier === "number" && bisEntriesForActiveSlot.length > 0 ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs">
                  <p className="font-medium text-emerald-800 dark:text-emerald-300">
                    BIS suggestions for {selectedHero?.name} T{bisTier} {GEAR_SLOT_LABELS[activeSlot]}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {bisSuggestedEntriesForActiveSlot.map(({ id, suggestedName, setupLabel, matchedItem }) => (
                      <Button
                        key={id}
                        type="button"
                        size="sm"
                        variant={matchedItem ? "secondary" : "outline"}
                        className="h-7"
                        onClick={() => handleApplyBisSuggestion(suggestedName)}
                        disabled={!matchedItem}
                      >
                        {suggestedName} ({setupLabel})
                        {!matchedItem ? " (not in list)" : ""}
                      </Button>
                    ))}
                  </div>
                  {bisPotionNotesForActiveTier.length > 0 ? (
                    <p className="mt-1 text-emerald-700/90 dark:text-emerald-200/90">
                      Suggested prefix/suffix: {bisPotionNotesForActiveTier.join(" | ")}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Item</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {sortedGearItemsForActiveSlot.length} of {gearBySlot[activeSlot].length} items
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setSortDirectionBySlot((current) => ({
                          ...current,
                          [activeSlot]: current[activeSlot] === "desc" ? "asc" : "desc",
                        }));
                      }}
                      title={`Sort ${activeSortDirection === "asc" ? "descending" : "ascending"}`}
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => handleSetDraftItem(null)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition",
                      activeSlotDraft.itemId === null
                        ? "border-primary bg-primary/10"
                        : "border-input bg-background hover:border-primary/40 hover:bg-muted/30",
                    )}
                  >
                    <div>
                      <p className="font-medium">Unequip</p>
                      <p className="text-xs text-muted-foreground">Remove the current item from this slot.</p>
                    </div>
                  </button>

                  {sortedGearItemsForActiveSlot.map((item) => {
                    const isSelected = activeSlotDraft.itemId === item.id;
                    const isBisSuggested = bisSuggestedItemsForActiveSlot.some((suggestedName) =>
                      isLikelySameItem(item.name, suggestedName),
                    );
                    const bisEntryForItem = bisEntriesForActiveSlot.find((entry) =>
                      entry.items.some((bisName) => isLikelySameItem(item.name, bisName)),
                    );
                    const bisNotes = bisEntryForItem ? getBisSideNotes(bisEntryForItem.raw) : [];
                    const withAffixes = getComputedGearBonus(item, activeSlotDraft.quality, activeSlotDraft.prestige, activePrefix, activeSuffix);
                    const extraPreview = getItemExtraPreview(withAffixes);
                    const itemImagePath = toPublicAssetPath(item.imagePath);
                    const isImageMissing = itemImagePath ? Boolean(missingItemImages[itemImagePath]) : false;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        ref={(node) => {
                          itemButtonRefs.current[item.id] = node;
                        }}
                        onClick={() => handleSetDraftItem(item.id)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : isBisSuggested
                              ? "border-emerald-500/60 bg-emerald-500/10"
                              : "border-input bg-background hover:border-primary/40 hover:bg-muted/30",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-input bg-muted">
                            {itemImagePath && !isImageMissing ? (
                              <Image
                                src={itemImagePath}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                                onError={() =>
                                  setMissingItemImages((current) => ({
                                    ...current,
                                    [itemImagePath]: true,
                                  }))
                                }
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">No image</span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate font-medium">
                                {item.name}
                                {isBisSuggested ? <span className="ml-2 text-emerald-700 dark:text-emerald-300">(BIS)</span> : null}
                              </p>
                              <span className="text-xs text-muted-foreground">T{item.tier}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Quality {QUALITY_LABELS[activeSlotDraft.quality]} • Prestige {PRESTIGE_LABELS[activeSlotDraft.prestige]}
                            </p>
                            {activePrefix || activeSuffix ? (
                              <p className="text-xs text-muted-foreground">
                                Affixes: {activePrefix ? `${activePrefix.name} (${formatAffixEffectSummary(activePrefix)})` : "No prefix"}
                                {" • "}
                                {activeSuffix ? `${activeSuffix.name} (${formatAffixEffectSummary(activeSuffix)})` : "No suffix"}
                              </p>
                            ) : null}
                            <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
                              <div>+HP {formatValue(withAffixes.hp)}</div>
                              <div>+ATK {formatValue(withAffixes.atk)}</div>
                              <div>+MATK {formatValue(withAffixes.matk)}</div>
                              <div>+DEF {formatValue(withAffixes.def)}</div>
                              <div>+MDEF {formatValue(withAffixes.mdef)}</div>
                              <div>+ACC {formatValue(withAffixes.acc)}</div>
                              <div>+CRIT {formatValue(withAffixes.crit)}</div>
                              <div>+STR {formatValue(withAffixes.str)}</div>
                              <div>+INT {formatValue(withAffixes.int)}</div>
                              <div>+DEX {formatValue(withAffixes.dex)}</div>
                              <div>+LCK {formatValue(withAffixes.lck)}</div>
                              <div>+SPD {formatValue(withAffixes.speed)}</div>
                            </div>
                            {extraPreview.length > 0 ? (
                              <p className="text-xs text-muted-foreground">Extras: {extraPreview.join(" • ")}</p>
                            ) : null}
                            {bisNotes.length > 0 ? (
                              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                Note: {bisNotes.join(" | ")}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeDraftItem ? (
                <div className="rounded-xl border border-input bg-muted/30 p-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Selected: {activeDraftItem.name}</p>
                  <p>
                    Slot: {GEAR_SLOT_LABELS[activeSlot]} • Quality: {activeSlotDraft.quality} • Prestige: {PRESTIGE_LABELS[activeSlotDraft.prestige]}
                  </p>
                  <p>
                    Prefix: {prefixOptions.find((entry) => entry.id === activeSlotDraft.prefixId)?.name ?? "None"} • Suffix: {suffixOptions.find((entry) => entry.id === activeSlotDraft.suffixId)?.name ?? "None"}
                  </p>
                  <p>
                    Prefix effect: {formatAffixEffectSummary(prefixOptions.find((entry) => entry.id === activeSlotDraft.prefixId))}
                  </p>
                  <p>
                    Suffix effect: {formatAffixEffectSummary(suffixOptions.find((entry) => entry.id === activeSlotDraft.suffixId))}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-input bg-muted/20 p-3 text-xs text-muted-foreground">
                  No item selected in {GEAR_SLOT_LABELS[activeSlot].toLowerCase()}.
                </div>
              )}

              {activeDraftEffectiveBonus ? (
                <div className="space-y-3 rounded-xl border border-input bg-background p-3">
                  <div>
                    <p className="font-medium text-foreground">Exact stats used in simulation</p>
                    <p className="text-xs text-muted-foreground">
                      Adjust these to match the real in-game roll. Saved values override the seeded stat math for this equipped item.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {activeDraftEditableFields.map(([key, label]) => (
                      <div key={key} className="space-y-1">
                        <Label htmlFor={`exact-${String(key)}`}>Exact {label}</Label>
                        <Input
                          id={`exact-${String(key)}`}
                          type="number"
                          step="0.1"
                          value={activeSlotDraft.exactBonus?.[key] ?? activeDraftEffectiveBonus[key]}
                          onChange={(event) => handleSetDraftExactBonus(key, event.target.value)}
                        />
                        <p className="text-[11px] text-muted-foreground">Seeded: {formatValue(activeDraftComputedBonus?.[key] ?? 0)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancelDraft}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveDraft} disabled={!hasActiveDraftChanges}>
                  Save to Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {isAddHeroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={() => setIsAddHeroModalOpen(false)}>
          <Card
            className="flex max-h-[90vh] w-full max-w-2xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="border-b border-input pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Add Hero</CardTitle>
                  <CardDescription>Select a hero class to add to your roster.</CardDescription>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsAddHeroModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {addableHeroes.map((hero) => (
                    <button
                      key={`add-${hero.id}`}
                      type="button"
                      onClick={() => {
                        const rosterHeroId = createRosterHeroId(hero.id);
                        // Create initial save state for the new hero and select it
                        setSaveState((current) => ({
                          ...current,
                          heroes: {
                            ...current.heroes,
                            [rosterHeroId]: createRosterHeroSaveState(hero),
                          },
                          selectedHeroId: rosterHeroId,
                        }));
                        setIsAddHeroModalOpen(false);
                      }}
                      className="flex flex-col items-center gap-3 rounded-xl border border-input bg-background px-4 py-4 text-center transition hover:border-primary/40 hover:bg-muted/30"
                    >
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-input bg-muted">
                        <Image
                          src={getHeroIconPath(hero)}
                          alt={`${hero.name} icon`}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{hero.name}</p>
                        <p className="text-xs text-muted-foreground">Base Level {hero.level}</p>
                      </div>
                    </button>
                ))}
              </div>
              {addableHeroes.length === 0 && (
                <div className="rounded-lg border border-dashed border-input bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                  <p>No hero classes available to add</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

    </main>
  );
}

function computeHeroStatsForRoster(
  hero: Hero,
  heroState: HeroSaveState,
  gearItems: GearItem[],
  prefixOptions: Array<{ id: string; stats: Record<string, number>; ascLevel: number | null }>,
  suffixOptions: Array<{ id: string; stats: Record<string, number>; ascLevel: number | null }>,
) {
  const totalGearBonus = { ...EMPTY_STATS };
  const heroBaseStats = getHeroStatsForProgression(hero, heroState.level, heroState.prestige);
  const heroScaling = getHeroScalingForPrestige(hero, heroState.prestige);

  for (const slot of GEAR_SLOT_ORDER) {
    const itemId = heroState.equipped[slot].itemId;
    if (itemId === null) {
      continue;
    }

    const item = gearItems.find((entry) => entry.id === itemId);
    if (!item) {
      continue;
    }

    const prefixCandidate = prefixOptions.find((entry) => entry.id === heroState.equipped[slot].prefixId);
    const suffixCandidate = suffixOptions.find((entry) => entry.id === heroState.equipped[slot].suffixId);
    const prestige = heroState.equipped[slot].prestige ?? 0;
    const prefix = isAffixUnlocked(prefixCandidate, prestige) ? prefixCandidate : undefined;
    const suffix = isAffixUnlocked(suffixCandidate, prestige) ? suffixCandidate : undefined;
    const withAffixes = applyExactBonusOverrides(
      getComputedGearBonus(item, heroState.equipped[slot].quality, prestige, prefix, suffix),
      heroState.equipped[slot].exactBonus,
    );
    totalGearBonus.hp += withAffixes.hp;
    totalGearBonus.atk += withAffixes.atk;
    totalGearBonus.matk += withAffixes.matk;
    totalGearBonus.def += withAffixes.def;
    totalGearBonus.mdef += withAffixes.mdef;
    totalGearBonus.acc += withAffixes.acc;
    totalGearBonus.crit += withAffixes.crit;
    totalGearBonus.str += withAffixes.str;
    totalGearBonus.int += withAffixes.int;
    totalGearBonus.dex += withAffixes.dex;
    totalGearBonus.lck += withAffixes.lck;
    totalGearBonus.speed += withAffixes.speed;
    totalGearBonus.exp += withAffixes.exp;
    totalGearBonus.ap += withAffixes.ap;
    totalGearBonus.critDmg += withAffixes.critDmg;
    totalGearBonus.hpPct += withAffixes.hpPct;
    totalGearBonus.atkPct += withAffixes.atkPct;
    totalGearBonus.matkPct += withAffixes.matkPct;
    totalGearBonus.defPct += withAffixes.defPct;
    totalGearBonus.mdefPct += withAffixes.mdefPct;
    totalGearBonus.accPct += withAffixes.accPct;
    totalGearBonus.gold += withAffixes.gold;
  }

  const totalStr = heroState.attributes.str + totalGearBonus.str;
  const totalInt = heroState.attributes.int + totalGearBonus.int;
  const totalDex = heroState.attributes.dex + totalGearBonus.dex;

  const baseHp = heroBaseStats.hp + totalGearBonus.hp;
  const baseAtk = heroBaseStats.atk + totalGearBonus.atk + totalStr * heroScaling.strToAtk;
  const baseMatk = heroBaseStats.matk + totalGearBonus.matk + totalInt * heroScaling.intToMatk;
  const baseDef = heroBaseStats.def + totalGearBonus.def;
  const baseMdef = heroBaseStats.mdef + totalGearBonus.mdef;
  const baseAcc = heroBaseStats.acc + totalGearBonus.acc + totalDex * heroScaling.dexToAcc;
  const maxHp = applyPercent(baseHp, totalGearBonus.hpPct);
  const baseAp = getBaseApForLevel(heroState.level) + totalGearBonus.ap;

  const computed = {
    hp: maxHp,
    currentHp: maxHp,
    atk: applyPercent(baseAtk, totalGearBonus.atkPct),
    matk: applyPercent(baseMatk, totalGearBonus.matkPct),
    def: applyPercent(baseDef, totalGearBonus.defPct),
    mdef: applyPercent(baseMdef, totalGearBonus.mdefPct),
    acc: applyPercent(baseAcc, totalGearBonus.accPct),
    ap: baseAp,
    crit: heroBaseStats.crit + totalGearBonus.crit,
  };

  return {
    hp: typeof heroState.statOverrides.hp === "number" ? heroState.statOverrides.hp : computed.hp,
    currentHp: typeof heroState.statOverrides.currentHp === "number" ? heroState.statOverrides.currentHp : computed.currentHp,
    atk: typeof heroState.statOverrides.atk === "number" ? heroState.statOverrides.atk : computed.atk,
    matk: typeof heroState.statOverrides.matk === "number" ? heroState.statOverrides.matk : computed.matk,
    def: typeof heroState.statOverrides.def === "number" ? heroState.statOverrides.def : computed.def,
    mdef: typeof heroState.statOverrides.mdef === "number" ? heroState.statOverrides.mdef : computed.mdef,
    acc: typeof heroState.statOverrides.acc === "number" ? heroState.statOverrides.acc : computed.acc,
    ap: typeof heroState.statOverrides.ap === "number" ? heroState.statOverrides.ap : computed.ap,
    crit: computed.crit,
  };
}

function SlotButton({
  slot,
  active,
  item,
  itemImagePath,
  imageMissing,
  quality,
  onClick,
}: {
  slot: GearSlot;
  active: boolean;
  item: GearItem | null;
  itemImagePath: string | null;
  imageMissing: boolean;
  quality: GearQuality;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-sm transition",
        active ? "border-primary bg-primary/10" : "border-input bg-background hover:border-primary/40 hover:bg-muted/30",
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-muted">
        {itemImagePath && !imageMissing ? (
          <Image
            src={itemImagePath}
            alt={item ? item.name : `${GEAR_SLOT_LABELS[slot]} item`}
            width={44}
            height={44}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <span className="text-[10px] text-muted-foreground">No image</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-semibold leading-none">{GEAR_SLOT_LABELS[slot]}</p>
          <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded border border-input bg-muted">
            <Image
              src={QUALITY_ICON_PATHS[quality]}
              alt={`${quality} quality`}
              width={20}
              height={20}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{item ? item.name : "None"}</p>
      </div>
    </button>
  );
}

function StatLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-input bg-background px-2 py-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">{formatValue(value)}</span>
    </div>
  );
}




