"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden bg-kem-black"
      aria-label="KEM JEANS Hero"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1507680434567-5739c80be1ac?q=80&w=2070&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden="true"
        />

        {/* Dark Overlay - different gradients for mobile/desktop */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-kem-black/70 via-kem-black/50 to-kem-black/80 md:bg-gradient-to-r md:from-kem-black/90 md:via-kem-black/60 md:to-transparent"
          aria-hidden="true"
        />

        {/* Subtle grain/noise overlay for premium texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-[100svh] w-full items-center justify-center px-6 py-24 md:justify-start md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-xl text-center md:text-left">
          {/* Animated content group */}
          <div className="motion-safe:animate-fade-slide-up">
            {/* Brand Name */}
            <h1 className="mb-4 text-5xl font-bold uppercase tracking-super-wide text-kem-ivory md:mb-6 md:text-6xl lg:text-7xl xl:text-8xl">
              KEM
              <span className="block text-kem-gold">JEANS</span>
            </h1>

            {/* Tagline */}
            <p className="mb-3 text-lg font-light tracking-wide text-kem-ivory/90 md:text-xl lg:text-2xl">
              Premium komadi za modernog muškarca
            </p>

            {/* Subtext */}
            <p className="mb-8 text-sm tracking-widest text-kem-ivory/60 md:mb-10 md:text-base">
              Čiste linije. Siguran stil.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
              {/* Primary CTA Button */}
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center overflow-hidden bg-kem-ivory px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-kem-black transition-all duration-300 ease-out hover:bg-kem-gold hover:text-kem-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kem-gold focus-visible:ring-offset-2 focus-visible:ring-offset-kem-black md:px-10"
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-px">
                  Kupuj kolekciju
                </span>
                {/* Hover lift shadow effect */}
                <span
                  className="absolute inset-0 -z-10 translate-y-1 bg-kem-gold/30 opacity-0 blur-sm transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>

              {/* Secondary CTA Link */}
              <Link
                href="/shop?sort=new"
                className="group relative inline-flex items-center gap-2 py-2 text-sm font-medium uppercase tracking-[0.1em] text-kem-ivory/80 transition-colors duration-300 hover:text-kem-gold focus-visible:outline-none focus-visible:text-kem-gold"
              >
                <span>Pogledaj novitete</span>
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
                {/* Animated underline on hover */}
                <span
                  className="absolute bottom-0 left-0 h-px w-0 bg-kem-gold transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Free Shipping Badge */}
            <div className="mt-8 md:mt-12">
              <span className="inline-flex items-center gap-2 border border-kem-ivory/20 bg-kem-charcoal/50 px-4 py-2.5 text-xs uppercase tracking-widest text-kem-ivory/70 backdrop-blur-sm">
                <svg
                  className="h-4 w-4 text-kem-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
                Besplatna dostava iznad 150 KM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Desktop only */}
      <div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 text-kem-ivory/40 motion-safe:animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
