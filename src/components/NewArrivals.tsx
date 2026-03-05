"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { showToast } from "@/store/toastStore";
import { formatPriceKM } from "@/lib/formatPrice";
import { copy } from "@/lib/copy";

type Product = {
  id: number;
  name: string;
  price: number;
  slug: string;
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Denim Jakna",
    price: 149,
    slug: "denim-jakna",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80",
  },
  {
    id: 2,
    name: "Slim Fit Farmerke",
    price: 119,
    slug: "slim-fit-farmerke",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
  },
  {
    id: 3,
    name: "Premium Dukserica",
    price: 129,
    slug: "premium-dukserica",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
  },
  {
    id: 4,
    name: "Crna Basic Majica",
    price: 49,
    slug: "crna-basic-majica",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  },
  {
    id: 5,
    name: "Classic Polo Majica",
    price: 69,
    slug: "classic-polo-majica",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80",
  },
  {
    id: 6,
    name: "Urban Trenerka",
    price: 139,
    slug: "urban-trenerka",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  },
];

export default function NewArrivals() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    useWishlistStore.persist.rehydrate();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="new-arrivals-heading"
      className="bg-[#0E0E0E] py-16 md:py-24"
    >
      {/* Header */}
      <div
        className={`px-5 md:px-10 lg:px-16 mb-10 md:mb-14 flex items-end justify-between transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div>
          <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">
            — Novo u ponudi
          </p>
          <h2
            id="new-arrivals-heading"
            className="text-[#F4F4F2] text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-widest leading-tight"
          >
            {copy.sections.newArrivals}
          </h2>
          <p className="text-[#F4F4F2]/50 text-sm md:text-base mt-3 font-light tracking-wide max-w-sm">
            Stigli su novi komadi — jednostavno, moderno, premium.
          </p>
        </div>

        <Link
          href="/shop?sort=new"
          className="group shrink-0 ml-6 mb-1 text-xs uppercase tracking-[0.2em] text-[#F4F4F2]/50 transition-colors duration-300 hover:text-[#B89F5B] focus-visible:outline-none focus-visible:text-[#B89F5B]"
          aria-label="Pogledaj sve nove artikle"
        >
          <span className="relative">
            Pogledaj sve
            <span
              className="absolute -bottom-px left-0 h-px w-0 bg-[#B89F5B] transition-all duration-300 group-hover:w-full"
              aria-hidden="true"
            />
          </span>
        </Link>
      </div>

      {/* Mobile: first 3 products as large campaign cards */}
      <div className="md:hidden flex flex-col gap-4 px-5">
        {products.slice(0, 3).map((product, i) => (
          <ArrivalCard
            key={product.id}
            product={product}
            index={i}
            isVisible={isVisible}
          />
        ))}

        {/* Mobile: view all */}
        <Link
          href="/shop?sort=new"
          className="group mt-2 flex items-center justify-center gap-3 border border-[#F4F4F2]/15 py-4 text-xs uppercase tracking-[0.2em] text-[#F4F4F2]/60 transition-all duration-300 hover:border-[#B89F5B] hover:text-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
        >
          Pogledaj sve nove artikle
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Desktop: 3-column grid, all 6 products */}
      <div
        className={`hidden md:grid md:grid-cols-3 gap-4 lg:gap-5 px-10 lg:px-16 transition-all duration-700 delay-150 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        role="list"
        aria-label="Novi artikli"
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            role="listitem"
            style={{
              transitionDelay: `${i * 60}ms`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            }}
          >
            <ArrivalCard product={product} index={i} isVisible={isVisible} desktop />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Arrival Card ───────────────────────────────────────────────────────────── */

function ArrivalCard({
  product,
  index,
  isVisible,
  desktop = false,
}: {
  product: Product;
  index: number;
  isVisible: boolean;
  desktop?: boolean;
}) {
  const items = useWishlistStore((s) => s.items);
  const wishlisted = items.some((i) => i.slug === product.slug);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const adding = !wishlisted;
    useWishlistStore.getState().toggleItem({
      slug: product.slug,
      name: product.name,
      priceKM: product.price,
      image: product.image,
    });
    showToast("info", adding ? copy.messages.wishlistAdded : copy.messages.wishlistRemoved);
  };

  return (
    <article
      className={`group relative overflow-hidden bg-[#1A1A1A] transition-all ease-out focus-within:ring-2 focus-within:ring-[#B89F5B] focus-within:ring-offset-2 focus-within:ring-offset-[#0E0E0E] ${
        desktop ? "aspect-[3/4]" : "aspect-[4/5]"
      } ${
        !desktop
          ? `transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`
          : ""
      }`}
      style={
        !desktop
          ? { transitionDelay: `${150 + index * 100}ms` }
          : undefined
      }
      aria-label={`${product.name} — ${formatPriceKM(product.price)}`}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={`${product.name} – KEM JEANS novi artikal`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
        aria-hidden="true"
      />

      {/* Top row: "Novo" tag + Wishlist button */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <span className="inline-block bg-[#B89F5B] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[#0E0E0E]">
          Novo
        </span>

        <button
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? `Ukloni ${product.name} s liste želja`
              : `Dodaj ${product.name} na listu želja`
          }
          aria-pressed={wishlisted}
          className="flex h-9 w-9 items-center justify-center bg-[#0E0E0E]/60 backdrop-blur-sm transition-all duration-300 hover:bg-[#0E0E0E]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#B89F5B" : "none"}
            stroke={wishlisted ? "#B89F5B" : "#F4F4F2"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-all duration-300"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p className="text-[#F4F4F2]/60 text-xs uppercase tracking-[0.2em] mb-1.5 font-light">
          KEM JEANS
        </p>
        <h3 className="text-[#F4F4F2] text-xl md:text-2xl font-bold uppercase tracking-wider leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-[#F4F4F2]/80 text-sm font-light mb-3">
          {formatPriceKM(product.price)}
        </p>

        <Link
          href={`/product/${product.slug}`}
          className="group/cta relative inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F4F4F2] font-medium transition-colors duration-300 hover:text-[#B89F5B] focus-visible:outline-none focus-visible:text-[#B89F5B]"
          tabIndex={0}
        >
          Pogledaj
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/cta:translate-x-1"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="absolute -bottom-px left-0 h-px w-0 bg-[#B89F5B] transition-all duration-300 group-hover/cta:w-full"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
