import { Brick } from './Brick';
import { LDU_BRICK_HEIGHT, LDU_PER_STUD, LDU_PLATE_HEIGHT } from '../types/domain';

/**
 * Hardcoded Story 1.3 sample — a tiny house rendered from the curated palette.
 * Proves the renderer works end-to-end before real LDrawLoader integration.
 * Will be replaced by `<SandboxScene>` once @sceneStore lands (Epic 2).
 */
export function DemoScene() {
  const stud = LDU_PER_STUD;
  const brick = LDU_BRICK_HEIGHT;
  const plate = LDU_PLATE_HEIGHT;

  return (
    <group>
      {/* Floor — 2x4 tan plate */}
      <Brick partNumber="3020" colorCode={71} position={[0, 0, 0]} />

      {/* Walls, 2x2 red bricks */}
      <Brick partNumber="3003" colorCode={4} position={[-stud, plate, -stud]} />
      <Brick partNumber="3003" colorCode={4} position={[stud, plate, -stud]} />
      <Brick partNumber="3003" colorCode={4} position={[-stud, plate, stud]} />
      <Brick partNumber="3003" colorCode={4} position={[stud, plate, stud]} />

      {/* Second course, 2x4 yellow bricks forming longer walls */}
      <Brick partNumber="3001" colorCode={14} position={[0, plate + brick, -stud]} rotationY={0} />
      <Brick partNumber="3001" colorCode={14} position={[0, plate + brick, stud]} rotationY={0} />

      {/* Roof ridge — 1x2 bricks blue */}
      <Brick
        partNumber="3004"
        colorCode={1}
        position={[-stud / 2, plate + brick * 2, 0]}
        rotationY={90}
      />
      <Brick
        partNumber="3004"
        colorCode={1}
        position={[stud / 2, plate + brick * 2, 0]}
        rotationY={90}
      />

      {/* A decorative 1x1 white plate on top */}
      <Brick
        partNumber="3024"
        colorCode={15}
        position={[0, plate + brick * 3, 0]}
      />

      {/* Nearby: a solo 2x2 plate as a "garden" */}
      <Brick partNumber="3022" colorCode={2} position={[stud * 4, 0, 0]} />
      <Brick partNumber="3070" colorCode={72} position={[stud * 4, plate, 0]} />
    </group>
  );
}
