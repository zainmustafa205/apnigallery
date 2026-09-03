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

export function ProductCard({
  product,
  compact = false,
  outOfStock = false,
}: {
  product: ProductCardData;
  compact?: boolean;
  outOfStock?: boolean;
}) {
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

  const cardWidth = compact ? "w-36 sm:w-40" : "w-full max-w-40 sm:max-w-48";
  const padding = compact ? "p-3" : "p-2.5 sm:p-4";
  const titleSize = compact ? "text-xs" : "text-xs sm:text-sm";
  const titleLineHeight = compact ? "leading-4" : "leading-4 sm:leading-5";
  const titleMinHeight = compact ? "min-h-[2rem]" : "min-h-[2rem] sm:min-h-[2.5rem]";
  const priceSize = compact ? "text-sm" : "text-sm sm:text-base";
  const btnPadding = compact ? "py-1.5" : "py-1.5 sm:py-2";
  const btnText = compact ? "text-[11px]" : "text-[11px] sm:text-xs";
  const iconSize = compact ? 12 : 13;
  const gap = compact ? "gap-1.5" : "gap-1.5 sm:gap-2";

  return (
    <div
      className={`flex ${cardWidth} flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-[var(--color-lavender)] bg-[var(--color-surface)] shadow-sm transition-shadow hover:shadow-md`}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square bg-[var(--color-lavender)]"
      >
        {outOfStock && (
          <span className="absolute top-2 left-2 z-10 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white">
            Out of Stock
          </span>
        )}
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`object-cover ${outOfStock ? "opacity-60 grayscale" : ""}`}
            sizes={compact ? "160px" : "(max-width: 640px) 160px, 256px"}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-primary)]/30">
            <ShoppingCart size={compact ? 28 : 36} />
          </div>
        )}
      </Link>

      <div className={`flex flex-col ${padding}`}>
        <Link href={`/products/${product.slug}`}>
          <h3
            className={`line-clamp-2 ${titleSize} ${titleLineHeight} ${titleMinHeight} font-semibold text-[var(--color-text-dark)]`}
          >
            {product.name}
          </h3>
        </Link>

        <p className={`mt-1 ${priceSize} font-bold text-[var(--color-primary)]`}>
          Rs. {formattedPrice}
          {product.variantCount > 1 && (
            <span className="text-[10px] font-normal text-[var(--color-text-dark)]/50">
              {" "}
              سے شروع
            </span>
          )}
        </p>

        <div className={`mt-2 flex flex-col ${gap}`}>
          {outOfStock ? (
            <span
              className={`flex items-center justify-center rounded-full bg-[var(--color-text-dark)]/20 ${btnPadding} ${btnText} font-semibold text-[var(--color-text-dark)]/50`}
            >
              Currently Unavailable
            </span>
          ) : hasSingleVariant ? (
            <button
              onClick={handleAddToCart}
              disabled={isPending}
              className={`flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent)] ${btnPadding} ${btnText} font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60`}
            >
              {justAdded ? (
                <>
                  <Check size={iconSize} />
                  شامل ہوگیا
                </>
              ) : (
                <>
                  <ShoppingCart size={iconSize} />
                  Add to Cart
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className={`flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent)] ${btnPadding} ${btnText} font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]`}
            >
              <ShoppingCart size={iconSize} />
              Select Options
            </Link>
          )}

          {product.isCustomizable && !outOfStock && (
            <Link
              href={`/customize/${product.slug}`}
              className={`hidden items-center justify-center gap-1.5 rounded-full border border-[var(--color-primary)] sm:flex ${btnPadding} ${btnText} font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white`}
            >
              <Sparkles size={iconSize} />
              Customize Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
