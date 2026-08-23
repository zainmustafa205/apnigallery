import { NextRequest, NextResponse } from "next/server";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/actions/cart.actions";

// GET /api/test/cart — fetch current cart (guest via cookie, or logged-in user)
export async function GET() {
  const cart = await getCart();
  return NextResponse.json(cart);
}

// POST /api/test/cart — add item to cart
// Body: { "productId": "...", "variantId": "...", "quantity": 2, "designId"?: "...", "specialInstructions"?: "..." }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await addToCart(body);
  return NextResponse.json(result);
}

// PATCH /api/test/cart — update item quantity
// Body: { "cartItemId": "...", "quantity": 5 }
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const result = await updateCartItemQuantity(body.cartItemId, body.quantity);
  return NextResponse.json(result);
}

// DELETE /api/test/cart — remove item
// Body: { "cartItemId": "..." }
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const result = await removeCartItem(body.cartItemId);
  return NextResponse.json(result);
}
