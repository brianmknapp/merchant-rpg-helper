import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");
const vendorRoot = path.join(repoRoot, "vendor", "MerchantGameDB-master");
const vendorImgRoot = path.join(vendorRoot, "img");
const vendorCssPath = path.join(vendorRoot, "css", "all-spritesheets.css");
const publicRoot = path.join(repoRoot, "public", "merchant-db");

const SPRITE_BASE_PREFIX = "/MerchantGameDB/img/";

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyTree(srcDir, destDir) {
  await ensureDir(destDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyTree(srcPath, destPath);
      continue;
    }

    await fs.copyFile(srcPath, destPath);
  }
}

function parseDeclarations(rawBody) {
  const declarations = {};
  for (const declaration of rawBody.split(";")) {
    const [rawKey, rawValue] = declaration.split(":");
    if (!rawKey || !rawValue) {
      continue;
    }

    declarations[rawKey.trim()] = rawValue.trim();
  }

  return declarations;
}

function parseSize(value) {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace("px", "").trim();
  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBackgroundPosition(value) {
  if (!value) {
    return undefined;
  }

  const [rawX, rawY] = value.split(/\s+/);
  if (!rawX || !rawY) {
    return undefined;
  }

  const x = Number.parseInt(rawX.replace("px", ""), 10);
  const y = Number.parseInt(rawY.replace("px", ""), 10);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return undefined;
  }

  return {
    left: Math.abs(x),
    top: Math.abs(y),
  };
}

function parseCategoryAndName(suffix) {
  const parts = suffix.split("-");

  if (parts[0] === "Region" && parts.length >= 3) {
    return {
      folder: `${parts[0]}-${parts[1]}`,
      name: parts.slice(2).join("-"),
    };
  }

  if (parts.length >= 2) {
    return {
      folder: parts[0],
      name: parts.slice(1).join("-"),
    };
  }

  return {
    folder: undefined,
    name: suffix,
  };
}

function spriteTargetPath(sheetType, className) {
  const suffix = className.replace(/^ico-(qimg|item|quest|skill)-/, "");
  const parsed = parseCategoryAndName(suffix);

  if (sheetType === "item") {
    if (!parsed.folder) {
      return path.join("Items", `${parsed.name}.png`);
    }

    return path.join("Items", parsed.folder, `${parsed.name}.png`);
  }

  if (sheetType === "skill") {
    return path.join("Skills", `${suffix}.png`);
  }

  if (sheetType === "qimg") {
    if (!parsed.folder) {
      return path.join("Enemies", "Sprites", `${parsed.name}.png`);
    }

    return path.join("Enemies", "Sprites", parsed.folder, `${parsed.name}.png`);
  }

  if (!parsed.folder) {
    return path.join("Quests", "Sprites", `${parsed.name}.png`);
  }

  return path.join("Quests", "Sprites", parsed.folder, `${parsed.name}.png`);
}

function identifySheetType(className) {
  if (className === "ico-qimg" || className.startsWith("ico-qimg-")) {
    return "qimg";
  }

  if (className === "ico-item" || className.startsWith("ico-item-")) {
    return "item";
  }

  if (className === "ico-quest" || className.startsWith("ico-quest-")) {
    return "quest";
  }

  if (className === "ico-skill" || className.startsWith("ico-skill-")) {
    return "skill";
  }

  return undefined;
}

function toLocalSpritePath(backgroundImageUrl) {
  const normalized = backgroundImageUrl.replace(/^url\((['"]?)(.*?)\1\)$/, "$2");
  if (!normalized.startsWith(SPRITE_BASE_PREFIX)) {
    return undefined;
  }

  const vendorRelative = normalized.slice(SPRITE_BASE_PREFIX.length);
  return path.join(vendorRoot, "img", vendorRelative);
}

async function extractSprites() {
  const css = await fs.readFile(vendorCssPath, "utf8");
  const rulePattern = /\.([a-zA-Z0-9_-]+)\{([^}]*)}/g;
  const defaultsByType = new Map();
  const variantRules = [];

  for (const match of css.matchAll(rulePattern)) {
    const className = match[1];
    const body = match[2];
    const declarations = parseDeclarations(body);
    const sheetType = identifySheetType(className);

    if (!sheetType) {
      continue;
    }

    const isBaseClass = className === `ico-${sheetType}`;
    if (isBaseClass) {
      defaultsByType.set(sheetType, {
        sheetPath: toLocalSpritePath(declarations["background-image"] ?? ""),
        width: parseSize(declarations.width),
        height: parseSize(declarations.height),
      });
      continue;
    }

    variantRules.push({ className, declarations, sheetType });
  }

  let extracted = 0;
  for (const rule of variantRules) {
    const defaults = defaultsByType.get(rule.sheetType);
    const sheetPath = defaults?.sheetPath;
    if (!sheetPath) {
      continue;
    }

    const position = parseBackgroundPosition(rule.declarations["background-position"]);
    const width = parseSize(rule.declarations.width) ?? defaults.width;
    const height = parseSize(rule.declarations.height) ?? defaults.height;

    if (!position || !width || !height) {
      continue;
    }

    const relativeOutputPath = spriteTargetPath(rule.sheetType, rule.className);
    const outputPath = path.join(publicRoot, relativeOutputPath);
    await ensureDir(path.dirname(outputPath));

    await sharp(sheetPath)
      .extract({
        left: position.left,
        top: position.top,
        width,
        height,
      })
      .png()
      .toFile(outputPath);

    extracted += 1;
  }

  return extracted;
}

async function cleanGeneratedSpriteDirs() {
  const generatedDirs = [
    path.join(publicRoot, "Items"),
    path.join(publicRoot, "Skills"),
    path.join(publicRoot, "Enemies", "Sprites"),
    path.join(publicRoot, "Quests", "Sprites"),
  ];

  for (const dirPath of generatedDirs) {
    await fs.rm(dirPath, { recursive: true, force: true });
  }
}

async function main() {
  await copyTree(vendorImgRoot, publicRoot);
  await cleanGeneratedSpriteDirs();
  const extractedCount = await extractSprites();

  console.log(`Copied vendor images to ${publicRoot}`);
  console.log(`Extracted ${extractedCount} sprite entries from all-spritesheets.css`);
}

main().catch((error) => {
  console.error("Failed to extract merchant images.");
  console.error(error);
  process.exitCode = 1;
});




