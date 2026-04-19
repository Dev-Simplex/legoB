# State Management (Zustand)

Pattern: one store per domain; no god store; selectors for subscriptions.

## Stores

### `useSceneStore`

```typescript
interface SceneState {
  scene: Scene;
  selectedPartId: string | null;
  isDirty: boolean;

  addPart: (part: Omit<Part, 'id'>) => void;
  removePart: (id: string) => void;
  updatePart: (id: string, patch: Partial<Part>) => void;
  selectPart: (id: string | null) => void;
  loadScene: (scene: Scene) => void;
  resetScene: () => void;
  markClean: () => void;
}
```

### `useModeStore`

```typescript
interface ModeState {
  view: 'home' | 'sandbox' | 'instructions' | 'saves' | 'settings';
  setView: (view: ModeState['view']) => void;
}
```

### `usePlaybackStore`

Populated only in Instructions mode.

```typescript
interface PlaybackState {
  steps: Step[];
  currentStep: number;
  playing: boolean;
  ghost: boolean;

  setSteps: (steps: Step[]) => void;
  next: () => void;
  prev: () => void;
  jumpTo: (index: number) => void;
  play: () => void;
  pause: () => void;
  toggleGhost: () => void;
}
```

### `usePaletteStore`

```typescript
interface PaletteState {
  activePartNumber: string | null;
  searchQuery: string;
  category: 'all' | 'brick' | 'plate' | 'tile' | 'slope' | 'special';

  setActivePart: (partNumber: string | null) => void;
  setSearch: (query: string) => void;
  setCategory: (category: PaletteState['category']) => void;
}
```

### `useSettingsStore`

```typescript
interface SettingsState {
  reduceMotion: boolean;            // mirrors prefers-reduced-motion by default
  fpsOverlay: boolean;              // dev-only
  cacheSize: number;                // bytes
  unsavedPrompt: boolean;

  update: (patch: Partial<Omit<SettingsState, 'update'>>) => void;
}
```

## Rules

- **Persistence is explicit** — stores do NOT auto-save. User Save action triggers `sceneRepo.save(useSceneStore.getState().scene)`.
- **Cross-store reads via getters** at the call site, not subscriptions. Example: `useSceneStore.getState().scene.parts`.
- **Immutable updates** — use `immer` middleware only if arrays grow unwieldy (optional).
- **Selectors always** — `useSceneStore(s => s.scene.parts.length)`, never `useSceneStore()` without selector.

→ Full context: [../fullstack-architecture.md#state-management-architecture](../fullstack-architecture.md#state-management-architecture)
