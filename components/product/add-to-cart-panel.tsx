// components/product/add-to-cart-panel.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ShoppingCart, Sparkles, Check, Minus, Plus, Zap } from "lucide-react";
import { addToCart } from "@/lib/actions/cart.actions";
import { useCart } from "@/components/providers/cart-provider";
import VariantSelector from "@/components/product/variant-selector";

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  material: string | null;
  sku: string;
  priceAdjustment: number;
  stock: number;
};

type Props = {
  productId: string;
  productSlug: string;
  isCustomizable: boolean;
  variants: Variant[];
  basePrice: number;
};

export default function AddToCartPanel({
  productId,
  productSlug,
  isCustomizable,
  variants,
  basePrice,
}: Props) {
  const { refreshCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const maxQty = selectedVariant ? Math.min(selectedVariant.stock, 50) : 0;
  const canOrder = !!selectedVariant && selectedVariant.stock > 0 && quantity >= 1;

  function handleVariantChange(variant: Variant | null) {
    setSelectedVariant((prev) => {
      if (prev?.id !== variant?.id) {
        setQuantity(1);
        setErrorMsg(null);
      }
      return variant;
    });
  }

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQuantity((q) => Math.min(maxQty, q + 1));
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    setErrorMsg(null);

    startTransition(async () => {
      const result = await addToCart({
        productId,
        variantId: selectedVariant.id,
        quantity,
      });

      if (result.success) {
        await refreshCart();
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
      } else {
        setErrorMsg(result.error || "Something went wrong. Please try again.");
      }
    });
  }

  // Buy Now — bypasses cart entirely, goes straight to a direct checkout
  // (checkout page itself is built in Chat 11 — this link is correct/expected
  // to 404 for now, same as the Customize button below linking to Chat 10's page)
  const buyNowHref = selectedVariant
    ? `/checkout?mode=direct&productId=${productId}&variantId=${selectedVariant.id}&quantity=${quantity}`
    : "#";

  return (
    <div className="space-y-5">
      <VariantSelector
        variants={variants}
        basePrice={basePrice}
        onVariantChange={handleVariantChange}
      />

      {selectedVariant && selectedVariant.stock > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-text-dark)]">
            Quantity
          </p>
          <div className="inline-flex items-center overflow-hidden rounded-lg border border-[var(--color-lavender)]">
            <button
              type="button"
              onClick={decreaseQty}
              disabled={quantity <= 1}
              className="p-2 hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-[2.5rem] px-4 text-center text-sm font-medium text-[var(--color-text-dark)]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increaseQty}
              disabled={quantity >= maxQty}
              className="p-2 hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="ml-3 text-xs text-[var(--color-text-dark)]/50">
            {selectedVariant.stock} available
          </span>
        </div>
      )}

      {errorMsg && (
        <p className="text-sm font-medium text-[var(--color-accent)]">{errorMsg}</p>
      )}

      {/* Primary actions: Add to Cart + Buy Now */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canOrder || isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-accent)] py-3 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--color-accent)]"
        >
          {justAdded ? (
            <>
              <Check size={16} />
              Added
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>

        <Link
          href={canOrder ? buyNowHref : "#"}
          aria-disabled={!canOrder}
          onClick={(e) => {
            if (!canOrder) e.preventDefault();
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors ${
            canOrder
              ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]"
              : "cursor-not-allowed bg-[var(--color-accent)]/40"
          }`}
        >
          <Zap size={16} />
          Buy Now
        </Link>
      </div>

      {/* Secondary action: Customize — always rendered, disabled if not customizable, for layout consistency */}
      <Link
        href={isCustomizable ? `/customize/${productSlug}` : "#"}
        aria-disabled={!isCustomizable}
        onClick={(e) => {
          if (!isCustomizable) e.preventDefault();
        }}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
          isCustomizable
            ? "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            : "cursor-not-allowed border-[var(--color-lavender)] text-[var(--color-text-dark)]/30"
        }`}
      >
        <Sparkles size={16} />
        {isCustomizable ? "Customize This Product" : "Customization Not Available"}
      </Link>
    </div>
  );
}
