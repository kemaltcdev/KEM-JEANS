import Link from "next/link";

export const metadata = {
  title: "Stranica nije pronađena",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center px-5 py-20 text-center">
      {/* Icon */}
      <div className="mb-8 flex items-center justify-center w-16 h-16 rounded-full border border-[#F4F4F2]/10 text-[#F4F4F2]/20">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v3M11 14h.01" strokeWidth="2" />
        </svg>
      </div>

      {/* Gold accent line */}
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#B89F5B] to-transparent mb-8" aria-hidden="true" />

      {/* Label */}
      <p className="text-[#B89F5B] text-[10px] tracking-[0.3em] uppercase font-medium mb-4">
        — 404
      </p>

      <h1 className="text-[#F4F4F2] text-3xl md:text-4xl font-bold uppercase tracking-widest leading-tight mb-4 max-w-sm">
        Stranica nije<br />pronađena
      </h1>

      <p className="text-[#F4F4F2]/45 text-sm font-light tracking-wide leading-relaxed max-w-xs mb-10">
        Izgleda da je link neispravan ili je stranica uklonjena.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/"
          className="flex-1 py-4 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.2em] text-center transition-colors duration-300 hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
        >
          Nazad na početnu
        </Link>
        <Link
          href="/shop"
          className="flex-1 py-4 border border-[#F4F4F2]/20 text-[#F4F4F2]/70 text-xs font-medium uppercase tracking-[0.2em] text-center transition-all duration-300 hover:border-[#B89F5B] hover:text-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
        >
          Idi na shop
        </Link>
      </div>

      {/* Subtle footnote */}
      <p className="mt-8 text-[#F4F4F2]/25 text-[11px] tracking-wide">
        Ako mislite da je greška,{" "}
        <Link
          href="/kontakt"
          className="text-[#F4F4F2]/40 underline underline-offset-4 decoration-[#F4F4F2]/20 hover:text-[#B89F5B] hover:decoration-[#B89F5B] transition-colors duration-200 focus-visible:outline-none focus-visible:text-[#B89F5B]"
        >
          kontaktirajte nas
        </Link>
        .
      </p>
    </main>
  );
}
