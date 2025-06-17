"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RequireNonAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não está carregando e o usuário é admin, redireciona para o dashboard admin
    if (!isLoading && user && user.role === "ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [user, isLoading, router]);

  // Se está carregando, mostra um loader
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Se o usuário é admin, mostra mensagem de redirecionamento
  if (user && user.role === "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Redirecionando para o painel administrativo...</p>
          </div>
        </div>
      </div>
    );
  }

  // Se não é admin ou não está logado, mostra o conteúdo
  return <>{children}</>;
} 