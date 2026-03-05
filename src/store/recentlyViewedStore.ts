import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface RecentlyViewedItem {
  id: number;
  slug: string;
  name: string;
  priceKM: number;
  category: string;
  badge?: string;
  image: string;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  addViewed: (item: RecentlyViewedItem) => void;
  clear: () => void;
}

/* ─── Store ──────────────────────────────────────────────────────────────────── */

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],

      addViewed: (item) =>
        set((state) => {
          const filtered = state.items.filter((i) => i.slug !== item.slug);
          return { items: [item, ...filtered].slice(0, 12) };
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: "kemjeans_recently_viewed",
      skipHydration: true,
    }
  )
);

/* ─── Selectors ──────────────────────────────────────────────────────────────── */

export const selectRecentlyViewedCount = (state: RecentlyViewedState) =>
  state.items.length;
