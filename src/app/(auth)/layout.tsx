import { RequireGuest } from "@/components/layout/RequireGuest";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireGuest>{children}</RequireGuest>;
}
