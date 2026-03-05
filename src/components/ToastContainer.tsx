"use client";

import { useEffect, useRef, useState } from "react";
import { useToastStore, type Toast, type ToastType } from "@/store/toastStore";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* SSR-safe subscription */
  useEffect(() => {
    setToasts(useToastStore.getState().toasts);
    return useToastStore.subscribe((state) => setToasts(state.toasts));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col-reverse gap-2.5 items-center pointer-events-none w-full px-4"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

/* ─── Single Toast ───────────────────────────────────────────────────────────── */

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  /* Animate in */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    timerRef.current = setTimeout(() => removeToast(toast.id), 300);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div
      role="status"
      onClick={handleDismiss}
      className={`pointer-events-auto flex items-center gap-3 min-w-[220px] max-w-[360px] px-4 py-3 bg-[#1A1A1A] border border-[#F4F4F2]/10 shadow-xl cursor-pointer select-none
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
      <ToastIcon type={toast.type} />
      <p className="text-[#F4F4F2] text-xs tracking-wide leading-snug flex-1">
        {toast.message}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
        aria-label="Zatvori obavještenje"
        className="text-[#F4F4F2]/30 hover:text-[#F4F4F2]/70 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] rounded-sm"
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M11 1L1 11M1 1l10 10" />
        </svg>
      </button>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return (
      <div className="w-5 h-5 rounded-full bg-[#B89F5B]/15 flex items-center justify-center shrink-0">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#B89F5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="2 6 5 9 10 3" />
        </svg>
      </div>
    );
  }
  if (type === "error") {
    return (
      <div className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M11 1L1 11M1 1l10 10" />
        </svg>
      </div>
    );
  }
  /* info */
  return (
    <div className="w-5 h-5 rounded-full bg-[#F4F4F2]/10 flex items-center justify-center shrink-0">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#F4F4F2" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="6" cy="6" r="5" />
        <line x1="6" y1="4" x2="6" y2="4.01" strokeWidth="2.5" />
        <line x1="6" y1="6.5" x2="6" y2="9" />
      </svg>
    </div>
  );
}
