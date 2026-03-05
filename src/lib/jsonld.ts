import type { Product } from "@/data/products";

const BASE = "https://kemjeans.ba";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KEM JEANS",
    url: BASE,
    logo: `${BASE}/logo.png`,
    sameAs: [
      "https://www.instagram.com/kemjeans",
      "https://www.tiktok.com/@kemjeans",
      "https://www.facebook.com/kemjeans",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KEM JEANS",
    url: BASE,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/pretraga?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: Product) {
  const images = product.images.length > 0 ? product.images : [product.image];
  const description =
    product.description ||
    `${product.name} – premium ${product.category.toLowerCase()} brenda KEM JEANS.`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images,
    description,
    sku: product.slug,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "KEM JEANS",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE}/product/${product.slug}`,
      priceCurrency: "BAM",
      price: product.priceKM,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
