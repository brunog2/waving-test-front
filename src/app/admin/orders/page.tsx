"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Eye, ShoppingCart, Filter } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

// Dados mockados - em produção viriam da API
const mockOrders = [
  {
    id: "ORD-001",
    customer: "João Silva",
    email: "joao@email.com",
    total: 299.9,
    status: "PENDING",
    createdAt: "2024-01-15T10:30:00Z",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Maria Santos",
    email: "maria@email.com",
    total: 450.0,
    status: "PROCESSING",
    createdAt: "2024-01-15T09:15:00Z",
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "Pedro Costa",
    email: "pedro@email.com",
    total: 199.9,
    status: "SHIPPED",
    createdAt: "2024-01-14T16:45:00Z",
    items: 1,
  },
  {
    id: "ORD-004",
    customer: "Ana Oliveira",
    email: "ana@email.com",
    total: 750.0,
    status: "DELIVERED",
    createdAt: "2024-01-14T14:20:00Z",
    items: 4,
  },
];

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders] = useState(mockOrders);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">
            Visualize todos os pedidos realizados pelos clientes
          </p>
        </div>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Buscar Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, cliente ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Todos os status</option>
                <option value="PENDING">Pendente</option>
                <option value="PROCESSING">Em Processamento</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregue</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.customer} • {order.email}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-medium">
                        {formatCurrency(order.total)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {order.items} {order.items === 1 ? "item" : "itens"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge
                    status={
                      order.status as
                        | "PENDING"
                        | "PROCESSING"
                        | "SHIPPED"
                        | "DELIVERED"
                        | "CANCELLED"
                    }
                  />
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
