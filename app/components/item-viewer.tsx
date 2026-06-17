"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AffixOption,
  GradeOption,
  ItemDisplay,
  StatRange,
} from "@/lib/item-data";

type PrestigeLevel = 0 | 1 | 2;

type ItemViewerProps = {
  items: ItemDisplay[];
  grades: GradeOption[];
  prefixes: AffixOption[];
  suffixes: AffixOption[];
  initialItemId?: number;
  initialGradeId?: string;
  initialPrefixId?: string;
  initialSuffixId?: string;
  initialPrestige?: PrestigeLevel;
};

type StatGroup = Record<string, StatRange>;

const PRESTIGE_LABELS: Record<PrestigeLevel, string> = {
  0: "Base",
  1: "P1",
  2: "P2",
};

const PRESTIGE_MULTIPLIERS: Record<PrestigeLevel, number> = {
  0: 1,
  1: 1.5,
  2: 2,
};

const COMBAT_PREFIX_MAP: Record<string, keyof ItemDisplay["baseStats"]> = {
  hpBns: "hp",
  atkBns: "atk",
  matkBns: "matk",
  defBns: "def",
  mdefBns: "mdef",
  accBns: "acc",
  critBns: "crit",
};

const COMBAT_BONUS_KEYS = Object.keys(COMBAT_PREFIX_MAP) as Array<keyof typeof COMBAT_PREFIX_MAP>;

const EXTRA_PREFIX_MAP: Record<string, string> = {
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

const EXTRA_LABELS: Record<string, string> = {
  atkBns: "Atk",
  matkBns: "Matk",
  defBns: "Def",
  mdefBns: "MDef",
  accBns: "Acc",
  hpBns: "HP",
  critBns: "Crit",
  str: "Str",
  int: "Int",
  dex: "Dex",
  lck: "Lck",
  speed: "Speed",
  exp: "Exp",
  ap: "AP",
  critDmg: "Crit Dmg",
  hpPct: "HP %",
  atkPct: "Atk %",
  matkPct: "Matk %",
  defPct: "Def %",
  mdefPct: "MDef %",
  accPct: "Acc %",
  gold: "Gold",
};

function cloneRanges<T extends StatGroup>(ranges: T): T {
  return Object.fromEntries(
    Object.entries(ranges).map(([key, value]) => [key, { min: value.min, max: value.max }]),
  ) as T;
}

function scaleRange(range: StatRange, multiplier: number) {
  return {
    min: range.min * multiplier,
    max: range.max * multiplier,
  };
}

function addRange(range: StatRange, amount: number) {
  return {
    min: range.min + amount,
    max: range.max + amount,
  };
}

function multiplyRange(range: StatRange, multiplier: number) {
  return {
    min: range.min * multiplier,
    max: range.max * multiplier,
  };
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function formatRange(range: StatRange) {
  const min = Math.round(range.min);
  const max = Math.round(range.max);
  return min === max ? formatNumber(min) : `${formatNumber(min)} - ${formatNumber(max)}`;
}

function formatValueRange(range: StatRange) {
  return `${formatNumber(range.min)} - ${formatNumber(range.max)}`;
}

function sumAffixStats(option: AffixOption | undefined) {
  return option?.stats ?? {};
}

function getSelected<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

function getSelectedItemId(items: ItemDisplay[], value: string | null) {
  if (value === null) {
    return null;
  }

  const parsed = Number(value);
  return items.some((item) => item.id === parsed) ? parsed : items[0]?.id ?? 0;
}

function getSelectedOptionId<T extends { id: string }>(items: T[], value: string | null, fallback: string) {
  if (value === null) {
    return null;
  }

  if (value === "0") {
    return "0";
  }

  return getSelected(items, value)?.id ?? fallback;
}

function getSelectedPrestige(value: string | null, fallback: PrestigeLevel) {
  if (value === null) {
    return null;
  }

  const parsed = Number(value);
  return parsed === 0 || parsed === 1 || parsed === 2 ? (parsed as PrestigeLevel) : fallback;
}

export function ItemViewer({
  items,
  grades,
  prefixes,
  suffixes,
  initialItemId,
  initialGradeId = grades[0]?.id ?? "0",
  initialPrefixId = "0",
  initialSuffixId = "0",
  initialPrestige = 0,
}: ItemViewerProps) {
  const initialItem =
    items.find((item) => item.id === initialItemId) ?? items[0] ?? null;

  const [selectedItemId, setSelectedItemId] = useState<number>(initialItem?.id ?? 0);
  const [selectedGradeId, setSelectedGradeId] = useState(initialGradeId);
  const [selectedPrefixId, setSelectedPrefixId] = useState(initialPrefixId);
  const [selectedSuffixId, setSelectedSuffixId] = useState(initialSuffixId);
  const [selectedPrestige, setSelectedPrestige] = useState<PrestigeLevel>(initialPrestige);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const nextItemId = getSelectedItemId(items, params.get("item"));
    const nextGradeId = getSelectedOptionId(grades, params.get("grade"), grades[0]?.id ?? "0");
    const nextPrefixId = getSelectedOptionId(prefixes, params.get("prefix"), "0");
    const nextSuffixId = getSelectedOptionId(suffixes, params.get("suffix"), "0");
    const nextPrestige = getSelectedPrestige(params.get("prestige"), initialPrestige);

    if (nextItemId !== null) {
      setSelectedItemId(nextItemId);
    }

    if (nextGradeId !== null) {
      setSelectedGradeId(nextGradeId);
    }

    if (nextPrefixId !== null) {
      setSelectedPrefixId(nextPrefixId);
    }

    if (nextSuffixId !== null) {
      setSelectedSuffixId(nextSuffixId);
    }

    if (nextPrestige !== null) {
      setSelectedPrestige(nextPrestige);
    }
  }, [grades, initialPrestige, items, prefixes, suffixes]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? items[0];
  const selectedGrade = getSelected(grades, selectedGradeId) ?? grades[0];
  const selectedPrefix = selectedPrefixId === "0" ? undefined : getSelected(prefixes, selectedPrefixId);
  const selectedSuffix = selectedSuffixId === "0" ? undefined : getSelected(suffixes, selectedSuffixId);

  const calculated = useMemo(() => {
    if (!selectedItem || !selectedGrade) {
      return null;
    }

    const gradeMin = selectedGrade.min;
    const gradeMax = selectedGrade.max;
    const prestigeMultiplier = PRESTIGE_MULTIPLIERS[selectedPrestige];
    const prefixStats = sumAffixStats(selectedPrefix);
    const suffixStats = sumAffixStats(selectedSuffix);

    const combat = cloneRanges(selectedItem.baseStats);
    const extra = cloneRanges(selectedItem.extraStats as StatGroup);

    // Item bonus combat ranges (e.g. atkBns/critBns) should be part of core combat stats.
    COMBAT_BONUS_KEYS.forEach((bonusKey) => {
      const bonusRange = extra[bonusKey];
      if (!bonusRange) {
        return;
      }

      const combatKey = COMBAT_PREFIX_MAP[bonusKey];
      combat[combatKey] = {
        min: combat[combatKey].min + bonusRange.min,
        max: combat[combatKey].max + bonusRange.max,
      };

      delete extra[bonusKey];
    });

    const combatKeys = Object.keys(combat) as Array<keyof ItemDisplay["baseStats"]>;
    combatKeys.forEach((key) => {
      combat[key] = scaleRange(combat[key], gradeMin);
      combat[key] = scaleRange(combat[key], prestigeMultiplier);
    });

    const extraKeys = Object.keys(extra) as Array<keyof StatGroup>;
    extraKeys.forEach((key) => {
      extra[key] = scaleRange(extra[key], gradeMin);
      extra[key] = scaleRange(extra[key], prestigeMultiplier);
    });

    Object.entries(prefixStats).forEach(([key, value]) => {
      if (key in COMBAT_PREFIX_MAP) {
        const combatKey = COMBAT_PREFIX_MAP[key];
        combat[combatKey] = addRange(combat[combatKey], value);
        return;
      }

      const extraKey = EXTRA_PREFIX_MAP[key] ?? key;
      if (extraKey in extra) {
        extra[extraKey] = addRange(extra[extraKey], value);
      } else {
        extra[extraKey] = { min: value, max: value };
      }
    });

    Object.entries(suffixStats).forEach(([key, value]) => {
      if (key in combat) {
        const combatKey = key as keyof ItemDisplay["baseStats"];
        combat[combatKey] = multiplyRange(combat[combatKey], 1 + value);
      }
    });

    const valueMultiplier = (1 + (selectedPrefix?.sell ?? 0) + (selectedSuffix?.sell ?? 0)) * prestigeMultiplier;
    const value = {
      min: selectedItem.baseValue * gradeMin * valueMultiplier,
      max: selectedItem.baseValue * gradeMax * valueMultiplier,
    };

    return {
      combat,
      extra,
      value,
      prestigeMultiplier,
    };
  }, [selectedGrade, selectedItem, selectedPrefix, selectedPrestige, selectedSuffix]);

  const displayName = useMemo(() => {
    if (!selectedItem) {
      return "Item";
    }

    const prefix = selectedPrefix?.name ? `${selectedPrefix.name} ` : "";
    const suffix = selectedSuffix?.name ? ` ${selectedSuffix.name}` : "";
    return `${prefix}${selectedItem.name}${suffix}`;
  }, [selectedItem, selectedPrefix, selectedSuffix]);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    params.set("item", String(selectedItemId));
    params.set("grade", selectedGradeId);
    params.set("prefix", selectedPrefixId);
    params.set("suffix", selectedSuffixId);
    params.set("prestige", String(selectedPrestige));
    return `/items?${params.toString()}`;
  }, [selectedItemId, selectedGradeId, selectedPrefixId, selectedSuffixId, selectedPrestige]);

  const copyUrl = async () => {
    if (typeof window === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(`${window.location.origin}${url}`);
  };

  if (!selectedItem || !calculated || !selectedGrade) {
    return null;
  }

  const combatLabels: Array<[keyof ItemDisplay["baseStats"], string]> = [
    ["hp", "HP"],
    ["atk", "Physical Attack"],
    ["matk", "Magical Attack"],
    ["def", "Defense"],
    ["mdef", "Magic Defense"],
    ["acc", "Accuracy"],
    ["crit", "Crit"],
  ];

  const extraEntries = Object.entries(calculated.extra).filter(([, value]) => value.min !== 0 || value.max !== 0);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start">
      <Card className="w-full max-w-xs p-4 lg:sticky lg:top-4">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item</Label>
            <Select value={String(selectedItemId)} onValueChange={(value) => setSelectedItemId(Number(value))}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade</Label>
            <Select value={selectedGradeId} onValueChange={setSelectedGradeId}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suffix</Label>
            <Select value={selectedSuffixId} onValueChange={setSelectedSuffixId}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                {suffixes.map((suffix) => (
                  <SelectItem key={suffix.id} value={suffix.id}>
                    {suffix.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prefix</Label>
            <Select value={selectedPrefixId} onValueChange={setSelectedPrefixId}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                {prefixes.map((prefix) => (
                  <SelectItem key={prefix.id} value={prefix.id}>
                    {prefix.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prestige</Label>
            <Select value={String(selectedPrestige)} onValueChange={(value) => setSelectedPrestige(Number(value) as PrestigeLevel)}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Base" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Base</SelectItem>
                <SelectItem value="1">P1</SelectItem>
                <SelectItem value="2">P2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-2">
            <Button className="w-full" onClick={copyUrl}>
              Copy URL
            </Button>
            <Input readOnly value={url} />
          </div>
        </div>
      </Card>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <Card className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
            <div className="flex flex-col items-start gap-2">
              <div className="relative h-20 w-20 overflow-hidden rounded border-2 border-amber-700 bg-muted">
                {selectedItem.imagePath ? (
                  <Image
                    src={selectedItem.imagePath}
                    alt={selectedItem.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                ) : null}
              </div>
              <div className="rounded bg-fuchsia-600 px-2 py-0.5 text-xs font-semibold text-white">{selectedItem.rarity}</div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-amber-700">{displayName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.slot} - {selectedItem.subType}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Level {selectedItem.level}</p>
                </div>

                <div className="text-right text-sm text-muted-foreground">
                  <div>Tier {selectedItem.tier}</div>
                  <div>Prestige {PRESTIGE_LABELS[selectedPrestige]}</div>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-base">
                {combatLabels.map(([key, label]) => (
                  <p key={key} className="flex justify-between gap-4 border-b border-dotted border-border pb-1 last:border-b-0">
                    <span>{label}</span>
                    <span className="font-medium">{formatRange(calculated.combat[key])}</span>
                  </p>
                ))}
              </div>

              <div className="mt-4 border-t pt-3 text-right text-sm text-muted-foreground">
                <span className="mr-2 font-medium text-foreground">Value</span>
                <span>{formatValueRange(calculated.value)}</span>
              </div>

              {selectedPrefix?.name ? (
                <div className="mt-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                  Prefix applied: {selectedPrefix.name}
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="border-b pb-2 text-center text-sm text-muted-foreground">Additional Stats</div>
          <div className="grid gap-2 pt-3 sm:grid-cols-2">
            {extraEntries.length > 0 ? (
              extraEntries.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 rounded bg-muted/40 px-3 py-2 text-sm">
                  <span>{EXTRA_LABELS[key] ?? key}</span>
                  <span className="font-medium">{formatRange(value)}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No additional stats.</div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-lg font-semibold">Weapon Recipe</h3>
          <div className="overflow-hidden rounded border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-3 py-2">Item Name</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-3 py-2 font-semibold">Gold</td>
                  <td className="px-3 py-2 text-right">{selectedItem.recipe.gold}</td>
                </tr>
                {selectedItem.recipe.materials.map((material) => (
                  <tr key={material.name} className="border-t">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded bg-muted">
                          {material.imagePath ? (
                            <Image
                              src={material.imagePath}
                              alt={material.name}
                              fill
                              sizes="24px"
                              className="object-contain p-0.5"
                            />
                          ) : null}
                        </div>
                        <span className="font-medium">{material.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">{material.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>Crafting time: {selectedItem.recipe.craftTime}s</span>
            <span>Experience: {selectedItem.recipe.experience}</span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">Merchant-style item information for {selectedItem.name}.</p>
        </Card>
      </div>
    </div>
  );
}

export default ItemViewer;




