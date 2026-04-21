import { create } from 'zustand';

const STORAGE_KEY = 'legob:settings:v2';
const DEFAULT_INTERVAL_MS = 10_000;

interface SettingsState {
  autoSave: boolean;
  autoSaveIntervalMs: number;
  /** Timestamp em ms do último auto-save bem-sucedido. 0 = nunca. */
  lastAutoSaveAt: number;
  setAutoSave: (enabled: boolean) => void;
  setLastAutoSaveAt: (ts: number) => void;
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

function persist(state: Pick<SettingsState, 'autoSave' | 'autoSaveIntervalMs'>) {
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
  autoSaveIntervalMs: persisted.autoSaveIntervalMs ?? DEFAULT_INTERVAL_MS,
  lastAutoSaveAt: 0,

  setAutoSave: (enabled) => {
    set({ autoSave: enabled });
    const state = get();
    persist({ autoSave: state.autoSave, autoSaveIntervalMs: state.autoSaveIntervalMs });
  },

  setLastAutoSaveAt: (ts) => set({ lastAutoSaveAt: ts }),
}));
