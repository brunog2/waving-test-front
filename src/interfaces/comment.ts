import { User } from "./user";

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
