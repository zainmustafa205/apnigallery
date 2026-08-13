"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PaymentMethod, PaymentType } from "@/lib/generated/prisma/client";
import cloudinary from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_PAYMENT_METHODS: PaymentMethod[] = [
  "JAZZCASH",
  "EASYPAISA",
  "BANK_TRANSFER",
];

interface SubmitPaymentResult {
  success: boolean;
  error?: string;
  data?: {
    paymentId: string;
    amount: string;
    status: string;
  };
}

export async function submitPaymentScreenshot(
  orderId: string,
  trackingCode: string,
  method: PaymentMethod,
  file: File
): Promise<SubmitPaymentResult> {
  // ---- 1. Validate payment method ----
  if (!ALLOWED_PAYMENT_METHODS.includes(method)) {
    return { success: false, error: "Invalid payment method selected." };
  }

  // ---- 2. Validate file ----
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Only JPG, PNG, or WEBP images are allowed." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "Screenshot must be under 5MB." };
  }

  // ---- 3. Find + authorize order ----
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order || order.trackingCode !== trackingCode) {
    return { success: false, error: "Order not found." };
  }

  const session = await auth();
  if (order.userId && session?.user?.id !== order.userId) {
    return { success: false, error: "You are not authorized to update this order." };
  }

  // ---- 4. Prevent duplicate submission after verification ----
  const alreadyVerified = order.payments.some((p) => p.status === "VERIFIED");
  if (alreadyVerified) {
    return { success: false, error: "This order's payment has already been verified." };
  }

  // ---- 5. Determine type + amount from the order itself (never trust client) ----
  const type: PaymentType =
    order.paymentMethod === "FULL_MANUAL_TRANSFER" ? "FULL" : "ADVANCE";
  const amount =
    order.paymentMethod === "FULL_MANUAL_TRANSFER"
      ? order.totalAmount
      : order.advanceAmount;

  // ---- 6. Upload to Cloudinary ----
  // ---- 6. Upload to Cloudinary ----
  let uploadResult: { url: string; publicId: string };
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const cloudinaryResponse = await cloudinary.uploader.upload(base64, {
      folder: "payments",
    });

    uploadResult = {
      url: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
    };
  } catch {
    return { success: false, error: "Screenshot upload failed. Please try again." };
  }

  // ---- 7. Create Payment record ----
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      type,
      method,
      amount,
      screenshotUrl: uploadResult.url,
      screenshotPublicId: uploadResult.publicId,
      status: "PENDING",
    },
  });

  return {
    success: true,
    data: {
      paymentId: payment.id,
      amount: payment.amount.toString(),
      status: payment.status,
    },
  };
}
