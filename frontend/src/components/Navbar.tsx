'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Product } from '../types/commerce';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { openCart, itemCount, cart } = useCart();
  const { customer, isAuthenticated, logout, wishlist } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Synchronize searchQuery with URL query parameter
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
    } else if (pathname === '/shop' || pathname === '/') {
      setSearchQuery('');
    }
  }, [searchParams, pathname]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    if (pathname === '/shop') {
      const cat = searchParams.get('category');
      if (cat) {
        router.push(`/shop?category=${encodeURIComponent(cat)}`);
      } else {
        router.push('/shop');
      }
    }
  };

  const handleNavClick = () => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await api.getProducts({ q: searchQuery, limit: 5 });
        setSearchResults(res.products);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#121214] border-b border-[#24242A] text-xs py-2 px-4 tracking-wider text-center flex items-center justify-between overflow-hidden">
        <div className="hidden md:flex items-center space-x-4 text-[#A0A0AA] text-[11px]">
          <span>⚡ PAN-INDIA EXPEDITED SHIPPING</span>
          <span>•</span>
          <span className="text-[#D4AF37]">CODE: <strong>DSFIRST10</strong> FOR 10% OFF</span>
        </div>
        <div className="w-full md:w-auto text-center font-medium text-[#F3E5AB]">
          <span>"Your style is Ur personal brand" ⚡ Where Fashion Meets Purpose</span>
        </div>
        <div className="hidden lg:flex items-center space-x-4 text-[11px] text-[#A0A0AA]">
          <a
            href="https://www.instagram.com/ds__wardrobe__/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            @ds__wardrobe__
          </a>
          <span>•</span>
          <Link href="/track-order" className="hover:text-[#D4AF37] transition-colors">
            Track Order
          </Link>
        </div>
      </div>

      {/* Main Luxury Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0D0D0E]/95 backdrop-blur-md shadow-2xl border-b border-[#26262D]'
            : 'bg-[#0D0D0E] border-b border-[#1E1E24]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#E4E4E7] hover:text-[#D4AF37] transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo & Editorial Typography */}
            <div className="flex flex-col items-center lg:items-start">
              <Link href="/" className="group flex flex-col items-center lg:items-start text-center">
                <span className="font-brand text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-gold-gradient group-hover:opacity-90 transition-opacity">
                  DS WARDROBE
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#A5A5B0] uppercase font-medium">
                  Couture & Ready-to-Wear
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-widest uppercase">
              <Link
                href="/"
                onClick={handleNavClick}
                className="text-[#E0E0E6] hover:text-[#D4AF37] transition-colors py-2"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={handleNavClick}
                className="text-[#E0E0E6] hover:text-[#D4AF37] transition-colors py-2"
              >
                Shop All
              </Link>
              <Link
                href="/shop?category=Dresses"
                onClick={handleNavClick}
                className="text-[#E0E0E6] hover:text-[#D4AF37] transition-colors py-2"
              >
                Dresses
              </Link>
              <Link
                href="/shop?category=Co-ord+Sets"
                onClick={handleNavClick}
                className="text-[#E0E0E6] hover:text-[#D4AF37] transition-colors py-2"
              >
                Co-ords
              </Link>
              <Link
                href="/shop?category=Festive+%26+Fusion"
                onClick={handleNavClick}
                className="text-[#E0E0E6] hover:text-[#D4AF37] transition-colors py-2 flex items-center space-x-1"
              >
                <span>Festive</span>
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              </Link>
              <Link
                href="/track-order"
                onClick={handleNavClick}
                className="text-[#E0E0E6] hover:text-[#D4AF37] transition-colors py-2"
              >
                Track
              </Link>
              <Link
                href="/admin"
                onClick={handleNavClick}
                className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors py-2 px-2.5 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[10px]"
              >
                Admin
              </Link>
            </nav>

            {/* Right Tools: Live Search, Wishlist, Account, Cart */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Bar with Autocomplete Dropdown */}
              <div ref={searchRef} className="relative hidden md:block w-48 lg:w-64">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search drops, styles..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        if (searchResults.length > 0) setShowSearchDropdown(true);
                      }}
                      className="w-full bg-[#16161A] text-xs text-[#EAEAEF] pl-9 pr-8 py-2 rounded-full border border-[#2B2B32] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-[#6E6E78]"
                    />
                    <Search className="w-4 h-4 text-[#8A8A94] absolute left-3 top-2.5 pointer-events-none" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-2.5 top-2.5 text-[#8A8A94] hover:text-white transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Instant Search Dropdown */}
                {showSearchDropdown && (
                  <div className="absolute top-full mt-2 w-80 right-0 glass-dropdown rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[10px] tracking-wider text-[#A0A0AA] uppercase font-semibold pb-2 border-b border-[#282830]">
                      {searchLoading ? 'Searching...' : `Matching Items (${searchResults.length})`}
                    </div>

                    {searchResults.length === 0 && !searchLoading ? (
                      <div className="py-4 text-xs text-center text-[#888894]">
                        No matching drops found.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#24242C] max-h-72 overflow-y-auto">
                        {searchResults.map(prod => (
                          <Link
                            key={prod.id}
                            href={`/product/${prod.handle}`}
                            onClick={() => setShowSearchDropdown(false)}
                            className="flex items-center space-x-3 py-2.5 px-1 hover:bg-[#202026] rounded-lg transition-colors group"
                          >
                            <img
                              src={prod.thumbnail}
                              alt={prod.title}
                              className="w-11 h-13 object-cover rounded shadow"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium text-white truncate group-hover:text-[#D4AF37]">
                                {prod.title}
                              </h4>
                              <p className="text-[11px] text-[#A0A0AA] truncate">{prod.category}</p>
                              <p className="text-xs font-semibold text-[#D4AF37] mt-0.5">
                                ₹{prod.variants[0]?.sale_price || prod.variants[0]?.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="relative p-2 text-[#E0E0E6] hover:text-[#D4AF37] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D4AF37] text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <Link
                href="/account"
                className="p-2 text-[#E0E0E6] hover:text-[#D4AF37] transition-colors hidden sm:block"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center space-x-2 bg-gradient-to-r from-[#1E1E22] to-[#2A2A32] hover:from-[#26262C] hover:to-[#383842] border border-[#3E3E48] px-3.5 py-2 rounded-full text-xs font-semibold text-white transition-all shadow-md group"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Bag</span>
                <span className="bg-[#D4AF37] text-black font-extrabold text-[10px] px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {itemCount}
                </span>
                {cart && cart.total > 0 && (
                  <span className="hidden md:inline text-[11px] text-[#D4AF37] font-bold border-l border-[#40404C] pl-2">
                    ₹{cart.total.toLocaleString()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden px-4 pb-3 relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DS Wardrobe drops..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                className="w-full bg-[#16161A] text-xs text-[#EAEAEF] pl-9 pr-8 py-2 rounded-full border border-[#2B2B32] focus:border-[#D4AF37] focus:outline-none placeholder:text-[#6E6E78]"
              />
              <Search className="w-4 h-4 text-[#8A8A94] absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-2.5 text-[#8A8A94] hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Instant Search Dropdown for Mobile */}
          {showSearchDropdown && (
            <div className="absolute top-full left-4 right-4 mt-1 bg-[#141418] border border-[#2B2B36] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] tracking-wider text-[#A0A0AA] uppercase font-semibold pb-2 border-b border-[#282830]">
                {searchLoading ? 'Searching...' : `Matching Items (${searchResults.length})`}
              </div>

              {searchResults.length === 0 && !searchLoading ? (
                <div className="py-4 text-xs text-center text-[#888894]">
                  No matching drops found.
                </div>
              ) : (
                <div className="divide-y divide-[#24242C] max-h-60 overflow-y-auto">
                  {searchResults.map(prod => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.handle}`}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 py-2 px-1 hover:bg-[#202026] rounded-lg transition-colors group"
                    >
                      <img
                        src={prod.thumbnail}
                        alt={prod.title}
                        className="w-10 h-12 object-cover rounded shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-white truncate group-hover:text-[#D4AF37]">
                          {prod.title}
                        </h4>
                        <p className="text-[10px] text-[#A0A0AA] truncate">{prod.category}</p>
                        <p className="text-xs font-semibold text-[#D4AF37] mt-0.5">
                          ₹{prod.variants[0]?.sale_price || prod.variants[0]?.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#121214] border-r border-[#24242B] h-full flex flex-col p-6 z-10 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-[#24242B]">
              <div className="flex flex-col">
                <span className="font-brand text-xl font-extrabold text-gold-gradient tracking-widest">
                  DS WARDROBE
                </span>
                <span className="text-[9px] text-[#888894] tracking-widest uppercase">
                  Modern Boutique
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#9999A5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 flex flex-col space-y-4 text-sm font-semibold tracking-wider uppercase">
              <Link
                href="/"
                onClick={handleNavClick}
                className="flex items-center justify-between text-[#E5E5EB] hover:text-[#D4AF37] py-2 border-b border-[#1E1E24]"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-[#555562]" />
              </Link>
              <Link
                href="/shop"
                onClick={handleNavClick}
                className="flex items-center justify-between text-[#E5E5EB] hover:text-[#D4AF37] py-2 border-b border-[#1E1E24]"
              >
                <span>All Catalog</span>
                <ChevronRight className="w-4 h-4 text-[#555562]" />
              </Link>
              <Link
                href="/shop?category=Dresses"
                onClick={handleNavClick}
                className="flex items-center justify-between text-[#E5E5EB] hover:text-[#D4AF37] py-2 border-b border-[#1E1E24]"
              >
                <span>Dresses & Gowns</span>
                <ChevronRight className="w-4 h-4 text-[#555562]" />
              </Link>
              <Link
                href="/shop?category=Co-ord+Sets"
                onClick={handleNavClick}
                className="flex items-center justify-between text-[#E5E5EB] hover:text-[#D4AF37] py-2 border-b border-[#1E1E24]"
              >
                <span>Co-ord Sets</span>
                <ChevronRight className="w-4 h-4 text-[#555562]" />
              </Link>
              <Link
                href="/shop?category=Festive+%26+Fusion"
                onClick={handleNavClick}
                className="flex items-center justify-between text-[#E5E5EB] hover:text-[#D4AF37] py-2 border-b border-[#1E1E24]"
              >
                <span className="flex items-center space-x-1.5">
                  <span>Festive & Fusion</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </span>
                <ChevronRight className="w-4 h-4 text-[#555562]" />
              </Link>
              <Link
                href="/track-order"
                onClick={handleNavClick}
                className="flex items-center justify-between text-[#E5E5EB] hover:text-[#D4AF37] py-2 border-b border-[#1E1E24]"
              >
                <span>Track Order</span>
                <PackageCheck className="w-4 h-4 text-[#D4AF37]" />
              </Link>
              <Link
                href="/wishlist"
                onClick={handleNavClick}
                className="flex items-center justify-between text-[#E5E5EB] hover:text-[#D4AF37] py-2 border-b border-[#1E1E24]"
              >
                <span>Wishlist ({wishlist.length})</span>
                <Heart className="w-4 h-4 text-[#E06D53]" />
              </Link>
              <Link
                href="/account"
                onClick={handleNavClick}
                className="flex items-center justify-between text-[#E5E5EB] hover:text-[#D4AF37] py-2 border-b border-[#1E1E24]"
              >
                <span>My Account</span>
                <User className="w-4 h-4 text-[#A0A0B0]" />
              </Link>
              <Link
                href="/admin"
                onClick={handleNavClick}
                className="flex items-center justify-between text-[#D4AF37] py-2 border-b border-[#1E1E24]"
              >
                <span>Admin Portal</span>
                <ShieldCheck className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-auto pt-6 border-t border-[#222228] text-xs text-[#8A8A96] space-y-2">
              <p className="text-white font-medium">Boutique Customer Care</p>
              <p>Direct Phone / WhatsApp: +91 70329 32549</p>
              <p>Singarayakonda, Andhra Pradesh, India</p>
              <a
                href="https://www.instagram.com/ds__wardrobe__/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#D4AF37] underline pt-1"
              >
                Follow on Instagram @ds__wardrobe__
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
