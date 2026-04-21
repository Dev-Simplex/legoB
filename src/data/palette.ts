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
    displayName: 'Tijolo 1x1',
    category: 'brick',
    widthStuds: 1,
    depthStuds: 1,
    heightLdu: LDU_BRICK_HEIGHT,
    studded: true,
    defaultColorCode: 4,
  },
  {
    partNumber: '3004',
    displayName: 'Tijolo 1x2',
    category: 'brick',
    widthStuds: 1,
    depthStuds: 2,
    heightLdu: LDU_BRICK_HEIGHT,
    studded: true,
    defaultColorCode: 14,
  },
  {
    partNumber: '3003',
    displayName: 'Tijolo 2x2',
    category: 'brick',
    widthStuds: 2,
    depthStuds: 2,
    heightLdu: LDU_BRICK_HEIGHT,
    studded: true,
    defaultColorCode: 1,
  },
  {
    partNumber: '3001',
    displayName: 'Tijolo 2x4',
    category: 'brick',
    widthStuds: 2,
    depthStuds: 4,
    heightLdu: LDU_BRICK_HEIGHT,
    studded: true,
    defaultColorCode: 2,
  },
  {
    partNumber: '3024',
    displayName: 'Placa 1x1',
    category: 'plate',
    widthStuds: 1,
    depthStuds: 1,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: true,
    defaultColorCode: 15,
  },
  {
    partNumber: '3023',
    displayName: 'Placa 1x2',
    category: 'plate',
    widthStuds: 1,
    depthStuds: 2,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: true,
    defaultColorCode: 7,
  },
  {
    partNumber: '3022',
    displayName: 'Placa 2x2',
    category: 'plate',
    widthStuds: 2,
    depthStuds: 2,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: true,
    defaultColorCode: 0,
  },
  {
    partNumber: '3020',
    displayName: 'Placa 2x4',
    category: 'plate',
    widthStuds: 2,
    depthStuds: 4,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: true,
    defaultColorCode: 71,
  },
  {
    partNumber: '3070',
    displayName: 'Lisa 1x1',
    category: 'tile',
    widthStuds: 1,
    depthStuds: 1,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: false,
    defaultColorCode: 72,
  },
  {
    partNumber: '3069',
    displayName: 'Lisa 1x2',
    category: 'tile',
    widthStuds: 1,
    depthStuds: 2,
    heightLdu: LDU_PLATE_HEIGHT,
    studded: false,
    defaultColorCode: 72,
  },
  // Figuras (design próprio — NÃO usa geometria de minifigure LEGO).
  // Part numbers FIG* são invenção do LegoB.
  {
    partNumber: 'FIG01',
    displayName: 'Boneco',
    category: 'figure',
    widthStuds: 2,
    depthStuds: 1,
    heightLdu: 96,
    studded: false,
    defaultColorCode: 1,
  },
  {
    partNumber: 'FIG02',
    displayName: 'Boneco Robô',
    category: 'figure',
    widthStuds: 2,
    depthStuds: 1,
    heightLdu: 96,
    studded: false,
    defaultColorCode: 71,
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
