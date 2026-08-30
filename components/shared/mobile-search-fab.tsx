"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ShoppingCart } from "lucide-react";
import { useProductSearch } from "@/hooks/use-product-search";

export function MobileSearchFab() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, results, loading } = useProductSearch(open);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 250);
    } else {
      setQuery("");
    }
  }, [open, setQuery]);

  return (
    <div
      className="absolute top-full z-40 mt-2 sm:hidden"
      style={{ right: open ? 12 : 0 }}
    >
      <div
        className={`flex items-center bg-[var(--color-primary)] shadow-lg transition-all duration-300 ease-out ${
          open
            ? "w-[calc(100vw-24px)] rounded-2xl bg-[var(--color-surface)]"
            : "w-11 rounded-l-2xl"
        }`}
        style={{ height: 44 }}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close search"
          className={`flex h-11 flex-shrink-0 items-center justify-center overflow-hidden text-[var(--color-text-dark)]/60 transition-all duration-200 ${
            open ? "w-10 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <X size={18} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          dir="ltr"
          className={`h-full min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text-dark)] transition-opacity duration-200 outline-none ${
            open ? "px-1 opacity-100" : "w-0 px-0 opacity-0"
          }`}
        />

        <button
          onClick={() => {
            if (!open) setOpen(true);
          }}
          aria-label="Open search"
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center text-white transition-colors ${
            open
              ? "rounded-r-2xl bg-[var(--color-primary)]"
              : "rounded-l-2xl bg-[var(--color-primary)]"
          }`}
        >
          <Search size={18} />
        </button>
      </div>

      {open && query.trim() && (
        <div
          className="absolute top-[52px] left-0 max-h-[60vh] overflow-y-auto rounded-2xl bg-[var(--color-surface)] p-2 shadow-xl"
          style={{ width: "calc(100vw - 24px)" }}
        >
          {loading && (
            <p className="py-4 text-center text-sm text-[var(--color-text-dark)]/50">
              لوڈ ہو رہا ہے...
            </p>
          )}
          {!loading && results.length === 0 && (
            <p className="py-4 text-center text-sm text-[var(--color-text-dark)]/50">
              کوئی پروڈکٹ نہیں ملا
            </p>
          )}
          <div className="flex flex-col gap-2">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-lavender)] p-2"
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
                  <p className="line-clamp-1 text-xs font-semibold text-[var(--color-text-dark)]">
                    {product.name}
                  </p>
                  <p className="text-xs font-bold text-[var(--color-primary)]">
                    Rs. {new Intl.NumberFormat("en-PK").format(product.basePrice)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
