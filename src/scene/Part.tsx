import type { ThreeEvent } from '@react-three/fiber';
import { Brick } from './Brick';
import { Figure } from './Figure';
import { getPalette } from '../data/palette';

export type PartPointerHandler = (event: ThreeEvent<PointerEvent>) => void;

export interface PartProps {
  partNumber: string;
  colorCode: number;
  position: readonly [number, number, number];
  rotationY?: 0 | 90 | 180 | 270;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onContextMenu?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerDown?: PartPointerHandler;
  onPointerOver?: PartPointerHandler;
  onPointerOut?: PartPointerHandler;
  selected?: boolean;
  opacity?: number;
}

/**
 * Dispatcher de renderização — escolhe o componente correto com base na
 * categoria da peça na palette. Mantém o modelo de dados uniforme
 * (partNumber + colorCode + position + rotationY) enquanto permite
 * geometrias especializadas (tijolos retangulares vs. figuras humanóides).
 */
export function Part(props: PartProps) {
  const entry = getPalette(props.partNumber);
  if (entry.category === 'figure') {
    return <Figure {...props} />;
  }
  return <Brick {...props} />;
}
