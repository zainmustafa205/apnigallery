"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCart } from "@/lib/actions/cart.actions";

type CartContextType = {
  itemCount: number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [itemCount, setItemCount] = useState(0);

  async function refreshCart() {
    try {
      const cart = await getCart();
      const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
      setItemCount(count);
    } catch (error) {
      console.error("Failed to refresh cart count:", error);
    }
  }

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
