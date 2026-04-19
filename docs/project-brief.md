# Project Brief: LegoB

**Status:** Draft v1.0 · Greenfield · YOLO autonomous draft by `@analyst` (aiox-master)
**Date:** 2026-04-19
**Author:** Ederson Ricieri (with aiox-master orchestration)

---

## Executive Summary

**LegoB** is a browser-based 3D Lego assembly game where users snap LDraw-compatible bricks together in a free sandbox or follow step-by-step instructions to build official sets — entirely in the browser, with no account, no download, and no backend. It targets Lego fans and casual tinkerers who want the joy of building without buying physical sets or installing heavy desktop software. Its differentiator: **zero-friction access** (just a URL) combined with the **authentic LDraw parts library** that serious builders trust.

## Problem Statement

Physical Lego is expensive, space-consuming, and limited by what's in the box. The existing digital options force a trade-off that excludes casual users:

- **BrickLink Studio / LDCad / LeoCAD** — desktop-only, steep learning curve, CAD-oriented UI. Requires install + account.
- **Mecabricks** — web-based but designer-focused; not built around guided assembly.
- **LEGO Builder / LEGO House apps** — simplified, mobile-only, tied to LEGO's own closed catalog and account system.
- **Physical sets** — $$$ per set, geographic limits, no "try before buy".

**Impact:** Millions of AFOLs (Adult Fans of Lego) and casual builders lose out on a lightweight "pick up and build" experience. The web-based, instruction-driven, LDraw-native niche is under-served. Solving it now leverages mature browser 3D (WebGL2/WebGPU), the public LDraw library, and the rising demand for install-free experiences (post-Flash, post-app-fatigue).

## Proposed Solution

A single-page web app that:

1. Loads LDraw parts on demand (no bundled 100MB+ payload).
2. Renders a 3D workspace with Three.js using `LDrawLoader`.
3. Offers two first-class modes:
   - **Sandbox** — drag, snap, rotate, color-swap any brick.
   - **Instructions** — parse `0 STEP` markers in an `.mpd` file and play back the build step-by-step with ghost previews and highlighted next-piece.
4. Persists models to the browser (IndexedDB via `idb`, optional export as `.mpd` via File System Access API).

**Why it wins:**
- Install-free → friction-to-first-brick under 10 seconds.
- LDraw-native → massive existing community parts/models.
- Mode duality → serves both free-play casuals and set-builders.
- Stateless/no backend → zero ongoing infra cost, trivial to open-source.

**Vision:** Become the "Figma-for-Lego" in the browser: the easiest place to explore a build, remix it, and share a link.

## Target Users

### Primary User Segment: Casual Digital Builder

- **Profile:** Ages 12–45, curious about Lego but not committed. Mix of nostalgic adults and creative teens. Uses desktop or laptop primarily; tolerant of mobile as secondary.
- **Current behavior:** Watches Lego YouTube, occasionally buys a set, gives up mid-build. May have tried BrickLink Studio and bounced off complexity.
- **Pain:** Wants the satisfaction of building without the $$$ and shelf space; finds CAD-like tools intimidating.
- **Goals:** Relax, create something visually satisfying, share screenshots with friends.

### Secondary User Segment: LDraw Enthusiast / AFOL

- **Profile:** Deep Lego hobbyist already familiar with LDraw file format. Owns physical sets, may design MOCs (My Own Creations).
- **Current behavior:** Uses LDCad/BrickLink Studio on desktop. Shares models via `.mpd` files on forums.
- **Pain:** Wants a quick way to preview/open `.mpd` links on any device without installing software.
- **Goals:** Validate builds, rehearse instructions, get second opinions from non-AFOL friends via a link.

## Goals & Success Metrics

### Business Objectives

- **B1 — MVP shipped:** Publish MVP to a public URL within 12 weeks of dev start.
- **B2 — Open-source traction:** Reach 500 GitHub stars within 6 months post-launch.
- **B3 — Unique visitors:** 5,000 unique visitors in the first month post-launch.
- **B4 — Zero infra cost:** Hosting cost ≤ $0/mo for first 10k MAU (achievable because no backend).

### User Success Metrics

- **U1 — First brick placed in < 30s** on first visit (time-to-first-brick).
- **U2 — Instruction completion rate ≥ 40%** for a seeded starter set.
- **U3 — Sandbox save rate ≥ 25%** of sessions end with at least one save.
- **U4 — Median session ≥ 8 minutes** (indicates engagement vs. bounce).

### KPIs

- **TTFB (Time to First Brick):** target P50 < 30s, P95 < 90s.
- **FPS during assembly:** P50 ≥ 60 fps, P95 ≥ 30 fps on Chromium/M1-class hardware with ≤ 500 bricks.
- **Crash-free sessions:** ≥ 98%.
- **Save durability:** 0 reported loss of saved models across 1000 saves.

## MVP Scope

### Core Features (Must Have)

- **F1 — LDraw renderer:** Load and render `.ldr`/`.mpd`/`.dat` files using Three.js `LDrawLoader`. Minimum support for ~200 most-common parts.
- **F2 — Camera controls:** Orbit/pan/zoom around the build; reset-camera button.
- **F3 — Sandbox mode — place brick:** Pick a brick from a palette, drop it in the scene, it auto-snaps to the nearest stud of the hovered brick.
- **F4 — Sandbox mode — manipulate brick:** Rotate 90° increments around Y axis; delete selected brick; change color from LDConfig palette.
- **F5 — Instructions mode — playback:** Open an `.mpd` file containing `0 STEP` markers, play steps in order with "Next / Prev" controls. Show ghost of next piece and highlight added pieces.
- **F6 — Save/load local:** Persist current model to IndexedDB (via `idb` library). List saved models, load, delete. Export current model as `.mpd` download.
- **F7 — Open local file:** Drag-drop or file-picker import of user-provided `.mpd` / `.ldr` files.
- **F8 — Starter set:** Ship with 2–3 bundled `.mpd` sample sets that showcase instructions mode.

### Out of Scope for MVP

- User accounts, cloud sync, multi-device.
- Multiplayer / collaboration / sharing links.
- Mobile touch-optimized UX (desktop-first; mobile should not crash but won't be delightful).
- Full 10k+ LDraw parts library (start with curated subset to keep bundle small).
- Physics simulation (gravity, collision). Snapping is enough for MVP.
- Photo-realistic rendering (PBR materials, studio lighting).
- Custom part creation / part editor.
- AI-assisted auto-completion of builds.
- Set marketplace / monetization.
- Localization (English-only MVP; i18n-ready strings).

### MVP Success Criteria

A first-time visitor lands on legob.app, places 10 bricks in sandbox within 2 minutes, saves the model, reloads the page, and sees the saved model — all without creating an account or installing anything. Additionally, a user opens a bundled `.mpd` set and completes the instruction playback from step 1 to end without a crash.

## Post-MVP Vision

### Phase 2 Features

- Touch-friendly mobile UX (gestures for rotate/snap).
- Share-by-link (base64-encoded small models in URL, or Gist-backed larger ones — still backend-less).
- Expanded parts library + color palette.
- Instruction **author mode** — user builds in sandbox, clicks "save as instructions" to generate a playable `.mpd` with auto-stepping.
- Undo/redo stack with multi-level history.
- PBR rendering toggle for "nice screenshot" mode.

### Long-term Vision (1–2 years)

LegoB becomes the default way people prototype, preview, and share Lego-style MOCs on the web — a lightweight, community-owned counterpart to LEGO's closed apps. Optional opt-in sync layer (user-provided Gist / IPFS / S3-compatible bucket), still no proprietary backend.

### Expansion Opportunities

- Plugin ecosystem for custom parts / custom rendering styles.
- Educational mode (physics experiments, math puzzles).
- Embed widget for blogs/forums to display a 3D model inline.
- Integration with 3rd-party part databases (BrickLink catalog for reference).

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web (desktop-first). Chromium 110+, Firefox 115+, Safari 16.4+.
- **Browser/OS Support:** WebGL2 required; WebGPU progressive enhancement where available. Desktop OS agnostic. Mobile works but not optimized.
- **Performance Requirements:** 60 fps with 500 bricks on M1-class hardware; 30 fps baseline with 1000 bricks. Bundle size < 3MB gzipped initial payload (parts lazy-loaded).

### Technology Preferences

- **Frontend:** Three.js + `LDrawLoader` (from `three/examples/jsm`). UI framework TBD by architect (likely React or Svelte — lean toward React for community/AI-tooling support, or Svelte for bundle size).
- **Backend:** None. All state client-side.
- **Database:** Browser IndexedDB (via `idb` wrapper). File System Access API for optional disk export.
- **Hosting/Infrastructure:** Static hosting (Cloudflare Pages / Vercel free tier / GitHub Pages). CDN for parts library (jsDelivr mirror of LDraw).

### Architecture Considerations

- **Repository Structure:** Monorepo with a single `apps/web` (no backend package needed). Could flatten to single package until Phase 2.
- **Service Architecture:** Pure client-side SPA. Worker thread for LDraw parsing of large models.
- **Integration Requirements:** Fetch LDraw parts from public CDN (jsDelivr) at runtime or lazy-download + cache. No third-party APIs.
- **Security/Compliance:** No PII collected. All storage local. No trackers in MVP. Respect LDraw CCAL license for parts redistribution. Do not use the word "LEGO" as a trademark in branding (use "Lego-style bricks" in copy); app name "LegoB" may need legal review.

## Constraints & Assumptions

### Constraints

- **Budget:** Zero infra budget ($0/mo). Dev time is the only cost.
- **Timeline:** MVP target ≤ 12 weeks of part-time dev.
- **Resources:** Single developer (user) + AIOX agents. No dedicated designer or QA.
- **Technical:** Local-only persistence. No backend services. Must run in current evergreen browsers.

### Key Assumptions

- LDraw community will remain active and parts library remains accessible.
- `LDrawLoader` in Three.js is production-grade enough to render MVP scenes without major forks.
- Users have a modern browser and decent GPU (intel integrated or better).
- Stud-to-antistud snapping can be approximated geometrically without relying on explicit LDraw connectivity metadata (which is incomplete across the parts library).
- LEGO Group does not issue a C&D over the name "LegoB" (low risk if we avoid trademark use in UI and call it "Lego-style / LDraw-based").

## Risks & Open Questions

### Key Risks

- **R1 — Trademark (LEGO):** Using "Lego" in the product name could attract legal attention. Impact: rebrand. Mitigation: early legal review; have a plan-B name.
- **R2 — LDraw parsing performance:** Large `.mpd` files (1000+ parts) may stall main thread. Impact: jank, bad UX. Mitigation: parse in Web Worker, lazy instantiation.
- **R3 — Snapping correctness:** Without connector metadata, geometric snapping may mis-align in rare part shapes. Impact: frustrating UX. Mitigation: start with flat-plate and rectangular bricks; document limits for MVP.
- **R4 — Browser storage limits:** IndexedDB quota varies (50MB–unlimited). Large save collections could hit limits. Impact: save failures. Mitigation: warn user, export as file fallback.
- **R5 — Single-developer scope:** 12-week estimate is aggressive for a solo dev. Impact: slip. Mitigation: tight MVP, defer mobile/author mode to Phase 2.

### Open Questions

- Which UI framework — React, Svelte, or vanilla? (architect to decide)
- What's the snapping algorithm baseline — grid-based, or nearest-stud-detection via raycasting?
- Do we ship with a bundled parts subset, or fetch all at runtime?
- Is there a license-safe default brick set if LDraw can't be bundled?
- How do we handle `0 STEP` in `.mpd` files that don't have explicit step markers (e.g., submodel-per-step)?

### Areas Needing Further Research

- Deep dive on `LDrawLoader` limitations (color handling, material quality, performance ceilings).
- Comparison of stud-snapping implementations across BrickLink Studio / LeoCAD / Mecabricks.
- Survey of existing open-source web LDraw viewers for reusable components.
- Legal memo on LEGO trademark boundaries in app naming/branding.
- IndexedDB quota behavior across Chrome/Firefox/Safari for 100MB+ save sets.

## Appendices

### A. Research Summary

Technical research agent dispatched in parallel (see `.aiox/research/ldraw-three-research.md` after completion). Findings will populate architecture-level decisions. Preliminary knowledge supports: (a) `LDrawLoader` exists and is maintained in three/examples; (b) BrickLink Studio and LPub3D are primary reference apps; (c) LDraw CCAL license permits redistribution with attribution.

### B. Stakeholder Input

Primary stakeholder: Ederson Ricieri (user, developer, product owner). Single-stakeholder project; preferences captured in discovery questions (web-only, LDraw, local-only, both modes, name=LegoB).

### C. References

- LDraw official site & Parts Library — https://www.ldraw.org/
- Three.js LDrawLoader — https://threejs.org/docs/#examples/en/loaders/LDrawLoader
- LDraw CCAL license — https://www.ldraw.org/article/398.html
- BrickLink Studio — https://www.bricklink.com/v3/studio/download.page
- LeoCAD — https://www.leocad.org/
- Mecabricks — https://www.mecabricks.com/
- LPub3D (instruction authoring) — https://trevorsandy.github.io/lpub3d/

## Next Steps

### Immediate Actions

1. Hand this brief to `@pm` → produce `docs/prd.md` with epics for Sandbox, Instructions, Persistence, Parts Library, and Platform Foundation.
2. Incorporate technical research findings (when agent returns) into `@architect` architecture doc.
3. Flag LEGO trademark risk for lightweight legal sanity-check before branding work in `@ux-design-expert`.
4. `@architect` to pick UI framework + bundler + state library.
5. `@po` validates brief + downstream PRD and architecture against the `po-master-checklist`.

### PM Handoff

This Project Brief provides the full context for **LegoB**. `@pm`, please enter **PRD Generation Mode** and produce `docs/prd.md` following `prd-tmpl.yaml`. Pay particular attention to:

- Breaking **Sandbox** and **Instructions** into separate epics with distinct stories.
- Elevating **LDraw parsing / parts management** to its own foundational epic (it gates everything).
- Ensuring **snapping algorithm** is called out as an explicit story with acceptance criteria, not buried in "placement".
- Aligning MVP Success Criteria in this brief with the PRD's Epic 1 exit criteria.
