import { RequireAuth } from "@/components/layout/RequireAuth";
import { OrderDetailsClient } from "./order-details-client";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  return (
    <RequireAuth>
      <OrderDetailsClient orderId={id} />
    </RequireAuth>
  );
}
