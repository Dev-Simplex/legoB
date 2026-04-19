# Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|----|------|-----------|--------|-----------|-------|
| **AR1** | `LDrawLoader` hidden perf cliff on large `.mpd` | M | H | Worker + instancing; prototype with 1000-part `.mpd` in Epic 1 | @dev (Epic 1) |
| **AR2** | OPFS unavailable on some browsers (older Safari) | M | M | Fallback to IndexedDB blob store; feature-detect | @dev (Story 3.6) |
| **AR3** | Snapping edge cases with non-rectangular parts | H | M | MVP limits palette to flat/rect parts; document limitation | @ux (Story 2.1) + @dev (Story 2.3) |
| **AR4** | LEGO trademark pushback on name | M | H | Codename only until legal review; don't use LEGO in copy | User (legal review) |
| **AR5** | LDConfig material variants render wrong (chrome/pearl) | M | M | Story 2.5 explicitly tests each material class | @qa (Story 2.5) |
| **AR6** | Worker bundle grows too large (three.js) | L | M | Tree-shake; consider loading Three.js dynamically on first scene | @dev (Story 1.4) |
| **AR7** | IndexedDB corruption on quota exhaustion | L | H | Atomic writes; transaction per save; export prompt at 80% quota | @dev (Story 3.1) |
| **AR8** (derived) | Pinned LDraw CDN mirror goes stale / unavailable | L | H | `partsCache` serves from OPFS after first load; fallback to bundled curated parts | @dev (Story 3.6) |
| **AR9** (derived) | Single-developer-scope slip on 12-week MVP timeline | M | M | Strict MVP; aggressive cut (no multi-select, no mobile editor); ship Epic 1-3 if time-boxed | User (scope policing) |

## Mitigation tracking

Each risk has a clear owner and a story/epic checkpoint. When a mitigation story lands, cross-check that risk's mitigation is materially implemented.

→ Full context: [../fullstack-architecture.md#appendix-a-risk-register](../fullstack-architecture.md#appendix-a--risk-register)
