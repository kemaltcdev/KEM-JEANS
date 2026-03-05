"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore, selectSubtotal, selectShipping, selectTotal } from "@/store/cartStore";
import { showToast } from "@/store/toastStore";
import FreeShippingProgress from "@/components/FreeShippingProgress";

const FREE_SHIPPING_THRESHOLD = 150;

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function CartPage() {
  const [hydrated, setHydrated] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountStatus, setDiscountStatus] = useState<"idle" | "invalid" | "applied">("idle");

  /* Hydrate store on mount */
  useEffect(() => {
    useCartStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const items = useCartStore((s) => s.items);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = useCartStore(selectSubtotal);
  const shipping = useCartStore(selectShipping);
  const total = useCartStore(selectTotal);

  const applyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "KEM10") {
      setDiscountStatus("applied");
    } else {
      setDiscountStatus("invalid");
    }
  };

  const displayTotal = discountStatus === "applied" ? Math.round(total * 0.9) : total;

  /* ── Summary block (shared) ── */
  const SummaryContent = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex flex-col gap-4 ${compact ? "" : "p-6"}`}>
      <h2 className={`text-[#F4F4F2] font-bold uppercase tracking-[0.18em] ${compact ? "text-xs" : "text-sm"}`}>
        Pregled narudžbe
      </h2>

      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-[#F4F4F2]/55 tracking-wide">Međuzbir</span>
          <span className="text-[#F4F4F2] font-medium">{subtotal} KM</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#F4F4F2]/55 tracking-wide">Dostava</span>
          {shipping === 0 ? (
            <span className="text-[#B89F5B] text-xs font-semibold tracking-wide">Besplatno</span>
          ) : (
            <span className="text-[#F4F4F2] font-medium">{shipping} KM</span>
          )}
        </div>

        {shipping > 0 && (
          <p className="text-[#F4F4F2]/30 text-xs tracking-wide">
            Besplatna dostava iznad {FREE_SHIPPING_THRESHOLD} KM
            {" "}(još {FREE_SHIPPING_THRESHOLD - subtotal} KM)
          </p>
        )}

        {discountStatus === "applied" && (
          <div className="flex justify-between items-center text-[#B89F5B]">
            <span className="tracking-wide text-xs">Popust (KEM10)</span>
            <span className="font-semibold">−10%</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#F4F4F2]/10 pt-3 flex justify-between items-baseline">
        <span className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.15em]">Ukupno</span>
        <div className="text-right">
          <span className="text-[#F4F4F2] text-lg font-bold">
            {displayTotal}{" "}
            <span className="text-[#B89F5B] text-xs font-normal">KM</span>
          </span>
          <p className="text-[#F4F4F2]/25 text-[10px] tracking-wide">PDV uključen</p>
        </div>
      </div>

      {/* Discount toggle */}
      <div className="border-t border-[#F4F4F2]/10 pt-3">
        <button
          onClick={() => setDiscountOpen((v) => !v)}
          aria-expanded={discountOpen}
          aria-controls="discount-panel"
          className="flex items-center gap-2 text-[#F4F4F2]/45 text-xs tracking-wide hover:text-[#F4F4F2]/70 transition-colors focus-visible:outline-none focus-visible:text-[#B89F5B] w-full text-left"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"
            className={`transition-transform duration-200 shrink-0 ${discountOpen ? "rotate-45" : ""}`}>
            <path d="M6 1v10M1 6h10"/>
          </svg>
          Dodaj kod za popust
        </button>

        <div
          id="discount-panel"
          className={`overflow-hidden transition-all duration-300 ease-out ${discountOpen ? "max-h-24 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
        >
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="discount-input" className="sr-only">Kod za popust</label>
              <input
                id="discount-input"
                type="text"
                placeholder="Unesite kod"
                value={discountCode}
                onChange={(e) => { setDiscountCode(e.target.value); setDiscountStatus("idle"); }}
                tabIndex={discountOpen ? 0 : -1}
                className="w-full bg-[#0E0E0E] text-[#F4F4F2] placeholder-[#F4F4F2]/25 text-xs tracking-wide px-3 py-2.5 border border-[#F4F4F2]/12 outline-none transition-colors focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B]"
              />
            </div>
            <button
              onClick={applyDiscount}
              tabIndex={discountOpen ? 0 : -1}
              className="shrink-0 px-4 py-2.5 border border-[#F4F4F2]/15 text-[#F4F4F2]/60 text-xs uppercase tracking-[0.15em] transition-all hover:border-[#F4F4F2]/35 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
            >
              Primijeni
            </button>
          </div>
          {discountStatus === "invalid" && (
            <p role="alert" className="text-red-400/70 text-xs tracking-wide mt-2">
              Kod nije važeći.
            </p>
          )}
          {discountStatus === "applied" && (
            <p role="status" className="text-[#B89F5B] text-xs tracking-wide mt-2">
              Popust primijenjen ✓
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={items.length > 0 ? "/checkout" : "#"}
        aria-disabled={items.length === 0}
        tabIndex={items.length === 0 ? -1 : 0}
        className={`block w-full text-center py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] ${
          items.length === 0
            ? "bg-[#F4F4F2]/20 text-[#F4F4F2]/30 cursor-not-allowed pointer-events-none"
            : "bg-[#F4F4F2] text-[#0E0E0E] hover:bg-[#B89F5B]"
        }`}
      >
        Nastavi na plaćanje
      </Link>

      <Link
        href="/shop"
        className="text-center text-[#F4F4F2]/35 text-xs tracking-wide hover:text-[#F4F4F2]/60 transition-colors focus-visible:outline-none focus-visible:text-[#B89F5B]"
      >
        ← Nastavi kupovinu
      </Link>
    </div>
  );

  /* Render nothing until hydrated to avoid SSR mismatch */
  if (!hydrated) {
    return <div className="min-h-screen bg-[#0E0E0E]" />;
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <main className="pt-24 md:pt-28 pb-32 md:pb-16">
        <div className="px-5 md:px-10 lg:px-16 mb-8 md:mb-10">
          <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-2">
            — Narudžba
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight">
              Korpa
            </h1>
            {items.length > 0 && (
              <span className="text-[#F4F4F2]/35 text-xs tracking-wide">
                {items.reduce((s, i) => s + i.quantity, 0)} stavke
              </span>
            )}
          </div>
          <p className="text-[#F4F4F2]/45 text-sm mt-1.5 font-light tracking-wide">
            Provjerite artikle prije plaćanja.
          </p>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-5 text-center">
            <div className="mb-6 text-[#F4F4F2]/15">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <p className="text-[#F4F4F2]/40 text-sm tracking-wide mb-6">Vaša korpa je prazna.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#F4F4F2] text-[#0E0E0E] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
            >
              Nastavi kupovinu
            </Link>
          </div>
        ) : (
          <div className="px-5 md:px-10 lg:px-16 flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start">

            {/* ── Items list ── */}
            <section aria-label="Artikli u korpi" className="flex-1 min-w-0 flex flex-col gap-3">
              {items.map((item) => (
                <article
                  key={`${item.slug}__${item.size}__${item.color}`}
                  className="flex gap-4 bg-[#1A1A1A] border border-[#F4F4F2]/8 p-4"
                  aria-label={`${item.name}, veličina ${item.size}, boja ${item.color}`}
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
                    aria-label={`Pogledaj ${item.name}`}
                    tabIndex={-1}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={`${item.name} – ${item.size} ${item.color}`}
                      className="w-20 h-24 md:w-24 md:h-28 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-[#F4F4F2] text-sm font-medium tracking-wide leading-snug hover:text-[#B89F5B] transition-colors focus-visible:outline-none focus-visible:text-[#B89F5B]"
                      >
                        {item.name}
                      </Link>
                      <span className="shrink-0 text-[#F4F4F2] text-sm font-bold">
                        {item.priceKM * item.quantity}{" "}
                        <span className="text-[#B89F5B] text-[10px] font-normal">KM</span>
                      </span>
                    </div>

                    <p className="text-[#F4F4F2]/40 text-xs tracking-wide">
                      Veličina: {item.size} · Boja: {item.color}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-1">
                      {/* Quantity stepper */}
                      <div
                        className="flex items-center border border-[#F4F4F2]/12"
                        role="group"
                        aria-label={`Količina za ${item.name}`}
                      >
                        <button
                          onClick={() => decrement(item.slug, item.size, item.color)}
                          disabled={item.quantity <= 1}
                          aria-label="Smanji količinu"
                          className="w-9 h-9 flex items-center justify-center text-[#F4F4F2]/50 transition-colors hover:text-[#F4F4F2] hover:bg-[#F4F4F2]/5 disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B89F5B]"
                        >
                          <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor" aria-hidden="true"><rect width="10" height="2" rx="1"/></svg>
                        </button>
                        <span
                          className="w-8 text-center text-[#F4F4F2] text-xs font-semibold border-x border-[#F4F4F2]/12 py-2"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increment(item.slug, item.size, item.color)}
                          disabled={item.quantity >= 10}
                          aria-label="Povećaj količinu"
                          className="w-9 h-9 flex items-center justify-center text-[#F4F4F2]/50 transition-colors hover:text-[#F4F4F2] hover:bg-[#F4F4F2]/5 disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B89F5B]"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                            <rect x="4" width="2" height="10" rx="1"/><rect y="4" width="10" height="2" rx="1"/>
                          </svg>
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => { removeItem(item.slug, item.size, item.color); showToast("info", "Artikal uklonjen."); }}
                        aria-label={`Ukloni ${item.name} iz korpe`}
                        className="text-[#F4F4F2]/25 text-xs tracking-wide uppercase hover:text-red-400/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
                      >
                        Ukloni
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {/* Free shipping progress */}
              <div className="bg-[#1A1A1A] border border-[#F4F4F2]/8 px-4 py-3">
                <FreeShippingProgress subtotalKM={subtotal} />
              </div>

              {/* Mobile summary card */}
              <div className="md:hidden bg-[#1A1A1A] border border-[#F4F4F2]/8">
                <SummaryContent />
              </div>
            </section>

            {/* ── Desktop sticky sidebar ── */}
            <aside
              className="hidden md:block w-80 lg:w-96 shrink-0 sticky top-24 bg-[#1A1A1A] border border-[#F4F4F2]/8"
              aria-label="Pregled narudžbe"
            >
              <SummaryContent />
            </aside>
          </div>
        )}
      </main>

      {/* ── Mobile sticky bottom bar ── */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 md:hidden bg-[#0E0E0E]/96 backdrop-blur-md border-t border-[#F4F4F2]/10 px-5 py-3">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-[#F4F4F2]/45 text-xs tracking-wide">Ukupno</span>
              <p className="text-[#F4F4F2] text-base font-bold">
                {displayTotal}{" "}
                <span className="text-[#B89F5B] text-xs font-normal">KM</span>
              </p>
            </div>
            <Link
              href="/checkout"
              className="px-7 py-3.5 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.18em] transition-colors hover:bg-[#B89F5B] active:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
            >
              Plaćanje
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
