import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoSave } from './useAutoSave';
import { useSceneStore } from './useSceneStore';
import { useSettingsStore } from './useSettingsStore';
import { sceneRepo } from '../io/sceneRepo';

vi.mock('../io/sceneRepo', () => ({
  sceneRepo: { save: vi.fn().mockResolvedValue(undefined) },
}));
vi.mock('../io/captureThumb', () => ({
  captureThumb: () => null,
}));
vi.mock('../ui/toast', () => ({
  toast: vi.fn(),
}));

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSceneStore.getState().resetScene();
    useSettingsStore.setState({ autoSave: false });
    vi.mocked(sceneRepo.save).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does nothing when autoSave is off', () => {
    renderHook(() => useAutoSave());
    useSceneStore
      .getState()
      .addPart({ partNumber: '3003', colorCode: 4, position: [0, 0, 0], rotationY: 0, stepIndex: null });
    vi.advanceTimersByTime(60_000);
    expect(sceneRepo.save).not.toHaveBeenCalled();
  });

  it('skips tick when scene has no parts', () => {
    useSettingsStore.setState({ autoSave: true, autoSaveIntervalMs: 10_000 });
    renderHook(() => useAutoSave());
    vi.advanceTimersByTime(15_000);
    expect(sceneRepo.save).not.toHaveBeenCalled();
  });

  it('skips tick when scene is clean', () => {
    useSettingsStore.setState({ autoSave: true, autoSaveIntervalMs: 10_000 });
    renderHook(() => useAutoSave());
    useSceneStore
      .getState()
      .addPart({ partNumber: '3003', colorCode: 4, position: [0, 0, 0], rotationY: 0, stepIndex: null });
    useSceneStore.getState().markClean();
    vi.advanceTimersByTime(15_000);
    expect(sceneRepo.save).not.toHaveBeenCalled();
  });

  it('fires first tick after 2s when autoSave is on and scene is dirty', async () => {
    useSettingsStore.setState({ autoSave: true, autoSaveIntervalMs: 10_000 });
    renderHook(() => useAutoSave());
    useSceneStore
      .getState()
      .addPart({ partNumber: '3003', colorCode: 4, position: [0, 0, 0], rotationY: 0, stepIndex: null });

    await vi.advanceTimersByTimeAsync(2_500);
    expect(sceneRepo.save).toHaveBeenCalledOnce();
  });

  it('auto-assigns a "Rascunho ..." name when scene is still "Sem título"', async () => {
    useSettingsStore.setState({ autoSave: true, autoSaveIntervalMs: 10_000 });
    renderHook(() => useAutoSave());
    useSceneStore
      .getState()
      .addPart({ partNumber: '3003', colorCode: 4, position: [0, 0, 0], rotationY: 0, stepIndex: null });

    await vi.advanceTimersByTimeAsync(2_500);
    expect(sceneRepo.save).toHaveBeenCalledOnce();
    const savedArg = vi.mocked(sceneRepo.save).mock.calls[0]?.[0];
    expect(savedArg?.name).toMatch(/^Rascunho \d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });
});
