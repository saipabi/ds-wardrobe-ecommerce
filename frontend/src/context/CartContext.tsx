'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Cart } from '../types/commerce';
import { api } from '../lib/api';

interface CartContextType {
  cart: Cart | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (productId: string, variantId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => Promise<void>;
  itemCount: number;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ds_wardrobe_cart_id';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initCart = useCallback(async () => {
    try {
      setLoading(true);
      let cartId = typeof window !== 'undefined' ? localStorage.getItem(CART_STORAGE_KEY) : null;

      if (cartId) {
        try {
          const res = await api.getCart(cartId);
          setCart(res.cart);
          setLoading(false);
          return;
        } catch {
          // If cart expired or not found, create new one
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }

      const res = await api.createCart();
      setCart(res.cart);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, res.cart.id);
      }
    } catch (err: any) {
      console.error('Failed to initialize cart:', err);
      setError(err.message || 'Cart initialization failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initCart();
  }, [initCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = async (
    productId: string,
    variantId: string,
    quantity: number = 1
  ): Promise<boolean> => {
    try {
      setError(null);
      let currentCartId = cart?.id;

      if (!currentCartId) {
        const newCartRes = await api.createCart();
        currentCartId = newCartRes.cart.id;
        if (typeof window !== 'undefined') {
          localStorage.setItem(CART_STORAGE_KEY, currentCartId);
        }
      }

      const res = await api.addToCart(currentCartId, productId, variantId, quantity);
      setCart(res.cart);
      setIsCartOpen(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Could not add item to cart');
      alert(err.message || 'Could not add item to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!cart) return;
    try {
      const res = await api.updateCartItem(cart.id, itemId, quantity);
      setCart(res.cart);
    } catch (err: any) {
      alert(err.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    if (!cart) return;
    try {
      const res = await api.removeCartItem(cart.id, itemId);
      setCart(res.cart);
    } catch (err: any) {
      console.error('Failed to remove item:', err);
    }
  };

  const applyCoupon = async (couponCode: string): Promise<{ success: boolean; error?: string }> => {
    if (!cart) return { success: false, error: 'Cart not loaded' };
    try {
      const res = await api.applyCoupon(cart.id, couponCode);
      setCart(res.cart);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to apply coupon' };
    }
  };

  const removeCoupon = async () => {
    if (!cart) return;
    try {
      const res = await api.removeCoupon(cart.id);
      setCart(res.cart);
    } catch (err: any) {
      console.error('Failed to remove coupon:', err);
    }
  };

  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        itemCount,
        loading,
        error
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
