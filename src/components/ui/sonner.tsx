"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "!bg-red-50 !text-red-900 !border-red-200 dark:!bg-red-900/20 dark:!text-red-100 dark:!border-red-800",
          success:
            "!bg-green-50 !text-green-900 !border-green-200 dark:!bg-green-900/20 dark:!text-green-100 dark:!border-green-800",
          warning:
            "!bg-yellow-50 !text-yellow-900 !border-yellow-200 dark:!bg-yellow-900/20 dark:!text-yellow-100 dark:!border-yellow-800",
          info: "!bg-blue-50 !text-blue-900 !border-blue-200 dark:!bg-blue-900/20 dark:!text-blue-100 dark:!border-blue-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
