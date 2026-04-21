import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Grid } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { MOUSE, TOUCH } from 'three';
import { Ground } from './Ground';
import { usePaletteStore } from '../state/usePaletteStore';

// Esquema: botão esquerdo fica LIVRE para placement/selection (a roda
// da raycasting do R3F cuida dos cliques); botão do meio (roda) orbita;
// botão direito faz pan. Toque mantém 1-dedo = rotate, 2-dedos = pan.
const MOUSE_BUTTONS = {
  LEFT: -1 as unknown as MOUSE,
  MIDDLE: MOUSE.ROTATE,
  RIGHT: MOUSE.PAN,
};

const TOUCH_MODES = {
  ONE: TOUCH.ROTATE,
  TWO: TOUCH.DOLLY_PAN,
};

const DEFAULT_CAMERA = {
  position: [240, 180, 240] as [number, number, number],
  fov: 45,
};

interface SceneCanvasProps {
  showFps?: boolean;
  children?: React.ReactNode;
}

export function SceneCanvas({ showFps = false, children }: SceneCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [resetToken, setResetToken] = useState(0);
  const eraserMode = usePaletteStore((s) => s.eraserMode);

  const handleReset = useCallback(() => {
    controlsRef.current?.reset();
    setResetToken((n) => n + 1);
  }, []);

  return (
    <div className={`scene-canvas ${eraserMode ? 'eraser-mode' : ''}`}>
      <div className="scene-toolbar">
        <span
          className="scene-hint"
          title="Clique e arraste com o botão do meio (scroll) para orbitar. Botão direito para mover. Roda para zoom."
        >
          🖱️ meio = orbitar · direito = mover · roda = zoom
        </span>
        <button type="button" onClick={handleReset} aria-label="Centralizar câmera">
          Centralizar câmera
        </button>
      </div>

      <Canvas
        camera={{ position: DEFAULT_CAMERA.position, fov: DEFAULT_CAMERA.fov, near: 1, far: 5000 }}
        shadows
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        aria-label="3D scene. Empty ground plane with grid. Build placement and rendering arrive in later stories."
      >
        <color attach="background" args={['#f1f5f9']} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[200, 400, 300]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <hemisphereLight args={['#ffffff', '#475569', 0.35]} />

        <Suspense fallback={null}>
          <Ground />
          {children}
        </Suspense>

        <Grid
          key={resetToken}
          args={[800, 800]}
          cellSize={20}
          cellColor="#cbd5e1"
          sectionSize={200}
          sectionColor="#94a3b8"
          fadeDistance={1200}
          infiniteGrid={false}
          position={[0, 0.01, 0]}
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={40}
          maxDistance={1500}
          target={[0, 0, 0]}
          mouseButtons={MOUSE_BUTTONS}
          touches={TOUCH_MODES}
        />

        {showFps && <Stats />}
      </Canvas>
    </div>
  );
}
