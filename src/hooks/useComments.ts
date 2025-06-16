import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment } from "@/interfaces/comment";
import api from "@/lib/axios";

export function useComments(productId: string) {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}/comments`);
      return data;
    },
    enabled: !!productId,
  });

  const addComment = useMutation({
    mutationFn: async (comment: Omit<Comment, "id" | "createdAt">) => {
      const { data } = await api.post(
        `/products/${productId}/comments`,
        comment
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
  });

  const updateComment = useMutation({
    mutationFn: async ({ id, ...comment }: Comment) => {
      const { data } = await api.patch(
        `/products/${productId}/comments/${id}`,
        comment
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${productId}/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
  });

  return {
    comments: comments ?? [],
    isLoading,
    addComment,
    updateComment,
    deleteComment,
  };
}
