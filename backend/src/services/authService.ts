import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbManager } from './db';
import { Customer, Address } from '../types/commerce';

const JWT_SECRET = process.env.JWT_SECRET || 'ds_wardrobe_luxury_fashion_secret_key_2026';

export class AuthService {
  public static register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
  }): { customer: Omit<Customer, 'password_hash'> | null; token?: string; error?: string } {
    const emailClean = data.email.toLowerCase().trim();
    const existing = dbManager.db.customers.find(c => c.email.toLowerCase() === emailClean);
    if (existing) {
      return { customer: null, error: 'Account with this email already exists' };
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(data.password, salt);

    const newCustomer: Customer = {
      id: `cust_${uuidv4().replace(/-/g, '').slice(0, 16)}`,
      email: emailClean,
      password_hash,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      phone: data.phone.trim(),
      addresses: [],
      wishlist: [],
      created_at: new Date().toISOString()
    };

    dbManager.db.customers.push(newCustomer);
    dbManager.save();

    const token = jwt.sign({ id: newCustomer.id, email: newCustomer.email }, JWT_SECRET, {
      expiresIn: '30d'
    });

    const { password_hash: _, ...safeCustomer } = newCustomer;
    return { customer: safeCustomer, token };
  }

  public static login(email: string, password: string): {
    customer: Omit<Customer, 'password_hash'> | null;
    token?: string;
    error?: string;
  } {
    const emailClean = email.toLowerCase().trim();
    const customer = dbManager.db.customers.find(c => c.email.toLowerCase() === emailClean);
    if (!customer) {
      return { customer: null, error: 'Invalid email or password' };
    }

    const match = bcrypt.compareSync(password, customer.password_hash);
    if (!match) {
      return { customer: null, error: 'Invalid email or password' };
    }

    const token = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, {
      expiresIn: '30d'
    });

    const { password_hash: _, ...safeCustomer } = customer;
    return { customer: safeCustomer, token };
  }

  public static verifyToken(token: string): { id: string; email: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch {
      return null;
    }
  }

  public static getProfile(customerId: string): Omit<Customer, 'password_hash'> | null {
    const customer = dbManager.db.customers.find(c => c.id === customerId);
    if (!customer) return null;
    const { password_hash: _, ...safeCustomer } = customer;
    return safeCustomer;
  }

  public static toggleWishlist(customerId: string, productId: string): string[] | null {
    const customer = dbManager.db.customers.find(c => c.id === customerId);
    if (!customer) return null;

    const idx = customer.wishlist.indexOf(productId);
    if (idx > -1) {
      customer.wishlist.splice(idx, 1);
    } else {
      customer.wishlist.push(productId);
    }

    dbManager.save();
    return customer.wishlist;
  }

  public static addAddress(customerId: string, address: Address): Address[] | null {
    const customer = dbManager.db.customers.find(c => c.id === customerId);
    if (!customer) return null;

    customer.addresses.push(address);
    dbManager.save();
    return customer.addresses;
  }
}
