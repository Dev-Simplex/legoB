# Testing Strategy

```
          E2E (Playwright)
         /                \
      Integration (Vitest + happy-dom)
       /                        \
Unit (Vitest)              (no backend tests)
```

## Unit tests

- **Co-located** with source: `src/**/*.test.ts(x)`.
- Required for every new module in: `src/scene/snap/`, `src/io/`, `src/workers/`, `src/state/`.
- Mock storage / network via Vitest mocks.
- Coverage target: 80% on `src/scene/snap/`, `src/io/` (critical logic). No coverage gate on UI components.

## Integration tests

- Location: `tests/integration/`.
- Scope: Zustand store + `sceneRepo` roundtrip; worker client ↔ protocol; `mpdWriter` ↔ `mpdReader` roundtrip.

## E2E tests

- Location: `tests/e2e/`.
- Tool: Playwright (Chromium default; Firefox + WebKit in nightly).
- Scope: Happy-path user journeys.
  - `sandbox.spec.ts` — first-time place/save/reload.
  - `instructions.spec.ts` — open bundled instruction set and Next through it.
  - `import-export.spec.ts` — import `.mpd` → edit → export → re-import.
  - `a11y.spec.ts` — axe scan on 4 key screens.
- CI gating: run on every PR (required green) — **PO Should-Fix #S2**.

## Visual regression

- Location: `tests/visual/`.
- Tool: Playwright screenshot + `pixelmatch`.
- Gated behind PR label `visual` to avoid flakes per-PR.
- Baseline: commit a canonical PNG per reference brick on M1 Chrome.

## A11y tests

- `@axe-core/react` runs in dev mode; any violation fails the dev build in strict mode.
- `tests/e2e/a11y.spec.ts` runs axe via `@axe-core/playwright` on Home, Sandbox, Instructions, My Saves.

## Manual smoke checklist (per release)

1. Open sandbox.
2. Place 10 bricks.
3. Save with a name.
4. Reload page.
5. Load from "My Saves".
6. Open a bundled instruction set.
7. Play through to completion.
8. Export `.mpd`.
9. Re-import the exported `.mpd`.
10. Verify About page attribution.

→ Full context: [../fullstack-architecture.md#testing-strategy](../fullstack-architecture.md#testing-strategy)
