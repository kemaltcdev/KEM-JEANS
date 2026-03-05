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
  badge?: "Novo" | "Popularno";
};

const products: Product[] = [
  {
    id: 1,
    name: "Slim Fit Farmerke",
    price: 89,
    slug: "slim-fit-farmerke",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    badge: "Popularno",
  },
  {
    id: 2,
    name: "Crna Basic Majica",
    price: 39,
    slug: "crna-basic-majica",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 3,
    name: "Premium Dukserica",
    price: 79,
    slug: "premium-dukserica",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    badge: "Novo",
  },
  {
    id: 4,
    name: "Urban Trenerka",
    price: 119,
    slug: "urban-trenerka",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    badge: "Novo",
  },
  {
    id: 5,
    name: "Ljetni Šorc",
    price: 49,
    slug: "ljetni-sorc",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
  },
  {
    id: 6,
    name: "Denim Jakna",
    price: 149,
    slug: "denim-jakna",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&q=80",
    badge: "Popularno",
  },
  {
    id: 7,
    name: "Classic Polo Majica",
    price: 55,
    slug: "classic-polo-majica",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
  },
  {
    id: 8,
    name: "Relaxed Fit Farmerke",
    price: 95,
    slug: "relaxed-fit-farmerke",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    badge: "Popularno",
  },
];

export default function FeaturedProducts() {
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
      aria-labelledby="featured-heading"
      className="bg-[#0E0E0E] py-16 md:py-24 overflow-hidden"
    >
      {/* Header */}
      <div
        className={`px-5 md:px-10 lg:px-16 mb-10 md:mb-14 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">
          — Istaknuto
        </p>
        <h2
          id="featured-heading"
          className="text-[#F4F4F2] text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-widest leading-tight"
        >
          {copy.sections.bestSellers}
        </h2>
        <p className="text-[#F4F4F2]/50 text-sm md:text-base mt-3 font-light tracking-wide">
          Izdvojeni komadi koje muškarci najčešće biraju
        </p>
      </div>

      {/* Mobile: 2-column vertical grid */}
      <div
        className={`md:hidden px-5 transition-all duration-700 delay-150 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div
          className="grid grid-cols-2 gap-3"
          role="list"
          aria-label="Istaknuti proizvodi"
        >
          {products.map((product) => (
            <div key={product.id} role="listitem">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: 4-column Grid */}
      <div
        className={`hidden md:grid md:grid-cols-4 gap-4 lg:gap-5 px-10 lg:px-16 transition-all duration-700 delay-150 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        role="list"
        aria-label="Istaknuti proizvodi"
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            role="listitem"
            style={{
              transitionDelay: `${i * 50}ms`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <ProductCard product={product} desktop />
          </div>
        ))}
      </div>

      {/* View All CTA */}
      <div
        className={`flex justify-center mt-12 md:mt-16 px-5 transition-all duration-700 delay-300 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Link
          href="/shop"
          className="group inline-flex items-center gap-3 border border-[#F4F4F2]/20 px-8 py-4 text-xs uppercase tracking-[0.2em] text-[#F4F4F2]/70 transition-all duration-300 hover:border-[#B89F5B] hover:text-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
        >
          Pogledaj sve proizvode
          <svg
            width="16"
            height="16"
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
    </section>
  );
}

/* ─── Product Card ───────────────────────────────────────────────────────────── */

function ProductCard({
  product,
  desktop = false,
}: {
  product: Product;
  desktop?: boolean;
}) {
  const [added, setAdded] = useState(false);

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col bg-[#1A1A1A] overflow-hidden shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
      aria-label={`${product.name} — ${formatPriceKM(product.price)}`}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={`${product.name} – KEM JEANS`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] font-semibold ${
              product.badge === "Novo"
                ? "bg-[#B89F5B] text-[#0E0E0E]"
                : "bg-[#F4F4F2] text-[#0E0E0E]"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? `Ukloni ${product.name} s liste želja`
              : `Dodaj ${product.name} na listu želja`
          }
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center bg-[#0E0E0E]/60 backdrop-blur-sm transition-all duration-300 hover:bg-[#0E0E0E]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
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

        {/* Desktop: Quick add overlay */}
        {desktop && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              aria-label={`Dodaj ${product.name} u korpu`}
              className={`w-full py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-inset ${
                added
                  ? "bg-[#B89F5B] text-[#0E0E0E]"
                  : "bg-[#0E0E0E]/90 text-[#F4F4F2] hover:bg-[#B89F5B] hover:text-[#0E0E0E]"
              }`}
            >
              {added ? "Dodano ✓" : copy.buttons.addToCart}
            </button>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[#F4F4F2] text-sm font-medium tracking-wide leading-snug">
            {product.name}
          </span>
          <span className="shrink-0 text-[#F4F4F2] text-sm font-bold tracking-wide">
            {formatPriceKM(product.price)}
          </span>
        </div>

        {/* Mobile: Add to cart button */}
        <button
          onClick={handleAddToCart}
          aria-label={`Dodaj ${product.name} u korpu`}
          className={`md:hidden w-full py-3 text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1A1A1A] ${
            added
              ? "bg-[#B89F5B] text-[#0E0E0E]"
              : "bg-[#0E0E0E] text-[#F4F4F2] border border-[#F4F4F2]/10 active:bg-[#B89F5B] active:text-[#0E0E0E]"
          }`}
        >
          {added ? "Dodano ✓" : "Dodaj u korpu"}
        </button>
      </div>
    </Link>
  );
}
