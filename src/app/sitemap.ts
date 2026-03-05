import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";

const BASE = "https://kemjeans.ba";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                    changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/shop`,          changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/dostava`,       changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/povrat`,        changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/kontakt`,       changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privatnost`,    changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/uslovi`,        changeFrequency: "monthly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
