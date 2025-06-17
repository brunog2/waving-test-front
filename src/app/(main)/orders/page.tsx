"use client";

import { useOrders } from "@/hooks/useOrders";
import { OrderCard, OrderCardSkeleton } from "@/components/orders/order-card";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Order, OrderStatus } from "@/types/order";
import { PaginatedResponse } from "@/types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface InfiniteQueryResponse<T> {
  pages: PaginatedResponse<T>[];
  pageParams: number[];
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const [selectedStatus, setSelectedStatus] = useState<string>(
    statusParam || "all"
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useOrders({
      status:
        selectedStatus === "all" ? undefined : (selectedStatus as OrderStatus),
    }) as { data: InfiniteQueryResponse<Order> | undefined } & Omit<
      ReturnType<typeof useOrders>,
      "data"
    >;

  const { loadMoreRef, isFetchingNextPage: isLoadingMore } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    // Atualizar a URL sem recarregar a página
    const url = new URL(window.location.href);
    if (value && value !== "all") {
      url.searchParams.set("status", value);
    } else {
      url.searchParams.delete("status");
    }
    window.history.pushState({}, "", url.toString());
  };

  if (isLoading || !data?.pages) {
    return (
      <RequireAuth>
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>

            <div>
              <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
              <p className="text-muted-foreground">
                Acompanhe o status dos seus pedidos
              </p>
            </div>

            <div className="flex justify-end">
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="PROCESSING">Em Processamento</SelectItem>
                  <SelectItem value="SHIPPED">Enviado</SelectItem>
                  <SelectItem value="DELIVERED">Entregue</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <OrderCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </main>
      </RequireAuth>
    );
  }

  // Usar um Map para garantir pedidos únicos, mantendo a ordem
  const uniqueOrders = new Map<string, Order>();
  data.pages.forEach((page) => {
    page.data.forEach((order) => {
      if (!uniqueOrders.has(order.id)) {
        uniqueOrders.set(order.id, order);
      }
    });
  });
  const orders = Array.from(uniqueOrders.values());

  const lastPage = data.pages[data.pages.length - 1];
  const hasMorePages = lastPage?.meta.hasNextPage;

  return (
    <RequireAuth>
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <div>
            <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
            <p className="text-muted-foreground">
              Acompanhe o status dos seus pedidos
            </p>
          </div>

          <div className="flex justify-end">
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="PROCESSING">Em Processamento</SelectItem>
                <SelectItem value="SHIPPED">Enviado</SelectItem>
                <SelectItem value="DELIVERED">Entregue</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-muted-foreground">
                {selectedStatus !== "all"
                  ? "Não há pedidos com o status selecionado"
                  : "Você ainda não fez nenhum pedido"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order: Order) => (
                  <OrderCard key={order.id} order={order} />
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
      </main>
    </RequireAuth>
  );
}
