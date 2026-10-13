import fs from 'fs';
import path from 'path';
import {
  Product,
  Category,
  Collection,
  Cart,
  Order,
  Customer,
  Coupon,
  ProductReview
} from '../types/commerce';
import {
  SEED_CATEGORIES,
  SEED_COLLECTIONS,
  SEED_COUPONS,
  SEED_PRODUCTS,
  SEED_REVIEWS
} from '../data/seedData';
import bcrypt from 'bcryptjs';

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  carts: Cart[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  reviews: ProductReview[];
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Error reading store.json, reinitializing from seed:', err);
    }

    const defaultAdminCustomer: Customer = {
      id: 'cust_admin_ds',
      email: 'admin@dswardrobe.com',
      password_hash: bcrypt.hashSync('admin123', 8),
      first_name: 'DS',
      last_name: 'Admin',
      phone: '+917032932549',
      addresses: [
        {
          first_name: 'DS',
          last_name: 'Wardrobe Studio',
          email: 'admin@dswardrobe.com',
          phone: '+917032932549',
          address_line1: 'Boutique Street, Near Clock Tower',
          city: 'Singarayakonda',
          state: 'Andhra Pradesh',
          postal_code: '523101',
          country: 'India'
        }
      ],
      wishlist: ['prod_aurelia_satin', 'prod_kyra_coord'],
      created_at: new Date().toISOString()
    };

    const initialData: DatabaseSchema = {
      products: SEED_PRODUCTS,
      categories: SEED_CATEGORIES,
      collections: SEED_COLLECTIONS,
      carts: [],
      orders: [],
      customers: [defaultAdminCustomer],
      coupons: SEED_COUPONS,
      reviews: SEED_REVIEWS
    };

    this.saveDirect(initialData);
    return initialData;
  }

  private saveDirect(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public save() {
    this.saveDirect(this.data);
  }

  public get db(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      }
    } catch (err) {
      // fallback to in-memory cache
    }
    return this.data;
  }
}

export const dbManager = new DatabaseManager();
