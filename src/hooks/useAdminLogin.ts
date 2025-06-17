import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotification } from "@/contexts/NotificationContext";
import { authService } from "@/services/auth-service";
import { z } from "zod";

const adminLoginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export function useAdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { success, error: showError } = useNotification();

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const response = await authService.login(data);

      if (response.user.role !== "ADMIN") {
        showError(
          "Acesso negado. Apenas administradores podem acessar o painel administrativo."
        );
        form.reset();
        return;
      }

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));

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
