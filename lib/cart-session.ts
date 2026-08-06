import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const CART_COOKIE_NAME = "cart_session";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

/**
 * Returns the existing guest cart sessionId from cookies,
 * or creates a new one and sets it if none exists.
 *
 * Spring Boot analogy: think of this like a lightweight
 * HttpSession, except we don't store data server-side in memory —
 * the cookie only holds a reference ID; the real cart data lives
 * in the database (Cart.sessionId).
 */
export async function getOrCreateCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (existing) {
    return existing;
  }

  const newSessionId = randomUUID();

  cookieStore.set(CART_COOKIE_NAME, newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });

  return newSessionId;
}

/**
 * Reads the guest cart sessionId without creating one.
 * Useful when we only want to check "does a guest cart exist?"
 * without accidentally creating a cookie on a read-only request.
 */
export async function getCartSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value ?? null;
}

/**
 * Clears the guest cart cookie — called after a guest cart
 * is merged into a logged-in user's cart.
 */
export async function clearCartSessionId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}
