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
          No <code>0 STEP</code> markers found in this scene. Import a stepped .mpd to use instruction
          playback.
        </span>
      </footer>
    );
  }

  const stepPartIds = new Set(steps[currentStep]?.partIds ?? []);
  const thisStepParts = parts.filter((p) => stepPartIds.has(p.id));
  const usedSoFar = parts.filter((p) => p.stepIndex !== null && p.stepIndex <= currentStep).length;

  return (
    <div className="instructions-layout">
      <aside className="step-sidebar" aria-label="Parts for this step">
        <header>
          <h2>Step {currentStep + 1} of {steps.length}</h2>
          <p className="muted">
            {usedSoFar} / {parts.length} parts used
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
            <li className="muted">No parts in this step.</li>
          )}
        </ul>

        <div className="step-toggles">
          <label>
            <input
              type="checkbox"
              checked={ghost}
              onChange={toggleGhost}
              aria-label="Ghost preview of next step"
            />
            Ghost preview (G)
          </label>
        </div>
      </aside>

      <footer className="transport-bar">
        <div className="transport-controls">
          <button type="button" onClick={() => jumpTo(0)} aria-label="Go to first step">
            ⏮
          </button>
          <button type="button" onClick={prev} aria-label="Previous step" disabled={currentStep === 0}>
            ◀
          </button>
          <button
            type="button"
            onClick={() => (playing ? pause() : play())}
            aria-label={playing ? 'Pause playback' : 'Play playback'}
            className="primary"
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button
            type="button"
            onClick={() => next(maxStep)}
            aria-label="Next step"
            disabled={currentStep >= maxStep}
          >
            ▶
          </button>
          <button type="button" onClick={() => jumpTo(maxStep)} aria-label="Go to last step">
            ⏭
          </button>
          <button type="button" onClick={reset} aria-label="Reset to first step">
            ↻
          </button>
        </div>

        <div className="transport-scrubber">
          <span className="transport-label">Step {currentStep + 1} / {steps.length}</span>
          <input
            type="range"
            min={0}
            max={maxStep}
            value={currentStep}
            onChange={(e) => jumpTo(Number(e.target.value))}
            aria-label="Step scrubber"
          />
        </div>
      </footer>
    </div>
  );
}
