import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import ProductDetail from "./ProductDetail";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

const BASE = "https://kemjeans.ba";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: "Proizvod nije pronađen",
      robots: { index: false, follow: false },
    };
  }

  const description = `${product.name} – premium ${product.category.toLowerCase()} brenda KEM JEANS. Brza dostava 1–3 dana. Povrat 14 dana.`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `${BASE}/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | KEM JEANS`,
      description,
      images: [{ url: product.images[0], alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | KEM JEANS`,
      description,
      images: [product.images[0]],
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  return (
    <>
      {product && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                breadcrumbJsonLd([
                  { name: "Početna", url: BASE },
                  { name: "Prodavnica", url: `${BASE}/shop` },
                  { name: product.category, url: `${BASE}/shop?category=${product.category.toLowerCase()}` },
                  { name: product.name },
                ])
              ),
            }}
          />
        </>
      )}
      <ProductDetail params={params} />
    </>
  );
}
