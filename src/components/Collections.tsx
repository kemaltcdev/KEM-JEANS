"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const categories = [
  {
    name: "Farmerke",
    slug: "farmerke",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    alt: "Muške farmerke – KEM JEANS kolekcija",
  },
  {
    name: "Majice",
    slug: "majice",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    alt: "Muške majice – KEM JEANS kolekcija",
  },
  {
    name: "Dukserice",
    slug: "dukserice",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    alt: "Muške dukserice – KEM JEANS kolekcija",
  },
  {
    name: "Trenerke",
    slug: "trenerke",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    alt: "Muške trenerke – KEM JEANS kolekcija",
  },
  {
    name: "Šorcevi",
    slug: "sorcevi",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
    alt: "Muški šorcevi – KEM JEANS kolekcija",
  },
];

export default function Collections() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="collections-heading"
      className="bg-[#0E0E0E] py-16 md:py-24 overflow-hidden"
    >
      {/* Header */}
      <div
        className={`px-5 md:px-10 lg:px-16 mb-10 md:mb-14 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">
          — Ekskluzivno
        </p>
        <h2
          id="collections-heading"
          className="text-[#F4F4F2] text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-widest leading-tight"
        >
          Kolekcije
        </h2>
        <p className="text-[#F4F4F2]/50 text-sm md:text-base mt-3 font-light tracking-wide">
          Pronađite stil koji vam odgovara
        </p>
      </div>

      {/* Mobile: Horizontal Scroll Carousel */}
      <div
        className={`md:hidden transition-all duration-700 delay-200 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div
          className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          role="list"
          aria-label="Kategorije kolekcija"
        >
          {categories.map((cat, i) => (
            <div
              key={cat.slug}
              className="snap-start shrink-0 w-[78vw] max-w-[320px]"
              role="listitem"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CategoryCard cat={cat} />
            </div>
          ))}
          <div className="shrink-0 w-5" aria-hidden="true" />
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 mt-5 px-5" aria-hidden="true">
          {categories.map((cat) => (
            <span
              key={cat.slug}
              className="block w-1 h-1 rounded-full bg-[#F4F4F2]/20"
            />
          ))}
        </div>
      </div>

      {/* Desktop: 5-column Grid */}
      <div
        className={`hidden md:grid md:grid-cols-5 gap-3 lg:gap-4 px-10 lg:px-16 transition-all duration-700 delay-200 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        role="list"
        aria-label="Kategorije kolekcija"
      >
        {categories.map((cat, i) => (
          <div
            key={cat.slug}
            role="listitem"
            className="transition-all duration-500 ease-out"
            style={{
              transitionDelay: `${i * 60}ms`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <CategoryCard cat={cat} desktop />
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  desktop = false,
}: {
  cat: (typeof categories)[number];
  desktop?: boolean;
}) {
  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-sm bg-[#1A1A1A] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] ${
        desktop ? "aspect-[3/4]" : "aspect-[3/4]"
      }`}
      aria-label={`Pogledaj kolekciju: ${cat.name}`}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cat.image}
          alt={cat.alt}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mt-auto p-5 md:p-4 lg:p-5">
        <span className="block text-[#F4F4F2] text-base md:text-sm lg:text-base font-bold uppercase tracking-[0.2em] leading-tight">
          {cat.name}
        </span>

        <span
          className="block h-px bg-[#B89F5B] mt-2 w-0 transition-all duration-500 ease-out group-hover:w-full group-focus-visible:w-full"
          aria-hidden="true"
        />

        <span className="md:hidden block text-[#F4F4F2]/40 text-xs tracking-widest uppercase mt-2 font-light">
          Istraži →
        </span>
      </div>

      <span
        className="absolute inset-0 rounded-sm ring-1 ring-inset ring-[#B89F5B]/0 transition-all duration-500 group-hover:ring-[#B89F5B]/25 group-focus-visible:ring-[#B89F5B]/50"
        aria-hidden="true"
      />
    </Link>
  );
}
