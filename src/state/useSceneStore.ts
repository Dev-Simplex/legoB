import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Part, Scene } from '../types/domain';

interface SceneState {
  scene: Scene;
  selectedPartId: string | null;
  isDirty: boolean;

  addPart: (part: Omit<Part, 'id'>) => string;
  removePart: (id: string) => void;
  updatePart: (id: string, patch: Partial<Omit<Part, 'id'>>) => void;
  selectPart: (id: string | null) => void;
  loadScene: (scene: Scene) => void;
  resetScene: () => void;
  markClean: () => void;
}

function emptyScene(): Scene {
  const now = Date.now();
  return {
    id: nanoid(),
    name: 'Sem título',
    parts: [],
    steps: [],
    mode: 'sandbox',
    createdAt: now,
    updatedAt: now,
    thumbnail: null,
    schemaVersion: 1,
  };
}

export const useSceneStore = create<SceneState>((set) => ({
  scene: emptyScene(),
  selectedPartId: null,
  isDirty: false,

  addPart: (part) => {
    const id = nanoid();
    set((state) => ({
      scene: {
        ...state.scene,
        parts: [...state.scene.parts, { ...part, id }],
        updatedAt: Date.now(),
      },
      isDirty: true,
    }));
    return id;
  },

  removePart: (id) =>
    set((state) => ({
      scene: {
        ...state.scene,
        parts: state.scene.parts.filter((p) => p.id !== id),
        updatedAt: Date.now(),
      },
      selectedPartId: state.selectedPartId === id ? null : state.selectedPartId,
      isDirty: true,
    })),

  updatePart: (id, patch) =>
    set((state) => ({
      scene: {
        ...state.scene,
        parts: state.scene.parts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        updatedAt: Date.now(),
      },
      isDirty: true,
    })),

  selectPart: (id) => set({ selectedPartId: id }),

  loadScene: (scene) =>
    set({ scene: { ...scene, updatedAt: Date.now() }, selectedPartId: null, isDirty: false }),

  resetScene: () => set({ scene: emptyScene(), selectedPartId: null, isDirty: false }),

  markClean: () => set({ isDirty: false }),
}));
