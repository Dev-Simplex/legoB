import { SceneCanvas } from './scene/SceneCanvas';

const isDev = import.meta.env.DEV;

export function App() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <h1>LegoB</h1>
        <span className="status">bootstrapping · Story 1.2</span>
      </header>
      <SceneCanvas showFps={isDev} />
    </div>
  );
}
