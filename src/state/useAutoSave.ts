import { useEffect, useRef } from 'react';
import { useSceneStore } from './useSceneStore';
import { useSettingsStore } from './useSettingsStore';
import { sceneRepo } from '../io/sceneRepo';
import { captureThumb } from '../io/captureThumb';
import { toast } from '../ui/toast';

const UNTITLED = 'Sem título';

function autoName(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `Rascunho ${y}-${m}-${d} ${hh}:${mm}`;
}

/**
 * Auto-save loop. Dispara a cada `autoSaveIntervalMs` quando ligado.
 * - Só grava se a cena tem peças E está suja (isDirty).
 * - Se a cena ainda não tem nome, atribui um "Rascunho {timestamp}" automático
 *   para que o usuário nunca perca trabalho por esquecer de nomear.
 * - Mostra toast informativo no sucesso e erro — sem feedback visual
 *   o usuário não sabe se está funcionando.
 */
export function useAutoSave(): void {
  const autoSave = useSettingsStore((s) => s.autoSave);
  const intervalMs = useSettingsStore((s) => s.autoSaveIntervalMs);
  const setLastAutoSaveAt = useSettingsStore((s) => s.setLastAutoSaveAt);
  const busy = useRef(false);

  useEffect(() => {
    if (!autoSave) return;

    const tick = async () => {
      if (busy.current) return;
      const state = useSceneStore.getState();
      if (!state.isDirty) return;
      const scene = state.scene;
      if (scene.parts.length === 0) return;

      busy.current = true;
      const displayName = !scene.name || scene.name === UNTITLED ? autoName() : scene.name;

      try {
        const toSave = {
          ...scene,
          name: displayName,
          thumbnail: captureThumb() ?? scene.thumbnail ?? null,
        };
        await sceneRepo.save(toSave);
        // Sincroniza o store com o nome atribuído (se era "Sem título") para
        // que o próximo auto-save use o mesmo nome em vez de criar outro rascunho.
        state.loadScene({ ...toSave, updatedAt: Date.now() });
        setLastAutoSaveAt(Date.now());
        toast(`💾 Auto-save · "${displayName}"`, 'info');
      } catch (err) {
        console.error('[LegoB] auto-save falhou', err);
        toast(
          err instanceof Error
            ? `Auto-save falhou: ${err.message}`
            : 'Auto-save falhou',
          'error'
        );
      } finally {
        busy.current = false;
      }
    };

    // Primeiro tique logo após ligar (2s) para confirmar que está ativo;
    // depois mantém o intervalo normal.
    const firstTickId = window.setTimeout(tick, 2000);
    const intervalId = window.setInterval(tick, intervalMs);
    return () => {
      window.clearTimeout(firstTickId);
      window.clearInterval(intervalId);
    };
  }, [autoSave, intervalMs, setLastAutoSaveAt]);
}
