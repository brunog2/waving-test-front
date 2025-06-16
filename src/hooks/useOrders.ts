import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@/interfaces/order";
import api from "@/lib/axios";

interface OrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function useOrders(params?: OrdersParams) {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["orders", params],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data;
    },
  });

  const createOrder = useMutation({
    mutationFn: async (
      orderData: Omit<Order, "id" | "status" | "createdAt">
    ) => {
      const { data } = await api.post("/orders", orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Order["status"];
    }) => {
      const { data } = await api.patch(`/orders/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    orders: orders ?? [],
    total: orders?.length || 0,
    isLoading,
    createOrder,
    updateOrderStatus,
  };
}

export function useOrder(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.get(`/orders/${id}`),
    enabled: !!id,
  });

  return {
    order: data,
    isLoading,
  };
}
