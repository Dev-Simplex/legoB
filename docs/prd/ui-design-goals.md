# UI Design Goals

"Figma for bricks." Canvas-first layout, thin collapsible chrome, keyboard-first power moves, non-blocking feedback. Full spec lives in [`../front-end-spec.md`](../front-end-spec.md).

## Core Screens

- Home / Launch
- Sandbox Mode (canvas + left palette + contextual right properties panel + top toolbar)
- Instructions Mode (canvas + bottom transport + right parts-for-step sidebar + top toolbar)
- My Saves (grid of thumbnails)
- Settings modal

## Accessibility

WCAG 2.1 AA on UI chrome. Canvas paired with textual scene-contents alternative. Keyboard parity for every mouse action. `prefers-reduced-motion` respected.

## Branding

Codename **LegoB** (pre-legal-review). Internal-only. User-facing copy uses "Brick Builder" placeholder; no LEGO trademark anywhere.

## Target Devices

Web Responsive · desktop-first. Tablet functional. Mobile < 768 px = read-only fallback with "best on desktop" banner.

→ Full context: [../prd.md#user-interface-design-goals](../prd.md#user-interface-design-goals)
