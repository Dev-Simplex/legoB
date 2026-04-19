import { describe, it, expect } from 'vitest';
import { computeSnap } from './computeSnap';
import { getPalette } from '../../data/palette';
import type { Part } from '../../types/domain';

describe('computeSnap', () => {
  it('snaps a 2x2 brick to half-stud offset on empty ground', () => {
    const activePart = getPalette('3003'); // 2x2 brick
    const result = computeSnap({
      hit: { x: 13, y: 0, z: 7 },
      hoveredPart: null,
      activePart,
      sceneParts: [],
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.position[0]).toBe(10); // nearest half-stud (multiples of 20 + 10)
      expect(result.position[1]).toBe(0);
      expect(result.position[2]).toBe(10);
    }
  });

  it('snaps a 1x1 brick to whole-stud on empty ground', () => {
    const activePart = getPalette('3005');
    const result = computeSnap({
      hit: { x: 13, y: 0, z: 22 },
      hoveredPart: null,
      activePart,
      sceneParts: [],
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.position[0]).toBe(20);
      expect(result.position[2]).toBe(20);
    }
  });

  it('stacks a brick on top of another', () => {
    const existingBrick: Part = {
      id: 'a',
      partNumber: '3003',
      colorCode: 4,
      position: [10, 0, 10],
      rotationY: 0,
      stepIndex: null,
    };
    const activePart = getPalette('3003');
    const result = computeSnap({
      hit: { x: 10, y: 24, z: 10 },
      hoveredPart: existingBrick,
      activePart,
      sceneParts: [existingBrick],
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.position[1]).toBe(24); // on top of 24-LDU tall brick
    }
  });

  it('detects collision when two bricks would overlap', () => {
    const existing: Part = {
      id: 'a',
      partNumber: '3003',
      colorCode: 4,
      position: [10, 0, 10],
      rotationY: 0,
      stepIndex: null,
    };
    const activePart = getPalette('3003');
    const result = computeSnap({
      hit: { x: 10, y: 0, z: 10 },
      hoveredPart: null,
      activePart,
      sceneParts: [existing],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe('collision');
    }
  });
});
