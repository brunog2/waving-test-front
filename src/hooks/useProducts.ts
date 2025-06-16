import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/interfaces/product";
import api from "@/lib/axios";

interface ProductQuery {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export function useProducts(query: ProductQuery = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ products: Product[]; total: number }>({
    queryKey: ["products", query],
    queryFn: async () => {
      const { data } = await api.get("/products", { params: query });
      return data;
    },
  });

  const createProduct = useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const { data } = await api.post("/products", product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...product }: Product) => {
      const { data } = await api.patch(`/products/${id}`, product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

export function useProduct(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`),
    enabled: !!id,
  });

  return {
    product: data,
    isLoading,
  };
}
