"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Fade-in hook ───────────────────────────────────────────────────────────── */

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
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

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface FormState { ime: string; email: string; telefon: string; poruka: string; }
interface FormErrors { ime?: string; email?: string; poruka?: string; }

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function KontaktPage() {
  const formCard = useFadeIn();
  const infoCard = useFadeIn();
  const mapCard  = useFadeIn();

  const [form, setForm]       = useState<FormState>({ ime: "", email: "", telefon: "", poruka: "" });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [sent, setSent]       = useState(false);

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k as keyof FormErrors]; return n; });
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.ime.trim())   e.ime   = "Ovo polje je obavezno.";
    if (!form.email.trim()) e.email = "Ovo polje je obavezno.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Unesite ispravan email.";
    if (!form.poruka.trim()) e.poruka = "Ovo polje je obavezno.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSent(true);
  };

  const reset = () => {
    setForm({ ime: "", email: "", telefon: "", poruka: "" });
    setErrors({});
    setSent(false);
  };

  /* ── Shared input styles ── */
  const inputCls = (err?: string) =>
    `w-full bg-[#0E0E0E] text-[#F4F4F2] placeholder-[#F4F4F2]/20 text-sm tracking-wide px-4 py-3 border outline-none transition-colors duration-200 focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B] ${err ? "border-red-500/50" : "border-[#F4F4F2]/10 hover:border-[#F4F4F2]/20"}`;

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <main className="pt-24 md:pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8 lg:px-10">

          {/* Header */}
          <div className="mb-10 md:mb-14">
            <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">— Kontakt</p>
            <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight mb-3">
              Kontakt
            </h1>
            <p className="text-[#F4F4F2]/50 text-sm md:text-base font-light tracking-wide">
              Tu smo za vas. Pišite nam ili nas pozovite.
            </p>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* ── Contact form ── */}
            <div
              ref={formCard.ref}
              className={`bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 transition-all duration-700 ease-out ${formCard.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <h2 className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em] mb-6">
                Pošaljite poruku
              </h2>

              {sent ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center text-center py-8 gap-4"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B89F5B]/15">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B89F5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-[#F4F4F2] text-base font-bold uppercase tracking-widest mb-2">
                      Poruka je poslana
                    </p>
                    <p className="text-[#F4F4F2]/50 text-sm font-light tracking-wide leading-relaxed">
                      Hvala! Javit ćemo vam se uskoro.
                    </p>
                  </div>
                  <button
                    onClick={reset}
                    className="mt-2 border border-[#F4F4F2]/15 text-[#F4F4F2]/60 text-xs uppercase tracking-[0.18em] px-6 py-3 transition-all duration-300 hover:border-[#B89F5B] hover:text-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
                  >
                    Pošalji novu poruku
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate aria-label="Kontakt forma" className="flex flex-col gap-4">
                  {/* Ime */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ime" className="text-[#F4F4F2]/65 text-xs uppercase tracking-[0.15em] font-medium">
                      Ime i prezime <span className="text-[#B89F5B]">*</span>
                    </label>
                    <input
                      id="ime" type="text" placeholder="Adnan Kovačević"
                      value={form.ime} onChange={(e) => set("ime", e.target.value)}
                      aria-required="true" aria-invalid={!!errors.ime}
                      aria-describedby={errors.ime ? "err-ime" : undefined}
                      className={inputCls(errors.ime)}
                    />
                    {errors.ime && <p id="err-ime" role="alert" className="text-red-400/70 text-xs tracking-wide">{errors.ime}</p>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[#F4F4F2]/65 text-xs uppercase tracking-[0.15em] font-medium">
                      Email <span className="text-[#B89F5B]">*</span>
                    </label>
                    <input
                      id="email" type="email" placeholder="adnan@email.com"
                      value={form.email} onChange={(e) => set("email", e.target.value)}
                      aria-required="true" aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      className={inputCls(errors.email)}
                    />
                    {errors.email && <p id="err-email" role="alert" className="text-red-400/70 text-xs tracking-wide">{errors.email}</p>}
                  </div>

                  {/* Telefon */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="telefon" className="text-[#F4F4F2]/65 text-xs uppercase tracking-[0.15em] font-medium">
                      Telefon <span className="text-[#F4F4F2]/25 text-[10px] normal-case tracking-normal font-normal">(opcionalno)</span>
                    </label>
                    <input
                      id="telefon" type="tel" placeholder="+387 61 000 000"
                      value={form.telefon} onChange={(e) => set("telefon", e.target.value)}
                      className={inputCls()}
                    />
                  </div>

                  {/* Poruka */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="poruka" className="text-[#F4F4F2]/65 text-xs uppercase tracking-[0.15em] font-medium">
                      Poruka <span className="text-[#B89F5B]">*</span>
                    </label>
                    <textarea
                      id="poruka" rows={5} placeholder="Vaša poruka..."
                      value={form.poruka} onChange={(e) => set("poruka", e.target.value)}
                      aria-required="true" aria-invalid={!!errors.poruka}
                      aria-describedby={errors.poruka ? "err-poruka" : undefined}
                      className={`${inputCls(errors.poruka)} resize-none`}
                    />
                    {errors.poruka && <p id="err-poruka" role="alert" className="text-red-400/70 text-xs tracking-wide">{errors.poruka}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] mt-1"
                  >
                    Pošalji poruku
                  </button>
                </form>
              )}
            </div>

            {/* ── Contact info ── */}
            <div
              ref={infoCard.ref}
              className={`flex flex-col gap-5 transition-all duration-700 delay-100 ease-out ${infoCard.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              {/* Info card */}
              <div className="bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 flex flex-col gap-5">
                <h2 className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">
                  Informacije
                </h2>

                <div className="flex flex-col gap-4">
                  {[
                    {
                      label: "Email",
                      value: "support@kemjeans.ba",
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                    },
                    {
                      label: "Telefon",
                      value: "+387 61 000 000",
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                    },
                    {
                      label: "Lokacija",
                      value: "Sarajevo, BiH",
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                    },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="shrink-0 text-[#B89F5B] mt-0.5">{icon}</span>
                      <div>
                        <p className="text-[#F4F4F2]/35 text-[10px] uppercase tracking-[0.15em] mb-0.5">{label}</p>
                        <p className="text-[#F4F4F2]/75 text-sm tracking-wide">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working hours */}
              <div className="bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8">
                <h2 className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em] mb-5">
                  Radno vrijeme
                </h2>
                <div className="flex flex-col gap-2.5">
                  {[
                    { day: "Ponedjeljak – Petak", hours: "09:00 – 17:00", open: true },
                    { day: "Subota",               hours: "10:00 – 14:00", open: true },
                    { day: "Nedjelja",              hours: "Neradna",       open: false },
                  ].map(({ day, hours, open }) => (
                    <div key={day} className="flex items-center justify-between gap-4">
                      <span className="text-[#F4F4F2]/55 text-xs tracking-wide">{day}</span>
                      <span className={`text-xs font-medium tracking-wide ${open ? "text-[#F4F4F2]/75" : "text-[#F4F4F2]/25"}`}>{hours}</span>
                    </div>
                  ))}
                </div>

                {/* Social */}
                <div className="mt-6 pt-5 border-t border-[#F4F4F2]/8 flex items-center gap-4">
                  <span className="text-[#F4F4F2]/30 text-[10px] uppercase tracking-[0.2em]">Pratite nas</span>
                  {[
                    {
                      label: "Instagram",
                      href: "https://instagram.com",
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
                    },
                    {
                      label: "TikTok",
                      href: "https://tiktok.com",
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
                    },
                    {
                      label: "Facebook",
                      href: "https://facebook.com",
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                    },
                  ].map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`KEM JEANS na ${label}`}
                      className="text-[#F4F4F2]/35 transition-colors duration-300 hover:text-[#B89F5B] focus-visible:outline-none focus-visible:text-[#B89F5B]"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div
            ref={mapCard.ref}
            className={`bg-[#1A1A1A] border border-[#F4F4F2]/8 p-6 md:p-8 transition-all duration-700 delay-150 ease-out ${mapCard.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <h2 className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em] mb-1">Lokacija</h2>
            <p className="text-[#F4F4F2]/40 text-xs tracking-wide mb-5">Sarajevo, Bosna i Hercegovina</p>
            <div
              className="w-full h-48 md:h-64 bg-[#0E0E0E] border border-[#F4F4F2]/6 flex items-center justify-center"
              role="img"
              aria-label="Mapa lokacije — placeholder"
            >
              <div className="flex flex-col items-center gap-3 text-[#F4F4F2]/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-xs tracking-[0.2em] uppercase">Mapa (placeholder)</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
