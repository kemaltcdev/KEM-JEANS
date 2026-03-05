"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getConsent();
    if (stored === null) {
      setVisible(true);
    } else if (stored === "accepted") {
      /* Re-apply consent for returning visitors whose GA defaults to denied */
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
        });
      }
    }
  }, []);

  const handleAccept = () => {
    setConsent("accepted");
    setVisible(false);
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    }
    if (typeof window.fbq === "function") {
      window.fbq("consent", "grant");
    }
  };

  const handleReject = () => {
    setConsent("rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Obavještenje o kolačićima"
      className="fixed bottom-0 inset-x-0 z-[80] md:bottom-4 md:left-4 md:inset-x-auto md:w-80 bg-[#0E0E0E] border-t border-[#F4F4F2]/10 md:border md:border-[#F4F4F2]/10 px-5 py-4 shadow-2xl"
    >
      <p className="text-[#F4F4F2]/60 text-xs tracking-wide leading-relaxed mb-4">
        Koristimo kolačiće za analitiku i poboljšanje iskustva kupovine.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="flex-1 py-2.5 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
        >
          Prihvati
        </button>
        <button
          onClick={handleReject}
          className="flex-1 py-2.5 border border-[#F4F4F2]/15 text-[#F4F4F2]/50 text-xs uppercase tracking-[0.15em] transition-colors hover:border-[#F4F4F2]/35 hover:text-[#F4F4F2]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
        >
          Odbij
        </button>
      </div>
    </div>
  );
}
