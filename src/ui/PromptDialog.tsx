import { useEffect, useRef, useState } from 'react';

export interface PromptDialogProps {
  open: boolean;
  title: string;
  description?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

/**
 * Diálogo modal de entrada de texto — substitui `window.prompt`, que pode
 * ser bloqueado pelo navegador (iframes, políticas de permissão, testes E2E)
 * e tem UX ruim (não tem foco na app, interrompe fluxo).
 */
export function PromptDialog({
  open,
  title,
  description,
  defaultValue = '',
  placeholder,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      // Foca no input ao abrir e seleciona o conteúdo para fácil edição.
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [open, defaultValue]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="modal prompt-modal">
        <header className="modal-header">
          <h2>{title}</h2>
          <button type="button" onClick={onCancel} aria-label="Fechar diálogo">
            ×
          </button>
        </header>

        <form className="modal-body" onSubmit={handleSubmit}>
          {description && <p className="muted prompt-description">{description}</p>}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="prompt-input"
            aria-label={title}
          />
          <div className="prompt-actions">
            <button type="button" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button type="submit" className="primary" disabled={!value.trim()}>
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
