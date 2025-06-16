import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/interfaces/category";
import api from "@/lib/axios";

export function useCategories() {
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data;
    },
  });

  const createCategory = useMutation({
    mutationFn: async (category: Omit<Category, "id">) => {
      const { data } = await api.post("/categories", category);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...category }: Category) => {
      const { data } = await api.patch(`/categories/${id}`, category);
      return data;
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
    categories: categories ?? [],
    isLoading,
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
