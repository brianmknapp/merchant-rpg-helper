"use client";

import { useState } from "react";
import type { GearItem, Hero } from "@/app/components/phase1-simulator";
import HeroRosterSimulator from "@/app/components/hero-roster-simulator";
import GameSaveSelector from "@/app/components/game-save-selector";
import type { GameMode } from "@/lib/game-modes";
import type { BisEntrySuggestion } from "@/app/components/hero-roster-simulator";

type HeroRosterPageProps = {
  heroes: Hero[];
  gearItems: GearItem[];
  bisEntries: BisEntrySuggestion[];
  prefixOptions: Array<{ id: string; name: string; stats: Record<string, number>; ascLevel: number | null }>;
  suffixOptions: Array<{ id: string; name: string; stats: Record<string, number>; ascLevel: number | null }>;
};

export default function HeroRosterPage({
  heroes,
  gearItems,
  bisEntries,
  prefixOptions,
  suffixOptions,
}: HeroRosterPageProps) {
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);

  if (!selectedGameMode) {
    return <GameSaveSelector onSelectMode={setSelectedGameMode} />;
  }

  return (
    <HeroRosterSimulator
      heroes={heroes}
      gearItems={gearItems}
      bisEntries={bisEntries}
      prefixOptions={prefixOptions}
      suffixOptions={suffixOptions}
      gameMode={selectedGameMode}
      onBackClick={() => setSelectedGameMode(null)}
    />
  );
}


