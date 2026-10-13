'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Heart,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  Flame
} from 'lucide-react';
import { api } from '../lib/api';
import { Product, Category, Collection } from '../types/commerce';
import { ProductCard } from '../components/ProductCard';
import { InstagramFeedSection } from '../components/InstagramFeedSection';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [prodRes, catRes, colRes] = await Promise.all([
          api.getProducts({ limit: 8, sort: 'featured' }),
          api.getCategories(),
          api.getCollections()
        ]);
        setProducts(prodRes.products);
        setCategories(catRes.categories);
        setCollections(colRes.collections);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const storyHighlights = [
    { name: 'New In', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80', link: '/shop?sort=newest' },
    { name: 'Satin Edit', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80', link: '/shop?category=Dresses' },
    { name: 'Co-ords', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80', link: '/shop?category=Co-ord+Sets' },
    { name: 'Royal Velvet', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80', link: '/shop?category=Festive+%26+Fusion' },
    { name: 'Trending', image: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=300&q=80', link: '/shop?sort=featured' },
    { name: 'VIP Drop', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80', link: '/shop' }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Instagram Story Drop Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center space-x-5 overflow-x-auto no-scrollbar py-2">
          {storyHighlights.map((story, i) => (
            <Link
              key={i}
              href={story.link}
              className="group flex flex-col items-center flex-shrink-0 space-y-1.5 focus:outline-none"
            >
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F5E6CA] to-[#AA771C] group-hover:scale-105 transition-transform duration-300">
                <div className="p-0.5 bg-[#0D0D0E] rounded-full">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-full"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#C8C8D4] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                {story.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Hero Editorial Stage */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden min-h-[580px] lg:min-h-[660px] flex items-center bg-[#141418] border border-[#24242D] shadow-2xl">
          {/* Background Image with Gradient Mask */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
              alt="DS Wardrobe Haute Edit"
              className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent sm:to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0E] via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-16 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#1A1A22]/80 backdrop-blur-md border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#F3E5AB]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="uppercase tracking-widest text-[10px]">Capsule Drop • Festive & Haute Ready</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08]">
              Where Fashion Meets <span className="text-gold-gradient italic font-serif">Purpose.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#D4D4DE] leading-relaxed max-w-xl font-light">
              Your style is your personal brand ⚡⚡. Experience bespoke tailoring, liquid satins, sculpting co-ords, and opulent velvet silhouettes designed to command every room.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                href="/shop"
                className="bg-gradient-to-r from-[#D4AF37] to-[#E5C058] hover:from-[#C49F27] hover:to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-full flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-[#D4AF37]/30 hover:scale-105"
              >
                <span>Explore Drops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop?category=Festive+%26+Fusion"
                className="bg-[#181820]/80 hover:bg-[#252530] text-white border border-[#3A3A46] hover:border-[#D4AF37] font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-full flex items-center justify-center space-x-2 transition-all backdrop-blur-md"
              >
                <span>Royal Festive</span>
                <Flame className="w-4 h-4 text-[#D4AF37]" />
              </Link>
            </div>

            {/* Quick Micro Metrics */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-editorial">100%</div>
                <div className="text-[10px] sm:text-xs text-[#9E9EAA]">Artisanal Precision</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#D4AF37] font-editorial">PAN-INDIA</div>
                <div className="text-[10px] sm:text-xs text-[#9E9EAA]">Express Shipping</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-editorial">4.9 ★</div>
                <div className="text-[10px] sm:text-xs text-[#9E9EAA]">Verified Client Love</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Capsule Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 space-y-2 sm:space-y-0">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
              Curated Edits
            </span>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-white">
              Signature Collections
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#D4AF37] hover:text-[#F3E5AB] flex items-center space-x-1"
          >
            <span>View All Collections</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map(col => (
            <Link
              key={col.id}
              href={`/shop?collection=${encodeURIComponent(col.title)}`}
              className="group relative h-96 rounded-2xl overflow-hidden bg-[#16161C] border border-[#262630] hover:border-[#D4AF37]/60 transition-all duration-300 shadow-xl"
            >
              <img
                src={col.banner_image}
                alt={col.title}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end space-y-2">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
                  {col.subtitle}
                </span>
                <h3 className="font-editorial text-xl font-bold text-white group-hover:text-gold-gradient transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-[#C4C4D0] line-clamp-2 font-light">
                  {col.description}
                </p>
                <div className="pt-2 flex items-center space-x-1.5 text-xs font-bold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                  <span>Shop Edit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Drops Product Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 space-y-2 sm:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1">
              <Zap className="w-3.5 h-3.5 fill-[#D4AF37]" />
              <span>Instant Favorites</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-white">
              Trending Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#D4AF37] hover:text-[#F3E5AB] flex items-center space-x-1"
          >
            <span>See Full Catalog ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-96 rounded-2xl shimmer-box border border-[#22222A]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Brand Manifesto Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A1A22] via-[#121216] to-[#0D0D10] border border-[#2F2F3D] p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The DS Wardrobe Philosophy</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight">
            “Fashion is not about blending in — it is your most powerful form of self-expression.”
          </h2>

          <p className="text-xs sm:text-sm text-[#A8A8B8] max-w-xl mx-auto leading-relaxed">
            Every garment at DS Wardrobe is thoughtfully cut, rigorously fitted, and created with high-density premium materials. No flimsy fast fashion — only pieces worthy of your personal brand.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/shop"
              className="bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-lg hover:scale-105"
            >
              Discover The Collection
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Shop by Category Visual Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
            Curated Categories
          </span>
          <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-white">
            Explore By Silhouette
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center text-center bg-[#151519] border border-[#24242E] hover:border-[#D4AF37] rounded-2xl p-4 transition-all hover:shadow-xl"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border border-[#33333F] group-hover:scale-105 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h4 className="font-editorial text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                {cat.name}
              </h4>
              <span className="text-[10px] text-[#787886] mt-0.5">
                {cat.item_count} Designs
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Client Reviews / Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="flex items-center justify-center space-x-1 text-[#D4AF37]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
            ))}
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-white">
            Loved By Our Patrons
          </h2>
          <p className="text-xs text-[#8A8A98]">
            Real feedback from verified orders across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141418] border border-[#24242E] p-6 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center space-x-1 text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
              ))}
            </div>
            <p className="text-xs text-[#D0D0DC] italic leading-relaxed">
              "The Aurelia Champagne Satin dress is pure magic. I wore it for my best friend's reception in Delhi and everyone asked which luxury designer made it. The fabric weight is exceptional."
            </p>
            <div className="pt-2 border-t border-[#202028] flex items-center justify-between text-xs">
              <div>
                <h5 className="font-bold text-white">Pooja Sharma</h5>
                <span className="text-[10px] text-[#7A7A88]">Verified Buyer • New Delhi</span>
              </div>
              <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded-full font-semibold">
                Verified Purchase
              </span>
            </div>
          </div>

          <div className="bg-[#141418] border border-[#24242E] p-6 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center space-x-1 text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
              ))}
            </div>
            <p className="text-xs text-[#D0D0DC] italic leading-relaxed">
              "The Kyra tailored linen co-ord set fits like a glove. Usually trousers online are either too tight or too loose, but the double pleats and waistband tailoring are completely spot-on."
            </p>
            <div className="pt-2 border-t border-[#202028] flex items-center justify-between text-xs">
              <div>
                <h5 className="font-bold text-white">Rhea Sen</h5>
                <span className="text-[10px] text-[#7A7A88]">Verified Buyer • Bangalore</span>
              </div>
              <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded-full font-semibold">
                Verified Purchase
              </span>
            </div>
          </div>

          <div className="bg-[#141418] border border-[#24242E] p-6 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center space-x-1 text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
              ))}
            </div>
            <p className="text-xs text-[#D0D0DC] italic leading-relaxed">
              "Ordered the Noor Velvet Kurta set for Diwali celebrations. Delivery was so quick and the packaging in the custom gold-embossed box made it feel like a real couture unboxing experience."
            </p>
            <div className="pt-2 border-t border-[#202028] flex items-center justify-between text-xs">
              <div>
                <h5 className="font-bold text-white">Kiranpreet Kaur</h5>
                <span className="text-[10px] text-[#7A7A88]">Verified Buyer • Chandigarh</span>
              </div>
              <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded-full font-semibold">
                Verified Purchase
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Instagram Lookbook Feed Section */}
      <InstagramFeedSection products={products} />
    </div>
  );
}
