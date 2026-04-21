import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { Part as PartMesh } from './Part';
import { useSceneStore } from '../state/useSceneStore';
import { usePaletteStore } from '../state/usePaletteStore';
import { computeSnap } from './snap/computeSnap';
import { getPalette } from '../data/palette';
import type { Part } from '../types/domain';

interface GhostState {
  position: readonly [number, number, number];
  rotationY: 0 | 90 | 180 | 270;
  valid: boolean;
}

/**
 * Interactive sandbox scene. Handles:
 *  - ghost preview on ground + brick hover
 *  - click placement
 *  - selection by click
 *  - keyboard shortcuts (R rotate, Del delete, Esc deselect)
 *
 * Must be rendered inside an R3F <Canvas>.
 */
export function SandboxScene() {
  const parts = useSceneStore((s) => s.scene.parts);
  const addPart = useSceneStore((s) => s.addPart);
  const removePart = useSceneStore((s) => s.removePart);
  const updatePart = useSceneStore((s) => s.updatePart);
  const selectedPartId = useSceneStore((s) => s.selectedPartId);
  const selectPart = useSceneStore((s) => s.selectPart);

  const activePartNumber = usePaletteStore((s) => s.activePartNumber);
  const activeColorCode = usePaletteStore((s) => s.activeColorCode);
  const setActivePart = usePaletteStore((s) => s.setActivePart);

  const [ghost, setGhost] = useState<GhostState | null>(null);

  const activePart = useMemo(
    () => (activePartNumber ? getPalette(activePartNumber) : null),
    [activePartNumber]
  );

  // Keyboard shortcuts
  const { gl } = useThree();
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (event.key === 'Escape') {
        selectPart(null);
        setActivePart(null);
        return;
      }
      if (!selectedPartId) return;
      const selected = parts.find((p) => p.id === selectedPartId);
      if (!selected) return;

      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        const dir = event.shiftKey ? -1 : 1;
        const nextRotation = (((selected.rotationY + dir * 90) % 360) + 360) % 360 as
          | 0
          | 90
          | 180
          | 270;
        updatePart(selected.id, { rotationY: nextRotation });
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        removePart(selected.id);
      }
    };
    const domEl = gl.domElement;
    window.addEventListener('keydown', handler);
    domEl.setAttribute('tabindex', '0');
    return () => window.removeEventListener('keydown', handler);
  }, [gl, selectedPartId, parts, updatePart, removePart, selectPart, setActivePart]);

  const recomputeGhost = useCallback(
    (worldX: number, worldY: number, worldZ: number, hoveredPart: Part | null) => {
      if (!activePart) {
        setGhost(null);
        return;
      }
      const result = computeSnap({
        hit: { x: worldX, y: worldY, z: worldZ },
        hoveredPart,
        activePart,
        sceneParts: parts,
      });
      if (result.valid) {
        setGhost({ position: result.position, rotationY: result.rotationY, valid: true });
      } else {
        // Snap to grid anyway so the user sees WHY it's blocked.
        setGhost({
          position: [worldX, hoveredPart ? hoveredPart.position[1] : 0, worldZ],
          rotationY: 0,
          valid: false,
        });
      }
    },
    [activePart, parts]
  );

  const handleGroundPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!activePart) return;
      recomputeGhost(event.point.x, 0, event.point.z, null);
    },
    [activePart, recomputeGhost]
  );

  const handleGroundPointerOut = useCallback(() => {
    setGhost(null);
  }, []);

  const handleGroundClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (event.button === 2) return;
      if (!activePart || !ghost || !ghost.valid) {
        selectPart(null);
        return;
      }
      addPart({
        partNumber: activePart.partNumber,
        colorCode: activeColorCode,
        position: ghost.position,
        rotationY: ghost.rotationY,
        stepIndex: null,
      });
    },
    [activePart, ghost, addPart, activeColorCode, selectPart]
  );

  const handleBrickPointerOver = useCallback(
    (part: Part) => (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      if (!activePart) return;
      recomputeGhost(event.point.x, event.point.y, event.point.z, part);
    },
    [activePart, recomputeGhost]
  );

  const handleBrickClick = useCallback(
    (part: Part) => (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      if (event.button === 2) return;
      if (activePart && ghost && ghost.valid) {
        addPart({
          partNumber: activePart.partNumber,
          colorCode: activeColorCode,
          position: ghost.position,
          rotationY: ghost.rotationY,
          stepIndex: null,
        });
        return;
      }
      selectPart(part.id);
    },
    [activePart, ghost, addPart, activeColorCode, selectPart]
  );

  return (
    <group>
      {/* Invisible ground plane to catch pointer events at y=0 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerMove={handleGroundPointerMove}
        onPointerOut={handleGroundPointerOut}
        onClick={handleGroundClick}
        name="sandbox-ground"
      >
        <planeGeometry args={[2000, 2000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {parts.map((part) => (
        <PartMesh
          key={part.id}
          partNumber={part.partNumber}
          colorCode={part.colorCode}
          position={part.position}
          rotationY={part.rotationY}
          selected={part.id === selectedPartId}
          onPointerOver={handleBrickPointerOver(part)}
          onPointerDown={handleBrickClick(part)}
        />
      ))}

      {ghost && activePart && (
        <PartMesh
          partNumber={activePart.partNumber}
          colorCode={ghost.valid ? activeColorCode : 4}
          position={ghost.position}
          rotationY={ghost.rotationY}
          opacity={ghost.valid ? 0.5 : 0.35}
        />
      )}
    </group>
  );
}
