"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não está carregando e há usuário logado, redireciona para produtos
    if (!isLoading && user) {
      router.replace("/products");
    }
  }, [user, isLoading, router]);

  // Se está carregando, mostra um loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se há usuário logado, mostra mensagem de redirecionamento
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                Redirecionando para produtos...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se não há usuário logado, mostra o conteúdo (páginas de login/registro)
  return <>{children}</>;
}
