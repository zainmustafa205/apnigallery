import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackingCode = searchParams.get("trackingCode")?.trim();
  const phone = searchParams.get("phone")?.trim();

  if (!trackingCode || !phone) {
    return NextResponse.json(
      { success: false, error: "Tracking code and phone number are required." },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { trackingCode },
    include: {
      address: true,
      items: {
        include: {
          product: { select: { name: true, slug: true } },
          variant: { select: { size: true, color: true, material: true } },
        },
      },
      payments: {
        orderBy: { submittedAt: "desc" },
        select: { status: true, type: true, amount: true, submittedAt: true },
      },
    },
  });

  // Same generic error whether not-found or phone-mismatch — avoids leaking
  // which tracking codes are valid to someone guessing.
  if (!order || order.address.phone !== phone) {
    return NextResponse.json(
      {
        success: false,
        error: "No order found with this tracking code and phone number.",
      },
      { status: 404 }
    );
  }

  const isAdvancePending = order.status === "PENDING_CONFIRMATION";

  return NextResponse.json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount.toString(),
      advanceAmount: order.advanceAmount.toString(),
      remainingAmount: order.remainingAmount.toString(),
      isAdvancePaymentPending: isAdvancePending,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productName: item.product.name,
        productSlug: item.product.slug,
        variant: {
          size: item.variant.size,
          color: item.variant.color,
          material: item.variant.material,
        },
        quantity: item.quantity,
        lineTotal: item.lineTotal.toString(),
      })),
      latestPayment: order.payments[0]
        ? {
            status: order.payments[0].status,
            type: order.payments[0].type,
            amount: order.payments[0].amount.toString(),
            submittedAt: order.payments[0].submittedAt,
          }
        : null,
    },
  });
}
