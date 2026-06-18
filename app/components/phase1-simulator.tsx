"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type StatBlock = {
  hp: number;
  atk: number;
  matk: number;
  def: number;
  mdef: number;
  acc: number;
  crit: number;
};

type HeroScaling = {
  strToAtk: number;
  intToMatk: number;
  dexToAcc: number;
};

type HeroProgression = {
  hpPerLevel: number[];
  atkPerLevel: number[];
  matkPerLevel: number[];
  defPerLevel: number[];
  mdefPerLevel: number[];
  accPerLevel: number[];
  critPerLevel: number[];
  strToAtkByPrestige: number[];
  intToMatkByPrestige: number[];
  dexToAccByPrestige: number[];
};

type HeroAttributes = {
  str: number;
  int: number;
  dex: number;
};

type GearSlot = "weapon" | "head" | "body" | "hands" | "feet" | "trinket";

type GearQuality = "D" | "C" | "B" | "A" | "S";

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

export type GearItem = {
  id: number;
  name: string;
  slot: GearSlot;
  tier: number;
  level: number;
  rarity: number;
  imagePath: string | null;
  bonus: GearBonus;
};

export type Hero = {
  id: number;
  name: string;
  level: number;
  stats: StatBlock;
  scaling: HeroScaling;
  progression: HeroProgression;
  iconPath: string;
};

export type Quest = {
  id: number;
  name: string;
  title: string;
  region: number;
  levelReq: number;
  enemy: {
    hp: number;
    atk: number;
    matk: number;
    def: number;
    mdef: number;
    eva: number;
  };
  iconPath: string | null;
  enemyImagePath: string | null;
};

type Phase1SimulatorProps = {
  heroes: Hero[];
  quests: Quest[];
  gearItems: GearItem[];
};

const GEAR_SLOT_LABELS: Record<GearSlot, string> = {
  weapon: "Weapon",
  head: "Head",
  body: "Body",
  hands: "Hands",
  feet: "Feet",
  trinket: "Trinket",
};

const EMPTY_BONUS: GearBonus = {
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
};

const DEFAULT_ATTRIBUTES: HeroAttributes = {
  str: 0,
  int: 0,
  dex: 0,
};

const QUALITY_MULTIPLIER: Record<GearQuality, number> = {
  D: 0.9,
  C: 1,
  B: 1.1,
  A: 1.2,
  S: 1.5,
};

const QUALITY_LABELS: Record<GearQuality, string> = {
  D: "D (x0.9)",
  C: "C (x1.0)",
  B: "B (x1.1)",
  A: "A (x1.2)",
  S: "S (x1.5)",
};

type EquippedSlot = {
  itemId: number | null;
  quality: GearQuality;
};

const DEFAULT_EQUIPPED_SLOTS: Record<GearSlot, EquippedSlot> = {
  weapon: { itemId: null, quality: "S" },
  head: { itemId: null, quality: "S" },
  body: { itemId: null, quality: "S" },
  hands: { itemId: null, quality: "S" },
  feet: { itemId: null, quality: "S" },
  trinket: { itemId: null, quality: "S" },
};

function scaleGearBonus(bonus: GearBonus, multiplier: number): GearBonus {
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

function applyPercent(base: number, percent: number) {
  return Math.round(base * (1 + percent / 100));
}

export function Phase1Simulator({ heroes, quests, gearItems }: Phase1SimulatorProps) {
  const [selectedHeroId, setSelectedHeroId] = useState<number>(heroes[0]?.id ?? 0);
  const [selectedQuestId, setSelectedQuestId] = useState<number>(quests[0]?.id ?? 0);
  const [selectedGearBySlot, setSelectedGearBySlot] = useState<Record<GearSlot, EquippedSlot>>(DEFAULT_EQUIPPED_SLOTS);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [activeEquipmentSlot, setActiveEquipmentSlot] = useState<GearSlot>("weapon");
  const [attributes, setAttributes] = useState<HeroAttributes>(DEFAULT_ATTRIBUTES);
  const [questIconMissing, setQuestIconMissing] = useState(false);
  const [enemyIconMissing, setEnemyIconMissing] = useState(false);
  const [heroIconMissing, setHeroIconMissing] = useState(false);

  const selectedHero = useMemo(
    () => heroes.find((hero) => hero.id === selectedHeroId) ?? heroes[0] ?? null,
    [heroes, selectedHeroId],
  );

  const selectedQuest = useMemo(
    () => quests.find((quest) => quest.id === selectedQuestId) ?? quests[0] ?? null,
    [quests, selectedQuestId],
  );

  const gearBySlot = useMemo(() => {
    const bySlot: Record<GearSlot, GearItem[]> = {
      weapon: [],
      head: [],
      body: [],
      hands: [],
      feet: [],
      trinket: [],
    };

    for (const gear of gearItems) {
      bySlot[gear.slot].push(gear);
    }

    for (const slot of Object.keys(bySlot) as GearSlot[]) {
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

    for (const slot of Object.keys(selectedGearBySlot) as GearSlot[]) {
      const selectedId = selectedGearBySlot[slot].itemId;
      if (selectedId === null) {
        continue;
      }
      result[slot] = gearItems.find((gear) => gear.id === selectedId) ?? null;
    }

    return result;
  }, [selectedGearBySlot, gearItems]);

  const totalGearBonus = useMemo(() => {
    const total = { ...EMPTY_BONUS };

    for (const slot of Object.keys(selectedGear) as GearSlot[]) {
      const item = selectedGear[slot];
      if (!item) continue;
      const qualityMultiplier = QUALITY_MULTIPLIER[selectedGearBySlot[slot].quality];
      const scaledBonus = scaleGearBonus(item.bonus, qualityMultiplier);
      total.hp += scaledBonus.hp;
      total.atk += scaledBonus.atk;
      total.matk += scaledBonus.matk;
      total.def += scaledBonus.def;
      total.mdef += scaledBonus.mdef;
      total.acc += scaledBonus.acc;
      total.crit += scaledBonus.crit;
      total.str += scaledBonus.str;
      total.int += scaledBonus.int;
      total.dex += scaledBonus.dex;
      total.lck += scaledBonus.lck;
      total.speed += scaledBonus.speed;
      total.exp += scaledBonus.exp;
      total.ap += scaledBonus.ap;
      total.critDmg += scaledBonus.critDmg;
      total.hpPct += scaledBonus.hpPct;
      total.atkPct += scaledBonus.atkPct;
      total.matkPct += scaledBonus.matkPct;
      total.defPct += scaledBonus.defPct;
      total.mdefPct += scaledBonus.mdefPct;
      total.accPct += scaledBonus.accPct;
      total.gold += scaledBonus.gold;
    }

    return total;
  }, [selectedGear, selectedGearBySlot]);

  const computedHeroStats = useMemo(() => {
    if (!selectedHero) {
      return null;
    }

    const totalStr = attributes.str + totalGearBonus.str;
    const totalInt = attributes.int + totalGearBonus.int;
    const totalDex = attributes.dex + totalGearBonus.dex;

    const baseHp = selectedHero.stats.hp + totalGearBonus.hp;
    const baseAtk = selectedHero.stats.atk + totalGearBonus.atk + totalStr * selectedHero.scaling.strToAtk;
    const baseMatk = selectedHero.stats.matk + totalGearBonus.matk + totalInt * selectedHero.scaling.intToMatk;
    const baseDef = selectedHero.stats.def + totalGearBonus.def;
    const baseMdef = selectedHero.stats.mdef + totalGearBonus.mdef;
    const baseAcc = selectedHero.stats.acc + totalGearBonus.acc + totalDex * selectedHero.scaling.dexToAcc;

    return {
      hp: applyPercent(baseHp, totalGearBonus.hpPct),
      atk: applyPercent(baseAtk, totalGearBonus.atkPct),
      matk: applyPercent(baseMatk, totalGearBonus.matkPct),
      def: applyPercent(baseDef, totalGearBonus.defPct),
      mdef: applyPercent(baseMdef, totalGearBonus.mdefPct),
      acc: applyPercent(baseAcc, totalGearBonus.accPct),
      crit: selectedHero.stats.crit + totalGearBonus.crit,
      str: totalStr,
      int: totalInt,
      dex: totalDex,
      lck: totalGearBonus.lck,
      speed: totalGearBonus.speed,
      ap: totalGearBonus.ap,
      exp: totalGearBonus.exp,
      critDmg: totalGearBonus.critDmg,
      gold: totalGearBonus.gold,
    };
  }, [selectedHero, attributes, totalGearBonus]);

  const selectedTier = selectedQuest?.region ?? null;
  const activeSlotItem = selectedGear[activeEquipmentSlot];

  const handleAttributeChange = (key: keyof HeroAttributes, value: string) => {
    const parsed = Number(value);
    setAttributes((prev) => ({
      ...prev,
      [key]: Number.isFinite(parsed) ? parsed : 0,
    }));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Merchant RPG Combat Simulator</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Phase 1: pick one hero and one quest enemy. Hero uses level 1 base stats and optional loadout stats.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hero-select">Hero</Label>
          <Select
            value={String(selectedHero?.id ?? "")}
            onValueChange={(value) => {
              setHeroIconMissing(false);
              setSelectedHeroId(Number(value));
            }}
          >
            <SelectTrigger id="hero-select">
              <SelectValue placeholder="Select a hero" />
            </SelectTrigger>
            <SelectContent>
              {heroes.map((hero) => (
                <SelectItem key={hero.id} value={String(hero.id)}>
                  {hero.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quest-select">Quest Enemy</Label>
          <Select
            value={String(selectedQuest?.id ?? "")}
            onValueChange={(value) => {
              setQuestIconMissing(false);
              setEnemyIconMissing(false);
              setSelectedQuestId(Number(value));
            }}
          >
            <SelectTrigger id="quest-select">
              <SelectValue placeholder="Select a quest" />
            </SelectTrigger>
            <SelectContent>
              {quests.map((quest) => (
                <SelectItem key={quest.id} value={String(quest.id)}>
                  {quest.name} (Lv {quest.levelReq})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hero Equipment</CardTitle>
            <CardDescription>
              Each slot has its own item and quality. Click Edit Equipment to manage loadout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(GEAR_SLOT_LABELS) as GearSlot[]).map((slot) => {
              const equipped = selectedGearBySlot[slot];
              const equippedItem = selectedGear[slot];
              return (
                <div key={slot} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <p className="font-medium">{GEAR_SLOT_LABELS[slot]}</p>
                  <p className="text-xs text-muted-foreground">
                    {equippedItem ? `${equippedItem.name} (T${equippedItem.tier})` : "None"}
                  </p>
                  <p className="text-xs text-muted-foreground">Quality: {equipped.quality}</p>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsEquipmentModalOpen(true)}
            >
              Edit Equipment
            </Button>

            {selectedTier !== null ? (
              <p className="text-xs text-muted-foreground">
                Selected quest region: {selectedTier}. Matching gear often aligns with tier {selectedTier}.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
            <CardDescription>
              Attributes convert using hero scaling (STR→ATK, INT→MATK, DEX→ACC).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="attr-str">STR</Label>
              <Input
                id="attr-str"
                type="number"
                value={attributes.str}
                onChange={(event) => handleAttributeChange("str", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attr-int">INT</Label>
              <Input
                id="attr-int"
                type="number"
                value={attributes.int}
                onChange={(event) => handleAttributeChange("int", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attr-dex">DEX</Label>
              <Input
                id="attr-dex"
                type="number"
                value={attributes.dex}
                onChange={(event) => handleAttributeChange("dex", event.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Selected Hero</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              Level 1 base stats + equipment + entered attributes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedHero ? (
              <>
                {!heroIconMissing ? (
                  <Image
                    src={selectedHero.iconPath}
                    alt={`${selectedHero.name} icon`}
                    width={72}
                    height={72}
                    onError={() => setHeroIconMissing(true)}
                  />
                ) : (
                  <div className="text-sm text-zinc-500">Hero icon unavailable</div>
                )}
                <div>
                  <p className="text-sm font-semibold">{selectedHero.name}</p>
                  <p className="text-xs text-zinc-500">Level {selectedHero.level}</p>
                </div>
                {computedHeroStats ? (
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>STR scaling: {selectedHero.scaling.strToAtk} ATK</div>
                    <div>INT scaling: {selectedHero.scaling.intToMatk} MATK</div>
                    <div>DEX scaling: {selectedHero.scaling.dexToAcc} ACC</div>
                  </div>
                ) : null}
                <div className="grid grid-cols-2 gap-2">
                  <StatLine label="HP" value={computedHeroStats?.hp ?? selectedHero.stats.hp} />
                  <StatLine label="ATK" value={computedHeroStats?.atk ?? selectedHero.stats.atk} />
                  <StatLine label="MATK" value={computedHeroStats?.matk ?? selectedHero.stats.matk} />
                  <StatLine label="DEF" value={computedHeroStats?.def ?? selectedHero.stats.def} />
                  <StatLine label="MDEF" value={computedHeroStats?.mdef ?? selectedHero.stats.mdef} />
                  <StatLine label="ACC" value={computedHeroStats?.acc ?? selectedHero.stats.acc} />
                  <StatLine label="CRIT" value={computedHeroStats?.crit ?? selectedHero.stats.crit} />
                  <StatLine label="STR" value={computedHeroStats?.str ?? attributes.str} />
                  <StatLine label="INT" value={computedHeroStats?.int ?? attributes.int} />
                  <StatLine label="DEX" value={computedHeroStats?.dex ?? attributes.dex} />
                  <StatLine label="LUCK" value={computedHeroStats?.lck ?? 0} />
                  <StatLine label="SPEED" value={computedHeroStats?.speed ?? 0} />
                  <StatLine label="AP" value={computedHeroStats?.ap ?? 0} />
                  <StatLine label="XP%" value={computedHeroStats?.exp ?? 0} />
                  <StatLine label="CDMG%" value={computedHeroStats?.critDmg ?? 0} />
                </div>
              </>
            ) : (
              <p className="text-sm text-red-600">No hero data found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Quest Enemy</CardTitle>
            {selectedQuest && (
              <CardDescription>
                {selectedQuest.name} • Region {selectedQuest.region}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedQuest ? (
              <>
                <div className="flex gap-3">
                  {!questIconMissing && selectedQuest.iconPath ? (
                    <Image
                      src={selectedQuest.iconPath}
                      alt={`${selectedQuest.name} quest icon`}
                      width={64}
                      height={64}
                      onError={() => setQuestIconMissing(true)}
                    />
                  ) : null}
                  {!enemyIconMissing && selectedQuest.enemyImagePath ? (
                    <Image
                      src={selectedQuest.enemyImagePath}
                      alt={`${selectedQuest.name} enemy portrait`}
                      width={64}
                      height={64}
                      onError={() => setEnemyIconMissing(true)}
                    />
                  ) : null}
                  {questIconMissing && enemyIconMissing ? (
                    <div className="text-sm text-zinc-500">Enemy image unavailable</div>
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-semibold">{selectedQuest.name}</p>
                  <p className="text-xs text-zinc-500">
                    {selectedQuest.title} • Lv {selectedQuest.levelReq}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <StatLine label="HP" value={selectedQuest.enemy.hp} />
                  <StatLine label="ATK" value={selectedQuest.enemy.atk} />
                  <StatLine label="MATK" value={selectedQuest.enemy.matk} />
                  <StatLine label="DEF" value={selectedQuest.enemy.def} />
                  <StatLine label="MDEF" value={selectedQuest.enemy.mdef} />
                  <StatLine label="EVA" value={selectedQuest.enemy.eva} />
                </div>
              </>
            ) : (
              <p className="text-sm text-red-600">No quest data found.</p>
            )}
          </CardContent>
        </Card>
      </section>

      {isEquipmentModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-xl border border-input bg-background p-4 shadow-lg">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Hero Equipment</h2>
                <p className="text-sm text-muted-foreground">Click a slot to edit only that slot&apos;s item and grade.</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => setIsEquipmentModalOpen(false)}>
                Close
              </Button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(GEAR_SLOT_LABELS) as GearSlot[]).map((slot) => {
                const item = selectedGear[slot];
                const quality = selectedGearBySlot[slot].quality;
                const isActive = slot === activeEquipmentSlot;

                return (
                  <button
                    key={slot}
                    type="button"
                    className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-input bg-background hover:border-primary/40 hover:bg-muted/30"
                    }`}
                    onClick={() => setActiveEquipmentSlot(slot)}
                  >
                    <p className="font-medium">{GEAR_SLOT_LABELS[slot]}</p>
                    <p className="text-xs text-muted-foreground">{item ? `${item.name} (T${item.tier})` : "None"}</p>
                    <p className="text-xs text-muted-foreground">Quality: {quality}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-3 rounded-md border border-input bg-muted/20 p-3">
              <p className="text-sm font-medium">Editing {GEAR_SLOT_LABELS[activeEquipmentSlot]}</p>
              <div className="space-y-2">
                <Label htmlFor={`modal-slot-${activeEquipmentSlot}`}>Item</Label>
                <Select
                  value={
                    selectedGearBySlot[activeEquipmentSlot].itemId === null
                      ? "none"
                      : String(selectedGearBySlot[activeEquipmentSlot].itemId)
                  }
                  onValueChange={(value) => {
                    setSelectedGearBySlot((prev) => ({
                      ...prev,
                      [activeEquipmentSlot]: {
                        ...prev[activeEquipmentSlot],
                        itemId: value === "none" ? null : Number(value),
                      },
                    }));
                  }}
                >
                  <SelectTrigger id={`modal-slot-${activeEquipmentSlot}`} className="w-full">
                    <SelectValue placeholder={`Select ${activeEquipmentSlot}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {gearBySlot[activeEquipmentSlot].map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name} (T{item.tier})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`modal-quality-${activeEquipmentSlot}`}>Quality</Label>
                <Select
                  value={selectedGearBySlot[activeEquipmentSlot].quality}
                  onValueChange={(value) => {
                    setSelectedGearBySlot((prev) => ({
                      ...prev,
                      [activeEquipmentSlot]: {
                        ...prev[activeEquipmentSlot],
                        quality: value as GearQuality,
                      },
                    }));
                  }}
                >
                  <SelectTrigger id={`modal-quality-${activeEquipmentSlot}`} className="w-full">
                    <SelectValue placeholder="Select quality" />
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

              {activeSlotItem ? (
                <p className="text-xs text-muted-foreground">
                  Selected: {activeSlotItem.name} ({GEAR_SLOT_LABELS[activeEquipmentSlot]})
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">No item equipped in this slot.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function StatLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-input bg-background px-2 py-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}


