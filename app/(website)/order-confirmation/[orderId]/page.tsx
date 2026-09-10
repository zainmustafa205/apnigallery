import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PaymentUploadForm from "@/components/checkout/payment-upload-form";
import CopyButton from "@/components/checkout/copy-button";
import DownloadReceiptButton from "@/components/checkout/download-receipt-button";
import { CheckCircle2 } from "lucide-react";

const PAYMENT_ACCOUNTS = {
  jazzcash: { label: "JazzCash", number: "0300-1234567", accountName: "ApniGallery" },
  easypaisa: { label: "Easypaisa", number: "0300-1234567", accountName: "ApniGallery" },
  bank: {
    label: "Bank Transfer",
    number: "PK00 XXXX 0000 0000 0000 0000",
    accountName: "ApniGallery",
  },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD_ADVANCE: "Cash on Delivery (Advance)",
  FULL_MANUAL_TRANSFER: "Full Manual Transfer",
};

function buildVariantLabel(variant: {
  size: string | null;
  color: string | null;
  material: string | null;
}) {
  return [variant.size, variant.color, variant.material].filter(Boolean).join(" / ");
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ trackingCode?: string }>;
}) {
  const { orderId } = await params;
  const { trackingCode } = await searchParams;

  if (!trackingCode) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      address: { select: { phone: true } },
      items: {
        include: {
          product: { select: { name: true } },
          variant: { select: { size: true, color: true, material: true } },
        },
      },
      payments: { select: { status: true } },
    },
  });

  if (!order || order.trackingCode !== trackingCode) notFound();

  const paymentAlreadySubmitted = order.payments.length > 0;
  const paymentVerified = order.payments.some((p) => p.status === "VERIFIED");

  const amountDue =
    order.paymentMethod === "FULL_MANUAL_TRANSFER"
      ? Number(order.totalAmount)
      : Number(order.advanceAmount);

  const receiptData = {
    orderNumber: order.orderNumber,
    trackingCode: order.trackingCode,
    phone: order.address.phone,
    paymentMethodLabel: PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod,
    orderStatus: order.status,
    paymentStatus: paymentAlreadySubmitted
      ? order.payments[0].status
      : ("NOT_SUBMITTED" as const),
    items: order.items.map((item) => ({
      productName: item.product.name,
      variantLabel: buildVariantLabel(item.variant),
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
    })),
    subtotal: Number(order.subtotal),
    advanceAmount: Number(order.advanceAmount),
    remainingAmount: Number(order.remainingAmount),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-600" />
        <h1 className="text-text-dark text-xl font-bold sm:text-2xl">
          Order Placed Successfully!
        </h1>
        <p className="text-text-dark/70 mt-1 text-sm">
          آپ کا آرڈر کامیابی سے موصول ہو گیا ہے
        </p>
      </div>

      <div className="border-lavender bg-surface mb-6 rounded-xl border p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-text-dark/70">Order Number</span>
          <span className="text-text-dark flex items-center gap-2 font-semibold">
            {order.orderNumber}
            <CopyButton text={order.orderNumber} label="Copy order number" />
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-text-dark/70">Tracking Code</span>
          <span className="text-primary flex items-center gap-2 font-mono font-semibold">
            {order.trackingCode}
            <CopyButton text={order.trackingCode} label="Copy tracking code" />
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-dark/70">Phone Number</span>
          <span className="text-text-dark flex items-center gap-2 font-medium">
            {order.address.phone}
            <CopyButton text={order.address.phone} label="Copy phone number" />
          </span>
        </div>
        <p className="text-text-dark/50 mt-2 text-xs">
          Save this tracking code + your phone number to check order status anytime,
          without logging in.
        </p>

        <div className="border-lavender mt-4 border-t pt-3">
          <DownloadReceiptButton data={receiptData} />
        </div>
      </div>

      {paymentVerified ? (
        <div className="rounded-xl border border-green-300 bg-green-50 p-4 text-center text-sm text-green-700">
          Payment verified — your order is confirmed!
        </div>
      ) : paymentAlreadySubmitted ? (
        <div className="border-lavender bg-surface text-text-dark/70 rounded-xl border p-4 text-center text-sm">
          Screenshot submitted. We&apos;ll verify it and confirm your order soon (usually
          within a few hours).
        </div>
      ) : (
        <div className="border-lavender bg-surface rounded-xl border p-4 sm:p-5">
          <h2 className="text-text-dark mb-1 font-semibold">
            Pay Advance to Confirm Order
          </h2>
          <p className="text-text-dark/70 mb-4 text-sm">
            Please transfer{" "}
            <span className="text-primary font-semibold">
              Rs. {amountDue.toLocaleString()}
            </span>{" "}
            to one of the accounts below, then upload your payment screenshot.
          </p>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Object.values(PAYMENT_ACCOUNTS).map((acc) => (
              <div
                key={acc.label}
                className="border-lavender rounded-lg border p-3 text-sm"
              >
                <p className="text-text-dark font-medium">{acc.label}</p>
                <p className="text-text-dark/70 mt-1 flex items-center gap-1.5 font-mono text-xs">
                  {acc.number}
                  <CopyButton text={acc.number} label={`Copy ${acc.label} number`} />
                </p>
                <p className="text-text-dark/50 text-xs">{acc.accountName}</p>
              </div>
            ))}
          </div>

          <PaymentUploadForm
            orderId={order.id}
            trackingCode={order.trackingCode}
            defaultMethod="JAZZCASH"
          />
        </div>
      )}

      <div className="text-text-dark/50 mt-6 text-center text-xs">
        Printing shuru karne se pehle hum aapse WhatsApp/Call par design confirm karenge.
      </div>
    </div>
  );
}
