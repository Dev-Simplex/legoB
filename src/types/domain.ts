export interface Part {
  id: string;
  partNumber: string;
  colorCode: number;
  position: readonly [number, number, number];
  rotationY: 0 | 90 | 180 | 270;
  stepIndex: number | null;
}

export interface Step {
  index: number;
  partIds: string[];
  rotationHint: readonly [number, number, number] | null;
}

export interface Scene {
  id: string;
  name: string;
  parts: Part[];
  steps: Step[];
  mode: 'sandbox' | 'instructions';
  createdAt: number;
  updatedAt: number;
  thumbnail: string | null;
  schemaVersion: number;
}

export interface LdrawColor {
  code: number;
  name: string;
  rgb: string;
  material: 'solid' | 'transparent' | 'chrome' | 'pearl' | 'rubber' | 'glitter' | 'metallic';
  alpha: number;
}

export type BrickCategory = 'brick' | 'plate' | 'tile' | 'slope' | 'special' | 'figure';

export interface PaletteEntry {
  partNumber: string;
  displayName: string;
  category: BrickCategory;
  /**
   * Procedural brick footprint in studs. Width along local X, depth along local Z.
   * Example: 2x4 brick = { widthStuds: 2, depthStuds: 4 }.
   */
  widthStuds: number;
  depthStuds: number;
  /**
   * Height in LDU. Brick = 24, Plate = 8, Tile = 8 (no studs).
   */
  heightLdu: number;
  /**
   * Whether to render studs on top. Tiles have no studs.
   */
  studded: boolean;
  defaultColorCode: number;
}

export const LDU_PER_STUD = 20;
export const LDU_BRICK_HEIGHT = 24;
export const LDU_PLATE_HEIGHT = 8;
export const LDU_STUD_RADIUS = 6;
export const LDU_STUD_HEIGHT = 4;
