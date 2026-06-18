export type GameMode =
  | "standard"
  | "speedrun"
  | "hard-enemies"
  | "super-customers"
  | "epic-crafters"
  | "legendary";

export const GAME_MODES: Array<{ id: GameMode; name: string; description: string }> = [
  {
    id: "standard",
    name: "Standard",
    description: "The standard game mode with default modifiers.",
  },
  {
    id: "speedrun",
    name: "Speed Run",
    description: "4x faster timers, 4x more exp, can attack more per quest.",
  },
  {
    id: "hard-enemies",
    name: "Hard Enemies",
    description: "Enemies are 4x HP, 3x ATK, 3x MATK, 3x DEF, 3x MDEF, 1.2x EVA. Heroes gain 4x exp, 2x faster timers.",
  },
  {
    id: "super-customers",
    name: "Super Customers",
    description: "Customers gain 4x exp, return 8x faster. Selling takes 8x longer. Bigger chance for rare enemies.",
  },
  {
    id: "epic-crafters",
    name: "Epic Crafters",
    description: "Crafters gain 4x exp, 2x longer crafting. S/A gear +20%/+10%, D/C/B gear -20%/-10%/-5%. Enemies 2x HP, 1.25x other stats.",
  },
  {
    id: "legendary",
    name: "Legendary",
    description: "Crafters gain 2x exp, 2x longer crafting. S/A gear +20%/+10%, D/C/B gear -20%/-10%/-5%. Customers 4x exp, 8x faster return. Enemies 4x HP, 2x other stats. Can multi +2 quests.",
  },
];

export function getGameModeLabel(mode: GameMode): string {
  return GAME_MODES.find(m => m.id === mode)?.name ?? mode;
}

