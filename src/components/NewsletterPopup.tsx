"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const DISMISSED_KEY = "kemjeans_newsletter_dismissed";
const SUBSCRIBED_KEY = "kemjeans_newsletter_subscribed";

const BLOCKED_PATHS = ["/checkout", "/cart", "/pretraga", "/privatnost", "/uslovi"];
const ALLOWED_PATH = "/";

type Phase = "hidden" | "visible" | "success";

export default function NewsletterPopup() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dontShow, setDontShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useRef(false);

  /* Only mount on allowed path */
  const isAllowed =
    pathname === ALLOWED_PATH && !BLOCKED_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    setMounted(true);
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  /* Trigger logic: 8s timer OR 35% scroll race */
  useEffect(() => {
    if (!mounted || !isAllowed) return;

    try {
      if (
        localStorage.getItem(DISMISSED_KEY) === "1" ||
        localStorage.getItem(SUBSCRIBED_KEY) === "1"
      ) return;
    } catch {
      return;
    }

    let triggered = false;
    const show = () => {
      if (triggered) return;
      triggered = true;
      setPhase("visible");
    };

    /* 8 second timer */
    const timer = setTimeout(show, 8000);

    /* 35% scroll trigger */
    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= 0.35) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mounted, isAllowed]);

  /* Focus management when visible */
  useEffect(() => {
    if (phase === "visible") {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  /* ESC close */
  useEffect(() => {
    if (phase !== "visible") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleDismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Focus trap */
  useEffect(() => {
    if (phase !== "visible" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, input, a, [tabindex]:not([tabindex="-1"])'
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
  }, [phase]);

  const handleDismiss = () => {
    try {
      if (dontShow) localStorage.setItem(DISMISSED_KEY, "1");
    } catch { /* noop */ }
    setPhase("hidden");
  };

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Unesite ispravan email.");
      return;
    }
    setEmailError("");
    try { localStorage.setItem(SUBSCRIBED_KEY, "1"); } catch { /* noop */ }
    setPhase("success");
    setTimeout(() => setPhase("hidden"), 1500);
  };

  if (!mounted || !isAllowed || phase === "hidden") return null;

  const isVisible = phase === "visible" || phase === "success";
  const reduced = prefersReduced.current;

  return (
    /* Outer wrapper — not aria-hidden so dialogs are reachable */
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${reduced ? "!transition-none" : ""}`}
    >
      {/* Decorative backdrop — hidden from AT */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* ── Mobile: bottom sheet ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Newsletter prijava"
        onClick={(e) => e.stopPropagation()}
        className={`md:hidden absolute inset-x-0 bottom-0 bg-[#0E0E0E] rounded-t-2xl border-t border-[#F4F4F2]/8 transition-transform duration-400 ease-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        } ${reduced ? "!transition-none" : ""}`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div className="w-10 h-1 bg-[#F4F4F2]/20 rounded-full" />
        </div>

        <div className="px-6 pt-3 pb-8 flex flex-col gap-5">
          {/* Close */}
          <div className="flex justify-end">
            <button
              ref={closeRef}
              onClick={handleDismiss}
              aria-label="Zatvori"
              className="w-8 h-8 flex items-center justify-center text-[#F4F4F2]/40 hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                <path d="M12 1L1 12M1 1l11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>

          {phase === "success" ? (
            <SuccessContent />
          ) : (
            <FormContent
              email={email}
              setEmail={setEmail}
              emailError={emailError}
              dontShow={dontShow}
              setDontShow={setDontShow}
              inputRef={inputRef}
              onSubmit={handleSubmit}
              onDismiss={handleDismiss}
            />
          )}
        </div>
      </div>

      {/* ── Desktop: centered modal ── */}
      <div
        className={`hidden md:flex absolute inset-0 items-center justify-center p-6 transition-all duration-300 ${
          isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } ${reduced ? "!transition-none" : ""}`}
        onClick={handleDismiss}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Newsletter prijava"
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#0E0E0E] border border-[#F4F4F2]/10 w-full max-w-[520px] shadow-2xl transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } ${reduced ? "!transition-none" : ""}`}
        >
          {/* Gold accent bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#B89F5B] to-transparent" />

          <div className="px-10 py-9 flex flex-col gap-6">
            {/* Close row */}
            <div className="flex justify-end -mt-2 -mr-2">
              <button
                onClick={handleDismiss}
                aria-label="Zatvori"
                className="w-8 h-8 flex items-center justify-center text-[#F4F4F2]/40 hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                  <path d="M12 1L1 12M1 1l11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </button>
            </div>

            {phase === "success" ? (
              <SuccessContent />
            ) : (
              <FormContent
                email={email}
                setEmail={setEmail}
                emailError={emailError}
                dontShow={dontShow}
                setDontShow={setDontShow}
                inputRef={inputRef}
                onSubmit={handleSubmit}
                onDismiss={handleDismiss}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function SuccessContent() {
  return (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
      <div className="w-10 h-10 rounded-full bg-[#B89F5B]/15 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B89F5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p className="text-[#F4F4F2] text-base font-bold uppercase tracking-widest">Hvala!</p>
      <p className="text-[#F4F4F2]/55 text-sm tracking-wide leading-relaxed">
        Kod za popust stiže uskoro.
      </p>
    </div>
  );
}

function FormContent({
  email, setEmail, emailError, dontShow, setDontShow,
  inputRef, onSubmit, onDismiss,
}: {
  email: string;
  setEmail: (v: string) => void;
  emailError: string;
  dontShow: boolean;
  setDontShow: (v: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void;
  onDismiss: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="text-[#B89F5B] text-[10px] tracking-[0.3em] uppercase font-medium">
          — Ekskluzivno
        </p>
        <h2 className="text-[#F4F4F2] text-2xl font-bold uppercase tracking-widest leading-tight">
          Ekskluzivne ponude
        </h2>
        <p className="text-[#F4F4F2]/55 text-sm font-light tracking-wide leading-relaxed">
          Prijavite se i ostvarite{" "}
          <span className="text-[#B89F5B] font-semibold">10% popusta</span>{" "}
          na prvu narudžbu.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="newsletter-email" className="sr-only">Email adresa</label>
          <input
            ref={inputRef}
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Unesite vaš email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "newsletter-email-error" : undefined}
            className="w-full bg-[#1A1A1A] text-[#F4F4F2] placeholder-[#F4F4F2]/25 text-sm tracking-wide px-4 py-3.5 border border-[#F4F4F2]/10 outline-none transition-all duration-200 focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B]"
          />
          {emailError && (
            <p id="newsletter-email-error" role="alert" className="text-red-400/80 text-xs tracking-wide px-1">
              {emailError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
        >
          Prijavi se
        </button>
      </form>

      {/* Footer */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
          <div className="relative w-4 h-4 shrink-0">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-4 h-4 border border-[#F4F4F2]/20 peer-checked:border-[#B89F5B] peer-checked:bg-[#B89F5B]/15 transition-all duration-200 group-hover:border-[#F4F4F2]/40 peer-focus-visible:ring-2 peer-focus-visible:ring-[#B89F5B]" />
            {dontShow && (
              <svg className="absolute inset-0 m-auto" width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#B89F5B" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="2 6 5 9 10 3" />
              </svg>
            )}
          </div>
          <span className="text-[#F4F4F2]/35 text-[11px] tracking-wide group-hover:text-[#F4F4F2]/55 transition-colors">
            Ne prikazuj ponovo
          </span>
        </label>

        <button
          type="button"
          onClick={onDismiss}
          className="text-[#F4F4F2]/30 text-[11px] tracking-wide hover:text-[#F4F4F2]/55 transition-colors text-left focus-visible:outline-none focus-visible:text-[#B89F5B] w-fit"
        >
          Ne sada
        </button>
      </div>
    </>
  );
}
