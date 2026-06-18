# Merchant RPG Helper

Phase 1 of a combat simulator prototype for Merchant RPG.

## What Phase 1 Includes

- Select one hero from baseline `HeroList.json` data.
- Select one quest enemy from baseline `QuestList.json` data.
- Configure hero equipment slots (weapon/head/body/hands/feet/trinket) from `EquipmentList.json`.
- Enter custom STR/INT/DEX attributes and apply them through hero scaling.
- Show computed hero stats side-by-side with enemy stats.
- Show baseline hero and quest/enemy images when available.

## Baseline Data Source

Baseline data has been migrated into the project:

- Data: `lib/HeroList.json` (heroes with base stats and skills)
- Data: `lib/QuestList.json` (quests with enemy stat blocks)
- Data: `lib/EquipmentList.json` (equipment and slot bonus stats)
- Images: `public/merchant-db/` (hero icons and enemy portraits)
- BIS dataset: `lib/bis-guide.json` (parsed from Jackal's BIS workbook)

See `lib/README.md` for data schema and versioning notes.

## Combat Simulator Plan

- See `docs/combat-simulator-plan.md` for phased implementation details.

## Mechanics Source of Truth

- Default reference for battle mechanics, attacks, and stat behavior: `docs/game-guide.md`.
- If game data and guide text disagree, flag it explicitly before implementing formula logic.

## Run Locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

Merchant-style item inspector: `http://localhost:3000/items`

## Verify

```bash
npm run lint
npm run test:unit
npm run test:integration
```

## Deploy to GitHub Pages

This repo is configured for a static GitHub Pages deployment from the `main` branch.

- Workflow: `.github/workflows/deploy-github-pages.yml`
- Build output: `out/`
- Pages source: set the repository to **GitHub Actions** in the Pages settings

The workflow uses `actions/configure-pages` and passes its `base_path` output to `NEXT_PUBLIC_BASE_PATH`, so routes and static assets resolve correctly for both project pages (for example `/<repo-name>`) and user/org root pages.

If you rename the repository, the workflow continues to use the correct Pages base path on the next deploy.

## Test Pyramid

The test suite is organized to keep most feedback fast and local:

- **Unit:** pure data transforms and query helpers in `tests/unit/`
- **Component:** isolated UI behavior in `tests/component/`
- **Integration:** route and page wiring in `tests/integration/`
- **E2E:** browser smoke coverage in `tests/e2e/`

Common commands:

```bash
npm run test
npm run test:run
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:ci
```

## BIS Data Commands

```bash
npm run bis:parse
npm run bis:query -- --hero=Warrior --tier=6 --slot=weapon
```

## Merchant Image Extraction

```bash
npm run images:extract
```

This command copies all vendor image assets from `vendor/MerchantGameDB-master/img/` into `public/merchant-db/` and extracts sprite maps from `vendor/MerchantGameDB-master/css/all-spritesheets.css` into static PNG files:

- `public/merchant-db/Items/`
- `public/merchant-db/Skills/`
- `public/merchant-db/Enemies/Sprites/`
- `public/merchant-db/Quests/Sprites/`

## BIS Query API

Route: `GET /api/bis`

Examples:

```bash
curl "http://localhost:3000/api/bis?hero=Warrior&tier=6&slot=weapon"
curl "http://localhost:3000/api/bis?mode=heroes"
curl "http://localhost:3000/api/bis?mode=builds&hero=Mage&tier=6"
```

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui (Radix UI + Tailwind)
- **Language:** TypeScript

## Component Library

This project uses [shadcn/ui](https://ui.shadcn.com) for composable, accessible components built on Radix UI and styled with Tailwind CSS.

To add more components:

```bash
npx shadcn@latest add [component-name]
```
