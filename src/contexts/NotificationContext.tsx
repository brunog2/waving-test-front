"use client";

import { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";
import { setNotificationContext } from "@/lib/api";

interface NotificationContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const success = (message: string) => {
    toast.success(message);
  };

  const error = (message: string) => {
    toast.error(message);
  };

  const warning = (message: string) => {
    toast.warning(message);
  };

  const info = (message: string) => {
    toast.info(message);
  };

  // Configura o contexto de notificação no API
  useEffect(() => {
    setNotificationContext({ success, error, warning, info });
  }, []);

  return (
    <NotificationContext.Provider value={{ success, error, warning, info }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
