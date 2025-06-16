import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AlertCircle, Star } from "lucide-react";
import { useState, useRef } from "react";
import { RatingStars } from "@/components/ui/rating-stars";

interface ProductCardProps {
  product: Product;
  className?: string;
}

function ImageZoom({ src, alt }: { src: string | undefined; alt: string }) {
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
      className="relative w-full aspect-square bg-white rounded-md overflow-hidden"
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
          isZoomed && "scale-150"
        )}
        style={
          isZoomed
            ? {
                transformOrigin: `${position.x}% ${position.y}%`,
              }
            : undefined
        }
        unoptimized={!src}
      />
      {isZoomed && (
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      )}
    </div>
  );
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const isAvailable = product.available !== false;

  return (
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
            addToCart.mutate({ productId: product.id, quantity: 1 });
          }}
          disabled={!isAvailable}
          variant={!isAvailable ? "secondary" : "default"}
        >
          {isAvailable ? "Adicionar ao Carrinho" : "Indisponível"}
        </Button>
      </CardFooter>
    </Card>
  );
}
