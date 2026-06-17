# Baseline Game Data

This folder contains the core game data extracted from MerchantGameDB-master.

## Files

- `HeroList.json` – Hero class definitions with base stats, skills, and growth rates.
- `QuestList.json` – Quest/enemy definitions with stat blocks and rewards.
- `EquipmentList.json` – Craftable and dropped equipment data with slot and bonus stats.
- `bis-guide.json` – Normalized build/slot recommendations parsed from Jackal's Merchant BIS workbook.
- `bis-guide.ts` – Query helpers for hero/build/tier/slot BIS lookups.

## Data Contract

Each entry in these JSON files follows the schema used by the Merchant RPG game. For Phase 1 simulator:

- **Heroes** use `class` (id), `name`, and base stats at level 1: `hp`, `atk`, `matk`, `def`, `mdef`, `acc`, `crit`.
- **Quests** use primary enemy stats: `enemyHp`, `enemyAtk`, `enemyMatk`, `enemyDef`, `enemyMdef`, `enemyEva`.
- Rare variants (`nameB`, `enemyHpB`, etc.) are deferred to Phase 2+.

## Source

Extracted from `MerchantGameDB-master/json/` as a one-time import. Any future updates to game balance should be copied here to keep the simulator in sync with the canonical game data.

`bis-guide.json` is generated from `vendor/Jackal's Merchant BIS Guide.xlsx` via `npm run bis:parse`.



