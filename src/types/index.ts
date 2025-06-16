export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stock: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface Order {
  id: string;
  userId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}
