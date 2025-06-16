import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Category } from "@/types";

export function useAllCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories", "all"],
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/categories/all");
      return data;
    },
  });

  return {
    categories,
    isLoading,
  };
}
