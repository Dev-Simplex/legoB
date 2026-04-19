# Epic 4 — Instructions Mode

**Goal:** Users can open an `.mpd` with `0 STEP` markers and play through the build step-by-step. Exit = user completes a bundled set from step 1 to end.

## Stories

### Story 4.1 — Detect step markers and expose playback state

**AC:**
1. `LDrawLoader`'s step groups consumed into `steps[]` on scene load.
2. If no `0 STEP` markers → treat as 1 step + banner "No step markers found".
3. Each step records indices of parts added in that step.
4. Current step index in `usePlaybackStore` (Zustand).

### Story 4.2 — Transport bar UI

**AC:**
1. Bottom transport bar shows "Step N of M".
2. Prev, Next, Play, Reset buttons with keyboard bindings (`←/→`, `Space`, `R`).
3. Scrubber slider jumps to arbitrary step.
4. Transport bar hidden in Sandbox mode.

### Story 4.3 — Step playback with highlight and ghost preview

**AC:**
1. On Next, parts from new step fade in (300 ms) + outlined for 2 s.
2. Previously placed parts render at normal opacity.
3. Ghost mode toggle shows translucent previews before user presses Next.
4. Prev hides last step's parts with matching animation.
5. Animations respect `prefers-reduced-motion`.

### Story 4.4 — Parts-for-this-step sidebar

**AC:**
1. Sidebar lists parts added in current step: thumbnail, part number, color, count.
2. Updates on step change.
3. Total parts-used-so-far vs. total-in-model shown at top.

### Story 4.5 — Switch to Sandbox mid-playback

**AC:**
1. "Edit in Sandbox" button copies current partial scene to new Sandbox session.
2. Original Instructions set unchanged; Sandbox copy editable.
3. User can save the Sandbox copy independently.

### Story 4.6 — Epic 4 exit — complete a bundled instruction set

**AC:**
1. Bundled medium-complexity instruction set (Story 3.5) plays start-to-end without crash.
2. Every step renders within 500 ms of Next.
3. Final state matches the full model rendered in one shot.

## Dependencies

- Requires: Epic 1 (renderer, worker), Epic 3 (sample sets).
- Independent of Epic 2 (Sandbox and Instructions are parallel UX paths).

## Next Epic

→ [Epic 5 — Polish, Performance & Deploy](./epic-5-polish.md)
