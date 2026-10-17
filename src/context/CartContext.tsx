import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: number;
  variantLabel?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number, size?: number) => void;
  updateQuantity: (id: number, quantity: number, size?: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "cartItems";

const getCartItemKey = (id: number, size?: number) => `${id}-${size ?? "default"}`;

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const key = getCartItemKey(product.id, product.size);
      const existing = prev.find((item) => getCartItemKey(item.id, item.size) === key);

      if (existing) {
        const updated = prev.map((item) =>
          getCartItemKey(item.id, item.size) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }

      const updated = [...prev, { ...product, quantity: 1 }];
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: number, size?: number) => {
    setItems((prev) => {
      const updated = prev.filter((item) => {
        if (size !== undefined) {
          return getCartItemKey(item.id, item.size) !== getCartItemKey(id, size);
        }
        return item.id !== id;
      });
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id: number, quantity: number, size?: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setItems((prev) => {
      const updated = prev.map((item) => {
        const match = size !== undefined
          ? getCartItemKey(item.id, item.size) === getCartItemKey(id, size)
          : item.id === id;
        return match ? { ...item, quantity } : item;
      });
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider
      value={{ items, itemCount, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
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
