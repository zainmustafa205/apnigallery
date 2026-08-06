"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getOrCreateCartSessionId, getCartSessionId } from "@/lib/cart-session";
import { z } from "zod";

/**
 * Fetches the current user's cart (logged-in via userId, or guest via sessionId cookie),
 * including full nested details needed to render the cart and calculate totals.
 *
 * Returns null if no cart exists yet (e.g. first-time visitor who hasn't added anything).
 */
export async function getCart() {
  const session = await auth();

  const cart = session?.user?.id
    ? await getCartByUserId(session.user.id)
    : await getCartBySessionId();

  return cart;
}

async function getCartByUserId(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: cartIncludeOptions,
  });
}

async function getCartBySessionId() {
  const sessionId = await getCartSessionId();

  if (!sessionId) {
    return null;
  }

  return prisma.cart.findUnique({
    where: { sessionId },
    include: cartIncludeOptions,
  });
}

// Shared "include" shape — pulls in everything the frontend needs
// to display cart items and calculate totals, in a single query.
const cartIncludeOptions = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          basePrice: true,
          status: true,
        },
      },
      variant: {
        select: {
          id: true,
          size: true,
          color: true,
          material: true,
          priceAdjustment: true,
          stock: true,
          image: true,
          isActive: true,
        },
      },
      design: {
        select: {
          id: true,
          previewImageUrl: true,
        },
      },
    },
  },
} as const;

const addToCartSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid(),
  quantity: z.number().int().positive().max(50),
  designId: z.string().cuid().optional(),
  specialInstructions: z.string().max(500).optional(),
});

type AddToCartInput = z.infer<typeof addToCartSchema>;

/**
 * Adds a product+variant (with optional design) to the current user's cart.
 * Works for both logged-in users and guests (creating a cart if one doesn't exist yet).
 * If the same product+variant+design combination already exists in the cart,
 * increases its quantity instead of creating a duplicate row.
 */
export async function addToCart(input: AddToCartInput) {
  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input", details: parsed.error.flatten() };
  }

  const { productId, variantId, quantity, designId, specialInstructions } = parsed.data;

  // Validate variant is orderable
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: { id: true, productId: true, isActive: true, stock: true },
  });

  if (!variant || variant.productId !== productId) {
    return { success: false, error: "Variant not found for this product" };
  }

  if (!variant.isActive) {
    return { success: false, error: "This variant is no longer available" };
  }

  if (variant.stock < quantity) {
    return { success: false, error: `Only ${variant.stock} in stock` };
  }

  const cart = await getOrCreateCart();

  // Check if this exact product+variant+design combo is already in the cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId,
      designId: designId ?? null,
    },
  });

  if (existingItem) {
    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
    return { success: true, cartItem: updated };
  }

  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      variantId,
      designId,
      quantity,
      specialInstructions,
    },
  });

  return { success: true, cartItem: newItem };
}

/**
 * Gets the current cart, or creates one if none exists —
 * linked to userId (logged-in) or sessionId (guest).
 */
async function getOrCreateCart() {
  const session = await auth();

  if (session?.user?.id) {
    const existing = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });
    if (existing) return existing;

    return prisma.cart.create({
      data: { userId: session.user.id },
    });
  }

  // Guest flow
  const sessionId = await getOrCreateCartSessionId();
  const existing = await prisma.cart.findUnique({
    where: { sessionId },
  });
  if (existing) return existing;

  return prisma.cart.create({
    data: { sessionId },
  });
}

const updateQuantitySchema = z.object({
  cartItemId: z.string().cuid(),
  quantity: z.number().int().positive().max(50),
});

/**
 * Updates the quantity of a cart item, after verifying it belongs
 * to the current user's (or guest's) own cart — prevents editing
 * someone else's cart by guessing/passing a cartItemId.
 */
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const parsed = updateQuantitySchema.safeParse({ cartItemId, quantity });
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
      variant: { select: { stock: true, isActive: true } },
    },
  });

  if (!cartItem) {
    return { success: false, error: "Cart item not found" };
  }

  const ownsCart = await verifyCartOwnership(cartItem.cart);
  if (!ownsCart) {
    return { success: false, error: "Not authorized to modify this cart item" };
  }

  if (!cartItem.variant.isActive) {
    return { success: false, error: "This variant is no longer available" };
  }

  if (cartItem.variant.stock < quantity) {
    return { success: false, error: `Only ${cartItem.variant.stock} in stock` };
  }

  const updated = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return { success: true, cartItem: updated };
}

/**
 * Removes a cart item, after verifying ownership (same check as above).
 */
export async function removeCartItem(cartItemId: string) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem) {
    return { success: false, error: "Cart item not found" };
  }

  const ownsCart = await verifyCartOwnership(cartItem.cart);
  if (!ownsCart) {
    return { success: false, error: "Not authorized to modify this cart item" };
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  return { success: true };
}

/**
 * Checks whether the currently logged-in user (or guest session)
 * owns the given cart — used to prevent editing/removing another
 * person's cart items.
 */
async function verifyCartOwnership(cart: {
  userId: string | null;
  sessionId: string | null;
}) {
  const session = await auth();

  if (session?.user?.id) {
    return cart.userId === session.user.id;
  }

  const sessionId = await getCartSessionId();
  return sessionId !== null && cart.sessionId === sessionId;
}
