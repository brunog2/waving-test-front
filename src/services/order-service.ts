import api from "@/lib/api";
import { Order, OrdersQueryParams } from "@/types/order";
import { PaginatedResponse } from "@/types";

export const orderService = {
  async getOrders(
    params: OrdersQueryParams = {}
  ): Promise<PaginatedResponse<Order>> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.status) searchParams.append("status", params.status);

    const response = await api.get(`/orders?${searchParams.toString()}`);
    return response.data;
  },

  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  async createOrder(cartProductIds: string[]): Promise<Order> {
    const response = await api.post("/orders", { cartProductIds });
    return response.data;
  },
};
