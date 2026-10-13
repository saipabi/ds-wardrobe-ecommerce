export type ProductStatus = 'published' | 'draft' | 'archived';

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  sku: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  colorHex: string;
  price: number;
  sale_price: number | null;
  inventory_quantity: number;
  in_stock: boolean;
  image?: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  subtitle: string;
  description: string;
  category: string;
  collection: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  material: string;
  care_instructions: string;
  size_guide?: {
    chest: string;
    waist: string;
    hip: string;
    length: string;
  };
  model_info?: string;
  status: ProductStatus;
  variants: ProductVariant[];
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  handle: string;
  description: string;
  image: string;
  item_count: number;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  subtitle: string;
  description: string;
  banner_image: string;
  featured: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  variant_title: string;
  thumbnail: string;
  price: number;
  regular_price: number;
  quantity: number;
  size: string;
  color: string;
  colorHex: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimated_days: string;
}

export interface Cart {
  id: string;
  customer_id?: string | null;
  email?: string | null;
  items: CartItem[];
  coupon_code?: string | null;
  discount_amount: number;
  shipping_method?: ShippingMethod | null;
  shipping_total: number;
  subtotal: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface Address {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export type OrderPaymentStatus = 'pending' | 'captured' | 'failed' | 'cod_pending';
export type OrderFulfillmentStatus = 'unfulfilled' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface TrackingEvent {
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

export interface Order {
  id: string;
  display_id: string;
  customer_id?: string | null;
  email: string;
  phone: string;
  shipping_address: Address;
  items: CartItem[];
  shipping_method: ShippingMethod;
  payment_method: 'upi' | 'card' | 'netbanking' | 'cod';
  payment_status: OrderPaymentStatus;
  fulfillment_status: OrderFulfillmentStatus;
  courier_name: string;
  tracking_number: string;
  tracking_history: TrackingEvent[];
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  addresses: Address[];
  wishlist: string[];
  created_at: string;
}

export interface Coupon {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  active: boolean;
}

export interface ProductReview {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  headline: string;
  comment: string;
  verified_buyer: boolean;
  created_at: string;
}
