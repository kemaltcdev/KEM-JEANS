"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Fade-in hook ───────────────────────────────────────────────────────────── */

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── FAQ data ───────────────────────────────────────────────────────────────── */

const FAQ = [
  {
    q: "Koliko traje povrat novca?",
    a: "Nakon što primimo i pregledamo pošiljku, povrat novca vršimo u roku od 3–5 radnih dana na isti način plaćanja.",
  },
  {
    q: "Mogu li zamijeniti veličinu?",
    a: "Da, zamjena veličine je moguća u skladu s dostupnošću na zalihi. Kontaktirajte nas s brojem narudžbe i željenom veličinom.",
  },
  {
    q: "Šta ako je proizvod oštećen?",
    a: "Ako je proizvod stigao oštećen ili pogrešan, kontaktirajte nas odmah uz fotografiju — troškove povrata preuzimamo mi.",
  },
  {
    q: "Da li mogu vratiti artikle na sniženju?",
    a: "Artikli kupljeni po promotivnoj cijeni mogu se zamijeniti, ali ne i vratiti radi povrata novca, osim u slučaju greške s naše strane.",
  },
  {
    q: "Kako da vas kontaktiram?",
    a: "Možete nas kontaktirati putem stranice /kontakt ili direktno na email. Odgovaramo u roku od 24 sata radnim danima.",
  },
];

/* ─── Accordion item ─────────────────────────────────────────────────────────── */

function AccordionItem({ q, a, reduced }: { q: string; a: string; reduced: boolean }) {
  const [open, setOpen] = useState(false);
  const id = q.replace(/\s+/g, "-").toLowerCase().slice(0, 30);

  return (
    <div className="border-b border-[#F4F4F2]/8 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`faq-${id}`}
        className="flex items-center justify-between w-full py-4 text-left gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B89F5B]"
      >
        <span className="text-[#F4F4F2] text-sm font-medium tracking-wide leading-snug pr-2">{q}</span>
        <span
          className={`shrink-0 text-[#B89F5B] transition-transform duration-300 ${open ? "rotate-45" : ""} ${reduced ? "" : "transition-transform"}`}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 2v12M2 8h12"/>
          </svg>
        </span>
      </button>
      <div
        id={`faq-${id}`}
        role="region"
        aria-label={q}
        className={`overflow-hidden ${reduced ? "" : "transition-all duration-300 ease-out"} ${open ? "max-h-40 opacity-100 mb-4" : "max-h-0 opacity-0"}`}
      >
        <p className="text-[#F4F4F2]/50 text-sm font-light leading-relaxed tracking-wide">
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function PovratPage() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const s1 = useFadeIn();
  const s2 = useFadeIn();
  const s3 = useFadeIn();
  const s4 = useFadeIn();
  const s5 = useFadeIn();

  const fade = (visible: boolean, delay = 0) =>
    `transition-all duration-700 ease-out ${reduced ? "" : `delay-[${delay}ms]`} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`;

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <main className="pt-24 md:pt-32 pb-20">
        <div className="mx-auto max-w-2xl px-5 md:px-8">

          {/* Header */}
          <div className="mb-12 md:mb-16">
            <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">— Politika</p>
            <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight mb-3">
              Povrat i zamjena
            </h1>
            <p className="text-[#F4F4F2]/50 text-sm md:text-base font-light tracking-wide leading-relaxed">
              Jednostavno i jasno — bez komplikacija.
            </p>
          </div>

          {/* Section 1: Osnovna pravila */}
          <section
            ref={s1.ref as React.RefObject<HTMLElement>}
            aria-labelledby="pravila-heading"
            className={`mb-5 bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 ${fade(s1.visible)}`}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[#B89F5B]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </span>
              <h2 id="pravila-heading" className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
                Osnovna pravila
              </h2>
            </div>
            <ul className="flex flex-col gap-4" role="list">
              {[
                "Povrat je moguć u roku od 14 dana od preuzimanja pošiljke.",
                "Proizvod mora biti nenošen, neoštećen i sa originalnim etiketama.",
                "Ukoliko je proizvod nošen ili oštećen, povrat nije moguć.",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 shrink-0 block w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
                  <p className="text-[#F4F4F2]/60 text-sm font-light leading-relaxed tracking-wide">{text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 2: Koraci */}
          <section
            ref={s2.ref as React.RefObject<HTMLElement>}
            aria-labelledby="koraci-heading"
            className={`mb-5 bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 ${fade(s2.visible)}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#B89F5B]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </span>
              <h2 id="koraci-heading" className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
                Kako izvršiti povrat
              </h2>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
              {[
                { n: 1, text: "Kontaktirajte nas i navedite broj narudžbe." },
                { n: 2, text: "Spakujte proizvod u originalnu ambalažu." },
                { n: 3, text: "Pošaljite pošiljku kurirskom službom." },
                { n: 4, text: "Nakon pregleda, vršimo povrat novca ili zamjenu." },
              ].map(({ n, text }) => (
                <li key={n} className="flex items-start gap-4 p-4 border border-[#F4F4F2]/6 bg-[#0E0E0E]/50">
                  <span className="shrink-0 flex items-center justify-center w-8 h-8 border border-[#B89F5B]/40 text-[#B89F5B] text-xs font-bold">
                    {n}
                  </span>
                  <p className="text-[#F4F4F2]/60 text-sm font-light leading-relaxed tracking-wide pt-1.5">{text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Section 3: Troškovi */}
          <section
            ref={s3.ref as React.RefObject<HTMLElement>}
            aria-labelledby="troskovi-heading"
            className={`mb-5 bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 ${fade(s3.visible)}`}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[#B89F5B]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </span>
              <h2 id="troskovi-heading" className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
                Troškovi
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {[
                "Trošak povrata snosi kupac, osim u slučaju greške s naše strane.",
                "Zamjena veličine je moguća u skladu sa dostupnošću.",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 p-4 border border-[#F4F4F2]/6 bg-[#0E0E0E]/50">
                  <span className="mt-1.5 shrink-0 block w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
                  <p className="text-[#F4F4F2]/60 text-sm font-light leading-relaxed tracking-wide">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: FAQ */}
          <section
            ref={s4.ref as React.RefObject<HTMLElement>}
            aria-labelledby="faq-heading"
            className={`mb-5 bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 ${fade(s4.visible)}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#B89F5B]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </span>
              <h2 id="faq-heading" className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
                Česta pitanja
              </h2>
            </div>
            <div>
              {FAQ.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} reduced={reduced} />
              ))}
            </div>
          </section>

          {/* Section 5: CTA */}
          <section
            ref={s5.ref as React.RefObject<HTMLElement>}
            aria-labelledby="cta-heading"
            className={`bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 text-center ${fade(s5.visible)}`}
          >
            <span className="inline-block text-[#B89F5B] mb-4" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
            <h2 id="cta-heading" className="text-[#F4F4F2] text-lg font-bold uppercase tracking-widest mb-2">
              Trebate pomoć?
            </h2>
            <p className="text-[#F4F4F2]/50 text-sm font-light tracking-wide leading-relaxed mb-6">
              Pišite nam i odgovorit ćemo u najkraćem roku.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2.5 bg-[#F4F4F2] text-[#0E0E0E] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
            >
              Kontakt
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
