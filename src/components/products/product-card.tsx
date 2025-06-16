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
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="p-4">
        <div className="relative w-full aspect-square bg-white rounded-md">
          <Image
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            fill
            className={cn(
              "object-contain rounded-md",
              !product.available && "opacity-50"
            )}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
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
        {!product.available && (
          <p className="text-sm text-destructive mt-2">Indisponível</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() =>
            addToCart.mutate({ productId: product.id, quantity: 1 })
          }
          disabled={!product.available}
        >
          {product.available ? "Adicionar ao Carrinho" : "Indisponível"}
        </Button>
      </CardFooter>
    </Card>
  );
}
