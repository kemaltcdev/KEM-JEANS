"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { PRODUCTS, COLOR_MAP } from "@/data/products";
import type { Size, Color, Product } from "@/data/products";
import SizeGuideModal from "@/components/SizeGuideModal";
import { useUiStore } from "@/store/uiStore";
import Breadcrumbs from "@/components/Breadcrumbs";
import FullscreenGallery from "@/components/FullscreenGallery";
import RecentlyViewed from "@/components/RecentlyViewed";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import { showToast } from "@/store/toastStore";

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug) ?? PRODUCTS[0];
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 8);

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlisted = wishlistItems.some((i) => i.slug === product.slug);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const ctaRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  /* Track recently viewed */
  useEffect(() => {
    useRecentlyViewedStore.persist.rehydrate();
    useRecentlyViewedStore.getState().addViewed({
      id: product.id,
      slug: product.slug,
      name: product.name,
      priceKM: product.priceKM,
      category: product.category,
      badge: product.badge,
      image: product.images[0] ?? product.image,
    });
  }, [product.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sticky bar via IntersectionObserver */
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const obs = new IntersectionObserver(
      ([e]) => setShowStickyBar(!e.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -20px 0px" }
    );
    obs.observe(cta);
    return () => obs.disconnect();
  }, []);

  /* Sync gallery scroll to activeImage */
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * activeImage, behavior: "smooth" });
  }, [activeImage]);

  /* Track scroll inside gallery to update dots */
  const onGalleryScroll = () => {
    const el = galleryRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveImage(idx);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setShowValidation(true);
      showToast("error", "Odaberite veličinu i boju.");
      return;
    }
    useCartStore.getState().addItem(
      {
        slug: product.slug,
        name: product.name,
        priceKM: product.priceKM,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
      },
      qty
    );
    setAdded(true);
    setShowValidation(false);
    setQty(1);
    showToast("success", "Dodano u korpu.");
    useUiStore.getState().openCartDrawer();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      {/* ── Main product section ── */}
      <main className="pt-16 md:pt-20">
        <div className="md:flex md:gap-0 md:min-h-[85vh]">

          {/* ── Left: Image gallery ── */}
          <section
            aria-label="Slike proizvoda"
            className="md:w-[55%] lg:w-[60%] md:sticky md:top-16 md:self-start"
          >
            {/* Mobile: scroll snap gallery */}
            <div className="relative md:hidden">
              <div
                ref={galleryRef}
                onScroll={onGalleryScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: "none" }}
                role="group"
                aria-label="Galerija slika"
              >
                {product.images.map((src, i) => (
                  <div
                    key={i}
                    className="snap-start shrink-0 w-full aspect-[4/5] cursor-pointer"
                    onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${product.name} — slika ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>

              {/* Dots */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`Slika ${i + 1}`}
                      className={`block rounded-full transition-all duration-300 ${
                        i === activeImage ? "w-5 h-1.5 bg-[#F4F4F2]" : "w-1.5 h-1.5 bg-[#F4F4F2]/35"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: main + thumbnails */}
            <div className="hidden md:flex gap-3 p-4 lg:p-6 h-full">
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex flex-col gap-2 w-16 shrink-0">
                  {product.images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`Prikaži sliku ${i + 1}`}
                      className={`relative aspect-square overflow-hidden border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
                        i === activeImage ? "border-[#B89F5B]" : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div
                className="flex-1 overflow-hidden group cursor-zoom-in"
                onClick={() => { setGalleryIndex(activeImage); setGalleryOpen(true); }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[activeImage]}
                  alt={`${product.name} — slika ${activeImage + 1}`}
                  className="w-full h-full object-cover aspect-[3/4] transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </section>

          {/* ── Right: Product info ── */}
          <section
            aria-label="Detalji proizvoda"
            className="md:w-[45%] lg:w-[40%] md:border-l md:border-[#F4F4F2]/8 md:overflow-y-auto"
          >
            <div className="px-5 py-7 md:px-8 md:py-10 lg:px-10 flex flex-col gap-6">

              {/* Breadcrumb */}
              <Breadcrumbs
                items={[
                  { label: "Početna", href: "/" },
                  { label: "Shop", href: "/shop" },
                  { label: product.category, href: `/shop?category=${product.category.toLowerCase()}` },
                  { label: product.name },
                ]}
              />

              {/* Name + price */}
              <div>
                <p className="text-[#B89F5B] text-xs tracking-[0.2em] uppercase font-medium mb-2">
                  {product.category}
                </p>
                <h1 className="text-[#F4F4F2] text-2xl md:text-3xl font-bold uppercase tracking-wider leading-tight mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="text-[#F4F4F2] text-2xl font-bold">
                    {product.priceKM}{" "}
                    <span className="text-[#B89F5B] text-sm font-normal">KM</span>
                  </span>
                  {product.compareAtKM && (
                    <span className="text-[#F4F4F2]/30 text-base line-through">
                      {product.compareAtKM} KM
                    </span>
                  )}
                  {product.compareAtKM && (
                    <span className="bg-[#B89F5B]/15 text-[#B89F5B] text-[10px] uppercase tracking-[0.15em] font-bold px-2 py-0.5">
                      -{Math.round((1 - product.priceKM / product.compareAtKM) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[#F4F4F2]/55 text-sm font-light leading-relaxed tracking-wide border-t border-[#F4F4F2]/8 pt-5">
                {product.description}
              </p>

              {/* Color selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.18em]">
                    Boja
                  </span>
                  {selectedColor && (
                    <span className="text-[#F4F4F2]/50 text-xs tracking-wide">{selectedColor}</span>
                  )}
                </div>
                <div className="flex gap-3" role="group" aria-label="Odaberi boju">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setShowValidation(false); }}
                      aria-pressed={selectedColor === color}
                      aria-label={color}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] ${
                        selectedColor === color ? "border-[#B89F5B] scale-110" : "border-[#F4F4F2]/20 hover:border-[#F4F4F2]/50"
                      }`}
                      style={{ backgroundColor: COLOR_MAP[color] }}
                    />
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.18em]">
                    Veličina
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[#B89F5B] text-xs tracking-wide hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89F5B]"
                  >
                    Vodič za veličine
                  </button>
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Odaberi veličinu">
                  {(["S", "M", "L", "XL"] as Size[]).map((size) => {
                    const available = product.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => { if (available) { setSelectedSize(size); setShowValidation(false); } }}
                        aria-pressed={selectedSize === size}
                        aria-disabled={!available}
                        disabled={!available}
                        className={`relative w-14 h-11 text-xs font-semibold uppercase tracking-wider border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
                          !available
                            ? "border-[#F4F4F2]/8 text-[#F4F4F2]/20 cursor-not-allowed"
                            : selectedSize === size
                            ? "border-[#B89F5B] bg-[#B89F5B]/15 text-[#B89F5B]"
                            : "border-[#F4F4F2]/20 text-[#F4F4F2]/60 hover:border-[#F4F4F2]/50 hover:text-[#F4F4F2]"
                        }`}
                      >
                        {size}
                        {!available && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="absolute w-full h-px bg-[#F4F4F2]/15 rotate-45" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <span className="block text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.18em] mb-3">
                  Količina
                </span>
                <div className="flex items-center gap-0 w-fit border border-[#F4F4F2]/15">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Smanji količinu"
                    disabled={qty <= 1}
                    className="w-11 h-11 flex items-center justify-center text-[#F4F4F2]/60 transition-colors hover:text-[#F4F4F2] hover:bg-[#F4F4F2]/5 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B89F5B]"
                  >
                    <svg width="14" height="2" viewBox="0 0 14 2" fill="currentColor" aria-hidden="true"><rect width="14" height="2" rx="1"/></svg>
                  </button>
                  <span
                    className="w-11 h-11 flex items-center justify-center text-[#F4F4F2] text-sm font-semibold border-x border-[#F4F4F2]/15"
                    aria-live="polite"
                    aria-label={`Količina: ${qty}`}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    aria-label="Povećaj količinu"
                    disabled={qty >= 10}
                    className="w-11 h-11 flex items-center justify-center text-[#F4F4F2]/60 transition-colors hover:text-[#F4F4F2] hover:bg-[#F4F4F2]/5 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B89F5B]"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                      <rect x="6" width="2" height="14" rx="1"/><rect y="6" width="14" height="2" rx="1"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Validation */}
              {showValidation && (
                <p role="alert" className="text-red-400/80 text-xs tracking-wide -mt-2">
                  Odaberite veličinu i boju.
                </p>
              )}

              {/* CTAs */}
              <div ref={ctaRef} className="flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  aria-disabled={added}
                  className={`w-full py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] ${
                    added
                      ? "bg-[#B89F5B] text-[#0E0E0E]"
                      : "bg-[#F4F4F2] text-[#0E0E0E] hover:bg-[#B89F5B]"
                  }`}
                >
                  {added ? "Dodano u korpu ✓" : "Dodaj u korpu"}
                </button>

                <button
                  onClick={() => {
                    useWishlistStore.getState().toggleItem({
                      slug: product.slug,
                      name: product.name,
                      priceKM: product.priceKM,
                      image: product.images[0],
                    });
                    showToast("info", wishlisted ? "Uklonjeno iz liste želja." : "Dodano u listu želja.");
                  }}
                  aria-pressed={wishlisted}
                  aria-label={wishlisted ? "Ukloni iz liste želja" : "Dodaj u listu želja"}
                  className="w-full py-3.5 border border-[#F4F4F2]/15 text-[#F4F4F2]/60 text-sm font-medium tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 hover:border-[#F4F4F2]/35 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
                >
                  <svg
                    width="16" height="16" viewBox="0 0 24 24"
                    fill={wishlisted ? "#B89F5B" : "none"}
                    stroke={wishlisted ? "#B89F5B" : "currentColor"}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                    className="transition-all duration-300"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {wishlisted ? "Ukloni iz liste želja" : "Dodaj u listu želja"}
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-col gap-3 border-t border-[#F4F4F2]/8 pt-5">
                {[
                  {
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                    text: "Dostava 1–3 radna dana",
                  },
                  {
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
                    text: "Povrat u roku 14 dana",
                  },
                  {
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
                    text: "Plaćanje pouzećem ili karticom",
                  },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="text-[#B89F5B] shrink-0">{icon}</span>
                    <span className="text-[#F4F4F2]/45 text-xs tracking-wide">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="border-t border-[#F4F4F2]/8 py-14 md:py-20">
            <div className="px-5 md:px-10 lg:px-16 mb-8 md:mb-10">
              <p className="text-[#B89F5B] text-[10px] tracking-[0.25em] uppercase font-medium mb-2">
                — {product.category}
              </p>
              <h2 id="related-heading" className="text-[#F4F4F2] text-2xl md:text-3xl font-bold uppercase tracking-widest">
                Možda će vam se svidjeti
              </h2>
            </div>

            {/* Mobile: swipe carousel */}
            <div className="md:hidden">
              <div
                className="flex gap-3 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
                style={{ scrollbarWidth: "none" }}
                role="list"
                aria-label="Slični proizvodi"
              >
                {related.map((p) => (
                  <div key={p.slug} className="snap-start shrink-0 w-[75vw] max-w-[260px]" role="listitem">
                    <RelatedCard product={p} />
                  </div>
                ))}
                <div className="shrink-0 w-5" aria-hidden="true" />
              </div>
            </div>

            {/* Desktop: 4-column grid */}
            <div
              className="hidden md:grid md:grid-cols-4 gap-4 px-10 lg:px-16"
              role="list"
              aria-label="Slični proizvodi"
            >
              {related.map((p) => (
                <div key={p.slug} role="listitem">
                  <RelatedCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        <RecentlyViewed currentSlug={product.slug} />
      </main>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <FullscreenGallery
        images={product.images}
        initialIndex={galleryIndex}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />

      {/* ── Sticky mobile bottom bar ── */}
      <div
        aria-hidden={!showStickyBar}
        className={`fixed inset-x-0 bottom-0 z-40 md:hidden bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#F4F4F2]/10 px-5 py-3 flex items-center gap-3 transition-transform duration-300 ease-out ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col min-w-0">
          <span className="text-[#F4F4F2] text-xs font-medium tracking-wide truncate">{product.name}</span>
          <span className="text-[#F4F4F2] text-sm font-bold">
            {product.priceKM} <span className="text-[#B89F5B] text-xs font-normal">KM</span>
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          tabIndex={showStickyBar ? 0 : -1}
          className={`ml-auto shrink-0 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
            added ? "bg-[#B89F5B] text-[#0E0E0E]" : "bg-[#F4F4F2] text-[#0E0E0E] active:bg-[#B89F5B]"
          }`}
        >
          {added ? "Dodano ✓" : "Dodaj u korpu"}
        </button>
      </div>
    </div>
  );
}

/* ─── Related card ───────────────────────────────────────────────────────────── */

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden bg-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
      aria-label={`${product.name} — ${product.priceKM} KM`}
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={`${product.name} – KEM JEANS`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {product.badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
            product.badge === "Novo" ? "bg-[#B89F5B] text-[#0E0E0E]" : "bg-[#F4F4F2] text-[#0E0E0E]"
          }`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="relative text-[#F4F4F2] text-xs font-medium tracking-wide truncate mb-1 w-fit max-w-full">
          {product.name}
          <span className="absolute bottom-0 left-0 h-px w-0 bg-[#B89F5B] transition-all duration-300 group-hover:w-full" aria-hidden="true" />
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-[#F4F4F2] text-xs font-bold">
            {product.priceKM} <span className="text-[#B89F5B] font-normal">KM</span>
          </span>
          {product.compareAtKM && (
            <span className="text-[#F4F4F2]/30 text-[10px] line-through">{product.compareAtKM} KM</span>
          )}
        </div>
      </div>
    </Link>
  );
}
