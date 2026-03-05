import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
    alternates: {
      canonical: "https://kemjeans.ba/shop",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
