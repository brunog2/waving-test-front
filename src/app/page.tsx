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
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  if (isLoading || !categories) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
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
                  <div key={product.id} className="snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
                {category.products.length >= 4 && (
                  <div className="snap-start">
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
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Card className="w-[280px] flex-shrink-0">
      <CardHeader className="p-4">
        <div className="relative w-full h-48 bg-white rounded-md">
          <Image
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-contain rounded-md"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {product.name}
        </CardTitle>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {product.description}
        </p>
        <p className="text-lg font-bold mt-2">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(product.price)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() =>
            addToCart.mutate({ productId: product.id, quantity: 1 })
          }
        >
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}

function ViewAllProductsCard({ categoryId }: { categoryId: string }) {
  return (
    <div className="w-[280px] flex-shrink-0 h-full">
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
