import { Header } from "@/components/layout/header";
import { RequireNonAdmin } from "@/components/layout/RequireNonAdmin";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireNonAdmin>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </RequireNonAdmin>
  );
}
