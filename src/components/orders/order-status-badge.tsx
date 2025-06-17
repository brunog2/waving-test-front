import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus, OrderStatusConfig } from "@/types/order";

interface OrderStatusBadgeProps {
  status: Order["status"];
  className?: string;
}

const statusConfig: Record<OrderStatus, OrderStatusConfig> = {
  PENDING: {
    label: "Pendente",
    variant: "secondary",
  },
  PROCESSING: {
    label: "Em Processamento",
    variant: "default",
  },
  SHIPPED: {
    label: "Enviado",
    variant: "default",
  },
  DELIVERED: {
    label: "Entregue",
    variant: "default",
  },
  CANCELLED: {
    label: "Cancelado",
    variant: "destructive",
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
