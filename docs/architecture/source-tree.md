# Source Tree

```
legob/
├── .aiox/
│   ├── config.yaml
│   ├── environment-report.json
│   └── research/
│       └── ldraw-three-research.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/
│   ├── project-brief.md
│   ├── prd.md                     # full PRD (source)
│   ├── prd/                       # sharded PRD for dev agents
│   ├── front-end-spec.md
│   ├── fullstack-architecture.md  # full architecture (source)
│   ├── architecture/              # sharded architecture
│   ├── epics/                     # per-epic story shards
│   ├── stories/                   # @sm creates one file per story here
│   └── po-validation-report.md
├── public/
│   ├── samples/
│   │   ├── sample-car.mpd
│   │   ├── sample-house.mpd
│   │   └── sample-castle-instructed.mpd
│   └── parts/
│       └── thumbs/                # pre-rendered palette thumbnails
├── scripts/
│   └── compute-stud-positions.ts  # Story 2.3 build-time helper
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.ts              # route enum
│   │   └── main.tsx               # React entry
│   ├── ui/                        # presentational chrome
│   │   ├── Button/
│   │   ├── IconButton/
│   │   ├── Toast/
│   │   ├── Modal/
│   │   ├── PaletteEntry/
│   │   ├── PropertyRow/
│   │   ├── ColorSwatchGrid/
│   │   ├── SaveCard/
│   │   └── TransportBar/
│   ├── scene/
│   │   ├── SceneContainer.tsx
│   │   ├── SandboxScene.tsx
│   │   ├── InstructionsScene.tsx
│   │   ├── Ground.tsx
│   │   ├── GhostPreview.tsx
│   │   ├── InstancedParts.tsx
│   │   └── snap/
│   │       ├── computeSnap.ts
│   │       ├── studPositions.ts
│   │       └── snap.test.ts
│   ├── state/
│   │   ├── useModeStore.ts
│   │   ├── useSceneStore.ts
│   │   ├── usePaletteStore.ts
│   │   ├── usePlaybackStore.ts
│   │   └── useSettingsStore.ts
│   ├── io/
│   │   ├── sceneRepo.ts
│   │   ├── partsCache.ts
│   │   ├── fileIo.ts
│   │   ├── mpdWriter.ts
│   │   └── mpdReader.ts
│   ├── workers/
│   │   ├── ldrawWorker.ts
│   │   ├── ldrawClient.ts
│   │   └── protocol.ts
│   ├── types/
│   │   └── domain.ts
│   ├── data/
│   │   ├── palette.json
│   │   ├── LDConfig.json
│   │   └── stud-positions.json    # generated; see scripts/
│   └── styles/
│       └── globals.css
├── tests/
│   ├── integration/
│   ├── e2e/
│   └── visual/
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tailwind.config.ts
├── postcss.config.cjs
├── README.md
├── LICENSE
└── CHANGELOG.md
```

→ Full context: [../fullstack-architecture.md#unified-project-structure](../fullstack-architecture.md#unified-project-structure)
