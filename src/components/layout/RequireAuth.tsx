"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só redireciona se não estiver carregando E não houver usuário
    if (!isLoading && !user) {
      router.replace("/");
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

  // Se não está carregando e não há usuário, não mostra nada (será redirecionado)
  if (!user) {
    return null;
  }

  // Se há usuário, mostra o conteúdo
  return <>{children}</>;
}
