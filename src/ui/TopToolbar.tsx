import { useState } from 'react';
import { useSceneStore } from '../state/useSceneStore';
import { useModeStore } from '../state/useModeStore';
import { sceneRepo } from '../io/sceneRepo';
import { writeMpd, readMpd } from '../io/mpdCodec';
import { downloadText, openFilePicker } from '../io/fileIo';
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
  const hasSteps = scene.steps.length > 0;
  const partCount = scene.parts.length;
  const [savesOpen, setSavesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleSave = async () => {
    let name = scene.name;
    if (name === 'Untitled' || name === UNTITLED) {
      const entered = window.prompt('Nomeie sua criação:', 'Minha construção');
      if (!entered) return;
      name = entered;
    }
    try {
      await sceneRepo.save({ ...scene, name });
      loadScene({ ...scene, name });
      markClean();
      toast(`Salvo como "${name}"`, 'success');
    } catch (err) {
      toast(
        err instanceof Error ? `Falha ao salvar: ${err.message}` : 'Falha ao salvar',
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
        <button type="button" onClick={handleSave} aria-label="Salvar cena">
          Salvar
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
