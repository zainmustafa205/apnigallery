"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Menu, X, Gift } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/components/providers/cart-provider";
import { MobileSearchFab } from "./mobile-search-fab";
import { useProductSearch } from "@/hooks/use-product-search";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Shop", href: "/shop", active: true },
  { label: "Gallery", href: "/gallery", active: false },
  { label: "Blog", href: "/blog", active: false },
  { label: "Contact", href: "/contact", active: false },
];

export function Header() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [desktopSearchActive, setDesktopSearchActive] = useState(false);
  const {
    query: desktopQuery,
    setQuery: setDesktopQuery,
    results: desktopResults,
    loading: desktopLoading,
  } = useProductSearch(desktopSearchActive);

  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setDesktopSearchActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                <span className="text-[19px] font-extrabold sm:text-[22px]">
                  <span className="text-[var(--color-primary)]">Apni</span>
                  <span className="text-[var(--color-accent)]">Gallery</span>
                  <span className="text-[var(--color-primary)]">.com</span>
                </span>
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

          {/* Search — desktop only, with live dropdown */}
          <div
            ref={searchWrapperRef}
            className="relative hidden max-w-sm flex-1 md:block"
          >
            <div className="flex items-center">
              <input
                type="text"
                value={desktopQuery}
                onChange={(e) => setDesktopQuery(e.target.value)}
                onFocus={() => setDesktopSearchActive(true)}
                placeholder="Search products..."
                dir="ltr"
                className="w-full rounded-l-full border border-[var(--color-lavender)] bg-[var(--color-surface-alt)] px-4 py-2 text-sm text-[var(--color-text-dark)] outline-none focus:border-[var(--color-primary)]"
              />
              <span className="flex h-[38px] w-11 items-center justify-center rounded-r-full bg-[var(--color-primary)] text-white">
                <Search size={16} />
              </span>
            </div>

            {desktopSearchActive && desktopQuery.trim() && (
              <div className="absolute top-[46px] left-0 z-50 max-h-[70vh] w-full overflow-y-auto rounded-2xl border border-[var(--color-lavender)] bg-[var(--color-surface)] p-2 shadow-xl">
                {desktopLoading && (
                  <p className="py-4 text-center text-sm text-[var(--color-text-dark)]/50">
                    Loading...
                  </p>
                )}
                {!desktopLoading && desktopResults.length === 0 && (
                  <p className="py-4 text-center text-sm text-[var(--color-text-dark)]/50">
                    No products found
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {desktopResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => {
                        setDesktopSearchActive(false);
                        setDesktopQuery("");
                      }}
                      className="flex items-center gap-3 rounded-xl p-2 hover:bg-[var(--color-lavender)]/40"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--color-lavender)]">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingCart
                              size={16}
                              className="text-[var(--color-primary)]/30"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="line-clamp-1 text-sm font-semibold text-[var(--color-text-dark)]">
                          {product.name}
                        </p>
                        <p className="text-sm font-bold text-[var(--color-primary)]">
                          Rs. {new Intl.NumberFormat("en-PK").format(product.basePrice)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

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
