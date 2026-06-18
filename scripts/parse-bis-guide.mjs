import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const repoRoot = process.cwd();
const workbookPath = path.join(repoRoot, "vendor", "Jackal's Merchant BIS Guide.xlsx");
const outputPath = path.join(repoRoot, "lib", "bis-guide.json");
const normalizationPath = path.join(repoRoot, "lib", "bis-item-normalization.json");

const IGNORED_SHEETS = new Set(["Notes", "Endgame Calcs"]);
const SLOT_NAME_BY_HEADER = {
  weapon: "weapon",
  head: "head",
  body: "body",
  hands: "hands",
  feet: "feet",
  trinket: "trinket",
  potionprefix: "potionPrefix",
};

const normalization = fs.existsSync(normalizationPath)
  ? JSON.parse(fs.readFileSync(normalizationPath, "utf8"))
  : { blankValues: [], itemAliases: {}, contextualAliases: [] };

const BLANK_VALUE_SET = new Set((normalization.blankValues ?? []).map((value) => normalizeText(value)));
const ITEM_ALIASES = Object.fromEntries(
  Object.entries(normalization.itemAliases ?? {}).map(([key, value]) => [normalizeText(key), normalizeText(value)]),
);
const CONTEXTUAL_ALIASES = (normalization.contextualAliases ?? []).map((entry) => ({
  hero: normalizeText(entry.hero),
  slot: normalizeText(entry.slot),
  value: normalizeText(entry.value),
  replacement: normalizeText(entry.replacement),
}));

function normalizeText(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHeader(text) {
  return normalizeText(text).replace(/\s+/g, "").toLowerCase().replace(/[^a-z]/g, "");
}

function normalizeBisItem(hero, slot, rawItem) {
  const item = normalizeText(rawItem);
  if (!item || BLANK_VALUE_SET.has(item)) {
    return "";
  }

  const contextualAlias = CONTEXTUAL_ALIASES.find(
    (entry) => entry.hero === normalizeText(hero) && entry.slot === normalizeText(slot) && entry.value === item,
  );
  if (contextualAlias) {
    return contextualAlias.replacement;
  }

  return ITEM_ALIASES[item] ?? item;
}

function normalizeBisCell(hero, slot, rawValue) {
  const raw = normalizeText(rawValue);
  if (!raw || BLANK_VALUE_SET.has(raw)) {
    return { raw: "", items: [] };
  }

  const items = raw
    .split("/")
    .map((part) => normalizeBisItem(hero, slot, part))
    .filter(Boolean);

  return {
    raw: items.join(" / "),
    items,
  };
}

function parseTier(buildLabel) {
  const match = /tier\s*([0-9]+)/i.exec(buildLabel);
  if (!match) return null;
  return Number(match[1]);
}

function getCell(sheet, row, col) {
  const address = xlsx.utils.encode_cell({ r: row, c: col });
  return normalizeText(sheet[address]?.v);
}

function parseHeroSheet(sheetName, sheet) {
  const range = xlsx.utils.decode_range(sheet["!ref"] || "A1:A1");
  const slotColumns = [];

  for (let c = range.s.c; c <= range.e.c; c += 1) {
    const header = getCell(sheet, 0, c);
    const normalized = normalizeHeader(header);
    const slot = SLOT_NAME_BY_HEADER[normalized];
    if (slot) {
      slotColumns.push({ col: c, slot, header: normalizeText(header) });
    }
  }

  const builds = [];
  const entries = [];

  for (let r = 1; r <= range.e.r; r += 1) {
    const buildLabel = getCell(sheet, r, 0);
    if (!buildLabel || buildLabel.startsWith("*")) {
      continue;
    }

    const slots = {};
    let rowHasItem = false;

    for (const slotColumn of slotColumns) {
      const cellValue = getCell(sheet, r, slotColumn.col);
      const normalizedCell = normalizeBisCell(sheetName, slotColumn.slot, cellValue);
      const items = normalizedCell.items;
      if (items.length > 0) {
        rowHasItem = true;
      }
      slots[slotColumn.slot] = {
        raw: normalizedCell.raw,
        items,
      };
    }

    if (!rowHasItem) {
      continue;
    }

    const buildId = `${slugify(sheetName)}-${slugify(buildLabel)}`;
    const tier = parseTier(buildLabel);

    builds.push({
      buildId,
      hero: sheetName,
      buildLabel,
      tier,
      rowIndex: r + 1,
      slots,
    });

    for (const [slot, slotData] of Object.entries(slots)) {
      if (!slotData.raw) {
        continue;
      }
      entries.push({
        id: `${buildId}-${slot}`,
        hero: sheetName,
        buildId,
        buildLabel,
        tier,
        slot,
        raw: slotData.raw,
        items: slotData.items,
        rowIndex: r + 1,
      });
    }
  }

  return {
    hero: sheetName,
    slotColumns,
    builds,
    entries,
  };
}

function indexByHero(heroSheets) {
  const byHero = {};
  for (const heroSheet of heroSheets) {
    byHero[slugify(heroSheet.hero)] = {
      hero: heroSheet.hero,
      slotColumns: heroSheet.slotColumns.map((slotColumn) => ({
        slot: slotColumn.slot,
        header: slotColumn.header,
        col: xlsx.utils.encode_col(slotColumn.col),
      })),
      builds: heroSheet.builds,
    };
  }
  return byHero;
}

function indexByTier(entries) {
  const byTier = {};
  for (const entry of entries) {
    const tierKey = entry.tier === null ? "unknown" : String(entry.tier);
    if (!byTier[tierKey]) {
      byTier[tierKey] = [];
    }
    byTier[tierKey].push(entry);
  }
  return byTier;
}

if (!fs.existsSync(workbookPath)) {
  console.error(`BIS workbook not found: ${workbookPath}`);
  process.exit(1);
}

const workbook = xlsx.readFile(workbookPath);
const heroSheetNames = workbook.SheetNames.filter((name) => !IGNORED_SHEETS.has(name));
const heroSheets = [];
const allEntries = [];

for (const sheetName of heroSheetNames) {
  const parsed = parseHeroSheet(sheetName, workbook.Sheets[sheetName]);
  heroSheets.push(parsed);
  allEntries.push(...parsed.entries);
}

const dataset = {
  metadata: {
    source: "Jackal's Merchant BIS Guide.xlsx",
    parsedAt: new Date().toISOString(),
    heroCount: heroSheetNames.length,
    buildCount: heroSheets.reduce((sum, heroSheet) => sum + heroSheet.builds.length, 0),
    entryCount: allEntries.length,
    ignoredSheets: Array.from(IGNORED_SHEETS),
    assumptions: [
      "Each hero sheet uses row 1 slot headers and column A build labels.",
      "Slash-separated values are treated as alternatives for a single slot.",
      "Rows starting with '*' are treated as notes and skipped.",
    ],
  },
  heroes: indexByHero(heroSheets),
  entries: allEntries,
  byTier: indexByTier(allEntries),
};

fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), "utf8");

console.log(
  `Parsed ${dataset.metadata.entryCount} slot entries across ${dataset.metadata.buildCount} builds from ${dataset.metadata.heroCount} hero sheets.`,
);
console.log(`Wrote ${outputPath}`);


