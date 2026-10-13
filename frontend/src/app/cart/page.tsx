'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    const res = await applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.error || 'Failed to apply coupon');
    } else {
      setCouponInput('');
    }
    setCouponLoading(false);
  };

  const FREE_SHIPPING_THRESHOLD = 1999;
  const currentSubtotal = cart?.subtotal || 0;
  const diffForFree = FREE_SHIPPING_THRESHOLD - currentSubtotal;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#1A1A22] border border-[#2B2B36] flex items-center justify-center mx-auto text-[#6A6A76]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-white">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-[#8A8A96] max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added any garments from our latest drop yet.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-lg"
        >
          Explore Capsule Drops
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Shopping Bag ({cart.items.length} items)
        </h1>
        <p className="text-xs text-[#8A8A96] mt-1">Review your selected pieces before checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Line Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Alert */}
          <div className="bg-[#18181E] border border-[#272733] p-4 rounded-2xl flex items-center space-x-3 text-xs">
            <Truck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
            <div>
              {diffForFree <= 0 ? (
                <span className="text-[#10B981] font-semibold">
                  You've unlocked FREE Pan-India Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#D4AF37]">₹{diffForFree.toLocaleString()}</strong> more to your order for{' '}
                  <strong className="text-white">FREE Pan-India Express Delivery</strong>.
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#141418] border border-[#22222A] rounded-2xl divide-y divide-[#202028] overflow-hidden">
            {cart.items.map(item => (
              <div key={item.id} className="p-4 sm:p-6 flex space-x-4 sm:space-x-6">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-24 h-32 object-cover rounded-xl border border-[#262632]"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-editorial text-base sm:text-lg font-bold text-white">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-[#9E9EAA] mt-1">
                        <span>Size: <strong>{item.size}</strong></span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span>{item.color}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#646472] hover:text-[#E06D53] p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1C1C24]">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-3 bg-[#1A1A22] border border-[#2A2A35] rounded-full px-3 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-[#8A8A96] hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-[#8A8A96] hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-bold text-[#D4AF37]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                      {item.regular_price > item.price && (
                        <div className="text-xs text-[#6A6A76] line-through">
                          ₹{(item.regular_price * item.quantity).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="space-y-6">
          <div className="bg-[#141418] border border-[#24242E] p-6 rounded-2xl space-y-5">
            <h2 className="font-editorial text-lg font-bold text-white">Order Summary</h2>

            {/* Coupon Code Section */}
            <div>
              {cart.coupon_code ? (
                <div className="flex items-center justify-between bg-[#19241B] border border-[#24522E] text-[#4ADE80] p-3 rounded-xl text-xs">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>
                      Coupon <strong>{cart.coupon_code}</strong> (-₹
                      {cart.discount_amount.toLocaleString()})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#F87171] hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. DSFIRST10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#1A1A22] border border-[#2B2B36] text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#D4AF37] uppercase placeholder:normal-case placeholder:text-[#646472]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="bg-[#242430] hover:bg-[#343442] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-[#F87171] mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-[#A0A0B0] pt-3 border-t border-[#202028]">
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
                <span>Shipping Estimate</span>
                <span className="text-white font-medium">
                  {cart.shipping_total === 0 ? (
                    <span className="text-[#10B981] font-semibold">FREE</span>
                  ) : (
                    `₹${cart.shipping_total}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#242430]">
                <span>Total Amount</span>
                <span className="font-editorial text-2xl text-gold-gradient">
                  ₹{cart.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E5C058] hover:from-[#C49F27] hover:to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-full flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-[#D4AF37]/20 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-[#141418] border border-[#24242E] p-4 rounded-2xl space-y-2 text-xs text-[#8E8E9E]">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>DS Wardrobe Buyer Protection</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every drop is 100% verified, hand-inspected, and packaged in customized boutique boxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
