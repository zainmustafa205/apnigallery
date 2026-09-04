"use client";

interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  material: string | null;
  sku: string;
  priceAdjustment: number;
  stock: number;
  image: string | null;
}

interface OrderBuilderProps {
  productId: string;
  productName: string;
  productSlug: string;
  basePrice: number;
  customizationType: "IMAGE_ONLY" | "TEXT_ONLY" | "BOTH";
  mockupImageUrl: string | null;
  variants: Variant[];
}

export function OrderBuilder(props: OrderBuilderProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-bold text-[color:var(--color-text-dark)]">
        Customize: {props.productName}
      </h1>
      <pre className="mt-4 overflow-auto rounded-lg bg-[color:var(--color-surface-alt)] p-4 text-xs">
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  );
}
