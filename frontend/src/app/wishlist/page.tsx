'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../lib/api';
import { Product } from '../../types/commerce';
import { ProductCard } from '../../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        setLoading(true);
        if (wishlist.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const res = await api.getProducts({ limit: 50 });
        const filtered = res.products.filter(p => wishlist.includes(p.id));
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to load wishlist products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistProducts();
  }, [wishlist]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-96 rounded-2xl shimmer-box border border-[#22222A]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#24242E]">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Heart className="w-7 h-7 text-[#D4AF37] fill-[#D4AF37]" />
            <span>Saved Wishlist ({products.length})</span>
          </h1>
          <p className="text-xs text-[#8A8A96] mt-1">
            Pieces you've curated for upcoming celebrations and soirees.
          </p>
        </div>

        <Link
          href="/shop"
          className="text-xs font-semibold text-[#D4AF37] hover:underline"
        >
          Explore More Drops
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-[#141418] border border-[#24242E] rounded-3xl p-16 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#1C1C24] flex items-center justify-center mx-auto text-[#666674]">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-white">Your Wishlist is Empty</h2>
          <p className="text-xs text-[#8A8A96] leading-relaxed">
            Tap the heart icon on any garment in our catalog to save it to your personal boutique wishlist.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow"
          >
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
