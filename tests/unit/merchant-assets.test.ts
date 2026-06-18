import { afterEach, describe, expect, test } from "@jest/globals";

const ORIGINAL_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;

async function loadResolverFor(basePath: string | undefined) {
  if (basePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  }

  jest.resetModules();
  const merchantAssets = await import("@/lib/merchant-assets");
  return merchantAssets.resolveMerchantAssetPath;
}

afterEach(() => {
  if (ORIGINAL_BASE_PATH === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = ORIGINAL_BASE_PATH;
  }
  jest.resetModules();
});

describe("resolveMerchantAssetPath", () => {
  test("keeps root pages unprefixed when base path is '/'", async () => {
    const resolveMerchantAssetPath = await loadResolverFor("/");

    expect(resolveMerchantAssetPath("/merchant-db/Icn_Hero_Warrior.png")).toBe(
      "/merchant-db/Icn_Hero_Warrior.png",
    );
  });

  test("normalizes configured base path and prefixes resolved assets", async () => {
    const resolveMerchantAssetPath = await loadResolverFor("merchant-rpg-helper///");

    expect(resolveMerchantAssetPath("/merchant-db/Icn_Hero_Warrior.png")).toBe(
      "/merchant-rpg-helper/merchant-db/Icn_Hero_Warrior.png",
    );
  });
});


