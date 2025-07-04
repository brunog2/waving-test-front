import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RatingStars } from "@/components/ui/rating-stars";
import { AddToCartDialog } from "@/components/cart/add-to-cart-dialog";
import { useCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={`h-full flex flex-col relative ${className}`}>
      <CardHeader className="p-4">
        <Skeleton className="w-full aspect-square rounded-md" />
      </CardHeader>
      <CardContent className="p-4 space-y-4 flex-1">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>

        <Skeleton className="h-6 w-20" />
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Skeleton className="w-full h-10" />
      </CardFooter>
    </Card>
  );
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);
  const { addToCart } = useCart();
  const isAvailable = product.available !== false;

  return (
    <>
      <Card className={`h-full flex flex-col relative ${className}`}>
        {!isAvailable && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-2 text-destructive">
              <AlertCircle className="h-8 w-8" />
              <span className="font-medium">Indisponível</span>
            </div>
          </div>
        )}
        <Link
          href={`/products/${product.id}`}
          className={cn("flex-grow", !isAvailable && "pointer-events-none")}
        >
          <CardHeader className="p-4">
            <div className="relative w-full aspect-square bg-white rounded-md">
              <Image
                src={product.imageUrl || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-contain rounded-md"
                unoptimized={!product.imageUrl}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4 flex-1">
            <div className="space-y-2">
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {product.name}
              </CardTitle>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <RatingStars rating={product.averageRating} />
              <span className="text-sm text-muted-foreground">
                ({product.totalRatings})
              </span>
            </div>

            <p className="text-lg font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(product.price))}
            </p>
          </CardContent>
        </Link>
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              setIsAddToCartOpen(true);
            }}
            disabled={!isAvailable || addToCart.isPending}
            variant={!isAvailable ? "secondary" : "default"}
          >
            {addToCart.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adicionando...
              </>
            ) : isAvailable ? (
              "Adicionar ao Carrinho"
            ) : (
              "Indisponível"
            )}
          </Button>
        </CardFooter>
      </Card>

      <AddToCartDialog
        product={product}
        open={isAddToCartOpen}
        onOpenChange={setIsAddToCartOpen}
      />
    </>
  );
}
