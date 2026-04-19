import { SceneCanvas } from './scene/SceneCanvas';
import { DemoScene } from './scene/DemoScene';

const isDev = import.meta.env.DEV;

export function App() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <h1>LegoB</h1>
        <span className="status">Story 1.3 · demo scene</span>
      </header>
      <SceneCanvas showFps={isDev}>
        <DemoScene />
      </SceneCanvas>
    </div>
  );
}
