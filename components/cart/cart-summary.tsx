import Link from "next/link";

export default function CartSummary({
  subtotal,
  hasUnavailableItem,
}: {
  subtotal: number;
  hasUnavailableItem: boolean;
}) {
  return (
    <div className="border-lavender bg-surface sticky top-24 rounded-xl border p-5">
      <h2 className="text-text-dark mb-4 font-semibold">Order Summary</h2>

      <div className="text-text-dark/70 mb-2 flex items-center justify-between text-sm">
        <span>Subtotal</span>
        <span className="text-text-dark font-medium">
          Rs. {subtotal.toLocaleString()}
        </span>
      </div>

      <p className="text-text-dark/50 mb-4 text-xs">
        Advance amount aur delivery details checkout par calculate hongi.
      </p>

      {hasUnavailableItem ? (
        <>
          <button
            disabled
            className="bg-lavender text-text-dark/40 w-full cursor-not-allowed rounded-xl px-6 py-3 font-medium"
          >
            Proceed to Checkout
          </button>
          <p className="mt-2 text-center text-xs text-red-600">
            Please remove unavailable items to continue.
          </p>
        </>
      ) : (
        <Link
          href="/checkout"
          className="bg-primary hover:bg-primary-light block w-full rounded-xl px-6 py-3 text-center font-medium text-white transition-colors"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
