import { useEffect } from 'react';
import { useSceneStore } from '../state/useSceneStore';
import { usePlaybackStore } from '../state/usePlaybackStore';
import { getPalette } from '../data/palette';
import { getColor } from '../data/colors';

export function TransportBar() {
  const steps = useSceneStore((s) => s.scene.steps);
  const parts = useSceneStore((s) => s.scene.parts);
  const currentStep = usePlaybackStore((s) => s.currentStep);
  const playing = usePlaybackStore((s) => s.playing);
  const ghost = usePlaybackStore((s) => s.ghost);
  const next = usePlaybackStore((s) => s.next);
  const prev = usePlaybackStore((s) => s.prev);
  const jumpTo = usePlaybackStore((s) => s.jumpTo);
  const play = usePlaybackStore((s) => s.play);
  const pause = usePlaybackStore((s) => s.pause);
  const toggleGhost = usePlaybackStore((s) => s.toggleGhost);
  const reset = usePlaybackStore((s) => s.reset);

  const maxStep = Math.max(0, steps.length - 1);

  useEffect(() => {
    if (!playing) return;
    if (currentStep >= maxStep) {
      pause();
      return;
    }
    const id = window.setTimeout(() => next(maxStep), 1200);
    return () => window.clearTimeout(id);
  }, [playing, currentStep, maxStep, next, pause]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next(maxStep);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prev();
      } else if (event.key === ' ') {
        event.preventDefault();
        if (playing) pause();
        else play();
      } else if (event.key === 'Home') {
        event.preventDefault();
        jumpTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        jumpTo(maxStep);
      } else if (event.key === 'g' || event.key === 'G') {
        toggleGhost();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, jumpTo, play, pause, toggleGhost, playing, maxStep]);

  if (steps.length === 0) {
    return (
      <footer className="transport-bar">
        <span className="transport-empty">
          Nenhum marcador <code>0 STEP</code> encontrado nesta cena. Importe um .mpd com passos
          para usar a reprodução por instruções.
        </span>
      </footer>
    );
  }

  const stepPartIds = new Set(steps[currentStep]?.partIds ?? []);
  const thisStepParts = parts.filter((p) => stepPartIds.has(p.id));
  const usedSoFar = parts.filter((p) => p.stepIndex !== null && p.stepIndex <= currentStep).length;

  return (
    <div className="instructions-layout">
      <aside className="step-sidebar" aria-label="Peças deste passo">
        <header>
          <h2>
            Passo {currentStep + 1} de {steps.length}
          </h2>
          <p className="muted">
            {usedSoFar} / {parts.length} peças usadas
          </p>
        </header>

        <ul className="step-part-list">
          {thisStepParts.map((p) => {
            const entry = getPalette(p.partNumber);
            const color = getColor(p.colorCode);
            return (
              <li key={p.id}>
                <span
                  className="part-swatch"
                  style={{
                    background: color.rgb,
                    opacity: color.material === 'transparent' ? 0.6 : 1,
                  }}
                />
                <span className="part-name">{entry.displayName}</span>
                <span className="part-color muted">{color.name}</span>
              </li>
            );
          })}
          {thisStepParts.length === 0 && (
            <li className="muted">Nenhuma peça neste passo.</li>
          )}
        </ul>

        <div className="step-toggles">
          <label>
            <input
              type="checkbox"
              checked={ghost}
              onChange={toggleGhost}
              aria-label="Prévia fantasma do próximo passo"
            />
            Prévia fantasma (G)
          </label>
        </div>
      </aside>

      <footer className="transport-bar">
        <div className="transport-controls">
          <button type="button" onClick={() => jumpTo(0)} aria-label="Ir para o primeiro passo">
            ⏮
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="Passo anterior"
            disabled={currentStep === 0}
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => (playing ? pause() : play())}
            aria-label={playing ? 'Pausar reprodução' : 'Reproduzir'}
            className="primary"
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button
            type="button"
            onClick={() => next(maxStep)}
            aria-label="Próximo passo"
            disabled={currentStep >= maxStep}
          >
            ▶
          </button>
          <button type="button" onClick={() => jumpTo(maxStep)} aria-label="Ir para o último passo">
            ⏭
          </button>
          <button type="button" onClick={reset} aria-label="Voltar ao primeiro passo">
            ↻
          </button>
        </div>

        <div className="transport-scrubber">
          <span className="transport-label">
            Passo {currentStep + 1} / {steps.length}
          </span>
          <input
            type="range"
            min={0}
            max={maxStep}
            value={currentStep}
            onChange={(e) => jumpTo(Number(e.target.value))}
            aria-label="Barra de passos"
          />
        </div>
      </footer>
    </div>
  );
}
