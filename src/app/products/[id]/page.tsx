"use client";

import { useProduct } from "@/hooks/useProduct";
import { Button } from "@/components/ui/button";
import { AddToCartDialog } from "@/components/cart/add-to-cart-dialog";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage() {
  const params = useParams();
  const { data: product, isLoading } = useProduct(params.id as string);
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button variant="outline" asChild>
            <a href="/products">Voltar para produtos</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            className="object-contain w-full h-full"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(product.price))}
            </p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex items-center gap-4">
            <AddToCartDialog
              product={product}
              open={isAddToCartOpen}
              onOpenChange={setIsAddToCartOpen}
            />
            <Button variant="outline" asChild>
              <a href="/products">Voltar para Produtos</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
