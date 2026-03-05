import { create } from "zustand";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

/* ─── Store ──────────────────────────────────────────────────────────────────── */

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  showToast: (type, message, duration = 2200) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/* ─── Helper ─────────────────────────────────────────────────────────────────── */

export const showToast = (type: ToastType, message: string, duration?: number) =>
  useToastStore.getState().showToast(type, message, duration);
