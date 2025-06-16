import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";

export function useAuthError() {
  const { signOut } = useAuth();

  const handleAuthError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      signOut();
    }
    throw error;
  };

  return { handleAuthError };
}
