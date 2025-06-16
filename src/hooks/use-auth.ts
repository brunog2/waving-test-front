import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  setAuth: (token: string) => set({ isAuthenticated: true, token }),
  clearAuth: () => set({ isAuthenticated: false, token: null }),
}));
