# PO Master Checklist — LegoB Validation Report

**Status:** Complete · v1.0 · YOLO autonomous validation by `@po` (aiox-master)
**Date:** 2026-04-19
**Project Type:** 🟢 GREENFIELD · 🎨 UI/UX INCLUDED · ⬜ BROWNFIELD (skipped)
**Artifacts validated:**
- `docs/project-brief.md` (v1.0)
- `docs/prd.md` (v1.0)
- `docs/front-end-spec.md` (v1.0)
- `docs/fullstack-architecture.md` (v1.0)
- `.aiox/research/ldraw-three-research.md`

---

## Executive Summary

Overall readiness: **92% — Conditional GO for sharding and development.**

All four planning artifacts are internally consistent, coverage is complete for the MVP scope described in the brief, and Epic/Story sequencing is sound. There are **2 MUST-FIX** items (both small) and **6 SHOULD-FIX** items to address during Epic 1 — none block sharding or starting Story 1.1. No BLOCKER issues.

**Recommendation: SHARD NOW; FIX in-flight.** The MUST-FIX items are tactical (`.env.example` not committed; LDraw CDN source repo not pinned) and will naturally be handled in Epic 1. Blocking sharding on them would add no value.

---

## Section Results

### 1. PROJECT SETUP & INITIALIZATION — 95%

#### 1.1 Project Scaffolding [GREENFIELD]

- ✅ Epic 1 Story 1.1 explicitly scaffolds Vite + React + TS.
- ✅ Starter template (`vite react-ts`) identified in architecture.
- ✅ All scaffolding steps defined (ESLint, Prettier, Vitest, TS strict).
- ✅ README.md already committed in bootstrap.
- ✅ Repository and initial commit complete (Phase 0).

#### 1.3 Development Environment

- ✅ Local setup documented in architecture ("Development Workflow" section).
- ✅ Tool versions specified (Node 20, npm 10).
- ✅ Install steps listed (`npm install`).
- ✅ Config files (`tsconfig.json`, `vite.config.ts`, `.eslintrc.cjs`, `.prettierrc`) enumerated.
- ✅ Dev server command (`npm run dev`) specified.

#### 1.4 Core Dependencies

- ✅ Critical packages identified: React, Three.js, `@react-three/fiber`, `idb`, Zustand, Radix, Tailwind.
- ✅ Package manager specified (npm) with rationale.
- ✅ Version specifications: concrete (React 18.3+, Three.js 0.160+ pinned).
- ⚠️ **SHOULD-FIX (#S1):** Three.js version should be **exactly pinned** (no `^`) because the app depends on `LDrawLoader` in `three/examples/jsm`, which has changed across minor versions. Architecture says "pinned" but PRD tech list says `0.160+` — reconcile to an exact version during Story 1.2.

**Section Status:** 95% — no blockers.

---

### 2. INFRASTRUCTURE & DEPLOYMENT — 90%

#### 2.1 Database & Data Store Setup

- ✅ IndexedDB schema documented (`scenes`, `kv` stores) with indexes.
- ✅ OPFS layout documented (flat dir + manifest.json).
- ✅ Migration strategy defined (`schemaVersion` + `onupgradeneeded`).
- ✅ Seed data: N/A (no bundled scenes other than samples in `public/`).

#### 2.2 API & Service Configuration

- ✅ N/A — no HTTP API. Worker protocol documented with discriminated unions.
- ✅ Worker client singleton spec included in architecture.
- ✅ Persistence layer API (`SceneRepo`, `PartsCache`) clearly specified.
- ✅ Auth: N/A — no auth.

#### 2.3 Deployment Pipeline

- ✅ CI/CD pipeline defined: GitHub Actions → Cloudflare Pages.
- ✅ `ci.yml` and `deploy.yml` snippets provided.
- ✅ Environments table (dev / preview / prod) populated.
- ✅ Deployment strategy: static + edge CDN, preview per PR.

#### 2.4 Testing Infrastructure

- ✅ Testing frameworks identified (Vitest, Playwright, happy-dom, pixelmatch, axe-core).
- ✅ Test pyramid documented.
- ✅ Test organization documented.
- ✅ Unit/integration/E2E examples provided.

⚠️ **SHOULD-FIX (#S2):** CI pipeline runs unit tests but not Playwright E2E. Add a separate CI job or nightly run for E2E in Story 5.6 (launch checklist).

**Section Status:** 90% — no blockers.

---

### 3. EXTERNAL DEPENDENCIES & INTEGRATIONS — 85%

#### 3.1 Third-Party Services

- ✅ Only external service is jsDelivr (LDraw parts CDN) — no auth needed.
- ✅ No credentials required for parts fetching.
- ✅ Offline fallback defined (OPFS cache).

#### 3.2 External APIs

- ✅ jsDelivr integration point identified (Story 3.6).
- ✅ Rate limits acknowledged (jsDelivr public CDN).
- ✅ Backup strategy: OPFS caches after first fetch.

🟥 **MUST-FIX (#M1):** `VITE_LDRAW_CDN_BASE` in architecture specifies `cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/parts` as a **template** — the actual `{org}/{repo}` and `{tag}` values are NOT pinned. Before Story 1.3 (which loads a sample `.mpd`), research and commit the exact repo/tag. Candidate research: find a maintained CCAL-compliant LDraw mirror on GitHub. If no suitable mirror exists, bundle a curated 30-part set into `public/ldraw-parts/` for MVP and defer CDN to Phase 2.

#### 3.3 Infrastructure Services

- ✅ Cloudflare Pages provisioning documented.
- ⚠️ **SHOULD-FIX (#S3):** DNS / custom domain step not in any story. Either add to Story 5.6 or explicitly defer to post-MVP.
- ✅ CDN setup implicit (Cloudflare Pages IS a CDN).
- N/A email/messaging.

**Section Status:** 85% — one MUST-FIX (parts CDN pinning).

---

### 4. UI/UX CONSIDERATIONS — 98%

#### 4.1 Design System Setup

- ✅ UI framework (React) + libraries (Radix, Tailwind, Lucide) selected early.
- ✅ Design system: minimal custom on Radix primitives — appropriate for scope.
- ✅ Styling approach (Tailwind utility) defined.
- ✅ Responsive strategy (desktop-first with mobile read-only fallback) defined.
- ✅ Accessibility (WCAG AA) defined as gate.

#### 4.2 Frontend Infrastructure

- ✅ Frontend build pipeline (Vite) specified.
- ✅ Asset optimization: tree-shaking, code-splitting, dynamic imports.
- ✅ Frontend testing framework set up in Story 1.1.
- ✅ Component development workflow: co-located tests; storybook **not** included (acceptable for MVP given scope).

#### 4.3 User Experience Flow

- ✅ Three user journeys mapped (first-time sandbox build, instruction playback, import external file).
- ✅ Navigation patterns defined (top toolbar, mode toggle, left rail, right panel).
- ✅ Error states and loading states planned (toasts, skeletons, error boundary).
- ✅ Form validation: minimal (save name) — adequate.

**Section Status:** 98% — exemplary UX documentation.

---

### 5. USER/AGENT RESPONSIBILITY — 100%

#### 5.1 User Actions

- ✅ User responsibilities limited to human-only tasks: `gh auth login` (Phase 0), legal/trademark review, optional Cloudflare account creation.
- ✅ Account creation on external services (Cloudflare, GitHub) assigned to user.
- ✅ No purchasing/payment actions needed.
- ✅ Credentials: user provides Cloudflare API token as GH secret before first deploy.

#### 5.2 Developer Agent Actions

- ✅ All code tasks assigned to `@dev`.
- ✅ Automated CI/CD clearly configured.
- ✅ Testing assigned to `@qa`.
- ✅ Story creation to `@sm`.

**Section Status:** 100%.

---

### 6. FEATURE SEQUENCING & DEPENDENCIES — 94%

#### 6.1 Functional Dependencies

- ✅ Sandbox mode (Epic 2) builds on Foundation (Epic 1).
- ✅ Persistence (Epic 3) requires Sandbox to have something to save.
- ✅ Instructions mode (Epic 4) builds on rendering pipeline (Epic 1) and can coexist with but does not require Sandbox edits.
- ✅ Polish (Epic 5) comes last.
- ✅ No auth dependencies (no auth).

#### 6.2 Technical Dependencies

- ✅ Vite scaffold (1.1) before any other work.
- ✅ Three.js canvas (1.2) before LDraw loader (1.3).
- ✅ Worker parsing (1.4) before Sandbox placement (2.2) — though Sandbox doesn't strictly require worker, it's good hygiene.
- ✅ Data models defined in architecture before stories reference them.

⚠️ **SHOULD-FIX (#S4):** Story 2.3 (stud-on-stud snapping) needs a "stud positions per part" lookup table. Where is this populated? Architecture mentions "pre-computed map keyed by `partNumber`" but no story creates it. **Add a new story 2.3a (or fold into 2.1):** "Generate stud-position lookup table from curated palette parts on build or at first-run."

#### 6.3 Cross-Epic Dependencies

- ✅ Later epics build on earlier ones.
- ✅ No epic requires functionality from a later epic.
- ✅ Infrastructure from Epic 1 used throughout.
- ✅ Incremental value: Epic 1 = viewer, +2 = sandbox, +3 = saves, +4 = instructions, +5 = shippable.

**Section Status:** 94% — one SHOULD-FIX.

---

### 7. RISK MANAGEMENT [BROWNFIELD ONLY]

SKIPPED — Greenfield.

---

### 8. MVP SCOPE ALIGNMENT — 95%

#### 8.1 Core Goals Alignment

- ✅ All project-brief goals (B1-B4 business, U1-U4 user, KPIs) reflected in PRD acceptance criteria.
- ✅ Features directly support MVP goals.
- ✅ No extraneous features (no accounts, no social, no cloud).
- ✅ Critical features (LDraw render, placement, save, instructions) prioritized in Epic 1-4.

#### 8.2 User Journey Completeness

- ✅ All three primary journeys fully specced.
- ✅ Edge cases documented (unknown parts, large files, storage quota, no Web Worker, OPFS unavailable, no step markers).
- ✅ UX considerations included throughout.
- ✅ A11y requirements incorporated (Story 5.3 explicit).

#### 8.3 Technical Requirements

- ✅ All PRD NFRs addressed in architecture (worker for NFR10, instancing for NFR3, service worker for NFR7, etc.).
- ✅ Architecture decisions align with brief constraints (no backend, local-only, CCAL license).
- ✅ Performance NFRs have concrete implementation plans.

⚠️ **SHOULD-FIX (#S5):** NFR11 (keyboard shortcuts for all core actions) mentioned in PRD but no story dedicates effort to verifying complete keyboard coverage. Either fold a "keyboard audit" checklist into Story 5.3 (a11y) or add an explicit AC to each relevant story.

**Section Status:** 95%.

---

### 9. DOCUMENTATION & HANDOFF — 92%

#### 9.1 Developer Documentation

- ✅ API documentation included in architecture (worker protocol, SceneRepo, PartsCache).
- ✅ Setup instructions comprehensive.
- ✅ Architecture decisions documented with rationale.
- ✅ Patterns and conventions (Critical Fullstack Rules + Naming Conventions) documented.

#### 9.2 User Documentation

- ⚠️ **SHOULD-FIX (#S6):** No story creates user-facing docs (FAQ, about page content, keyboard shortcut cheat sheet) beyond the attribution footer. Suggest adding to Story 5.6 or a dedicated story 5.7.
- ✅ Error messages planned (toast variants).
- ✅ Onboarding flow documented (first-time sandbox build).

#### 9.3 Knowledge Transfer

- ✅ Code review planned (CI + PR workflow).
- ✅ Deployment knowledge captured in `deploy.yml`.
- ✅ Historical context preserved in `.aiox/research/`.

**Section Status:** 92%.

---

### 10. POST-MVP CONSIDERATIONS — 100%

#### 10.1 Future Enhancements

- ✅ Clear MVP vs. Post-MVP separation in brief (Phase 2 features + long-term vision).
- ✅ Architecture supports planned enhancements (embed widget → monorepo upgrade path; share-by-link → no backend refactor needed).
- ✅ Technical debt considerations documented (Appendix B: Open Architectural Questions).
- ✅ Extensibility points identified (plugin ecosystem, custom parts).

#### 10.2 Monitoring & Feedback

- ✅ Console-only logging in MVP; Sentry-lite post-MVP.
- ✅ User feedback: deferred to post-MVP; acceptable for MVP.
- ✅ Performance: `web-vitals` logged in dev.
- ✅ No trackers in MVP aligns with privacy stance.

**Section Status:** 100%.

---

## MUST-FIX Items (2)

These must be resolved before or during Epic 1.

### #M1 — Pin the LDraw CDN source

**Where:** `docs/fullstack-architecture.md` → Tech Stack / External APIs.
**Why:** Story 1.3 loads a sample and Story 3.6 caches parts. Without a concrete URL, both stall. Trademark and CCAL attribution must be verified against the chosen mirror.
**Action:** Before Story 1.3 starts, `@architect` or `@dev` identifies a specific GitHub mirror of the LDraw Parts Library (e.g. `gitbrent/LDrawParts` or similar; verify current state) or decides to bundle a curated 30-part subset directly in `public/ldraw-parts/`. Update `VITE_LDRAW_CDN_BASE` with the exact value. Update `.env.example` accordingly.
**Owner:** `@dev` (triggered during Story 1.3 kickoff).

### #M2 — Commit `.env.example`

**Where:** Repo root.
**Why:** Architecture references `cp .env.example .env` as a setup step, but no story creates the file.
**Action:** Add an `.env.example` commit in Story 1.1 (scaffold). Include `VITE_LDRAW_CDN_BASE=` (blank placeholder until #M1 resolves) and `VITE_SENTRY_DSN=`.
**Owner:** `@dev` (Story 1.1).

---

## SHOULD-FIX Items (6)

Non-blocking improvements. Address during the relevant epic.

- **#S1** — Exactly pin Three.js version (no `^`) to prevent `LDrawLoader` API drift. Resolve in Story 1.2.
- **#S2** — Add Playwright E2E job to CI (or a nightly run). Resolve in Story 5.6.
- **#S3** — Custom domain / DNS is not in any story. Either add a line to Story 5.6 or explicitly defer to post-MVP in README.
- **#S4** — Stud-position lookup table. Add a sub-task to Story 2.3 (or a new Story 2.3a) to pre-compute the map for palette parts.
- **#S5** — Keyboard-coverage audit. Fold explicit keyboard ACs into Stories 2.2/2.4/2.5 and the transport bar story (4.2), or add an audit in Story 5.3.
- **#S6** — User documentation (About, FAQ, keyboard cheatsheet). Add Story 5.7 or extend Story 5.6 AC.

---

## Skipped Sections

- **Section 1.2** — Existing System Integration (brownfield only).
- **Section 2.1 DB [brownfield sub-items]**.
- **Section 2.2 API [brownfield sub-items]**.
- **Section 2.3 Deployment [brownfield sub-items]**.
- **Section 2.4 Testing [brownfield sub-items]**.
- **Section 3.x [brownfield sub-items]**.
- **Section 4.x [brownfield sub-items]**.
- **Section 6.x [brownfield sub-items]**.
- **Section 7 — Risk Management (brownfield only).**
- **Section 8.x [brownfield sub-items]**.
- **Section 9.x [brownfield sub-items]**.
- **Section 10.x [brownfield sub-items]**.

---

## Go / No-Go Decision

### ✅ GO — Proceed to Sharding (Phase 2)

- No BLOCKERS.
- MUST-FIX items are tactical and can be resolved inside Epic 1 without reworking planning artifacts.
- SHOULD-FIX items can be handled inline.
- Cross-artifact consistency is excellent; brief → PRD → spec → architecture trace cleanly.

### Pre-Development Checklist

- [x] Brief complete with all sections
- [x] PRD has FRs + NFRs + 5 Epics covering full MVP
- [x] Front-end spec has IA + flows + components + a11y + keyboard map
- [x] Architecture has data models + protocol + tech stack + deployment
- [x] Risk register populated
- [x] No hidden dependencies between epics
- [ ] MUST-FIX #M1 closed (resolve at Story 1.3 kickoff)
- [ ] MUST-FIX #M2 closed (resolve at Story 1.1 kickoff)

---

## Next

`@po` → `*shard-doc docs/prd.md` and `*shard-doc docs/fullstack-architecture.md` to generate development-ready chunks under `docs/prd/` and `docs/architecture/`. Then `@sm` → `*create-story` for Story 1.1.
