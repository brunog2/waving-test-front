import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "@/schemas/auth";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export function useLoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login } = useAuth();

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return {
    form,
    login,
    onSubmit,
    isPending: login.isPending,
  };
}

export function useRegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { signUp } = useAuth();

  const onSubmit = (data: RegisterFormData) => {
    signUp.mutate(data);
  };

  return {
    form,
    signUp,
    onSubmit,
    isPending: signUp.isPending,
  };
}
