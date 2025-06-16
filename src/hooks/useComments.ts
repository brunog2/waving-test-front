import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Comment {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: User;
}

interface CommentsResponse {
  data: Comment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function useComments(productId: string) {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery<CommentsResponse>({
    queryKey: ["comments", productId],
    queryFn: async () => {
      const response = await api.get(`/comments`, {
        params: {
          productId,
        },
      });
      return response.data;
    },
  });

  const addComment = useMutation({
    mutationFn: async (data: { rating: number; content?: string }) => {
      const response = await api.post(`/comments`, {
        productId,
        ...data,
      });
      return response.data;
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
    comments: comments?.data ?? [],
    isLoading,
    addComment,
    updateComment,
    deleteComment,
  };
}
