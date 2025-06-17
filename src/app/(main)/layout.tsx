import { Header } from "@/components/layout/header";
import { RequireNonAdmin } from "@/components/layout/RequireNonAdmin";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <RequireNonAdmin>
        <main className="flex-1">{children}</main>
      </RequireNonAdmin>
    </div>
  );
}
