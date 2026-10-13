'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
  Truck,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Order } from '../../types/commerce';

export default function AccountPage() {
  const { customer, token, isAuthenticated, login, register, logout, wishlist } = useAuth();

  // Auth form states
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Profile data
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      if (token && customer) {
        try {
          setLoadingOrders(true);
          const res = await api.getProfile(token);
          setOrders(res.orders || []);
        } catch (err) {
          console.error('Failed to load profile orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      }
    }

    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, token, customer]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    if (isLoginMode) {
      await login(email, password);
    } else {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone
      });
    }

    setFormSubmitting(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-[#141418] border border-[#24242E] p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="font-brand text-2xl font-extrabold text-gold-gradient tracking-widest block">
              DS WARDROBE
            </span>
            <h1 className="font-editorial text-2xl font-bold text-white">
              {isLoginMode ? 'Welcome to Your Studio' : 'Create an Account'}
            </h1>
            <p className="text-xs text-[#8A8A96]">
              {isLoginMode
                ? 'Sign in to access your order history and saved pieces.'
                : 'Join our patron circle for exclusive drop previews.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {!isLoginMode && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            )}

            <div>
              <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E5C058] hover:from-[#C49F27] hover:to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-full transition-all shadow-lg mt-2"
            >
              {formSubmitting
                ? 'Processing...'
                : isLoginMode
                ? 'Sign In to Account'
                : 'Create Account'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#22222A] text-center text-xs text-[#8A8A96]">
            {isLoginMode ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginMode(false)}
                  className="text-[#D4AF37] font-semibold hover:underline ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginMode(true)}
                  className="text-[#D4AF37] font-semibold hover:underline ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Profile Header */}
      <div className="bg-[#141418] border border-[#24242E] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-black font-extrabold text-xl flex items-center justify-center font-editorial">
            {customer?.first_name?.charAt(0) || 'D'}
          </div>
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
              {customer?.first_name} {customer?.last_name}
            </h1>
            <p className="text-xs text-[#8A8A96] mt-0.5">{customer?.email}</p>
            <p className="text-[11px] text-[#D4AF37] mt-0.5">Patron Member since {new Date(customer?.created_at || '').toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/wishlist"
            className="bg-[#1B1B22] border border-[#2D2D38] hover:border-[#D4AF37] text-xs font-semibold text-white px-4 py-2.5 rounded-full flex items-center space-x-2 transition-colors"
          >
            <Heart className="w-4 h-4 text-[#D4AF37]" />
            <span>Wishlist ({wishlist.length})</span>
          </Link>
          <button
            onClick={logout}
            className="bg-[#241A1A] border border-[#442828] text-[#F87171] text-xs font-semibold px-4 py-2.5 rounded-full flex items-center space-x-2 hover:bg-[#342222] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Orders History Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-2xl font-bold text-white flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <span>Order History ({orders.length})</span>
          </h2>
          <Link href="/track-order" className="text-xs text-[#D4AF37] hover:underline font-semibold">
            Track via Order ID
          </Link>
        </div>

        {loadingOrders ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="h-32 rounded-2xl shimmer-box border border-[#22222A]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#141418] border border-[#24242E] rounded-2xl p-12 text-center space-y-4">
            <ShoppingBag className="w-10 h-10 text-[#60606C] mx-auto" />
            <h3 className="font-editorial text-xl font-bold text-white">No Orders Placed Yet</h3>
            <p className="text-xs text-[#8A8A96] max-w-sm mx-auto">
              Your recent purchases from our curated drops will appear right here with full tracking history.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-full"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(ord => (
              <div
                key={ord.id}
                className="bg-[#141418] border border-[#24242E] rounded-2xl p-6 space-y-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202028] gap-2">
                  <div>
                    <span className="font-mono text-sm font-bold text-[#D4AF37]">
                      {ord.display_id}
                    </span>
                    <span className="text-xs text-[#8A8A98] ml-3">
                      Placed on {new Date(ord.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {ord.fulfillment_status.replace(/_/g, ' ')}
                    </span>
                    <Link
                      href={`/track-order?id=${encodeURIComponent(ord.display_id)}`}
                      className="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center space-x-1"
                    >
                      <span>Track Shipment</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-[#1E1E26]">
                  {ord.items.map(item => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-14 object-cover rounded-lg border border-[#252530]"
                        />
                        <div>
                          <h4 className="font-bold text-white">{item.title}</h4>
                          <p className="text-[10px] text-[#808090]">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-white">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#202028] flex justify-between items-center text-xs">
                  <span className="text-[#8E8E9E]">Payment: {ord.payment_method.toUpperCase()}</span>
                  <div className="text-sm font-bold text-white">
                    Total: <span className="text-[#D4AF37]">₹{ord.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
