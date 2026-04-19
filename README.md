# LegoB

A 3D Lego assembly game that runs in the browser. Snap LDraw-compatible bricks together in a free sandbox or follow step-by-step instructions to build official sets.

**Status:** 🚧 Greenfield · Phase 3 · Story 1.1 scaffold in place.

---

## Overview

- **Platform:** Web (browser, WebGL).
- **Renderer:** Three.js (arrives in Story 1.2).
- **Piece library:** [LDraw](https://www.ldraw.org/) — open-source Lego part library. CCAL 2.0.
- **Modes:** Sandbox (free build) + Instructions (guided set assembly).
- **Persistence:** Local only — IndexedDB / File System Access API. No backend, no accounts.

## Quickstart

```bash
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
npm test               # run Vitest in watch mode
npm run typecheck
npm run lint
npm run build
npm run preview        # preview production build
```

Requires Node **20 LTS** or newer.

## Project structure

```
legob/
├── .aiox/                          # AIOX runtime + research
├── .github/workflows/              # CI (Story 1.1)
├── docs/                           # Planning artifacts
│   ├── project-brief.md
│   ├── prd.md  &  prd/             # full + sharded
│   ├── front-end-spec.md
│   ├── fullstack-architecture.md  &  architecture/
│   ├── epics/                      # per-epic story shards
│   ├── stories/                    # @sm-drafted stories
│   └── po-validation-report.md
├── public/                         # static assets (samples, part thumbs)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── styles/globals.css
└── package.json
```

## Development workflow

Artifacts produced by the AIOX `greenfield-fullstack` workflow:

1. ✅ `@analyst` → `docs/project-brief.md`
2. ✅ `@pm` → `docs/prd.md`
3. ✅ `@ux-design-expert` → `docs/front-end-spec.md`
4. ✅ `@architect` → `docs/fullstack-architecture.md`
5. ✅ `@po` → validated + sharded
6. 🚧 `@sm` → `@dev` → `@qa` cycle in progress (Story 1.1 complete).

## Attribution

LDraw™ is a registered trademark of the LDraw.org community. The LDraw Parts Library is distributed under the [Creative Commons Attribution 2.0 license (CCAL 2.0)](https://www.ldraw.org/article/398.html).

LegoB is an **unofficial fan project** and is NOT affiliated with, endorsed by, or sponsored by the LEGO Group. "LEGO" is a trademark of the LEGO Group.

## License

MIT (pending; see [LICENSE](./LICENSE) once added in Story 5.6).
