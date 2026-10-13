import { v4 as uuidv4 } from 'uuid';
import { dbManager } from './db';
import { Cart, CartItem, ShippingMethod } from '../types/commerce';

const DEFAULT_SHIPPING_STANDARD: ShippingMethod = {
  id: 'ship_standard',
  name: 'Standard Pan-India Shipping',
  price: 0,
  estimated_days: '3-5 business days'
};

const SHIPPING_EXPRESS: ShippingMethod = {
  id: 'ship_express',
  name: 'Express Air Courier',
  price: 249,
  estimated_days: '1-2 business days'
};

export class CartService {
  public static createCart(customerId?: string, email?: string): Cart {
    const newCart: Cart = {
      id: `cart_${uuidv4().replace(/-/g, '').slice(0, 16)}`,
      customer_id: customerId || null,
      email: email || null,
      items: [],
      coupon_code: null,
      discount_amount: 0,
      shipping_method: DEFAULT_SHIPPING_STANDARD,
      shipping_total: 0,
      subtotal: 0,
      total: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    dbManager.db.carts.push(newCart);
    dbManager.save();
    return newCart;
  }

  public static getCart(cartId: string): Cart | null {
    const cart = dbManager.db.carts.find(c => c.id === cartId);
    if (!cart) return null;
    return this.recalculate(cart);
  }

  public static addItem(
    cartId: string,
    productId: string,
    variantId: string,
    quantity: number = 1
  ): { cart: Cart | null; error?: string } {
    let cart = dbManager.db.carts.find(c => c.id === cartId);
    if (!cart) {
      cart = this.createCart();
    }

    const product = dbManager.db.products.find(p => p.id === productId);
    if (!product) return { cart: null, error: 'Product not found' };

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return { cart: null, error: 'Variant not found' };

    if (!variant.in_stock || variant.inventory_quantity <= 0) {
      return { cart: null, error: 'Selected variant is out of stock' };
    }

    const existingIndex = cart.items.findIndex(item => item.variant_id === variantId);
    const priceToCharge = variant.sale_price ?? variant.price;

    if (existingIndex > -1) {
      const currentQty = cart.items[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      if (targetQty > variant.inventory_quantity) {
        return {
          cart: null,
          error: `Only ${variant.inventory_quantity} pieces available in this size/color.`
        };
      }

      cart.items[existingIndex].quantity = targetQty;
    } else {
      if (quantity > variant.inventory_quantity) {
        return {
          cart: null,
          error: `Only ${variant.inventory_quantity} pieces available in this size/color.`
        };
      }

      const newItem: CartItem = {
        id: `item_${uuidv4().replace(/-/g, '').slice(0, 12)}`,
        product_id: product.id,
        variant_id: variant.id,
        title: product.title,
        variant_title: variant.title,
        thumbnail: variant.image || product.thumbnail,
        price: priceToCharge,
        regular_price: variant.price,
        quantity,
        size: variant.size,
        color: variant.color,
        colorHex: variant.colorHex
      };

      cart.items.push(newItem);
    }

    cart.updated_at = new Date().toISOString();
    this.recalculate(cart);
    dbManager.save();
    return { cart };
  }

  public static updateItemQuantity(
    cartId: string,
    itemId: string,
    quantity: number
  ): { cart: Cart | null; error?: string } {
    const cart = dbManager.db.carts.find(c => c.id === cartId);
    if (!cart) return { cart: null, error: 'Cart not found' };

    const itemIndex = cart.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return { cart: null, error: 'Cart item not found' };

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const item = cart.items[itemIndex];
      const product = dbManager.db.products.find(p => p.id === item.product_id);
      const variant = product?.variants.find(v => v.id === item.variant_id);

      if (variant && quantity > variant.inventory_quantity) {
        return {
          cart: null,
          error: `Cannot add more than ${variant.inventory_quantity} items (stock limit).`
        };
      }

      item.quantity = quantity;
    }

    cart.updated_at = new Date().toISOString();
    this.recalculate(cart);
    dbManager.save();
    return { cart };
  }

  public static removeItem(cartId: string, itemId: string): Cart | null {
    const cart = dbManager.db.carts.find(c => c.id === cartId);
    if (!cart) return null;

    cart.items = cart.items.filter(i => i.id !== itemId);
    cart.updated_at = new Date().toISOString();
    this.recalculate(cart);
    dbManager.save();
    return cart;
  }

  public static applyCoupon(cartId: string, couponCode: string): { cart: Cart | null; error?: string } {
    const cart = dbManager.db.carts.find(c => c.id === cartId);
    if (!cart) return { cart: null, error: 'Cart not found' };

    const cleanCode = couponCode.trim().toUpperCase();
    const coupon = dbManager.db.coupons.find(c => c.code === cleanCode && c.active);

    if (!coupon) {
      return { cart: null, error: 'Invalid or expired coupon code' };
    }

    this.recalculate(cart);

    if (cart.subtotal < coupon.min_order_amount) {
      return {
        cart: null,
        error: `Coupon requires a minimum cart value of ₹${coupon.min_order_amount.toLocaleString()}`
      };
    }

    cart.coupon_code = coupon.code;
    cart.updated_at = new Date().toISOString();
    this.recalculate(cart);
    dbManager.save();
    return { cart };
  }

  public static removeCoupon(cartId: string): Cart | null {
    const cart = dbManager.db.carts.find(c => c.id === cartId);
    if (!cart) return null;

    cart.coupon_code = null;
    cart.discount_amount = 0;
    cart.updated_at = new Date().toISOString();
    this.recalculate(cart);
    dbManager.save();
    return cart;
  }

  public static setShipping(cartId: string, shippingMethodId: string): Cart | null {
    const cart = dbManager.db.carts.find(c => c.id === cartId);
    if (!cart) return null;

    if (shippingMethodId === 'ship_express') {
      cart.shipping_method = SHIPPING_EXPRESS;
    } else {
      cart.shipping_method = DEFAULT_SHIPPING_STANDARD;
    }

    cart.updated_at = new Date().toISOString();
    this.recalculate(cart);
    dbManager.save();
    return cart;
  }

  public static recalculate(cart: Cart): Cart {
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.subtotal = subtotal;

    // Coupon discount calculation
    let discount = 0;
    if (cart.coupon_code) {
      const coupon = dbManager.db.coupons.find(c => c.code === cart.coupon_code && c.active);
      if (coupon && subtotal >= coupon.min_order_amount) {
        if (coupon.discount_type === 'percentage') {
          discount = Math.round((subtotal * coupon.discount_value) / 100);
        } else {
          discount = coupon.discount_value;
        }
      } else {
        cart.coupon_code = null;
      }
    }
    cart.discount_amount = Math.min(discount, subtotal);

    // Free standard shipping if subtotal >= 1999, else standard is 149
    if (cart.shipping_method?.id === 'ship_express') {
      cart.shipping_total = 249;
    } else {
      cart.shipping_total = subtotal >= 1999 || subtotal === 0 ? 0 : 149;
      if (cart.shipping_method) {
        cart.shipping_method.price = cart.shipping_total;
      }
    }

    cart.total = Math.max(0, cart.subtotal - cart.discount_amount + cart.shipping_total);
    return cart;
  }
}
