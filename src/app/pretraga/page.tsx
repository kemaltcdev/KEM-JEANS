"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS, CATEGORIES, COLOR_MAP } from "@/data/products";
import type { Category, Color } from "@/data/products";
import { formatPriceKM } from "@/lib/formatPrice";

/* ─── Suspense wrapper (required for useSearchParams in Next.js 14) ──────────── */

export default function PretragaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0E0E0E]" />}>
      <SearchResults />
    </Suspense>
  );
}

/* ─── Main search component ──────────────────────────────────────────────────── */

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(initialQ);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [sort, setSort] = useState<"preporuceno" | "cijena-asc" | "cijena-desc">("preporuceno");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Sync input → URL with 300ms debounce */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = inputValue.trim();
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      router.replace(`/pretraga?${params.toString()}`);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [inputValue, router]);

  /* Filter + sort */
  const results = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesCat = !activeCategory || p.category === activeCategory;
      return matchesQ && matchesCat;
    });
    if (sort === "cijena-asc") list = [...list].sort((a, b) => a.priceKM - b.priceKM);
    if (sort === "cijena-desc") list = [...list].sort((a, b) => b.priceKM - a.priceKM);
    return list;
  }, [inputValue, activeCategory, sort]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  /* Focus input on mount */
  useEffect(() => { searchInputRef.current?.focus(); }, []);

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <main className="pt-24 md:pt-28 pb-20">

        {/* Header */}
        <div className="px-5 md:px-10 lg:px-16 mb-8">
          <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-2">
            — Pretraga
          </p>
          <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight mb-6">
            {inputValue.trim() ? (
              <>Rezultati za &ldquo;{inputValue.trim()}&rdquo;</>
            ) : (
              "Pretraži"
            )}
          </h1>

          {/* Search input */}
          <div className="relative max-w-lg mb-8">
            <label htmlFor="pretraga-input" className="sr-only">Pretraži proizvode</label>
            <input
              ref={searchInputRef}
              id="pretraga-input"
              type="text"
              placeholder="Ime proizvoda, kategorija…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-[#1A1A1A] text-[#F4F4F2] placeholder-[#F4F4F2]/30 text-sm tracking-wide px-5 py-4 pr-12 border border-[#F4F4F2]/10 outline-none transition-all duration-300 focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B]"
            />
            {inputValue ? (
              <button
                type="button"
                onClick={() => setInputValue("")}
                aria-label="Obriši pretragu"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F4F4F2]/40 hover:text-[#F4F4F2]/70 transition-colors focus-visible:outline-none"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F4F4F2]/25 pointer-events-none"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            )}
          </div>

          {/* Category chips + sort */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Category filter chips */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtriraj po kategoriji">
              <button
                onClick={() => setActiveCategory(null)}
                aria-pressed={activeCategory === null}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.15em] border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
                  activeCategory === null
                    ? "border-[#B89F5B] bg-[#B89F5B]/15 text-[#B89F5B]"
                    : "border-[#F4F4F2]/15 text-[#F4F4F2]/50 hover:border-[#F4F4F2]/35 hover:text-[#F4F4F2]"
                }`}
              >
                Sve
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  aria-pressed={activeCategory === cat}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.15em] border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
                    activeCategory === cat
                      ? "border-[#B89F5B] bg-[#B89F5B]/15 text-[#B89F5B]"
                      : "border-[#F4F4F2]/15 text-[#F4F4F2]/50 hover:border-[#F4F4F2]/35 hover:text-[#F4F4F2]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort + count */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[#F4F4F2]/30 text-xs tracking-wide">
                {results.length} {results.length === 1 ? "rezultat" : "rezultata"}
              </span>
              <div className="relative">
                <label htmlFor="pretraga-sort" className="sr-only">Sortiraj</label>
                <select
                  id="pretraga-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="appearance-none bg-[#1A1A1A] text-[#F4F4F2]/60 text-xs uppercase tracking-[0.12em] px-3 py-2 pr-7 border border-[#F4F4F2]/12 outline-none cursor-pointer transition-colors hover:border-[#F4F4F2]/25 focus-visible:border-[#B89F5B]"
                >
                  <option value="preporuceno">Preporučeno</option>
                  <option value="cijena-asc">Cijena ↑</option>
                  <option value="cijena-desc">Cijena ↓</option>
                </select>
                <svg
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#F4F4F2]/35 pointer-events-none"
                  width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"
                >
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results grid */}
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-5 text-center">
            <div className="mb-5 text-[#F4F4F2]/15">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p className="text-[#F4F4F2]/40 text-sm tracking-wide mb-6">
              {inputValue.trim()
                ? `Nema rezultata za „${inputValue.trim()}".`
                : "Upišite pojam za pretragu."}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border border-[#F4F4F2]/15 px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#F4F4F2]/55 transition-all duration-300 hover:border-[#B89F5B] hover:text-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
            >
              Nazad na shop
            </Link>
          </div>
        ) : (
          <div
            className="px-5 md:px-10 lg:px-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5"
            role="list"
            aria-label="Rezultati pretrage"
          >
            {results.map((product) => (
              <div key={product.id} role="listitem">
                <SearchProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Product card ───────────────────────────────────────────────────────────── */

function SearchProductCard({ product }: { product: typeof PRODUCTS[number] }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col bg-[#1A1A1A] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
      aria-label={`${product.name} — ${formatPriceKM(product.priceKM)}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={`${product.name} – KEM JEANS`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
            product.badge === "Novo" ? "bg-[#B89F5B] text-[#0E0E0E]" : "bg-[#F4F4F2] text-[#0E0E0E]"
          }`}>
            {product.badge}
          </span>
        )}
        {/* Color swatches */}
        <div className="absolute bottom-2.5 left-2.5 flex gap-1.5" aria-hidden="true">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c}
              title={c}
              className="w-3 h-3 rounded-full border border-[#F4F4F2]/20"
              style={{ backgroundColor: COLOR_MAP[c as Color] }}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <span className="text-[#B89F5B] text-[10px] uppercase tracking-[0.18em] font-medium">
          {product.category}
        </span>
        <div className="flex items-start justify-between gap-1.5">
          <span className="text-[#F4F4F2] text-xs md:text-sm font-medium tracking-wide leading-snug line-clamp-2">
            {product.name}
          </span>
          <span className="shrink-0 text-[#F4F4F2] text-xs md:text-sm font-bold">
            {formatPriceKM(product.priceKM)}
          </span>
        </div>
      </div>
    </Link>
  );
}
