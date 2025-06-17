import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductsResponse {
  data: AdminProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function useAdminProducts(
  page = 1,
  limit = 10,
  search?: string,
  categoryId?: string,
  available?: boolean
) {
  return useQuery<AdminProductsResponse>({
    queryKey: ["admin-products", page, limit, search, categoryId, available],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (categoryId) {
        params.append("categoryId", categoryId);
      }

      if (available !== undefined) {
        params.append("available", available.toString());
      }

      const { data } = await api.get(`/products?${params.toString()}`);
      return data;
    },
    staleTime: 30 * 1000, // 30 segundos
  });
}
