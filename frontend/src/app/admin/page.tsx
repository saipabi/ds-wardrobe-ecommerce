'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Tag,
  ArrowRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { api } from '../../lib/api';
import { Product, Order, ProductVariant, Coupon } from '../../types/commerce';

export default function AdminPage() {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('admin@dswardrobe.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard Data
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'products' | 'coupons'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // New Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Dresses');
  const [newCollection, setNewCollection] = useState('Midnight Runway Drop');
  const [newPrice, setNewPrice] = useState('3999');
  const [newSalePrice, setNewSalePrice] = useState('2999');
  const [newDescription, setNewDescription] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80');

  // Coupon Generator State
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState('15');
  const [couponMinSpend, setCouponMinSpend] = useState('2999');

  const checkAdminSession = () => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('ds_admin_token') : null;
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAdminAuth(true);
    }
  };

  useEffect(() => {
    checkAdminSession();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await api.adminLogin(adminEmail, adminPassword);
      setAdminToken(res.token);
      setIsAdminAuth(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ds_admin_token', res.token);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    setAdminToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ds_admin_token');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      const [analyticsData, prodRes, ordRes] = await Promise.all([
        api.getAdminAnalytics(adminToken || undefined),
        api.getProducts({ limit: 100 }),
        api.getAdminOrders(adminToken || undefined)
      ]);
      setAnalytics(analyticsData);
      setProducts(prodRes.products);
      setOrders(ordRes.orders);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdminAuth) {
      fetchDashboardData();
    }
  }, [isAdminAuth]);

  // Inventory Stock Adjustment Handler
  const handleStockUpdate = async (productId: string, variantId: string, currentStock: number, delta: number) => {
    const newQuantity = Math.max(0, currentStock + delta);
    try {
      await api.updateVariantStock(productId, variantId, newQuantity, adminToken || undefined);
      // Refresh local analytics and products
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    }
  };

  // Order Status Progression Handler
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, 'Hub Update', undefined, adminToken || undefined);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // Product Creation Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProduct(
        {
          title: newTitle,
          category: newCategory,
          collection: newCollection,
          thumbnail: newThumbnail,
          images: [newThumbnail],
          description: newDescription,
          variants: [
            {
              id: `var_${Date.now()}_s`,
              product_id: '',
              title: `${newTitle} / S`,
              sku: `DS-${Math.floor(1000 + Math.random() * 9000)}`,
              size: 'S',
              color: 'Obsidian Black',
              colorHex: '#111111',
              price: Number(newPrice),
              sale_price: Number(newSalePrice),
              inventory_quantity: 8,
              in_stock: true
            },
            {
              id: `var_${Date.now()}_m`,
              product_id: '',
              title: `${newTitle} / M`,
              sku: `DS-${Math.floor(1000 + Math.random() * 9000)}`,
              size: 'M',
              color: 'Obsidian Black',
              colorHex: '#111111',
              price: Number(newPrice),
              sale_price: Number(newSalePrice),
              inventory_quantity: 5,
              in_stock: true
            }
          ]
        },
        adminToken || undefined
      );

      setShowProductModal(false);
      setNewTitle('');
      setNewDescription('');
      fetchDashboardData();
      alert('Product created and published to store successfully!');
    } catch (err: any) {
      alert(err.message || 'Product creation failed');
    }
  };

  // Create Coupon Handler
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCoupon(
        {
          code: couponCode.toUpperCase().trim(),
          description: `${couponValue}${couponType === 'percentage' ? '%' : '₹'} off orders above ₹${couponMinSpend}`,
          discount_type: couponType,
          discount_value: Number(couponValue),
          min_order_amount: Number(couponMinSpend),
          active: true
        },
        adminToken || undefined
      );

      alert(`Coupon ${couponCode.toUpperCase()} activated successfully!`);
      setCouponCode('');
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Coupon creation failed');
    }
  };

  // If Not Authenticated as Admin
  if (!isAdminAuth) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-[#141418] border border-[#262632] p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-editorial text-2xl font-bold text-white">DS Wardrobe Operations</h1>
            <p className="text-xs text-[#8A8A96]">
              Secure internal portal for catalog, inventory, and order management.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#A0A0B0] font-bold uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full bg-[#1B1B22] border border-[#2D2D38] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[#A0A0B0] font-bold uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full bg-[#1B1B22] border border-[#2D2D38] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {loginError && <p className="text-[#F87171] text-xs">{loginError}</p>}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-full transition-all shadow-lg"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-[#70707E]">
            Default Demo Credentials: <code className="text-[#D4AF37]">admin@dswardrobe.com</code> / <code className="text-[#D4AF37]">admin123</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#24242E] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#D4AF37] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Operations & Storefront Control</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            DS Wardrobe Admin Portal
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-full bg-[#1A1A22] border border-[#2E2E3C] text-[#A0A0B0] hover:text-white transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowProductModal(true)}
            className="bg-[#D4AF37] hover:bg-[#E5C058] text-black font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full flex items-center space-x-1.5 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Drop</span>
          </button>
          <button
            onClick={handleAdminLogout}
            className="p-2.5 rounded-full bg-[#241A1A] border border-[#442828] text-[#F87171] hover:bg-[#322020] transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#141418] border border-[#24242E] p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8E8E9E]">
            <span>Total Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-gold-gradient">
            ₹{(analytics?.total_revenue || 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-[#10B981] font-semibold">100% Captured Orders</span>
        </div>

        <div className="bg-[#141418] border border-[#24242E] p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8E8E9E]">
            <span>Total Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-white">
            {analytics?.total_orders || 0}
          </div>
          <span className="text-[10px] text-[#A0A0B0]">Live store orders</span>
        </div>

        <div className="bg-[#141418] border border-[#24242E] p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8E8E9E]">
            <span>Active Products</span>
            <Package className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-white">
            {products.length}
          </div>
          <span className="text-[10px] text-[#A0A0B0]">Catalog items published</span>
        </div>

        <div className="bg-[#141418] border border-[#24242E] p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8E8E9E]">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-[#F59E0B]">
            {analytics?.low_stock_count || 0}
          </div>
          <span className="text-[10px] text-[#F59E0B] font-semibold">Variants &lt; 5 pieces left</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#24242E] space-x-6 text-xs font-bold uppercase tracking-wider overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 transition-colors ${
            activeTab === 'analytics' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#848492]'
          }`}
        >
          Overview & Recent
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors ${
            activeTab === 'inventory' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#848492]'
          }`}
        >
          Variant Inventory Manager ({analytics?.variants?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors ${
            activeTab === 'orders' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#848492]'
          }`}
        >
          Orders Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors ${
            activeTab === 'products' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#848492]'
          }`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 transition-colors ${
            activeTab === 'coupons' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#848492]'
          }`}
        >
          Discounts & Promos
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders Table */}
          <div className="bg-[#141418] border border-[#24242E] rounded-2xl p-6 space-y-4">
            <h3 className="font-editorial text-lg font-bold text-white">Recent Store Orders</h3>
            <div className="divide-y divide-[#1F1F28] max-h-96 overflow-y-auto">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{o.display_id}</span>
                    <span className="text-[#7E7E8E] block text-[11px]">{o.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#D4AF37]">₹{o.total.toLocaleString()}</span>
                    <span className="text-[10px] text-[#10B981] block uppercase">{o.fulfillment_status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning Box */}
          <div className="bg-[#141418] border border-[#24242E] rounded-2xl p-6 space-y-4">
            <h3 className="font-editorial text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>Low Stock Alerts</span>
            </h3>

            <div className="space-y-2.5 max-h-96 overflow-y-auto text-xs">
              {analytics?.variants
                ?.filter((v: any) => v.inventory_quantity < 5)
                .map((v: any) => (
                  <div
                    key={v.id}
                    className="bg-[#1A1A22] border border-[#2B2B38] p-3 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white">{v.productTitle}</h4>
                      <p className="text-[11px] text-[#8E8E9E]">
                        Size: {v.size} • Color: {v.color} ({v.sku})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#F59E0B] px-2 py-0.5 rounded bg-[#F59E0B]/15">
                        {v.inventory_quantity} Left
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: INVENTORY MANAGER */}
      {activeTab === 'inventory' && (
        <div className="bg-[#141418] border border-[#24242E] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-lg font-bold text-white">Live Stock Management</h3>
            <p className="text-xs text-[#8A8A96]">
              Real-time stock decrement and adjustment per variant.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#262632]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1C1C24] text-[#D4AF37] uppercase font-bold tracking-wider text-[11px] border-b border-[#282835]">
                <tr>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Color</th>
                  <th className="py-3 px-4">In-Stock Status</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4 text-right">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20202A] text-[#D0D0DE]">
                {analytics?.variants?.map((v: any) => (
                  <tr key={v.id} className="hover:bg-[#1A1A22] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{v.productTitle}</td>
                    <td className="py-3 px-4 font-mono text-[#888898]">{v.sku}</td>
                    <td className="py-3 px-4 font-bold">{v.size}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.colorHex }} />
                        <span>{v.color}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {v.inventory_quantity > 0 ? (
                        <span className="text-[#10B981] font-semibold">Available</span>
                      ) : (
                        <span className="text-[#EF4444] font-semibold">Sold Out</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{v.inventory_quantity}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center space-x-1 bg-[#121216] border border-[#2A2A38] rounded-lg p-1">
                        <button
                          onClick={() => handleStockUpdate(v.product_id, v.id, v.inventory_quantity, -1)}
                          className="px-2 py-0.5 bg-[#1F1F28] hover:bg-[#2B2B38] rounded text-white font-bold"
                          title="-1 piece"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleStockUpdate(v.product_id, v.id, v.inventory_quantity, 1)}
                          className="px-2 py-0.5 bg-[#1F1F28] hover:bg-[#2B2B38] rounded text-white font-bold"
                          title="+1 piece"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleStockUpdate(v.product_id, v.id, v.inventory_quantity, 5)}
                          className="px-2 py-0.5 bg-[#D4AF37] hover:bg-[#E5C058] rounded text-black font-extrabold text-[10px]"
                          title="+5 pieces"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="bg-[#141418] border border-[#24242E] rounded-2xl p-6 space-y-4">
          <h3 className="font-editorial text-lg font-bold text-white">Order Pipeline & Logistics</h3>

          <div className="space-y-4">
            {orders.map(ord => (
              <div
                key={ord.id}
                className="bg-[#181820] border border-[#272733] p-5 rounded-2xl space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#22222E] gap-2">
                  <div>
                    <span className="font-bold text-white text-sm">{ord.display_id}</span>
                    <span className="text-[#888898] ml-2">({ord.email} • {ord.phone})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#D4AF37] font-bold text-sm">₹{ord.total.toLocaleString()}</span>
                    <span className="bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded-full font-bold">
                      {ord.payment_status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[#C4C4D0]">
                      <strong>Destination:</strong> {ord.shipping_address.city}, {ord.shipping_address.state} (PIN: {ord.shipping_address.postal_code})
                    </p>
                    <p className="text-[#888896] mt-0.5">
                      Items: {ord.items.map(i => `${i.title} (${i.size}x${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  {/* Stage Progressor */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[#A0A0B0] font-semibold">Advance Status:</span>
                    <select
                      value={ord.fulfillment_status}
                      onChange={e => handleOrderStatusChange(ord.id, e.target.value)}
                      className="bg-[#121216] border border-[#2F2F3D] text-white p-2 rounded-lg text-xs cursor-pointer focus:border-[#D4AF37]"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: PRODUCT CATALOG */}
      {activeTab === 'products' && (
        <div className="bg-[#141418] border border-[#24242E] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-lg font-bold text-white">Active Product Drops</h3>
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-4 py-2 rounded-full flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Drop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div
                key={p.id}
                className="bg-[#181820] border border-[#282835] p-4 rounded-xl flex space-x-3 text-xs"
              >
                <img src={p.thumbnail} alt={p.title} className="w-16 h-20 object-cover rounded-lg" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{p.title}</h4>
                    <p className="text-[10px] text-[#D4AF37] mt-0.5">{p.category}</p>
                    <p className="text-xs font-bold text-white mt-1">
                      ₹{p.variants[0]?.sale_price || p.variants[0]?.price}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2 border-t border-[#252530]">
                    <Link
                      href={`/product/${p.handle}`}
                      target="_blank"
                      className="text-xs text-[#D4AF37] hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: COUPON GENERATOR */}
      {activeTab === 'coupons' && (
        <div className="bg-[#141418] border border-[#24242E] rounded-2xl p-6 space-y-6">
          <h3 className="font-editorial text-lg font-bold text-white">Generate VIP Coupon Code</h3>

          <form onSubmit={handleCreateCoupon} className="max-w-xl space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A0A0B0] font-bold uppercase tracking-wider mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIPFESTIVE25"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#1B1B22] border border-[#2D2D38] text-white p-3 rounded-xl focus:border-[#D4AF37] uppercase"
                />
              </div>

              <div>
                <label className="block text-[#A0A0B0] font-bold uppercase tracking-wider mb-1">
                  Discount Type
                </label>
                <select
                  value={couponType}
                  onChange={e => setCouponType(e.target.value as any)}
                  className="w-full bg-[#1B1B22] border border-[#2D2D38] text-white p-3 rounded-xl focus:border-[#D4AF37]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Flat Amount (₹)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A0A0B0] font-bold uppercase tracking-wider mb-1">
                  Discount Value *
                </label>
                <input
                  type="number"
                  required
                  value={couponValue}
                  onChange={e => setCouponValue(e.target.value)}
                  className="w-full bg-[#1B1B22] border border-[#2D2D38] text-white p-3 rounded-xl focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#A0A0B0] font-bold uppercase tracking-wider mb-1">
                  Minimum Cart Spend (₹)
                </label>
                <input
                  type="number"
                  required
                  value={couponMinSpend}
                  onChange={e => setCouponMinSpend(e.target.value)}
                  className="w-full bg-[#1B1B22] border border-[#2D2D38] text-white p-3 rounded-xl focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all"
            >
              Activate Coupon
            </button>
          </form>
        </div>
      )}

      {/* Modal: Create Product */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#15151A] border border-[#2A2A38] rounded-3xl p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-editorial text-xl font-bold">Add New Capsule Drop</h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A0A0B0] font-bold uppercase mb-1">Garment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celestial Satin Slip Gown"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-[#1C1C24] border border-[#2D2D38] p-3 rounded-xl focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A0A0B0] font-bold uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D38] p-3 rounded-xl"
                  >
                    <option value="Dresses">Dresses</option>
                    <option value="Co-ord Sets">Co-ord Sets</option>
                    <option value="Festive & Fusion">Festive & Fusion</option>
                    <option value="Tops & Shirts">Tops & Shirts</option>
                    <option value="Trousers & Skirts">Trousers & Skirts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A0A0B0] font-bold uppercase mb-1">Collection</label>
                  <input
                    type="text"
                    value={newCollection}
                    onChange={e => setNewCollection(e.target.value)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D38] p-3 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A0A0B0] font-bold uppercase mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D38] p-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0B0] font-bold uppercase mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newSalePrice}
                    onChange={e => setNewSalePrice(e.target.value)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D38] p-3 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A0A0B0] font-bold uppercase mb-1">Image URL (Unsplash/CDN)</label>
                <input
                  type="url"
                  required
                  value={newThumbnail}
                  onChange={e => setNewThumbnail(e.target.value)}
                  className="w-full bg-[#1C1C24] border border-[#2D2D38] p-3 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[#A0A0B0] font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Fabric details, styling tips..."
                  className="w-full bg-[#1C1C24] border border-[#2D2D38] p-3 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 rounded-full bg-[#202028] text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-extrabold uppercase tracking-wider"
                >
                  Publish Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
