"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function DostavaPage() {
  const s1 = useFadeIn();
  const s2 = useFadeIn();
  const s3 = useFadeIn();

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <main className="pt-24 md:pt-32 pb-20">
        <div className="mx-auto max-w-2xl px-5 md:px-8">

          {/* Header */}
          <div className="mb-12 md:mb-16">
            <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">
              — Informacije
            </p>
            <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight mb-3">
              Dostava i plaćanje
            </h1>
            <p className="text-[#F4F4F2]/50 text-sm md:text-base font-light tracking-wide leading-relaxed">
              Sve informacije o isporuci i načinima plaćanja.
            </p>
          </div>

          {/* Section 1: Dostava */}
          <section
            ref={s1.ref as React.RefObject<HTMLElement>}
            aria-labelledby="dostava-heading"
            className={`mb-6 bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 transition-all duration-700 ease-out ${
              s1.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#B89F5B]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </span>
              <h2 id="dostava-heading" className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
                Dostava
              </h2>
            </div>

            <ul className="flex flex-col gap-4">
              {[
                "Narudžbe dostavljamo širom Bosne i Hercegovine.",
                "Dostava se vrši putem kurirske službe u roku od 1–3 radna dana.",
                "Trošak dostave iznosi 9 KM.",
                "Za narudžbe iznad 150 KM dostava je besplatna.",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 shrink-0 block w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
                  <p className="text-[#F4F4F2]/65 text-sm font-light leading-relaxed tracking-wide">{text}</p>
                </li>
              ))}
            </ul>

            {/* Free shipping highlight */}
            <div className="mt-6 flex items-center gap-3 bg-[#B89F5B]/8 border border-[#B89F5B]/20 px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B89F5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="text-[#B89F5B] text-xs tracking-wide font-medium">
                Besplatna dostava za narudžbe iznad 150 KM
              </span>
            </div>
          </section>

          {/* Section 2: Plaćanje */}
          <section
            ref={s2.ref as React.RefObject<HTMLElement>}
            aria-labelledby="placanje-heading"
            className={`mb-6 bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 transition-all duration-700 ease-out ${
              s2.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#B89F5B]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </span>
              <h2 id="placanje-heading" className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
                Načini plaćanja
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  title: "Pouzećem",
                  desc: "Plaćanje prilikom preuzimanja pošiljke.",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M22 10H2"/>
                      <path d="M7 15h2m4 0h2"/>
                    </svg>
                  ),
                },
                {
                  title: "Karticom",
                  desc: "Sigurno online plaćanje debitnim ili kreditnim karticama.",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  ),
                },
                {
                  title: "Bankovni transfer",
                  desc: "Mogućnost plaćanja putem bankovne uplate.",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  ),
                },
              ].map((method) => (
                <div key={method.title} className="flex items-start gap-4 p-4 border border-[#F4F4F2]/6 bg-[#0E0E0E]/50">
                  <span className="shrink-0 text-[#B89F5B] mt-0.5">{method.icon}</span>
                  <div>
                    <p className="text-[#F4F4F2] text-sm font-semibold tracking-wide mb-1">{method.title}</p>
                    <p className="text-[#F4F4F2]/50 text-xs font-light tracking-wide leading-relaxed">{method.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Dodatne informacije */}
          <section
            ref={s3.ref as React.RefObject<HTMLElement>}
            aria-labelledby="info-heading"
            className={`bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 transition-all duration-700 ease-out ${
              s3.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[#B89F5B]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </span>
              <h2 id="info-heading" className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
                Dodatne informacije
              </h2>
            </div>

            <p className="text-[#F4F4F2]/60 text-sm font-light leading-relaxed tracking-wide mb-6">
              Ako imate dodatna pitanja o dostavi ili plaćanju, slobodno nas kontaktirajte.
            </p>

            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2.5 bg-[#F4F4F2] text-[#0E0E0E] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
            >
              Kontaktirajte nas
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
