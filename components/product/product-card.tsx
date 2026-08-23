"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Sparkles, Check } from "lucide-react";
import { addToCart } from "@/lib/actions/cart.actions";
import { useCart } from "@/components/providers/cart-provider";

type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  isCustomizable: boolean;
  imageUrl: string | null;
  variantCount: number;
  singleVariantId: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { refreshCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-PK").format(product.basePrice);
  const hasSingleVariant = product.variantCount === 1 && product.singleVariantId;

  function handleAddToCart() {
    if (!product.singleVariantId) return;

    startTransition(async () => {
      const result = await addToCart({
        productId: product.id,
        variantId: product.singleVariantId!,
        quantity: 1,
      });

      if (result.success) {
        await refreshCart();
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
      }
    });
  }

  return (
    <div className="flex w-56 flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-[var(--color-lavender)] bg-[var(--color-surface)] shadow-sm transition-shadow hover:shadow-md sm:w-64">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square bg-[var(--color-lavender)]"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 224px, 256px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-primary)]/30">
            <ShoppingCart size={40} />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-[var(--color-text-dark)]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-base font-bold text-[var(--color-primary)]">
          Rs. {formattedPrice}
          {product.variantCount > 1 && (
            <span className="text-xs font-normal text-[var(--color-text-dark)]/50">
              {" "}
              se شروع
            </span>
          )}
        </p>

        <div className="mt-3 flex flex-col gap-2">
          {hasSingleVariant ? (
            <button
              onClick={handleAddToCart}
              disabled={isPending}
              className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent)] py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
            >
              {justAdded ? (
                <>
                  <Check size={14} /> شامل ہوگیا
                </>
              ) : (
                <>
                  <ShoppingCart size={14} /> Add to Cart
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent)] py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              <ShoppingCart size={14} /> Select Options
            </Link>
          )}

          {product.isCustomizable && (
            <Link
              href={`/customize/${product.slug}`}
              className="flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-primary)] py-2 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
            >
              <Sparkles size={14} /> Customize Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
