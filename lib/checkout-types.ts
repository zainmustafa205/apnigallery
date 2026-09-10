// Shared shape used by both checkout modes (direct "Buy Now" and cart-based),
// so downstream components (OrderReview, CheckoutForm) don't need to know
// which mode produced the data.

export type CheckoutItem = {
  productId: string;
  variantId: string;
  designId: string | null;
  quantity: number;
  specialInstructions: string | null;
  productName: string;
  productSlug: string;
  variantLabel: string; // e.g. "Large / Red / Ceramic" (empty string if no variant dims)
  unitPrice: number; // basePrice + priceAdjustment, already a plain number
  lineTotal: number;
  hasDesign: boolean;
};

export type CheckoutData = {
  mode: "direct" | "cart";
  items: CheckoutItem[];
  subtotal: number;
};
