# LegoB Product Requirements Document (PRD)

**Status:** Draft v1.0 · YOLO autonomous draft by `@pm` (aiox-master)
**Date:** 2026-04-19
**Inputs:** `docs/project-brief.md`, `.aiox/research/ldraw-three-research.md`

---

## Goals and Background Context

### Goals

- Deliver a **zero-install, browser-based 3D Lego assembly experience** where a first-time visitor places a brick within 30 seconds.
- Support **two first-class modes** in MVP: free-form **Sandbox** and guided **Instructions** playback.
- Use **LDraw** as the authoritative piece format so existing community models (`.mpd` files) open natively.
- Achieve **60 fps with 500 bricks** on M1-class hardware; never drop below 30 fps on ≤ 1000 bricks.
- Ship with **zero backend, zero accounts, zero infra cost** — all state in-browser.
- Reach **5,000 unique visitors** in the first month and **500 GitHub stars** within six months.

### Background Context

Physical Lego is expensive and space-bound; desktop builders (BrickLink Studio, LDCad, LeoCAD) require installs and CAD fluency; LEGO's own apps are closed-catalog and mobile-only. The intersection of **browser-native**, **LDraw-compatible**, and **instruction-driven** is under-served. Modern browser APIs (WebGL2, File System Access, IndexedDB, OPFS, `LDrawLoader` in Three.js, Web Workers) now make a pure-client build feasible, and LDraw's CCAL license permits redistribution. This PRD scopes the MVP that exploits that gap.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-04-19 | 1.0 | Initial YOLO draft from project brief | @pm (aiox-master) |

---

## Requirements

### Functional

- **FR1:** System renders LDraw `.ldr`/`.mpd`/`.dat` files in a 3D scene using WebGL.
- **FR2:** User can orbit, pan, and zoom the camera with mouse (left-drag orbit, right-drag pan, scroll zoom). Reset-camera button returns to a default iso view.
- **FR3:** User can open a brick palette and place the selected brick into the scene by clicking on a snap target (stud on another brick or ground plane).
- **FR4:** Placed bricks **auto-snap** to an LDU grid (x/z multiples of 10 LDU; y multiples of 8 LDU) and, when possible, to detected stud positions on hovered bricks.
- **FR5:** User can select a placed brick and **rotate** it in 90° increments around the Y axis.
- **FR6:** User can select a placed brick and **delete** it.
- **FR7:** User can select a placed brick and **change its color** from the LDConfig palette.
- **FR8:** User can **import** a `.ldr` or `.mpd` file via drag-drop or file-picker.
- **FR9:** User can **export** the current scene as an `.mpd` download.
- **FR10:** User can **save** the current scene to browser storage (IndexedDB), naming the save.
- **FR11:** User can **list** previously saved scenes and **load** or **delete** any of them.
- **FR12:** User can switch to **Instructions mode** and open a `.mpd` that contains `0 STEP` markers.
- **FR13:** In Instructions mode, user can press **Next / Prev** to advance/reverse steps; the scene shows only parts up to the current step, with newly-added parts highlighted.
- **FR14:** In Instructions mode, a **ghost preview** of the parts added in the current step appears before the user confirms the step (toggleable).
- **FR15:** App ships with **2–3 bundled sample `.mpd` sets** that can be opened from a "Samples" menu.
- **FR16:** App caches LDraw parts on first load (OPFS or IndexedDB) so subsequent loads are offline-capable.
- **FR17:** App shows a license/attribution footer crediting LDraw.org and the CCAL 2.0 license.
- **FR18:** Errors during LDraw parsing (malformed file, missing sub-part) show a user-facing error toast and do not crash the app.

### Non Functional

- **NFR1:** Initial JS payload ≤ **3 MB gzipped**; parts fetched/cached on demand.
- **NFR2:** Time-to-first-brick (fresh visitor, empty cache, broadband): **P50 ≤ 30 s, P95 ≤ 90 s**.
- **NFR3:** Rendering ≥ **60 fps** with 500 bricks on M1-class Chrome; ≥ **30 fps** with 1000 bricks.
- **NFR4:** Scene saves/loads must be **atomic** — on failure the previous save is preserved.
- **NFR5:** No PII collected; no third-party trackers in MVP; no network calls except CDN for parts and static hosting.
- **NFR6:** **Crash-free sessions ≥ 98%** (measured via on-site JS error catcher posting to a simple log endpoint — optional, anonymized).
- **NFR7:** App functions offline after first load (service worker caches app shell + cached parts).
- **NFR8:** Compatible with evergreen Chromium 110+, Firefox 115+, Safari 16.4+. Graceful degradation on older browsers with a "please upgrade" screen.
- **NFR9:** All user-facing copy uses i18n keys (English only in MVP) to ease later localization.
- **NFR10:** LDraw parsing must run **off the main thread** (Web Worker) to keep the UI responsive.
- **NFR11:** **Accessibility:** keyboard shortcuts for all core actions (place, rotate, delete, color-pick, next-step); WCAG 2.1 AA color contrast in UI chrome.
- **NFR12:** **No use of the LEGO trademark** in product name, logo, marketing copy, or UI chrome. Attribution reads "LDraw-compatible brick format".

---

## User Interface Design Goals

### Overall UX Vision

"Figma for bricks." A single canvas dominates the screen; tools live in a collapsible left rail; a contextual properties panel appears on selection; the bottom hosts a minimal step/transport bar in Instructions mode. The app should feel as playful as a toy box and as trustworthy as a CAD tool — **opinionated defaults, zero modals in the critical path**.

### Key Interaction Paradigms

- **Direct manipulation.** Hover to preview snap target; click to place; drag (future) to reposition; click to select, properties appear.
- **Mode toggle.** Single toggle Sandbox ↔ Instructions switches the UI surface but preserves the scene.
- **Keyboard-first power moves.** `R` rotate, `Del` delete, `C` color, `Space` play/pause instructions, `←/→` prev/next step.
- **Non-blocking feedback.** Toasts for save/load/errors; inline skeletons while LDraw parses; never a spinner over the canvas.

### Core Screens and Views

- **Launch / Home screen** — logo, "Start Sandbox", "Open Sample Set", "Import File", "My Saves" (if any).
- **Sandbox view** — 3D canvas + left palette (parts picker, search, category filter) + top toolbar (save/export/import/settings) + right properties panel (on selection).
- **Instructions view** — 3D canvas + bottom transport bar (step N of M, prev/next, play, scrubber) + top toolbar (exit to sandbox, open set) + parts-for-this-step sidebar.
- **My Saves view** — grid of thumbnails with name/date, actions (load/rename/delete/export).
- **Settings modal** — camera sensitivity, color theme, part-cache controls, accessibility toggles, attribution/about.

### Accessibility: WCAG AA

- Color contrast AA for chrome; canvas content is inherently graphical — provide textual list view of parts in selected scene as AT-friendly alternative in MVP.
- All controls reachable by keyboard; visible focus ring.
- `prefers-reduced-motion` disables camera inertia and transition animations.

### Branding

- Codename **LegoB** (pre-rebrand). Treat as internal — display "Brick Builder" or neutral placeholder until legal review.
- Color palette: warm primaries (inspired by LDConfig canonical colors) on neutral slate chrome.
- Typography: humanist sans (Inter or similar system fallback).

### Target Device and Platforms: Web Responsive (Desktop-First)

Desktop 1280×720 minimum. Tablet layout functional but not delightful. Mobile phone (<768px) shows a "best on desktop" banner + read-only view.

---

## Technical Assumptions

### Repository Structure: Monorepo (single package)

Start with a flat single package. Upgrade to a pnpm workspace monorepo if/when Phase 2 introduces separate build targets (e.g. embed widget).

### Service Architecture

**Client-only SPA.** No servers. Static hosting on Cloudflare Pages / Vercel / GitHub Pages. All compute in the browser. Parts fetched from a public LDraw mirror (jsDelivr-backed) on first use, then cached in OPFS.

### Testing Requirements

- **Unit** (core logic, LDraw parsing helpers, snapping math): Vitest.
- **Integration** (scene state reducers, save/load roundtrip): Vitest + happy-dom.
- **Visual regression** (canvas screenshots for reference bricks): Playwright + pixelmatch.
- **Manual smoke** checklist per release: open sandbox, place 10 bricks, save, reload, load, open sample instruction set, finish playback.

### Additional Technical Assumptions and Requests

- **UI framework:** **React 18+** with TypeScript (community depth, AI tooling support). Svelte flagged as alternative if bundle size becomes a blocker.
- **Bundler:** **Vite**. Dev server fast, production output tree-shaken, first-class Web Worker support.
- **State:** **Zustand** (small, scales to the scene graph). Redux Toolkit only if state complexity explodes.
- **3D:** **Three.js** (pinned 0.160+ or current LTS equivalent). Consider **`@react-three/fiber`** for declarative scene graph in React — decide in architecture. `LDrawLoader` from `three/examples/jsm`.
- **Storage:** **`idb`** for IndexedDB (scene metadata + serialized scene JSON). **OPFS** for parts cache. **File System Access API** with download fallback for user file IO.
- **Testing:** Vitest, Playwright, happy-dom.
- **Linting/formatting:** ESLint + Prettier with a minimal opinionated config.
- **CI/CD:** GitHub Actions workflow — lint, typecheck, test, build, deploy to Cloudflare Pages on `main`. Preview deploys on PR.
- **Error tracking:** Console-only in MVP. Optional anonymous Sentry-lite post-MVP.
- **License:** MIT for app code; LDraw parts under their CCAL with attribution.
- **Accessibility baseline:** `@axe-core/react` runs in dev mode.

---

## Epic List

- **Epic 1: Platform Foundation & LDraw Rendering** — Stand up the web app, Three.js scene, and LDraw parsing/rendering pipeline. Exit = a placeholder scene renders a seeded `.mpd` file and the app is deployed to a public URL.
- **Epic 2: Sandbox Mode** — Implement brick palette, placement, snapping, selection, rotation, color change, and deletion. Exit = user can build a freeform model with ≥ 20 varied bricks.
- **Epic 3: Persistence & File IO** — Save/load scenes to IndexedDB; import/export `.mpd` files; bundled sample sets. Exit = user can close the tab, return, and resume.
- **Epic 4: Instructions Mode** — Parse `0 STEP` markers, step-by-step playback UI, ghost previews, highlighting. Exit = user completes a bundled set from step 1 to end.
- **Epic 5: Polish, Performance & Deploy** — Performance optimizations (instancing, worker parsing), accessibility, responsive fallback, attribution, error handling, final deploy. Exit = MVP Success Criteria met.

Each epic is designed to be **independently deployable** and leaves the app usable (Epic 1 gives a viewer, Epic 2 adds sandbox, etc.).

---

## Epic 1: Platform Foundation & LDraw Rendering

**Epic Goal:** Establish the project scaffolding, CI/CD, and a functional Three.js scene that loads and renders an LDraw `.mpd` file. By the end of this epic, the app is deployed to a public URL and renders a seed model, proving the rendering pipeline works end-to-end.

### Story 1.1: Initialize Vite + React + TypeScript project

As a developer, I want a Vite + React + TypeScript scaffold with linting, formatting, and basic CI, so that I can iterate quickly with safe defaults.

**Acceptance Criteria:**
1. `npm create vite@latest` style scaffold for React + TS is bootstrapped into the repo (replacing placeholder `package.json`).
2. ESLint + Prettier configs are present; `npm run lint` passes on a fresh clone.
3. Vitest is installed and a trivial sample test passes via `npm test`.
4. TypeScript `strict: true` is enabled; `npm run typecheck` passes.
5. GitHub Actions workflow `.github/workflows/ci.yml` runs lint, typecheck, and test on push/PR against `main`.
6. Running `npm run dev` opens a placeholder page showing "LegoB — bootstrapping".

### Story 1.2: Install Three.js and render an empty 3D canvas

As a developer, I want a full-viewport Three.js canvas with camera controls, so I have a rendering surface to build on.

**Acceptance Criteria:**
1. Three.js (pinned version) installed as a dependency.
2. A React component `<SceneCanvas />` renders a Three.js scene that fills the viewport.
3. The scene contains a ground plane, an ambient + directional light, and an orbit-controls-enabled perspective camera.
4. Canvas resizes on window resize without artifacts.
5. A "Reset camera" button in a minimal top bar returns the camera to an iso default.
6. FPS overlay (dev-mode only) displays in the corner.

### Story 1.3: Wire up LDrawLoader and render a hardcoded `.mpd`

As a user, I want to see a sample LDraw model render correctly, so I trust the renderer works before building features on top.

**Acceptance Criteria:**
1. `LDrawLoader` from `three/examples/jsm/loaders/LDrawLoader.js` is imported and instantiated.
2. A small sample `.mpd` (≤ 20 parts) is committed to `public/samples/sample-car.mpd` or fetched from an LDraw CDN mirror.
3. On app load, the sample renders in the scene with correct colors per LDConfig.
4. A loading indicator shows while the model parses and clears on success.
5. Parsing errors render a non-blocking toast with the error; the canvas remains usable.
6. The loaded model is centered in the default camera frame.

### Story 1.4: Move LDraw parsing to a Web Worker

As a user, I want the UI to stay responsive while large models load, so opening a big file doesn't freeze the app.

**Acceptance Criteria:**
1. A Web Worker receives `{ fileUrl | fileText }` and returns `{ geometry, steps, materialsSummary }`.
2. Main thread never blocks > 16 ms during load (measurable via Performance API).
3. Worker handles network fetch of sub-file references internally.
4. Fallback path works when Web Workers are unavailable (loads on main thread with a warning toast).
5. Unit tests cover the worker's message protocol.

### Story 1.5: Deploy to Cloudflare Pages (or equivalent free tier)

As a stakeholder, I want the app live on a public URL, so I can share progress and run smoke tests.

**Acceptance Criteria:**
1. CI workflow builds and deploys to Cloudflare Pages (or Vercel/GitHub Pages) on merge to `main`.
2. Preview URLs are produced for each PR.
3. A badge in the README links to the live URL.
4. `robots.txt` allows indexing; `meta description` is set.
5. Custom domain wiring documented in README (not required to be configured for MVP).

### Story 1.6: Epic 1 exit — render sample set on production URL

As the team, we confirm the rendering pipeline works end-to-end in production so we can move to sandbox features.

**Acceptance Criteria:**
1. Visiting the production URL renders the committed sample `.mpd` within 5 seconds on a warm cache.
2. Orbit controls work via mouse.
3. No console errors in a clean Chrome session.
4. Lighthouse perf score ≥ 85 on mobile preset (informational, not blocking).

---

## Epic 2: Sandbox Mode

**Epic Goal:** Let a user freely place, manipulate, and delete bricks on the scene. By epic exit, a user can assemble a meaningful model from a palette of common parts.

### Story 2.1: Parts palette with seeded catalog

As a user, I want a palette of common bricks to pick from, so I can place them in the scene.

**Acceptance Criteria:**
1. Left rail renders a scrollable palette of ≥ 30 curated LDraw parts (2x2 brick, 2x4 brick, 1x1 plate, 2x2 plate, etc.).
2. Each palette entry shows a rendered thumbnail (SVG or pre-rendered PNG) and a label.
3. Clicking a palette entry selects it as the "active part" (visually indicated).
4. A search input filters the palette by label/part-number.
5. Palette is keyboard-navigable; arrow keys move selection, Enter activates.

### Story 2.2: Ground-plane placement with grid snap

As a user, I want to click the ground to place the selected brick, so I can start building.

**Acceptance Criteria:**
1. With an active part selected, hovering the ground plane shows a translucent ghost of the part at the snapped position.
2. Snap target is the nearest LDU grid point (10-LDU x/z multiples).
3. Left-click places the part; it becomes an editable scene object.
4. Right-click cancels placement (deselects active part).
5. Escape key also deselects active part.
6. Placed parts persist across camera changes (do not drift).

### Story 2.3: Stud-on-stud placement with snap detection

As a user, I want to place a brick on top of an existing brick and have it snap to studs, so builds feel natural.

**Acceptance Criteria:**
1. Hovering an existing brick highlights it and projects the ghost of the active part at a snapped stud position above it.
2. Snap detection identifies stud positions from the brick's LDraw sub-file references (scan for `stud*.dat`).
3. Y-axis placement respects brick height (24 LDU brick, 8 LDU plate).
4. When snapping fails (no valid stud under cursor), the ghost displays in red and left-click is disabled.
5. Works for at least the 30 curated parts in the palette.

### Story 2.4: Selection, rotation, deletion

As a user, I want to select a placed brick and edit it, so I can correct mistakes and arrange builds.

**Acceptance Criteria:**
1. Clicking a placed brick selects it (visual outline/glow); clicking empty space deselects.
2. `R` key rotates the selected brick 90° clockwise around the Y axis; `Shift+R` rotates counter-clockwise.
3. `Del` or `Backspace` deletes the selected brick.
4. Toolbar buttons mirror the keyboard actions for discoverability.
5. Multi-select with Shift-click is **out of scope for MVP**; single-selection only.

### Story 2.5: Color change via LDConfig palette

As a user, I want to change the color of a selected brick, so builds can match my vision.

**Acceptance Criteria:**
1. Selecting a brick reveals a properties panel with a color swatch grid (sourced from LDConfig).
2. Clicking a swatch updates the brick's color immediately in the scene.
3. Current color is indicated in the swatch grid.
4. Keyboard shortcut `C` opens the color picker and traps focus inside it; Escape closes.
5. Material class (solid/transparent/chrome) matches LDConfig for the chosen code.

### Story 2.6: Epic 2 exit — freeform build

As a user, I confirm I can freely build a model ≥ 20 bricks without the app misbehaving.

**Acceptance Criteria:**
1. Place 20 varied bricks across ≥ 2 Y-levels with correct snapping.
2. Rotate, recolor, and delete subsets of them.
3. No duplicate placements at the same coordinate.
4. FPS remains ≥ 60 on M1-class Chrome during the session.

---

## Epic 3: Persistence & File IO

**Epic Goal:** Builds survive tab reloads and can be shared via `.mpd` export/import. Bundled sample sets are accessible.

### Story 3.1: Serialize scene to JSON and save to IndexedDB

As a user, I want to save my current build, so I can come back to it later.

**Acceptance Criteria:**
1. "Save" button serializes the current scene (list of parts: `{part, color, position, rotation}`) to a JSON blob.
2. Save is stored in IndexedDB (via `idb`) under a key `scene:<uuid>` with metadata `{name, createdAt, updatedAt, thumbnail}`.
3. A naming prompt appears on first save; subsequent saves to the same scene overwrite.
4. A success toast confirms save; failure toast explains the error.
5. `navigator.storage.persist()` is requested on first save.

### Story 3.2: "My Saves" view

As a user, I want to browse and manage my saves, so I can resume any build.

**Acceptance Criteria:**
1. Home screen shows a "My Saves" section listing all saves with name, date, and thumbnail.
2. Clicking a save loads it into Sandbox mode.
3. Each entry has actions: load, rename, delete.
4. Deleting a save asks for confirmation.
5. Empty state explains how to create the first save.

### Story 3.3: Export current scene as `.mpd` file

As a user, I want to download my build as `.mpd`, so I can share it or open it in other LDraw tools.

**Acceptance Criteria:**
1. "Export" button in the toolbar serializes the scene to valid LDraw `.mpd` text.
2. The file downloads via File System Access API (`showSaveFilePicker`) or falls back to anchor download for non-Chromium browsers.
3. Exported `.mpd` round-trips — importing it back produces an identical scene.
4. Exported file includes a header comment crediting LDraw.org.

### Story 3.4: Import `.mpd` / `.ldr` via drag-drop and file picker

As a user, I want to open LDraw files I have locally, so I can continue builds started elsewhere.

**Acceptance Criteria:**
1. Drag-dropping a `.mpd` or `.ldr` onto the canvas opens it in Sandbox mode.
2. Toolbar "Open" button opens a file picker with the same behavior.
3. Imported parts that reference unknown sub-files render as placeholder cubes and log a warning.
4. Importing while a scene is unsaved prompts "Discard unsaved changes?".

### Story 3.5: Bundled sample sets

As a new user, I want to try the app without providing my own files, so I can evaluate it quickly.

**Acceptance Criteria:**
1. Three sample `.mpd` files ship in `public/samples/` — one small (< 20 parts), one medium (~100 parts), one with `0 STEP` markers for Instructions mode.
2. A "Samples" menu lists them with descriptions.
3. Selecting a sample loads it.
4. Samples are license-clean (authored in-house or demonstrably CCAL-compatible community work with attribution).

### Story 3.6: Parts library OPFS cache

As a user, I want returning visits to load instantly, so the app feels responsive after first use.

**Acceptance Criteria:**
1. On first successful part fetch, the raw file is written to OPFS under `/ldraw-parts/<part-name>`.
2. On subsequent requests, OPFS is checked before network.
3. Cache invalidation is keyed by a manifest version (bumping the version clears old cache).
4. Settings modal shows cache size and offers "Clear cache".
5. OPFS unavailable → fallback to IndexedDB blob store; on failure → fetch-every-time.

---

## Epic 4: Instructions Mode

**Epic Goal:** Users can open an `.mpd` with `0 STEP` markers and play through the build step-by-step.

### Story 4.1: Detect step markers and expose playback state

As a developer, I want the scene to know its step boundaries, so I can drive UI from them.

**Acceptance Criteria:**
1. `LDrawLoader`'s step groups are consumed into a `steps[]` state on scene load.
2. If no `0 STEP` markers exist, the scene is treated as 1 step and a banner notes "No step markers found".
3. Each step records the indices of parts added in that step.
4. Current step index is in shared scene state (Zustand).

### Story 4.2: Transport bar UI

As a user, I want Next/Prev controls, so I can move through the build at my pace.

**Acceptance Criteria:**
1. Bottom transport bar shows "Step N of M".
2. Prev, Next, Play, Reset buttons with keyboard bindings (`←/→`, `Space`, `R`).
3. Scrubber slider lets user jump to an arbitrary step.
4. Transport bar hides in Sandbox mode.

### Story 4.3: Step playback with highlight and ghost preview

As a user, I want visual feedback for the current step, so it's clear what's new.

**Acceptance Criteria:**
1. On Next, parts from the new step fade in (300 ms) and are outlined for 2 s.
2. Previously placed parts render at normal opacity.
3. "Ghost mode" toggle shows translucent previews of parts-about-to-be-added before the user presses Next.
4. Prev hides the last step's parts with a matching animation.

### Story 4.4: Parts-for-this-step sidebar

As a user, I want to see the parts list for the current step, so I know what I'd need in real bricks.

**Acceptance Criteria:**
1. Sidebar lists parts added in the current step with thumbnail, part number, color, and count.
2. Sidebar updates on step change.
3. Total parts used so far vs. total in the model shown at top.

### Story 4.5: Switch to Sandbox mid-playback

As a user, I want to tinker with a step's result in Sandbox, so I can explore variations.

**Acceptance Criteria:**
1. A "Edit in Sandbox" button copies the current partial scene into a new Sandbox session.
2. Original Instructions set is unchanged; the Sandbox copy is editable.
3. User can save the Sandbox copy independently.

### Story 4.6: Epic 4 exit — complete a bundled instruction set

As a user, I complete a sample set from step 1 to end without errors.

**Acceptance Criteria:**
1. Bundled medium-complexity instruction set (Story 3.5) plays from step 1 to final step without crash.
2. Every step renders within 500 ms of Next.
3. Final state matches the full model rendered in one shot.

---

## Epic 5: Polish, Performance & Deploy

**Epic Goal:** Meet performance, accessibility, and deployment acceptance bars. MVP is launch-ready.

### Story 5.1: InstancedMesh for repeated parts

As a user, I want large models to render smoothly, so FPS targets are met.

**Acceptance Criteria:**
1. Parts that appear ≥ 4 times in a scene use `InstancedMesh` automatically.
2. A test scene with 1000 identical 2x2 bricks renders at ≥ 30 fps on M1 Chrome.
3. Selection and color change still work on instanced parts.

### Story 5.2: Service worker + app shell caching

As a user, I want the app to work offline after first load, so poor connectivity isn't a blocker.

**Acceptance Criteria:**
1. A service worker registers on first load and caches the app shell.
2. Subsequent visits load the app shell from cache; parts served from OPFS (Story 3.6).
3. Service worker updates are applied on next load with a toast "App updated — refresh to apply".

### Story 5.3: Accessibility pass

As a user with accessibility needs, I want keyboard and screen-reader affordances.

**Acceptance Criteria:**
1. All controls keyboard-reachable; visible focus ring.
2. `@axe-core/react` reports zero violations in dev mode on Home, Sandbox, Instructions, My Saves.
3. `prefers-reduced-motion` disables camera inertia and step animations.
4. Canvas has an ARIA label summarizing scene contents.
5. Color picker swatches have accessible names (color + code).

### Story 5.4: Mobile + responsive fallback

As a mobile user, I want a clear message that the app is desktop-first, so I'm not left with a broken experience.

**Acceptance Criteria:**
1. On screens < 768 px wide, a banner offers a read-only "preview on desktop" message.
2. Read-only mode still renders the scene and allows camera controls.
3. All editing controls hidden or disabled with explanations.

### Story 5.5: Error tracking and user-facing error boundary

As a developer, I want to know when users hit crashes, so I can fix them.

**Acceptance Criteria:**
1. A React error boundary wraps the root; errors show a friendly "Something went wrong — reload" screen.
2. Uncaught errors and unhandled promise rejections log to `console.error` with a structured format.
3. Optional Sentry-lite integration gated behind an environment variable (off by default in MVP).

### Story 5.6: Launch checklist + production deploy

As a stakeholder, I confirm MVP exit criteria and deploy to production.

**Acceptance Criteria:**
1. MVP Success Criteria from project-brief.md verified via manual smoke.
2. Lighthouse scores: Perf ≥ 85, A11y ≥ 90, Best Practices ≥ 90 on mobile preset.
3. About page lists LDraw.org attribution, CCAL 2.0 license, and acknowledgment that "LegoB" is an unofficial fan tool not affiliated with LEGO Group.
4. Production URL announced in README.
5. `CHANGELOG.md` records v1.0.0 release.

---

## Checklist Results Report

_To be populated by `@po` during validation step. This PRD is ready for PO review against `po-master-checklist`._

---

## Next Steps

### UX Expert Prompt

`@ux-design-expert`: Use this PRD and `docs/project-brief.md` to produce `docs/front-end-spec.md` following `front-end-spec-tmpl`. Focus on:
- Component inventory for Sandbox and Instructions modes.
- Interaction flow diagrams for brick placement + snapping.
- Transport bar + step sidebar layout for Instructions mode.
- Keyboard shortcut map.
- Mobile fallback states.
Do not duplicate PRD content; reference it.

### Architect Prompt

`@architect`: Use this PRD, `docs/front-end-spec.md` (when ready), and `.aiox/research/ldraw-three-research.md` to produce `docs/fullstack-architecture.md`. Address:
- Module/package structure (single Vite package, where workers live, where the scene-graph state lives).
- LDraw pipeline (parser worker, geometry cache, instancing strategy, OPFS layout).
- Snapping algorithm detail — the critical complexity risk.
- State management shape (Zustand store slices).
- Persistence layer API (idb wrapper + OPFS).
- CI/CD pipeline and environments.
- Risk register with mitigations for the PRD's NFRs.
- Flag any PRD stories that need revision based on architectural constraints.
