"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCartStore, selectItemsCount } from "@/store/cartStore";
import { useWishlistStore, selectWishlistCount } from "@/store/wishlistStore";
import { useUiStore } from "@/store/uiStore";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/data/products";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Novi artikli", href: "/shop?sort=new" },
  { label: "Najprodavanije", href: "/shop?sort=best" },
];

const drawerLinks = [
  { label: "Početna", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Novi artikli", href: "/shop?sort=new" },
  { label: "Najprodavanije", href: "/shop?sort=best" },
  { label: "Dostava i plaćanje", href: "/dostava" },
  { label: "Povrat i zamjena", href: "/povrat" },
  { label: "Kontakt", href: "/kontakt" },
];

/* ── Suggestions Dropdown ────────────────────────────────────────────────────── */

function SuggestionsDropdown({
  suggestions,
  activeIndex,
  listboxId,
  onHover,
  onSelect,
  onSeeAll,
  className = "",
}: {
  suggestions: Product[];
  activeIndex: number;
  listboxId: string;
  onHover: (i: number) => void;
  onSelect: (slug: string) => void;
  onSeeAll: () => void;
  className?: string;
}) {
  return (
    <div
      id={listboxId}
      role="listbox"
      aria-label="Prijedlozi pretrage"
      className={`bg-[#0D0D0D]/98 backdrop-blur-md border border-[#F4F4F2]/10 shadow-2xl overflow-hidden ${className}`}
    >
      {suggestions.length === 0 ? (
        <p className="px-4 py-3.5 text-[#F4F4F2]/35 text-xs tracking-wide">
          Nema rezultata.
        </p>
      ) : (
        <>
          <ul>
            {suggestions.map((product, i) => (
              <li
                key={product.slug}
                id={`${listboxId}-${i}`}
                role="option"
                aria-selected={activeIndex === i}
                onMouseEnter={() => onHover(i)}
                onMouseDown={(e) => { e.preventDefault(); onSelect(product.slug); }}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer select-none transition-colors duration-100 border-l-2 ${
                  activeIndex === i
                    ? "bg-[#1A1A1A] border-[#B89F5B]"
                    : "border-transparent hover:bg-[#161616]"
                }`}
              >
                {/* Thumbnail */}
                <div className="w-9 h-11 shrink-0 overflow-hidden bg-[#1A1A1A]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[#F4F4F2] text-xs font-medium tracking-wide truncate leading-snug">
                    {product.name}
                  </p>
                  <p className="text-[#F4F4F2]/35 text-[10px] tracking-[0.12em] uppercase mt-0.5">
                    {product.category}
                  </p>
                </div>

                {/* Price */}
                <p className="shrink-0 text-[#F4F4F2] text-xs font-bold tabular-nums">
                  {product.priceKM}{" "}
                  <span className="text-[#B89F5B] text-[10px] font-normal">KM</span>
                </p>
              </li>
            ))}
          </ul>

          {/* See all */}
          <div
            id={`${listboxId}-${suggestions.length}`}
            role="option"
            aria-selected={activeIndex === suggestions.length}
            onMouseEnter={() => onHover(suggestions.length)}
            onMouseDown={(e) => { e.preventDefault(); onSeeAll(); }}
            className={`flex items-center justify-between px-3 py-2.5 border-t border-[#F4F4F2]/8 cursor-pointer select-none transition-colors duration-100 ${
              activeIndex === suggestions.length ? "bg-[#1A1A1A]" : "hover:bg-[#161616]"
            }`}
          >
            <span className="text-[#B89F5B] text-[10px] uppercase tracking-[0.2em] font-medium">
              Pogledaj sve rezultate
            </span>
            <svg
              width="11" height="11" viewBox="0 0 16 16"
              fill="none" stroke="#B89F5B" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Navbar ──────────────────────────────────────────────────────────────────── */

export default function Navbar() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  /* ── Suggestions ── */
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);

  /* Debounce query */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchValue), 200);
    return () => clearTimeout(t);
  }, [searchValue]);

  /* Filter suggestions */
  const suggestions = useMemo(() => {
    if (debouncedQuery.length < 2) return [];
    const q = debouncedQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [debouncedQuery]);

  const showSuggestions = suggestionsOpen && debouncedQuery.length >= 2;

  /* Open/reset when debounced query changes */
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setSuggestionsOpen(true);
      setActiveIndex(-1);
    } else {
      setSuggestionsOpen(false);
    }
  }, [debouncedQuery]);

  /* Close suggestions on desktop click-outside */
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouse);
    return () => document.removeEventListener("mousedown", onMouse);
  }, []);

  /* Arrow key + enter navigation through suggestions */
  const handleSuggestionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    const total = suggestions.length + 1; // +1 for "see all" row
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      if (activeIndex < suggestions.length) {
        navigateTo(`/product/${suggestions[activeIndex].slug}`);
      } else {
        navigateTo(`/pretraga?q=${encodeURIComponent(searchValue.trim())}`);
      }
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
    }
  };

  const navigateTo = (href: string) => {
    router.push(href);
    setSuggestionsOpen(false);
    setSearchValue("");
    setSearchOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    navigateTo(`/pretraga?q=${encodeURIComponent(q)}`);
  };

  const onSeeAll = () =>
    navigateTo(`/pretraga?q=${encodeURIComponent(searchValue.trim())}`);

  /* ── Store hydration ── */
  useEffect(() => {
    useCartStore.persist.rehydrate();
    setCartCount(useCartStore.getState().items.reduce((s, i) => s + i.quantity, 0));
    useWishlistStore.persist.rehydrate();
    setWishlistCount(selectWishlistCount(useWishlistStore.getState()));
    const unsubCart = useCartStore.subscribe((state) => setCartCount(selectItemsCount(state)));
    const unsubWishlist = useWishlistStore.subscribe((state) => setWishlistCount(selectWishlistCount(state)));
    return () => { unsubCart(); unsubWishlist(); };
  }, []);

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  /* Focus close button when drawer opens */
  useEffect(() => {
    if (drawerOpen) closeButtonRef.current?.focus();
  }, [drawerOpen]);

  /* Focus search input when search opens */
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  /* ESC closes suggestions first, then drawer/search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (suggestionsOpen) { setSuggestionsOpen(false); return; }
        if (drawerOpen) { setDrawerOpen(false); hamburgerRef.current?.focus(); }
        if (searchOpen) setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, searchOpen, suggestionsOpen]);

  /* Focus trap inside drawer */
  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button, input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    drawer.addEventListener("keydown", trap);
    return () => drawer.removeEventListener("keydown", trap);
  }, [drawerOpen]);

  const closeDrawer = () => { setDrawerOpen(false); hamburgerRef.current?.focus(); };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0E0E0E]/95 backdrop-blur-md border-b border-[#F4F4F2]/8 py-3"
            : "bg-[#0E0E0E]/80 backdrop-blur-sm border-b border-[#F4F4F2]/5 py-4"
        }`}
      >
        <div className="px-5 md:px-10 lg:px-16 flex items-center justify-between gap-4">

          {/* Left: Hamburger (mobile) */}
          <button
            ref={hamburgerRef}
            onClick={() => setDrawerOpen(true)}
            aria-label="Otvori meni"
            aria-expanded={drawerOpen}
            aria-controls="drawer-nav"
            className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 -ml-1 text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
          >
            <span className="block h-px w-5 bg-current transition-all duration-300" />
            <span className="block h-px w-4 bg-current transition-all duration-300" />
            <span className="block h-px w-5 bg-current transition-all duration-300" />
          </button>

          {/* Brand */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0 text-[#F4F4F2] text-base md:text-lg font-bold uppercase tracking-[0.3em] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
            aria-label="KEM JEANS — početna stranica"
          >
            KEM JEANS
          </Link>

          {/* Desktop: search with suggestions */}
          <form onSubmit={handleSearch} role="search" className="hidden md:flex flex-1 justify-center px-8">
            <div ref={desktopSearchRef} className="relative w-full max-w-xs">
              <label htmlFor="desktop-search" className="sr-only">Pretraži</label>
              <input
                id="desktop-search"
                type="text"
                role="combobox"
                aria-expanded={showSuggestions}
                aria-controls="desktop-search-listbox"
                aria-activedescendant={
                  activeIndex >= 0 ? `desktop-search-listbox-${activeIndex}` : undefined
                }
                aria-autocomplete="list"
                placeholder="Pretraži…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSuggestionKeyDown}
                onFocus={() => { if (debouncedQuery.length >= 2) setSuggestionsOpen(true); }}
                autoComplete="off"
                className="w-full bg-[#1A1A1A] text-[#F4F4F2] placeholder-[#F4F4F2]/30 text-xs tracking-wide px-4 py-2.5 pr-16 border border-[#F4F4F2]/8 outline-none transition-all duration-300 focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B]"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => { setSearchValue(""); setSuggestionsOpen(false); }}
                  aria-label="Obriši pretragu"
                  className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 text-[#F4F4F2]/40 hover:text-[#F4F4F2]/70 transition-colors focus-visible:outline-none"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                aria-label="Pretraži"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 text-[#F4F4F2]/30 hover:text-[#F4F4F2]/60 transition-colors focus-visible:outline-none"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              {/* Desktop dropdown */}
              {showSuggestions && (
                <SuggestionsDropdown
                  suggestions={suggestions}
                  activeIndex={activeIndex}
                  listboxId="desktop-search-listbox"
                  onHover={setActiveIndex}
                  onSelect={(slug) => navigateTo(`/product/${slug}`)}
                  onSeeAll={onSeeAll}
                  className="absolute top-full left-0 right-0 mt-1.5 z-[60]"
                />
              )}
            </div>
          </form>

          {/* Desktop nav links */}
          <nav aria-label="Glavna navigacija" className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:text-[#B89F5B]"
              >
                {link.label}
                <span
                  className="absolute -bottom-px left-0 h-px w-0 bg-[#B89F5B] transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Mobile search toggle */}
            <button
              onClick={() => {
                const next = !searchOpen;
                setSearchOpen(next);
                if (!next) { setSuggestionsOpen(false); setSearchValue(""); }
              }}
              aria-label={searchOpen ? "Zatvori pretragu" : "Otvori pretragu"}
              aria-expanded={searchOpen}
              className="md:hidden flex items-center justify-center w-10 h-10 text-[#F4F4F2]/70 transition-colors duration-300 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
            >
              {searchOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              )}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Lista želja — ${wishlistCount} stavke`}
              className="relative flex items-center justify-center w-10 h-10 text-[#F4F4F2]/70 transition-colors duration-300 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B89F5B] text-[#0E0E0E] text-[9px] font-bold leading-none"
                  aria-hidden="true"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => useUiStore.getState().toggleCartDrawer()}
              aria-label={`Korpa — ${cartCount} stavke`}
              className="relative flex items-center justify-center w-10 h-10 text-[#F4F4F2]/70 transition-colors duration-300 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B89F5B] text-[#0E0E0E] text-[9px] font-bold leading-none"
                  aria-hidden="true"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search area — outer wrapper has no overflow:hidden so the dropdown extends freely */}
        <div className="md:hidden">
          {/* Animated form wrapper */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              searchOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
            }`}
            aria-hidden={!searchOpen}
          >
            <form onSubmit={handleSearch} role="search" className="px-5 pb-3 pt-1">
              <label htmlFor="mobile-search" className="sr-only">Pretraži</label>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  id="mobile-search"
                  type="text"
                  role="combobox"
                  aria-expanded={showSuggestions && searchOpen}
                  aria-controls="mobile-search-listbox"
                  aria-activedescendant={
                    activeIndex >= 0 ? `mobile-search-listbox-${activeIndex}` : undefined
                  }
                  aria-autocomplete="list"
                  placeholder="Pretraži…"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSuggestionKeyDown}
                  tabIndex={searchOpen ? 0 : -1}
                  autoComplete="off"
                  className="w-full bg-[#1A1A1A] text-[#F4F4F2] placeholder-[#F4F4F2]/30 text-sm tracking-wide px-4 py-3 pr-20 border border-[#F4F4F2]/8 outline-none transition-all duration-300 focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B]"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => { setSearchValue(""); setSuggestionsOpen(false); }}
                    tabIndex={searchOpen ? 0 : -1}
                    aria-label="Obriši pretragu"
                    className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 text-[#F4F4F2]/40 hover:text-[#F4F4F2]/70 transition-colors focus-visible:outline-none"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  tabIndex={searchOpen ? 0 : -1}
                  aria-label="Pretraži"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 text-[#F4F4F2]/30 hover:text-[#F4F4F2]/60 transition-colors focus-visible:outline-none"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Mobile dropdown — rendered as sibling, not inside overflow:hidden */}
          {showSuggestions && searchOpen && (
            <SuggestionsDropdown
              suggestions={suggestions}
              activeIndex={activeIndex}
              listboxId="mobile-search-listbox"
              onHover={setActiveIndex}
              onSelect={(slug) => navigateTo(`/product/${slug}`)}
              onSeeAll={onSeeAll}
              className="mx-5 mb-2"
            />
          )}
        </div>
      </header>

      {/* ── Drawer overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Drawer ── */}
      <div
        id="drawer-nav"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigacijski meni"
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-[#0E0E0E] border-l border-[#F4F4F2]/8 transition-transform duration-300 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F4F4F2]/8">
          <span className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.25em]">
            Meni
          </span>
          <button
            ref={closeButtonRef}
            onClick={closeDrawer}
            aria-label="Zatvori meni"
            className="flex items-center justify-center w-9 h-9 text-[#F4F4F2]/60 transition-colors duration-300 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer links */}
        <nav aria-label="Drawer navigacija" className="flex-1 overflow-y-auto py-4">
          <ul role="list">
            {drawerLinks.map((link, i) => (
              <li key={link.href}>
                {i === 4 && (
                  <div className="mx-6 my-3 border-t border-[#F4F4F2]/8" aria-hidden="true" />
                )}
                <Link
                  href={link.href}
                  onClick={closeDrawer}
                  className="group flex items-center justify-between px-6 py-3.5 text-sm font-medium tracking-wide text-[#F4F4F2]/60 transition-colors duration-200 hover:text-[#F4F4F2] hover:bg-[#1A1A1A] focus-visible:outline-none focus-visible:bg-[#1A1A1A] focus-visible:text-[#B89F5B]"
                >
                  {link.label}
                  <svg
                    width="14" height="14" viewBox="0 0 16 16" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                    className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-[#B89F5B]"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer footer */}
        <div className="px-6 py-5 border-t border-[#F4F4F2]/8">
          <p className="text-[#F4F4F2]/20 text-xs tracking-widest uppercase">
            KEM JEANS
          </p>
        </div>
      </div>
    </>
  );
}
