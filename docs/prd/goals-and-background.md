# Goals & Background

## Goals

- Zero-install, browser-based 3D Lego assembly; first-time visitor places a brick in < 30s.
- Two first-class MVP modes: free-form **Sandbox** and guided **Instructions** playback.
- **LDraw** as authoritative piece format — community `.mpd` files open natively.
- 60 fps @ 500 bricks on M1; ≥ 30 fps @ 1000 bricks.
- Zero backend, zero accounts, zero infra cost.
- 5,000 unique visitors in month 1; 500 GitHub stars in 6 months.

## Background

Physical Lego is expensive and space-bound; desktop builders (BrickLink Studio, LDCad, LeoCAD) require installs and CAD fluency; LEGO's apps are closed-catalog and mobile-only. The intersection of **browser-native**, **LDraw-compatible**, and **instruction-driven** is under-served. Modern browser APIs (WebGL2, File System Access, IndexedDB, OPFS, `LDrawLoader`, Web Workers) now make a pure-client build feasible; LDraw CCAL permits redistribution.

→ Full context: [../prd.md#goals-and-background-context](../prd.md#goals-and-background-context)
