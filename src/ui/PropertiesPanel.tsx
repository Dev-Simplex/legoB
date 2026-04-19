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
    <aside className="properties-panel" aria-label="Selected brick properties">
      <header>
        <h2>{entry.displayName}</h2>
        <span className="part-number">#{selectedPart.partNumber}</span>
      </header>

      <dl className="prop-list">
        <div>
          <dt>Position</dt>
          <dd>
            x:{selectedPart.position[0]} · y:{selectedPart.position[1]} · z:{selectedPart.position[2]}
          </dd>
        </div>
        <div>
          <dt>Rotation</dt>
          <dd>{selectedPart.rotationY}°</dd>
        </div>
      </dl>

      <div className="prop-actions">
        <button type="button" onClick={() => rotate(-1)} aria-label="Rotate counter-clockwise">
          ⟲ -90°
        </button>
        <button type="button" onClick={() => rotate(1)} aria-label="Rotate clockwise">
          ⟳ +90°
        </button>
        <button
          type="button"
          className="destructive"
          onClick={() => removePart(selectedPart.id)}
          aria-label="Delete brick"
        >
          Delete
        </button>
      </div>

      <div className="prop-colors">
        <h3>Color</h3>
        <div className="palette-color-grid" role="listbox" aria-label="Change color">
          {COLORS.slice(0, 20).map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={selectedPart.colorCode === c.code}
              className={`palette-color ${selectedPart.colorCode === c.code ? 'active' : ''}`}
              style={{ backgroundColor: c.rgb, opacity: c.material === 'transparent' ? 0.6 : 1 }}
              onClick={() => updatePart(selectedPart.id, { colorCode: c.code })}
              aria-label={`${c.name}, code ${c.code}`}
              title={`${c.name} (${c.code})`}
            />
          ))}
        </div>
      </div>

      <p className="keyboard-hint">
        <kbd>R</kbd> rotate · <kbd>Shift</kbd>+<kbd>R</kbd> rotate back · <kbd>Del</kbd> delete
      </p>
    </aside>
  );
}
