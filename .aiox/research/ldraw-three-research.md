# LegoB Technical Research — LDraw / Three.js / Browser Persistence

**Generated:** 2026-04-19 by research sub-agent (training cutoff Jan 2026)
**Consumer:** `@architect` (primary), `@pm` (PRD technical assumptions), `@dev` (implementation)

Items flagged `[unverified]` were not web-confirmed and should be double-checked before final commitment.

---

## 1. LDraw Format

- Plain text. File types: **.dat** (part/primitive), **.ldr** (model), **.mpd** (multi-part document — multiple .ldr files concatenated, delimited by `0 FILE <name>` / `0 NOFILE`).
- Line types start with an integer:
  - `0` — comment / meta (`0 STEP`, `0 BFC`, `0 !LDRAW_ORG`, `0 FILE`)
  - `1` — sub-file reference: `1 <colour> x y z a b c d e f g h i <file>` (3×4 transform: 3×3 rotation + translation)
  - `2`/`3`/`4` — line / triangle / quad
  - `5` — optional line (smoothing hint)
- Units: **LDU** (LDraw Units). Stud width = **20 LDU**. Brick height = **24 LDU**. Plate height = **8 LDU**.
- Primitives in `p/` (and `p/48/` hi-res). Parts in `parts/` reference primitives and sub-parts.
- **Colors** via `LDConfig.ldr` — integer code → RGB + material metadata (metallic/transparent/chrome/rubber/pearl/glitter). Code `16` = "inherit from parent"; code `24` = "edge color".
- Official parts: LDraw.org Parts Library, distributed as `complete.zip` / `ldraw.zip`.

## 2. LDraw → Three.js

- **`three/examples/jsm/loaders/LDrawLoader.js`** is the de facto standard. Capabilities:
  - Recursive .ldr/.mpd/.dat parsing with sub-file resolution
  - LDConfig color codes (incl. 16, 24)
  - BFC metadata
  - **Step groups** — `0 STEP` is exposed as groups → drives instruction playback natively
  - Type-5 optional-line edge smoothing
  - Chrome/pearl/matte/metallic materials
  - `LDrawUtils.mergeObject` for flattening static subtrees
- Known limits:
  - No connector/snap metadata (pure geometry)
  - Large models: each ref creates own Object3D+BufferGeometry → performance cliff without merging or `InstancedMesh`
  - Assumes HTTP-accessible parts dir; custom bundling needs a custom file cache loader
  - Texture decals (stickers, printed tiles) historically patchy `[unverified current]`
- Alternatives:
  - `three-ldraw` forks — mostly superseded
  - **Brigl** (older, unmaintained `[unverified]`) — full builder UI, instructive reference
  - LDCad / LeoCAD — native desktop, not browser
  - Mecabricks — proprietary format

**Perf playbook:** `InstancedMesh` for repeated parts; merge static geometry per step; Web Worker for parsing; `Map<partFile, parsedGeom>` cache.

## 3. Snapping / Connectivity

- **No official LDraw connectivity standard.** Connectivity is an ecosystem extension.
- LDCad ships its own connector DB (stud/anti-stud/axle/clip/hinge with orientation+gender) via sidecar files. Partially `[unverified]`.
- BrickLink Studio uses proprietary connectivity.
- LeoCAD = grid snapping only.
- Mecabricks = internal graph.

**Practical approach for LegoB MVP:**
- **LDU grid snap**: x/z multiples of 10 LDU (half-stud); y multiples of 8 LDU (plate height). Covers ~80% of stud-on-stud.
- Augment via **primitive detection**: during load, scan sub-file refs for `stud*.dat` to locate stud positions and known anti-stud primitives as connection targets.
- Full physical connectivity (hinges/Technic) → defer post-MVP; would require LDCad-style connector DB.

## 4. Instruction Playback

- LDraw has a **native step marker**: `0 STEP` meta line. `0 ROTSTEP` adds viewing-rotation hints. `0 BUFEXCHG` supports temp sub-assemblies.
- → A plain .ldr/.mpd can drive step-by-step UI without extra metadata: accumulate parts until STEP.
- Three.js `LDrawLoader` **already exposes steps as groups** — iterate and toggle visibility for playback.
- **LPub3D** (desktop, open source) is the dominant instruction authoring tool; uses `0 !LPUB` meta extensions for callouts/PLI/page layout. Rich features require LPub meta parsing.
- `[unverified]` — Blockhouse as web instruction viewer.

## 5. Browser Persistence

- **IndexedDB** (via `idb` by jakearchibald, or Dexie) → structured app data, many small records, autosave. Quota: hundreds of MB–GBs, persist via `navigator.storage.persist()`.
- **OPFS** (Origin Private File System) → large binary blobs, streaming writes. Good for caching LDraw parts library (~80 MB unzipped `[unverified current size]`).
- **File System Access API** (`showSaveFilePicker`) → explicit "Save as .mpd". Chromium-only; Firefox/Safari → download fallback.

**Recommended stack:** idb/Dexie for project metadata + scene JSON, OPFS for parts cache, File System Access API (with fallback) for user-facing file IO. Typical user creation = tens of KB to a few MB of .mpd text.

## 6. Reference Projects

Low confidence on specific repo names — search GitHub for `ldraw three.js`:
- `mrdoob/three.js` → `examples/webgl_loader_ldraw.html` (canonical minimal reference)
- **Brigl** `[unverified]` — older full web builder, instructive
- Several hobbyist ldraw-web-viewer repos `[unverified]`
- Mecabricks (closed, UX reference)
- BrickSim / bricksimple `[unverified]`

## 7. Licensing / Legal

- **LEGO** is a trademark. LEGO Group is aggressive. Cannot use "LEGO" in product name, logo, or marketing.
- **"LegoB" is risky** → recommend rebrand before public launch. Placeholder OK during dev.
- **LDraw Parts Library** = **CCAL 2.0** (Creative Commons Attribution). May redistribute/bundle/modify with attribution + license text. See `ldraw.org/article/398.html` `[unverified URL]`.
- Bundling vs. runtime fetch — both legal under CCAL.
- Community .mpd files on Rebrickable/OMR → CCAL as community work, but individual **set designs** are LEGO IP. Shipping a catalog of 1:1 set recreations = gray area. Safer: let users import their own.

---

## Architecture decisions this research enables

1. **Renderer stack:** Three.js + `LDrawLoader` (no fork needed for MVP).
2. **Parts source:** Bundle a curated subset (~200 most common parts) in OPFS on first load from jsDelivr/CDN mirror of ldraw.org. Full library deferred.
3. **Snapping baseline:** LDU grid-snap (10 LDU xz half-stud, 8 LDU y) + stud-primitive detection. Explicit connector DB = post-MVP.
4. **Instructions:** Consume `0 STEP` natively via `LDrawLoader` group exposure. No custom step format. LPub meta parsing = post-MVP.
5. **Persistence:** `idb` (Dexie optional) for scenes + metadata; OPFS for parts cache; File System Access API (Chromium) + download fallback.
6. **Performance plan:** Web Worker for parse; `InstancedMesh` for repeated parts; merge static geometry per step; part geom cache.
7. **Branding:** Treat "LegoB" as codename. Legal review before public marketing. Prefer "brick-style" in user-facing copy.
