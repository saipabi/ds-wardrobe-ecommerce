'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { api } from '../../lib/api';
import { Order } from '../../types/commerce';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderQuery, setOrderQuery] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTracking = async (displayId: string) => {
    if (!displayId.trim()) return;

    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.trackOrder(displayId.trim());
      setOrder(res.order);
      setJustRefreshed(true);
      setTimeout(() => setJustRefreshed(false), 3500);
    } catch (err: any) {
      setOrder(null);
      setErrorMsg(
        err.message || `No active order found matching ID: ${displayId}. Please check and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchTracking(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderQuery);
  };

  // Determine stage progress
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'unfulfilled': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentStage = order ? getStageIndex(order.fulfillment_status) : 0;

  const STAGES = [
    { title: 'Order Verified', desc: 'Registered at Studio' },
    { title: 'Quality Inspection', desc: 'Custom Box Packaging' },
    { title: 'Courier Dispatched', desc: 'On Route with Partner' },
    { title: 'Out for Delivery', desc: 'Executive Assigned' },
    { title: 'Delivered', desc: 'Received by Patron' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
          <Truck className="w-4 h-4" />
          <span>Real-Time Shipment Intelligence</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Track Your DS Wardrobe Drop
        </h1>
        <p className="text-xs text-[#8E8E9E] max-w-sm mx-auto">
          Enter your order reference code (e.g. <strong>DS-89241</strong>) to view live logistics milestones.
        </p>
      </div>

      {/* Lookup Search Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Enter Order ID (e.g. DS-92814)"
              value={orderQuery}
              onChange={e => setOrderQuery(e.target.value.toUpperCase())}
              className="w-full bg-[#15151A] border border-[#2D2D38] text-sm text-white px-4 py-3.5 pl-10 rounded-2xl focus:outline-none focus:border-[#D4AF37] uppercase placeholder:normal-case placeholder:text-[#646472]"
            />
            <Search className="w-4 h-4 text-[#8A8A96] absolute left-3.5 top-4 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-widest px-7 py-3.5 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                <span>Checking...</span>
              </>
            ) : order ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                <span>Refresh</span>
              </>
            ) : (
              <span>Track</span>
            )}
          </button>
        </form>

        {justRefreshed && !errorMsg && (
          <div className="mt-3 py-2.5 px-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold text-[#10B981] animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Live status verified with logistics server: Up to date!</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-4 bg-[#3A1818] border border-[#5E2222] text-[#FCA5A5] text-xs rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Results View */}
      {order && (
        <div className="bg-[#141418] border border-[#24242E] rounded-3xl p-6 sm:p-10 space-y-10 shadow-2xl animate-in fade-in">
          {/* Metadata Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#202028] gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
                Order Tracking
              </span>
              <h2 className="font-editorial text-2xl font-bold text-white mt-0.5">
                {order.display_id}
              </h2>
              <p className="text-xs text-[#8A8A96]">
                Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Status: {order.fulfillment_status.replace(/_/g, ' ')}
              </span>
              <p className="text-[11px] text-[#A0A0B0] mt-1">
                AWB Tracking: <strong>{order.tracking_number}</strong> ({order.courier_name})
              </p>
            </div>
          </div>

          {/* Interactive 5-Stage Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A0A0B0]">
              Shipment Milestones
            </h3>

            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#262632] -translate-y-1/2 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                {STAGES.map((stg, idx) => {
                  const isCompleted = idx <= currentStage;
                  const isCurrent = idx === currentStage;

                  return (
                    <div
                      key={stg.title}
                      className={`flex md:flex-col items-center md:text-center space-x-3 md:space-x-0 space-y-0 md:space-y-2 p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-[#1C1C24] border-[#D4AF37] shadow-lg'
                          : isCompleted
                          ? 'bg-[#16161C] border-[#2A2A38]'
                          : 'bg-[#121216] border-[#1C1C24] opacity-50'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-[#D4AF37] text-black shadow-md'
                            : 'bg-[#22222B] text-[#70707C]'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white">{stg.title}</h4>
                        <p className="text-[10px] text-[#848492]">{stg.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Event Log */}
          <div className="space-y-3 pt-6 border-t border-[#202028]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A0A0B0]">
              Logistics Activity Log
            </h3>

            <div className="space-y-3">
              {order.tracking_history.map((evt, i) => (
                <div
                  key={i}
                  className="bg-[#17171E] border border-[#262632] p-4 rounded-xl flex items-start space-x-3 text-xs"
                >
                  <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{evt.status}</span>
                      <span className="text-[10px] text-[#787886]">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[#A4A4B4]">{evt.description}</p>
                    <span className="text-[10px] text-[#D4AF37] block">
                      Location: {evt.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Garment Summary in this Parcel */}
          <div className="space-y-3 pt-6 border-t border-[#202028]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A0A0B0]">
              Items In This Parcel
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {order.items.map(item => (
                <div
                  key={item.id}
                  className="bg-[#17171E] border border-[#24242E] p-3 rounded-xl flex space-x-3 text-xs"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-14 h-18 object-cover rounded-lg border border-[#2B2B36]"
                  />
                  <div>
                    <h5 className="font-bold text-white">{item.title}</h5>
                    <p className="text-[11px] text-[#8A8A98]">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                    <p className="text-xs font-bold text-[#D4AF37] mt-1">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-white">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
