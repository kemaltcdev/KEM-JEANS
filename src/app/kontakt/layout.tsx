import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
    alternates: {
      canonical: "https://kemjeans.ba/kontakt",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
