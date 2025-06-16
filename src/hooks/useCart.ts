import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItem } from "@/types";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { cartService } from "@/lib/cart-service";
import { useEffect } from "react";

interface CartItemWithPrice extends CartItem {
  price: number;
}

export function useCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: cart, isLoading } = useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (user) {
        const { data } = await api.get("/cart");
        return data;
      } else {
        return cartService.getLocalCart();
      }
    },
  });

  const addToCart = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      if (user) {
        const { data } = await api.post("/cart", { productId, quantity });
        return data;
      } else {
        // For local storage, we need to get the product details first
        const { data: product } = await api.get(`/products/${productId}`);
        const cartItem: CartItem = {
          id: Date.now().toString(),
          productId,
          userId: "local",
          quantity,
          product,
        };
        cartService.addToLocalCart(cartItem);
        return cartItem;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateCartItem = useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      if (user) {
        const { data } = await api.patch(`/cart/${itemId}`, { quantity });
        return data;
      } else {
        cartService.updateLocalCartItem(itemId, quantity);
        return null;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async (itemId: string) => {
      if (user) {
        await api.delete(`/cart/${itemId}`);
      } else {
        cartService.removeFromLocalCart(itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      if (user) {
        await api.delete("/cart");
      } else {
        cartService.clearLocalCart();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Sync local cart with API cart when user logs in
  useEffect(() => {
    if (user && cart) {
      const mergedCart = cartService.syncLocalCartWithApi(cart);
      if (mergedCart.length > 0) {
        // Add all items from merged cart to API
        mergedCart.forEach((item: CartItem) => {
          addToCart.mutate({
            productId: item.productId,
            quantity: item.quantity,
          });
        });
      }
    }
  }, [user, cart]);

  const total =
    cart?.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    ) ?? 0;

  return {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    total,
  };
}
