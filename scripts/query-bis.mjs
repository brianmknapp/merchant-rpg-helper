import fs from "node:fs";
import path from "node:path";

const datasetPath = path.join(process.cwd(), "lib", "bis-guide.json");
const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf8"));

const args = process.argv.slice(2);
const options = {
  hero: null,
  tier: null,
  slot: null,
};

for (const arg of args) {
  if (arg.startsWith("--hero=")) {
    options.hero = arg.slice("--hero=".length);
  } else if (arg.startsWith("--tier=")) {
    options.tier = Number(arg.slice("--tier=".length));
  } else if (arg.startsWith("--slot=")) {
    options.slot = arg.slice("--slot=".length);
  }
}

const results = dataset.entries.filter((entry) => {
  if (options.hero && entry.hero.toLowerCase() !== options.hero.toLowerCase()) {
    return false;
  }

  if (typeof options.tier === "number" && !Number.isNaN(options.tier) && entry.tier !== options.tier) {
    return false;
  }

  if (options.slot && entry.slot !== options.slot) {
    return false;
  }

  return true;
});

console.log(JSON.stringify({
  metadata: dataset.metadata,
  filters: options,
  count: results.length,
  results: results.slice(0, 40),
}, null, 2));

