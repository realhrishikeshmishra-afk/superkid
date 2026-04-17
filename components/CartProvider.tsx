"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
  size: string;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("superkid-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("superkid-cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === newItem.id && i.size === newItem.size);
      if (exists) {
        return prev.map((i) =>
          i.id === newItem.id && i.size === newItem.size ? { ...i, qty: i.qty + newItem.qty } : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);

  if (!isMounted) return null; // Prevent hydration errors initially if desired, or let it render empty. For simpler hydration safe:
  // We can just return children and handle hydration mismatches carefully, but returning children is fine.
  // Actually, to prevent UI jump during hydration, it's better to just render children. 
  // Let's render children without the `if (!isMounted) return null;` to not block whole app.
  
  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
