"use client";
import Link from "next/link";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "./CartProvider";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { totalItems } = useCart();
  const { userId, isLoaded } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#f0d9e8]">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 flex-shrink-0">
          <span className="text-2xl font-extrabold text-[#e91c78] tracking-tight italic">Super</span>
          <span className="text-2xl font-extrabold text-[#12040a] tracking-tight italic">Kid</span>
         </Link>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { href: "/", label: "Home" },
            { href: "/categories", label: "Categories" },
            { href: "/products", label: "Shop All" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-[#8c5d73] hover:text-[#e91c78] hover:bg-[#fde8f3] transition-all"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl text-[#8c5d73] hover:text-[#e91c78] hover:bg-[#fde8f3] transition-all">
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/cart"
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#8c5d73] hover:text-[#e91c78] hover:bg-[#fde8f3] transition-all mr-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e91c78] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </Link>

          {isLoaded && !userId && (
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex items-center h-9 px-5 ml-1 rounded-xl bg-[#e91c78] text-white text-sm font-bold hover:bg-[#c81568] transition-all shadow-[0_2px_12px_rgba(233,28,120,0.25)] hover:shadow-[0_4px_16px_rgba(233,28,120,0.35)] hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          )}

          {isLoaded && userId && (
            <div className="flex items-center gap-3 ml-2 border-l border-[#f0d9e8] pl-3">
              <Link href="/profile" className="w-9 h-9 bg-[#fde8f3] text-[#e91c78] font-bold rounded-xl flex items-center justify-center hover:bg-[#fdf2f7] transition-all shadow-sm border border-[#f0d9e8]/50">
                👤
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#8c5d73] hover:bg-[#fde8f3] transition-all ml-1">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
