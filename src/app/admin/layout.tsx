import { RequireAdmin } from "@/components/layout/RequireAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <div className="min-h-screen bg-background">{children}</div>
    </RequireAdmin>
  );
}
