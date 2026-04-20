import { useEffect, useState } from 'react';
import { sceneRepo, type SceneSummary } from '../io/sceneRepo';
import { useSceneStore } from '../state/useSceneStore';
import { toast } from './toast';

interface SavesDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SavesDialog({ open, onClose }: SavesDialogProps) {
  const [saves, setSaves] = useState<SceneSummary[] | null>(null);
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
    const scene = await sceneRepo.load(id);
    if (!scene) {
      toast('Não foi possível carregar o salvo — talvez tenha sido apagado.', 'error');
      return;
    }
    loadScene(scene);
    toast(`"${scene.name}" carregado`, 'success');
    onClose();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Excluir "${name}"? Essa ação não pode ser desfeita.`)) return;
    await sceneRepo.delete(id);
    setSaves((prev) => prev?.filter((s) => s.id !== id) ?? null);
    toast(`"${name}" excluído`, 'info');
  };

  const handleRename = async (id: string, oldName: string) => {
    const next = window.prompt('Renomear salvo:', oldName);
    if (!next || next === oldName) return;
    await sceneRepo.rename(id, next);
    setSaves(
      (prev) => prev?.map((s) => (s.id === id ? { ...s, name: next } : s)) ?? null
    );
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Meus salvos"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
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
            <ul className="saves-list">
              {saves.map((s) => (
                <li key={s.id} className={s.id === currentSceneId ? 'current' : ''}>
                  <div className="save-info">
                    <div className="save-name">{s.name}</div>
                    <div className="save-meta">
                      {new Date(s.updatedAt).toLocaleString('pt-BR')}
                      {s.id === currentSceneId && ' · atual'}
                    </div>
                  </div>
                  <div className="save-actions">
                    <button type="button" onClick={() => handleLoad(s.id)}>
                      Carregar
                    </button>
                    <button type="button" onClick={() => handleRename(s.id, s.name)}>
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
  );
}
