import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dostava i plaćanje",
    alternates: {
      canonical: "https://kemjeans.ba/dostava",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
