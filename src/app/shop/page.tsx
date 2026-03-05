"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS, CATEGORIES, SIZES, COLORS, COLOR_MAP } from "@/data/products";
import type { Category, Size, Color, Product } from "@/data/products";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuickViewModal from "@/components/QuickViewModal";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type SortKey = "preporuceno" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "preporuceno",  label: "Preporučeno" },
  { value: "price_asc",   label: "Cijena: niža → viša" },
  { value: "price_desc",  label: "Cijena: viša → niža" },
  { value: "name_asc",    label: "Naziv: A → Z" },
  { value: "name_desc",   label: "Naziv: Z → A" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /* ── Derive active filters from URL (source of truth) ── */
  const activeCategories = useMemo(
    () => (searchParams.get("category")?.split(",").filter(Boolean) ?? []) as Category[],
    [searchParams]
  );
  const sort = (searchParams.get("sort") ?? "preporuceno") as SortKey;
  const priceMin = searchParams.get("min") ?? "";
  const priceMax = searchParams.get("max") ?? "";
  const activeSizes = useMemo(
    () => (searchParams.get("size")?.split(",").filter(Boolean) ?? []) as Size[],
    [searchParams]
  );
  const activeColors = useMemo(
    () => (searchParams.get("color")?.split(",").filter(Boolean) ?? []) as Color[],
    [searchParams]
  );

  /* ── URL builder ── */
  const buildUrl = (updates: {
    categories?: Category[];
    sort?: SortKey;
    min?: string;
    max?: string;
    sizes?: Size[];
    colors?: Color[];
  }) => {
    const cats  = updates.categories ?? activeCategories;
    const s     = updates.sort      ?? sort;
    const mn    = updates.min       !== undefined ? updates.min  : priceMin;
    const mx    = updates.max       !== undefined ? updates.max  : priceMax;
    const szs   = updates.sizes     ?? activeSizes;
    const clrs  = updates.colors    ?? activeColors;

    const p = new URLSearchParams();
    if (cats.length)      p.set("category", cats.join(","));
    if (s !== "preporuceno") p.set("sort", s);
    if (mn)               p.set("min", mn);
    if (mx)               p.set("max", mx);
    if (szs.length)       p.set("size", szs.join(","));
    if (clrs.length)      p.set("color", clrs.join(","));

    const qs = p.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const updateUrl = (updates: Parameters<typeof buildUrl>[0]) =>
    router.replace(buildUrl(updates), { scroll: false });

  const resetAll = () => router.replace(pathname, { scroll: false });

  /* ── Mobile drawer state ── */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingCategories, setPendingCategories] = useState<Category[]>([]);
  const [pendingMin, setPendingMin] = useState("");
  const [pendingMax, setPendingMax] = useState("");
  const [pendingSizes, setPendingSizes] = useState<Size[]>([]);
  const [pendingColors, setPendingColors] = useState<Color[]>([]);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openDrawer = () => {
    setPendingCategories(activeCategories);
    setPendingMin(priceMin);
    setPendingMax(priceMax);
    setPendingSizes(activeSizes);
    setPendingColors(activeColors);
    setDrawerOpen(true);
  };

  const applyDrawer = () => {
    updateUrl({
      categories: pendingCategories,
      min: pendingMin,
      max: pendingMax,
      sizes: pendingSizes,
      colors: pendingColors,
    });
    setDrawerOpen(false);
  };

  const resetDrawer = () => {
    setPendingCategories([]);
    setPendingMin("");
    setPendingMax("");
    setPendingSizes([]);
    setPendingColors([]);
  };

  /* ── Quick view ── */
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const openQuickView = (p: Product) => { setQuickViewProduct(p); setQuickViewOpen(true); };
  const closeQuickView = () => setQuickViewOpen(false);

  /* ── Filtered + sorted products ── */
  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (activeCategories.length) list = list.filter((p) => activeCategories.includes(p.category));
    const min = parseFloat(priceMin);
    const max = parseFloat(priceMax);
    if (!isNaN(min)) list = list.filter((p) => p.priceKM >= min);
    if (!isNaN(max)) list = list.filter((p) => p.priceKM <= max);
    if (activeSizes.length)  list = list.filter((p) => p.sizes.some((s) => activeSizes.includes(s)));
    if (activeColors.length) list = list.filter((p) => p.colors.some((c) => activeColors.includes(c)));
    if (sort === "price_asc")  list.sort((a, b) => a.priceKM - b.priceKM);
    if (sort === "price_desc") list.sort((a, b) => b.priceKM - a.priceKM);
    if (sort === "name_asc")   list.sort((a, b) => a.name.localeCompare(b.name, "bs"));
    if (sort === "name_desc")  list.sort((a, b) => b.name.localeCompare(a.name, "bs"));
    return list;
  }, [activeCategories, priceMin, priceMax, activeSizes, activeColors, sort]);

  const activeFilterCount =
    activeCategories.length + activeSizes.length + activeColors.length +
    (priceMin || priceMax ? 1 : 0);

  /* ── Filter panel (shared) ── */
  const FilterPanel = ({
    categories, setCategories, min, setMin, max, setMax, sizes, setSizes, colors, setColors,
  }: {
    categories: Category[]; setCategories: (v: Category[]) => void;
    min: string; setMin: (v: string) => void;
    max: string; setMax: (v: string) => void;
    sizes: Size[]; setSizes: (v: Size[]) => void;
    colors: Color[]; setColors: (v: Color[]) => void;
  }) => (
    <div className="flex flex-col gap-7">
      {/* Category */}
      <div>
        <p className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.18em] mb-3">Kategorija</p>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategories(toggle(categories, cat))}
              aria-pressed={categories.includes(cat)}
              className={`flex items-center justify-between w-full px-3 py-2.5 text-sm tracking-wide text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
                categories.includes(cat)
                  ? "bg-[#B89F5B]/15 text-[#B89F5B]"
                  : "text-[#F4F4F2]/55 hover:text-[#F4F4F2] hover:bg-[#F4F4F2]/5"
              }`}
            >
              {cat}
              {categories.includes(cat) && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <polyline points="2 6 5 9 10 3" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#F4F4F2]/8" />

      {/* Price */}
      <div>
        <p className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.18em] mb-3">Cijena (KM)</p>
        <div className="flex items-center gap-2">
          <input
            type="number" placeholder="Min" value={min}
            onChange={(e) => setMin(e.target.value)}
            aria-label="Minimalna cijena"
            className="w-full bg-[#0E0E0E] text-[#F4F4F2] placeholder-[#F4F4F2]/25 text-sm px-3 py-2.5 border border-[#F4F4F2]/10 outline-none transition-colors focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B]"
          />
          <span className="text-[#F4F4F2]/30 text-xs shrink-0">—</span>
          <input
            type="number" placeholder="Max" value={max}
            onChange={(e) => setMax(e.target.value)}
            aria-label="Maksimalna cijena"
            className="w-full bg-[#0E0E0E] text-[#F4F4F2] placeholder-[#F4F4F2]/25 text-sm px-3 py-2.5 border border-[#F4F4F2]/10 outline-none transition-colors focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B]"
          />
        </div>
      </div>

      <div className="border-t border-[#F4F4F2]/8" />

      {/* Sizes */}
      <div>
        <p className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.18em] mb-3">Veličina</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSizes(toggle(sizes, s))}
              aria-pressed={sizes.includes(s)}
              className={`w-12 h-10 text-xs font-semibold uppercase tracking-wider border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
                sizes.includes(s)
                  ? "border-[#B89F5B] bg-[#B89F5B]/15 text-[#B89F5B]"
                  : "border-[#F4F4F2]/15 text-[#F4F4F2]/50 hover:border-[#F4F4F2]/40 hover:text-[#F4F4F2]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#F4F4F2]/8" />

      {/* Colors */}
      <div>
        <p className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.18em] mb-3">Boja</p>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColors(toggle(colors, c))}
              aria-pressed={colors.includes(c)}
              aria-label={c}
              title={c}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] ${
                colors.includes(c) ? "border-[#B89F5B] scale-110" : "border-[#F4F4F2]/20 hover:border-[#F4F4F2]/50"
              }`}
              style={{ backgroundColor: COLOR_MAP[c] }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      {/* Page header */}
      <div className="pt-24 md:pt-28 pb-8 md:pb-10 px-5 md:px-10 lg:px-16 border-b border-[#F4F4F2]/8">
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: "Početna", href: "/" },
              ...(activeCategories.length === 1
                ? [{ label: "Shop", href: "/shop" }, { label: activeCategories[0] }]
                : [{ label: "Shop" }]),
            ]}
          />
        </div>
        <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-2">
          — Kolekcija
        </p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight">
              {activeCategories.length === 1 ? activeCategories[0] : "Shop"}
            </h1>
            <p className="text-[#F4F4F2]/45 text-sm mt-1.5 font-light tracking-wide">
              Odaberite premium komade za vaš stil.
            </p>
          </div>
          <p className="text-[#F4F4F2]/35 text-xs tracking-wide shrink-0">
            Prikazano: <span className="text-[#F4F4F2]/60">{filtered.length}</span> proizvoda
          </p>
        </div>
      </div>

      <div className="px-5 md:px-10 lg:px-16 py-6 md:py-8 flex gap-8">
        {/* ── Desktop sidebar (updates URL directly) ── */}
        <aside className="hidden md:block w-56 lg:w-64 shrink-0" aria-label="Filteri">
          <div className="sticky top-24 bg-[#1A1A1A] p-6 border border-[#F4F4F2]/8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.2em]">Filteri</span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAll}
                  aria-label="Očisti sve filtere"
                  className="text-[#B89F5B] text-xs tracking-wide hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89F5B]"
                >
                  Očisti
                </button>
              )}
            </div>
            <FilterPanel
              categories={activeCategories}
              setCategories={(cats) => updateUrl({ categories: cats })}
              min={priceMin}
              setMin={(mn) => updateUrl({ min: mn })}
              max={priceMax}
              setMax={(mx) => updateUrl({ max: mx })}
              sizes={activeSizes}
              setSizes={(szs) => updateUrl({ sizes: szs })}
              colors={activeColors}
              setColors={(clrs) => updateUrl({ colors: clrs })}
            />
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            {/* Mobile: filter button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={openDrawer}
                aria-label="Otvori filtere"
                className="flex items-center gap-2 px-4 py-2.5 border border-[#F4F4F2]/15 text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] transition-colors hover:border-[#F4F4F2]/35 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
                  <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
                  <circle cx="8" cy="12" r="1.5" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
                </svg>
                Filteri
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#B89F5B] text-[#0E0E0E] text-[9px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active category chips (desktop) */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {activeCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateUrl({ categories: toggle(activeCategories, cat) })}
                  aria-label={`Ukloni filter: ${cat}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B89F5B]/15 border border-[#B89F5B]/40 text-[#B89F5B] text-xs tracking-wide transition-colors hover:bg-[#B89F5B]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
                >
                  {cat}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M2 2l8 8M10 2l-8 8" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="ml-auto shrink-0">
              <label htmlFor="sort-select" className="sr-only">Sortiraj proizvode</label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => updateUrl({ sort: e.target.value as SortKey })}
                  className="appearance-none bg-[#1A1A1A] text-[#F4F4F2]/70 text-xs uppercase tracking-[0.12em] px-4 py-2.5 pr-8 border border-[#F4F4F2]/15 outline-none cursor-pointer transition-colors hover:border-[#F4F4F2]/30 focus-visible:border-[#B89F5B] focus-visible:ring-1 focus-visible:ring-[#B89F5B]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F4F4F2]/40 pointer-events-none"
                  width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"
                >
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[#F4F4F2]/30 text-sm tracking-wide mb-4">Nema pronađenih proizvoda.</p>
              <button
                onClick={resetAll}
                className="text-[#B89F5B] text-xs uppercase tracking-[0.2em] border border-[#B89F5B]/40 px-5 py-2.5 hover:bg-[#B89F5B]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
              >
                Očisti filtere
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
              role="list"
              aria-label="Proizvodi"
            >
              {filtered.map((product) => (
                <div key={product.id} role="listitem">
                  <ShopProductCard product={product} onQuickView={openQuickView} />
                </div>
              ))}
            </div>
          )}

          {/* Load more */}
          {filtered.length > 0 && (
            <div className="flex justify-center mt-12 md:mt-16">
              <button className="group flex items-center gap-3 border border-[#F4F4F2]/15 px-8 py-4 text-xs uppercase tracking-[0.2em] text-[#F4F4F2]/50 transition-all duration-300 hover:border-[#B89F5B] hover:text-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]">
                Učitaj još
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                >
                  <path d="M7 2v10M3 8l4 4 4-4" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile filter drawer ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filteri"
        className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs flex-col bg-[#0E0E0E] border-r border-[#F4F4F2]/8 transition-transform duration-300 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#F4F4F2]/8 shrink-0">
          <span className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.2em]">Filteri</span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Zatvori filtere"
            className="flex items-center justify-center w-9 h-9 text-[#F4F4F2]/50 hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer body — uses pending state */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <FilterPanel
            categories={pendingCategories} setCategories={setPendingCategories}
            min={pendingMin} setMin={setPendingMin}
            max={pendingMax} setMax={setPendingMax}
            sizes={pendingSizes} setSizes={setPendingSizes}
            colors={pendingColors} setColors={setPendingColors}
          />
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-[#F4F4F2]/8 flex gap-3 shrink-0">
          <button
            onClick={resetDrawer}
            aria-label="Poništi filtere"
            className="flex-1 py-3.5 border border-[#F4F4F2]/15 text-[#F4F4F2]/55 text-xs uppercase tracking-[0.15em] transition-colors hover:border-[#F4F4F2]/30 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
          >
            Očisti
          </button>
          <button
            onClick={applyDrawer}
            className="flex-1 py-3.5 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
          >
            Primijeni
          </button>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewOpen}
        onClose={closeQuickView}
      />
    </div>
  );
}

/* ─── Shop product card ──────────────────────────────────────────────────────── */

function ShopProductCard({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col bg-[#1A1A1A] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
      aria-label={`${product.name} — ${product.priceKM} KM`}
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

        {/* Desktop hover buttons */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 hidden md:flex flex-col">
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            aria-label={`Brzi pregled — ${product.name}`}
            className="w-full py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] bg-[#1A1A1A]/95 text-[#F4F4F2]/70 hover:text-[#B89F5B] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-inset border-b border-[#F4F4F2]/8"
          >
            Brzi pregled
          </button>
          <button
            onClick={handleAdd}
            aria-label={`Dodaj ${product.name} u korpu`}
            className={`w-full py-3 text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-inset ${
              added ? "bg-[#B89F5B] text-[#0E0E0E]" : "bg-[#0E0E0E]/90 text-[#F4F4F2] hover:bg-[#B89F5B] hover:text-[#0E0E0E]"
            }`}
          >
            {added ? "Dodano ✓" : "Dodaj u korpu"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-1.5">
          <span className="text-[#F4F4F2] text-xs md:text-sm font-medium tracking-wide leading-snug line-clamp-2">
            {product.name}
          </span>
          <span className="shrink-0 text-[#F4F4F2] text-xs md:text-sm font-bold">
            {product.priceKM} <span className="text-[#B89F5B] text-[10px] font-normal">KM</span>
          </span>
        </div>

        {/* Mobile buttons */}
        <div className="md:hidden flex gap-2">
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            aria-label={`Brzi pregled — ${product.name}`}
            className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] border border-[#F4F4F2]/10 text-[#F4F4F2]/50 active:text-[#B89F5B] active:border-[#B89F5B] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] shrink-0"
          >
            &#x1F50D;
          </button>
          <button
            onClick={handleAdd}
            aria-label={`Dodaj ${product.name} u korpu`}
            className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
              added ? "bg-[#B89F5B] border-[#B89F5B] text-[#0E0E0E]" : "border-[#F4F4F2]/10 text-[#F4F4F2]/60 active:bg-[#B89F5B] active:border-[#B89F5B] active:text-[#0E0E0E]"
            }`}
          >
            {added ? "Dodano ✓" : "Dodaj u korpu"}
          </button>
        </div>
      </div>
    </Link>
  );
}
