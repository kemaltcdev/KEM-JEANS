import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import NewsletterPopup from "@/components/NewsletterPopup";
import ToastContainer from "@/components/ToastContainer";

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
        <Navbar />
        <CartDrawer />
        <NewsletterPopup />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
