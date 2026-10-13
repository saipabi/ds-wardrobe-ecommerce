'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  SlidersHorizontal,
  X,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { api } from '../../lib/api';
import { Product, Category } from '../../types/commerce';
import { ProductCard } from '../../components/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state
  const initialCat = searchParams.get('category') || 'all';
  const initialCollection = searchParams.get('collection') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'featured';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [searchVal, setSearchVal] = useState<string>(initialQuery);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const COLORS = [
    { name: 'Champagne Gold', hex: '#D4AF37' },
    { name: 'Obsidian Black', hex: '#111111' },
    { name: 'Deep Wine', hex: '#5B1425' },
    { name: 'Sandstone Beige', hex: '#D9C5B2' },
    { name: 'Terracotta Rust', hex: '#B85D43' },
    { name: 'Emerald Green', hex: '#0F4336' },
    { name: 'Blush Rose', hex: '#DDA7A5' }
  ];

  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            collection: initialCollection === 'all' ? undefined : initialCollection,
            q: searchVal,
            size: selectedSize || undefined,
            color: selectedColor || undefined,
            max_price: maxPrice,
            in_stock: inStockOnly || undefined,
            sort: sortBy as any
          })
        ]);
        setCategories(catRes.categories);
        setProducts(prodRes.products);
        setTotalCount(prodRes.total);
      } catch (err) {
        console.error('Failed to load shop catalog:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, [selectedCategory, initialCollection, searchVal, selectedSize, selectedColor, maxPrice, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('');
    setSelectedColor('');
    setMaxPrice(10000);
    setInStockOnly(false);
    setSearchVal('');
    setSortBy('featured');
    router.push('/shop');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== '' ||
    selectedColor !== '' ||
    maxPrice < 10000 ||
    inStockOnly ||
    searchVal !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Catalog Title Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#22222A] mb-8 space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#D4AF37] uppercase tracking-widest font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready-to-Wear Catalog</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-white tracking-tight">
            {selectedCategory !== 'all' ? selectedCategory : 'All Capsule Drops'}
          </h1>
          <p className="text-xs text-[#90909E] mt-1">
            Displaying {products.length} of {totalCount} authentic handcrafted garments.
          </p>
        </div>

        {/* Controls: Search, Sort & Mobile Filter Toggle */}
        <div className="flex items-center space-x-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 bg-[#1B1B22] border border-[#2D2D38] px-4 py-2.5 rounded-full text-xs font-semibold text-white hover:border-[#D4AF37] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none bg-[#16161B] text-xs text-white border border-[#2B2B36] rounded-full px-4 py-2.5 pr-8 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#888896] absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sticky Filter Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-7 pr-4 sticky top-28 self-start max-h-[80vh] overflow-y-auto">
          {/* Active Filter Chips & Reset */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pb-4 border-b border-[#24242E]">
              <span className="text-xs font-semibold text-[#F3E5AB]">Filtered</span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#E06D53] hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all</span>
              </button>
            </div>
          )}

          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold'
                    : 'text-[#9A9AA6] hover:text-white'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'all' && <Check className="w-3 h-3" />}
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === cat.name
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold'
                      : 'text-[#9A9AA6] hover:text-white'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-[#6A6A76]">({cat.item_count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3 pt-4 border-t border-[#22222A]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Size</h3>
              {selectedSize && (
                <button
                  onClick={() => setSelectedSize('')}
                  className="text-[10px] text-[#A0A0B0] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                  className={`text-xs font-bold py-2 rounded-lg border text-center transition-all ${
                    selectedSize === s
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-[#18181E] border-[#2B2B36] text-[#C4C4D0] hover:border-white/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3 pt-4 border-t border-[#22222A]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Color Palette</h3>
              {selectedColor && (
                <button
                  onClick={() => setSelectedColor('')}
                  className="text-[10px] text-[#A0A0B0] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedColor === c.name
                      ? 'bg-[#22222A] text-white font-medium border border-[#D4AF37]/50'
                      : 'text-[#A0A0AC] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </div>
                  {selectedColor === c.name && <Check className="w-3 h-3 text-[#D4AF37]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-[#22222A]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Max Price</h3>
              <span className="text-xs font-bold text-[#D4AF37]">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1500"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#70707C]">
              <span>₹1,500</span>
              <span>₹10,000+</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-4 border-t border-[#22222A]">
            <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-[#D0D0DC]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-[#33333F] text-[#D4AF37] focus:ring-0 accent-[#D4AF37]"
              />
              <span>In-Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-96 rounded-2xl shimmer-box border border-[#22222A]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-[#141418] border border-[#252530] rounded-3xl p-12 text-center space-y-4 my-8">
              <div className="w-16 h-16 rounded-full bg-[#1F1F28] flex items-center justify-center mx-auto text-[#646472]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-white">No drops match your criteria</h3>
              <p className="text-xs text-[#8A8A96] max-w-sm mx-auto leading-relaxed">
                Try widening your price range, choosing another size, or resetting your active filters to see all available styles.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#D4AF37] hover:bg-[#E5C058] text-black text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#131317] border-r border-[#262632] h-full flex flex-col p-6 z-10 shadow-2xl overflow-y-auto text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#24242E]">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-editorial text-lg font-bold">Filter Drops</h3>
              </div>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#8A8A96]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-6 flex-1">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A0A0B0] mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left py-1.5 px-2 rounded ${
                      selectedCategory === 'all' ? 'text-[#D4AF37] font-bold' : 'text-[#8E8E9E]'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`w-full text-left py-1.5 px-2 rounded ${
                        selectedCategory === c.name ? 'text-[#D4AF37] font-bold' : 'text-[#8E8E9E]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A0A0B0] mb-2">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                      className={`text-xs font-bold py-1.5 rounded border text-center ${
                        selectedSize === s
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#18181F] border-[#2C2C36] text-[#A6A6B4]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-[#A0A0B0] uppercase tracking-wider">Max Price</span>
                  <span className="text-[#D4AF37]">₹{maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#D4AF37]"
                />
              </div>

              {/* In stock */}
              <div>
                <label className="flex items-center space-x-2 text-xs text-[#D0D0DC]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="accent-[#D4AF37]"
                  />
                  <span>In-Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#24242E] flex space-x-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 bg-[#202028] text-xs font-bold uppercase rounded-full text-white"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-full"
              >
                Apply ({products.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-white">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
