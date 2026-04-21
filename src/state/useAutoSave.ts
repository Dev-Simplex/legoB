import { useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { useSceneStore } from './useSceneStore';
import { useSettingsStore } from './useSettingsStore';
import { sceneRepo } from '../io/sceneRepo';
import { captureThumb } from '../io/captureThumb';

/**
 * Auto-save loop. Só roda quando todas as condições são verdadeiras:
 *   - autoSave está ligado nas configurações
 *   - a cena atual já foi nomeada pelo usuário (não está "Sem título")
 *   - há alterações não salvas (isDirty=true)
 *
 * Em cada tique, captura um thumbnail atualizado e grava via sceneRepo.
 */
export function useAutoSave(): void {
  const autoSave = useSettingsStore((s) => s.autoSave);
  const intervalMs = useSettingsStore((s) => s.autoSaveIntervalMs);
  const busy = useRef(false);

  useEffect(() => {
    if (!autoSave) return;

    const tick = async () => {
      if (busy.current) return;
      const state = useSceneStore.getState();
      if (!state.isDirty) return;
      const scene = state.scene;
      if (!scene.name || scene.name === 'Sem título') return;

      busy.current = true;
      try {
        await sceneRepo.save({
          ...scene,
          id: scene.id ?? nanoid(),
          thumbnail: captureThumb() ?? scene.thumbnail ?? null,
        });
        state.markClean();
      } catch (err) {
        console.warn('[auto-save]', err);
      } finally {
        busy.current = false;
      }
    };

    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [autoSave, intervalMs]);
}
