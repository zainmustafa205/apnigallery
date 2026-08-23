import { NextRequest, NextResponse } from "next/server";
import { submitPaymentScreenshot } from "@/lib/actions/payment.actions";
import { PaymentMethod } from "@/lib/generated/prisma/client";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const orderId = formData.get("orderId") as string;
  const trackingCode = formData.get("trackingCode") as string;
  const method = formData.get("method") as PaymentMethod;
  const file = formData.get("file") as File;

  if (!orderId || !trackingCode || !method || !file) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required fields (orderId, trackingCode, method, file).",
      },
      { status: 400 }
    );
  }

  const result = await submitPaymentScreenshot(orderId, trackingCode, method, file);

  return NextResponse.json(result);
}
