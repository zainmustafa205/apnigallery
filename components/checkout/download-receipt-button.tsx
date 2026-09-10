"use client";

import { Download } from "lucide-react";

type ReceiptItem = {
  productName: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type ReceiptData = {
  orderNumber: string;
  trackingCode: string;
  phone: string;
  paymentMethodLabel: string;
  orderStatus: string;
  paymentStatus: string; // "NOT_SUBMITTED" | "PENDING" | "VERIFIED" | "REJECTED"
  items: ReceiptItem[];
  subtotal: number;
  advanceAmount: number;
  remainingAmount: number;
};

const WIDTH = 700;
const PADDING = 40;
const BRAND_COLOR = "#4B1E6E";
const ACCENT_COLOR = "#E6339E";
const TEXT_DARK = "#2D1B3D";
const TEXT_MUTED = "#6B6070";
const LINE_COLOR = "#E5DDE8";
const GREEN = "#1A7A3E";
const AMBER = "#B7791F";
const RED = "#C0392B";

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_CONFIRMATION: "Pending Confirmation",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  DISPATCHED: "Dispatched",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  NOT_SUBMITTED: "Screenshot Not Submitted Yet",
  PENDING: "Payment Under Review",
  VERIFIED: "Payment Verified",
  REJECTED: "Payment Rejected",
};

function statusColor(status: string): string {
  if (status === "CONFIRMED" || status === "DELIVERED" || status === "VERIFIED")
    return GREEN;
  if (status === "CANCELLED" || status === "REJECTED") return RED;
  return AMBER; // pending / processing / dispatched / not submitted
}

function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = BRAND_COLOR;
  ctx.font = "bold 28px Arial";
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 6);

  const text = "ApniGallery.com";
  const textWidth = ctx.measureText(text).width;
  const stepX = textWidth + 60;
  const stepY = 90;
  const span = Math.max(width, height) * 1.5;

  for (let y = -span; y < span; y += stepY) {
    for (let x = -span; x < span; x += stepX) {
      ctx.fillText(text, x, y);
    }
  }

  ctx.restore();
}

export default function DownloadReceiptButton({ data }: { data: ReceiptData }) {
  function handleDownload() {
    const height = 430 + data.items.length * 60;

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, WIDTH, height);

    drawWatermark(ctx, WIDTH, height);

    let y = PADDING;

    // Header — "Apni" (dark) + "Gallery" (accent pink) + ".com" (dark)
    ctx.font = "bold 26px Arial";
    let x = PADDING;

    ctx.fillStyle = BRAND_COLOR;
    ctx.fillText("Apni", x, y + 10);
    x += ctx.measureText("Apni").width;

    ctx.fillStyle = ACCENT_COLOR;
    ctx.fillText("Gallery", x, y + 10);
    x += ctx.measureText("Gallery").width;

    ctx.fillStyle = BRAND_COLOR;
    ctx.fillText(".com", x, y + 10);

    ctx.fillStyle = TEXT_MUTED;
    ctx.font = "13px Arial";
    ctx.fillText("Order Receipt", PADDING, y + 32);

    y += 60;
    ctx.strokeStyle = LINE_COLOR;
    ctx.beginPath();
    ctx.moveTo(PADDING, y);
    ctx.lineTo(WIDTH - PADDING, y);
    ctx.stroke();
    y += 30;

    const drawRow = (label: string, value: string, valueColor = TEXT_DARK) => {
      ctx.fillStyle = TEXT_MUTED;
      ctx.font = "13px Arial";
      ctx.fillText(label, PADDING, y);
      ctx.fillStyle = valueColor;
      ctx.font = "bold 14px Arial";
      const textWidth = ctx.measureText(value).width;
      ctx.fillText(value, WIDTH - PADDING - textWidth, y);
      y += 26;
    };

    drawRow("Order Number", data.orderNumber);
    drawRow("Tracking Code", data.trackingCode, ACCENT_COLOR);
    drawRow("Phone", data.phone);
    drawRow("Payment Method", data.paymentMethodLabel);
    drawRow(
      "Order Status",
      ORDER_STATUS_LABELS[data.orderStatus] ?? data.orderStatus,
      statusColor(data.orderStatus)
    );
    drawRow(
      "Payment Status",
      PAYMENT_STATUS_LABELS[data.paymentStatus] ?? data.paymentStatus,
      statusColor(data.paymentStatus)
    );

    y += 10;
    ctx.beginPath();
    ctx.moveTo(PADDING, y);
    ctx.lineTo(WIDTH - PADDING, y);
    ctx.stroke();
    y += 30;

    ctx.fillStyle = TEXT_DARK;
    ctx.font = "bold 15px Arial";
    ctx.fillText("Items", PADDING, y);
    y += 25;

    for (const item of data.items) {
      ctx.fillStyle = TEXT_DARK;
      ctx.font = "bold 14px Arial";
      const title = item.variantLabel
        ? `${item.productName} (${item.variantLabel})`
        : item.productName;
      ctx.fillText(title, PADDING, y);

      ctx.fillStyle = TEXT_DARK;
      ctx.font = "bold 14px Arial";
      const lineTotalText = `Rs. ${item.lineTotal.toLocaleString()}`;
      const ltWidth = ctx.measureText(lineTotalText).width;
      ctx.fillText(lineTotalText, WIDTH - PADDING - ltWidth, y);

      y += 20;
      ctx.fillStyle = TEXT_MUTED;
      ctx.font = "12px Arial";
      ctx.fillText(
        `Qty: ${item.quantity}  x  Rs. ${item.unitPrice.toLocaleString()}`,
        PADDING,
        y
      );
      y += 30;
    }

    ctx.beginPath();
    ctx.moveTo(PADDING, y);
    ctx.lineTo(WIDTH - PADDING, y);
    ctx.stroke();
    y += 30;

    drawRow("Subtotal", `Rs. ${data.subtotal.toLocaleString()}`);
    drawRow(
      "Advance Payable",
      `Rs. ${data.advanceAmount.toLocaleString()}`,
      ACCENT_COLOR
    );
    drawRow("Remaining (on delivery)", `Rs. ${data.remainingAmount.toLocaleString()}`);

    y += 20;
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = "italic 12px Arial";
    ctx.fillText(
      "Printing shuru karne se pehle hum aapse WhatsApp/Call par design confirm karenge.",
      PADDING,
      y
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ApniGallery-Receipt-${data.orderNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="text-primary hover:text-primary-light flex items-center gap-2 text-sm transition-colors"
    >
      <Download className="h-4 w-4" />
      Download Receipt
    </button>
  );
}
