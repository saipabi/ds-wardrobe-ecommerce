import {
  Product,
  Category,
  Collection,
  Cart,
  Order,
  Customer,
  ProductReview,
  Address,
  Coupon
} from '../types/commerce';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || data.error || `HTTP error ${res.status}`);
    }

    return data as T;
  } catch (err: any) {
    console.error(`API Request Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Store Catalog
  async getProducts(params: Record<string, any> = {}): Promise<{
    products: Product[];
    total: number;
    count: number;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ products: Product[]; total: number; count: number }>(`/store/products${qs}`);
  },

  async getProduct(idOrHandle: string): Promise<{ product: Product }> {
    return request<{ product: Product }>(`/store/products/${idOrHandle}`);
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    return request<{ categories: Category[] }>('/store/categories');
  },

  async getCollections(): Promise<{ collections: Collection[] }> {
    return request<{ collections: Collection[] }>('/store/collections');
  },

  // Cart Operations
  async createCart(customerId?: string, email?: string): Promise<{ cart: Cart }> {
    return request<{ cart: Cart }>('/store/carts', {
      method: 'POST',
      body: JSON.stringify({ customer_id: customerId, email })
    });
  },

  async getCart(cartId: string): Promise<{ cart: Cart }> {
    return request<{ cart: Cart }>(`/store/carts/${cartId}`);
  },

  async addToCart(
    cartId: string,
    productId: string,
    variantId: string,
    quantity: number = 1
  ): Promise<{ cart: Cart }> {
    return request<{ cart: Cart }>(`/store/carts/${cartId}/line-items`, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, variant_id: variantId, quantity })
    });
  },

  async updateCartItem(
    cartId: string,
    itemId: string,
    quantity: number
  ): Promise<{ cart: Cart }> {
    return request<{ cart: Cart }>(`/store/carts/${cartId}/line-items/${itemId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity })
    });
  },

  async removeCartItem(cartId: string, itemId: string): Promise<{ cart: Cart }> {
    return request<{ cart: Cart }>(`/store/carts/${cartId}/line-items/${itemId}`, {
      method: 'DELETE'
    });
  },

  async applyCoupon(cartId: string, couponCode: string): Promise<{ cart: Cart }> {
    return request<{ cart: Cart }>(`/store/carts/${cartId}/coupons`, {
      method: 'POST',
      body: JSON.stringify({ coupon_code: couponCode })
    });
  },

  async removeCoupon(cartId: string): Promise<{ cart: Cart }> {
    return request<{ cart: Cart }>(`/store/carts/${cartId}/coupons`, {
      method: 'DELETE'
    });
  },

  async setShipping(cartId: string, shippingMethodId: string): Promise<{ cart: Cart }> {
    return request<{ cart: Cart }>(`/store/carts/${cartId}/shipping`, {
      method: 'POST',
      body: JSON.stringify({ shipping_method_id: shippingMethodId })
    });
  },

  // Checkout & Orders
  async checkout(orderData: {
    cart_id: string;
    email: string;
    phone: string;
    shipping_address: Address;
    payment_method: 'upi' | 'card' | 'netbanking' | 'cod';
    payment_id?: string;
    notes?: string;
  }): Promise<{ order: Order }> {
    return request<{ order: Order }>('/store/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async getOrder(orderId: string): Promise<{ order: Order }> {
    return request<{ order: Order }>(`/store/orders/${orderId}`);
  },

  async trackOrder(displayId: string): Promise<{ order: Order }> {
    return request<{ order: Order }>(`/store/orders/track/${displayId}`);
  },

  // Authentication & Customer
  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    phone: string;
  }): Promise<{ customer: Customer; token: string }> {
    return request<{ customer: Customer; token: string }>('/store/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async login(email: string, password: string): Promise<{ customer: Customer; token: string }> {
    return request<{ customer: Customer; token: string }>('/store/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getProfile(token: string): Promise<{ customer: Customer; orders: Order[] }> {
    return request<{ customer: Customer; orders: Order[] }>('/store/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async toggleWishlist(productId: string, token: string): Promise<{ wishlist: string[] }> {
    return request<{ wishlist: string[] }>('/store/auth/wishlist/toggle', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ product_id: productId })
    });
  },

  // Reviews
  async getReviews(productId: string): Promise<{ reviews: ProductReview[] }> {
    return request<{ reviews: ProductReview[] }>(`/store/products/${productId}/reviews`);
  },

  async submitReview(
    productId: string,
    data: { author_name: string; rating: number; headline?: string; comment: string }
  ): Promise<{ review: ProductReview }> {
    return request<{ review: ProductReview }>(`/store/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Admin APIs
  async adminLogin(email: string, password: string): Promise<{ admin: any; token: string }> {
    return request<{ admin: any; token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getAdminAnalytics(token?: string): Promise<any> {
    return request<any>('/admin/analytics', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },

  async createProduct(productData: Partial<Product>, token?: string): Promise<{ product: Product }> {
    return request<{ product: Product }>('/admin/products', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id: string, updates: Partial<Product>, token?: string): Promise<{ product: Product }> {
    return request<{ product: Product }>(`/admin/products/${id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(updates)
    });
  },

  async deleteProduct(id: string, token?: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/admin/products/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },

  async updateVariantStock(
    productId: string,
    variantId: string,
    quantity: number,
    token?: string
  ): Promise<{ variant: any }> {
    return request<{ variant: any }>(`/admin/products/${productId}/variants/${variantId}/stock`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ quantity })
    });
  },

  async getAdminOrders(token?: string): Promise<{ orders: Order[] }> {
    return request<{ orders: Order[] }>('/admin/orders', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
    location?: string,
    note?: string,
    token?: string
  ): Promise<{ order: Order }> {
    return request<{ order: Order }>(`/admin/orders/${orderId}/status`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ status, location, note })
    });
  },

  async createCoupon(couponData: Coupon, token?: string): Promise<{ coupon: Coupon }> {
    return request<{ coupon: Coupon }>('/admin/coupons', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(couponData)
    });
  }
};
