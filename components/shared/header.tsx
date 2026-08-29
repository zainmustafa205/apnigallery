"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, X, Gift } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/components/providers/cart-provider";
import { MobileSearchFab } from "./mobile-search-fab";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Shop", href: "/shop", active: true },
  { label: "Gallery", href: "/gallery", active: false },
  { label: "Blog", href: "/blog", active: false },
  { label: "Contact", href: "/contact", active: false },
];

export function Header() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchValue.trim())}`);
      setMobileOpen(false);
    }
  }

  return (
    <header className="relative sticky top-0 z-50 w-full">
      {/* Top gradient strip — matches reference screenshot accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />

      <div className="bg-[var(--color-surface)] shadow-sm">
        {/* Row 1: Logo + Search + Cart/Theme/Menu */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-lavender)] text-[var(--color-primary)]">
              <Gift size={20} />
            </span>
            <span className="flex flex-col">
              <span className="logo-bounce relative inline-block pl-0.5">
                {/* Base layer — solid colors */}
                <span className="text-[19px] font-extrabold sm:text-[22px]">
                  <span className="text-[var(--color-primary)]">Apni</span>
                  <span className="text-[var(--color-accent)]">Gallery</span>
                  <span className="text-[var(--color-primary)]">.com</span>
                </span>

                {/* Shine layer — exact duplicate, clipped to letter shapes only */}
                <span
                  aria-hidden="true"
                  className="logo-shine-text absolute top-0 left-0.5 text-[19px] font-extrabold sm:text-[22px]"
                >
                  ApniGallery.com
                </span>
              </span>
              <span className="hidden text-xs font-[var(--font-heading-ur)] font-bold text-[var(--color-text-dark)]/80 sm:block">
                آپ کی یادیں، خوبصورت تحفوں کی صورت
              </span>
            </span>
          </Link>

          {/* Search — desktop only */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden max-w-sm flex-1 items-center md:flex"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="پروڈکٹ تلاش کریں..."
              dir="rtl"
              className="w-full rounded-l-full border border-[var(--color-lavender)] bg-[var(--color-surface-alt)] px-4 py-2 text-sm text-[var(--color-text-dark)] outline-none focus:border-[var(--color-primary)]"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-[38px] w-11 items-center justify-center rounded-r-full bg-[var(--color-primary)] text-white transition-colors hover:bg-[var(--color-primary-light)]"
            >
              <Search size={16} />
            </button>
          </form>
          {/* Row 2: Nav links — desktop, merged look via shared bg + subtle border */}
          <nav className="hidden border-[var(--color-lavender)]/60 md:block">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-7 px-4 py-2">
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
            </div>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center"
            >
              <ShoppingCart size={22} className="text-[var(--color-primary)]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center text-[var(--color-primary)] md:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile expanded panel */}
        {mobileOpen && (
          <div className="border-t border-[var(--color-lavender)]/60 px-4 py-4 select-none md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) =>
                link.active ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-dark)] transition-colors active:bg-[var(--color-lavender)] active:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span
                    key={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-dark)]/40"
                  >
                    {link.label} <span className="text-[10px]">(Coming soon)</span>
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
      <MobileSearchFab />
    </header>
  );
}
