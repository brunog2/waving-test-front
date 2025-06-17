"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";

const statusOptions = [
  { value: "all", label: "Todos os status" },
  { value: "PENDING", label: "Pendente" },
  { value: "PROCESSING", label: "Processando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
];

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const limit = 10;

  const {
    data: ordersData,
    isLoading,
    error,
  } = useAdminOrders(page, limit, status === "all" ? undefined : status);

  const handleSearch = () => {
    setPage(1);
    // Implementar busca se necessário
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">Erro ao carregar pedidos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground">
          Gerencie todos os pedidos da loja
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os pedidos por status e outros critérios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar pedidos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            {ordersData
              ? `${ordersData.meta.total} pedidos encontrados`
              : "Carregando..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || !ordersData ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : ordersData.data.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersData.data.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          #{order.id.slice(0, 8)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>Cliente ID: {order.userId.slice(0, 8)}</span>
                        <span>•</span>
                        <span>
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "itens"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatCurrency(parseFloat(order.total))}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>

                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>

                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginação */}
          {ordersData && ordersData.meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Página {page} de {ordersData.meta.totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= ordersData.meta.totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
