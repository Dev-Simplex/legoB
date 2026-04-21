import { useMemo } from 'react';
import { PALETTE } from '../data/palette';
import { COLORS } from '../data/colors';
import { usePaletteStore } from '../state/usePaletteStore';
import { useSceneStore } from '../state/useSceneStore';
import type { BrickCategory } from '../types/domain';

const CATEGORIES: Array<{ key: BrickCategory | 'all'; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: 'brick', label: 'Tijolos' },
  { key: 'plate', label: 'Placas' },
  { key: 'tile', label: 'Lisas' },
  { key: 'figure', label: 'Bonecos' },
];

function FigureThumb({ bodyColor, robot }: { bodyColor: string; robot: boolean }) {
  const headFill = robot ? bodyColor : '#F2CD37';
  return (
    <svg
      viewBox="0 0 44 54"
      width={28}
      height={36}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* pernas */}
      <rect x="12" y="34" width="8" height="16" rx="1" fill="#6C6E68" />
      <rect x="24" y="34" width="8" height="16" rx="1" fill="#6C6E68" />
      {/* torso */}
      <rect x="10" y="18" width="24" height="18" rx="2" fill={bodyColor} />
      {/* braços */}
      <rect x="4" y="19" width="6" height="14" rx="1" fill={bodyColor} />
      <rect x="34" y="19" width="6" height="14" rx="1" fill={bodyColor} />
      {/* pescoço */}
      <rect x="20" y="14" width="4" height="4" fill={headFill} />
      {/* cabeça */}
      {robot ? (
        <rect x="13" y="2" width="18" height="14" rx="2" fill={headFill} />
      ) : (
        <ellipse cx="22" cy="9" rx="9" ry="7" fill={headFill} />
      )}
      {/* olhos */}
      <circle cx="18" cy={robot ? 8 : 9} r="1.2" fill="#0f172a" />
      <circle cx="26" cy={robot ? 8 : 9} r="1.2" fill="#0f172a" />
      {/* antena robô */}
      {robot && <circle cx="22" cy="1" r="1.5" fill="#EF4444" />}
    </svg>
  );
}

export function Palette() {
  const activePartNumber = usePaletteStore((s) => s.activePartNumber);
  const activeColorCode = usePaletteStore((s) => s.activeColorCode);
  const searchQuery = usePaletteStore((s) => s.searchQuery);
  const category = usePaletteStore((s) => s.category);
  const setActivePart = usePaletteStore((s) => s.setActivePart);
  const setActiveColor = usePaletteStore((s) => s.setActiveColor);
  const setSearch = usePaletteStore((s) => s.setSearch);
  const setCategory = usePaletteStore((s) => s.setCategory);
  const selectedPart = useSceneStore((s) => {
    const id = s.selectedPartId;
    return id ? s.scene.parts.find((p) => p.id === id) ?? null : null;
  });
  const updatePart = useSceneStore((s) => s.updatePart);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PALETTE.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (q && !p.displayName.toLowerCase().includes(q) && !p.partNumber.includes(q)) return false;
      return true;
    });
  }, [searchQuery, category]);

  return (
    <aside className="palette" aria-label="Paleta de peças">
      <div className="palette-header">
        <h2>Peças</h2>
        <input
          type="search"
          placeholder="Buscar"
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar peças"
        />
      </div>

      <div className="palette-categories" role="tablist">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={category === c.key}
            className={category === c.key ? 'active' : ''}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="palette-grid" role="listbox" aria-label="Peças disponíveis">
        {filtered.map((p) => (
          <button
            key={p.partNumber}
            type="button"
            role="option"
            aria-selected={activePartNumber === p.partNumber}
            className={`palette-item ${activePartNumber === p.partNumber ? 'active' : ''}`}
            onClick={() => setActivePart(p.partNumber)}
            title={`${p.partNumber} — ${p.displayName}`}
          >
            <span className="palette-thumb" aria-hidden>
              {p.category === 'figure' ? (
                <FigureThumb
                  bodyColor={
                    COLORS.find((c) => c.code === p.defaultColorCode)?.rgb ?? '#1E3A8A'
                  }
                  robot={p.partNumber === 'FIG02'}
                />
              ) : (
                <span
                  className="palette-thumb-box"
                  style={{
                    width: `${12 + p.widthStuds * 6}px`,
                    height: `${Math.max(6, p.heightLdu / 3)}px`,
                    backgroundColor:
                      COLORS.find((c) => c.code === p.defaultColorCode)?.rgb ?? '#cbd5e1',
                  }}
                />
              )}
            </span>
            <span className="palette-label">{p.displayName}</span>
          </button>
        ))}
      </div>

      <div className="palette-colors">
        <h3>Cor</h3>
        <div className="palette-color-grid" role="listbox" aria-label="Cores LDraw">
          {COLORS.slice(0, 20).map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={activeColorCode === c.code}
              className={`palette-color ${activeColorCode === c.code ? 'active' : ''}`}
              style={{ backgroundColor: c.rgb, opacity: c.material === 'transparent' ? 0.6 : 1 }}
              onClick={() => {
                setActiveColor(c.code);
                if (selectedPart) {
                  updatePart(selectedPart.id, { colorCode: c.code });
                }
              }}
              title={`${c.name} (${c.code})`}
              aria-label={`${c.name}, código LDraw ${c.code}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
