import { CartItem } from "@/types";

const CART_STORAGE_KEY = "@waving-test:cart";

export const cartService = {
  // Local Storage Methods
  getLocalCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  addToLocalCart(item: CartItem): void {
    const cart = this.getLocalCart();
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.productId === item.productId
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },

  updateLocalCartItem(productId: string, quantity: number): void {
    const cart = this.getLocalCart();
    const itemIndex = cart.findIndex((item) => item.productId === productId);

    if (itemIndex >= 0) {
      cart[itemIndex].quantity = quantity;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  },

  removeFromLocalCart(productId: string): void {
    const cart = this.getLocalCart();
    const updatedCart = cart.filter((item) => item.productId !== productId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  },

  clearLocalCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
  },

  // Sync local cart with API cart when user logs in
  syncLocalCartWithApi(apiCart: CartItem[]): CartItem[] {
    const localCart = this.getLocalCart();

    // Merge local cart with API cart
    const mergedCart = [...apiCart];

    localCart.forEach((localItem) => {
      const existingItem = mergedCart.find(
        (item) => item.productId === localItem.productId
      );
      if (existingItem) {
        existingItem.quantity += localItem.quantity;
      } else {
        mergedCart.push(localItem);
      }
    });

    // Clear local cart after sync
    this.clearLocalCart();

    return mergedCart;
  },
};
