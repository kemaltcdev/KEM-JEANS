import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika privatnosti",
    alternates: {
      canonical: "https://kemjeans.ba/privatnost",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
