import { getConsent } from "./consent";
import type { Product } from "@/data/products";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function allowed(): boolean {
  return getConsent() === "accepted";
}

export function trackViewItem(product: Product): void {
  if (!allowed()) return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "view_item", {
      currency: "BAM",
      value: product.priceKM,
      items: [
        {
          item_id: product.slug,
          item_name: product.name,
          item_category: product.category,
          price: product.priceKM,
          quantity: 1,
        },
      ],
    });
  }
  trackMetaEvent("ViewContent", {
    content_ids: [product.slug],
    content_name: product.name,
    content_type: "product",
    value: product.priceKM,
    currency: "BAM",
  });
}

export function trackAddToCart(product: Product, quantity = 1): void {
  if (!allowed()) return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "add_to_cart", {
      currency: "BAM",
      value: product.priceKM * quantity,
      items: [
        {
          item_id: product.slug,
          item_name: product.name,
          item_category: product.category,
          price: product.priceKM,
          quantity,
        },
      ],
    });
  }
  trackMetaEvent("AddToCart", {
    content_ids: [product.slug],
    content_name: product.name,
    content_type: "product",
    value: product.priceKM * quantity,
    currency: "BAM",
  });
}

export function trackBeginCheckout(
  items: { slug: string; name: string; priceKM: number; quantity: number }[],
  total: number
): void {
  if (!allowed()) return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", {
      currency: "BAM",
      value: total,
      items: items.map((item) => ({
        item_id: item.slug,
        item_name: item.name,
        price: item.priceKM,
        quantity: item.quantity,
      })),
    });
  }
  trackMetaEvent("InitiateCheckout", {
    value: total,
    currency: "BAM",
    num_items: items.reduce((s, i) => s + i.quantity, 0),
  });
}

export function trackMetaEvent(
  name: string,
  payload: Record<string, unknown>
): void {
  if (!allowed()) return;
  if (typeof window.fbq === "function") {
    window.fbq("track", name, payload);
  }
}
