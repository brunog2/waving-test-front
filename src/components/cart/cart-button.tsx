import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CartButton() {
  const { cart } = useCart();
  const itemCount = cart?.length || 0;

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/cart" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
