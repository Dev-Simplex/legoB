# Epic 5 — Polish, Performance & Deploy

**Goal:** Meet performance, accessibility, and deployment acceptance bars. MVP is launch-ready.

## Stories

### Story 5.1 — InstancedMesh for repeated parts

**AC:**
1. Parts appearing ≥ 4 times in a scene use `InstancedMesh` automatically.
2. Test scene with 1000 identical 2x2 bricks renders at ≥ 30 fps on M1 Chrome.
3. Selection and color change still work on instanced parts.

### Story 5.2 — Service worker + app shell caching

**AC:**
1. Service worker registers on first load and caches app shell (via `vite-plugin-pwa`).
2. Subsequent visits load shell from cache; parts from OPFS (Story 3.6).
3. SW updates applied on next load with toast "App updated — refresh to apply".

### Story 5.3 — Accessibility pass

**AC:**
1. All controls keyboard-reachable; visible focus ring.
2. `@axe-core/react` reports zero violations in dev on Home, Sandbox, Instructions, My Saves.
3. `prefers-reduced-motion` disables camera inertia + step animations.
4. Canvas has ARIA label summarizing scene contents.
5. Color picker swatches have accessible names (color name + code).
6. **Keyboard-coverage audit** (PO Should-Fix #S5): verify every action in the shortcut map has a working binding + discoverable `?` overlay.

### Story 5.4 — Mobile + responsive fallback

**AC:**
1. On screens < 768 px wide, banner offers "Best on desktop" read-only message.
2. Read-only mode renders scene + allows camera controls.
3. Editing controls hidden or disabled with explanations.

### Story 5.5 — Error tracking and user-facing error boundary

**AC:**
1. React error boundary at root; errors show "Something went wrong — reload" screen.
2. Uncaught errors + unhandled promise rejections logged to `console.error` structured.
3. Optional Sentry-lite integration gated behind `VITE_SENTRY_DSN` env var (off by default in MVP).

### Story 5.6 — Launch checklist + production deploy

**AC:**
1. MVP Success Criteria from project-brief.md verified via manual smoke.
2. Lighthouse: Perf ≥ 85, A11y ≥ 90, Best Practices ≥ 90 on mobile preset.
3. About page lists LDraw.org attribution, CCAL 2.0 license, and disclaimer: unofficial fan tool, not affiliated with LEGO Group.
4. Production URL announced in README.
5. `CHANGELOG.md` records v1.0.0 release.
6. **Playwright E2E job** in CI (PO Should-Fix #S2) — either main CI or nightly.
7. **Custom domain decision** (PO Should-Fix #S3) — configure OR explicitly defer to post-MVP in README.

### Story 5.7 — User documentation (PO Should-Fix #S6)

**AC:**
1. About page with project pitch, LDraw credit, CCAL license text, source code link.
2. FAQ page covering: "What is LDraw?", "Where do parts come from?", "Can I use my own files?", "Why no account?", "Why no mobile?".
3. Keyboard shortcut cheat-sheet accessible via `?` key.
4. Link to all docs from Settings → "About".

## Dependencies

- Requires: Epics 1-4 complete.
- Final epic — no downstream blockers.

## Exit

→ MVP shipped. v1.0.0 tagged. Begin post-MVP planning.
