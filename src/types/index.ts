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
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CartItem {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
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
  content: string | null;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Re-export existing types
export * from "./cart";
export * from "./order";
