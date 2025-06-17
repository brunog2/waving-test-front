import api from "@/lib/api";
import { CartItem, PaginatedResponse } from "@/types";

export const cartService = {
  async getCart(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<CartItem>> {
    const response = await api.get(`/cart?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getCartTotal(): Promise<number> {
    const response = await api.get("/cart/total");
    return response.data.totalItems;
  },

  async addToCart(item: {
    productId: string;
    quantity: number;
  }): Promise<CartItem> {
    const response = await api.post("/cart/items", item);
    return response.data;
  },

  async addBulkToCart(
    items: { productId: string; quantity: number }[]
  ): Promise<void> {
    await api.post("/cart/items/bulk", { items });
  },

  async updateCartItem({
    itemId,
    quantity,
  }: {
    itemId: string;
    quantity: number;
  }): Promise<CartItem> {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  async removeFromCart(itemId: string): Promise<void> {
    await api.delete(`/cart/items/${itemId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete("/cart");
  },

  // Métodos para gerenciar o carrinho local
  getLocalCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  },

  addToLocalCart(item: CartItem): void {
    console.log("adding", item);
    if (typeof window === "undefined") return;
    const cart = this.getLocalCart();
    const existingItem = cart.find((i) => i.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  updateLocalCartItem(itemId: string, quantity: number): void {
    if (typeof window === "undefined") return;
    const cart = this.getLocalCart();
    const item = cart.find((i) => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  },

  removeFromLocalCart(itemId: string): void {
    if (typeof window === "undefined") return;
    const cart = this.getLocalCart();
    const newCart = cart.filter((i) => i.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(newCart));
  },

  clearLocalCart(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("cart");
  },

  getLocalCartTotal(): number {
    if (typeof window === "undefined") return 0;
    const cart = this.getLocalCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
};
