import { getCart } from "@/lib/actions/cart.actions";
import { SectionHeading } from "@/components/shared/section-heading";
import CartItemRow from "@/components/cart/cart-item-row";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CartSummary from "@/components/cart/cart-summary";

export default async function CartPage() {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:py-24">
        <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-[--color-primary-light]" />
        <h1 className="mb-2 text-xl font-bold text-[--color-text-dark] sm:text-2xl">
          Your cart is empty
        </h1>
        <p className="mb-6 text-sm text-[--color-text-dark]/70">
          آپ کی ٹوکری خالی ہے — چلیں کچھ خریدتے ہیں
        </p>
        <Link
          href="/shop"
          className="inline-block rounded-xl bg-[--color-primary] px-6 py-3 font-medium text-white transition-colors hover:bg-[--color-primary-light]"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Har item ke liye availability yahin decide kr dete hain — checkout gate
  // aur per-row warning dono isi single calculation ko reuse karenge.
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
