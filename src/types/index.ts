export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  available: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: Category;
  averageRating: number;
  totalRatings: number;
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Comment {
  id: string;
  userId: string;
  productId: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}
