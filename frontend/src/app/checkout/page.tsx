'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Address } from '../../types/commerce';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  const { customer, isAuthenticated } = useAuth();

  // Contact Info
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Shipping Address
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Andhra Pradesh');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Shipping & Payment Options
  const [shippingMethod, setShippingMethod] = useState<'ship_standard' | 'ship_express'>('ship_standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-fill if customer logged in
  useEffect(() => {
    if (customer) {
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setFirstName(customer.first_name || '');
      setLastName(customer.last_name || '');
      if (customer.addresses && customer.addresses.length > 0) {
        const addr = customer.addresses[0];
        setAddressLine1(addr.address_line1 || '');
        setCity(addr.city || '');
        setState(addr.state || 'Andhra Pradesh');
        setPostalCode(addr.postal_code || '');
      }
    }
  }, [customer]);

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  if (!cartLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-editorial text-3xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-[#8A8A96]">Please add pieces to your bag before checking out.</p>
        <Link
          href="/shop"
          className="inline-block bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart) return;

    setErrorMsg(null);

    // Basic Validations
    if (!email || !phone || !firstName || !addressLine1 || !city || !postalCode) {
      setErrorMsg('Please complete all required shipping & contact fields.');
      return;
    }

    if (postalCode.length < 6) {
      setErrorMsg('Please provide a valid 6-digit Indian PIN Code.');
      return;
    }

    try {
      setSubmitting(true);

      const shippingAddress: Address = {
        first_name: firstName,
        last_name: lastName || '',
        email,
        phone,
        address_line1: addressLine1,
        address_line2: addressLine2 || undefined,
        city,
        state,
        postal_code: postalCode,
        country: 'India'
      };

      const res = await api.checkout({
        cart_id: cart.id,
        email,
        phone,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        payment_id: paymentMethod === 'upi' ? (upiId || 'UPI_SIMULATED_SUCCESS') : `PAY_${Math.floor(100000 + Math.random() * 900000)}`,
        notes
      });

      // Navigate to confirmation page
      router.push(`/order-confirmed/${res.order.id}`);
    } catch (err: any) {
      console.error('Order creation failed:', err);
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#24242E] mb-8">
        <div>
          <Link href="/" className="font-brand text-2xl font-extrabold text-gold-gradient tracking-widest">
            DS WARDROBE
          </Link>
          <span className="text-[11px] text-[#8C8C98] block mt-0.5">
            Encrypted Luxury Checkout
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#10B981] font-semibold bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/30">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Checkout Form Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact */}
            <div className="bg-[#141418] border border-[#24242E] p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-editorial text-lg font-bold text-white flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Contact Information</span>
                </h2>
                {!isAuthenticated && (
                  <Link href="/account" className="text-xs text-[#D4AF37] hover:underline">
                    Have an account? Log in
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#A0A0B0] font-semibold uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-[#70707E] mt-1 block">
                    Order confirmation & invoice will be sent here
                  </span>
                </div>

                <div>
                  <label className="block text-[#A0A0B0] font-semibold uppercase tracking-wider mb-1">
                    Mobile Phone * (for WhatsApp tracking)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-[#70707E] mt-1 block">
                    Real-time courier dispatch alerts
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-[#141418] border border-[#24242E] p-6 rounded-2xl space-y-4">
              <h2 className="font-editorial text-lg font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>Delivery Address (Pan-India)</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A0A0B0] font-semibold uppercase tracking-wider mb-1">
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
                    <label className="block text-[#A0A0B0] font-semibold uppercase tracking-wider mb-1">
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

                <div>
                  <label className="block text-[#A0A0B0] font-semibold uppercase tracking-wider mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House / Apartment no., Street, Landmark"
                    value={addressLine1}
                    onChange={e => setAddressLine1(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#A0A0B0] font-semibold uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A0A0B0] font-semibold uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#A0A0B0] font-semibold uppercase tracking-wider mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6 digits"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A0A0B0] font-semibold uppercase tracking-wider mb-1">
                    Order Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leave with security / Ring bell twice"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-[#141418] border border-[#24242E] p-6 rounded-2xl space-y-4">
              <h2 className="font-editorial text-lg font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>Select Payment Method</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* UPI Option */}
                <label
                  className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-[#1D1D26] border-[#D4AF37]'
                      : 'bg-[#18181E] border-[#292934] hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-1 accent-[#D4AF37]"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-bold text-white">Instant UPI / QR / Google Pay / PhonePe</span>
                      </div>
                      <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] font-semibold px-2 py-0.5 rounded-full">
                        Fastest
                      </span>
                    </div>
                    {paymentMethod === 'upi' && (
                      <div className="pt-2 animate-in fade-in">
                        <input
                          type="text"
                          placeholder="Enter your VPA (e.g. yourname@okhdfcbank)"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          className="w-full bg-[#131317] border border-[#2D2D38] text-white p-2.5 rounded-lg text-xs"
                        />
                        <p className="text-[10px] text-[#808090] mt-1">
                          A direct payment request or QR trigger will be initiated upon order placement.
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                {/* Card Option */}
                <label
                  className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#1D1D26] border-[#D4AF37]'
                      : 'bg-[#18181E] border-[#292934] hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#D4AF37]"
                  />
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  <div className="flex-1">
                    <span className="font-bold text-white">Credit / Debit Card</span>
                    <span className="text-[11px] text-[#7A7A88] block">Visa, MasterCard, RuPay & Amex</span>
                  </div>
                </label>

                {/* NetBanking */}
                <label
                  className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-[#1D1D26] border-[#D4AF37]'
                      : 'bg-[#18181E] border-[#292934] hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="accent-[#D4AF37]"
                  />
                  <Building className="w-4 h-4 text-[#D4AF37]" />
                  <div className="flex-1">
                    <span className="font-bold text-white">NetBanking</span>
                    <span className="text-[11px] text-[#7A7A88] block">HDFC, ICICI, SBI, Axis, Kotak</span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#1D1D26] border-[#D4AF37]'
                      : 'bg-[#18181E] border-[#292934] hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#D4AF37]"
                  />
                  <Banknote className="w-4 h-4 text-[#D4AF37]" />
                  <div className="flex-1">
                    <span className="font-bold text-white">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-[#7A7A88] block">Pay cash or UPI to courier upon delivery</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141418] border border-[#24242E] p-6 rounded-2xl space-y-6 sticky top-28 shadow-xl">
              <h3 className="font-editorial text-lg font-bold text-white flex items-center justify-between pb-4 border-b border-[#22222A]">
                <span>Order Summary</span>
                <span className="text-xs text-[#D4AF37] font-sans font-semibold">
                  {cart?.items.length} items
                </span>
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-[#1F1F28] pr-1">
                {cart?.items.map(item => (
                  <div key={item.id} className="py-3 flex space-x-3 text-xs">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-14 h-18 object-cover rounded-lg border border-[#252530]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-[#808090]">
                        Size: {item.size} • {item.color} • Qty: {item.quantity}
                      </p>
                      <p className="text-xs font-bold text-[#D4AF37] mt-1">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 text-xs text-[#A0A0B0] pt-4 border-t border-[#22222A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{cart?.subtotal.toLocaleString()}</span>
                </div>
                {cart && cart.discount_amount > 0 && (
                  <div className="flex justify-between text-[#4ADE80]">
                    <span>Coupon Savings ({cart.coupon_code})</span>
                    <span>-₹{cart.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Shipping</span>
                  <span className="text-white font-medium">
                    {cart?.shipping_total === 0 ? (
                      <span className="text-[#10B981] font-semibold">FREE</span>
                    ) : (
                      `₹${cart?.shipping_total}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#262630]">
                  <span>Total Amount Due</span>
                  <span className="font-editorial text-2xl text-gold-gradient">
                    ₹{cart?.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Error Callout */}
              {errorMsg && (
                <div className="p-3 bg-[#3F1B1B] border border-[#6B2828] text-[#FCA5A5] text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E5C058] hover:from-[#C49F27] hover:to-[#D4AF37] disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-full flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-[#D4AF37]/20 group"
              >
                <span>{submitting ? 'Verifying & Placing Order...' : 'Confirm & Place Order'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#7A7A8A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Pan-India Express Delivery • 100% Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
