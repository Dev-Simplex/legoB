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
import { PromptDialog } from './PromptDialog';

const UNTITLED = 'Sem título';

type PromptPurpose = 'save' | 'save-as';

interface PromptConfig {
  purpose: PromptPurpose;
  title: string;
  description: string;
  defaultValue: string;
  placeholder: string;
  confirmLabel: string;
}

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
  const lastAutoSaveAt = useSettingsStore((s) => s.lastAutoSaveAt);
  const hasSteps = scene.steps.length > 0;
  const partCount = scene.parts.length;
  const [savesOpen, setSavesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [prompt, setPrompt] = useState<PromptConfig | null>(null);

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

  const handleSave = () => {
    if (partCount === 0) {
      toast('Nada para salvar — coloque algumas peças primeiro.', 'info');
      return;
    }
    if (scene.name && scene.name !== UNTITLED) {
      // Já tem nome: salva direto.
      void (async () => {
        try {
          await persistScene(scene.name);
          toast(`Salvo como "${scene.name}"`, 'success');
        } catch (err) {
          console.error('[LegoB] save failed', err);
          toast(
            err instanceof Error ? `Falha ao salvar: ${err.message}` : 'Falha ao salvar',
            'error'
          );
        }
      })();
      return;
    }
    setPrompt({
      purpose: 'save',
      title: 'Salvar construção',
      description: 'Dê um nome para esta criação — você poderá renomear depois.',
      defaultValue: 'Minha construção',
      placeholder: 'Ex.: Castelo medieval',
      confirmLabel: 'Salvar',
    });
  };

  const handleSaveAs = () => {
    if (partCount === 0) {
      toast('Nada para salvar — coloque algumas peças primeiro.', 'info');
      return;
    }
    const suggested =
      scene.name && scene.name !== UNTITLED ? `${scene.name} (cópia)` : 'Minha construção';
    setPrompt({
      purpose: 'save-as',
      title: 'Salvar como nova cópia',
      description:
        'Uma nova cópia independente será criada. O salvo atual permanece intocado.',
      defaultValue: suggested,
      placeholder: 'Ex.: Castelo v2',
      confirmLabel: 'Duplicar',
    });
  };

  const handlePromptConfirm = async (name: string) => {
    const current = prompt;
    setPrompt(null);
    if (!current) return;
    try {
      if (current.purpose === 'save') {
        await persistScene(name);
        toast(`Salvo como "${name}"`, 'success');
      } else if (current.purpose === 'save-as') {
        await persistScene(name, { asNew: true });
        toast(`Cópia "${name}" criada`, 'success');
      }
    } catch (err) {
      console.error('[LegoB] persist failed', err);
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
      console.error('[LegoB] export failed', err);
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
      console.error('[LegoB] import failed', err);
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
      console.error('[LegoB] sample load failed', err);
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
    if (next) {
      toast('Auto-save ligado — salva a cada 10s quando há alterações.', 'success');
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
              ? lastAutoSaveAt > 0
                ? `Auto-save ligado (10s). Último: ${new Date(lastAutoSaveAt).toLocaleTimeString('pt-BR')}`
                : 'Auto-save ligado: salva a cada 10s quando houver alterações'
              : 'Auto-save desligado'
          }
        >
          ⚡ {autoSave ? 'Auto on' : 'Auto off'}
        </button>
        <button
          type="button"
          onClick={handleSave}
          aria-label="Salvar cena"
          className="toolbar-btn toolbar-btn-primary"
        >
          💾 Salvar
        </button>
        <button
          type="button"
          onClick={handleSaveAs}
          aria-label="Salvar como nova cópia"
          className="toolbar-btn"
        >
          Salvar como…
        </button>
        <button
          type="button"
          onClick={() => setSavesOpen(true)}
          aria-label="Abrir meus salvos"
          className="toolbar-btn"
        >
          Meus salvos
        </button>
        <button
          type="button"
          onClick={handleImport}
          aria-label="Importar arquivo .mpd"
          className="toolbar-btn"
        >
          Abrir
        </button>
        <button
          type="button"
          onClick={handleLoadSample}
          aria-label="Carregar exemplo incluído"
          className="toolbar-btn"
        >
          Exemplo
        </button>
        <button
          type="button"
          onClick={handleExport}
          aria-label="Exportar como .mpd"
          className="toolbar-btn"
        >
          Exportar
        </button>
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpar cena"
          className="toolbar-btn"
        >
          Limpar
        </button>
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          aria-label="Sobre"
          className="toolbar-btn"
        >
          Sobre
        </button>
      </header>

      <SavesDialog open={savesOpen} onClose={() => setSavesOpen(false)} />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <PromptDialog
        open={prompt !== null}
        title={prompt?.title ?? ''}
        description={prompt?.description ?? ''}
        defaultValue={prompt?.defaultValue ?? ''}
        placeholder={prompt?.placeholder ?? ''}
        confirmLabel={prompt?.confirmLabel ?? 'Confirmar'}
        onConfirm={handlePromptConfirm}
        onCancel={() => setPrompt(null)}
      />
    </>
  );
}
