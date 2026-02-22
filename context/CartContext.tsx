import React, { createContext, useContext, useState } from 'react';
import { CartItem, MenuItem, SelectedAddOn } from '../types';
import { toast } from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, selectedAddOns?: SelectedAddOn[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem, quantity: number = 1, selectedAddOns: SelectedAddOn[] = []) => {
    // Generate a unique ID based on item ID AND selected add-ons
    // We sort add-ons by name to ensure consistent ID generation regardless of selection order
    const addOnSignature = selectedAddOns
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(a => `${a.name}:${a.quantity}`)
        .join('|');
    
    const cartItemId = `${item.id}-${addOnSignature}`;

    setCart((prev) => {
      const existingItem = prev.find((i) => i.cartItemId === cartItemId);

      if (existingItem) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      const newItem: CartItem = {
          ...item,
          cartItemId, // Use constructed ID
          quantity,
          selectedAddOns
      };
      
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
      const addOnsCost = item.selectedAddOns?.reduce((acc, addon) => acc + (addon.price * addon.quantity), 0) || 0;
      return sum + ((item.price + addOnsCost) * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};