"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecentlyViewedStore, type RecentlyViewedItem } from "@/store/recentlyViewedStore";

interface Props {
  currentSlug?: string;
}

export default function RecentlyViewed({ currentSlug }: Props) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  /* SSR-safe hydration */
  useEffect(() => {
    useRecentlyViewedStore.persist.rehydrate();
    const sync = () => {
      const all = useRecentlyViewedStore.getState().items;
      setItems(currentSlug ? all.filter((i) => i.slug !== currentSlug) : all);
    };
    sync();
    return useRecentlyViewedStore.subscribe(sync);
  }, [currentSlug]);

  if (items.length === 0) return null;

  const preview = items.slice(0, 8);

  return (
    <section aria-labelledby="recently-viewed-heading" className="border-t border-[#F4F4F2]/8 py-14 md:py-20">
      <div className="px-5 md:px-10 lg:px-16 mb-8 md:mb-10">
        <p className="text-[#B89F5B] text-[10px] tracking-[0.25em] uppercase font-medium mb-2">
          — Historija
        </p>
        <h2
          id="recently-viewed-heading"
          className="text-[#F4F4F2] text-2xl md:text-3xl font-bold uppercase tracking-widest"
        >
          Nedavno pregledano
        </h2>
      </div>

      {/* Mobile: swipe carousel */}
      <div className="md:hidden">
        <div
          className="flex gap-3 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
          style={{ scrollbarWidth: "none" }}
          role="list"
          aria-label="Nedavno pregledani proizvodi"
        >
          {preview.map((item) => (
            <div
              key={item.slug}
              className="snap-start shrink-0 w-[75vw] max-w-[260px]"
              role="listitem"
            >
              <RecentlyViewedCard item={item} />
            </div>
          ))}
          <div className="shrink-0 w-5" aria-hidden="true" />
        </div>
      </div>

      {/* Desktop: 4-column grid */}
      <div
        className="hidden md:grid md:grid-cols-4 gap-4 px-10 lg:px-16"
        role="list"
        aria-label="Nedavno pregledani proizvodi"
      >
        {preview.map((item) => (
          <div key={item.slug} role="listitem">
            <RecentlyViewedCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────────── */

function RecentlyViewedCard({ item }: { item: RecentlyViewedItem }) {
  return (
    <Link
      href={`/product/${item.slug}`}
      className="group flex flex-col overflow-hidden bg-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
      aria-label={`${item.name} — ${item.priceKM} KM`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={`${item.name} – KEM JEANS`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {item.badge && (
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
              item.badge === "Novo" ? "bg-[#B89F5B] text-[#0E0E0E]" : "bg-[#F4F4F2] text-[#0E0E0E]"
            }`}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="relative text-[#F4F4F2] text-xs font-medium tracking-wide truncate mb-1 w-fit max-w-full">
          {item.name}
          <span
            className="absolute bottom-0 left-0 h-px w-0 bg-[#B89F5B] transition-all duration-300 group-hover:w-full"
            aria-hidden="true"
          />
        </p>
        <p className="text-[#F4F4F2] text-xs font-bold">
          {item.priceKM}{" "}
          <span className="text-[#B89F5B] font-normal">KM</span>
        </p>
      </div>
    </Link>
  );
}
