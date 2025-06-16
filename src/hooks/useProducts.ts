import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Product } from "@/interfaces/product";
import api from "@/lib/api";

interface ProductQuery {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductsQueryParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  };
}

export function useProducts(params: ProductsQueryParams = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      PaginatedResponse<Product>,
      Error,
      PaginatedResponse<Product>,
      (string | ProductsQueryParams)[],
      number
    >({
      queryKey: ["products", params],
      queryFn: async ({ pageParam = 1 }) => {
        const searchParams = new URLSearchParams();

        if (params.search) searchParams.set("search", params.search);
        if (params.categoryId)
          searchParams.set("categoryId", params.categoryId);
        if (params.minPrice)
          searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice)
          searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.available !== undefined)
          searchParams.set("available", String(params.available));
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
        searchParams.set("page", pageParam.toString());
        searchParams.set("limit", (params.limit || 12).toString());

        const { data } = await api.get<PaginatedResponse<Product>>(
          `/products?${searchParams.toString()}`
        );
        return data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.metadata?.hasNextPage) return undefined;
        return lastPage.metadata.page + 1;
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
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
