import { NextRequest, NextResponse } from "next/server";
import { createOrderFromCart } from "@/lib/actions/order.actions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { address, paymentMethod } = body;

  const result = await createOrderFromCart(address, paymentMethod);

  return NextResponse.json(result);
}
