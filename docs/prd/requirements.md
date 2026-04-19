# Requirements

## Functional

- **FR1:** System renders LDraw `.ldr`/`.mpd`/`.dat` files in a 3D scene using WebGL.
- **FR2:** User can orbit, pan, and zoom the camera with mouse. Reset-camera button returns to default iso view.
- **FR3:** User can open a brick palette and place the selected brick into the scene by clicking on a snap target.
- **FR4:** Placed bricks auto-snap to an LDU grid (x/z multiples of 10 LDU; y multiples of 8 LDU) and detected stud positions on hovered bricks.
- **FR5:** User can select a placed brick and rotate it in 90° increments around the Y axis.
- **FR6:** User can select a placed brick and delete it.
- **FR7:** User can select a placed brick and change its color from the LDConfig palette.
- **FR8:** User can import a `.ldr` or `.mpd` file via drag-drop or file-picker.
- **FR9:** User can export the current scene as an `.mpd` download.
- **FR10:** User can save the current scene to browser storage (IndexedDB), naming the save.
- **FR11:** User can list, load, and delete previously saved scenes.
- **FR12:** User can switch to Instructions mode and open a `.mpd` that contains `0 STEP` markers.
- **FR13:** In Instructions mode, Next/Prev controls advance/reverse steps; highlight new parts.
- **FR14:** Ghost preview of parts added in the current step appears before confirmation (toggleable).
- **FR15:** App ships with 2–3 bundled sample `.mpd` sets.
- **FR16:** App caches LDraw parts on first load (OPFS) for offline-capable subsequent loads.
- **FR17:** License/attribution footer credits LDraw.org and CCAL 2.0.
- **FR18:** LDraw parse errors show a user-facing toast; app does not crash.

## Non-Functional

- **NFR1:** Initial JS payload ≤ 3 MB gzipped; parts fetched/cached on demand.
- **NFR2:** Time-to-first-brick P50 ≤ 30 s, P95 ≤ 90 s (fresh visitor).
- **NFR3:** ≥ 60 fps with 500 bricks on M1-class Chrome; ≥ 30 fps with 1000 bricks.
- **NFR4:** Scene saves/loads atomic — failure preserves previous save.
- **NFR5:** No PII collected; no trackers in MVP.
- **NFR6:** Crash-free sessions ≥ 98%.
- **NFR7:** App functions offline after first load (service worker + OPFS).
- **NFR8:** Evergreen Chromium 110+, Firefox 115+, Safari 16.4+.
- **NFR9:** i18n-ready strings (English-only MVP).
- **NFR10:** LDraw parsing off main thread (Web Worker).
- **NFR11:** Keyboard shortcuts for all core actions; WCAG 2.1 AA contrast.
- **NFR12:** No use of LEGO trademark in product name, UI, or marketing copy.

→ Full context: [../prd.md#requirements](../prd.md#requirements)
