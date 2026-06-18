import fs from "fs";
import path from "path";

const merchantAssetPaths = new Set<string>();

function collectMerchantAssetPaths(dir: string, relativeDir = "") {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const nextRelative = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    const nextPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectMerchantAssetPaths(nextPath, nextRelative);
      continue;
    }

    merchantAssetPaths.add(encodeURI(`/merchant-db/${nextRelative.replace(/\\/g, "/")}`));
  }
}

collectMerchantAssetPaths(path.join(process.cwd(), "public", "merchant-db"));

function stripAssetPrefix(rawPath: string) {
  return rawPath
    .replace(/^\s+|\s+$/g, "")
    .replace(/^\/merchant-db\//, "")
    .replace(/^\/+/, "")
    .replace(/\.png$/i, "");
}

function withPng(relativePath: string) {
  return relativePath.endsWith(".png") ? relativePath : `${relativePath}.png`;
}

function normalizeRegionSix(relativePath: string) {
  return relativePath.replace(/\/(Region\s+6)\//, "/Region-6/");
}

function buildPathCandidates(rawPath: string) {
  const normalized = stripAssetPrefix(rawPath);
  const candidates = new Set<string>();

  if (!normalized) {
    return [];
  }

  candidates.add(withPng(normalized));

  const transformed = [
    normalized.replace(/^Weapons\//, "Items/"),
    normalized.replace(/^Armor\//, "Items/"),
    normalized.replace(/^Materials\//, "Items/"),
    normalized.replace(/^Consumables\//, "Items/"),
  ];

  for (const candidate of transformed) {
    candidates.add(withPng(candidate));
    candidates.add(withPng(normalizeRegionSix(candidate)));
  }

  return [...candidates];
}

export function resolveMerchantAssetPath(rawPath: string | null | undefined) {
  if (!rawPath) {
    return null;
  }

  for (const candidate of buildPathCandidates(rawPath)) {
    const encoded = encodeURI(`/merchant-db/${candidate}`);
    if (merchantAssetPaths.has(encoded)) {
      return encoded;
    }
  }

  return null;
}

