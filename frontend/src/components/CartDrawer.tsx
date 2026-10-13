'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Truck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 1999;
  const currentSubtotal = cart?.subtotal || 0;
  const diffForFree = FREE_SHIPPING_THRESHOLD - currentSubtotal;
  const freeShippingProgress = Math.min(100, Math.round((currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponSuccess(`Coupon ${couponInput.toUpperCase()} applied!`);
      setCouponInput('');
    } else {
      setCouponError(res.error || 'Failed to apply coupon');
    }
    setCouponLoading(false);
  };

  const handleCheckoutClick = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111114] border-l border-[#24242B] shadow-2xl flex flex-col text-[#F5F5F7]">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#24242B] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-editorial text-lg font-semibold tracking-wide text-white">
                Your Shopping Bag ({cart?.items.length || 0})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#888894] hover:text-white rounded-full hover:bg-[#202026] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#18181D] px-5 py-3 border-b border-[#25252E]">
            <div className="flex items-center space-x-2 text-xs text-[#D8D8E0] mb-1.5 font-medium">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              {diffForFree <= 0 ? (
                <span className="text-[#10B981] font-semibold flex items-center space-x-1">
                  <span>Congratulations! You've unlocked FREE Pan-India Shipping!</span>
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#D4AF37]">₹{diffForFree.toLocaleString()}</strong> more for{' '}
                  <strong className="text-white">FREE Pan-India Shipping</strong>
                </span>
              )}
            </div>
            <div className="w-full bg-[#2B2B36] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6CA] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#202028]">
            {!cart || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1C1C22] flex items-center justify-center text-[#555562]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-xl font-semibold text-white">Your bag is empty</h3>
                <p className="text-xs text-[#8A8A96] max-w-xs leading-relaxed">
                  Discover curations from our latest drops — sculpted co-ords, liquid satins, and festive couture.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    router.push('/shop');
                  }}
                  className="mt-2 bg-[#D4AF37] hover:bg-[#E5C058] text-black text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-lg"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map(item => (
                  <div key={item.id} className="pt-4 first:pt-0 flex space-x-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-20 h-26 object-cover rounded-lg border border-[#272730]"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-white line-clamp-1 pr-2">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#6C6C78] hover:text-[#E06D53] p-0.5 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variant details */}
                        <div className="flex items-center space-x-2 text-[11px] text-[#9A9AA6] mt-1">
                          <span className="bg-[#1C1C22] px-2 py-0.5 rounded border border-[#292934]">
                            Size: {item.size}
                          </span>
                          <span className="flex items-center space-x-1 bg-[#1C1C22] px-2 py-0.5 rounded border border-[#292934]">
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span>{item.color}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity adjuster */}
                        <div className="flex items-center space-x-2 bg-[#1B1B22] border border-[#2B2B36] rounded-full px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-[#8E8E9A] hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-1 text-white min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[#8E8E9A] hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#D4AF37]">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                          {item.regular_price > item.price && (
                            <div className="text-[10px] text-[#6E6E7A] line-through">
                              ₹{(item.regular_price * item.quantity).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer with Coupon & Checkout */}
          {cart && cart.items.length > 0 && (
            <div className="p-5 border-t border-[#24242B] bg-[#141418] space-y-4">
              {/* Coupon Form */}
              <div>
                {cart.coupon_code ? (
                  <div className="flex items-center justify-between bg-[#1A261D] border border-[#265331] text-[#4ADE80] px-3.5 py-2 rounded-lg text-xs">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-3.5 h-3.5" />
                      <span>
                        Coupon <strong>{cart.coupon_code}</strong> applied (-₹
                        {cart.discount_amount.toLocaleString()})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#F87171] hover:underline font-semibold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. DSFIRST10)"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#1A1A20] text-xs text-white px-3 py-2 rounded-lg border border-[#2D2D38] focus:border-[#D4AF37] focus:outline-none uppercase placeholder:normal-case placeholder:text-[#646472]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="bg-[#262630] hover:bg-[#343442] text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-white"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponError && <p className="text-[11px] text-[#F87171] mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-[#4ADE80] mt-1">{couponSuccess}</p>}
              </div>

              {/* Price Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-[#A0A0AC] pt-2 border-t border-[#202028]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{cart.subtotal.toLocaleString()}</span>
                </div>
                {cart.discount_amount > 0 && (
                  <div className="flex justify-between text-[#4ADE80]">
                    <span>Discount</span>
                    <span>-₹{cart.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-white font-medium">
                    {cart.shipping_total === 0 ? (
                      <span className="text-[#10B981] font-semibold">FREE</span>
                    ) : (
                      `₹${cart.shipping_total}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#262630]">
                  <span>Total Due</span>
                  <span className="text-gold-gradient font-editorial text-lg">
                    ₹{cart.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E5C058] hover:from-[#C49F27] hover:to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-full flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-[#D4AF37]/20 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center space-x-2 text-[10px] text-[#7E7E8C]">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Pan-India Delivery • 100% Authentic Quality Guaranteed</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
