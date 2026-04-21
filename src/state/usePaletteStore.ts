import { create } from 'zustand';
import { PALETTE, getPalette } from '../data/palette';
import type { BrickCategory } from '../types/domain';

interface PaletteState {
  activePartNumber: string | null;
  activeColorCode: number;
  searchQuery: string;
  category: BrickCategory | 'all';
  /** Quando true, clicar numa peça colocada a apaga. Desliga ao colocar uma peça nova. */
  eraserMode: boolean;

  setActivePart: (partNumber: string | null) => void;
  setActiveColor: (code: number) => void;
  setSearch: (query: string) => void;
  setCategory: (category: BrickCategory | 'all') => void;
  setEraserMode: (on: boolean) => void;
  toggleEraserMode: () => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  activePartNumber: PALETTE[0]?.partNumber ?? null,
  activeColorCode: PALETTE[0]?.defaultColorCode ?? 15,
  searchQuery: '',
  category: 'all',
  eraserMode: false,

  setActivePart: (partNumber) =>
    set(() => ({
      activePartNumber: partNumber,
      eraserMode: false, // selecionar peça desliga a borracha
      activeColorCode: partNumber ? (getPalette(partNumber).defaultColorCode ?? 15) : 15,
    })),
  setActiveColor: (code) => set({ activeColorCode: code }),
  setSearch: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ category }),
  setEraserMode: (on) =>
    set(() => ({
      eraserMode: on,
      // Ligar a borracha desliga a peça ativa (não faz sentido colocar + apagar ao mesmo tempo)
      activePartNumber: on ? null : PALETTE[0]?.partNumber ?? null,
    })),
  toggleEraserMode: () =>
    set((state) => ({
      eraserMode: !state.eraserMode,
      activePartNumber: !state.eraserMode ? null : PALETTE[0]?.partNumber ?? null,
    })),
}));
