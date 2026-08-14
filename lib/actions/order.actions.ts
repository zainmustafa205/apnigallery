"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCart } from "@/lib/actions/cart.actions";
import { getOrCreateCartSessionId as getGuestSessionId } from "@/lib/cart-session";
import {
  getAdvancePercentage,
  generateOrderNumber,
  generateTrackingCode,
} from "@/lib/helpers/order-helpers";
import { OrderPaymentMethod } from "@/lib/generated/prisma/client";
import { Prisma } from "@/lib/generated/prisma/client";
import { z } from "zod";

// ==========================================================
// SHARED TYPES
// ==========================================================

interface RawOrderItemInput {
  productId: string;
  variantId: string;
  designId?: string | null;
  quantity: number;
  specialInstructions?: string | null;
}

const addressSchema = z.object({
  label: z.string().optional(),
  addressLine: z.string().min(3, "Address line is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z.string().optional(),
  phone: z.string().min(7, "Valid phone number is required"),
});

type AddressInput = z.infer<typeof addressSchema>;

interface OrderResult {
  success: boolean;
  error?: string;
  data?: {
    orderId: string;
    orderNumber: string;
    trackingCode: string;
    subtotal: string;
    totalAmount: string;
    advanceAmount: string;
    remainingAmount: string;
    paymentMethod: OrderPaymentMethod;
  };
}

// Only these two methods are currently allowed for order placement.
// CARD_WALLET_COMING_SOON must be rejected even if somehow sent from client.
const ALLOWED_PAYMENT_METHODS: OrderPaymentMethod[] = [
  "COD_ADVANCE",
  "FULL_MANUAL_TRANSFER",
];

// ==========================================================
// SHARED CORE LOGIC — buildOrder
// (all price recompute + transaction logic lives ONLY here)
// ==========================================================

async function buildOrder(
  rawItems: RawOrderItemInput[],
  addressInput: AddressInput,
  paymentMethod: OrderPaymentMethod
): Promise<OrderResult> {
  // ---- 1. Validate payment method ----
  if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    return { success: false, error: "This payment method is not available yet." };
  }

  // ---- 2. Validate address ----
  const addressParsed = addressSchema.safeParse(addressInput);
  if (!addressParsed.success) {
    return {
      success: false,
      error: addressParsed.error.issues[0]?.message ?? "Invalid address details.",
    };
  }
  const address = addressParsed.data;

  // ---- 3. Validate items exist ----
  if (!rawItems.length) {
    return { success: false, error: "No items to order." };
  }

  // ---- 4. Identify owner (registered user or guest session) ----
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const guestSessionId = userId ? null : await getGuestSessionId();

  if (!userId && !guestSessionId) {
    return {
      success: false,
      error: "Unable to identify session. Please refresh and try again.",
    };
  }

  // ---- 5. Fetch fresh product + variant data (NEVER trust cached prices) ----
  const productIds = [...new Set(rawItems.map((i) => i.productId))];
  const variantIds = [...new Set(rawItems.map((i) => i.variantId))];

  const [products, variants] = await Promise.all([
    prisma.product.findMany({ where: { id: { in: productIds } } }),
    prisma.productVariant.findMany({ where: { id: { in: variantIds } } }),
  ]);

  const productMap = new Map(products.map((p) => [p.id, p]));
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  // ---- 6. Build order line items with fresh pricing ----
  let subtotal = new Prisma.Decimal(0);
  const preparedItems: {
    productId: string;
    variantId: string;
    designId: string | null;
    quantity: number;
    unitPrice: Prisma.Decimal;
    lineTotal: Prisma.Decimal;
    specialInstructions: string | null;
  }[] = [];

  for (const item of rawItems) {
    const product = productMap.get(item.productId);
    const variant = variantMap.get(item.variantId);

    if (!product || product.status === "ARCHIVED") {
      return { success: false, error: `A product in your order is no longer available.` };
    }
    if (!variant || !variant.isActive || variant.productId !== product.id) {
      return { success: false, error: `A selected variant is no longer available.` };
    }
    if (item.quantity < 1) {
      return { success: false, error: "Quantity must be at least 1." };
    }

    const unitPrice = product.basePrice.add(variant.priceAdjustment);
    const lineTotal = unitPrice.mul(item.quantity);
    subtotal = subtotal.add(lineTotal);

    preparedItems.push({
      productId: product.id,
      variantId: variant.id,
      designId: item.designId ?? null,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      specialInstructions: item.specialInstructions ?? null,
    });
  }

  // ---- 7. Advance / remaining calculation ----
  const advancePercentage =
    paymentMethod === "FULL_MANUAL_TRANSFER" ? 100 : await getAdvancePercentage();

  const advanceAmount =
    paymentMethod === "FULL_MANUAL_TRANSFER"
      ? subtotal
      : subtotal.mul(advancePercentage).div(100);

  const remainingAmount = subtotal.sub(advanceAmount);

  // ---- 8. Generate identifiers ----
  const orderNumber = await generateOrderNumber();
  const trackingCode = await generateTrackingCode();

  // ---- 9. Transaction: address snapshot + order + items ----
  const order = await prisma.$transaction(async (tx) => {
    const addressRow = await tx.address.create({
      data: {
        userId,
        guestSessionId,
        label: address.label ?? null,
        addressLine: address.addressLine,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode ?? null,
        phone: address.phone,
      },
    });

    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        trackingCode,
        userId,
        addressId: addressRow.id,
        subtotal,
        totalAmount: subtotal,
        advancePercentage,
        advanceAmount,
        remainingAmount,
        paymentMethod,
        items: {
          create: preparedItems,
        },
      },
    });

    return createdOrder;
  });

  return {
    success: true,
    data: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      trackingCode: order.trackingCode,
      subtotal: subtotal.toString(),
      totalAmount: order.totalAmount.toString(),
      advanceAmount: order.advanceAmount.toString(),
      remainingAmount: order.remainingAmount.toString(),
      paymentMethod: order.paymentMethod,
    },
  };
}

// ==========================================================
// PUBLIC ENTRY POINT 1 — Order from Cart
// ==========================================================

export async function createOrderFromCart(
  addressInput: AddressInput,
  paymentMethod: OrderPaymentMethod
): Promise<OrderResult> {
  const cart = await getCart();

  if (!cart || !cart.items.length) {
    return { success: false, error: "Your cart is empty." };
  }

  const rawItems: RawOrderItemInput[] = cart.items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    designId: item.designId,
    quantity: item.quantity,
    specialInstructions: item.specialInstructions,
  }));

  const result = await buildOrder(rawItems, addressInput, paymentMethod);

  // Clear cart items only after a successful order
  if (result.success) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return result;
}

// ==========================================================
// PUBLIC ENTRY POINT 2 — Direct "Buy Now" Order (cart untouched)
// ==========================================================

export async function createDirectOrder(
  item: RawOrderItemInput,
  addressInput: AddressInput,
  paymentMethod: OrderPaymentMethod
): Promise<OrderResult> {
  return buildOrder([item], addressInput, paymentMethod);
}
