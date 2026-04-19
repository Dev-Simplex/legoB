# LegoB

A 3D Lego assembly game that runs in the browser. Snap LDraw-compatible bricks together in a free sandbox or follow step-by-step instructions to build official sets.

**Status:** 🚧 Greenfield — planning phase (Phase 0 complete, Phase 1 pending).

---

## Overview

- **Platform:** Web (browser, WebGL).
- **Renderer:** Three.js (planned — to be confirmed in architecture).
- **Piece library:** [LDraw](https://www.ldraw.org/) — open-source Lego part library.
- **Modes:** Sandbox (free build) + Instructions (guided set assembly).
- **Persistence:** Local only — IndexedDB / File System Access API. No backend, no accounts.

## Project structure

```
legob/
├── .aiox/                  # AIOX framework runtime (config + environment report)
├── docs/                   # Planning artifacts (brief, PRD, spec, architecture)
│   ├── project-brief.md
│   ├── prd.md
│   ├── front-end-spec.md
│   └── fullstack-architecture.md
├── .github/workflows/      # CI pipelines (to be defined)
├── package.json
└── README.md
```

## Development

Planning artifacts are produced by the AIOX `greenfield-fullstack` workflow:

1. `@analyst` → `docs/project-brief.md`
2. `@pm` → `docs/prd.md`
3. `@ux-design-expert` → `docs/front-end-spec.md`
4. `@architect` → `docs/fullstack-architecture.md`
5. `@po` → validates + shards into `docs/prd/` and `docs/architecture/`
6. `@sm` → `@dev` → `@qa` cycle per story.

Implementation scripts (`dev`, `build`, `test`, `lint`) are placeholders until the architect finalizes the stack.

## License

Unreleased / private.
