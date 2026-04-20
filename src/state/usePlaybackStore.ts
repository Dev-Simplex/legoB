import { create } from 'zustand';

interface PlaybackState {
  /** Current 0-based step index. */
  currentStep: number;
  /** Auto-advance playback. */
  playing: boolean;
  /** Show ghost preview of next step's parts. */
  ghost: boolean;

  setStep: (index: number) => void;
  next: (max: number) => void;
  prev: () => void;
  jumpTo: (index: number) => void;
  play: () => void;
  pause: () => void;
  toggleGhost: () => void;
  reset: () => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  currentStep: 0,
  playing: false,
  ghost: true,

  setStep: (index) => set({ currentStep: Math.max(0, index) }),
  next: (max) => set((s) => ({ currentStep: Math.min(max, s.currentStep + 1) })),
  prev: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  jumpTo: (index) => set({ currentStep: Math.max(0, index) }),
  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
  toggleGhost: () => set((s) => ({ ghost: !s.ghost })),
  reset: () => set({ currentStep: 0, playing: false }),
}));
