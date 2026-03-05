"use client";

import { useEffect, useRef, useState } from "react";
import type { Size, Color } from "@/data/products";
import { formatPriceKM } from "@/lib/formatPrice";
import { copy } from "@/lib/copy";

interface StickyAddToCartBarProps {
  priceKM: number;
  selectedSize: Size | null;
  selectedColor: Color | null;
  quantity: number;
  onAddToCart: () => void;
  isEnabled: boolean;
  targetId: string;
}

export default function StickyAddToCartBar({
  priceKM,
  selectedSize,
  selectedColor,
  quantity: _quantity,
  onAddToCart,
  isEnabled,
  targetId,
}: StickyAddToCartBarProps) {
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = document.getElementById(targetId);
    if (!target) return;

    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -20px 0px" }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [targetId]);

  const handleClick = () => {
    onAddToCart();
    if (selectedSize && selectedColor) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const isShown = visible && isEnabled;

  if (reducedMotion.current) {
    if (!isShown) return null;
    return (
      <div
        role="region"
        aria-label="Brzo dodavanje u korpu"
        className="fixed inset-x-0 bottom-0 z-40 md:hidden bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#F4F4F2]/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <BarContent
          priceKM={priceKM}
          added={added}
          onAddToCart={handleClick}
          tabIndex={0}
        />
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Brzo dodavanje u korpu"
      aria-hidden={!isShown}
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#F4F4F2]/10 transition-transform duration-300 ease-out ${
        isShown ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <BarContent
        priceKM={priceKM}
        added={added}
        onAddToCart={handleClick}
        tabIndex={isShown ? 0 : -1}
      />
    </div>
  );
}

function BarContent({
  priceKM,
  added,
  onAddToCart,
  tabIndex,
}: {
  priceKM: number;
  added: boolean;
  onAddToCart: () => void;
  tabIndex: number;
}) {
  return (
    <div className="px-5 py-3 flex items-center gap-3">
      <span className="text-[#F4F4F2] text-sm font-bold shrink-0">
        {formatPriceKM(priceKM)}
      </span>
      <button
        onClick={onAddToCart}
        tabIndex={tabIndex}
        aria-label={added ? "Dodano u korpu" : copy.buttons.addToCart}
        className={`ml-auto shrink-0 px-6 py-3.5 min-h-[48px] text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] ${
          added
            ? "bg-[#B89F5B] text-[#0E0E0E]"
            : "bg-[#F4F4F2] text-[#0E0E0E] active:bg-[#B89F5B]"
        }`}
      >
        {added ? "Dodano ✓" : copy.buttons.addToCart}
      </button>
    </div>
  );
}
