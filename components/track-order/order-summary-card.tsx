"use client";

import Link from "next/link";
import DownloadReceiptButton from "@/components/checkout/download-receipt-button";

export type OrderCardData = {
  id?: string;
  orderNumber: string;
  trackingCode: string;
  phone: string;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  createdAt: string;
  items: {
    productName: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  latestPayment: {
    status: string;
    type: string;
    amount: number;
    submittedAt: string;
  } | null;
};

const STATUS_META: Record<string, { label: string; note: string; className: string }> = {
  CONFIRMED: {
    label: "Confirmed",
    note: "Order confirm ho chuka hai, jald process hoga.",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  PROCESSING: {
    label: "Processing",
    note: "Aapka order taiyar kiya ja raha hai.",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  DISPATCHED: {
    label: "Dispatched",
    note: "Order dispatch ho chuka hai, jald pohanch jayega.",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  DELIVERED: {
    label: "Delivered",
    note: "Order deliver ho chuka hai.",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  CANCELLED: {
    label: "Cancelled",
    note: "Ye order cancel kr diya gaya hai.",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

const PENDING_PAYMENT_META: Record<
  string,
  { label: string; note: string; className: string }
> = {
  NOT_SUBMITTED: {
    label: "Payment Pending",
    note: "Advance payment ka screenshot abhi submit nahi hua.",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  PENDING: {
    label: "Payment Under Review",
    note: "Screenshot submit ho chuka hai, verify hone ka intezar hai.",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  REJECTED: {
    label: "Payment Rejected",
    note: "Screenshot reject hui hai, dobara submit karein.",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  VERIFIED: {
    label: "Payment Verified",
    note: "Payment verify ho chuki hai, order jald confirm hoga.",
    className: "bg-green-50 text-green-700 border-green-200",
  },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD_ADVANCE: "Cash on Delivery (Advance Paid)",
  FULL_MANUAL_TRANSFER: "Full Manual Transfer",
  CARD_WALLET_COMING_SOON: "Card/Wallet",
};

function getDisplayStatus(order: OrderCardData) {
  if (order.status === "PENDING_CONFIRMATION") {
    const paymentStatus = order.latestPayment?.status ?? "NOT_SUBMITTED";
    return PENDING_PAYMENT_META[paymentStatus];
  }
  return (
    STATUS_META[order.status] ?? {
      label: order.status,
      note: "",
      className: "bg-gray-50 text-gray-700 border-gray-200",
    }
  );
}

export default function OrderSummaryCard({ order }: { order: OrderCardData }) {
  const statusMeta = getDisplayStatus(order);
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const detailHref = order.id
    ? `/order-confirmation/${order.id}?trackingCode=${order.trackingCode}`
    : "#";

  const receiptData = {
    orderNumber: order.orderNumber,
    trackingCode: order.trackingCode,
    phone: order.phone,
    paymentMethodLabel: PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod,
    orderStatus: order.status,
    paymentStatus: order.latestPayment?.status ?? "NOT_SUBMITTED",
    items: order.items.map((i) => ({
      productName: i.productName,
      variantLabel: i.variantLabel,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      lineTotal: i.lineTotal,
    })),
    subtotal: order.totalAmount,
    advanceAmount: order.advanceAmount,
    remainingAmount: order.remainingAmount,
  };

  return (
    <div className="border-lavender hover:border-primary relative rounded-xl border bg-white px-5 py-4 transition-all hover:shadow-sm">
      <Link
        href={detailHref}
        className="absolute inset-0 rounded-xl"
        aria-label={`View order ${order.orderNumber}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="pointer-events-none min-w-0 space-y-1.5">
          <p className="text-text-dark truncate font-medium">{order.orderNumber}</p>
          <span
            className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
          {statusMeta.note && (
            <p className="text-text-dark/60 text-xs">{statusMeta.note}</p>
          )}
        </div>

        <div className="flex max-w-[45%] shrink-0 flex-col items-end gap-1.5 text-right">
          <p className="text-text-dark/60 pointer-events-none text-xs">
            {new Date(order.createdAt).toLocaleString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <p className="text-text-dark/80 pointer-events-none text-sm">
            {itemCount} item{itemCount > 1 ? "s" : ""} · Rs.{" "}
            {order.totalAmount.toLocaleString()}
          </p>
          {order.id && (
            <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
              <DownloadReceiptButton data={receiptData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
