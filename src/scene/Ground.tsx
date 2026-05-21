import * as THREE from 'three';
import { useSettingsStore } from '../state/useSettingsStore';

export function Ground() {
  const groundColor = useSettingsStore((s) => s.groundColor);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      name="ground-plane"
    >
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color={groundColor} side={THREE.DoubleSide} />
    </mesh>
  );
}
