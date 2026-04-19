# Epic 2 — Sandbox Mode

**Goal:** Let a user freely place, manipulate, and delete bricks. Exit = a user can assemble a meaningful model (≥ 20 bricks across ≥ 2 Y-levels) from a palette of common parts.

## Stories

### Story 2.1 — Parts palette with seeded catalog

**AC:**
1. Left rail renders scrollable palette of ≥ 30 curated LDraw parts (2x2 brick, 2x4 brick, 1x1 plate, 2x2 plate, etc.).
2. Each entry: rendered thumbnail (SVG or pre-rendered PNG) + label.
3. Click palette entry → becomes "active part" (visual indicator).
4. Search input filters palette by label/part-number.
5. Keyboard-navigable: arrow keys move selection, Enter activates.
6. Curated palette ships with `src/data/palette.json` and pre-rendered thumbnails in `public/parts/thumbs/`.

### Story 2.2 — Ground-plane placement with grid snap

**AC:**
1. With active part selected, hovering ground plane shows translucent ghost at snapped position.
2. Snap target = nearest LDU grid point (10-LDU x/z multiples).
3. Left-click places the part.
4. Right-click cancels placement (deselects active part).
5. Escape key also deselects.
6. Placed parts persist across camera changes (no drift).
7. **Keyboard AC:** all actions discoverable via tooltip/help overlay (PO Should-Fix #S5 starts here).

### Story 2.3 — Stud-on-stud placement with snap detection

**AC:**
1. Hovering an existing brick highlights it + projects ghost at snapped stud position above.
2. Snap detection identifies stud positions via sub-file scan (`stud*.dat` primitive refs).
3. Y placement respects brick height (24 LDU brick, 8 LDU plate).
4. When snap fails (no valid stud under cursor) → ghost displays in red; left-click disabled.
5. Works for all 30 curated palette parts.
6. **Sub-task (PO Should-Fix #S4):** Build stud-position lookup table for the curated palette. Can be computed at build time (script in `scripts/compute-stud-positions.ts`) or lazily on first parse. Output committed to `src/data/stud-positions.json`.

### Story 2.4 — Selection, rotation, deletion

**AC:**
1. Click placed brick → selects (outline/glow); click empty space → deselects.
2. `R` rotates selected 90° CW around Y; `Shift+R` = CCW.
3. `Del` / `Backspace` deletes selected.
4. Toolbar buttons mirror keyboard actions.
5. Multi-select is **out of scope for MVP**; single-selection only.

### Story 2.5 — Color change via LDConfig palette

**AC:**
1. Selecting a brick reveals properties panel with color swatch grid (sourced from LDConfig).
2. Click swatch → updates brick color immediately.
3. Current color indicated in swatch grid.
4. `C` opens color picker; focus trapped inside; Escape closes.
5. Material class (solid/transparent/chrome/pearl) matches LDConfig for chosen code.
6. **Material test AC (PO Risk AR5):** swatch grid visually distinguishes solid / transparent / chrome / pearl; smoke test renders one brick of each material class correctly.

### Story 2.6 — Epic 2 exit — freeform build

**AC:**
1. Place 20 varied bricks across ≥ 2 Y-levels with correct snapping.
2. Rotate, recolor, delete subsets.
3. No duplicate placements at same coordinate.
4. FPS ≥ 60 on M1 Chrome during the session.

## Dependencies

- Requires: Epic 1 (rendering pipeline, Three.js canvas).
- Blocks: Epic 3 (persistence needs something to save).

## Next Epic

→ [Epic 3 — Persistence & File IO](./epic-3-persistence.md)
