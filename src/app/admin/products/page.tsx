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
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useCategories } from "@/hooks/useCategories";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import Image from "next/image";

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [available, setAvailable] = useState("all");
  const limit = 12;

  const {
    data: productsData,
    isLoading,
    error,
  } = useAdminProducts(
    page,
    limit,
    search || undefined,
    categoryId === "all" ? undefined : categoryId || undefined,
    available === "all" ? undefined : available === "true"
  );

  const { categories } = useCategories();

  const handleSearch = () => {
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setPage(1);
  };

  const handleAvailableChange = (value: string) => {
    setAvailable(value);
    setPage(1);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Erro ao carregar produtos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os produtos da loja
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os produtos por categoria, disponibilidade e outros critérios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select value={categoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={available} onValueChange={handleAvailableChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Disponibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Disponível</SelectItem>
                <SelectItem value="false">Indisponível</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            {productsData
              ? `${productsData.meta.total} produtos encontrados`
              : "Carregando..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              ))}
            </div>
          ) : productsData?.data.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsData?.data.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow min-h-[280px] flex flex-col"
                >
                  <div className="relative h-32 mb-4 flex-shrink-0">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Badge
                      className={`absolute top-2 right-2 ${
                        product.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.available ? "Disponível" : "Indisponível"}
                    </Badge>
                  </div>

                  <div className="flex flex-col flex-1 space-y-2">
                    <h3 className="font-medium text-lg truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    <div className="flex flex-col space-y-2 mt-auto">
                      <span className="font-bold text-lg">
                        {formatCurrency(product.price)}
                      </span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {product.category && (
                        <Badge variant="outline" className="text-xs w-fit">
                          {product.category.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginação */}
          {productsData && productsData.meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Página {page} de {productsData.meta.totalPages}
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
                  disabled={page >= productsData.meta.totalPages}
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
