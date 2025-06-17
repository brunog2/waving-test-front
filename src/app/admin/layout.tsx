import { RequireAdmin } from "@/components/layout/RequireAdmin";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </RequireAdmin>
  );
}
