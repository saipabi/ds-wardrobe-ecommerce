'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Customer } from '../types/commerce';
import { api } from '../lib/api';

interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    phone: string;
  }) => Promise<boolean>;
  logout: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'ds_wardrobe_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);
      const res = await api.getProfile(storedToken);
      setCustomer(res.customer);
      setWishlist(res.customer.wishlist || []);
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
      }
      setCustomer(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.login(email, password);
      setCustomer(res.customer);
      setToken(res.token);
      setWishlist(res.customer.wishlist || []);
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, res.token);
      }
      return true;
    } catch (err: any) {
      alert(err.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    phone: string;
  }): Promise<boolean> => {
    try {
      const res = await api.register(data);
      setCustomer(res.customer);
      setToken(res.token);
      setWishlist(res.customer.wishlist || []);
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, res.token);
      }
      return true;
    } catch (err: any) {
      alert(err.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    setWishlist([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!token) {
      // Local fallback wishlist for guests
      setWishlist(prev => {
        const exists = prev.includes(productId);
        const next = exists ? prev.filter(id => id !== productId) : [...prev, productId];
        return next;
      });
      return;
    }

    try {
      const res = await api.toggleWishlist(productId, token);
      setWishlist(res.wishlist);
    } catch (err: any) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: !!customer,
        login,
        register,
        logout,
        wishlist,
        toggleWishlist,
        isInWishlist,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
