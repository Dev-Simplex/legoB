import { create } from 'zustand';

export type Mode = 'sandbox' | 'instructions';

interface ModeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggle: () => void;
}

export const useModeStore = create<ModeState>((set) => ({
  mode: 'sandbox',
  setMode: (mode) => set({ mode }),
  toggle: () =>
    set((s) => ({ mode: s.mode === 'sandbox' ? 'instructions' : 'sandbox' })),
}));
