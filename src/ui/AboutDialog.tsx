interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AboutDialog({ open, onClose }: AboutDialogProps) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="About LegoB"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal about-modal">
        <header className="modal-header">
          <h2>About LegoB</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </header>

        <div className="modal-body">
          <p>
            <strong>LegoB</strong> is a browser-based 3D brick assembly game. Build freely in the
            sandbox, or step through an instruction set. Everything runs client-side — no account,
            no backend, your creations stay on this device.
          </p>

          <h3>Keyboard shortcuts</h3>
          <dl className="shortcut-list">
            <dt><kbd>Esc</kbd></dt>
            <dd>Deselect / clear active palette part</dd>
            <dt><kbd>R</kbd> / <kbd>Shift</kbd>+<kbd>R</kbd></dt>
            <dd>Rotate selected brick clockwise / counter-clockwise</dd>
            <dt><kbd>Del</kbd> / <kbd>Backspace</kbd></dt>
            <dd>Delete selected brick</dd>
            <dt><kbd>←</kbd> / <kbd>→</kbd></dt>
            <dd>Previous / next instruction step</dd>
            <dt><kbd>Space</kbd></dt>
            <dd>Play / pause instruction playback</dd>
            <dt><kbd>Home</kbd> / <kbd>End</kbd></dt>
            <dd>First / last instruction step</dd>
            <dt><kbd>G</kbd></dt>
            <dd>Toggle ghost preview in Instructions mode</dd>
          </dl>

          <h3>Attribution</h3>
          <p>
            Brick geometry and color codes follow the{' '}
            <a href="https://www.ldraw.org/" target="_blank" rel="noreferrer">
              LDraw.org
            </a>{' '}
            specification. The LDraw Parts Library is distributed under the{' '}
            <a
              href="https://www.ldraw.org/article/398.html"
              target="_blank"
              rel="noreferrer"
            >
              Creative Commons Attribution 2.0 license (CCAL 2.0)
            </a>
            .
          </p>

          <h3>Not affiliated with LEGO Group</h3>
          <p>
            LegoB is an <strong>unofficial fan project</strong>. It is NOT affiliated with, endorsed
            by, or sponsored by the LEGO Group. "LEGO" is a registered trademark of the LEGO Group.
            The codename "LegoB" is internal only and subject to change.
          </p>

          <h3>Privacy</h3>
          <p>
            No personal data is collected. No trackers. All saves live in your browser's IndexedDB
            and can be deleted from the "My Saves" dialog at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
