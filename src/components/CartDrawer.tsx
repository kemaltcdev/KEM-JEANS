"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUiStore } from "@/store/uiStore";
import {
  useCartStore,
  selectSubtotal,
  selectShipping,
  selectTotal,
  type CartItem,
} from "@/store/cartStore";
import FreeShippingProgress from "@/components/FreeShippingProgress";

const PREVIEW_LIMIT = 3;

export default function CartDrawer() {
  const isOpen = useUiStore((s) => s.isCartDrawerOpen);
  const { closeCartDrawer } = useUiStore();

  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* SSR-safe hydration */
  useEffect(() => {
    useCartStore.persist.rehydrate();
    const sync = () => {
      const s = useCartStore.getState();
      setItems(s.items);
      setSubtotal(selectSubtotal(s));
      setShipping(selectShipping(s));
      setTotal(selectTotal(s));
    };
    sync();
    return useCartStore.subscribe(sync);
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* ESC */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCartDrawer(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCartDrawer]);

  /* Focus trap */
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
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

  const previewItems = items.slice(0, PREVIEW_LIMIT);
  const hasMore = items.length > PREVIEW_LIMIT;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeCartDrawer}
        className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Mobile: bottom sheet ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Korpa"
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 bg-[#0E0E0E] rounded-t-2xl max-h-[92dvh] flex flex-col border-t border-[#F4F4F2]/8 transition-transform duration-350 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0" aria-hidden="true">
          <div className="w-10 h-1 bg-[#F4F4F2]/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F4F4F2]/8 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">Korpa</h2>
            {items.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B89F5B] text-[#0E0E0E] text-[9px] font-bold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            ref={closeRef}
            onClick={closeCartDrawer}
            aria-label="Zatvori korpu"
            className="w-8 h-8 flex items-center justify-center text-[#F4F4F2]/50 hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
              <path d="M12 1L1 12M1 1l11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState onClose={closeCartDrawer} />
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-5 py-3 bg-[#1A1A1A] border-b border-[#F4F4F2]/8 shrink-0">
              <FreeShippingProgress subtotalKM={subtotal} />
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {previewItems.map((item) => (
                <CartItemRow key={`${item.slug}-${item.size}-${item.color}`} item={item} />
              ))}
              {hasMore && (
                <Link
                  href="/cart"
                  onClick={closeCartDrawer}
                  className="text-[#B89F5B] text-xs tracking-wide hover:underline focus-visible:outline-none focus-visible:text-[#F4F4F2]"
                >
                  + još {items.length - PREVIEW_LIMIT} artikla — pogledaj sve →
                </Link>
              )}
            </div>

            {/* Summary + CTA */}
            <div className="shrink-0 border-t border-[#F4F4F2]/8 px-5 py-5 flex flex-col gap-3">
              <SummaryRows subtotal={subtotal} shipping={shipping} total={total} />
              <Link
                href="/checkout"
                onClick={closeCartDrawer}
                className="block w-full py-4 text-center bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B89F5B] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
              >
                Na plaćanje
              </Link>
              <button
                onClick={closeCartDrawer}
                className="w-full py-3 text-[#F4F4F2]/45 text-xs tracking-wide hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:text-[#B89F5B]"
              >
                Nastavi kupovinu
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Desktop: right side drawer ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Korpa"
        aria-hidden={!isOpen}
        className={`hidden md:flex fixed inset-y-0 right-0 z-50 w-[420px] flex-col bg-[#0E0E0E] border-l border-[#F4F4F2]/8 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-[#F4F4F2]/8 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.2em]">Korpa</h2>
            {items.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B89F5B] text-[#0E0E0E] text-[9px] font-bold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCartDrawer}
            aria-label="Zatvori korpu"
            className="w-8 h-8 flex items-center justify-center text-[#F4F4F2]/50 hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
              <path d="M12 1L1 12M1 1l11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState onClose={closeCartDrawer} />
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-7 py-3.5 bg-[#1A1A1A] border-b border-[#F4F4F2]/8 shrink-0">
              <FreeShippingProgress subtotalKM={subtotal} />
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-5">
              {previewItems.map((item) => (
                <CartItemRow key={`${item.slug}-${item.size}-${item.color}`} item={item} />
              ))}
              {hasMore && (
                <Link
                  href="/cart"
                  onClick={closeCartDrawer}
                  className="text-[#B89F5B] text-xs tracking-wide hover:underline focus-visible:outline-none focus-visible:text-[#F4F4F2]"
                >
                  + još {items.length - PREVIEW_LIMIT} artikla — pogledaj sve →
                </Link>
              )}
            </div>

            {/* Summary + CTA */}
            <div className="shrink-0 border-t border-[#F4F4F2]/8 px-7 py-6 flex flex-col gap-3">
              <SummaryRows subtotal={subtotal} shipping={shipping} total={total} />
              <Link
                href="/checkout"
                onClick={closeCartDrawer}
                className="block w-full py-4 text-center bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B89F5B] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
              >
                Na plaćanje
              </Link>
              <button
                onClick={closeCartDrawer}
                className="w-full py-3 text-[#F4F4F2]/45 text-xs tracking-wide hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:text-[#B89F5B]"
              >
                Nastavi kupovinu
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 px-7 py-10">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#F4F4F2]/15" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <div className="text-center">
        <p className="text-[#F4F4F2]/50 text-sm tracking-wide mb-1">Korpa je prazna.</p>
        <p className="text-[#F4F4F2]/25 text-xs tracking-wide">Dodajte nešto iz shopa.</p>
      </div>
      <Link
        href="/shop"
        onClick={onClose}
        className="px-8 py-3 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.18em] hover:bg-[#B89F5B] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
      >
        Shop
      </Link>
    </div>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3.5">
      {/* Image */}
      <Link href={`/product/${item.slug}`} className="shrink-0 w-16 aspect-[3/4] overflow-hidden bg-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <p className="text-[#F4F4F2] text-xs font-medium tracking-wide leading-snug line-clamp-2 mb-1">
            {item.name}
          </p>
          <p className="text-[#F4F4F2]/35 text-[10px] tracking-wide">
            {item.size} · {item.color} · ×{item.quantity}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#F4F4F2] text-xs font-bold">
            {(item.priceKM * item.quantity).toFixed(2)}{" "}
            <span className="text-[#B89F5B] font-normal">KM</span>
          </span>
          <button
            onClick={() => removeItem(item.slug, item.size, item.color)}
            aria-label={`Ukloni ${item.name}`}
            className="text-[#F4F4F2]/25 hover:text-red-400/70 transition-colors text-[10px] tracking-wide focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89F5B]"
          >
            Ukloni
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRows({
  subtotal,
  shipping,
  total,
}: {
  subtotal: number;
  shipping: number;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-2 pb-3 border-b border-[#F4F4F2]/8">
      <div className="flex justify-between text-xs tracking-wide">
        <span className="text-[#F4F4F2]/45">Međuzbir</span>
        <span className="text-[#F4F4F2]/70">{subtotal.toFixed(2)} KM</span>
      </div>
      <div className="flex justify-between text-xs tracking-wide">
        <span className="text-[#F4F4F2]/45">Dostava</span>
        <span className={shipping === 0 ? "text-[#B89F5B]" : "text-[#F4F4F2]/70"}>
          {shipping === 0 ? "Besplatno" : `${shipping.toFixed(2)} KM`}
        </span>
      </div>
      <div className="flex justify-between text-xs font-bold tracking-wide pt-1">
        <span className="text-[#F4F4F2]">Ukupno</span>
        <span className="text-[#F4F4F2]">{total.toFixed(2)} KM</span>
      </div>
    </div>
  );
}
