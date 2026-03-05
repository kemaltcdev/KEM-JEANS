"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenGallery({ images, initialIndex, isOpen, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const stripRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useRef(false);

  /* Sync initial index when opened */
  useEffect(() => {
    if (isOpen) setActiveIndex(initialIndex);
  }, [isOpen, initialIndex]);

  /* Scroll strip to active slide (no animation on initial open) */
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollTo({
      left: el.clientWidth * activeIndex,
      behavior: prefersReduced.current ? "auto" : "smooth",
    });
  }, [activeIndex]);

  /* Detect prefers-reduced-motion once */
  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      /* Instant jump on open — no animation */
      const el = stripRef.current;
      if (el) el.scrollTo({ left: el.clientWidth * activeIndex, behavior: "auto" });
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ESC to close */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex]);

  /* Focus trap */
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
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

  /* Track scroll to update active dot */
  const onScroll = () => {
    const el = stripRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(idx);
  };

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(images.length - 1, i + 1));

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[60] transition-all duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } ${prefersReduced.current ? "!transition-none" : ""}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0E0E0E]" />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Galerija slika"
        className={`relative w-full h-full flex flex-col transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-[0.97]"
        } ${prefersReduced.current ? "!transition-none" : ""}`}
      >
        {/* ── Top bar ── */}
        <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-4 md:px-6 md:py-5">
          {/* Counter */}
          <span className="text-[#F4F4F2]/60 text-xs tracking-[0.2em] font-medium tabular-nums select-none">
            {activeIndex + 1} / {images.length}
          </span>

          {/* Close */}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Zatvori"
            className="w-10 h-10 flex items-center justify-center text-[#F4F4F2]/70 hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] rounded-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M15 1L1 15M1 1l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>

        {/* ── Main: swipe strip ── */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={stripRef}
            onScroll={onScroll}
            className="flex h-full overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
            aria-label="Slike proizvoda"
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-full h-full flex items-center justify-center px-0 md:px-16"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Slika ${i + 1} od ${images.length}`}
                  className="w-full h-full object-contain md:object-contain"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* ── Desktop arrows ── */}
          {activeIndex > 0 && (
            <button
              onClick={prev}
              aria-label="Prethodna slika"
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-[#F4F4F2]/50 hover:text-[#F4F4F2] border border-[#F4F4F2]/10 hover:border-[#F4F4F2]/30 bg-[#0E0E0E]/60 backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3L5 8l5 5" />
              </svg>
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button
              onClick={next}
              aria-label="Sljedeća slika"
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-[#F4F4F2]/50 hover:text-[#F4F4F2] border border-[#F4F4F2]/10 hover:border-[#F4F4F2]/30 bg-[#0E0E0E]/60 backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Dots ── */}
        {images.length > 1 && (
          <div className="shrink-0 flex justify-center gap-2 py-5" aria-hidden="true">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Slika ${i + 1}`}
                className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
                  i === activeIndex
                    ? "w-5 h-1.5 bg-[#F4F4F2]"
                    : "w-1.5 h-1.5 bg-[#F4F4F2]/25 hover:bg-[#F4F4F2]/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
