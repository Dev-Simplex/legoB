import { useSceneStore } from '../state/useSceneStore';
import { getPalette } from '../data/palette';
import { getColor } from '../data/colors';

/**
 * Indicador flutuante no canto inferior do canvas mostrando a peça
 * selecionada + atalhos. Substitui o painel lateral direito por uma
 * barra fina que ocupa menos espaço e não invade o canvas.
 */
export function SelectionIndicator() {
  const selectedPart = useSceneStore((s) => {
    const id = s.selectedPartId;
    return id ? s.scene.parts.find((p) => p.id === id) ?? null : null;
  });
  const updatePart = useSceneStore((s) => s.updatePart);
  const removePart = useSceneStore((s) => s.removePart);

  if (!selectedPart) return null;

  const entry = getPalette(selectedPart.partNumber);
  const color = getColor(selectedPart.colorCode);

  const rotate = (direction: 1 | -1) => {
    const next = (((selectedPart.rotationY + direction * 90) % 360) + 360) % 360 as
      | 0
      | 90
      | 180
      | 270;
    updatePart(selectedPart.id, { rotationY: next });
  };

  return (
    <div className="selection-indicator" role="status" aria-live="polite">
      <span
        className="selection-swatch"
        style={{ background: color.rgb, opacity: color.material === 'transparent' ? 0.7 : 1 }}
        aria-hidden
      />
      <div className="selection-info">
        <strong>{entry.displayName}</strong>
        <span className="selection-meta">
          #{selectedPart.partNumber} · {color.name} · {selectedPart.rotationY}°
        </span>
      </div>
      <div className="selection-actions">
        <button
          type="button"
          onClick={() => rotate(-1)}
          aria-label="Girar no sentido anti-horário (Shift+R)"
          title="Girar CCW · Shift+R"
        >
          ⟲
        </button>
        <button
          type="button"
          onClick={() => rotate(1)}
          aria-label="Girar no sentido horário (R)"
          title="Girar CW · R"
        >
          ⟳
        </button>
        <button
          type="button"
          onClick={() => removePart(selectedPart.id)}
          aria-label="Excluir peça (Del)"
          title="Excluir · Del"
          className="destructive"
        >
          ✕
        </button>
      </div>
      <span className="selection-hint">
        <kbd>R</kbd> girar · <kbd>Del</kbd> excluir · clique no vazio para desselecionar
      </span>
    </div>
  );
}
