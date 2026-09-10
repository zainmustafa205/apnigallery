import type { CheckoutItem } from "@/lib/checkout-types";
import { Palette } from "lucide-react";

export default function OrderReview({
  items,
  subtotal,
}: {
  items: CheckoutItem[];
  subtotal: number;
}) {
  return (
    <div className="border-lavender bg-surface rounded-xl border p-4 sm:p-5">
      <h2 className="text-text-dark mb-3 font-semibold">Order Review</h2>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={`${item.productId}-${item.variantId}-${index}`}
            className="border-lavender/50 flex items-start justify-between gap-3 border-b pb-3 text-sm last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-text-dark line-clamp-1 font-medium">
                {item.productName}
              </p>
              {item.variantLabel && (
                <p className="text-text-dark/60 text-xs">{item.variantLabel}</p>
              )}
              <div className="mt-1 flex items-center gap-2">
                <span className="text-text-dark/60 text-xs">Qty: {item.quantity}</span>
                {item.hasDesign && (
                  <span className="bg-lavender text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]">
                    <Palette className="h-2.5 w-2.5" />
                    Custom Design
                  </span>
                )}
              </div>
            </div>
            <p className="text-text-dark font-semibold whitespace-nowrap">
              Rs. {item.lineTotal.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="border-lavender text-text-dark mt-4 flex items-center justify-between border-t pt-3 font-semibold">
        <span>Subtotal</span>
        <span>Rs. {subtotal.toLocaleString()}</span>
      </div>
    </div>
  );
}
