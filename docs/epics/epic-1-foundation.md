# Epic 1 — Platform Foundation & LDraw Rendering

**Goal:** Establish project scaffolding, CI/CD, and a functional Three.js scene that loads and renders an LDraw `.mpd` file. By epic exit, the app is deployed to a public URL and renders a seed model — the rendering pipeline is proven end-to-end.

**PO Must-Fix ties:** #M1 (pin LDraw CDN source) resolves at Story 1.3 kickoff. #M2 (`.env.example`) resolves in Story 1.1.

## Stories

### Story 1.1 — Initialize Vite + React + TypeScript project

As a developer, I want a Vite + React + TypeScript scaffold with linting, formatting, and basic CI, so that I can iterate quickly with safe defaults.

**Acceptance Criteria:**
1. `npm create vite@latest` style scaffold for React + TS is bootstrapped (replaces placeholder `package.json`).
2. ESLint + Prettier configs present; `npm run lint` passes on a fresh clone.
3. Vitest installed; trivial sample test passes via `npm test`.
4. TypeScript `strict: true`; `npm run typecheck` passes.
5. GitHub Actions `.github/workflows/ci.yml` runs lint, typecheck, test on push/PR against `main`.
6. `npm run dev` opens a placeholder page showing "LegoB — bootstrapping".
7. **`.env.example` committed** at repo root with `VITE_LDRAW_CDN_BASE=` and `VITE_SENTRY_DSN=` placeholders (resolves PO Must-Fix #M2).

### Story 1.2 — Install Three.js and render an empty 3D canvas

As a developer, I want a full-viewport Three.js canvas with camera controls, so I have a rendering surface to build on.

**Acceptance Criteria:**
1. Three.js installed with an **exact pinned version** (no `^`) — resolves PO Should-Fix #S1.
2. `<SceneCanvas />` React component renders a Three.js scene filling the viewport.
3. Scene contains ground plane, ambient + directional light, perspective camera, orbit controls.
4. Canvas resizes on window resize without artifacts.
5. "Reset camera" button in minimal top bar returns to iso default.
6. FPS overlay (dev-mode only) displays in corner.

### Story 1.3 — Wire up LDrawLoader and render a hardcoded `.mpd`

As a user, I want to see a sample LDraw model render correctly, so I trust the renderer before building features on top.

**Acceptance Criteria:**
1. **Resolve PO Must-Fix #M1:** pin a specific LDraw parts source (CDN URL + tag, OR bundled curated subset in `public/ldraw-parts/`). Update `.env.example` with the concrete `VITE_LDRAW_CDN_BASE`.
2. `LDrawLoader` from `three/examples/jsm/loaders/LDrawLoader.js` imported and instantiated.
3. Small sample `.mpd` (≤ 20 parts) committed to `public/samples/sample-car.mpd` OR fetched from the pinned mirror.
4. On app load, the sample renders with correct colors per LDConfig.
5. Loading indicator shows while the model parses; clears on success.
6. Parse errors → non-blocking toast; canvas remains usable.
7. Loaded model is centered in the default camera frame.

### Story 1.4 — Move LDraw parsing to a Web Worker

As a user, I want the UI to stay responsive while large models load, so opening a big file doesn't freeze the app.

**Acceptance Criteria:**
1. Web Worker receives `{ fileUrl | fileText }` and returns `{ geometry, steps, materialsSummary }`.
2. Main thread never blocks > 16 ms during load (Performance API measurable).
3. Worker handles sub-file network fetch internally.
4. Fallback: when Web Workers unavailable, load on main thread with a warning toast.
5. Unit tests cover the worker's message protocol (request/response discriminated union from architecture).

### Story 1.5 — Deploy to Cloudflare Pages (or equivalent)

As a stakeholder, I want the app live on a public URL, so I can share progress and run smoke tests.

**Acceptance Criteria:**
1. CI workflow builds and deploys to Cloudflare Pages on merge to `main`.
2. Preview URLs produced for each PR.
3. README badge links to live URL.
4. `robots.txt` allows indexing; `meta description` set.
5. Custom domain wiring documented in README (not required configured for MVP — PO Should-Fix #S3).

### Story 1.6 — Epic 1 exit — render sample set on production URL

As the team, we confirm the rendering pipeline works end-to-end in production so we can move to sandbox features.

**Acceptance Criteria:**
1. Visiting production URL renders the committed sample `.mpd` within 5 s on warm cache.
2. Orbit controls work via mouse.
3. No console errors in clean Chrome session.
4. Lighthouse perf score ≥ 85 on mobile preset (informational only).

## Dependencies

- Phase 0 environment bootstrap: ✅ complete.
- No upstream epic dependencies.

## Next Epic

→ [Epic 2 — Sandbox Mode](./epic-2-sandbox.md)
