import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export type SortBy = "price" | "name";
export type SortOrder = "asc" | "desc";

export const formSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sortBy: z.enum(["relevance", "price", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export function useProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: searchParams.get("search") || "",
      categoryId: searchParams.get("categoryId") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sortBy:
        (searchParams.get("sortBy") as "relevance" | "price" | "name") ||
        "relevance",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
    },
  });

  useEffect(() => {
    form.reset({
      search: searchParams.get("search") || "",
      categoryId: searchParams.get("categoryId") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sortBy:
        (searchParams.get("sortBy") as "relevance" | "price" | "name") ||
        "relevance",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
    });
  }, [searchParams, form]);

  const applyFilters = (values: FormValues) => {
    const newSearchParams = new URLSearchParams();

    if (values.search) newSearchParams.set("search", values.search);
    if (values.categoryId && values.categoryId !== "all")
      newSearchParams.set("categoryId", values.categoryId);
    if (values.minPrice) newSearchParams.set("minPrice", values.minPrice);
    if (values.maxPrice) newSearchParams.set("maxPrice", values.maxPrice);
    if (values.sortBy && values.sortBy !== "relevance")
      newSearchParams.set("sortBy", values.sortBy);
    if (values.sortOrder) newSearchParams.set("sortOrder", values.sortOrder);

    router.push(`/products?${newSearchParams.toString()}`);
  };

  const clearFilters = () => {
    form.reset({
      search: "",
      categoryId: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "relevance",
      sortOrder: undefined,
    });
    router.push("/products");
  };

  return {
    form,
    applyFilters,
    clearFilters,
  };
}
