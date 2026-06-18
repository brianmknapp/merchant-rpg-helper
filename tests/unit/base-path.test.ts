import { describe, expect, test } from "@jest/globals";
import { normalizeBasePath } from "@/lib/base-path";

describe("normalizeBasePath", () => {
  test("returns empty string for root path", () => {
    expect(normalizeBasePath("/")).toBe("");
  });

  test("adds a leading slash and trims trailing slashes", () => {
    expect(normalizeBasePath("merchant-rpg-helper///")).toBe("/merchant-rpg-helper");
  });

  test("strips multiple leading slashes and keeps exactly one", () => {
    expect(normalizeBasePath("///merchant-rpg-helper")).toBe("/merchant-rpg-helper");
  });

  test("returns empty string for a string of only slashes", () => {
    expect(normalizeBasePath("//")).toBe("");
  });

  test("returns empty string for null or undefined", () => {
    expect(normalizeBasePath(null)).toBe("");
    expect(normalizeBasePath(undefined)).toBe("");
  });
});
