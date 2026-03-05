"use client";

import { useEffect, useRef, useState } from "react";

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="newsletter-heading"
      className="bg-[#1A1A1A] py-16 md:py-24"
    >
      <div
        className={`mx-auto max-w-2xl px-5 md:px-10 text-center transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Label */}
        <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-4">
          — Newsletter
        </p>

        {/* Title */}
        <h2
          id="newsletter-heading"
          className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight mb-4"
        >
          Prijavite se za ekskluzivne ponude
        </h2>

        {/* Subtitle */}
        <p className="text-[#F4F4F2]/50 text-sm md:text-base font-light tracking-wide leading-relaxed mb-2">
          Budite prvi koji saznaju za nove kolekcije, akcije i posebne popuste.
        </p>

        {/* Incentive */}
        <p className="text-[#B89F5B] text-sm font-medium tracking-wide mb-10">
          Ostvarite 10% popusta na prvu narudžbu.
        </p>

        {/* Form */}
        {status === "success" ? (
          <div
            role="status"
            aria-live="polite"
            className={`flex flex-col items-center gap-3 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B89F5B]/15">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B89F5B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <p className="text-[#F4F4F2] text-sm font-medium tracking-wide uppercase">
              Uspješno ste se prijavili!
            </p>
            <p className="text-[#F4F4F2]/50 text-xs tracking-wide">
              Vaš popust od 10% stiže na email uskoro.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col md:flex-row gap-3 w-full"
            aria-label="Newsletter prijava"
          >
            {/* Email field */}
            <div className="flex-1 flex flex-col gap-1.5 text-left">
              <label htmlFor="newsletter-email" className="sr-only">
                Email adresa
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Unesite vaš email"
                autoComplete="email"
                aria-required="true"
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "newsletter-error" : undefined}
                className={`w-full bg-[#0E0E0E] text-[#F4F4F2] placeholder-[#F4F4F2]/25 text-sm tracking-wide px-5 py-4 border outline-none transition-all duration-300 focus-visible:border-[#B89F5B] focus-visible:ring-1 focus-visible:ring-[#B89F5B] ${
                  status === "error"
                    ? "border-red-500/60"
                    : "border-[#F4F4F2]/10 hover:border-[#F4F4F2]/25"
                }`}
              />
              {status === "error" && (
                <p
                  id="newsletter-error"
                  role="alert"
                  className="text-red-400 text-xs tracking-wide pl-1"
                >
                  Unesite ispravnu email adresu.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="shrink-0 bg-[#F4F4F2] text-[#0E0E0E] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#B89F5B] hover:text-[#0E0E0E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
            >
              Prijavi se
            </button>
          </form>
        )}

        {/* Fine print */}
        <p className="mt-5 text-[#F4F4F2]/25 text-xs tracking-wide leading-relaxed">
          Prijavom prihvatate našu politiku privatnosti. Odjava je moguća u svakom trenutku.
        </p>
      </div>
    </section>
  );
}
