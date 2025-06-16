import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter no mínimo 10 caracteres"),
  price: z.number().min(0, "O preço deve ser maior ou igual a 0"),
  image: z.string().url("URL da imagem inválida"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  stock: z.number().int().min(0, "O estoque deve ser maior ou igual a 0"),
  available: z.boolean(),
});
