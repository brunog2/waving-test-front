import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api";
import { Category, Product } from "@/types";

interface CategoryWithProducts extends Category {
  products: Product[];
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function useCategories(withProducts = false) {
  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["categories", withProducts],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await api.get<PaginatedResponse<CategoryWithProducts>>(
          "/categories/with-products",
          {
            params: {
              page: pageParam,
              limit: 5,
            },
          }
        );
        return response.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage?.meta?.hasNextPage) {
          return lastPage.meta.page + 1;
        }
        return undefined;
      },
    });

  const categories = data?.pages.flatMap((page) => page.data) || [];

  const createCategory = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const response = await api.post<Category>("/categories", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; description: string };
    }) => {
      const response = await api.put<Category>(`/categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

export function useCategory(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => api.get(`/categories/${id}`),
    enabled: !!id,
  });

  return {
    category: data,
    isLoading,
  };
}
