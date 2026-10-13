'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activePillar, setActivePillar] = useState<any | null>(null);

  const PILLARS = [
    {
      id: 'shipping',
      title: 'Pan-India Express',
      tagline: 'Complimentary express shipping on orders over ₹1,999',
      icon: Truck,
      details: 'We partner with India’s leading premium logistics carriers (Bluedart, Delhivery Express) to deliver your couture orders within 2 to 4 business days across all major Indian cities. Every parcel is insured and tracked with real-time milestone updates.',
      actionLabel: 'Track a Drop',
      actionHref: '/track-order'
    },
    {
      id: 'craftsmanship',
      title: 'Couture Craftsmanship',
      tagline: 'Hand-picked textiles & tailored cuts made to sculpt',
      icon: Sparkles,
      details: 'Every DS Wardrobe garment is sculpted with meticulously chosen liquid satins, premium silks, structured crepes, and regal velvets. Designed with bespoke Indian sizing (XS to XXL) for a flattering, runway-grade silhouette.',
      actionLabel: 'Explore Drops',
      actionHref: '/shop'
    },
    {
      id: 'exchanges',
      title: 'Hassle-Free Exchanges',
      tagline: '7-day sizing exchange across all ready-to-wear drops',
      icon: RotateCcw,
      details: 'Need a different size? We offer a straightforward 7-day exchange window for all unworn garments with original tags intact. Doorstep reverse pickup is arranged hassle-free.',
      actionLabel: 'View Size Guide',
      actionHref: '/shop'
    },
    {
      id: 'boutique',
      title: 'Verified Indian Boutique',
      tagline: 'Secure UPI, Cards, NetBanking, and COD options',
      icon: ShieldCheck,
      details: 'DS Wardrobe is a verified contemporary fashion boutique rooted in India. Enjoy bank-grade 256-bit encrypted checkout with Instant UPI (Google Pay, PhonePe, Paytm), RuPay/Visa/MasterCard, NetBanking, and Cash on Delivery.',
      actionLabel: 'Shop Best Sellers',
      actionHref: '/shop'
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0A0A0C] border-t border-[#1E1E24] text-[#A6A6B4] text-xs pt-16 pb-24 md:pb-12">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#1E1E24]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map(p => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePillar(p)}
                className="flex items-start space-x-3.5 text-left p-3.5 rounded-2xl bg-[#101014] border border-[#20202A] hover:border-[#D4AF37]/50 hover:bg-[#16161D] transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-[#141418] border border-[#272732] text-[#D4AF37] group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm group-hover:text-[#D4AF37] transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-[#7C7C8A] mt-0.5">{p.tagline}</p>
                  <span className="text-[10px] text-[#D4AF37] font-semibold mt-1 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view details →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Pillar Info Modal */}
      {activePillar && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#141418] border border-[#2D2D38] max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setActivePillar(null)}
              className="absolute right-5 top-5 p-2 rounded-full bg-[#1C1C24] text-[#8E8E9E] hover:text-white hover:bg-[#282834] transition-all"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
              <activePillar.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold text-white">
                {activePillar.title}
              </h3>
              <p className="text-xs text-[#D4AF37] mt-1 font-medium">
                {activePillar.tagline}
              </p>
            </div>
            <p className="text-xs text-[#9E9EAE] leading-relaxed">
              {activePillar.details}
            </p>
            <div className="pt-2 flex space-x-3">
              <Link
                href={activePillar.actionHref}
                onClick={() => setActivePillar(null)}
                className="flex-1 bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-widest py-3 text-center rounded-xl transition-all shadow-md"
              >
                {activePillar.actionLabel}
              </Link>
              <button
                type="button"
                onClick={() => setActivePillar(null)}
                className="px-5 py-3 bg-[#1B1B22] border border-[#2C2C38] text-white text-xs font-semibold rounded-xl hover:bg-[#242430] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-brand text-2xl font-extrabold text-gold-gradient tracking-widest">
                DS WARDROBE
              </span>
            </Link>
            <p className="text-xs text-[#8E8E9E] leading-relaxed max-w-sm">
              <em>"Your style is Ur personal brand ⚡⚡ where fashion meets purpose"</em>
              <br className="my-2" />
              Elevated ready-to-wear drops bridging contemporary western tailoring and heirloom festive luxury.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs">
              <a
                href="https://www.instagram.com/ds__wardrobe__/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-[#18181E] hover:bg-[#252530] border border-[#2B2B36] hover:border-[#D4AF37] px-3.5 py-2 rounded-full text-white transition-all group"
              >
                <InstagramIcon className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="font-medium text-[11px]">@ds__wardrobe__</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-white text-xs">Collections</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?category=Dresses" className="hover:text-[#D4AF37] transition-colors">
                  Dresses & Gowns
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Co-ord+Sets" className="hover:text-[#D4AF37] transition-colors">
                  Co-ord Sets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Festive+%26+Fusion" className="hover:text-[#D4AF37] transition-colors">
                  Royal Festive & Velvet
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Tops+%26+Shirts" className="hover:text-[#D4AF37] transition-colors">
                  Organza & Statement Tops
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">
                  View All Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-white text-xs">Customer Studio</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-[#D4AF37] transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#D4AF37] transition-colors">
                  My Orders & Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#D4AF37] transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#D4AF37] hover:underline font-medium">
                  Admin Control Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-white text-xs">VIP Drop Access</h5>
            <p className="text-[11px] text-[#7C7C8A]">
              Be the first to access limited festive drops and exclusive private sales.
            </p>

            {subscribed ? (
              <div className="flex items-center space-x-1.5 text-[#10B981] text-xs font-semibold py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You're on the VIP list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#16161C] border border-[#2B2B36] text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#D4AF37] placeholder:text-[#646472]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bg-[#D4AF37] hover:bg-[#E5C058] text-black p-1.5 rounded-md transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 text-[11px] text-[#7E7E8E] space-y-1">
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3 text-[#D4AF37]" />
                <span>+91 70329 32549</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-[#D4AF37]" />
                <span>Singarayakonda, AP, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1C1C24] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#6E6E7C] space-y-4 md:space-y-0">
        <p>
          © 2026 <strong>DS Wardrobe</strong>. All rights reserved. E-Commerce Intern Project.
        </p>

        {/* Payment badges */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-[#18181F] px-2 py-1 rounded border border-[#262632] text-white/70">
            UPI / GPay
          </span>
          <span className="bg-[#18181F] px-2 py-1 rounded border border-[#262632] text-white/70">
            Cards
          </span>
          <span className="bg-[#18181F] px-2 py-1 rounded border border-[#262632] text-white/70">
            NetBanking
          </span>
          <span className="bg-[#18181F] px-2 py-1 rounded border border-[#262632] text-white/70">
            Cash On Delivery
          </span>
        </div>
      </div>
    </footer>
  );
};
