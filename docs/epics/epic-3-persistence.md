# Epic 3 — Persistence & File IO

**Goal:** Builds survive tab reloads and can be shared via `.mpd` export/import. Bundled sample sets accessible. Exit = user can close the tab, return, and resume.

## Stories

### Story 3.1 — Serialize scene to JSON and save to IndexedDB

**AC:**
1. "Save" button serializes scene (list of `{partNumber, colorCode, position, rotationY}`) to JSON blob.
2. Stored in IndexedDB (via `idb`) under `scene:<uuid>` with metadata `{name, createdAt, updatedAt, thumbnail}`.
3. Naming prompt on first save; subsequent saves overwrite.
4. Success toast on save; failure toast with error.
5. `navigator.storage.persist()` requested on first save.
6. All IndexedDB access goes through `sceneRepo` (per architecture's Critical Fullstack Rules).

### Story 3.2 — "My Saves" view

**AC:**
1. Home screen shows "My Saves" section listing saves with name, date, thumbnail.
2. Click a save → loads it into Sandbox.
3. Per-entry actions: load, rename, delete.
4. Delete confirms.
5. Empty state explains how to create first save.

### Story 3.3 — Export current scene as `.mpd`

**AC:**
1. "Export" button in toolbar serializes scene to valid LDraw `.mpd` text (via `mpdWriter`).
2. Downloads via File System Access API (`showSaveFilePicker`) or anchor-download fallback for non-Chromium.
3. Exported `.mpd` round-trips — importing back → identical scene.
4. Exported file includes header comment crediting LDraw.org.

### Story 3.4 — Import `.mpd` / `.ldr` via drag-drop and file picker

**AC:**
1. Drag-drop `.mpd`/`.ldr` on canvas → opens in Sandbox.
2. Toolbar "Open" button → file picker with same behavior.
3. Unknown sub-file refs render as placeholder cubes + log warning.
4. Importing with unsaved changes → prompt "Discard unsaved changes?".
5. File size > 50 MB → reject with user message (per architecture Security Requirements).

### Story 3.5 — Bundled sample sets

**AC:**
1. Three sample `.mpd` files in `public/samples/`: small (< 20 parts), medium (~100 parts), one with `0 STEP` markers for Instructions mode.
2. "Samples" menu lists them with descriptions.
3. Selecting a sample → loads it.
4. Samples license-clean (authored in-house or demonstrably CCAL-compatible with attribution).

### Story 3.6 — Parts library OPFS cache

**AC:**
1. On first successful part fetch, raw file written to OPFS `/ldraw-parts/<part-name>`.
2. Subsequent requests → OPFS before network.
3. Cache invalidation via manifest version bump (clears old cache).
4. Settings modal shows cache size + "Clear cache" button.
5. OPFS unavailable → fallback to IndexedDB blob store; failure → fetch-every-time (per architecture Risk AR2).

## Dependencies

- Requires: Epic 2 (Sandbox produces scenes to save).
- Blocks: Epic 4 (Instructions mode needs samples).

## Next Epic

→ [Epic 4 — Instructions Mode](./epic-4-instructions.md)
