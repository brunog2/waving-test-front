import { create } from "zustand";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items) => set({ items }),

  addItem: (item) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        return { items: updatedItems };
      }

      return { items: [...state.items, item] };
    });
  },

  updateItem: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  clearCart: () => set({ items: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
