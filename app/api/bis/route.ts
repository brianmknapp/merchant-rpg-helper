import {
  getBisBuilds,
  getBisDataset,
  getBisHero,
  listBisHeroes,
  queryBisEntries,
} from "@/lib/bis-guide";

// API routes are not served in a static export; this forces a single build-time
// render so `output: "export"` doesn't error. The route works normally in dev.
export const dynamic = "force-static";

const VALID_SLOTS = new Set([
  "weapon",
  "head",
  "body",
  "hands",
  "feet",
  "trinket",
  "potionPrefix",
]);

function toOptionalNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const mode = url.searchParams.get("mode") ?? "entries";
  const hero = url.searchParams.get("hero") ?? undefined;
  const tier = toOptionalNumber(url.searchParams.get("tier"));
  const slotParam = url.searchParams.get("slot") ?? undefined;
  const itemIncludes = url.searchParams.get("itemIncludes") ?? undefined;
  const buildLabelIncludes = url.searchParams.get("buildLabelIncludes") ?? undefined;
  const limit = toOptionalNumber(url.searchParams.get("limit")) ?? 50;
  const offset = toOptionalNumber(url.searchParams.get("offset")) ?? 0;

  if (slotParam && !VALID_SLOTS.has(slotParam)) {
    return Response.json(
      {
        error: "Invalid slot value.",
        validSlots: Array.from(VALID_SLOTS),
      },
      { status: 400 },
    );
  }

  if (mode === "dataset") {
    return Response.json(getBisDataset());
  }

  if (mode === "heroes") {
    return Response.json({ heroes: listBisHeroes() });
  }

  if (mode === "hero") {
    if (!hero) {
      return Response.json({ error: "hero query parameter is required for mode=hero" }, { status: 400 });
    }

    const heroData = getBisHero(hero);
    if (!heroData) {
      return Response.json({ error: `Unknown hero: ${hero}` }, { status: 404 });
    }

    return Response.json(heroData);
  }

  if (mode === "builds") {
    if (!hero) {
      return Response.json({ error: "hero query parameter is required for mode=builds" }, { status: 400 });
    }

    const builds = getBisBuilds(hero, { tier, buildLabelIncludes });
    return Response.json({
      hero,
      count: builds.length,
      builds: builds.slice(offset, offset + limit),
    });
  }

  const entries = queryBisEntries({
    hero,
    tier,
    slot: slotParam as
      | "weapon"
      | "head"
      | "body"
      | "hands"
      | "feet"
      | "trinket"
      | "potionPrefix"
      | undefined,
    itemIncludes,
  });

  return Response.json({
    count: entries.length,
    entries: entries.slice(offset, offset + limit),
  });
}

