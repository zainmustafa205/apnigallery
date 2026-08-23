import { NextRequest, NextResponse } from "next/server";
import { createDirectOrder } from "@/lib/actions/order.actions";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { item, address, paymentMethod } = body;

  const result = await createDirectOrder(item, address, paymentMethod);

  return NextResponse.json(result);
}
