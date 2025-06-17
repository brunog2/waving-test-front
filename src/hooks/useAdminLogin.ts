import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { loginSchema } from "@/schemas/auth";
import { useNotification } from "@/contexts/NotificationContext";
import { z } from "zod";

type AdminLoginFormData = z.infer<typeof loginSchema>;

export function useAdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { success, error: showError } = useNotification();

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const response = await api.post("/auth/login", data);

      if (response.data.user.role !== "ADMIN") {
        showError(
          "Acesso negado. Apenas administradores podem acessar o painel administrativo."
        );
        form.reset();
        return;
      }

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      success("Login administrativo realizado com sucesso!");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login";
      showError(errorMessage);
      form.setValue("password", "");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    form,
    showPassword,
    onSubmit,
    togglePasswordVisibility,
    isSubmitting: form.formState.isSubmitting,
  };
}
