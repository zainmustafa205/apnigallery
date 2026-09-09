import Link from "next/link";

export default function CartSummary({
  subtotal,
  hasUnavailableItem,
}: {
  subtotal: number;
  hasUnavailableItem: boolean;
}) {
  return (
    <div className="sticky top-24 rounded-xl border border-[--color-lavender] bg-[--color-surface] p-5">
      <h2 className="mb-4 font-semibold text-[--color-text-dark]">Order Summary</h2>

      <div className="mb-2 flex items-center justify-between text-sm text-[--color-text-dark]/70">
        <span>Subtotal</span>
        <span className="font-medium text-[--color-text-dark]">
          Rs. {subtotal.toLocaleString()}
        </span>
      </div>

      <p className="mb-4 text-xs text-[--color-text-dark]/50">
        Advance amount aur delivery details checkout par calculate hongi.
      </p>

      {hasUnavailableItem ? (
        <>
          <button
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-[--color-lavender] px-6 py-3 font-medium text-[--color-text-dark]/40"
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
          className="block w-full rounded-xl bg-[--color-primary] px-6 py-3 text-center font-medium text-white transition-colors hover:bg-[--color-primary-light]"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
