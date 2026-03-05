import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Povrat i zamjena",
    alternates: {
      canonical: "https://kemjeans.ba/povrat",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
