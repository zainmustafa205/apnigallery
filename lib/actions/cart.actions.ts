"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getCartSessionId } from "@/lib/cart-session";

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
