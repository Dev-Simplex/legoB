# Persistence Layer

Three backing stores, one unified API.

## IndexedDB (`legob` DB)

**Object stores:**
- `scenes` — keyPath `id` (UUID). Index on `updatedAt` for Recent sort.
- `kv` — general-purpose: `schemaVersion`, `settings`, `lastActiveSceneId`, `partsCacheManifestVersion`.

**Migrations:** on DB open, compare stored `schemaVersion` vs. app constant. Run sequential migrations in `onupgradeneeded`. MVP = schema v1.

**Access via `sceneRepo` only** (Critical Rule #2). No component touches IDB directly.

## OPFS (`/ldraw-parts/`)

Flat layout — one file per part: `{partNumber}.dat`.
- Flatten primitives: `p/` → prefixed `p_*.dat`; `parts/s/` → `s_*.dat`.
- `manifest.json` at root: `{ manifestVersion, cachedParts[], bytes }`.
- Bumping `manifestVersion` invalidates entire cache.

**Access via `partsCache`**:

```typescript
export interface PartsCache {
  get(partNumber: string): Promise<string | null>;
  put(partNumber: string, text: string): Promise<void>;
  has(partNumber: string): Promise<boolean>;
  size(): Promise<number>;
  clear(): Promise<void>;
}
```

**Fallback chain:**
1. OPFS (primary)
2. IndexedDB blob store (if OPFS unavailable — detect via `navigator.storage.getDirectory` test)
3. Fetch-every-time (last resort — warn user)

## File System Access API

Explicit user file IO. Chromium-only — fallbacks for FF/Safari.

```typescript
// src/io/fileIo.ts
export async function saveFile(blob: Blob, suggestedName: string): Promise<'saved' | 'downloaded' | 'cancelled'>;
export async function openFile(accept: string): Promise<{ text: string; name: string } | null>;
```

**Fallback behavior:**
- Save: anchor-download `<a href="blob:">`.
- Open: `<input type="file">` shim.
- User cancellation → return `'cancelled'` or `null`; NOT an error.

## `SceneRepo` API

```typescript
export interface SceneRepo {
  save(scene: Scene): Promise<void>;
  load(id: string): Promise<Scene | null>;
  list(): Promise<Array<Pick<Scene, 'id' | 'name' | 'updatedAt' | 'thumbnail'>>>;
  delete(id: string): Promise<void>;
  exportMpd(scene: Scene): Promise<Blob>;
  importMpd(text: string): Promise<Scene>;
}
```

## Atomicity

- Saves = single `readwrite` IDB transaction. Failure does NOT touch the previous record (NFR4).
- Quota guidance: on first save, call `navigator.storage.persist()`. At 80% quota, toast "Storage nearly full — export backups".

→ Full context: [../fullstack-architecture.md#database-schema](../fullstack-architecture.md#database-schema)
