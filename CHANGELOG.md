# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] — 2026-04-20

First functional MVP. Covers Epics 1–5 of the greenfield-fullstack workflow.

### Added

- **Platform foundation (Epic 1).** Vite 5 + React 18 + TypeScript (strict) + Vitest + ESLint + Prettier scaffold with a GitHub Actions CI workflow.
- **3D rendering (Epic 1).** Three.js 0.169 pinned exact via `@react-three/fiber` + `drei`. Full-viewport `<SceneCanvas>` with orbit controls, ground plane, ambient + directional + hemisphere lighting, and an LDU-aware grid (20 LDU per stud).
- **Procedural brick renderer (Epic 1).** Placeholder `<Brick>` component produces brick + studs via Three.js primitives using the real LDraw part numbers and LDConfig color codes. Swaps to LDrawLoader-rendered meshes once the parts-library CDN is pinned (deferred PO Must-Fix #M1).
- **Sandbox mode (Epic 2).** 10-part palette with search + category filters, 20-color LDConfig swatch picker, click-to-place with translucent ghost preview, half-stud-aware grid snapping, stud-stack snapping on brick hover, AABB collision detection, click-to-select, keyboard rotation (R / Shift+R), delete (Del / Backspace), and Esc to clear.
- **Properties panel (Epic 2).** Selected brick info (part number, position, rotation) + rotate/delete/recolor actions + keyboard hint footer.
- **Persistence (Epic 3).** `idb`-backed `sceneRepo` with atomic save, load, list, delete, rename. `navigator.storage.persist()` requested on save.
- **My Saves dialog (Epic 3).** Modal listing saved scenes with load / rename / delete + current-scene highlight + empty state.
- **File IO (Epic 3).** `writeMpd` + `readMpd` for LDraw `.mpd` export/import. File System Access API with anchor-download fallback. File picker for Open. Unknown parts fall back to 2x2 brick with a warning.
- **Instructions mode (Epic 4).** `0 STEP` markers parsed on import, scene auto-mode-switches to instructions when steps are present. Transport bar with ⏮ / ◀ / play-pause / ▶ / ⏭ / ↻. Step scrubber. Parts-for-this-step sidebar with color swatches and running totals. Ghost preview of the next step. Keyboard: ←/→ prev/next, Space play/pause, Home/End jump, G ghost toggle. Auto-play advances at 1.2 s/step.
- **Bundled sample (Epic 4).** `public/samples/little-house-steps.mpd` — a 5-step CCAL-clean demo build reachable from the "Sample" toolbar button.
- **Toast system (Epic 3).** Non-blocking in-app notifications (info/success/warning/error).
- **Error boundary (Epic 5).** Root-level `<ErrorBoundary>` with friendly fallback and reload affordance.
- **About dialog (Epic 5).** Keyboard-shortcut reference, LDraw CCAL attribution, LEGO-trademark disclaimer, privacy note.
- **License & attribution.** MIT for app code; CCAL attribution for LDraw and LEGO Group disclaimer.

### Planning artifacts

- `docs/project-brief.md`
- `docs/prd.md` (5 epics, 30 stories, FR1-18, NFR1-12)
- `docs/front-end-spec.md`
- `docs/fullstack-architecture.md`
- `docs/po-validation-report.md`
- Sharded `docs/prd/`, `docs/architecture/`, `docs/epics/`, `docs/stories/` for AI-driven dev.

### Deferred

- LDrawLoader integration + parts CDN pinning (PO Must-Fix #M1). Procedural brick renderer is the stand-in.
- Cloudflare Pages deploy (requires user's Cloudflare account + GitHub remote auth).
- Playwright E2E, visual regression, mobile fallback, service worker, `InstancedMesh` perf path, stud-position lookup table, OPFS parts cache.

### Metrics at release

- 10 unit tests passing (snapping, MPD codec round-trip + step parsing, App smoke).
- Lint: clean. Typecheck: clean.
- Production bundle: 283 KB gzipped (well under the 3 MB NFR1 budget).
