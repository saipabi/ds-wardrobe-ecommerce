import { dbManager } from './db';
import { Product, Category, Collection } from '../types/commerce';

export interface ProductQueryFilters {
  q?: string;
  category?: string;
  collection?: string;
  size?: string;
  color?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  limit?: number;
  offset?: number;
}

export class ProductService {
  public static list(filters: ProductQueryFilters = {}) {
    let products = [...dbManager.db.products].filter(p => p.status === 'published');

    // 1. Text Search across Title, Description, Tags, Category
    if (filters.q && filters.q.trim()) {
      const q = filters.q.toLowerCase().trim();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (filters.category && filters.category !== 'all') {
      const targetCat = filters.category.toLowerCase();
      products = products.filter(p =>
        p.category.toLowerCase() === targetCat ||
        p.category.toLowerCase().replace(/\s+/g, '-').includes(targetCat)
      );
    }

    // 3. Collection Filter
    if (filters.collection && filters.collection !== 'all') {
      const targetCol = filters.collection.toLowerCase();
      products = products.filter(p =>
        p.collection.toLowerCase() === targetCol ||
        p.collection.toLowerCase().replace(/\s+/g, '-').includes(targetCol)
      );
    }

    // 4. Size Filter (Check if any variant matches size)
    if (filters.size) {
      const targetSize = filters.size.toUpperCase();
      products = products.filter(p =>
        p.variants.some(v => v.size === targetSize && (filters.in_stock ? v.inventory_quantity > 0 : true))
      );
    }

    // 5. Color Filter
    if (filters.color) {
      const targetColor = filters.color.toLowerCase();
      products = products.filter(p =>
        p.variants.some(v => v.color.toLowerCase().includes(targetColor))
      );
    }

    // 6. Price Range Filter
    if (typeof filters.min_price === 'number') {
      products = products.filter(p => {
        const lowestPrice = Math.min(...p.variants.map(v => v.sale_price ?? v.price));
        return lowestPrice >= filters.min_price!;
      });
    }

    if (typeof filters.max_price === 'number') {
      products = products.filter(p => {
        const lowestPrice = Math.min(...p.variants.map(v => v.sale_price ?? v.price));
        return lowestPrice <= filters.max_price!;
      });
    }

    // 7. In Stock Filter
    if (filters.in_stock) {
      products = products.filter(p =>
        p.variants.some(v => v.in_stock && v.inventory_quantity > 0)
      );
    }

    // 8. Sorting
    switch (filters.sort) {
      case 'newest':
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price_asc':
        products.sort((a, b) => {
          const priceA = Math.min(...a.variants.map(v => v.sale_price ?? v.price));
          const priceB = Math.min(...b.variants.map(v => v.sale_price ?? v.price));
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        products.sort((a, b) => {
          const priceA = Math.min(...a.variants.map(v => v.sale_price ?? v.price));
          const priceB = Math.min(...b.variants.map(v => v.sale_price ?? v.price));
          return priceB - priceA;
        });
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        products.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    const total = products.length;
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    const paginated = products.slice(offset, offset + limit);

    return {
      products: paginated,
      count: paginated.length,
      total,
      offset,
      limit
    };
  }

  public static getByIdOrHandle(idOrHandle: string): Product | null {
    const product = dbManager.db.products.find(
      p => p.id === idOrHandle || p.handle === idOrHandle
    );
    return product || null;
  }

  public static getCategories(): Category[] {
    return dbManager.db.categories;
  }

  public static getCollections(): Collection[] {
    return dbManager.db.collections;
  }
}
