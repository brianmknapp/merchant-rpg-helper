"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GAME_MODES, type GameMode } from "@/lib/game-modes";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GameSaveSelectorProps = {
  onSelectMode: (mode: GameMode) => void;
};

export default function GameSaveSelector({ onSelectMode }: GameSaveSelectorProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Merchant Hero Hall</h1>
          <p className="text-sm text-muted-foreground">
            Select a game mode to manage your hero roster. Each game mode has its own set of heroes and equipment.
          </p>
        </div>
      </header>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Select Game Mode</CardTitle>
            <CardDescription>Choose a game mode to continue. Your heroes are saved separately for each mode.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {GAME_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onSelectMode(mode.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border px-4 py-3 text-left transition-all",
                    "border-input bg-background hover:border-primary/60 hover:bg-muted/50",
                  )}
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-tight">{mode.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{mode.description}</p>
                    </div>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

