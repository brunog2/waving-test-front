import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export function CartItems() {
  const { cart, isLoading, updateCartItem, removeFromCart, clearCart, total } =
    useCart();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">Seu carrinho está vazio</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carrinho de Compras</h2>
        <Button variant="destructive" onClick={() => clearCart.mutate()}>
          Limpar Carrinho
        </Button>
      </div>

      <div className="space-y-4">
        {cart.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 bg-white rounded-md">
                <Image
                  src={item.product.imageUrl || "/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-contain rounded-md"
                  unoptimized={!item.product.imageUrl}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(item.product.price))}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateCartItem.mutate({
                      itemId: item.id,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  className="w-20"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart.mutate(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-xl font-bold">Total:</span>
        <span className="text-xl font-bold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(total)}
        </span>
      </div>

      <Button className="w-full">Finalizar Compra</Button>
    </div>
  );
}
