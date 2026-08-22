"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/components/providers/cart-provider";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Shop", href: "/shop", active: true },
  { label: "Gallery", href: "/gallery", active: false },
  { label: "Blog", href: "/blog", active: false },
  { label: "Contact", href: "/contact", active: false },
];

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-lavender)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-[var(--color-primary)]">
          Apni<span className="text-[var(--color-accent)]">Gallery</span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) =>
            link.active ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--color-text-dark)] transition-colors hover:text-[var(--color-accent)]"
              >
                {link.label}
              </Link>
            ) : (
              <span
                key={link.href}
                title="Coming soon"
                className="cursor-not-allowed text-sm font-medium text-[var(--color-text-dark)]/40"
              >
                {link.label}
              </span>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/cart" className="relative">
            <ShoppingCart size={22} className="text-[var(--color-primary)]" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
