import { v4 as uuidv4 } from 'uuid';
import { dbManager } from './db';
import { Product, ProductVariant, Coupon } from '../types/commerce';

export class AdminService {
  public static getAnalytics() {
    const orders = dbManager.db.orders;
    const products = dbManager.db.products;
    const customers = dbManager.db.customers;

    const totalRevenue = orders.reduce((sum, o) => (o.payment_status === 'captured' ? sum + o.total : sum), 0);
    const totalOrders = orders.length;

    let lowStockCount = 0;
    let outOfStockCount = 0;
    const allVariants: (ProductVariant & { productTitle: string })[] = [];

    products.forEach(p => {
      p.variants.forEach(v => {
        allVariants.push({ ...v, productTitle: p.title });
        if (v.inventory_quantity === 0 || !v.in_stock) {
          outOfStockCount++;
        } else if (v.inventory_quantity < 5) {
          lowStockCount++;
        }
      });
    });

    return {
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      total_products: products.length,
      total_customers: customers.length,
      low_stock_count: lowStockCount,
      out_of_stock_count: outOfStockCount,
      recent_orders: orders.slice(0, 10),
      variants: allVariants
    };
  }

  public static createProduct(data: Partial<Product>): Product {
    const newProduct: Product = {
      id: `prod_${uuidv4().replace(/-/g, '').slice(0, 12)}`,
      title: data.title || 'Untitled Drop Piece',
      handle: data.handle || (data.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle: data.subtitle || '',
      description: data.description || '',
      category: data.category || 'Dresses',
      collection: data.collection || 'Midnight Runway Drop',
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      images: data.images && data.images.length > 0 ? data.images : [data.thumbnail || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'],
      tags: data.tags || ['New Drop'],
      material: data.material || 'Premium Fabric',
      care_instructions: data.care_instructions || 'Dry clean recommended',
      status: data.status || 'published',
      variants: data.variants && data.variants.length > 0 ? data.variants : [
        {
          id: `var_${uuidv4().replace(/-/g, '').slice(0, 8)}`,
          product_id: '',
          title: 'Standard / Free Size',
          sku: `DS-${Math.floor(1000 + Math.random() * 9000)}`,
          size: 'M',
          color: 'Obsidian Black',
          colorHex: '#111111',
          price: 2999,
          sale_price: 2499,
          inventory_quantity: 10,
          in_stock: true
        }
      ],
      rating: 5.0,
      reviews_count: 0,
      is_featured: data.is_featured ?? false,
      is_new_arrival: data.is_new_arrival ?? true,
      is_best_seller: data.is_best_seller ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Ensure variant product_ids are correct
    newProduct.variants.forEach(v => {
      v.product_id = newProduct.id;
    });

    dbManager.db.products.unshift(newProduct);
    dbManager.save();
    return newProduct;
  }

  public static updateProduct(id: string, updates: Partial<Product>): Product | null {
    const product = dbManager.db.products.find(p => p.id === id);
    if (!product) return null;

    Object.assign(product, updates, { updated_at: new Date().toISOString() });
    dbManager.save();
    return product;
  }

  public static deleteProduct(id: string): boolean {
    const idx = dbManager.db.products.findIndex(p => p.id === id);
    if (idx === -1) return false;

    dbManager.db.products.splice(idx, 1);
    dbManager.save();
    return true;
  }

  public static updateVariantStock(productId: string, variantId: string, quantity: number): ProductVariant | null {
    const product = dbManager.db.products.find(p => p.id === productId);
    if (!product) return null;

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return null;

    variant.inventory_quantity = Math.max(0, quantity);
    variant.in_stock = variant.inventory_quantity > 0;
    product.updated_at = new Date().toISOString();

    dbManager.save();
    return variant;
  }

  public static createCoupon(data: Coupon): Coupon {
    const coupon: Coupon = {
      code: data.code.toUpperCase().trim(),
      description: data.description,
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      min_order_amount: data.min_order_amount || 0,
      active: true
    };

    const existingIdx = dbManager.db.coupons.findIndex(c => c.code === coupon.code);
    if (existingIdx > -1) {
      dbManager.db.coupons[existingIdx] = coupon;
    } else {
      dbManager.db.coupons.push(coupon);
    }

    dbManager.save();
    return coupon;
  }
}
