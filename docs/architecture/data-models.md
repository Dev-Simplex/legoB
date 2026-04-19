# Data Models

All TypeScript interfaces live in `src/types/domain.ts` (source of truth for shared types).

## `Part`

A single brick placed in the scene.

```typescript
export interface Part {
  id: string;                                     // stable UUID
  partNumber: string;                             // LDraw filename w/o .dat (e.g. "3001")
  colorCode: number;                              // LDConfig integer (e.g. 4 = red)
  position: readonly [number, number, number];    // LDU coordinates
  rotationY: 0 | 90 | 180 | 270;                  // quantized Y rotation
  stepIndex: number | null;                       // null in pure Sandbox
}
```

## `Scene`

A full user creation: model + metadata.

```typescript
export interface Scene {
  id: string;
  name: string;
  parts: Part[];
  steps: Step[];
  mode: 'sandbox' | 'instructions';
  createdAt: number;                              // ms epoch
  updatedAt: number;                              // ms epoch
  thumbnail: string | null;                       // base64 PNG
  schemaVersion: number;
}
```

## `Step`

A group of parts introduced together in Instructions mode.

```typescript
export interface Step {
  index: number;                                  // 0-based
  partIds: string[];                              // Part.id refs
  rotationHint: readonly [number, number, number] | null;  // from 0 ROTSTEP
}
```

## `LdrawColor`

Cached LDConfig color definition.

```typescript
export interface LdrawColor {
  code: number;
  name: string;
  rgb: string;                                    // #rrggbb
  material: 'solid' | 'transparent' | 'chrome' | 'pearl' | 'rubber' | 'glitter' | 'metallic';
  alpha: number;                                  // 0..1
}
```

## `PaletteEntry`

A curated part in the palette.

```typescript
export interface PaletteEntry {
  partNumber: string;
  displayName: string;
  category: 'brick' | 'plate' | 'tile' | 'slope' | 'special';
  thumbnailUrl: string;
  defaultColorCode: number;
}
```

→ Full context: [../fullstack-architecture.md#data-models](../fullstack-architecture.md#data-models)
