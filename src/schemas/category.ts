import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter no mínimo 10 caracteres"),
});
