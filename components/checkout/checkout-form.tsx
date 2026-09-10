"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrderFromCart, createDirectOrder } from "@/lib/actions/order.actions";
import type { CheckoutData } from "@/lib/checkout-types";
import type { OrderPaymentMethod } from "@/lib/generated/prisma/client";
import OrderReview from "@/components/checkout/order-review";
import { Wallet, Landmark, CreditCard, AlertCircle } from "lucide-react";
import { FloatingInput, FloatingSelect } from "@/components/checkout/floating-field";

type AddressForm = {
  label: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
};

type SavedAddress = {
  label: string | null;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string | null;
  phone: string;
} | null;

const EMPTY_ADDRESS: AddressForm = {
  label: "",
  addressLine: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
};

const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
  "Islamabad Capital Territory",
];

function addressFromSaved(saved: SavedAddress): AddressForm {
  if (!saved) return EMPTY_ADDRESS;
  return {
    label: saved.label ?? "",
    addressLine: saved.addressLine,
    city: saved.city,
    province: saved.province,
    postalCode: saved.postalCode ?? "",
    phone: saved.phone,
  };
}

export default function CheckoutForm({
  checkoutData,
  advancePercentage,
  savedAddress,
}: {
  checkoutData: CheckoutData;
  advancePercentage: number;
  savedAddress?: SavedAddress;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [address, setAddress] = useState<AddressForm>(
    addressFromSaved(savedAddress ?? null)
  );
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>("COD_ADVANCE");
  const [error, setError] = useState<string | null>(null);

  const { subtotal, items } = checkoutData;

  const advanceAmount =
    paymentMethod === "FULL_MANUAL_TRANSFER"
      ? subtotal
      : (subtotal * advancePercentage) / 100;
  const remainingAmount = subtotal - advanceAmount;

  function updateField(field: keyof AddressForm, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!address.addressLine || !address.city || !address.province || !address.phone) {
      setError("Please fill in all required address fields.");
      return;
    }

    startTransition(async () => {
      const addressInput = {
        label: address.label || undefined,
        addressLine: address.addressLine,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode || undefined,
        phone: address.phone,
      };

      const result =
        checkoutData.mode === "direct"
          ? await createDirectOrder(
              {
                productId: items[0].productId,
                variantId: items[0].variantId,
                designId: items[0].designId,
                quantity: items[0].quantity,
                specialInstructions: items[0].specialInstructions,
              },
              addressInput,
              paymentMethod
            )
          : await createOrderFromCart(addressInput, paymentMethod);

      if (!result.success || !result.data) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(
        `/order-confirmation/${result.data.orderId}?trackingCode=${result.data.trackingCode}`
      );
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="border-lavender bg-surface rounded-xl border p-4 sm:p-5">
          <h2 className="text-text-dark mb-1 font-semibold">Shipping Address</h2>
          {savedAddress && (
            <p className="text-text-dark/50 mb-3 text-xs">
              Filled in from your last order — feel free to edit.
            </p>
          )}

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FloatingInput
              label="Label (optional)"
              value={address.label}
              onChange={(v) => updateField("label", v)}
              className="sm:col-span-2"
            />
            <FloatingInput
              label="Address Line *"
              value={address.addressLine}
              onChange={(v) => updateField("addressLine", v)}
              required
              className="sm:col-span-2"
            />
            <FloatingInput
              label="City *"
              value={address.city}
              onChange={(v) => updateField("city", v)}
              required
            />
            <FloatingSelect
              label="Province *"
              value={address.province}
              onChange={(v) => updateField("province", v)}
              options={PAKISTAN_PROVINCES}
              required
            />
            <FloatingInput
              label="Postal Code (optional)"
              value={address.postalCode}
              onChange={(v) => updateField("postalCode", v)}
            />
            <FloatingInput
              label="Phone Number *"
              value={address.phone}
              onChange={(v) => updateField("phone", v)}
              type="tel"
              required
            />
          </div>
        </div>

        <div className="border-lavender bg-surface rounded-xl border p-4 sm:p-5">
          <h2 className="text-text-dark mb-4 font-semibold">Payment Method</h2>

          <div className="flex flex-col gap-3">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                paymentMethod === "COD_ADVANCE"
                  ? "border-primary bg-lavender/50"
                  : "border-lavender"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "COD_ADVANCE"}
                onChange={() => setPaymentMethod("COD_ADVANCE")}
                className="mt-1"
              />
              <Wallet className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-text-dark text-sm font-medium">
                  Cash on Delivery ({advancePercentage}% advance)
                </p>
                <p className="text-text-dark/60 text-xs">
                  Pay {advancePercentage}% now via JazzCash/Easypaisa/Bank, rest on
                  delivery.
                </p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                paymentMethod === "FULL_MANUAL_TRANSFER"
                  ? "border-primary bg-lavender/50"
                  : "border-lavender"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "FULL_MANUAL_TRANSFER"}
                onChange={() => setPaymentMethod("FULL_MANUAL_TRANSFER")}
                className="mt-1"
              />
              <Landmark className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-text-dark text-sm font-medium">Full Manual Transfer</p>
                <p className="text-text-dark/60 text-xs">
                  Pay full amount upfront via JazzCash/Easypaisa/Bank.
                </p>
              </div>
            </label>

            <div className="border-lavender flex cursor-not-allowed items-start gap-3 rounded-lg border p-3 opacity-50">
              <input type="radio" disabled className="mt-1" />
              <CreditCard className="text-text-dark/40 mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-text-dark/60 text-sm font-medium">
                  Card / Wallet — Coming Soon
                </p>
                <p className="text-text-dark/40 text-xs">
                  Automated card and wallet payments will be available soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-1">
        <OrderReview items={items} subtotal={subtotal} />

        <div className="border-lavender bg-surface rounded-xl border p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-text-dark/70">Total</span>
            <span className="text-text-dark font-medium">
              Rs. {subtotal.toLocaleString()}
            </span>
          </div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-text-dark/70">Advance Payable Now</span>
            <span className="text-primary font-semibold">
              Rs. {advanceAmount.toLocaleString()}
            </span>
          </div>
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-text-dark/70">Remaining (on delivery)</span>
            <span className="text-text-dark font-medium">
              Rs. {remainingAmount.toLocaleString()}
            </span>
          </div>

          {error && (
            <div className="mb-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary-light w-full rounded-xl px-6 py-3 font-medium text-white transition-colors disabled:opacity-50"
          >
            {isPending ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </form>
  );
}
