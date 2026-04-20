import { useSceneStore } from '../state/useSceneStore';
import { COLORS } from '../data/colors';
import { getPalette } from '../data/palette';

export function PropertiesPanel() {
  const selectedPart = useSceneStore((s) => {
    const id = s.selectedPartId;
    return id ? s.scene.parts.find((p) => p.id === id) ?? null : null;
  });
  const updatePart = useSceneStore((s) => s.updatePart);
  const removePart = useSceneStore((s) => s.removePart);

  if (!selectedPart) return null;
  const entry = getPalette(selectedPart.partNumber);

  const rotate = (direction: 1 | -1) => {
    const next = (((selectedPart.rotationY + direction * 90) % 360) + 360) % 360 as
      | 0
      | 90
      | 180
      | 270;
    updatePart(selectedPart.id, { rotationY: next });
  };

  return (
    <aside className="properties-panel" aria-label="Propriedades da peça selecionada">
      <header>
        <h2>{entry.displayName}</h2>
        <span className="part-number">#{selectedPart.partNumber}</span>
      </header>

      <dl className="prop-list">
        <div>
          <dt>Posição</dt>
          <dd>
            x:{selectedPart.position[0]} · y:{selectedPart.position[1]} · z:{selectedPart.position[2]}
          </dd>
        </div>
        <div>
          <dt>Rotação</dt>
          <dd>{selectedPart.rotationY}°</dd>
        </div>
      </dl>

      <div className="prop-actions">
        <button type="button" onClick={() => rotate(-1)} aria-label="Girar no sentido anti-horário">
          ⟲ -90°
        </button>
        <button type="button" onClick={() => rotate(1)} aria-label="Girar no sentido horário">
          ⟳ +90°
        </button>
        <button
          type="button"
          className="destructive"
          onClick={() => removePart(selectedPart.id)}
          aria-label="Excluir peça"
        >
          Excluir
        </button>
      </div>

      <div className="prop-colors">
        <h3>Cor</h3>
        <div className="palette-color-grid" role="listbox" aria-label="Alterar cor">
          {COLORS.slice(0, 20).map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={selectedPart.colorCode === c.code}
              className={`palette-color ${selectedPart.colorCode === c.code ? 'active' : ''}`}
              style={{ backgroundColor: c.rgb, opacity: c.material === 'transparent' ? 0.6 : 1 }}
              onClick={() => updatePart(selectedPart.id, { colorCode: c.code })}
              aria-label={`${c.name}, código ${c.code}`}
              title={`${c.name} (${c.code})`}
            />
          ))}
        </div>
      </div>

      <p className="keyboard-hint">
        <kbd>R</kbd> girar · <kbd>Shift</kbd>+<kbd>R</kbd> girar inverso · <kbd>Del</kbd> excluir
      </p>
    </aside>
  );
}
