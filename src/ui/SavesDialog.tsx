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
          err instanceof Error ? `Could not load saves: ${err.message}` : 'Could not load saves',
          'error'
        );
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleLoad = async (id: string) => {
    if (isDirty && !window.confirm('Discard unsaved changes and load this save?')) return;
    const scene = await sceneRepo.load(id);
    if (!scene) {
      toast('Could not load save — it may have been deleted.', 'error');
      return;
    }
    loadScene(scene);
    toast(`Loaded "${scene.name}"`, 'success');
    onClose();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await sceneRepo.delete(id);
    setSaves((prev) => prev?.filter((s) => s.id !== id) ?? null);
    toast(`Deleted "${name}"`, 'info');
  };

  const handleRename = async (id: string, oldName: string) => {
    const next = window.prompt('Rename save:', oldName);
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
      aria-label="My saves"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <header className="modal-header">
          <h2>My Saves</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </header>

        <div className="modal-body">
          {saves === null && <p className="muted">Loading…</p>}
          {saves && saves.length === 0 && (
            <p className="muted">
              You don’t have any saves yet. Build something in the sandbox and click{' '}
              <strong>Save</strong>.
            </p>
          )}
          {saves && saves.length > 0 && (
            <ul className="saves-list">
              {saves.map((s) => (
                <li key={s.id} className={s.id === currentSceneId ? 'current' : ''}>
                  <div className="save-info">
                    <div className="save-name">{s.name}</div>
                    <div className="save-meta">
                      {new Date(s.updatedAt).toLocaleString()}
                      {s.id === currentSceneId && ' · current'}
                    </div>
                  </div>
                  <div className="save-actions">
                    <button type="button" onClick={() => handleLoad(s.id)}>
                      Load
                    </button>
                    <button type="button" onClick={() => handleRename(s.id, s.name)}>
                      Rename
                    </button>
                    <button
                      type="button"
                      className="destructive"
                      onClick={() => handleDelete(s.id, s.name)}
                    >
                      Delete
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
