import rawBisGuide from "@/lib/bis-guide.json";

type RawBisDataset = typeof rawBisGuide;

type SlotName =
  | "weapon"
  | "head"
  | "body"
  | "hands"
  | "feet"
  | "trinket"
  | "potionPrefix";

type BisHeroKey = keyof RawBisDataset["heroes"];
type BisHeroData = RawBisDataset["heroes"][BisHeroKey];
type BisBuild = BisHeroData["builds"][number];
type BisEntry = RawBisDataset["entries"][number];

type BuildFilter = {
  tier?: number;
  buildLabelIncludes?: string;
};

type EntryFilter = {
  hero?: string;
  tier?: number;
  slot?: SlotName;
  itemIncludes?: string;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function heroKeyFromName(hero: string): BisHeroKey | null {
  const normalizedHero = normalize(hero).replace(/[^a-z0-9]+/g, "-");
  const matchingKey = Object.keys(rawBisGuide.heroes).find(
    (key) => key === normalizedHero || normalize(rawBisGuide.heroes[key as BisHeroKey].hero) === normalize(hero),
  );

  return (matchingKey as BisHeroKey) ?? null;
}

export function getBisDataset(): RawBisDataset {
  return rawBisGuide;
}

export function listBisHeroes(): string[] {
  return Object.values(rawBisGuide.heroes).map((heroData) => heroData.hero);
}

export function getBisHero(hero: string): BisHeroData | null {
  const key = heroKeyFromName(hero);
  if (!key) return null;
  return rawBisGuide.heroes[key];
}

export function getBisBuilds(hero: string, filter: BuildFilter = {}): BisBuild[] {
  const heroData = getBisHero(hero);
  if (!heroData) return [];

  return heroData.builds.filter((build) => {
    if (typeof filter.tier === "number" && build.tier !== filter.tier) {
      return false;
    }

    if (
      filter.buildLabelIncludes &&
      !normalize(build.buildLabel).includes(normalize(filter.buildLabelIncludes))
    ) {
      return false;
    }

    return true;
  });
}

export function findBisBuild(hero: string, buildIdOrLabel: string): BisBuild | null {
  const heroData = getBisHero(hero);
  if (!heroData) return null;

  const normalizedTarget = normalize(buildIdOrLabel);
  return (
    heroData.builds.find(
      (build) => normalize(build.buildId) === normalizedTarget || normalize(build.buildLabel) === normalizedTarget,
    ) ?? null
  );
}

export function queryBisEntries(filter: EntryFilter = {}): BisEntry[] {
  return rawBisGuide.entries.filter((entry) => {
    if (filter.hero && normalize(entry.hero) !== normalize(filter.hero)) {
      return false;
    }

    if (typeof filter.tier === "number" && entry.tier !== filter.tier) {
      return false;
    }

    if (filter.slot && entry.slot !== filter.slot) {
      return false;
    }

    if (
      filter.itemIncludes &&
      !entry.items.some((item) => normalize(item).includes(normalize(filter.itemIncludes as string)))
    ) {
      return false;
    }

    return true;
  });
}

export type { BisEntry, BisBuild, SlotName };

