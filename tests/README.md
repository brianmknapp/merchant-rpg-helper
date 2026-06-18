# Tests

This suite follows a simple test pyramid:

- `unit/` covers pure data transforms and query helpers.
- `component/` covers isolated UI behavior with seeded props.
- `integration/` covers route and page wiring across multiple modules.
- `e2e/` covers a thin browser smoke layer for key user-visible flows.

Recommended commands:

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:ci
```

