"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ImageOff, AlertTriangle } from "lucide-react";
import { updateCartItemQuantity, removeCartItem } from "@/lib/actions/cart.actions";
import { useCart } from "@/components/providers/cart-provider";

type CartItemWithAvailability = {
  id: string;
  quantity: number;
  specialInstructions: string | null;
  isPurchasable: boolean;
  isAvailable: boolean;
  availableStock: number;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    status: string;
  };
  variant: {
    id: string;
    size: string | null;
    color: string | null;
    material: string | null;
    priceAdjustment: number;
    stock: number;
    image: string | null;
    isActive: boolean;
  };
  design: {
    id: string;
    previewImageUrl: string | null;
  } | null;
};

export default function CartItemRow({ item }: { item: CartItemWithAvailability }) {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const unitPrice = item.product.basePrice + item.variant.priceAdjustment;
  const lineTotal = unitPrice * item.quantity;

  const variantLabel = [item.variant.size, item.variant.color, item.variant.material]
    .filter(Boolean)
    .join(" / ");

  const maxQuantity = Math.min(item.availableStock, 50);

  function handleQuantityChange(newQuantity: number) {
    if (newQuantity < 1 || isPending || !item.isPurchasable) return;

    const cappedQuantity = Math.min(
      newQuantity,
      maxQuantity > 0 ? maxQuantity : newQuantity
    );

    setLocalQuantity(cappedQuantity);

    startTransition(async () => {
      const result = await updateCartItemQuantity(item.id, cappedQuantity);
      if (result.success) {
        router.refresh();
      } else {
        setLocalQuantity(item.quantity);
      }
    });
  }

  function handleRemove() {
    if (isPending) return;

    startTransition(async () => {
      const result = await removeCartItem(item.id);
      if (result.success) {
        await refreshCart();
        router.refresh();
      }
    });
  }

  return (
    <div
      className={`bg-surface flex flex-col gap-2 rounded-lg border p-2.5 ${
        item.isAvailable ? "border-lavender" : "border-red-300"
      }`}
    >
      {!item.isAvailable && (
        <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {!item.isPurchasable
            ? item.product.status !== "ACTIVE"
              ? "This product is no longer available — please remove it."
              : "This option is no longer available — please remove it."
            : `Only ${item.availableStock} left in stock — reduce quantity or remove.`}
        </div>
      )}

      <div className="flex gap-3">
        <div className="bg-surface-alt relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md sm:h-16 sm:w-16">
          {item.variant.image ? (
            <Image
              src={item.variant.image}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <ImageOff className="text-text-dark/30 h-5 w-5" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <div>
            <Link
              href={`/products/${item.product.slug}`}
              className="text-text-dark hover:text-primary line-clamp-1 text-sm font-medium"
            >
              {item.product.name}
            </Link>
            {variantLabel && (
              <p className="text-text-dark/60 text-xs leading-tight">{variantLabel}</p>
            )}
            {item.design && (
              <span className="bg-lavender text-primary mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[10px]">
                Custom Design
              </span>
            )}
          </div>

          <div className="border-lavender flex w-fit items-center overflow-hidden rounded-md border">
            <button
              onClick={() => handleQuantityChange(localQuantity - 1)}
              disabled={isPending || !item.isPurchasable || localQuantity <= 1}
              className="hover:bg-surface-alt p-1 disabled:opacity-40"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-[1.5rem] px-2 text-center text-xs font-medium">
              {localQuantity}
            </span>
            <button
              onClick={() => handleQuantityChange(localQuantity + 1)}
              disabled={isPending || !item.isPurchasable || localQuantity >= maxQuantity}
              className="hover:bg-surface-alt p-1 disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between">
          <button
            onClick={handleRemove}
            disabled={isPending}
            aria-label="Remove item"
            className="text-text-dark/40 transition-colors hover:text-red-600 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-text-dark text-sm font-semibold whitespace-nowrap">
            Rs. {lineTotal.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
