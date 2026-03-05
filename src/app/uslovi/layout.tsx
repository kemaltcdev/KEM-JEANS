import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uslovi korištenja",
    alternates: {
      canonical: "https://kemjeans.ba/uslovi",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
