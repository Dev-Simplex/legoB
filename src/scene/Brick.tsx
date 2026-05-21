import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { getColor } from '../data/colors';
import { getPalette } from '../data/palette';
import {
  LDU_PER_STUD,
  LDU_STUD_HEIGHT,
  LDU_STUD_RADIUS,
  type BrickShape,
  type PaletteEntry,
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
  const shape: BrickShape = part.shape ?? 'box';

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
        color: selected ? '#0891b2' : '#0f172a',
        wireframe: false,
        transparent: true,
        opacity: selected ? 0.9 : 0.25,
        side: THREE.BackSide,
      }),
    [selected]
  );

  // Geometria custom (slope/wedge) memoizada. Cilindros e boxes usam
  // geometria declarativa inline no JSX.
  const customGeometry = useMemo<THREE.BufferGeometry | null>(() => {
    if (shape === 'slope') return buildSlopeGeometry(width, depth, height);
    if (shape === 'wedge') return buildWedgeGeometry(width, depth, height);
    return null;
  }, [shape, width, depth, height]);

  const rotationRadians = (rotationY * Math.PI) / 180;
  const studPositions = computeStudPositions(part);

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
      {shape === 'round' && (
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow material={material}>
          <cylinderGeometry args={[Math.min(width, depth) / 2, Math.min(width, depth) / 2, height, 24]} />
        </mesh>
      )}

      {shape === 'cone' && (
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow material={material}>
          <cylinderGeometry
            args={[Math.min(width, depth) * 0.15, Math.min(width, depth) / 2, height, 24]}
          />
        </mesh>
      )}

      {(shape === 'slope' || shape === 'wedge') && customGeometry && (
        <mesh
          position={[0, 0, -depth / 2]}
          castShadow
          receiveShadow
          material={material}
          geometry={customGeometry}
        />
      )}

      {(shape === 'box' || shape === 'arch') && (
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow material={material}>
          <boxGeometry args={[width, height, depth]} />
        </mesh>
      )}

      {selected && (
        <mesh position={[0, height / 2, 0]} material={outlineMaterial} scale={[1.06, 1.08, 1.06]}>
          <boxGeometry args={[width, height, depth]} />
        </mesh>
      )}

      {part.studded &&
        studPositions.map(([x, z], i) => (
          <mesh
            key={i}
            position={[x, height + LDU_STUD_HEIGHT / 2, z]}
            material={material}
            castShadow
          >
            <cylinderGeometry args={[LDU_STUD_RADIUS, LDU_STUD_RADIUS, LDU_STUD_HEIGHT, 16]} />
          </mesh>
        ))}
    </group>
  );
}

function computeStudPositions(part: PaletteEntry): Array<[number, number]> {
  const shape: BrickShape = part.shape ?? 'box';
  if (shape === 'round' || shape === 'cone') {
    return [[0, 0]];
  }
  if (shape === 'slope') {
    const positions: Array<[number, number]> = [];
    const frontZ = (part.depthStuds - 1) / 2;
    for (let ix = 0; ix < part.widthStuds; ix++) {
      const x = (ix - (part.widthStuds - 1) / 2) * LDU_PER_STUD;
      positions.push([x, frontZ * LDU_PER_STUD]);
    }
    return positions;
  }
  if (shape === 'wedge') {
    return [];
  }
  // box: grade completa
  const positions: Array<[number, number]> = [];
  for (let i = 0; i < part.widthStuds * part.depthStuds; i++) {
    const ix = i % part.widthStuds;
    const iz = Math.floor(i / part.widthStuds);
    const x = (ix - (part.widthStuds - 1) / 2) * LDU_PER_STUD;
    const z = (iz - (part.depthStuds - 1) / 2) * LDU_PER_STUD;
    positions.push([x, z]);
  }
  return positions;
}

function buildSlopeGeometry(width: number, depth: number, height: number): THREE.BufferGeometry {
  // Prisma com base retangular (w × depth) e topo inclinado:
  //   frente (z=0): cheio, altura = height
  //   trás (z=depth): rampa baixa até y=0
  // Origem: x=0, y=0, z=0 (canto frontal-base-centro).
  const w = width / 2;
  const geom = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    // base (y=0) — 4 cantos
    -w, 0, 0, // 0 front-left-base
     w, 0, 0, // 1 front-right-base
     w, 0, depth, // 2 back-right-base
    -w, 0, depth, // 3 back-left-base
    // topo frontal (y=height, z=0) — 2 cantos (só frente)
    -w, height, 0, // 4 front-left-top
     w, height, 0, // 5 front-right-top
  ]);
  const indices = [
    // base (olhando pra baixo, winding horário visto de baixo)
    0, 2, 1,
    0, 3, 2,
    // frente (z=0, quad 0-1-5-4 cw visto da frente)
    0, 1, 5,
    0, 5, 4,
    // lado esquerdo (x=-w, triângulo front-top-left, back-base-left, front-base-left)
    4, 3, 0,
    // lado direito (espelho)
    5, 1, 2,
    // topo inclinado (quad 4-5-2-3, from front-top diagonal down to back-base)
    4, 5, 2,
    4, 2, 3,
  ];
  geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

function buildWedgeGeometry(width: number, depth: number, height: number): THREE.BufferGeometry {
  // Placa-cunha triangular (vista de cima): base plana em z=0 com largura
  // total, convergindo para um ponto em z=depth. Topo e base são planos.
  const w = width / 2;
  const geom = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    // base (y=0): 3 vértices formando um triângulo
    -w, 0, 0, // 0 front-left-base
     w, 0, 0, // 1 front-right-base
     0, 0, depth, // 2 tip-base
    // topo (y=height): mesmos 3 pontos
    -w, height, 0, // 3 front-left-top
     w, height, 0, // 4 front-right-top
     0, height, depth, // 5 tip-top
  ]);
  const indices = [
    // base (normal pra baixo → winding CW visto de cima)
    0, 2, 1,
    // topo (normal pra cima)
    3, 4, 5,
    // frente (z=0, quad 0-1-4-3)
    0, 1, 4,
    0, 4, 3,
    // lateral esquerda (quad 0-3-5-2)
    0, 3, 5,
    0, 5, 2,
    // lateral direita (quad 1-2-5-4)
    1, 2, 5,
    1, 5, 4,
  ];
  geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}
