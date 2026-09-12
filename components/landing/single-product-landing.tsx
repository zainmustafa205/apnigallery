"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

interface SingleProductLandingProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    basePrice: number;
    variants: Variant[];
    images: { url: string; isPrimary: boolean }[];
  };
}

export function SingleProductLanding({ product }: SingleProductLandingProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  const maxQty = selectedVariant ? Math.min(selectedVariant.stock, 50) : 50;

  function handleOrderNow() {
    if (product.variants.length > 1 && !selectedVariant) return;
    const variantId = selectedVariant?.id ?? product.variants[0]?.id;
    if (!variantId) return;

    const params = new URLSearchParams({
      mode: "direct",
      productId: product.id,
      variantId,
      quantity: String(quantity),
    });
    router.push(`/checkout?${params.toString()}`);
  }

  const canOrder =
    (product.variants.length <= 1 || selectedVariant) &&
    (selectedVariant ? selectedVariant.stock > 0 : true);

  return (
    <div className="mx-auto max-w-md">
      {primaryImage && (
        <div className="bg-lavender relative mb-6 aspect-square w-full overflow-hidden rounded-xl">
          <Image
            src={primaryImage.url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      )}

      <h2 className="text-text-dark mb-4 text-center text-lg font-semibold">
        {product.name}
      </h2>

      <VariantSelector
        variants={product.variants}
        basePrice={product.basePrice}
        onVariantChange={setSelectedVariant}
      />

      {product.variants.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <span className="text-text-dark text-sm font-medium">Quantity</span>
          <div className="border-lavender flex items-center gap-3 rounded-full border px-2 py-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-primary hover:bg-lavender h-7 w-7 rounded-full text-lg"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              className="text-primary hover:bg-lavender h-7 w-7 rounded-full text-lg"
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleOrderNow}
        disabled={!canOrder}
        className="bg-accent hover:bg-accent-hover mt-6 w-full rounded-xl py-3.5 text-base font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      >
        Order Now
      </button>

      {product.description && (
        <p className="text-text-dark/60 mt-4 text-center text-sm">
          {product.description}
        </p>
      )}
    </div>
  );
}
