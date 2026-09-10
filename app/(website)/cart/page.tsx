import { getCart } from "@/lib/actions/cart.actions";
import { SectionHeading } from "@/components/shared/section-heading";
import CartItemRow from "@/components/cart/cart-item-row";
import CartSummary from "@/components/cart/cart-summary";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default async function CartPage() {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:py-24">
        <ShoppingBag className="text-primary-light mx-auto mb-4 h-14 w-14" />
        <h1 className="text-text-dark mb-2 text-xl font-bold sm:text-2xl">
          Your cart is empty
        </h1>
        <p className="text-text-dark/70 mb-6 text-sm">
          آپ کی ٹوکری خالی ہے — چلیں کچھ خریدتے ہیں
        </p>
        <Link
          href="/shop"
          className="bg-primary hover:bg-primary-light inline-block rounded-xl px-6 py-3 font-medium text-white transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const itemsWithAvailability = cart.items.map((item) => {
    const isVariantActive = item.variant.isActive;
    const isProductActive = item.product.status === "ACTIVE";
    const isPurchasable = isVariantActive && isProductActive;
    const inStock = item.variant.stock >= item.quantity;
    const availableStock = item.variant.stock;

    return {
      ...item,
      isPurchasable,
      isAvailable: isPurchasable && inStock,
      availableStock,
    };
  });

  const hasUnavailableItem = itemsWithAvailability.some((item) => !item.isAvailable);

  const subtotal = itemsWithAvailability.reduce((sum, item) => {
    const unitPrice = item.product.basePrice + item.variant.priceAdjustment;
    return sum + unitPrice * item.quantity;
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <SectionHeading title="Your Cart" subtitle="آپ کی ٹوکری" />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {itemsWithAvailability.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal} hasUnavailableItem={hasUnavailableItem} />
        </div>
      </div>
    </div>
  );
}
