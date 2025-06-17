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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data: users, isLoading, error } = useAdminUsers(page, limit);
  const { user: currentUser } = useAuth();

  const handleSearch = () => {
    setPage(1);
    // Implementar busca se necessário
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    // Verifica se é o próprio usuário
    if (currentUser && userId === currentUser.id) {
      alert("Você não pode excluir sua própria conta!");
      return;
    }

    // Aqui você pode implementar a lógica de exclusão
    if (confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
      console.log("Excluindo usuário:", userId);
      // Implementar chamada da API de exclusão
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Erro ao carregar clientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie todos os clientes da loja
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busque clientes por nome ou email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar clientes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {users ? `${users.length} clientes encontrados` : "Carregando..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || !users ? (
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
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const isCurrentUser = currentUser && user.id === currentUser.id;

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.name}</span>
                          {user.role === "ADMIN" && (
                            <Shield className="h-4 w-4 text-blue-600" />
                          )}
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">
                              Você
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                          <span>•</span>
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(user.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge
                        className={
                          user.role === "ADMIN"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {user.role === "ADMIN" ? "Administrador" : "Cliente"}
                      </Badge>

                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={isCurrentUser || false}
                          title={
                            isCurrentUser
                              ? "Você não pode excluir sua própria conta"
                              : "Excluir usuário"
                          }
                          className={
                            isCurrentUser ? "opacity-50 cursor-not-allowed" : ""
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Aviso sobre exclusão */}
          {currentUser && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Você não pode excluir sua própria conta por questões de
                  segurança.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
