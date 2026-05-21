import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { getColor } from '../data/colors';
import { getPalette } from '../data/palette';
import { LDU_PER_STUD } from '../types/domain';

export type FigurePointerHandler = (event: ThreeEvent<PointerEvent>) => void;

export interface FigureProps {
  partNumber: string;
  colorCode: number;
  position: readonly [number, number, number];
  rotationY?: 0 | 90 | 180 | 270;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onContextMenu?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerDown?: FigurePointerHandler;
  onPointerOver?: FigurePointerHandler;
  onPointerOut?: FigurePointerHandler;
  selected?: boolean;
  opacity?: number;
}

/**
 * Boneco (figura humanóide) — design genérico em blocos simples. NÃO é
 * uma reprodução da minifigure LEGO (protegida por marca): usa proporções
 * e formas distintas — cabeça cilíndrica, corpo trapezoidal, braços
 * laterais retos, pernas separadas.
 *
 * Dimensões em LDU (1 stud = 20 LDU):
 *   - footprint: 2×1 studs (40×20 LDU) — encaixa em placa 1x2 ou maior
 *   - cabeça: cilindro ⌀20, altura 24 (amarelo fixo)
 *   - pescoço: 8 LDU
 *   - torso: caixa 28×32×18, trapézio leve (ombros mais largos)
 *   - braços: 2× caixas 8×28×10 nos ombros
 *   - pernas: 2× caixas 18×28×14 (separação 4 LDU)
 *   - altura total: ~96 LDU
 */
export function Figure({
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
}: FigureProps) {
  const part = getPalette(partNumber);
  const bodyColor = getColor(colorCode);
  const isRobot = partNumber === 'FIG02';
  // Cabeça: robô = mesma cor do corpo; humanoide = amarelo fixo.
  const headColor = isRobot ? bodyColor : getColor(14);

  const bodyMaterial = useMemo(() => makeMaterial(bodyColor, opacity), [bodyColor, opacity]);
  const headMaterial = useMemo(() => makeMaterial(headColor, opacity), [headColor, opacity]);
  const legMaterial = useMemo(() => makeMaterial(getColor(72), opacity), [opacity]);
  const outlineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: selected ? '#0891b2' : '#0f172a',
        transparent: true,
        opacity: selected ? 0.9 : 0.0,
        side: THREE.BackSide,
      }),
    [selected]
  );

  const rotationRadians = (rotationY * Math.PI) / 180;

  // Estrutura (LDU). Y=0 na base da figura; alturas acumuladas.
  const legHeight = 28;
  const torsoHeight = 32;
  const headHeight = 24;
  const armHeight = 28;
  const neckHeight = 8;

  const torsoWidth = 28;
  const torsoDepth = 18;
  const armWidth = 8;
  const armDepth = 10;
  const legWidth = 18;
  const legDepth = 14;
  const headRadius = LDU_PER_STUD / 2 + 4; // ~14 LDU

  const legY = legHeight / 2;
  const torsoY = legHeight + torsoHeight / 2;
  const armY = legHeight + torsoHeight - armHeight / 2;
  const headY = legHeight + torsoHeight + neckHeight + headHeight / 2;
  const neckY = legHeight + torsoHeight + neckHeight / 2;

  // Raio aproximado para outline de seleção.
  const totalHeight = part.heightLdu;

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
      {selected && (
        <mesh
          position={[0, totalHeight / 2, 0]}
          material={outlineMaterial}
          scale={[1.08, 1.05, 1.15]}
        >
          <boxGeometry args={[torsoWidth + armWidth * 2 + 4, totalHeight, torsoDepth]} />
        </mesh>
      )}

      {/* Pernas */}
      <mesh
        position={[-legWidth / 2 - 1, legY, 0]}
        material={legMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[legWidth, legHeight, legDepth]} />
      </mesh>
      <mesh
        position={[legWidth / 2 + 1, legY, 0]}
        material={legMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[legWidth, legHeight, legDepth]} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, torsoY, 0]} material={bodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[torsoWidth, torsoHeight, torsoDepth]} />
      </mesh>

      {/* Braços */}
      <mesh
        position={[-(torsoWidth / 2 + armWidth / 2), armY, 0]}
        material={bodyMaterial}
        castShadow
      >
        <boxGeometry args={[armWidth, armHeight, armDepth]} />
      </mesh>
      <mesh
        position={[torsoWidth / 2 + armWidth / 2, armY, 0]}
        material={bodyMaterial}
        castShadow
      >
        <boxGeometry args={[armWidth, armHeight, armDepth]} />
      </mesh>

      {/* Pescoço */}
      <mesh position={[0, neckY, 0]} material={headMaterial}>
        <cylinderGeometry args={[6, 6, neckHeight, 12]} />
      </mesh>

      {/* Cabeça */}
      {isRobot ? (
        <mesh position={[0, headY, 0]} material={headMaterial} castShadow>
          <boxGeometry args={[headRadius * 2, headHeight, headRadius * 2]} />
        </mesh>
      ) : (
        <mesh position={[0, headY, 0]} material={headMaterial} castShadow>
          <cylinderGeometry args={[headRadius, headRadius, headHeight, 24]} />
        </mesh>
      )}

      {/* Face — dois olhinhos pretos simples para dar personalidade */}
      <mesh
        position={[-4, headY + 1, isRobot ? headRadius : headRadius - 0.5]}
        material={faceMaterial}
      >
        <sphereGeometry args={[1.8, 8, 6]} />
      </mesh>
      <mesh
        position={[4, headY + 1, isRobot ? headRadius : headRadius - 0.5]}
        material={faceMaterial}
      >
        <sphereGeometry args={[1.8, 8, 6]} />
      </mesh>

      {/* Antena para robô */}
      {isRobot && (
        <>
          <mesh position={[0, headY + headHeight / 2 + 4, 0]} material={headMaterial}>
            <cylinderGeometry args={[0.8, 0.8, 8, 8]} />
          </mesh>
          <mesh position={[0, headY + headHeight / 2 + 10, 0]} material={antennaMaterial}>
            <sphereGeometry args={[2.5, 10, 8]} />
          </mesh>
        </>
      )}
    </group>
  );
}

const faceMaterial = new THREE.MeshStandardMaterial({
  color: '#0f172a',
  roughness: 0.4,
  metalness: 0.1,
});

const antennaMaterial = new THREE.MeshStandardMaterial({
  color: '#EF4444',
  roughness: 0.3,
  metalness: 0.2,
});

function makeMaterial(
  color: ReturnType<typeof getColor>,
  opacity: number
): THREE.MeshStandardMaterial {
  const transparent = color.material === 'transparent' || opacity < 1;
  return new THREE.MeshStandardMaterial({
    color: color.rgb,
    metalness:
      color.material === 'chrome' ? 0.85 : color.material === 'pearl' ? 0.5 : 0.05,
    roughness:
      color.material === 'chrome' ? 0.15 : color.material === 'pearl' ? 0.35 : 0.55,
    transparent,
    opacity: transparent ? Math.min(color.alpha, opacity) : 1,
  });
}
