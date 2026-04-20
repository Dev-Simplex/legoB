import { useMemo } from 'react';
import { Brick } from './Brick';
import { useSceneStore } from '../state/useSceneStore';
import { usePlaybackStore } from '../state/usePlaybackStore';

/**
 * Renders only the parts whose stepIndex is ≤ current step. New-to-current-step
 * parts render with a slight accent tint via increased metalness. Ghost mode
 * adds translucent previews of the NEXT step.
 */
export function InstructionsScene() {
  const parts = useSceneStore((s) => s.scene.parts);
  const steps = useSceneStore((s) => s.scene.steps);
  const currentStep = usePlaybackStore((s) => s.currentStep);
  const ghost = usePlaybackStore((s) => s.ghost);

  const visibleParts = useMemo(
    () => parts.filter((p) => p.stepIndex === null || p.stepIndex <= currentStep),
    [parts, currentStep]
  );

  const thisStepPartIds = useMemo(
    () => new Set(steps[currentStep]?.partIds ?? []),
    [steps, currentStep]
  );

  const nextStepParts = useMemo(
    () => (ghost ? parts.filter((p) => p.stepIndex === currentStep + 1) : []),
    [ghost, parts, currentStep]
  );

  return (
    <group>
      {visibleParts.map((part) => (
        <Brick
          key={part.id}
          partNumber={part.partNumber}
          colorCode={part.colorCode}
          position={part.position}
          rotationY={part.rotationY}
          selected={thisStepPartIds.has(part.id)}
        />
      ))}

      {nextStepParts.map((part) => (
        <Brick
          key={`ghost-${part.id}`}
          partNumber={part.partNumber}
          colorCode={part.colorCode}
          position={part.position}
          rotationY={part.rotationY}
          opacity={0.35}
        />
      ))}
    </group>
  );
}
