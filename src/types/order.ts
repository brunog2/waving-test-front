export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  items: OrderItem[];
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export interface OrderStatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
}
