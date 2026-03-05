"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { showToast } from "@/store/toastStore";
import { COLOR_MAP } from "@/data/products";
import type { Product, Size, Color } from "@/data/products";
import { formatPriceKM } from "@/lib/formatPrice";
import { copy } from "@/lib/copy";
import { trackAddToCart } from "@/lib/analytics";

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: Props) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [added, setAdded] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const desktopPanelRef = useRef<HTMLDivElement>(null);

  /* Reset state when product changes */
  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(null);
    setShowValidation(false);
    setAdded(false);
  }, [product?.slug]);

  /* Body scroll lock + initial focus */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const isMd = window.matchMedia("(min-width: 768px)").matches;
      const activePanel = (isMd ? desktopPanelRef : panelRef).current;
      activePanel?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* ESC */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  /* Focus trap */
  useEffect(() => {
    if (!isOpen) return;
    const isMd = window.matchMedia("(min-width: 768px)").matches;
    const activePanel = (isMd ? desktopPanelRef : panelRef).current;
    if (!activePanel) return;
    const focusable = activePanel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen]);

  const handleAdd = () => {
    if (!product || !selectedSize || !selectedColor) {
      setShowValidation(true);
      showToast("error", "Odaberite veličinu i boju.");
      return;
    }
    useCartStore.getState().addItem(
      {
        slug: product.slug,
        name: product.name,
        priceKM: product.priceKM,
        image: product.images[0] ?? product.image,
        size: selectedSize,
        color: selectedColor,
      },
      1
    );
    trackAddToCart(product, 1);
    setAdded(true);
    setShowValidation(false);
    showToast("success", copy.messages.addedToCart);
    onClose();
    useUiStore.getState().openCartDrawer();
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return null;

  const image = product.images?.[0] ?? product.image;

  return (
    /* Backdrop */
    <div
      aria-hidden={!isOpen}
      onClick={onClose}
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "bg-black/65 backdrop-blur-sm pointer-events-auto" : "bg-black/0 backdrop-blur-none pointer-events-none"
      }`}
    >
      {/* ── Mobile: bottom sheet ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        className={`md:hidden absolute inset-x-0 bottom-0 bg-[#1A1A1A] rounded-t-2xl max-h-[92dvh] flex flex-col transition-transform duration-350 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0" aria-hidden="true">
          <div className="w-10 h-1 bg-[#F4F4F2]/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[#F4F4F2] text-sm font-bold tracking-wide truncate max-w-[200px]">
              {product.name}
            </span>
            {product.badge && (
              <span className={`shrink-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
                product.badge === "Novo" ? "bg-[#B89F5B] text-[#0E0E0E]" : "bg-[#F4F4F2] text-[#0E0E0E]"
              }`}>
                {product.badge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Zatvori"
            className="w-8 h-8 flex items-center justify-center text-[#F4F4F2]/50 hover:text-[#F4F4F2] transition-colors shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
              <path d="M12 1L1 12M1 1l11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 pb-4 flex flex-col gap-5">
          {/* Image */}
          <div className="aspect-[3/2] overflow-hidden rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2.5">
            <span className="text-[#F4F4F2] text-xl font-bold">
              {formatPriceKM(product.priceKM)}
            </span>
            {product.compareAtKM && (
              <span className="text-[#F4F4F2]/30 text-sm line-through">{formatPriceKM(product.compareAtKM)}</span>
            )}
          </div>

          {/* Color */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[#F4F4F2] text-[10px] font-bold uppercase tracking-[0.18em]">Boja</span>
              {selectedColor && <span className="text-[#F4F4F2]/45 text-[10px] tracking-wide">{selectedColor}</span>}
            </div>
            <div className="flex gap-3" role="group" aria-label="Odaberi boju">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => { setSelectedColor(color); setShowValidation(false); }}
                  aria-pressed={selectedColor === color}
                  aria-label={color}
                  title={color}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] ${
                    selectedColor === color ? "border-[#B89F5B] scale-110" : "border-[#F4F4F2]/20 hover:border-[#F4F4F2]/50"
                  }`}
                  style={{ backgroundColor: COLOR_MAP[color] }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <span className="block text-[#F4F4F2] text-[10px] font-bold uppercase tracking-[0.18em] mb-2.5">
              Veličina
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Odaberi veličinu">
              {(["S", "M", "L", "XL"] as Size[]).map((size) => {
                const available = product.sizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => { if (available) { setSelectedSize(size); setShowValidation(false); } }}
                    aria-pressed={selectedSize === size}
                    disabled={!available}
                    className={`relative w-14 h-10 text-xs font-semibold uppercase tracking-wider border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
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

          {/* Validation */}
          {showValidation && (
            <p role="alert" className="text-red-400/80 text-xs tracking-wide -mt-1">
              Odaberite veličinu i boju.
            </p>
          )}

          {/* Trust */}
          <p className="text-[#F4F4F2]/25 text-[10px] tracking-wide">
            Dostava 1–3 dana • Povrat 14 dana
          </p>
        </div>

        {/* Sticky CTA */}
        <div className="shrink-0 px-5 py-4 border-t border-[#F4F4F2]/8 flex flex-col gap-2.5">
          <button
            onClick={handleAdd}
            className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
              added ? "bg-[#B89F5B] text-[#0E0E0E]" : "bg-[#F4F4F2] text-[#0E0E0E] hover:bg-[#B89F5B]"
            }`}
          >
            {added ? "Dodano u korpu ✓" : copy.buttons.addToCart}
          </button>
          <Link
            href={`/product/${product.slug}`}
            onClick={onClose}
            className="block w-full py-3 text-center text-[#F4F4F2]/50 text-xs tracking-wide hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:text-[#B89F5B]"
          >
            Pogledaj detalje →
          </Link>
        </div>
      </div>

      {/* ── Desktop: centered modal ── */}
      <div
        className={`hidden md:flex absolute inset-0 items-center justify-center p-6 transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          ref={desktopPanelRef}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#1A1A1A] w-full max-w-[900px] max-h-[85vh] flex overflow-hidden transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Left: image */}
          <div className="w-[42%] shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Right: info */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-8 pt-7 pb-5 border-b border-[#F4F4F2]/8 shrink-0">
              <div>
                <p className="text-[#B89F5B] text-[10px] tracking-[0.2em] uppercase font-medium mb-1">
                  {product.category}
                </p>
                <h2 className="text-[#F4F4F2] text-xl font-bold uppercase tracking-wider leading-snug">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2.5 mt-3">
                  <span className="text-[#F4F4F2] text-xl font-bold">
                    {formatPriceKM(product.priceKM)}
                  </span>
                  {product.compareAtKM && (
                    <span className="text-[#F4F4F2]/30 text-sm line-through">{formatPriceKM(product.compareAtKM)}</span>
                  )}
                  {product.badge && (
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
                      product.badge === "Novo" ? "bg-[#B89F5B] text-[#0E0E0E]" : "bg-[#F4F4F2] text-[#0E0E0E]"
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Zatvori"
                className="w-8 h-8 flex items-center justify-center text-[#F4F4F2]/50 hover:text-[#F4F4F2] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                  <path d="M12 1L1 12M1 1l11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </button>
            </div>

            {/* Scrollable selectors */}
            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
              {/* Color */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#F4F4F2] text-[10px] font-bold uppercase tracking-[0.18em]">Boja</span>
                  {selectedColor && <span className="text-[#F4F4F2]/45 text-[10px] tracking-wide">{selectedColor}</span>}
                </div>
                <div className="flex gap-3" role="group" aria-label="Odaberi boju">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setShowValidation(false); }}
                      aria-pressed={selectedColor === color}
                      aria-label={color}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] ${
                        selectedColor === color ? "border-[#B89F5B] scale-110" : "border-[#F4F4F2]/20 hover:border-[#F4F4F2]/50"
                      }`}
                      style={{ backgroundColor: COLOR_MAP[color] }}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <span className="block text-[#F4F4F2] text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
                  Veličina
                </span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Odaberi veličinu">
                  {(["S", "M", "L", "XL"] as Size[]).map((size) => {
                    const available = product.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => { if (available) { setSelectedSize(size); setShowValidation(false); } }}
                        aria-pressed={selectedSize === size}
                        disabled={!available}
                        className={`relative w-14 h-10 text-xs font-semibold uppercase tracking-wider border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
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

              {/* Validation */}
              {showValidation && (
                <p role="alert" className="text-red-400/80 text-xs tracking-wide -mt-2">
                  Odaberite veličinu i boju.
                </p>
              )}

              {/* Trust */}
              <p className="text-[#F4F4F2]/25 text-[10px] tracking-wide">
                Dostava 1–3 dana • Povrat 14 dana
              </p>
            </div>

            {/* Footer CTAs */}
            <div className="shrink-0 px-8 py-5 border-t border-[#F4F4F2]/8 flex flex-col gap-2.5">
              <button
                onClick={handleAdd}
                className={`w-full py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] ${
                  added ? "bg-[#B89F5B] text-[#0E0E0E]" : "bg-[#F4F4F2] text-[#0E0E0E] hover:bg-[#B89F5B]"
                }`}
              >
                {added ? "Dodano u korpu ✓" : copy.buttons.addToCart}
              </button>
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="block w-full py-2.5 text-center text-[#F4F4F2]/45 text-xs tracking-wide hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:text-[#B89F5B]"
              >
                Pogledaj detalje →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
