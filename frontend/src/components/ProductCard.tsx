'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../types/commerce';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [addingSize, setAddingSize] = useState<string | null>(null);

  const isSaved = isInWishlist(product.id);

  // Price calculations
  const lowestSalePrice = Math.min(...product.variants.map(v => v.sale_price ?? v.price));
  const highestRegularPrice = Math.max(...product.variants.map(v => v.price));
  const hasDiscount = lowestSalePrice < highestRegularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((highestRegularPrice - lowestSalePrice) / highestRegularPrice) * 100)
    : 0;

  // Stock check
  const isOutOfStock = product.variants.every(v => !v.in_stock || v.inventory_quantity <= 0);

  // Available unique sizes
  const sizes = Array.from(new Set(product.variants.map(v => v.size)));

  // Secondary hover image
  const displayImage = isHovered && product.images && product.images.length > 1
    ? product.images[1]
    : product.thumbnail;

  const handleQuickAdd = async (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    const targetVariant = product.variants.find(
      v => v.size === size && v.in_stock && v.inventory_quantity > 0
    );

    if (!targetVariant) {
      alert(`Size ${size} is currently out of stock`);
      return;
    }

    setAddingSize(size);
    await addToCart(product.id, targetVariant.id, 1);
    setAddingSize(null);
  };

  return (
    <div
      className="group relative flex flex-col bg-[#141417] border border-[#22222A] hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <Link href={`/product/${product.handle}`} className="relative block aspect-[4/5] overflow-hidden bg-[#1B1B20]">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-[#1A1A1E]/90 text-[#F87171] border border-[#F87171]/40 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm">
              Sold Out
            </span>
          ) : hasDiscount ? (
            <span className="bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
              {discountPercent}% OFF
            </span>
          ) : product.is_new_arrival ? (
            <span className="bg-white text-black text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
              New Drop
            </span>
          ) : null}

          {product.is_best_seller && (
            <span className="bg-[#1C1C22]/90 text-[#F3E5AB] border border-[#D4AF37]/30 text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm">
              ⚡ Trending
            </span>
          )}
        </div>

        {/* Wishlist Button Top Right */}
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isSaved
              ? 'bg-[#D4AF37] text-black shadow-lg'
              : 'bg-black/40 text-white hover:bg-black/70 hover:text-[#D4AF37]'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover (Desktop) */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:flex flex-col space-y-1.5 z-10">
            <span className="text-[10px] text-[#C4C4D0] font-semibold tracking-wider uppercase text-center">
              Quick Add Size
            </span>
            <div className="flex items-center justify-center space-x-1.5 flex-wrap gap-y-1">
              {sizes.map(size => {
                const variantForSize = product.variants.find(v => v.size === size);
                const available = variantForSize && variantForSize.in_stock && variantForSize.inventory_quantity > 0;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!available || addingSize === size}
                    onClick={e => handleQuickAdd(e, size)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded border transition-all ${
                      available
                        ? 'bg-black/60 hover:bg-[#D4AF37] hover:text-black border-white/20 text-white active:scale-95'
                        : 'bg-black/30 border-white/5 text-white/30 line-through cursor-not-allowed'
                    }`}
                  >
                    {addingSize === size ? '...' : size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#8C8C98]">
            <span className="uppercase tracking-wider font-medium">{product.category}</span>
            <div className="flex items-center space-x-1 text-[#F3E5AB]">
              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-semibold text-white">{product.rating}</span>
              <span className="text-[#646470]">({product.reviews_count})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.handle}`} className="block mt-1 group-hover:text-[#D4AF37] transition-colors">
            <h3 className="font-editorial text-sm sm:text-base font-medium text-white line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Color swatches preview */}
          <div className="flex items-center space-x-1.5 mt-2">
            {product.variants.slice(0, 4).map(v => (
              <span
                key={v.id}
                title={v.color}
                className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-sm"
                style={{ backgroundColor: v.colorHex }}
              />
            ))}
            {product.variants.length > 4 && (
              <span className="text-[10px] text-[#7C7C8A]">+{product.variants.length - 4}</span>
            )}
          </div>
        </div>

        {/* Pricing & Mobile Quick Action */}
        <div className="flex items-center justify-between pt-2 border-t border-[#202026]">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-bold text-[#D4AF37]">
              ₹{lowestSalePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#70707D] line-through">
                ₹{highestRegularPrice.toLocaleString()}
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.handle}`}
            className="sm:hidden p-2 rounded-full bg-[#202026] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
            aria-label="View Product"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
