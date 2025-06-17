import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Order, OrdersQueryParams } from "@/types/order";
import { PaginatedResponse } from "@/types";
import { orderService } from "@/services/order-service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useOrders(params: OrdersQueryParams = {}) {
  const { user } = useAuth();

  return useInfiniteQuery<
    PaginatedResponse<Order>,
    Error,
    PaginatedResponse<Order>,
    (string | OrdersQueryParams)[],
    number
  >({
    queryKey: ["orders", params],
    queryFn: async ({ pageParam = 1 }) => {
      return await orderService.getOrders({
        ...params,
        page: pageParam,
        limit: params.limit || 10,
      });
    },
    enabled: !!user,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta?.hasNextPage) return undefined;
      return lastPage.meta.page + 1;
    },
  });
}

export function useOrder(orderId: string) {
  const { user } = useAuth();

  return useQuery<Order, Error>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      return await orderService.getOrder(orderId);
    },
    enabled: !!user && !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartProductIds: string[]) =>
      orderService.createOrder(cartProductIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      queryClient.invalidateQueries({ queryKey: ["cart-total"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido realizado com sucesso!");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao finalizar compra";
      toast.error(message);
    },
  });
}
