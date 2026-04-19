import type { Part, PaletteEntry } from '../../types/domain';
import { LDU_PER_STUD } from '../../types/domain';
import { getPalette } from '../../data/palette';

export interface SnapInput {
  hit: { x: number; y: number; z: number };
  /** The part directly under the pointer (null for ground). */
  hoveredPart: Part | null;
  activePart: PaletteEntry;
  /** All parts in the scene, for collision check. */
  sceneParts: readonly Part[];
}

export type SnapResult =
  | {
      valid: true;
      position: readonly [number, number, number];
      rotationY: 0 | 90 | 180 | 270;
    }
  | { valid: false; reason: 'collision' | 'no_target' };

/**
 * Snap to nearest half-stud grid in x/z, plate-height stack in y.
 * LDU grid: studs are centered at multiples of LDU_PER_STUD (20).
 * For a part with W studs wide, the center X should be at k·20 + (W is odd ? 0 : 10).
 */
function snapToGrid(x: number, studs: number): number {
  // For odd stud counts (1, 3, ...) center sits on a 20-LDU lattice point.
  // For even stud counts (2, 4, ...) center sits offset by 10 (half-stud).
  const offset = studs % 2 === 0 ? LDU_PER_STUD / 2 : 0;
  return Math.round((x - offset) / LDU_PER_STUD) * LDU_PER_STUD + offset;
}

function getAabb(part: Part): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
} {
  const entry = getPalette(part.partNumber);
  const isSideways = part.rotationY === 90 || part.rotationY === 270;
  const localW = entry.widthStuds * LDU_PER_STUD;
  const localD = entry.depthStuds * LDU_PER_STUD;
  const w = isSideways ? localD : localW;
  const d = isSideways ? localW : localD;
  const h = entry.heightLdu;
  return {
    minX: part.position[0] - w / 2,
    maxX: part.position[0] + w / 2,
    minY: part.position[1],
    maxY: part.position[1] + h,
    minZ: part.position[2] - d / 2,
    maxZ: part.position[2] + d / 2,
  };
}

function aabbsOverlap(
  a: ReturnType<typeof getAabb>,
  b: ReturnType<typeof getAabb>,
  epsilon = 0.1
): boolean {
  return (
    a.minX + epsilon < b.maxX &&
    a.maxX - epsilon > b.minX &&
    a.minY + epsilon < b.maxY &&
    a.maxY - epsilon > b.minY &&
    a.minZ + epsilon < b.maxZ &&
    a.maxZ - epsilon > b.minZ
  );
}

function computeAabbForCandidate(
  activePart: PaletteEntry,
  position: readonly [number, number, number],
  rotationY: 0 | 90 | 180 | 270
): ReturnType<typeof getAabb> {
  return getAabb({
    id: '__candidate__',
    partNumber: activePart.partNumber,
    colorCode: 0,
    position,
    rotationY,
    stepIndex: null,
  });
}

export function computeSnap({ hit, hoveredPart, activePart, sceneParts }: SnapInput): SnapResult {
  const rotationY: 0 | 90 | 180 | 270 = 0;

  let baseY = 0;
  if (hoveredPart) {
    const brickEntry = getPalette(hoveredPart.partNumber);
    baseY = hoveredPart.position[1] + brickEntry.heightLdu;
  }

  const snappedX = snapToGrid(hit.x, activePart.widthStuds);
  const snappedZ = snapToGrid(hit.z, activePart.depthStuds);
  const position: readonly [number, number, number] = [snappedX, baseY, snappedZ];

  // Collision check
  const candidateAabb = computeAabbForCandidate(activePart, position, rotationY);
  for (const existing of sceneParts) {
    const otherAabb = getAabb(existing);
    if (aabbsOverlap(candidateAabb, otherAabb)) {
      return { valid: false, reason: 'collision' };
    }
  }

  return { valid: true, position, rotationY };
}
