import { describe, it, expect } from 'vitest';
import { writeMpd, readMpd } from './mpdCodec';
import type { Scene } from '../types/domain';

function makeScene(): Scene {
  return {
    id: 'test-id',
    name: 'Test',
    parts: [
      {
        id: 'a',
        partNumber: '3003',
        colorCode: 4,
        position: [10, 0, 10],
        rotationY: 0,
        stepIndex: null,
      },
      {
        id: 'b',
        partNumber: '3001',
        colorCode: 14,
        position: [-20, 24, 0],
        rotationY: 90,
        stepIndex: null,
      },
    ],
    steps: [],
    mode: 'sandbox',
    createdAt: 0,
    updatedAt: 0,
    thumbnail: null,
    schemaVersion: 1,
  };
}

describe('mpdCodec', () => {
  it('round-trips a scene', () => {
    const scene = makeScene();
    const text = writeMpd(scene);
    const { scene: parsed, warnings } = readMpd(text, 'test.mpd');
    expect(warnings).toHaveLength(0);
    expect(parsed.parts).toHaveLength(2);
    expect(parsed.parts[0]).toMatchObject({
      partNumber: '3003',
      colorCode: 4,
      position: [10, 0, 10],
      rotationY: 0,
    });
    expect(parsed.parts[1]).toMatchObject({
      partNumber: '3001',
      colorCode: 14,
      rotationY: 90,
    });
  });

  it('flags unknown parts with a warning and falls back to 2x2', () => {
    const text = `0 FILE test.ldr\n1 4 0 0 0 1 0 0 0 1 0 0 0 1 9999.dat\n0 NOFILE`;
    const { scene, warnings } = readMpd(text, 'test.mpd');
    expect(scene.parts).toHaveLength(1);
    expect(scene.parts[0]?.partNumber).toBe('3003');
    expect(warnings[0]?.code).toBe('unknown_part');
  });
});
