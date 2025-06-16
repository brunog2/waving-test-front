import { z } from "zod";

export const commentSchema = z.object({
  rating: z
    .number()
    .min(1, "A avaliação deve ser entre 1 e 5")
    .max(5, "A avaliação deve ser entre 1 e 5"),
  content: z.string().min(10, "O comentário deve ter no mínimo 10 caracteres"),
});
