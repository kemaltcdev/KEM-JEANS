"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center px-5 py-20 text-center">
      {/* Icon */}
      <div className="mb-8 flex items-center justify-center w-16 h-16 rounded-full border border-[#F4F4F2]/10 text-[#F4F4F2]/20">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Gold accent line */}
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#B89F5B] to-transparent mb-8" aria-hidden="true" />

      {/* Label */}
      <p className="text-[#B89F5B] text-[10px] tracking-[0.3em] uppercase font-medium mb-4">
        — Greška
      </p>

      <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight mb-4 max-w-sm">
        Nešto je pošlo<br />po zlu
      </h1>

      <p className="text-[#F4F4F2]/45 text-sm font-light tracking-wide leading-relaxed max-w-xs mb-10">
        Pokušajte ponovo ili se vratite na sigurnu stranicu.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="flex-1 py-4 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
        >
          Pokušaj ponovo
        </button>
        <Link
          href="/"
          className="flex-1 py-4 border border-[#F4F4F2]/20 text-[#F4F4F2]/70 text-xs font-medium uppercase tracking-[0.2em] text-center transition-all duration-300 hover:border-[#B89F5B] hover:text-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
        >
          Nazad na početnu
        </Link>
      </div>

      {/* Subtle footnote */}
      <p className="mt-8 text-[#F4F4F2]/25 text-[11px] tracking-wide">
        Problem se ponavlja?{" "}
        <Link
          href="/kontakt"
          className="text-[#F4F4F2]/40 underline underline-offset-4 decoration-[#F4F4F2]/20 hover:text-[#B89F5B] hover:decoration-[#B89F5B] transition-colors duration-200 focus-visible:outline-none focus-visible:text-[#B89F5B]"
        >
          Kontakt
        </Link>
        .
      </p>
    </main>
  );
}
