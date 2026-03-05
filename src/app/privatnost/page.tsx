"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Fade-in hook ───────────────────────────────────────────────────────────── */

function useFadeIn(threshold = 0.06) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Data ───────────────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: "ko-smo-mi",          title: "Ko smo mi" },
  { id: "koje-podatke",       title: "Koje podatke prikupljamo" },
  { id: "kako-koristimo",     title: "Kako koristimo podatke" },
  { id: "kolacici",           title: "Kolačići (Cookies)" },
  { id: "dijeljenje",         title: "Dijeljenje podataka" },
  { id: "sigurnost",          title: "Sigurnost" },
  { id: "vasa-prava",         title: "Vaša prava" },
  { id: "izmjene",            title: "Izmjene politike" },
];

/* ─── Section wrapper ────────────────────────────────────────────────────────── */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { ref, visible } = useFadeIn();
  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-28 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
      <h2
        id={`${id}-heading`}
        className="text-[#F4F4F2] text-base md:text-lg font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-3"
      >
        <span className="block w-4 h-px bg-[#B89F5B] shrink-0" aria-hidden="true" />
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-[#F4F4F2]/55 text-sm font-light leading-relaxed tracking-wide">
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2" role="list">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-2 shrink-0 block w-1 h-1 rounded-full bg-[#B89F5B]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function PrivatnostPage() {
  const [activeSection, setActiveSection] = useState("ko-smo-mi");

  /* Update active TOC item on scroll */
  useEffect(() => {
    const els = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <main className="pt-24 md:pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8 lg:px-10">

          {/* Header */}
          <header className="mb-10 md:mb-14">
            <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">— Pravni dokument</p>
            <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight mb-3">
              Politika privatnosti
            </h1>
            <p className="text-[#F4F4F2]/50 text-sm md:text-base font-light tracking-wide leading-relaxed max-w-xl mb-4">
              Vaša privatnost nam je važna. Ovdje objašnjavamo kako koristimo podatke.
            </p>
            <p className="text-[#F4F4F2]/25 text-xs tracking-wide">
              Posljednje ažuriranje: 05.03.2026.
            </p>
          </header>

          <div className="flex gap-12 items-start">

            {/* ── Desktop sticky TOC ── */}
            <nav
              aria-label="Sadržaj dokumenta"
              className="hidden lg:block w-52 shrink-0 sticky top-28 self-start"
            >
              <p className="text-[#F4F4F2]/30 text-[10px] uppercase tracking-[0.2em] mb-4">Sadržaj</p>
              <ul className="flex flex-col gap-1" role="list">
                {SECTIONS.map(({ id, title }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={`block text-xs tracking-wide py-1.5 pr-2 border-l-2 pl-3 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#B89F5B] ${
                        activeSection === id
                          ? "border-[#B89F5B] text-[#B89F5B]"
                          : "border-[#F4F4F2]/10 text-[#F4F4F2]/35 hover:text-[#F4F4F2]/65 hover:border-[#F4F4F2]/30"
                      }`}
                    >
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ── Article content ── */}
            <article className="flex-1 min-w-0 flex flex-col gap-10">

              <Section id="ko-smo-mi" title="Ko smo mi">
                <P>
                  <strong className="text-[#F4F4F2]/80 font-semibold">KEM JEANS</strong> je online prodavnica
                  muške odjeće sa sjedištem u Sarajevu, Bosna i Hercegovina. Ova politika privatnosti odnosi
                  se na sve korisnike koji posjećuju ili kupuju na našoj web stranici.
                </P>
                <P>
                  Za sva pitanja u vezi s privatnošću možete nas kontaktirati na:{" "}
                  <a
                    href="mailto:support@kemjeans.ba"
                    className="text-[#B89F5B] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89F5B]"
                  >
                    support@kemjeans.ba
                  </a>
                </P>
              </Section>

              <div className="border-t border-[#F4F4F2]/8" aria-hidden="true" />

              <Section id="koje-podatke" title="Koje podatke prikupljamo">
                <P>Prikupljamo sljedeće kategorije podataka:</P>
                <div>
                  <h3 className="text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-semibold mb-2">Podaci za narudžbu</h3>
                  <Ul items={["Ime i prezime", "Adresa dostave", "Broj telefona", "Email adresa", "Podaci o narudžbi i plaćanju"]} />
                </div>
                <div>
                  <h3 className="text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-semibold mb-2">Podaci o korištenju stranice</h3>
                  <Ul items={["Kolačići (cookies) za funkcionalnost stranice", "Anonimni analitički podaci (posjete, klikovi, trajanje sesije)", "IP adresa i vrsta preglednika (automatski)"]} />
                </div>
              </Section>

              <div className="border-t border-[#F4F4F2]/8" aria-hidden="true" />

              <Section id="kako-koristimo" title="Kako koristimo podatke">
                <P>Vaše podatke koristimo isključivo u sljedeće svrhe:</P>
                <Ul items={[
                  "Obrada narudžbi i organizacija dostave",
                  "Korisnička podrška i odgovaranje na upite",
                  "Unapređenje web stranice putem anonimne analitike",
                  "Slanje newslettera i promocija — samo uz vaš izričit pristanak",
                ]} />
                <P>
                  Podatke nikada ne koristimo u svrhe koje nisu navedene u ovoj politici, niti ih
                  prodajemo trećim stranama.
                </P>
              </Section>

              <div className="border-t border-[#F4F4F2]/8" aria-hidden="true" />

              <Section id="kolacici" title="Kolačići (Cookies)">
                <P>
                  Kolačići su mali tekstualni fajlovi koji se pohranjuju na vašem uređaju kada posjetite
                  našu stranicu. Koristimo ih kako bi stranica ispravno funkcionisala i kako bismo razumjeli
                  kako korisnici koriste naš sadržaj.
                </P>
                <div>
                  <h3 className="text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-semibold mb-2">Vrste kolačića</h3>
                  <Ul items={[
                    "Neophodni kolačići — za funkcionisanje stranice i korpe",
                    "Analitički kolačići — anonimna statistika posjeta",
                    "Marketinški kolačići — samo uz vaš pristanak",
                  ]} />
                </div>
                <P>
                  Možete upravljati kolačićima u postavkama svog preglednika. Napominjemo da onemogućavanje
                  određenih kolačića može uticati na funkcionisanje stranice.
                </P>
              </Section>

              <div className="border-t border-[#F4F4F2]/8" aria-hidden="true" />

              <Section id="dijeljenje" title="Dijeljenje podataka">
                <P>
                  Vaše podatke dijelimo isključivo s partnerima koji su neophodni za ispunjavanje narudžbe:
                </P>
                <Ul items={[
                  "Kurirske službe — za organizaciju dostave (ime, adresa, telefon)",
                  "Procesori plaćanja — za sigurnu obradu kartičnih transakcija",
                  "Hosting provajderi — za funkcionisanje infrastrukture stranice",
                ]} />
                <div className="bg-[#B89F5B]/8 border border-[#B89F5B]/20 px-4 py-3 flex items-start gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B89F5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-0.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
                  </svg>
                  <p className="text-[#B89F5B] text-xs tracking-wide font-medium">
                    Ne prodajemo, ne iznajmljujemo niti razmjenjujemo vaše podatke s trećim stranama u marketinške svrhe.
                  </p>
                </div>
              </Section>

              <div className="border-t border-[#F4F4F2]/8" aria-hidden="true" />

              <Section id="sigurnost" title="Sigurnost">
                <P>
                  Primjenjujemo standardne tehničke i organizacijske mjere zaštite kako bismo osigurali
                  vaše podatke od neovlaštenog pristupa, gubitka ili zloupotrebe:
                </P>
                <Ul items={[
                  "HTTPS enkripcija svih podataka u prijenosu",
                  "Ograničen pristup podacima — samo ovlašteni zaposlenici",
                  "Redovite provjere sigurnosti sistema",
                ]} />
                <P>
                  Savjetujemo vam da ne dijelite lozinke i osobne podatke putem neosiguranih kanala. Ako
                  primijetite sumnjive aktivnosti vezane za vaš nalog, kontaktirajte nas odmah.
                </P>
              </Section>

              <div className="border-t border-[#F4F4F2]/8" aria-hidden="true" />

              <Section id="vasa-prava" title="Vaša prava">
                <P>
                  U skladu s važećim zakonodavstvom o zaštiti podataka, imate sljedeća prava:
                </P>
                <Ul items={[
                  "Pravo na pristup — možete zatražiti kopiju podataka koje čuvamo o vama",
                  "Pravo na ispravku — možete zatražiti ispravku netačnih podataka",
                  "Pravo na brisanje — možete zatražiti brisanje vaših podataka",
                  "Pravo na prigovor — možete se usprotiviti određenim vrstama obrade",
                  "Pravo na prenosivost — možete zatražiti prijenos podataka u strukturiranom formatu",
                ]} />
                <P>
                  Za ostvarivanje navedenih prava kontaktirajte nas na{" "}
                  <a
                    href="mailto:support@kemjeans.ba"
                    className="text-[#B89F5B] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89F5B]"
                  >
                    support@kemjeans.ba
                  </a>
                  . Odgovorit ćemo u roku od 30 dana.
                </P>
              </Section>

              <div className="border-t border-[#F4F4F2]/8" aria-hidden="true" />

              <Section id="izmjene" title="Izmjene politike">
                <P>
                  Zadržavamo pravo izmjene ove politike privatnosti u skladu s promjenama u poslovanju ili
                  zakonskim zahtjevima. O svim značajnim izmjenama obavijestit ćemo vas putem email-a ili
                  vidljivog obavještenja na stranici.
                </P>
                <P>
                  Preporučujemo da povremeno pregledate ovu stranicu. Datum posljednjeg ažuriranja uvijek
                  je vidljiv na vrhu dokumenta.
                </P>
                <p className="text-[#F4F4F2]/30 text-xs tracking-wide">
                  Posljednje ažuriranje: 05.03.2026.
                </p>
              </Section>

              {/* CTA */}
              <div className="bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[#F4F4F2] text-sm font-semibold tracking-wide mb-1">Imate pitanje o privatnosti?</p>
                  <p className="text-[#F4F4F2]/40 text-xs tracking-wide">Pišite nam i odgovorit ćemo u najkraćem roku.</p>
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
        </div>
      </main>
    </div>
  );
}
