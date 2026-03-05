"use client";

import { useEffect, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Size table data ────────────────────────────────────────────────────────── */

const FARMERKE = {
  label: "Farmerke",
  head: ["Vel.", "Struk (cm)", "Bokovi (cm)", "Dužina (cm)"],
  rows: [
    ["S", "76–80", "90–94", "102"],
    ["M", "82–86", "96–100", "103"],
    ["L", "88–92", "102–106", "104"],
    ["XL", "94–100", "108–114", "105"],
  ],
};

const MAJICE = {
  label: "Majice i dukserice",
  head: ["Vel.", "Prsa (cm)", "Ramena (cm)", "Dužina (cm)"],
  rows: [
    ["S", "88–92", "43", "68"],
    ["M", "94–98", "45", "70"],
    ["L", "100–104", "47", "72"],
    ["XL", "106–112", "49", "74"],
  ],
};

const TRENERKE = {
  label: "Trenerke",
  head: ["Vel.", "Struk (cm)", "Bokovi (cm)", "Dužina (cm)"],
  rows: [
    ["S", "76–80", "92–96", "98"],
    ["M", "82–86", "98–102", "100"],
    ["L", "88–92", "104–108", "102"],
    ["XL", "94–100", "110–116", "104"],
  ],
};

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function SizeTable({ table }: { table: typeof FARMERKE }) {
  return (
    <div>
      <h3 className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.2em] mb-3">
        {table.label}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              {table.head.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="text-left text-[#F4F4F2]/40 font-medium tracking-wide pb-2 pr-4 border-b border-[#F4F4F2]/8 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map(([size, ...vals]) => (
              <tr key={size} className="border-b border-[#F4F4F2]/5 last:border-0">
                <td className="py-2.5 pr-4 font-bold text-[#B89F5B] tracking-wider">{size}</td>
                {vals.map((v, i) => (
                  <td key={i} className="py-2.5 pr-4 text-[#F4F4F2]/65 whitespace-nowrap">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────────────────── */

export default function SizeGuideModal({ isOpen, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* ESC to close */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Focus trap */
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    /* Move focus into modal */
    closeRef.current?.focus();

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onTab);
    return () => window.removeEventListener("keydown", onTab);
  }, [isOpen]);

  return (
    /* Backdrop */
    <div
      aria-hidden={!isOpen}
      onClick={onClose}
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen
          ? "bg-black/60 backdrop-blur-sm pointer-events-auto"
          : "bg-black/0 backdrop-blur-none pointer-events-none"
      }`}
    >
      {/* ── Mobile: bottom sheet ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Vodič za veličine"
        onClick={(e) => e.stopPropagation()}
        className={`md:hidden absolute inset-x-0 bottom-0 bg-[#1A1A1A] rounded-t-2xl max-h-[90dvh] flex flex-col transition-transform duration-400 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0" aria-hidden="true">
          <div className="w-10 h-1 bg-[#F4F4F2]/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F4F4F2]/8 shrink-0">
          <h2 className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
            Vodič za veličine
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Zatvori vodič za veličine"
            className="w-8 h-8 flex items-center justify-center text-[#F4F4F2]/50 hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-6 flex flex-col gap-8">
          <SizeTable table={FARMERKE} />
          <SizeTable table={MAJICE} />
          <SizeTable table={TRENERKE} />

          {/* Tip */}
          <div className="border-l-2 border-[#B89F5B] pl-4 py-1">
            <p className="text-[#F4F4F2]/55 text-xs leading-relaxed tracking-wide">
              <span className="text-[#B89F5B] font-semibold">Savjet:</span>{" "}
              Izmjerite struk i prsa centimetarskom trakom i odaberite veličinu prema tablici.
              Ako ste između dvije veličine, preporučujemo veću.
            </p>
          </div>
        </div>
      </div>

      {/* ── Desktop: centered modal ── */}
      <div
        className={`hidden md:flex absolute inset-0 items-center justify-center p-6 transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vodič za veličine"
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#1A1A1A] w-full max-w-[700px] max-h-[85vh] flex flex-col transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#F4F4F2]/8 shrink-0">
            <h2 className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
              Vodič za veličine
            </h2>
            <button
              onClick={onClose}
              aria-label="Zatvori vodič za veličine"
              className="w-8 h-8 flex items-center justify-center text-[#F4F4F2]/50 hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-8 py-7 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8">
              <SizeTable table={FARMERKE} />
              <SizeTable table={MAJICE} />
              <SizeTable table={TRENERKE} />
            </div>

            {/* Tip */}
            <div className="border-l-2 border-[#B89F5B] pl-4 py-1">
              <p className="text-[#F4F4F2]/55 text-xs leading-relaxed tracking-wide">
                <span className="text-[#B89F5B] font-semibold">Savjet:</span>{" "}
                Izmjerite struk i prsa centimetarskom trakom i odaberite veličinu prema tablici.
                Ako ste između dvije veličine, preporučujemo veću.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
