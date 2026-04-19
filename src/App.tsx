import { SceneCanvas } from './scene/SceneCanvas';
import { SandboxScene } from './scene/SandboxScene';
import { Palette } from './ui/Palette';
import { PropertiesPanel } from './ui/PropertiesPanel';
import { useSceneStore } from './state/useSceneStore';

const isDev = import.meta.env.DEV;

export function App() {
  const partCount = useSceneStore((s) => s.scene.parts.length);
  const isDirty = useSceneStore((s) => s.isDirty);
  const resetScene = useSceneStore((s) => s.resetScene);

  return (
    <div className="app-shell sandbox-layout">
      <header className="top-bar">
        <h1>LegoB</h1>
        <span className="status">Sandbox</span>
        <div className="top-bar-spacer" />
        <span className="stat-chip" aria-label={`${partCount} bricks in scene`}>
          {partCount} bricks
        </span>
        {isDirty && <span className="stat-chip dirty">● unsaved</span>}
        <button
          type="button"
          onClick={() => {
            if (!isDirty || window.confirm('Discard all bricks and start over?')) {
              resetScene();
            }
          }}
        >
          Clear
        </button>
      </header>

      <Palette />

      <SceneCanvas showFps={isDev}>
        <SandboxScene />
      </SceneCanvas>

      <PropertiesPanel />
    </div>
  );
}
