import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "CUSTOMER";
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminUsers(page = 1, limit = 10) {
  return useQuery<AdminUser[]>({
    queryKey: ["admin-users", page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/users`);
      return data;
    },
    staleTime: 30 * 1000, // 30 segundos
  });
}
