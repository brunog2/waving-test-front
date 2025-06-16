import { Product } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  price: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}
