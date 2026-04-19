import type { LdrawColor } from '../types/domain';

/**
 * Minimal LDConfig subset — most-used color codes. Full LDConfig.ldr is parsed
 * on demand once LDrawLoader integration lands; this hand-curated set keeps the
 * procedural renderer self-sufficient for Stories 1.3 – 3.x.
 */
export const COLORS: readonly LdrawColor[] = [
  { code: 0, name: 'Black', rgb: '#05131D', material: 'solid', alpha: 1 },
  { code: 1, name: 'Blue', rgb: '#0055BF', material: 'solid', alpha: 1 },
  { code: 2, name: 'Green', rgb: '#257A3E', material: 'solid', alpha: 1 },
  { code: 3, name: 'Dark Turquoise', rgb: '#00838F', material: 'solid', alpha: 1 },
  { code: 4, name: 'Red', rgb: '#C91A09', material: 'solid', alpha: 1 },
  { code: 5, name: 'Dark Pink', rgb: '#C870A0', material: 'solid', alpha: 1 },
  { code: 6, name: 'Brown', rgb: '#583927', material: 'solid', alpha: 1 },
  { code: 7, name: 'Light Gray', rgb: '#9BA19D', material: 'solid', alpha: 1 },
  { code: 8, name: 'Dark Gray', rgb: '#6D6E5C', material: 'solid', alpha: 1 },
  { code: 9, name: 'Light Blue', rgb: '#B4D2E3', material: 'solid', alpha: 1 },
  { code: 10, name: 'Bright Green', rgb: '#4B9F4A', material: 'solid', alpha: 1 },
  { code: 11, name: 'Light Turquoise', rgb: '#55A5AF', material: 'solid', alpha: 1 },
  { code: 12, name: 'Salmon', rgb: '#F2705E', material: 'solid', alpha: 1 },
  { code: 13, name: 'Pink', rgb: '#FC97AC', material: 'solid', alpha: 1 },
  { code: 14, name: 'Yellow', rgb: '#F2CD37', material: 'solid', alpha: 1 },
  { code: 15, name: 'White', rgb: '#FFFFFF', material: 'solid', alpha: 1 },
  { code: 17, name: 'Light Green', rgb: '#C2DAB8', material: 'solid', alpha: 1 },
  { code: 19, name: 'Tan', rgb: '#E4CD9E', material: 'solid', alpha: 1 },
  { code: 22, name: 'Purple', rgb: '#81007B', material: 'solid', alpha: 1 },
  { code: 25, name: 'Orange', rgb: '#FE8A18', material: 'solid', alpha: 1 },
  { code: 27, name: 'Neon Yellow', rgb: '#CEE3F6', material: 'solid', alpha: 1 },
  { code: 28, name: 'Dark Tan', rgb: '#958A73', material: 'solid', alpha: 1 },
  { code: 71, name: 'Light Bluish Gray', rgb: '#A0A5A9', material: 'solid', alpha: 1 },
  { code: 72, name: 'Dark Bluish Gray', rgb: '#6C6E68', material: 'solid', alpha: 1 },
  { code: 36, name: 'Trans Red', rgb: '#C91A09', material: 'transparent', alpha: 0.6 },
  { code: 40, name: 'Trans Black', rgb: '#635F52', material: 'transparent', alpha: 0.6 },
  { code: 41, name: 'Trans Light Blue', rgb: '#AEE9EF', material: 'transparent', alpha: 0.7 },
  { code: 43, name: 'Trans Medium Blue', rgb: '#C1DFF0', material: 'transparent', alpha: 0.7 },
  { code: 47, name: 'Trans Clear', rgb: '#FCFCFC', material: 'transparent', alpha: 0.5 },
  { code: 46, name: 'Trans Yellow', rgb: '#F5CD2F', material: 'transparent', alpha: 0.6 },
  { code: 383, name: 'Chrome Silver', rgb: '#E0E0E0', material: 'chrome', alpha: 1 },
  { code: 334, name: 'Chrome Gold', rgb: '#BBA53D', material: 'chrome', alpha: 1 },
  { code: 61, name: 'Pearl Light Gray', rgb: '#9CA3A6', material: 'pearl', alpha: 1 },
];

export const COLORS_BY_CODE: ReadonlyMap<number, LdrawColor> = new Map(
  COLORS.map((c) => [c.code, c])
);

export const DEFAULT_COLOR: LdrawColor = {
  code: 16,
  name: 'Main Color',
  rgb: '#FFFFFF',
  material: 'solid',
  alpha: 1,
};

export function getColor(code: number): LdrawColor {
  return COLORS_BY_CODE.get(code) ?? DEFAULT_COLOR;
}
