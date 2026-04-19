import type { PaletteEntry } from '../types/domain';
import { LDU_BRICK_HEIGHT, LDU_PLATE_HEIGHT } from '../types/domain';

/**
 * MVP curated palette — a minimal subset sufficient to prove placement + snapping.
 * Full LDraw part numbers are kept so we can swap to LDrawLoader-rendered meshes
 * later without changing the domain model. For Story 1.3, these render
 * procedurally via the Brick component.
 */
export const PALETTE: readonly PaletteEntry[] = [
  {
    partNumber: '3005',
    displayName: '1x1 Brick',
    category: 'brick',
    widthStuds: 1,
    depthStuds: 1,
    heightLdu: LDU_BRICK_HEIGHT,
    studded: true,
    defaultColorCode: 4,
  },
  {
    partNumber: '3004',
    displayName: '1x2 Brick',
    category: 'brick',
    widthStuds: 1,
    depthStuds: 2,
    heightLdu: LDU_BRICK_HEIGHT,
    studded: true,
    defaultColorCode: 14,
  },
  {
    partNumber: '3003',
    displayName: '2x2 Brick',
    category: 'brick',
    widthStuds: 2,
    depthStuds: 2,
    heightLdu: LDU_BRICK_HEIGHT,
    studded: true,
    defaultColorCode: 1,
  },
  {
    partNumber: '3001',
    displayName: '2x4 Brick',
    category: 'brick',
    widthStuds: 2,
    depthStuds: 4,
    heightLdu: LDU_BRICK_HEIGHT,
    studded: true,
    defaultColorCode: 2,
  },
  {
    partNumber: '3024',
    displayName: '1x1 Plate',
    category: 'plate',
    widthStuds: 1,
    depthStuds: 1,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: true,
    defaultColorCode: 15,
  },
  {
    partNumber: '3023',
    displayName: '1x2 Plate',
    category: 'plate',
    widthStuds: 1,
    depthStuds: 2,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: true,
    defaultColorCode: 7,
  },
  {
    partNumber: '3022',
    displayName: '2x2 Plate',
    category: 'plate',
    widthStuds: 2,
    depthStuds: 2,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: true,
    defaultColorCode: 0,
  },
  {
    partNumber: '3020',
    displayName: '2x4 Plate',
    category: 'plate',
    widthStuds: 2,
    depthStuds: 4,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: true,
    defaultColorCode: 71,
  },
  {
    partNumber: '3070',
    displayName: '1x1 Tile',
    category: 'tile',
    widthStuds: 1,
    depthStuds: 1,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: false,
    defaultColorCode: 72,
  },
  {
    partNumber: '3069',
    displayName: '1x2 Tile',
    category: 'tile',
    widthStuds: 1,
    depthStuds: 2,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: false,
    defaultColorCode: 72,
  },
];

export const PALETTE_BY_NUMBER: ReadonlyMap<string, PaletteEntry> = new Map(
  PALETTE.map((p) => [p.partNumber, p])
);

export function getPalette(partNumber: string): PaletteEntry {
  const entry = PALETTE_BY_NUMBER.get(partNumber);
  if (!entry) {
    throw new Error(`Unknown part: ${partNumber}`);
  }
  return entry;
}
