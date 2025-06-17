import axios from "axios";

// Variável global para armazenar as funções de notificação
let notificationContext: {
  error: (message: string) => void;
  success: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
} | null = null;

// Função para configurar o contexto de notificação
export const setNotificationContext = (context: typeof notificationContext) => {
  notificationContext = context;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Se a resposta tem uma mensagem de sucesso, exibe
    if (response.data?.message && notificationContext) {
      notificationContext.success(response.data.message);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Só redireciona se não estiver já na página de login
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }

    // Exibe mensagem de erro da API se disponível
    const errorMessage =
      error.response?.data?.message || error.message || "Erro inesperado";
    if (notificationContext) {
      notificationContext.error(errorMessage);
    }

    // Log error for debugging
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
