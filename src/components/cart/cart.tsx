import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useCreateOrder } from "@/hooks/useOrders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function Cart() {
  const {
    cart,
    isLoading,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCart();

  const { loadMoreRef, isFetchingNextPage: isLoadingMore } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const createOrder = useCreateOrder();
  const router = useRouter();
  const { user } = useAuth();

  async function handleCheckout() {
    // Verifica se o usuário está logado
    if (!user) {
      toast.info("Faça login para finalizar sua compra");
      router.push("/login");
      return;
    }

    try {
      const cartProductIds = cart.map((item) => item.id);
      if (cartProductIds.length === 0) {
        toast.error("Selecione pelo menos um item do carrinho");
        return;
      }
      const order = await createOrder.mutateAsync(cartProductIds);
      router.push(`/orders/${order.id}`);
    } catch (err: unknown) {
      console.error("Erro ao finalizar compra:", err);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para produtos
        </Link>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
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
                  <Skeleton className="w-20 h-10" />
                  <Skeleton className="w-10 h-10" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para produtos
        </Link>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground mb-4">
            Adicione produtos ao seu carrinho para continuar comprando
          </p>
          <Button asChild>
            <Link href="/products">Ver produtos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="container mx-auto py-8 space-y-4">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para produtos
      </Link>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carrinho de Compras</h2>
        <Button
          variant="destructive"
          onClick={() => clearCart.mutate()}
          disabled={clearCart.isPending}
        >
          {clearCart.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Limpando...
            </>
          ) : (
            "Limpar Carrinho"
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {cart.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center gap-4">
              <Link
                href={`/products/${item.product.id}`}
                className="relative w-20 h-20 bg-white rounded-md"
              >
                <Image
                  src={item.product.imageUrl || "/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-contain rounded-md"
                  unoptimized={!item.product.imageUrl}
                />
              </Link>
              <div className="flex-1">
                <Link
                  href={`/products/${item.product.id}`}
                  className="font-semibold hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-muted-foreground">
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
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      updateCartItem.mutate({
                        itemId: item.id,
                        quantity: value,
                      });
                    }
                  }}
                  className="w-20"
                  disabled={updateCartItem.isPending}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart.mutate(item.id)}
                  disabled={removeFromCart.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Scroll infinito */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="h-10 mt-8">
          {isLoadingMore && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-xl font-bold">Total:</span>
        <span className="text-xl font-bold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(total)}
        </span>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleCheckout}
        disabled={createOrder.isPending}
      >
        {createOrder.isPending ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Finalizando...
          </>
        ) : (
          "Finalizar Compra"
        )}
      </Button>
    </div>
  );
}
