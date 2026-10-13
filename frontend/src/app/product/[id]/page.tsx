'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingBag,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Minus,
  Plus,
  Share2,
  Sparkles,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { api } from '../../../lib/api';
import { Product, ProductVariant, ProductReview } from '../../../types/commerce';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { ProductCard } from '../../../components/ProductCard';
import { SizeGuideModal } from '../../../components/SizeGuideModal';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useAuth();

  const handleOrId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected State
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await api.getProduct(handleOrId);
        const prod = res.product;
        setProduct(prod);

        setSelectedImage(prod.images[0] || prod.thumbnail);

        // Pick first in-stock variant by default
        const inStockVar = prod.variants.find(v => v.in_stock && v.inventory_quantity > 0);
        setSelectedVariant(inStockVar || prod.variants[0] || null);

        // Load reviews and related products
        const [revRes, relRes] = await Promise.all([
          api.getReviews(prod.id),
          api.getProducts({ category: prod.category, limit: 4 })
        ]);
        setReviews(revRes.reviews);
        setRelatedProducts(relRes.products.filter(p => p.id !== prod.id));
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }

    if (handleOrId) {
      loadProduct();
    }
  }, [handleOrId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[4/5] rounded-3xl shimmer-box border border-[#24242E]" />
          <div className="space-y-6">
            <div className="h-8 w-3/4 rounded-xl shimmer-box" />
            <div className="h-6 w-1/4 rounded-xl shimmer-box" />
            <div className="h-24 rounded-xl shimmer-box" />
            <div className="h-12 w-full rounded-full shimmer-box" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-editorial text-3xl font-bold text-white">Piece Not Found</h2>
        <p className="text-xs text-[#8A8A96]">This drop may have been archived or moved.</p>
        <Link
          href="/shop"
          className="inline-block bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const currentPrice = selectedVariant?.sale_price ?? selectedVariant?.price ?? 0;
  const regularPrice = selectedVariant?.price ?? 0;
  const hasDiscount = currentPrice < regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100)
    : 0;

  const isVariantInStock = (selectedVariant?.inventory_quantity || 0) > 0 && selectedVariant?.in_stock;

  // Extract unique colors and unique sizes
  const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size)));
  const uniqueColors = Array.from(new Set(product.variants.map(v => v.color)));

  const handleSizeSelect = (size: string) => {
    // Find variant with matching size and currently selected color, or fallback to first of that size
    const matching = product.variants.find(
      v => v.size === size && (selectedVariant ? v.color === selectedVariant.color : true)
    ) || product.variants.find(v => v.size === size);

    if (matching) {
      setSelectedVariant(matching);
    }
  };

  const handleColorSelect = (color: string) => {
    const matching = product.variants.find(
      v => v.color === color && (selectedVariant ? v.size === selectedVariant.size : true)
    ) || product.variants.find(v => v.color === color);

    if (matching) {
      setSelectedVariant(matching);
      if (matching.image) {
        setSelectedImage(matching.image);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAddingToCart(true);
    await addToCart(product.id, selectedVariant.id, quantity);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    await addToCart(product.id, selectedVariant.id, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    try {
      setSubmittingReview(true);
      const res = await api.submitReview(product.id, {
        author_name: reviewAuthor,
        rating: reviewRating,
        headline: reviewHeadline,
        comment: reviewComment
      });

      setReviews(prev => [res.review, ...prev]);
      setShowReviewForm(false);
      setReviewAuthor('');
      setReviewComment('');
      setReviewHeadline('');
      alert('Thank you! Your verified review has been published.');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 sm:space-y-24">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#8A8A96]">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-white transition-colors">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-white transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery Section */}
        <div className="space-y-4">
          {/* Main Visual Frame */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#16161C] border border-[#24242D] shadow-2xl">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {hasDiscount && (
                <span className="bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  {discountPercent}% OFF
                </span>
              )}
              {product.is_best_seller && (
                <span className="bg-black/70 backdrop-blur-md text-[#F3E5AB] border border-[#D4AF37]/40 text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full">
                  ⚡ High Demand Drop
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                isSaved
                  ? 'bg-[#D4AF37] text-black shadow-lg'
                  : 'bg-black/50 text-white hover:bg-black/80 hover:text-[#D4AF37]'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-black' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#D4AF37] scale-102 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Configurator & Purchasing */}
        <div className="space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#D4AF37] uppercase tracking-widest font-bold">
              <span>{product.collection}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#A8A8B6] font-light mt-2 leading-relaxed">
              {product.subtitle}
            </p>

            {/* Rating Stars */}
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex items-center space-x-1 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-[#D4AF37]' : 'text-[#444450]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-white">{product.rating}</span>
              <span className="text-xs text-[#787886]">({reviews.length} Client Reviews)</span>
            </div>
          </div>

          {/* Dynamic Pricing */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-[#24242E] flex items-baseline space-x-3">
            <span className="font-editorial text-3xl sm:text-4xl font-bold text-gold-gradient">
              ₹{currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[#787886] line-through">
                ₹{regularPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] text-[#A0A0B0] ml-auto">
              Inclusive of all taxes • Pan-India Free Delivery Eligible
            </span>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-white">Color</span>
              <span className="text-[#D4AF37] font-semibold">{selectedVariant?.color}</span>
            </div>
            <div className="flex items-center space-x-3">
              {uniqueColors.map(colorName => {
                const variantForColor = product.variants.find(v => v.color === colorName);
                const isSelected = selectedVariant?.color === colorName;

                return (
                  <button
                    key={colorName}
                    type="button"
                    onClick={() => handleColorSelect(colorName)}
                    className={`relative p-1 rounded-full border-2 transition-all ${
                      isSelected ? 'border-[#D4AF37] scale-110' : 'border-transparent hover:border-white/30'
                    }`}
                    title={colorName}
                  >
                    <span
                      className="w-7 h-7 rounded-full block border border-black/30 shadow-inner"
                      style={{ backgroundColor: variantForColor?.colorHex || '#111111' }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector with Size Guide Trigger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-white">Select Size</span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs font-semibold text-[#D4AF37] hover:text-[#F3E5AB] flex items-center space-x-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {uniqueSizes.map(sz => {
                const varObj = product.variants.find(
                  v => v.size === sz && (selectedVariant ? v.color === selectedVariant.color : true)
                );
                const inStock = varObj && varObj.in_stock && varObj.inventory_quantity > 0;
                const isSelected = selectedVariant?.size === sz;

                return (
                  <button
                    key={sz}
                    type="button"
                    disabled={!inStock}
                    onClick={() => handleSizeSelect(sz)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg'
                        : inStock
                        ? 'bg-[#18181E] border-[#2A2A35] text-white hover:border-white/40'
                        : 'bg-[#141418] border-[#202026] text-white/20 line-through cursor-not-allowed'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Inventory Stock Feedback */}
          <div className="text-xs">
            {isVariantInStock ? (
              selectedVariant && selectedVariant.inventory_quantity <= 4 ? (
                <span className="text-[#F59E0B] font-semibold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                  <span>Only {selectedVariant.inventory_quantity} pieces left in this size/color!</span>
                </span>
              ) : (
                <span className="text-[#10B981] font-semibold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Ready to Dispatch from Singarayakonda Studio</span>
                </span>
              )
            ) : (
              <span className="text-[#EF4444] font-semibold">
                This variant is currently out of stock.
              </span>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              {/* Quantity */}
              <div className="flex items-center space-x-3 bg-[#18181F] border border-[#2B2B36] rounded-full px-3 py-2">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-1 text-[#8A8A96] hover:text-white disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-white min-w-4 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={!selectedVariant || quantity >= selectedVariant.inventory_quantity}
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1 text-[#8A8A96] hover:text-white disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                disabled={!isVariantInStock || addingToCart}
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#E5C058] hover:from-[#C49F27] hover:to-[#D4AF37] disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-full flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-[#D4AF37]/20 group"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>{addingToCart ? 'Adding to Bag...' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              type="button"
              disabled={!isVariantInStock}
              onClick={handleBuyNow}
              className="w-full bg-[#181820] hover:bg-[#252530] text-white border border-[#3E3E4C] hover:border-[#D4AF37] font-bold text-xs uppercase tracking-widest py-3.5 rounded-full transition-all"
            >
              Buy Now with 1-Click
            </button>
          </div>

          {/* Model Fit Info */}
          {product.model_info && (
            <div className="text-xs text-[#9E9EAA] bg-[#16161A] p-3 rounded-xl border border-[#252530]">
              <strong>Fit Insight:</strong> {product.model_info}
            </div>
          )}

          {/* Product Specifications & Care Tabs */}
          <div className="pt-4 border-t border-[#22222A]">
            <div className="flex border-b border-[#24242E] space-x-6 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'details' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#848492]'
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'care' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#848492]'
                }`}
              >
                Fabric & Care
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'shipping' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#848492]'
                }`}
              >
                Pan-India Shipping
              </button>
            </div>

            <div className="py-4 text-xs text-[#B0B0C0] leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-2">
                  <p>{product.description}</p>
                  <p><strong>SKU:</strong> {selectedVariant?.sku}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {product.tags.map(t => (
                      <span key={t} className="bg-[#1C1C22] px-2.5 py-0.5 rounded-full border border-[#2B2B36] text-[10px] text-[#A0A0B0]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-2">
                  <p><strong>Material:</strong> {product.material}</p>
                  <p><strong>Care:</strong> {product.care_instructions}</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>• Complimentary Pan-India shipping on all orders over ₹1,999.</p>
                  <p>• Dispatched within 24-48 business hours via trusted courier partners (Bluedart, Delhivery, Shiprocket).</p>
                  <p>• Full live tracking status provided immediately upon shipment.</p>
                  <p>• 7-day size exchange guarantee.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-12 border-t border-[#22222A] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
              Client Feedback & Reviews
            </h3>
            <p className="text-xs text-[#8A8A96] mt-0.5">
              Average {product.rating} ★ based on verified purchases.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(prev => !prev)}
            className="self-start sm:self-auto bg-[#181820] hover:bg-[#252530] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Review Submission Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-[#15151A] border border-[#2A2A36] p-6 rounded-2xl max-w-xl space-y-4 animate-in fade-in"
          >
            <h4 className="font-editorial text-lg font-bold text-white">Share Your Experience</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A0A0B0] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanya M."
                  value={reviewAuthor}
                  onChange={e => setReviewAuthor(e.target.value)}
                  className="w-full bg-[#1B1B22] border border-[#2D2D38] text-xs text-white px-3.5 py-2 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A0A0B0] mb-1">
                  Rating *
                </label>
                <select
                  value={reviewRating}
                  onChange={e => setReviewRating(Number(e.target.value))}
                  className="w-full bg-[#1B1B22] border border-[#2D2D38] text-xs text-white px-3.5 py-2 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value={5}>5 Stars - Flawless</option>
                  <option value={4}>4 Stars - Great</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Dissatisfied</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A0A0B0] mb-1">
                Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Exceptional fabric quality!"
                value={reviewHeadline}
                onChange={e => setReviewHeadline(e.target.value)}
                className="w-full bg-[#1B1B22] border border-[#2D2D38] text-xs text-white px-3.5 py-2 rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A0A0B0] mb-1">
                Detailed Feedback *
              </label>
              <textarea
                required
                rows={3}
                placeholder="How did it fit? Fabric feel? Delivery experience?"
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full bg-[#1B1B22] border border-[#2D2D38] text-xs text-white p-3 rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full transition-all"
            >
              {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-[#8A8A96]">No reviews yet. Be the first to review this drop!</p>
          ) : (
            reviews.map(rev => (
              <div
                key={rev.id}
                className="bg-[#141418] border border-[#23232C] p-5 rounded-2xl space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#D4AF37]' : 'text-[#3E3E48]'}`}
                      />
                    ))}
                  </div>
                  {rev.verified_buyer && (
                    <span className="text-[10px] text-[#10B981] font-semibold bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                      Verified Buyer
                    </span>
                  )}
                </div>

                <h5 className="font-bold text-white text-xs">{rev.headline}</h5>
                <p className="text-xs text-[#B8B8C6] leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="pt-2 text-[10px] text-[#70707E] flex justify-between">
                  <span>{rev.author_name}</span>
                  <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#22222A] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
              Complete Your Wardrobe
            </h3>
            <Link href="/shop" className="text-xs text-[#D4AF37] hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Sizing Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-white">Loading drop piece...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
