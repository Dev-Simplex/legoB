import { create } from 'zustand';

const STORAGE_KEY = 'legob:settings:v2';
const DEFAULT_INTERVAL_MS = 10_000;
const DEFAULT_GROUND_COLOR = '#e2e8f0';

interface SettingsState {
  autoSave: boolean;
  autoSaveIntervalMs: number;
  /** Timestamp em ms do último auto-save bem-sucedido. 0 = nunca. */
  lastAutoSaveAt: number;
  /** Cor da base/plataforma onde os legos são construídos. */
  groundColor: string;
  setAutoSave: (enabled: boolean) => void;
  setLastAutoSaveAt: (ts: number) => void;
  setGroundColor: (color: string) => void;
  resetGroundColor: () => void;
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

function persist(state: Pick<SettingsState, 'autoSave' | 'autoSaveIntervalMs' | 'groundColor'>) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        autoSave: state.autoSave,
        autoSaveIntervalMs: state.autoSaveIntervalMs,
        groundColor: state.groundColor,
      })
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
  groundColor: persisted.groundColor ?? DEFAULT_GROUND_COLOR,

  setAutoSave: (enabled) => {
    set({ autoSave: enabled });
    persist(get());
  },

  setLastAutoSaveAt: (ts) => set({ lastAutoSaveAt: ts }),

  setGroundColor: (color) => {
    set({ groundColor: color });
    persist(get());
  },

  resetGroundColor: () => {
    set({ groundColor: DEFAULT_GROUND_COLOR });
    persist(get());
  },
}));
