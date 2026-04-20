import { SceneCanvas } from './scene/SceneCanvas';
import { SandboxScene } from './scene/SandboxScene';
import { Palette } from './ui/Palette';
import { PropertiesPanel } from './ui/PropertiesPanel';
import { TopToolbar } from './ui/TopToolbar';
import { ToastContainer } from './ui/ToastContainer';

const isDev = import.meta.env.DEV;

export function App() {
  return (
    <div className="app-shell sandbox-layout">
      <TopToolbar />
      <Palette />
      <SceneCanvas showFps={isDev}>
        <SandboxScene />
      </SceneCanvas>
      <PropertiesPanel />
      <ToastContainer />
    </div>
  );
}
