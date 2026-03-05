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
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const SECTIONS = [
  {
    id: "opce-odredbe",
    title: "Opće odredbe",
    content: (
      <p>
        Korištenjem web stranice <strong className="text-[#F4F4F2]/80 font-semibold">KEM JEANS</strong> prihvatate
        ove uslove korištenja u cijelosti. Molimo vas da ih pažljivo pročitate prije korištenja stranice ili
        obavljanja kupovine. Ukoliko se ne slažete s navedenim uslovima, molimo vas da ne koristite ovu stranicu.
      </p>
    ),
  },
  {
    id: "koristenje",
    title: "Korištenje web stranice",
    content: (
      <ul className="flex flex-col gap-3" role="list">
        {[
          "Stranica je namijenjena informisanju i online kupovini muških odjevnih predmeta brenda KEM JEANS.",
          "Zabranjeno je zloupotrebljavati sadržaj stranice u bilo koje nezakonite ili neovlaštene svrhe.",
          "Korisnik se obavezuje da neće pokušavati neovlašteno pristupiti sistemima ili podacima stranice.",
          "Sadržaj stranice namijenjen je isključivo osobnoj, nekomercijalnoj upotrebi.",
        ].map((t) => (
          <li key={t} className="flex items-start gap-3">
            <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "cijene",
    title: "Cijene i dostupnost",
    content: (
      <ul className="flex flex-col gap-3" role="list">
        {[
          "Sve cijene su izražene u konvertibilnim markama (KM) i uključuju PDV.",
          "Zadržavamo pravo izmjene cijena bez prethodne najave. Narudžba potvrđena po određenoj cijeni bit će izvršena po toj cijeni.",
          "Dostupnost proizvoda zavisi od trenutnog stanja na lageru. Proizvodi koji nisu na lageru bit će jasno označeni.",
        ].map((t) => (
          <li key={t} className="flex items-start gap-3">
            <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "narudzbe",
    title: "Narudžbe",
    content: (
      <ul className="flex flex-col gap-3" role="list">
        {[
          "Kupac je odgovoran za tačnost svih podataka unesenih prilikom narudžbe (ime, adresa, kontakt).",
          "Nakon uspješno zaprimljene narudžbe, kupac će dobiti potvrdu putem emaila ili telefona.",
          "Zadržavamo pravo otkazivanja narudžbe u slučaju nedostupnosti proizvoda ili neispravnih podataka, uz obavještenje kupca.",
        ].map((t) => (
          <li key={t} className="flex items-start gap-3">
            <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "dostava",
    title: "Dostava",
    content: (
      <ul className="flex flex-col gap-3" role="list">
        {[
          "Dostava se vrši isključivo na teritoriji Bosne i Hercegovine.",
          "Uobičajeno vrijeme dostave je 1–3 radna dana od potvrde narudžbe.",
          "Trošak dostave iznosi 9 KM. Za narudžbe iznad 150 KM dostava je besplatna.",
        ].map((t) => (
          <li key={t} className="flex items-start gap-3">
            <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "povrat",
    title: "Povrat i zamjena",
    content: (
      <>
        <ul className="flex flex-col gap-3" role="list">
          {[
            "Povrat je moguć u roku od 14 dana od preuzimanja pošiljke, u skladu s pravilima povrata.",
            "Proizvod mora biti nenošen, neoštećen i s originalnim etiketama.",
            "Trošak povrata snosi kupac, osim u slučaju greške s naše strane.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Detaljna pravila povrata dostupna su na stranici{" "}
          <Link href="/povrat" className="text-[#B89F5B] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89F5B]">
            Povrat i zamjena
          </Link>.
        </p>
      </>
    ),
  },
  {
    id: "intelektualno",
    title: "Intelektualno vlasništvo",
    content: (
      <ul className="flex flex-col gap-3" role="list">
        {[
          "Sav sadržaj na stranici — uključujući tekst, fotografije, logotip i dizajn — vlasništvo je brenda KEM JEANS.",
          "Zabranjeno je kopiranje, reprodukcija ili distribucija sadržaja bez pisane dozvole.",
          "Neovlašteno korištenje sadržaja može rezultirati pravnim postupkom.",
        ].map((t) => (
          <li key={t} className="flex items-start gap-3">
            <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "odgovornost",
    title: "Ograničenje odgovornosti",
    content: (
      <p>
        Trudimo se da sve informacije na stranici budu tačne i ažurne, ali ne garantujemo potpunu tačnost
        u svakom trenutku. KEM JEANS ne snosi odgovornost za eventualne greške u opisima proizvoda, cijenama
        ili dostupnosti, niti za štete nastale korištenjem stranice.
      </p>
    ),
  },
  {
    id: "izmjene",
    title: "Izmjene uslova",
    content: (
      <>
        <p>
          Zadržavamo pravo izmjene ovih uslova korištenja u bilo kojem trenutku bez prethodne najave.
          Promjene stupaju na snagu trenutkom objavljivanja na stranici.
        </p>
        <p className="mt-3">
          Preporučujemo redovito pregledanje ove stranice. Datum posljednjeg ažuriranja uvijek je naznačen
          ispod naslova.
        </p>
        <p className="text-[#F4F4F2]/25 text-xs tracking-wide mt-3">
          Posljednje ažuriranje: 05.03.2026.
        </p>
      </>
    ),
  },
];

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { ref, visible } = useFadeIn();
  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={`${id}-h`}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
      <h2
        id={`${id}-h`}
        className="text-[#F4F4F2] text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-3"
      >
        <span className="block w-4 h-px bg-[#B89F5B] shrink-0" aria-hidden="true" />
        {title}
      </h2>
      <div className="text-[#F4F4F2]/55 text-sm font-light leading-relaxed tracking-wide">
        {children}
      </div>
    </section>
  );
}

export default function UsloviPage() {
  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <main className="pt-24 md:pt-32 pb-20">
        <div className="mx-auto max-w-2xl px-5 md:px-8">

          {/* Header */}
          <header className="mb-12 md:mb-16">
            <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">— Pravni dokument</p>
            <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight mb-3">
              Uslovi korištenja
            </h1>
            <p className="text-[#F4F4F2]/50 text-sm md:text-base font-light tracking-wide leading-relaxed mb-4">
              Pravila i uslovi korištenja web stranice KEM JEANS.
            </p>
            <p className="text-[#F4F4F2]/25 text-xs tracking-wide">
              Posljednje ažuriranje: 05.03.2026.
            </p>
          </header>

          {/* Sections */}
          <article className="flex flex-col gap-10">
            {SECTIONS.map((s, i) => (
              <div key={s.id}>
                <DocSection id={s.id} title={s.title}>
                  {s.content}
                </DocSection>
                {i < SECTIONS.length - 1 && (
                  <div className="mt-10 border-t border-[#F4F4F2]/8" aria-hidden="true" />
                )}
              </div>
            ))}

            {/* CTA */}
            <div className="bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
              <div>
                <p className="text-[#F4F4F2] text-sm font-semibold tracking-wide mb-1">Imate pitanja?</p>
                <p className="text-[#F4F4F2]/40 text-xs tracking-wide">Kontaktirajte nas i odgovorit ćemo u najkraćem roku.</p>
              </div>
              <Link
                href="/kontakt"
                className="shrink-0 inline-flex items-center gap-2 border border-[#F4F4F2]/15 text-[#F4F4F2]/60 text-xs uppercase tracking-[0.18em] px-6 py-3 transition-all duration-300 hover:border-[#B89F5B] hover:text-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
              >
                Kontakt
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </Link>
            </div>
          </article>

        </div>
      </main>
    </div>
  );
}
