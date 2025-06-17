import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  ordersByStatus: {
    PENDING: number;
    PROCESSING: number;
    SHIPPED: number;
    DELIVERED: number;
    CANCELLED: number;
  };
  salesByMonth: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
  salesByCategory: Array<{
    category: string;
    orders: number;
    totalQuantity: number;
    revenue: number;
  }>;
  salesByDay: Array<{
    day: string;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await api.get("/orders/dashboard/stats");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
  });
}
