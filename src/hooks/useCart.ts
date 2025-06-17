import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { CartItem, PaginatedResponse } from "@/types";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { cartService } from "@/services/cart-service";
import { toast } from "sonner";
import { InfiniteData } from "@tanstack/react-query";

export function useCartTotal() {
  const { user } = useAuth();

  // Query para buscar quantidade total do carrinho (apenas se usuário logado)
  const { data: cartTotal, isLoading: isLoadingApi } = useQuery<number>({
    queryKey: ["cart-total"],
    queryFn: async () => {
      return await cartService.getCartTotal();
    },
    enabled: !!user, // Só executa se usuário estiver logado
  });

  const cartTotalCount = user
    ? cartTotal || 0
    : cartService.getLocalCartTotal();

  return {
    cartTotalCount,
    isLoading: user ? isLoadingApi : false,
  };
}

export function useCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query para buscar quantidade total do carrinho (apenas se usuário logado)
  const { data: cartTotal, isLoading: isLoadingApi } = useQuery<number>({
    queryKey: ["cart-total"],
    queryFn: async () => {
      return await cartService.getCartTotal();
    },
    enabled: !!user, // Só executa se usuário estiver logado
  });

  // Query infinita para buscar itens do carrinho (apenas se usuário logado)
  const {
    data: cartItemsResponse,
    isLoading: isLoadingCartItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    PaginatedResponse<CartItem>,
    Error,
    InfiniteData<PaginatedResponse<CartItem>>,
    string[],
    number
  >({
    queryKey: ["cart-items"],
    queryFn: async ({ pageParam = 1 }) => {
      return await cartService.getCart(pageParam, 10);
    },
    enabled: !!user, // Só executa se usuário estiver logado
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta?.hasNextPage) return undefined;
      return lastPage.meta.page + 1;
    },
  });

  // Carrinho da API (se usuário logado) ou localStorage (se não logado)
  const cart: CartItem[] = user
    ? cartItemsResponse?.pages?.flatMap(
        (page: PaginatedResponse<CartItem>) => page.data
      ) || []
    : cartService.getLocalCart();

  const cartTotalCount = user
    ? cartTotal || 0
    : cartService.getLocalCartTotal();

  const isLoading = user ? isLoadingApi || isLoadingCartItems : false;

  const addToCart = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      if (user) {
        // Usuário logado: adiciona diretamente na API
        const { data } = await api.post("/cart/items", { productId, quantity });
        return data;
      } else {
        // Usuário não logado: salva no localStorage
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
      if (user) {
        // Se usuário logado, atualiza tanto o total quanto os itens
        queryClient.invalidateQueries({ queryKey: ["cart-total"] });
        queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      } else {
        // Se não logado, força re-render do componente
        queryClient.setQueryData(["cart-total"], null);
      }
      toast.success("Produto adicionado ao carrinho!");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao adicionar produto ao carrinho";
      toast.error(message);
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
        const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
        return data;
      } else {
        cartService.updateLocalCartItem(itemId, quantity);
        return null;
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["cart-total"] });
        queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      } else {
        queryClient.setQueryData(["cart-total"], null);
      }
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async (itemId: string) => {
      if (user) {
        await api.delete(`/cart/items/${itemId}`);
      } else {
        cartService.removeFromLocalCart(itemId);
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["cart-total"] });
        queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      } else {
        queryClient.setQueryData(["cart-total"], null);
      }
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
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["cart-total"] });
        queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      } else {
        queryClient.setQueryData(["cart-total"], null);
      }
    },
  });

  const total = cart.reduce(
    (sum: number, item: CartItem) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  return {
    cart,
    cartTotalCount,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    total,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
