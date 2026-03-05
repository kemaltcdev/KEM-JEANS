"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlistStore, WishlistItem } from "@/store/wishlistStore";

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function WishlistPage() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useWishlistStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);

  if (!hydrated) return <div className="min-h-screen bg-[#0E0E0E]" />;

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <main className="pt-24 md:pt-28 pb-20">

        {/* Header */}
        <div className="px-5 md:px-10 lg:px-16 mb-10 md:mb-12">
          <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-2">
            — Moje
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight">
              Lista želja
            </h1>
            {items.length > 0 && (
              <span className="text-[#F4F4F2]/35 text-xs tracking-wide shrink-0">
                {items.length} {items.length === 1 ? "artikal" : "artikla"}
              </span>
            )}
          </div>
          <p className="text-[#F4F4F2]/45 text-sm mt-1.5 font-light tracking-wide">
            Sačuvajte komade koje želite kasnije kupiti.
          </p>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-5 text-center">
            <div className="mb-6 text-[#F4F4F2]/15">
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="text-[#F4F4F2]/40 text-sm tracking-wide mb-6">
              Lista želja je prazna.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#F4F4F2] text-[#0E0E0E] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
            >
              Nastavi kupovinu
            </Link>
          </div>
        ) : (
          <div className="px-5 md:px-10 lg:px-16">
            {/* Mobile: stacked cards / Desktop: 3–4 column grid */}
            <ul
              className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4 lg:gap-5"
              role="list"
              aria-label="Lista želja"
            >
              {items.map((item) => (
                <li key={item.slug} role="listitem">
                  <WishlistCard item={item} onRemove={() => removeItem(item.slug)} />
                </li>
              ))}
            </ul>

            {/* Footer actions */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/shop"
                className="text-[#F4F4F2]/40 text-xs tracking-wide hover:text-[#F4F4F2]/70 transition-colors focus-visible:outline-none focus-visible:text-[#B89F5B]"
              >
                ← Nastavi kupovinu
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Wishlist Card ──────────────────────────────────────────────────────────── */

function WishlistCard({
  item,
  onRemove,
}: {
  item: WishlistItem;
  onRemove: () => void;
}) {
  return (
    <article
      className="group relative flex flex-col bg-[#1A1A1A] overflow-hidden"
      aria-label={`${item.name} — ${item.priceKM} KM`}
    >
      {/* Image */}
      <Link
        href={`/product/${item.slug}`}
        className="block relative overflow-hidden aspect-[3/4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-inset"
        tabIndex={0}
        aria-label={`Pogledaj ${item.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={`${item.name} – KEM JEANS`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Remove button overlay */}
        <button
          onClick={(e) => { e.preventDefault(); onRemove(); }}
          aria-label={`Ukloni ${item.name} s liste želja`}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center bg-[#0E0E0E]/60 backdrop-blur-sm text-[#F4F4F2]/70 transition-all duration-300 hover:bg-[#0E0E0E]/90 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </Link>

      {/* Card content */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${item.slug}`}
            className="text-[#F4F4F2] text-sm font-medium tracking-wide leading-snug hover:text-[#B89F5B] transition-colors focus-visible:outline-none focus-visible:text-[#B89F5B]"
          >
            {item.name}
          </Link>
          <span className="shrink-0 text-[#F4F4F2] text-sm font-bold tracking-wide">
            {item.priceKM}{" "}
            <span className="text-[#B89F5B] text-xs font-normal">KM</span>
          </span>
        </div>

        {/* CTA: navigate to product page to select size/color */}
        <Link
          href={`/product/${item.slug}`}
          className="w-full py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] bg-[#F4F4F2] text-[#0E0E0E] transition-colors duration-300 hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1A1A1A]"
        >
          Dodaj u korpu
        </Link>

        {/* Remove text button */}
        <button
          onClick={onRemove}
          aria-label={`Ukloni ${item.name} s liste želja`}
          className="text-[#F4F4F2]/25 text-xs tracking-wide uppercase hover:text-red-400/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
        >
          Ukloni
        </button>
      </div>
    </article>
  );
}
