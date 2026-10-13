'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, ShoppingBag, Sparkles, ExternalLink } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { Product } from '../types/commerce';

interface InstagramFeedSectionProps {
  products: Product[];
}

export const InstagramFeedSection: React.FC<InstagramFeedSectionProps> = ({ products }) => {
  const [activeLook, setActiveLook] = useState<Product | null>(null);

  // Take first 6 products for the Instagram curated drop grid
  const lookbookItems = products.slice(0, 6);

  return (
    <section className="py-16 bg-[#0E0E11] border-t border-[#1C1C22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">
              <InstagramIcon className="w-4 h-4" />
              <span>Social Lookbook • #StyledInDS</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Shop The Feed <span className="text-gold-gradient">@ds__wardrobe__</span>
            </h2>
          </div>

          <a
            href="https://www.instagram.com/ds__wardrobe__/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#D4AF37] hover:text-[#F3E5AB] border border-[#D4AF37]/40 px-4 py-2 rounded-full hover:bg-[#D4AF37]/10 transition-all self-start md:self-auto"
          >
            <span>Follow on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 6-Grid Editorial Image Collage */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {lookbookItems.map((prod, idx) => (
            <div
              key={prod.id}
              className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-[#18181E] cursor-pointer shadow-md"
              onClick={() => setActiveLook(prod)}
            >
              <img
                src={prod.images[1] || prod.thumbnail}
                alt={prod.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Hover Dark Overlay with Shop Badge */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <span className="p-1.5 rounded-full bg-black/50 text-[#D4AF37] backdrop-blur-sm">
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-white truncate">{prod.title}</p>
                  <p className="text-[10px] text-[#D4AF37] font-bold">
                    ₹{prod.variants[0]?.sale_price || prod.variants[0]?.price}
                  </p>
                  <div className="inline-flex items-center space-x-1 bg-[#D4AF37] text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                    <ShoppingBag className="w-2.5 h-2.5" />
                    <span>Tap to Shop</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Lookbook Modal when tapped */}
      {activeLook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#16161A] border border-[#2B2B36] rounded-2xl p-6 text-white shadow-2xl flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5">
            <button
              onClick={() => setActiveLook(null)}
              className="absolute top-3 right-3 text-[#8A8A96] hover:text-white p-1"
            >
              ✕
            </button>

            <img
              src={activeLook.thumbnail}
              alt={activeLook.title}
              className="w-full sm:w-40 aspect-[4/5] object-cover rounded-xl border border-[#2A2A35]"
            />

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
                  Featured In Story Drop
                </span>
                <h3 className="font-editorial text-lg font-bold text-white mt-1">
                  {activeLook.title}
                </h3>
                <p className="text-xs text-[#9E9EAA] line-clamp-2 mt-1">
                  {activeLook.subtitle}
                </p>
                <div className="text-sm font-bold text-[#D4AF37] mt-2">
                  ₹{activeLook.variants[0]?.sale_price || activeLook.variants[0]?.price}
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-2">
                <Link
                  href={`/product/${activeLook.handle}`}
                  onClick={() => setActiveLook(null)}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-full text-center transition-all shadow"
                >
                  View Product Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
