import { createContext, useContext, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, name, price, qty }]

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: product.id, name: product.name, price: Number(product.price), qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((productId, delta) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === productId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { total, count } = useMemo(
    () => ({
      total: items.reduce((acc, i) => acc + i.price * i.qty, 0),
      count: items.reduce((acc, i) => acc + i.qty, 0),
    }),
    [items],
  );

  const value = { items, addItem, changeQty, clear, total, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de um CartProvider");
  return ctx;
}
