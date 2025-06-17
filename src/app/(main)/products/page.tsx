"use client";

import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/products/product-card";
import {
  ProductFilters,
  ProductFiltersSkeleton,
} from "@/components/products/product-filters";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface InfiniteQueryResponse<T> {
  pages: PaginatedResponse<T>[];
  pageParams: number[];
}

function ProductsPageContent() {
  const searchParams = useSearchParams();

  const sortByParam = searchParams.get("sortBy");
  const sortOrderParam = searchParams.get("sortOrder");
  const categoryIdParam = searchParams.get("categoryId");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts({
      search: searchParams.get("search") || "",
      categoryId:
        categoryIdParam && categoryIdParam !== "all"
          ? categoryIdParam
          : undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      sortBy:
        sortByParam && sortByParam !== "relevance"
          ? (sortByParam as "price" | "name")
          : undefined,
      sortOrder: (sortOrderParam as "asc" | "desc") || undefined,
    }) as { data: InfiniteQueryResponse<Product> | undefined } & Omit<
      ReturnType<typeof useProducts>,
      "data"
    >;

  const { loadMoreRef, isFetchingNextPage: isLoadingMore } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading || !data?.pages) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filtros - Skeleton */}
          <div className="md:sticky md:top-[88px] md:self-start md:h-[calc(100vh-88px)] md:flex md:flex-col">
            <div className="space-y-6 md:flex-1 md:overflow-y-auto md:pr-4">
              <ProductFiltersSkeleton />
            </div>
          </div>

          {/* Lista de produtos - Skeleton */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="w-full">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Usar um Map para garantir produtos únicos, mantendo a ordem
  const uniqueProducts = new Map<string, Product>();
  data.pages.forEach((page) => {
    page.data.forEach((product) => {
      if (!uniqueProducts.has(product.id)) {
        uniqueProducts.set(product.id, product);
      }
    });
  });
  const products = Array.from(uniqueProducts.values());

  const lastPage = data.pages[data.pages.length - 1];
  const hasMorePages = lastPage?.meta.hasNextPage;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filtros */}
        <div className="md:sticky md:top-[88px] md:self-start md:h-[calc(100vh-88px)] md:flex md:flex-col">
          <div className="space-y-6 md:flex-1 md:overflow-y-auto md:pr-4">
            <ProductFilters />
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="md:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {hasMorePages && (
                <div ref={loadMoreRef} className="h-10 mt-8">
                  {isLoadingMore && (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filtros - Skeleton */}
            <div className="md:sticky md:top-[88px] md:self-start md:h-[calc(100vh-88px)] md:flex md:flex-col">
              <div className="space-y-6 md:flex-1 md:overflow-y-auto md:pr-4">
                <ProductFiltersSkeleton />
              </div>
            </div>

            {/* Lista de produtos - Skeleton */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="w-full">
                    <ProductCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
