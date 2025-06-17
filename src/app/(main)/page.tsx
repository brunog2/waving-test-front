"use client";

import { useCategories } from "@/hooks/useCategories";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Category, Product } from "@/types";
import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/products/product-card";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryWithProducts extends Category {
  products: Product[];
}

export default function Home() {
  const {
    categories,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategories(true);
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { loadMoreRef, isFetchingNextPage: isLoadingMore } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleScroll = (categoryId: string, direction: "left" | "right") => {
    const container = scrollRefs.current[categoryId];
    if (!container) return;

    const scrollAmount = container.clientWidth;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  if (isLoading || !categories) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, categoryIndex) => (
            <section key={categoryIndex} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="relative group">
                <div className="flex overflow-x-auto gap-4 pb-4 product-list-scroll snap-x snap-mandatory">
                  {Array.from({ length: 4 }).map((_, productIndex) => (
                    <div
                      key={productIndex}
                      className="snap-start w-[280px] flex-shrink-0"
                    >
                      <ProductCardSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {categories.map((category: CategoryWithProducts) => (
          <section key={category.id} className="space-y-4">
            <h2 className="text-2xl font-bold">{category.name}</h2>
            <div className="relative group">
              <div
                ref={(el) => {
                  scrollRefs.current[category.id] = el;
                }}
                className="flex overflow-x-auto gap-4 pb-4 product-list-scroll snap-x snap-mandatory"
              >
                {category.products.map((product) => (
                  <div
                    key={product.id}
                    className="snap-start w-[280px] flex-shrink-0"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
                {category.products.length >= 4 && (
                  <div className="snap-start w-[280px] flex-shrink-0">
                    <ViewAllProductsCard categoryId={category.id} />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() => handleScroll(category.id, "left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background border rounded-full p-2 shadow-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={() => handleScroll(category.id, "right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background border rounded-full p-2 shadow-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </section>
        ))}
        <div ref={loadMoreRef} className="h-10">
          {isLoadingMore && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ViewAllProductsCard({ categoryId }: { categoryId: string }) {
  return (
    <div className="h-full">
      <Link
        href={`/products?categoryId=${categoryId}`}
        className="w-full h-full flex items-center justify-center border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <span>Ver todos os produtos</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </Link>
    </div>
  );
}
