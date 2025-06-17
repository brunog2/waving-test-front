"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  BarChart3,
  DollarSign,
  Package,
  PieChart as PieChartIcon,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Pie,
  PieChart as PieChartRecharts,
  Bar,
  BarChart,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Erro ao carregar dados do dashboard
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Dados para gráfico de vendas por mês
  const salesByMonthData = stats.salesByMonth.map((item) => ({
    month: new Date(item.month).toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    }),
    receita: item.revenue,
    pedidos: item.orders,
  }));

  // Config para gráfico de vendas por mês
  const salesByMonthConfig = {
    receita: {
      label: "Receita",
      color: "#3b82f6", // blue-500
    },
    pedidos: {
      label: "Pedidos",
      color: "#10b981", // emerald-500
    },
  } satisfies ChartConfig;

  // Dados para gráfico de status dos pedidos
  const ordersByStatusData = Object.entries(stats.ordersByStatus).map(
    ([status, count]) => {
      const statusMap: Record<string, string> = {
        PENDING: "Pendente",
        PROCESSING: "Processando",
        SHIPPED: "Enviado",
        DELIVERED: "Entregue",
        CANCELLED: "Cancelado",
      };
      return {
        name: statusMap[status] || status,
        value: count,
      };
    }
  );

  // Config para gráfico de status dos pedidos
  const ordersByStatusConfig = Object.fromEntries(
    Object.entries(stats.ordersByStatus).map(([status], index) => {
      const statusMap: Record<string, string> = {
        PENDING: "Pendente",
        PROCESSING: "Processando",
        SHIPPED: "Enviado",
        DELIVERED: "Entregue",
        CANCELLED: "Cancelado",
      };
      const colors = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"];
      return [
        statusMap[status] || status,
        {
          label: statusMap[status] || status,
          color: colors[index % colors.length],
        },
      ];
    })
  ) satisfies ChartConfig;

  // Dados para gráfico de vendas por categoria
  const salesByCategoryData = stats.salesByCategory.map((item) => ({
    name: item.category,
    value: item.revenue,
  }));

  // Config para gráfico de vendas por categoria
  const salesByCategoryConfig = Object.fromEntries(
    stats.salesByCategory.map((item, index) => {
      const colors = ["#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"];
      return [
        item.category,
        {
          label: item.category,
          color: colors[index % colors.length],
        },
      ];
    })
  ) satisfies ChartConfig;

  // Dados para gráfico de vendas diárias
  const salesByDayData = stats.salesByDay.map((item) => ({
    day: new Date(item.day).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    receita: item.revenue,
  }));

  // Config para gráfico de vendas diárias
  const salesByDayConfig = {
    receita: {
      label: "Receita",
      color: "#8b5cf6", // violet-500
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das vendas e atividades da loja
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalSales)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de vendas realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total de pedidos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageOrderValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor médio por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Produtos mais vendidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vendas por Mês
            </CardTitle>
            <CardDescription>
              Tendência de vendas nos últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={salesByMonthConfig}
              className="min-h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByMonthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="receita"
                    stroke="#3b82f6"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="pedidos"
                    stroke="#10b981"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status dos Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Status dos Pedidos
            </CardTitle>
            <CardDescription>
              Distribuição atual dos pedidos por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={ordersByStatusConfig}
              className="min-h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChartRecharts>
                  <Pie
                    data={ordersByStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {ordersByStatusData.map((entry, index) => {
                      const colors = [
                        "#f59e0b",
                        "#3b82f6",
                        "#8b5cf6",
                        "#10b981",
                        "#ef4444",
                      ];
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChartRecharts>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Vendas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Vendas por Categoria
            </CardTitle>
            <CardDescription>
              Distribuição de vendas por categoria de produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={salesByCategoryConfig}
              className="min-h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChartRecharts>
                  <Pie
                    data={salesByCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {salesByCategoryData.map((entry, index) => {
                      const colors = [
                        "#06b6d4",
                        "#84cc16",
                        "#f97316",
                        "#ec4899",
                        "#6366f1",
                      ];
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChartRecharts>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Vendas Diárias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vendas Diárias
            </CardTitle>
            <CardDescription>Vendas dos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={salesByDayConfig}
              className="min-h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="receita" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Produtos Mais Vendidos e Pedidos Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos mais vendidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Produtos Mais Vendidos
            </CardTitle>
            <CardDescription>Top produtos com mais vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.totalQuantity} unidades vendidas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(product.totalRevenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pedidos recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Pedidos Recentes
            </CardTitle>
            <CardDescription>Últimos pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "PROCESSING"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "SHIPPED"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status === "PENDING"
                        ? "Pendente"
                        : order.status === "PROCESSING"
                        ? "Processando"
                        : order.status === "SHIPPED"
                        ? "Enviado"
                        : order.status === "DELIVERED"
                        ? "Entregue"
                        : "Cancelado"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
