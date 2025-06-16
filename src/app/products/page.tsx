"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/product-card";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategories";
import { Category, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type SortBy = "price" | "name" | "createdAt";
type SortOrder = "asc" | "desc";
type FilterSortBy = SortBy | "relevance";

interface FilterState {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  available: string;
  sortBy: FilterSortBy;
  sortOrder: SortOrder;
}

interface QueryState {
  search: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  };
}

interface InfiniteQueryResponse<T> {
  pages: PaginatedResponse<T>[];
  pageParams: number[];
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Estado para os filtros do formulário
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    available: searchParams.get("available") || "all",
    sortBy: (searchParams.get("sortBy") as FilterSortBy) || "relevance",
    sortOrder: (searchParams.get("sortOrder") as SortOrder) || "asc",
  });

  // Estado para os parâmetros da query
  const [queryParams, setQueryParams] = useState<QueryState>({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    available: searchParams.get("available") === "true" ? true : undefined,
    sortBy:
      searchParams.get("sortBy") && searchParams.get("sortBy") !== "relevance"
        ? (searchParams.get("sortBy") as SortBy)
        : undefined,
    sortOrder: (searchParams.get("sortOrder") as SortOrder) || undefined,
  });

  // Atualiza os filtros quando os query params mudam
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      categoryId: searchParams.get("categoryId") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      available: searchParams.get("available") || "all",
      sortBy: (searchParams.get("sortBy") as FilterSortBy) || "relevance",
      sortOrder: (searchParams.get("sortOrder") as SortOrder) || "asc",
    });

    setQueryParams({
      search: searchParams.get("search") || "",
      categoryId: searchParams.get("categoryId") || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      available: searchParams.get("available") === "true" ? true : undefined,
      sortBy:
        searchParams.get("sortBy") && searchParams.get("sortBy") !== "relevance"
          ? (searchParams.get("sortBy") as SortBy)
          : undefined,
      sortOrder: (searchParams.get("sortOrder") as SortOrder) || undefined,
    });
  }, [searchParams]);

  const { categories } = useCategories(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts({
      search: filters.search,
      categoryId: filters.categoryId !== "all" ? filters.categoryId : undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      available:
        filters.available === "true"
          ? true
          : filters.available === "false"
          ? false
          : undefined,
      sortBy: filters.sortBy !== "relevance" ? filters.sortBy : undefined,
      sortOrder: filters.sortOrder,
    }) as { data: InfiniteQueryResponse<Product> | undefined } & Omit<
      ReturnType<typeof useProducts>,
      "data"
    >;

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.categoryId !== "all")
      params.set("categoryId", filters.categoryId);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.available !== "all") params.set("available", filters.available);
    if (filters.sortBy !== "relevance") params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      categoryId: "all",
      minPrice: "",
      maxPrice: "",
      available: "all",
      sortBy: "relevance" as FilterSortBy,
      sortOrder: "asc" as SortOrder,
    };

    setFilters(defaultFilters);
    setQueryParams({
      search: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      available: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });
    router.push("/products");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading || !data?.pages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const products = data.pages.flatMap((page) => page.data);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filtros */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Limpar filtros
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={filters.categoryId}
                onValueChange={(value: string) => {
                  setFilters((prev) => ({ ...prev, categoryId: value }));
                }}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories?.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minPrice">Preço mínimo</Label>
              <Input
                id="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, minPrice: e.target.value }));
                }}
                placeholder="R$ 0,00"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPrice">Preço máximo</Label>
              <Input
                id="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, maxPrice: e.target.value }));
                }}
                placeholder="R$ 0,00"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="available">Disponibilidade</Label>
              <Select
                value={filters.available}
                onValueChange={(value: string) => {
                  setFilters((prev) => ({ ...prev, available: value }));
                }}
              >
                <SelectTrigger id="available" className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Disponíveis</SelectItem>
                  <SelectItem value="false">Indisponíveis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortBy">Ordenar por</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: FilterSortBy | "relevance") => {
                  setFilters((prev) => ({ ...prev, sortBy: value }));
                }}
              >
                <SelectTrigger id="sortBy" className="w-full">
                  <SelectValue placeholder="Relevância" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="createdAt">Data de criação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filters.sortBy !== "relevance" && (
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Ordem</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: SortOrder) => {
                    setFilters((prev) => ({ ...prev, sortOrder: value }));
                  }}
                >
                  <SelectTrigger id="sortOrder" className="w-full">
                    <SelectValue placeholder="Crescente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Crescente</SelectItem>
                    <SelectItem value="desc">Decrescente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div ref={loadMoreRef} className="h-10 mt-8">
            {isFetchingNextPage && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
