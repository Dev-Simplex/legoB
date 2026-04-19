# Technical Assumptions

## Repository Structure

Single package for MVP (upgrade to pnpm workspaces in Phase 2 if needed).

## Service Architecture

Client-only SPA. No servers. Static hosting (Cloudflare Pages). All compute in the browser. Parts from jsDelivr mirror cached in OPFS.

## Testing Requirements

- **Unit:** Vitest
- **Integration:** Vitest + happy-dom
- **E2E:** Playwright + pixelmatch for visual diffs
- **Manual smoke** per release

## Stack (definitive)

- **UI:** React 18 + TypeScript (strict) + Radix UI + Tailwind
- **Bundler:** Vite 5
- **State:** Zustand
- **3D:** Three.js (pinned) + `@react-three/fiber` + `@react-three/drei`
- **LDraw:** `LDrawLoader` from `three/examples/jsm`
- **Storage:** `idb` for IndexedDB, native OPFS for parts cache, File System Access API with fallback
- **Icons:** Lucide
- **CI/CD:** GitHub Actions → Cloudflare Pages
- **License:** MIT for app code; CCAL attribution for LDraw parts

→ Full context: [../prd.md#technical-assumptions](../prd.md#technical-assumptions) · [../fullstack-architecture.md#tech-stack](../fullstack-architecture.md#tech-stack)
