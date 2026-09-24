import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  function addItem(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, product.stock);

      if (existing) {
        return current.map((item) => item.product.id === product.id ? { ...item, product, quantity: nextQuantity } : item);
      }
      return [...current, { product, quantity: Math.min(quantity, product.stock) }];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((current) => current.flatMap((item) => {
      if (item.product.id !== productId) return [item];
      const nextQuantity = Math.min(Math.max(quantity, 0), item.product.stock);
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const summary = useMemo(() => ({
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
  }), [items]);

  const value = {
    items,
    ...summary,
    isOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
