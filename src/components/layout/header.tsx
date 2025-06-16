"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CartButton } from "@/components/cart/cart-button";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const search = searchParams.get("search");
    setSearchTerm(search || "");
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Produtos
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Categorias
            </Link>
          </nav>

          <div className="relative w-96">
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={handleKeyPress}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <CartButton />
            <ModeToggle />
            {user ? (
              <>
                <Link
                  href="/orders"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Meus Pedidos
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className="text-sm font-medium"
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
