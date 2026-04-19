# Tech Stack

**Definitive** — all development uses these exact choices. No substitutions without RFC.

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Language | TypeScript | 5.4+ (strict) | Type safety |
| UI | React | 18.3+ | UI runtime |
| UI primitives | Radix UI | 1.x | Accessible unstyled components |
| Styling | Tailwind CSS | 3.4+ | Utility styling |
| State | Zustand | 4.5+ | App state |
| 3D | Three.js | **pinned exact** (0.160.x or current LTS) | WebGL renderer — pin exactly (PO Should-Fix #S1) |
| 3D React bridge | @react-three/fiber | 8.15+ | Declarative R3F |
| 3D helpers | @react-three/drei | 9.x | OrbitControls, Stats |
| LDraw | `LDrawLoader` from three/examples/jsm | bundled | Parse LDraw |
| Persistence | idb | 8.x | IndexedDB wrapper |
| File IO | File System Access API | native + fallback | Save/Open |
| Icons | Lucide React | latest | Icon set |
| Bundler | Vite | 5.x | Dev + build |
| Unit tests | Vitest | 1.x | Fast, Vite-native |
| DOM tests | happy-dom | 14.x | jsdom alternative |
| E2E | Playwright | 1.4x | Integration + visual |
| Visual diff | pixelmatch | 5.x | Screenshot diff |
| A11y | @axe-core/react | 4.x | Runtime a11y checks |
| Lint | ESLint | 8.x (or 9 flat) | Lint |
| Format | Prettier | 3.x | Format |
| CI | GitHub Actions | — | Lint/test/deploy |
| Host | Cloudflare Pages | — | Static + edge CDN |
| Pkg manager | npm | ≥ 10 | Dependency mgmt |
| Node runtime | Node.js | 20 LTS | Build-time only |

## Explicitly NOT in stack

Next.js, Remix, GraphQL, Redux, any CSS-in-JS runtime, any backend framework, any database server, Docker.

→ Full context: [../fullstack-architecture.md#tech-stack](../fullstack-architecture.md#tech-stack)
