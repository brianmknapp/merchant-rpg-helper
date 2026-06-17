/** @jest-environment node */

import { describe, expect, test } from "@jest/globals";
import { GET } from "@/app/api/bis/route";

describe("GET /api/bis", () => {
  test("rejects unsupported slot names with a 400 response", async () => {
    const response = await GET(new Request("http://localhost/api/bis?slot=ring"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: "Invalid slot value.",
      validSlots: ["weapon", "head", "body", "hands", "feet", "trinket", "potionPrefix"],
    });
  });

  test("returns filtered BIS entries for a real hero, tier, and slot combination", async () => {
    const response = await GET(
      new Request("http://localhost/api/bis?hero=Warrior&tier=6&slot=weapon&itemIncludes=Taurus"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.count).toBe(1);
    expect(payload.entries).toEqual([
      expect.objectContaining({
        id: "warrior-tier-6-optimal-weapon",
        hero: "Warrior",
        tier: 6,
        slot: "weapon",
        items: ["Taurus' Hammer"],
      }),
    ]);
  });
});


