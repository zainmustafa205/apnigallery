"use client";

// Lightweight, non-sensitive cookie that remembers the last Design a
// browser worked on for a given product — purely a UX convenience so
// revisiting /customize/[slug] (or "Customize Further" with empty Quick
// Fields) resumes where the customer left off. This is NOT an ownership
// mechanism: a Design's real "key" is still its own unguessable id, exactly
// like the guest cart/tracking-code trust model already used elsewhere.
export function setLastDesignCookie(productId: string, designId: string) {
  const maxAgeSeconds = 60 * 60 * 24 * 30; // 30 days — matches guest cart_session duration
  document.cookie = `design_${productId}=${designId}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}
