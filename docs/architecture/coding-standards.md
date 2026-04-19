# Coding Standards

**These rules are non-negotiable** for `@dev` and `@qa` agents. Code reviews enforce them.

## Critical Fullstack Rules

1. **Type sharing** — all domain types live in `src/types/domain.ts`. Workers import from there. No duplicate interfaces.
2. **No direct `window.indexedDB`** — all IndexedDB access via `sceneRepo`. No ad-hoc IDB in components.
3. **No direct `fetch` for LDraw parts** — all LDraw IO via `ldrawClient.loadLdraw()`. Caching + retries centralized.
4. **No global event bus** — cross-component communication via Zustand stores. No `CustomEvent` / `EventEmitter`.
5. **No `any` in production code** — use `unknown` + narrowing. `any` only in tests with lint comment.
6. **No inline `style` attributes** — Tailwind classes only. Dynamic values via CSS variables.
7. **Worker boundary purity** — payloads crossing worker boundary must be serializable. No class instances, no functions.
8. **Three.js objects stay inside R3F** — never store raw `THREE.Mesh` in Zustand. Stores hold plain data; R3F builds Three.js objects from it.
9. **LDraw units in state** — positions stored in **LDU** (not world units, not meters). Conversion happens at render time.
10. **No unsaved-work silent loss** — mutations set `isDirty=true`; navigation asks for confirmation unless saved or explicitly discarded.
11. **Accessibility non-negotiable** — every interactive element has accessible name; `@axe-core/react` warnings fail strict dev build.
12. **No trademark strings** — the literal "LEGO" must NOT appear in user-facing strings. CI test grep-fails on it.
13. **Commit style** — Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
14. **One store per domain** — no god store.
15. **Selectors over direct reads** — `useSceneStore(s => s.scene.parts.length)`; never `useSceneStore()` without selector.

## Naming Conventions

| Element | Rule | Example |
|---------|------|---------|
| Components | PascalCase | `PaletteEntry.tsx` |
| Hooks | camelCase with `use` prefix | `useSceneStore.ts` |
| Stores | `use{Domain}Store` | `useSceneStore` |
| Worker protocol types | PascalCase | `LdrawRequest` |
| DB tables | lowercase | `scenes`, `kv` |
| CSS variables | kebab-case | `--primary` |
| Util files | kebab-case | `scene-repo.ts` — **but we're using camelCase `sceneRepo.ts`** (architecture precedent; keep consistent) |
| Test files | `*.test.ts(x)` co-located | `Button.test.tsx` |

## Testing Rules

- Every new module in `src/scene/snap/`, `src/io/`, `src/workers/` MUST ship with unit tests.
- UI components get a smoke test (render + primary interaction).
- E2E: one happy-path Playwright test per user journey.
- Visual regression tests for canvas rendering gated behind a CI label `visual` to avoid flakes on every PR.

## Commit & PR

- One epic per branch (optional — stories can share branches if small).
- PR title: `feat(epic-N): short summary` or `feat(story-N.M): short summary`.
- PR description references story file under `docs/stories/`.
- CI must pass: lint, typecheck, test, build.
- At least one `@qa` review before merge (self-review ok for solo-dev MVP).

→ Full context: [../fullstack-architecture.md#coding-standards](../fullstack-architecture.md#coding-standards)
