import type { LdrawColor } from '../types/domain';

/**
 * Subconjunto do LDConfig — cores mais usadas. O LDConfig.ldr completo é
 * baixado sob demanda quando a integração com LDrawLoader for feita; este
 * conjunto curado mantém o renderer procedural auto-suficiente nas Stories
 * 1.3 – 3.x. Nomes traduzidos para pt-BR.
 */
export const COLORS: readonly LdrawColor[] = [
  { code: 0, name: 'Preto', rgb: '#05131D', material: 'solid', alpha: 1 },
  { code: 1, name: 'Azul', rgb: '#0055BF', material: 'solid', alpha: 1 },
  { code: 2, name: 'Verde', rgb: '#257A3E', material: 'solid', alpha: 1 },
  { code: 3, name: 'Turquesa Escuro', rgb: '#00838F', material: 'solid', alpha: 1 },
  { code: 4, name: 'Vermelho', rgb: '#C91A09', material: 'solid', alpha: 1 },
  { code: 5, name: 'Rosa Escuro', rgb: '#C870A0', material: 'solid', alpha: 1 },
  { code: 6, name: 'Marrom', rgb: '#583927', material: 'solid', alpha: 1 },
  { code: 7, name: 'Cinza Claro', rgb: '#9BA19D', material: 'solid', alpha: 1 },
  { code: 8, name: 'Cinza Escuro', rgb: '#6D6E5C', material: 'solid', alpha: 1 },
  { code: 9, name: 'Azul Claro', rgb: '#B4D2E3', material: 'solid', alpha: 1 },
  { code: 10, name: 'Verde Brilhante', rgb: '#4B9F4A', material: 'solid', alpha: 1 },
  { code: 11, name: 'Turquesa Claro', rgb: '#55A5AF', material: 'solid', alpha: 1 },
  { code: 12, name: 'Salmão', rgb: '#F2705E', material: 'solid', alpha: 1 },
  { code: 13, name: 'Rosa', rgb: '#FC97AC', material: 'solid', alpha: 1 },
  { code: 14, name: 'Amarelo', rgb: '#F2CD37', material: 'solid', alpha: 1 },
  { code: 15, name: 'Branco', rgb: '#FFFFFF', material: 'solid', alpha: 1 },
  { code: 17, name: 'Verde Claro', rgb: '#C2DAB8', material: 'solid', alpha: 1 },
  { code: 19, name: 'Bege', rgb: '#E4CD9E', material: 'solid', alpha: 1 },
  { code: 22, name: 'Roxo', rgb: '#81007B', material: 'solid', alpha: 1 },
  { code: 25, name: 'Laranja', rgb: '#FE8A18', material: 'solid', alpha: 1 },
  { code: 27, name: 'Amarelo Neon', rgb: '#CEE3F6', material: 'solid', alpha: 1 },
  { code: 28, name: 'Bege Escuro', rgb: '#958A73', material: 'solid', alpha: 1 },
  { code: 71, name: 'Cinza Azulado Claro', rgb: '#A0A5A9', material: 'solid', alpha: 1 },
  { code: 72, name: 'Cinza Azulado Escuro', rgb: '#6C6E68', material: 'solid', alpha: 1 },
  { code: 36, name: 'Vermelho Translúcido', rgb: '#C91A09', material: 'transparent', alpha: 0.6 },
  { code: 40, name: 'Preto Translúcido', rgb: '#635F52', material: 'transparent', alpha: 0.6 },
  { code: 41, name: 'Azul Claro Translúcido', rgb: '#AEE9EF', material: 'transparent', alpha: 0.7 },
  { code: 43, name: 'Azul Médio Translúcido', rgb: '#C1DFF0', material: 'transparent', alpha: 0.7 },
  { code: 47, name: 'Transparente', rgb: '#FCFCFC', material: 'transparent', alpha: 0.5 },
  { code: 46, name: 'Amarelo Translúcido', rgb: '#F5CD2F', material: 'transparent', alpha: 0.6 },
  { code: 383, name: 'Cromo Prata', rgb: '#E0E0E0', material: 'chrome', alpha: 1 },
  { code: 334, name: 'Cromo Dourado', rgb: '#BBA53D', material: 'chrome', alpha: 1 },
  { code: 61, name: 'Cinza Perolado Claro', rgb: '#9CA3A6', material: 'pearl', alpha: 1 },
];

export const COLORS_BY_CODE: ReadonlyMap<number, LdrawColor> = new Map(
  COLORS.map((c) => [c.code, c])
);

export const DEFAULT_COLOR: LdrawColor = {
  code: 16,
  name: 'Cor Principal',
  rgb: '#FFFFFF',
  material: 'solid',
  alpha: 1,
};

export function getColor(code: number): LdrawColor {
  return COLORS_BY_CODE.get(code) ?? DEFAULT_COLOR;
}
