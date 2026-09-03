"use client";

import { useMemo, useState, useEffect } from "react";

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
  variants: Variant[];
  basePrice: number;
  onVariantChange?: (variant: Variant | null) => void;
};

const DIMENSIONS = ["size", "color", "material"] as const;
type Dimension = (typeof DIMENSIONS)[number];

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export default function VariantSelector({ variants, basePrice, onVariantChange }: Props) {
  // Which dimensions are actually used by this product's variants
  const activeDimensions = useMemo(
    () =>
      DIMENSIONS.filter((dim) => variants.some((v) => v[dim] !== null && v[dim] !== "")),
    [variants]
  );

  // Default selection: first in-stock variant's values, else first variant's values
  const defaultVariant = useMemo(
    () => variants.find((v) => v.stock > 0) || variants[0] || null,
    [variants]
  );

  const [selected, setSelected] = useState<Partial<Record<Dimension, string>>>(() => {
    const initial: Partial<Record<Dimension, string>> = {};
    if (defaultVariant) {
      activeDimensions.forEach((dim) => {
        const val = defaultVariant[dim];
        if (val) initial[dim] = val;
      });
    }
    return initial;
  });

  const matchedVariant = useMemo(() => {
    return (
      variants.find((v) =>
        activeDimensions.every((dim) => v[dim] === (selected[dim] ?? null))
      ) || null
    );
  }, [variants, activeDimensions, selected]);

  useEffect(() => {
    onVariantChange?.(matchedVariant);
  }, [matchedVariant, onVariantChange]);

  const currentPrice = basePrice + (matchedVariant?.priceAdjustment ?? 0);

  function getOptionsFor(dim: Dimension) {
    const values = Array.from(
      new Set(variants.map((v) => v[dim]).filter(Boolean))
    ) as string[];
    return values;
  }

  function isOptionAvailable(dim: Dimension, value: string) {
    // Is there ANY variant with stock>0 matching this value + currently selected other dims?
    return variants.some(
      (v) =>
        v[dim] === value &&
        v.stock > 0 &&
        activeDimensions
          .filter((d) => d !== dim)
          .every((d) => !selected[d] || v[d] === selected[d])
    );
  }

  function handleSelect(dim: Dimension, value: string) {
    setSelected((prev) => ({ ...prev, [dim]: value }));
  }

  // Single variant, no real choice to make — just show price
  if (variants.length <= 1) {
    return (
      <div className="text-2xl font-bold text-[var(--color-primary)]">
        {formatPKR(currentPrice)}
      </div>
    );
  }

  const dimLabels: Record<Dimension, string> = {
    size: "Size",
    color: "Color",
    material: "Material",
  };

  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold text-[var(--color-primary)]">
        {formatPKR(currentPrice)}
      </div>

      {activeDimensions.map((dim) => (
        <div key={dim}>
          <p className="mb-2 text-sm font-medium text-[var(--color-text-dark)]">
            {dimLabels[dim]}
          </p>
          <div className="flex flex-wrap gap-2">
            {getOptionsFor(dim).map((value) => {
              const isSelected = selected[dim] === value;
              const available = isOptionAvailable(dim, value);

              return (
                <button
                  key={value}
                  type="button"
                  disabled={!available}
                  onClick={() => handleSelect(dim, value)}
                  className={`relative rounded-lg border px-4 py-2 text-sm transition-colors ${
                    isSelected && available
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 font-medium text-[var(--color-accent)]"
                      : available
                        ? "border-[var(--color-lavender)] text-[var(--color-text-dark)] hover:border-[var(--color-primary-light)]"
                        : "cursor-not-allowed border-[var(--color-lavender)] text-[var(--color-text-dark)]/30"
                  }`}
                >
                  {value}
                  {!available && (
                    <span className="mt-0.5 block text-[10px] leading-none">
                      Out of Stock
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!matchedVariant && (
        <p className="text-sm text-[var(--color-accent)]">
          Please select a valid combination.
        </p>
      )}

      {matchedVariant && matchedVariant.stock === 0 && (
        <p className="text-sm font-medium text-[var(--color-accent)]">
          This option is currently out of stock.
        </p>
      )}
    </div>
  );
}
