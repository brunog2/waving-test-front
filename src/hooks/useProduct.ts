import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Product } from "@/types";

interface ProductWithCategory extends Product {
  category: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get<ProductWithCategory>(`/products/${id}`);
      return data;
    },
  });
}
