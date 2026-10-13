import { Router, Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { CartService } from '../services/cartService';
import { OrderService } from '../services/orderService';
import { AuthService } from '../services/authService';
import { dbManager } from '../services/db';
import { v4 as uuidv4 } from 'uuid';
import { ProductReview } from '../types/commerce';

const router = Router();

// Middleware to extract customer ID from Authorization header
const extractAuth = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = AuthService.verifyToken(token);
    if (decoded) {
      (req as any).customerId = decoded.id;
    }
  }
  next();
};

router.use(extractAuth);

// --- PRODUCTS & TAXONOMIES ---

router.get('/products', (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      collection,
      size,
      color,
      min_price,
      max_price,
      in_stock,
      sort,
      limit,
      offset
    } = req.query;

    const filters = {
      q: q as string,
      category: category as string,
      collection: collection as string,
      size: size as string,
      color: color as string,
      min_price: min_price ? Number(min_price) : undefined,
      max_price: max_price ? Number(max_price) : undefined,
      in_stock: in_stock === 'true',
      sort: sort as any,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0
    };

    const result = ProductService.list(filters);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

router.get('/products/:idOrHandle', (req: Request, res: Response) => {
  try {
    const product = ProductService.getByIdOrHandle(req.params.idOrHandle);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
});

router.get('/categories', (_req: Request, res: Response) => {
  res.json({ categories: ProductService.getCategories() });
});

router.get('/collections', (_req: Request, res: Response) => {
  res.json({ collections: ProductService.getCollections() });
});

// --- CARTS ---

router.post('/carts', (req: Request, res: Response) => {
  try {
    const customerId = (req as any).customerId || req.body.customer_id;
    const email = req.body.email;
    const cart = CartService.createCart(customerId, email);
    res.status(201).json({ cart });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create cart', error: err.message });
  }
});

router.get('/carts/:id', (req: Request, res: Response) => {
  try {
    const cart = CartService.getCart(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ cart });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to retrieve cart', error: err.message });
  }
});

router.post('/carts/:id/line-items', (req: Request, res: Response) => {
  try {
    const { product_id, variant_id, quantity } = req.body;
    if (!product_id || !variant_id) {
      return res.status(400).json({ message: 'product_id and variant_id are required' });
    }

    const { cart, error } = CartService.addItem(
      req.params.id,
      product_id,
      variant_id,
      quantity ? Number(quantity) : 1
    );

    if (error || !cart) {
      return res.status(400).json({ message: error || 'Failed to add item to cart' });
    }

    res.json({ cart });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to add item', error: err.message });
  }
});

router.post('/carts/:id/line-items/:item_id', (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: 'quantity must be a number' });
    }

    const { cart, error } = CartService.updateItemQuantity(
      req.params.id,
      req.params.item_id,
      quantity
    );

    if (error || !cart) {
      return res.status(400).json({ message: error || 'Failed to update item quantity' });
    }

    res.json({ cart });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update item', error: err.message });
  }
});

router.delete('/carts/:id/line-items/:item_id', (req: Request, res: Response) => {
  try {
    const cart = CartService.removeItem(req.params.id, req.params.item_id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ cart });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
});

router.post('/carts/:id/coupons', (req: Request, res: Response) => {
  try {
    const { coupon_code } = req.body;
    if (!coupon_code) {
      return res.status(400).json({ message: 'coupon_code is required' });
    }

    const { cart, error } = CartService.applyCoupon(req.params.id, coupon_code);
    if (error || !cart) {
      return res.status(400).json({ message: error || 'Failed to apply coupon' });
    }

    res.json({ cart });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to apply coupon', error: err.message });
  }
});

router.delete('/carts/:id/coupons', (req: Request, res: Response) => {
  try {
    const cart = CartService.removeCoupon(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ cart });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to remove coupon', error: err.message });
  }
});

router.post('/carts/:id/shipping', (req: Request, res: Response) => {
  try {
    const { shipping_method_id } = req.body;
    const cart = CartService.setShipping(req.params.id, shipping_method_id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ cart });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update shipping', error: err.message });
  }
});

// --- CHECKOUT & ORDERS ---

router.post('/checkout', (req: Request, res: Response) => {
  try {
    const {
      cart_id,
      email,
      phone,
      shipping_address,
      payment_method,
      payment_id,
      notes
    } = req.body;

    if (!cart_id || !email || !phone || !shipping_address) {
      return res.status(400).json({
        message: 'cart_id, email, phone, and complete shipping_address are required'
      });
    }

    if (!shipping_address.address_line1 || !shipping_address.city || !shipping_address.postal_code) {
      return res.status(400).json({
        message: 'Shipping address must include address_line1, city, state, and postal_code'
      });
    }

    const customerId = (req as any).customerId || null;

    const { order, error } = OrderService.createOrder({
      cart_id,
      customer_id: customerId,
      email,
      phone,
      shipping_address,
      payment_method: payment_method || 'upi',
      payment_id,
      notes
    });

    if (error || !order) {
      return res.status(400).json({ message: error || 'Order creation failed' });
    }

    res.status(201).json({ order });
  } catch (err: any) {
    res.status(500).json({ message: 'Checkout execution failed', error: err.message });
  }
});

router.get('/orders/:id', (req: Request, res: Response) => {
  try {
    const order = OrderService.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
});

router.get('/orders/track/:display_id', (req: Request, res: Response) => {
  try {
    const order = OrderService.getByDisplayId(req.params.display_id);
    if (!order) {
      return res.status(404).json({ message: `No active order found with ID: ${req.params.display_id}` });
    }
    res.json({ order });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to track order', error: err.message });
  }
});

// --- AUTHENTICATION & CUSTOMER ACCOUNT ---

router.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;
    if (!email || !password || !first_name || !phone) {
      return res.status(400).json({ message: 'Email, password, first name, and phone are required' });
    }

    const { customer, token, error } = AuthService.register({
      email,
      password,
      first_name,
      last_name: last_name || '',
      phone
    });

    if (error || !customer) {
      return res.status(400).json({ message: error || 'Registration failed' });
    }

    res.status(201).json({ customer, token });
  } catch (err: any) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

router.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { customer, token, error } = AuthService.login(email, password);
    if (error || !customer) {
      return res.status(401).json({ message: error || 'Invalid credentials' });
    }

    res.json({ customer, token });
  } catch (err: any) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

router.get('/auth/me', (req: Request, res: Response) => {
  const customerId = (req as any).customerId;
  if (!customerId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const profile = AuthService.getProfile(customerId);
  if (!profile) {
    return res.status(404).json({ message: 'Customer profile not found' });
  }

  const orders = OrderService.getCustomerOrders(profile.email);
  res.json({ customer: profile, orders });
});

router.post('/auth/wishlist/toggle', (req: Request, res: Response) => {
  const customerId = (req as any).customerId;
  const { product_id } = req.body;

  if (!customerId) {
    return res.status(401).json({ message: 'Please sign in to save items to your wishlist' });
  }
  if (!product_id) {
    return res.status(400).json({ message: 'product_id is required' });
  }

  const wishlist = AuthService.toggleWishlist(customerId, product_id);
  res.json({ wishlist });
});

// --- REVIEWS ---

router.get('/products/:id/reviews', (req: Request, res: Response) => {
  const reviews = dbManager.db.reviews.filter(r => r.product_id === req.params.id);
  res.json({ reviews });
});

router.post('/products/:id/reviews', (req: Request, res: Response) => {
  try {
    const { author_name, rating, headline, comment } = req.body;
    if (!author_name || !rating || !comment) {
      return res.status(400).json({ message: 'author_name, rating, and comment are required' });
    }

    const newReview: ProductReview = {
      id: `rev_${uuidv4().replace(/-/g, '').slice(0, 10)}`,
      product_id: req.params.id,
      author_name,
      rating: Math.min(5, Math.max(1, Number(rating))),
      headline: headline || 'Verified Purchase Review',
      comment,
      verified_buyer: true,
      created_at: new Date().toISOString()
    };

    dbManager.db.reviews.unshift(newReview);

    // Update product rating and reviews count
    const product = dbManager.db.products.find(p => p.id === req.params.id);
    if (product) {
      const allProductReviews = dbManager.db.reviews.filter(r => r.product_id === product.id);
      const avg = allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length;
      product.rating = Math.round(avg * 10) / 10;
      product.reviews_count = allProductReviews.length;
    }

    dbManager.save();
    res.status(201).json({ review: newReview });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to post review', error: err.message });
  }
});

export default router;
