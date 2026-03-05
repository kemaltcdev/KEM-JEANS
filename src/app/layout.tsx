import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import NewsletterPopup from "@/components/NewsletterPopup";
import ToastContainer from "@/components/ToastContainer";
import CookieBanner from "@/components/CookieBanner";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

// TODO: Place /public/og.jpg (1200x630px), /public/favicon.ico, /public/apple-touch-icon.png

export const metadata: Metadata = {
  metadataBase: new URL("https://kemjeans.ba"),
  title: {
    template: "%s | KEM JEANS",
    default: "KEM JEANS",
  },
  description:
    "Premium muška garderoba — farmerke, majice, dukserice i trenerke. Čiste linije. Siguran stil.",
  openGraph: {
    siteName: "KEM JEANS",
    locale: "bs_BA",
    type: "website",
    url: "https://kemjeans.ba",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "KEM JEANS" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" className={inter.variable}>
      <body className="font-sans antialiased">
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />

        {/* GA4 — initialize dataLayer + consent defaults (denied until user accepts) */}
        {GA_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('consent', 'default', {
                    analytics_storage: 'denied',
                    ad_storage: 'denied'
                  });
                `,
              }}
            />
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `gtag('config', '${GA_ID}', { send_page_view: false });`,
              }}
            />
          </>
        )}

        {/* Meta Pixel — loaded but fbq('track') only fires after consent */}
        {PIXEL_ID && (
          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s){
                  if(f.fbq)return;n=f.fbq=function(){
                    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)
                  };
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)
                }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('consent', 'revoke');
                fbq('init', '${PIXEL_ID}');
              `,
            }}
          />
        )}

        <Navbar />
        <CartDrawer />
        <NewsletterPopup />
        <ToastContainer />
        <CookieBanner />
        {children}
      </body>
    </html>
  );
}
