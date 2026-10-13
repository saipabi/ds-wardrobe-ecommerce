'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { wishlist } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Hide on admin routes to prevent overlapping
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101012]/95 backdrop-blur-lg border-t border-[#26262D] px-2 py-1.5 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around text-[10px] font-medium tracking-wider">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-2.5 transition-colors ${
            pathname === '/' ? 'text-[#D4AF37]' : 'text-[#8E8E98] hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center py-1 px-2.5 transition-colors ${
            pathname.startsWith('/shop') ? 'text-[#D4AF37]' : 'text-[#8E8E98] hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Catalog</span>
        </Link>

        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center py-1 px-2.5 transition-colors ${
            pathname === '/wishlist' ? 'text-[#D4AF37]' : 'text-[#8E8E98] hover:text-white'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5 mb-0.5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-black font-extrabold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </Link>

        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center py-1 px-2.5 text-[#8E8E98] hover:text-[#D4AF37] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-[#D4AF37]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-black font-extrabold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[#D4AF37] font-semibold">Bag</span>
        </button>

        <Link
          href="/account"
          className={`flex flex-col items-center py-1 px-2.5 transition-colors ${
            pathname.startsWith('/account') ? 'text-[#D4AF37]' : 'text-[#8E8E98] hover:text-white'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Account</span>
        </Link>
      </div>
    </nav>
  );
};
