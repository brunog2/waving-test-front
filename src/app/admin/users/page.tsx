"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Eye, Users, Filter, User, Shield } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Dados mockados - em produção viriam da API
const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    role: "CUSTOMER",
    createdAt: "2024-01-10T10:30:00Z",
    orders: 5,
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    role: "CUSTOMER",
    createdAt: "2024-01-08T09:15:00Z",
    orders: 3,
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@email.com",
    role: "ADMIN",
    createdAt: "2024-01-01T14:20:00Z",
    orders: 0,
  },
  {
    id: "4",
    name: "Pedro Costa",
    email: "pedro@email.com",
    role: "CUSTOMER",
    createdAt: "2024-01-12T16:45:00Z",
    orders: 2,
  },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users] = useState(mockUsers);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getRoleLabel = (role: string) => {
    return role === "ADMIN" ? "Administrador" : "Cliente";
  };

  const getRoleColor = (role: string) => {
    return role === "ADMIN"
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Visualize todos os usuários cadastrados
          </p>
        </div>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Buscar Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Todos os tipos</option>
                <option value="ADMIN">Administradores</option>
                <option value="CUSTOMER">Clientes</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.role === "ADMIN" ? (
                      <Shield className="h-6 w-6 text-gray-600" />
                    ) : (
                      <User className="h-6 w-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {user.orders} {user.orders === 1 ? "pedido" : "pedidos"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Cadastrado em {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/users/${user.id}`}>
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
