import { v4 as uuidv4 } from 'uuid';
import { dbManager } from './db';
import { CartService } from './cartService';
import {
  Order,
  Address,
  OrderPaymentStatus,
  OrderFulfillmentStatus,
  TrackingEvent
} from '../types/commerce';

export interface CreateOrderInput {
  cart_id: string;
  customer_id?: string | null;
  email: string;
  phone: string;
  shipping_address: Address;
  payment_method: 'upi' | 'card' | 'netbanking' | 'cod';
  payment_id?: string;
  notes?: string;
}

export class OrderService {
  public static createOrder(input: CreateOrderInput): { order: Order | null; error?: string } {
    const cart = CartService.getCart(input.cart_id);
    if (!cart) return { order: null, error: 'Cart not found' };
    if (!cart.items || cart.items.length === 0) {
      return { order: null, error: 'Cannot checkout with an empty cart' };
    }

    // 1. Verify and decrement stock for all items
    for (const item of cart.items) {
      const product = dbManager.db.products.find(p => p.id === item.product_id);
      if (!product) return { order: null, error: `Product ${item.title} is no longer available.` };

      const variant = product.variants.find(v => v.id === item.variant_id);
      if (!variant) return { order: null, error: `Variant for ${item.title} (${item.variant_title}) not found.` };

      if (variant.inventory_quantity < item.quantity) {
        return {
          order: null,
          error: `Insufficient stock for ${item.title} (${item.variant_title}). Available: ${variant.inventory_quantity}`
        };
      }
    }

    // Decrement inventory
    for (const item of cart.items) {
      const product = dbManager.db.products.find(p => p.id === item.product_id);
      if (product) {
        const variant = product.variants.find(v => v.id === item.variant_id);
        if (variant) {
          variant.inventory_quantity -= item.quantity;
          if (variant.inventory_quantity <= 0) {
            variant.inventory_quantity = 0;
            variant.in_stock = false;
          }
        }
      }
    }

    // 2. Generate Order Display ID and Tracking Number
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const displayId = `DS-${randomDigits}`;
    const trackingNum = `DS${Math.floor(100000000 + Math.random() * 900000000)}IN`;

    const paymentStatus: OrderPaymentStatus = input.payment_method === 'cod' ? 'cod_pending' : 'captured';

    const nowIso = new Date().toISOString();
    const initialTracking: TrackingEvent[] = [
      {
        status: 'Order Placed',
        description: 'Your order has been verified and registered at DS Wardrobe studio.',
        location: 'Singarayakonda Studio Hub',
        timestamp: nowIso
      },
      {
        status: 'Processing',
        description: 'Garments undergoing boutique quality inspection and custom tissue-packaging.',
        location: 'Singarayakonda Fulfilment Center',
        timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      }
    ];

    const order: Order = {
      id: `order_${uuidv4().replace(/-/g, '').slice(0, 16)}`,
      display_id: displayId,
      customer_id: input.customer_id || null,
      email: input.email,
      phone: input.phone,
      shipping_address: input.shipping_address,
      items: [...cart.items],
      shipping_method: cart.shipping_method || {
        id: 'ship_standard',
        name: 'Standard Pan-India Shipping',
        price: 0,
        estimated_days: '3-5 business days'
      },
      payment_method: input.payment_method,
      payment_status: paymentStatus,
      fulfillment_status: 'processing',
      courier_name: 'Bluedart Express / Delhivery',
      tracking_number: trackingNum,
      tracking_history: initialTracking,
      subtotal: cart.subtotal,
      discount_total: cart.discount_amount,
      shipping_total: cart.shipping_total,
      tax_total: Math.round(cart.subtotal * 0.05), // included 5% GST display
      total: cart.total,
      notes: input.notes,
      created_at: nowIso,
      updated_at: nowIso
    };

    dbManager.db.orders.unshift(order);

    // Empty the cart
    cart.items = [];
    cart.coupon_code = null;
    cart.discount_amount = 0;
    CartService.recalculate(cart);

    dbManager.save();
    return { order };
  }

  public static getById(orderId: string): Order | null {
    return dbManager.db.orders.find(o => o.id === orderId) || null;
  }

  public static getByDisplayId(displayId: string): Order | null {
    const cleanId = displayId.trim().toUpperCase();
    return dbManager.db.orders.find(o => o.display_id.toUpperCase() === cleanId) || null;
  }

  public static getCustomerOrders(emailOrCustomerId: string): Order[] {
    const needle = emailOrCustomerId.toLowerCase().trim();
    return dbManager.db.orders.filter(
      o => o.email.toLowerCase() === needle || o.customer_id === needle
    );
  }

  public static updateFulfillmentStatus(
    orderId: string,
    status: OrderFulfillmentStatus,
    newLocation: string = 'In Transit',
    customNote?: string
  ): Order | null {
    const order = dbManager.db.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.fulfillment_status = status;
    order.updated_at = new Date().toISOString();

    const descriptions: Record<OrderFulfillmentStatus, string> = {
      unfulfilled: 'Order received and awaiting processing.',
      processing: 'Garments inspected and packaged in DS Wardrobe luxury packaging.',
      shipped: 'Order dispatched via courier and on route to delivery hub.',
      out_for_delivery: 'Courier executive assigned. Out for delivery today.',
      delivered: 'Package successfully delivered to the customer address.',
      cancelled: 'Order has been cancelled and refund initiated where applicable.'
    };

    order.tracking_history.push({
      status: status.replace(/_/g, ' ').toUpperCase(),
      description: customNote || descriptions[status],
      location: newLocation,
      timestamp: new Date().toISOString()
    });

    dbManager.save();
    return order;
  }

  public static listAll(): Order[] {
    return dbManager.db.orders;
  }
}
