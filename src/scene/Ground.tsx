import * as THREE from 'three';

export function Ground() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      name="ground-plane"
    >
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color="#e2e8f0" side={THREE.DoubleSide} />
    </mesh>
  );
}
