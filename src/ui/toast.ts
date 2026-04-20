import { create } from 'zustand';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  durationMs: number;
}

interface ToastState {
  toasts: ToastItem[];
  show: (opts: Partial<ToastItem> & { message: string; variant?: ToastVariant }) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (opts) => {
    const id = Math.random().toString(36).slice(2);
    const toastItem: ToastItem = {
      id,
      variant: opts.variant ?? 'info',
      message: opts.message,
      durationMs: opts.durationMs ?? 4000,
    };
    set((s) => ({ toasts: [...s.toasts, toastItem] }));
    if (toastItem.durationMs > 0) {
      setTimeout(() => get().dismiss(id), toastItem.durationMs);
    }
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, variant: ToastVariant = 'info') {
  useToastStore.getState().show({ message, variant });
}
