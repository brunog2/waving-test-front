"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authService,
  type LoginCredentials,
  type SignUpCredentials,
  type User,
  type AuthResponse,
} from "@/services/auth-service";
import { useNotification } from "./NotificationContext";
import { cartService } from "@/services/cart-service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: ReturnType<
    typeof useMutation<AuthResponse, Error, LoginCredentials, unknown>
  >;
  signUp: ReturnType<
    typeof useMutation<AuthResponse, Error, SignUpCredentials, unknown>
  >;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { success } = useNotification();
  const queryClient = useQueryClient();

  const syncLocalCartWithApi = async () => {
    const localCart = cartService.getLocalCart();
    if (localCart.length > 0) {
      try {
        // Converte itens do localStorage para formato da API
        const itemsToSync = localCart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        // Adiciona todos os itens de uma vez na API via endpoint bulk
        await cartService.addBulkToCart(itemsToSync);

        // Limpa localStorage após sincronização bem-sucedida
        cartService.clearLocalCart();

        // Atualiza tanto o total quanto os itens do carrinho da API
        queryClient.invalidateQueries({ queryKey: ["cart-total"] });
        queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      } catch (error) {
        console.error("Failed to sync local cart:", error);
      }
    } else {
      // Mesmo sem itens para sincronizar, invalida as queries para buscar dados atualizados
      queryClient.invalidateQueries({ queryKey: ["cart-total"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    }
  };

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const data = await authService.login(credentials);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      // Sincroniza carrinho local com API após login bem-sucedido
      await syncLocalCartWithApi();

      success("Login realizado com sucesso! Bem-vindo de volta!");
      router.push("/products");
      return data;
    },
  });

  const signUp = useMutation({
    mutationFn: async (credentials: SignUpCredentials) => {
      const data = await authService.signUp(credentials);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      // Sincroniza carrinho local com API após registro bem-sucedido
      await syncLocalCartWithApi();

      success("Conta criada com sucesso! Você foi logado automaticamente.");
      router.push("/products");
      return data;
    },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        // Restaura o estado do usuário a partir do localStorage
        const user = JSON.parse(userData);
        setUser(user);
      } else if (token && !userData) {
        // Se tem token mas não tem dados do usuário, limpa o token
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      handleSignOut();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const signOut = () => {
    handleSignOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
