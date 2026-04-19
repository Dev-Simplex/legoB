import { create } from 'zustand';
import { PALETTE, getPalette } from '../data/palette';
import type { BrickCategory } from '../types/domain';

interface PaletteState {
  activePartNumber: string | null;
  activeColorCode: number;
  searchQuery: string;
  category: BrickCategory | 'all';

  setActivePart: (partNumber: string | null) => void;
  setActiveColor: (code: number) => void;
  setSearch: (query: string) => void;
  setCategory: (category: BrickCategory | 'all') => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  activePartNumber: PALETTE[0]?.partNumber ?? null,
  activeColorCode: PALETTE[0]?.defaultColorCode ?? 15,
  searchQuery: '',
  category: 'all',

  setActivePart: (partNumber) =>
    set(() => ({
      activePartNumber: partNumber,
      // When switching palette entry, seed the active color from the entry's default
      // unless the user has explicitly set a color.
      activeColorCode: partNumber
        ? (getPalette(partNumber).defaultColorCode ?? 15)
        : 15,
    })),
  setActiveColor: (code) => set({ activeColorCode: code }),
  setSearch: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ category }),
}));
