import { useEffect, useState } from 'react';
import { sceneRepo, type SceneSummary } from '../io/sceneRepo';
import { useSceneStore } from '../state/useSceneStore';
import { toast } from './toast';
import { PromptDialog } from './PromptDialog';

interface SavesDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SavesDialog({ open, onClose }: SavesDialogProps) {
  const [saves, setSaves] = useState<SceneSummary[] | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);
  const loadScene = useSceneStore((s) => s.loadScene);
  const currentSceneId = useSceneStore((s) => s.scene.id);
  const isDirty = useSceneStore((s) => s.isDirty);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    sceneRepo
      .list()
      .then((list) => !cancelled && setSaves(list))
      .catch((err: unknown) => {
        if (cancelled) return;
        setSaves([]);
        console.error('[LegoB] list saves failed', err);
        toast(
          err instanceof Error
            ? `Não foi possível carregar os salvos: ${err.message}`
            : 'Não foi possível carregar os salvos',
          'error'
        );
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleLoad = async (id: string) => {
    if (isDirty && !window.confirm('Descartar alterações não salvas e carregar este salvo?'))
      return;
    try {
      const scene = await sceneRepo.load(id);
      if (!scene) {
        toast('Não foi possível carregar o salvo — talvez tenha sido apagado.', 'error');
        return;
      }
      loadScene(scene);
      toast(`"${scene.name}" carregado`, 'success');
      onClose();
    } catch (err) {
      console.error('[LegoB] load save failed', err);
      toast(
        err instanceof Error ? `Falha ao carregar: ${err.message}` : 'Falha ao carregar',
        'error'
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Excluir "${name}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await sceneRepo.delete(id);
      setSaves((prev) => prev?.filter((s) => s.id !== id) ?? null);
      toast(`"${name}" excluído`, 'info');
    } catch (err) {
      console.error('[LegoB] delete save failed', err);
      toast(
        err instanceof Error ? `Falha ao excluir: ${err.message}` : 'Falha ao excluir',
        'error'
      );
    }
  };

  const handleRenameConfirm = async (nextName: string) => {
    if (!renameTarget) return;
    const { id } = renameTarget;
    setRenameTarget(null);
    try {
      await sceneRepo.rename(id, nextName);
      setSaves(
        (prev) => prev?.map((s) => (s.id === id ? { ...s, name: nextName } : s)) ?? null
      );
      toast(`Renomeado para "${nextName}"`, 'success');
    } catch (err) {
      console.error('[LegoB] rename save failed', err);
      toast(
        err instanceof Error ? `Falha ao renomear: ${err.message}` : 'Falha ao renomear',
        'error'
      );
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Meus salvos"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal saves-modal">
          <header className="modal-header">
            <h2>Meus salvos</h2>
            <button type="button" onClick={onClose} aria-label="Fechar diálogo">
              ×
            </button>
          </header>

          <div className="modal-body">
            {saves === null && <p className="muted">Carregando…</p>}
            {saves && saves.length === 0 && (
              <p className="muted">
                Você ainda não tem salvos. Construa algo no modo livre e clique em{' '}
                <strong>Salvar</strong>.
              </p>
            )}
            {saves && saves.length > 0 && (
              <ul className="saves-grid">
                {saves.map((s) => (
                  <li
                    key={s.id}
                    className={`save-card ${s.id === currentSceneId ? 'current' : ''}`}
                  >
                    <button
                      type="button"
                      className="save-thumb-btn"
                      onClick={() => handleLoad(s.id)}
                      aria-label={`Carregar ${s.name}`}
                    >
                      {s.thumbnail ? (
                        <img src={s.thumbnail} alt="" className="save-thumb" />
                      ) : (
                        <div className="save-thumb save-thumb-placeholder" aria-hidden>
                          <span>sem prévia</span>
                        </div>
                      )}
                      {s.id === currentSceneId && <span className="save-badge">atual</span>}
                    </button>

                    <div className="save-info">
                      <div className="save-name" title={s.name}>
                        {s.name}
                      </div>
                      <div className="save-meta">
                        {s.partCount} {s.partCount === 1 ? 'peça' : 'peças'} ·{' '}
                        {new Date(s.updatedAt).toLocaleString('pt-BR')}
                      </div>
                    </div>

                    <div className="save-actions">
                      <button type="button" onClick={() => handleLoad(s.id)}>
                        Carregar
                      </button>
                      <button
                        type="button"
                        onClick={() => setRenameTarget({ id: s.id, name: s.name })}
                      >
                        Renomear
                      </button>
                      <button
                        type="button"
                        className="destructive"
                        onClick={() => handleDelete(s.id, s.name)}
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <PromptDialog
        open={renameTarget !== null}
        title="Renomear salvo"
        defaultValue={renameTarget?.name ?? ''}
        placeholder="Novo nome"
        confirmLabel="Renomear"
        onConfirm={handleRenameConfirm}
        onCancel={() => setRenameTarget(null)}
      />
    </>
  );
}
