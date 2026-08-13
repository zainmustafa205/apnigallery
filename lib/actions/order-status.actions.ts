"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { OrderStatus, PaymentStatus } from "@/lib/generated/prisma/client";

// ==========================================================
// STATE MACHINE — valid order status transitions
// ==========================================================

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_CONFIRMATION: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

interface ActionResult {
  success: boolean;
  error?: string;
}

// ==========================================================
// ADMIN AUTH GUARD (shared by both functions below)
// ==========================================================

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user?.id || (role !== "ADMIN" && role !== "STAFF")) {
    return null;
  }
  return session.user;
}

// ==========================================================
// GENERIC ORDER STATUS UPDATE
// ==========================================================

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) {
    return { success: false, error: "Not authorized." };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return { success: false, error: "Order not found." };
  }

  const allowedNext = ORDER_STATUS_TRANSITIONS[order.status];
  if (!allowedNext.includes(newStatus)) {
    return {
      success: false,
      error: `Cannot move order from ${order.status} to ${newStatus}.`,
    };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  return { success: true };
}

// ==========================================================
// PAYMENT VERIFICATION — drives order status automatically
// FR-PAY-07: verified payment => order becomes CONFIRMED
// ==========================================================

export async function verifyPayment(
  paymentId: string,
  decision: "VERIFIED" | "REJECTED"
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) {
    return { success: false, error: "Not authorized." };
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true },
  });

  if (!payment) {
    return { success: false, error: "Payment record not found." };
  }

  if (payment.status !== "PENDING") {
    return { success: false, error: "This payment has already been reviewed." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: decision as PaymentStatus,
        verifiedByAdminId: admin.id,
        verifiedAt: new Date(),
      },
    });

    // Only auto-confirm if order is still waiting, and only on VERIFIED
    if (decision === "VERIFIED" && payment.order.status === "PENDING_CONFIRMATION") {
      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: "CONFIRMED" },
      });
    }
  });

  return { success: true };
}
