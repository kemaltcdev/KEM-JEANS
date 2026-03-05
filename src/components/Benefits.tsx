"use client";

import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    id: 1,
    title: "Brza dostava",
    description: "Dostava širom Bosne i Hercegovine u roku 1–3 radna dana.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 3h15v13H1z" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Jednostavan povrat",
    description: "Ako vam proizvod ne odgovara, povrat je moguć u roku 14 dana.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Sigurno plaćanje",
    description: "Plaćanje pouzećem ili karticom uz potpunu sigurnost.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Premium kvalitet",
    description: "Pažljivo odabrani materijali i moderni krojevi.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function Benefits() {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="benefits-heading"
      className="bg-[#0E0E0E] py-16 md:py-24"
    >
      {/* Header */}
      <div
        className={`px-5 md:px-10 lg:px-16 mb-10 md:mb-14 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">
          — Naše prednosti
        </p>
        <h2
          id="benefits-heading"
          className="text-[#F4F4F2] text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-widest leading-tight"
        >
          Zašto kupovati kod nas
        </h2>
        <p className="text-[#F4F4F2]/50 text-sm md:text-base mt-3 font-light tracking-wide">
          Kvalitet, sigurnost i stil na jednom mjestu.
        </p>
      </div>

      {/* Cards */}
      <div
        className="px-5 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5"
        role="list"
        aria-label="Prednosti kupovine"
      >
        {benefits.map((benefit, i) => (
          <div
            key={benefit.id}
            role="listitem"
            className={`group flex flex-col gap-5 bg-[#1A1A1A] rounded-sm p-6 md:p-7 shadow-md transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-[#B89F5B] focus-within:ring-offset-2 focus-within:ring-offset-[#0E0E0E] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${150 + i * 80}ms` }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 flex items-center justify-center rounded-sm bg-[#0E0E0E] text-[#B89F5B] transition-colors duration-300 group-hover:bg-[#B89F5B]/10"
              aria-hidden="true"
            >
              {benefit.icon}
            </div>

            {/* Text */}
            <div>
              <h3 className="relative inline-block text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.15em] mb-3">
                {benefit.title}
                <span
                  className="absolute -bottom-1 left-0 h-px w-0 bg-[#B89F5B] transition-all duration-400 ease-out group-hover:w-full"
                  aria-hidden="true"
                />
              </h3>
              <p className="text-[#F4F4F2]/50 text-sm font-light leading-relaxed tracking-wide">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
