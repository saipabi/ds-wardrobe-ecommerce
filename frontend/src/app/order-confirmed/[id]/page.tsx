'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Sparkles,
  MapPin,
  CreditCard,
  Phone
} from 'lucide-react';
import { api } from '../../../lib/api';
import { Order } from '../../../types/commerce';

function OrderConfirmedContent() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const res = await api.getOrder(orderId);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-white space-y-4">
        <div className="w-16 h-16 rounded-full shimmer-box mx-auto" />
        <p className="text-xs text-[#8A8A96]">Retrieving your order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-white">Order Details Unavailable</h2>
        <p className="text-xs text-[#8A8A96]">Could not locate order #{orderId}.</p>
        <Link href="/" className="inline-block bg-[#D4AF37] text-black text-xs font-bold px-6 py-3 rounded-full">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center mx-auto shadow-xl animate-in zoom-in">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payment & Order Confirmed</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Thank you for choosing DS Wardrobe
        </h1>

        <p className="text-xs sm:text-sm text-[#A0A0B0] max-w-md mx-auto leading-relaxed">
          Your order has been registered at our Singarayakonda studio. A confirmation has been dispatched to{' '}
          <strong className="text-white">{order.email}</strong>.
        </p>

        <div className="pt-2">
          <span className="inline-block bg-[#1B1B22] border border-[#2B2B38] text-white px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider">
            Order Reference: <strong className="text-[#D4AF37]">{order.display_id}</strong>
          </span>
        </div>
      </div>

      {/* Main Order Receipt Container */}
      <div className="bg-[#141418] border border-[#252530] rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* Tracking Action Bar */}
        <div className="bg-[#1C1C24] border border-[#2C2C3A] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs">
            <Truck className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <p className="font-bold text-white">Courier: {order.courier_name}</p>
              <p className="text-[11px] text-[#8E8E9E]">Tracking Number: {order.tracking_number}</p>
            </div>
          </div>

          <Link
            href={`/track-order?id=${encodeURIComponent(order.display_id)}`}
            className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full flex items-center justify-center space-x-2 transition-all shadow"
          >
            <span>Track Live Shipment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Ordered Garments */}
        <div className="space-y-4">
          <h3 className="font-editorial text-lg font-bold text-white border-b border-[#202028] pb-3">
            Garments in this Order
          </h3>

          <div className="divide-y divide-[#202028]">
            {order.items.map(item => (
              <div key={item.id} className="py-3 flex space-x-4 text-xs">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded-xl border border-[#262632]"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-[#888898] mt-0.5">
                      Size: {item.size} • Color: {item.color} • Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-[#D4AF37]">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Grid: Shipping Address & Financials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#202028] text-xs">
          {/* Address */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[#A0A0B0] flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Shipping Destination</span>
            </h4>
            <div className="text-[#C8C8D4] leading-relaxed">
              <p className="font-bold text-white">
                {order.shipping_address.first_name} {order.shipping_address.last_name}
              </p>
              <p>{order.shipping_address.address_line1}</p>
              {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
              </p>
              <p>Phone: {order.shipping_address.phone}</p>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 bg-[#1A1A22] p-4 rounded-xl border border-[#282836]">
            <div className="flex justify-between text-[#8E8E9E]">
              <span>Subtotal</span>
              <span className="text-white font-medium">₹{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount_total > 0 && (
              <div className="flex justify-between text-[#10B981]">
                <span>Discount Applied</span>
                <span>-₹{order.discount_total.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-[#8E8E9E]">
              <span>Shipping</span>
              <span className="text-white font-medium">
                {order.shipping_total === 0 ? 'FREE' : `₹${order.shipping_total}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#252532]">
              <span>Total Paid</span>
              <span className="font-editorial text-xl text-gold-gradient">
                ₹{order.total.toLocaleString()}
              </span>
            </div>
            <div className="text-[10px] text-[#70707E] text-right">
              Payment Method: {order.payment_method.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Continuation & WhatsApp Support */}
      <div className="text-center space-y-4 pt-4">
        <Link
          href="/shop"
          className="inline-block bg-[#1B1B22] hover:bg-[#282834] text-white border border-[#343444] text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all"
        >
          Continue Exploring Drops
        </Link>

        <p className="text-xs text-[#7A7A8A]">
          Questions regarding your drop piece? Direct WhatsApp Concierge:{' '}
          <a href="https://wa.me/917032932549" className="text-[#D4AF37] underline font-semibold">
            +91 70329 32549
          </a>
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-white">Loading order confirmation...</div>}>
      <OrderConfirmedContent />
    </Suspense>
  );
}
