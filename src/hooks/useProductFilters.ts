import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const productFiltersSchema = z.object({
  categoryId: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sortBy: z.enum(["relevance", "price", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type ProductFiltersFormData = z.infer<typeof productFiltersSchema>;

export function useProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ProductFiltersFormData>({
    resolver: zodResolver(productFiltersSchema),
    defaultValues: {
      categoryId: searchParams.get("categoryId") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sortBy:
        (searchParams.get("sortBy") as "relevance" | "price" | "name") ||
        "relevance",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
    },
  });

  const applyFilters = (values: {
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: "relevance" | "price" | "name";
    sortOrder?: "asc" | "desc";
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (values.categoryId && values.categoryId !== "all") {
      params.set("categoryId", values.categoryId);
    } else {
      params.delete("categoryId");
    }

    if (values.minPrice) {
      params.set("minPrice", values.minPrice);
    } else {
      params.delete("minPrice");
    }

    if (values.maxPrice) {
      params.set("maxPrice", values.maxPrice);
    } else {
      params.delete("maxPrice");
    }

    if (values.sortBy && values.sortBy !== "relevance") {
      params.set("sortBy", values.sortBy);
    } else {
      params.delete("sortBy");
    }

    if (values.sortOrder) {
      params.set("sortOrder", values.sortOrder);
    } else {
      params.delete("sortOrder");
    }

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    form.reset({
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
