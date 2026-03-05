import Link from "next/link";

const links = [
  {
    heading: "Kupovina",
    items: [
      { label: "Shop", href: "/shop" },
      { label: "Novi artikli", href: "/shop?sort=new" },
      { label: "Najprodavanije", href: "/shop?sort=best" },
    ],
  },
  {
    heading: "Korisnička podrška",
    items: [
      { label: "Dostava i plaćanje", href: "/dostava" },
      { label: "Povrat i zamjena", href: "/povrat" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  {
    heading: "Pravno",
    items: [
      { label: "Politika privatnosti", href: "/privatnost" },
      { label: "Uslovi korištenja", href: "/uslovi" },
    ],
  },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-[#0E0E0E] border-t border-[#F4F4F2]/8">
      <div className="px-5 md:px-10 lg:px-16 py-14 md:py-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand block */}
          <div className="md:col-span-1 flex flex-col gap-5">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
              aria-label="KEM JEANS — početna stranica"
            >
              <span className="text-[#F4F4F2] text-xl font-bold uppercase tracking-[0.3em]">
                KEM JEANS
              </span>
            </Link>
            <p className="text-[#F4F4F2]/40 text-sm font-light leading-relaxed tracking-wide max-w-[220px]">
              Premium muška garderoba. Čiste linije. Siguran stil.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-1" role="list" aria-label="Društvene mreže">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                aria-label="KEM JEANS na Instagramu"
                className="group text-[#F4F4F2]/40 transition-colors duration-300 hover:text-[#B89F5B] focus-visible:outline-none focus-visible:text-[#B89F5B]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                aria-label="KEM JEANS na TikToku"
                className="group text-[#F4F4F2]/40 transition-colors duration-300 hover:text-[#B89F5B] focus-visible:outline-none focus-visible:text-[#B89F5B]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                aria-label="KEM JEANS na Facebooku"
                className="group text-[#F4F4F2]/40 transition-colors duration-300 hover:text-[#B89F5B] focus-visible:outline-none focus-visible:text-[#B89F5B]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {links.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.2em] mb-5">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3.5" role="list">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group relative inline-block text-[#F4F4F2]/45 text-sm font-light tracking-wide transition-colors duration-300 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:text-[#B89F5B]"
                    >
                      {item.label}
                      <span
                        className="absolute -bottom-px left-0 h-px w-0 bg-[#B89F5B] transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 md:mt-16 pt-6 border-t border-[#F4F4F2]/8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#F4F4F2]/25 text-xs tracking-wide text-center md:text-left">
            © {currentYear} KEM JEANS. Sva prava zadržana.
          </p>
          <p className="text-[#F4F4F2]/15 text-xs tracking-wide">
            Bosna i Hercegovina
          </p>
        </div>
      </div>
    </footer>
  );
}
