// npm install zustand  (run once if not already installed)

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface CartItem {
  slug: string;
  name: string;
  priceKM: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];

  /* Actions */
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string, size: string, color: string) => void;
  updateQuantity: (slug: string, size: string, color: string, quantity: number) => void;
  increment: (slug: string, size: string, color: string) => void;
  decrement: (slug: string, size: string, color: string) => void;
  clearCart: () => void;

  /* Derived (as getters via selectors below) */
}

/* ─── Key helper ─────────────────────────────────────────────────────────────── */

const key = (slug: string, size: string, color: string) => `${slug}__${size}__${color}`;

/* ─── Store ──────────────────────────────────────────────────────────────────── */

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const k = key(item.slug, item.size, item.color);
          const exists = state.items.find(
            (i) => key(i.slug, i.size, i.color) === k
          );
          if (exists) {
            return {
              items: state.items.map((i) =>
                key(i.slug, i.size, i.color) === k
                  ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),

      removeItem: (slug, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => key(i.slug, i.size, i.color) !== key(slug, size, color)
          ),
        })),

      updateQuantity: (slug, size, color, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            key(i.slug, i.size, i.color) === key(slug, size, color)
              ? { ...i, quantity: Math.max(1, Math.min(quantity, 10)) }
              : i
          ),
        })),

      increment: (slug, size, color) =>
        set((state) => ({
          items: state.items.map((i) =>
            key(i.slug, i.size, i.color) === key(slug, size, color)
              ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
              : i
          ),
        })),

      decrement: (slug, size, color) =>
        set((state) => ({
          items: state.items.map((i) =>
            key(i.slug, i.size, i.color) === key(slug, size, color)
              ? { ...i, quantity: Math.max(i.quantity - 1, 1) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "kemjeans_cart",
      // Only run in browser — avoids SSR mismatch
      skipHydration: true,
    }
  )
);

/* ─── Selectors ──────────────────────────────────────────────────────────────── */

export const selectItemsCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectSubtotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.priceKM * i.quantity, 0);

export const selectShipping = (state: CartState) => {
  const sub = selectSubtotal(state);
  return sub === 0 ? 0 : sub >= 150 ? 0 : 9;
};

export const selectTotal = (state: CartState) =>
  selectSubtotal(state) + selectShipping(state);
