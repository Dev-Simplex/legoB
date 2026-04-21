import { useEffect } from 'react';
import { SceneCanvas } from './scene/SceneCanvas';
import { SandboxScene } from './scene/SandboxScene';
import { InstructionsScene } from './scene/InstructionsScene';
import { Palette } from './ui/Palette';
import { SelectionIndicator } from './ui/SelectionIndicator';
import { TopToolbar } from './ui/TopToolbar';
import { TransportBar } from './ui/TransportBar';
import { ToastContainer } from './ui/ToastContainer';
import { useModeStore } from './state/useModeStore';
import { useSceneStore } from './state/useSceneStore';
import { usePlaybackStore } from './state/usePlaybackStore';
import { useAutoSave } from './state/useAutoSave';

const isDev = import.meta.env.DEV;

export function App() {
  const mode = useModeStore((s) => s.mode);
  const setMode = useModeStore((s) => s.setMode);
  const hasSteps = useSceneStore((s) => s.scene.steps.length > 0);
  const resetPlayback = usePlaybackStore((s) => s.reset);

  useAutoSave();

  useEffect(() => {
    if (hasSteps) {
      setMode('instructions');
      resetPlayback();
    }
  }, [hasSteps, setMode, resetPlayback]);

  const isInstructions = mode === 'instructions';

  return (
    <div className={`app-shell ${isInstructions ? 'instructions-mode' : 'sandbox-layout'}`}>
      <TopToolbar />

      {!isInstructions && <Palette />}

      <SceneCanvas showFps={isDev}>
        {isInstructions ? <InstructionsScene /> : <SandboxScene />}
      </SceneCanvas>

      {!isInstructions && <SelectionIndicator />}
      {isInstructions && <TransportBar />}

      <ToastContainer />
    </div>
  );
}
