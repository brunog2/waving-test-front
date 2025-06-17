"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  User,
  LogOut,
  Package,
  ChevronDown,
  Shield,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { CartButton } from "@/components/cart/cart-button";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const search = searchParams.get("search");
    setSearchTerm(search || "");
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      newSearchParams.set("search", searchTerm.trim());
    } else {
      newSearchParams.delete("search");
    }

    router.push(`/products?${newSearchParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isAdmin = user?.role === "ADMIN";

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
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
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
            {!isAdmin && <CartButton />}
            <ModeToggle />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-8 px-2"
                  onClick={toggleDropdown}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md z-50">
                    <div className="p-3 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          Administrador
                        </p>
                      )}
                    </div>

                    <div className="p-1">
                      {!isAdmin && (
                        <>
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>Perfil</span>
                          </Link>

                          <Link
                            href="/orders"
                            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Package className="h-4 w-4" />
                            <span>Meus Pedidos</span>
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Shield className="h-4 w-4" />
                          <span>Painel Admin</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t p-1">
                      <button
                        onClick={() => {
                          signOut();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors text-red-600 hover:text-red-600 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                <Link
                  href="/admin-login"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
