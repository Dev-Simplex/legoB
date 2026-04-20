import { nanoid } from 'nanoid';
import type { Part, Scene, Step } from '../types/domain';
import { getPalette } from '../data/palette';

/**
 * Serialize a Scene to LDraw MPD text.
 *
 * NOTE (Story 3.3/3.4): this is a simplified writer that emits one line-type-1
 * reference per part into a single .ldr file body. It is valid LDraw syntax and
 * round-trips through our own reader, but won't necessarily open cleanly in
 * strict LDraw tools until we wire the real parts library (PO Must-Fix #M1).
 */
export function writeMpd(scene: Scene): string {
  const lines: string[] = [];
  lines.push('0 FILE main.ldr');
  lines.push(`0 Exported from LegoB — https://www.ldraw.org/ (CCAL 2.0 attribution)`);
  lines.push(`0 Name: ${scene.name}`);
  lines.push(`0 Author: LegoB user`);
  lines.push(`0 !LICENSE Redistributable under CCAL version 2.0`);

  for (const part of scene.parts) {
    // LDraw row-major 3x3 rotation (Y axis) + translation.
    const angle = (part.rotationY * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    // a b c  d e f  g h i transform: [cos 0 sin | 0 1 0 | -sin 0 cos]
    const a = cos;
    const b = 0;
    const c = sin;
    const d = 0;
    const e = 1;
    const f = 0;
    const g = -sin;
    const h = 0;
    const i = cos;
    const [x, y, z] = part.position;
    lines.push(
      `1 ${part.colorCode} ${x} ${y} ${z} ${fmt(a)} ${fmt(b)} ${fmt(c)} ${fmt(d)} ${fmt(e)} ${fmt(f)} ${fmt(g)} ${fmt(h)} ${fmt(i)} ${part.partNumber}.dat`
    );
  }
  lines.push('0 NOFILE');
  return lines.join('\n');
}

function fmt(n: number): string {
  if (Math.abs(n) < 1e-9) return '0';
  if (Math.abs(n - 1) < 1e-9) return '1';
  if (Math.abs(n + 1) < 1e-9) return '-1';
  return n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * Parse an LDraw `.ldr`/`.mpd` text into a Scene. Only line-type 1 is honored;
 * comments (0) and raw geometry (2/3/4/5) are ignored. Parts that aren't in
 * our curated palette are still preserved (as lowest-common 1x1 brick) with a
 * warning recorded in the returned `warnings` array.
 */
export interface ImportResult {
  scene: Scene;
  warnings: Array<{ code: string; message: string }>;
}

export function readMpd(text: string, nameFromFile: string): ImportResult {
  const lines = text.split(/\r?\n/);
  const parts: Part[] = [];
  const steps: Step[] = [];
  const warnings: ImportResult['warnings'] = [];
  let embeddedName: string | null = null;
  let currentStepIndex = 0;
  let currentStepPartIds: string[] = [];
  let hasStepMarkers = false;

  const flushStep = () => {
    if (currentStepPartIds.length === 0) return;
    steps.push({ index: currentStepIndex, partIds: [...currentStepPartIds], rotationHint: null });
    currentStepPartIds = [];
    currentStepIndex += 1;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const first = line[0];
    if (first === '0') {
      const nameMatch = line.match(/^0\s+Name:\s*(.+)$/i);
      if (nameMatch) embeddedName = nameMatch[1].trim();
      if (/^0\s+STEP\b/i.test(line)) {
        hasStepMarkers = true;
        flushStep();
      }
      continue;
    }
    if (first !== '1') continue;

    const tokens = line.split(/\s+/);
    if (tokens.length < 15) {
      warnings.push({ code: 'bad_line', message: `Skipped malformed line: ${line.slice(0, 80)}` });
      continue;
    }
    // 1 color x y z a b c d e f g h i file
    const colorCode = Number(tokens[1]);
    const x = Number(tokens[2]);
    const y = Number(tokens[3]);
    const z = Number(tokens[4]);
    const a = Number(tokens[5]);
    const c = Number(tokens[7]);
    const fileToken = tokens.slice(14).join(' ');
    const partNumber = fileToken.replace(/\.dat$/i, '');

    // Derive Y rotation from the (a, c) of the Y-axis rotation matrix.
    // rotation: a=cos, c=sin. rotationY = atan2(sin, cos) in degrees.
    let rotationY: 0 | 90 | 180 | 270 = 0;
    const angleDeg = (Math.round((Math.atan2(c, a) * 180) / Math.PI) + 360) % 360;
    if (angleDeg === 90) rotationY = 90;
    else if (angleDeg === 180) rotationY = 180;
    else if (angleDeg === 270) rotationY = 270;

    let resolvedPartNumber = partNumber;
    try {
      getPalette(partNumber);
    } catch {
      warnings.push({
        code: 'unknown_part',
        message: `Part ${partNumber} not in palette — substituted 2x2 brick.`,
      });
      resolvedPartNumber = '3003';
    }

    const partId = nanoid();
    parts.push({
      id: partId,
      partNumber: resolvedPartNumber,
      colorCode: Number.isFinite(colorCode) ? colorCode : 16,
      position: [x, y, z],
      rotationY,
      stepIndex: currentStepIndex,
    });
    currentStepPartIds.push(partId);
  }

  // Final implicit step for any trailing parts after the last explicit STEP.
  if (currentStepPartIds.length > 0 && hasStepMarkers) {
    flushStep();
  }

  // If no STEP markers were present, the file is a single-scene sandbox import
  // rather than instructions. Null out stepIndex so the playback UI doesn't
  // pretend the scene is stepped.
  if (!hasStepMarkers) {
    for (let i = 0; i < parts.length; i++) {
      parts[i] = { ...parts[i]!, stepIndex: null };
    }
  }

  const now = Date.now();
  return {
    scene: {
      id: nanoid(),
      name: embeddedName ?? nameFromFile.replace(/\.(mpd|ldr)$/i, '') ?? 'Imported',
      parts,
      steps,
      mode: hasStepMarkers ? 'instructions' : 'sandbox',
      createdAt: now,
      updatedAt: now,
      thumbnail: null,
      schemaVersion: 1,
    },
    warnings,
  };
}
