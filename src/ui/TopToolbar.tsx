import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useSceneStore } from '../state/useSceneStore';
import { useModeStore } from '../state/useModeStore';
import { useSettingsStore } from '../state/useSettingsStore';
import { sceneRepo } from '../io/sceneRepo';
import { writeMpd, readMpd } from '../io/mpdCodec';
import { downloadText, openFilePicker } from '../io/fileIo';
import { captureThumb } from '../io/captureThumb';
import { toast } from './toast';
import { SavesDialog } from './SavesDialog';
import { AboutDialog } from './AboutDialog';

const UNTITLED = 'Sem título';

export function TopToolbar() {
  const scene = useSceneStore((s) => s.scene);
  const loadScene = useSceneStore((s) => s.loadScene);
  const resetScene = useSceneStore((s) => s.resetScene);
  const isDirty = useSceneStore((s) => s.isDirty);
  const markClean = useSceneStore((s) => s.markClean);
  const mode = useModeStore((s) => s.mode);
  const setMode = useModeStore((s) => s.setMode);
  const autoSave = useSettingsStore((s) => s.autoSave);
  const setAutoSave = useSettingsStore((s) => s.setAutoSave);
  const hasSteps = scene.steps.length > 0;
  const partCount = scene.parts.length;
  const [savesOpen, setSavesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const persistScene = async (name: string, opts?: { asNew?: boolean }) => {
    const id = opts?.asNew ? nanoid() : scene.id;
    const now = Date.now();
    const createdAt = opts?.asNew ? now : scene.createdAt;
    const toSave = {
      ...scene,
      id,
      name,
      createdAt,
      updatedAt: now,
      thumbnail: captureThumb() ?? scene.thumbnail ?? null,
    };
    await sceneRepo.save(toSave);
    loadScene(toSave);
    markClean();
  };

  const handleSave = async () => {
    let name = scene.name;
    if (!name || name === UNTITLED) {
      const entered = window.prompt('Nomeie sua criação:', 'Minha construção');
      if (!entered) return;
      name = entered;
    }
    try {
      await persistScene(name);
      toast(`Salvo como "${name}"`, 'success');
    } catch (err) {
      toast(
        err instanceof Error ? `Falha ao salvar: ${err.message}` : 'Falha ao salvar',
        'error'
      );
    }
  };

  const handleSaveAs = async () => {
    if (partCount === 0) {
      toast('Nada para salvar — coloque algumas peças primeiro.', 'info');
      return;
    }
    const suggested =
      scene.name && scene.name !== UNTITLED ? `${scene.name} (cópia)` : 'Minha construção';
    const entered = window.prompt('Salvar como nova cópia com o nome:', suggested);
    if (!entered) return;
    try {
      await persistScene(entered, { asNew: true });
      toast(`Cópia "${entered}" criada`, 'success');
    } catch (err) {
      toast(
        err instanceof Error ? `Falha ao duplicar: ${err.message}` : 'Falha ao duplicar',
        'error'
      );
    }
  };

  const handleExport = async () => {
    const text = writeMpd(scene);
    const safeName = scene.name.replace(/[^\w\-. ]/g, '_') || 'sem-titulo';
    try {
      const result = await downloadText(text, `${safeName}.mpd`);
      if (result === 'cancelled') return;
      toast('Arquivo .mpd exportado', 'success');
    } catch (err) {
      toast(
        err instanceof Error ? `Falha na exportação: ${err.message}` : 'Falha na exportação',
        'error'
      );
    }
  };

  const loadFromText = (fileName: string, text: string) => {
    try {
      const { scene: imported, warnings } = readMpd(text, fileName);
      loadScene(imported);
      if (warnings.length > 0) {
        toast(
          `Importado com ${warnings.length} aviso${warnings.length === 1 ? '' : 's'}. Veja o console.`,
          'warning'
        );
        warnings.forEach((w) => console.warn(`[importação ${w.code}]`, w.message));
      } else {
        toast(`Importadas ${imported.parts.length} peças de ${fileName}`, 'success');
      }
    } catch (err) {
      toast(
        err instanceof Error ? `Falha na importação: ${err.message}` : 'Falha na importação',
        'error'
      );
    }
  };

  const handleLoadSample = async () => {
    if (isDirty && !window.confirm('Descartar alterações não salvas antes de carregar o exemplo?'))
      return;
    try {
      const res = await fetch('/samples/little-house-steps.mpd');
      if (!res.ok) throw new Error(`Fetch ${res.status}`);
      const text = await res.text();
      loadFromText('little-house-steps.mpd', text);
    } catch (err) {
      toast(
        err instanceof Error
          ? `Falha ao carregar o exemplo: ${err.message}`
          : 'Falha ao carregar o exemplo',
        'error'
      );
    }
  };

  const handleImport = async () => {
    if (isDirty && !window.confirm('Descartar alterações não salvas antes de importar?')) return;
    const file = await openFilePicker();
    if (!file) return;
    loadFromText(file.name, file.text);
  };

  const handleClear = () => {
    if (!isDirty || window.confirm('Descartar todas as peças e começar de novo?')) {
      resetScene();
    }
  };

  const handleToggleAutoSave = () => {
    const next = !autoSave;
    setAutoSave(next);
    if (next && (!scene.name || scene.name === UNTITLED)) {
      toast('Auto-save ligado — salve a cena com um nome para ativá-lo.', 'info');
    } else if (next) {
      toast('Auto-save ligado (a cada 30s).', 'success');
    } else {
      toast('Auto-save desligado.', 'info');
    }
  };

  return (
    <>
      <header className="top-bar">
        <h1>LegoB</h1>
        <div className="mode-toggle" role="tablist" aria-label="Modo">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sandbox'}
            className={mode === 'sandbox' ? 'active' : ''}
            onClick={() => setMode('sandbox')}
          >
            Livre
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'instructions'}
            className={mode === 'instructions' ? 'active' : ''}
            onClick={() => setMode('instructions')}
            disabled={!hasSteps}
            title={
              !hasSteps
                ? 'Importe um .mpd com passos para habilitar o modo Instruções'
                : undefined
            }
          >
            Instruções
          </button>
        </div>
        <div className="top-bar-spacer" />
        <span className="stat-chip" aria-label={`${partCount} peças na cena`}>
          {partCount} {partCount === 1 ? 'peça' : 'peças'}
        </span>
        {isDirty && <span className="stat-chip dirty">● não salvo</span>}
        <button
          type="button"
          onClick={handleToggleAutoSave}
          aria-pressed={autoSave}
          aria-label={autoSave ? 'Desativar auto-save' : 'Ativar auto-save'}
          className={`auto-chip ${autoSave ? 'active' : ''}`}
          title={
            autoSave
              ? 'Auto-save ligado: salva a cada 30s quando houver alterações'
              : 'Auto-save desligado'
          }
        >
          ⚡ Auto-save {autoSave ? 'on' : 'off'}
        </button>
        <button type="button" onClick={handleSave} aria-label="Salvar cena">
          Salvar
        </button>
        <button type="button" onClick={handleSaveAs} aria-label="Salvar como nova cópia">
          Salvar como…
        </button>
        <button type="button" onClick={() => setSavesOpen(true)} aria-label="Abrir meus salvos">
          Meus salvos
        </button>
        <button type="button" onClick={handleImport} aria-label="Importar arquivo .mpd">
          Abrir
        </button>
        <button type="button" onClick={handleLoadSample} aria-label="Carregar exemplo incluído">
          Exemplo
        </button>
        <button type="button" onClick={handleExport} aria-label="Exportar como .mpd">
          Exportar
        </button>
        <button type="button" onClick={handleClear} aria-label="Limpar cena">
          Limpar
        </button>
        <button type="button" onClick={() => setAboutOpen(true)} aria-label="Sobre">
          Sobre
        </button>
      </header>

      <SavesDialog open={savesOpen} onClose={() => setSavesOpen(false)} />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
