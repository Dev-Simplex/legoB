import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Grid } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Ground } from './Ground';

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

  const handleReset = useCallback(() => {
    controlsRef.current?.reset();
    setResetToken((n) => n + 1);
  }, []);

  return (
    <div className="scene-canvas">
      <div className="scene-toolbar">
        <button type="button" onClick={handleReset} aria-label="Reset camera">
          Reset camera
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
        />

        {showFps && <Stats />}
      </Canvas>
    </div>
  );
}
