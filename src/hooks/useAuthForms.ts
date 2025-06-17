import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import { authService } from "@/services/auth-service";
import { loginSchema, registerSchema } from "@/schemas/auth";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function useLoginForm() {
  const router = useRouter();
  const { success, error: showError } = useNotification();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      success("Login realizado com sucesso!");
      router.push("/");
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || "Erro ao fazer login";
      showError(message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return {
    form,
    onSubmit,
    isPending: login.isPending,
  };
}

export function useRegisterForm() {
  const router = useRouter();
  const { success, error: showError } = useNotification();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signUp = useMutation({
    mutationFn: authService.signUp,
    onSuccess: () => {
      success("Conta criada com sucesso! Faça login para continuar.");
      router.push("/login");
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || "Erro ao criar conta";
      showError(message);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    signUp.mutate(data);
  };

  return {
    form,
    onSubmit,
    isPending: signUp.isPending,
  };
}
