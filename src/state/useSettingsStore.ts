import { create } from 'zustand';

const STORAGE_KEY = 'legob:settings:v1';

interface SettingsState {
  autoSave: boolean;
  autoSaveIntervalMs: number;
  setAutoSave: (enabled: boolean) => void;
}

function loadPersisted(): Partial<SettingsState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    return parsed;
  } catch {
    return {};
  }
}

function persist(state: SettingsState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ autoSave: state.autoSave, autoSaveIntervalMs: state.autoSaveIntervalMs })
    );
  } catch {
    /* ignore quota/private-mode failures */
  }
}

const persisted = loadPersisted();

export const useSettingsStore = create<SettingsState>((set, get) => ({
  autoSave: persisted.autoSave ?? false,
  autoSaveIntervalMs: persisted.autoSaveIntervalMs ?? 30_000,

  setAutoSave: (enabled) => {
    set({ autoSave: enabled });
    persist(get());
  },
}));
