import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { getColor } from '../data/colors';
import { getPalette } from '../data/palette';
import {
  LDU_PER_STUD,
  LDU_STUD_HEIGHT,
  LDU_STUD_RADIUS,
} from '../types/domain';

export type BrickPointerHandler = (event: ThreeEvent<PointerEvent>) => void;

export interface BrickProps {
  partNumber: string;
  colorCode: number;
  /** Position in LDU. Y is the brick's bottom. */
  position: readonly [number, number, number];
  rotationY?: 0 | 90 | 180 | 270;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onContextMenu?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerDown?: BrickPointerHandler;
  onPointerOver?: BrickPointerHandler;
  onPointerOut?: BrickPointerHandler;
  selected?: boolean;
  opacity?: number;
}

/**
 * Procedural brick renderer. Replaces LDrawLoader-rendered meshes for Stories
 * 1.3 – 3.x until the LDraw parts library is resolved (Story 1.3 follow-up /
 * PO Must-Fix #M1). The geometry matches standard Lego dimensions:
 *
 *   - 1 stud = 20 LDU
 *   - brick height = 24 LDU  ·  plate height = 8 LDU
 *   - stud radius = 6 LDU  ·  stud height = 4 LDU
 *
 * The brick's local origin is centered on X/Z with Y at the bottom, so the
 * `position` prop places the bottom-center of the brick at that LDU coord.
 */
export function Brick({
  partNumber,
  colorCode,
  position,
  rotationY = 0,
  onClick,
  onContextMenu,
  onPointerDown,
  onPointerOver,
  onPointerOut,
  selected = false,
  opacity = 1,
}: BrickProps) {
  const part = getPalette(partNumber);
  const color = getColor(colorCode);

  const width = part.widthStuds * LDU_PER_STUD;
  const depth = part.depthStuds * LDU_PER_STUD;
  const height = part.heightLdu;

  const material = useMemo(() => {
    const transparent = color.material === 'transparent' || opacity < 1;
    return new THREE.MeshStandardMaterial({
      color: color.rgb,
      metalness: color.material === 'chrome' ? 0.85 : color.material === 'pearl' ? 0.5 : 0.05,
      roughness: color.material === 'chrome' ? 0.15 : color.material === 'pearl' ? 0.35 : 0.55,
      transparent,
      opacity: transparent ? Math.min(color.alpha, opacity) : 1,
    });
  }, [color.rgb, color.material, color.alpha, opacity]);

  const outlineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: selected ? '#2563eb' : '#0f172a',
        wireframe: false,
        transparent: true,
        opacity: selected ? 0.9 : 0.25,
        side: THREE.BackSide,
      }),
    [selected]
  );

  const rotationRadians = (rotationY * Math.PI) / 180;

  return (
    <group
      position={[position[0], position[1], position[2]]}
      rotation={[0, rotationRadians, 0]}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow material={material}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {selected && (
        <mesh position={[0, height / 2, 0]} material={outlineMaterial} scale={[1.04, 1.06, 1.04]}>
          <boxGeometry args={[width, height, depth]} />
        </mesh>
      )}

      {part.studded &&
        Array.from({ length: part.widthStuds * part.depthStuds }, (_, i) => {
          const ix = i % part.widthStuds;
          const iz = Math.floor(i / part.widthStuds);
          const x = (ix - (part.widthStuds - 1) / 2) * LDU_PER_STUD;
          const z = (iz - (part.depthStuds - 1) / 2) * LDU_PER_STUD;
          return (
            <mesh
              key={`${ix}-${iz}`}
              position={[x, height + LDU_STUD_HEIGHT / 2, z]}
              material={material}
              castShadow
            >
              <cylinderGeometry
                args={[LDU_STUD_RADIUS, LDU_STUD_RADIUS, LDU_STUD_HEIGHT, 16]}
              />
            </mesh>
          );
        })}
    </group>
  );
}
