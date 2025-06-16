"use client";

import { useProduct } from "@/hooks/useProduct";
import { useComments } from "@/hooks/useComments";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Star, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { RatingStars } from "@/components/ui/rating-stars";
import { AddToCartDialog } from "@/components/cart/add-to-cart-dialog";

function ImageZoom({ src, alt }: { src: string | null; alt: string }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[500px] mx-auto aspect-square bg-white rounded-lg overflow-hidden"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        ref={imageRef}
        src={src || "/placeholder.png"}
        alt={alt}
        fill
        className={cn(
          "object-contain transition-transform duration-200",
          isZoomed && "scale-200"
        )}
        style={
          isZoomed
            ? {
                transformOrigin: `${position.x}% ${position.y}%`,
              }
            : undefined
        }
      />
      {isZoomed && (
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      )}
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useProduct(
    params.id as string
  );
  const { comments, isLoading: isLoadingComments } = useComments(
    params.id as string
  );
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);

  if (isLoadingProduct || isLoadingComments) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="w-full max-w-[500px] mx-auto aspect-square bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Link href="/products">
            <Button variant="outline">Voltar para produtos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para produtos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <ImageZoom src={product.imageUrl} alt={product.name} />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">
              Categoria: {product.category.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <RatingStars rating={product.averageRating} size="lg" />
            <span className="text-lg text-muted-foreground">
              ({product.totalRatings}{" "}
              {product.totalRatings === 1 ? "avaliação" : "avaliações"})
            </span>
          </div>

          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(product.price))}
          </p>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Descrição</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {!product.available && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Este produto está indisponível no momento</span>
            </div>
          )}

          <div className="flex gap-4">
            <AddToCartDialog
              product={product}
              open={isAddToCartOpen}
              onOpenChange={setIsAddToCartOpen}
              mode="add"
            />
            <AddToCartDialog
              product={product}
              open={isBuyNowOpen}
              onOpenChange={setIsBuyNowOpen}
              onSuccess={() => router.push("/cart")}
              mode="buy"
            />
            <Button
              size="lg"
              className="flex-1"
              disabled={!product.available}
              onClick={() => setIsBuyNowOpen(true)}
            >
              Comprar Agora
            </Button>
          </div>
        </div>
      </div>

      {/* Seção de Comentários */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Avaliações</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user.name}</span>
                  <RatingStars rating={comment.rating} size="sm" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              {comment.content && (
                <p className="mt-2 text-muted-foreground">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
