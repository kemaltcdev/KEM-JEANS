import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── Types ──────────────────────────────────────────────────────────────────── */

export interface WishlistItem {
  slug: string;
  name: string;
  priceKM: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (slug: string) => void;
  hasItem: (slug: string) => boolean;
  clearWishlist: () => void;
}

/* ─── Store ──────────────────────────────────────────────────────────────────── */

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (item) =>
        set((state) => ({
          items: state.items.some((i) => i.slug === item.slug)
            ? state.items.filter((i) => i.slug !== item.slug)
            : [...state.items, item],
        })),

      addItem: (item) =>
        set((state) => ({
          items: state.items.some((i) => i.slug === item.slug)
            ? state.items
            : [...state.items, item],
        })),

      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((i) => i.slug !== slug),
        })),

      hasItem: (slug) => get().items.some((i) => i.slug === slug),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "kemjeans_wishlist",
      skipHydration: true,
    }
  )
);

/* ─── Selectors ──────────────────────────────────────────────────────────────── */

export const selectWishlistCount = (state: WishlistState) => state.items.length;
