import { useState } from 'react';
import { useSceneStore } from '../state/useSceneStore';
import { sceneRepo } from '../io/sceneRepo';
import { writeMpd, readMpd } from '../io/mpdCodec';
import { downloadText, openFilePicker } from '../io/fileIo';
import { toast } from './toast';
import { SavesDialog } from './SavesDialog';

export function TopToolbar() {
  const scene = useSceneStore((s) => s.scene);
  const loadScene = useSceneStore((s) => s.loadScene);
  const resetScene = useSceneStore((s) => s.resetScene);
  const isDirty = useSceneStore((s) => s.isDirty);
  const markClean = useSceneStore((s) => s.markClean);
  const partCount = scene.parts.length;
  const [savesOpen, setSavesOpen] = useState(false);

  const handleSave = async () => {
    let name = scene.name;
    if (name === 'Untitled') {
      const entered = window.prompt('Name your creation:', 'My Build');
      if (!entered) return;
      name = entered;
    }
    try {
      await sceneRepo.save({ ...scene, name });
      loadScene({ ...scene, name });
      markClean();
      toast(`Saved as "${name}"`, 'success');
    } catch (err) {
      toast(
        err instanceof Error ? `Save failed: ${err.message}` : 'Save failed',
        'error'
      );
    }
  };

  const handleExport = async () => {
    const text = writeMpd(scene);
    const safeName = scene.name.replace(/[^\w\-. ]/g, '_') || 'untitled';
    try {
      const result = await downloadText(text, `${safeName}.mpd`);
      if (result === 'cancelled') return;
      toast('Exported .mpd file', 'success');
    } catch (err) {
      toast(err instanceof Error ? `Export failed: ${err.message}` : 'Export failed', 'error');
    }
  };

  const handleImport = async () => {
    if (isDirty && !window.confirm('Discard unsaved changes before importing?')) return;
    const file = await openFilePicker();
    if (!file) return;
    try {
      const { scene: imported, warnings } = readMpd(file.text, file.name);
      loadScene(imported);
      if (warnings.length > 0) {
        toast(
          `Imported with ${warnings.length} warning${warnings.length === 1 ? '' : 's'}. See console.`,
          'warning'
        );
        warnings.forEach((w) => console.warn(`[import ${w.code}]`, w.message));
      } else {
        toast(`Imported ${imported.parts.length} bricks from ${file.name}`, 'success');
      }
    } catch (err) {
      toast(
        err instanceof Error ? `Import failed: ${err.message}` : 'Import failed',
        'error'
      );
    }
  };

  const handleClear = () => {
    if (!isDirty || window.confirm('Discard all bricks and start over?')) {
      resetScene();
    }
  };

  return (
    <>
      <header className="top-bar">
        <h1>LegoB</h1>
        <span className="status">Sandbox</span>
        <div className="top-bar-spacer" />
        <span className="stat-chip" aria-label={`${partCount} bricks in scene`}>
          {partCount} bricks
        </span>
        {isDirty && <span className="stat-chip dirty">● unsaved</span>}
        <button type="button" onClick={handleSave} aria-label="Save scene">
          Save
        </button>
        <button type="button" onClick={() => setSavesOpen(true)} aria-label="Open my saves">
          My Saves
        </button>
        <button type="button" onClick={handleImport} aria-label="Import .mpd file">
          Open
        </button>
        <button type="button" onClick={handleExport} aria-label="Export as .mpd">
          Export
        </button>
        <button type="button" onClick={handleClear} aria-label="Clear scene">
          Clear
        </button>
      </header>

      <SavesDialog open={savesOpen} onClose={() => setSavesOpen(false)} />
    </>
  );
}
