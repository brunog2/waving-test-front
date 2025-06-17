import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface AdminOrder {
  id: string;
  userId: string;
  total: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: string;
    product: {
      id: string;
      name: string;
      imageUrl: string;
    };
  }>;
}

export interface AdminOrdersResponse {
  data: AdminOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function useAdminOrders(page = 1, limit = 10, status?: string) {
  return useQuery<AdminOrdersResponse>({
    queryKey: ["admin-orders", page, limit, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) {
        params.append("status", status);
      }

      const { data } = await api.get(`/orders?${params.toString()}`);
      return data;
    },
    staleTime: 30 * 1000, // 30 segundos
  });
}
