# Merchant RPG Combat Simulator Plan

## Assumptions

- Baseline hero and quest data comes from `lib/HeroList.json` and `lib/QuestList.json`.
- Baseline images come from `public/merchant-db`.
- Combat rules and mechanics default to `docs/game-guide.md` unless explicitly overridden.
- Phase 1 is intentionally UI-first: no turn engine yet.
- For now, each selected hero uses level 1 base stats exactly as defined in `HeroList.json`.
- For quests with alternate rare variants (`nameB`, `enemyHpB`, etc.), Phase 1 uses only the primary variant fields.

## Phase 1 Goal (Current)

Allow choosing one hero and one quest enemy, and show both stat blocks with baseline images.

### Phase 1 Success Criteria

- Hero selector lists heroes from `HeroList.json`.
- Quest selector lists valid quest enemies from `QuestList.json`.
- Hero defaults to level 1 base stats from the selected hero class.
- Selected hero and selected enemy stats are visible side-by-side.
- UI attempts to render hero and quest/enemy images from baseline assets in `public/merchant-db`.

## Phase 2 Goal

Build a deterministic single-round simulator.

### Scope

- Add one-step damage preview (`hero -> enemy`, `enemy -> hero`).
- Use a transparent formula module with unit tests.
- Include hit/evasion/crit checks once rules are provided.

## Phase 3 Goal

Simulate a full fight loop for one hero vs one quest enemy.

### Scope

- Turn order and action sequence.
- HP tracking to victory/defeat.
- Basic battle log output for debugging and validation.

## Phase 4 Goal

Expand from one hero to party simulation and advanced rules.

### Scope

- Multiple heroes.
- Skill/passive effects.
- Rare variants and map/event edge cases.
- Result aggregation and balancing tooling.

## Validation Strategy

- Keep source-of-truth mapping logic close to raw data and explicit.
- Add tests per phase that capture intent (formula correctness, turn order, and breakpoints).
- Keep deterministic mode for reproducible balancing and regression checks.


