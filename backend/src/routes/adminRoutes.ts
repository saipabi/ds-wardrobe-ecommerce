import { Router, Request, Response } from 'express';
import { AdminService } from '../services/adminService';
import { OrderService } from '../services/orderService';
import { dbManager } from '../services/db';
import { AuthService } from '../services/authService';

const router = Router();

// Admin Authentication Login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Pre-configured admin check or customer with admin email
  if (email === 'admin@dswardrobe.com' && password === 'admin123') {
    return res.json({
      admin: {
        id: 'admin_master',
        email: 'admin@dswardrobe.com',
        name: 'DS Wardrobe Admin'
      },
      token: 'admin_session_valid_token_2026'
    });
  }

  // Fallback to customer table check
  const { customer, token, error } = AuthService.login(email, password);
  if (error || !customer) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  res.json({
    admin: {
      id: customer.id,
      email: customer.email,
      name: `${customer.first_name} ${customer.last_name}`
    },
    token
  });
});

// Admin Analytics Overview
router.get('/analytics', (_req: Request, res: Response) => {
  try {
    const data = AdminService.getAnalytics();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to retrieve analytics', error: err.message });
  }
});

// Admin Products CRUD
router.get('/products', (_req: Request, res: Response) => {
  res.json({ products: dbManager.db.products });
});

router.post('/products', (req: Request, res: Response) => {
  try {
    const product = AdminService.createProduct(req.body);
    res.status(201).json({ product });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

router.put('/products/:id', (req: Request, res: Response) => {
  try {
    const updated = AdminService.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product: updated });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

router.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const deleted = AdminService.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product removed' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

// Quick Variant Stock Adjustment
router.post('/products/:id/variants/:variant_id/stock', (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: 'quantity number required' });
    }

    const variant = AdminService.updateVariantStock(req.params.id, req.params.variant_id, quantity);
    if (!variant) {
      return res.status(404).json({ message: 'Product or variant not found' });
    }

    res.json({ variant });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update stock', error: err.message });
  }
});

// Admin Orders
router.get('/orders', (_req: Request, res: Response) => {
  res.json({ orders: OrderService.listAll() });
});

router.post('/orders/:id/status', (req: Request, res: Response) => {
  try {
    const { status, location, note } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const order = OrderService.updateFulfillmentStatus(req.params.id, status, location, note);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
});

// Admin Coupons
router.get('/coupons', (_req: Request, res: Response) => {
  res.json({ coupons: dbManager.db.coupons });
});

router.post('/coupons', (req: Request, res: Response) => {
  try {
    const coupon = AdminService.createCoupon(req.body);
    res.status(201).json({ coupon });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create coupon', error: err.message });
  }
});

export default router;
